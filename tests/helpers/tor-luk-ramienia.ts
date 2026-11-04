// Próg odchylenia toru łukowego ramienia (delt_raise, K1-przygotowanie 04.11.2026): z geometrii pozy, nie z oka. Używają: tests/figures-v2-tor.test.ts i tests/figures-v2-delt-raise-p2.test.ts.
import { keyframeFrame, proj, type PoseData, type View } from '@/lib/figures/v2';

/** Najmniejszy próg odchylenia (cm) — tor prostoliniowy (gryf, hantle w ruchach liniowych). */
export const PROG_ODCHYLENIA_PROSTY = 4;
/** Dryf łokcia (stale lekko zgięty) i tułowia w śladzie chwytu, cm. */
export const DRYF_RAMIE = 2;
/**
 * Próg = odchylenie IDEALNEGO łuku od cięciwy w RZUCIE NA PŁASZCZYZNĘ WIDOKU + dryf (r3-Ś1, 04.11.2026). Idealny łuk: ręka prosta, chwyt na kuli o promieniu r = |bark → chwyt| w u = 1, od kierunku w u = 0 do kierunku w u = 1 po wielkim kole
 * (obrót w jednej płaszczyźnie); rzutujemy punkty łuku na widok i bierzemy największą odległość od prostej między rzutami końców. W widoku, w którym łuku nie widać (Lateral Raise z boku), próg spada do minimum 4 cm; wcześniej
 * wzór r·(1 − cos(Δθ/2)) w 3D dawał wszystkim widokom ten sam próg (Lateral Raise z boku: pomiar 1,7 cm przy progu 15,1; Y Raise: luz ok. 8 cm). Dla płaszczyzny ruchu równoległej do widoku wynik = r·(1 − cos(Δθ/2)) (Front Raise to Overhead z boku Δθ 155° → 48,6 cm).
 */
export const progLukuRamienia = (d: PoseData, view: View, dodatek = 0): number => {
  const a0 = keyframeFrame(d, 0).sk.arms.R, a1 = keyframeFrame(d, 1).sk.arms.R; const v = (a: typeof a0) => [0, 1, 2].map(i => a.grip[i] - a.shoulder[i]);
  const n3 = (x: number[]) => Math.hypot(x[0], x[1], x[2]); const v0 = v(a0), v1 = v(a1); const r = n3(v1); const e0 = v0.map(x => x / n3(v0)), e1 = v1.map(x => x / r);
  const om = Math.acos(Math.max(-1, Math.min(1, e0[0] * e1[0] + e0[1] * e1[1] + e0[2] * e1[2])));
  const P = (t: number): [number, number] => { const w = om < 1e-6 ? e1 : e0.map((x, i) => (Math.sin((1 - t) * om) * x + Math.sin(t * om) * e1[i]) / Math.sin(om)); const q = proj(w.map(x => x * r) as [number, number, number], view); return [q[0], q[1]]; };
  const A = P(0), B = P(1); const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy);
  const dev = Math.max(...Array.from({ length: 41 }, (_, i) => { const p = P(i / 40); return L < 1e-6 ? Math.hypot(p[0] - A[0], p[1] - A[1]) : Math.abs((p[0] - A[0]) * dy - (p[1] - A[1]) * dx) / L; }));
  return Math.max(PROG_ODCHYLENIA_PROSTY, dev + DRYF_RAMIE + dodatek);
};

/**
 * Dodatek do progu (cm) dla ćwiczeń, których płaszczyzna ruchu ramienia ZMIENIA SIĘ z założenia (generator: płaszczyzna φ liniowo od startu do końca), więc rzut toru nie leży na wielkim kole przez końce:
 * Dumbbell Scaption φ 70° → 52° (płaszczyzna łopatki zbliża się do strzałkowej, widok z przodu: pomiar 16,3 przy progu idealnego łuku 13,5) i Front Incline Dumbbell Raise φ 30° → 0° (ramiona schodzą się z boków
 * do płaszczyzny strzałkowej, widok z przodu: pomiar 9,5 przy progu 4). Lista tylko maleje (tests/figures-v2-delt-raise-p3.test.ts: każdy wpis jest nadal potrzebny).
 */
export const DODATEK_SKRETU: Record<string, number> = { 'Dumbbell Scaption|front': 3, 'Front Incline Dumbbell Raise|front': 8 };
