// check:pochodne (decyzja właściciela 8a, 28.10.2026; lekcje L-040, L-041 i wpis „naprawy M2 partia 1” w docs/40): jedno polecenie, które w haku pre-push łapie
// klasę błędów „zmiana nie dotarła do pliku pochodnego albo do strażnika czytającego kod jako tekst”. Uruchamia (równolegle, wynik tylko przy błędzie):
//  - generatory w trybie --check: README, macierz testów, konteksty tłumaczeń, wskazówki, figury v1/v2 (+ schemat), sprzęt, katalog przepływów, rejestr źródeł runtime, licencje, rejestr twierdzeń;
//  - wektory BRD (kontrola-brd --wektory porównane z tests/wektory/brd.json; skrypt nie ma trybu check);
//  - testy-pliki pochodne: lib/locales/_source.json, pliki zegarka (watch-fixtures, watch-apple-i18n) i widżetu (widget-i18n);
//  - szybkie strażniki czytające źródła jako tekst (wzorce interakcji, repo publiczne, limity architektury, przepływy, stuknięcia Maestro, tokeny wyglądu).
// Nie wchodzi: check:decyzje (kontrola dokumentu, nie pliku pochodnego), lint, typecheck, pełny jest — to robi verify.
// Użycie: node scripts/pochodne.mjs [--lista]   (kod 1 = którykolwiek krok czerwony). Test: tests/pochodne.test.ts.
// Test wstrzykuje własną listę kroków przez POCHODNE_KROKI=<plik.json> (tablica {nazwa, polecenie:[...], jak}); tylko do testów.
import { spawn } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
/* Strażniki czytające źródła jako tekst — jedna lista (liczby w jednym miejscu). */
export const STRAZNIKI = [
  'tests/interaction-guards.test.ts', 'tests/public-repo.test.ts', 'tests/architecture-limits.test.ts',
  'tests/przeplywy.test.ts', 'tests/maestro-tap-tekst-guard.test.ts', 'tests/m3-token-guard.test.ts',
];
const POCHODNE_JEST = ['tests/watch-fixtures.test.ts', 'tests/watch-apple-i18n.test.ts', 'tests/widget-i18n.test.ts'];
const JEST = ['npx', 'jest', '--maxWorkers=1', '--silent'];

export const KROKI = [
  { nazwa: 'README', polecenie: ['node', 'scripts/readme.mjs', '--check'], jak: 'node scripts/readme.mjs --write, potem git add README.md.' },
  { nazwa: 'macierz testów', polecenie: ['node', 'scripts/test-matrix.mjs', '--check'], jak: 'najpierw git add nowych plików testów (macierz liczy tylko pliki śledzone), potem node scripts/test-matrix.mjs --write i git add docs; brakujące testy dopisz, nie wyłączaj sprawdzenia.' },
  { nazwa: 'konteksty tłumaczeń', polecenie: ['node', 'scripts/i18n-context.mjs', '--check'], jak: 'node scripts/i18n-context.mjs --write, potem git add docs/lokalizacja/konteksty.json.' },
  { nazwa: 'wskazówki (cues)', polecenie: ['node', 'scripts/cues/gen.mjs', '--check'], jak: 'node scripts/cues/gen.mjs (zapis), potem git add docs.' },
  { nazwa: 'figury v1', polecenie: ['node', 'scripts/figures/gen.mjs', '--check'], jak: 'node scripts/figures/gen.mjs (zapis), potem git add docs.' },
  { nazwa: 'figury v2', polecenie: ['node', 'scripts/figures/v2-gen.mjs', '--check'], jak: 'node scripts/figures/v2-gen.mjs --write, potem git add docs.' },
  { nazwa: 'schemat figur v2', polecenie: ['node', 'scripts/figures/v2-validate.mjs', '--schema', '--check'], jak: 'node scripts/figures/v2-validate.mjs --schema --write, potem git add docs/schemas.' },
  { nazwa: 'sprzęt', polecenie: ['node', 'scripts/equipment/gen.mjs', '--check'], jak: 'node scripts/equipment/gen.mjs (zapis), potem git add docs.' },
  { nazwa: 'katalog przepływów', polecenie: ['node', 'scripts/flows-catalog.mjs', '--check'], jak: 'node scripts/flows-catalog.mjs --write, potem git add docs.' },
  { nazwa: 'źródła runtime', polecenie: ['node', 'scripts/zrodla-runtime.mjs', '--check'], jak: 'node scripts/zrodla-runtime.mjs --write, potem git add lib.' },
  { nazwa: 'licencje', polecenie: ['node', 'scripts/licenses.mjs', '--check'], jak: 'node scripts/licenses.mjs (zapis), potem git add docs.' },
  { nazwa: 'rejestr twierdzeń', polecenie: ['node', 'scripts/claims.mjs', '--check'], jak: 'node scripts/claims.mjs --stub (nowy/zmieniony tekst), po przeglądzie źródeł --rehash <ID>.' },
  { nazwa: 'wektory BRD', funkcja: 'wektoryBrd', jak: 'node scripts/kontrola-brd.mjs docs/brd --wektory > tests/wektory/brd.json, potem git add tests/wektory.' },
  { nazwa: 'lib/locales/_source.json', polecenie: [...JEST, 'tests/i18n-locales.test.ts', '-t', '_source.json'], jak: 'UPDATE_I18N=1 npx jest tests/i18n-locales.test.ts -t _source.json, potem git add lib/locales/_source.json.' },
  { nazwa: 'pliki zegarka i widżetu + strażniki tekstowe', polecenie: [...JEST, ...POCHODNE_JEST, ...STRAZNIKI], jak: 'zegarek: UPDATE_WATCH=1 UPDATE_WATCH_APPLE=1 npx jest tests/watch-fixtures.test.ts tests/watch-apple-i18n.test.ts; widżet: UPDATE_WIDGET=1 npx jest tests/widget-i18n.test.ts; strażnik tekstowy — popraw kod albo (jeśli zmiana zamierzona) test, po przeczytaniu komunikatu; potem git add.' },
];

