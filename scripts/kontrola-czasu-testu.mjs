// Strażnik czasu pojedynczego testu (decyzja właściciela 05.11.2026 ~11:40 UTC, lekcja o `tests/audit-k1-bl-mer.test.tsx` w docs/40; wariant A).
// Odrzuca przypadek `test(...)`, który w tym przebiegu Jest trwał dłużej niż `prog_czasu_testu` (scripts/ci/czasy-tests.json — jedyne miejsce liczby)
// jego limitu czasu. Test zbliżający się do limitu zaczyna padać na obciążonej maszynie, a jest-ponow ponawia cały plik i część Jest wypada poza limit zadania.
// Czasy: wynik JSON Jest zapisany przez scripts/jest-ponow.mjs (JEST_PONOW_WYNIK), assertionResults[].duration.
// Limit: EFEKTYWNY limit przypadku zapisany w czasie działania przez tests/setup-limity-czasu.js (JEST_LIMITY_PLIK; wiersze JSON { plik, test, limit }) —
//   to, czego jest-circus naprawdę użył (trzeci argument test/it, test.each, jest.setTimeout, testTimeout). Poprawka 05.11.2026 po przebiegu dowodowym
//   tests.yml 42039115183: statyczny odczyt tekstu pliku dawał 129 fałszywych zgłoszeń (123 z limitem „5 s” przy testach trwających do 138 s).
//   Przypadek bez zapisanego limitu → kod 2 z listą (nie cichy sukces).
// Zapadka (wzór BEZ_KONTEKSTU_MAX / ROZJAZDY_POZA_ZAKRESEM): tests/czas-testu-wyjatki.json = lista bazowa przypadków ponad progiem (powód, data, plan).
//   NOWY przypadek ponad progiem → odmowa; wpis, którego przypadek (obecny w wyniku tej części) mieści się już w progu × `zapadka_margines` → odmowa
//   (lista tylko maleje; margines chroni przed migotaniem przypadków tuż nad progiem). Wpis bez przypadku w wyniku (inna część Jest) jest pomijany.
// Zakres (decyzja właściciela 05.11.2026 ~15:35 UTC, wariant A; powód: przebieg dowodowy 2 — miganie przypadków z limitem 5 s, 2,7–3,2 s ↔ 0,9 s):
//   kontrola obejmuje tylko przypadki z limitem ≥ `min_limit_kontroli_s` (scripts/ci/czasy-tests.json); przypadki z krótszym limitem są pomijane (licznik „poza zakresem”),
//   a wpis bazowy z takim przypadkiem nie jest ani wymagany, ani „zbędny”. Ryzyko z lekcji to testy długie (526 s przy limicie 480 s).
// Brak wyniku albo brak czasów → kod 2 z komunikatem. Naruszenie → kod 1 z listą testów do podziału i gotowymi wpisami JSON.
// Użycie: node scripts/kontrola-czasu-testu.mjs <wynik.json> [--limity <plik>] [--root <katalog>] [--propozycja]
//   --limity domyślnie z JEST_LIMITY_PLIK; --propozycja wypisuje na stdout gotowe wpisy JSON (stan bazowy) dla przypadków ponad progiem i kończy kodem 0.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOREN = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const klucz = (plik, test) => `${plik}\t${test}`;

/** Wiersze zapisane przez tests/setup-limity-czasu.js → { klucz: limit (ms) | null }. Wiele wierszy tego samego przypadku (ponowienie pliku) — ostatni, a nieznany (null) nie nadpisuje znanego. */
export function wczytajLimity(tekst) {
  const limity = {}; let uszkodzone = 0;
  for (const wiersz of String(tekst).split('\n')) {
    if (!wiersz.trim()) continue;
    let w; try { w = JSON.parse(wiersz); } catch { uszkodzone++; continue; }
    if (!w || typeof w.plik !== 'string' || typeof w.test !== 'string') { uszkodzone++; continue; }
    const k = klucz(w.plik, w.test);
    if (typeof w.limit === 'number' && w.limit > 0) limity[k] = w.limit; else if (!(k in limity)) limity[k] = null;
  }
  return { limity, uszkodzone };
}

/**
 * Ocena wyniku Jest. `limity` — obiekt { klucz(plik, pełna nazwa): limit ms | null } (z wczytajLimity). Zwraca
 * { naruszenia, wyjatki, zbedne, bezLimitu, pozaZakresem, zmierzone } albo { bladCzasow }.
 * Naruszenie: { plik, test, ms, limit, udzial }. Zbędny: wyjątek, którego przypadek mieści się w progu × margines (zapadka).
 */
