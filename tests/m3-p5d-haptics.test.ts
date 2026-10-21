/*
 * M3 p5d — ZM-07: dwa przełączniki „Dźwięk na koniec przerwy” (Settings.sound) i „Wibracje” (Settings.haptics, pole OPCJONALNE).
 * Decyzja właściciela (STOP przed p5d, 21.10.2026, docs/18): brak `haptics` = wibracje idą za `sound` (po aktualizacji nic się nie zmienia, dopóki
 * użytkownik nie przełączy); BEZ podnoszenia wersji schematu i bez przepisywania danych; nowa → stara → nowa (starsza wersja trzyma pole jako
 * nieznane — lib/state/migrate.ts, wzór jak `voice`).
 * Rodzaje (docs/20): logika czysta (macierz sound × haptics), dane (migracja, kopia 0.20, restart, nowa→stara→nowa), kopia zapasowa, zachowanie
 * (timer: dźwięk tylko od `sound`, wibracja tylko od `haptics`; tablica ± i ostrzegawcza; lista przeciągana). Ekran: tests/m3-p5d-settings-ui.test.tsx.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { blankTimer, SCHEMA_VERSION } from '@/lib/seed';
import { hapticsEnabled, hapticsOn, playHaptic } from '@/lib/haptics';
import { dragHaptic } from '@/components/DragList';
import { fresh, saved } from './helpers';

const S = () => store.getState().settings;
const calls = () => global.__haptics as string[];
const FX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'released', 'state-v0.20.0-b1018-schema19.json'), 'utf8'));
const OLD = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'p5d-zapis-starej-wersji.json'), 'utf8')) as { cases: Record<string, { sound: boolean; haptics: boolean; settings: Record<string, unknown> }> };
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
/** Start aplikacji na zapisie 0.20 z poprawką ustawień (state i cfg), jak po aktualizacji. */
const boot = async (patch: Record<string, unknown> = {}, drop: string[] = []) => {
  const st = clone(FX.state); const cfg = clone(FX.cfg); Object.assign(st.settings, patch); Object.assign(cfg.data.settings, patch);
  for (const k of drop) { delete st.settings[k]; delete cfg.data.settings[k]; }
  await fresh(); global.__kv.clear(); global.__kv.set('state', JSON.stringify(st)); global.__kv.set('cfg', JSON.stringify(cfg));
  store.__resetForTests(); await store.init(); return store.getState();
};

describe('hapticsEnabled (czysta): brak `haptics` → jak `sound`; zapisana wartość wygrywa', () => {
  const cases: [boolean | undefined, boolean | undefined, boolean][] = [
    [true, undefined, true], [false, undefined, false], [undefined, undefined, true], /* sound też brakuje (stan częściowy) = domyślnie włączone */
    [true, true, true], [true, false, false], [false, true, true], [false, false, false],
  ];
  test.each(cases)('sound=%s haptics=%s → %s', (sound, haptics, want) => {
    expect(hapticsEnabled({ ...(sound === undefined ? {} : { sound }), ...(haptics === undefined ? {} : { haptics }) })).toBe(want);
  });
  test('wartość spoza boolean traktowana jak brak pola (zła wartość nie wyłącza wibracji ani nie włącza ich wbrew dźwiękowi)', () => {
    for (const bad of ['tak', 1, 0, null, {}]) {
      expect([bad, hapticsEnabled({ sound: true, haptics: bad as never })]).toEqual([bad, true]); expect([bad, hapticsEnabled({ sound: false, haptics: bad as never })]).toEqual([bad, false]);
    }
  });
});

