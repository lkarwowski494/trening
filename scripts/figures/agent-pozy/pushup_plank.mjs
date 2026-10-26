// Generator póz rodziny pushup_plank po stronie agenta (pilotaż 26.10.2026): pozy WYLICZONE z modelu (długości kości, IK dwukostny, sprzęt z silnika), parametry per ćwiczenie z katalogu i wskazówek.
// Wzorzec rodziny: ciało w jednej linii od kostek (palce na podporze) do barków; dłonie stałe pod barkami w u = 0; łokieć wynika z odległości bark–chwyt (dChwytu), nie jest wpisywany.
// Błędy z cue: push.mis.partial (płytki dół — łamie tylko pompka_zakres), plank.mis.sag (opadające biodra — łamie tylko linię ciała), splank.mis.elbow (łokieć przed/za barkiem).
import { v2, BODY, R, r1, up, dir, klatka, bladZTrajektorii, zbuduj, dChwytu, przeciecie, kostkaNaPalcach, barki, ZASIEG } from './model.mjs';

export const RODZINA = 'pushup_plank';
const POD = -60; /* podbicie: palce stoją na podporze (wyjątek rodziny kostki −75°) */
const DL = 81; /* odległość miednica–kostka: nogi prawie proste, 2 cm zapasu na sag */
const US = [0, 0.25, 0.5, 0.75, 1];
const ZNOG = 10;
const biegun = (x, z) => ({ R: [x, 0, z], L: [x, 0, -z] });

/** Ustawienie ciała w jednej linii: kostka A, bark S na okręgu L = DL + tułów wokół A i w odległości dp od dłoni H (płaszczyzna strzałkowa). */
function uklad({ A, H, theta, hzR, hzL = hzR, dl = DL, wybor = 'gora' }) {
  const B = BODY(); const d = dChwytu(theta); const dz = (hz) => (B.shHalf - hz) ** 2; const dp = Math.sqrt(Math.max(1, d * d - (dz(hzR) + dz(hzL)) / 2));
  const S = przeciecie(A, dl + B.trunk, H, dp, wybor); if (!S) throw new Error(`brak ułożenia ciała (A=${A}, H=${H}, theta=${theta})`);
  const fi = Math.atan2(S[1] - A[1], S[0] - A[0]) / R; const u = [Math.cos(fi * R), Math.sin(fi * R)];
  return { S, fi, pitch: 90 - fi, pelvis: [A[0] + dl * u[0], A[1] + dl * u[1]] };
}
/** Położenie dłoni w u = 0: bark nad dłonią (przesunięcie off cm do przodu), łokieć theta0 — dłonie STAŁE w ruchu. */
function dlonX({ A, hy, theta0, hzR, hzL = hzR, off = 0, dl = DL }) {
  const B = BODY(); const d = dChwytu(theta0); const dz = (hz) => (B.shHalf - hz) ** 2; const dp = Math.sqrt(d * d - (dz(hzR) + dz(hzL)) / 2); const L = dl + B.trunk;
  const sy = hy + Math.sqrt(Math.max(1, dp * dp - off * off)); const fi = Math.asin((sy - A[1]) / L); return A[0] + L * Math.cos(fi) - off;
}

/** Trajektoria pompki: u ∈ [0,1], theta(u) = zgięcie łokcia (góra → dół), dłonie nieruchome, kostki nieruchome. */
function trajPompki(o) {
  const { A, H, hzR, hzL = hzR, theta, pole, zNog = ZNOG, miednicaZ = 0, rece } = o;
  return (u) => {
    const t = typeof theta === 'function' ? theta(u) : theta; const h = typeof H === 'function' ? H(u) : H; const a = typeof A === 'function' ? A(u) : A;
    const k = uklad({ A: a, H: h, theta: t, hzR, hzL }); const po = o.poleLokcia ?? [-1, 0, 0.5];
    return { ...klatka({ u, miednica: [k.pelvis[0], k.pelvis[1], miednicaZ], pitch: k.pitch, glowa: k.pitch * 0.75,
      nogi: { R: { k: [a[0], a[1], zNog], pod: POD }, L: { k: [a[0], a[1], -zNog], pod: POD } },
      rece: rece ? rece(u, k, h) : { R: { g: [h[0], h[1], hzR], pole: [po[0], po[1], po[2]] }, L: { g: [h[0], h[1], -hzL], pole: [po[0], po[1], -po[2]] } } }), _S: k.S, _fi: k.fi };
  };
}
const czysc = (k) => { const { _S, _fi, _K, ...r } = k; return r; };

