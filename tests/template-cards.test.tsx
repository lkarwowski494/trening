/* Uwaga właściciela 06.10.2026 (zrzut ekranu szablonu): „niewygodne, że jak dodasz ćwiczenie, to ono zostaje takie rozwinięte”; „zmiana pozycji
 * ćwiczenia na liście jest za blisko X — łatwo je wyrzucić missclickiem”. Decyzje: zwijane karty, otwarta jedna; bez strzałek, „Usuń” w rozwiniętej karcie. */
import { renderApp, flushAll, screen, go, tap, type as typeText, deleteActions, startEdit } from './app';
import * as store from '@/lib/store';
import { fresh, ex } from './helpers';

jest.setTimeout(60000);
const cards = () => screen.getAllByRole('button').filter(b => b.props.accessibilityState?.expanded !== undefined && b.props.accessibilityValue?.text !== undefined);
const tpl3 = () => { const st = store.getState(); const t = { ...st.templates[0], id: 'tc', name: 'C', items: ['Bench Press (sztanga)', 'Back Squat', 'Lat Pulldown'].map((n, i) => ({ id: 'c' + i, exerciseId: ex(n).id, sets: 3, repMin: i === 0 ? 8 : null, repMax: i === 0 ? 12 : null, restSec: 120, startWeight: '', targetSec: '', groupId: null })) } as any; st.templates.push(t); return t; };

test('karty zwinięte z podsumowaniem; dotknięcie otwiera jedną (inne się zwijają); bez strzałek ↑↓', async () => {
  await fresh(); tpl3(); await store.flush(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/template/tc'); await flushAll(10); await startEdit();
  expect(cards().map(c => c.props.accessibilityState.expanded)).toEqual([false, false, false]);
  expect(cards()[0].props.accessibilityValue.text).toBe('3 serie · 8–12 · 2:00'); expect(screen.queryByLabelText('Przesuń wyżej')).toBeNull(); expect(screen.queryByLabelText('Przesuń niżej')).toBeNull();
  await tap(cards()[1]); expect(cards().map(c => c.props.accessibilityState.expanded)).toEqual([false, true, false]); expect(screen.getAllByText('+ seria').length).toBe(1);
  await tap(cards()[2]); expect(cards().map(c => c.props.accessibilityState.expanded)).toEqual([false, false, true]);
  await tap(cards()[2]); expect(cards().map(c => c.props.accessibilityState.expanded)).toEqual([false, false, false]);
});
test('nowo dodane ćwiczenie otwiera się samo; usuwanie przesunięciem nagłówka (także zwiniętej karty), z potwierdzeniem — 07.10.2026 wieczór', async () => {
  await fresh(); tpl3(); await store.flush(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/template/tc'); await flushAll(10); await startEdit();
  expect(screen.queryByLabelText('Usuń z szablonu')).toBeNull(); expect(deleteActions().filter(l => l.startsWith('Usuń ćwiczenie: ')).length).toBe(3);
  await go('/picker?target=template:tc'); await flushAll(10); await typeText(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Plank'); await flushAll(5); await tap(screen.getAllByText('Plank')[0]); await flushAll(10);
  expect(cards().map(c => c.props.accessibilityState.expanded)).toEqual([false, false, false, true]);
  expect(deleteActions()).toContain('Usuń ćwiczenie: Plank');
});
