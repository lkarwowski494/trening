/*
 * Figury v2 — nakładka techniki, etap 2: rodziny curl i pull_up (04.11.2026; spec „rysunek pokazuje technikę”, decyzje właściciela 04.11.2026: zawsze widoczne, ≤ 3 linie + 1 łuk na rzut
 * łącznie ze starymi liniami odniesienia, liczba kąta tylko w podpisie, złamana reguła w kolorze błędu, element tylko dla reguły „ustalone” ze zdaniem na karcie wariantu).
 * Rodzaje (docs/20): geometria (łuk = measuredAngle ±1°), niezmienniki (bez tekstu i liczb, limit na rzut, element ⇔ wskazówka na karcie), dane (reguła ze źródłem), kolor błędu, VoiceOver, wygląd.
 * Wzór: tests/figures-v2-nakladka.test.tsx (bench_press).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import * as RN from 'react-native';
import { render, screen, act } from '@testing-library/react-native';
import { ExerciseFigureV2 } from '@/components/ExerciseFigureV2';
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec, frameAt, guideShapes, measuredAngle, measuredSide, overlayShapes, errorBreaksRule, type FigureSpec, type Shape } from '@/lib/figures/v2';
import { OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniqueGeom, techniqueShapes, techniquesFor } from '@/lib/figures/v2/overlay';
import { CURL_TECHNIQUE } from '@/lib/figures/v2/overlay/curl';
import { PULL_UP_TECHNIQUE } from '@/lib/figures/v2/overlay/pull_up';
import { errorsOf, techniquesOf, onDrawingCues, guidesOf, cueIdsOf, errorText } from '@/lib/figures/v2/ui';
import { applyLang } from '@/lib/i18n';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const lib = (key: string) => ({ lib: true as const, libKey: key });
const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock };
const flush = async () => { await act(async () => { await Promise.resolve(); }); };
const keysOf = (family: string) => Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === family; } catch { return false; } });
const CURL_KEYS = keysOf('curl'), PULL_KEYS = keysOf('pull_up');
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const role = (x: Shape): string | undefined => (x.k === 'line' ? x.role : (x as { stroke?: string }).stroke);
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny;

afterEach(() => { applyLang('pl'); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); });

describe('dane: elementy rodzin curl i pull_up ← reguły ze źródłem', () => {
  test('rejestr: curl = curlElbowLimb (limb, łokieć) + curlElbowPlumb (E3: pion przez bark w dół) + curlTrunkRef (E3: segment miednica → bark); pull_up = pullChinBarRef (poziom drążka przez chwyt) + pullPlumbRef (pion pod drążkiem)', () => {
    expect(CURL_TECHNIQUE.map(d => d.id)).toEqual(['curlElbowLimb', 'curlElbowPlumb', 'curlTrunkRef']); expect(TECHNIQUE.curl).toBe(CURL_TECHNIQUE); expect(TECHNIQUE.pull_up).toBe(PULL_UP_TECHNIQUE);
    expect([CURL_TECHNIQUE[0].kind, CURL_TECHNIQUE[0].joint, CURL_TECHNIQUE[0].views]).toEqual(['limb', 'elbow', ['side']]);
    expect([CURL_TECHNIQUE[1].kind, CURL_TECHNIQUE[1].ref, CURL_TECHNIQUE[1].views]).toEqual(['ref', { shape: 'vertical', through: 'shoulder', dir: 'down' }, ['side']]);
    expect([CURL_TECHNIQUE[2].kind, CURL_TECHNIQUE[2].ref, CURL_TECHNIQUE[2].views]).toEqual(['ref', { shape: 'segment', from: 'pelvis', to: 'shoulderC' }, ['side']]);
    expect(PULL_UP_TECHNIQUE.map(d => [d.id, d.kind, d.ref, d.views])).toEqual([['pullChinBarRef', 'ref', { shape: 'horizontal', through: 'grip' }, ['side', 'front']], ['pullPlumbRef', 'ref', { shape: 'vertical', through: 'grip', dir: 'down' }, ['side', 'front']]]);
  });
  test.each([['curl', CURL_TECHNIQUE], ['pull_up', PULL_UP_TECHNIQUE]] as const)('%s: reguła każdego elementu istnieje i jest „ustalone”; każda wskazówka elementu należy do wskazowki_na_reguly reguły', (fam, defs) => {
    for (const d of defs) {
      const r = sens[fam].reguly[d.rule]; expect(r).toBeTruthy(); expect(r.pewnosc).toMatch(/^ustalone/); expect(d.cue.length).toBeGreaterThan(0);
      for (const c of d.cue) expect([c, sens[fam].wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]);
    }
    expect(defs.map(d => d.rule)).toEqual(fam === 'curl' ? ['lokiec_zgina_sie', 'lokiec_przy_tulowiu', 'tulow_nieruchomy'] : ['broda_nad_drazkiem', 'miednica_nie_buja']);
  });
  test('pull_up (łatka badacza po recenzji L-047, 04.11.2026): reguły mają pewnosc; próg brody 0 cm (część wspólna kart: broda co najmniej na wysokości drążka); w wariantach brak duplikatu dlonie_na_drazku', () => {
    const r = sens.pull_up.reguly; expect(r.broda_nad_drazkiem.pewnosc).toMatch(/^ustalone/); expect(r.broda_nad_drazkiem.parametry.margines_cm).toBe(0); expect(r.miednica_nie_buja.pewnosc).toMatch(/^ustalone/);
    for (const [k, v] of Object.entries(r) as [string, { pewnosc?: string }][]) expect([k, typeof v.pewnosc]).toEqual([k, 'string']);
    const sc = sens.pull_up.warianty._scisle as string[]; expect(sc.length).toBe(new Set(sc).size);
  });
});

describe('geometria: łuk = kąt z jointAngles (±1°) w 21 klatkach', () => {
  const withEl = CURL_KEYS.filter(k => techniquesOf(k).includes('curlElbowLimb'));
  test('curl: rozwarcie łuku = measuredAngle (zgięcie łokcia) w każdym ćwiczeniu z elementem; linia zawsze, łuk gdy zgięcie ≥ progu', () => {
    expect(withEl.length).toBeGreaterThan(8);
    for (const k of withEl) { const s = spec(k); const side = measuredSide(s);
      for (const u of US) {
        const f = frameAt(s, u); const g = techniqueGeom('limb', f.sk, side, 'elbow')!; const m = measuredAngle(s, u);
        expect([k, u, m.joint, Math.abs(g.sweepDeg - m.deg) <= 1]).toEqual([k, u, 'elbow', true]);
        const sh = overlayShapes(s, u, 'side', ['curlElbowLimb']); expect([k, u, sh.filter(x => x.k === 'line').length]).toEqual([k, u, 1]);
        expect([k, u, sh.filter(x => x.k === 'poly').length]).toEqual([k, u, g.arc ? 1 : 0]);
      } }
  });
  test('u dołu (wyprost) łuk jest mały lub znika, u góry zgięcie duże: Barbell Curl', () => {
    const s = spec('Barbell Curl'); const sw = (u: number) => techniqueGeom('limb', frameAt(s, u).sk, measuredSide(s), 'elbow')!.sweepDeg;
    expect(sw(0)).toBeLessThan(35); expect(sw(1)).toBeGreaterThan(90);
    expect(overlayShapes(s, 1, 'side', ['curlElbowLimb']).filter(x => x.k === 'poly').length).toBe(1);
  });
  test('rzut z przodu nie dostaje elementu: overlayShapes(front) puste', () => { for (const u of US) expect(overlayShapes(spec('Barbell Curl'), u, 'front', ['curlElbowLimb'])).toEqual([]); });
});

describe('niezmienniki: bez tekstu i liczb, limit elementów na rzut, element ⇔ wskazówka na karcie', () => {
  test('elementy to wyłącznie linie ciągłe i łuki (poly bez wypełnienia), w warstwie nad ciałem, bez pól tekstowych', () => {
    for (const k of [...CURL_KEYS, ...PULL_KEYS]) { const s = spec(k); const ts = techniquesOf(k); for (const v of s.views) for (const u of [0, 0.5, 1]) for (const x of overlayShapes(s, u, v, ts)) {
      expect(['line', 'poly']).toContain(x.k); expect(x.z).toBeGreaterThan(3000); expect(x.id).toMatch(/^(curlElbowLimb(Line|Arc)|curlElbowPlumbLine|curlTrunkRefLine|pullChinBarRefLine|pullPlumbRefLine)$/);
      if (x.k === 'line') expect(x.dash).toBeUndefined(); else expect((x as { fill?: unknown }).fill).toBeUndefined();
      expect(JSON.stringify(x)).not.toMatch(/"(text|label|value)"/);
    } }
  });
  test('limit (W3): ≤ 3 linie i ≤ 1 łuk na rzut — suma linii odniesienia (GUIDES) i nakładki, w każdym ćwiczeniu curl/pull_up, rzucie, klatce i pozie błędu', () => {
    let razem = 0, zNakladka = 0;
    for (const k of [...CURL_KEYS, ...PULL_KEYS]) { const s = spec(k); const g = guidesOf(k), t = techniquesOf(k); const errs = [undefined, ...errorsOf(s).map(e => e.error)];
      for (const v of s.views) for (const u of [0, 0.25, 0.5, 0.75, 1]) for (const e of errs) {
        const all = [...guideShapes(s, u, v, g, e), ...overlayShapes(s, u, v, t, e, g)]; razem++; if (t.length) zNakladka++;
        expect([k, v, u, all.filter(x => x.k === 'line').length <= OVERLAY_MAX_LINES]).toEqual([k, v, u, true]);
        expect([k, v, u, all.filter(x => x.k === 'poly').length <= OVERLAY_MAX_ARCS]).toEqual([k, v, u, true]);
      } }
    expect(razem).toBeGreaterThan(300); expect(zNakladka).toBeGreaterThan(100);
  });
  test('element ⇔ wskazówka na karcie: dla KAŻDEGO ćwiczenia curl/pull_up techniquesOf = elementy, których wskazówka (dowolna z cue) jest na karcie; zdanie elementu istnieje', () => {
    for (const [k, fam, defs] of [...CURL_KEYS.map(k => [k, 'curl', CURL_TECHNIQUE] as const), ...PULL_KEYS.map(k => [k, 'pull_up', PULL_UP_TECHNIQUE] as const)]) {
      const have = new Set(cueIdsOf(k).ids); const want = defs.filter(d => d.cue.some(c => have.has(c))).map(d => d.id);
      expect([k, techniquesOf(k)]).toEqual([k, want]); expect(techniquesFor(fam, have).map(d => d.id)).toEqual(want);
      for (const id of want) expect(errorText(TECHNIQUE[fam].find(d => d.id === id)!.cue.find(c => have.has(c))!).length).toBeGreaterThan(0);
    }
    const E = (...a: string[]) => a; const L = 'curlElbowLimb', P = 'curlElbowPlumb', T = 'curlTrunkRef';
    const want: Record<string, string[]> = { 'Biceps Curl (hantle)': E(L, P, T), 'Barbell Curl': E(L, P, T), 'EZ Bar Curl': E(L, P, T), 'Hammer Curl': E(L, P, T), 'Preacher Curl': E(L), 'Spider Curl': E(L), 'Cable Curl': E(L, P),
      'Incline Curl (hantle)': E(P, T), 'Concentration Curl (hantle)': E(T), 'Bayesian Curl': E(T), 'High Cable Curl': E(T), 'Drag Curl': E(T), 'Reverse Curl': E(P, T), 'Nie ma takiego': E(),
      'Pull Up': E('pullChinBarRef', 'pullPlumbRef'), 'Chin Up': E('pullPlumbRef'), 'Dead Hang': E() };
    for (const [k, w] of Object.entries(want)) expect([k, techniquesOf(k)]).toEqual([k, w]);
    expect(techniquesFor('curl', ['dl.lift'])).toEqual([]); expect(techniquesFor('pull_up', ['pu.pull', 'pu.partial']).map(d => d.id)).toEqual(['pullChinBarRef']); expect(techniquesFor('pull_up', ['pu.partial'])).toEqual([]); expect(techniquesFor('squat', ['curl.dbMove'])).toEqual([]);
  });
  test('ruch bez zmian: id elementów nie występuje w liniach odniesienia', () => {
    for (const k of ['Barbell Curl', 'Pull Up']) { const s = spec(k); for (const v of s.views) for (const x of guideShapes(s, 1, v, guidesOf(k))) expect(x.id).not.toMatch(/Limb/); }
  });
});

describe('kolor błędu: element w roli error tylko wtedy, gdy błąd łamie jego regułę', () => {
  test('silnik z danymi rodziny: reguła złamana → linia (i łuk) w roli error; inna reguła → guide (pozytyw i negatyw), dla każdego elementu curl i pull_up', () => {
    const sk = frameAt(spec('Barbell Curl'), 1).sk; const side = measuredSide(spec('Barbell Curl')); const ctx = (danger: (r: string) => boolean) => ({ joint: 'elbow' as const, side, limbShown: true, danger });
    for (const d of CURL_TECHNIQUE) { const red = techniqueShapes(sk, 'side', [d], ctx(r => r === d.rule)), ok = techniqueShapes(sk, 'side', [d], ctx(r => r === 'inna'));
      expect([d.id, red.length]).toEqual([d.id, d.kind === 'limb' ? 2 : 1]); for (const x of red) expect(role(x)).toBe('error'); for (const x of ok) expect(role(x)).toBe('guide'); }
    const pk = frameAt(spec('Pull Up'), 1).sk; for (const d of PULL_UP_TECHNIQUE) { const red = techniqueShapes(pk, 'side', [d], { ...ctx(r => r === d.rule), side: measuredSide(spec('Pull Up')) }); expect([d.id, red.map(role)]).toEqual([d.id, ['error']]); }
  });
  test('prawdziwe błędy ćwiczeń: kolor elementu = errorBreaksRule(błąd, lokiec_zgina_sie) w każdej pozie błędu (grupa „zakres” — dziś żaden błąd curl jej nie łamie; curl.mis.elbows to grupa „lokcie”)', () => {
    let par = 0;
    for (const k of CURL_KEYS) { const s = spec(k); if (!techniquesOf(k).length) continue;
      for (const { error } of errorsOf(s)) { const broken = errorBreaksRule(s, error, 'lokiec_zgina_sie'); par++;
        for (const u of [0.5, 1]) for (const x of overlayShapes(s, u, 'side', ['curlElbowLimb'], error)) expect([k, error, role(x)]).toEqual([k, error, broken ? 'error' : 'guide']); } }
    expect(par).toBeGreaterThan(5);
    /* E3: kolor każdego elementu rodziny = errorBreaksRule(błąd, reguła elementu) w każdej pozie błędu każdego ćwiczenia curl i pull_up (rzuty elementu) */
    let e3 = 0, czerwone = 0;
    for (const k of [...CURL_KEYS, ...PULL_KEYS]) { const s = spec(k); for (const id of techniquesOf(k)) { const d = TECHNIQUE[s.family].find(x => x.id === id)!; if (d.kind !== 'ref') continue;
      for (const { error } of errorsOf(s)) { const broken = errorBreaksRule(s, error, d.rule); e3++; if (broken) czerwone++;
        for (const v of d.views) for (const u of [0.5, 1]) for (const x of overlayShapes(s, u, v, [id], error)) expect([k, error, id, v, role(x)]).toEqual([k, error, id, v, broken ? 'error' : 'guide']); } } }
    expect(e3).toBeGreaterThan(20); expect(czerwone).toBeGreaterThan(5); /* kolor błędu zapala się: curl.mis.elbows → pion łokcia; pu.partial → poziom drążka; pu.noSwing → pion pod drążkiem */
    const bb = spec('Barbell Curl'); const el = errorsOf(bb).find(e => e.cue === 'curl.mis.elbows')!.error;
    expect([errorBreaksRule(bb, el, 'lokiec_przy_tulowiu'), errorBreaksRule(bb, el, 'lokiec_zgina_sie')]).toEqual([true, false]);
  });
});

