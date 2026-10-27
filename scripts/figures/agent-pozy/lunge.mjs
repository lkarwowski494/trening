// Generator póz rodziny lunge po stronie agenta (wersja 1.1, 26.10.2026): wykroki, przysiad bułgarski, wejścia na podwyższenie, przysiady jednonóż, ruchy boczne.
// Pozy WYLICZONE z modelu: odległość biodro–kostka z prawa cosinusów (kolano wyznacza IK silnika), tylna stopa na palcach (kostka z podbiciePalcow), ciężar w rękach wynika z chwytu.
// Błąd z cue (lunge.mis.kneeIn / sq.mis.kneesIn): kolano uciekające do środka — delta odchylenia kolana przedniej nogi; łamie wyłącznie regułę „kolano_nad_stopa” (grupa kolana).
import { v2, BODY, R, r1, lerp, ease, HIP, SH, ZASIEG_R, dNogi, rPlan, hipY, tp, S, reka, K, poza, PODLOGA, przeciecie, bladKolanaDoSrodka, podAuto, miednicaZNog, znajdzY, katXY, kolano2D, kostkaStopyY } from './dol.mjs';

export const RODZINA = 'lunge';
const ODCH = 6; /* odchylenie kolana na zewnątrz (stopnie): kolano prawie w linii stopy; ucieczka do środka = delta ujemna */
const ZS = 10; /* połowa rozstawu kostek w z (cm): stopy pod biodrami (biodra ±8,5) */
const kostkaPlasko = (top = 0) => top + BODY().ankleH;

/** Chwyty rąk wg obciążenia. m = miednica [x, y], p = pochylenie tułowia. Zwraca { hr, hl, sprzet }. */
function obciazenie(tryb, m, p, bend = 0) {
  const Sx = S(m, p, bend); const zo = m[2] ?? 0;
  switch (tryb) {
    case 'hantle': { const f = reka(Sx, { z: 26, d: ZASIEG_R() - 1.5, dx: 2 }); return { hr: f(1), hl: f(-1), sprzet: [{ rodzaj: 'hantel' }] }; }
    case 'kb': { const g = (sg) => ({ g: [Sx[0] + 3, Sx[1] - 57, sg * 4], pole: [0.2, -1, sg * 0.3] }); return { hr: g(1), hl: g(-1), sprzet: [{ rodzaj: 'kettlebell', dzwon: 'dol' }] }; } /* oba ręce na rączce, kettlebell zwisa pod barkami */
    case 'sztanga': case 'smith': { const g = (sg) => ({ g: tp(m, p, BODY().trunk - 3, -12.8, zo + sg * 32), pole: [-0.7, -1, sg * 0.5] }); return { hr: g(1), hl: g(-1), sprzet: [{ rodzaj: 'sztanga', talerze: true, podazaZaChwytem: true, dlugosc: 220 }] }; }
    case 'linki': { const f = reka(Sx, { z: 24, d: ZASIEG_R() - 4 }); return { hr: f(1), hl: f(-1), sprzet: [] }; }
    case 'piers': { const g = (sg) => ({ g: [Sx[0] + 17, Sx[1] - 13, zo + sg * 4], pole: [0, -1, sg * 0.4] }); return { hr: g(1), hl: g(-1), sprzet: [] }; } /* dłonie złączone przed klatką */
    case 'przod': { const g = (sg) => ({ g: [Sx[0] + 58, Sx[1] - 4, zo + sg * 10], pole: [0, -1, sg * 0.3] }); return { hr: g(1), hl: g(-1), sprzet: [] }; } /* ręce przed sobą (równowaga) */
    default: { const g = (sg) => ({ g: [m[0] - 3, m[1] + 10, zo + sg * 21], pole: [-0.5, 0, sg] }); return { hr: g(1), hl: g(-1), sprzet: [] }; } /* dłonie na biodrach */
  }
}
/** Klatka kontraktu z opisu nóg i obciążenia. */
function ramka({ u, m, p, bend = 0, aR, aL, podR = 0, podL = 0, tryb, glowa, poleR, poleL, rotR, rotL, odchR = ODCH, odchL = ODCH, rece, boczne }) {
  const o = rece ? { hr: rece.hr, hl: rece.hl, sprzet: rece.sprzet ?? [] } : obciazenie(tryb, m, p, bend);
  return { f: K({ u, m, p, bend, head: glowa ?? p * 0.4, R: { a: aR, pod: podR, pole: poleR, rot: rotR, odch: odchR }, L: { a: aL, pod: podL, pole: poleL, rot: rotL, odch: odchL }, hr: o.hr, hl: o.hl, boczne }), o };
}
const kl = (r) => r.f;

