/*
 * „Progresja” — logika (lib/progress.ts; docs/22 krok 3 pkt 5, decyzja właściciela 11.10.2026 P8 B). Rodzaje (docs/20): logika (szacunek szablonu,
 * zaplanowane z planu, trzy porównania, wzrost partii), niezmienniki (zgodność z istniejącymi funkcjami objętości i serii — nie liczymy inną metodą),
 * dane (granice: archiwalny szablon, pusty szablon, brak historii, krótszy poprzedni miesiąc, trening w toku).
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { estimateTemplate, estimateItem, plannedDays, plannedRest, compare, compareCached, pctText, signedNum } from '@/lib/progress';
import { weeklyVolumeByMuscle, weeklySetsByMuscle, volumeByMuscle, setsByMuscle, thisMonday } from '@/lib/stats';
import { periodSummary, periodRange, totals } from '@/lib/period';
import { uid, type Template, type TRow, type SetKind } from '@/lib/seed';
import { fresh, addWorkout, ex } from './helpers';

const NOW = new Date(2026, 9, 8, 9); /* czwartek; tydzień pon 5 … nd 11 października 2026 */
const at = (d: number, h = 18, m = 9) => new Date(2026, m, d, h).getTime();
const row = (reps: number | '', weight: number | '', kind: SetKind = 'normal'): TRow => ({ id: uid(), kind, reps, weight, durationSec: '', distanceM: '' });
function tpl(name: string, ...blocks: [string, TRow[]][]): Template {
  const t = store.newTemplate(); t.name = name;
  t.items = blocks.map(([n, rows]) => ({ id: uid(), exerciseId: ex(n).id, sets: rows.length, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null, rows }));
  store.save(); return t;
}
/** trening zrobiony z szablonu (żeby plan uznał dzień za zrobiony) */
const doneFrom = (t: Template, day: number, sets: { weight: number; reps: number }[], exName = 'Back Squat') => { const w = addWorkout(at(day), [[exName, sets]], t.name); w.templateId = t.id; store.save(); return w; };
const setPlan = (days: Record<number, Template>) => { jest.setSystemTime(at(5, 6, 9)); for (const [i, t] of Object.entries(days)) plan.setWeekDay(Number(i), t.id); jest.setSystemTime(NOW); };

beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
afterEach(() => { jest.useRealTimers(); });

describe('estimateTemplate: serie i objętość z wierszy szablonu', () => {
  test('wartości z wierszy: serie robocze bez rozgrzewki, objętość = ciężar × powtórzenia (jak setVolume)', () => {
    const t = tpl('A', ['Back Squat', [row(5, 40, 'warmup'), row(5, 100), row(5, 100), row(3, 110)]]);
    const e = estimateTemplate(t);
    expect(e.sets).toBe(3); expect(e.volume).toBe(5 * 100 + 5 * 100 + 3 * 110); expect(e.unknownSets).toBe(0);
    expect(e.bySets.czworogłowe).toBe(3); expect(e.bySets.pośladki).toBe(1.5); /* partia główna 1, pomocnicza 0,5 */
    expect(e.byVolume.czworogłowe).toBe(1330); expect(e.byVolume.pośladki).toBe(665);
  });
  test('brak ciężaru i powtórzeń w wierszu → wartości z „Poprzednio” (ostatnie wykonanie), pole z szablonu wygrywa z „Poprzednio”', () => {
    doneFrom(tpl('Stary', ['Back Squat', [row(5, 100)]]), 1, [{ weight: 80, reps: 8 }, { weight: 82.5, reps: 6 }]);
    const t = tpl('A', ['Back Squat', [row('', ''), row(10, ''), row('', '')]]);
    const e = estimateTemplate(t); /* seria 1: 80×8, seria 2: powtórzenia z szablonu (10) + ciężar 82,5, seria 3: za końcem źródła — ostatnia (82,5×6) */
    expect(e.sets).toBe(3); expect(e.unknownSets).toBe(0); expect(e.volume).toBe(80 * 8 + 82.5 * 10 + 82.5 * 6);
  });
  test('bez „Poprzednio”: seria liczy się do serii, nie do objętości, i jest zgłoszona jako nieznana', () => {
    const t = tpl('A', ['Back Squat', [row(5, 100), row('', ''), row(8, '')]]);
    const e = estimateTemplate(t); expect(e.sets).toBe(3); expect(e.volume).toBe(500); expect(e.unknownSets).toBe(2);
    expect(e.byVolume.czworogłowe).toBe(500); expect(e.bySets.czworogłowe).toBe(3);
  });
  test('drop set liczy się z serią przed nim (serie), a jego objętość z własnych wartości; drop bez wartości — nieznany', () => {
    const t = tpl('A', ['Back Squat', [row(5, 100), row(8, 70, 'drop'), row('', '', 'drop')]]);
    const e = estimateTemplate(t); expect(e.sets).toBe(1); expect(e.volume).toBe(500 + 560); expect(e.unknownSets).toBe(1);
  });
  test('ćwiczenie bez ciężaru×powtórzeń (czas) — serie bez objętości, bez „+?”; ćwiczenie z masą ciała bez dociążenia — objętość 0, ale znana', () => {
    const plank = tpl('P', ['Plank', [{ ...row('', ''), durationSec: 60 }, { ...row('', ''), durationSec: 60 }]]);
    const e = estimateTemplate(plank); expect(e.sets).toBe(2); expect(e.volume).toBe(0); expect(e.unknownSets).toBe(0);
    const pu = tpl('B', ['Push Up', [row(12, ''), row('', '')]]);
    const u = estimateTemplate(pu); expect(u.sets).toBe(2); expect(u.volume).toBe(0); expect(u.unknownSets).toBe(1); /* druga seria bez powtórzeń i bez „Poprzednio” */
  });
  test('zarchiwizowane ćwiczenie nie wchodzi do szacunku (jak przy starcie); pusty szablon — zera', () => {
    const t = tpl('A', ['Back Squat', [row(5, 100)]], ['Front Squat', [row(5, 60)]]); ex('Front Squat').archived = true; store.save();
    expect(estimateTemplate(t).sets).toBe(1); expect(estimateTemplate(store.newTemplate())).toMatchObject({ sets: 0, volume: 0, unknownSets: 0 });
  });
});

