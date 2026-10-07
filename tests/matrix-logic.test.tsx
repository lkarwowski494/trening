/* Macierz testów (polecenie właściciela 06.10.2026) — LOGIKA i EKRAN bez wcześniejszego testu (scripts/test-matrix.mjs --list).
 * Każda funkcja ma własny describe('<moduł>.<funkcja>') z zachowaniem i przypadkami brzegowymi (pusto, granice, złe dane, kg/lb, pl/en).
 * Ekrany: /more/language (każda pozycja listy) i /swap (każdy element arkusza: Anuluj, Propozycje, ↺ przywróć, Inny przyrząd, Inne ▾/▴,
 * filtry-etykiety, wyszukiwanie, Pokaż więcej, Przywróć „…”, Utwórz „…”, Nic nie pasuje, cel nieprawidłowy, edytor historii). */
import { Appearance } from 'react-native';
import { renderHook, act as hookAct } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as signing from '@/lib/signing';
import * as edit from '@/lib/edit';
import * as backup from '@/lib/backup';
import * as i18n from '@/lib/i18n';
import * as units from '@/lib/units';
import { capLabel, blankLoad, fillOpts, fillGym, equipById, presetEquipment, GYM_FILL, OPT_FILL } from '@/lib/equipment';
import { commitLocationName, canDeleteLocation, locationEdited, addLocation } from '@/lib/locations';
import { loadMult, defaultModules, blankTimer, libExercise, SCHEMA_VERSION, type WSet, type LocEquip } from '@/lib/seed';
import { parseSwapTarget } from '@/lib/swap';
import { applyTheme, useTheme, light, dark } from '@/lib/theme';
import { fresh, ex, addWorkout, set as mkSet, saved } from './helpers';
import { renderApp, flushAll, screen, go, tap, act, type } from './app';
import { userHome } from './locations-fixtures';

jest.setTimeout(60000);
afterEach(async () => {
  jest.restoreAllMocks();
  try { store.getState(); } catch { return; }
  await timer.stop(); await timer.stopSet();
});
afterAll(() => { i18n.applyLang('pl'); units.applyUnit('kg'); });

const FS = require('expo-file-system/legacy');
const SH = require('expo-sharing');
const DAY = 86400e3;
const H = Date.UTC(2026, 8, 10, 10);

/* ============================== backup ============================== */
describe('backup.exportBackup', () => {
  test('zapisuje kopertę z bieżącym stanem do cache i udostępnia jako JSON (tytuł w języku interfejsu)', async () => {
    await fresh(); addWorkout(H, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]]]);
    FS.writeAsStringAsync.mockClear(); SH.shareAsync.mockClear();
    await backup.exportBackup();
    expect(FS.writeAsStringAsync).toHaveBeenCalledTimes(1);
    const [path, body] = FS.writeAsStringAsync.mock.calls[0];
    expect(path).toBe(`file:///cache/trening-backup-${store.localISODate()}.json`);
    const env = JSON.parse(body);
    expect(env).toMatchObject({ format: 'trening-backup', schemaVersion: SCHEMA_VERSION });
    expect(Number.isFinite(Date.parse(env.exportedAt))).toBe(true);
    expect(env.state.workouts).toHaveLength(1); expect(env.state.workouts[0].exercises[0].sets[0].weight).toBe(60);
    /* koperta wraca przez parseBackup bez strat */
    expect(backup.parseBackup(body).workouts[0].exercises[0].sets[0].reps).toBe(8);
    expect(SH.shareAsync).toHaveBeenCalledWith(path, { mimeType: 'application/json', dialogTitle: 'Backup treningów' });
  });
  test('angielski interfejs: tytuł okna udostępniania po angielsku', async () => {
    await fresh(undefined, 'en'); SH.shareAsync.mockClear();
    await backup.exportBackup();
    expect(SH.shareAsync.mock.calls[0][1].dialogTitle).toBe('Workout backup');
    i18n.applyLang('pl');
  });
  test('błąd zapisu pliku — wyjątek wychodzi do wywołującego, nic nie jest udostępniane', async () => {
    await fresh(); SH.shareAsync.mockClear(); FS.writeAsStringAsync.mockImplementationOnce(async () => { throw new Error('disk full'); });
    await expect(backup.exportBackup()).rejects.toThrow('disk full');
    expect(SH.shareAsync).not.toHaveBeenCalled();
  });
});

describe('backup.safetyRecoveryNote', () => {
  test('bez nieczytelnego zapisu — pusty dopisek', async () => {
    await fresh(); expect(store.getRecovery()).toBeNull(); expect(backup.safetyRecoveryNote()).toBe('');
  });
  test('nieczytelny zapis przy starcie — dopisek ze spacją na początku (pl i en)', async () => {
    await fresh('{to nie jest json'); expect(store.getRecovery()).not.toBeNull();
    expect(backup.safetyRecoveryNote()).toBe(' Kopia obejmie też poprzednie, nieczytelne dane.');
    i18n.applyLang('en'); expect(backup.safetyRecoveryNote()).toBe(' The copy will also include the earlier unreadable data.'); i18n.applyLang('pl');
    store.clearRecovery(); expect(backup.safetyRecoveryNote()).toBe('');
  });
});

describe('backup.isSafetyError', () => {
  test('rozpoznaje tylko Error z safety === true', () => {
    expect(backup.isSafetyError(Object.assign(new Error('x'), { safety: true }))).toBe(true);
    expect(backup.isSafetyError(new Error('x'))).toBe(false);
    expect(backup.isSafetyError(Object.assign(new Error('x'), { safety: 'true' }))).toBe(false);
    expect(backup.isSafetyError({ safety: true, message: 'x' })).toBe(false);
    expect(backup.isSafetyError(null)).toBe(false); expect(backup.isSafetyError(undefined)).toBe(false); expect(backup.isSafetyError('safety')).toBe(false);
  });
  test('błąd nieudanej kopii bezpieczeństwa (safetyBackup) jest rozpoznawany, z komunikatem w języku interfejsu', async () => {
    await fresh(); FS.writeAsStringAsync.mockImplementationOnce(async () => { throw new Error('disk full'); });
    let err: unknown; try { await backup.safetyBackup('import'); } catch (e) { err = e; }
    expect(backup.isSafetyError(err)).toBe(true);
    expect((err as Error).message).toBe('Nie udało się zapisać kopii bezpieczeństwa w Plikach — dane nie zostały zmienione.');
  });
});

describe('backup.onHistoryEdited', () => {
  test('kopia automatyczna włączona — plik trening-<data>.json w Backup/ ze stanem; bez Apple Health', async () => {
    await fresh(); addWorkout(H, [['Bench Press (sztanga)', [{ weight: 70, reps: 5 }]]]);
    FS.writeAsStringAsync.mockClear();
    await backup.onHistoryEdited();
    const calls = FS.writeAsStringAsync.mock.calls as [string, string][];
    expect(calls).toHaveLength(1);
    expect(calls[0][0]).toMatch(/^file:\/\/\/doc\/Backup\/trening-\d{4}-\d{2}-\d{2}-\d{6}\.json$/);
    expect(JSON.parse(calls[0][1]).state.workouts[0].exercises[0].sets[0].weight).toBe(70);
  });
  test('kopia automatyczna wyłączona w Ustawieniach — nic nie jest zapisywane', async () => {
    await fresh(); store.getState().settings.autoBackup = false; FS.writeAsStringAsync.mockClear();
    await backup.onHistoryEdited();
    expect(FS.writeAsStringAsync).not.toHaveBeenCalled();
  });
  test('błąd zapisu kopii nie przerywa (zapis edycji historii nie może się wywrócić)', async () => {
    await fresh(); FS.writeAsStringAsync.mockImplementationOnce(async () => { throw new Error('disk full'); });
    await expect(backup.onHistoryEdited()).resolves.toBeUndefined();
  });
});

describe('backup.exportRecovery', () => {
  test('bez nieczytelnego zapisu — false, bez pliku', async () => {
    await fresh(); FS.writeAsStringAsync.mockClear();
    expect(await backup.exportRecovery()).toBe(false); expect(FS.writeAsStringAsync).not.toHaveBeenCalled();
  });
  test('z nieczytelnym zapisem — surowy tekst w trening-odzysk-<data>.json, udostępniony; true', async () => {
    await fresh('{zepsute'); FS.writeAsStringAsync.mockClear(); SH.shareAsync.mockClear();
    expect(await backup.exportRecovery()).toBe(true);
    const [path, body] = FS.writeAsStringAsync.mock.calls[0];
    expect(path).toBe(`file:///cache/trening-odzysk-${store.localISODate()}.json`); expect(body).toBe('{zepsute');
    expect(SH.shareAsync).toHaveBeenCalledWith(path, { mimeType: 'application/json', dialogTitle: 'Kopia nieczytelnych danych' });
  });
  test('błąd zapisu (np. brak miejsca) — false zamiast wyjątku', async () => {
    await fresh('{zepsute'); FS.writeAsStringAsync.mockImplementationOnce(async () => { throw new Error('disk full'); });
    expect(await backup.exportRecovery()).toBe(false);
  });
});

/* ============================== edit ============================== */
describe('edit.useDraftTick', () => {
  test('hook odświeża się po touchDraft i po discardDraft istniejącego szkicu; discard nieistniejącego — bez odświeżenia', async () => {
    await fresh(); const w = addWorkout(H, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]]]);
    const { result } = renderHook(() => edit.useDraftTick());
    const r0 = result.current;
    hookAct(() => { edit.touchDraft(); }); expect(result.current).toBe(r0 + 1);
    const d = edit.beginEdit(w.id)!; expect(result.current).toBe(r0 + 1); /* nowy szkic bez powiadamiania */
    hookAct(() => { edit.discardDraft(d.key); }); expect(result.current).toBe(r0 + 2);
    hookAct(() => { edit.discardDraft('nie-ma'); }); expect(result.current).toBe(r0 + 2);
  });
});

