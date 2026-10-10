/*
 * Dane — fuzzing i odporność (polecenie właściciela 06.10.2026: pełne, darmowe testy automatyczne; docs/20 rodzaj 6 „Dane”, rodzaj 8).
 *  1. Import (lib/backup.ts parseBackup → store.migrate): losowo psute kopie (fast-check) — ucięty JSON, zły typ w KAŻDYM polu, ogromne
 *     liczby, „NaN”/„Infinity” tekstem i 1e400 (= Infinity po JSON.parse), wartości ujemne, unicode/emoji/RTL/zero‑width w nazwach,
 *     zduplikowane id, brak wymaganych pól, schemat z przyszłości, klucze zatruwające prototyp (__proto__, constructor, prototype).
 *     Wynik: odrzucenie z komunikatem aplikacji albo POPRAWNY stan (tests/matrix-data-shared.ts → stateProblems); nigdy wyjątek spoza
 *     kontrolowanych, nigdy niepoprawna wartość; eksport → import wyniku to punkt stały; na wyniku działają statystyki, CSV i trening.
 *  2. CSV (buildCsv): losowe stany — plik parsuje się z powrotem (RFC 4180: przecinki, cudzysłowy, nowe linie, emoji), liczba wierszy =
 *     liczba odhaczonych serii w historii, ciężar w jednostce z ustawień, ochrona przed formułami arkusza.
 *  3. Awarie zapisu (global.__dbFail, tests/setup.js): zapis, import, reset przy błędzie bazy — po restarcie stan w całości stary albo nowy.
 *  4. Rozmiar: 5 lat codziennych treningów (~1830) — statystyki, rekordy, historia i start w budżecie czasu; 10 000 treningów w imporcie.
 * Błędy aplikacji: test.failing('ZNALEZISKO: …') z miejscem w kodzie (CLAUDE.md: test odtwarzający przed poprawką).
 */
import fc from 'fast-check';
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';
import { buildBackup, parseBackup, buildCsv, exportCsv, importBackup, CSV_BOM } from '@/lib/backup';
import { t } from '@/lib/i18n';
import { KG_PER_LB } from '@/lib/units';
import { SCHEMA_VERSION, seedState, type State, type WSet } from '@/lib/seed';
import { fresh } from './helpers';
import { stateProblems, strip, clone, J, parseCsvRfc } from './matrix-data-shared';
import { renderApp, flushAll, go, screen } from './app';

jest.setTimeout(300000);
const SEED = Number(process.env.MATRIX_SEED) || 20261006;
const realNow = () => require('perf_hooks').performance.now() as number;
const H = 3600e3, DAY = 86400e3, T0 = Date.UTC(2026, 0, 5, 8);

/* ---------- stan bazowy: wszystkie rodzaje danych, mały katalog (szybka migracja) ---------- */
const NAMES = ['Back Squat', 'Goblet Squat', 'Pull Up', 'Plank', 'Bench Press (hantle)', 'Bieg'];
function baseRaw(): any {
  const s: any = seedState('pl'); s.exercises = s.exercises.filter((e: any) => NAMES.includes(e.name));
  const id = (n: string) => s.exercises.find((e: any) => e.name === n).id;
  s.exercises.push({ id: 'cx', ownerId: 'local', createdAt: T0, updatedAt: T0, name: 'Własne, "x" 💪', group: 'klatka', equipment: 'hantle', metric: 'weight_reps', loadMode: 'per_dumbbell', restSec: 60, restWarmupSec: null, muscles: ['klatka'], secondaryMuscles: [], bandAssistable: false, tempo: '', notes: 'n', requires: [], recommended: [] });
  s.settings.locations = [{ id: 'L1', ownerId: 'local', createdAt: T0, updatedAt: T0, name: 'Dom', equipment: [{ item: 'db_fixed', opts: [] }] }]; s.settings.mainLocationId = 'L1'; s.settings.unit = 'kg';
  s.templates = [{ id: 't1', ownerId: 'local', createdAt: T0, updatedAt: T0, name: 'Plan', locationId: 'L1', items: [
    { id: 'i1', exerciseId: id('Back Squat'), sets: 2, repMin: 5, repMax: 8, restSec: 120, startWeight: 100, targetSec: '', groupId: null, alternates: [{ locationId: 'L1', exerciseId: id('Bench Press (hantle)'), restSec: 60 }], rows: [{ id: 'r1', kind: 'warmup', reps: 8, weight: 60, durationSec: '', distanceM: '' }, { id: 'r2', kind: 'normal', reps: 5, weight: 100, durationSec: '', distanceM: '' }] },
    { id: 'i2', exerciseId: id('Goblet Squat'), sets: 2, repMin: 10, repMax: 12, restSec: 60, startWeight: 24, targetSec: '', groupId: 'g' },
    { id: 'i3', exerciseId: 'cx', sets: 1, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: 'g' },
    { id: 'i4', exerciseId: id('Plank'), sets: 1, repMin: null, repMax: null, restSec: 30, startWeight: '', targetSec: 60, groupId: null },
  ] }];
  const set = (sid: string, p: Partial<WSet>): WSet => ({ id: sid, weight: '', reps: '', durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind: 'normal', warmup: false, note: '', done: true, completedAt: T0, actualRest: 90, ...p });
  const blk = (bid: string, exerciseId: string, sets: WSet[], x: Record<string, unknown> = {}) => ({ id: bid, exerciseId, restSec: 90, repMin: 5, repMax: 8, groupId: null, sets, ...x });
  const wk = (wid: string, at: number, exercises: unknown[]) => ({ id: wid, ownerId: 'local', createdAt: at, updatedAt: at, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: 't1', templateName: 'Plan', startedAt: at, finishedAt: at + H, note: 'notatka, "z" cudzysłowem', locationId: 'L1', exercises });
  const band = s.bands[0].id;
  s.workouts = [
    wk('w1', T0, [blk('b1', id('Back Squat'), [set('s1', { weight: 60, reps: 8, kind: 'warmup', warmup: true }), set('s2', { weight: 100, reps: 5, rpe: 8 }), set('s3', { weight: 80, reps: 10, kind: 'drop' })]), blk('b2', id('Goblet Squat'), [set('s4', { weight: 24, reps: 12, kind: 'failure', note: '=1+1' })], { impl: 'dumbbell', swappedFrom: id('Back Squat'), implPinned: true })]),
    wk('w2', T0 + 2 * DAY, [blk('b3', id('Pull Up'), [set('s5', { addKg: -10, reps: 6, bandId: band }), set('s6', { addKg: 5, reps: 4 })]), blk('b4', id('Plank'), [set('s7', { durationSec: 75 })]), blk('b5', id('Bieg'), [set('s8', { distanceM: 5000, durationSec: 1500 })])]),
    wk('w3', T0 + 4 * DAY, [blk('b6', 'cx', [set('s9', { weight: 22.5, reps: 10, note: 'linia1\nlinia2, "x"' })], { groupId: 'G' }), blk('b7', id('Bench Press (hantle)'), [set('s10', { weight: 30, reps: 8 })], { groupId: 'G' })]),
  ];
  s.active = { ...wk('act', Date.now() - 600e3, [blk('b8', id('Back Squat'), [set('s11', { weight: 100, reps: 5, completedAt: Date.now() - 300e3 }), set('s12', { weight: 105, done: false, completedAt: null, pre: { weight: 105 } } as any)], { splitFrom: 'b0', altSkip: true })]), finishedAt: null };
  s.mornings = [{ id: 'm1', ownerId: 'local', createdAt: T0, updatedAt: T0, date: '2026-01-05', bb: 60, sleepScore: 80, sleepH: 7.25, weight: 81.3 }];
  s.timer = { restEndAt: Date.now() + 60e3, restTotal: 90, restSetId: 's11', setStartAt: null, setTarget: 0, setId: null };
  return s;
}

