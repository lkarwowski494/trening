/*
 * Kalendarz z planem tygodnia — logika (priorytet właściciela 08.10.2026, docs/18): plan pon…nd + zmiany dni, dwa tryby przesuwania.
 * Rodzaje (docs/20): logika (łańcuch tylko do pierwszego wolnego dnia, brak przesunięcia na zajęty dzień bez polecenia, zamiana na polecenie,
 * powrót do rutyny), dane (sanityzacja, zapis/odczyt, szablon w archiwum/usunięty), niezmiennik (liczba treningów zachowana przy przesunięciu,
 * plan tygodnia nietknięty). Ekran — tests/plan-calendar-ui.test.tsx.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { fresh, saved, withDemoTemplates, addWorkout } from './helpers';

const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek 8.10.2026 */
const S = () => store.getState();
let A = '', B = '', C = '';
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); const t = withDemoTemplates(); [A, B, C] = [t[0].id, t[1].id, t[2].id]; });
/* audyt 0.10 A1 (historia planu, schemat 18): plan obowiązuje od dnia ustawienia — testy minionych dni ustawiają go wcześniej (1.09.2026) */
const week = (...d: (string | null)[]) => { const now = Date.now(); jest.setSystemTime(new Date(2026, 8, 1, 9).getTime()); d.forEach((id, i) => plan.setWeekDay(i, id)); jest.setSystemTime(now); };
const range = (from: string, n: number) => Array.from({ length: n }, (_, i) => plan.plannedOn(plan.addDays(from, i)));

describe('plan tygodnia', () => {
  test('dni tygodnia od poniedziałku; dzień bez zmiany = plan tygodnia; pusty plan znika z danych', () => {
    expect([plan.weekdayIdx('2026-10-05'), plan.weekdayIdx('2026-10-11')]).toEqual([0, 6]);
    week(A, null, B, null, A, null, null);
    expect(range('2026-10-05', 7)).toEqual([A, null, B, null, A, null, null]);
    expect(range('2026-10-12', 7)).toEqual([A, null, B, null, A, null, null]); /* powtarza się co tydzień */
    week(null, null, null, null, null, null, null); expect(S().weekPlan).toBeUndefined();
  });
  test('szablon w archiwum albo usunięty — dzień bez treningu (bez błędu)', () => {
    week(A, null, null, null, null, null, null); S().templates.find(t => t.id === A)!.archived = true;
    expect(plan.plannedOn('2026-10-12')).toBeNull(); S().templates = S().templates.filter(t => t.id !== A); expect(plan.plannedOn('2026-10-12')).toBeNull();
  });
});

describe('przesuń plan o 1 dzień (łańcuch do pierwszego wolnego dnia)', () => {
  test('przykład właściciela: dziś FBW A, jutro FBW B, potem wolne → A jutro, B pojutrze, nic więcej', () => {
    week(null, null, null, A, B, null, A); /* czw. A, pt. B, sob. wolne, nd. A */
    const r = plan.shiftPlan('2026-10-08');
    expect(range('2026-10-08', 5)).toEqual([null, A, B, A, null]); /* czw. wolne, pt. A, sob. B, nd. A (bez zmian), pon. wolne */
    expect(r).toEqual({ moved: [{ from: '2026-10-08', to: '2026-10-09', id: A }, { from: '2026-10-09', to: '2026-10-10', id: B }] });
    expect(range('2026-10-15', 4)).toEqual([A, B, null, A]); /* następny tydzień — rutyna bez zmian */
    expect(S().weekPlan!.days).toEqual([null, null, null, A, B, null, A]);
  });
  test('przesunięcie zachowuje liczbę treningów (niezmiennik); dzień bez treningu — nic', () => {
    week(A, B, null, C, A, null, null); const before = range('2026-10-05', 14).filter(Boolean).length;
    plan.shiftPlan('2026-10-05'); expect(range('2026-10-05', 14).filter(Boolean).length).toBe(before);
    expect(plan.shiftPlan('2026-10-11')).toEqual({ moved: [] }); /* niedziela — wolna (audyt 0.10 A4: miniony poniedziałek przesuwa się od dziś, łańcuch kończy się w sobotę) */
  });
  test('plan bez dni wolnych: łańcuch kończy się po SHIFT_MAX_DAYS, ostatni trening wypada (zwracany)', () => {
    week(A, B, C, A, B, C, A); const r = plan.shiftPlan('2026-10-08');
    expect(r.moved).toHaveLength(plan.SHIFT_MAX_DAYS); expect(r.dropped).toBeTruthy();
  });
  test('zmiana równa planowi tygodnia nie zostaje w danych (powrót do rutyny)', () => {
    week(null, null, null, A, null, null, null); plan.shiftPlan('2026-10-08'); expect(Object.keys(S().planOverrides!)).toEqual(['2026-10-08', '2026-10-09']);
    plan.moveOnly('2026-10-09', '2026-10-08'); expect(S().planOverrides).toBeUndefined();
  });
});