/** Wariant „opadające biodra”: tułów obrócony wokół barków tak, by miednica spadła o ≥ 9 cm poza linię barki–kostka; odległość miednica–kostka ≤ 82,8 cm (zasięg nogi). */
function sagZ(okFn, deltaMax = 11) {
  return (u, w) => {
    const ok = okFn(u); const S = ok._S; const A = ok.nogi.R.kostka; const f = w; if (f === 0) return czysc(ok);
    let dg = deltaMax * f; for (; dg > 3; dg -= 0.25) { const fi = ok._fi + dg; const P = [S[0] - 50 * Math.cos(fi * R), S[1] - 50 * Math.sin(fi * R)]; if (Math.hypot(P[0] - A[0], P[1] - A[1]) <= 82.8) break; }
    const fi = ok._fi + dg; const P = [S[0] - 50 * Math.cos(fi * R), S[1] - 50 * Math.sin(fi * R)];
    const z = czysc(ok); return { ...z, miednica: [r1(P[0]), r1(P[1]), z.miednica[2]], pochylenieTulowia: r1(90 - fi) };
  };
}
const FSAG = () => 1; /* błąd postawy widoczny w każdej klatce (v2-jakosc: blad_widoczny_stale) */
const bladSag = (okFn, sagFn = sagZ(okFn)) => bladZTrajektorii({ cue: 'plank.mis.sag', postawa: true, znacznik: 'pelvis', us: US, ok: (u) => czysc(okFn(u)), zle: (u) => sagFn(u, FSAG(u)) });

/* ---------- typ: pompka (dwie ręce, ciało w linii, dół = zgięcie łokci) ---------- */
export function pompka(cw, { hz = 19, hzL, off = 0, pole = [-1, -0.3, 0.35], boxRece, boxStopy, thetaTop = 12, thetaDol = 144, thetaPlytko = 90, blady = ['partial', 'sag'], sagDeg = 11, zNog = ZNOG, rece, hy: hyOpt, sprzetRece } = {}) {
  const y0r = boxRece ?? 0; const hy = hyOpt ?? (boxRece ? boxRece + 3.2 : 2); const A = [0, kostkaNaPalcach(boxStopy ?? 0)]; const hzl = hzL ?? hz;
  const hx = dlonX({ A, hy, theta0: thetaTop, hzR: hz, hzL: hzl, off }); const H = [hx, hy];
  const mk = (th) => trajPompki({ A, H, hzR: hz, hzL: hzl, theta: th, poleLokcia: pole, zNog, rece });
  const ok = mk((u) => thetaTop + (thetaDol - thetaTop) * u); const sprzet = [{ rodzaj: 'podloga', x0: -150, x1: 220 }];
  if (boxStopy) sprzet.push({ rodzaj: 'skrzynia', x0: -70, x1: 14, top: boxStopy });
  if (boxRece) sprzet.push({ rodzaj: 'skrzynia', x0: r1(hx - 2), x1: r1(hx + 16), top: boxRece });
  if (sprzetRece) sprzet.push(sprzetRece(H, hz));
  const bledy = [];
  if (blady.includes('partial')) { const zle = mk((u) => thetaTop + (thetaPlytko - thetaTop) * u); bledy.push(bladZTrajektorii({ cue: 'push.mis.partial', znacznik: 'pelvis', us: US, ok: (u) => czysc(ok(u)), zle: (u) => czysc(zle(u)) })); }
  if (blady.includes('sag')) bledy.push(bladSag(ok, sagZ(ok, sagDeg)));
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet, klatki: US.map((u) => czysc(ok(u))), bledy });
}

/* ---------- Plank (deska na przedramionach, izometryczna) ---------- */
function plank(cw) {
  const A = [0, kostkaNaPalcach(0)]; const B = BODY(); const L = DL + B.trunk; const sy = B.uarm + 3; const fi = Math.asin((sy - A[1]) / L) / R;
  const S = [A[0] + L * Math.cos(fi * R), A[1] + L * Math.sin(fi * R)]; const pelvis = [A[0] + DL * Math.cos(fi * R), A[1] + DL * Math.sin(fi * R)];
  const G = [S[0] + B.farm + B.hand, sy - B.uarm]; const pitch = 90 - fi;
  const ok = (u) => klatka({ u, miednica: [pelvis[0], pelvis[1], 0], pitch, glowa: pitch * 0.75, nogi: { R: { k: [A[0], A[1], ZNOG], pod: POD }, L: { k: [A[0], A[1], -ZNOG], pod: POD } },
    rece: { R: { g: [G[0], G[1], 14], pole: [-0.3, -1, 0.4] }, L: { g: [G[0], G[1], -14], pole: [-0.3, -1, -0.4] } } });
  const okU = (u) => ({ ...ok(u), _S: S, _fi: fi });
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: [{ rodzaj: 'podloga', x0: -150, x1: 220 }], klatki: [0, 1].map((u) => ok(u)), bledy: [bladZTrajektorii({ cue: 'plank.mis.sag', postawa: true, znacznik: 'pelvis', us: [0, 0.5, 1], ok: (u) => ok(u), zle: (u) => sagZ(okU)(u, 1) })] });
}

