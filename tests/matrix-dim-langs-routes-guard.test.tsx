/*
 * Pokrycie macierzy LANGS × trasy po podziale na części (12.10.2026; tests/matrix-langs-routes-shared.tsx): żadna kombinacja nie może zginąć.
 * Sprawdza: (1) pliki części matrix-dim-langs-routes1…N istnieją, każdy wywołuje defineRouteLangsPart(własny numer), starego pliku zbiorczego brak;
 * (2) suma języków części = wszystkie LANGS poza pl (bazowym), bez powtórzeń; (3) lista tras = wszystkie ekrany z app/ (nowy ekran wchodzi sam),
 * a każda część przechodzi całą tę listę (routesFor jest jedna, wspólna).
 */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { LANGS } from '@/lib/i18n';
import { ROUTE_LANG_PARTS, ROUTE_LANG_CASES, langsOfPart, richState, routesFor } from './matrix-langs-routes-shared';
import { routeGaps } from './routes';

describe('macierz języków × trasy: pokrycie po podziale na części', () => {
  test('pliki części 1…N istnieją i wywołują własną część; brak starego pliku zbiorczego', () => {
    const files = readdirSync(__dirname).filter(f => /^matrix-dim-langs-routes\d+\.test\.tsx$/.test(f)).sort();
    expect(files).toEqual(Array.from({ length: ROUTE_LANG_PARTS }, (_, i) => `matrix-dim-langs-routes${i + 1}.test.tsx`));
    files.forEach((f, i) => expect(readFileSync(join(__dirname, f), 'utf8')).toContain(`defineRouteLangsPart(${i + 1});`));
    expect(readdirSync(__dirname)).not.toContain('matrix-dim-langs-routes.test.tsx');
  });
  test('suma języków części = wszystkie LANGS poza pl, każdy dokładnie raz, z motywem jak w podziale pozycyjnym', () => {
    const all = Array.from({ length: ROUTE_LANG_PARTS }, (_, i) => langsOfPart(i + 1)).flat();
    expect(all.map(([l]) => l).sort()).toEqual(LANGS.filter(l => l !== 'pl').sort());
    expect(new Set(all.map(([l]) => l)).size).toBe(all.length);
    expect(all.length).toBe(ROUTE_LANG_CASES.length);
    for (let k = 1; k <= ROUTE_LANG_PARTS; k++) expect(langsOfPart(k).length).toBeGreaterThan(0);
    expect(new Set(all.map(([, th]) => th))).toEqual(new Set(['light', 'dark']));
  });
  test('lista tras macierzy języków = wszystkie ekrany z app/', async () => {
    const r = await richState('pl'); expect(routeGaps(routesFor(r))).toEqual({ missing: [], unknown: [] });
  });
});
