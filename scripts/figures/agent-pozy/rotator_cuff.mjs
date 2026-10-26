// Generator póz rodziny rotator_cuff po stronie agenta (26.10.2026): rotacje zewnętrzne i wewnętrzne barku (łokieć przy boku zgięty 90°, przedramię obraca się wokół pionowego ramienia), przeciąganie gumy.
// Rotacja: ramię pionowo przy tułowiu (łokieć nieruchomy względem barku), przedramię poziomo, kierunek przedramienia (kąt alfa od przodu: + na zewnątrz) przechodzi od ukośnie do środka do ukośnie na zewnątrz.
// Błąd rot.mis.elbowAway: łokieć odchodzi od tułowia (ramię odwodzone do 35°) wraz z przedramieniem.
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

export const WYJATKI = {
  'Cuban Press': 'OTWARTE — brak źródła ruchu (zestaw „open”; figury-sens.json → rotator_cuff.otwarte); wstrzymane do czasu źródła',
  'Reverse Flyes With External Rotation': 'ćwiczenie wykonywane leżąc przodem na pochyłej ławce (odwodzenie ramion z rotacją zewnętrzną) — wymaga obrotu tułowia o 180° i nóg poza siedziskiem; poza zakresem kontraktu (jak Spider Curl)',
};
export const PRZYBLIZENIA = {
  'Cable Internal Rotation': 'przybliżenie: wyciąg po stronie roboczej (zewnętrznej), dłoń rusza do środka; druga ręka zwisa przy boku',
  'External Rotation (linki)': 'przybliżenie: wyciąg po przeciwnej stronie, linka przechodzi przed brzuchem; druga ręka zwisa',
};

export function generuj() {
  const G = {};
  const E_ = [-32, 58]; /* rotacja zewnętrzna: przedramię od ukośnie do środka do ukośnie na zewnątrz */
  G['External Rotation (hantel)'] = () => rotacja('External Rotation (hantel)', { a: E_, sprzet: [SPRZET.hantle()], blad: true });
  G['External Rotation (linki)'] = () => rotacja('External Rotation (linki)', { a: E_, sprzet: [wyc({ chwyt: 'uchwyt', x: 36, y: 100, z: -75 })], blad: true });
  G['External Rotation with Band'] = () => rotacja('External Rotation with Band', { a: E_, sprzet: [{ rodzaj: 'guma', mocowanie: 'zaczep', x: 36, y: 100, z: -75 }], blad: true });
  G['Internal Rotation with Band'] = () => rotacja('Internal Rotation with Band', { a: [58, -32], sprzet: [{ rodzaj: 'guma', mocowanie: 'zaczep', x: 36, y: 100, z: 90 }], blad: true });
  G['Cable Internal Rotation'] = () => rotacja('Cable Internal Rotation', { a: [58, -32], sprzet: [wyc({ chwyt: 'uchwyt', x: 36, y: 100, z: 90 })], blad: true });
  /* przeciąganie gumy: ręce wyprostowane przed sobą na wysokości barków, rozchodzą się na boki */
  G['Band Pull Apart'] = () => { const fr = (u) => { const sp = rekaProsta(90, lerp(8, 100, u), { flex: 14, ku: [0, -1, 0] }); return poza({ u, tulow: { m: [0, Y_STOJ], p: 0 }, nogi: nogiStoj(0, 14), rece: { R: sp, L: sp } }); };
    return buduj({ rodzina: RODZINA, cw: 'Band Pull Apart', sprzet: [SPRZET.podloga(-80, 130), { rodzaj: 'guma', mocowanie: 'dlonie' }], fr, us: U12 }); };
  return G;
}
