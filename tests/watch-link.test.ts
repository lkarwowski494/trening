/* Most do Apple Watch po stronie iPhone'a (modules/watch-link, 0.20, docs/36): logika TypeScript na module natywnym zastąpionym atrapą,
 * adapter do łącza protokołu (lib/watch/link.ts), atrapa transportu (testy i E2E) oraz zgodność warstwy JS z kodem Swift/konfiguracją modułu
 * (Swift kompiluje się tylko w CI na macOS). */
import * as fs from 'fs';
import * as path from 'path';
import { NO_WATCH, appleWatch, attachWatchMessages, createFakeWatchLink, createNativeTransport, nativeWatchLink, toLinkTransport, type NativeWatchLink, type WatchLinkStatus } from '@/modules/watch-link';

const ALL: WatchLinkStatus = { supported: true, activated: true, paired: true, installed: true, reachable: true };

function mockNative(over: Partial<NativeWatchLink> = {}) {
  const listeners: Record<string, Array<(p?: any) => void>> = { onMessages: [], onStatus: [] }; // eslint-disable-line @typescript-eslint/no-explicit-any
  const removed: string[] = [];
  const native: NativeWatchLink = {
    isSupported: () => true, getStatus: () => ({ ...ALL }), send: jest.fn(async () => true), startWatchApp: jest.fn(async () => true), takeMessages: jest.fn(() => []),
    addListener: (name, cb) => { listeners[name].push(cb); return { remove: () => { removed.push(name); listeners[name] = listeners[name].filter(x => x !== cb); } }; },
    ...over,
  };
  return { native, listeners, removed };
}

describe('transport bez modułu natywnego (Expo Go, Android, testy)', () => {
  const t = createNativeTransport(null);
  test('wszystko no-op: brak zegarka, nic nie wysyła, pusta kolejka', async () => {
    expect(t.status()).toEqual(NO_WATCH);
    expect(await t.send('{}')).toBe(false);
    expect(await t.startWatchApp()).toBe(false);
    expect(t.takeMessages()).toEqual([]);
    const off = t.subscribe(() => {}, () => {}); expect(typeof off).toBe('function'); off();
  });
  test('moduł zaimportowany w Jest (bez natywnego WatchLink) jest transportem „bez zegarka”', async () => {
    expect(nativeWatchLink).toBeNull(); expect(appleWatch.status()).toEqual(NO_WATCH); expect(await appleWatch.send('{}')).toBe(false);
  });
});

describe('transport na module natywnym (atrapa)', () => {
  test('status: pola z modułu, brakujące i nieprawdziwe wartości = false', () => {
    expect(createNativeTransport(mockNative().native).status()).toEqual(ALL);
    expect(createNativeTransport(mockNative({ getStatus: () => ({ supported: true, paired: 1 as unknown as boolean }) }).native).status()).toEqual({ ...NO_WATCH, supported: true });
    expect(createNativeTransport(mockNative({ getStatus: () => { throw new Error('x'); } }).native).status()).toEqual(NO_WATCH);
  });
  test.each([['migawka', '{"v":1,"kind":"snapshot","rev":3}'], ['pusta', ''], ['polskie znaki i emoji', '{"kind":"ack","title":"Wiosłowanie — łódka ✓"}']])('send przekazuje ciąg bez zmian: %s', async (_n, json) => {
    const { native } = mockNative(); expect(await createNativeTransport(native).send(json)).toBe(true); expect(native.send).toHaveBeenCalledWith(json);
  });
  test('send / startWatchApp: odrzucona obietnica i wyjątek synchroniczny = false (bez wyjątku w aplikacji)', async () => {
    const rej = createNativeTransport(mockNative({ send: () => Promise.reject(new Error('x')), startWatchApp: () => Promise.reject(new Error('x')) }).native);
    expect(await rej.send('{}')).toBe(false); expect(await rej.startWatchApp()).toBe(false);
    const thr = createNativeTransport(mockNative({ send: () => { throw new Error('x'); }, startWatchApp: () => { throw new Error('x'); } }).native);
    expect(await thr.send('{}')).toBe(false); expect(await thr.startWatchApp()).toBe(false);
  });
  test('send: moduł odpowiada false (zegarek niesparowany) → false', async () => {
    expect(await createNativeTransport(mockNative({ send: async () => false }).native).send('{}')).toBe(false);
  });
  test('takeMessages: tylko niepuste ciągi, wyjątek = pusta lista', () => {
    expect(createNativeTransport(mockNative({ takeMessages: () => ['{"a":1}', '', 5 as unknown as string, '{"b":2}'] }).native).takeMessages()).toEqual(['{"a":1}', '{"b":2}']);
    expect(createNativeTransport(mockNative({ takeMessages: () => { throw new Error('x'); } }).native).takeMessages()).toEqual([]);
  });
  test('subscribe: powiadomienia dochodzą, błąd odbiorcy nie zrywa kanału, odpięcie zdejmuje oba nasłuchy', () => {
    const { native, listeners, removed } = mockNative(); const t = createNativeTransport(native);
    const ev = jest.fn(() => { throw new Error('odbiorca'); }); const st = jest.fn();
    const off = t.subscribe(ev, st);
    expect(() => listeners.onMessages[0]()).not.toThrow(); expect(ev).toHaveBeenCalledTimes(1);
    listeners.onStatus[0]({ supported: true, reachable: true }); expect(st).toHaveBeenLastCalledWith({ ...NO_WATCH, supported: true, reachable: true });
    listeners.onStatus[0](undefined); expect(st).toHaveBeenLastCalledWith(ALL); /* bez ładunku: status pobrany z modułu */
    off(); expect(removed.sort()).toEqual(['onMessages', 'onStatus']); expect(listeners.onMessages).toHaveLength(0);
  });
  test('subscribe bez odbiorcy statusu zakłada tylko nasłuch komunikatów', () => {
    const { native, listeners } = mockNative(); createNativeTransport(native).subscribe(() => {}); expect(listeners.onMessages).toHaveLength(1); expect(listeners.onStatus).toHaveLength(0);
  });
});

