/*
 * M5 S1, uzupełnienia właściciela z 22.10.2026 (docs/18): dzień limitu zużywa tylko trening NA ŻYWO dłuższy niż 20 minut (bez pauz); dni są ZAPISANE osobno w stanie
 * (`State.liveDays`), a nie liczone z historii — usunięcie treningu dnia nie zwraca (R-M5-1 zamknięte); migracja uzupełnia pole z historii; kopia zapasowa niesie dni;
 * cofnięty zegar, drugie urządzenie i ponowna instalacja mają opisany wynik; „limit tylko się luzuje”; błąd sklepu = unknown; expo-iap przypięty dokładnie.
 * Rodzaje (docs/20): logika, scenariusz, dane (migracja, kopia), niezmienniki.
 */
import fs from 'fs';
import path from 'path';
import { PAYWALL, ALWAYS_AVAILABLE, MIN_LIVE_MINUTES_FOR_DAY, qualifiesForDay, recordLiveDay, type LiveStart } from '@/lib/access';
import { buildBackup, parseBackup } from '@/lib/backup';
import * as store from '@/lib/store';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import * as ent from '@/lib/entitlement';
import { fresh, addWorkout } from './helpers';

const at = (y: number, m: number, d: number, h = 12, mi = 0) => Date.UTC(y, m - 1, d, h, mi);
const day = (d: number, h = 12): LiveStart => ({ startedAt: at(2026, 11, d, h), tzOffsetMin: 0 });
const MIN = 60e3;

describe('próg 20 minut: tylko trening na żywo dłuższy niż MIN_LIVE_MINUTES_FOR_DAY zużywa dzień', () => {
  test('stała jedna: 20; dokładnie 20 min nie zużywa, 20 min i 1 s tak; NaN i ujemne nie', () => {
    expect(MIN_LIVE_MINUTES_FOR_DAY).toBe(20); expect(qualifiesForDay(1200)).toBe(false); expect(qualifiesForDay(1201)).toBe(true); expect(qualifiesForDay(0)).toBe(false); expect(qualifiesForDay(NaN)).toBe(false); expect(qualifiesForDay(-5)).toBe(false);
  });
  test('recordLiveDay: jeden wpis na dzień z najpóźniejszym startem, kolejność rosnąca, bez mutacji; stare wpisy (> 400 dni) odpadają; śmieci pomijane', () => {
    const a = day(3, 8); const b = day(3, 19); const c = day(5); const before = JSON.stringify([a, b]);
    const r = recordLiveDay([a, c], b); expect(r).toEqual([{ startedAt: b.startedAt, tzOffsetMin: 0 }, { startedAt: c.startedAt, tzOffsetMin: 0 }]); expect(JSON.stringify([a, b])).toBe(before);
    expect(recordLiveDay([{ startedAt: at(2025, 1, 1) }], day(5))).toEqual([{ startedAt: day(5).startedAt, tzOffsetMin: 0 }]);
    expect(recordLiveDay([null as never, { startedAt: NaN }], { startedAt: NaN })).toEqual([]);
  });
});

