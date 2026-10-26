// Walidator kontraktu danych rodziny figur v2 (docs/50, rozdz. 10). Dwa zastosowania:
//  1) biblioteka dla pilotażu zewnętrznego generatora (scripts/figures/gemini-pozy.mjs ładuje ją dynamicznie): schematPozy, opisKontraktu, waliduj, przyklad, zastosuj;
//  2) CLI:  node scripts/figures/v2-validate.mjs <plik.json> [--rodzina pull_up] [--cwiczenie "Pull Up"] [--podglad <katalog>] [--theme light|dark]
//           node scripts/figures/v2-validate.mjs --schema --write | --check   (docs/schemas/figury-v2-poza.schema.json, generowany z lib/figures/v2/contract.ts)
// Plik: pojedyncza poza (obiekt kontraktu) albo wynik pilotażu {rodzina, poze: {ćwiczenie: poza}}. Kod wyjścia: 0 = poprawne, 1 = błędy, 2 = użycie.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { loadV2 } from './v2-build.mjs';
import { sprawdzSens, izometryczne, grupaBledu, wczytajSens, regulyDla } from './v2-sens.mjs';
import { sprawdzJakosc, wczytajTeksty, GRUPY_POSTAWY, wierszeWJednejLinii } from './v2-jakosc.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SCHEMA_FILE = 'docs/schemas/figury-v2-poza.schema.json';
const POSES_DIR = 'lib/figures/v2/poses';
const czytaj = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

let cache = null;
/** Silnik v2 (transpilacja do katalogu tymczasowego, raz na proces). */
function silnik() {
  if (!cache) { const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'v2validate-')); cache = loadV2(dir); process.on('exit', () => { try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* sprzątanie best effort */ } }); }
  return cache;
}
/** Granice zakresów stawów (docs/research/28, lib/figures/data.json → rom). */
const rom = (root = ROOT) => czytaj(path.join(root, 'lib/figures/data.json')).rom;

/** Identyfikatory wskazówek „częsty błąd” ćwiczenia: zestaw ogólny (cue-sets.json → err) albo własne wskazówki (lib/cues/data.json → mistakes). */
export function bledyCwiczenia(cwiczenie, root = ROOT) {
  const set = czytaj(path.join(root, 'lib/figures/v2/cue-sets.json')).items?.[cwiczenie];
  if (!set || set.b === 'open') return [];
  if (set.b === 'own') return (czytaj(path.join(root, 'lib/cues/data.json')).exercises?.[cwiczenie]?.mistakes ?? []).map((m) => m.c);
  return set.err ?? [];
}

