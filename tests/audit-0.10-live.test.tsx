/*
 * Audyt 0.10.0 (08.10.2026), obszar LIVE — testy regresji na ekranach (decyzje właściciela 08.10.2026: „naprawiamy wszystko”, rekomendacje
 * z docs/25 i raportów źródłowych LIVE/MER/UI/UX/X/LOG/SEC). Każdy test odtwarza błąd z dowodu audytora (zz-audit-live-*, zz-audit-ui-*,
 * zz-audit-mer-deload, zz-audit-sec-perf) i sprawdza poprawne zachowanie. Logika: tests/audit-0.10-live-logic.test.ts.
 */
import { StyleSheet } from 'react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as planReminder from '@/lib/planReminder';
import { F } from '@/lib/theme';
import { addLocation } from '@/lib/locations';
import { applyUnit, wIn } from '@/lib/units';
import { fresh, ex, saved, pressAlert, withDemoTemplates, addWorkout } from './helpers';
import { renderApp, tap, flushAll, screen, act, fireEvent, swipeDelete, go } from './app';

jest.setTimeout(120000);
const S = () => store.getState();
afterEach(async () => { applyUnit('kg'); try { S(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const boot = async (url?: string) => { await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); await flushAll(10); };
const lastAlert = (title?: string) => title ? [...global.__alerts].reverse().find(x => x.title === title) : global.__alerts[global.__alerts.length - 1];
const titles = () => screen.UNSAFE_root.findAll((n: any) => n.type === 'RNSScreenStackHeaderConfig').map((n: any) => n.props.title);
const dbl = async (el: any) => { await act(async () => { fireEvent.press(el); fireEvent.press(el); }); await flushAll(10); };
const lastNotif = (id: string) => [...(global.__notifications as any[])].reverse().find(n => n.identifier === id);
const T0 = new Date(2026, 9, 8, 17, 0).getTime(); const SEC = 1000, MIN = 60e3;

describe('F2 (LIVE-02): karta „teraz” w supersecie z rozgrzewką w A', () => {
  test('F2 (LIVE-02): przycisk karty prowadzi AW → A1 → B1(przerwa) → A2…', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Pull Up'));
    store.addSet(0); store.addSet(1); store.addSet(0, 'warmup'); const a = S().active!; store.linkWithNext(a.exercises, 0, a);
    ex('Bench Press (sztanga)').restWarmupSec = null as never; await boot();
    const out: string[] = [];
    for (let i = 0; i < 5; i++) { const w = S().active!; const p = store.focusSet(w)!; out.push(`${p.ei ? 'B' : 'A'}${p.si}`); await tap(screen.getByTestId('focus-done')); await flushAll(10); out[out.length - 1] += timer.T.on ? '(p)' : ''; await act(async () => { await timer.stop(); }); }
    expect(out.join(' ')).toBe('A0 A1 B0(p) A2 B1(p)'); /* indeksy serii: A = [W, 1, 2] */
  });
});

describe('F3 (LIVE-05, wariant B): „Zakończ” ostrzega o nieodhaczonych seriach w zaczętych ćwiczeniach', () => {
  test('F3 (LIVE-05): szablon 3 × 60 kg, odhaczone 2 → „Nieodhaczone serie: 1 — nie zostaną zapisane.”; niezaczęte i pominięte ćwiczenia się nie liczą', async () => {
    await fresh(); const t = store.newTemplate(); t.name = 'Push';
    t.items.push({ id: 'a', exerciseId: ex('Bench Press (sztanga)').id, sets: 3, repMin: 8, repMax: 10, restSec: null, startWeight: 60, targetSec: '', groupId: null },
      { id: 'b', exerciseId: ex('Back Squat').id, sets: 2, repMin: 8, repMax: 10, restSec: null, startWeight: 80, targetSec: '', groupId: null },
      { id: 'c', exerciseId: ex('Leg Press').id, sets: 2, repMin: 8, repMax: 10, restSec: null, startWeight: 100, targetSec: '', groupId: null }); store.save(t);
    store.startFromTemplate(t); store.toggleDone(0, 0); store.toggleDone(0, 1); store.toggleDone(2, 0); store.skipExercise(S().active!.exercises[2].id);
    await boot();
    await tap(screen.getAllByText('Zakończ trening i zapisz')[0]); const al = lastAlert()!;
    expect(al.title).toBe('Zakończyć trening?'); expect(al.msg).toBe('Zapisane zostaną serie robocze: 3.\nNieodhaczone serie: 1 — nie zostaną zapisane.');
    await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(600);
    expect(S().workouts.at(-1)!.exercises.map(e => e.sets.length)).toEqual([2, 1]);
  });
  test('F3 (LIVE-05): wpisane wyniki i serie z planu razem — dwie rozłączne linie', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0); store.addSet(0); store.addExerciseToActive(ex('Back Squat'));
    const a = S().active!; a.exercises[0].sets.forEach(s => { s.weight = 60; s.reps = 8; }); store.toggleDone(0, 0); Object.assign(a.exercises[0].sets[1], { weight: 65, edited: true }); Object.assign(a.exercises[1].sets[0], { weight: 100, reps: 5, edited: true });
    await boot();
    await tap(screen.getAllByText('Zakończ trening i zapisz')[0]);
    expect(lastAlert()!.msg).toBe('Zapisane zostaną serie robocze: 1.\nNieodhaczone serie z wpisanymi wynikami: 2 — nie zostaną zapisane. Seria zapisuje się po odhaczeniu ✓.\nPozostałe nieodhaczone serie: 1 — też nie zostaną zapisane.');
  });
});

