/*
 * M1-audytor-generalny-014 (05-architekt-002), DEC-03 b — decyzja właściciela 27.10.2026: **zmiana normalizacji danych = podbicie SCHEMA_VERSION**.
 * Dlaczego: kopia surowego zapisu sprzed migracji (`premigrate_<schemat>`, M1-002) powstaje tylko przy innym numerze schematu (lib/state/boot.ts,
 * `needsPersist = before !== SCHEMA_VERSION`), a `migrate()` biegnie przy każdym starcie i pierwszy zapis po starcie utrwala jej wynik. Zmiana normalizacji
 * bez podbicia schematu nadpisałaby więc dane z poprzedniego builda bez kopii do odzyskania. Reguła: docs/brd/wymagania.md NFR-DAN-001,
 * docs/20-definicja-ukonczenia.md (rodzaj 6 „Dane”), tests/fixtures/released/README.md.
 *
 * Strażnik: odciski (SHA-256) wyniku startu aplikacji (store.init → migrate, z kluczami „live” i „cfg”) na UTRWALONYCH zapisach z wydanych buildów
 * (tests/fixtures/released/*.json) są zapisane w tests/fixtures/odciski-normalizacji.json razem z numerem schematu, dla którego powstały.
 *   - ten sam SCHEMA_VERSION i inny wynik → test pada (zmieniona normalizacja bez podbicia schematu);
 *   - podbity SCHEMA_VERSION → test pada, dopóki odciski nie zostaną zapisane dla nowego schematu: `ODCISKI_ZAPISZ=1 npx jest <ten plik>`;
 *   - zapis odcisków przy NIEZMIENIONYM schemacie tylko dopisuje nowe wzorce; zmienionego odcisku nie nadpisuje (odmowa z tym samym komunikatem).
 * Poza odciskiem (nazwany wyjątek): treść katalogu biblioteki — ćwiczenia z biblioteki nieruszone przez użytkownika (`lib: true`, catalogRev ≠ 'user')
 * i znaczniki kroków katalogu (libExtra, libExtraStep); katalog ma własne rewizje (CATALOG_REV, LIB_EXTRA_REVS) i nie jest zapisem użytkownika. Odwołania
 * do ćwiczeń w treningach, szablonach i planach są w odcisku. Poza odciskiem także metadane zapisu: metaUpdatedAt, saveSeq.
 * Zegar przypięty (czas lokalny 28.10.2026 12:00 — ta sama data kalendarzowa w każdej strefie; tests-tz.yml), bo uzupełnienia zależą od „dziś”.
 */
import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import * as store from '@/lib/store';
import { SCHEMA_VERSION } from '@/lib/seed';
import { fresh } from './helpers';

jest.setTimeout(120000);
const DIR = path.join(__dirname, 'fixtures', 'released');
const ODCISKI = path.join(__dirname, 'fixtures', 'odciski-normalizacji.json');
const WZORCE = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort();
const ZAPISZ = process.env.ODCISKI_ZAPISZ === '1';
const KOMENDA = 'ODCISKI_ZAPISZ=1 npx jest tests/audit-m1-2026-10-27-014-normalizacja-schemat.test.ts';
const REGULA = 'Reguła DEC-03 b (27.10.2026, docs/brd/wymagania.md NFR-DAN-001): zmiana normalizacji danych = podbicie SCHEMA_VERSION w lib/seed.ts '
  + '(wtedy start robi kopię premigrate_<schemat>), potem zapis odcisków: ' + KOMENDA + '.';

type Odciski = Record<string, string>;
interface Plik { _comment: string; schemaVersion: number; wzorce: Record<string, Odciski> }

