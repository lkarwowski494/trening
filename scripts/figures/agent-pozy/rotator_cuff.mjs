// Generator póz rodziny rotator_cuff po stronie agenta (26.10.2026): rotacje zewnętrzne i wewnętrzne barku (łokieć przy boku zgięty 90°, przedramię obraca się wokół pionowego ramienia), przeciąganie gumy.
// Rotacja: ramię pionowo przy tułowiu (łokieć nieruchomy względem barku), przedramię poziomo, kierunek przedramienia (kąt alfa od przodu: + na zewnątrz) przechodzi od ukośnie do środka do ukośnie na zewnątrz.
// Błąd rot.mis.elbowAway: łokieć odchodzi od tułowia (ramię odwodzone do 35°) wraz z przedramieniem.
import { lezyPrzodem } from './gora.mjs';
import { poza as pozaD, PODLOGA } from './dol.mjs';
import { bokKlatka, bokSonda, bokDolnaReka, bokNogiUlozone } from './mob.mjs';
import { v2, BODY, R, r1, lerp, Y_STOJ, SPRZET, poza, nogiStoj, buduj, rekaProsta, wolna, wyc, U9, U12 } from './gora.mjs';

export const RODZINA = 'rotator_cuff';
const POL = (s) => (s === 'R' ? 1 : -1);
const U5 = [0, 0.25, 0.5, 0.75, 1];
const WOLNA = () => ({ f1: 3, a1: 6, f2: 4, zG: 22, obrot: 0 });

/** Obrót wektora wokół osi x o −delta (ramię R odchodzi na zewnątrz o delta). */
const odwiedz = (v, deltaDeg) => { const d = deltaDeg * R; return [v[0], v[1] * Math.cos(d) + v[2] * Math.sin(d), -v[1] * Math.sin(d) + v[2] * Math.cos(d)]; };

/** Rotacja barku jedną ręką (R), łokieć zgięty 90°. a0 → a1: kąt przedramienia (stopnie od przodu, + na zewnątrz); zle: ramię odwodzone do delta stopni (błąd). */
function rotacja(cw, o) {
  const fr = (u, zle) => {
    const al = lerp(o.a[0], o.a[1], u) * R; const del = zle ? lerp(0, o.zle ?? 35, u) : 0;
    const d1 = odwiedz([0, -1, 0.04], del); const d2 = odwiedz([Math.cos(al), 0, Math.sin(al)], del);
    const R_ = { d1, d2, obrot: o.obrot ?? 0 };
    return poza({ u, tulow: { m: [0, Y_STOJ], p: 0 }, nogi: nogiStoj(0, 14), rece: { R: R_, L: o.obie ? R_ : WOLNA() } });
  };
  const sprz = o.sprzet.map((g) => (['hantel', 'wyciag'].includes(g.rodzaj) && !o.obie ? { ...g, trzyma: 'R' } : g));
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-80, 130), ...sprz], fr, us: U5, blad: o.blad ? { cue: 'rot.mis.elbowAway', postawa: false, znacznik: 'bar' } : undefined });
}


const nrm3 = (v) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };
/** Rotacja zewnętrzna z hantlem LEŻĄC NA BOKU (LEWY bok na podłodze, jak w clamshell i w rozciąganiu na boku: mob.mjs BOK; górna ręka R pracuje): łokieć zgięty 90° przy tułowiu, przedramię z poziomu (w poprzek brzucha, ku przodowi ciała = −z) unosi się do pionu
 * — rotacja przeciw grawitacji (hantel w płaszczyźnie poziomej na stojąco nie stawia oporu rotatorom; recenzja ruchu 27.10.2026). Wskazówki rotCuff: łokieć przy boku (rot.elbow), powoli (rot.slow). Backlog figur 28.10.2026: ciało leży na podłodze (R9; poprzednia poza wisiała 4–8 cm nad nią, głowa bez podparcia). */
function rotacjaLezac(cw) {
  const b = BODY(); const T = bokSonda(); const Sr = T.sh.R; const gam = -12 * R; const L2 = b.farm + b.hand;
  const E = [Sr[0] + b.uarm * Math.cos(gam), Sr[1] + b.uarm * Math.sin(gam), Sr[2]];
  const fr = (u) => { const beta = lerp(12, 88, u) * R; const H = [E[0], E[1] + L2 * Math.sin(beta), E[2] - L2 * Math.cos(beta)];
    const mid = Sr.map((v, i) => (v + H[i]) / 2); const pol = nrm3(E.map((v, i) => v - mid[i])).map((v) => r1(v * 100) / 100);
    return bokKlatka(u, bokNogiUlozone(T), { L: bokDolnaReka(T), R: { g: H.map(r1), pole: pol } }); };
  return pozaD(RODZINA, cw, [PODLOGA(-130, 130), { ...SPRZET.hantle(), trzyma: 'R' }], [0, 0.25, 0.5, 0.75, 1].map(fr), []);
}

