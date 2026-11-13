// Scalanie gałęzi z kodem tylko przy zielonym tests.yml (L-090, wariant A, decyzja właściciela 02.11.2026).
//   node scripts/scal-galaz.mjs <gałąź-źródłowa> [--do <gałąź-docelowa>] [--zostaw-worktree]
// Po udanym scaleniu usuwa czysty worktree gałęzi źródłowej (L-105; --zostaw-worktree wyłącza).
// Konflikty scalenia: tylko w plikach generowanych (ZB-041 G1) i w docs/18, docs/40 (L-120, 08.11.2026: suma wpisów obu stron, scripts/scal-dokumenty.mjs); każdy inny — odmowa.
// Pobiera SHA głowy origin/<gałąź>, czyta przebiegi workflowu tests.yml dla tego SHA publicznym API Actions (bez tokenu) i:
//   success → `git merge --no-ff origin/<gałąź>` na bieżącej gałęzi (musi być równa docelowej; drzewo czyste),
//   w toku  → komunikat, kod 3 (bez scalenia; ponów po zakończeniu przebiegu),
//   failure / cancelled / brak przebiegu → odmowa (kod 1) z powodem.
// Wyjątek (decyzja techniczna wg CLAUDE.md: „commit tylko z dokumentami” = verify:docs): gdy wszystkie zmiany gałęzi względem wspólnego przodka
// z docelową to dokumenty (reguła scripts/dokumenty.mjs), scalenie nie czeka na tests.yml. Gałąź z wcześniejszym kodem NIE jest „samymi dokumentami”
// — liczy się diff od wspólnego przodka z docelową, nie tylko ostatni commit (L-080). Wiele przebiegów dla SHA → najnowszy tests.yml.
import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readFileSync, realpathSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jestDokumentem } from './dokumenty.mjs';
import { generowane } from './pliki-generowane.mjs';
import { DOKUMENTY_LACZONE, polaczWpisy } from './scal-dokumenty.mjs';
import { REPO, WORKFLOW, najnowszyTests, ocen, urlPrzebiegow, domyslnyFetch } from './ci-wynik.mjs';
import { jestGlowny } from './modul-glowny.mjs';

export { REPO, WORKFLOW, najnowszyTests, ocen };
export const DOMYSLNE_DOCELOWE = ['integracja-1-1', 'main'];
export const KOD = { OK: 0, ODMOWA: 1, UZYCIE: 2, W_TOKU: 3 };

