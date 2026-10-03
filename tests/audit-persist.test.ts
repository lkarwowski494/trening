/* Runda 72 — testy z audytu tematycznego T4 (trwałość/porzucony trening, wymiana danych). Nazwy części testów opisują scenariusz dawnego błędu; asercje sprawdzają poprawne zachowanie. */
import * as store from '@/lib/store';
import { fresh, ex, seedState, withDemoTemplates } from './helpers';

jest.setTimeout(30000);
const H = 3600e3;
afterEach(() => { (global as any).__dbFail = false; });

/** Trening w toku z jedną odhaczoną serią roboczą, wszystko zapisane. Szablony demonstracyjne (świeża instalacja nie ma szablonów od 03.10.2026) —
 * zmiana szablonu to tu sposób na pełny zapis bez treningu. */
async function withDoneSet() {
  await fresh(); withDemoTemplates(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat'));
  const s = store.getState().active!.exercises[0].sets[0]; s.weight = 100; s.reps = 5; store.toggleDone(0, 0); await store.flush();
}

test('A: finishWorkout during an in-flight FULL write + kill before next state write -> workout lost', async () => {
  await withDoneSet();
  const activeId = store.getState().active!.id;
  // pełny zapis wywołany np. zmianą szablonu (save() bez treningu → fullDirty)
  const tpl = store.getState().templates[0]; tpl.name = 'X'; store.save(tpl);
  let n = 0; let crash: Map<string, string> | null = null;
  (global as any).__dbFail = (k: string) => {
    if (k === 'state') {
      n++;
      if (n === 1) store.finishWorkout();            // użytkownik kończy trening, gdy pełny zapis jest „w locie”
      if (n === 2) crash = new Map(global.__kv);      // apka ubita zanim drugi pełny zapis wylądował
    }
    return false;
  };
  await store.flush(); await store.flush(); await store.flush();
  expect(n).toBeGreaterThanOrEqual(2);
  global.__kv = crash!; (global as any).__dbFail = false;
  store.__resetForTests(); await store.init();
  const st = store.getState();
  const kept = st.active?.id === activeId || st.workouts.some(w => w.id === activeId);
  expect(kept).toBe(true);
});

test('A2: same race, second full write fails (disk full) -> workout lost after restart', async () => {
  await withDoneSet();
  const activeId = store.getState().active!.id;
  const tpl = store.getState().templates[0]; tpl.name = 'X'; store.save(tpl);
  let n = 0;
  (global as any).__dbFail = (k: string) => { if (k === 'state') { n++; if (n === 1) { store.finishWorkout(); return false; } return true; } return false; };
  await store.flush(); await store.flush();
  expect(store.getPersistError()).toBeTruthy();
  (global as any).__dbFail = false; store.__resetForTests(); await store.init();
  const st = store.getState();
  expect(st.active?.id === activeId || st.workouts.some(w => w.id === activeId)).toBe(true);
});

test('B: replaceState (import) during in-flight full write -> old history + imported active mixed at same seq', async () => {
  await withDoneSet();
  const oldActive = store.getState().active!.id;
  const imported = seedState('pl'); (imported as any).active = null;
  // import: backup bez treningu w toku; nowy zestaw ćwiczeń
  const tpl = store.getState().templates[0]; tpl.name = 'X'; store.save(tpl);
  let n = 0; let crash: Map<string, string> | null = null;
  const next = seedState('pl'); const sq = next.exercises[0];
  (next as any).active = { id: 'IMPORTED', ownerId: 'local', createdAt: Date.now(), updatedAt: Date.now(), loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'imp', startedAt: Date.now(), finishedAt: null, note: '', exercises: [{ id: 'e1', exerciseId: sq.id, restSec: 90, repMin: null, repMax: null, groupId: null, sets: [] }] };
  void imported;
  (global as any).__dbFail = (k: string) => { if (k === 'state') { n++; if (n === 1) store.replaceState(next); if (n === 2) crash = new Map(global.__kv); } return false; };
  await store.flush(); await store.flush(); await store.flush();
  global.__kv = crash!; (global as any).__dbFail = false; store.__resetForTests(); await store.init();
  const st = store.getState();
  // stan po restarcie: albo stary (stary trening w toku), albo w całości nowy — nie mieszanka
  const mixed = st.active?.id === 'IMPORTED' && !st.exercises.some(e => e.id === sq.id);
  expect({ active: st.active?.id, oldActive, mixed }).toEqual({ active: oldActive, oldActive, mixed: false });
});

test('C: finishWorkout() with clock set back -> finishedAt < startedAt (negative duration)', async () => {
  await withDoneSet();
  const a = store.getState().active!; const t0 = a.startedAt;
  const spy = jest.spyOn(Date, 'now').mockReturnValue(t0 - H);
  try { const w = store.finishWorkout()!; expect(w.finishedAt! >= w.startedAt).toBe(true); } finally { spy.mockRestore(); }
});

test('D: flush() during in-flight write writes the latest data', async () => {
  await withDoneSet();
  const tpl = store.getState().templates[0]; tpl.name = 'X'; store.save(tpl);
  let n = 0; let p: Promise<void> | null = null;
  (global as any).__dbFail = (k: string) => { if (k === 'state' && ++n === 1) { const a = store.getState().active!; a.note = 'late'; store.save(a); store.getState().templates[0].name = 'Y'; store.save(store.getState().templates[0]); p = store.flush(); } return false; };
  await store.flush(); await p;
  const s = JSON.parse(global.__kv.get('state')!); const l = JSON.parse(global.__kv.get('live')!);
  expect(s.templates[0].name).toBe('Y'); expect(l.active.note).toBe('late'); expect(l.seq).toBe(s.saveSeq);
});

test('E: queue survives rejection; no unhandled rejection; persistError cleared after recovery', async () => {
  await withDoneSet();
  const rej: unknown[] = []; const h = (e: unknown) => rej.push(e); process.on('unhandledRejection', h);
  (global as any).__dbFail = true;
  for (let i = 0; i < 5; i++) store.setTimerState({});
  store.save(); await store.flush();
  expect(store.getPersistError()).toBeTruthy();
  (global as any).__dbFail = false; await store.flush();
  expect(store.getPersistError()).toBeNull();
  await new Promise(r => setTimeout(r, 10));
  process.off('unhandledRejection', h); expect(rej).toEqual([]);
});

test('F: autoFinishStale with clock set back does not finish; with staleAck far in future (import) never stale', async () => {
  await withDoneSet();
  const a = store.getState().active!; const last = store.lastActivity(a);
  const raw = JSON.parse(JSON.stringify(store.getState())); raw.active.staleAck = Date.now() + 365 * 24 * H;
  store.replaceState(raw);
  expect(store.staleSince(last + 3 * H)).toBe(last); // pytanie mimo staleAck z przyszłości z importu?
});

test('G: corrupt state, copying live to key_live fails -> persistSeq not bumped, live not deleted; seed live write fails -> old active resurrects on fresh state', async () => {
  await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); for (let i = 0; i < 5; i++) { store.save(store.getState().active); await store.flush(); }
  const oldId = store.getState().active!.id;
  global.__kv.set('state', '{zepsute');
  (global as any).__dbFail = (k: string, q: string) => (/_live$/.test(k) || k === 'live') && !/DELETE/.test(q);
  store.__resetForTests(); await store.init().catch(() => {});
  (global as any).__dbFail = false; store.__resetForTests(); await store.init();
  expect(store.getState().active?.id).not.toBe(oldId);
});

test('H: __resetForTests while a persist is queued -> stale run mutates the next instance', async () => {
  await withDoneSet();
  store.getState().templates[0].name = 'OLD'; store.save(store.getState().templates[0]);
  const p = store.flush(); // run queued, not started yet
  store.__resetForTests(); global.__kv.clear(); const ip = store.init(); await Promise.all([p, ip]); await store.flush();
  const s = JSON.parse(global.__kv.get('state')!);
  expect(s.templates.some((t: any) => t.name === 'OLD')).toBe(false);
});
