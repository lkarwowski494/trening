import { WATCH } from './protocol';
import type { Workout } from '../seed';

/*
 * Zapis treningu do Apple Zdrowia, gdy trening prowadził też zegarek (decyzja właściciela 13.10.2026): zapis z zegarka, jeśli prowadził sesję treningu
 * (tętno, kcal — bogatsze źródło, ma pierwszeństwo), inaczej z telefonu; bez duplikatów. Negocjacja w protokole (docs/35 rozdz. 6):
 *  - telefon prosi o sesję (`session start`, `save` = zapis do Zdrowia włączony), zegarek odpowiada `sessionStarted`;
 *  - po „Zakończ” telefon wysyła `session end`; zegarek kończy sesję i odpowiada `sessionEnded{saved}` — zapisał trening w Zdrowiu albo nie;
 *  - telefon zapisuje sam tylko wtedy, gdy zegarek sesji nie prowadził, nie zapisał albo nie odpowiedział w `WATCH.HEALTH_WAIT_SEC` (wtedy dubel wyklucza
 *    istniejąca reguła lib/health.ts: trening z zegarka nakładający się na sesję → znacznik 'watch', własna kopia usuwana po synchronizacji — lib/healthRead).
 * Czysta decyzja `watchHealthPlan` — testy Jest; wykonanie: lib/health.ts (syncAfterFinish, retryHealth) i lib/watch/link.ts.
 */
export type HealthWriter = 'watch' | 'phone' | 'wait';
export interface HealthPlan { writer: HealthWriter; reason: 'no-session' | 'saved-by-watch' | 'not-saved' | 'waiting' | 'timeout' }

/** Kto zapisuje zakończony trening `w` w chwili `nowMs`. */
export function watchHealthPlan(w: Pick<Workout, 'watch' | 'finishedAt'>, nowMs: number): HealthPlan {
  const s = w.watch;
  if (!s) return { writer: 'phone', reason: 'no-session' };
  if (s.endedAt != null) return s.saved === true ? { writer: 'watch', reason: 'saved-by-watch' } : { writer: 'phone', reason: 'not-saved' };
  /* sesja zegarka trwa (albo zegarek nie odpowiedział): czekamy na raport, potem zapisuje telefon */
  const since = w.finishedAt ?? nowMs;
  return nowMs - since < WATCH.HEALTH_WAIT_SEC * 1000 ? { writer: 'wait', reason: 'waiting' } : { writer: 'phone', reason: 'timeout' };
}