/** Geometria pozycji dolnej wykroku/przysiadu wykrocznego względem kostki przedniej (x = 0): miednica na wysokości yDol, tylna stopa na palcach (podbicie z zakresu kostki). */
/** Tylna stopa grzbietem na ławce (decyzja właściciela 27.10.2026; poprzednio na palcach). Konwencja w jednym miejscu: STOPA_GRZBIETEM w lib/figures/v2/contract.ts (oś kostka→palce ≤ 30° do siedziska, palce na blacie ± 3 cm; tu: wybrane wartości w tych granicach). */
const STOPA_GRZBIET_DEG = v2().STOPA_GRZBIETEM.nachylenieDeg; const STOPA_GRZBIET_PALCE_NAD_BLATEM_CM = v2().STOPA_GRZBIETEM.palceNadBlatemCm;
/** Kostka i podbicie tylnej stopy leżącej grzbietem na ławce o wysokości top (silnik: podbicie 180° + a = palce do tyłu i w dół o a°). */
function stopaGrzbietem(top) { const b = BODY(); const a = STOPA_GRZBIET_DEG * R; return { pod: 180 + STOPA_GRZBIET_DEG, y: r1(top + STOPA_GRZBIET_PALCE_NAD_BLATEM_CM - (b.ankleH * Math.cos(a) - b.toeFwd * Math.sin(a))) }; }
function geom({ kPrzod1 = 95, kTyl1 = 85, yDol = 50, topTyl = 0, topPrzod = 0, zTyl = -ZS, zPrzod = ZS, poleTyl = [0.15, -1], tylWisi = 0, grzbiet = false }) {
  const aF = [0, kostkaPlasko(topPrzod), zPrzod];
  const rF = rPlan(dNogi(kPrzod1), HIP() - zPrzod); const x = r1(-Math.sqrt(Math.max(1, rF * rF - (yDol - aF[1]) ** 2)));
  const rT = rPlan(dNogi(kTyl1), -HIP() - zTyl); let pb = { pod: -50, y: 20 }; let ax = 0;
  if (tylWisi) { for (let i = 0; i < 6; i++) { ax = r1(x - Math.sqrt(Math.max(1, rT * rT - (yDol - tylWisi) ** 2))); const kn = kolano2D([x, yDol], [ax, tylWisi], poleTyl); pb = { pod: r1(Math.max(-60, Math.min(20, katXY([ax, tylWisi], kn) - 84))), y: tylWisi }; } }
  else if (grzbiet) { pb = stopaGrzbietem(topTyl); ax = r1(x - Math.sqrt(Math.max(1, rT * rT - (yDol - pb.y) ** 2))); }
  else for (let i = 0; i < 6; i++) { ax = r1(x - Math.sqrt(Math.max(1, rT * rT - (yDol - pb.y) ** 2))); pb = podAuto([x, yDol], ax, topTyl, poleTyl, { zapas: 4 }); }
  return { x, yDol, aF, aT: [ax, pb.y, zTyl], podT: pb.pod, L: -ax };
}
const POLE_TYL = (z = -0.1) => [0.15, -1, z]; /* tylne kolano w dół ku podłodze */
const bladKolana = (us, cw, strony = ['R'], dosrodka = 55) => bladKolanaDoSrodka({ cue: cw === 'Pistol Squat' ? 'sq.mis.kneesIn' : 'lunge.mis.kneeIn', us, dosrodka, strony });
/** Błąd kolana z dowolnym profilem [[u, stopnie do środka]] (np. gdy noga jest zgięta tylko w początku ruchu). */
const bladKolanaProfil = (prof, cw, strony = ['R']) => ({ cue: cw === 'Pistol Squat' ? 'sq.mis.kneesIn' : 'lunge.mis.kneeIn', znacznik: 'knees', dotyczy: ['kneeLat'], klatki: prof.map(([u, w]) => (u === 0 ? { u: 0 } : { u, nogi: Object.fromEntries(strony.map((sd) => [sd, { odchylenieKolana: -w }])) })) });
/** Składa pozę, dopisuje kneeLat do „dotyczy” błędów (kontrakt nie liczy go z kątów). */
function zloz(cw, sprzet, klatki, bledy) { const z = poza(RODZINA, cw, sprzet, klatki, bledy); for (const b of z.bledy) if (!b.dotyczy.includes('kneeLat')) b.dotyczy.push('kneeLat'); return z; }

