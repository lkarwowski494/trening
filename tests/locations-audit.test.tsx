/* P-003 E1 — testy regresji do niezależnego audytu (H1–H3, M1–M8, M11, uwagi LOW). Każdy test opisuje scenariusz błędu; asercje — poprawne zachowanie. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as L from '@/lib/locations';
import { fireEvent } from '@testing-library/react-native';
import { achievable, fillRange, sanitizeLoadSpec, validateSpec, convertSpec, plateSums, rangeValues, toKg, LOAD_LIMITS, type LoadSpec } from '@/lib/loads';
import { loadsFor, equipEntry, availability, LOAD_PRESETS, equipLabel, presetEquipment } from '@/lib/equipment';
import { CATALOG, CATALOG_REV } from '@/lib/catalog.generated';
import * as i18n from '@/lib/i18n';
import { fresh, ex, addWorkout, set } from './helpers';
import { renderApp, flushAll, screen, go, tap, type, act, expandEquip } from './app';
import { userHome, loc, presetSpec } from './locations-fixtures';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); i18n.applyLang('pl'); });
const list = (vals: number[], unit: 'kg' | 'lb' = 'kg'): LoadSpec => ({ kind: 'list', unit, items: vals.map(w => ({ w, on: true })) });
const sets = (w: number, reps: number[]) => reps.map(r => set({ weight: w, reps: r }));
function place(l = userHome([3, 6, 9, 12, 15, 18, 21, 24])) { const s = store.getState().settings; s.locations = [l]; s.mainLocationId = l.id; store.save(); return l; }

describe('H1 / M11 — jeden limit, nic nie jest ucinane po cichu', () => {
  test('lista z edytora (do limitu 300) przechodzi przez sanityzację bez utraty ciężarów; zakres ponad limit jest odrzucany', () => {
    const items = fillRange([], 0.5, 150, 0.5)!; expect(items).toHaveLength(LOAD_LIMITS.listItems);
    const s = sanitizeLoadSpec(JSON.parse(JSON.stringify({ kind: 'list', unit: 'kg', items }))); expect(s!.kind === 'list' && s!.items.length).toBe(300);
    expect(fillRange([], 0.5, 150.5, 0.5)).toBeNull(); /* 301 wartości */
  });
  test('stacja: zakres ponad limit / max < min → brak ciężarów i komunikat (nie ucięta lista bez najcięższych)', () => {
    const big: LoadSpec = { kind: 'electric', unit: 'kg', min: 0.1, max: 300, step: 0.1 }; expect(validateSpec(big)).toBe('range_too_many'); expect(achievable(big)).toEqual([]);
    expect(rangeValues(0, 5000, 1)).toEqual([]); expect(rangeValues(0, 1999, 1)).toHaveLength(2000);
    const inv = sanitizeLoadSpec({ kind: 'electric', min: 30, max: 10, step: 0.5 })!; expect(inv).toEqual({ kind: 'electric', unit: 'kg', min: 30, max: 10, step: 0.5 }); /* LOW: max < min zostaje */
    expect(validateSpec(inv)).toBe('range_invalid'); expect(achievable(inv)).toEqual([]);
  });
  test('talerze: za dużo kombinacji → pusto + komunikat; za dużo rodzajów → odrzucone', () => {
    const odd: LoadSpec = { kind: 'plates', unit: 'kg', base: 20, plates: Array.from({ length: 20 }, (_, i) => ({ w: Math.round((1 + 0.777 * i + i * i * 0.0131) * 1000) / 1000, n: 8 })) };
    expect(validateSpec(odd)).toBe('plates_too_many_combos'); expect(achievable(odd)).toEqual([]);
    const rows = Array.from({ length: 31 }, () => ({ w: 5, n: 2 })); expect(validateSpec({ kind: 'plates', unit: 'kg', base: 20, plates: rows })).toBe('plates_too_many_rows'); expect(plateSums(20, rows, 2)).toEqual([]);
  });
  test('edytor: zakres ponad limit pokazuje komunikat i nie zmienia listy; limit widoczny', async () => {
    await fresh(); place(); await store.flush(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/more/location/home'); await flushAll(10); await expandEquip();
    expect(screen.getByText('Odznacz ciężary, których nie masz. Najwyżej 300 ciężarów.')).toBeTruthy();
    await type(screen.getAllByLabelText('od')[0], '1'); await type(screen.getAllByLabelText('do')[0], '400'); await type(screen.getAllByLabelText('co')[0], '1');
    await tap(screen.getByLabelText('Wypełnij zakresem — Hantle (stała waga albo z szybką regulacją)'));
    expect(screen.getByText('Ciężarów w tym zakresie: 400 — najwyżej 300. Zwiększ krok.')).toBeTruthy(); expect((store.getState().settings.locations[0].equipment.find(e => e.item === 'db_fixed')!.load as any).items).toHaveLength(8);
  });
});

