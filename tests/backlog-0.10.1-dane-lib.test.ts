/*
 * Backlog audytu kontrolnego 1 (09.10.2026), obszary DAT/UX: funkcje lib/seed i lib/store dodane przy DAT2-02 i UX2-03 — wywołane wprost (macierz testów).
 * Osobny plik: registerDraftStore podmienia źródło szkiców lib/draft (stan modułu), więc nie może dzielić modułów ze scenariuszami szkiców.
 */
import * as store from '@/lib/store';
import { libKeyCandidates } from '@/lib/seed';
import { fresh } from './helpers';

describe('UX2-03 / DAT2-02: funkcje lib bezpośrednio (macierz testów)', () => {
  afterEach(() => { jest.useRealTimers(); });
  test('seed.libKeyCandidates: odcisk z katalogu 1002 — kandydaci z tamtego katalogu, warianty o tych samych polach wszyscy; pola spoza obu katalogów — pusto', async () => {
    await fresh(); const bp = store.getState().exercises.find(e => e.libKey === 'Bench Press (sztanga)')!;
    expect(libKeyCandidates(bp)).toEqual(['Bench Press (sztanga)']); /* pola z 1002 = bieżące; w katalogu 1002 jednoznaczne */
    const pu = store.getState().exercises.find(e => e.libKey === 'Pull Up')!; expect(libKeyCandidates(pu).length).toBeGreaterThan(1); /* warianty o tych samych polach */
    expect(libKeyCandidates({ ...bp, muscles: ['biceps'], secondaryMuscles: ['łydki'] })).toEqual([]);
  });
  test('store.registerDraftStore / draftsChanged / takeSavedDrafts / sanitizeDraftObj: zapis z opóźnieniem, null usuwa klucz, odczyt jednorazowy, porządkowanie', async () => {
    jest.useFakeTimers({ now: new Date(2026, 9, 9, 12).getTime() }); await fresh(); let v: string | null = '{"v":1,"items":[]}';
    store.registerDraftStore(() => v); store.draftsChanged(); expect(global.__kv.has(store.DRAFTS_KEY)).toBe(false);
    await jest.advanceTimersByTimeAsync(400); for (let i = 0; i < 5; i++) await Promise.resolve(); expect(global.__kv.get(store.DRAFTS_KEY)).toBe(v);
    v = null; store.draftsChanged(); await store.flush(); expect(global.__kv.has(store.DRAFTS_KEY)).toBe(false);
    global.__kv.set(store.DRAFTS_KEY, 'x'); store.__resetForTests(); await store.init(); expect(store.takeSavedDrafts()).toBe('x'); expect(store.takeSavedDrafts()).toBeNull();
    const e = store.getState().exercises[0]; expect(store.sanitizeDraftObj('exercise', { ...e, group: 'zła', restSec: -5 })).toMatchObject({ id: e.id, group: 'inne', restSec: null });
    expect(store.sanitizeDraftObj('exercise', { id: 'nie-ma' })).toBeNull(); expect(store.sanitizeDraftObj('template', 7)).toBeNull();
  });
});

