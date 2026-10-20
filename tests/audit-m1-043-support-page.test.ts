/*
 * M1-audytor-generalny-043: strona wsparcia (site/support.html) mówiła, że automatyczną kopię po treningu „włączysz” w Ustawieniach, a jest domyślnie włączona
 * (lib/seed.ts defaultSettings().autoBackup === true). Test zgodności stanu domyślnego ze zdaniem FAQ po polsku i angielsku — zmiana domyślnej wartości wymusza zmianę strony.
 */
import * as fs from 'fs';
import * as path from 'path';
import { defaultSettings } from '@/lib/seed';

const html = fs.readFileSync(path.join(__dirname, '..', 'site', 'support.html'), 'utf8').replace(/\s+/g, ' ');
const sentence = (re: RegExp) => { const m = re.exec(html); expect(m).not.toBeNull(); return m![0]; };

describe('support.html: kopia po treningu a ustawienie domyślne', () => {
  const on = defaultSettings().autoBackup;
  test('PL: zdanie o kopii automatycznej zgodne z defaultSettings (domyślnie włączona → „domyślnie … wyłączysz”, nie „włączysz”)', () => {
    const s = sentence(/Aplikacja[^.]*kopię po każdym treningu[^.]*\./);
    if (on) { expect(s).toMatch(/domyślnie/); expect(s).toMatch(/wyłączysz/); expect(s).not.toMatch(/włączysz/); } else { expect(s).toMatch(/włączysz/); expect(s).not.toMatch(/domyślnie/); }
  });
  test('EN: ten sam stan domyślny („by default … turn this off”)', () => {
    const s = sentence(/(?:By default )?[Tt]he app [^.]*copy after every workout[^.]*\./);
    if (on) { expect(s).toMatch(/by default/i); expect(s).toMatch(/turn this off/); expect(s).not.toMatch(/turn this on/); } else { expect(s).toMatch(/turn this on/); expect(s).not.toMatch(/by default/i); }
  });
  test('stan domyślny: kopia po treningu włączona (decyzja z audytu: strona opisuje fakt, nie życzenie)', () => { expect(on).toBe(true); });
});
