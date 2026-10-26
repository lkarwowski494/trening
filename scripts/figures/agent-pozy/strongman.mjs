// Generator póz rodziny strongman po stronie agenta (wersja 1.1, 26.10.2026): Jefferson Squat (sztanga między nogami, nogi w rozkroku strzałkowym) i Yoke Walk (jarzmo na barkach, marsz).
// Pozostałe ćwiczenia rodziny są OTWARTE (brak wskazówek i źródła ruchu: data/zrodla/figury-sens.json → strongman.otwarte) — jawne wyjątki z powodem.
import { kostkaNaPalcach } from './model.mjs';
import { bledyCwiczenia } from '../v2-validate.mjs';
import { wczytajTeksty } from '../v2-jakosc.mjs';
import { P, Q, katyNogi, ruch, bladKolana, zbuduj, PODLOGA, bledyZOpisem, kostkaZBiodra, wyjatkiOpisu } from './dyn.mjs';

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
/** Punkt zwrotny z biodrem w x = hx: prawa noga (al, k, pod) stoi na podłożu (kostka z wysokości podbicia) albo w locie (hy); lewa kostka AL (x względem hx, y bezwzględnie albo 'h' + różnica od biodra). */
function krok(hx, hy, r, lAbs, o = {}) {
  const rel = kostkaZBiodra([0, 0], r.al, r.k); const hipY = r.ziemia ? yP(r.pod ?? 0) + 0.6 - rel[1] : hy;
  const A = [hx + rel[0], hipY + rel[1]];
  return { A, al: r.al, k: r.k, pod: r.pod ?? 0, AL: [hx + lAbs[0], lAbs[1] === 'h' ? hipY + lAbs[2] : lAbs[1]], podL: o.podL ?? 0, pitch: o.pitch, ra: o.ra, zR: o.zs ?? 14, zL: o.zs ?? 14, kz: o.kz ?? 0.2, nopole: o.nopole, rotR: o.rot ?? 12, rotL: o.rot ?? 12 };
}

/** Yoke Walk: jarzmo na barkach (jak sztanga na plecach), tułów pionowo, krok naprzemienny (prawa noga pcha z tyłu → nogi razem → prawa noga w przód). */
function yoke(cw) {
  const sprz = SPRZ(BAR({ dlugosc: 190 })); const ra = { rel: [-3, -12.7], g: [0, 0], w: 0, z: 30, pole: [-0.5, -1, 0.6] };
  const o = (podL) => ({ pitch: 3, ra, podL, zs: 14 });
  const W = [krok(-2, 0, { al: 17, k: 8, pod: -45, ziemia: true }, [13, 'h', -64], o(-30)), krok(-2, 0, { al: 12, k: 16, pod: -25, ziemia: true }, [7, 'h', -68], o(-25)), krok(-2, 0, { al: 4, k: 12, pod: 0, ziemia: true }, [-2, 'h', -74], o(-15)),
    krok(-2, 84, { al: -8, k: 30, pod: -8 }, [-22, yP(-45)], o(-45))];
  return gotowe(cw, sprz, W);
}

export function generuj() {
  return { 'Yoke Walk': () => yoke('Yoke Walk') };
}
