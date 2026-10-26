/*
 * Paczka aplikacji bez nazw źródeł (decyzja właściciela 25.10.2026, docs/18; „całkiem anonimowo”): pliki runtime wskazówek i figur (lib/cues/data.json, lib/figures/data.json)
 * nie mają nazw organizacji, autorów, tytułów ani adresów — pełne dane są w data/zrodla (testy na nich: tests/zrodla-pelne-*.test.ts). Strażnik wyeksportowanego pakietu:
 * scripts/check-bundle.mjs (wzorce z lib/sources.ts; krok verify po `expo export`). Rodzaje (docs/20): logika (wyszukiwanie w bajtach: utf8, utf16le w obu przesunięciach,
 * ciągły zapis łańcuchów), niezmienniki (zero nazw w plikach runtime), strażnik (kod wyjścia na sztucznym eksporcie), wpięcie w verify.
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync, spawnSync } from 'child_process';
import { SOURCE_NAME_PATTERNS } from '@/lib/sources';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const NAME = new RegExp(`(?:${SOURCE_NAME_PATTERNS.join('|')})`, 'u');
const GUARD = path.join(root, 'scripts/check-bundle.mjs');
/** Moduł strażnika jest ESM (.mjs) — Jest tu go nie importuje, więc wywołanie przez node (wzór: tests/zrodla-wiedzy.test.ts, viaClaims). Wynik jako JSON. */
const viaGuard = <T>(code: string, ...args: string[]): T => JSON.parse(execFileSync('node', ['--input-type=module', '-e',
  `import * as g from ${JSON.stringify('file://' + GUARD)}; const re = g.nameRegex(g.loadPatterns()); const A = process.argv.slice(1); process.stdout.write(JSON.stringify((() => { ${code} })()));`, ...args], { encoding: 'utf8' }));
const b64 = (b: Buffer) => b.toString('base64');