describe('edit.minText', () => {
  test('minuty treningu: zaokrąglenie, co najmniej 1, odwrócony zakres → 1', () => {
    expect(edit.minText(0, 90 * 60000)).toBe('90');
    expect(edit.minText(0, 89.5 * 60000)).toBe('90');
    expect(edit.minText(0, 89.49 * 60000)).toBe('89');
    expect(edit.minText(0, 0)).toBe('1');
    expect(edit.minText(0, 20e3)).toBe('1');
    expect(edit.minText(60000, 0)).toBe('1');
    expect(edit.minText(H, H + 25 * 3600e3)).toBe('1500');
  });
});

describe('edit.isDirty', () => {
  test('świeży szkic czysty; zmiana treningu, daty, godziny albo minut → brudny; powrót do stanu wyjściowego → czysty', async () => {
    await fresh(); const w = addWorkout(H, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]]]);
    const d = edit.beginEdit(w.id)!; expect(edit.isDirty(d)).toBe(false);
    d.w.exercises[0].sets[0].reps = 9; expect(edit.isDirty(d)).toBe(true);
    d.w.exercises[0].sets[0].reps = 8; expect(edit.isDirty(d)).toBe(false);
    d.w.note = 'x'; expect(edit.isDirty(d)).toBe(true); d.w.note = ''; expect(edit.isDirty(d)).toBe(false);
    const date = d.date; d.date = edit.shiftDate(date, -1); expect(edit.isDirty(d)).toBe(true); d.date = date;
    d.time = '23:59'; expect(edit.isDirty(d)).toBe(true); d.time = d.oTime; expect(edit.isDirty(d)).toBe(false);
    d.min = '1'; expect(edit.isDirty(d)).toBe(true); d.min = d.oMin; expect(edit.isDirty(d)).toBe(false);
  });
  test('trening wstecz z szablonu: po utworzeniu czysty (wartości wstawione przez aplikację nie są zmianą)', async () => {
    await fresh(); addWorkout(H, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]]]);
    const tpl = store.newTemplate(); tpl.items.push({ id: 'i1', exerciseId: ex('Bench Press (sztanga)').id, sets: 2, repMin: 5, repMax: 8, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(tpl);
    const d = edit.beginPast(tpl.id, H + DAY, H + DAY + 3600e3); expect(edit.isDirty(d)).toBe(false);
    edit.draftAddSet(d.key, 0); expect(edit.isDirty(d)).toBe(true);
  });
});

/* ============================== equipment ============================== */
describe('equipment.capLabel', () => {
  afterEach(() => i18n.applyLang('pl'));
  test('nazwa możliwości po polsku i angielsku; nieznana — sam identyfikator; klucze prototypu nie są etykietami', () => {
    i18n.applyLang('pl'); expect(capLabel('barbell')).toBe('sztanga'); expect(capLabel('bench.incline')).toBe('ławka skośna');
    i18n.applyLang('en'); expect(capLabel('barbell')).toBe('barbell'); expect(capLabel('bench.incline')).toBe('incline bench');
    expect(capLabel('nieznane.cos')).toBe('nieznane.cos'); expect(capLabel('')).toBe('');
    expect(capLabel('toString')).toBe('toString'); expect(capLabel('constructor')).toBe('constructor');
  });
});

describe('equipment.blankLoad', () => {
  test('pozycja bez ciężarów → brak; talerze z gryfem wg pozycji; stacja z krokiem wg jednostki; lista pusta w jednostce', () => {
    expect(blankLoad(equipById('landmine')!)).toBeUndefined(); expect(blankLoad(equipById('bench_flat')!, 'lb')).toBeUndefined();
    expect(blankLoad(equipById('barbell')!)).toEqual({ kind: 'plates', unit: 'kg', base: 20, plates: [] });
    expect(blankLoad(equipById('ez_bar')!)).toEqual({ kind: 'plates', unit: 'kg', base: 10, plates: [] });
    expect(blankLoad(equipById('db_plate')!)).toEqual({ kind: 'plates', unit: 'kg', base: 0, plates: [] });
    expect(blankLoad(equipById('barbell')!, 'lb')).toMatchObject({ kind: 'plates', unit: 'lb' });
    expect(blankLoad(equipById('electric')!)).toEqual({ kind: 'electric', unit: 'kg', min: 0, max: 0, step: 0.5 });
    expect(blankLoad(equipById('electric')!, 'lb')).toEqual({ kind: 'electric', unit: 'lb', min: 0, max: 0, step: 1 });
    expect(blankLoad(equipById('db_fixed')!)).toEqual({ kind: 'list', unit: 'kg', items: [] });
    expect(blankLoad(equipById('leg_press')!, 'lb')).toEqual({ kind: 'list', unit: 'lb', items: [] });
    /* każde wywołanie to nowy obiekt (edytor modyfikuje go w miejscu) */
    const a = blankLoad(equipById('db_fixed')!)!, b = blankLoad(equipById('db_fixed')!)!; expect(a).not.toBe(b);
  });
});

describe('equipment.fillOpts', () => {
  test('bieżnia dostaje nachylenie raz; inne pozycje bez zmian; pusty sprzęt — nic', () => {
    expect(OPT_FILL.opts.treadmill).toEqual(['incline']);
    const l = { equipment: [{ item: 'treadmill', opts: [] as string[] }, { item: 'bench_adj', opts: [] as string[] }] as LocEquip[] };
    fillOpts(l); expect(l.equipment[0].opts).toEqual(['incline']); expect(l.equipment[1].opts).toEqual([]);
    fillOpts(l); expect(l.equipment[0].opts).toEqual(['incline']);
    const e = { equipment: [] as LocEquip[] }; fillOpts(e); expect(e.equipment).toEqual([]);
    /* odznaczona pozycja też dostaje opcję (stan wraca po ponownym zaznaczeniu) */
    const off = { equipment: [{ item: 'treadmill', opts: [], off: true }] as LocEquip[] }; fillOpts(off); expect(off.equipment[0].opts).toEqual(['incline']);
  });
});

describe('equipment.fillGym', () => {
  const oldGym = (unit: 'kg' | 'lb' = 'kg') => ({ equipment: presetEquipment('gym', unit).filter(e => !GYM_FILL.items.includes(e.item)) });
  test('dawny preset siłowni — dopisuje nowy sprzęt (raz) i opaski do zaznaczonych wyciągów', () => {
    const l = oldGym(); l.equipment.find(e => e.item === 'cable_cross')!.opts = ['rope'];
    expect(fillGym(l)).toBe(true);
    const items = l.equipment.map(e => e.item);
    for (const id of GYM_FILL.items) if (equipById(id)) expect(items).toContain(id);
    expect(l.equipment.find(e => e.item === 'cable_cross')!.opts).toEqual(['rope', 'ankle']);
    const n = l.equipment.length; expect(fillGym(l)).toBe(true); expect(l.equipment.length).toBe(n); /* idempotentnie */
  });
  test('dom, hotel, puste miejsce i siłownia z odznaczoną większością — nie kwalifikują się (bez zmian)', () => {
    for (const p of ['home', 'hotel', 'bodyweight'] as const) { const l = { equipment: presetEquipment(p) }; const before = JSON.stringify(l); expect(fillGym(l)).toBe(false); expect(JSON.stringify(l)).toBe(before); }
    const g = oldGym(); g.equipment.forEach((e, i) => { if (i % 2 === 0) e.off = true; }); const before = JSON.stringify(g);
    expect(fillGym(g)).toBe(false); expect(JSON.stringify(g)).toBe(before);
  });
  test('granica GYM_FILL.share: dokładnie 75% zaznaczonych kwalifikuje, mniej — nie', () => {
    const base = oldGym(); const n = base.equipment.length; const need = Math.ceil(n * GYM_FILL.share);
    const mk = (on: number) => ({ equipment: base.equipment.map((e, i): LocEquip => ({ ...e, opts: [...e.opts], ...(i >= on ? { off: true as const } : {}) })) });
    expect(fillGym(mk(need))).toBe(true); expect(fillGym(mk(need - 1))).toBe(false);
  });
  test('odznaczony wyciąg nie dostaje opasek; jednostka lb w nowych pozycjach z ciężarami', () => {
    const l = oldGym('lb'); const cc = l.equipment.find(e => e.item === 'cable_cross')!; cc.opts = []; cc.off = true;
    expect(fillGym(l, 'lb')).toBe(true); expect(cc.opts).toEqual([]);
    const added = l.equipment.filter(e => GYM_FILL.items.includes(e.item) && e.load);
    expect(added.length).toBeGreaterThan(0); for (const e of added) expect(e.load!.unit).toBe('lb');
  });
});

/* ============================== i18n ============================== */
describe('i18n.isLang', () => {
  test('tylko obsługiwane kody języków', () => {
    for (const l of i18n.LANGS) expect(i18n.isLang(l)).toBe(true);
    for (const x of ['auto', 'ja' /* japoński — nieobsługiwany (de od 07.10.2026 jest) */, 'no' /* norweski w aplikacji to „nb” */, 'PL', '', 'pl-PL', null, undefined, 1, {}, ['pl']]) expect(i18n.isLang(x)).toBe(false);
  });
});

describe('i18n.detectLang', () => {
  afterEach(() => { global.__locales = [{ languageCode: 'pl', languageTag: 'pl-PL' }]; i18n.applyLang('pl'); });
  test('język telefonu obsługiwany → ten; nieobsługiwany i brak → angielski; region telefonu w dacie', () => {
    global.__locales = [{ languageCode: 'cs', languageTag: 'cs-CZ' }]; expect(i18n.detectLang()).toBe('cs');
    global.__locales = [{ languageCode: 'ja', languageTag: 'ja-JP' }]; expect(i18n.detectLang()).toBe('en');
    global.__locales = [{ languageCode: 'de', languageTag: 'de-DE' }]; expect(i18n.detectLang()).toBe('de'); /* 07.10.2026 */
    global.__locales = []; expect(i18n.detectLang()).toBe('en');
    global.__locales = [{ languageCode: 'en', languageTag: 'en-GB' }]; expect(i18n.detectLang()).toBe('en');
    i18n.applyLang('auto'); expect(i18n.lang()).toBe('en'); expect(i18n.locale()).toBe('en-GB');
    global.__locales = [{ languageCode: 'pt', languageTag: 'pt-BR' }]; i18n.applyLang('auto'); expect(i18n.lang()).toBe('pt'); expect(i18n.locale()).toBe('pt-BR');
    /* wymuszony język: region telefonu nie pasuje do języka → domyślny region języka */
    i18n.applyLang('cs'); expect(i18n.locale()).toBe('cs-CZ');
  });
});

