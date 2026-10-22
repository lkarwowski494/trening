// Przeniesienie czystej wersji 1.0 do repo organizacji Apps4Brew — TRYB TYLKO PODGLĄDU (decyzja właściciela 21.10.2026, docs/46).
// Z `git archive` bieżącego HEAD buduje w katalogu tymczasowym drzewo czystego repo, stosuje listę z scripts/przeniesienie-1.0.json
// (ścieżka / akcja / powód), uruchamia strażnik nazw innych firm (tests/forbidden-names.json) na wyniku i wypisuje raport:
// ile plików zostaje, co usunięto, które nazwy zostały, które testy i skrypty odwołują się do usuniętych plików.
// NIC nie wypycha, nie tworzy repo ani commitu; nie dotyka drzewa roboczego (tylko katalog tymczasowy).
// Użycie: node scripts/przeniesienie-1.0.mjs [--lista=<plik>] [--decyzje=zostaw|usun] [--zachowaj] [--json] [--testy[=<wzorzec>]]
//   --decyzje=zostaw (domyślnie) pozycje „decyzja” zostają; =usun usuwa je (wariant „wszystko co nieustalone znika”).
//   --zachowaj  nie kasuje katalogu tymczasowego (drzewo/ i na-dysk/ do obejrzenia); wypisuje jego ścieżkę.
//   --testy     uruchamia Jest w zbudowanym drzewie (node_modules podlinkowane z repo) — ostateczny dowód, które testy padają.
// Czysta logika (lista → plan, strażnik nazw, odwołania) jest eksportowana i testowana w tests/przeniesienie-1.0.test.ts.
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const AKCJE = ['zostaje', 'usun', 'dysk', 'decyzja', 'popraw'];
const TEKST = /\.(ts|tsx|js|mjs|cjs|json|ya?ml|py|sh|swift|m|mm|h|html|md|txt|plist|strings|xml|css|csv|podspec|kt|gradle)$/;
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Sprawdza listę: poprawne akcje, powód, brak powtórzeń. Zwraca listę błędów (pustą, gdy poprawna). */
export function sprawdzListe(lista) {
  const bledy = [];
  const wpisy = lista?.wpisy;
  if (!Array.isArray(wpisy) || wpisy.length === 0) return ['lista nie ma wpisów'];
  const widziane = new Set();
  for (const w of wpisy) {
    if (!w || typeof w.sciezka !== 'string' || !w.sciezka) { bledy.push(`wpis bez ścieżki: ${JSON.stringify(w)}`); continue; }
    if (!AKCJE.includes(w.akcja)) bledy.push(`${w.sciezka}: nieznana akcja „${w.akcja}”`);
    if (typeof w.powod !== 'string' || w.powod.trim().length < 10) bledy.push(`${w.sciezka}: brak powodu (min. 10 znaków)`);
    if (w.sciezka.startsWith('/') || w.sciezka.includes('..')) bledy.push(`${w.sciezka}: ścieżka musi być względna`);
    if (widziane.has(w.sciezka)) bledy.push(`${w.sciezka}: powtórzony wpis`);
    widziane.add(w.sciezka);
  }
  return bledy;
}

/** Wpis obejmujący plik: dokładna ścieżka albo katalog (ukośnik na końcu); wygrywa najdłuższa ścieżka. */
export function wpisDla(plik, wpisy) {
  let best;
  for (const w of wpisy) {
    const ok = w.sciezka.endsWith('/') ? plik.startsWith(w.sciezka) : plik === w.sciezka;
    if (ok && (!best || w.sciezka.length > best.sciezka.length)) best = w;
  }
  return best;
}

/**
 * Lista + zbiór plików → plan. decyzje: 'zostaw' (domyślnie) albo 'usun' — los pozycji „decyzja”.
 * Zwraca: zostaje[], usuniete[{plik,akcja,powod}], naDysk[], decyzje[], popraw[], wpisyBezPlikow[] (wpis nie pasuje do żadnego pliku).
 */