/* ---------- przysiad wykroczny w miejscu: stopy nieruchome, miednica pionowo (split squat, bułgarski, linki, zawieszenie, Smith) ---------- */
export function splitSquat(cw, o = {}) {
  const { tryb = 'cc', pitch = 6, bledy = true, sprzetFn = null, hipMin = -14.5, rotL = 0, yDol = 50, rece = null, topTyl = 0, grzbiet = false } = o;
  const g = geom({ ...o, yDol, topTyl, grzbiet });
  const poleL = POLE_TYL();
  const mk = (y, u = 0) => ramka({ u, m: [g.x, y], p: pitch, aR: g.aF, aL: g.aT, podR: 0, podL: g.podT, tryb, poleL, rotL, rece: rece?.(g, y, u) });
  const yGora = znajdzY((y) => mk(y).f, (sk, ja) => ja('L').hip >= hipMin && ja('R').knee >= 8 && sk.legs.L.knee[1] < 70, hipY(g.aF, g.x, HIP(), 8), yDol + 8);
  const us = [0, 0.25, 0.5, 0.75, 1];
  const rr = us.map((u) => mk(lerp(yGora, yDol, ease(u)), u));
  const spr = [PODLOGA(g.aT[0] - 70, 150), ...rr[0].o.sprzet, ...(sprzetFn ? sprzetFn(g, rr[0].f) : [])];
  return zloz(cw, spr, rr.map(kl), bledy ? [bladKolana(us, cw)] : []);
}