describe('i18n.decimalComma', () => {
  afterEach(() => { global.__locales = [{ languageCode: 'pl', languageTag: 'pl-PL' }]; i18n.applyLang('pl'); });
  test('przecinek po polsku, czesku, niemieckim regionie; kropka po angielsku; wynik zmienia się z językiem (cache wg locale)', () => {
    i18n.applyLang('pl'); expect(i18n.decimalComma()).toBe(true); expect(units.fmtNum(1.5)).toBe('1,5');
    i18n.applyLang('en'); expect(i18n.decimalComma()).toBe(false); expect(units.fmtNum(1.5)).toBe('1.5');
    i18n.applyLang('cs'); expect(i18n.decimalComma()).toBe(true);
    i18n.applyLang('pl'); expect(i18n.decimalComma()).toBe(true);
    /* ten sam separator co fmtNum — w każdym języku */
    for (const l of i18n.LANGS) { i18n.applyLang(l); expect(i18n.decimalComma()).toBe(units.fmtNum(1.5).includes(',')); }
  });
});

/* ============================== locations ============================== */
describe('locations.commitLocationName', () => {
  test('spacje porządkowane; pusta nazwa → poprzednia; pusta i bez poprzedniej → „Miejsce” (pl/en); limit długości; zapis', async () => {
    await fresh(); const l = addLocation('home', 'Dom');
    l.name = '  Moja   siłownia  '; const t0 = l.updatedAt; jest.spyOn(Date, 'now').mockReturnValue(t0 + 5000);
    commitLocationName(l, 'Dom'); expect(l.name).toBe('Moja siłownia'); expect(l.updatedAt).toBe(t0 + 5000); jest.restoreAllMocks();
    l.name = '   '; commitLocationName(l, 'Dom'); expect(l.name).toBe('Dom');
    l.name = ''; commitLocationName(l, ''); expect(l.name).toBe('Miejsce');
    i18n.applyLang('en'); l.name = ''; commitLocationName(l, ''); expect(l.name).toBe('Place'); i18n.applyLang('pl');
    l.name = 'x'.repeat(store.NAME_MAX + 20); commitLocationName(l, 'Dom'); expect(l.name).toHaveLength(store.NAME_MAX);
    await store.flush(); expect(saved().settings.locations[0].name).toBe('x'.repeat(store.NAME_MAX));
  });
});

describe('locations.canDeleteLocation', () => {
  test('nieznane — nie; główne przy innych — nie; inne — tak; jedyne (główne) — tak', async () => {
    await fresh(); expect(canDeleteLocation('nie-ma')).toBe(false);
    const a = addLocation('home', 'A'); expect(store.getState().settings.mainLocationId).toBe(a.id);
    expect(canDeleteLocation(a.id)).toBe(true); /* jedyne */
    const b = addLocation('gym', 'B');
    expect(canDeleteLocation(a.id)).toBe(false); expect(canDeleteLocation(b.id)).toBe(true);
    store.getState().settings.mainLocationId = b.id; expect(canDeleteLocation(a.id)).toBe(true); expect(canDeleteLocation(b.id)).toBe(false);
  });
});

describe('locations.locationEdited', () => {
  test('zmiana sprzętu miejsca treningu w toku: przyrząd bloków bez odhaczonych serii liczony od nowa; odhaczone zostają; zapis', async () => {
    await fresh(); const s = store.getState().settings; const home = userHome([10, 20]); s.locations.push(home); s.mainLocationId = home.id;
    store.startEmpty(); store.addExerciseToActive(ex('RDL (hantle/linki)')); store.addExerciseToActive(ex('RDL (hantle/linki)'));
    const a = store.getState().active!; expect(a.locationId).toBe('home'); expect(a.exercises.map(e => e.impl)).toEqual(['dumbbell', 'dumbbell']);
    a.exercises[1].sets[0].weight = 20; a.exercises[1].sets[0].reps = 8; store.toggleDone(1, 0);
    const db = home.equipment.find(e => e.item === 'db_fixed')!; db.off = true; const t0 = home.updatedAt;
    jest.spyOn(Date, 'now').mockReturnValue(t0 + 1000);
    locationEdited(home);
    expect(a.exercises[0].impl).toBe('electric'); expect(a.exercises[1].impl).toBe('dumbbell'); expect(home.updatedAt).toBe(t0 + 1000);
  });
  test('inne miejsce niż miejsce treningu albo brak treningu — tylko zapis, bez zmian bloków', async () => {
    await fresh(); const s = store.getState().settings; const home = userHome([10, 20]); s.locations.push(home); s.mainLocationId = home.id; const gym = addLocation('gym', 'Siłownia');
    store.startEmpty(); store.addExerciseToActive(ex('RDL (hantle/linki)')); const a = store.getState().active!;
    gym.equipment = []; locationEdited(gym); expect(a.exercises[0].impl).toBe('dumbbell');
    store.getState().active = null; expect(() => locationEdited(home)).not.toThrow();
    await store.flush(); expect(saved().settings.locations.find(l => l.id === gym.id)!.equipment).toEqual([]);
  });
});

/* ============================== seed ============================== */
describe('seed.loadMult', () => {
  test('łącznie ×1, per hantel ×2, jednostronnie ×2', () => {
    expect(loadMult('total')).toBe(1); expect(loadMult('per_dumbbell')).toBe(2); expect(loadMult('unilateral')).toBe(2);
  });
});
describe('seed.defaultModules', () => {
  test('tylko trening włączony; każde wywołanie to nowy obiekt', () => {
    const m = defaultModules(); expect(m).toEqual({ training: true, diet: false, sleep: false, cardio: false, supplements: false, recommendations: false });
    m.diet = true; expect(defaultModules().diet).toBe(false);
  });
});
describe('seed.blankTimer', () => {
  test('wszystkie timery wyłączone; nowy obiekt przy każdym wywołaniu', () => {
    const t = blankTimer(); expect(t).toEqual({ restEndAt: null, restTotal: 0, restSetId: null, setStartAt: null, setTarget: 0, setId: null });
    t.restTotal = 60; expect(blankTimer().restTotal).toBe(0);
  });
});
describe('seed.libExercise', () => {
  test('pola z katalogu: metryka, tryb liczenia, partie, asysta gumą, wymagania; właściciel', () => {
    const bp = libExercise(['Bench Press (sztanga)', 'klatka', 'sztanga']);
    expect(bp).toMatchObject({ name: 'Bench Press (sztanga)', group: 'klatka', equipment: 'sztanga', metric: 'weight_reps', loadMode: 'total', muscles: ['klatka'], secondaryMuscles: ['triceps', 'barki'], bandAssistable: false, lib: true, ownerId: 'local', restSec: null, tempo: '', notes: '' });
    expect(bp.requires!.length).toBeGreaterThan(0); expect(bp.pattern).toBeTruthy(); expect(bp.id).toMatch(/^[0-9a-f-]{32,}$/);
    expect(libExercise(['Bench Press (hantle)', 'klatka', 'hantle']).loadMode).toBe('per_dumbbell');
    expect(libExercise(['Goblet Squat', 'nogi', 'hantle']).loadMode).toBe('total'); /* jeden ciężar */
    expect(libExercise(['Plank', 'core', 'masa ciała']).metric).toBe('time');
    expect(libExercise(['Bieg', 'cardio', 'inne']).metric).toBe('distance_time');
    expect(libExercise(['Chin Up', 'plecy', 'masa ciała', true]).bandAssistable).toBe(true);
    expect(libExercise(['Bench Press (sztanga)', 'klatka', 'sztanga'], 'trener').ownerId).toBe('trener');
    /* nazwa spoza katalogu: partia z grupy, bez wymagań (zawsze dostępne) */
    const own = libExercise(['Coś nowego', 'plecy', 'linki']); expect(own.muscles).toEqual(['plecy']); expect(own.requires).toEqual([]); expect(own.loadSource).toBe('cable');
    expect(libExercise(['Inne coś', 'cardio', 'inne']).muscles).toEqual([]);
  });
});