describe('H2, H3, M1, M2 — źródło ciężarów i podpowiedź', () => {
  test('H2: wykroki / russian twist bez obciążenia, w domu najmniejszy hantel 3 kg → powtórzenia, nie „+1 kg”', async () => {
    await fresh(); const h = place();
    expect(store.progressionFor(ex('Walking Lunges'), 12, sets(0, [12, 12]), h.id)).toEqual({ kind: 'reps', reps: 13 });
    expect(store.progressionFor(ex('Russian Twist'), 20, [set({ weight: '', reps: 20 })], h.id)).toEqual({ kind: 'reps', reps: 21 });
  });
  test('H3: własne ćwiczenie na maszynie / wyciągu zachowuje „↑” (jak przed P-003), gdy są miejsca', async () => {
    await fresh(); const h = place(); const m = store.newExercise('Moja maszyna'); store.setEquipment(m, 'maszyna'); const c = store.newExercise('Mój wyciąg'); store.setEquipment(c, 'linki');
    expect(store.progressionFor(m, 10, sets(50, [10, 10]), h.id)).toEqual({ kind: 'load', kg: 52.5 });
    expect(store.progressionFor(c, 10, sets(20, [10, 10]), h.id)).not.toBeNull();
    expect(loadsFor({ ...m }, h).kind).toBe('unknown');
  });
  test('M1: Triceps Pushdown bierze stos bramy, nie wyciągu do ściągania; Lat Pulldown — stos wyciągu do ściągania; tylko wyciąg do ściągania → jego stos', () => {
    const cc = equipEntry('cable_cross'); cc.load = list([5, 10, 15]); const lp = equipEntry('lat_pulldown'); lp.load = list([100, 110]);
    const g = loc('G', [cc, lp]); const P = { ...CATALOG['Triceps Pushdown'], loadMode: 'total' as const }, LP = { ...CATALOG['Lat Pulldown'], loadMode: 'total' as const };
    expect(loadsFor(P, g)).toEqual({ kind: 'loads', loads: [5, 10, 15], item: 'cable_cross' });
    expect(loadsFor(LP, g)).toEqual({ kind: 'loads', loads: [100, 110], item: 'lat_pulldown' });
    expect(loadsFor(P, loc('G2', [lp]))).toEqual({ kind: 'loads', loads: [100, 110], item: 'lat_pulldown' });
  });
  test('M2: T-Bar Row na maszynie T-bar (bez sztangi) bierze jej ciężary', async () => {
    await fresh(); const tb = equipEntry('t_bar'); tb.load = list([20, 25, 30]); const g = place(loc('G', [tb]));
    expect(availability(ex('T-Bar Row'), g).ok).toBe(true);
    expect(store.progressionFor(ex('T-Bar Row'), 10, sets(25, [10, 10]), g.id)).toEqual({ kind: 'load', kg: 30 }); /* 25 → 30 = 20% — decyzja 7a: od razu następny ciężar maszyny */
  });
  test('LOW + decyzja 03.10 „stacja elektryczna na stronę”: 65 kg/str. to maksimum stacji — bez „↑” (ani jednorącz, ani przysiad z pasem: bez sumy dwóch linek)', async () => {
    await fresh(); const h = place();
    expect(store.progressionFor(ex('Cable Lateral Raise'), 12, sets(65, [12, 12]), h.id)).toBeNull();
    expect(store.progressionFor(ex('Przysiad z pasem (linki)'), 8, sets(65, [8, 8]), h.id)).toBeNull();
    expect(store.progressionFor(ex('Przysiad z pasem (linki)'), 8, sets(64.5, [8, 8]), h.id)).toEqual({ kind: 'load', kg: 65 });
  });
});