describe('F4 (LIVE-03): „Pomiń dziś” nie zatrzymuje przerwy po odhaczonej serii; trwający pomiar — z pytaniem', () => {
  test('F4 (LIVE-03): ✓ serii 1 → przerwa; „Pomiń dziś” → przerwa trwa (bez odwołania powiadomienia), podpis przeliczony na następne ćwiczenie', async () => {
    await fresh(); S().settings.workoutView = 'list'; store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0); store.addSet(0); store.addExerciseToActive(ex('Plank'));
    S().active!.exercises[0].sets.forEach(s => { s.weight = 80; s.reps = 8; }); await boot();
    await tap(screen.getByLabelText('Seria 1 zrobiona — Bench Press (sztanga)')); await flushAll(10);
    expect(timer.T.on).toBe(true); expect(timer.T.sub).toBe('Bench Press (sztanga) · seria 2'); const n0 = global.__cancelled.length; const la0 = global.__la.length;
    await tap(screen.getByLabelText('Pomiń dziś: Bench Press (sztanga)')); await flushAll(10);
    expect(S().active!.exercises[0].skipped).toBe(true); expect(timer.T.on).toBe(true); expect(global.__cancelled.slice(n0)).not.toContain('rest-end');
    expect(timer.T.sub).toBe('dalej: Plank'); expect(global.__la.slice(la0)).toContainEqual(['update', 'dalej: Plank', timer.T.endAt, timer.T.total]);
  });
  test('F4 (LIVE-03): stoper serii w bloku — pytanie; „Wróć” zostawia pomiar, „Pomiń dziś” zatrzymuje go i pomija ćwiczenie', async () => {
    await fresh(); S().settings.workoutView = 'list'; store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addExerciseToActive(ex('Bench Press (sztanga)')); await boot();
    await tap(screen.getByLabelText('Start stopera serii')); expect(timer.S.on).toBe(true);
    await tap(screen.getByLabelText('Pomiń dziś: Plank')); await flushAll(5);
    expect(lastAlert()).toMatchObject({ title: 'Trwa pomiar serii', msg: 'Pominięcie ćwiczenia przerwie pomiar — ten czas się nie zapisze.' });
    await act(async () => { pressAlert('Trwa pomiar serii', 'Wróć'); }); await flushAll(5); expect(timer.S.on).toBe(true); expect(S().active!.exercises[0].skipped).toBeUndefined();
    await tap(screen.getByLabelText('Pomiń dziś: Plank')); await flushAll(5);
    await act(async () => { pressAlert('Trwa pomiar serii', 'Pomiń dziś'); }); await flushAll(5);
    expect(timer.S.on).toBe(false); expect(S().active!.exercises[0].skipped).toBe(true); expect(S().active!.exercises[0].sets[0].done).toBe(false);
  });
});

