/*
 * M1-audytor-generalny-007: start aplikacji na zapisach bazy z WYDANYCH buildów (tests/fixtures/released/*.json — klucze „state”, „live”, „cfg” wygenerowane z kodu
 * tagów v0.11.0-b1005 i v0.18.0-b1017 (schemat 18) oraz v0.20.0-b1018 (schemat 19); dane syntetyczne). Schematu 17 nie wydano (tagi od v0.11.0 mają 18) —
 * jego kształt odtwarza drabina w tests/matrix-migrations.test.tsx. Sprawdzamy: start bez kopii odzysku, dane użytkownika 1:1, konfiguracja z „cfg”,
 * kopia surowego zapisu przed migracją (M1-002) tylko dla starszego schematu, restart daje ten sam stan.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import { SCHEMA_VERSION } from '@/lib/seed';
import { fresh, saved } from './helpers';
import { stateProblems, strip, clone } from './matrix-data-shared';

jest.setTimeout(60000);
const DIR = path.join(__dirname, 'fixtures', 'released');
const FILES = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort();

test('są fixture’y z wydanych buildów dla schematów 18 i 19', () => {
  const schemas = FILES.map(f => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')).schemaVersion);
  expect(schemas).toContain(18); expect(schemas).toContain(19); expect(FILES.length).toBeGreaterThanOrEqual(3);
});

describe.each(FILES)('zapis z wydanego builda: %s', file => {
  const fx = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
  const load = async () => {
    await fresh(); global.__kv.clear();
    global.__kv.set('state', JSON.stringify(fx.state)); if (fx.live) global.__kv.set('live', JSON.stringify(fx.live)); if (fx.cfg) global.__kv.set('cfg', JSON.stringify(fx.cfg));
    store.__resetForTests(); await store.init(); return store.getState();
  };
  const sets = (ws: any[]) => ws.map(w => [w.id, w.templateName, w.startedAt, w.exercises.map((e: any) => e.sets.map((s: any) => [s.id, s.weight, s.reps, s.kind, s.rpe, s.note, s.done]))]);

  test('start bez kopii odzysku; treningi, szablony, trening w toku i plan 1:1; konfiguracja z „cfg” nałożona', async () => {
    const st = await load();
    expect(store.getRecovery()).toBeNull(); expect([...global.__kv.keys()].filter(k => k.startsWith('state_corrupt'))).toEqual([]);
    expect(stateProblems(st)).toEqual([]); expect(st.schemaVersion).toBe(SCHEMA_VERSION);
    expect(sets(st.workouts)).toEqual(sets(fx.state.workouts)); /* historia: każda seria z wartościami */
    expect(st.templates.map(t => [t.id, t.name, t.items.map(i => [i.exerciseId, i.sets])])).toEqual(fx.state.templates.map((t: any) => [t.id, t.name, t.items.map((i: any) => [i.exerciseId, i.sets])]));
    for (const w of st.workouts) for (const e of w.exercises) expect(st.exercises.some(x => x.id === e.exerciseId)).toBe(true); /* bez osieroconych ćwiczeń */
    expect(st.active?.id).toBe(fx.live.active.id); expect(st.active!.exercises.flatMap(e => e.sets.map(s => [s.weight, s.reps, s.done]))).toEqual(fx.live.active.exercises.flatMap((e: any) => e.sets.map((s: any) => [s.weight, s.reps, s.done])));
    expect(st.settings.defaultRest).toBe(fx.cfg.data.settings.defaultRest); /* „cfg” nowszy niż „state” */
    expect(st.weekPlan).toEqual(fx.state.weekPlan); expect(st.planHistory).toEqual(fx.state.planHistory); expect(st.savedPlans).toEqual(fx.state.savedPlans);
    expect(st.planPlaces).toEqual(fx.state.planPlaces); expect(st.settings.locations.map(l => [l.id, l.name, l.oneOff])).toEqual(fx.state.settings.locations.map((l: any) => [l.id, l.name, l.oneOff]));
    expect(st.bodyMassLog).toEqual(fx.state.bodyMassLog); expect(st.mornings.map(m => [m.date, m.bb, m.weight])).toEqual(fx.state.mornings.map((m: any) => [m.date, m.bb, m.weight]));
  });
  test('kopia sprzed migracji tylko dla starszego schematu i jest surowym zapisem; schemat bieżący nie tworzy kopii', async () => {
    await load(); const key = `premigrate_${fx.schemaVersion}`;
    if (fx.schemaVersion < SCHEMA_VERSION) {
      const env = JSON.parse(global.__kv.get(key)!); expect(env.state).toEqual(fx.state); expect(env.live).toEqual(fx.live); expect(env.cfg).toEqual(fx.cfg);
    } else expect([...global.__kv.keys()].filter(k => k.startsWith('premigrate_'))).toEqual([]);
  });
  test('restart po migracji: ten sam stan, drugi start bez nowej kopii', async () => {
    const st = await load(); await store.flush(); const before = strip(clone(st)); const keys = [...global.__kv.keys()].filter(k => k.startsWith('premigrate_')).sort();
    const again = await fresh(saved()); expect(strip(clone(again))).toEqual(before); expect(keys.length).toBeLessThanOrEqual(1);
  });
});
