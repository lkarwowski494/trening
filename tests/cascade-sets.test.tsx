/* Decyzja właściciela 11.10.2026 (pkt 6, wariant A): autouzupełnianie serii — kaskada w dół. Wartość wpisana w serii N przechodzi do kolejnych serii
 * TEGO SAMEGO rodzaju tam, gdzie pole jest puste albo ma jeszcze poprzednią wartość serii N; nie rusza serii odhaczonej ani wpisanej ręcznie inaczej.
 * Logika: cascadeDown, typeSetValue (trening), tplEditRow (szablon); ekrany: szablon, trening (Lista i skupiony). */
import * as store from '@/lib/store';
import { applyUnit, wIn } from '@/lib/units';
import { fresh, ex } from './helpers';
import { renderApp, flushAll, screen, go, tap, type as typeText, openCard, startEdit, saveEdit } from './app';
import type { WSet } from '@/lib/seed';

jest.setTimeout(60000);
afterEach(() => { applyUnit('kg'); });
const S = () => store.getState();
const RUN = () => S().exercises.find(e => (e.metric ?? 'weight_reps') === 'distance_time')!.name;
const BENCH = 'Bench Press (sztanga)';
/** Trening w toku: jeden blok, `kinds.length` serii o podanych rodzajach (puste). */
const live = async (name: string, kinds: ('normal' | 'warmup' | 'drop' | 'failure')[]) => {
  await fresh(); store.startEmpty(); store.addExerciseToActive(ex(name)); const e = S().active!.exercises[0];
  while (e.sets.length < kinds.length) store.addSet(0);
  while (e.sets.length > kinds.length) store.removeSet(0);
  e.sets.forEach((s, i) => { s.kind = kinds[i]; s.warmup = kinds[i] === 'warmup'; s.weight = ''; s.reps = ''; s.durationSec = ''; s.distanceM = ''; s.addKg = ''; delete s.pre; });
  return e;
};
const col = (e: { sets: WSet[] }, k: 'weight' | 'reps' | 'durationSec' | 'distanceM' | 'addKg') => e.sets.map(s => s[k]);
const N3 = ['normal', 'normal', 'normal'] as const;

describe('cascadeDown: logika czysta', () => {
  const row = (kind: any, v: number | '', done = false) => ({ kind, done, v });
  const run = (rows: ReturnType<typeof row>[], i: number, old: number | '', nv: number | '') => {
    rows[i].v = nv;
    return store.cascadeDown(rows, i, old, r => r.v, (r, x) => { r.v = x; });
  };
  test('przykład właściciela: 60 w 1. → 2. i 3.; 3. na 57,5 → 1. i 2. bez zmian; 1. na 62,5 → 2. idzie, 3. zostaje', () => {
    const rows = [row('normal', ''), row('normal', ''), row('normal', '')];
    expect(run(rows, 0, '', 60)).toBe(2); expect(rows.map(r => r.v)).toEqual([60, 60, 60]);
    expect(run(rows, 2, 60, 57.5)).toBe(0); /* kaskada z 3. nie ma dokąd iść i nie rusza wcześniejszych (tylko w dół) */
    expect(rows.map(r => r.v)).toEqual([60, 60, 57.5]);
    expect(run(rows, 0, 60, 62.5)).toBe(1); expect(rows.map(r => r.v)).toEqual([62.5, 62.5, 57.5]);
  });
  test('kaskada z serii środkowej nie rusza serii przed nią', () => {
    const rows = [row('normal', 50), row('normal', ''), row('normal', '')];
    run(rows, 1, '', 70); expect(rows.map(r => r.v)).toEqual([50, 70, 70]);
  });
  test('seria odhaczona nie jest nadpisywana, następne po niej tak', () => {
    const rows = [row('normal', ''), row('normal', 60, true), row('normal', '')];
    expect(run(rows, 0, '', 60)).toBe(1); expect(rows.map(r => r.v)).toEqual([60, 60, 60]);
    const r2 = [row('normal', 60), row('normal', 60, true), row('normal', 60)];
    run(r2, 0, 60, 65); expect(r2.map(r => r.v)).toEqual([65, 60, 65]);
  });
  test('rodzaje serii osobno: robocze i „do upadku” razem, rozgrzewka i drop osobno', () => {
    const rows = [row('warmup', ''), row('warmup', ''), row('normal', ''), row('failure', ''), row('drop', ''), row('drop', '')];
    run(rows, 2, '', 80); expect(rows.map(r => r.v)).toEqual(['', '', 80, 80, '', '']);
    run(rows, 0, '', 20); expect(rows.map(r => r.v)).toEqual([20, 20, 80, 80, '', '']);
    run(rows, 4, '', 50); expect(rows.map(r => r.v)).toEqual([20, 20, 80, 80, 50, 50]);
  });
  test('wartość ręcznie inna (także 0) zostaje; czyszczenie pola idzie dalej tylko do równych', () => {
    const rows = [row('normal', 60), row('normal', 0), row('normal', 60), row('normal', 70)];
    run(rows, 0, 60, 65); expect(rows.map(r => r.v)).toEqual([65, 0, 65, 70]);
    run(rows, 0, 65, ''); expect(rows.map(r => r.v)).toEqual(['', 0, '', 70]);
  });
  test('bez zmiany wartości nic nie robi; brak wiersza → 0', () => {
    const rows = [row('normal', 60), row('normal', 60)];
    expect(store.cascadeDown(rows, 0, 60, r => r.v, (r, x) => { r.v = x; })).toBe(0);
    expect(store.cascadeDown(rows, 5, 60, r => r.v, () => {})).toBe(0);
  });
  test('sameBand: ±kg z inną gumą nie dostaje cudzej asysty', () => {
    const rows: any[] = [{ kind: 'normal', v: '', bandId: 'a' }, { kind: 'normal', v: '', bandId: 'b' }, { kind: 'normal', v: '', bandId: 'a' }];
    rows[0].v = -20; store.cascadeDown(rows, 0, '', r => r.v, (r, x) => { r.v = x; }, true); expect(rows.map(r => r.v)).toEqual([-20, '', -20]);
  });
});

