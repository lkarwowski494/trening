// Jest w `npm run verify` z jednym ponowieniem WYŁĄCZNIE plików przerwanych z zewnątrz (decyzja właściciela 29.10.2026; lekcja w docs/40:
// „pełne verify w kontenerze chmurowym nie przechodzi: workery Jest kończone sygnałem SIGTERM”).
// Zasada: plik z błędem „Test suite failed to run … A jest worker process (pid=…) was terminated by another process: signal=SIGTERM|SIGKILL”
// jest uruchamiany ponownie raz, osobno (`--runInBand`). Każda inna porażka (asercja, timeout, błąd kompilacji, nieznana przyczyna) — kod 1
// bez ponawiania. Zielony (kod 0) tylko gdy wszystkie inne pliki zielone i każde ponowienie zielone. Log wymienia ponowione pliki i powód.
// Użycie: node scripts/jest-ponow.mjs [argumenty jest…]   (zmienna JEST_PONOW_JEST = ścieżka innego uruchamiacza — tylko w testach)
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
/* Ponowienie dostaje większą stertę: ciężki plik (np. regress) potrafi wyczerpać domyślne ~2 GB sterty workera (FATAL ERROR: heap out of memory),
 * co Jest zgłasza jako SIGTERM — pierwsze ponowienie z domyślną stertą padło tak samo (pomiar 29.10.2026); z 4096 MB regress przechodzi w ok. 66 s. */
export const STERTA_PONOWIENIA_MB = 4096;
const PRZERWANIE = /Test suite failed to run[\s\S]*terminated by another process[\s\S]*signal=(?:SIGTERM|SIGKILL)/;

/** Treść błędu pliku testowego z wyniku JSON Jest. */
const komunikat = t => String(t.message ?? t.failureMessage ?? '');
/** Plik przerwany z zewnątrz: nieudany, bez ani jednej nieudanej asercji, komunikat dokładnie o zabitym workerze. */
export function czyPrzerwany(t) {
  return t.status === 'failed' && !(t.assertionResults || []).some(a => a.status === 'failed') && PRZERWANIE.test(komunikat(t));
}

/** Ocena wyniku jednego przebiegu: { przerwane: [pliki], inne: liczba porażek innego rodzaju }. */
export function ocen(wynik) {
  const nieudane = (wynik.testResults || []).filter(t => t.status === 'failed');
  const przerwane = nieudane.filter(czyPrzerwany).map(t => t.name);
  let inne = nieudane.length - przerwane.length;
  /* przebieg nieudany bez żadnego nieudanego pliku (np. próg pokrycia, błąd konfiguracji) — przyczyna nieznana, nie ponawiamy */
  if (!wynik.success && nieudane.length === 0) inne = 1;
  return { przerwane, inne };
}

/** Werdykt: { kod, ponow } — ponow niepuste tylko gdy wszystkie porażki to przerwania. */
export function werdykt(wynik) {
  const { przerwane, inne } = ocen(wynik);
  if (inne > 0) return { kod: 1, ponow: [], powod: `${inne} porażek innych niż przerwanie z zewnątrz — bez ponawiania` };
  if (przerwane.length) return { kod: 0, ponow: przerwane, powod: 'przerwane z zewnątrz (worker Jest zabity sygnałem SIGTERM/SIGKILL)' };
  return { kod: 0, ponow: [], powod: 'brak porażek' };
}

function uruchom(jest, argumenty, plikWyniku, env = {}) {
  const r = spawnSync(process.execPath, [jest, ...argumenty, '--json', `--outputFile=${plikWyniku}`], { cwd: ROOT, stdio: 'inherit', env: { ...process.env, ...env } });
  let wynik = null;
  try { wynik = JSON.parse(readFileSync(plikWyniku, 'utf8')); } catch { /* brak pliku wyniku — jest nie dokończył */ }
  return { status: r.status, wynik };
}

export function main(args) {
  const jest = process.env.JEST_PONOW_JEST || join(ROOT, 'node_modules/jest/bin/jest.js');
  const dir = mkdtempSync(join(tmpdir(), 'jest-ponow-'));
  try {
    const p1 = uruchom(jest, args, join(dir, 'p1.json'));
    if (!p1.wynik) { console.error('jest-ponow: Jest nie zapisał wyniku (padł cały proces) — czerwone, bez ponawiania'); return 1; }
    if (p1.status === 0 && p1.wynik.success) return 0;
    const w = werdykt(p1.wynik);
    if (w.kod === 1) { console.error(`jest-ponow: ${w.powod}`); return 1; }
    if (!w.ponow.length) { console.error('jest-ponow: Jest zakończył się błędem bez opisanej porażki pliku — czerwone, bez ponawiania'); return 1; }
    console.error(`\njest-ponow: ${w.ponow.length} plików przerwanych z zewnątrz (SIGTERM/SIGKILL workera), ponawiam TYLKO je, raz, osobno (--runInBand):`);
    for (const f of w.ponow) console.error(`  - ${f.replace(ROOT + '/', '')}`);
    const p2 = uruchom(jest, ['--runInBand', '--runTestsByPath', ...w.ponow], join(dir, 'p2.json'), { NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --max-old-space-size=${STERTA_PONOWIENIA_MB}`.trim() });
    const ok = Boolean(p2.wynik) && p2.status === 0 && p2.wynik.success && (p2.wynik.testResults || []).length === w.ponow.length;
    console.error(ok ? `jest-ponow: wszystkie ${w.ponow.length} ponowień zielone — Jest zielony` : 'jest-ponow: ponowienie czerwone — Jest czerwony');
    return ok ? 0 : 1;
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
