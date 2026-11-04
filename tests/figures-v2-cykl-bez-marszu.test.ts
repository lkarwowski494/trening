/*
 * Fala wspólna 3 (koordynator 1.1, 04.11.2026): ćwiczenie z pętlą `cykl_lustro` BEZ marszu (naprzemienne unoszenie rąk, Car Drivers) pokazuje fazy ruchu rodziny
 * (Unoszenie/Pauza/Opuszczanie/Pauza), nie jedną fazę „Marsz”. Marsz (`walk`) wynika z wpisu rodziny/GAIT_UI, nie z samej pętli. Chodzone (carry, sanki, nosidła) bez zmian.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json')));
import { FAMILY, figureSpec, loopOf, loopLength, phasesFor, phaseNames, type FamilyId } from '@/lib/figures/v2';

const BEZ = jest.requireActual('@/lib/figures/v2/poses/delt_raise.json').cwiczenia as Record<string, { cwiczenie: string; rodzina: string; petla?: string }>;
const WZOR = Object.keys(BEZ)[0];
jest.mock('@/lib/figures/v2/poseData', () => {
  const real = jest.requireActual('@/lib/figures/v2/poseData');
  const EXTRA = ['delt_raise', 'carry', 'sled_throw', 'strongman'];
  return { ...real, poseDataFor: (key: string, family: string) => {
    if (!EXTRA.includes(family)) return real.poseDataFor(key, family);
    const f = jest.requireActual(`@/lib/figures/v2/poses/${family}.json`).cwiczenia as Record<string, { cwiczenie: string; rodzina: string; petla?: string }>;
    if (family === 'delt_raise' && Object.prototype.hasOwnProperty.call(f, key)) { const d = f[key]; return { ...d, petla: (global as { __CYKL?: string[] }).__CYKL?.includes(key) ? 'cykl_lustro' : d.petla }; }
    const d = Object.prototype.hasOwnProperty.call(f, key) ? f[key] : undefined; return d && d.cwiczenie === key && d.rodzina === family ? d : null;
  } };
});
const SAVED = Object.fromEntries(['delt_raise', 'carry', 'sled_throw', 'strongman'].map(f => [f, FAMILY[f as FamilyId].status]));
beforeAll(() => { for (const f of Object.keys(SAVED)) FAMILY[f as FamilyId].status = 'ready'; });
afterAll(() => { for (const f of Object.keys(SAVED)) FAMILY[f as FamilyId].status = SAVED[f] as 'ready' | 'planned'; delete (global as { __CYKL?: string[] }).__CYKL; });

describe('decyzja 04.11.2026: fazy marszu tylko dla ćwiczeń chodzonych', () => {
  test('cykl_lustro bez marszu (delt_raise): fazy Unoszenie/Pauza/Opuszczanie/Pauza jak w ćwiczeniu jednostronnym; brak fazy „Marsz” (przypadek negatywny)', () => {
    (global as { __CYKL?: string[] }).__CYKL = [WZOR];
    const s = figureSpec(WZOR)!; expect(s).not.toBeNull(); expect(loopOf(s)).toBe('cykl_lustro');
    const n = phaseNames(s); expect(n).toEqual({ first: 'Unoszenie', second: 'Opuszczanie' });
    const ph = phasesFor(s); expect(ph.map(p => [p.name, p.ms])).toEqual([['Unoszenie', 1000], ['Pauza', 500], ['Opuszczanie', 2000], ['Pauza', 500]]);
    expect(ph.some(p => p.name === 'Marsz')).toBe(false); expect(ph.some(p => p.untimed)).toBe(false);
    expect(phasesFor(s).reduce((a, p) => a + p.ms, 0)).toBe(loopLength(false)); /* ta sama długość pętli co wahadło */
    delete (global as { __CYKL?: string[] }).__CYKL;
  });
  test('te same ćwiczenia w wahadle (dziś na integracji) mają te same fazy — wynik niezależny od tego, czy pętla to wahadło czy cykl_lustro', () => {
    const wahadlo = phasesFor(figureSpec(WZOR)!); (global as { __CYKL?: string[] }).__CYKL = [WZOR];
    expect(phasesFor(figureSpec(WZOR)!)).toEqual(wahadlo); delete (global as { __CYKL?: string[] }).__CYKL;
  });
  test('chodzone nadal mają jedną fazę „Marsz” bez sekund: 7 ćwiczeń carry, Sled Push, Sled Drag (Harness), Yoke Walk (GAIT_UI i walk rodziny)', () => {
    const carry = Object.keys(jest.requireActual('@/lib/figures/v2/poses/carry.json').cwiczenia);
    const chodzone = [...carry.map(k => k), 'Sled Push', 'Sled Drag (Harness)', 'Yoke Walk'];
    for (const k of chodzone) { const s = figureSpec(k)!; expect([k, s !== null]).toEqual([k, true]); expect([k, loopOf(s)]).toEqual([k, 'cykl_lustro']); expect([k, phasesFor(s)]).toEqual([k, [{ name: 'Marsz', ms: loopLength(false), untimed: true }]]); }
  });
});
