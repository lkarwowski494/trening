/*
 * 101-22 (29.10.2026): pole wyszukiwania na liście ćwiczeń ma testID „exercises-search” — po Enter traci fokus, a scenariusz Maestro wraca do niego
 * przez id, nie przez tapnięcie po tekście (zapadka M1-034). Wygląd i zachowanie pola bez zmian: wpisanie nazwy filtruje listę.
 */
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, type as typeText } from './app';

jest.setTimeout(60000);

describe('lista ćwiczeń: pole wyszukiwania z testID', () => {
  test('exercises-search to pole tekstowe z tym samym placeholderem; wpis „Deadlift (sztanga)” zostawia jeden wiersz lib-row-1', async () => {
    await fresh(undefined, 'pl'); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/exercises' }); await flushAll(20);
    const field = screen.getByTestId('exercises-search');
    expect(field.props.placeholder).toBe('Szukaj ćwiczenia…');
    await typeText(field, 'Deadlift (sztanga)'); await flushAll(5);
    expect(screen.getAllByTestId(/^lib-row-\d+$/).length).toBeGreaterThan(0);
    expect(screen.getByTestId('lib-row-1')).toBeTruthy();
  });
});
