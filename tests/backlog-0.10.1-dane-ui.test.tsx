/*
 * Backlog audytu kontrolnego 1 (09.10.2026), obszary DAT/LOG/X/LIVE — testy regresji na ekranach (0.10.1). Każdy test odtwarza dowód audytora
 * (raporty audytu kontrolnego 1, docs/25 „Audyt kontrolny 1”) i sprawdza poprawne zachowanie. Logika: tests/backlog-0.10.1-dane.test.ts.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex, saved, pressAlert, addWorkout } from './helpers';
import { renderApp, tap, type, flushAll, screen, act } from './app';
import * as edit from '@/lib/edit';
import * as draft from '@/lib/draft';
import type { Template, Exercise } from '@/lib/seed';

jest.setTimeout(120000);
const S = () => store.getState();
afterEach(async () => { try { S(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const boot = async (url?: string) => { await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); await flushAll(10); };
const lastAlert = (title?: string) => title ? [...global.__alerts].reverse().find(x => x.title === title) : global.__alerts[global.__alerts.length - 1];

describe('LIVE2-02: okno „Zakończyć trening?” liczy serie robocze jak workingSets (D3 — drop razem z serią)', () => {
  test('LIVE2-02: 3 serie + drop set, wszystkie odhaczone → „Zapisane zostaną serie robocze: 3.” (= workingSets po zapisie)', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0); store.addSet(0); store.addSet(0, 'drop');
    const a = S().active!; expect(a.exercises[0].sets.map(s => s.kind)).toEqual(['normal', 'normal', 'normal', 'drop']);
    a.exercises[0].sets.forEach((s, i) => { s.weight = 60 - i * 5; s.reps = 8; }); a.exercises[0].sets.forEach((_, i) => store.toggleDone(0, i));
    await boot();
    await tap(screen.getAllByText('Zakończ trening i zapisz')[0]);
    expect(lastAlert()!.msg).toBe('Zapisane zostaną serie robocze: 3.');
    await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(600);
    expect(store.workingSets(S().workouts.at(-1)!)).toBe(3);
  });
  test('LIVE2-02: rozgrzewka + drop bez serii przed nim liczy się sam; trwający pomiar liczy się jak odhaczony', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addSet(0, 'warmup'); store.addSet(0, 'drop');
    const a = S().active!; expect(a.exercises[0].sets.map(s => s.kind)).toEqual(['warmup', 'normal', 'drop']);
    /* rozgrzewka i drop odhaczone, seria normalna w trakcie pomiaru — jej drop liczy się razem z nią: 1 seria robocza */
    a.exercises[0].sets.forEach(s => { s.durationSec = 30; }); store.toggleDone(0, 0); store.toggleDone(0, 2);
    await boot();
    expect(store.workCount(['drop'])).toBe(1);
    await act(async () => { await timer.startSet(a.exercises[0].sets[1].id, 30); });
    await tap(screen.getAllByText('Zakończ trening i zapisz')[0]);
    expect(lastAlert()!.msg).toBe('Zapisane zostaną serie robocze: 1.');
  });
});

describe('LIVE2-04: pytanie i przypomnienie o porzuconym treningu podają godzinę na zegarze strefy startu (jak zegar sesji, J3)', () => {
  test('LIVE2-04: trening ze strefą startu +3 h względem telefonu → „Ostatnia seria o …” i „w pauzie od …” na zegarze startu, w oknie i w powiadomieniu', async () => {
    const H = 3600e3; await fresh(); await renderApp(); const now = Date.now();
    const tz = -new Date(now).getTimezoneOffset() + 180; let last = 0, paused = 0;
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = S().active!; a.startedAt = now - 3 * H; a.tzOffsetMin = tz;
      last = now - 2.5 * H; Object.assign(a.exercises[0].sets[0], { weight: 100, reps: 5, done: true, completedAt: last }); paused = now - 2.4 * H; a.pausedAt = paused; store.save(a); store.refreshViews(); });
    await flushAll(10);
    const wall = (ts: number) => store.fmtTime(store.wallTs({ startedAt: ts, tzOffsetMin: tz }));
    expect(wall(last)).not.toBe(store.fmtTime(last));
    const al = lastAlert('Trening wciąż trwa')!; expect(al.msg).toContain(`Ostatnia seria o ${wall(last)}.`); expect(al.msg).toContain(`Trening w pauzie od ${wall(paused)}.`);
    await act(async () => { pressAlert('Trening wciąż trwa', 'Kontynuuj'); }); await flushAll(10); /* przypomnienie 2 h od „Kontynuuj” */
    const n: any = (global.__notifications as any[]).filter(x => x.identifier === 'stale-reminder').pop();
    expect(n.content.body).toBe(timer.staleBody('work', last, false, paused, tz)); expect(n.content.body).toContain(wall(last));
  });
});

