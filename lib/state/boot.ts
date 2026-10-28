/*
 * Start aplikacji i zastąpienie stanu: odczyt bazy (klucze „state”, „live”, „cfg”, kopia nieczytelnych danych, dane z nowszej wersji),
 * import (replaceState), reset, odczyt surowych danych do wysłania, porządkowanie przywracanego szkicu.
 * Zależy od: ./core, ./db, ./migrate, ./settings, ./util; zewnętrzne: ../seed, ../i18n.
 */
import { t, detectLang, deviceUnit } from '../i18n';
import { seedState, SCHEMA_VERSION, type State, type Exercise, type Template } from '../seed';
import { isObj, PREMIGRATE_KEEP_MS } from './util';
import { openDb } from './db';
import {
  S, db, recovery, setS, setDb, seqAtLeast, setRecovery, applyCfg, persistNow, flush, DRAFTS_KEY, setSavedDrafts, clearRecovery, setNewerSchema,
  emit, bump, save, getPersistError
} from './core';
import { migrate } from './migrate';
import { applyPrefs } from './settings';
import { BOOT_GUARD_KEY, parseBootGuard, decideBoot, type BootMode } from './crashguard';
import { BOOT_PHASE_KEY, parseBootPhase, describeBootPhase, type BootPhaseName } from './bootphase';
import { loadBackupStat } from './backupstat';

/* ZK-07: stan jednego startu (diagnostyka etapów i wyjście do tła przed otwarciem bazy). */
let bootStartedAt = 0; let stableEarly = false; let bootPhaseCtx: { mode: BootMode; starts: number; hadData: boolean } | null = null;
/** Czy w bazie są dane użytkownika do ochrony (zapis „state”, kopia nieczytelnych danych albo kopia sprzed migracji); świeża instalacja — nie. Błąd odczytu = są (ostrożnie). */
async function hasUserData(): Promise<boolean> {
  try {
    for (const k of ['state', 'recovery', PREMIGRATE_INDEX]) if (await db!.getFirstAsync('SELECT k FROM kv WHERE k = ?', k)) return true;
    return false;
  } catch { return true; }
}
async function writePhase(phase: BootPhaseName): Promise<void> {
  if (!bootPhaseCtx || !db) return;
  const body = { phase, ms: Math.max(0, Date.now() - bootStartedAt), mode: bootPhaseCtx.mode, starts: bootPhaseCtx.starts, hadData: bootPhaseCtx.hadData, schema: SCHEMA_VERSION };
  await db.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', BOOT_PHASE_KEY, JSON.stringify(body)).catch(() => {});
}
/** `guard` (start aplikacji z app/_layout.tsx) włącza strażnika pętli awarii (M1-audytor-generalny-003, lib/state/crashguard.ts); `retry` („Spróbuj ponownie”
 * na ekranie błędu) liczy start od zera. Bez opcji (testy, narzędzia) strażnik nie działa. */
/** M1-audytor-generalny-042: błąd startu obsłużony ekranem (wyjątek migracji, dane z nowszej wersji) to nie awaria — licznik strażnika wraca do 0, żeby
 * następny start nie pokazywał komunikatu pętli awarii zamiast tej samej przyczyny. Tylko przy włączonym strażniku (start z app/_layout.tsx). */
