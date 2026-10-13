/* 0.19 — jedno podniesienie schematu (18 → 19) dla A4 (Location.oneOff) i B (State.planPlaces, SavedPlan.places) — docs/33, docs/20 rodzaj 6 „dane”:
 * migracja starego stanu bez zmian, sanityzacja (klucze-daty, id tekstem, bez __proto__, nieznane miejsca), miejsca główne i jednorazowe, porządek
 * (jednorazowe bez odwołań), idempotencja, kopia zapasowa (eksport → import), import starszych kopii, „stary build → nowy” (18 czyta dane 19? nie — odrzuca,
 * a dane 18 w nowym buildzie wstają 1:1), restart. Odpowiedniki dla starszych schematów: tests/swap-schema16.test.ts, tests/audit-0.10-plan.test.ts. */
import * as store from '@/lib/store';
import { buildBackup, parseBackup } from '@/lib/backup';
import { SCHEMA_VERSION, type State } from '@/lib/seed';
import { presetEquipment } from '@/lib/equipment';
import { fresh, saved, withDemoTemplates } from './helpers';
import { loc } from './locations-fixtures';

jest.setTimeout(60000);
const S = () => store.getState();
const GYM = 'gym', HOTEL = 'hotel';
const strip = (s: any) => { const c = JSON.parse(JSON.stringify(s)); delete c.metaUpdatedAt; delete c.saveSeq; delete c.userTouched; return c; };
/** Stan jak zapisał go build 0.18 (schemat 18): miejsca, plan z odcinkiem historii, trening w toku — bez żadnego pola 0.19. */
async function v18(): Promise<any> {
  jest.useFakeTimers({ now: new Date(2026, 9, 13, 9, 0) }); await fresh(undefined, 'pl'); const t = withDemoTemplates(); const s = S().settings;
  s.locations = [loc('Siłownia', presetEquipment('gym'), GYM), loc('Hotel', presetEquipment('hotel'), HOTEL)]; s.mainLocationId = GYM;
  plan(t[0].id); store.startFromTemplate(t[0]); store.save(); const st = JSON.parse(JSON.stringify(S())); st.schemaVersion = 18; delete st.planPlaces; return st;
}
const plan = (id: string) => { const p = require('@/lib/plan'); p.setWeekDay(1, id); p.setWeekDay(3, id); };
afterEach(() => { jest.useRealTimers(); });

describe('stary build → nowy: dane 18 bez zmian', () => {
  test('stan 18 po wczytaniu = ten sam stan z numerem 19; żadnych nowych pól (planPlaces, places, oneOff); miejsca, plan i trening w toku nietknięte', async () => {
    const old = await v18(); const st = await fresh(old, 'pl');
    expect(st.schemaVersion).toBe(19); expect(SCHEMA_VERSION).toBe(19); expect('planPlaces' in st).toBe(false); expect(st.settings.locations.some(l => 'oneOff' in l)).toBe(false);
    const a = strip(st), b = strip(old); a.schemaVersion = b.schemaVersion = 0; delete a.planHistory; delete b.planHistory; expect(a.settings).toEqual(b.settings); expect(a.templates).toEqual(b.templates); expect(a.workouts).toEqual(b.workouts);
    expect(a.active.exercises).toEqual(b.active.exercises); expect(st.weekPlan).toEqual(old.weekPlan); expect(st.planOverrides).toEqual(old.planOverrides);
  });
  test('migrate idempotentne na stanie 18 i 19 (dwa przebiegi = jeden)', async () => {
    const old = await v18(); const once = store.migrate(JSON.parse(JSON.stringify(old))); const twice = store.migrate(JSON.parse(JSON.stringify(once)));
    expect(strip(twice)).toEqual(strip(once)); expect(once.schemaVersion).toBe(19);
  });
  test('zapis po migracji wstaje ponownie (restart): numer 19, pola 0.19 zapisane razem z resztą', async () => {
    await fresh(await v18(), 'pl'); require('@/lib/plan').setPlanPlace('2026-10-14', '2026-10-15', HOTEL); await store.flush();
    const raw = saved(); expect(raw.schemaVersion).toBe(19); const st = await fresh(raw, 'pl'); expect(st.planPlaces).toEqual({ '2026-10-14': HOTEL, '2026-10-15': HOTEL });
  });
});