describe('M3 — ciężar z innego miejsca spoza listy nie trafia do pól', () => {
  test('start w domu po treningu na siłowni (32 kg, w domu max 24): pole puste, „Poprzednio” pokazuje 32; z listy — wstawiany', async () => {
    await fresh(); const h = place(userHome([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24])); const gym = L.addLocation('gym', 'Siłownia');
    addWorkout(Date.now() - 86400e3, [['Bench Press (hantle)', [{ weight: 32, reps: 8 }]], ['Biceps Curl (hantle)', [{ weight: 12, reps: 10 }]]]).locationId = gym.id; store.save();
    const tpl = store.newTemplate(); for (const [i, n] of ['Bench Press (hantle)', 'Biceps Curl (hantle)'].entries()) tpl.items.push({ id: 'i' + i, exerciseId: ex(n).id, sets: 2, repMin: 6, repMax: 10, restSec: null, startWeight: '', targetSec: '', groupId: null });
    store.startFromTemplate(tpl); const a = store.getState().active!; expect(a.locationId).toBe(h.id);
    expect(a.exercises[0].sets.map(s => [s.weight, s.reps])).toEqual([['', ''], ['', '']]); /* weryfikacja 2: bez ciężaru także bez powtórzeń */ expect(a.exercises[1].sets.map(s => s.weight)).toEqual([12, 12]);
    expect(a.exercises[0].impl).toBe('dumbbell'); expect(store.previousBlockFor(ex('Bench Press (hantle)').id, 0, 1, 'i0', tpl.id, a.exercises[0].impl)!.sets[0].weight).toBe(32);
    store.toggleDone(0, 0); expect([a.exercises[0].sets[0].weight, a.exercises[0].sets[0].reps]).toEqual(['', '']); /* odhaczenie pustej serii też nie wstawia 32 */
  });
  test('bez miejsc: wstępne wartości jak dotąd (32 kg)', async () => {
    await fresh(); addWorkout(Date.now() - 86400e3, [['Bench Press (hantle)', [{ weight: 32, reps: 8 }]]]).locationId = 'gone'; store.save();
    const tpl = store.newTemplate(); tpl.items.push({ id: 'i0', exerciseId: ex('Bench Press (hantle)').id, sets: 1, repMin: 6, repMax: 8, restSec: null, startWeight: '', targetSec: '', groupId: null });
    store.startFromTemplate(tpl); expect(store.getState().active!.exercises[0].sets[0].weight).toBe(32);
  });
});