export function zbudujPlan(pliki, lista, { decyzje = 'zostaw' } = {}) {
  const bledy = sprawdzListe(lista);
  if (bledy.length) throw new Error(`lista przeniesienia niepoprawna:\n- ${bledy.join('\n- ')}`);
  if (!['zostaw', 'usun'].includes(decyzje)) throw new Error(`--decyzje: zostaw albo usun, jest „${decyzje}”`);
  const plan = { zostaje: [], usuniete: [], naDysk: [], decyzje: [], popraw: [], wpisyBezPlikow: [] };
  const uzyte = new Set();
  for (const plik of [...pliki].sort()) {
    const w = wpisDla(plik, lista.wpisy);
    if (w) uzyte.add(w.sciezka);
    const akcja = w ? w.akcja : 'zostaje';
    const info = { plik, akcja, powod: w ? w.powod : '', wpis: w ? w.sciezka : null };
    if (akcja === 'usun') plan.usuniete.push(info);
    else if (akcja === 'dysk') { plan.usuniete.push(info); plan.naDysk.push(info); }
    else if (akcja === 'decyzja') {
      plan.decyzje.push(info);
      if (decyzje === 'usun') plan.usuniete.push({ ...info, akcja: 'decyzja→usun' }); else plan.zostaje.push(plik);
    } else {
      plan.zostaje.push(plik);
      if (akcja === 'popraw') plan.popraw.push(info);
    }
  }
  plan.wpisyBezPlikow = lista.wpisy.filter(w => !uzyte.has(w.sciezka)).map(w => w.sciezka);
  return plan;
}

/** Lista nazw firm: tests/forbidden-names.json → dopasowania takie jak w tests/forbidden-names.ts (całe słowo z polską końcówką). */
export function zrobDopasowania(cfg) {
  const re = (n, f) => new RegExp(`(?<![\\p{L}\\p{N}_])${esc(n)}(?:a|u|ie|iem|owi|y|ów|em|ach)?(?![\\p{L}\\p{N}_])`, f);
  return [...cfg.names.map(n => ({ n, re: re(n, 'u') })), ...cfg.namesAnyCase.map(n => ({ n, re: re(n, 'iu') }))];
}
export const nazwyW = (tekst, dopasowania) => dopasowania.filter(x => x.re.test(tekst)).map(x => x.n);
const pod = (f, p) => f === p || f.startsWith(p.replace(/\/?$/, '/'));
export const wZakresie = (plik, cfg) => cfg.scope.some(s => pod(plik, s));
export const wyjatekDla = (plik, nazwa, cfg) => cfg.exceptions.find(x => (x.name === nazwa || x.name === '*') && pod(plik, x.path));

/**
 * Strażnik nazw na drzewie: pliki = { ścieżka: treść }. Zwraca:
 *  - wZakresie: trafienia w zakresie strażnika (kod, testy, teksty) poza wyjątkami — to BŁĄD przeniesienia,
 *  - zWyjatkiem: trafienia objęte wyjątkiem z forbidden-names.json (klucze katalogu, słowa obce) — dozwolone,
 *  - pozaZakresem: trafienia w dokumentach (docs/ itp.) — strażnik ich nie sprawdza, ale właściciel chce je usunąć,
 *  - nieuzyteWyjatki: wyjątki bez trafienia (po usunięciach wyjątek jest zbędny).
 */
export function straznikNazw(pliki, cfg) {
  const dop = zrobDopasowania(cfg);
  const wyniki = { wZakresie: [], zWyjatkiem: [], pozaZakresem: [], nieuzyteWyjatki: [] };
  const uzyte = new Set();
  for (const [plik, tresc] of Object.entries(pliki)) {
    if (plik === 'tests/forbidden-names.json') continue;
    const nazwy = nazwyW(tresc, dop);
    for (const n of nazwy) {
      if (!wZakresie(plik, cfg)) { wyniki.pozaZakresem.push({ plik, nazwa: n }); continue; }
      const w = wyjatekDla(plik, n, cfg);
      if (w) { uzyte.add(w); wyniki.zWyjatkiem.push({ plik, nazwa: n }); } else wyniki.wZakresie.push({ plik, nazwa: n });
    }
  }
  wyniki.nieuzyteWyjatki = cfg.exceptions.filter(x => !uzyte.has(x)).map(x => `${x.path}: ${x.name}`);
  return wyniki;
}

