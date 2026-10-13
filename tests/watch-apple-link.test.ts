/* Apple Watch po stronie telefonu od początku do końca: moduł natywny (atrapa transportu natywnego) → adapter → łącze protokołu (lib/watch/link.ts) → trening w toku.
 * Zegarek jest tu zastąpiony wiadomościami JSON, jakie wysyła aplikacja na zegarku (pliki wzorcowe protokołu), więc sprawdzamy też kodowanie na łączu. */
import * as fs from 'fs';
import * as path from 'path';
import { createFakeWatchLink, type FakeWatchLink } from '@/modules/watch-link';
import { startAppleWatchLink } from '@/lib/watch/apple';
import { activeWatchLink, stopWatchLink } from '@/lib/watch/link';
import { world, A, sid, teardownWorld, NOW } from './watch-world';

const fx = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'watch-fixtures', f), 'utf8'));
const sent = (w: FakeWatchLink) => w.sent.map(j => JSON.parse(j));
const settle = async () => { for (let i = 0; i < 4; i++) { await activeWatchLink()?.settled(); await Promise.resolve(); } };
let stop: (() => void) | null = null;
afterEach(() => { stop?.(); stop = null; stopWatchLink(); teardownWorld(); });

describe('start i zatrzymanie łącza zależą od zegarka', () => {
  test('bez sparowanego zegarka z aplikacją łącze nie startuje (żadnych migawek); po sparowaniu startuje, po odparowaniu zatrzymuje się', async () => {
    await world();
    const w = createFakeWatchLink({ supported: true, activated: true, paired: false, installed: false, reachable: false });
    stop = startAppleWatchLink(w); expect(activeWatchLink()).toBeNull(); expect(w.sent).toHaveLength(0);
    w.setStatus({ paired: true }); expect(activeWatchLink()).toBeNull(); /* aplikacji na zegarku jeszcze nie ma */
    w.setStatus({ installed: true, reachable: true }); expect(activeWatchLink()).not.toBeNull(); await settle();
    expect(sent(w).some(m => m.kind === 'snapshot' && m.phase === 'set')).toBe(true);
    w.setStatus({ paired: false }); expect(activeWatchLink()).toBeNull();
  });
  test('bez modułu natywnego (Expo Go, testy) nic się nie dzieje; funkcja zatrzymująca jest bezpieczna', () => {
    const w = createFakeWatchLink({}); stop = startAppleWatchLink(w); expect(activeWatchLink()).toBeNull(); stop(); stop = null;
  });
  test('funkcja zatrzymująca kończy łącze i odpina nasłuch statusu', async () => {
    await world(); const w = createFakeWatchLink(); const off = startAppleWatchLink(w); expect(activeWatchLink()).not.toBeNull(); off();
    expect(activeWatchLink()).toBeNull(); w.setStatus({ reachable: false }); expect(activeWatchLink()).toBeNull();
  });
});

describe('rozmowa z zegarkiem po JSON', () => {
  test('hello → welcome ok i migawka z gotowymi tekstami; z możliwością sesji telefon prosi o sesję i budzi aplikację na zegarku', async () => {
    await world(); const w = createFakeWatchLink(); stop = startAppleWatchLink(w); await settle();
    w.emit(JSON.stringify(fx('messages/valid/hello-apple.json'))); await settle(); await Promise.resolve();
    const m = sent(w);
    expect(m.find(x => x.kind === 'welcome')).toEqual({ v: 1, kind: 'welcome', ok: true, protocol: 1, upgrade: null });
    const snap = m.filter(x => x.kind === 'snapshot').pop(); expect(snap).toMatchObject({ phase: 'set', now: { title: 'Bench Press (sztanga)', counter: 'seria 1 z 3', load: '80 kg × 8' }, after: { restSec: 90 } });
    expect(m.find(x => x.kind === 'session')).toMatchObject({ action: 'start', workoutId: A().id, save: false });
    expect(w.started).toBe(1);
  });
  test('zdarzenie „zrobione” z zegarka odhacza serię na telefonie i wraca ack (applied) po nowej migawce; powtórzenie → duplicate', async () => {
    await world(); const w = createFakeWatchLink(); stop = startAppleWatchLink(w); await settle();
    const ev = { v: 1, kind: 'event', eventId: 'apple-1', workoutId: A().id, baseRev: 1, at: NOW + 1000, client: 'apple', type: 'done', setId: sid(0, 0) };
    jest.setSystemTime(NOW + 1500); w.emit(JSON.stringify(ev)); await settle(); await Promise.resolve();
    expect(A().exercises[0].sets[0].done).toBe(true);
    const m = sent(w); const ack = m.find(x => x.kind === 'ack'); expect(ack).toMatchObject({ eventId: 'apple-1', status: 'applied' });
    const lastSnap = m.filter(x => x.kind === 'snapshot').pop(); expect(lastSnap.rev).toBe(ack.rev); expect(lastSnap.phase).toBe('rest');
    expect(m.indexOf(lastSnap)).toBeLessThan(m.indexOf(ack)); /* najpierw migawka, potem ack z jej numerem */
    w.emit(JSON.stringify(ev)); await settle(); await Promise.resolve();
    expect(sent(w).filter(x => x.kind === 'ack').pop()).toMatchObject({ eventId: 'apple-1', status: 'duplicate' });
  });
  test('komunikaty nieczytelne z zegarka są pomijane bez wyjątku; zdarzenia z kolejki sprzed startu JS są odebrane po starcie', async () => {
    await world(); const w = createFakeWatchLink();
    w.emit('{zepsute'); w.emit(JSON.stringify(fx('messages/valid/hello-garmin.json'))); /* zaległe: śmieć i hello */
    stop = startAppleWatchLink(w); await settle(); await Promise.resolve();
    expect(sent(w).some(x => x.kind === 'welcome')).toBe(true);
    w.emit('[]'); w.emit('null'); await settle(); /* bez wyjątku */
  });
  test('sparowany zegarek poza zasięgiem: wysyłka się nie udaje, ale łącze działa dalej i nie rzuca', async () => {
    await world(); const w = createFakeWatchLink(); stop = startAppleWatchLink(w); await settle(); w.failNextSend();
    expect(() => activeWatchLink()!.push(true)).not.toThrow();
  });
});