describe('licznik z magazynu: ukończenie, wstecz, anulowany, trwający, zapis po 6 h, usunięcie', () => {
  const NOW = new Date(2026, 10, 15, 12).getTime(); /* czas lokalny telefonu, jak w aplikacji */
  const lt = (d: number, h = 12) => new Date(2026, 10, d, h).getTime();
  const blocks = (when: number): [string, Partial<import('@/lib/seed').WSet>[]][] => [['Back Squat', [{ weight: 100, reps: 5, done: true, completedAt: when }]]];
  const live = (when: number) => { const w = addWorkout(when, blocks(when), 'Live'); w.live = true; w.tzOffsetMin = -new Date(when).getTimezoneOffset(); store.recordLiveDayFor(w); return w; };
  const back = (when: number) => addWorkout(when, blocks(when), 'Past');
  const flush = async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); };
  async function boot(now = NOW) {
    jest.useFakeTimers({ now }); await fresh(); ent.resetEntitlementsForTests(); PAYWALL.ENABLED = true;
    setStoreAdapter(createFakeStore([])); await ent.initEntitlements(); await flush();
  }
  afterEach(() => { PAYWALL.ENABLED = false; ent.resetEntitlementsForTests(); resetStoreAdapterForTests(); jest.useRealTimers(); });
  /** Trening w toku z jedną odhaczoną serią, rozpoczęty `minutes` minut temu. */
  const startWithWork = (minutes = 30) => {
    expect(store.startEmpty()).toBe(true); const a = store.getState().active!; const tmp = addWorkout(Date.now(), blocks(Date.now()), 'tmp');
    a.exercises = tmp.exercises; store.getState().workouts = store.getState().workouts.filter(w => w.id !== tmp.id); a.startedAt = Date.now() - minutes * MIN; return a;
  };
  const used = () => ent.accessNow(Date.now()).decision.used;

  test('trening wstecz (bez znacznika live), także z dzisiejszą datą, nigdy nie zużywa dnia i nie jest blokowany', async () => {
    await boot(); for (let d = 1; d <= 6; d++) back(lt(d)); back(NOW - 3600e3); expect(ent.accessNow(NOW).decision).toMatchObject({ allowed: true, used: 0, remaining: 5 });
    for (let d = 1; d <= 5; d++) live(lt(d)); expect(used()).toBe(5); back(NOW - 1000); expect(used()).toBe(5); expect(store.getState().liveDays).toHaveLength(5);
  });
  test('anulowany trening (30 min) nie zużywa dnia: 4 dni wcześniej → dozwolony, zużyte 4', async () => {
    await boot(); for (const d of [1, 4, 8, 12]) live(lt(d));
    startWithWork(); store.cancelWorkout();
    expect(ent.accessNow(NOW).decision).toMatchObject({ allowed: true, used: 4, remaining: 1 });
    expect(ent.guardLiveStart('empty', NOW, () => { throw new Error('nie powinno otworzyć ekranu zakupu'); })).toBe(true);
  });
  test('trwający trening nie jest dniem ukończonym; strażnik wpuszcza (blokuje „trening w toku”, nie limit)', async () => {
    await boot(); for (const d of [1, 4, 8, 12]) live(lt(d));
    startWithWork(); const opened: string[] = [];
    expect(used()).toBe(4); expect(ent.liveStarts()).toHaveLength(4);
    expect(ent.guardLiveStart('template', NOW, h => opened.push(h))).toBe(true); expect(opened).toEqual([]);
  });
  test('po ukończeniu („Zakończ”, 30 min) dzień się liczy; kolejny trening tego samego dnia przechodzi mimo limitu, następnego dnia — nie', async () => {
    await boot(); for (const d of [1, 4, 8, 12]) live(lt(d));
    startWithWork(30); expect(store.finishWorkout()?.live).toBe(true);
    expect(ent.accessNow(NOW).decision).toMatchObject({ allowed: true, used: 5, remaining: 0 });
    expect(ent.guardLiveStart('empty', NOW, () => { throw new Error('ekran zakupu'); })).toBe(true);
    jest.setSystemTime(lt(16, 9)); const opened: string[] = [];
    expect(ent.guardLiveStart('empty', Date.now(), h => opened.push(h))).toBe(false); expect(opened).toEqual(['/paywall?reason=limit']);
  });
  test('próg 20 min na żywo: 19 min i dokładnie 20 min nie zużywają dnia, 21 min tak; pauzy odejmowane (25 min z pauzą 10 min = 15 min → nie); krótkie zostają w historii', async () => {
    await boot(); for (const m of [19, 20]) { startWithWork(m); store.finishWorkout(); expect(used()).toBe(0); }
    const a = startWithWork(25); a.pauses = [[Date.now() - 20 * MIN, Date.now() - 10 * MIN]]; store.finishWorkout(); expect(used()).toBe(0);
    startWithWork(21); store.finishWorkout(); expect(used()).toBe(1);
    expect(store.getState().workouts.filter(w => w.live)).toHaveLength(4);
  });
  test('zapis po 6 h bez aktywności (autoFinishStale) liczy się jak ukończony, jeśli trwał > 20 min', async () => {
    await boot(); for (const d of [1, 4, 8, 12]) live(lt(d));
    const a = startWithWork(); a.startedAt = NOW - 40 * MIN; a.exercises[0].sets[0].completedAt = NOW - 10 * MIN; jest.setSystemTime(NOW + 7 * 3600e3);
    expect(store.autoFinishStale(Date.now())).not.toBeNull(); expect(used()).toBe(5);
  });
  test('R-M5-1 ZAMKNIĘTE decyzją (22.10.2026): usunięcie treningu z historii NIE zwraca dnia — dni są zapisane osobno', async () => {
    await boot(); const ids = [1, 4, 8, 12, 15].map(d => live(lt(d)).id); expect(used()).toBe(5);
    store.deleteWorkout(ids[0]); expect(used()).toBe(5); for (const id of ids) store.deleteWorkout(id); expect(store.getState().workouts).toHaveLength(0); expect(used()).toBe(5);
    jest.setSystemTime(lt(16, 9)); expect(ent.guardLiveStart('empty', Date.now(), () => {})).toBe(false);
  });
  test('edycja zakończonego treningu (czas, data) nie zmienia zapisanych dni', async () => {
    await boot(); const w = live(lt(3)); const before = JSON.stringify(store.getState().liveDays);
    w.finishedAt = w.startedAt + 5 * MIN; w.startedAt -= 3 * 86400e3; expect(JSON.stringify(store.getState().liveDays)).toBe(before);
  });

  describe('migracja: dni z historii (dane poprzedniej wersji, bez pola liveDays)', () => {
    /** Stan „sprzed M5 S1”: historia z treningami na żywo (różne długości, poprzedni miesiąc, wstecz), bez State.liveDays. */
    async function legacy() {
      await boot(); live(lt(2)); live(lt(2, 19)); live(lt(9)); const sh = live(lt(11)); sh.finishedAt = sh.startedAt + 15 * MIN; back(lt(12)); live(new Date(2026, 9, 28, 12).getTime());
      const raw = JSON.parse(JSON.stringify(store.getState())); delete raw.liveDays; return raw;
    }
    test('brak pola → dni BIEŻĄCEGO miesiąca z treningów na żywo > 20 min (2 i 9; nie krótki 11, nie wstecz 12, nie październik)', async () => {
      const m = store.migrate(await legacy()); expect(m.liveDays!.map(d => new Date(d.startedAt).getDate())).toEqual([2, 9]);
    });
    test('idempotentna; poprawne pole zostaje (usunięty trening nie wraca do licznika po kolejnej migracji / restarcie)', async () => {
      const m1 = store.migrate(await legacy()); const m2 = store.migrate(JSON.parse(JSON.stringify(m1))); expect(m2.liveDays).toEqual(m1.liveDays);
      const kept = JSON.parse(JSON.stringify(m1)); kept.workouts = []; expect(store.migrate(kept).liveDays).toEqual(m1.liveDays);
    });
    test('uszkodzone pole (nie lista, wpis bez startu) → odtworzone z historii; pusta lista → brak pola', async () => {
      const raw = await legacy(); for (const bad of ['x', [{ startedAt: 'a' }], [null], {}]) { const r = JSON.parse(JSON.stringify(raw)); r.liveDays = bad; expect(store.migrate(r).liveDays).toHaveLength(2); }
      const e = JSON.parse(JSON.stringify(raw)); e.workouts = []; e.liveDays = []; expect('liveDays' in store.migrate(e)).toBe(false);
    });
    test('wydana kopia v0.20.0 (schemat 19, fixture) migruje bez utraty treningów; wpisy dni poprawne', () => {
      const f = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/released/state-v0.20.0-b1018-schema19.json'), 'utf8')); const st = f.state ?? f;
      const m = store.migrate(JSON.parse(JSON.stringify(st))); expect(m.workouts.length).toBe(st.workouts.length); for (const d of m.liveDays ?? []) expect(Number.isFinite(d.startedAt)).toBe(true);
    });
    test('wczytanie przez start aplikacji: zapis bez pola → pole uzupełnione', async () => {
      const raw = await legacy(); await fresh(raw); expect(store.getState().liveDays!.length).toBe(2);
    });
  });

  describe('kopia zapasowa, drugie urządzenie, ponowna instalacja, cofnięty zegar (wyniki opisane w testach)', () => {
    test('kopia zawiera zapisane dni; przywrócenie niesie dni z kopii, także gdy treningi usunięto', async () => {
      await boot(); for (const d of [1, 4, 8, 12, 15]) live(lt(d)); const env = JSON.parse(JSON.stringify(buildBackup()));
      expect(env.state.liveDays).toHaveLength(5); for (const w of [...store.getState().workouts]) store.deleteWorkout(w.id);
      expect(parseBackup(JSON.stringify(env)).liveDays).toHaveLength(5);
    });
    test('drugie urządzenie / starsza kopia: dni = dni z kopii (przywrócenie starszej kopii cofa do jej dni — świadomie, brak konta i synchronizacji)', async () => {
      await boot(); for (const d of [1, 4]) live(lt(d)); const older = JSON.parse(JSON.stringify(buildBackup())); for (const d of [8, 12, 15]) live(lt(d)); expect(used()).toBe(5);
      expect(parseBackup(JSON.stringify(older)).liveDays).toHaveLength(2); expect(parseBackup(JSON.stringify(JSON.parse(JSON.stringify(buildBackup())))).liveDays).toHaveLength(5);
    });
    test('ponowna instalacja bez kopii: licznik zaczyna od zera (dni żyją tylko na telefonie) — R-M5-5, brzegowy, bez naprawy', async () => {
      await boot(); for (const d of [1, 4, 8, 12, 15]) live(lt(d)); expect(used()).toBe(5);
      await fresh(); ent.resetEntitlementsForTests(); PAYWALL.ENABLED = true; setStoreAdapter(createFakeStore([])); await ent.initEntitlements(); await flush(); expect(used()).toBe(0);
    });
    test('cofnięty zegar: na dzień bez wpisu w tym samym miesiącu nadal blokada; na dzień z wpisem — wolno; poprzedni miesiąc ma własny licznik', async () => {
      await boot(); for (const d of [1, 4, 8, 12, 15]) live(lt(d));
      jest.setSystemTime(lt(16, 9)); expect(ent.guardLiveStart('empty', Date.now(), () => {})).toBe(false);
      jest.setSystemTime(lt(10, 9)); expect(ent.guardLiveStart('empty', Date.now(), () => {})).toBe(false);
      jest.setSystemTime(lt(8, 9)); expect(ent.guardLiveStart('empty', Date.now(), () => {})).toBe(true);
      jest.setSystemTime(new Date(2026, 9, 20, 9).getTime()); expect(ent.accessNow(Date.now()).decision).toMatchObject({ allowed: true, used: 0 });
    });
  });
});

