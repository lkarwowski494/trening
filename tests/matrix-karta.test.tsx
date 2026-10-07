/*
 * Macierz grafiki sprzętu na karcie „teraz” (07.10.2026, build 1004): każdy przyrząd z IMPLS × jednostka — grafika z wartości serii, podpis =
 * etykieta VoiceOver. Nowy przyrząd w lib/seed.ts IMPLS wchodzi do pętli sam i wymaga reprezentanta w REP (inaczej test pada).
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { IMPLS, type Impl } from '@/lib/seed';
import { addLocation, setEquip } from '@/lib/locations';
import { implFor, equipVisFor } from '@/lib/equipvis';
import { renderApp, flushAll, screen, act } from './app';
import { fresh, ex, saved } from './helpers';
import { UNITS, setUnit, S } from './matrix-shared';

jest.setTimeout(120000);
afterEach(async () => { await timer.stop(); await timer.stopSet(); });
/** Reprezentant przyrządu: ćwiczenie, miejsce, wpisany ciężar (kg), oczekiwany rodzaj grafiki i podpis (kg / lb). */
const REP: Record<Impl, { name: string; preset: 'gym' | 'bodyweight'; kg: number; kind: string; label: Record<'kg' | 'lb', string> }> = {
  barbell: { name: 'Bench Press (sztanga)', preset: 'gym', kg: 80, kind: 'plates', label: { kg: 'Na każdą stronę: 25 + 5 kg', lb: 'Na każdą stronę: 25 + 5 kg' } },
  ez_bar: { name: 'EZ Bar Curl', preset: 'gym', kg: 30, kind: 'plates', label: { kg: 'Na każdą stronę: 10 kg', lb: 'Na każdą stronę: 10 kg' } /* gryf EZ w presecie 10 kg */ },
  trap_bar: { name: 'Trap Bar Deadlift', preset: 'gym', kg: 120, kind: 'plates', label: { kg: 'Na każdą stronę: 25 + 25 kg', lb: 'Na każdą stronę: 25 + 25 kg' } },
  dumbbell: { name: 'Bench Press (hantle)', preset: 'gym', kg: 22.5, kind: 'dumbbell', label: { kg: 'hantle: 2 × 22,5 kg', lb: 'hantle: 2 × 49,6 lb' } },
  kettlebell: { name: 'Kettlebell Press', preset: 'gym', kg: 16, kind: 'kettlebell', label: { kg: 'kettlebell: 1 × 16 kg', lb: 'kettlebell: 1 × 35,3 lb' } },
  cable: { name: 'Cable Fly', preset: 'gym', kg: 15, kind: 'stack', label: { kg: 'stos na 15 kg', lb: 'stos na 33,1 lb' } },
  electric: { name: 'Cable Fly', preset: 'bodyweight', kg: 12, kind: 'electric', label: { kg: 'na urządzeniu: 12 kg', lb: 'na urządzeniu: 26,5 lb' } },
  machine: { name: 'Pec Deck', preset: 'gym', kg: 45, kind: 'stack', label: { kg: 'stos na 45 kg', lb: 'stos na 99,2 lb' } },
};
describe('przyrząd × jednostka: grafika na karcie „teraz”', () => {
  /* @matrix IMPLS */
  test.each(IMPLS.flatMap(i => UNITS.map(u => [i, u] as const)))('%s / %s', async (impl, u) => {
    const r = REP[impl]; await fresh(); const l = addLocation(r.preset); if (impl === 'electric') setEquip(l, 'electric', true);
    setUnit(u); store.startEmpty(); S().active!.locationId = l.id; store.addExerciseToActive(ex(r.name));
    const a = S().active!; const e = a.exercises[0]; e.sets[0].weight = r.kg; e.sets[0].reps = 8; store.save(a);
    expect([impl, implFor(a, e)]).toEqual([impl, impl]); expect(equipVisFor(a, e, e.sets[0])[0]?.kind).toBe(r.kind);
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10);
    expect(screen.getByLabelText(r.label[u])).toBeTruthy();
  });
});