/* ============================== signing ============================== */
const profileB64 = (created: number, expires: number, extra = '') => Buffer.from(`0\u0082garbage<?xml version="1.0"?><plist version="1.0"><dict><key>CreationDate</key><date>${new Date(created).toISOString().replace(/\.\d+Z$/, 'Z')}</date>${extra}<key>ExpirationDate</key><date>${new Date(expires).toISOString().replace(/\.\d+Z$/, 'Z')}</date></dict></plist>`, 'latin1').toString('base64');
const useProfile = (b64: string | null) => {
  signing.__resetSigningCache();
  (global as { __bundleDir?: string | null }).__bundleDir = b64 ? '/var/containers/Bundle/Application/X/Trening.app/' : null;
  FS.getInfoAsync.mockImplementation(async (uri: string) => ({ exists: !!b64 && uri.endsWith('embedded.mobileprovision') }));
  FS.readAsStringAsync.mockImplementation(async (uri: string) => (b64 && uri.endsWith('embedded.mobileprovision') ? b64 : ''));
};
describe('signing', () => {
  afterEach(() => { useProfile(null); FS.getInfoAsync.mockImplementation(async () => ({ exists: false })); FS.readAsStringAsync.mockImplementation(async () => ''); i18n.applyLang('pl'); });

  describe('signing.renewTexts', () => {
    test('Sideloadly i nowy build — różne teksty, każdy wspomina właściwą drogę (pl i en)', () => {
      const s = signing.renewTexts('sideloadly'), r = signing.renewTexts('rebuild');
      for (const v of Object.values(s)) { expect(v).toMatch(/Sideloadly/); expect(v).not.toMatch(/GitHub/); }
      for (const v of Object.values(r)) { expect(v).toMatch(/GitHub/); expect(v).not.toMatch(/Sideloadly/); }
      expect(s.expired).toBe('Podpis aplikacji wygasł — odnów w Sideloadly.');
      expect(r.notify).toBe('Zrób backup (Więcej → Backup) i zbuduj aplikację od nowa w GitHubie: iPhone (EAS) → build. Dane zostają.');
      i18n.applyLang('en'); const se = signing.renewTexts('sideloadly'), re = signing.renewTexts('rebuild');
      for (const v of [...Object.values(se), ...Object.values(re)]) expect(v).not.toMatch(/[ąćęłńóśźż]|Zrób|Podpis/);
      expect(se.expired).toMatch(/Sideloadly/); expect(re.expired).toMatch(/GitHub/);
    });
  });

  describe('signing.getProfileInfo', () => {
    test('brak profilu (sklep, Expo Go) → bez daty, droga główna', async () => {
      useProfile(null); expect(await signing.getProfileInfo()).toEqual({ expiry: null, kind: 'rebuild' });
    });
    test('profil darmowego Apple ID (7 dni) → data i Sideloadly; ad hoc (get-task-allow false) → nowy build', async () => {
      const c = Date.UTC(2026, 9, 2, 18, 37);
      useProfile(profileB64(c, c + 7 * DAY)); const i = await signing.getProfileInfo();
      expect(i.kind).toBe('sideloadly'); expect(i.expiry!.getTime()).toBe(c + 7 * DAY);
      useProfile(profileB64(c, c + 7 * DAY, '<key>Entitlements</key><dict><key>get-task-allow</key><false/></dict>'));
      expect((await signing.getProfileInfo()).kind).toBe('rebuild');
    });
    test('odczyt zapamiętany na godzinę; po godzinie czytany ponownie', async () => {
      const c = Date.UTC(2026, 9, 2); useProfile(profileB64(c, c + 7 * DAY)); const now = Date.now();
      expect((await signing.getProfileInfo()).expiry!.getTime()).toBe(c + 7 * DAY);
      FS.readAsStringAsync.mockImplementation(async () => profileB64(c, c + 9 * DAY));
      jest.spyOn(Date, 'now').mockReturnValue(now + 3599e3); expect((await signing.getProfileInfo()).expiry!.getTime()).toBe(c + 7 * DAY);
      jest.spyOn(Date, 'now').mockReturnValue(now + 3601e3); expect((await signing.getProfileInfo()).expiry!.getTime()).toBe(c + 9 * DAY);
    });
    test('uszkodzony profil albo błąd odczytu → bez daty (bez wyjątku)', async () => {
      useProfile('@@@'); expect((await signing.getProfileInfo()).expiry).toBeNull();
      useProfile(profileB64(1, 2)); FS.readAsStringAsync.mockImplementation(async () => { throw new Error('io'); });
      expect(await signing.getProfileInfo()).toEqual({ expiry: null, kind: 'rebuild' });
    });
  });

  describe('signing.getProfileExpiry', () => {
    test('data wygaśnięcia z profilu albo null', async () => {
      useProfile(null); expect(await signing.getProfileExpiry()).toBeNull();
      const c = Date.UTC(2026, 9, 2, 18, 37); useProfile(profileB64(c, c + 365 * DAY));
      expect((await signing.getProfileExpiry())!.toISOString()).toBe(new Date(c + 365 * DAY).toISOString());
    });
  });

  describe('signing.signingState', () => {
    test('dni kalendarzowe do wygaśnięcia i sposób odnowienia; > 30 dni → null; po czasie → −1; bez profilu → null', async () => {
      useProfile(null); expect(await signing.signingState()).toEqual({ days: null, kind: 'rebuild' });
      const now = new Date(); const at = (d: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + d, 12).getTime();
      useProfile(profileB64(at(-2), at(5))); expect(await signing.signingState()).toEqual({ days: 5, kind: 'sideloadly' });
      useProfile(profileB64(at(-300), at(60))); expect(await signing.signingState()).toEqual({ days: null, kind: 'rebuild' });
      useProfile(profileB64(at(-8), Date.now() - 1000)); expect(await signing.signingState()).toEqual({ days: -1, kind: 'sideloadly' });
    });
  });
});

/* ============================== store ============================== */
describe('store.useStore', () => {
  test('selektor czytany od nowa po każdej zmianie stanu', async () => {
    await fresh(); const { result } = renderHook(() => store.useStore(s => s.templates.length));
    expect(result.current).toBe(0);
    hookAct(() => { store.newTemplate(); }); expect(result.current).toBe(1);
    hookAct(() => { store.deleteTemplate(store.getState().templates[0].id); }); expect(result.current).toBe(0);
  });
});

describe('store.usePrefsTick', () => {
  test('klucz język|jednostka|motyw — zmienia się tylko przy zmianie preferencji', async () => {
    await fresh(); let renders = 0; const { result } = renderHook(() => { renders++; return store.usePrefsTick(); });
    expect(result.current).toBe('auto|kg|light'); const r0 = renders;
    hookAct(() => { store.newTemplate(); }); expect(renders).toBe(r0); /* inna zmiana — bez przerysowania */
    hookAct(() => { store.getState().settings.unit = 'lb'; store.save(); }); expect(result.current).toBe('auto|lb|light');
    hookAct(() => { store.getState().settings.language = 'en'; store.getState().settings.theme = 'dark'; store.save(); }); expect(result.current).toBe('en|lb|dark');
  });
});

describe('store.useForegroundTick', () => {
  test('rośnie tylko przy powrocie na pierwszy plan (refreshViews), nie przy zwykłym zapisie', async () => {
    await fresh(); const { result } = renderHook(() => store.useForegroundTick()); const r0 = result.current;
    hookAct(() => { store.newTemplate(); }); expect(result.current).toBe(r0);
    hookAct(() => { store.refreshViews(); }); expect(result.current).toBe(r0 + 1);
    hookAct(() => { store.refreshViews(); }); expect(result.current).toBe(r0 + 2);
  });
});

describe('store.memoHist', () => {
  test('liczy raz do zmiany historii; zmiana samego treningu w toku nie unieważnia', async () => {
    await fresh(); let n = 0; const f = store.memoHist(() => { n++; return store.getState().workouts.length; });
    expect(f()).toBe(0); expect(f()).toBe(0); expect(n).toBe(1);
    addWorkout(H, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]]]); expect(f()).toBe(1); expect(n).toBe(2);
    store.startEmpty(); f(); const k = n; store.save(store.getState().active); expect(f()).toBe(1); expect(n).toBe(k);
  });
});

describe('store.memoHistBy', () => {
  test('cache per klucz; zmiana historii czyści wszystkie klucze', async () => {
    await fresh(); const calls: string[] = []; const f = store.memoHistBy((id: string) => { calls.push(id); return store.workoutsWith(id).length; });
    const bp = ex('Bench Press (sztanga)').id, sq = ex('Back Squat').id;
    expect(f(bp)).toBe(0); expect(f(bp)).toBe(0); expect(f(sq)).toBe(0); expect(calls).toEqual([bp, sq]);
    addWorkout(H, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]]]);
    expect(f(bp)).toBe(1); expect(f(sq)).toBe(0); expect(calls).toEqual([bp, sq, bp, sq]);
  });
});

describe('store.loadFieldValue', () => {
  test('pole ciężaru edytora: własne pole, a gdy puste — obce; ujemne poza masą ciała → 0; brak → pusto', async () => {
    await fresh(); const bp = ex('Bench Press (sztanga)'), pu = ex('Pull Up');
    expect(store.loadFieldValue(bp, { weight: 60, addKg: '' })).toBe(60);
    expect(store.loadFieldValue(bp, { weight: '', addKg: 10 })).toBe(10); /* seria sprzed zmiany sprzętu */
    expect(store.loadFieldValue(bp, { weight: '', addKg: '' })).toBe('');
    expect(store.loadFieldValue(bp, { weight: -5, addKg: '' })).toBe(0);
    expect(store.loadFieldValue(bp, { weight: 0, addKg: 7 })).toBe(0); /* wpisane 0 jest wartością */
    expect(store.loadFieldValue(pu, { weight: '', addKg: -20 })).toBe(-20); /* asysta */
    expect(store.loadFieldValue(pu, { weight: 42.5, addKg: '' })).toBe(42.5);
    expect(store.loadFieldValue(undefined, { weight: 30, addKg: 5 })).toBe(30);
    expect(store.loadFieldValue(bp, { weight: null as unknown as '', addKg: undefined as unknown as '' })).toBe('');
  });
});

describe('store.writeLoad', () => {
  test('zapis do pola obecnego sprzętu, obce czyszczone; ciężar nieujemny; pusty wpis', async () => {
    await fresh(); const bp = ex('Bench Press (sztanga)'), pu = ex('Pull Up');
    const s: Pick<WSet, 'weight' | 'addKg'> = { weight: '', addKg: 10 };
    store.writeLoad(bp, s, 60); expect(s).toEqual({ weight: 60, addKg: '' });
    store.writeLoad(bp, s, -5); expect(s).toEqual({ weight: 0, addKg: '' });
    store.writeLoad(bp, s, ''); expect(s).toEqual({ weight: '', addKg: '' });
    const b: Pick<WSet, 'weight' | 'addKg'> = { weight: 42.5, addKg: '' };
    store.writeLoad(pu, b, -20); expect(b).toEqual({ weight: '', addKg: -20 });
    store.writeLoad(pu, b, ''); expect(b).toEqual({ weight: '', addKg: '' });
    const u: Pick<WSet, 'weight' | 'addKg'> = { weight: '', addKg: 3 }; store.writeLoad(undefined, u, 15); expect(u).toEqual({ weight: 15, addKg: '' });
    /* zapis i odczyt są zgodne */
    store.writeLoad(bp, s, 77.5); expect(store.loadFieldValue(bp, s)).toBe(77.5);
  });
});

