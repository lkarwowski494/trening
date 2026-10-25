/*
 * Model stanu zegarka (lib/watch/client.ts) na migawkach z prawdziwego telefonu: zachowanie, które mają mieć Apple Watch (SwiftUI) i zegarek z Connect IQ (Monkey C) — docs/35.
 * Te same scenariusze są zapisywane jako pliki wzorcowe (tests/watch-fixtures.test.ts) dla testów Swift i Monkey C.
 */
import { clientStep, clientView, initialClient, CLIENT_SCREENS, CLIENT_ACTIONS } from '@/lib/watch/client';
import { WATCH } from '@/lib/watch/protocol';
import { snapshots, scenarios, runScenario, type Snaps, type Scenario, type Played } from './watch-scenarios';
import { teardownWorld } from './watch-world';

afterEach(teardownWorld);
let S: Snaps; let SC: Record<string, Scenario>;
beforeAll(async () => { S = await snapshots(); SC = Object.fromEntries(scenarios(S).map(s => [s.name, s])); teardownWorld(); });
const play = (n: string): Played[] => runScenario(SC[n]);
const evs = (p: Played[]) => p.flatMap(x => x.out).filter(o => o.kind === 'event').map(o => (o.kind === 'event' ? `${o.type}:${'setId' in o ? o.setId : 'blockId' in o ? o.blockId : ''}` : ''));

