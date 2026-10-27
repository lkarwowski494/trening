// Generator póz rodziny leg_machine po stronie agenta (wersja 1.1, 26.10.2026): suwnice i maszyny nóg (leg press, hack squat, wahadło, belt squat, wspięcia na suwnicy).
// Pozy WYLICZONE z modelu: miednica na siedzisku/podkładce, platforma pozioma (stopa pionowo na niej: podbicie 90°), kolano z odległości biodro–kostka; maszyny jako dzwignia (prowadnica albo obrót) z punktem na kostkach / miednicy.
// Błąd sq.mis.kneesIn (kolana do środka) = odchylenieKolana do środka przy stopach nieruchomych na platformie/podłodze: łamie wyłącznie regułę „kolana_nad_stopami” (grupa kolana).
import { v2, BODY, R, r1, lerp, ease, HIP, SH, ZASIEG_R, dNogi, rPlan, hipY, tp, S, reka, K, poza, PODLOGA, kolano2D, katXY, bladZTrajektorii, przeciecie, kostkaStopyY } from './dol.mjs';

export const RODZINA = 'leg_machine';
/** Kolano do środka w dole (stopnie odchylenia kolana, ujemne = do środka), recenzja p2-r2, B2: −24° przenikało i krzyżowało nogi. Wartość = największa, przy której odstęp ud i goleni ≥ −1,5 cm (strażnik tests/figury-p2-r3.test.ts)
 * i wiersz nadal różni się od pozy poprawnej o ≥ 5 cm w widoku z przodu. Przy −10…−12° przekrój uda (7,6 cm) przy biodrach ±8,5 cm daje przenikanie 5–7 cm (kolana z ≈ 4 cm), dlatego −6,4 (wahadło, leżąca; przy −7 uda nachodziły o 0,6 cm, a poniżej −6,3 wiersz różni się z przodu o < 5 cm; strażnik z tolerancją 0, p2-r4) i −8 (belt squat). */
const KOLANO_DO_SRODKA_DOL = -6.4;
const KOLANO_DO_SRODKA_BELT = -8;
const ZS = 13; const th = () => BODY().thigh, sh = () => BODY().shank;
const poleKolana = (hip, ankle, knee) => { const mid = hip.map((v, i) => (v + ankle[i]) / 2); const d = knee.map((v, i) => v - mid[i]); const l = Math.hypot(...d) || 1; return d.map((v) => r1(v / l * 100) / 100); };
const zloz = (cw, spr, kl, bl) => { const z = poza(RODZINA, cw, spr, kl, bl); for (const b of z.bledy) if (!b.dotyczy.includes('kneeLat')) b.dotyczy.push('kneeLat'); return z; };