/** Odwodzenie ramion (reverse fly) leżąc przodem na ławce skośnej: ramiona od zwisu do poziomu w bok, łokieć stały lekko zgięty, rotacja zewnętrzna przedramienia rośnie w górę ruchu. */
function reverseFlyER(cw, o) {
  const L = lezyPrzodem(45, { dl: 38, zr: 16, kolDx: 52, pole: [1, 0.2, 0] }); const reach = 61;
  const fr = (u) => { const al = (10 + 80 * u) * R; const rece = {}; for (const sd of ['R', 'L']) { const sw = -POL(sd); const S = L.S(sd);
      rece[sd] = { g: [S[0], S[1] - reach * Math.cos(al), sw * (19 + reach * Math.sin(al))], pole: [0.3, -1, 0], obrot: -60 * u }; }
    return poza({ u, tulow: { m: L.m, p: L.p, glowa: L.p, ext: L.ext }, nogi: L.nogi, rece }); };
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-110, 130), L.lawka, ...o.sprzet], fr, us: U9 });
}

export const WYJATKI = {
  'Cuban Press': 'OTWARTE — brak źródła ruchu (zestaw „open”; figury-sens.json → rotator_cuff.otwarte); wstrzymane do czasu źródła',
};
export const PRZYBLIZENIA = {
  'External Rotation (hantel)': 'przybliżenie: leżenie na lewym boku jak w Clamshell (obrót tułowia −75°, nie −90°: dolny bark nie wchodzi pod podłogę; tułów odchylony do tyłu o 15°, widoczne w widoku z przodu), ręka robocza R górna z hantlem, łokieć 90° przy tułowiu; dolna ręka pod głową; stopy ułożone jedna na drugiej, palcami w stronę kolan',
  'Cable Internal Rotation': 'przybliżenie: wyciąg po stronie roboczej (zewnętrznej), dłoń rusza do środka; druga ręka zwisa przy boku',
  'External Rotation (linki)': 'przybliżenie: wyciąg po przeciwnej stronie, linka przechodzi przed brzuchem; druga ręka zwisa',
};

export function generuj() {
  const G = {};
  const E_ = [-32, 58]; /* rotacja zewnętrzna: przedramię od ukośnie do środka do ukośnie na zewnątrz */
  G['External Rotation (hantel)'] = () => rotacjaLezac('External Rotation (hantel)');
  G['External Rotation (linki)'] = () => rotacja('External Rotation (linki)', { a: E_, sprzet: [wyc({ chwyt: 'uchwyt', x: 36, y: 100, z: -75 })], blad: true });
  G['External Rotation with Band'] = () => rotacja('External Rotation with Band', { a: E_, sprzet: [{ rodzaj: 'guma', mocowanie: 'zaczep', x: 36, y: 100, z: -75 }], blad: true });
  G['Internal Rotation with Band'] = () => rotacja('Internal Rotation with Band', { a: [58, -32], sprzet: [{ rodzaj: 'guma', mocowanie: 'zaczep', x: 36, y: 100, z: 90 }], blad: true });
  G['Cable Internal Rotation'] = () => rotacja('Cable Internal Rotation', { a: [58, -32], sprzet: [wyc({ chwyt: 'uchwyt', x: 36, y: 100, z: 90 })], blad: true });
  /* przeciąganie gumy: ręce wyprostowane przed sobą na wysokości barków, rozchodzą się na boki */
  G['Band Pull Apart'] = () => { const fr = (u) => { const sp = rekaProsta(90, lerp(8, 100, u), { flex: 14, ku: [0, -1, 0] }); return poza({ u, tulow: { m: [0, Y_STOJ], p: 0 }, nogi: nogiStoj(0, 14), rece: { R: sp, L: sp } }); };
    return buduj({ rodzina: RODZINA, cw: 'Band Pull Apart', sprzet: [SPRZET.podloga(-80, 130), { rodzaj: 'guma', mocowanie: 'dlonie' }], fr, us: U12 }); };
  G['Reverse Flyes With External Rotation'] = () => reverseFlyER('Reverse Flyes With External Rotation', { sprzet: [SPRZET.hantle()] });
  return G;
}
export const WYJATKI_OPISU = { 'rot.mis.elbowAway': 'wskazówka „łokieć odchodzi od tułowia” ma wpis w cue-sets.json bez tekstu w lib/cues/text/*.json; błąd nie jest rysowany do czasu tekstu (badacz pisze, tłumacz przekłada)' };
