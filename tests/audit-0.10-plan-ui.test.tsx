/*
 * Audyt 0.10 (08.10.2026, docs/25 grupy A, B, D4, I, J) — testy regresji EKRANÓW planu tygodnia i kalendarza: panel dnia, karta „Dziś” i pasek
 * tygodnia, kalendarz (VoiceOver), Plan tygodnia (wiersze dni, „Nowy plan”, „Inne plany”), potwierdzenia usuwania / archiwizacji szablonu,
 * Ustawienia (zgoda na powiadomienia), ekran „Dane z nowszej wersji”. Decyzje właściciela 08.10.2026 (docs/18), wieczorem — wariant lepszy:
 * B1 (zmiany dni z planem), B2 A („Nowy plan” edytowany przed aktywacją), A5 (dopasowanie po szablonie), UX-13 A (3 akcje + „Więcej opcji”).
 * Logika i dane: tests/audit-0.10-plan.test.ts. E2E: .maestro/13.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { applyLang } from '@/lib/i18n';
import { SCHEMA_VERSION } from '@/lib/seed';
import { fresh, saved, withDemoTemplates, addWorkout, pressAlert } from './helpers';
import { renderApp, flushAll, screen, tap, act, go, swipeDelete } from './app';
import { fireEvent } from '@testing-library/react-native';
import { FlatList, Linking } from 'react-native';

const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek 8.10.2026 */
const S = () => store.getState();
const at = (k: string, h = 18) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10), h).getTime();
afterEach(() => { applyLang('pl'); jest.restoreAllMocks(); });
/** Plan ustawiony 28.09 (minione dni tego tygodnia mają już plan). */
const since = (fn: () => void) => { jest.setSystemTime(at('2026-09-28', 9)); fn(); jest.setSystemTime(NOW.getTime()); };
const boot = async (fn: (ids: string[]) => void, url = '/history', locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); const t = withDemoTemplates(); fn(t.map(x => x.id));
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
  return t;
};
const lastAlert = (title: string) => [...global.__alerts].reverse().find(x => x.title === title);
const press = async (title: string, btn: string) => { await act(async () => { pressAlert(title, btn); }); await flushAll(5); };
const openDay = async (k: string) => { await tap(screen.getByTestId(`cal-${k}`)); await flushAll(5); };
const showAll = async () => { const b = screen.queryByText(/^Więcej możliwości/); if (b) { await tap(b); await flushAll(5); } };
const panelButtons = () => screen.getByTestId('day-panel').findAll((n: any) => n.props.accessibilityRole === 'button' && typeof n.props.onPress === 'function' && n.props.accessibilityLabel).map((n: any) => n.props.accessibilityLabel as string).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);

