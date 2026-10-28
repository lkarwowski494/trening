// Generator póz rodziny row po stronie agenta (26.10.2026): wiosłowanie w pochyleniu (sztanga, hantle, linki, Smith, T-bar), jednorącz (hantel), przodem na ławce (seal row).
// Tułów pochylony w biodrach (40–105°, stały ±10°), plecy neutralne (zgięcie kręgosłupa ≤ 10°), kolana ugięte ≤ 40°; łokcie: z prawie prostych (≤ 20°) do ≥ 70° i za linią tułowia (≥ 5 cm).
// Błąd mis.roundBack: zaokrąglone plecy (zgięcie kręgosłupa narasta do 30°, barki zjeżdżają w dół, ręce poruszają się razem z barkami).
import { lezyPrzodem, U9 } from './gora.mjs';
import { ROT_STOPA_LEZY } from './core_floor.mjs';
import { KOLANO_LEKKO_MAX_DEG } from '../v2-sens.mjs';
import { v2, BODY, R, r1, lerp, Y_STOJ, SPRZET, poza, noga3, bark, ramieFK, buduj, wyc, naLawce, kier } from './gora.mjs';

export const RODZINA = 'row';
const POL = (s) => (s === 'R' ? 1 : -1);
const U5 = [0, 0.25, 0.5, 0.75, 1];
/** Kolano wiosłowania w opadzie: cel 26° przy górnej granicy KOLANO_LEKKO_MAX_DEG = 30° (jedna stała konwencji „lekko ugięte”, v2-sens.mjs); wcześniej 34,7–37,7° (granica reguły wynosiła 40°). */
const KOLANO_WIOSLO_CEL = KOLANO_LEKKO_MAX_DEG - 4;
const SIDES = ['R', 'L'];
const up = (p) => [Math.sin(p * R), Math.cos(p * R)];
const front = (p) => [Math.cos(p * R), -Math.sin(p * R)];

/** Największe kolano (R, L) klatki wiosłowania. */
function kolanoMax(k, cw) { const E = v2(); const pz = { kontrakt: E.CONTRACT.id, rodzina: RODZINA, cwiczenie: cw, sprzet: [{ rodzaj: 'podloga' }], klatki: [{ ...k, u: 0 }, { ...k, u: 1 }], bledy: [] }; const sk = E.keyframeFrame(pz, 0).sk; return Math.max(E.jointAngles(sk, 'R').knee, E.jointAngles(sk, 'L').knee); }
/** x stóp: gdy kolano przy x0 przekracza KOLANO_LEKKO_MAX_DEG (pozy w granicy nie są ruszane), bisekcja (stopy do przodu, kolano maleje) do kolana = cel; inaczej x0. `kolanoPrzy(x)` zwraca największe kolano dla stóp w x. */
function dobierzX(x0, kolanoPrzy) { if (kolanoPrzy(x0) <= KOLANO_LEKKO_MAX_DEG) return x0; let lo = x0, hi = x0 + 20; for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (kolanoPrzy(mid) > KOLANO_WIOSLO_CEL) lo = mid; else hi = mid; } return r1(hi * 10) / 10; }

/** Wiosłowanie w pochyleniu. o: { p (pochylenie), m (miednica), zr (|z| chwytu), obrot, sprzet, H0 [dx, dy względem barku], L, F (koniec ruchu: L cm w dół osi tułowia, F cm przed tułowiem), pole (biegun łokcia), jedna, blad, kolana }. */
function pochylony(cw, o) {
  const p = o.p ?? 55; const m = o.m ?? [-38, 76]; const nogiZ = o.nogiZ ?? 17;
  let sx = o.stopaX ?? 0; /* x stóp: dobierany tak, by kolano nie przekraczało KOLANO_WIOSLO_CEL (jedna stała „lekko ugięte” ≤ KOLANO_LEKKO_MAX_DEG) */
  const nog = (s) => noga3([sx, 7, POL(s) * nogiZ], [1, 0.1, POL(s) * 0.05]);
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
  sx = dobierzX(sx, (x) => { sx = x; return kolanoMax(fr(0, false), cw); }); /* tylko pozy z kolanem powyżej celu: stopy przesunięte do przodu (zwykle 1–3 cm), reszta bez zmian */
  const sprz = o.sprzet.map((g) => (o.jedna && ['hantel', 'kettlebell', 'wyciag'].includes(g.rodzaj) ? { ...g, trzyma: o.jedna } : g));
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-110, 130), ...(o.dodatki ?? []), ...sprz], fr, us: o.us ?? U5, blad: o.blad ? { cue: 'mis.roundBack', postawa: false, znacznik: 'back' } : undefined });
}


