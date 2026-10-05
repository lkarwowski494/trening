/* Decyzja właściciela 05.10.2026: „ludzie nie znajdą drop setu czy innych ustawień serii, jeżeli będą ukryte pod cyfrą” →
 * przyciski „+ rozgrzewka” i „+ drop set” pod ćwiczeniem, typ serii widoczny jako kolorowa etykieta. */
import { renderApp, flushAll, screen, tap } from './app';
import * as store from '@/lib/store';
import { fresh, ex } from './helpers';

jest.setTimeout(60000);
test('„+ rozgrzewka” wstawia serię rozgrzewkową przed seriami roboczymi; „+ drop set” dodaje drop set na końcu (wartości z ostatniej)', async () => {
  await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); const a = store.getState().active!; const e = a.exercises[0];
  e.sets[0].weight = 80; e.sets[0].reps = 8; store.addSet(0);
  store.addSet(0, 'warmup'); expect(e.sets.map(s => s.kind)).toEqual(['warmup', 'normal', 'normal']); expect(e.sets[0].weight).toBe(''); expect(e.sets[0].warmup).toBe(true);
  store.addSet(0, 'warmup'); expect(e.sets.map(s => s.kind)).toEqual(['warmup', 'warmup', 'normal', 'normal']);
  store.addSet(0, 'drop'); expect(e.sets.map(s => s.kind)).toEqual(['warmup', 'warmup', 'normal', 'normal', 'drop']); expect(e.sets[4].weight).toBe(80);
});
test('w treningu: przyciski typów widoczne pod ćwiczeniem, etykieta typu z nazwą dla VoiceOver', async () => {
  await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); await store.flush();
  await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(10);
  await tap(screen.getByText('+ rozgrzewka')); await tap(screen.getByText('+ drop set')); await flushAll(5);
  expect(store.getState().active!.exercises[0].sets.map(s => s.kind)).toEqual(['warmup', 'normal', 'drop']);
  expect(screen.getByLabelText(/^Seria W, typ: rozgrzewkowa/)).toBeTruthy(); expect(screen.getByLabelText(/^Seria 2D, typ: drop set/)).toBeTruthy();
});
