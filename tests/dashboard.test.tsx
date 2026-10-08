/*
 * Dashboard ekranu Trening (decyzja właściciela 08.10.2026, wariant A) i „Pierwsze kroki” dla nowej osoby. Dane: lib/dashboard.ts (definicje jak
 * podsumowanie tygodnia w Postępach — lib/period). Rodzaje (docs/20): logika (pasek tygodnia, kafelki z poprzednim tygodniem, plan, ostatni trening,
 * kroki), ekran (kafelki, opis, ostatni trening z rekordami i przejściem, kroki z odhaczaniem i przyciskami), VoiceOver (etykiety kafelków i kroków),
 * języki (EN). Karta „Dziś”: tests/plan-calendar-ui.test.tsx. E2E: .maestro/01 (kafelki po treningu), subflow (pierwsze kroki).
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { weekStrip, weekTiles, lastWorkout, firstSteps } from '@/lib/dashboard';
import { workoutPRs } from '@/lib/stats';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, withDemoTemplates, addWorkout } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

const NOW = new Date(2026, 9, 8, 9, 0); /* czw.; tydzień od 5.10 */
const S = () => store.getState();
afterEach(() => { applyLang('pl'); });
const at = (m: number, d: number, h = 18) => new Date(2026, m, d, h).getTime();
const sq = (m: number, d: number, kg = 100) => addWorkout(at(m, d), [['Back Squat', [{ weight: kg, reps: 5 }, { weight: kg, reps: 5 }]]]);
/** Plan ustawiony 1.09 — audyt 0.10 A1: plan obowiązuje od dnia ustawienia, przeszłe dni tego tygodnia mają plan tylko z historii. */
const since0901 = (fn: () => void) => { jest.setSystemTime(new Date(2026, 8, 1, 9).getTime()); fn(); jest.setSystemTime(NOW.getTime()); };

describe('logika', () => {
  beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
  test('pasek tygodnia pon…nd: zrobione, opuszczony, zaplanowany, wolne, dziś', () => {
    const t = withDemoTemplates(); since0901(() => { plan.setWeekDay(0, t[0].id); plan.setWeekDay(1, t[1].id); plan.setWeekDay(4, t[0].id); }); sq(9, 6).templateId = t[1].id;
    const w = weekStrip(NOW.getTime()); /* audyt 0.10 A5: „zrobione” tylko zaplanowanym szablonem (inny trening — 'other', tests/audit-0.10-plan.test.ts) */
    expect(w.map(d => [d.date, d.status, d.today])).toEqual([['2026-10-05', 'missed', false], ['2026-10-06', 'done', false], ['2026-10-07', 'rest', false], ['2026-10-08', 'rest', true],
      ['2026-10-09', 'planned', false], ['2026-10-10', 'rest', false], ['2026-10-11', 'rest', false]]);
  });
  test('kafelki: treningi, serie, czas — ten tydzień i poprzedni; zaplanowane dni tylko z planem', () => {
    sq(9, 6); sq(9, 7); sq(8, 29);
    expect(weekTiles(NOW.getTime())).toMatchObject({ workouts: 2, sets: 4, planned: null, prev: { workouts: 1, sets: 2 } });
    const t = withDemoTemplates(); since0901(() => { plan.setWeekDay(1, t[0].id); plan.setWeekDay(3, t[0].id); plan.setWeekDay(5, t[0].id); });
    expect(weekTiles(NOW.getTime())).toMatchObject({ planned: 3, planDone: 0 }); /* audyt 0.10 A5: wt. — trening bez szablonu, nie zalicza dnia z planu */
  });
  test('ostatni trening: nazwa, serie robocze, objętość, rekordy; brak treningów — null', () => {
    expect(lastWorkout()).toBeNull(); sq(9, 1, 80); const w = sq(9, 6, 100);
    expect(lastWorkout()).toMatchObject({ id: w.id, sets: 2, volume: store.volume(w), prs: workoutPRs(w).length }); expect(lastWorkout()!.prs).toBeGreaterThan(0);
  });
  test('pierwsze kroki: szablon (z ćwiczeniami), plan; po pierwszym treningu znikają', () => {
    expect(firstSteps()).toEqual({ template: false, plan: false });
    store.newTemplate(); expect(firstSteps()!.template).toBe(false); /* pusty szablon się nie liczy */
    const t = withDemoTemplates(); expect(firstSteps()).toEqual({ template: true, plan: false });
    plan.setWeekDay(0, t[0].id); expect(firstSteps()).toEqual({ template: true, plan: true });
    sq(9, 6); expect(firstSteps()).toBeNull();
  });
});