/** Suwnica pozioma (siad, oparcie 80°): stopy pionowo na platformie, platforma jedzie wzdłuż x; kolano od kPocz do kKon. jednonoz: pracuje prawa noga. calf: wspięcie na platformie (kulą stopy). */
export function suwnica(cw, o = {}) {
  const { kPocz = 86, kKon = 15, jednonoz = false, calf = false, bledy = true } = o; const pary = !jednonoz && !calf; const E = v2(); const kat = 80; const top = 37.8; const hp = E.benchHip(kat, top); const m = [hp[0], hp[1]]; const p = kat - 90;
  const us = [0, 0.25, 0.5, 0.75, 1]; const dy = 4; const GAM = -15; const gx = Math.cos(GAM * R), gy = Math.sin(GAM * R);
  const dzh = (z) => (z > 0 ? HIP() - z : -HIP() - z); const aK = (u, z) => { const K1 = lerp(kPocz, kKon, ease(u)); const rr = rPlan(dNogi(K1), dzh(z)); const x00 = m[0] + Math.sqrt(Math.max(1, rPlan(dNogi(kPocz), dzh(z)) ** 2 - dy * dy)); const y00 = m[1] + dy; let lo = 0, hi = 90; for (let i = 0; i < 40; i++) { const sm = (lo + hi) / 2; const d = Math.hypot(x00 + sm * gx - m[0], y00 + sm * gy - m[1]); if (d < rr) lo = sm; else hi = sm; } const sm = (lo + hi) / 2; return [x00 + sm * gx, y00 + sm * gy, z]; };
  const mk = (u, blad = false) => {
    let aR, aL, podR = 90 + GAM, podL = 90 + GAM; const zr = ZS, zl = -ZS;
    if (calf) { const c = calfPunkt(m, u, 40); aR = [c.ax, c.ay, zr]; aL = [c.ax, c.ay, zl]; podR = podL = c.pod; }
    else { aR = aK(u, zr); aL = jednonoz ? [m[0] + 38, 7, zl] : aK(u, zl); if (jednonoz) podL = 0; if (blad) { const e = u; aR[2] += 0; void e; } }
    const hipR = [m[0], m[1], HIP()], hipL = [m[0], m[1], -HIP()];
    const grip = (sg) => ({ g: [m[0] + 10, top + 4, sg * 22], pole: [-0.2, -0.5, sg] });
    const kn = (hip, an, sg) => { const k2 = kolano2D([hip[0], hip[1]], [an[0], an[1]], [0.2, 1]); return [k2[0], k2[1], sg * (pary ? ZS : HIP() + 2)]; }; /* Leg Press (obie nogi): kolana nad stopami (z kostki). Suwnice pokazujemy tylko z boku, gdzie „kolana do środka” różni się o < 1 cm, więc wiersza błędu nie ma (tekst błędu na karcie zostaje; p2-r4, B3) */
    return K({ u, m, p, head: p, R: { a: aR, pod: podR, rot: 0, pole: poleKolana(hipR, aR, kn(hipR, aR, 1)) }, L: { a: aL, pod: podL, rot: 0, pole: poleKolana(hipL, aL, kn(hipL, aL, -1)) }, hr: grip(1), hl: grip(-1) });
  };
  const fr = us.map((u) => mk(u));
  const A0 = calf ? (() => { const c = calfPunkt(m, 0, 40); return [c.ax, c.ay]; })() : aK(0, 0);
  const A1 = calf ? (() => { const c = calfPunkt(m, 1, 40); return [c.ax, c.ay]; })() : aK(1, 0);
  const kat0 = calf ? r1(katXY(A0, A1)) : 0; const dl = calf ? Math.hypot(A1[0] - A0[0], A1[1] - A0[1]) + 6 : A1[0] - A0[0] + 6;
  const dzw = calf ? (() => { /* obrót: okrąg o promieniu 60 przez punkty początkowy i końcowy ścieżki kostki */ const mid = [(A0[0] + A1[0]) / 2, (A0[1] + A1[1]) / 2]; const ch = Math.hypot(A1[0] - A0[0], A1[1] - A0[1]); const h = Math.sqrt(60 * 60 - (ch / 2) ** 2); const nrm = [-(A1[1] - A0[1]) / ch, (A1[0] - A0[0]) / ch]; const P1 = [mid[0] + nrm[0] * h, mid[1] + nrm[1] * h], P2 = [mid[0] - nrm[0] * h, mid[1] - nrm[1] * h]; const P = P1[1] > P2[1] ? P1 : P2; return { rodzaj: 'dzwignia', tryb: 'obrot', punkt: 'kostki', trzyma: 'obie', x: r1(P[0]), y: r1(P[1]), z: 0, dlugosc: 60 }; })() : { rodzaj: 'dzwignia', tryb: 'prosta', kat: GAM, punkt: 'kostki', trzyma: jednonoz ? 'R' : 'obie', x: r1(A0[0]), y: r1(A0[1]), z: jednonoz ? ZS : 0, dlugosc: r1(Math.max(12, Math.hypot(A1[0] - A0[0], A1[1] - A0[1]) + 6)) };
  const spr = [PODLOGA(-60, 200), { rodzaj: 'lawka', x: r1(m[0] - 8.5), top, kat, siedzisko: 40, dlugosc: 75 }, dzw];
  const bl = bledy ? (calf ? [bladZTrajektorii({ cue: 'calf.mis.partial', znacznik: 'heels', us, ok: (u) => fr[us.indexOf(u)], zle: (u) => { const k = JSON.parse(JSON.stringify(fr[us.indexOf(u)])); void k; return mkCalfPartial(m, top, p, u); } })] : []) : [];
  return zloz(cw, spr, fr, bl);
}
/** Wspięcie na suwnicy: stopa obraca się wokół kuli stopy (12 cm od kostki) na platformie, która się przesuwa tak, by nogi zostały prawie proste (odległość biodro–kostka 80 cm). podKon = podbicie na końcu. */
function calfPunkt(m, u, podKon) {
  const pod = lerp(90, podKon, ease(u)); const f = pod * R; const ay = 46 + 12 * (1 - Math.sin(f)) * 0.7 + 7 * Math.cos(f) * 0.7; const dy = ay - m[1]; const ax = m[0] + Math.sqrt(Math.max(1, 82.3 ** 2 - dy * dy - 4.5 ** 2)); return { pod, ay, ax };
}
/** Wspięcie na suwnicy w wersji płytkiej (błąd): podbicie tylko do 88°. */
function mkCalfPartial(m, top, p, u) {
  const c = calfPunkt(m, u, 88); const pod = c.pod, ay = c.ay, ax = c.ax;
  const grip = (sg) => ({ g: [m[0] + 10, top + 4, sg * 22], pole: [-0.2, -0.5, sg] }); const hipR = [m[0], m[1], HIP()], hipL = [m[0], m[1], -HIP()]; const aR = [ax, ay, ZS], aL = [ax, ay, -ZS];
  const kn = (hip, an, sg) => { const k2 = kolano2D([hip[0], hip[1]], [an[0], an[1]], [0.2, 1]); return [k2[0], k2[1], sg * (HIP() + 2)]; };
  return K({ u, m, p, head: p, R: { a: aR, pod, rot: 10, pole: poleKolana(hipR, aR, kn(hipR, aR, 1)) }, L: { a: aL, pod, rot: 10, pole: poleKolana(hipL, aL, kn(hipL, aL, -1)) }, hr: grip(1), hl: grip(-1) });
}

