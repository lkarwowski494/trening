/*
 * Fala wspólna FW2 (kod wspólny figur v2, 04.11.2026; recenzja różnicy FW1, znalezisko S-1; plan-recenzji-rodzin-v2 §3–§4, K5).
 * S-1: oś hantla jest ⟂ do przedramienia (≥ 80°) w każdej klatce każdego ćwiczenia z hantlami (poses/*.json) i zmienia się płynnie
 * (FW1 przełączał ją progami |fz| > 0,5 i g ≥ 0,2: skoki 30° i 63°; oraz skok 10° przy |obrót| = 80°). Lustro L = R (H-A) zostaje.
 * Negatyw: referencyjna kopia osi z FW1 (a040e2be) na tych samych przedramionach oblewa oba kryteria.
 */
import * as fs from 'fs';
import * as path from 'path';
import { keyframeFrame, poseAt, SIDES, type PoseData, type Prop } from '@/lib/figures/v2';

const POSES = path.join(__dirname, '..', 'lib/figures/v2/poses');
type V = number[];
const KROK = 0.0005;            // próbkowanie u (plan: u co 0,0005)
const MAX_SKOK = 3;             // ° na krok u (obserwowany po poprawce: < 0,4°)
const MIN_KAT = 80;             // ° oś–przedramię
const katProstych = (a: V, b: V): number => Math.acos(Math.min(1, Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (Math.hypot(...a) * Math.hypot(...b)))) * 180 / Math.PI;
const hantel = (props: Prop[], s: 'R' | 'L') => props.find(p => p.k === 'dumbbell' && p.side === s) as Extract<Prop, { k: 'dumbbell' }> | undefined;

type Probka = { u: number; s: 'R' | 'L'; ax: V; fo: V; rot: number | undefined };
const wszystkie = (): { rodz: string; cw: string; d: PoseData }[] => fs.readdirSync(POSES).filter(f => f.endsWith('.json')).flatMap(f => {
  const c = JSON.parse(fs.readFileSync(path.join(POSES, f), 'utf8')).cwiczenia as Record<string, PoseData>;
  return Object.entries(c).filter(([, d]) => d.sprzet.some(g => g.rodzaj === 'hantel' && !g.pionowo)).map(([cw, d]) => ({ rodz: f.replace('.json', ''), cw, d }));
});
const probki = (d: PoseData): Probka[] => {
  const out: Probka[] = []; const span = d.petla === 'cykl_lustro' ? 2 : 1;
  for (let i = 0; i * KROK <= span + 1e-9; i++) { const u = i * KROK; const f = keyframeFrame(d, u);
    for (const s of SIDES) { const p = hantel(f.props, s); if (!p) continue; const a = f.sk.arms[s]; out.push({ u, s, ax: p.axis ? [...p.axis] : [0, 0, 1], fo: [a.wrist[0] - a.elbow[0], a.wrist[1] - a.elbow[1], a.wrist[2] - a.elbow[2]], rot: undefined }); } }
  return out;
};
const miary = (pr: Probka[]): { minKat: number; maxSkok: number } => {
  let minKat = 90, maxSkok = 0; const prev: Partial<Record<'R' | 'L', V>> = {};
  for (const p of pr) { minKat = Math.min(minKat, katProstych(p.ax, p.fo)); const q = prev[p.s]; if (q) maxSkok = Math.max(maxSkok, katProstych(p.ax, q)); prev[p.s] = p.ax; }
  return { minKat, maxSkok };
};

/** Referencja: oś hantla z FW1 (a040e2be, contract.ts withDumbbellAxis) — progi skokowe. Tylko do negatywu. */
function osFW1(fo: V, rot: number | undefined, side: 'R' | 'L'): V | null {
  const fl = Math.hypot(...fo); const fu = fo.map(x => x / fl);
  const wPoprzek = Math.abs(fu[2]) > 0.5; if (!wPoprzek && (rot === undefined || Math.abs(rot) >= 80)) return null;
  const r = Math.max(-90, Math.min(90, rot ?? 90)) * (side === 'L' ? -1 : 1);
  const n = [fo[1], -fo[0], 0]; const nl = Math.hypot(n[0], n[1]); let nn: V;
  if (nl >= 0.2 * fl) nn = [n[0] / nl, n[1] / nl, 0]; else { const v = [-fu[0] * fu[1], 1 - fu[1] * fu[1], -fu[2] * fu[1]]; const vl = Math.hypot(v[0], v[1], v[2]); nn = [v[0] / vl, v[1] / vl, v[2] / vl]; }
  const b = [fu[1] * nn[2] - fu[2] * nn[1], fu[2] * nn[0] - fu[0] * nn[2], fu[0] * nn[1] - fu[1] * nn[0]];
  const c = Math.cos(r * Math.PI / 180), s = Math.sin(r * Math.PI / 180); const ax = [0, 1, 2].map(i => c * nn[i] + s * b[i]); const al = Math.hypot(...ax); return ax.map(x => x / al);
}

const ZESTAW = wszystkie();

