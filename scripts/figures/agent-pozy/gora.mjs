// Wspólny zestaw narzędzi do póz górnej części ciała (agent-pozy, rodziny: curl, triceps, delt_raise, shrug, rotator_cuff, forearm, chest_fly, row, cable_row, pulldown, overhead_press,
// chest_press_machine, cable_press; 26.10.2026). Ramiona liczone z kinematyki prostej (kąt ramienia i przedramienia → łokieć i chwyt), biegun łokcia z FK, nogi stojące / siedzące / leżące z modelu.
// Wejście: tylko liczby z modelu (BODY, BENCH) i parametry per ćwiczenie — żadnych cudzych obrazów (docs/53, bramka 11). Używają go generatory <rodzina>.mjs.
import { v2, BODY, R, r1, klatka, barki, bladZTrajektorii, zbuduj, przeciecie } from './model.mjs';
import { wczytajTeksty } from '../v2-jakosc.mjs';

export const lerp = (a, b, t) => a + (b - a) * t;
export const gladko = (x) => x * x * (3 - 2 * x);
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const SH = () => BODY().shHalf;
export const Y_STOJ = 89.5; /* miednica stojącej osoby: nogi lekko ugięte w kolanach (zgięcie ≈ 12°) */
const POL = (s) => (s === 'R' ? 1 : -1);
export const bok = POL;

/** Kierunek segmentu w świecie: theta = kąt od pionu w dół (0 = w dół, 90 = poziomo, 180 = w górę), phi = płaszczyzna (0 = do przodu, 90 = na zewnątrz, 180 = do tyłu, −90 = do środka); sg = strona (R +1, L −1). */
export function kier(theta, phi = 0, sg = 1) { const t = theta * R, p = phi * R; return [Math.sin(t) * Math.cos(p), -Math.cos(t), sg * Math.sin(t) * Math.sin(p)]; }
const add3 = (a, b, k = 1) => [a[0] + k * b[0], a[1] + k * b[1], a[2] + k * b[2]];
const norm3 = (a) => { const l = Math.hypot(...a) || 1; return a.map((x) => x / l); };
const ZRAMIE = () => BODY().farm + BODY().hand;

/** Kierunek segmentu w „płaszczyźnie z odchyleniem”: f = zgięcie do przodu od pionu w dół (0 = w dół, 90 = do przodu poziomo, 180 = w górę, −90 = do tyłu), a = odchylenie na zewnątrz (stopnie, mała liczba); sg = strona. */
export function kier3(f, a = 0, sg = 1) { const x = Math.sin(f * R), y = -Math.cos(f * R), z = sg * Math.sin(a * R); const l = Math.hypot(x, y, z); return [x / l, y / l, z / l]; }
/** Ramię z FK: bark S (3D), strona; ramię (f1, a1) i przedramię (f2, a2) w kierunkach kier3 (zgięcie do przodu + odchylenie na zewnątrz) ALBO (t1, p1, t2, p2) w kierunkach kier (elewacja + płaszczyzna: ruchy w bok, nad głowę).
 * zG: żądane |z| chwytu — odchylenie przedramienia (a2) albo płaszczyzna (p2) dobrane tak, by je osiągnąć. Zwraca { g: chwyt, E: łokieć, pole: kierunek wybrzuszenia łokcia (z FK; przy prawie prostym ramieniu polDom) }. */
