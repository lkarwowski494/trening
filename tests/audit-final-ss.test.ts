/* Runda 72 — testy z audytu T9 (weryfikacja końcowa). */
import * as store from '@/lib/store';
import { fresh, ex, set } from './helpers';
test('SS1 unequal superset: B has a skipped (unticked) drop set → A3 (round 3, B has no 3rd set) gets no rest', async () => {
  await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Bent Over Row (sztanga)'));
  const a = store.getState().active!; a.exercises[0].groupId = 'g'; a.exercises[1].groupId = 'g';
  a.exercises[0].sets = [set({ done: false, weight: 50, reps: 5 }), set({ done: false, weight: 50, reps: 5 }), set({ done: false, weight: 50, reps: 5 })];
  a.exercises[1].sets = [set({ done: false, weight: 50, reps: 5 }), set({ done: false, weight: 50, reps: 5 }), { ...set({ done: false, weight: 30, reps: 5 }), kind: 'drop' }];
  store.toggleDone(0, 0); store.toggleDone(1, 0); store.toggleDone(0, 1); store.toggleDone(1, 1); // B2D skipped
  expect(store.toggleDone(0, 2)).not.toBeNull();
});
