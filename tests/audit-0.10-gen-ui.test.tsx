/*
 * Audyt 0.10.0 (08.10.2026, docs/25 grupa C, B1 — część generatora, LOG-08, UX-14): testy regresji ekranów — generator, potwierdzenia,
 * Plan tygodnia (wspólny tekst aktywacji), edytor szablonu (notatka), Miejsca (opisy presetów z danych). Każdy test odtwarza znalezisko
 * (zz-audit-ui-e, zz-audit-ux-a/b, zz-audit-mer-gen2) i sprawdza zachowanie po naprawie (rekomendacje A). Logika: tests/audit-0.10-gen.test.ts.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { addLocation } from '@/lib/locations';
import { generate, saveGenerated, type GenInput } from '@/lib/generator';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, withDemoTemplates, addWorkout } from './helpers';
import { renderApp, flushAll, screen, tap, type, act, go, startEdit, saveEdit } from './app';

jest.setTimeout(120000);
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek */
const S = () => store.getState();
afterEach(() => { applyLang('pl'); });
const boot = async (url: string, fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
const lastAlert = (title: string) => [...global.__alerts].reverse().find(x => x.title === title);
const press = async (title: string, btn: string) => { const a = lastAlert(title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(10); };
const saveBtn = async () => { await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(5); };
const inp = (o: Partial<GenInput> = {}): GenInput => ({ goal: 'hypertrophy', locationId: null, sessions: 3, minutes: 60, ...o });

describe('C1 / MER-01: „Siła” w miejscu bez obciążenia', () => {
  test('masa ciała: zamiast „ok. 80% maksimum” widoczne ostrzeżenie; 3 × 12–20; Dead Bug z przerwą 1:30, nie 2:00', async () => {
    await boot('/generator', () => { addLocation('bodyweight', 'Dom'); });
    await tap(screen.getByText('Siła')); await flushAll(5);
    expect(screen.getByText('Siła bez obciążenia zewnętrznego (sztanga, hantle, kettlebell, maszyny, wyciągi): ciężkich serii (ok. 80% maksimum) tu nie zrobisz, więc plan jest jak na masę w domu — 3 × 12–20 powtórzeń blisko upadku. Siła też wtedy rośnie, ale zwykle mniej niż przy dużym ciężarze.')).toBeTruthy();
    expect(screen.queryByText(/ciężko, ok\. 80% maksimum i więcej/)).toBeNull(); expect(screen.queryByText(/ — 3 × 4–\u20606, /)).toBeNull();
    expect(screen.getAllByText(/ — 3 × 12–\u206020, przerwa /).length).toBeGreaterThan(0); expect(screen.getByText('Dead Bug — 3 × 12–\u206020, przerwa 1:30')).toBeTruthy();
    /* pełna siłownia: zwykły opis siły, bój główny 3 × 4–6 */
    await tap(screen.getByText('Bez ograniczeń sprzętu')); await flushAll(5);
    expect(screen.getByText(/^Siła: bój główny na początku, 3 × 4–6 powtórzeń \(ciężko, ok\. 80% maksimum i więcej\)/)).toBeTruthy(); expect(screen.queryByText(/^Siła bez obciążenia/)).toBeNull();
  });
});

describe('C2 / MER-02 / LOG-03: braki partii i dni w tygodniu — dla każdego celu', () => {
  test('masa ciała, siła: „Brak ćwiczeń na: plecy, biceps…” z podpowiedzią sprzętu; siłownia, siła: „Rzadziej niż 2 dni” (biceps 1,5)', async () => {
    await boot('/generator', () => { addLocation('bodyweight', 'Dom'); });
    await tap(screen.getByText('Siła')); await flushAll(5);
    expect(screen.getByText(/^Brak ćwiczeń na: plecy, biceps(, \S+)*\. Przyda się: drążek(, \S+)*\.$/)).toBeTruthy(); /* podpowiedź z danych: sprzęt, który da ćwiczenia na brakujące partie */
    await tap(screen.getByText('Bez ograniczeń sprzętu')); await flushAll(5);
    expect(screen.queryByText(/^Brak ćwiczeń na:/)).toBeNull(); expect(screen.getByText(/^Rzadziej niż 2 dni w tygodniu: .*biceps \(1,5\).* \(dzień tylko z pracą pomocniczą = 0,5\)\.$/)).toBeTruthy();
    expect(screen.queryByText(/^Poniżej 10 serii/)).toBeNull(); /* kreska serii (R2) tylko przy masie i redukcji */
    await tap(screen.getByText('Masa')); await flushAll(5); expect(screen.getByText(/^Poniżej 10 serii tygodniowo: /)).toBeTruthy();
  });
});

describe('C4 / MER-06, MER-07, MER-08, MER-12, MER-17: „Na czym to oparte” i podgląd', () => {
  test('każdy parametr podglądu ma punkt ze źródłem albo oznaczeniem; liczby ze stałych', async () => {
    await boot('/generator');
    for (const x of [
      'Każda główna partia co najmniej 2 dni w tygodniu (WHO 2020 — zalecenie dla zdrowia; ACSM 2026: siła rośnie przy co najmniej 2 sesjach tygodniowo). Dzień, w którym partia pracuje tylko pomocniczo, liczy się jako 0,5 — uproszczenie (jedno źródło). Podział na sesje (FBW, góra/dół) to konwencja — przy tej samej liczbie serii daje podobne efekty.',
      'Serie: 3 na ćwiczenie — ACSM 2026 zaleca co najmniej 2; więcej serii zwykle daje trochę więcej, z malejącym zyskiem. Liczba 3 to uproszczenie.',
      'Liczba serii z czasu sesji: (minuty − 10 min rozgrzewki) × 60 / (40 s serii + średnia przerwa 105 s) = 20; ćwiczeń = serie / 3 (co najmniej 3) — uproszczenie, nie wynik badań.',
      'Zakresy powtórzeń (masa 8–12, w domu i bez obciążenia 12–20; przy sile dodatkowe 6–10) to uproszczenie: mięśnie rosną przy szerokim zakresie ciężarów, gdy serie są blisko upadku (ACSM, przeglądy badań).',
      'Wysiłek: zwykle 0–3 powtórzenia w zapasie (ACSM 2026: blisko upadku albo 2–3; dokładnej liczby nie ustalono); do upadku nie trzeba.',
      'Przerwy: 3 min po ciężkich seriach boju głównego, 2 min po innych wielostawowych, 1,5 min po jednostawowych i core — uproszczenie; przeglądy są niejednoznaczne (ACSM 2026: długość przerwy nie zmieniała przyrostu siły).',
      'Progresja: gdy zrobisz górę zakresu powtórzeń, dołóż ciężar — konwencja.',
    ]) expect(screen.getByText(`• ${x}`)).toBeTruthy();
    const head = 'Serie na partię w tygodniu (pomocnicza = 0,5 serii — uproszczenie, jedno źródło): klatka '; /* MER-17 */
    expect(screen.getAllByText(/^Serie na partię w tygodniu/).map(n => String(n.props.children)).filter(x => x.startsWith(head))).toHaveLength(1);
    expect(screen.queryByText(/^• Cardio:/)).toBeNull();
    await tap(screen.getByText('Siła')); await flushAll(5); expect(screen.getByText(/średnia przerwa 150 s\) = 15;/)).toBeTruthy(); /* przerwa średnia siły */
    await tap(screen.getByText('Redukcja')); await flushAll(5);
    expect(screen.getByText('• Cardio: jedna sesja umiarkowanego wysiłku w osobny dzień; jej długość = czas sesji — konwencja.')).toBeTruthy();
    expect(screen.getByText(/^Cardio w planie: 60 min tygodniowo\. Zalecenie WHO: co najmniej 150–300 min umiarkowanego wysiłku tygodniowo \(albo 75–150 min intensywnego\)/)).toBeTruthy();
  });
});

describe('C3 / UX-10: miejsce, ponowne generowanie, potwierdzenie, notatka', () => {
  test('świeża instalacja: „+ Dodaj miejsce” z wyjaśnieniem pełnej siłowni; chip prowadzi do Miejsc', async () => {
    await boot('/generator');
    expect(screen.getByText('Nie masz jeszcze miejsc treningu, więc plan zakłada pełną siłownię (sztanga, hantle, maszyny i wyciągi). Trenujesz w domu albo w hotelu? Stuknij „+ Dodaj miejsce” i zaznacz sprzęt — generator dobierze ćwiczenia.')).toBeTruthy();
    expect(screen.getByLabelText('Bez ograniczeń sprzętu').props.accessibilityState.selected).toBe(true);
    await tap(screen.getByText('+ Dodaj miejsce')); await flushAll(10);
    expect(screen.getByText(/^Gdzie trenujesz i jaki sprzęt tam masz\./)).toBeTruthy();
  });
  test('z miejscami: „Bez ograniczeń sprzętu” = pełna siłownia; nowe miejsce dodane w Miejscach pojawia się w generatorze', async () => {
    await boot('/generator', () => { addLocation('hotel', 'Hotel'); });
    expect(screen.queryByText(/^„Bez ograniczeń sprzętu”/)).toBeNull(); /* wybrane miejsce główne */
    await tap(screen.getByText('Bez ograniczeń sprzętu')); await flushAll(5);
    expect(screen.getByText('„Bez ograniczeń sprzętu” = pełna siłownia (sztanga, hantle, maszyny i wyciągi).')).toBeTruthy();
    await act(async () => { addLocation('bodyweight', 'Plener'); }); await flushAll(5); expect(screen.getByText('Plener')).toBeTruthy();
  });
  test('ponowne generowanie: pytanie o zastąpienie nieużywanych → „Zastąp” bez „(2)”; „Zostaw” — nowe obok; potwierdzenie z linkiem do folderu', async () => {
    await boot('/generator'); await saveBtn(); await press('Ustawić nowy plan jako aktywny?', 'Tylko zapisz');
    expect(lastAlert('Zapisano')!.msg).toBe('Szablony: FBW A, FBW B — w folderze „Wygenerowane” na liście Szablony.\nPlan „Masa, 3× w tygodniu · Pełna siłownia” jest w „Inne plany”.');
    expect(lastAlert('Zapisano')!.buttons!.map(b => b.text)).toEqual(['Pokaż szablony', 'Plan tygodnia']);
    await press('Zapisano', 'Pokaż szablony'); expect(screen.getByText('Wygenerowane')).toBeTruthy(); expect(screen.getByText('FBW A')).toBeTruthy();
    await go('/generator'); await flushAll(10); await saveBtn();
    expect(lastAlert('Zastąpić poprzednio wygenerowane, nieużywane szablony?')!.msg).toBe('Bez treningów i poza aktywnym planem: FBW A, FBW B, Masa, 3× w tygodniu · Pełna siłownia. „Zastąp” je usunie, „Zostaw” doda nowe obok.');
    await press('Zastąpić poprzednio wygenerowane, nieużywane szablony?', 'Zastąp'); await press('Ustawić nowy plan jako aktywny?', 'Tylko zapisz');
    expect(S().templates.map(x => x.name)).toEqual(['FBW A', 'FBW B']); expect(plan.savedPlans()).toHaveLength(1);
    await press('Zapisano', 'Plan tygodnia'); expect(screen.getByText('Inne plany')).toBeTruthy();
    await go('/generator'); await flushAll(10); await saveBtn(); await press('Zastąpić poprzednio wygenerowane, nieużywane szablony?', 'Zostaw'); await press('Ustawić nowy plan jako aktywny?', 'Tylko zapisz');
    expect(S().templates.map(x => x.name)).toEqual(['FBW A', 'FBW B', 'FBW A (2)', 'FBW B (2)']); expect(lastAlert('Zapisano')!.msg).toMatch(/^Szablony: FBW A \(2\), FBW B \(2\) — /);
  });
  test('szablon użyty w treningu nie jest proponowany; plan z nim zostaje i trzyma drugi szablon; bez planu — tylko nieużyty', async () => {
    await boot('/generator', () => { const r = saveGenerated(generate(inp()), inp(), false); addWorkout(NOW.getTime() - 864e5, [['Back Squat', [{ weight: 100, reps: 5 }]]]).templateId = r.templateIds[0]; });
    await saveBtn(); expect(lastAlert('Zastąpić poprzednio wygenerowane, nieużywane szablony?')).toBeUndefined(); expect(lastAlert('Ustawić nowy plan jako aktywny?')).toBeTruthy();
    await press('Ustawić nowy plan jako aktywny?', 'Anuluj'); await act(async () => { plan.deletePlan(plan.savedPlans()[0].id); }); await saveBtn();
    expect(lastAlert('Zastąpić poprzednio wygenerowane, nieużywane szablony?')!.msg).toBe('Bez treningów i poza aktywnym planem: FBW B. „Zastąp” je usunie, „Zostaw” doda nowe obok.');
  });
  test('notatka wysiłku w szablonie: widoczna i edytowalna w edytorze; pusta usuwa notatkę', async () => {
    let id = '';
    await boot('/templates', () => { id = saveGenerated(generate(inp()), inp(), false).templateIds[0]; });
    await go(`/template/${id}`); await flushAll(10);
    expect(screen.getByLabelText('Notatka: Wysiłek: zwykle 0–3 powtórzenia w zapasie (RIR); do upadku nie trzeba.')).toBeTruthy(); /* podgląd: notatka widoczna */
    await startEdit(); /* edycja na żądanie (decyzja właściciela 08.10.2026): „Edytuj” → szkic → „Zapisz” */
    const f = screen.getByLabelText('Notatka'); expect(f.props.value).toBe('Wysiłek: zwykle 0–3 powtórzenia w zapasie (RIR); do upadku nie trzeba.');
    await type(f, '  RIR 2,  technika  '); await saveEdit();
    expect(S().templates.find(x => x.id === id)!.note).toBe('RIR 2, technika');
    await startEdit(); await type(screen.getByLabelText('Notatka'), '   '); await saveEdit();
    expect(S().templates.find(x => x.id === id)!.note).toBeUndefined();
  });
  test('English: nazwy przy tworzeniu w bieżącym języku, chip „+ Add place”, ostrzeżenia po angielsku', async () => {
    await boot('/generator', () => {}, 'en');
    expect(screen.getByText('+ Add place')).toBeTruthy(); expect(screen.getByText(/^You have no training places yet/)).toBeTruthy();
    await tap(screen.getByText('Save templates and plan')); await flushAll(5); await press('Make the new plan active?', 'Save only');
    expect(S().templates.map(x => [x.name, x.folder, x.note])).toEqual([['Full Body A', 'Generated', 'Effort: usually 0–3 reps in reserve (RIR); training to failure is not needed.'], ['Full Body B', 'Generated', 'Effort: usually 0–3 reps in reserve (RIR); training to failure is not needed.']]);
    expect(lastAlert('Saved')!.msg).toBe('Templates: Full Body A, Full Body B — in the “Generated” folder on the Templates list.\nThe plan “Muscle, 3× per week · Full gym” is under “Other plans”.');
  });
});

describe('B1 / UI-02 / X-07 / DAT-02 / LOG-05: aktywacja z generatora mówi to samo co ekran Plan', () => {
  test('zmiany dni od dziś: liczba w oknie; po aktywacji zapisane z poprzednim planem (tak jak zapowiedziano)', async () => {
    await boot('/generator', () => { const t = withDemoTemplates(); plan.setWeekDay(0, t[0].id); plan.setWeekDay(2, t[1].id); plan.setDayPlan('2026-10-11', t[2].id); plan.setDayPlan('2026-10-12', null); }); /* nd. inny trening, pon. wolne */
    expect(plan.futureChanges()).toBe(2); await saveBtn();
    const a = lastAlert('Ustawić nowy plan jako aktywny?')!;
    expect(a.msg).toBe('Szablony trafią do folderu „Wygenerowane”, a plan — do „Inne plany” albo od razu jako aktywny.\n\nObecny plan zostanie w „Inne plany” razem ze zmianami pojedynczych dni od dziś (2) — wrócą, gdy znów go ustawisz.');
    expect(a.buttons!.find(b => b.text === 'Ustaw jako aktywny')!.style).toBeUndefined(); /* nic nie ginie */
    await press('Ustawić nowy plan jako aktywny?', 'Ustaw jako aktywny'); expect(plan.futureChanges()).toBe(0); expect(plan.savedPlans()).toHaveLength(1); expect(Object.keys(plan.savedPlans()[0].overrides ?? {})).toHaveLength(2);
    expect(lastAlert('Zapisano')!.msg).toBe('Szablony: FBW A, FBW B — w folderze „Wygenerowane” na liście Szablony.\nPlan „Masa, 3× w tygodniu · Pełna siłownia” jest teraz aktywny.');
  });
  test('pusty plan bez nazwy, tylko ze zmianami dni: zapisany razem z nimi (ekran Plan mówi to samo)', async () => {
    await boot('/plan', () => { const t = withDemoTemplates(); plan.addPlan('Wakacje', [t[0].id, null, null, null, null, null, null], false); plan.setDayPlan('2026-10-12', t[1].id); });
    await tap(screen.getByLabelText('Ustaw jako aktywny: Wakacje')); await flushAll(5);
    expect(lastAlert('Ustawić „Wakacje” jako aktywny plan?')!.msg).toBe('Obecny plan zostanie w „Inne plany” razem ze zmianami pojedynczych dni od dziś (1) — wrócą, gdy znów go ustawisz.');
    expect(lastAlert('Ustawić „Wakacje” jako aktywny plan?')!.buttons!.find(b => b.text === 'Ustaw')!.style).toBeUndefined(); /* UI-02: jak w generatorze */
    await press('Ustawić „Wakacje” jako aktywny plan?', 'Ustaw'); expect(plan.savedPlans()).toHaveLength(1); expect(Object.keys(plan.savedPlans()[0].overrides ?? {})).toEqual(['2026-10-12']); /* zmiana dnia nie zginęła */
  });
});

describe('LOG-08: opisy presetów miejsc w jednostce aplikacji', () => {
  test('lb: „sztanga 45 lb + talerze 45…2,5 lb; hantle 5–100 lb co 5”, hotel 5–50 lb', async () => {
    await boot('/more/locations', () => { S().settings.unit = 'lb'; store.applyPrefs(); store.save(); });
    await tap(screen.getByText('+ Dodaj miejsce')); await flushAll(5);
    expect(screen.getByLabelText('Pełna siłownia, cały sprzęt; sztanga 45 lb + talerze 45…2,5 lb; hantle 5–100 lb co 5')).toBeTruthy();
    expect(screen.getByLabelText('Hotel, hantle 5–50 lb, ławka regulowana, mata, ściana, bieżnia, rower')).toBeTruthy();
    await tap(screen.getByLabelText(/^Pełna siłownia, /)); await flushAll(10);
    const gym = S().settings.locations[0]; expect(gym.equipment.find(e => e.item === 'barbell')!.load).toMatchObject({ unit: 'lb', base: 45 }); /* opis = to, co preset utworzył */
  });
});
