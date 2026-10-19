/*
 * Wspólny świat testów zegarka (0.20): trening w toku o ustalonym składzie — ławka 3 × 80 kg × 8 (przerwa 90 s), podciąganie z dociążeniem
 * 2 × +10 kg × 8 (przerwa 60 s), deska 2 serie na czas (45 s). Opcja `ss`: ławka i podciąganie w supersecie (przerwa rundy 75 s). Zegar systemowy zamrożony na NOW.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { blankTimer, type Workout } from '@/lib/seed';
import { applyLang, type Lang } from '@/lib/i18n';
import { applyUnit } from '@/lib/units';
import { fresh, ex } from './helpers';

export const NOW = Date.UTC(2026, 9, 13, 10, 0, 0); // UTC: pliki wzorcowe (watch-fixtures) nie zależą od strefy czasowej maszyny
export interface WorldOpts { ss?: boolean; lang?: Lang; unit?: 'kg' | 'lb' }

export async function world(o: WorldOpts = {}): Promise<Workout> {
  jest.useFakeTimers({ now: NOW });
  await fresh(); store.setTimerState(blankTimer()); await timer.stop(); await timer.stopSet(); await timer.restore();
  timer.labels.title = ''; timer.labels.subtitle = ''; timer.labels.last = false; global.__la.length = 0;
  store.startEmpty();
  store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Pull Up')); store.addExerciseToActive(ex('Plank'));
  store.addSet(0); store.addSet(0); store.addSet(1); store.addSet(2);
  const a = store.getState().active!; a.templateName = 'Push';
  a.exercises[0].restSec = 90; a.exercises[1].restSec = 60;
  a.exercises[0].sets.forEach(s => { s.weight = 80; s.reps = 8; });
  a.exercises[1].sets.forEach(s => { s.addKg = 10; s.reps = 8; });
  a.exercises[2].sets.forEach(s => { s.durationSec = 45; });
  if (o.ss) { a.exercises[0].restSec = 75; a.exercises[1].restSec = 75; store.linkWithNext(a.exercises, 0, a); }
  store.save(a);
  if (o.unit) applyUnit(o.unit);
  if (o.lang) applyLang(o.lang);
  return store.getState().active!;
}
export const teardownWorld = () => { applyLang('pl'); applyUnit('kg'); jest.useRealTimers(); };
export const A = () => store.getState().active!;
/** id serii: blok `b`, seria `s`. */
export const sid = (b: number, s: number) => A().exercises[b].sets[s].id;