/* ---------- Mountain Climbers (podpór na rękach, nogi na przemian) ---------- */
export function mountain(cw, o = {}) {
  const { lift = 4, poleY = 0.3, podR = POD } = o;
  const A = [0, kostkaNaPalcach(0, podR)]; const hy = 2; const hz = 19; const hx = dlonX({ A, hy, theta0: 12, hzR: hz }); const H = [hx, hy]; const k = uklad({ A, H, theta: 12, hzR: hz });
  const PODB = -90; const bent = [k.pelvis[0] - 5, kostkaNaPalcach(0, PODB)]; const POLE = [1, poleY, 0.1]; /* noga ugięta: kolano pod klatkę (biodro ≈ 128°, kolano ≈ 138°), palce na podłodze */
  const frame = (u, rBent) => klatka({ u, miednica: [k.pelvis[0], k.pelvis[1], 0], pitch: k.pitch, glowa: k.pitch * 0.75,
    nogi: { R: { k: [...(rBent ? bent : A), ZNOG], pod: rBent ? PODB : podR, pole: [POLE[0], POLE[1], 0.1] }, L: { k: [...(rBent ? A : bent), -ZNOG], pod: rBent ? podR : PODB, pole: [POLE[0], POLE[1], -0.1] } },
    rece: { R: { g: [hx, hy, hz], pole: [-1, 0, 0.5] }, L: { g: [hx, hy, -hz], pole: [-1, 0, -0.5] } } });
  const us = [0, 0.25, 0.5, 0.75, 1];
  /* przejście: kostki po prostej w x, podbicie liniowo, wysokość kostki spójna z podbiciem + uniesienie stopy 4 cm w środku zmiany */
  const noga = (sd, u) => { const t = sd === 'R' ? u : 1 - u; /* t = 0: ugięta, 1: wyprostowana (dla R); L odwrotnie */ const x = bent[0] + (A[0] - bent[0]) * t; const pod = PODB + (podR - PODB) * t; const y = kostkaNaPalcach(0, pod) + lift * Math.sin(Math.PI * t); return { k: [x, y, sd === 'R' ? ZNOG : -ZNOG], pod, pole: [POLE[0], POLE[1], sd === 'R' ? 0.1 : -0.1] }; };
  const kl = (u) => klatka({ u, miednica: [k.pelvis[0], k.pelvis[1], 0], pitch: k.pitch, glowa: k.pitch * 0.75, nogi: { R: noga('R', u), L: noga('L', u) }, rece: frame(0, true).rece && { R: { g: [hx, hy, hz], pole: [-1, 0, 0.5] }, L: { g: [hx, hy, -hz], pole: [-1, 0, -0.5] } } });
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: [{ rodzaj: 'podloga', x0: -150, x1: 220 }], klatki: us.map((u) => kl(u)), bledy: [] });
}

/* ---------- Plank Shoulder Taps ---------- */
function shoulderTaps(cw) {
  const A = [0, kostkaNaPalcach(0)]; const hy = 2; const hz = 19; const hx = dlonX({ A, hy, theta0: 12, hzR: hz }); const H = [hx, hy];
  const tr = trajPompki({ A, H, hzR: hz, theta: 12 });
  const okF = (u) => { const k = tr(u); const S = k._S; const z = czysc(k); const dol = (sg) => ({ chwyt: [hx, hy, sg * hz], biegunLokcia: [-1, 0, sg * 0.5] });
    const tap = (sg) => ({ chwyt: rv3([S[0] + 8, S[1] - 8, -sg * 17]), biegunLokcia: [0.2, -1, sg * 0.6] }); /* ręka sg dotyka przeciwnego barku */
    z.rece = u === 0 ? { R: dol(1), L: dol(-1) } : u === 0.5 ? { R: tap(1), L: dol(-1) } : { R: dol(1), L: tap(-1) }; return { ...z, _S: S, _fi: k._fi }; };
  const us = [0, 0.5, 1]; return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: [{ rodzaj: 'podloga', x0: -150, x1: 220 }], klatki: us.map((u) => czysc(okF(u))),
    bledy: [bladZTrajektorii({ cue: 'plank.mis.sag', postawa: true, znacznik: 'pelvis', us, ok: (u) => czysc(okF(u)), zle: (u) => sagZ(okF)(u, 1) })] });
}
const rv3 = (a) => a.map(r1);

