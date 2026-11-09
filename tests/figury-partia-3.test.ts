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
});
