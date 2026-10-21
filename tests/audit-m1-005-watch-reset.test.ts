/* M1-audytor-generalny-005: zegarek, którego stan (licznik zdarzeń) został wyzerowany w trakcie tego samego treningu, wysyła zdarzenia z tymi samymi eventId
 * (apple-1, apple-2, …) — telefon odrzucał je jako powtórzenia, a seria nie była odhaczana. Czerwone na commicie 8273448. Część Swift (odczyt zapisu w starszym
 * kształcie bez utraty kolejki): targets/watch-tests/WatchCoreTests/WatchStoreTests.swift (testPersistenceKeepsQueueFromOlderShape). */
import * as store from '@/lib/store';
import { decideWatchEvent, applyWatchEvent } from '@/lib/watch/apply';
import { type WatchEvent } from '@/lib/watch/protocol';
import { saved, fresh } from './helpers';
import { world, A, sid, NOW, teardownWorld } from './watch-world';

afterEach(teardownWorld);
const ev = (type: WatchEvent['type'], extra: Record<string, unknown>, at: number, eventId: string): WatchEvent =>
  ({ v: 1, kind: 'event', eventId, workoutId: A().id, baseRev: 1, at, client: 'apple', type, ...extra } as WatchEvent);

describe('M1-005: wyzerowany stan zegarka w tym samym treningu', () => {
  test('zdarzenie z tym samym eventId, ale późniejszą godziną (licznik zegarka od nowa) jest zastosowane; powtórzenie którego kolwiek z nich — duplicate', async () => {
    await world(); jest.setSystemTime(NOW + 6000);
    const e1 = ev('done', { setId: sid(0, 0) }, NOW + 2000, 'apple-1');
    expect((await applyWatchEvent(e1, 1)).status).toBe('applied');
    const e2 = ev('done', { setId: sid(0, 1) }, NOW + 4000, 'apple-1'); /* zegarek po wyzerowaniu: znów apple-1 */
    expect((await applyWatchEvent(e2, 2)).status).toBe('applied');
    expect(A().exercises[0].sets.slice(0, 2).map(s => s.done)).toEqual([true, true]);
    expect((await applyWatchEvent(e2, 3)).status).toBe('duplicate'); /* prawdziwe powtórzenie (ta sama godzina) */
    expect((await applyWatchEvent(e1, 4)).status).toBe('duplicate');
  });
  test('po restarcie telefonu to samo rozróżnienie: zapisany dziennik nie blokuje nowego zdarzenia po wyzerowaniu zegarka', async () => {
    await world(); jest.setSystemTime(NOW + 6000);
    const e1 = ev('done', { setId: sid(0, 0) }, NOW + 2000, 'apple-1'); await applyWatchEvent(e1, 1);
    await store.flush(); const snap = JSON.parse(JSON.stringify(saved())); await fresh(snap);
    const e2 = ev('done', { setId: sid(0, 1) }, NOW + 4000, 'apple-1');
    expect((await applyWatchEvent(e2, 2)).status).toBe('applied'); expect((await applyWatchEvent(e1, 3)).status).toBe('duplicate');
  });
  test('dziennik bez godziny ostatniego zdarzenia (zapis z wcześniejszej wersji) działa jak dotąd: ten sam eventId = duplicate', async () => {
    await world(); A().watchEvents = ['apple-1'];
    expect(decideWatchEvent(ev('done', { setId: sid(0, 0) }, NOW + 1000, 'apple-1'), { w: A(), nowMs: NOW + 2000, rest: null }).status).toBe('duplicate');
  });
});
