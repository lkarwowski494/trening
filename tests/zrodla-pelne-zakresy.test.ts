/*
 * Zakresy stawów poza@2 (26.10.2026, badacz): pełne dane ze źródłami — data/zrodla/figury-zakresy-poza2.json (poza paczką aplikacji); EXT_ROM w kodzie ma te same granice
 * i nie niesie nazw źródeł. Rodzaje (docs/20): dane (zgodność min/max, status ↔ liczba źródeł), niezmienniki (znak nadgarstka, granice nie przekraczają średnich z badań),
 * paczka (brak nazw źródeł w kodzie zakresów).
 */
import * as fs from 'fs';
import * as path from 'path';
import { EXT_ROM } from '@/lib/figures/v2/skeleton';
import { SOURCE_NAME_PATTERNS } from '@/lib/sources';

const root = path.join(__dirname, '..');
type Z = { min: number; max: number; jednostka?: string; status: string; zrodla: string[] };
const full = JSON.parse(fs.readFileSync(path.join(root, 'data/zrodla/figury-zakresy-poza2.json'), 'utf8')) as { zakresy: Record<string, Z>; zrodla: Record<string, { cite: string; url: string; miejsce: string }> };

describe('zakresy poza@2: EXT_ROM = pełne dane', () => {
  test('każde pole EXT_ROM ma wpis z tym samym min i max, i każdy wpis ma pole', () => {
    expect(Object.keys(full.zakresy).sort()).toEqual(Object.keys(EXT_ROM).sort());
    for (const [k, r] of Object.entries(EXT_ROM)) expect([k, full.zakresy[k].min, full.zakresy[k].max]).toEqual([k, r.min, r.max]);
  });
  test('decyzja badacza 26.10.2026: skręt tułowia ±40°, nadgarstek −65…75° (ujemny = wyprost, dodatni = zgięcie); pozostałe zakresy bez zmian', () => {
    expect(EXT_ROM.twist).toEqual({ min: -40, max: 40 }); expect(EXT_ROM.wrist).toEqual({ min: -65, max: 75 });
    expect(EXT_ROM.wrist.min).toBeLessThan(0); expect(-EXT_ROM.wrist.min).toBeLessThan(EXT_ROM.wrist.max); /* wyprost < zgięcie, jak w normach (≈66° / ≈74°) */
    expect(EXT_ROM.lean).toEqual({ min: -35, max: 35 }); expect(EXT_ROM.tilt).toEqual({ min: -15, max: 15 }); expect(EXT_ROM.headTilt).toEqual({ min: -35, max: 35 });
    expect(EXT_ROM.shrug).toEqual({ min: -3, max: 6 }); expect(EXT_ROM.protract).toEqual({ min: -4, max: 6 }); expect(EXT_ROM.forearm).toEqual({ min: -80, max: 80 });
  });
  test('status zgodny z liczbą źródeł: dwa_zrodla ≥ 2, jedno_zrodlo = 1, uproszczenie = 0; źródła istnieją i mają adres', () => {
    for (const [k, z] of Object.entries(full.zakresy)) {
      const n = z.zrodla.length; const ok = z.status === 'dwa_zrodla' ? n >= 2 : z.status === 'jedno_zrodlo' ? n === 1 : n === 0;
      expect([k, z.status, ok]).toEqual([k, z.status, true]);
      for (const s of z.zrodla) expect([k, s, /^https:\/\//.test(full.zrodla[s]?.url ?? '')]).toEqual([k, s, true]);
    }
  });
  test('granice w stopniach nie przekraczają średnich z przeczytanych badań (nadgarstek: zgięcie ≤ 74°, wyprost ≤ 66° zaokrąglone do 5°; rotacja ≤ 40°)', () => {
    expect(EXT_ROM.wrist.max).toBeLessThanOrEqual(75); expect(-EXT_ROM.wrist.min).toBeLessThanOrEqual(65 + 1); expect(EXT_ROM.twist.max).toBeLessThanOrEqual(40);
  });
  test('kod zakresów (skeleton.ts) nie zawiera nazw źródeł', () => {
    const src = fs.readFileSync(path.join(root, 'lib/figures/v2/skeleton.ts'), 'utf8');
    expect(new RegExp(SOURCE_NAME_PATTERNS.join('|'), 'u').test(src)).toBe(false);
  });
});
