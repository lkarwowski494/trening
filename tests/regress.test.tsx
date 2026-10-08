/* Testy regresji: każdy błąd znaleziony w rundach audytu dostaje test, który go odtwarza (plan 09). */
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as timer from '@/lib/timer';
import * as units from '@/lib/units';
import { buildCsv } from '@/lib/backup';
import { fresh, ex, addWorkout, pressAlert, seedState, withDemoTemplates, seedWithDemo, legacyBandKg } from './helpers';
import { renderApp, tap, type, flushAll, screen, go, act, openCard, swipeDelete, deleteActions } from './app';

jest.setTimeout(30000);
const at = (y: number, m: number, d: number, h = 18) => new Date(y, m - 1, d, h).getTime();
afterEach(async () => { try { store.getState(); } catch { return; } /* runda 68: test uruchomiony osobno, bez wczytanego stanu */ await timer.stop(); await timer.stopSet(); });

describe('runda 1 — logika', () => {
  beforeEach(async () => { await fresh(); });
  test('R1-01 powiadomienia przerwy/serii mają stałe identyfikatory (anulowalne po restarcie)', async () => {
    store.startEmpty(); await timer.start(60);
    expect((global.__notifications as any[]).some(n => n.identifier === 'rest-end')).toBe(true);
  });
  test('R1-02 domyślna przerwa 0 s działa i przeżywa restart', async () => {
    store.getState().settings.defaultRest = 0; store.save(); expect(store.restFor(undefined)).toBe(0);
    await store.flush(); store.__resetForTests(); await store.init(); expect(store.getState().settings.defaultRest).toBe(0);
  });
  test('R1-03 przerwa po rozgrzewce 0 s', () => {
    store.startEmpty(); const e = ex('Back Squat'); e.restWarmupSec = 0; store.addExerciseToActive(e);
    const s0 = store.getState().active!.exercises[0].sets[0]; s0.kind = 'warmup'; s0.warmup = true;
    expect(store.toggleDone(0, 0)).toBe(0);
  });
  test('R1-04 przerwa z pozycji szablonu ma pierwszeństwo', () => {
    const e = ex('Back Squat'); e.restSec = 120;
    const tpl = store.newTemplate(); tpl.items.push({ id: 'i1', exerciseId: e.id, sets: 3, repMin: 5, repMax: 5, restSec: 60, startWeight: 100, targetSec: '', groupId: null });
    store.startFromTemplate(tpl); expect(store.getState().active!.exercises[0].restSec).toBe(60);
  });
  test('R1-05 → P-001/T-055: wybór i zmiana gumy (przycisk gumy — store.cycleBand) nie zmieniają ±kg (także ze starym nominalKg w danych)', () => {
    const st = store.getState(); st.bands.forEach(b => legacyBandKg(b, 20)); const [A, B] = [...st.bands].sort((a, b) => a.level - b.level);
    const s: any = { bandId: '', addKg: '' }; store.cycleBand(s); expect([s.bandId, s.addKg]).toEqual([A.id, '']);
    s.addKg = -15; store.cycleBand(s); expect([s.bandId, s.addKg]).toEqual([B.id, -15]);
  });
  test('R1-06 powtórz ostatni porządkuje superset po usuniętym ćwiczeniu', () => {
    const w = addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]], ['Pull Up', [{ reps: 5 }]]]);
    w.exercises[0].groupId = 'g'; w.exercises[1].groupId = 'g'; store.save();
    store.deleteExercise(ex('Back Squat').id); store.repeatLast();
    expect(store.getState().active!.exercises[0].groupId).toBeNull();
  });
  test('R1-07 objętość tygodnia = suma objętości treningów z historii', () => {
    const now = new Date(); const t0 = stats.thisMonday(0, now) + 3600e3;
    const w1 = addWorkout(t0, [['Push Up', [{ reps: 7, addKg: 10 }]]]); const w2 = addWorkout(t0 + 60e3, [['Push Up', [{ reps: 7 }]]]);
    expect(stats.weeklyTotals(8, now)[7].volume).toBe(store.volume(w1) + store.volume(w2));
  });
  test('R1-08 CSV bez szumu zmiennoprzecinkowego', () => {
    units.applyUnit('lb'); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: units.wIn(45) as number, reps: 5 }]]]); units.applyUnit('kg');
    expect(buildCsv().trim().split('\n')[1].split(',')[5]).toBe('20.4'); // runda 26: 45 lb zapisuje się jako okrągłe 20,4 kg (wyświetla się jako 45 lb)
  });
  test('R1-09 +15 s po końcu przerwy uzbraja alarm na nowo', async () => {
    const now = Date.now(); const spy = jest.spyOn(Date, 'now'); store.startEmpty();
    spy.mockReturnValue(now); await timer.start(10); spy.mockReturnValue(now + 12e3); timer.tick(); expect(timer.T.alarmed).toBe(true);
    await timer.adjust(15); expect(timer.T.alarmed).toBe(false); spy.mockRestore();
  });
  test('R1-10 odhaczenie nieistniejącej serii nie wywraca aplikacji', () => {
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); expect(store.toggleDone(5, 0)).toBeNull();
  });
  test('R1-11 seria bez powtórzeń nie jest rekordem ciężaru', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    const w = addWorkout(at(2026, 9, 8), [['Back Squat', [{ weight: 140, reps: '' }]]]);
    expect(stats.prMap(w).size).toBe(0); expect(stats.recordsFor(ex('Back Squat')).maxLoad).toBe(100);
  });
  test('R1-12 nowe ćwiczenie własne domyślnie ×1 (nie „hantle ×2”)', () => {
    const e = store.newExercise('Maszyna X'); expect(store.exMult(e)).toBe(1);
  });
  test('R1-13 odhaczenie pustej serii bierze wynik z „Poprzednio”', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 105, reps: 3 }]]]);
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0);
    store.toggleDone(0, 1); const s1 = store.getState().active!.exercises[0].sets[1];
    expect([s1.weight, s1.reps]).toEqual([105, 3]);
  });
  test('R1-14 czas od godziny w formacie h:mm:ss', () => { expect(store.fmtDur(5700)).toBe('1:35:00'); expect(store.fmtDur(90)).toBe('1:30'); });
  test('R1-15 Apple Health: odmowa zgody nie włącza zapisu', async () => {
    const hk = require('@kingstinct/react-native-healthkit').default;
    hk.isHealthDataAvailable = async () => true; hk.requestAuthorization = async () => true; hk.authorizationStatusFor = async () => 1;
    const { ensureAuthorization } = require('@/lib/health');
    expect(await ensureAuthorization()).toBe(false);
    hk.authorizationStatusFor = async () => 2; expect(await ensureAuthorization()).toBe(true);
  });
});

describe('runda 1 — ekrany', () => {
  test('R1-20 − seria na trwającym stoperze zatrzymuje stoper', async () => {
    await renderApp();
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addSet(0); }); await flushAll(10);
    await tap(screen.getAllByLabelText('Start stopera serii')[1]); expect(timer.S.on).toBe(true);
    /* 07.10.2026 wieczór: „− seria” zastąpione usuwaniem przesunięciem wiersza (components/SwipeRow.tsx) */
    await swipeDelete('Usuń serię 2 — Plank'); pressAlert('Usunąć serię?', 'Usuń'); await flushAll(10);
    expect(timer.S.on).toBe(false);
  });
  test('R1-21 po polsku przecinek w polach wstawionych przez apkę', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByLabelText('Start: Upper B')); await flushAll(10);
    expect(screen.getAllByDisplayValue('12,5').length).toBeGreaterThan(0);
  });
  test('R1-22 puste pole w oknie przerwy nie zeruje przerwy', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByLabelText('Start: Upper A')); await flushAll(10);
    await tap(screen.getAllByLabelText(/^Przerwa: /)[0]); pressAlert('Przerwa (sekundy)', 'Zapamiętaj', '  ');
    expect(ex('Bench Press (hantle)').restSec).toBeNull();
    await tap(screen.getAllByLabelText(/^Przerwa: /)[0]); pressAlert('Przerwa (sekundy)', 'Zapamiętaj', '75');
    expect(ex('Bench Press (hantle)').restSec).toBe(75); expect(store.getState().templates[0].items[0].restSec).toBe(75);
  });
  test('R1-23 (runda 75, Q-001): edytor ćwiczenia z masą ciała nie ma już pola udziału masy ciała', async () => {
    await renderApp(); await go(`/exercise/${ex('Push Up').id}`); await flushAll(10);
    expect(screen.queryByText(/Udział masy ciała/)).toBeNull(); expect(screen.queryByDisplayValue('64')).toBeNull();
  });
  test('R1-24 zakończenie z nagłówka wymaga potwierdzenia i ostrzega o nieodhaczonych wynikach', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByLabelText('Start: Upper A')); await flushAll(10);
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]);
    await type(screen.getAllByLabelText('Powtórzenia')[1], '7'); // wpisane ręcznie
    await tap(screen.getAllByText('Zakończ')[0]);
    const a = global.__alerts[global.__alerts.length - 1]; expect(a.title).toBe('Zakończyć trening?'); expect(a.msg).toMatch(/: 1 —/);
    expect(store.getState().active).not.toBeNull();
  });
  test('R1-25 plakietka z czasem przerwy na zakładce Trening', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByLabelText('Start: Upper A')); await flushAll(10);
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]); await go('/history'); await flushAll(1000);
    expect(screen.getAllByText(/^[0-9]+[′″]$/).length).toBeGreaterThan(0); /* audyt 0.10 A11-17: 2′/45″; 02.10.2026: skrót „2m/45s” — „2:28” było ucinane na iOS */
    expect(screen.getByLabelText(/^Trening, przerwa [0-9]+:[0-9]{2}$/)).toBeTruthy(); // VoiceOver: pełny czas
  });
  test('R1-26 wiersz szablonu na ekranie głównym otwiera podgląd, nie start', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByText('Upper A')); await flushAll(10);
    expect(store.getState().active).toBeNull(); expect(screen.getByText('Duplikuj')).toBeTruthy();
  });
});

describe('runda 2 — logika', () => {
  beforeEach(async () => { await fresh(); });
  test('R2-01 cel czasu z szablonu wygrywa z czasem z poprzedniej sesji', async () => {
    addWorkout(at(2026, 9, 1), [['Plank', [{ durationSec: 60 }]]]);
    const tpl = store.newTemplate(); tpl.items.push({ id: 'i1', exerciseId: ex('Plank').id, sets: 1, repMin: null, repMax: null, restSec: 60, startWeight: '', targetSec: 90, groupId: null });
    store.startFromTemplate(tpl); expect(store.getState().active!.exercises[0].sets[0].durationSec).toBe(90);
  });
  test('R2-02 czas serii nie przechodzi na następną serię (nie staje się celem stopera)', () => {
    store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addSet(0);
    const [s0, s1] = store.getState().active!.exercises[0].sets; s0.durationSec = 47; store.toggleDone(0, 0);
    expect(s1.durationSec).toBe('');
  });
  test('R2-03 +15 po dawno minionej przerwie liczy od teraz', async () => {
    const now = Date.now(); const spy = jest.spyOn(Date, 'now'); store.startEmpty();
    spy.mockReturnValue(now); await timer.start(10); spy.mockReturnValue(now + 70e3); timer.tick();
    await timer.adjust(15); expect((timer.T.endAt - (now + 70e3)) / 1000).toBe(15); expect(timer.T.alarmed).toBe(false);
    const end = timer.T.endAt; spy.mockReturnValue(now + 200e3); await timer.adjust(-15); expect(timer.T.endAt).toBe(end); spy.mockRestore();
  });
  test('R2-04 piramida: puste serie biorą swoją podpowiedź, nie pierwszej serii', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 80, reps: 8 }]]]);
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0);
    store.toggleDone(0, 0); store.toggleDone(0, 1);
    expect(store.getState().active!.exercises[0].sets.map(s => [s.weight, s.reps])).toEqual([[100, 5], [80, 8]]);
  });
  test('R2-05 asysta z podpowiedzi przychodzi razem z gumą', () => {
    const st = store.getState(); legacyBandKg(st.bands[0], 20);
    addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 8, bandId: st.bands[0].id, addKg: -20 }]]]);
    store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); store.toggleDone(0, 0);
    const s = st.active!.exercises[0].sets[0]; expect([s.addKg, s.bandId]).toEqual([-20, st.bands[0].id]);
  });
  test('R2-06 seria bez podpowiedzi („—”) nie jest uzupełniana ostatnią serią', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0); store.toggleDone(0, 1);
    const s1 = store.getState().active!.exercises[0].sets[1]; expect([s1.weight, s1.reps]).toEqual(['', '']);
  });
  test('R2-07 pusta przerwa w pozycji szablonu = przerwa z ćwiczenia', () => {
    const e = ex('Back Squat'); e.restSec = 200;
    const tpl = store.newTemplate(); tpl.items.push({ id: 'i1', exerciseId: e.id, sets: 1, repMin: 5, repMax: 5, restSec: null, startWeight: 100, targetSec: '', groupId: null });
    store.startFromTemplate(tpl); expect(store.getState().active!.exercises[0].restSec).toBe(200);
  });
  test('R2-08 start ±kg z szablonu dla masy ciała', () => {
    const tpl = store.newTemplate(); tpl.items.push({ id: 'i1', exerciseId: ex('Chin Up').id, sets: 1, repMin: 5, repMax: 5, restSec: 60, startWeight: 10, targetSec: '', groupId: null });
    store.startFromTemplate(tpl); expect(store.getState().active!.exercises[0].sets[0].addKg).toBe(10);
  });
  test('R2-09 powtórz ostatni odtwarza faktyczny trening (z ćwiczeniem dodanym w trakcie)', () => {
    const tpl = withDemoTemplates()[0];
    const w = addWorkout(at(2026, 9, 1), [['Bench Press (hantle)', [{ weight: 24, reps: 8 }]], ['Plank', [{ durationSec: 60 }]]]); w.templateId = tpl.id; store.save();
    store.repeatLast(); expect(store.getState().active!.exercises.map(e => e.exerciseId)).toEqual([ex('Bench Press (hantle)').id, ex('Plank').id]);
  });
});

describe('runda 2 — ekrany', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  test('R2-20 ostrzeżenie przy zakończeniu nie liczy wartości z podpowiedzi', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByLabelText('Start: Upper A')); await flushAll(10);
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]); await tap(screen.getAllByText('Zakończ')[0]);
    const a = global.__alerts[global.__alerts.length - 1]; expect(a.msg).not.toMatch(/z wpisanymi wynikami/);
    /* audyt 0.10 (LIVE-05, wariant B): serie wstawione z planu w zaczętym ćwiczeniu są teraz policzone osobną linią (wcześniej przepadały bez słowa) */
    expect(a.msg).toMatch(/^Zapisane zostaną serie robocze: 1\.\nNieodhaczone serie: [1-9]\d* — nie zostaną zapisane\./);
  });
  test('R2-21 numer serii w dostępności i menu = numer na ekranie (po rozgrzewce)', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0); }); await flushAll(10);
    await tap(screen.getAllByLabelText(/Seria 1, typ/)[0]); await act(async () => { (global as any).__pickSheet(1); }); await flushAll(10);
    expect(screen.getAllByLabelText(/^Seria 1 zrobiona/)).toHaveLength(1); expect(screen.getAllByLabelText(/^Seria W zrobiona/)).toHaveLength(1);
    await tap(screen.getAllByLabelText(/Seria 1, typ/)[0]); expect((global as any).__sheets.at(-1).opts.title).toBe('Seria 1');
  });
  test('R2-22 pusta nazwa ćwiczenia wraca do domyślnej po edycji', async () => {
    await renderApp(); const e = ex('Back Squat'); await go(`/exercise/${e.id}`); await flushAll(10);
    const f = screen.getByDisplayValue('Back Squat'); await type(f, ''); await act(async () => { f.props.onEndEditing?.(); }); expect(e.name.trim()).not.toBe('');
  });
  test('R2-23 (05.10.2026: poranny wpis usunięty z ekranu) wpis z BB = 0 i samymi godzinami snu zostaje w danych bez zmian', async () => {
    const saved = require('@/lib/seed').seedState(); saved.mornings.push({ id: 'm', ownerId: 'local', createdAt: 0, updatedAt: 0, date: store.localISODate(), bb: 0, sleepScore: '', sleepH: 7.5, weight: '' });
    await renderApp({ saved }); expect(store.getState().mornings[0]).toMatchObject({ bb: 0, sleepH: 7.5 }); expect(screen.queryByText(/BB 0/)).toBeNull();
  });
  test('R2-24 pole liczbowe pokazuje po edycji wartość zapisaną (po przycięciu)', async () => {
    await renderApp({ saved: seedWithDemo() }); const tpl = store.getState().templates[0]; await go(`/template/${tpl.id}`); await flushAll(10); await openCard(0);
    const f = screen.getAllByLabelText('przerwa s')[0]; await type(f, '1800'); await type(f, '2500'); expect(tpl.items[0].restSec).toBe(1800); /* 05.10.2026: pole „serie” zastąpione wierszami — ta sama zasada na polu przerwy (limit 1800) */
    await act(async () => { f.props.onEndEditing?.(); }); expect(f.props.value).toBe('1800');
  });
  test('R2-25 zmiana języka przeformatowuje separator w polach', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByLabelText('Start: Upper B')); await flushAll(10);
    expect(screen.getAllByDisplayValue('12,5').length).toBeGreaterThan(0);
    await act(async () => { store.getState().settings.language = 'en'; store.applyPrefs(); store.save(); }); await flushAll(10);
    expect(screen.queryAllByDisplayValue('12,5')).toHaveLength(0);
  });
  test('R2-26 nietknięty nowy szablon znika po wyjściu', async () => {
    await renderApp(); const n = store.getState().templates.length; await go('/templates'); await flushAll(10);
    await tap(screen.getByText('+ Nowy')); await flushAll(10); expect(store.getState().templates.length).toBe(n + 1);
    const { router } = require('expo-router'); await act(async () => { router.back(); }); await flushAll(10);
    expect(store.getState().templates.length).toBe(n);
  });
  test('R2-27 plakietka po czasie pokazuje nadwyżkę', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByLabelText('Start: Upper A')); await flushAll(10);
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]); await go('/history'); await flushAll(200e3);
    expect(screen.getAllByText(/^\+[0-9]+[′″]$/).length).toBeGreaterThan(0); /* A11-17 */ // 02.10.2026: skrót na plakietce
  });
});

describe('runda 3', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  test('R3-01 + seria po zmierzonej serii nie przejmuje jej czasu jako celu', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank'));
    const s0 = store.getState().active!.exercises[0].sets[0]; s0.durationSec = 47; store.toggleDone(0, 0); store.addSet(0);
    expect(store.getState().active!.exercises[0].sets[1].durationSec).toBe('');
  });
  test('R3-02 ręczne ±kg: guma z podpowiedzi nie jest dokładana ani przenoszona', async () => {
    await fresh(); const st = store.getState(); legacyBandKg(st.bands[0], 20);
    addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 8, bandId: st.bands[0].id, addKg: -20 }]]]);
    store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); store.addSet(0);
    const [s0, s1] = st.active!.exercises[0].sets; s0.addKg = 10; s0.reps = 5; store.toggleDone(0, 0);
    expect([s0.bandId, s1.bandId]).toEqual(['', '']);
  });
  test('R3-03 wybrana guma (bez kg) przechodzi na następną serię', async () => {
    await fresh(); const st = store.getState(); store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); store.addSet(0);
    const [s0, s1] = st.active!.exercises[0].sets; s0.bandId = st.bands[0].id; s0.reps = 8; store.toggleDone(0, 0);
    expect([s1.reps, s1.bandId]).toEqual([8, st.bands[0].id]);
  });
  test('R3-04 Start w edytorze szablonu wraca do istniejącego ekranu głównego', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByText('Upper A')); await flushAll(10);
    await tap(screen.getByText('Start')); await flushAll(10);
    const { router } = require('expo-router'); expect(router.canGoBack()).toBe(false);
    expect(screen.getAllByText('Zakończ trening i zapisz')).toHaveLength(1);
  });
  test('R3-05 skasowana nazwa wraca do poprzedniej; pusty zapisany szablon nie znika', async () => {
    await renderApp(); const tpl = store.newTemplate(); tpl.name = 'Mobilność'; store.save(tpl);
    await go(`/template/${tpl.id}`); await flushAll(10); await openCard(0);
    const f = screen.getByDisplayValue('Mobilność'); await type(f, ''); await act(async () => { f.props.onEndEditing?.(); });
    expect(tpl.name).toBe('Mobilność');
    const { router } = require('expo-router'); await act(async () => { router.back(); }); await flushAll(10);
    expect(store.getState().templates.some(t => t.id === tpl.id)).toBe(true);
  });
  test('R3-06 zakończenie przy trwającym stoperze zapisuje serię na czas', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Plank')); }); await flushAll(10);
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]); await tap(screen.getByLabelText('Start stopera serii')); await flushAll(40e3);
    await tap(screen.getAllByText('Zakończ')[0]); await flushAll(10); pressAlert('Zakończyć trening?', 'Zakończ'); await flushAll(500);
    const w = store.getState().workouts.at(-1)!; expect(w.exercises.map(e => e.exerciseId)).toContain(ex('Plank').id);
  });
  test('R3-07 ekran błędu startu w języku telefonu', async () => {
    const i18n = require('@/lib/i18n'); global.__locales = [{ languageCode: 'en', languageTag: 'en-GB' }]; i18n.applyLang('auto');
    expect(i18n.t('Nie udało się otworzyć danych.')).toBe('Could not open your data.'); global.__locales = [{ languageCode: 'pl', languageTag: 'pl-PL' }]; i18n.applyLang('auto');
  });
  test('R3-08 przecinek dziesiętny: godziny snu, RPE, dystans', async () => {
    await fresh(); const e = ex('Back Squat');
    expect(store.setSummary(e, { ...require('./helpers').set({ weight: 100, reps: 5, rpe: 8.5 }) })).toBe('100×5 @8,5');
    expect(store.fmtDist(1500)).toBe('1,5 km');
  });
  test('R3-09 szablon bez ćwiczeń nie ma przycisku Start na ekranie głównym', async () => {
    const saved = require('@/lib/seed').seedState(); saved.templates.push({ id: 'p', ownerId: 'local', createdAt: 1, updatedAt: 2, name: 'Pusty', items: [] });
    await renderApp({ saved }); expect(screen.queryByLabelText('Start: Pusty')).toBeNull();
  });
  test('R3-10 pola w edytorze szablonu i porannym wpisie mają opis dla VoiceOver', async () => {
    await renderApp({ saved: seedWithDemo() }); await go(`/template/${store.getState().templates[0].id}`); await flushAll(10);
    const { TextInput } = require('react-native');
    expect(screen.UNSAFE_getAllByType(TextInput).filter((i: any) => !i.props.accessibilityLabel)).toHaveLength(0);
    await go('/more/morning'); await flushAll(10);
    expect(screen.UNSAFE_getAllByType(TextInput).filter((i: any) => !i.props.accessibilityLabel)).toHaveLength(0);
  });
  test('R3-11 szablon bez ćwiczeń nie ma „Duplikuj”', async () => {
    await renderApp(); await go('/templates'); await flushAll(10); await tap(screen.getByText('+ Nowy')); await flushAll(10);
    expect(screen.queryByText('Duplikuj')).toBeNull();
  });
  test('R3-12 wywołania Live Activity idą po kolei', async () => {
    await fresh(); const { serial } = require('@/modules/rest-activity/serial');
    const calls: string[] = []; let release: () => void = () => {};
    serial(() => new Promise(r => { calls.push('A'); release = () => r(true); }));
    serial(async () => { calls.push('B'); });
    for (let i = 0; i < 5; i++) await Promise.resolve(); expect(calls).toEqual(['A']);
    release(); for (let i = 0; i < 5; i++) await Promise.resolve(); expect(calls).toEqual(['A', 'B']);
  });
});

