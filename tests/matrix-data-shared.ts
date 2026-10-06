/*
 * Wspólne narzędzia testów danych (tests/matrix-migrations.test.tsx, tests/matrix-data-fuzz.test.ts):
 *  - checkState: pełny niezmiennik POPRAWNEGO stanu po migracji/imporcie — typy i zakresy KAŻDEGO pola, które czyta aplikacja,
 *    unikalność i spójność identyfikatorów, brak NaN/Infinity, brak obcych prototypów (zatrucie prototypu z importu),
 *  - strip: stan bez pól zapisu (metaUpdatedAt, saveSeq, userTouched) — do porównań „przed/po”,
 *  - parseCsvRfc: parser CSV zgodny z RFC 4180 (cudzysłowy, "" w polu, przecinki, CR/LF w polu) — niezależny od lib/backup.
 */
import { SCHEMA_VERSION, METRICS, SET_KINDS, GROUPS, IMPLS, MODULES, type State } from '@/lib/seed';
import { LANGS } from '@/lib/i18n';

export const J = (x: unknown) => JSON.stringify(x);
export const clone = <T>(x: T): T => JSON.parse(J(x));
/** Ćwiczenia dopisane przez migrację (katalog 04.10.2026) mają losowe id i czas — do porównań zastępujemy je nazwą. */
export const canonCatalog = (s: any, keep: ReadonlySet<string>) => { for (const e of s.exercises ?? []) if (!keep.has(e.id)) { e.id = 'katalog:' + e.name; e.createdAt = 0; e.updatedAt = 0; } return s; };
export const strip = (s: unknown, touched = true) => { const c = clone(s) as any; delete c.metaUpdatedAt; delete c.saveSeq; if (touched) delete c.userTouched; return c; };

const SET_NUM = ['weight', 'reps', 'durationSec', 'distanceM', 'rpe', 'addKg'] as const;
const EQUIP = ['hantle', 'sztanga', 'masa ciała', 'maszyna', 'linki', 'inne'];
const LOAD_MODES = ['per_dumbbell', 'total', 'unilateral'];

