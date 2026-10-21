/*
 * M1-audytor-generalny-072 (DEC-26 a): decyzja o Androidzie po 8 tygodniach ma zapisane pola: metryka, próg, minimalna próba, data oceny — wartość albo jawne [DO USTALENIA]
 * (liczb nie zgadujemy), co najmniej dwie opcje metryki z kompromisami i rekomendacją; bez hipotez o zmianie modelu monetyzacji (model stały, docs/monetyzacja.md).
 */
import * as fs from 'fs';
import * as path from 'path';

const doc = fs.readFileSync(path.join(__dirname, '..', 'docs', 'wzrost.md'), 'utf8');
const sec = doc.slice(doc.indexOf('## 5. Decyzja o Androidzie'));

describe('docs/wzrost.md: decyzja o Androidzie po 8 tygodniach', () => {
  test('tabela pól: metryka, próg, minimalna próba, data oceny — każde z wartością albo [DO USTALENIA]', () => {
    for (const f of ['metryka', 'próg', 'minimalna próba', 'data oceny']) {
      const row = sec.split('\n').find((l) => l.startsWith(`| ${f} |`)); expect(row).toBeDefined();
      const cells = row!.split('|').slice(1, -1).map((c) => c.trim()); expect(cells).toHaveLength(3); expect(cells[1]).not.toBe(''); expect(cells[2]).not.toBe('');
    }
  });
  test('data oceny = premiera + 8 tygodni (56 dni)', () => { expect(sec).toMatch(/premiera \+ 8 tygodni \(56 dni\)/); });
  test('co najmniej dwie opcje metryki z kompromisami (plus/minus) i rekomendacja', () => {
    const opts = sec.match(/^- \*\*[A-Z]\. /gm) ?? []; expect(opts.length).toBeGreaterThanOrEqual(2);
    expect((sec.match(/Plus:/g) ?? []).length).toBeGreaterThanOrEqual(2); expect((sec.match(/Minus:/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(sec).toMatch(/\*\*Rekomendacja:\*\*/);
  });
  test('wartości liczbowe mają źródło w repo (kandydat progu opisany jako cel z docs/15) albo są oznaczone jako otwarte', () => {
    const prog = sec.split('\n').find((l) => l.startsWith('| próg |'))!; expect(prog).toMatch(/docs\/15|DO USTALENIA/);
    expect(sec).toMatch(/\[DO USTALENIA/);
  });
  test('bez hipotez o zmianie modelu monetyzacji; odsyłacz do docs/monetyzacja.md; bez kwot', () => {
    expect(sec).toMatch(/wyłącznie Androida/); expect(sec).toMatch(/model monetyzacji jest stały/); expect(sec).toContain('docs/monetyzacja.md');
    expect(sec).not.toMatch(/\d+[.,]\d{2}\s*(USD|EUR|GBP|zł)/); expect(sec).not.toMatch(/(zmian\w+|podwyż\w+|obniż\w+)\s+(ceny|cen|modelu)/i);
  });
});
