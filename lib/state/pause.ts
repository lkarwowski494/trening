/*
 * Pauza treningu (decyzja właściciela 08.10.2026): czas pauz odejmuje się od czasu trwania; porządkowanie przedziałów pauz.
 * Zależy od: ./core; zewnętrzne: ../seed.
 */
import { type Workout } from '../seed';
import { S, save } from './core';
import { fmtDate, fmtTime, wallTs } from './time';

/* ---------- pauza treningu (decyzja właściciela 08.10.2026: czas pauzy odejmuje się od czasu trwania) ---------- */
/** Suma pauz w ms, łącznie z trwającą (do `now`). */
export const pausedTotal = (w: Workout, now = Date.now()) => (w.pauses ?? []).reduce((acc, [f, t]) => acc + Math.max(0, t - f),
    0) + (w.pausedAt != null ? Math.max(0, now - w.pausedAt) : 0);
export const isPaused = (w: Workout | null | undefined) => w?.pausedAt != null;
/** Czas trwania bez pauz (s): zakończony — koniec − start − pauzy; w toku — do `now`. */
export const workoutDurSec = (w: Workout, now = Date.now()) => Math.max(0, ((w.finishedAt ?? now) - w.startedAt - pausedTotal(w, w.finishedAt ?? now)) / 1000);
/** Audyt 0.13 (0.14.0): sesja bez godziny i czasu trwania (import formatu bez godzin) — koniec równy startowi. Aplikacja sama takich sesji nie tworzy
 * (pole „min” w edytorze ma najmniej 1), więc to jednoznaczny znak „godzina i czas nieznane” bez zmiany schematu. */
export const noClock = (w: Workout) => w.finishedAt != null && w.finishedAt === w.startedAt;
/** Data i godzina sesji do list; bez godziny (noClock) — sama data, resztę dopisuje ekran („godzina nieznana”). */
export const whenText = (w: Workout) => noClock(w) ? fmtDate(wallTs(w)) : `${fmtDate(wallTs(w))} ${fmtTime(wallTs(w))}`;
/** Pauzy uporządkowane: liczby skończone, od < do, w granicach [start, koniec], scalone, gdy nachodzą (sanityzacja, edycja, koniec treningu). */
export function cleanPauses(raw: unknown, start: number, end: number | null): [number, number][] {
  const hi = end ?? Infinity; const out: [number, number][] = [];
  const list = (Array.isArray(raw) ? raw : []).map(p => Array.isArray(p) ? [Number(p[0]), Number(p[1])] : [NaN, NaN]).filter(
      ([f, t]) => Number.isFinite(f) && Number.isFinite(t))
    /* zaokrąglenie przed odrzuceniem pustych — inaczej [1; 1,005] → [1; 1] przy drugiej migracji znikał (migrate-idem, ziarno 994171374) */
    .map(([f, t]) => [Math.round(Math.max(start, f)), Math.round(Math.min(hi, t))] as [number, number]).filter(([f, t]) => t > f).sort((x, y) => x[0] - y[0]);
  for (const p of list) { const last = out[out.length - 1]; if (last && p[0] <= last[1]) last[1] = Math.max(last[1], p[1]); else out.push([p[0], p[1]]); }
  return out;
}
export const setPauses = (w: Workout, p: [number, number][]) => { if (p.length) w.pauses = p; else delete w.pauses; };
export function closePause(w: Workout, end: number) {
  const p = [...(w.pauses ?? [])]; if (w.pausedAt != null) { if (end > w.pausedAt) p.push([w.pausedAt, end]); delete w.pausedAt; }
  setPauses(w, cleanPauses(p, w.startedAt, w.finishedAt));
}
/** Pauza treningu w toku (zegar treningu stoi; przerwa i stoper serii działają dalej). */
export function pauseWorkout(now = Date.now()) {
  const w = S?.active;
  if (!w || w.pausedAt != null) return;
  w.pausedAt = Math.max(w.startedAt, Math.min(now, Date.now()));
  save(w);
}
/** Wznowienie: pauza [od, teraz] dopisana do listy. `at` — chwila wznowienia (odhaczenie serii w trakcie pauzy wznawia od godziny serii). */
export function resumeWorkout(at = Date.now(), w: Workout | null | undefined = S?.active) {
  if (!w || w.pausedAt == null) return;
  closePause(w, Math.max(w.pausedAt, Math.min(at, Date.now())));
  save(w);
}