async function handledBootFailure(guard: boolean | undefined): Promise<void> {
  if (guard && db) await db.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', BOOT_GUARD_KEY, JSON.stringify({ starts: 0 })).catch(() => {});
}
export async function init(opts: { guard?: boolean; retry?: boolean } = {}): Promise<void> {
  if (S) return;
  bootStartedAt = Date.now(); stableEarly = false; bootPhaseCtx = null; /* ZK-07: nowy start */
  setDb(await openDb());
  await db!.execAsync('CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)');
  await loadBackupStat(); /* M1-audytor-generalny-008: data ostatniej udanej kopii po treningu i znacznik porażki */
  if (opts.guard) {
    const g = parseBootGuard((await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', BOOT_GUARD_KEY).catch(() => null))?.v);
    const prevPhase = parseBootPhase((await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', BOOT_PHASE_KEY).catch(() => null))?.v);
    const d = decideBoot(opts.retry ? { starts: 0 } : g);
    /* ZK-07: tryb awaryjny chroni dane — bez żadnych danych (świeża instalacja) nie ma czego chronić, a ekran awaryjny zablokowałby pierwsze użycie. */
    const hadData = await hasUserData();
    /* ZK-07: wyjście do tła, zanim baza była otwarta (markBootStable), oznacza, że start nie zakończył się awarią — licznik zostaje 0. */
    const mode: BootMode = hadData ? d.mode : 'normal';
    const next = stableEarly && mode !== 'safe' ? { starts: 0 } : d.next;
    await db!.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', BOOT_GUARD_KEY, JSON.stringify(next)).catch(() => {});
    bootPhaseCtx = { mode, starts: d.next.starts, hadData };
    /* tryb awaryjny: dane nie są ładowane ani zmieniane — ekran startu pozwala je wysłać (readRawData) albo spróbować ponownie */
    if (mode === 'safe') throw Object.assign(new Error(t('Aplikacja zamknęła się nieoczekiwanie przy ostatnich uruchomieniach.')), { crashLoop: true, bootDiag: describeBootPhase(prevPhase) });
    await writePhase('begin');
  }
  const row = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'state');
  let needsPersist = false;
  let liveTxt: string | null = null; let cfgTxt: string | null = null; /* surowe wiersze „live” i „cfg” — do kopii sprzed migracji (M1-002) */
  /* Audyt 0.10 J1 (DAT-05): baza zapisana przez nowszą wersję (wyższy schemat) — niczego nie migrujemy ani nie zapisujemy; ekran startu
   * mówi „zaktualizuj aplikację” i pozwala wysłać surowe dane (readRawData). */
  if (row) {
    let ver = 0;
    try {
      ver = Number(JSON.parse(row.v)?.schemaVersion) || 0;
    } catch {}
    if (ver > SCHEMA_VERSION) {
      setNewerSchema(ver); await handledBootFailure(opts.guard);
      throw Object.assign(new Error(t('Dane z nowszej wersji aplikacji — zaktualizuj aplikację')), { newerSchema: ver });
    }
  }
  if (row) {
    try {
      const raw = JSON.parse(row.v); const before = raw?.schemaVersion;
      // Runda 69: nowszy trening w toku i timer z klucza „live” (zapisywanego przy każdej zmianie serii).
      try { const lv = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'live'); liveTxt = lv ? lv.v : null; const l = lv ? JSON.parse(lv.v) : null;
        const fresher = l && typeof l === 'object' && (Number.isFinite(l.seq) && Number.isFinite(raw?.saveSeq) ? l.seq >= raw.saveSeq
            : Number(l.at) >= (Number(raw?.metaUpdatedAt) || 0));
        if (raw && typeof raw === 'object' && fresher && 'active' in l) {
          raw.active = l.active;
          if (l.timer && typeof l.timer === 'object') raw.timer = l.timer;
        }
        seqAtLeast(Math.max(Number(raw?.saveSeq) || 0, Number(l?.seq) || 0)); } catch {}
      // PERF-03 (A): nowsza konfiguracja (szablony, ustawienia, plany) z małego klucza „cfg” — zapisanego bez przepisywania całej historii.
      try { const cr = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'cfg'); cfgTxt = cr ? cr.v : null; const c = cr ? JSON.parse(cr.v) : null;
        if (applyCfg(raw, c)) seqAtLeast(Number(c.seq) || 0); } catch {}
      /* M1-audytor-generalny-013: wyjątek w migracji na czytelnych danych to błąd kodu, nie zepsuty zapis — tryb awaryjny (ekran błędu startu), bez odkładania
       * pod state_corrupt_* i bez zapisu czystego stanu; dane w bazie zostają nietknięte do poprawionej wersji. */
      let migrated: State;
      try { migrated = migrate(raw); } catch (e) {
        if (e instanceof Error && e.message === 'bad state') throw e; /* zły kształt zapisu (migrate: brak exercises/templates) = nieczytelny zapis — ścieżka odkładania niżej */
        throw Object.assign(new Error(e instanceof Error ? e.message : String(e)), { migrationFailed: true, cause: e });
      }
      setS(migrated); needsPersist = before !== SCHEMA_VERSION;
      /* M1-audytor-generalny-002: udana migracja nie może zostawić jedynie zmigrowanego zapisu — surowy zapis sprzed niej (wraz z „live” i „cfg”) czeka
       * w bazie pod kluczem premigrate_<schemat> do upływu PREMIGRATE_KEEP_MS. Bez kopii (np. brak miejsca) zmigrowany stan nie nadpisuje starego „state”. */
      if (needsPersist && !(await savePreMigrate(Number(before) || 0, row.v, liveTxt, cfgTxt))) needsPersist = false;
    } catch (e) {
      if ((e as { migrationFailed?: boolean })?.migrationFailed) { await handledBootFailure(opts.guard); throw e; } /* M1-audytor-generalny-013: nic nie zapisujemy — ekran błędu startu */
      // Nie nadpisujemy jedynej kopii danych: odkładamy ją pod osobny klucz i startujemy od czystego stanu.
      const key = `state_corrupt_${Date.now()}`;
      await db!.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', key, row.v);
      // Runda 69 (T1): trening w toku z klucza „live” trafia do tej samej kopii (osobny klucz) — wysyłany razem z nią.
      // T1b/T4a: stary „live” nie może nałożyć się na nowy, czysty stan przy następnym starcie — numer zapisu podbijamy najpierw,
      // a kopia i usunięcie mają osobne try (nieudana kopia nie zostawia „live” w bazie).
      /* M1-audytor-generalny-001 (P0): „live” i „cfg” usuwamy z bazy WYŁĄCZNIE po udanej kopii. Nieudana kopia przerywa start (ekran błędu startu,
       * „Spróbuj ponownie”) — nic nie jest nadpisywane czystym stanem, a następny start powtarza odkładanie. */
      let lv: { v: string } | null = null; try { lv = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'live'); } catch {}
      if (lv) { try { seqAtLeast(Number(JSON.parse(lv.v)?.seq) || 0); } catch {}
        await db!.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', key + '_live', lv.v);
        try { await db!.runAsync('DELETE FROM kv WHERE k = ?', 'live'); } catch {} }
      /* PERF-03 (A): tak samo „cfg” — nie może nałożyć się na czysty stan (numer zapisu wyżej, klucz usunięty, kopia obok nieczytelnego zapisu) */
      let cv: { v: string } | null = null; try { cv = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'cfg'); } catch {}
      if (cv) { try { seqAtLeast(Number(JSON.parse(cv.v)?.seq) || 0); } catch {}
        await db!.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', key + '_cfg', cv.v);
        try { await db!.runAsync('DELETE FROM kv WHERE k = ?', 'cfg'); } catch {} }
      setRecovery({ key, at: Date.now() }); setS(null);
      // Runda 34: znacznik w bazie — komunikat i wysłanie kopii działają także po ponownym uruchomieniu.
      // Runda 35: gdy wcześniejsza kopia wciąż czeka na wysłanie, zostaje ona (zwykle to w niej jest prawdziwa historia).
      try { const old = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'recovery'); const o = old ? JSON.parse(old.v) : null;
        if (o && typeof o.key === 'string' && await db!.getFirstAsync('SELECT k FROM kv WHERE k = ?', o.key))
          setRecovery({ key: o.key, at: Number(o.at) || 0 }); } catch {}
      await db!.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', 'recovery', JSON.stringify(recovery)).catch(() => {});
    }
  }
  /* UX2-03 = DAT2-06 (audyt kontrolny 1, wariant A): szkice edycji ćwiczenia i szablonu z osobnego klucza — lib/draft.ts przywraca je po starcie */
  setSavedDrafts(null);
  if (S) {
    try {
      const dr = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', DRAFTS_KEY);
      setSavedDrafts(dr ? dr.v : null);
    } catch {}
  }
  if (!recovery) {
    try {
      const m = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'recovery');
      const r = m ? JSON.parse(m.v) : null;
      if (r && typeof r.key === 'string') setRecovery({ key: r.key, at: Number(r.at) || 0 });
    } catch {}
  }
  if (!S) {
    setS(seedState(detectLang()));
    S!.settings.unit = deviceUnit(); /* H4 (audyt 0.10 UX-12): świeża instalacja — jednostka z regionu (en-US → lb) */
    needsPersist = true;
  }
  applyPrefs();
  if (needsPersist) await persistNow().catch(() => {});
  if (!getPersistError()) await prunePreMigrate();
  bump(true); emit();
  await writePhase('loaded');
}
/* ---------- M1-audytor-generalny-002: kopia surowego zapisu sprzed migracji ----------
 * Klucz premigrate_<schemat sprzed migracji> trzyma kopertę jak kopia nieczytelnych danych (format „trening-recovery”: state, live, cfg) — da się ją
 * wczytać importem (parseBackup) po poprawce migracji. Klucz „premigrate” to mały indeks { schemat: czas kopii }, żeby sprzątanie nie czytało
 * kilkumegabajtowych kopii. Kopia znika po PREMIGRATE_KEEP_MS (lib/state/util.ts), o ile start się powiódł i zapis nie zgłasza błędu. */