/* ---------- silnik mutacji ---------- */
type Path = (string | number)[];
function pathsOf(x: unknown, p: Path = [], out: Path[] = [], depth = 0): Path[] {
  if (depth > 8 || x === null || typeof x !== 'object') return out;
  for (const k of Array.isArray(x) ? x.map((_, i) => i) : Object.keys(x)) { const q = [...p, k]; out.push(q); pathsOf((x as any)[k], q, out, depth + 1); }
  return out;
}
const getAt = (o: any, p: Path) => p.reduce((a, k) => (a == null ? a : a[k]), o);
const parentOf = (o: any, p: Path) => getAt(o, p.slice(0, -1));
/** Własny klucz o nazwie zatruwającej (np. „__proto__”) — tak, jak tworzy go JSON.parse z pliku. */
const defOwn = (o: any, k: string, v: unknown) => Object.defineProperty(o, k, { value: v, enumerable: true, writable: true, configurable: true });

const WEIRD: unknown[] = [null, true, false, '', 0, -0, -1, -0.004, -1e-9, 1e-300, 1e308, -1e308, 2 ** 53 + 1, 1e7 + 1, 'NaN', 'Infinity', '-Infinity', '1e400', '62,5', ' 7 ', '0x1F', '1e3',
  [], {}, [null], [[]], { a: 1 }, '​', '‮odwrócone‬', '😀💪🏽👨‍👩‍👧', 'مرحبا بالعالم', 'שלום', '﻿', '\u0000', 'a'.repeat(3000), '__proto__', '=SUM(A1)', '+48 600', '@x', '-5',
  '2026-02-30', '2026-09-01T10:00:00Z', 'toString', 'constructor', 'hasOwnProperty', 'weight', 'L1', 'cx', 's1', 'w1', 't1', 'i1'];
const weirdArb = fc.oneof({ weight: 6, arbitrary: fc.constantFrom(...WEIRD) }, { weight: 1, arbitrary: fc.double() }, { weight: 1, arbitrary: fc.integer() },
  { weight: 1, arbitrary: fc.string({ maxLength: 12 }) }, { weight: 1, arbitrary: fc.fullUnicodeString({ maxLength: 8 }) });
type Mut = { op: 'set' | 'del' | 'dup' | 'proto' | 'wrap' | 'numstr' | 'future' | 'swapIds'; at: number; at2: number; v: unknown; k: number };
const mutArb: fc.Arbitrary<Mut> = fc.record({ op: fc.constantFrom<Mut['op']>('set', 'set', 'set', 'set', 'del', 'del', 'dup', 'dup', 'proto', 'wrap', 'numstr', 'future', 'swapIds'), at: fc.nat(), at2: fc.nat(), v: weirdArb, k: fc.nat(4) });
type TextMut = { op: 'none' | 'trunc' | 'inf' | 'bom' | 'garbage'; at: number };
const textArb: fc.Arbitrary<TextMut> = fc.oneof({ weight: 8, arbitrary: fc.constant<TextMut>({ op: 'none', at: 0 }) }, { weight: 2, arbitrary: fc.record({ op: fc.constantFrom<TextMut['op']>('trunc', 'inf', 'bom', 'garbage'), at: fc.nat() }) });
const POISON = ['__proto__', 'constructor', 'prototype', 'toString', 'hasOwnProperty'];

function applyMut(root: any, m: Mut) {
  const ps = pathsOf(root); if (!ps.length) return; const p = ps[m.at % ps.length]; const par = parentOf(root, p); const key = p[p.length - 1]; if (par == null || typeof par !== 'object') return;
  switch (m.op) {
    case 'set': par[key] = clone(m.v === undefined ? null : m.v); break;
    case 'del': if (Array.isArray(par)) par.splice(Number(key), 1); else delete par[key]; break;
    case 'dup': { const arrP = Array.isArray(par) ? par : null; if (arrP) arrP.push(clone(arrP[Number(key)])); else { const v = getAt(root, p); if (Array.isArray(v) && v.length) v.push(clone(v[0])); } break; } /* zduplikowane id */
    case 'proto': { const v = getAt(root, p); const target = v && typeof v === 'object' && !Array.isArray(v) ? v : par; if (Array.isArray(target)) break; defOwn(target, POISON[m.k % POISON.length], m.k % 2 ? { polluted: 'yes', weight: 1e9 } : clone(m.v ?? null)); break; }
    case 'wrap': par[key] = m.k % 2 ? [getAt(root, p)] : { v: getAt(root, p) }; break;
    case 'numstr': { const v = getAt(root, p); if (typeof v === 'number') par[key] = String(v).replace('.', ','); else if (typeof v === 'string') par[key] = Number(v); break; }
    case 'future': { const v = SCHEMA_VERSION + 1 + (m.at % 1000); if (m.k % 2) root.schemaVersion = m.k % 4 === 1 ? String(v) : v; else if (root.state && typeof root.state === 'object') root.state.schemaVersion = v; break; }
    case 'swapIds': { const q = ps[m.at2 % ps.length]; if (q[q.length - 1] !== 'id' || key !== 'id') { const a = getAt(root, q); if (typeof a === 'string') par[key] = a; } else { const pq = parentOf(root, q); const tmp = par[key]; par[key] = pq[q[q.length - 1]]; pq[q[q.length - 1]] = tmp; } break; }
  }
}
function applyText(txt: string, m: TextMut): string {
  switch (m.op) {
    case 'trunc': return txt.slice(0, m.at % Math.max(1, txt.length));
    case 'inf': { const re = /(?<=[:\[,])-?\d+(\.\d+)?(?=[,\]}])/g; const all = [...txt.matchAll(re)]; if (!all.length) return txt; const x = all[m.at % all.length]; return txt.slice(0, x.index!) + (m.at % 2 ? '1e400' : '-1e400') + txt.slice(x.index! + x[0].length); }
    case 'bom': return '﻿' + txt;
    case 'garbage': { const i = m.at % Math.max(1, txt.length); return txt.slice(0, i) + '\u0000}' + txt.slice(i); }
    default: return txt;
  }
}

