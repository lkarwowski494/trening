import * as store from '@/lib/store';
import * as loc from '@/lib/locations';
import { fresh, ex, addWorkout, withDemoTemplates } from '../../tests/helpers';
test('seed', async () => {
  /* od 03.10.2026 świeża instalacja nie ma szablonów — dane zrzutów dokładają jawnie cztery szablony demonstracyjne (tests/fixtures/demo-templates.ts) */
  await fresh(); withDemoTemplates(); const st = store.getState(); st.settings.showRpe = true; /* T-055: gumy bez kg (dawne nominalKg usunięte) */
  const d = 86400e3, now = Date.now();
  for (let i = 8; i >= 1; i--) {
    addWorkout(now - i * 3 * d, [['Bench Press (hantle)', [{ kind: 'warmup', warmup: true, weight: 14, reps: 10 }, { weight: 22 + i % 3 * 2, reps: 8, rpe: 8 }, { weight: 24, reps: i === 1 ? 8 : 7 } /* runda 75: ostatnio na górze zakresu — podpowiedź progresji na zrzucie */, { weight: 18, reps: 10, kind: 'drop' }]], ['Pull Up', [{ addKg: -15, reps: 8, bandId: st.bands[0].id }, { addKg: '', reps: 5 }]], ['Back Squat', [{ weight: 100 + i * 2.5, reps: 5 }, { weight: 100, reps: 5 }]], ['Plank', [{ durationSec: 60 + i * 5 }]], ['Bieg', [{ distanceM: 5000, durationSec: 1500 - i * 10 }]]], i % 2 ? 'Upper A' : 'Legs — siłownia');
  }
  const long = store.newExercise('Wyciskanie hantli na ławce skośnej z pauzą na klatce i wolnym opuszczaniem 3 s'); long.equipment = 'hantle'; store.save(long);
  st.mornings.push({ ...({} as any), id: 'm1', ownerId: 'local', createdAt: now, updatedAt: now, date: store.localISODate(), bb: 72, sleepScore: 81, sleepH: 7.5, weight: 81.2 } as any);
  store.startFromTemplate(st.templates[0]); store.addExerciseToActive(long); store.addExerciseToActive(ex('Plank'));
  const a = st.active!; a.exercises[0].sets[0].done = true; a.exercises[0].sets[0].completedAt = now; store.linkWithNext(a.exercises, 0, a);
  // 0.9.0: miejsce (siłownia jako główne + dom z ławką, drążkiem, poręczami i hantlami) — ekrany miejsc, chip w treningu, filtr w wyborze ćwiczenia
  const gym = loc.addLocation('gym'); const home = loc.addLocation('home');
  for (const it of ['bench_adj', 'pullup_bar', 'dip_bars', 'db_fixed', 'electric']) { try { loc.setEquip(home, it, true); } catch { /* id spoza słownika — pomijamy */ } }
  st.settings.mainLocationId = gym.id; st.active!.locationId = gym.id;
  store.save(); await store.flush();
  require('fs').writeFileSync(process.env.SEED_OUT!, JSON.stringify(store.getState()));
});