const PREMIGRATE_INDEX = 'premigrate';
const preKey = (from: number) => `premigrate_${from}`;
async function readPreIndex(): Promise<Record<string, number>> {
  try { const r = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', PREMIGRATE_INDEX); const o = r ? JSON.parse(r.v) : null;
    return isObj(o) ? Object.fromEntries(Object.entries(o).filter(([, v]) => typeof v === 'number' && Number.isFinite(v))) as Record<string, number> : {}; } catch { return {}; }
}
async function savePreMigrate(from: number, stateTxt: string, liveTxt: string | null, cfgTxt: string | null): Promise<boolean> {
  const js = (x: string) => { try { return JSON.parse(x); } catch { return x; } };
  const at = Date.now();
  const env = { format: 'trening-recovery', note: 'state = zapis sprzed migracji schematu, live = trening w toku, cfg = konfiguracja', fromSchema: from, at, state: js(stateTxt),
      ...(liveTxt != null ? { live: js(liveTxt) } : {}), ...(cfgTxt != null ? { cfg: js(cfgTxt) } : {}) };
  try {
    await db!.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', preKey(from), JSON.stringify(env));
    const idx = await readPreIndex(); idx[String(from)] = at;
    await db!.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', PREMIGRATE_INDEX, JSON.stringify(idx));
    return true;
  } catch { return false; }
}
async function prunePreMigrate(now = Date.now()): Promise<void> {
  try {
    const idx = await readPreIndex(); let changed = false;
    for (const [from, at] of Object.entries(idx)) if (now - at > PREMIGRATE_KEEP_MS) { await db!.runAsync('DELETE FROM kv WHERE k = ?', preKey(Number(from))); delete idx[from]; changed = true; }
    if (changed) await db!.runAsync(Object.keys(idx).length ? 'INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)' : 'DELETE FROM kv WHERE k = ?', PREMIGRATE_INDEX, ...(Object.keys(idx).length ? [JSON.stringify(idx)] : []));
  } catch {}
}
/** Najnowsza kopia sprzed migracji (koperta JSON do wysłania albo wczytania importem); null — brak. */
export async function readPreMigrate(): Promise<string | null> {
  if (!db) return null;
  const idx = await readPreIndex(); const from = Object.entries(idx).sort((a, b) => b[1] - a[1])[0]?.[0]; if (from == null) return null;
  const r = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', preKey(Number(from))).catch(() => null);
  return r ? r.v : null;
}
/** „Kamień” strażnika pętli awarii: pierwszy ekran działa (BOOT_STABLE_MS po starcie albo wyjście do tła) — licznik kolejnych niedokończonych startów wraca do 0. */
export async function markBootStable(): Promise<void> {
  stableEarly = true; /* ZK-07: wołane przed otwarciem bazy (wyjście do tła w trakcie ładowania) — init() zapisze licznik 0 */
  if (!db) return;
  await db.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', BOOT_GUARD_KEY, JSON.stringify({ starts: 0 })).catch(() => {});
  await writePhase('stable');
}
/** Przywracany szkic przechodzi to samo porządkowanie co dane z bazy i importu (migrate na kopii stanu z obiektem szkicu); null — obiektu już nie ma. */
export function sanitizeDraftObj(kind: 'exercise' | 'template', obj: unknown): Exercise | Template | null {
  if (!S || !isObj(obj) || typeof (obj as any).id !== 'string') return null;
  const id = (obj as any).id as string;
  const key = kind === 'exercise' ? 'exercises' : 'templates';
  const raw: any = JSON.parse(JSON.stringify(S));
  const i = raw[key].findIndex((x: any) => x.id === id);
  if (i < 0) return null;
  raw[key][i] = JSON.parse(JSON.stringify(obj));
  try { return (migrate(raw)[key] as (Exercise | Template)[]).find(x => x.id === id) ?? null; } catch { return null; }
}
/** Audyt 0.10 J1: surowy zapis (stan + trening w toku) do wysłania z ekranu „Dane z nowszej wersji” — koperta jak kopia nieczytelnych danych
 * (nowsza wersja wczyta ją importem). */
