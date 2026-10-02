/* T-010 (02.10.2026): kolejność ćwiczeń przeciąganiem — logika bloków, indeks upuszczenia i ekran (gest, VoiceOver, trening w toku). */
import fc from 'fast-check';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { dropIndex } from '@/components/DragList';
import { fresh, ex } from './helpers';
import { renderApp, flushAll, screen, go, act, fireEvent, tap } from './app';

jest.setTimeout(30000);
type It = { id: string; groupId: string | null };
const L = (spec: string): It[] => spec.split(' ').map(x => ({ id: x.replace(/[A-Z]$/, ''), groupId: /[A-Z]$/.test(x) ? x.slice(-1) : null }));
const ids = (l: It[]) => l.map(x => x.id).join(' ');

describe('logika bloków', () => {
  beforeEach(async () => { await fresh(); });
  test('blockRanges: superset to jeden blok', () => { expect(store.blockRanges(L('a bA cA d eB fB'))).toEqual([[0, 0], [1, 2], [3, 3], [4, 5]]); });
  test('moveBlockOf: pojedyncze ćwiczenie nie wchodzi w środek supersetu, superset jedzie w całości', () => {
    let l = L('a bA cA d'); expect(store.moveBlockOf(l, 'a', 1)).toBe(true); expect(ids(l)).toBe('b c a d'); expect(l.map(x => x.groupId)).toEqual(['A', 'A', null, null]);
    l = L('a bA cA d'); store.moveBlockOf(l, 'c', 2); expect(ids(l)).toBe('a d b c'); expect(l[2].groupId).toBe(l[3].groupId);
    l = L('a bA cA d'); expect(store.moveBlockOf(l, 'b', 1)).toBe(false); expect(store.moveBlockOf(l, 'zz', 0)).toBe(false); expect(store.moveBlockOf(l, 'a', NaN)).toBe(false);
    l = L('a b c'); store.moveBlockOf(l, 'a', 99); expect(ids(l)).toBe('b c a');
  });
  test('moveInGroup: tylko w obrębie supersetu', () => {
    const l = L('a bA cA dA e'); expect(store.moveInGroup(l, 'd', 0)).toBe(true); expect(ids(l)).toBe('a d b c e');
    expect(store.moveInGroup(l, 'b', 9)).toBe(true); expect(ids(l)).toBe('a d c b e'); expect(store.moveInGroup(l, 'a', 1)).toBe(false);
  });
  const arbList = fc.array(fc.integer({ min: 0, max: 3 }), { minLength: 1, maxLength: 9 }).map(gs => { const l = gs.map((g, i) => ({ id: 'i' + i, groupId: g ? 'g' + g : null })); store.normalizeGroups(l); return l; });
  const members = (l: It[]) => { const m = new Map<string, string>(); l.forEach(x => { if (x.groupId) m.set(x.id, l.filter(y => y.groupId === x.groupId).map(y => y.id).sort().join()); }); return m; };
  test('własność: przesunięcia to permutacje, supersety zachowują skład i ciągłość, w moveBlockOf także kolejność w grupie', () => {
    fc.assert(fc.property(arbList, fc.nat(20), fc.integer({ min: -2, max: 12 }), fc.boolean(), (l0, pick, to, inGroup) => {
      const l = l0.map(x => ({ ...x })); const id = l[pick % l.length].id; const before = members(l); 
      if (inGroup) store.moveInGroup(l, id, to); else store.moveBlockOf(l, id, to);
      expect(l.map(x => x.id).sort()).toEqual(l0.map(x => x.id).sort()); expect(members(l)).toEqual(before);
      const g = [...new Set(l.map(x => x.groupId).filter(Boolean))]; for (const x of g) { const idx = l.flatMap((y, i) => (y.groupId === x ? [i] : [])); expect(idx[idx.length - 1] - idx[0]).toBe(idx.length - 1); }
      if (!inGroup) { const order = (xs: It[]) => g.map(x => xs.filter(y => y.groupId === x).map(y => y.id).join()); expect(order(l)).toEqual(order(l0)); }
      else expect(store.blockRanges(l).length).toBe(store.blockRanges(l0).length);
    }), { numRuns: 300 });
  });
});

