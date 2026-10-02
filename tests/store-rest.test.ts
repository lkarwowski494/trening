/* Runda 74 — przerwa po serii (restAfter / roundRest) na poziomie logiki: przypadki dopisane po testach mutacyjnych lib/store.ts. */
import * as store from '@/lib/store';
import { fresh, ex } from './helpers';

async function start(names: string[], group = false) {
  await fresh(); store.startEmpty(); names.forEach(n => store.addExerciseToActive(ex(n)));
  const a = store.getState().active!; if (group) a.exercises.forEach(e => { e.groupId = 'g'; }); return a;
}
const done = (a: any, ei: number, si: number) => { a.exercises[ei].sets[si].done = true; };
const sets = (a: any, ei: number, kinds: string[]) => { a.exercises[ei].sets = kinds.map((k, i) => ({ ...a.exercises[ei].sets[0], id: `x${ei}_${i}`, kind: k, warmup: k === 'warmup', done: false })); };

describe('restAfter — bez supersetu', () => {
  test('nieistniejący trening / ćwiczenie / seria → null', async () => {
    await fresh(); expect(store.restAfter(0, 0)).toBeNull(); expect(store.roundRest(0)).toBeNull();
    const a = await start(['Back Squat']); expect(store.restAfter(5, 0)).toBeNull(); expect(store.restAfter(0, 9)).toBeNull(); expect(store.roundRest(5)).toBeNull();
    a.exercises[0].restSec = 100; expect(store.restAfter(0, 0)).toBe(100);
  });
  test('drop set: bez przerwy przed nieodhaczonym drop setem; po rozgrzewce przed drop setem — przerwa; po odhaczonym drop secie — przerwa', async () => {
    const a = await start(['Back Squat']); a.exercises[0].restSec = 100; sets(a, 0, ['warmup', 'drop', 'normal', 'drop']);
    expect(store.restAfter(0, 2)).toBeNull();
    ex('Back Squat').restWarmupSec = null as never; expect(store.restAfter(0, 0)).toBe(100); /* rozgrzewka przed drop setem: zwykła przerwa */
    done(a, 0, 3); expect(store.restAfter(0, 2)).toBe(100);
  });
  test('przerwa po rozgrzewce z ćwiczenia tylko dla rozgrzewki; bez niej — przerwa bloku', async () => {
    const a = await start(['Back Squat']); a.exercises[0].restSec = 120; sets(a, 0, ['warmup', 'normal']);
    ex('Back Squat').restWarmupSec = 30; expect(store.restAfter(0, 0)).toBe(30); expect(store.restAfter(0, 1)).toBe(120);
    ex('Back Squat').restWarmupSec = null as never; expect(store.restAfter(0, 0)).toBe(120);
  });
  test('ćwiczenia bez grupy nie blokują się nawzajem (inne ćwiczenie z mniejszą liczbą serii nie wstrzymuje przerwy)', async () => {
    const a = await start(['Back Squat', 'Leg Press']); a.exercises[0].restSec = 90; a.exercises[1].restSec = 200;
    done(a, 0, 0); expect(store.restAfter(0, 0)).toBe(90);
  });
  test('roundRest bez grupy: przerwa własnego ćwiczenia, nie ostatniego bez grupy', async () => {
    const a = await start(['Back Squat', 'Leg Press']); a.exercises[0].restSec = 90; a.exercises[1].restSec = 200;
    expect(store.roundRest(0)).toBe(90); expect(store.roundRest(1)).toBe(200);
  });
});

