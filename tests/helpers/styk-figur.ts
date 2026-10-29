/*
 * Miara styku ciężar–ciało figury v2 (L-056 A, decyzja właściciela 29.10.2026; zadanie 1.0.1 A1): odstęp ciężaru (gryf, hantel, kettlebell, uchwyt linki) od
 * najbliższego odcinka nogi lub tułowia oraz przenikanie ciężaru w ciało, na kadrach co 0,05 (u = 0 … 1). Pomocnik jest niezależny od rodziny (squat, bench_press, hinge).
 * Powierzchnia nogi jak na rysunku (`legRadius`: udo i podudzie z obwodów, spodenki), tułów i miednica jak w kolizjach (GIRTH.trunkCollide, GIRTH.pelvis).
 * „Dwie miary” (L-056 A): poprawka figury ma w teście miarę naprawianej cechy ORAZ styk — strażnik jednej cechy przepuszcza regres innej.
 */
import { figureSpec, frameAt, equipColliders, legRadius, distSegSeg, GIRTH, SIDES, type Frame, type V3 } from '@/lib/figures/v2';

/** Kadry co 0,05: u = 0, 0,05, … 1 (21 kadrów). */
export const KADRY_STYKU: readonly number[] = Array.from({ length: 21 }, (_, i) => +(i / 20).toFixed(2));

export type Styk = { u: number; odstep: number; przenikanie: number; czesc: string };
type Kapsula = { a: V3; b: V3; r: number };

/** Elementy ciężaru klatki: gryf, hantle, kettlebell (kolidery sprzętu) albo — bez nich (linka) — uchwyt w `info.load` jako punkt o promieniu 2 cm. */
export function elementyCiezaru(f: Frame): Kapsula[] {
  const eq = equipColliders(f.props).filter((c): c is Kapsula & { k: 'capsule'; id: string } => c.k === 'capsule' && /^(bar|db|kb)/.test(c.id));
  if (eq.length) return eq.map(c => ({ a: c.a, b: c.b, r: c.r }));
  return f.info.load ? [{ a: f.info.load, b: f.info.load, r: 2 }] : [];
}

/** Styk jednej klatki: najmniejszy odstęp powierzchni ciężaru od nóg (promień jak na rysunku, 41 punktów na kość) i od tułowia/miednicy; ujemny odstęp = przenikanie. */
export function stykKlatki(f: Frame, u = 0): Styk {
  let m = Infinity, czesc = '';
  const trafienie = (g: number, nazwa: string): void => { if (g < m) { m = g; czesc = nazwa; } };
  for (const it of elementyCiezaru(f)) {
    for (const s of SIDES) {
      const L = f.sk.legs[s];
      for (const [seg, a, b] of [['thigh', L.hip, L.knee], ['shank', L.knee, L.ankle]] as const) for (let i = 0; i <= 40; i++) {
        const t = i / 40; const q: V3 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
        trafienie(distSegSeg(q, q, it.a, it.b) - it.r - legRadius(seg, t), (seg === 'thigh' ? 'udo ' : 'podudzie ') + s);
      }
    }
    trafienie(distSegSeg(f.sk.pelvis, f.sk.shoulderC, it.a, it.b) - it.r - GIRTH.trunkCollide, 'tułów');
    trafienie(distSegSeg(f.sk.pelvis, f.sk.pelvis, it.a, it.b) - it.r - GIRTH.pelvis, 'miednica');
  }
  return { u, odstep: m, przenikanie: Math.max(0, -m), czesc };
}

/** Styk w kadrach co 0,05 dla ćwiczenia z katalogu. */
export function stykTora(klucz: string, kadry: readonly number[] = KADRY_STYKU): Styk[] {
  const spec = figureSpec(klucz); if (!spec) throw new Error(`brak figury v2: ${klucz}`);
  return kadry.map(u => stykKlatki(frameAt(spec, u), u));
}

export type PodsumowanieStyku = { maxOdstep: number; uMaxOdstep: number; minOdstep: number; maxPrzenikanie: number };
export function podsumujStyk(s: Styk[]): PodsumowanieStyku {
  const mx = s.reduce((a, b) => (b.odstep > a.odstep ? b : a)); const mn = s.reduce((a, b) => (b.odstep < a.odstep ? b : a));
  return { maxOdstep: mx.odstep, uMaxOdstep: mx.u, minOdstep: mn.odstep, maxPrzenikanie: Math.max(...s.map(x => x.przenikanie)) };
}

/**
 * „Dwie miary”: naprawiana cecha (`cecha` — dowolna liczba z klatek co 0,05, np. odchylenie toru, kąt łokcia, odległość łokcia od barku) i styk ciężar–ciało.
 * Zwraca obie, żeby test zapisał próg dla każdej: `expect(m.cecha).toBeLessThanOrEqual(…)` i `expect(m.styk.maxOdstep).toBeLessThanOrEqual(…)`, `expect(m.styk.maxPrzenikanie)…`.
 */
export function dwieMiary(klucz: string, cecha: (klucz: string, kadry: readonly number[]) => number, kadry: readonly number[] = KADRY_STYKU): { cecha: number; styk: PodsumowanieStyku } {
  return { cecha: cecha(klucz, kadry), styk: podsumujStyk(stykTora(klucz, kadry)) };
}
