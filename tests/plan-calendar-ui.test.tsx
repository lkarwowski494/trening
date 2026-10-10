/*
 * Kalendarz z planem tygodnia — ekrany (decyzje właściciela 08.10.2026: 1A zakładka Kalendarz, 2A plan tygodnia + dwa tryby przesuwania).
 * Rodzaje (docs/20): ekran (plan tygodnia, panel dnia, przesuwanie, zamiana na wyraźne polecenie, wolne/inny/dodaj/przywróć, start),
 * scenariusz (plan → kalendarz → start z ekranu treningu), języki (EN), VoiceOver (etykiety dni). E2E: .maestro/13.
 * Audyt 0.10 (08.10.2026, decyzje właściciela — wariant lepszy): dawne asercje zmienione, bo utrwalały błędy:
 * - A1 (plan wstecz): „opuszczony” tylko w dniach, gdy plan już obowiązywał — testy ustawiają plan wcześniej (since);
 * - A4 (UX-03/X-09): „Przenieś na dziś” + „Zamień miejscami” wysyłało dzisiejszy trening w przeszłość — teraz zamiana tylko od dziś;
 * - UX-13 A: zamiast 5–7 przycisków i osobnych „Propozycji” — najwyżej 3 akcje, „Więcej opcji” i jedna lista „Przesuń albo pomiń”, w której
 *   oba tryby właściciela („Przesuń plan o 1 dzień”, przeniesienie tylko tego treningu) i zamiana są pozycjami (bez okna „Plan przesunięty”);
 * - UX-15 A: Plan tygodnia — 7 wierszy dni z wyborem szablonu po tapnięciu; A9: pasek tygodnia — każdy dzień osobnym przyciskiem;
 * - A5: „zrobione” = zaplanowany szablon (inny trening — „zrobiony inny trening”).
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, withDemoTemplates, addWorkout } from './helpers';
import { renderApp, flushAll, screen, tap, act, go } from './app';
import { suggestionTexts } from '@/components/DayPanel';

const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek */
const S = () => store.getState();
afterEach(() => { applyLang('pl'); });
/** audyt 0.10 A1: plan ustawiony 28.09 — minione dni tego tygodnia mają już plan */
const since = (fn: () => void) => { jest.setSystemTime(new Date(2026, 8, 28, 9).getTime()); fn(); jest.setSystemTime(NOW.getTime()); };
const boot = async (fn: (ids: string[]) => void, url = '/history', locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); const t = withDemoTemplates(); fn(t.map(x => x.id));
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
  return t;
};
const openList = async () => { await tap(screen.getByText('Przesuń albo pomiń')); await flushAll(5); const m = screen.queryByText(/^Więcej możliwości/); if (m) { await tap(m); await flushAll(5); } };
const applyTitle = async (title: string | RegExp) => { await tap(screen.getByLabelText(typeof title === 'string' ? `Zastosuj: ${title}` : new RegExp(`^Zastosuj: ${title.source}`))); await flushAll(5); };

describe('plan tygodnia (/plan)', () => {
  test('wybór szablonu na dzień i „Wolne” (wiersz dnia → wybór, UX-15 A); opis; zapis', async () => {
    const t = await boot(() => {}, '/plan');
    expect(screen.getByText('Plan powtarza się co tydzień. Pojedyncze dni zmienisz w Kalendarzu.')).toBeTruthy();
    await tap(screen.getByLabelText('poniedziałek, Wolne')); await flushAll(5); await tap(screen.getByLabelText(`poniedziałek: ${t[0].name}`)); await flushAll(5);
    expect(plan.weekPlanDays()[0]).toBe(t[0].id);
    await tap(screen.getByLabelText(`poniedziałek, ${t[0].name}`)); await flushAll(5); await tap(screen.getByLabelText('poniedziałek: Wolne')); await flushAll(5); expect(S().weekPlan).toBeUndefined();
  });
});

describe('plan tygodnia bez szablonów', () => {
  test('„Nie masz jeszcze szablonów.” (po rozwinięciu dnia)', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/plan' }); await flushAll(10);
    await tap(screen.getByLabelText('poniedziałek, Wolne')); await flushAll(5); expect(screen.getByText('Nie masz jeszcze szablonów.')).toBeTruthy();
  });
});