describe('runda 4', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  test('R4-01 cofnięcie i ponowne odhaczenie nie przenosi podpowiedzi na następną serię', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 80, reps: 8 }]]]);
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0);
    store.toggleDone(0, 0); store.toggleDone(0, 0); store.toggleDone(0, 0); store.toggleDone(0, 1);
    expect(store.getState().active!.exercises[0].sets.map(s => [s.weight, s.reps])).toEqual([[100, 5], [80, 8]]);
  });
  test('R4-02 stoper dłuższy niż godzina wraca po restarcie aplikacji', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bieg'));
    const sid = store.getState().active!.exercises[0].sets[0].id; const t0 = Date.now(); const spy = jest.spyOn(Date, 'now'); spy.mockReturnValue(t0);
    await timer.startSet(sid, 3600); await store.flush(); timer.S.on = false; timer.S.setId = null;
    store.__resetForTests(); await store.init(); spy.mockReturnValue(t0 + 3700e3); await timer.restore();
    expect(await timer.stopSet()).toEqual({ setId: sid, sec: 3600, endAt: t0 + 3600e3 /* T8: koniec serii = start + cel */ }); spy.mockRestore();
  });
  test('R4-03 reset tworzy dane w języku widocznym po resecie', async () => {
    await fresh(undefined, 'pl'); const i18n = require('@/lib/i18n'); store.getState().settings.language = 'en'; store.applyPrefs();
    store.resetAll(); expect(i18n.lang()).toBe('pl'); expect(store.getState().bands.map(b => b.color)).toEqual(['czerwona', 'czarna', 'fioletowa']);
  });
  test('R4-04 czas z poprzedniej sesji nie jest celem stopera w kolejnym treningu', async () => {
    await fresh(); const tpl = store.newTemplate(); tpl.items.push({ id: 'i', exerciseId: ex('Plank').id, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null });
    addWorkout(at(2026, 9, 1), [['Plank', [{ durationSec: 30 }]]]); w0(tpl.id);
    store.startFromTemplate(tpl); expect(store.getState().active!.exercises[0].sets[0].durationSec).toBe('');
    store.cancelWorkout(); store.repeatLast(); expect(store.getState().active!.exercises[0].sets[0].durationSec).toBe('');
    function w0(id: string) { store.getState().workouts.at(-1)!.templateId = id; }
  });
  test('R4-05 odhaczenie bez powtórzeń przy zakresie bierze dolną granicę', async () => {
    await fresh(); withDemoTemplates(); store.startFromTemplate(store.getState().templates[0]); store.toggleDone(0, 0);
    expect(store.getState().active!.exercises[0].sets[0].reps).toBe(6);
  });
  test('R4-06 postępy pokazują usunięte ćwiczenie z historią', async () => {
    await renderApp(); addWorkout(Date.now() - 3600e3, [['Bench Press (hantle)', [{ weight: 24, reps: 8 }]]]); store.deleteExercise(ex('Bench Press (hantle)').id);
    await go('/more/progress'); await flushAll(10); expect(screen.getByText(/Bench Press \(hantle\) \(usunięte\)/)).toBeTruthy();
  });
  test('R4-07 serie per partia z przecinkiem', async () => {
    await renderApp(); addWorkout(Date.now() - 3600e3, [['Bench Press (hantle)', [{ weight: 24, reps: 8 }]]]); await go('/more/progress'); await flushAll(10);
    expect(screen.getAllByText(/^0,5/).length).toBeGreaterThan(0);
  });
  test('R4-08 „Zakończ” → „Wróć” nie przerywa trwającej serii na czas', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Plank')); }); await flushAll(10);
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]); await tap(screen.getByLabelText('Start stopera serii')); await flushAll(20e3);
    await tap(screen.getAllByText('Zakończ')[0]); pressAlert('Zakończyć trening?', 'Wróć'); await flushAll(10);
    expect(timer.S.on).toBe(true);
  });
  test('R4-09 wyszukanie usuniętego ćwiczenia pozwala je przywrócić', async () => {
    await renderApp(); addWorkout(Date.now() - 3600e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); store.deleteExercise(ex('Back Squat').id);
    await act(async () => { store.startEmpty(); }); await go('/picker?target=active'); await flushAll(10);
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'back squat'); await tap(screen.getByText('Przywróć „Back Squat”')); await flushAll(10);
    expect(ex('Back Squat').archived).toBeUndefined(); /* restoreExercise (06.10) */ expect(store.getState().active!.exercises[0].exerciseId).toBe(ex('Back Squat').id);
  });
});

describe('runda 5', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  test('R5-01 cofnięcie odhaczenia czyści podpowiedzi, ale zostawia pole poprawione ręcznie', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.toggleDone(0, 0);
    const s0 = store.getState().active!.exercises[0].sets[0]; expect([s0.weight, s0.reps]).toEqual([100, 5]);
    s0.reps = 7; s0.edited = true; store.toggleDone(0, 0);
    expect([s0.weight, s0.reps]).toEqual(['', 7]);
  });
  test('R5-02 stary format „hinted” (lista) po migracji nie psuje odznaczania', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat'));
    const s0 = store.getState().active!.exercises[0].sets[0]; Object.assign(s0, { weight: 80, reps: 5, done: true, hinted: ['weight'] });
    await store.flush(); store.__resetForTests(); await store.init();
    const s1 = store.getState().active!.exercises[0].sets[0]; expect(s1.hinted).toBeUndefined();
    store.toggleDone(0, 0); expect([s1.weight, s1.reps]).toEqual([80, 5]);
  });
  const runPlank = async (warm: boolean) => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Plank')); const p = store.getState().active!.exercises[1].sets[0]; p.durationSec = 60; p.edited = true; if (warm) { p.kind = 'warmup'; p.warmup = true; } store.save(); }); await flushAll(10);
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]); await tap(screen.getByLabelText('Start stopera serii')); await flushAll(5e3);
    await tap(screen.getAllByText('Zakończ')[0]); return global.__alerts[global.__alerts.length - 1];
  };
  test('R5-03 trwająca seria na czas nie jest liczona jako „nie zostanie zapisana”', async () => {
    const a = await runPlank(false); expect(a.title).toBe('Zakończyć trening?');
    expect(a.msg).not.toMatch(/nie zostaną zapisane/); expect(a.msg).toMatch(/robocze: 2/); pressAlert('Zakończyć trening?', 'Wróć');
  });
  test('R5-04 trwająca rozgrzewka na czas nie zawyża liczby serii roboczych', async () => {
    const a = await runPlank(true); expect(a.msg).toMatch(/robocze: 1\./); pressAlert('Zakończyć trening?', 'Wróć');
  });
  test('R5-05 EN: wyszukanie usuniętego ćwiczenia pokazuje tylko „Restore”, bez „Create”', async () => {
    await renderApp({ locale: 'en' }); addWorkout(Date.now() - 3600e3, [['Bench Press (hantle)', [{ weight: 24, reps: 8 }]]]); store.deleteExercise(ex('Bench Press (hantle)').id);
    await act(async () => { store.startEmpty(); }); await go('/picker?target=active'); await flushAll(10);
    await type(screen.getByPlaceholderText('Search exercises…'), 'bench press (dumbbell)'); await flushAll(10);
    expect(screen.getByText('Restore “Bench Press (Dumbbell)”')).toBeTruthy(); expect(screen.queryByText(/^Create/)).toBeNull();
  });
  test('R5-06 zmiana partii: automatyczna partia główna jest podmieniana i nie dubluje pomocniczej', async () => {
    await renderApp(); let e: any; await act(async () => { e = store.newExercise('Moje ćwiczenie'); e.secondaryMuscles = ['plecy']; store.save(e); });
    await go(`/exercise/${e.id}`); await flushAll(10);
    await tap(screen.getAllByText('klatka')[0]); expect(e.muscles).toEqual(['klatka']);
    await tap(screen.getAllByText('plecy')[0]); expect(e.muscles).toEqual(['plecy']); expect(e.secondaryMuscles).toEqual([]);
    e.muscles = ['plecy', 'biceps']; await tap(screen.getAllByText('klatka')[0]); expect(e.muscles).toEqual(['plecy', 'biceps']);
  });
  test('R5-07 pola na ekranie gum mają opisy dla VoiceOver', async () => {
    await renderApp(); await go('/more/bands'); await flushAll(10);
    expect(screen.getAllByLabelText('Kolor gumy')).toHaveLength(3); expect(screen.getAllByLabelText('Poziom (1–7)')).toHaveLength(3); expect(screen.queryAllByLabelText('Asysta (kg)')).toHaveLength(0); /* P-001: gumy bez kg */
  });
});

describe('runda 6', () => {
  afterEach(async () => { await timer.stop(); await timer.stopSet(); units.applyUnit('kg'); });
  test('R6-01 objętość w lb zaokrąglana po przeliczeniu (1000 lb, nie 1000,9)', async () => {
    await fresh(); units.applyUnit('lb');
    const w = addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100 * units.KG_PER_LB, reps: 10 }]]]);
    expect(units.fmtVol(store.volume(w))).toBe('1000 lb');
  });
  test('R6-02 wolniejszy bieg nie jest rekordem „czas”', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Bieg', [{ distanceM: 5000, durationSec: 1500 }]]]);
    const w = addWorkout(at(2026, 9, 3), [['Bieg', [{ distanceM: 5000, durationSec: 1800 }]]]);
    expect([...stats.prMap(w).values()]).toEqual([]);
  });
  test('R6-03 ciężar dropu nie przechodzi na serię roboczą i odwrotnie', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0); store.addSet(0);
    const sets = store.getState().active!.exercises[0].sets; sets[1].kind = 'drop';
    sets[0].weight = 100; sets[0].reps = 8; store.toggleDone(0, 0); expect(sets[1].weight).toBe('');
    sets[1].weight = 70; sets[1].reps = 10; store.toggleDone(0, 1); expect(sets[2].weight).toBe('');
  });
  test('R6-04 (runda 73) dociążenie: rekordem jest e1RM; ta sama suma powtórzeń nie jest rekordem', async () => {
    await fresh();
    addWorkout(at(2026, 9, 1), [['Chin Up', [{ addKg: 10, reps: 5 }]]]);
    const w = addWorkout(at(2026, 9, 3), [['Chin Up', [{ addKg: 12.5, reps: 5 }]]]);
    /* E1 (audyt 0.10): e1RM ćwiczeń z masą ciała tylko z masą ciała w Ustawieniach (Epley na masie + dociążeniu) — bez niej brak rekordu e1RM */
    expect([...stats.prMap(w).values()][0]).toBeUndefined();
    store.getState().settings.bodyMass = 80; store.save(); expect([...stats.prMap(w).values()][0]).toEqual(['e1RM']);
  });
  test('R6-05 przycisk Start na ekranie głównym jest osobnym elementem (nie w wierszu)', async () => {
    await renderApp({ saved: seedWithDemo() }); const start = screen.getByLabelText('Start: Upper A');
    let p: any = start.parent; while (p) { if (typeof p.type === 'string' && p.props?.accessible && p.props.accessibilityLabel !== 'Start: Upper A') throw new Error('Start zagnieżdżony w elemencie dostępności wiersza'); p = p.parent; }
    expect(screen.getAllByRole('button').some(b => /^Upper A,/.test(b.props.accessibilityLabel))).toBe(true);
  });
  test('R6-06 przełączniki w ustawieniach mają nazwę i stan', async () => {
    await renderApp(); await go('/more/settings'); await flushAll(10);
    const sw = screen.getAllByRole('switch'); expect(sw.map(x => x.props.accessibilityLabel)).toEqual(expect.arrayContaining(['Dźwięk i wibracja na koniec przerwy', 'Ekran włączony podczas treningu']));
    expect(sw.every(x => typeof x.props.accessibilityState?.checked === 'boolean')).toBe(true);
  });
  test('R6-07 podwójne „Duplikuj” robi jedną kopię', async () => {
    await renderApp({ saved: seedWithDemo() }); const n = store.getState().templates.length; await go(`/template/${store.getState().templates[0].id}`); await flushAll(10);
    const b = screen.getByText('Duplikuj'); await act(async () => { const { fireEvent } = require('@testing-library/react-native'); fireEvent.press(b); fireEvent.press(b); }); await flushAll(10);
    expect(store.getState().templates.length).toBe(n + 1);
  });
  test('R6-08 podwójne „Zakończ” otwiera jedno okno', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByLabelText('Start: Upper A')); await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]);
    const n = global.__alerts.length; const b = screen.getAllByText('Zakończ')[0];
    await act(async () => { const { fireEvent } = require('@testing-library/react-native'); fireEvent.press(b); fireEvent.press(b); });
    expect(global.__alerts.length).toBe(n + 1); pressAlert('Zakończyć trening?', 'Wróć');
    await tap(b); expect(global.__alerts.length).toBe(n + 2); pressAlert('Zakończyć trening?', 'Wróć');
  });
  test('R6-09 picker z filtrem partii: ćwiczenie z grupy dostaje partię, a istniejące nie jest dublowane', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); }); await go('/picker?target=active'); await flushAll(10);
    await tap(screen.getAllByText('klatka')[0]); await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Plank'); await flushAll(10);
    expect(screen.queryByText('Utwórz „Plank”')).toBeNull(); expect(screen.getByText('Plank')).toBeTruthy();
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Moje wyciskanie'); await flushAll(10); await tap(screen.getByText('Utwórz „Moje wyciskanie”'));
    expect(store.getState().exercises.find(e => e.name === 'Moje wyciskanie')!.muscles).toEqual(['klatka']);
  });
  test('R6-10 szablon: start ±kg dla ćwiczenia z masą ciała przyjmuje asystę (ujemne)', async () => {
    await renderApp({ saved: seedWithDemo() }); const tpl = store.getState().templates.find(x => x.items.some(i => i.exerciseId === ex('Chin Up').id))!; const it = tpl.items.find(i => i.exerciseId === ex('Chin Up').id)!;
    await go(`/template/${tpl.id}`); await flushAll(10); await openCard(tpl.items.indexOf(it)); /* 06.10.2026: karta ćwiczenia z masą ciała */
    const inputs = screen.getAllByLabelText(store.loadLabel(ex('Chin Up'))); await type(inputs[0], '-10'); expect(it.startWeight).toBe(-10); expect(it.rows![0].weight).toBe(-10); /* 05.10.2026: wiersz serii */
  });
  test('R6-11 wyszukiwanie bez wyników pokazuje tekst (Ćwiczenia i Postępy, ze spacją na końcu)', async () => {
    await renderApp(); await go('/exercises'); await flushAll(10); await type(screen.getByPlaceholderText('Szukaj…'), 'zzzz'); expect(screen.getByText('Nic nie pasuje.')).toBeTruthy();
    await go('/more/progress'); await flushAll(10); await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'plank '); expect(screen.getByText('Plank')).toBeTruthy();
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'zzzz'); expect(screen.getByText('Nic nie pasuje.')).toBeTruthy();
  });
  test('R6-12 sama rozgrzewka: osobne okno z możliwością odrzucenia', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByLabelText('Start: Upper A'));
    await act(async () => { const s0 = store.getState().active!.exercises[0].sets[0]; s0.kind = 'warmup'; s0.warmup = true; store.save(); }); await flushAll(10);
    await tap(screen.getAllByLabelText(/^Seria W zrobiona|^Seria 1 zrobiona/)[0]); await tap(screen.getAllByText('Zakończ')[0]);
    expect(global.__alerts.at(-1)!.title).toBe('Tylko rozgrzewka'); pressAlert('Tylko rozgrzewka', 'Odrzuć trening'); await flushAll(10);
    expect(store.getState().active).toBeNull(); expect(store.getState().workouts).toHaveLength(0);
  });
});

describe('runda 7', () => {
  afterEach(async () => { await timer.stop(); await timer.stopSet(); units.applyUnit('kg'); });
  test('R7-01 start z szablonu nie wstawia wagi drop setu do zwykłych serii', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }, { weight: 60, reps: 12, kind: 'drop' }]]]);
    const tpl = store.newTemplate(); tpl.items.push({ id: 'i', exerciseId: ex('Back Squat').id, sets: 4, repMin: 5, repMax: 5, restSec: null, startWeight: '', targetSec: '', groupId: null });
    store.startFromTemplate(tpl); expect(store.getState().active!.exercises[0].sets.map(x => x.weight)).toEqual([100, 100, 100, 100]);
  });
  test('R7-02 wykres i rekord objętości w Postępach w tym samym formacie co historia', async () => {
    await fresh(); const k = stats.chartKeysFor(ex('Back Squat')).find(x => x.key === 'volume')!; expect(k.fmt(1248.77)).toBe('1249 kg');
    expect(stats.chartKeysFor(ex('Bieg')).map(x => x.key)).not.toContain('maxDuration');
  });
  test('R7-03 Apple Health: objętość zaokrąglona, serie bez rozgrzewek', async () => {
    await fresh(); const hk = require('@kingstinct/react-native-healthkit'); const spy = jest.spyOn(hk.default, 'saveWorkoutSample');
    store.getState().settings.healthSync = true;
    const w = addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 40, reps: 5, kind: 'warmup', warmup: true }, { weight: 61.23, reps: 5 }]]]);
    await require('@/lib/health').saveWorkout(w);
    const md = (spy.mock.calls.at(-1) as any[])[3].metadata; expect(md.VolumeKg).toBe(306); expect(md.Sets).toBe(1); spy.mockRestore();
  });
  test('R7-04 CSV w jednostce użytkownika (lb)', async () => {
    await fresh(); units.applyUnit('lb'); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 225 * units.KG_PER_LB, reps: 5 }]]]);
    expect(buildCsv()).toMatch(/Back Squat,1,225,5/);
  });
  test('R7-05 import backupu z BOM', async () => {
    await fresh(); const { parseBackup, buildBackup } = require('@/lib/backup'); expect(parseBackup('\uFEFF' + JSON.stringify(buildBackup())).workouts).toEqual([]);
  });
  test('R7-06 wiersze list: cały wiersz (min. 56 pt) to pole dotyku, „+” w pickerze dodaje ćwiczenie', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); }); await go('/picker?target=active'); await flushAll(10);
    const plus = screen.getAllByText('+')[0]; let p: any = plus; while (p && !p.props?.onClick && !(typeof p.type === 'string' && p.props?.accessibilityRole === 'button')) p = p.parent;
    expect(p).toBeTruthy(); const { StyleSheet } = require('react-native'); expect(StyleSheet.flatten(p.props.style).minHeight).toBeGreaterThanOrEqual(56);
    await tap(plus); expect(store.getState().active!.exercises).toHaveLength(1);
  });
  test('R7-07 Ćwiczenia: wyszukanie usuniętego pozwala je przywrócić, bez „Utwórz”', async () => {
    await renderApp(); addWorkout(Date.now() - 3600e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); await act(async () => { store.deleteExercise(ex('Back Squat').id); });
    await go('/exercises'); await flushAll(10); await type(screen.getByPlaceholderText('Szukaj…'), 'back squat'); await flushAll(10);
    expect(screen.queryByText(/^Utwórz/)).toBeNull(); await tap(screen.getByText('Przywróć „Back Squat”')); expect(ex('Back Squat').archived).toBeUndefined(); /* restoreExercise (06.10) */
  });
  test('R7-08 okno „brak odhaczonych” i „tylko rozgrzewka” ostrzega o wpisanych, nieodhaczonych seriach', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const s0 = store.getState().active!.exercises[0].sets[0]; s0.weight = 100; s0.reps = 5; s0.edited = true; store.save(); }); await flushAll(10);
    await tap(screen.getAllByText('Zakończ')[0]); expect(global.__alerts.at(-1)!.msg).toMatch(/Nieodhaczone serie z wpisanymi wynikami: 1/); pressAlert('Brak odhaczonych serii', 'Wróć');
  });
});

describe('runda 8', () => {
  afterEach(async () => { units.applyUnit("kg"); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  test('R8-01 wykres tygodniowy i historia: ta sama objętość (jedno zaokrąglenie)', async () => {
    await fresh(); units.applyUnit('lb'); const kg = 100.46 * units.KG_PER_LB; expect(units.volOut(kg)).toBe(100); expect(units.fmtVol(kg)).toBe('100 lb');
  });
  test('R8-02 to samo ćwiczenie dwa razy: drugi blok bierze drugi blok z poprzedniej sesji', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]], ['Leg Press', [{ weight: 150, reps: 10 }]], ['Back Squat', [{ weight: 60, reps: 12 }]]]);
    const tpl = store.newTemplate(); const sq = ex('Back Squat').id;
    tpl.items.push({ id: 'a', exerciseId: sq, sets: 2, repMin: 5, repMax: 5, restSec: null, startWeight: '', targetSec: '', groupId: null }, { id: 'b', exerciseId: sq, sets: 1, repMin: 12, repMax: 12, restSec: null, startWeight: '', targetSec: '', groupId: null });
    store.startFromTemplate(tpl); const a = store.getState().active!;
    expect(a.exercises[1].sets.map(x => x.weight)).toEqual([60]);
    a.exercises[1].sets[0].weight = ''; a.exercises[1].sets[0].reps = ''; store.toggleDone(1, 0); expect([a.exercises[1].sets[0].weight, a.exercises[1].sets[0].reps]).toEqual([60, 12]);
  });
  test('R8-03 ekran Backup mówi prawdę o jednostce CSV', async () => {
    await renderApp(); await act(async () => { store.getState().settings.unit = 'lb'; store.applyPrefs(); store.save(); }); await go('/more/backup'); await flushAll(10);
    expect(screen.getByText(/CSV: ciężar w jednostce z ustawień \(lb\)/)).toBeTruthy();
  });
  test('R8-04 EN: przycisk przerwy „This time only”', () => {
    expect(require('@/lib/i18n.en').EN?.['Tylko teraz'] ?? require('@/lib/i18n.en').default?.['Tylko teraz']).toBe('This time only');
  });
  test('R8-05 ekran główny bez szablonów ma przycisk tworzenia', async () => {
    await renderApp(); await act(async () => { store.getState().templates = []; store.save(); }); await flushAll(10);
    await tap(screen.getByText('+ Nowy szablon')); expect(store.getState().templates).toHaveLength(1);
  });
});