describe('store.blockMult', () => {
  test('tryb liczenia ćwiczenia; stacja przy ćwiczeniu na dwie linki ×2 (bez podwajania per hantel); masa ciała ×1', async () => {
    await fresh();
    expect(store.blockMult(ex('Bench Press (sztanga)'))).toBe(1); expect(store.blockMult(ex('Bench Press (hantle)'))).toBe(2);
    expect(store.blockMult(ex('Pull Up'), 'electric')).toBe(1);
    expect(store.blockMult(ex('Cable Fly'))).toBe(1); expect(store.blockMult(ex('Cable Fly'), 'electric')).toBe(2); expect(store.blockMult(ex('Cable Fly'), 'cable')).toBe(1);
    expect(store.blockMult(ex('Lat Pulldown'), 'electric')).toBe(1); /* jedna linka */
    expect(store.blockMult(ex('RDL (hantle/linki)'), 'dumbbell')).toBe(2); expect(store.blockMult(ex('RDL (hantle/linki)'), 'electric')).toBe(2);
    const own = store.newExercise('Cable Fly'); own.lib = false; expect(store.blockMult(own, 'electric')).toBe(1); /* ćwiczenie własne o tej nazwie */
  });
});

describe('store.volOf', () => {
  afterEach(() => units.applyUnit('kg'));
  test('mnożnik × ciężar × powtórzenia; w lb ciężar tak, jak go widać (0,1 lb); zero powtórzeń → 0', async () => {
    await fresh(); const bp = ex('Bench Press (sztanga)'), db = ex('Bench Press (hantle)');
    expect(store.volOf(bp, 100, 5)).toBe(500); expect(store.volOf(db, 20, 10)).toBe(400); expect(store.volOf(bp, 100, 0)).toBe(0); expect(store.volOf(bp, 0, 10)).toBe(0);
    expect(store.volOf(ex('Cable Fly'), 10, 10, 'electric')).toBe(200);
    units.applyUnit('lb');
    const kg = units.wIn(100) as number; expect(units.fmtVol(store.volOf(bp, kg, 30))).toBe('3000 lb');
    expect(store.volOf(bp, 45.35, 1)).toBeCloseTo(100 * units.KG_PER_LB, 9);
  });
});

describe('store.bandColor', () => {
  afterEach(() => i18n.applyLang('pl'));
  test('kolor gumy w języku interfejsu; własny kolor bez zmian; pusty → „?”', async () => {
    await fresh(); expect(store.bandColor({ color: 'czerwona' })).toBe('czerwona');
    i18n.applyLang('en'); expect(store.bandColor({ color: 'czerwona' })).toBe('red'); expect(store.bandColor({ color: 'fioletowa' })).toBe('purple');
    expect(store.bandColor({ color: 'turkus' })).toBe('turkus'); expect(store.bandColor({ color: '' })).toBe('?');
  });
});

describe('store.setHasValue', () => {
  test('jakakolwiek wpisana wartość (także 0); RPE, guma i notatka się nie liczą', () => {
    expect(store.setHasValue(mkSet())).toBe(false);
    expect(store.setHasValue(mkSet({ reps: 0 }))).toBe(true);
    for (const k of ['weight', 'reps', 'durationSec', 'distanceM', 'addKg'] as const) expect(store.setHasValue(mkSet({ [k]: 5 }))).toBe(true);
    expect(store.setHasValue(mkSet({ rpe: 8, bandId: 'b', note: 'x' }))).toBe(false);
    expect(store.setHasValue(mkSet({ weight: null as unknown as '' }))).toBe(false);
  });
});

describe('store.stampImpl', () => {
  test('przyrząd bloku wg miejsca; bez miejsca albo nieznane miejsce — pole usunięte', async () => {
    await fresh(); const s = store.getState().settings; const home = userHome([10]); s.locations.push(home);
    const e = { id: 'b', exerciseId: ex('RDL (hantle/linki)').id, restSec: 90, repMin: null, repMax: null, groupId: null, sets: [] } as store.WExercise;
    expect(store.stampImpl(e, 'home')).toBe(e); expect(e.impl).toBe('dumbbell');
    home.equipment.find(x => x.item === 'db_fixed')!.off = true; store.stampImpl(e, 'home'); expect(e.impl).toBe('electric');
    store.stampImpl(e, null); expect('impl' in e).toBe(false);
    e.impl = 'barbell'; store.stampImpl(e, 'nie-ma'); expect('impl' in e).toBe(false);
    const gone = { ...e, exerciseId: 'usuniete', impl: 'barbell' as const }; store.stampImpl(gone, 'home'); expect('impl' in gone).toBe(false);
  });
});

describe('store.prevOfActiveBlock', () => {
  test('„Poprzednio” dla bloku w toku: ostatnia sesja ćwiczenia; drugie wystąpienie — drugi blok; bez historii — null', async () => {
    await fresh();
    addWorkout(H, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]], ['Bench Press (sztanga)', [{ weight: 40, reps: 12 }]]]);
    addWorkout(H - 7 * DAY, [['Bench Press (sztanga)', [{ weight: 55, reps: 8 }]]]);
    store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Back Squat'));
    const a = store.getState().active!;
    const p0 = store.prevOfActiveBlock(a, a.exercises[0])!; expect(p0.workout.startedAt).toBe(H); expect(p0.sets.map(s => s.weight)).toEqual([60]);
    const p1 = store.prevOfActiveBlock(a, a.exercises[1])!; expect(p1.sets.map(s => s.weight)).toEqual([40]);
    expect(store.prevOfActiveBlock(a, a.exercises[2])).toBeNull();
  });
});

describe('store.setHasResult', () => {
  test('wynik w metryce ćwiczenia: powtórzenia, czas, dystans albo czas; bez ćwiczenia — jakakolwiek wartość', async () => {
    await fresh(); const bp = ex('Bench Press (sztanga)'), pl = ex('Plank'), run = ex('Bieg'), fw = ex("Farmer's Walk"), bur = ex('Burpees');
    expect(store.setHasResult(bp, mkSet({ weight: 100, reps: 0 }))).toBe(false); expect(store.setHasResult(bp, mkSet({ reps: 1 }))).toBe(true);
    expect(store.setHasResult(bp, mkSet({ reps: '' }))).toBe(false);
    expect(store.setHasResult(pl, mkSet({ durationSec: 0 }))).toBe(false); expect(store.setHasResult(pl, mkSet({ durationSec: 30 }))).toBe(true);
    expect(store.setHasResult(fw, mkSet({ weight: 24 }))).toBe(false); expect(store.setHasResult(fw, mkSet({ weight: 24, durationSec: 60 }))).toBe(true);
    expect(store.setHasResult(run, mkSet({ distanceM: 5000 }))).toBe(true); expect(store.setHasResult(run, mkSet({ durationSec: 1500 }))).toBe(true); expect(store.setHasResult(run, mkSet())).toBe(false);
    expect(store.setHasResult(bur, mkSet({ reps: 10 }))).toBe(true); expect(store.setHasResult(bur, mkSet({ weight: 10 }))).toBe(false);
    expect(store.setHasResult(undefined, mkSet({ weight: 5 }))).toBe(true); expect(store.setHasResult(undefined, mkSet())).toBe(false);
  });
});

describe('store.groupLabels', () => {
  test('litery A, B, C… w kolejności pierwszego wystąpienia; pozycje bez grupy pominięte; pusto → {}', () => {
    expect(store.groupLabels([])).toEqual({});
    expect(store.groupLabels([{ groupId: null }, { groupId: 'x' }, { groupId: 'x' }, { groupId: null }, { groupId: 'y' }, { groupId: 'x' }])).toEqual({ x: 'A', y: 'B' });
    const many = Array.from({ length: 26 }, (_, i) => ({ groupId: 'g' + i })); const l = store.groupLabels(many);
    expect(l.g0).toBe('A'); expect(l.g25).toBe('Z');
  });
});

describe('store.cleanLevels', () => {
  test('tylko gumy: całkowite 1–7, bez powtórzeń, rosnąco; inne pozycje i zły zapis → undefined', () => {
    expect(store.cleanLevels('bands', [3, 1, 1, 8, 0, 2.5, '4', 7, NaN, null, -1])).toEqual([1, 3, 7]);
    expect(store.cleanLevels('bands', [])).toEqual([]);
    expect(store.cleanLevels('bands', 'abc')).toBeUndefined(); expect(store.cleanLevels('bands', null)).toBeUndefined(); expect(store.cleanLevels('bands', { 0: 1 })).toBeUndefined();
    expect(store.cleanLevels('db_fixed', [1, 2])).toBeUndefined(); expect(store.cleanLevels(undefined, [1])).toBeUndefined();
  });
});

describe('store.clampName', () => {
  test('limit NAME_MAX, bez rozcinania emoji i bez spacji na końcu; własny limit; ujemny → pusto', () => {
    expect(store.NAME_MAX).toBe(80);
    expect(store.clampName('Dom   ')).toBe('Dom'); expect(store.clampName('')).toBe('');
    expect(store.clampName('x'.repeat(100))).toHaveLength(80);
    expect(store.clampName('a'.repeat(79) + '😀')).toBe('a'.repeat(79));
    expect(store.clampName('a'.repeat(78) + '😀')).toBe('a'.repeat(78) + '😀');
    expect(store.clampName('abc def', 4)).toBe('abc'); expect(store.clampName('abc', 0)).toBe(''); expect(store.clampName('abc', -3)).toBe('');
  });
});

describe('store.exerciseInHistory', () => {
  test('tylko zakończone treningi (historia), nie sam trening w toku', async () => {
    await fresh(); const bp = ex('Bench Press (sztanga)').id, sq = ex('Back Squat').id;
    expect(store.exerciseInHistory(bp)).toBe(false);
    addWorkout(H, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]]]); expect(store.exerciseInHistory(bp)).toBe(true);
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); expect(store.exerciseInHistory(sq)).toBe(false);
    expect(store.exerciseInHistory('nie-ma')).toBe(false);
  });
});

describe('store.exerciseUsed', () => {
  test('historia albo trening w toku', async () => {
    await fresh(); const bp = ex('Bench Press (sztanga)').id, sq = ex('Back Squat').id;
    expect(store.exerciseUsed(sq)).toBe(false);
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); expect(store.exerciseUsed(sq)).toBe(true);
    addWorkout(H, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]]]); expect(store.exerciseUsed(bp)).toBe(true);
    store.getState().active = null; expect(store.exerciseUsed(sq)).toBe(false);
    /* usunięcie ćwiczenia z historią — archiwum; bez historii — na stałe */
    store.deleteExercise(bp); expect(ex('Bench Press (sztanga)').archived).toBe(true);
    store.deleteExercise(sq); expect(store.getState().exercises.some(e => e.id === sq)).toBe(false);
  });
});

