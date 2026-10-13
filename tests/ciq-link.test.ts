/* Łącze z zegarkiem z Connect IQ (lib/watch/ciqLink.ts) z atrapą modułu natywnego: stan urządzeń, wysyłanie migawek (tylko najnowsza, tylko do połączonych),
 * odbiór zdarzeń (walidacja), błędy, brak modułu. Rodzaje (docs/20): logika, macierz (stany urządzenia × wynik wysyłki), scenariusz (parowanie -> hello -> migawka), niezmienniki. */
import { createCiqLink, ciqStatusName, CIQ_DEVICE_STATUSES } from '@/lib/watch/ciqLink';
import { CIQ_KEYS, toCiqWire, type CiqEvent } from '@/lib/watch/ciqWire';
import type { CiqNative, NativeDevice } from '@/modules/ciq-link';
import { T0 } from './ciq-scenarios';

type Handlers = { onMessage?: (e: { id: string; message: Record<string, unknown> }) => void; onDeviceStatus?: (e: { id: string; status: number }) => void; onDevices?: (e: { devices: NativeDevice[]; needsCompanion?: boolean }) => void };
function fakeNative(devices: NativeDevice[] = [], send: (id: string, m: Record<string, unknown>) => Promise<{ ok: boolean; code: number; name: string }> = async () => ({ ok: true, code: 0, name: 'Success' })) {
  const h: Handlers = {}; const removed: string[] = []; const calls = { pair: 0, forget: 0, store: 0, sent: [] as { id: string; m: Record<string, unknown> }[], opened: [] as string[] };
  const native = {
    isSupported: () => true, pair: () => { calls.pair++; }, showCompanionStore: () => { calls.store++; }, forget: () => { calls.forget++; }, devices: () => devices, showStore: () => {},
    send: (id: string, m: Record<string, unknown>) => { calls.sent.push({ id, m }); return send(id, m); },
    openApp: async (id: string) => { calls.opened.push(id); return { ok: true, code: 0, name: 'Success' }; }, appStatus: async () => ({ installed: true, version: 1 }),
    addListener: (ev: keyof Handlers, cb: never) => { (h as Record<string, unknown>)[ev] = cb; return { remove: () => removed.push(ev) }; },
  } as unknown as CiqNative;
  return { native, h, calls, removed };
}
const watch = (status: number, id = 'D1'): NativeDevice => ({ id, name: 'Zegarek', model: 'fenix 8', status });
const goodEvent = { k: 'e', v: 1, t: 'd', e: 'w1-1', b: 5, id: 's2', a: T0 };
const snapMsg = toCiqWire({ rev: 1, mode: 'idle' });

describe('stany urządzenia', () => {
  test.each(CIQ_DEVICE_STATUSES.map((s, i) => [i, s]))('kod %i -> %s', (n, s) => { expect(ciqStatusName(n as number)).toBe(s); });
  test('nieznany kod, ujemny i NaN -> invalid', () => { expect([ciqStatusName(9), ciqStatusName(-1), ciqStatusName(NaN)]).toEqual(['invalid', 'invalid', 'invalid']); });
  test('lista stanów: 5 wartości w kolejności SDK', () => { expect([...CIQ_DEVICE_STATUSES]).toEqual(['invalid', 'bluetoothOff', 'notFound', 'notConnected', 'connected']); });
});

describe('bez modułu natywnego', () => {
  test('wszystko jest ciche: niedostępne, brak urządzeń, send/openApp = unavailable', async () => {
    const l = createCiqLink(null);
    expect(l.available()).toBe(false); expect(l.state()).toEqual({ available: false, devices: [], needsCompanion: false, rejected: 0 });
    l.pair(); l.forget(); l.showCompanionStore();
    expect(await l.send(snapMsg)).toBe('unavailable'); expect(await l.openApp()).toBe('unavailable'); l.dispose();
  });
});

describe('urządzenia i zdarzenia natywne', () => {
  test('stan początkowy z modułu; onDevices podmienia listę i ustawia needsCompanion; onDeviceStatus zmienia jedno urządzenie; słuchacze dostają kopie', () => {
    const f = fakeNative([watch(3)]); const l = createCiqLink(f.native); const seen: unknown[] = [];
    l.onChange(s => seen.push(s)); expect(l.state().devices).toEqual([{ id: 'D1', name: 'Zegarek', model: 'fenix 8', status: 'notConnected' }]);
    f.h.onDeviceStatus!({ id: 'D1', status: 4 }); expect(l.state().devices[0].status).toBe('connected');
    f.h.onDeviceStatus!({ id: 'NIE-MA', status: 1 }); expect(l.state().devices.length).toBe(1);
    f.h.onDevices!({ devices: [watch(4, 'A'), watch(1, 'B')], needsCompanion: true }); expect(l.state().devices.map(d => d.id)).toEqual(['A', 'B']); expect(l.state().needsCompanion).toBe(true);
    f.h.onDevices!({ devices: [] }); expect(l.state()).toMatchObject({ devices: [], needsCompanion: false }); expect(seen.length).toBe(4);
    const s = l.state(); s.devices.push({ id: 'x', name: '', model: '', status: 'invalid' }); expect(l.state().devices.length).toBe(0);
  });
  test('moduł rzucający przy odczycie listy nie psuje tworzenia łącza', () => {
    const f = fakeNative(); (f.native as unknown as { devices: () => never }).devices = () => { throw new Error('x'); }; expect(createCiqLink(f.native).state().devices).toEqual([]);
  });
  test('zdarzenia: poprawne trafiają do słuchaczy z id urządzenia; złe są odrzucane i liczone; błąd słuchacza nie psuje reszty; wypisanie działa', () => {
    const f = fakeNative(); const l = createCiqLink(f.native); const got: [CiqEvent, string][] = [];
    l.onEvent(() => { throw new Error('zły słuchacz'); }); const off = l.onEvent((e, id) => got.push([e, id]));
    f.h.onMessage!({ id: 'D1', message: goodEvent }); f.h.onMessage!({ id: 'D1', message: { ...goodEvent, v: 9 } }); f.h.onMessage!({ id: 'D1', message: { x: 1 } });
    expect(got.length).toBe(1); expect(got[0][0]).toMatchObject({ type: 'done', setId: 's2', eventId: 'w1-1' }); expect(got[0][1]).toBe('D1'); expect(l.state().rejected).toBe(2);
    off(); f.h.onMessage!({ id: 'D1', message: { ...goodEvent, e: 'w1-2' } }); expect(got.length).toBe(1);
  });
  test('pair/forget/sklep przekazywane do modułu; forget czyści listę i powiadamia', () => {
    const f = fakeNative([watch(4)]); const l = createCiqLink(f.native); let n = 0; l.onChange(() => n++);
    l.pair(); l.showCompanionStore(); l.forget(); expect(f.calls).toMatchObject({ pair: 1, store: 1, forget: 1 }); expect(l.state().devices).toEqual([]); expect(n).toBe(1);
  });
  test('dispose odpina nasłuch w module i czyści słuchaczy', () => {
    const f = fakeNative(); const l = createCiqLink(f.native); l.dispose(); expect(f.removed.sort()).toEqual(['onDeviceStatus', 'onDevices', 'onMessage']);
  });
});