/** Zwraca listę naruszeń (pusta = stan poprawny). `where` trafia do komunikatu. */
export function stateProblems(st: State): string[] {
  const bad: string[] = []; const ok = (c: unknown, msg: string, data?: unknown) => { if (!c) bad.push(msg + (data !== undefined ? ' ' + J(data).slice(0, 300) : '')); };
  const fin = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
  const numOrEmpty = (v: unknown) => v === '' || fin(v);
  const isId = (v: unknown) => typeof v === 'string' && v.length > 0;
  const uniq = (what: string, ids: string[]) => { const s = new Set(ids); ok(s.size === ids.length, `zduplikowane id: ${what}`, ids.filter((x, i) => ids.indexOf(x) !== i).slice(0, 5)); };

  /* 1. cała struktura: tylko zwykłe obiekty i tablice, liczby skończone, bez undefined w tablicach, bez kluczy zatruwających prototyp */
  const walk = (x: unknown, path: string, depth: number) => {
    if (depth > 40) { bad.push('za głęboko: ' + path); return; }
    if (typeof x === 'number') { if (!Number.isFinite(x)) bad.push(`liczba nieskończona/NaN: ${path}`); return; }
    if (x === null || typeof x !== 'object') { if (typeof x === 'function' || typeof x === 'symbol' || typeof x === 'bigint') bad.push(`typ ${typeof x}: ${path}`); return; }
    const proto = Object.getPrototypeOf(x);
    if (Array.isArray(x)) { if (proto !== Array.prototype) bad.push('obcy prototyp tablicy: ' + path); x.forEach((v, i) => { if (v === undefined) bad.push(`undefined w tablicy: ${path}[${i}]`); walk(v, `${path}[${i}]`, depth + 1); }); return; }
    if (proto !== Object.prototype) bad.push('obcy prototyp obiektu: ' + path);
    for (const k of Object.keys(x)) { if (k === '__proto__' || k === 'constructor' || k === 'prototype') { bad.push(`klucz ${k}: ${path}`); continue; /* martwe pole spoza schematu — treści nie oceniamy */ } walk((x as any)[k], `${path}.${k}`, depth + 1); }
  };
  walk(st, 'state', 0);

  ok(st.schemaVersion === SCHEMA_VERSION, 'schemaVersion', st.schemaVersion);
  ok(isId(st.ownerId), 'ownerId');
  for (const k of ['exercises', 'templates', 'workouts', 'bands', 'mornings', 'relations', 'feedback', 'instructions'] as const) ok(Array.isArray(st[k]), `${k} nie jest tablicą`);
  if (bad.length) return bad;

  /* 2. ustawienia */
  const s = st.settings; ok(s && typeof s === 'object', 'settings');
  ok(Number.isInteger(s.defaultRest) && s.defaultRest >= 0 && s.defaultRest <= 1800, 'settings.defaultRest', s.defaultRest);
  for (const k of ['sound', 'wakeLock', 'showRpe', 'healthSync', 'progressHint', 'autoBackup', 'weighReminder', 'pickerShowAll'] as const) ok(typeof s[k] === 'boolean', `settings.${k}`, s[k]);
  ok(s.unit === 'kg' || s.unit === 'lb', 'settings.unit', s.unit); ok(['light', 'dark', 'auto'].includes(s.theme), 'settings.theme', s.theme);
  ok(s.language === 'auto' || (LANGS as readonly string[]).includes(s.language), 'settings.language', s.language);
  ok(MODULES.every(m => typeof s.modules[m] === 'boolean') && s.modules.training === true, 'settings.modules', s.modules);
  ok(Array.isArray(s.locations), 'settings.locations');
  uniq('miejsca', s.locations.map(l => l.id));
  for (const l of s.locations) { ok(isId(l.id) && typeof l.name === 'string' && l.name.trim() === l.name && l.name.length > 0, 'miejsce: id/nazwa', l.name); ok(Array.isArray(l.equipment) && new Set(l.equipment.map(e => e.item)).size === l.equipment.length, 'miejsce: sprzęt (powtórzenia)', l.equipment.map(e => e.item)); for (const e of l.equipment) ok(Array.isArray(e.opts) && e.opts.every(o => typeof o === 'string'), 'miejsce: opcje', e); }
  ok(s.locations.length ? s.locations.some(l => l.id === s.mainLocationId) : s.mainLocationId === null, 'mainLocationId', s.mainLocationId);

  /* 3. ćwiczenia */
  uniq('ćwiczenia', st.exercises.map(e => e.id));
  for (const e of st.exercises) {
    ok(isId(e.id) && typeof e.ownerId === 'string' && fin(e.createdAt) && fin(e.updatedAt), 'ćwiczenie: Base', e.id);
    ok(typeof e.name === 'string' && e.name.length > 0 && e.name === e.name.replace(/\s+/g, ' ').trim(), 'ćwiczenie: nazwa', e.name);
    ok((METRICS as readonly string[]).includes(e.metric), 'ćwiczenie: metric', e.metric); ok(LOAD_MODES.includes(e.loadMode), 'ćwiczenie: loadMode', e.loadMode);
    ok((GROUPS as readonly string[]).includes(e.group), 'ćwiczenie: group', e.group); ok(EQUIP.includes(e.equipment), 'ćwiczenie: equipment', e.equipment);
    for (const k of ['restSec', 'restWarmupSec'] as const) ok(e[k] === null || (Number.isInteger(e[k]) && e[k]! >= 0 && e[k]! <= 1800), `ćwiczenie: ${k}`, e[k]);
    ok(Array.isArray(e.muscles) && e.muscles.every(m => typeof m === 'string') && Array.isArray(e.secondaryMuscles) && e.secondaryMuscles.every(m => typeof m === 'string'), 'ćwiczenie: mięśnie', e.name);
    ok(typeof e.bandAssistable === 'boolean' && typeof e.tempo === 'string' && typeof e.notes === 'string', 'ćwiczenie: bandAssistable/tempo/notes', e.name);
    ok(e.lib === undefined || e.lib === true, 'ćwiczenie: lib', e.lib); ok(e.archived === undefined || e.archived === true, 'ćwiczenie: archived', e.archived);
    ok(Array.isArray(e.requires) && e.requires.every(g => Array.isArray(g) && g.length > 0 && g.every(x => typeof x === 'string')), 'ćwiczenie: requires', e.requires);
    ok(e.recommended === undefined || (Array.isArray(e.recommended) && e.recommended.every(x => typeof x === 'string')), 'ćwiczenie: recommended', e.recommended);
    ok(!('bodyweightPct' in e), 'ćwiczenie: bodyweightPct (usunięte w 13)');
  }
  const exIds = new Set(st.exercises.map(e => e.id)); const liveEx = new Set(st.exercises.filter(e => !e.archived).map(e => e.id)); const bandIds = new Set(st.bands.map(b => b.id));

  /* 4. gumy */
  uniq('gumy', st.bands.map(b => b.id));
  for (const b of st.bands) { ok(isId(b.id) && typeof b.color === 'string' && b.color.length > 0 && Number.isInteger(b.level) && b.level >= 1 && b.level <= 7, 'guma', b); ok(!('nominalKg' in b), 'guma: nominalKg'); }

  /* 5. szablony */
  uniq('szablony', st.templates.map(t => t.id)); uniq('pozycje szablonów', st.templates.flatMap(t => t.items.map(i => i.id)));
  for (const t of st.templates) {
    ok(typeof t.name === 'string' && t.name.length > 0 && t.name === t.name.replace(/\s+/g, ' ').trim(), 'szablon: nazwa', t.name);
    ok(t.locationId === undefined || isId(t.locationId), 'szablon: locationId', t.locationId);
    for (const it of t.items) {
      ok(isId(it.id) && liveEx.has(it.exerciseId), 'pozycja szablonu: brakujące/usunięte ćwiczenie', it.exerciseId);
      ok(Number.isInteger(it.sets) && it.sets >= 1 && it.sets <= 50, 'pozycja szablonu: sets', it.sets);
      for (const k of ['repMin', 'repMax'] as const) ok(it[k] === null || (Number.isInteger(it[k]) && it[k]! >= 1 && it[k]! <= 100), `pozycja: ${k}`, it[k]);
      ok(it.restSec === null || (Number.isInteger(it.restSec) && it.restSec >= 0 && it.restSec <= 1800), 'pozycja: restSec', it.restSec);
      ok(numOrEmpty(it.startWeight) && numOrEmpty(it.targetSec), 'pozycja: startWeight/targetSec', [it.startWeight, it.targetSec]);
      ok(it.groupId === null || isId(it.groupId), 'pozycja: groupId', it.groupId);
      for (const a of it.alternates ?? []) ok(isId(a.locationId) && liveEx.has(a.exerciseId) && (a.restSec === null || (Number.isInteger(a.restSec) && a.restSec >= 0 && a.restSec <= 1800)) && (a.impl === undefined || (IMPLS as readonly string[]).includes(a.impl)), 'zamiennik', a);
      ok(new Set((it.alternates ?? []).map(a => a.locationId)).size === (it.alternates ?? []).length, 'dwa zamienniki dla jednego miejsca', it.alternates);
      if (it.rows) { ok(it.rows.length >= 1 && it.rows.length <= 50 && it.rows.length === it.sets, 'wiersze ↔ sets', it); uniq('wiersze pozycji szablonu', it.rows.map(r => r.id)); for (const r of it.rows) ok(isId(r.id) && (SET_KINDS as readonly string[]).includes(r.kind) && numOrEmpty(r.reps) && numOrEmpty(r.weight) && numOrEmpty(r.durationSec) && numOrEmpty(r.distanceM), 'wiersz szablonu', r); }
    }
  }

  /* 6. treningi i serie */
  const all = [...st.workouts, ...(st.active ? [st.active] : [])];
  uniq('treningi', all.map(w => w.id)); uniq('bloki', all.flatMap(w => w.exercises.map(e => e.id))); uniq('serie', all.flatMap(w => w.exercises.flatMap(e => e.sets.map(x => x.id))));
  for (const w of all) {
    const live = w === st.active;
    ok(isId(w.id) && fin(w.startedAt) && fin(w.createdAt) && fin(w.updatedAt) && typeof w.templateName === 'string' && typeof w.note === 'string' && (w.templateId === null || isId(w.templateId)), 'trening: pola', w.id);
    ok(live ? w.finishedAt === null : fin(w.finishedAt) && w.finishedAt! >= w.startedAt, 'trening: finishedAt', [w.startedAt, w.finishedAt]);
    ok(!live || w.staleAck === undefined || fin(w.staleAck), 'trening: staleAck'); ok(live || w.staleAck === undefined, 'historia ze staleAck');
    ok(!('bodyWeightKg' in w), 'trening: bodyWeightKg (usunięte w 13)');
    ok(live || w.exercises.length > 0, 'pusty trening w historii', w.id);
    for (const e of w.exercises) {
      ok(isId(e.id) && isId(e.exerciseId), 'blok: id/exerciseId', e.id);
      /* brak ćwiczenia jest dozwolony: historia pokazuje „?” (T4b, także CSV), trening w toku — blok „Usunięte ćwiczenie” z przyciskiem usuń
       * (components/ActiveWorkout.tsx); że ekrany to znoszą, sprawdza start aplikacji na stanach z fuzzingu (tests/matrix-data-fuzz.test.ts) */
      void exIds;
      ok(Number.isInteger(e.restSec) && e.restSec >= 0 && e.restSec <= 1800, 'blok: restSec', e.restSec);
      ok(e.impl === undefined || (IMPLS as readonly string[]).includes(e.impl), 'blok: impl', e.impl); ok(!e.implPinned || (e.implPinned === true && !!e.impl), 'blok: implPinned', e);
      ok(e.swappedFrom === undefined || (isId(e.swappedFrom) && e.swappedFrom !== e.exerciseId), 'blok: swappedFrom', e.swappedFrom);
      ok(live || (e.splitFrom === undefined && e.altSkip === undefined), 'historia: splitFrom/altSkip');
      ok(live || e.sets.length > 0, 'historia: blok bez serii');
      for (const x of e.sets) {
        ok(isId(x.id), 'seria: id');
        for (const k of SET_NUM) ok(numOrEmpty(x[k]), `seria: ${k}`, x[k]);
        ok(x.weight === '' || (x.weight as number) >= 0, 'seria: weight < 0', x.weight); ok(x.reps === '' || (Number.isInteger(x.reps) && (x.reps as number) >= 0), 'seria: reps', x.reps);
        ok(x.rpe === '' || ((x.rpe as number) >= 0 && (x.rpe as number) <= 10), 'seria: rpe', x.rpe); ok(x.durationSec === '' || ((x.durationSec as number) >= 0 && (x.durationSec as number) <= 86400), 'seria: durationSec', x.durationSec);
        ok(x.distanceM === '' || (x.distanceM as number) >= 0, 'seria: distanceM', x.distanceM);
        for (const k of ['weight', 'addKg'] as const) ok(x[k] === '' || Math.abs((x[k] as number) * 100 - Math.round((x[k] as number) * 100)) < 1e-6, `seria: ${k} poza siatką 0,01 kg`, x[k]);
        ok((SET_KINDS as readonly string[]).includes(x.kind) && x.warmup === (x.kind === 'warmup'), 'seria: kind/warmup', [x.kind, x.warmup]);
        ok(typeof x.done === 'boolean' && typeof x.note === 'string' && typeof x.bandId === 'string', 'seria: done/note/bandId', x);
        ok(x.completedAt === null || fin(x.completedAt), 'seria: completedAt', x.completedAt); ok(x.actualRest === null || (Number.isInteger(x.actualRest) && x.actualRest >= 0 && x.actualRest <= 3600), 'seria: actualRest', x.actualRest);
        ok(live || x.done, 'historia: nieodhaczona seria'); ok(live || x.pre === undefined, 'historia: pre');
        void bandIds;
      }
    }
  }

  /* 7. poranki, zegar */
  ok(new Set(st.mornings.map(m => m.date)).size === st.mornings.length, 'poranki: dwa wpisy z jednego dnia');
  for (const m of st.mornings) { ok(/^\d{4}-\d{2}-\d{2}$/.test(m.date), 'poranek: data', m.date); for (const k of ['bb', 'sleepScore', 'sleepH', 'weight'] as const) ok(numOrEmpty(m[k]) && (m[k] === '' || (m[k] as number) >= 0), `poranek: ${k}`, m[k]); }
  const T = st.timer; ok(T && (T.restEndAt === null || fin(T.restEndAt)) && (T.setStartAt === null || fin(T.setStartAt)) && Number.isInteger(T.restTotal) && Number.isInteger(T.setTarget) && (T.restSetId === null || typeof T.restSetId === 'string') && (T.setId === null || typeof T.setId === 'string'), 'timer', T);
  return bad;
}

/** Parser CSV wg RFC 4180 (pole w cudzysłowie może mieć przecinki, "" i CR/LF). Wiersze rozdziela LF albo CRLF poza cudzysłowem. */
export function parseCsvRfc(txt: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let f = ''; let q = false; let i = 0;
  while (i < txt.length) { const c = txt[i];
    if (q) { if (c === '"') { if (txt[i + 1] === '"') { f += '"'; i += 2; continue; } q = false; i++; continue; } f += c; i++; continue; }
    if (c === '"' && f === '') { q = true; i++; continue; }
    if (c === ',') { row.push(f); f = ''; i++; continue; }
    if (c === '\r' && txt[i + 1] === '\n') { i++; continue; }
    if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; i++; continue; }
    f += c; i++; }
  if (q) throw new Error('CSV: niezamknięty cudzysłów');
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  return rows;
}
