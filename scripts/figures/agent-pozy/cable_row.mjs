// Generator póz rodziny cable_row po stronie agenta (26.10.2026): wiosłowanie siedząc i stojąc na wyciągu, maszyny do wiosłowania (dźwignia obrotowa), face pull.
// Tułów stoi pionowo i nie rusza się (tulow_stabilny), plecy neutralne; łokcie z prawie prostych (≤ 20°) do ≥ 70° i za linią barku (≥ 5 cm). Błędów rysowanych brak (jedyny błąd katalogu to szarpanie = tempo).
import { v2, BODY, R, r1, lerp, Y_STOJ, SPRZET, poza, nogiStoj, noga3, bark, buduj, wyc, U9 } from './gora.mjs';

export const RODZINA = 'cable_row';
const POL = (s) => (s === 'R' ? 1 : -1);
const U5 = [0, 0.25, 0.5, 0.75, 1];
const SIDES = ['R', 'L'];
const WOLNA_BIODRO = (S, sg) => ({ g: [S[0] + 6, S[1] - 45, sg * 24], pole: [0.2, -1, sg * 0.4] });

/** Siedzenie na ławce (top 43): miednica x = 12, tułów pionowo, stopy na podłodze, kolana 90°. */
function siedz() { const m = [12, 43 + 9.5 + 0.3]; return { m, nogi: { R: noga3([54, 7, 20], [1, 0.3, 0.1]), L: noga3([54, 7, -20], [1, 0.3, -0.1]) } }; }
/** Ręce w ruchu wiosłowania: H0 (wyprost, 63 cm od barku) → H1 (dłonie przy brzuchu/klatce), biegun łokcia za plecy. o: { zr, dy0, x1, dy1, pole, obrot, jedna }. */
function rece(S0, o) {
  return (u) => { const out = {}; for (const s of SIDES) { const sg = POL(s); const S = [S0[0], S0[1], sg * 19]; const pracuje = !o.jedna || o.jedna === s;
    if (!pracuje) { out[s] = WOLNA_BIODRO(S, sg); continue; }
    const dz = (o.zr ?? 11) - 19; const dy0 = o.dy0 ?? -3; const dx0 = Math.sqrt(Math.max(1, (o.reach ?? 63.1) ** 2 - dy0 * dy0 - dz * dz));
    const g = [lerp(S[0] + dx0, S[0] + (o.x1 ?? 14), u), lerp(S[1] + dy0, S[1] + (o.dy1 ?? -38), u), sg * (o.zr ?? 11)];
    out[s] = { g, pole: (o.pole ?? [-1, 0.2, 0.4]).map((x, i) => (i === 2 ? x * sg : x)), obrot: o.obrot ?? 0 }; } return out; };
}

function cw_(cw, o) {
  const T = o.tulow ?? { m: [0, Y_STOJ], p: 0 }; const S0 = bark(T.m, T.p ?? 0, 1);
  const fr = (u) => poza({ u, tulow: { m: T.m, p: T.p ?? 0, glowa: 0 }, nogi: T.nogi ?? nogiStoj(0, 14), rece: rece(S0, o.ruch)(u) });
  const sprz = o.sprzet.map((g) => (o.ruch.jedna && ['hantel', 'wyciag'].includes(g.rodzaj) ? { ...g, trzyma: o.ruch.jedna } : g));
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-60, 160), ...(o.dodatki ?? []), ...sprz], fr, us: o.us ?? U5 });
}

