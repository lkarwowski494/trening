/*
 * M1-055 (DEC-07 K5), M1-056 (DEC-07 K6), M1-012 (DEC-07 K8): reguły uczciwej promocji w planie startu i roli marketingu, nowy przekaz startowy
 * (z Apple Watch) zamiast hasła z 13.10.2026 oraz dopisek 471/388 USD w docs/monetyzacja.md.
 */
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..');
const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf8');
const agent = read('.claude/agents/marketing.md');
const PRZEKAZ = 'szybki zapis serii, także z zegarka; dane tylko na telefonie; bez konta'; /* docs/wzrost.md: tests/dokumenty-na-dysk.test.ts */

describe('reguły uczciwej promocji (M1-055)', () => {
  test('rola marketingu zna te same cztery reguły (odsyłacz do docs/wzrost.md: tests/dokumenty-na-dysk.test.ts)', () => {
    expect(agent).toMatch(/ujawnij autorstwo/);
    expect(agent).toMatch(/nie proponuj próśb o oceny do znajomych/);
    expect(agent).toMatch(/zgodzie odbiorcy na kontakt/);
    expect(agent).toMatch(/zakaz promocji, wpis wyłącznie po pisemnej zgodzie administracji/);
  });
  test('agent marketingu nadal niczego nie publikuje sam', () => {
    expect(agent).toMatch(/NIGDY nie publikujesz/);
  });
});

describe('przekaz startowy z zegarkiem (M1-056)', () => {
  test('nowy przekaz jest w docs/15, docs/18 i roli marketingu', () => {
    for (const f of ['docs/15-app-store.md', 'docs/18-przekazanie.md']) expect(read(f)).toContain(PRZEKAZ);
    expect(agent).toContain(PRZEKAZ);
  });
  test('stare hasło z 13.10.2026 jest oznaczone jako zastąpione i nie występuje poza historią w docs/18', () => {
    expect(read('docs/18-przekazanie.md')).toMatch(/Bez internetu\.” \(brzmienie do zatwierdzenia; \*\*zastąpione 23\.10\.2026/);
    for (const f of ['docs/15-app-store.md', 'docs/45-widocznosc-w-sklepie.md', 'docs/16-jezyki-i-marka.md', '.claude/agents/marketing.md', 'site/index.html']) {
      expect(read(f)).not.toMatch(/Prosty dziennik siłowni|zostaje w Twoim telefonie/);
    }
  });
  test('strona produktu PL i EN wymienia Apple Watch obok zapisu serii', () => {
    const html = read('site/index.html').replace(/<!--[\s\S]*?-->/g, '');
    const pl = html.slice(html.indexOf('<section lang="pl"'), html.indexOf('<section lang="en"'));
    const en = html.slice(html.indexOf('<section lang="en"'));
    expect(pl).toContain('Szybki zapis serii, także z Apple Watch (opcjonalnie).');
    expect(en).toContain('Quick set logging, also from Apple Watch (optional).');
  });
});

describe('dopisek 471/388 USD (M1-012)', () => {
  const money = read('docs/monetyzacja.md');
  test('471 USD (górna granica, prowizja 15%) i ok. 388 USD (prowizja 30%) w sekcji bramki W0', () => {
    const w0 = money.slice(money.indexOf('## Bramka W0'));
    expect(w0).toMatch(/471 USD\/rok to górna granica/);
    expect(w0).toMatch(/ok\. 388 USD/);
    expect(w0).toMatch(/Przeliczenie w punkcie kontrolnym/);
  });
  test('388 = 471 × (1 − 30%) / (1 − 15%), obie wartości poniżej progu 500 USD', () => {
    expect(Math.round((471 * 0.7) / 0.85)).toBe(388);
    expect(471).toBeLessThan(500);
  });
});
