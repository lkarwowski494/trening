// Pliki runtime wskazówek techniki i figur BEZ nazw źródeł (decyzja właściciela 25.10.2026, docs/18: „całkiem anonimowo” — nazwy organizacji, autorów, tytuły i adresy źródeł
// nie trafiają do paczki aplikacji). Jedno źródło prawdy: katalog data/zrodla (cues.json, figures.json — pełne dane ze źródłami; czytają je tylko generatory dokumentów
// scripts/cues/gen.mjs i scripts/figures/gen.mjs, ten skrypt i testy tests/zrodla-pelne-*.test.ts). Stąd generuje się pliki, które importuje aplikacja:
//   lib/cues/data.json    — { exercises: id zdań, basis: rodzaje źródeł ćwiczenia (podpis), open: klucze bez wskazówek, partial: klucze z niepełnym zestawem sekcji }
//   lib/figures/data.json — { rom: granice kątów (min/max, bez źródeł), exercises: figury, open: klucze bez figury }
// Bramka 4 (CLAUDE.md 27.10.2026, DEC-01 b; M1-audytor-generalny-005, 06-tresci-001): do lib/figures/data.json trafia tylko figura z wpisem recenzji
// w docs/research/figury-recenzja.json o werdykcie „wyswietlana” albo „zastapiona” (figura v1 ćwiczenia, które wyświetla figurę v2) i skrócie równym bieżącemu
// (figuraSkrot: figura po rozwinięciu „like” + id i polskie teksty wskazówek ćwiczenia). Figura bez wpisu, ukryta po recenzji albo zmieniona po recenzji
// trafia na listę otwartą — aplikacja jej nie rysuje, a test tests/figury-recenzja.test.tsx czerwieni verify.
// Bramka 4 dla treści kart (DEC-10 a, 28.10.2026; M1-audytor-generalny-038): do lib/cues/data.json trafia tylko karta z aktualną recenzją treści (sekcja „karty”
// albo wpis v1 „wyswietlana”), a lista „general” zawiera tylko zestawy ogólne z aktualnym wpisem „zestawy” — zob. buildCues; test tests/karty-recenzja.test.tsx.
// Użycie: node scripts/zrodla-runtime.mjs --write  (zapis) | --check  (verify: nieaktualny plik runtime albo brak źródła wskazówki zestawu ogólnego → kod 1; wzór: scripts/cues/gen.mjs)
//         | --skroty  (bieżące skróty do wpisu recenzji: { v1: { ćwiczenie: skrót }, v2: { rodzina: skrót }, karty: { ćwiczenie: skrót }, zestawy: { ćwiczenie: skrót } })
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { resolve as resolveFig } from './figures/gen.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const FULL_CUES = join(root, 'data/zrodla/cues.json'), FULL_FIG = join(root, 'data/zrodla/figures.json');
export const OUT_CUES = join(root, 'lib/cues/data.json'), OUT_FIG = join(root, 'lib/figures/data.json');
export const REVIEW = join(root, 'docs/research/figury-recenzja.json'), PL = join(root, 'lib/cues/text/pl.json');
/** Werdykty recenzji, przy których figura v1 trafia do aplikacji. */
export const SHOWN = ['wyswietlana', 'zastapiona'];
/** Pliki rigu gotowych rodzin v2 (skrót recenzji rodziny = rig + wspólny moduł rigów + warianty). */
export const V2_RIGS = { squat: 'squat.ts', bench_press: 'benchPress.ts', hinge: 'hinge.ts' };
/** Kolejność rodzajów w podpisie = CUE_BASIS_KINDS w lib/cues/index.ts. */
export const BASIS_ORDER = ['org', 'site', 'maker', 'study'];
const SECTIONS = ['setup', 'move', 'tips', 'mistakes'];

/**
 * Bramka 4 dla treści kart (DEC-10 a, 28.10.2026; M1-audytor-generalny-038, 03-zakres-601): do lib/cues/data.json trafia tylko karta z aktualną recenzją —
 * wpis w docs/research/figury-recenzja.json „karty” (werdykt „wyswietlana”, skrót kartaSkrot) albo, bez wpisu w „karty”, wpis v1 „wyswietlana” z bieżącym
 * figuraSkrot (figura i wskazówki recenzowane razem). Pozostałe karty → lista „hidden” (aplikacja nie pokazuje ich wskazówek). Lista „general” = ćwiczenia, których
 * zestaw ogólny (cue-sets.json, b = general) ma wpis „zestawy” „wyswietlana” z bieżącym zestawSkrot — tylko je ekran pokazuje przy figurze v2.
 * Bez opcji `review` (wywołania sprzed bramki) — wszystkie karty, lista „general” pusta.
 */
