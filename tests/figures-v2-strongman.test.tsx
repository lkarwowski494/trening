/*
 * strongman włączona jako `ready` (partia 8, 10.11.2026; decyzja właściciela 03.11.2026 wariant A): jedno ćwiczenie z rysunkiem v2 — Yoke Walk (jarzmo na barkach, marsz w trybie cyklicznym, GAIT_UI: faza „Marsz”).
 * Pozostałe ćwiczenia rodziny (Atlas Stones, Keg Load, Log Lift, Circus Bell, Conan's Wheel, Tire Flip, Sandbag Load, Power Stairs) są OTWARTE (zestaw „open”), Jefferson Squat to wyjątek z powodem
 * (scripts/figures/agent-pozy/strongman.mjs) — bez figury v2. Nakładka: rejestr pusty (żadna reguła „ustalone” z wskazówką na karcie, nagłówek overlay/strongman.ts).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import { FAMILY, DATA_UI, GAIT_UI, assignAll, figureSpec, frameAt, keyframeFrame, phasesFor, poseFile, poseKeys, dataUiForPose } from '@/lib/figures/v2';
import { techniquesOf } from '@/lib/figures/v2/ui';
import { TECHNIQUE } from '@/lib/figures/v2/overlay';
import { STRONGMAN_TECHNIQUE } from '@/lib/figures/v2/overlay/strongman';

const BEZ_FIGURY = ['Atlas Stones', 'Keg Load', 'Log Lift', 'Circus Bell', "Conan's Wheel", 'Tire Flip', 'Sandbag Load', 'Power Stairs', 'Jefferson Squat'];

describe('dane: rejestr ma wpis rodziny, pusty (STRONGMAN_TECHNIQUE); strongman: rodzina ready z jednym ćwiczeniem z danych póz (Yoke Walk)', () => {
  test('status ready, plik póz ma tylko Yoke Walk, bez wpisu DATA_UI (prezentacja domyślna GAIT_UI)', () => {
    expect(FAMILY.strongman.status).toBe('ready'); expect(poseKeys('strongman')).toEqual(['Yoke Walk']); expect(assignAll()['Yoke Walk']).toBe('strongman'); expect(DATA_UI.strongman).toBeUndefined();
  });
  test('Yoke Walk: figura z boku, tryb cykliczny z lustrem, licznik „Marsz”, prezentacja GAIT_UI', () => {
    const d = poseFile('strongman')!.cwiczenia['Yoke Walk']; const s = figureSpec('Yoke Walk')!;
    expect(s.family).toBe('strongman'); expect(s.views).toEqual(['side']); expect(d.petla).toBe('cykl_lustro'); expect(dataUiForPose('strongman', d)).toBe(GAIT_UI);
    expect([...new Set(phasesFor(s).filter(p => p.name !== 'Pauza').map(p => p.name))]).toEqual(['Marsz']);
  });
  test('Yoke Walk: miednica na stałej wysokości (±1 cm), stopa podporowa nie wchodzi pod podłogę, tułów pionowo', () => {
    const ys = Array.from({ length: 13 }, (_, i) => frameAt(figureSpec('Yoke Walk')!, i / 12).sk.pelvis[1]); expect(Math.max(...ys) - Math.min(...ys)).toBeLessThanOrEqual(1);
    for (let i = 0; i <= 12; i++) { const f = keyframeFrame(poseFile('strongman')!.cwiczenia['Yoke Walk'], i / 12); for (const sd of ['R', 'L'] as const) expect(f.sk.legs[sd].toe[1]).toBeGreaterThanOrEqual(-0.5); expect(Math.abs(f.sk.shoulderC[0] - f.sk.pelvis[0])).toBeLessThanOrEqual(8); }
  });
  test('ćwiczenia otwarte i wyjątek Jefferson Squat: brak figury v2; rejestr nakładki pusty i żaden element się nie rysuje', () => {
    for (const k of BEZ_FIGURY) { expect([k, assignAll()[k]]).toEqual([k, 'strongman']); expect([k, figureSpec(k)]).toEqual([k, null]); }
    expect(TECHNIQUE.strongman).toBe(STRONGMAN_TECHNIQUE); expect(STRONGMAN_TECHNIQUE).toEqual([]); for (const d of STRONGMAN_TECHNIQUE) expect([d.id, d.cue.length > 0 && d.rule.length > 0]).toEqual([d.id, true]); /* każdy przyszły element ma wskazówkę i regułę */ expect(techniquesOf('Yoke Walk')).toEqual([]);
  });
});
