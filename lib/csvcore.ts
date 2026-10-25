/*
 * Rdzeń importu CSV (wydzielony z lib/csvparse.ts 25.10.2026 — limit rozmiaru pliku, tests/architecture-limits.test.ts): stałe i typy importu, tokenizer CSV (RFC 4180, separator , ; tabulator),
 * odczyt liczb, dat i czasów oraz wspólne składniki budowy sesji. Układy: lib/csvparse.ts (formatA, formatB, dopasowanie ćwiczeń, budowa treningów) i lib/csvgeneric.ts (układ po aliasach nagłówków).
 * CZYSTY: bez odczytu pliku i bez zapisu stanu.
 */
import type { SetKind } from './seed';
import { DURATION_MAX_SEC, REPS_MAX } from './state/util';
import { fromWallTs, tzOffsetAt } from './state/time';

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
export interface ParsedFile { format: CsvFormat; /** 'kg' gdy plik podaje jednostkę ciężaru i wartości są już w kg (formatB; formatA z kolumnami jednostek — własny eksport przy lb), null = nie podaje (formatA bez kolumn albo jednostki mieszane) */ weightUnit: 'kg' | null; sessions: ParsedSession[]; /** wiersze pominięte (zła data, liczba, pusta nazwa ćwiczenia) */ badRows: number; hasDistance: boolean; /** generic: jednostka dystansu podana w nagłówku (brak = metry przyjęte domyślnie) */ distanceUnit?: 'm' | 'km' | 'mi' }

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

export const num = (s: string | undefined): number | null => {
  if (s == null) return null; let v = s.trim(); if (v === '') return null;
  if (!v.includes('.') && /^-?\d+,\d+$/.test(v)) v = v.replace(',', '.'); /* przecinek dziesiętny */
  if (!/^-?\d+(\.\d+)?$/.test(v)) return NaN; return Number(v);
};
export const clean = (s: string | undefined) => (s ?? '').replace(/^'(?=[=+\-@\t\r])/, '').trim(); /* odwraca ochronę przed formułą z eksportu (buildCsv, runda 21) */
export const note = (s: string) => s.length > IMPORT_NOTE_MAX ? s.slice(0, IMPORT_NOTE_MAX) : s;

/** Składniki daty (czas lokalny, bez strefy) → znacznik; null gdy nieistniejąca albo poza zakresem. */
export function mkDate(y: number, mo: number, d: number, h: number, mi: number, se: number, dateOnly: boolean, now: number): { wall: number; dateOnly: boolean } | null {
  if (y < IMPORT_MIN_YEAR || h > 23 || mi > 59 || se > 59) return null;
  const dt = new Date(y, mo - 1, d, h, mi, se); if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  if (dt.getTime() > now + 36 * 3600_000) return null; /* z przyszłości (z zapasem na strefy) — nie historia */
  return { wall: dt.getTime(), dateOnly };
}
/** Data „RRRR-MM-DD[ GG:MM[:SS]]" (czas lokalny, bez strefy) → znacznik w strefie telefonu; null gdy nieistniejąca albo poza zakresem. */
export function parseDate(s: string, now: number): { wall: number; dateOnly: boolean } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?$/.exec(s.trim()); if (!m) return null;
  return mkDate(+m[1], +m[2], +m[3], m[4] != null ? +m[4] : 12, m[5] != null ? +m[5] : 0, m[6] != null ? +m[6] : 0, m[4] == null, now);
}
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
/** Układ generic: oprócz ISO także ISO ze strefą (Z, ±GG:MM → czas telefonu), „DD.MM.RRRR[ GG:MM]” i „D Mon RRRR[, GG:MM]” (angielskie skróty miesięcy). Daty z ukośnikami są dwuznaczne (DD/MM czy MM/DD) — nie zgadujemy: wiersz pominięty. */
export function parseDateLoose(s: string, now: number): { wall: number; dateOnly: boolean } | null {
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

export function build(parts: Map<string, ParsedSession>, order: string[], format: CsvFormat, badRows: number, hasDistance: boolean, weightUnit: 'kg' | null = format === 'formatB' ? 'kg' : null): ParsedFile {
  const sessions = order.map(k => parts.get(k)!).filter(s => s.exercises.length).sort((a, b) => a.startedAt - b.startedAt);
  if (!sessions.length) throw new ImportError('rows');
  return { format, weightUnit, sessions, badRows, hasDistance };
}
export const addSet = (s: ParsedSession, ex: string, set: ParsedSet) => { const last = s.exercises[s.exercises.length - 1]; if (last && last.name === ex) last.sets.push(set); else s.exercises.push({ name: ex, sets: [set] }); };
export const valid = (w: number | null, reps: number | null, sec: number | null, dist: number | null, rpe: number | null) =>
  [w, reps, sec, dist, rpe].every(x => x == null || (Number.isFinite(x) && (x >= 0 || x === w))) && (w == null || Math.abs(w) <= IMPORT_WEIGHT_MAX_KG * 2.3)
  && (reps == null || reps <= REPS_MAX) && (sec == null || sec <= IMPORT_DURATION_MAX_S) && (rpe == null || rpe <= 10);

export function setStart(s: ParsedSession, wall: number) { s.tzOffsetMin = tzOffsetAt(wall); s.startedAt = fromWallTs(wall, s.tzOffsetMin); }