/** Maszyna z dźwignią obrotową: dłonie (średnia R i L) poruszają się po łuku o środku w osi dźwigni; oś na dwusiecznej odcinka H0–H1 w odległości r od H0 (po stronie przed osobą). */
function maszyna(cw, o) {
  const T = siedz(); const S0 = bark(T.m, 0, 1);
  const H0 = [S0[0] + o.h0[0], S0[1] + o.h0[1]], H1 = [S0[0] + o.h1[0], S0[1] + o.h1[1]]; const mid = [(H0[0] + H1[0]) / 2, (H0[1] + H1[1]) / 2]; const dx = H1[0] - H0[0], dy = H1[1] - H0[1]; const l = Math.hypot(dx, dy);
  const half = l / 2; const hh = Math.sqrt(Math.max(0, o.r * o.r - half * half)); const n = [-dy / l, dx / l]; const kandydaci = [[mid[0] + n[0] * hh, mid[1] + n[1] * hh], [mid[0] - n[0] * hh, mid[1] - n[1] * hh]];
  const P = kandydaci.sort((a, b) => b[0] - a[0])[0]; const a0 = Math.atan2(H0[1] - P[1], H0[0] - P[0]); let a1 = Math.atan2(H1[1] - P[1], H1[0] - P[0]); if (Math.abs(a1 - a0) > Math.PI) a1 += a1 < a0 ? 2 * Math.PI : -2 * Math.PI;
  const fr = (u) => { const a = lerp(a0, a1, u); const c = [P[0] + o.r * Math.cos(a), P[1] + o.r * Math.sin(a)]; const rr = {}; for (const s of SIDES) { const sg = POL(s); rr[s] = { g: [c[0], c[1], sg * (o.zr ?? 12)], pole: [-1, 0.2, 0.4 * sg].map((x, i) => x), obrot: 0 }; }
    return poza({ u, tulow: { m: T.m, p: 0, glowa: 0 }, nogi: T.nogi, rece: rr }); };
  const lever = { rodzaj: 'dzwignia', tryb: 'obrot', x: r1(P[0]), y: r1(P[1]), z: 0, dlugosc: r1(o.r), punkt: 'dlonie', trzyma: 'obie' };
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-60, 160), { rodzaj: 'lawka', x: 0, top: 43, kat: 80, dlugosc: 60, siedzisko: 38 }, lever], fr, us: U9 });
}

export const WYJATKI = {
  'Sled Row': 'OTWARTE — brak źródła ruchu (brak wskazówek, zestaw „open”; sanie; figury-sens.json → cable_row.otwarte); wstrzymane do czasu źródła',
  'Kneeling High Pulley Row': 'klęk: goleń leży poziomo, a stopa ma palce skierowane do tyłu — model stopy w kontrakcie nie ma palców skierowanych do tyłu (kąt kostki poza zakresem −60…37°); klęk bez wsparcia stopy na podłodze nie da się narysować',
};
export const PRZYBLIZENIA = {
  'Machine Row': 'przybliżenie: dźwignia obrotowa jako schemat (oś przed osobą, dłonie na łuku), bez poduszki piersiowej; siedzisko jako ławka',
  'Leverage High Row': 'przybliżenie: dźwignia obrotowa jako schemat (uchwyty wysoko, ruch w dół i do tyłu), bez poduszki piersiowej',
};

export function generuj() {
  const G = {};
  const T = siedz();
  const sedz = (cw, o) => cw_(cw, { tulow: { m: T.m, p: 0, nogi: T.nogi }, ...o });
  G['Seated Cable Row'] = () => sedz('Seated Cable Row', { sprzet: [wyc({ chwyt: 'drazek', x: 132, y: 55 })], ruch: { zr: 11, obrot: 0 } });
  G['Wiosłowanie na linkach (siedząc)'] = () => sedz('Wiosłowanie na linkach (siedząc)', { sprzet: [wyc({ chwyt: 'uchwyt', x: 132, y: 55 })], ruch: { zr: 12, obrot: 0 } });
  G['Cable Rope Rear-Delt Rows'] = () => sedz('Cable Rope Rear-Delt Rows', { sprzet: [wyc({ chwyt: 'lina', x: 132, y: 55 })], ruch: { zr: 33, dy0: 4, dy1: -2, x1: 14, pole: [-1.3, 0, 1], obrot: 0 } });
  G['Standing Cable Row'] = () => cw_('Standing Cable Row', { sprzet: [wyc({ chwyt: 'drazek', x: 120, y: 100 })], ruch: { zr: 11, dy0: -3, obrot: 0 } });
  G['Single Arm Cable Row'] = () => cw_('Single Arm Cable Row', { sprzet: [wyc({ chwyt: 'uchwyt', x: 120, y: 100, trzyma: 'R' })], ruch: { zr: 20, dy0: -3, jedna: 'R', obrot: 0 } });
  G['Face Pull'] = () => cw_('Face Pull', { sprzet: [wyc({ chwyt: 'lina', x: 110, y: 150 })], ruch: { zr: 31, dy0: 8, dy1: 8, x1: 12, pole: [-1.3, 0, 1], obrot: 0 } });
  G['Machine Row'] = () => maszyna('Machine Row', { h0: [63.2, -2.5], h1: [12, -28], r: 70, zr: 19 });
  G['Leverage High Row'] = () => maszyna('Leverage High Row', { h0: [62, 13], h1: [16, -22], r: 70, zr: 19 });
  return G;
}
