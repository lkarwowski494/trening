/*
 * M1-audytor-generalny-044 (DEC-01 a): BRD odtworzony z kodu i docs w docs/brd — katalog spełnianych wymagań z regułami RD, bez ocen wartości.
 * Test: (1) skrypt kontrola-brd (scripts/kontrola-brd.mjs) przechodzi z kodem 0 (BR i RD z odwołaniami do kodu i źródeł); (2) BRD obejmuje funkcje z inwentarza
 * (generator, odczyt Zdrowia, kilka planów, Dostosuj do miejsca — DEC-04), granicę z DEC-03 i decyzję 2 h / 6 h (DEC-08); (3) brak ocen wartości;
 * (4) CLAUDE.md ma regułę aktualizacji BRD; (5) wektory RD (tests/wektory/brd.json) są zgodne z BRD i uruchomione na prawdziwych funkcjach aplikacji.
 */
import { execFileSync, spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import { e1rm } from '@/lib/stats';
import { PAYWALL, canStartLive, qualifiesForDay, type LiveStart } from '@/lib/access';
import { REPS } from '@/lib/genconst';
import { REST, setsBudget, type Goal } from '@/lib/generator';
import { DEFAULT_REST, uid } from '@/lib/seed';
import { deloadHint } from '@/lib/deload';
import { clampGoal } from '@/lib/setParts';
import { backToBack } from '@/lib/plan';
import { stepOf, type BoardKey } from '@/lib/board';
import { progressGuard } from '@/lib/guard';
import { fresh, ex, addWorkout, set } from './helpers';

jest.setTimeout(60000);
const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const SCRIPT = path.join(ROOT, 'scripts/kontrola-brd.mjs');
/* M1-audytor-generalny-022 (28.10.2026): wszystkie pliki BRD (errata, wymagania dzielone ponad ok. 20 KB), nie stała lista */
const brd = fs.readdirSync(path.join(ROOT, 'docs/brd')).filter((f) => f.endsWith('.md')).sort().map((f) => read(`docs/brd/${f}`)).join('\n');
const H = 3600e3;

type Val = number & string; /* wartości z tabel BRD: liczba, tekst albo null („—”) — typ zawężany przy użyciu */
type Vec = { regula: string; id: string; wejscie: Record<string, Val>; oczekiwane: Record<string, Val>; tolerancja: number; rodzaj: string };
const vectors = (): Vec[] => JSON.parse(read('tests/wektory/brd.json'));
const forRule = (r: string) => vectors().filter((v) => v.regula === r);
const inp = (v: Vec, name: string) => v.wejscie[Object.keys(v.wejscie).find((k) => k.startsWith(name))!];
const out = (v: Vec, name: string) => v.oczekiwane[Object.keys(v.oczekiwane).find((k) => k.startsWith(name))!];

describe('BRD (docs/brd): kontrola mechaniczna i pokrycie', () => {
  test('kontrola-brd: kod 0, bez błędów; reguły RD z wektorami', () => {
    const r = spawnSync('node', [SCRIPT, path.join(ROOT, 'docs/brd')], { encoding: 'utf8' });
    expect(r.stdout).not.toMatch(/^BŁĄD/m); expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/kontrola-brd: \d+ plików, \d+ wymagań BR, 15 reguł RD, \d+ wektorów/);
    expect(Number(/(\d+) wymagań BR/.exec(r.stdout)![1])).toBeGreaterThanOrEqual(30);
  });
  test('funkcje z inwentarza: generator, odczyt Zdrowia, kilka planów, Dostosuj do miejsca (DEC-04) mają wymagania BR', () => {
    const w = read('docs/brd/wymagania.md');
    for (const [id, re] of [['BR-GEN-001', /Generator/], ['BR-ZDR-002', /odczyt z Apple Health/i], ['BR-PLN-002', /Kilka planów/], ['BR-MJS-002', /Dostosuj do miejsca/]] as const) expect(w).toMatch(new RegExp(`### ${id}: [^\\n]*${re.source}`, re.flags));
  });
  test('główne moduły aplikacji mają wymagania: trening, plan, szablony, postępy, biblioteka, Zdrowie, zegarek, głos, dane, języki, dostęp', () => {
    const w = read('docs/brd/wymagania.md');
    for (const m of ['TRN', 'PRZ', 'SZB', 'PLN', 'GEN', 'MJS', 'PST', 'BIB', 'ZDR', 'ZEG', 'GLS', 'DAN', 'JEZ', 'ZAK', 'PRV']) expect(w).toMatch(new RegExp(`### BR-${m}-\\d{3}:`));
  });
  test('granica aplikacji (DEC-03): dieta, sen, suplementy, trener–podopieczny poza zakresem', () => {
    const r = read('docs/brd/README.md'); expect(r).toMatch(/Granica aplikacji/); for (const w of ['dieta', 'sen', 'suplementy', 'trener–podopieczny']) expect(r).toContain(w);
    expect(r).toMatch(/Poza zakresem/);
  });
  test('decyzja 2 h / 6 h (DEC-08) zapisana w README i w regule RD-03', () => {
    const r = read('docs/brd/README.md'); expect(r).toMatch(/D-008[^\n]*2 h[^\n]*6 h/); expect(read('docs/brd/reguly.md')).toMatch(/bezczynność ≥ 2 h[^\n]*bezczynność ≥ 6 h/);
  });
  test('brak ocen wartości (bez wartościujących przymiotników)', () => {
    expect(brd).not.toMatch(/\b(najlepsz\w*|świetn\w*|doskona\w+|rewelac\w+|innowac\w+|przełomow\w+|bezcenn\w+|genialn\w+|wyjątkow\w+)\b/i);
  });
  test('CLAUDE.md: nowa funkcja = aktualizacja BRD', () => {
    expect(read('CLAUDE.md')).toMatch(/BRD[^\n]*docs\/brd[^\n]*nowa funkcja|nowa funkcja[^\n]*BRD/i);
  });
  test('wektory w tests/wektory/brd.json są zgodne z BRD (generator skryptu)', () => {
    const gen = execFileSync('node', [SCRIPT, 'docs/brd', '--wektory'], { encoding: 'utf8', cwd: ROOT });
    expect(JSON.parse(gen)).toEqual(vectors());
  });
});