/** Miękki przegląd bez wielkości liter (strażnik jest wrażliwy na wielkość): nazwy w plikach spoza docs/, bez znanych identyfikatorów. */
export function miekkiPrzeglad(pliki, cfg, { pomin = cfg.exceptions.filter(x => x.path.startsWith('lib/locales/')).map(x => x.name) } = {}) {
  const nazwy = [...cfg.names, ...cfg.namesAnyCase].filter(n => !pomin.includes(n));
  const re = new RegExp(`(?<![\\p{L}\\p{N}_])(${nazwy.map(esc).join('|')})(?![\\p{L}\\p{N}_])`, 'giu');
  const wynik = [];
  for (const [plik, tresc] of Object.entries(pliki)) {
    if (plik.startsWith('docs/') || plik === 'tests/forbidden-names.json') continue;
    const m = new Set(); re.lastIndex = 0; let x;
    while ((x = re.exec(tresc))) m.add(x[1]);
    if (m.size) wynik.push({ plik, nazwy: [...m] });
  }
  return wynik;
}

/**
 * Odwołania do usuniętych plików. zrodla = { ścieżka: treść } (testy, skrypty, workflowy, kod).
 * Wzmianka w cudzysłowie/apostrofie w linii z odczytem (read/exists/join/resolve/readdir) = „czyta”; inna = „wzmianka” (komentarz, opis).
 * Dla pliku docs/NN-nazwa.md liczy się też skrót „docs/NN” w komentarzach — jako wzmianka numerowa (osobny licznik).
 */
