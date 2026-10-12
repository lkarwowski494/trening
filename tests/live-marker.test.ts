/*
 * 0.16.0 (decyzja właściciela 12.10.2026, P11 B; docs/27 4.3–4.4): znacznik `Workout.live` — trening rozpoczęty NA ŻYWO w aplikacji (start z szablonu,
 * pusty trening, „Powtórz ostatni”), nigdy trening dopisany wstecz, zaimportowany z CSV ani przestawiony edycją. Pole opcjonalne (tylko `true`), bez
 * podnoszenia SCHEMA_VERSION (precedens `doneEarly`, `deload`, `healthPending`). Nic się jeszcze z nim nie liczy (licznik subskrypcji — 0.17).
 * Rodzaje (docs/20): logika (kto ustawia znacznik), dane (migrate, idempotencja, zapis → restart, kopia, kopia bez pola, nowsza wersja czyta pole),
 * niezmiennik (edycja i „Kontynuuj” go nie zmieniają). Bez UI i bez E2E — pole niewidoczne dla użytkownika (docs/09, wiersz 0.16.0).
 */
import * as store from '@/lib/store';
import * as edit from '@/lib/edit';
import { parseBackup, buildBackup, buildCsv } from '@/lib/backup';
import { parseImport, buildImport } from '@/lib/csvparse';
import { SCHEMA_VERSION } from '@/lib/seed';
import { fresh, saved, ex, addWorkout, withDemoTemplates } from './helpers';

const S = () => store.getState();
beforeEach(async () => { await fresh(); });
const tick = () => { store.getState().active!.exercises.forEach(e => e.sets.forEach(s => { s.done = true; s.weight = 50; s.reps = 5; })); };

describe('logika: kto ustawia znacznik', () => {
  test('start z szablonu, pusty trening i „Powtórz ostatni” — live: true; po „Zakończ” zostaje w historii', () => {
    const [tpl] = withDemoTemplates();
    expect(store.startFromTemplate(tpl)).toBe(true); expect(S().active!.live).toBe(true); tick();
    const done = store.finishWorkout()!; expect(done.live).toBe(true); expect(S().workouts.find(w => w.id === done.id)!.live).toBe(true);
    expect(store.startEmpty()).toBe(true); expect(S().active!.live).toBe(true); store.cancelWorkout();
    expect(store.repeatLast()).toBe(true); expect(S().active!.live).toBe(true);
  });
  test('trening dopisany wstecz (edytor) — bez znacznika', () => {
    const start = Date.now() - 3 * 864e5; const d = edit.beginPast(null, start, start + 3600e3); edit.draftAddExercise(d.key, ex('Back Squat'));
    const s0 = edit.draftOf(d.key)!.w.exercises[0].sets[0]; s0.weight = 100; s0.reps = 5;
    const r = edit.commitDraft(d.key); expect('w' in r).toBe(true); if ('w' in r) { expect(r.w.live).toBeUndefined(); expect('live' in r.w).toBe(false); expect(S().workouts.find(w => w.id === r.w.id)!.live).toBeUndefined(); }
  });
  test('import CSV — bez znacznika', () => {
    const csv = ['Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE', '2026-09-01 18:00:00,Push,1h,Back Squat,1,100,5,0,0,,,'].join('\n');
    const p = buildImport(parseImport(csv, Date.now()), S(), { unit: 'kg' }); expect(p.workouts.length).toBeGreaterThan(0); expect(p.workouts.every(w => !('live' in w))).toBe(true);
  });
  test('niezmiennik: edycja zakończonego treningu na żywo zachowuje znacznik, edycja treningu wstecz go nie dokłada', () => {
    const [tpl] = withDemoTemplates(); store.startFromTemplate(tpl); tick(); const live = store.finishWorkout()!;
    const d = edit.beginEdit(live.id)!; edit.draftSetWhen(d.key, { date: edit.dateText(Date.now() - 2 * 864e5), time: '10:00', min: '75' }); /* przesunięcie daty też nie zmienia znacznika */ const r = edit.commitDraft(d.key); expect(r).not.toHaveProperty('error');
    expect(S().workouts.find(w => w.id === live.id)!.live).toBe(true);
    const old = addWorkout(Date.now() - 5 * 864e5, [['Back Squat', [{ weight: 100, reps: 5 }]]]); const d2 = edit.beginEdit(old.id)!; edit.draftSetWhen(d2.key, { min: '75' }); edit.commitDraft(d2.key);
    expect(S().workouts.find(w => w.id === old.id)!.live).toBeUndefined();
  });
  test('„Kontynuuj” porzuconego treningu (ackStale) nie zmienia znacznika', () => {
    store.startEmpty(); expect(S().active!.live).toBe(true); store.ackStale(); expect(S().active!.live).toBe(true); expect(S().active!.staleAck).toBeGreaterThan(0);
  });
});

