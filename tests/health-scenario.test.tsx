/*
 * 0.16.0, odczyt z Apple Health — SCENARIUSZ od początku do końca z restartem aplikacji (docs/29 rozdz. 12 pkt 3): Ustawienia (zapis i odczyt włączone w UI) → trening
 * → „Zakończ” (zegarka jeszcze nie ma: kopia zapisana w Zdrowiu) → zegarek się synchronizuje → powrót z tła → usunięcie WŁASNEJ kopii (filtr id + własne źródło),
 * `healthUUID = 'watch'` → szczegóły sesji z tętnem i kcal → restart → te same szczegóły (odczyt na nowo), a stan i kopia nie mają żadnych wartości ze Zdrowia.
 * Drugi scenariusz: zegarek kończy PRZED „Zakończ” → kopia w ogóle nie powstaje. Rodzaje (docs/20): scenariusz, dane (restart). E2E: pominięte z powodem (docs/09).
 */
import { AppState } from 'react-native';
import * as store from '@/lib/store';
import { buildBackup } from '@/lib/backup';
import { fresh, saved, ex, pressAlert } from './helpers';
import { renderApp, flushAll, screen, tap, act, fireEvent } from './app';
import { hkWorld, watchStrength, OWN_BUNDLE, WATCH_BUNDLE, type World } from './health-world';

const NOW = new Date(2026, 9, 14, 20, 0); const S = () => store.getState(); let W: World;
afterEach(() => { jest.restoreAllMocks(); });
const settle = async () => { for (let i = 0; i < 8; i++) await flushAll(10); };
const sw = async (label: string, v: boolean) => { await act(async () => { fireEvent(screen.getByLabelText(label), 'valueChange', v); }); await settle(); };
let handlers: ((s: string) => void)[] = [];
const start = async (url = '/') => {
  handlers = []; jest.spyOn(AppState, 'addEventListener').mockImplementation(((ev: string, cb: any) => { if (ev === 'change') handlers.push(cb); return { remove: () => {} }; }) as any);
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); jest.setSystemTime(NOW.getTime()); await settle();
};
const foreground = async () => { await act(async () => { handlers.forEach(h => h('background')); }); await act(async () => { handlers.forEach(h => h('active')); }); await settle(); };
/** Trening w toku zaczęty 55 minut temu z jedną odhaczoną serią — „Zakończ” przez UI. */
async function finishViaUi() {
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = S().active!; a.startedAt = NOW.getTime() - 55 * 60e3; const s = a.exercises[0].sets[0]; s.weight = 100; s.reps = 5; s.done = true; s.completedAt = NOW.getTime() - 5 * 60e3; store.save(a); });
  await flushAll(10); await tap(screen.getByText('Zakończ')); pressAlert('Zakończyć trening?', 'Zakończ'); await settle(); await flushAll(600); await settle();
}

test('scenariusz: kopia zapisana → zegarek się synchronizuje → powrót z tła usuwa kopię → szczegóły z tętnem i kcal → restart', async () => {
  jest.useFakeTimers({ now: NOW }); await fresh(); W = hkWorld(); await act(async () => { await store.flush(); });
  await start('/more/settings');
  await sw('Zapisuj zakończone treningi do Apple Health', true); await sw('Pokazuj dane z Apple Health', true);
  expect([S().settings.healthSync, S().settings.healthRead]).toEqual([true, true]);
  await act(async () => { store.save(); await store.flush(); }); await start('/');
  await finishViaUi();
  const w = S().workouts[0]; expect(S().workouts).toHaveLength(1); expect(w.live).toBe(true);
  expect(W.saved).toHaveLength(1); expect(W.saved[0]).toMatchObject({ bundle: OWN_BUNDLE, syncId: w.id }); expect(w.healthUUID).toBe(W.saved[0].uuid); expect(W.calls.delete).toHaveLength(0);
  /* zegarek kończy trening i synchronizuje się później */
  W.workouts.push(watchStrength(w.startedAt + 2 * 60e3, 50, { hr: { avg: 131.2, max: 158 }, kcal: 287.4 })); await foreground();
  expect(W.calls.delete).toHaveLength(1); expect(W.calls.delete[0][1]).toEqual({ metadata: { withMetadataKey: 'HKMetadataKeySyncIdentifier', operatorType: 4, value: w.id }, sources: [{ name: 'Trening', bundleIdentifier: OWN_BUNDLE }] });
  expect(W.workouts.map(x => x.bundle)).toEqual([WATCH_BUNDLE]); expect(S().workouts[0].healthUUID).toBe('watch');
  /* szczegóły sesji */
  await act(async () => { const r = require('expo-router').router; r.push(`/history/${w.id}`); }); await settle();
  expect(screen.getByText('Apple Health (zegarek): tętno śr. 131 /min, maks. 158 /min · 287 kcal aktywne')).toBeTruthy();
  /* restart: stan i kopia bez wartości ze Zdrowia, ekran odczytuje je na nowo */
  await store.flush(); const raw = JSON.stringify(saved()); for (const needle of ['avgBpm', 'maxBpm', '"kcal"', WATCH_BUNDLE]) expect(raw).not.toContain(needle); expect(JSON.stringify(buildBackup())).not.toMatch(/avgBpm|bundleIdentifier/);
  await start(`/history/${w.id}`); expect(S().workouts[0].healthUUID).toBe('watch'); expect(S().settings.healthRead).toBe(true);
  expect(screen.getByText('Apple Health (zegarek): tętno śr. 131 /min, maks. 158 /min · 287 kcal aktywne')).toBeTruthy();
  W.workouts = []; await start(`/history/${w.id}`); expect(screen.queryByTestId('session-health')).toBeNull(); /* zegarek zniknął ze Zdrowia → linii nie ma, sesja zostaje */
});

test('scenariusz: zegarek zakończył trening przed „Zakończ” → własna kopia w ogóle nie powstaje (jeden wpis w Zdrowiu)', async () => {
  jest.useFakeTimers({ now: NOW }); await fresh(); W = hkWorld(); S().settings.healthSync = true; S().settings.healthRead = true; store.save(); await act(async () => { await store.flush(); });
  W.workouts.push(watchStrength(NOW.getTime() - 54 * 60e3, 53)); await start('/'); await finishViaUi();
  expect(S().workouts).toHaveLength(1); expect(W.saved).toHaveLength(0); expect(W.calls.delete).toHaveLength(0); expect(S().workouts[0].healthUUID).toBe('watch'); expect(S().workouts[0].healthPending).toBeUndefined();
  expect(W.workouts).toHaveLength(1);
});

test('scenariusz: odczyt wyłączony → zapis jak dotąd, ŻADNE zapytanie do Zdrowia o treningi i kroki', async () => {
  jest.useFakeTimers({ now: NOW }); await fresh(); W = hkWorld(); S().settings.healthSync = true; store.save(); await act(async () => { await store.flush(); });
  W.workouts.push(watchStrength(NOW.getTime() - 54 * 60e3, 53)); await start('/'); await finishViaUi(); await foreground();
  expect(W.saved).toHaveLength(1); expect(S().workouts[0].healthUUID).toBe(W.saved[0].uuid); expect(W.spies.queryWorkoutSamples).not.toHaveBeenCalled(); expect(W.spies.queryStatisticsCollectionForQuantity).not.toHaveBeenCalled(); expect(W.spies.deleteObjects).not.toHaveBeenCalled();
});
