/*
 * Import CSV — układ rozpoznawany po aliasach nagłówków (1.0, decyzja właściciela 25.10.2026; wydzielone z lib/csvparse.ts). Wymaga kolumny daty i kolumny ćwiczenia; reszta opcjonalna.
 * Dalsze kroki (dopasowanie ćwiczeń, budowa treningów, zapis): lib/csvparse.ts, lib/csvimport.ts. CZYSTY.
 */
import type { SetKind } from './seed';
import { snapLb } from './units';
import { clampName, NAME_MAX } from './state/util';
import { localISODate } from './state/time';
import { IMPORT_DURATION_MAX_S, num, clean, note, valid, addSet, setStart, build, parseDateLoose, parseDurationA, parseTimeB, type ParsedFile, type ParsedSession, type ParsedSet } from './csvcore';
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

export function parseGeneric(rows: string[][], cols: Cols, now: number): ParsedFile {
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
