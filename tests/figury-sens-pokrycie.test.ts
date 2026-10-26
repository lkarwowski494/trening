/*
 * Pokrycie regułami sensu ruchu (docs/53, bramki 3 i 5): scripts/figures/pokrycie-sensu.mjs. Test POKAZUJE dług: 87 gotowych figur (squat, bench_press, hinge — silnik v2 powstał przed bramką)
 * nie ma reguł sensu; lista jest jawna (wyjątek z powodem), a liczba nie może rosnąć (zapadka). Rodzaje: dane (liczby per rodzina), niezmienniki (każde ćwiczenie ma dokładnie jeden status), regresja (zapadka).
 */
import * as path from 'path';
import { execFileSync } from 'child_process';

jest.setTimeout(120000);
const ROOT = path.join(__dirname, '..');
type P = { cwiczen: number; rodziny: Record<string, { cwiczen: number; z_regulami: number; otwarte: number; sprzet_poza_kontraktem: number; bez_regul: number }>; gotowe_figury: number; gotowe_bez_regul: string[]; gotowe_z_wskazowkami: number; gotowe_bez_wskazowek: number; wskazowki_gotowych: Record<string, number> };
const p: P = JSON.parse(execFileSync(process.execPath, [path.join(ROOT, 'scripts/figures/pokrycie-sensu.mjs'), '--json'], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }));

describe('pokrycie regułami sensu (bramka 3/5)', () => {
  test('709 ćwiczeń; rodziny z regułami: pull_up, core_floor, curl, triceps, delt_raise, pushup_plank — razem 175 ćwiczeń z regułami; każde ćwiczenie ma dokładnie jeden status', () => {
    expect(p.cwiczen).toBe(709);
    const z = Object.entries(p.rodziny).filter(([, x]) => x.z_regulami > 0).map(([r, x]) => [r, x.z_regulami]).sort();
    expect(z).toEqual([['core_floor', 35], ['curl', 36], ['delt_raise', 33], ['pull_up', 12], ['pushup_plank', 30], ['triceps', 29]]);
    for (const [r, x] of Object.entries(p.rodziny)) expect([r, x.z_regulami + x.otwarte + x.sprzet_poza_kontraktem + x.bez_regul]).toEqual([r, x.cwiczen]);
    expect(Object.values(p.rodziny).reduce((a, x) => a + x.cwiczen, 0)).toBe(709);
  });
  test('DŁUG: 87 gotowych figur (squat, bench_press, hinge) BEZ reguł sensu — wszystkie mają wskazówki (kandydaci do reguł); zapadka: liczba nie może rosnąć, spadek wymaga aktualizacji testu', () => {
    expect(p.gotowe_figury).toBe(87); expect(p.gotowe_bez_regul).toHaveLength(87); expect(p.gotowe_z_wskazowkami).toBe(87); expect(p.gotowe_bez_wskazowek).toBe(0);
    for (const c of ['Back Squat', 'Bench Press (sztanga)', 'RDL (sztanga)']) expect(p.gotowe_bez_regul).toContain(c);
    const geo = ['hinge.back', 'mis.roundBack', 'sq.back', 'sq.kneesToes', 'sq.mis.kneesIn', 'sq.down', 'bp.contact', 'dl.close', 'rdl.knees']; /* wskazówki o treści geometrycznej — kandydaci do reguł */
    for (const g of geo) expect([g, p.wskazowki_gotowych[g] > 0]).toEqual([g, true]);
    expect(Object.keys(p.wskazowki_gotowych).length).toBe(64);
  });
});
