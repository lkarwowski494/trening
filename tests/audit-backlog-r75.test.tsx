/* Runda 75 — backlog: podpowiedź progresji (T-017), pasek postępu (T-016), kopia automatyczna (T-012), przypomnienie o wadze (T-013). */
import * as store from '@/lib/store';
import * as units from '@/lib/units';
import * as timer from '@/lib/timer';
import { fresh, ex, addWorkout, set } from './helpers';
import { renderApp, flushAll, act, screen } from './app';

jest.setTimeout(30000);
const at = (d: number) => new Date(2026, 8, d, 18).getTime();
afterEach(async () => { units.applyUnit('kg'); jest.restoreAllMocks(); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

describe('T-017 progressionFor', () => {
  const W = (o: object) => set({ done: true, ...o });
  test('sztanga: wszystkie serie robocze na górze zakresu → +2,5 kg; jedna poniżej, brak zakresu, wyłączone w Ustawieniach → brak', async () => {
    await fresh(); const bs = ex('Back Squat');
    expect(store.progressionFor(bs, 10, [W({ weight: 100, reps: 10 }), W({ weight: 97.5, reps: 12 }), W({ weight: 60, reps: 20, kind: 'drop' }), W({ weight: 60, reps: 2, kind: 'warmup', warmup: true })])).toEqual({ kind: 'load', kg: 102.5 });
    expect(store.progressionFor(bs, 10, [W({ weight: 100, reps: 10 }), W({ weight: 100, reps: 9 })])).toBeNull();
    expect(store.progressionFor(bs, null, [W({ weight: 100, reps: 10 })])).toBeNull();
    expect(store.progressionFor(bs, 10, [])).toBeNull(); expect(store.progressionFor(bs, 10, null)).toBeNull();
    store.getState().settings.progressHint = false; expect(store.progressionFor(bs, 10, [W({ weight: 100, reps: 10 })])).toBeNull();
  });
  test('hantle +1 kg na hantel; w lb kroki 5 lb / 2,5 lb po wyświetlanych funtach', async () => {
    await fresh();
    expect(store.progressionFor(ex('Bench Press (hantle)'), 10, [W({ weight: 20, reps: 10 })])).toEqual({ kind: 'load', kg: 21 });
    units.applyUnit('lb');
    const p = store.progressionFor(ex('Back Squat'), 5, [W({ weight: units.wIn(225), reps: 5 })]) as { kg: number }; expect(units.wOut(p.kg)).toBe(230);
    const d = store.progressionFor(ex('Bench Press (hantle)'), 10, [W({ weight: units.wIn(50), reps: 10 })]) as { kg: number }; expect(units.wOut(d.kg)).toBe(52.5);
  });
  test('masa ciała: bez obciążenia +1 powt.; asysta −2,5 kg (najwyżej do 0); dociążenie +2,5 kg; seria z gumą — brak', async () => {
    await fresh(); const pu = ex('Pull Up'); const band = store.getState().bands[0].id;
    expect(store.progressionFor(pu, 8, [W({ addKg: 0, reps: 8 }), W({ addKg: '', reps: 9 })])).toEqual({ kind: 'reps', reps: 9 });
    expect(store.progressionFor(pu, 8, [W({ addKg: -15, reps: 8 })])).toEqual({ kind: 'load', kg: -12.5 });
    expect(store.progressionFor(pu, 8, [W({ addKg: -1, reps: 8 })])).toEqual({ kind: 'load', kg: 0 });
    units.applyUnit('lb'); expect(store.progressionFor(pu, 8, [W({ addKg: -2.3, reps: 8 })])).toEqual({ kind: 'load', kg: 0 }); /* 5,1 lb asysty − 5 lb */ units.applyUnit('kg');
    expect(store.progressionFor(pu, 8, [W({ addKg: 10, reps: 8 })])).toEqual({ kind: 'load', kg: 12.5 });
    expect(store.progressionFor(pu, 8, [W({ addKg: -15, reps: 8, bandId: band })])).toBeNull();
  });
  test('ćwiczenia na czas / dystans — brak podpowiedzi', async () => {
    await fresh(); expect(store.progressionFor(ex('Plank'), 10, [W({ durationSec: 60, reps: 10 })])).toBeNull();
  });
  test('ekran treningu: „↑ spróbuj 102,5 kg” w nagłówku ćwiczenia; po wyłączeniu — znika', async () => {
    await fresh(); addWorkout(at(1), [['Back Squat', [{ weight: 100, reps: 10 }, { weight: 100, reps: 10 }]]]);
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; a.exercises[0].repMin = 8; a.exercises[0].repMax = 10; store.save(a);
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(20);
    expect(screen.queryAllByText(/↑ spróbuj 102,5 kg/).length).toBe(1);
    await act(async () => { store.getState().settings.progressHint = false; store.save(); }); await flushAll(20);
    expect(screen.queryAllByText(/↑ spróbuj/).length).toBe(0);
  });
});

describe('T-016 pasek postępu sesji', () => {
  test('„Postęp treningu: d z n serii” liczy serie robocze (bez rozgrzewek — audyt 0.10, workCount) i rośnie po odhaczeniu', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0); store.addSet(0);
    const a = store.getState().active!; a.exercises[0].sets[0].kind = 'warmup'; a.exercises[0].sets[0].warmup = true; store.save(a);
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(20);
    expect(screen.getByLabelText('Postęp treningu: 0 z 2 serii')).toBeTruthy();
    await act(async () => { store.toggleDone(0, 0); }); await flushAll(20);
    expect(screen.getByLabelText('Postęp treningu: 0 z 2 serii')).toBeTruthy(); /* rozgrzewka nie liczy się */
    await act(async () => { store.toggleDone(0, 1); }); await flushAll(20);
    expect(screen.getByLabelText('Postęp treningu: 1 z 2 serii')).toBeTruthy();
  });
});

