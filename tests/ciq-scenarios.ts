/* Wspólne scenariusze dla zegarka z Connect IQ (0.20): migawki do pliku „złotego” i skrypty kroków (naciśnięcia, upływ czasu).
 * Używają ich tests/ciq-wire.test.ts, tests/ciq-model.test.ts i tests/ciq-gen.test.ts (generuje garmin/source/tests/Fixtures.mc).
 * Teksty są przykładowe (prawdziwe powstają w telefonie z nowParts/focusCounter); dłuższe i obcojęzyczne służą do sprawdzenia przycinania i zawijania. */
import type { CiqSnapshot, CiqSetView } from '@/lib/watch/ciqWire';

export const T0 = 1_800_000_000;

const bench = (n: number, load = '80 kg × 8'): CiqSetView => ({ setId: `s${n}`, blockId: 'b1', title: 'Wyciskanie sztangi leżąc', counter: `seria ${n} z 4`, load });
const nextOf = (n: number, restSec = 120): { set: CiqSetView; restSec: number; cue: string } =>
  ({ set: bench(n + 1), restSec, cue: 'Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)' });

export const SNAPSHOTS: Record<string, { snap: CiqSnapshot; labels?: boolean }> = {
  idle: { snap: { rev: 1, mode: 'idle' } },
  end: { snap: { rev: 9, mode: 'end' } },
  set_weight: { snap: { rev: 5, mode: 'set', now: bench(2), next: nextOf(2) } },
  set_last: { snap: { rev: 8, mode: 'set', now: { ...bench(4), counter: 'seria 4 z 4' } } },
  set_bodyweight: { snap: { rev: 6, mode: 'set', now: { setId: 'p1', blockId: 'b2', title: 'Podciąganie nachwytem', counter: 'seria 1 z 3', load: '+10 kg × 6' } } },
  set_timed: { snap: { rev: 6, mode: 'set', now: { setId: 't1', blockId: 'b3', title: 'Plank', counter: 'seria 1 z 3', load: '45 s', timed: true } } },
  set_superset: { snap: { rev: 7, mode: 'set', now: { setId: 'a1', blockId: 'b4', title: 'Uginanie ramion ze sztangą', counter: 'seria 1 z 3', load: '30 kg × 10', group: 'A1' }, next: { set: { setId: 'a2', blockId: 'b4', title: 'Prostowanie ramion na wyciągu', counter: 'seria 1 z 3', load: '25 kg × 12', group: 'A2' }, restSec: 0, cue: '' } } },
  set_band: { snap: { rev: 7, mode: 'set', now: { setId: 'g1', blockId: 'b5', title: 'Wiosłowanie z gumą', counter: 'seria 2 z 3', load: 'guma czerwona × 15' } } },
  set_pounds: { snap: { rev: 7, mode: 'set', now: { setId: 'l1', blockId: 'b6', title: 'Bench press', counter: 'set 1 of 4', load: '175 lb × 8' } } },
  set_long_de: { snap: { rev: 12, mode: 'set', now: { setId: 'd1', blockId: 'b7', title: 'Rumänisches Kreuzheben mit der Langhantel und angehobenen Fersen auf einer Scheibe im Stehen und mit sehr langem Namen', counter: 'Satz 2 von 5', load: '112,5 kg × 10' } } },
  rest_with_next: { snap: { rev: 5, mode: 'rest', now: bench(3), restLeftSec: 90, cue: 'Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)', next: nextOf(3) }, labels: true },
  rest_last: { snap: { rev: 5, mode: 'rest', now: { ...bench(4), counter: 'seria 4 z 4' }, restLeftSec: 45, cue: 'Następne: Wyciskanie sztangi leżąc, seria 4 z 4, 80 kg × 8' } },
};

export type Step =
  | { op: 'snap'; name: string; at: number; version?: number }
  | { op: 'hello'; at: number }
  | { op: 'press'; kind: 'done' | 'doneDiff' | 'skip'; at: number }
  | { op: 'undo'; at: number }
  | { op: 'tick'; at: number };

/** Skrypty kroków; wynik każdego kroku (zdarzenie, widok) zapisuje model TypeScript jako plik „złoty” dla Monkey C. */
export const SCRIPTS: Record<string, Step[]> = {
  online_basic: [
    { op: 'hello', at: T0 - 5 },
    { op: 'snap', name: 'set_weight', at: T0 - 4 },
    { op: 'press', kind: 'done', at: T0 },
    { op: 'undo', at: T0 + 3 },
    { op: 'press', kind: 'done', at: T0 + 10 },
    { op: 'tick', at: T0 + 10 + 119 },
    { op: 'tick', at: T0 + 10 + 120 },
    { op: 'tick', at: T0 + 10 + 121 },
  ],
  undo_window: [
    { op: 'snap', name: 'set_weight', at: T0 },
    { op: 'press', kind: 'done', at: T0 },
    { op: 'undo', at: T0 + 5 },
    { op: 'undo', at: T0 + 4 },
  ],
  offline_blind: [
    { op: 'snap', name: 'set_weight', at: T0 },
    { op: 'press', kind: 'done', at: T0 + 1 },
    { op: 'press', kind: 'done', at: T0 + 20 },
    { op: 'press', kind: 'done', at: T0 + 40 },
    { op: 'undo', at: T0 + 41 },
    { op: 'snap', name: 'rest_with_next', at: T0 + 50 },
    { op: 'press', kind: 'done', at: T0 + 55 },
  ],
  different_and_skip: [
    { op: 'snap', name: 'set_superset', at: T0 },
    { op: 'press', kind: 'doneDiff', at: T0 + 1 },
    { op: 'snap', name: 'set_band', at: T0 + 2 },
    { op: 'press', kind: 'skip', at: T0 + 3 },
  ],
  rest_from_phone: [
    { op: 'snap', name: 'rest_with_next', at: T0 },
    { op: 'tick', at: T0 + 30 },
    { op: 'press', kind: 'done', at: T0 + 31 },
    { op: 'tick', at: T0 + 90 },
    { op: 'tick', at: T0 + 200 },
  ],
  no_next_known: [
    { op: 'snap', name: 'set_last', at: T0 },
    { op: 'press', kind: 'done', at: T0 + 1 },
    { op: 'snap', name: 'end', at: T0 + 2 },
    { op: 'press', kind: 'done', at: T0 + 3 },
  ],
  idle_and_end: [
    { op: 'snap', name: 'idle', at: T0 },
    { op: 'press', kind: 'done', at: T0 + 1 },
    { op: 'press', kind: 'skip', at: T0 + 2 },
    { op: 'snap', name: 'end', at: T0 + 3 },
    { op: 'press', kind: 'doneDiff', at: T0 + 4 },
    { op: 'tick', at: T0 + 5 },
  ],
  newer_version: [
    { op: 'snap', name: 'set_weight', at: T0 },
    { op: 'snap', name: 'set_weight', at: T0 + 1, version: 2 },
    { op: 'press', kind: 'done', at: T0 + 2 },
    { op: 'snap', name: 'set_weight', at: T0 + 3 },
    { op: 'press', kind: 'done', at: T0 + 4 },
  ],
};
