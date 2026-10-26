// Generator póz rodziny kneeling_hinge po stronie agenta (wersja 1.1, 26.10.2026): Seated Good Mornings — skłon w biodrach z siadu na skrzyni, sztanga na barkach.
// Pozy WYLICZONE z modelu: miednica nieruchoma na skrzyni, uda poziomo (ograniczenie zakresu biodra 133° ogranicza skłon do ok. 45° od pionu), sztanga niesiona z tułowiem (tp), plecy proste.
// Błąd katalogu mis.roundBack (zaokrąglenie pleców, grupa plecy): zgięcie kręgosłupa +26° przy końcu ruchu — łamie tylko regułę „plecy” (kręgosłup neutralny).
// „Kneeling Squat” (zestaw otwarty, brak źródła ruchu) nie jest badany: poza tym generatorem.
import { v2, BODY, R, r1, lerp, ease, HIP, K, poza, PODLOGA, tp, bladZTrajektorii, bledyZOpisem, dodajDotyczy } from './dol.mjs';

export const RODZINA = 'kneeling_hinge';
const US = [0, 0.25, 0.5, 0.75, 1];
export const WYJATKI = {};
export const PRZYBLIZENIA = {
  'Seated Good Mornings': 'przybliżenie: zakres skłonu ograniczony zakresem biodra (133°) przy siedzeniu z udami poziomo — tułów pochyla się o ok. 40° od pionu, a nie głębiej',
};

function seatedGM(cw, o = {}) {
  const { top = 46, p0 = 2, p1 = 44 } = o; const m = [0, top + 11.8]; const ax = 40;
  const fr = (u, bend = 0) => { const p = lerp(p0, p1, ease(u)); const g = (sg) => ({ g: tp(m, p, BODY().trunk - 3, -12.8, sg * 32), pole: [-0.7, -1, sg * 0.5] });
    return K({ u, m, p, bend, head: p * 0.7, R: { a: [ax, 7, 10], pod: 0, rot: 10, pole: [1, 0.4, 0.05] }, L: { a: [ax, 7, -10], pod: 0, rot: 10, pole: [1, 0.4, -0.05] }, hr: g(1), hl: g(-1) }); };
  const ok = (u) => fr(u), zle = (u) => fr(u, 26 * ease(u));
  const sprzet = [PODLOGA(-120, 140), { rodzaj: 'skrzynia', x0: -30, x1: 8, top }, { rodzaj: 'slupek', x: -60, h: 150 }, { rodzaj: 'sztanga', talerze: true, podazaZaChwytem: true, dlugosc: 220 }];
  const bl = bladZTrajektorii({ cue: 'mis.roundBack', znacznik: 'back', us: US, ok, zle });
  const b = bledyZOpisem(cw, [bl], PRZYBLIZENIA); return poza(RODZINA, cw, sprzet, US.map(ok), b);
}

export function generuj() { return { 'Seated Good Mornings': () => seatedGM('Seated Good Mornings') }; }
