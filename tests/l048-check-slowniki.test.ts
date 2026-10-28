/*
 * L-048 A (decyzja właściciela 28.10.2026, przekazana do M2 pętli 2 — audit/…/naprawy/przekazanie-M2-petla-2.md): strażniki jakości słowników w jednym
 * poleceniu `npm run check:slowniki` (scripts/slowniki.mjs), uruchamianym przez `check:pochodne` warunkowo — gdy wypychane zmiany dotykają słowników,
 * tekstów wskazówek, słownika EN, opisów sklepu albo dokumentów lokalizacji. Przyczyna (docs/40 L-048): agent tłumacza uruchamiał tylko testy z polecenia,
 * a strażniki słowników (matrix-i18n, i18n-wave*, i18n-variants, A11N-03, skroty-przekladu…) wykryło dopiero CI.
 */
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
/** Moduły ESM w osobnym procesie (jak tests/pochodne.test.ts). */
const esm = (mod: string, expr: string) => JSON.parse(spawnSync(process.execPath, ['--input-type=module', '-e',
  `import * as m from ${JSON.stringify('file://' + join(root, mod))}; process.stdout.write(JSON.stringify(${expr}));`], { cwd: root, encoding: 'utf8' }).stdout);

describe('L-048 A: npm run check:slowniki', () => {
  test('skrypt w package.json i lista strażników słowników (wszystkie pliki istnieją)', () => {
    expect(pkg.scripts['check:slowniki']).toBe('node scripts/slowniki.mjs');
    const lista: string[] = esm('scripts/slowniki.mjs', 'm.STRAZNIKI_SLOWNIKOW');
    for (const f of ['tests/matrix-i18n.test.tsx', 'tests/i18n-wave2.test.ts', 'tests/i18n-wave3.test.ts', 'tests/i18n-wave4.test.ts', 'tests/i18n-variants.test.ts',
      'tests/skroty-przekladu.test.ts', 'tests/slownik-terminow.test.ts', 'tests/i18n-locales.test.ts', 'tests/audit-m1-029-kropka-srodkowa.test.ts', 'tests/units-label.test.ts']) expect(lista).toContain(f);
    for (const f of lista) expect(existsSync(join(root, f))).toBe(true);
    const kod = readFileSync(join(root, 'scripts/slowniki.mjs'), 'utf8');
    expect(kod).toMatch(/audit-k1-bl-mer\.test\.tsx'[^\n]*'-t'[^\n]*A11N-03/); /* A11N-03 (fr) bez reszty pliku */
    expect(kod).toMatch(/check-i18n\.mjs/); expect(kod).toMatch(/--maxWorkers=1/);
  });
});

describe('L-048 A: check:pochodne uruchamia check:slowniki tylko przy zmianach słowników', () => {
  test('krok „strażniki słowników” na liście check:pochodne', () => {
    expect(spawnSync(process.execPath, [join(root, 'scripts/pochodne.mjs'), '--lista'], { cwd: root, encoding: 'utf8' }).stdout).toMatch(/strażniki słowników/);
  });
  test.each([
    [['lib/locales/el.json'], true], [['lib/cues/text/pl.json'], true], [['lib/i18n.en.ts'], true], [['store/review-notes.md'], true], [['docs/lokalizacja/slownik-terminow.json'], true],
    [['lib/live.ts', 'docs/40-lekcje.md'], false], [[], false], [null, true],
  ] as [string[] | null, boolean][])('zmienione %j → uruchom: %s (null = nieznane zmiany → bezpiecznie uruchom)', (pliki, want) => {
    expect(esm('scripts/pochodne.mjs', `m.dotykaSlownikow(${JSON.stringify(pliki)})`)).toBe(want);
  });
});
