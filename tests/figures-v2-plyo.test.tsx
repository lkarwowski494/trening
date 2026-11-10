/*
 * Figury v2 — rodzina plyo (10.11.2026, partia 6 linii 1.1; włączenie rodziny + nakładka techniki wg decyzji właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18).
 * Rodzaje (docs/20): dane (27 ćwiczeń z rysunkiem, pętla jednokierunkowa, rzut z boku i z przodu), logika (jedna faza „Skok”, staw kolano albo biodro), geometria (stopy na podporze na starcie i na końcu,
 * lot obu stóp ≥ 3 cm w ćwiczeniach z regułą faza_lotu — z negatywem; ugięcie po lądowaniu wg reguły miekkie_ladowanie), nakładka (rejestr elementów ← reguły „ustalone”, element rysuje się
 * tylko przy wskazówce na karcie i regule wariantu; zamach rąk nie przy podskokach i skoku ze sztangą), regresja (reguły bez „ustalone” nie mają elementu).
 * Nie jest strażnikiem procesu — przypadek „gałąź z wcześniejszymi zmianami” (L-080) nie dotyczy.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { figureSpec, frameAt, keyframeFrame, phasesFor, measuredJoint, jointAngles, overlayShapes, FAMILY, type PoseData } from '@/lib/figures/v2';
import { TECHNIQUE } from '@/lib/figures/v2/overlay';
import { PLYO_TECHNIQUE } from '@/lib/figures/v2/overlay/plyo';
import { techniquesOf } from '@/lib/figures/v2/ui';

const poses = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/plyo.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.plyo;
const NAMES = Object.keys(poses);
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const regulyWariantu = (k: string): string[] => { const w = sens.warianty[k]; return typeof w === 'string' ? sens.warianty[w] : w; };

type Prop = { k: string; x0?: number; x1?: number; top?: number; seatFrom?: number[]; legH?: number };
/** Wysokość podpory pod punktem x (podłoga 0, skrzynia: top w granicach x0–x1). */
const podpora = (props: Prop[], x: number): number => Math.max(0, ...props.filter(p => p.k === 'box' && x >= p.x0! - 1 && x <= p.x1! + 1).map(p => p.top!));
/** Najniższy punkt stopy (pięta, palce) nad podporą pod nim (cm); `dy` ≠ 0 tylko w teście negatywnym. */
function nadPodpora(d: PoseData, u: number, s: 'R' | 'L', dy = 0): number {
  const f = keyframeFrame(d, u); const L = f.sk.legs[s]; const props = f.props as unknown as Prop[];
  return Math.min(...[L.heel, L.toe].map(p => p[1] + dy - podpora(props, p[0])));
}
const naPodporze = (d: PoseData, u: number, dy = 0) => (['R', 'L'] as const).some(s => nadPodpora(d, u, s, dy) <= 2);
const lot = (d: PoseData, dy = 0) => US.some(u => (['R', 'L'] as const).every(s => nadPodpora(d, u, s, dy) >= 3));

describe('dane: rodzina plyo', () => {
  test('27 ćwiczeń z rysunkiem v2, rodzina gotowa, rzut z boku i z przodu, każde w pętli jednokierunkowej', () => {
    expect(NAMES).toHaveLength(27); expect(FAMILY.plyo.status).toBe('ready');
    for (const k of NAMES) { const s = figureSpec(k)!; expect([k, s.family, s.views]).toEqual([k, 'plyo', ['side', 'front']]); expect([k, poses[k].petla]).toEqual([k, 'jednokierunkowa']); }
  });
  test('Kneeling Jump Squat (zestaw „open”, bez pozy) nie ma rysunku', () => { expect(figureSpec('Kneeling Jump Squat')).toBeNull(); });
  test('fazy: jedna faza „Skok” (bez sekund), mierzony staw kolano albo biodro', () => {
    for (const k of NAMES) { const s = figureSpec(k)!; expect([k, phasesFor(s).map(p => p.name).filter(n => n !== 'Pauza')]).toEqual([k, ['Skok']]); expect(['knee', 'hip']).toContain(measuredJoint(s)); }
  });
});

describe('geometria: podpora, lot, lądowanie', () => {
  test.each(NAMES)('%s: na starcie i na końcu co najmniej jedna stopa na podporze (podłoga albo skrzynia, ≤ 2 cm)', k => {
    expect([k, naPodporze(poses[k], 0), naPodporze(poses[k], 1)]).toEqual([k, true, true]);
  });
  const NEG = ['Jump Squat', 'Box Jump', 'Depth Jump', 'Broad Jump']; /* start na podłodze i na skrzyni */
  test('negatyw: stopy uniesione o 6 cm nie są na podporze', () => { for (const k of NEG) expect([k, naPodporze(poses[k], 0, 6)]).toEqual([k, false]); });
  test.each(NAMES.filter(k => regulyWariantu(k).includes('faza_lotu')))('%s: lot — obie stopy ≥ 3 cm nad podporą w którymś kadrze (reguła faza_lotu)', k => { expect([k, lot(poses[k])]).toEqual([k, true]); });
  test('negatyw: lot znika, gdy stopy obniżyć o 40 cm (miara nie przechodzi zawsze)', () => { expect(['Jump Squat', 'Broad Jump'].filter(k => lot(poses[k], -40))).toEqual([]); /* skoki z podłogi na podłogę */ });
  test.each(NAMES.filter(k => regulyWariantu(k).includes('miekkie_ladowanie')))('%s: po lądowaniu (u = 1) kolano i biodro ugięte co najmniej jak w regule miekkie_ladowanie', k => {
    const p = sens.reguly.miekkie_ladowanie.parametry; const a = (['R', 'L'] as const).map(s => jointAngles(frameAt(figureSpec(k)!, 1).sk, s));
    expect([k, a.some(x => x.knee >= p.min_kolano_deg && x.hip >= p.min_biodro_deg)]).toEqual([k, true]);
  });
});