export function ramieFK(S, sg, o) {
  const b = BODY(); const L2 = o.lower ?? ZRAMIE(); const polDom = o.polDom ?? [0, -1, 0];
  const nowe = o.f1 !== undefined; let d1, E, d2;
  if (o.d1) { /* kierunki wprost (wektory jednostkowe dla strony R; dla L z jest odbijane): ruchy, których nie opisują kąty zgięcia/odchylenia */
    const mir = (v) => [v[0], v[1], sg * v[2]]; d1 = mir(norm3(o.d1)); E = add3(S, d1, b.uarm); d2 = mir(norm3(o.d2)); }
  else if (nowe) { d1 = kier3(o.f1, o.a1 ?? 0, sg); E = add3(S, d1, b.uarm); let a2 = o.a2 ?? o.a1 ?? 0;
    if (o.zG !== undefined) { const dd = clamp((o.zG - sg * E[2]) / L2, -0.95, 0.95); a2 = Math.asin(dd / Math.sqrt(1 - dd * dd)) / R; }
    d2 = kier3(o.f2, a2, sg); }
  else { const p1 = o.p1 ?? 0; let p2 = o.p2 ?? p1; d1 = kier(o.t1, p1, sg); E = add3(S, d1, b.uarm);
    if (o.zG !== undefined) { const st = Math.sin(o.t2 * R); if (Math.abs(st) > 0.05) p2 = Math.asin(clamp((o.zG - sg * E[2]) / (L2 * st), -1, 1)) / R; }
    d2 = kier(o.t2, p2, sg); }
  const G = add3(E, d2, L2);
  const mid = [(S[0] + G[0]) / 2, (S[1] + G[1]) / 2, (S[2] + G[2]) / 2]; const pv = [E[0] - mid[0], E[1] - mid[1], E[2] - mid[2]]; const l = Math.hypot(...pv);
  /* przy prawie prostym ramieniu biegun z FK jest niewiarygodny: używamy domyślnego */
  const pole = l < 1.2 ? polDom : pv.map((x) => x / l);
  return { g: G, E, pole };
}
/** Kąt zgięcia łokcia (stopnie) z kierunków ramienia i przedramienia: kąt między wektorami ramię i przedramię. */
export function katLokcia(t1, p1, t2, p2 = p1) { const a = kier(t1, p1, 1), c = kier(t2, p2, 1); return Math.acos(clamp(a[0] * c[0] + a[1] * c[1] + a[2] * c[2], -1, 1)) / R; }

/** Bark (3D) strony sg dla miednicy m = [x, y], pochylenia p, zgięcia kręgosłupa; uniesienie (cm wzdłuż osi tułowia) i wysunięcie (cm wzdłuż przodu klatki) jak w silniku. */
export function bark(m, p, sg, { bend = 0, uniesienie = 0, wysuniecie = 0 } = {}) {
  const S = barki(m, p, bend); const up = [Math.sin(p * R), Math.cos(p * R)]; const fr = [Math.cos(p * R), -Math.sin(p * R)];
  return [S[0] + up[0] * uniesienie + fr[0] * wysuniecie, S[1] + up[1] * uniesienie + fr[1] * wysuniecie, sg * SH()];
}

/** Nogi stojące: stopy płasko na podłodze, kolana do przodu. x = położenie kostek w x, zr = połowa rozstawu kostek (z), rot = rotacja stóp. */
export function nogiStoj(x = 0, zr = 14, rot = 10) { const n = (s) => ({ k: [x, BODY().ankleH, POL(s) * zr], pod: 0, rot, pole: [1, 0, POL(s) * 0.12] }); return { R: n('R'), L: n('L') }; }
/** Nogi siedzące (stopy na podłodze, uda poziomo, kolana do przodu): biodro w [mx, my]; kostka pod kolanem. */
export function nogiSiedz(mied, { zr = 20, kolanoDx = 42, rot = 10 } = {}) {
  const b = BODY(); const hip = [mied[0], mied[1]]; const ay = b.ankleH; const ax = hip[0] + kolanoDx; /* kostka w x kolana (goleń prawie pionowa) */
  void hip; const n = (s) => ({ k: [ax, ay, POL(s) * zr], pod: 0, rot, pole: [1, 0.3, POL(s) * 0.1] });
  return { R: n('R'), L: n('L') };
}
/** Pole „kolano w górę” dla nóg ugiętych na ławce (stopy na podłodze przed miednicą). */
export function nogiLezac(mied, { dx = 40, zr = 24, rot = 8 } = {}) { const n = (s) => ({ k: [mied[0] + dx, BODY().ankleH, POL(s) * zr], pod: 0, rot, pole: [0.15, 1, POL(s) * 0.1] }); return { R: n('R'), L: n('L') }; }

/**
 * Klatka z opisu: tulow = { m:[x,y], p (pochylenie), bend, glowa, ext }, nogi = { R:{k,pod,rot,pole}, L }, rece = { R: spec, L: spec }, gdzie spec to:
 *  { g:[x,y,z], pole? } (chwyt wprost) albo { t1, p1, t2, p2, lower?, polDom?, obrot?, nadg?, uniesienie?, wysuniecie? } (FK z barku).
 */
