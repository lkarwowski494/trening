/*
 * M1-audytor-generalny-026 (04-studio-projektowe-009, audyt M1 27.10.2026; poprawka 27.10.2026): kolejność ćwiczeń zmieniała się tylko przeciąganiem uchwytu „≡” — akcje
 * „Przesuń wyżej / niżej” były wyłącznie akcjami VoiceOver (podłoga „każdy gest ma alternatywę w postaci przycisku”, HIG Accessibility).
 * Po poprawce: przy każdym wierszu ekranu Kolejność widoczny przycisk „⋯” (jak menu ćwiczenia, docs/32 wzorzec 5; etykieta „Opcje ćwiczenia: {nazwa}”,
 * pole 44 pt) — arkusz akcji „Przesuń wyżej” / „Przesuń niżej” / „Anuluj” (wzorzec 9: kontekstowy wybór ≤ 3 opcje + Anuluj). Przesunięcie z menu daje ten sam
 * wynik co przeciągnięcie (ta sama funkcja zapisu), także dla supersetu w całości i w jego środku.
 */
import { StyleSheet } from 'react-native';
import * as store from '@/lib/store';
import { fresh, ex } from './helpers';
import { renderApp, flushAll, screen, go, act, fireEvent } from './app';

jest.setTimeout(30000);
type Sheet = { opts: { options: string[]; cancelButtonIndex: number; title?: string }; cb: (i: number) => void };
const sheets = () => (global as unknown as { __sheets: Sheet[] }).__sheets;
const mkTpl = () => { const tpl = store.newTemplate(); tpl.name = 'Plan';
  for (const [k, n, g] of [['BackSquat', 'Back Squat', null], ['BenchPress', 'Bench Press (sztanga)', 'G'], ['PullUp', 'Pull Up', 'G'], ['Deadlift', 'Leg Press', null]] as const) tpl.items.push({ id: 'it-' + k, exerciseId: ex(n).id, sets: 3, repMin: 5, repMax: 8, restSec: null, startWeight: '', targetSec: '', groupId: g });
  store.save(tpl); return tpl; };
const order = (id: string) => store.getState().templates.find(x => x.id === id)!.items.map(x => x.id);
let ts = 1000;
const touch = (y: number, prevY: number) => { ts += 16; return { touchHistory: { numberActiveTouches: 1, indexOfSingleActiveTouch: 0, mostRecentTimeStamp: ts, touchBank: [{ touchActive: true, startPageX: 10, startPageY: prevY, startTimeStamp: ts, currentPageX: 10, currentPageY: y, currentTimeStamp: ts, previousPageX: 10, previousPageY: prevY, previousTimeStamp: ts - 16 }] }, nativeEvent: { touches: [{}], changedTouches: [{}], pageY: y } }; };
async function drag(testID: string, dy: number) {
  const h = screen.getByTestId(testID); let y = 300;
  await act(async () => { h.props.onResponderGrant(touch(y, y)); });
  for (let k = 0; k < 5; k++) { const ny = y + dy / 5; await act(async () => { h.props.onResponderMove(touch(ny, y)); }); y = ny; }
  await act(async () => { h.props.onResponderRelease(touch(y, y)); }); await flushAll(200);
}
function layoutRows(h: number) { for (const el of screen.getAllByTestId(/^drag-/)) { let p: any = el.parent; while (p && !p.props.onLayout) p = p.parent; if (p) fireEvent(p, 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 300, height: h } } }); } }
const open = async (tplId: string) => { await go(`/reorder?target=template:${tplId}`); await flushAll(50); };
const menu = async (key: string) => { const n = sheets().length; await act(async () => { fireEvent.press(screen.getByTestId('move-menu-' + key)); }); expect(sheets().length).toBe(n + 1); return sheets().at(-1)!; };
const pick = async (s: Sheet, label: string) => { const i = s.opts.options.indexOf(label); expect(i).toBeGreaterThanOrEqual(0); await act(async () => { s.cb(i); }); await flushAll(20); };

