/*
 * Ekran generatora (decyzje właściciela 08.10.2026, docs/24): wejście z Szablonów i z Planu tygodnia; założenia (cel, miejsce, sesje, czas);
 * opis celu; podgląd (dni, ćwiczenia z seriami i przerwą, serie na partię, braki do 10, pary dzień po dniu, cardio); „Na czym to oparte”
 * (konwencje i uproszczenia nazwane); zapis z pytaniem o aktywację; EN. Logika: tests/generator.test.ts. E2E: .maestro/14.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { addLocation } from '@/lib/locations';
import { generate, sessionName, goalLabel } from '@/lib/generator';
import { applyLang, exName } from '@/lib/i18n';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

const NOW = new Date(2026, 9, 8, 9, 0);
const S = () => store.getState();
afterEach(() => { applyLang('pl'); });
const boot = async (url: string, fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
const lastAlert = (title: string) => [...global.__alerts].reverse().find(x => x.title === title);
const press = async (title: string, btn: string) => { const a = lastAlert(title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(10); };

test('wejście z Szablonów i z Planu tygodnia', async () => {
  await boot('/templates'); await tap(screen.getByText('Wygeneruj szablony i plan')); await flushAll(10);
  expect(screen.getByText(/^Propozycja według Twoich założeń/)).toBeTruthy();
  await boot('/plan'); await tap(screen.getByText('Wygeneruj szablony i plan')); await flushAll(10); expect(screen.getByText('Podgląd')).toBeTruthy();
});
test('domyślnie: masa, 3 sesje, 60 min, bez ograniczeń sprzętu; podgląd zgodny z logiką; opisy celów i „Na czym to oparte”', async () => {
  await boot('/generator');
  expect(screen.getByText('Propozycja według Twoich założeń — przejrzysz ją przed zapisem. Reguły pochodzą z przeglądów badań; części oznaczone jako konwencja albo uproszczenie nie wynikają z badań.')).toBeTruthy();
  expect(screen.getByText('Masa: co najmniej 10 serii na partię w tygodniu, 8–12 powtórzeń (w domu 12–20), zwykle 1–3 powtórzenia w zapasie.')).toBeTruthy();
  const r = generate({ goal: 'hypertrophy', locationId: null, sessions: 3, minutes: 60 });
  expect(screen.getByText(/^pon\.? FBW A · śr\.? FBW B · pt\.? FBW A$/)).toBeTruthy();
  const it = r.templates[0].items[0]; expect(screen.getByText(`${exName(store.exById(it.exerciseId))} — 3 × 8–12, przerwa 2:00`)).toBeTruthy();
  expect(screen.getByText(/^Serie na partię w tygodniu: klatka \d/)).toBeTruthy();
  expect(screen.getByText(`Poniżej 10 serii tygodniowo: ${r.below10.join(', ')}. Pomoże więcej sesji, dłuższy czas albo więcej sprzętu w miejscu.`)).toBeTruthy();
  for (const x of ['Każda partia co najmniej 2 razy w tygodniu (ACSM, przeglądy badań). Podział na sesje (FBW, góra/dół) to konwencja — przy tej samej liczbie serii daje podobne efekty.',
    'Liczba ćwiczeń z czasu sesji: (minuty − 10 min rozgrzewki) × 60 / (40 s serii + przerwa) — uproszczenie, nie wynik badań.',
    'Zakresy powtórzeń (masa 8–12, w domu 12–20; przy sile dodatkowe 6–10) to uproszczenie: mięśnie rosną przy szerokim zakresie ciężarów, gdy serie są blisko upadku (ACSM, przeglądy badań).',
    'Wysiłek: zwykle 1–3 powtórzenia w zapasie; do upadku nie trzeba.', 'Progresja: gdy zrobisz górę zakresu powtórzeń, dołóż ciężar — konwencja.']) expect(screen.getByText(`• ${x}`)).toBeTruthy();
  const liczba = 'Liczba ćwiczeń z czasu sesji: (minuty − {w} min rozgrzewki) × 60 / ({s} s serii + przerwa) — uproszczenie, nie wynik badań.'; expect(liczba).toContain('{w}'); /* tekst z t() — macierz */
  await tap(screen.getByText('Siła')); await flushAll(5);
  expect(screen.getByText('Siła: bój główny na początku, 3 serie po 4–6 powtórzeń (ciężko, ok. 80% maksimum i więcej), pozostałe ćwiczenia 6–10.')).toBeTruthy();
  expect(screen.getAllByText(/ — 3 × 4–6, przerwa 3:00$/).length).toBe(2); /* bój główny w FBW A i B */ expect(screen.queryByText(/^Poniżej 10 serii/)).toBeNull();
});
test('redukcja: sesje 3–6 (w tym 1 cardio), cardio w podglądzie i licznik minut; 2 sesje przeskakują na 3', async () => {
  await boot('/generator'); await tap(screen.getByLabelText('Sesje w tygodniu: 2')); await flushAll(5);
  await tap(screen.getByText('Redukcja')); await flushAll(5);
  expect(screen.getByText('Redukcja: trening jak na masę (chroni mięśnie) i jedna sesja umiarkowanego cardio.')).toBeTruthy();
  expect(screen.getByText('Sesje w tygodniu (w tym 1 cardio)')).toBeTruthy(); expect(screen.queryByLabelText('Sesje w tygodniu: 2')).toBeNull();
  expect(screen.getByLabelText('Sesje w tygodniu: 3').props.accessibilityState?.selected).toBe(true);
  await tap(screen.getByText('45 min')); await flushAll(5);
  expect(screen.getByTestId('gen-cardio')).toBeTruthy(); expect(screen.getByText(/ — 45 min, umiarkowane tempo$/)).toBeTruthy();
  expect(screen.getByText('Cardio w planie: 45 min tygodniowo. Ruch w ciągu dnia też się liczy — razem zwykle 150–300 min tygodniowo (WHO, ACSM).')).toBeTruthy();
});
test('5 sesji — ostrzeżenie o parach dzień po dniu; miejsce z listy miejsc; brak ćwiczeń — komunikat', async () => {
  await boot('/generator', () => { addLocation('bodyweight', 'Dom'); });
  await tap(screen.getByLabelText('Sesje w tygodniu: 5')); await flushAll(5);
  expect(screen.getByText(/^Dzień po dniu te same główne partie: .+\. Zwykle lepiej z dniem przerwy; przy tej samej liczbie serii w tygodniu to też jest w porządku\.$/)).toBeTruthy();
  await tap(screen.getByText('Dom')); await flushAll(5); expect(screen.getAllByText(/ — 3 × 12–20, przerwa /).length).toBeGreaterThan(0);
  await tap(screen.getByText('Bez ograniczeń sprzętu')); await flushAll(5); expect(screen.queryByText(/ — 3 × 12–20, /)).toBeNull();
  act(() => { S().exercises.forEach(e => { e.archived = true; }); }); await tap(screen.getByText('90 min')); await flushAll(5); /* wszystkie ćwiczenia usunięte (w pamięci — migracja usuwa nieużywane zarchiwizowane) */
  expect(screen.getAllByText('Brak ćwiczeń dostępnych w tym miejscu.').length).toBeGreaterThan(0);
});
test('zapis: pytanie o aktywację; „Tylko zapisz” — szablony w „Wygenerowane”, plan w „Inne plany”; „Ustaw jako aktywny” — aktywny; „Anuluj” nic', async () => {
  await boot('/generator');
  await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(5);
  expect(lastAlert('Ustawić nowy plan jako aktywny?')!.msg).toBe('Szablony trafią do folderu „Wygenerowane”. Obecny plan zostanie w „Inne plany” — wrócisz do niego jednym przyciskiem.');
  await press('Ustawić nowy plan jako aktywny?', 'Anuluj'); expect(S().templates).toHaveLength(0);
  await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Tylko zapisz');
  expect(S().templates.map(x => [x.name, x.folder])).toEqual([['FBW A', 'Wygenerowane'], ['FBW B', 'Wygenerowane']]);
  expect(plan.savedPlans().map(p => p.name)).toEqual(['Masa, 3× w tygodniu']); expect(screen.getByText('Inne plany')).toBeTruthy();
  await boot('/generator'); await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Ustaw jako aktywny');
  expect(plan.planName()).toBe('Masa, 3× w tygodniu'); expect(plan.hasPlan()).toBe(true);
});
test('English', async () => {
  await boot('/generator', () => {}, 'en');
  expect(screen.getByText('Muscle')).toBeTruthy(); expect(screen.getByText('Preview')).toBeTruthy(); expect(screen.getByText('What this is based on')).toBeTruthy();
  expect(screen.getByText(/^Mon\.? Full Body A · Wed\.? Full Body B · Fri\.? Full Body A$/)).toBeTruthy();
  expect(screen.getByText('Save templates and plan')).toBeTruthy(); expect(screen.getByText('No equipment limits')).toBeTruthy();
});
test('etykiety pól, tytuł ekranu, nazwy sesji i celów; 4 sesje — góra/dół w podglądzie', async () => {
  await boot('/generator');
  expect(screen.getAllByText('Cel').length).toBeGreaterThan(0); expect(screen.getAllByText('Czas sesji').length).toBeGreaterThan(0);
  const { store: rs } = require('expo-router/build/global-state/router-store'); /* nagłówek natywnego stosu nie renderuje się w Jest — tytuł z opcji ekranu */
  expect(rs.navigationRef.getCurrentOptions()?.title).toBe('Generator planu');
  await tap(screen.getByLabelText('Sesje w tygodniu: 4')); await flushAll(5);
  for (const n of ['Góra A', 'Dół A', 'Góra B', 'Dół B']) expect(screen.getAllByText(n).length).toBeGreaterThan(0);
  const pairs = 'Dzień po dniu te same główne partie: {list}. Zwykle lepiej z dniem przerwy; przy tej samej liczbie serii w tygodniu to też jest w porządku.';
  expect(screen.getByText(new RegExp('^' + pairs.split('{list}')[0]))).toBeTruthy(); /* 4 sesje: np. Góra B i Dół B dzień po dniu — wspólne plecy (wiosłowanie, martwy ciąg) */
  expect([sessionName('fbwA'), sessionName('cardio'), goalLabel('strength'), goalLabel('hypertrophy'), goalLabel('cut')]).toEqual(['FBW A', 'Cardio', 'Siła', 'Masa', 'Redukcja']);
});