export function poza({ u, tulow, nogi, rece }) {
  const { m, p, bend = 0, glowa, ext } = tulow; const rr = {};
  for (const s of ['R', 'L']) {
    const sp = rece[s]; const sg = POL(s) * (ext?.obrotTulowia === 180 ? -1 : 1); /* obrót tułowia o 180° (leżenie przodem na ławce): bark „R” leży po stronie −z */
    if (sp.g) { rr[s] = { g: sp.g, pole: sp.pole, obrot: sp.obrot, nadg: sp.nadg, uniesienie: sp.uniesienie, wysuniecie: sp.wysuniecie }; continue; }
    const S = bark(m, p, sg, { bend, uniesienie: sp.uniesienie ?? 0, wysuniecie: sp.wysuniecie ?? 0 });
    const f = ramieFK(S, sg, sp); const pl = sp.poleR ? [sp.poleR[0], sp.poleR[1], POL(s) * sp.poleR[2] * (ext?.obrotTulowia === 180 ? -1 : 1)] : undefined; rr[s] = { g: f.g, pole: sp.pole ?? pl ?? f.pole, obrot: sp.obrot, nadg: sp.nadg, uniesienie: sp.uniesienie, wysuniecie: sp.wysuniecie };
  }
  return klatka({ u, miednica: [m[0], m[1], 0], pitch: p, bend, glowa, nogi, rece: rr, ext });
}

/** Składanie ćwiczenia: fr(u, zle) → klatka; blad = { cue, znacznik, us, postawa } (poza błędu = fr(u, true)); zwraca obiekt zgodny z kontraktem. */
export const POMINIETE_BLEDY = {}; /* ćwiczenie → powód, dla błędów, których generator nie rysuje (cue bez opisu w tekstach wskazówek: v2-jakosc etykieta_bledu) */
export function buduj({ rodzina, cw, sprzet, fr, us = [0, 0.25, 0.5, 0.75, 1], blad }) {
  const ok = (u) => fr(u, false), zle = (u) => fr(u, true);
  if (blad && !wczytajTeksty()[blad.cue]) { POMINIETE_BLEDY[cw] = `błąd „${blad.cue}” bez opisu w lib/cues/text/pl.json — nie rysowany (reguła jakości etykieta_bledu)`; blad = undefined; }
  const bl = blad ? [bladZTrajektorii({ cue: blad.cue, postawa: blad.postawa ?? true, znacznik: blad.znacznik ?? 'bar', us: blad.us ?? [0, 0.5, 1], ok, zle })] : [];
  return zbuduj({ rodzina, cwiczenie: cw, sprzet, klatki: us.map(ok), bledy: bl });
}

/** Ławka (zawias w x = 0): miednica, pochylenie i nogi osoby opartej plecami o oparcie pod kątem kat (≤ 45° leżąc, wyżej siedząc), siedzisko top. Zwraca { m, p, glowa, nogi }. */
export function naLawce(kat, top = 43, { zr = 24 } = {}) {
  const hip = v2().benchHip(kat, top); const m = [hip[0], hip[1]]; const p = kat - 90;
  return { m, p, glowa: p, nogi: nogiLezac(m, { dx: v2().BENCH.footBack, zr }) };
}
/** Siedzenie na płaskim siedzisku (ławka płaska / skrzynia) o wysokości siedziska top, miednica w x = mx; nogi w kolanach pod kątem prostym, stopy na podłodze. */
export function naSiedzisku(top = 43, mx = 12, { zr = 20 } = {}) {
  const y = top + 9.5 + 0.8; const m = [mx, y]; return { m, p: 0, glowa: 0, nogi: nogiSiedz(m, { zr, kolanoDx: 42 }) };
}

/** Modlitewnik: ustawienie osoby siedzącej przodem do podpórki. Zwraca { sprzet (wpis modlitewnik), m (miednica), p (pochylenie), nogi, S (bark 2D), E (łokieć 2D na podpórce) i kąty f1 ramienia }.
 * Miednica na siedzisku, klatka dotyka górnego końca podpórki (odstęp osi tułowia od podpórki ≈ 8 cm; kontakt tolerancja 2 cm), łokcie leżą na powierzchni. Liczby z modelu (EQUIP.preacher*, BODY). */
