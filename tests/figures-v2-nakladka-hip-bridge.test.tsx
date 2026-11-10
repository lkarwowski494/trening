/*
 * Figury v2 — nakładka techniki hip_bridge (09.11.2026, decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18).
 * Rodzaje (docs/20): dane (jeden element, reguła „ustalone” w danych), logika (dobór per ćwiczenie), scenariusz (linia barki → kolano na szczycie mostka), macierz (11 ćwiczeń rodziny),
 * niezmiennik (limit linii), regresja (hip thrust i wariant jednonóż bez linii: reguła „ustalone” tylko dla mostka z podłogi).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza dobór elementów, nie recenzję rodziny */
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec, frameAt } from '@/lib/figures/v2';
import { TECHNIQUE, techniqueShapes, OVERLAY_MAX_LINES } from '@/lib/figures/v2/overlay';
import { HIP_BRIDGE_TECHNIQUE, BRIDGE_LINE_EXERCISES } from '@/lib/figures/v2/overlay/hip_bridge';
import { techniquesOf } from '@/lib/figures/v2/ui';
import REGULY from '@/lib/figures/v2/reguly-cwiczen.json';

const KEYS = Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === 'hip_bridge'; } catch { return false; } });
const ID = 'bridgeTopLine';

describe('hip_bridge: nakładka techniki', () => {
  test('dane: jeden element (linia barki → kolano, reguła linia_na_gorze, rzut z boku, wskazówki gb.move/ht.move), zarejestrowany w TECHNIQUE', () => {
    expect(HIP_BRIDGE_TECHNIQUE.map(d => [d.id, d.kind, d.rule, d.views, d.cue, d.ref])).toEqual([[ID, 'ref', 'linia_na_gorze', ['side'], ['gb.move', 'ht.move'], { shape: 'segment', from: 'shoulder', to: 'knee' }]]);
    expect(TECHNIQUE.hip_bridge).toBe(HIP_BRIDGE_TECHNIQUE);
    for (const d of HIP_BRIDGE_TECHNIQUE) expect([d.id, (REGULY as Record<string, Record<string, string[]>>).hip_bridge['Glute Bridge'].includes(d.rule)]).toEqual([d.id, true]); /* reguła elementu należy do reguł „ustalone” mostka z podłogi */
  });
  test('macierz: 10 ćwiczeń z rysunkiem; linię dostają tylko Glute Bridge i Glute Bridge (sztanga) — reszta (hip thrust, jednonóż, Frog Pump, piłka, maszyny) bez elementu', () => {
    expect(KEYS.length).toBe(10); expect(BRIDGE_LINE_EXERCISES).toEqual(['Glute Bridge', 'Glute Bridge (sztanga)']);
    for (const k of KEYS) expect([k, techniquesOf(k)]).toEqual([k, BRIDGE_LINE_EXERCISES.includes(k) ? [ID] : []]);
  });
  test('regresja: wpis mieszany „ustalone (most); analogia (hip thrust)” przechodzi filtr reguł także dla hip thrust — zakres trzyma lista `exercises`', () => {
    const R = REGULY as Record<string, Record<string, string[]>>;
    for (const k of ['Hip Thrust (sztanga)', 'Hip Thrust (hantel)', 'Machine Hip Thrust']) expect([k, R.hip_bridge[k].includes('linia_na_gorze'), techniquesOf(k)]).toEqual([k, true, []]);
  });
  test('scenariusz: na szczycie mostka miednica leży blisko linii barki–kolano (≤ 8 cm, próg reguły), element to jedna linia w rzucie z boku (limit linii)', () => {
    for (const k of BRIDGE_LINE_EXERCISES) {
      const s = figureSpec(k)!; const f = frameAt(s, 1); const sh = f.sk.arms.R.shoulder, kn = f.sk.legs.R.knee, p = f.sk.pelvis;
      const dx = kn[0] - sh[0], dy = kn[1] - sh[1]; const L = Math.hypot(dx, dy); const odl = Math.abs((p[0] - sh[0]) * dy - (p[1] - sh[1]) * dx) / L;
      expect([k, odl <= 8]).toEqual([k, true]);
      const sh2 = techniqueShapes(f.sk, 'side', HIP_BRIDGE_TECHNIQUE, { joint: 'hip', side: 'R', limbShown: false, danger: () => false });
      expect(sh2.length).toBe(1); expect(sh2.length).toBeLessThanOrEqual(OVERLAY_MAX_LINES);
      expect(techniqueShapes(f.sk, 'front', HIP_BRIDGE_TECHNIQUE, { joint: 'hip', side: 'R', limbShown: false, danger: () => false })).toEqual([]);
    }
  });
});