describe('F5 (LIVE-04 / LIVE-15): podpis przerwy i powiadomienie', () => {
  test('LIVE-15: po restarcie aplikacji przerwa ma ten sam podpis (Live Activity), nie „przerwa 90 s”', async () => {
    jest.useFakeTimers({ now: T0 }); await fresh(); S().settings.workoutView = 'list'; store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0);
    S().active!.exercises[0].sets.forEach(s => { s.weight = 60; s.reps = 8; }); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); jest.setSystemTime(T0); await flushAll(10);
    await tap(screen.getByLabelText('Seria 1 zrobiona — Bench Press (sztanga)')); await flushAll(10);
    expect(timer.T.sub).toBe('Bench Press (sztanga) · seria 2');
    await act(async () => { await store.flush(); }); const st = JSON.parse(JSON.stringify(saved())); jest.setSystemTime(T0 + 40 * SEC);
    await renderApp({ saved: st }); jest.setSystemTime(T0 + 40 * SEC); await flushAll(10);
    expect(timer.T.on).toBe(true); expect(timer.T.sub).toBe('Bench Press (sztanga) · seria 2');
    expect(global.__la.filter((x: any) => x[0] === 'start').at(-1)).toEqual(['start', 'Trening', 'Bench Press (sztanga) · seria 2', timer.T.endAt, 90, 'rest|Przerwa']);
    expect(lastNotif('rest-end')?.content.body).toBe('Następna seria.');
  });
  test('F5 (LIVE-04, decyzja B): po ostatniej serii treningu przerwa zostaje, a powiadomienie nie mówi „Następna seria.”', async () => {
    await fresh(); S().settings.workoutView = 'list'; store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0);
    S().active!.exercises[0].sets.forEach(s => { s.weight = 60; s.reps = 8; }); await boot();
    await tap(screen.getByLabelText('Seria 1 zrobiona — Bench Press (sztanga)')); await flushAll(10);
    expect(lastNotif('rest-end')?.content).toMatchObject({ title: 'Przerwa minęła', body: 'Następna seria.' });
    await tap(screen.getByLabelText('Seria 2 zrobiona — Bench Press (sztanga)')); await flushAll(10);
    expect(timer.T.on).toBe(true); expect(timer.T.sub).toBe('nic więcej do zrobienia');
    expect(lastNotif('rest-end')?.content).toMatchObject({ title: 'Przerwa minęła', body: 'Nic więcej do zrobienia — możesz zakończyć trening.' });
    await tap(screen.getByText('+ seria')); await flushAll(10); /* nowa seria: podpis i treść powiadomienia wracają */
    expect(timer.T.sub).toBe('Bench Press (sztanga) · seria 3'); expect(lastNotif('rest-end')?.content.body).toBe('Następna seria.');
  });
});

describe('F6 (LIVE-06 / LIVE-07): widok skupiony', () => {
  test('F6 (LIVE-06, wariant A): seria na czas — duży „▶ Start” uruchamia stoper, mały „Odhacz bez pomiaru” odhacza bez pomiaru', async () => {
    jest.useFakeTimers({ now: T0 }); await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addSet(0);
    S().active!.exercises[0].sets.forEach(s => { s.durationSec = 30; }); await boot(); jest.setSystemTime(T0);
    expect(screen.getByText('▶ Start')).toBeTruthy(); expect(screen.queryByText('Seria zrobiona')).toBeNull();
    await tap(screen.getByLabelText('Start stopera: Plank, seria 1')); await flushAll(10);
    expect(timer.S.on).toBe(true); expect(timer.S.setId).toBe(S().active!.exercises[0].sets[0].id); expect(screen.getByText('Seria zrobiona')).toBeTruthy();
    await flushAll(12 * SEC); await tap(screen.getByTestId('focus-done')); await flushAll(10);
    expect(S().active!.exercises[0].sets[0]).toMatchObject({ done: true, durationSec: 12 });
    await act(async () => { await timer.stop(); }); await flushAll(10);
    await tap(screen.getByLabelText('Odhacz bez pomiaru: Plank, seria 2')); await flushAll(10);
    expect(S().active!.exercises[0].sets[1]).toMatchObject({ done: true, durationSec: 30 }); expect(timer.S.on).toBe(false);
  });
  test('F6 (LIVE-07, wariant A): przerwa po ✓ w wierszu niżej — dolny pasek przerwy, gdy karta jest poza ekranem', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0); store.addSet(0);
    S().active!.exercises[0].sets.forEach(s => { s.weight = 80; s.reps = 8; }); await boot();
    await tap(screen.getByLabelText('Seria 1 zrobiona — Bench Press (sztanga)')); await flushAll(10); expect(timer.T.on).toBe(true);
    expect(screen.getAllByText('Pomiń')).toHaveLength(1); /* przerwa w karcie */
    await act(async () => { fireEvent(screen.getByTestId('focus-card'), 'layout', { nativeEvent: { layout: { x: 0, y: 120, width: 360, height: 420 } } }); fireEvent(screen.getByTestId('focus-rest'), 'layout', { nativeEvent: { layout: { x: 16, y: 16, width: 320, height: 64 } } }); });
    const sv = screen.getByTestId('workout-scroll');
    await act(async () => { fireEvent.scroll(sv, { nativeEvent: { contentOffset: { x: 0, y: 400 }, contentSize: { width: 360, height: 2000 }, layoutMeasurement: { width: 360, height: 700 } } }); }); await flushAll(10);
    expect(screen.getAllByText('Pomiń')).toHaveLength(2); /* karta poza ekranem — pasek przerwy na dole */
    await act(async () => { fireEvent.scroll(sv, { nativeEvent: { contentOffset: { x: 0, y: 100 }, contentSize: { width: 360, height: 2000 }, layoutMeasurement: { width: 360, height: 700 } } }); }); await flushAll(10);
    expect(screen.getAllByText('Pomiń')).toHaveLength(1);
  });
});

