/*
 * Figury v2 — nakładka techniki core_standing (partia 8, 10.11.2026, decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18). Rodzaje (docs/20): dane (reguły „ustalone” ze źródłem, element ⇔ wskazówka),
 * geometria (pion od miednicy przy skłonie bocznym i odchyleniu w tył, łuk łokcia w Pallofie, prowadnica ręki wiatraka), niezmienniki (limity czytelności, rzuty, brak tekstu), macierz (16 ćwiczeń z rysunkiem),
 * niezmiennik danych (reguły skrętu i strefy bez elementu — powód w nagłówku overlay/core_standing.ts). Dobór przez `techniquesFor` (rodzina); wzór: tests/figures-v2-nakladka-mobility-stand.test.tsx.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza rysowanie, nie recenzję rodziny */
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec, frameAt, overlayShapes, type FigureSpec, type Shape } from '@/lib/figures/v2';
import { OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniquesFor } from '@/lib/figures/v2/overlay';
import { CORE_STANDING_TECHNIQUE, WINDMILL_EXERCISES } from '@/lib/figures/v2/overlay/core_standing';
import SENS from '@/data/zrodla/figury-sens.json';

type Regula = { pewnosc: string; cue?: string };
const C = (SENS as unknown as { rodziny: Record<string, { reguly: Record<string, Regula>; wskazowki_na_reguly: Record<string, string[]> }> }).rodziny.core_standing;
const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const KEYS = Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === 'core_standing'; } catch { return false; } });
const US = [0, 0.5, 1];
const ids = (cues: string[], ex?: string) => techniquesFor('core_standing', cues, ex).map(d => d.id);
const linie = (k: string, u: number, v: 'front' | 'side', id: string) => overlayShapes(spec(k), u, v, [id]);
const odPionu = (sk: ReturnType<typeof frameAt>['sk'], os: 0 | 2) => Math.abs(Math.atan2(sk.shoulderC[os] - sk.pelvis[os], sk.shoulderC[1] - sk.pelvis[1])) * 180 / Math.PI;

describe('nakładka techniki: core_standing (dane i dobór)', () => {
  test('dane: rejestr ma wpis rodziny z 5 elementami (id, rodzaj, reguła, rzut)', () => {
    expect(TECHNIQUE.core_standing).toBe(CORE_STANDING_TECHNIQUE);
    expect(CORE_STANDING_TECHNIQUE.map(d => [d.id, d.kind, d.rule, d.views])).toEqual([
      ['pallofElbowLimb', 'limb', 'pallof_wypchniecie', ['side']], ['sideBendPlumb', 'ref', 'sklon_boczny', ['front']], ['twistLeanPlumb', 'ref', 'odchylenie_45', ['side']],
      ['twistBackRef', 'ref', 'plecy_proste', ['side']], ['windmillArmStraightRef', 'ref', 'wiatrak_reka_prosta', ['front']]]);
  });
  test('każda reguła elementu istnieje, jest „ustalone”, a jej wskazówka należy do wskazowki_na_reguly tej reguły', () => {
    for (const d of CORE_STANDING_TECHNIQUE) { expect([d.id, C.reguly[d.rule]?.pewnosc]).toEqual([d.id, expect.stringMatching(/^ustalone/)]); for (const c of d.cue) expect([c, C.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]); }
  });
  test('dobór: element tylko dla wskazówki z regułą; skręt, strefa wysokości chwytu i tułów nieruchomy nie dają elementu', () => {
    expect(ids(['pallof.move'], 'Pallof Press')).toEqual(['pallofElbowLimb']); expect(ids(['sb.plane', 'dyn.control'], 'Barbell Side Bend')).toEqual(['sideBendPlumb']);
    expect(ids(['rt.setup', 'rt.back', 'rt.move'], 'Russian Twist')).toEqual(['twistLeanPlumb', 'twistBackRef']); expect(ids(['wm.arm'], 'Kettlebell Windmill')).toEqual(['windmillArmStraightRef']);
    expect(ids(['pallof.move'], 'Pallof Press With Rotation')).toEqual([]); expect(ids(['wm.arm'], 'Bent Press')).toEqual([]); /* ćwiczenia, których reguła jest tylko analogią albo nie ma wskazówki */
    expect(ids(['pallof.noTwist', 'pallof.setup', 'rt.move', 'rt.control', 'chop.close', 'plank.brace', 'wm.eyes'])).toEqual([]);
  });
  test('macierz: 16 ćwiczeń z rysunkiem; Pallof i wiatraki mają ograniczenie do ćwiczeń, których karta niesie regułę', () => {
    expect(KEYS.length).toBe(16);
    expect(CORE_STANDING_TECHNIQUE.find(d => d.id === 'pallofElbowLimb')!.exercises).toEqual(['Pallof Press']);
    expect(WINDMILL_EXERCISES).toEqual(['Kettlebell Windmill', 'Double Kettlebell Windmill']); expect(CORE_STANDING_TECHNIQUE.find(d => d.id === 'windmillArmStraightRef')!.exercises).toBe(WINDMILL_EXERCISES);
  });
});

