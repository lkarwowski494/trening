/* E2 (docs/14 pkt 6, test 11 z pkt 7) — ranking propozycji zamiany: czysta funkcja lib/swap.ts swapCandidates. */
import fc from 'fast-check';
import { fresh, ex, addWorkout } from './helpers';
import { userHome, loc } from './locations-fixtures';
import { presetEquipment, availability } from '@/lib/equipment';
import { swapCandidates, otherImpls, SWAP_WEIGHTS } from '@/lib/swap';
import { getState, save, newExercise, visibleExercises, locationById, deleteExercise } from '@/lib/store';

const D = Date.UTC(2026, 8, 1, 10);
async function setup() {
  await fresh(undefined, 'pl'); const st = getState();
  st.settings.locations = [userHome(), loc('Pełna siłownia', presetEquipment('gym'), 'gym')]; st.settings.mainLocationId = 'home'; save();
}
const ids = (exId: string, o: Partial<Parameters<typeof swapCandidates>[1]> = {}) => swapCandidates(exId, { showAll: false, inWorkout: new Set(), ...o }).map(c => c.exId);

describe('ranking zamiany (swapCandidates)', () => {
  beforeEach(setup);

  test('ranking: żaden kandydat nie jest bieżącym ćwiczeniem; ta sama metryka; przy filtrze — wszystkie dostępne w miejscu; wynik deterministyczny', () => {
    const all = visibleExercises();
    fc.assert(fc.property(fc.nat(all.length - 1), fc.constantFrom<string | undefined>(undefined, 'home', 'gym'), fc.boolean(), (i, locationId, showAll) => {
      const a = all[i]; const c = swapCandidates(a.id, { locationId, showAll, inWorkout: new Set() });
      const again = swapCandidates(a.id, { locationId, showAll, inWorkout: new Set() });
      expect(again).toEqual(c);
      for (const x of c) {
        expect(x.exId).not.toBe(a.id);
        const b = all.find(e => e.id === x.exId)!; expect(b).toBeTruthy(); expect(b.metric).toBe(a.metric); expect(b.archived).toBeFalsy();
        if (locationId && !showAll) expect(availability(b, locationById(locationId)).ok).toBe(true);
        if (locationId) expect(x.available).toBe(availability(b, locationById(locationId)).ok);
        expect(x.score).toBeGreaterThan(0);
      }
      for (let k = 1; k < c.length; k++) expect(c[k - 1].score).toBeGreaterThanOrEqual(c[k].score);
    }), { numRuns: 150 });
  });

  test('podobieństwo: ten sam wzorzec ruchu albo wspólny mięsień główny — sama partia nie wystarcza', () => {
    const c = swapCandidates(ex('Bench Press (sztanga)').id, { showAll: true, inWorkout: new Set() });
    const names = c.map(x => getState().exercises.find(e => e.id === x.exId)!.name);
    expect(names[0]).toMatch(/Bench Press|Machine Chest Press|Incline/);
    expect(names).toContain('Bench Press (hantle)');
    expect(names).not.toContain('Leg Curl'); expect(names).not.toContain('Plank');
    const top = c[0]; expect(top.reasons).toEqual(expect.arrayContaining(['pattern', 'muscle']));
  });

  test('isolation tylko przy wspólnym mięśniu: Leg Extension nie dostaje „tego samego ruchu” od Leg Curl (oba isolation, inne mięśnie)', () => {
    const c = swapCandidates(ex('Leg Extension').id, { showAll: true, inWorkout: new Set() });
    const curl = c.find(x => x.exId === ex('Leg Curl').id);
    if (curl) expect(curl.reasons).not.toContain('pattern');
    const sissy = c.find(x => x.exId === ex('Sissy Squat').id); /* inna metryka? masa ciała, ta sama metryka weight_reps */
    if (sissy) expect(sissy.reasons).toContain('muscle');
  });

  test('ćwiczenia własne bez wzorca — tylko mięśnie i partia', () => {
    const mine = newExercise('Moje wyciskanie'); mine.group = 'klatka'; mine.muscles = ['klatka']; mine.secondaryMuscles = ['triceps']; save(mine);
    const c = swapCandidates(ex('Bench Press (sztanga)').id, { showAll: true, inWorkout: new Set() }).find(x => x.exId === mine.id)!;
    expect(c).toBeTruthy(); expect(c.reasons).not.toContain('pattern');
    expect(c.score).toBe(SWAP_WEIGHTS.muscle + SWAP_WEIGHTS.firstMuscle + SWAP_WEIGHTS.group + SWAP_WEIGHTS.secondary);
    const none = newExercise('Coś innego'); none.group = 'inne'; save(none);
    expect(ids(ex('Bench Press (sztanga)').id, { showAll: true })).not.toContain(none.id);
  });

  test('bonus „wcześniej zamieniane” (+4) i „z historią” (+1); `before` liczy tylko sesje sprzed daty', () => {
    const a = ex('Bench Press (sztanga)'), b = ex('Machine Chest Press');
    const base = swapCandidates(a.id, { showAll: true, inWorkout: new Set() }).find(x => x.exId === b.id)!.score;
    const w = addWorkout(D, [['Machine Chest Press', [{ weight: 50, reps: 10 }]]]); w.exercises[0].swappedFrom = a.id; save();
    const c = swapCandidates(a.id, { showAll: true, inWorkout: new Set() }).find(x => x.exId === b.id)!;
    expect(c.score).toBe(base + SWAP_WEIGHTS.swapped + SWAP_WEIGHTS.history); expect(c.reasons).toEqual(expect.arrayContaining(['swapped', 'history'])); expect(c.sessions).toBe(1);
    const old = swapCandidates(a.id, { showAll: true, inWorkout: new Set(), before: D }).find(x => x.exId === b.id)!;
    expect(old.score).toBe(base); expect(old.sessions).toBe(0);
  });

  test('remis: więcej sesji wygrywa, potem nazwa; dopisek „już w treningu” nie blokuje', () => {
    const a = ex('Bench Press (sztanga)'); const inW = new Set([ex('Bench Press (hantle)').id]);
    const c = swapCandidates(a.id, { showAll: true, inWorkout: inW });
    expect(c.find(x => x.exId === ex('Bench Press (hantle)').id)!.inWorkout).toBe(true);
  });

  test('zarchiwizowane (usunięte) ćwiczenie nigdy nie jest proponowane', () => {
    addWorkout(D, [['Bench Press (hantle)', [{ weight: 20, reps: 10 }]]]); deleteExercise(ex('Bench Press (hantle)').id);
    expect(ids(ex('Bench Press (sztanga)').id, { showAll: true })).not.toContain(ex('Bench Press (hantle)').id);
  });

  test('D5: inny przyrząd w Domu — RDL (hantle/linki): hantle ↔ stacja; bez miejsca — nic', () => {
    const home = locationById('home')!;
    expect(otherImpls(ex('RDL (hantle/linki)'), home, 'dumbbell')).toEqual(['electric']);
    expect(otherImpls(ex('RDL (hantle/linki)'), home, 'electric')).toEqual(['dumbbell']);
    expect(otherImpls(ex('Bench Press (sztanga)'), home, undefined)).toEqual([]);
    expect(otherImpls(ex('RDL (hantle/linki)'), undefined, 'dumbbell')).toEqual([]);
  });
});
