/*
 * Import historii z plików CSV popularnych dzienników treningowych (decyzja właściciela 11.10.2026; docs/21, sekcja „Import CSV”).
 * Ten plik jest CZYSTY (bez odczytu pliku i bez zapisu stanu): parser, dopasowanie ćwiczeń i zbudowanie treningów do dopisania.
 * Zapis (kopia bezpieczeństwa, migrate, jedna zmiana stanu) — lib/csvimport.ts. Mapowanie formatów na nazwy producentów — tylko w docs/21.
 *  - formatA: jeden wiersz = jedna seria; trening = para (Date, Workout Name); data z godziną, bez strefy; brak jednostki ciężaru.
 *  - formatB: jeden wiersz = jedna seria; trening = dzień; osobne kolumny ciężaru w kg i w lb; dystans z jednostką; czas HH:MM:ss.
 *  - generic (1.0, decyzja właściciela 25.10.2026): każdy inny układ rozpoznany po ALIASACH nagłówków (CSV_ALIASES) — separator , ; albo tabulator, BOM, pola w cudzysłowach,
 *    ciężar w kg albo lb (po nagłówku), typy serii (kolumna typu albo litery W/D/F w numerze serii), czas z kolumny albo z końca − startu, grupowanie po dacie przy braku nazwy,
 *    superserie z kolumny grupy. Rozpoznanie wymaga kolumny daty i kolumny ćwiczenia; inaczej błąd „format”.
 */
import { base, equipFields, loadModeFor, uid, type Exercise, type Group, type MetricType, type SetKind, type State, type Workout, type WExercise, type WSet } from './seed';
import { snapLb } from './units';
import { exName } from './i18n';
import { clampName, NAME_MAX } from './state/util';
import { writeLoad } from './state/sets';
import { normalizeGroups } from './state/groups';
import { localISODate, wallTs, workoutDay } from './state/time';
import { IMPORT_MAX_CHARS, IMPORT_MAX_ROWS, ImportError, parseCsv, detectDelimiter, num, clean, note, parseDate, parseDurationA, parseTimeB, build, addSet, valid, setStart, type ParsedFile, type ParsedSession, type ParsedSet } from './csvcore';
import { detectGeneric, parseGeneric } from './csvgeneric';
export * from './csvcore';
export { CSV_ALIASES, detectGeneric, parseDurationLoose } from './csvgeneric';

const HEADER_A = ['Date', 'Workout Name', 'Duration', 'Exercise Name', 'Set Order', 'Weight', 'Reps', 'Distance', 'Seconds', 'Notes', 'Workout Notes', 'RPE'];
const HEADER_B = ['Date', 'Exercise', 'Category', 'Weight (kg)', 'Weight (lbs)', 'Reps', 'Distance', 'Distance Unit', 'Time', 'Notes', 'Kind'];
/** Własny eksport przy lb (lib/backup.ts buildCsv) dopisuje na końcu dwie kolumny jednostek; nagłówek formatA z 12 kolumn jest ich prefiksem. */
const UNIT_COLS = ['Weight Unit', 'Distance Unit'];
const sameHeader = (h: string[], exp: string[]) => h.length >= exp.length && exp.every((c, i) => h[i].trim() === c);
export function detectFormat(header: string[]): 'formatA' | 'formatB' | null { return sameHeader(header, HEADER_A) ? 'formatA' : sameHeader(header, HEADER_B) ? 'formatB' : null; }

const DIST_M: Record<string, number> = { m: 1, km: 1000, cm: 0.01, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 };
const kindA = (s: string): SetKind | 'skip' | null => { const v = s.trim(); if (/^\d+$/.test(v)) return 'normal'; if (v === 'D') return 'drop'; if (v === 'F') return 'failure'; if (v === 'W') return 'warmup'; if (v === 'Rest Timer') return 'skip'; return null; };


