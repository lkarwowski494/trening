// Narzędzia generatorów póz „po stronie agenta” (pilotaż 26.10.2026, docs/53): pozy wyliczane Z MODELU (długości kości, IK, sprzęt z silnika v2), nie wpisywane ręcznie.
// Generator rodziny (scripts/figures/agent-pozy/<rodzina>.mjs) opisuje ćwiczenie parametrami (chwyt, rozstaw, sprzęt, zakres, jednonóż/jednorącz), a ten moduł zamienia je w klatki kluczowe
// i błędy jako delty (dotyczy liczone z silnika). Wejście: tylko liczby z modelu i wskazówki z katalogu — żadnych cudzych obrazów (docs/53, bramka 11).
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadV2 } from '../v2-build.mjs';
import { bledyCwiczenia } from '../v2-validate.mjs';

let cache = null;
/** Silnik v2 (transpilacja do katalogu tymczasowego, raz na proces). */
export function silnik() {
  if (!cache) { const dir = mkdtempSync(join(tmpdir(), 'agent-pozy-')); cache = loadV2(dir); process.on('exit', () => { try { rmSync(dir, { recursive: true, force: true }); } catch { /* sprzątanie best effort */ } }); }
  return cache;
}
export const v2 = () => silnik().v2;
export const BODY = () => v2().BODY;
export const R = Math.PI / 180;
/** Zaokrąglenie do jednego miejsca po przecinku (kontrakt: co najwyżej 1 miejsce). */
export const r1 = (x) => Math.round(x * 10) / 10;
export const rv = (a) => a.map(r1);
/** Kierunki w płaszczyźnie strzałkowej: oś tułowia (od pionu, do przodu dodatnie) i normalna „przód”. */
export const up = (p) => [Math.sin(p * R), Math.cos(p * R)];
export const front = (p) => [Math.cos(p * R), -Math.sin(p * R)];
export const dir = (kat) => [Math.cos(kat * R), Math.sin(kat * R)]; /* kąt od osi +x (przód), przeciwnie do ruchu wskazówek: 90 = w górę, −90 = w dół, 180 = do tyłu */
export const zip2 = (a, b, f) => [f(a[0], b[0]), f(a[1], b[1])];
export const d2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Barki (środek) dla miednicy, pochylenia tułowia i zgięcia kręgosłupa — jak solveSkeleton. */
export function barki(miednica, pitch, bend = 0) { const k = BODY().trunk * Math.cos(0.55 * bend * R); const u = up(pitch); return [miednica[0] + u[0] * k, miednica[1] + u[1] * k]; }
/** Odległość bark–chwyt (3D) przy zgięciu łokcia theta (0 = prosty): z IK dwukostnego. */
export function dChwytu(theta) { const b = BODY(); const l2 = b.farm + b.hand; return Math.sqrt(b.uarm ** 2 + l2 ** 2 + 2 * b.uarm * l2 * Math.cos(theta * R)); }
/** Kąt łokcia, gdy bark–chwyt (3D) ma długość d. */
export function lokiecZD(d) { const b = BODY(); const l2 = b.farm + b.hand; return Math.acos(Math.max(-1, Math.min(1, (d * d - b.uarm ** 2 - l2 ** 2) / (2 * b.uarm * l2)))) / R; }
export const ZASIEG = () => { const b = BODY(); return b.uarm + b.farm + b.hand; };
export const NOGA = () => { const b = BODY(); return b.thigh + b.shank + b.ankleH; };

/** Przecięcie okręgów (środek c1 promień r1, środek c2 promień r2) w płaszczyźnie; wybór „gora” (większe y) albo „dol”. null gdy brak. */
export function przeciecie(c1, ra, c2, rb, wybor = 'gora') {
  const dx = c2[0] - c1[0], dy = c2[1] - c1[1]; const d = Math.hypot(dx, dy); if (d > ra + rb || d < Math.abs(ra - rb) || d === 0) return null;
  const a = (ra * ra - rb * rb + d * d) / (2 * d); const h = Math.sqrt(Math.max(0, ra * ra - a * a)); const mx = c1[0] + (a * dx) / d, my = c1[1] + (a * dy) / d;
  const p1 = [mx + (h * dy) / d, my - (h * dx) / d], p2 = [mx - (h * dy) / d, my + (h * dx) / d];
  return wybor === 'gora' ? (p1[1] >= p2[1] ? p1 : p2) : (p1[1] < p2[1] ? p1 : p2);
}
/** Wysokość kostki (y), gdy palce (stopa podeszwowo, podbicie −60) stoją na podparciu o wysokości y0; kostka wyżej o wysokość stopy. */
export const kostkaNaPalcach = (y0, podbicie = -60) => { const f = podbicie * R; return r1(y0 - (Math.sin(f) * BODY().toeFwd - Math.cos(f) * BODY().ankleH) + 0.3); };
/** Kostka (y) gdy stopa płasko na podparciu y0 (podbicie 0): pięta/palce na y0 → kostka na wysokości kostki. */
export const kostkaPlasko = (y0 = 0) => r1(y0 + BODY().ankleH);

