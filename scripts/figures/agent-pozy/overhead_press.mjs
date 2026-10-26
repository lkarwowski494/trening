// Generator póz rodziny overhead_press po stronie agenta (26.10.2026): wyciskanie nad głowę (sztanga, hantle, kettlebell, guma, wyciągi; stojąc i siedząc), zza karku, push press, Arnold, see-saw, landmine, pompka w pozycji pike.
// Wyciskanie: dłonie od barków (≤ 20 cm nad barkiem, łokieć pod dłonią ≤ 10 cm) do wyprostu nad głową (łokieć ≤ 20°, dłoń ≥ 10 cm nad głową i ≤ 10 cm przed/za barkiem), tułów −15…10° od pionu.
// Push press: krótkie ugięcie kolan (15–60°) z tułowiem −15…20°, nogi pracują. Landmine: gryf sztywny wokół osi przy podłodze, łokieć ≥ 70° i ≤ 20° w ruchu.
// Błąd katalogu push.mis.partial (pike): płytki ruch. ohp.mis.lock i mis.jerk to cechy tempa, nie pozy (bledy: []).
import { dChwytu } from './model.mjs';
import { v2, BODY, R, r1, lerp, Y_STOJ, SPRZET, poza, nogiStoj, noga3, bark, naLawce, buduj, wyc, U9, U12 } from './gora.mjs';

export const RODZINA = 'overhead_press';
const POL = (s) => (s === 'R' ? 1 : -1);
const SIDES = ['R', 'L'];
const sm = (t) => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c); };
const WOLNA = (S, sg) => ({ g: [S[0] + 3, S[1] - 46, sg * 23], pole: [0.2, -1, sg * 0.3] });
const sprzJ = (sprzet, s) => sprzet.map((g) => (s && ['hantel', 'wyciag', 'kettlebell'].includes(g.rodzaj) ? { ...g, trzyma: s } : g));

/** Wyciskanie nad głowę. o: { zr (|z| chwytu), x0/dy0 (dłoń na dole względem barku), xTop, reach, pole, obrot (u → °), T (tułów {m,p,nogi,bend}), dod (sprzęt dodatkowy), sprzet, jedna ('R'/'L'), alt (see-saw), nad (przed głową: ruch x), us }. */
function wyciskanie(cw, o) {
  const T = o.T ?? { m: [0, Y_STOJ], p: 0, nogi: nogiStoj(0, 14) };
  const fr = (u) => {
    const tu = o.tulowu ? o.tulowu(u) : {}; const m = tu.m ?? T.m; const p = tu.p ?? T.p ?? 0; const nogi = tu.nogi ?? T.nogi; const rece = {};
    for (const s of SIDES) { const sg = POL(s); const S = bark(m, p, sg); const prac = !o.jedna || o.jedna === s;
      if (!prac) { rece[s] = o.wolna ? o.wolna(S, sg) : WOLNA(S, sg); continue; }
      const e0 = o.alt && s === 'L' ? 1 - u : u; const e = o.rytm ? o.rytm(e0) : e0; const dz = (o.zr ?? 26) - 19;
      const yTop = Math.sqrt(Math.max(1, (o.reach ?? 63.4) ** 2 - (o.xTop ?? -2) ** 2 - dz * dz));
      const yy = lerp(o.dy0 ?? 14, yTop, e); const hy = S[1] + yy; const hx = S[0] + lerp(o.x0 ?? 22, o.xTop ?? 6, sm((yy - (o.ys ?? 48)) / (yTop - (o.ys ?? 45))));
      const ob = typeof o.obrot === 'function' ? o.obrot(e) : o.obrot ?? 0; const gz = sg * (o.zr ?? 26);
      /* biegun łokcia: punkt pod chwytem (przedramię pionowo) — łokieć pod dłonią (ohp.elbowsUnder) */
      const pv = o.pole ? [o.pole[0], o.pole[1], o.pole[2] * sg] : [hx - S[0] + (o.pdx ?? 0), hy - 33 - S[1], gz - sg * 19 + sg * (o.pdz ?? 0)]; const pl = Math.hypot(...pv) || 1; const pole = pv.map((c) => r1(c / pl * 3) );
      rece[s] = { g: [hx, hy, gz], pole, obrot: ob }; }
    return poza({ u, tulow: { m, p, glowa: tu.glowa ?? p, bend: 0 }, nogi, rece }); };
  const sprz = o.jedna ? sprzJ(o.sprzet, o.jedna) : o.sprzet;
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-110, 130), ...(o.dod ?? []), ...sprz], fr, us: o.us ?? U9 });
}
/** Siedząc na ławce (kat oparcia) — tułów wg oparcia. */
function siedzac(kat = 85, top = 45) { const B = naLawce(kat, top, { zr: 24 }); return { T: { m: B.m, p: B.p, nogi: B.nogi }, lawka: { rodzaj: 'lawka', x: 0, top, kat, dlugosc: 75, siedzisko: 40 } }; }