export async function readRawData(): Promise<string | null> {
  if (!db) return null; const r = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'state'); if (!r) return null;
  const l = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'live').catch(() => null);
  const c = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'cfg').catch(() => null); /* PERF-03 (A) */
  const js = (x: string) => { try { return JSON.parse(x); } catch { return x; } };
  return JSON.stringify({ format: 'trening-recovery', note: 'state = zapis z nowszej wersji aplikacji, live = trening w toku, cfg = nowsza konfiguracja',
      state: js(r.v), ...(l ? { live: js(l.v) } : {}), ...(c ? { cfg: js(c.v) } : {}) });
}
/** Surowy tekst odłożonego, nieczytelnego zapisu — do wysłania sobie i ręcznego odzyskania. */
export async function readRecovery(): Promise<string | null> {
  if (!db || !recovery) return null;
  const r = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', recovery.key);
  const l = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', recovery.key + '_live').catch(() => null);
  if (!r) return null;
  if (!l) return r.v;
  /* T4b: koperta JSON zamiast dopisku po stanie — plik da się po poprawce wczytać importem (parseBackup); stan jako obiekt, gdy jest poprawnym
   * JSON-em, inaczej jako tekst */
  const js = (x: string) => { try { return JSON.parse(x); } catch { return x; } };
  return JSON.stringify({ format: 'trening-recovery', note: 'state = nieczytelny zapis, live = trening w toku', state: js(r.v), live: js(l.v) }); }
