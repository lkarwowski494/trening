// Wspólne narzędzia póz rodzin mobilności, rolowania i szyi (mobility_stand, mobility_floor, foam_roll, neck; 27.10.2026): pozy WYLICZONE z modelu (długości kości z BODY, kinematyka prosta nogi i ręki,
// łokcie i kolana liczy IK silnika z biegunem), bez cudzych obrazów (docs/53, bramka 11). Rozciąganie statyczne = poza nieruchoma: dwie identyczne klatki (u = 0 i u = 1; reguła klatki_rozne dla izometrii).
// Liczby bez źródła (kąty, rozstawy) to UPROSZCZENIE ILUSTRACYJNE; źródła pozycji są przy regułach w data/zrodla/figury-sens.json.
import { v2, BODY, R, r1, K, PODLOGA, poza, HIP, SH, lerp, ease, klatkaPiersiowa, kostkaStopyY } from './dol.mjs';
export { v2, BODY, R, r1, K, PODLOGA, poza, HIP, SH, lerp, ease, klatkaPiersiowa, kostkaStopyY };

export const nrm = (v) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };
export const add = (a, b, k = 1) => a.map((x, i) => x + k * b[i]);
export const mir = (v, sg) => [v[0], v[1], sg * v[2]];
/** Pole kolana/łokcia z FK: kierunek wybrzuszenia (staw względem środka odcinka początek–koniec). */
const poleZ = (a, b, mid3) => { const c = a.map((x, i) => (x + b[i]) / 2); const d = mid3.map((x, i) => x - c[i]); const l = Math.hypot(...d); return l < 0.3 ? null : d.map((x) => r1(x / l * 100) / 100); };
/** Noga z FK: biodro, kierunek uda d1, kierunek goleni d2 (wektory dowolnej długości) → { knee, ankle, pole }. */
export function fk(hip, d1, d2) {
  const b = BODY(); const knee = add(hip, nrm(d1), b.thigh); const ankle = add(knee, nrm(d2), b.shank);
  return { knee, ankle, pole: poleZ(hip, ankle, knee) };
}
/** Ręka z FK: bark, kierunek ramienia d1 i przedramienia d2 (środek dłoni = koniec przedramienia + dłoń) → { elbow, g, pole }. */
export function fkRamie(S, d1, d2) {
  const b = BODY(); const elbow = add(S, nrm(d1), b.uarm); const g = add(elbow, nrm(d2), b.farm + b.hand);
  return { elbow, g, pole: poleZ(S, g, elbow) };
}
/** Noga prawie prosta: kostka w odległości `d` (≤ 83) od biodra w kierunku `kier`; kolano wybrzusza się ku `pole`. */
export function nogaProsta(hip, kier, d = 82.6, pole = [0, 1, 0]) { return { a: add(hip, nrm(kier), d), pole }; }
/** Ręka prawie prosta: środek dłoni w odległości `d` (≤ 64) od barku w kierunku `kier`. */
export function rekaProstaDo(S, kier, d = 62.5, pole = [0, -1, 0]) { return { g: add(S, nrm(kier), d), pole }; }
/** Wpis nogi dla K: kostka a (albo wynik FK), podbicie, rotacja, biegun. */
export const stopa = (a, { pod = null, rot = 10, pole, odch } = {}) => ({ a, pod, rot, pole, odch });