/* ---------- interfejs pilotażu ---------- */
/** JSON Schema odpowiedzi dla rodziny. */
export function schematPozy(rodzina, zakres) { return silnik().v2.poseSchema(rodzina, zakres); }
/** Tekst kontraktu do promptu. */
export function opisKontraktu(rodzina, zakres) { return silnik().v2.describeContract(rodzina, zakres); }
/** Walidacja: schemat + geometria + zakresy + ciągłość + błędy jako delty. Wynik { ok, bledy: [{ kod, szczegol }] }. */
export function waliduj(poza, { rodzina, cwiczenie, root = ROOT }) {
  /* błędy postawy (grupa inna niż „zakres”): pierwsza klatka błędu NIE musi mieć delty zerowej — błąd jest widoczny w każdej klatce (v2-jakosc: blad_widoczny_stale) */
  const postural = new Set(((poza && poza.bledy) || []).map((b) => b.cue).filter((c) => { const g = grupaBledu(rodzina, c, root); return g && GRUPY_POSTAWY.includes(g); }));
  const bledy = silnik().v2.validatePose(poza, { family: rodzina, exercise: cwiczenie, errorCues: bledyCwiczenia(cwiczenie, root), rom: rom(root), isometric: izometryczne(rodzina, cwiczenie, root) }).filter((b) => !(b.kod === 'blad-start' && [...postural].some((c) => b.szczegol.includes(`„${c}”`))));
  const rigowa = silnik().v2.FAMILIES.find((f) => f.id === rodzina)?.status === 'ready' && !fs.existsSync(path.join(ROOT, POSES_DIR, `${rodzina}.json`)); /* rodziny gotowe z rigu (kod) sprawdza sens-gotowe.mjs na klatkach rigu; rodzina gotowa z DANYCH (poses/<rodzina>.json) ma sens i wymagany sprzęt sprawdzane tu */
  /* wymagany sprzęt ćwiczenia z katalogu (docs/54): poza musi go zawierać (np. wyciąg z bloczkiem wysokim) */
  /* rodziny gotowe z rigu w kodzie (przykłady few-shot z rigów, np. ławka bez wpisu w gearOf) pomijane — wymóg obejmuje pozy generowane */
  if (!bledy.some((b) => ['schemat', 'kontrakt', 'rodzina', 'klatki-u'].includes(b.kod)) && !rigowa) { const req = silnik().catalog?.CATALOG?.[cwiczenie]?.requires; if (req) bledy.push(...silnik().v2.requiredGearIssues(req, poza.sprzet).map((szczegol) => ({ kod: 'sprzet', szczegol }))); }
  /* sens ruchu (docs/53, bramka 3): po przejściu schematu, kontraktu i sprzętu; ewentualny wyjątek obliczeń nie psuje geometrii */
  if (!rigowa && !bledy.some((b) => ['schemat', 'kontrakt', 'rodzina', 'klatki-u', 'sprzet'].includes(b.kod))) {
    try { bledy.push(...sprawdzSens({ v2: silnik().v2, poza, rodzina, cwiczenie, root })); } catch (e) { bledy.push({ kod: 'sens', szczegol: `nie da się ocenić sensu ruchu (${e.message})` }); }
  }
  /* jakość (luki z recenzji ruchu, v2-jakosc.mjs): po przejściu schematu, geometrii i sensu */
  if (!rigowa && !bledy.length) { try { bledy.push(...sprawdzJakosc(poza, { v2: silnik().v2, rodzina, cwiczenie, postural, izometryczne: izometryczne(rodzina, cwiczenie, root), teksty: wczytajTeksty(root), reguly: regulyDla(rodzina, cwiczenie, root), root })); } catch (e) { bledy.push({ kod: 'jakosc', szczegol: `nie da się ocenić jakości pozy (${e.message})` }); } }
  return { ok: bledy.length === 0, bledy };
}
/** Few-shot: gotowa rodzina jako [{ cwiczenie, poza }]; rodzina w planach → [] (wtedy pilotaż używa przykładu przysiadu). */
export function przyklad(rodzina) {
  const { v2 } = silnik();
  const f = v2.FAMILIES.find((x) => x.id === rodzina);
  if (!f || f.status !== 'ready') return [];
  const wzor = { squat: ['Back Squat', { kneesIn: 'sq.mis.kneesIn', heels: 'sq.mis.heels' }], bench_press: ['Bench Press (sztanga)', { arch: 'bp.mis.arch' }], hinge: ['RDL (sztanga)', { kneesBent: 'rdl.knees' }] }[rodzina];
  if (!wzor) return [];
  const cw = wzor[0]; const dopuszczone = bledyCwiczenia(cw);
  const bledy = Object.fromEntries(Object.entries(wzor[1]).filter(([, cue]) => dopuszczone.includes(cue)));
  const poza = v2.exampleFor(cw, bledy);
  return poza ? [{ cwiczenie: cw, poza }] : [];
}
/** Zapis zaakceptowanych póz (po przeglądzie): ponowna walidacja, scalenie z lib/figures/v2/poses/<rodzina>.json. Zwraca { plik, zapisano, odrzucone }. */
export function zastosuj(root, wynik) {
  const rodzina = wynik.rodzina; const zapisano = []; const odrzucone = [];
  const plik = path.join(root, POSES_DIR, `${rodzina}.json`);
  const cur = fs.existsSync(plik) ? czytaj(plik) : { kontrakt: silnik().v2.CONTRACT.id, rodzina, cwiczenia: {} };
  for (const [cw, poza] of Object.entries(wynik.poze ?? {})) {
    const w = waliduj(poza, { rodzina, cwiczenie: cw, root });
    if (w.ok) { cur.cwiczenia[cw] = poza; zapisano.push(cw); } else odrzucone.push({ cwiczenie: cw, bledy: w.bledy });
  }
  if (zapisano.length) { fs.mkdirSync(path.dirname(plik), { recursive: true }); fs.writeFileSync(plik, JSON.stringify(cur, null, 1) + '\n'); }
  return { plik: path.relative(root, plik), zapisano, odrzucone };
}

/* ---------- schemat w repozytorium ---------- */
export const schematRepo = () => JSON.stringify(schematPozy('generic'), null, 1) + '\n';

/* ---------- podgląd (HTML z SVG) ---------- */
/** Szerokość docelowa wiersza podglądu (px): przy wielu klatkach skala rysunku maleje, żeby wiersz mieścił się w obrazie. */
export const PODGLAD_SZEROKOSC = 3000;
/** HTML podglądu pozy: wiersz = poprawna poza / jeden błąd; w wierszu najpierw widok z boku, potem z przodu, po jednej komórce na KAŻDĄ klatkę kluczową (klatki_u pozy) — wszystkie w jednym wierszu (bez zawijania).
 * Zwraca { html, klatki: [u…] (klatki narysowane), wiersze: [etykieta…], px }. */
