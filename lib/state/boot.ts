/*
 * Start aplikacji i zastąpienie stanu: odczyt bazy (klucze „state”, „live”, „cfg”, kopia nieczytelnych danych, dane z nowszej wersji),
 * import (replaceState), reset, odczyt surowych danych do wysłania, porządkowanie przywracanego szkicu.
 * Zależy od: ./core, ./db, ./migrate, ./settings, ./util; zewnętrzne: ../seed, ../i18n.
 */
import { t, detectLang, deviceUnit } from '../i18n';
import { seedState, SCHEMA_VERSION, type State, type Exercise, type Template } from '../seed';
import { isObj } from './util';
import { openDb } from './db';
import {
  S, db, recovery, setS, setDb, seqAtLeast, setRecovery, applyCfg, persistNow, flush, DRAFTS_KEY, setSavedDrafts, clearRecovery, setNewerSchema,
  emit, bump, save
} from './core';
import { migrate } from './migrate';
import { applyPrefs } from './settings';

export async function init(): Promise<void> {
  if (S) return;
  setDb(await openDb());
  await db!.execAsync('CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)');
  const row = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'state');
  let needsPersist = false;
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
      try { const lv = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'live'); const l = lv ? JSON.parse(lv.v) : null;
        const fresher = l && typeof l === 'object' && (Number.isFinite(l.seq) && Number.isFinite(raw?.saveSeq) ? l.seq >= raw.saveSeq
            : Number(l.at) >= (Number(raw?.metaUpdatedAt) || 0));
        if (raw && typeof raw === 'object' && fresher && 'active' in l) {
          raw.active = l.active;
          if (l.timer && typeof l.timer === 'object') raw.timer = l.timer;
        }
        seqAtLeast(Math.max(Number(raw?.saveSeq) || 0, Number(l?.seq) || 0)); } catch {}
      // PERF-03 (A): nowsza konfiguracja (szablony, ustawienia, plany) z małego klucza „cfg” — zapisanego bez przepisywania całej historii.
      try { const cr = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'cfg'); const c = cr ? JSON.parse(cr.v) : null;
        if (applyCfg(raw, c)) seqAtLeast(Number(c.seq) || 0); } catch {}
      setS(migrate(raw)); needsPersist = before !== SCHEMA_VERSION;
    } catch {
      // Nie nadpisujemy jedynej kopii danych: odkładamy ją pod osobny klucz i startujemy od czystego stanu.
      const key = `state_corrupt_${Date.now()}`;
      await db!.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', key, row.v);
      // Runda 69 (T1): trening w toku z klucza „live” trafia do tej samej kopii (osobny klucz) — wysyłany razem z nią.
      // T1b/T4a: stary „live” nie może nałożyć się na nowy, czysty stan przy następnym starcie — numer zapisu podbijamy najpierw,
      // a kopia i usunięcie mają osobne try (nieudana kopia nie zostawia „live” w bazie).
      let lv: { v: string } | null = null; try { lv = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'live'); } catch {}
      if (lv) { try { seqAtLeast(Number(JSON.parse(lv.v)?.seq) || 0); } catch {}
        try { await db!.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', key + '_live', lv.v); } catch {}
        try { await db!.runAsync('DELETE FROM kv WHERE k = ?', 'live'); } catch {} }
      /* PERF-03 (A): tak samo „cfg” — nie może nałożyć się na czysty stan (numer zapisu wyżej, klucz usunięty, kopia obok nieczytelnego zapisu) */
      try { const cv = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'cfg');
        if (cv) { try { seqAtLeast(Number(JSON.parse(cv.v)?.seq) || 0); } catch {}
          try { await db!.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', key + '_cfg', cv.v); } catch {}
          try { await db!.runAsync('DELETE FROM kv WHERE k = ?', 'cfg'); } catch {} } } catch {}
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
  bump(true); emit();
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
