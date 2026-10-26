/*
 * Regresja nocnego przebiegu 40263099163 (26.10.2026, iPhone SE, ciemny; zrzuty nieudanych kroków, artefakty e2e-ios-2/3):
 * 14 — uwaga „oneday” stoi pod celem, nad podglądem; po przewinięciu do „Mon.* Full Body” na małym ekranie jest nad ekranem, a szukanie w dół jej nie znajdowało.
 * 26 — panel dnia przewija stronę, nagłówek kalendarza jest nad ekranem (zrzut 90) i pierwsze „Previous month” nie trafiało (sesja wpisana 1 X zamiast 1 IX);
 *      po powrocie „Next month” liczone na ślepo kończyło w listopadzie bez „today”.
 */
import { join } from 'path';
import { DIR, load } from './maestro-runner';

const cmds = (f: string): any[] => load(join(DIR, f));
const idx = (c: any[], pred: (x: any) => boolean, from = 0) => { const i = c.findIndex((x, k) => k >= from && pred(x)); if (i < 0) throw new Error('brak kroku'); return i; };

test('14: uwaga „oneday” szukana w górę (leży nad podglądem)', () => {
  const c = cmds('14-generator.yaml');
  const i = idx(c, x => x.scrollUntilVisible?.element === 'One workout a week still brings progress.*');
  expect(c[i].scrollUntilVisible.direction).toBe('UP');
});

test('26: przed „Previous month” przewinięcie do nagłówka kalendarza', () => {
  const c = cmds('26-plan-zarzadzanie.yaml');
  const prev = idx(c, x => x.tapOn === 'Previous month');
  expect(c[prev - 1].scrollUntilVisible).toMatchObject({ element: 'Previous month', direction: 'UP' });
});

test('26: powrót do dzisiejszego dnia bez liczenia miesięcy — „Next month” tylko gdy „today” niewidoczne', () => {
  const c = cmds('26-plan-zarzadzanie.yaml');
  const t = idx(c, x => x.tapOn?.text === '.*, today.*');
  expect(c.slice(0, t).some(x => x.runFlow?.when?.notVisible === '.*, today.*' && x.runFlow.commands.some((y: any) => y.tapOn === 'Next month'))).toBe(true);
  expect(c[t - 1].scrollUntilVisible).toMatchObject({ element: '.*, today.*' });
  expect(c[t - 2].runFlow?.when).toBeTruthy();
});
