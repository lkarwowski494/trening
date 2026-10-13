import { t, tp, locale } from './i18n';
import { fmtDist } from './store';
import type { HKFilter, HKSource, HKStatistics, HKWorkoutProxy } from './hkModule';

/*
 * Odczyt z Apple Health (0.16.0, decyzje właściciela 12.10.2026 — docs/29): CZYSTA logika bez HealthKit i bez stanu aplikacji — stałe, reguła
 * dopasowania treningu z zegarka do sesji, agregacje kroków i aktywności, formatowanie. Zapytania do biblioteki: lib/healthQuery.ts; zapis i usuwanie
 * własnej kopii: lib/health.ts. NIEZMIENNIK (docs/29 rozdz. 9): wartości ze Zdrowia (kroki, tętno, kcal, rodzaje i czasy treningów) żyją tylko w pamięci
 * ekranu — nigdy w stanie, kopii JSON, CSV, logach ani w żadnym zapisie. Bez interpretacji wartości (strefy, „dobrze/źle”) i bez porad medycznych.
 */
export const HK_STEP_TYPE = 'HKQuantityTypeIdentifierStepCount';
export const HK_HEART_RATE_TYPE = 'HKQuantityTypeIdentifierHeartRate';
export const HK_ACTIVE_ENERGY_TYPE = 'HKQuantityTypeIdentifierActiveEnergyBurned';
export const HK_WORKOUT_TYPE = 'HKWorkoutTypeIdentifier';
/** Typy, o które prosimy przy włączeniu odczytu (`toRead`) — JEDNO miejsce; tylko to, czego aplikacja faktycznie używa (docs/29 rozdz. 4: kroki dnia i tygodnia,
 * treningi — inne aktywności i trening z zegarka, tętno i aktywne kcal przy sesji; dystans aktywności bierzemy z `totalDistance` treningu, więc osobnego typu dystansu nie ma). */
export const HEALTH_READ_TYPES = [HK_STEP_TYPE, HK_WORKOUT_TYPE, HK_HEART_RATE_TYPE, HK_ACTIVE_ENERGY_TYPE] as const;
/** Rodzaje treningów z zegarka łączone z sesją (P4 A: tylko siłowe) — HKWorkoutActivityType: traditionalStrengthTraining 50, functionalStrengthTraining 20
 * (enum WorkoutActivityType w @kingstinct/react-native-healthkit 16.x; zgodność z lib/health.HK_ACTIVITY pilnuje test). */
export const WATCH_MATCH_TYPES = [50, 20] as const;
/** Średnia dzienna kroków z tylu ostatnich PEŁNYCH dni (P3: linia pod „Ten tydzień”; dzisiejszy niepełny dzień zaniżałby średnią, więc nie wchodzi). */
export const STEPS_AVG_DAYS = 7;
/** Okno (dni wstecz) sprawdzania własnych kopii przy usuwaniu po późniejszej synchronizacji zegarka; null = bez okna (docs/29 5.7 pkt 3 — okno ustali właściciel po
 * pomiarze na telefonie z długą historią; liczby nie zgadujemy). */
export const WATCH_RECONCILE_WINDOW_DAYS: number | null = null;
/** Klucz metadanych, którym aplikacja znakuje własny zapis (lib/health.saveWorkout) — jedyny sposób rozpoznania „naszej kopii” oprócz źródła. */
export const HK_SYNC_ID_KEY = 'HKMetadataKeySyncIdentifier';
/** ComparisonPredicateOperator.equalTo z @react-native-healthkit/core (wartość NSComparisonPredicate.Operator). */
export const HK_OP_EQUAL_TO = 4;
/** Jednostki żądane jawnie (domyślna jednostka tętna w bibliotece to count/s, nie uderzenia na minutę). */
export const HK_UNITS = { steps: 'count', heartRate: 'count/min', energy: 'kcal' } as const;
/** Znacznik w `Workout.healthUUID`: wpis sesji jest w Zdrowiu jako trening z zegarka (własnej kopii nie ma albo została usunięta). Nie jest daną zdrowotną. */
export const HEALTH_UUID_WATCH = 'watch';

/**
 * Filtr usuwania WŁASNEJ kopii treningu w Zdrowiu: znacznik synchronizacji = id sesji ORAZ źródło = ta aplikacja. Oba warunki zawsze razem (niezmiennik testowy,
 * docs/29 5.7 pkt 2): bez id albo bez źródła zwraca null i usuwanie się nie odbywa — biblioteka przy pustej liście źródeł zawęziłaby zapytanie tylko metadanymi.
 */