const stare = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/plyo-r1-przed-poprawka.json'), 'utf8')).cwiczenia as Record<string, PoseData>; /* pozy sprzed poprawek r1 — negatyw */
const GRID = Array.from({ length: 101 }, (_, i) => i / 100);
const wLocie = (d: PoseData, u: number) => (['R', 'L'] as const).every(s => nadPodpora(d, u, s) >= 3);
/** r1 W1: najdalej w tył wysunięty chwyt względem barku w ugięciu (u ≤ 0,25), cm (ujemne = za barkiem). */
const zamachWTyl = (d: PoseData) => Math.min(...GRID.filter(u => u <= 0.25).map(u => { const f = keyframeFrame(d, u); return f.sk.arms.R.grip[0] - f.sk.arms.R.shoulder[0]; }));
/** r1 W2: w locie największe zgięcie kolana i najmniejsza odległość pięta–miednica nogi `s`. */
const pietaWLocie = (d: PoseData, s: 'R' | 'L') => { let k = 0, dd = 1e9; for (const u of GRID.filter(x => wLocie(d, x))) { const f = keyframeFrame(d, u); k = Math.max(k, jointAngles(f.sk, s).knee); const h = f.sk.legs[s].heel; dd = Math.min(dd, Math.hypot(h[0] - f.sk.pelvis[0], h[1] - f.sk.pelvis[1], h[2] - f.sk.pelvis[2])); } return { k, dd }; };
describe('ruch: zamach rąk i pięty do pośladków (r1 W1–W2, 10.11.2026)', () => {
  test('W1 Broad Jump: w ugięciu dłonie co najmniej 15 cm za barkiem (karta: „zamach rękami w tył”)', () => { expect(zamachWTyl(poses['Broad Jump'])).toBeLessThanOrEqual(-15); });
  test.each([['Double Leg Butt Kick', 'R'], ['Double Leg Butt Kick', 'L'], ['Single Leg Butt Kick', 'L']] as const)('W2 %s (noga %s): w locie kolano ≥ 120° i pięta ≤ 30 cm od miednicy', (k, s) => {
    const m = pietaWLocie(poses[k], s); expect([k, s, m.k >= 120, m.dd <= 30]).toEqual([k, s, true, true]);
  });
  test('negatyw: pozy sprzed poprawek (r1) oblewają W1 i W2', () => {
    expect(zamachWTyl(stare['Broad Jump'])).toBeGreaterThan(-15);
    for (const [k, s] of [['Double Leg Butt Kick', 'R'], ['Single Leg Butt Kick', 'L']] as const) { const m = pietaWLocie(stare[k], s); expect([k, m.k >= 120 && m.dd <= 30]).toEqual([k, false]); }
  });
});

describe('nakładka: elementy rodziny ← reguły „ustalone”', () => {
  test('rejestr: łuk stawu mierzonego (miękkie lądowanie, z boku) i poziom barków (zamach rąk); TECHNIQUE.plyo wskazuje tę tablicę', () => {
    expect(PLYO_TECHNIQUE.map(d => [d.id, d.kind, d.rule, d.views])).toEqual([['plyoLandLimb', 'limb', 'miekkie_ladowanie', ['side']], ['plyoShoulderLevelRef', 'ref', 'zamach_rak', ['side', 'front']]]);
    expect(TECHNIQUE.plyo).toBe(PLYO_TECHNIQUE);
  });
  test('reguły elementów są „ustalone”, a każda wskazówka elementu należy do wskazowki_na_reguly tej reguły', () => {
    for (const d of PLYO_TECHNIQUE) { expect(sens.reguly[d.rule].pewnosc).toMatch(/^ustalone/); for (const c of d.cue) expect([c, sens.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]); }
  });
  test('regresja: faza_lotu (definicja), kolana_do_klatki (jedno źródło) i wyprost_przy_wybiciu (drugi łuk ponad limit) nie mają elementu', () => {
    const reguly = PLYO_TECHNIQUE.map(d => d.rule); for (const r of ['faza_lotu', 'kolana_do_klatki', 'wyprost_przy_wybiciu']) expect(reguly).not.toContain(r);
  });
  test('element rysuje się tylko przy regule wariantu: zamach rąk nie przy podskokach i skoku ze sztangą; każde ćwiczenie ma co najmniej jeden element na rysunku', () => {
    for (const k of NAMES) {
      const ids = techniquesOf(k); const s = figureSpec(k)!; const r = regulyWariantu(k);
      if (!r.includes('zamach_rak')) expect([k, ids]).toEqual([k, expect.not.arrayContaining(['plyoShoulderLevelRef'])]);
      expect([k, s.views.some(v => US.some(u => overlayShapes(s, u, v, ids).length > 0))]).toEqual([k, true]);
    }
    expect(NAMES.filter(k => techniquesOf(k).includes('plyoShoulderLevelRef')).length).toBeGreaterThan(5); /* skoki z zamachem rąk mają poziom barków */
    expect(techniquesOf('Weighted Jump Squat')).not.toContain('plyoShoulderLevelRef'); expect(techniquesOf('Front Cone Hops')).not.toContain('plyoShoulderLevelRef');
  });
});