/** A11B-1 (audyt zmian 0.11, część 2, wariant A): import i „Wyczyść wszystkie dane” zastępują wszystko — także szkice edycji (ćwiczeń i szablonów
 * w pamięci i w bazie, lib/draft.ts; edycji historii, lib/edit.ts). Szkic sprzed zastąpienia dotyczy starych danych: po „Edytuj → Zapisz” nadpisałby
 * dane z kopii. Moduły szkiców rejestrują tu czyszczenie (store ich nie importuje). */
const stateReplacedHooks = new Set<() => void>();
export function onStateReplaced(cb: () => void) { stateReplacedHooks.add(cb); }
export function replaceState(next: State) { setS(migrate(next)); setSavedDrafts(null); stateReplacedHooks.forEach(h => h()); applyPrefs(); save(); }
/** Reset: nowe dane startowe w języku, który będzie widoczny po resecie (ustawienie wraca na „auto” = język telefonu). */
export function resetAll(): Promise<void> {
  const s = seedState(detectLang());
  s.settings.unit = deviceUnit(); /* jak świeża instalacja (UX-12) */
  replaceState(s);
  clearRecovery();
  return flush().then(purgeTechnicalCopies);
}
/** A-2 (audyt 1.0): „Wyczyść wszystkie dane” usuwa też kopie techniczne z bazy — sprzed migracji (premigrate*), nieczytelne zapisy (state_corrupt_*), znacznik
 * kopii odzysku (recovery) i szkice (drafts). Polityka prywatności obiecuje usunięcie danych w aplikacji; kopia bezpieczeństwa w Plikach powstaje wcześniej. */
const TECHNICAL_KEY = /^(premigrate|state_corrupt_|recovery$|drafts$)/;
async function purgeTechnicalCopies(): Promise<void> {
  if (!db) return;
  try {
    const rows = await db.getAllAsync<{ k: string }>('SELECT k FROM kv');
    for (const { k } of rows) if (TECHNICAL_KEY.test(k)) await db.runAsync('DELETE FROM kv WHERE k = ?', k);
  } catch {}
}
