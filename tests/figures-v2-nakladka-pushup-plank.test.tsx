/*
 * Figury v2 — nakładka techniki rodziny pushup_plank (09.11.2026, decyzja właściciela docs/18: „żadna rodzina nie wychodzi bez nakładki”). Rodzaje (docs/20): dane (reguły „ustalone” ze źródłem, element ⇔ wskazówka karty),
 * geometria (łuk = measuredAngle ±1°, linia ciała przez bark i kostkę, linia rollout przez bark i kolano), niezmienniki (≤ 3 linie + 1 łuk na rzut, tylko rzut z boku, bez tekstu).
 * Wzór: tests/figures-v2-nakladka-cable-row.test.tsx.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec, frameAt, guideShapes, measuredAngle, measuredJoint, measuredSide, overlayShapes, phasesFor, type FigureSpec, type Shape } from '@/lib/figures/v2';
import { OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniqueGeom, techniquesFor } from '@/lib/figures/v2/overlay';
import { PUSHUP_PLANK_TECHNIQUE } from '@/lib/figures/v2/overlay/pushup_plank';
import { proj } from '@/lib/figures/v2/draw';
import { poseDataFor } from '@/lib/figures/v2/poseData';
import { techniquesOf, guidesOf, errorsOf } from '@/lib/figures/v2/ui';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const KEYS = Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === 'pushup_plank'; } catch { return false; } });
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.pushup_plank;
const E = 'pushupElbowLimb', B = 'pushupBodyLine', R = 'rolloutKneeLine';
/** Elementy na karcie ćwiczenia. 10.11.2026: rodzina ma wpis recenzji „zestawy” (r2, 9 zestawów, commit f72a0126), więc zestawy ogólne liczą się na karcie: ćwiczenia z zestawem plank.brace/push.rigid/plank.noSag dostają pushupBodyLine, a Barbell Rollout from Bench rolloutKneeLine (te same oczekiwania sprawdza niżej test na id wskazówek zestawu); Standing Barbell Rollout i Suspended Fallout nadal bez elementu (reguła „analogia”). */
const WANT: Record<string, string[]> = {
  'Push Up': [E, B], 'Incline Push Up': [E, B], 'Diamond Push Up': [B], 'Inverted Row': [B], 'Plank': [B], 'Decline Push Up': [E],
  'Mountain Climbers': [], 'Plank Shoulder Taps': [B], 'Rollout (sztanga)': [], 'Push-Up Wide': [B], 'Single-Arm Push-Up': [B], 'Suspended Push-Up': [], 'Plyo Push-Up': [] /* wstrzymany 10.11.2026 (V2_WSTRZYMANE, PP-W1): bez rysunku, więc bez elementu; po powrocie [B] */,
  'Close-Grip Push-Up': [B], 'Incline Push-Up Close-Grip': [B], 'Standing Barbell Rollout': [], 'Barbell Rollout from Bench': [R], 'Suspended Fallout': [],
};

describe('dane: elementy pushup_plank ← reguły „ustalone” ze źródłem', () => {
  test('rejestr: TECHNIQUE.pushup_plank = trzy elementy w stałej kolejności (łokieć, linia ciała, linia rollout), tylko rzut z boku', () => {
    expect(TECHNIQUE.pushup_plank).toBe(PUSHUP_PLANK_TECHNIQUE); expect(PUSHUP_PLANK_TECHNIQUE.map(d => d.id)).toEqual([E, B, R]);
    expect(PUSHUP_PLANK_TECHNIQUE.map(d => [d.kind, d.joint, d.ref, d.views])).toEqual([
      ['limb', 'elbow', undefined, ['side']], ['ref', undefined, { shape: 'segment', from: 'shoulder', to: 'ankle' }, ['side']], ['ref', undefined, { shape: 'segment', from: 'shoulder', to: 'knee' }, ['side']]]);
  });
  test('reguła każdego elementu istnieje i jest „ustalone”; każda wskazówka elementu należy do wskazowki_na_reguly tej reguły', () => {
    for (const d of PUSHUP_PLANK_TECHNIQUE) { const r = sens.reguly[d.rule]; expect(r).toBeTruthy(); expect(r.pewnosc).toMatch(/^ustalone/); for (const c of d.cue) expect([c, sens.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]); }
    expect(PUSHUP_PLANK_TECHNIQUE.map(d => d.rule)).toEqual(['pompka_zakres', 'cialo_w_linii', 'rollout_linia_kolana']);
    /* bez elementu: reguły „analogia”/„konwencja” (rollout z kostek, łokcie w bok) */
    expect(sens.reguly.rollout_linia_kostki.pewnosc).toBe('analogia'); expect(sens.reguly.lokcie_nie_w_bok.pewnosc).toMatch(/^konwencja/);
  });
  test('element ⇔ wskazówka karty i reguła wariantu: techniquesOf = tabela dla KAŻDEGO ćwiczenia rodziny (18), guidesOf puste', () => {
    expect(KEYS.length).toBe(18); expect(Object.keys(WANT).sort()).toEqual([...KEYS].sort());
    for (const [k, w] of Object.entries(WANT)) { expect([k, techniquesOf(k)]).toEqual([k, w]); expect([k, guidesOf(k)]).toEqual([k, []]); }
    /* zestawy ogólne (cue-sets.json): po recenzji „zestawy” dostaną elementy wg reguł wariantu */
    for (const k of ['Close-Grip Push-Up', 'Push-Up Wide', 'Single-Arm Push-Up', 'Plyo Push-Up', 'Incline Push-Up Close-Grip']) expect([k, techniquesFor('pushup_plank', ['plank.brace', 'push.rigid'], k).map(d => d.id)]).toEqual([k, [B]]);
    expect(techniquesFor('pushup_plank', ['plank.brace', 'plank.noSag'], 'Plank Shoulder Taps').map(d => d.id)).toEqual([B]);
    expect(techniquesFor('pushup_plank', ['ro.back', 'plank.brace'], 'Barbell Rollout from Bench').map(d => d.id)).toEqual([R]);
    expect(techniquesFor('pushup_plank', ['ro.back', 'plank.brace'], 'Standing Barbell Rollout')).toEqual([]); /* odmiana ze stóp: reguła „analogia” */
    expect(techniquesFor('pushup_plank', ['mc.stable'], 'Mountain Climbers')).toEqual([]); /* miednica_stala_wysokosc: bez elementu */
    expect(techniquesFor('pushup_plank', ['push.move'], 'Suspended Push-Up')).toEqual([]);
  });
});