/* ---------- Single-Arm Push-Up (jedna ręka podpiera, druga leży na lędźwiach, stopy szeroko) ---------- */
/** Podparcie: dłoń podporowa blisko osi ciała (hOff cm od osi tułowia), stopy szeroko (±fz), tułów przesunięty ku dłoni (pz) — środek ciężkości nad wielokątem podparcia (v2-jakosc: srodek_ciezkosci_podparcie, podstawa_szeroka). */
export function jednaReka(cw, { pz = 6, hOff = 0, fz = 15, poleWolna = [0.3, -0.1, -1], sagDeg = 9 } = {}) {
  const A = [0, kostkaNaPalcach(0)]; const hy = 2; const hzR = pz + hOff; const hx = dlonX({ A, hy, theta0: 12, hzR: hOff }); const H = [hx, hy];
  const mk = (th) => (u) => { const t = th(u); const k = uklad({ A, H, theta: t, hzR: hOff }); const front = [Math.cos(k.pitch * R), -Math.sin(k.pitch * R)]; const upv = up(k.pitch);
    const back = [k.pelvis[0] + upv[0] * 6 - front[0] * 12.5, k.pelvis[1] + upv[1] * 6 - front[1] * 12.5]; /* dłoń leży na lędźwiach (tuż nad grzbietem) */
    return { ...klatka({ u, miednica: [k.pelvis[0], k.pelvis[1], pz], pitch: k.pitch, glowa: k.pitch * 0.75, nogi: { R: { k: [A[0], A[1], pz + fz], pod: POD }, L: { k: [A[0], A[1], pz - fz], pod: POD } },
      rece: { R: { g: [H[0], H[1], hzR], pole: [-1, 0, 0.4] }, L: { g: [back[0], back[1], pz - 3], pole: poleWolna } } }), _S: k.S, _fi: k.fi }; };
  const ok = mk((u) => 12 + 83 * u); return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: [{ rodzaj: 'podloga', x0: -150, x1: 220 }], klatki: US.map((u) => czysc(ok(u))), bledy: [bladSag(ok, sagZ(ok, sagDeg))] });
}

/* ---------- Plyo Push-Up (dół → góra → dłonie w powietrzu) ---------- */
function plyo(cw) {
  const A = [0, kostkaNaPalcach(0)]; const hz = 19; const hy0 = 2; const hx = dlonX({ A, hy: hy0, theta0: 12, hzR: hz }); const unosz = 12;
  const fr = [[0, 12, 0], [0.4, 142, 0], [1, 12, unosz]]; /* góra, dół, wypchnięcie z oderwaniem dłoni (12 cm nad podłogą) */
  const ok = (u) => { const f = fr.find((x) => x[0] === u); const H = [hx, hy0 + f[2]]; return trajPompki({ A, H, hzR: hz, theta: f[1] })(u); };
  const us = fr.map((f) => f[0]); return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: [{ rodzaj: 'podloga', x0: -150, x1: 220 }], klatki: us.map((u) => czysc(ok(u))),
    bledy: [bladZTrajektorii({ cue: 'plank.mis.sag', postawa: true, znacznik: 'pelvis', us, ok: (u) => czysc(ok(u)), zle: (u) => sagZ(ok)(u, 1) })] });
}

