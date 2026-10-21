/*
 * Przeniesienie czystej wersji 1.0 do Apps4Brew (decyzja właściciela 21.10.2026, docs/46): test czystej logiki skryptu
 * scripts/przeniesienie-1.0.mjs (lista → plan, strażnik nazw, odwołania do usuniętych plików) oraz samej listy
 * scripts/przeniesienie-1.0.json. Skrypt działa tylko w trybie podglądu — test niczego nie buduje z `git archive`.
 * Nazwy firm w przykładach biorą się z tests/forbidden-names (ten plik ich nie zawiera).
 */
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { ALL_NAMES } from './forbidden-names';

const root = path.join(__dirname, '..');
const SKRYPT = path.join(root, 'scripts/przeniesienie-1.0.mjs');
const LISTA = JSON.parse(fs.readFileSync(path.join(root, 'scripts/przeniesienie-1.0.json'), 'utf8'));
const CFG = JSON.parse(fs.readFileSync(path.join(root, 'tests/forbidden-names.json'), 'utf8'));
const doc = fs.readFileSync(path.join(root, 'docs/46-przeniesienie-1.0.md'), 'utf8');

/** Wywołuje wyrażenie na module skryptu (moduł ESM, import przez osobny proces node) i zwraca wynik jako JSON. */
const wywolaj = (expr: string, dane: unknown = {}) =>
  JSON.parse(execFileSync('node', ['--input-type=module', '-e',
    `import * as m from ${JSON.stringify('file://' + SKRYPT)}; const d = ${JSON.stringify(dane)}; console.log(JSON.stringify(${expr}))`], { encoding: 'utf8' }));

const w = (sciezka: string, akcja: string, powod = 'powód testowy, dość długi') => ({ sciezka, akcja, powod });
const slowo = CFG.exceptions.find((x: any) => x.path.startsWith('lib/locales/'))!;
const firma = ALL_NAMES.find(n => n.toLowerCase() === 'hevy')!;

describe('przeniesienie 1.0: lista → plan', () => {
  const pliki = ['a.ts', 'docs/x.md', 'docs/k/a.md', 'docs/k/b.md', 'docs/k/wazny.md', 'docs/d.md', 'docs/p.md', 'docs/m.md'];
  const lista = { wpisy: [w('docs/x.md', 'usun'), w('docs/k/', 'dysk'), w('docs/k/wazny.md', 'zostaje'), w('docs/d.md', 'decyzja'), w('docs/p.md', 'popraw'), w('docs/nie-ma.md', 'usun')] };

  test('akcje: usun/dysk usuwają, zostaje/popraw/brak wpisu zostają; wpis dłuższy wygrywa z katalogiem', () => {
    const p = wywolaj('m.zbudujPlan(d.pliki, d.lista)', { pliki, lista });
    expect(p.zostaje).toEqual(['a.ts', 'docs/d.md', 'docs/k/wazny.md', 'docs/m.md', 'docs/p.md']);
    expect(p.usuniete.map((x: any) => x.plik)).toEqual(['docs/k/a.md', 'docs/k/b.md', 'docs/x.md']);
    expect(p.naDysk.map((x: any) => x.plik)).toEqual(['docs/k/a.md', 'docs/k/b.md']);
    expect(p.popraw.map((x: any) => x.plik)).toEqual(['docs/p.md']);
  });
  test('„decyzja”: domyślnie zostaje, z decyzje=usun znika; wpis bez pliku jest zgłoszony', () => {
    const z = wywolaj('m.zbudujPlan(d.pliki, d.lista)', { pliki, lista });
    expect(z.decyzje.map((x: any) => x.plik)).toEqual(['docs/d.md']);
    expect(z.zostaje).toContain('docs/d.md');
    expect(z.wpisyBezPlikow).toEqual(['docs/nie-ma.md']);
    const u = wywolaj("m.zbudujPlan(d.pliki, d.lista, { decyzje: 'usun' })", { pliki, lista });
    expect(u.zostaje).not.toContain('docs/d.md');
    expect(u.usuniete.map((x: any) => x.plik)).toContain('docs/d.md');
  });
  test('lista niepoprawna: nieznana akcja, brak powodu, powtórzenie, ścieżka bezwzględna, pusta — błąd', () => {
    const bledy = (l: unknown) => wywolaj('m.sprawdzListe(d)', l);
    expect(bledy({ wpisy: [w('a', 'kasuj')] })[0]).toContain('nieznana akcja');
    expect(bledy({ wpisy: [{ sciezka: 'a', akcja: 'usun', powod: 'x' }] })[0]).toContain('brak powodu');
    expect(bledy({ wpisy: [w('a', 'usun'), w('a', 'dysk')] })[0]).toContain('powtórzony');
    expect(bledy({ wpisy: [w('/a', 'usun')] })[0]).toContain('względna');
    expect(bledy({ wpisy: [] })).toEqual(['lista nie ma wpisów']);
    expect(() => wywolaj('m.zbudujPlan(["a"], { wpisy: [] })')).toThrow();
  });
});

