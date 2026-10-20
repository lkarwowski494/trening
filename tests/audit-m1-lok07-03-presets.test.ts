/*
 * M2-LOK07-03: preset sprzętu w systemie imperialnym wstawia ciężary w lb (przeliczone przez convertSpec), w metrycznym bez zmian (jednostka producenta);
 * etykieta presetu zostaje w jednostce producenta (nazwa produktu, np. „2×10 kg”, „5–200 lb”) — wyjątek opisany w docs/16 (tabela LOK-07).
 */
import { LOAD_PRESETS, applyLoadPreset } from '@/lib/equipment';
import { applyUnit } from '@/lib/units';
import { specValues } from '@/lib/loads';

afterEach(() => applyUnit('kg'));
const entry = () => ({ opts: ['dual'] as string[], load: undefined as never });
describe('presety sprzętu × system miar', () => {
  test.each(LOAD_PRESETS.map(p => [p.id, p] as const))('%s: imperialny → spec w lb; metryczny → spec producenta; etykieta bez zmian', (_id, p) => {
    const label = JSON.stringify(p.label);
    applyUnit('lb'); const e1: any = entry(); applyLoadPreset(e1, p); expect(e1.load.unit).toBe('lb');
    applyUnit('kg'); const e2: any = entry(); applyLoadPreset(e2, p); expect(e2.load.unit).toBe(p.spec().unit);
    expect(JSON.stringify(p.label)).toBe(label);
  });
  test('hantle stałe 2,5–24 kg w imperialnym: 2,5 kg = 5,5 lb, 24 kg = 52,9 lb; etykieta nadal „2,5–24 kg”', () => {
    const p = LOAD_PRESETS.find(x => x.id === 'gymtek24')!; applyUnit('lb'); const e: any = entry(); applyLoadPreset(e, p);
    const v = specValues(e.load, 2); expect([v[0], v[v.length - 1]]).toEqual([5.5, 52.9]); expect(p.label.pl).toContain('kg'); expect(p.label.en).toContain('kg');
  });
});