describe('przesuń tylko ten trening', () => {
  test('na wolny dzień — tak; na dzień z innym treningiem — konflikt, nic się nie zmienia', () => {
    week(null, null, null, A, B, null, null);
    expect(plan.moveOnly('2026-10-08', '2026-10-09')).toEqual({ ok: false, conflict: B });
    expect(range('2026-10-08', 3)).toEqual([A, B, null]);
    expect(plan.moveOnly('2026-10-08', '2026-10-10')).toEqual({ ok: true }); expect(range('2026-10-08', 3)).toEqual([null, B, A]);
  });
  test('wyraźne polecenie: zamiana miejscami', () => {
    week(null, null, null, A, B, null, null); plan.swapDays('2026-10-08', '2026-10-09'); expect(range('2026-10-08', 2)).toEqual([B, A]);
  });
  test('pojedynczy dzień: inny trening / wolne / powrót do planu', () => {
    week(A, null, null, null, null, null, null);
    plan.setDayPlan('2026-10-12', C); expect(plan.plannedOn('2026-10-12')).toBe(C); expect(plan.isChanged('2026-10-12')).toBe(true);
    plan.setDayPlan('2026-10-12', null); expect(plan.plannedOn('2026-10-12')).toBeNull();
    plan.resetDay('2026-10-12'); expect([plan.plannedOn('2026-10-12'), plan.isChanged('2026-10-12')]).toEqual([A, false]);
  });
});

describe('pomocnicze', () => {
  test('dayKeyOf — data lokalna RRRR-MM-DD; hasPlan — plan tygodnia albo zmiany dni', () => {
    expect(plan.dayKeyOf(new Date(2026, 9, 8, 23, 59).getTime())).toBe('2026-10-08');
    expect(plan.hasPlan()).toBe(false); plan.setDayPlan('2026-10-09', A); expect(plan.hasPlan()).toBe(true);
    plan.resetDay('2026-10-09'); expect(plan.hasPlan()).toBe(false); week(null, A, null, null, null, null, null); expect(plan.hasPlan()).toBe(true);
  });
  test('opis przesunięcia w liście „Przesuń albo pomiń” (audyt 0.10 UX-13 A — zamiast okna po przesunięciu): treningi na nowych dniach i trening, który wypada', () => {
    const { suggestionTexts } = require('@/components/DayPanel');
    week(A, B, C, A, B, C, A); const sh = plan.suggest('2026-10-08').find(x => x.kind === 'shift')!; const d = suggestionTexts('2026-10-08', sh).details as string[];
    const nameA = S().templates.find(x => x.id === A)!.name.replace(/[()]/g, '\\$&'); expect(d[0]).toMatch(new RegExp(`^${nameA} → pt\\.,? 9\\.10`)); expect(d).toContain('Wypada treningów: 1');
  });
});

describe('stan dnia i dane', () => {
  test('zrobiony / zaplanowany / opuszczony / wolny', () => {
    week(A, A, A, A, A, null, null);
    addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]).templateId = A; /* audyt 0.10 A5: „zrobione” = zaplanowany szablon */
    addWorkout(new Date(2026, 9, 7, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); /* inny trening — „other” */
    expect(['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-10'].map(k => plan.dayStatus(k, '2026-10-08').status)).toEqual(['missed', 'done', 'other', 'planned', 'rest']);
    expect(plan.upcoming(3, '2026-10-08')).toEqual([{ date: '2026-10-08', templateId: A }, { date: '2026-10-09', templateId: A }, { date: '2026-10-10', templateId: null }]);
  });
  test('sanityzacja: plan 7 dni, złe klucze i wartości zmian usunięte; zapis i odczyt', async () => {
    (S() as any).weekPlan = { days: [A, 5, null, 'x'] }; (S() as any).planOverrides = { '2026-10-08': B, 'zła': A, '2026-10-09': 7, '2026-10-10': null };
    store.save(); await store.flush(); await fresh(saved());
    expect(S().weekPlan).toEqual({ days: [A, null, null, 'x', null, null, null] }); expect(S().planOverrides).toEqual({ '2026-10-08': B, '2026-10-10': null });
    (S() as any).weekPlan = { days: [] }; (S() as any).planOverrides = {}; store.save(); await store.flush(); await fresh(saved());
    expect(['weekPlan' in S(), 'planOverrides' in S()]).toEqual([false, false]);
  });
  test('audyt 0.10 A1 (DAT-01 P3): minione zmiany dni zostają przy zmianie planu (dawniej kasowane po 60 dniach — „wolne” wracało jako „opuszczony”)', () => {
    S().planOverrides = { '2026-07-01': A, '2026-10-01': B }; plan.setWeekDay(0, A); expect(Object.keys(S().planOverrides!)).toEqual(['2026-07-01', '2026-10-01']);
  });
});