describe('wektory RD uruchomione na kodzie aplikacji', () => {
  test('RD-01 e1RM (Epley)', () => {
    const vs = forRule('RD-01'); expect(vs.length).toBeGreaterThanOrEqual(5);
    for (const v of vs) expect(Math.abs(e1rm(inp(v, 'Ciężar'), inp(v, 'Powtórzenia')) - out(v, 'e1RM'))).toBeLessThanOrEqual(v.tolerancja + 1e-9);
  });
  test('RD-02 RIR a RPE w skali RIR', async () => {
    await fresh(); store.getState().settings.showRpe = true; store.getState().settings.effortScale = 'rir'; store.save();
    const vs = forRule('RD-02'); expect(vs.length).toBeGreaterThanOrEqual(4);
    /* dwie tabele RD-02: wyświetlanie (wejście RPE → RIR) i wpis (wejście RIR → RPE; M1-audytor-generalny-020, DEC-04 a, 27.10.2026) */
    const show = vs.filter(v => inp(v, 'RPE') !== undefined), entry = vs.filter(v => inp(v, 'RIR') !== undefined);
    expect([show.length, entry.length]).toEqual([5, 5]);
    for (const v of show) expect(store.effortOut(inp(v, 'RPE'))).toBe(out(v, 'RIR'));
    for (const v of entry) expect({ id: v.id, rpe: store.effortIn(inp(v, 'RIR')) }).toEqual({ id: v.id, rpe: out(v, 'RPE') });
    expect(store.effortIn(7)).toBe(store.RPE_LIGHT); /* RIR 7+ zapisuje się jako RPE „lekko” (BR-TRN-007) */
  });
  test('RD-03 porzucony trening: pytanie po 2 h, ciche zakończenie po 6 h', async () => {
    const vs = forRule('RD-03'); expect(vs.length).toBeGreaterThanOrEqual(6);
    for (const v of vs) {
      const t0 = new Date(2026, 8, 1, 10).getTime(); jest.spyOn(Date, 'now').mockImplementation(() => t0);
      await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)'));
      const a = store.getState().active!; Object.assign(a.exercises[0].sets[0], { weight: 100, reps: 5 }); store.save(a); store.toggleDone(0, 0);
      const now = t0 + inp(v, 'Bezczynność') * H;
      const ask = store.staleSince(now) !== null ? 1 : 0; const end = store.autoFinishStale(now) ? 1 : 0;
      expect({ id: v.id, ask, end }).toEqual({ id: v.id, ask: out(v, 'pytanie'), end: out(v, 'zakończenie') });
      jest.restoreAllMocks();
    }
  });
  test('RD-04 serie na partię: główna 1, pomocnicza 0,5, rozgrzewka poza liczeniem', async () => {
    const vs = forRule('RD-04'); expect(vs.length).toBeGreaterThanOrEqual(5); expect(vs.some(v => v.rodzaj === 'błąd')).toBe(true);
    for (const v of vs) {
      await fresh(); const at = new Date(2026, 8, 1, 18).getTime(); const e = ex('Bench Press (sztanga)');
      const sets = [...Array.from({ length: inp(v, 'Serie robocze') }, () => ({ weight: 100, reps: 5 })), ...Array.from({ length: inp(v, 'Serie rozgrzewkowe') }, () => ({ weight: 40, reps: 10, kind: 'warmup' as const }))];
      if (sets.length) { const w = addWorkout(at, [['Bench Press (sztanga)', sets]]); if (inp(v, 'Ćwiczenie usunięte') === 1) w.exercises[0].exerciseId = 'usuniete-z-biblioteki'; /* RD-04-W5 (M1-audytor-generalny-022, 28.10.2026): wektor błędnych danych */ } store.save();
      const by = stats.setsByMuscle(at - 1000, at + 864e5); const main = e.muscles![0]; const sec = e.secondaryMuscles![0];
      expect({ id: v.id, main: by[main] ?? 0, sec: by[sec] ?? 0 }).toEqual({ id: v.id, main: out(v, 'partia główna'), sec: out(v, 'partia pomocnicza') });
    }
  });
});