/* ---------- Inverted Row (leżąc pod drążkiem, pięty na podłodze) ---------- */
/** Wiosłowanie odwrócone: pięty na podłodze w odległości ax od drążka (ciało sztywne, obrót wokół pięt); na końcu mostek przy drążku (bark ok. 15 cm pod nim, thetaEnd) i łokieć ku podłodze, za linią pleców (v2-jakosc: tor_lokcia_przyciaganie). */
export function inverted(cw, { thetaEnd = 144, pole = [0, -1, 0.15], axOverride = 94 } = {}) {
  const B = BODY(); const by = 100; const hz = 24; const f0 = 9; const Ay = r1(7 + 2); /* pięty na podłodze, palce w górę (podbicie 25) */
  const podb = 25; const f = podb * R; const ay = r1(-(-B.heelBack * Math.sin(f) - B.ankleH * Math.cos(f)) + 0.2); void f0;
  const L = DL + B.trunk; const hanga = (theta) => { const d = dChwytu(theta); const dp = Math.sqrt(d * d - (B.shHalf - hz) ** 2); return dp; };
  const solve = (theta) => { const dp = hanga(theta); const Sy = by - dp; const Ax = Math.sqrt(L * L - (Sy - ay) ** 2); return { Ax, dp }; };
  const ax = axOverride ?? solve(12).Ax; const A = [ax, ay]; const H = [0, by];
  const frame = (u, theta) => { const dp = hanga(theta); const S = przeciecie(A, L, H, dp, 'dol'); if (!S) throw new Error('inverted: brak ułożenia'); const fi = Math.atan2(A[1] - S[1], A[0] - S[0]) / R; /* kierunek od barków ku kostkom */
    const ud = [(S[0] - A[0]) / L, (S[1] - A[1]) / L]; const pelvis = [A[0] + DL * ud[0], A[1] + DL * ud[1]]; const phi = Math.atan2(ud[1], ud[0]) / R; const pitch = 90 - phi; void fi;
    return klatka({ u, miednica: [pelvis[0], pelvis[1], 0], pitch, glowa: pitch, nogi: { R: { k: [A[0], A[1], ZNOG], pod: podb }, L: { k: [A[0], A[1], -ZNOG], pod: podb } }, rece: { R: { g: [H[0], H[1], hz], pole: [pole[0], pole[1], pole[2]] }, L: { g: [H[0], H[1], -hz], pole: [pole[0], pole[1], -pole[2]] } } }); };
  const th = (u) => 12 + (thetaEnd - 12) * u; const us = [0, 0.25, 0.5, 0.75, 1];
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: [{ rodzaj: 'podloga', x0: -60, x1: 220 }, { rodzaj: 'slupek', x: 0, h: by + 5 }, { rodzaj: 'sztanga', x: 0, y: by, talerze: false, podazaZaChwytem: false, dlugosc: 128 }], klatki: us.map((u) => frame(u, th(u))), bledy: [] });
}