describe('trening w toku: typeSetValue', () => {
  test('przykład właściciela na ciężarze i powtórzeniach (kg)', async () => {
    const e = await live(BENCH, [...N3]);
    store.typeSetValue(0, 0, 'load', 60); store.typeSetValue(0, 0, 'reps', 10);
    expect(col(e, 'weight')).toEqual([60, 60, 60]); expect(col(e, 'reps')).toEqual([10, 10, 10]);
    store.typeSetValue(0, 2, 'load', 57.5); expect(col(e, 'weight')).toEqual([60, 60, 57.5]);
    store.typeSetValue(0, 0, 'load', 62.5); expect(col(e, 'weight')).toEqual([62.5, 62.5, 57.5]); expect(col(e, 'reps')).toEqual([10, 10, 10]);
  });
  test('pisanie cyfra po cyfrze (6 → 60 → 62 → 62,5) i wyczyszczenie pola nie zostawia resztek', async () => {
    const e = await live(BENCH, [...N3]);
    for (const v of [6, 60, 62, 62.5]) store.typeSetValue(0, 0, 'load', v);
    expect(col(e, 'weight')).toEqual([62.5, 62.5, 62.5]);
    store.typeSetValue(0, 0, 'load', ''); expect(col(e, 'weight')).toEqual(['', '', '']);
  });
  test('seria odhaczona nie jest nadpisywana; znacznik edited tylko u wpisującego', async () => {
    const e = await live(BENCH, [...N3]); e.sets[1].weight = 60; e.sets[1].reps = 8; store.toggleDone(0, 1);
    store.typeSetValue(0, 0, 'load', 60); store.typeSetValue(0, 0, 'load', 65);
    expect(col(e, 'weight')).toEqual([65, 60, 65]); expect(e.sets[0].edited).toBe(true); expect(e.sets[2].edited).toBeUndefined();
  });
  test('rodzaje: rozgrzewka, robocze i drop mają osobne kaskady', async () => {
    const e = await live(BENCH, ['warmup', 'warmup', 'normal', 'normal', 'drop', 'drop']);
    store.typeSetValue(0, 2, 'load', 80); store.typeSetValue(0, 0, 'load', 40); store.typeSetValue(0, 4, 'load', 60);
    expect(col(e, 'weight')).toEqual([40, 40, 80, 80, 60, 60]);
  });
  test('jednostki lb: wpis w funtach (zapisany w kg) przechodzi dalej bez zaokrągleń; zmiana 1. idzie za wartością „z 1.”', async () => {
    const e = await live(BENCH, [...N3]); applyUnit('lb');
    store.typeSetValue(0, 0, 'load', wIn(135)); expect(col(e, 'weight')).toEqual([wIn(135), wIn(135), wIn(135)]);
    store.typeSetValue(0, 2, 'load', wIn(125)); store.typeSetValue(0, 0, 'load', wIn(140));
    expect(col(e, 'weight')).toEqual([wIn(140), wIn(140), wIn(125)]);
  });
  test('masa ciała: ±kg (addKg) przechodzi dalej, wiersz z obcą wartością w polu kg nie jest ruszany', async () => {
    const e = await live('Pull Up', [...N3]); e.sets[1].weight = 42.5;
    store.typeSetValue(0, 0, 'load', 10);
    expect(col(e, 'addKg')).toEqual([10, '', 10]); expect(e.sets[1].weight).toBe(42.5);
  });
  test('czas i dystans (gdy metryka je ma) idą dalej jak powtórzenia', async () => {
    const e = await live('Plank', [...N3]); store.typeSetValue(0, 0, 'durationSec', 45); expect(col(e, 'durationSec')).toEqual([45, 45, 45]);
    store.typeSetValue(0, 0, 'durationSec', 60); expect(col(e, 'durationSec')).toEqual([60, 60, 60]);
    const r = await live(RUN(), [...N3]); store.typeSetValue(0, 0, 'distanceM', 400); store.typeSetValue(0, 0, 'durationSec', 90);
    expect(col(r, 'distanceM')).toEqual([400, 400, 400]); expect(col(r, 'durationSec')).toEqual([90, 90, 90]);
  });
  test('nie psuje przenoszenia po ✓: odhaczenie serii z wpisem działa jak dotąd, a kaskada z 2. serii nie rusza 1.', async () => {
    const e = await live(BENCH, [...N3]); e.sets[0].weight = 60; e.sets[0].reps = 8; store.toggleDone(0, 0);
    expect(e.sets[1].weight).toBe(60);
    store.typeSetValue(0, 1, 'load', 70); expect(col(e, 'weight')).toEqual([60, 70, 70]);
  });
  test('brak treningu / serii → 0, bez wyjątku', async () => {
    await fresh(); expect(store.typeSetValue(0, 0, 'load', 5)).toBe(0);
    await live(BENCH, [...N3]); expect(store.typeSetValue(0, 9, 'reps', 5)).toBe(0);
  });
});

