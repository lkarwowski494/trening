/* Zegarek Apple Watch (0.20, docs/36): kontrakt z protokołem telefonu. Pliki „złote” (tests/fixtures/watch-app: scenariusze z modelu referencyjnego
 * lib/watch/client.ts, migawki z prawdziwego telefonu, stałe) czytają dwa światy: ten test (Jest, Linux) i XCTest (targets/watch-tests, macOS w CI:
 * ScenarioReplayTests odtwarza każdy krok na Swift). Test pilnuje bez Maca czterech rzeczy:
 *  1. każdy komunikat i widok w plikach jest zgodny ze schematem poniżej (lustro lib/watch/protocol.ts + ClientView z lib/watch/client.ts),
 *  2. schemat jest zgodny z typami Swift (pola, typy, wartości enumów w targets/watch-app/Core) — zmiana po jednej stronie = czerwony test,
 *  3. pliki pokrywają wszystkie fazy, rodzaje komunikatów, zdarzeń, ekrany i akcje,
 *  4. liczby zegarka (WatchLimits) = stałe protokołu; po scaleniu z gałęzią protokołu dodatkowo porównanie z lib/watch/protocol.ts. */
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..');
const dir = path.join(root, 'tests', 'fixtures', 'watch-app');
const readJson = (p: string) => JSON.parse(fs.readFileSync(path.join(dir, p), 'utf8'));
const names = (sub: string) => fs.readdirSync(path.join(dir, sub)).filter(f => f.endsWith('.json')).sort();
const core = (f: string) => fs.readFileSync(path.join(root, 'targets/watch-app/Core', f), 'utf8');

type T = 'string' | 'number' | 'boolean' | 'string[]' | 'now' | 'rest' | 'after' | 'phase' | 'etype' | 'client' | 'caps' | 'screen' | 'actions' | 'saction';
type Field = { t: T; opt?: true };
const NOW: Record<string, Field> = { setId: { t: 'string' }, blockId: { t: 'string' }, title: { t: 'string' }, counter: { t: 'string' }, load: { t: 'string' }, group: { t: 'string', opt: true }, timed: { t: 'boolean' }, targetSec: { t: 'number', opt: true } };
const REST: Record<string, Field> = { setId: { t: 'string' }, startedAt: { t: 'number' }, endsAt: { t: 'number' }, totalSec: { t: 'number' }, cue: { t: 'string' }, last: { t: 'boolean' } };
const AFTER: Record<string, Field> = { restSec: { t: 'number', opt: true }, cue: { t: 'string' }, last: { t: 'boolean' }, now: { t: 'now', opt: true } };
const SNAPSHOT: Record<string, Field> = { v: { t: 'number' }, kind: { t: 'string' }, rev: { t: 'number' }, lang: { t: 'string' }, phase: { t: 'phase' }, paused: { t: 'boolean' }, workoutId: { t: 'string', opt: true }, title: { t: 'string' }, now: { t: 'now', opt: true }, rest: { t: 'rest', opt: true }, after: { t: 'after', opt: true }, doneCount: { t: 'number' }, totalCount: { t: 'number' }, toFillCount: { t: 'number' } };
const EVENT: Record<string, Field> = { v: { t: 'number' }, kind: { t: 'string' }, eventId: { t: 'string' }, workoutId: { t: 'string' }, baseRev: { t: 'number' }, at: { t: 'number' }, client: { t: 'client' }, type: { t: 'etype' }, setId: { t: 'string', opt: true }, blockId: { t: 'string', opt: true }, saved: { t: 'boolean', opt: true } };
const HELLO: Record<string, Field> = { v: { t: 'number' }, kind: { t: 'string' }, client: { t: 'client' }, protocol: { t: 'number' }, app: { t: 'string' }, caps: { t: 'caps' } };
const WELCOME: Record<string, Field> = { v: { t: 'number' }, kind: { t: 'string' }, ok: { t: 'boolean' }, protocol: { t: 'number' }, upgrade: { t: 'string', opt: true } };
const ACK: Record<string, Field> = { v: { t: 'number' }, kind: { t: 'string' }, eventId: { t: 'string' }, status: { t: 'string' }, reason: { t: 'string', opt: true }, rev: { t: 'number' } };
const SESSION: Record<string, Field> = { v: { t: 'number' }, kind: { t: 'string' }, action: { t: 'saction' }, workoutId: { t: 'string' }, save: { t: 'boolean' } };
const VIEW: Record<string, Field> = { screen: { t: 'screen' }, title: { t: 'string' }, counter: { t: 'string' }, load: { t: 'string' }, group: { t: 'string', opt: true }, cue: { t: 'string', opt: true }, restEndsAt: { t: 'number', opt: true }, restTotalSec: { t: 'number', opt: true }, paused: { t: 'boolean' }, timed: { t: 'boolean' }, targetSec: { t: 'number', opt: true }, doneCount: { t: 'number' }, totalCount: { t: 'number' }, toFillCount: { t: 'number' }, undoUntil: { t: 'number', opt: true }, confirmSkip: { t: 'boolean' }, actions: { t: 'actions' }, offline: { t: 'boolean' }, busy: { t: 'boolean' } };
const PHASES = ['idle', 'set', 'rest', 'done'];
const EVENT_TYPES = ['done', 'differ', 'skip', 'undo', 'restEnded', 'sessionStarted', 'sessionEnded'];
const CLIENTS = ['apple', 'garmin'];
const SCREENS = ['idle', 'set', 'rest', 'done', 'connect', 'update', 'finished'];
const ACTIONS = ['done', 'differ', 'skip', 'undo'];
const BUTTONS = ['main', 'differ', 'skip', 'confirmSkip', 'cancelSkip', 'undo'];
const SESSION_ACTIONS = ['start', 'end'];
const NESTED: Record<string, Record<string, Field>> = { now: NOW, rest: REST, after: AFTER };

