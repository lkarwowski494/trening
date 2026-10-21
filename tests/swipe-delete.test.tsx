/*
 * Usuwanie przesunięciem w lewo (decyzja właściciela 07.10.2026 wieczór, docs/18): wszędzie ten sam gest, zawsze z potwierdzeniem,
 * (od 21.10.2026 także przycisk „Usuń {obiekt}” na szczegółach — blok poniżej). Rodzaje (docs/20): logika (swipeDecision), ekran (każde miejsce: „Nie” zostawia, „Usuń” usuwa), macierz
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
import { renderApp, flushAll, screen, go, act, swipeDelete, deleteActions, openCard, type, startEdit, tplDraft, tap } from './app';

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
    expect(lastAlert()).toMatchObject({ title: 'Usunąć X?', msg: 'opis' }); expect(lastAlert().buttons!.map((b: any) => b.text)).toEqual(['Anuluj', 'Usuń']);
    await rtlAct(async () => { pressAlert('Usunąć X?', 'Anuluj'); }); expect(del).not.toHaveBeenCalled();
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
  { name: 'ćwiczenie (biblioteka)', setup: async () => { await boot(); await go('/exercises'); await flushAll(10); await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Back Squat'); /* N3: lista wirtualizowana — wiersz z dalszej partii przez szukanie */ }, label: 'Usuń z biblioteki: Back Squat', title: 'Usunąć ćwiczenie?', count: () => S().exercises.filter(e => !e.archived).length },
  { name: 'pomiar masy ciała (UI2-03)', setup: async () => { await boot(() => { store.addBodyMass(80, '2026-10-01'); store.addBodyMass(81, '2026-10-05'); }); await go('/more/bodymass'); await flushAll(10); }, label: /^Usuń pomiar: /, title: 'Usunąć pomiar?', count: () => store.bodyMassLog().length },
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
    await act(async () => { pressAlert(p.title, 'Anuluj'); }); await flushAll(5); expect(p.count()).toBe(n0);
    await swipeDelete(p.label); await act(async () => { pressAlert(p.title, 'Usuń'); }); await flushAll(10); expect(p.count()).toBe(n0 - 1);
  });
});

/*
 * ZM-04 / W2 (decyzja właściciela 21.10.2026, docs/18 M3; zastępuje „bez przycisków Usuń” z 07.10.2026): ekran szczegółów obiektu ma na dole jeden przycisk
 * „Usuń {obiekt}” (DeleteButton), który otwiera TO SAMO okno co gest przesunięcia na liście (ten sam tytuł, opis i [Anuluj, Usuń]); gest zostaje skrótem.
 * LISTA TRAS poniżej jest jedynym miejscem do rozszerzania: partie p4 (szablon, ćwiczenie własne) i p5 (miejsce) dopisują swoje wiersze do DELETE_ROUTES
 * i usuwają je z BEZ_PRZYCISKU; trasy spoza listy nadal nie mają żadnego „Usuń”. W treningu nadal bez „− seria”.
 */
