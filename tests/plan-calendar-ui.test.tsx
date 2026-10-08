/*
 * Kalendarz z planem tygodnia — ekrany (decyzje właściciela 08.10.2026: 1A zakładka Kalendarz, 2A plan tygodnia + dwa tryby przesuwania).
 * Rodzaje (docs/20): ekran (plan tygodnia, panel dnia, przesuwanie, konflikt i „Zamień miejscami”, wolne/inny/dodaj/przywróć, opuszczony →
 * na dziś, start), scenariusz (plan → kalendarz → start z ekranu treningu), języki (EN), VoiceOver (etykiety dni). E2E: .maestro/13.
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
const boot = async (fn: (ids: string[]) => void, url = '/history', locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); const t = withDemoTemplates(); fn(t.map(x => x.id));
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
  return t;
};
const alertBtn = async (title: string, btn: string) => { const a = [...global.__alerts].reverse().find(x => x.title === title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(5); };

describe('plan tygodnia (/plan)', () => {
  test('wybór szablonu na dzień i „Wolne”; opis; zapis', async () => {
    const t = await boot(() => {}, '/plan');
    expect(screen.getByText('Plan powtarza się co tydzień. Pojedyncze dni zmienisz w Kalendarzu.')).toBeTruthy();
    await tap(screen.getByLabelText(`poniedziałek: ${t[0].name}`)); await flushAll(5);
    expect(plan.weekPlanDays()[0]).toBe(t[0].id);
    await tap(screen.getByLabelText('poniedziałek: Wolne')); await flushAll(5); expect(S().weekPlan).toBeUndefined();
  });
});

describe('plan tygodnia bez szablonów', () => {
  test('„Nie masz jeszcze szablonów.”', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/plan' }); await flushAll(10);
    expect(screen.getByText('Nie masz jeszcze szablonów.')).toBeTruthy();
  });
});

describe('Kalendarz', () => {
  test('bez planu: podpowiedź i przycisk „Plan tygodnia”; tytuł i zakładka „Kalendarz”', async () => {
    await boot(() => {});
    expect(screen.getByText('Ustaw plan tygodnia, by widzieć zaplanowane treningi i przesuwać je w kalendarzu.')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Kalendarz' })).toBeTruthy(); expect(screen.getByText('Plan tygodnia')).toBeTruthy();
  });
  test('dni z planem: etykiety VoiceOver „zaplanowany” / „opuszczony”; panel dnia', async () => {
    const t = await boot(ids => { plan.setWeekDay(0, ids[0]); plan.setWeekDay(3, ids[1]); });
    expect(screen.getByLabelText(`8 października 2026, zaplanowany: ${t[1].name}`)).toBeTruthy();
    expect(screen.getByLabelText(`5 października 2026, opuszczony: ${t[0].name}`)).toBeTruthy();
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5);
    expect(screen.getByTestId('day-panel')).toBeTruthy(); expect(screen.getByText(`Zaplanowany: ${t[1].name}`)).toBeTruthy();
    await tap(screen.getByTestId('cal-2026-10-05')); await flushAll(5); expect(screen.getByText(`Opuszczony: ${t[0].name}`)).toBeTruthy();
    await tap(screen.getByText('Przenieś na dziś')); await flushAll(5);
    await alertBtn('Ten dzień jest zajęty', 'Zamień miejscami');
    expect([plan.plannedOn('2026-10-05'), plan.plannedOn('2026-10-08')]).toEqual([t[1].id, t[0].id]);
  });
  test('„Przesuń plan o 1 dzień”: łańcuch do pierwszego wolnego dnia, komunikat z listą przesunięć', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); plan.setWeekDay(4, ids[1]); });
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); await tap(screen.getByText('Przesuń plan o 1 dzień')); await flushAll(5);
    const a = global.__alerts.find(x => x.title === 'Plan przesunięty')!; expect(a.msg).toMatch(new RegExp(`^${t[0].name} → .*9\\.10.*, ${t[1].name} → .*10\\.10`));
    expect([plan.plannedOn('2026-10-08'), plan.plannedOn('2026-10-09'), plan.plannedOn('2026-10-10')]).toEqual([null, t[0].id, t[1].id]);
  });
  test('„Przesuń tylko ten trening”: wolny dzień — od razu; zajęty — pytanie, „Anuluj” nic nie zmienia', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); plan.setWeekDay(4, ids[1]); });
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); await tap(screen.getByText('Przesuń tylko ten trening')); await flushAll(5);
    expect(screen.getByText('Na który dzień? Zajęte dni są oznaczone nazwą treningu.')).toBeTruthy();
    await tap(screen.getByLabelText(new RegExp(`^piątek, 9 października, zajęty: ${t[1].name}$`))); await flushAll(5);
    const a = [...global.__alerts].reverse().find(x => x.title === 'Ten dzień jest zajęty')!; expect(a.msg).toBe(`piątek, 9 października: ${t[1].name}. Bez Twojej zgody nie przesuwam na dzień z innym treningiem.`);
    await alertBtn('Ten dzień jest zajęty', 'Anuluj'); expect(plan.plannedOn('2026-10-08')).toBe(t[0].id);
    await tap(screen.getByText('Przesuń tylko ten trening')); await flushAll(5); await tap(screen.getByLabelText('sobota, 10 października')); await flushAll(5);
    expect([plan.plannedOn('2026-10-08'), plan.plannedOn('2026-10-10')]).toEqual([null, t[0].id]);
  });
  test('inny trening / wolne w tym dniu / przywróć z planu / dodaj trening na wolny dzień', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); });
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5);
    await tap(screen.getByText('Inny trening')); await flushAll(5); await tap(screen.getByText(t[2].name)); await flushAll(5);
    expect(plan.plannedOn('2026-10-08')).toBe(t[2].id); expect(screen.getByText(`Zaplanowany: ${t[2].name} · zmiana planu`)).toBeTruthy();
    await tap(screen.getByText('Przywróć z planu')); await flushAll(5); expect(plan.plannedOn('2026-10-08')).toBe(t[0].id);
    await tap(screen.getByText('Wolne w tym dniu')); await flushAll(5); expect(plan.plannedOn('2026-10-08')).toBeNull(); expect(screen.getByText('Wolne · zmiana planu')).toBeTruthy();
    await tap(screen.getByTestId('cal-2026-10-10')); await flushAll(5); await tap(screen.getByText('Dodaj trening')); await flushAll(5); await tap(screen.getByText(t[1].name)); await flushAll(5);
    expect(plan.plannedOn('2026-10-10')).toBe(t[1].id);
  });
  test('przesunięcie planu tworzące parę dzień po dniu z tymi samymi partiami — ostrzeżenie w komunikacie (docs/research/23)', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); plan.setWeekDay(5, ids[1]); }); /* czw. Upper A, sob. Upper B */
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); await tap(screen.getByText('Przesuń plan o 1 dzień')); await flushAll(5);
    const a = global.__alerts.find(x => x.title === 'Plan przesunięty')!;
    expect(a.msg).toMatch(new RegExp(`^${t[0].name} → .*9\\.10\nUwaga: .*9\\.10 i .*10\\.10 dzień po dniu — te same główne partie\\.$`));
  });
  test('„Propozycje”: najwyżej 3, opis zmian i ostrzeżeń, podpis uproszczenia; „Zastosuj” zmienia plan i zamyka listę', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); plan.setWeekDay(5, ids[1]); });
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5);
    expect(screen.getByHintText('Ułożenie tygodnia z najmniejszą liczbą zmian, z uwzględnieniem regeneracji partii.')).toBeTruthy();
    await tap(screen.getByText('Propozycje')); await flushAll(5);
    expect(screen.getByTestId('suggestions')).toBeTruthy();
    const list = plan.suggest('2026-10-08', '2026-10-08').slice(0, 3); expect(list.length).toBe(3);
    for (const sg of list) { const { title, details } = suggestionTexts('2026-10-08', sg); expect(screen.getByLabelText(`Zastosuj: ${title}`)).toBeTruthy(); details.forEach(d => expect(screen.getAllByText(d).length).toBeGreaterThan(0)); }
    expect(screen.getAllByText(/^Zmienione dni: \d+$/).length).toBe(3);
    expect(screen.getByText(/^Uproszczenie: zwykle dzień przerwy .* w ciągu 10 dni\.$/)).toBeTruthy();
    const first = suggestionTexts('2026-10-08', list[0]).title; const want = list[0].ov;
    await tap(screen.getByLabelText(`Zastosuj: ${first}`)); await flushAll(5);
    for (const [k, v] of Object.entries(want)) expect(plan.plannedOn(k)).toBe(v);
    expect(screen.queryByTestId('suggestions')).toBeNull(); expect(t.length).toBeGreaterThan(1);
  });
  test('opisy propozycji: przeniesienie, zamiana, pominięcie, utrata sesji, zmiany poza oknem powrotu', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); });
    const base = { changes: 2, newBackToBack: [], dropped: 0, returns: true, ov: {} };
    expect(suggestionTexts('2026-10-08', { ...base, kind: 'move', to: '2026-10-10' }).title).toMatch(/^Przenieś na sob\.,? 10\.10/);
    expect(suggestionTexts('2026-10-12', { ...base, kind: 'swap', to: '2026-10-15' }).title).toMatch(new RegExp(`^Zamień z czw\\.,? 15\\.10.* \\(${t[0].name}\\)$`));
    const sh = suggestionTexts('2026-10-08', { ...base, kind: 'shift', newBackToBack: [{ a: '2026-10-09', b: '2026-10-10' }] });
    expect(sh.title).toBe('Przesuń plan od tego dnia');
    const warn = 'Uwaga: {a} i {b} dzień po dniu — te same główne partie.'; expect(sh.details[1]).toMatch(new RegExp('^' + warn.split('{a}')[0] + 'pt\\.,? 9\\.10 i sob\\.,? 10\\.10' + warn.split('{b}')[1].replace('.', '\\.') + '$'));
    const cap = 'Uproszczenie: zwykle dzień przerwy między sesjami z tymi samymi głównymi partiami; dwa dni pod rząd przy tej samej liczbie serii w tygodniu też są w porządku (przeglądy badań, ACSM). Po zmianach plan wraca do rutyny w ciągu {n} dni.';
    expect(cap.replace('{n}', '10')).toMatch(/^Uproszczenie: .* 10 dni\.$/); /* tekst z t() — macierz; na ekranie sprawdzany w teście „Propozycje” */
    const sk = suggestionTexts('2026-10-08', { ...base, kind: 'skip', dropped: 1, returns: false, changes: 1 });
    expect(sk).toEqual({ title: 'Pomiń ten trening', details: ['Zmienione dni: 1', 'Wypada treningów: 1', 'Zmiany sięgają dalej niż 10 dni.'] });
  });
  test('English: suggestions', async () => {
    await boot(ids => { plan.setWeekDay(3, ids[0]); plan.setWeekDay(5, ids[1]); }, '/history', 'en');
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); await tap(screen.getByText('Suggestions')); await flushAll(5);
    expect(screen.getAllByText(/^Days changed: \d+$/).length).toBe(3);
  });
  test('start zaplanowanego treningu z panelu dziś', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); });
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); await tap(screen.getByLabelText(`Start zaplanowanego treningu: ${t[0].name}`)); await flushAll(10);
    expect(S().active?.templateId).toBe(t[0].id);
  });
});