describe('plannedRest: zaplanowane, jeszcze niezrobione dni od dziś do niedzieli', () => {
  test('dziś (czw) i sob zaplanowane → oba; po zrobieniu dzisiejszego zostaje tylko sobota; miniony dzień z planu nie wchodzi', () => {
    const a = tpl('A', ['Back Squat', [row(5, 100), row(5, 100)]]); const b = tpl('B', ['Bench Press (sztanga)', [row(5, 60)]]);
    setPlan({ 1: a, 3: a, 5: b }); /* wt, czw, sob */
    const p = plannedRest(NOW.getTime()); expect(p.workouts).toBe(2); expect(p.sets).toBe(3); expect(p.volume).toBe(1000 + 300);
    doneFrom(a, 8, [{ weight: 100, reps: 5 }]); const q = plannedRest(NOW.getTime()); expect(q.workouts).toBe(1); expect(q.sets).toBe(1); expect(q.volume).toBe(300);
  });
  test('inny trening zrobiony dziś — zaplanowany czeka i się liczy (stan „other”); bez planu, zarchiwizowany i pusty szablon — zero', () => {
    const a = tpl('A', ['Back Squat', [row(5, 100)]]); const b = tpl('B', ['Bench Press (sztanga)', [row(5, 60)]]); setPlan({ 3: a });
    doneFrom(b, 8, [{ weight: 60, reps: 5 }], 'Bench Press (sztanga)'); expect(plannedRest(NOW.getTime()).workouts).toBe(1);
    a.archived = true; store.save(); expect(plannedRest(NOW.getTime()).workouts).toBe(0);
  });
  test('bez planu — zero', () => { expect(plannedRest(NOW.getTime())).toMatchObject({ workouts: 0, sets: 0, volume: 0, unknownSets: 0 }); });
});