export function buildCues(full, review) {
  const exercises = {}, basis = {}, hidden = [];
  const ok = review ? cardReviewed(review) : () => true;
  for (const [ex, x] of Object.entries(full.exercises)) {
    if (!ok(full, ex)) { hidden.push(ex); continue; }
    exercises[ex] = Object.fromEntries(Object.keys(x).map(sec => [sec, x[sec].map(r => ({ c: r.c }))]));
    const kinds = new Set();
    for (const sec of SECTIONS) for (const r of x[sec] ?? []) for (const [sid] of r.s) kinds.add(full.orgs[full.sources[sid].org].kind);
    basis[ex] = BASIS_ORDER.filter(k => kinds.has(k));
  }
  const general = review ? Object.keys(review.sets?.items ?? {}).filter(k => review.sets.items[k].b === 'general' && SHOWN_CARD.includes(review.rec.zestawy?.[k]?.werdykt) && review.rec.zestawy[k].sha === zestawSkrot(review.sets, review.pl, k)) : [];
  return { exercises, basis, open: Object.keys(full.open), partial: full.partial ?? [], hidden, general };
}
/** JSON z kluczami w stałej kolejności (bez pól undefined) — podstawa skrótu. */
const stable = v => Array.isArray(v) ? `[${v.map(stable).join(',')}]` : v && typeof v === 'object' ? `{${Object.keys(v).sort().filter(k => v[k] !== undefined).map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}` : JSON.stringify(v);
const sha12 = text => createHash('sha256').update(text).digest('hex').slice(0, 12);
/** Skrót recenzowanej wersji figury v1: figura po rozwinięciu „like” (bez samego odwołania) + id wskazówek w sekcjach + ich polskie teksty. */
export function figuraSkrot(full, cues, pl, key) {
  const { like, ...f } = resolveFig(full.exercises, key) ?? {};
  const c = cues.exercises[key] ?? {};
  const sections = Object.fromEntries(['setup', 'move', 'tips', 'mistakes'].map(s => [s, (c[s] ?? []).map(r => r.c)]));
  const texts = Object.fromEntries(Object.values(sections).flat().map(id => [id, pl[id] ?? null]));
  return sha12(stable({ figura: f, wskazowki: sections, teksty: texts }));
}
/** Werdykt recenzji treści karty, przy którym wskazówki trafiają do aplikacji. */
export const SHOWN_CARD = ['wyswietlana'];
/** Skrót recenzowanej treści karty własnej: id wskazówek w sekcjach + ich polskie teksty (bez figury). */
export function kartaSkrot(cues, pl, key) {
  const c = cues.exercises[key] ?? {};
  const sections = Object.fromEntries(SECTIONS.map(s => [s, (c[s] ?? []).map(r => r.c)]));
  return sha12(stable({ wskazowki: sections, teksty: Object.fromEntries(Object.values(sections).flat().map(id => [id, pl[id] ?? null])) }));
}
/** Skrót recenzowanego zestawu ogólnego ćwiczenia (cue-sets.json): wzorzec, id ok i err + ich polskie teksty. */
export function zestawSkrot(sets, pl, key) {
  const e = sets.items[key] ?? {}; const ok = e.ok ?? [], err = e.err ?? [];
  return sha12(stable({ rodzina: e.f ?? null, ok, err, teksty: Object.fromEntries([...ok, ...err].map(id => [id, pl[id] ?? null])) }));
}
/** Czy karta własna ma aktualną recenzję treści (wpis „karty” ma pierwszeństwo przed wpisem v1). */
export function cardReviewed({ rec, pl, fig = JSON.parse(readFileSync(FULL_FIG, 'utf8')) }) {
  return (full, key) => {
    const c = rec.karty?.[key];
    if (c) return SHOWN_CARD.includes(c.werdykt) && c.sha === kartaSkrot(full, pl, key);
    const v = rec.v1?.[key];
    return !!v && v.werdykt === 'wyswietlana' && !!fig.exercises[key] && v.sha === figuraSkrot(fig, full, pl, key);
  };
}
/** Skrót recenzji gotowej rodziny v2 (tekst plików rigu). */
/** Pliki wspólne dla rodzin v2, które zmieniają rysunek (R2-6, recenzja niezależna 28.10.2026: wcześniej tylko rig, common i variants — zmiana draw.ts/scene.ts nie unieważniała recenzji):
 * sprzęt i kształty (draw, scene), szkielet i matematyka (skeleton, math), czas (anim), błędy i figura (errors, figure). */
