#!/usr/bin/env node
/* L-119 wariant A (docs/40; decyzja koordynatora 09.11.2026, ZB-049): odbiór sygnału nocnych testów w haku SessionStart.
   Wypisuje 3 ostatnie przebiegi `nightly.yml` z harmonogramu (wynik, data, gałąź) i licznik czerwonych z rzędu; przy ≥ 2 czerwonych — wiersz „rozpatrz nocne przed planem”.
   Publiczne API Actions bez tokenu; repo jest publiczne, więc tylko wynik, data i gałąź — nigdy treść logów ani tytuły przebiegów.
   Hak nie może blokować startu sesji: limit czasu (domyślnie 5 s), każdy błąd (brak sieci, limit zapytań, zła odpowiedź) → cisza i kod 0.
   W sesjach z proxy (HTTPS_PROXY) hak ustawia NODE_USE_ENV_PROXY=1 (Node 22.21+), bo wbudowany fetch inaczej łączy się bezpośrednio, a współdzielony adres ma wyczerpany limit 60 zapytań/h bez tokenu.
   Zmienne testowe: STAN_NOCNY_API (adres bazowy), STAN_NOCNY_LIMIT_MS. */
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { realpathSync } from 'node:fs';

export const LIMIT_MS = 5000;
export const POKAZ = 3; /* ile przebiegów wypisać */
export const POBIERZ = 15; /* ile pobrać do licznika serii */
export const PROG_OSTRZEZENIA = 2;
const REPO = 'lkarwowski494/trening';
const CZERWONE = new Set(['failure', 'cancelled', 'timed_out']); /* jak w scripts/ci/nocny-raport.mjs: anulowanie to sygnał */

/* runs: najnowszy pierwszy. Przebiegi w toku (bez wyniku) pomijamy; zielony przerywa serię. */
export function licznikCzerwonych(runs) {
  let n = 0;
  for (const r of runs) {
    if (r.status !== 'completed' || !r.conclusion) continue;
    if (!CZERWONE.has(r.conclusion)) break;
    n++;
  }
  return n;
}

const wynikOpis = r => (r.status !== 'completed' || !r.conclusion ? 'w toku' : r.conclusion === 'success' ? 'zielony' : CZERWONE.has(r.conclusion) ? 'czerwony' : r.conclusion);

export async function stanNocny({ fetch: f = globalThis.fetch, api = 'https://api.github.com', limitMs = LIMIT_MS } = {}) {
  try {
    const url = `${api}/repos/${REPO}/actions/workflows/nightly.yml/runs?event=schedule&per_page=${POBIERZ}`;
    const res = await f(url, { signal: AbortSignal.timeout(limitMs), headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'trening-hak-startu' } });
    if (!res || !res.ok) return [];
    const runs = (await res.json())?.workflow_runs;
    if (!Array.isArray(runs) || runs.length === 0) return [];
    const n = licznikCzerwonych(runs);
    const plus = n === runs.filter(r => r.status === 'completed' && r.conclusion).length && n === runs.length ? '+' : '';
    const w = [`Nocne testy (nightly.yml, harmonogram) — ostatnie ${Math.min(POKAZ, runs.length)} przebiegi (L-119):`];
    for (const r of runs.slice(0, POKAZ)) w.push(`- ${String(r.created_at).slice(0, 10)} · ${String(r.head_branch)} · ${wynikOpis(r)}`);
    w.push(`Czerwonych z rzędu: ${n}${plus}`);
    if (n >= PROG_OSTRZEZENIA) w.push(`UWAGA: czerwonych nocy z rzędu: ${n}${plus} — rozpatrz nocne przed planem (docs/40 L-119): naprawa, backlog z ID albo „znane, naprawione na gałęzi X” (sprawdź git merge-base --is-ancestor).`);
    return w;
  } catch {
    return [];
  }
}

const jakoSkrypt = (() => { try { return realpathSync(resolve(process.argv[1] ?? '')) === realpathSync(fileURLToPath(import.meta.url)); } catch { return false; } })();
if (jakoSkrypt) {
  try {
    const opcje = {};
    if (process.env.STAN_NOCNY_API) opcje.api = process.env.STAN_NOCNY_API;
    if (process.env.STAN_NOCNY_LIMIT_MS) opcje.limitMs = Number(process.env.STAN_NOCNY_LIMIT_MS) || LIMIT_MS;
    const w = await stanNocny(opcje);
    if (w.length) console.log(w.join('\n'));
  } catch { /* hak nie blokuje startu */ }
  process.exit(0);
}
