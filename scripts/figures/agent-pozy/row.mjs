// Generator póz rodziny row po stronie agenta (26.10.2026): wiosłowanie w pochyleniu (sztanga, hantle, linki, Smith, T-bar), jednorącz (hantel), przodem na ławce (seal row).
// Tułów pochylony w biodrach (40–105°, stały ±10°), plecy neutralne (zgięcie kręgosłupa ≤ 10°), kolana ugięte ≤ 40°; łokcie: z prawie prostych (≤ 20°) do ≥ 70° i za linią tułowia (≥ 5 cm).
// Błąd mis.roundBack: zaokrąglone plecy (zgięcie kręgosłupa narasta do 30°, barki zjeżdżają w dół, ręce poruszają się razem z barkami).
import { v2, BODY, R, r1, lerp, Y_STOJ, SPRZET, poza, noga3, bark, ramieFK, buduj, wyc, naLawce, kier } from './gora.mjs';

export const RODZINA = 'row';
const POL = (s) => (s === 'R' ? 1 : -1);
const U5 = [0, 0.25, 0.5, 0.75, 1];
const SIDES = ['R', 'L'];
const up = (p) => [Math.sin(p * R), Math.cos(p * R)];
const front = (p) => [Math.cos(p * R), -Math.sin(p * R)];

/** Wiosłowanie w pochyleniu. o: { p (pochylenie), m (miednica), zr (|z| chwytu), obrot, sprzet, H0 [dx, dy względem barku], L, F (koniec ruchu: L cm w dół osi tułowia, F cm przed tułowiem), pole (biegun łokcia), jedna, blad, kolana }. */
function pochylony(cw, o) {
  const p = o.p ?? 55; const m = o.m ?? [-38, 76]; const nogiZ = o.nogiZ ?? 17;
  const nog = (s) => noga3([o.stopaX ?? 0, 7, POL(s) * nogiZ], [1, 0.1, POL(s) * 0.05]);
  const fr = (u, zle) => {
    const bend = zle ? lerp(0, o.zleBend ?? 32, u) : 0; const rece = {};
    for (const s of SIDES) { const sg = POL(s); const S = bark(m, p, sg, { bend }); const pracuje = !o.jedna || o.jedna === s;
      if (!pracuje) { rece[s] = o.wolna ? o.wolna(S, sg) : { g: [S[0] + 4, S[1] - 40, sg * 24], pole: [-0.2, -1, sg * 0.3] }; continue; }
      const u1 = up(p), f1 = front(p); const hx = o.xStaly !== undefined ? o.xStaly - S[0] : (o.H0?.[0] ?? 6); const hz = (o.zr ?? 22) - 19; const hy = -Math.sqrt(Math.max(1, (o.reach ?? 63.2) ** 2 - hx * hx - hz * hz)); const H0 = [S[0] + hx, S[1] + (o.H0?.[1] ?? hy)]; const H1 = [S[0] - (o.L ?? 30) * u1[0] + (o.F ?? 12) * f1[0], S[1] - (o.L ?? 30) * u1[1] + (o.F ?? 12) * f1[1]];
      const e = o.rytm ? o.rytm(u) : u; const g = [o.xStaly ?? lerp(H0[0], H1[0], e), lerp(H0[1], H1[1], e), sg * (o.zr ?? 22)];
      rece[s] = { g, pole: (o.pole ?? [-0.6, 0.7, 0.35]).map((x, i) => (i === 2 ? x * sg : x)), obrot: o.obrot };
    }
    return poza({ u, tulow: { m, p, bend, glowa: p * 0.45 + 8 }, nogi: { R: nog('R'), L: nog('L') }, rece });
  };
  const sprz = o.sprzet.map((g) => (o.jedna && ['hantel', 'kettlebell', 'wyciag'].includes(g.rodzaj) ? { ...g, trzyma: o.jedna } : g));
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-110, 130), ...(o.dodatki ?? []), ...sprz], fr, us: o.us ?? U5, blad: o.blad ? { cue: 'mis.roundBack', postawa: false, znacznik: 'back' } : undefined });
}

