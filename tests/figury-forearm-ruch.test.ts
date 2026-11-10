/*
 * forearm (10.11.2026, partia 5, samokontrola ruchu K4–K8): regresja wady z arkusza śladu — w „Behind-the-Back Barbell Wrist Curl” sztanga za plecami wchodziła w udo pod koniec zgięcia nadgarstka
 * (odstęp −0,9 cm przy ramieniu odchylonym o 22°); poprawka w generatorze: ramię odchylone w tył o 28°. Dla całej rodziny: ciężar nie przenika nóg ani tułowia powyżej progu PROG_STYKU,
 * a zakres nadgarstka (zgięcie ≥ 50° między skrajnymi klatkami, reguła nadgarstek_zakres) jest zachowany.
 */
import { stykTora, podsumujStyk, PROG_STYKU } from './helpers/styk-figur';
import { figureSpec, frameAt, measuredAngle, poseKeys, type FigureSpec } from '@/lib/figures/v2';

const UGINANIA = poseKeys('forearm').filter(k => /Wrist Curl/.test(k));
describe('forearm: styk ciężaru i zakres nadgarstka', () => {
  test('jest 8 uginań nadgarstków z rysunkiem', () => { expect(UGINANIA).toHaveLength(8); });
  test.each(UGINANIA)('%s: ciężar nie przenika ciała (≤ PROG_STYKU.przenikanieCm), zakres nadgarstka ≥ 50°', k => {
    expect(podsumujStyk(stykTora(k)).maxPrzenikanie).toBeLessThanOrEqual(PROG_STYKU.przenikanieCm);
    const s = figureSpec(k) as FigureSpec; const a = Array.from({ length: 21 }, (_, i) => measuredAngle(s, i / 20).deg);
    expect(Math.max(...a) - Math.min(...a)).toBeGreaterThanOrEqual(50);
  });
  test('Behind-the-Back Barbell Wrist Curl: odstęp sztangi od nóg przez cały ruch ≥ 1 cm (przed poprawką −0,9 cm)', () => {
    expect(podsumujStyk(stykTora('Behind-the-Back Barbell Wrist Curl')).minOdstep).toBeGreaterThanOrEqual(1);
  });
  /* recenzja r1 (audytor, 10.11.2026), W1: dłoń zwrócona do ciała, a zgięcie nadgarstka przesuwało sztangę 8,9 cm ku ciału (x −21,3 → −12,4) i tylko 1,7 cm w górę. Źródła: nachwyt stojąc tyłem
   do sztangi (dłonie do tyłu), zgięcie nadgarstka unosi sztangę w górę i lekko do tyłu (wyniki-uzup-1a.json). Przód = +x. */
  describe('Behind-the-Back Barbell Wrist Curl: kierunek ruchu (10.11.2026, W1)', () => {
    const k = 'Behind-the-Back Barbell Wrist Curl';
    const fr = (u: number) => frameAt(figureSpec(k) as FigureSpec, u);
    test('dłoń zwrócona do tyłu (dot(palm, przód) < 0) w każdym kadrze', () => {
      for (const u of [0, 0.25, 0.5, 0.75, 1]) for (const s of ['R', 'L'] as const) {
        const a = fr(u).sk.arms[s]; expect(a.palm[0]).toBeLessThan(0);
      }
    });
    test('zgięcie nadgarstka unosi sztangę w górę i lekko do tyłu: chwyt.x(1) < chwyt.x(0), chwyt.y(1) > chwyt.y(0)', () => {
      const g0 = fr(0).sk.arms.R.grip, g1 = fr(1).sk.arms.R.grip;
      expect(g1[0]).toBeLessThan(g0[0]); expect(g1[1] - g0[1]).toBeGreaterThan(1);
    });
    test('odstęp sztangi od ud i pośladków ≥ 1 cm w każdym kadrze (u = 0 … 1 co 0,05)', () => {
      expect(podsumujStyk(stykTora(k)).minOdstep).toBeGreaterThanOrEqual(1);
    });
  });
  /* recenzja r1 (10.11.2026), S2: zestaw wr.range mówi „tak nisko, jak pozwala nadgarstek”, a dół ruchu było −32° / +40° przy limicie silnika −65° / +75° (połowa zakresu stawu). */
  describe('7 uginań siedząc: dolne położenie bliżej limitu nadgarstka (10.11.2026, S2)', () => {
    const SIEDZ = UGINANIA.filter(k => !/Behind/.test(k));
    test('jest 7 uginań siedząc', () => { expect(SIEDZ).toHaveLength(7); });
    test.each(SIEDZ)('%s: kąt w dolnym położeniu (u = 0) ≥ 44° (było 32° / 40°; wyżej dłoń z hantlem wchodzi w udo) i ≤ limit silnika 65°', k => {
      const d = measuredAngle(figureSpec(k) as FigureSpec, 0).deg;
      expect(Math.abs(d)).toBeGreaterThanOrEqual(44); expect(Math.abs(d)).toBeLessThanOrEqual(65);
    });
  });
  /* recenzja r2 (10.11.2026), W2: po poprawce W1 kąt łokcia spadał z 24,3° do 0° (ramię 29° → 17° od pionu), łokieć jechał 6,6 cm (4,4 cm w ostatniej ćwiartce), a w u = 1 dłoń mijała sztangę o 0,39 cm.
     Źródło: ręce proste, barki nieruchome, ruch tylko w nadgarstkach. */
  describe('Behind-the-Back Barbell Wrist Curl: ramię nieruchome (10.11.2026, W2)', () => {
    const k = 'Behind-the-Back Barbell Wrist Curl';
    const odj = (a: number[], b: number[]) => a.map((x, i) => x - b[i]); const dl = (a: number[]) => Math.hypot(...a);
    const klatki = Array.from({ length: 21 }, (_, i) => { const a = frameAt(figureSpec(k) as FigureSpec, i / 20).sk.arms.R;
      const g = odj(a.shoulder, a.elbow), d = odj(a.wrist, a.elbow);
      return { lok: a.elbow as number[], flex: 180 - Math.acos((g[0] * d[0] + g[1] * d[1] + g[2] * d[2]) / (dl(g) * dl(d))) * 180 / Math.PI, err: a.err as number }; });
    test('kąt zgięcia łokcia zmienia się o ≤ 5° w całym ruchu', () => { const f = klatki.map(x => x.flex); expect(Math.max(...f) - Math.min(...f)).toBeLessThanOrEqual(5); });
    test('łokieć przesuwa się o ≤ 2 cm względem pierwszej klatki', () => { expect(Math.max(...klatki.map(x => dl(odj(x.lok, klatki[0].lok))))).toBeLessThanOrEqual(2); });
    test('błąd chwytu ≤ 0,1 cm w każdej klatce', () => { expect(Math.max(...klatki.map(x => x.err))).toBeLessThanOrEqual(0.1); });
    test('zakres nadgarstka nadal ≥ 50°', () => { const a = Array.from({ length: 21 }, (_, i) => measuredAngle(figureSpec(k) as FigureSpec, i / 20).deg); expect(Math.max(...a) - Math.min(...a)).toBeGreaterThanOrEqual(50); });
  });
});