/** Błędy, z którymi import kończy się kontrolowanie (app/more/backup.tsx: „To nie wygląda na backup z tej apki” albo „Backup z nowszej wersji aplikacji”). */
function rejection(e: unknown, txt: string): string | null {
  if (e instanceof SyntaxError) return null;
  if (e instanceof Error && e.message === 'bad state') return null;
  if (e instanceof Error && /^Plik ma schemat /.test(e.message)) { const m = /schemat (\S+), a ta wersja obsługuje do (\d+)/.exec(e.message); if (m && Number(m[2]) === SCHEMA_VERSION && (Number(m[1]) > SCHEMA_VERSION || m[1] === 'Infinity')) return null; return 'zły komunikat schematu: ' + e.message; }
  return `${(e as Error)?.constructor?.name}: ${(e as Error)?.message} | ${txt.slice(0, 160)}`;
}
const polluted = () => { const o: any = {}; return o.polluted !== undefined || o.weight !== undefined || Object.keys(Object.prototype).length > 0 || ({} as any).toString !== Object.prototype.toString; };

/** Znane i opisane osobno (niżej): zduplikowane id zostają po imporcie (ZNALEZISKO), obce klucze __proto__/constructor zostają jako martwe pola
 * (bez zatrucia prototypu — sprawdzane zawsze: „obcy prototyp” i polluted()). Fuzzing szuka WSZYSTKIEGO INNEGO. */
const KNOWN = /zduplikowane id|^klucz (__proto__|constructor|prototype):|po treningu na zaimportowanych danych: (zduplikowane id|klucz )/;
/** Artefakt Jest (opis przy teście kluczy __proto__ niżej): babel-jest kompiluje spread do Object.assign — tylko wtedy dopuszczamy obcy prototyp
 * w dwóch obiektach budowanych spreadem w migrate (settings.modules, timer). W bundlu aplikacji (Hermes) spread jest natywny. */
const JEST_SPREAD = Object.getPrototypeOf({ ...JSON.parse('{"__proto__":{"x":1}}') }) !== Object.prototype;
const jestSpreadOnly = (p: string) => JEST_SPREAD && /obcy prototyp obiektu: state\.(settings\.modules|timer)$/.test(p);
/** Po imporcie: punkt stały eksport→import i normalna praca aplikacji na danych (statystyki, CSV, trening z szablonu, zakończenie). */
function exercise(st: State, where: string): string[] {
  const out: string[] = [];
  const a = J(strip(store.getState())); const b = J(strip(parseBackup(J(buildBackup())))); if (a !== b) out.push(`${where}: eksport → import nie jest punktem stałym`);
  try {
    buildCsv(); stats.weeklyTotals(8); store.finishedWorkouts();
    const used = new Set(st.workouts.flatMap(w => w.exercises.map(e => e.exerciseId)));
    for (const e of store.getState().exercises) if (used.has(e.id)) { stats.sessionsFor(e); stats.recordsFor(e); stats.chartKeysFor(e); }
    for (const w of store.getState().workouts) { stats.prMap(w); stats.workoutPRs(w); store.volume(w); }
    const tp = store.getState().templates[0];
    if (tp) { store.getState().active = null; store.startFromTemplate(tp); const act = store.getState().active; if (act && act.exercises[0]?.sets[0]) { store.toggleDone(0, 0); store.finishWorkout(); } }
    const p = stateProblems(store.getState()); if (p.length) out.push(`${where}: po treningu na zaimportowanych danych: ${p.slice(0, 3).join('; ')}`);
  } catch (e) { out.push(`${where}: wyjątek w pracy na zaimportowanych danych: ${(e as Error).stack?.split('\n').slice(0, 3).join(' ')}`); }
  return out;
}

/** Przyjęte (zsanityzowane) stany z fuzzingu — na nich startuje potem prawdziwa aplikacja. */
const SAMPLES: State[] = [];