describe('A2 — panel dnia: jeden stan dnia (dayStatus)', () => {
  test('A2 (X-01 U1/UX-01): miniony dzień zrobiony z planu — „Zrobione: <sesja> ›” prowadzi do sesji, bez przesuwania i bez „Opuszczony”', async () => {
    const t = await boot(ids => { since(() => plan.setWeekDay(0, ids[0])); addWorkout(at('2026-10-05'), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Upper A').templateId = ids[0]; store.save(); });
    await openDay('2026-10-05');
    expect(screen.getByText(`Zrobione: ${t[0].name} ›`)).toBeTruthy(); expect(screen.queryByText(new RegExp('^Opuszczony'))).toBeNull();
    expect(screen.queryByText('Przesuń albo pomiń')).toBeNull(); expect(screen.queryByText('Przenieś na dziś')).toBeNull(); expect(screen.queryByText('Propozycje')).toBeNull();
    await tap(screen.getByLabelText(`Zrobione: ${t[0].name}`)); await flushAll(10); expect(screen.getByLabelText('Edytuj sesję')).toBeTruthy(); /* ekran sesji */
  });
  test('A2 (X-01 U2): dziś zrobione — panel bez Startu i przesuwania; karta „Dziś zrobione: …” bez Startu; kalendarz „dziś, 1 sesja”', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); addWorkout(at('2026-10-08', 7), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Upper A').templateId = ids[0]; store.save(); });
    expect(screen.getByLabelText('8 października 2026, dziś, 1 sesja')).toBeTruthy();
    await openDay('2026-10-08');
    expect(screen.getByText(`Zrobione: ${t[0].name} ›`)).toBeTruthy(); expect(screen.queryByText('Start')).toBeNull(); expect(screen.queryByText('Przesuń albo pomiń')).toBeNull();
    await go('/'); await flushAll(10);
    expect(screen.getByText(`Dziś zrobione: ${t[0].name}`)).toBeTruthy(); expect(screen.queryByLabelText(`Start zaplanowanego treningu: ${t[0].name}`)).toBeNull();
  });
  test('A2 (X-01): trening w toku dziś — panel bez przesuwania, „Trening w toku”', async () => {
    await boot(ids => { plan.setWeekDay(3, ids[0]); store.startFromTemplate(S().templates.find(x => x.id === ids[1])!); });
    await openDay('2026-10-08');
    expect(screen.getByText('Trening w toku')).toBeTruthy(); expect(screen.queryByText('Przesuń albo pomiń')).toBeNull(); expect(screen.queryByText('Inny trening')).toBeNull();
  });
});

describe('A4 — miniony dzień', () => {
  test('A4 (UX-03/X-09): opuszczony dzień — „Przesuń albo pomiń”: „Przesuń plan od dziś” (łańcuch), przeniesienie od dziś, „Wolne w tym dniu”; bez zamiany z przeszłością', async () => {
    const t = await boot(ids => since(() => { plan.setWeekDay(0, ids[0]); plan.setWeekDay(3, ids[1]); }));
    await openDay('2026-10-05');
    expect(screen.getByText(`Opuszczony: ${t[0].name}`)).toBeTruthy(); expect(screen.getByText('Zapisz trening z tego dnia')).toBeTruthy();
    await tap(screen.getByText('Przesuń albo pomiń')); await flushAll(5); await showAll();
    expect(screen.getByText(/ · polecane$/)).toBeTruthy(); expect(screen.getByText(/^Przesuń plan od dziś/)).toBeTruthy(); expect(screen.queryByText(/^Zamień z /)).toBeNull();
    await tap(screen.getByLabelText('Zastosuj: Przesuń plan od dziś')); await flushAll(5);
    expect([plan.plannedOn('2026-10-05'), plan.plannedOn('2026-10-08'), plan.plannedOn('2026-10-09')]).toEqual([null, t[0].id, t[1].id]); /* wczoraj nie dałem rady: A dziś, B jutro */
    expect(screen.queryByTestId('suggestions')).toBeNull();
  });
  test('A4: „Wolne w tym dniu” dla minionego dnia; „Zapisz trening z tego dnia” — trening wstecz z tą datą i szablonem z planu na górze', async () => {
    const t = await boot(ids => since(() => plan.setWeekDay(0, ids[1])));
    await openDay('2026-10-05'); await tap(screen.getByText('Przesuń albo pomiń')); await flushAll(5); await showAll();
    await tap(screen.getByLabelText('Zastosuj: Wolne w tym dniu')); await flushAll(5); expect(plan.dayStatus('2026-10-05').status).toBe('rest');
    await tap(screen.getByText('Więcej opcji')); await flushAll(5); await tap(screen.getByText('Przywróć z planu')); await flushAll(5);
    await tap(screen.getByText('Zapisz trening z tego dnia')); await flushAll(10);
    expect(screen.getByDisplayValue('2026-10-05')).toBeTruthy(); expect(screen.getAllByText(t[1].name)[0]).toBeTruthy();
  });
});

describe('A5 — zrobiony inny trening (dopasowanie po szablonie)', () => {
  test('A5 (X-04/UX-01): karta, pasek, kalendarz, panel i kafelek — zaplanowany czeka, nazwa faktycznej sesji', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); const w = addWorkout(at('2026-10-08', 7), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Legs — dom'); w.templateId = ids[3]; store.save(); }, '/');
    expect(screen.getByText(`Dziś: ${t[0].name}`)).toBeTruthy(); expect(screen.getByText('Zrobiony inny trening: Legs — dom')).toBeTruthy();
    expect(screen.getByLabelText(`Start zaplanowanego treningu: ${t[0].name}`)).toBeTruthy();
    expect(screen.getByLabelText(`czwartek, 8 października, dziś, zrobiony inny trening: Legs — dom, zaplanowany: ${t[0].name}`)).toBeTruthy();
    expect(screen.getByTestId('week-stacks').props.accessibilityLabel).toBe('Postęp tygodnia: 0% planu, zrobione 0 z 1 treningów z planu'); /* postęp tygodnia (stosy) w „Ten tydzień” — inny trening nie zalicza dnia z planu */
    await go('/history'); await flushAll(10);
    expect(screen.getByLabelText(`8 października 2026, dziś, 1 sesja, zrobiony inny trening, zaplanowany: ${t[0].name}`)).toBeTruthy();
    await openDay('2026-10-08');
    expect(screen.getByText('Zrobiony inny trening: Legs — dom ›')).toBeTruthy(); expect(screen.getByText(`Zaplanowany: ${t[0].name}`)).toBeTruthy(); expect(screen.getByText('Przesuń albo pomiń')).toBeTruthy();
  });
});

describe('A6–A8', () => {
  test('A6 (X-05 U5): plan wyczyszczony, została zmiana „wolne” — karta „Bez planu tygodnia”, bez „1 / 0”', async () => {
    await boot(ids => { plan.setWeekDay(4, ids[0]); plan.setDayPlan('2026-10-09', null); plan.setWeekDay(4, null); addWorkout(at('2026-10-06'), [['Back Squat', [{ weight: 100, reps: 5 }]]]); }, '/');
    expect(screen.getByText('Bez planu tygodnia')).toBeTruthy(); expect(screen.queryByText(/Z planu w tym tygodniu/)).toBeNull(); expect(screen.queryByText('1 / 0')).toBeNull();
  });
  test('A7 (UX-07/UI-06/X-06): usunięcie szablonu z planu — pytanie wymienia dni; po usunięciu dni wolne, bez martwych id', async () => {
    const t = await boot(ids => { plan.setWeekDay(0, ids[0]); plan.setWeekDay(3, ids[0]); plan.setWeekDay(4, ids[1]); }, '/templates');
    await swipeDelete(`Usuń szablon: ${t[0].name}`);
    expect(lastAlert('Usunąć szablon?')!.msg).toBe(`${t[0].name}\n\nW planie tygodnia: pon., czw. — te dni będą wolne.`);
    await press('Usunąć szablon?', 'Usuń');
    expect(plan.weekPlanDays()).toEqual([null, null, null, null, t[1].id, null, null]);
  });
  test('A7: archiwizacja szablonu z planu — pytanie ze skutkami; bez planu — bez pytania', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); }, '/templates');
    await go(`/template/${t[0].id}`); await flushAll(10); await tap(screen.getByText('Archiwizuj')); await flushAll(5);
    expect(lastAlert('Archiwizować szablon?')!.msg).toBe(`${t[0].name}\n\nW planie tygodnia: czw. — te dni będą wolne.\nPo przywróceniu z archiwum szablon wróci do planu.`);
    expect(S().templates.find(x => x.id === t[0].id)!.archived).toBeUndefined();
    await press('Archiwizować szablon?', 'Archiwizuj'); expect(S().templates.find(x => x.id === t[0].id)!.archived).toBe(true);
    await go(`/template/${t[2].id}`); await flushAll(10); global.__alerts.length = 0; await tap(screen.getByText('Archiwizuj')); await flushAll(5);
    expect(global.__alerts).toEqual([]); expect(S().templates.find(x => x.id === t[2].id)!.archived).toBe(true);
  });
  test('A8 (X-10 U3): pusty szablon w planie — karta i panel bez Startu, „Szablon jest pusty — dodaj ćwiczenia”', async () => {
    const t = await boot(ids => { const tpl = S().templates.find(x => x.id === ids[0])!; tpl.items = []; store.save(tpl); plan.setWeekDay(3, ids[0]); }, '/');
    expect(screen.queryByLabelText(`Start zaplanowanego treningu: ${t[0].name}`)).toBeNull(); expect(screen.getByText('Szablon jest pusty — dodaj ćwiczenia')).toBeTruthy();
    await go('/history'); await flushAll(10); await openDay('2026-10-08');
    expect(screen.queryByText('Start')).toBeNull(); expect(screen.getAllByText('Szablon jest pusty — dodaj ćwiczenia').length).toBeGreaterThan(0);
  });
});

