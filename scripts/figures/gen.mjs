// Figury ruchu (etap 2–3, decyzja właściciela 08.10.2026 ok. 23:50): generuje docs/research/28-figury.md z lib/figures/data.json,
// lib/cues/data.json i lib/cues/text/pl.json oraz sprawdza dane (pokrycie ćwiczeń ze wskazówkami, odwołania do zdań, 1–3 pozy…).
// Geometrię (zakres stawów, sprawdzenia póz) liczy tests/figures.test.tsx przez lib/figures/geom.ts — tu tylko struktura i dokument.
// Dokument generowany z danych — nie przepisywać ręcznie (CLAUDE.md; wzór scripts/cues/gen.mjs).
// Użycie: node scripts/figures/gen.mjs  (zapis) | node scripts/figures/gen.mjs --check  (verify: błędne dane albo nieaktualny dokument → kod 1)
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../..', import.meta.url));
const FIG = join(root, 'lib/figures/data.json');
const CUES = join(root, 'lib/cues/data.json');
const PL = join(root, 'lib/cues/text/pl.json');
const OUT = join(root, 'docs/research/28-figury.md');

export const CHECKS = ['horiz', 'joint', 'alignX', 'line', 'low', 'above', 'ahead', 'behind', 'touch'];
export const PROPS = ['plate', 'db', 'kb', 'grip', 'cable', 'rect', 'line', 'bar', 'rod', 'plank'];
export const FRAME_ORDER = { 1: ['start'], 2: ['start', 'end'], 3: ['start', 'mid', 'end'] };
const own = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);

/** Figura po rozwinięciu „like” (jak resolveFigure w lib/figures/geom.ts). */
export function resolve(ex, key, seen = []) {
  const d = own(ex, key) ? ex[key] : undefined; if (!d || seen.includes(key)) return null;
  const base = d.like ? resolve(ex, d.like, [...seen, key]) : null; if (d.like && !base) return null;
  return { view: d.view ?? base?.view ?? 'side', anchor: d.anchor ?? base?.anchor ?? 'toe', props: d.props ?? base?.props ?? [], frames: d.frames ?? base?.frames ?? [], note: d.note ?? base?.note, armProj: d.armProj ?? base?.armProj ?? false, floor: d.floor ?? base?.floor ?? true, level: d.level ?? base?.level, lift: d.lift ?? base?.lift, like: d.like };
}
const cueIds = x => new Set(['setup', 'move', 'tips', 'mistakes'].flatMap(s => (x[s] ?? []).map(r => r.c)));

export function validate(fig, cues, pl) {
  const errs = [];
  if (!fig.rom || !fig.rom.side || !fig.rom.front) errs.push('rom: brak granic zakresu stawów');
  for (const v of ['side', 'front']) for (const [j, r] of Object.entries(fig.rom?.[v] ?? {})) if (typeof r.min !== 'number' || typeof r.max !== 'number' || r.min >= r.max || !r.src) errs.push(`rom.${v}.${j}: min < max i źródło`);
  for (const k of Object.keys(cues.exercises)) if (!own(fig.exercises, k) && !own(fig.open, k)) errs.push(`${k}: ma wskazówki etapu 1, ale nie ma figury ani powodu w „open”`);
  for (const k of Object.keys(fig.open)) { if (own(fig.exercises, k)) errs.push(`open.${k}: ćwiczenie ma figurę`); if (typeof fig.open[k] !== 'string' || fig.open[k].length < 30) errs.push(`open.${k}: brak powodu`); if (!own(cues.exercises, k)) errs.push(`open.${k}: nie ma wskazówek etapu 1`); }
  for (const k of Object.keys(fig.exercises)) {
    if (!own(cues.exercises, k)) { errs.push(`${k}: figura bez wskazówek etapu 1`); continue; }
    const f = resolve(fig.exercises, k); if (!f) { errs.push(`${k}: nie da się rozwinąć „like”`); continue; }
    const ids = cueIds(cues.exercises[k]);
    if (!['side', 'front'].includes(f.view)) errs.push(`${k}: widok ${f.view}`);
    const order = FRAME_ORDER[f.frames.length];
    if (!order) errs.push(`${k}: ${f.frames.length} pozy (dozwolone 1–3)`);
    else if (f.frames.map(x => x.n).join() !== order.join()) errs.push(`${k}: kolejność póz ${f.frames.map(x => x.n).join()} — oczekiwano ${order.join()}`);
    for (const fr of f.frames) {
      if (!fr.p || typeof fr.p !== 'object') errs.push(`${k}.${fr.n}: brak pozy`);
      if (!Array.isArray(fr.why) || !fr.why.length) { errs.push(`${k}.${fr.n}: poza bez odwołania do zdania wskazówki`); continue; }
      for (const w of fr.why) {
        if (!CHECKS.includes(w.q)) errs.push(`${k}.${fr.n}: nieznane sprawdzenie ${w.q}`);
        if (!ids.has(w.c)) errs.push(`${k}.${fr.n}: zdanie ${w.c} nie należy do wskazówek tego ćwiczenia`);
        if (!own(pl, w.c)) errs.push(`${k}.${fr.n}: brak tekstu PL zdania ${w.c}`);
      }
    }
    for (const p of f.props) if (!PROPS.includes(p.k)) errs.push(`${k}: nieznany przyrząd ${p.k}`);
  }
  return errs;
}