/** Landmine: gryf sztywny o długości L wokół osi P przy podłodze (przed osobą); dłonie (jedna lub obie, |z| = zh) na łuku od klatki do wyprostu przed sobą i w górę.
 * o: { jedna, zh, dip (głębokość ugięcia nóg na dole, cm), lean (pochylenie tułowia na dole, °), el1 (docelowe zgięcie łokcia na górze nie jest wpisywane — wynika z zasięgu) }. */
function landmine(cw, o) {
  const L = 200; const zh = o.zh ?? (o.jedna ? 12 : 6); const dz = zh - 19; const reach = o.reach ?? 63.4; const rIn = Math.sqrt(reach * reach - dz * dz);
  const S0 = bark([0, Y_STOJ], 0, 1); const H0x = S0[0] + (o.h0x ?? 16); const H0y = S0[1] + (o.h0y ?? -6);
  /* oś P: dłoń na dole H0 leży na sferze; wyznacz γ1 tak, by dłoń na górze miała odległość rIn od barku */
  const Py = 5; const g0 = Math.asin((H0y - Py) / L); const Px = H0x + L * Math.cos(g0); let lo = g0, hi = 1.45;
  const H1 = (g) => [Px - L * Math.cos(g), Py + L * Math.sin(g)]; const dist = (g) => { const h = H1(g); return Math.hypot(h[0] - S0[0], h[1] - S0[1]); };
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (dist(mid) < rIn) lo = mid; else hi = mid; } const g1 = (lo + hi) / 2;
  const dip = o.dip ?? 0; const lean = o.lean ?? 0;
  const nog = nogiStoj(o.stopaX ?? 0, 16);
  const fr = (u) => { const g = lerp(g0, g1, u); const h = H1(g); const k = o.dip ? Math.max(0, 1 - u / (o.dipDo ?? 0.55)) : 0; const m = [-0.3 * dip * k, Y_STOJ - dip * k]; const p = lean * k;
    const rece = {}; for (const s of SIDES) { const sg = POL(s); const S = bark(m, p, sg);
      if (o.jedna && o.jedna !== s) { rece[s] = WOLNA(S, sg); continue; }
      const gz = sg * zh; const pv = [h[0] - S[0], h[1] - 33 - S[1], gz - sg * 19]; const pl = Math.hypot(...pv) || 1; rece[s] = { g: [h[0], h[1], gz], pole: pv.map((c) => r1(c / pl * 3)), obrot: 0 }; }
    return poza({ u, tulow: { m, p, glowa: p, bend: 0 }, nogi: nog, rece }); };
  const lm = { rodzaj: 'landmine', x: r1(Px), y: Py, z: 0, dlugosc: L, trzyma: o.jedna ?? 'obie' };
  const sz = SPRZET.sztanga({ dlugosc: 20, talerze: false, ...(o.jedna ? { trzyma: o.jedna } : {}) });
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-110, 300), lm, sz], fr, us: o.us ?? U12 });
}

