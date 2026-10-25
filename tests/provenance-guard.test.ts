/* Ochrona bazy danych (decyzja właściciela 25.10.2026, wariant A): dane katalogu zawierają techniczne znaczniki pochodzenia.
 * Strażnik sprawdza tylko ogólne niezmienniki — kształt, unikalność, przejście przez generator i niewidoczność dla użytkownika.
 * Szczegółów znaczników (co, gdzie, jak sprawdzić kopię) nie ma w repozytorium. */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { CATALOG, CATALOG_REV, CATALOG_RID } from '@/lib/catalog.generated';
import { LIB } from '@/lib/seed';

const root = join(__dirname, '..');
const catalog: any[] = JSON.parse(readFileSync(join(root, 'docs/research/equipment/catalog.json'), 'utf8'));
const aliases: any[] = JSON.parse(readFileSync(join(root, 'docs/research/equipment/catalog-aliases.json'), 'utf8'));
const GENERATED = 'lib/catalog.generated.ts';

function walk(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (f !== 'node_modules') walk(p, out); } else if (/\.(tsx?|jsx?|json|swift|kt|md)$/.test(f)) out.push(p);
  }
  return out;
}
const shipped = ['app', 'components', 'lib', 'locales', 'modules', 'targets', 'store'].flatMap(d => walk(join(root, d))).filter(p => relative(root, p) !== GENERATED);
const extras = Object.keys(CATALOG_RID).filter(n => !(n in CATALOG));

describe('znaczniki pochodzenia danych', () => {
  test('każdy wpis katalogu ma unikalny identyfikator wiersza (8 znaków szesnastkowych), a wygenerowany moduł zawiera komplet', () => {
    const all = [...catalog.map(e => e.rid), ...aliases.map(a => a.rid)];
    for (const r of all) expect(r).toMatch(/^[0-9a-f]{8}$/);
    expect(new Set(all).size).toBe(all.length);
    for (const e of catalog) expect(CATALOG_RID[e.name]).toBe(e.rid);
    expect(Object.keys(CATALOG_RID)).toHaveLength(catalog.length + aliases.length);
  });
  test('znaczniki przeżywają generator: gen.mjs --check zgodny, a znaczniki nie zmieniają wersji treści katalogu', () => {
    expect(() => execFileSync('node', [join(root, 'scripts/equipment/gen.mjs'), '--check'], { stdio: 'pipe' })).not.toThrow();
    expect(CATALOG_REV).toBe('06090b70a69c');
  });
  test('wpisy techniczne spoza katalogu (najwyżej 3) nie są ćwiczeniami: brak w katalogu, bibliotece i w jakimkolwiek tekście aplikacji', () => {
    expect(extras.length).toBeGreaterThan(0);
    expect(extras.length).toBeLessThanOrEqual(3);
    expect(extras.sort()).toEqual(aliases.map(a => a.name).sort());
    const libNames = new Set(LIB.map(l => l[0]));
    for (const d of extras) { expect(libNames.has(d)).toBe(false); expect(catalog.some(e => e.name === d)).toBe(false); }
    const texts = shipped.map(p => [p, readFileSync(p, 'utf8')] as const);
    for (const d of extras) expect(texts.filter(([, t]) => t.includes(d)).map(([p]) => relative(root, p))).toEqual([]);
  });
  test('niewidoczne dla użytkownika: żaden kod ani tekst aplikacji nie odczytuje i nie zawiera identyfikatorów wierszy', () => {
    const texts = shipped.map(p => [p, readFileSync(p, 'utf8')] as const);
    expect(texts.filter(([, t]) => t.includes('CATALOG_RID')).map(([p]) => relative(root, p))).toEqual([]);
    const rids = Object.values(CATALOG_RID);
    const hits: string[] = [];
    for (const [p, t] of texts) for (const r of rids) if (new RegExp(`(^|[^0-9a-f])${r}([^0-9a-f]|$)`).test(t)) hits.push(relative(root, p) + ':' + r);
    expect(hits).toEqual([]);
  });
});