/** Okrąg przez trzy punkty: { P, r }. */
function okrag3(A, B, C) { const d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1])); const a2 = A[0] ** 2 + A[1] ** 2, b2 = B[0] ** 2 + B[1] ** 2, c2 = C[0] ** 2 + C[1] ** 2; const x = (a2 * (B[1] - C[1]) + b2 * (C[1] - A[1]) + c2 * (A[1] - B[1])) / d, y = (a2 * (C[0] - B[0]) + b2 * (A[0] - C[0]) + c2 * (B[0] - A[0])) / d; return { P: [x, y], r: Math.hypot(A[0] - x, A[1] - y) }; }
/** Okrąg o promieniu rho przez punkty A i B (środek po stronie o większym y). */
function srodekOkregu(A, B, rho) { const mid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; const ch = Math.hypot(B[0] - A[0], B[1] - A[1]); const h = Math.sqrt(Math.max(0, rho * rho - (ch / 2) ** 2)); const n = [-(B[1] - A[1]) / ch, (B[0] - A[0]) / ch]; const P1 = [mid[0] + n[0] * h, mid[1] + n[1] * h], P2 = [mid[0] - n[0] * h, mid[1] - n[1] * h]; const ok = [P1, P2].filter((q) => q[1] >= 0); const cand = ok.length ? ok : [P1[1] > P2[1] ? P1 : P2]; return cand.reduce((a, b) => (a[0] < b[0] ? a : b)); }

/** Promień łuku miednicy w wahadle (cm). Oparcie jest nieruchome i proste (styczne do łuku), więc promień musi być na tyle duży, by odchylenie łuku od prostej mieściło się w tolerancji styku pleców (1,5 cm): przy 100 cm odchylenie ±1,2 cm. Uproszczenie ilustracyjne (rzeczywiste ramię wahadła jest krótsze, a oparcie obraca się z nim) — PRZYBLIZENIA. */
const RHO_WAHADLA = 100;
/** Oparcie maszyny (recenzja 1.1, partia 2, nr 1–3): nieruchoma ławka (`lawka`) pod kątem 90° − alfa od poziomu, równoległa do osi tułowia, z powierzchnią 10,2 cm za osią tułowia (BENCH.padBack) w połowie rozrzutu ścieżki miednicy;
 * sięga od ok. 12 cm poniżej najniższej miednicy do 8 cm ponad barki w najwyższej pozycji (ale nie więcej niż 120 cm). Samo oparcie, bez siedziska (siedzisko = SEAT_LEN.min, 2 cm): siedzisko 20 cm przenikałoby golenie w przysiadzie leżąc. Sanie/ramię wahadła to w rysunku nieruchome oparcie, po którym ślizga się plecami osoba (przybliżenie). */
function oparcie(alfa, fr) {
  const a = alfa * R; const dir = [-Math.sin(a), Math.cos(a)]; const nF = [Math.cos(a), Math.sin(a)]; const B = v2().BENCH.padBack;
  const P = fr.map((k) => k.miednica); const ns = P.map((p) => p[0] * nF[0] + p[1] * nF[1]); const ts = P.map((p) => p[0] * dir[0] + p[1] * dir[1]);
  const cn = (Math.max(...ns) + Math.min(...ns)) / 2 - B; const tMin = Math.min(...ts) - 12; const tMax = Math.max(...ts) + BODY().trunk + 8;
  const H = [nF[0] * cn + dir[0] * tMin, nF[1] * cn + dir[1] * tMin];
  return { rodzaj: 'lawka', x: r1(H[0]), top: r1(H[1]), kat: r1(90 - alfa), siedzisko: v2().SEAT_LEN.min, dlugosc: r1(Math.min(120, tMax - tMin)) };
}