/** Czyta plik CSV (tekst). Rzuca ImportError: 'empty' (pusty), 'toolarge', 'format' (nagłówek nieznany), 'rows' (żaden wiersz nie jest poprawny). */
export function parseImport(text: string, now: number = Date.now()): ParsedFile {
  if (text.length > IMPORT_MAX_CHARS) throw new ImportError('toolarge');
  const body = text.replace(/^﻿/, ''); const rows = parseCsv(body, detectDelimiter(body)); if (!rows.length) throw new ImportError('empty');
  if (rows.length > IMPORT_MAX_ROWS + 1) throw new ImportError('toolarge');
  const fixed = detectFormat(rows[0]);
  if (!fixed) { const cols = detectGeneric(rows[0]); if (!cols) throw new ImportError('format'); return parseGeneric(rows, cols, now); }
  const format: 'formatA' | 'formatB' = fixed;
  const parts = new Map<string, ParsedSession>(); const order: string[] = []; let bad = 0; let dist = false;
  const unitCol = format === 'formatA' && UNIT_COLS.every((c, i) => (rows[0][12 + i] ?? '').trim() === c); const units = new Set<string>(); let unitsMissing = false;
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]; const date = parseDate(r[0] ?? '', now);
    if (format === 'formatA') {
      const exName_ = clean(r[3]); const kind = kindA(r[4] ?? '');
      if (kind === 'skip') continue; /* wiersz przerwy — nie seria */
      const w = num(r[5]), reps = num(r[6]), dm = num(r[7]), sec = num(r[8]), rpe = r[11] === undefined || r[11].trim() === '' ? null : num(r[11]);
      if (!date || !exName_ || kind == null || !valid(w, reps, sec, dm, rpe)) { bad++; continue; }
      const wn = clean(r[1]), key = r[0].trim() + '\u0000' + wn;
      let s = parts.get(key);
      if (!s) { s = { startedAt: 0, tzOffsetMin: 0, dateOnly: date.dateOnly, name: clampName(wn, NAME_MAX), durationSec: parseDurationA(r[2] ?? ''), note: note(clean(r[10])), exercises: [] }; setStart(s, date.wall); parts.set(key, s); order.push(key); }
      if ((dm ?? 0) > 0) dist = true;
      if (unitCol && w != null) { const u = (r[12] ?? '').trim().toLowerCase(); if (u === 'kg' || u === 'lb') units.add(u); else unitsMissing = true; }
      addSet(s, exName_, { kind, weight: w, reps: Math.round(reps ?? 0), durationSec: Math.round(sec ?? 0), distanceM: dm ?? 0, rpe: rpe && rpe > 0 ? rpe : null, note: note(clean(r[9])) });
    } else {
      const exName_ = clean(r[1]); const kg = num(r[3]), lb = num(r[4]), reps = num(r[5]), dm0 = num(r[6]); const time = parseTimeB(r[8] ?? '');
      const unit = (r[7] ?? '').trim(); const f = unit === '' ? 1 : DIST_M[unit];
      if (!date || !exName_ || time == null || f == null || !valid(kg, reps, time, dm0, null) || !valid(lb, null, null, null, null)) { bad++; continue; }
      const key = localISODate(new Date(date.wall)); let s = parts.get(key);
      if (!s) { s = { startedAt: 0, tzOffsetMin: 0, dateOnly: true, name: '', durationSec: null, note: '', exercises: [] }; setStart(s, date.wall); parts.set(key, s); order.push(key); }
      const weight = kg != null && (kg > 0 || lb == null) ? kg : lb != null ? snapLb(lb) : null;
      const dmM = dm0 == null ? 0 : Math.round(dm0 * f * 100) / 100; if (dmM > 0) dist = true;
      addSet(s, exName_, { kind: 'normal', weight, reps: Math.round(reps ?? 0), durationSec: time, distanceM: dmM, rpe: null, note: note(clean(r[9])) });
    }
  }
  const file = build(parts, order, format, bad, dist);
  /* Własny eksport z kolumnami jednostek: jedna jednostka w całym pliku → ciężary przeliczone tu na kg (lb przez snapLb), picker niepotrzebny; mieszane albo nieznane → bez zgadywania (wybór użytkownika). */
  if (unitCol && !unitsMissing && units.size === 1) {
    if (units.has('lb')) for (const se of file.sessions) for (const ex of se.exercises) for (const p of ex.sets) if (p.weight != null) p.weight = snapLb(p.weight);
    return { ...file, weightUnit: 'kg' };
  }
  return file;
}

