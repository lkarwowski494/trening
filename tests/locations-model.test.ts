/* P-003 E1 (C, E, F): schemat 14 — miejsca w Ustawieniach, miejsce treningu i szablonu, pola sprzętowe ćwiczeń, migracja,
 * eksport → import, operacje na miejscach; „Poprzednio” wg przyrządu (decyzja 8c z 03.10.2026, zastąpiła 8a „to samo miejsce”). */
import fc from 'fast-check';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as store from '@/lib/store';
import * as L from '@/lib/locations';
import { buildBackup, parseBackup } from '@/lib/backup';
import { CATALOG } from '@/lib/catalog.generated';
import { SCHEMA_VERSION } from '@/lib/seed';
import { fresh, ex, addWorkout, set, withDemoTemplates } from './helpers';
import { userHome } from './locations-fixtures';

const strip = (s: any) => { const c = JSON.parse(JSON.stringify(s)); delete c.metaUpdatedAt; delete c.saveSeq; delete c.userTouched; return c; };
const at = (d: number) => Date.UTC(2026, 8, d, 10);
/** Dom użytkownika + siłownia w store; dom główny. */
function twoPlaces(trexo: number[] = [3, 6, 9, 12, 15, 18, 21, 24]) {
  const s = store.getState().settings; const home = userHome(trexo); const gym = L.addLocation('gym', 'Siłownia');
  s.locations.unshift(home); s.mainLocationId = home.id; store.save(); return { home: store.locationById('home')!, gym };
}