/** Push press: ugięcie kolan (dip) przy dłoniach przy barkach, potem wyprost nóg i wyciskanie. */
function pushPress(cw, o) {
  const dip = o.dip ?? 9; const lean = o.lean ?? 10;
  const tulowu = (u) => { const d = u < 0.12 ? sm(u / 0.12) : u < 0.34 ? 1 - sm((u - 0.12) / 0.22) : 0; return { m: [-0.5 * dip * d, Y_STOJ - dip * d], p: lean * d, glowa: lean * d }; };
  const rytm = (u) => (u < 0.2 ? 0 : sm((u - 0.2) / 0.8));
  return wyciskanie(cw, { ...o, tulowu, rytm, us: o.us ?? [0, 0.06, 0.12, 0.18, 0.24, 0.3, 0.38, 0.48, 0.6, 0.72, 0.85, 1] });
}


/** Pike push-up: stopy płasko na podłodze (kostka A), nogi proste (80 cm miednica–kostka), dłonie na podłodze w x = hx; łokieć θ(u) wyznacza odległość bark–dłoń, kierunek φ barku względem dłoni; miednica = przecięcie okręgów (A, 80) i (bark, tułów 50), wyżej. */
function pike(cw, o = {}) {
  const A = [0, BODY().ankleH]; const hx = o.hx ?? 66; const hy = 2; const T = BODY().trunk; const Lg = 82.2;
  const thTop = o.thTop ?? 15, thDol = o.thDol ?? 115, thPlytko = o.thPlytko ?? 68; const phiTop = o.phiTop ?? 100, phiDol = o.phiDol ?? 90;
  const fr = (u, zle) => { const th = lerp(thTop, zle ? thPlytko : thDol, u); const phi = lerp(phiTop, zle ? lerp(phiTop, phiDol, 0.95) : phiDol, u);
    const d = Math.sqrt(Math.max(1, dChwytu(th) ** 2)); const S = [hx + d * Math.cos(phi * R), hy + d * Math.sin(phi * R)];
    const dx = S[0] - A[0], dy = S[1] - A[1]; const D = Math.hypot(dx, dy); const a = (Lg * Lg - T * T + D * D) / (2 * D); const h = Math.sqrt(Math.max(0, Lg * Lg - a * a));
    const c = [A[0] + a * dx / D, A[1] + a * dy / D]; const c1 = [c[0] - h * dy / D, c[1] + h * dx / D], c2 = [c[0] + h * dy / D, c[1] - h * dx / D]; const P = c1[1] > c2[1] ? c1 : c2;
    const p = Math.atan2(S[0] - P[0], S[1] - P[1]) / R; const rece = {}; for (const sd of SIDES) { const sg = POL(sd); rece[sd] = { g: [hx, hy, sg * 19], pole: [-1, -0.3, 0.9 * sg], obrot: 0 }; }
    const nog = (sd) => ({ k: [0, A[1] + (o.heel ?? 0), POL(sd) * 10], pod: o.pod ?? 0, rot: 0, pole: [1, 0.2, POL(sd) * 0.1] });
    return poza({ u, tulow: { m: [r1(P[0]), r1(P[1])], p, glowa: p * 0.95 }, nogi: { R: nog('R'), L: nog('L') }, rece }); };
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-60, 200)], fr, us: o.us ?? U9, blad: { cue: 'push.mis.partial', postawa: false, znacznik: 'pelvis' } });
}

export const WYJATKI = {
  'Bradford Press': 'OTWARTE — brak źródła ruchu (brak wskazówek, zestaw „open”; figury-sens.json → overhead_press.otwarte); wstrzymane do czasu źródła',
  'Handstand Push Up': 'OTWARTE — brak źródła ruchu (brak wskazówek, zestaw „open”, nie badane; figury-sens.json → overhead_press.otwarte); wstrzymane do czasu źródła',
};
export const PRZYBLIZENIA = {};