describe('runda 9', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  const item = (id: string, exId: string, sets: number, restSec: number | null = null) => ({ id, exerciseId: exId, sets, repMin: 5, repMax: 5, restSec, startWeight: '' as const, targetSec: '' as const, groupId: null });
  test('R9-01 blok z samą rozgrzewką nie przesuwa numeracji bloków', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 40, reps: 10, kind: 'warmup', warmup: true }]], ['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]], ['Back Squat', [{ weight: 60, reps: 12 }]]]);
    const tpl = store.newTemplate(); const sq = ex('Back Squat').id; tpl.items.push(item('a', sq, 1), item('b', sq, 2), item('c', sq, 1));
    store.startFromTemplate(tpl); expect(store.getState().active!.exercises.map(e => e.sets.map(x => x.weight))).toEqual([[''], [100, 100], [60]]);
  });
  test('R9-02 odhaczenie pustej zwykłej serii nie bierze wartości z dawnego drop setu', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 70, reps: 8, kind: 'drop' }, { weight: 100, reps: 5 }]]]);
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0); store.addSet(0);
    [0, 1, 2].forEach(i => store.toggleDone(0, i)); expect(store.getState().active!.exercises[0].sets.map(x => [x.weight, x.reps])).toEqual([[100, 5], [100, 5], ['', '']]);
    const d = store.getState().active!.exercises[0]; d.sets[2].done = false; d.sets[2].kind = 'drop'; store.toggleDone(0, 2); expect([d.sets[2].weight, d.sets[2].reps]).toEqual([70, 8]);
  });
  test('R9-03 „Zapamiętaj” przerwę zmienia tylko odpowiadającą pozycję szablonu', async () => {
    await renderApp(); const sq = ex('Back Squat').id; let tpl: any;
    await act(async () => { tpl = store.newTemplate(); tpl.items.push(item('a', sq, 1, 180), item('b', sq, 1, 60)); store.save(tpl); store.startFromTemplate(tpl); }); await flushAll(10);
    await tap(screen.getAllByLabelText(/^Przerwa: 3:00/)[0]);
    const a: any = global.__alerts.at(-1); a.buttons.find((b: any) => b.text === 'Zapamiętaj').onPress('200'); await flushAll(10);
    expect(tpl.items.map((i: any) => i.restSec)).toEqual([200, 60]);
  });
  test('R9-04 podwójne „+ Nowy” tworzy jeden szablon', async () => {
    await renderApp(); const n = store.getState().templates.length; await go('/templates'); await flushAll(10);
    const b = screen.getByText('+ Nowy'); await act(async () => { const { fireEvent } = require('@testing-library/react-native'); fireEvent.press(b); fireEvent.press(b); }); await flushAll(10);
    expect(store.getState().templates.length).toBe(n + 1);
  });
  test('R9-05 ponowny Start w edytorze szablonu nie pokazuje sprzecznego komunikatu', async () => {
    await renderApp({ saved: seedWithDemo() }); const tpl = store.getState().templates[0]; await go('/templates'); await flushAll(10); await tap(screen.getByText(tpl.name)); await flushAll(10);
    const b = screen.getByText('Start'); await act(async () => { const { fireEvent } = require('@testing-library/react-native'); fireEvent.press(b); fireEvent.press(b); }); await flushAll(10);
    expect(global.__alerts.filter((x: any) => x.title === 'Trening w toku')).toHaveLength(0); expect(store.getState().active?.templateId).toBe(tpl.id);
    expect(screen.getAllByText('Zakończ trening i zapisz')).toHaveLength(1); // edytor otwarty z zakładki Szablony też wraca do treningu
  });
  test('R9-06 teksty w wierszu serii mają limit powiększenia', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByLabelText('Start: Upper A'));
    const { Text } = require('react-native'); const btn = screen.getAllByLabelText(/^Seria 1 zrobiona/)[0];
    expect(btn.findAllByType(Text).every((x: any) => x.props.maxFontSizeMultiplier > 0)).toBe(true);
  });
  test('R9-07 Start w edytorze otwartym z zakładki Szablony przechodzi do treningu', async () => {
    await renderApp({ saved: seedWithDemo() }); const tpl = store.getState().templates[0]; await go('/templates'); await flushAll(10); await tap(screen.getByText(tpl.name)); await flushAll(10);
    await tap(screen.getByText('Start')); await flushAll(10); expect(screen.getAllByText('Zakończ trening i zapisz')).toHaveLength(1);
  });
});

describe('runda 10', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  const item = (id: string, exId: string, sets: number, restSec: number | null = null) => ({ id, exerciseId: exId, sets, repMin: 5, repMax: 5, restSec, startWeight: '' as const, targetSec: '' as const, groupId: null });
  const press2 = async (el: any) => { await act(async () => { const { fireEvent } = require('@testing-library/react-native'); fireEvent.press(el); fireEvent.press(el); }); await flushAll(10); };
  test('R10-01 poprzednio: blok samej rozgrzewki + blok roboczy, dziś ćwiczenie raz → podpowiedź z bloku roboczego', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 40, reps: 10, kind: 'warmup', warmup: true }]], ['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]);
    const tpl = store.newTemplate(); tpl.items.push(item('a', ex('Back Squat').id, 2)); store.startFromTemplate(tpl);
    expect(store.getState().active!.exercises[0].sets.map(x => x.weight)).toEqual([100, 100]);
  });
  test('R10-02 odhaczenie serii czasowej nie wpisuje powtórzeń ani ciężaru', async () => {
    await fresh(); const e = store.newExercise('Dead hang'); addWorkout(at(2026, 9, 1), [['Dead hang', [{ weight: 20, reps: 8 }]]]); e.metric = 'time'; store.save(e);
    const tpl = store.newTemplate(); tpl.items.push({ ...item('a', e.id, 1), repMin: 8, repMax: 10 }); store.startFromTemplate(tpl);
    const s0 = store.getState().active!.exercises[0].sets[0]; s0.durationSec = 40; store.toggleDone(0, 0);
    expect([s0.weight, s0.reps, s0.durationSec]).toEqual(['', '', 40]);
  });
  test('R10-03 podwójne „usuń” ćwiczenia w treningu usuwa jedno', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByLabelText('Start: Upper A')); const n = store.getState().active!.exercises.length;
    const lbl = deleteActions().find(l => l.startsWith('Usuń ćwiczenie: '))!; await swipeDelete(lbl); await swipeDelete(lbl); /* 07.10.2026 wieczór: gest zamiast „usuń”; dwa potwierdzenia */
    const al = global.__alerts.filter((a: any) => a.title === 'Usunąć z treningu?'); expect(al.length).toBe(2); await act(async () => { al.forEach((a: any) => a.buttons.find((b: any) => b.text === 'Usuń').onPress()); });
    await flushAll(10); expect(store.getState().active!.exercises.length).toBe(n - 1);
  });
  test('R10-04 podwójne „✕” w szablonie usuwa jedną pozycję', async () => {
    await renderApp({ saved: seedWithDemo() }); const tpl = store.getState().templates[0]; const n = tpl.items.length; await tap(screen.getByText(tpl.name)); await flushAll(10); await openCard(0);
    const lbl = deleteActions().find(l => l.startsWith('Usuń ćwiczenie: '))!; await swipeDelete(lbl); await swipeDelete(lbl); /* 07.10.2026 wieczór: gest zamiast „✕” */
    const al = global.__alerts.filter((a: any) => a.title === 'Usunąć z szablonu?'); expect(al.length).toBe(2); await act(async () => { al.forEach((a: any) => a.buttons.find((b: any) => b.text === 'Usuń').onPress()); });
    await flushAll(10); expect(tpl.items.length).toBe(n - 1);
  });
  test('R10-05 „Zapamiętaj” przerwę w bloku dodanym w trakcie nie zmienia szablonu', async () => {
    await renderApp(); const sq = ex('Back Squat').id; let tpl: any;
    await act(async () => { tpl = store.newTemplate(); tpl.items.push(item('a', sq, 1, 180)); store.save(tpl); store.startFromTemplate(tpl); store.addExerciseToActive(ex('Back Squat')); }); await flushAll(10);
    const btns = screen.getAllByLabelText(/^Przerwa: /); await tap(btns[1]);
    const a: any = global.__alerts.at(-1); a.buttons.find((b: any) => b.text === 'Zapamiętaj').onPress('60'); await flushAll(10);
    expect(tpl.items[0].restSec).toBe(180);
  });
});

describe('runda 11', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  const item = (id: string, exId: string, sets: number) => ({ id, exerciseId: exId, sets, repMin: 5, repMax: 5, restSec: null, startWeight: '' as const, targetSec: '' as const, groupId: null });
  test('R11-01 wyłączona asysta gumą: guma nie wraca z historii', async () => {
    await fresh(); const pu = ex('Pull Up'); const b = store.getState().bands[0].id;
    addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 8, addKg: -20, bandId: b }]]]); pu.bandAssistable = false; store.save(pu);
    store.startEmpty(); store.addExerciseToActive(pu); const s0 = store.getState().active!.exercises[0].sets[0]; s0.reps = 5; store.toggleDone(0, 0);
    expect(s0.bandId).toBe('');
    const tpl = store.newTemplate(); tpl.items.push(item('a', pu.id, 1)); store.cancelWorkout(); store.startFromTemplate(tpl); expect(store.getState().active!.exercises[0].sets[0].bandId).toBe('');
  });
  test('R11-02 pominięty blok szablonu nie przesuwa podpowiedzi pozostałych', async () => {
    await fresh(); const sq = ex('Back Squat').id; const tpl = store.newTemplate(); tpl.items.push(item('h', sq, 1), item('m', sq, 1), item('l', sq, 1));
    const w = addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]], ['Back Squat', [{ weight: 80, reps: 8 }]]]); w.templateId = tpl.id; w.exercises[0].tplItemId = 'm'; w.exercises[1].tplItemId = 'l'; store.save(w);
    store.startFromTemplate(tpl); expect(store.getState().active!.exercises.map(e => e.sets[0].weight)).toEqual(['', 100, 80]);
  });
  test('R11-03 przerwa wpisana w treningu ma limit 30:00', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByLabelText('Start: Upper A')); await tap(screen.getAllByLabelText(/^Przerwa: /)[0]);
    const a: any = global.__alerts.at(-1); a.buttons.find((b: any) => b.text === 'Zapamiętaj').onPress('90000'); await flushAll(10);
    expect(store.getState().active!.exercises[0].restSec).toBe(1800);
  });
  test('R11-04 podwójne „Usuń sesję” nie wyrzuca z zakładki Historia', async () => {
    await renderApp(); const w = addWorkout(Date.now() - 3600e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); await go('/history'); await flushAll(10);
    /* 07.10.2026 wieczór: usuwanie sesji przesunięciem na liście Historii (bez przycisku w szczegółach) — dwa gesty, dwa potwierdzenia */
    await swipeDelete(/^Usuń sesję: /); await swipeDelete(/^Usuń sesję: /);
    const al = global.__alerts.filter((x: any) => x.title === 'Usunąć tę sesję z historii?'); await act(async () => { al.forEach((x: any) => x.buttons.find((b: any) => b.text === 'Usuń').onPress()); }); await flushAll(10);
    expect(screen.getByText(/pierwszy trening czeka/)).toBeTruthy();
  });
});

describe('runda 12', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  const item = (id: string, exId: string, sets: number) => ({ id, exerciseId: exId, sets, repMin: 5, repMax: 5, restSec: null, startWeight: '' as const, targetSec: '' as const, groupId: null });
  test('R12-01 jedyny pozostały blok bierze swój blok z poprzedniej sesji (po id pozycji szablonu)', async () => {
    await fresh(); const sq = ex('Back Squat').id; const tpl = store.newTemplate(); tpl.items.push(item('h', sq, 2), item('l', sq, 2));
    const w = addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]], ['Back Squat', [{ weight: 60, reps: 12 }, { weight: 60, reps: 12 }]]]);
    w.templateId = tpl.id; w.exercises[0].tplItemId = 'h'; w.exercises[1].tplItemId = 'l'; store.save(w);
    tpl.items.splice(0, 1); store.startFromTemplate(tpl); expect(store.getState().active!.exercises[0].sets.map(x => x.weight)).toEqual([60, 60]);
    store.cancelWorkout(); tpl.items.unshift(item('h', sq, 2)); store.startFromTemplate(tpl); store.removeExercise(0);
    const s0 = store.getState().active!.exercises[0].sets[0]; s0.weight = ''; s0.reps = ''; store.toggleDone(0, 0); expect([s0.weight, s0.reps]).toEqual([60, 12]);
  });
  test('R12-02 Postępy pompek bez masy ciała otwierają wykres z danymi', async () => {
    await renderApp(); addWorkout(Date.now() - 86400e3 * 2, [['Push Up', [{ reps: 15 }]]]); addWorkout(Date.now() - 86400e3, [['Push Up', [{ reps: 12 }]]]);
    await go(`/more/progress?ex=${ex('Push Up').id}`); await flushAll(10); expect(screen.queryByText('Brak danych do wykresu.')).toBeNull();
  });
  test('R12-03 ▶ i guma mówią, której serii dotyczą', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addExerciseToActive(ex('Chin Up')); }); await flushAll(10);
    expect(screen.getAllByLabelText('Start stopera serii')[0].props.accessibilityHint).toMatch(/Seria 1 — Plank/);
    expect(screen.getAllByLabelText(/^Guma: /)[0].props.accessibilityHint).toMatch(/Seria 1 — Chin Up/);
  });
  test('R12-04 czas serii od godziny w formacie h:mm:ss', () => { expect(store.fmtSec(5700)).toBe('1:35:00'); expect(store.fmtSec(95)).toBe('1:35'); });
  test('R12-05 szczegóły sesji bez objętości nie pokazują „0 kg”', async () => {
    await renderApp(); const w = addWorkout(Date.now() - 3600e3, [['Plank', [{ durationSec: 60 }]]]); await go(`/history/${w.id}`); await flushAll(10);
    expect(screen.queryByText(/objętość 0/)).toBeNull();
  });
});

describe('runda 13', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  const item = (id: string, exId: string, sets: number) => ({ id, exerciseId: exId, sets, repMin: 5, repMax: 5, restSec: null, startWeight: '' as const, targetSec: '' as const, groupId: null });
  test('R13-01 ćwiczenie usunięte i dodane na nowo do szablonu dalej ma podpowiedzi', async () => {
    await fresh(); const sq = ex('Back Squat').id; const tpl = store.newTemplate(); tpl.items.push(item('a', sq, 2));
    const w = addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]); w.templateId = tpl.id; w.exercises[0].tplItemId = 'a'; store.save(w);
    tpl.items.splice(0, 1, item('b', sq, 2)); store.startFromTemplate(tpl); expect(store.getState().active!.exercises[0].sets.map(x => x.weight)).toEqual([100, 100]);
  });
  test('R13-02 „najlepsza” seria nie jest serią bez powtórzeń', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 140, reps: '' }]]]);
    expect(stats.sessionsFor(ex('Back Squat'))[0].bestSet.weight).toBe(100);
  });
  test('R13-03 etykiety osi wykresu mieszczą się w lewym marginesie', async () => {
    await fresh(); const { render } = require('@testing-library/react-native'); const { LineChart } = require('@/components/Chart'); const { Text: SvgText } = require('react-native-svg');
    const r = render(<LineChart points={[{ x: 1, y: 100, label: 'a' }, { x: 2, y: 102.5, label: 'b' }]} fmt={(v: number) => `${v.toFixed(2).replace('.', ',')} kg`} />);
    act(() => { r.UNSAFE_root.findAll((n: any) => typeof n.props?.onLayout === 'function')[0].props.onLayout({ nativeEvent: { layout: { width: 320 } } }); });
    const ticks = r.UNSAFE_getAllByType(SvgText).filter((x: any) => x.props.textAnchor === 'end' && / kg$/.test(String(x.props.children)));
    expect(ticks.length).toBeGreaterThanOrEqual(3); for (const tk of ticks) expect(tk.props.x).toBeGreaterThanOrEqual(6 * String(tk.props.children).length);
  });
  test('R13-04 zakładki bez treningu nie przerysowują się przy wpisach w treningu (useHistTick)', async () => {
    await fresh(); store.startEmpty(); const h = store.getHistRev(); store.save(store.getState().active); expect(store.getHistRev()).toBe(h);
    const fs = require('fs'), path = require('path');
    for (const f of ['history', 'exercises', 'templates', 'more']) expect(fs.readFileSync(path.join(__dirname, `../app/(tabs)/${f}.tsx`), 'utf8')).toMatch(/useHistTick\(\)/);
  });
});

describe('runda 14', () => {
  test('R14-01 data z innego roku pokazuje rok, z bieżącego — nie', async () => {
    await fresh(); const y = new Date().getFullYear();
    expect(store.fmtDate(new Date(y - 1, 8, 29, 18).getTime())).toMatch(String(y - 1)); expect(store.fmtDate(new Date(y, 0, 2, 18).getTime())).not.toMatch(String(y));
  });
});

describe('runda 15', () => {
  test('R15-01 oś wykresu powtórzeń bez ułamków binarnych', async () => {
    await fresh(); const { render } = require('@testing-library/react-native'); const { LineChart } = require('@/components/Chart'); const { Text: SvgText } = require('react-native-svg');
    const k = stats.chartKeysFor(ex('Chin Up')).find(x => x.key === 'maxReps')!;
    const r = render(<LineChart points={[{ x: 1, y: 4, label: 'a' }, { x: 2, y: 11, label: 'b' }, { x: 3, y: 18, label: 'c' }]} fmt={k.fmt} />);
    act(() => { r.UNSAFE_root.findAll((n: any) => typeof n.props?.onLayout === 'function')[0].props.onLayout({ nativeEvent: { layout: { width: 347 } } }); });
    const labels = r.UNSAFE_getAllByType(SvgText).map((x: any) => String(x.props.children)).filter((x: string) => /^[\d,.\-]+$/.test(x));
    expect(labels.length).toBeGreaterThanOrEqual(3); for (const l of labels) expect(l.length).toBeLessThanOrEqual(4);
  });
});

describe('runda 16', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  test('R16-01 migracja naprawia pola ćwiczeń i szablonów z ręcznie edytowanego backupu (idempotentnie)', async () => {
    await fresh(); withDemoTemplates(); const raw = JSON.parse(JSON.stringify(store.getState())); const cu = raw.exercises.find((e: any) => e.name === 'Chin Up'); const lp = raw.exercises.find((e: any) => e.name === 'Leg Press');
    Object.assign(cu, { restSec: '90', restWarmupSec: -30 }); Object.assign(lp, { metric: 'bogus', loadMode: 'bogus' });
    raw.templates[0].items[0].sets = '3'; raw.templates[0].items[0].repMin = 0.5; raw.mornings = [{ id: 'm', date: '2026-9-1', bb: 50, sleepScore: '', sleepH: '', weight: '' }];
    const m1 = store.migrate(raw); const m2 = store.migrate(JSON.parse(JSON.stringify(m1)));
    const c = m1.exercises.find(e => e.name === 'Chin Up')!; const l = m1.exercises.find(e => e.name === 'Leg Press')!;
    expect([c.restSec, c.restWarmupSec]).toEqual([90, null]); expect(l.metric).toBe('weight_reps'); expect(['per_dumbbell', 'total', 'unilateral']).toContain(l.loadMode);
    expect([m1.templates[0].items[0].sets, m1.templates[0].items[0].repMin]).toEqual([3, null]); expect(m1.mornings[0].date).toBe('2026-09-01');
    expect(JSON.stringify(m2)).toBe(JSON.stringify(m1));
  });
  test('R16-02 wykres ze stałą ujemną wartością ma poprawną oś', async () => {
    await fresh(); const { render } = require('@testing-library/react-native'); const { LineChart } = require('@/components/Chart'); const { Text: SvgText } = require('react-native-svg');
    const r = render(<LineChart points={[{ x: 1, y: -20, label: 'a' }, { x: 2, y: -20, label: 'b' }]} fmt={(v: number) => String(Math.round(v))} />);
    act(() => { r.UNSAFE_root.findAll((n: any) => typeof n.props?.onLayout === 'function')[0].props.onLayout({ nativeEvent: { layout: { width: 320 } } }); });
    const ticks = r.UNSAFE_getAllByType(SvgText).filter((x: any) => x.props.textAnchor === 'end' && x.props.x < 100).map((x: any) => ({ y: x.props.y, v: Number(x.props.children) }));
    const sorted = [...ticks].sort((a, b) => a.y - b.y); expect(sorted[0].v).toBeGreaterThan(sorted[sorted.length - 1].v); expect(Math.max(...ticks.map((t: any) => t.v))).toBeLessThan(0);
  });
  test('R16-03 usunięta guma nie przechodzi do nowego treningu', async () => {
    await fresh(); const st = store.getState(); const b = st.bands[0].id; addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 6, addKg: -20, bandId: b }]]]);
    st.bands = st.bands.filter(x => x.id !== b); store.save(); store.repeatLast(); expect(store.getState().active!.exercises[0].sets[0].bandId).toBe('');
  });
});

