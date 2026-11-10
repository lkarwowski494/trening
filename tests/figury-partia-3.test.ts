/*
 * (wdrożenie 09.11.2026) Partia 3 rodzin figur v2 linii 1.1 (pulldown, shrug, hip_abd_add; docs/18 09.11.2026) — decyzje techniczne pilnowane testem:
 * (D2, koordynator 09.11.2026, wariant A) nazwa fazy „Ściąganie” po angielsku to „Pulling” (bez kierunku: ściąganie łopatek, drążka w dół, przywodzenie nogi), nie „Pulling back”;
 * (shrug r2, 09.11.2026) szrugsy bez bramki ruchu ≥ 8 cm (bez_bramki_ruchu, analogia do decyzji 26.10.2026) i z regułą „ręce proste” — chwyt podąża za barkiem, łokcie stałe;
 * (hip_abd_add, 09.11.2026) Lateral Band Walk i Monster Walk bez rysunku do poprawki marszu (recenzja H-1/H-2 WYSOKIE), kąt ukryty w całej rodzinie (silnik nie ma stawu odwiedzenia biodra).
 */
import * as fs from 'fs';
import * as path from 'path';
import { EN } from '@/lib/i18n.en';
import { figureSpec, frameAt } from '@/lib/figures/v2';
import { jointAngles } from '@/lib/figures/v2/skeleton';
import { DATA_UI } from '@/lib/figures/v2/poseData';
import { TECHNIQUE } from '@/lib/figures/v2/overlay';
import { PULLDOWN_TECHNIQUE, PULLDOWN_STRAIGHT_ARM_EXERCISES } from '@/lib/figures/v2/overlay/pulldown';
import { SHRUG_TECHNIQUE } from '@/lib/figures/v2/overlay/shrug';
import { HIP_ABD_ADD_TECHNIQUE } from '@/lib/figures/v2/overlay/hip_abd_add';
import { LEG_MACHINE_TECHNIQUE } from '@/lib/figures/v2/overlay/leg_machine';

const root = path.join(__dirname, '..');
const sens = JSON.parse(fs.readFileSync(path.join(root, 'data/zrodla/figury-sens.json'), 'utf8'));
const SHRUGS = ['Shrugs (sztanga)', 'Shrugs (hantle)', 'Shrugs (linki)', 'Barbell Shrug Behind The Back', 'Smith Machine Behind the Back Shrug', 'Leverage Shrug', 'Calf-Machine Shoulder Shrug'];

describe('partia 3 (09.11.2026)', () => {
  test('D2: EN fazy „Ściąganie” = „Pulling”', () => { expect(EN['Ściąganie']).toBe('Pulling'); });
  test('shrug r2: 7 szrugsów w bez_bramki_ruchu, reguła rece_proste w wariancie _szrugs; łokcie ≤ 15° i stałe (±1°) w całym ruchu', () => {
    for (const k of SHRUGS) expect([k, typeof sens.bez_bramki_ruchu[k]]).toEqual([k, 'string']);
    expect(sens.rodziny.shrug.warianty._szrugs).toContain('rece_proste');
    for (const k of SHRUGS) {
      const s = figureSpec(k)!; const e = [0, 0.25, 0.5, 0.75, 1].map(u => jointAngles(frameAt(s, u).sk, 'R').elbow);
      expect([k, Math.max(...e) <= 15, Math.max(...e) - Math.min(...e) <= 1]).toEqual([k, true, true]);
    }
  });
  test('hip_abd_add: marsze z gumą bez rysunku (do poprawki), pozostałe 4 z rysunkiem; kąt ukryty we wszystkich', () => {
    for (const k of ['Lateral Band Walk', 'Monster Walk']) expect([k, figureSpec(k)]).toEqual([k, null]);
    for (const k of ['Hip Abduction', 'Hip Adduction', 'Cable Hip Abduction', 'Cable Hip Adduction']) { expect([k, !!figureSpec(k)]).toEqual([k, true]); expect([k, DATA_UI.hip_abd_add.exceptions?.[k]?.hideAngle]).toEqual([k, true]); }
  });
  test('nakładki partii 3 w rejestrze TECHNIQUE: elementy w stałej kolejności, tylko reguły „ustalone” (recenzje niezależne 09.11.2026)', () => {
    expect(TECHNIQUE.pulldown).toBe(PULLDOWN_TECHNIQUE); expect(PULLDOWN_TECHNIQUE.map(d => [d.id, d.kind, d.rule, d.views])).toEqual([['pulldownElbowLimb', 'limb', 'wyprost_u_gory', ['side']], ['pulldownChestRef', 'ref', 'do_gornej_klatki', ['side']], ['pulldownStraightArmSweep', 'abduction', 'ramie_w_dol', ['side']]]);
    expect(PULLDOWN_STRAIGHT_ARM_EXERCISES).toEqual(['Straight Arm Pulldown']);
    expect(TECHNIQUE.shrug).toBe(SHRUG_TECHNIQUE); expect(SHRUG_TECHNIQUE.map(d => [d.id, d.kind, d.rule, d.views])).toEqual([['shrugShoulderUpRef', 'ref', 'barki_w_gore', ['front']]]);
    expect(TECHNIQUE.hip_abd_add).toBe(HIP_ABD_ADD_TECHNIQUE); expect(HIP_ABD_ADD_TECHNIQUE.map(d => [d.id, d.kind, d.rule, d.views])).toEqual([['hipAbdTorsoPlumb', 'ref', 'tulow_stoi', ['front']]]);
    expect(TECHNIQUE.leg_machine).toBe(LEG_MACHINE_TECHNIQUE); expect(LEG_MACHINE_TECHNIQUE.map(d => [d.id, d.kind, d.rule, d.views])).toEqual([['legMachineKneeLimb', 'limb', 'zakres', ['side']]]);
    for (const [fam, defs] of [['pulldown', PULLDOWN_TECHNIQUE], ['shrug', SHRUG_TECHNIQUE], ['hip_abd_add', HIP_ABD_ADD_TECHNIQUE], ['leg_machine', LEG_MACHINE_TECHNIQUE]] as const) for (const d of defs) {
      expect([fam, d.id, sens.rodziny[fam].reguly[d.rule].pewnosc]).toEqual([fam, d.id, expect.stringMatching(/^ustalone/)]);
      for (const c of d.cue) expect([fam, d.id, c, sens.rodziny[fam].wskazowki_na_reguly[c]]).toEqual([fam, d.id, c, expect.arrayContaining([d.rule])]);
    }
  });
});
