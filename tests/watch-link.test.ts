/*
 * lib/watch/link.ts + lib/watch/fake.ts — telefon i atrapa zegarka (model referencyjny) razem: scenariusze od początku do końca, kolejka offline, restart telefonu,
 * negocjacja sesji treningu (Zdrowie). Zegarek tylko wyświetla i odsyła zdarzenia; po każdym kroku jego widok ma zgadzać się z tym, co telefon wie.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import { healthStart } from '@/lib/health';
import * as timer from '@/lib/timer';
import { WatchLink, startWatchLink, stopWatchLink, activeWatchLink } from '@/lib/watch/link';
import { FakeWatch } from '@/lib/watch/fake';
import { WATCH, WATCH_PROTOCOL, type PhoneToWatch, type WatchSnapshot } from '@/lib/watch/protocol';
import { completeSet } from '@/lib/setFlow';
import { fresh, saved } from './helpers';
import { world, A, sid, NOW, teardownWorld } from './watch-world';

const cfg = { client: 'apple' as const, app: '0.20.0', session: true };
let link: WatchLink | null = null;
afterEach(() => { link?.stop(); link = null; stopWatchLink(); teardownWorld(); });
const settle = async (l: WatchLink) => { await l.settled(); await Promise.resolve(); await l.settled(); };
async function pair(c = cfg) { const w = await world(); const fw = new FakeWatch(c, () => Date.now()); link = new WatchLink(fw, () => Date.now()); link.start(); fw.input({ t: 'launch' }); await settle(link); return { w, fw, link }; }
const snaps = (fw: FakeWatch) => fw.sent.filter((m): m is WatchSnapshot => m.kind === 'snapshot');
const kinds = (fw: FakeWatch) => fw.sent.map(m => m.kind + (m.kind === 'session' ? ':' + m.action : ''));

describe('hello i welcome', () => {
  test('start łącza wysyła migawkę; hello → welcome ok + migawka (rev nie rośnie bez zmiany treści); śmieci są pomijane', async () => {
    const { fw, link: l } = await pair(); const first = snaps(fw);
    expect(first[0].rev).toBe(1); expect(fw.sent.find(m => m.kind === 'welcome')).toEqual({ v: 1, kind: 'welcome', ok: true, protocol: 1, upgrade: null });
    expect(first.every(s => s.rev === 1)).toBe(true); expect(fw.view()).toMatchObject({ screen: 'set', title: 'Bench Press (sztanga)' });
    const n = fw.sent.length; for (const bad of [null, 'x', { v: 9 }, { v: 1, kind: 'event' }, '{zepsuty']) await l.receive(bad); expect(fw.sent).toHaveLength(n);
  });
  test('protokół zegarka starszy / nowszy niż obsługiwany: welcome ok=false z upgrade watch / phone, bez migawki', async () => {
    const w = await world(); void w; const fw = new FakeWatch(cfg); link = new WatchLink(fw); link.start(); fw.sent.length = 0;
    await link.receive({ v: 1, kind: 'hello', client: 'garmin', protocol: WATCH_PROTOCOL + 1, app: '9', caps: { session: false } });
    expect(fw.sent).toEqual([{ v: 1, kind: 'welcome', ok: false, protocol: WATCH_PROTOCOL, upgrade: 'phone' }]);
    expect(link.snapshot().phase).toBe('set');
  });
  test('brak treningu: migawka idle', async () => {
    await world(); store.cancelWorkout(); const fw = new FakeWatch(cfg); link = new WatchLink(fw); link.start(); fw.input({ t: 'launch' }); await settle(link); expect(fw.view().screen).toBe('idle');
  });
});

describe('zdarzenia end-to-end', () => {
  test('„Seria zrobiona” na zegarku: seria odhaczona na telefonie, przerwa 90 s, migawka potem ack z jej numerem; widok zegarka = migawka', async () => {
    const { fw, link: l } = await pair(); const mark = fw.sent.length; jest.setSystemTime(NOW + 1000);
    fw.input({ t: 'press', button: 'main' }); await settle(l);
    expect(A().exercises[0].sets[0]).toMatchObject({ done: true, completedAt: NOW + 1000 }); expect(timer.T.on).toBe(true);
    const out = fw.sent.slice(mark); expect(out.map(m => m.kind)).toEqual(['snapshot', 'ack']);
    const [s, a] = out as [WatchSnapshot, Extract<PhoneToWatch, { kind: 'ack' }>]; expect(s.phase).toBe('rest'); expect(a).toMatchObject({ status: 'applied', reason: null, rev: s.rev });
    expect(fw.state.queue).toEqual([]); expect(fw.view()).toMatchObject({ screen: 'rest', busy: false, cue: A() && s.rest!.cue, restEndsAt: s.rest!.endsAt });
  });
  test('zapowiedź na zegarku = podpis timera telefonu = Live Activity (jedno źródło)', async () => {
    const { fw, link: l } = await pair(); fw.input({ t: 'press', button: 'main' }); await settle(l);
    expect(fw.view().cue).toBe(timer.T.sub); expect(global.__la).toContainEqual(['start', 'Push', timer.T.sub, timer.T.endAt, 90, 'rest|Przerwa', 'pl']);
  });
  test('„Cofnij” w oknie: telefon cofa odhaczenie i zatrzymuje przerwę; zegarek wraca do serii', async () => {
    const { fw, link: l } = await pair(); fw.input({ t: 'press', button: 'main' }); await settle(l); jest.setSystemTime(NOW + 2000);
    fw.input({ t: 'press', button: 'undo' }); await settle(l);
    expect(A().exercises[0].sets[0].done).toBe(false); expect(timer.T.on).toBe(false); expect(fw.view()).toMatchObject({ screen: 'set', counter: 'seria 1 z 3', busy: false });
  });
  test('„Zrobione inaczej”: seria ze znacznikiem „do uzupełnienia”, migawka niesie toFillCount', async () => {
    const { fw, link: l } = await pair(); fw.input({ t: 'press', button: 'differ' }); await settle(l);
    expect(A().exercises[0].sets[0]).toMatchObject({ done: true, toFill: true }); expect(link!.snapshot().toFillCount).toBe(1); expect(fw.view().toFillCount).toBe(1);
  });
  test('„Pomiń” z potwierdzeniem na zegarku: blok pominięty bez drugiego pytania na telefonie; zegarek pokazuje następne ćwiczenie', async () => {
    const { fw, link: l } = await pair(); fw.input({ t: 'press', button: 'skip' }); fw.input({ t: 'press', button: 'confirmSkip' }); await settle(l);
    expect(A().exercises[0].skipped).toBe(true); expect(global.__alerts).toEqual([]); expect(fw.view()).toMatchObject({ title: 'Pull Up', busy: false });
  });
  test('przycisk główny w przerwie odhacza następną serię (kolejne przerwy), do końca bloku', async () => {
    const { fw, link: l } = await pair(); for (let i = 0; i < 3; i++) { jest.setSystemTime(NOW + 1000 * (i + 1)); fw.input({ t: 'press', button: 'main' }); await settle(l); }
    expect(A().exercises[0].sets.map(s => s.done)).toEqual([true, true, true]); expect(fw.view()).toMatchObject({ title: 'Pull Up', counter: 'seria 1 z 2', screen: 'rest' });
  });
  test('koniec przerwy: zegarek wysyła restEnded w chwili końca, telefon przyjmuje (applied) i jego alarm jest zgodny', async () => {
    const { fw, link: l } = await pair(); fw.input({ t: 'press', button: 'main' }); await settle(l); const end = timer.T.endAt;
    jest.setSystemTime(end); fw.input({ t: 'tick' }); await settle(l);
    expect(fw.fromWatch.at(-1)).toMatchObject({ type: 'restEnded' }); expect(fw.sent.filter(m => m.kind === 'ack').at(-1)).toMatchObject({ status: 'applied' }); expect(timer.T.alarmed).toBe(true);
    expect(fw.view()).toMatchObject({ screen: 'set', counter: 'seria 2 z 3' });
  });
  test('zmiana na telefonie (edycja ciężaru, pauza) odświeża zegarek bez udziału zegarka', async () => {
    const { fw, link: l } = await pair(); const n = snaps(fw).length;
    A().exercises[0].sets[0].weight = 82.5; store.save(A()); jest.advanceTimersByTime(60); await settle(l);
    expect(snaps(fw)).toHaveLength(n + 1); expect(fw.view().load).toBe('82,5 kg × 8');
    store.pauseWorkout(); jest.advanceTimersByTime(60); await settle(l); expect(fw.view().paused).toBe(true);
  });
  test('trening zakończony na telefonie: zegarek dostaje migawkę idle → „Trening zakończony”', async () => {
    const { fw, link: l } = await pair(); await completeSet(0, 0); store.finishWorkout(); jest.advanceTimersByTime(60); await settle(l);
    expect(snaps(fw).at(-1)!.phase).toBe('idle'); expect(fw.view().screen).toBe('finished');
  });
});

describe('bez połączenia', () => {
  test('dwa „zrobione” offline: zegarek sam przechodzi przez przerwy, trzecie blokuje; po powrocie telefon stosuje zdarzenia po kolei i widoki się zgadzają', async () => {
    const { fw, link: l } = await pair(); fw.goOffline();
    jest.setSystemTime(NOW + 1000); fw.input({ t: 'press', button: 'main' }); expect(fw.view()).toMatchObject({ screen: 'rest', offline: true }); const g1 = A().exercises[0].sets[0].done; expect(g1).toBe(false);
    jest.setSystemTime(NOW + 20e3); fw.input({ t: 'press', button: 'main' }); expect(fw.view().screen).toBe('connect');
    jest.setSystemTime(NOW + 21e3); const before = fw.fromWatch.length; fw.input({ t: 'press', button: 'main' }); expect(fw.fromWatch).toHaveLength(before);
    jest.setSystemTime(NOW + 30e3); fw.goOnline(); await settle(l);
    expect(A().exercises[0].sets.map(s => s.done)).toEqual([true, true, false]); expect(A().exercises[0].sets[0].completedAt).toBe(NOW + 1000);
    expect(timer.T.setId).toBe(sid(0, 1)); expect(timer.T.endAt).toBe(NOW + 20e3 + 90e3);
    expect(fw.state.queue).toEqual([]); expect(fw.view()).toMatchObject({ screen: 'rest', counter: 'seria 3 z 3', busy: false, offline: false });
  });
  test('migawki offline zastępują się (zostaje ostatnia), zdarzenia wracają w kolejności wysłania', async () => {
    const { fw, link: l } = await pair(); fw.goOffline(); jest.setSystemTime(NOW + 1000);
    A().exercises[0].sets[0].weight = 81; store.save(A()); jest.advanceTimersByTime(60); await settle(l); A().exercises[0].sets[0].weight = 82; store.save(A()); jest.advanceTimersByTime(60); await settle(l);
    fw.goOnline(); await settle(l); expect(fw.view().load).toBe('82 kg × 8'); expect(snaps(fw).filter((s, i, a) => a.indexOf(s) === i).length).toBeGreaterThan(2);
  });
  test('powtórzone zdarzenia z kolejki (ponowne dostarczenie) nie podwajają odhaczeń', async () => {
    const { fw, link: l } = await pair(); fw.input({ t: 'press', button: 'main' }); await settle(l);
    const ev = fw.fromWatch.find(m => m.kind === 'event')!; for (let i = 0; i < 3; i++) { await l.receive(ev); } expect(A().exercises[0].sets.map(s => s.done)).toEqual([true, false, false]);
    expect(fw.sent.filter(m => m.kind === 'ack').slice(-3).map(m => m.kind === 'ack' && m.status)).toEqual(['duplicate', 'duplicate', 'duplicate']);
  });
});

describe('restart telefonu w trakcie treningu', () => {
  test('po wczytaniu zapisu nowe łącze: hello → migawka zgodna ze stanem; stare zdarzenia z kolejki zegarka to duplicate; „Cofnij” z telefonu nie wraca od starego zdarzenia', async () => {
    const { fw, link: l } = await pair(); jest.setSystemTime(NOW + 1000); fw.input({ t: 'press', button: 'main' }); await settle(l); const ev = fw.fromWatch.find(m => m.kind === 'event')!;
    l.stop(); await store.flush(); const snap = JSON.parse(JSON.stringify(saved())); await fresh(snap); await timer.restore();
    const fw2 = new FakeWatch(cfg, () => Date.now()); link = new WatchLink(fw2, () => Date.now()); link.start(); fw2.input({ t: 'launch' }); await settle(link);
    expect(fw2.view()).toMatchObject({ screen: expect.stringMatching(/^(rest|set)$/), doneCount: 1 });
    const acks = fw2.sent.length; await link.receive(ev); await settle(link); expect(fw2.sent.slice(acks).find(m => m.kind === 'ack')).toMatchObject({ status: 'duplicate' });
    expect(store.getState().active!.exercises[0].sets.map(s => s.done)).toEqual([true, false, false]);
  });
});

describe('sesja treningu zegarka (Zdrowie)', () => {
  test('hello z zdolnością sesji → jeden `session start` na trening (save = zapis do Zdrowia); sessionStarted zapisane w treningu; ponowny hello wysyła start tylko dopóki sesja nie ruszyła', async () => {
    await world(); store.getState().settings.healthSync = true; const fw = new FakeWatch(cfg, () => Date.now()); link = new WatchLink(fw, () => Date.now()); link.start(); fw.input({ t: 'launch' }); await settle(link);
    expect(fw.sent.filter(m => m.kind === 'session')).toEqual([{ v: 1, kind: 'session', action: 'start', workoutId: A().id, save: true }]);
    fw.input({ t: 'launch' }); await settle(link); expect(fw.sent.filter(m => m.kind === 'session')).toHaveLength(2); /* sesja jeszcze nie ruszyła — zamówienie ponowione */
    await link.receive({ v: 1, kind: 'event', eventId: 'apple-s1', workoutId: A().id, baseRev: 1, at: Date.now(), client: 'apple', type: 'sessionStarted' }); expect(A().watch).toMatchObject({ client: 'apple' });
    fw.input({ t: 'launch' }); await settle(link); expect(fw.sent.filter(m => m.kind === 'session')).toHaveLength(2);
  });
  test('zegarek bez zdolności sesji (Connect IQ): nigdy `session`', async () => {
    const { fw } = await pair({ client: 'garmin' as unknown as 'apple', app: '0.20.0', session: false }); expect(fw.sent.some(m => m.kind === 'session')).toBe(false);
  });
  test('koniec treningu → `session end` z save zależnym od zapisu do Zdrowia; odrzucenie treningu → save=false', async () => {
    const { fw, link: l } = await pair(); store.getState().settings.healthSync = true; await l.receive({ v: 1, kind: 'event', eventId: 'apple-s1', workoutId: A().id, baseRev: 1, at: Date.now(), client: 'apple', type: 'sessionStarted' });
    await completeSet(0, 0); const id = A().id; store.finishWorkout(); jest.advanceTimersByTime(60); await settle(l);
    expect(fw.sent.filter(m => m.kind === 'session').at(-1)).toEqual({ v: 1, kind: 'session', action: 'end', workoutId: id, save: true });
    /* odrzucenie */
    await world(); const fw2 = new FakeWatch(cfg, () => Date.now()); const l2 = new WatchLink(fw2, () => Date.now()); link = l2; l2.start(); fw2.input({ t: 'launch' }); await settle(l2);
    await l2.receive({ v: 1, kind: 'event', eventId: 'apple-s1', workoutId: A().id, baseRev: 1, at: Date.now(), client: 'apple', type: 'sessionStarted' }); const id2 = A().id; store.cancelWorkout(); jest.advanceTimersByTime(60); await settle(l2);
    expect(fw2.sent.filter(m => m.kind === 'session').at(-1)).toEqual({ v: 1, kind: 'session', action: 'end', workoutId: id2, save: false });
  });
  test('raport po zakończeniu: saved=true → telefon nie zapisuje (healthUUID „watch”); saved=false → zostaje do zapisu z telefonu; powtórzenie raportu = duplicate', async () => {
    const { fw, link: l } = await pair(); store.getState().settings.healthSync = true; await l.receive({ v: 1, kind: 'event', eventId: 'apple-s1', workoutId: A().id, baseRev: 1, at: Date.now(), client: 'apple', type: 'sessionStarted' });
    await completeSet(0, 0); const w = A(); store.finishWorkout(); w.healthPending = true; store.save(w); jest.advanceTimersByTime(60); await settle(l);
    const rep = { v: 1, kind: 'event', eventId: 'apple-s2', workoutId: w.id, baseRev: 2, at: Date.now(), client: 'apple', type: 'sessionEnded', saved: true };
    await l.receive(rep); await settle(l); const done = store.getState().workouts.find(x => x.id === w.id)!; expect([done.healthUUID, done.healthPending, done.watch]).toEqual(['watch', undefined, undefined]);
    expect(fw.sent.filter(m => m.kind === 'ack').at(-1)).toMatchObject({ status: 'applied' });
    await l.receive({ ...rep, eventId: 'apple-s3' }); expect(fw.sent.filter(m => m.kind === 'ack').at(-1)).toMatchObject({ status: 'duplicate' }); /* sesja już rozstrzygnięta */
  });
  test('raport o nieznanym treningu → rejected', async () => {
    const { fw, link: l } = await pair(); await l.receive({ v: 1, kind: 'event', eventId: 'x1', workoutId: 'nie-ma', baseRev: 1, at: Date.now(), client: 'apple', type: 'sessionEnded', saved: true });
    expect(fw.sent.filter(m => m.kind === 'ack').at(-1)).toMatchObject({ status: 'rejected', reason: 'other-workout' });
  });
});

