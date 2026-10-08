/*
 * Usuwanie przesunięciem w lewo (decyzja właściciela 07.10.2026 wieczór, docs/18): wszędzie ten sam gest, zawsze z potwierdzeniem,
 * bez przycisków „Usuń”. Rodzaje (docs/20): logika (swipeDecision), ekran (każde miejsce: „Nie” zostawia, „Usuń” usuwa), macierz
 * (tabela MIEJSC), dostępność (akcja VoiceOver „usuń”, przycisk pod wierszem ukryty, gdy wiersz zamknięty), języki (en), regresja
 * (bez przycisków „Usuń”/„− seria”). Gest palcem — E2E: .maestro/12-usuwanie-gestem.yaml.
 */
import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, act as rtlAct } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { addLocation } from '@/lib/locations';
import { SwipeRow, swipeDecision, SWIPE } from '@/components/SwipeRow';
import { fresh, ex, addWorkout, pressAlert, saved } from './helpers';
import { renderApp, flushAll, screen, go, act, swipeDelete, deleteActions, openCard, startEdit, tplDraft } from './app';

jest.setTimeout(60000);
const S = () => store.getState();
const lastAlert = () => global.__alerts[global.__alerts.length - 1];
beforeAll(async () => { await fresh(); });
afterEach(async () => { await timer.stop(); await timer.stopSet(); });

describe('logika (components/SwipeRow.tsx)', () => {
  test('swipeDecision: krótki ruch zamyka, połowa przycisku albo szybki ruch w lewo odsłania, dwa przyciski od razu pytają; ruch w prawo zamyka', () => {
    const w = SWIPE.button;
    expect(swipeDecision(-10, 0)).toBe('close'); expect(swipeDecision(-w * 0.49, 0)).toBe('close');
    expect(swipeDecision(-w * 0.5, 0)).toBe('open'); expect(swipeDecision(-20, -0.6)).toBe('open');
    expect(swipeDecision(-w * 2, 0)).toBe('ask'); expect(swipeDecision(-w * 3, -2)).toBe('ask');
    expect(swipeDecision(30, 0)).toBe('close'); expect(swipeDecision(30, -1)).toBe('close');
  });
});

describe('komponent', () => {
  const mount = (onDelete = jest.fn(), disabled = false) => render(
    <SwipeRow label="Usuń X" title="Usunąć X?" message="opis" onDelete={onDelete} disabled={disabled}>{a11y => <Text {...a11y} accessible accessibilityLabel="Wiersz X">X</Text>}</SwipeRow>);
  test('akcja VoiceOver „usuń” na elemencie wiersza; przycisk pod wierszem ukryty, dopóki wiersz zamknięty', async () => {
    await fresh(); const r = mount();
    expect(r.getByLabelText('Wiersz X').props.accessibilityActions).toEqual([{ name: 'delete', label: 'Usuń X' }]);
    expect(r.queryByLabelText('Usuń X')).toBeNull(); expect(r.getByLabelText('Usuń X', { includeHiddenElements: true })).toBeTruthy();
  });
  test('potwierdzenie: „Nie” nic nie usuwa, „Usuń” usuwa raz', async () => {
    await fresh(); const del = jest.fn(); const r = mount(del);
    await rtlAct(async () => { fireEvent(r.getByLabelText('Wiersz X'), 'accessibilityAction', { nativeEvent: { actionName: 'delete' } }); });
    expect(lastAlert()).toMatchObject({ title: 'Usunąć X?', msg: 'opis' }); expect(lastAlert().buttons!.map((b: any) => b.text)).toEqual(['Nie', 'Usuń']);
    await rtlAct(async () => { pressAlert('Usunąć X?', 'Nie'); }); expect(del).not.toHaveBeenCalled();
    await rtlAct(async () => { fireEvent(r.getByLabelText('Wiersz X'), 'accessibilityAction', { nativeEvent: { actionName: 'activate' } }); }); expect(global.__alerts.length).toBe(1); /* inna akcja — bez pytania */
    await rtlAct(async () => { fireEvent(r.getByLabelText('Wiersz X'), 'accessibilityAction', { nativeEvent: { actionName: 'delete' } }); });
    await rtlAct(async () => { pressAlert('Usunąć X?', 'Usuń'); }); expect(del).toHaveBeenCalledTimes(1);
  });
  test('zamknięty wiersz: przycisk „Usuń” pod spodem nie przyjmuje dotyku (odsłania go dopiero przesunięcie)', async () => {
    await fresh(); const del = jest.fn(); const r = mount(del); const n = global.__alerts.length;
    await rtlAct(async () => { fireEvent.press(r.getByLabelText('Usuń X', { includeHiddenElements: true })); }); expect(global.__alerts.length).toBe(n); expect(del).not.toHaveBeenCalled();
  });
  test('disabled: bez akcji i bez przycisku', async () => {
    await fresh(); const r = mount(jest.fn(), true);
    expect(r.getByLabelText('Wiersz X').props.accessibilityActions).toBeUndefined(); expect(r.queryByLabelText('Usuń X', { includeHiddenElements: true })).toBeNull();
  });
});