describe('import — fuzzing kopii (fast-check)', () => {
  let BASE: any;
  beforeAll(async () => { await fresh(); BASE = { format: 'trening-backup', schemaVersion: SCHEMA_VERSION, exportedAt: new Date(T0).toISOString(), state: store.migrate(baseRaw()) }; });

  test('stan bazowy jest poprawny i przechodzi eksport → import bez zmian (kontrola generatora)', async () => {
    expect(stateProblems(BASE.state)).toEqual([]);
    store.replaceState(clone(BASE.state)); expect(exercise(store.getState(), 'baza')).toEqual([]);
  });

  test('losowo popsute kopie: odrzucenie z komunikatem albo poprawny stan; punkt stały; bez zatrucia prototypu; aplikacja działa na wyniku', async () => {
    await fresh(); const seen = { rejected: 0, accepted: 0 }; const bad: string[] = []; let known = 0;
    fc.assert(fc.property(fc.array(mutArb, { minLength: 1, maxLength: 6 }), textArb, fc.boolean(), (muts, tm, bare) => {
      const doc = clone(bare ? BASE.state : BASE); for (const m of muts) applyMut(doc, m);
      const txt = applyText(J(doc), tm);
      let res: State;
      try { res = parseBackup(txt); } catch (e) { seen.rejected++; const r = rejection(e, txt); if (r) bad.push('niekontrolowany wyjątek importu: ' + r); return; }
      seen.accepted++;
      if (polluted()) { bad.push('ZATRUTY Object.prototype po imporcie: ' + txt.slice(0, 200)); return; }
      const all = stateProblems(res).filter(x => !jestSpreadOnly(x)); const p = all.filter(x => !KNOWN.test(x)); if (all.length > p.length) known++;
      if (p.length) { bad.push(`niepoprawny stan po imporcie (${muts.map(m => m.op).join(',')}): ${p.slice(0, 3).join('; ')}`); return; }
      if (SAMPLES.length < 25 && all.length === 0) SAMPLES.push(clone(res)); /* stany ze zduplikowanym id — osobno (ZNALEZISKO niżej) */
      store.replaceState(res); bad.push(...exercise(store.getState(), 'import').filter(x => !KNOWN.test(x)));
    }), { numRuns: Number(process.env.FUZZ_RUNS || 1500), seed: SEED });
    const uniq = [...new Set(bad.map(b => b.replace(/\d{6,}/g, '#').slice(0, 220)))];
    expect({ seen: seen.accepted > 100 && seen.rejected > 100, problems: uniq.slice(0, 20) }).toEqual({ seen: true, problems: [] });
    expect(known).toBeGreaterThan(0); /* generator naprawdę trafia w zduplikowane id i klucze __proto__ (osobne testy niżej) */
  });
});

describe('import — przypadki brzegowe (deterministyczne)', () => {
  let TXT: string;
  beforeAll(async () => { await fresh(); store.replaceState(store.migrate(baseRaw())); TXT = J(buildBackup()); });

  test('ucięty plik w 200 miejscach i puste/obce dokumenty → odrzucenie (SyntaxError albo „bad state”), dane bez zmian', () => {
    const before = J(strip(store.getState()));
    for (let i = 0; i < 200; i++) { const cut = TXT.slice(0, Math.floor(TXT.length * i / 200)); expect(() => parseBackup(cut)).toThrow(); try { parseBackup(cut); } catch (e) { expect(rejection(e, cut)).toBeNull(); } }
    for (const x of ['', ' ', 'null', '[]', '42', '"x"', '{}', '{"format":"trening-backup"}', '{"format":"trening-backup","state":null}', '{"exercises":{},"templates":[]}', '{"exercises":[],"templates":{}}', '﻿', '{"format":"trening-recovery","state":"{zepsute"}'])
      try { parseBackup(x); throw new Error('przyjęto: ' + x); } catch (e) { expect({ x, r: rejection(e, x) }).toEqual({ x, r: null }); }
    expect(J(strip(store.getState()))).toBe(before);
  });

  test('schemat z przyszłości (w kopercie, w stanie, tekstem, 1e400) → komunikat „Plik ma schemat …” z numerem tej wersji', () => {
    const st = JSON.parse(TXT).state;
    for (const [doc, a] of [[{ format: 'trening-backup', schemaVersion: SCHEMA_VERSION + 1, state: st }, SCHEMA_VERSION + 1], [{ ...st, schemaVersion: 99 }, 99], [{ format: 'trening-backup', schemaVersion: String(SCHEMA_VERSION + 1), state: st }, SCHEMA_VERSION + 1] /* audyt 0.10 A1: „przyszły” = bieżący + 1, nie stała */, [{ format: 'trening-backup', schemaVersion: 1, state: { ...st, schemaVersion: 1e6 } }, 1e6]] as const)
      expect(() => parseBackup(J(doc))).toThrow(t('Plik ma schemat {a}, a ta wersja obsługuje do {b}. Zaktualizuj aplikację.', { a, b: SCHEMA_VERSION }));
    expect(() => parseBackup(TXT.replace(`"schemaVersion":${SCHEMA_VERSION}`, '"schemaVersion":1e400'))).toThrow(/^Plik ma schemat/);
    /* nieczytelny numer (tekst, ujemny, NaN tekstem) = dane starsze — import przechodzi, jak goły stan web 0.3 */
    for (const v of ['abc', -5, 'NaN', null, {}]) { const r = parseBackup(J({ format: 'trening-backup', schemaVersion: v, state: { ...st, schemaVersion: v } })); expect(stateProblems(r)).toEqual([]); }
  });

  /* Uwaga (nie błąd): migrate nie ma białej listy pól (poza sprzętem miejsc), więc obcy klucz z pliku — także „__proto__” — zostaje w obiekcie jako
   * martwe WŁASNE pole (JSON.parse nie ustawia prototypu). Test pilnuje, że jest nieszkodliwe: brak zatrucia Object.prototype, brak obcego
   * prototypu w żadnym obiekcie stanu (pola opcjonalne — lib, archived, impl, hinted… — nie są dziedziczone), wartości czytane przez aplikację
   * poprawne, a eksport → import, powielenie szablonu (Object.assign) i trening na tych danych tego nie zmieniają. */
  test('klucze __proto__/constructor/prototype na każdym poziomie: brak zatrucia prototypu, pola opcjonalne nie dziedziczą wartości, aplikacja działa', () => {
    const base = JSON.parse(TXT); const ps = pathsOf(base).filter(p => { const v = getAt(base, p); return v && typeof v === 'object' && !Array.isArray(v); });
    const bad: string[] = []; let n = 0;
    for (const p of [[], ...ps]) for (const k of ['__proto__', 'constructor', 'prototype']) {
      const doc = clone(base); const target = p.length ? getAt(doc, p) : doc; defOwn(target, k, { polluted: 'yes', weight: 1e9, lib: true, archived: true, impl: 'electric', done: false, toString: 'x' });
      let r: State; try { r = parseBackup(J(doc)); } catch (e) { if (rejection(e, '')) bad.push(`${p.join('.')}.${k}: ${(e as Error).message}`); continue; }
      n++; if (polluted()) bad.push(`${p.join('.')}.${k}: zatruty Object.prototype`);
      const probs = stateProblems(r).filter(x => !/^klucz /.test(x)); if (probs.length) bad.push(`${p.join('.') || '(korzeń)'}.${k}: ${probs[0]}`);
      if (r.exercises.some(e => (e as any).polluted || (e.archived && !Object.prototype.hasOwnProperty.call(e, 'archived')))) bad.push(`${p.join('.')}.${k}: odziedziczone pole ćwiczenia`);
      if (k === '__proto__' && p.length === 0) { store.replaceState(r); const d = store.dupTemplate(store.getState().templates[0].id); if (Object.getPrototypeOf(d) !== Object.prototype) bad.push('dupTemplate: obcy prototyp'); }
    }
    expect(n).toBeGreaterThan(100);
    /* Artefakt środowiska testów: babel-jest kompiluje `{ ...a, ...b }` do Object.assign (ustawia prototyp przy kluczu „__proto__”), a bundel
     * aplikacji (Metro + Hermes) zostawia natywny spread — sprawdzone 06.10.2026: `npx expo export --platform ios --no-bytecode --no-minify`
     * ma `...(0, _seed.defaultModules)()` i `...(0, _seed.blankTimer)()` w migrate. Dlatego tylko w Jest dopuszczamy te dwa miejsca (spread w lib/store.ts:
     * settings.modules, timer); test pilnuje, że nigdzie indziej obcy prototyp się nie pojawia. */
    const real = [...new Set(bad.map(l => l.replace(/\.\d+/g, '.N')))].filter(l => !(JEST_SPREAD && /^state\.(settings\.modules|timer)\.__proto__: obcy prototyp obiektu: state\.(settings\.modules|timer)$/.test(l)));
    expect(real).toEqual([]);
  });

  test('unicode, emoji, RTL, zero‑width i bardzo długie nazwy: zostają co do znaku (poza białymi znakami na brzegach); CSV i eksport bez strat', () => {
    const names = ['💪🏽 Przysiad 👨‍👩‍👧', 'تمرين الضغط', 'שכיבות סמיכה', 'A​B‍', '‮odwrócone‬', 'Ząb, "cytat"', 'x'.repeat(500), '=HYPERLINK("x")', '﻿BOM'];
    const raw = JSON.parse(TXT).state; names.forEach((n, i) => raw.exercises.push({ id: 'u' + i, name: n, group: 'inne', equipment: 'inne' }));
    raw.workouts.push({ id: 'wu', startedAt: T0 + 9 * DAY, finishedAt: T0 + 9 * DAY + H, templateName: names[0], note: names[1], exercises: names.map((_, i) => ({ id: 'bu' + i, exerciseId: 'u' + i, sets: [{ id: 'su' + i, weight: 10 + i, reps: 5, done: true, note: names[(i + 1) % names.length] }] })) });
    const r = parseBackup(J(raw)); expect(stateProblems(r)).toEqual([]);
    names.forEach((n, i) => expect(r.exercises.find(e => e.id === 'u' + i)!.name).toBe(n.replace(/\s+/g, ' ').trim()));
    store.replaceState(r); const rows = parseCsvRfc(buildCsv()).filter(x => x[0].startsWith(new Date(T0 + 9 * DAY).getFullYear() + '') && x[1] === names[0]);
    expect(rows.map(x => x[3])).toEqual(names.map(n => { const v = n.replace(/\s+/g, ' ').trim(); return /^[=+\-@\t\r]/.test(v) ? "'" + v : v; }));
    expect(rows.map(x => x[9])).toEqual(names.map((_, i) => { const v = names[(i + 1) % names.length]; return /^[=+\-@\t\r]/.test(v) ? "'" + v : v; }));
    expect(J(strip(parseBackup(J(buildBackup()))))).toBe(J(strip(store.getState())));
  });

  test('10 000 treningów w imporcie: wszystkie zostają, import < 10 s, eksport → import punkt stały', () => {
    const raw = JSON.parse(TXT).state; const sq = raw.exercises.find((e: any) => e.name === 'Back Squat').id;
    raw.workouts = Array.from({ length: 10000 }, (_, i) => ({ id: 'W' + i, startedAt: T0 - i * 6 * H, finishedAt: T0 - i * 6 * H + H, templateName: 'T', note: '', exercises: [{ id: 'B' + i, exerciseId: sq, restSec: 90, sets: [{ id: 'S' + i + 'a', weight: 50 + (i % 50), reps: 5, done: true, kind: 'normal' }, { id: 'S' + i + 'b', weight: 60, reps: 3, done: true, kind: 'normal' }] }] }));
    const txt = J({ format: 'trening-backup', schemaVersion: SCHEMA_VERSION, state: raw });
    let t0 = realNow(); const r = parseBackup(txt); const ms = realNow() - t0;
    expect(r.workouts).toHaveLength(10000); expect(r.workouts.reduce((a, w) => a + w.exercises[0].sets.length, 0)).toBe(20000); expect(ms).toBeLessThan(10000);
    store.replaceState(r); t0 = realNow(); const again = parseBackup(J(buildBackup())); expect(realNow() - t0).toBeLessThan(10000);
    expect(J(strip(again))).toBe(J(strip(store.getState())));
  });
});