/** JSON z kluczami obiektów w porządku alfabetycznym — odcisk nie zależy od kolejności pól (refaktoryzacja), tylko od wartości. */
function kanon(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(kanon).join(',')}]`;
  if (v && typeof v === 'object') return `{${Object.keys(v).filter(k => (v as any)[k] !== undefined).sort().map(k => `${JSON.stringify(k)}:${kanon((v as any)[k])}`).join(',')}}`;
  return JSON.stringify(v) ?? 'null';
}
const sha = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16);

/** Część stanu objęta regułą: wszystko poza treścią katalogu i metadanymi zapisu (nagłówek pliku). */
function rzut(st: any): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(st)) {
    if (['metaUpdatedAt', 'saveSeq', 'libExtra', 'libExtraStep'].includes(k) || st[k] === undefined) continue;
    out[k] = k === 'exercises' ? (st.exercises as any[]).filter(e => e.lib !== true || e.catalogRev === 'user') : st[k];
  }
  return out;
}
const odcisk = (st: unknown): Odciski => Object.fromEntries(Object.entries(rzut(st)).map(([k, v]) => [k, sha(kanon(v))]));
/** Różnice odcisków: klucze dodane, usunięte i zmienione. */
function roznice(stare: Odciski, nowe: Odciski): string[] {
  return [...new Set([...Object.keys(stare), ...Object.keys(nowe)])].sort().filter(k => stare[k] !== nowe[k])
    .map(k => (k in stare ? (k in nowe ? `${k} (zmieniony)` : `${k} (zniknął)`) : `${k} (nowy)`));
}

/** Start aplikacji na zapisie z wydanego builda — jak tests/migrate-released.test.ts, z przypiętym zegarem. */
async function wynikStartu(file: string): Promise<Odciski> {
  const fx = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
  jest.useFakeTimers({ now: new Date(2026, 9, 28, 12, 0).getTime(), doNotFake: ['nextTick', 'setImmediate', 'queueMicrotask'] });
  try {
    await fresh(); global.__kv.clear();
    global.__kv.set('state', JSON.stringify(fx.state)); if (fx.live) global.__kv.set('live', JSON.stringify(fx.live)); if (fx.cfg) global.__kv.set('cfg', JSON.stringify(fx.cfg));
    store.__resetForTests(); await store.init();
    expect(store.getRecovery()).toBeNull();
    return odcisk(JSON.parse(JSON.stringify(store.getState())));
  } finally { jest.useRealTimers(); }
}
const czytaj = (): Plik | null => (fs.existsSync(ODCISKI) ? JSON.parse(fs.readFileSync(ODCISKI, 'utf8')) : null);

let biezace: Record<string, Odciski> = {};
beforeAll(async () => { for (const f of WZORCE) biezace[f] = await wynikStartu(f); });

(ZAPISZ ? test : test.skip)('zapis odcisków (ODCISKI_ZAPISZ=1): przy niezmienionym schemacie tylko nowe wzorce, zmieniony odcisk = odmowa', () => {
  const stary = czytaj();
  if (stary && stary.schemaVersion > SCHEMA_VERSION) throw new Error(`Odciski dla schematu ${stary.schemaVersion}, kod ma ${SCHEMA_VERSION} — cofnięty numer schematu.`);
  const wzorce: Record<string, Odciski> = stary && stary.schemaVersion === SCHEMA_VERSION ? { ...stary.wzorce } : {};
  if (stary && stary.schemaVersion === SCHEMA_VERSION) {
    const zle = Object.keys(biezace).filter(f => f in stary.wzorce && roznice(stary.wzorce[f], biezace[f]).length);
    if (zle.length) throw new Error(`Odmowa zapisu: wynik startu na ${zle.join(', ')} zmienił się przy tym samym SCHEMA_VERSION ${SCHEMA_VERSION}. ${REGULA}`);
  }
  for (const f of Object.keys(biezace)) wzorce[f] ??= biezace[f];
  const plik: Plik = { _comment: 'Odciski wyniku startu aplikacji na zapisach z wydanych buildów (tests/fixtures/released). Plik zapisuje wyłącznie '
    + `${KOMENDA}; ręcznie nie edytujemy. M1-audytor-generalny-014, DEC-03 b (27.10.2026).`, schemaVersion: SCHEMA_VERSION, wzorce };
  fs.writeFileSync(ODCISKI, JSON.stringify(plik, null, 1) + '\n');
});

describe('DEC-03 b (27.10.2026): normalizacja zapisów z wydanych buildów bez zmian przy tym samym SCHEMA_VERSION', () => {
  test('odciski istnieją i są zapisane dla bieżącego schematu', () => {
    const p = czytaj();
    expect(p).not.toBeNull();
    if (p!.schemaVersion !== SCHEMA_VERSION)
      throw new Error(`Odciski są dla schematu ${p!.schemaVersion}, a SCHEMA_VERSION = ${SCHEMA_VERSION}. Po podbiciu schematu zapisz odciski: ${KOMENDA}`);
  });
  test('każdy zapis z tests/fixtures/released ma odcisk, a każdy odcisk ma swój zapis', () => {
    const p = czytaj(); if (!p) return; /* zgłasza to test wyżej */
    expect({ bezOdcisku: WZORCE.filter(f => !(f in p.wzorce)), bezZapisu: Object.keys(p.wzorce).filter(f => !WZORCE.includes(f)) }).toEqual({ bezOdcisku: [], bezZapisu: [] });
  });
  test.each(WZORCE)('wynik startu na %s = zapisany odcisk', file => {
    const p = czytaj(); if (!p || p.schemaVersion !== SCHEMA_VERSION || !p.wzorce[file]) return; /* zgłaszają to dwa testy wyżej */
    const r = roznice(p.wzorce[file], biezace[file]);
    if (r.length) throw new Error(`Start aplikacji zmienia zapis z wydanego builda (${file}) inaczej niż przy schemacie ${SCHEMA_VERSION}: ${r.join(', ')}. ${REGULA}`);
  });
  test('wzorzec 1.0 obejmuje pola dodane bez podbicia schematu (liveDays, trening na żywo, voice, haptics, własne i zmienione ćwiczenie)', () => {
    const fx = JSON.parse(fs.readFileSync(path.join(DIR, 'state-v1.0.0-b1032-schema19.json'), 'utf8'));
    expect(fx.schemaVersion).toBe(19);
    expect(fx.features).toEqual(expect.arrayContaining(['liveDays', 'liveWorkout', 'pauses', 'voice', 'haptics', 'ownExercise', 'libEditedByUser', 'active', 'cfg-key']));
    expect(fx.features.filter((f: string) => f.startsWith('NO-'))).toEqual([]);
  });
});

describe('strażnik potrafi paść: odcisk wychwytuje zmianę danych użytkownika, pomija treść katalogu', () => {
  const baza = () => JSON.parse(fs.readFileSync(path.join(DIR, 'state-v1.0.0-b1032-schema19.json'), 'utf8')).state;
  test.each([
    ['nazwa szablonu przycięta', (s: any) => { s.templates[0].name = s.templates[0].name.slice(0, 3); }, 'templates (zmieniony)'],
    ['notatka serii usunięta', (s: any) => { s.workouts[0].exercises[1].sets[1].note = ''; }, 'workouts (zmieniony)'],
    ['uzupełnienie liveDays z historii', (s: any) => { s.liveDays = [...s.liveDays, { startedAt: s.workouts[0].startedAt }]; }, 'liveDays (zmieniony)'],
    ['nowe pole dopisane do starego zapisu', (s: any) => { s.nowePole = true; }, 'nowePole (nowy)'],
    ['ustawienie przepisane', (s: any) => { s.settings.voice = 'off'; }, 'settings (zmieniony)'],
    ['własne ćwiczenie zmienione', (s: any) => { s.exercises.find((e: any) => e.lib !== true).restSec = 90; }, 'exercises (zmieniony)'],
    ['ćwiczenie z biblioteki zmienione przez użytkownika', (s: any) => { s.exercises.find((e: any) => e.catalogRev === 'user').notes = 'x'; }, 'exercises (zmieniony)'],
  ])('%s → różnica', (_n, zmien, oczekiwana) => {
    const a = baza(); const b = baza(); zmien(b);
    expect(roznice(odcisk(a), odcisk(b))).toEqual([oczekiwana]);
  });
  test('treść katalogu (ćwiczenie z biblioteki nieruszone przez użytkownika, kroki katalogu) i metadane zapisu nie zmieniają odcisku', () => {
    const a = baza(); const b = baza();
    const lib = b.exercises.find((e: any) => e.lib === true && e.catalogRev !== 'user'); lib.muscles = ['x']; lib.name += ' (nowa nazwa)';
    b.exercises.push({ ...lib, id: 'nowe-z-katalogu' }); b.libExtraStep = 'kolejny-krok'; b.metaUpdatedAt = 1; b.saveSeq = 999;
    expect(roznice(odcisk(a), odcisk(b))).toEqual([]);
  });
  test('kolejność pól obiektu nie zmienia odcisku', () => {
    const a = baza(); const b = baza(); b.settings = Object.fromEntries(Object.entries(b.settings).reverse());
    expect(roznice(odcisk(a), odcisk(b))).toEqual([]);
  });
});