/** Poza statyczna: dwie identyczne klatki (poza nieruchoma, reguła „szkielet_nieruchomy”); fr(u) → klatka K. */
export const statyczna = (rodzina, cw, sprzet, fr) => poza(rodzina, cw, sprzet, [0, 1].map((u) => fr(u)), []);
/** Poza ruchowa: klatki w podanych u; fr(u) → klatka K. */
export const ruchowa = (rodzina, cw, sprzet, us, fr) => poza(rodzina, cw, sprzet, us.map((u) => fr(u)), []);
/** Kąt wektora w płaszczyźnie strzałkowej (x, y) → wektor jednostkowy z zadaną składową boczną z. */
export const w3 = (kat, z = 0, y = null) => { const x = Math.cos(kat * R), yy = y ?? Math.sin(kat * R); return nrm([x, yy, z]); };
export const Y_PODLOGA = 9.6; /* środek miednicy osoby siedzącej/leżącej na podłodze (promień miednicy 9,5 cm) */
/** Kolano (IK silnika: dwukostna noga z biegunem) dla biodra, kostki i bieguna; do ustawiania dłoni na kolanie i kontroli kolizji w generatorze. */
export const kolanoIK = (hip, ankle, pole) => v2().ik2(hip, ankle, BODY().thigh, BODY().shank, pole).mid;
/** Łokieć (IK) dla barku, dłoni i bieguna. */
export const lokiecIK = (S, g, pole) => v2().ik2(S, g, BODY().uarm, BODY().farm + BODY().hand, pole).mid;
/** Środek dłoni w punkcie celu, nie dalej niż d od barku (ręka prosta do `d`, dalej odcięta): zwraca punkt na odcinku bark → cel. */
export function sieganie(S, cel, d = 62.8) { const v = [cel[0] - S[0], cel[1] - S[1], cel[2] - S[2]]; const l = Math.hypot(...v); const k = Math.min(1, d / (l || 1)); return [S[0] + v[0] * k, S[1] + v[1] * k, S[2] + v[2] * k].map(r1); }
/** Wysokość kostki, gdy stopa o podbiciu `pod` leży/stoi na podłodze (najniższy punkt podeszwy y = 0). */
export const kostkaY = (pod = 0, top = 0) => r1(kostkaStopyY(top, pod));
/** Sonda: biodra i barki w świecie dla zadanego tułowia (miednica m, pochylenie p, zgięcie kręgosłupa, obrót/skręt/skłon z `ext`) — liczy je silnik, więc uwzględniają obrót ciała i skręt klatki. */
export function sonda(m, p, { bend = 0, ext = {} } = {}) {
  const E = v2(); const nz = (s) => ({ a: [m[0], 7, s * 10], pod: 0, rot: 10, pole: [1, 0, 0] });
  const k = K({ u: 0, m, p, bend, head: p * 0.5, R: nz(1), L: nz(-1), hr: { g: [m[0], 4, 20], pole: [0, -1, 0] }, hl: { g: [m[0], 4, -20], pole: [0, -1, 0] }, roll: ext.roll, twist: ext.twist, lean: ext.lean, tilt: ext.tilt });
  const pz = { kontrakt: E.CONTRACT.id, rodzina: 'x', cwiczenie: 'x', sprzet: [{ rodzaj: 'podloga' }], klatki: [{ ...k, u: 0 }, { ...k, u: 1 }], bledy: [] };
  const sk = E.keyframeFrame(pz, 0).sk;
  return { hip: { R: sk.legs.R.hip, L: sk.legs.L.hip }, sh: { R: sk.arms.R.shoulder, L: sk.arms.L.shoulder }, head: sk.head, shoulderC: sk.shoulderC, sk };
}
const POLS = (s) => (s === 'R' ? 1 : -1);
/** Klatka z krótkiego opisu: tułów (m, p, bend, head, ext), nogi {R:{a,pod,rot,pole}}, ręce {R:{g,pole}}; ext: roll, twist, lean, tilt, headTilt (skłon boczny głowy, poza@2). */
export const ramka = (u, { m, p, bend = 0, head, nogi, rece, ext = {} }) => {
  const k = K({ u, m, p, bend, head: head ?? p * 0.5, R: nogi.R, L: nogi.L, hr: rece.R, hl: rece.L, roll: ext.roll, twist: ext.twist, lean: ext.lean, tilt: ext.tilt });
  if (ext.headTilt !== undefined) k.przechylGlowy = r1(ext.headTilt);
  return k;
};
/** Ręce do celów (punkty świata): prawie proste, jeśli cel daleko, inaczej łokieć zgięty (IK). */
export const rekiDo = (S, cele, poles = {}) => { const o = {}; for (const s of ['R', 'L']) o[s] = { g: sieganie(S[s], cele[s]), pole: poles[s] ?? [0, -0.5, POLS(s)] }; return o; };
/** Noga prosta od biodra w kierunku kier (3D), kostka w odległości 82,8 (kolano ≤ 15°); stopa: `pod` (null = neutralnie względem goleni). */
export const prosta = (hip, kier, { pole = [0, 1, 0], pod = null, rot = 10 } = {}) => { const a = nogaProsta(hip, kier, 82.8, pole).a; return { a: pod === null ? a : [a[0], r1(kostkaY(pod)), a[2]], pod, rot, pole }; };
/** Nogi stojące, stopy płasko na podłodze (x, z = połowa rozstawu). */
export const stoj = (x = 0, z = 14) => ({ R: { a: [x, 7, z], pod: 0, rot: 10, pole: [1, 0, 0.12] }, L: { a: [x, 7, -z], pod: 0, rot: 10, pole: [1, 0, -0.12] } });
/** Środek głowy (świat, z = 0) dla środka barków shC, pochylenia tułowia p i głowy hp: jak solveSkeleton (kark 4 cm, głowa 18 cm od C7). */
export const glowaSrodek = (shC, p, hp) => [shC[0] + 4 * Math.sin(p * R) + 18 * Math.sin(hp * R), shC[1] + 4 * Math.cos(p * R) + 18 * Math.cos(hp * R)];
