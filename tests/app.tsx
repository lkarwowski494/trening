import { renderRouter, screen } from 'expo-router/testing-library';
import { act, cleanupAsync, fireEvent } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { router } from 'expo-router';
import { store as routerStore } from 'expo-router/build/global-state/router-store';

/** Uruchamia całą aplikację (prawdziwe ekrany expo-router) na świeżym stanie. */
/** `navTimers` (domyślnie true): odtworzone zachowanie expo-router 4 — przy każdej zmianie nawigacji `jest.runOnlyPendingTimers()` (niżej).
 * false — bez tego: test sam przesuwa zegar i może sprawdzić, że po nawigacji nie zostaje żaden zaległy timer (docs/13 B11, NISKIE). */
export async function renderApp(opts: { saved?: unknown; locale?: 'pl' | 'en'; url?: string; width?: number; navTimers?: boolean } = {}) {
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
  if (opts.navTimers !== false) routerStore.navigationRef.addListener('state', () => jest.runOnlyPendingTimers());
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

/** Ekran miejsca (05.10.2026): grupy sprzętu są zwinięte — rozwija wszystkie (testy sprzed zwijania). */
export const expandEquip = async () => { const { EQUIP_GROUPS, EQUIP_GROUP_LABEL, equipLabel } = require('@/lib/equipment'); for (const g of EQUIP_GROUPS) { const el = screen.queryByLabelText(equipLabel(EQUIP_GROUP_LABEL[g])); if (el && !el.props.accessibilityState?.expanded) await tap(el); } };
/** Edytor szablonu (06.10.2026): karty ćwiczeń zwinięte, otwarta jedna — otwiera kartę nr `i` (kolejność na ekranie). */
export const openCard = async (i = 0) => { const cards = screen.getAllByRole('button').filter(b => b.props.accessibilityState?.expanded !== undefined && b.props.accessibilityValue?.text !== undefined); if (cards[i] && !cards[i].props.accessibilityState?.expanded) await tap(cards[i]); };
