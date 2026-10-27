// Generator póz rodziny strongman po stronie agenta (wersja 1.1, 26.10.2026): Jefferson Squat (sztanga między nogami, nogi w rozkroku strzałkowym) i Yoke Walk (jarzmo na barkach, marsz).
// Pozostałe ćwiczenia rodziny są OTWARTE (brak wskazówek i źródła ruchu: data/zrodla/figury-sens.json → strongman.otwarte) — jawne wyjątki z powodem.
import { kostkaNaPalcach } from './model.mjs';
import { bledyCwiczenia } from '../v2-validate.mjs';
import { wczytajTeksty } from '../v2-jakosc.mjs';
import { P, Q, katyNogi, ruch, bladKolana, zbuduj, PODLOGA, bledyZOpisem, wyjatkiOpisu, cyklLustro } from './dyn.mjs';

export const RODZINA = 'strongman';
const OTW = 'ćwiczenie otwarte: zestaw „open”, brak wskazówek i źródła ruchu (data/zrodla/figury-sens.json → strongman.otwarte); poza wróci po opisie ruchu przez badacza';
const JEFF = 'rozkrok strzałkowy ze sztangą między nogami: aby ręce były proste do sztangi tuż nad podłogą, a sztanga leżała między udami (≥ 10,8 cm od osi każdego uda), miednica musi być ok. 55 cm nad podłogą, a tułów pochylony ok. 50°; wtedy wyprost biodra tylnej nogi wynosi −40° (zakres −17°) albo sztanga przenika udo (do 2,6 cm). Cztery podejścia generatora (rozstaw stóp, wysokość miednicy, tor sztangi) nie zmieściły się w kontrakcie; wymaga decyzji koordynatora (rozszerzenie zakresu wyprostu biodra w rozkroku albo uproszczenie toru sztangi)';
export const WYJATKI = Object.assign({ 'Jefferson Squat': JEFF }, Object.fromEntries(['Atlas Stones', 'Keg Load', 'Log Lift', 'Circus Bell', "Conan's Wheel", 'Tire Flip', 'Sandbag Load', 'Power Stairs'].map((c) => [c, OTW])));
export const PRZYBLIZENIA = {};
export const POMINIETE_BLEDY = {};
export const WYJATKI_OPISU = wyjatkiOpisu(RODZINA);
const yP = (pod) => kostkaNaPalcach(0, pod);
const SPRZ = (...extra) => [PODLOGA(-200, 200), ...extra];
const BAR = (o = {}) => ({ rodzaj: 'sztanga', talerze: true, podazaZaChwytem: true, dlugosc: 220, ...o });

const gotowe = (cw, sprz, W, bledy = [], buduj = P) => {
  const tk = wczytajTeksty(); const ok = new Set(bledy.map((b) => b.cue));
  for (const c of bledyCwiczenia(cw)) if (!ok.has(c)) POMINIETE_BLEDY[cw] = (POMINIETE_BLEDY[cw] ? POMINIETE_BLEDY[cw] + '; ' : '') + (tk[c] ? `błąd „${c}” (rząd błędu do wygenerowania)` : `błąd „${c}” bez opisu w lib/cues/text/pl.json — nie rysowany (reguła jakości etykieta_bledu)`);
  const r = ruch(W, buduj, { rodzina: RODZINA, cw, sprzet: sprz });
  if (process.env.DBG_SM) console.error(cw, 'szczyt', r.szczyt.toFixed(1), 'droga', r.suma.toFixed(0), 'klatek', r.klatki.length);
  const poza = zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: sprz, klatki: r.klatki, bledy: bledyZOpisem(cw, bledy.map((b) => b(r)), POMINIETE_BLEDY) });
  for (const b of poza.bledy) if (b.cue === 'sq.mis.kneesIn' && !b.dotyczy.includes('kneeLat')) b.dotyczy.push('kneeLat');
  return poza;
};
/** Yoke Walk: jarzmo na barkach (jak sztanga na plecach), tułów pionowo, krótkie kroki. Chód w miejscu jak w rodzinie carry (poprawka po recenzji 27.10.2026: wcześniej stopa na podłożu sunęła do przodu):
 * lewa stopa ląduje przed ciałem i cofa się (stopa podporowa), prawa odrywa się z tyłu i przenosi nad podłożem do przodu; miednica na stałej wysokości (rozstaw kostek ≤ 40 cm). */
function yoke(cw) {
  const sprz = SPRZ(BAR({ dlugosc: 190 })); const ra = { rel: [-3, -12.7], g: [0, 0], w: 0, z: 30, pole: [-0.5, -1, 0.6] };
  const hx = -2, hy = 86; const hip = [hx, hy];
  const gr = (pod) => yP(pod) + 0.6; /* kostka stopy stojącej na podłożu (podeszwa ~0) */
  const pod = (A, plant) => { const k = katyNogi(hip, A); return Math.max(-85, k.t - k.k + 90 - plant); };
  const fr = (R, L) => { const A = (f) => [hx + f[0], f[1] === null ? gr(f[2]) : f[1]]; const p = (f) => (f[1] === null ? f[2] : pod(A(f), f[2])); return { pel: hip, AR: A(R), AL: A(L), podR: p(R), podL: p(L), pitch: 3, ra, zR: 14, zL: 14, rot: 12, kz: 0.2 }; };
  const W = [fr([-22, null, -55], [16, null, 0]), fr([-13, 32, 30], [6, null, 0]), fr([8, 28, 20], [-8, null, 0]), fr([15, 20, 15], [-15, null, -25]), fr([16, null, 0], [-22, null, -55])];
  return cyklLustro(gotowe(cw, sprz, W, [], Q)); /* ostatnia klatka = lustro pierwszej (tryb cykliczny) */
}

export function generuj() {
  return { 'Yoke Walk': () => yoke('Yoke Walk') };
}