describe('estimateItem i plannedDays: rozbicie szacunku na wiersze i dni (podstawa strażnika progresji)', () => {
  test('estimateItem: serie, objętość i serie bez wartości jednego wiersza; suma wierszy = estimateTemplate; ćwiczenie zarchiwizowane → null', () => {
    const t = tpl('A', ['Back Squat', [row(5, 100), row('', '')]], ['Bench Press (sztanga)', [row(5, 60), row(5, 60)]]);
    const a = estimateItem(t, 0)!; const b = estimateItem(t, 1)!;
    expect(a).toEqual({ exerciseId: ex('Back Squat').id, sets: 2, volume: 500, unknown: 1 }); expect(b).toEqual({ exerciseId: ex('Bench Press (sztanga)').id, sets: 2, volume: 600, unknown: 0 });
    const all = estimateTemplate(t); expect(all.sets).toBe(a.sets + b.sets); expect(all.volume).toBe(a.volume + b.volume); expect(all.unknownSets).toBe(a.unknown + b.unknown);
    ex('Bench Press (sztanga)').archived = true; store.save(); expect(estimateItem(t, 1)).toBeNull();
  });
  test('plannedDays: dni od dziś do niedzieli z niezrobionym szablonem, rosnąco; zrobiony dzień i miniony dzień odpadają; zgodne z plannedRest', () => {
    const a = tpl('A', ['Back Squat', [row(5, 100)]]); const b = tpl('B', ['Bench Press (sztanga)', [row(5, 60)]]);
    setPlan({ 1: a, 3: a, 5: b }); /* wt, czw, sob */
    expect(plannedDays(NOW.getTime()).map(d => [d.day, d.tpl.name])).toEqual([['2026-10-08', 'A'], ['2026-10-10', 'B']]);
    doneFrom(a, 8, [{ weight: 100, reps: 5 }]); expect(plannedDays(NOW.getTime()).map(d => d.day)).toEqual(['2026-10-10']);
    expect(plannedDays(NOW.getTime()).length).toBe(plannedRest(NOW.getTime()).workouts);
  });
  test('plannedDays: bez planu i z zarchiwizowanym szablonem — pusto', () => {
    expect(plannedDays(NOW.getTime())).toEqual([]); const a = tpl('A', ['Back Squat', [row(5, 100)]]); setPlan({ 3: a }); a.archived = true; store.save(); expect(plannedDays(NOW.getTime())).toEqual([]);
  });
});

