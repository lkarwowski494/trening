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
  test('709 ćwiczeń; 42 rodziny z regułami (r1–r3: 17 rodzin, r4: 24 rodziny partii 1, r5: mobility_stand, mobility_floor, foam_roll i reguły poza@2); każde ćwiczenie ma dokładnie jeden status; zapadka: pokrycie nie maleje (636 ćwiczeń z regułami; stan 27.10.2026, r5; −1: Inchworm wyjątek bez animacji, mobilność r4)', () => {
    expect(p.cwiczen).toBe(709);
    const z = Object.fromEntries(Object.entries(p.rodziny).filter(([, x]) => x.z_regulami > 0).map(([r, x]) => [r, x.z_regulami]));
    expect(z).toEqual({ back_extension: 4, bench_press: 30, cable_press: 4, cable_row: 9, calf_raise: 12, cardio: 13, carry: 7, chest_fly: 17, chest_press_machine: 5, core_floor: 35, core_hang: 3, core_standing: 17, curl: 36, delt_raise: 33, dip: 5, foam_roll: 10, forearm: 11, glute_floor: 7, hinge: 32, hip_abd_add: 7, hip_bridge: 10, kb_ballistic: 16, kneeling_hinge: 1, leg_isolation: 12, leg_machine: 8, lunge: 24, mobility_floor: 21, mobility_stand: 30, olympic: 23, overhead_press: 21, plyo: 27, pull_up: 12, pulldown: 8, pushup_plank: 30, rotator_cuff: 7, row: 13, shrug: 8, sled_throw: 9, squat: 25, strongman: 2, thruster: 3, triceps: 29 });
    expect(Object.values(z).reduce((a, b) => a + b, 0)).toBe(636);
    for (const [r, x] of Object.entries(p.rodziny)) expect([r, x.z_regulami + x.otwarte + x.sprzet_poza_kontraktem + x.bez_regul]).toEqual([r, x.cwiczen]);
    expect(Object.values(p.rodziny).reduce((a, x) => a + x.cwiczen, 0)).toBe(709);
  });
  test('87 gotowych figur (squat, bench_press, hinge) ma reguły sensu (runda 2): lista bez reguł jest pusta; naruszenia figur: zapadka naruszeń = 0 (stan 26.10.2026 po r4: 0 z 87; naprawa parametrami figur, nie luzowaniem progów)', () => {
    expect(p.gotowe_figury).toBe(87); expect(p.gotowe_bez_regul).toEqual([]);
    const n = JSON.parse(execFileSync(process.execPath, [path.join(ROOT, 'scripts/figures/sens-gotowe.mjs'), '--json'], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })) as { cwiczenie: string; naruszenia: { regula: string }[] }[];
    expect(n).toHaveLength(87); const z = n.filter((x) => x.naruszenia.length);
    expect(z.map((x) => x.cwiczenie)).toEqual([]); /* zapadka: każde nowe naruszenie gotowej figury łamie test; naprawa parametrami figury, nie progiem */
  });
});
