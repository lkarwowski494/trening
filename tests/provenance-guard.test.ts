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

/* ZB-023 (właściciel 30.10.2026 ~21:10 PL, A; wdrożenie 11.11.2026, docs/18): te same znaczniki we wskazówkach techniki (lib/cues) i danych figur (lib/figures) — jak w katalogu:
 * mapa `rid` (8 znaków szesnastkowych, unikalne) i najwyżej 3 wpisy techniczne na poziomie głównym pełnych danych (data/zrodla), przeniesione przez
 * scripts/zrodla-runtime.mjs do plików runtime. Mapa leży poza obiektami ćwiczeń, więc nie zmienia treści wskazówek, póz ani skrótów recenzji bramki 4. */
const RUNTIME = [
  { nazwa: 'wskazówki', pelne: 'data/zrodla/cues.json', runtime: 'lib/cues/data.json', mapa: 'rid', aliasy: 'ridAliasy', v2: false },
  { nazwa: 'figury v1', pelne: 'data/zrodla/figures.json', runtime: 'lib/figures/data.json', mapa: 'rid', aliasy: 'ridAliasy', v2: false },
  /* figury v2 (KO-045, 11.11.2026, wariant A): ćwiczenia z plików póz lib/figures/v2/poses — mapa w pełnych danych figur, kontrakt pozy bez zmian */
  { nazwa: 'figury v2', pelne: 'data/zrodla/figures.json', runtime: 'lib/figures/data.json', mapa: 'ridV2', aliasy: 'ridV2Aliasy', v2: true },
] as const;
const PLIKI_RUNTIME = ['lib/cues/data.json', 'lib/figures/data.json'];
const POSES = join(root, 'lib/figures/v2/poses');
const v2Klucze = () => readdirSync(POSES).filter(n => n.endsWith('.json')).sort().flatMap(n => Object.keys(JSON.parse(readFileSync(join(POSES, n), 'utf8')).cwiczenia));
const czytaj = (p: string): any => JSON.parse(readFileSync(join(root, p), 'utf8'));
const libNazwy = new Set(LIB.map(l => l[0]));
const wartosci = () => RUNTIME.flatMap(r => Object.values<string>(czytaj(r.runtime)[r.mapa] ?? {}));
const wszystkieRid = () => [...Object.values(CATALOG_RID), ...wartosci()];

