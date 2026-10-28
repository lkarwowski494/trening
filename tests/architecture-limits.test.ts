/* M1-audytor-generalny-054: granice architektury — brak cykli importów w lib/ i limit rozmiaru pliku źródłowego (20 KB).
   Pliki większe niż limit mają próg = rozmiar z 20.10.2026 + 5% zapasu i powód; próg się tylko zmniejsza (podział pliku to osobny commit
   strukturalny). Pliki generowane (katalog, licencje, słowniki) są poza limitem. */
import { readdirSync, readFileSync, statSync, existsSync } from 'fs';
import { join, dirname, resolve, relative } from 'path';

const ROOT = join(__dirname, '..');
const LIMIT = 20 * 1024;
const SKIP_DIRS = new Set(['locales', 'cues', 'node_modules']); /* figures — od M1-049 w limicie (kod rysowania; dane .json i tak poza obchodem) */
const walk = (d: string): string[] => readdirSync(d).flatMap(n => {
  const p = join(d, n);
  return statSync(p).isDirectory() ? (SKIP_DIRS.has(n) ? [] : walk(p)) : /\.tsx?$/.test(n) ? [p] : [];
});
const generated = (f: string) => /\.generated\.ts$|\/i18n\.en\.ts$/.test(f);

/** Wyjątki od limitu 20 KB: ścieżka → [próg w bajtach, powód]. */
const WYJATKI: Record<string, [number, string]> = {
  'lib/seed.ts': [63488, 'model danych, katalog ćwiczeń i stałe domeny w jednym module; podział po zakończeniu prac nad schematem'],
  'lib/plan.ts': [51200, 'plan tygodnia, przesunięcia i historia planu; podział na moduły osobnym commitem strukturalnym'],
  'lib/generator.ts': [50176, 'reguły generatora szablonu (źródła w komentarzach); podział z testami wyroczni'],
  'lib/equipment.ts': [47104, 'katalog sprzętu i presety miejsc; podział razem z katalogiem'],
  'lib/stats.ts': [39936, 'statystyki i rekordy; podział wg wykresów'],
  'lib/edit.ts': [36864, 'edycja historii i szkice; podział wg operacji'],
  'lib/backup.ts': [22528, 'kopia, import i odzysk w jednym przepływie'],
  'lib/state/migrate.ts': [24576, 'migracja schematu (jedna funkcja idempotentna); części już w migrate-records i migrate-catalog'],
  'app/template/[id].tsx': [31744, 'ekran — poza zakresem partii 4 (M3)'],
  'components/ui.tsx': [30720, 'wspólne elementy interfejsu — poza zakresem partii 4 (M3)'],
  'components/ActiveWorkout.tsx': [37632, 'ekran treningu: nagłówek, zakończenie, pytanie o porzucony trening, widok listy i dolny pasek; podział M3 p2 — bloki ćwiczeń i wiersze serii w WorkoutBlocks, tablica „teraz” w NowBoard / BoardControls / BoardFace'],
  'components/WorkoutBlocks.tsx': [35072, 'bloki ćwiczeń z wierszami serii (zamiana, superset, menu serii) — wydzielone z ekranu treningu w M3 p2; dalszy podział wierszy serii osobnym commitem strukturalnym'],
  'app/generator.tsx': [22528, 'ekran — poza zakresem partii 4 (M3)'],
  /* M1-audytor-generalny-049 (28.10.2026): próg = rozmiar na 2385e75 + 5%; figury v2 prowadzi linia 1.1 (podział tam, osobnym commitem strukturalnym) */
  'lib/figures/geom.ts': [24576, 'geometria figur v1 (stawy, kąty, rzut) w jednym module; podział razem z silnikiem v1 (1.0.1)'],
  'lib/figures/v2/contract.ts': [75776, 'kontrakt danych figur v2 (typy, walidacja schematu) — linia 1.1; próg = rozmiar po scaleniu main 28.10.2026 + 5%; podział osobnym commitem strukturalnym (backlog 1.1)'],
  'lib/figures/v2/draw.ts': [44800, 'rysowanie figur v2 (rigi, warstwy) — linia 1.1; próg = rozmiar po scaleniu main 28.10.2026 + 5%; podział osobnym commitem strukturalnym (backlog 1.1)'],
  'lib/figures/v2/gear.ts': [72192, 'sprzęt figur v2 (tabela GEAR_KINDS: kontakty, uchwyty, rysowanie) — linia 1.1; próg = rozmiar po scaleniu main 28.10.2026 + 5%; podział tabeli osobnym commitem strukturalnym (backlog 1.1)'],
};