/** Hack squat i pochodne (leżąca/wahadło): plecy na pochylonej podkładce (alfa od pionu), podkładka jedzie w dół i do przodu, stopy płasko na platformie (pięty nieruchomo). pend: ruch po łuku (dźwignia obrotowa). */
export function hack(cw, o = {}) {
  const { alfa = 25, yb = 44, kb = 100, kt = 20, pend = false, bledy = true, odchBlad = KOLANO_DO_SRODKA_DOL } = o; const dz = HIP() - ZS; const a = alfa * R;
  const rb = rPlan(dNogi(kb), dz), rt = rPlan(dNogi(kt), dz); const dxB = Math.sqrt(rb * rb - (yb - 7) ** 2); const A = [dxB, 7]; const B = [0, yb];
  let lo = 0, hi = 80; for (let i = 0; i < 50; i++) { const sm = (lo + hi) / 2; const T = [B[0] - sm * Math.sin(a), B[1] + sm * Math.cos(a)]; if (Math.hypot(T[0] - A[0], T[1] - A[1]) < rt) lo = sm; else hi = sm; } const sT = (lo + hi) / 2 - 0.2;
  const T = [B[0] - sT * Math.sin(a), B[1] + sT * Math.cos(a)];
  const us = [0, 0.25, 0.5, 0.75, 1]; let rho = pend ? RHO_WAHADLA : 140; let P = srodekOkregu(T, B, rho); let thT = Math.atan2(T[1] - P[1], T[0] - P[0]), thB = Math.atan2(B[1] - P[1], B[0] - P[0]);
  const pelv = (u) => { const e = ease(u); if (true) { const th_ = lerp(thT, thB, e); return [P[0] + rho * Math.cos(th_), P[1] + rho * Math.sin(th_)]; } const sm = sT * (1 - e); return [B[0] - sm * Math.sin(a), B[1] + sm * Math.cos(a)]; };
  if (!pend) { /* ścieżka po łuku zamiast po prostej: różnica < 1 cm */ }
  const mk = (u) => { const m = pelv(u); const grip = (sg) => ({ g: [m[0] + 12, m[1] + 6, sg * 24], pole: [-0.2, -0.5, sg] });
    return K({ u, m, p: -alfa, head: -alfa * 0.8, R: { a: [A[0], 7, ZS], pod: 0, rot: 10, odch: 6 }, L: { a: [A[0], 7, -ZS], pod: 0, rot: 10, odch: 6 }, hr: grip(1), hl: grip(-1) }); };
  const fr = us.map(mk);
  /* prowadnica jako łuk o bardzo dużym promieniu (≈ prosta): tryb „prosta” dopuszcza kąt prowadnicy tylko od −45° do 90° */
  const dzw = { rodzaj: 'dzwignia', tryb: 'obrot', punkt: 'miednica', trzyma: 'R', x: r1(P[0]), y: r1(P[1]), z: 0, dlugosc: rho };
  const kn = bledy ? { cue: 'sq.mis.kneesIn', znacznik: 'knees', dotyczy: ['kneeLat'], klatki: us.map((u) => (u === 0 ? { u: 0 } : { u, nogi: { R: { odchylenieKolana: r1(odchBlad * u) }, L: { odchylenieKolana: r1(odchBlad * u) } } })) } : null;
  const spr = [PODLOGA(-90, 110), oparcie(alfa, fr), dzw];
  return zloz(cw, spr, fr, kn && /Hack Squat|Lying|Pendulum/.test(cw) && cw !== 'Hack Squat' ? [kn] : []);
}