/* ---------- zduplikowane identyfikatory w kopii (ręcznie sklejone pliki dwóch kopii, błąd edytora) ----------
 * ZNALEZISKO (06.10.2026, fuzzing importu): migrate (lib/store.ts:218 stamp, :225 ćwiczenia, :291 treningi, :290 gumy; serie — fixSet :271)
 * nadaje id tylko BRAKUJĄCYM i nie rozdziela powtórzonych (wyjątek: miejsca — fixLocations, :179). Po imporcie dwa różne obiekty mają to samo id,
 * a aplikacja szuka i usuwa po id: deleteWorkout (lib/store.ts:1227) kasuje OBA treningi, exById zwraca zawsze pierwsze ćwiczenie (drugiego nie
 * da się otworzyć ani edytować), lista historii ma zduplikowane klucze Reacta. Oczekiwane: id unikalne po imporcie (powtórzone → nowe uid()). */
describe('import — zduplikowane id', () => {
  test('powtórzone id dostają nowe: oba treningi zostają osobno (także po ponownym wczytaniu), id unikalne, migrate idempotentne', async () => {
    const st = await doc(); const w = st.workouts.find((x: any) => x.id === 'w3'); st.workouts.push({ ...clone(w), startedAt: w.startedAt + 7 * DAY, finishedAt: w.finishedAt + 7 * DAY, note: 'drugi trening' });
    const r = parseBackup(J(st)); store.replaceState(r);
    const ws = store.getState().workouts; expect(new Set(ws.map(x => x.id)).size).toBe(ws.length);
    const second = ws.find(x => x.note === 'drugi trening')!; expect(second.id).not.toBe('w3'); expect(ws.some(x => x.id === 'w3' && x.note !== 'drugi trening')).toBe(true); /* pierwsze wystąpienie zachowuje id */
    const sets = ws.flatMap(x => x.exercises.flatMap(e => e.sets.map(z => z.id))); expect(new Set(sets).size).toBe(sets.length);
    const again = store.migrate(JSON.parse(J(store.getState()))); expect(again.workouts.map(x => x.id)).toEqual(ws.map(x => x.id));
  });

  const doc = async () => { await fresh(); store.replaceState(store.migrate(baseRaw())); return clone(store.getState()) as any; };
  test('NAPRAWIONE 06.10 (decyzja właściciela A): kopia z dwoma RÓŻNYMI treningami o tym samym id — usunięcie jednego z historii kasuje oba (lib/store.ts:291, :1227)', async () => {
    const st = await doc(); const w = st.workouts.find((x: any) => x.id === 'w3'); st.workouts.push({ ...clone(w), startedAt: w.startedAt + 7 * DAY, finishedAt: w.finishedAt + 7 * DAY, note: 'drugi trening' });
    store.replaceState(parseBackup(J(st))); const n = store.getState().workouts.length; expect(n).toBe(4);
    store.deleteWorkout(store.getState().workouts.find(x => x.note === 'drugi trening')!.id);
    expect(store.getState().workouts.map(x => x.note)).toContain('notatka, "z" cudzysłowem'); /* pierwszy trening w3 zostaje */
    expect(store.getState().workouts).toHaveLength(n - 1);
  });
  test('NAPRAWIONE 06.10 (decyzja właściciela A): kopia z dwoma RÓŻNYMI ćwiczeniami (i gumami) o tym samym id — drugie nieosiągalne po id (lib/store.ts:218, :225, :290)', async () => {
    const st = await doc(); st.exercises.push({ ...clone(st.exercises.find((e: any) => e.id === 'cx')), name: 'Inne własne' }); st.bands.push({ ...clone(st.bands[0]), color: 'zielona' });
    const r = parseBackup(J(st)); store.replaceState(r);
    expect(store.getState().exercises.map(e => store.exById(e.id)?.name)).toEqual(store.getState().exercises.map(e => e.name));
    expect(store.getState().bands.map(b => store.bandById(b.id)?.color)).toEqual(store.getState().bands.map(b => b.color));
  });
  test('NAPRAWIONE 06.10 (decyzja właściciela A): ekran Historii na kopii ze zduplikowanym id treningu — zduplikowane klucze listy (console.error Reacta)', async () => {
    const st = await doc(); const w = st.workouts.find((x: any) => x.id === 'w3'); st.workouts.push({ ...clone(w), startedAt: w.startedAt + 7 * DAY, finishedAt: w.finishedAt + 7 * DAY, note: 'drugi trening' });
    const errs: string[] = []; const spy = jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { if (!/not wrapped in act/.test(String(a[0]))) errs.push(String(a[0]).slice(0, 120)); });
    try { await renderApp({ saved: parseBackup(J(st)) }); await flushAll(50); await go('/history'); await flushAll(50); } finally { spy.mockRestore(); }
    expect(errs).toEqual([]);
  });
});