describe('limit tylko się luzuje (wzorzec portfela): stała limitu i ALWAYS_AVAILABLE względem zapisu z poprzednich wydań', () => {
  const rec = JSON.parse(fs.readFileSync(path.join(__dirname, 'limity-wydan.json'), 'utf8')) as { wydania: { wydanie: string; FREE_TRAINING_DAYS_PER_MONTH: number; ALWAYS_AVAILABLE: string[] }[] };
  test('liczba dni darmowych nie maleje względem żadnego zapisanego wydania; lista „zawsze dostępne” zawiera wszystko, co zawierała', () => {
    expect(rec.wydania.length).toBeGreaterThan(0);
    for (const w of rec.wydania) { expect([w.wydanie, PAYWALL.FREE_TRAINING_DAYS_PER_MONTH >= w.FREE_TRAINING_DAYS_PER_MONTH]).toEqual([w.wydanie, true]); for (const f of w.ALWAYS_AVAILABLE) expect([w.wydanie, f, (ALWAYS_AVAILABLE as readonly string[]).includes(f)]).toEqual([w.wydanie, f, true]); }
  });
  test('zapis najnowszego wydania zgadza się z kodem (zmiana limitu = nowy wpis w tests/limity-wydan.json w tym samym commicie)', () => {
    const last = rec.wydania[rec.wydania.length - 1]; expect(last.FREE_TRAINING_DAYS_PER_MONTH).toBe(PAYWALL.FREE_TRAINING_DAYS_PER_MONTH); expect([...last.ALWAYS_AVAILABLE].sort()).toEqual([...ALWAYS_AVAILABLE].sort());
  });
});