/* ---------- Rollouty (sztanga z talerzami toczy się po podłodze; hantle/koła nie) ---------- */
const BAR_Y = 22.5;
/** Rollout z podparciem na kolanach (podłoga albo ławka): kolano K nieruchome, udo i tułów obracają się, ręce proste do sztangi na podłodze. */
export function rolloutKolana(cw, { ławka = 0, fi1 = 14, sag = true, ky = 9.8, dgSag = 8.5, theta = 22, fM = 10, sYf = 0.9, bk = 0.4 } = {}) {
  const B = BODY(); const PODK = -90; const K = [0, ky + ławka]; const ayk = kostkaNaPalcach(ławka, PODK); const al = Math.asin((ayk - K[1]) / B.shank); const A = [K[0] - B.shank * Math.cos(al), ayk];
  const th = theta; const d = dChwytu(th); const dp = Math.sqrt(d * d - (B.shHalf - 20) ** 2);
  const thS = ławka ? 120 : 90; const sY = BAR_Y + dp * sYf; const phS = Math.asin(Math.max(-1, Math.min(1, (sY - K[1] - B.thigh * Math.sin(thS * R)) / B.trunk))) / R; /* start: bark nad sztangą (ręce proste), tułów z zapasu */
  const fiM = fi1 + fM; const sYM = K[1] + (B.thigh + B.trunk) * Math.sin(fiM * R); /* do u = 0,6: udo i tułów schodzą do wspólnego kąta fiM (ciało prawie w linii), potem razem do fi1 (reguła „skrajna” ocenia całą końcówkę) */
  const frame = (u) => { const t = Math.min(1, u / bk); let th0, ph;
    if (u < bk) { th0 = thS + (fiM - thS) * t; const syT = sY + (sYM - sY) * t; ph = Math.asin(Math.max(-1, Math.min(1, (syT - K[1] - B.thigh * Math.sin(th0 * R)) / B.trunk))) / R; }
    else { th0 = ph = fiM + (fi1 - fiM) * ((u - bk) / (1 - bk)); }
    const hip = [K[0] + B.thigh * Math.cos(th0 * R), K[1] + B.thigh * Math.sin(th0 * R)]; const S = [hip[0] + B.trunk * Math.cos(ph * R), hip[1] + B.trunk * Math.sin(ph * R)];
    const yb = BAR_Y; const hxx = S[0] + Math.sqrt(Math.max(1, dp * dp - (S[1] - yb) ** 2));
    return { u, hip, S, pitch: 90 - ph, ph, H: [hxx, yb] }; };
  const mk = (u) => { const f = frame(u); return { ...klatka({ u, miednica: f.hip, pitch: f.pitch, glowa: f.pitch * 0.75, nogi: { R: { k: [A[0], A[1], 8.5], pod: PODK, pole: [1, -0.5, 0.05] }, L: { k: [A[0], A[1], -8.5], pod: PODK, pole: [1, -0.5, -0.05] } },
    rece: { R: { g: [...f.H, 20], pole: [-0.3, -1, 0.3] }, L: { g: [...f.H, -20], pole: [-0.3, -1, -0.3] } } }), _S: f.S, _fi: f.ph, _K: K }; };
  const us = [0, 0.1, 0.2, 0.3, 0.4, 0.55, 0.7, 0.85, 1]; /* 9 klatek */
  const sprzet = [{ rodzaj: 'podloga', x0: -150, x1: 260 }, { rodzaj: 'sztanga', x: 40, y: BAR_Y, talerze: true, podazaZaChwytem: true, dlugosc: 130 }]; if (ławka) sprzet.splice(1, 0, { rodzaj: 'lawka', x: -35, kat: 0, top: ławka, siedzisko: 40, dlugosc: 40 });
  const bledy = [];
  if (sag) bledy.push(bladZTrajektorii({ cue: 'plank.mis.sag', postawa: true, znacznik: 'pelvis', us: [0, 0.2, 0.4, 0.55, 0.7, 0.85, 1], ok: (u) => czysc(mk(u)), zle: (u) => { const k = mk(u); const w = Math.max(0, Math.min(1, (u - 0.55) / 0.45)); const z = czysc(k);
    const S = k._S; const fi = k._fi + dgSag * w; const P = [S[0] - 50 * Math.cos(fi * R), S[1] - 50 * Math.sin(fi * R)]; /* biodra opadają (obrót tułowia wokół barków) dopiero przy wyprostowanym ciele; wcześniej błąd to wygięcie lędźwi (−28°) */
    return { ...z, miednica: [r1(P[0]), r1(P[1]), 0], pochylenieTulowia: r1(90 - fi), zgiecieKregoslupa: -28 }; } }));
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet, klatki: us.map((u) => czysc(mk(u))), bledy });
}
/** Rollout stojąc / z zawieszeniem: stopy na palcach nieruchome (u = 1), bark–kostka w linii; start: pochylenie z prostymi nogami. */
function rolloutStojac(cw, { fi1 = 10, start = 'stojac', uchwytY0 = 100 } = {}) {
  const B = BODY(); const th = 22; const d = dChwytu(th); const dp = Math.sqrt(d * d - (B.shHalf - 20) ** 2); const L = DL + B.trunk;
  const A1 = [0, kostkaNaPalcach(0)]; const S1 = [A1[0] + L * Math.cos(fi1 * R), A1[1] + L * Math.sin(fi1 * R)];
  const fr = (u) => {
    let A, hip, pitch, pod, H, S;
    if (start === 'stojac') { /* z pochylenia (stopy płasko, nogi proste) do rozciągnięcia na palcach; biodra po okręgu wokół kostki, nogi proste */
      pod = POD * u; A = [0, kostkaNaPalcach(0, pod)]; const gam = 90 + (fi1 - 90) * u; hip = [A[0] + DL * Math.cos(gam * R), A[1] + DL * Math.sin(gam * R)]; const pitch0 = 100, pitch1 = 90 - fi1; pitch = pitch0 + (pitch1 - pitch0) * u; const up_ = up(pitch); S = [hip[0] + 50 * up_[0], hip[1] + 50 * up_[1]];
      H = [S[0] + Math.sqrt(Math.max(1, dp * dp - (S[1] - BAR_Y) ** 2)), BAR_Y]; }
    else { /* zawieszenie: kostki na palcach, uchwyty nad podłogą */
      A = A1; pod = POD; const fi = 55 + (fi1 - 55) * u; /* start: pochylenie w uchwytach (uchwyty nad dłońmi ≈ 70 cm), koniec: prawie poziomo */ const dlu = 74 + (DL - 74) * u; /* start z lekko ugiętymi biodrami i kolanami: najdalszy punkt barki–kostka dopiero w u = 1 (reguła „skrajna”) */ S = [A[0] + (dlu + 50) * Math.cos(fi * R), A[1] + (dlu + 50) * Math.sin(fi * R)]; hip = [A[0] + dlu * Math.cos(fi * R), A[1] + dlu * Math.sin(fi * R)]; pitch = 90 - fi;
      const psi = -90 + ((fi1 - 14) - -90) * u; H = [S[0] + dp * Math.cos(psi * R), S[1] + dp * Math.sin(psi * R)]; }
    return { u, A, pod, hip, pitch, S, H, fi: 90 - pitch }; };
  const mk = (u) => { const f = fr(u); return { ...klatka({ u, miednica: f.hip, pitch: f.pitch, glowa: f.pitch * 0.75, nogi: { R: { k: [f.A[0], f.A[1], ZNOG], pod: f.pod }, L: { k: [f.A[0], f.A[1], -ZNOG], pod: f.pod } },
    rece: { R: { g: [...f.H, 20], pole: [-0.3, -1, 0.3] }, L: { g: [...f.H, -20], pole: [-0.3, -1, -0.3] } } }), _S: f.S, _fi: f.fi }; };
  const us = [0, 0.25, 0.5, 0.75, 1];
  const sprzet = [{ rodzaj: 'podloga', x0: -150, x1: 260 }, start === 'stojac' ? { rodzaj: 'sztanga', x: 40, y: BAR_Y, talerze: true, podazaZaChwytem: true, dlugosc: 130 } : { rodzaj: 'zawieszenie', x: r1(fr(0).H[0]), punkt: 'dlonie' }]; /* zawieszenie: taśmy od punktu zaczepu nad dłońmi w u = 0 do dłoni (rodzaj zawieszenie); uchwyty podążają za dłońmi */
  const sagF = (u) => { const k = mk(u); const w = start === 'stojac' ? Math.max(0, Math.min(1, (u - 0.4) / 0.6)) : 1; /* stojąc: biodra są u góry na prostych nogach — opadanie miednicy zgięłoby kolana, więc na początku błąd to wygięcie lędźwi (−28°), a opadanie biodra dochodzi z rozciągnięciem ciała */ if (w === 0) return { ...czysc(k), zgiecieKregoslupa: -28 }; const A = k.nogi.R.kostka; let dg = 11 * w; for (; dg > 3; dg -= 0.25) { const fi = k._fi + dg; const P = [k._S[0] - 50 * Math.cos(fi * R), k._S[1] - 50 * Math.sin(fi * R)]; if (Math.hypot(P[0] - A[0], P[1] - A[1]) <= 82.8) break; }
    const fi = k._fi + dg; const P = [k._S[0] - 50 * Math.cos(fi * R), k._S[1] - 50 * Math.sin(fi * R)]; const z = czysc(k); return { ...z, miednica: [r1(P[0]), r1(P[1]), 0], pochylenieTulowia: r1(90 - fi), ...(start === 'stojac' ? { zgiecieKregoslupa: r1(-28 * (1 - w)) } : {}) }; };
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet, klatki: us.map((u) => czysc(mk(u))), bledy: [bladZTrajektorii({ cue: 'plank.mis.sag', postawa: true, znacznik: 'pelvis', us, ok: (u) => czysc(mk(u)), zle: sagF })] });
}