/** Belt squat (przysiad z pasem na maszynie): przysiad bez sztangi, miednica po łuku w dół i do tyłu, tułów pochyla się, dźwignia obrotowa z punktem na miednicy. */
export function belt(cw, o = {}) {
  const { kb = 108, th1 = 58, bledy = true } = o; const us = [0, 0.25, 0.5, 0.75, 1];
  const hipXY = (K1, ths) => { const kn = [41 * Math.cos(ths * R), 7 + 41 * Math.sin(ths * R)]; return [kn[0] + 42 * Math.cos((ths + K1) * R), kn[1] + 42 * Math.sin((ths + K1) * R)]; };
  const ths = (u) => lerp(87, th1, ease(u)); const Ku = (u) => lerp(10, kb, ease(u));
  const mk = (u, lift = 0) => { const h = hipXY(Ku(u), ths(u)); const m = [h[0], h[1] + lift]; const pit = lerp(4, 30, ease(u)); const Sx = S(m, pit);
    const grip = (sg) => ({ g: [Sx[0] + 18, Sx[1] - 16, sg * 22], pole: [0, -1, sg * 0.5] }); const pod = lift ? -Math.asin(lift / 25) / R : 0;
    return K({ u, m, p: pit, head: pit * 0.4, R: { a: [0, 7 + lift, ZS], pod, rot: 10, odch: 6 }, L: { a: [0, 7 + lift, -ZS], pod, rot: 10, odch: 6 }, hr: lift ? { g: [grip(1).g[0], grip(1).g[1], grip(1).g[2]], pole: grip(1).pole } : grip(1), hl: grip(-1) }); };
  const fr = us.map((u) => mk(u)); const pts = [0, 0.5, 1].map((u) => [fr[us.indexOf(u === 0.5 ? 0.5 : u)].miednica[0], fr[us.indexOf(u)].miednica[1]]);
  const oc = okrag3(pts[0], pts[1], pts[2]); const Pc = oc.P; const rho = Math.min(150, Math.max(20, oc.r));
  const spr = [PODLOGA(-90, 110), { rodzaj: 'dzwignia', tryb: 'obrot', punkt: 'miednica', trzyma: 'R', x: r1(Pc[0]), y: r1(Pc[1]), z: 0, dlugosc: r1(rho) }];
  const heels = { cue: 'sq.mis.heels', znacznik: 'heels', dotyczy: ['heel'], klatki: us.map((u) => { if (u === 0) return { u: 0 }; const h = 5.7 * u; const sg = (x) => x; return { u, miednica: [0, r1(h), 0], nogi: { R: { kostka: [0, r1(h), 0], podbicie: r1(-Math.asin(h / 25) / R) }, L: { kostka: [0, r1(h), 0], podbicie: r1(-Math.asin(h / 25) / R) } }, rece: { R: { chwyt: [0, r1(h), 0] }, L: { chwyt: [0, r1(h), 0] } } }; }) };
  const knees = { cue: 'sq.mis.kneesIn', znacznik: 'knees', dotyczy: ['kneeLat'], klatki: us.map((u) => (u === 0 ? { u: 0 } : { u, nogi: { R: { odchylenieKolana: r1(KOLANO_DO_SRODKA_BELT * u) }, L: { odchylenieKolana: r1(KOLANO_DO_SRODKA_BELT * u) } } })) };
  return zloz(cw, spr, fr, bledy ? [knees, heels] : []);
}

export const WYJATKI = {
  'Smith Machine Leg Press': 'stopy pchają sztangę Smitha leżąc pod nią, a sztanga w kontrakcie jest zawsze trzymana dłońmi (chwyt dłoni na osi gryfu w każdej klatce) — ćwiczenie bez rąk na sztandze nie da się narysować',
};
export const PRZYBLIZENIA = {
  'Hack Squat': 'przybliżenie: oparcie maszyny jako nieruchoma ławka skośna (plecy ślizgają się po niej); sanie, poduszki barkowe i platforma pod stopami niemodelowane (stopy stoją na podłodze)',
  'Pendulum Squat': 'przybliżenie: jak Hack Squat; łuk wahadła o promieniu 100 cm (rzeczywiste ramię krótsze) i nieruchome oparcie — pochylenie tułowia nie zmienia się wzdłuż łuku',
  'Lying Machine Squat': 'przybliżenie: jak Hack Squat, oparcie pochylone 42° od poziomu (leżąc na pochyłym oparciu); sanie, poduszki barkowe i platforma niemodelowane',
  'Leg Press': 'przybliżenie: suwnica pozioma (siad, platforma pionowa): stopa nie ma w modelu palców skierowanych do tyłu, więc platformy nachylonej 45° nie da się oprzeć o podeszwę',
  'Single Leg Press': 'przybliżenie: suwnica pozioma (siad, platforma pionowa); noga wolna stoi na podłodze obok',
  'Calf Press (leg press)': 'przybliżenie: suwnica pozioma; stopa obraca się wokół kuli stopy na dolnej krawędzi platformy',
};
export function generuj() {
  return {
    'Leg Press': () => suwnica('Leg Press'),
    'Single Leg Press': () => suwnica('Single Leg Press', { jednonoz: true }),
    'Calf Press (leg press)': () => suwnica('Calf Press (leg press)', { calf: true }),
    'Hack Squat': () => hack('Hack Squat', { alfa: 25 }),
    'Pendulum Squat': () => hack('Pendulum Squat', { alfa: 25, pend: true }),
    'Lying Machine Squat': () => hack('Lying Machine Squat', { alfa: 48 }),
    'Belt Squat Machine': () => belt('Belt Squat Machine'),
  };
}
