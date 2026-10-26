// Generator póz rodziny carry po stronie agenta (wersja 1.1, 26.10.2026): marsz z ciężarem (farmer, suitcase, trap bar, riksza, nad głową, rack).
// Pozy WYLICZONE z modelu: pełny cykl kroku z 5 klatek (podwójne podparcie — przejście nogi — podwójne podparcie po drugiej stronie — przejście — start), tułów pionowo, miednica nad nogą podporową (hipY), ręce proste (łokieć ≤ 20°) albo zgięte w rack.
// Rodzina nie ma błędów w katalogu (wskazówki carry.noLean / carry.walk bez błędów): bledy: [].
import { BODY, R, r1, lerp, HIP, K, poza, PODLOGA, hipY, dNogi, S, kostkaStopyY } from './dol.mjs';

export const RODZINA = 'carry';
const US = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
export const WYJATKI = {};
export const PRZYBLIZENIA = {
  'Rickshaw Carry': 'przybliżenie: ramę riksza rysujemy jak gryf sześciokątny (rejestr sprzętu: riksza = trap bar)',
};
const D_RECE = 63.5; /* odległość bark–chwyt przy prawie prostym łokciu (≤ 20°; zasięg 64) */

/** Pozycja kostki nogi w fazie chodu φ ∈ [0, 1): podparcie (0…0,5) — pięta, płasko, palce; przenoszenie (0,5…1) — noga leci do przodu. s = połowa długości kroku (cm). Zwraca { a: [x, y], pod, podparcie }. */
function stopa(phi, s) {
  const yH = (pod) => kostkaStopyY(0, pod);
  if (phi < 0.5) { const t = phi / 0.5; const pod = t < 0.25 ? 14 * (1 - t / 0.25) : t < 0.6 ? 0 : -42 * ((t - 0.6) / 0.4); return { a: [s - 2 * s * t, yH(pod)], pod, podparcie: true }; }
  const t = (phi - 0.5) / 0.5; const pod = lerp(-42, 14, t); return { a: [-s + 2 * s * t, Math.max(yH(pod), 7 + 14 * Math.sin(Math.PI * t))], pod, podparcie: t > 0.7 };
}
const faza = (u, s) => { const z = 9; const ph = 0.5 * u; const r = stopa(ph, s), l = stopa((ph + 0.5) % 1, s); /* pół cyklu: od kroku prawą nogą z przodu do kroku lewą z przodu */ return { R: { a: [r.a[0], r.a[1], z], pod: r.pod, podp: r.podparcie }, L: { a: [l.a[0], l.a[1], -z], pod: l.pod, podp: l.podparcie } }; };
/** Miednica nad nogą podporową (podwójne podparcie: nad niższą z dwóch), wysokość z hipY dla prawie prostej nogi (zgięcie 6°). */
function miednica(f) {
  const ys = ['R', 'L'].filter((k) => f[k].podp).map((k) => hipY(f[k].a, 0, (k === 'R' ? 1 : -1) * HIP(), 6)); return [0, Math.min(...ys)];
}

/** Ręce: grip(Sx) → { hr, hl }. */
const wisza = (z, dx = 0) => (Sx) => { const f = (sg) => { const dz = z - 19; const ly = Math.sqrt(Math.max(1, D_RECE ** 2 - dz * dz - dx * dx)); return { g: [Sx[0] + dx, Sx[1] - ly, sg * z], pole: [0, 0, sg] }; }; return { hr: f(1), hl: f(-1) }; };
const wiszaJedna = (zr, zl) => (Sx) => { const f = (z, sg) => { const dz = z - 19; const ly = Math.sqrt(Math.max(1, D_RECE ** 2 - dz * dz)); return { g: [Sx[0], Sx[1] - ly, sg * z], pole: [0, 0, sg] }; }; return { hr: f(zr, 1), hl: f(zl, -1) }; };
const nadGlowa = (Sx) => { const dx = 16; const ly = Math.sqrt(D_RECE ** 2 - dx * dx - 0); const f = (sg) => ({ g: [Sx[0] + dx, Sx[1] + ly, sg * 19], pole: [0.2, 0, sg] }); return { hr: f(1), hl: f(-1) }; };
const rack = (Sx) => { const f = (sg) => ({ g: [Sx[0] + 34, Sx[1] - 2, sg * 13], pole: [0, -1, sg * 0.4] }); return { hr: f(1), hl: f(-1) }; };

function marsz(cw, { s = 28, rece, sprzet }) {
  const fr = (u) => { const f = faza(u, s); const m = miednica(f); const Sx = S(m, 0); const g = rece(Sx); const ps = (sg) => [1, 0.15, sg * 0.05];
    return K({ u, m, p: 0, head: 0, R: { a: f.R.a, pod: f.R.pod, rot: 10, pole: ps(1) }, L: { a: f.L.a, pod: f.L.pod, rot: 10, pole: ps(-1) }, hr: g.hr, hl: g.hl }); };
  return poza(RODZINA, cw, [PODLOGA(-120, 120), ...sprzet], US.map(fr), []);
}

export function generuj() {
  return {
    "Farmer's Walk": () => marsz("Farmer's Walk", { rece: wisza(25), sprzet: [{ rodzaj: 'hantel' }] }),
    "Farmer's Walk (Farmers Handles)": () => marsz("Farmer's Walk (Farmers Handles)", { s: 26, rece: wisza(29), sprzet: [{ rodzaj: 'hantel', promien: 10 }] }),
    "Farmer's Walk (trap bar)": () => marsz("Farmer's Walk (trap bar)", { s: 26, rece: wisza(29), sprzet: [{ rodzaj: 'gryf_szesciokatny' }] }),
    'Rickshaw Carry': () => marsz('Rickshaw Carry', { s: 22, rece: wisza(29), sprzet: [{ rodzaj: 'gryf_szesciokatny' }] }),
    'Suitcase Carry': () => marsz('Suitcase Carry', { rece: wiszaJedna(29, 24), sprzet: [{ rodzaj: 'kettlebell', trzyma: 'R', dzwon: 'dol' }] }),
    'Overhead Carry (hantle)': () => marsz('Overhead Carry (hantle)', { s: 24, rece: nadGlowa, sprzet: [{ rodzaj: 'hantel' }] }),
    'Double Kettlebell Front Rack Carry': () => marsz('Double Kettlebell Front Rack Carry', { s: 24, rece: rack, sprzet: [{ rodzaj: 'kettlebell', trzyma: 'R', dzwon: 'tyl' }, { rodzaj: 'kettlebell', trzyma: 'L', dzwon: 'tyl' }] }),
  };
}