describe('VoiceOver: etykieta obrazu „Na rysunku: …” z elementem curl', () => {
  test('onDrawingCues: uginanie — zdania ruchu, łokci i tułowia (3 elementy); podciąganie — broda nad drążkiem i bez bujania; zwis (Dead Hang) — nic', () => {
    expect(onDrawingCues(spec('Barbell Curl'), guidesOf('Barbell Curl'), techniquesOf('Barbell Curl'))).toEqual(['curl.bbMove', 'curl.elbows', 'curl.noSwing']);
    expect(onDrawingCues(spec('Hammer Curl'), guidesOf('Hammer Curl'), techniquesOf('Hammer Curl'))).toEqual(['curl.hammerMove', 'curl.elbows', 'curl.noSwing']);
    expect(onDrawingCues(spec('Pull Up'), guidesOf('Pull Up'), techniquesOf('Pull Up'))).toEqual(['pu.pull', 'pu.noSwing']);
    expect(onDrawingCues(spec('Dead Hang'), guidesOf('Dead Hang'), techniquesOf('Dead Hang'))).toEqual([]);
  });
  test('komponent: etykieta = „Rysunek ruchu: …. Na rysunku: {zdanie}” w PL i EN; podciąganie ze zdaniami elementów', async () => {
    AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(true));
    await render(<ExerciseFigureV2 exercise={lib('Barbell Curl')} name="Uginanie ze sztangą" />); await flush();
    expect(screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel).toBe(`Rysunek ruchu: Uginanie ze sztangą. Na rysunku: ${['curl.bbMove', 'curl.elbows', 'curl.noSwing'].map(errorText).join('; ')}`);
    await render(<ExerciseFigureV2 exercise={lib('Pull Up')} name="Podciąganie" />); await flush();
    expect(screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel).toBe(`Rysunek ruchu: Podciąganie. Na rysunku: ${['pu.pull', 'pu.noSwing'].map(errorText).join('; ')}`);
    applyLang('en'); await render(<ExerciseFigureV2 exercise={lib('Barbell Curl')} name="Barbell curl" />); await flush();
    expect((screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel as string).startsWith('Movement drawing: Barbell curl. On the drawing: ')).toBe(true);
  });
});