export function generuj() {
  const G = {}; const B = SPRZET.sztanga(); const H = SPRZET.hantle(); const KB = (x = {}) => ({ rodzaj: 'kettlebell', dzwon: 'tyl', ...x });
  const RACK = { rodzaj: 'slupek', x: -45, h: 210, hak: 140 };
  G['Overhead Press (sztanga)'] = () => wyciskanie('Overhead Press (sztanga)', { sprzet: [B] });
  G['Overhead Press (hantle)'] = () => wyciskanie('Overhead Press (hantle)', { sprzet: [H] });
  G['Band Shoulder Press'] = () => wyciskanie('Band Shoulder Press', { sprzet: [{ rodzaj: 'guma', mocowanie: 'stopy', trzyma: 'obie' }] });
  G['Double Kettlebell Press'] = () => wyciskanie('Double Kettlebell Press', { sprzet: [KB({ trzyma: 'R' }), KB({ trzyma: 'L' })] });
  G['Kettlebell Press'] = () => wyciskanie('Kettlebell Press', { sprzet: [KB()], jedna: 'R' });
  G['Single Arm Overhead Press (hantel)'] = () => wyciskanie('Single Arm Overhead Press (hantel)', { sprzet: [H], jedna: 'R' });
  G['See-Saw Press (Alternating Side Press)'] = () => wyciskanie('See-Saw Press (Alternating Side Press)', { sprzet: [{ ...H, trzyma: 'R' }, { ...H, trzyma: 'L' }], alt: true, us: U12 });
  G['Arnold Press'] = () => wyciskanie('Arnold Press', { sprzet: [H], zr: 24, obrot: (e) => lerp(80, -75, sm(e / 0.7)) });
  G['Kettlebell Arnold Press'] = () => wyciskanie('Kettlebell Arnold Press', { sprzet: [KB()], jedna: 'R', zr: 24, obrot: (e) => lerp(80, -75, sm(e / 0.7)) });
  const sd = siedzac(85, 45);
  G['Seated Shoulder Press (hantle)'] = () => wyciskanie('Seated Shoulder Press (hantle)', { T: sd.T, dod: [sd.lawka], sprzet: [H] });
  G['Kettlebell Seated Press'] = () => wyciskanie('Kettlebell Seated Press', { T: sd.T, dod: [sd.lawka], sprzet: [KB()], jedna: 'R' });
  G['Seated Barbell Military Press'] = () => wyciskanie('Seated Barbell Military Press', { T: sd.T, dod: [sd.lawka, RACK], sprzet: [B] });
  G['Seated Cable Shoulder Press'] = () => wyciskanie('Seated Cable Shoulder Press', { T: sd.T, dod: [sd.lawka], sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: -25, y: 15, z: 90, h: 100 })] });
  G['Wyciskanie nad głowę (linki)'] = () => wyciskanie('Wyciskanie nad głowę (linki)', { sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: -25, y: 15, z: 90, h: 100 })] });
  /* zza karku: chwyt szeroki, sztanga za głową */
  G['Standing Barbell Press Behind Neck'] = () => wyciskanie('Standing Barbell Press Behind Neck', { dod: [RACK], sprzet: [B], zr: 46, x0: -13, dy0: 8, xTop: 8, ys: 40 });
  G['Push Press'] = () => pushPress('Push Press', { sprzet: [B] });
  G['Push Press - Behind the Neck'] = () => pushPress('Push Press - Behind the Neck', { dod: [RACK], sprzet: [B], zr: 46, x0: -13, dy0: 8, xTop: 8, ys: 40 });
  G['Landmine Press'] = () => landmine('Landmine Press', {});
  G['Landmine Linear Jammer'] = () => landmine('Landmine Linear Jammer', { dip: 14, lean: 12 });
  G['Single-Arm Linear Jammer'] = () => landmine('Single-Arm Linear Jammer', { jedna: 'R', dip: 14, lean: 12, h0x: 22, h0y: -4 });
  G['Pike Push Up'] = () => pike('Pike Push Up');
  return G;
}
