/*
 * Migracja State.liveDays (M5 S1, decyzja właściciela 22.10.2026): dni treningowe limitu darmowego są ZAPISANE osobno (usunięcie treningu nie zwraca dnia).
 * Poprawne wpisy zostają; brak pola albo uszkodzone → uzupełnione z istniejącej historii: dni BIEŻĄCEGO miesiąca z ukończonych treningów na żywo dłuższych niż
 * MIN_LIVE_MINUTES_FOR_DAY (czas bez pauz). Idempotentne; pusta lista = brak pola. Zależy od: ../access (czysty), ./util.
 */
import { qualifiesForDay, recordLiveDay, monthKey, type LiveStart } from '../access';
import type { Workout } from '../seed';
import { isObj } from './util';

/** Czas trwania zakończonego treningu bez pauz (s) — jak workoutDurSec, ale na surowych danych migracji. */
function durSec(w: Workout): number {
  const paused = Array.isArray(w.pauses) ? w.pauses.reduce((n: number, p: [number, number]) => n + Math.max(0, (Number(p?.[1]) || 0) - (Number(p?.[0]) || 0)), 0) : 0;
  return Math.max(0, ((w.finishedAt as number) - w.startedAt - paused) / 1000);
}

export function normalizeLiveDays(raw: any): void {
  const good = Array.isArray(raw.liveDays) && raw.liveDays.every((d: unknown) => isObj(d) && Number.isFinite(d.startedAt) && (d.tzOffsetMin === undefined || Number.isFinite(d.tzOffsetMin)));
  let list: LiveStart[] = [];
  if (good) for (const d of raw.liveDays) list = recordLiveDay(list, { startedAt: d.startedAt, ...(d.tzOffsetMin !== undefined ? { tzOffsetMin: d.tzOffsetMin } : {}) });
  else {
    const nowTs = Date.now(); const cur = monthKey(nowTs, -new Date(nowTs).getTimezoneOffset());
    for (const w of (Array.isArray(raw.workouts) ? raw.workouts : []) as Workout[]) {
      if (w.live !== true || w.finishedAt == null || !Number.isFinite(w.startedAt) || !qualifiesForDay(durSec(w))) continue;
      if (monthKey(w.startedAt, w.tzOffsetMin ?? -new Date(w.startedAt).getTimezoneOffset()) !== cur) continue;
      list = recordLiveDay(list, { startedAt: w.startedAt, ...(Number.isFinite(w.tzOffsetMin) ? { tzOffsetMin: w.tzOffsetMin } : {}) });
    }
  }
  if (list.length) raw.liveDays = list; else delete raw.liveDays;
}