describe('przeniesienie 1.0: strażnik nazw na drzewie', () => {
  const dane = (pliki: Record<string, string>) => ({ pliki, cfg: CFG });
  test('nazwa w kodzie bez wyjątku = błąd; w dokumencie = poza zakresem; z wyjątkiem = dozwolona', () => {
    const wyj = CFG.exceptions[0];
    const s = wywolaj('m.straznikNazw(d.pliki, d.cfg)', dane({
      'lib/x.ts': `// format ${firma}a`,
      'docs/y.md': `porównanie z ${firma}`,
      [wyj.path]: `klucz ${wyj.name}`,
      'lib/czysty.ts': 'bez nazw',
    }));
    expect(s.wZakresie).toEqual([{ plik: 'lib/x.ts', nazwa: firma }]);
    expect(s.pozaZakresem).toEqual([{ plik: 'docs/y.md', nazwa: firma }]);
    expect(s.zWyjatkiem).toEqual([{ plik: wyj.path, nazwa: wyj.name }]);
  });
  test('wyjątek bez trafienia jest zgłaszany jako zbędny; sam plik listy nazw nie jest skanowany', () => {
    const s = wywolaj('m.straznikNazw(d.pliki, d.cfg)', dane({ 'tests/forbidden-names.json': JSON.stringify(CFG), 'lib/x.ts': 'x' }));
    expect(s.wZakresie).toEqual([]);
    expect(s.nieuzyteWyjatki.length).toBe(CFG.exceptions.length);
  });
  test('miękki przegląd łapie małe litery poza docs/, ale pomija docs/ i słowa obce z wyjątków słowników (lib/locales)', () => {
    const m = wywolaj('m.miekkiPrzeglad(d.pliki, d.cfg)', dane({ 'tests/a.test.ts': `/${firma.toLowerCase()}/i`, 'docs/b.md': firma, [slowo.path]: slowo.name }));
    expect(m).toEqual([{ plik: 'tests/a.test.ts', nazwy: [firma.toLowerCase()] }]);
  });
});

describe('przeniesienie 1.0: odwołania do usuniętych plików', () => {
  test('odczyt (read/join/exists) to „czyta”, komentarz to „wzmianka”; katalog liczy się prefiksem', () => {
    const o = wywolaj('m.odwolania(d.zrodla, d.usuniete)', {
      usuniete: ['docs/stary-dokument.md', 'docs/katalog/'],
      zrodla: {
        'tests/a.test.ts': "const t = fs.readFileSync(path.join(root, 'docs/stary-dokument.md'), 'utf8');",
        'tests/b.test.ts': '// patrz docs/stary-dokument.md i docs/katalog/raport.md',
        'tests/c.test.ts': "const x = readdirSync(join(root, 'docs/katalog/'))",
        'tests/d.test.ts': 'bez odwołań',
      },
    });
    expect(o).toEqual([
      { plik: 'tests/a.test.ts', czyta: ['docs/stary-dokument.md'], wzmianka: [] },
      { plik: 'tests/b.test.ts', czyta: [], wzmianka: ['docs/katalog/', 'docs/stary-dokument.md'] },
      { plik: 'tests/c.test.ts', czyta: ['docs/katalog/'], wzmianka: [] },
    ]);
  });
});

describe('przeniesienie 1.0: lista scripts/przeniesienie-1.0.json i docs/46', () => {
  test('lista jest poprawna i każdy jej wpis wskazuje istniejący plik albo katalog (poza docs/design/ — powstaje po M3)', () => {
    expect(wywolaj('m.sprawdzListe(d)', LISTA)).toEqual([]);
    const brak = LISTA.wpisy.filter((x: any) => x.sciezka !== 'docs/design/' && !fs.existsSync(path.join(root, x.sciezka))).map((x: any) => x.sciezka);
    expect(brak).toEqual([]);
  });
  test('każda pozycja „decyzja” ma w docs/46 numer decyzji D1–D6 w powodzie albo osobny opis', () => {
    for (const x of LISTA.wpisy.filter((e: any) => e.akcja === 'decyzja')) {
      expect({ s: x.sciezka, d: /\bD[1-6]\b/.test(x.powod) }).toEqual({ s: x.sciezka, d: true });
    }
    for (const n of ['D1', 'D2', 'D3', 'D4', 'D5', 'D6']) expect(doc).toContain(`**${n}`);
  });
  test('docs/46 opisuje sekrety, zmienne i kroki właściciela oraz wymienia wszystkie akcje listy', () => {
    for (const s of ['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_KEY_P8', 'ANTHROPIC_API_KEY', 'BUILD_BASE', 'NIGHTLY_REFS', 'MAESTRO_VERSION', 'apps4brew-narzedzia', 'scripts/przeniesienie-1.0.mjs']) expect(doc).toContain(s);
    for (const a of ['zostaje', 'usuń', 'na Dysk', 'decyzja', 'popraw']) expect(doc).toContain(a);
  });
  test('skrypt w trybie podglądu: bez operacji zapisu do sieci (brak push/remote/gh w kodzie)', () => {
    const kod = fs.readFileSync(SKRYPT, 'utf8').split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
    expect(kod).not.toMatch(/['"]push['"]|['"]remote['"]|['"]gh['"]|fetch\(|https?:\/\//);
  });
});
