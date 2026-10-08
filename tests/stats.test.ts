/* Runda 73 — testy statystyk dopisane po testach mutacyjnych (Stryker): każdy blok zabija mutanty, które wcześniej przeżyły
 * albo nie miały pokrycia w szybkim zestawie (sumy na treningu, sesje, rekordy, kolejność PR, wykresy, sumy tygodniowe). */
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as units from '@/lib/units';
import { fresh, ex, addWorkout, set } from './helpers';

const at = (y: number, m: number, d: number, h = 18) => new Date(y, m - 1, d, h).getTime();
beforeEach(async () => { await fresh(); store.save(); });
afterEach(() => { units.applyUnit('kg'); });

describe('suma na treningu (rekord) — rodzaj, wkład serii, format', () => {
  test('rodzaj sumy wg metryki i sprzętu; brak metryki = ciężar × powtórzenia', () => {
    expect(stats.totalKind(ex('Back Squat'))).toBe('objętość treningu');
    expect(stats.totalKind(ex('Pull Up'))).toBe('suma powtórzeń');
    expect(stats.totalKind(ex('Burpees'))).toBe('suma powtórzeń');
    expect(stats.totalKind(ex('Plank'))).toBe('łączny czas');
    expect(stats.totalKind(ex("Farmer's Walk"))).toBe('łączny czas');
    expect(stats.totalKind(ex('Bieg'))).toBe('łączny dystans');
    expect(stats.totalKind({ ...ex('Back Squat'), metric: undefined } as any)).toBe('objętość treningu');
  });
  test('wkład serii: rozgrzewka 0; czas, dystans, powtórzenia bez asysty', () => {
    expect(stats.setTotal(ex('Back Squat'), set({ weight: 100, reps: 5 }))).toBe(500);
    expect(stats.setTotal(ex('Back Squat'), set({ weight: 100, reps: 5, kind: 'warmup' }))).toBe(0);
    expect(stats.setTotal(ex('Plank'), set({ durationSec: 45 }))).toBe(45); expect(stats.setTotal(ex('Plank'), set({ durationSec: '' }))).toBe(0);
    expect(stats.setTotal(ex('Plank'), set({ durationSec: 45, kind: 'warmup' }))).toBe(0);
    expect(stats.setTotal(ex('Bieg'), set({ distanceM: 3000, durationSec: 900 }))).toBe(3000); expect(stats.setTotal(ex('Bieg'), set({ distanceM: '' }))).toBe(0);
    const b = store.getState().bands[0].id;
    expect(stats.setTotal(ex('Pull Up'), set({ reps: 8 }))).toBe(8); expect(stats.setTotal(ex('Pull Up'), set({ reps: 8, addKg: 10 }))).toBe(8);
    expect(stats.setTotal(ex('Pull Up'), set({ reps: 8, bandId: b }))).toBe(0); expect(stats.setTotal(ex('Pull Up'), set({ reps: 8, addKg: -10 }))).toBe(0);
  });
  test('format sumy wg rodzaju', () => {
    expect(stats.fmtTotal(ex('Back Squat'), 1800)).toBe('1800 kg');
    expect(stats.fmtTotal(ex('Pull Up'), 23.4)).toBe('23 powtórzenia'); expect(stats.fmtTotal(ex('Pull Up'), 25)).toBe('25 powtórzeń'); /* liczebniki (T13) */
    expect(stats.fmtTotal(ex('Plank'), 125)).toBe('2:05');
    expect(stats.fmtTotal(ex('Bieg'), 5200)).toMatch(/^5,2 km$/);
  });
});

describe('PR za sumę — granice porównania', () => {
  const lastPR = (w: any) => [...stats.prMap(w).values()].flat();
  test('ta sama objętość to nie rekord; +0,1 kg na serii już tak (kg)', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 10 }]]]);
    expect(lastPR(addWorkout(at(2026, 9, 2), [['Back Squat', [{ weight: 100, reps: 10 }]]]))).not.toContain('objętość treningu');
    expect(lastPR(addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 100.1, reps: 10 }]]]))).toContain('objętość treningu');
  });
  test('powtórzenia i czas: remis nie jest rekordem, +1 jest', () => {
    addWorkout(at(2026, 9, 1), [['Burpees', [{ reps: 10 }, { reps: 10 }]], ['Plank', [{ durationSec: 60 }]]]);
    const w1 = addWorkout(at(2026, 9, 2), [['Burpees', [{ reps: 20 }]], ['Plank', [{ durationSec: 60 }]]]); expect(lastPR(w1)).toEqual([]);
    const w2 = addWorkout(at(2026, 9, 3), [['Burpees', [{ reps: 21 }]], ['Plank', [{ durationSec: 61 }]]]); expect(lastPR(w2).sort()).toEqual(['suma powtórzeń', 'łączny czas'].sort());
  });
});

