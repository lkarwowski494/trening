import { renderRouter, screen } from 'expo-router/testing-library';
import { act, cleanupAsync, fireEvent } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { router } from 'expo-router';
import { store as routerStore } from 'expo-router/build/global-state/router-store';

/** Uruchamia całą aplikację (prawdziwe ekrany expo-router) na świeżym stanie. */
export async function renderApp(opts: { saved?: unknown; locale?: 'pl' | 'en'; url?: string; width?: number } = {}) {
  /* SDK 53 (React 19, RNTL 13 z równoległym korzeniem, expo-router 5): drugi renderApp w tym samym teście (nowy „start aplikacji”)
   * odświeżał jeszcze zamontowane drzewo z poprzedniego startu — wspólny stan routera — a to czytało już wyzerowany store
   * („store not initialised”). Poprzednie uruchomienie odmontowujemy, zanim zerujemy store, tak jak zamknięcie aplikacji przed ponownym startem.
   * `screen` i tak wskazywał tylko ostatni render, więc asercje dotyczą wyłącznie nowego drzewa (jak przed aktualizacją). */
  await cleanupAsync();
  global.__kv.clear(); global.__dbFail = false; global.__alerts.length = 0; global.__notifications.length = 0; global.__la.length = 0;
  global.__locales = [{ languageCode: opts.locale ?? 'pl', languageTag: opts.locale === 'en' ? 'en-GB' : 'pl-PL' }];
  if (opts.saved !== undefined) global.__kv.set('state', typeof opts.saved === 'string' ? opts.saved : JSON.stringify(opts.saved));
  store.__resetForTests(); timer.T.on = false; timer.S.on = false;
  const r = renderRouter('./app', { initialUrl: opts.url ?? '/' });
  /* SDK 53: renderRouter z expo-router 4 przy każdej zmianie stanu nawigacji wołał jest.runOnlyPendingTimers()
   * (subscribeToRootState) — wszystkie 922 testy pisano i sprawdzano przy tym zachowaniu (np. komunikat „Zapisałem trening”
   * z opóźnieniem 500 ms po starcie, blokada podwójnego „Edytuj” 1 s po powrocie z edytora). expo-router 5 to usunął,
   * więc odtwarzamy je tutaj tym samym zdarzeniem ('state' kontenera nawigacji), żeby zegar testów biegł jak przed aktualizacją
   * i żadna asercja „czegoś nie ma” nie stała się pusta przez niewykonane timery. */
  if (!routerStore.navigationRef?.addListener) throw new Error('tests/app.tsx: brak store.navigationRef w expo-router — sprawdź odtworzenie runOnlyPendingTimers po aktualizacji routera');
  routerStore.navigationRef.addListener('state', () => jest.runOnlyPendingTimers());
  // Czekamy na init() krokami fałszywego zegara (findBy* z fałszywymi timerami potrafił zapętlić się przy kolejnych testach).
  for (let i = 0; i < 40 && !store.isReadyForTests(); i++) await act(async () => { jest.advanceTimersByTime(10); await Promise.resolve(); });
  await act(async () => { jest.advanceTimersByTime(10); await Promise.resolve(); });
  return r;
}
export const tap = async (el: Parameters<typeof fireEvent.press>[0]) => { await act(async () => { fireEvent.press(el); }); };
export const type = async (el: Parameters<typeof fireEvent.changeText>[0], text: string) => { await act(async () => { fireEvent.changeText(el, text); }); };
/** renderRouter włącza fałszywe timery Jesta — czas przesuwamy ręcznie (setTimeout/setInterval/Date). */
export const flushAll = async (ms = 0) => { await act(async () => { jest.advanceTimersByTime(ms); await Promise.resolve(); await Promise.resolve(); }); };
export { screen, act, fireEvent };
export const go = async (href: string) => { await act(async () => { router.push(href as never); }); };