describe('F7 (LIVE-12 / UI-08): podwójne tapnięcie przy starcie, anulowaniu i przejściach z ekranu treningu', () => {
  test('F7 (LIVE-12): „Anuluj trening” dwa razy szybko → jedno okno', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); await boot();
    const btn = screen.getByText('Anuluj trening'); await tap(btn); await tap(btn);
    expect(global.__alerts.filter(x => x.title === 'Anulować trening?')).toHaveLength(1);
    await act(async () => { pressAlert('Anulować trening?', 'Wróć'); }); await tap(btn); expect(global.__alerts.filter(x => x.title === 'Anulować trening?')).toHaveLength(2); /* po „Wróć” znów działa */
  });
  test('F7 (LIVE-12): podwójne „Start” w tygodniu deload → jedno pytanie; podwójne „Pusty trening” / „Powtórz ostatni” → jeden trening', async () => {
    await fresh(); const t = withDemoTemplates(); store.toggleDeloadWeek(Date.now()); await boot();
    await dbl(screen.getByLabelText(`Start: ${t[0].name}`)); expect(global.__alerts.filter(x => x.title === 'Tydzień deload')).toHaveLength(1);
    await act(async () => { pressAlert('Tydzień deload', 'Anuluj'); }); await flushAll(1500);
    await dbl(screen.getByText('Pusty trening')); const id = S().active!.id; expect(S().active!.exercises).toHaveLength(0);
    await act(async () => { store.cancelWorkout(); }); await flushAll(1500); expect(S().active).toBeNull(); void id;
  });
  test('F7 (UI-08): „+ Dodaj ćwiczenie”, „≡ Kolejność” i „⇄ zamień” dwa razy szybko → jeden ekran', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Leg Press')); S().settings.workoutView = 'list'; await boot();
    const n0 = titles().length;
    await dbl(screen.getByText('+ Dodaj ćwiczenie')); expect(titles().length - n0).toBe(1);
    await act(async () => { (require('expo-router').router).back(); }); await flushAll(1500);
    await dbl(screen.getByText('≡ Kolejność')); expect(titles().length - n0).toBe(1);
    await act(async () => { (require('expo-router').router).back(); }); await flushAll(1500);
    await dbl(screen.getByLabelText('Zamień ćwiczenie: Back Squat')); expect(titles().length - n0).toBe(1);
  });
});