describe('sesje i rekordy z historii', () => {
  test('sesje od najstarszej; rozgrzewka nie wchodzi do sesji', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 40, reps: 20, kind: 'warmup' }, { weight: 100, reps: 5 }]]]);
    addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 105, reps: 5 }]]]);
    const s = stats.sessionsFor(ex('Back Squat')); expect(s.map(x => x.date)).toEqual([at(2026, 9, 1), at(2026, 9, 3)]);
    expect(s[0].sets).toHaveLength(1); expect(s[0].maxReps).toBe(5); expect(s[0].total).toBe(500);
    expect(stats.sessionsFor(ex('Back Squat'), at(2026, 9, 2))).toHaveLength(1);
  });
  test('najlepsza seria i max ciężar tylko z wykonanych serii; brak wykonanych = brak obciążenia', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 140, reps: 0 }, { weight: 100, reps: 5 }, { weight: 90, reps: 8 }]]]);
    const s = stats.sessionsFor(ex('Back Squat'))[0]; expect(s.bestSet.weight).toBe(100); expect(s.maxLoad).toBe(100); expect(s.hasLoad).toBe(true);
    addWorkout(at(2026, 9, 2), [['Back Squat', [{ weight: 140, reps: 0 }]]]);
    const z = stats.sessionsFor(ex('Back Squat'))[1]; expect(z.maxLoad).toBe(0); expect(z.hasLoad).toBe(false); expect(z.bestSet.weight).toBe(140);
  });
  test('ćwiczenia bez ciężaru: brak obciążenia; czas i dystans jako maksima sesji', () => {
    addWorkout(at(2026, 9, 1), [['Plank', [{ durationSec: 45 }, { durationSec: 70 }]], ['Bieg', [{ distanceM: 5000, durationSec: 1500 }, { distanceM: 2000 }]]]);
    const p = stats.sessionsFor(ex('Plank'))[0]; expect(p.hasLoad).toBe(false); expect(p.maxLoad).toBe(0); expect(p.maxDuration).toBe(70); expect(p.total).toBe(115);
    const b = stats.sessionsFor(ex('Bieg'))[0]; expect(b.maxDistance).toBe(5000); expect(b.total).toBe(7000); expect(b.sets).toHaveLength(2);
  });
  test('rekordy: maksima przez sesje (czas, dystans, najlepsza seria, suma); e1RM tylko z serii ≤ 10 powt.', () => {
    addWorkout(at(2026, 9, 1), [['Plank', [{ durationSec: 90 }]], ['Bieg', [{ distanceM: 8000, durationSec: 2600 }]], ['Back Squat', [{ weight: 60, reps: 20 }]]]);
    addWorkout(at(2026, 9, 2), [['Plank', [{ durationSec: 60 }]], ['Bieg', [{ distanceM: 5000, durationSec: 1500 }]], ['Back Squat', [{ weight: 100, reps: 3 }]]]);
    expect(stats.recordsFor(ex('Plank')).maxDuration).toBe(90); expect(stats.recordsFor(ex('Bieg')).maxDistance).toBe(8000);
    const r = stats.recordsFor(ex('Back Squat')); expect(r.bestSetVolume).toBe(1200); expect(r.bestTotal).toBe(1200); expect(r.bestE1rm).toBe(110); expect(r.e1rmAny).toBe(true);
    const only20 = stats.recordsFor(ex('Back Squat'), at(2026, 9, 2)); expect(only20.e1rmAny).toBe(false); expect(only20.bestE1rm).toBe(0);
  });
  test('drop set i guma bez kg nie dają e1RM', () => {
    const b = store.getState().bands[0].id;
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 200, reps: 5, kind: 'drop' }]], ['Pull Up', [{ reps: 10, bandId: b }]]]);
    expect(stats.recordsFor(ex('Back Squat')).bestE1rm).toBe(0); expect(stats.recordsFor(ex('Pull Up')).bestE1rm).toBe(0);
  });
});