/* ---------- krok: wykrok w tył (stopa tylna się przesuwa) albo w przód (stopa przednia się przesuwa); u = 0 stanie ---------- */
export function krok(cw, o = {}) {
  const { kierunek = 'tyl', tryb = 'cc', pitch = 6, bledy = true, sprzetFn = null, topPrzod = 0, rece = null, crossover = false, pitchFn = null, slizg = false } = o;
  const g0 = geom({ ...o, topPrzod, topTyl: slizg ? 2 : 0, zTyl: crossover ? 22 : -ZS, poleTyl: crossover ? [0.3, -1] : [0.15, -1] });
  const przod = kierunek === 'przod';
  /* współrzędne: kostka planowana w x = 0; w wykroku w tył planowana jest PRZEDNIA (R), w przód — TYLNA (L) */
  const dx = przod ? g0.L : 0; /* przesunięcie pozycji dolnej do przodu o L, gdy tylna stopa stoi w x = 0 */
  const m1 = [g0.x + dx, g0.yDol]; const aF1 = [g0.aF[0] + dx, g0.aF[1], g0.aF[2]]; const aT1 = [g0.aT[0] + dx, g0.aT[1], g0.aT[2]];
  const yStoj = Math.min(hipY([0, 7 + topPrzod, ZS], 0, HIP(), 10), hipY([0, 7, -ZS], 0, -HIP(), 10));
  const poleT = crossover ? [0.3, -1, -0.5] : POLE_TYL(); const poleT2 = [poleT[0], poleT[1]];
  const mkF = (u, m, aR, aL, podR, podL, odchL) => ramka({ u, m, p: pitchFn ? pitchFn(u) : pitch, aR, aL, podR, podL, tryb, poleL: poleT, rotL: 0, odchL, rece: rece?.(m, u) });
  const tK = o.tK ?? 0.8; /* koniec kroku (stopa w locie ląduje); miednica opada już w trakcie kroku */
  const lift = slizg ? 0 : 13; const e = ease;
  const stand = [0, yStoj];
  const miedn = (u) => [lerp(stand[0], m1[0], e(Math.min(1, u / 0.85))), lerp(stand[1], m1[1], e(Math.max(0, u - 0.12) / 0.88)) - 4 * Math.sin(Math.PI * Math.min(1, u / tK))];
  /* stopa w locie (R do przodu / L do tyłu): łuk o wysokości lift, podbicie z kąta goleni (kostka ~ 0–5°), lądowanie w punkcie docelowym */
  const swing = (u, od, do_, podDo, strona, hipMid) => { const t = Math.min(1, u / tK); const k = t; const a = [lerp(od[0], do_[0], k), lerp(od[1], do_[1], k) + lift * Math.sin(Math.PI * t), lerp(od[2], do_[2], k)];
    if (t >= 1) return { a: do_, pod: podDo }; const kn = kolano2D(hipMid, a, strona); const ang = katXY(a, kn); const pod = Math.max(Math.min(podDo, 0), Math.min(20, ang - 84)); const y = Math.max(a[1], kostkaStopyY(0, pod)); return { a: [a[0], y, a[2]], pod: Math.min(0, pod) }; };
  const us = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.72, 0.86, 1]; const fr = [];
  for (const u of us) {
    const m = miedn(u); const hip2 = [m[0], m[1]];
    if (!przod) { /* planowana R (przednia) w x = 0; L idzie do tyłu */
      const aRp = [0, 7 + topPrzod, ZS]; const sw = swing(u, [0, slizg ? 9 : 7, -ZS], aT1, g0.podT, poleT2, hip2);
      fr.push(mkF(u, m, aRp, sw.a, 0, sw.pod, ODCH));
    } else { /* planowana L (tylna) w x = 0; R idzie do przodu */
      const sw = swing(u, [0, 7, ZS], aF1, 0, [0.15, -1], hip2); const r = u < tK * 0.4 ? { pod: 0, y: 7 } : podAuto(hip2, 0, 0, poleT2, { zapas: 4 });
      fr.push(mkF(u, m, sw.a, [0, r.y, -ZS], sw.pod, r.pod, ODCH));
    }
  }
  const spr = [PODLOGA(Math.min(-20, aT1[0]) - 60, Math.max(aF1[0], 0) + 130), ...fr[0].o.sprzet, ...(sprzetFn ? sprzetFn(g0, fr) : [])];
  return zloz(cw, spr, fr.map(kl), bledy ? [bladKolana([0, 0.4, 0.75, 1], cw, ['R'], 40)] : []);
}

/* ---------- wejście na podwyższenie (step up): noga R na skrzyni, L startuje z podłogi ---------- */
export function stepUp(cw, o = {}) {
  const { tryb = 'cc', top = 40, pitch = 8, bledy = true } = o;
  const xB = 30; const aRb = [xB, top + 7, ZS]; const kR0 = 90; const kL0 = 25; const x0 = xB - 16;
  const rR = rPlan(dNogi(kR0), HIP() - ZS); let m0x = xB - 30; let y0 = 0;
  for (let i = 0; i < 4; i++) { y0 = hipY([m0x + 4, 7, -ZS], m0x, -HIP(), kL0); m0x = xB - Math.sqrt(Math.max(1, rR * rR - (y0 - (top + 7)) ** 2)); }
  const m0 = [m0x, y0]; const m1 = [xB - 2, hipY(aRb, xB - 2, HIP(), 8)];
  const xL0 = m0x + 4; const aL1 = [m1[0] + 12, top + 7 + 24, -ZS];
  const poleL = [0.9, -0.2]; const e = ease;
  /* noga L: pionowo w górę wzdłuż x = xL0 (stopa nad krawędzią skrzyni), potem do przodu nad skrzynię */
  const trasaL = (u) => { if (u <= 0.4) { const k = e(u / 0.4); return [xL0, lerp(7, top + 22, k), -ZS]; } const k = e((u - 0.4) / 0.6); return [lerp(xL0, aL1[0], k), lerp(top + 22, aL1[1], k), -ZS]; };
  const mkF = (u) => { const k = e(u); const m = [lerp(m0[0], m1[0], k), lerp(m0[1], m1[1], k)]; const a = trasaL(u); const kn = kolano2D(m, a, poleL); const ang = katXY(a, kn); const nadSkrzynia = a[0] + 19 > x0 - 2;
    const pod = u === 0 ? 0 : Math.max(-60, Math.min(20, ang - 84)); const y = Math.max(a[1], kostkaStopyY(nadSkrzynia && u > 0.2 ? top : 0, pod));
    return ramka({ u, m, p: lerp(pitch, pitch - 4, k), aR: aRb, aL: [a[0], y, a[2]], podR: 0, podL: pod, tryb, poleL: [0.9, -0.2, -0.1] }); };
  const us = [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1]; const fr = us.map(mkF);
  const spr = [PODLOGA(-90, 110), ...fr[0].o.sprzet, { rodzaj: 'skrzynia', x0, x1: xB + 26, top }];
  return zloz(cw, spr, fr.map(kl), bledy && cw !== 'Step Up' ? [bladKolanaProfil([[0, 0], [0.12, 45], [0.4, 45], [0.7, 20], [1, 5]], cw)] : []);
}

