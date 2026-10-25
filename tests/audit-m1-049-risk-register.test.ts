/*
 * M1-audytor-generalny-049 (10-wydanie-005, 02-monetyzacja-006): rejestr ryzyk (docs/40) i docs/monetyzacja.md trzymały jako otwarte sprawy już
 * rozstrzygnięte dowodami — fałszywe blokady wydania. Test: R-M5-3, R-012 i R-009 zamknięte z numerem przebiegu i datą; docs/monetyzacja.md
 * bez [OTWARTE] (Family Sharing: nieodwracalność z odczytem strony Apple; dożywotnia w euro z kontroli ASC).
 */
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const row = (id: string) => read('docs/40-lekcje.md').split('\n').find((l) => l.startsWith(`| ${id} |`)) ?? '';
const state = (id: string) => row(id).split('|').slice(-2)[0].trim();

describe('rejestr ryzyk zgodny z dowodami (M1-049)', () => {
  test.each([
    ['R-M5-3', ['39822823188']],
    ['R-012', ['39741738792', '39873854799']],
    ['R-009', ['39741738792', '39565108351']],
  ])('%s: stan „zamknięte” z datą i numerami przebiegów %j', (id, runs) => {
    const s = state(id);
    expect(s).toMatch(/^\*\*zamknięte \d{2}\.\d{2}\.\d{4}\*\*/);
    for (const r of runs) expect([id, r, s.includes(r)]).toEqual([id, r, true]);
  });
  test('docs/monetyzacja.md: bez [OTWARTE]; Family Sharing nieodwracalne (cytat Apple z datą odczytu), dożywotnia w euro 17,99 € z kontroli ASC', () => {
    const m = read('docs/monetyzacja.md');
    expect(m).not.toMatch(/\[OTWARTE\]/);
    const fam = m.split('\n').find((l) => l.includes('**Chmura rodzinna (Family Sharing):**')) ?? '';
    expect(fam).toMatch(/you can't turn it off/); expect(fam).toMatch(/odczyt \d{2}\.\d{2}\.\d{4}/); expect(fam).toContain('39822823188');
    const eur = m.split('\n').find((l) => l.includes('**Euro (21.10.2026')) ?? '';
    expect(eur).toMatch(/dożywotnia[^.]*17,99 €[^.]*39822823188/i);
  });
});
