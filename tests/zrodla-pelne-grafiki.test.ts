/*
 * Pełne dane źródeł (data/zrodla/cues.json) dla błędu „wygięcie pleców / unoszenie klatki do sztangi” (figury v2, wyciskanie leżąc): każde wystąpienie wskazówki
 * `bp.mis.arch` ma odwołanie do przeczytanego źródła z miejscem (strona) i znanym szczeblem. Wyodrębnione z tests/figures-v2-bench-rules.test.ts, bo testy czytające
 * nazwy źródeł mieszkają tylko w `tests/zrodla-pelne-*.test.ts` (decyzja właściciela 25.10.2026; rodzaj: dane).
 */
import { CUE_FULL } from './zrodla-pelne';

describe('pełne dane: błąd „arch” przy wyciskaniu leżąc ma źródło ze stroną', () => {
  test('każde wystąpienie bp.mis.arch ma odwołanie do źródła szczebla 4 ze stroną (s. 54), a źródło jest opisane w pełnych danych', () => {
    const own = Object.values(CUE_FULL.exercises).flatMap(e => (e.mistakes ?? []).filter(m => m.c === 'bp.mis.arch')); expect(own.length).toBeGreaterThan(0);
    for (const m of own) expect(m.s.some(x => x[0] === 'nsca-basics-2012' && /s\. 54/.test(x[1]))).toBe(true);
    expect(CUE_FULL.sources['nsca-basics-2012'].level).toBe(4);
  });
});
