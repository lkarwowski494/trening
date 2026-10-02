/* Runda 74 — podpowiedź „Poprzednio” (hintFor) i numeracja wystąpień ćwiczenia: przypadki dopisane po testach mutacyjnych lib/store.ts. */
import * as store from '@/lib/store';
import { fresh, ex, set } from './helpers';

const S = (kind: string, reps: number, extra: object = {}) => set({ kind: kind as never, warmup: kind === 'warmup', reps, ...extra });

describe('hintFor', () => {
  /* poprzednia sesja = serie robocze (rozgrzewek tam nie ma — previousFor bierze tylko robocze) */
  const prev = [S('normal', 10), S('normal', 13), S('drop', 20), S('failure', 11), S('drop', 21)];
  test('brak poprzednich serii / brak serii / rozgrzewka → brak podpowiedzi', () => {
    const cur = [S('warmup', 0), S('normal', 0)];
    expect(store.hintFor(null, cur, 1)).toBeNull(); expect(store.hintFor(undefined, cur, 1)).toBeNull(); expect(store.hintFor(prev, cur, 5)).toBeNull(); expect(store.hintFor(prev, cur, 0)).toBeNull();
  });
  test('rodziny: zwykła i do upadku liczone razem (n-ta nie-drop), drop — n-ty drop; rozgrzewki bieżącej sesji nie przesuwają numeracji', () => {
    const cur = [S('warmup', 0), S('warmup', 0), S('normal', 0), S('drop', 0), S('normal', 0), S('failure', 0), S('drop', 0), S('normal', 0)];
    expect([2, 3, 4, 5, 6, 7].map(i => store.hintFor(prev, cur, i)?.reps ?? null)).toEqual([10, 20, 13, 11, 21, null]);
  });
  test('podpowiedź z gumą, której już nie ma (albo asysta gumą wyłączona) — brak; bez ćwiczenia lub dla ćwiczenia z ciężarem — jest', async () => {
    await fresh(); const pull = ex('Pull Up'); pull.bandAssistable = true; const band = store.getState().bands[0].id;
    const p = [S('normal', 8, { bandId: band, addKg: -15 }), S('normal', 8, { bandId: 'usunieta' })]; const cur = [S('normal', 0), S('normal', 0)];
    expect(store.hintFor(p, cur, 0, pull)!.reps).toBe(8); expect(store.hintFor(p, cur, 1, pull)).toBeNull(); expect(store.hintFor(p, cur, 1)!.reps).toBe(8);
    pull.bandAssistable = false; expect(store.hintFor(p, cur, 0, pull)).toBeNull();
    expect(store.hintFor(p, cur, 1, ex('Back Squat'))!.reps).toBe(8);
  });
});

describe('occurrence / occurrences', () => {
  test('które wystąpienie ćwiczenia i ile ich jest', () => {
    const items = [{ exerciseId: 'A' }, { exerciseId: 'B' }, { exerciseId: 'A' }, { exerciseId: 'A' }];
    expect(items.map((_, i) => store.occurrence(items, i))).toEqual([0, 0, 1, 2]);
    expect(store.occurrences(items, 'A')).toBe(3); expect(store.occurrences(items, 'B')).toBe(1); expect(store.occurrences(items, 'C')).toBe(0);
  });
});