describe('geometria i niezmienniki nakładki pushup_plank', () => {
  test('łuk łokcia = measuredAngle (±1°) w każdej klatce ćwiczeń z elementem ruchu (Push Up, Incline Push Up, Decline Push Up); jedna linia i łuk, gdy rozwarcie ≥ progu', () => {
    for (const k of ['Push Up', 'Incline Push Up', 'Decline Push Up']) for (const u of US) {
      const s = spec(k), f = frameAt(s, u), m = measuredAngle(s, u); expect([k, m.joint]).toEqual([k, 'elbow']);
      const g = techniqueGeom('limb', f.sk, measuredSide(s), 'elbow')!; expect([k, u, Math.abs(g.sweepDeg - m.deg) <= 1]).toEqual([k, u, true]);
      const sh = overlayShapes(s, u, 'side', [E]); expect([k, u, sh.filter(x => x.k === 'line').length]).toEqual([k, u, 1]); expect([k, u, sh.filter(x => x.k === 'poly').length]).toEqual([k, u, g.arc ? 1 : 0]);
    }
  });
  test('zakres łokcia na końcach ruchu zgodny z regułą pompka_zakres (≤ 20° na górze, ≥ 85° na dole) — Push Up', () => {
    const s = spec('Push Up'); expect(measuredAngle(s, 0).deg).toBeLessThanOrEqual(sens.reguly.pompka_zakres.parametry.max_min_deg); expect(measuredAngle(s, 1).deg).toBeGreaterThanOrEqual(sens.reguly.pompka_zakres.parametry.min_max_deg);
  });
  test('linia ciała: jedna linia przez bark i kostkę (odcinek przedłużony za kostkę), bez tekstu; miednica ≤ 6 cm od linii na całym ruchu (cialo_w_linii); z przodu i z góry brak nakładki', () => {
    const lim = sens.reguly.cialo_w_linii.parametry.max_cm;
    for (const k of ['Push Up', 'Incline Push Up', 'Plank', 'Inverted Row']) for (const u of US) {
      const s = spec(k), sh = overlayShapes(s, u, 'side', [B]); expect([k, u, sh.length]).toEqual([k, u, 1]); const l = sh[0] as Extract<Shape, { k: 'line' }>; expect(JSON.stringify(sh)).not.toMatch(/"text"/);
      const sk = frameAt(s, u).sk, side = measuredSide(s), S = proj(sk.arms[side].shoulder, 'side'), A = proj(sk.legs[side].ankle, 'side'), P = proj(sk.pelvis, 'side');
      expect(l.a[0]).toBeCloseTo(S[0], 6); expect(l.a[1]).toBeCloseTo(S[1], 6);
      const d: [number, number] = [l.b[0] - l.a[0], l.b[1] - l.a[1]], n = Math.hypot(d[0], d[1]); const dist = (p: [number, number]) => Math.abs(d[0] * (p[1] - l.a[1]) - d[1] * (p[0] - l.a[0])) / n;
      expect([k, u, dist(A as [number, number]) < 1e-6]).toEqual([k, u, true]); expect([k, u, n > Math.hypot(A[0] - S[0], A[1] - S[1])]).toEqual([k, u, true]);
      expect([k, u, dist(P as [number, number]) <= lim]).toEqual([k, u, true]);
      for (const v of ['front', 'top'] as const) expect(overlayShapes(s, u, v, techniquesOf(k))).toEqual([]);
    }
  });
  test('linia rollout: jedna linia przez bark i kolano (Barbell Rollout from Bench), bez tekstu, tylko z boku', () => {
    for (const u of US) { const s = spec('Barbell Rollout from Bench'), sh = overlayShapes(s, u, 'side', [R]); expect(sh.length).toBe(1); const l = sh[0] as Extract<Shape, { k: 'line' }>;
      const sk = frameAt(s, u).sk, side = measuredSide(s), S = proj(sk.arms[side].shoulder, 'side'), K = proj(sk.legs[side].knee, 'side'); expect(l.a[0]).toBeCloseTo(S[0], 6); expect(l.a[1]).toBeCloseTo(S[1], 6);
      const d = [l.b[0] - l.a[0], l.b[1] - l.a[1]], n = Math.hypot(d[0], d[1]); expect(Math.abs(d[0] * (K[1] - l.a[1]) - d[1] * (K[0] - l.a[0])) / n).toBeLessThan(1e-6);
      expect(JSON.stringify(sh)).not.toMatch(/"text"/); expect(overlayShapes(s, u, 'front', [R])).toEqual([]); expect(overlayShapes(s, u, 'top', [R])).toEqual([]); }
  });
  test('limit czytelności: ≤ 3 linie i ≤ 1 łuk na rzut, we wszystkich ćwiczeniach, klatkach i błędach ', () => {
    for (const k of KEYS) { const s = spec(k), g = guidesOf(k);
      for (const u of US) for (const e of [undefined, ...errorsOf(s).map(x => x.error)]) { const all = [...guideShapes(s, u, 'side', g, e), ...overlayShapes(s, u, 'side', techniquesOf(k), e, g)];
        expect([k, u, all.filter(x => x.k === 'line').length <= OVERLAY_MAX_LINES]).toEqual([k, u, true]); expect([k, u, all.filter(x => x.k === 'poly').length <= OVERLAY_MAX_ARCS]).toEqual([k, u, true]); } }
  });
});

