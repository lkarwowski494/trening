#!/usr/bin/env node
// Raport nocny (decyzja właściciela 21.10.2026, L-013 akcja 5): po nocnym przebiegu (nightly.yml) jedno zgłoszenie GitHub (etykieta `nocne-testy`).
//   czerwona noc  → otwiera zgłoszenie (albo aktualizuje otwarte, albo otwiera ponownie zamknięte) z listą porażek,
//   zielona noc   → komentarz „zielono” i zamknięcie otwartego zgłoszenia,
//   licznik       → kolejne CZYSTE noce (pełny przebieg, wszystkie zadania zielone, E2E bez ponowień) do bramki „3 czyste noce” (CLAUDE.md, docs/38 pkt 11);
//                   zapisany w znaczniku `<!-- nocne-testy licznik=N -->` na początku treści zgłoszenia (zgłoszenie zostaje nośnikiem licznika także po zamknięciu).
// Zgłoszenia są PUBLICZNE: tylko wyniki zadań, nazwy zadań i scenariuszy — nigdy treść logów. Tylko `gh` i token przebiegu (GH_TOKEN), bez nowych sekretów.
// Wejście (zmienne środowiskowe): NEEDS_JSON (toJSON(needs) zadania zbiorczego), E2E_WYNIKI (plik e2e-wyniki.json z artefaktu; opcjonalny),
// GITHUB_SHA, GITHUB_REF_NAME, GITHUB_RUN_ID, GITHUB_REPOSITORY, GITHUB_SERVER_URL, GITHUB_EVENT_NAME, GITHUB_STEP_SUMMARY, NOCNY_DATA (tylko testy).
// Logika czysta (ocen, nastepnyLicznik, zbudujTresc, zaplanuj) jest oddzielona od wywołań `gh` (wykonaj) — testy: tests/nocny-raport.test.ts.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const ETYKIETA = 'nocne-testy';
export const BRAMKA = 3; // „3 czyste noce” (CLAUDE.md, 19.10.2026)
export const TYTUL = 'Nocne testy: wynik ostatniej nocy';
export const LIMIT_SCENARIUSZY = 25;
export const ZADANIA = [
  { id: 'losowe', nazwa: 'Losowe sekwencje działań i pełny zestaw testów (losowe ziarno)' },
  { id: 'mutacje', nazwa: 'Testy mutacyjne (Stryker)' },
  { id: 'e2e-maly-ekran-ciemny', nazwa: 'E2E: mały ekran, pełny katalog scenariuszy' },
];
const SUKCES = 'success', POMINIETE = 'skipped';

/** Znaki specjalne tabeli Markdown i wzmianki (@) w nazwach z zewnątrz. */
const esc = s => String(s).replace(/[\r\n]+/g, ' ').replace(/\|/g, '\\|').replace(/@/g, '@\u200b');

/** Ocena nocy z wyników zadań (needs) i wyników E2E (e2e-wyniki.json albo null). */
export function ocen({ needs, e2e }) {
  const wyniki = ZADANIA.map(z => ({ ...z, wynik: needs?.[z.id]?.result ?? POMINIETE }));
  const wiersze = Array.isArray(e2e?.scenariusze) ? e2e.scenariusze : [];
  const padle = wiersze.filter(r => /^padl/.test(r.wynik)).map(r => r.scenariusz);
  const wPonowieniu = wiersze.filter(r => r.wynik === 'przeszedl_w_ponowieniu').map(r => r.scenariusz);
  const nieudane = wyniki.filter(w => w.wynik !== SUKCES && w.wynik !== POMINIETE).map(w => w.id); // failure, cancelled i każdy nieznany wynik
  const czerwona = nieudane.length > 0 || padle.length > 0;
  const pelna = wyniki.every(w => w.wynik !== POMINIETE);
  const e2eWynik = wyniki.find(w => w.id === 'e2e-maly-ekran-ciemny').wynik;
  const e2eBrak = !Array.isArray(e2e?.scenariusze) && e2eWynik !== POMINIETE;
  const czysta = !czerwona && pelna && !e2eBrak && wPonowieniu.length === 0;
  return { wyniki, nieudane, padle, wPonowieniu, czerwona, pelna, czysta, e2eBrak };
}

/** Licznik kolejnych czystych nocy po tej nocy. Przebieg niepełny (ręczny, z pominiętymi zadaniami) i zielony nie zmienia licznika; porażka lub ponowienia zerują. */
export function nastepnyLicznik(poprzedni, o) {
  if (o.czerwona) return 0;
  if (!o.pelna) return poprzedni;
  return o.czysta ? poprzedni + 1 : 0;
}

export function odczytajLicznik(tresc) {
  const m = /<!--\s*nocne-testy\s+licznik=(\d+)\s*-->/.exec(tresc ?? '');
  return m ? Number(m[1]) : 0;
}

const lista = (nazwy, limit = LIMIT_SCENARIUSZY) => nazwy.slice(0, limit).map(esc).join('; ') + (nazwy.length > limit ? `; i ${nazwy.length - limit} więcej` : '');

