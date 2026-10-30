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
  test('zamiany i generatory: zamiana zmienia wszystkie wystąpienia i liczy je; niepoprawna zamiana albo polecenie spoza scripts/*.mjs — błąd', () => {
    expect(wywolaj('m.zamien(d.t, d.z, d.na)', { t: 'a/x b/x a/x', z: 'a/x', na: 'Q/y' })).toEqual({ tresc: 'Q/y b/x Q/y', ile: 2 });
    expect(wywolaj('m.zamien(d.t, d.z, d.na)', { t: 'bez', z: 'a/x', na: 'Q/y' })).toEqual({ tresc: 'bez', ile: 0 });
    const ok = { wpisy: [w('a', 'usun')], zamiany: [{ sciezka: 'x.md', z: 'a', na: 'b' }], generatory: ['node scripts/readme.mjs --write'] };
    expect(wywolaj('m.sprawdzListe(d)', ok)).toEqual([]);
    expect(wywolaj('m.sprawdzListe(d)', { ...ok, zamiany: [{ sciezka: '../x', z: 'a', na: 'b' }] })[0]).toContain('względna');
    expect(wywolaj('m.sprawdzListe(d)', { ...ok, zamiany: [{ sciezka: 'x', z: '', na: 'b' }] })[0]).toContain('zamiana niepoprawna');
    expect(wywolaj('m.sprawdzListe(d)', { ...ok, generatory: ['rm -rf /'] })[0]).toContain('generator niepoprawny');
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

describe('przeniesienie 1.0: odnośniki do dokumentów na Dysku', () => {
  const usuniete = ['docs/10-miejsca-i-sprzet.md', 'docs/design/to-be.md', 'docs/audyt-0.10/A11.md', 'docs/audyt-0.10/UX.md'];
  const zostaje = ['docs/14-e2-specyfikacja.md', 'docs/design/design-spec.md'];
  const przepisz = (tresc: string) => wywolaj('m.przepiszOdnosniki(d.t, d.u, d.k, d.z)', { t: tresc, u: usuniete, k: ['docs/audyt-0.10/'], z: zostaje });
  test('link do usuniętego pliku traci adres, ścieżka i katalog dostają „Dysk: …”, skrót „docs/NN” bez pliku też; zostający plik bez zmian', () => {
    expect(przepisz('Zob. [`docs/10-miejsca-i-sprzet.md`](docs/10-miejsca-i-sprzet.md#4) oraz docs/design/to-be.md i docs/audyt-0.10/UX.md; skrót docs/10 i docs/14; docs/design/design-spec.md'))
      .toEqual({ tresc: 'Zob. `Dysk: 10-miejsca-i-sprzet.md` oraz Dysk: design/to-be.md i Dysk: audyt-0.10/UX.md; skrót Dysk: 10 i docs/14; docs/design/design-spec.md', ile: 5 });
  });
  test('bez odnośników — bez zmian; nazwa jako fragment innej ścieżki nie jest zamieniana', () => {
    expect(przepisz('nic tu nie ma, a lib/docs/10-miejsca-i-sprzet.md.bak to inna ścieżka')).toEqual({ tresc: 'nic tu nie ma, a lib/docs/10-miejsca-i-sprzet.md.bak to inna ścieżka', ile: 0 });
  });
});

describe('przeniesienie 1.0: krótka nazwa pliku w odwołaniach', () => {
  test('nazwa wspólna z zostającym plikiem (README.md) nie daje fałszywego „czyta”; unikalna nazwa nadal działa', () => {
    const zrodla = { 'tests/a.test.ts': "const r = fs.readFileSync(path.join(root, 'README.md'), 'utf8'); const x = readFileSync(join(root, 'docs', 'unikalny-plik.md'))" };
    const usuniete = ['docs/design/kierunki/README.md', 'docs/unikalny-plik.md'];
    expect(wywolaj('m.odwolania(d.zrodla, d.usuniete, d.zostajace)', { zrodla, usuniete, zostajace: ['README.md'] }))
      .toEqual([{ plik: 'tests/a.test.ts', czyta: ['docs/unikalny-plik.md'], wzmianka: [] }]);
  });
});

describe('przeniesienie 1.0: lista scripts/przeniesienie-1.0.json i docs/46', () => {
  test('lista jest poprawna i każdy jej wpis wskazuje istniejący plik albo katalog ', () => {
    expect(wywolaj('m.sprawdzListe(d)', LISTA)).toEqual([]);
    const brak = LISTA.wpisy.filter((x: any) => !fs.existsSync(path.join(root, x.sciezka))).map((x: any) => x.sciezka);
    expect(brak).toEqual([]);
  });
  test('zamiany listy: wskazują istniejące pliki i tekst, który w nich jest (inaczej lista jest nieaktualna); nowy adres = Apps4Brew/trening (D6)', () => {
    expect(LISTA.zamiany.length).toBeGreaterThan(0);
    for (const z of LISTA.zamiany) {
      const f = path.join(root, z.sciezka);
      expect({ s: z.sciezka, jest: fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes(z.z) }).toEqual({ s: z.sciezka, jest: true });
      if (z.z.includes('lkarwowski494')) expect(z.na).toMatch(/Apps4Brew\/trening|apps4brew\.github\.io\/trening/);
    }
    expect(LISTA.przepisz).toEqual(['docs/brd/', '.github/workflows/']);
    expect(LISTA.generatory).toEqual(['node scripts/readme.mjs --write', 'node scripts/test-matrix.mjs --write']);
  });
  test('decyzje właściciela 30.10.2026 (P1 C, P2 A, P3 B): docs/45-widocznosc i 48 zostają, 45-formalnosci, 47, 49 i przegląd badacza 21.10 na Dysk; 7 testów bez przedmiotu „usun”; rejestr nie wskazuje dokumentu z Dysku (recenzja badacza 30.10.2026: T-005, T-039, T-040 na dokumentach w repo)', () => {
    const akcja = (p: string) => LISTA.wpisy.find((x: any) => x.sciezka === p)?.akcja;
    expect(akcja('docs/45-widocznosc-w-sklepie.md')).toBe('zostaje'); expect(akcja('docs/48-zgloszenie-1-0.md')).toBe('zostaje');
    for (const p of ['docs/45-formalnosci-asc.md', 'docs/47-instrukcja-testu-dzwieku.md', 'docs/49-testflight-1-0.md', 'docs/research/przeglad-badacza-2026-10-21.md']) expect([p, akcja(p)]).toEqual([p, 'dysk']);
    for (const t of ['dokumenty-na-dysk.test.ts', 'audit-m1-057-owner-budget.test.ts', 'audit-m1-068-release-plan.test.ts', 'audit-m1-071-channels.test.ts', 'audit-m1-072-android-decision.test.ts', 'audit-m1-2026-10-27-033-hipoteza-android.test.ts', 'dec07-odeslanie-docs21.test.ts']) expect([t, akcja(`tests/${t}`)]).toEqual([t, 'usun']);
    expect(LISTA.wpisy.filter((x: any) => x.akcja === 'decyzja')).toEqual([]);
    const rej = JSON.parse(fs.readFileSync(path.join(root, 'docs/research/rejestr-twierdzen.json'), 'utf8')).twierdzenia as { id: string; dokument?: string; uwaga?: string }[];
    const dysk = new Set(LISTA.wpisy.filter((x: any) => x.akcja === 'dysk' || x.akcja === 'usun').map((x: any) => x.sciezka));
    expect(rej.filter((t) => t.dokument && dysk.has(t.dokument)).map((t) => t.id)).toEqual([]);
    /* recenzja badacza 30.10.2026 (autor ≠ recenzent): dokumenty zostające w repo, bez uwag [OTWARTE] */
    const doc = (id: string) => rej.find((t) => t.id === id)!;
    expect(['T-005', 'T-039', 'T-040'].map((id) => [id, doc(id).dokument, doc(id).uwaga])).toEqual([
      ['T-005', 'docs/research/przeglad-badacza-2026-10-30.md', undefined],
      ['T-039', 'docs/research/przeglad-badacza-2026-10-21b.md', undefined],
      ['T-040', 'docs/research/przeglad-badacza-2026-10-23.md', undefined],
    ]);
    expect(LISTA.wpisy.find((x: any) => x.sciezka === 'docs/research/przeglad-badacza-2026-10-30.md')).toBeUndefined(); /* brak wpisu = zostaje */
  });
  test('klasyfikacja po 21.10.2026 (ZB-004): D5 — zostają tylko tokeny i specyfikacja wyglądu, reszta docs/design/ idzie na Dysk; D2/D3 — „popraw” do podmiany przy przeniesieniu', () => {
    const akcja = (p: string) => LISTA.wpisy.find((x: any) => x.sciezka === p)?.akcja;
    expect(akcja('docs/design/')).toBe('dysk');
    for (const p of ['design-spec.md', 'tokeny.ts', 'tokeny-kontrast.json', 'test-pierwszego-uzycia.md', 'narzedzia/e3-kontrast.mjs']) expect(akcja(`docs/design/${p}`)).toBe('zostaje');
    for (const p of ['docs/18-przekazanie.md', 'docs/40-lekcje.md', 'CLAUDE.md', '.claude/agents/']) expect(akcja(p)).toBe('popraw');
    expect(akcja('docs/monetyzacja.md')).toBe('zostaje'); expect(akcja('docs/39-lista-kontrolna-wydania.md')).toBe('zostaje');
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
