/*
 * „Pierwsze kroki” przy pustym szablonie. 09.10.2026: „Dodaj ćwiczenia do szablonu „…”” / „Puste szablony: n”; 11.10.2026 (docs/22 P4 A: każdy krok z jednym
 * przyciskiem) te dwa przyciski zniknęły — krok 1 prowadzi przez „Planowanie”, a lista szablonów jest osiągalna z ekranu planu. Martwa logika emptyTemplates usunięta (11.10.2026, pakiet porządków).
 * Regresja (docs/20 rodzaj 8): dawniej przy pustym szablonie „Najpierw utwórz szablon.” (czerwony na e132ed0).
 */
import * as store from '@/lib/store';
import * as draft from '@/lib/draft';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';
import { within } from '@testing-library/react-native';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek */
const S = () => store.getState();
afterEach(() => { applyLang('pl'); draft.__resetObjDrafts(); });
const boot = async (url: string, fn: (ids: string[]) => void = () => {}, opts: { demo?: boolean } = {}) => {
  jest.useFakeTimers({ now: NOW }); await fresh(); const t = opts.demo === false ? [] : withDemoTemplates(); fn(t.map(x => x.id));
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
  return t;
};

describe('regresja (09.10.2026, zmieniona 11.10.2026 przez P4 A): „Pierwsze kroki” przy pustym szablonie — dawniej „Najpierw utwórz szablon.”', () => {
  test('pusty szablon nie zalicza kroku 1; jeden przycisk w kroku („Szablony i plan”, M1-audytor-generalny-025; bez dawnego „Dodaj ćwiczenia…” i „Najpierw utwórz szablon.”); po dodaniu ćwiczenia krok 1 jest zrobiony', async () => {
    await boot('/', () => { const x = store.newTemplate(); x.name = 'Test A'; store.save(x); }, { demo: false });
    expect(screen.queryByText('Najpierw utwórz szablon.')).toBeNull(); expect(screen.queryByText(/^Dodaj ćwiczenia do szablonu/)).toBeNull(); expect(screen.queryByText(/^Puste szablony/)).toBeNull();
    expect(screen.getByLabelText(/^1\. .* do zrobienia$/)).toBeTruthy(); expect(within(screen.getByTestId('first-steps')).getAllByText('Szablony i plan')).toHaveLength(1); expect(within(screen.getByTestId('first-steps')).getAllByText('Planowanie')).toHaveLength(1); /* M1-audytor-generalny-025 (27.10.2026): krok 1 „Szablony i plan”, krok 2 „Planowanie” */
    const x = S().templates[0]; x.items.push({ id: 'i1', exerciseId: store.getState().exercises.find(e => e.name === 'Plank')!.id, sets: 3, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(x);
    await act(async () => { await store.flush(); }); await flushAll(10);
    expect(screen.getByLabelText(/^1\. .* zrobione$/)).toBeTruthy(); expect(within(screen.getByTestId('first-steps')).getAllByText('Planowanie')).toHaveLength(1);
  });
  test('kilka pustych szablonów: nadal jeden przycisk w kroku, bez listy „Puste szablony”; „Planowanie” → ekran planu z przejściem do Szablonów', async () => {
    await boot('/', () => { const a = store.newTemplate(); a.name = 'Test A'; store.save(a); jest.setSystemTime(NOW.getTime() + 60000); const b = store.newTemplate(); b.name = 'Test B'; store.save(b); }, { demo: false });
    expect(screen.queryByText(/^Puste szablony/)).toBeNull(); expect(screen.queryByText('Dodaj ćwiczenia')).toBeNull();
    await tap(within(screen.getByTestId('first-steps')).getAllByText('Planowanie')[0]); await flushAll(10);
    await tap(screen.getByText('Szablony')); await flushAll(10); expect(screen.getByText('Test A')).toBeTruthy(); expect(screen.getByText('Test B')).toBeTruthy();
  });
});
