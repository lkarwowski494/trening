// Generator póz rodziny cable_press po stronie agenta (26.10.2026): wyciskanie na linkach — stojąc, jednorącz, siedząc (oparcie 85°) i na ławce skośnej (kolumny z dołu).
// Dłonie od klatki (łokieć ≥ 70°) do wyprostu przed sobą (łokieć ≤ 25°), tułów nieruchomy (pochylenie ±8°, miednica ≤ 4 cm); na ławce skośnej pośladki i plecy przy ławce.
// Błąd bp.mis.arch (ławka skośna): łuk lędźwi (zgięcie kręgosłupa do −30°) i oderwanie pośladków (miednica +4 cm); łokcie jak w poprawnej. Jednorącz i tempo (mis.jerk) bez błędu.
import { v2, BODY, R, r1, lerp, Y_STOJ, SPRZET, poza, nogiStoj, noga3, bark, naLawce, buduj, wyc, U9 } from './gora.mjs';

export const RODZINA = 'cable_press';
const POL = (s) => (s === 'R' ? 1 : -1);
const SIDES = ['R', 'L'];
const wTulowiu = (S, p, a, b) => { const n = [Math.cos(p * R), -Math.sin(p * R)], t = [Math.sin(p * R), Math.cos(p * R)]; return [S[0] + a * n[0] + b * t[0], S[1] + a * n[1] + b * t[1]]; };
const WOLNA = (S, sg) => ({ g: [S[0] + 2, S[1] - 40, sg * 22], pole: [0.2, -1, sg * 0.3] });

/** Wyciskanie: tułów nieruchomy (T = { m, p, nogi }), dłonie od [a0, b0] do [a1, b1] w układzie tułowia (a = do przodu od klatki, b = wzdłuż tułowia), |z| = zr; opcjonalnie błąd łuku (arch). */
function wyciskanie(cw, o) {
  const T = o.T; const zr = o.zr ?? 28;
  const fr = (u, zle) => { const f = zle ? u : 0; const bend = -30 * f; const m = [T.m[0], T.m[1] + 4 * f]; const rece = {};
    for (const s of SIDES) { const sg = POL(s); const S = bark(m, T.p, sg, { bend });
      if (o.jedna && o.jedna !== s) { rece[s] = WOLNA(S, sg); continue; }
      const a = lerp(o.h0?.[0] ?? 14, o.h1?.[0] ?? 62.4, u); const b = lerp(o.h0?.[1] ?? -9, o.h1?.[1] ?? -2, u); const h = wTulowiu(S, T.p, a, b);
      const t = [Math.sin(T.p * R), Math.cos(T.p * R)]; const fl = o.flare ?? 0.6; const pv = [-t[0], -t[1], sg * fl]; rece[s] = { g: [h[0], h[1], sg * zr], pole: pv.map((c) => r1(c)), obrot: 0 }; }
    return poza({ u, tulow: { m, p: T.p, bend, glowa: T.p }, nogi: T.nogi, rece }); };
  const sprz = o.jedna ? o.sprzet.map((g) => (g.rodzaj === 'wyciag' ? { ...g, trzyma: o.jedna } : g)) : o.sprzet;
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-130, 130), ...(o.dod ?? []), ...sprz], fr, us: o.us ?? U9, blad: o.blad ? { cue: 'bp.mis.arch', postawa: true, znacznik: 'back' } : undefined });
}
const stoi = () => ({ m: [0, Y_STOJ], p: 0, nogi: nogiStoj(0, 14) });
function siedz(kat, top = 45) { const B = naLawce(kat, top, { zr: 24 }); return { T: { m: B.m, p: B.p, nogi: B.nogi }, lawka: { rodzaj: 'lawka', x: 0, top, kat, dlugosc: 75, siedzisko: 40 } }; }

export const WYJATKI = {};
export const PRZYBLIZENIA = {};

export function generuj() {
  const G = {};
  G['Wyciskanie na linkach (stojąc)'] = () => wyciskanie('Wyciskanie na linkach (stojąc)', { T: stoi(), sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: -45, y: 160, z: 75, h: 200 })] });
  G['Single Arm Cable Chest Press'] = () => wyciskanie('Single Arm Cable Chest Press', { T: stoi(), jedna: 'R', zr: 24, h0: [16, -9], h1: [63, -2], sprzet: [wyc({ chwyt: 'uchwyt', x: -45, y: 130, z: 75, h: 200 })] });
  const sd = siedz(85, 45);
  G['Seated Cable Chest Press'] = () => wyciskanie('Seated Cable Chest Press', { T: sd.T, dod: [sd.lawka], sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: -70, y: 130, z: 75, h: 200 })] });
  const inc = siedz(55, 43);
  G['Incline Cable Chest Press'] = () => wyciskanie('Incline Cable Chest Press', { T: inc.T, dod: [inc.lawka], blad: true, sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: -90, y: 15, z: 105, h: 100 })] });
  return G;
}
