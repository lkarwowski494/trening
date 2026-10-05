/* Decyzje właściciela 05.10.2026 (docs/17): „Tworzenie szablonu to po prostu nieaktywny trening” — każda seria to wiersz (typ, ostatnio,
 * powtórzenia, kg), te same przyciski typów co w treningu; zakres powtórzeń opcjonalnie („w ustawieniach szablonu … i wtedy będą podpowiedzi”). */
import { renderApp, flushAll, screen, go, tap, type as typeText } from './app';
import * as store from '@/lib/store';
import { fresh, ex, addWorkout } from './helpers';
import { SCHEMA_VERSION } from '@/lib/seed';

jest.setTimeout(60000);
const tplWith = (name: string, extra: Record<string, unknown> = {}) => { const st = store.getState(); const t = { ...store.getState().templates[0], id: 'tq', name: 'Q', items: [{ id: 'iq', exerciseId: ex(name).id, sets: 3, repMin: 8, repMax: 12, restSec: null, startWeight: 60, targetSec: '', groupId: null, ...extra }] } as any; st.templates.push(t); return t; };

describe('model: wiersze serii w pozycji szablonu', () => {
  test('pozycja bez wierszy (dane sprzed 17) = N zwykłych serii z ciężarem startowym; migracja nie zmienia treści szablonu', async () => {
    await fresh(); const t = tplWith('Bench Press (sztanga)'); await store.flush();
    await fresh(JSON.parse(JSON.stringify(store.getState()))); const it = store.getState().templates.find(x => x.id === 'tq')!.items[0];
    expect(it.rows).toBeUndefined(); expect(it.sets).toBe(3); expect(it.repMin).toBe(8); expect(it.repMax).toBe(12);
    expect(store.tplRows(it).map(r => [r.kind, r.weight, r.reps])).toEqual([['normal', 60, ''], ['normal', 60, ''], ['normal', 60, '']]);
    void t;
  });
  test('dodanie rozgrzewki/drop setu zapisuje wiersze i synchronizuje liczbę serii i ciężar startowy', async () => {
    await fresh(); const t = tplWith('Bench Press (sztanga)'); const it = t.items[0] as import('@/lib/seed').TemplateItem;
    store.tplAddRow(t, it.id, 'warmup'); store.tplAddRow(t, it.id, 'drop'); store.tplAddRow(t, it.id);
    expect(it.rows!.map(r => r.kind)).toEqual(['warmup', 'normal', 'normal', 'normal', 'drop', 'drop']); /* „+ seria” po drop secie — drop set (jak w treningu) */
    expect(it.sets).toBe(6);
    store.tplSetRow(t, it.id, it.rows![0].id, { weight: 40, reps: 10 }); store.tplSetRow(t, it.id, it.rows![1].id, { weight: 70 });
    expect(it.startWeight).toBe(70); /* pierwsza seria robocza */
    store.tplSetKind(t, it.id, it.rows![5].id, 'failure'); expect(it.rows![5].kind).toBe('failure');
    store.tplRemoveRow(t, it.id); expect(it.rows!.length).toBe(5); expect(it.sets).toBe(5);
  });
  test('start treningu: typy i wartości z wierszy (bez historii); z historią — serie robocze z „ostatnio”', async () => {
    await fresh(); const t = tplWith('Bench Press (sztanga)'); const it = t.items[0] as import('@/lib/seed').TemplateItem;
    store.tplAddRow(t, it.id, 'warmup'); store.tplSetRow(t, it.id, it.rows![0].id, { weight: 40, reps: 10 }); store.tplSetRow(t, it.id, it.rows![1].id, { reps: 8 });
    store.startFromTemplate(t); let sets = store.getState().active!.exercises[0].sets;
    expect(sets.map(s => [s.kind, s.weight, s.reps])).toEqual([['warmup', 40, 10], ['normal', 60, 8], ['normal', 60, ''], ['normal', 60, '']]);
    store.cancelWorkout();
    addWorkout(Date.now() - 86400000, [['Bench Press (sztanga)', [{ weight: 65, reps: 9 }, { weight: 65, reps: 9 }, { weight: 65, reps: 8 }]]]);
    store.startFromTemplate(t); sets = store.getState().active!.exercises[0].sets;
    expect(sets.map(s => [s.kind, s.weight, s.reps])).toEqual([['warmup', 40, 10], ['normal', 65, 9], ['normal', 65, 9], ['normal', 65, 8]]);
  });
  test('zakres opcjonalny: nowa pozycja bez zakresu (bez podpowiedzi ↑); zapis/odczyt wierszy; zły zapis naprawiony; schemat 17', async () => {
    expect(SCHEMA_VERSION).toBe(17);
    await fresh(); const t = tplWith('Bench Press (sztanga)'); store.tplAddRow(t, 'iq', 'warmup'); await store.flush();
    const raw = JSON.parse(JSON.stringify(store.getState())); const rit = raw.templates.find((x: any) => x.id === 'tq').items[0];
    rit.rows.push({ id: 5, kind: 'nonsense', reps: 'x', weight: -3 }); rit.rows.push('zły');
    await fresh(raw); const it = store.getState().templates.find(x => x.id === 'tq')!.items[0];
    expect(it.rows!.map(r => r.kind)).toEqual(['warmup', 'normal', 'normal', 'normal', 'normal']); expect(it.rows![4].reps).toBe(''); expect(it.rows![4].weight).toBe(-3); expect(typeof it.rows![4].id).toBe('string'); expect(it.sets).toBe(5);
  });
});

