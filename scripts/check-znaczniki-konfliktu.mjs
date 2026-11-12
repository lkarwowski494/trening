// Strażnik znaczników konfliktu scalenia (koordynator 1.1, 04.11.2026; lekcja „znaczniki konfliktu scalenia” w docs/40: `<<<<<<<`/`=======`/`>>>>>>>` zacommitowane
// w docs/09 i docs/18 przeszły verify:szybkie i tests.yml). Odrzuca każdy plik ŚLEDZONY przez git, który ma wiersz zaczynający się od `<<<<<<< `, `>>>>>>> `
// albo będący samym `=======`. Sprawdza cały stan śledzonych plików (nie tylko ostatnią różnicę), więc znacznik z wcześniejszego commitu na gałęzi też zostanie złapany (L-080).
// Wyjątki (legalne wystąpienia, np. przykłady w dokumentach) — tylko z powodem, w tests/znaczniki-konfliktu-wyjatki.json: [{ "plik": "...", "powod": "..." }].
// Uruchamiany: hak pre-push (przez check:pochodne), verify, verify:szybkie, verify:docs. Użycie: node scripts/check-znaczniki-konfliktu.mjs [--root <katalog>]
// Test: tests/znaczniki-konfliktu.test.ts.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jestGlowny } from './modul-glowny.mjs';

/** ZAKRES strażnika — jedno miejsce: pliki śledzone przez git (`git ls-files`), tekstowe (bez bajtu NUL), do `maxBajtow`; plik wyjątków poniżej. */
export const ZAKRES = {
  zrodlo: 'git ls-files (pliki śledzone)',
  maxBajtow: 5 * 1024 * 1024,
  wyjatki: 'tests/znaczniki-konfliktu-wyjatki.json',
};
/** Wiersz-znacznik: początek `<<<<<<< ` / `>>>>>>> ` albo sam `=======` (CRLF ignorowany). */
export const ZNACZNIK_RE = /^(<{7} |>{7} |={7}$)/;

export function znajdz(root) {
  const wyjatki = new Set();
  const pw = join(root, ZAKRES.wyjatki);
  if (existsSync(pw)) {
    for (const w of JSON.parse(readFileSync(pw, 'utf8'))) {
      if (!w.plik || !w.powod) throw new Error(`${ZAKRES.wyjatki}: każdy wyjątek wymaga pól plik i powod`);
      wyjatki.add(w.plik);
    }
  }
  const pliki = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split('\0').filter(Boolean);
  const trafienia = [];
  for (const f of pliki) {
    if (wyjatki.has(f)) continue;
    let st; try { st = statSync(join(root, f)); } catch { continue; } // usunięty w kopii roboczej
    if (!st.isFile() || st.size > ZAKRES.maxBajtow) continue;
    const buf = readFileSync(join(root, f));
    if (buf.includes(0)) continue;
    buf.toString('utf8').split('\n').forEach((w, i) => {
      if (ZNACZNIK_RE.test(w.replace(/\r$/, ''))) trafienia.push({ plik: f, linia: i + 1, tekst: w.slice(0, 20) });
    });
  }
  return trafienia;
}

if (jestGlowny(import.meta.url)) {
  const i = process.argv.indexOf('--root');
  const root = i > -1 ? resolve(process.argv[i + 1]) : resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const t = znajdz(root);
  if (t.length) {
    console.error('check:znaczniki — znaczniki konfliktu scalenia w plikach śledzonych:');
    for (const x of t) console.error(`  ${x.plik}:${x.linia}  ${x.tekst}`);
    console.error(`Jak naprawić: rozstrzygnij konflikt (usuń wiersze <<<<<<<, =======, >>>>>>> i wybierz treść). Legalny przykład w dokumencie: wpis z powodem w ${ZAKRES.wyjatki}.`);
    process.exit(1);
  }
  console.log('check:znaczniki — brak znaczników konfliktu w plikach śledzonych');
}