describe('T-012 kopia automatyczna', () => {
  const fsMock = (files: string[]) => { const FS = require('expo-file-system/legacy'); (FS.makeDirectoryAsync as jest.Mock).mockClear(); (FS.readDirectoryAsync as jest.Mock).mockImplementation(async () => files); (FS.deleteAsync as jest.Mock).mockClear(); (FS.writeAsStringAsync as jest.Mock).mockClear(); return FS; };
  test('zapis w Backup/ z datą i godziną; zostaje 10 najnowszych; wyłączona — nic nie zapisuje', async () => {
    await fresh(); const backup = require('@/lib/backup');
    const old = Array.from({ length: 12 }, (_, i) => `trening-2026-09-${String(10 + i).padStart(2, '0')}-080000.json`);
    const FS = fsMock([...old, 'inny-plik.txt']);
    const path = await backup.autoBackup();
    expect(path).toMatch(/^file:\/\/\/doc\/Backup\/trening-\d{4}-\d{2}-\d{2}-\d{6}\.json$/); expect(FS.makeDirectoryAsync).toHaveBeenCalled();
    const [p, txt] = (FS.writeAsStringAsync as jest.Mock).mock.calls[0]; expect(p).toBe(path); expect(JSON.parse(txt).format).toBe('trening-backup');
    expect((FS.deleteAsync as jest.Mock).mock.calls.map((c: any) => c[0])).toEqual([`file:///doc/Backup/${old[1]}`, `file:///doc/Backup/${old[0]}`]);
    store.getState().settings.autoBackup = false; (FS.writeAsStringAsync as jest.Mock).mockClear(); expect(await backup.autoBackup()).toBeNull(); expect(FS.writeAsStringAsync).not.toHaveBeenCalled();
  });
  test('błąd zapisu nie wywraca zakończenia treningu (wynik null)', async () => {
    await fresh(); const backup = require('@/lib/backup'); const FS = fsMock([]); (FS.writeAsStringAsync as jest.Mock).mockImplementationOnce(async () => { throw new Error('dysk pełny'); });
    expect(await backup.autoBackup()).toBeNull();
  });
  test('zakończenie treningu na ekranie zapisuje kopię (jedno miejsce: onWorkoutSaved)', async () => {
    const FS = fsMock([]); await renderApp(); const { pressAlert } = require('./helpers');
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; Object.assign(a.exercises[0].sets[0], { weight: 100, reps: 5 }); store.save(a); store.toggleDone(0, 0); }); await flushAll(20);
    (FS.writeAsStringAsync as jest.Mock).mockClear();
    const { tap } = require('./app'); await tap(screen.getAllByText('Zakończ trening i zapisz')[0]); pressAlert('Zakończyć trening?', 'Zakończ'); await flushAll(600);
    expect((FS.writeAsStringAsync as jest.Mock).mock.calls.some((c: any) => /\/Backup\/trening-/.test(c[0]))).toBe(true);
  });
});