/* ---------- CSV ---------- */
describe('CSV — losowe stany (fast-check)', () => {
  const textArb = fc.oneof(fc.string({ maxLength: 12 }), fc.fullUnicodeString({ maxLength: 8 }), fc.constantFrom('a,b', 'say "hi"', 'l1\nl2', 'l1\r\nl2', '😀💪🏽', '=1+1', '-5', '+x', '@y', '\ttab', 'שלום', '', ' ', '""', ',', '\n'));
  const setArb = fc.record({ weight: fc.integer({ min: 0, max: 30000 }).map(n => n / 100), reps: fc.integer({ min: 0, max: 50 }), done: fc.boolean(), kind: fc.constantFrom('normal', 'warmup', 'drop', 'failure'), note: textArb, rpe: fc.oneof(fc.constant(''), fc.integer({ min: 0, max: 10 })) });
  const wArb = fc.record({ name: textArb, note: textArb, blocks: fc.array(fc.record({ ex: fc.nat(3), sets: fc.array(setArb, { minLength: 1, maxLength: 4 }) }), { minLength: 1, maxLength: 3 }) });
  test('plik wraca z parsera RFC 4180: nagłówek, 12 kolumn, wiersz na każdą odhaczoną serię, ciężar w jednostce, ochrona formuł, BOM', async () => {
    await fresh();
    await fc.assert(fc.asyncProperty(fc.array(fc.fullUnicodeString({ minLength: 1, maxLength: 10 }), { minLength: 4, maxLength: 4 }), fc.array(wArb, { minLength: 1, maxLength: 5 }), fc.constantFrom('kg', 'lb'), async (exNames, ws, unit) => {
      const raw: any = seedState('pl'); raw.exercises = exNames.map((n, i) => ({ id: 'E' + i, name: n + ' ' + i, group: 'inne', equipment: i === 3 ? 'masa ciała' : 'sztanga', metric: 'weight_reps' }));
      raw.settings.unit = unit;
      raw.workouts = ws.map((w, wi) => ({ id: 'W' + wi, startedAt: T0 + wi * DAY, finishedAt: T0 + wi * DAY + 30 * 60e3, templateName: w.name, note: w.note, exercises: w.blocks.map((b, bi) => ({ id: `B${wi}_${bi}`, exerciseId: 'E' + b.ex, sets: b.sets.map((s, si) => ({ id: `S${wi}_${bi}_${si}`, ...(b.ex === 3 ? { addKg: s.weight, weight: '' } : { weight: s.weight }), reps: s.reps, done: s.done, kind: s.kind, warmup: s.kind === 'warmup', note: s.note, rpe: s.rpe })) })) }));
      store.replaceState(raw); const st = store.getState();
      const csvTxt = buildCsv(); const rows = parseCsvRfc(csvTxt);
      expect(rows[0]).toEqual(['Date', 'Workout Name', 'Duration', 'Exercise Name', 'Set Order', 'Weight', 'Reps', 'Distance', 'Seconds', 'Notes', 'Workout Notes', 'RPE']);
      const want: string[][] = []; const guard = (v: string) => /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
      for (const w of [...st.workouts].sort((a, b) => a.startedAt - b.startedAt)) for (const e of w.exercises) { let n = 0; const ex = st.exercises.find(x => x.id === e.exerciseId)!; for (const s of e.sets) {
        const W = s.kind === 'warmup'; const mark = W ? 'W' : s.kind === 'drop' ? 'D' : s.kind === 'failure' ? 'F' : ''; if (!mark) n++; /* LOG-14 (audyt 0.10): D/F jak w popularnych dziennikach, numer tylko zwykłych serii */ const kg = ex.equipment === 'masa ciała' ? Number(s.addKg || 0) : Number(s.weight || 0);
        const shown = unit === 'lb' ? Math.sign(kg) * Math.round(Math.abs(kg) / KG_PER_LB * 10) / 10 : Math.round(kg * 100) / 100;
        const notes = [s.note].filter(Boolean).join('; '); /* LOG-14: typ serii w Set Order, nie w Notes */
        want.push([guard(w.templateName || t('Trening')), '30m', guard(ex.name), mark || String(n), String(shown + 0), String(s.reps || 0), '0', '0', guard(notes), guard(w.note), s.rpe === '' ? '' : String(s.rpe)]); } }
      expect(rows.length - 1).toBe(st.workouts.reduce((a, w) => a + w.exercises.reduce((b, e) => b + e.sets.filter(x => x.done).length, 0), 0));
      expect(rows.slice(1).every(r => r.length === 12 && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(r[0]))).toBe(true);
      expect(rows.slice(1).map(r => r.slice(1))).toEqual(want);
      (FileSystem.writeAsStringAsync as jest.Mock).mockClear(); await exportCsv();
      const written = (FileSystem.writeAsStringAsync as jest.Mock).mock.calls[0][1] as string; expect(written.startsWith(CSV_BOM)).toBe(true); expect(written.slice(1)).toBe(csvTxt);
    }), { numRuns: Number(process.env.CSV_RUNS || 150), seed: SEED });
  });
});