describe('prezentacja rodziny (DATA_UI): fazy licznika i mierzony staw — pompki to opuszczanie (u 0 → 1, 2 s) i wypychanie (1 s)', () => {
  const ph = (k: string) => phasesFor(spec(k)).map(p => [p.name, p.ms]);
  test('pompki i rollouty: Opuszczanie 2 s → Wypychanie 1 s, mierzony łokieć (pompki) albo biodro / ramię (rollouty, Suspended Fallout)', () => {
    for (const k of ['Push Up', 'Push-Up Wide', 'Incline Push Up', 'Decline Push Up', 'Single-Arm Push-Up', 'Suspended Push-Up', 'Rollout (sztanga)', 'Standing Barbell Rollout', 'Suspended Fallout']) {
      expect([k, spec(k).lowerFirst]).toEqual([k, true]); expect([k, ph(k)]).toEqual([k, [['Opuszczanie', 2000], ['Pauza', 500], ['Wypychanie', 1000], ['Pauza', 500]]]); }
    for (const k of ['Push Up', 'Diamond Push Up', 'Single-Arm Push-Up']) expect([k, measuredJoint(spec(k))]).toEqual([k, 'elbow']);
    for (const k of ['Rollout (sztanga)', 'Barbell Rollout from Bench', 'Standing Barbell Rollout']) expect([k, measuredJoint(spec(k))]).toEqual([k, 'hip']); expect(measuredJoint(spec('Suspended Fallout'))).toBe('shElev');
  });
  test('Inverted Row: Podciąganie 1 s → Opuszczanie 2 s; Mountain Climbers i Plank Shoulder Taps: „Naprzemiennie” bez kierunku; Plank: izometria (jedna pozycja)', () => {
    /* lot: pętla jednokierunkowa — jedna faza „Skok” bez kierunku (guard tests/figures-v2-kierunek-u.test.ts) */
    expect([spec('Plyo Push-Up').lowerFirst, ph('Plyo Push-Up')[0][0], poseDataFor('Plyo Push-Up', 'pushup_plank')!.petla]).toEqual([false, 'Skok', 'jednokierunkowa']);
    expect(ph('Inverted Row')).toEqual([['Podciąganie', 1000], ['Pauza', 500], ['Opuszczanie', 2000], ['Pauza', 500]]);
    for (const k of ['Mountain Climbers', 'Plank Shoulder Taps']) { expect([k, spec(k).lowerFirst, ph(k)[0][0]]).toEqual([k, false, 'Naprzemiennie']); }
    expect(spec('Plank').static).toBe(true); for (const k of KEYS.filter(x => x !== 'Plank')) expect([k, spec(k).static]).toEqual([k, false]);
  });
});