describe('store.deleteTemplate', () => {
  test('usuwa tylko wskazany szablon i zapisuje od razu; nieznane id — bez zmian; historia z szablonu zostaje', async () => {
    await fresh(); const a = store.newTemplate(), b = store.newTemplate();
    const w = addWorkout(H, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]]]); w.templateId = a.id;
    store.deleteTemplate('nie-ma'); expect(store.getState().templates.map(x => x.id)).toEqual([a.id, b.id]);
    store.deleteTemplate(a.id); expect(store.getState().templates.map(x => x.id)).toEqual([b.id]);
    await store.flush(); expect(saved().templates.map(x => x.id)).toEqual([b.id]); expect(saved().workouts[0].templateId).toBe(a.id);
  });
});

describe('store.setModule', () => {
  test('moduły włączane i wyłączane; trening zawsze włączony; zapis', async () => {
    await fresh(); store.setModule('diet', true); expect(store.getState().settings.modules.diet).toBe(true);
    store.setModule('diet', false); expect(store.getState().settings.modules.diet).toBe(false);
    store.setModule('training', false); expect(store.getState().settings.modules.training).toBe(true);
    store.setModule('sleep', true); await store.flush(); expect(saved().settings.modules).toMatchObject({ sleep: true, training: true, diet: false });
  });
});

/* ============================== swap ============================== */
describe('swap.parseSwapTarget', () => {
  test('active:<blok>, edit:<klucz>:<blok> (klucz może mieć dwukropki); inne → null', () => {
    expect(parseSwapTarget('active:b1')).toEqual({ kind: 'active', blockId: 'b1' });
    expect(parseSwapTarget('active:')).toEqual({ kind: 'active', blockId: '' });
    expect(parseSwapTarget('edit:w1:b1')).toEqual({ kind: 'edit', key: 'w1', blockId: 'b1' });
    expect(parseSwapTarget('edit:new-a:b:c')).toEqual({ kind: 'edit', key: 'new-a:b', blockId: 'c' });
    expect(parseSwapTarget('edit:w1:')).toEqual({ kind: 'edit', key: 'w1', blockId: '' });
    expect(parseSwapTarget('edit:b1')).toBeNull(); expect(parseSwapTarget('edit::b1')).toBeNull(); expect(parseSwapTarget('edit:')).toBeNull();
    expect(parseSwapTarget('')).toBeNull(); expect(parseSwapTarget('swap:active:b1')).toBeNull(); expect(parseSwapTarget('ACTIVE:b1')).toBeNull();
  });
});

/* ============================== theme ============================== */
describe('theme.applyTheme', () => {
  test('jasny / ciemny / jak w telefonie; nieznana wartość → jasny; błąd modułu natywnego nie wychodzi', () => {
    const set = jest.spyOn(Appearance, 'setColorScheme');
    applyTheme('dark'); expect(set).toHaveBeenLastCalledWith('dark');
    applyTheme('auto'); expect(set).toHaveBeenLastCalledWith('unspecified');
    applyTheme('light'); expect(set).toHaveBeenLastCalledWith('light');
    applyTheme(undefined); expect(set).toHaveBeenLastCalledWith('light');
    applyTheme('neon' as 'light'); expect(set).toHaveBeenLastCalledWith('light');
    set.mockImplementation(() => { throw new Error('no native'); }); expect(() => applyTheme('dark')).not.toThrow();
  });
});

describe('theme.useTheme', () => {
  test('jasny schemat → paleta jasna; ciemny i nieznany → ciemna', () => {
    const rn = require('react-native');
    const spy = jest.spyOn(rn, 'useColorScheme');
    spy.mockReturnValue('light'); expect(renderHook(() => useTheme()).result.current).toBe(light);
    spy.mockReturnValue('dark'); expect(renderHook(() => useTheme()).result.current).toBe(dark);
    spy.mockReturnValue(null); expect(renderHook(() => useTheme()).result.current).toBe(dark);
    expect(light.bg).not.toBe(dark.bg);
  });
});

/* ============================== timer ============================== */
describe('timer.ensurePermission', () => {
  test('zgoda już jest → true bez pytania', async () => {
    const N = require('expo-notifications'); const req = jest.spyOn(N, 'requestPermissionsAsync');
    expect(await timer.ensurePermission()).toBe(true); expect(req).not.toHaveBeenCalled();
  });
});

describe('timer.stopIfFrom', () => {
  test('zatrzymuje przerwę tylko gdy uruchomiła ją ta seria', async () => {
    await fresh(); store.startEmpty();
    await timer.start(60, 's1'); await timer.stopIfFrom('s2'); expect(timer.T.on).toBe(true);
    await timer.stopIfFrom('s1'); expect(timer.T.on).toBe(false); expect(store.getState().timer.restEndAt).toBeNull();
    await expect(timer.stopIfFrom('s1')).resolves.toBeUndefined(); /* już stoi — nic */
    await timer.start(60, null); await timer.stopIfFrom(''); expect(timer.T.on).toBe(true);
  });
});

describe('timer.onForeground', () => {
  test('przerwa minęła w tle → alarm oznaczony i Live Activity zakończona; trwająca — bez zmian', async () => {
    await fresh(); store.startEmpty(); const now = Date.now();
    await timer.start(60, 's1'); global.__la.length = 0;
    timer.onForeground(); expect(timer.T.alarmed).toBe(false); expect(global.__la).toEqual([]);
    jest.spyOn(Date, 'now').mockReturnValue(now + 61e3);
    timer.onForeground(); expect(timer.T.alarmed).toBe(true); expect(global.__la).toContainEqual(['end']);
  });
  test('seria z celem skończona w tle → alarm serii; seria bez celu — nic', async () => {
    await fresh(); store.startEmpty(); const now = Date.now();
    await timer.startSet('x', 30); jest.spyOn(Date, 'now').mockReturnValue(now + 31e3);
    timer.onForeground(); expect(timer.S.alarmed).toBe(true);
    jest.restoreAllMocks(); await timer.stopSet();
    await timer.startSet('y', 0); jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 3600e3);
    timer.onForeground(); expect(timer.S.alarmed).toBe(false);
  });
});

describe('timer.setElapsed', () => {
  test('0 bez stopera; sekundy od startu (ułamkowo)', async () => {
    await fresh(); store.startEmpty(); expect(timer.setElapsed()).toBe(0);
    const now = Date.now(); jest.spyOn(Date, 'now').mockReturnValue(now);
    await timer.startSet('x', 0); expect(timer.setElapsed()).toBe(0);
    jest.spyOn(Date, 'now').mockReturnValue(now + 12500); expect(timer.setElapsed()).toBe(12.5);
    await timer.stopSet(); expect(timer.setElapsed()).toBe(0);
  });
});

describe('timer.setReached', () => {
  test('tylko seria z celem, od chwili osiągnięcia celu (granica włącznie)', async () => {
    await fresh(); store.startEmpty(); expect(timer.setReached()).toBe(false);
    const now = Date.now(); jest.spyOn(Date, 'now').mockReturnValue(now);
    await timer.startSet('x', 30);
    jest.spyOn(Date, 'now').mockReturnValue(now + 29999); expect(timer.setReached()).toBe(false);
    jest.spyOn(Date, 'now').mockReturnValue(now + 30000); expect(timer.setReached()).toBe(true);
    await timer.stopSet(); expect(timer.setReached()).toBe(false);
    jest.spyOn(Date, 'now').mockReturnValue(now); await timer.startSet('y', 0); jest.spyOn(Date, 'now').mockReturnValue(now + 999e3); expect(timer.setReached()).toBe(false);
  });
});

describe('timer.subscribe', () => {
  test('słuchacz dostaje zmiany timerów; po wypisaniu — już nie', async () => {
    await fresh(); store.startEmpty(); const cb = jest.fn(); const un = timer.subscribe(cb);
    await timer.start(30, 'a'); expect(cb).toHaveBeenCalled(); const n = cb.mock.calls.length;
    await timer.adjust(15); expect(cb.mock.calls.length).toBeGreaterThan(n);
    un(); const k = cb.mock.calls.length; await timer.stop(); await timer.startSet('s', 10); await timer.stopSet(); expect(cb.mock.calls.length).toBe(k);
    un(); /* podwójne wypisanie bez błędu */
  });
});

/* ============================== units ============================== */
describe('units.wInKeep', () => {
  afterEach(() => units.applyUnit('kg'));
  test('lb: ta sama liczba co na ekranie → zapisane kg bez zmian; bez `keep` → przyciąganie wIn', () => {
    units.applyUnit('lb');
    expect(units.wOut(61.23)).toBe(135); expect(units.wInKeep(135, 61.23)).toBe(61.23);
    expect(units.wInKeep(135)).toBe(61.25); expect(units.wInKeep(135, '')).toBe(61.25); expect(units.wInKeep(135, NaN)).toBe(61.25); expect(units.wInKeep(135, Infinity)).toBe(61.25);
    expect(units.wInKeep('')).toBe(''); expect(units.wInKeep(0, 0)).toBe(0);
  });
  test('kg: bez `keep` — zaokrąglenie do 0,01; z `keep` — zapisane kg', () => {
    units.applyUnit('kg'); expect(units.wInKeep(100.004)).toBe(100); expect(units.wInKeep(62.5)).toBe(62.5); expect(units.wInKeep(100, 99.996)).toBe(99.996);
  });
});

describe('units.snapLb', () => {
  test('„okrągłe” kg dające tę samą liczbę funtów; symetrycznie dla ujemnych; 0 → 0', () => {
    expect(units.snapLb(220.5)).toBe(100); expect(units.snapLb(135)).toBe(61.25); expect(units.snapLb(45)).toBe(20.4);
    expect(units.snapLb(-220.5)).toBe(-100); expect(Object.is(units.snapLb(0), 0)).toBe(true);
    expect(units.snapLb(1.6499999)).toBe(units.snapLb(1.65));
    const r1 = (v: number) => Math.round(v * 10) / 10;
    for (let lb = 0.1; lb < 600; lb += 7.3) { const kg = units.snapLb(lb); expect(r1(Math.abs(kg) / units.KG_PER_LB)).toBe(r1(lb)); expect(Math.abs(kg * 100 - Math.round(kg * 100))).toBeLessThan(1e-6); }
  });
});