describe('szablon: tplEditRow', () => {
  const tplWith = (name: string, id = 'tc') => {
    const t = { ...S().templates[0], id, name: 'C', items: [{ id: 'ic', exerciseId: ex(name).id, sets: 3, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }] } as any;
    S().templates.push(t); return t as import('@/lib/seed').Template;
  };
  test('przykład właściciela w wierszach szablonu + ciężar startowy zsynchronizowany', async () => {
    await fresh(); const t = tplWith(BENCH); const it = t.items[0]; const id = (k: number) => store.tplRows(it)[k].id;
    store.tplEditRow(t, 'ic', id(0), { weight: 60, reps: 10 });
    expect(it.rows!.map(r => [r.weight, r.reps])).toEqual([[60, 10], [60, 10], [60, 10]]); expect(it.startWeight).toBe(60);
    store.tplEditRow(t, 'ic', id(2), { weight: 57.5 }); store.tplEditRow(t, 'ic', id(0), { weight: 62.5 });
    expect(it.rows!.map(r => r.weight)).toEqual([62.5, 62.5, 57.5]); expect(it.rows!.map(r => r.reps)).toEqual([10, 10, 10]);
  });
  test('rodzaje w szablonie: rozgrzewka i drop osobno; ręczne 0 zostaje', async () => {
    await fresh(); const t = tplWith(BENCH); const it = t.items[0];
    store.tplAddRow(t, 'ic', 'warmup'); store.tplAddRow(t, 'ic', 'warmup'); store.tplAddRow(t, 'ic', 'drop'); store.tplAddRow(t, 'ic', 'drop');
    const r = () => it.rows!; /* W W n n n D D */
    store.tplEditRow(t, 'ic', r()[2].id, { weight: 80 }); store.tplEditRow(t, 'ic', r()[0].id, { weight: 30 }); store.tplEditRow(t, 'ic', r()[5].id, { weight: 50 });
    expect(r().map(x => x.weight)).toEqual([30, 30, 80, 80, 80, 50, 50]);
    store.tplEditRow(t, 'ic', r()[4].id, { weight: 0 }); store.tplEditRow(t, 'ic', r()[2].id, { weight: 85 });
    expect(r().map(x => x.weight)).toEqual([30, 30, 85, 85, 0, 50, 50]);
  });
  test('cel czasu i dystans w szablonie; nieznany wiersz bez wyjątku; tplSetRow nadal zapisuje tylko jeden wiersz', async () => {
    await fresh(); const t = tplWith('Plank'); const it = t.items[0];
    store.tplEditRow(t, 'ic', store.tplRows(it)[0].id, { durationSec: 45 }); expect(it.rows!.map(r => r.durationSec)).toEqual([45, 45, 45]); expect(it.targetSec).toBe(45);
    store.tplEditRow(t, 'ic', 'nie:1', { durationSec: 9 }); expect(it.rows!.map(r => r.durationSec)).toEqual([45, 45, 45]);
    store.tplSetRow(t, 'ic', it.rows![0].id, { durationSec: 30 }); expect(it.rows!.map(r => r.durationSec)).toEqual([30, 45, 45]);
    const d = tplWith(RUN(), 'td'); const di = d.items[0];
    store.tplEditRow(d, 'ic', store.tplRows(di)[0].id, { distanceM: 400 }); expect(di.rows!.map(r => r.distanceM)).toEqual([400, 400, 400]);
  });
});

