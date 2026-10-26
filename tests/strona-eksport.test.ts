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
import { figureSpec, phasesFor, tempoFor, frameAt } from '@/lib/figures/v2/figure';
import { errorsOf } from '@/lib/figures/v2/ui';
import { figurePalette, svgInner, shapesAt as appShapesAt } from '@/lib/figures/v2';
import { light } from '@/lib/tokens';
import { similarity, SWAP_WEIGHTS } from '@/lib/swapScore';
import { SOURCE_NAME_PATTERNS, GENERIC_REFERENCE_PATTERNS } from '@/lib/sources';

const root = path.join(__dirname, '..');
const SCRIPT = path.join(root, 'scripts/strona/eksport.mjs');
const run = (out: string, ...extra: string[]) => execFileSync('node', [SCRIPT, '--out', out, '--commit', 'abc1234def', ...extra], { encoding: 'utf8' });
type Ex = { id: string; slug: string; name: string; group: string; equipment: string; metric: string; pattern: string; muscles: { main: string[]; aux: string[] }; regions: { id: string; load: number }[]; family: string;
  figure: null | { phases: { name: string; ms: number }[]; errors: { id: string; text: string }[] }; cues: { scope: string; ok?: string[]; mistakes?: string[]; setup?: string[] }; alternatives: string[]; requires: string[][] };
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
  test('figura w pliku języka: tylko ćwiczenia gotowych rodzin; fazy ruchu z czasami z aplikacji i przetłumaczonymi nazwami; błędy z tekstem wskazówki', () => {
    for (const l of ['pl', 'en', 'de']) {
      let n = 0;
      for (const e of data[l].exercises) {
        const spec = figureSpec(e.id);
        if (!spec) { expect([e.id, e.figure]).toEqual([e.id, null]); continue; }
        n++; expect(e.figure!.phases.map(p => p.ms)).toEqual(phasesFor(spec, tempoFor(spec)).map(p => p.ms));
        for (const p of e.figure!.phases) expect(p.name.length).toBeGreaterThan(0);
        for (const x of e.figure!.errors) expect(x.text.length).toBeGreaterThan(0);
      }
      expect(n).toBe(87);
    }
    expect(data.pl.exercises.find(e => e.id === 'Back Squat')!.figure!.phases[0].name).toBe('Opuszczanie');
    expect(data.en.exercises.find(e => e.id === 'Back Squat')!.figure!.phases[0].name).not.toBe('Opuszczanie');
  });
  test('figury.json: wpis na slug ćwiczenia z figurą — 25 próbek klatek, kontrakt pozy, tempo i błędy jak w aplikacji; próbki = klatki rigu (zaokrąglone do 0,01 cm)', () => {
    const fig = JSON.parse(fs.readFileSync(path.join(dir, 'figury.json'), 'utf8')) as { figures: Record<string, { frames: { pose: { pelvis: number[] }; props: unknown[] }[]; pose: { kontrakt: string }; tempo: unknown; errors: { id: string; cue: string; kind: string; frames?: unknown[]; tempo?: unknown }[]; views: string[]; family: string }> };
    const withFig = data.en.exercises.filter(e => figureSpec(e.id));
    expect(Object.keys(fig.figures).sort()).toEqual(withFig.map(e => e.slug).sort());
    for (const e of withFig) {
      const spec = figureSpec(e.id)!; const f = fig.figures[e.slug];
      expect([e.id, f.frames.length, f.pose.kontrakt, f.family, f.views]).toEqual([e.id, 25, 'figury-v2/poza@1', spec.family, spec.views]);
      expect(f.tempo).toEqual(tempoFor(spec));
      expect(f.errors.map(x => [x.id, x.cue])).toEqual(errorsOf(spec).map(x => [x.error, x.cue]));
      for (const x of f.errors) expect(x.kind === 'pose' ? x.frames!.length : x.tempo).toBeTruthy();
    }
    const sq = fig.figures['back-squat']; const rig = frameAt(figureSpec('Back Squat')!, 0.5);
    sq.frames[12].pose.pelvis.forEach((v, i) => expect(Math.abs(v - (rig.pose!.pelvis as number[])[i])).toBeLessThan(0.006));
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
  test('wzorce-zrodel.json (dla strażnika w repo strony) = lista z lib/sources.ts, a manifest wskazuje ten plik i figury.json', () => {
    const w = JSON.parse(fs.readFileSync(path.join(dir, 'wzorce-zrodel.json'), 'utf8')); expect(w.name).toEqual([...SOURCE_NAME_PATTERNS]); expect(w.generic).toEqual([...GENERIC_REFERENCE_PATTERNS]);
    const m = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8')); expect([m.patterns, m.figures]).toEqual(['wzorce-zrodel.json', 'figury.json']);
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

describe('silnik figur dla przeglądarki (scripts/strona/silnik-build.mjs)', () => {
  let eng = '';
  /** Silnik działa w osobnym procesie Node (moduły ES; Jest ich nie ładuje): żądania → wyniki JSON. */
  const engine = (reqs: { slug: string; u: number; view: string }[]): { inner: string[]; roles: string[]; varSkin: string } => {
    const code = `import * as E from ${JSON.stringify('file://' + path.join(eng, 'silnik/figura.js'))}; import fs from 'node:fs';
      const fig = JSON.parse(fs.readFileSync(${JSON.stringify(path.join(dir, 'figury.json'))}, 'utf8')).figures; const reqs = JSON.parse(process.argv[1]);
      process.stdout.write(JSON.stringify({ inner: reqs.map(r => E.innerAt(fig[r.slug].frames, r.u, r.view)), roles: E.ROLES, varSkin: E.VAR_PALETTE.skin }));`;
    return JSON.parse(execFileSync('node', ['--input-type=module', '-e', code, JSON.stringify(reqs)], { encoding: 'utf8', maxBuffer: 1 << 28 }));
  };
  beforeAll(() => {
    eng = fs.mkdtempSync(path.join(os.tmpdir(), 'silnik-'));
    execFileSync('node', [path.join(root, 'scripts/strona/silnik-build.mjs'), '--out', eng, '--commit', 'abc1234def'], { encoding: 'utf8' });
    fs.writeFileSync(path.join(eng, 'silnik/package.json'), '{"type":"module"}');
  }, 120000);
  afterAll(() => fs.rmSync(eng, { recursive: true, force: true }));
  test('MANIFEST przypina silnik do wersji i commitu; moduły ES mają importy z rozszerzeniem .js; nie ma w nim katalogu, rodzin ani rigów; rozmiar < 40 KB', () => {
    const m = JSON.parse(fs.readFileSync(path.join(eng, 'silnik/MANIFEST.json'), 'utf8'));
    expect(m.app.commit).toBe('abc1234def'); expect(m.files).toEqual(['anim.js', 'draw.js', 'figura.js', 'math.js', 'render.js', 'scene.js', 'skeleton.js']);
    for (const f of m.files) { const src = fs.readFileSync(path.join(eng, 'silnik', f), 'utf8'); for (const im of src.matchAll(/from\s*"(\.[^"]+)"/g)) expect([f, im[1]]).toEqual([f, expect.stringMatching(/\.js$/)]); expect(src).not.toMatch(/catalog|families|CATALOG/); }
    expect(m.files.reduce((n: number, f: string) => n + fs.statSync(path.join(eng, 'silnik', f)).size, 0)).toBeLessThan(40000);
  });
  test('role kolorów silnika = klucze figurePalette aplikacji; paleta zmiennych CSS', () => {
    const r = engine([]); expect([...r.roles].sort()).toEqual(Object.keys(figurePalette(light)).sort()); expect(r.varSkin).toBe('var(--f-skin)');
  });
  test('zero rozjazdu: rysunek z próbek w przeglądarkowym silniku = rysunek rigu w aplikacji (ten sam kod; odchylenie tylko od zaokrąglenia próbek) — wszystkie widoki, 5 ćwiczeń i 9 pozycji', () => {
    const pal = Object.fromEntries(Object.keys(figurePalette(light)).map(r => [r, `var(--f-${r})`])) as never;
    const keys = ['Back Squat', 'Bench Press (sztanga)', 'Deadlift (sztanga)', 'RDL (sztanga)', 'Goblet Squat'];
    const reqs: { slug: string; u: number; view: string; key: string }[] = [];
    for (const key of keys) for (const view of figureSpec(key)!.views) for (let i = 0; i <= 8; i++) reqs.push({ key, slug: data.en.exercises.find(e => e.id === key)!.slug, u: i / 8, view });
    const got = engine(reqs).inner;
    reqs.forEach((r, i) => {
      const b = svgInner(appShapesAt(figureSpec(r.key)!, r.u, r.view as never), pal).split('\n'); const nums = (x: string) => (x.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
      const lines = got[i].split('\n'); expect([r.key, r.view, r.u, lines.length]).toEqual([r.key, r.view, r.u, b.length]);
      /* kształty o prawie równej głębokości (z) mogą zamienić się kolejnością przez zaokrąglenie próbek — porównanie bez względu na pozycję w liście */
      const left = b.map(nums); const tag = (x: string) => x.replace(/[-\d.]+/g, '#');
      for (const l of lines) { const na = nums(l); const j = left.findIndex((nb, k) => nb.length === na.length && tag(b[k]) === tag(l) && Math.max(0, ...na.map((v, q) => Math.abs(v - nb[q]))) < 0.12); expect([r.key, r.view, r.u, l.slice(0, 40), j >= 0]).toEqual([r.key, r.view, r.u, l.slice(0, 40), true]); left.splice(j, 1); b.splice(j, 1); }
    });
  });
});