describe('S-1: oś hantla ⟂ do przedramienia i płynna (04.11.2026)', () => {
  test('zbiór: wszystkie ćwiczenia z hantlami w poses/*.json (≥ 70), w tym delt_raise, rotator_cuff, thruster, curl', () => {
    expect(ZESTAW.length).toBeGreaterThanOrEqual(70);
    for (const n of ['Reverse Fly (hantle)', 'Y Raise (hantle)', 'External Rotation (hantel)', 'Thruster (hantle)', 'Reverse Flyes With External Rotation', 'Biceps Curl (hantle)']) expect(ZESTAW.map(z => z.cw)).toContain(n);
  });
  test.each(ZESTAW.map(z => [z.rodz, z.cw, z.d] as const))('%s / %s: oś ≥ 80° od przedramienia i skok osi ≤ 3° na krok u = 0,0005', (_r, cw, d) => {
    const m = miary(probki(d));
    expect([cw, m.minKat >= MIN_KAT, m.maxSkok <= MAX_SKOK]).toEqual([cw, true, true]);
  });
  test('negatyw: oś z FW1 na tych samych przedramionach oblewa kryteria (Reverse Fly: skok ≥ 20°; kąt < 80°)', () => {
    const z = ZESTAW.find(x => x.cw === 'Reverse Fly (hantle)')!; const pr = probki(z.d);
    const stara = pr.map(p => ({ ...p, ax: osFW1(p.fo, undefined, p.s) ?? [0, 0, 1] }));
    const m = miary(stara); expect(m.maxSkok).toBeGreaterThan(20); expect(m.minKat).toBeLessThan(MIN_KAT);
    expect(miary(pr).maxSkok).toBeLessThanOrEqual(MAX_SKOK);
  });
  test('negatyw: Reverse Flyes With External Rotation — oś z FW1 (obrót z danych, próg g = 0,2) skacze o > 40° na krok, po poprawce ≤ 3°', () => {
    const d = ZESTAW.find(x => x.cw === 'Reverse Flyes With External Rotation')!.d; let przed = 0, po = 0; const prev: Partial<Record<'R' | 'L', { a: V; b: V }>> = {};
    for (let i = 0; i * KROK <= 1 + 1e-9; i++) { const u = i * KROK; const f = keyframeFrame(d, u);
      for (const s of SIDES) { const p = hantel(f.props, s); if (!p) continue; const a = f.sk.arms[s]; const fo = [a.wrist[0] - a.elbow[0], a.wrist[1] - a.elbow[1], a.wrist[2] - a.elbow[2]];
        const x = osFW1(fo, poseAt(d.klatki, u).rece[s]?.obrotPrzedramienia, s) ?? [0, 0, 1]; const y: V = p.axis ? [...p.axis] : [0, 0, 1]; const q = prev[s];
        if (q) { przed = Math.max(przed, katProstych(x, q.a)); po = Math.max(po, katProstych(y, q.b)); } prev[s] = { a: x, b: y }; } }
    expect(przed).toBeGreaterThan(40); expect(po).toBeLessThanOrEqual(MAX_SKOK);
  });
  test('ciągłość przy |obrót| = 80° (Arnold Press, dane: 80 → 66,9): skok ≤ 3° (FW1: 10°)', () => {
    const z = ZESTAW.find(x => x.cw === 'Arnold Press')!; expect(miary(probki(z.d)).maxSkok).toBeLessThanOrEqual(MAX_SKOK);
  });
  test('rysunek bez zmiany tam, gdzie oś była już ⟂: przedramię blisko płaszczyzny strzałkowej (|fz| ≤ 0,15) i brak obrotu — oś zostaje poprzeczna (bez pola axis)', () => {
    let ile = 0;
    for (const pr of ZESTAW) for (let i = 0; i <= 200; i++) { const f = keyframeFrame(pr.d, i / 200); for (const s of SIDES) { const a = f.sk.arms[s]; const fo = [a.wrist[0] - a.elbow[0], a.wrist[1] - a.elbow[1], a.wrist[2] - a.elbow[2]];
      if (Math.abs(fo[2]) / Math.hypot(...fo) <= 0.15 && poseAt(pr.d.klatki, i / 200).rece[s]?.obrotPrzedramienia === undefined) { if (!hantel(f.props, s)) continue; ile++; expect([pr.cw, s, hantel(f.props, s)!.axis]).toEqual([pr.cw, s, undefined]); } } }
    expect(ile).toBeGreaterThan(0);
  });
  test('lustro H-A zostaje: oś L = lustro osi R (≤ 5°) w ćwiczeniach symetrycznych; wyjątek: ruch naprzemienny (dane różne dla rąk)', () => {
    const NAPRZEMIENNIE = new Set(['Alternating Deltoid Raise', 'See-Saw Press (Alternating Side Press)']);
    for (const z of ZESTAW) { if (NAPRZEMIENNIE.has(z.cw)) continue;
      for (let i = 0; i * 0.01 <= (z.d.petla === 'cykl_lustro' ? 2 : 1) + 1e-9; i++) { const f = keyframeFrame(z.d, i * 0.01); const R = hantel(f.props, 'R'), L = hantel(f.props, 'L'); if (!R || !L) continue;
        const ar = R.axis ?? [0, 0, 1], al = L.axis ?? [0, 0, 1]; if (katProstych([...al], [ar[0], ar[1], -ar[2]]) > 5) throw new Error(`${z.cw} u=${(i * 0.01).toFixed(2)}`); } }
  });
});