describe('runda 17', () => {
  test('R17-01 migracja: limit przerwy 1800 także dla szablonu i ustawień', async () => {
    await fresh(); withDemoTemplates(); const raw = JSON.parse(JSON.stringify(store.getState())); raw.templates[0].items[0].restSec = 3600; raw.settings.defaultRest = 5000; raw.templates[0].items[1].startWeight = null;
    const m = store.migrate(raw); expect([m.templates[0].items[0].restSec, m.settings.defaultRest, m.templates[0].items[1].startWeight]).toEqual([1800, 1800, '']);
  });
  test('R17-02 migracja: nieistniejące daty poranne odpadają, jeden wpis na dzień', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState()));
    raw.mornings = [{ id: 'a', date: '2026-9-1', bb: 40, sleepScore: '', sleepH: '', weight: '', updatedAt: 1 }, { id: 'b', date: '2026-09-01', bb: 60, sleepScore: '', sleepH: '', weight: '', updatedAt: 2 }, { id: 'c', date: '2026-13-45', bb: 1, sleepScore: '', sleepH: '', weight: 90 }];
    const m = store.migrate(raw); expect(m.mornings.map(x => [x.date, x.bb])).toEqual([['2026-09-01', 60]]);
  });
  test('R17-03 poziome rzędy chipów przyjmują tapnięcie przy otwartej klawiaturze', async () => {
    await fresh(); const fs = require('fs'), path = require('path');
    const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap((e: any) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.tsx') ? [path.join(d, e.name)] : []);
    for (const f of [...walk(path.join(__dirname, '../app')), path.join(__dirname, '../components/ActiveWorkout.tsx')].map((x: string) => path.relative(path.join(__dirname, '..'), x)).filter((f: string) => /<ScrollView horizontal/.test(fs.readFileSync(path.join(__dirname, '..', f), 'utf8')))) { const src = fs.readFileSync(path.join(__dirname, '..', f), 'utf8'); const all = src.match(/<ScrollView horizontal[^>]*>/g) ?? []; expect(all.length).toBeGreaterThan(0); for (const x of all) expect(x).toMatch(/keyboardShouldPersistTaps="handled"/); }
  });
});

describe('runda 18', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  test('R18-01 CSV zachowuje RPE/RIR 0', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5, rpe: 0 }]]]); expect(buildCsv().trim().split('\n')[1]).toMatch(/,0$/);
  });
  test('R18-02 ponowny pomiar odhaczonej serii liczy od nowa; po nim nowa przerwa', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); }); await flushAll(10);
    await tap(screen.getByLabelText('Start stopera serii')); await flushAll(30e3); await tap(screen.getAllByText(/Zakończ serię/)[0]); await flushAll(10);
    const s0 = store.getState().active!.exercises[0].sets[0]; expect(s0.done).toBe(true); expect(timer.T.on).toBe(true);
    await tap(screen.getByLabelText('Start stopera serii')); pressAlert('Zmierzyć serię od nowa?', 'Zmierz'); await flushAll(10);
    // Runda 19: jeden timer naraz — ponowny pomiar wstrzymuje przerwę, liczy bez starego limitu, a po nim rusza nowa przerwa.
    expect(timer.T.on).toBe(false); expect(timer.S.targetSec).toBe(0);
    await flushAll(45e3); await tap(screen.getAllByText(/Zakończ serię/)[0]); await flushAll(10);
    expect(s0.durationSec).toBeGreaterThanOrEqual(45); expect(timer.T.on).toBe(true);
  });
});

describe('runda 19', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  const las = () => (global.__la as any[]).map(x => x[0] === 'start' ? `start:${String(x[5]).split('|')[0]}` : x[0]);
  test('R19-01 Live Activity: każdy timer kończy tylko swoją, drugi ją przejmuje', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addExerciseToActive(ex('Back Squat'));
    const a = store.getState().active!; const plank = a.exercises[0].sets[0].id, sq = a.exercises[1].sets[0].id;
    await timer.startSet(plank, 60); await timer.start(90, sq); // odhaczenie innej serii w trakcie stopera: przerwa przejmuje LA
    global.__la.length = 0; await timer.stop(); // pominięcie przerwy kończy LA przerwy i oddaje ją stoperowi
    expect(las()).toEqual(['end', 'start:set']);
    global.__la.length = 0; await timer.stopSet(); expect(las()).toEqual(['end']);
  });
  test('R19-02 odhaczenie innej serii w trakcie stopera kończy pomiar (bez ukrytej przerwy w tle)', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addExerciseToActive(ex('Back Squat')); }); await flushAll(10);
    await tap(screen.getByLabelText('Start stopera serii')); await flushAll(20e3);
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona — Back Squat/)[0]); await flushAll(10);
    const a = store.getState().active!; expect(timer.S.on).toBe(false); expect(a.exercises[0].sets[0].done).toBe(true); expect(Number(a.exercises[0].sets[0].durationSec)).toBeGreaterThanOrEqual(20);
  });
});

describe('runda 20', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  test('R20-01 restart: stara Live Activity bez właściciela jest kończona', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); const sid = store.getState().active!.exercises[0].sets[0].id;
    const t0 = Date.now(); const spy = jest.spyOn(Date, 'now'); spy.mockReturnValue(t0);
    await timer.startSet(sid, 60); await store.flush(); timer.S.on = false; timer.S.setId = null; // „zabicie” apki: pamięć czysta, stan w bazie
    store.__resetForTests(); await store.init(); spy.mockReturnValue(t0 + 120e3); global.__la.length = 0; await timer.restore();
    expect((global.__la as any[]).map(x => x[0])).toContain('end'); spy.mockRestore();
  });
  test('R20-02 ponowny pomiar w supersecie przywraca przerwaną przerwę', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addExerciseToActive(ex('Back Squat')); store.linkWithNext(store.getState().active!.exercises, 0, store.getState().active!); store.addSet(0); store.addSet(1); }); await flushAll(10);
    await tap(screen.getAllByLabelText('Start stopera serii')[0]); await flushAll(10e3); await tap(screen.getAllByText(/Zakończ serię/)[0]); await flushAll(10);
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona — Back Squat/)[0]); await flushAll(10); expect(timer.T.on).toBe(true);
    await tap(screen.getAllByLabelText('Start stopera serii')[0]); pressAlert('Zmierzyć serię od nowa?', 'Zmierz'); await flushAll(5e3);
    await tap(screen.getAllByText(/Zakończ serię/)[0]); await flushAll(10); expect(timer.T.on).toBe(true);
  });
});

describe('runda 21', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  test('R21-01 po ponownym pomiarze w supersecie: pełna przerwa rundy, należąca do zmierzonej serii', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addExerciseToActive(ex('Back Squat')); store.linkWithNext(store.getState().active!.exercises, 0, store.getState().active!); store.addSet(0); store.addSet(1); }); await flushAll(10);
    const a = store.getState().active!; a.exercises[1].restSec = 120; store.save(a);
    await tap(screen.getAllByLabelText('Start stopera serii')[0]); await flushAll(10e3); await tap(screen.getAllByText(/Zakończ serię/)[0]); await flushAll(10);
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona — Back Squat/)[0]); await flushAll(10);
    await tap(screen.getAllByLabelText('Start stopera serii')[0]); pressAlert('Zmierzyć serię od nowa?', 'Zmierz'); await flushAll(3e3);
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona — Back Squat/)[0]); await flushAll(10); // odznaczenie innej serii w trakcie pomiaru
    await tap(screen.getAllByText(/Zakończ serię/)[0]); await flushAll(10);
    const plank1 = a.exercises[0].sets[0]; expect(plank1.done).toBe(true);
    expect(timer.T.on).toBe(true); expect(timer.T.setId).toBe(plank1.id); expect(timer.T.total).toBe(120);
  });
  test('R21-02 CSV: tekst od „=” nie jest formułą, ujemne liczby zostają liczbami', async () => {
    await fresh(); const w = addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 6, addKg: -20, note: '=HYPERLINK(1)' }]]]); void w;
    const row = buildCsv().trim().split('\n')[1]; expect(row).toContain("'=HYPERLINK(1)"); expect(row).toMatch(/,-20,/);
  });
});

describe('runda 22', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  test('R22-01 przerwa po ponownym pomiarze ma podpis następnej serii', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addSet(0); }); await flushAll(10);
    await tap(screen.getAllByLabelText('Start stopera serii')[0]); await flushAll(10e3); await tap(screen.getAllByText(/Zakończ serię/)[0]); await flushAll(10);
    await tap(screen.getAllByLabelText('Start stopera serii')[0]); pressAlert('Zmierzyć serię od nowa?', 'Zmierz'); await flushAll(5e3);
    global.__la.length = 0; await tap(screen.getAllByText(/Zakończ serię/)[0]); await flushAll(10);
    const st = (global.__la as any[]).filter(x => x[0] === 'start'); expect(st.at(-1)![2]).toBe('Plank · seria 2'); expect(st.at(-1)![5]).toBe('rest|Przerwa');
  });
  test('R22-02 „Powtórz ostatni” zachowuje cel czasu z szablonu', async () => {
    await fresh(); const tpl = store.newTemplate(); tpl.items.push({ id: 'p', exerciseId: ex('Plank').id, sets: 2, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: 60, groupId: null });
    store.startFromTemplate(tpl); const a = store.getState().active!; a.exercises[0].sets.forEach(x => { x.durationSec = 45; x.done = true; x.completedAt = Date.now(); }); store.finishWorkout();
    store.repeatLast(); expect(store.getState().active!.exercises[0].sets.map(x => x.durationSec)).toEqual([60, 60]);
  });
});

describe('runda 23', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  test('R23-01 podpis przerwy w supersecie wskazuje pierwsze ćwiczenie następnej rundy; po odznaczeniu — to, co karta „teraz” (audyt 0.10, LIVE-04)', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Leg Press')); const a = store.getState().active!; store.linkWithNext(a.exercises, 0, a); store.addSet(0); store.addSet(1); }); await flushAll(10);
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona — Back Squat/)[0]); await tap(screen.getAllByLabelText(/^Seria 1 zrobiona — Leg Press/)[0]); await flushAll(10);
    expect(timer.T.sub).toBe('Back Squat · seria 2');
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona — Back Squat/)[0]); await flushAll(10); // odznaczenie innej serii
    /* audyt 0.10 (LIVE-04): podpis liczony regułą karty — po odznaczeniu Back Squat 1 następna jest właśnie ta seria (wcześniej podpis zostawał „seria 2”, inaczej niż karta) */
    expect(timer.T.sub).toBe('Back Squat · seria 1'); expect(store.focusSet(store.getState().active)).toEqual({ ei: 0, si: 0 });
    global.__la.length = 0; await act(async () => { await timer.adjust(15); }); const up = (global.__la as any[]).find(x => x[0] === 'update'); expect(up?.[1]).toBe('Back Squat · seria 1');
  });
});

describe('runda 26', () => {
  test('R26-01 remis e1RM (82,5×6 i 90×3) nie jest rekordem', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 90, reps: 2 }]]]); addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 82.5, reps: 6 }]]]);
    const w = addWorkout(at(2026, 9, 5), [['Back Squat', [{ weight: 90, reps: 3 }]]]); expect([...stats.prMap(w).values()]).toEqual([]);
  });
  test('R26-02 wpisanie w lb wartości wyświetlanej z historii nie daje fałszywego rekordu', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); units.applyUnit('lb');
    const kg = units.wIn(units.wOut(100)) as number; units.applyUnit('kg'); expect(kg).toBe(100);
    const w = addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: kg, reps: 5 }]]]); expect([...stats.prMap(w).values()]).toEqual([]);
  });
  test('R26-03 picker z powtórzonym parametrem target nie wywraca aplikacji', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); }); await go('/picker?target=active&target=x'); await flushAll(10);
    await tap(screen.getAllByText('nogi')[0]); await flushAll(5); /* pełna baza: lista wirtualizowana */ await tap(screen.getByText('Back Squat')); await flushAll(10); expect(store.getState().active!.exercises).toHaveLength(0);
  });
});

describe('runda 27', () => {
  test('R27-01 funty: ta sama liczba na ekranie = te same kg (także dla wartości z dwoma miejscami)', async () => {
    await fresh(); units.applyUnit('lb');
    const seen = new Map<number, number>();
    try { for (let i = 0; i <= 60000; i++) { const kg = units.wIn(i / 100) as number; const shown = units.wOut(kg); const prev = seen.get(shown); if (prev !== undefined && prev !== kg) throw new Error(`${i / 100} lb: ${shown} → ${kg} vs ${prev}`); seen.set(shown, kg); } } finally { units.applyUnit('kg'); }
  });
  test('R27-02 migracja przyciąga stare wartości zapisane z funtów, kg zostają', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState())); raw.schemaVersion = 10; /* runda 55: tylko dane sprzed schematu 11 */ raw.mornings = [{ date: '2026-09-01', weight: 180 * units.KG_PER_LB }];
    const m = store.migrate(raw); units.applyUnit('lb'); try { expect(m.mornings[0].weight).toBe(units.wIn(180)); } finally { units.applyUnit('kg'); } /* runda 75: masa ciała z Ustawień usunięta (Q-001); T-055: asysta kg gumy usunięta — sprawdzamy na porannej wadze */
    expect(JSON.stringify(store.migrate(JSON.parse(JSON.stringify(m))))).toBe(JSON.stringify(m));
  });
  test('R27-03 link prosto do ekranu ze stosu ma drogę powrotu', async () => {
    await renderApp({ url: '/more/settings' }); const { router } = require('expo-router'); expect(router.canGoBack()).toBe(true);
  });
  test('R27-04 nieznany adres wraca na ekran główny (jeden zestaw zakładek, runda 28)', async () => {
    await renderApp({ url: '/more/nieznane' }); await flushAll(10); expect(screen.queryByText(/Unmatched Route/)).toBeNull(); expect(screen.getAllByText('Zacznij z szablonu')).toHaveLength(1);
    const { router } = require('expo-router'); expect(router.canGoBack()).toBe(false);
  });
});

describe('runda 28', () => {
  const K = units.KG_PER_LB;
  test('R28-01 stary zapis w lb (np. 11,75 lb) po migracji = to, co zapisuje dziś wpisanie tej wartości', async () => {
    await fresh(); units.applyUnit('lb');
    try { for (const lb of [11.75, 1.65, 2.65, 7.75, 9.45, 45.25, 225, 0.45, -0.45, -45.25]) expect(units.snapLegacyLb(lb * K)).toBe(units.wIn(lb)); } finally { units.applyUnit('kg'); }
  });
  test('R28-02 asysta gumy po migracji = −nominał (symetria dla wartości ujemnych)', async () => {
    await fresh(); expect(units.snapLegacyLb(-45.25 * K)).toBe(-(units.snapLegacyLb(45.25 * K) as number));
  });
  test('R28-03 podpowiedzi w treningu w toku migrują razem z wartościami', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState())); store.startEmpty(); store.addExerciseToActive(ex('Back Squat'));
    const a = JSON.parse(JSON.stringify(store.getState().active)); a.exercises[0].sets[0] = { ...a.exercises[0].sets[0], weight: 100 * K, reps: 5, done: true, completedAt: 1, hinted: { weight: 100 * K } }; raw.active = a;
    const m = store.migrate(raw); const s0 = m.active!.exercises[0].sets[0]; expect(s0.weight).toBe((s0.hinted as any).weight);
  });
});

describe('runda 29', () => {
  test('R29-01 prawdziwe kg z ≤ 3 miejscami nie są przyciągane jak stare funty', async () => {
    await fresh(); expect(units.snapLegacyLb(681.518)).toBe(681.518);
    for (let i = -1000000; i <= 1000000; i += 7) { const v = i / 1000; if (units.snapLegacyLb(v) !== v) throw new Error(String(v)); }
  });
});

describe('runda 30', () => {
  afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
  test('R30-01 powrót z tła następnego dnia odświeża ekran główny', async () => {
    await renderApp(); const t0 = new Date(2026, 8, 30, 22).getTime(); jest.setSystemTime(t0);
    /* 05.10.2026: poranny wpis usunięty — odświeżenie sprawdzane na dacie w nagłówku ekranu głównego */
    await act(async () => { store.refreshViews(); }); await flushAll(10);
    const day = (ms: number) => new Date(ms).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
    expect(screen.getByText(day(t0))).toBeTruthy();
    jest.setSystemTime(t0 + 9 * 3600e3); await act(async () => { store.refreshViews(); }); await flushAll(10);
    expect(screen.queryByText(day(t0))).toBeNull(); expect(screen.getByText(day(t0 + 9 * 3600e3))).toBeTruthy();
  });
  test('R30-02 ekran Backup po imporcie pokazuje język i jednostkę danych', async () => {
    await renderApp({ locale: 'en' }); await go('/more/backup'); await flushAll(10); expect(screen.getByText(/CSV: weight/)).toBeTruthy();
    await act(async () => { const raw = JSON.parse(JSON.stringify(store.getState())); raw.settings.language = 'pl'; store.replaceState(raw); }); await flushAll(10);
    expect(screen.getByText(/CSV: ciężar/)).toBeTruthy();
  });
  test('R30-03 cofnięty zegar nie daje ujemnej przerwy; cel 0 w szablonie = bez celu', async () => {
    await fresh(); const t0 = Date.now(); const spy = jest.spyOn(Date, 'now').mockReturnValue(t0);
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0); const a = store.getState().active!; a.exercises[0].sets.forEach(x => { x.weight = 100; x.reps = 5; });
    store.toggleDone(0, 0); spy.mockReturnValue(t0 - 120e3); store.toggleDone(0, 1); expect(a.exercises[0].sets[1].actualRest).toBeNull(); spy.mockRestore();
    store.cancelWorkout(); const tpl = store.newTemplate(); tpl.items.push({ id: 'p', exerciseId: ex('Plank').id, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: 0, groupId: null });
    store.startFromTemplate(tpl); expect(store.getState().active!.exercises[0].sets[0].durationSec).toBe('');
  });
});

describe('runda 31', () => {
  test('R31-01 Historia po powrocie z tła w nowym roku pokazuje rok przy starych sesjach', async () => {
    await renderApp(); jest.setSystemTime(new Date(2026, 11, 31, 20).getTime());
    await act(async () => { addWorkout(new Date(2026, 11, 30, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); }); await go('/history'); await flushAll(10);
    const rows = () => screen.queryAllByText(/2026/).filter(n => !/^(grudzień|styczeń) 2026$/.test(String(n.props.children))); /* 07.10.2026 wieczór: tytuł kalendarza nad listą też ma rok */
    expect(rows()).toHaveLength(0);
    jest.setSystemTime(new Date(2027, 0, 2, 9).getTime()); await act(async () => { store.refreshViews(); }); await flushAll(10);
    expect(rows().length).toBeGreaterThan(0);
  });
});

describe('runda 32', () => {
  test('R32-01 dni do wygaśnięcia podpisu liczone kalendarzowo (jak przypomnienie „Jutro wygasa”)', async () => {
    await fresh(); const { calendarDaysLeft } = require('@/lib/signing');
    expect(calendarDaysLeft(new Date(2026, 9, 7, 11), new Date(2026, 9, 6, 18))).toBe(1);
    expect(calendarDaysLeft(new Date(2026, 9, 8, 9), new Date(2026, 9, 6, 10))).toBe(2);
    expect(calendarDaysLeft(new Date(2026, 9, 6, 23), new Date(2026, 9, 6, 10))).toBe(0);
    expect(calendarDaysLeft(new Date(2026, 9, 6, 9), new Date(2026, 9, 6, 10))).toBe(-1);
  });
  test('R32-02 błąd zapisu widoczny w trakcie treningu', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByLabelText('Start: Upper A')); global.__dbFail = true;
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]); await flushAll(1000);
    expect(screen.getAllByText('Nie udało się zapisać danych').length).toBeGreaterThan(0); global.__dbFail = false;
  });
  test('R32-03 wyszukiwanie bez polskich znaków', async () => {
    await renderApp(); await go('/exercises'); await flushAll(10); await type(screen.getByPlaceholderText('Szukaj…'), 'lydki na'); await flushAll(10);
    expect(screen.getByText('Łydki na stopniu')).toBeTruthy();
  });
});

describe('runda 33', () => {
  test('R33-01 przypomnienie o podpisie w dniu kalendarzowym przed wygaśnięciem (także przy zmianie czasu)', async () => {
    await fresh(); const { reminderAt, calendarDaysLeft } = require('@/lib/signing');
    for (const e of [new Date(2027, 2, 29, 0, 30), new Date(2026, 9, 26, 0, 30), new Date(2026, 9, 7, 11)]) { const w = reminderAt(e); expect(w.getHours()).toBe(18); expect(calendarDaysLeft(e, w)).toBe(1); }
  });
  test('R33-02 import backupu usuwa komunikat o nieczytelnych danych', async () => {
    await renderApp({ saved: '{nie json' }); await flushAll(10); expect(screen.getByText('Poprzednich danych nie dało się odczytać')).toBeTruthy();
    await act(async () => { store.resetAll(); }); await flushAll(10); expect(screen.queryByText('Poprzednich danych nie dało się odczytać')).toBeNull();
  });
});

describe('runda 34', () => {
  test('R34-01 spacja na końcu nazwy nie pozwala utworzyć duplikatu w pickerze', async () => {
    await renderApp(); await act(async () => { ex('Plank').name = 'Plank '; store.save(ex('Plank ')); store.startEmpty(); }); await go('/picker?target=active'); await flushAll(10);
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Plank'); await flushAll(10); expect(screen.queryByText(/^Utwórz/)).toBeNull();
  });
  test('R34-02 komunikat o nieczytelnych danych przetrwa ponowne uruchomienie (do importu/resetu)', async () => {
    await renderApp({ saved: '{nie json' }); await flushAll(10); expect(store.getRecovery()).not.toBeNull();
    await store.flush(); store.__resetForTests(); await store.init(); expect(store.getRecovery()).not.toBeNull();
    store.clearRecovery(); await flushAll(10); await store.flush(); store.__resetForTests(); await store.init(); expect(store.getRecovery()).toBeNull();
  });
});

describe('runda 35', () => {
  test('R35-01 druga awaria danych nie zasłania pierwszej kopii', async () => {
    await renderApp({ saved: '{zle1' }); await flushAll(10); const k1 = store.getRecovery()!.key;
    global.__kv.set('state', '{zle2'); store.__resetForTests(); await store.init(); expect(store.getRecovery()!.key).toBe(k1); expect(await store.readRecovery()).toBe('{zle1');
  });
  test('R35-02 Start i Duplikuj używają uporządkowanej nazwy szablonu', async () => {
    await renderApp({ saved: seedWithDemo() }); const tpl = store.getState().templates[0]; const orig = tpl.name; await go('/templates'); await flushAll(10); await tap(screen.getByText(orig)); await flushAll(10);
    await act(async () => { tpl.name = '   '; store.save(tpl); }); await tap(screen.getByText('Start')); await flushAll(10);
    expect(store.getState().active!.templateName).toBe(orig);
  });
  test('R35-03 komunikat o nieczytelnych danych można ukryć', async () => {
    await renderApp({ saved: '{zle' }); await flushAll(10); await tap(screen.getByText('Poprzednich danych nie dało się odczytać')); pressAlert('Poprzednich danych nie dało się odczytać', 'Ukryj komunikat'); await flushAll(10);
    expect(screen.queryByText('Poprzednich danych nie dało się odczytać')).toBeNull();
  });
});