export function zbudujTresc({ ocena: o, licznik, data, sha, ref, runUrl, zdarzenie, repoUrl, nieudaneZadania = [] }) {
  const stan = o.czerwona ? 'czerwono' : 'zielono';
  const L = [`<!-- nocne-testy licznik=${licznik} -->`, `# Nocne testy: ${stan}`, ''];
  L.push(`- Data (UTC): ${data}`, `- Gałąź: ${esc(ref)}`, `- Commit: [${sha.slice(0, 7)}](${repoUrl}/commit/${sha})`,
    `- Przebieg: ${runUrl} (${zdarzenie === 'schedule' ? 'harmonogram' : 'uruchomienie ręczne'})`,
    `- Czyste noce z rzędu (pełny przebieg, wszystkie zadania zielone, E2E bez ponowień): ${licznik} z ${BRAMKA}${licznik >= BRAMKA ? ' — Bramka „3 czyste noce” spełniona (docs/38 pkt 11)' : ''}`, '');
  if (!o.pelna) L.push('**Przebieg niepełny** (część zadań pominięta przy ręcznym uruchomieniu) — nie liczy się do bramki, licznik bez zmian.', '');
  if (o.czerwona) L.push('Kolejne czerwone noce aktualizują to samo zgłoszenie; zielona noc zamyka je z komentarzem.', '');
  else if (o.pelna && !o.czysta) L.push('Noc zielona, ale **nie jest czysta** (scenariusze E2E zielone dopiero w ponowieniu albo brak wyników E2E) — licznik wraca do zera.', '');
  L.push('## Zadania', '', '| Zadanie | Wynik |', '|---|---|', ...o.wyniki.map(w => `| ${w.nazwa} | ${w.wynik} |`), '');
  if (nieudaneZadania.length) L.push(`Nieudane zadania (nazwy z GitHub Actions): ${lista(nieudaneZadania)}`, '');
  const e2e = o.wyniki.find(w => w.id === 'e2e-maly-ekran-ciemny');
  if (e2e.wynik !== POMINIETE) {
    L.push('## E2E', '');
    if (o.e2eBrak) L.push('Szczegóły scenariuszy: brak wyników E2E (artefakt e2e-wyniki niedostępny — zobacz podsumowanie przebiegu).', '');
    else {
      L.push(o.padle.length ? `Scenariusze „padł dwa razy” (${o.padle.length}): ${lista(o.padle)}` : 'Żaden scenariusz nie padł dwa razy.', '');
      if (o.wPonowieniu.length) L.push(`Zielone dopiero w ponowieniu (niestabilne, ${o.wPonowieniu.length}): ${lista(o.wPonowieniu)}`, '');
    }
  }
  L.push(`Pełne wyniki i artefakty: ${runUrl} (podsumowanie przebiegu; artefakty żyją 1 dzień). Zgłoszenie nie zawiera treści logów (repozytorium publiczne).`);
  return L.join('\n') + '\n';
}

/** Decyzja: które operacje na zgłoszeniu wykonać. `istniejace` = ostatnie zgłoszenie z etykietą { number, state, body } albo null. */
export function zaplanuj({ ocena: o, istniejace, data, runUrl, sha, ref, zdarzenie, repoUrl, nieudaneZadania = [] }) {
  const poprzedni = odczytajLicznik(istniejace?.body);
  const licznik = nastepnyLicznik(poprzedni, o);
  const tresc = zbudujTresc({ ocena: o, licznik, data, sha, ref, runUrl, zdarzenie, repoUrl, nieudaneZadania });
  const numer = istniejace?.number;
  const otwarte = String(istniejace?.state ?? '').toUpperCase() === 'OPEN';
  const kroki = [];
  if (o.czerwona) {
    const nazwy = o.wyniki.filter(w => o.nieudane.includes(w.id)).map(w => `${w.nazwa} (${w.wynik})`);
    const komentarz = `Czerwona noc ${data}.${nazwy.length ? ` Nieudane zadania: ${nazwy.join('; ')}.` : ''}${o.padle.length ? ` Scenariusze E2E, które padły dwa razy: ${o.padle.length}.` : ''}\nPrzebieg: ${runUrl}`;
    if (!istniejace) kroki.push({ op: 'create', tytul: TYTUL, tresc });
    else {
      if (!otwarte) kroki.push({ op: 'reopen', numer });
      kroki.push({ op: 'edit', numer, tresc }, { op: 'comment', numer, tresc: komentarz });
    }
    return { licznik, kroki };
  }
  const opis = o.czysta ? `Zielono (${data}), noc czysta. Czyste noce z rzędu: ${licznik} z ${BRAMKA}.`
    : !o.pelna ? `Zielono (${data}), przebieg niepełny (pominięte zadania) — licznik bez zmian: ${licznik} z ${BRAMKA}.`
      : `Zielono (${data}), ale noc nie jest czysta (E2E w ponowieniu albo brak wyników) — licznik wraca do zera: ${licznik} z ${BRAMKA}.`;
  const komentarz = `${opis} Przebieg: ${runUrl}`;
  if (!istniejace) {
    if (o.pelna) kroki.push({ op: 'create', tytul: TYTUL, tresc }, { op: 'close', komentarz });
  } else if (otwarte) {
    kroki.push({ op: 'edit', numer, tresc }, { op: 'close', numer, komentarz });
  } else if (o.pelna) {
    kroki.push({ op: 'edit', numer, tresc });
    if (poprzedni < BRAMKA && licznik >= BRAMKA) kroki.push({ op: 'comment', numer, tresc: `Bramka „3 czyste noce” spełniona: ${licznik} kolejnych czystych nocy (ostatnia: ${data}). Przebieg: ${runUrl}` });
  }
  return { licznik, kroki };
}