/* ---------- awarie zapisu ---------- */
describe('awarie zapisu (global.__dbFail) — po restarcie stan w całości stary albo nowy', () => {
  afterEach(() => { global.__dbFail = false; });
  const restart = async () => { global.__dbFail = false; store.__resetForTests(); await store.init(); return strip(store.getState()); };
  /** Stan po ponownym starcie (bez „live” — ten trzyma tylko trening w toku i zegar, porównujemy je osobno). */
  const core = (s: any) => { const c = clone(s); return J({ ...c, active: c.active?.id ?? null, timer: null }); };

  test('losowe awarie k‑tego zapisu podczas zmiany ustawień, importu i resetu', async () => {
    await fc.assert(fc.asyncProperty(fc.constantFrom('save', 'import', 'reset'), fc.array(fc.boolean(), { minLength: 1, maxLength: 6 }), fc.constantFrom('state', 'live', 'any'), async (op, fails, which) => {
      await fresh(); store.replaceState(store.migrate(baseRaw())); await store.flush(); const before = strip(store.getState());
      let i = 0; global.__dbFail = ((k: string) => (which === 'any' || k === which) && !!fails[i++ % fails.length]) as any;
      if (op === 'save') { store.getState().settings.defaultRest = 77; store.getState().templates[0].name = 'Zmieniony'; store.save(); }
      if (op === 'import') { const next = parseBackup(J({ ...seedState('pl'), templates: [{ id: 'TT', name: 'Z importu', items: [] }] })); store.replaceState(next); }
      if (op === 'reset') store.resetAll();
      const after = strip(store.getState());
      await store.flush(); await store.flush();
      const failedAll = fails.every(Boolean) && which !== 'live';
      if (failedAll) expect(store.getPersistError()).toBeTruthy();
      const got = await restart();
      /* zawsze dokładnie jeden z dwóch stanów — bez mieszanki (np. historia stara, ustawienia nowe) */
      const okOld = core(got) === core(before), okNew = core(got) === core(after);
      expect({ op, which, fails, okOld, okNew }).toEqual({ op, which, fails, okOld: okOld, okNew: !okOld });
      expect(stateProblems(store.getState())).toEqual([]);
      /* po naprawie bazy kolejny zapis utrwala bieżący stan */
      store.save(); await store.flush(); expect(store.getPersistError()).toBeNull();
    }), { numRuns: 60, seed: SEED });
  });

  test('import przy niedziałającej kopii bezpieczeństwa (pełny dysk w Plikach) → przerwany z komunikatem, dane bez zmian, nic nie zapisane', async () => {
    await fresh(); store.replaceState(store.migrate(baseRaw())); await store.flush(); const before = J(strip(store.getState())); const kv = new Map(global.__kv);
    (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValueOnce({ canceled: false, assets: [{ uri: 'file:///x.json' }] });
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValueOnce(J(seedState('pl')));
    (FileSystem.writeAsStringAsync as jest.Mock).mockRejectedValueOnce(new Error('ENOSPC'));
    await expect(importBackup()).rejects.toThrow(t('Nie udało się zapisać kopii bezpieczeństwa w Plikach — dane nie zostały zmienione.'));
    expect(J(strip(store.getState()))).toBe(before); expect(global.__kv.get('state')).toBe(kv.get('state'));
  });

  test('import uszkodzonego pliku przez importBackup → wyjątek przed kopią bezpieczeństwa i przed zmianą danych', async () => {
    await fresh(); store.replaceState(store.migrate(baseRaw())); await store.flush(); const before = J(strip(store.getState()));
    (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValueOnce({ canceled: false, assets: [{ uri: 'file:///x.json' }] });
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValueOnce('{"format":"trening-backup","state":{"exercises":[');
    (FileSystem.writeAsStringAsync as jest.Mock).mockClear();
    await expect(importBackup()).rejects.toThrow(SyntaxError);
    expect((FileSystem.writeAsStringAsync as jest.Mock).mock.calls.length).toBe(0); expect(J(strip(store.getState()))).toBe(before);
  });

  test('zapis „state” udany, „live” nieudany w trakcie treningu → po restarcie trening w toku z ostatniego udanego zapisu, historia cała', async () => {
    await fresh(); store.replaceState(store.migrate(baseRaw())); await store.flush();
    const hist = J(store.getState().workouts); const a = store.getState().active!; const s0 = J(a.exercises[0].sets);
    global.__dbFail = ((k: string) => k === 'live') as any; a.exercises[0].sets[1].reps = 3; store.save(a); await store.flush();
    expect(store.getPersistError()).toBeTruthy();
    const st = await (async () => { global.__dbFail = false; store.__resetForTests(); await store.init(); return store.getState(); })();
    expect(J(st.workouts)).toBe(hist); expect(st.active!.id).toBe(a.id);
    expect(J(st.active!.exercises[0].sets)).toBe(s0); /* ostatni UDANY zapis — bez wpisu „3”, ale też bez utraty czegokolwiek wcześniej */
    expect(stateProblems(st)).toEqual([]);
  });
});

/* ---------- rozmiar i wydajność: 5 lat codziennych treningów ---------- */
describe('5 lat codziennych treningów (~1830) — budżet czasu', () => {
  const N = 5 * 366; let ids: string[] = [];
  beforeAll(async () => {
    await fresh(); const st = store.getState(); const names = ['Back Squat', 'Bench Press (sztanga)', 'Bent Over Row (sztanga)', 'Pull Up', 'Plank', 'Bench Press (hantle)'];
    ids = names.map(n => st.exercises.find(e => e.name === n)!.id); const t0 = Date.now() - (N + 1) * DAY;
    for (let i = 0; i < N; i++) { const at = t0 + i * DAY;
      st.workouts.push({ id: `w${i}`, ownerId: 'local', createdAt: at, updatedAt: at, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'Dzień ' + (i % 3), startedAt: at, finishedAt: at + H, note: '', exercises: ids.map((id, k) => ({ id: `e${i}_${k}`, exerciseId: id, restSec: 90, repMin: null, repMax: null, groupId: null,
        sets: Array.from({ length: 4 }, (_, j) => ({ id: `s${i}_${k}_${j}`, weight: k === 3 || k === 4 ? '' : 40 + (i % 60) + j * 2.5, reps: k === 4 ? '' : 5 + (j % 3), durationSec: k === 4 ? 30 + (i % 40) : '', distanceM: '', rpe: '', bandId: '', addKg: k === 3 ? (i % 15) : '', kind: j === 0 ? 'warmup' : 'normal', warmup: j === 0, note: '', done: true, completedAt: at + (k * 4 + j) * 60e3, actualRest: 90 } as WSet)) })) });
    }
    store.save(); await store.flush();
  });
  const budget = (label: string, f: () => unknown, ms = 2000) => { store.save(); /* zimny cache */ const t0 = realNow(); f(); const d = realNow() - t0; expect({ label, ok: d < ms, d: Math.round(d) }).toMatchObject({ label, ok: true }); return d; };

  test('start (JSON.parse + migracja), statystyki, rekordy, sumy tygodniowe, PR, CSV, eksport → import — każde < 2 s (Jest, Node)', () => {
    const raw = global.__kv.get('state')!; expect(raw.length).toBeGreaterThan(5e6);
    budget('start: parse + migrate', () => store.migrate(JSON.parse(raw)), 4000);
    budget('zakończone treningi (lista historii)', () => store.finishedWorkouts());
    for (const id of ids) budget('postępy: sesje + rekordy ' + id, () => { const e = store.exById(id)!; stats.sessionsFor(e); stats.recordsFor(e); });
    budget('sumy tygodniowe (52 tyg.)', () => stats.weeklyTotals(52));
    budget('PR najnowszego treningu', () => stats.prMap(store.finishedWorkouts()[0]));
    budget('PR 100 treningów historii (ciepły cache)', () => { for (const w of store.finishedWorkouts().slice(0, 100)) stats.prMap(w); });
    budget('CSV', () => buildCsv(), 4000);
    budget('eksport → import', () => parseBackup(J(buildBackup())), 6000);
    const e = store.exById(ids[0])!; expect(stats.sessionsFor(e)).toHaveLength(N); expect(stats.recordsFor(e).maxLoad).toBe(40 + 59 + 3 * 2.5);
  });

  test('ekrany na dużej historii: start aplikacji, Historia, Postępy — każdy render < 8 s (Jest + react-test-renderer)', async () => {
    const snapshot = clone(store.getState());
    let t0 = realNow(); await renderApp({ saved: snapshot }); await flushAll(50); const dStart = realNow() - t0;
    expect(store.getState().workouts).toHaveLength(N);
    t0 = realNow(); await go('/history'); await flushAll(50); const dHist = realNow() - t0; expect(screen.queryAllByText(/Dzień 0/).length).toBeGreaterThan(0);
    t0 = realNow(); await go('/more/progress?ex=' + ids[0]); await flushAll(50); const dProg = realNow() - t0;
    expect({ dStart: dStart < 8000, dHist: dHist < 8000, dProg: dProg < 8000, ms: [dStart, dHist, dProg].map(Math.round) }).toMatchObject({ dStart: true, dHist: true, dProg: true });
  });
});

/* ---------- start aplikacji na stanach przyjętych z fuzzingu ---------- */
describe('aplikacja na danych z popsutych kopii (po sanityzacji)', () => {
  test('25 stanów z fuzzingu: start, trening w toku, historia, szczegóły treningu, postępy, szablony, ćwiczenia — bez wyjątku i bez console.error', async () => {
    expect(SAMPLES.length).toBeGreaterThanOrEqual(20);
    const errs: string[] = []; const spy = jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { if (!/not wrapped in act/.test(String(a[0]))) errs.push(String(a[0]).slice(0, 200)); });
    try {
      for (const [i, raw] of SAMPLES.entries()) {
        await renderApp({ saved: raw }); await flushAll(50); expect({ i, recovery: store.getRecovery() }).toEqual({ i, recovery: null });
        const st = store.getState(); const w = st.workouts[0]; const ex = st.exercises.find(e => st.workouts.some(x => x.exercises.some(b => b.exerciseId === e.id)));
        for (const href of ['/history', ...(w ? [`/history/${w.id}`] : []), ...(ex ? [`/more/progress?ex=${ex.id}`, `/exercise/${ex.id}`] : []), '/templates', ...(st.templates[0] ? [`/template/${st.templates[0].id}`] : []), '/exercises', '/more/locations', '/more/bands'])
          { await go(href); await flushAll(30); expect({ i, href, ok: !!screen.toJSON() }).toEqual({ i, href, ok: true }); }
      }
    } finally { spy.mockRestore(); }
    expect([...new Set(errs)]).toEqual([]);
  });
});
