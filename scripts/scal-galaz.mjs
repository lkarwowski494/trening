// Scalanie gałęzi z kodem tylko przy zielonym tests.yml (L-090, wariant A, decyzja właściciela 02.11.2026).
//   node scripts/scal-galaz.mjs <gałąź-źródłowa> [--do <gałąź-docelowa>]
// Pobiera SHA głowy origin/<gałąź>, czyta przebiegi workflowu tests.yml dla tego SHA publicznym API Actions (bez tokenu) i:
//   success → `git merge --no-ff origin/<gałąź>` na bieżącej gałęzi (musi być równa docelowej; drzewo czyste),
//   w toku  → komunikat, kod 3 (bez scalenia; ponów po zakończeniu przebiegu),
//   failure / cancelled / brak przebiegu → odmowa (kod 1) z powodem.
// Wyjątek (decyzja techniczna wg CLAUDE.md: „commit tylko z dokumentami” = verify:docs): gdy wszystkie zmiany gałęzi względem wspólnego przodka
// z docelową to dokumenty (reguła scripts/dokumenty.mjs), scalenie nie czeka na tests.yml. Gałąź z wcześniejszym kodem NIE jest „samymi dokumentami”
// — liczy się diff od wspólnego przodka z docelową, nie tylko ostatni commit (L-080). Wiele przebiegów dla SHA → najnowszy tests.yml.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { jestDokumentem } from './dokumenty.mjs';

export const REPO = 'lkarwowski494/trening';
export const WORKFLOW = 'tests.yml';
export const DOMYSLNE_DOCELOWE = ['integracja-1-1', 'main'];
export const KOD = { OK: 0, ODMOWA: 1, UZYCIE: 2, W_TOKU: 3 };

const API = () => process.env.SCAL_API_BAZA || 'https://api.github.com'; /* SCAL_API_BAZA: tylko testy (lokalny serwer zamiast sieci) */
const urlPrzebiegow = (repo, sha) => `${API()}/repos/${repo}/actions/runs?head_sha=${sha}&per_page=100`;
const zGita = (cwd) => (...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const domyslnyFetch = async (url) => {
  const r = await fetch(url, { headers: { accept: 'application/vnd.github+json', 'user-agent': 'scal-galaz' } });
  if (!r.ok) throw new Error(`API Actions: HTTP ${r.status}`);
  return r.json();
};

const znacznikPelny = (cwd) => (sha) => {
  try { execFileSync(process.execPath, [fileURLToPath(new URL('./verify-znacznik.mjs', import.meta.url)), '--sprawdz', sha, '--wymagaj', 'pelne'], { cwd, stdio: 'ignore' }); return true; } catch { return false; }
};

/** Najnowszy przebieg tests.yml z listy przebiegów API (po created_at, remis: run_number). */
export function najnowszyTests(runy) {
  const tests = (runy ?? []).filter(r => (r.path ?? '').split('@')[0].endsWith(`/${WORKFLOW}`) || r.path === WORKFLOW);
  return tests.sort((a, b) => (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0) || (b.run_number ?? 0) - (a.run_number ?? 0))[0] ?? null;
}

/** Ocena przebiegu: { ok } | { wToku } | { powod }. */
export function ocen(run) {
  if (!run) return { powod: `brak przebiegu ${WORKFLOW} dla tego SHA (poczekaj na start CI albo wypchnij gałąź)` };
  if (run.status !== 'completed') return { wToku: `${WORKFLOW} jeszcze trwa (status: ${run.status}, przebieg ${run.id})` };
  if (run.conclusion === 'success') return { ok: true };
  return { powod: `${WORKFLOW} zakończony wynikiem „${run.conclusion}” (przebieg ${run.id}) — napraw gałąź źródłową` };
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

  const poz = []; let docelowa = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--do') docelowa = argv[++i] ?? null; else poz.push(argv[i]);
  }
  if (poz.length !== 1 || !poz[0] || poz[0].startsWith('-') || (argv.includes('--do') && !docelowa)) {
    log('użycie: node scripts/scal-galaz.mjs <gałąź-źródłowa> [--do <gałąź-docelowa>]'); return KOD.UZYCIE;
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
  catch (e) { log(`merge nie powiódł się (konflikt?): ${e.message}\nPrzerwij: git merge --abort`); return KOD.ODMOWA; }
  log(`scalono origin/${zrodlo} (${sha.slice(0, 8)}) do ${biezaca}: ${opis}`);
  return KOD.OK;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = await scal(process.argv.slice(2));
}