export function modlitewnik({ top = 95, kat = 60, dl = 28, seatY = 48, odstep = 8, stawy = 8.5, kolanoDx = 41.5, kolanoMin = 8.5 } = {}) {
  const E = v2(); const q = E.EQUIP; const th = kat * R; const x = 0; const b = BODY();
  const pr = { k: 'preacher', top: [x, top], bottom: [x + Math.cos(th) * dl, top - Math.sin(th) * dl], seat: [x - q.preacherSeatDx, seatY] };
  const pp = E.preacherPolys(pr); const py = seatY + 9.5 + 0.3; const dpad = (pt) => E.sdPoly(pt, pp.pad);
  const odl = (px, p) => { const S = [px + b.trunk * Math.sin(p * R), py + b.trunk * Math.cos(p * R)]; let m = Infinity; for (let i = 0; i <= 24; i++) { const t = i / 24; m = Math.min(m, dpad([px + (S[0] - px) * t, py + (S[1] - py) * t])); } return m; };
  const dx = Math.cos(th), dy = -Math.sin(th); let n = [-dy, dx]; if (n[1] < 0) n = [-n[0], -n[1]];
  const pt = (t) => [x + dx * t + n[0] * stawy, top + dy * t + n[1] * stawy];
  const lokiec = (S) => { let lo = -5, hi = dl + 30; for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; const e = pt(mid); if (Math.hypot(e[0] - S[0], e[1] - S[1]) < b.uarm) lo = mid; else hi = mid; } return pt((lo + hi) / 2); };
  let wyb = null;
  for (let p = 14; p <= 50 && !wyb; p += 1) {
    let px = -80; while (odl(px, p) > odstep && px < 40) px += 0.25; const S = [px + b.trunk * Math.sin(p * R), py + b.trunk * Math.cos(p * R)]; const Ee = lokiec(S);
    let arm = Infinity; for (let i = 0; i <= 17; i++) { const t = i / 20; arm = Math.min(arm, dpad([S[0] + (Ee[0] - S[0]) * t, S[1] + (Ee[1] - S[1]) * t])); }
    const ank = [px + kolanoDx, b.ankleH, b.hipHalf]; const k = E.ik2([px, py, b.hipHalf], [ank[0], ank[1], 18], b.thigh, b.shank, [1, 0.3, 0.1]).mid; const kn = dpad([k[0], k[1]]);
    if (process.env.DBG) console.log(p, px, 'arm', arm.toFixed(1), 'knee', kn.toFixed(1), 'S', S.map(x=>x.toFixed(1)).join(','), 'E', Ee.map(x=>x.toFixed(1)).join(','));
    if (arm >= 2.0 && kn >= kolanoMin) wyb = { p, px, S, Ee };
  }
  if (!wyb) throw new Error('modlitewnik: brak ułożenia tułowia');
  const { p, px, S, Ee } = wyb; const f1 = Math.atan2(Ee[0] - S[0], -(Ee[1] - S[1])) / R;
  const m = [px, py]; const nogi = nogiSiedz(m, { zr: 18, kolanoDx });
  return { sprzet: { rodzaj: 'modlitewnik', x, top, kat, dlugosc: dl, y: seatY }, m, p, nogi, S, E: Ee, f1, kierPodpory: Math.atan2(dx, -dy) / R };
}


/** Ręka z parametrów: o.f1 / o.f2 = [początek, koniec] kąta ramienia i przedramienia (do przodu od pionu), o.a1 odchylenie ramienia na zewnątrz, o.zr = |z| chwytu (liczba albo [początek, koniec]),
 *  o.obrot = [początek, koniec] obrotu przedramienia (+ supinacja) albo lista wartości w klatkach U5; o.zle = [początek, koniec] kąta, o który błąd obraca ramię i przedramię do przodu (rytm u). */
