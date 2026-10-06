/*
 * Macierz czasu (polecenie właściciela 06.10.2026 — „najpełniejsze darmowe testy automatyczne”): logika dat i godzin w DOWOLNEJ strefie czasowej
 * i na brzegach kalendarza. Plik przechodzi przy każdej wartości TZ procesu — CI uruchamia go w kilku strefach (.github/workflows/tests-tz.yml):
 * Europe/Warsaw, UTC, America/Los_Angeles, Pacific/Kiritimati (+14), Pacific/Pago_Pago (−11), Asia/Kolkata (+5:30), Australia/Lord_Howe
 * (zmiana czasu o 30 min). Lokalnie: `TZ=<strefa> npx jest tests/matrix-time.test.ts`.
 *
 * Wartości oczekiwane liczy NIEZALEŻNA wyrocznia: Intl.DateTimeFormat z jawną strefą procesu (formatToParts) i arytmetyka kalendarza na UTC
 * (Date.UTC / getUTC*) — nie lokalne gettery Date, z których korzysta aplikacja (getDate, getHours, new Date(r, m, d, …)). Zmiany czasu (DST)
 * wyrocznia znajduje sama w bieżącej strefie; scenariusze DST działają na znalezionych przejściach, a w strefach bez DST — na chwilach
 * przejść w UE i USA (wtedy sprawdzają, że nic się nie psuje). TZ nie zmieniamy w trakcie procesu (tests/global-setup.js — na macOS nie działa).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as edit from '@/lib/edit';
import * as timer from '@/lib/timer';
import { buildCsv } from '@/lib/backup';
import { calendarDaysLeft, reminderAt } from '@/lib/signing';
import { fresh, ex, addWorkout, saved, seedState } from './helpers';

jest.setTimeout(120000);

/* ======================= wyrocznia (niezależna od aplikacji) ======================= */
const ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
const MIN = 60e3, H = 3600e3, DAY = 86400e3;
const pad = (n: number) => String(n).padStart(2, '0');
const DTF = new Intl.DateTimeFormat('en-US', { timeZone: ZONE, hourCycle: 'h23', weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
const WD: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
type Wall = { y: number; mo: number; d: number; h: number; mi: number; s: number; wd: number };
type Cal = { y: number; mo: number; d: number };
/** Czas ścienny chwili `ts` w strefie procesu (Intl, nie gettery Date). wd: 0 = poniedziałek. */
function wall(ts: number): Wall {
  const p: Record<string, string> = {}; for (const x of DTF.formatToParts(new Date(ts))) p[x.type] = x.value;
  return { y: +p.year, mo: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute, s: +p.second, wd: WD[p.weekday] };
}
/** Przesunięcie strefy w minutach (czas lokalny − UTC) w chwili ts. */
function offsetMin(ts: number): number { const w = wall(ts); const sec = ts - (((ts % 1000) + 1000) % 1000); return (Date.UTC(w.y, w.mo - 1, w.d, w.h, w.mi, w.s) - sec) / MIN; }
/** Wszystkie chwile, które w tej strefie mają czas ścienny r-m-d g:m (0 — godzina nie istnieje, 2 — powtórzona). */
function wallToUtc(y: number, mo: number, d: number, h = 0, mi = 0): number[] {
  const g = Date.UTC(y, mo - 1, d, h, mi); const offs = new Set([-1.5, -0.5, 0, 0.5, 1.5].map(k => offsetMin(g + k * DAY)));
  const out = [...offs].map(o => g - o * MIN).filter(c => { const w = wall(c); return w.y === y && w.mo === mo && w.d === d && w.h === h && w.mi === mi && w.s === 0; });
  return [...new Set(out)].sort((a, b) => a - b);
}
/** Jedyna chwila danej godziny (test zakłada, że istnieje i jest jednoznaczna). */
function at(y: number, mo: number, d: number, h = 0, mi = 0): number {
  const c = wallToUtc(y, mo, d, h, mi); if (c.length !== 1) throw new Error(`wyrocznia: ${y}-${mo}-${d} ${h}:${mi} w ${ZONE} ma ${c.length} chwil`); return c[0];
}
/** Arytmetyka kalendarza na UTC (niezależna od strefy procesu). */
const cal = (y: number, mo: number, d: number): Cal => { const u = new Date(Date.UTC(2000, 0, 1)); u.setUTCFullYear(y, mo - 1, d); return { y: u.getUTCFullYear(), mo: u.getUTCMonth() + 1, d: u.getUTCDate() }; };
const addDays = (c: Cal, n: number) => cal(c.y, c.mo, c.d + n);
const dow = (c: Cal) => { const u = new Date(Date.UTC(2000, 0, 1)); u.setUTCFullYear(c.y, c.mo - 1, c.d); return (u.getUTCDay() + 6) % 7; };
const iso = (c: Cal) => `${String(c.y).padStart(4, '0')}-${pad(c.mo)}-${pad(c.d)}`;
const calOf = (ts: number): Cal => { const w = wall(ts); return { y: w.y, mo: w.mo, d: w.d }; };
const sameCal = (a: Cal, b: Cal) => a.y === b.y && a.mo === b.mo && a.d === b.d;
/** Pierwsza chwila dnia kalendarzowego (północ, a gdy północy nie ma — pierwsza istniejąca minuta). */
function dayStart(c: Cal): number { for (let m = 0; m < 24 * 60; m++) { const x = wallToUtc(c.y, c.mo, c.d, Math.floor(m / 60), m % 60); if (x.length) return x[0]; } throw new Error('brak dnia ' + iso(c)); }
const mondayOf = (c: Cal) => addDays(c, -dow(c));
/** Tydzień ISO 8601 (rok tygodnia, numer) — algorytm „czwartku tygodnia”. */
function isoWeek(c: Cal): { year: number; week: number } {
  const thu = addDays(c, 3 - dow(c)); const jan1 = Date.UTC(thu.y, 0, 1); const day = (Date.UTC(thu.y, thu.mo - 1, thu.d) - jan1) / DAY;
  return { year: thu.y, week: Math.floor(day / 7) + 1 };
}
type Tr = { at: number; before: number; after: number };
/** Przejścia przesunięcia strefy w [from, to) (szukane co godzinę, dokładnie do minuty). */
function transitions(from: number, to: number): Tr[] {
  const out: Tr[] = []; let prev = offsetMin(from);
  for (let t = from + H; t < to; t += H) { const o = offsetMin(t); if (o === prev) continue;
    let lo = t - H, hi = t; while (hi - lo > MIN) { const mid = lo + Math.floor((hi - lo) / (2 * MIN)) * MIN; if (offsetMin(mid) === prev) lo = mid; else hi = mid; }
    out.push({ at: hi, before: prev, after: o }); prev = o; }
  return out;
}
const Y2026 = Date.UTC(2026, 0, 1) - DAY, Y2029 = Date.UTC(2029, 0, 1) + DAY;
const TR = transitions(Y2026, Y2029);
const TR2026 = TR.filter(x => wall(x.at).y === 2026);
const GAPS = TR2026.filter(x => x.after > x.before), FOLDS = TR2026.filter(x => x.after < x.before);
/** Chwile przejść UE (29.03 i 25.10.2026, 01:00 UTC) i USA (8.03 2026 10:00 UTC, 1.11 2026 09:00 UTC) — sprawdzane w każdej strefie. */
const ABS_EDGES = [Date.UTC(2026, 2, 29, 1), Date.UTC(2026, 9, 25, 1), Date.UTC(2026, 2, 8, 10), Date.UTC(2026, 10, 1, 9)];
const EDGES = [...new Set([...TR.map(x => x.at), ...ABS_EDGES])].sort((a, b) => a - b);

/** Znane przejścia 2026 w strefach z macierzy CI (data lokalna, zmiana w minutach) — z tzdata; inna strefa = brak oczekiwań. */
const KNOWN: Record<string, [string, number][]> = {
  'Europe/Warsaw': [['2026-03-29', 60], ['2026-10-25', -60]],
  'UTC': [], 'Etc/UTC': [],
  'America/Los_Angeles': [['2026-03-08', 60], ['2026-11-01', -60]],
  'Pacific/Kiritimati': [], 'Pacific/Pago_Pago': [], 'Asia/Kolkata': [], 'Asia/Calcutta': [],
  'Australia/Lord_Howe': [['2026-04-05', -30], ['2026-10-04', 30]],
};
export const CI_ZONES = ['Europe/Warsaw', 'UTC', 'America/Los_Angeles', 'Pacific/Kiritimati', 'Pacific/Pago_Pago', 'Asia/Kolkata', 'Australia/Lord_Howe'];

/** Sondy: co 5 h 17 min przez 2026–2028 + otoczenie przejść (±1 ms, ±1 min, ±30 min) + brzegi lokalnych dób w ważnych dniach. */
const PROBES: number[] = (() => {
  const p = new Set<number>(); for (let t = Date.UTC(2026, 0, 1); t < Date.UTC(2029, 0, 1); t += 5 * H + 17 * MIN) p.add(t);
  for (const e of EDGES) for (const d of [-30 * MIN, -MIN, -1, 0, 1, MIN, 30 * MIN]) p.add(e + d);
  for (const c of [cal(2026, 12, 31), cal(2027, 1, 1), cal(2026, 12, 28), cal(2027, 1, 3), cal(2027, 1, 4), cal(2028, 2, 28), cal(2028, 2, 29), cal(2028, 3, 1), cal(2026, 3, 29), cal(2026, 3, 30), cal(2026, 10, 25), cal(2026, 10, 26), cal(2026, 3, 8), cal(2026, 11, 1), cal(2026, 4, 5), cal(2026, 10, 4)]) {
    const s = dayStart(c); for (const d of [-1, 0, 1, 12 * H, dayStart(addDays(c, 1)) - s - 1]) p.add(s + d);
  }
  return [...p].sort((a, b) => a - b);
})();

/* ======================= pomocnicze ======================= */
const BENCH = 'Bench Press (sztanga)';
const realNow = Date.now();
/** Zegar systemowy testu: fałszywe timery tylko dla Date (setTimeout i Promise działają normalnie, init() store się nie zawiesza). */
function clock(ts: number) { jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'queueMicrotask'] }); jest.setSystemTime(ts); }
afterEach(async () => { jest.useRealTimers(); jest.restoreAllMocks(); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

/* ======================= 0. strefa i wyrocznia ======================= */
describe(`strefa procesu: ${ZONE}`, () => {
  test('wyrocznia Intl zgadza się z silnikiem (getTimezoneOffset) w każdej sondzie — inaczej reszta pliku nie ma podstaw', () => {
    const bad = PROBES.filter(t => offsetMin(t) !== -new Date(t).getTimezoneOffset());
    expect(bad.map(t => new Date(t).toISOString())).toEqual([]);
  });
  test('przejścia czasu 2026 w tej strefie zgadzają się z tabelą tzdata (strefy z macierzy CI)', () => {
    const found = TR2026.map(x => [iso(calOf(x.at)), x.after - x.before]);
    if (KNOWN[ZONE]) expect(found).toEqual(KNOWN[ZONE]); else expect(found.length % 2).toBe(0);
    for (const g of GAPS) expect(wallToUtc(wall(g.at - MIN).y, wall(g.at - MIN).mo, wall(g.at - MIN).d, wall(g.at - MIN).h, wall(g.at - MIN).mi)).toHaveLength(1);
  });
  test('wyrocznia: luka DST nie ma chwil, nakładka ma dwie, zwykła godzina jedną', () => {
    for (const g of GAPS) { const w = wall(g.at - MIN); const m = w.h * 60 + w.mi + 1; expect(wallToUtc(w.y, w.mo, w.d, Math.floor(m / 60), m % 60)).toEqual([]); }
    for (const f of FOLDS) { const w = wall(f.at); expect(wallToUtc(w.y, w.mo, w.d, w.h, w.mi)).toHaveLength(2); }
    expect(wallToUtc(2026, 7, 15, 12, 0)).toHaveLength(1);
  });
});

/* ======================= 1. localISODate / dateText / timeText ======================= */
describe('localISODate, dateText, timeText — data i godzina w strefie telefonu', () => {
  test('w każdej sondzie (2026–2028, przejścia DST ±1 ms, brzegi dób, 31.12→1.01, 29.02.2028) zgadzają się z wyrocznią', () => {
    const bad: string[] = [];
    for (const t of PROBES) { const w = wall(t); const d = iso(w), hm = `${pad(w.h)}:${pad(w.mi)}`;
      if (store.localISODate(new Date(t)) !== d || edit.dateText(t) !== d || edit.timeText(t) !== hm) bad.push(`${new Date(t).toISOString()}: ${store.localISODate(new Date(t))} ${edit.timeText(t)} ≠ ${d} ${hm}`); }
    expect(bad).toEqual([]);
  });
  test('ostatnia milisekunda roku i pierwsza nowego: 2026-12-31 → 2027-01-01; 2028-02-29 istnieje', () => {
    const ny = dayStart(cal(2027, 1, 1));
    expect(store.localISODate(new Date(ny - 1))).toBe('2026-12-31'); expect(store.localISODate(new Date(ny))).toBe('2027-01-01');
    expect(edit.timeText(ny - 1)).toBe('23:59'); expect(edit.timeText(ny)).toBe('00:00');
    expect(store.localISODate(new Date(at(2028, 2, 29, 12)))).toBe('2028-02-29');
    expect(store.localISODate(new Date(dayStart(cal(2028, 3, 1)) - 1))).toBe('2028-02-29');
  });
  test('localISODate() bez argumentu bierze zegar systemowy (fałszywy czas)', () => {
    for (const t of [dayStart(cal(2027, 1, 1)) - 1, dayStart(cal(2027, 1, 1)), at(2028, 2, 29, 23, 59)]) { clock(t); expect(store.localISODate()).toBe(iso(calOf(t))); }
  });
});

/* ======================= 2. localDateTs i import dat (tsOf) ======================= */
describe('localDateTs — sama data RRRR-MM-DD to lokalna północ, nie UTC', () => {
  test('dla każdego dnia 2026-01-01…2028-12-31: pierwsza chwila tego dnia w strefie (także w dniach zmiany czasu)', () => {
    const bad: string[] = []; for (let c = cal(2026, 1, 1); c.y < 2029; c = addDays(c, 1)) { const exp = dayStart(c); const got = store.localDateTs(iso(c)); if (got !== exp) bad.push(`${iso(c)}: ${got} ≠ ${exp}`); }
    expect(bad).toEqual([]);
  });
  test('import (migrate): startedAt „2026-12-31” = lokalna północ; tekst ISO z Z = ta chwila; liczba = liczba', () => {
    const raw: any = seedState('pl'); const exId = raw.exercises.find((e: any) => e.name === BENCH).id;
    const mk = (id: string, s: unknown) => ({ id, ownerId: 'local', createdAt: 1, updatedAt: 1, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: id, startedAt: s, finishedAt: null, note: '', exercises: [{ id: 'b' + id, exerciseId: exId, restSec: 90, repMin: null, repMax: null, groupId: null, sets: [{ id: 's' + id, weight: 100, reps: 5, durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind: 'normal', warmup: false, note: '', done: true, completedAt: null, actualRest: null }] }] });
    raw.workouts = [mk('a', '2026-12-31'), mk('b', '2028-02-29'), mk('c', '2026-03-29T01:30:00.000Z'), mk('d', Date.UTC(2026, 9, 25, 0, 30))];
    const m = store.migrate(raw); const by = (id: string) => m.workouts.find(w => w.id === id)!;
    expect(by('a').startedAt).toBe(dayStart(cal(2026, 12, 31))); expect(by('b').startedAt).toBe(dayStart(cal(2028, 2, 29)));
    expect(by('c').startedAt).toBe(Date.UTC(2026, 2, 29, 1, 30)); expect(by('d').startedAt).toBe(Date.UTC(2026, 9, 25, 0, 30));
  });
});

/* ======================= 3. tydzień od poniedziałku (thisMonday), tydzień ISO 53, rok przestępny ======================= */
describe('thisMonday — początek tygodnia statystyk = poniedziałek 00:00 czasu lokalnego', () => {
  test('w każdej sondzie: poniedziałek tego tygodnia (lokalnie), północ, ≤ teraz; przesunięcia −2…+1 tygodnia liczone kalendarzem', () => {
    const bad: string[] = [];
    for (const t of PROBES) { const c = calOf(t); const mon = mondayOf(c);
      for (const k of [-2, -1, 0, 1]) { const exp = dayStart(addDays(mon, 7 * k)); const got = stats.thisMonday(k, new Date(t)); if (got !== exp) bad.push(`${new Date(t).toISOString()} k=${k}: ${iso(calOf(got))} ≠ ${iso(addDays(mon, 7 * k))}`); }
      if (stats.thisMonday(0, new Date(t)) > t) bad.push('w przyszłości ' + t); }
    expect(bad).toEqual([]);
  });
  test('niedziela 23:59 i poniedziałek 00:00 w tygodniach zmiany czasu UE i USA należą do różnych tygodni', () => {
    for (const [sun, mon] of [[cal(2026, 3, 29), cal(2026, 3, 30)], [cal(2026, 10, 25), cal(2026, 10, 26)], [cal(2026, 3, 8), cal(2026, 3, 9)], [cal(2026, 11, 1), cal(2026, 11, 2)], [cal(2026, 4, 5), cal(2026, 4, 6)], [cal(2026, 10, 4), cal(2026, 10, 5)]]) {
      const lastSun = dayStart(mon) - 1;
      expect(store.localISODate(new Date(stats.thisMonday(0, new Date(lastSun))))).toBe(iso(addDays(sun, -6)));
      expect(store.localISODate(new Date(stats.thisMonday(0, new Date(dayStart(mon)))))).toBe(iso(mon));
    }
  });
  test('tydzień ISO 53 roku 2026: 28.12.2026–3.01.2027 to jeden tydzień statystyk; 4.01.2027 to tydzień 1', () => {
    expect(isoWeek(cal(2026, 12, 31))).toEqual({ year: 2026, week: 53 }); expect(isoWeek(cal(2027, 1, 3))).toEqual({ year: 2026, week: 53 }); expect(isoWeek(cal(2027, 1, 4))).toEqual({ year: 2027, week: 1 });
    expect(isoWeek(cal(2026, 1, 1))).toEqual({ year: 2026, week: 1 }); expect(isoWeek(cal(2028, 1, 1))).toEqual({ year: 2027, week: 52 });
    for (let c = cal(2026, 12, 28); c.y === 2026 || c.d <= 3; c = addDays(c, 1)) expect(store.localISODate(new Date(stats.thisMonday(0, new Date(at(c.y, c.mo, c.d, 12)))))).toBe('2026-12-28');
    expect(store.localISODate(new Date(stats.thisMonday(0, new Date(at(2027, 1, 4, 0, 30)))))).toBe('2027-01-04');
    expect(store.localISODate(new Date(stats.thisMonday(-1, new Date(at(2027, 1, 4, 0, 30)))))).toBe('2026-12-28');
  });
  test('rok przestępny: 29.02.2028 (wtorek) → poniedziałek 28.02; tydzień po nim zaczyna się 6.03 (nie 7.03)', () => {
    expect(dow(cal(2028, 2, 29))).toBe(1);
    expect(store.localISODate(new Date(stats.thisMonday(0, new Date(at(2028, 2, 29, 23, 59)))))).toBe('2028-02-28');
    expect(store.localISODate(new Date(stats.thisMonday(1, new Date(at(2028, 2, 29, 0, 0)))))).toBe('2028-03-06');
    expect(store.localISODate(new Date(stats.thisMonday(-1, new Date(at(2028, 3, 6, 9)))))).toBe('2028-02-28');
  });
});

describe('weeklyTotals / weeklySetsByMuscle / weeklyVolumeByMuscle — przydział treningów do tygodni', () => {
  /** Oczekiwany indeks kubełka: tydzień (poniedziałek) daty lokalnej startu względem tygodnia „teraz”. */
  const expIdx = (start: number, now: number, weeks: number) => { const a = mondayOf(calOf(start)), b = mondayOf(calOf(now)); const diff = Math.round((Date.UTC(b.y, b.mo - 1, b.d) - Date.UTC(a.y, a.mo - 1, a.d)) / (7 * DAY)); return weeks - 1 - diff; };
  test('brzegi tygodni wokół zmian czasu, sylwestra, 29.02 i treningów przez północ — kubełek wg daty lokalnej startu', async () => {
    await fresh();
    const cases: [number, number][] = []; /* [start, czas trwania] */
    for (const mon of [cal(2026, 3, 30), cal(2026, 10, 26), cal(2026, 3, 9), cal(2026, 11, 2), cal(2026, 4, 6), cal(2026, 10, 5), cal(2027, 1, 4), cal(2028, 3, 6)]) {
      const s = dayStart(mon); cases.push([s - 1, H], [s, H], [s - 30 * MIN, 2 * H] /* niedziela 23:30 → poniedziałek 01:30 */, [dayStart(addDays(mon, -7)), H]);
    }
    for (const e of EDGES) cases.push([e - MIN, H], [e, H]);
    cases.push([at(2026, 12, 31, 23, 30), 90 * MIN], [at(2028, 2, 29, 23, 0), 2 * H]);
    const ids = new Map<string, number>(); for (const [s, dur] of cases) { const w = addWorkout(s, [[BENCH, [{ weight: 100, reps: 5 }]]]); w.finishedAt = s + dur; ids.set(w.id, s); }
    store.save();
    for (const now of [at(2026, 4, 12, 20), at(2026, 11, 8, 20), at(2027, 1, 10, 12), at(2028, 3, 12, 12), at(2026, 10, 11, 12)]) {
      const W = 10; const got = stats.weeklyTotals(W, new Date(now));
      const exp = Array.from({ length: W }, (_, i) => ({ weekStart: dayStart(addDays(mondayOf(calOf(now)), 7 * (i - (W - 1)))), workouts: 0, sets: 0 }));
      for (const s of ids.values()) { const i = expIdx(s, now, W); if (i >= 0 && i < W) { exp[i].workouts++; exp[i].sets++; } }
      expect(got.map(g => ({ weekStart: g.weekStart, workouts: g.workouts, sets: g.sets }))).toEqual(exp);
      expect(got.every(g => g.volume === g.sets * 500)).toBe(true);
      /* serie per partia i objętość per partia: ten sam tydzień co weeklyTotals (koniec = następny poniedziałek z kalendarza) */
      for (const g of got) { const m = stats.weeklySetsByMuscle(g.weekStart); const v = stats.weeklyVolumeByMuscle(g.weekStart); const main = ex(BENCH).muscles![0];
        expect(m[main] ?? 0).toBe(g.sets); expect(v[main] ?? 0).toBe(g.volume); }
    }
  });
  test('tydzień ze zmianą czasu ma 167/169 h (lub 167,5/168,5 h) — kolejne weekStart to kolejne poniedziałki lokalnie', async () => {
    await fresh(); const now = at(2026, 12, 1, 12); const got = stats.weeklyTotals(52, new Date(now));
    for (let i = 1; i < got.length; i++) { const a = calOf(got[i - 1].weekStart), b = calOf(got[i].weekStart); expect(iso(b)).toBe(iso(addDays(a, 7))); expect(dow(b)).toBe(0);
      const lenH = (got[i].weekStart - got[i - 1].weekStart) / H; const shift = (offsetMin(got[i].weekStart) - offsetMin(got[i - 1].weekStart)) / 60; expect(lenH).toBe(168 - shift); }
  });
});

/* ======================= 4. trening wstecz: parseWhen, shiftDate, defaultPastWhen, beginPast, beginEdit ======================= */
describe('parseWhen (pola WhenFields) — daty i godziny poprawne i błędne', () => {
  const NOW = Date.UTC(2029, 0, 1);
  const ERR_DATE = (now: number) => `Nieprawidłowa data. Wpisz RRRR-MM-DD, np. ${iso(calOf(now))}.`;
  const ERR_TIME = 'Nieprawidłowa godzina. Wpisz GG:MM, np. 18:00.';
  const ERR_MIN = 'Czas trwania: od 1 do 1440 minut.';
  beforeEach(async () => { await fresh(); });
  test.each([
    ['2026-02-30'], ['2026-13-45'], ['2026-00-10'], ['2026-12-32'], ['2026-04-31'], ['2027-02-29' /* 2027 nieprzestępny */], ['2100-02-29' /* wiek nieprzestępny */],
    ['1969-12-31'], ['0099-01-01'], ['2026/03/01'], ['26-03-01'], ['2026-3'], [''], ['  '], ['2026-03-01x'], ['2026-1-1-1'],
  ])('data %p → „Nieprawidłowa data” z dzisiejszą datą lokalną w przykładzie', (d) => {
    expect(edit.parseWhen(d, '18:00', '60', NOW)).toEqual({ error: ERR_DATE(NOW) });
  });
  test.each([['24:00'], ['23:60'], ['25:00'], ['7:5'], ['18'], ['18:000'], ['-1:00'], ['18-00'], [''], ['12:30 PM']])('godzina %p → „Nieprawidłowa godzina”', (tm) => {
    expect(edit.parseWhen('2026-07-15', tm, '60', NOW)).toEqual({ error: ERR_TIME });
  });
  test.each([['0'], ['1441'], ['-5'], ['1.5'], ['1e3'], [''], ['abc'], ['10000']])('czas trwania %p → błąd zakresu', (m) => {
    expect(edit.parseWhen('2026-07-15', '18:00', m, NOW)).toEqual({ error: ERR_MIN });
  });
  test.each([
    ['2028-02-29', '12:00'], ['2028-2-29', '7:05'], [' 2026-12-31 ', ' 23:59 '], ['2027-01-01', '00:00'], ['2026-07-15', '18.30'], ['1970-01-02', '00:00'],
    ['2026-03-29', '12:00'], ['2026-10-25', '12:00'], ['2026-03-08', '12:00'], ['2026-11-01', '12:00'], ['2026-04-05', '12:00'], ['2026-10-04', '12:00'],
  ])('poprawne %p %p → start z wyroczni, koniec = start + czas trwania (przez północ i sylwestra też)', (d, tm) => {
    const dm = /(\d+)-(\d+)-(\d+)/.exec(d)!, tt = /(\d+)[:.](\d+)/.exec(tm)!; const exp = at(+dm[1], +dm[2], +dm[3], +tt[1], +tt[2]);
    expect(edit.parseWhen(d, tm, '90', NOW)).toEqual({ start: exp, end: exp + 90 * MIN });
  });
  test('trening przez północ i sylwestra: 2026-12-31 23:30 + 90 min kończy się 2027-01-01 01:00 czasu lokalnego (gdy po drodze nie ma zmiany czasu)', () => {
    const r = edit.parseWhen('2026-12-31', '23:30', '90', NOW) as { start: number; end: number };
    expect(iso(calOf(r.end))).toBe('2027-01-01'); expect(edit.dateText(r.start)).toBe('2026-12-31');
    if (offsetMin(r.start) === offsetMin(r.end)) expect(edit.timeText(r.end)).toBe('01:00');
  });
  test('koniec dokładnie „teraz” jest dozwolony, 1 ms później — błąd przyszłości z datą i godziną lokalną', () => {
    const s = at(2026, 7, 15, 18, 0); expect(edit.parseWhen('2026-07-15', '18:00', '60', s + H)).toEqual({ start: s, end: s + H });
    expect(edit.parseWhen('2026-07-15', '18:00', '60', s + H - 1)).toEqual({ error: `Koniec treningu (2026-07-15 19:00) jest w przyszłości. Zmień datę, godzinę albo czas trwania.` });
  });
  test('luka zmiany czasu (godzina nie istnieje) → komunikat o zmianie czasu; pierwsza minuta po luce — poprawna', () => {
    for (const g of GAPS) { const w = wall(g.at - MIN); const m = w.h * 60 + w.mi + 1; const hh = Math.floor(m / 60), mm = m % 60;
      expect(wallToUtc(w.y, w.mo, w.d, hh, mm)).toEqual([]);
      expect(edit.parseWhen(iso(w), `${pad(hh)}:${pad(mm)}`, '60', NOW)).toEqual({ error: `Godzina ${pad(hh)}:${pad(mm)} nie istnieje tego dnia (zmiana czasu). Wpisz inną.` });
      const a = wall(g.at); expect(edit.parseWhen(iso(a), `${pad(a.h)}:${pad(a.mi)}`, '60', NOW)).toEqual({ start: g.at, end: g.at + H }); }
    /* strefa bez zmian czasu: 02:30 w dniach przejść UE i USA istnieje */
    if (!GAPS.length) for (const d of ['2026-03-29', '2026-03-08']) expect('start' in edit.parseWhen(d, '02:30', '60', NOW)).toBe(true);
  });
  test('godzina powtórzona (cofnięcie zegara) → jedna z dwóch chwil, wg ECMAScript wcześniejsza; czas trwania liczony w prawdziwych minutach', () => {
    for (const f of FOLDS) { const w = wall(f.at); const c = wallToUtc(w.y, w.mo, w.d, w.h, w.mi); expect(c).toHaveLength(2);
      const r = edit.parseWhen(iso(w), `${pad(w.h)}:${pad(w.mi)}`, '60', NOW) as { start: number; end: number };
      expect(r.start).toBe(c[0]); expect(r.end - r.start).toBe(H); }
  });
});

describe('shiftDate (‹ › w WhenFields) — dzień kalendarzowy, nie 24 h', () => {
  test('krok ±1 przez 2026–2028 zgadza się z kalendarzem (DST, koniec miesiąca, sylwester, 29.02)', () => {
    const bad: string[] = [];
    for (let c = cal(2026, 1, 1); c.y < 2029; c = addDays(c, 1)) for (const n of [-1, 1, 7, -7]) { const e = iso(addDays(c, n)); const g = edit.shiftDate(iso(c), n); if (g !== e) bad.push(`${iso(c)}${n > 0 ? '+' : ''}${n}: ${g} ≠ ${e}`); }
    expect(bad).toEqual([]);
  });
  test('wartości brzegowe wprost', () => {
    expect(edit.shiftDate('2026-12-31', 1)).toBe('2027-01-01'); expect(edit.shiftDate('2027-01-01', -1)).toBe('2026-12-31');
    expect(edit.shiftDate('2028-02-28', 1)).toBe('2028-02-29'); expect(edit.shiftDate('2028-03-01', -1)).toBe('2028-02-29'); expect(edit.shiftDate('2027-03-01', -1)).toBe('2027-02-28');
    expect(edit.shiftDate('2026-03-28', 1)).toBe('2026-03-29'); expect(edit.shiftDate('2026-03-29', 1)).toBe('2026-03-30'); expect(edit.shiftDate('2026-10-25', -1)).toBe('2026-10-24');
    expect(edit.shiftDate('2026-1-5', 1)).toBe('2026-01-06'); expect(edit.shiftDate(' 2026-01-05 ', -1)).toBe('2026-01-04');
  });
  test.each([['abc'], [''], ['2026/01/01'], ['2026-01'], ['20260101']])('nieczytelna data %p zostaje bez zmian', (d) => { expect(edit.shiftDate(d, 1)).toBe(d); expect(edit.shiftDate(d, -1)).toBe(d); });
  /* ZNALEZISKO (NISKIE): lib/edit.ts:250-254 — komentarz mówi „Nieczytelna data zostaje bez zmian”, a parseStart (lib/edit.ts:262) odrzuca
   * 2026-02-30 / 2026-13-45 jako „Nieprawidłowa data”. shiftDate sprawdza tylko kształt, więc ‹ › po literówce po cichu zamienia ją
   * w inną datę (2026-02-30 › → 2026-03-03, 2026-13-45 › → 2027-02-15) — użytkownik nie widzi, że wpisał błąd. */
  test('NAPRAWIONE 06.10: shiftDate na niemożliwej dacie (2026-02-30, 2026-13-45) zmienia ją w inną datę zamiast zostawić (lib/edit.ts:252)', () => {
    for (const d of ['2026-02-30', '2026-13-45', '2027-02-29']) { expect(edit.shiftDate(d, 1)).toBe(d); expect(edit.shiftDate(d, -1)).toBe(d); }
  });
});

describe('defaultPastWhen — wczoraj 18:00, 60 min (domyślne pola treningu wstecz)', () => {
  test('w każdej sondzie: data = wczoraj wg kalendarza lokalnego, 18:00, a parseWhen przyjmuje te pola, gdy „teraz” jest po 19:00 wczoraj', async () => {
    await fresh(); const bad: string[] = [];
    for (const t of PROBES) { const r = edit.defaultPastWhen(new Date(t)); const y = addDays(calOf(t), -1);
      if (r.date !== iso(y) || r.time !== '18:00' || r.min !== '60') bad.push(`${new Date(t).toISOString()}: ${JSON.stringify(r)}`);
      const p = edit.parseWhen(r.date, r.time, r.min, t); if (!('start' in p) || p.start !== at(y.y, y.mo, y.d, 18)) bad.push('parse ' + new Date(t).toISOString()); }
    expect(bad).toEqual([]);
  });
  test('1 stycznia 00:05 → 2026-12-31; 1 marca 2028 → 2028-02-29; 1 marca 2027 → 2027-02-28', () => {
    expect(edit.defaultPastWhen(new Date(at(2027, 1, 1, 0, 5))).date).toBe('2026-12-31');
    expect(edit.defaultPastWhen(new Date(at(2028, 3, 1, 9))).date).toBe('2028-02-29');
    expect(edit.defaultPastWhen(new Date(at(2027, 3, 1, 9))).date).toBe('2027-02-28');
  });
});

describe('beginPast / beginEdit / checkDraft — pola terminu w szkicu', () => {
  beforeEach(async () => { await fresh(); edit.__resetDrafts(); });
  test('beginPast: pola daty, godziny i minut z wyroczni; nieruszone pola zapisują start co do ms (także przez północ i w dniu DST)', () => {
    for (const [s, dur] of [[at(2026, 12, 31, 23, 30), 90 * MIN], [at(2028, 2, 29, 22, 15), 3 * H], ...EDGES.map(e => [e - 30 * MIN, H] as [number, number])] as [number, number][]) {
      const d = edit.beginPast(null, s, s + dur); const w = wall(s);
      expect([d.date, d.time, d.min]).toEqual([iso(w), `${pad(w.h)}:${pad(w.mi)}`, String(Math.round(dur / MIN))]);
      edit.draftAddExercise(d.key, ex(BENCH)); const st = d.w.exercises[0].sets[0]; st.weight = 80; st.reps = 5;
      const c = edit.checkDraft(d.key, Date.UTC(2029, 0, 1)) as { w: { startedAt: number; finishedAt: number } };
      expect(c.w.startedAt).toBe(s); expect(c.w.finishedAt).toBe(s + dur); edit.discardDraft(d.key);
    }
  });
  test('druga (późniejsza) wystąpienie powtórzonej godziny: zmiana samego czasu trwania nie przesuwa startu na pierwsze', () => {
    for (const f of FOLDS) { const w = wall(f.at); const c = wallToUtc(w.y, w.mo, w.d, w.h, w.mi); const s = c[1];
      const d = edit.beginPast(null, s, s + H); edit.draftAddExercise(d.key, ex(BENCH)); Object.assign(d.w.exercises[0].sets[0], { weight: 80, reps: 5 });
      edit.draftSetWhen(d.key, { min: '45' });
      const r = edit.checkDraft(d.key, Date.UTC(2029, 0, 1)) as { w: { startedAt: number; finishedAt: number } };
      expect(r.w.startedAt).toBe(s); expect(r.w.finishedAt).toBe(s + 45 * MIN); }
  });
  test('beginEdit treningu przez północ (sobota 23:00 → niedziela 01:30): data = dzień startu; zmiana daty o +1 dzień przesuwa o dobę kalendarzową z tą samą godziną', () => {
    const s = at(2026, 12, 31, 23, 0); const w = addWorkout(s, [[BENCH, [{ weight: 100, reps: 5 }]]]); w.finishedAt = s + 150 * MIN; store.save();
    const d = edit.beginEdit(w.id)!; expect([d.date, d.time, d.min]).toEqual(['2026-12-31', '23:00', '150']);
    edit.draftSetWhen(d.key, { date: edit.shiftDate(d.date, 1) }); expect(d.date).toBe('2027-01-01');
    const r = edit.checkDraft(d.key, Date.UTC(2029, 0, 1)) as { w: { startedAt: number; finishedAt: number; exercises: { sets: { completedAt: number }[] }[] } };
    expect(r.w.startedAt).toBe(at(2027, 1, 1, 23, 0)); expect(r.w.finishedAt - r.w.startedAt).toBe(150 * MIN);
    expect(r.w.exercises[0].sets[0].completedAt).toBe(r.w.startedAt); /* godzina serii przesunięta razem ze startem */
  });
  test('przesunięcie treningu przez zmianę czasu: data +1 dzień zachowuje godzinę ścienną (start różni się o 23/25 h, nie 24 h)', () => {
    for (const e of EDGES) { const before = addDays(calOf(e), -1); const s = at(before.y, before.mo, before.d, 12, 0);
      const w = addWorkout(s, [[BENCH, [{ weight: 100, reps: 5 }]]]); store.save(); const d = edit.beginEdit(w.id)!;
      edit.draftSetWhen(d.key, { date: edit.shiftDate(d.date, 1) }); const r = edit.checkDraft(d.key, Date.UTC(2029, 0, 1)) as { w: { startedAt: number } };
      const nx = addDays(before, 1); expect(r.w.startedAt).toBe(at(nx.y, nx.mo, nx.d, 12, 0)); expect(edit.timeText(r.w.startedAt)).toBe('12:00');
      edit.discardDraft(d.key); store.deleteWorkout(w.id); }
  });
});

/* ======================= 5. fmtDate / fmtTime ======================= */
describe('fmtDate / fmtTime — godzina i dzień lokalnie, rok tylko poza bieżącym rokiem lokalnym', () => {
  beforeEach(async () => { await fresh(); });
  test('fmtTime = GG:MM z wyroczni w każdej sondzie (pl-PL, 24 h)', () => {
    const bad: string[] = []; for (const t of PROBES) { const w = wall(t); const s = store.fmtTime(t); if (s !== `${pad(w.h)}:${pad(w.mi)}`) bad.push(`${new Date(t).toISOString()}: ${s}`); }
    expect(bad).toEqual([]);
  });
  test('fmtDate: numer dnia z wyroczni; rok pokazany dokładnie wtedy, gdy rok lokalny daty ≠ bieżący rok lokalny (sylwester / Nowy Rok)', () => {
    const NY = dayStart(cal(2027, 1, 1));
    const cases: [number, number, boolean][] = [ /* [teraz, data, rok widoczny] */
      [NY - MIN, NY - 2 * H, false], [NY - MIN, at(2026, 1, 1, 0, 0), false], [NY - MIN, dayStart(cal(2026, 1, 1)) - 1, true],
      [NY + MIN, NY - MIN, true], [NY + MIN, NY, false], [at(2028, 2, 29, 12), at(2028, 2, 29, 9), false], [at(2029, 1, 1, 12), at(2028, 2, 29, 9), true],
    ];
    for (const [now, ts, year] of cases) { clock(now); const s = store.fmtDate(ts); const w = wall(ts);
      expect(s).toMatch(new RegExp(`(^|\\D)${w.d}(\\D|$)`)); expect(s.includes(String(w.y))).toBe(year); }
  });
  test('fmtDate 29.02.2028 i 31.12.2026 — dzień tygodnia zgodny z kalendarzem (wt., czw.)', () => {
    clock(at(2028, 6, 1, 12)); expect(store.fmtDate(at(2028, 2, 29, 12))).toMatch(/^wt\.?,? 29 lut/);
    clock(at(2026, 12, 31, 20)); expect(store.fmtDate(at(2026, 12, 31, 23, 59))).toMatch(/^czw\.?,? 31 gru/);
  });
});

/* ======================= 6. porzucony trening: 2 h pytanie, 6 h cichy zapis ======================= */
describe('porzucony trening — progi 2 h / 6 h w prawdziwym czasie, nie w godzinach zegara (DST)', () => {
  test('STALE_AUTO_MS = 6 h, STALE_ASK_MS = 2 h; przy każdej zmianie czasu zapis następuje dokładnie po 6 h od ostatniej serii', async () => {
    expect(store.STALE_AUTO_MS).toBe(6 * H); expect(store.STALE_ASK_MS).toBe(2 * H);
    for (const e of EDGES) for (const lead of [-H, -10 * MIN, 0, 3 * H]) { /* ostatnia seria tuż przed/po przejściu albo 3 h przed */
      const t0 = e - 3 * H + lead; clock(t0 - 30 * MIN); await fresh(); store.startEmpty(); store.addExerciseToActive(ex(BENCH));
      const a = store.getState().active!; Object.assign(a.exercises[0].sets[0], { weight: 100, reps: 5 }); store.save(a);
      jest.setSystemTime(t0); store.toggleDone(0, 0); expect(a.exercises[0].sets[0].completedAt).toBe(t0);
      expect(store.staleSince(t0 + 2 * H - 1)).toBeNull(); expect(store.staleSince(t0 + 2 * H)).toBe(t0);
      jest.setSystemTime(t0 + 6 * H - 1); expect(store.autoFinishStale(t0 + 6 * H - 1)).toBeNull(); expect(store.getState().active).not.toBeNull();
      jest.setSystemTime(t0 + 6 * H); const w = store.autoFinishStale(t0 + 6 * H)!; expect(w).not.toBeNull();
      expect(w.finishedAt).toBe(t0); expect(store.getState().active).toBeNull(); }
  });
});

/* ======================= 7. timer przerwy: endAt w ms, przez zmianę czasu ======================= */
describe('timer przerwy — koniec = start + sekundy (bez zegara ściennego), także przez zmianę czasu', () => {
  test('start(90) 30 s przed przejściem: endAt − teraz = 90 000 ms, powiadomienie TIME_INTERVAL 90 s, Live Activity z tym samym końcem', async () => {
    for (const e of EDGES) { clock(e - 30e3); await fresh(); store.startEmpty(); store.addExerciseToActive(ex(BENCH));
      global.__notifications.length = 0; global.__la.length = 0;
      await timer.start(90, 'x'); expect(timer.T.endAt).toBe(e + 60e3); expect(store.getState().timer.restEndAt).toBe(e + 60e3);
      const n = (global.__notifications as any[]).filter(x => x.identifier !== 'stale-reminder').pop(); expect(n.trigger).toEqual({ type: 'timeInterval', seconds: 90, repeats: false });
      const la = (global.__la as any[]).find(x => x[0] === 'start'); expect(la[3]).toBe(e + 60e3);
      jest.setSystemTime(e + 60e3 - 1); timer.onForeground(); expect(timer.T.alarmed).toBe(false);
      jest.setSystemTime(e + 60e3); timer.onForeground(); expect(timer.T.alarmed).toBe(true);
      await timer.stop(); }
  });
  test('restore() po restarcie aplikacji przez zmianę czasu: przerwa wraca z tym samym końcem i resztą sekund', async () => {
    for (const e of EDGES) { clock(e - 40e3); await fresh(); store.startEmpty(); store.addExerciseToActive(ex(BENCH)); await timer.start(120, 'x'); const end = timer.T.endAt;
      await store.flush(); const st = saved(); timer.T.on = false;
      jest.setSystemTime(e + 20e3); await fresh(st); global.__notifications.length = 0; await timer.restore();
      expect(timer.T.on).toBe(true); expect(timer.T.endAt).toBe(end); expect(timer.T.endAt - Date.now()).toBe(60e3);
      const n = (global.__notifications as any[]).find(x => x.trigger?.type === 'timeInterval'); expect(n.trigger.seconds).toBe(60);
      await timer.stop(); }
  });
  test('adjust(+15/−15) przez przejście czasu zmienia koniec o dokładnie 15 000 ms', async () => {
    const e = EDGES[0]; clock(e - 10e3); await fresh(); store.startEmpty(); await timer.start(60, null); const end = timer.T.endAt;
    jest.setSystemTime(e + 5e3); await timer.adjust(15); expect(timer.T.endAt).toBe(end + 15e3); await timer.adjust(-15); expect(timer.T.endAt).toBe(end);
  });
});

/* ======================= 8. historia: kolejność przy równych godzinach, CSV ======================= */
describe('historia — kolejność przy równym starcie, deterministyczna po ponownym wczytaniu', () => {
  test('finishedWorkouts: malejąco po starcie; równe starty w kolejności zapisu, ta sama po fresh(saved())', async () => {
    await fresh(); const t = at(2026, 10, 25, 1, 30);
    const a = addWorkout(t, [[BENCH, [{ weight: 100, reps: 5 }]]], 'A'), b = addWorkout(t, [[BENCH, [{ weight: 90, reps: 5 }]]], 'B'), c = addWorkout(t - H, [[BENCH, [{ weight: 80, reps: 5 }]]], 'C'), d = addWorkout(t + H, [[BENCH, [{ weight: 70, reps: 5 }]]], 'D');
    const order = () => store.finishedWorkouts().map(w => w.templateName);
    expect(order()).toEqual(['D', 'A', 'B', 'C']); expect(order()).toEqual(['D', 'A', 'B', 'C']);
    await store.flush(); await fresh(saved()); expect(order()).toEqual(['D', 'A', 'B', 'C']); void a; void b; void c; void d;
  });
  test('trening wstecz w tej samej milisekundzie co inne sesje dostaje start +1 s (+2 s, …) i stoi wyżej na liście', async () => {
    await fresh(); const t = at(2026, 12, 31, 23, 30); addWorkout(t, [[BENCH, [{ weight: 100, reps: 5 }]]], 'A'); addWorkout(t + 1000, [[BENCH, [{ weight: 100, reps: 5 }]]], 'A1');
    edit.__resetDrafts(); const d = edit.beginPast(null, t, t + H); edit.draftAddExercise(d.key, ex(BENCH)); Object.assign(d.w.exercises[0].sets[0], { weight: 50, reps: 5 }); d.w.templateName = 'P';
    const r = edit.commitDraft(d.key, Date.UTC(2029, 0, 1)) as { w: { startedAt: number } }; expect(r.w.startedAt).toBe(t + 2000);
    expect(store.finishedWorkouts().map(w => w.templateName)).toEqual(['P', 'A1', 'A']);
  });
  test('CSV: kolumna Date = lokalna data i godzina startu (RRRR-MM-DD GG:MM:SS), trening przez północ pod dniem startu', async () => {
    await fresh(); const starts = [at(2026, 12, 31, 23, 30), at(2028, 2, 29, 0, 0), ...EDGES.map(e => e - 1000)];
    starts.forEach((s, i) => { const w = addWorkout(s, [[BENCH, [{ weight: 100, reps: 5 }]]], 'W' + i); w.finishedAt = s + 2 * H; }); store.save();
    const rows = buildCsv().trim().split('\n').slice(1); const got = new Map(rows.map(r => [r.split(',')[1], r.split(',')[0]]));
    starts.forEach((s, i) => { const w = wall(s); expect(got.get('W' + i)).toBe(`${iso(w)} ${pad(w.h)}:${pad(w.mi)}:${pad(w.s)}`); });
  });
});

/* ======================= 9. podpis aplikacji: dni kalendarzowe, przypomnienie dzień wcześniej 18:00 ======================= */
describe('signing — calendarDaysLeft i reminderAt w dniach kalendarzowych', () => {
  test('calendarDaysLeft = różnica dat lokalnych (0 = dziś, 1 = jutro) także przez zmianę czasu i sylwestra', () => {
    const bad: string[] = [];
    for (const now of PROBES.filter((_, i) => i % 7 === 0)) for (const plusH of [1, 5, 23, 24, 25, 47, 49, 24 * 29]) { const e = now + plusH * H;
      const a = calOf(now), b = calOf(e); const exp = Math.round((Date.UTC(b.y, b.mo - 1, b.d) - Date.UTC(a.y, a.mo - 1, a.d)) / DAY);
      const got = calendarDaysLeft(new Date(e), new Date(now)); if (got !== exp) bad.push(`${new Date(now).toISOString()} +${plusH}h: ${got} ≠ ${exp}`); }
    expect(bad).toEqual([]);
    const n = at(2026, 7, 1, 12); expect(calendarDaysLeft(new Date(n), new Date(n))).toBe(-1); expect(calendarDaysLeft(new Date(n + 31 * DAY), new Date(n))).toBeNull();
  });
  test('reminderAt = dzień kalendarzowy przed wygaśnięciem, 18:00 lokalnie (1.01 → 31.12, 1.03.2028 → 29.02, dni DST)', () => {
    for (const e of [at(2027, 1, 1, 0, 30), at(2028, 3, 1, 9), at(2027, 3, 1, 9), ...EDGES.map(x => x + 12 * H)]) { const p = addDays(calOf(e), -1);
      expect(reminderAt(new Date(e)).getTime()).toBe(at(p.y, p.mo, p.d, 18, 0)); }
  });
});

/* ======================= 10. przepływ CI: macierz stref ======================= */
describe('.github/workflows/tests-tz.yml — macierz stref czasowych w CI', () => {
  const file = path.join(__dirname, '..', '.github', 'workflows', 'tests-tz.yml');
  const y = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  test('plik istnieje: ręcznie i codziennie, ubuntu-latest, tylko odczyt repozytorium, bez sekretów', () => {
    expect(y).not.toBe('');
    expect(y).toMatch(/^\s*workflow_dispatch:/m); expect(y).toMatch(/^\s*schedule:\s*\n\s*-\s*cron:\s*['"][^'"]+['"]/m);
    expect(y).toMatch(/runs-on:\s*ubuntu-latest/); expect(y).toMatch(/permissions:\s*\n\s*contents:\s*read/);
    expect(y).not.toMatch(/secrets\./);
  });
  test('macierz zawiera każdą strefę z listy (usunięcie strefy psuje test) i przekazuje ją jako TZ do jest', () => {
    const m = /matrix:\s*\n\s*tz:\s*\n((?:\s*-\s*.+\n)+)/.exec(y); expect(m).not.toBeNull();
    const zones = m![1].split('\n').map(l => l.replace(/^\s*-\s*/, '').replace(/['"]/g, '').replace(/\s+#.*$/, '').trim()).filter(Boolean);
    for (const z of CI_ZONES) expect(zones).toContain(z);
    expect(y).toMatch(/TZ=\$\{\{\s*matrix\.tz\s*\}\}\s+npx jest/); expect(y).toMatch(/fail-fast:\s*false/);
    expect(y).toMatch(/node-version:\s*['"]?22/); expect(y).toMatch(/npm ci/);
  });
  test('strefy z macierzy mają wpis w tabeli przejść tego pliku (wyrocznia sprawdza je przy uruchomieniu w tej strefie)', () => {
    for (const z of CI_ZONES) expect(KNOWN[z]).toBeDefined();
  });
});
void realNow;