/** Ćwiczenia, których kontrakt v2 nie potrafi narysować (powód obowiązkowy; do decyzji koordynatora). */
export const WYJATKI = {
  'Suspended Push-Up': 'taśma zawieszenia przenika przedramię o 0,33–0,35 cm (limit 0,3) mimo przebadania ułożeń zaczepu (x −40…60, y 120…260, thetaTop 4…20, biegun łokcia); do decyzji koordynatora: poluzować limit dla rodzaju „zawieszenie” albo zmienić geometrię taśmy',
  'Suspended Fallout': 'taśma zawieszenia przenika przedramię o 0,63–0,65 cm (limit 0,3) w u = 0; jak Suspended Push-Up — do decyzji koordynatora (limit przenikania dla taśm albo geometria zawieszenia)',
  'Side Plank': 'potrzebny obrót tułowia wokół osi długiej (roll): kontrakt ma tylko pochylenie w płaszczyźnie strzałkowej i barki zawsze w poziomie (z = ±19)',
  'Copenhagen Plank': 'deska boczna z nogą na ławce — jak Side Plank wymaga obrotu tułowia wokół osi długiej (roll)',
  'Push Up to Side Plank': 'przejście do deski bocznej wymaga obrotu tułowia wokół osi długiej (roll)',
  'Isometric Wipers': 'przechył ciała na bok (jedno ramię zgięte, drugie proste, barki na różnej wysokości) wymaga obrotu tułowia wokół osi długiej (roll)',
  'Drop Push': 'dwa podwyższenia po bokach (dłonie z podwyższeń na podłogę): sprzęt kontraktu (skrzynia) jest wyśrodkowany w z = 0, nie da się go postawić pod dłońmi poza osią',
  'Incline Push-Up Depth Jump': 'dwa stopnie po bokach barków (dłonie przeskakują na stopnie): sprzęt kontraktu (skrzynia) jest wyśrodkowany w z = 0, nie da się go postawić poza osią',
};
/** Identyfikatory błędów z katalogu bez opisu w lib/cues/text/pl.json (id → powód): manifest nie ma czego opisać; do uzupełnienia przez badacza i tłumacza (poza zakresem pilota). */
export const WYJATKI_OPISU = { 'ro.back': 'zestaw ogólny (cue-sets.json) odwołuje się do wskazówki bez tekstu w lib/cues/text/*.json; tekst do napisania przez badacza, przekład przez tłumacza' };
/** Uwagi: poza wyliczona, ale ćwiczenie przybliżone (do oceny recenzenta). */
export const PRZYBLIZENIA = {
  'Clock Push-Up': 'przybliżenie: pompka z dłońmi przestawionymi przód/tył (zegar); skok i przesunięcie dłoni na kolejne godziny nie są w pojedynczym powtórzeniu pozy',
  'Plyo Push-Up': 'faza lotu: dłonie 12 cm nad podłogą, kostki stoją (ciało nie odrywa palców)',
  'Suspended Push-Up': 'taśmy zawieszenia (rodzaj zawieszenie) od punktu zaczepu nad dłońmi do uchwytów; uchwyty nieruchome w ruchu, w rzeczywistości taśmy się wahają',
  'Suspended Fallout': 'taśmy zawieszenia (rodzaj zawieszenie) od punktu zaczepu nad dłońmi w u = 0; uchwyty podążają za dłońmi, taśmy ustawiają się ukośnie',
  'Inverted Row': 'drążek w stojaku na wysokości 100 cm, chwyt nachwytem szeroki (z = ±24)',
};

