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
import { clampName, NAME_MAX, REPS_MAX, DURATION_MAX_SEC } from './state/util';
import { writeLoad } from './state/sets';
import { normalizeGroups } from './state/groups';
import { fromWallTs, localISODate, tzOffsetAt, wallTs, workoutDay } from './state/time';

/** Limity importu — jedno miejsce (CLAUDE.md: liczby w jednym miejscu). 10 lat historii ≈ 1500 treningów ≈ 40 tys. wierszy. */
export const IMPORT_MAX_CHARS = 25_000_000;
export const IMPORT_MAX_ROWS = 400_000;
export const IMPORT_MIN_YEAR = 1990;
export const IMPORT_WEIGHT_MAX_KG = 2000;
export const IMPORT_DURATION_MAX_S = DURATION_MAX_SEC;
export const IMPORT_NOTE_MAX = 500;

export type CsvFormat = 'formatA' | 'formatB' | 'generic';
export type ImportErrorCode = 'empty' | 'format' | 'rows' | 'toolarge';
export class ImportError extends Error { code: ImportErrorCode; constructor(code: ImportErrorCode) { super(code); this.code = code; this.name = 'ImportError'; } }
export const isImportError = (e: unknown): e is ImportError => e instanceof ImportError;

export interface ParsedSet { kind: SetKind; /** w jednostce pliku (formatA: nieznana — wybór użytkownika), w formatB już w kg */ weight: number | null; reps: number; durationSec: number; distanceM: number; rpe: number | null; note: string }
export interface ParsedExercise { name: string; sets: ParsedSet[]; /** klucz superserii z pliku (układ generic); brak = poza superserią */ ss?: string }
export interface ParsedSession { startedAt: number; tzOffsetMin: number; /** plik nie podaje godziny (tylko dzień) */ dateOnly: boolean; name: string; durationSec: number | null; note: string; exercises: ParsedExercise[] }
export interface ParsedFile { format: CsvFormat; /** 'kg' | 'lb' gdy plik podaje jednostkę ciężaru (formatB: kg po przeliczeniu), null = nie podaje (formatA) */ weightUnit: 'kg' | null; sessions: ParsedSession[]; /** wiersze pominięte (zła data, liczba, pusta nazwa ćwiczenia) */ badRows: number; hasDistance: boolean; /** generic: jednostka dystansu podana w nagłówku (brak = metry przyjęte domyślnie) */ distanceUnit?: 'm' | 'km' | 'mi' }

/** Separator pliku: najczęstszy z , ; tabulator w pierwszym niepustym wierszu poza cudzysłowami (remis i brak = przecinek). */
export function detectDelimiter(text: string): ',' | ';' | '\t' {
  const cnt: Record<string, number> = { ',': 0, ';': 0, '\t': 0 }; let q = false; let seen = false;
  for (let i = 0; i < text.length; i++) { const ch = text[i];
    if (ch === '"') { q = !q; seen = true; }
    else if (!q && (ch === '\n' || ch === '\r')) { if (seen) break; }
    else if (!q && ch in cnt) { cnt[ch]++; seen = true; }
    else if (ch.trim() !== '') seen = true; }
  return cnt[';'] > cnt[','] && cnt[';'] >= cnt['\t'] ? ';' : cnt['\t'] > cnt[','] ? '\t' : ',';
}

/* ---------- CSV (RFC 4180: cudzysłowy, "" w polu, nowe linie w polu) ---------- */
export function parseCsv(text: string, delim: ',' | ';' | '\t' = ','): string[][] {
  const out: string[][] = []; let row: string[] = []; let f = ''; let q = false; const n = text.length; const dc = delim.charCodeAt(0);
  for (let i = 0; i < n; i++) {
    const c = text.charCodeAt(i);
    if (q) { if (c === 34) { if (text.charCodeAt(i + 1) === 34) { f += '"'; i++; } else q = false; } else f += text[i]; continue; }
    if (c === 34 && f === '') q = true;
    else if (c === dc) { row.push(f); f = ''; }
    else if (c === 10 || c === 13) { if (c === 13 && text.charCodeAt(i + 1) === 10) i++; row.push(f); f = ''; if (row.length > 1 || row[0] !== '') out.push(row); row = []; }
    else f += text[i];
  }
  if (f !== '' || row.length) { row.push(f); if (row.length > 1 || row[0] !== '') out.push(row); }
  return out;
}