describe('PR e1RM i kolejność serii', () => {
  test('pierwszy rekord e1RM dopiero, gdy w historii jest seria ≤ 10 powt.', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 20 }]]]);
    expect(stats.setPRs(ex('Back Squat'), set({ weight: 50, reps: 5 }), stats.recordsFor(ex('Back Squat')))).toEqual([]);
    addWorkout(at(2026, 9, 2), [['Back Squat', [{ weight: 40, reps: 5 }]]]);
    expect(stats.setPRs(ex('Back Squat'), set({ weight: 50, reps: 5 }), stats.recordsFor(ex('Back Squat')))).toEqual(['e1RM']);
  });
  test('w lb widoczna różnica (220,5 → 220,7 lb) jest rekordem e1RM', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); const rec = stats.recordsFor(ex('Back Squat'));
    units.applyUnit('lb'); expect(stats.setPRs(ex('Back Squat'), set({ weight: 100.1, reps: 5 }), rec)).toEqual(['e1RM']);
  });
  test('PR liczony w kolejności odhaczenia, nie pozycji; bez godzin — w kolejności na liście', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 95, reps: 5 }]]]); const t = at(2026, 9, 3);
    const w = addWorkout(t, [['Back Squat', [{ weight: 100, reps: 5, completedAt: t + 2000 }, { weight: 105, reps: 5, completedAt: t + 1000 }]]]);
    const m = stats.prMap(w); expect(m.get(w.exercises[0].sets[0].id)).toBeUndefined(); expect(m.get(w.exercises[0].sets[1].id)).toEqual(['e1RM', 'objętość treningu']);
    const w2 = addWorkout(at(2026, 9, 4), [['Back Squat', [{ weight: 110, reps: 5, completedAt: null }, { weight: 106, reps: 5, completedAt: null }]]]);
    const m2 = stats.prMap(w2); expect(m2.get(w2.exercises[0].sets[0].id)).toEqual(['e1RM']); expect(m2.get(w2.exercises[0].sets[1].id)).toEqual(['objętość treningu']); /* 550 + 530 > 1025 */
  });
  test('podsumowanie: ostatni rekord e1RM w kolejności odhaczenia; suma tylko tego ćwiczenia, ze wszystkich bloków', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 90, reps: 5 }]], ['Leg Press', [{ weight: 100, reps: 10 }]]]); const t = at(2026, 9, 3);
    const w = addWorkout(t, [['Back Squat', [{ weight: 100, reps: 5, completedAt: t + 3000 }, { weight: 95, reps: 5, completedAt: t + 1000 }]], ['Leg Press', [{ weight: 150, reps: 10, completedAt: t + 4000 }]], ['Back Squat', [{ weight: 50, reps: 10, completedAt: t + 5000 }]]]);
    const p = stats.workoutPRs(w); const sq = p.filter(x => x.exercise.id === ex('Back Squat').id);
    const e1 = sq.find(x => x.kinds.includes('e1RM'))!; expect(e1.set.weight).toBe(100); expect(sq.filter(x => x.kinds.includes('e1RM'))).toHaveLength(1);
    expect(e1.details.find(d => d.startsWith('e1RM'))).toMatch(/^e1RM 116[,.]67 kg \(seria 100×5\)$/);
    const tot = sq.find(x => x.kinds.includes('objętość treningu'))!; expect(tot.details.find(d => d.startsWith('objętość'))).toBe('objętość treningu: 1475 kg');
    expect(p.find(x => x.exercise.id === ex('Leg Press').id)!.details).toContain('objętość treningu: 1500 kg');
  });
});

