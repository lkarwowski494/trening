/*
 * Figury v2 — matematyka 3D. Układ świata: x = do przodu (w stronę twarzy), y = w górę, z = prawa strona osoby (z = x × y).
 * Jednostka: 1 cm (figura ma ok. 175 cm; wymiary w skeleton.ts). Czysty moduł, bez React i aliasów importu (działa w aplikacji, testach i skryptach).
 */
export type V3 = [number, number, number];
export type V2 = [number, number];

export const rad = (d: number): number => d * Math.PI / 180;
export const deg = (r: number): number => r * 180 / Math.PI;
export const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
export const dot = (a: V3, b: V3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const len = (a: V3): number => Math.hypot(a[0], a[1], a[2]);
export const dist = (a: V3, b: V3): number => len(sub(a, b));
export const norm = (a: V3): V3 => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

/** Kierunek w płaszczyźnie strzałkowej: kąt od pionu (w górę), dodatni = do przodu (+x). */
export const sag = (angDeg: number): V3 => [Math.sin(rad(angDeg)), Math.cos(rad(angDeg)), 0];
/** Normalna „przód” dla kierunku sag(angDeg) (obrót o −90° wokół z): dla pionu = +x. */
export const sagFront = (angDeg: number): V3 => [Math.cos(rad(angDeg)), -Math.sin(rad(angDeg)), 0];

/**
 * Dwukostny IK w 3D: łopatka/biodro `a`, cel `b`, długości l1 (a→środek) i l2 (środek→cel), `pole` = preferowany kierunek zgięcia środka
 * (wektor, nie musi być prostopadły). Gdy cel poza zasięgiem, kończyna wyprostowana w stronę celu (reach < 1). Zwraca środek (kolano/łokieć) i końcówkę
 * faktycznie osiągniętą oraz wskaźnik osiągnięcia (|koniec − cel|).
 */
export function ik2(a: V3, b: V3, l1: number, l2: number, pole: V3): { mid: V3; end: V3; err: number } {
  const ab = sub(b, a); const dRaw = len(ab) || 1e-9; const u = mul(ab, 1 / dRaw);
  const d = clamp(dRaw, Math.abs(l1 - l2) + 1e-6, l1 + l2 - 1e-6);
  const x = (l1 * l1 - l2 * l2 + d * d) / (2 * d); const h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
  let p = sub(pole, mul(u, dot(pole, u)));
  if (len(p) < 1e-6) p = sub([0, 0, 1], mul(u, u[2])); /* biegun równoległy do osi: dowolna prostopadła */
  if (len(p) < 1e-6) p = [1, 0, 0];
  p = norm(p);
  const mid = add(add(a, mul(u, x)), mul(p, h)); const end = add(a, mul(u, d));
  return { mid, end, err: dist(end, b) };
}

/** Odległość między odcinkami a1–a2 i b1–b2 w 3D (do testów kolizji kapsuł). */
export function distSegSeg(a1: V3, a2: V3, b1: V3, b2: V3): number {
  const d1 = sub(a2, a1), d2 = sub(b2, b1), r = sub(a1, b1);
  const a = dot(d1, d1), e = dot(d2, d2), f = dot(d2, r);
  let s: number, t: number;
  if (a <= 1e-12 && e <= 1e-12) return len(r);
  if (a <= 1e-12) { s = 0; t = clamp(f / e, 0, 1); }
  else {
    const c = dot(d1, r);
    if (e <= 1e-12) { t = 0; s = clamp(-c / a, 0, 1); }
    else {
      const b = dot(d1, d2), den = a * e - b * b;
      s = den > 1e-12 ? clamp((b * f - c * e) / den, 0, 1) : 0;
      t = (b * s + f) / e;
      if (t < 0) { t = 0; s = clamp(-c / a, 0, 1); } else if (t > 1) { t = 1; s = clamp((b - c) / a, 0, 1); }
    }
  }
  return dist(add(a1, mul(d1, s)), add(b1, mul(d2, t)));
}