export function htmlPodgladu(poza, motyw) {
  const { v2, tokens } = silnik(); const pal = v2.figurePalette(tokens[motyw]); const widoki = ['side', 'front']; const warianty = [undefined, ...poza.bledy.map((_, i) => i)];
  const klatki = poza.klatki.map((k) => k.u);
  const boxy = widoki.map((view) => { const listy = []; for (const x of warianty) for (let i = 0; i <= 20; i++) listy.push(v2.dataShapes(poza, i / 20, view, x)); return v2.boundsOf(listy); });
  const suma = boxy.reduce((t, b) => t + b.w, 0) * klatki.length; const px = Math.min(1.5, Math.max(0.5, (PODGLAD_SZEROKOSC - 8 * (klatki.length * widoki.length)) / Math.max(1, suma)));
  const etykiety = warianty.map((w) => (w === undefined ? 'poza poprawna' : 'błąd: ' + poza.bledy[w].cue));
  const wiersze = warianty.map((w, n) => {
    const komorki = widoki.flatMap((view, vi) => klatki.map((u) => `<span class="k" data-u="${u}" data-widok="${view}">${v2.svgDocument(v2.dataShapes(poza, u, view, w), boxy[vi], pal, px)}</span>`));
    return `<div style="font:12px sans-serif;color:${tokens[motyw].text};margin:6px 0 2px">${etykiety[n]}</div><div class="w" data-etykieta="${etykiety[n]}" style="display:flex;flex-wrap:nowrap;gap:8px;align-items:flex-end;width:max-content">${komorki.join('')}</div>`;
  });
  return { html: `<html><body style="margin:0;padding:8px;background:${tokens[motyw].surface}">${wiersze.join('')}</body></html>`, klatki, wiersze: etykiety, px };
}
export function podglad(poza, katalog, motyw) {
  fs.mkdirSync(katalog, { recursive: true }); const { html } = htmlPodgladu(poza, motyw);
  const nazwa = path.join(katalog, `${poza.cwiczenie.replace(/\W+/g, '-')}-${motyw}`);
  fs.writeFileSync(nazwa + '.html', html);
  try {
    const { chromium } = createRequire(import.meta.url)('playwright'); // NODE_PATH=/opt/node-tools/node_modules
    return (async () => {
      const b = await chromium.launch();
      try {
        const p = await b.newPage({ viewport: { width: 1400, height: 700 } }); await p.setContent(html);
        const szer = await p.evaluate(() => document.documentElement.scrollWidth); await p.setViewportSize({ width: Math.max(1400, szer), height: 700 });
        const pomiar = await p.evaluate(() => [...document.querySelectorAll('.w')].map((w) => ({ etykieta: w.dataset.etykieta, dolne: [...w.querySelectorAll('.k')].map((k) => k.getBoundingClientRect().bottom) })));
        const uklad = wierszeWJednejLinii(pomiar); if (uklad.length) throw new Error(`podgląd ${poza.cwiczenie}: ${uklad.join('; ')}`);
        await p.screenshot({ path: nazwa + '.png', fullPage: true });
      } finally { await b.close(); }
      return nazwa + '.png';
    })();
  } catch { return Promise.resolve(nazwa + '.html'); }
}

/* ---------- CLI ---------- */
async function main(argv) {
  const arg = (n) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : undefined; };
  if (argv.includes('--schema')) {
    const plik = path.join(ROOT, SCHEMA_FILE); const tresc = schematRepo();
    if (argv.includes('--write')) { fs.mkdirSync(path.dirname(plik), { recursive: true }); fs.writeFileSync(plik, tresc); console.log(`zapisano ${SCHEMA_FILE}`); return 0; }
    if (argv.includes('--check')) { const ok = fs.existsSync(plik) && fs.readFileSync(plik, 'utf8') === tresc; console.log(ok ? `${SCHEMA_FILE} aktualny` : `${SCHEMA_FILE} nieaktualny — uruchom: node scripts/figures/v2-validate.mjs --schema --write`); return ok ? 0 : 1; }
    console.log(tresc); return 0;
  }
  const plik = argv.find((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--'));
  if (!plik) { console.log('Użycie: node scripts/figures/v2-validate.mjs <plik.json> [--rodzina id] [--cwiczenie "Nazwa"] [--podglad katalog] [--theme light|dark]\n        node scripts/figures/v2-validate.mjs --schema --write | --check'); return 2; }
  const dane = czytaj(path.resolve(plik));
  const lista = dane.poze ? Object.entries(dane.poze).map(([cwiczenie, poza]) => ({ cwiczenie, poza, rodzina: dane.rodzina })) : [{ cwiczenie: arg('cwiczenie') ?? dane.cwiczenie, poza: dane, rodzina: arg('rodzina') ?? dane.rodzina }];
  let zle = 0;
  for (const { cwiczenie, poza, rodzina } of lista) {
    const w = waliduj(poza, { rodzina, cwiczenie });
    console.log(`${w.ok ? 'OK ' : 'NIE'} ${rodzina} / ${cwiczenie}${w.ok ? '' : ` (${w.bledy.length} błędów)`}`);
    for (const b of w.bledy) console.log(`   [${b.kod}] ${b.szczegol}`);
    if (!w.ok) zle++;
    else if (arg('podglad')) console.log('   podgląd:', await podglad(poza, path.resolve(arg('podglad')), arg('theme') ?? 'light'));
  }
  return zle ? 1 : 0;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2)).then((c) => process.exit(c), (e) => { console.error(`błąd: ${e.message}`); process.exit(1); });
