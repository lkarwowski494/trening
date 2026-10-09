import { renderRouter, screen } from 'expo-router/testing-library';
import { act, cleanupAsync, fireEvent } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { router } from 'expo-router';
import { store as routerStore } from 'expo-router/build/global-state/router-store';

/** Uruchamia całą aplikację (prawdziwe ekrany expo-router) na świeżym stanie. */
/** `navTimers` (domyślnie true): odtworzone zachowanie expo-router 4 — przy każdej zmianie nawigacji `jest.runOnlyPendingTimers()` (niżej).
 * false — bez tego: test sam przesuwa zegar i może sprawdzić, że po nawigacji nie zostaje żaden zaległy timer (docs/13 B11, NISKIE). */
export async function renderApp(opts: { saved?: unknown; locale?: 'pl' | 'en'; url?: string; width?: number; navTimers?: boolean; /** znacznik języka i regionu telefonu (np. „en-US” — symulator E2E); domyślnie en-GB / pl-PL */ tag?: string; /** dodatkowe klucze bazy (np. „drafts” — szkice sprzed zamknięcia aplikacji, UX2-03) */ kv?: Record<string, string> } = {}) {
  /* SDK 53 (React 19, RNTL 13 z równoległym korzeniem, expo-router 5): drugi renderApp w tym samym teście (nowy „start aplikacji”)
   * odświeżał jeszcze zamontowane drzewo z poprzedniego startu — wspólny stan routera — a to czytało już wyzerowany store
   * („store not initialised”). Poprzednie uruchomienie odmontowujemy, zanim zerujemy store, tak jak zamknięcie aplikacji przed ponownym startem.
   * `screen` i tak wskazywał tylko ostatni render, więc asercje dotyczą wyłącznie nowego drzewa (jak przed aktualizacją). */
  await cleanupAsync();
  global.__kv.clear(); global.__dbFail = false; global.__alerts.length = 0; global.__notifications.length = 0; global.__la.length = 0;
  global.__locales = [{ languageCode: opts.locale ?? 'pl', languageTag: opts.tag ?? (opts.locale === 'en' ? 'en-GB' : 'pl-PL') }];
  if (opts.saved !== undefined) global.__kv.set('state', typeof opts.saved === 'string' ? opts.saved : JSON.stringify(opts.saved));
  for (const [k, v] of Object.entries(opts.kv ?? {})) global.__kv.set(k, v);
  store.__resetForTests(); require('@/lib/planReminder').__resetReminderAsk(); /* X-11: nowe uruchomienie */ timer.T.on = false; timer.S.on = false; require('@/lib/intro').__resetIntroForTests(); /* nowy start = zimny start (animacja: components/Intro.tsx) */
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
/**
 * Usuwanie przesunięciem w lewo (decyzja właściciela 07.10.2026 wieczór): w testach — akcja dostępności „delete” o etykiecie `label`
 * (ta sama etykieta co przycisk „Usuń” odsłaniany pod wierszem). Potwierdzenie: pressAlert(tytuł, 'Usuń') z tests/helpers.ts.
 */
export const swipeDelete = async (label: string | RegExp, nth = 0) => {
  const hit = (l: string) => typeof label === 'string' ? l === label : label.test(l);
  /* ten sam wiersz występuje w drzewie kilka razy (komponent i jego element natywny) — liczymy po funkcji akcji */
  const all = screen.UNSAFE_root.findAll((n: { props: Record<string, any> }) => typeof n.props.onAccessibilityAction === 'function' && Array.isArray(n.props.accessibilityActions) && n.props.accessibilityActions.some((a: { name: string; label?: string }) => a.name === 'delete' && hit(a.label ?? '')));
  const el = all.filter((n: { props: Record<string, any> }, i: number) => all.findIndex((m: { props: Record<string, any> }) => m.props.onAccessibilityAction === n.props.onAccessibilityAction) === i)[nth];
  if (!el) throw new Error(`brak wiersza z akcją usuwania „${String(label)}”`);
  await act(async () => { el.props.onAccessibilityAction({ nativeEvent: { actionName: 'delete' } }); });
};
/** Etykiety akcji „usuń” widoczne na ekranie (do sprawdzeń, że wiersz da się usunąć gestem). */
export const deleteActions = (): string[] => screen.UNSAFE_root.findAll((n: { props: Record<string, any> }) => typeof n.props.onAccessibilityAction === 'function' && Array.isArray(n.props.accessibilityActions))
  .flatMap((n: { props: Record<string, any> }) => n.props.accessibilityActions.filter((a: { name: string }) => a.name === 'delete').map((a: { label: string }) => a.label)).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
/** Edycja na żądanie (decyzja właściciela 08.10.2026, docs/18): ekran szablonu i ćwiczenia otwiera się w podglądzie — `startEdit` tapuje „Edytuj”
 * (gdy ekran jest w podglądzie), `saveEdit` — „Zapisz” w nagłówku (zmiany trafiają do danych dopiero wtedy). */
export const startEdit = async () => { const { t } = require('@/lib/i18n'); const b = screen.queryByLabelText(t('Edytuj szablon')) ?? screen.queryByLabelText(t('Edytuj ćwiczenie')); if (b) { await tap(b); await flushAll(5); } };
export const saveEdit = async () => { const { t } = require('@/lib/i18n'); const b = screen.queryByLabelText(t('Zapisz szablon')) ?? screen.queryByLabelText(t('Zapisz ćwiczenie')); if (!b) throw new Error('saveEdit: brak „Zapisz” — ekran nie jest w edycji'); await tap(b); await flushAll(5); };
/** Szkic w trakcie edycji (lib/draft.ts) — do sprawdzania wpisów przed „Zapisz”. */
export const tplDraft = (id: string) => require('@/lib/draft').objDraft('template', id) as import('@/lib/seed').Template;
export const exDraft = (id: string) => require('@/lib/draft').objDraft('exercise', id) as import('@/lib/seed').Exercise;
/** Układ B ekranu głównego (09.10.2026): „Pusty trening” i „Powtórz ostatni” są w arkuszu „Inny trening” (components/StartPanel). Tapie element
 * o tym tekście — gdy nie ma go na ekranie (np. duży przycisk „Pusty trening” bez szablonów), najpierw otwiera arkusz. */
export const fromHome = async (text: string | RegExp) => {
  const { t } = require('@/lib/i18n');
  const find = () => { const a = screen.queryAllByText(text); return a.length ? a : screen.queryAllByLabelText(text); }; /* wiersz arkusza: etykieta VoiceOver (np. „Powtórz ostatni (Push A)”) inna niż tytuł */
  let el = find();
  if (!el.length) { const other = screen.queryAllByLabelText(t('Inny trening')); if (other.length) { await tap(other[0]); await flushAll(5); } el = find(); }
  if (!el.length) throw new Error('fromHome: brak „' + String(text) + '”');
  await tap(el[0]);
};
