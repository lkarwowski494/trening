/*
 * M1-audytor-generalny-037 część B (DEC-07 b, właściciel 27.10.2026: „wybrane przed zgłoszeniem 1.0”): dokumenty wydania.
 *  - 10-wydanie-005: plan „zły build” (docs/42 pkt 4) miał dwa znaczniki [DO PRZECZYTANIA] — skutek wycofania ze sprzedaży dla zainstalowanych kopii
 *    i przyspieszona recenzja. Teraz oba punkty mają przeczytane strony Apple (adres, cytat, data odczytu 27.10.2026).
 *  - 02-monetyzacja-506: decyzja z 13.10.2026 „Wyjątek Ukraina” (niższy punkt cenowy, żeby „tańsze niż espresso” było prawdziwe) zamknięta jako
 *    zastąpiona: od 21.10.2026 opis mówi „w cenie porównywalnej z jednym espresso w barze” (przedział 1,06–1,51 €), więc osobny punkt cenowy UA nie jest
 *    potrzebny; zostaje sprawdzenie cen planu miesięcznego we wszystkich krajach wobec 1,51 € (krok Z-10b w docs/48, eksport z App Store Connect).
 * Rodzaje (docs/20): dokument, strażnik. Bez ekranu (zmiana tylko w dokumentach).
 */
import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
/** Wpisy dziennika decyzji przez scripts/decyzje.mjs (Jest nie ładuje .mjs wprost — jak w tests/decyzje-straznik.test.ts). */
const wpisyDecyzji = (): { data: string; tekst: string }[] => {
  const plik = JSON.stringify(path.join(root, 'docs/18-przekazanie.md')), skrypt = JSON.stringify(path.join(root, 'scripts/decyzje.mjs'));
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${skrypt}; const t = (await import('node:fs')).readFileSync(${plik}, 'utf8'); console.log(JSON.stringify(m.wpisy(t)));`], { encoding: 'utf8', cwd: root });
  if (r.status !== 0) throw new Error(r.stderr);
  return JSON.parse(r.stdout);
};
const sekcja = (d: string, od: string, doo: string) => d.slice(d.indexOf(od), d.indexOf(doo, d.indexOf(od) + 1));

describe('10-wydanie-005: plan „zły build” bez znaczników [DO PRZECZYTANIA] (DEC-07 b, 27.10.2026)', () => {
  const s = sekcja(read('docs/42-plan-wydania-1.0.md'), '## 4. Zły build', '## 5.');
  test('pkt 4 nie ma [DO PRZECZYTANIA]', () => {
    expect(s.length).toBeGreaterThan(500);
    expect(s).not.toMatch(/DO PRZECZYTANIA/);
  });
  test('wycofanie ze sprzedaży: strona Apple, cytat o zainstalowanych kopiach i dacie odczytu', () => {
    expect(s).toContain('https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/manage-availability-for-your-app-on-the-app-store/');
    expect(s).toContain('Users who previously downloaded your app from the App Store in that country or region will continue to receive app updates.');
    expect(s).toContain('Remove App From Sale');
    expect(s).toMatch(/odczyt 27\.10\.2026/);
  });
  test('przyspieszona recenzja: strona Apple, warunek „krytyczny błąd” i kroki w notatce', () => {
    expect(s).toContain('https://developer.apple.com/help/app-review/after-submitting-for-review/request-expedited-review/');
    expect(s).toContain('Only submissions that have already been sent to App Review can be expedited.');
    expect(s).toContain('include the steps to reproduce the bug on the current version of your app');
  });
});

describe('02-monetyzacja-506: decyzja „Wyjątek Ukraina” z 13.10.2026 zamknięta (DEC-07 b, 27.10.2026)', () => {
  const w = wpisyDecyzji();
  test('wpis z 13.10.2026: pole „zastąpione 27.10.2026” z powodem w treści', () => {
    const ua = w.filter(x => x.data === '2026-10-13' && x.tekst.includes('Wyjątek Ukraina'));
    expect(ua).toHaveLength(1);
    expect(ua[0].tekst).toContain('[wdrożenie: zastąpione 27.10.2026]');
    expect(ua[0].tekst).toMatch(/porównywalnej/);
  });
  test('docs/15: punkt cenowy UA nie jest już [OTWARTE]; opis sklepu bez „tańsze niż espresso” we wszystkich lokalizacjach', () => {
    const d15 = read('docs/15-app-store.md');
    expect(d15).not.toMatch(/Ukraina: niższy punkt cenowy poniżej ceny espresso — \*\*\[OTWARTE\]\*\*/);
    expect(d15).toMatch(/Ukraina[^\n]*zamknięte 27\.10\.2026/);
    const meta = JSON.parse(read('store/app-store-metadata.json')) as { lokalizacje: Record<string, { description: string }> };
    for (const [loc, m] of Object.entries(meta.lokalizacje)) expect({ loc, cheaper: /tańsz[ey] niż espresso|cheaper than (an |one )?espresso/i.test(m.description) }).toEqual({ loc, cheaper: false });
  });
  test('kontrola cen wszystkich krajów wobec 1,51 €: krok Z-10b w docs/48 i zapis w docs/research/espresso-mimit-2026-10.md', () => {
    const z = read('docs/48-zgloszenie-1-0.md').split('\n').find(l => l.startsWith('| Z-10b |')) ?? '';
    expect(z).toMatch(/1,51 €/); expect(z).toMatch(/właściciel/); expect(z).toMatch(/02-monetyzacja-506/);
    expect(read('docs/research/espresso-mimit-2026-10.md')).toMatch(/Z-10b/);
  });
});