describe('schemat 14 i migracja', () => {
  test('wersja schematu 15 (14: miejsca, 15: przyrząd bloku — bez migracji P-004, usuniętej w rundzie 82); domyślnie brak miejsc, brak miejsca głównego, filtr „pokaż wszystkie” wyłączony', async () => {
    const st = await fresh(); expect(SCHEMA_VERSION).toBe(15);
    expect(st.settings.locations).toEqual([]); expect(st.settings.mainLocationId).toBeNull(); expect(st.settings.pickerShowAll).toBe(false);
  });
  test('dane sprzed schematu 14: ćwiczenia z biblioteki dostają wymagania z katalogu, własne — brak wymagań i źródło obciążenia ze sprzętu', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState())); raw.schemaVersion = 13;
    for (const e of raw.exercises) { delete e.requires; delete e.recommended; delete e.pattern; delete e.loadSource; delete e.implements; }
    raw.exercises.push({ id: 'own1', name: 'Wiosłowanie gumą', group: 'plecy', equipment: 'linki', lib: false }, { id: 'own2', name: 'Bench Press (hantle)', group: 'klatka', equipment: 'hantle' });
    delete raw.settings.locations; delete raw.settings.mainLocationId; delete raw.settings.pickerShowAll;
    const m = store.migrate(raw);
    const bp = m.exercises.find(e => e.name === 'Bench Press (hantle)' && e.lib)!; expect(bp.requires).toEqual(CATALOG['Bench Press (hantle)'].requires); expect(bp.implements).toBe(2); expect(bp.pattern).toBe('h_push');
    const own = m.exercises.find(e => e.id === 'own1')!; expect(own.requires).toEqual([]); expect(own.loadSource).toBe('cable'); expect(own.pattern).toBeUndefined();
    const dup = m.exercises.find(e => e.id === 'own2')!; expect(dup.requires).toEqual([]); expect(dup.loadSource).toBe('dumbbell'); /* własne o nazwie z biblioteki (bez flagi lib, schemat 13) — bez wymagań */
    expect(m.settings.locations).toEqual([]); expect(m.settings.mainLocationId).toBeNull(); expect(m.schemaVersion).toBe(15);
  });
  test('stary backup z wersji web 0.3 wczytuje się; ćwiczenia biblioteki mają wymagania', async () => {
    await fresh(); const raw = readFileSync(join(__dirname, 'fixtures/web03-backup.json'), 'utf8');
    const s = parseBackup(raw); store.replaceState(s); const st = store.getState();
    expect(st.settings.locations).toEqual([]); expect(st.exercises.every(e => Array.isArray(e.requires) && typeof e.loadSource === 'string')).toBe(true);
    expect(st.exercises.filter(e => e.lib && CATALOG[e.name]).every(e => JSON.stringify(e.requires) === JSON.stringify(CATALOG[e.name].requires))).toBe(true);
  });
  test('edytowane wymagania nie są nadpisywane przy kolejnym starcie (idempotencja); śmieci poprawiane', async () => {
    await fresh(); const bp = ex('Bench Press (hantle)'); bp.requires = [['db'], ['bench.incline']]; (bp as any).implements = 3; (bp as any).pattern = 'zz'; bp.loadSource = 'xx' as any; (bp as any).recommended = [1, 'box', 'box'];
    const m = store.migrate(JSON.parse(JSON.stringify(store.getState()))); const e = m.exercises.find(x => x.id === bp.id)!;
    expect(e.requires).toEqual([['db'], ['bench.incline']]); expect(e.implements).toBeUndefined(); expect(e.pattern).toBeUndefined(); expect(e.loadSource).toBe('dumbbell'); expect(e.recommended).toEqual(['box']);
  });
  test('miejsca z importu: nieznany sprzęt i opcje odpadają, ciężary poprawiane, miejsce główne zawsze istnieje', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState()));
    raw.settings.locations = [{ id: 'a', name: '  Dom  ', equipment: [{ item: 'db_fixed', opts: ['x'], load: { kind: 'list', items: [{ w: '12,5' }, { w: 'x' }] }, junk: 1 }, { item: 'nope' }, { item: 'db_fixed' }, { item: 'electric', opts: ['dual', 'zz'], load: { kind: 'electric', min: 1.5, max: 65, step: 0.5 } }, { item: 'bench_adj', load: { kind: 'list', items: [] } }] }, null, { id: 'a', name: 'dup' }, { name: '' }];
    raw.settings.mainLocationId = 'missing'; raw.settings.pickerShowAll = 'yes';
    const m = store.migrate(raw); const [a, b] = m.settings.locations;
    expect(m.settings.locations).toHaveLength(2); expect(a.name).toBe('Dom'); expect(a.equipment.map(e => e.item)).toEqual(['db_fixed', 'electric', 'bench_adj']);
    expect(a.equipment[0]).toEqual({ item: 'db_fixed', opts: [], load: { kind: 'list', unit: 'kg', items: [{ w: 12.5, on: true }] } });
    expect(a.equipment[1].opts).toEqual(['dual']); expect(a.equipment[2].load).toBeUndefined(); /* ławka nie ma ciężarów */
    expect(b.name).toBe('Miejsce'); expect(typeof b.id).toBe('string'); expect(m.settings.mainLocationId).toBe('a'); expect(m.settings.pickerShowAll).toBe(false);
  });
  test('trening i szablon: locationId tylko tekst; usunięte miejsce zostaje w danych', async () => {
    await fresh(); withDemoTemplates(); const w = addWorkout(at(1), [['Pull Up', [{ reps: 5 }]]]); (w as any).locationId = 'gone'; const tpl = store.getState().templates[0]; (tpl as any).locationId = 7; const t2 = store.getState().templates[1]; (t2 as any).locationId = {};
    const m = store.migrate(JSON.parse(JSON.stringify(store.getState())));
    expect(m.workouts[0].locationId).toBe('gone'); expect(m.templates[0].locationId).toBe('7'); expect('locationId' in m.templates[1]).toBe(false); expect('locationId' in m.templates[2]).toBe(false);
  });
  test('eksport → import zachowuje miejsca, sprzęt, ciężary, miejsce główne, filtr i miejsca treningów/szablonów', async () => {
    await fresh(); withDemoTemplates(); const { home, gym } = twoPlaces(); const s = store.getState().settings; s.pickerShowAll = true; s.mainLocationId = gym.id;
    const tpl = store.getState().templates[3]; tpl.locationId = home.id; const w = addWorkout(at(2), [['Pull Up', [{ reps: 5 }]]]); w.locationId = gym.id; store.save();
    const before = strip(store.getState()); store.replaceState(parseBackup(JSON.stringify(buildBackup())));
    expect(strip(store.getState())).toEqual(before); expect(store.getState().settings.locations).toHaveLength(2); expect(store.getState().settings.locations[0].equipment.find(e => e.item === 'electric')!.load).toEqual({ kind: 'electric', unit: 'kg', min: 1.5, max: 65, step: 0.5 });
  });
  test('restart (zapis w SQLite → init) zachowuje miejsca', async () => {
    await fresh(); twoPlaces(); await store.flush(); const raw = global.__kv.get('state')!;
    const st = await fresh(raw); expect(st.settings.locations.map(l => l.name)).toEqual(['Dom', 'Siłownia']); expect(st.settings.mainLocationId).toBe('home');
  });
  test('migracja z miejscami jest idempotentna (właściwość, śmieci w miejscach)', async () => {
    await fresh();
    const val = fc.oneof(fc.constant(undefined), fc.constant(null), fc.integer(), fc.string({ maxLength: 4 }), fc.boolean(), fc.constant([]), fc.constant({}));
    const eq = fc.record({ item: fc.oneof(fc.constantFrom('db_fixed', 'db_plate', 'barbell', 'electric', 'bench_adj', 'rack', 'zz'), val), opts: fc.oneof(fc.constant(['dual', 'belt', 'decline', 'pullup', 'zz']), val), load: fc.oneof(val, fc.record({ kind: fc.constantFrom('list', 'plates', 'electric', 'x'), unit: fc.constantFrom('kg', 'lb', 'x'), items: fc.array(fc.record({ w: val, on: val }), { maxLength: 3 }), base: val, plates: fc.array(fc.record({ w: val, n: val }), { maxLength: 3 }), min: val, max: val, step: val }, { requiredKeys: [] })) }, { requiredKeys: [] });
    const locArb = fc.record({ id: fc.oneof(fc.constantFrom('a', 'b', 1), val), name: val, equipment: fc.oneof(fc.array(eq, { maxLength: 4 }), val), createdAt: val }, { requiredKeys: [] });
    fc.assert(fc.property(fc.array(fc.oneof(locArb, val), { maxLength: 4 }), fc.oneof(fc.constantFrom('a', 'b'), val), val, (locs, main, all) => {
      const raw = JSON.parse(JSON.stringify(store.getState())); raw.settings.locations = locs; raw.settings.mainLocationId = main; raw.settings.pickerShowAll = all;
      const a = strip(store.migrate(JSON.parse(JSON.stringify(raw)))); const b = strip(store.migrate(JSON.parse(JSON.stringify(a)))); expect(b).toEqual(a);
      const S = a.settings; expect(S.mainLocationId === null ? S.locations.length === 0 : S.locations.some((l: any) => l.id === S.mainLocationId)).toBe(true);
    }), { numRuns: 150 });
  });
});