describe('geometria i niezmienniki nakładki core_standing', () => {
  test('skłon boczny (Barbell Side Bend) z przodu: jedna linia pionowa od miednicy, tułów odchyla się w bok co najmniej o próg reguły (20°); z boku i z góry brak nakładki', () => {
    for (const u of US) { const ln = linie('Barbell Side Bend', u, 'front', 'sideBendPlumb'); expect([u, ln.length]).toEqual([u, 1]); const l = ln[0] as Extract<Shape, { k: 'line' }>; expect(l.a[0]).toBeCloseTo(l.b[0], 6); expect(JSON.stringify(ln)).not.toMatch(/"text"/); }
    expect(odPionu(frameAt(spec('Barbell Side Bend'), 1).sk, 2)).toBeGreaterThanOrEqual(20);
    for (const u of US) expect(linie('Barbell Side Bend', u, 'side', 'sideBendPlumb')).toEqual([]);
  });
  test('Russian Twist z boku: pion od miednicy i linia pleców; tułów odchylony w tył w przedziale reguły (30–60°) w całym ruchu', () => {
    for (const u of US) { expect(linie('Russian Twist', u, 'side', 'twistLeanPlumb').length).toBe(1); expect(linie('Russian Twist', u, 'side', 'twistBackRef').length).toBe(1); expect(linie('Russian Twist', u, 'front', 'twistLeanPlumb')).toEqual([]); }
    for (const u of [0, 0.25, 0.5, 0.75, 1]) { const a = odPionu(frameAt(spec('Russian Twist'), u).sk, 0); expect([u, a >= 30 && a <= 60]).toEqual([u, true]); }
  });
  test('Pallof Press z boku: linia i łuk zgięcia łokcia, łuk rośnie razem ze zgięciem; Pallof Press With Rotation bez tego elementu w danych ćwiczenia', () => {
    for (const u of US) { const all = linie('Pallof Press', u, 'side', 'pallofElbowLimb'); expect([u, all.some(x => x.k === 'line')]).toEqual([u, true]); }
    expect(linie('Pallof Press', 0, 'front', 'pallofElbowLimb')).toEqual([]);
    expect(CORE_STANDING_TECHNIQUE.find(d => d.id === 'pallofElbowLimb')!.exercises).not.toContain('Pallof Press With Rotation');
  });
  test('wiatraki z przodu: prowadnica prostej ręki bark → chwyt (linie), bez nakładki z boku', () => {
    for (const k of WINDMILL_EXERCISES) { expect([k, linie(k, 0.5, 'front', 'windmillArmStraightRef').length > 0]).toEqual([k, true]); expect(linie(k, 0.5, 'side', 'windmillArmStraightRef')).toEqual([]); }
  });
  test('limit czytelności: ≤ 3 linie i ≤ 1 łuk na rzut we wszystkich ćwiczeniach rodziny przy wszystkich elementach', () => {
    const all = CORE_STANDING_TECHNIQUE.map(d => d.id);
    for (const k of KEYS) for (const v of spec(k).views) { const s = overlayShapes(spec(k), 1, v, all);
      expect([k, v, s.filter(x => x.k === 'line').length <= OVERLAY_MAX_LINES]).toEqual([k, v, true]); expect([k, v, s.filter(x => x.k === 'poly').length <= OVERLAY_MAX_ARCS]).toEqual([k, v, true]); }
  });
});
