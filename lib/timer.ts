import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { getState, setTimerState, findSet, fmtTime, STALE_ASK_MS } from './store';
import * as LA from '@/modules/rest-activity';
import { t } from './i18n';

/** Ustawienie „Dźwięk i wibracja” (do 0.7.1 przełącznik istniał, ale nic nie wyłączał — T-039). */
const soundOn = () => { try { return getState().settings.sound !== false; } catch { return true; } };

/** Etykiety do Live Activity — ustawiane przez ekran treningu przed startem timera. */
export const labels = { title: '', subtitle: '' };
const title = () => labels.title || (() => { try { return getState().active?.templateName || t('Trening'); } catch { return t('Trening'); } })();

/*
 * Timer przerw: odliczanie w aplikacji + lokalne powiadomienie na koniec, żeby zablokowany telefon też dał znać.
 * Audyt 0.8.1: przerwa i stoper wskazują serię po id (nie po pozycji), przerwę zatrzymuje tylko cofnięcie odhaczenia
 * tej serii, która ją uruchomiła, a korekta ±15 s nie schodzi poniżej zera.
 */

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: soundOn(), shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true }),
});

/** Stałe identyfikatory powiadomień (audyt r1): po restarcie apki da się anulować powiadomienie zaplanowane przed nim. */
const REST_ID = 'rest-end'; const SET_ID = 'set-end';
const listeners = new Set<() => void>();
/*
 * Runda 19: Live Activity jest jedna naraz (moduł natywny kończy poprzednią przy starcie). Zapamiętujemy, czyja jest
 * — przerwy czy serii — i każdy timer kończy/aktualizuje tylko swoją. Gdy jeden się kończy, a drugi trwa, drugi ją przejmuje.
 */
let laKind: 'rest' | 'set' | null = null;
// Runda 37: etykieta rodzaju („Przerwa”/„Seria”) w języku aplikacji, przekazana w polu kind jako „rest|Przerwa” (widżet dzieli po „|”).
const laStart = (kind: 'rest' | 'set', sub: string, endAt: number, total: number) => { laKind = kind; LA.start(title(), sub, endAt, total, `${kind}|${kind === 'set' ? t('Seria') : t('Przerwa')}`).catch(() => {}); };
const laEnd = (kind: 'rest' | 'set') => { if (laKind !== kind) return; laKind = null; LA.end().catch(() => {}); handover(); };
/** Po końcu jednej aktywności: pokaż drugi trwający timer (jeśli odlicza do celu). */
function handover() {
  if (laKind) return; const now = Date.now();
  if (T.on && !T.alarmed && T.endAt > now) laStart('rest', T.sub || t('przerwa {s} s', { s: Math.round(T.total) }), T.endAt, T.total);
  else if (S.on && S.targetSec > 0 && !S.alarmed && S.startAt + S.targetSec * 1000 > now) laStart('set', t('seria {s} s', { s: S.targetSec }), S.startAt + S.targetSec * 1000, S.targetSec);
}
export const T = { endAt: 0, total: 0, on: false, alarmed: false, setId: null as string | null, sub: '' };