/** Wiosłowanie przodem na ławce skośnej: ręce zwisają przed ławką, łokcie unoszą się za linię pleców (do góry i do przodu względem leżącego). */
function przodem(cw, o) {
  const L = lezyPrzodem(o.kat ?? 45, { dl: o.dl ?? 38, zr: 16, kolDx: 52, pole: [1, 0.2, 0] }); const zr = o.zr ?? 24; const pole = o.pole ?? [0.7, 0.7, 0];
  const fr = (u) => { const rece = {}; for (const s of SIDES) { const sw = -POL(s); const S = L.S(s); const gz = sw * zr;
      const H0 = [S[0] + (o.h0?.[0] ?? 0), S[1] + (o.h0?.[1] ?? -63.2)]; const H1 = [S[0] + (o.h1?.[0] ?? 14), S[1] + (o.h1?.[1] ?? -20)];
      rece[s] = { g: [lerp(H0[0], H1[0], u), lerp(H0[1], H1[1], u), gz], pole: [pole[0], pole[1], sw * (pole[2] ?? 0)], obrot: o.obrot ?? 0 }; }
    return poza({ u, tulow: { m: L.m, p: L.p, glowa: L.p, ext: L.ext }, nogi: L.nogi, rece }); };
  const sprzet = [SPRZET.podloga(-110, 130), L.lawka, ...o.sprzet]; let us = o.us ?? U5;
  if (o.dzwignia) { /* dźwignia obrotowa (T-bar): oś P wyznaczona z dwóch skrajnych położeń dłoni (środek R i L) i długości ramienia */
    const S0 = L.S('R'); const H0 = [S0[0] + (o.h0?.[0] ?? 0), S0[1] + (o.h0?.[1] ?? -63.2)]; const H1 = [S0[0] + (o.h1?.[0] ?? 14), S0[1] + (o.h1?.[1] ?? -28)]; const r = o.dzwignia.r;
    const mid = [(H0[0] + H1[0]) / 2, (H0[1] + H1[1]) / 2]; const dx = H1[0] - H0[0], dy = H1[1] - H0[1]; const l = Math.hypot(dx, dy); const hh = Math.sqrt(Math.max(0, r * r - (l / 2) ** 2)); const n = [-dy / l, dx / l];
    const kand = [[mid[0] + n[0] * hh, mid[1] + n[1] * hh], [mid[0] - n[0] * hh, mid[1] - n[1] * hh]]; const P = kand.sort((a, b) => (o.dzwignia.wybor === 'dol' ? a[1] - b[1] : b[1] - a[1]))[0];
    const a0 = Math.atan2(H0[1] - P[1], H0[0] - P[0]); let a1 = Math.atan2(H1[1] - P[1], H1[0] - P[0]); if (Math.abs(a1 - a0) > Math.PI) a1 += a1 < a0 ? 2 * Math.PI : -2 * Math.PI;
    us = o.us ?? U9; const fr2 = (u) => { const a = lerp(a0, a1, u); const c = [P[0] + r * Math.cos(a), P[1] + r * Math.sin(a)]; const rece = {}; for (const s of SIDES) { const sw = -POL(s); rece[s] = { g: [c[0], c[1], sw * zr], pole, obrot: 0 }; } return poza({ u, tulow: { m: L.m, p: L.p, glowa: L.p, ext: L.ext }, nogi: L.nogi, rece }); };
    return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-110, 130), L.lawka, { rodzaj: 'dzwignia', tryb: 'obrot', x: r1(P[0]), y: r1(P[1]), z: 0, dlugosc: r1(r), punkt: 'dlonie', trzyma: 'obie' }], fr: fr2, us });
  }
  return buduj({ rodzina: RODZINA, cw, sprzet, fr, us });
}