describe('błąd odczytu sklepu to „nieznany”, nigdy „darmowy” (docs/30 3.3 pułapka 2)', () => {
  const NOWL = new Date(2026, 10, 15, 12).getTime();
  afterEach(() => { PAYWALL.ENABLED = false; ent.resetEntitlementsForTests(); resetStoreAdapterForTests(); jest.useRealTimers(); });
  test('sklep rzuca przy odczycie: state = unknown (nie free); z zapamiętanym pełnym dostępem poziom full, bez zapamiętanego — free po cichu; dopiero odpowiedź „brak uprawnień” daje free', async () => {
    jest.useFakeTimers({ now: NOWL }); await fresh(); ent.resetEntitlementsForTests(); PAYWALL.ENABLED = true;
    const f = createFakeStore(null); setStoreAdapter(f); await ent.initEntitlements(); for (let i = 0; i < 6; i++) await Promise.resolve();
    expect(f.calls.currentEntitlements).toBeGreaterThan(0); expect(ent.accessNow(NOWL)).toMatchObject({ state: 'unknown', level: 'free', silent: true });
    ent.resetEntitlementsForTests(); PAYWALL.ENABLED = true; global.__kv.set('access', JSON.stringify({ level: 'full', expiresAt: NOWL + 86400e3 })); const g = createFakeStore(null); setStoreAdapter(g); await ent.initEntitlements(); for (let i = 0; i < 6; i++) await Promise.resolve();
    expect(ent.accessNow(NOWL)).toMatchObject({ state: 'unknown', level: 'full', silent: false });
    g.setEntitlements([]); await ent.refreshEntitlements(); expect(ent.accessNow(NOWL).state).toBe('free');
    g.offline = true; await ent.refreshEntitlements(); expect(ent.accessNow(NOWL).state).toBe('unknown');
  });
});

describe('expo-iap przypięty dokładnie (bez ^ i ~)', () => {
  test('package.json: "expo-iap": "5.8.1" (wydana 26.09.2026 wg rejestru npm); zainstalowana wersja zgodna', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')); expect(pkg.dependencies['expo-iap']).toMatch(/^\d+\.\d+\.\d+$/); expect(pkg.dependencies['expo-iap']).toBe('5.8.1');
    expect(JSON.parse(fs.readFileSync(path.join(__dirname, '../node_modules/expo-iap/package.json'), 'utf8')).version).toBe(pkg.dependencies['expo-iap']);
  });
});