const PT = { hip: 'biodro', knee: 'kolano', ankle: 'kostka', heel: 'pięta', toe: 'przód stopy', shoulder: 'bark', elbow: 'łokieć', hand: 'dłoń', head: 'głowa', neck: 'szyja' };
const pt = n => n ? (n.endsWith('2') ? `${PT[n.slice(0, -1)] ?? n} (dalsza strona)` : PT[n] ?? n) : '';
const JT = { hip: 'zgięcie biodra', knee: 'zgięcie kolana', ankle: 'zgięcie grzbietowe stopy', sh: 'zgięcie barku', el: 'zgięcie łokcia', abd: 'odwiedzenie ramienia', hipAbd: 'odwiedzenie uda', elev: 'uniesienie barków (jedn. rysunku)' };
const jt = j => j.endsWith('2') ? `${JT[j.slice(0, -1)] ?? j} (dalsza strona)` : JT[j] ?? j;
export function describe(w) {
  switch (w.q) {
    case 'horiz': return `odcinek ${pt(w.a)}–${pt(w.b)}: ${w.eq}° do poziomu (±${w.tol}°)`;
    case 'joint': return `${jt(w.j)}: ${w.eq}° (±${w.tol}°)`;
    case 'alignX': return `${pt(w.a)} w pionie nad/pod: ${pt(w.b)} (±${w.tol})`;
    case 'line': return `${w.pts.map(pt).join(' – ')} w jednej linii (±${w.tol}°)`;
    case 'low': return `${pt(w.a)} tuż nad poziomem ${w.y} (do ${w.tol})`;
    case 'above': return `${pt(w.a)}${w.dy ? ` (${w.dy > 0 ? '+' : ''}${w.dy})` : ''} wyżej niż ${w.b ? pt(w.b) : `poziom ${w.y}`}`;
    case 'ahead': return `${pt(w.a)} przed: ${pt(w.b)}`;
    case 'behind': return `${pt(w.a)} za linią pleców`;
    case 'touch': return `${pt(w.a)} przy: ${pt(w.b)}${w.tb ? ` + [${w.tb.join(', ')}] w układzie tułowia` : ''} (≤ ${w.tol})`;
  }
  return w.q;
}
const md = s => String(s).replace(/\|/g, '\\|');
const FN = { start: 'pozycja wyjściowa', mid: 'w trakcie', end: 'pozycja końcowa' };
const pose = p => Object.entries(p).map(([k, v]) => `${k} ${Array.isArray(v) ? v.join('/') : v}`).join(', ');

