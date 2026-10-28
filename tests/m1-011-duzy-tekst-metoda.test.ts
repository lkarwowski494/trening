/*
 * M1-audytor-generalny-011 (pętla 2, reaudyt 28.10.2026; 07-jakosc-009, 01/09): metoda NFR-DOS-001 opisywała tylko Jest, choć duży tekst sprawdza też
 * scenariusz Maestro 58 (zrzuty ekranu Trening przy największym tekście) i strażnik stanu pierwszego uruchomienia (M1-043); stan „dziś bez treningu” przy
 * największym tekście nie miał kroku na liście telefonu. Test: NFR-DOS-001 wymienia Jest, scenariusz 58 i krok telefonu; docs/49 T-04 ma stan „dziś bez treningu”.
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');

describe('M1-011: duży tekst — metoda w BRD i krok telefonu', () => {
  test('NFR-DOS-001: metoda = Jest (matrix-a11y, stan pierwszego uruchomienia) + Maestro 58 + telefon (T-04, ZD-03); pliki istnieją', () => {
    const b = read('docs/brd/wymagania.md'); const s = b.slice(b.indexOf('### NFR-DOS-001'), b.indexOf('### NFR-WYG-001'));
    for (const f of ['tests/matrix-a11y.test.tsx', 'tests/m1-043-pierwsze-kroki-glyph.test.tsx', '.maestro/58-duzy-tekst.yaml']) { expect(s).toContain(f); expect(fs.existsSync(path.join(ROOT, f))).toBe(true); }
    expect(s).toMatch(/T-04/); expect(s).toMatch(/dziś bez treningu/);
  });
  test('docs/49 T-04: największy tekst — stan „dziś bez treningu” z ikoną startu kolejnego treningu', () => {
    const t04 = read('docs/49-testflight-1-0.md').split('\n').find((l) => l.includes('**T-04')) ?? '';
    expect(t04).toMatch(/dziś bez treningu[^\n]*ikon/);
  });
});
