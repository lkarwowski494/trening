/*
 * Figury v2 — nakładka techniki rodziny dip (09.11.2026, partia 4 linii 1.1; decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18).
 * Rodzaje (docs/20): dane (reguła `zakres` ze źródłem „ustalone”, wskazówki elementu ∈ wskazowki_na_reguly), logika (element ⇔ wskazówka na karcie i reguła wariantu),
 * geometria (łuk = measuredAngle ±1° w 21 klatkach), niezmienniki (bez tekstu, limit linii i łuków na rzut, tylko rzut z boku), regresja (reguła bez „ustalone” albo bez zdania na karcie nie ma elementu).
 * Wzór: tests/figures-v2-nakladka-triceps-olympic.test.tsx.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { figureSpec, frameAt, guideShapes, measuredAngle, measuredSide, overlayShapes, type FigureSpec } from '@/lib/figures/v2';
import { OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniqueGeom, techniquesFor } from '@/lib/figures/v2/overlay';
import { DIP_TECHNIQUE } from '@/lib/figures/v2/overlay/dip';
import { errorText, guidesOf, cueIdsOf, techniquesOf } from '@/lib/figures/v2/ui';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.dip;
const DIP_KEYS = ['Chest Dip', 'Triceps Dip', 'Ring Dips', 'Dip Machine', 'Triceps Dips (ławka)'];
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const E = 'dipElbowLimb';

describe('dane: element rodziny dip ← reguła ze źródłem', () => {
  test('rejestr: jeden element kończyny (łokieć, rzut z boku, reguła zakres); TECHNIQUE.dip wskazuje tę tablicę', () => {
    expect(DIP_TECHNIQUE.map(d => [d.id, d.kind, d.joint, d.rule, d.views, d.ref])).toEqual([[E, 'limb', 'elbow', 'zakres', ['side'], undefined]]);
    expect(TECHNIQUE.dip).toBe(DIP_TECHNIQUE);
  });
  test('reguła elementu jest „ustalone”, a każda jego wskazówka należy do wskazowki_na_reguly tej reguły', () => {
    for (const d of DIP_TECHNIQUE) {
      expect(sens.reguly[d.rule].pewnosc).toMatch(/^ustalone/); expect(d.cue.length).toBeGreaterThan(0);
      for (const c of d.cue) expect([c, sens.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]);
    }
  });
  test('tulow_pion (pochylenie tułowia) NIE ma elementu: jej wskazówka bdip.move mówi tylko o łokciach, a klucza wskazowki_na_reguly dla tułowia nie ma', () => {
    expect(DIP_TECHNIQUE.map(d => d.rule)).not.toContain('tulow_pion');
    expect(Object.values(sens.wskazowki_na_reguly as Record<string, string[]>).flat()).not.toContain('tulow_pion');
  });
});

describe('element ⇔ wskazówka na karcie i reguła wariantu: tabela ćwiczeń', () => {
  test('element wynika ze zdania bdip.* i reguły zakres wariantu: karta własna ławki od razu; Triceps Dip, Ring Dips, Dip Machine mają bdip.* w zestawie ogólnym (element dopiero z wpisem „zestawy” po recenzji — dziś techniquesOf = []); Chest Dip (karta własna dip.move) nie ma zdania reguły → brak elementu', () => {
    const zestawy = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib/figures/v2/cue-sets.json'), 'utf8')).items;
    expect(techniquesOf('Triceps Dips (ławka)')).toEqual([E]); expect(techniquesOf('Chest Dip')).toEqual([]);
    for (const k of ['Triceps Dip', 'Ring Dips', 'Dip Machine']) { expect([k, zestawy[k].b, DIP_TECHNIQUE[0].cue.every(c => zestawy[k].ok.includes(c))]).toEqual([k, 'general', true]); expect(techniquesFor('dip', zestawy[k].ok, k).map(d => d.id)).toEqual([E]); }
    for (const k of DIP_KEYS) { const ma = cueIdsOf(k).ids.some(c => DIP_TECHNIQUE[0].cue.includes(c)); expect([k, ma]).toEqual([k, k === 'Triceps Dips (ławka)']); }
    expect(techniquesFor('dip', cueIdsOf('Chest Dip').ids, 'Chest Dip')).toEqual([]); expect(errorText('bdip.move').length).toBeGreaterThan(0);
  });
  test('techniquesFor: bez wskazówki ruchu albo z cudzą wskazówką → nic; wariant z regułą zakres + wskazówka → element', () => {
    expect(techniquesFor('dip', ['dip.move'], 'Chest Dip')).toEqual([]); expect(techniquesFor('dip', ['bdip.move'], 'Chest Dip').map(d => d.id)).toEqual([E]);
    expect(techniquesFor('dip', ['dl.lift'])).toEqual([]); expect(techniquesFor('dip', ['bdip.setup', 'bdip.easier'])).toEqual([]);
  });
});

describe('geometria i niezmienniki (Triceps Dips (ławka))', () => {
  const K = 'Triceps Dips (ławka)'; const s = () => spec(K);
  test('łuk = measuredAngle (±1°) w 21 klatkach: linia zawsze, łuk gdy zgięcie ≥ progu; zgięcie na górze ≤ 25°, na dole ≥ 80° (reguła zakres)', () => {
    const side = measuredSide(s()); let luki = 0;
    for (const u of US) {
      const m = measuredAngle(s(), u); expect(m.joint).toBe('elbow'); const g = techniqueGeom('limb', frameAt(s(), u).sk, side, 'elbow')!; expect([u, Math.abs(g.sweepDeg - m.deg) <= 1]).toEqual([u, true]);
      const sh = overlayShapes(s(), u, 'side', [E]); expect([u, sh.filter(x => x.k === 'line').length]).toEqual([u, 1]); expect([u, sh.filter(x => x.k === 'poly').length]).toEqual([u, g.arc ? 1 : 0]); if (g.arc) luki++;
    }
    expect(luki).toBeGreaterThan(10); expect(measuredAngle(s(), 0).deg).toBeLessThanOrEqual(25); expect(measuredAngle(s(), 1).deg).toBeGreaterThanOrEqual(80);
  });
  test.each(['Triceps Dip', 'Ring Dips', 'Dip Machine'])('%s (element po recenzji zestawu): linia w każdej klatce, łuk = measuredAngle ±1°, mierzony staw = łokieć', k => {
    const sp = spec(k); const side = measuredSide(sp);
    for (const u of US) { const m = measuredAngle(sp, u); expect(m.joint).toBe('elbow'); const g = techniqueGeom('limb', frameAt(sp, u).sk, side, 'elbow')!; expect([u, Math.abs(g.sweepDeg - m.deg) <= 1]).toEqual([u, true]); expect([u, overlayShapes(sp, u, 'side', [E]).filter(x => x.k === 'line').length]).toEqual([u, 1]); }
  });
  test('tylko linie ciągłe i łuki bez wypełnienia, bez pól tekstowych; id z rejestru; rzut z przodu i z góry bez elementu', () => {
    for (const u of [0, 0.5, 1]) for (const x of overlayShapes(s(), u, 'side', [E])) {
      expect(['line', 'poly']).toContain(x.k); expect(x.z).toBeGreaterThan(3000); expect(x.id).toMatch(/^dipElbowLimb(Line|Arc)$/);
      if (x.k === 'line') expect(x.dash).toBeUndefined(); else expect((x as { fill?: unknown }).fill).toBeUndefined();
      expect(JSON.stringify(x)).not.toMatch(/"(text|label|value)"/);
    }
    for (const u of US) { expect(overlayShapes(s(), u, 'front', [E])).toEqual([]); expect(overlayShapes(s(), u, 'top', [E])).toEqual([]); }
  });
  test('limit: ≤ 3 linie i ≤ 1 łuk na rzut łącznie z liniami odniesienia, w każdym ćwiczeniu rodziny i klatce', () => {
    for (const k of DIP_KEYS) for (const u of [0, 0.25, 0.5, 0.75, 1]) {
      const all = [...guideShapes(spec(k), u, 'side', guidesOf(k)), ...overlayShapes(spec(k), u, 'side', techniquesOf(k), undefined, guidesOf(k))];
      expect([k, u, all.filter(x => x.k === 'line').length <= OVERLAY_MAX_LINES]).toEqual([k, u, true]); expect([k, u, all.filter(x => x.k === 'poly').length <= OVERLAY_MAX_ARCS]).toEqual([k, u, true]);
    }
  });
});