describe('Kalendarz', () => {
  test('bez planu: podpowiedź i przycisk „Plan tygodnia”; tytuł i zakładka „Kalendarz”', async () => {
    await boot(() => {});
    expect(screen.getByText('Ustaw plan tygodnia, by widzieć zaplanowane treningi i przesuwać je w kalendarzu.')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Kalendarz' })).toBeTruthy(); expect(screen.getByText('Plan tygodnia')).toBeTruthy();
  });
  test('dni z planem: etykiety VoiceOver „zaplanowany” / „opuszczony” (z „dziś”); panel dnia; miniony dzień bez zamiany z przeszłością (A4)', async () => {
    const t = await boot(ids => since(() => { plan.setWeekDay(0, ids[0]); plan.setWeekDay(3, ids[1]); }));
    expect(screen.getByLabelText(`8 października 2026, dziś, zaplanowany: ${t[1].name}`)).toBeTruthy();
    expect(screen.getByLabelText(`5 października 2026, opuszczony: ${t[0].name}`)).toBeTruthy();
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5);
    expect(screen.getByTestId('day-panel')).toBeTruthy(); expect(screen.getByText(`Zaplanowany: ${t[1].name}`)).toBeTruthy();
    await tap(screen.getByTestId('cal-2026-10-05')); await flushAll(5); expect(screen.getByText(`Opuszczony: ${t[0].name}`)).toBeTruthy();
    await openList(); expect(screen.queryByText(/^Zamień z /)).toBeNull(); /* dawniej: „Przenieś na dziś” → „Zamień miejscami” — dzisiejszy trening trafiał w przeszłość */
    await applyTitle('Przesuń plan od dziś');
    expect([plan.plannedOn('2026-10-05'), plan.plannedOn('2026-10-08'), plan.plannedOn('2026-10-09')]).toEqual([null, t[0].id, t[1].id]);
  });
  test('„Przesuń plan o 1 dzień”: łańcuch do pierwszego wolnego dnia, opis przesunięć w liście', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); plan.setWeekDay(4, ids[1]); });
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); await openList();
    expect(screen.getAllByText(new RegExp(`^${t[0].name} → .*9 paź.*, ${t[1].name} → .*10 paź`)).length).toBeGreaterThan(0);
    await applyTitle('Przesuń plan o 1 dzień');
    expect([plan.plannedOn('2026-10-08'), plan.plannedOn('2026-10-09'), plan.plannedOn('2026-10-10')]).toEqual([null, t[0].id, t[1].id]);
  });
  test('przeniesienie tylko tego treningu: na wolny dzień — pozycja listy; na dzień z innym treningiem — tylko jawna „Zamień z …”', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); plan.setWeekDay(4, ids[1]); });
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); await openList();
    expect(screen.queryByLabelText(/^Zastosuj: Przenieś na pt\./)).toBeNull(); /* piątek zajęty — nie ma „przenieś”, jest „zamień” */
    expect(screen.getByLabelText(new RegExp(`^Zastosuj: Zamień z pt\\.,? 9 paź.* \\(${t[1].name}\\)$`))).toBeTruthy();
    await applyTitle(/Przenieś na sob\./);
    expect([plan.plannedOn('2026-10-08'), plan.plannedOn('2026-10-10')]).toEqual([null, t[0].id]);
  });
  test('inny trening / wolne w tym dniu / przywróć z planu (Więcej opcji) / dodaj trening na wolny dzień', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); });
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5);
    await tap(screen.getByText('Inny trening')); await flushAll(5); await tap(screen.getByText(t[2].name)); await flushAll(5);
    expect(plan.plannedOn('2026-10-08')).toBe(t[2].id); expect(screen.getByText(`Zaplanowany: ${t[2].name} · zmiana planu`)).toBeTruthy();
    await tap(screen.getByText('Więcej opcji')); await flushAll(5); await tap(screen.getByText('Przywróć z planu')); await flushAll(5); expect(plan.plannedOn('2026-10-08')).toBe(t[0].id);
    await openList(); await applyTitle('Wolne w tym dniu'); expect(plan.plannedOn('2026-10-08')).toBeNull(); expect(screen.getByText('Wolne · zmiana planu')).toBeTruthy();
    await tap(screen.getByTestId('cal-2026-10-10')); await flushAll(5); await tap(screen.getByText('Dodaj trening')); await flushAll(5); await tap(screen.getByText(t[1].name)); await flushAll(5);
    expect(plan.plannedOn('2026-10-10')).toBe(t[1].id);
  });
  test('przesunięcie planu tworzące parę dzień po dniu z tymi samymi partiami — ostrzeżenie w opisie (docs/research/23)', async () => {
    await boot(ids => { plan.setWeekDay(3, ids[0]); plan.setWeekDay(5, ids[1]); }); /* czw. Upper A, sob. Upper B */
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); await openList();
    const sh = suggestionTexts('2026-10-08', plan.suggest('2026-10-08').find(x => x.kind === 'shift')!);
    expect(sh.details).toContainEqual(expect.stringMatching(/^Uwaga: .*9 paź i .*10 paź dzień po dniu — te same główne partie\.$/));
    for (const d of sh.details) expect(screen.getAllByText(d).length).toBeGreaterThan(0);
  });
  test('lista „Przesuń albo pomiń”: najwyżej 4 od razu, „polecane”, opisy i ostrzeżenia, kolejność i warunkowa stopka (MER-16); „Zastosuj” zmienia plan i zamyka listę', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); plan.setWeekDay(5, ids[1]); });
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5);
    expect(screen.getByHintText('Lista możliwości: przesunięcie planu, przeniesienie tylko tego treningu, zamiana albo wolne — z uwzględnieniem regeneracji partii.')).toBeTruthy();
    await tap(screen.getByText('Przesuń albo pomiń')); await flushAll(5);
    expect(screen.getByTestId('suggestions')).toBeTruthy();
    const all = plan.suggest('2026-10-08', '2026-10-08'); const list = all.slice(0, 4); expect(all.length).toBeGreaterThan(4);
    for (const sg of list) { const { title, details } = suggestionTexts('2026-10-08', sg); expect(screen.getByLabelText(`Zastosuj: ${title}`)).toBeTruthy(); details.forEach(d => expect(screen.getAllByText(d).length).toBeGreaterThan(0)); }
    expect(screen.getAllByText(/^Zmienione dni: \d+$/).length).toBe(4); expect(screen.getByText(`Więcej możliwości (${all.length - 4})`)).toBeTruthy();
    expect(screen.getByText(new RegExp(`^${suggestionTexts('2026-10-08', list[0]).title.replace(/[.()]/g, '\\$&')} · polecane$`))).toBeTruthy();
    /* audyt kontrolny 1 (UX2-09, celowa zmiana): przy widocznym ostrzeżeniu „dzień po dniu” stopka bez zdania „dwa dni pod rząd … też są w porządku” */
    expect(list.some(x => x.newBackToBack.length)).toBe(true);
    expect(screen.getByText(/^Uproszczenie: zwykle dzień przerwy między sesjami z tymi samymi głównymi partiami\. Każda z tych możliwości wraca do rutyny w ciągu 10 dni\.$/)).toBeTruthy();
    await tap(screen.getByText(`Więcej możliwości (${all.length - 4})`)); await flushAll(5); expect(screen.queryByText(/dwa dni pod rząd/)).toBeNull();
    const first = suggestionTexts('2026-10-08', list[0]).title; const want = list[0].ov;
    await tap(screen.getByLabelText(`Zastosuj: ${first}`)); await flushAll(5);
    for (const [k, v] of Object.entries(want)) expect(plan.plannedOn(k)).toBe(v);
    expect(screen.queryByTestId('suggestions')).toBeNull(); expect(t.length).toBeGreaterThan(1);
  });
  test('opisy pozycji listy: przeniesienie, zamiana, przesunięcie (z treningami na nowych dniach), wolne, utrata sesji, zmiany poza oknem powrotu', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); });
    const base = { changes: 2, newBackToBack: [], dropped: 0, returns: true, placed: [], ov: {} };
    expect(suggestionTexts('2026-10-08', { ...base, kind: 'move', to: '2026-10-10' }).title).toMatch(/^Przenieś na sob\.,? 10 paź/);
    expect(suggestionTexts('2026-10-12', { ...base, kind: 'swap', to: '2026-10-15' }).title).toMatch(new RegExp(`^Zamień z czw\\.,? 15 paź.* \\(${t[0].name}\\)$`));
    const sh = suggestionTexts('2026-10-08', { ...base, kind: 'shift', placed: [{ id: t[0].id, to: '2026-10-09' }], newBackToBack: [{ a: '2026-10-09', b: '2026-10-10' }] });
    expect(sh.title).toBe('Przesuń plan o 1 dzień'); expect(sh.details[0]).toMatch(new RegExp(`^${t[0].name} → pt\\.,? 9 paź`));
    expect(suggestionTexts('2026-10-05', { ...base, kind: 'shift' }).title).toBe('Przesuń plan od dziś'); /* miniony dzień (A4) */
    const warn = 'Uwaga: {a} i {b} dzień po dniu — te same główne partie.'; expect(sh.details[2]).toMatch(new RegExp('^' + warn.split('{a}')[0] + 'pt\\.,? 9 paź i sob\\.,? 10 paź' + warn.split('{b}')[1].replace('.', '\\.') + '$'));
    const sk = suggestionTexts('2026-10-08', { ...base, kind: 'skip', dropped: 1, returns: false, changes: 1 });
    expect(sk).toEqual({ title: 'Wolne w tym dniu', details: ['Zmienione dni: 1', 'Wypada treningów: 1', 'Zmiany sięgają dalej niż 10 dni.'] });
  });
  test('English: list', async () => {
    await boot(ids => { plan.setWeekDay(3, ids[0]); plan.setWeekDay(5, ids[1]); }, '/history', 'en');
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); await tap(screen.getByText('Move or skip')); await flushAll(5);
    expect(screen.getAllByText(/^Days changed: \d+$/).length).toBe(4);
  });
  test('start zaplanowanego treningu z panelu dziś', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); });
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); await tap(screen.getByLabelText(`Start zaplanowanego treningu: ${t[0].name}`)); await flushAll(10);
    expect(S().active?.templateId).toBe(t[0].id);
  });
});