describe('curl E3: pion łokcia jest odniesieniem — ramię rozchodzi się z nim dopiero przy błędzie', () => {
  test('Barbell Curl: bez błędu linia ramienia (bark → łokieć) odchylona od pionu przez bark o ≤ 13° (łokieć przy boku), a w pozie curl.mis.elbows o co najmniej 5° więcej w każdej klatce (do ok. 48°), i pion jest wtedy czerwony', () => {
    const s = spec('Barbell Curl'); const err = errorsOf(s).find(e => e.cue === 'curl.mis.elbows')!.error;
    const dev = (e: typeof err | undefined, u: number) => { const sh = overlayShapes(s, u, 'side', ['curlElbowLimb', 'curlElbowPlumb'], e); const l = sh.find(x => x.k === 'line' && x.id === 'curlElbowLimbLine') as Extract<Shape, { k: 'line' }>;
      return Math.abs(Math.atan2(l.b[0] - l.a[0], Math.abs(l.b[1] - l.a[1])) * 180 / Math.PI); };
    for (const u of US) { expect(dev(undefined, u)).toBeLessThanOrEqual(13); expect(dev(err, u)).toBeGreaterThan(dev(undefined, u) + 5); }
    expect(Math.max(...US.map(u => dev(err, u)))).toBeGreaterThan(30);
    expect(overlayShapes(s, 1, 'side', ['curlElbowPlumb'], err).map(role)).toEqual(['error']); expect(overlayShapes(s, 1, 'side', ['curlElbowPlumb']).map(role)).toEqual(['guide']);
  });
});
