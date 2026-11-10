/*
 * Figury v2 — core_hang: drążek ma słupek (10.11.2026, recenzja r1 partii 5, znalezisko Ś1: w rzucie z boku drążek to kółko r 1,6 cm schowane pod dłonią,
 * postać „wisi w powietrzu”). Wzór: pull_up Dead Hang — { rodzaj: slupek, x: 0, h: y + 5 } przy drążku (sztanga) na tej samej osi.
 */
import * as fs from 'fs';
import * as path from 'path';

const pozy = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib/figures/v2/poses/core_hang.json'), 'utf8'));
const CW = ['Hanging Knee Raise', 'Hanging Leg Raise', 'Toes to Bar'];

describe('core_hang: słupek przy drążku (Ś1)', () => {
  test('plik póz ma dokładnie te 3 ćwiczenia', () => { expect(Object.keys(pozy.cwiczenia).sort()).toEqual([...CW].sort()); });
  test.each(CW)('%s: sprzęt ma słupek na osi drążka, sięgający nad drążek, obok drążka (sztanga) i podłogi', (cw) => {
    const sp: any[] = pozy.cwiczenia[cw].sprzet; const draz = sp.find(s => s.rodzaj === 'sztanga'); const sl = sp.filter(s => s.rodzaj === 'slupek');
    expect(draz).toBeTruthy(); expect(sl).toHaveLength(1);
    expect(sl[0].x).toBe(draz.x); expect(sl[0].h).toBe(draz.y + 5); expect(sp.some(s => s.rodzaj === 'podloga')).toBe(true);
  });
});
