/* Runda 74 — odhaczenie serii (toggleDone) na poziomie logiki: godzina, rzeczywista przerwa i przenoszenie wpisanych wartości
 * na następną serię. Przypadki dopisane po testach mutacyjnych lib/store.ts (wcześniej pokryte głównie testami ekranów). */
import * as store from '@/lib/store';
import { fresh, ex } from './helpers';

let now = 0;
beforeEach(() => { now = new Date(2026, 8, 1, 10, 0, 0).getTime(); jest.spyOn(Date, 'now').mockImplementation(() => now); });
afterEach(() => jest.restoreAllMocks());
async function start(name = 'Back Squat', kinds: string[] = ['normal', 'normal']) {
  await fresh(); store.startEmpty(); store.addExerciseToActive(ex(name)); const a = store.getState().active!; const e = a.exercises[0];
  e.sets = kinds.map((k, i) => ({ ...e.sets[0], id: `s${i}`, kind: k as never, warmup: k === 'warmup', done: false, weight: '', reps: '', durationSec: '', addKg: '', bandId: '' })); return a;
}

describe('toggleDone — godzina i przerwa rzeczywista', () => {
  test('bez treningu / złe indeksy → null bez zmian', async () => {
    await fresh(); expect(store.toggleDone(0, 0)).toBeNull();
    const a = await start(); expect(store.toggleDone(3, 0)).toBeNull(); expect(store.toggleDone(0, 7)).toBeNull(); expect(a.exercises[0].sets.every(s => !s.done)).toBe(true);
  });
  test('`at`: znana godzina wygrywa, ale nie z przyszłości; NaN / brak → teraz', async () => {
    const a = await start('Back Squat', ['normal', 'normal', 'normal']);
    store.toggleDone(0, 0, now - 60e3); expect(a.exercises[0].sets[0].completedAt).toBe(now - 60e3);
    store.toggleDone(0, 1, now + 60e3); expect(a.exercises[0].sets[1].completedAt).toBe(now);
    store.toggleDone(0, 2, Number.NaN); expect(a.exercises[0].sets[2].completedAt).toBe(now);
  });
  test('przerwa rzeczywista: od poprzedniej odhaczonej serii, < 1 h; pierwsza seria, zegar cofnięty i równa godzina — brak', async () => {
    const a = await start('Back Squat', ['normal', 'normal', 'normal', 'normal', 'normal']); const s = a.exercises[0].sets;
    store.toggleDone(0, 0); expect(s[0].actualRest).toBeNull();
    now += 90e3; store.toggleDone(0, 1); expect(s[1].actualRest).toBe(90);
    store.toggleDone(0, 2); expect(s[2].actualRest).toBeNull(); /* ta sama chwila */
    now += 3600e3; store.toggleDone(0, 3); expect(s[3].actualRest).toBeNull(); /* dokładnie godzina */
    now -= 600e3; store.toggleDone(0, 4); expect(s[4].actualRest).toBeNull(); /* zegar cofnięty */
  });
  test('przerwa tuż poniżej godziny jest liczona', async () => {
    const a = await start(); store.toggleDone(0, 0); now += 3599e3; store.toggleDone(0, 1); expect(a.exercises[0].sets[1].actualRest).toBe(3599);
  });
});