describe('X2-04: okno nakładania terminów w edycji sesji podaje godzinę tamtej sesji na zegarze jej strefy startu (jak lista Historii)', () => {
  test('X2-04: sesja „Pompki” zapisana w strefie +3 h → „nachodzi na sesję „Pompki” (… 14:00)”, nie 11:00', async () => {
    await fresh(); const d0 = new Date(Date.now() - 3 * 86400e3); d0.setHours(8, 0, 0, 0); const t0 = d0.getTime();
    const w1 = addWorkout(t0, [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Nogi'); const w2 = addWorkout(t0 + 3 * 3600e3, [['Push Up', [{ reps: 20 }]]], 'Pompki');
    w2.tzOffsetMin = store.tzOffsetAt(w2.startedAt) + 180; store.save();
    await boot(`/history/edit/${w1.id}`); await flushAll(20);
    await type(screen.getByLabelText('Godzina startu'), '11:15'); await tap(screen.getByText('Zapisz'));
    const wall = store.wallTs(w2); expect(edit.timeText(wall)).not.toBe(edit.timeText(w2.startedAt));
    expect(lastAlert()).toMatchObject({ title: 'Zapisać zmiany?', msg: `Ten termin nachodzi na sesję „Pompki” (${edit.dateText(wall)} ${edit.timeText(wall)}).` });
  });
});

describe('X2-02: Postępy ćwiczenia — data sesji na zegarze strefy startu (jak Historia)', () => {
  test('X2-02: trening nd. 4.10 20:00 w strefie +10 h → lista sesji w Postępach: „pon., 5 paź”, nie „niedz., 4 paź”', async () => {
    await fresh(); const at = new Date(2026, 9, 4, 20, 0).getTime();
    const w = addWorkout(at, [['Back Squat', [{ weight: 120, reps: 5 }]]]); w.tzOffsetMin = store.tzOffsetAt(at) + 600; store.save();
    await boot(`/more/progress?ex=${ex('Back Squat').id}`);
    const wall = store.fmtDate(store.wallTs(w)); expect(wall).not.toBe(store.fmtDate(at));
    expect(screen.getAllByText(wall).length).toBeGreaterThan(0); expect(screen.queryAllByText(store.fmtDate(at))).toHaveLength(0);
  });
});

describe('UX2-03 = DAT2-06 / UX2-12: po zamknięciu aplikacji przez iOS start pyta o niezapisany szkic', () => {
  /** Stan i szkic zapisane w bazie w chwili „zabicia” aplikacji (bez „Zapisz”). */
  const killed = async (prep: () => void) => { await fresh(); prep(); await store.flush(); const kv: Record<string, string> = {}; global.__kv.forEach((v, k) => { if (k !== 'state') kv[k] = v; }); draft.__resetObjDrafts(); return { state: saved(), kv }; };
  const item = (e: { id: string }) => ({ id: Math.random().toString(36).slice(2), exerciseId: e.id, sets: 3, repMin: null, repMax: null, restSec: null, startWeight: '' as const, targetSec: '' as const, groupId: null });
  test('UX2-03: szablon „Push” zmieniony w szkicu → „Niezapisane zmiany … „Push+”” → „Wróć do edycji” otwiera edycję ze szkicem → „Zapisz” zapisuje', async () => {
    let id = ''; const { state, kv } = await killed(() => { const tp = store.newTemplate(); tp.name = 'Push'; tp.items.push(item(ex('Back Squat'))); store.save(tp); id = tp.id;
      const d = draft.beginObjDraft<Template>('template', id)!; d.name = 'Push+'; d.items.push(item(ex('Pull Up'))); store.save(d); });
    expect(kv[draft.DRAFTS_KEY]).toBeTruthy();
    await renderApp({ saved: state, kv }); await flushAll(700);
    expect(lastAlert()).toMatchObject({ title: 'Niezapisane zmiany', msg: 'Aplikacja zamknęła się w trakcie edycji szablonu „Push+”. Wrócić do edycji?' });
    expect(S().templates.find(x => x.id === id)!.items).toHaveLength(1);
    await act(async () => { pressAlert('Niezapisane zmiany', 'Wróć do edycji'); }); await flushAll(20);
    expect(screen.getByLabelText('Zapisz szablon')).toBeTruthy(); expect(screen.getByDisplayValue('Push+')).toBeTruthy();
    await tap(screen.getByLabelText('Zapisz szablon')); await flushAll(20);
    const tp = S().templates.find(x => x.id === id)!; expect(tp.name).toBe('Push+'); expect(tp.items).toHaveLength(2);
  });
  test('UX2-03: ćwiczenie — „Odrzuć zmiany” zostawia ćwiczenie bez zmian i kasuje szkic z bazy', async () => {
    let id = ''; const { state, kv } = await killed(() => { const e = ex('Back Squat'); id = e.id; const d = draft.beginObjDraft<Exercise>('exercise', id)!; d.notes = 'nowa notatka'; store.save(d); });
    await renderApp({ saved: state, kv }); await flushAll(700);
    expect(lastAlert()).toMatchObject({ title: 'Niezapisane zmiany', msg: 'Aplikacja zamknęła się w trakcie edycji ćwiczenia „Back Squat”. Wrócić do edycji?' });
    await act(async () => { pressAlert('Niezapisane zmiany', 'Odrzuć zmiany'); }); await flushAll(500);
    expect(ex('Back Squat').notes).not.toBe('nowa notatka'); expect(global.__kv.has(draft.DRAFTS_KEY)).toBe(false);
  });
  test('UX2-12: „+ Nowy” szablon bez zmian, aplikacja zabita → po starcie brak pytania i brak „Nowy szablon” na liście', async () => {
    let id = ''; const { state, kv } = await killed(() => { const tp = store.newTemplate(); id = tp.id; draft.beginObjDraft('template', id, { isNew: true }); });
    await renderApp({ saved: state, kv, url: '/templates' }); await flushAll(700);
    expect(global.__alerts.filter(a => a.title === 'Niezapisane zmiany')).toHaveLength(0);
    expect(S().templates.some(x => x.id === id)).toBe(false); expect(screen.queryByText('Nowy szablon')).toBeNull();
  });
  test('UX2-12: nowy szablon ze zmianami → „Wróć do edycji” otwiera go jako nowy („Anuluj” usuwa); nie znika przy starcie', async () => {
    let id = ''; const { state, kv } = await killed(() => { const tp = store.newTemplate(); id = tp.id; const d = draft.beginObjDraft<Template>('template', id, { isNew: true })!; d.name = 'Nogi'; store.save(d); });
    await renderApp({ saved: state, kv }); await flushAll(700);
    expect(S().templates.some(x => x.id === id)).toBe(true);
    await act(async () => { pressAlert('Niezapisane zmiany', 'Wróć do edycji'); }); await flushAll(20);
    expect(screen.getByDisplayValue('Nogi')).toBeTruthy();
    await tap(screen.getByLabelText('Anuluj edycję szablonu')); await act(async () => { pressAlert('Odrzucić zmiany?', 'Odrzuć zmiany'); }); await flushAll(20);
    expect(lastAlert('Odrzucić zmiany?')!.msg).toBe('Nowy szablon nie zostanie zapisany.'); expect(S().templates.some(x => x.id === id)).toBe(false);
  });
});