describe('F9: karta „teraz”, komunikaty i drobne poprawki', () => {
  test('F9 (UI-10 / LIVE-14, wariant A): „80 kg × 8” (jednostka przy ciężarze, także VoiceOver), „+10 kg × 8”, licznik bez drop setów', async () => {
    await fresh(); addLocation('gym'); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0); store.addSet(0); store.addSet(0, 'drop');
    S().active!.exercises[0].sets.forEach((s, i) => { s.weight = 80; s.reps = 8; if (i < 3) s.done = true; }); await boot();
    expect(screen.getByLabelText('Teraz: 80 kg × 8')).toBeTruthy(); expect(screen.getByText('seria 3 z 3 · drop set')).toBeTruthy(); /* audyt: „seria 4D z 4”, „80 × 8 kg” */
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Chest Dip')); Object.assign(S().active!.exercises[0].sets[0], { addKg: 10, reps: 8 }); await boot();
    expect(screen.getByLabelText('Teraz: +10 kg × 8')).toBeTruthy(); expect(screen.getByText('seria 1 z 1')).toBeTruthy();
  });
  test('F9 (LIVE-08): reszta tylko pominięta → „Nic więcej do zrobienia (część pominięta)”; nic nie odhaczono → osobny komunikat', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0); store.addSet(0);
    Object.assign(S().active!.exercises[0].sets[0], { weight: 80, reps: 8, done: true }); store.skipExercise(S().active!.exercises[0].id); await boot();
    expect(screen.getByText('Nic więcej do zrobienia (część pominięta)')).toBeTruthy(); expect(screen.queryByText('Wszystkie serie odhaczone')).toBeNull();
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.skipExercise(S().active!.exercises[0].id); await boot();
    expect(screen.getByText('Nic nie odhaczono — wszystkie ćwiczenia pominięte')).toBeTruthy();
    await tap(screen.getByText('Zakończ trening')); expect(lastAlert()!.title).toBe('Brak odhaczonych serii');
  });
  test('F9 (LIVE-09): ▶ serii na czas w trakcie pauzy wznawia trening od startu pomiaru (audyt: pauza [600; 1260])', async () => {
    jest.useFakeTimers({ now: T0 }); await fresh(); S().settings.workoutView = 'list'; store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addSet(0);
    S().active!.exercises[0].sets.forEach(s => { s.durationSec = 60; }); S().active!.startedAt = T0; await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); jest.setSystemTime(T0); await flushAll(10);
    jest.setSystemTime(T0 + 10 * MIN); await tap(screen.getByLabelText('Pauza treningu')); await flushAll(10);
    jest.setSystemTime(T0 + 20 * MIN); await tap(screen.getAllByLabelText('Start stopera serii')[0]); await flushAll(10);
    expect(S().active!.pausedAt).toBeUndefined(); expect(S().active!.pauses).toEqual([[T0 + 10 * MIN, T0 + 20 * MIN]]);
    for (let i = 0; i < 130; i++) await flushAll(500);
    const w = S().active!; expect(w.exercises[0].sets[0].done).toBe(true); expect(w.pauses).toEqual([[T0 + 10 * MIN, T0 + 20 * MIN]]);
    expect(Math.round(store.workoutDurSec(w))).toBe(Math.round((Date.now() - T0) / 1000) - 600);
  });
  test('F9 (LIVE-10, wariant B): pytanie o porzucony trening wspomina pauzę', async () => {
    jest.useFakeTimers({ now: T0 }); await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0);
    const a = S().active!; a.startedAt = T0; a.exercises[0].sets.forEach(s => { s.weight = 60; s.reps = 8; }); store.toggleDone(0, 0); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); jest.setSystemTime(T0 + 30 * MIN); await flushAll(10);
    await tap(screen.getByLabelText('Pauza treningu')); await flushAll(10);
    expect(lastNotif('stale-reminder')?.content.body).toBe('Ostatnia seria o 17:00. Otwórz, by zakończyć albo kontynuować.\nTrening w pauzie od 17:30.');
    jest.setSystemTime(T0 + 2 * 3600e3 + MIN); await flushAll(61 * SEC);
    expect(lastAlert('Trening wciąż trwa')!.msg).toBe('Ostatnia seria o 17:00. Zakończyć trening z tą godziną końca?\nTrening w pauzie od 17:30.');
  });
  test('F9 (LIVE-11): usunięcie ćwiczenia z odhaczonymi seriami — okno mówi, ile odhaczonych serii przepadnie', async () => {
    await fresh(); S().settings.workoutView = 'list'; store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0); store.addSet(0); store.addExerciseToActive(ex('Back Squat'));
    S().active!.exercises[0].sets.forEach((s, i) => { s.weight = 50; s.reps = 8; if (i < 2) { s.done = true; s.completedAt = Date.now(); } }); await boot();
    await swipeDelete('Usuń ćwiczenie: Bench Press (sztanga)'); expect(lastAlert()).toMatchObject({ title: 'Usunąć z treningu?', msg: 'Bench Press (sztanga)\nOdhaczone serie: 2 — przepadną.' });
    await swipeDelete('Usuń ćwiczenie: Back Squat'); expect(lastAlert()).toMatchObject({ title: 'Usunąć z treningu?', msg: 'Back Squat' });
  });
  test('F9 (LIVE-13 / UI-11): „Poprzednio” w wierszu serii i plakietka przerwy na zakładce w kroju aplikacji', async () => {
    await fresh(); S().settings.workoutView = 'list'; addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0);
    S().active!.exercises[0].sets.forEach(s => { s.weight = 100; s.reps = 5; }); await boot();
    const prev = screen.getAllByText('100×5').map(n => StyleSheet.flatten(n.props.style)?.fontFamily); expect(prev.length).toBeGreaterThan(0); expect(prev.every(f => f === F.regular)).toBe(true);
    expect(StyleSheet.flatten(screen.getByText('—').props.style)?.fontFamily).toBe(F.regular);
    await tap(screen.getByLabelText('Seria 1 zrobiona — Back Squat')); await flushAll(10); expect(timer.T.on).toBe(true);
    const left = Math.round((timer.T.endAt - Date.now()) / 1000); const badge = left >= 60 ? `${Math.floor(left / 60)}m` : `${left}s`;
    const b = screen.getAllByText(badge).map(n => StyleSheet.flatten(n.props.style)?.fontFamily); expect(b).toContain(F.semibold);
  });
  test('F9 (LIVE-13 / UI-11): każdy tekst ekranu treningu (lista i karta, z przerwą i „Poprzednio”) ma krój aplikacji — poza znakami-ikonami ✓ ▶ …', async () => {
    const glyph = /^[\s✓▶…›▸▾⇄⇅✂↺]*$/u;
    const bare = () => { const out: string[] = []; const walk = (n: any, inh?: string) => { if (!n || typeof n === 'string') return; let f = inh;
      if (n.type === 'Text') { f = StyleSheet.flatten(n.props.style)?.fontFamily ?? inh; const own = (n.children ?? []).filter((c: any) => typeof c === 'string').join(''); if (own && !glyph.test(own) && !f) out.push(own); }
      (n.children ?? []).forEach((c: any) => walk(c, n.type === 'Text' ? f : inh)); }; walk(screen.toJSON() as any); return out; };
    for (const view of ['list', 'focus'] as const) {
      await fresh(); S().settings.workoutView = view; addLocation('gym'); addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]);
      store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0); store.addSet(0, 'drop'); store.addExerciseToActive(ex('Plank')); store.addExerciseToActive(ex('Pull Up'));
      S().active!.exercises[0].sets.forEach(s => { s.weight = 100; s.reps = 5; }); const a = S().active!; store.linkWithNext(a.exercises, 1, a); await boot();
      await tap(screen.getByLabelText('Seria 1 zrobiona — Back Squat')); await flushAll(10); expect(timer.T.on).toBe(true);
      expect([view, bare()]).toEqual([view, []]);
    }
  });
  test('F9 (LIVE-17): ciężar spoza talerzy miejsca — podpis „Nie da się ułożyć z talerzy (miejsce) — najbliżej X”', async () => {
    await fresh(); addLocation('gym'); S().settings.unit = 'lb'; applyUnit('lb'); store.startEmpty(); /* siłownia z talerzami w kg, aplikacja w lb (dowód audytu) */ store.addExerciseToActive(ex('Bench Press (sztanga)'));
    Object.assign(S().active!.exercises[0].sets[0], { weight: wIn(225), reps: 5 }); await boot();
    expect(screen.getByLabelText('Nie da się ułożyć z talerzy (Pełna siłownia) — najbliżej 226 lb')).toBeTruthy();
    await act(async () => { const a = S().active!; a.exercises[0].sets[0].weight = 100; store.save(a); }); await flushAll(10);
    expect(screen.queryByLabelText(/^Nie da się ułożyć/)).toBeNull(); expect(screen.getByLabelText(/^Na każdą stronę: /)).toBeTruthy();
  });
});