type DeleteRoute = { name: string; url: (ids: Ids) => string; button: string; title: string; count: () => number; /** okno z gestu listy — ta sama treść */ gesture: { path: string; label: RegExp } };
type Ids = { tid: string; lid: string; wid: string };
const DELETE_ROUTES: DeleteRoute[] = [
  { name: '/history/[id] (sesja)', url: ids => `/history/${ids.wid}`, button: 'Usuń sesję', title: 'Usunąć tę sesję z historii?', count: () => S().workouts.length, gesture: { path: '/history', label: /^Usuń sesję: / } },
  /* M3 p4 (scalenie): szablon — przycisk na dole podglądu; ćwiczenie własne ma osobny test tests/m3-p4-delete.test.tsx (wymaga ćwiczenia własnego w danych) */
  { name: '/template/[id] (szablon)', url: ids => `/template/${ids.tid}`, button: 'Usuń szablon', title: 'Usunąć szablon?', count: () => S().templates.length, gesture: { path: '/templates', label: /^Usuń szablon: / } },
  /* M3 p5 (scalenie): miejsce — przycisk na dole szczegółów */
  { name: '/more/location/[id] (miejsce)', url: ids => `/more/location/${ids.lid}`, button: 'Usuń miejsce', title: 'Usunąć miejsce?', count: () => S().settings.locations.length, gesture: { path: '/more/locations', label: /^Usuń miejsce: / } },
];
/** Trasy szczegółów / list z usuwaniem, które jeszcze nie mają przycisku (dopisują je p4 i p5); nic na nich nie nazywa się „Usuń …” ani „− seria”. */
/* po scaleniu p4/p5: ćwiczenie wbudowane bez przycisku (decyzja STOP 3), masa ciała i gumy — „Edytuj” w nagłówku zamiast przycisku „Usuń …” (W1 b) */
const BEZ_PRZYCISKU: ((ids: Ids) => string)[] = [() => `/exercise/${ex('Back Squat').id}`, () => '/more/bands', () => '/more/bodymass'];
describe('zgodność z listą tras „Usuń {obiekt}” (W2, ZM-04)', () => {
  const ids: Ids = { tid: '', lid: '', wid: '' };
  const setup = async () => { await boot(() => { ids.tid = tplWith().id; ids.lid = addLocation('gym').id; ids.wid = addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]).id; store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0); store.addBodyMass(80, '2026-10-01'); }); };
  const none = (words: string[]) => { for (const t of words) expect([t, screen.queryAllByText(t).length]).toEqual([t, 0]); };
  test('trening w toku: bez „usuń”, „− seria”, „Usuń sesję”, „Usuń ćwiczenie”, „Usuń”, „✕” gumy', async () => {
    await setup(); none(['usuń', '− seria', 'Usuń sesję', 'Usuń ćwiczenie', 'Usuń']); expect(screen.queryByText('✕')).toBeNull();
  });
  test.each(DELETE_ROUTES.map(r => [r.name, r] as const))('%s: dokładnie jeden przycisk, to samo okno co gest, „Anuluj” zostawia, „Usuń” usuwa', async (_n, r) => {
    await setup(); await go(r.url(ids)); await flushAll(10);
    const btns = screen.getAllByText(r.button); expect(btns).toHaveLength(1); expect(screen.getAllByTestId('delete-object')).toHaveLength(1);
    /* to samo okno co gest na liście */
    await go(r.gesture.path); await flushAll(10); await swipeDelete(r.gesture.label); const g = lastAlert(); await act(async () => { pressAlert(r.title, 'Anuluj'); }); await flushAll(5);
    await go(r.url(ids)); await flushAll(10); const n0 = r.count(); const before = global.__alerts.length;
    await tap(screen.getByTestId('delete-object')); expect(global.__alerts.length).toBe(before + 1); const a = lastAlert();
    expect([a.title, a.msg, a.buttons!.map((b: any) => [b.text, b.style])]).toEqual([g.title, g.msg, g.buttons!.map((b: any) => [b.text, b.style])]);
    expect(a.buttons!.map((b: any) => b.text)).toEqual(['Anuluj', 'Usuń']);
    await act(async () => { pressAlert(r.title, 'Anuluj'); }); await flushAll(5); expect(r.count()).toBe(n0);
    await tap(screen.getByTestId('delete-object')); await act(async () => { pressAlert(r.title, 'Usuń'); }); await flushAll(10); expect(r.count()).toBe(n0 - 1);
  });
  test('trasy bez przycisku (jeszcze nie p3): brak „usuń”, „Usuń sesję”, „Usuń ćwiczenie”, „Usuń”', async () => {
    await setup(); for (const u of BEZ_PRZYCISKU) { await go(u(ids)); await flushAll(10); none(['usuń', '− seria', 'Usuń sesję', 'Usuń ćwiczenie', 'Usuń']); }
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
    await swipeDelete('Delete template: T1'); expect(lastAlert()).toMatchObject({ title: 'Delete template?' }); expect(lastAlert().buttons!.map((b: any) => b.text)).toEqual(['Cancel', 'Delete']);
  });
});