export async function ensurePermission(): Promise<boolean> {
  const cur = await Notifications.getPermissionsAsync();
  if (cur.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

/** Start przerwy; `setId` = seria, która ją uruchomiła. */
/** `from` — początek przerwy, gdy seria skończyła się wcześniej niż teraz (stoper z celem, T8); przerwa trwa `sec` od tej chwili. */
export async function start(sec: number, setId: string | null = null, from?: number) {
  T.endAt = (from != null && Number.isFinite(from) ? Math.min(from, Date.now()) : Date.now()) + sec * 1000; T.total = sec; T.on = true; T.alarmed = false; T.setId = setId; T.sub = labels.subtitle; // runda 23: podpis należy do tej przerwy
  setTimerState({ restEndAt: T.endAt, restTotal: T.total, restSetId: setId });
  await reschedule();
  laStart('rest', labels.subtitle || t('przerwa {s} s', { s: Math.round(sec) }), T.endAt, T.total);
  emit();
}
/** Korekta ±s; koniec przerwy nie cofa się przed „teraz”. */
export async function adjust(delta: number) {
  if (!T.on) return;
  const now = Date.now(); const over = T.endAt <= now;
  if (over && delta < 0) return; // skracanie przerwy, która już minęła, nic nie znaczy
  // Po końcu przerwy „+15” liczy od teraz (runda 2: wcześniej ustawiało koniec na „teraz” i nic nie dawało).
  T.endAt = over ? now + delta * 1000 : Math.max(now, T.endAt + delta * 1000); T.total = Math.max(0, T.total + delta);
  setTimerState({ restEndAt: T.endAt, restTotal: T.total });
  const sub = T.sub || t('przerwa {s} s', { s: Math.round(T.total) });
  // Wydłużenie po końcu przerwy uzbraja alarm na nowo i przywraca Live Activity (wcześniej tylko powiadomienie).
  if (T.alarmed && T.endAt > Date.now()) { T.alarmed = false; if (laKind !== 'set') laStart('rest', sub, T.endAt, T.total); } else if (laKind === 'rest') LA.update(sub, T.endAt, T.total).catch(() => {});
  await reschedule(); emit();
}
/** E2 (docs/14 pkt 3.8): nowy podpis TRWAJĄCEJ przerwy — po zamianie ćwiczenia (podpis jest zamrażany na starcie przerwy, T.sub), także na Live Activity. */
export function relabel(sub: string) {
  if (!T.on || !sub || sub === T.sub) return; T.sub = sub; labels.subtitle = sub;
  if (laKind === 'rest' && !T.alarmed) LA.update(sub, T.endAt, T.total).catch(() => {}); emit();
}
export async function stop() { const was = T.on; T.on = false; T.setId = null; setTimerState({ restEndAt: null, restTotal: 0, restSetId: null }); await cancelScheduled(); if (was) laEnd('rest'); emit(); }
/** Zatrzymuje przerwę tylko wtedy, gdy uruchomiła ją ta seria (cofnięcie odhaczenia starszej serii nie kasuje bieżącej przerwy). */
export async function stopIfFrom(setId: string) { if (T.on && T.setId === setId) await stop(); }

/**
 * Odtworzenie timerów po ponownym uruchomieniu aplikacji (0.2.1, „twardy timer”): znaczniki są w stanie, więc
 * odliczanie wraca w to samo miejsce. Powiadomienia i Live Activity planujemy ponownie, jeśli koniec jest w przyszłości.
 */
export async function restore() {
  scheduleWeighReminder().catch(() => {}); /* runda 75 (T-013) */
  laKind = null; // wołane przy starcie: właściciel Live Activity sprzed restartu jest nieznany
  const st = getState(); const ts = st.timer;
  if (!ts || !st.active) { laKind = null; LA.end().catch(() => {}); if (ts && (ts.restEndAt || ts.setStartAt)) setTimerState({ restEndAt: null, restTotal: 0, restSetId: null, setStartAt: null, setTarget: 0, setId: null }); return; }
  if (ts.restEndAt && ts.restEndAt > Date.now() - 3600e3 && ts.restEndAt <= Date.now() + (Number(ts.restTotal) || 0) * 1000 + 60e3 /* runda 53: koniec dalej niż cała przerwa = uszkodzony zapis */) { T.endAt = ts.restEndAt; T.total = ts.restTotal; T.on = true; T.setId = ts.restSetId ?? null; T.alarmed = ts.restEndAt <= Date.now(); if (!T.alarmed) { await reschedule(); laStart('rest', t('przerwa {s} s', { s: Math.round(T.total) }), T.endAt, T.total); } }
  // Stoper z celem wraca, dopóki seria istnieje (stopSet przycina do celu — seria kończy się o starcie + cel). Runda 75 (Q-002):
  // stoper bez celu nie wraca — store.resolveColdStopwatch() przy starcie odhacza serię z czasem z pola albo ją zostawia.
  if (ts.setStartAt && ts.setStartAt <= Date.now() + 60e3 /* runda 53: start w przyszłości */ && ts.setTarget > 0 && findSet(ts.setId)) {
    S.on = true; S.startAt = ts.setStartAt; S.targetSec = ts.setTarget; S.setId = ts.setId; S.alarmed = S.targetSec > 0 && Date.now() - S.startAt >= S.targetSec * 1000;
    if (S.targetSec > 0 && !S.alarmed) { await scheduleSetEnd(); if (laKind !== 'rest') laStart('set', t('seria {s} s', { s: S.targetSec }), S.startAt + S.targetSec * 1000, S.targetSec); }
  }
  // Runda 20: po restarcie nikt nie „posiada” starej Live Activity — jeśli nic jej nie przejęło, kończymy ją od razu.
  if (!laKind) LA.end().catch(() => {});
  emit();
}
/** Powrót apki na pierwszy plan: zakończ Live Activity, jeśli przerwa minęła w tle (bez push nie da się tego zrobić w tle). */
export function onForeground() {
  if (S.on && S.targetSec > 0 && !S.alarmed && Date.now() - S.startAt >= S.targetSec * 1000) { S.alarmed = true; laEnd('set'); emit(); }
  if (T.on && T.endAt <= Date.now()) { T.alarmed = true; laEnd('rest'); emit(); }
}
/** Po imporcie / resecie: wszystko stop, bez śladu w stanie. */
export async function resetAll() { await stopSet(); await stop(); }

async function cancelScheduled() { try { await Notifications.cancelScheduledNotificationAsync(REST_ID); } catch {} }
async function reschedule() {
  await cancelScheduled();
  const seconds = Math.max(1, Math.round((T.endAt - Date.now()) / 1000));
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: REST_ID,
      content: { title: t('Przerwa minęła'), body: t('Następna seria.'), sound: soundOn() },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds, repeats: false },
    });
  } catch {}
}