/** Wykonuje kroki przez `gh(args, wejscieStdin)`; treści przekazuje przez stdin (`--body-file -`). */
export function wykonaj(kroki, gh) {
  let ostatni;
  for (const k of kroki) {
    if (k.op === 'create') {
      const out = gh(['issue', 'create', '--title', k.tytul, '--label', ETYKIETA, '--body-file', '-'], k.tresc);
      ostatni = /\/issues\/(\d+)/.exec(out ?? '')?.[1];
    } else if (k.op === 'edit') gh(['issue', 'edit', String(k.numer), '--body-file', '-'], k.tresc);
    else if (k.op === 'reopen') gh(['issue', 'reopen', String(k.numer)]);
    else if (k.op === 'comment') gh(['issue', 'comment', String(k.numer), '--body-file', '-'], k.tresc);
    else if (k.op === 'close') {
      const n = k.numer ?? ostatni; if (!n) throw new Error('Brak numeru zgłoszenia do zamknięcia');
      gh(['issue', 'close', String(n), '--reason', 'completed', '--comment', k.komentarz.replace(/\s*\n\s*/g, ' ')]);
    } else throw new Error(`Nieznana operacja: ${k.op}`);
  }
}

const ghReal = (args, input) => execFileSync('gh', args, { encoding: 'utf8', input, stdio: ['pipe', 'pipe', 'inherit'] });

/** Nazwy zadań przebiegu zakończonych porażką lub anulowaniem (bez logów). Błąd API nie przerywa raportu. */
export function nieudaneZadaniaPrzebiegu(gh, repo, runId) {
  try {
    const j = JSON.parse(gh(['api', `repos/${repo}/actions/runs/${runId}/jobs?per_page=100`]));
    return (j.jobs ?? []).filter(x => ['failure', 'cancelled', 'timed_out'].includes(x.conclusion)).map(x => x.name);
  } catch { return []; }
}

export function main(env = process.env, gh = ghReal) {
  if (!env.NEEDS_JSON) throw new Error('Brak NEEDS_JSON (wyniki zadań) — raport nie zgaduje wyniku nocy');
  const needs = JSON.parse(env.NEEDS_JSON);
  let e2e = null; try { if (env.E2E_WYNIKI && fs.existsSync(env.E2E_WYNIKI)) e2e = JSON.parse(fs.readFileSync(env.E2E_WYNIKI, 'utf8')); } catch { e2e = null; }
  const o = ocen({ needs, e2e });
  const repo = env.GITHUB_REPOSITORY, runId = env.GITHUB_RUN_ID, serwer = env.GITHUB_SERVER_URL || 'https://github.com';
  const nieudaneZadania = o.czerwona ? nieudaneZadaniaPrzebiegu(gh, repo, runId) : [];
  gh(['label', 'create', ETYKIETA, '--force', '--color', 'B60205', '--description', 'Wynik nocnych testów (nightly.yml) — jedno zgłoszenie']);
  const znalezione = JSON.parse(gh(['issue', 'list', '--label', ETYKIETA, '--state', 'all', '--limit', '1', '--json', 'number,state,body']) || '[]');
  const ctx = { ocena: o, istniejace: znalezione[0] ?? null, data: env.NOCNY_DATA || new Date().toISOString().slice(0, 10), sha: env.GITHUB_SHA, ref: env.GITHUB_REF_NAME,
    runUrl: `${serwer}/${repo}/actions/runs/${runId}`, zdarzenie: env.GITHUB_EVENT_NAME, repoUrl: `${serwer}/${repo}`, nieudaneZadania };
  const { licznik, kroki } = zaplanuj(ctx);
  wykonaj(kroki, gh);
  if (env.GITHUB_STEP_SUMMARY) fs.appendFileSync(env.GITHUB_STEP_SUMMARY, zbudujTresc({ ...ctx, licznik }).replace(/^<!--.*-->\n/, '') + '\n');
  console.log(`Raport nocny: ${o.czerwona ? 'czerwono' : 'zielono'}, czysta=${o.czysta}, licznik=${licznik}, operacje: ${kroki.map(k => k.op).join(', ') || 'brak'}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (e) { console.error(`::error::${e.message}`); process.exit(1); }
}