describe('compare: trzy porównania', () => {
  test('tydzień: wykonane + zaplanowane vs poprzedni tydzień; procent i różnica; „+?” przy nieznanej objętości', () => {
    const a = tpl('A', ['Back Squat', [row(5, 100), row(5, 100)]]); const b = tpl('B', ['Bench Press (sztanga)', [row(5, 60), row('', '')]]); setPlan({ 1: a, 5: b });
    doneFrom(a, 6, [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]); /* wt 6.10 zrobione */
    addWorkout(at(29, 18, 8), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]], 'Poprzedni'); /* pon 28.09 – tydzień poprzedni */
    const c = compare('week', NOW.getTime());
    expect(c.done).toMatchObject({ workouts: 1, sets: 2, volume: 1000 }); expect(c.planned).toMatchObject({ workouts: 1, sets: 2, volume: 300, unknownSets: 1 });
    expect(c.total).toEqual({ workouts: 2, sets: 4, volume: 1300 }); expect(c.before).toMatchObject({ workouts: 1, sets: 2, volume: 1000 });
    expect(c.unknown).toBe(true); expect(c.volumePct).toBe(30); expect(c.volumeDelta).toBe(300); expect(c.setsPct).toBe(100); expect(c.setsDelta).toBe(2);
    expect(c.kind).toBe('week'); expect(c.cur.start).toBe(thisMonday(0, NOW)); expect(c.prev.start).toBe(thisMonday(-1, NOW));
  });
  test('wzrost partii: tylko partie, w których objętość (wykonana + zaplanowana) jest większa niż w poprzednim tygodniu; najpierw objętość', () => {
    const a = tpl('A', ['Back Squat', [row(5, 100)]]); const b = tpl('B', ['Bench Press (sztanga)', [row(5, 60)]]); setPlan({ 5: b });
    doneFrom(a, 6, [{ weight: 100, reps: 5 }]); /* przysiad: 500 (czworogłowe) */
    addWorkout(at(29, 18, 8), [['Back Squat', [{ weight: 100, reps: 5 }]], ['Bench Press (sztanga)', [{ weight: 100, reps: 5 }]]], 'Poprzedni');
    const c = compare('week', NOW.getTime()); const by = (m: string) => c.rows.find(r => r.muscle === m)!;
    expect(by('czworogłowe').volumeUp).toBe(false); /* 500 = 500: remis to nie wzrost */ expect(by('klatka').volumeUp).toBe(false); /* 300 < 500 */
    expect(c.improved).toEqual([]); expect(c.rows[0].muscle).toBe('czworogłowe'); /* malejąco po objętości */
    addWorkout(at(7), [['Back Squat', [{ weight: 100, reps: 1 }]]], 'Plus'); const d = compare('week', NOW.getTime());
    expect(d.improved).toContain('czworogłowe'); expect(d.rows.find(r => r.muscle === 'czworogłowe')!.setsUp).toBe(true);
  });
  test('poprzedni tydzień vs dwa tygodnie temu: tylko wykonane (bez zaplanowanych)', () => {
    const a = tpl('A', ['Back Squat', [row(5, 100)]]); setPlan({ 3: a, 5: a });
    addWorkout(at(30, 18, 8), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'X'); /* wt 29.09 → tydzień 28.09–4.10 */
    addWorkout(at(22, 18, 8), [['Back Squat', [{ weight: 100, reps: 4 }]]], 'Y'); /* tydzień 21–27.09 */
    const c = compare('prevWeek', NOW.getTime()); expect(c.planned).toBeNull(); expect(c.unknown).toBe(false);
    expect(c.total).toEqual({ workouts: 1, sets: 1, volume: 500 }); expect(c.before.volume).toBe(400); expect(c.volumePct).toBe(25);
    expect(c.cur.start).toBe(thisMonday(-1, NOW)); expect(c.prev.start).toBe(thisMonday(-2, NOW));
  });
  test('miesiąc: bieżący do dziś vs poprzedni w tych samych dniach miesiąca (11 dni), trening po tym zakresie się nie liczy', () => {
    jest.setSystemTime(new Date(2026, 9, 11, 20)); const now = Date.now();
    addWorkout(at(3, 18, 9), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Cur'); /* 3.10 */
    addWorkout(at(5, 18, 8), [['Back Squat', [{ weight: 100, reps: 4 }]]], 'P1'); /* 5.09 – w zakresie 1–11 */
    addWorkout(at(20, 18, 8), [['Back Squat', [{ weight: 100, reps: 10 }]]], 'P2'); /* 20.09 – poza zakresem */
    const c = compare('month', now); expect(c.planned).toBeNull();
    expect(c.total).toEqual({ workouts: 1, sets: 1, volume: 500 }); expect(c.before).toMatchObject({ workouts: 1, sets: 1, volume: 400 }); expect(c.volumePct).toBe(25);
    expect(new Date(c.cur.end).getDate()).toBe(12); expect(new Date(c.prev.end).getDate()).toBe(12); expect(new Date(c.prev.end).getMonth()).toBe(8);
  });
  test('miesiąc: krótszy poprzedni miesiąc (31.03 vs luty) — zakres porównania nie wychodzi poza luty; brak historii — zera i brak procentu', () => {
    const now = new Date(2026, 2, 31, 12).getTime(); jest.setSystemTime(now);
    const c = compare('month', now); expect(c.prev.end).toBe(new Date(2026, 2, 1).getTime()); expect(c.total).toEqual({ workouts: 0, sets: 0, volume: 0 });
    expect(c.volumePct).toBeNull(); expect(c.setsPct).toBeNull(); expect(c.rows).toEqual([]); expect(c.improved).toEqual([]);
  });
  test('deload: znacznik tygodnia bieżącego i poprzedniego (informacja, bez oceny)', () => {
    store.toggleDeloadWeek(thisMonday(-1, NOW)); const c = compare('week', NOW.getTime()); expect(c.deloadPrev).toBe(true); expect(c.deloadCur).toBe(false);
    expect(compare('month', NOW.getTime())).toMatchObject({ deloadCur: false, deloadPrev: false });
  });
});