function check(schema: Record<string, Field>, o: any, where: string): string[] { // eslint-disable-line @typescript-eslint/no-explicit-any
  const errs: string[] = [];
  for (const k of Object.keys(o)) if (!(k in schema)) errs.push(`${where}: nieznane pole ${k}`);
  for (const [k, f] of Object.entries(schema)) {
    const v = o[k];
    if (v === undefined || v === null) { if (!f.opt) errs.push(`${where}: brak pola ${k}`); continue; }
    const ok = f.t === 'string' ? typeof v === 'string' : f.t === 'number' ? typeof v === 'number' && Number.isFinite(v) : f.t === 'boolean' ? typeof v === 'boolean'
      : f.t === 'string[]' ? Array.isArray(v) && v.every(x => typeof x === 'string') : f.t === 'phase' ? PHASES.includes(v) : f.t === 'etype' ? EVENT_TYPES.includes(v) : f.t === 'client' ? CLIENTS.includes(v)
      : f.t === 'screen' ? SCREENS.includes(v) : f.t === 'saction' ? SESSION_ACTIONS.includes(v) : f.t === 'actions' ? Array.isArray(v) && v.every(x => ACTIONS.includes(x))
      : f.t === 'caps' ? typeof v === 'object' && typeof v.session === 'boolean' && Object.keys(v).length === 1 : typeof v === 'object';
    if (!ok) errs.push(`${where}: zły typ pola ${k}`);
    else if (NESTED[f.t]) errs.push(...check(NESTED[f.t], v, `${where}.${k}`));
  }
  return errs;
}
const SCHEMA_BY_KIND: Record<string, Record<string, Field>> = { snapshot: SNAPSHOT, event: EVENT, hello: HELLO, welcome: WELCOME, ack: ACK, session: SESSION };
const checkMsg = (m: any, where: string) => (SCHEMA_BY_KIND[m.kind] ? check(SCHEMA_BY_KIND[m.kind], m, where) : [`${where}: nieznany rodzaj ${m.kind}`]); // eslint-disable-line @typescript-eslint/no-explicit-any

