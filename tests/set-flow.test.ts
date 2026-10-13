/*
 * lib/setFlow.ts — odhaczenie serii z przerwą i stoperem, wydzielone z ekranu treningu (0.20, commit strukturalny; wspólne dla ✓ na telefonie i zegarka).
 * Test na poziomie logiki: te same skutki, które dawniej sprawdzały tylko testy ekranu (przerwa, podpis, cofnięcie, stoper serii czasowej).
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { completeSet, restLabels, finishTimedSet, isClosingSet } from '@/lib/setFlow';
import { blankTimer } from '@/lib/seed';
import { fresh, ex } from './helpers';

const NOW = new Date(2026, 9, 13, 10, 0, 0).getTime();
const S = () => store.getState();
beforeEach(async () => {
  jest.useFakeTimers({ now: NOW }); await fresh(); store.setTimerState(blankTimer()); await timer.stop(); await timer.stopSet(); await timer.restore();
  timer.labels.title = ''; timer.labels.subtitle = ''; timer.labels.last = false; global.__la.length = 0;
  store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Plank'));
  const a = S().active!; a.templateName = 'Push'; a.exercises[0].restSec = 90; store.save(a);
});
afterEach(() => { jest.useRealTimers(); });

describe('completeSet', () => {
  test('odhaczenie: seria zrobiona, przerwa z restSec ćwiczenia, podpis „dalej: …” na timerze', async () => {
    const a = S().active!; const id = a.exercises[0].sets[0].id;
    await completeSet(0, 0);
    expect(a.exercises[0].sets[0].done).toBe(true);
    expect([timer.T.on, timer.T.total, timer.T.setId]).toEqual([true, 90, id]);
    expect(timer.T.sub).toMatch(/^dalej: Plank/);
  });
  test('ponowne wywołanie = cofnięcie: seria nieodhaczona, przerwa zatrzymana (tylko ta, którą uruchomiła ta seria)', async () => {
    await completeSet(0, 0); await completeSet(0, 0);
    expect(S().active!.exercises[0].sets[0].done).toBe(false); expect(timer.T.on).toBe(false);
  });
  test('godzina odhaczenia `at` z przeszłości: completedAt = at, przerwa liczona od niej (po końcu przerwy — brak przerwy)', async () => {
    await completeSet(0, 0, NOW - 30e3);
    expect(S().active!.exercises[0].sets[0].completedAt).toBe(NOW - 30e3); expect(timer.T.endAt).toBe(NOW + 60e3);
    await completeSet(0, 0); await completeSet(0, 0, NOW - 200e3);
    expect(S().active!.exercises[0].sets[0].done).toBe(true); expect(timer.T.on).toBe(false);
  });
  test('brak treningu albo serii: nic się nie dzieje', async () => {
    await completeSet(9, 9); expect(timer.T.on).toBe(false); expect(S().active!.exercises.every(e => e.sets.every(s => !s.done))).toBe(true);
  });
});
describe('restLabels i stoper serii', () => {
  test('restLabels ustawia tytuł (nazwa treningu) i podpis timera', () => {
    restLabels(0, 0); expect([timer.labels.title, timer.labels.subtitle.startsWith('dalej: Plank'), timer.labels.last]).toEqual(['Push', true, false]);
  });
  test('finishTimedSet: zatrzymany stoper zapisuje czas i odhacza serię; flaga domykania opada po zakończeniu', async () => {
    const a = S().active!; const set = a.exercises[1].sets[0]; await timer.startSet(set.id, 60);
    jest.setSystemTime(NOW + 20e3); const p = finishTimedSet(); expect(isClosingSet()).toBe(true); await p;
    expect(isClosingSet()).toBe(false); expect([set.done, set.durationSec]).toEqual([true, 20]);
  });
});
