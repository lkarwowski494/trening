/** Zgody Zdrowia (InfoPlist): pt-BR używa trybu oznajmującego po „Quando” (apaga), nie łącznego („apague”); pt i pt-BR zachowują swój zwrot do użytkownika. */
import * as fs from 'fs';
import * as path from 'path';

const J = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'locales', f), 'utf8')) as Record<string, string>;

describe('zgody Zdrowia pt / pt-BR: forma czasownika', () => {
  test('pt-BR: „o app apaga a própria cópia”, bez „apague”', () => {
    const t = J('pt-BR.json').NSHealthUpdateUsageDescription;
    expect(t).not.toMatch(/\bapague\b/); expect(t).toMatch(/o app apaga a própria cópia/);
  });
  test('pt: „a app apaga a sua própria cópia”', () => { expect(J('pt.json').NSHealthUpdateUsageDescription).toMatch(/a app apaga a sua própria cópia/); });
});