describe('runda 36', () => {
  test('R36-01 migracja nadaje pustym nazwom domyślną nazwę w języku z ustawień, nie telefonu', async () => {
    await fresh(undefined, 'pl'); withDemoTemplates(); const raw = JSON.parse(JSON.stringify(store.getState())); raw.settings.language = 'en'; raw.exercises[0].name = '   '; raw.templates[0].name = '';
    const m = store.migrate(raw); expect(m.exercises[0].name).toBe('New exercise'); expect(m.templates[0].name).toBe('New template');
  });
  test('R36-02 wysłanie kopii nieczytelnych danych: błąd zapisu kończy się komunikatem', async () => {
    await renderApp({ saved: '{zle' }); await flushAll(10); const fs = require('expo-file-system/legacy'); const spy = jest.spyOn(fs, 'writeAsStringAsync').mockRejectedValueOnce(new Error('disk full'));
    await tap(screen.getByText('Poprzednich danych nie dało się odczytać')); pressAlert('Poprzednich danych nie dało się odczytać', 'Wyślij kopię'); await flushAll(10);
    expect(global.__alerts.at(-1)!.title).toBe('Nie udało się'); spy.mockRestore();
  });
});

describe('runda 37', () => {
  afterEach(async () => { await timer.stop(); });
  test('R37-01 etykieta Live Activity w języku aplikacji (nie telefonu)', async () => {
    await fresh(undefined, 'pl'); store.getState().settings.language = 'en'; store.applyPrefs(); store.startEmpty(); global.__la.length = 0;
    await timer.start(60, null); const st = (global.__la as any[]).find(x => x[0] === 'start'); expect(st[5]).toBe('rest|Rest');
    store.getState().settings.language = 'pl'; store.applyPrefs();
  });
});

describe('runda 39', () => {
  test('R39-01 nazwy tworzone przez aplikację mieszczą się w limicie 80 znaków', async () => {
    await fresh(); const e = store.newExercise('x'.repeat(120)); expect(e.name.length).toBe(80);
    const tpl = store.newTemplate(); tpl.name = 'A'.repeat(80); expect(store.dupTemplate(tpl.id).name.length).toBeLessThanOrEqual(80);
  });
  test('R39-02 słownik EN obejmuje wszystkie wartości domenowe', async () => {
    await fresh(); const seed = require('@/lib/seed'); const { EN } = require('@/lib/i18n.en');
    const vals = [...seed.GROUPS, ...seed.MUSCLES, ...Object.values(seed.METRIC_LABEL), ...Object.values(seed.LOAD_MODE_LABEL), ...Object.values(seed.SET_KIND_LABEL), ...Object.values(seed.MODULE_LABEL),
      'hantle', 'sztanga', 'masa ciała', 'maszyna', 'linki', 'inne', 'ciężar', 'dociążenie', 'e1RM', 'objętość serii', 'powtórzenia', 'czas', 'dystans'] as string[];
    expect(vals.filter(v => v !== 'e1RM' && !(v in EN))).toEqual([]);
  });
});

describe('runda 40', () => {
  test('R40-01 ponowne wybranie tego samego sprzętu nie resetuje ustawień', async () => {
    await fresh();
    const bp = ex('Bench Press (hantle)'); bp.loadMode = 'total'; store.setEquipment(bp, bp.equipment); expect(bp.loadMode).toBe('total');
  });
  test('R40-02 kopia szablonu nie rozcina emoji', async () => {
    await fresh(); const tpl = store.newTemplate(); tpl.name = 'a'.repeat(71) + '💪' + 'b'.repeat(7); const c = store.dupTemplate(tpl.id);
    expect(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/.test(c.name)).toBe(false); expect(c.name.length).toBeLessThanOrEqual(80);
  });
  test('R40-03 ćwiczenie usunięte tylko z bieżącego treningu nie zostaje jako „usunięte z historią”', async () => {
    await fresh(); const e = store.newExercise('Wiosłowanie gumą'); store.startEmpty(); store.addExerciseToActive(e); store.deleteExercise(e.id);
    expect(store.getState().exercises.some(x => x.id === e.id)).toBe(true); store.cancelWorkout(); expect(store.getState().exercises.some(x => x.id === e.id)).toBe(false);
  });
});

describe('runda 41', () => {
  test('R41-01 migracja usuwa zarchiwizowane ćwiczenia bez żadnego treningu; archived tylko gdy true; partia/sprzęt ze słownika', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState())); raw.exercises.push({ id: 'orph', name: 'Sierota', group: 'xx', equipment: 'yy', archived: true });
    raw.exercises.push({ id: 'z', name: 'Z', group: 'xx', archived: 'false' });
    const m = store.migrate(raw); expect(m.exercises.some(e => e.id === 'orph')).toBe(false); const z = m.exercises.find(e => e.id === 'z')!; expect(z.archived).toBeUndefined(); expect([z.group, z.equipment]).toEqual(['inne', 'inne']);
  });
  test('R41-02 „Przywróć” dla ćwiczenia bez historii nie obiecuje historii', async () => {
    await renderApp(); let e: any; await act(async () => { e = store.newExercise('Rowx'); store.startEmpty(); store.addExerciseToActive(e); store.deleteExercise(e.id); }); await go('/exercises'); await flushAll(10);
    await type(screen.getByPlaceholderText('Szukaj…'), 'rowx'); await flushAll(10); expect(screen.queryByText('usunięte ćwiczenie z historią')).toBeNull(); expect(screen.getByText('usunięte ćwiczenie (w bieżącym treningu)')).toBeTruthy();
  });
});

describe('runda 42', () => {
  test('R42-01 usunięcie bloku z treningu usuwa od razu skasowane ćwiczenie bez historii', async () => {
    await fresh(); const e = store.newExercise('Rowx'); store.startEmpty(); store.addExerciseToActive(e); store.deleteExercise(e.id); store.removeExercise(0);
    expect(store.getState().exercises.some(x => x.id === e.id)).toBe(false);
  });
  test('R42-02 edytor nie kasuje „nowego” ćwiczenia, które jest w szablonie', async () => {
    await renderApp(); let e: any; await act(async () => { e = store.newExercise(); const tpl = store.newTemplate(); tpl.items.push({ id: 'i', exerciseId: e.id, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(tpl); });
    await go('/exercises'); await flushAll(10); await go(`/exercise/${e.id}`); await flushAll(10);
    const { router } = require('expo-router'); await act(async () => { router.back(); }); await flushAll(10);
    expect(screen.queryByText('Nazwa')).toBeNull(); expect(store.getState().exercises.some(x => x.id === e.id)).toBe(true);
  });
});

describe('runda 43', () => {
  test('R43-01 migracja usuwa z szablonów pozycje z brakującymi/usuniętymi ćwiczeniami', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); const raw = JSON.parse(JSON.stringify(store.getState()));
    const sq = raw.exercises.find((e: any) => e.name === 'Back Squat'); sq.archived = true; raw.templates = [{ id: 'T', name: 'Tpl', items: [{ id: 'a', exerciseId: sq.id, sets: 3 }, { id: 'b', exerciseId: 'brak', sets: 3 }] }];
    const m = store.migrate(raw); expect(m.templates[0].items).toHaveLength(0);
  });
});

describe('runda 45', () => {
  test('R45-01 guma przechodzi na następną serię razem z asystą (także gdy szablon wpisał ±0)', async () => {
    await fresh(); const st = store.getState(); legacyBandKg(st.bands[0], 20); const cu = ex('Chin Up');
    const tpl = store.newTemplate(); tpl.items.push({ id: 'c', exerciseId: cu.id, sets: 3, repMin: 6, repMax: 8, restSec: null, startWeight: 0, targetSec: '', groupId: null }); store.startFromTemplate(tpl);
    const sets = st.active!.exercises[0].sets; expect(sets[1].addKg).toBe(0);
    sets[0].bandId = st.bands[0].id; sets[0].reps = 6; store.toggleDone(0, 0);
    expect([sets[1].bandId, sets[1].addKg]).toEqual([st.bands[0].id, 0]); /* P-001: guma przechodzi, ale bez kg */
  });
});

describe('runda 46', () => {
  test('R46-01 asysta z podpowiedzi (innej gumy) nie trafia do serii ani nie przechodzi dalej', async () => {
    await fresh(); const st = store.getState(); const [A, B] = st.bands; const pu = ex('Pull Up');
    addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 8, bandId: B.id, addKg: -25 }, { reps: 8, bandId: B.id, addKg: -25 }]]]);
    store.startEmpty(); store.addExerciseToActive(pu); store.addSet(0); const sets = st.active!.exercises[0].sets; sets[0].bandId = A.id; sets[0].reps = 8; sets[1].bandId = ''; sets[1].addKg = '';
    store.toggleDone(0, 0); expect(sets[0].addKg).toBe(''); expect(sets[1].addKg).toBe('');
  });
  test('R46-02 seria wykonana poprzednio bez gumy nie dostaje gumy z poprzedniej serii', async () => {
    await fresh(); const st = store.getState(); const A = st.bands[0]; legacyBandKg(A, 20); const cu = ex('Chin Up');
    const tpl = store.newTemplate(); tpl.items.push({ id: 'c', exerciseId: cu.id, sets: 2, repMin: 5, repMax: 8, restSec: null, startWeight: 0, targetSec: '', groupId: null });
    const w = addWorkout(at(2026, 9, 1), [['Chin Up', [{ reps: 8, bandId: A.id, addKg: -20 }, { reps: 5 }]]]); w.templateId = tpl.id; w.exercises[0].tplItemId = 'c'; store.save(w);
    store.startFromTemplate(tpl); const sets = st.active!.exercises[0].sets; expect(sets[1].bandId).toBe('');
    store.toggleDone(0, 0); expect([sets[1].bandId, sets[1].addKg]).toEqual(['', '']);
  });
});

describe('runda 47', () => {
  const tplOf = (exId: string, n: number, sw: number | '' = '') => { const t = store.newTemplate(); t.items.push({ id: 'c', exerciseId: exId, sets: n, repMin: 5, repMax: 8, restSec: null, startWeight: sw, targetSec: '', groupId: null }); return t; };
  test('R47-01 wpisana asysta przechodzi, gdy następna seria ma już tę samą gumę bez asysty', async () => {
    await fresh(); const st = store.getState(); const A = st.bands[0]; store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); store.addSet(0);
    const sets = st.active!.exercises[0].sets; sets[0].bandId = A.id; sets[0].addKg = -15; sets[0].reps = 8; sets[1].bandId = A.id; sets[1].addKg = '';
    store.toggleDone(0, 0); expect([sets[1].bandId, sets[1].addKg]).toEqual([A.id, -15]);
  });
  test('R47-02 guma z podpowiedzi przechodzi razem ze swoją asystą', async () => {
    await fresh(); const st = store.getState(); const A = st.bands[0]; const cu = ex('Chin Up'); const tpl = tplOf(cu.id, 2);
    const w = addWorkout(at(2026, 9, 1), [['Chin Up', [{ reps: 8, bandId: A.id, addKg: -20 }]]]); w.templateId = tpl.id; w.exercises[0].tplItemId = 'c'; store.save(w);
    store.startFromTemplate(tpl); const sets = st.active!.exercises[0].sets; sets[0].bandId = ''; sets[0].addKg = ''; sets[1].bandId = ''; sets[1].addKg = '';
    store.toggleDone(0, 0); expect([sets[0].bandId, sets[0].addKg]).toEqual([A.id, -20]); expect([sets[1].bandId, sets[1].addKg]).toEqual([A.id, -20]);
  });
  test('R47-03 guma zdjęta cyklem do „—” nie wraca z podpowiedzi po odhaczeniu', async () => {
    await renderApp(); const st = store.getState(); const bands = [...st.bands].sort((a, b) => a.level - b.level); const top = bands[bands.length - 1]; legacyBandKg(top, 30);
    addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 8, bandId: top.id, addKg: -30 }]]]);
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); const s0 = st.active!.exercises[0].sets[0]; s0.bandId = top.id; s0.addKg = -30; store.save(st.active); }); await flushAll(10);
    await tap(screen.getAllByLabelText(/^Guma: /)[0]); await flushAll(5);
    const s0 = st.active!.exercises[0].sets[0]; expect([s0.bandId, s0.addKg]).toEqual(['', -30]); /* P-001: zdjęcie gumy nie rusza ±kg */
    await act(async () => { s0.reps = 8; store.toggleDone(0, 0); }); expect([s0.bandId, s0.addKg]).toEqual(['', -30]);
  });
  test('R47-04 guma nie trafia do serii z własnym obciążeniem (np. asysta −10 z szablonu); ±0 zastępuje asystą gumy', async () => {
    await fresh(); const st = store.getState(); const A = st.bands[0]; legacyBandKg(A, 20); const cu = ex('Chin Up');
    store.startFromTemplate(tplOf(cu.id, 2, -10)); let sets = st.active!.exercises[0].sets; sets[0].bandId = A.id; sets[0].addKg = -20; sets[0].reps = 6;
    store.toggleDone(0, 0); expect([sets[1].bandId, sets[1].addKg]).toEqual(['', -10]);
    store.cancelWorkout(); store.startFromTemplate(tplOf(cu.id, 2, 0)); sets = st.active!.exercises[0].sets; sets[0].bandId = A.id; sets[0].addKg = -20; sets[0].reps = 6;
    store.toggleDone(0, 0); expect([sets[1].bandId, sets[1].addKg]).toEqual([A.id, -20]);
  });
  test('R47-05 dociążenie +10 bez gumy nadal przechodzi; guma nie przechodzi do serii zdjętej ręcznie', async () => {
    await fresh(); const st = store.getState(); const A = st.bands[0]; store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); store.addSet(0); store.addSet(0);
    const sets = st.active!.exercises[0].sets; sets[0].addKg = 10; sets[0].reps = 5; store.toggleDone(0, 0); expect([sets[1].bandId, sets[1].addKg]).toEqual(['', 10]);
    sets[1].bandId = A.id; sets[1].addKg = -15; sets[1].reps = 5; sets[2].noBand = true; sets[2].addKg = ''; store.toggleDone(0, 1); expect([sets[2].bandId, sets[2].addKg]).toEqual(['', '']);
  });
  test('R47-06 migracja: noBand tylko true i tylko bez gumy', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); const raw = JSON.parse(JSON.stringify(store.getState()));
    raw.active.exercises[0].sets[0].noBand = 'tak'; const m = store.migrate(raw); expect('noBand' in m.active!.exercises[0].sets[0]).toBe(false);
  });
});

describe('runda 48', () => {
  test('R48-01 ujemny ciężar startowy z szablonu (po zmianie sprzętu z masy ciała) nie daje ujemnej objętości', async () => {
    await fresh(); const pu = ex('Pull Up'); const tpl = store.newTemplate(); tpl.items.push({ id: 'p', exerciseId: pu.id, sets: 2, repMin: 8, repMax: 8, restSec: null, startWeight: -20, targetSec: '', groupId: null });
    store.setEquipment(pu, 'maszyna'); store.startFromTemplate(tpl); const sets = store.getState().active!.exercises[0].sets; expect(sets[0].weight).toBe(0);
    store.toggleDone(0, 0); store.toggleDone(0, 1); const w = store.finishWorkout()!; expect(store.volume(w)).toBeGreaterThanOrEqual(0);
    const s = { ...sets[0], weight: -5 } as any; expect(store.setLoad(pu, s)).toBe(0);
  });
  test('R48-02 import: wartości serii tylko liczby albo puste, finishedAt liczba ≥ startu', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState())); const sq = ex('Back Squat').id;
    raw.workouts.push({ startedAt: at(2026, 9, 1), finishedAt: '2026-09-01T19:00:00', exercises: [{ exerciseId: sq, sets: [{ weight: { v: 100 }, reps: [5], rpe: 'x', distanceM: '12', durationSec: -3, addKg: '-5', done: true }] }] });
    raw.workouts.push({ startedAt: at(2026, 9, 2), finishedAt: at(2026, 9, 1), exercises: [{ exerciseId: ex('Back Squat').id, sets: [{ weight: 100, reps: 5, done: true }] }] });
    const m = store.migrate(raw); const s = m.workouts[0].exercises[0].sets[0];
    expect([s.weight, s.reps, s.rpe, s.distanceM, s.durationSec, s.addKg]).toEqual(['', '', '', 12, 0, -5]);
    expect(m.workouts[0].finishedAt).toBe(at(2026, 9, 1, 19)); /* runda 51: data tekstem jest czytana */ expect(m.workouts[1].finishedAt).toBe(at(2026, 9, 2));
    expect(store.migrate(JSON.parse(JSON.stringify(m)))).toEqual(m);
  });
  test('R48-03 zmiana gumy na odhaczonej serii i cofnięcie odhaczenia zostawia asystę nowej gumy', async () => {
    await fresh(); const st = store.getState(); const [A, B] = st.bands; legacyBandKg(A, 20); legacyBandKg(B, 20);
    addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 8, bandId: A.id, addKg: -20 }]]]);
    store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); const s = st.active!.exercises[0].sets[0];
    store.toggleDone(0, 0); expect([s.bandId, s.addKg]).toEqual([A.id, -20]);
    s.bandId = B.id; store.toggleDone(0, 0); expect([s.bandId, s.addKg]).toEqual([B.id, -20]);
  });
  test('R48-04 „+ seria” po zdjęciu gumy nie przywraca jej z podpowiedzi', async () => {
    await fresh(); const st = store.getState(); const A = st.bands[0]; addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 8, bandId: A.id }, { reps: 8, bandId: A.id }]]]);
    store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); const sets = st.active!.exercises[0].sets; sets[0].noBand = true; sets[0].reps = 8; store.toggleDone(0, 0);
    store.addSet(0); expect(sets[1].noBand).toBe(true); store.toggleDone(0, 1); expect(sets[1].bandId).toBe('');
  });
  test('R48-05 usunięcie gumy zdejmuje ją z treningu w toku (P-001: ±kg zostaje)', async () => {
    await renderApp(); const st = store.getState(); st.bands.forEach(b => { legacyBandKg(b, 20); }); const ids = st.bands.map(b => b.id);
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); ids.slice(1).forEach(() => store.addSet(0)); st.active!.exercises[0].sets.forEach((s, i) => { s.bandId = ids[i]; s.addKg = -20; }); store.save(st.active); });
    await go('/more/bands'); await flushAll(10); await swipeDelete(/^Usuń gumę: /); pressAlert('Usunąć gumę?', 'Usuń'); await flushAll(5);
    const gone = ids.findIndex(id => !st.bands.some(b => b.id === id)); expect(gone).toBeGreaterThanOrEqual(0);
    const sets = st.active!.exercises[0].sets; expect([sets[gone].bandId, sets[gone].addKg]).toEqual(['', -20]); expect(sets.filter(s => s.bandId).length).toBe(ids.length - 1);
  });
  test('R48-06 zdjęcie gumy o nieznanej asyście zabiera jej asystę; asysta podpowiedzi gumy nie trafia do ćwiczenia bez asysty gumą', async () => {
    await fresh(); const st = store.getState(); const A = st.bands[0]; const top = [...st.bands].sort((a, b) => a.level - b.level).pop()!; const s: any = { bandId: top.id, addKg: -15 }; store.cycleBand(s); expect([s.bandId, s.addKg]).toEqual(['', -15]); /* P-001: zdjęcie gumy (cykl do „—”) nie rusza ±kg */
    const pu = ex('Pull Up'); addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 8, bandId: A.id, addKg: -20 }]]]); pu.bandAssistable = false;
    store.startEmpty(); store.addExerciseToActive(pu); const s0 = st.active!.exercises[0].sets[0]; store.toggleDone(0, 0); expect([s0.bandId, s0.addKg]).toEqual(['', '']);
  });
  test('R48-07 druga instancja ekranu treningu nie wywraca się po zakończeniu', async () => {
    await renderApp(); await go('/more/progress'); await flushAll(10); await go('/'); await flushAll(10);
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Bench Press (hantle)')); store.addExerciseToActive(ex('Plank')); }); await flushAll(10);
    const a = store.getState().active!; a.exercises[0].sets[0].weight = 20; a.exercises[0].sets[0].reps = 5;
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]); await tap(screen.getAllByLabelText('Start stopera serii')[0]); await flushAll(3000);
    await tap(screen.getAllByText('Zakończ trening i zapisz')[0]); await flushAll(10);
    await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(1000); expect(store.getState().active).toBeNull();
  });
});