export function ownCopyFilter(workoutId: string, source: HKSource | null | undefined): HKFilter | null {
  if (typeof workoutId !== 'string' || !workoutId || !source || typeof source !== 'object') return null;
  return { metadata: { withMetadataKey: HK_SYNC_ID_KEY, operatorType: HK_OP_EQUAL_TO, value: workoutId }, sources: [source] };
}

/** Przedział czasu sesji aplikacji (zakończona, z godziną). */
export interface SessionSpan { id: string; start: number; end: number }
/** Trening ze Zdrowia sprowadzony do prostych liczb (zwykły obiekt, bez uchwytu natywnego). */
export interface HkWorkout { uuid: string; start: number; end: number; type: number; durationSec: number; distanceM: number | null; syncId: string | null; bundle: string | null }
/** Tętno i aktywna energia z dopasowanego treningu z zegarka; brakujące pole = brak wartości. */
export interface WatchStats { avgBpm?: number; maxBpm?: number; kcal?: number }

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const ms = (d: unknown): number | null => (d instanceof Date ? num(d.getTime()) : num(d));
export const validSpan = (start: number, end: number) => Number.isFinite(start) && Number.isFinite(end) && end > start;
/** Część wspólna dwóch przedziałów w ms; stykanie się końcami i złe dane (NaN, odwrócone) = 0. */
export function overlapMs(aStart: number, aEnd: number, bStart: number, bEnd: number): number {
  if (!validSpan(aStart, aEnd) || !validSpan(bStart, bEnd)) return 0;
  return Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
}

/** Uchwyt treningu z biblioteki → prosty obiekt; null, gdy brak UUID albo przedział jest zły (end ≤ start, NaN). Czas trwania: pole `duration` (s), inaczej koniec − start. */
export function parseWorkout(p: Partial<HKWorkoutProxy> | null | undefined): HkWorkout | null {
  if (!p || typeof p.uuid !== 'string' || !p.uuid) return null;
  const start = ms(p.startDate), end = ms(p.endDate); if (start == null || end == null || !validSpan(start, end)) return null;
  const type = num(p.workoutActivityType); if (type == null) return null;
  const dur = num(p.duration?.quantity); const dist = num(p.totalDistance?.quantity);
  const sid = p.metadata && typeof p.metadata[HK_SYNC_ID_KEY] === 'string' ? (p.metadata[HK_SYNC_ID_KEY] as string) : null;
  const b = p.sourceRevision?.source?.bundleIdentifier;
  return { uuid: p.uuid, start, end, type, durationSec: dur != null && dur > 0 ? dur : (end - start) / 1000, distanceM: dist != null && dist > 0 ? dist : null, syncId: sid, bundle: typeof b === 'string' && b ? b : null };
}
/** Czy wpis zrobiła ta aplikacja: znacznik synchronizacji równy id którejś naszej sesji albo źródło = ta aplikacja. */
export const isOwnWorkout = (h: HkWorkout, ownIds: ReadonlySet<string>, ownBundle?: string | null) =>
  (h.syncId != null && ownIds.has(h.syncId)) || (!!ownBundle && h.bundle === ownBundle);
/** Kandydat do połączenia z sesją: nie nasz wpis, rodzaj z WATCH_MATCH_TYPES, poprawny przedział. */
export const isWatchCandidate = (h: HkWorkout, ownIds: ReadonlySet<string>, ownBundle?: string | null) =>
  (WATCH_MATCH_TYPES as readonly number[]).includes(h.type) && validSpan(h.start, h.end) && !isOwnWorkout(h, ownIds, ownBundle);

/**
 * Reguła dopasowania (docs/29 5.7): sesja ↔ trening z zegarka, gdy przedziały mają część wspólną DŁUŻSZĄ niż 0 (stykanie się końcami to nie dopasowanie; bez progu
 * procentowego — byłaby to liczba bez źródła). Wiele kandydatów: para z najdłuższą częścią wspólną; remis → wcześniejszy start treningu z zegarka, potem wcześniejszy
 * start sesji i porządek id/uuid (wynik deterministyczny). Jeden trening z zegarka najwyżej do jednej sesji, jedna sesja najwyżej do jednego treningu
 * (przydział zachłanny od najdłuższych części wspólnych). Zwraca id sesji → uuid treningu z zegarka. Kandydatów należy wcześniej odfiltrować isWatchCandidate.
 */