/* ---------- dopasowanie nazw ćwiczeń ---------- */
/** Aliasy dopisku sprzętu (docs/21: potwierdzone w pliku wzorcowym — Barbell → sztanga, Dumbbell → hantle). */
const EQUIP_ALIAS: [RegExp, string][] = [[/\(barbell\)/gi, '(sztanga)'], [/\(dumbbell\)/gi, '(hantle)']];
/** Klucz porównania: bez wielkości liter, spacji, nawiasów i znaków specjalnych (zostają litery i cyfry). */
export const normName = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
const aliased = (s: string) => EQUIP_ALIAS.reduce((a, [re, to]) => a.replace(re, to), s);
export interface ExIndex { exact: Map<string, Exercise>; norm: Map<string, Exercise> }
export function indexExercises(list: Exercise[]): ExIndex {
  const exact = new Map<string, Exercise>(), norm = new Map<string, Exercise>();
  const put = (m: Map<string, Exercise>, k: string, e: Exercise) => { const o = m.get(k); if (!o || (o.archived && !e.archived)) m.set(k, e); };
  for (const e of list) for (const nm of new Set([e.name, exName(e)])) { put(exact, nm, e); put(norm, normName(nm), e); }
  return { exact, norm };
}
/** Dokładne, potem znormalizowane (także po zamianie dopisku sprzętu); null = brak dopasowania (nowe ćwiczenie użytkownika). */
export function matchExercise(name: string, ix: ExIndex): Exercise | null {
  const n = name.trim(); return ix.exact.get(n) ?? ix.norm.get(normName(n)) ?? ix.norm.get(normName(aliased(n))) ?? null;
}

/* ---------- analiza (podgląd) i budowa ---------- */
export interface ImportOptions { /** jednostka ciężarów formatA */ unit: 'kg' | 'lb'; /** nazwa z pliku → id istniejącego ćwiczenia albo 'new'; brak wpisu = wynik dopasowania automatycznego */ mapping?: Record<string, string | 'new'> }
export interface ImportRow { name: string; sets: number; auto: Exercise | null }
export interface ImportAnalysis { total: number; fresh: ParsedSession[]; duplicates: number; firstDay: string | null; lastDay: string | null; names: ImportRow[]; matched: number; created: number; badRows: number }
const dayOf = (s: ParsedSession) => localISODate(new Date(wallTs(s)));
const minuteOf = (w: { startedAt: number; tzOffsetMin?: number }) => Math.floor(wallTs(w) / 60000);

/** Duplikat: istniejący trening o tym samym czasie rozpoczęcia (minuta na zegarze strefy startu); plik bez godziny — ten sam dzień. */
export function isDuplicate(s: ParsedSession, minutes: Set<number>, days: Set<string>): boolean { return s.dateOnly ? days.has(dayOf(s)) : minutes.has(minuteOf(s)); }
export function analyze(file: ParsedFile, st: State, mapping: Record<string, string | 'new'> = {}): ImportAnalysis {
  const all = [...st.workouts, ...(st.active ? [st.active] : [])];
  const minutes = new Set(all.map(minuteOf)), days = new Set(all.map(workoutDay));
  const fresh: ParsedSession[] = []; let dup = 0;
  for (const s of file.sessions) { if (isDuplicate(s, minutes, days)) dup++; else { fresh.push(s); minutes.add(minuteOf(s)); days.add(dayOf(s)); } } /* dwa treningi z pliku w tej samej minucie — też jeden */
  const ix = indexExercises(st.exercises); const cnt = new Map<string, number>();
  for (const s of fresh) for (const e of s.exercises) cnt.set(e.name, (cnt.get(e.name) ?? 0) + e.sets.length);
  const names: ImportRow[] = [...cnt].map(([name, sets]) => ({ name, sets, auto: matchExercise(name, ix) })).sort((a, b) => b.sets - a.sets || a.name.localeCompare(b.name));
  const matched = names.filter(r => (mapping[r.name] ?? r.auto?.id ?? 'new') !== 'new').length;
  return { total: file.sessions.length, fresh, duplicates: dup, firstDay: fresh.length ? dayOf(fresh[0]) : null, lastDay: fresh.length ? dayOf(fresh[fresh.length - 1]) : null,
    names, matched, created: names.length - matched, badRows: file.badRows };
}

const metricOf = (sets: ParsedSet[]): MetricType => {
  const any = (f: (s: ParsedSet) => boolean) => sets.some(f);
  const w = any(s => (s.weight ?? 0) > 0), r = any(s => s.reps > 0), t = any(s => s.durationSec > 0), d = any(s => s.distanceM > 0);
  if (d) return w ? 'weight_distance' : 'distance_time'; if (r) return w ? 'weight_reps' : any(s => s.weight != null) ? 'weight_reps' : 'reps';
  if (t) return w ? 'weight_time' : 'time'; return 'weight_reps';
};
const groupOf = (m: MetricType): Group => (m === 'distance_time' ? 'cardio' : 'inne');
const toKg = (w: number | null, unit: 'kg' | 'lb', fileKg: boolean): number | '' => w == null ? '' : fileKg || unit === 'kg' ? Math.round(w * 100) / 100 + 0 : snapLb(w);