describe('scenariusze', () => {
  test('wszystkie scenariusze: widoki z dozwolonych ekranów i akcji; wyjście tylko komunikaty zegarka', () => {
    for (const sc of Object.values(SC)) for (const p of runScenario(sc)) {
      expect(CLIENT_SCREENS).toContain(p.view.screen); for (const a of p.view.actions) expect(CLIENT_ACTIONS).toContain(a);
      for (const o of p.out) expect(['hello', 'event']).toContain(o.kind);
      if (p.view.screen === 'connect' || p.view.screen === 'update') expect(p.view.actions).toEqual([]);
    }
  });
  test('basic-apple: hello, bieżąca seria, „zrobione” → natychmiast przerwa z zapowiedzią (bez czekania na telefon), ack po migawce zdejmuje „czekam”', () => {
    const p = play('basic-apple');
    expect(p[0].out).toEqual([{ v: 1, kind: 'hello', client: 'apple', protocol: 1, app: '0.20.0', caps: { session: true } }]);
    expect(p[2].view).toMatchObject({ screen: 'set', title: 'Bench Press (sztanga)', counter: 'seria 1 z 3', load: '80 kg × 8', cue: null, actions: ['done', 'differ', 'skip'], busy: false });
    expect(p[3].out).toEqual([{ v: 1, kind: 'event', eventId: 'apple-1', workoutId: 'workout-1', baseRev: 1, at: p[3].at, client: 'apple', type: 'done', setId: 'set-0-0' }]);
    expect(p[3].view).toMatchObject({ screen: 'rest', counter: 'seria 2 z 3', cue: 'Bench Press (sztanga) · seria 2, 80 kg, 8 powtórzeń', restTotalSec: 90, restEndsAt: p[3].at + 90e3, undoUntil: p[3].at + WATCH.UNDO_SEC * 1000, busy: true, doneCount: 1 });
    expect(p[3].view.actions).toEqual(['done', 'differ', 'skip', 'undo']);
    expect(p[4].view).toMatchObject({ screen: 'rest', busy: true }); /* migawka przyszła, ack jeszcze nie */
    expect(p[5].view).toMatchObject({ screen: 'rest', busy: false, restEndsAt: S.rest1.rest!.endsAt }); /* po migawce odliczanie z telefonu */
  });
  test('basic-garmin: ten sam przebieg, zdarzenia z przedrostkiem garmin; hello bez zdolności sesji', () => {
    const p = play('basic-garmin'); expect(p[0].out[0]).toMatchObject({ client: 'garmin', caps: { session: false } }); expect(p[3].out[0]).toMatchObject({ eventId: 'garmin-1', client: 'garmin', type: 'done' });
    expect(p.map(x => x.view.screen)).toEqual(play('basic-apple').map(x => x.view.screen));
  });
  test('ack-before-snapshot: potwierdzenie przed migawką nie zdejmuje widoku lokalnego (bez migotania)', () => {
    const p = play('ack-before-snapshot'); expect(p[2].view.screen).toBe('rest'); expect(p[3].view).toMatchObject({ screen: 'rest', busy: true, counter: 'seria 2 z 3' }); expect(p[4].view).toMatchObject({ screen: 'rest', busy: false });
  });
  test('undo-window: „Cofnij” w oknie → zdarzenie undo i powrót do serii; po oknie — brak akcji i brak zdarzenia', () => {
    const p = play('undo-window'); expect(evs(p)).toEqual(['done:set-0-0', 'undo:set-0-0', 'done:set-0-0']);
    const u = p[6]; expect(u.out[0]).toMatchObject({ type: 'undo', setId: 'set-0-0', eventId: 'apple-2' }); expect(u.view).toMatchObject({ screen: 'set', counter: 'seria 1 z 3', undoUntil: null, busy: true });
    expect(p[9].view).toMatchObject({ screen: 'rest', undoUntil: p[9].at + WATCH.UNDO_SEC * 1000 });
    expect(p[12].view.undoUntil).toBeNull(); expect(p[12].view.actions).not.toContain('undo'); expect(p[13].out).toEqual([]);
  });
  test('differ: zdarzenie differ, ten sam skutek lokalny co done; migawka z telefonu niesie toFillCount', () => {
    const p = play('differ'); expect(evs(p)).toEqual(['differ:set-0-0']); expect(p[2].view).toMatchObject({ screen: 'rest', counter: 'seria 2 z 3' }); expect(p[3].view.toFillCount).toBe(1);
  });
  test('skip-confirm: pytanie → Anuluj nic nie wysyła → Pomiń wysyła skip bloku; potwierdzenie bez pytania nic nie robi', () => {
    const p = play('skip-confirm'); expect(p[2].view.confirmSkip).toBe(true); expect(p[3].view.confirmSkip).toBe(false); expect(p[4].out).toEqual([]);
    expect(evs(p)).toEqual(['skip:block-0']); expect(p[6].view).toMatchObject({ screen: 'set', busy: true, actions: [], confirmSkip: false }); expect(p[7].view).toMatchObject({ title: 'Pull Up', actions: ['done', 'differ', 'skip'] });
  });
  test('main-in-rest: przycisk główny w przerwie odhacza NASTĘPNĄ serię (set-0-1)', () => {
    const p = play('main-in-rest'); expect(evs(p)).toEqual(['done:set-0-1']); expect(p[2].view).toMatchObject({ screen: 'rest', counter: 'seria 3 z 3', doneCount: 2 });
  });
  test('rest-ended: dokładnie jedno zdarzenie w chwili końca przerwy; potem ekran serii', () => {
    const p = play('rest-ended'); expect(p[2].out).toEqual([]); expect(p[3].out).toMatchObject([{ type: 'restEnded', setId: 'set-0-0' }]); expect(p[3].view.screen).toBe('set'); expect(p[4].out).toEqual([]);
    expect(p[3].view.busy).toBe(false); /* restEnded nie czeka na migawkę */
  });
  test('offline-two-done: dwa „zrobione” bez telefonu, trzecie ignorowane; „Połącz z telefonem” bez akcji; po powrocie zdarzenia i zgodność z migawką', () => {
    const p = play('offline-two-done'); expect(evs(p)).toEqual(['done:set-0-0', 'done:set-0-1']);
    expect(p[3].view).toMatchObject({ screen: 'rest', offline: true, cue: 'Bench Press (sztanga) · seria 2, 80 kg, 8 powtórzeń' });
    expect(p[4].view).toMatchObject({ screen: 'connect', actions: [], offline: true }); expect(p[5].out).toEqual([]); expect(p[5].view.screen).toBe('connect');
    expect(p[6].out).toMatchObject([{ kind: 'hello' }]); expect(p[6].view).toMatchObject({ offline: false, busy: true });
    expect(p[7].view).toMatchObject({ screen: 'rest', counter: 'seria 3 z 3' }); expect(p[9].view).toMatchObject({ busy: false, doneCount: 2 });
  });
  test('stale-snapshot: spóźniona starsza migawka i ack nieznanego zdarzenia nic nie zmieniają', () => {
    const p = play('stale-snapshot'); expect(p[2].view).toEqual(p[1].view); expect(p[3].view).toEqual(p[1].view);
  });
  test('finished-and-update: „Trening zakończony” po pustej migawce; update przy welcome(upgrade=watch); connect przy upgrade=phone', () => {
    const p = play('finished-and-update'); expect(p[2].view.screen).toBe('finished'); expect(p[3].view.screen).toBe('set'); expect(p[4].view.screen).toBe('update'); expect(p[5].view.screen).toBe('connect');
  });
  test('last-set-and-done: przerwa po ostatniej serii bez zapowiedzi i bez akcji (komunikat „zakończ na telefonie” to stała etykieta — tests/watch-last-rest.test.ts), potem done; przycisk nic nie robi', () => {
    const p = play('last-set-and-done'); expect(p[1].view).toMatchObject({ screen: 'rest', cue: null, actions: [] }); expect(p[2].view.screen).toBe('done'); expect(p[3].out).toEqual([]);
  });
  test('paused: znacznik pauzy w widoku', () => { expect(play('paused')[1].view.paused).toBe(true); });
});

