/*
 * M1-audytor-generalny-063 (DEC-17 a): wersaliki w interfejsie i ciągi „A · B · C” nie miały zapisanej decyzji. Decyzja właściciela 20.10.2026 w docs/32 (wzorzec 28):
 * wersaliki tylko w nagłówkach grup, „·” tylko dla metadanych o stałej kolejności. Test: decyzja jest zapisana z datą i z wyjątkami z powodem;
 * strażnik wersalików — `upperText()`/`upper()` i `textTransform: 'uppercase'` tylko w miejscach z listy wyjątków (nowe użycie wymaga decyzji i wpisu).
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
/** Kod bez komentarzy (komentarze opisują wersaliki, ale ich nie używają). */
const code = (f: string) => read(f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
function files(dir: string): string[] {
  const out: string[] = [];
  for (const f of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${f.name}`;
    if (f.isDirectory()) out.push(...files(rel)); else if (/\.(tsx?|jsx?)$/.test(f.name)) out.push(rel);
  }
  return out;
}
const doc = read('docs/32-wzorce-interakcji.md');
const sec = doc.slice(doc.indexOf('### 28.'), doc.indexOf('## Strażniki'));

describe('docs/32 wzorzec 28: wersaliki i ciągi „A · B · C” (DEC-17, 20.10.2026)', () => {
  test('sekcja istnieje z datą decyzji i numerem DEC-17', () => {
    expect(doc).toContain('### 28.'); expect(sec).toMatch(/20\.10\.2026/); expect(sec).toMatch(/DEC-17/);
  });
  test('treść decyzji: wersaliki tylko w nagłówkach grup; „·” tylko dla metadanych o stałej kolejności; odrzucona opcja B', () => {
    expect(sec).toMatch(/Wersaliki[^\n]*tylko w nagłówkach grup/i); expect(sec).toMatch(/„·”[^\n]*(metadan)[^\n]*(stał)/i); expect(sec).toMatch(/Odrzucone/);
  });
  test('wyjątki od wersalików wymienione z powodem (TodayPlan)', () => { expect(sec).toMatch(/TodayPlan/); expect(sec).toMatch(/Wyjątki/); });
});

describe('strażnik wersalików', () => {
  const src = [...files('app'), ...files('components'), ...files('lib')].filter((f) => !f.startsWith('lib/locales'));
  test("brak textTransform: 'uppercase' (iOS robi wersaliki bez języka — A11-02; wersaliki przez upper())", () => {
    expect(src.filter((f) => /textTransform:\s*['"]uppercase['"]/.test(code(f)) && f !== 'components/ui.tsx')).toEqual([]);
  });
  test('upperText() używany tylko w components/ui.tsx (SectionTitle) i wskazanych wyjątkach', () => {
    const users = src.filter((f) => /\bupperText\(/.test(code(f))).sort();
    expect(users).toEqual(['components/TodayPlan.tsx', 'components/ui.tsx']);
  });
  test('upper() z lib/i18n tylko w miejscach znanych (ui.tsx, tytuł grupy w GuardSection.tsx, skrót koloru gumy w lib/state/sets.ts)', () => {
    const users = src.filter((f) => /[^\w.]upper\(/.test(code(f)) && f !== 'lib/i18n.ts').sort();
    expect(users).toEqual(['components/GuardSection.tsx', 'components/ui.tsx', 'lib/state/sets.ts']);
  });
});
