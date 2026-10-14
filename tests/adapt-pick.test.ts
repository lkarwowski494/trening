/* 0.18: kanał wyboru z arkusza zamiany do okna „Dostosuj do miejsca” (lib/adaptPick.ts) — nasłuch w pamięci. */
import { onAdaptPick, emitAdaptPick, type AdaptPick } from '@/lib/adaptPick';

describe('lib/adaptPick', () => {
  test('emitAdaptPick dostarcza wybór wszystkim nasłuchującym (swap, impl, skip, „Bez zmian” = null), w kolejności', () => {
    const got: AdaptPick[] = []; const off = onAdaptPick(p => got.push(p)); const other: AdaptPick[] = []; const off2 = onAdaptPick(p => other.push(p));
    emitAdaptPick({ blockId: 'a', choice: { kind: 'swap', blockId: 'a', toExId: 'x' } }); emitAdaptPick({ blockId: 'b', choice: null }); emitAdaptPick({ blockId: 'c', choice: { kind: 'skip', blockId: 'c' } });
    expect(got.map(p => [p.blockId, p.choice?.kind ?? null])).toEqual([['a', 'swap'], ['b', null], ['c', 'skip']]); expect(other).toEqual(got); off(); off2();
  });
  test('onAdaptPick zwraca funkcję odpinającą — po niej wybór nie dochodzi; brak nasłuchujących nie rzuca', () => {
    const got: AdaptPick[] = []; const off = onAdaptPick(p => got.push(p)); off(); expect(() => emitAdaptPick({ blockId: 'a', choice: null })).not.toThrow(); expect(got).toEqual([]);
  });
  test('odpięcie jednego nasłuchu nie odpina drugiego; podwójne odpięcie jest nieszkodliwe', () => {
    const a: AdaptPick[] = [], b: AdaptPick[] = []; const offA = onAdaptPick(p => a.push(p)); const offB = onAdaptPick(p => b.push(p)); offA(); offA();
    emitAdaptPick({ blockId: 'z', choice: null }); expect(a).toEqual([]); expect(b).toHaveLength(1); offB();
  });
});