/* ---------- przysiad jednonóż (pistolet, na skrzynię): noga podporowa R, wolna L wyprostowana w przód ---------- */
const poleP = [1, 0, 0.12];
export function pistolet(cw, o = {}) {
  const { smith = false, kDol = 128, angDol = 56, skrzynia = null, bledy = true, pitchDol = 34 } = o;
  const aR = [0, 7, ZS + 0.5];
  const hipXY = (K, th) => { const kn = [41 * Math.cos(th * R), 7 + 41 * Math.sin(th * R)]; return [kn[0] + 42 * Math.cos((th + K) * R), kn[1] + 42 * Math.sin((th + K) * R)]; };
  const hxSmith = hipXY(kDol, angDol)[0];
  /* kąt goleni (od +x) dla zadanego zgięcia kolana: w pistolecie wolnym tułów się pochyla; w Smithzie x biodra stały (sztanga porusza się tylko w pionie) */
  const thetaSmith = (K) => { let lo = 40, hi = 100; for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; const x = hipXY(K, mid)[0]; if (x > hxSmith) lo = mid; else hi = mid; } return (lo + hi) / 2; };
  const K0 = 12; const us = [0, 0.2, 0.4, 0.6, 0.8, 1]; const fr = [];
  const pitch = (u) => smith ? 16 : lerp(2, pitchDol, ease(u));
  for (const u of us) {
    const e = ease(u); const K1 = lerp(K0, kDol, e); const th = smith ? thetaSmith(K1) : lerp(86, angDol, e); const h = hipXY(K1, th);
    /* ankle dors = 90 − kąt(goleń, stopa płasko) = 90 − th: przy th ≥ 56 ≤ 34° */
    const m = [h[0], h[1]]; const pit = pitch(u);
    const wa = lerp(-40, -18, e) * R; const aL = [h[0] + 80 * Math.cos(wa), h[1] + 80 * Math.sin(wa), -ZS - 0.5]; /* wolna noga wyprostowana w przód nad podłogą (odległość od biodra 80 cm) */
    const kn = kolano2D([m[0], m[1]], aL, [0, 1]); const ang = katXY(aL, kn); const podL = Math.max(-40, Math.min(35, ang - 84));
    const rece = smith ? null : { hr: { g: [S(m, pit)[0] + 58, S(m, pit)[1] - 4, 11], pole: [0, -1, 0.3] }, hl: { g: [S(m, pit)[0] + 58, S(m, pit)[1] - 4, -9], pole: [0, -1, -0.3] }, sprzet: [] };
    fr.push(ramka({ u, m, p: pit, aR, aL, podR: 0, podL, tryb: smith ? 'smith' : 'przod', poleL: [0, 1, 0], odchR: ODCH, rece }));
  }
  const barX = smith ? tp(fr[0].f.miednica ? [fr[0].f.miednica[0], fr[0].f.miednica[1]] : [0, 0], fr[0].f.pochylenieTulowia, BODY().trunk - 3, -12.8, 0)[0] : 0;
  const spr = [PODLOGA(-120, 160), ...fr[0].o.sprzet, ...(smith ? [{ rodzaj: 'smith', x: r1(barX), h: 200 }] : [])];
  return zloz(cw, spr, fr.map(kl), bledy ? [bladKolana([0, 0.4, 0.7, 1], cw, ['R'], 40)] : []);
}
/** Przysiad na jednej nodze na wysoką skrzynię: miednica opada na skrzynię (kontakt), wolna noga w przód. */
export function skrzyniaJednonoz(cw, o = {}) {
  const { kDol = 105, angDol = 60, bledy = true } = o;
  const aR = [0, 7, ZS + 0.5]; const hipXY = (K, th) => { const kn = [41 * Math.cos(th * R), 7 + 41 * Math.sin(th * R)]; return [kn[0] + 42 * Math.cos((th + K) * R), kn[1] + 42 * Math.sin((th + K) * R)]; };
  const hb = hipXY(kDol, angDol); const top = r1(hb[1] - 9.5 - 0.3); const us = [0, 0.25, 0.5, 0.75, 1]; const fr = [];
  for (const u of us) { const e = ease(u); const K1 = lerp(12, kDol, e); const th = lerp(86, angDol, e); const h = hipXY(K1, th); const m = [h[0], h[1]]; const pit = lerp(2, 30, e);
    const wa = lerp(-40, -10, e) * R; const aL = [m[0] + 80 * Math.cos(wa), m[1] + 80 * Math.sin(wa), -ZS - 0.5]; const kn = kolano2D(m, aL, [0, 1]); const podL = Math.max(-40, Math.min(35, katXY(aL, kn) - 84));
    fr.push(ramka({ u, m, p: pit, aR, aL, podR: 0, podL, tryb: 'przod', poleL: [0, 1, 0] })); }
  const spr = [PODLOGA(-120, 160), { rodzaj: 'skrzynia', x0: r1(hb[0] - 45), x1: r1(hb[0] + 2), top }];
  return zloz(cw, spr, fr.map(kl), bledy ? [bladKolana([0, 0.4, 0.7, 1], cw, ['R'], 40)] : []);
}