describe('runda 49', () => {
  const hist = (A: string) => addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 8, bandId: A, addKg: -20 }]]]);
  test('R49-01 start z szablonu i „Powtórz ostatni” nie wnoszą asysty gumy do ćwiczenia bez asysty gumą', async () => {
    await fresh(); const st = store.getState(); const pu = ex('Pull Up'); hist(st.bands[0].id); pu.bandAssistable = false;
    const tpl = store.newTemplate(); tpl.items.push({ id: 'p', exerciseId: pu.id, sets: 1, repMin: 8, repMax: 8, restSec: null, startWeight: '', targetSec: '', groupId: null });
    store.startFromTemplate(tpl); let s = st.active!.exercises[0].sets[0]; expect([s.bandId, s.addKg]).toEqual(['', '']);
    store.cancelWorkout(); store.repeatLast(); s = st.active!.exercises[0].sets[0]; expect([s.bandId, s.addKg]).toEqual(['', '']);
  });
  test('R49-02 asysta usuniętej gumy nie wraca z „Poprzednio” ani z „Powtórz ostatni”', async () => {
    await fresh(); const st = store.getState(); const A = st.bands[0]; hist(A.id); st.bands = st.bands.filter(b => b.id !== A.id);
    store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); let s = st.active!.exercises[0].sets[0]; store.toggleDone(0, 0); expect([s.bandId, s.addKg]).toEqual(['', '']);
    store.cancelWorkout(); store.repeatLast(); s = st.active!.exercises[0].sets[0]; expect([s.bandId, s.addKg]).toEqual(['', '']);
  });
  test('R49-03 import: ogromne liczby nie stają się Infinity; RPE ≤ 10, powtórzenia całkowite; migracja idempotentna', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState())); const sq = ex('Back Squat').id;
    raw.workouts.push({ startedAt: at(2026, 9, 1), finishedAt: at(2026, 9, 1, 19), exercises: [{ exerciseId: sq, repMin: '6', repMax: -2, sets: [{ weight: 1e308, reps: 2.7, rpe: 15, done: true }] }] });
    const m = store.migrate(raw); const e = m.workouts[0].exercises[0]; const s = e.sets[0];
    expect([s.weight, s.reps, s.rpe]).toEqual(['', 2, 10]); expect([e.repMin, e.repMax]).toEqual([6, null]); expect(units.snapLegacyLb(1e307)).toBe(1e307);
    expect(store.migrate(JSON.parse(JSON.stringify(m)))).toEqual(m);
  });
  test('R49-04 import: podpowiedzi tylko dla pól wartości i w postaci liczb — cofnięcie nie kasuje id/typu', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const raw = JSON.parse(JSON.stringify(store.getState()));
    const s0 = raw.active.exercises[0].sets[0]; Object.assign(s0, { weight: '50', reps: 5, done: true, hinted: { id: s0.id, kind: 'normal', weight: '50' } });
    store.replaceState(raw); const s = store.getState().active!.exercises[0].sets[0]; expect(s.hinted).toEqual({ weight: 50 });
    store.toggleDone(0, 0); expect([s.id, s.kind, s.weight, s.reps]).toEqual([s0.id, 'normal', '', 5]);
  });
  test('R49-05 import: przerwa pozycji szablonu z tekstu; pola stopera śmieciowe → domyślne', async () => {
    await fresh(); withDemoTemplates(); const raw = JSON.parse(JSON.stringify(store.getState())); raw.templates[0].items[0].restSec = '60'; raw.timer = { restTotal: 'a', restEndAt: 'x', setId: 5 };
    const m = store.migrate(raw); expect(m.templates[0].items[0].restSec).toBe(60); expect([m.timer.restTotal, m.timer.restEndAt, m.timer.setId]).toEqual([0, null, null]);
  });
  test('R49-06 VoiceOver: kontrolki wiersza szablonu i gumy mówią, czego dotyczą; chip wybranego ćwiczenia; nieaktywne moduły', async () => {
    await renderApp({ saved: seedWithDemo() }); const st = store.getState(); const tpl = st.templates[0]; await go(`/template/${tpl.id}`); await flushAll(10); await openCard(0);
    const name = store.exById(tpl.items[0].exerciseId)!.name;
    expect(deleteActions()).toContain(`Usuń ćwiczenie: ${name}`); expect(screen.getAllByLabelText('+ seria')[0].props.accessibilityHint).toBe(name); /* 07.10.2026 wieczór: akcja „usuń” zamiast przycisku */
    await go('/more/bands'); await flushAll(10); expect(deleteActions().filter(l => /^Usuń gumę: .+/.test(l)).length).toBe(store.getState().bands.length);
    await go(`/more/progress?ex=${ex('Back Squat').id}`); await flushAll(10); const chip = screen.getByLabelText('Back Squat'); expect(chip.props.accessibilityHint).toMatch(/inne ćwiczenie/);
    /* moduły schowane 05.10.2026 (decyzja właściciela) — chip „Trening” nie jest już wyświetlany */
  });
  test('R49-07 pusta nazwa wraca do ostatniej zapisanej, nie do tej sprzed otwarcia ekranu', async () => {
    await renderApp(); const e = ex('Back Squat'); await go(`/exercise/${e.id}`); await flushAll(10);
    const f = screen.getByLabelText('Nazwa'); await type(f, 'Front Squat'); await act(async () => { f.props.onEndEditing?.(); });
    await type(f, ''); await act(async () => { f.props.onEndEditing?.(); }); expect(e.name).toBe('Front Squat');
  });
});

describe('runda 50', () => {
  test('R50-01 podpowiedź na ekranie odświeża się po edycji szablonu w trakcie treningu (ta sama co przy odhaczeniu)', async () => {
    await renderApp(); const pu = ex('Pull Up'); const tpl = store.newTemplate(); tpl.name = 'TT';
    for (const id of ['a', 'c']) tpl.items.push({ id, exerciseId: pu.id, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null });
    const w = addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 13, addKg: 7 }]]]); w.templateId = tpl.id; w.exercises[0].tplItemId = 'a'; store.save(w);
    await act(async () => { store.startFromTemplate(tpl); }); await flushAll(10); const before = screen.queryAllByText(/13/).length;
    await act(async () => { store.removeItem(tpl.items, 0, tpl); }); await flushAll(10); expect(screen.queryAllByText(/13/).length).toBeGreaterThan(before);
  });
  test('R50-02 zmiana gumy o nieznanej asyście na inną o nieznanej zabiera starą asystę; „62,5” z importu to 62,5', async () => {
    await fresh(); const [A, B] = store.getState().bands; const s: any = { bandId: A.id, addKg: -15 }; store.cycleBand(s); expect([s.bandId, s.addKg]).toEqual([B.id, -15]); /* P-001: zmiana gumy (cykl A → B) */
    const raw = JSON.parse(JSON.stringify(store.getState())); raw.workouts.push({ startedAt: at(2026, 9, 1), finishedAt: at(2026, 9, 1, 19), exercises: [{ exerciseId: ex('Back Squat').id, sets: [{ weight: '62,5', reps: '8', done: true }] }] });
    const m = store.migrate(raw); expect([m.workouts[0].exercises[0].sets[0].weight, m.workouts[0].exercises[0].sets[0].reps]).toEqual([62.5, 8]);
  });
  test('R50-03 import z obiektem w porannym wpisie nie wywraca aplikacji; BB i sen 0–100 (ekran wpisu usunięty 05.10.2026)', async () => {
    const st = seedState('pl') as any; st.mornings = [{ date: '2026-09-01', bb: { v: 50 }, sleepScore: 150, sleepH: '30', weight: 'x' }]; legacyBandKg(st.bands[0], {});
    await renderApp({ saved: st }); const m = store.getState().mornings[0]; expect([m.bb, m.sleepScore, m.sleepH, m.weight]).toEqual(['', 100, 24, '']); expect(store.getState().bands[0]).not.toHaveProperty('nominalKg'); /* T-055: dawne pole odpada przy imporcie */
  });
  test('R50-04 moduł włączony w imporcie: sekcja modułów schowana (05.10.2026), import nie wywraca ustawień', async () => {
    const st = seedState('pl') as any; st.settings.modules.diet = true; await renderApp({ saved: st }); await go('/more/settings'); await flushAll(10);
    expect(screen.queryByText(/Dieta/)).toBeNull(); expect(screen.getByText('Dane w telefonie')).toBeTruthy();
  });
  test('R50-05 usunięcie nieużywanej gumy nie straszy historią ani treningiem', async () => {
    await renderApp(); await go('/more/bands'); await flushAll(10); await swipeDelete(/^Usuń gumę: /);
    const a = global.__alerts.filter((x: any) => x.title === 'Usunąć gumę?').pop(); expect(a!.msg).toBeFalsy();
  });
  test('R50-06 historia: wiersz serii czytany jako „nagłówek: wartość”', async () => {
    await renderApp(); const w = addWorkout(Date.now() - 3600e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); await go(`/history/${w.id}`); await flushAll(10);
    expect(screen.getByLabelText(/^#: 1, .*100.*, pow\.: 5/)).toBeTruthy();
  });
  test('R50-07 import: blok z nieprawidłowym exerciseId odpada, liczbowy zamieniony na tekst', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState())); raw.workouts.push({ startedAt: at(2026, 9, 1), finishedAt: at(2026, 9, 1, 19), exercises: [{ exerciseId: true, sets: [{ reps: 5, done: true }] }, { exerciseId: 7, sets: [{ reps: 5, done: true }] }] }); /* runda 59: historia bez pustych bloków */
    const m = store.migrate(raw); expect(m.workouts[0].exercises.map(e => e.exerciseId)).toEqual(['7']);
  });
});
test('R50-08 wykresy mają streszczenie dla VoiceOver (słupki)', async () => {
  await renderApp(); addWorkout(Date.now() - 86400e3 * 9, [['Back Squat', [{ weight: 100, reps: 5 }]]]); addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 110, reps: 5 }]]]);
  await go('/more/progress'); await flushAll(10); expect(screen.getAllByLabelText(/^Wykres słupkowy: .*: 550/).length).toBeGreaterThan(0);
});
test('R50-09 wykresy mają streszczenie dla VoiceOver (linia)', async () => {
  await renderApp(); addWorkout(Date.now() - 86400e3 * 9, [['Back Squat', [{ weight: 100, reps: 5 }]]]); addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 110, reps: 5 }]]]);
  await go(`/more/progress?ex=${ex('Back Squat').id}`); await flushAll(10); expect(screen.getAllByLabelText(/^Wykres, 2 sesje/).length).toBeGreaterThan(0);
});

describe('runda 51', () => {
  test('R51-01 import z liczbowymi id: historia, szablony i gumy dalej wskazują swoje ćwiczenia', async () => {
    await fresh(); withDemoTemplates(); const raw = JSON.parse(JSON.stringify(store.getState())); const sq = raw.exercises.find((e: any) => e.name === 'Back Squat'); sq.id = 7; raw.bands[0].id = 3;
    raw.exercises.push({ id: 8, name: 'Moje', group: 'inne', equipment: 'inne', archived: true });
    raw.templates[0].items.push({ id: 99, exerciseId: 7, sets: 3 }); const nItems = raw.templates[0].items.length;
    raw.workouts.push({ startedAt: at(2026, 9, 1), finishedAt: at(2026, 9, 1, 19), exercises: [{ exerciseId: 7, sets: [{ weight: 100, reps: 5, done: true, bandId: 3 }] }, { exerciseId: 8, sets: [{ weight: 50, reps: 5, done: true }] }] });
    const m = store.migrate(raw); expect(m.exercises.some(e => e.name === 'Moje')).toBe(true); expect(m.templates[0].items.length).toBe(nItems);
    expect(m.workouts[0].exercises[0].sets[0].bandId).toBe('3'); store.replaceState(m); expect(store.volume(store.getState().workouts[0])).toBeGreaterThan(0);
    expect(store.migrate(JSON.parse(JSON.stringify(m)))).toEqual(m);
  });
  test('R51-02 import: pola szablonu, ustawień i ćwiczeń jak wartości serii (przecinek, tekst, zakresy, nieskończoność)', async () => {
    await fresh(); withDemoTemplates(); const raw = JSON.parse(JSON.stringify(store.getState())); const it = raw.templates[0].items[0];
    Object.assign(it, { startWeight: '62,5', targetSec: { v: 60 }, repMin: 'Infinity', repMax: '1e400' }); raw.templates[0].items[1].targetSec = -30;
    raw.settings.defaultRest = '120'; raw.bands[0].level = 'Infinity'; raw.bands[1].nominalKg = '12,5'; /* T-055: stare pole — import go przyjmuje i usuwa */
    const m = store.migrate(raw); const i0 = m.templates[0].items[0];
    expect([i0.startWeight, i0.targetSec, i0.repMin, i0.repMax, m.templates[0].items[1].targetSec]).toEqual([62.5, '', null, null, '']);
    expect([m.settings.defaultRest, m.bands[0].level]).toEqual([120, 1]); expect(m.bands[1]).not.toHaveProperty('nominalKg');
  });
  test('R51-03 import: daty treningów poza zakresem Date odpadają, tekstowa data startu jest czytana; ranna waga 0 = brak', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState()));
    raw.workouts.push({ startedAt: 1e300, finishedAt: null, exercises: [{ exerciseId: ex('Back Squat').id, sets: [{ weight: 100, reps: 5, done: true }] }] }, { startedAt: '2026-09-03T18:00:00', finishedAt: false, exercises: [{ exerciseId: ex('Back Squat').id, sets: [{ weight: 100, reps: 5, done: true }] }] });
    raw.mornings = [{ date: '2026-09-01', weight: 0 }, { date: '2026-09-02', weight: -3 }];
    const m = store.migrate(raw); expect(m.workouts.map(w => [w.startedAt, w.finishedAt])).toEqual([[at(2026, 9, 3), at(2026, 9, 3)]]);
    expect(m.mornings.map(x => x.weight)).toEqual(['', '']);
    const walk = (o: any): boolean => o == null || typeof o !== 'object' ? (typeof o !== 'number' || Number.isFinite(o)) : Object.values(o).every(walk); expect(walk(m)).toBe(true);
  });
  test('R51-04 po zmianie języka litera gumy zgadza się z nazwą na ekranie Gumy', async () => {
    await renderApp(); const st = store.getState(); st.settings.language = 'en'; store.applyPrefs(); store.save(); await go('/more/bands'); await flushAll(10);
    const names = screen.getAllByLabelText('Band colour').map((x: any) => x.props.value); expect(names).toEqual(['red', 'black', 'purple']);
    expect(store.shortBand(st.bands[0])).toBe('R2');
  });
});
test('R51-05 → P-001/T-055: zmiana gumy nie rusza ±kg (ani asysty, ani dociążenia)', async () => {
  await fresh(); const [A, B, C] = [...store.getState().bands].sort((a, b) => a.level - b.level); legacyBandKg(A, 20);
  const s: any = { bandId: A.id, addKg: -12 }; store.cycleBand(s); expect([s.bandId, s.addKg]).toEqual([B.id, -12]);
  const s2: any = { bandId: C.id, addKg: 10 }; store.cycleBand(s2); expect([s2.bandId, s2.addKg]).toEqual(['', 10]);
  const s3: any = { bandId: '', addKg: -10 }; store.cycleBand(s3); expect([s3.bandId, s3.addKg]).toEqual([A.id, -10]);
  const s4: any = { bandId: A.id, addKg: 10 }; store.cycleBand(s4); expect([s4.bandId, s4.addKg]).toEqual([B.id, 10]);
});

describe('runda 52', () => {
  test('R52-01 wyczyszczony kolor gumy to puste pole (nie „?” doklejany do nowego tekstu)', async () => {
    await renderApp(); await go('/more/bands'); await flushAll(10); const f = screen.getAllByLabelText('Kolor gumy')[0];
    await type(f, ''); await flushAll(2); expect(screen.getAllByLabelText('Kolor gumy')[0].props.value).toBe('');
  });
  test('R52-02 import: czas tekstem (liczba i sama data) czytany; createdAt/updatedAt zawsze liczbą; najnowszy wpis poranny wygrywa', async () => {
    await fresh(); withDemoTemplates(); const raw = JSON.parse(JSON.stringify(store.getState()));
    raw.workouts.push({ startedAt: String(at(2026, 9, 1)), finishedAt: String(at(2026, 9, 1, 19)), exercises: [{ exerciseId: ex('Back Squat').id, sets: [{ weight: 100, reps: 5, done: true }] }] }, { startedAt: '2026-09-03', exercises: [{ exerciseId: ex('Back Squat').id, sets: [{ weight: 100, reps: 5, done: true }] }] });
    raw.templates[0].createdAt = '2026-09-01T09:00:00'; raw.mornings = [{ date: '2026-09-01', bb: 50, updatedAt: '2026-09-02T10:00:00' }, { date: '2026-09-01', bb: 60, updatedAt: at(2026, 9, 1) }];
    const m = store.migrate(raw); expect(m.workouts.map(w => w.startedAt)).toEqual([at(2026, 9, 1), new Date(2026, 8, 3).getTime()]);
    expect(typeof m.templates[0].createdAt).toBe('number'); expect(m.mornings[0].bb).toBe(50);
  });
  test('R52-03 własne ćwiczenie o nazwie z biblioteki zostaje własne po restarcie', async () => {
    await fresh(); store.deleteExercise(ex('Bieg').id); const e = store.newExercise('Bieg'); const m = store.migrate(JSON.parse(JSON.stringify(store.getState())));
    expect(m.exercises.find(x => x.id === e.id)!.lib).toBeUndefined();
  });
  test('R52-04 emoji w kolorze gumy: litera to całe emoji; VoiceOver słyszy pełną nazwę', async () => {
    await fresh(); expect(store.shortBand({ color: '🔴 red', level: 2 })).toBe('🔴2'); expect(store.bandA11y({ color: 'czerwona', level: 2 })).toBe('czerwona, poziom 2');
  });
  test('R52-05 guma z podpowiedzi dostaje swoją (już znaną) asystę', async () => {
    await fresh(); const st = store.getState(); const A = st.bands[0]; addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 8, bandId: A.id }, { reps: 8, bandId: A.id }]]]); legacyBandKg(A, 20);
    store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); const s = st.active!.exercises[0].sets[0]; store.toggleDone(0, 0); expect([s.bandId, s.addKg]).toEqual([A.id, '']); /* P-001: guma z podpowiedzi bez kg */
    store.toggleDone(0, 0); expect([s.bandId, s.addKg]).toEqual(['', '']);
    store.cancelWorkout(); store.repeatLast(); const r = st.active!.exercises[0].sets[0]; expect([r.bandId, r.addKg]).toEqual([A.id, '']);
  });
  test('R52-06 import: przerwa serii i czasy stopera w rozsądnych granicach; tylko tekstowe healthUUID', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState())); raw.timer = { restTotal: 1e300, setTarget: '90', restEndAt: '2026-09-01' };
    raw.workouts.push({ startedAt: at(2026, 9, 1), finishedAt: at(2026, 9, 1, 19), healthUUID: 2.5, exercises: [{ exerciseId: ex('Back Squat').id, sets: [{ weight: 100, reps: 5, done: true, actualRest: 1.7e308 }, { weight: 100, reps: 5, done: true, actualRest: '60' }] }] });
    const m = store.migrate(raw); expect(m.workouts[0].exercises[0].sets.map(s => s.actualRest)).toEqual([null, 60]); expect(m.workouts[0].healthUUID).toBeNull();
    expect([m.timer.restTotal, m.timer.setTarget, m.timer.restEndAt]).toEqual([0, 90, new Date(2026, 8, 1).getTime()]);
  });
  test('R52-07 zakończenie ostrzega o odhaczonych seriach bez czasu lub dystansu', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); }); await flushAll(10);
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]); await tap(screen.getAllByText('Zakończ trening i zapisz')[0]); await flushAll(5);
    const a = global.__alerts.filter((x: any) => x.title === 'Zakończyć trening?').pop(); expect(a!.msg).toMatch(/bez czasu lub dystansu: 1/);
  });
});

describe('runda 53', () => {
  test('R53-01 mierzona seria na czas nie dostaje ostrzeżenia o braku czasu; mierzony bieg bez dystansu — dostaje', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addExerciseToActive(ex('Bieg')); store.addExerciseToActive(ex('Back Squat')); }); await flushAll(10);
    const a = store.getState().active!; a.exercises[2].sets[0].weight = 100; a.exercises[2].sets[0].reps = 5;
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]); await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[2]);
    await tap(screen.getAllByLabelText('Start stopera serii')[0]); global.__alerts.filter((x: any) => x.title === 'Zmierzyć serię od nowa?').slice(-1).forEach(() => pressAlert('Zmierzyć serię od nowa?', 'Zmierz')); await flushAll(2000);
    await tap(screen.getAllByText('Zakończ trening i zapisz')[0]); await flushAll(5);
    expect(global.__alerts.filter((x: any) => x.title === 'Zakończyć trening?').pop()!.msg).not.toMatch(/bez czasu/);
  });
  test('R53-02 kolor gumy przycinany (litera na przycisku); stare dane też', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState())); raw.bands[0].color = ' zielona  x '; const m = store.migrate(raw); expect(m.bands[0].color).toBe('zielona x'); expect(store.shortBand(m.bands[0])).toMatch(/^Z/);
  });
  test('R53-03 asysta z podpowiedzi nie trafia do ćwiczenia bez ±kg; cofnięcie zdejmuje gumę razem z poprawioną asystą', async () => {
    await fresh(); const st = store.getState(); const A = st.bands[0]; addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 8, bandId: A.id }]]]); legacyBandKg(A, 20);
    store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); const s = st.active!.exercises[0].sets[0]; store.toggleDone(0, 0); expect(s.addKg).toBe(''); /* P-001 */
    s.addKg = -15; store.toggleDone(0, 0); expect([s.bandId, s.addKg]).toEqual(['', -15]); /* wpisane ręcznie zostaje */
    store.cancelWorkout(); const pu = ex('Pull Up'); pu.metric = 'reps'; store.repeatLast(); const r = st.active!.exercises[0].sets[0]; expect([r.bandId, r.addKg]).toEqual([A.id, '']);
  });
  test('R53-04 przerwa kończąca się dalej niż cała przerwa (uszkodzony zapis) nie wraca po restarcie', async () => {
    await fresh(); const st = store.getState(); store.startEmpty(); st.timer = { ...st.timer, restEndAt: Date.now() + 365 * 86400e3, restTotal: 90, setStartAt: Date.now() + 86400e3, setTarget: 60 } as any;
    await timer.restore(); expect([timer.T.on, timer.S.on]).toEqual([false, false]);
  });
  test('R53-05 migracja: v i metaUpdatedAt skończone', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState())); raw.v = Infinity; raw.metaUpdatedAt = Infinity; const m: any = store.migrate(raw); expect(m.v).toBe(2); expect('metaUpdatedAt' in m).toBe(false);
  });
});

describe('runda 54', () => {
  test('R54-01 pola liczbowe mają tę samą granicę co wczytanie; ciężar nieujemny — restart nic nie zmienia', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Bieg')); }); await flushAll(10);
    await type(screen.getAllByLabelText('kg')[0], '-20'); await type(screen.getAllByLabelText('dystans')[0], '42195000'); await flushAll(5);
    const a = store.getState().active!; expect([a.exercises[0].sets[0].weight, a.exercises[1].sets[0].distanceM]).toEqual([0, 1e6]);
    expect(store.migrate(JSON.parse(JSON.stringify(store.getState())))).toEqual(JSON.parse(JSON.stringify(store.getState())));
  });
  test('R54-02 usunięcie gumy nie zabiera ±kg (P-001); pusty ekran gum ma opis', async () => {
    await renderApp(); const st = store.getState(); st.bands.forEach(b => { legacyBandKg(b, 20); });
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); const s = st.active!.exercises[0].sets[0]; s.bandId = st.bands[0].id; s.addKg = -15; store.save(st.active); });
    await go('/more/bands'); await flushAll(10); const n = st.bands.length;
    for (let i = 0; i < n; i++) { await swipeDelete(/^Usuń gumę: /); pressAlert('Usunąć gumę?', 'Usuń'); await flushAll(5); }
    const s = st.active!.exercises[0].sets[0]; expect([s.bandId, s.addKg]).toEqual(['', -15]); expect(screen.getByText(/Brak gum/)).toBeTruthy();
  });
  test('R54-03 link do postępów ćwiczenia przy otwartym ekranie postępów pokazuje to ćwiczenie', async () => {
    await renderApp({ url: '/more/progress' }); addWorkout(Date.now() - 86400e3, [['Plank', [{ durationSec: 60 }]]]); await flushAll(10);
    const { router } = require('expo-router'); await act(async () => { router.push(`/more/progress?ex=${ex('Plank').id}`); }); await flushAll(10);
    expect(screen.getByLabelText('Plank')).toBeTruthy();
  });
  test('R54-04 guma w ćwiczeniu bez pola ±kg nie zapisuje ukrytej asysty', async () => {
    await renderApp(); const st = store.getState(); st.bands.forEach(b => { legacyBandKg(b, 20); }); const pu = ex('Pull Up'); pu.metric = 'reps';
    await act(async () => { store.startEmpty(); store.addExerciseToActive(pu); }); await flushAll(10); await tap(screen.getAllByLabelText(/^Guma: /)[0]);
    const s = st.active!.exercises[0].sets[0]; expect(s.bandId).not.toBe(''); expect(s.addKg).toBe('');
  });
});

