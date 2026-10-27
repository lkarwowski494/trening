/*
 * M1-audytor-generalny-008 (audyt 1.0, 27.10.2026; 10-wydanie-001): kandydat do recenzji wiąże numer buildu z SHA. Krok Z-26 (wybór buildu w App Store
 * Connect) podaje numer i SHA kandydata (pole „Kandydat: build … SHA …”, uzupełniane przed zgłoszeniem; numer = tag `v1.0.0-bNNNN` na SHA zatwierdzonym
 * w reaudycie), starsze buildy 1.0 są wygaszane w TestFlight, a dziennik wydań (docs/09) ma wiersze 1031 i 1032.
 * Rodzaje (docs/20): dane (dokumenty wydania), regresja.
 */
import * as fs from 'fs';
import * as path from 'path';

const read = (f: string) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const journal = () => read('docs/09-plan-testow.md').split('\n').filter(l => /^\| `v[\d.]+-b\d+` \|/.test(l)).map(l => l.split(' | ').map(c => c.replace(/[|`\s]/g, '')));

describe('M1-008: build do zgłoszenia 1.0', () => {
  test('docs/09: dziennik wydań ma wiersze 1031 (001ecf2) i 1032 (025a50b)', () => {
    const j = journal(); const row = (b: string) => j.find(r => r[1] === b);
    expect(row('1031')?.[2]).toBe('001ecf2'); expect(row('1032')?.[2]).toBe('025a50b');
  });
  test('docs/48 Z-26: pole kandydata z numerem buildu i SHA; numer wypełniony musi być w dzienniku z tym samym SHA', () => {
    const z26 = read('docs/48-zgloszenie-1-0.md').split('\n').find(l => l.startsWith('| Z-26 |'))!;
    const m = /Kandydat: build (\d{4}|—) · SHA `?([0-9a-f]{7}|—)`?/.exec(z26); expect(m).not.toBeNull();
    if (m![1] !== '—') expect(journal().find(r => r[1] === m![1])?.[2]).toBe(m![2]);
    expect(z26).toMatch(/v1\.0\.0-b/); expect(z26).toMatch(/reaudy/);
  });
  test('docs/48: krok wygaszenia starszych buildów 1.0 (1031, 1032) w TestFlight przed wyborem buildu', () => {
    const rows = read('docs/48-zgloszenie-1-0.md').split('\n').filter(l => /^\| Z-\d+[a-z]? \|/.test(l));
    expect(rows.some(l => /Expire Build|wygas/i.test(l) && /1031/.test(l) && /1032/.test(l))).toBe(true);
  });
});