/*
 * Propozycje z regeneracją partii (docs/research/23): pary dni pod rząd z tymi samymi głównymi partiami — ostrzeżenie (uproszczenie, nie blokada);
 * kolejność: zmiany w oknie powrotu (RETURN_DAYS) → bez utraty sesji → bez nowych par pod rząd → najmniej zmian.
 */
describe('propozycje z regeneracją partii', () => {
  let D = ''; /* Legs — dom: bez wspólnych partii z Upper A/B */
  beforeEach(() => { D = S().templates[3].id; });
  test('partie szablonu i pary pod rząd z tymi samymi partiami', () => {
    expect([...plan.templateMuscles(A)].sort()).toEqual(['barki', 'biceps', 'klatka', 'plecy', 'triceps']);
    week(A, B, null, D, A, null, null);
    expect(plan.backToBack('2026-10-05', 7)).toEqual([{ a: '2026-10-05', b: '2026-10-06' }]); /* A–B dzielą partie; D–A nie */
  });
  test('przykład: pon. A, śr. B, pt. A; w środę „nie dam rady” → bez utraty sesji, najmniej zmian; ostrzeżenie o B i A dzień po dniu; pominięcie na końcu', () => {
    jest.setSystemTime(new Date(2026, 9, 7, 9).getTime()); week(A, null, B, null, A, null, null);
    const s = plan.suggest('2026-10-07', '2026-10-07');
    expect(s[0]).toMatchObject({ kind: 'shift', dropped: 0, changes: 2, returns: true });
    expect(s[0].newBackToBack).toEqual([{ a: '2026-10-08', b: '2026-10-09' }]); /* czw. B, pt. A */
    expect(s.find(x => x.kind === 'skip')).toMatchObject({ dropped: 1 }); expect(s[s.length - 1].kind).toBe('skip');
    /* audyt 0.10 UX-13 A: jedna lista zastępuje „Przesuń tylko ten trening” — zamiana na wyraźne polecenie także dziś, ale na końcu przy tej samej liczbie sesji */
    const firstSwap = s.findIndex(x => x.kind === 'swap'); expect(firstSwap).toBeGreaterThan(s.findIndex(x => x.kind === 'move')); expect(s[0].kind).not.toBe('swap');
  });
  test('gdy jest układ bez nowej pary pod rząd, wygrywa on (przy tej samej liczbie sesji)', () => {
    jest.setSystemTime(new Date(2026, 9, 5, 9).getTime()); week(A, D, null, B, null, null, null); /* pon. A, wt. Legs-dom, czw. B */
    const s = plan.suggest('2026-10-05', '2026-10-05');
    expect(s[0]).toMatchObject({ kind: 'move', to: '2026-10-10', dropped: 0, newBackToBack: [], changes: 2 }); /* najmniej zmian: A na sobotę */
    const sh = s.find(x => x.kind === 'shift')!; expect(sh).toMatchObject({ dropped: 0, newBackToBack: [], changes: 3 }); /* wt. A, śr. Legs-dom, czw. B */
    plan.applySuggestion(sh); expect(range('2026-10-05', 4)).toEqual([null, A, D, B]);
    expect(range('2026-10-12', 4)).toEqual([A, D, null, B]); /* następny tydzień — rutyna */
  });
  test('opuszczony dzień w przeszłości: propozycje od dziś, przeszłość bez zmian poza zdjęciem treningu', () => {
    week(null, A, null, null, null, null, null); /* wt. 6.10 A — opuszczony; dziś czw. 8.10 */
    const s = plan.suggest('2026-10-06', '2026-10-08');
    const mv = s.find(x => x.kind === 'move')!; expect(mv.to! >= '2026-10-08').toBe(true);
    expect(s.every(x => x.returns)).toBe(true);
  });
  test('dzień bez treningu — brak propozycji; przyszły dzień — także zamiana z najbliższym treningiem', () => {
    week(A, null, B, null, A, null, null); expect(plan.suggest('2026-10-13', '2026-10-08')).toEqual([]);
    const s = plan.suggest('2026-10-12', '2026-10-08'); const sw = s.find(x => x.kind === 'swap')!; expect(sw.to).toBe('2026-10-14');
  });
});
