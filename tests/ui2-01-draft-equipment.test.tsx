/*
 * Audyt kontrolny 1 (przed 0.10.0), UI2-01 — podniesione do WYSOKIEJ (09.10.2026, sprawdzenie koordynatora: „czy liczby są błędne”): zmiana sprzętu
 * ćwiczenia przez „Edytuj → Zapisz” (szkic, lib/draft.ts) nie przeliczała przyrządu bloku w treningu w toku (reguła L5), a przyrząd decyduje
 * o mnożniku stacji z dwiema linkami (store.blockMult): RDL (hantle/linki) → „linki” w domu ze stacją — objętość serii 20 kg × 10 = 200 zamiast 400,
 * tak samo suma treningu i rekord objętości serii; zapisany przyrząd „hantle”. Podstawa: sonda N-4 (scratchpad/audit2/UI). Wzorzec: dawna ścieżka
 * store.setEquipment (wynik „direct”) — obie ścieżki mają dawać te same liczby.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { sessionsFor } from '@/lib/stats';
import { fresh, ex, saved } from './helpers';
import { userHome } from './locations-fixtures';
import { renderApp, flushAll, screen, go, act, tap, startEdit, saveEdit } from './app';

jest.setTimeout(120000);
const S = () => store.getState();
afterEach(async () => { try { S(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const ADJ_DB = [2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 24];

const run = async (name: string, eqLabel: string, eqVal: any, viaDraft: boolean) => {
  await fresh(); const st = S(); st.settings.locations = [userHome(ADJ_DB)]; st.settings.mainLocationId = 'home'; store.save();
  const id = ex(name).id; store.startEmpty(); store.addExerciseToActive(ex(name));
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10);
  const before = S().active!.exercises[0].impl;
  if (viaDraft) { await go(`/exercise/${id}`); await flushAll(10); await startEdit(); await tap(screen.getByText(eqLabel)); await saveEdit(); }
  else await act(async () => { store.setEquipment(store.exById(id)!, eqVal); });
  const a = S().active!; const after = a.exercises[0].impl; Object.assign(a.exercises[0].sets[0], { weight: 20, reps: 10 }); store.toggleDone(0, 0);
  const w = store.finishWorkout()!; const e = store.exById(id)!; const s = sessionsFor(e)[0];
  return { before, after, eq: e.equipment, savedImpl: w.exercises[0].impl, volume: store.volume(w), sVol: s?.volume, e1rm: s?.bestE1rm, bestSetVolume: s?.bestSetVolume, total: s?.total };
};
test.each([['Cable Fly', 'hantle', 'hantle'], ['RDL (hantle/linki)', 'linki', 'linki'], ['Wyciskanie na linkach (stojąc)', 'hantle', 'hantle']])('%s → %s', async (name, lbl, val) => {
  const direct = await run(name, lbl, val, false); const draft = await run(name, lbl, val, true);
  expect(draft).toEqual(direct);
});
test('RDL (hantle/linki) → „linki” przez szkic: stacja ×2 — objętość 400, rekord objętości serii 400, przyrząd w historii „electric”', async () => {
  const r = await run('RDL (hantle/linki)', 'linki', 'linki', true);
  expect(r).toMatchObject({ before: 'dumbbell', after: 'electric', savedImpl: 'electric', volume: 400, sVol: 400, bestSetVolume: 400, total: 400 });
});
test('logika store.exerciseEdited: przelicza tylko bloki bez odhaczonych serii i tylko, gdy ćwiczenie jest w treningu w toku', async () => {
  await fresh(); const st = S(); st.settings.locations = [userHome(ADJ_DB)]; st.settings.mainLocationId = 'home'; store.save();
  const e = ex('RDL (hantle/linki)'); store.startEmpty(); store.addExerciseToActive(e); store.addExerciseToActive(e); const a = S().active!;
  Object.assign(a.exercises[0].sets[0], { weight: 20, reps: 10 }); store.toggleDone(0, 0); expect(a.exercises.map(b => b.impl)).toEqual(['dumbbell', 'dumbbell']);
  Object.assign(e, { equipment: 'linki', loadSource: 'cable', requires: [] }); store.exerciseEdited(e.id);
  expect(a.exercises.map(b => b.impl)).toEqual(['dumbbell', 'electric']); /* odhaczony blok zostaje przy przyrządzie, którym go zrobiono */
  const before = JSON.stringify(a); store.exerciseEdited(ex('Back Squat').id); expect(JSON.stringify(S().active)).toBe(before); /* inne ćwiczenie — nic */
});