const scenarios = () => names('scenarios').map(n => ({ n, sc: readJson(`scenarios/${n}`) }));

describe('pliki złote: migawki z prawdziwego telefonu', () => {
  test.each(names('snapshots'))('%s zgodna ze schematem', n => { const s = readJson(`snapshots/${n}`); expect(checkMsg(s, n)).toEqual([]); expect(s.kind).toBe('snapshot'); });
  test('wszystkie fazy mają migawkę; spójność przerwy i bieżącej serii', () => {
    const all = names('snapshots').map(n => readJson(`snapshots/${n}`));
    expect(new Set(all.map(s => s.phase))).toEqual(new Set(PHASES));
    for (const s of all) {
      if (s.phase === 'rest') expect(s.rest).toBeTruthy(); else expect(s.rest).toBeFalsy();
      if (s.phase === 'set') expect(s.now).toBeTruthy();
      if (s.phase === 'idle') { expect(s.now).toBeFalsy(); expect(s.workoutId).toBeFalsy(); }
      expect(s.doneCount).toBeLessThanOrEqual(s.totalCount);
    }
  });
  test('teksty przychodzą gotowe: zapowiedź przerwy i seria po odhaczeniu (after.now) w migawce serii', () => {
    const set1 = readJson('snapshots/set1.json');
    expect(set1.after.restSec).toBe(90); expect(set1.after.cue).toMatch(/seria 2/); expect(set1.after.now.setId).toBe('set-0-1');
    expect(readJson('snapshots/rest1.json').rest.cue).toBe(set1.after.cue); /* ten sam tekst co głos: zapowiedź policzona z góry = zapowiedź w przerwie */
  });
});

describe('pliki złote: scenariusze zegarka', () => {
  test('komplet scenariuszy', () => {
    expect(names('scenarios').map(n => n.replace('.json', ''))).toEqual(expect.arrayContaining(['basic-apple', 'basic-garmin', 'undo-window', 'differ', 'skip-confirm', 'main-in-rest', 'rest-ended', 'offline-two-done', 'stale-snapshot', 'finished-and-update', 'last-set-and-done', 'paused']));
  });
  test.each(scenarios().map(x => [x.n, x.sc] as const))('%s: komunikaty i widoki zgodne ze schematem', (n, sc) => {
    expect(['apple', 'garmin']).toContain(sc.cfg.client); expect(typeof sc.cfg.app).toBe('string'); expect(typeof sc.cfg.session).toBe('boolean');
    expect(sc.steps.length).toBeGreaterThan(0);
    sc.steps.forEach((st: any, i: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const w = `${n}[${i}]`; expect(typeof st.at).toBe('number');
      if (st.input.t === 'receive') expect(checkMsg(st.input.msg, `${w}.in`)).toEqual([]);
      else if (st.input.t === 'press') expect(BUTTONS).toContain(st.input.button);
      else if (st.input.t === 'connection') expect(typeof st.input.reachable).toBe('boolean');
      else expect(['launch', 'tick']).toContain(st.input.t);
      st.out.forEach((m: any, j: number) => expect(checkMsg(m, `${w}.out[${j}]`)).toEqual([])); // eslint-disable-line @typescript-eslint/no-explicit-any
      expect(check(VIEW, st.view, `${w}.view`)).toEqual([]);
    });
  });
  test('pokrycie: rodzaje komunikatów, zdarzeń, ekrany i akcje', () => {
    const kinds = new Set<string>(); const evs = new Set<string>(); const screens = new Set<string>(); const actions = new Set<string>(); const clients = new Set<string>();
    for (const { sc } of scenarios()) { clients.add(sc.cfg.client); for (const st of sc.steps) {
      if (st.input.t === 'receive') kinds.add(st.input.msg.kind);
      for (const m of st.out) { kinds.add(m.kind); if (m.kind === 'event') evs.add(m.type); }
      screens.add(st.view.screen); st.view.actions.forEach((a: string) => actions.add(a));
    } }
    expect(kinds).toEqual(expect.objectContaining(new Set(['snapshot', 'ack', 'welcome', 'hello', 'event'])));
    expect([...evs].sort()).toEqual(['differ', 'done', 'restEnded', 'skip', 'undo']); /* zdarzenia sesji powstają w warstwie platformy (WatchStore) — testy XCTest */
    expect([...screens].sort()).toEqual([...SCREENS].sort()); expect([...actions].sort()).toEqual([...ACTIONS].sort()); expect([...clients].sort()).toEqual(['apple', 'garmin']);
  });
  test('identyfikatory zdarzeń: klient-kolejny numer, bez powtórzeń w scenariuszu', () => {
    for (const { n, sc } of scenarios()) {
      const ids: string[] = sc.steps.flatMap((st: any) => st.out.filter((m: any) => m.kind === 'event').map((m: any) => m.eventId)); // eslint-disable-line @typescript-eslint/no-explicit-any
      expect([n, new Set(ids).size]).toEqual([n, ids.length]);
      ids.forEach((id, i) => expect(id).toBe(`${sc.cfg.client}-${i + 1}`));
    }
  });
});

