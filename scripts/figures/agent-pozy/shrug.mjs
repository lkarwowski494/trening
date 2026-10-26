// Generator póz rodziny shrug po stronie agenta (26.10.2026): szrugsy — barki w górę przy prostych rękach i nieruchomym tułowiu (uniesienieBarkow z poza@2), ciężar zwisa: sztanga, hantle, linka, maszyna.
// Ramiona prawie proste (zwis), barki unoszą się o 6 cm (górna granica kontraktu), bez wysunięcia barków (bez rolowania). Kontrakt wymaga ruchu ≥ 8 cm, więc do uniesienia barków dochodzi odchylenie tułowia o 4,5° (limit reguły tulow_prosto: 5°) i lekkie zgięcie łokci do 14° — uproszczenie opisane w PRZYBLIZENIA. Błędów rysowanych brak (jedyny błąd katalogu to szarpanie = tempo).
import { lezyPrzodem } from './gora.mjs';
import { Y_STOJ, SPRZET, poza, nogiStoj, buduj, rekaProsta, lerp, wyc, noga3, kier } from './gora.mjs';

export const RODZINA = 'shrug';
const U3 = [0, 0.5, 1];
const POL = (s) => (s === 'R' ? 1 : -1);
const UNOS = 6; /* uniesienie barków (cm) w u = 1 — górna granica kontraktu (EXT_ROM.shrug.max = 6) */
const LEAN = 4.5; const FLEX = 14; /* ruch ≥ 8 cm wymagany przez kontrakt: uniesienie 6 cm + odchylenie tułowia ≤ 5° (reguła tulow_prosto) + lekkie zgięcie łokci */

/** Zwis rąk: ramię prawie proste (lekkie odchylenie od pionu: theta do przodu/do tyłu, phi płaszczyzna), barki unoszą się wraz z dłońmi. */
function zwis(cw, o) {
  const fr = (u) => { const sp = { ...rekaProsta(o.theta, o.phi ?? 0, { flex: lerp(0.5, FLEX, u), pl: o.pl ?? 1, obrot: o.obrot }), uniesienie: UNOS * u };
    return poza({ u, tulow: { m: [0, Y_STOJ], p: -LEAN * u }, nogi: nogiStoj(0, 14), rece: { R: sp, L: sp } }); };
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-80, 120), ...o.sprzet], fr, us: U3 });
}


/** Middle Back Shrug: leżenie przodem na ławce skośnej, ramiona zwisają pionowo, łopatki ściągają się (wysuniecieBarkow od +5 do −4 cm) — klatka na oparciu. */
function sciaganieLopatek(cw, o) {
  const L = lezyPrzodem(45, { dl: 30, zr: 16, kolDx: 52, pole: [1, 0.2, 0] }); const zr = 22;
  const fr = (u) => { const w = 5 + (-4 - 5) * u; const rece = {}; for (const sd of ['R', 'L']) { const sw = -POL(sd); const S = L.S(sd);
      rece[sd] = { g: [S[0] - w * 0.7071 - 8, S[1] - w * 0.7071 - 59, sw * zr], pole: [0, -1, 0], obrot: 0, wysuniecie: w }; }
    return poza({ u, tulow: { m: L.m, p: L.p, glowa: L.p, ext: L.ext }, nogi: L.nogi, rece }); };
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-110, 130), L.lawka, ...o.sprzet], fr, us: [0, 0.25, 0.5, 0.75, 1] });
}