describe('T-013 przypomnienie o wadze — usunięte 05.10.2026 razem z porannym wpisem', () => {
  test('nawet przy włączonym ustawieniu (dane starszej wersji) nie powstaje; odświeżenie po zmianie języka też nie', async () => {
    await fresh(); global.__notifications.length = 0; store.getState().settings.weighReminder = true;
    await timer.scheduleWeighReminder(); await timer.refreshScheduled();
    expect(global.__notifications.some((n: any) => n.identifier === 'weigh-reminder')).toBe(false);
  });
});

describe('audyt T14 (runda 75): baza poza Dokumentami (Dokumenty widać w Plikach)', () => {
  test('dbDirectory: Documents/SQLite → Library/SQLite; bez ścieżki domyślnej — domyślna expo-sqlite', () => {
    expect(store.dbDirectory('/var/x/Documents/SQLite')).toBe('/var/x/Library/SQLite'); expect(store.dbDirectory('/var/x/Documents/SQLite/')).toBe('/var/x/Library/SQLite');
    expect(store.dbDirectory(undefined)).toBeUndefined(); expect(store.dbDirectory(null)).toBeUndefined(); expect(store.dbDirectory('/inne/miejsce')).toBeUndefined();
  });
  test('copyKv: wszystkie wiersze w jednej transakcji; stara baza bez tabeli → 0; błąd w transakcji → wyjątek (stara zostaje, nowa bez „state” — ponowienie przy następnym starcie)', async () => {
    const mk = (rows: [string, string][] | null) => { const kv = new Map(rows ?? []); const log: string[] = [];
      return { kv, log, getFirstAsync: async (q: string) => (/sqlite_master/.test(q) ? (rows ? { name: 'kv' } : null) : null) as any,
        getAllAsync: async () => [...kv].map(([k, v]) => ({ k, v })) as any, runAsync: async (_q: string, k: unknown, v: unknown) => { log.push(String(k)); kv.set(String(k), String(v)); },
        withTransactionAsync: async (f: () => Promise<void>) => { const snap = new Map(kv); try { await f(); } catch (e) { kv.clear(); snap.forEach((v, k) => kv.set(k, v)); throw e; } }, closeAsync: async () => {} }; };
    const old = mk([['state', '{"a":1}'], ['live', '{"b":2}'], ['state_corrupt_1', 'x']]); const next = mk([]);
    expect(await store.copyKv(old, next)).toBe(3); expect([...next.kv.keys()].sort()).toEqual(['live', 'state', 'state_corrupt_1']); expect(next.kv.get('state')).toBe('{"a":1}');
    expect(await store.copyKv(mk(null), mk([]))).toBe(0);
    const bad = mk([]); bad.runAsync = async (_q: string, k: unknown) => { if (k === 'live') throw new Error('dysk pełny'); bad.kv.set(String(k), 'x'); };
    await expect(store.copyKv(old, bad)).rejects.toThrow('dysk pełny'); expect(bad.kv.has('state')).toBe(false);
  });

});

describe('audyt T14 — drobne', () => {
  test('kopia automatyczna nie kasuje pliku dorzuconego przez użytkownika do Backup/', async () => {
    await fresh(); const backup = require('@/lib/backup'); const FS = require('expo-file-system/legacy');
    const ours = Array.from({ length: 11 }, (_, i) => `trening-2026-09-${String(10 + i).padStart(2, '0')}-080000.json`);
    (FS.readDirectoryAsync as jest.Mock).mockImplementation(async () => [...ours, 'trening-backup-2026-10-02.json']); (FS.deleteAsync as jest.Mock).mockClear();
    await backup.autoBackup(); expect((FS.deleteAsync as jest.Mock).mock.calls.map((c: any) => c[0])).toEqual([`file:///doc/Backup/${ours[0]}`]);
    (FS.readDirectoryAsync as jest.Mock).mockImplementation(async () => []);
  });
  test('podpowiedź przy małej asyście: „↑ spróbuj bez asysty” zamiast „0 kg”', async () => {
    await fresh(); addWorkout(at(1), [['Pull Up', [{ addKg: -1, reps: 8 }]]]);
    store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); const a = store.getState().active!; a.exercises[0].repMin = 6; a.exercises[0].repMax = 8; store.save(a);
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(20);
    expect(screen.queryAllByText(/↑ spróbuj bez asysty/).length).toBe(1); expect(screen.queryAllByText(/↑ spróbuj 0/).length).toBe(0);
  });
});

