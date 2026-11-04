/*
 * Figury v2 — oś hantla w dłoni (wydzielone z contract.ts: podział strukturalny, bez zmiany zachowania; backlog 1.1).
 * FW2_AX (progi płynnego przejścia) i withDumbbellAxis (oś z obrotu przedramienia) — używa keyframeFrame w contract.ts.
 * Czysty moduł (bez React i aliasów); plik jest w V2_WSPOLNE (skrót recenzji rodzin v2).
 */
import type { V3 } from './math';
import type { Prop } from './scene';

/** FW2 (S-1): progi płynnego przejścia osi hantla (jedno miejsce). zOd — |składowa z przedramienia|, do której oś poprzeczna zostaje bez zmiany (kąt do przedramienia ≥ 80°: asin 0,15 = 8,6°); powyżej waga osi wyliczonej 1 − zOd/|fz|;
 * gOd/gDo — |rzut przedramienia na xy|/długość, między którymi pion v̂ przechodzi w oś strzałkową n̂ (poniżej gOd przedramię prawie wzdłuż osi z). */
const FW2_AX = { zOd: 0.15, gOd: 0.05, gDo: 0.25 } as const;
const smooth01 = (t: number): number => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };
/** H1 (recenzja curl r3, 03.11.2026): oś hantla z obrotu przedramienia (dane: obrotPrzedramienia ustawione jawnie). 0 = chwyt neutralny („młotkowy”): oś ⟂ do przedramienia w płaszczyźnie strzałkowej
 * (przy zwisie — przód–tył, przy przedramieniu poziomo — pionowo); ±90 = oś w poprzek ciała (podchwyt/nachwyt, jak dotąd); pośrednie — płynnie. |obrót| ≥ 80° i brak wartości: bez zmiany rysunku (oś w poprzek). */
export function withDumbbellAxis(p: Extract<Prop, { k: 'dumbbell' }>, a: { elbow: V3; wrist: V3 }, rot: number | undefined): Prop {
  const f = [a.wrist[0] - a.elbow[0], a.wrist[1] - a.elbow[1], a.wrist[2] - a.elbow[2]]; const fl = Math.hypot(f[0], f[1], f[2]); if (!fl) return p;
  const fu = f.map(x => x / fl);
  /* FW2 (S-1, 04.11.2026): bez progów skokowych. Oś ⟂ do przedramienia zawsze (uchwyt hantla), w poprzek ciała płynnie: bez obrotu albo |obrót| ≥ 80 oś zostaje poprzeczna (z) dopóki przedramię jest blisko płaszczyzny strzałkowej
   * (|fz| ≤ FW2_AX.zOd — kąt do osi z ≥ 80°, rysunek bez zmiany), a potem przechodzi w wyliczoną oś ⟂ wagą 1 − zOd/|fz| (cos kąta do przedramienia ≤ zOd; ciągła; FW1 H-B przełączał ją progiem |fz| > 0,5 = skok 30°). */
  const lam = Math.abs(fu[2]) > FW2_AX.zOd ? 1 - FW2_AX.zOd / Math.abs(fu[2]) : 0;
  /* ten sam obrót ±80…90° (FW1: skok 10° przy |obrót| = 80, formuła dawała tam 10° od poprzecznej): obrót efektywny płynnie z 80° do 90° (= oś poprzeczna), t = 0 poniżej 80°, 1 od 90° (i bez wartości) */
  const aRot = Math.min(90, Math.abs(rot ?? 90)); const t = smooth01((aRot - 80) / 10);
  if (lam === 0 && t === 1) return p;
  /* FW1 (H-A, 04.11.2026): wektor b = fu × nn zmienia zwrot dla lewej ręki (pseudowektor przy lustrze z), więc ten sam obrót daje oś nie-lustrzaną; lewa ręka dostaje obrót ze znakiem odwróconym → oś L = lustro osi R */
  const r = (aRot < 80 ? aRot : 80 + 10 * t) * (rot !== undefined && rot < 0 ? -1 : 1) * (p.side === 'L' ? -1 : 1);
  /* nn: wersor ⟂ do przedramienia w płaszczyźnie strzałkowej (n̂); przedramię prawie w poprzek ciała (g = |rzut na xy| / długość → 0) nie ma płaszczyzny strzałkowej — „pion” rzutowany na płaszczyznę ⟂ do przedramienia (v̂, gryf pionowo).
   * FW2 (S-1): n̂ → v̂ płynnie wagą z g (FW1: próg g = 0,2, skok 63°); znak v̂ zgodny z n̂ (oś jest prostą, znak bez znaczenia), więc suma nie zeruje się. */
  const g = Math.hypot(f[0], f[1]) / fl;
  const n = [f[1], -f[0], 0]; const nl = Math.hypot(n[0], n[1]);
  const v = [-fu[0] * fu[1], 1 - fu[1] * fu[1], -fu[2] * fu[1]]; const vl = Math.hypot(v[0], v[1], v[2]);
  const vh = vl > 1e-9 ? v.map(x => x / vl) : [0, 1, 0];
  const nh = nl > 1e-9 ? [n[0] / nl, n[1] / nl, 0] : vh;
  const wn = smooth01((g - FW2_AX.gOd) / (FW2_AX.gDo - FW2_AX.gOd)); const sg = nh[0] * vh[0] + nh[1] * vh[1] + nh[2] * vh[2] < 0 ? -1 : 1;
  const mix = [0, 1, 2].map(i => wn * nh[i] + (1 - wn) * sg * vh[i]); const ml = Math.hypot(mix[0], mix[1], mix[2]); const nn = wn >= 1 ? nh : ml > 1e-9 ? mix.map(x => x / ml) : vh; /* wn = 1: n̂ bez zmiany (bit w bit jak dotąd) */
  const b = [fu[1] * nn[2] - fu[2] * nn[1], fu[2] * nn[0] - fu[0] * nn[2], fu[0] * nn[1] - fu[1] * nn[0]];
  const c = Math.cos(r * Math.PI / 180), s = Math.sin(r * Math.PI / 180); const ax = [0, 1, 2].map(i => c * nn[i] + s * b[i]); const al = Math.hypot(ax[0], ax[1], ax[2]);
  const w = 1 - (1 - lam) * t; /* waga osi wyliczonej wobec poprzecznej z (znak b dobrany do z: oś jest prostą) */
  if (w >= 1) return { ...p, axis: ax.map(x => x / al) as V3 };
  const sz = ax[2] < 0 ? -1 : 1; const m = [ (1 - w) * 0 + w * sz * ax[0] / al, w * sz * ax[1] / al, (1 - w) + w * sz * ax[2] / al ]; const mm = Math.hypot(m[0], m[1], m[2]);
  return { ...p, axis: m.map(x => x / mm) as V3 };
}