describe('A9, A11-05, D4 — pasek tygodnia, kalendarz, deload', () => {
  test('A9 (UX-08): pod paskiem najbliższe treningi z nazwą; tapnięcie dnia otwiera ten dzień w Kalendarzu', async () => {
    const t = await boot(ids => since(() => { plan.setWeekDay(1, ids[0]); plan.setWeekDay(4, ids[1]); plan.setWeekDay(5, ids[2]); }), '/');
    expect(screen.getByText(`Następne: jutro — ${t[1].name} · sob., 10 paź — ${t[2].name} · wt., 13 paź — ${t[0].name}`)).toBeTruthy();
    await tap(screen.getByTestId('strip-2026-10-06')); await flushAll(10);
    expect(screen.getByTestId('day-panel')).toBeTruthy(); expect(screen.getByText('wtorek, 6 października')).toBeTruthy(); expect(screen.getByText(`Opuszczony: ${t[0].name}`)).toBeTruthy();
  });
  test('A11-05: „dziś” i „tydzień deload” w etykiecie każdego dnia (kalendarz i pasek); wiersz deload w ramce koloru muted', async () => {
    const t = await boot(ids => { plan.setWeekDay(4, ids[0]); store.toggleDeloadWeek(NOW.getTime()); });
    expect(screen.getByLabelText('8 października 2026, dziś, tydzień deload')).toBeTruthy();
    expect(screen.getByLabelText(`9 października 2026, zaplanowany: ${t[0].name}, tydzień deload`)).toBeTruthy();
    expect(screen.getByLabelText('5 października 2026, tydzień deload')).toBeTruthy(); expect(screen.getByLabelText('12 października 2026')).toBeTruthy();
    const { light, dark } = require('@/lib/theme'); const row = screen.getByTestId('cal-deload-2026-10-05');
    expect([light.muted, dark.muted]).toContain(row.props.style.borderColor); expect(row.props.style.borderWidth).toBe(1); /* muted — tekst ≥ 4,5:1, więc ramka ≥ 3:1 */
    expect(screen.getByText('Wiersz w ramce — tydzień deload.')).toBeTruthy();
    await go('/'); await flushAll(10);
    expect(screen.getByLabelText(`czwartek, 8 października, dziś, odpoczynek, tydzień deload`)).toBeTruthy(); /* dzień bez treningu w planie — odpoczynek (decyzja 09.10.2026 wieczór) */
  });
  test('D4 (UX-06): „Oznacz tydzień jako deload” w panelu dnia — także przyszły tydzień; karta „Dziś · Tydzień deload”', async () => {
    await boot(ids => { plan.setWeekDay(0, ids[0]); });
    await openDay('2026-10-21'); await tap(screen.getByText('Więcej opcji')); await flushAll(5);
    await tap(screen.getByText('Oznacz tydzień jako deload')); await flushAll(5);
    expect(store.isDeloadWeek(at('2026-10-21'))).toBe(true); expect(screen.getByText('Zdejmij oznaczenie deload')).toBeTruthy();
    act(() => { store.toggleDeloadWeek(NOW.getTime()); }); await go('/'); await flushAll(10);
    expect(screen.getByText('Dziś · Tydzień deload')).toBeTruthy();
  });
  test('D4 (UX-06): podpowiedź deload ma „Nie teraz” — znika do następnego tygodnia', async () => {
    await boot(() => { for (let w = 1; w <= 5; w++) addWorkout(at('2026-10-06') - w * 7 * 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); addWorkout(at('2026-10-06'), [['Back Squat', [{ weight: 100, reps: 5 }]]]); });
    expect(screen.getByTestId('deload-hint')).toBeTruthy();
    await tap(screen.getByText('Nie teraz')); await flushAll(5); expect(screen.queryByTestId('deload-hint')).toBeNull(); expect(S().deloadSnooze).toBe('2026-10-12');
  });
});

