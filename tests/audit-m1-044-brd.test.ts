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
import { fresh, ex, addWorkout } from './helpers';

jest.setTimeout(60000);
const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const SCRIPT = path.join(ROOT, 'scripts/kontrola-brd.mjs');
/* M1-audytor-generalny-022 (28.10.2026): wszystkie pliki BRD (errata, wymagania dzielone ponad ok. 20 KB), nie stała lista */
const brd = fs.readdirSync(path.join(ROOT, 'docs/brd')).filter((f) => f.endsWith('.md')).sort().map((f) => read(`docs/brd/${f}`)).join('\n');
const H = 3600e3;

type Vec = { regula: string; id: string; wejscie: Record<string, number>; oczekiwane: Record<string, number>; tolerancja: number; rodzaj: string };
const vectors = (): Vec[] => JSON.parse(read('tests/wektory/brd.json'));
const forRule = (r: string) => vectors().filter((v) => v.regula === r);
const inp = (v: Vec, name: string) => v.wejscie[Object.keys(v.wejscie).find((k) => k.startsWith(name))!];
const out = (v: Vec, name: string) => v.oczekiwane[Object.keys(v.oczekiwane).find((k) => k.startsWith(name))!];

describe('BRD (docs/brd): kontrola mechaniczna i pokrycie', () => {
  test('kontrola-brd: kod 0, bez błędów; reguły RD z wektorami', () => {
    const r = spawnSync('node', [SCRIPT, path.join(ROOT, 'docs/brd')], { encoding: 'utf8' });
    expect(r.stdout).not.toMatch(/^BŁĄD/m); expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/kontrola-brd: \d+ plików, \d+ wymagań BR, 4 reguł RD, \d+ wektorów/);
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