describe('attachWatchMessages: odbiór komunikatów z zegarka', () => {
  test('kolejka sprzed startu JS jest pobrana od razu, potem po każdym powiadomieniu — w kolejności', () => {
    const w = createFakeWatchLink(); w.emit('{"n":1}'); w.emit('{"n":2}');
    const got: string[] = []; attachWatchMessages(w, e => got.push(e));
    expect(got).toEqual(['{"n":1}', '{"n":2}']);
    w.emit('{"n":3}'); expect(got).toEqual(['{"n":1}', '{"n":2}', '{"n":3}']);
  });
  test('błąd obsługi jednego komunikatu nie gubi pozostałych', () => {
    const w = createFakeWatchLink(); const got: string[] = [];
    attachWatchMessages(w, e => { if (e === 'zle') throw new Error('x'); got.push(e); });
    w.emit('a'); w.emit('zle'); w.emit('b'); expect(got).toEqual(['a', 'b']);
  });
  test('po odpięciu komunikaty zostają w kolejce (nie giną) do następnego odbiorcy', () => {
    const w = createFakeWatchLink(); const got: string[] = []; const off = attachWatchMessages(w, e => got.push(e)); off();
    w.emit('x'); expect(got).toEqual([]); const got2: string[] = []; attachWatchMessages(w, e => got2.push(e)); expect(got2).toEqual(['x']);
  });
  test('status przekazywany odbiorcy', () => {
    const w = createFakeWatchLink(); const seen: boolean[] = []; attachWatchMessages(w, () => {}, s => seen.push(s.reachable));
    w.setStatus({ reachable: false }); w.setStatus({ reachable: true }); expect(seen).toEqual([false, true]);
  });
});

describe('adapter do łącza protokołu (toLinkTransport)', () => {
  test('send serializuje komunikat do JSON; błąd wysyłki nie jest wyjątkiem', async () => {
    const w = createFakeWatchLink(); const l = toLinkTransport(w);
    l.send({ v: 1, kind: 'snapshot', rev: 1 }); await Promise.resolve(); expect(w.sent.map(s => JSON.parse(s))).toEqual([{ v: 1, kind: 'snapshot', rev: 1 }]);
    w.failNextSend(); expect(() => l.send({ v: 1, kind: 'ack' })).not.toThrow(); await Promise.resolve();
    const cyc: Record<string, unknown> = {}; cyc.self = cyc; expect(() => l.send(cyc)).not.toThrow();
  });
  test('onMessage podaje surowe ciągi JSON (w tym zaległe), odpięcie zostawia kolejkę; reachable z bieżącego statusu', () => {
    const w = createFakeWatchLink(); const l = toLinkTransport(w); w.emit('{"kind":"hello"}');
    const got: unknown[] = []; const off = l.onMessage(r => got.push(r)); w.emit('{"kind":"event"}');
    expect(got).toEqual(['{"kind":"hello"}', '{"kind":"event"}']); off(); w.emit('{"kind":"event","n":2}'); expect(got).toHaveLength(2);
    expect(l.reachable()).toBe(true); w.setStatus({ reachable: false }); expect(l.reachable()).toBe(false);
  });
  test('polecenie „session start” budzi aplikację na zegarku, inne komunikaty nie', async () => {
    const w = createFakeWatchLink(); const l = toLinkTransport(w);
    l.send({ v: 1, kind: 'session', action: 'end', workoutId: 'w', save: true }); l.send({ v: 1, kind: 'snapshot' }); await Promise.resolve(); expect(w.started).toBe(0);
    l.send({ v: 1, kind: 'session', action: 'start', workoutId: 'w', save: true }); await Promise.resolve(); await Promise.resolve(); expect(w.started).toBe(1);
  });
  test('bez zegarka (Expo Go): wszystko no-op', () => {
    const l = toLinkTransport(createNativeTransport(null)); expect(() => l.send({ kind: 'session', action: 'start' })).not.toThrow(); expect(l.reachable()).toBe(false); l.onMessage(() => {})();
  });
});

