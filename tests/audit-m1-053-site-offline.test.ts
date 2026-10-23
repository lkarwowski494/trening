/*
 * M1-audytor-generalny-053 (11-wzrost-003): strona produktu twierdziła „nie łączy się z internetem” bez zastrzeżenia, że zakup, przywrócenie
 * i odczyt subskrypcji idą przez App Store (sieć Apple). Polityka prywatności ma to zastrzeżenie. Test: każde zdanie o internecie na stronie
 * produktu (PL i EN) ma to samo zastrzeżenie co polityka.
 */
import * as fs from 'fs';
import * as path from 'path';

const read = (f: string) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
const idx = read('site/index.html');
const privacy = read('site/privacy.html').replace(/\s+/g, ' ');
const PL = 'nie łączy się z internetem (zakupy obsługuje App Store)';
const EN = 'does not connect to the internet (purchases are handled by the App Store)';

describe('strona produktu: zdanie o internecie z zastrzeżeniem o zakupach, jak w polityce (M1-053)', () => {
  test('polityka prywatności ma zastrzeżenie (PL i EN)', () => { expect(privacy).toContain(PL); expect(privacy).toContain(EN); });
  test('site/index.html: każde „nie łączy się z internetem” / „does not connect to the internet” ma zastrzeżenie', () => {
    const pl = [...idx.matchAll(/nie łączy się z internetem[^<.]*/g)].map((m) => m[0]);
    const en = [...idx.matchAll(/does not connect to the internet[^<.]*/g)].map((m) => m[0]);
    expect(pl.length).toBeGreaterThan(0); expect(en.length).toBeGreaterThan(0);
    for (const s of pl) expect(s).toBe(PL);
    for (const s of en) expect(s).toBe(EN);
  });
});
