/* Zegar interpretera Maestro w Jest: stałe południe zamiast prawdziwej godziny (tests.yml 39679369474 — scenariusz 05 przeszedł przez północ,
 * etykieta „today” wskazywała inny dzień niż sesja zapisana o 23:59). */
import { maestroNow } from './maestro-runner';

describe('zegar scenariuszy Maestro w Jest', () => {
  test.each([[new Date(2026, 9, 21, 23, 59, 30)], [new Date(2026, 9, 21, 0, 0, 5)], [new Date(2026, 9, 21, 12, 0, 0)]])('bez MAESTRO_NOW: ta sama doba, godzina 12:00 (%s)', real => {
    const n = maestroNow(undefined, real);
    expect([n.getFullYear(), n.getMonth(), n.getDate(), n.getHours(), n.getMinutes(), n.getSeconds()]).toEqual([2026, 9, 21, 12, 0, 0]);
  });
  test('MAESTRO_NOW ma pierwszeństwo (scenariusze „z życia”, docs/31)', () => {
    expect(maestroNow('2026-03-31T09:30:00', new Date(2026, 9, 21, 23, 59)).getTime()).toBe(new Date('2026-03-31T09:30:00').getTime());
  });
});