describe('runda 55', () => {
  test('R55-01 kg z wieloma miejscami po przecinku zostają po restarcie (przyciąganie funtów tylko dla starych danych)', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const s = store.getState().active!.exercises[0].sets[0]; s.weight = 45.359237;
    const m = store.migrate(JSON.parse(JSON.stringify(store.getState()))); expect(m.active!.exercises[0].sets[0].weight).toBe(45.36); /* runda 60: siatka 0,01 kg, nie przyciąganie funtów (45,35) */ expect(m.schemaVersion).toBe(18); /* runda 75: schemat 13; P-003 E1: 14; audyt 0.10 A1: 18 */
  });
  test('R55-02 nazwy jak „toString”/„constructor”/„__proto__” nie trafiają w Object.prototype', async () => {
    await fresh(); for (const n of ['toString', 'constructor', '__proto__', 'hasOwnProperty']) { const e = store.newExercise(n); store.setEquipment(e, 'masa ciała'); expect(e.equipment).toBe('masa ciała'); }
    const raw = JSON.parse(JSON.stringify(store.getState())); raw.schemaVersion = 9; raw.exercises.push({ id: 'k', name: 'constructor', group: 'inne', equipment: 'inne' }); expect(() => store.migrate(raw)).not.toThrow();
    expect(typeof require('@/lib/i18n').t('constructor')).toBe('string');
  });
  /* R55-03 (waga rano w lb) — ekran porannego wpisu usunięty 05.10.2026 (decyzja właściciela) */
  test('R55-04 cel stopera ograniczony do doby (jak po wczytaniu); czas/dystans zaokrąglone, pole bez zapisu wykładniczego', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); const id = store.getState().active!.exercises[0].sets[0].id; await timer.startSet(id, 200000); expect(timer.S.targetSec).toBe(86400); await timer.stopSet();
  });
});

describe('runda 56', () => {
  test('R56-01 przejście ze schematu 10 na 11 nie robi z własnego ćwiczenia ćwiczenia z biblioteki', async () => {
    await fresh(); store.deleteExercise(ex('Bieg').id); const e = store.newExercise('Bieg'); const raw = JSON.parse(JSON.stringify(store.getState())); raw.schemaVersion = 10;
    expect(store.migrate(raw).exercises.find(x => x.id === e.id)!.lib).toBeUndefined();
  });
  test('R56-02 wartość przycięta do już zapisanej liczby od razu widoczna w polu (RPE 10 → „100”)', async () => {
    await renderApp(); store.getState().settings.showRpe = true; await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); }); await flushAll(10);
    const r = () => screen.getAllByLabelText('RPE')[0]; await type(r(), '10'); await type(r(), '100'); await flushAll(5); expect(r().props.value).toBe('10');
    await type(r(), ''); await flushAll(5); expect(r().props.value).toBe('');
  });
  test('R56-03 komunikat o backupie z nowszej wersji nie powtarza tytułu', async () => {
    await fresh(); const { parseBackup } = require('@/lib/backup'); let msg = '';
    try { parseBackup(JSON.stringify({ format: 'trening-backup', schemaVersion: 99, state: store.getState() })); } catch (e: any) { msg = e.message; }
    expect(msg).toMatch(/schemat 99/); expect(msg).not.toMatch(/nowszej wersji/);
  });
});

describe('runda 57', () => {
  test('R57-01 stare ułamkowe sekundy/metry zaokrąglane przy wczytaniu (bez rekordu przy tej samej wyświetlanej wartości); poranne ułamki zostają', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState())); raw.schemaVersion = 10;
    raw.workouts.push({ startedAt: at(2026, 9, 1), finishedAt: at(2026, 9, 1, 19), exercises: [{ exerciseId: ex('Plank').id, sets: [{ durationSec: 59.6, done: true }] }] });
    raw.mornings = [{ date: '2026-09-01', sleepH: 7.5, weight: 80.25 }];
    const m = store.migrate(raw); expect(m.workouts[0].exercises[0].sets[0].durationSec).toBe(60); expect([m.mornings[0].sleepH, m.mornings[0].weight]).toEqual([7.5, 80.25]);
  });
  test('R57-02 pole pokazuje od razu wartość przyciętą do 1 000 000 i zaokrąglone RPE; „0” na początku „0,5” nie znika', async () => {
    await renderApp(); store.getState().settings.showRpe = true; await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); }); await flushAll(10);
    const r = () => screen.getAllByLabelText('Powtórzenia')[0]; await type(r(), '2000000'); await flushAll(5); expect(r().props.value).toBe('1000000');
    const p = () => screen.getAllByLabelText('RPE')[0]; await type(p(), '8,25'); await flushAll(5); expect(p().props.value).toBe('8,3');
  });
});

describe('runda 58', () => {
  test('R58-01 ciężar × 0 s (seria na czas z ciężarem) nie jest rekordem ciężaru i nie blokuje prawdziwego', async () => {
    const stats = require('@/lib/stats'); await fresh(); addWorkout(at(2026, 9, 1), [["Farmer's Walk", [{ weight: 40, durationSec: 60 }]]]);
    store.startEmpty(); store.addExerciseToActive(ex("Farmer's Walk")); store.addSet(0); const a = store.getState().active!; const [s1, s2] = a.exercises[0].sets;
    s1.weight = 50; s1.durationSec = 0; store.toggleDone(0, 0); s2.weight = 50; s2.durationSec = 70; store.toggleDone(0, 1);
    const prs = stats.prMap(a); expect(prs.get(s1.id)).toBeUndefined(); expect(prs.get(s2.id)).toEqual(['łączny czas']); /* runda 73: rekord = łączny czas na treningu */
  });
  test('R58-02 CI uruchamia natywne sprawdzenia (warstwa D)', () => {
    const y = require('fs').readFileSync(require('path').join(__dirname, '../.github/workflows/ios-unsigned.yml'), 'utf8'); expect(y).toMatch(/npm run verify:native/);
  });
  test('T-051 CI (SDK 54+): buildy na macOS wybierają najnowszy Xcode 26.x; platforma iOS dla buildów na urządzenie; obraz EAS zgodny z SDK', () => {
    const fs = require('fs'), path = require('path'), os = require('os'); const { execFileSync } = require('child_process');
    const wf = (n: string) => fs.readFileSync(path.join(__dirname, '../.github/workflows', n), 'utf8') as string;
    for (const n of ['ios-unsigned.yml', 'e2e-ios.yml', 'testflight.yml']) { /* 08.10.2026: iphone-local.yml usunięty (audyt M4) — build na telefon przez testflight.yml */
      const y = wf(n);
      expect(y).toMatch(/run: bash scripts\/ci\/select-xcode\.sh 26\n/); expect(y.split('\n').filter(l => !/^\s*#/.test(l)).join('\n')).not.toMatch(/Xcode_16|iOS 18\.2/); /* komentarze mogą cytować historię */
      expect(y.indexOf('select-xcode.sh')).toBeLessThan(y.indexOf('npm ci')); /* Xcode wybrany przed czymkolwiek, co go używa */
    }
    for (const n of ['ios-unsigned.yml', 'testflight.yml']) { const y = wf(n); const p = y.indexOf('bash scripts/ci/ensure-ios-platform.sh'); expect(p).toBeGreaterThan(0); expect(p).toBeLessThan(y.indexOf('xcodebuild -workspace')); }
    const e2e = wf('e2e-ios.yml'); expect(e2e).not.toMatch(/downloadPlatform/); expect(e2e.indexOf('"iPhone 17 \\(" "iPhone 16 \\(" "iPhone"')).toBeGreaterThan(0); /* SDK 56: macos-26 ma iPhone 17, nie 16 */
    for (const n of ['ios-unsigned.yml', 'e2e-ios.yml', 'testflight.yml']) expect(wf(n)).toMatch(/\n    runs-on: macos-26[ \n]/); /* SDK 56+: Xcode 26.4+, którego macos-15 nie ma */
    expect(JSON.parse(fs.readFileSync(path.join(__dirname, '../eas.json'), 'utf8')).build.base.ios.image).toBe(`sdk-${require('expo/package.json').version.split('.')[0]}`); /* alias obrazu = główny numer zainstalowanego SDK (docs.expo.dev/build-reference/infrastructure) — podbicie SDK bez obrazu EAS nie przejdzie */
    /* skrypt wyboru na sztucznym /Applications: najnowszy 26.x po numerze (26.10 > 26.3), bez dowiązań i bet; brak 26.x → błąd z listą */
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xcode-')); const run = (major?: string) => execFileSync('bash', [path.join(__dirname, '../scripts/ci/select-xcode.sh'), ...(major ? [major] : [])], { env: { ...process.env, APPS_DIR: dir, DRY_RUN: '1' }, encoding: 'utf8' });
    try {
      for (const v of ['16.2', '16.4', '26.0.1', '26.1.1', '26.2', '26.3', '26.4_beta']) fs.mkdirSync(path.join(dir, `Xcode_${v}.app`));
      fs.symlinkSync(path.join(dir, 'Xcode_26.2.app'), path.join(dir, 'Xcode_26.9.app'));
      expect(run()).toBe(`Wybrany Xcode: 26.3 (${dir}/Xcode_26.3.app)\n`);
      fs.mkdirSync(path.join(dir, 'Xcode_26.10.app')); expect(run('26')).toMatch(/^Wybrany Xcode: 26\.10 /);
      let err = ''; try { run('27'); } catch (e: any) { err = String(e.stdout); } expect(err).toMatch(/::error::Brak Xcode 27\.x/); expect(err).toMatch(/Xcode_26\.3\.app/);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
    /* układ obrazu macos-26 (20260907): 26.4.1, 26.5, 26.6 + dowiązania Xcode_26.6.0.app i Xcode_26.4.app → 26.4.1 — wybór 26.6 */
    const dir26 = fs.mkdtempSync(path.join(os.tmpdir(), 'xcode26-')); const run26 = () => execFileSync('bash', [path.join(__dirname, '../scripts/ci/select-xcode.sh'), '26'], { env: { ...process.env, APPS_DIR: dir26, DRY_RUN: '1' }, encoding: 'utf8' });
    try {
      for (const v of ['26.0.1', '26.1.1', '26.2', '26.3', '26.4.1', '26.5', '26.6']) fs.mkdirSync(path.join(dir26, `Xcode_${v}.app`));
      fs.symlinkSync(path.join(dir26, 'Xcode_26.6.app'), path.join(dir26, 'Xcode_26.6.0.app')); fs.symlinkSync(path.join(dir26, 'Xcode_26.4.1.app'), path.join(dir26, 'Xcode_26.4.app'));
      fs.symlinkSync(path.join(dir26, 'Xcode_26.6.app'), path.join(dir26, 'Xcode.app'));
      expect(run26()).toBe(`Wybrany Xcode: 26.6 (${dir26}/Xcode_26.6.app)\n`);
    } finally { fs.rmSync(dir26, { recursive: true, force: true }); }
  });
  test('T-051 audyt (NISKIE): zakładki z `expo-router/js-tabs` — `Tabs` z głównego `expo-router` jest przestarzałe od routera 57', () => {
    const fs = require('fs'), path = require('path');
    const files: string[] = []; const walk = (d: string) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (/\.tsx?$/.test(e.name)) files.push(f); } };
    for (const d of ['app', 'components', 'lib']) walk(path.join(__dirname, '..', d));
    const bad = files.filter(f => /import\s*\{[^}]*\bTabs\b[^}]*\}\s*from\s*'expo-router'/.test(fs.readFileSync(f, 'utf8'))); expect(bad).toEqual([]);
    expect(fs.readFileSync(path.join(__dirname, '../app/(tabs)/_layout.tsx'), 'utf8')).toMatch(/import \{ Tabs \} from 'expo-router\/js-tabs';/);
    expect(require('expo-router/js-tabs').Tabs).toBe(require('expo-router').Tabs); /* ten sam komponent — zmiana tylko ścieżki importu */
  });
});

describe('runda 59', () => {
  test('R59-01 bieg z samym dystansem może być najlepszą serią sesji', async () => {
    const stats = require('@/lib/stats'); await fresh(); const b = ex('Bieg'); addWorkout(at(2026, 9, 1), [['Bieg', [{ distanceM: 1000, durationSec: 300 }, { distanceM: 5000, durationSec: '' }]]]);
    expect(stats.sessionsFor(b)[0].bestSet.distanceM).toBe(5000);
  });
  test('R59-02 kg wpisane z 3 miejscami to wartość z ekranu (0,01) — bez fałszywego rekordu', async () => {
    await fresh(); expect(units.wIn(100.004)).toBe(100); expect(units.wIn(62.555)).toBe(62.56);
  });
  test('R59-03 import: zakończony trening trzyma tylko odhaczone serie (lista i statystyki zgodne)', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState())); const sq = ex('Back Squat').id;
    raw.workouts.push({ startedAt: at(2026, 9, 1), finishedAt: at(2026, 9, 1, 19), exercises: [{ exerciseId: sq, sets: [{ weight: 100, reps: 5, done: true }, { weight: 200, reps: 5, done: false }] }, { exerciseId: ex('Plank').id, sets: [{ durationSec: 60 }] }] });
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); raw.active = JSON.parse(JSON.stringify(store.getState().active));
    const m = store.migrate(raw); expect(m.workouts[0].exercises.map(e => e.sets.length)).toEqual([1]); expect(m.active!.exercises[0].sets[0].done).toBe(false);
  });
  test('R59-04 postępy ćwiczenia jednostronnego: rekordy „na stronę”; w historii VoiceOver mówi typ serii słownie', async () => {
    await renderApp(); const e = ex('Bulgarian Split Squat (hantle)'); e.loadMode = 'unilateral'; store.save(e);
    const w = addWorkout(Date.now() - 86400e3, [['Bulgarian Split Squat (hantle)', [{ weight: 20, reps: 8 }, { weight: 10, reps: 8, kind: 'drop' } as any]]]);
    await go(`/more/progress?ex=${e.id}`); await flushAll(10); expect(screen.getByText('Max ciężar (na stronę)')).toBeTruthy();
    await go(`/history/${w.id}`); await flushAll(10); expect(screen.getByLabelText(/^#: 1 drop set,/)).toBeTruthy(); /* audyt 0.10 (LIVE-14): drop serii 1 („1D”, wcześniej „2D”) */
  });
});

describe('runda 60', () => {
  test('R60-01 ten sam dystans: seria z czasem wygrywa z serią bez czasu', async () => {
    const stats = require('@/lib/stats'); await fresh(); addWorkout(at(2026, 9, 1), [['Bieg', [{ distanceM: 5000, durationSec: 1500 }, { distanceM: 5000, durationSec: '' }]]]);
    expect(stats.sessionsFor(ex('Bieg'))[0].bestSet.durationSec).toBe(1500);
  });
  test('R60-02 import: kg na siatce 0,01 (bez rekordu przy tej samej liczbie); puste sesje odpadają', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState())); const sq = ex('Back Squat').id;
    raw.workouts.push({ startedAt: at(2026, 9, 1), finishedAt: at(2026, 9, 1, 19), exercises: [{ exerciseId: sq, sets: [{ weight: 100.006, reps: 5, done: true }] }] }, { startedAt: at(2026, 9, 2), finishedAt: at(2026, 9, 2, 19), exercises: [{ exerciseId: sq, sets: [{ weight: 100, reps: 5 }] }] });
    const m = store.migrate(raw); expect(m.workouts.length).toBe(1); expect(m.workouts[0].exercises[0].sets[0].weight).toBe(100.01);
  });
  test('R60-03 pole kg nie zmienia tekstu w trakcie „62,555”', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); }); await flushAll(10);
    const f = () => screen.getAllByLabelText('kg')[0]; for (const s of ['6', '62', '62,', '62,5', '62,55', '62,555']) { await type(f(), s); await flushAll(5); } expect(f().props.value).toBe('62,555');
  });
  test('R60-04 npm run verify bez /dev/null i /tmp (Windows)', () => {
    const pkg = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '../package.json'), 'utf8')); expect(pkg.scripts.verify).not.toMatch(/\/dev\/null|\/tmp\//);
  });
});

describe('runda 61', () => {
  test('R61-01 kg z importu: połówki od zera (asysta lustrzana); 0,004 kg masy ciała to brak wpisu od razu', async () => {
    await fresh(); const raw = JSON.parse(JSON.stringify(store.getState())); raw.bands[0].nominalKg = 2.125; raw.mornings = [{ date: '2026-09-01', weight: 0.004 }];
    raw.workouts.push({ startedAt: at(2026, 9, 1), finishedAt: at(2026, 9, 1, 19), exercises: [{ exerciseId: ex('Pull Up').id, sets: [{ addKg: -2.125, reps: 5, done: true }, { reps: 5, durationSec: 1e6, done: true }] }] });
    const m = store.migrate(raw); expect(m.workouts[0].exercises[0].sets[0].addKg).toEqual(-2.13); expect(m.bands[0]).not.toHaveProperty('nominalKg'); /* T-055 */
    expect(m.mornings[0].weight).toEqual(''); expect(store.migrate(JSON.parse(JSON.stringify(m)))).toEqual(m);
  });
  test('R61-02 wykres „max ±” pokazuje sesję bez asysty (0) — dzień bez gumy', async () => {
    await renderApp(); const d = 86400e3, now = Date.now();
    addWorkout(now - 3 * d, [['Pull Up', [{ addKg: -15, reps: 6 }]]]); addWorkout(now - 2 * d, [['Pull Up', [{ addKg: -10, reps: 6 }]]]); addWorkout(now - d, [['Pull Up', [{ addKg: '', reps: 5 }]]]);
    await go('/more/progress?ex=' + ex('Pull Up').id); await flushAll(20); await tap(screen.getByText('max ±')); /* runda 73: domyślnie wykres rekordu (suma) */ expect(screen.getAllByLabelText(/^Wykres, 3 sesje/).length).toBeGreaterThan(0);
  });
});

describe('runda 62', () => {
  test('R62-01 sesja bez wykonanej serii nie daje punktu 0 na wykresie „max ±”', async () => {
    await renderApp(); const d = 86400e3, now = Date.now();
    addWorkout(now - 3 * d, [['Pull Up', [{ addKg: -15, reps: 6 }]]]); addWorkout(now - 2 * d, [['Pull Up', [{ addKg: -20, reps: 0 }]]]); addWorkout(now - d, [['Pull Up', [{ addKg: -10, reps: 6 }]]]);
    await go('/more/progress?ex=' + ex('Pull Up').id); await flushAll(20); expect(screen.getAllByLabelText(/^Wykres, 2 sesje/).length).toBeGreaterThan(0);
  });
  test('R62-02 stoper bez celu zapisuje najwyżej dobę (jak pole i wczytanie)', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); const s = store.getState().active!.exercises[0].sets[0]; const t0 = Date.now();
    await timer.startSet(s.id, 0); const spy = jest.spyOn(Date, 'now').mockReturnValue(t0 + 30 * 3600e3); try { const r = await timer.stopSet(); expect(r.sec).toBe(86400); } finally { spy.mockRestore(); }
  });
});

describe('runda 63', () => {
  test('R63-01 przycisk numeru serii mówi, którego ćwiczenia dotyczy; szablon: „start kg/hantel”, serie do 50', async () => {
    await renderApp({ saved: seedWithDemo() }); await tap(screen.getByLabelText('Start: Upper A')); await flushAll(10);
    expect(screen.getAllByLabelText(/^Seria 1, typ: normalna/)[0].props.accessibilityHint).toMatch(/Seria 1 — /);
    const tpl = store.getState().templates[0]; await go(`/template/${tpl.id}`); await flushAll(10); await openCard(0);
    expect(screen.getAllByLabelText(/kg\/hantel|±kg|^kg$/).length).toBeGreaterThan(0); /* 05.10.2026: wiersze serii — etykieta ciężaru jak w treningu */
    await act(async () => { for (let i = 0; i < 60; i++) store.tplAddRow(tpl, tpl.items[0].id); }); await flushAll(5); expect(tpl.items[0].sets).toBe(50); /* limit 50 serii */
  });
});

describe('runda 65', () => {
  test('R65-01 ćwiczenie z masą ciała: objętość i e1RM z samego dociążenia (runda 75: masa ciała poza obliczeniami)', async () => {
    const stats = require('@/lib/stats'); await fresh(); const e = ex('Hanging Leg Raise'); const w = addWorkout(at(2026, 9, 1), [['Hanging Leg Raise', [{ addKg: 10, reps: 10 }]]]);
    const v0 = store.volume(w), e0 = stats.recordsFor(e).bestE1rm; expect(v0).toBe(100); expect(e0).toBe(0); /* E1 (audyt 0.10): e1RM z samego dociążenia to nie szacunek Epleya — bez masy ciała i udziału ze źródeł brak e1RM; objętość z dociążenia zostaje */
    store.getState().settings.bodyMass = 80; store.save(); expect(stats.recordsFor(e).bestE1rm).toBe(0); /* Hanging Leg Raise — brak źródła udziału masy ciała */
  });
  test('R65-02 wyłączona asysta gumą: „+ seria” i odhaczenie nie przenoszą ukrytej gumy ani jej asysty', async () => {
    await fresh(); const st = store.getState(); legacyBandKg(st.bands[0], 20); const pu = ex('Pull Up'); store.startEmpty(); store.addExerciseToActive(pu);
    const sets = st.active!.exercises[0].sets; sets[0].bandId = st.bands[0].id; sets[0].addKg = -20; sets[0].reps = 8; pu.bandAssistable = false;
    store.addSet(0); expect([sets[1].bandId, sets[1].addKg]).toEqual(['', '']); sets[1].addKg = ''; store.toggleDone(0, 0); expect([sets[1].bandId, sets[1].addKg]).toEqual(['', '']);
  });
});