describe('operacje na miejscach', () => {
  test('pierwsze miejsce jest główne; nazwy bez powtórzeń; duplikat to głęboka kopia', async () => {
    await fresh(); const a = L.addLocation('home'); expect(store.getState().settings.mainLocationId).toBe(a.id); expect(a.name).toBe('Dom');
    const b = L.addLocation('home'); expect(b.name).toBe('Dom 2'); expect(store.getState().settings.mainLocationId).toBe(a.id);
    L.setEquip(a, 'db_fixed', true); const c = L.duplicateLocation(a.id)!; expect(c.name).toBe('Dom (kopia)'); expect(c.id).not.toBe(a.id);
    c.equipment[0].opts.push('x'); expect(a.equipment[0].opts).toEqual([]);
  });
  test('sprzęt: zaznaczenie dodaje pozycję z domyślnymi opcjami i pustymi ciężarami w jednostce z Ustawień; opcje tylko znane', async () => {
    await fresh(); store.getState().settings.unit = 'lb'; const a = L.addLocation('home');
    L.setEquip(a, 'electric', true); expect(L.equipOf(a, 'electric')).toEqual({ item: 'electric', opts: ['dual', 'belt', 'ankle'], load: { kind: 'electric', unit: 'lb', min: 0, max: 0, step: 1 } });
    L.setOpt(a, 'electric', 'arms', true); L.setOpt(a, 'electric', 'zz', true); L.setOpt(a, 'electric', 'dual', false); expect(L.equipOf(a, 'electric')!.opts).toEqual(['belt', 'ankle', 'arms']);
    L.setEquip(a, 'electric', false); expect(a.equipment).toHaveLength(1); expect(a.equipment[0].off).toBe(true); expect(L.activeEquip(a, 'electric')).toBeUndefined(); /* audyt M5 */
    L.setEquip(a, 'electric', true); expect(L.equipOf(a, 'electric')!.opts).toEqual(['belt', 'ankle', 'arms']); L.setEquip(a, 'nope', true); expect(a.equipment).toHaveLength(1);
  });
  test('miejsca głównego nie da się usunąć, dopóki jest inne; jedyne miejsce — można (powrót do trybu bez miejsc)', async () => {
    await fresh(); const a = L.addLocation('home'); const b = L.addLocation('gym');
    expect(L.deleteLocation(a.id)).toBe(false); expect(store.getState().settings.locations).toHaveLength(2);
    L.setMainLocation(b.id); expect(L.deleteLocation(a.id)).toBe(true); expect(store.getState().settings.mainLocationId).toBe(b.id);
    expect(L.deleteLocation(b.id)).toBe(true); expect(store.getState().settings).toMatchObject({ locations: [], mainLocationId: null });
  });
  test('usunięte miejsce: treningi i szablony zachowują id i pokazują „(usunięte miejsce)”', async () => {
    await fresh(); withDemoTemplates(); const { gym } = twoPlaces(); const tpl = store.getState().templates[0]; tpl.locationId = gym.id; const w = addWorkout(at(3), [['Pull Up', [{ reps: 5 }]]]); w.locationId = gym.id;
    expect(L.deleteLocation(gym.id)).toBe(true); expect(tpl.locationId).toBe(gym.id); expect(store.getState().workouts[0].locationId).toBe(gym.id);
    expect(L.locationLabel(gym.id)).toBe('(usunięte miejsce)'); expect(L.locationLabel('home')).toBe('Dom');
    store.startFromTemplate(tpl); expect(store.getState().active!.locationId).toBe('home'); /* szablon z usuniętym miejscem → główne */
  });
});