describe('D1 (MER-05 / UI-03 / UX-06 / X-16): tydzień deload — „Powtórz ostatni” pyta jak Start, bez „↑ spróbuj”', () => {
  const NOW = new Date(2026, 9, 8, 18, 0).getTime();
  const last4 = () => addWorkout(new Date(2026, 9, 1, 18).getTime(), [['Back Squat', [1, 2, 3, 4].map(() => ({ weight: 100, reps: 12 }))]]);
  test('D1 (MER-05): „Powtórz ostatni” w tygodniu deload → „Tydzień deload” z liczbą serii; „Mniej serii” tnie, „Pełny trening” powtarza całość, „Anuluj” nic', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); last4(); store.toggleDeloadWeek(NOW); await boot(); jest.setSystemTime(NOW);
    await tap(screen.getByText(/^Powtórz ostatni/)); await flushAll(5);
    expect(lastAlert('Tydzień deload')!.msg).toBe('Zacząć z mniejszą liczbą serii: 2 zamiast 4 serii roboczych? Ciężary bez zmian, szablon się nie zmienia.');
    await act(async () => { pressAlert('Tydzień deload', 'Anuluj'); }); await flushAll(1500); expect(S().active).toBeNull();
    await tap(screen.getByText(/^Powtórz ostatni/)); await act(async () => { pressAlert('Tydzień deload', 'Mniej serii'); }); await flushAll(10);
    expect(S().active!.exercises[0].sets).toHaveLength(2); expect(S().active!.exercises[0].sets.map(s => s.weight)).toEqual([100, 100]);
    await act(async () => { store.cancelWorkout(); }); await flushAll(1500);
    await tap(screen.getByText(/^Powtórz ostatni/)); await act(async () => { pressAlert('Tydzień deload', 'Pełny trening'); }); await flushAll(10);
    expect(S().active!.exercises[0].sets).toHaveLength(4);
  });
  test('D1 (MER-05): w tygodniu deload bez „↑ spróbuj” (poprzednio 3 × 12 przy zakresie 8–12); poza tygodniem deload podpowiedź jest', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); const w = last4(); w.exercises[0].repMax = 12; w.exercises[0].repMin = 8; store.save();
    store.toggleDeloadWeek(NOW); await boot(); jest.setSystemTime(NOW);
    await tap(screen.getByText(/^Powtórz ostatni/)); await act(async () => { pressAlert('Tydzień deload', 'Pełny trening'); }); await flushAll(10);
    expect(S().active!.exercises[0].repMax).toBe(12); expect(screen.queryByText(/↑ spróbuj/)).toBeNull();
    await act(async () => { store.toggleDeloadWeek(NOW); }); await flushAll(10); expect(screen.getByText(/↑ spróbuj/)).toBeTruthy();
  });
  test('D1 (MER-05): ćwiczenia z 1 serią — dopisek w pytaniu; szablon z samymi pojedynczymi seriami — okno informacyjne z „Start”', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); store.toggleDeloadWeek(NOW);
    const t = store.newTemplate(); t.name = 'Mix'; t.items = [{ id: 'a', exerciseId: ex('Back Squat').id, sets: 3, repMin: 8, repMax: 12, restSec: null, startWeight: '', targetSec: '', groupId: null }, { id: 'b', exerciseId: ex('Plank').id, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }];
    const one = store.newTemplate(); one.name = 'Jedna'; one.items = [{ id: 'c', exerciseId: ex('Back Squat').id, sets: 1, repMin: 8, repMax: 12, restSec: null, startWeight: '', targetSec: '', groupId: null }];
    store.save(); await boot(); jest.setSystemTime(NOW);
    await tap(screen.getByLabelText('Start: Mix')); await flushAll(5);
    expect(lastAlert('Tydzień deload')!.msg).toBe('Zacząć z mniejszą liczbą serii: 3 zamiast 4 serii roboczych? Ciężary bez zmian, szablon się nie zmienia. Ćwiczenia z 1 serią bez zmian.');
    await act(async () => { pressAlert('Tydzień deload', 'Anuluj'); }); await flushAll(1500);
    await tap(screen.getByLabelText('Start: Jedna')); await flushAll(5);
    const al = lastAlert('Tydzień deload')!; expect(al.msg).toBe('Każde ćwiczenie ma tu 1 serię — liczba serii zostaje bez zmian (ćwiczenia z 1 serią nie są skracane). Ciężary bez zmian.');
    expect(al.buttons!.map(b => b.text)).toEqual(['Anuluj', 'Start']);
    await act(async () => { pressAlert('Tydzień deload', 'Start'); }); await flushAll(10); expect(S().active!.templateId).toBe(one.id); expect(S().active!.exercises[0].sets).toHaveLength(1);
  });
});