const WSPOLBIEZNOSC = 3; // maszyna bywa współdzielona (4 rdzenie)

function uruchom(polecenie) {
  return new Promise(res => {
    const p = spawn(polecenie[0], polecenie.slice(1), { cwd: ROOT, env: process.env });
    let out = ''; p.stdout.on('data', d => { out += d; }); p.stderr.on('data', d => { out += d; });
    p.on('error', e => res({ ok: false, out: String(e) }));
    p.on('close', kod => res({ ok: kod === 0, out }));
  });
}

async function wektoryBrd() {
  const r = await uruchom(['node', 'scripts/kontrola-brd.mjs', 'docs/brd', '--wektory']);
  if (!r.ok) return r;
  const plik = join(ROOT, 'tests/wektory/brd.json');
  const mam = existsSync(plik) ? readFileSync(plik, 'utf8') : '';
  return { ok: mam.trim() === r.out.trim(), out: 'tests/wektory/brd.json różni się od wyniku kontrola-brd --wektory' };
}
const FUNKCJE = { wektoryBrd };

export async function pochodne(kroki, log = m => process.stderr.write(m + '\n')) {
  const start = Date.now(); const kolejka = [...kroki]; const bledy = [];
  async function pracownik() {
    for (let k = kolejka.shift(); k; k = kolejka.shift()) {
      const t0 = Date.now();
      const r = k.funkcja ? await FUNKCJE[k.funkcja]() : await uruchom(k.polecenie);
      log(`check:pochodne: ${r.ok ? 'ok ' : 'BŁĄD'} ${k.nazwa} (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
      if (!r.ok) bledy.push({ ...k, out: r.out });
    }
  }
  // Najdłuższe kroki (jest) pierwsze, żeby nie czekały na końcu.
  kolejka.sort((a, b) => (b.polecenie?.[0] === 'npx') - (a.polecenie?.[0] === 'npx'));
  await Promise.all(Array.from({ length: Math.min(WSPOLBIEZNOSC, kroki.length) }, pracownik));
  for (const b of bledy) log(`\n--- ${b.nazwa} ---\n${b.out.trim().split('\n').slice(-40).join('\n')}\nJak naprawić: ${b.jak}`);
  log(bledy.length ? `\ncheck:pochodne: ${bledy.length} z ${kroki.length} kroków czerwone: ${bledy.map(b => b.nazwa).join('; ')}` : `check:pochodne: zielone (${kroki.length} kroków, ${((Date.now() - start) / 1000).toFixed(0)} s)`);
  return bledy.length ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (process.argv.includes('--lista')) { for (const k of KROKI) console.log(k.nazwa); process.exit(0); }
  const kroki = process.env.POCHODNE_KROKI ? JSON.parse(readFileSync(process.env.POCHODNE_KROKI, 'utf8')) : KROKI;
  process.exit(await pochodne(kroki));
}