export function matchWatchWorkouts(sessions: readonly SessionSpan[], candidates: readonly HkWorkout[]): Map<string, string> {
  const pairs: { s: SessionSpan; h: HkWorkout; o: number }[] = [];
  for (const s of sessions) for (const h of candidates) { const o = overlapMs(s.start, s.end, h.start, h.end); if (o > 0) pairs.push({ s, h, o }); }
  pairs.sort((a, b) => b.o - a.o || a.h.start - b.h.start || a.s.start - b.s.start || (a.h.uuid < b.h.uuid ? -1 : a.h.uuid > b.h.uuid ? 1 : 0) || (a.s.id < b.s.id ? -1 : a.s.id > b.s.id ? 1 : 0));
  const out = new Map<string, string>(); const used = new Set<string>();
  for (const { s, h } of pairs) { if (out.has(s.id) || used.has(h.uuid)) continue; out.set(s.id, h.uuid); used.add(h.uuid); }
  return out;
}
/** „Inne aktywności” (P8: bez kategorii): treningi ze Zdrowia bez własnych wpisów aplikacji, bez dopasowanych do sesji i ze złym przedziałem; rosnąco po starcie. */
export function otherActivities(all: readonly HkWorkout[], ownIds: ReadonlySet<string>, ownBundle: string | null | undefined, matchedUuids: ReadonlySet<string>): HkWorkout[] {
  return all.filter(h => validSpan(h.start, h.end) && !isOwnWorkout(h, ownIds, ownBundle) && !matchedUuids.has(h.uuid)).sort((a, b) => a.start - b.start || (a.uuid < b.uuid ? -1 : 1));
}
/** Aktywności, które ZACZYNAJĄ się w przedziale [from, to) — aktywność przechodząca przez północ liczy się do dnia startu (docs/29 5.5). */
export const startingIn = (list: readonly HkWorkout[], from: number, to: number) => list.filter(h => h.start >= from && h.start < to);

/** Początek dnia (czas lokalny) i początek następnego dnia dla klucza RRRR-MM-DD; granice jak dayKeyOf. NaN, gdy klucz zły. */
export function dayBounds(key: string): { from: number; to: number } {
  const y = +key.slice(0, 4), m = +key.slice(5, 7) - 1, d = +key.slice(8, 10);
  return { from: new Date(y, m, d).getTime(), to: new Date(y, m, d + 1).getTime() };
}
/** Średnia dzienna kroków z dni, które mają dane (dzień bez żadnego pomiaru nie zaniża średniej); brak danych = null. Kroki zaokrąglone do całości. */
export function avgDailySteps(byDay: ReadonlyMap<string, number>, days: readonly string[]): number | null {
  const v = days.map(d => byDay.get(d)).filter((x): x is number => typeof x === 'number' && Number.isFinite(x) && x >= 0);
  return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null;
}
/** Kroki dnia z kolekcji statystyk (jeden element = jeden dzień): klucz dnia z `startDate`, wartość z `sumQuantity.quantity`; dni bez sumy pomijane. */
export function stepsByDay(items: readonly HKStatistics[] | null | undefined, keyOf: (ts: number) => string): Map<string, number> {
  const out = new Map<string, number>();
  for (const it of items ?? []) { const ts = ms(it?.startDate), q = num(it?.sumQuantity?.quantity); if (ts != null && q != null && q >= 0) out.set(keyOf(ts), Math.round(q)); }
  return out;
}
/** Tętno i kcal z statystyk treningu: tętno śr./maks. w uderzeniach/min (zaokrąglone, > 0), aktywna energia w kcal (zaokrąglona, > 0); zapasowo `totalEnergyBurned` z treningu. */
export function watchStatsFrom(hr: HKStatistics | null | undefined, energy: HKStatistics | null | undefined, totalKcal?: number | null): WatchStats {
  const pos = (v: unknown) => { const n = num(v); return n != null && n > 0 ? Math.round(n) : undefined; };
  const out: WatchStats = {}; const a = pos(hr?.averageQuantity?.quantity), m = pos(hr?.maximumQuantity?.quantity), k = pos(energy?.sumQuantity?.quantity) ?? pos(totalKcal);
  if (a != null) out.avgBpm = a; if (m != null) out.maxBpm = m; if (k != null) out.kcal = k;
  return out;
}
export const hasWatchStats = (s: WatchStats | null | undefined): s is WatchStats => !!s && (s.avgBpm != null || s.maxBpm != null || s.kcal != null);