describe('M4, M5, M7 — edytor ciężarów', () => {
  test('M4: zmiana jednostki przelicza wartości; kg → lb → kg wraca do tych samych kg', () => {
    const kg = list([2.5, 5, 10, 20, 24]); const lb = convertSpec(kg, 'lb'); expect(lb.kind === 'list' && lb.items.map(x => x.w)).toEqual([5.5, 11, 22, 44.1, 52.9]);
    expect(convertSpec(lb, 'kg')).toEqual(kg);
    const pl = convertSpec({ kind: 'plates', unit: 'lb', base: 45, plates: [{ w: 45, n: 2 }] }, 'kg'); expect(pl).toEqual({ kind: 'plates', unit: 'kg', base: 20.411657, plates: [{ w: 20.411657, n: 2 }] }); expect(achievable(pl)).toEqual([20.41, 61.23]); /* weryfikacja 2: talerze dokładnym współczynnikiem; po zmianie na kg — siatka kg (0,01) */
    expect(convertSpec(presetSpec('vishape_pro'), 'lb')).toEqual({ kind: 'electric', unit: 'lb', min: 3.306934, max: 143.30047, step: 1.102311 }); /* weryfikacja 3: dokładny współczynnik */
  });
  test('M4 (ekran): przełączenie kg → lb zmienia „24” na „52,9”, a dostępne ciężary w kg zostają', async () => {
    await fresh(); place(); await store.flush(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/more/location/home'); await flushAll(10); await expandEquip();
    const before = loadsFor({ ...CATALOG['Bench Press (hantle)'], loadMode: 'per_dumbbell' }, store.getState().settings.locations[0]);
    await tap(screen.getAllByLabelText('lb')[0]); await flushAll(5);
    const db = store.getState().settings.locations[0].equipment.find(e => e.item === 'db_fixed')!.load!; expect(db.unit).toBe('lb'); expect(screen.getByLabelText('52,9 lb')).toBeTruthy();
    expect(loadsFor({ ...CATALOG['Bench Press (hantle)'], loadMode: 'per_dumbbell' }, store.getState().settings.locations[0])).toEqual(before);
  });
  test('M5: preset modelu nie nadpisuje wpisanej listy bez pytania; pusta lista — od razu', async () => {
    await fresh(); place(); await store.flush(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/more/location/home'); await flushAll(10); await expandEquip();
    const db = () => store.getState().settings.locations[0].equipment.find(e => e.item === 'db_fixed')!.load as any;
    await tap(screen.getByText('Hantle stałe 2,5–24 kg (15 par)')); expect(global.__alerts.slice(-1)[0].title).toBe('Zastąpić wpisane ciężary?'); expect(db().items).toHaveLength(8);
    await act(async () => { global.__alerts.slice(-1)[0].buttons!.find(b => b.text === 'Zastąp')!.onPress!(); }); await flushAll(5); expect(db().items).toHaveLength(15);
    await act(async () => { db().items = []; store.save(); }); await flushAll(5); const n = global.__alerts.length; await tap(screen.getByText('Hantle stałe 2,5–24 kg (15 par)')); expect(global.__alerts).toHaveLength(n); expect(db().items).toHaveLength(15);
  });
  test('M5: odznaczona pozycja nie daje możliwości, ale zachowuje ciężary (także po eksporcie/imporcie)', async () => {
    await fresh(); const h = place(); L.setEquip(h, 'db_fixed', false);
    expect(availability(ex('Bench Press (hantle)'), h).ok).toBe(false); expect(loadsFor({ ...CATALOG['Bench Press (hantle)'], loadMode: 'per_dumbbell' }, h).kind).toBe('unknown');
    const m = store.migrate(JSON.parse(JSON.stringify(store.getState()))); const e = m.settings.locations[0].equipment.find(x => x.item === 'db_fixed')!; expect(e.off).toBe(true); expect((e.load as any).items).toHaveLength(8);
    L.setEquip(h, 'db_fixed', true); expect(availability(ex('Bench Press (hantle)'), h).ok).toBe(true);
  });
  test('M7: opcje z nazwą pozycji dla VoiceOver, przyciski edytora z nazwą pozycji', async () => {
    await fresh(); place(); await store.flush(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/more/location/home'); await flushAll(10); await expandEquip();
    expect(screen.getByLabelText('Stacja z oporem elektrycznym / magnetycznym (inteligentna stacja kablowa): pas biodrowy')).toBeTruthy();
    expect(screen.getByLabelText('Dodaj ciężar — Hantle (stała waga albo z szybką regulacją)')).toBeTruthy();
    expect(screen.getByLabelText('Jednostka sprzętu — Hantle (stała waga albo z szybką regulacją)')).toBeTruthy();
  });
});

describe('M6 — wersja katalogu', () => {
  test('ćwiczenie z biblioteki ze starą wersją wymagań dostaje aktualne; „user” zostaje; ćwiczenia własne bez wersji', async () => {
    await fresh(); const bp = ex('Bench Press (hantle)'); expect(bp.catalogRev).toBe(CATALOG_REV);
    bp.requires = [['barbell']]; bp.catalogRev = 'old'; const pu = ex('Pull Up'); pu.requires = [['rings']]; pu.catalogRev = 'user'; const own = store.newExercise('Moje'); (own as any).catalogRev = 'x';
    const m = store.migrate(JSON.parse(JSON.stringify(store.getState())));
    expect(m.exercises.find(e => e.id === bp.id)!.requires).toEqual(CATALOG['Bench Press (hantle)'].requires); expect(m.exercises.find(e => e.id === bp.id)!.catalogRev).toBe(CATALOG_REV);
    expect(m.exercises.find(e => e.id === pu.id)!.requires).toEqual([['rings']]); expect('catalogRev' in m.exercises.find(e => e.id === own.id)!).toBe(false);
  });
  test('LOW: uszkodzona grupa wymagań czyni ćwiczenie niedostępnym („brak: ?”), nie dostępnym', async () => {
    await fresh(); const e = ex('Bench Press (hantle)'); (e as any).requires = [['db'], [1, null], 'x']; e.catalogRev = 'user';
    const m = store.migrate(JSON.parse(JSON.stringify(store.getState()))); const r = m.exercises.find(x => x.id === e.id)!;
    expect(r.requires).toEqual([['db'], ['?'], ['?']]); expect(availability(r, loc('pełna', presetEquipment('gym'))).ok).toBe(false);
  });
});

describe('M8 i uwagi LOW', () => {
  test('M8: „Poprzednio: …” tylko gdy poprzedni trening był w INNYM określonym miejscu (stare treningi bez miejsca — bez dopisku)', async () => {
    await fresh(); place(); addWorkout(Date.now() - 86400e3, [['Pull Up', [{ addKg: 0, reps: 8 }]]]); store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(10);
    expect(screen.getByText('📍 Dom ▾')).toBeTruthy(); expect(screen.queryByText(/^Poprzednio: /)).toBeNull();
  });
  test('wynik achievable liczony raz na treść opisu i przeliczany po zmianie opisu', () => {
    const s = list([2, 4]); const a = achievable(s); expect(achievable(s)).toBe(a); (s as any).items.push({ w: 6, on: true }); expect(achievable(s)).toEqual([2, 4, 6]);
  });
  test('preset „Pełna siłownia” w jednostce aplikacji (lb: gryf 45 lb, talerze 45…2,5 lb, hantle co 5 lb)', async () => {
    await fresh(); store.getState().settings.unit = 'lb'; const g = L.addLocation('gym');
    expect(g.equipment.find(e => e.item === 'barbell')!.load).toMatchObject({ unit: 'lb', base: 45 }); expect(g.equipment.find(e => e.item === 'db_fixed')!.load).toMatchObject({ unit: 'lb' });
    expect(presetEquipment('gym').find(e => e.item === 'barbell')!.load).toMatchObject({ unit: 'kg', base: 20 });
  });
  test('nazwy presetów modeli wg języka (kropka dziesiętna po angielsku)', () => {
    i18n.applyLang('en'); expect(equipLabel(LOAD_PRESETS[0].label)).toBe('Fixed dumbbells 2.5–24 kg (15 pairs)'); i18n.applyLang('pl'); expect(equipLabel(LOAD_PRESETS[0].label)).toBe('Hantle stałe 2,5–24 kg (15 par)');
  });
  test('nazwa miejsca: najwyżej 80 znaków; wyjście z pustą nazwą przywraca poprzednią', async () => {
    await fresh(); const a = L.addLocation('home'); L.renameLocation(a, 'x'.repeat(100)); expect(a.name).toHaveLength(80); L.renameLocation(a, 'Dom'); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go(`/more/location/${a.id}`); await flushAll(10); await expandEquip();
    await act(async () => { fireEvent.changeText(screen.getByDisplayValue('Dom'), ''); }); await act(async () => { require('expo-router').router.back(); }); await flushAll(10);
    expect(store.getState().settings.locations[0].name).toBe('Dom');
  });
});