describe('ekran szablonu jak trening', () => {
  test('wiersze serii z etykietą typu, przyciski „+ seria / + rozgrzewka / + drop set”, bez pól „serie”, „pow. od”; zakres po rozwinięciu', async () => {
    await fresh(); tplWith('Bench Press (sztanga)'); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/template/tq'); await flushAll(10);
    expect(screen.queryByText('serie')).toBeNull(); expect(screen.queryByText(/^start /)).toBeNull(); /* dawne pola „serie” i „start kg” — teraz wiersze */
    expect(screen.getAllByLabelText(/^Seria [123], typ: normalna/).length).toBe(3);
    await tap(screen.getByText('+ rozgrzewka')); await tap(screen.getByText('+ drop set')); await flushAll(5);
    expect(store.getState().templates.find(x => x.id === 'tq')!.items[0].rows!.map(r => r.kind)).toEqual(['warmup', 'normal', 'normal', 'normal', 'drop']);
    expect(screen.getByLabelText(/^Seria W, typ: rozgrzewkowa/)).toBeTruthy();
    expect(screen.getByText(/Zakres powtórzeń: 8–12/)).toBeTruthy(); /* ustawiony zakres widoczny */
  });
  test('nowe ćwiczenie w szablonie: 3 wiersze, bez zakresu; „Zakres powtórzeń” dodaje pola od–do', async () => {
    await fresh(); const st = store.getState(); st.templates.push({ ...st.templates[0], id: 'tn', name: 'N', items: [] } as any); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/picker?target=template:tn'); await flushAll(10);
    await typeText(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Bench Press (sztanga)'); await flushAll(5); await tap(screen.getAllByText('Bench Press (sztanga)')[0]); await flushAll(10);
    const it = store.getState().templates.find(x => x.id === 'tn')!.items[0]; expect(it.repMin).toBeNull(); expect(it.repMax).toBeNull(); expect(store.tplRows(it).length).toBe(3);
    await go('/template/tn'); await flushAll(10); await tap(screen.getByText('+ zakres powtórzeń')); await flushAll(5);
    expect(screen.getAllByLabelText(/powtórzenia od/).length).toBeGreaterThan(0);
  });
});

test('kopia ze schematem 17 (wiersze szablonu) odrzucana przez wersję 16 — bez cichej utraty typów serii', async () => {
  await fresh(); const t = tplWith('Bench Press (sztanga)'); store.tplAddRow(t, 'iq', 'warmup');
  const { buildBackup } = require('@/lib/backup'); const env = JSON.stringify(buildBackup()); let err = '';
  jest.isolateModules(() => { jest.doMock('@/lib/seed', () => ({ ...jest.requireActual('@/lib/seed'), SCHEMA_VERSION: 16 })); const old = require('@/lib/backup'); try { old.parseBackup(env); } catch (e) { err = (e as Error).message; } });
  expect(err).toMatch(/17.*16/);
});