describe('sanityzacja pól 0.19', () => {
  const base = async () => { const st = await v18(); st.settings.locations.push({ ...loc('Tylko dziś', [], 'once'), oneOff: true }); return st; };
  test('Location.oneOff: tylko true zostaje (inne wartości znikają); miejsce główne nigdy nie jest jednorazowe', async () => {
    const st = await base(); st.settings.locations[0].oneOff = 'tak'; st.settings.locations[1].oneOff = 1; st.settings.mainLocationId = 'once';
    st.workouts = []; st.active = null; const m = store.migrate(JSON.parse(JSON.stringify(st)));
    expect(m.settings.locations.map(l => [l.id, l.oneOff])).toEqual([[GYM, undefined], [HOTEL, undefined]]); /* „once” bez odwołań znika, „tak”/1 to nie true */ expect(m.settings.mainLocationId).toBe(GYM);
    const st2 = await base(); st2.settings.mainLocationId = 'once'; st2.planPlaces = { '2026-10-20': 'once' }; const m2 = store.migrate(JSON.parse(JSON.stringify(st2)));
    expect(m2.settings.locations.find(l => l.id === 'once')!.oneOff).toBe(true); expect(m2.settings.mainLocationId).toBe(GYM); /* jednorazowe użyte w planie zostaje, ale nie jest głównym */
  });
  test('planPlaces: złe klucze, puste wartości, liczbowe id, __proto__, nieznane miejsca, nie-obiekty — porządek; puste pole znika', async () => {
    const st = await v18();
    st.planPlaces = JSON.parse(`{"2026-10-20":"${HOTEL}","2026-10-21":${JSON.stringify(HOTEL)},"zła":"${HOTEL}","2026-10-22":"","2026-10-23":"nie-ma","2026-10-24":null,"__proto__":"${HOTEL}","constructor":"${HOTEL}"}`);
    let m = store.migrate(JSON.parse(JSON.stringify(st))); expect(m.planPlaces).toEqual({ '2026-10-20': HOTEL, '2026-10-21': HOTEL }); expect(Object.getPrototypeOf(m.planPlaces!)).toBe(Object.prototype);
    expect(({} as any).polluted).toBeUndefined(); expect(Object.prototype.hasOwnProperty.call(m.planPlaces!, '__proto__')).toBe(false);
    for (const bad of [null, 5, 'x', [], [HOTEL], {}, { 'zła': HOTEL }]) { st.planPlaces = bad; m = store.migrate(JSON.parse(JSON.stringify(st))); expect('planPlaces' in m).toBe(false); }
    st.settings.locations[1].id = 7; st.settings.mainLocationId = 'gym'; st.planPlaces = { '2026-10-20': 7 }; m = store.migrate(JSON.parse(JSON.stringify(st))); expect(m.planPlaces).toEqual({ '2026-10-20': '7' }); /* liczbowe id → tekst (idOf) w obu miejscach */
  });
  test('SavedPlan.places: czyszczone jak planPlaces (zapisane plany, id miejsc istniejących); puste znika; pozostałe pola planu bez zmian', async () => {
    const st = await v18(); st.savedPlans = [{ id: 'p1', name: 'Plan', days: [null, null, null, null, null, null, null], places: { '2026-10-20': HOTEL, '2026-10-21': 'duch', zła: HOTEL }, overrides: { '2026-10-20': null } },
      { id: 'p2', name: 'Bez', days: [], places: 'x' }, { id: 'p3', name: 'Pusty', days: [], places: {} }];
    const m = store.migrate(JSON.parse(JSON.stringify(st))); expect(m.savedPlans![0]).toEqual({ id: 'p1', name: 'Plan', days: [null, null, null, null, null, null, null], overrides: { '2026-10-20': null }, places: { '2026-10-20': HOTEL } });
    expect('places' in m.savedPlans![1]).toBe(false); expect('places' in m.savedPlans![2]).toBe(false); expect(store.migrate(JSON.parse(JSON.stringify(m))).savedPlans).toEqual(m.savedPlans);
  });
  test('porządek jednorazowych: używane (trening w toku, historia, planPlaces, SavedPlan.places) zostają; nieużywane znikają; zwykłe miejsca zostają zawsze', async () => {
    const st = await v18(); const mk = (id: string) => ({ ...loc(id, [], id), oneOff: true });
    st.settings.locations.push(mk('o-active'), mk('o-hist'), mk('o-plan'), mk('o-saved'), mk('o-free')); st.active.locationId = 'o-active';
    st.workouts = [{ ...JSON.parse(JSON.stringify(st.active)), id: 'h1', finishedAt: st.active.startedAt + 3600e3, locationId: 'o-hist' }]; st.planPlaces = { '2026-10-20': 'o-plan' }; Object.assign(st.workouts[0].exercises[0].sets[0], { done: true, weight: 50, reps: 5, completedAt: st.active.startedAt + 600e3 });
    st.savedPlans = [{ id: 'p', name: 'P', days: [], places: { '2026-10-20': 'o-saved' } }];
    const m = store.migrate(JSON.parse(JSON.stringify(st))); expect(m.settings.locations.map(l => l.id)).toEqual([GYM, HOTEL, 'o-active', 'o-hist', 'o-plan', 'o-saved']);
    expect(store.migrate(JSON.parse(JSON.stringify(m))).settings.locations.map(l => l.id)).toEqual(m.settings.locations.map(l => l.id));
  });
  test('powtórzone id miejsc (stara kopia): jednorazowe i zwykłe dostają osobne id, plan nie wskazuje „zgubionego” miejsca', async () => {
    const st = await v18(); st.settings.locations.push({ ...loc('Kopia', [], GYM), oneOff: true }); st.planPlaces = { '2026-10-20': GYM };
    const m = store.migrate(JSON.parse(JSON.stringify(st))); const ids = m.settings.locations.map(l => l.id); expect(new Set(ids).size).toBe(ids.length); expect(m.planPlaces).toEqual({ '2026-10-20': GYM });
  });
});

