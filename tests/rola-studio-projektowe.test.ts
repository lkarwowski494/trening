/** Decyzja właściciela 05.11.2026 (wariant A, lekcja o ekranie startowym w docs/40): rola studio-projektowe dla każdej zmiany wyglądu albo przepływu UI. */
import fs from 'fs';
const read = (p: string) => fs.readFileSync(p, 'utf8');

describe('05.11.2026: rola studio-projektowe', () => {
  const rola = read('.claude/agents/studio-projektowe.md');
  it('ma nagłówek agenta i zakaz zmiany kodu aplikacji', () => {
    expect(rola).toMatch(/^---\nname: studio-projektowe\n/);
    expect(rola).toContain('Kodu aplikacji nie zmieniasz');
    expect(rola).toContain('Nie wypychasz gałęzi');
  });
  it('pilnuje zasady: barwa talerza oznacza wyłącznie ciężar, element firmowy niesie dane', () => {
    expect(rola).toContain('Barwa talerza oznacza wyłącznie ciężar');
    expect(rola).toContain('Element firmowy niesie dane');
  });
  it('wymaga renderu narzędziami z docs/design/narzedzia, które istnieją', () => {
    for (const f of ['zrzuty.mjs', 'warsztat.mjs', 'kontrast.mjs']) {
      expect(rola).toContain(f);
      expect(fs.existsSync(`docs/design/narzedzia/${f}`)).toBe(true);
    }
  });
  it('CLAUDE.md kieruje zmiany wyglądu najpierw do tej roli', () => {
    expect(read('CLAUDE.md')).toMatch(/studio-projektowe \(opus, 05\.11\.2026[^)]*\): \*\*każda zmiana wyglądu ekranu albo przepływu UI najpierw przez tę rolę/);
  });
});
