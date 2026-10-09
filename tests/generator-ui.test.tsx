/*
 * Ekran generatora (decyzje właściciela 08.10.2026, docs/24): wejście z Szablonów i z Planu tygodnia; założenia (cel, miejsce, sesje, czas);
 * opis celu; podgląd (dni, ćwiczenia z seriami i przerwą, serie na partię, braki do 10, pary dzień po dniu, cardio); „Na czym to oparte”
 * (konwencje i uproszczenia nazwane); zapis z pytaniem o aktywację; EN. Logika: tests/generator.test.ts. E2E: .maestro/14.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { addLocation } from '@/lib/locations';
import { generate, genProposal, sessionName, goalLabel, type GenInput } from '@/lib/generator';
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
/** Wybór dni (09.10.2026 B): zaznaczone przyciski dni i ustawienie dokładnie `ds` (stuknięcia w różnicę). */
const checkedDays = () => [0, 1, 2, 3, 4, 5, 6].filter(d => screen.getByTestId(`day-${d}`).props.accessibilityState.checked);
const pickDays = async (ds: number[]) => { const cur = checkedDays(); for (let d = 0; d < 7; d++) if (cur.includes(d) !== ds.includes(d)) await tap(screen.getByTestId(`day-${d}`)); await flushAll(5); };
/** Dni propozycji generatora dla n sesji (to, co dawniej dawał chip „Sesje w tygodniu: n”). */
const daysFor = (n: number, o: Partial<GenInput> = {}) => genProposal({ goal: 'hypertrophy', locationId: null, sessions: n, minutes: 60, ...o });
const press = async (title: string, btn: string) => { const a = lastAlert(title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(10); };

test('wejście z Szablonów i z Planu tygodnia', async () => {
  await boot('/templates'); await tap(screen.getByText('Wygeneruj szablony i plan')); await flushAll(10);
  expect(screen.getByText(/^Propozycja według Twoich założeń/)).toBeTruthy();
  await boot('/plan'); await tap(screen.getByText('Wygeneruj szablony i plan')); await flushAll(10); expect(screen.getByText('Podgląd')).toBeTruthy();
});
test('domyślnie: masa, 3 sesje, 60 min, bez ograniczeń sprzętu; podgląd zgodny z logiką; opisy celów i „Na czym to oparte”', async () => {
  await boot('/generator');
  expect(screen.getByText('Propozycja według Twoich założeń — przejrzysz ją przed zapisem. Reguły pochodzą z przeglądów badań; części oznaczone jako konwencja albo uproszczenie nie wynikają z badań.')).toBeTruthy();
  expect(screen.getByText('Masa: co najmniej 10 serii na partię w tygodniu, 8–12 powtórzeń (w domu 12–20), zwykle 0–3 powtórzenia w zapasie.')).toBeTruthy(); /* audyt 0.10 MER-06: 0–3 (ACSM 2026: blisko upadku albo 2–3) */
  const r = generate({ goal: 'hypertrophy', locationId: null, sessions: 3, minutes: 60 });
  expect(screen.getByText(/^pon\.? FBW A · śr\.? FBW B · pt\.? FBW A$/)).toBeTruthy();
  const it = r.templates[0].items[0]; expect(screen.getByText(`${exName(store.exById(it.exerciseId))} — 3 × 8–\u206012, przerwa 2:00`)).toBeTruthy();
  expect(screen.getByText(/^Serie na partię w tygodniu \(pomocnicza = 0,5 serii — uproszczenie, jedno źródło\): klatka \d/)).toBeTruthy(); /* MER-17 */
  expect(screen.getByText(`Poniżej 10 serii tygodniowo: ${r.below10.join(', ')}. Pomoże więcej sesji, dłuższy czas albo więcej sprzętu w miejscu.`)).toBeTruthy();
  /* audyt 0.10 (C2 atrybucja, C4 MER-06/07/12): wszystkie punkty „Na czym to oparte” — pełne brzmienie w tests/audit-0.10-gen-ui.test.tsx */
  for (const x of [/^• Każda główna partia co najmniej 2 dni w tygodniu \(WHO 2020/, /^• Serie: 3 na ćwiczenie/, /^• Liczba serii z czasu sesji: \(minuty − 10 min rozgrzewki\) × 60 \/ \(40 s serii \+ średnia przerwa 105 s\) = 20;/,
    /^• Zakresy powtórzeń \(masa 8–12, w domu i bez obciążenia 12–20; przy sile dodatkowe 6–10\)/, /^• Wysiłek: zwykle 0–3 powtórzenia w zapasie/, /^• Przerwy: 3 min/, /^• Progresja: gdy zrobisz górę zakresu powtórzeń, dołóż ciężar — konwencja\.$/]) expect(screen.getByText(x)).toBeTruthy();
  await tap(screen.getByText('Siła')); await flushAll(5);
  expect(screen.getByText('Siła: bój główny na początku, 3 × 4–6 powtórzeń (ciężko, ok. 80% maksimum i więcej), pozostałe ćwiczenia 3 × 6–10.')).toBeTruthy(); /* LOG-11: liczby ze stałych */
  expect(screen.getAllByText(/ — 3 × 4–\u20606, przerwa 3:00$/).length).toBe(2); /* bój główny w FBW A i B */ expect(screen.queryByText(/^Poniżej 10 serii/)).toBeNull();
});
test('redukcja: dni 3–6 (w tym 1 cardio), cardio w podglądzie i licznik minut; 2 dni → propozycja na 3', async () => {
  await boot('/generator'); await pickDays(daysFor(2)); expect(checkedDays()).toEqual([0, 3]);
  await tap(screen.getByText('Redukcja')); await flushAll(5);
  expect(screen.getByText('Redukcja: trening jak na masę (chroni mięśnie) i jedna sesja umiarkowanego cardio.')).toBeTruthy();
  expect(screen.getByText('Dni treningowe w tygodniu (w tym 1 cardio)')).toBeTruthy(); /* LOG-11: {n} = CARDIO_SESSIONS */
  expect(checkedDays()).toEqual(daysFor(3, { goal: 'cut' })); /* wybór dni (09.10.2026 B): liczba spoza zakresu celu — propozycja dla najbliższej dozwolonej */
  await tap(screen.getByText('45 min')); await flushAll(5);
  expect(screen.getByTestId('gen-cardio')).toBeTruthy(); expect(screen.getByText(/ — 45 min, umiarkowane tempo$/)).toBeTruthy();
  expect(screen.getByText('Cardio w planie: 45 min tygodniowo. Zalecenie WHO: co najmniej 150–300 min umiarkowanego wysiłku tygodniowo (albo 75–150 min intensywnego); liczy się też umiarkowany ruch w ciągu dnia, np. szybki marsz, nawet krótki.')).toBeTruthy(); /* MER-08 */
});
test('5 sesji — ostrzeżenie o parach dzień po dniu; miejsce z listy miejsc; brak ćwiczeń — komunikat', async () => {
  await boot('/generator', () => { addLocation('bodyweight', 'Dom'); });
  await pickDays(daysFor(5, { locationId: S().settings.mainLocationId ?? null }));
  const pairs = /^Dzień po dniu te same główne partie: .+\. Zwykle lepiej z dniem przerwy; przy tej samej liczbie serii w tygodniu to też jest w porządku\.$/;
  expect(screen.getAllByText(/ — 3 × 12–\u206020, przerwa /).length).toBeGreaterThan(0); /* miejsce główne „Dom” (masa ciała) wybrane na starcie */
  expect(screen.queryByText(pairs)).toBeNull(); /* audyt 0.10 LOG-10: w domu układ dni bez par (dawniej pokazywał parę, której dało się uniknąć) */
  await tap(screen.getByText('Bez ograniczeń sprzętu')); await flushAll(5); expect(screen.queryByText(/ — 3 × 12–\u206020, /)).toBeNull();
  expect(screen.queryByText(pairs)).toBeNull(); /* research partii (docs/research/24 5.3, 09.10.2026): pełna siłownia, 5 sesji — 0 par */
  /* partie zmienione przez użytkownika (wyciskania z czworogłowymi jako główną) — górne i dolne dni dzielą partię, para nie do uniknięcia: ostrzeżenie, nie blokada */
  act(() => { for (const n of ['Bench Press (sztanga)', 'Bench Press (hantle)']) S().exercises.find(e => e.name === n)!.muscles = ['klatka', 'czworogłowe']; });
  await tap(screen.getByText('45 min')); await flushAll(5); expect(screen.getByText(pairs)).toBeTruthy();
  await tap(screen.getByText('Dom')); await flushAll(5); expect(screen.getAllByText(/ — 3 × 12–\u206020, przerwa /).length).toBeGreaterThan(0);
  await tap(screen.getByText('Bez ograniczeń sprzętu')); await flushAll(5);
  act(() => { S().exercises.forEach(e => { e.archived = true; }); }); await tap(screen.getByText('90 min')); await flushAll(5); /* wszystkie ćwiczenia usunięte (w pamięci — migracja usuwa nieużywane zarchiwizowane) */
  expect(screen.getAllByText('Brak ćwiczeń dostępnych w tym miejscu.').length).toBeGreaterThan(0);
  expect(screen.queryByText('Zapisz szablony i plan')).toBeNull(); /* audyt 0.10 X-10: nic do zapisania — bez przycisku (puste szablony nie trafiają do planu) */
});
test('zapis: pytanie o aktywację; „Tylko zapisz” — szablony w „Wygenerowane”, plan w „Inne plany”; „Ustaw jako aktywny” — aktywny; „Anuluj” nic', async () => {
  await boot('/generator');
  await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(5);
  /* audyt 0.10 B1: bez planu i bez zmian dni — bez obietnicy „Obecny plan zostanie…” (pusty plan nie jest zapisywany) */
  expect(lastAlert('Ustawić nowy plan jako aktywny?')!.msg).toBe('Szablony trafią do folderu „Wygenerowane”, a plan — do „Inne plany” albo od razu jako aktywny.');
  await press('Ustawić nowy plan jako aktywny?', 'Anuluj'); expect(S().templates).toHaveLength(0);
  await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Tylko zapisz');
  expect(S().templates.map(x => [x.name, x.folder])).toEqual([['FBW A', 'Wygenerowane'], ['FBW B', 'Wygenerowane']]);
  expect(plan.savedPlans().map(p => p.name)).toEqual(['Masa, 3× w tygodniu · Pełna siłownia']); /* UX-10: nazwa z miejscem */
  await press('Zapisano', 'Plan tygodnia'); expect(screen.getByText('Inne plany')).toBeTruthy(); /* UX-10: potwierdzenie zapisu, potem Plan tygodnia */
  await boot('/generator'); await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Ustaw jako aktywny');
  expect(plan.planName()).toBe('Masa, 3× w tygodniu · Pełna siłownia'); expect(plan.hasPlan()).toBe(true);
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
  expect(rs.navigationRef.getCurrentOptions()?.title).toBe('Generator szablonów i planu'); /* audyt 0.10 UX-14: jedna nazwa (przewodnik, przycisk) */
  await pickDays(daysFor(4));
  for (const n of ['Góra A', 'Dół A', 'Góra B', 'Dół B']) expect(screen.getAllByText(n).length).toBeGreaterThan(0);
  const pairs = 'Dzień po dniu te same główne partie: {list}. Zwykle lepiej z dniem przerwy; przy tej samej liczbie serii w tygodniu to też jest w porządku.';
  /* audyt 0.10 LOG-10: 4 sesje — pon/wt/czw/sob, bez par dzień po dniu (było czw–pt: Góra B → Dół B, wspólne plecy) */
  expect(screen.queryByText(new RegExp('^' + pairs.split('{list}')[0]))).toBeNull(); expect(screen.getByText(/^pon\.? Góra A · wt\.? Dół A · czw\.? Góra B · sob\.? Dół B$/)).toBeTruthy();
  expect([sessionName('fbwA'), sessionName('cardio'), goalLabel('strength'), goalLabel('hypertrophy'), goalLabel('cut')]).toEqual(['FBW A', 'Cardio', 'Siła', 'Masa', 'Redukcja']);
});