export const V2_WSPOLNE = ['lib/figures/v2/rigs/common.ts', 'lib/figures/v2/variants.ts', 'lib/figures/v2/draw.ts', 'lib/figures/v2/scene.ts', 'lib/figures/v2/skeleton.ts', 'lib/figures/v2/math.ts', 'lib/figures/v2/anim.ts', 'lib/figures/v2/errors.ts', 'lib/figures/v2/figure.ts'];
export const rodzinaSkrot = (fam, czytaj = p => readFileSync(join(root, p), 'utf8')) => sha12([`lib/figures/v2/rigs/${V2_RIGS[fam]}`, ...V2_WSPOLNE].map(czytaj).join('\n'));
export const recenzja = () => JSON.parse(readFileSync(REVIEW, 'utf8'));
export function skroty(full = JSON.parse(readFileSync(FULL_FIG, 'utf8')), cues = JSON.parse(readFileSync(FULL_CUES, 'utf8')), pl = JSON.parse(readFileSync(PL, 'utf8'))) {
  const sets = JSON.parse(readFileSync(CUE_SETS, 'utf8'));
  return { v1: Object.fromEntries(Object.keys(full.exercises).map(k => [k, figuraSkrot(full, cues, pl, k)])), v2: Object.fromEntries(Object.keys(V2_RIGS).map(f => [f, rodzinaSkrot(f)])),
    karty: Object.fromEntries(Object.keys(cues.exercises).map(k => [k, kartaSkrot(cues, pl, k)])),
    zestawy: Object.fromEntries(Object.keys(sets.items).filter(k => sets.items[k].b === 'general').map(k => [k, zestawSkrot(sets, pl, k)])) };
}
export function buildFigures(full, rec = recenzja(), cues = JSON.parse(readFileSync(FULL_CUES, 'utf8')), pl = JSON.parse(readFileSync(PL, 'utf8'))) {
  const rom = {};
  for (const v of Object.keys(full.rom)) if (v !== 'note') rom[v] = Object.fromEntries(Object.entries(full.rom[v]).map(([j, r]) => [j, { min: r.min, max: r.max }]));
  /* M1-audytor-generalny-038: figura v1 należy do karty — karta ukryta po recenzji treści (lista „hidden” w lib/cues/data.json) nie ma też figury. */
  const card = cardReviewed({ rec, pl, fig: full });
  const ok = k => { const e = rec.v1?.[k]; return !!e && SHOWN.includes(e.werdykt) && e.sha === figuraSkrot(full, cues, pl, k) && card(cues, k); };
  const exercises = Object.fromEntries(Object.entries(full.exercises).filter(([k]) => ok(k)));
  return { rom, exercises, open: [...Object.keys(full.open), ...Object.keys(full.exercises).filter(k => !ok(k))] };
}
export const serialize = obj => JSON.stringify(obj) + '\n';

/**
 * M1-audytor-generalny-021 (06-tresci-003, DEC-05 a, 27.10.2026): źródła zestawów ogólnych figur v2 i kąta stóp są w repo (data/zrodla/wskazowki-ogolne.json,
 * przeniesione z plików badacza z 25.10.2026). Zwraca listę braków (pusta = zgodne): każde id wskazówki z zestawu ogólnego (cue-sets.json, b = general) ma wpis —
 * ćwiczenie w data/zrodla/cues.json, przy którym ta wskazówka ma źródła z adresem https, albo ≥ 2 źródła { adres (https:// lub data:<ćwiczenie>), miejsce };
 * każde ćwiczenie z zestawem ogólnym ma przypisanie z rodziną i plikiem badacza; tekst kąta stóp ma ≥ 1 źródło z adresem i miejscem.
 */