describe('ekran', () => {
  const boot = async (fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => {
    jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn();
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/' }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
  };
  test('nowa osoba: „Pierwsze kroki” — 3 kroki do zrobienia, „Wygeneruj szablony i plan”, „Plan tygodnia”; bez kafelków', async () => {
    await boot();
    expect(screen.getByTestId('first-steps')).toBeTruthy(); expect(screen.getByRole('header', { name: 'Pierwsze kroki' })).toBeTruthy();
    expect(screen.getByLabelText('1. Utwórz szablon („+ Nowy szablon” niżej) albo wygeneruj szablony i plan. do zrobienia')).toBeTruthy();
    expect(screen.getByText('Ustaw plan tygodnia — zobaczysz tu dzisiejszy trening i dostaniesz przypomnienie.')).toBeTruthy();
    expect(screen.getByText(/^Pierwszy raz\? Utwórz swój szablon/)).toBeTruthy(); expect(screen.queryByTestId('week-tiles')).toBeNull();
    await tap(screen.getByText('Wygeneruj szablony i plan')); await flushAll(10); expect(screen.getByText('Podgląd')).toBeTruthy();
  });
  test('kroki odhaczone: szablon i plan zrobione (✓, VoiceOver „zrobione”), krok 3 z tekstem dla szablonów', async () => {
    await boot(() => { const t = withDemoTemplates(); plan.setWeekDay(0, t[0].id); });
    expect(screen.getByLabelText(/^1\. .* zrobione$/)).toBeTruthy(); expect(screen.getByLabelText(/^2\. .* zrobione$/)).toBeTruthy();
    expect(screen.getByLabelText(/^3\. Pierwszy raz\? Wybierz szablon niżej.* do zrobienia$/)).toBeTruthy();
    expect(screen.queryByText('Wygeneruj szablony i plan')).toBeNull(); expect(screen.getAllByText('✓').length).toBeGreaterThanOrEqual(2);
  });
  test('po treningach: kafelki z poprzednim tygodniem (VoiceOver), opis z planem, ostatni trening z rekordami → szczegóły', async () => {
    await boot(() => { sq(8, 29, 80); const t = withDemoTemplates(); sq(9, 6, 100).templateId = t[0].id; since0901(() => { plan.setWeekDay(1, t[0].id); plan.setWeekDay(3, t[0].id); }); });
    expect(screen.queryByTestId('first-steps')).toBeNull(); expect(screen.getByText('Ten tydzień')).toBeTruthy();
    expect(screen.getByLabelText('Treningi: 1, poprzedni tydzień 1')).toBeTruthy(); /* audyt 0.10 A5: kafelek liczy sesje, dni planu w opisie niżej */ expect(screen.getByLabelText('Serie: 2, poprzedni tydzień 2')).toBeTruthy();
    expect(screen.getByLabelText('Czas: 1 h, poprzedni tydzień 1 h')).toBeTruthy(); /* pełna godzina — bez „0 min” */ expect(screen.getAllByText(/^poprz\.: /).length).toBe(3); expect('poprz.: {v}'.replace('{v}', '2')).toBe('poprz.: 2'); expect(screen.getAllByText('poprz.: 2').length).toBe(1); /* tekst z t() — macierz */
    expect(screen.getByText('Z planu w tym tygodniu: zrobione 1 z 2.')).toBeTruthy(); expect('Z planu w tym tygodniu: zrobione {done} z {n}.').toContain('{done}'); /* tekst z t() — macierz; audyt 0.10 A5 */
    expect(screen.getByText('Ostatni trening')).toBeTruthy();
    const last = lastWorkout()!; const item = screen.getByText(new RegExp(` · 2 serie · .* · ${last.prs} (rekord|rekordy|rekordów)$`)); expect(item).toBeTruthy();
    await tap(item); await flushAll(10); expect(screen.getByLabelText('Edytuj sesję')).toBeTruthy();
  });
  test('godzina i dłużej w kafelku czasu — „1 h 5 min”', async () => {
    await boot(() => { const w = sq(9, 6); w.finishedAt = w.startedAt + 65 * 60e3; });
    expect(screen.getByLabelText(/^Czas: 1 h 5 min, /)).toBeTruthy();
  });
  test('English', async () => {
    await boot(() => { sq(9, 6); }, 'en');
    expect(screen.getByText('This week')).toBeTruthy(); expect(screen.getByLabelText('Workouts: 1, previous week 0')).toBeTruthy(); expect(screen.getByText('Last workout')).toBeTruthy();
    expect(screen.getByText('No weekly plan')).toBeTruthy(); expect(screen.getByText('Today')).toBeTruthy();
    await boot(() => {}, 'en'); expect(screen.getByText('First steps')).toBeTruthy(); expect(screen.getByLabelText(/^1\. .* to do$/)).toBeTruthy();
  });
});
