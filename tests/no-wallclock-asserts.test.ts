/* M1-audytor-generalny-060: bramka verify (jest) nie może zależeć od zegara ściennego — asercje na zmierzony czas padają na obciążonej maszynie
   (równoległe przebiegi, CI) bez błędu w kodzie. Pomiar czasu żyje w zestawie perf (`npm run perf`, scripts/perf). Drugi strażnik: test „perf …” musi mieć asercję
   (test bez asercji niczego nie sprawdza). */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const dir = __dirname;
const pliki = readdirSync(dir).filter(f => /\.test\.tsx?$/.test(f) && f !== 'no-wallclock-asserts.test.ts');
const kod = (f: string) => readFileSync(join(dir, f), 'utf8').replace(/\/\*[\s\S]*?\*\/|(^|[^:])\/\/.*$/gm, '$1');
const CZAS = /expect\(\s*(?:ms|[^()]*?\b(?:Date\.now|performance\.now|realNow)\(\)[^()]*?)\s*\)\s*\.(?:not\.)?(?:toBeLessThan|toBeLessThanOrEqual)/;

const BUDZET = /\bok:\s*d\s*<\s*ms\b|\bd(?:Start|Hist|Prog):\s*d\w+\s*<\s*\d+/; /* wzorzec „budget” z matrix-data-fuzz */

describe('testy nie zależą od zegara ściennego (M1-060)', () => {
  test('żadnej asercji na zmierzony czas w tests/', () => {
    expect(pliki.filter(f => CZAS.test(kod(f)) || BUDZET.test(kod(f)))).toEqual([]);
  });
  test('test o nazwie „perf …” ma asercję w swoim ciele', () => {
    const bez = pliki.filter(f => {
      const k = kod(f); const m = /\btest\(\s*'perf[^']*'[\s\S]*$/.exec(k); if (!m) return false;
      return !/expect\(/.test(m[0]);
    });
    expect(bez).toEqual([]);
  });
});
