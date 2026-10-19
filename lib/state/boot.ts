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
import { BOOT_GUARD_KEY, parseBootGuard, decideBoot } from './crashguard';

/** `guard` (start aplikacji z app/_layout.tsx) włącza strażnika pętli awarii (M1-audytor-generalny-003, lib/state/crashguard.ts); `retry` („Spróbuj ponownie”
 * na ekranie błędu) liczy start od zera. Bez opcji (testy, narzędzia) strażnik nie działa. */
export async function init(opts: { guard?: boolean; retry?: boolean } = {}): Promise<void> {
  if (S) return;
  setDb(await openDb());
  await db!.execAsync('CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)');
  if (opts.guard) {
    const g = parseBootGuard((await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', BOOT_GUARD_KEY).catch(() => null))?.v);
    const d = decideBoot(opts.retry ? { starts: 0 } : g);
    await db!.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', BOOT_GUARD_KEY, JSON.stringify(d.next)).catch(() => {});
    /* tryb awaryjny: dane nie są ładowane ani zmieniane — ekran startu pozwala je wysłać (readRawData) albo spróbować ponownie */
    if (d.mode === 'safe') throw Object.assign(new Error(t('Aplikacja zamknęła się nieoczekiwanie przy ostatnich uruchomieniach.')), { crashLoop: true });
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
      setNewerSchema(ver);
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
      setS(migrate(raw)); needsPersist = before !== SCHEMA_VERSION;
      /* M1-audytor-generalny-002: udana migracja nie może zostawić jedynie zmigrowanego zapisu — surowy zapis sprzed niej (wraz z „live” i „cfg”) czeka
       * w bazie pod kluczem premigrate_<schemat> do upływu PREMIGRATE_KEEP_MS. Bez kopii (np. brak miejsca) zmigrowany stan nie nadpisuje starego „state”. */
      if (needsPersist && !(await savePreMigrate(Number(before) || 0, row.v, liveTxt, cfgTxt))) needsPersist = false;
    } catch {
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
  if (!db) return;
  await db.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', BOOT_GUARD_KEY, JSON.stringify({ starts: 0 })).catch(() => {});
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
export function resetAll() {
  const s = seedState(detectLang());
  s.settings.unit = deviceUnit(); /* jak świeża instalacja (UX-12) */
  replaceState(s);
  clearRecovery();
  flush();
}