export const WYJATKI = {
  'Meadows Row': 'wymaga jednocześnie rodzaju „landmine” i „sztanga” (dwie grupy requires katalogu) przy trzymaniu jedną ręką: środek sztangi na podążającym chwycie liczony jest ze średniej obu dłoni, więc wolna dłoń musiałaby podążać za sztangą, a gryf landmine to ten sam pręt — poza zakresem kontraktu',
  'Chest Supported Row': 'leżenie przodem na ławce skośnej (klatka na oparciu rosnącym ku głowie, głowa nad krawędzią) — oparcie ławki w kontrakcie rośnie za osobą (−x), więc potrzebny obrót tułowia o 180° i nóg poza siedziskiem (jak Spider Curl); poza zakresem kontraktu',
  'Lying T-Bar Row': 'klatka na podporze T-bara (leżenie przodem na pochylonej podpórce) — jak Chest Supported Row wymaga obrotu tułowia o 180° albo podpórki rosnącej ku głowie; poza zakresem kontraktu',
};
export const PRZYBLIZENIA = {
  'Seal Row (sztanga)': 'przybliżenie: ławka płaska na wysokości 80 cm (granica kontraktu), osoba leży przodem głową do przodu (+x), stopy obrócone na zewnątrz (model stopy nie ma palców do tyłu), sztanga zwisa pod ławką',
  'T-Bar Row': 'przybliżenie: T-bar jako dźwignia obrotowa z osią przed osobą (schemat; uchwyt na ramieniu dźwigni, bez rysowania talerzy)',
};