describe('znaczniki pochodzenia we wskazówkach i figurach (ZB-023)', () => {
  test.each(RUNTIME)('$nazwa: każde ćwiczenie ma znacznik, plik runtime ma komplet z wpisami technicznymi po wskazanym ćwiczeniu', ({ pelne, runtime, mapa, aliasy: pole, v2 }) => {
    const full = czytaj(pelne), out = czytaj(runtime);
    const klucze = v2 ? v2Klucze() : Object.keys(full.exercises);
    expect(klucze.length).toBeGreaterThan(0);
    expect(Object.keys(full[mapa] ?? {})).toEqual(klucze);
    const aliasy: { name: string; after: string; rid: string }[] = full[pole] ?? [];
    expect(aliasy.length).toBeGreaterThan(0);
    expect(aliasy.length).toBeLessThanOrEqual(3);
    const oczekiwane: [string, string][] = [];
    for (const [k, r] of Object.entries<string>(full[mapa])) { oczekiwane.push([k, r]); for (const a of aliasy.filter(x => x.after === k)) oczekiwane.push([a.name, a.rid]); }
    expect(oczekiwane).toHaveLength(klucze.length + aliasy.length);
    expect(Object.entries(out[mapa] ?? {})).toEqual(oczekiwane);
    for (const [, r] of oczekiwane) expect(r).toMatch(/^[0-9a-f]{8}$/);
  });
  test('znaczniki unikalne we wszystkich danych (katalog, wskazówki, figury)', () => {
    const all = wszystkieRid();
    expect(all.length).toBeGreaterThan(Object.keys(CATALOG_RID).length);
    expect(new Set(all).size).toBe(all.length);
  });
  test('znaczniki przeżywają generator (zrodla-runtime.mjs --check) i nie zmieniają skrótów recenzji: obiekty ćwiczeń w runtime bez pola rid', () => {
    expect(() => execFileSync('node', [join(root, 'scripts/zrodla-runtime.mjs'), '--check'], { stdio: 'pipe' })).not.toThrow();
    for (const runtime of PLIKI_RUNTIME) for (const v of Object.values<any>(czytaj(runtime).exercises)) expect('rid' in v || 'ridV2' in v).toBe(false);
    /* pliki póz v2 bez znaczników — kontrakt figury-v2/poza@2 bez zmian (KO-045) */
    for (const n of readdirSync(POSES).filter(x => x.endsWith('.json'))) expect(readFileSync(join(POSES, n), 'utf8')).not.toMatch(/"rid/);
  });
  test('wpisy techniczne nie są ćwiczeniami: brak w katalogu, bibliotece, danych i w jakimkolwiek tekście aplikacji poza mapą znaczników', () => {
    const texts = shipped.filter(p => !PLIKI_RUNTIME.includes(relative(root, p))).map(p => [p, readFileSync(p, 'utf8')] as const);
    const v2 = new Set(v2Klucze());
    for (const { pelne, runtime, aliasy } of RUNTIME) {
      const full = czytaj(pelne), out = czytaj(runtime);
      for (const a of full[aliasy] as { name: string }[]) {
        expect(v2.has(a.name)).toBe(false);
        expect(libNazwy.has(a.name)).toBe(false);
        expect(a.name in CATALOG || a.name in CATALOG_RID).toBe(false);
        expect(a.name in full.exercises || a.name in (full.open ?? {})).toBe(false);
        expect(a.name in out.exercises || out.open.includes(a.name)).toBe(false);
        expect(texts.filter(([, t]) => t.includes(a.name)).map(([p]) => relative(root, p))).toEqual([]);
      }
    }
  });
  test('niewidoczne dla użytkownika: kod aplikacji nie odczytuje mapy znaczników, a jej wartości są tylko w plikach runtime', () => {
    const kod = shipped.filter(p => /\.(tsx?|jsx?)$/.test(p)).map(p => [p, readFileSync(p, 'utf8')] as const);
    expect(kod.filter(([, t]) => /(CUE_DATA|FIG_DATA)\s*(\.\s*rid(V2)?\b|\[\s*['"`]rid)|\bridV2\b|\bridAliasy\b/.test(t)).map(([p]) => relative(root, p))).toEqual([]);
    const rids = wartosci();
    const hits: string[] = [];
    for (const p of shipped) {
      if (PLIKI_RUNTIME.includes(relative(root, p))) continue;
      const t = readFileSync(p, 'utf8');
      for (const r of rids) if (new RegExp(`(^|[^0-9a-f])${r}([^0-9a-f]|$)`).test(t)) hits.push(relative(root, p) + ':' + r);
    }
    expect(hits).toEqual([]);
  });
});

describe('generator znaczników (scripts/zrodla-runtime.mjs, ZB-023)', () => {
  /* moduł ES generatora — w osobnym procesie node (wzór: tests/cues-reguly-2026-11-02.test.ts) */
  const run = (body: string): any => JSON.parse(execFileSync('node', ['--input-type=module', '-e',
    `import { ridMap, uzupelnijRid } from ${JSON.stringify(join(root, 'scripts/zrodla-runtime.mjs'))}; const t = f => { try { return { ok: Object.entries(f()) }; } catch (e) { return { err: e.message }; } }; console.log(JSON.stringify(${body}));`], { encoding: 'utf8' }));
  test('ridMap: wpis techniczny zaraz po wskazanym ćwiczeniu; brak znacznika, zła kolejność, duplikat, zły kształt albo wpis techniczny = ćwiczenie → błąd', () => {
    const r = run(`[
      t(() => ridMap({ exercises: { A: {}, B: {} }, rid: { A: '0000000a', B: '0000000b' }, ridAliasy: [{ name: 'X', after: 'A', rid: '0000000c' }] })),
      t(() => ridMap({ exercises: { A: {}, B: {} }, rid: { A: '0000000a' } })),
      t(() => ridMap({ exercises: { A: {}, B: {} }, rid: { B: '0000000b', A: '0000000a' } })),
      t(() => ridMap({ exercises: { A: {}, B: {} }, rid: { A: '0000000a', B: '0000000a' } })),
      t(() => ridMap({ exercises: { A: {}, B: {} }, rid: { A: '0000000a', B: 'zzz' } })),
      t(() => ridMap({ exercises: { A: {}, B: {} }, rid: { A: '0000000a', B: '0000000b' }, ridAliasy: [{ name: 'B', after: 'A', rid: '0000000c' }] })),
    ]`);
    expect(r[0]).toEqual({ ok: [['A', '0000000a'], ['X', '0000000c'], ['B', '0000000b']] });
    expect(r[1].err).toMatch(/--rid.*docs\/50-figury-v2\.md/);
    expect(r[2].err).toMatch(/--rid/);
    expect(r[3].err).toMatch(/powtórzony/);
    expect(r[4].err).toMatch(/zły/);
    expect(r[5].err).toMatch(/techniczny/);
  });
  test('uzupelnijRid: zachowuje istniejące, nadaje brakujące bez kolizji z zajętymi, usuwa znaczniki ćwiczeń, których nie ma, w kolejności exercises', () => {
    const r = run(`(() => { const seq = ['00000001', '00000002', '00000003']; return Object.entries(uzupelnijRid({ exercises: { C: {}, A: {}, B: {} }, rid: { A: '0000000a', D: '0000000d' } }, ['00000001'], () => seq.shift()).rid); })()`);
    expect(r).toEqual([['C', '00000002'], ['A', '0000000a'], ['B', '00000003']]);
    /* figury v2 (KO-045): lista ćwiczeń z plików póz → ridV2; znacznik już użyty w rid nie wraca */
    const v = run(`(() => { const seq = ['0000000a', '00000004']; const f = uzupelnijRid({ exercises: { A: {} }, rid: { A: '0000000a' } }, [], () => seq.shift(), ['P']); return [Object.entries(f.rid), Object.entries(f.ridV2)]; })()`);
    expect(v).toEqual([[['A', '0000000a']], [['P', '00000004']]]);
  });
});
