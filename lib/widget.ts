import { finishedWorkouts, fmtDate, isWorking } from './store';
import { thisMonday } from './stats';
import { t, tp } from './i18n';

/*
 * Widżet na ekran główny (docs/21 pkt 4a; decyzja właściciela 07.10.2026 wieczór): podsumowanie tygodnia i ostatni trening — same liczby
 * z danych użytkownika. Aplikacja liczy wszystko tutaj (także teksty w języku aplikacji) i zapisuje JSON we wspólnej grupie aplikacji;
 * widżet Swift (targets/rest-widget/SummaryWidget.swift) tylko pokazuje. Tydzień od poniedziałku — jak statystyki i kalendarz.
 * Po końcu tygodnia bez otwarcia aplikacji widżet pokazuje zera (pola zero*) zamiast starych liczb.
 */
export const WIDGET = { group: 'group.pl.lukasz.trening', key: 'summary', kind: 'TreningSummary' } as const;

export type WidgetSummary = {
  v: 1; weekStart: number; weekEnd: number; workouts: number; sets: number; lastName: string; lastAt: number;
  text: { week: string; workouts: string; sets: string; zeroWorkouts: string; zeroSets: string; last: string; lastDate: string; none: string };
};

export function widgetSummary(now = Date.now()): WidgetSummary {
  const d = new Date(now); const weekStart = thisMonday(0, d); const weekEnd = thisMonday(1, d);
  const ws = finishedWorkouts(); const inWeek = ws.filter(w => w.startedAt >= weekStart && w.startedAt < weekEnd);
  const sets = inWeek.reduce((a, w) => a + w.exercises.reduce((b, e) => b + e.sets.filter(isWorking).length, 0), 0);
  const last = ws.reduce<typeof ws[number] | null>((a, w) => (!a || w.startedAt > a.startedAt ? w : a), null);
  const n = inWeek.length;
  return {
    v: 1, weekStart, weekEnd, workouts: n, sets, lastName: last ? last.templateName || t('Trening') : '', lastAt: last?.startedAt ?? 0,
    text: {
      week: t('W tym tygodniu'), workouts: `${n} ${tp(n, 'trening|treningi|treningów')}`, sets: `${sets} ${tp(sets, 'seria|serie|serii')}`,
      zeroWorkouts: `0 ${tp(0, 'trening|treningi|treningów')}`, zeroSets: `0 ${tp(0, 'seria|serie|serii')}`,
      last: t('Ostatni trening'), lastDate: last ? fmtDate(last.startedAt) : '', none: t('Jeszcze bez treningu'),
    },
  };
}

type Storage = { set(key: string, value: string): void };
type StorageCtor = { new (group: string): Storage; reloadWidget(name?: string): void };
let mod: StorageCtor | null | undefined;
function storage(): StorageCtor | null {
  if (mod !== undefined) return mod;
  try { mod = (require('@bacons/apple-targets') as { ExtensionStorage: StorageCtor }).ExtensionStorage ?? null; } catch { mod = null; }
  return mod;
}
let lastJson = '';
/** Zapis podsumowania i odświeżenie widżetu — tylko gdy treść się zmieniła; brak modułu (Expo Go, test bez atrapy) — nic. */
export function pushWidget(now = Date.now()) {
  const S = storage(); if (!S) return;
  const json = JSON.stringify(widgetSummary(now)); if (json === lastJson) return;
  try { new S(WIDGET.group).set(WIDGET.key, json); S.reloadWidget(WIDGET.kind); lastJson = json; } catch { /* widżet to dodatek — błąd zapisu nie przeszkadza aplikacji */ }
}
/** Testy: nowy start (zapamiętana treść znika). */
export function resetWidgetCache() { lastJson = ''; }