describe('UX-13 A, MER-16 — panel dnia: 3 akcje, „Więcej opcji”, jedna lista przesunięć', () => {
  test('UX-13 A: najwyżej 3 główne akcje + „Więcej opcji”; bez osobnych „Propozycji” powielających przesunięcia', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); plan.setWeekDay(5, ids[1]); plan.setDayPlan('2026-10-08', ids[2]); });
    await openDay('2026-10-08');
    expect(panelButtons()).toEqual([`Start zaplanowanego treningu: ${t[2].name}`, 'Przesuń albo pomiń', 'Inny trening', 'Więcej opcji']);
    expect(screen.queryByText('Propozycje')).toBeNull(); expect(screen.queryByText('Przesuń plan o 1 dzień')).toBeNull();
    await tap(screen.getByText('Więcej opcji')); await flushAll(5); expect(screen.getByText('Przywróć z planu')).toBeTruthy(); expect(screen.getByText('Oznacz tydzień jako deload')).toBeTruthy();
  });
  test('UX-13 A / MER-16: lista „Przesuń albo pomiń” — oba tryby właściciela, zamiana, wolne; kolejność opisana; stopka warunkowa', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); plan.setWeekDay(5, ids[1]); });
    await openDay('2026-10-08'); await tap(screen.getByText('Przesuń albo pomiń')); await flushAll(5);
    expect(screen.getByText(/^Kolejność: najpierw zmiany, po których plan wraca do rutyny w ciągu 10 dni/)).toBeTruthy();
    await showAll();
    const titles = plan.suggest('2026-10-08').map(x => x.kind); expect(titles).toEqual(expect.arrayContaining(['shift', 'move', 'swap', 'skip']));
    expect(screen.getByLabelText('Zastosuj: Przesuń plan o 1 dzień')).toBeTruthy(); expect(screen.getByLabelText(new RegExp(`^Zastosuj: Zamień z sob\\.,? 10 paź.* \\(${t[1].name}\\)$`))).toBeTruthy();
    expect(screen.getByLabelText('Zastosuj: Wolne w tym dniu')).toBeTruthy();
    expect(screen.getByText(/Każda z tych możliwości wraca do rutyny w ciągu 10 dni\.$/)).toBeTruthy();
    await tap(screen.getByLabelText(new RegExp(`^Zastosuj: Zamień z sob`))); await flushAll(5);
    expect([plan.plannedOn('2026-10-08'), plan.plannedOn('2026-10-10')]).toEqual([t[1].id, t[0].id]);
  });
  test('UX-13 B→A: po wyborze dnia lista przewija się do panelu dnia', async () => {
    await boot(ids => { plan.setWeekDay(3, ids[0]); });
    const spy = jest.spyOn(FlatList.prototype, 'scrollToOffset');
    await openDay('2026-10-08');
    await act(async () => { fireEvent(screen.getByTestId('day-panel-wrap'), 'layout', { nativeEvent: { layout: { x: 0, y: 420, width: 320, height: 200 } } }); }); await flushAll(5);
    expect(spy).toHaveBeenCalledWith({ offset: 412, animated: true });
  });
});