/* ============================== ekrany ============================== */
describe('EKRAN /more/language', () => {
  test('lista: „Jak w telefonie” + wszystkie języki (LANGS) w nich samych; wybór każdego zapisuje, przełącza interfejs i wraca', async () => {
    await renderApp(); await go('/more/language'); await flushAll(10);
    expect(screen.getByLabelText('Jak w telefonie, wybrany')).toBeTruthy();
    for (const l of i18n.LANGS) expect(screen.getByText(i18n.LANG_NAME[l])).toBeTruthy();
    expect(screen.getByText('Nazwy ćwiczeń z biblioteki są po angielsku we wszystkich językach poza polskim.')).toBeTruthy();
    for (const l of i18n.LANGS) {
      await go('/more/language'); await flushAll(10);
      await tap(screen.getByText(i18n.LANG_NAME[l])); await flushAll(10);
      expect(store.getState().settings.language).toBe(l); expect(i18n.lang()).toBe(l);
      await go('/more/language'); await flushAll(10);
      expect(screen.getByLabelText(i18n.t('{name}, wybrany', { name: i18n.LANG_NAME[l] }))).toBeTruthy();
    }
    await tap(screen.getByText(i18n.t('Jak w telefonie'))); await flushAll(10);
    expect(store.getState().settings.language).toBe('auto'); expect(i18n.lang()).toBe('pl');
    await store.flush(); expect(saved().settings.language).toBe('auto');
  });
  test('angielski: opis i „Phone setting”; trwająca przerwa — powiadomienie przeplanowane w nowym języku', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); }); await act(async () => { await timer.start(90, null); });
    await go('/more/language'); await flushAll(10); global.__notifications.length = 0;
    await tap(screen.getByText('English')); await flushAll(10);
    expect((global.__notifications as { content: { title: string } }[]).map(n => n.content.title)).toContain('Rest is over');
    await go('/more/language'); await flushAll(10);
    expect(screen.getByText('Phone setting')).toBeTruthy(); expect(screen.getByText('Library exercise names are in English in all languages except Polish.')).toBeTruthy();
    expect(screen.getByLabelText('English, selected')).toBeTruthy();
    await tap(screen.getByText('Polski')); await flushAll(10); expect(i18n.lang()).toBe('pl');
  });
});

/** Zapisany stan: dom (główne; hantle, stacja), trening w toku z blokami po 3 puste serie. */
async function swapState(blocks: string[], o: { places?: boolean } = {}) {
  await fresh();
  if (o.places !== false) { const s = store.getState().settings; const home = userHome([2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 24]); s.locations.push(home); s.mainLocationId = home.id; }
  addWorkout(H, [['Bench Press (hantle)', [{ weight: 22.5, reps: 10 }]], ['Chest Fly (hantle)', [{ weight: 10, reps: 12 }]]]);
  store.startEmpty(); blocks.forEach(n => store.addExerciseToActive(ex(n)));
  store.getState().active!.exercises.forEach(e => { e.sets = [store.emptySet(), store.emptySet(), store.emptySet()]; });
  await store.flush(); return JSON.parse(JSON.stringify(store.getState()));
}
const blk = (i: number) => store.getState().active!.exercises[i];
const swapUrl = (target: string) => `/swap?target=${encodeURIComponent(target)}`;