/* M1-audytor-generalny-022 (01-odkrywanie-005, 28.10.2026): reguły RD-05…RD-15 z progów i wzorów w kodzie — wektory z docs/brd/reguly.md uruchomione na kodzie. */
describe('wektory RD-05…RD-15 uruchomione na kodzie aplikacji', () => {
  const DAY = 86400e3; const ON = { ...PAYWALL, ENABLED: true };
  test('każda reguła RD z tests/wektory/brd.json ma tu swój test', () => {
    const self = read('tests/audit-m1-044-brd.test.ts'); for (const r of new Set(vectors().map(v => v.regula))) expect([r, self.includes(`forRule('${r}')`)]).toEqual([r, true]);
  });
  test('RD-05 limit dni treningowych (canStartLive)', () => {
    const vs = forRule('RD-05'); expect(vs.length).toBeGreaterThanOrEqual(6); const NOW = Date.UTC(2026, 10, 15, 12);
    for (const v of vs) {
      const today = inp(v, 'Dziś') === 1; const n = inp(v, 'Dni zużyte') - (today ? 1 : 0);
      const st: LiveStart[] = [...(today ? [{ startedAt: NOW - 3600e3, tzOffsetMin: 0 }] : []), ...Array.from({ length: n }, (_, i) => ({ startedAt: NOW - (i + 1) * DAY, tzOffsetMin: 0 })),
        ...Array.from({ length: inp(v, 'Wpisy uszkodzone') }, () => ({ startedAt: NaN, tzOffsetMin: 0 }))];
      const d = canStartLive({}, [], st, NOW, 0, ON);
      expect({ id: v.id, allowed: d.allowed ? 1 : 0, left: d.remaining }).toEqual({ id: v.id, allowed: out(v, 'start dozwolony'), left: out(v, 'zostało') });
    }
  });
  test('RD-06 dzień treningowy: dłużej niż 7 min (qualifiesForDay)', () => {
    const vs = forRule('RD-06'); expect(vs.length).toBeGreaterThanOrEqual(5);
    for (const v of vs) expect({ id: v.id, day: qualifiesForDay(inp(v, 'Czas') * 60) ? 1 : 0 }).toEqual({ id: v.id, day: out(v, 'dzień zużyty') });
  });
  test('RD-07 zakresy powtórzeń generatora (REPS)', () => {
    const vs = forRule('RD-07'); expect(vs.length).toBeGreaterThanOrEqual(5); const R = REPS as Record<string, readonly [number, number] | undefined>;
    for (const v of vs) { const r = R[inp(v, 'Rola')]; expect({ id: v.id, od: r?.[0] ?? null, do: r?.[1] ?? null }).toEqual({ id: v.id, od: out(v, 'od'), do: out(v, 'do') }); }
  });
  test('RD-08 przerwy generatora (REST) i domyślna przerwa (DEFAULT_REST)', () => {
    const vs = forRule('RD-08'); expect(vs.length).toBeGreaterThanOrEqual(5); const R: Record<string, number | undefined> = { ...REST, 'domyślna': DEFAULT_REST };
    for (const v of vs) expect({ id: v.id, rest: R[inp(v, 'Rola')] ?? null }).toEqual({ id: v.id, rest: out(v, 'przerwa') });
  });
  test('RD-09 budżet serii z czasu sesji (setsBudget)', () => {
    const vs = forRule('RD-09'); expect(vs.length).toBeGreaterThanOrEqual(3);
    for (const v of vs) expect({ id: v.id, n: setsBudget(inp(v, 'Cel') as Goal, inp(v, 'Minuty')) }).toEqual({ id: v.id, n: out(v, 'serie') });
  });
  test('RD-10 podpowiedź deloadu po ≥ 4 tygodniach treningu z rzędu (deloadHint)', async () => {
    const vs = forRule('RD-10'); expect(vs.length).toBeGreaterThanOrEqual(5); const NOW = new Date(2026, 9, 8, 9).getTime(); /* czwartek; trening we wtorki */
    for (const v of vs) {
      await fresh(); store.getState().deloadSnooze = undefined;
      for (let i = 0; i < inp(v, 'Tygodnie'); i++) addWorkout(new Date(2026, 9, 6 - 7 * i, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
      for (let i = 1; i <= inp(v, 'Treningi z przyszłości'); i++) addWorkout(new Date(2026, 9, 8 + 7 * i, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
      store.save(); expect({ id: v.id, hint: deloadHint(NOW).kind === 'suggest' ? 1 : 0 }).toEqual({ id: v.id, hint: out(v, 'podpowiedź') });
    }
  });
  test('RD-11 cel serii na partię: ręczny w granicach 1–40 albo automatycznie 10 (clampGoal, setsGoal)', async () => {
    const vs = forRule('RD-11'); expect(vs.length).toBeGreaterThanOrEqual(5);
    for (const v of vs) {
      await fresh(); const s = store.getState().settings; const m = inp(v, 'Cel ręczny');
      if (m == null) delete s.weeklySetGoals; else s.weeklySetGoals = { klatka: clampGoal(m) }; store.save();
      expect({ id: v.id, goal: stats.setsGoal('klatka') }).toEqual({ id: v.id, goal: out(v, 'cel') });
    }
  });
  test('RD-12 udział masy ciała w e1RM (liftedLoad + e1rm)', async () => {
    await fresh(); const vs = forRule('RD-12'); expect(vs.length).toBeGreaterThanOrEqual(5);
    for (const v of vs) {
      const e = ex(inp(v, 'Ćwiczenie')); const reps = inp(v, 'Powtórzenia'); const bm = inp(v, 'Masa ciała') ?? undefined;
      const val = e1rm(stats.liftedLoad(e, set({ addKg: inp(v, 'Dociążenie'), reps }), bm), reps);
      expect([v.id, Math.abs(val - out(v, 'e1RM')) <= v.tolerancja + 1e-9]).toEqual([v.id, true]);
    }
  });
  test('RD-13 ostrzeżenie: te same główne partie dzień po dniu (backToBack)', async () => {
    const vs = forRule('RD-13'); expect(vs.length).toBeGreaterThanOrEqual(4);
    for (const v of vs) {
      await fresh(); const mk = (name: string) => { const t = store.newTemplate(); t.items = [{ id: uid(), exerciseId: ex(name).id, sets: 3, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }]; return t.id; };
      const a = mk('Back Squat'); const b = inp(v, 'Wspólna partia') === 1 ? mk('Back Squat') : mk('Bench Press (sztanga)'); store.save();
      const from = '2026-11-02'; const second = `2026-11-0${2 + inp(v, 'Odstęp')}`; const plan: Record<string, string> = { [from]: a, [second]: inp(v, 'Szablon usunięty') === 1 ? 'usuniety-szablon' : b };
      const pairs = backToBack(from, 10, k => plan[k] ?? null, { muscles: new Map(), tpls: new Map() });
      expect({ id: v.id, n: pairs.length }).toEqual({ id: v.id, n: out(v, 'ostrzeżenia') });
    }
  });
  test('RD-14 krok ± na tablicy (stepOf)', async () => {
    const vs = forRule('RD-14'); expect(vs.length).toBeGreaterThanOrEqual(5); await fresh();
    const byMetric = (m: string) => store.getState().exercises.find(e => e.metric === m)!.name;
    const FIELD: Record<string, [string, BoardKey]> = { sztanga: ['Bench Press (sztanga)', 'weight'], hantle: ['Bench Press (hantle)', 'weight'], 'masa ciała': ['Pull Up', 'addKg'], czas: [byMetric('time'), 'durationSec'], dystans: [byMetric('distance_time'), 'distanceM'] };
    for (const v of vs) {
      const [name, key] = FIELD[inp(v, 'Pole')]; if (store.getState().active) store.cancelWorkout(); store.startEmpty(); store.addExerciseToActive(ex(name));
      const a = store.getState().active!; const base = inp(v, 'Wartość'); const r = stepOf(a, a.exercises[0], key, inp(v, 'Kierunek') as 1 | -1, base == null ? '' : base);
      expect({ id: v.id, to: r.to }).toEqual({ id: v.id, to: out(v, 'wynik') });
    }
  });
  test('RD-15 Strażnik progresji: kierunek partii tydzień do tygodnia (progressGuard)', async () => {
    const vs = forRule('RD-15'); expect(vs.length).toBeGreaterThanOrEqual(6); const NOW = new Date(2026, 9, 8, 9).getTime(); /* czwartek; poprzedni tydzień 28.09–4.10 */
    jest.useFakeTimers({ now: NOW });
    try {
      for (const v of vs) {
        await fresh(); const sets = (n: number, w: number) => Array.from({ length: n }, () => ({ weight: w, reps: 5 }));
        if (inp(v, 'Serie poprzednie') > 0) addWorkout(new Date(2026, 9, 1, 18).getTime(), [['Back Squat', sets(inp(v, 'Serie poprzednie'), inp(v, 'Ciężar poprzedni'))]], 'p');
        addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', sets(inp(v, 'Serie bieżące'), inp(v, 'Ciężar bieżący'))]], 'c'); store.save();
        const p = progressGuard(NOW, 0).parts.find(x => x.part === 'czworogłowe')!; expect({ id: v.id, dir: p.dir }).toEqual({ id: v.id, dir: out(v, 'kierunek') });
      }
    } finally { jest.useRealTimers(); }
  });
});