describe('dropIndex', () => {
  test('przypadki', () => {
    const h = [50, 50, 50, 50];
    expect(dropIndex(h, 1, 0)).toBe(1); expect(dropIndex(h, 1, 24)).toBe(1); expect(dropIndex(h, 1, 26)).toBe(2); expect(dropIndex(h, 1, 76)).toBe(3); expect(dropIndex(h, 1, 999)).toBe(3);
    expect(dropIndex(h, 2, -26)).toBe(1); expect(dropIndex(h, 2, -999)).toBe(0); expect(dropIndex([40, 120, 40], 0, 61)).toBe(1); expect(dropIndex([40, 120, 40], 0, 59)).toBe(0); expect(dropIndex([200, 40, 40], 0, 19)).toBe(0); expect(dropIndex([200, 40, 40], 0, 21)).toBe(1); expect(dropIndex([200, 40, 40], 0, 61)).toBe(2);
    expect(dropIndex(h, 9, 10)).toBe(9); expect(dropIndex(h, 1, NaN)).toBe(1);
  });
  test('własność: w zakresie i monotoniczny względem przesunięcia', () => {
    fc.assert(fc.property(fc.array(fc.integer({ min: 1, max: 200 }), { minLength: 1, maxLength: 10 }), fc.nat(9), fc.integer({ min: -2000, max: 2000 }), fc.integer({ min: 0, max: 300 }), (h, f, dy, more) => {
      const from = f % h.length; const a = dropIndex(h, from, dy), b = dropIndex(h, from, dy + more);
      expect(a).toBeGreaterThanOrEqual(0); expect(a).toBeLessThan(h.length); expect(b).toBeGreaterThanOrEqual(a);
    }));
  });
});

/* Gest: PanResponder liczy dy z touchHistory zdarzenia — budujemy je jak natywny moduł dotyku. */
let ts = 1000;
const touch = (y: number, prevY: number) => { ts += 16; return { touchHistory: { numberActiveTouches: 1, indexOfSingleActiveTouch: 0, mostRecentTimeStamp: ts, touchBank: [{ touchActive: true, startPageX: 10, startPageY: prevY, startTimeStamp: ts, currentPageX: 10, currentPageY: y, currentTimeStamp: ts, previousPageX: 10, previousPageY: prevY, previousTimeStamp: ts - 16 }] }, nativeEvent: { touches: [{}], changedTouches: [{}], pageY: y } }; };
async function drag(testID: string, dy: number) {
  const h = screen.getByTestId(testID); let y = 300;
  await act(async () => { h.props.onResponderGrant(touch(y, y)); });
  for (let k = 0; k < 5; k++) { const ny = y + dy / 5; await act(async () => { h.props.onResponderMove(touch(ny, y)); }); y = ny; }
  await act(async () => { h.props.onResponderRelease(touch(y, y)); }); await flushAll(200);
}
/** Wysokości wierszy (onLayout nie odpala się w testach): rodzic uchwytu z onLayout. */
function layoutRows(h: number) { for (const el of screen.getAllByTestId(/^drag-/)) { let p: any = el.parent; while (p && !p.props.onLayout) p = p.parent; if (p) fireEvent(p, 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 300, height: h } } }); } }