describe('niezmienniki: te same definicje co reszta aplikacji', () => {
  test('wykonane w tygodniu = periodSummary (serie, objętość) i weeklyVolumeByMuscle / weeklySetsByMuscle; tydzień poprzedni jak summary.prev', () => {
    addWorkout(at(6), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 60, reps: 8, kind: 'warmup' }, { weight: 110, reps: 3 }]], ['Bench Press (sztanga)', [{ weight: 80, reps: 6 }]]], 'T');
    addWorkout(at(30, 18, 8), [['Back Squat', [{ weight: 90, reps: 5 }]]], 'Poprzedni');
    const c = compare('week', NOW.getTime()); const s = periodSummary('week', 0, NOW);
    expect(c.done.sets).toBe(s.sets); expect(c.done.volume).toBe(s.volume); expect(c.before.sets).toBe(s.prev.sets); expect(c.before.volume).toBe(s.prev.volume);
    expect(c.done.byVolume).toEqual(weeklyVolumeByMuscle(thisMonday(0, NOW))); expect(c.done.bySets).toEqual(weeklySetsByMuscle(thisMonday(0, NOW)));
    expect(c.before.byVolume).toEqual(weeklyVolumeByMuscle(thisMonday(-1, NOW)));
  });
  test('szacunek szablonu = to, co zrobiony trening z tymi samymi wartościami policzyłby po fakcie (serie i objętość)', () => {
    const t = tpl('A', ['Back Squat', [row(5, 100), row(5, 100), row(3, 110)]], ['Bench Press (sztanga)', [row(8, 60), row(8, 60)]]);
    const e = estimateTemplate(t);
    const w = addWorkout(at(7), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }, { weight: 110, reps: 3 }]], ['Bench Press (sztanga)', [{ weight: 60, reps: 8 }, { weight: 60, reps: 8 }]]], 'Fakt');
    expect(e.sets).toBe(store.workingSets(w)); expect(e.volume).toBe(store.volume(w));
  });
  test('totals / volumeByMuscle / setsByMuscle na dowolnym zakresie = to, z czego liczy compare (miesiąc: zakres 1–8 dni, nie cały miesiąc)', () => {
    addWorkout(at(3, 18, 9), [['Back Squat', [{ weight: 100, reps: 5 }]], ['Bench Press (sztanga)', [{ weight: 80, reps: 6 }]]], 'T'); addWorkout(at(5, 18, 8), [['Back Squat', [{ weight: 90, reps: 5 }]]], 'P');
    const c = compare('month', NOW.getTime()); const tt = totals(c.cur.start, c.cur.end);
    expect(c.done).toMatchObject({ workouts: tt.workouts, sets: tt.sets, volume: tt.volume }); expect(c.done.byVolume).toEqual(volumeByMuscle(c.cur.start, c.cur.end)); expect(c.done.bySets).toEqual(setsByMuscle(c.cur.start, c.cur.end));
    expect(c.before.byVolume).toEqual(volumeByMuscle(c.prev.start, c.prev.end)); expect(c.cur.start).toBe(periodRange('month', 0, NOW).start);
    const wk = periodRange('week', 0, NOW); expect(volumeByMuscle(wk.start, wk.end)).toEqual(weeklyVolumeByMuscle(wk.start)); /* tygodniowa wersja deleguje do tej samej funkcji */
  });
  test('compareCached: ten sam wynik do zmiany stanu, po zapisie (nowy trening) liczy od nowa; osobna pamięć na rodzaj porównania', () => {
    const a = compareCached('week', NOW.getTime()); expect(compareCached('week', NOW.getTime())).toBe(a); const m = compareCached('month', NOW.getTime()); expect(m).not.toBe(a); expect(compareCached('week', NOW.getTime())).toBe(a);
    addWorkout(at(7), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Nowy'); const b = compareCached('week', NOW.getTime()); expect(b).not.toBe(a); expect(b.done.sets).toBe(1); expect(a.done.sets).toBe(0);
    jest.setSystemTime(new Date(2026, 9, 9, 9)); expect(compareCached('week', Date.now())).not.toBe(b); /* nowy dzień — nowy wynik */
  });
  test('trening w toku nie wchodzi do wykonanych (tylko zakończone), a zaplanowany na dziś nadal czeka', () => {
    const a = tpl('A', ['Back Squat', [row(5, 100)]]); setPlan({ 3: a }); store.startFromTemplate(a);
    expect(compare('week', NOW.getTime()).done.sets).toBe(0); expect(plannedRest(NOW.getTime()).workouts).toBe(1);
  });
});

describe('pctText i signedNum (14.10.2026: procent i różnica bezwzględna; pusty poprzedni okres = „brak poprzedniego okresu”)', () => {
  test.each([[null, 'brak poprzedniego okresu'], [30, '+30%'], [-12, '−12%'], [0, '0%'], [191, '+191%']] as const)('pctText(%s) = %s', (p, want) => { expect(pctText(p)).toBe(want); });
  test.each([[35, '+35'], [-3, '−3'], [0, '0']] as const)('signedNum(%s) = %s', (n, want) => { expect(signedNum(n)).toBe(want); });
  test('signedNum z formaterem: znak przed wartością bezwzględną', () => { expect(signedNum(-300, v => `${v} kg`)).toBe('−300 kg'); expect(signedNum(300, v => `${v} kg`)).toBe('+300 kg'); expect(signedNum(0, v => `${v} kg`)).toBe('0 kg'); });
});