describe('serie wykresu wg metryki', () => {
  const keys = (n: string) => stats.chartKeysFor(ex(n)).map(k => k.key);
  test('kolejność: rekord (suma), e1RM, potem informacyjne', () => {
    expect(keys('Back Squat')).toEqual(['volume', 'bestE1rm', 'maxLoad', 'maxReps']);
    /* audyt 0.10 (E1): ćwiczenie z masą ciała bez masy ciała w Ustawieniach — bez e1RM (było: e1RM z samego dociążenia); z masą ciała — jak dawniej */
    expect(keys('Pull Up')).toEqual(['total', 'maxLoad', 'volume', 'maxReps']);
    store.getState().settings.bodyMass = 80; expect(keys('Pull Up')).toEqual(['total', 'bestE1rm', 'maxLoad', 'volume', 'maxReps']); delete store.getState().settings.bodyMass;
    expect(keys('Burpees')).toEqual(['total', 'maxReps']);
    expect(keys('Plank')).toEqual(['total', 'maxDuration']);
    expect(keys("Farmer's Walk")).toEqual(['total', 'maxLoad', 'maxDuration']);
    expect(keys('Bieg')).toEqual(['total', 'maxDistance']);
    expect(stats.chartKeysFor({ ...ex('Back Squat'), metric: undefined } as any).map(k => k.key)).toEqual(['volume', 'bestE1rm', 'maxLoad', 'maxReps']);
  });
  test('ustawienia osi i formaty', () => {
    const bs = stats.chartKeysFor(ex('Back Squat')); const load = bs.find(k => k.key === 'maxLoad')!; expect([load.scale, load.minStep]).toEqual([1, 0.01]);
    expect(bs.find(k => k.key === 'volume')!).toMatchObject({ minStep: 1, intOnly: true });
    units.applyUnit('lb'); const lb = stats.chartKeysFor(ex('Back Squat')).find(k => k.key === 'maxLoad')!; expect(lb.scale).toBeCloseTo(1 / units.KG_PER_LB); expect(lb.minStep).toBe(0.1); units.applyUnit('kg');
    const pl = stats.chartKeysFor(ex('Plank'))[0]; expect(pl).toMatchObject({ time: true, intOnly: true }); expect(pl.fmt(125)).toBe('2:05'); expect(pl.label).toBe('łączny czas');
    const bg = stats.chartKeysFor(ex('Bieg'))[0]; expect(bg).toMatchObject({ minStep: 10, intOnly: true }); expect(bg.fmt(5200)).toMatch(/^5,2 km$/); expect(bg.label).toBe('łączny dystans');
    const bu = stats.chartKeysFor(ex('Burpees'))[0]; expect(bu.fmt(22.6)).toBe('23'); expect(bu.label).toBe('suma pow.'); expect(bu.intOnly).toBe(true);
    const md = stats.chartKeysFor(ex('Plank'))[1]; expect(md).toMatchObject({ key: 'maxDuration', time: true }); expect(md.fmt(65)).toBe('1:05');
    const dist = stats.chartKeysFor(ex('Bieg'))[1]; expect(dist).toMatchObject({ key: 'maxDistance', minStep: 10 }); expect(dist.fmt(800)).toBe('800 m');
    expect(stats.chartKeysFor(ex('Pull Up')).find(k => k.key === 'maxLoad')!.label).toBe('max ±');
  });
});

describe('sumy tygodniowe i partie', () => {
  const now = new Date(2026, 9, 7, 12); // środa 7 X 2026
  test('okno tygodni, treningi poza oknem pominięte, serie bez rozgrzewek, usunięte ćwiczenie bez serii', () => {
    addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 40, reps: 10, kind: 'warmup' }]], ['Leg Press', [{ weight: 100, reps: 10 }]]]);
    addWorkout(new Date(2026, 8, 30, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    addWorkout(new Date(2026, 6, 1, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); /* poza 8 tygodniami */
    addWorkout(new Date(2026, 9, 13, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); /* przyszły tydzień */
    const gone = addWorkout(new Date(2026, 9, 5, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); gone.exercises[0].exerciseId = 'usuniete'; store.save();
    const w = stats.weeklyTotals(8, now); expect(w).toHaveLength(8);
    expect(w[7].weekStart).toBe(stats.thisMonday(0, now)); expect(w[0].weekStart).toBe(stats.thisMonday(-7, now));
    expect(w[7]).toMatchObject({ workouts: 2, sets: 2, volume: 1500 }); expect(w[6]).toMatchObject({ workouts: 1, sets: 1, volume: 500 });
    expect(w.reduce((a, x) => a + x.workouts, 0)).toBe(3);
  });
  test('trening dokładnie na początku tygodnia należy do tego tygodnia', () => {
    addWorkout(stats.thisMonday(0, now), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    addWorkout(stats.thisMonday(0, now) - 1, [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    const w = stats.weeklyTotals(8, now); expect(w[7].workouts).toBe(1); expect(w[6].workouts).toBe(1);
  });
  test('serie per partia: główna 1, pomocnicza 0,5; rozgrzewki i inne tygodnie pominięte; usunięte ćwiczenie nie wywraca', () => {
    const mon = stats.thisMonday(0, now);
    addWorkout(mon + 3600e3, [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }, { weight: 40, reps: 10, kind: 'warmup' }]]]);
    addWorkout(mon - 3600e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    addWorkout(mon + 8 * 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    const g = addWorkout(mon + 7200e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); g.exercises[0].exerciseId = 'usuniete'; store.save();
    expect(stats.weeklySetsByMuscle(mon)).toEqual({ 'czworogłowe': 2, 'pośladki': 1, 'dwugłowe': 1 });
  });
  test('objętość per partia (06.10.2026): ciężar × powtórzenia, główna 1, pomocnicza 0,5; rozgrzewki, inne tygodnie i usunięte pominięte', () => {
    const mon = stats.thisMonday(0, now);
    addWorkout(mon + 3600e3, [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }, { weight: 40, reps: 10, kind: 'warmup' }]]]);
    addWorkout(mon - 3600e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    const g = addWorkout(mon + 7200e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); g.exercises[0].exerciseId = 'usuniete'; store.save();
    expect(stats.weeklyVolumeByMuscle(mon)).toEqual({ 'czworogłowe': 1000, 'pośladki': 500, 'dwugłowe': 500 });
    expect(stats.weeklyVolumeByMuscle(stats.thisMonday(-1, now))).toEqual({ 'czworogłowe': 500, 'pośladki': 250, 'dwugłowe': 250 });
  });
  test('czy jest historia: tylko zakończone treningi', () => {
    expect(stats.hasAnyHistory()).toBe(false); store.startEmpty(); expect(stats.hasAnyHistory()).toBe(false);
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); expect(stats.hasAnyHistory()).toBe(true);
  });
});