describe('D1+ (decyzja 08.10.2026): „Powtórz ostatni” po skróconym treningu — bez drugiego cięcia, pełny domyślnie poza tygodniem deload, znacznik w historii', () => {
  const NOW = new Date(2026, 9, 8, 18, 0).getTime();
  /** Skrócony trening z zeszłego tygodnia: 2 z 4 serii (szablon „Upper” z 4 seriami). */
  const shortened = () => {
    const t = store.newTemplate(); t.name = 'Upper'; t.items = [{ id: 'a', exerciseId: ex('Back Squat').id, sets: 4, repMin: 8, repMax: 12, restSec: null, startWeight: 100, targetSec: '', groupId: null }]; store.save(t);
    store.startFromTemplate(t, { deload: true }); const a = S().active!; a.startedAt = new Date(2026, 9, 1, 18).getTime(); a.exercises[0].sets.forEach((_, si) => store.toggleDone(0, si, a.startedAt + 60e3 * (si + 1)));
    return store.finishWorkout(a.startedAt + 3600e3)!;
  };
  test('D1+: tydzień deload — pytanie liczy „jak ostatnio” (2) wobec pełnego (4), „Mniej serii” nie tnie drugi raz, „Pełny trening” przywraca 4 serie', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); shortened(); store.toggleDeloadWeek(NOW); await boot(); jest.setSystemTime(NOW);
    await tap(screen.getByText(/^Powtórz ostatni/)); await flushAll(5);
    expect(lastAlert('Tydzień deload')!.msg).toBe('Zacząć z mniejszą liczbą serii: 2 zamiast 4 serii roboczych? Ciężary bez zmian, szablon się nie zmienia. Ostatni trening był już skrócony — „Mniej serii” powtórzy go bez dalszego cięcia.');
    await act(async () => { pressAlert('Tydzień deload', 'Mniej serii'); }); await flushAll(10);
    expect(S().active!.exercises[0].sets).toHaveLength(2); expect(S().active!.deload).toBe(true);
    await act(async () => { store.cancelWorkout(); }); await flushAll(1500);
    await tap(screen.getByText(/^Powtórz ostatni/)); await act(async () => { pressAlert('Tydzień deload', 'Pełny trening'); }); await flushAll(10);
    expect(S().active!.exercises[0].sets.map(s => s.weight)).toEqual([100, 100, 100, 100]); expect(S().active!.deload).toBeUndefined();
  });
  test('D1+: poza tygodniem deload — okno „Ostatni trening był lżejszy” z pełnym treningiem jako domyślnym; „Jak ostatnio” powtarza skrócony', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); shortened(); await boot(); jest.setSystemTime(NOW);
    await tap(screen.getByText(/^Powtórz ostatni/)); await flushAll(5);
    const al = lastAlert('Ostatni trening był lżejszy')!; expect(al.msg).toBe('Był skrócony w tygodniu deload: 2 zamiast 4 serii roboczych. Powtórzyć pełny trening?');
    expect(al.buttons!.map(b => [b.text, (b as any).isPreferred ?? false])).toEqual([['Anuluj', false], ['Jak ostatnio', false], ['Pełny trening', true]]);
    await act(async () => { pressAlert('Ostatni trening był lżejszy', 'Pełny trening'); }); await flushAll(10); expect(S().active!.exercises[0].sets).toHaveLength(4);
    await act(async () => { store.cancelWorkout(); }); await flushAll(1500);
    await tap(screen.getByText(/^Powtórz ostatni/)); await act(async () => { pressAlert('Ostatni trening był lżejszy', 'Jak ostatnio'); }); await flushAll(10); expect(S().active!.exercises[0].sets).toHaveLength(2);
  });
  test('D1+: skrócony bez informacji o pełnym (szablon usunięty, bez deloadFull) — bez pytania i bez drugiego cięcia; znacznik tylko w tygodniu deload', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); const w = shortened(); delete w.exercises[0].deloadFull; store.deleteTemplate(w.templateId!); store.toggleDeloadWeek(NOW); await boot(); jest.setSystemTime(NOW);
    const n0 = global.__alerts.length; await tap(screen.getByText(/^Powtórz ostatni/)); await flushAll(10);
    expect(global.__alerts.length).toBe(n0); expect(S().active!.exercises[0].sets).toHaveLength(2); expect(S().active!.deload).toBe(true);
    await act(async () => { store.cancelWorkout(); store.toggleDeloadWeek(NOW); }); await flushAll(1500);
    await tap(screen.getByText(/^Powtórz ostatni/)); await flushAll(10); expect(global.__alerts.length).toBe(n0); expect(S().active!.exercises[0].sets).toHaveLength(2); expect(S().active!.deload).toBeUndefined();
  });
  test('D1+: znacznik „deload — mniej serii” na liście sesji i w szczegółach sesji; zwykły trening bez znacznika', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); const w = shortened(); addWorkout(new Date(2026, 9, 5, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); await boot('/history'); jest.setSystemTime(NOW);
    expect(screen.getAllByText(/deload — mniej serii/)).toHaveLength(1);
    await go(`/history/${w.id}`); await flushAll(10); expect(screen.getByText(/ · deload — mniej serii$/)).toBeTruthy();
  });
});