describe('miejsce treningu', () => {
  test('bez miejsc: trening nie ma pola locationId (dane jak przed P-003)', async () => {
    await fresh(); store.startFromTemplate(withDemoTemplates()[0]); expect('locationId' in store.getState().active!).toBe(false); store.cancelWorkout();
    store.startEmpty(); expect('locationId' in store.getState().active!).toBe(false); store.cancelWorkout();
    addWorkout(at(1), [['Pull Up', [{ reps: 5 }]]]); store.repeatLast(); expect('locationId' in store.getState().active!).toBe(false);
  });
  test('start: miejsce szablonu, inaczej główne; pusty trening — główne; „Powtórz ostatni” — miejsce tamtego treningu', async () => {
    await fresh(); withDemoTemplates(); const { gym } = twoPlaces(); const [t0, t1] = store.getState().templates; t1.locationId = gym.id;
    store.startFromTemplate(t0); expect(store.getState().active!.locationId).toBe('home'); store.cancelWorkout();
    store.startFromTemplate(t1); expect(store.getState().active!.locationId).toBe(gym.id); store.cancelWorkout();
    store.startEmpty(); expect(store.getState().active!.locationId).toBe('home'); store.cancelWorkout();
    const w = addWorkout(at(4), [['Pull Up', [{ reps: 5 }]]]); w.locationId = gym.id; store.save(); store.repeatLast(); expect(store.getState().active!.locationId).toBe(gym.id);
  });
});

