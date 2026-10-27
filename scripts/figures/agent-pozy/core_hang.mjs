// Generator póz rodziny core_hang po stronie agenta (wersja 1.1, 26.10.2026): unoszenie kolan i nóg w zwisie na drążku (knee raise, leg raise, toes to bar).
// Pozy WYLICZONE z modelu: dłonie stałe na drążku (y = 230), ręce proste (łokieć ≤ 25°), barki stałe pod drążkiem, miednica = bark − oś tułowia (wahadło wokół barków), uda i golenie z FK.
// Zakres biodra 133° ogranicza podniesienie prostych nóg: przy toes to bar tułów odchyla się do tyłu (pochylenie ujemne), a kąt uda liczony jest od osi tułowia.
// Błąd katalogu hang.noSwing (bujanie): rysowany tylko po wdrożeniu opisu w pl.json (dotąd pominięty z powodem w PRZYBLIZENIA).
import { v2, BODY, R, r1, lerp, ease, HIP, K, poza, PODLOGA, S, bladZTrajektorii, bledyZOpisem, kluczeRownoDroznie } from './dol.mjs';

export const RODZINA = 'core_hang';
const US = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => Math.round(k / 7 * 1000) / 1000);
const Y_DRAZEK = 230; const ZG = 25; /* dłonie na drążku: z = ±25 */
const nrm = (v) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };
const poleKolana = (hip, ankle, knee) => { const mid = hip.map((v, i) => (v + ankle[i]) / 2); const d = knee.map((v, i) => v - mid[i]); const l = Math.hypot(...d) || 1; return d.map((v) => r1(v / l * 100) / 100); };
export const WYJATKI = {};
export const PRZYBLIZENIA = {};
const D = 63.4;

/** Noga z FK w płaszczyźnie strzałkowej: biodro, kąt uda ang (od +x, 270 = w dół), zgięcie kolana k (stopnie, goleń zawija się do tyłu). */
function noga(hip, ang, k, z) {
  const b = BODY(); const t = ang * R, s = (ang - k) * R; const kn = [hip[0] + b.thigh * Math.cos(t), hip[1] + b.thigh * Math.sin(t), hip[2]]; const an = [kn[0] + b.shank * Math.cos(s), kn[1] + b.shank * Math.sin(s), z];
  return { ankle: an, pole: poleKolana(hip, an, kn) };
}
/** Zwis: pitch = pochylenie tułowia (ujemne = odchylony do tyłu), a ∈ [0, 1] = postęp ruchu nóg; udo ang(a), zgięcie kolana k(a). */
function zwis(cw, { p1, phi1, k0 = 6, k1, dx1, n, kb = 0, phi0 = 3 }) {
  const dz = ZG - 19; const DX = 11; const tr = BODY().trunk; /* barki 11 cm za dłońmi: ramię ≈ 170° (limit 171°) */
  const fr = (u, swing = 0) => { const a = n ? u : 0.9 * u + 0.1 * ease(u); const dxa = dx1 === undefined ? DX : lerp(DX, dx1, a); const Sy = Y_DRAZEK - Math.sqrt(D * D - dz * dz - dxa * dxa); /* Toes to Bar: barki cofają się pod drążek (dx1), ramiona nadal proste */ /* łagodne wygładzenie: kostka nie przekracza limitu prędkości kontraktu */ const p = lerp(0, p1, a) + swing; const m = [-dxa - tr * Math.sin(p * R), Sy - tr * Math.cos(p * R)]; /* barki stałe: S = [−11, Sy] */
    const phi = lerp(phi0, phi1, a), ang = 270 - p + phi, k = lerp(k0, k1, a) + kb * Math.sin(Math.PI * a) ** 2; /* kb: kolana uginają się w środku ruchu (krótsza droga stopy) i prostują przy drążku */ /* kąt uda od osi tułowia (zgięcie biodra phi) */ const hR = [m[0], m[1], HIP()], hL = [m[0], m[1], -HIP()]; const nR = noga(hR, ang, k, 9), nL = noga(hL, ang, k, -9);
    return K({ u, m, p, head: p * 0.5, R: { a: nR.ankle, pod: null, rot: 10, pole: nR.pole }, L: { a: nL.ankle, pod: null, rot: 10, pole: nL.pole }, hr: { g: [0, Y_DRAZEK, ZG], pole: [1, -1, 0.2] }, hl: { g: [0, Y_DRAZEK, -ZG], pole: [1, -1, -0.2] } }); };
  const sprz = [PODLOGA(-150, 150), { rodzaj: 'sztanga', x: 0, y: Y_DRAZEK, dlugosc: 120, talerze: false, podazaZaChwytem: false }];
  const ok = (u) => fr(u), zle = (u) => fr(u, -24 * Math.sin(Math.PI * u));
  const bl = bladZTrajektorii({ cue: 'hang.noSwing', znacznik: 'back', us: US, ok, zle });
  const b = bledyZOpisem(cw, [bl], PRZYBLIZENIA);
  return poza(RODZINA, cw, sprz, (n ? kluczeRownoDroznie(RODZINA, cw, sprz, ok, n) : US).map(ok), b); /* n: klatki równo co do drogi (Toes to Bar: długi ruch, limit skoku 6 cm na 1/48) */
}

export function generuj() {
  return {
    'Hanging Knee Raise': () => zwis('Hanging Knee Raise', { p1: -10, phi1: 100, k0: 6, k1: 110 }),
    'Hanging Leg Raise': () => zwis('Hanging Leg Raise', { p1: -12, phi1: 83, k0: 6, k1: 12 }),
    'Toes to Bar': () => zwis('Toes to Bar', { p1: -55, phi1: 125, k0: 6, k1: 8, dx1: 30, n: 12, kb: 0, phi0: 45 }),
  };
}