describe('runda 73 — mutanty z drugiego przebiegu', () => {
  /* audyt 0.10 (E1, MER-03/LOG-02): e1RM z samego dociążenia nie jest szacunkiem Epleya — bez masy ciała brak e1RM, z masą ciała Epley na (masa + ±kg) */
  test('E1: guma z asystą bez masy ciała — bez e1RM; dociążenie bez masy ciała — bez e1RM; z masą ciała 80 kg — Epley(95, 6)', () => {
    const b = store.getState().bands[0].id; addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 10, bandId: b, addKg: -20 }]]]);
    expect(stats.recordsFor(ex('Pull Up')).bestE1rm).toBe(0);
    addWorkout(at(2026, 9, 2), [['Pull Up', [{ reps: 6, addKg: 15 }]]]); expect(stats.recordsFor(ex('Pull Up')).bestE1rm).toBe(0);
    store.getState().settings.bodyMass = 80; store.save(); expect(stats.recordsFor(ex('Pull Up')).bestE1rm).toBeCloseTo(95 * (1 + 6 / 30), 6);
  });
  test('rozgrzewka nie jest rekordem; ćwiczenie bez metryki liczy e1RM jak ciężar × powtórzenia', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); const rec = stats.recordsFor(ex('Back Squat'));
    expect(stats.setPRs(ex('Back Squat'), set({ weight: 200, reps: 5, kind: 'warmup' }), rec)).toEqual([]);
    expect(stats.setPRs({ ...ex('Back Squat'), metric: undefined } as any, set({ weight: 200, reps: 5 }), rec)).toEqual(['e1RM']);
  });
  test('w trakcie treningu: pierwsza seria ≤ 10 powt. otwiera rekordy e1RM dla kolejnych; seria 20 powt. nie', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 20 }]]]);
    const w = addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 60, reps: 20 }, { weight: 50, reps: 5 }, { weight: 55, reps: 5 }]]]);
    const m = stats.prMap(w); const s = w.exercises[0].sets;
    expect(m.get(s[1].id) ?? []).not.toContain('e1RM'); expect(m.get(s[2].id) ?? []).toContain('e1RM');
  });
  test('bez godzin odhaczenia: kolejność bloków, potem serii w bloku', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 95, reps: 5 }]]]);
    const w = addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 100, reps: 5, completedAt: null }, { weight: 104, reps: 5, completedAt: null }]], ['Back Squat', [{ weight: 102, reps: 5, completedAt: null }]]]);
    const m = stats.prMap(w); expect(m.get(w.exercises[0].sets[1].id) ?? []).toContain('e1RM'); expect(m.get(w.exercises[1].sets[0].id) ?? []).not.toContain('e1RM');
  });
  test('objętość w lb: widoczna różnica (+1 kg na treningu) jest rekordem', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 10 }]]]); units.applyUnit('lb');
    const w = addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 100.1, reps: 10 }]]]); expect([...stats.prMap(w).values()].flat()).toContain('objętość treningu');
  });
  test('granice tygodni: początek okna i początek tygodnia wliczone, koniec okna nie; ćwiczenie z samą rozgrzewką bez partii', () => {
    const now = new Date(2026, 9, 7, 12); const mon = stats.thisMonday(0, now);
    addWorkout(stats.thisMonday(-7, now), [['Back Squat', [{ weight: 100, reps: 5 }]]]); addWorkout(stats.thisMonday(1, now), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    const w = stats.weeklyTotals(8, now); expect(w[0].workouts).toBe(1); expect(w.reduce((a, x) => a + x.workouts, 0)).toBe(1);
    addWorkout(mon, [['Back Squat', [{ weight: 100, reps: 5 }]], ['Leg Curl', [{ weight: 30, reps: 10, kind: 'warmup' }]]]);
    expect(stats.weeklySetsByMuscle(mon)).toEqual({ 'czworogłowe': 1, 'pośladki': 0.5, 'dwugłowe': 0.5 });
  });
});