/*
 * 04-studio-projektowe-003 (M3, weryfikacja wyglądu 21.10.2026; docs/32 wzorzec 5, zmiana 21.10.2026): usuwanie poza treningiem miało w edytorze szablonu,
 * edycji sesji i „Inne plany” TYLKO gest. Teraz widoczna droga bez gestu do TEGO SAMEGO okna `confirmDelete`:
 * „Usuń serię” w menu serii, „Usuń ćwiczenie” w „⋯” ćwiczenia, „Usuń” przy zamienniku, „Usuń plan” na dole ekranu zapisanego planu. Gest zostaje skrótem.
 */
const G = global as unknown as { __sheets: { opts: { options: string[]; destructiveButtonIndex?: number } }[]; __pickSheet: (i: number) => void };
const sheet = () => G.__sheets[G.__sheets.length - 1].opts;
const dialog = () => { const a = lastAlert(); return [a.title, a.msg, a.buttons!.map((b: any) => [b.text, b.style])]; };
const items = (ids: [string, string]) => [{ id: ids[0], exerciseId: ex('Back Squat').id, sets: 2, repMin: null, repMax: null, restSec: null, startWeight: '' as const, targetSec: '' as const, groupId: null }, { id: ids[1], exerciseId: ex('Plank').id, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: '' as const, targetSec: '' as const, groupId: null }];