describe('UX-15 A, B1–B4 — ekran Plan tygodnia', () => {
  test('UX-15 A: 7 wierszy „dzień, szablon”; wybór po tapnięciu, szablony w grupach folderów; „Inne plany” nad dniami', async () => {
    const t = await boot(ids => { S().templates.find(x => x.id === ids[2])!.folder = 'Nogi'; store.save(); plan.newPlan('Urlop'); }, '/plan');
    expect(screen.getAllByLabelText(/^(poniedziałek|wtorek|środa|czwartek|piątek|sobota|niedziela), Wolne$/)).toHaveLength(7);
    expect(screen.queryByLabelText(`poniedziałek: ${t[0].name}`)).toBeNull(); /* bez 35–70 chipów naraz */
    await tap(screen.getByLabelText('poniedziałek, Wolne')); await flushAll(5);
    expect(screen.getByText('Nogi')).toBeTruthy(); await tap(screen.getByLabelText(`poniedziałek: ${t[2].name}`)); await flushAll(5);
    expect(plan.weekPlanDays()[0]).toBe(t[2].id); expect(screen.getByLabelText(`poniedziałek, ${t[2].name}`)).toBeTruthy();
    const texts = screen.UNSAFE_root.findAll((n: any) => n.type === 'Text').map((n: any) => String(n.props.children));
    expect(texts.findIndex(x => /Inne plany/i.test(x))).toBeLessThan(texts.findIndex(x => /Dni tygodnia/i.test(x)));
  });
  test('B2 A (UX-04): „+ Nowy plan” — osobny wpis edytowany przed aktywacją; aktywny bez zmian; aktywacja z opisem zmian dni (B1)', async () => {
    const t = await boot(ids => { plan.setWeekDay(0, ids[0]); plan.setPlanName('Rutyna'); plan.setDayPlan('2026-10-09', ids[1]); }, '/plan');
    await tap(screen.getByText('+ Nowy plan')); await flushAll(10);
    expect(screen.getByText('Ten plan jeszcze nie obowiązuje. Zmień nazwę i dni, potem „Ustaw jako aktywny”.')).toBeTruthy();
    const f = screen.getByLabelText('Nazwa planu'); expect(f.props.value).toBe('Nowy plan');
    await act(async () => { fireEvent.changeText(f, 'Urlop'); }); await act(async () => { fireEvent(f, 'endEditing', { nativeEvent: { text: 'Urlop' } }); }); await flushAll(5);
    await tap(screen.getByLabelText('poniedziałek, ' + t[0].name)); await flushAll(5); await tap(screen.getByLabelText(`poniedziałek: ${t[2].name}`)); await flushAll(5);
    expect(plan.weekPlanDays()[0]).toBe(t[0].id); expect(plan.planName()).toBe('Rutyna'); expect(plan.savedPlans()[0]).toMatchObject({ name: 'Urlop', days: [t[2].id, null, null, null, null, null, null] });
    await tap(screen.getByLabelText('Ustaw jako aktywny: Urlop')); await flushAll(5);
    expect(lastAlert('Ustawić „Urlop” jako aktywny plan?')!.msg).toBe('Obecny plan zostanie w „Inne plany” razem ze zmianami pojedynczych dni od dziś (1) — wrócą, gdy znów go ustawisz.');
    await press('Ustawić „Urlop” jako aktywny plan?', 'Ustaw'); await flushAll(10);
    expect(plan.planName()).toBe('Urlop'); expect(screen.getByLabelText('Nazwa planu').props.value).toBe('Urlop');
    expect(screen.getByText('Rutyna')).toBeTruthy(); expect(screen.getByText(new RegExp(`^pon\\. ${t[0].name} · zmiany dni: 1$`))).toBeTruthy();
  });
  test('B2: zmiana nazwy w „Inne plany” (tapnięcie planu → nazwa); pusta nazwa przy wyjściu — poprzednia', async () => {
    await boot(ids => { plan.setWeekDay(0, ids[0]); plan.newPlan('Wakacje'); }, '/plan');
    await tap(screen.getByText('Wakacje')); await flushAll(10);
    const f = screen.getByLabelText('Nazwa planu'); await act(async () => { fireEvent.changeText(f, ''); }); await act(async () => { fireEvent(f, 'endEditing', { nativeEvent: { text: '' } }); }); await flushAll(5);
    expect(plan.savedPlans()[0].name).toBe('Wakacje');
    await act(async () => { fireEvent.changeText(screen.getByLabelText('Nazwa planu'), 'Ferie'); }); await act(async () => { fireEvent(screen.getByLabelText('Nazwa planu'), 'endEditing', { nativeEvent: { text: 'Ferie' } }); }); await flushAll(5);
    expect(plan.savedPlans()[0].name).toBe('Ferie');
  });
  test('B3 (DAT-03): 50 zapisanych planów — bez „+ Nowy plan”, komunikat; generator też nie dopisze 51.', async () => {
    await boot(ids => { plan.setWeekDay(0, ids[0]); for (let i = 0; i < store.SAVED_PLANS_MAX; i++) plan.newPlan('P' + i); }, '/plan');
    expect(screen.queryByText('+ Nowy plan')).toBeNull(); expect(screen.getByText('W „Inne plany” jest już 50 planów — usuń któryś, by dodać nowy.')).toBeTruthy();
    await go('/generator'); await flushAll(10); await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(5);
    expect(lastAlert('Za dużo zapisanych planów')).toBeTruthy(); expect(plan.savedPlans()).toHaveLength(50);
  });
  test('B4 (UI-05): nazwa planu zapisywana przy każdej zmianie pola — „+ Nowy plan” nie bierze starej nazwy', async () => {
    await boot(ids => { plan.setWeekDay(0, ids[0]); plan.setPlanName('Rutyna'); }, '/plan');
    await act(async () => { fireEvent.changeText(screen.getByLabelText('Nazwa planu'), 'Redukcja jesień'); }); await flushAll(5);
    expect(plan.planName()).toBe('Redukcja jesień');
    await tap(screen.getByText('+ Nowy plan')); await flushAll(10); expect(plan.planName()).toBe('Redukcja jesień'); expect(plan.savedPlans()[0].name).toBe('Nowy plan');
  });
});