export function ocenCzasy(wynik, { prog, limity = {}, wyjatki = [], margines = 1, korzen = '', minLimit = 0 }) {
  const pliki = (wynik && wynik.testResults) || [];
  const przypadki = pliki.flatMap(f => (f.assertionResults || []).map(a => ({ plik: String(f.name).replace(korzen ? korzen.replace(/\/?$/, '/') : '', ''), a })))
    .filter(({ a }) => typeof a.duration === 'number');
  if (!pliki.length) return { bladCzasow: 'wynik Jest nie zawiera żadnego pliku testowego — brak czasów do sprawdzenia' };
  if (!przypadki.length) return { bladCzasow: 'wynik Jest nie zawiera czasów przypadków (assertionResults[].duration) — brak czasów do sprawdzenia' };
  const naruszenia = []; const uzyte = []; const zbedne = []; const bezLimitu = []; let pozaZakresem = 0;
  for (const { plik, a } of przypadki) {
    const test = a.fullName || a.title;
    const limit = limity[klucz(plik, test)];
    const w = wyjatki.find(x => x.plik === plik && x.test === test);
    if (!limit) { bezLimitu.push({ plik, test, ms: a.duration }); continue; }
    if (limit < minLimit) { pozaZakresem++; continue; }
    const n = { plik, test, ms: a.duration, limit, udzial: a.duration / limit };
    if (a.duration > prog * limit) (w ? uzyte : naruszenia).push(w ? { ...n, wyjatek: w } : n);
    else if (w && a.duration <= prog * limit * margines) zbedne.push({ ...n, wyjatek: w });
  }
  return { naruszenia, wyjatki: uzyte, zbedne, bezLimitu, pozaZakresem, zmierzone: przypadki.length };
}

/** Gotowy wpis do tests/czas-testu-wyjatki.json dla przypadku ponad progiem (stan bazowy). */
export const wpisBazowy = (n, data = '05.11.2026') => ({
  plik: n.plik, test: n.test,
  powod: `stan bazowy ${data}: ${(n.ms / 1000).toFixed(1)} s z limitu ${n.limit / 1000} s (${Math.round(n.udzial * 100)}%) w przebiegu tests.yml (zapadka: lista tylko maleje)`,
  data,
  plan: 'Podział przypadku (np. jeden na język albo rodzinę) albo skrócenie; po poprawie usunąć wpis — kontrola odrzuca wpis, którego przypadek mieści się już w progu.',
});