/** Przekładanie kettlebell pod przednim udem: kettlebell w prawej dłoni zwisa na zewnątrz uda (z = 29), w pozycji dolnej przechodzi pod udem (z = 6, x za kolanem); lewa ręka czeka z drugiej strony. */
function przekladanie(m, u) {
  const p = lerp(6, 35, ease(u)); const Sx = S(m, p); const k = ease(Math.max(0, (u - 0.78) / 0.22));
  const gz = lerp(29, 6, k); const gx = Sx[0] + 2 - 10 * k; const gy = Sx[1] - 57;
  return { hr: { g: [gx, gy, gz], pole: [0.2, -1, 0.3] }, hl: { g: [gx - 2, gy + 3, lerp(-24, -7, k)], pole: [0.2, -1, -0.3] }, sprzet: [{ rodzaj: 'kettlebell', dzwon: 'dol', trzyma: 'R' }] };
}


/* ---------- ruchy boczne: wykrok boczny, przysiad kozacki, boczny przysiad ze sztangą (przesuniecieBoczne: miednica przenosi się nad zgiętą nogę) ---------- */
export function boczny(cw, o = {}) {
  const { tryb = 'cc', pitchDol = 26, kDol = 100, zR = 30, hxB = -18, sprzetFn = null, bledy = true, kLProst = 10, pitchGora = 4, podLDol = 0 } = o;
  const aRz = zR; const ZO = zR - HIP(); /* na dole biodro R nad stopą R */
  const aRb = [0, kostkaPlasko(0), aRz];
  const yb = hipY(aRb, hxB, ZO + HIP(), kDol);
  const dL = dNogi(kLProst); const azL = (ZO - HIP()) - Math.sqrt(Math.max(1, dL * dL - hxB * hxB - (yb - kostkaPlasko(0)) ** 2));
  const aLb = [0, kostkaPlasko(0), r1(azL)]; const us = [0, 0.25, 0.5, 0.75, 1];
  const reach = (hx, zo) => Math.min(hipY(aRb, hx, zo + HIP(), 8), hipY(aLb, hx, zo - HIP(), 8));
  const us9 = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
  const klatki = us9.map((u) => { const e1 = ease(u / 0.45); const e = ease((u - 0.3) / 0.7); const zo = r1(ZO * e1); const hx = r1(hxB * ease((u - 0.1) / 0.5)); const y = r1(Math.min(reach(hx, zo), lerp(reach(0, 0), yb, e)));
    const m = [hx, y]; const p = lerp(pitchGora, pitchDol, e);
    const r = ramka({ u, m: [hx, y, zo], p, aR: aRb, aL: aLb, podR: 0, podL: podLDol, tryb, poleL: [1, 0, -0.1], rotR: o.rotR ?? -20, odchR: 6, boczne: r1(zo) }); return r; });
  const spr = [PODLOGA(-120, 120), ...klatki[0].o.sprzet, ...(sprzetFn ? sprzetFn(klatki[0].f) : [])];
  return zloz(cw, spr, klatki.map(kl), bledy ? [bladKolana([0, 0.25, 0.5, 0.75, 1], cw, ['R'], 40)] : []);
}

