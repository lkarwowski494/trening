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
  test('709 ćwiczeń; 17 rodzin z regułami (6 z rundy 1 + squat, bench_press, hinge, lunge, overhead_press, chest_fly, row, cable_row, pulldown, plyo, olympic z rundy 2); każde ćwiczenie ma dokładnie jeden status; zapadka: pokrycie nie maleje', () => {
    expect(p.cwiczen).toBe(709);
    const z = Object.fromEntries(Object.entries(p.rodziny).filter(([, x]) => x.z_regulami > 0).map(([r, x]) => [r, x.z_regulami]));
    expect(z).toEqual({ bench_press: 30, cable_row: 9, chest_fly: 17, core_floor: 35, curl: 36, delt_raise: 33, hinge: 32, lunge: 24, olympic: 23, overhead_press: 19, plyo: 27, pull_up: 12, pulldown: 7, pushup_plank: 30, row: 13, squat: 25, triceps: 29 });
    expect(Object.values(z).reduce((a, b) => a + b, 0)).toBe(401);
    for (const [r, x] of Object.entries(p.rodziny)) expect([r, x.z_regulami + x.otwarte + x.sprzet_poza_kontraktem + x.bez_regul]).toEqual([r, x.cwiczen]);
    expect(Object.values(p.rodziny).reduce((a, x) => a + x.cwiczen, 0)).toBe(709);
  });
  test('87 gotowych figur (squat, bench_press, hinge) ma reguły sensu (runda 2): lista bez reguł jest pusta; naruszenia figur: zapadka — liczba figur łamiących reguły nie może rosnąć (stan 26.10.2026: 42 z 87; naprawa parametrami figur, nie luzowaniem progów)', () => {
    expect(p.gotowe_figury).toBe(87); expect(p.gotowe_bez_regul).toEqual([]);
    const n = JSON.parse(execFileSync(process.execPath, [path.join(ROOT, 'scripts/figures/sens-gotowe.mjs'), '--json'], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })) as { cwiczenie: string; naruszenia: { regula: string }[] }[];
    expect(n).toHaveLength(87); const z = n.filter((x) => x.naruszenia.length);
    expect(z.length).toBeLessThanOrEqual(42); /* spadek (naprawy) wymaga zmniejszenia tej liczby */
    const reguly = new Set(z.flatMap((x) => x.naruszenia.map((y) => y.regula))); for (const r of reguly) expect(['kolana_nad_stopami', 'zawias_w_biodrach', 'kolana_lekko_ugiete', 'wyprost_na_gorze', 'przedramie_pod_sztanga', 'ciezar_przy_nogach', 'zakres_podloga', 'pelny_zakres']).toContain(r);
  });
});