describe('limit rozmiaru plików (M1-054)', () => {
  const pliki = ['lib', 'app', 'components'].flatMap(d => walk(join(ROOT, d))).filter(f => !generated(f));
  /* M1-audytor-generalny-049 (05-architekt-601, 28.10.2026): katalog lib/figures zawiera kod rysowania — jego pliki .ts są objęte limitem (dane JSON nie są .ts). */
  test('obejmuje pliki .ts w lib/figures (kod rysowania figur), także v2', () => {
    const rel = pliki.map(f => relative(ROOT, f));
    expect(rel).toContain('lib/figures/geom.ts'); expect(rel).toContain('lib/figures/v2/contract.ts');
  });
  test('pliki powyżej 20 KB są na liście wyjątków i nie przekraczają progu', () => {
    const zle = pliki.map(f => [relative(ROOT, f), statSync(f).size] as const).filter(([r, n]) => n > (WYJATKI[r]?.[0] ?? LIMIT)).map(([r, n]) => `${r}: ${n}`);
    expect(zle).toEqual([]);
  });
  test('wyjątki dotyczą istniejących plików większych niż limit, z powodem (lista się kurczy)', () => {
    for (const [r, [prog, powod]] of Object.entries(WYJATKI)) {
      expect(existsSync(join(ROOT, r))).toBe(true);
      expect(powod.length).toBeGreaterThan(10);
      expect(statSync(join(ROOT, r)).size).toBeGreaterThan(LIMIT);
      expect(prog).toBeGreaterThan(LIMIT);
    }
  });
});

describe('cykle importów w lib/ (M1-054)', () => {
  const lib = join(ROOT, 'lib');
  const rozwiaz = (od: string, spec: string) => {
    const b = spec.startsWith('@/') ? join(ROOT, spec.slice(2)) : resolve(dirname(od), spec);
    return [b + '.ts', b + '.tsx', join(b, 'index.ts')].find(existsSync) ?? null;
  };
  const graf = () => {
    const g: Record<string, string[]> = {};
    for (const f of walk(lib)) {
      const s = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      g[f] = [];
      for (const m of s.matchAll(/^\s*(?:import|export)\s+(type\s+)?[^'"\n]*?from\s+['"]([^'"]+)['"]/gm)) {
        if (m[1] || !/^(\.|@\/)/.test(m[2])) continue; /* importy typów znikają po kompilacji — nie tworzą cyklu */
        const r = rozwiaz(f, m[2]);
        if (r && r.startsWith(lib)) g[f].push(r);
      }
    }
    return g;
  };
  /** Silnie spójne składowe (Tarjan) o więcej niż jednym węźle = cykle. */
  const cykle = (g: Record<string, string[]>) => {
    let idx = 0; const st: string[] = [], on = new Set<string>(), I: Record<string, number> = {}, L: Record<string, number> = {}, out: string[][] = [];
    const sc = (v: string) => {
      I[v] = L[v] = idx++; st.push(v); on.add(v);
      for (const w of g[v] ?? []) { if (!(w in I)) { sc(w); L[v] = Math.min(L[v], L[w]); } else if (on.has(w)) L[v] = Math.min(L[v], I[w]); }
      if (L[v] === I[v]) { const c: string[] = []; let w: string; do { w = st.pop()!; on.delete(w); c.push(w); } while (w !== v); if (c.length > 1) out.push(c.map(x => relative(ROOT, x)).sort()); }
    };
    for (const v of Object.keys(g)) if (!(v in I)) sc(v);
    return out;
  };
  test('lib/ nie ma cykli importów wartości (generator ↔ loadcap rozwiązany stałymi w lib/genconst.ts)', () => {
    expect(cykle(graf())).toEqual([]);
  });
  test('wykrywacz znajduje cykl w sztucznym grafie', () => {
    expect(cykle({ a: ['b'], b: ['a'], c: ['a'] })).toEqual([['a', 'b']]);
  });
});
