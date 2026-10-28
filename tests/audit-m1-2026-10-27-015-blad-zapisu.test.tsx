/*
 * M1-audytor-generalny-015 (audyt 1.0, 27.10.2026; 05-architekt-003): nieudany zapis po „Zapisz” poza zakładką Trening (edycja historii, ustawienia)
 * pokazuje komunikat na miejscu — okno „Nie udało się zapisać danych” z „Spróbuj ponownie” w chwili błędu, na ekranie, z którego zapisano (dane w pamięci
 * zostają do ponowienia jak dotąd). Rodzaje (docs/20): ekran, scenariusz (pełna pamięć: __dbFail), regresja.
 */
import { t } from '@/lib/i18n';
import { fresh, addWorkout, saved } from './helpers';
import { renderApp, flushAll, screen, go, tap, type, act } from './app';

jest.setTimeout(60000);
afterEach(() => { global.__dbFail = false; });
const alerted = () => global.__alerts.filter(a => a.title === t('Nie udało się zapisać danych'));

describe('M1-015: błąd zapisu widoczny na ekranie, z którego zapisano', () => {
  test('edycja sesji z historii: „Zapisz sesję” przy pełnej pamięci → okno błędu od razu (bez przechodzenia na Trening); „Spróbuj ponownie” po zwolnieniu miejsca zapisuje', async () => {
    await fresh(); const w = addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5, done: true }]]], 'Push A');
    await act(async () => { await require('@/lib/store').flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await go(`/history/${w.id}`); await flushAll(1100); await tap(screen.getByText(t('Edytuj'))); await flushAll(20);
    global.__dbFail = true; global.__alerts.length = 0;
    await type(screen.getByLabelText('Nazwa'), 'Push A — zmiana'); await tap(screen.getByLabelText('Zapisz sesję')); await flushAll(30);
    expect(alerted().length).toBe(1); expect(alerted()[0].buttons!.map(b => b.text)).toContain(t('Spróbuj ponownie'));
    global.__dbFail = false; await act(async () => { alerted()[0].buttons!.find(b => b.text === t('Spróbuj ponownie'))!.onPress?.(); }); await flushAll(30);
    expect(JSON.parse(global.__kv.get('state')!).workouts.find((x: { id: string }) => x.id === w.id).templateName).toBe('Push A — zmiana');
  });
  test('kolejne nieudane zapisy tego samego błędu nie mnożą okien (jedno okno na epizod błędu)', async () => {
    await fresh(); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/more/settings' }); await flushAll(20);
    global.__dbFail = true; global.__alerts.length = 0;
    const s = require('@/lib/store'); for (let i = 0; i < 3; i++) { s.getState().settings.defaultRest = 60 + i; s.save(); await act(async () => { await s.flush(); }); await flushAll(5); }
    expect(alerted().length).toBe(1);
  });
});