describe('ekran kolejności', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  const mkTpl = () => { const tpl = store.newTemplate(); tpl.name = 'Plan';
    for (const [k, n, g] of [['BackSquat', 'Back Squat', null], ['BenchPress', 'Bench Press (sztanga)', 'G'], ['PullUp', 'Pull Up', 'G'], ['Deadlift', 'Leg Press', null]] as const) tpl.items.push({ id: 'it-' + k, exerciseId: ex(n).id, sets: 3, repMin: 5, repMax: 8, restSec: null, startWeight: '', targetSec: '', groupId: g });
    store.save(tpl); return tpl; };

  test('szablon: przeciągnięcie pojedynczego ćwiczenia za superset; superset w całości; kolejność w supersecie', async () => {
    await fresh(); const tpl = mkTpl(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) });
    await go(`/template/${tpl.id}`); await flushAll(20); await tap(screen.getByText('≡ Kolejność')); await flushAll(50);
    expect(screen.getByText('SS A')).toBeTruthy(); layoutRows(60);
    const items = () => store.getState().templates.find(x => x.id === tpl.id)!.items;
    await drag('drag-i:it-BackSquat', 50); expect(items().map(x => x.id)).toEqual(['it-BenchPress', 'it-PullUp', 'it-BackSquat', 'it-Deadlift']);
    expect(items()[0].groupId).toBe(items()[1].groupId); expect(items()[0].groupId).not.toBeNull();
    layoutRows(60); const g = items()[0].groupId!; await drag('drag-g:' + g, 200); expect(items().map(x => x.id)).toEqual(['it-BackSquat', 'it-Deadlift', 'it-BenchPress', 'it-PullUp']);
    layoutRows(60); await drag('drag-i:it-PullUp', -70); expect(items().map(x => x.id)).toEqual(['it-BackSquat', 'it-Deadlift', 'it-PullUp', 'it-BenchPress']); expect(items()[2].groupId).toBe(g);
    layoutRows(60); await drag('drag-i:it-Deadlift', 10); expect(items()[1].id).toBe('it-Deadlift'); // za mało, by minąć środek sąsiada
  });

  test('VoiceOver: akcje „Przesuń wyżej/niżej” na uchwycie, wartość „n z m”', async () => {
    await fresh(); const tpl = mkTpl(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) });
    await go(`/reorder?target=template:${tpl.id}`); await flushAll(50);
    const h = screen.getByTestId('drag-i:it-Deadlift'); expect(h.props.accessibilityLabel).toBe('Zmień kolejność: Leg Press'); expect(h.props.accessibilityValue.text).toBe('3 z 3');
    expect(h.props.accessibilityActions.map((a: { name: string }) => a.name)).toEqual(['up', 'decrement']);
    await act(async () => { fireEvent(h, 'accessibilityAction', { nativeEvent: { actionName: 'up' } }); }); await flushAll(10);
    expect(store.getState().templates.find(x => x.id === tpl.id)!.items.map(x => x.id)).toEqual(['it-BackSquat', 'it-Deadlift', 'it-BenchPress', 'it-PullUp']);
  });

  test('trening w toku: kolejność zmienia się, odhaczone serie, przerwa i stoper zostają przy swoich seriach', async () => {
    await fresh(); const tpl = mkTpl(); store.startFromTemplate(tpl); const a = store.getState().active!;
    store.toggleDone(0, 0); const s0 = a.exercises[0].sets[0].id; await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(20);
    await tap(screen.getByText('≡ Kolejność')); await flushAll(50); layoutRows(60);
    expect(screen.getByText('3 serie · ✓ 1')).toBeTruthy();
    await drag('drag-i:' + store.getState().active!.exercises[0].id, 200);
    const w = store.getState().active!; expect(w.exercises.map(e => store.getState().exercises.find(x => x.id === e.exerciseId)!.name)).toEqual(['Bench Press (sztanga)', 'Pull Up', 'Leg Press', 'Back Squat']);
    expect(w.exercises[3].sets[0]).toMatchObject({ id: s0, done: true }); expect(store.getState().templates.find(x => x.id === tpl.id)!.items[0].id).toBe('it-BackSquat'); // szablon nietknięty
    await tap(screen.getByText('Gotowe')); await flushAll(50); expect(screen.getByText('Zakończ trening i zapisz')).toBeTruthy();
  });

  test('cel znika w trakcie (trening zakończony w innym oknie) → komunikat zamiast pustej listy; jedno ćwiczenie → bez przycisku', async () => {
    await fresh(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) });
    await go('/reorder?target=active'); await flushAll(20); expect(screen.getByText('Nie ma treningu w toku.')).toBeTruthy();
    await go('/reorder?target=template:nope'); await flushAll(20); expect(screen.getByText('Nie ma takiego szablonu.')).toBeTruthy();
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); }); await go('/'); await flushAll(20);
    expect(screen.queryByText('≡ Kolejność')).toBeNull();
  });

  test('lista zmienia się pod palcem → przeciąganie przerwane, bez przesunięcia', async () => {
    await fresh(); const tpl = mkTpl(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) });
    await go(`/reorder?target=template:${tpl.id}`); await flushAll(50); layoutRows(60);
    const h = screen.getByTestId('drag-i:it-BackSquat'); await act(async () => { h.props.onResponderGrant(touch(300, 300)); h.props.onResponderMove(touch(400, 300)); });
    await act(async () => { const t2 = store.getState().templates.find(x => x.id === tpl.id)!; t2.items.splice(3, 1); store.save(t2); }); await flushAll(20);
    await act(async () => { h.props.onResponderRelease(touch(400, 400)); }); await flushAll(50);
    expect(store.getState().templates.find(x => x.id === tpl.id)!.items.map(x => x.id)).toEqual(['it-BackSquat', 'it-BenchPress', 'it-PullUp']);
  });

  test('przytrzymanie przy dolnej krawędzi przewija listę i przesuwa cel dalej niż sam ruch palca', async () => {
    await fresh(); const tpl = store.newTemplate(); const names = ['Back Squat', 'Pull Up', 'Plank', 'Chin Up', 'Leg Press', 'Push Up', 'Bieg', 'Bench Press (sztanga)'];
    names.forEach((n, i) => tpl.items.push({ id: 'r' + i, exerciseId: ex(n).id, sets: 3, repMin: 5, repMax: 8, restSec: null, startWeight: '', targetSec: '', groupId: null })); store.save(tpl);
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go(`/reorder?target=template:${tpl.id}`); await flushAll(50); layoutRows(60);
    let sv: any = screen.getByTestId('drag-i:r0').parent; while (sv && !sv.props.onContentSizeChange) sv = sv.parent;
    await act(async () => { sv.props.onLayout({ nativeEvent: { layout: { x: 0, y: 0, width: 300, height: 300 } } }); sv.props.onContentSizeChange(300, 900); });
    const h = screen.getByTestId('drag-i:r0'); await act(async () => { h.props.onResponderGrant(touch(30, 30)); h.props.onResponderMove(touch(290, 30)); });
    await flushAll(400); await act(async () => { h.props.onResponderMove(touch(200, 290)); }); await act(async () => { h.props.onResponderRelease(touch(200, 200)); }); await flushAll(50);
    const order = store.getState().templates.find(x => x.id === tpl.id)!.items.map(x => x.id); // sam palec: +170 px → miejsce 3; z przewinięciem — dalej
    expect(order.indexOf('r0')).toBeGreaterThan(3);
  });

  test('audyt: id grupy równe id ćwiczenia (ręcznie edytowany backup) — superset przeciąga się sam, nie pierwsze ćwiczenie', async () => {
    await fresh(); store.startEmpty(); for (const n of ['Back Squat', 'Pull Up', 'Plank', 'Chin Up']) store.addExerciseToActive(ex(n));
    const a = store.getState().active!; a.exercises.forEach((e, i) => { e.id = String(i + 1); }); a.exercises[2].groupId = '1'; a.exercises[3].groupId = '1'; store.save(a); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/reorder?target=active'); await flushAll(50); layoutRows(60);
    await drag('drag-g:1', -200); expect(store.getState().active!.exercises.map(e => e.id)).toEqual(['3', '4', '1', '2']);
  });
  test('audyt: rozerwana grupa w szablonie z importu porządkowana przy wczytaniu', async () => {
    const st = await fresh(); const tpl = store.newTemplate(); const mk = (id: string, g: string | null) => ({ id, exerciseId: ex('Back Squat').id, sets: 3, repMin: 5, repMax: 8, restSec: null, startWeight: '' as const, targetSec: '' as const, groupId: g });
    tpl.items.push(mk('a', 'G'), mk('x', null), mk('b', 'G')); store.save(tpl); await store.flush();
    await fresh(JSON.parse(JSON.stringify(st))); expect(store.getState().templates.find(x => x.id === tpl.id)!.items.map(x => x.groupId)).toEqual([null, null, null]);
  });
});
