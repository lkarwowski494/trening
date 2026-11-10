/*
 * Figury v2 — nakładka techniki rodziny cable_press (10.11.2026, partia 4 linii 1.1; decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18).
 * Rodzaje (docs/20): dane (reguły `zakres` i `tulow_stabilny` ze źródłem „ustalone”, wskazówki elementu ∈ wskazowki_na_reguly), logika (element ⇔ wskazówka na karcie i reguła wariantu),
 * geometria (łuk = measuredAngle ±1° w 21 klatkach; linia tułowia = odcinek miednica–bark, stały w ruchu), niezmienniki (bez tekstu, limit linii i łuków na rzut, tylko rzut z boku),
 * regresja (reguła bez „ustalone” — lawka_kontakt — i wskazówki spoza wskazowki_na_reguly nie dają elementu). Wzór: tests/figures-v2-nakladka-triceps-olympic.test.tsx.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { figureSpec, frameAt, guideShapes, measuredAngle, measuredSide, overlayShapes, type FigureSpec } from '@/lib/figures/v2';
import { OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniqueGeom, techniquesFor } from '@/lib/figures/v2/overlay';
import { CABLE_PRESS_TECHNIQUE } from '@/lib/figures/v2/overlay/cable_press';
import { errorText, guidesOf, cueIdsOf, techniquesOf } from '@/lib/figures/v2/ui';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.cable_press;
const KEYS = ['Wyciskanie na linkach (stojąc)', 'Single Arm Cable Chest Press', 'Seated Cable Chest Press', 'Incline Cable Chest Press'];
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const E = 'cablePressElbowLimb', T = 'cablePressTorsoRef';

describe('dane: elementy rodziny cable_press ← reguły ze źródłem', () => {
  test('rejestr: element kończyny (łokieć, reguła zakres) i linia tułowia (reguła tulow_stabilny), oba tylko z boku; TECHNIQUE.cable_press wskazuje tę tablicę', () => {
    expect(CABLE_PRESS_TECHNIQUE.map(d => [d.id, d.kind, d.joint, d.rule, d.views, d.ref])).toEqual([[E, 'limb', 'elbow', 'zakres', ['side'], undefined], [T, 'ref', undefined, 'tulow_stabilny', ['side'], { shape: 'segment', from: 'pelvis', to: 'shoulderC' }]]);
    expect(TECHNIQUE.cable_press).toBe(CABLE_PRESS_TECHNIQUE);
  });
  test('reguły elementów są „ustalone”, a każda ich wskazówka należy do wskazowki_na_reguly tej reguły; lawka_kontakt (analogia) nie ma elementu', () => {
    for (const d of CABLE_PRESS_TECHNIQUE) {
      expect(sens.reguly[d.rule].pewnosc).toMatch(/^ustalone/); expect(d.cue.length).toBeGreaterThan(0);
      for (const c of d.cue) expect([c, sens.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]);
    }
    expect(sens.reguly.lawka_kontakt.pewnosc).not.toMatch(/^ustalone/); expect(CABLE_PRESS_TECHNIQUE.map(d => d.rule)).not.toContain('lawka_kontakt');
  });
});

describe('element ⇔ wskazówka na karcie i reguła wariantu: tabela ćwiczeń', () => {
  test('stojąc: karta własna (mcp.move, cpress.base) → oba elementy; Seated: karta własna bez wskazówek z reguł → brak; Single Arm: zestaw ogólny (cpress.base, press.noLock) → elementy dopiero z wpisem „zestawy” po recenzji (dziś techniquesOf = []); Incline: bp.* → brak', () => {
    const zestawy = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib/figures/v2/cue-sets.json'), 'utf8')).items;
    expect(techniquesOf(KEYS[0])).toEqual([E, T]); expect(techniquesOf(KEYS[2])).toEqual([]); expect(techniquesOf(KEYS[3])).toEqual([]);
    expect([zestawy[KEYS[1]].b, techniquesFor('cable_press', zestawy[KEYS[1]].ok, KEYS[1]).map(d => d.id)]).toEqual(['general', [E, T]]);
    expect(techniquesOf(KEYS[1])).toEqual([]);
    expect(techniquesFor('cable_press', zestawy[KEYS[3]].ok, KEYS[3])).toEqual([]); expect(cueIdsOf(KEYS[2]).ids.some(c => CABLE_PRESS_TECHNIQUE.some(d => d.cue.includes(c)))).toBe(false);
    expect(errorText('bp.mis.arch').length).toBeGreaterThan(0);
  });
  test('techniquesFor: cudza wskazówka albo wskazówka spoza reguł → nic; mcp.move + cpress.base → oba elementy', () => {
    expect(techniquesFor('cable_press', ['dl.lift'])).toEqual([]); expect(techniquesFor('cable_press', ['cpress.seatedMove', 'mcp.blades'], KEYS[0])).toEqual([]);
    expect(techniquesFor('cable_press', ['mcp.move', 'cpress.base'], KEYS[0]).map(d => d.id)).toEqual([E, T]); expect(techniquesFor('cable_press', ['bp.contact'], KEYS[3])).toEqual([]);
  });
});

describe('geometria i niezmienniki (Wyciskanie na linkach (stojąc))', () => {
  const K = KEYS[0]; const s = () => spec(K);
  test('łuk = measuredAngle (±1°) w 21 klatkach: linia zawsze, łuk gdy zgięcie ≥ progu; zgięcie przy klatce ≥ 70°, w wyproście ≤ 25° (reguła zakres)', () => {
    const side = measuredSide(s()); let luki = 0;
    for (const u of US) {
      const m = measuredAngle(s(), u); expect(m.joint).toBe('elbow'); const g = techniqueGeom('limb', frameAt(s(), u).sk, side, 'elbow')!; expect([u, Math.abs(g.sweepDeg - m.deg) <= 1]).toEqual([u, true]);
      const sh = overlayShapes(s(), u, 'side', [E]); expect([u, sh.filter(x => x.k === 'line').length]).toEqual([u, 1]); expect([u, sh.filter(x => x.k === 'poly').length]).toEqual([u, g.arc ? 1 : 0]); if (g.arc) luki++;
    }
    expect(luki).toBeGreaterThan(5); expect(measuredAngle(s(), 0).deg).toBeGreaterThanOrEqual(70); expect(measuredAngle(s(), 1).deg).toBeLessThanOrEqual(25);
  });
  test('linia tułowia: jedna linia w każdej klatce, przez miednicę i bark; w ruchu rąk stoi w miejscu (przesunięcie końców ≤ 0,5 cm)', () => {
    const pierwsza = overlayShapes(s(), 0, 'side', [T]).filter(x => x.k === 'line'); expect(pierwsza).toHaveLength(1);
    for (const u of US) { const l = overlayShapes(s(), u, 'side', [T]).filter(x => x.k === 'line'); expect(l).toHaveLength(1); expect(overlayShapes(s(), u, 'side', [T]).filter(x => x.k === 'poly')).toHaveLength(0); expect(JSON.stringify(l)).toEqual(JSON.stringify(pierwsza)); }
  });
  test('tylko linie ciągłe i łuki bez wypełnienia, bez pól tekstowych; id z rejestru; rzut z przodu i z góry bez elementów', () => {
    for (const u of [0, 0.5, 1]) for (const x of overlayShapes(s(), u, 'side', [E, T])) {
      expect(['line', 'poly']).toContain(x.k); expect(x.z).toBeGreaterThan(3000); expect(x.id).toMatch(/^cablePress(ElbowLimb|TorsoRef)(Line|Arc)?$/);
      if (x.k === 'line') expect(x.dash).toBeUndefined(); else expect((x as { fill?: unknown }).fill).toBeUndefined();
      expect(JSON.stringify(x)).not.toMatch(/"(text|label|value)"/);
    }
    for (const u of US) { expect(overlayShapes(s(), u, 'front', [E, T])).toEqual([]); expect(overlayShapes(s(), u, 'top', [E, T])).toEqual([]); }
  });
  test.each(KEYS)('%s: łuk = measuredAngle ±1°, mierzony staw = łokieć (także po wpisie „zestawy”)', k => {
    const sp = spec(k); const side = measuredSide(sp);
    for (const u of US) { const m = measuredAngle(sp, u); expect(m.joint).toBe('elbow'); const g = techniqueGeom('limb', frameAt(sp, u).sk, side, 'elbow')!; expect([k, u, Math.abs(g.sweepDeg - m.deg) <= 1]).toEqual([k, u, true]); }
  });
  test('limit: ≤ 3 linie i ≤ 1 łuk na rzut łącznie z liniami odniesienia, w każdym ćwiczeniu rodziny i klatce (także z oboma elementami)', () => {
    for (const k of KEYS) for (const u of [0, 0.25, 0.5, 0.75, 1]) for (const ids of [techniquesOf(k), [E, T]]) {
      const all = [...guideShapes(spec(k), u, 'side', guidesOf(k)), ...overlayShapes(spec(k), u, 'side', ids, undefined, guidesOf(k))];
      expect([k, u, all.filter(x => x.k === 'line').length <= OVERLAY_MAX_LINES]).toEqual([k, u, true]); expect([k, u, all.filter(x => x.k === 'poly').length <= OVERLAY_MAX_ARCS]).toEqual([k, u, true]);
    }
  });
});
