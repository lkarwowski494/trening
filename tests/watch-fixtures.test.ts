/*
 * Pliki wzorcowe protokołu zegarka (watch-fixtures/): GENEROWANE z kodu (lib/watch/*, tests/watch-scenarios.ts) — nikt ich nie przepisuje ręcznie (CLAUDE.md:
 * dokumenty z kodu). Czytają je testy Swift (`swift test`, pakiet WatchCore) i Monkey C (Run No Evil) — docs/35. Po zmianie protokołu, tekstów albo modelu zegarka:
 *   UPDATE_WATCH=1 npx jest tests/watch-fixtures.test.ts
 * Zawartość: protocol.json (stałe), messages/ (poprawne komunikaty obu kierunków + niepoprawne z powodem odrzucenia), snapshots/ (migawki prawdziwego telefonu: fazy,
 * superset, seria na czas, masa ciała, funty, języki), labels/<język>.json (stałe etykiety zegarka w 35 językach), scenarios/ (wejścia zegarka → zdarzenia i widok).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { buildSnapshot } from '@/lib/watch/snapshot';
import { allWatchLabels, WATCH_LABEL_IDS } from '@/lib/watch/labels';
import { CLIENT_ACTIONS, CLIENT_SCREENS } from '@/lib/watch/client';
import {
  WATCH, WATCH_PROTOCOL, WATCH_PROTOCOL_MIN, WATCH_CLIENTS, WATCH_PHASES, WATCH_EVENT_TYPES, WATCH_ACK_STATUSES, WATCH_REASONS, WATCH_SESSION_ACTIONS, WATCH_MSG_KINDS,
  parseWatchMessage, type PhoneToWatch,
} from '@/lib/watch/protocol';
import { completeSet } from '@/lib/setFlow';
import { LANGS, applyLang } from '@/lib/i18n';
import { applyUnit } from '@/lib/units';
import { snapshots, scenarios, runScenario, alias, aliasMap } from './watch-scenarios';
import { world, A, NOW, teardownWorld } from './watch-world';

afterEach(teardownWorld);
const DIR = path.join(__dirname, '..', 'watch-fixtures');
const json = (x: unknown) => JSON.stringify(x, null, 1) + '\n';
type Files = Record<string, string>;

const rest = () => ({ on: timer.T.on, setId: timer.T.setId, endAt: timer.T.endAt, total: timer.T.total });
const snap = (rev = 1, withRest = false) => alias(buildSnapshot(A(), { rev, nowMs: Date.now(), rest: withRest ? rest() : null }), aliasMap());

async function build(): Promise<Files> {
  const f: Files = {};
  f['protocol.json'] = json({
    protocol: WATCH_PROTOCOL, protocolMin: WATCH_PROTOCOL_MIN, constants: WATCH, clients: WATCH_CLIENTS, phases: WATCH_PHASES, eventTypes: WATCH_EVENT_TYPES, ackStatuses: WATCH_ACK_STATUSES,
    reasons: WATCH_REASONS, sessionActions: WATCH_SESSION_ACTIONS, messageKinds: WATCH_MSG_KINDS, labelIds: WATCH_LABEL_IDS, clientScreens: CLIENT_SCREENS, clientActions: CLIENT_ACTIONS,
  });
  /* komunikaty */
  const ev = (type: string, extra: object = {}) => ({ v: 1, kind: 'event', eventId: 'apple-1', workoutId: 'workout-1', baseRev: 3, at: NOW + 1000, client: 'apple', type, ...extra });
  const valid: Record<string, unknown> = {
    'hello-apple': { v: 1, kind: 'hello', client: 'apple', protocol: 1, app: '0.20.0', caps: { session: true } },
    'hello-garmin': { v: 1, kind: 'hello', client: 'garmin', protocol: 1, app: '0.20.0', caps: { session: false } },
    'event-done': ev('done', { setId: 'set-0-0' }), 'event-differ': ev('differ', { setId: 'set-0-0' }), 'event-skip': ev('skip', { blockId: 'block-0' }), 'event-undo': ev('undo', { setId: 'set-0-0' }),
    'event-restEnded': ev('restEnded', { setId: 'set-0-0' }), 'event-sessionStarted': ev('sessionStarted'), 'event-sessionEnded': ev('sessionEnded', { saved: true }),
    'welcome-ok': { v: 1, kind: 'welcome', ok: true, protocol: 1, upgrade: null }, 'welcome-update-watch': { v: 1, kind: 'welcome', ok: false, protocol: 2, upgrade: 'watch' },
    'welcome-update-phone': { v: 1, kind: 'welcome', ok: false, protocol: 1, upgrade: 'phone' },
    'ack-applied': { v: 1, kind: 'ack', eventId: 'apple-1', status: 'applied', reason: null, rev: 3 }, 'ack-rejected': { v: 1, kind: 'ack', eventId: 'apple-2', status: 'rejected', reason: 'set-gone', rev: 3 },
    'session-start': { v: 1, kind: 'session', action: 'start', workoutId: 'workout-1', save: true }, 'session-end': { v: 1, kind: 'session', action: 'end', workoutId: 'workout-1', save: false },
  };
  for (const [k, v] of Object.entries(valid)) f[`messages/valid/${k}.json`] = json(v);
  const bad = (name: string, msg: unknown) => { const r = parseWatchMessage(msg); if (r.ok) throw new Error('niepoprawny komunikat przeszedł: ' + name); return { name, message: msg, reason: r.reason }; };
  f['messages/invalid.json'] = json([
    bad('not-object', 'tekst'), bad('wrong-version', { ...ev('done', { setId: 's' }), v: 2 }), bad('unknown-kind', { v: 1, kind: 'edit' }), bad('unknown-type', ev('edit', { setId: 's' })), bad('unknown-client', { ...ev('done', { setId: 's' }), client: 'pebble' }),
    bad('missing-setId', ev('done')), bad('empty-eventId', { ...ev('done', { setId: 's' }), eventId: '' }), bad('long-id', { ...ev('done', { setId: 'x'.repeat(WATCH.ID_MAX + 1) }) }), bad('negative-baseRev', { ...ev('done', { setId: 's' }), baseRev: -1 }),
    bad('zero-at', { ...ev('done', { setId: 's' }), at: 0 }), bad('saved-not-boolean', ev('sessionEnded', { saved: 'yes' })), bad('hello-bad-caps', { v: 1, kind: 'hello', client: 'apple', protocol: 1, app: 'x', caps: {} }),
  ]);
  /* migawki prawdziwego telefonu */
  const S = await snapshots();
  const named: Record<string, unknown> = { idle: S.idle, 'set-first': S.set1, 'skipped-block': S.skipped, 'rest-after-first': S.rest1, 'to-fill': S.fill, paused: S.paused, 'rest-main-in-rest': S.rest2, 'after-two-done': S.after2, 'last-rest': S.lastRest, done: S.done };
  await world({ ss: true }); named['superset-mid-round'] = snap(1); A().exercises[0].sets[0].done = true; named['superset-end-of-round'] = snap(2);
  await world(); A().exercises.slice(0, 2).forEach(e => e.sets.forEach(x => { x.done = true; })); named['timed-set'] = snap(1);
  await world(); A().exercises[0].sets.forEach(x => { x.done = true; }); named['bodyweight-set'] = snap(1);
  await world({ unit: 'lb' }); named['unit-lb'] = snap(1); applyUnit('kg');
  for (const l of ['de', 'ja', 'pt-BR'] as const) { await world(); await completeSet(0, 0); applyLang(l); named[`lang-${l}`] = snap(2, true); }
  for (const [k, v] of Object.entries(named)) f[`snapshots/${k}.json`] = json(v);
  /* etykiety */
  const labels = allWatchLabels(); for (const l of LANGS) f[`labels/${l}.json`] = json(labels[l]);
  /* scenariusze */
  const sc = scenarios(S);
  for (const s of sc) f[`scenarios/${s.name}.json`] = json({ name: s.name, doc: s.doc, config: s.cfg, steps: runScenario(s).map(p => ({ at: p.at, input: p.input, note: p.note ?? null, expect: { out: p.out, view: p.view } })) });
  void store;
  return f;
}

