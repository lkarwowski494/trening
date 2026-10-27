// Generator póz rodziny pulldown po stronie agenta (26.10.2026): ściąganie drążka wyciągu górnego siedząc (szeroko, wąsko, podchwytem, V, jednorącz, dwa wyciągi, zza karku) i ściąganie prostymi rękami stojąc.
// Siedzenie z oparciem (ławka 85°), tułów prawie pionowo (−5°, stały), ręce od wyprostu nad głową (łokieć ≤ 20°) do drążka przy górnej klatce, łokcie w dół (≥ 10 cm pod barkiem).
// Błędów rysowanych brak (w katalogu tylko szarpanie = tempo).
import { v2, BODY, R, r1, lerp, Y_STOJ, SPRZET, poza, nogiStoj, nogiSiedz, noga3, bark, naLawce, buduj, wyc, U9 } from './gora.mjs';

export const RODZINA = 'pulldown';
const POL = (s) => (s === 'R' ? 1 : -1);
const SIDES = ['R', 'L'];
const U5 = [0, 0.25, 0.5, 0.75, 1];

/** Siedzenie bez oparcia (recenzja ruchu 1.1, 27.10.2026, błąd nr 1: drążek za kark kończył w oparciu): siedzisko jako ławka płaska (uproszczenie siedziska maszyny), tułów pionowo nad miednicą, kolana pod kątem prostym. */
function siedzBezOparcia(top = 45) { const m = [12, top + 9.5 + 0.3]; return { m, p: 0, glowa: 0, nogi: nogiSiedz(m, { zr: 24, kolanoDx: 42 }) }; }
/** Siedząc przy wyciągu górnym. o: { zr, obrot, sprzet, x1/dy1 (chwyt na dole względem barku), jedna, bezOparcia (siedzisko bez oparcia, tułów pionowo), glowaU (pochylenie głowy w przód w stopniach jako funkcja u) }. */
function sciaganie(cw, o) {
  const B = o.bezOparcia ? siedzBezOparcia() : naLawce(85, 45, { zr: 24 }); const S0 = bark(B.m, B.p, 1); const px = o.pulleyX ?? S0[0] + 32;
  const fr = (u) => { const rece = {}; for (const s of SIDES) { const sg = POL(s); const S = [S0[0], S0[1], sg * 19]; const dz = (o.zr ?? 34) - 19;
    if (o.jedna && o.jedna !== s) { rece[s] = { g: [S[0] + 14, S[1] - 50, sg * 26], pole: [0.2, -1, 0.3 * sg] }; continue; }
    const dx0 = o.dx0 ?? 10; const dy0 = Math.sqrt(Math.max(1, 63.1 ** 2 - dx0 * dx0 - dz * dz)); const dx1 = o.dx1 ?? 14; const dy1 = o.dy1 ?? -8;
    rece[s] = { g: [lerp(S[0] + dx0, S[0] + dx1, u) + (o.bump ?? 9) * Math.sin(Math.PI * u), lerp(S[1] + dy0, S[1] + dy1, u), sg * (o.zr ?? 34)], pole: [-0.3, -1, 0.8 * sg], obrot: o.obrot ?? -75 }; }
    return poza({ u, tulow: { m: B.m, p: B.p, glowa: B.p + (o.glowaU ? o.glowaU(u) : 0) }, nogi: B.nogi, rece }); };
  const sprz = o.sprzet.map((g) => (o.jedna && ['hantel', 'wyciag'].includes(g.rodzaj) && !g.dwa ? { ...g, trzyma: o.jedna } : g));
  const kol = wyc({ x: px, y: 222, h: 235, ...(o.wyc ?? {}) });
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-60, 140), (o.bezOparcia ? { rodzaj: 'lawka', x: -4, top: 45, kat: 0, dlugosc: 40, siedzisko: 20 } : { rodzaj: 'lawka', x: 0, top: 45, kat: 85, dlugosc: 75, siedzisko: 40 }), ...(o.pominWyc ? [] : [kol]), ...sprz], fr, us: o.us ?? U9 });
}

export const WYJATKI = {};
export const PRZYBLIZENIA = {
  'Lat Pulldown': 'przybliżenie: bez poduszki na uda (kontrakt nie ma takiego sprzętu), siedzisko i oparcie jako ławka 85°',
  'Wide-Grip Pulldown Behind The Neck': 'przybliżenie: bez oparcia za plecami (drążek przechodzi za głową) i bez poduszki na uda; siedzisko jako ławka płaska, tułów pionowo, głowa pochylona w przód w fazie przejścia drążka',
};

export function generuj() {
  const G = {};
  const bar = (x = {}) => ({ chwyt: 'drazek', ...x });
  G['Lat Pulldown'] = () => sciaganie('Lat Pulldown', { zr: 34, sprzet: [], wyc: bar() });
  G['Close-Grip Front Lat Pulldown'] = () => sciaganie('Close-Grip Front Lat Pulldown', { zr: 11, obrot: 0, dx1: 16, dy1: -17, sprzet: [], wyc: bar() });
  G['Underhand Lat Pulldown'] = () => sciaganie('Underhand Lat Pulldown', { zr: 18, obrot: 78, dx1: 16, dy1: -17, sprzet: [], wyc: bar() });
  G['V-Bar Pulldown'] = () => sciaganie('V-Bar Pulldown', { zr: 7, obrot: 0, sprzet: [], wyc: bar() });
  G['Single Arm Lat Pulldown'] = () => sciaganie('Single Arm Lat Pulldown', { zr: 22, obrot: 0, dx1: 16, dy1: -17, jedna: 'R', sprzet: [], wyc: { chwyt: 'uchwyt', trzyma: 'R' } });
  G['Full Range-Of-Motion Lat Pulldown'] = () => sciaganie('Full Range-Of-Motion Lat Pulldown', { zr: 28, obrot: 0, sprzet: [], wyc: { chwyt: 'uchwyt', dwa: true, z: 60, x: 24, y: 222 }, dx1: 14, dy1: -17 });
  G['Wide-Grip Pulldown Behind The Neck'] = () => sciaganie('Wide-Grip Pulldown Behind The Neck', { zr: 42, dx0: -8, dx1: -12, dy1: 4.2, bump: -6, pulleyX: -38, bezOparcia: true, glowaU: (u) => 18 * Math.sin(Math.PI * u), sprzet: [], wyc: bar() });
  /* --- ściąganie prostymi rękami stojąc --- */
  G['Straight Arm Pulldown'] = () => { const p = 15; const m = [0, Y_STOJ]; const S0 = bark(m, p, 1); const zr = 12; const re = Math.sqrt(63.6 ** 2 - (19 - zr) ** 2);
    const fr = (u) => { const th = lerp(135, 15, u) * R; const rece = {}; for (const s of SIDES) { const sg = POL(s); rece[s] = { g: [S0[0] + re * Math.sin(th), S0[1] - re * Math.cos(th), sg * zr], pole: [0, -1, 0.3 * sg], obrot: 0 }; }
      return poza({ u, tulow: { m, p, glowa: p * 0.6 }, nogi: nogiStoj(0, 14), rece }); };
    return buduj({ rodzina: RODZINA, cw: 'Straight Arm Pulldown', sprzet: [SPRZET.podloga(-60, 140), wyc({ chwyt: 'drazek', x: 62, y: 215, h: 235 })], fr, us: U9 }); };
  return G;
}