const zGita = (cwd) => (...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const znacznikPelny = (cwd) => (sha) => {
  try { execFileSync(process.execPath, [fileURLToPath(new URL('./verify-znacznik.mjs', import.meta.url)), '--sprawdz', sha, '--wymagaj', 'pelne'], { cwd, stdio: 'ignore' }); return true; } catch { return false; }
};

/**
 * Konflikty tylko w plikach generowanych (wersja docelowa + generatory) i w docs/18, docs/40 (suma wpisów obu stron — scripts/scal-dokumenty.mjs; L-120, 08.11.2026), `git add`.
 * Zwraca { generowane, dokumenty: [{ plik, wpisy }] } albo null (inny konflikt, brak konfliktu, konflikt wewnątrz wpisu, błąd generatora).
 */
function rozwiazKonflikty(git, cwd, log) {
  let konflikty;
  try { konflikty = git('diff', '--name-only', '--diff-filter=U').split('\n').filter(Boolean); } catch { return null; }
  const lista = generowane(); const znane = new Set(lista.map(g => g.plik));
  if (!konflikty.length || konflikty.some(f => !znane.has(f) && !DOKUMENTY_LACZONE.includes(f))) return null;
  const dokumenty = [];
  try {
    for (const f of konflikty.filter(f => DOKUMENTY_LACZONE.includes(f))) {
      git('checkout', '--conflict=diff3', '-m', '--', f);
      const w = polaczWpisy(f, readFileSync(join(cwd ?? '.', f), 'utf8'));
      if (!w) { log(`konflikt w ${f} dotyczy tego samego wpisu albo nie jest dopisaniem pełnych wpisów — nie łączę`); return null; }
      writeFileSync(join(cwd ?? '.', f), w.tekst); git('add', '--', f); dokumenty.push({ plik: f, wpisy: w.wpisy });
    }
    const generowaneKonflikty = konflikty.filter(f => znane.has(f));
    for (const f of generowaneKonflikty) { git('checkout', '--ours', '--', f); git('add', '--', f); }
    const polecenia = [...new Map(lista.map(g => [g.polecenie.join('\u0000'), g.polecenie])).values()];
    for (const [cmd, ...a] of polecenia) execFileSync(cmd === 'node' ? process.execPath : cmd, a, { cwd, stdio: ['ignore', 'ignore', 'pipe'] });
    for (const g of lista) if (existsSync(join(cwd ?? '.', g.plik))) git('add', '--', g.plik);
    if (git('diff', '--name-only', '--diff-filter=U')) return null;
    return { generowane: generowaneKonflikty, dokumenty };
  } catch (e) { log(`generator nie przeliczył plików generowanych albo konflikt dokumentów nie dał się połączyć: ${String(e.stderr ?? e.message).split('\n')[0]}`); return null; }
}

/** Ścieżka worktree z wyewidencjonowaną gałęzią albo null (`git worktree list --porcelain`). */
export function sciezkaWorktree(git, galaz) {
  let blok = [];
  for (const l of [...git('worktree', 'list', '--porcelain').split('\n'), '']) {
    if (l) { blok.push(l); continue; }
    if (blok.includes(`branch refs/heads/${galaz}`)) return blok[0].replace(/^worktree /, '');
    blok = [];
  }
  return null;
}

/**
 * L-105 (wariant A, 04.11.2026): po udanym scaleniu usuwa CZYSTY worktree scalonej gałęzi (dysk kontenera). Nie usuwa worktree bieżącego katalogu ani brudnego
 * (komunikat). `node_modules` będący dowiązaniem jest usuwany jako dowiązanie — cel nietknięty. Nigdy nie zmienia kodu wyjścia scalenia.
 * @returns {string} 'usunieto' | 'brak' | 'biezacy' | 'brudny' | 'blad'
 */
export function sprzatnijWorktree(git, galaz, cwd, log) {
  try {
    const wt = sciezkaWorktree(git, galaz);
    if (!wt || !existsSync(wt)) return 'brak';
    if (realpathSync(wt) === realpathSync(resolve(cwd ?? '.', git('rev-parse', '--show-toplevel')))) return 'biezacy';
    const nm = join(wt, 'node_modules');
    let dowiazanie = false;
    try { dowiazanie = lstatSync(nm).isSymbolicLink(); } catch { /* brak node_modules */ }
    const wGicie = git('-C', wt, 'status', '--porcelain').split('\n').filter(Boolean).filter(l => !(dowiazanie && l.slice(3).replace(/\/$/, '') === 'node_modules'));
    if (wGicie.length) { log(`worktree ${wt} ma zmiany albo pliki nieśledzone (${wGicie.length}) — zostawiam; usuń ręcznie: git worktree remove ${wt}`); return 'brudny'; }
    if (dowiazanie) unlinkSync(nm);
    git('worktree', 'remove', '--force', wt);
    log(`usunięto worktree scalonej gałęzi: ${wt}`); return 'usunieto';
  } catch (e) { log(`nie usunięto worktree gałęzi ${galaz}: ${String(e.message).split('\n')[0]}`); return 'blad'; }
}

/**
 * @param {string[]} argv
 * @param {{ git?: Function, fetchJson?: Function, repo?: string, cwd?: string, log?: Function }} deps
 * @returns {Promise<number>} kod wyjścia
 */
export async function scal(argv, deps = {}) {
  const log = deps.log ?? ((m) => console.error(`scal-galaz: ${m}`));
  const git = deps.git ?? zGita(deps.cwd);
  const fetchJson = deps.fetchJson ?? domyslnyFetch;
  const repo = deps.repo ?? REPO;

  const poz = []; let docelowa = null; let zostaw = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--do') docelowa = argv[++i] ?? null; else if (argv[i] === '--zostaw-worktree') zostaw = true; else poz.push(argv[i]);
  }
  if (poz.length !== 1 || !poz[0] || poz[0].startsWith('-') || (argv.includes('--do') && !docelowa)) {
    log('użycie: node scripts/scal-galaz.mjs <gałąź-źródłowa> [--do <gałąź-docelowa>] [--zostaw-worktree]'); return KOD.UZYCIE;
  }
  const zrodlo = poz[0];

  let biezaca;
  try { biezaca = git('rev-parse', '--abbrev-ref', 'HEAD'); } catch (e) { log(`nie czytam bieżącej gałęzi: ${e.message}`); return KOD.ODMOWA; }
  if (docelowa ? biezaca !== docelowa : !DOMYSLNE_DOCELOWE.includes(biezaca)) {
    log(docelowa ? `bieżąca gałąź to „${biezaca}”, a docelowa „${docelowa}” — przełącz się (git switch ${docelowa}) i ponów`
      : `bieżąca gałąź „${biezaca}” nie jest docelową (${DOMYSLNE_DOCELOWE.join(', ')}); przełącz się albo podaj --do ${biezaca}`);
    return KOD.ODMOWA;
  }
  if (zrodlo === biezaca) { log('gałąź źródłowa jest gałęzią docelową'); return KOD.ODMOWA; }
  if (git('status', '--porcelain')) { log('drzewo robocze nie jest czyste (zmiany albo nieśledzone pliki) — zatwierdź lub schowaj i ponów'); return KOD.ODMOWA; }

  let sha;
  try { git('fetch', 'origin', zrodlo, '--no-tags'); sha = git('rev-parse', `origin/${zrodlo}`); }
  catch (e) { log(`nie pobrano origin/${zrodlo}: ${e.message}`); return KOD.ODMOWA; }

  let zmiany = null;
  try {
    const baza = git('merge-base', 'HEAD', `origin/${zrodlo}`);
    zmiany = git('diff', '--name-only', baza, `origin/${zrodlo}`).split('\n').filter(Boolean);
  } catch (e) { log(`nie liczę zmian względem ${biezaca}: ${e.message}`); return KOD.ODMOWA; }

  const wiadomosc = (ci) => `Merge ${zrodlo} do ${biezaca} (${ci}; SHA ${sha.slice(0, 8)})`;
  let opis;
  if (zmiany.length && zmiany.every(jestDokumentem)) {
    opis = `${WORKFLOW} pominięty: same dokumenty (${zmiany.length}), wystarcza verify:docs`;
    log(opis);
  } else {
    // Decyzja właściciela 03.11.2026 (wariant A): do main wchodzi tylko stan z lokalnym PEŁNYM verify (znacznik „pelne”); do integracja-* wystarcza zielone CI.
    if (docelowa === 'main' && !(deps.znacznikPelny ?? znacznikPelny(deps.cwd))(sha)) {
      log(`ODMOWA: scalenie do main wymaga pełnego npm run verify dla ${sha.slice(0, 8)} (znacznik „pelne”, scripts/verify-znacznik.mjs; uruchom w worktree gałęzi, potem ponów)`); return KOD.ODMOWA;
    }
    let runy;
    try { runy = (await fetchJson(urlPrzebiegow(repo, sha))).workflow_runs; }
    catch (e) { log(`nie odczytano przebiegów CI: ${e.message}`); return KOD.ODMOWA; }
    const run = najnowszyTests(runy);
    const o = ocen(run);
    if (o.wToku) { log(`${o.wToku} — bez scalenia, ponów po zakończeniu`); return KOD.W_TOKU; }
    if (!o.ok) { log(`ODMOWA: ${o.powod}`); return KOD.ODMOWA; }
    opis = `${WORKFLOW} zielony, przebieg ${run.id}`;
  }
  try { git('merge', '--no-ff', '-m', wiadomosc(opis), `origin/${zrodlo}`); }
  catch (e) {
    /* ZB-041 G1 (04.11.2026): konflikt wyłącznie w plikach generowanych → wersja docelowa + generatory; L-120 (08.11.2026): także docs/18 i docs/40 — suma wpisów obu stron; inaczej przerwanie scalenia */
    const r = rozwiazKonflikty(git, deps.cwd, log);
    if (!r) { try { git('merge', '--abort'); } catch { /* scalenie mogło nie wystartować */ } log(`merge nie powiódł się (konflikt?): ${e.message.split('\n')[0]}\nScalenie przerwane (git merge --abort); drzewo bez zmian.`); return KOD.ODMOWA; }
    const czesci = [];
    if (r.dokumenty.length) czesci.push(`konflikt w dokumentach rozwiązany jako suma wpisów (${r.dokumenty.map(d => `${d.plik}: ${d.wpisy}`).join(', ')})`);
    if (r.generowane.length) czesci.push(`pliki generowane przeliczone: ${r.generowane.join(', ')}`);
    if (!czesci.length) czesci.push('pliki generowane przeliczone');
    try { git('commit', '-m', `${wiadomosc(opis)}; ${czesci.join('; ')}`); }
    catch (e2) { try { git('merge', '--abort'); } catch { /* nic */ } log(`nie zatwierdzono scalenia: ${e2.message.split('\n')[0]}`); return KOD.ODMOWA; }
    opis += `; ${czesci.join('; ')}`;
  }
  log(`scalono origin/${zrodlo} (${sha.slice(0, 8)}) do ${biezaca}: ${opis}`);
  if (!zostaw) sprzatnijWorktree(git, zrodlo, deps.cwd, log);
  return KOD.OK;
}

if (jestGlowny(import.meta.url)) {
  process.exitCode = await scal(process.argv.slice(2));
}