describe('kopia zapasowa i import starszych kopii', () => {
  test('eksport → import bez strat: planPlaces, SavedPlan.places i miejsce jednorazowe w historii; koperta ma schemat 19', async () => {
    await v18(); const p = require('@/lib/plan'); const o = require('@/lib/locations').addOneOffLocation('Hotel Sopot', presetEquipment('hotel'));
    p.setPlanPlace('2026-10-14', '2026-10-16', o.id); p.deactivatePlan(); p.activatePlan(S().savedPlans![0].id); p.setPlanPlace('2026-10-18', '2026-10-18', HOTEL);
    expect(JSON.parse(JSON.stringify(buildBackup())).schemaVersion).toBe(19);
    const back = parseBackup(JSON.stringify(buildBackup())); const want = strip(S()); const got = strip(back);
    expect(got.planPlaces).toEqual(want.planPlaces); expect(got.savedPlans).toEqual(want.savedPlans); expect(got.settings.locations).toEqual(want.settings.locations); expect(got.schemaVersion).toBe(19);
  });
  test('import kopii 18 (bez pól 0.19) i 15 (fixture z 0.9) przechodzi i dostaje schemat 19; goły stan 18 też', async () => {
    const old = await v18(); const fromEnvelope = parseBackup(JSON.stringify({ format: 'trening-backup', schemaVersion: 18, exportedAt: 'x', state: old })); expect(fromEnvelope.schemaVersion).toBe(19);
    expect(parseBackup(JSON.stringify(old)).schemaVersion).toBe(19); const f15 = require('./fixtures/state-090-schema15.json'); const m = parseBackup(JSON.stringify(f15.state ?? f15)); expect(m.schemaVersion).toBe(19);
  });
  test('kopia 19 odrzucana przez starszy build (SCHEMA_VERSION 18) z komunikatem; kopia z przyszłości (20) odrzucana przez ten build', async () => {
    await v18(); require('@/lib/plan').setPlanPlace('2026-10-14', '2026-10-14', HOTEL); const txt = JSON.stringify(buildBackup()); let err = '';
    jest.isolateModules(() => { jest.doMock('@/lib/seed', () => ({ ...jest.requireActual('@/lib/seed'), SCHEMA_VERSION: 18 })); const old = require('@/lib/backup'); try { old.parseBackup(txt); } catch (e) { err = (e as Error).message; } });
    expect(err).toMatch(/19.*18/); const fut = JSON.parse(txt); fut.schemaVersion = 20; expect(() => parseBackup(JSON.stringify(fut))).toThrow(/20/);
  });
  test('baza ze schematem wyższym niż obsługiwany nie jest nadpisywana (J1): dane 20 zostają nietknięte', async () => {
    const old = await v18(); old.schemaVersion = 20; old.planPlaces = { '2026-10-14': HOTEL }; global.__kv.clear(); global.__kv.set('state', JSON.stringify(old)); store.__resetForTests();
    await expect(store.init()).rejects.toMatchObject({ newerSchema: 20 }); expect(JSON.parse(global.__kv.get('state')!).schemaVersion).toBe(20);
  });
});

describe('typ State', () => {
  test('pola 0.19 są opcjonalne w typach (State.planPlaces, SavedPlan.places, Location.oneOff) — stan 18 spełnia typ State', async () => {
    const st: State = await fresh(undefined, 'pl'); const p: State['planPlaces'] = undefined; const l: State['settings']['locations'][number]['oneOff'] = undefined; expect([p, l, st.schemaVersion]).toEqual([undefined, undefined, 19]);
  });
});
