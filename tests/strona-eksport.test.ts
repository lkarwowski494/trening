/*
 * Eksport danych biblioteki ćwiczeń dla strony (decyzja właściciela 26.10.2026; scripts/strona/eksport.mjs → repo `techniqueatlas`).
 * Rodzaje (docs/20): logika (slugi, zamienniki tym samym kodem co aplikacja), dane (komplet 709 ćwiczeń × 35 języków, spójność z runtime aplikacji), niezmienniki
 * (zero nazw źródeł i odwołań ogólnych, zero pól z pewnością/źródłami, deterministyczność), języki (nazwy jak exName, etykiety z t()), regresja (wersja i commit przypięte).
 */
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { LANGS, applyLang, exName } from '@/lib/i18n';
import { LIB, LIB_DISPLAY_NAME, libExercise } from '@/lib/seed';
import { CATALOG_REV, CATALOG } from '@/lib/catalog.generated';
import { CUE_DATA, cueDict } from '@/lib/cues';
import { cueSelection } from '@/lib/figures/v2/cueSets';
import { figureSpec, phasesFor } from '@/lib/figures/v2/figure';
import { similarity, SWAP_WEIGHTS } from '@/lib/swapScore';
import { SOURCE_NAME_PATTERNS, GENERIC_REFERENCE_PATTERNS } from '@/lib/sources';

const root = path.join(__dirname, '..');
const SCRIPT = path.join(root, 'scripts/strona/eksport.mjs');
const run = (out: string, ...extra: string[]) => execFileSync('node', [SCRIPT, '--out', out, '--commit', 'abc1234def', ...extra], { encoding: 'utf8' });
type Ex = { id: string; slug: string; name: string; group: string; equipment: string; metric: string; pattern: string; muscles: { main: string[]; aux: string[] }; regions: { id: string; load: number }[]; family: string;
  figure: null | { family: string; pose: { kontrakt: string; klatki: unknown[]; bledy: unknown[] } | null; phases?: { name: string; ms: number }[] }; cues: { scope: string; ok?: string[]; mistakes?: string[]; setup?: string[] }; alternatives: string[]; requires: string[][] };
type Out = { schema: string; app: { version: string; commit: string; catalogRev: string }; lang: string; meta: { exercises: number; cuesWithoutText: number }; labels: Record<string, Record<string, string>>; exercises: Ex[] };

let dir = '', dir2 = '';
const data: Record<string, Out> = {};
beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-')); dir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-'));
  run(dir); run(dir2, '--langs', 'pl,en');
  for (const l of LANGS) data[l] = JSON.parse(fs.readFileSync(path.join(dir, `atlas-${l}.json`), 'utf8'));
}, 240000);
afterAll(() => { fs.rmSync(dir, { recursive: true, force: true }); fs.rmSync(dir2, { recursive: true, force: true }); });

describe('eksport dla strony: manifest i przypięcie do wersji', () => {
  test('manifest wymienia wszystkie 35 języków aplikacji i istniejące pliki', () => {
    const m = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
    expect(m.schema).toBe('techniqueatlas-eksport@1');
    expect(m.languages.map((x: { lang: string }) => x.lang)).toEqual([...LANGS]);
    expect(LANGS).toHaveLength(35);
    for (const x of m.languages) expect(fs.existsSync(path.join(dir, x.file))).toBe(true);
  });
  test('każdy plik ma wersję aplikacji z app.json, podany skrót commitu i rewizję katalogu', () => {
    const v = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8')).expo.version;
    for (const l of LANGS) expect([l, data[l].app, data[l].lang]).toEqual([l, { version: v, commit: 'abc1234def', catalogRev: CATALOG_REV }, l]);
  });
  test('deterministyczność: dwa przebiegi dają identyczne bajty (pl, en)', () => {
    for (const l of ['pl', 'en']) expect(fs.readFileSync(path.join(dir2, `atlas-${l}.json`), 'utf8')).toBe(fs.readFileSync(path.join(dir, `atlas-${l}.json`), 'utf8'));
  });
});