/* ---------- formatowanie (teksty przez t(); liczby wg języka) ---------- */
const group = (n: number) => { try { return Math.round(n).toLocaleString(locale()); } catch { return String(Math.round(n)); } };
/** Czas aktywności: minuty (od godziny „1 h 5 min”) — jak kafelki „Ten tydzień”; poniżej minuty „1 min”. */
export function fmtMinutes(sec: number): string {
  const m = Math.max(1, Math.round(sec / 60));
  return m >= 60 ? `${t('{n} h', { n: Math.floor(m / 60) })}${m % 60 ? ` ${t('{n} min', { n: m % 60 })}` : ''}` : t('{n} min', { n: m });
}
const minutesSpoken = (sec: number) => { const m = Math.max(1, Math.round(sec / 60)); return `${m} ${tp(m, 'minuta|minuty|minut')}`; };
/** „Kroki: 8 432”. */
export const stepsText = (n: number) => t('Kroki: {n}', { n: group(n) });
/** Linia aktywności dnia bez kategorii (P8): „Inna aktywność · 32 min · 5,2 km”; dystans tylko gdy jest. */
export function activityText(a: Pick<HkWorkout, 'durationSec' | 'distanceM'>): string {
  return [t('Inna aktywność'), fmtMinutes(a.durationSec), ...(a.distanceM != null && a.distanceM > 0 ? [fmtDist(a.distanceM)] : [])].join(' · ');
}
/** Ten sam blok dnia dla VoiceOver (jednostki słownie): „Apple Health: kroki 8 432; inna aktywność, 32 minuty, 5,2 km”. */
export function dayBlockSpoken(steps: number | null, acts: readonly Pick<HkWorkout, 'durationSec' | 'distanceM'>[]): string {
  const parts = [...(steps != null ? [t('kroki {n}', { n: group(steps) })] : []),
    ...acts.map(a => [t('inna aktywność'), minutesSpoken(a.durationSec), ...(a.distanceM != null && a.distanceM > 0 ? [fmtDist(a.distanceM)] : [])].join(', '))];
  return `${t('Apple Health')}: ${parts.join('; ')}`;
}
/** Linia pod „Ten tydzień” (P3): średnia dzienna kroków z ostatnich STEPS_AVG_DAYS dni + liczba innych aktywności tygodnia; pusta, gdy nic do pokazania. */
export function weekLineText(avgSteps: number | null, otherCount: number, days = STEPS_AVG_DAYS): string {
  const parts = [...(avgSteps != null ? [t('Kroki dziennie (średnia z {d} dni): {n}', { d: days, n: group(avgSteps) })] : []),
    ...(otherCount > 0 ? [`${otherCount} ${tp(otherCount, 'inna aktywność|inne aktywności|innych aktywności')} ${t('w tym tygodniu')}`] : [])];
  return parts.length ? `${t('Apple Health')}: ${parts.join(' · ')}` : '';
}
/** Linia szczegółów sesji: „Apple Health (zegarek): tętno śr. 128 /min, maks. 161 /min · 312 kcal aktywne”; brak wartości = pusty tekst. */
export function watchLineText(s: WatchStats): string {
  const hr = s.avgBpm != null && s.maxBpm != null ? t('tętno śr. {avg} /min, maks. {max} /min', { avg: group(s.avgBpm), max: group(s.maxBpm) })
    : s.avgBpm != null ? t('tętno śr. {avg} /min', { avg: group(s.avgBpm) }) : s.maxBpm != null ? t('tętno maks. {max} /min', { max: group(s.maxBpm) }) : '';
  const parts = [hr, s.kcal != null ? t('{n} kcal aktywne', { n: group(s.kcal) }) : ''].filter(Boolean);
  return parts.length ? `${t('Apple Health (zegarek)')}: ${parts.join(' · ')}` : '';
}
/** Linia sesji dla VoiceOver: „Z zegarka: tętno średnie 128 na minutę, maksymalne 161; 312 kilokalorii aktywnych”. */
export function watchSpoken(s: WatchStats): string {
  const hr = s.avgBpm != null && s.maxBpm != null ? t('tętno średnie {avg} na minutę, maksymalne {max}', { avg: group(s.avgBpm), max: group(s.maxBpm) })
    : s.avgBpm != null ? t('tętno średnie {n} na minutę', { n: group(s.avgBpm) }) : s.maxBpm != null ? t('tętno maksymalne {n} na minutę', { n: group(s.maxBpm) }) : '';
  const parts = [hr, s.kcal != null ? t('{n} kilokalorii aktywnych', { n: group(s.kcal) }) : ''].filter(Boolean);
  return parts.length ? `${t('Z zegarka')}: ${parts.join('; ')}` : '';
}