const HEADER_A = ['Date', 'Workout Name', 'Duration', 'Exercise Name', 'Set Order', 'Weight', 'Reps', 'Distance', 'Seconds', 'Notes', 'Workout Notes', 'RPE'];
const HEADER_B = ['Date', 'Exercise', 'Category', 'Weight (kg)', 'Weight (lbs)', 'Reps', 'Distance', 'Distance Unit', 'Time', 'Notes', 'Kind'];
const sameHeader = (h: string[], exp: string[]) => h.length >= exp.length && exp.every((c, i) => h[i].trim() === c);
export function detectFormat(header: string[]): 'formatA' | 'formatB' | null { return sameHeader(header, HEADER_A) ? 'formatA' : sameHeader(header, HEADER_B) ? 'formatB' : null; }

const num = (s: string | undefined): number | null => {
  if (s == null) return null; let v = s.trim(); if (v === '') return null;
  if (!v.includes('.') && /^-?\d+,\d+$/.test(v)) v = v.replace(',', '.'); /* przecinek dziesiętny */
  if (!/^-?\d+(\.\d+)?$/.test(v)) return NaN; return Number(v);
};
const clean = (s: string | undefined) => (s ?? '').replace(/^'(?=[=+\-@\t\r])/, '').trim(); /* odwraca ochronę przed formułą z eksportu (buildCsv, runda 21) */
const note = (s: string) => s.length > IMPORT_NOTE_MAX ? s.slice(0, IMPORT_NOTE_MAX) : s;

/** Składniki daty (czas lokalny, bez strefy) → znacznik; null gdy nieistniejąca albo poza zakresem. */
function mkDate(y: number, mo: number, d: number, h: number, mi: number, se: number, dateOnly: boolean, now: number): { wall: number; dateOnly: boolean } | null {
  if (y < IMPORT_MIN_YEAR || h > 23 || mi > 59 || se > 59) return null;
  const dt = new Date(y, mo - 1, d, h, mi, se); if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  if (dt.getTime() > now + 36 * 3600_000) return null; /* z przyszłości (z zapasem na strefy) — nie historia */
  return { wall: dt.getTime(), dateOnly };
}
/** Data „RRRR-MM-DD[ GG:MM[:SS]]" (czas lokalny, bez strefy) → znacznik w strefie telefonu; null gdy nieistniejąca albo poza zakresem. */
function parseDate(s: string, now: number): { wall: number; dateOnly: boolean } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?$/.exec(s.trim()); if (!m) return null;
  return mkDate(+m[1], +m[2], +m[3], m[4] != null ? +m[4] : 12, m[5] != null ? +m[5] : 0, m[6] != null ? +m[6] : 0, m[4] == null, now);
}
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
/** Układ generic: oprócz ISO także ISO ze strefą (Z, ±GG:MM → czas telefonu), „DD.MM.RRRR[ GG:MM]” i „D Mon RRRR[, GG:MM]” (angielskie skróty miesięcy). Daty z ukośnikami są dwuznaczne (DD/MM czy MM/DD) — nie zgadujemy: wiersz pominięty. */
function parseDateLoose(s: string, now: number): { wall: number; dateOnly: boolean } | null {
  const v = s.trim(); const iso = parseDate(v, now); if (iso) return iso;
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{1,2}:\d{2}(?::\d{2}(?:\.\d+)?)?\s*(?:Z|[+-]\d{2}:?\d{2})$/i.test(v)) {
    const t0 = new Date(v.replace(' ', 'T').replace(/\s+/g, '').replace(/([+-]\d{2})(\d{2})$/, '$1:$2')); if (Number.isNaN(t0.getTime())) return null;
    return mkDate(t0.getFullYear(), t0.getMonth() + 1, t0.getDate(), t0.getHours(), t0.getMinutes(), t0.getSeconds(), false, now);
  }
  let m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:[ ,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(v);
  if (m) return mkDate(+m[3], +m[2], +m[1], m[4] != null ? +m[4] : 12, m[5] != null ? +m[5] : 0, m[6] != null ? +m[6] : 0, m[4] == null, now);
  m = /^(\d{1,2}) ([A-Za-z]{3})[a-z]* (\d{4})(?:,? (\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(v);
  if (m) { const mo = MONTHS.indexOf(m[2].toLowerCase()) + 1; if (!mo) return null; return mkDate(+m[3], mo, +m[1], m[4] != null ? +m[4] : 12, m[5] != null ? +m[5] : 0, m[6] != null ? +m[6] : 0, m[4] == null, now); }
  return null;
}
/** Czas trwania formatA: „52m", „1h 5m", „1h" (także „45s"); null gdy nie do odczytania. */
export function parseDurationA(s: string): number | null {
  const v = s.trim(); if (v === '') return null; const m = /^(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?$/.exec(v); if (!m || (!m[1] && !m[2] && !m[3])) return null;
  return Math.min(IMPORT_DURATION_MAX_S, (+(m[1] ?? 0)) * 3600 + (+(m[2] ?? 0)) * 60 + (+(m[3] ?? 0)));
}
/** Czas formatB: „HH:MM:ss" albo „MM:ss" (godziny można pominąć); null gdy nie do odczytania. */
export function parseTimeB(s: string): number | null {
  const v = s.trim(); if (v === '') return 0; const m = /^(?:(\d+):)?(\d{1,2}):(\d{2})$/.exec(v); if (!m) return null;
  return +(m[1] ?? 0) * 3600 + +m[2] * 60 + +m[3];
}
const DIST_M: Record<string, number> = { m: 1, km: 1000, cm: 0.01, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 };
const kindA = (s: string): SetKind | 'skip' | null => { const v = s.trim(); if (/^\d+$/.test(v)) return 'normal'; if (v === 'D') return 'drop'; if (v === 'F') return 'failure'; if (v === 'W') return 'warmup'; if (v === 'Rest Timer') return 'skip'; return null; };

function build(parts: Map<string, ParsedSession>, order: string[], format: CsvFormat, badRows: number, hasDistance: boolean, weightUnit: 'kg' | null = format === 'formatB' ? 'kg' : null): ParsedFile {
  const sessions = order.map(k => parts.get(k)!).filter(s => s.exercises.length).sort((a, b) => a.startedAt - b.startedAt);
  if (!sessions.length) throw new ImportError('rows');
  return { format, weightUnit, sessions, badRows, hasDistance };
}
const addSet = (s: ParsedSession, ex: string, set: ParsedSet) => { const last = s.exercises[s.exercises.length - 1]; if (last && last.name === ex) last.sets.push(set); else s.exercises.push({ name: ex, sets: [set] }); };
const valid = (w: number | null, reps: number | null, sec: number | null, dist: number | null, rpe: number | null) =>
  [w, reps, sec, dist, rpe].every(x => x == null || (Number.isFinite(x) && (x >= 0 || x === w))) && (w == null || Math.abs(w) <= IMPORT_WEIGHT_MAX_KG * 2.3)
  && (reps == null || reps <= REPS_MAX) && (sec == null || sec <= IMPORT_DURATION_MAX_S) && (rpe == null || rpe <= 10);

/** Czyta plik CSV (tekst). Rzuca ImportError: 'empty' (pusty), 'toolarge', 'format' (nagłówek nieznany), 'rows' (żaden wiersz nie jest poprawny). */
export function parseImport(text: string, now: number = Date.now()): ParsedFile {
  if (text.length > IMPORT_MAX_CHARS) throw new ImportError('toolarge');
  const body = text.replace(/^﻿/, ''); const rows = parseCsv(body, detectDelimiter(body)); if (!rows.length) throw new ImportError('empty');
  if (rows.length > IMPORT_MAX_ROWS + 1) throw new ImportError('toolarge');
  const fixed = detectFormat(rows[0]);
  if (!fixed) { const cols = detectGeneric(rows[0]); if (!cols) throw new ImportError('format'); return parseGeneric(rows, cols, now); }
  const format: 'formatA' | 'formatB' = fixed;
  const parts = new Map<string, ParsedSession>(); const order: string[] = []; let bad = 0; let dist = false;
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
  return build(parts, order, format, bad, dist);
}
/* ---------- układ generic: aliasy nagłówków (jedno miejsce) ---------- */
/** Aliasy nagłówków (małe litery, po trim i ze zwiniętymi spacjami); kolejność = pierwszeństwo, gdy plik ma kilka pasujących kolumn. Bez nazw programów — układy rozpoznajemy tylko po nagłówkach (mapowanie na producentów: docs/21). */
export const CSV_ALIASES = {
  workoutDate: ['date', 'start_time', 'workout_date', 'start time', 'data', 'timestamp', 'day'],
  workoutEndDate: ['end_time', 'end time', 'koniec'],
  workoutTitle: ['workout name', 'title', 'workout_title', 'routine name', 'trening', 'nazwa treningu'],
  workoutDuration: ['duration', 'workout duration', 'workout_duration', 'czas trwania'],
  workoutNotes: ['workout notes', 'description', 'workout_notes', 'notatka treningu'],
  exerciseName: ['exercise name', 'exercise_title', 'exercise', 'ćwiczenie', 'nazwa ćwiczenia'],
  notes: ['notes', 'exercise_notes', 'exercise notes', 'comment', 'notatka'],
  supersetId: ['superset_id', 'superset id', 'superset'],
  setOrder: ['set order', 'set_index', 'set', 'seria', 'nr serii'],
  setType: ['set_type', 'set type', 'type', 'typ serii'],
  weightKg: ['weight_kg', 'weight (kg)'],
  weightLb: ['weight_lbs', 'weight (lbs)'],
  weight: ['weight', 'ciężar', 'masa'],
  reps: ['reps', 'repetitions', 'powtórzenia', 'powt'],
  distance: ['distance', 'distance_km', 'distance (km)', 'distance (mi)', 'dystans'],
  seconds: ['seconds', 'duration_seconds', 'time', 'czas'],
  rpe: ['rpe'], rir: ['rir'],
} as const;
type ColKey = keyof typeof CSV_ALIASES;
type Cols = Partial<Record<ColKey, number>>;
const normHead = (h: string) => h.replace(/^﻿/, '').trim().toLowerCase().replace(/\s+/g, ' ');
/** Kolumny rozpoznane po aliasach; null = brak kolumny daty albo ćwiczenia (to nie jest historia treningów). */
export function detectGeneric(header: string[]): Cols | null {
  const h = header.map(normHead); const cols: Cols = {};
  for (const k of Object.keys(CSV_ALIASES) as ColKey[]) for (const a of CSV_ALIASES[k]) { const i = h.indexOf(a); if (i >= 0) { cols[k] = i; break; } }
  return cols.workoutDate != null && cols.exerciseName != null ? cols : null;
}
const SET_TYPE_WORDS: Record<string, SetKind> = { normal: 'normal', working: 'normal', work: 'normal', normalna: 'normal', robocza: 'normal',
  warmup: 'warmup', 'warm up': 'warmup', 'warm-up': 'warmup', rozgrzewka: 'warmup', w: 'warmup',
  dropset: 'drop', 'drop set': 'drop', drop: 'drop', d: 'drop', failure: 'failure', 'to failure': 'failure', 'do upadku': 'failure', f: 'failure' };
const setKindOf = (type: string, order: string): SetKind => {
  const ty = type.trim().toLowerCase().replace(/\s+/g, ' '); if (ty && SET_TYPE_WORDS[ty]) return SET_TYPE_WORDS[ty];
  const o = order.trim().toLowerCase(); return o === 'w' || o === 'd' || o === 'f' ? SET_TYPE_WORDS[o] : 'normal'; /* typ pusty albo nieznany → litera w numerze serii → zwykła */
};
/** Sekundy z liczby („3600”), „HH:MM:ss”/„MM:ss” albo tekstu „1h 12m”, „45m 30s”; null gdy nie do odczytania; puste = null. */
export function parseDurationLoose(s: string): number | null {
  const v = s.trim().toLowerCase(); if (v === '') return null;
  if (/^\d+(?:[.,]\d+)?$/.test(v)) return Math.min(IMPORT_DURATION_MAX_S, Math.round(Number(v.replace(',', '.'))));
  return /:/.test(v) ? (() => { const r = parseTimeB(v); return r == null ? null : Math.min(IMPORT_DURATION_MAX_S, r); })() : parseDurationA(v);
}
const distFactor = (head: string): { f: number; unit?: 'm' | 'km' | 'mi' } => /(^|[^a-z])km([^a-z]|$)/.test(head) ? { f: 1000, unit: 'km' } : /(^|[^a-z])mi([^a-z]|$)/.test(head) ? { f: 1609.344, unit: 'mi' } : { f: 1 };

function parseGeneric(rows: string[][], cols: Cols, now: number): ParsedFile {
  const head = rows[0].map(normHead); const at = (r: string[], k: ColKey) => (cols[k] == null ? '' : r[cols[k]!] ?? '');
  const dist = cols.distance != null ? distFactor(head[cols.distance]) : { f: 1 };
  const kgCol = cols.weightKg ?? null, lbCol = cols.weightLb ?? null; const unitKnown = kgCol != null || lbCol != null;
  const wCol = unitKnown ? null : cols.weight ?? null; /* sama kolumna „weight” nie podaje jednostki → wybór użytkownika (jak formatA) */
  const parts = new Map<string, ParsedSession>(); const order: string[] = []; let bad = 0; let hasDist = false;
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]; const date = parseDateLoose(at(r, 'workoutDate'), now); const exN = clean(at(r, 'exerciseName'));
    const num_ = (k: ColKey) => { const v = at(r, k); return v.trim() === '' ? null : num(v); };
    const kg = kgCol != null ? num(r[kgCol]) : wCol != null ? num(r[wCol]) : null, lb = lbCol != null ? num(r[lbCol]) : null;
    const reps = num_('reps'), dm0 = num_('distance'); let rpe = num_('rpe'); const rir = num_('rir');
    if (rpe == null && rir != null) rpe = Number.isFinite(rir) && rir >= 0 && rir <= 10 ? 10 - rir : NaN; /* RIR = 10 − RPE (Zourdos i in., JSCR 2016 — jak skala wysiłku w Ustawieniach) */
    const secRaw = at(r, 'seconds').trim(); const sec = secRaw === '' ? null : parseDurationLoose(secRaw);
    const secBad = secRaw !== '' && sec == null;
    if (!date || !exN || secBad || !valid(kg, reps, sec, dm0, rpe) || !valid(lb, null, null, null, null) || [kg, lb, reps, sec, dm0].every(x => x == null)) { bad++; continue; }
    const title = cols.workoutTitle != null ? clean(at(r, 'workoutTitle')) : '';
    const key = cols.workoutTitle != null ? at(r, 'workoutDate').trim() + '\u0000' + title : localISODate(new Date(date.wall)); /* bez nazwy: trening = dzień */
    let s = parts.get(key);
    if (!s) {
      const durCol = parseDurationLoose(at(r, 'workoutDuration')); let dur = durCol != null && durCol > 0 ? durCol : null;
      if (dur == null && cols.workoutEndDate != null && !date.dateOnly) { const end = parseDateLoose(at(r, 'workoutEndDate'), now + 36 * 3600_000); if (end && !end.dateOnly && end.wall > date.wall) dur = Math.min(IMPORT_DURATION_MAX_S, Math.round((end.wall - date.wall) / 1000)); }
      s = { startedAt: 0, tzOffsetMin: 0, dateOnly: date.dateOnly, name: clampName(title, NAME_MAX), durationSec: dur, note: note(clean(at(r, 'workoutNotes'))), exercises: [] };
      setStart(s, date.wall); parts.set(key, s); order.push(key);
    }
    const dmM = dm0 == null ? 0 : Math.round(dm0 * dist.f * 100) / 100; if (dmM > 0) hasDist = true;
    const weight = kg != null && (kg > 0 || lb == null) ? kg : lb != null ? snapLb(lb) : null;
    const set: ParsedSet = { kind: setKindOf(at(r, 'setType'), at(r, 'setOrder')), weight, reps: Math.round(reps ?? 0), durationSec: Math.round(sec ?? 0), distanceM: dmM, rpe: rpe && rpe > 0 ? rpe : null, note: note(clean(at(r, 'notes'))) };
    const ss = clean(at(r, 'supersetId')); const ssKey = ss === '' || ss === '-1' ? undefined : ss;
    const hit = ssKey != null ? s.exercises.find(e => e.name === exN && e.ss === ssKey) : null; /* superseria: serie na przemian trafiają do bloku swojego ćwiczenia */
    if (hit) hit.sets.push(set); else if (ssKey == null) addSet(s, exN, set); else s.exercises.push({ name: exN, sets: [set], ss: ssKey });
  }
  const file = build(parts, order, 'generic', bad, hasDist, unitKnown ? 'kg' : null); if (dist.unit && hasDist) file.distanceUnit = dist.unit; return file;
}
function setStart(s: ParsedSession, wall: number) { s.tzOffsetMin = tzOffsetAt(wall); s.startedAt = fromWallTs(wall, s.tzOffsetMin); }

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