describe('I1 — zgoda na powiadomienia dla przypomnienia z planu', () => {
  const g = global as any; afterEach(() => { delete g.__notifPerm; delete g.__notifPermReq; delete g.__notifPermAsked; });
  test('I1 (UX-05/X-11): pierwszy dzień w planie przy nieustalonej zgodzie — wyjaśnienie i prośba iOS; przy zgodzie — bez okna', async () => {
    const t = await boot(() => {}, '/plan');
    g.__notifPerm = { granted: false, canAskAgain: true, status: 'undetermined' }; g.__notifPermReq = { granted: true }; g.__notifPermAsked = 0;
    await tap(screen.getByLabelText('poniedziałek, Wolne')); await flushAll(5); await tap(screen.getByLabelText(`poniedziałek: ${t[0].name}`)); await flushAll(10);
    expect(lastAlert('Przypomnienie o treningu z planu')!.msg).toBe('Rano o 8:00 w dniu zaplanowanego treningu przyjdzie powiadomienie. Potrzebna jest zgoda na powiadomienia — iOS zapyta o nią po „Dalej”.');
    expect(g.__notifPermAsked).toBe(0); await press('Przypomnienie o treningu z planu', 'Dalej'); await flushAll(5); expect(g.__notifPermAsked).toBe(1);
    global.__alerts.length = 0; await tap(screen.getByLabelText('wtorek, Wolne')); await flushAll(5); await tap(screen.getByLabelText(`wtorek: ${t[0].name}`)); await flushAll(10);
    expect(lastAlert('Przypomnienie o treningu z planu')).toBeUndefined(); /* plan już był — bez ponownego pytania */
    g.__notifPerm = { granted: true }; act(() => { plan.setWeekDay(0, null); plan.setWeekDay(1, null); }); await flushAll(5);
    await tap(screen.getByLabelText('środa, Wolne')); await flushAll(5); await tap(screen.getByLabelText(`środa: ${t[0].name}`)); await flushAll(10);
    expect(lastAlert('Przypomnienie o treningu z planu')).toBeUndefined(); /* zgoda już jest */
  });
  test('I1: Ustawienia — przy odmowie stan zgody przy przełączniku i „Otwórz Ustawienia iOS”; „Sprawdź zgodę” mówi o obu rodzajach powiadomień', async () => {
    g.__notifPerm = { granted: false, canAskAgain: false, status: 'denied' };
    const open = jest.spyOn(Linking, 'openSettings').mockResolvedValue(undefined as never);
    await boot(ids => plan.setWeekDay(4, ids[0]), '/more/settings'); await flushAll(10);
    expect(screen.getByText('Brak zgody na powiadomienia — przypomnienia i koniec przerwy nie przyjdą. Zgodę włączysz w Ustawieniach iOS.')).toBeTruthy();
    await tap(screen.getByText('Otwórz Ustawienia iOS')); expect(open).toHaveBeenCalledTimes(1);
    await tap(screen.getByText('Sprawdź zgodę na powiadomienia')); await flushAll(10); await press('Brak zgody', 'Otwórz Ustawienia iOS'); expect(open).toHaveBeenCalledTimes(2);
    g.__notifPerm = { granted: true };
    await tap(screen.getByText('Sprawdź zgodę na powiadomienia')); await flushAll(10);
    expect(lastAlert('Powiadomienia działają')!.msg).toBe('Koniec przerwy i przypomnienie o treningu z planu przyjdą także przy zablokowanym ekranie.');
    expect(screen.queryByText(/^Brak zgody na powiadomienia/)).toBeNull();
  });
  test('I1: Ustawienia — zgoda jeszcze nieustalona: podpowiedź przy przełączniku', async () => {
    g.__notifPerm = { granted: false, canAskAgain: true, status: 'undetermined' };
    await boot(ids => plan.setWeekDay(4, ids[0]), '/more/settings'); await flushAll(10);
    expect(screen.getByText('Zgody na powiadomienia jeszcze nie ma — „Sprawdź zgodę na powiadomienia” poprosi o nią.')).toBeTruthy();
  });
});

