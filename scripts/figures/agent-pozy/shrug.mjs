// Generator póz rodziny shrug po stronie agenta (26.10.2026): szrugsy — barki w górę przy prostych rękach i nieruchomym tułowiu (uniesienieBarkow z poza@2), ciężar zwisa: sztanga, hantle, linka, maszyna.
// Ramiona prawie proste (zwis), barki unoszą się o 6 cm (górna granica kontraktu), bez wysunięcia barków (bez rolowania); chwyt podąża za barkiem (chwyt = chwyt startu + uniesienie barku),
// łokcie stałe, tułów nieruchomy. Recenzja niezależna partii 3 (09.11.2026, W1–W4 WYSOKIE): wcześniej do uniesienia dochodziło odchylenie tułowia 4,5° i zgięcie łokci do 14° (żeby przekroczyć bramkę
// ruchu ≥ 8 cm), a w maszynach chwyt szedł 8,5 cm przy barku 6 cm — silnik zginał łokcie. Bramka ruchu nie dotyczy szrugsów (data/zrodla/figury-sens.json → bez_bramki_ruchu, analogia do decyzji
// właściciela 26.10.2026: ruch bez przemieszczenia punktu o ≥ 8 cm). Błędów rysowanych brak (jedyny błąd katalogu to szarpanie = tempo).
import { lezyPrzodem } from './gora.mjs';
import { Y_STOJ, SPRZET, poza, nogiStoj, buduj, rekaProsta, lerp, wyc, noga3, kier } from './gora.mjs';

export const RODZINA = 'shrug';
const U3 = [0, 0.5, 1];
const POL = (s) => (s === 'R' ? 1 : -1);
const UNOS = 6; /* uniesienie barków (cm) w u = 1 — górna granica kontraktu (EXT_ROM.shrug.max = 6) */
const FLEX = 0.5; /* łokcie prawie proste, stałe przez cały ruch (W1–W4, 09.11.2026) */

/** Zwis rąk: ramię prawie proste (lekkie odchylenie od pionu: theta do przodu/do tyłu, phi płaszczyzna), barki unoszą się wraz z dłońmi. */
function zwis(cw, o) {
  const fr = (u) => { const sp = { ...rekaProsta(o.theta, o.phi ?? 0, { flex: FLEX, pl: o.pl ?? 1, obrot: o.obrot }), uniesienie: UNOS * u };
    return poza({ u, tulow: { m: [0, Y_STOJ], p: 0 }, nogi: nogiStoj(0, 14), rece: { R: sp, L: sp } }); };
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
  'Shrugs (sztanga)': 'uproszczenie wspólne dla rodziny: uniesienie barków 6 cm (granica kontraktu, EXT_ROM.shrug.max); bramka ruchu ≥ 8 cm nie obowiązuje (bez_bramki_ruchu, 09.11.2026)',
  'Calf-Machine Shoulder Shrug': 'przybliżenie: poduszki maszyny do łydek na barkach narysowane jako prowadnica przy dłoniach (kontrakt nie ma sprzętu „poduszki na barkach”); ruch ciała bez zmian',
  'Leverage Shrug': 'przybliżenie: uchwyty maszyny przy biodrach narysowane jako prowadnica pionowa przy prawej dłoni (schemat); dłonie unoszą się razem z barkami o 6 cm (łokcie stałe), tułów nieruchomy',
  'Smith Machine Behind the Back Shrug': 'sztanga na prowadnicy porusza się tylko w pionie: dłonie wprost na stałym x, unoszą się razem z barkami o 6 cm (łokcie stałe), tułów nieruchomy',
};

export function generuj() {
  const G = {};
  const hang = { theta: 12, phi: 0 }; /* ramię odchylone 12° do przodu: sztanga przed udami */
  G['Shrugs (sztanga)'] = () => zwis('Shrugs (sztanga)', { ...hang, sprzet: [SPRZET.sztanga()] });
  G['Shrugs (hantle)'] = () => zwis('Shrugs (hantle)', { theta: 8, phi: 90, sprzet: [SPRZET.hantle()], obrot: 0 });
  G['Shrugs (linki)'] = () => zwis('Shrugs (linki)', { ...hang, sprzet: [wyc({ chwyt: 'drazek', x: 70, y: 15 })] });
  G['Barbell Shrug Behind The Back'] = () => zwis('Barbell Shrug Behind The Back', { theta: -14, phi: 0, pl: -1, sprzet: [SPRZET.sztanga()] });
  /* Smith i maszyny (W1, W2, 09.11.2026): ten sam zwis prostych rąk co wersje wolne — chwyt idzie pionowo razem z barkiem (tułów nieruchomy, łokcie stałe), więc szyna i uchwyty stoją
   * w x chwytu: Smith jak Barbell Shrug Behind The Back (gryf za udami), maszyna dźwigniowa jak hantle (uchwyty po bokach ud). */
  const behind = { theta: -14, phi: 0, pl: -1 }; const xBehind = -15.8; /* x chwytu zwisu za udami (theta −14°, poza Barbell Shrug Behind The Back) */
  G['Smith Machine Behind the Back Shrug'] = () => zwis('Smith Machine Behind the Back Shrug', { ...behind, sprzet: [{ rodzaj: 'smith', x: xBehind, h: 200 }, SPRZET.sztanga()] });
  const side = { theta: 8, phi: 90, obrot: 0 }; const gBok = [0, 76.2, 28.2]; /* chwyt zwisu bokiem (theta 8°, phi 90°, poza Shrugs (hantle)) */
  const masz = (cw) => zwis(cw, { ...side, sprzet: [{ rodzaj: 'dzwignia', tryb: 'prosta', x: gBok[0], y: Math.round((gBok[1] - 4) * 10) / 10, z: gBok[2], kat: 90, dlugosc: 20, punkt: 'dlonie', trzyma: 'R' }] });
  G['Leverage Shrug'] = () => masz('Leverage Shrug');
  G['Calf-Machine Shoulder Shrug'] = () => masz('Calf-Machine Shoulder Shrug');
  G['Middle Back Shrug'] = () => sciaganieLopatek('Middle Back Shrug', { sprzet: [SPRZET.hantle()] });
  return G;
}