export function generuj() {
  const G = {};
  const B = SPRZET.sztanga(); const H = SPRZET.hantle();
  G['Bent Over Row (sztanga)'] = () => pochylony('Bent Over Row (sztanga)', { sprzet: [B], zr: 23, obrot: -75, blad: true });
  G['Bent Over Row (hantle)'] = () => pochylony('Bent Over Row (hantle)', { sprzet: [H], zr: 27, obrot: 0, blad: true });
  G['Reverse Grip Bent Over Row'] = () => pochylony('Reverse Grip Bent Over Row', { sprzet: [B], zr: 18, obrot: 78, F: 13, blad: true });
  G['Barbell Rear Delt Row'] = () => pochylony('Barbell Rear Delt Row', { sprzet: [B], zr: 36, obrot: -75, F: 14, L: 22, pole: [0, 0.4, 1], blad: true });
  G['Pendlay Row'] = () => pochylony('Pendlay Row', { sprzet: [B], p: 80, m: [-34, 77.3], zr: 23, obrot: -75, L: 16, F: 12, blad: true });
  G['Smith Machine Bent Over Row'] = () => pochylony('Smith Machine Bent Over Row', { sprzet: [B], dodatki: [{ rodzaj: 'smith', x: 11, h: 200 }], xStaly: 11, p: 78, m: [-30, 77.3], stopaX: 8, zr: 23, obrot: -75, blad: true }); /* sztanga na prowadnicy porusza się tylko w pionie: barki przed sztangą, nogi za nią */
  G['Bent Over Row (linki)'] = () => pochylony('Bent Over Row (linki)', { sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: 40, y: 15, z: 50 })], zr: 27, obrot: 0, blad: true });
  /* --- jednorącz: druga ręka podpiera się o udo, staggered stance --- */
  G['One Arm Row (hantle)'] = () => { const p = 68; const m = [-22, 77]; const nog = (s) => noga3([s === 'R' ? -10 : 14, 7, POL(s) * 17], [1, 0.1, POL(s) * 0.05]);
    const fr = (u) => { const rece = {}; for (const s of SIDES) { const sg = POL(s); const S = bark(m, p, sg);
      if (s === 'R') { const u1 = up(p), f1 = front(p); const hx = 6, hz = 24 - 19; const hy = -Math.sqrt(63.2 ** 2 - hx * hx - hz * hz); const H0 = [S[0] + hx, S[1] + hy]; const H1 = [S[0] - 32 * u1[0] + 12 * f1[0], S[1] - 32 * u1[1] + 12 * f1[1]];
        rece[s] = { g: [lerp(H0[0], H1[0], u), lerp(H0[1], H1[1], u), 24], pole: [-0.6, 0.7, 0.35], obrot: 0 }; }
      else rece[s] = { g: [S[0] + 18, S[1] - 40, -22], pole: [0.2, -1, -0.3], obrot: 0 }; }
      return poza({ u, tulow: { m, p, glowa: p * 0.45 + 8 }, nogi: { R: nog('R'), L: nog('L') }, rece }); };
    return buduj({ rodzina: RODZINA, cw: 'One Arm Row (hantle)', sprzet: [SPRZET.podloga(-110, 130), { ...H, trzyma: 'R' }], fr, us: U5 }); };
  /* --- T-bar: dźwignia obrotowa z osią za osobą (schemat), uchwyt V między nogami --- */
  G['T-Bar Row'] = () => { const p = 55; const m = [-38, 76]; const P = [-85, 5]; const r = 101.3; const a0 = 21.2, a1 = 46;
    const nog = (s) => noga3([0, 7, POL(s) * 17], [1, 0.1, POL(s) * 0.05]);
    const fr = (u, zle) => { const bend = zle ? lerp(0, 32, u) : 0; const rece = {}; const th = lerp(a0, a1, u) * R; const c = [P[0] + r * Math.cos(th), P[1] + r * Math.sin(th)];
      for (const s of SIDES) { const sg = POL(s); const S = bark(m, p, sg, { bend }); void S; rece[s] = { g: [c[0], c[1], sg * 10], pole: [-0.6, 0.7, 0.35 * sg], obrot: 0 }; }
      return poza({ u, tulow: { m, p, bend, glowa: p * 0.45 + 8 }, nogi: { R: nog('R'), L: nog('L') }, rece }); };
    return buduj({ rodzina: RODZINA, cw: 'T-Bar Row', sprzet: [SPRZET.podloga(-110, 130), { rodzaj: 'dzwignia', tryb: 'obrot', x: P[0], y: P[1], z: 0, dlugosc: r, punkt: 'dlonie', trzyma: 'obie' }], fr, us: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1], blad: { cue: 'mis.roundBack', postawa: false, znacznik: 'back' } }); };
  /* --- seal row: przodem na wysokiej ławce płaskiej (głowa do przodu), sztanga zwisa pod ławką --- */
  G['Seal Row (sztanga)'] = () => { const m = [-15, 89.5]; const p = 90; const noga = (s) => noga3([m[0] - 82.5, 89.5, POL(s) * 10], [0, 1, 0], { pod: 0, rot: 90 });
    const fr = (u) => { const rece = {}; for (const s of SIDES) { const sg = POL(s); const S = bark(m, p, sg); const H0 = [S[0] + 2, S[1] - 63.4]; const H1 = [S[0] - 22, S[1] - 24]; rece[s] = { g: [lerp(H0[0], H1[0], u), lerp(H0[1], H1[1], u), sg * 24], pole: [-0.6, 0.9, 0.4 * sg], obrot: -75 }; }
      return poza({ u, tulow: { m, p, glowa: 80 }, nogi: { R: noga('R'), L: noga('L') }, rece }); };
    return buduj({ rodzina: RODZINA, cw: 'Seal Row (sztanga)', sprzet: [SPRZET.podloga(-130, 130), { rodzaj: 'lawka', x: 0, top: 80, kat: 0, dlugosc: 110, siedzisko: 70 }, B], fr, us: U5 }); };
  return G;
}