describe('„Poprzednio” i wstępne wartości — ostatni raz tym samym przyrządem, nie w tym samym miejscu (decyzja 8c, 03.10.2026; zastępuje 8a)', () => {
  test('hantle (jeden przyrząd): ostatni trening gdziekolwiek, także nowszy z siłowni; ciężaru spoza listy domu nie wstawiamy (M3), w siłowni — tak', async () => {
    await fresh(); const { gym } = twoPlaces();
    const h = addWorkout(at(1), [['Bench Press (hantle)', [{ weight: 24, reps: 8 }]]]); h.locationId = 'home'; h.exercises[0].impl = 'dumbbell';
    const g = addWorkout(at(5), [['Bench Press (hantle)', [{ weight: 32, reps: 8 }]], ['Leg Press', [{ weight: 140, reps: 10 }]]]); g.locationId = gym.id; g.exercises[0].impl = 'dumbbell'; store.save();
    const bp = ex('Bench Press (hantle)').id, lp = ex('Leg Press').id;
    expect(store.previousBlockFor(bp, 0, 1, undefined, null, 'dumbbell')!.sets[0].weight).toBe(32); /* miejsce nie ma znaczenia */
    expect(store.previousBlockFor(bp, 0, 1)!.sets[0].weight).toBe(32);
    expect(store.previousBlockFor(lp, 0, 1, undefined, null, 'machine')!.sets[0].weight).toBe(140);
    const tpl = store.newTemplate(); tpl.items.push({ id: 'i1', exerciseId: bp, sets: 2, repMin: 6, repMax: 8, restSec: null, startWeight: '', targetSec: '', groupId: null });
    store.startFromTemplate(tpl); const a = store.getState().active!; expect(a.locationId).toBe('home'); expect(a.exercises[0].impl).toBe('dumbbell');
    expect(a.exercises[0].sets.map(s => [s.weight, s.reps])).toEqual([['', ''], ['', '']]); /* 32 kg z siłowni — w domu max 24 (M3) */ store.cancelWorkout();
    tpl.locationId = gym.id; store.startFromTemplate(tpl); expect(store.getState().active!.exercises[0].sets.map(s => s.weight)).toEqual([32, 32]);
  });
  test('odhaczenie pustej serii: masa ciała (bez przyrządu) — podpowiedź z ostatniego treningu gdziekolwiek', async () => {
    await fresh(); const { gym } = twoPlaces();
    addWorkout(at(1), [['Pull Up', [{ addKg: 5, reps: 6 }]]]).locationId = 'home'; addWorkout(at(2), [['Pull Up', [{ addKg: 20, reps: 3 }]]]).locationId = gym.id; store.save();
    store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); expect('impl' in store.getState().active!.exercises[0]).toBe(false);
    store.toggleDone(0, 0); const s = store.getState().active!.exercises[0].sets[0]; expect([s.addKg, s.reps]).toEqual([20, 3]);
  });
  test('bez miejsc w Ustawieniach przyrząd bloku nie zmienia doboru (ostatni gdziekolwiek)', async () => {
    await fresh(); const a = addWorkout(at(1), [['RDL (hantle/linki)', [{ weight: 20, reps: 6 }]]]); a.exercises[0].impl = 'dumbbell';
    const b = addWorkout(at(2), [['RDL (hantle/linki)', [{ weight: 40, reps: 3 }]]]); b.exercises[0].impl = 'electric'; store.save();
    expect(store.previousBlockFor(ex('RDL (hantle/linki)').id, 0, 1, undefined, null, 'dumbbell')!.sets[0].weight).toBe(40);
  });
  void set;
});
