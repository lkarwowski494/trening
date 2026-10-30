/*
 * M1-audytor-generalny-047 (reaudyt 28.10.2026; 03-zakres-602, 07-jakosc-601): pola „[wdrożenie: otwarte → <zadanie>]” w docs/18 zostawały otwarte po naprawie
 * zadania (docs/18 wiersze dla 006, 017, 034, K1 → 009), a check:decyzje sprawdzał tylko postać pola. Teraz: wpis „otwarte → M1-audytor-generalny-NNN”
 * przy zadaniu, które ma commit naprawy z tym ID w historii git, to błąd check:decyzje (zmień pole na „kod” z testem, „bez kodu — powód” albo wskaż nowe ID).
 * Ograniczenie nazwane: CI pobiera repo bez historii (fetch-depth 1) — płytka kopia (git rev-parse --is-shallow-repository) zwraca null i sprawdzenie się pomija; działa lokalnie (hak, verify, verify:docs).
 */
import * as path from 'path';
import { spawnSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const SKRYPT = path.join(ROOT, 'scripts/decyzje.mjs');
const wywolaj = <T>(kod: string): T => {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(SKRYPT)}; console.log(JSON.stringify(await (async () => { ${kod} })()));`], { encoding: 'utf8', cwd: ROOT });
  if (r.status !== 0) throw new Error(r.stderr); return JSON.parse(r.stdout);
};
const DZIENNIK = ['## Decyzje', '',
  '- 01.10.2026 (właściciel): A. [wdrożenie: otwarte → M1-audytor-generalny-006]',
  '- 02.10.2026 (właściciel): B. [wdrożenie: otwarte → M1-audytor-generalny-038]',
  '- 03.10.2026 (właściciel): C. [wdrożenie: odłożone → 1.0.1]',
  '- 04.10.2026 (właściciel): D. [wdrożenie: otwarte → M1-audytor-generalny-009 (K1)]',
  '- 05.10.2026 (właściciel): E. [wdrożenie: otwarte → M1-audytor-generalny-006 (pętla 2)]', ''].join('\n'); /* E: zadanie otwarte ponownie po reaudycie — pomijane */

describe('M1-047: „otwarte → zadanie” przy zadaniu z commitem naprawy', () => {
  test('wskazuje wpisy, których zadanie ma commit naprawy; pomija otwarte zadania i inne pola', () => {
    const r = wywolaj<{ linia: number; id: string }[]>(`return m.nieaktualneWskazniki(${JSON.stringify(DZIENNIK)}, ['M1-audytor-generalny-006', 'M1-audytor-generalny-009']);`);
    expect(r.map((x) => x.id)).toEqual(['M1-audytor-generalny-006', 'M1-audytor-generalny-009']);
  });
  test('zadania z naprawą czytane z komunikatów commitów (git log); repo bez historii → null (sprawdzenie pominięte)', () => {
    const ids = wywolaj<string[] | null>('return m.zadaniaZNaprawa();');
    if (ids === null) return; /* CI: fetch-depth 1 */
    expect(ids).toContain('M1-audytor-generalny-006'); /* e6114d1 */
  });
  test('płytka kopia repo (CI, fetch-depth 1) → null: niepełna historia nie udaje pełnej (porażka tests.yml 40716367925)', () => {
    const fs = require('fs') as typeof import('fs'); const os = require('os') as typeof import('os');
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'm1-047-'));
    const git = (...a: string[]) => { const r = spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.invalid', ...a], { cwd: d, encoding: 'utf8' }); if (r.status !== 0) throw new Error(r.stderr); return r.stdout.trim(); };
    git('init', '-q'); git('commit', '-q', '--allow-empty', '-m', 'fix [M1-audytor-generalny-006; x]');
    const z = (root: string) => wywolaj<string[] | null>(`return m.zadaniaZNaprawa(${JSON.stringify(root)});`);
    expect(z(d)).toEqual(['M1-audytor-generalny-006']);
    fs.writeFileSync(path.join(d, '.git', 'shallow'), git('rev-parse', 'HEAD') + '\n');
    expect(z(d)).toBeNull();
    fs.rmSync(d, { recursive: true, force: true });
  });
  test('docs/18: brak „otwarte → ID” przy zadaniu z commitem naprawy (gdy historia dostępna)', () => {
    const r = wywolaj<{ linia: number; id: string }[] | null>(`const z = m.zadaniaZNaprawa(); if (!z) return null; const fs = await import('node:fs'); return m.nieaktualneWskazniki(fs.readFileSync('docs/18-przekazanie.md', 'utf8'), z);`);
    if (r === null) return;
    expect(r).toEqual([]);
  });
});

describe('M1-047: dokumenty zgodne z kodem po naprawach (01-601, 01-602, 03-603, 06-601, 10-602)', () => {
  const fs = require('fs') as typeof import('fs');
  const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
  test('BRD: kod diagnostyczny z ekranu błędu startu (BR-KON-002) i „Zarządzaj subskrypcją” (BR-ZAK-006) ze scenariuszem i testem', () => {
    const b = read('docs/brd/wymagania-uzupelnienie.md');
    const kon = b.slice(b.indexOf('### BR-KON-002'), b.indexOf('### BR-KON-003')); const zak = b.slice(b.indexOf('### BR-ZAK-006'), b.indexOf('### BR-ZAK-007'));
    expect(kon).toMatch(/Scenariusz: Z ekranu błędu startu/); expect(kon).toMatch(/kod diagnostyczny/); expect(kon).toContain('tests/audit-m1-2026-10-27-032-kod-diagnostyczny.test.tsx');
    expect(zak).toMatch(/Scenariusz: Zarządzanie subskrypcją/); expect(zak).toContain('tests/audit-m1-2026-10-27-016-arkusz-subskrypcji.test.tsx');
  });
  test('docs/39 ZD-03 odsyła do scenariusza 58 i nazywa, czego nie pokrywa', () => {
    const z = read('docs/39-lista-kontrolna-wydania.md'); const s = z.slice(z.indexOf('**ZD-03**'), z.indexOf('**ZD-04**') > 0 ? z.indexOf('**ZD-04**') : undefined);
    expect(s).toContain('.maestro/58-duzy-tekst.yaml'); expect(s).toMatch(/dziś bez treningu/); expect(s).not.toMatch(/Maestro nie ustawi rozmiaru tekstu/);
    expect(fs.existsSync(path.join(ROOT, '.maestro/58-duzy-tekst.yaml'))).toBe(true);
  });
  test('docs/48 Z-25a: adres „Stop testing a build” z cytatem, bez martwego manage-builds', () => {
    const d = read('docs/48-zgloszenie-1-0.md');
    expect(d).toContain('test-a-beta-version/stop-testing-a-build/'); expect(d).toContain('Click Expire Build.'); expect(d).not.toContain('test-a-beta-version/manage-builds/');
  });
  test('CLAUDE.md: definicja tekstu dziedzinowego odsyła do scripts/claims.mjs (DOMAIN_WORDS_RE, DOMAIN_KEYS), które istnieją', () => {
    const c = read('CLAUDE.md'); const k = read('scripts/claims.mjs');
    for (const n of ['DOMAIN_WORDS_RE', 'DOMAIN_KEYS']) { expect(c).toContain(n); expect(k).toMatch(new RegExp(`export const ${n}\\b`)); }
  });
});