const list = (d: string, base = ''): string[] => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? list(path.join(d, e.name), `${base}${e.name}/`) : [`${base}${e.name}`]) : [];

test('pliki wzorcowe watch-fixtures/ zgodne z kodem (UPDATE_WATCH=1 zapisuje)', async () => {
  const files = await build();
  if (process.env.UPDATE_WATCH === '1') {
    for (const old of list(DIR).filter(x => x !== 'README.md' && !(x in files))) fs.rmSync(path.join(DIR, old));
    for (const [rel, text] of Object.entries(files)) { const p = path.join(DIR, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); }
  }
  const have = list(DIR).filter(x => x !== 'README.md').sort(); expect(have).toEqual(Object.keys(files).sort());
  for (const [rel, text] of Object.entries(files)) expect([rel, fs.readFileSync(path.join(DIR, rel), 'utf8')]).toEqual([rel, text]);
  expect(fs.existsSync(path.join(DIR, 'README.md'))).toBe(true);
});
test('pliki wzorcowe: poprawne komunikaty przechodzą parser (zdarzenia i hello), reszta ma właściwy rodzaj; bez UUID i danych osobowych', async () => {
  const files = await build();
  for (const [rel, text] of Object.entries(files)) {
    expect([rel, /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(text)]).toEqual([rel, false]); /* identyfikatory zastąpione aliasami */
    expect([rel, /@|UDID|token|secret/i.test(text)]).toEqual([rel, false]);
    if (rel.startsWith('messages/valid/event-') || rel.startsWith('messages/valid/hello-')) expect([rel, parseWatchMessage(JSON.parse(text)).ok]).toEqual([rel, true]);
    if (rel.startsWith('snapshots/')) { const s = JSON.parse(text) as PhoneToWatch; expect(s.kind).toBe('snapshot'); }
  }
  void NOW;
});
