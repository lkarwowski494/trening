import { exById, focusSet, restAfter, isPaused, groupLabels } from '../store';
import { t, lang, exName } from '../i18n';
import { counterLabel, nowParts, restCue } from '../live';
import { hasTime, type Workout } from '../seed';
import { WATCH, WATCH_PROTOCOL, type WatchAfter, type WatchNow, type WatchRest, type WatchSnapshot } from './protocol';

/*
 * Migawka dla zegarka (telefon → zegarek): czysta funkcja stanu treningu. Wszystkie teksty gotowe, w języku aplikacji, z tych samych funkcji co ekran
 * telefonu (lib/live.ts: counterLabel, nowParts, restCue) — zegarek niczego nie składa ani nie liczy. Zawiera bieżącą serię (`now`), trwającą przerwę
 * (`rest`, z zapowiedzią = tekst głosu) i `after`: co zobaczy zegarek po „Seria zrobiona” na bieżącej serii, policzone z góry na kopii treningu —
 * dzięki temu zegarek przechodzi do przerwy od razu, także gdy telefon nie odpowiada (docs/35 rozdz. 2, reguła 4).
 */

/** Przerwa z timera telefonu (lib/timer.ts `T`), podawana wprost — migawka nie zna timera. */
export interface SnapshotRest { on: boolean; setId: string | null; endAt: number; total: number }
export interface SnapshotCtx { rev: number; nowMs: number; rest: SnapshotRest | null }

const clip = (s: string, n: number) => { const a = Array.from(s); return a.length <= n ? s : a.slice(0, n - 1).join('') + '…'; };

/** Seria `pos` jako widok „teraz”; null, gdy ćwiczenia nie ma w bibliotece. */
export function watchNow(w: Workout, pos: { ei: number; si: number }): WatchNow | null {
  const e = w.exercises[pos.ei]; const set = e?.sets[pos.si]; const ex = e && exById(e.exerciseId); if (!e || !set || !ex) return null;
  const big = nowParts(ex, set); const g = e.groupId ? groupLabels(w.exercises)[e.groupId] : null; const m = ex.metric ?? 'weight_reps';
  return {
    setId: set.id, blockId: e.id, title: clip(exName(ex), WATCH.TITLE_MAX), counter: clip(counterLabel(e, pos.si), WATCH.COUNTER_MAX),
    load: clip(`${big.num}${big.unit ? ' ' + big.unit : ''}${big.tail}`, WATCH.LOAD_MAX), group: g ? `SS ${g}` : null,
    timed: hasTime(m), targetSec: hasTime(m) && Number(set.durationSec) > 0 ? Math.round(Number(set.durationSec)) : null,
  };
}

/** Co będzie po odhaczeniu bieżącej serii: przerwa (z restAfter na kopii z odhaczoną serią), zapowiedź i następna seria. */
function afterOf(w: Workout, pos: { ei: number; si: number }): WatchAfter {
  const c: Workout = JSON.parse(JSON.stringify(w)); const s = c.exercises[pos.ei].sets[pos.si]; s.done = true;
  const rest = restAfter(pos.ei, pos.si, c); const cue = restCue(w, w.exercises[pos.ei].sets[pos.si].id); const np = focusSet(c);
  const sec = rest != null && rest > 0 ? Math.round(rest) : null;
  return { restSec: sec, cue: sec == null ? '' : clip(cue.text, WATCH.CUE_MAX), last: sec == null ? false : cue.last, now: np ? watchNow(c, np) : null };
}

/** Migawka stanu. `w` null = brak treningu w toku (zegarek: „Zacznij trening na telefonie”). */
export function buildSnapshot(w: Workout | null, ctx: SnapshotCtx): WatchSnapshot {
  const head = { v: WATCH_PROTOCOL, kind: 'snapshot' as const, rev: ctx.rev, lang: lang() };
  if (!w) return { ...head, phase: 'idle', paused: false, workoutId: null, title: '', now: null, rest: null, after: null, doneCount: 0, totalCount: 0, toFillCount: 0 };
  const pos = focusSet(w); const now = pos ? watchNow(w, pos) : null;
  let rest: WatchRest | null = null; const r = ctx.rest;
  if (r && r.on && r.setId && r.endAt > ctx.nowMs && w.exercises.some(e => e.sets.some(s => s.id === r.setId))) {
    const c = restCue(w, r.setId);
    rest = { setId: r.setId, startedAt: Math.round(r.endAt - r.total * 1000), endsAt: Math.round(r.endAt), totalSec: Math.round(r.total), cue: clip(c.text, WATCH.CUE_MAX), last: c.last };
  }
  let total = 0, done = 0, fill = 0;
  for (const e of w.exercises) { if (!exById(e.exerciseId)) continue; for (const s of e.sets) { if (s.done) { done++; total++; if (s.toFill) fill++; } else if (!e.skipped) total++; } }
  return {
    ...head, phase: rest ? 'rest' : now ? 'set' : 'done', paused: isPaused(w), workoutId: w.id, title: clip(w.templateName || t('Trening'), WATCH.TITLE_MAX),
    now, rest, after: pos && now ? afterOf(w, pos) : null, doneCount: done, totalCount: total, toFillCount: fill,
  };
}

/** Treść migawki bez numeru wersji — do wykrywania zmian (zegar „teraz” nie należy do treści; odliczanie liczy zegarek ze znacznika końca). */
export const snapshotKey = (s: WatchSnapshot): string => JSON.stringify({ ...s, rev: 0 });
