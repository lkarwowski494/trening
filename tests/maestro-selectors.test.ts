/* Scenariusze Maestro: selektor `id` jest wyrażeniem regularnym dopasowywanym do całego testID.
 * Przebieg E2E 03.10.2026: id "sw-Pull-up bar (doorway, wall-mounted)" nie znalazł przełącznika, bo nawiasy były grupą. */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const dir = join(__dirname, '../.maestro');
const files = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(d, e.name)) : e.name.endsWith('.yaml') ? [join(d, e.name)] : []);

test('każdy selektor id w scenariuszach Maestro dopasowuje swój testID dosłownie (znaki specjalne regex poprzedzone \\)', () => {
  const ids: string[] = [];
  for (const f of files(dir)) {
    for (const m of readFileSync(f, 'utf8').matchAll(/\bid:\s*"((?:[^"\\]|\\.)*)"/g)) ids.push(JSON.parse('"' + m[1] + '"'));
  }
  expect(ids.length).toBeGreaterThan(0);
  for (const id of ids) {
    const literal = id.replace(/\\(.)/g, '$1');
    expect({ id, matches: new RegExp('^(?:' + id + ')$').test(literal) }).toEqual({ id, matches: true });
  }
});
