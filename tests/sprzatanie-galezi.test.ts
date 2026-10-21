/* Sprzątanie gałęzi (decyzja właściciela 21.10.2026, docs/18): workflow ręczny usuwa tylko gałęzie scalone z main albo zatwierdzone przez właściciela;
   nigdy main, gałęzi chronionych ani z otwartym PR; domyślnie podgląd. Sesje Claude nie mogą usuwać gałęzi (403) — stąd workflow z GITHUB_TOKEN. */
import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');
const MOD = JSON.stringify('file://' + join(ROOT, 'scripts/ci/sprzatanie-galezi.mjs'));
/** Moduł ESM w osobnym procesie (jak w tests/audit-m1-048-claims-registry.test.ts). */
const plan = (a: { galezie: string[]; scalone: string[]; otwartePR: string[]; zatwierdzone: string[] }): { usun: string[]; zostaw: { galaz: string; powod: string }[] } => JSON.parse(execFileSync('node', ['--input-type=module', '-e',
  `import { plan } from ${MOD}; const a = JSON.parse(process.argv[1]); process.stdout.write(JSON.stringify(plan({ galezie: a.galezie, scalone: new Set(a.scalone), otwartePR: new Set(a.otwartePR), zatwierdzone: new Set(a.zatwierdzone) })));`, JSON.stringify(a)], { encoding: 'utf8' }));
const chronione = (g: string): boolean => execFileSync('node', ['--input-type=module', '-e', `import { CHRONIONE } from ${MOD}; process.stdout.write(String(CHRONIONE.some((r) => r.test(process.argv[1]))));`, g], { encoding: 'utf8' }) === 'true';

describe('sprzątanie gałęzi — plan', () => {
  test('usuwa scalone i zatwierdzone; zostawia main, chronione, z otwartym PR i niescalone bez zgody', () => {
    const p = plan({
      galezie: ['main', 'f-stara', 'redesign/trening-2026-10-21', 'widocznosc/x', 'm3-wejscie/029-ikony', 'f020-garmin', 'f020-sklep', 'nowa-z-pr', 'porzucona', 'zatwierdzona', 'gh-pages', 'f-stara'],
      scalone: ['main', 'f-stara', 'nowa-z-pr', 'redesign/trening-2026-10-21', 'gh-pages'],
      otwartePR: ['nowa-z-pr'],
      zatwierdzone: ['zatwierdzona', 'f020-garmin'],
    });
    expect(p.usun).toEqual(['f-stara', 'zatwierdzona']);
    const powod = Object.fromEntries(p.zostaw.map((z) => [z.galaz, z.powod]));
    expect(powod).toEqual({ main: 'chroniona', 'redesign/trening-2026-10-21': 'chroniona', 'widocznosc/x': 'chroniona', 'm3-wejscie/029-ikony': 'chroniona', 'f020-garmin': 'chroniona', 'f020-sklep': 'chroniona', 'gh-pages': 'chroniona', 'nowa-z-pr': 'otwarty PR', porzucona: 'nie scalona i bez zgody' });
  });
  test('lista zatwierdzonych: każdy wpis ma SHA do odtworzenia, powód i datę zgody; żadna nie jest chroniona', () => {
    const z = JSON.parse(read('scripts/ci/sprzatanie-zatwierdzone.json')).galezie as { galaz: string; sha: string; powod: string; zgoda: string }[];
    expect(z.length).toBeGreaterThan(0);
    for (const w of z) { expect(w.sha).toMatch(/^[0-9a-f]{12,40}$/); expect(w.powod.length).toBeGreaterThan(5); expect(w.zgoda).toMatch(/^\d{2}\.\d{2}\.\d{4}$/); expect(chronione(w.galaz)).toBe(false); }
  });
});

describe('sprzątanie gałęzi — workflow', () => {
  const y = read('.github/workflows/sprzatanie-galezi.yml');
  test('tylko ręcznie, domyślnie podgląd, zapis tylko w zadaniu, bez sekretów poza tokenem', () => {
    expect(y).toMatch(/\non:\n  workflow_dispatch:\n/); expect(y).not.toMatch(/\n  (push|schedule|pull_request):/);
    expect(y).toMatch(/default: podglad/);
    expect(y).toMatch(/\npermissions:\n  contents: read\n/); expect(y.match(/contents: write/g)).toHaveLength(1);
    expect(y).not.toMatch(/secrets\./); expect(y).toContain('GH_TOKEN: ${{ github.token }}');
    expect(y).toContain('--usun'); expect(y).toMatch(/if \[ "\$TRYB" = "usun" \]/);
  });
});