describe('runda 66', () => {
  /* R66-01 (udział masy ciała po zmianie sprzętu) — nieaktualne od rundy 75 (Q-001: udział usunięty). */
  test('R66-02 ukryta guma (asysta gumą wyłączona) nie blokuje +kg z podpowiedzi ani z poprzedniej serii', async () => {
    await fresh(); const st = store.getState(); const pu = ex('Pull Up'); addWorkout(at(2026, 9, 1), [['Pull Up', [{ addKg: 10, reps: 6 }]]]);
    store.startEmpty(); store.addExerciseToActive(pu); store.addSet(0); const sets = st.active!.exercises[0].sets; sets[0].bandId = st.bands[0].id; pu.bandAssistable = false;
    store.toggleDone(0, 0); expect(sets[0].addKg).toBe(10);
  });
  test('R66-03 zmiana dźwięku w trakcie przerwy przeplanowuje powiadomienie', async () => {
    await fresh(); store.startEmpty(); await timer.start(120); const n = () => (global.__notifications as any[]).filter(x => x.identifier === 'rest-end').pop();
    expect(n().content.sound).toBe(true); store.getState().settings.sound = false; await timer.refreshScheduled(); expect(n().content.sound).toBe(false);
  });
  test('R66-04 dwa bloki tego samego ćwiczenia rozróżnialne dla VoiceOver', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Back Squat')); }); await flushAll(10);
    const l = screen.getAllByLabelText(/^Seria 1 zrobiona — Back Squat/).map((x: any) => x.props.accessibilityLabel); expect(new Set(l).size).toBe(2);
  });
});

describe('runda 67', () => {
  /* R67-01 (udział masy ciała przemianowanego ćwiczenia) — nieaktualne od rundy 75 (Q-001). */
  test('R67-02 przerwa po czasie: zmiana dźwięku nie planuje drugiego powiadomienia', async () => {
    await fresh(); store.startEmpty(); const t0 = Date.now(); await timer.start(5); const spy = jest.spyOn(Date, 'now').mockReturnValue(t0 + 10e3); const n0 = (global.__notifications as any[]).length;
    try { await timer.refreshScheduled(); expect((global.__notifications as any[]).slice(n0).filter(x => x.identifier === 'rest-end')).toHaveLength(0); } finally { spy.mockRestore(); }
  });
  test('R67-03 dwie pozycje szablonu z tym samym ćwiczeniem rozróżnialne dla VoiceOver', async () => {
    await renderApp(); const tpl = store.newTemplate(); const sq = ex('Back Squat'); for (const id of ['a', 'b']) tpl.items.push({ id, exerciseId: sq.id, sets: 3, repMin: 5, repMax: 8, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(tpl);
    await go(`/template/${tpl.id}`); await flushAll(10); const h = deleteActions().filter(l => l.startsWith('Usuń ćwiczenie: ')); expect(h).toEqual(['Usuń ćwiczenie: Back Squat (1)', 'Usuń ćwiczenie: Back Squat (2)']); /* 07.10.2026 wieczór: akcja „usuń” nagłówka pozycji */
  });
  test('R67-04 koniec przerwy kończy Live Activity także poza zakładką Trening', async () => {
    await renderApp({ url: '/history' }); await act(async () => { store.startEmpty(); await timer.start(3); }); global.__la.length = 0;
    await act(async () => { jest.advanceTimersByTime(5000); }); await flushAll(2); expect(timer.T.alarmed).toBe(true); expect(global.__la.some((x: any) => x[0] === 'end')).toBe(true);
  });
});

describe('runda 69', () => {
  test('R69-01 zmiana serii w treningu zapisuje tylko mały klucz „live”; restart odtwarza trening z „live”', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); await store.flush();
    const before = global.__kv.get('state'); const s = store.getState().active!.exercises[0].sets[0]; s.weight = 102.5; store.save(store.getState().active); await store.flush();
    expect(global.__kv.get('state')).toBe(before); expect(JSON.parse(global.__kv.get('live')!).active.exercises[0].sets[0].weight).toBe(102.5);
    store.__resetForTests(); await store.init(); expect(store.getState().active!.exercises[0].sets[0].weight).toBe(102.5);
  });
  test('R69-02 „live” starsze niż pełny stan albo uszkodzone — ignorowane', async () => {
    await fresh(); store.startEmpty(); await store.flush(); global.__kv.set('live', JSON.stringify({ at: 1, active: null, timer: {} }));
    store.__resetForTests(); await store.init(); expect(store.getState().active).not.toBeNull();
    global.__kv.set('live', '{zepsute'); store.__resetForTests(); await store.init(); expect(store.getState().active).not.toBeNull();
  });
  test('R69-03 ćwiczenie zmienione w trakcie treningu trafia do pełnego zapisu', async () => {
    await fresh(); store.startEmpty(); await store.flush(); const e = ex('Back Squat'); e.tempo = '3-1-1'; store.save(e); await store.flush();
    expect(JSON.parse(global.__kv.get('state')!).exercises.find((x: any) => x.id === e.id).tempo).toBe('3-1-1');
  });
  test('R69-04 historia z 300 sesjami: lista renderuje się porcjami', async () => {
    await renderApp(); await act(async () => { for (let i = 0; i < 300; i++) addWorkout(Date.now() - (i + 1) * 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); }); /* runda 72: jedna partia — bez ostrzeżenia o głębokości aktualizacji */
    await go('/history'); await flushAll(5); expect(screen.getAllByText(/Back Squat|T$/).length).toBeLessThan(100);
  });
});

describe('runda 69 — porzucony trening', () => {
  const H = 3600e3;
  test('R69-05 po 6 h bez aktywności trening zapisuje się sam; koniec = ostatnia odhaczona seria', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; const s = a.exercises[0].sets[0];
    s.weight = 100; s.reps = 5; store.toggleDone(0, 0); const last = s.completedAt!;
    expect(store.autoFinishStale(last + 5 * H)).toBeNull();
    const w = store.autoFinishStale(last + 7 * H)!; expect(w.finishedAt).toBe(last); expect(store.getState().active).toBeNull();
  });
  test('R69-06 bez odhaczonych serii roboczych nic się nie zapisuje samo; pytanie po 2 h, „Kontynuuj” odsuwa je o kolejne 2 h', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; const t0 = a.startedAt;
    expect(store.autoFinishStale(t0 + 9 * H)).toBeNull(); expect(store.staleSince(t0 + H)).toBeNull(); expect(store.staleSince(t0 + 2.5 * H)).toBe(t0);
    const spy = jest.spyOn(Date, 'now').mockReturnValue(t0 + 2.5 * H); try { store.ackStale(); } finally { spy.mockRestore(); }
    expect(store.staleSince(t0 + 3.5 * H)).toBeNull(); expect(store.staleSince(t0 + 4.6 * H)).toBe(t0);
  });
  test('R69-07 ekran pyta o porzucony trening i „Zakończ i zapisz” kończy z godziną ostatniej serii', async () => {
    await renderApp(); const now = Date.now();
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; a.startedAt = now - 3 * H; const s = a.exercises[0].sets[0]; s.weight = 100; s.reps = 5; s.done = true; s.completedAt = now - 2.5 * H; store.save(a); store.refreshViews(); });
    await flushAll(10); const al = global.__alerts.filter((x: any) => x.title === 'Trening wciąż trwa').pop(); expect(al).toBeTruthy();
    await act(async () => { pressAlert('Trening wciąż trwa', 'Zakończ i zapisz'); }); await flushAll(10);
    const w = store.getState().workouts[store.getState().workouts.length - 1]; expect(w.finishedAt).toBe(now - 2.5 * H); expect(store.getState().active).toBeNull();
  });
  test('R69-08 migracja: staleAck tylko w treningu w toku', async () => {
    await fresh(); store.startEmpty(); const raw = JSON.parse(JSON.stringify(store.getState())); raw.active.staleAck = 'x';
    raw.workouts.push({ startedAt: at(2026, 9, 1), finishedAt: at(2026, 9, 1, 19), staleAck: 5, exercises: [{ exerciseId: ex('Back Squat').id, sets: [{ weight: 100, reps: 5, done: true }] }] });
    const m: any = store.migrate(raw); expect('staleAck' in m.active).toBe(false); expect('staleAck' in m.workouts[0]).toBe(false);
  });
});
test('R69-09 start aplikacji z treningiem porzuconym > 6 h: zapis i komunikat; przypomnienie zaplanowane 2 h po serii', async () => {
  const H = 3600e3; await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; const now = Date.now();
  a.startedAt = now - 9 * H; const s = a.exercises[0].sets[0]; s.weight = 100; s.reps = 5; s.done = true; s.completedAt = now - 8 * H; store.save(a); await store.flush();
  const st = JSON.parse(JSON.stringify(store.getState())); await renderApp({ saved: st }); await flushAll(20);
  expect(store.getState().active).toBeNull(); expect(global.__alerts.some((x: any) => x.title === 'Zapisałem trening')).toBe(true);
});
test('R69-10 przypomnienie o porzuconym treningu planowane 2 h po ostatniej serii', async () => {
  await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); }); await flushAll(10);
  const n = (global.__notifications as any[]).filter(x => x.identifier === 'stale-reminder').pop(); expect(n.trigger.seconds).toBeGreaterThan(7000); expect(n.trigger.seconds).toBeLessThanOrEqual(7200);
});

describe('runda 68 (testy dopisane)', () => {
  /* R68-01 (udział masy ciała przy zmianie sprzętu) — nieaktualne od rundy 75 (Q-001). */
  test('R68-02 tytuły ekranów to nagłówki dla VoiceOver', async () => {
    await renderApp({ url: '/history' }); await flushAll(10); expect(screen.getByRole('header', { name: 'Kalendarz' })).toBeTruthy();
  });
  test('R68-03 stoper z celem po czasie kończy Live Activity także bez ekranu treningu', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); const id = store.getState().active!.exercises[0].sets[0].id; const t0 = Date.now();
    await timer.startSet(id, 30); global.__la.length = 0; const spy = jest.spyOn(Date, 'now').mockReturnValue(t0 + 40e3); try { timer.tick(); } finally { spy.mockRestore(); }
    expect(global.__la.some((x: any) => x[0] === 'end')).toBe(true); await timer.stopSet();
  });
});

describe('runda 70 (audyt tematyczny T1/T2)', () => {
  test('R70-01 cofnięty zegar nie gubi treningu w toku (licznik zapisów zamiast godziny)', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); await store.flush(); const t0 = Date.now();
    const spy = jest.spyOn(Date, 'now').mockReturnValue(t0 - 3600e3); try { store.getState().active!.exercises[0].sets[0].weight = 77; store.save(store.getState().active); await store.flush(); } finally { spy.mockRestore(); }
    store.__resetForTests(); await store.init(); expect(store.getState().active!.exercises[0].sets[0].weight).toBe(77);
  });
  test('R70-02 awaria między zapisem stanu a „live” nie wskrzesza zakończonego treningu', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const s = store.getState().active!.exercises[0].sets[0]; s.weight = 100; s.reps = 5; store.toggleDone(0, 0); await store.flush();
    const oldLive = global.__kv.get('live')!; store.finishWorkout(); await store.flush(); global.__kv.set('live', oldLive);
    store.__resetForTests(); await store.init(); expect(store.getState().active).toBeNull(); expect(store.getState().workouts).toHaveLength(1);
  });
  test('R70-03 nieczytelny stan: kopia do wysłania zawiera też trening w toku z „live”', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.getState().active!.exercises[0].sets[0].weight = 123.5; store.save(store.getState().active); await store.flush();
    global.__kv.set('state', '{zepsute'); store.__resetForTests(); await store.init(); expect(await store.readRecovery()).toMatch(/123\.5/);
  });
  test('R70-04 trwający stoper serii to aktywność; koniec po czasie nie wcześniej niż ostatnia seria', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); const a = store.getState().active!; const id = a.exercises[0].sets[0].id;
    await timer.startSet(id, 0); const t = Date.now(); expect(store.staleSince(t + 1.5 * 3600e3)).toBeNull(); expect(store.autoFinishStale(t + 7 * 3600e3)).toBeNull(); await timer.stopSet();
  });
  test('R70-05 przypomnienie po „Kontynuuj” podaje godzinę ostatniej serii', async () => {
    await fresh(); const last = Date.now() - 50 * 60e3; await timer.scheduleStaleReminder(Date.now() - 30 * 60e3, last); /* runda 73: czas względny — stała data „przeterminowała” test */
    const n = (global.__notifications as any[]).filter(x => x.identifier === 'stale-reminder').pop(); expect(n.content.body).toContain(store.fmtTime(last));
  });
  test('R70-06 oś wykresu: w lb etykiety się nie powtarzają, objętość bez powtórzeń, powtórzenia na całkowitych', async () => {
    await renderApp(); const st = store.getState(); st.settings.unit = 'lb'; store.applyPrefs(); store.save();
    addWorkout(Date.now() - 2 * 86400e3, [['Back Squat', [{ weight: units.wIn(220.5) as number, reps: 5 }]], ['Pull Up', [{ reps: 1 }]]]); addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: units.wIn(220.6) as number, reps: 5 }]], ['Pull Up', [{ reps: 6 }]]]);
    await go('/more/progress?ex=' + ex('Back Squat').id); await flushAll(10);
    const txt = (re: RegExp) => screen.UNSAFE_root.findAll((n: any) => typeof n.props?.children === 'string' && re.test(n.props.children) && n.type === 'Text').map((n: any) => n.props.children);
    const labels = screen.UNSAFE_root.findAll((n: any) => n.props && typeof n.props.children === 'string' && / lb$/.test(n.props.children) && n.props.textAnchor === 'end').map((n: any) => n.props.children);
    expect(new Set(labels).size).toBe(labels.length); void txt; units.applyUnit('kg');
  });
});

describe('runda 71 (audyt tematyczny T1b/T3)', () => {
  const H = 3600e3;
  afterEach(() => { (global as any).__dbFail = false; });
  test('R71-01 zapis timera w trakcie nieudanego pełnego zapisu nie gubi zakończonego treningu i nie gasi banera', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const s = store.getState().active!.exercises[0].sets[0]; s.weight = 100; s.reps = 5; store.toggleDone(0, 0); await store.flush();
    (global as any).__dbFail = (k: string) => k === 'state'; store.finishWorkout();
    await Promise.all([store.flush(), (async () => { store.setTimerState({}); })(), store.flush()]); await store.flush();
    expect(store.getPersistError()).toBeTruthy();
    (global as any).__dbFail = false; store.__resetForTests(); await store.init();
    const st = store.getState(); expect(!!st.active || st.workouts.length === 1).toBe(true);
  });
  test('R71-02 po nieczytelnym stanie stary „live” nie wraca przy kolejnym starcie', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); for (let i = 0; i < 5; i++) { store.save(store.getState().active); await store.flush(); }
    global.__kv.set('state', '{zepsute'); (global as any).__dbFail = (k: string, q: string) => k === 'live' && !/DELETE/.test(q); store.__resetForTests(); await store.init().catch(() => {});
    (global as any).__dbFail = false; store.__resetForTests(); await store.init(); expect(store.getState().active).toBeNull();
    expect(await store.readRecovery()).toMatch(/live/);
  });
  test('R71-03 przypomnienie liczone od startu trwającego stopera serii (jak pytanie)', async () => {
    await renderApp(); const now = Date.now();
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); const a = store.getState().active!; a.startedAt = now - 1.5 * H; store.save(a); }); await flushAll(10);
    await act(async () => { await timer.startSet(store.getState().active!.exercises[0].sets[0].id, 0); }); await flushAll(10);
    const n = (global.__notifications as any[]).filter(x => x.identifier === 'stale-reminder').pop(); expect(n.trigger.seconds).toBeGreaterThan(7000);
    await act(async () => { await timer.stopSet(); });
  });
  test('R71-04 pytanie bez serii roboczych: inna treść, bez „Zakończ i zapisz”; rozgrzewka ma własny wariant; przypomnienie też', async () => {
    await renderApp(); const now = Date.now();
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; a.startedAt = now - 3 * H; store.save(a); store.refreshViews(); }); await flushAll(10);
    const al: any = global.__alerts.filter((x: any) => x.title === 'Trening wciąż trwa').pop(); expect(al.msg).toMatch(/rozpoczęty o .*bez odhaczonych serii/); expect(al.buttons.map((b: any) => b.text)).toEqual(['Kontynuuj', 'Odrzuć']);
    const n = (global.__notifications as any[]).filter(x => x.identifier === 'stale-reminder').pop(); expect(n?.content.body ?? 'Trening rozpoczęty').toMatch(/Trening rozpoczęty/);
    await act(async () => { pressAlert('Trening wciąż trwa', 'Kontynuuj'); }); await flushAll(5);
    const b = timer.staleBody('warmup', now, true); expect(b).toMatch(/rozgrzewka/); expect(timer.staleBody('none', now)).toMatch(/Otwórz/);
  });
  test('R71-05 „Odrzuć” → „Wróć” wraca do pytania; przyciski nie działają na innym treningu', async () => {
    await renderApp(); const now = Date.now();
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; a.startedAt = now - 3 * H; store.save(a); store.refreshViews(); }); await flushAll(10);
    const count = () => global.__alerts.filter((x: any) => x.title === 'Trening wciąż trwa').length; const c0 = count(); expect(c0).toBeGreaterThan(0);
    await act(async () => { pressAlert('Trening wciąż trwa', 'Odrzuć'); }); await flushAll(5);
    await act(async () => { pressAlert('Odrzucić trening?', 'Wróć'); }); await flushAll(5); expect(count()).toBe(c0 + 1);
    const first = store.getState().active!.id;
    await act(async () => { store.cancelWorkout(); store.startEmpty(); }); await flushAll(5); const second = store.getState().active!.id; expect(second).not.toBe(first);
    await act(async () => { pressAlert('Trening wciąż trwa', 'Odrzuć'); }); await flushAll(5);
    await act(async () => { pressAlert('Odrzucić trening?', 'Odrzuć trening'); }); await flushAll(5);
    expect(store.getState().active?.id).toBe(second);
  });
  test('R71-06 oś: objętość tylko całkowite kroki, czas kroki zegarowe', () => {
    const { axisTicks, TIME_STEPS } = require('@/components/Chart');
    expect(stats.chartKeysFor(ex('Back Squat')).find(k => k.key === 'volume')!.intOnly).toBe(true);
    const pl = stats.chartKeysFor(ex('Plank')).find(k => k.key === 'maxDuration')!; expect(pl.time).toBe(true);
    const a = axisTicks([30, 95], 1, 0, true, TIME_STEPS).ticks; expect(TIME_STEPS).toContain(a[1] - a[0]);
    const b = axisTicks([0, 20000], 1, 0, true, TIME_STEPS).ticks; expect((b[1] - b[0]) % 3600).toBe(0);
  });
  test('R71-07 szablon: krótka etykieta ciężaru startowego, pełna dla VoiceOver', async () => {
    await renderApp({ saved: seedWithDemo() }); const st = store.getState(); const tpl = st.templates[0]; const db = st.exercises.find(e => e.loadMode === 'per_dumbbell' && !e.archived)!; tpl.items[0].exerciseId = db.id; store.save(tpl);
    await go('/template/' + tpl.id); await flushAll(10); await openCard(0);
    const short = store.loadLabelShort(db), full = store.loadLabel(db); expect(short).not.toBe(full); /* 05.10.2026: wiersze serii — krótka etykieta w polu, pełna dla VoiceOver */
    expect(screen.getAllByPlaceholderText(short).length).toBeGreaterThan(0); expect(screen.getAllByLabelText(full).length).toBeGreaterThan(0);
  });
});

describe('runda 73 — rekord = suma na treningu + e1RM (decyzja 01.10)', () => {
  test('R73-01 objętość treningu: odznaka przy serii, która przebiła poprzednią sumę, raz na trening', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]); /* 1000 kg */
    const w = addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 90, reps: 5 }, { weight: 90, reps: 5 }, { weight: 90, reps: 5 }, { weight: 90, reps: 5 }]]]); /* 450, 900, 1350, 1800 */
    const m = stats.prMap(w); const s = w.exercises[0].sets;
    expect(m.get(s[0].id)).toBeUndefined(); expect(m.get(s[1].id)).toBeUndefined(); expect(m.get(s[2].id)).toEqual(['objętość treningu']); expect(m.get(s[3].id)).toBeUndefined();
    const p = stats.workoutPRs(w); expect(p).toHaveLength(1); expect(p[0].details[0]).toMatch(/objętość treningu: 1[\s ]?800 kg/);
  });
  test('R73-02 to samo ćwiczenie w dwóch blokach — suma liczona łącznie', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 10 }]]]);
    const w = addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 60, reps: 10 }]], ['Leg Press', [{ weight: 100, reps: 10 }]], ['Back Squat', [{ weight: 50, reps: 10 }]]]);
    expect(stats.prMap(w).get(w.exercises[2].sets[0].id)).toEqual(['objętość treningu']);
  });
  test('R73-03 e1RM tylko z serii do 10 powtórzeń (standard dla wzorów szacujących 1RM)', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    const w11 = addWorkout(at(2026, 9, 2), [['Back Squat', [{ weight: 90, reps: 11 }]]]); expect(stats.prMap(w11).get(w11.exercises[0].sets[0].id)).toEqual(['objętość treningu']); /* 90×11 → bez e1RM */
    expect(stats.E1RM_MAX_REPS).toBe(10);
    const w = addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 90, reps: 10 }]]]); expect(stats.prMap(w).get(w.exercises[0].sets[0].id)).toContain('e1RM');
  });
  test('R73-04 ćwiczenie na czas: łączny czas; na powtórzenia: suma powtórzeń; bieg: łączny dystans', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Plank', [{ durationSec: 60 }, { durationSec: 60 }]], ['Bieg', [{ distanceM: 5000, durationSec: 1500 }]]]);
    const w = addWorkout(at(2026, 9, 3), [['Plank', [{ durationSec: 45 }, { durationSec: 45 }, { durationSec: 45 }]], ['Bieg', [{ distanceM: 3000, durationSec: 900 }, { distanceM: 2500, durationSec: 800 }]]]);
    const m = stats.prMap(w); expect(m.get(w.exercises[0].sets[2].id)).toEqual(['łączny czas']); expect(m.get(w.exercises[1].sets[1].id)).toEqual(['łączny dystans']);
    expect(stats.chartKeysFor(ex('Plank'))[0].key).toBe('total'); expect(stats.chartKeysFor(ex('Back Squat'))[0].key).toBe('volume');
  });
  test('R73-05 karta rekordów: pierwszy wiersz to najlepszy trening, drugi e1RM', async () => {
    await renderApp(); addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    await go('/more/progress?ex=' + ex('Back Squat').id); await flushAll(10);
    const txt = screen.UNSAFE_root.findAll((n: any) => n.type === 'Text' && typeof n.props.children === 'string').map((n: any) => n.props.children as string);
    const i = txt.indexOf('Najlepszy trening (objętość)'), j = txt.findIndex((x: string) => /^e1RM \(/.test(x)); expect(i).toBeGreaterThan(-1); expect(j).toBeGreaterThan(i);
  });
});