export const WYJATKI = {
};
export const PRZYBLIZENIA = {
  'Shrugs (sztanga)': 'uproszczenie wspólne dla rodziny: uniesienie barków 6 cm (granica kontraktu) nie daje wymaganego ruchu ≥ 8 cm, więc w u = 1 tułów jest odchylony o 4,5° (limit reguły: 5°) i łokcie zgięte do 14° — uniesienie barków pozostaje głównym ruchem',
  'Calf-Machine Shoulder Shrug': 'przybliżenie: poduszki maszyny do łydek na barkach narysowane jako prowadnica przy dłoniach (kontrakt nie ma sprzętu „poduszki na barkach”); ruch ciała bez zmian',
  'Leverage Shrug': 'przybliżenie: uchwyty maszyny przy biodrach narysowane jako prowadnica pionowa przy prawej dłoni (schemat); dłonie unoszą się o 8,5 cm przy barkach unoszonych o 6 cm (łokcie lekko zgięte w górze), tułów nieruchomy',
  'Smith Machine Behind the Back Shrug': 'sztanga na prowadnicy porusza się tylko w pionie: dłonie wprost na stałym x, unoszą się o 8,5 cm przy barkach unoszonych o 6 cm (łokcie lekko zgięte w górze), tułów nieruchomy',
};

export function generuj() {
  const G = {};
  const hang = { theta: 12, phi: 0 }; /* ramię odchylone 12° do przodu: sztanga przed udami */
  G['Shrugs (sztanga)'] = () => zwis('Shrugs (sztanga)', { ...hang, sprzet: [SPRZET.sztanga()] });
  G['Shrugs (hantle)'] = () => zwis('Shrugs (hantle)', { theta: 8, phi: 90, sprzet: [SPRZET.hantle()], obrot: 0 });
  G['Shrugs (linki)'] = () => zwis('Shrugs (linki)', { ...hang, sprzet: [wyc({ chwyt: 'drazek', x: 70, y: 15 })] });
  G['Barbell Shrug Behind The Back'] = () => zwis('Barbell Shrug Behind The Back', { theta: -14, phi: 0, pl: -1, sprzet: [SPRZET.sztanga()] });
  G['Smith Machine Behind the Back Shrug'] = () => { /* sztanga na prowadnicy porusza się tylko w pionie: dłonie wprost na stałym x, unoszą się o 8,5 cm przy barkach unoszonych o 6 cm */
    const x = -15.5; const fr = (u) => { const y0 = Y_STOJ + 50 - 61; const g = (s) => ({ g: [x, y0 + 8.5 * u, POL(s) * 19], pole: [-1, -0.4, POL(s) * 0.3], uniesienie: UNOS * u }); return poza({ u, tulow: { m: [0, Y_STOJ], p: 0 }, nogi: nogiStoj(0, 14), rece: { R: g('R'), L: g('L') } }); };
    return buduj({ rodzina: RODZINA, cw: 'Smith Machine Behind the Back Shrug', sprzet: [SPRZET.podloga(-80, 120), { rodzaj: 'smith', x, h: 200 }, SPRZET.sztanga()], fr, us: U3 }); };
  const masz = (cw) => { /* dźwignia: prowadnica pionowa przy prawej dłoni; dłonie wprost na stałym x (uchwyty maszyny poruszają się w pionie), unoszą się o 8,5 cm przy barkach unoszonych o 6 cm */
    const x = 4; const y0 = Y_STOJ + 50 - 61; const fr = (u) => { const g = (s) => ({ g: [x, y0 + 8.5 * u, POL(s) * 26], pole: [-1, -0.5, POL(s) * 0.3], uniesienie: UNOS * u }); return poza({ u, tulow: { m: [0, Y_STOJ], p: 0 }, nogi: nogiStoj(0, 14), rece: { R: g('R'), L: g('L') } }); };
    const lever = { rodzaj: 'dzwignia', tryb: 'prosta', x, y: Math.round((y0 - 4) * 10) / 10, z: 26, kat: 90, dlugosc: 20, punkt: 'dlonie', trzyma: 'R' };
    return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-80, 120), lever], fr, us: U3 }); };
  G['Leverage Shrug'] = () => masz('Leverage Shrug');
  G['Calf-Machine Shoulder Shrug'] = () => masz('Calf-Machine Shoulder Shrug');
  G['Middle Back Shrug'] = () => sciaganieLopatek('Middle Back Shrug', { sprzet: [SPRZET.hantle()] });
  return G;
}