describe('ekran treningu: „Dziś” i podgląd tygodnia', () => {
  test('nowa osoba bez planu — brak karty; z planem — „Dziś: X”, start, pasek tygodnia (dzień = przycisk, A9); dzień wolny; po treningu z planu „zrobione”', async () => {
    await boot(() => {}, '/'); expect(screen.queryByTestId('today-plan')).toBeNull();
    const t = await boot(ids => since(() => { plan.setWeekDay(0, ids[1]); plan.setWeekDay(3, ids[0]); plan.setWeekDay(4, ids[1]); }), '/');
    expect(screen.getByText(`Dziś: ${t[0].name}`)).toBeTruthy();
    expect(screen.getByLabelText(`poniedziałek, 5 października, opuszczony: ${t[1].name}`)).toBeTruthy(); expect(screen.getByLabelText('wtorek, 6 października, odpoczynek')).toBeTruthy(); /* dzień bez treningu w planie — odpoczynek (decyzja 09.10.2026 wieczór) */
    expect(screen.getByLabelText(`czwartek, 8 października, dziś, zaplanowany: ${t[0].name}`)).toBeTruthy(); expect(screen.getByLabelText(`piątek, 9 października, zaplanowany: ${t[1].name}`)).toBeTruthy();
    await tap(screen.getByTestId('strip-2026-10-09')); await flushAll(10); expect(screen.getByRole('header', { name: 'Kalendarz' })).toBeTruthy(); expect(screen.getByText('piątek, 9 października')).toBeTruthy(); await go('/'); await flushAll(10);
    await tap(screen.getByLabelText(`Start zaplanowanego treningu: ${t[0].name}`)); await flushAll(10); expect(S().active?.templateId).toBe(t[0].id);
    await boot(ids => { plan.setWeekDay(4, ids[1]); }, '/'); expect(screen.getByText('Dziś wolne')).toBeTruthy();
    const t3 = await boot(ids => { plan.setWeekDay(3, ids[0]); addWorkout(new Date(2026, 9, 8, 7).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Upper A').templateId = ids[0]; store.save(); }, '/');
    expect(screen.getByText(`Dziś zrobione: Upper A`)).toBeTruthy(); expect(screen.queryByLabelText(`Start zaplanowanego treningu: ${t3[0].name}`)).toBeNull();
    expect(screen.getByLabelText('czwartek, 8 października, dziś, zrobione: Upper A')).toBeTruthy();
  });
  test('bez planu, z treningami — karta z tygodniem, „Bez planu tygodnia”, zachęta i „Plan tygodnia”', async () => {
    await boot(() => { addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); }, '/');
    expect(screen.getByText('Dziś')).toBeTruthy(); expect(screen.getByText('Bez planu tygodnia')).toBeTruthy();
    expect(screen.getByText('Ustaw plan tygodnia, by widzieć tu dzisiejszy trening i dostawać przypomnienie.')).toBeTruthy();
    expect(screen.getByLabelText('poniedziałek, 5 października, wolne')).toBeTruthy(); expect(screen.getByLabelText('wtorek, 6 października, zrobione: T')).toBeTruthy();
    await tap(screen.getAllByText('Plan tygodnia')[0]); await flushAll(10); expect(screen.getByText('Plan powtarza się co tydzień. Pojedyncze dni zmienisz w Kalendarzu.')).toBeTruthy();
  });
  test('lista sesji w Kalendarzu pokazuje czas bez pauz', async () => {
    await boot(() => { const w = addWorkout(new Date(2026, 9, 7, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.pauses = [[w.startedAt + 60e3, w.startedAt + 16 * 60e3]]; store.save(); });
    expect(screen.getAllByText(/ · 45:00 · /).length).toBeGreaterThan(0);
  });
  test('English', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); }, '/', 'en');
    expect(screen.getByText(`Today: ${t[0].name}`)).toBeTruthy();
    await go('/history'); await flushAll(10); expect(screen.getByRole('header', { name: 'Calendar' })).toBeTruthy(); expect(screen.getByText('Weekly plan')).toBeTruthy();
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); expect(screen.getByText('Move or skip')).toBeTruthy(); expect(screen.getByText('Other workout')).toBeTruthy();
  });
});