describe('ekran Kolejność: przycisk zamiast gestu', () => {
  test('każdy wiersz (ćwiczenie, superset, ćwiczenie w supersecie) ma widoczny „⋯” z etykietą akcji i polem 44 pt', async () => {
    await fresh(); const tpl = mkTpl(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await open(tpl.id);
    const g = store.getState().templates.find(x => x.id === tpl.id)!.items[1].groupId!;
    for (const k of ['i:it-BackSquat', 'g:' + g, 'i:it-BenchPress', 'i:it-PullUp', 'i:it-Deadlift']) {
      const b = screen.getByTestId('move-menu-' + k); expect(b.props.accessibilityRole).toBe('button'); expect(b.props.accessibilityLabel).toMatch(/^Opcje ćwiczenia: /);
      const st = StyleSheet.flatten(b.props.style) as { minWidth?: number; minHeight?: number }; expect(st.minWidth).toBeGreaterThanOrEqual(44); expect(st.minHeight).toBeGreaterThanOrEqual(44);
    }
    expect(screen.getByTestId('move-menu-i:it-Deadlift').props.accessibilityLabel).toBe('Opcje ćwiczenia: Leg Press');
  });
  test('menu ma tylko możliwe kierunki i „Anuluj”: pierwszy — „Przesuń niżej”, środkowy — oba, ostatni — „Przesuń wyżej”; „Anuluj” nic nie zmienia', async () => {
    await fresh(); const tpl = mkTpl(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await open(tpl.id);
    const g = store.getState().templates.find(x => x.id === tpl.id)!.items[1].groupId!;
    expect((await menu('i:it-BackSquat')).opts.options).toEqual(['Przesuń niżej', 'Anuluj']);
    expect((await menu('g:' + g)).opts.options).toEqual(['Przesuń wyżej', 'Przesuń niżej', 'Anuluj']);
    const last = await menu('i:it-Deadlift'); expect(last.opts.options).toEqual(['Przesuń wyżej', 'Anuluj']); expect(last.opts.cancelButtonIndex).toBe(1); expect(last.opts.title).toBe('Leg Press');
    const before = order(tpl.id); await pick(last, 'Anuluj'); expect(order(tpl.id)).toEqual(before);
  });
  test('przesunięcie z menu = ten sam wynik co przeciągnięcie (ćwiczenie za superset, superset w całości, kolejność w supersecie)', async () => {
    /* przeciąganie (jak tests/reorder-t010.test.tsx) */
    await fresh(); const a = mkTpl(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await open(a.id); layoutRows(60);
    await drag('drag-i:it-BackSquat', 50); const d1 = order(a.id);
    layoutRows(60); const ga = store.getState().templates.find(x => x.id === a.id)!.items[0].groupId!; await drag('drag-g:' + ga, 50); const d2 = order(a.id);
    layoutRows(60); await drag('drag-i:it-PullUp', -50); const d3 = order(a.id);
    /* te same ruchy z menu */
    await fresh(); const b = mkTpl(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await open(b.id);
    await pick(await menu('i:it-BackSquat'), 'Przesuń niżej'); expect(order(b.id)).toEqual(d1);
    const gb = store.getState().templates.find(x => x.id === b.id)!.items[0].groupId!; await pick(await menu('g:' + gb), 'Przesuń niżej'); expect(order(b.id)).toEqual(d2);
    await pick(await menu('i:it-PullUp'), 'Przesuń wyżej'); expect(order(b.id)).toEqual(d3);
    expect(d1).toEqual(['it-BenchPress', 'it-PullUp', 'it-BackSquat', 'it-Deadlift']); expect(d2).toEqual(['it-BackSquat', 'it-BenchPress', 'it-PullUp', 'it-Deadlift']); expect(d3).toEqual(['it-BackSquat', 'it-PullUp', 'it-BenchPress', 'it-Deadlift']);
  });
  test('trening w toku: przesunięcie z menu zmienia kolejność w treningu, szablon zostaje', async () => {
    await fresh(); const tpl = mkTpl(); store.startFromTemplate(tpl); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/reorder?target=active'); await flushAll(50);
    const first = store.getState().active!.exercises[0].id; await pick(await menu('i:' + first), 'Przesuń niżej');
    expect(store.getState().active!.exercises.map(e => e.id).indexOf(first)).toBe(2); expect(order(tpl.id)[0]).toBe('it-BackSquat');
  });
});