describe('ekran treningu: „Dziś” i podgląd tygodnia', () => {
  test('nowa osoba bez planu — brak karty; z planem — „Dziś: X”, start, pasek tygodnia pon…nd dla VoiceOver; dzień wolny; po treningu „zrobione”', async () => {
    await boot(() => {}, '/'); expect(screen.queryByTestId('today-plan')).toBeNull();
    const t = await boot(ids => { plan.setWeekDay(0, ids[1]); plan.setWeekDay(3, ids[0]); plan.setWeekDay(4, ids[1]); }, '/');
    expect(screen.getByText(`Dziś: ${t[0].name}`)).toBeTruthy();
    expect(screen.getByLabelText(new RegExp(`^Ten tydzień: pon\\. opuszczony: ${t[1].name}, wt\\. wolne, śr\\. wolne, czw\\. zaplanowany: ${t[0].name}, pt\\. zaplanowany: ${t[1].name}, sob\\. wolne, niedz\\. wolne\\. Tapnij, by otworzyć Kalendarz\\.$`))).toBeTruthy();
    const strip = 'Ten tydzień: {list}. Tapnij, by otworzyć Kalendarz.'; expect(screen.getByLabelText(new RegExp('^' + strip.split('{list}')[0]))).toBeTruthy(); /* tekst z t() — macierz */
    await tap(screen.getByTestId('week-strip')); await flushAll(10); expect(screen.getByRole('header', { name: 'Kalendarz' })).toBeTruthy(); await go('/'); await flushAll(10);
    await tap(screen.getByLabelText(`Start zaplanowanego treningu: ${t[0].name}`)); await flushAll(10); expect(S().active?.templateId).toBe(t[0].id);
    await boot(ids => { plan.setWeekDay(4, ids[1]); }, '/'); expect(screen.getByText('Dziś wolne')).toBeTruthy();
    const t3 = await boot(ids => { plan.setWeekDay(3, ids[0]); addWorkout(new Date(2026, 9, 8, 7).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); }, '/');
    expect(screen.getByText(`Dziś: ${t3[0].name} · zrobione`)).toBeTruthy(); expect(screen.queryByLabelText(`Start zaplanowanego treningu: ${t3[0].name}`)).toBeNull();
    expect(screen.getByLabelText(/, czw\. zrobione, /)).toBeTruthy();
  });
  test('bez planu, z treningami — karta z tygodniem, „Bez planu tygodnia”, zachęta i „Plan tygodnia”', async () => {
    await boot(() => { addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); }, '/');
    expect(screen.getByText('Dziś')).toBeTruthy(); expect(screen.getByText('Bez planu tygodnia')).toBeTruthy();
    expect(screen.getByText('Ustaw plan tygodnia, by widzieć tu dzisiejszy trening i dostawać przypomnienie.')).toBeTruthy();
    expect(screen.getByLabelText(/^Ten tydzień: pon\. wolne, wt\. zrobione, /)).toBeTruthy();
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
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); expect(screen.getByText('Move plan by 1 day')).toBeTruthy(); expect(screen.getByText('Move only this workout')).toBeTruthy();
  });
});