describe('wysyłanie migawek', () => {
  test.each([
    ['połączony', 4, 'sent'], ['niepołączony', 3, 'no-device'], ['bluetooth wyłączony', 1, 'no-device'], ['nieznaleziony', 2, 'no-device'], ['nieważny', 0, 'no-device'],
  ])('urządzenie %s -> %s', async (_n, st, want) => { const f = fakeNative([watch(st as number)]); expect(await createCiqLink(f.native).send(snapMsg)).toBe(want); expect(f.calls.sent.length).toBe(want === 'sent' ? 1 : 0); });
  test('kilka urządzeń: tylko połączone; sukces, gdy choć jedno przyjęło; porażka, gdy żadne', async () => {
    const f = fakeNative([watch(4, 'A'), watch(3, 'B'), watch(4, 'C')], async id => ({ ok: id === 'C', code: id === 'C' ? 0 : 3, name: '' }));
    const l = createCiqLink(f.native); expect(await l.send(snapMsg)).toBe('sent'); expect(f.calls.sent.map(x => x.id)).toEqual(['A', 'C']);
    const g = fakeNative([watch(4)], async () => ({ ok: false, code: 3, name: 'Failure' })); expect(await createCiqLink(g.native).send(snapMsg)).toBe('failed');
    const h = fakeNative([watch(4)], async () => { throw new Error('bt'); }); expect(await createCiqLink(h.native).send(snapMsg)).toBe('failed');
  });
  test('wysyłana jest ta sama wiadomość (słownik), bez zmian', async () => {
    const f = fakeNative([watch(4)]); await createCiqLink(f.native).send(snapMsg); expect(f.calls.sent[0].m).toEqual(snapMsg);
  });
  test('gdy poprzednia leci, czeka tylko najnowsza; zastąpione dostają „sent”; kolejność zachowana', async () => {
    let release: () => void = () => {}; let first = true;
    const f = fakeNative([watch(4)], () => new Promise(res => { if (first) { first = false; release = () => res({ ok: true, code: 0, name: '' }); } else res({ ok: true, code: 0, name: '' }); }));
    const l = createCiqLink(f.native); const m = (rev: number) => toCiqWire({ rev, mode: 'idle' });
    const p1 = l.send(m(1)); const p2 = l.send(m(2)); const p3 = l.send(m(3)); const p4 = l.send(m(4));
    await Promise.resolve(); expect(f.calls.sent.map(x => x.m[CIQ_KEYS.rev])).toEqual([1]);
    release(); expect(await Promise.all([p1, p2, p3, p4])).toEqual(['sent', 'sent', 'sent', 'sent']); expect(f.calls.sent.map(x => x.m[CIQ_KEYS.rev])).toEqual([1, 4]);
  });
  test('openApp: prosi tylko połączone zegarki; brak połączonych = no-device', async () => {
    const f = fakeNative([watch(4, 'A'), watch(3, 'B')]); const l = createCiqLink(f.native); expect(await l.openApp()).toBe('sent'); expect(f.calls.opened).toEqual(['A']);
    expect(await createCiqLink(fakeNative([watch(3)]).native).openApp()).toBe('no-device');
  });
});

test('scenariusz: parowanie -> zegarek się łączy -> hello -> migawka z etykietami wraca do zegarka', async () => {
  const f = fakeNative(); const l = createCiqLink(f.native); const events: CiqEvent[] = [];
  l.onEvent(e => { events.push(e); if (e.type === 'hello') void l.send(toCiqWire({ rev: 7, mode: 'idle' }, { withLabels: true })); });
  l.pair(); f.h.onDevices!({ devices: [watch(3)] }); f.h.onDeviceStatus!({ id: 'D1', status: 4 });
  f.h.onMessage!({ id: 'D1', message: { k: 'e', v: 1, t: 'h', e: 'w9-1', b: 0, id: '', a: T0 } });
  await new Promise(r => setTimeout(r, 0));
  expect(events.map(e => e.type)).toEqual(['hello']); expect(f.calls.sent.length).toBe(1); expect(f.calls.sent[0].m[CIQ_KEYS.rev]).toBe(7); expect(f.calls.sent[0].m[CIQ_KEYS.labels]).toBeDefined();
});