describe('atrapa zegarka (testy i E2E z fałszywym transportem)', () => {
  test('komunikaty zapisane w kolejności; poza zasięgiem/niesparowany = false i bez zapisu', async () => {
    const w = createFakeWatchLink(); expect(await w.send('1')).toBe(true); expect(await w.send('2')).toBe(true); expect(w.sent).toEqual(['1', '2']);
    w.failNextSend(); expect(await w.send('3')).toBe(false); expect(await w.send('4')).toBe(true); expect(w.sent).toEqual(['1', '2', '4']);
    w.setStatus({ paired: false }); expect(await w.send('5')).toBe(false); expect(await w.startWatchApp()).toBe(false);
  });
  test('startWatchApp liczy wywołania; takeMessages czyści kolejkę', async () => {
    const w = createFakeWatchLink(); expect(await w.startWatchApp()).toBe(true); expect(w.started).toBe(1);
    w.emit('a'); expect(w.takeMessages()).toEqual(['a']); expect(w.takeMessages()).toEqual([]);
  });
  test('domyślnie zegarek sparowany z aplikacją; status można zmieniać częściowo', () => {
    const w = createFakeWatchLink(); expect(w.status()).toEqual(ALL); w.setStatus({ installed: false }); expect(w.status()).toEqual({ ...ALL, installed: false });
    expect(createFakeWatchLink({}).status()).toEqual(NO_WATCH);
  });
});

describe('zgodność JS z kodem natywnym (Swift) i konfiguracją modułu', () => {
  const dir = path.join(__dirname, '..', 'modules', 'watch-link'); const read = (f: string) => fs.readFileSync(path.join(dir, f), 'utf8');
  const mod = read('ios/WatchLinkModule.swift');
  test('nazwa modułu, funkcje i zdarzenia po obu stronach', () => {
    expect(mod).toMatch(/Name\("WatchLink"\)/); expect(read('index.ts')).toMatch(/requireOptionalNativeModule<NativeWatchLink>\('WatchLink'\)/);
    const fns = [...mod.matchAll(/(?:Function|AsyncFunction)\("(\w+)"\)/g)].map(m => m[1]).sort();
    expect(fns).toEqual(['getStatus', 'isSupported', 'send', 'startWatchApp', 'takeMessages']);
    const ts = read('transport.ts'); const type = ts.match(/export type NativeWatchLink = \{([\s\S]*?)\n\};/)![1];
    expect([...type.matchAll(/^\s+(\w+)\(/gm)].map(m => m[1]).filter(n => n !== 'addListener').sort()).toEqual(fns);
    expect(mod).toMatch(/Events\("onMessages", "onStatus"\)/); expect(type).toMatch(/'onMessages' \| 'onStatus'/);
  });
  test('expo-module.config.json: klasy istnieją, podspec i autolinking', () => {
    const cfg = JSON.parse(read('expo-module.config.json')); expect(cfg.platforms).toEqual(['apple']);
    for (const c of [...cfg.apple.modules, ...cfg.apple.appDelegateSubscribers]) expect(read(`ios/${c}.swift`)).toMatch(new RegExp(`class ${c}\\b`));
    expect(fs.existsSync(path.join(dir, cfg.apple.podspecPath))).toBe(true);
    expect(read('WatchLink.podspec')).toMatch(/s\.frameworks\s+= 'WatchConnectivity', 'HealthKit'/); expect(read('WatchLink.podspec')).toMatch(/s\.name\s+= 'WatchLink'/);
  });
  test('komunikat z zegarka jest zapisany w trwałej kolejce PRZED odpowiedzią transportową dla zegarka', () => {
    const hub = read('ios/WatchLinkHub.swift');
    expect(hub).toMatch(/if let json = message\[wireKey\] as\? String, enqueue\(json\) \{ replyHandler\(\["received": true\]\) \}/);
    expect(hub).toMatch(/d\.set\(q, forKey: queueKey\)/); expect(hub).toMatch(/updateApplicationContext/); expect(hub).toMatch(/didReceiveUserInfo/);
  });
  test('migawka idzie jako stan (applicationContext), pozostałe komunikaty jako wiadomość albo kolejka systemu', () => {
    const hub = read('ios/WatchLinkHub.swift');
    expect(hub).toMatch(/if kind == "snapshot" \{\s*do \{ try s\.updateApplicationContext\(payload\) \}/);
    expect(hub).toMatch(/s\.sendMessage\(payload, replyHandler: nil, errorHandler: \{ \[weak self\] _ in self\?\.queueForLater\(payload\) \}\)/);
    expect(hub).toMatch(/s\.transferUserInfo\(payload\)/);
  });
  test('klucze słownika WatchConnectivity po stronie telefonu = po stronie zegarka (msg, received)', () => {
    const hub = read('ios/WatchLinkHub.swift'); const w = fs.readFileSync(path.join(__dirname, '..', 'targets/watch-app/Core/WatchProtocol.swift'), 'utf8');
    expect(hub).toContain('private let wireKey = "msg"'); expect(w).toMatch(/static let message = "msg"/);
    expect(hub).toContain('"received"'); expect(w).toMatch(/static let received = "received"/);
  });
});
