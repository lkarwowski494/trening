// Strażnik czasu pojedynczego testu (decyzja właściciela 05.11.2026 ~11:40 UTC, lekcja o `tests/audit-k1-bl-mer.test.tsx` w docs/40; wariant A).
// Odrzuca przypadek `test(...)`, który w tym przebiegu Jest trwał dłużej niż `prog_czasu_testu` (scripts/ci/czasy-tests.json — jedyne miejsce liczby)
// jego limitu czasu. Test zbliżający się do limitu zaczyna padać na obciążonej maszynie, a jest-ponow ponawia cały plik i część Jest wypada poza limit zadania.
// Czasy: wynik JSON Jest zapisany przez scripts/jest-ponow.mjs (zmienna JEST_PONOW_WYNIK), assertionResults[].duration.
// Limit testu — odczyt statyczny pliku testu (prostszy od haka w środowisku Jest i sprawdzalny testem): największa z liczb
//   `jest.setTimeout(N)`, jawnych limitów przypadku `}, N)` (N >= 1000) i limitu domyślnego z package.json (jest.testTimeout, domyślnie 5000).
//   Największa, bo plik nie mówi, który limit należy do którego przypadku — kontrola jest zachowawcza (nie zgłasza fałszywie, może przeoczyć krótki test w pliku z długim limitem).
// Wyjątki (test, którego nie da się teraz podzielić): tests/czas-testu-wyjatki.json — plik, pełna nazwa testu, powód, data, plan.
// Brak wyniku albo brak czasów → kod 2 z komunikatem (nie cichy sukces). Naruszenie → kod 1 z listą testów do podziału.
// Użycie: node scripts/kontrola-czasu-testu.mjs <wynik.json> [--root <katalog>]
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOREN = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const liczba = t => Number(String(t).replace(/_/g, ''));

/** Limit czasu przypadków pliku testowego (ms) i skąd pochodzi. */
export function limitPliku(zrodlo, domyslny = 5000) {
  const kandydaci = [...String(zrodlo).matchAll(/jest\.setTimeout\(\s*(\d[\d_]*)\s*\)/g)].map(m => liczba(m[1]));
  const jawne = [...String(zrodlo).matchAll(/\}\s*,\s*(\d[\d_]*)\s*\)/g)].map(m => liczba(m[1])).filter(n => n >= 1000);
  const wszystkie = [domyslny, ...kandydaci, ...jawne];
  const limit = Math.max(...wszystkie);
  return { limit, zrodlo: limit === domyslny ? 'domyślny' : kandydaci.includes(limit) ? 'jest.setTimeout' : 'jawny limit przypadku' };
}

/**
 * Ocena wyniku Jest. `odczytaj(plik)` zwraca treść pliku testu (albo null). Zwraca { naruszenia, wyjatki, zmierzone }.
 * Naruszenie: { plik, test, ms, limit, udzial }. `bladCzasow` niepuste, gdy nie ma z czego liczyć.
 */
export function ocenCzasy(wynik, { prog, odczytaj, wyjatki = [], domyslny = 5000, korzen = '' }) {
  const pliki = (wynik && wynik.testResults) || [];
  const przypadki = pliki.flatMap(f => (f.assertionResults || []).map(a => ({ plik: String(f.name).replace(korzen ? korzen.replace(/\/?$/, '/') : '', ''), a })))
    .filter(({ a }) => typeof a.duration === 'number');
  if (!pliki.length) return { bladCzasow: 'wynik Jest nie zawiera żadnego pliku testowego — brak czasów do sprawdzenia', naruszenia: [], wyjatki: [], zmierzone: 0 };
  if (!przypadki.length) return { bladCzasow: 'wynik Jest nie zawiera czasów przypadków (assertionResults[].duration) — brak czasów do sprawdzenia', naruszenia: [], wyjatki: [], zmierzone: 0 };
  const naruszenia = []; const uzyte = [];
  const cache = new Map();
  for (const { plik, a } of przypadki) {
    if (!cache.has(plik)) { const z = odczytaj(plik); cache.set(plik, z == null ? { limit: domyslny, zrodlo: 'domyślny (pliku nie odczytano)' } : limitPliku(z, domyslny)); }
    const { limit, zrodlo } = cache.get(plik);
    if (a.duration <= prog * limit) continue;
    const n = { plik, test: a.fullName || a.title, ms: a.duration, limit, zrodlo, udzial: a.duration / limit };
    const w = wyjatki.find(x => x.plik === plik && x.test === n.test);
    (w ? uzyte : naruszenia).push(w ? { ...n, wyjatek: w } : n);
  }
  return { naruszenia, wyjatki: uzyte, zmierzone: przypadki.length };
}