/** Wszystkie pozy rodziny: { ćwiczenie: poza }. Każde ćwiczenie to wywołanie typu z parametrami (chwyt, rozstaw, sprzęt, zakres). */
export function generuj() {
  const E = {
    'Push Up': () => pompka('Push Up'),
    'Push-Up Wide': () => pompka('Push-Up Wide', { hz: 33, pole: [-0.5, -0.3, 1], sagDeg: 9 }),
    'Close-Grip Push-Up': () => pompka('Close-Grip Push-Up', { hz: 10, pole: [-1, 0.3, 0.25], blady: ['partial'] }),
    'Diamond Push Up': () => pompka('Diamond Push Up', { hz: 4.5, off: 6, thetaDol: 138, pole: [-0.6, 0.6, 1], blady: [] }),
    'Decline Push Up': () => pompka('Decline Push Up', { hz: 22, boxStopy: 30, thetaDol: 146, blady: ['partial'] }),
    'Incline Push Up': () => pompka('Incline Push Up', { hz: 22, off: -18, boxRece: 45, thetaDol: 148, blady: [] }),
    'Incline Push-Up Close-Grip': () => pompka('Incline Push-Up Close-Grip', { hz: 10, off: -18, pole: [-1, 0.3, 0.25], boxRece: 45, blady: ['partial'] }),
    'Single-Arm Push-Up': () => jednaReka('Single-Arm Push-Up'),
    'Plank': () => plank('Plank'),
    'Mountain Climbers': () => mountain('Mountain Climbers'),
    'Plank Shoulder Taps': () => shoulderTaps('Plank Shoulder Taps'),
    'Plyo Push-Up': () => plyo('Plyo Push-Up'),
    'Clock Push-Up': () => pompka('Clock Push-Up', { hz: 22, thetaTop: 24, blady: ['partial'], rece: (u, k, h) => ({ R: { g: [h[0] + 9, h[1], 24], pole: [-1, -0.3, 0.35], obrot: -20 }, L: { g: [h[0] - 9, h[1], -20], pole: [-1, -0.3, -0.35], obrot: -20 } }) }), /* zegar: jedna dłoń o 9 cm przed osią barków, druga 9 cm za nią (godziny 12 i 6); pronacja przedramion */
    'Suspended Push-Up': () => pompka('Suspended Push-Up', { hz: 22, hy: 45, off: -18, sprzetRece: (H) => ({ rodzaj: 'zawieszenie', x: r1(H[0] - 16.6), y: 170, punkt: 'dlonie' }), blady: ['partial', 'sag'] }), /* punkt zaczepu 16,6 cm za dłońmi, 170 cm wysoko: najlepsze z przebadanych ułożeń (x −40…60, y 120…260, thetaTop 4…20, pole łokcia); nadal przenikanie przedramię × taśma 0,33 cm (limit 0,3) w u = 0 */
    'Suspended Fallout': () => rolloutStojac('Suspended Fallout', { start: 'zaw', fi1: 6 }),
    'Inverted Row': () => inverted('Inverted Row'),
    'Rollout (sztanga)': () => rolloutKolana('Rollout (sztanga)', { fi1: 22, ky: 9.8, dgSag: 11, fM: 8, sYf: 0.8, bk: 0.3 }),
    'Barbell Rollout from Bench': () => rolloutKolana('Barbell Rollout from Bench', { ławka: 42, fi1: 10, ky: 13, dgSag: 7, fM: 4 }),
    'Standing Barbell Rollout': () => rolloutStojac('Standing Barbell Rollout', { start: 'stojac' }),
  };
  return E;
}
