/* Pełna baza ćwiczeń (decyzja właściciela 04.10.2026, wieczór: „dodawaj resztę”, ~870 ćwiczeń). Listy nie renderują wszystkiego naraz:
 * wybór ćwiczenia — FlatList (wirtualizacja); arkusz zamiany „Inne” — porcje SWAP_PAGE z „Pokaż więcej”. */
import * as store from '@/lib/store';
import { SWAP_PAGE } from '@/lib/swap';
import { fresh, ex } from './helpers';
import { renderApp, flushAll, screen, go, tap, type } from './app';

jest.setTimeout(60000);
describe('pełna baza — listy', () => {
  test('wybór ćwiczenia: nie renderuje całej biblioteki naraz; wyszukiwanie znajduje ćwiczenie z końca listy', async () => {
    await fresh(); store.startEmpty(); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/picker?target=add'); await flushAll(20);
    const n = store.getState().exercises.length; const shown = screen.getAllByText('+').length;
    expect(shown).toBeLessThan(Math.min(n, 120));
    const last = [...store.getState().exercises].sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name)).pop()!;
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), last.name); await flushAll(10);
    expect(screen.getAllByText(last.name).length).toBeGreaterThan(0);
  });
  test('arkusz zamiany „Inne” bez filtrów: najwyżej SWAP_PAGE wierszy, „Pokaż więcej” dokłada kolejne', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(20);
    await tap(screen.getByLabelText('Zamień ćwiczenie: Bench Press (sztanga)')); await flushAll(20);
    await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5);
    await tap(screen.getByLabelText('Filtr partii: klatka. Tapnij, by zdjąć.')); await flushAll(5);
    const rows = () => screen.getAllByText('⇄').length;
    expect(rows()).toBeLessThanOrEqual(SWAP_PAGE + 3 /* propozycje */ + 1);
    const more = screen.getByLabelText(/^Pokaż więcej ćwiczeń: zostało \d+$/); await tap(more); await flushAll(5);
    expect(rows()).toBeGreaterThan(SWAP_PAGE + 4);
  });
});