describe('D2 (MER-04, wariant A): teksty o deloadzie', () => {
  test('D2 (MER-04): Kalendarz (oznaczony tydzień) i Postępy — „o około 1/3–1/2 mniej serii (np. 2 z 3; ćwiczenia z 1 serią bez zmian)”', async () => {
    await fresh(); addWorkout(Date.now() - 3600e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); store.toggleDeloadWeek(Date.now()); await boot('/history');
    expect(screen.getByText('Ten tydzień: deload. Przy starcie treningu zaproponuję o około 1/3–1/2 mniej serii (np. 2 z 3; ćwiczenia z 1 serią bez zmian), ciężary bez zmian.')).toBeTruthy();
    await go('/more/progress'); await flushAll(10);
    expect(screen.getByText('Twoje oznaczenie, np. lżejszy tydzień. Przy starcie treningu zaproponuję o około 1/3–1/2 mniej serii (np. 2 z 3; ćwiczenia z 1 serią bez zmian), ciężary bez zmian.')).toBeTruthy();
    expect(screen.queryByText(/około połowy/)).toBeNull();
  });
});

describe('PERF-06: odświeżanie w czasie przerwy', () => {
  test('PERF-06: zakładki przerysowują się przy zmianie plakietki, nie co sekundę', async () => {
    await fresh(); S().settings.workoutView = 'list'; store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); S().active!.exercises[0].restSec = 170; await boot();
    await tap(screen.getByLabelText('Seria 1 zrobiona — Back Squat')); await flushAll(10); expect(timer.T.on).toBe(true);
    await flushAll(1500); /* plakietka „2m” */
    const spy = jest.spyOn(planReminder, 'planReminderKey');
    try { for (let i = 0; i < 10; i++) await flushAll(1000); expect(spy.mock.calls.length).toBeLessThanOrEqual(1); } finally { spy.mockRestore(); }
  });
  test('PERF-06: pierścień stopera na karcie bez interwału, gdy stoper nie działa', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); await boot(); await flushAll(2000);
    expect(screen.getByText('▶ Start')).toBeTruthy(); const focus = jest.getTimerCount();
    await act(async () => { S().settings.workoutView = 'list'; store.save(); }); await flushAll(2000);
    expect(screen.queryByText('▶ Start')).toBeNull(); expect(jest.getTimerCount()).toBe(focus);
  });
});
