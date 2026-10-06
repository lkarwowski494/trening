/* Przegląd spójności 06.10.2026 (sprzęt ↔ ćwiczenia, gumy oporowe) — testy odtwarzające znaleziska. */
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import { fresh, ex, addWorkout } from './helpers';
import { addLocation, setEquip, setBandLevel, activeEquip } from '@/lib/locations';

beforeEach(async () => { await fresh(); });
test('WYSOKIE: rekordy ćwiczeń z gumą oporową liczą serie z gumą (dotąd suma powtórzeń 0)', () => {
  const b = store.getState().bands[0]; addWorkout(Date.now() - 86400000, [['Band Pull Apart', [{ reps: 15, bandId: b.id }, { reps: 12, bandId: b.id }]]]);
  expect(stats.sessionsFor(ex('Band Pull Apart')).map(s => s.total)).toEqual([27]);
  expect(stats.recordsFor(ex('Band Pull Apart')).maxReps).toBe(15);
  /* asysta gumą — bez zmian: seria z gumą nie jest „bez asysty” */
  addWorkout(Date.now() - 86400000, [['Pull Up', [{ reps: 8, bandId: b.id, addKg: '' }]]]); expect(stats.recordsFor(ex('Pull Up')).maxRepsFree).toBe(0);
});
test('ŚREDNIE: podpowiedź „↑” dla sztangi z gumami (Deadlift with Bands) nie znika przez gumę', () => {
  const b = store.getState().bands[0]; const sets = [{ weight: 100, reps: 8, bandId: b.id }, { weight: 100, reps: 8, bandId: b.id }] as any;
  const w = addWorkout(Date.now() - 86400000, [['Deadlift with Bands', sets]]);
  expect(store.progressionFor(ex('Deadlift with Bands'), 8, w.exercises[0].sets)).not.toBeNull();
  const pu = addWorkout(Date.now() - 86400000, [['Pull Up', [{ reps: 8, bandId: b.id, addKg: '' }]]]);
  expect(store.progressionFor(ex('Pull Up'), 8, pu.exercises[0].sets)).toBeNull(); /* asysta — bez zmian */
});
test('ŚREDNIE: guma tylko w „zalecanym” sprzęcie (Fire Hydrant, Clamshell) też ma przycisk gumy', () => {
  const rec = store.getState().exercises.filter(e => !e.archived && (e.recommended ?? []).includes('bands'));
  expect(rec.length).toBeGreaterThan(0); for (const e of rec) expect([e.name, store.usesBand(e)]).toEqual([e.name, true]);
});
test('NISKIE: gumy w miejscu z odznaczonymi wszystkimi poziomami — przycisk nie wybiera gumy spoza miejsca', () => {
  const l = addLocation('home'); setEquip(l, 'bands', true); for (const lv of activeEquip(l, 'bands')!.levels!.slice()) setBandLevel(l, lv, false);
  expect(activeEquip(l, 'bands')!.levels).toEqual([]); expect(store.nextBandId('', l.id)).toBe('');
});