describe('J1 — dane z nowszej wersji', () => {
  test('J1 (DAT-05): start na danych z wyższym schematem — ekran „zaktualizuj aplikację”, zapis nietknięty, wysłanie surowych danych', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); const st = JSON.parse(JSON.stringify(S())); st.schemaVersion = SCHEMA_VERSION + 1; const txt = JSON.stringify(st);
    await renderApp({ saved: txt }); await flushAll(10);
    expect(screen.getByTestId('newer-data')).toBeTruthy(); expect(screen.getByText('Dane z nowszej wersji aplikacji — zaktualizuj aplikację')).toBeTruthy();
    expect(screen.getByText(`Dane w telefonie zapisała nowsza wersja (schemat ${SCHEMA_VERSION + 1}); ta wersja obsługuje do ${SCHEMA_VERSION}. Niczego nie zmieniam — zainstaluj najnowszą wersję (TestFlight). Dane możesz też wysłać jako plik.`)).toBeTruthy();
    const share = require('expo-sharing').shareAsync as jest.Mock; share.mockClear();
    await tap(screen.getByText('Wyślij dane')); await flushAll(10); expect(share).toHaveBeenCalled();
    expect(global.__kv.get('state')).toBe(txt);
  });
});

describe('English', () => {
  test('EN: panel dnia, lista, Plan tygodnia', async () => {
    await boot(ids => { plan.setWeekDay(3, ids[0]); }, '/history', 'en');
    await openDay('2026-10-08'); expect(screen.getByText('Move or skip')).toBeTruthy(); expect(screen.getByText('More options')).toBeTruthy();
    await tap(screen.getByText('Move or skip')); await flushAll(5); expect(screen.getByLabelText('Apply: Move plan by 1 day')).toBeTruthy();
    await go('/plan'); await flushAll(10); expect(screen.getByText('+ New plan')).toBeTruthy(); expect(screen.getByText('Days of the week')).toBeTruthy();
  });
});