export function render(fig, cues, pl) {
  const keys = Object.keys(fig.exercises);
  const L = [];
  L.push('# 28 — Figury ruchu (generowane)', '');
  L.push('AUTOMATYCZNIE WYGENEROWANE przez `scripts/figures/gen.mjs` z `lib/figures/data.json`, `lib/cues/data.json` i `lib/cues/text/pl.json` — nie edytować ręcznie.');
  L.push('Sprawdzanie: `node scripts/figures/gen.mjs --check` (część `npm run verify`); geometria póz i zakres stawów: `tests/figures.test.tsx`.', '');
  L.push('Decyzja właściciela: docs/18, 08.10.2026 (ok. 23:50) — wariant A etapami; etap 2–3 = własne figury SVG (szkielet z kątami stawów, 2–3 pozycje, krótka pętla; przy „Ogranicz ruch” pozycje statycznie). Research: docs/research/26 pkt 7; wskazówki etapu 1: docs/research/27.', '');
  L.push('## Zasady', '');
  L.push('- Figura powstaje tylko dla ćwiczenia, które ma wskazówki etapu 1; opis dla VoiceOver to zdania „Ruch” z tych wskazówek.');
  L.push('- Każda poza ma co najmniej jedno sprawdzenie powiązane ze zdaniem wskazówki (np. „uda równolegle do podłogi” → odcinek biodro–kolano poziomo ± tolerancja). Test liczy geometrię i sprawdza, że poza spełnia każde z nich.');
  L.push('- Kąty, których żadne zdanie nie podaje (pochylenie tułowia, długość kroku, kąt ławki…), są **uproszczeniem ilustracyjnym** — rysunek nie twierdzi, że to jedyna poprawna wartość. Przy ćwiczeniu podana jest uwaga, co jest ilustracyjne.');
  L.push('- Proporcje ciała i przyrządów są schematyczne (uproszczenie ilustracyjne), wszystkie w jednym module `lib/figures/geom.ts`.');
  L.push('- „Rzut ręki” (armProj): ręka odwiedziona w bok (szeroki chwyt, łokcie na boki) w widoku z boku wygląda na krótszą — kąty ręki są wtedy kątami rzutu, nie stawu, i nie podlegają sprawdzeniu zakresu.');
  L.push('- Animacja: pozy pośrednie z interpolacji kątów; „druga podpora” (level) obraca figurę wokół kotwicy, żeby np. dłonie przy pompkach nie schodziły pod podłogę.');
  L.push('- Bez twierdzeń medycznych; rysunek jest w sekcji „Technika” razem ze stopką odsyłającą do lekarza lub fizjoterapeuty.');
  L.push('- Rysunki własne, z kątów i opisów słownych (bez odrysowywania cudzych zdjęć i rysunków — docs/research/26 pkt 3).', '');
  L.push('## Granice zakresu stawów (test)', '');
  L.push(md(fig.rom.note), '');
  L.push('| Widok | Staw | Min | Max | Źródło |', '|---|---|---|---|---|');
  for (const v of ['side', 'front']) for (const [j, r] of Object.entries(fig.rom[v])) L.push(`| ${v === 'side' ? 'z boku' : 'z przodu'} | ${jt(j)} | ${r.min}° | ${r.max}° | ${md(r.src)} |`);
  L.push('');
  L.push(`## Ćwiczenia z figurą (${keys.length})`, '');
  for (const k of keys) {
    const f = resolve(fig.exercises, k);
    L.push(`### ${k}`, '');
    L.push(`Widok: ${f.view === 'side' ? 'z boku' : 'z przodu'}; kotwica: ${pt(f.anchor)}${f.like ? `; na wzór: ${f.like}` : ''}${f.armProj ? '; rzut ręki (kąty ręki = rzut)' : ''}${f.level ? `; druga podpora: ${pt(f.level)}` : ''}${f.lift ? '; w pozach pośrednich figura unosi się nad podłogę (stopa obraca się wokół kostki — uproszczenie)' : ''}; przyrządy: ${f.props.map(p => p.k).join(', ') || 'brak'}.`, '');
    for (const fr of f.frames) {
      L.push(`- **${FN[fr.n]}** — ${pose(fr.p)}`);
      for (const w of fr.why) L.push(`  - ${describe(w)} ← \`${w.c}\`: „${md(pl[w.c])}”`);
    }
    L.push(`- Uproszczenie ilustracyjne: pozostałe kąty${f.note ? `. ${md(f.note)}` : '.'}`, '');
  }
  L.push(`## Bez figury — lista otwarta (${Object.keys(fig.open).length})`, '');
  L.push('| Ćwiczenie | Powód |', '|---|---|');
  for (const [k, why] of Object.entries(fig.open)) L.push(`| ${k} | ${md(why)} |`);
  L.push('');
  L.push(`Poza tym bez figury: ${Object.keys(cues.open ?? {}).length} ćwiczeń bazowych bez wskazówek etapu 1 (docs/research/27, lista otwarta) — figura czeka na wskazówki.`, '');
  return L.join('\n');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const fig = JSON.parse(readFileSync(FIG, 'utf8')), cues = JSON.parse(readFileSync(CUES, 'utf8')), pl = JSON.parse(readFileSync(PL, 'utf8'));
  const errs = validate(fig, cues, pl);
  if (errs.length) { console.error('Błędy danych figur:\n' + errs.map(e => '  ' + e).join('\n')); process.exit(1); }
  const doc = render(fig, cues, pl);
  if (process.argv.includes('--check')) {
    if (!existsSync(OUT) || readFileSync(OUT, 'utf8') !== doc) { console.error('docs/research/28-figury.md nieaktualny — uruchom: node scripts/figures/gen.mjs'); process.exit(1); }
    console.log(`figury: ${Object.keys(fig.exercises).length} ćwiczeń, ${Object.keys(fig.open).length} otwartych — dokument aktualny`);
  } else { writeFileSync(OUT, doc); console.log(`zapisano ${OUT}`); }
}