export function main(argv) {
  const opcja = nazwa => { const i = argv.indexOf(nazwa); return i >= 0 ? argv[i + 1] : undefined; };
  const korzen = opcja('--root') ? resolve(opcja('--root')) : KOREN;
  const propozycja = argv.includes('--propozycja');
  const plikLimitow = opcja('--limity') ?? process.env.JEST_LIMITY_PLIK;
  const plikWyniku = argv.find((x, i) => !x.startsWith('--') && !['--root', '--limity'].includes(argv[i - 1]));
  if (!plikWyniku || !existsSync(plikWyniku)) { console.error(`kontrola-czasu-testu: brak pliku wyniku Jest (${plikWyniku ?? 'nie podano'}) — nie ma czasów, kontrola NIE przeszła (JEST_PONOW_WYNIK w kroku Jest?)`); return 2; }
  if (!plikLimitow || !existsSync(plikLimitow)) { console.error(`kontrola-czasu-testu: brak pliku limitów przypadków (${plikLimitow ?? 'nie podano'}) — kontrola NIE przeszła (JEST_LIMITY_PLIK w kroku Jest? tests/setup-limity-czasu.js w jest.setupFilesAfterEnv?)`); return 2; }
  let wynik; try { wynik = JSON.parse(readFileSync(plikWyniku, 'utf8')); } catch { console.error('kontrola-czasu-testu: plik wyniku Jest nie jest poprawnym JSON — kontrola NIE przeszła'); return 2; }
  const czasy = JSON.parse(readFileSync(join(korzen, 'scripts/ci/czasy-tests.json'), 'utf8'));
  const prog = czasy.prog_czasu_testu;
  if (!(prog > 0 && prog <= 1)) { console.error('kontrola-czasu-testu: brak prog_czasu_testu (0–1) w scripts/ci/czasy-tests.json'); return 2; }
  const minLimit = czasy.min_limit_kontroli_s * 1000;
  if (!(minLimit > 0)) { console.error('kontrola-czasu-testu: brak min_limit_kontroli_s (> 0) w scripts/ci/czasy-tests.json'); return 2; }
  const margines = czasy.zapadka_margines ?? 1;
  if (!(margines > 0 && margines <= 1)) { console.error('kontrola-czasu-testu: zapadka_margines (0–1) w scripts/ci/czasy-tests.json jest niepoprawny'); return 2; }
  const dw = join(korzen, 'tests/czas-testu-wyjatki.json');
  const wyjatki = existsSync(dw) ? JSON.parse(readFileSync(dw, 'utf8')).wyjatki || [] : [];
  const { limity, uszkodzone } = wczytajLimity(readFileSync(plikLimitow, 'utf8'));
  const r = ocenCzasy(wynik, { prog, limity, wyjatki, margines, korzen, minLimit });
  if (r.bladCzasow) { console.error(`kontrola-czasu-testu: ${r.bladCzasow}`); return 2; }
  const proc = x => `${Math.round(x * 100)}%`;
  const opis = n => `${n.plik} — "${n.test}" — ${(n.ms / 1000).toFixed(1)} s z limitu ${n.limit / 1000} s (${proc(n.udzial)})`;
  if (propozycja) {
    console.log(JSON.stringify(r.naruszenia.map(n => wpisBazowy(n)), null, 2));
    console.error(`kontrola-czasu-testu --propozycja: ${r.naruszenia.length} nowych wpisów bazowych, ${r.zbedne.length} zbędnych wpisów, ${r.bezLimitu.length} przypadków bez znanego limitu`);
    return 0;
  }
  console.log(`kontrola-czasu-testu: ${r.zmierzone} przypadków, próg ${proc(prog)} limitu; ponad progiem: ${r.naruszenia.length}, z wyjątkiem: ${r.wyjatki.length}, zbędne wyjątki: ${r.zbedne.length}, bez znanego limitu: ${r.bezLimitu.length}, poza zakresem (limit < ${czasy.min_limit_kontroli_s} s): ${r.pozaZakresem}`);
  for (const w of r.wyjatki) console.log(`  wyjątek (${w.wyjatek.data}): ${opis(w)}; plan: ${w.wyjatek.plan}`);
  if (uszkodzone) console.error(`kontrola-czasu-testu: ${uszkodzone} uszkodzonych wierszy w pliku limitów (pominięte)`);
  let kod = 0;
  if (r.bezLimitu.length) {
    console.error(`\nkontrola-czasu-testu: ${r.bezLimitu.length} przypadków bez znanego limitu (brak wiersza z tests/setup-limity-czasu.js — np. test.concurrent albo inna nazwa) — kontrola NIE przeszła, nie zgadujemy limitu:`);
    for (const n of r.bezLimitu) console.error(`  - ${n.plik} — "${n.test}" — ${(n.ms / 1000).toFixed(1)} s`);
    kod = 2;
  }
  if (r.zbedne.length) {
    console.error(`\nkontrola-czasu-testu: ${r.zbedne.length} wpisów w tests/czas-testu-wyjatki.json już mieści się w progu (poniżej ${proc(prog * margines)} limitu) — usuń je (zapadka: lista tylko maleje):`);
    for (const n of r.zbedne) console.error(`  - ${opis(n)}`);
    kod = kod || 1;
  }
  if (r.naruszenia.length) {
    console.error(`\nkontrola-czasu-testu: ${r.naruszenia.length} NOWYCH przypadków trwa ponad ${proc(prog)} swojego limitu — podziel je (np. jeden przypadek na język albo na rodzinę); wyjątek tylko z powodem i planem w tests/czas-testu-wyjatki.json (zapadka: nowych wpisów nie dopisuje się dla nowych testów):`);
    for (const n of r.naruszenia) console.error(`  - ${opis(n)}`);
    console.error('\nGotowe wpisy (stan bazowy; do wklejenia w "wyjatki" tylko przy ustalaniu bazy):');
    console.error(JSON.stringify(r.naruszenia.map(n => wpisBazowy(n)), null, 2));
    kod = kod || 1;
  }
  return kod;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