describe('dane: migracja bez zmiany wersji schematu', () => {
  test('dane 0.20 (bez pola): pole nie powstaje, wersja schematu i zapis bez zmian, wibracje za dźwiękiem w obie strony', async () => {
    const st = await boot();
    expect('haptics' in st.settings).toBe(false); expect(st.schemaVersion).toBe(SCHEMA_VERSION); expect(FX.schemaVersion).toBe(SCHEMA_VERSION); expect(hapticsOn()).toBe(true);
    await store.flush(); expect('haptics' in saved().settings).toBe(false); /* nic nie dopisane po cichu */
    expect([...global.__kv.keys()].filter(k => k.startsWith('premigrate_'))).toEqual([]); /* bez migracji schematu = bez kopii sprzed migracji */
    const off = await boot({ sound: false }); expect('haptics' in off.settings).toBe(false); expect(hapticsOn()).toBe(false);
  });
  test('brak pola → wartość z sound (macierz); pole zapisane → zostaje, także gdy przeczy dźwiękowi', async () => {
    for (const [sound, haptics, want] of [[true, undefined, true], [false, undefined, false], [true, false, false], [false, true, true], [true, true, true], [false, false, false]] as const) {
      await boot({ sound }, haptics === undefined ? ['haptics'] : []); if (haptics !== undefined) { S().haptics = haptics; store.saveCfg(); await store.flush(); await fresh(saved()); }
      expect([sound, haptics, S().haptics, hapticsOn()]).toEqual([sound, haptics, haptics, want]);
    }
  });
  test('zła wartość pola jest odrzucana (= brak → za dźwiękiem); migracja jest idempotentna', async () => {
    for (const bad of ['tak', 1, 0, null, {}, []]) {
      for (const sound of [true, false]) { await boot({ sound, haptics: bad }); expect([bad, 'haptics' in S(), hapticsOn()]).toEqual([bad, false, sound]); }
    }
    await boot({ sound: true, haptics: false }); await store.flush(); const once = clone(saved().settings); await fresh(saved()); await store.flush(); expect(saved().settings).toEqual(once);
  });
  test('nieznane pola ustawień (z nowszej wersji) nadal przechodzą; `haptics` nie jest wśród nich (jest znane)', async () => {
    await boot({ haptics: false, przyszlePole: { a: 1 } }); await store.flush();
    expect((S() as unknown as Record<string, unknown>).przyszlePole).toEqual({ a: 1 }); expect(S().haptics).toBe(false); expect(saved().settings.haptics).toBe(false);
  });
  test('restart: wybór użytkownika trwały (zapis przez saveCfg), a drugi start nie zmienia stanu', async () => {
    await boot(); S().haptics = false; store.saveCfg(); await store.flush(); const a = clone(saved().settings);
    await fresh(saved()); expect(S().haptics).toBe(false); expect(hapticsOn()).toBe(false); await store.flush(); expect(saved().settings).toEqual(a);
  });
});

describe('dane: nowa → stara → nowa (starsza wersja zachowuje pole jako nieznane)', () => {
  /* Fixture: ustawienia zapisane przez KOD SPRZED p5d (70dc56a) po wczytaniu zapisu 0.20 z dopisanym `haptics` — tests/fixtures/p5d-zapis-starej-wersji.json */
  test.each(Object.entries(OLD.cases))('%s: pole przeżyło przejście przez starą wersję i działa po powrocie, dźwięk bez zmian', async (_n, c) => {
    expect(c.settings.haptics).toBe(c.haptics); /* fixture rzeczywiście zawiera pole zachowane przez starą wersję */
    const st = clone(FX.state); st.settings = c.settings; await fresh(st);
    expect(S().haptics).toBe(c.haptics); expect(S().sound).toBe(c.sound); expect(hapticsOn()).toBe(c.haptics);
    expect(store.getState().schemaVersion).toBe(SCHEMA_VERSION);
  });
  test('stara wersja zapisuje wybór nowej: nowa → (kopia stanu) → nowa daje to samo; zmiana dźwięku w starej wersji nie rusza zapisanych wibracji', async () => {
    await boot(); S().haptics = false; store.saveCfg(); await store.flush(); const mid = clone(saved()); (mid.settings as { sound: boolean }).sound = false; /* stara wersja: użytkownik wyłączył dźwięk */
    await fresh(mid); expect([S().sound, S().haptics, hapticsOn()]).toEqual([false, false, false]);
    const mid2 = clone(saved()); (mid2.settings as { sound: boolean }).sound = true; (mid2.settings as { haptics?: boolean }).haptics = true; await fresh(mid2); expect([S().sound, S().haptics, hapticsOn()]).toEqual([true, true, true]);
  });
});