describe('dane: migrate, zapis, kopia', () => {
  const withLive = (v: unknown) => { const w = addWorkout(Date.now() - 864e5, [['Back Squat', [{ weight: 100, reps: 5 }]]]); const raw = JSON.parse(JSON.stringify(S())); raw.workouts.find((x: any) => x.id === w.id).live = v; return { raw, id: w.id }; };
  test('tylko true zostaje; false, 1, „yes”, null, obiekt — odpadają; idempotentne', () => {
    for (const [v, keep] of [[true, true], [false, false], [1, false], ['yes', false], [null, false], [{}, false]] as [unknown, boolean][]) {
      const { raw, id } = withLive(v); const m = store.migrate(raw); const w = m.workouts.find(x => x.id === id)!;
      expect([v, w.live]).toEqual([v, keep ? true : undefined]); expect('live' in w).toBe(keep);
      expect(JSON.stringify(store.migrate(JSON.parse(JSON.stringify(m))))).toBe(JSON.stringify(m));
    }
  });
  test('trening w toku: znacznik przechodzi migrację', () => {
    store.startEmpty(); const raw = JSON.parse(JSON.stringify(S())); expect(raw.active.live).toBe(true); expect(store.migrate(raw).active!.live).toBe(true);
    raw.active.live = 'x'; expect('live' in store.migrate(raw).active!).toBe(false);
  });
  test('zapis → restart: znacznik ten sam; kopia JSON: eksport → import bez strat; schemat bez zmiany', async () => {
    const [tpl] = withDemoTemplates(); store.startFromTemplate(tpl); tick(); const done = store.finishWorkout()!; addWorkout(Date.now() - 9 * 864e5, [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Wstecz');
    await store.flush(); const snap = saved(); await fresh(snap);
    expect(S().workouts.find(w => w.id === done.id)!.live).toBe(true); expect(S().workouts.filter(w => w.live).length).toBe(1);
    const env = buildBackup(); expect(env.schemaVersion).toBe(SCHEMA_VERSION); const back = parseBackup(JSON.stringify(env));
    expect(back.workouts.find(w => w.id === done.id)!.live).toBe(true); expect(back.workouts.filter(w => w.live).length).toBe(1); expect(back.schemaVersion).toBe(SCHEMA_VERSION);
  });
  test('kopia i zapis sprzed 0.16 (bez pola) wczytują się bez znacznika i bez błędu; CSV nie ma kolumny „live”', async () => {
    addWorkout(Date.now() - 864e5, [['Back Squat', [{ weight: 100, reps: 5 }]]]); const env = JSON.parse(JSON.stringify(buildBackup()));
    expect(env.state.workouts.every((w: any) => !('live' in w))).toBe(true); const back = parseBackup(JSON.stringify(env)); expect(back.workouts.every(w => w.live === undefined)).toBe(true);
    const [tpl] = withDemoTemplates(); store.startFromTemplate(tpl); tick(); store.finishWorkout();
    expect(buildCsv().split('\n')[0].toLowerCase()).not.toContain('live');
  });
});