describe('model: przypadki brzegowe', () => {
  const cfg = { client: 'apple' as const, app: '0.20.0', session: true };
  const feed = (steps: Parameters<typeof clientStep>[1][]) => { let st = initialClient(cfg); const outs: unknown[] = []; for (const s of steps) { const r = clientStep(st, s); st = r.state; outs.push(...r.out); } return { st, outs }; };
  test('bez migawki: idle (połączony) albo connect (bez połączenia); przyciski nic nie robią', () => {
    expect(clientView(initialClient(cfg), 0)).toMatchObject({ screen: 'idle', actions: [] });
    const { st, outs } = feed([{ at: 1, input: { t: 'connection', reachable: false } }, { at: 2, input: { t: 'press', button: 'main' } }, { at: 3, input: { t: 'press', button: 'undo' } }, { at: 4, input: { t: 'press', button: 'skip' } }]);
    expect(clientView(st, 5)).toMatchObject({ screen: 'connect', offline: true }); expect(outs).toEqual([]);
  });
  test('powrót zasięgu wysyła hello; zerwanie nie', () => {
    const { outs } = feed([{ at: 1, input: { t: 'connection', reachable: false } }, { at: 2, input: { t: 'connection', reachable: true } }]); expect(outs).toMatchObject([{ kind: 'hello' }]);
  });
  test('numer zdarzenia rośnie, baseRev = numer ostatniej migawki, workoutId z migawki', () => {
    const { outs } = feed([{ at: 1, input: { t: 'receive', msg: S.set1 } }, { at: 2, input: { t: 'press', button: 'main' } }, { at: 3, input: { t: 'press', button: 'differ' } }]);
    expect(outs).toMatchObject([{ eventId: 'apple-1', baseRev: 1, workoutId: 'workout-1', type: 'done', setId: 'set-0-0' }, { eventId: 'apple-2', type: 'differ', setId: 'set-0-1' }]);
  });
  test('seria na czas: widok niesie timed i cel', () => {
    const t = { ...S.set1, now: { ...S.set1.now!, timed: true, targetSec: 45, load: '45 s' } }; const { st } = feed([{ at: 1, input: { t: 'receive', msg: t } }]); expect(clientView(st, 2)).toMatchObject({ timed: true, targetSec: 45, load: '45 s' });
  });
  test('M3 p6 / ZM-05: widok niesie `measuring` z migawki (domyślnie false); projekcja lokalna go nie zmienia', () => {
    const t = { ...S.set1, now: { ...S.set1.now!, timed: true, targetSec: 45, load: '45 s', measuring: true } };
    expect(clientView(feed([{ at: 1, input: { t: 'receive', msg: t } }]).st, 2)).toMatchObject({ timed: true, measuring: true });
    expect(clientView(feed([{ at: 1, input: { t: 'receive', msg: S.set1 } }]).st, 2)).toMatchObject({ measuring: false });
    const st = feed([{ at: 1, input: { t: 'receive', msg: t } }, { at: 2, input: { t: 'connection', reachable: false } }]).st;
    expect(clientView(st, 3)).toMatchObject({ measuring: true, offline: true });
  });
  test('historia migawek ograniczona (WATCH.CLIENT_HISTORY)', () => {
    let st = initialClient(cfg); for (let i = 1; i <= 10; i++) st = clientStep(st, { at: i, input: { t: 'receive', msg: { ...S.set1, rev: i } } }).state; expect(st.history).toHaveLength(WATCH.CLIENT_HISTORY);
  });
  test('ack ze statusem odrzucenia usuwa lokalny skutek (po migawce telefonu)', () => {
    let st = initialClient(cfg); const step = (at: number, input: Parameters<typeof clientStep>[1]['input']) => { const r = clientStep(st, { at, input }); st = r.state; return r; };
    step(1, { t: 'receive', msg: S.set1 }); step(2, { t: 'press', button: 'main' }); expect(clientView(st, 3).screen).toBe('rest');
    step(4, { t: 'receive', msg: { v: 1, kind: 'ack', eventId: 'apple-1', status: 'rejected', reason: 'set-gone', rev: 1 } }); expect(clientView(st, 5)).toMatchObject({ screen: 'set', busy: false });
  });
});
