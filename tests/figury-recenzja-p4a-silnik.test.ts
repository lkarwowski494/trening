/*
 * Figury v2 — silnik: tryb dzwonu kettlebell „gora” (dnem do góry), potrzebny do Bottoms-Up Clean (recenzja ruchu 1.1, partia p4a, 27.10.2026).
 * Zmiana jest zgodna wstecz: inne tryby dzwonu bez zmian, odciski wszystkich gotowych figur sprawdza tests/figures-v2-zgodnosc-wsteczna.test.ts.
 */
import { propsFrom, BELL_MODES, keyframeFrame, CONTRACT, type V3, type Prop, type PoseData, type KeyFrame, type Frame } from '@/lib/figures/v2';

describe('silnik: tryb dzwonu „gora” (kettlebell dnem do góry)', () => {
  const G = { R: [12, 100, 5] as V3, L: [12, 100, -5] as V3 };
  test('gora: dzwon nad rączką (kierunek +y), inne tryby bez zmian', () => {
    expect(BELL_MODES).toEqual(['dol', 'wzdluz', 'tyl', 'gora', 'wzdluz_gora']);
    const kb = (dzwon?: 'dol' | 'wzdluz' | 'tyl' | 'gora' | 'wzdluz_gora') => propsFrom([{ rodzaj: 'kettlebell', trzyma: 'R', ...(dzwon ? { dzwon } : {}) }], G)[0] as Extract<Prop, { k: 'kettlebell' }>;
    expect(kb('gora').dir).toEqual([0, 1, 0]);
    expect([kb().bell, kb().dir]).toEqual(['down', undefined]);
    expect([kb('wzdluz').bell, kb('wzdluz').dir]).toEqual(['along', undefined]);
    expect(kb('tyl').dir?.[0]).toBeLessThan(-0.9);
  });
});


/* Recenzja p4a, runda 2 (27.10.2026), Bottoms-Up Clean: tryb „gora” stały w całym ruchu dawał kettlebell dnem do góry na prostej ręce w zwisie (fizycznie niemożliwe). */
describe('silnik: tryb dzwonu „wzdluz_gora” zależy od fazy (zwis: dzwon wzdłuż przedramienia, przedramię pionowo: dnem do góry)', () => {
  const kf = (u: number, gr: V3, gl: V3): KeyFrame => ({ u, miednica: [0, 88.5, 0], pochylenieTulowia: 0, pochylenieGlowy: 0, nogi: { R: { kostka: [0, 7, 9] }, L: { kostka: [0, 7, -9] } }, rece: { R: { chwyt: gr }, L: { chwyt: gl } } });
  const frameAt = (g: V3, dzwon: 'wzdluz' | 'wzdluz_gora' | 'gora'): Frame => {
    const d: PoseData = { kontrakt: CONTRACT.id, rodzina: 'squat', cwiczenie: 'x', sprzet: [{ rodzaj: 'podloga', x0: -120, x1: 120 }, { rodzaj: 'kettlebell', trzyma: 'R', dzwon }], klatki: [kf(0, g, [g[0], g[1], -g[2]]), kf(1, g, [g[0], g[1], -g[2]])], bledy: [] };
    return keyframeFrame(d, 0);
  };
  const dirOf = (f: Frame): V3 => (f.props.find((p) => p.k === 'kettlebell') as Extract<Prop, { k: 'kettlebell' }>).dir as V3;
  const fore = (f: Frame): V3 => { const a = f.sk.arms.R; const v = [a.grip[0] - a.elbow[0], a.grip[1] - a.elbow[1], a.grip[2] - a.elbow[2]]; const n = Math.hypot(...v); return [v[0] / n, v[1] / n, v[2] / n]; };
  test('zwis: dzwon w dół (nie nad rączką); przedramię w przód: dzwon w przód; przedramię pionowo: dnem do góry', () => {
    expect(dirOf(frameAt([18, 82, 3], 'wzdluz_gora'))[1]).toBeLessThan(-0.5);
    dirOf(frameAt([50, 128, 3], 'wzdluz_gora')).forEach((c, i) => expect(c).toBeCloseTo(dirOf(frameAt([50, 128, 3], 'wzdluz'))[i], 9)); /* poza zakresem 45° od pionu dokładnie jak „wzdluz” */
    dirOf(frameAt([18, 82, 3], 'wzdluz_gora')).forEach((c, i) => expect(c).toBeCloseTo(dirOf(frameAt([18, 82, 3], 'wzdluz'))[i], 9));
    expect(dirOf(frameAt([20, 150, 4], 'wzdluz_gora'))[1]).toBeGreaterThan(0.9);
  });
  test('dzwon „do góry” (kierunek y > 0,7) tylko przy przedramieniu ≤ 45° od pionu; wersor jednostkowy; obrót ciągły (krok o 1 cm chwytu nie większy niż w trybie „wzdluz”)', () => {
    let poprzedni: V3 | undefined; let maks = 0, maksWzdluz = 0, poprzedniWz: V3 | undefined;
    for (let y = 80; y <= 152; y += 1) {
      const f = frameAt([20, y, 4], 'wzdluz_gora'); const d = dirOf(f); expect(Math.hypot(...d)).toBeCloseTo(1, 6);
      if (d[1] > 0.7) expect(fore(f)[1]).toBeGreaterThanOrEqual(Math.SQRT1_2 - 1e-9);
      const w = dirOf(frameAt([20, y, 4], 'wzdluz'));
      if (poprzedni && poprzedniWz) { maks = Math.max(maks, Math.hypot(d[0] - poprzedni[0], d[1] - poprzedni[1], d[2] - poprzedni[2])); maksWzdluz = Math.max(maksWzdluz, Math.hypot(w[0] - poprzedniWz[0], w[1] - poprzedniWz[1], w[2] - poprzedniWz[2])); }
      poprzedni = d; poprzedniWz = w;
    }
    expect(maks).toBeLessThanOrEqual(maksWzdluz + 0.05); /* obrót dnem do góry nie dokłada skoku ponad ten, który wnosi ruch przedramienia w trybie „wzdluz” */
  });
  test('stały tryb „gora” nie zależy od fazy (kierunek +y także w zwisie), „wzdluz” bez zmian (przedramię pionowo: za przedramieniem)', () => {
    expect(dirOf(frameAt([18, 82, 3], 'gora'))[1]).toBe(1);
    expect(dirOf(frameAt([20, 150, 4], 'wzdluz'))[1]).toBeLessThan(0);
  });
});