export function odwolania(zrodla, usuniete) {
  const wynik = [];
  const czytaRe = /read|exist|join\(|resolve\(|readdir|walk\(|stat/i;
  for (const [plik, tresc] of Object.entries(zrodla)) {
    const linie = tresc.split('\n');
    const czyta = new Set(), wzmianka = new Set();
    for (const u of usuniete) {
      const katalog = u.endsWith('/');
      const baza = u.split('/').pop();
      linie.forEach(l => {
        const pelna = l.includes(u);
        const krotka = !katalog && baza.length > 6 && new RegExp(`['"\`][^'"\`]*${esc(baza)}`).test(l);
        if (!pelna && !krotka) return;
        (czytaRe.test(l) ? czyta : wzmianka).add(u);
      });
    }
    if (czyta.size || wzmianka.size) wynik.push({ plik, czyta: [...czyta].sort(), wzmianka: [...wzmianka].filter(u => !czyta.has(u)).sort() });
  }
  return wynik;
}

// ───────────────────────── część z wejściem/wyjściem ─────────────────────────

function wczytajDrzewo(korzen) {
  const pliki = {};
  const idz = rel => {
    for (const e of readdirSync(join(korzen, rel), { withFileTypes: true })) {
      const p = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) { if (e.name !== '.git' && e.name !== 'node_modules') idz(p); }
      else if (e.isFile() && TEKST.test(e.name) && statSync(join(korzen, p)).size < 4e6) pliki[p] = readFileSync(join(korzen, p), 'utf8');
    }
  };
  idz('');
  return pliki;
}

function wypiszPliki(korzen) {
  const wszystkie = [];
  const idz = rel => {
    for (const e of readdirSync(join(korzen, rel), { withFileTypes: true })) {
      const p = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) idz(p); else wszystkie.push(p);
    }
  };
  idz('');
  return wszystkie;
}

export function raport(plan, straznik, miekki, odw, ostrzezenia = []) {
  const L = [];
  const pokaz = (naglowek, tab, f) => { L.push(`\n== ${naglowek} (${tab.length}) ==`); tab.slice(0, 80).forEach(x => L.push(`  ${f(x)}`)); if (tab.length > 80) L.push(`  … i ${tab.length - 80} więcej`); };
  const lacznie = plan.zostaje.length + plan.usuniete.length;
  L.push('PODGLĄD PRZENIESIENIA 1.0 (nic nie wypchnięto, nic nie utworzono na GitHubie)');
  L.push(`Plików w HEAD: ${lacznie}; zostaje w czystym repo: ${plan.zostaje.length}; usunięte: ${plan.usuniete.length} (w tym na Dysk: ${plan.naDysk.length}); pozycje „decyzja”: ${plan.decyzje.length}; „popraw” (zostają, do ręcznej zmiany): ${plan.popraw.length}`);
  const grupy = {};
  for (const u of plan.usuniete) grupy[u.wpis] = (grupy[u.wpis] || 0) + 1;
  pokaz('USUNIĘTE wg pozycji listy', Object.entries(grupy), ([w, n]) => `${String(n).padStart(4)}  ${w}`);
  pokaz('NA DYSK (kopia dla właściciela, w podglądzie: na-dysk/)', plan.naDysk, x => x.plik);
  pokaz('DECYZJA WŁAŚCICIELA (domyślnie zostają)', plan.decyzje, x => `${x.plik}  [${x.wpis}]`);
  pokaz('DO POPRAWY RĘCZNEJ przed przeniesieniem', plan.popraw, x => `${x.plik} — ${x.powod}`);
  if (plan.wpisyBezPlikow.length) pokaz('WPISY LISTY BEZ PLIKU (literówka albo plik, którego jeszcze nie ma)', plan.wpisyBezPlikow, x => x);
  pokaz('NAZWY FIRM W ZAKRESIE STRAŻNIKA, poza wyjątkami (BŁĄD — musi być 0)', straznik.wZakresie, x => `${x.plik}: ${x.nazwa}`);
  const wyjGrup = {};
  for (const x of straznik.zWyjatkiem) (wyjGrup[x.plik] ||= new Set()).add(x.nazwa);
  pokaz('NAZWY OBJĘTE WYJĄTKIEM (klucze katalogu sprzętu, słowa obce) — dozwolone', Object.entries(wyjGrup), ([p, n]) => `${p}: ${[...n].join(', ')}`);
  const poza = {};
  for (const x of straznik.pozaZakresem) (poza[x.plik] ||= new Set()).add(x.nazwa);
  pokaz('NAZWY W DOKUMENTACH PO USUNIĘCIACH (poza zakresem strażnika — do ręcznej poprawy)', Object.entries(poza), ([p, n]) => `${p}: ${[...n].join(', ')}`);
  pokaz('WYJĄTKI STRAŻNIKA, KTÓRE PO USUNIĘCIACH STAŁY SIĘ ZBĘDNE (test „każdy wyjątek potrzebny” padnie)', straznik.nieuzyteWyjatki, x => x);
  pokaz('MIĘKKI PRZEGLĄD BEZ WIELKOŚCI LITER (kod, testy, strony; identyfikatory typu id protokołu są dozwolone, resztę ocenić)', miekki, x => `${x.plik}: ${x.nazwy.join(', ')}`);
  pokaz('TESTY I SKRYPTY CZYTAJĄCE USUNIĘTE PLIKI (zmienić albo usunąć przed przeniesieniem)', odw.filter(o => o.czyta.length), o => `${o.plik} → ${o.czyta.join(', ')}`);
  pokaz('TESTY I SKRYPTY Z WZMIANKĄ (komentarz/opis) O USUNIĘTYCH PLIKACH (poprawić odwołania, nie psują testów)', odw.filter(o => o.wzmianka.length && !o.czyta.length), o => `${o.plik} → ${o.wzmianka.join(', ')}`);
  ostrzezenia.forEach(o => L.push(`\nUWAGA: ${o}`));
  return L.join('\n');
}

function main() {
  const korzen = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const args = process.argv.slice(2);
  const opt = (nazwa, def) => { const a = args.find(x => x === `--${nazwa}` || x.startsWith(`--${nazwa}=`)); return a === undefined ? def : (a.includes('=') ? a.split('=').slice(1).join('=') : true); };
  const listaSciezka = resolve(korzen, opt('lista', 'scripts/przeniesienie-1.0.json'));
  const decyzje = opt('decyzje', 'zostaw');
  const lista = JSON.parse(readFileSync(listaSciezka, 'utf8'));
  const cfg = JSON.parse(readFileSync(join(korzen, 'tests/forbidden-names.json'), 'utf8'));

  const tmp = mkdtempSync(join(tmpdir(), 'przeniesienie-1.0-'));
  const drzewo = join(tmp, 'drzewo');
  const naDysk = join(tmp, 'na-dysk');
  mkdirSync(drzewo); mkdirSync(naDysk);
  try {
    const arch = spawnSync('git', ['archive', 'HEAD'], { cwd: korzen, maxBuffer: 1 << 30 });
    if (arch.status !== 0) throw new Error(`git archive: ${arch.stderr}`);
    const tar = spawnSync('tar', ['-x', '-C', drzewo], { input: arch.stdout });
    if (tar.status !== 0) throw new Error(`tar: ${tar.stderr}`);

    const plan = zbudujPlan(wypiszPliki(drzewo), lista, { decyzje });
    for (const x of plan.naDysk) { mkdirSync(dirname(join(naDysk, x.plik)), { recursive: true }); cpSync(join(drzewo, x.plik), join(naDysk, x.plik)); }
    for (const x of plan.usuniete) rmSync(join(drzewo, x.plik), { force: true });

    const pliki = wczytajDrzewo(drzewo);
    const straznik = straznikNazw(pliki, cfg);
    const miekki = miekkiPrzeglad(pliki, cfg);
    const zrodla = Object.fromEntries(Object.entries(pliki).filter(([p]) => /^(tests|scripts|\.github|lib|app|components|modules|plugins|targets|\.maestro)\//.test(p) || p === 'package.json'));
    const odw = odwolania(zrodla, plan.usuniete.map(x => x.plik).concat(lista.wpisy.filter(w => w.sciezka.endsWith('/') && ['usun', 'dysk'].includes(w.akcja)).map(w => w.sciezka)));
    const ostrzezenia = [];
    if (decyzje === 'zostaw' && plan.decyzje.length) ostrzezenia.push(`${plan.decyzje.length} plików czeka na decyzję właściciela (zostają w podglądzie); sprawdź wariant: --decyzje=usun`);

    if (opt('json', false)) {
      console.log(JSON.stringify({ zostaje: plan.zostaje.length, usuniete: plan.usuniete.length, naDysk: plan.naDysk.length, decyzje: plan.decyzje.length, popraw: plan.popraw.length, straznik, miekki, odwolania: odw }, null, 1));
    } else console.log(raport(plan, straznik, miekki, odw, ostrzezenia));

    const testy = opt('testy', false);
    if (testy) {
      const nm = join(korzen, 'node_modules');
      if (!existsSync(join(drzewo, 'node_modules')) && existsSync(nm)) symlinkSync(nm, join(drzewo, 'node_modules'));
      const wzor = typeof testy === 'string' ? [testy] : [];
      console.log('\n== Jest w zbudowanym drzewie ==');
      const r = spawnSync('npx', ['jest', '--silent', '--ci', ...wzor], { cwd: drzewo, stdio: 'inherit' });
      console.log(`Jest: kod wyjścia ${r.status}`);
    }
    if (opt('zachowaj', false)) console.log(`\nDrzewo podglądu: ${drzewo}\nDo Dysku:        ${naDysk}`);
    return opt('zachowaj', false) ? null : tmp;
  } catch (e) {
    rmSync(tmp, { recursive: true, force: true });
    throw e;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const doSkasowania = main();
    if (doSkasowania) rmSync(doSkasowania, { recursive: true, force: true });
  } catch (e) {
    console.error(String(e.message || e));
    process.exit(1);
  }
}