describe('eksport dla strony: komplet i spójność z runtime aplikacji (macierz: 709 ćwiczeń × 35 języków)', () => {
  test('każdy język ma wszystkie ćwiczenia biblioteki, w kolejności biblioteki, z polami wymaganymi', () => {
    for (const l of LANGS) {
      const d = data[l]; expect([l, d.exercises.map(e => e.id)]).toEqual([l, LIB.map(r => r[0])]);
      expect(d.meta.exercises).toBe(709);
      for (const e of d.exercises) {
        expect([l, e.id, typeof e.name === 'string' && e.name.length > 0]).toEqual([l, e.id, true]);
        for (const k of ['group', 'equipment', 'metric', 'pattern', 'family'] as const) expect([e.id, k, typeof e[k]]).toEqual([e.id, k, 'string']);
        expect(Array.isArray(e.requires)).toBe(true); expect(Array.isArray(e.alternatives)).toBe(true);
      }
    }
  });
  test('slugi: a–z 0–9 i „-”, unikalne, te same we wszystkich językach (adres strony nie zależy od języka)', () => {
    const base = data.en.exercises.map(e => e.slug);
    expect(new Set(base).size).toBe(709);
    for (const s of base) expect(s).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    for (const l of LANGS) expect(data[l].exercises.map(e => e.slug)).toEqual(base);
    expect(data.en.exercises.find(e => e.id === 'Back Squat')!.slug).toBe('back-squat');
  });
  test('nazwy jak w aplikacji: pl — nazwa wyświetlana, inne języki — exName (angielska biblioteka)', () => {
    for (const l of LANGS) { applyLang(l); for (const r of LIB) { const shown = Object.prototype.hasOwnProperty.call(LIB_DISPLAY_NAME, r[0]) ? LIB_DISPLAY_NAME[r[0]] : r[0]; expect([l, r[0], data[l].exercises.find(e => e.id === r[0])!.name]).toEqual([l, r[0], exName({ name: shown, lib: true })]); } }
    applyLang('pl');
  });
  test('pola ćwiczenia zgodne z katalogiem i partiami aplikacji; obciążenia regionów tylko 0,25 / 0,5 / 1', () => {
    for (const r of LIB) {
      const e = data.en.exercises.find(x => x.id === r[0])!; const x = libExercise(r);
      expect([r[0], e.group, e.equipment, e.metric, e.pattern, e.muscles]).toEqual([r[0], x.group, x.equipment, x.metric, CATALOG[r[0]].pattern, { main: x.muscles, aux: x.secondaryMuscles }]);
      for (const g of e.regions) expect([0.25, 0.5, 1]).toContain(g.load);
    }
  });
  test('etykiety: grupy, partie, regiony, sprzęt, możliwości i fazy ruchu są w każdym języku (niepuste)', () => {
    for (const l of LANGS) for (const [sec, m] of Object.entries(data[l].labels)) { expect([l, sec, Object.keys(m).length > 0]).toEqual([l, sec, true]); for (const [k, v] of Object.entries(m)) expect([l, sec, k, v.length > 0]).toEqual([l, sec, k, true]); }
    expect(data.pl.labels.regions.chest).toBe('klatka');
  });
});