describe('toggleDone — wartości na następną serię', () => {
  test('tylko pola wpisane w tej serii, bez czasu; do pustych pól następnej, nieodhaczonej serii', async () => {
    const a = await start('Back Squat', ['normal', 'normal', 'normal']); const s = a.exercises[0].sets;
    Object.assign(s[0], { weight: 100, reps: 5 }); s[1].reps = 3; store.toggleDone(0, 0);
    expect([s[1].weight, s[1].reps]).toEqual([100, 3]);
    s[2].done = true; Object.assign(s[1], { weight: 110 }); store.toggleDone(0, 1); expect(s[2].weight).toBe('');
  });
  test('czas serii nie przechodzi (w serii czasowej to cel stopera)', async () => {
    const a = await start('Plank'); const s = a.exercises[0].sets; s[0].durationSec = 60; store.toggleDone(0, 0); expect(s[1].durationSec).toBe('');
  });
  test('rodziny serii: rozgrzewka→rozgrzewka, drop→drop, zwykła→do upadku tak; rozgrzewka→robocza i drop→zwykła nie', async () => {
    const pairs: [string, string, boolean][] = [['warmup', 'warmup', true], ['drop', 'drop', true], ['normal', 'failure', true], ['failure', 'normal', true], ['warmup', 'normal', false], ['drop', 'normal', false], ['normal', 'drop', false], ['normal', 'warmup', false]];
    for (const [k1, k2, carry] of pairs) {
      const a = await start('Back Squat', [k1, k2]); const s = a.exercises[0].sets; s[0].weight = 77; store.toggleDone(0, 0);
      expect([k1, k2, s[1].weight]).toEqual([k1, k2, carry ? 77 : '']);
    }
  });
  test('asysta (±kg) z gumą przechodzi tylko z gumą; ukryta guma (asysta gumą wyłączona) nie blokuje dociążenia', async () => {
    let a = await start('Pull Up'); let s = a.exercises[0].sets; ex('Pull Up').bandAssistable = true;
    Object.assign(s[0], { reps: 8, bandId: store.getState().bands[0].id, addKg: -15 }); store.toggleDone(0, 0);
    expect([s[1].bandId, s[1].addKg]).toEqual([s[0].bandId, -15]);
    a = await start('Pull Up'); s = a.exercises[0].sets; ex('Pull Up').bandAssistable = false;
    Object.assign(s[0], { reps: 8, bandId: store.getState().bands[0].id, addKg: 5 }); store.toggleDone(0, 0);
    expect(s[1].addKg).toBe(5); expect(s[1].bandId).toBe('');
    a = await start('Pull Up'); s = a.exercises[0].sets; ex('Pull Up').bandAssistable = false;
    Object.assign(s[0], { reps: 8, bandId: store.getState().bands[0].id, addKg: -15 }); store.toggleDone(0, 0);
    expect(s[1].addKg).toBe(''); /* asysta należała do ukrytej gumy */
  });
  test('wartości z podpowiedzi „Poprzednio” nie przechodzą jako wpisane (następna seria dostaje własną podpowiedź)', async () => {
    await fresh(); const { addWorkout } = require('./helpers'); addWorkout(now - 3 * 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]); store.save();
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; const sets = a.exercises[0].sets; while (sets.length < 2) store.addSet(0);
    sets[0].weight = 110; store.toggleDone(0, 0);
    expect(sets[0].reps).toBe(5); /* z podpowiedzi */ expect(sets[1].weight).toBe(110); expect(sets[1].reps).toBe('');
  });
  test('ukryta guma: dociążenie 0 kg przechodzi (blokowana tylko asysta ujemna)', async () => {
    const a = await start('Pull Up'); const s = a.exercises[0].sets; ex('Pull Up').bandAssistable = false;
    Object.assign(s[0], { reps: 8, bandId: store.getState().bands[0].id, addKg: 0 }); store.toggleDone(0, 0); expect(s[1].addKg).toBe(0);
  });
});

