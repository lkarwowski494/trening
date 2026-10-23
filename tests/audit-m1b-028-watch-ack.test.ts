/*
 * M1-audytor-generalny-028 (audyt 21.10.2026; 05-architekt-001): telefon potwierdzał (`ack`) zdarzenie z zegarka, zanim zmiana trafiła do bazy —
 * zapis szedł z opóźnieniem 300 ms (`save`), a zegarek po `ack` zdarzenia nie ponawia. Aplikacja obudzona w tle i ubita przez system w tym oknie
 * gubiła „zrobione inaczej” (znacznik do uzupełnienia), pominięcie ćwiczenia albo start sesji Zdrowia. Teraz: w chwili wysłania `ack` zmiana jest
 * już w kluczu „live” bazy; nieudany zapis → brak `ack` (zegarek ponowi). Protokół zegarka bez zmian. Sprawdzane także na zapisach wydanych buildów.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { WatchLink, type WatchTransport } from '@/lib/watch/link';
import type { PhoneToWatch, WatchAck } from '@/lib/watch/protocol';
import type { State } from '@/lib/seed';
import { fresh, saved } from './helpers';
import { world, A, NOW, teardownWorld } from './watch-world';

jest.setTimeout(60000);

/** Transport-atrapa: w chwili wysłania każdego `ack` zapamiętuje, co jest w bazie (tak, jak wczyta to aplikacja po ubiciu procesu). */
class RecTransport implements WatchTransport {
  acks: { ack: WatchAck; disk: State }[] = [];
  send(msg: PhoneToWatch) { if (msg.kind === 'ack') this.acks.push({ ack: msg as WatchAck, disk: JSON.parse(JSON.stringify(saved())) }); }
  onMessage() { return () => {}; }
  reachable() { return true; }
}
const ev = (type: string, extra: Record<string, unknown>, id: string) =>
  ({ v: 1, kind: 'event', eventId: id, workoutId: A().id, baseRev: 1, at: Date.now(), client: 'apple', type, ...extra });
/** Restart bez upływu czasu: proces ubity zaraz po `ack`, odtwarzamy stan z bazy (bez przesuwania zegara, więc bez zapisu po 300 ms). */
const restart = async () => { const snap = JSON.parse(JSON.stringify(saved())); await fresh(snap); await timer.restore(); return store.getState().active!; };

describe('ack zdarzenia z zegarka dopiero po trwałym zapisie (świat testów zegarka)', () => {
  afterEach(() => { global.__dbFail = false; teardownWorld(); });
  const setup = async () => {
    await world(); A().exercises[0].sets[0].done = true; A().exercises[0].sets[0].completedAt = NOW; store.save(A()); await store.flush();
    jest.setSystemTime(NOW + 1000);
    const tr = new RecTransport(); const l = new WatchLink(tr, () => Date.now()); l.start(); return { tr, l };
  };

  test('differ na odhaczonej serii: w chwili ack baza ma toFill; restart bez 300 ms go zachowuje', async () => {
    const { tr, l } = await setup(); const s0 = A().exercises[0].sets[0].id;
    await l.receive(ev('differ', { setId: s0 }, 'apple-d1'));
    const last = tr.acks.at(-1)!; expect(last.ack.status).toBe('applied');
    expect(last.disk.active!.exercises[0].sets[0].toFill).toBe(true);
    expect(last.disk.active!.watchEvents).toContain('apple-d1');
    l.stop(); const a = await restart(); expect(a.exercises[0].sets[0].toFill).toBe(true);
  });

  test('skip (pominięcie ćwiczenia): w chwili ack baza ma pominięcie', async () => {
    const { tr, l } = await setup(); const b = A().exercises[1].id;
    await l.receive(ev('skip', { blockId: b }, 'apple-k1'));
    const last = tr.acks.at(-1)!; expect(last.ack.status).toBe('applied');
    expect(last.disk.active!.exercises[1].skipped).toBe(true);
    l.stop(); const a = await restart(); expect(a.exercises[1].skipped).toBe(true);
  });

  test('sessionStarted: w chwili ack baza ma sesję zegarka', async () => {
    const { tr, l } = await setup();
    await l.receive(ev('sessionStarted', {}, 'apple-s1'));
    const last = tr.acks.at(-1)!; expect(last.ack.status).toBe('applied');
    expect(last.disk.active!.watch?.startedAt).toBeTruthy();
    l.stop(); const a = await restart(); expect(a.watch?.startedAt).toBeTruthy();
  });

  test('nieudany zapis → brak ack (zegarek ponowi); ponowienie po naprawie zapisu dostaje ack, a zmiana jest w bazie', async () => {
    const { tr, l } = await setup(); const s0 = A().exercises[0].sets[0].id;
    (global as any).__dbFail = (k: string) => k === 'live' || k === 'state'; /* tests/setup.js: funkcja = awaria wybranych kluczy */
    await l.receive(ev('differ', { setId: s0 }, 'apple-d2'));
    expect(tr.acks).toEqual([]);
    global.__dbFail = false;
    await l.receive(ev('differ', { setId: s0 }, 'apple-d2'));
    const last = tr.acks.at(-1)!; expect(['applied', 'duplicate']).toContain(last.ack.status);
    expect(last.disk.active!.exercises[0].sets[0].toFill).toBe(true);
    l.stop();
  });
});

const DIR = path.join(__dirname, 'fixtures', 'released');
const FILES = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort();
describe.each(FILES)('dane z wydanego builda %s: zdarzenie z zegarka w bazie przed ack', file => {
  const fx = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
  afterEach(() => { jest.useRealTimers(); });
  test('differ na odhaczonej serii trwającego treningu', async () => {
    jest.useFakeTimers({ now: fx.live.active.startedAt + 10 * 60_000 });
    await fresh(); global.__kv.clear();
    global.__kv.set('state', JSON.stringify(fx.state)); global.__kv.set('live', JSON.stringify(fx.live)); if (fx.cfg) global.__kv.set('cfg', JSON.stringify(fx.cfg));
    store.__resetForTests(); await store.init(); await store.flush();
    const s0 = A().exercises[0].sets[0]; expect(s0.done).toBe(true); expect(s0.toFill).toBeFalsy();
    const tr = new RecTransport(); const l = new WatchLink(tr, () => Date.now()); l.start();
    await l.receive(ev('differ', { setId: s0.id }, 'apple-r1'));
    const last = tr.acks.at(-1)!; expect(last.ack.status).toBe('applied');
    expect(last.disk.active!.exercises[0].sets[0].toFill).toBe(true);
    expect(last.disk.workouts.length).toBe(fx.state.workouts.length); /* historia nietknięta */
    l.stop();
  });
});
