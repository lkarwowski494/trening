/* Pełna baza ćwiczeń (decyzja właściciela 04.10.2026, wieczór: „dodawaj resztę”, ~870 ćwiczeń). Listy nie renderują wszystkiego naraz:
 * wybór ćwiczenia — FlatList (wirtualizacja); arkusz zamiany „Inne” — porcje SWAP_PAGE z „Pokaż więcej”. */
import * as store from '@/lib/store';
import { SWAP_PAGE } from '@/lib/swap';
import { fresh, ex } from './helpers';
import { renderApp, flushAll, screen, go, tap, type, act } from './app';

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

import { swapCandidates, sortOthers } from '@/lib/swap';
import { exName } from '@/lib/i18n';
describe('pełna baza — audyt kodu 04.10 wieczór', () => {
  test('MEDIUM 1: rozciąganie (wzorzec mobility) nie jest „tym samym ruchem” dla innego rozciągania bez wspólnej partii', async () => {
    await fresh(); const c = swapCandidates(ex('Ankle Circles').id, { showAll: true, inWorkout: new Set() });
    expect(c.filter(x => !x.reasons.includes('muscle'))).toEqual([]);
  });
  test('LOW 4: lista „Inne” — dokładne trafienie nazwy na początku (przed porcją „Pokaż więcej”), reszta alfabetycznie', async () => {
    await fresh(); const all = store.getState().exercises.filter(e => /push/i.test(e.name));
    const s = sortOthers(all, 'push up'); expect(exName(s[0])).toBe('Push Up');
    const rest = s.slice(1).map(e => exName(e)); expect(rest).toEqual([...rest].sort((a, b) => a.localeCompare(b, 'pl')));
  });
  test('LOW 5: zwinięcie i ponowne rozwinięcie „Inne” wraca do pierwszej porcji', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(20);
    await tap(screen.getByLabelText('Zamień ćwiczenie: Bench Press (sztanga)')); await flushAll(20);
    await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5); await tap(screen.getByLabelText('Filtr partii: klatka. Tapnij, by zdjąć.')); await flushAll(5);
    const first = screen.getAllByText('⇄').length; await tap(screen.getByLabelText(/^Pokaż więcej ćwiczeń/)); await flushAll(5); expect(screen.getAllByText('⇄').length).toBeGreaterThan(first);
    const wait = async () => { await act(async () => { jest.advanceTimersByTime(800); }); }; /* Item: useOnce(700) — ochrona przed podwójnym tapnięciem */
    await wait(); await tap(screen.getByLabelText('Zwiń inne ćwiczenia')); await flushAll(5); await wait(); await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5);
    expect(screen.getAllByText('⇄').length).toBe(first);
  });
});
