/*
 * Figury v2 — silnik: tryb dzwonu kettlebell „gora” (dnem do góry), potrzebny do Bottoms-Up Clean (recenzja ruchu 1.1, partia p4a, 27.10.2026).
 * Zmiana jest zgodna wstecz: inne tryby dzwonu bez zmian, odciski wszystkich gotowych figur sprawdza tests/figures-v2-zgodnosc-wsteczna.test.ts.
 */
import { propsFrom, BELL_MODES, type V3, type Prop } from '@/lib/figures/v2';

describe('silnik: tryb dzwonu „gora” (kettlebell dnem do góry)', () => {
  const G = { R: [12, 100, 5] as V3, L: [12, 100, -5] as V3 };
  test('gora: dzwon nad rączką (kierunek +y), inne tryby bez zmian', () => {
    expect(BELL_MODES).toEqual(['dol', 'wzdluz', 'tyl', 'gora']);
    const kb = (dzwon?: 'dol' | 'wzdluz' | 'tyl' | 'gora') => propsFrom([{ rodzaj: 'kettlebell', trzyma: 'R', ...(dzwon ? { dzwon } : {}) }], G)[0] as Extract<Prop, { k: 'kettlebell' }>;
    expect(kb('gora').dir).toEqual([0, 1, 0]);
    expect([kb().bell, kb().dir]).toEqual(['down', undefined]);
    expect([kb('wzdluz').bell, kb('wzdluz').dir]).toEqual(['along', undefined]);
    expect(kb('tyl').dir?.[0]).toBeLessThan(-0.9);
  });
});

