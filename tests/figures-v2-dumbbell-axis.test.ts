/* Podział strukturalny contract.ts (04.11.2026, backlog 1.1): oś hantla wydzielona do dumbbellAxis.ts, interpolacja póz do poseInterp.ts.
 * Zachowanie bez zmian (dowód: skrót klatek wszystkich póz przed/po); ten test wiąże moduł z macierzą i pilnuje publicznych nazw. */
import { withDumbbellAxis } from '../lib/figures/v2/dumbbellAxis';
import { poseAt, deltaAt, applyDelta, toPoseIn, mirrorKey, TRUNK_EXT, ARM_EXT, NEUTRAL_ANKLE_DEG, neutralFootPitch } from '../lib/figures/v2/contract';
import * as interp from '../lib/figures/v2/poseInterp';
import type { Prop } from '../lib/figures/v2/scene';

const hantel = (side: 'R' | 'L'): Extract<Prop, { k: 'dumbbell' }> => ({ k: 'dumbbell', side, c: [0, 0, 0], axis: [0, 0, 1] } as unknown as Extract<Prop, { k: 'dumbbell' }>);
const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

describe('withDumbbellAxis (dumbbellAxis.ts)', () => {
  const arm = { elbow: [0, 0, 0] as [number, number, number], wrist: [0, -30, 0] as [number, number, number] };
  test('podchwyt/nachwyt (±90 albo brak obrotu): oś poprzeczna bez zmiany', () => {
    for (const rot of [undefined, 90, -90]) expect((withDumbbellAxis(hantel('R'), arm, rot) as { axis: number[] }).axis).toEqual([0, 0, 1]);
  });
  test('chwyt neutralny (obrót 0) przy zwisie: oś prostopadła do przedramienia i do poprzecznej (przód–tył), jednostkowa', () => {
    const ax = (withDumbbellAxis(hantel('R'), arm, 0) as { axis: number[] }).axis;
    expect(Math.hypot(ax[0], ax[1], ax[2])).toBeCloseTo(1, 9); expect(dot(ax, [0, -1, 0])).toBeCloseTo(0, 9); expect(Math.abs(ax[0])).toBeCloseTo(1, 9);
  });
  test('lewa ręka daje lustro osi prawej (obrót pośredni)', () => {
    const r = (withDumbbellAxis(hantel('R'), arm, 40) as { axis: number[] }).axis; const l = (withDumbbellAxis(hantel('L'), arm, 40) as { axis: number[] }).axis;
    expect(l[0]).toBeCloseTo(r[0], 9); expect(l[1]).toBeCloseTo(r[1], 9); expect(Math.abs(l[2])).toBeCloseTo(Math.abs(r[2]), 9);
  });
  test('przedramię zerowej długości: brak zmiany', () => {
    const p = hantel('R'); expect(withDumbbellAxis(p, { elbow: [1, 2, 3], wrist: [1, 2, 3] }, 0)).toBe(p);
  });
});

describe('poseInterp.ts: publiczne nazwy dostępne z contract.ts', () => {
  test('contract.ts re-eksportuje te same funkcje i stałe', () => {
    expect(poseAt).toBe(interp.poseAt); expect(deltaAt).toBe(interp.deltaAt); expect(applyDelta).toBe(interp.applyDelta); expect(toPoseIn).toBe(interp.toPoseIn);
    expect(mirrorKey).toBe(interp.mirrorKey); expect(neutralFootPitch).toBe(interp.neutralFootPitch);
    expect(TRUNK_EXT).toBe(interp.TRUNK_EXT); expect(ARM_EXT).toBe(interp.ARM_EXT); expect(NEUTRAL_ANKLE_DEG).toBe(interp.NEUTRAL_ANKLE_DEG);
  });
});
