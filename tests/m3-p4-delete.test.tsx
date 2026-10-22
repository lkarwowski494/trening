/* M3 p4, ZM-04 / W2 wariant a (docs/32 wz. 5, 21.10.2026; STOP 3: wbudowanych ćwiczeń przycisk nie usuwa): „Usuń szablon” na dole podglądu szablonu
 * (nie w szkicu) i „Usuń z biblioteki” na dole podglądu ćwiczenia WŁASNEGO. To samo okno co gest (tytuł, treść, [Anuluj, Usuń]).
 * Trasy z tej partii do listy w tests/swipe-delete.test.tsx: blok „bez przycisków Usuń” tam jest jeszcze stary (zamienia go p3), więc ten plik jest osobny.
 * Rodzaje: ekran (przycisk, okno, skutek), macierz (szablon / ćwiczenie własne / wbudowane / szkic), języki (en), dostępność (rola przycisku). */
import * as store from '@/lib/store';
import { fresh, ex, saved } from './helpers';
import { renderApp, flushAll, screen, tap, act, startEdit } from './app';

jest.setTimeout(60000);
const S = () => store.getState();
const boot = async (fn: () => void, url: string, locale: 'pl' | 'en' = 'pl') => { await fresh(undefined, locale); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); await flushAll(10); };
const lastAlert = () => global.__alerts[global.__alerts.length - 1];
const tplWith = () => { const t = store.newTemplate(); t.name = 'T1'; t.items.push({ id: 'i1', exerciseId: ex('Back Squat').id, sets: 2, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(t); return t; };
const press = async (btn: string) => { await act(async () => { lastAlert().buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(10); };

describe('ZM-04: „Usuń szablon” na dole podglądu szablonu', () => {
  test('jeden przycisk (rola button, danger) → okno [Anuluj, Usuń] z tytułem jak gest; Anuluj zostawia, Usuń usuwa szablon i zamyka ekran', async () => {
    let id = ''; await boot(() => { id = tplWith().id; }, '/templates');
    await act(async () => { require('expo-router').router.push(`/template/${id}`); }); await flushAll(10);
    const b = screen.getByLabelText('Usuń szablon'); expect(b.props.accessibilityRole).toBe('button'); expect(screen.getAllByLabelText('Usuń szablon')).toHaveLength(1);
    await tap(b); expect(lastAlert()).toMatchObject({ title: 'Usunąć szablon?' }); expect(lastAlert().msg).toContain('T1'); expect(lastAlert().buttons!.map(x => x.text)).toEqual(['Anuluj', 'Usuń']);
    await press('Anuluj'); expect(S().templates).toHaveLength(1);
    await tap(screen.getByLabelText('Usuń szablon')); await press('Usuń'); expect(S().templates).toHaveLength(0); expect(screen.queryByLabelText('Usuń szablon')).toBeNull();
  });
  test('w szkicu (po „Edytuj”) przycisku nie ma, w podglądzie jest', async () => {
    let id = ''; await boot(() => { id = tplWith().id; }, '/templates');
    await act(async () => { require('expo-router').router.push(`/template/${id}`); }); await flushAll(10);
    expect(screen.queryByLabelText('Usuń szablon')).not.toBeNull(); await startEdit(); expect(screen.queryByLabelText('Usuń szablon')).toBeNull();
  });
  test('English: „Delete template”', async () => {
    let id = ''; await boot(() => { id = tplWith().id; }, '/templates', 'en');
    await act(async () => { require('expo-router').router.push(`/template/${id}`); }); await flushAll(10);
    await tap(screen.getByLabelText('Delete template')); expect(lastAlert()).toMatchObject({ title: 'Delete template?' }); expect(lastAlert().buttons!.map(x => x.text)).toEqual(['Cancel', 'Delete']);
  });
});

describe('ZM-04: „Usuń z biblioteki” na dole podglądu ćwiczenia — tylko własne', () => {
  test('ćwiczenie własne: przycisk → okno jak gest; Usuń usuwa je z biblioteki i zamyka ekran', async () => {
    let id = ''; await boot(() => { id = store.newExercise('Moje ćwiczenie').id; }, '/exercises');
    await act(async () => { require('expo-router').router.push(`/exercise/${id}`); }); await flushAll(10);
    const b = screen.getByLabelText('Usuń z biblioteki'); expect(b.props.accessibilityRole).toBe('button'); expect(screen.getAllByLabelText('Usuń z biblioteki')).toHaveLength(1);
    await tap(b); expect(lastAlert()).toMatchObject({ title: 'Usunąć ćwiczenie?' }); expect(lastAlert().buttons!.map(x => x.text)).toEqual(['Anuluj', 'Usuń']);
    await press('Anuluj'); expect(S().exercises.some(e => e.id === id)).toBe(true);
    await tap(screen.getByLabelText('Usuń z biblioteki')); await press('Usuń'); expect(S().exercises.some(e => e.id === id && !e.archived)).toBe(false);
  });
  test('ćwiczenie wbudowane: bez przycisku (decyzja STOP 3)', async () => {
    let id = ''; await boot(() => { id = ex('Back Squat').id; }, '/exercises');
    await act(async () => { require('expo-router').router.push(`/exercise/${id}`); }); await flushAll(10);
    expect(screen.queryByLabelText('Usuń z biblioteki')).toBeNull(); expect(screen.queryByText('Usuń z biblioteki')).toBeNull();
  });
  test('ćwiczenie własne w szkicu (po „Edytuj”): bez przycisku', async () => {
    let id = ''; await boot(() => { id = store.newExercise('Moje ćwiczenie').id; }, '/exercises');
    await act(async () => { require('expo-router').router.push(`/exercise/${id}`); }); await flushAll(10);
    await startEdit(); expect(screen.queryByLabelText('Usuń z biblioteki')).toBeNull();
  });
  test('English: „Delete from library”', async () => {
    let id = ''; await boot(() => { id = store.newExercise('Mine').id; }, '/exercises', 'en');
    await act(async () => { require('expo-router').router.push(`/exercise/${id}`); }); await flushAll(10);
    await tap(screen.getByLabelText('Delete from library')); expect(lastAlert().buttons!.map(x => x.text)).toEqual(['Cancel', 'Delete']);
  });
});