describe('kopia zapasowa i import przenoszą pole', () => {
  const { buildBackup, parseBackup } = require('@/lib/backup');
  test('eksport → import zachowuje `haptics` (true i false); kopia bez pola zostaje bez pola (= za dźwiękiem); zła wartość znika', async () => {
    for (const v of [true, false]) { await boot(); S().haptics = v; store.saveCfg(); await store.flush(); const r = parseBackup(JSON.stringify(buildBackup())); expect(r.settings.haptics).toBe(v); }
    await boot(); store.saveCfg(); await store.flush(); const b = buildBackup(); expect('haptics' in parseBackup(JSON.stringify(b)).settings).toBe(false);
    const bad = clone(b); bad.state.settings.haptics = 'głośno'; expect('haptics' in parseBackup(JSON.stringify(bad)).settings).toBe(false);
    const r2 = parseBackup(JSON.stringify({ ...b, state: { ...b.state, settings: { ...b.state.settings, haptics: false } } })); expect(r2.settings.haptics).toBe(false);
    expect(parseBackup(JSON.stringify({ ...b, state: r2 })).settings.haptics).toBe(false); /* idempotentne */
  });
});

describe('zachowanie: dźwięk tylko od `sound`, wibracje tylko od `haptics` (z zastępstwem `sound`)', () => {
  const NOW = new Date(2026, 9, 21, 10, 0, 0).getTime();
  type N = { identifier: string; content: { sound: boolean } };
  beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); store.setTimerState(blankTimer()); await timer.stop(); await timer.stopSet(); await timer.restore(); global.__notifications.length = 0; calls().length = 0; });
  afterEach(() => { jest.useRealTimers(); });
  const combos: [boolean, boolean | undefined][] = [[true, undefined], [false, undefined], [true, true], [true, false], [false, true], [false, false]];

  test.each(combos)('koniec przerwy (sound=%s, haptics=%s): wibracja wg haptics-z-zastępstwem, dźwięk powiadomienia wg sound', async (sound, haptics) => {
    S().sound = sound; if (haptics !== undefined) S().haptics = haptics;
    await timer.start(30); jest.setSystemTime(NOW + 31e3); timer.tick();
    expect(timer.T.alarmed).toBe(true); expect(calls()).toEqual(haptics ?? sound ? ['notification:success'] : []);
    expect((global.__notifications as N[]).find(n => n.identifier === 'rest-end')!.content.sound).toBe(sound);
  });
  test.each(combos)('koniec stopera serii (sound=%s, haptics=%s): wibracja wg haptics-z-zastępstwem', async (sound, haptics) => {
    S().sound = sound; if (haptics !== undefined) S().haptics = haptics;
    await timer.startSet('s1', 10); jest.setSystemTime(NOW + 11e3); timer.tick();
    expect(timer.S.alarmed).toBe(true); expect(calls()).toEqual(haptics ?? sound ? ['notification:success'] : []);
  });
  test('powiadomienie o końcu serii: dźwięk wg sound, niezależnie od haptics (ostatnio zaplanowane wygrywa)', async () => {
    S().sound = true; S().haptics = false; await timer.startSet('s1', 60); await timer.refreshScheduled();
    expect((global.__notifications as N[]).filter(n => n.identifier === 'set-end').map(n => n.content.sound).slice(-1)).toEqual([true]);
    S().sound = false; S().haptics = true; global.__notifications.length = 0; await timer.refreshScheduled();
    expect((global.__notifications as N[]).filter(n => n.identifier === 'set-end').map(n => n.content.sound).slice(-1)).toEqual([false]);
  });
  test.each(combos)('tablica „teraz” ± i ostrzegawcza (sound=%s, haptics=%s): wg haptics-z-zastępstwem', (sound, haptics) => {
    S().sound = sound; if (haptics !== undefined) S().haptics = haptics; const want = haptics ?? sound;
    playHaptic('step'); playHaptic('missing'); expect(calls()).toEqual(want ? ['selection', 'notification:warning'] : []);
  });
  test.each(combos)('lista przeciągana (sound=%s, haptics=%s): chwyt i mijany wiersz wg haptics-z-zastępstwem', (sound, haptics) => {
    S().sound = sound; if (haptics !== undefined) S().haptics = haptics; const want = haptics ?? sound;
    dragHaptic('pick'); dragHaptic('tick'); expect(calls()).toEqual(want ? ['impact:light', 'selection'] : []);
  });
  test('przełączenie w trakcie jest czytane przy każdym zdarzeniu (bez zapamiętania)', () => {
    S().sound = true; S().haptics = false; playHaptic('step'); S().haptics = true; playHaptic('step'); S().haptics = false; playHaptic('step'); expect(calls()).toEqual(['selection']);
  });
});