/* ---------- macierz miejsc: każde usuwanie w aplikacji ---------- */
type Place = { name: string; setup: () => Promise<void>; label: string | RegExp; title: string; count: () => number };
const boot = async (fn: () => void = () => {}, url?: string) => { await fresh(); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); await flushAll(10); };
const tplWith = () => { const t = store.newTemplate(); t.name = 'T1'; t.items.push({ id: 'i1', exerciseId: ex('Back Squat').id, sets: 2, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }, { id: 'i2', exerciseId: ex('Plank').id, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(t); return t; };
const PLACES: Place[] = [
  { name: 'szablon (lista Szablony)', setup: async () => { await boot(() => { tplWith(); }); await go('/templates'); await flushAll(10); }, label: 'Usuń szablon: T1', title: 'Usunąć szablon?', count: () => S().templates.length },
  { name: 'sesja (lista Historia)', setup: async () => { await boot(() => { addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); }); await go('/history'); await flushAll(10); }, label: /^Usuń sesję: /, title: 'Usunąć tę sesję z historii?', count: () => S().workouts.length },
  { name: 'ćwiczenie (biblioteka)', setup: async () => { await boot(); await go('/exercises'); await flushAll(10); }, label: 'Usuń z biblioteki: Back Squat', title: 'Usunąć ćwiczenie?', count: () => S().exercises.filter(e => !e.archived).length },
  { name: 'guma', setup: async () => { await boot(); await go('/more/bands'); await flushAll(10); }, label: /^Usuń gumę: /, title: 'Usunąć gumę?', count: () => S().bands.length },
  { name: 'miejsce (inne niż główne)', setup: async () => { await boot(() => { addLocation('home'); addLocation('gym'); }); await go('/more/locations'); await flushAll(10); }, label: /^Usuń miejsce: /, title: 'Usunąć miejsce?', count: () => S().settings.locations.length },
  { name: 'talerz (opis sprzętu)', setup: async () => { let id = ''; await boot(() => { id = addLocation('gym').id; }); await go(`/more/location/${id}`); await flushAll(10); const { expandEquip } = require('./app'); await expandEquip(); }, label: /^Usuń talerz — Sztanga/, title: 'Usunąć talerz?', count: () => S().settings.locations[0].equipment.find(e => e.item === 'barbell')!.load!.kind === 'plates' ? (S().settings.locations[0].equipment.find(e => e.item === 'barbell')!.load as { plates: unknown[] }).plates.length : -1 },
  { name: 'pozycja szablonu', setup: async () => { let id = ''; await boot(() => { id = tplWith().id; }); await go(`/template/${id}`); await flushAll(10); await startEdit(); }, label: 'Usuń ćwiczenie: Back Squat', title: 'Usunąć z szablonu?', count: () => (tplDraft(S().templates[0].id) ?? S().templates[0]).items.length /* edycja na żądanie: szkic */ },
  { name: 'seria szablonu', setup: async () => { let id = ''; await boot(() => { id = tplWith().id; }); await go(`/template/${id}`); await flushAll(10); await startEdit(); await openCard(0); }, label: 'Usuń serię 2 — Back Squat', title: 'Usunąć serię?', count: () => store.tplRows((tplDraft(S().templates[0].id) ?? S().templates[0]).items[0]).length },
  { name: 'ćwiczenie w treningu', setup: async () => { await boot(() => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Plank')); }); }, label: 'Usuń ćwiczenie: Back Squat', title: 'Usunąć z treningu?', count: () => S().active!.exercises.length },
  { name: 'seria w treningu', setup: async () => { await boot(() => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0); }); }, label: 'Usuń serię 2 — Back Squat', title: 'Usunąć serię?', count: () => S().active!.exercises[0].sets.length },
  { name: 'usunięte ćwiczenie w treningu', setup: async () => { await boot(() => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Plank')); S().active!.exercises[0].exerciseId = 'usuniete'; }); }, label: 'Usuń usunięte ćwiczenie z treningu', title: 'Usunąć z treningu?', count: () => S().active!.exercises.length },
];
describe('macierz: każde miejsce usuwania — „Nie” zostawia, „Usuń” usuwa jeden element', () => {
  test.each(PLACES.map(p => [p.name, p] as const))('%s', async (_n, p) => {
    await p.setup(); const n0 = p.count();
    await swipeDelete(p.label); expect(lastAlert().title).toBe(p.title);
    await act(async () => { pressAlert(p.title, 'Nie'); }); await flushAll(5); expect(p.count()).toBe(n0);
    await swipeDelete(p.label); await act(async () => { pressAlert(p.title, 'Usuń'); }); await flushAll(10); expect(p.count()).toBe(n0 - 1);
  });
});

describe('bez przycisków „Usuń” (decyzja: przyciski wypadają)', () => {
  test('trening, szablon, szczegóły sesji, ćwiczenie, miejsce: brak „usuń”, „− seria”, „Usuń sesję”, „Usuń ćwiczenie”, „Usuń”, „✕” gumy', async () => {
    let tid = ''; let lid = ''; let wid = '';
    await boot(() => { tid = tplWith().id; lid = addLocation('gym').id; wid = addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]).id; store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0); });
    const none = () => { for (const t of ['usuń', '− seria', 'Usuń sesję', 'Usuń ćwiczenie', 'Usuń']) expect([t, screen.queryAllByText(t).length]).toEqual([t, 0]); };
    none(); for (const u of [`/template/${tid}`, `/history/${wid}`, `/exercise/${ex('Back Squat').id}`, `/more/location/${lid}`, '/more/bands']) { await go(u); await flushAll(10); none(); }
    expect(screen.queryByText('✕')).toBeNull();
  });
  test('ostatnia seria bloku i miejsce główne (gdy jest inne) — bez gestu', async () => {
    await boot(() => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); addLocation('home'); addLocation('gym'); });
    expect(deleteActions().filter(l => l.startsWith('Usuń serię'))).toEqual([]);
    await go('/more/locations'); await flushAll(10); expect(deleteActions().filter(l => l.startsWith('Usuń miejsce'))).toHaveLength(1);
  });
});

describe('języki', () => {
  test('English: etykiety gestu i potwierdzenia po angielsku', async () => {
    await fresh(undefined, 'en'); tplWith(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'en', url: '/templates' }); await flushAll(10);
    expect(deleteActions()).toEqual(['Delete template: T1']);
    await swipeDelete('Delete template: T1'); expect(lastAlert()).toMatchObject({ title: 'Delete template?' }); expect(lastAlert().buttons!.map((b: any) => b.text)).toEqual(['No', 'Delete']);
  });
});