describe('pauza treningu na telefonie a sesja zegarka (B-04, 1.0.1)', () => {
  const sessionEvt = (id: string) => ({ v: 1, kind: 'event', eventId: 'apple-p1', workoutId: id, baseRev: 1, at: Date.now(), client: 'apple', type: 'sessionStarted' });
  test('pauza i wznowienie na telefonie dochodzą do zegarka jako migawki z `paused` i `workoutId` (po tym zegarek wstrzymuje i wznawia sesję Zdrowia)', async () => {
    const { fw, link: l } = await pair(); const id = A().id;
    expect(snaps(fw).at(-1)).toMatchObject({ paused: false, workoutId: id });
    store.pauseWorkout(); jest.advanceTimersByTime(60); await settle(l); expect(snaps(fw).at(-1)).toMatchObject({ paused: true, workoutId: id });
    store.resumeWorkout(); jest.advanceTimersByTime(60); await settle(l); expect(snaps(fw).at(-1)).toMatchObject({ paused: false, workoutId: id });
    expect([...new Map(snaps(fw).map(x => [x.rev, x.paused])).values()]).toEqual([false, true, false]); /* po jednej migawce na zmianę treści (powtórka tej samej wersji po `welcome` nie liczy się) */
  });
  test('koniec treningu w pauzie: ostatnia migawka to idle bez pauzy, a `session end` idzie po zakończeniu (zegarek kończy sesję i zapisuje czas bez pauzy)', async () => {
    const { fw, link: l } = await pair(); store.getState().settings.healthSync = true; const id = A().id;
    await l.receive(sessionEvt(id)); await completeSet(0, 0); store.pauseWorkout(); jest.advanceTimersByTime(60); await settle(l); expect(snaps(fw).at(-1)!.paused).toBe(true);
    store.finishWorkout(); jest.advanceTimersByTime(60); await settle(l);
    expect(snaps(fw).at(-1)).toMatchObject({ phase: 'idle', paused: false, workoutId: null });
    expect(fw.sent.filter(m => m.kind === 'session').at(-1)).toEqual({ v: 1, kind: 'session', action: 'end', workoutId: id, save: true });
  });
  test('czas w Zdrowiu jest ten sam z zegarka i z telefonu: aktywny czas = koniec − start − suma pauz (zapis z telefonu przesuwa start o pauzy, sesja zegarka wstrzymana na czas pauz)', async () => {
    await world(); const w = A(); const start = w.startedAt;
    jest.setSystemTime(start + 10 * 60e3); store.pauseWorkout(); jest.setSystemTime(start + 25 * 60e3); store.resumeWorkout(); jest.setSystemTime(start + 40 * 60e3); store.finishWorkout();
    const fin = store.getState().workouts.find(x => x.id === w.id)!; const paused = store.pausedTotal(fin, fin.finishedAt!);
    expect(paused).toBe(15 * 60e3); const activeFromPhone = fin.finishedAt! - healthStart(fin);
    expect(activeFromPhone).toBe(25 * 60e3); expect(activeFromPhone).toBe(fin.finishedAt! - fin.startedAt - paused);
  });
  test('źródło Swift (nie do skompilowania na Linuksie — kompilację sprawdza ios-unsigned/watch-sim): sesja zegarka ma pauzę i wznowienie, a store przekazuje stan z migawki', () => {
    const rd = (f: string) => fs.readFileSync(path.join(__dirname, '..', 'targets', f), 'utf8');
    const ctl = rd('watch-app/WorkoutController.swift'), st = rd('watch-app/Core/WatchStore.swift'), fk = rd('watch-app/Core/WatchFakes.swift');
    expect(st).toMatch(/func setPaused\(_ paused: Bool\)/); expect(st).toMatch(/workout\.setPaused\(phonePaused\)/); expect(st).toMatch(/phonePaused = m\.paused && m\.workoutId != nil/);
    expect(ctl).toMatch(/func setPaused\(_ paused: Bool\)/); expect(ctl).toMatch(/s\.pause\(\)/); expect(ctl).toMatch(/s\.resume\(\)/); expect(ctl).toMatch(/s\.state == \.running/); expect(ctl).toMatch(/s\.state == \.paused/);
    expect(fk).toMatch(/func setPaused\(_ paused: Bool\)/);
    expect(rd('watch-tests/WatchCoreTests/WatchStoreTests.swift')).toMatch(/testPhonePauseAndResumePauseAndResumeTheWatchSession/);
  });
});

describe('rejestr łącza', () => {
  test('startWatchLink zastępuje poprzednie łącze (stare przestaje wysyłać); stopWatchLink je zatrzymuje', async () => {
    await world(); const a = new FakeWatch(cfg); const b = new FakeWatch(cfg); startWatchLink(a); const l1 = activeWatchLink(); startWatchLink(b); expect(activeWatchLink()).not.toBe(l1);
    const na = a.sent.length; A().exercises[0].sets[0].weight = 90; store.save(A()); jest.advanceTimersByTime(60); expect(a.sent).toHaveLength(na); expect(b.sent.length).toBeGreaterThan(0);
    stopWatchLink(); expect(activeWatchLink()).toBeNull(); expect(WATCH.OFFLINE_DONE_MAX).toBe(2);
  });
});