/* ---------- Stoper serii czasowych (T-020) ----------
 * Odlicza w dół do celu (targetSec) albo w górę, gdy celu nie ma. Przy celu planuje powiadomienie lokalne.
 * Zakończenie (auto lub ręczne) obsługuje ekran treningu.
 */
export const S = { on: false, startAt: 0, targetSec: 0, setId: null as string | null, alarmed: false };
export async function startSet(setId: string, targetSec: number) {
  if (T.on) await stop(); // jeden timer naraz (runda 19: wycofane równoległe działanie z rundy 18)
  S.on = true; S.startAt = Date.now(); S.targetSec = Math.min(86400, Math.max(0, Math.round(targetSec || 0))); /* runda 55: jak przy wczytaniu */ S.setId = setId; S.alarmed = false;
  setTimerState({ setStartAt: S.startAt, setTarget: S.targetSec, setId });
  // Live Activity tylko dla serii z celem — widżet odlicza w dół; seria bez celu liczy w górę wyłącznie w aplikacji.
  if (S.targetSec > 0) laStart('set', labels.subtitle || t('seria {s} s', { s: S.targetSec }), S.startAt + S.targetSec * 1000, S.targetSec);
  await scheduleSetEnd();
  emit();
}
/** Runda 66: po zmianie dźwięku w Ustawieniach zaplanowane powiadomienia trwającej przerwy/serii dostają nowe ustawienie. */
export async function refreshScheduled() { if (T.on && !T.alarmed && T.endAt > Date.now()) await reschedule(); /* runda 67: po czasie nie planujemy drugiego „Przerwa minęła” */ if (S.on && !S.alarmed) await scheduleSetEnd(); await scheduleWeighReminder(); /* runda 75: treść w nowym języku */ }
async function scheduleSetEnd() {
  await cancelSetScheduled();
  const left = Math.round((S.startAt + S.targetSec * 1000 - Date.now()) / 1000);
  if (S.targetSec > 0 && left > 0) { try { await Notifications.scheduleNotificationAsync({ identifier: SET_ID, content: { title: t('Seria skończona'), body: t('Minęło {s} s.', { s: S.targetSec }), sound: soundOn() }, trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: left, repeats: false } }); } catch {} }
}
/**
 * Zatrzymuje stoper i zwraca czas serii w sekundach. Przy serii z celem wynik nie przekracza celu — gdy telefon był
 * zablokowany, aplikacja „budzi się” później i bez tego zapisywała cały czas blokady (fałszywy rekord czasu).
 */