describe('macierz — podpowiedzi VoiceOver i teksty pomocnicze ekranów planu (audyt 0.10)', () => {
  const hint = (label: string) => screen.getByLabelText(label).props.accessibilityHint;
  test('panel dnia: „Zapisz trening z tego dnia” (podpowiedź), „Więcej opcji” ↔ „Mniej opcji”, lista możliwości z kolejnością i uproszczeniem', async () => {
    await boot(ids => { since(() => plan.setWeekDay(0, ids[0])); });
    await openDay('2026-10-05');
    expect(hint('Zapisz trening z tego dnia')).toBe('Trening wstecz z datą tego dnia.'); expect(hint('Więcej opcji')).toBe('Pozostałe akcje dla tego dnia.');
    expect(screen.queryByTestId('day-more')).toBeNull(); await tap(screen.getByLabelText('Więcej opcji')); await flushAll(5);
    expect(screen.getByTestId('day-more')).toBeTruthy(); expect(screen.getByText('Mniej opcji')).toBeTruthy();
    await tap(screen.getByLabelText('Więcej opcji')); await flushAll(5); expect(screen.queryByTestId('day-more')).toBeNull(); expect(screen.getByText('Więcej opcji')).toBeTruthy();
    await tap(screen.getByText('Przesuń albo pomiń')); await flushAll(5);
    expect(screen.getByText(`Kolejność: najpierw zmiany, po których plan wraca do rutyny w ciągu ${plan.RETURN_DAYS} dni, potem bez utraty treningów, bez nowych par dzień po dniu z tymi samymi partiami i z najmniejszą liczbą zmienionych dni.`)).toBeTruthy();
    const simpl = 'Uproszczenie: zwykle dzień przerwy między sesjami z tymi samymi głównymi partiami; dwa dni pod rząd przy tej samej liczbie serii w tygodniu też są w porządku (przeglądy badań, ACSM).';
    expect(screen.getByText(new RegExp('^' + simpl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeTruthy();
  });
  test('pasek tygodnia na ekranie Trening: dzień to przycisk z podpowiedzią „Otwiera ten dzień w Kalendarzu.”', async () => {
    await boot(ids => { plan.setWeekDay(3, ids[0]); }, '/');
    expect(screen.getByTestId('strip-2026-10-08').props.accessibilityHint).toBe('Otwiera ten dzień w Kalendarzu.');
  });
  test('podpowiedź deload: „Nie teraz” z podpowiedzią „Podpowiedź wróci w przyszłym tygodniu.”', async () => {
    await boot(() => { ['2026-09-14', '2026-09-21', '2026-09-28', '2026-10-06'].forEach(k => addWorkout(at(k), [['Back Squat', [{ weight: 100, reps: 5 }]]])); });
    expect(hint('Nie teraz')).toBe('Podpowiedź wróci w przyszłym tygodniu.');
  });
  test('Plan tygodnia: podpowiedzi „+ Nowy plan” i wierszy dni, „Pokaż wszystkie (n)” przy > 3 planach, nieistniejący plan, zmiany dni zapisane z planem', async () => {
    await boot(ids => { plan.setWeekDay(0, ids[0]); ['P1', 'P2', 'P3', 'P4'].forEach(n => plan.addPlan(n, [ids[1], null, null, null, null, null, null], false)); }, '/plan');
    expect(hint('+ Nowy plan')).toBe('Kopia obecnego planu w „Inne plany” — zmienisz ją przed ustawieniem jako aktywny.');
    expect(screen.getByLabelText(/^poniedziałek, /).props.accessibilityHint).toBe('Wybierz szablon na ten dzień.');
    expect(screen.queryByLabelText('Ustaw jako aktywny: P4')).toBeNull(); await tap(screen.getByText('Pokaż wszystkie (4)')); await flushAll(5); expect(screen.getByLabelText('Ustaw jako aktywny: P4')).toBeTruthy();
    await go('/plan?id=brak'); await flushAll(10); expect(screen.getByText('Nie ma takiego planu.')).toBeTruthy();
    act(() => { plan.setDayPlan('2026-10-10', S().templates[2].id); plan.activatePlan(plan.savedPlans().find(p => p.name === 'P1')!.id); });
    const prev = plan.savedPlans().find(p => p.overrides && Object.keys(p.overrides).length)!; await go(`/plan?id=${prev.id}`); await flushAll(10);
    expect(screen.getByText('Zmiany pojedynczych dni zapisane z tym planem: 1 — wrócą po aktywacji.')).toBeTruthy();
  });
});