describe('EKRAN /swap', () => {
  test('cel nieprawidłowy, brak celu, blok nieistniejący, blok bez nieodhaczonych serii → „nie da się zamienić”; Anuluj wraca', async () => {
    await renderApp({ saved: await swapState(['Bench Press (sztanga)']) }); await flushAll(20);
    for (const tg of ['bogus', 'active:nie-ma', 'edit:nie-ma:b', 'edit:x']) {
      await go(swapUrl(tg)); await flushAll(10); expect(screen.getByText('Tego ćwiczenia nie da się już zamienić.')).toBeTruthy();
      await tap(screen.getByText('Anuluj')); await flushAll(10);
    }
    await go('/swap'); await flushAll(10); expect(screen.getByText('Tego ćwiczenia nie da się już zamienić.')).toBeTruthy(); await tap(screen.getByText('Anuluj')); await flushAll(10);
    for (let si = 0; si < 3; si++) await act(async () => { blk(0).sets[si].weight = 60; blk(0).sets[si].reps = 5; store.toggleDone(0, si); });
    await go(swapUrl('active:' + blk(0).id)); await flushAll(10); expect(screen.getByText('Tego ćwiczenia nie da się już zamienić.')).toBeTruthy();
  });

  test('trening w toku: opis, Propozycje (top 3, „już w treningu”), wybór propozycji, „↺ przywróć”, Anuluj bez zmian', async () => {
    await renderApp({ saved: await swapState(['Bench Press (sztanga)', 'Bench Press (hantle)']) }); await flushAll(20);
    const id0 = blk(0).id; await go(swapUrl('active:' + id0)); await flushAll(20);
    expect(screen.getByText('Zamiana tylko w tym treningu: Bench Press (sztanga)')).toBeTruthy(); expect(screen.getByText('Propozycje')).toBeTruthy();
    expect(screen.getAllByLabelText(/^Propozycja \d: /)).toHaveLength(3);
    expect(screen.getByLabelText(/^Propozycja \d: Bench Press \(hantle\).*już w treningu/)).toBeTruthy();
    expect(screen.queryByText(/↺ przywróć/)).toBeNull();
    /* Anuluj — bez zmian, drugie tapnięcie bez efektu */
    const cancel = screen.getByText('Anuluj'); await tap(cancel); await tap(cancel); await flushAll(10);
    expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id);
    await go(swapUrl('active:' + id0)); await flushAll(20);
    const p1 = screen.getByLabelText(/^Propozycja 1: /); const name1 = /^Propozycja 1: ([^,]+)/.exec(p1.props.accessibilityLabel)![1];
    await tap(p1); await flushAll(20);
    const to = store.getState().exercises.find(e => i18n.exName(e) === name1)!;
    expect(blk(0)).toMatchObject({ exerciseId: to.id, swappedFrom: ex('Bench Press (sztanga)').id });
    await go(swapUrl('active:' + blk(0).id)); await flushAll(20);
    expect(screen.getByText(`Zamiana tylko w tym treningu: ${name1}`)).toBeTruthy();
    await tap(screen.getByText('↺ przywróć: Bench Press (sztanga)')); await flushAll(20);
    expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id); expect(blk(0).swappedFrom).toBeUndefined();
  });

  test('„↺ przywróć” przy wpisanych wartościach zamiennika pyta o potwierdzenie', async () => {
    await renderApp({ saved: await swapState(['Bench Press (sztanga)']) }); await flushAll(20);
    await act(async () => { store.swapBlock(blk(0).id, ex('Bench Press (hantle)').id); }); await act(async () => { blk(0).sets[0].edited = true; store.save(store.getState().active); });
    await go(swapUrl('active:' + blk(0).id)); await flushAll(20);
    global.__alerts.length = 0; await tap(screen.getByText('↺ przywróć: Bench Press (sztanga)')); await flushAll(5);
    expect(global.__alerts.map(a => a.title)).toEqual(['Cofnąć zamianę?']); expect(blk(0).exerciseId).toBe(ex('Bench Press (hantle)').id);
    await act(async () => { global.__alerts[0].buttons!.find(b => b.text === 'Cofnij')!.onPress!(); }); await flushAll(20);
    expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id);
  });

  test('„Ten sam ruch, inny przyrząd”: RDL w domu — stacja zamiast hantli; bez miejsca sekcji nie ma', async () => {
    await renderApp({ saved: await swapState(['RDL (hantle/linki)']) }); await flushAll(20);
    expect(blk(0).impl).toBe('dumbbell'); await go(swapUrl('active:' + blk(0).id)); await flushAll(20);
    expect(screen.getByText('Ten sam ruch, inny przyrząd')).toBeTruthy(); expect(screen.getByText('zamiast: hantle')).toBeTruthy();
    await tap(screen.getByLabelText('Inny przyrząd: stacja')); await flushAll(20);
    expect(blk(0)).toMatchObject({ impl: 'electric', implPinned: true, exerciseId: ex('RDL (hantle/linki)').id });
    await renderApp({ saved: await swapState(['RDL (hantle/linki)'], { places: false }) }); await flushAll(20);
    await go(swapUrl('active:' + blk(0).id)); await flushAll(20); expect(screen.queryByText('Ten sam ruch, inny przyrząd')).toBeNull();
  });

  test('brak podobnych ćwiczeń → komunikat; „Inne”: rozwiń/zwiń, filtry partii i miejsca (zdejmij/włącz), szukaj, Pokaż więcej, Nic nie pasuje', async () => {
    const st = await swapState(['Bench Press (sztanga)']);
    await renderApp({ saved: st }); await flushAll(20);
    await act(async () => { const n = store.newExercise('Moje dziwne'); n.group = 'klatka'; store.addExerciseToActive(n); });
    const bi = store.getState().active!.exercises.length - 1; await act(async () => { blk(bi).sets = [store.emptySet()]; store.save(store.getState().active); });
    await go(swapUrl('active:' + blk(bi).id)); await flushAll(20);
    expect(screen.getByText('Brak podobnych ćwiczeń w tym miejscu — rozwiń „Inne”.')).toBeTruthy();
    await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5);
    expect(screen.getByText('Inne ▴')).toBeTruthy(); expect(screen.getByLabelText('Zwiń inne ćwiczenia')).toBeTruthy();
    const grp = 'Filtr partii: klatka. Tapnij, by zdjąć.', locL = 'Filtr miejsca: Dom. Tapnij, by zdjąć.';
    expect(screen.getByLabelText(grp)).toBeTruthy(); expect(screen.getByLabelText(locL)).toBeTruthy();
    expect(screen.queryByText('Goblet Squat')).toBeNull(); expect(screen.getAllByText('Push Up').length).toBeGreaterThan(0);
    await tap(screen.getByLabelText(grp)); await flushAll(5); expect(screen.getByLabelText('Filtr partii wyłączony: klatka. Tapnij, by włączyć.')).toBeTruthy();
    await tap(screen.getByLabelText(locL)); await flushAll(5); expect(screen.getByLabelText('Filtr miejsca wyłączony: Dom. Tapnij, by pokazać tylko dostępne.')).toBeTruthy();
    /* bez filtrów: cała baza tej miary — porcjami SWAP_PAGE, „Pokaż więcej” dokłada 2 porcje */
    const more = screen.getByLabelText(/^Pokaż więcej ćwiczeń: zostało \d+$/); const left = Number(/(\d+)$/.exec(more.props.accessibilityLabel)![1]);
    expect(left).toBeGreaterThan(100); expect(screen.getByText(`Pokaż więcej (${left})`)).toBeTruthy();
    await tap(more); await flushAll(5); expect(screen.getByLabelText(`Pokaż więcej ćwiczeń: zostało ${left - 100}`)).toBeTruthy();
    /* niedostępne w Domu (miejsce wyłączone) — z dopiskiem „brak: …” */
    const q = () => screen.getAllByPlaceholderText('Szukaj ćwiczenia…').pop()!;
    await type(q(), 'Leg Press'); await flushAll(5); expect(screen.getAllByText(/brak: suwnica na nogi/).length).toBeGreaterThan(0);
    await tap(screen.getByLabelText('Filtr miejsca wyłączony: Dom. Tapnij, by pokazać tylko dostępne.')); await flushAll(5);
    expect(screen.queryByText(/brak: suwnica na nogi/)).toBeNull();
    /* dokładna nazwa innej miary → nic do pokazania i nic do utworzenia */
    await type(q(), 'Skakanka'); await flushAll(5); expect(screen.getByText('Nic nie pasuje.')).toBeTruthy(); expect(screen.queryByText(/^Utwórz/)).toBeNull();
    await tap(screen.getByLabelText('Filtr partii wyłączony: klatka. Tapnij, by włączyć.')); await flushAll(5);
    await type(q(), 'Push Up'); await flushAll(5); await tap(screen.getAllByText('Push Up').pop()!); await flushAll(20);
    expect(blk(bi).exerciseId).toBe(ex('Push Up').id);
  });

  test('„Inne”: Przywróć usunięte ćwiczenie z historią i Utwórz nowe (z miarą i partią bieżącego)', async () => {
    const st = await swapState(['Bench Press (sztanga)', 'Back Squat']); st.exercises.find((e: { name: string }) => e.name === 'Chest Fly (hantle)').archived = true;
    await renderApp({ saved: st }); await flushAll(20);
    await go(swapUrl('active:' + blk(0).id)); await flushAll(20);
    await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5);
    const q = () => screen.getAllByPlaceholderText('Szukaj ćwiczenia…').pop()!;
    await type(q(), 'chest fly (hantle)'); await flushAll(5);
    expect(screen.getByText('Przywróć „Chest Fly (hantle)”')).toBeTruthy(); expect(screen.getByText('usunięte ćwiczenie z historią')).toBeTruthy();
    expect(screen.queryByText(/^Utwórz/)).toBeNull(); /* dokładna nazwa istnieje */
    await tap(screen.getByText('Przywróć „Chest Fly (hantle)”')); await flushAll(20);
    expect(ex('Chest Fly (hantle)').archived).toBeUndefined(); /* restoreExercise (06.10): bez pola, jak po wczytaniu */ expect(blk(0).exerciseId).toBe(ex('Chest Fly (hantle)').id);
    /* Utwórz: z drugiego bloku (nogi) */
    await go(swapUrl('active:' + blk(1).id)); await flushAll(20);
    await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5);
    await type(q(), '  Mój   przysiad '); await flushAll(5);
    expect(screen.getByText('Utwórz „Mój   przysiad”')).toBeTruthy(); expect(screen.getByText('nowe ćwiczenie własne')).toBeTruthy();
    await tap(screen.getByText('Utwórz „Mój   przysiad”')); await flushAll(20);
    const n = ex('Mój przysiad'); expect(n).toMatchObject({ metric: 'weight_reps', group: 'nogi', muscles: ex('Back Squat').muscles });
    expect(blk(1).exerciseId).toBe(n.id);
  });

  test('„Przywróć” ćwiczenia usuniętego tylko w bieżącym treningu — opis „w bieżącym treningu”', async () => {
    const st = await swapState(['Bench Press (sztanga)', 'Pec Deck']); st.exercises.find((e: { name: string }) => e.name === 'Pec Deck').archived = true;
    await renderApp({ saved: st }); await flushAll(20);
    await go(swapUrl('active:' + blk(0).id)); await flushAll(20);
    await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5);
    await tap(screen.getByLabelText('Filtr miejsca: Dom. Tapnij, by zdjąć.')); await flushAll(5);
    await type(screen.getAllByPlaceholderText('Szukaj ćwiczenia…').pop()!, 'Pec Deck'); await flushAll(5);
    expect(screen.getByText('usunięte ćwiczenie (w bieżącym treningu)')).toBeTruthy();
  });

  test('edytor historii: opis „Poprawka zapisu”, propozycja przepina szkic (nie historię), „↺ przywróć” z otwarcia szkicu; usunięte ćwiczenie', async () => {
    await fresh(); const w = addWorkout(H, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]], ['Back Squat', [{ weight: 100, reps: 5 }]]]); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(10);
    const d = edit.beginEdit(w.id)!; const b0 = d.w.exercises[0].id;
    await go(swapUrl(`edit:${d.key}:${b0}`)); await flushAll(20);
    expect(screen.getByText('Poprawka zapisu: wszystkie serie bloku „Bench Press (sztanga)” przejdą pod wybrane ćwiczenie (wartości bez zmian).')).toBeTruthy();
    expect(screen.getByText('Propozycje')).toBeTruthy(); expect(screen.queryByText(/↺ przywróć/)).toBeNull();
    await tap(screen.getByLabelText(/^Propozycja \d: Bench Press \(hantle\)/)); await flushAll(20);
    expect(d.w.exercises[0].exerciseId).toBe(ex('Bench Press (hantle)').id); expect(d.w.exercises[0].sets[0].weight).toBe(60);
    expect(store.getState().workouts.find(x => x.id === w.id)!.exercises[0].exerciseId).toBe(ex('Bench Press (sztanga)').id);
    expect(edit.isDirty(d)).toBe(true);
    await go(swapUrl(`edit:${d.key}:${b0}`)); await flushAll(20);
    await tap(screen.getByText('↺ przywróć: Bench Press (sztanga)')); await flushAll(20);
    expect(d.w.exercises[0].exerciseId).toBe(ex('Bench Press (sztanga)').id); expect(edit.isDirty(d)).toBe(false);
    /* blok usuniętego ćwiczenia: opis z „Usunięte ćwiczenie”, bez propozycji i bez filtra partii; „Inne” działa */
    await act(async () => { d.w.exercises[1].exerciseId = 'usuniete'; edit.touchDraft(); });
    await go(swapUrl(`edit:${d.key}:${d.w.exercises[1].id}`)); await flushAll(20);
    expect(screen.getByText(/Poprawka zapisu: wszystkie serie bloku „Usunięte ćwiczenie”/)).toBeTruthy(); expect(screen.queryByText('Propozycje')).toBeNull();
    await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5); expect(screen.queryByLabelText(/^Filtr partii/)).toBeNull();
    await type(screen.getAllByPlaceholderText('Szukaj ćwiczenia…').pop()!, 'Front Squat'); await flushAll(5);
    await tap(screen.getAllByText('Front Squat').pop()!); await flushAll(20);
    expect(d.w.exercises[1].exerciseId).toBe(ex('Front Squat').id);
  });

  test('angielski interfejs: arkusz bez polskich tekstów', async () => {
    await fresh(undefined, 'en'); const st = await (async () => { const s = store.getState().settings; const home = userHome([10, 20]); s.locations.push(home); s.mainLocationId = home.id; store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); await store.flush(); return JSON.parse(JSON.stringify(store.getState())); })();
    await renderApp({ saved: st, locale: 'en' }); await flushAll(20);
    await go(swapUrl('active:' + blk(0).id)); await flushAll(20);
    expect(screen.getByText('Suggestions')).toBeTruthy(); expect(screen.getByText('Cancel')).toBeTruthy();
    await tap(screen.getByLabelText('Show other exercises')); await flushAll(5);
    const txt = JSON.stringify(screen.toJSON()); expect(txt).not.toMatch(/Propozycje|Inne ▴|Anuluj|Szukaj ćwiczenia|Filtr partii|Zamiana tylko/);
  });
});

/* Na końcu pliku: atrapa z tests/setup.js zawsze daje zgodę, a już wczytana atrapa ma pierwszeństwo także w isolateModules — potrzebny
 * reset rejestru modułów (po nim żaden test w tym pliku nie korzysta już z nowych instancji). */
describe('timer.ensurePermission (brak zgody)', () => {
  test('brak zgody → pytamy; wynik pytania decyduje; zgoda już jest → bez pytania', async () => {
    const mockPerm = { cur: false, req: false, asked: 0 };
    jest.resetModules();
    jest.doMock('expo-notifications', () => ({ setNotificationHandler: jest.fn(), getPermissionsAsync: async () => ({ granted: mockPerm.cur }), requestPermissionsAsync: async () => { mockPerm.asked++; return { granted: mockPerm.req }; } }));
    const ensure: typeof timer.ensurePermission = require('@/lib/timer').ensurePermission;
    expect(await ensure()).toBe(false); expect(mockPerm.asked).toBe(1);
    mockPerm.req = true; expect(await ensure()).toBe(true); expect(mockPerm.asked).toBe(2);
    mockPerm.cur = true; mockPerm.req = false; expect(await ensure()).toBe(true); expect(mockPerm.asked).toBe(2);
  });
});