export const WYJATKI = {
};
export const PRZYBLIZENIA = {
  'Bulgarian Split Squat (hantle)': 'przybliżenie: tylna stopa leży GRZBIETEM na ławce wysokości 30 cm (oś kostka→palce opada 30° do siedziska, palce na blacie ± 3 cm; reguła głębokości: tylne kolano ≤ 20 cm), zakres kostki (zgięcie podeszwowe ok. 68°) i biodra z deklaracji zakres_wyjatki',
  'Bulgarian Split Squat (sztanga)': 'przybliżenie: jak Bulgarian Split Squat (hantle)',
  'Smith Machine Bulgarian Split Squat': 'przybliżenie: jak Bulgarian Split Squat (hantle); prowadnica w osi sztangi',
  'Suspended Split Squat': 'przybliżenie: tylna stopa w pętli taśmy 40 cm nad podłogą, zakres kostki i biodra z deklaracji zakres_wyjatki',
  'Lateral Lunge': 'ruch boczny z przesuniecieBoczne: miednica przenosi się nad stopę zgiętej nogi, druga noga prawie prosta; stopy nieruchome',
  'Cossack Squat': 'jak Lateral Lunge, głębiej; prosta noga bez uniesienia palców (uproszczenie)',
  'Crossover Reverse Lunge': 'przybliżenie: skrzyżowanie nóg bez obrotu miednicy (tylna stopa za przednią i na jej stronę)',
  'Curtsy Lunge': 'przybliżenie: skrzyżowanie nóg bez obrotu miednicy',
  'Lunge Pass Through': 'przybliżenie: kettlebell zwisa pod barkami w dole wykroku (przekładanie między rękami niemodelowane)',
};

