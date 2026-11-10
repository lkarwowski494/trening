/*
 * Figury v2 mobility_stand — poprawki po recenzji niezależnej r1 (10.11.2026, audytor; W1). Progi z karty, nie z danych (K5):
 * - W1: Standing Soleus And Achilles Stretch — karta (wallCalfSet): „Oprzyj dłonie o ścianę i cofnij jedną nogę”: w props jest ściana (x ≈ 75, jak w Wall Calf Stretch),
 *   a w każdej klatce dłonie i przedramiona stykają się ze ścianą (odstęp kapsuły od powierzchni ściany ≤ 1 cm, wcięcie ≤ 1,5 cm jak w opisie sprzętu). Tylne kolano zostaje „lekko” ugięte (10–30°).
 * Przypadek negatywny: dane sprzed poprawki (brak ściany w props, dłonie na biodrach: chwyt x ≈ −9 cm) oblewają ten test.
 */
import { figureSpec, frameAt, bodyColliders, type FigureSpec } from '@/lib/figures/v2';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const KEY = 'Standing Soleus And Achilles Stretch';

describe('mobility_stand r1 — W1: Soleus, dłonie na ścianie', () => {
  const sciana = (k: string) => (frameAt(spec(k), 0) as unknown as { props: { k: string; x?: number }[] }).props.find(p => p.k === 'wall');
  test('props zawiera ścianę przed ćwiczącym (x ≈ 75, jak Wall Calf Stretch)', () => {
    expect(sciana(KEY)).toBeDefined();
    expect(sciana(KEY)!.x).toBe(sciana('Wall Calf Stretch')!.x);
  });
  test.each(['R', 'L'] as const)('ręka %s: dłoń i przedramię w każdej klatce ≤ 1 cm od ściany', (s) => {
    const x = sciana('Wall Calf Stretch')!.x as number;
    for (const u of US) {
      const fr = frameAt(spec(KEY), u);
      const c = bodyColliders(fr.sk).find(k => k.id === 'farm' + s) as unknown as { a: number[]; b: number[]; r: number };
      const odstep = x - Math.max(c.a[0], c.b[0]) - c.r; /* kapsuła przedramię–dłoń (chwyt = koniec kapsuły) wobec powierzchni ściany */
      expect([u, Math.max(c.a[0], c.b[0]) === fr.sk.arms[s].grip[0]]).toEqual([u, true]);
      expect([u, odstep <= 1 && odstep >= -1.5]).toEqual([u, true]);
    }
  });
  test('tylne kolano nadal lekko ugięte (10–30°)', () => {
    for (const u of US) {
      const L = frameAt(spec(KEY), u).sk.legs.L; const th = L.knee.map((v: number, i: number) => v - L.hip[i]); const sh = L.ankle.map((v: number, i: number) => v - L.knee[i]);
      const dot = th[0] * sh[0] + th[1] * sh[1] + th[2] * sh[2]; const ang = Math.acos(dot / (Math.hypot(th[0], th[1], th[2]) * Math.hypot(sh[0], sh[1], sh[2]))) * 180 / Math.PI;
      expect([u, ang >= 10 && ang <= 30]).toEqual([u, true]);
    }
  });
});
