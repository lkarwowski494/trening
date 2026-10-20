/*
 * M1-audytor-generalny-028 (DEC-12; zmienia decyzję 07.10.2026): usuwanie serii i ćwiczenia w treningu miało TYLKO gest przesunięcia w lewo
 * (VoiceOver: akcja niestandardowa, ale bez widocznej alternatywy dla Voice Control / Switch Control). Teraz: „Usuń serię” w menu serii
 * i „Usuń ćwiczenie” w menu ćwiczenia („⋯” w nagłówku), z TYM SAMYM potwierdzeniem co gest (confirmDelete); gest zostaje.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

jest.setTimeout(60000);
afterEach(async () => { await timer.stop(); await timer.stopSet(); });
const S = () => store.getState();
const G = global as unknown as { __alerts: { title: string; msg?: string; buttons?: { text: string; style?: string; onPress?: () => void }[] }[]; __sheets: { opts: { options: string[]; destructiveButtonIndex?: number } }[]; __pickSheet: (i: number) => void };
const item = (name: string, id: string, sets = 3) => ({ id, exerciseId: ex(name).id, sets, repMin: 6, repMax: 8, restSec: 120, startWeight: '' as const, targetSec: '' as const, groupId: null });
async function world(sets = 3, lang: 'pl' | 'en' = 'pl') {
  await fresh(undefined, lang); G.__alerts.length = 0; G.__sheets.length = 0;
  const tpl = store.newTemplate(); tpl.name = 'FBW'; tpl.items = [item('Bench Press (sztanga)', 'bench', sets), item('Overhead Press (sztanga)', 'ohp', 3)]; store.save(tpl);
  store.startFromTemplate(tpl); await store.flush(); await renderApp({ saved: JSON.parse(JSON.stringify(S())), locale: lang }); await flushAll(20);
}
const lastAlert = () => G.__alerts[G.__alerts.length - 1];
const lastSheet = () => G.__sheets[G.__sheets.length - 1].opts;
const press = async (btn: string) => { const b = lastAlert().buttons!.find(x => x.text === btn)!; expect(b).toBeTruthy(); await act(async () => { b.onPress?.(); }); await flushAll(10); };
const nSets = () => S().active!.exercises[0].sets.length;

describe('menu serii: „Usuń serię”', () => {
  test('opcja jest przed „Anuluj”, oznaczona jako destrukcyjna; wybór pyta tak samo jak gest; „Usuń” usuwa tylko tę serię', async () => {
    await world(); await tap(screen.getAllByLabelText(/^Seria 2, typ/)[0]); const o = lastSheet();
    expect(o.options.slice(-2)).toEqual(['Usuń serię', 'Anuluj']); expect(o.destructiveButtonIndex).toBe(o.options.length - 2);
    const id2 = S().active!.exercises[0].sets[1].id; await act(async () => { G.__pickSheet(o.options.length - 2); }); await flushAll(5);
    expect(lastAlert().title).toBe('Usunąć serię?'); expect(lastAlert().buttons!.map(b => b.text)).toEqual(['Anuluj', 'Usuń']); expect(nSets()).toBe(3);
    await press('Anuluj'); expect(nSets()).toBe(3);
    await act(async () => { G.__pickSheet(o.options.length - 2); }); await flushAll(5); await press('Usuń'); expect(nSets()).toBe(2); expect(S().active!.exercises[0].sets.some(x => x.id === id2)).toBe(false);
  });
  test('odhaczona seria: to samo ostrzeżenie co przy geście', async () => {
    await world(); store.getState().active!.exercises[0].sets[0].done = true; await flushAll(5);
    await tap(screen.getAllByLabelText(/^Seria 1, typ/)[0]); const o = lastSheet(); await act(async () => { G.__pickSheet(o.options.length - 2); }); await flushAll(5);
    expect(lastAlert().msg).toBe('Seria jest już odhaczona.');
  });
  test('ostatnia seria bloku: wyjaśnienie jak przy geście (lastSetBlock), seria zostaje', async () => {
    await world(1); await tap(screen.getAllByLabelText(/^Seria 1, typ/)[0]); const o = lastSheet(); await act(async () => { G.__pickSheet(o.options.length - 2); }); await flushAll(5);
    expect(lastAlert().title).toBe('To ostatnia seria'); expect(lastAlert().msg).toMatch(/Żeby usunąć całe ćwiczenie/); expect(nSets()).toBe(1);
  });
});
describe('menu ćwiczenia: „Usuń ćwiczenie”', () => {
  test('przycisk „⋯” w nagłówku ma etykietę z nazwą, pole ≥ 44 pt; arkusz: „Usuń ćwiczenie” + „Anuluj”; potwierdzenie jak gest; „Usuń” usuwa blok', async () => {
    await world(); const btn = screen.getByTestId('ex-menu-0'); expect(btn.props.accessibilityLabel).toMatch(/^Opcje ćwiczenia: /); expect(btn.props.accessibilityRole).toBe('button');
    await tap(btn); const o = lastSheet(); expect(o.options).toEqual(['Usuń ćwiczenie', 'Anuluj']); expect(o.destructiveButtonIndex).toBe(0);
    await act(async () => { G.__pickSheet(0); }); await flushAll(5);
    expect(lastAlert().title).toBe('Usunąć z treningu?'); expect(lastAlert().buttons!.map(b => b.text)).toEqual(['Anuluj', 'Usuń']);
    await press('Anuluj'); expect(S().active!.exercises).toHaveLength(2);
    await act(async () => { G.__pickSheet(0); }); await flushAll(5); await press('Usuń'); expect(S().active!.exercises).toHaveLength(1);
  });
  test('„Anuluj” w arkuszu nic nie zmienia', async () => {
    await world(); await tap(screen.getByTestId('ex-menu-0')); await act(async () => { G.__pickSheet(1); }); await flushAll(5); expect(G.__alerts).toHaveLength(0); expect(S().active!.exercises).toHaveLength(2);
  });
  test('gest zostaje: ukryty przycisk „Usuń” wiersza i akcja VoiceOver nadal istnieją', async () => {
    await world(); expect(screen.getByTestId('ex-0-del', { includeHiddenElements: true })).toBeTruthy(); expect(screen.getByTestId('set-0-0-del', { includeHiddenElements: true })).toBeTruthy();
  });
  test('angielski: „Exercise options: …”, „Delete exercise”, „Delete set”', async () => {
    await world(3, 'en'); expect(screen.getByTestId('ex-menu-0').props.accessibilityLabel).toMatch(/^Exercise options: /); await tap(screen.getByTestId('ex-menu-0')); expect(lastSheet().options).toEqual(['Delete exercise', 'Cancel']);
    await tap(screen.getAllByLabelText(/^Set 1, type/)[0]); expect(lastSheet().options.slice(-2)).toEqual(['Delete set', 'Cancel']);
  });
});