describe('ekran szablonu', () => {
  test('wpis w 1. wierszu wypełnia 2. i 3.; ręczna zmiana 3.; zmiana 1. idzie do 2. (pola ciężaru i powtórzeń), po „Zapisz” w danych', async () => {
    await fresh();
    const t = { ...S().templates[0], id: 'tc', name: 'C', items: [{ id: 'ic', exerciseId: ex(BENCH).id, sets: 3, repMin: 8, repMax: 12, restSec: null, startWeight: '', targetSec: '', groupId: null }] } as any;
    S().templates.push(t); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(S())) }); await go('/template/tc'); await flushAll(10); await startEdit(); await openCard(0);
    const w = (k: number) => screen.getByTestId(`tpl-w-0-${k}`); const r = (k: number) => screen.getByTestId(`tpl-r-0-${k}`);
    await typeText(w(0), '60'); await typeText(r(0), '10');
    expect([0, 1, 2].map(k => w(k).props.value)).toEqual(['60', '60', '60']); expect([0, 1, 2].map(k => r(k).props.value)).toEqual(['10', '10', '10']);
    await typeText(w(2), '57,5'); await typeText(w(0), '62,5');
    expect([0, 1, 2].map(k => w(k).props.value)).toEqual(['62,5', '62,5', '57,5']);
    await saveEdit(); const rows = S().templates.find(x => x.id === 'tc')!.items[0].rows!;
    expect(rows.map(x => x.weight)).toEqual([62.5, 62.5, 57.5]); expect(rows.map(x => x.reps)).toEqual([10, 10, 10]);
  });
});

describe('ekran treningu (Lista i skupiony)', () => {
  const boot = async () => { await store.flush(); await renderApp({ saved: JSON.parse(JSON.stringify(S())) }); await flushAll(10); };
  test('Lista: wpis w 1. serii wypełnia kolejne; zmiana 3. i potem 1. jak w przykładzie; odhaczona seria nietknięta', async () => {
    const e = await live(BENCH, [...N3]); e.sets[1].weight = 50; e.sets[1].reps = 5; store.toggleDone(0, 1); e.sets[2].weight = ''; e.sets[2].reps = ''; S().settings.workoutView = 'list'; await boot();
    const w = (k: number) => screen.getByTestId(`w-0-${k}`); const r = (k: number) => screen.getByTestId(`r-0-${k}`);
    await typeText(w(0), '60'); await typeText(r(0), '10');
    expect([0, 1, 2].map(k => w(k).props.value)).toEqual(['60', '50', '60']); expect([0, 1, 2].map(k => r(k).props.value)).toEqual(['10', '5', '10']);
    await typeText(w(2), '57,5'); await typeText(w(0), '62,5');
    expect([0, 1, 2].map(k => w(k).props.value)).toEqual(['62,5', '50', '57,5']);
    expect(S().active!.exercises[0].sets.map(s => s.weight)).toEqual([62.5, 50, 57.5]);
  });
  test('widok skupiony: pola wiersza kaskadują, a po ✓ karta „teraz” pokazuje kolejną serię z tą wartością', async () => {
    await live(BENCH, [...N3]); S().settings.workoutView = 'focus'; await boot();
    await typeText(screen.getByTestId('w-0-0'), '60'); await typeText(screen.getByTestId('r-0-0'), '10');
    expect(S().active!.exercises[0].sets.map(s => [s.weight, s.reps])).toEqual([[60, 10], [60, 10], [60, 10]]);
    await tap(screen.getByTestId('focus-done')); await flushAll(10);
    expect(screen.getByTestId('w-0-1').props.value).toBe('60');
  });
});