export const OGOLNE = join(root, 'data/zrodla/wskazowki-ogolne.json'), CUE_SETS = join(root, 'lib/figures/v2/cue-sets.json');
export function brakiZrodelOgolnych(sets, ogolne, full, toeText) {
  const err = [], w = ogolne?.wskazowki ?? {}, p = ogolne?.przypisania ?? {};
  const url = (sid) => /^https:\/\//.test(full.sources[sid]?.url ?? '');
  const zrodlaPrzy = (ex, id) => Object.values(full.exercises[ex] ?? {}).flat().filter(r => r.c === id).flatMap(r => r.s);
  for (const [ex, e] of Object.entries(sets.items)) {
    if (e.b !== 'general') continue;
    if (!p[ex] || p[ex].rodzina !== e.f || !p[ex].plik) err.push(`${ex}: brak przypisania zestawu ogólnego (rodzina ${e.f}, plik badacza)`);
    for (const id of [...(e.ok ?? []), ...(e.err ?? [])]) {
      const x = w[id];
      if (!x) { err.push(`${ex}: wskazówka ${id} bez wpisu źródła`); continue; }
      if (x.cwiczenie) { const s = zrodlaPrzy(x.cwiczenie, id); if (!s.length || !s.every(([sid, m]) => url(sid) && m)) err.push(`${id}: przy „${x.cwiczenie}” w data/zrodla/cues.json brak źródeł z adresem i miejscem`); }
      else if (!Array.isArray(x.zrodla) || x.zrodla.length < 2 || x.zrodla.some(z => !z.miejsce || !(/^https:\/\//.test(z.adres ?? '') || (/^data:/.test(z.adres ?? '') && full.exercises[z.adres.slice(5)])))) err.push(`${id}: wymagane ≥ 2 źródła z adresem (https:// albo data:<ćwiczenie>) i miejscem`);
    }
  }
  const k = ogolne?.katy?.['sq.toesAngle'];
  if (!k || k.tekst !== toeText || !Array.isArray(k.zrodla) || !k.zrodla.length || k.zrodla.some(z => !/^https:\/\//.test(z.adres ?? '') || !z.miejsce)) err.push(`kąt stóp: brak wpisu źródła z adresem i miejscem dla tekstu „${toeText}”`);
  return err;
}
/** Tekst kąta stóp w aplikacji (components/ExerciseFigureV2.tsx). */
export const TOE_TEXT = 'Palce stóp lekko na zewnątrz — zwykle mniej więcej 15–20°.';

export function outputs() {
  return [
    [OUT_CUES, serialize(buildCues(JSON.parse(readFileSync(FULL_CUES, 'utf8')), { rec: recenzja(), pl: JSON.parse(readFileSync(PL, 'utf8')), sets: JSON.parse(readFileSync(CUE_SETS, 'utf8')) }))],
    [OUT_FIG, serialize(buildFigures(JSON.parse(readFileSync(FULL_FIG, 'utf8'))))],
  ];
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (process.argv.includes('--skroty')) { console.log(JSON.stringify(skroty(), null, 1)); process.exit(0); }
  const check = process.argv.includes('--check');
  if (!check && !process.argv.includes('--write')) { console.error('użycie: node scripts/zrodla-runtime.mjs --write | --check | --skroty'); process.exit(2); }
  let bad = 0;
  if (check) {
    const braki = existsSync(OGOLNE) ? brakiZrodelOgolnych(JSON.parse(readFileSync(CUE_SETS, 'utf8')), JSON.parse(readFileSync(OGOLNE, 'utf8')), JSON.parse(readFileSync(FULL_CUES, 'utf8')), TOE_TEXT) : ['brak pliku data/zrodla/wskazowki-ogolne.json'];
    for (const b of braki) console.error(`źródła zestawów ogólnych (M1-audytor-generalny-021): ${b}`);
    if (braki.length) bad = 1;
  }
  for (const [file, text] of outputs()) {
    if (check) { if (!existsSync(file) || readFileSync(file, 'utf8') !== text) { console.error(`nieaktualny: ${file.slice(root.length)} — uruchom node scripts/zrodla-runtime.mjs --write (figura zmieniona po recenzji bramki 4 wypada z pliku: nowa recenzja i skrót w docs/research/figury-recenzja.json)`); bad = 1; } }
    else { writeFileSync(file, text); console.log(`zapisano ${file}`); }
  }
  process.exit(bad);
}