export const WYJATKI = {
  'Meadows Row': 'landmine + sztanga jedną ręką jest już obsługiwane (środek gryfu na chwycie trzymającej dłoni), ale tor wiosłowania nie leży na sferze gryfu: oś obrotu landmine może być co najwyżej 30 cm nad podłogą, a dłoń porusza się po łuku o promieniu 200 cm wokół osi (przemieszczenie ≈ 30 cm do tyłu i 45 cm w górę wymagałoby osi ≈ 80 cm nad podłogą i ≈ 120 cm przed osobą); nie da się narysować bez fałszowania toru',
};
export const PRZYBLIZENIA = {
  'Seal Row (sztanga)': 'przybliżenie: ławka płaska na wysokości 80 cm (granica kontraktu), osoba leży przodem głową do przodu (+x), stopy obrócone na zewnątrz o 70° (nie 90°: przy 90° stopa rysowałaby się w widoku z boku jako punkt; model stopy nie ma palców do tyłu), sztanga zwisa pod ławką',
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
  /* --- jednorącz: lewe kolano i lewa dłoń na ławce, prawa stopa na podłodze, tułów prawie poziomo (wskazówka „setup” ćwiczenia; recenzja ruchu 27.10.2026) --- */
  G['One Arm Row (hantle)'] = () => { const p = 75; const top = 38; const kb = BODY(); const kneeY = top + 8; const kx = -12; /* kolano lewe na ławce (y), cm za biodrem (x) */
    const my = r1(kneeY + Math.sqrt(kb.thigh ** 2 - kx ** 2)); const m = [0, my]; const dyKostki = -4; const ay = kneeY + dyKostki; const ax = kx - Math.sqrt(kb.shank ** 2 - dyKostki ** 2);
    const nogi = { R: noga3([4, 7, 27], [1, 0.1, 0.05]), L: noga3([ax, ay, -8.5], [0, -1, 0], { pod: -55, rot: 0 }) }; /* R: stopa na podłodze obok ławki (rozstaw 28 cm); L: kolano na ławce, goleń za nim lekko w górę */
    const fr = (u) => { const rece = {}; for (const s of SIDES) { const sg = POL(s); const S = bark(m, p, sg);
      if (s === 'R') { const u1 = up(p), f1 = front(p); const hx = 6, hz = 24 - 19; const hy = -Math.sqrt(63.2 ** 2 - hx * hx - hz * hz); const H0 = [S[0] + hx, S[1] + hy]; const H1 = [S[0] - 32 * u1[0] + 12 * f1[0], S[1] - 32 * u1[1] + 12 * f1[1]];
        rece[s] = { g: [lerp(H0[0], H1[0], u), lerp(H0[1], H1[1], u), 24], pole: [-0.6, 0.7, 0.35], obrot: 0 }; }
      else rece[s] = { g: [S[0] + 3, top + 3.5, -15], pole: [-0.3, 0.2, -1], obrot: 0 }; } /* wolna dłoń na blacie ławki */
      return poza({ u, tulow: { m, p, glowa: p * 0.45 + 8 }, nogi, rece }); };
    return buduj({ rodzina: RODZINA, cw: 'One Arm Row (hantle)', sprzet: [SPRZET.podloga(-110, 130), { rodzaj: 'lawka', x: 0, top, kat: 0, dlugosc: 30, siedzisko: 65 }, { ...H, trzyma: 'R' }], fr, us: U5 }); };
  /* --- T-bar: dźwignia obrotowa z osią za osobą (schemat), uchwyt V między nogami --- */
  G['T-Bar Row'] = () => { const p = 55; const m = [-38, 76]; const P = [-85, 5]; const r = 101.3; const a0 = 21.2, a1 = 46;
    let sx = 0; const nog = (s) => noga3([sx, 7, POL(s) * 17], [1, 0.1, POL(s) * 0.05]);
    const fr = (u, zle) => { const bend = zle ? lerp(0, 32, u) : 0; const rece = {}; const th = lerp(a0, a1, u) * R; const c = [P[0] + r * Math.cos(th), P[1] + r * Math.sin(th)];
      for (const s of SIDES) { const sg = POL(s); const S = bark(m, p, sg, { bend }); void S; rece[s] = { g: [c[0], c[1], sg * 10], pole: [-0.6, 0.7, 0.35 * sg], obrot: 0 }; }
      return poza({ u, tulow: { m, p, bend, glowa: p * 0.45 + 8 }, nogi: { R: nog('R'), L: nog('L') }, rece }); };
    sx = dobierzX(sx, (x) => { sx = x; return kolanoMax(fr(0, false), 'T-Bar Row'); });
    return buduj({ rodzina: RODZINA, cw: 'T-Bar Row', sprzet: [SPRZET.podloga(-110, 130), { rodzaj: 'dzwignia', tryb: 'obrot', x: P[0], y: P[1], z: 0, dlugosc: r, punkt: 'dlonie', trzyma: 'obie' }], fr, us: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1], blad: { cue: 'mis.roundBack', postawa: false, znacznik: 'back' } }); };
  /* --- seal row: przodem na wysokiej ławce płaskiej (głowa do przodu), sztanga zwisa pod ławką --- */
  G['Seal Row (sztanga)'] = () => { const m = [-15, 89.5]; const p = 90; const noga = (s) => noga3([m[0] - 82.5, 89.5, POL(s) * 10], [0, 1, 0], { pod: 0, rot: ROT_STOPA_LEZY });
    const fr = (u) => { const rece = {}; for (const s of SIDES) { const sg = POL(s); const S = bark(m, p, sg); const H0 = [S[0] + 2, S[1] - 63.4]; const H1 = [S[0] - 22, S[1] - 24]; rece[s] = { g: [lerp(H0[0], H1[0], u), lerp(H0[1], H1[1], u), sg * 24], pole: [-0.6, 0.9, 0.4 * sg], obrot: -75 }; }
      return poza({ u, tulow: { m, p, glowa: 80 }, nogi: { R: noga('R'), L: noga('L') }, rece }); };
    return buduj({ rodzina: RODZINA, cw: 'Seal Row (sztanga)', sprzet: [SPRZET.podloga(-130, 130), { rodzaj: 'lawka', x: 0, top: 80, kat: 0, dlugosc: 110, siedzisko: 70 }, B], fr, us: U5 }); };
  G['Lying T-Bar Row'] = () => przodem('Lying T-Bar Row', { sprzet: [], dzwignia: { r: 70, wybor: 'gora' } });
  G['Chest Supported Row'] = () => przodem('Chest Supported Row', { h1: [14,-28], sprzet: [H] });
  return G;
}
