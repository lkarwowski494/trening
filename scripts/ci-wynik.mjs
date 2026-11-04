// Wynik tests.yml dla SHA — jedno miejsce (ZB-041 G4, 04.11.2026): używają go scripts/scal-galaz.mjs (bramka scalania, L-090),
// scripts/verify-docs.mjs i scripts/verify-znacznik.mjs (baza H1 = origin/<gałąź> z zielonym CI). Publiczne API Actions, bez tokenu.
// Testy bez sieci: SCAL_API_BAZA (lokalny serwer HTTP) albo CI_RUNY_PLIK (plik JSON z przebiegami: tablica albo { workflow_runs }, filtrowany po head_sha).
import { readFileSync } from 'node:fs';

export const REPO = 'lkarwowski494/trening';
export const WORKFLOW = 'tests.yml';
const API = () => process.env.SCAL_API_BAZA || 'https://api.github.com';
export const urlPrzebiegow = (repo, sha) => `${API()}/repos/${repo}/actions/runs?head_sha=${sha}&per_page=100`;
export const domyslnyFetch = async (url) => {
  const r = await fetch(url, { headers: { accept: 'application/vnd.github+json', 'user-agent': 'scal-galaz' }, signal: AbortSignal.timeout(10000) });
  if (!r.ok) throw new Error(`API Actions: HTTP ${r.status}`);
  return r.json();
};

/** Najnowszy przebieg tests.yml z listy przebiegów API (po created_at, remis: run_number). */
export function najnowszyTests(runy) {
  const tests = (runy ?? []).filter(r => (r.path ?? '').split('@')[0].endsWith(`/${WORKFLOW}`) || r.path === WORKFLOW);
  return tests.sort((a, b) => (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0) || (b.run_number ?? 0) - (a.run_number ?? 0))[0] ?? null;
}

/** Ocena przebiegu: { ok } | { wToku } | { powod }. */
export function ocen(run) {
  if (!run) return { powod: `brak przebiegu ${WORKFLOW} dla tego SHA (poczekaj na start CI albo wypchnij gałąź)` };
  if (run.status !== 'completed') return { wToku: `${WORKFLOW} jeszcze trwa (status: ${run.status}, przebieg ${run.id})` };
  if (run.conclusion === 'success') return { ok: true };
  return { powod: `${WORKFLOW} zakończony wynikiem „${run.conclusion}” (przebieg ${run.id}) — napraw gałąź źródłową` };
}

/** Przebiegi tests.yml dla SHA (plik testowy CI_RUNY_PLIK albo API). */
export async function przebiegiDla(sha, { repo = REPO, fetchJson = domyslnyFetch } = {}) {
  if (process.env.CI_RUNY_PLIK) {
    const d = JSON.parse(readFileSync(process.env.CI_RUNY_PLIK, 'utf8'));
    return (Array.isArray(d) ? d : d.workflow_runs ?? []).filter(r => !r.head_sha || r.head_sha === sha);
  }
  return (await fetchJson(urlPrzebiegow(repo, sha))).workflow_runs;
}

/** Czy najnowszy tests.yml dla SHA ma conclusion success; błąd sieci → false (wołający wraca do ścieżki bez bazy zdalnej). */
export async function zielonyTests(sha, deps = {}) {
  try { return ocen(najnowszyTests(await przebiegiDla(sha, deps))).ok === true; } catch { return false; }
}