export function main(argv) {
  const iKoren = argv.indexOf('--root'); const korzen = iKoren >= 0 ? resolve(argv[iKoren + 1]) : KOREN;
  const plikWyniku = argv.find((x, i) => !x.startsWith('--') && argv[i - 1] !== '--root');
  if (!plikWyniku || !existsSync(plikWyniku)) { console.error(`kontrola-czasu-testu: brak pliku wyniku Jest (${plikWyniku ?? 'nie podano'}) — nie ma czasów, kontrola NIE przeszła (JEST_PONOW_WYNIK w kroku Jest?)`); return 2; }
  let wynik; try { wynik = JSON.parse(readFileSync(plikWyniku, 'utf8')); } catch { console.error('kontrola-czasu-testu: plik wyniku Jest nie jest poprawnym JSON — kontrola NIE przeszła'); return 2; }
  const czasy = JSON.parse(readFileSync(join(korzen, 'scripts/ci/czasy-tests.json'), 'utf8'));
  const prog = czasy.prog_czasu_testu;
  if (!(prog > 0 && prog <= 1)) { console.error('kontrola-czasu-testu: brak prog_czasu_testu (0–1) w scripts/ci/czasy-tests.json'); return 2; }
  const pkg = JSON.parse(readFileSync(join(korzen, 'package.json'), 'utf8'));
  const dw = join(korzen, 'tests/czas-testu-wyjatki.json');
  const wyjatki = existsSync(dw) ? JSON.parse(readFileSync(dw, 'utf8')).wyjatki || [] : [];
  const odczytaj = p => { try { return readFileSync(join(korzen, p), 'utf8'); } catch { return null; } };
  const r = ocenCzasy(wynik, { prog, odczytaj, wyjatki, domyslny: pkg.jest?.testTimeout ?? 5000, korzen });
  if (r.bladCzasow) { console.error(`kontrola-czasu-testu: ${r.bladCzasow}`); return 2; }
  const proc = x => `${Math.round(x * 100)}%`;
  console.log(`kontrola-czasu-testu: ${r.zmierzone} przypadków, próg ${proc(prog)} limitu; ponad progiem: ${r.naruszenia.length}, z wyjątkiem: ${r.wyjatki.length}`);
  for (const w of r.wyjatki) console.log(`  wyjątek (${w.wyjatek.data}): ${w.plik} — ${w.test} — ${(w.ms / 1000).toFixed(1)} s z ${w.limit / 1000} s (${proc(w.udzial)}); plan: ${w.wyjatek.plan}`);
  if (r.naruszenia.length) {
    console.error(`\nkontrola-czasu-testu: ${r.naruszenia.length} przypadków trwa ponad ${proc(prog)} swojego limitu — podziel je (np. jeden przypadek na język albo na rodzinę) albo dopisz wyjątek z powodem i planem w tests/czas-testu-wyjatki.json:`);
    for (const n of r.naruszenia) console.error(`  - ${n.plik} — "${n.test}" — ${(n.ms / 1000).toFixed(1)} s z limitu ${n.limit / 1000} s (${proc(n.udzial)}; limit: ${n.zrodlo})`);
    return 1;
  }
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