export function ramieU(o, u, zle) {
  const e = o.rytm ? o.rytm(u) : u; const dz = zle && o.zle ? lerp(o.zle[0], o.zle[1], u) : 0;
  const zr = Array.isArray(o.zr) ? lerp(o.zr[0], o.zr[1], e) : o.zr;
  const obrot = o.obrot === undefined ? undefined : Array.isArray(o.obrot) && o.obrot.length > 2 ? o.obrot[Math.round(u * 4)] : Array.isArray(o.obrot) ? lerp(o.obrot[0], o.obrot[1], e) : o.obrot;
  return { f1: lerp(o.f1[0], o.f1[1], e) + dz, a1: o.a1 ?? 6, f2: lerp(o.f2[0], o.f2[1], e) + dz, zG: zr, obrot, ...(o.polDom ? { polDom: o.polDom } : {}), ...(o.nadg !== undefined ? { nadg: Array.isArray(o.nadg) ? lerp(o.nadg[0], o.nadg[1], e) : o.nadg } : {}) };
}
/** Ręka wolna (nieobciążona) przy boku: zwisa wzdłuż uda. */
export const wolna = () => ({ f1: 2, a1: 8, f2: 5, zG: 24, obrot: 0 });
/** Wpis nogi dla `poza`: kostka k, biegun kolana, opcje { pod (null = automatycznie), rot }. */
export const noga3 = (k, pole, o = {}) => ({ k, pod: o.pod === null ? undefined : (o.pod ?? 0), rot: o.rot ?? 10, pole });
/** Wyciąg jako wpis sprzętu (kolumna przed osobą: x = 70, bloczek y). */
export const wyc = (o = {}) => ({ rodzaj: 'wyciag', x: 70, y: 15, z: 0, h: 230, ...o });


/** Wektor jednostkowy d2 = d1 obrócony o flex stopni w stronę `ku` (część `ku` prostopadła do d1): ramię z zawsze tym samym lekkim zgięciem łokcia, przedramię odchylone w stronę `ku`. */
export function obrocDo(d1, ku, flexDeg) {
  const n = (a) => { const l = Math.hypot(...a) || 1; return a.map((x) => x / l); }; const a = n(d1); const dp = ku[0] * a[0] + ku[1] * a[1] + ku[2] * a[2];
  const t = n([ku[0] - dp * a[0], ku[1] - dp * a[1], ku[2] - dp * a[2]]); const f = flexDeg * R; return [Math.cos(f) * a[0] + Math.sin(f) * t[0], Math.cos(f) * a[1] + Math.sin(f) * t[1], Math.cos(f) * a[2] + Math.sin(f) * t[2]];
}
/** Ręka prawie prosta w ruchu unoszenia: kierunek ramienia kier(theta, phi) (strona R, z odbijane dla L), łokieć zgięty o flex w stronę ku (domyślnie do przodu). Zwraca spec dla `poza` (d1, d2). */
export function rekaProsta(theta, phi, { flex = 14, ku = [1, 0, 0], pl, obrot, nadg } = {}) {
  const d1 = kier(theta, phi, 1); const d2 = pl !== undefined ? kier(theta + pl * flex, phi, 1) : obrocDo(d1, ku, flex); /* pl = ±1: zgięcie łokcia w płaszczyźnie ruchu ramienia (przedramię wyżej / niżej niż ramię), bez osobliwości przy ku równoległym do ramienia */ /* wybrzuszenie łokcia jest po stronie przeciwnej do odchylenia przedramienia (poleR liczone dla strony R, dla L z odbijane) */
  const t = [d2[0] - Math.cos(flex * R) * d1[0], d2[1] - Math.cos(flex * R) * d1[1], d2[2] - Math.cos(flex * R) * d1[2]]; const tl = Math.hypot(...t) || 1;
  return { d1, d2, poleR: [-t[0] / tl, -t[1] / tl, -t[2] / tl], ...(obrot !== undefined ? { obrot } : {}), ...(nadg !== undefined ? { nadg } : {}) };
}
export const U9 = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
export const U12 = Array.from({ length: 12 }, (_, i) => Math.round((i / 11) * 1000) / 1000);

/** Gotowe wpisy sprzętu. */
export const SPRZET = {
  podloga: (x0 = -120, x1 = 120) => ({ rodzaj: 'podloga', x0, x1 }),
  sztanga: (o = {}) => ({ rodzaj: 'sztanga', talerze: true, podazaZaChwytem: true, dlugosc: 220, ...o }),
  gryfLamany: (o = {}) => ({ rodzaj: 'sztanga', talerze: true, podazaZaChwytem: true, dlugosc: 120, ...o }),
  hantle: (o = {}) => ({ rodzaj: 'hantel', ...o }),
};

export { v2, BODY, R, r1, klatka, barki, bladZTrajektorii, zbuduj, przeciecie };