describe('droga bez gestu (04-studio-projektowe-003): to samo okno co gest', () => {
  const tplEdit = async () => { let id = ''; await boot(() => { id = tplWith().id; }); G.__sheets.length = 0; await go(`/template/${id}`); await flushAll(10); await startEdit(); await openCard(0); return id; };
  const cnt = (id: string, k = 0) => store.tplRows((tplDraft(id) ?? S().templates.find(x => x.id === id)!).items[k]).length;
  test('edytor szablonu, menu serii: „Usuń serię” przed „Anuluj” (destrukcyjne); okno jak z gestu; „Anuluj” zostawia, „Usuń” usuwa', async () => {
    const id = await tplEdit(); await tap(screen.getAllByLabelText(/^Seria 2, typ/)[0]); const o = sheet();
    expect(o.options.slice(-2)).toEqual(['Usuń serię', 'Anuluj']); expect(o.destructiveButtonIndex).toBe(o.options.length - 2);
    await act(async () => { G.__pickSheet(o.options.length - 2); }); await flushAll(5); const viaMenu = dialog();
    await swipeDelete('Usuń serię 2 — Back Squat'); expect(viaMenu).toEqual(dialog()); expect(lastAlert().title).toBe('Usunąć serię?');
    await act(async () => { pressAlert('Usunąć serię?', 'Anuluj'); }); await flushAll(5); expect(cnt(id)).toBe(2);
    await tap(screen.getAllByLabelText(/^Seria 2, typ/)[0]); await act(async () => { G.__pickSheet(sheet().options.length - 2); }); await flushAll(5);
    await act(async () => { pressAlert('Usunąć serię?', 'Usuń'); }); await flushAll(10); expect(cnt(id)).toBe(1);
  });
  test('edytor szablonu: ostatnia seria bloku — z menu to samo wyjaśnienie co z gestu (jedyny przycisk „OK”), nic nie jest usuwane', async () => {
    let id = ''; await boot(() => { id = tplWith().id; }); G.__sheets.length = 0; await go(`/template/${id}`); await flushAll(10); await startEdit(); await openCard(1);
    await tap(screen.getAllByLabelText(/^Seria 1, typ/)[0]); await act(async () => { G.__pickSheet(sheet().options.length - 2); }); await flushAll(5);
    const { lastSetBlock } = require('@/components/SwipeRow'); expect(lastAlert().title).toBe(lastSetBlock().title); expect(lastAlert().buttons!.map((b: any) => b.text)).toEqual(['OK']); expect(cnt(id, 1)).toBe(1);
  });
  test('edytor szablonu, „⋯” ćwiczenia: „Usuń ćwiczenie” → okno „Usunąć z szablonu?” jak z gestu; „Usuń” usuwa pozycję', async () => {
    const id = await tplEdit(); const btn = screen.getByTestId('tpl-item-menu-0'); expect(btn.props.accessibilityLabel).toBe('Opcje ćwiczenia: Back Squat'); expect(btn.props.accessibilityRole).toBe('button');
    await tap(btn); expect(sheet().options).toEqual(['Usuń ćwiczenie', 'Anuluj']); expect(sheet().destructiveButtonIndex).toBe(0);
    await act(async () => { G.__pickSheet(0); }); await flushAll(5); const viaMenu = dialog(); await swipeDelete('Usuń ćwiczenie: Back Squat'); expect(viaMenu).toEqual(dialog()); expect(lastAlert().title).toBe('Usunąć z szablonu?');
    await act(async () => { pressAlert('Usunąć z szablonu?', 'Anuluj'); }); await flushAll(5); expect((tplDraft(id) ?? S().templates[0]).items).toHaveLength(2);
    await tap(screen.getByTestId('tpl-item-menu-0')); await act(async () => { G.__pickSheet(0); }); await flushAll(5); await act(async () => { pressAlert('Usunąć z szablonu?', 'Usuń'); }); await flushAll(10); expect((tplDraft(id) ?? S().templates[0]).items).toHaveLength(1);
  });
  test('zamiennik w szablonie: przycisk „Usuń” (etykieta „Usuń zamiennik: …”) → to samo okno co gest', async () => {
    let id = ''; await boot(() => { const t = tplWith(); const loc = addLocation('gym'); t.items[0].alternates = [{ locationId: loc.id, exerciseId: ex('Plank').id, restSec: null }]; store.save(t); id = t.id; });
    await go(`/template/${id}`); await flushAll(10); await startEdit(); await openCard(0);
    const b = screen.getByLabelText(/^Usuń zamiennik: /); expect(b.props.accessibilityRole).toBe('button'); await tap(b); const viaButton = dialog(); expect(lastAlert().title).toBe('Usunąć zamiennik?');
    await act(async () => { pressAlert('Usunąć zamiennik?', 'Anuluj'); }); await flushAll(5); await swipeDelete(/^Usuń zamiennik: /); expect(viaButton).toEqual(dialog());
    await act(async () => { pressAlert('Usunąć zamiennik?', 'Anuluj'); }); await flushAll(5); await tap(screen.getByLabelText(/^Usuń zamiennik: /)); await act(async () => { pressAlert('Usunąć zamiennik?', 'Usuń'); }); await flushAll(10);
    expect((tplDraft(id) ?? S().templates[0]).items[0].alternates ?? []).toHaveLength(0);
  });
  const editSession = async () => { let wid = ''; await boot(() => { wid = addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]], ['Plank', [{ durationSec: 30 }]]]).id; }); G.__sheets.length = 0; await go(`/history/edit/${wid}`); await flushAll(20); return wid; };
  test('edycja sesji, menu serii: „Usuń serię” przed „Anuluj”; okno jak z gestu; „Usuń” usuwa serię', async () => {
    await editSession(); const nRows = () => deleteActions().filter(l => l.startsWith('Usuń serię')).length; const n0 = nRows(); expect(n0).toBe(2);
    await tap(screen.getAllByLabelText(/^Seria 2, typ/)[0]); const o = sheet(); expect(o.options.slice(-2)).toEqual(['Usuń serię', 'Anuluj']); expect(o.destructiveButtonIndex).toBe(o.options.length - 2);
    await act(async () => { G.__pickSheet(o.options.length - 2); }); await flushAll(5); const viaMenu = dialog(); await swipeDelete(/^Usuń serię 2 — Back Squat/); expect(viaMenu).toEqual(dialog());
    await act(async () => { pressAlert('Usunąć serię?', 'Anuluj'); }); await flushAll(5); expect(nRows()).toBe(n0);
    await tap(screen.getAllByLabelText(/^Seria 2, typ/)[0]); await act(async () => { G.__pickSheet(sheet().options.length - 2); }); await flushAll(5); await act(async () => { pressAlert('Usunąć serię?', 'Usuń'); }); await flushAll(10); expect(nRows()).toBe(0);
  });
  test('edycja sesji, „⋯” ćwiczenia: „Usuń ćwiczenie” → „Usunąć z treningu?” jak z gestu; „Usuń” usuwa ćwiczenie', async () => {
    await editSession(); const exs = () => deleteActions().filter(l => l.startsWith('Usuń ćwiczenie')).length; expect(exs()).toBe(2);
    const btn = screen.getByTestId('edit-ex-menu-0'); expect(btn.props.accessibilityLabel).toBe('Opcje ćwiczenia: Back Squat'); await tap(btn); expect(sheet().options).toEqual(['Usuń ćwiczenie', 'Anuluj']);
    await act(async () => { G.__pickSheet(0); }); await flushAll(5); const viaMenu = dialog(); await swipeDelete('Usuń ćwiczenie: Back Squat'); expect(viaMenu).toEqual(dialog()); expect(lastAlert().title).toBe('Usunąć z treningu?');
    await act(async () => { pressAlert('Usunąć z treningu?', 'Anuluj'); }); await flushAll(5); expect(exs()).toBe(2);
    await tap(screen.getByTestId('edit-ex-menu-0')); await act(async () => { G.__pickSheet(0); }); await flushAll(5); await act(async () => { pressAlert('Usunąć z treningu?', 'Usuń'); }); await flushAll(10); expect(exs()).toBe(1);
  });
  test('zapisany plan (/plan?id=): przycisk „Usuń plan” na dole — to samo okno co gest na liście „Inne plany”; „Usuń” usuwa plan i wraca', async () => {
    let pid = ''; await boot(() => { const { newPlan } = require('@/lib/plan'); pid = newPlan(); });
    await go('/plan'); await flushAll(10); await swipeDelete(/^Usuń plan: /); const viaGesture = dialog(); await act(async () => { pressAlert('Usunąć ten plan?', 'Anuluj'); }); await flushAll(5);
    await go(`/plan?id=${pid}`); await flushAll(10); expect(screen.getAllByText('Usuń plan')).toHaveLength(1); const n0 = require('@/lib/plan').savedPlans().length;
    await tap(screen.getByTestId('delete-object')); expect(dialog()).toEqual(viaGesture); await act(async () => { pressAlert('Usunąć ten plan?', 'Anuluj'); }); await flushAll(5); expect(require('@/lib/plan').savedPlans()).toHaveLength(n0);
    await tap(screen.getByTestId('delete-object')); await act(async () => { pressAlert('Usunąć ten plan?', 'Usuń'); }); await flushAll(10); expect(require('@/lib/plan').savedPlans()).toHaveLength(n0 - 1);
  });
  test('English: etykiety menu i przycisku po angielsku', async () => {
    await fresh(undefined, 'en'); const t = tplWith(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'en', url: `/template/${t.id}` }); await flushAll(10); await startEdit(); await openCard(0);
    await tap(screen.getByTestId('tpl-item-menu-0')); expect(sheet().options).toEqual(['Delete exercise', 'Cancel']);
    await tap(screen.getAllByLabelText(/^Set 2, type/)[0]); expect(sheet().options.slice(-2)).toEqual(['Delete set', 'Cancel']);
  });
});