/** Klatka kluczowa z płaskich parametrów. nogi/rece: { R:{k:[x,y,z],pod,rot,pole,odchylenie}, L:{...} }, rece: { R:{g:[x,y,z],pole}, L }. */
export function klatka({ u, miednica, pitch, bend = 0, glowa, nogi, rece }) {
  const noga = (s) => { const n = nogi[s]; const o = { kostka: rv(n.k) }; if (n.pod !== undefined) o.podbicie = r1(n.pod); o.rotacjaStopy = n.rot ?? 10; if (n.pole) o.biegunKolana = n.pole; if (n.odchylenie !== undefined) o.odchylenieKolana = n.odchylenie; return o; };
  const reka = (s) => { const a = rece[s]; const o = { chwyt: rv(a.g) }; if (a.pole) o.biegunLokcia = a.pole; return o; };
  const k = { u: r1(u * 1000) / 1000, miednica: rv([miednica[0], miednica[1], miednica[2] ?? 0]), pochylenieTulowia: r1(pitch), zgiecieKregoslupa: r1(bend), pochylenieGlowy: r1(glowa ?? pitch * 0.6), nogi: { R: noga('R'), L: noga('L') }, rece: { R: reka('R'), L: reka('L') } };
  return k;
}
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
/** Delta klatki błędu = (klatka błędna − klatka poprawna) w polach, które się różnią; u = 0 zawsze zerowa. */
export function delta(bad, ok) {
  const d = { u: bad.u }; const sub3 = (a, b) => a.map((x, i) => r1(x - b[i]));
  if (!eq(bad.miednica, ok.miednica)) d.miednica = sub3(bad.miednica, ok.miednica);
  for (const [pl, kk] of [['pochylenieTulowia', 'pochylenieTulowia'], ['zgiecieKregoslupa', 'zgiecieKregoslupa'], ['pochylenieGlowy', 'pochylenieGlowy']]) { const x = r1((bad[kk] ?? 0) - (ok[kk] ?? 0)); if (x !== 0) d[pl] = x; }
  const nogi = {}; for (const s of ['R', 'L']) { const b = bad.nogi[s], o = ok.nogi[s]; const x = {}; if (!eq(b.kostka, o.kostka)) x.kostka = sub3(b.kostka, o.kostka); const pb = r1((b.podbicie ?? 0) - (o.podbicie ?? 0)); if (pb !== 0) x.podbicie = pb; if (Object.keys(x).length) nogi[s] = x; }
  if (Object.keys(nogi).length) d.nogi = nogi;
  const rece = {}; for (const s of ['R', 'L']) { if (!eq(bad.rece[s].chwyt, ok.rece[s].chwyt)) rece[s] = { chwyt: sub3(bad.rece[s].chwyt, ok.rece[s].chwyt) }; }
  if (Object.keys(rece).length) d.rece = rece;
  return d;
}
const ZERO = (u) => ({ u });
/** Błąd z trajektorii: `traj(u, wariant)` zwraca klatkę (wariant 'ok' | 'zle'); delty liczone dla u z listy. Pole `dotyczy` wylicza `zbuduj` z silnika. */
export function bladZTrajektorii({ cue, znacznik = 'pelvis', us = [0, 0.5, 1], ok, zle }) {
  return { cue, znacznik, dotyczy: [], klatki: us.map((u) => (u === 0 ? ZERO(0) : delta(zle(u), ok(u)))) };
}

/** Składa pozę, wylicza `dotyczy` błędów z silnika (kąty zmienione o > 3,5° + co zmieniono w deltach) i zwraca obiekt zgodny z kontraktem. */
export function zbuduj({ rodzina, cwiczenie, sprzet, klatki, bledy = [] }) {
  const dozwolone = bledyCwiczenia(cwiczenie); bledy = bledy.filter((b) => dozwolone.includes(b.cue)); /* tylko błędy z listy wskazówek ćwiczenia (katalog) */
  const poza = { kontrakt: v2().CONTRACT.id, rodzina, cwiczenie, sprzet, klatki, bledy };
  const E = v2(); const KAT = { hip: 'hip', knee: 'knee', ankle: 'ankle', elbow: 'elbow', shElev: 'shoulder' };
  const us = [...new Set([...Array.from({ length: 25 }, (_, i) => i / 24), ...klatki.map((k) => k.u)])].sort((a, b) => a - b);
  poza.bledy = bledy.map((b, j) => {
    const dz = new Set(); let max = {};
    for (const u of us) { let f0, f1; try { f0 = E.keyframeFrame(poza, u); f1 = E.keyframeFrame(poza, u, j); } catch { continue; }
      for (const s of ['R', 'L']) { const x = E.jointAngles(f0.sk, s), y = E.jointAngles(f1.sk, s); for (const k of Object.keys(KAT)) max[k] = Math.max(max[k] ?? 0, Math.abs(x[k] - y[k])); } }
    for (const [k, v] of Object.entries(max)) if (v > 3.5) dz.add(KAT[k]);
    const dl = b.klatki; if (dl.some((k) => k.miednica)) dz.add('pelvis'); if (dl.some((k) => k.pochylenieTulowia !== undefined || k.zgiecieKregoslupa !== undefined)) dz.add('spine'); if (dl.some((k) => k.rece)) dz.add('shoulder'); if (dl.some((k) => k.nogi && Object.values(k.nogi).some((n) => n.podbicie !== undefined))) dz.add('ankle');
    return { cue: b.cue, znacznik: b.znacznik, dotyczy: [...dz], klatki: b.klatki };
  });
  return poza;
}