describe('eksport dla strony: wskazówki, figury i zamienniki', () => {
  test('tryb wskazówek jak w aplikacji: 102 własne, reszta ogólne albo brak; teksty z lib/cues w języku pliku', () => {
    for (const l of ['pl', 'en', 'de', 'ja']) {
      const own = data[l].exercises.filter(e => e.cues.scope === 'own'); expect(own).toHaveLength(Object.keys(CUE_DATA.exercises).length);
      for (const e of data[l].exercises) expect([e.id, e.cues.scope]).toEqual([e.id, cueSelection(e.id).mode]);
    }
    const sq = data.en.exercises.find(e => e.id === 'Back Squat')!; const first = CUE_DATA.exercises['Back Squat'].setup[0].c;
    expect(sq.cues.setup![0]).toBe(cueDict('en')[first]);
    expect(data.pl.exercises.find(e => e.id === 'Back Squat')!.cues.setup![0]).toBe(cueDict('pl')[first]);
  });
  test('wskazówki bez tekstu (id czekające na przekład) są pomijane, nigdy nie trafiają jako surowe id; licznik w meta', () => {
    for (const l of ['pl', 'en']) { const all = data[l].exercises.flatMap(e => [...(e.cues.ok ?? []), ...(e.cues.mistakes ?? []), ...(e.cues.setup ?? [])]); for (const s of all) expect(s).not.toMatch(/^[a-z]+\.[A-Za-z.]+$/); expect(data[l].meta.cuesWithoutText).toBeGreaterThanOrEqual(0); }
  });
  test('figura: tylko ćwiczenia gotowych rodzin, z dokumentem pozy kontraktu i fazami; reszta bez figury', () => {
    for (const e of data.en.exercises) {
      const spec = figureSpec(e.id);
      if (!spec) { expect([e.id, e.figure]).toEqual([e.id, null]); continue; }
      expect(e.figure!.pose!.kontrakt).toBe('figury-v2/poza@1'); expect(e.figure!.pose!.klatki.length).toBeGreaterThanOrEqual(2);
      expect(e.figure!.phases).toEqual(phasesFor(spec).map(p => ({ name: p.name, ms: p.ms })));
    }
    expect(data.en.exercises.filter(e => e.figure).length).toBe(87);
  });
  test('zamienniki: do 5, istniejące slugi, nie to samo ćwiczenie, ta sama metryka; ranking = lib/swapScore (te same wagi co aplikacja)', () => {
    const bySlug = new Map(data.en.exercises.map(e => [e.slug, e]));
    for (const e of data.en.exercises) {
      expect(e.alternatives.length).toBeLessThanOrEqual(5);
      for (const s of e.alternatives) { const b = bySlug.get(s)!; expect([e.id, s, !!b && b.id !== e.id && b.metric === e.metric]).toEqual([e.id, s, true]); }
    }
    const a = libExercise(LIB.find(r => r[0] === 'Back Squat')!);
    const scores = data.en.exercises.find(e => e.id === 'Back Squat')!.alternatives.map(s => { const b = LIB.find(r => r[0] === bySlug.get(s)!.id)!; return similarity(a, libExercise(b))!.score; });
    expect([...scores].sort((x, y) => y - x)).toEqual(scores);
    expect(SWAP_WEIGHTS.pattern).toBe(3);
  });
});

describe('eksport dla strony: niezmienniki anonimowości (jak tests/zrodla-wiedzy.test.ts)', () => {
  const NAME = new RegExp(`(?<![\\p{L}])(?:${SOURCE_NAME_PATTERNS.join('|')})`, 'u');
  const GENERIC = new RegExp(`(?<![\\p{L}])(?:${GENERIC_REFERENCE_PATTERNS.join('|')})`, 'iu');
  const strings = (o: unknown, out: string[] = []): string[] => { if (typeof o === 'string') out.push(o); else if (Array.isArray(o)) o.forEach(x => strings(x, out)); else if (o && typeof o === 'object') Object.values(o).forEach(x => strings(x, out)); return out; };
  test('żaden tekst w żadnym z 35 języków nie ma nazwy źródła; w pl i en także odwołań ogólnych', () => {
    for (const l of LANGS) { const bad = strings(data[l]).filter(s => NAME.test(s) || ((l === 'pl' || l === 'en') && GENERIC.test(s))); expect([l, bad.slice(0, 3)]).toEqual([l, []]); }
  });
  test('w danych nie ma pól ze źródłami ani pewnością (confidence, source, basis, zrodl, uproszczenie)', () => {
    const keys = (o: unknown, out = new Set<string>()): Set<string> => { if (Array.isArray(o)) o.forEach(x => keys(x, out)); else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { out.add(k); keys(v, out); } return out; };
    expect([...keys(data.en)].filter(k => /^(confidence|sources?|basis|zrodla?|pewnosc|uproszczenie)$/i.test(k))).toEqual([]);
  });
  test('bramka eksportu: wstrzyknięta nazwa źródła (wszystkie języki) i odwołanie ogólne (pl, en) przerywają eksport; czysty tekst przechodzi', () => {
    const probe = `import { createExporter } from ${JSON.stringify('file://' + SCRIPT)}; const ex = createExporter({ commit: 'x' }); const r = [];
      for (const [l, name] of [['en', 'Method by Helms'], ['de', 'Nach ACSM 2026'], ['pl', 'Na podstawie badań'], ['en', 'Based on research'], ['ja', 'Dumbbell row'], ['de', 'Based on research']]) {
        try { ex.guard({ exercises: [{ name }] }, l); r.push('ok'); } catch { r.push('blad'); } }
      process.stdout.write(r.join(','));`;
    expect(execFileSync('node', ['--input-type=module', '-e', probe], { encoding: 'utf8' })).toBe('blad,blad,blad,blad,ok,ok');
  });
});