/** Nowe treningi i nowe ćwiczenia do dopisania (bez zmiany stanu). Ćwiczenia powstają tylko dla nazw z treningów NIE będących duplikatami. */
export function buildImport(file: ParsedFile, st: State, opts: ImportOptions): { workouts: Workout[]; exercises: Exercise[]; analysis: ImportAnalysis } {
  const map = opts.mapping ?? {}; const a = analyze(file, st, map); const byId = new Map(st.exercises.map(e => [e.id, e])); const created = new Map<string, Exercise>();
  const sets = new Map<string, ParsedSet[]>(); for (const s of a.fresh) for (const e of s.exercises) { const l = sets.get(e.name); if (l) l.push(...e.sets); else sets.set(e.name, [...e.sets]); }
  const resolve = (name: string): Exercise => {
    const m = map[name]; const auto = a.names.find(r => r.name === name)?.auto ?? null;
    const picked = m && m !== 'new' ? byId.get(m) ?? null : m === 'new' ? null : auto; if (picked) return picked;
    const ck = normName(name); let c = created.get(ck); if (c) return c; /* nazwy różniące się tylko zapisem → jedno nowe ćwiczenie */
    const metric = metricOf(sets.get(name) ?? []); const nm = clampName(name, NAME_MAX) || name.slice(0, 1);
    c = { ...base(st.ownerId), name: nm, group: groupOf(metric), equipment: 'inne', metric, loadMode: loadModeFor('inne', nm), restSec: null, restWarmupSec: null, muscles: [], secondaryMuscles: [],
      bandAssistable: false, tempo: '', notes: '', ...equipFields('', 'inne', false) };
    created.set(ck, c); return c;
  };
  const rest = st.settings.defaultRest; const taken = new Set([...st.workouts, ...(st.active ? [st.active] : [])].map(w => w.startedAt));
  const workouts: Workout[] = a.fresh.map(s => {
    const ssIds = new Map<string, string>(); for (const e of s.exercises) if (e.ss != null && !ssIds.has(e.ss)) ssIds.set(e.ss, uid());
    const exs: WExercise[] = s.exercises.map(e => { const ex = resolve(e.name);
      const ws: WSet[] = e.sets.map(p => ({ id: uid(), weight: toKg(p.weight, opts.unit, file.weightUnit === 'kg'), reps: p.reps > 0 || p.durationSec === 0 ? p.reps : '', durationSec: p.durationSec > 0 ? p.durationSec : '', distanceM: p.distanceM > 0 ? p.distanceM : '',
        rpe: p.rpe ?? '', bandId: '', addKg: '', kind: p.kind, warmup: p.kind === 'warmup', note: p.note, done: true, completedAt: null, actualRest: null }));
      for (const w of ws) writeLoad(ex, w, w.weight as number | ''); /* audyt 0.13 #1: ciężar do pola właściwego dla sprzętu (masa ciała → addKg ze znakiem); nowe ćwiczenia mają sprzęt „inne” → weight */
      return { id: uid(), exerciseId: ex.id, restSec: ex.restSec ?? rest, repMin: null, repMax: null, groupId: e.ss != null ? (ssIds.get(e.ss) ?? null) : null, sets: ws }; });
    normalizeGroups(exs); /* superseria = ≥ 2 sąsiednie ćwiczenia; pojedyncze albo rozerwane wychodzą z grupy */
    let start = s.startedAt; while (taken.has(start)) start += 1000; taken.add(start); /* start unikalny (jak putHistoryWorkout, audyt M4) */
    const dur = s.durationSec != null && s.durationSec > 0 ? s.durationSec : 0; /* brak czasu w pliku: czas trwania 0 (koniec = start, store.noClock) — bez szacunku udającego dane (audyt 0.13) */
    return { ...base(st.ownerId), loggedBy: st.ownerId, sessionMode: 'solo', healthUUID: null, templateId: null, templateName: s.name, startedAt: start, finishedAt: start + dur * 1000, note: s.note, exercises: exs, tzOffsetMin: s.tzOffsetMin };
  });
  return { workouts, exercises: [...created.values()], analysis: a };
}