describe('schemat zgodny z typami Swift (targets/watch-app/Core)', () => {
  const protocol = core('WatchProtocol.swift'); const client = core('WatchClient.swift');
  const fields = (src: string, struct: string): Record<string, string> => {
    const m = src.match(new RegExp(`struct ${struct}: Codable, Equatable \\{([\\s\\S]*?)\\n\\}`)); expect(m).not.toBeNull();
    const body = m![1].replace(/enum CodingKeys[^\n]*\n/, '');
    return Object.fromEntries([...body.matchAll(/^\s+var (\w+): ([\w\[\]]+\??)/gm)].map(x => [x[1], x[2]]));
  };
  const swiftType = (f: Field): string[] => ({
    string: ['String'], number: ['Int', 'Double'], boolean: ['Bool'], 'string[]': ['[String]'], now: ['WatchNow'], rest: ['WatchRest'], after: ['WatchAfter'], phase: ['WatchPhase'],
    etype: ['WatchEventType'], client: ['WatchClientKind'], caps: ['WatchCaps'], screen: ['ClientScreen'], actions: ['[ClientAction]'], saction: ['WatchSessionAction'],
  }[f.t]).map(t => t + (f.opt ? '?' : ''));
  const same = (schema: Record<string, Field>, struct: string, src = protocol, rename: Record<string, string> = {}) => {
    const sw = fields(src, struct);
    expect(Object.keys(sw).sort()).toEqual(Object.keys(schema).map(k => rename[k] ?? k).sort());
    for (const [k, f] of Object.entries(schema)) expect([k, swiftType(f).includes(sw[rename[k] ?? k])]).toEqual([k, true]);
  };
  test('WatchNow / WatchRest / WatchAfter / WatchSnapshot', () => { same(NOW, 'WatchNow'); same(REST, 'WatchRest'); same(AFTER, 'WatchAfter'); same(SNAPSHOT, 'WatchSnapshot'); });
  test('WatchEvent / WatchHello (protocol → protocolVersion) / WatchWelcome / WatchAck / WatchSessionCmd', () => {
    same(EVENT, 'WatchEvent'); same(HELLO, 'WatchHello', protocol, { protocol: 'protocolVersion' }); same(WELCOME, 'WatchWelcome', protocol, { protocol: 'protocolVersion' });
    same(ACK, 'WatchAck'); same(SESSION, 'WatchSessionCmd');
    expect(protocol).toMatch(/case v, kind, client, protocolVersion = "protocol", app, caps/); expect(protocol).toMatch(/case v, kind, ok, protocolVersion = "protocol", upgrade/);
  });
  test('ClientView (widok) = pola widoku z modelu referencyjnego', () => { same(VIEW, 'ClientView', client); });
  test('enumy: fazy, zdarzenia, ekrany, akcje, przyciski, polecenia sesji', () => {
    const en = (src: string, name: string) => [...src.match(new RegExp(`enum ${name}: String, [\\w, ]+ \\{([^\\n]*)\\}`))![1].matchAll(/case ([\w, ]+)/g)].flatMap(m => m[1].split(',').map(s => s.trim()));
    expect(en(protocol, 'WatchPhase').sort()).toEqual([...PHASES].sort()); expect(en(protocol, 'WatchEventType').sort()).toEqual([...EVENT_TYPES].sort());
    expect(en(protocol, 'WatchClientKind').sort()).toEqual([...CLIENTS].sort()); expect(en(protocol, 'WatchSessionAction').sort()).toEqual([...SESSION_ACTIONS].sort());
    expect(en(client, 'ClientScreen').sort()).toEqual([...SCREENS].sort()); expect(en(client, 'ClientAction').sort()).toEqual([...ACTIONS].sort()); expect(en(client, 'ClientButton').sort()).toEqual([...BUTTONS].sort());
  });
});