export async function stopSet(): Promise<{ setId: string | null; sec: number; endAt: number }> {
  const raw = S.on ? Math.round((Date.now() - S.startAt) / 1000) : 0;
  /* T8: seria z celem skończyła się o starcie + cel — także gdy aplikacja (zabita, w tle) dowiaduje się o tym godziny później */
  const endAt = S.on && S.targetSec > 0 && raw > S.targetSec ? S.startAt + S.targetSec * 1000 : Date.now();
  const sec = Math.min(86400, S.targetSec > 0 ? Math.min(raw, S.targetSec) : raw); /* runda 62: doba, jak pole i wczytanie */ const id = S.setId;
  const wasOn = S.on; S.on = false; S.setId = null; setTimerState({ setStartAt: null, setTarget: 0, setId: null }); await cancelSetScheduled(); if (wasOn) laEnd('set'); emit();
  return { setId: id, sec, endAt };
}
export const setElapsed = () => S.on ? (Date.now() - S.startAt) / 1000 : 0;
export const setReached = () => S.on && S.targetSec > 0 && Date.now() - S.startAt >= S.targetSec * 1000;
async function cancelSetScheduled() { try { await Notifications.cancelScheduledNotificationAsync(SET_ID); } catch {} }

/** Wywoływane cyklicznie z ekranu treningu: wibracja przy końcu serii/przerwy i zakończenie Live Activity po czasie. */
export function tick() {
  if (S.on && S.targetSec > 0 && !S.alarmed && Date.now() - S.startAt >= S.targetSec * 1000) { S.alarmed = true; laEnd('set'); /* runda 68: jak w onForeground — także bez ekranu treningu */ if (Platform.OS !== 'web' && soundOn()) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); }
  if (!T.on) return;
  const left = Math.round((T.endAt - Date.now()) / 1000);
  if (left <= 0 && !T.alarmed) { T.alarmed = true; if (Platform.OS !== 'web' && soundOn()) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); laEnd('rest'); emit(); }
}
export function subscribe(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; }
function emit() { listeners.forEach(l => l()); }

/* Runda 69: przypomnienie o porzuconym treningu — 2 h po ostatniej odhaczonej serii (albo po „Kontynuuj”). */
/** Runda 75 (T-013): przypomnienie o wadze w poniedziałek o 7:00 — usunięte 05.10.2026 razem z porannym wpisem; zostaje odwołanie dawnego. */
const WEIGH_ID = 'weigh-reminder';
export async function scheduleWeighReminder() {
  /* Decyzja właściciela 05.10.2026: poranny wpis usunięty z aplikacji — przypomnienie zaplanowane przez starszą wersję jest odwoływane, nowe nie powstaje
   * (ustawienie weighReminder zostaje w danych bez znaczenia). */
  try { await Notifications.cancelScheduledNotificationAsync(WEIGH_ID); } catch {}
}
const STALE_ID = 'stale-reminder';
export async function cancelStaleReminder() { try { await Notifications.cancelScheduledNotificationAsync(STALE_ID); } catch {} }
/** Runda 71 (T3): treść zależy od tego, co już zrobiono — bez serii roboczych nie ma czego „zakończyć i zapisać”. */
export type StaleKind = 'work' | 'warmup' | 'none';
export const staleBody = (kind: StaleKind, at: number, prompt = false) => kind === 'work'
  ? (prompt ? t('Ostatnia seria o {t}. Zakończyć trening z tą godziną końca?', { t: fmtTime(at) }) : t('Ostatnia seria o {t}. Otwórz, by zakończyć albo kontynuować.', { t: fmtTime(at) }))
  : kind === 'warmup'
    ? (prompt ? t('Ostatnia rozgrzewka o {t}, bez serii roboczych. Kontynuować czy odrzucić?', { t: fmtTime(at) }) : t('Ostatnia rozgrzewka o {t}, bez serii roboczych. Otwórz, by kontynuować albo odrzucić.', { t: fmtTime(at) }))
    : (prompt ? t('Trening rozpoczęty o {t}, bez odhaczonych serii. Kontynuować czy odrzucić?', { t: fmtTime(at) }) : t('Trening rozpoczęty o {t}, bez odhaczonych serii. Otwórz, by kontynuować albo odrzucić.', { t: fmtTime(at) }));
export async function scheduleStaleReminder(fromMs: number, lastSetMs = fromMs, kind: StaleKind = 'work') {
  await cancelStaleReminder(); const secs = Math.round((fromMs + STALE_ASK_MS - Date.now()) / 1000); if (!(secs >= 1) || secs > 86400) return;
  try { await Notifications.scheduleNotificationAsync({ identifier: STALE_ID, content: { title: t('Trening wciąż trwa'), body: staleBody(kind, lastSetMs), sound: soundOn() }, trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: secs, repeats: false } }); } catch {}
}

