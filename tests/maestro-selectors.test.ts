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

test('scenariusze rozwijają grupy sprzętu po angielskich nazwach z EQUIP_GROUP_LABEL (05.10.2026: grupy zwinięte)', () => {
  const fs = require('fs'); const path = require('path'); const { EQUIP_GROUP_LABEL } = require('@/lib/equipment');
  const names = Object.values(EQUIP_GROUP_LABEL as Record<string, { en: string }>).map(x => x.en);
  const dir = path.join(__dirname, '..', '.maestro'); const used: string[] = [];
  for (const f of fs.readdirSync(dir).filter((x: string) => x.endsWith('.yaml'))) for (const m of fs.readFileSync(path.join(dir, f), 'utf8').matchAll(/tapOn: "([^"]+)\.\*"/g)) if (/^[A-Z][a-z]+ (?:weights|and|dip)/.test(m[1])) used.push(m[1]);
  expect(used.length).toBeGreaterThanOrEqual(3); for (const u of used) expect(names).toContain(u);
});

test('regresja run 37600735711: przycisk karty „teraz” ma etykietę VoiceOver dłuższą niż tekst — selektory „Set done” dopasowują całą etykietę, nie ✓ wiersza', () => {
  const { EN } = require('@/lib/i18n.en'); const fs = require('fs'); const path = require('path');
  const card = EN['Seria zrobiona: {ex}, seria {n}'].replace('{ex}', 'Back Squat').replace('{n}', '1');
  const row = EN['Seria {n} zrobiona — {ex}'].replace('{ex}', 'Back Squat').replace('{n}', '1');
  const y = fs.readFileSync(path.join(__dirname, '..', '.maestro', '11-widok-skupiony.yaml'), 'utf8');
  const sel = [...y.matchAll(/(?:visible|tapOn|assertNotVisible):\s*"(Set done[^"]*)"/g)].map(m => JSON.parse('"' + m[1] + '"'));
  expect(sel.length).toBeGreaterThanOrEqual(3);
  for (const s of sel) { const re = new RegExp('^(?:' + s + ')$'); expect({ s, card: re.test(card), row: re.test(row) }).toEqual({ s, card: true, row: false }); }
});

test('regresja run 37600735711: przycisk „Cancel workout” w oknie wskazany względem przycisku w tle, nie opisu (opis zachodzi na okno w kroju Tuleja)', () => {
  const fs = require('fs'); const path = require('path');
  const y = fs.readFileSync(path.join(__dirname, '..', '.maestro', '07-zamiana.yaml'), 'utf8');
  expect(y).toContain('tapOn: { text: "Cancel workout", below: "Back", above: "Cancel workout" }');
  expect(y).not.toMatch(/above: "The workout in progress saves/);
});

test('regresja run 37611882320: scenariusz 11 nie używa hideKeyboard (klawiatura numeryczna nie ma akcji „schowaj”) — tap w tekst karty', () => {
  const fs = require('fs'); const path = require('path'); const { EN } = require('@/lib/i18n.en');
  const y = fs.readFileSync(path.join(__dirname, '..', '.maestro', '11-widok-skupiony.yaml'), 'utf8');
  expect(y).not.toMatch(/^- hideKeyboard/m);
  expect(y).toContain(`- tapOn: "${EN['seria {n} z {all}'].replace('{n}', '1').replace('{all}', '1')}"`);
});