describe('restAfter — superset', () => {
  test('drop set nie jest osobną rundą: B1, A1, A-drop → przerwa rundy po drop secie', async () => {
    const a = await start(['Back Squat', 'Leg Press'], true); a.exercises[0].restSec = 60; a.exercises[1].restSec = 150;
    sets(a, 0, ['normal', 'drop']); sets(a, 1, ['normal', 'normal']);
    done(a, 1, 0); done(a, 0, 0); expect(store.restAfter(0, 0)).toBeNull(); /* przed nieodhaczonym drop setem */
    done(a, 0, 1); expect(store.restAfter(0, 1)).toBe(150);
  });
  test('rozgrzewka w supersecie: bez przerwy, gdy dalej w grupie są nieodhaczone serie; inaczej własna przerwa ćwiczenia (nie rundy)', async () => {
    const a = await start(['Back Squat', 'Leg Press'], true); a.exercises[0].restSec = 60; a.exercises[1].restSec = 150; ex('Back Squat').restWarmupSec = null as never;
    sets(a, 0, ['warmup', 'normal']); sets(a, 1, ['warmup']);
    done(a, 0, 0); expect(store.restAfter(0, 0)).toBeNull();
    done(a, 1, 0); expect(store.restAfter(0, 0)).toBe(60); /* dalej w grupie nic do zrobienia i runda nie trwa */
  });
  test('rozgrzewka w ostatnim ćwiczeniu grupy nie czeka na wcześniejsze', async () => {
    const a = await start(['Back Squat', 'Leg Press'], true); a.exercises[1].restSec = 150; ex('Leg Press').restWarmupSec = null as never;
    sets(a, 1, ['warmup', 'normal']); done(a, 1, 0); expect(store.restAfter(1, 0)).toBe(150);
  });
  test('runda bez rozgrzewek: B1, A-rozgrzewka, A1 → przerwa rundy (rozgrzewka nie jest rundą)', async () => {
    const a = await start(['Back Squat', 'Leg Press'], true); a.exercises[1].restSec = 150; sets(a, 0, ['warmup', 'normal']); sets(a, 1, ['normal', 'normal']);
    done(a, 1, 0); done(a, 0, 0); done(a, 0, 1); expect(store.restAfter(0, 1)).toBe(150);
  });
  test('rozgrzewka: czeka na grupę, gdy dalej choć jedna seria nieodhaczona; ćwiczenie spoza grupy dalej — nie wstrzymuje', async () => {
    const a = await start(['Back Squat', 'Leg Press', 'Leg Curl']); a.exercises[0].groupId = 'g'; a.exercises[1].groupId = 'g'; a.exercises[0].restSec = 60; ex('Back Squat').restWarmupSec = null as never; ex('Leg Press').restWarmupSec = null as never;
    sets(a, 0, ['warmup', 'normal']); sets(a, 1, ['normal', 'normal']); done(a, 1, 0); done(a, 0, 0);
    expect(store.restAfter(0, 0)).toBeNull(); /* B2 jeszcze nie */
    sets(a, 1, ['warmup', 'normal']); a.exercises[1].restSec = 150; done(a, 1, 0); expect(store.restAfter(1, 0)).toBe(150); /* ostatnie w grupie; Leg Curl (bez grupy) nie wstrzymuje */
  });
  test('ćwiczenie spoza grupy nie wstrzymuje przerwy rundy', async () => {
    const a = await start(['Back Squat', 'Leg Press', 'Leg Curl']); a.exercises[0].groupId = 'g'; a.exercises[1].groupId = 'g'; a.exercises[1].restSec = 150;
    done(a, 0, 0); expect(store.restAfter(0, 0)).toBeNull(); done(a, 1, 0); expect(store.restAfter(1, 0)).toBe(150);
  });
});

describe('runda 75 (Q-006) — superset: pominięta seria i rozgrzewka w trakcie rundy', () => {
  test('pominięta ostatnia seria A: ostatnia seria B (ostatnie ćwiczenie grupy) i tak startuje przerwę rundy', async () => {
    const a = await start(['Back Squat', 'Leg Press'], true); a.exercises[1].restSec = 150; sets(a, 0, ['normal', 'normal', 'normal']); sets(a, 1, ['normal', 'normal', 'normal']);
    done(a, 0, 0); done(a, 1, 0); done(a, 0, 1); done(a, 1, 1); /* A3 pominięta */ done(a, 1, 2);
    expect(store.restAfter(1, 2)).toBe(150);
  });
  test('ale B1 przed A1 nadal nie startuje przerwy (to nie ostatnia seria B)', async () => {
    const a = await start(['Back Squat', 'Leg Press'], true); sets(a, 0, ['normal', 'normal']); sets(a, 1, ['normal', 'normal']);
    done(a, 1, 0); expect(store.restAfter(1, 0)).toBeNull();
  });
  test('ostatnia seria pierwszego ćwiczenia grupy, gdy drugie jeszcze trwa — bez przerwy', async () => {
    const a = await start(['Back Squat', 'Leg Press'], true); sets(a, 0, ['normal']); sets(a, 1, ['normal', 'normal']);
    done(a, 1, 0); done(a, 1, 1); done(a, 0, 0); /* A1 po B1, B2: B ma 2 serie, A 1 — A kończy swoją ostatnią serię, a runda B2 już zamknięta */
    expect(store.restAfter(0, 0)).not.toBeNull();
    const b = await start(['Back Squat', 'Leg Press'], true); sets(b, 0, ['normal']); sets(b, 1, ['normal', 'normal']);
    done(b, 0, 0); expect(store.restAfter(0, 0)).toBeNull(); /* B1 jeszcze nie */
  });
  test('rozgrzewka ostatniego ćwiczenia w środku rundy (A1 zrobiona, B1 nie) — bez przerwy; przed rundą — przerwa po rozgrzewce', async () => {
    const a = await start(['Back Squat', 'Leg Press'], true); a.exercises[1].restSec = 150; ex('Leg Press').restWarmupSec = null as never; sets(a, 0, ['normal', 'normal']); sets(a, 1, ['warmup', 'normal', 'normal']);
    done(a, 0, 0); done(a, 1, 0); expect(store.restAfter(1, 0)).toBeNull();
    const b = await start(['Back Squat', 'Leg Press'], true); b.exercises[1].restSec = 150; sets(b, 0, ['normal']); sets(b, 1, ['warmup', 'normal']);
    done(b, 1, 0); expect(store.restAfter(1, 0)).toBe(150);
  });
});
