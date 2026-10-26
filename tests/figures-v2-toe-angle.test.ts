/*
 * Audyt 1.0, C-3: opis pod figurą przysiadu („Palce stóp lekko na zewnątrz — zwykle mniej więcej 15–20°.”) musi zgadzać się z rysunkiem.
 * Dla każdego ćwiczenia, przy którym opis się pokazuje (toeAngleApplies), rig ma palce na zewnątrz w przedziale z opisu (część wspólna dwóch
 * źródeł, data/zrodla/katy-oddech.json); wyjątki (szeroki rozstaw, sumo, ściana) opisu nie mają — pilnuje tego sam toeAngleApplies.
 */
import { VARIANTS } from '@/lib/figures/v2/variants';
import { figureSpec } from '@/lib/figures/v2/figure';
import { toeAngleApplies, TOE_ANGLE_EXCLUDED_LOADS } from '@/lib/figures/v2/ui';

const TOE_MIN = 15, TOE_MAX = 20;
const squatKeys = Object.keys(VARIANTS).filter(k => VARIANTS[k].family === 'squat');

describe('figury v2: kąt palców w przysiadzie a opis pod rysunkiem', () => {
  it('są ćwiczenia z opisem i bez opisu (test nie jest pusty)', () => {
    const z = squatKeys.filter(k => toeAngleApplies(figureSpec(k)!));
    expect(z.length).toBeGreaterThan(10); expect(z.length).toBeLessThan(squatKeys.length);
  });
  it.each(squatKeys)('%s: gdy opis się pokazuje, rig ma palce w 15–20°', (k) => {
    const spec = figureSpec(k)!; const v = spec.variant;
    if (v.family !== 'squat' || !toeAngleApplies(spec)) return;
    expect(v.p.toeOut).toBeGreaterThanOrEqual(TOE_MIN); expect(v.p.toeOut).toBeLessThanOrEqual(TOE_MAX);
  });
  it('Dumbbell Squat (hantle po bokach): rig ma palce 8° (hantle nie przenikają ud), więc opisu 15–20° pod rysunkiem nie ma — rysunek i tekst się nie rozjeżdżają', () => {
    const spec = figureSpec('Dumbbell Squat')!; const v = spec.variant; expect(v.family).toBe('squat');
    if (v.family === 'squat') { expect(v.p.toeOut).toBeLessThan(TOE_MIN); expect(toeAngleApplies(spec)).toBe(false); }
  });
  it('wyjątek jest jeden i dotyczy tylko hantli po bokach', () => {
    expect(TOE_ANGLE_EXCLUDED_LOADS).toEqual(['dbSides']);
    expect(squatKeys.filter(k => !toeAngleApplies(figureSpec(k)!) && (VARIANTS[k] as { p: { load: string } }).p.load === 'dbSides')).toEqual(['Dumbbell Squat']);
  });
});
