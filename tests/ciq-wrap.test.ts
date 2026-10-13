/* Zawijanie tekstu zegarka (lib/watch/ciqWrap.ts = garmin/source/Wrap.mc): przypadki, granice, niezmienniki. Szerokość atrapy: 10 px na znak. */
import { ciqWrapLines } from '@/lib/watch/ciqWrap';

const W10 = (s: string) => [...s].length * 10;
const wrap = (t: string, w: number) => ciqWrapLines(t, w, W10);

describe('ciqWrapLines', () => {
  test.each([
    ['', 100, []], ['abc', 100, ['abc']], ['ab cd', 100, ['ab cd']], ['ab cd ef', 50, ['ab cd', 'ef']], ['ab cd ef', 40, ['ab', 'cd', 'ef']],
    ['abcdefghij', 50, ['abcde', 'fghij']], ['ab  cd', 100, ['ab  cd']], ['  ab', 100, ['ab']], ['ab\ncd', 100, ['ab', 'cd']], ['ab\n\ncd', 100, ['ab', '', 'cd']],
    ['ab cdefgh', 50, ['ab', 'cdefg', 'h']], ['日本語のテキスト', 30, ['日本語', 'のテキ', 'スト']], ['Wyciskanie sztangi leżąc', 120, ['Wyciskanie', 'sztangi', 'leżąc']],
  ])('%j (szerokość %i)', (t, w, want) => { expect(wrap(t, w)).toEqual(want); });
  test('żadna linia nie jest szersza niż maxW (poza pojedynczym znakiem szerszym niż maxW) i nic nie ginie poza spacjami łamania', () => {
    const texts = ['Rumänisches Kreuzheben mit der Langhantel im Stehen', 'Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)', 'a b c d e f g h i j k l m n o p'];
    for (const t of texts) for (const w of [30, 60, 100, 200, 400]) {
      const ls = wrap(t, w); for (const l of ls) expect(W10(l)).toBeLessThanOrEqual(Math.max(w, 10));
      expect(ls.join(' ').replace(/\s+/g, ' ').replace(/ /g, '')).toBe(t.replace(/ /g, ''));
    }
  });
});