describe('toggleDone — guma na następną serię i cofnięcie odhaczenia (runda 74, mutacje)', () => {
  const pull = async (kinds = ['normal', 'normal']) => { const a = await start('Pull Up', kinds); ex('Pull Up').bandAssistable = true; const bands = store.getState().bands; return { a, s: a.exercises[0].sets, b1: bands[0].id, b2: bands[1].id }; };
  test('guma z asystą przechodzi na pustą serię i na serię z ±0; nie na serię z własnym obciążeniem, inną gumą ani zdjętą ręcznie', async () => {
    let { s, b1, b2 } = await pull(); Object.assign(s[0], { reps: 8, bandId: b1, addKg: -15 }); s[1].addKg = 0; store.toggleDone(0, 0); expect([s[1].bandId, s[1].addKg]).toEqual([b1, -15]);
    ({ s, b1, b2 } = await pull()); Object.assign(s[0], { reps: 8, bandId: b1, addKg: -15 }); s[1].addKg = 5; store.toggleDone(0, 0); expect([s[1].bandId, s[1].addKg]).toEqual(['', 5]);
    ({ s, b1, b2 } = await pull()); Object.assign(s[0], { reps: 8, bandId: b1, addKg: -15 }); s[1].bandId = b2; store.toggleDone(0, 0); expect([s[1].bandId, s[1].addKg]).toEqual([b2, '']);
    ({ s, b1, b2 } = await pull()); Object.assign(s[0], { reps: 8, bandId: b1, addKg: -15 }); s[1].noBand = true; store.toggleDone(0, 0); expect(s[1].bandId).toBe('');
  });
  test('ta sama guma w następnej serii bez asysty — asysta dopisana; z własną asystą — zostaje', async () => {
    let { s, b1 } = await pull(); Object.assign(s[0], { reps: 8, bandId: b1, addKg: -15 }); s[1].bandId = b1; store.toggleDone(0, 0); expect(s[1].addKg).toBe(-15);
    ({ s, b1 } = await pull()); Object.assign(s[0], { reps: 8, bandId: b1, addKg: -15 }); s[1].bandId = b1; s[1].addKg = -10; store.toggleDone(0, 0); expect(s[1].addKg).toBe(-10);
  });
  test('guma bez wpisanej asysty: następna seria dostaje gumę, a asystę z kg gumy (gdy podane)', async () => {
    const { s, b1 } = await pull(); store.getState().bands[0].nominalKg = 20; Object.assign(s[0], { reps: 8, bandId: b1 }); store.toggleDone(0, 0);
    expect([s[1].bandId, s[1].addKg]).toEqual([b1, -20]);
  });
  test('gdy „Poprzednio” podpowiada następną serię, guma z tej serii nie przechodzi', async () => {
    await fresh(); ex('Pull Up').bandAssistable = true; const { addWorkout } = require('./helpers'); addWorkout(now - 86400e3, [['Pull Up', [{ reps: 6 }, { reps: 6 }]]]); store.save();
    store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); const a = store.getState().active!; const s = a.exercises[0].sets; while (s.length < 2) store.addSet(0);
    Object.assign(s[0], { reps: 8, bandId: store.getState().bands[0].id, addKg: -15 }); store.toggleDone(0, 0); expect(s[1].bandId).toBe('');
  });
  test('cofnięcie odhaczenia zdejmuje wartości z podpowiedzi, które się nie zmieniły; zmienione zostają', async () => {
    await fresh(); const { addWorkout } = require('./helpers'); addWorkout(now - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); store.save();
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const s = store.getState().active!.exercises[0].sets;
    store.toggleDone(0, 0); expect([s[0].weight, s[0].reps]).toEqual([100, 5]); store.toggleDone(0, 0); expect([s[0].weight, s[0].reps, s[0].hinted, s[0].completedAt]).toEqual(['', '', undefined, null]);
    store.toggleDone(0, 0); s[0].reps = 6; store.toggleDone(0, 0); expect([s[0].weight, s[0].reps]).toEqual(['', 6]);
  });
  test('cofnięcie: guma z podpowiedzi zabiera swoją asystę; po zmianie gumy asysta zostaje; zdjęta guma zabiera poprawioną asystę', async () => {
    const setup = async () => { await fresh(); ex('Pull Up').bandAssistable = true; const b = store.getState().bands; const { addWorkout } = require('./helpers');
      addWorkout(now - 86400e3, [['Pull Up', [{ reps: 6, bandId: b[0].id, addKg: -15 }]]]); store.save(); store.startEmpty(); store.addExerciseToActive(ex('Pull Up'));
      const s = store.getState().active!.exercises[0].sets; store.toggleDone(0, 0); return { s, b }; };
    let { s, b } = await setup(); expect([s[0].bandId, s[0].addKg]).toEqual([b[0].id, -15]); store.toggleDone(0, 0); expect([s[0].bandId, s[0].addKg]).toEqual(['', '']);
    ({ s, b } = await setup()); s[0].bandId = b[1].id; store.toggleDone(0, 0); expect([s[0].bandId, s[0].addKg]).toEqual([b[1].id, -15]);
    ({ s, b } = await setup()); s[0].addKg = -10; store.toggleDone(0, 0); expect([s[0].bandId, s[0].addKg]).toEqual(['', '']); /* runda 53: guma z podpowiedzi zdjęta przy cofnięciu zabiera poprawioną asystę */
    ({ s, b } = await setup()); s[0].bandId = ''; s[0].addKg = -10; store.toggleDone(0, 0); expect([s[0].bandId, s[0].addKg]).toEqual(['', -10]); /* guma zdjęta ręcznie przed cofnięciem — wpis użytkownika zostaje */
    ({ s, b } = await setup()); s[0].bandId = b[1].id; store.toggleDone(0, 0); expect(s[0].reps).toBe(''); /* zmiana gumy nie blokuje czyszczenia innych pól z podpowiedzi */
    ({ s, b } = await setup()); s[0].addKg = 0; store.toggleDone(0, 0); expect([s[0].bandId, s[0].addKg]).toEqual(['', 0]); /* wpisane ±0 to wynik, nie asysta */
    ({ s, b } = await setup()); s[0].bandId = ''; s[0].addKg = 5; store.toggleDone(0, 0); expect(s[0].addKg).toBe(5); /* dociążenie to już nie asysta gumy */
  });
  test('cofnięcie z uszkodzonym „hinted” (nie obiekt) — bez błędu, znacznik czyszczony', async () => {
    const a = await start(); const s = a.exercises[0].sets; s[0].weight = 100; store.toggleDone(0, 0); s[0].hinted = 'x' as never; store.toggleDone(0, 0);
    expect([s[0].weight, s[0].hinted, s[0].done]).toEqual([100, undefined, false]);
  });
});