const BT = 30, BY = 44; /* wysokość ławki pod tylną stopą, głębokość */
/** Przy tylnej stopie podniesionej (ławka, taśma) wyprost biodra tylnej nogi sięga dalej niż w Split Squat: limit z deklaracji zakres_wyjatki (data/zrodla/figury-sens.json → lunge) to −50°; góra ruchu przy −HIP_TYL_PODN (recenzja 1.1, partia 2, nr 1: wcześniej domyślne −14,5° ucinało ruch do 8 cm). */
const HIP_TYL_PODN = 30;
export function generuj() {
  const linki = (g, f0) => [{ rodzaj: 'wyciag', dwa: true, x: 105, y: 22, z: 45, chwyt: 'uchwyt', h: 120 }];
  const lawkaTyl = (g) => [{ rodzaj: 'lawka', x: r1(g.aT[0] - 25), top: BT, kat: 0, dlugosc: 40, siedzisko: 20 }];
  const pudlo = (g) => [{ rodzaj: 'skrzynia', x0: -16, x1: 30, top: 12, z: 26 }];
  return {
    'Split Squat': () => splitSquat('Split Squat'),
    'Split Squat (linki)': () => splitSquat('Split Squat (linki)', { tryb: 'linki', sprzetFn: linki }),
    'Reverse Lunge': () => krok('Reverse Lunge', { kierunek: 'tyl' }),
    'Walking Lunges': () => krok('Walking Lunges', { kierunek: 'przod', tryb: 'hantle' }),
    'Lunges (hantle)': () => krok('Lunges (hantle)', { kierunek: 'przod', tryb: 'hantle' }),
    'Lunges (sztanga)': () => krok('Lunges (sztanga)', { kierunek: 'przod', tryb: 'sztanga' }),
    'Barbell Walking Lunge': () => krok('Barbell Walking Lunge', { kierunek: 'przod', tryb: 'sztanga' }),
    'Elevated Back Lunge': () => krok('Elevated Back Lunge', { kierunek: 'tyl', tryb: 'sztanga', topPrzod: 12, sprzetFn: pudlo }),
    'Slider Reverse Lunge': () => krok('Slider Reverse Lunge', { kierunek: 'tyl', slizg: true, sprzetFn: () => [{ rodzaj: 'slizgacze', punkt: 'kostki', trzyma: 'L' }] }),
    'Bulgarian Split Squat (hantle)': () => splitSquat('Bulgarian Split Squat (hantle)', { tryb: 'hantle', topTyl: BT, grzbiet: true, yDol: BY, hipMin: -HIP_TYL_PODN, sprzetFn: lawkaTyl }),
    'Bulgarian Split Squat (sztanga)': () => splitSquat('Bulgarian Split Squat (sztanga)', { tryb: 'sztanga', topTyl: BT, grzbiet: true, yDol: BY, hipMin: -HIP_TYL_PODN, sprzetFn: (g, f) => [...lawkaTyl(g, f), { rodzaj: 'slupek', x: g.x - 40, h: 150, hak: 135 }] }),
    'Smith Machine Bulgarian Split Squat': () => splitSquat('Smith Machine Bulgarian Split Squat', { tryb: 'smith', topTyl: BT, grzbiet: true, yDol: BY, hipMin: -HIP_TYL_PODN, sprzetFn: (g, f) => [...lawkaTyl(g, f), { rodzaj: 'smith', x: r1(f.rece.R.chwyt[0]), h: 200 }] }),
    'Suspended Split Squat': () => splitSquat('Suspended Split Squat', { tylWisi: 40, hipMin: -HIP_TYL_PODN, sprzetFn: (g) => [{ rodzaj: 'zawieszenie', punkt: 'kostki', trzyma: 'L', x: r1(g.aT[0]), y: 220, z: g.aT[2] }] }),
    'Lateral Lunge': () => boczny('Lateral Lunge'),
    'Cossack Squat': () => boczny('Cossack Squat', { kDol: 112, zR: 36, pitchDol: 32, hxB: -24, rotR: -28 }),
    'Barbell Side Split Squat': () => boczny('Barbell Side Split Squat', { tryb: 'sztanga', sprzetFn: (f) => [{ rodzaj: 'slupek', x: -40, h: 150, hak: 135 }] }),
    'Step Up': () => stepUp('Step Up', { tryb: 'hantle' }),
    'Barbell Step Up': () => stepUp('Barbell Step Up', { tryb: 'sztanga' }),
    'Pistol Squat': () => pistolet('Pistol Squat'),
    'Smith Machine Pistol Squat': () => pistolet('Smith Machine Pistol Squat', { smith: true }),
    'Single-Leg High Box Squat': () => skrzyniaJednonoz('Single-Leg High Box Squat'),
    'Lunge Pass Through': () => krok('Lunge Pass Through', { kierunek: 'tyl', pitchFn: (u) => lerp(6, 35, ease(u)), rece: (m, u) => przekladanie(m, u) }),
    'Curtsy Lunge': () => krok('Curtsy Lunge', { kierunek: 'tyl', crossover: true, yDol: 53 }),
    'Crossover Reverse Lunge': () => krok('Crossover Reverse Lunge', { kierunek: 'tyl', crossover: true, yDol: 53, bledy: false }),
  };
}