describe('liczby zegarka = stałe protokołu', () => {
  const lim = core('WatchClient.swift'); const swiftNum = (n: string) => Number(lim.match(new RegExp(`static let ${n}(?:: Double)? = ([\\d_]+)`))![1].replace(/_/g, ''));
  test('WatchLimits (Swift) = constants.json z modelu referencyjnego', () => {
    const c = readJson('constants.json');
    expect(swiftNum('undoSec')).toBe(c.WATCH.UNDO_SEC); expect(swiftNum('offlineDoneMax')).toBe(c.WATCH.OFFLINE_DONE_MAX);
    expect(Number(core('WatchProtocol.swift').match(/let watchProtocolVersion = (\d+)/)![1])).toBe(c.WATCH_PROTOCOL);
  });
  test('po scaleniu z gałęzią protokołu: lib/watch/protocol.ts = Swift (wersja, okno „Cofnij”, offline, listy faz i zdarzeń)', () => {
    const p = path.join(root, 'lib', 'watch', 'protocol.ts'); if (!fs.existsSync(p)) return; /* w tej gałęzi protokołu jeszcze nie ma — sprawdzenie włącza się samo po scaleniu */
    const ts = fs.readFileSync(p, 'utf8'); const num = (n: string) => Number(ts.match(new RegExp(`${n}: (\\d+)`))![1]);
    expect(Number(ts.match(/WATCH_PROTOCOL = (\d+)/)![1])).toBe(Number(core('WatchProtocol.swift').match(/let watchProtocolVersion = (\d+)/)![1]));
    expect(num('UNDO_SEC')).toBe(swiftNum('undoSec')); expect(num('OFFLINE_DONE_MAX')).toBe(swiftNum('offlineDoneMax'));
    const list = (n: string) => ts.match(new RegExp(`${n} = \\[([^\\]]+)\\]`))![1].split(',').map(x => x.trim().replace(/'/g, ''));
    expect(list('WATCH_PHASES')).toEqual(PHASES); expect(list('WATCH_EVENT_TYPES')).toEqual(EVENT_TYPES); expect(list('WATCH_CLIENTS')).toEqual(CLIENTS);
  });
});

describe('testy Swift znajdują pliki złote (ścieżki liczone od #filePath)', () => {
  test.each([['targets/watch-tests/WatchCoreTests/Fixtures.swift', 'tests/fixtures/watch-app'], ['targets/watch-ui-tests/WatchUITests.swift', 'tests/fixtures/watch-app']])('%s → korzeń repozytorium', (file, fx) => {
    const src = fs.readFileSync(path.join(root, file), 'utf8');
    const n = Number(src.match(/for _ in 0\.\.<(\d+) \{ u\.deleteLastPathComponent\(\) \}/)![1]);
    expect(n).toBe(file.split('/').length); /* tyle składników ścieżki pliku trzeba odciąć, żeby dojść do korzenia */
    expect(src).toContain(fx.replace('tests/fixtures/watch-app', 'tests/fixtures/watch-app'));
    expect(fs.existsSync(path.join(root, fx))).toBe(true);
  });
});