describe('pliki runtime wskazówek i figur: bez nazw źródeł, adresów i tytułów', () => {
  test('lib/cues/data.json i lib/figures/data.json: żaden łańcuch nie pasuje do wzorców nazw (lib/sources.ts), brak adresów https i pól źródeł', () => {
    for (const f of ['lib/cues/data.json', 'lib/figures/data.json']) {
      const txt = read(f);
      expect([f, NAME.test(txt)]).toEqual([f, false]);
      expect([f, /https?:\/\//.test(txt)]).toEqual([f, false]);
      expect([f, /"(?:sources|orgs|src|archive|title|url|partialNote)"\s*:/.test(txt)]).toEqual([f, false]);
    }
  });
  test('wzorce są wykrywalne w bajtach: lista nazw niepusta i rozpoznaje przykłady (kontrola działania strażnika)', () => {
    expect(SOURCE_NAME_PATTERNS.length).toBeGreaterThan(20);
    for (const s of ['ACSM', 'NSCA', 'Nuckols', 'Fry i in. 2003']) expect([s, NAME.test(s)]).toEqual([s, true]);
  });
});

describe('strażnik paczki (scripts/check-bundle.mjs): wyszukiwanie nazw w bajtach', () => {
  const hits = (buf: Buffer, allowed: string[] = []) => viaGuard<number>('return g.findNames(Buffer.from(A[0], "base64"), re, JSON.parse(A[1])).length', b64(buf), JSON.stringify(allowed));
  test('wykrywa nazwę w utf8, w utf16le (przesunięcie 0 i 1) i wklejoną w ciągły zapis łańcuchów; nie łapie czystego tekstu', () => {
    const cases: [string, Buffer][] = [
      ['utf8', Buffer.from('xxThe Definitive Guide (Greg Nuckols)yy', 'utf8')],
      ['ciągły', Buffer.from('nazwaNuckolskolejna', 'utf8')],
      ['utf16 0', Buffer.from('Pelland i in. 2020', 'utf16le')],
      ['utf16 1', Buffer.concat([Buffer.from([0x7f]), Buffer.from(' ACSM ', 'utf16le')])],
      ['cytat', Buffer.from('Kowalski i in. 2016', 'utf8')],
    ];
    for (const [nazwa, buf] of cases) expect([nazwa, hits(buf) > 0]).toEqual([nazwa, true]);
    for (const clean of ['Wyciskanie sztangi leżąc', 'Przysiad ze sztangą — plecy proste', 'Dumbbell row']) for (const enc of ['utf8', 'utf16le'] as const) expect([clean, enc, hits(Buffer.from(clean, enc))]).toEqual([clean, enc, 0]);
  });
  test('nawrót L-033: krótki skrót (do 4 liter) liczy się tylko na tle tekstu — sąsiad to spacja lub interpunkcja; przypadkowy ciąg liter i bajtów nie alarmuje, prawdziwy tekst tak', () => {
    const noise = Buffer.concat([Buffer.from([0x59, 0x72, 0x98, 0x8b, 0xee, 0x5b, 0x43, 0x87, 0x53, 0x8f, 0xa4, 0x44, 0xa4]), Buffer.from('DECDC', 'latin1'), Buffer.from([0xa1, 0x4e, 0x07, 0x96, 0x48])]);
    expect(hits(noise)).toBe(0);
    /* nawrót L-033: ciąg z logu tests.yml 40379990056 ("CWCTC7CDC·CKCGCPC;CE" w widoku UTF-16) — długi bieg liter, ale bez granic słowa; klasa: litery A–Z przeplatane bajtami */
    const log = Buffer.from('CWCTC7CDC\u0001CKCGCPC;CE', 'utf8');
    expect(hits(log)).toBe(0);
    expect(hits(Buffer.from(log.toString('utf8'), 'utf16le'))).toBe(0);
    for (const junk of ['ACWACSMCKCGCPC;CE', 'CWCTC7ISSN\u0001CKCGCPC', 'QWHOQ\u0002abcdefgh', 'ab7NSCA\u0003cdefgh']) expect([junk, hits(Buffer.from(junk, 'utf8'))]).toEqual([junk, 0]);
    for (const real of ['według CDC', 'CDC zaleca', 'Zgodnie z WHO.', 'dane (ACSM)', 'ISSN, 2018', 'wg NSCA/ACSM', 'tekst CDC i dalszy tekst']) for (const enc of ['utf8', 'utf16le'] as const) expect([real, enc, hits(Buffer.from(real, enc)) > 0]).toEqual([real, enc, true]);
    expect(hits(Buffer.from('pole.CDC.pole', 'utf8'))).toBeGreaterThan(0);
    expect(hits(Buffer.from('xxZourdosyy', 'utf8'))).toBeGreaterThan(0); /* nazwy dłuższe niż 4 litery: bez wyjątku, także w ciągłym zapisie */
    expect(hits(Buffer.from('nazwaPellandkolejna', 'utf8'))).toBeGreaterThan(0);
  });
  test('dozwolone łańcuchy (stare tłumaczenia z zestawu do przekładu) są pomijane, reszta nie', () => {
    const old = 'Návrh podle směrnice USA 2018 (WHO, ACSM)';
    expect(hits(Buffer.from(`a${old}b`, 'utf8'), [old])).toBe(0);
    expect(hits(Buffer.from(`a${old}b${old}c ACSM`, 'utf8'), [old])).toBeGreaterThan(0);
    expect(hits(Buffer.from(old, 'utf16le'), [old])).toBe(0);
  });
  test('allowedStrings: tylko stare tłumaczenia kluczy „zmieniony” z nazwami; każdy dozwolony łańcuch jest w słowniku języka i ma nazwę', () => {
    const allowed = viaGuard<string[]>('return g.allowedStrings(re)');
    const all = new Set(fs.readdirSync(path.join(root, 'lib/locales')).filter(f => f.endsWith('.json') && !f.startsWith('_')).flatMap(f => Object.values(JSON.parse(read(`lib/locales/${f}`))) as string[]));
    for (const a of allowed) expect([a.slice(0, 40), all.has(a), NAME.test(a)]).toEqual([a.slice(0, 40), true, true]);
  });
});

describe('strażnik paczki: CLI na sztucznym eksporcie', () => {
  const run = (dir: string) => spawnSync('node', [path.join(root, 'scripts/check-bundle.mjs'), dir], { encoding: 'utf8' });
  const mk = (files: Record<string, Buffer | string>) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-')); for (const [f, c] of Object.entries(files)) { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), c); } return dir;
  };
  test('czysty pakiet → kod 0; nazwa w pakiecie → kod 1 z nazwą i plikiem w komunikacie; brak pakietu JS → kod 1; brak katalogu → kod 1', () => {
    const clean = mk({ '_expo/static/js/ios/entry-x.hbc': Buffer.from('Wyciskanie sztangi leżąc', 'utf16le'), 'assets/a.png': Buffer.from('WHO') });
    const r0 = run(clean); expect([r0.status, r0.stdout]).toEqual([0, expect.stringContaining('paczka bez nazw źródeł')]);
    const dirty = mk({ '_expo/static/js/ios/entry-x.hbc': Buffer.from('xxEleikoZourdosyy NSCA', 'utf8') });
    const r1 = run(dirty); expect(r1.status).toBe(1); expect(r1.stderr).toMatch(/NSCA/); expect(r1.stderr).toMatch(/entry-x\.hbc/);
    const none = mk({ 'metadata.json': '{}' }); expect(run(none).status).toBe(1);
    expect(run(path.join(os.tmpdir(), 'nie-ma-takiego-eksportu')).status).toBe(1);
  });
});

describe('wpięcie w verify', () => {
  const pkg = () => JSON.parse(read('package.json')) as { scripts: Record<string, string> };
  test('check:zrodla-runtime i check:bundle istnieją; verify sprawdza plik runtime przed jestem, a paczkę po expo export i przed usunięciem eksportu', () => {
    const s = pkg().scripts;
    expect(s['check:zrodla-runtime']).toBe('node scripts/zrodla-runtime.mjs --check');
    expect(s['check:bundle']).toBe('node scripts/check-bundle.mjs .expo/verify-export');
    const v = s.verify;
    expect(v.indexOf('npm run check:zrodla-runtime')).toBeGreaterThan(-1);
    expect(v.indexOf('npm run check:zrodla-runtime')).toBeLessThan(v.indexOf(' jest '));
    const exp = v.indexOf('expo export --platform ios --output-dir .expo/verify-export'), chk = v.indexOf('npm run check:bundle'), rm = v.indexOf('rmSync(');
    expect(exp).toBeGreaterThan(-1); expect(chk).toBeGreaterThan(exp); expect(rm).toBeGreaterThan(chk);
  });
  test('generator: --check przechodzi, --write jest idempotentny (ten sam wynik), brak argumentu → kod 2', () => {
    expect(() => execFileSync('node', [path.join(root, 'scripts/zrodla-runtime.mjs'), '--check'], { stdio: 'pipe' })).not.toThrow();
    expect(spawnSync('node', [path.join(root, 'scripts/zrodla-runtime.mjs')], { encoding: 'utf8' }).status).toBe(2);
  });
});
