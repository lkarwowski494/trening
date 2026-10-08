import { exById, focusSet, isBW, fmtSec } from './store';
import { t, exName } from './i18n';
import { wu, wOut, fmtNum } from './units';
import { hasWeight, hasReps, hasTime, hasDistance, SET_KIND_MARK, type Exercise, type SetKind, type WExercise, type WSet, type Workout } from './seed';

/*
 * Trening na żywo — teksty wyliczane z danych treningu w toku, wspólne dla ekranu (components/ActiveWorkout.tsx), timera (lib/timer.ts:
 * Live Activity i powiadomienie po restarcie) i testów. Audyt 0.10 (08.10.2026): LIVE-04 / LIVE-15 (podpis przerwy), UI-10 / LIVE-14 (karta).
 */

/**
 * Etykieta serii z listy typów — jedna numeracja w treningu, szablonie i szczegółach sesji: „W” dla rozgrzewki, numer serii roboczej z literą typu
 * („2F”), drop set — numer serii, po której jest („3D”; audyt 0.10, LIVE-14: drop set to część serii — runda 72 T6 — a nie kolejna seria; wcześniej
 * „4D”). Poza listą — numer pozycji.
 */
export function setMarkOf(kinds: readonly (SetKind | undefined)[], i: number): string {
  if (i < 0 || i >= kinds.length) return String(i + 1); const k = kinds[i] ?? 'normal'; if (k === 'warmup') return 'W';
  const n = kinds.slice(0, i + 1).filter(x => x !== 'warmup' && x !== 'drop').length; return `${Math.max(1, n)}${SET_KIND_MARK[k]}`;
}
/** Etykieta serii jak na ekranie — ta sama w dostępności, menu, podpisie przerwy i Live Activity (setMarkOf). */
export function setLabel(e: WExercise, si: number): string { return setMarkOf(e.sets.map(s => s.kind), si); }

/**
 * Podpis przerwy po serii (ei, si): następna seria do zrobienia według tej samej reguły co karta „teraz” — store.focusSet w stanie PO odhaczeniu
 * tej serii, z pominięciem bloków „Pomiń dziś” i usuniętych ćwiczeń (audyt 0.10, LIVE-04: wcześniej osobna reguła wskazywała inną serię niż karta).
 * Ta sama seria / ten sam superset — „nazwa · seria n”, inne ćwiczenie — „dalej: nazwa”. Nic nie zostało (decyzja B: przerwa po ostatniej serii
 * zostaje) — „nic więcej do zrobienia” i `last` (powiadomienie bez „Następna seria.”, lib/timer.ts). Wspólny dla odhaczenia, ponownego pomiaru,
 * zamiany, „Pomiń dziś” i odtworzenia przerwy po restarcie (LIVE-15).
 */
export function restLabel(a: Workout, ei: number, si: number): { sub: string; last: boolean } {
  const e = a.exercises[ei]; const s = e?.sets[si]; if (!e || !s) return { sub: '', last: false };
  const pos = focusSet(a, s.id); if (!pos) return { sub: t('nic więcej do zrobienia'), last: true };
  const x = a.exercises[pos.ei]; const nm = exName(exById(x.exerciseId)); const same = pos.ei === ei || (!!e.groupId && x.groupId === e.groupId);
  return { sub: same ? `${nm} · ${t('seria {n}', { n: setLabel(x, pos.si) })}` : t('dalej: {name}', { name: nm }), last: false };
}

/**
 * Duża liczba na karcie „teraz” (audyt 0.10, UI-10 / LIVE-14, wariant A): jednostka zaraz po ciężarze — „80 kg × 8”, „20 kg × 45s”,
 * masa ciała „+10 kg × 8” / „masa ciała × 8”, dystans „5000 m · 25:00”; puste pole — „—”. `num` + `unit` (mniejszym krojem) + `tail`;
 * ta sama treść w etykiecie VoiceOver. Liczby w jednostce aplikacji (kg/lb), jak w polach serii.
 */
export function nowParts(ex: Exercise, set: WSet): { num: string; unit: string; tail: string } {
  const m = ex.metric ?? 'weight_reps'; const empty = (v: unknown) => v === '' || v == null; const dig = wu() === 'lb' ? 1 : 2;
  const reps = empty(set.reps) ? '—' : String(set.reps); const time = empty(set.durationSec) ? '—' : fmtSec(Number(set.durationSec));
  let num: string, unit = ''; const rest: string[] = []; let sep = ' × ';
  if (hasWeight(m)) {
    if (isBW(ex)) { const a = Number(set.addKg); if (empty(set.addKg) || !a) num = t('masa ciała'); else { num = (a > 0 ? '+' : '') + fmtNum(wOut(a), dig); unit = wu(); } }
    else if (empty(set.weight)) num = '—'; else { num = fmtNum(wOut(Number(set.weight)), dig); unit = wu(); }
    if (hasReps(m)) rest.push(reps); if (hasTime(m)) rest.push(time);
  } else if (hasDistance(m)) { if (empty(set.distanceM)) num = '—'; else { num = String(set.distanceM); unit = 'm'; } sep = ' · '; if (hasTime(m)) rest.push(time); }
  else if (hasReps(m)) { num = reps; if (hasTime(m)) rest.push(time); }
  else num = hasTime(m) ? time : '—';
  return { num, unit, tail: rest.map(x => sep + x).join('') };
}

/**
 * Licznik na karcie „teraz” (audyt 0.10, LIVE-14): „seria k z n” bez drop setów — n = serie robocze (bez rozgrzewek i drop setów), k jak w etykiecie
 * wiersza (setLabel); drop set — „seria k z n · drop set” (drop serii k).
 */
export function focusCounter(e: WExercise, si: number): { kind: 'warmup' | 'normal' | 'drop'; n: string; all: number } {
  const all = e.sets.filter(x => x.kind !== 'warmup' && x.kind !== 'drop').length; const s = e.sets[si];
  if (!s || s.kind === 'warmup') return { kind: 'warmup', n: 'W', all };
  return s.kind === 'drop' ? { kind: 'drop', n: setLabel(e, si).replace(/D$/, ''), all } : { kind: 'normal', n: setLabel(e, si), all };
}
