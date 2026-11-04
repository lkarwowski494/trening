// Generator póz rodziny core_floor po stronie agenta (pilotaż 26.10.2026): ćwiczenia na podłodze (leżenie na plecach, na brzuchu, klęk podparty) wyliczone z modelu przez kinematykę prostą
// (kąty uda i kolana → kostka; kąt ramienia → chwyt), biegun kolana z FK (kolano zawsze po właściwej stronie), parametry per ćwiczenie z katalogu i wskazówek.
// Układ: leżenie na plecach — głowa w stronę −x, nogi w stronę +x, miednica [0, 8, 0], pochylenieTulowia −90 (poziomo); na brzuchu — głowa +x, pochylenie +90.
import { wczytajTeksty } from '../v2-jakosc.mjs';
import { naLawce } from './gora.mjs';
import { v2, BODY, R, r1, up, dir, klatka, bladZTrajektorii, zbuduj, barki, przeciecie, kostkaNaPalcach } from './model.mjs';
/** Stopa leżącego przodem (Superman, Lower Back Curl, Seal Row, Back Extension): grzbietem do podłogi, palce w dół i do tyłu (silnik od b07c7ed7 ma podbicie 91…270°: stopa skierowana do tyłu). Poprzednie przybliżenie (stopa obrócona na zewnątrz, podeszwa w dół pod goleniami) pokazywało stopę zgiętą wzdłuż goleni (recenzja ruchu r2, F2, 28.10.2026).
 * Podbicie = kierunek goleni (kolano → kostka, stopnie od +x) + 90° − zgięcie podeszwowe: stopa prostopadła do goleni (palce ku podłodze) zgięta podeszwowo o PODESZWOWE_LEZY stopni; rotacja 0 (palce w płaszczyźnie boku). */
export const PODESZWOWE_LEZY = 50;
export const podbicieStopyPrzodem = (goleńDeg) => Math.max(91, Math.min(270, ((goleńDeg % 360) + 360) % 360 + 90 - PODESZWOWE_LEZY));

export const RODZINA = 'core_floor';
const Y0 = 9.5; /* wysokość miednicy i barków leżącej osoby (głowa leży na podłodze: środek ≈ 9,5 = promień) */
const ZNOG = 12; /* rozstaw kostek (z), cm */
const SPRZET = [{ rodzaj: 'podloga', x0: -190, x1: 190 }];
const D_PROSTE_RAMIE = 63.8; /* odległość bark–chwyt przy prawie prostym ramieniu (łokieć ≈ 16°; limit zasięgu 64) */
const D_PROSTA_NOGA = 82.6; /* odległość biodro–kostka przy prawie prostej nodze (kolano ≈ 12°; limit zasięgu 83) */
const KAT_OS = (p) => Math.atan2(up(p)[1], up(p)[0]) / R; /* kąt osi tułowia (miednica → barki) od +x */

/** Noga z FK: biodro, kąt uda t (od +x, przeciwnie do wskazówek), zgięcie kolana k (stopnie); zwraca kolano, kostkę i biegun (kierunek wybrzuszenia kolana). */
export function nogaFK(hip, t, k, uda = BODY().thigh, golen = BODY().shank) {
  const Kn = [hip[0] + uda * Math.cos(t * R), hip[1] + uda * Math.sin(t * R)]; const A = [Kn[0] + golen * Math.cos((t - k) * R), Kn[1] + golen * Math.sin((t - k) * R)];
  const mid = [(hip[0] + A[0]) / 2, (hip[1] + A[1]) / 2]; let pole = [Kn[0] - mid[0], Kn[1] - mid[1]]; const l = Math.hypot(...pole); pole = l < 0.3 ? null : pole.map((x) => x / l);
  return { knee: Kn, ankle: A, pole };
}
/** Prosta noga: zgięcie kolana dobrane tak, by biodro–kostka = D_PROSTA_NOGA (wyprost z zapasem względem zasięgu). */
export const kolanoProste = () => { const b = BODY(); const c = (b.thigh ** 2 + b.shank ** 2 - D_PROSTA_NOGA ** 2) / (2 * b.thigh * b.shank); return 180 - Math.acos(Math.max(-1, Math.min(1, c))) / R; };
/** Podbicie dla nogi z FK: kostka zgięta podeszwowo o 45° względem goleni (palce lekko wyciągnięte) — wartość stała w całym ruchu, więc interpolacja klatek nie przechodzi przez zakazany zakres. Kierunek goleni sd (kolano → kostka, od +x); zakres podbicia kontraktu ±90°. */
export const podbicieNeutralne = (sd, tryb = 'dol') => Math.max(-90, Math.min(90, tryb === 'gora' ? sd + 45 : sd - 45)); /* 'dol': palce w dół (nogi wysoko), 'gora': palce w górę (nogi nisko — stopa nie wchodzi w podłogę) */
/** Noga z celu kostki (kolano po stronie `strona`: 'gora' | 'dol' względem linii biodro–kostka). */
export function nogaZCelu(hip, ankle, strona = 'gora') {
  const b = BODY(); const dx = ankle[0] - hip[0], dy = ankle[1] - hip[1]; const d = Math.hypot(dx, dy); const a = (b.thigh ** 2 - b.shank ** 2 + d * d) / (2 * d); const h = Math.sqrt(Math.max(0, b.thigh ** 2 - a * a));
  const ux = dx / d, uy = dy / d; const n = [-uy, ux]; const sgn = strona === 'gora' ? (n[1] >= 0 ? 1 : -1) : (n[1] >= 0 ? -1 : 1);
  const Kn = [hip[0] + ux * a + sgn * n[0] * h, hip[1] + uy * a + sgn * n[1] * h]; const mid = [(hip[0] + ankle[0]) / 2, (hip[1] + ankle[1]) / 2]; const p = [Kn[0] - mid[0], Kn[1] - mid[1]]; const l = Math.hypot(...p);
  return { knee: Kn, ankle, pole: l < 0.3 ? null : p.map((x) => x / l) };
}
/** Chwyt ramienia: bark S (płaszczyzna), kierunek a (od +x), długość planarna dla prawie prostego ramienia przy bocznym przesunięciu z → [x, y, z]; `d` = odległość bark–chwyt 3D. */
export function chwyt(S, a, z, d = D_PROSTE_RAMIE) {
  const dz = BODY().shHalf - Math.abs(z); const lp = Math.sqrt(Math.max(1, d * d - dz * dz)); return [S[0] + lp * Math.cos(a * R), S[1] + lp * Math.sin(a * R), z];
}
const pole3 = (p, z, domyslny) => (p ? [p[0], p[1], z * 0.1] : domyslny);

/** Klatka leżenia/podparcia: miednica [x, y], pochylenie p, zgięcie kręgosłupa, głowa; nogi: { R: noga, L: noga } gdzie noga = { t, k, pod?, rot?, z? } (FK) albo { ankle:[x,y], strona, pod?, rot?, z? } (cel);
 ręce: { R: { a, z, d? } | { g:[x,y,z] }, L }. Zwraca klatkę kontraktu. */
export function ramka({ u, miednica, p, bend = 0, glowa, nogi, rece, polaLokci = {}, przechyl, ext }) {
  const hip = [miednica[0], miednica[1]]; const S = barki([miednica[0], miednica[1]], p, bend); const nog = {}; const rec = {};
  for (const s of ['R', 'L']) {
    const sg = s === 'R' ? 1 : -1; const n = nogi[s]; const hz = sg * 8.5; void hz;
    const f = n.ankle ? nogaZCelu(hip, n.ankle, n.strona ?? 'gora') : nogaFK(hip, n.t, n.k); const pole = n.pole ?? f.pole;
    const sd = n.ankle ? null : n.t - n.k; const goleń = n.stopaPrzodem ? Math.atan2(f.ankle[1] - f.knee[1], f.ankle[0] - f.knee[0]) / R : 0; nog[s] = { k: [f.ankle[0], f.ankle[1], sg * (n.z === undefined ? ZNOG : Math.abs(n.z))], pod: n.stopaPrzodem ? r1(podbicieStopyPrzodem(goleń)) : n.pod ?? (sd === null ? 0 : podbicieNeutralne(sd, n.stopa)), rot: n.stopaPrzodem ? 0 : n.rot ?? 10, pole: pole ? [pole[0], pole[1], sg * 0.1] : [0.15, 1, sg * 0.1] };
    const r = rece[s]; const g = r.g ? r.g : chwyt(S, r.a, r.z ?? sg * 19, r.d); rec[s] = { g, pole: polaLokci[s] ?? r.pole ?? (r.g ? undefined : [0, 0.2, sg]) };
  }
  return klatka({ u, miednica: [miednica[0], miednica[1], 0], pitch: p, bend, glowa: glowa ?? p, nogi: nog, rece: rec, przechyl, ext });
}
const lerp = (a, b, t) => a + (b - a) * t;
const wygladzenie = (x) => x * x * (3 - 2 * x); /* start i koniec ruchu ramienia wolniejsze (limit szybkości punktu w kontrakcie) */
const zbuduj1 = (cw, klatki, bledy = []) => zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: SPRZET, klatki, bledy });
/** Pochylenie i pozycja miednicy, gdy barki mają zostać w miejscu S, a miednica ma być na wysokości y (długość tułowia stała). */
function miednicaPrzyBarkach(S, yMiednicy, strona = 1) {
  const sy = S[1]; const dy = yMiednicy - sy; const tr = BODY().trunk; const dx = Math.sqrt(Math.max(0, tr * tr - dy * dy)); const P = [S[0] + strona * dx, yMiednicy]; const ux = (S[0] - P[0]) / tr, uy = (S[1] - P[1]) / tr;
  return { P, p: Math.atan2(ux, uy) / R };
}
const RECE_BOK = (S, y = 5, d = 62) => ({ R: { g: [S[0] + Math.sqrt(d * d - 25), y, 24], pole: [0, 0, 1] }, L: { g: [S[0] + Math.sqrt(d * d - 25), y, -24], pole: [0, 0, -1] } }); /* ramiona wzdłuż ciała na podłodze */
const RECE_NAD_GLOWA = (kat = 25) => (S, p) => ({ R: { a: KAT_OS(p) - kat, z: 8 }, L: { a: KAT_OS(p) - kat, z: -8 } }); /* ramiona w osi tułowia nad głową, 25° poniżej osi (bark < 170°) */

/* ---------- unoszenie tułowia leżąc na plecach (crunch i pochodne) ---------- */
export function crunch(cw, { pU1 = -62, nogi, rece, pHeadDelta = 0, pelvisY = Y0, bend1 = 0 }) {
  const us = [0, 0.5, 1]; const fr = (u) => { const p = lerp(-90, pU1, u); const bend = bend1 * u; const S = barki([0, pelvisY], p, bend); return ramka({ u, miednica: [0, pelvisY], p, bend, glowa: p + pHeadDelta, nogi: nogi(u, p), rece: rece(S, p, u) }); };
  return zbuduj1(cw, us.map(fr));
}
const stopyPlasko = (x, z) => ({ R: { ankle: [x, 7], strona: 'gora', pod: 0, z }, L: { ankle: [x, 7], strona: 'gora', pod: 0, z } });

/* ---------- ćwiczenia leżące ---------- */
export function alternateHeelTouchers(cw, { lean = 16, p1 = -72, heelX = 30, bend1 = 40, nK = 8, zasieg = 63 } = {}) {
  /* leżąc na plecach, kolana zgięte, stopy płasko; naprawdę prosta ręka (łokieć ≤ 30°, v2-jakosc: rece_proste): dłonie liczone z położenia barku (po skłonie bark przesuwa się w bok); naprzemienny skłon boczny (przechylTulowia, poza@2):
     u = 0 płasko, 0,5 skłon ku prawej pięcie, 1 ku lewej; ręka po stronie skłonu sięga ku pięcie, druga leży przy boku. Klatki gęste (nK + 1), bo dłoń interpolowana liniowo skraca ramię w pół drogi (cięciwa). */
  const us = Array.from({ length: nK + 1 }, (_, i) => i / nK); const zS = 22; const E = v2();
  const sw = (u) => (u <= 0.5 ? u / 0.5 : 1 - 4 * (u - 0.5)); /* 0 → +1 (u = 0,5, ku prawej pięcie) → −1 (u = 1, ku lewej) */
  const fr = (u) => { const a = Math.min(1, u / 0.125); const sk = sw(u); const p = -90 + (p1 + 90) * a; const bend = bend1 * a; const nogi = { R: { ankle: [heelX, 7], strona: 'gora', pod: 0, z: zS }, L: { ankle: [heelX, 7], strona: 'gora', pod: 0, z: -zS } };
    const proba = ramka({ u, miednica: [0, Y0], p, bend, glowa: p, nogi, rece: { R: { g: [0, 5, 24] }, L: { g: [0, 5, -24] } }, przechyl: sk * lean });
    const sh = E.keyframeFrame({ kontrakt: E.CONTRACT.id, rodzina: RODZINA, cwiczenie: cw, sprzet: SPRZET, klatki: [proba, { ...proba, u: 1 }], bledy: [] }, 0).sk.arms; /* położenia barków po skłonie */
    const prosta = (s_, cel) => { const S = sh[s_].shoulder; const d = [cel[0] - S[0], cel[1] - S[1], cel[2] - S[2]]; const l = Math.hypot(...d); const k = zasieg / l; return [S[0] + d[0] * k, Math.max(3, S[1] + d[1] * k), S[2] + d[2] * k].map(r1); }; /* ręka prosta: dłoń `zasieg` cm od barku w kierunku celu */
    const sg = (s_) => (s_ === 'R' ? 1 : -1); const w = (s_) => Math.max(0, s_ === 'R' ? sk : -sk); const cel = (s_) => { const b = [8, 5, sg(s_) * 26], g = [heelX - 8, 6, sg(s_) * zS]; return b.map((x, i) => x + (g[i] - x) * w(s_)); };
    const reka = (s_) => ({ g: prosta(s_, cel(s_)), pole: [0, 0.3 * w(s_), sg(s_)] });
    return ramka({ u, miednica: [0, Y0], p, bend, glowa: p, nogi, rece: { R: reka('R'), L: reka('L') }, przechyl: sk * lean }); };
  return zbuduj1(cw, us.map(fr));
}
function crunchHandsOverhead(cw) {
  return crunch(cw, { pU1: -62, bend1: 40, nogi: () => stopyPlasko(35, ZNOG), rece: (S, p) => ({ R: { a: KAT_OS(p) - 25, z: 5 }, L: { a: KAT_OS(p) - 25, z: -5 } }) });
}
export function tuckCrunch(cw, { bend1 = 40, pU1 = -62 } = {}) {
  const us = [0, 0.5, 1]; const fr = (u) => { const p = lerp(-90, pU1, u); const bend = bend1 * u; const S = barki([0, Y0], p, bend); const t = lerp(90, 102, u); const k = lerp(95, 115, u); /* kolana podkulone w każdej klatce (v2-jakosc: kolana_ugiete_min) */ const fk = (z) => ({ t, k, z, rot: 10, stopa: 'dol' });
    const chest = (sg) => { const upv = up(p), fv = [Math.cos(p * R), -Math.sin(p * R)]; const P = [S[0] - upv[0] * 12 + fv[0] * 9.5, S[1] - upv[1] * 12 + fv[1] * 9.5]; return [P[0], P[1], sg * 6]; }; /* ręce skrzyżowane na klatce (liczone od barku po zgięciu kręgosłupa) */
    return ramka({ u, miednica: [0, Y0], p, bend, glowa: p, nogi: { R: fk(3), L: fk(-3) }, rece: { R: { g: chest(-1), pole: [0, 0.1, 1] }, L: { g: chest(1), pole: [0, 0.1, -1] } } }); };
  return zbuduj1(cw, us.map(fr));
}
/** Ruch prowadzony miednicą (reverse crunch, leg pull-in): barki i głowa nieruchome, miednica unosi się o dy, uda i golenie zgodnie z FK. */
function ruchMiednica(cw, { t0, k0, t1, k1, dy = 12, stopa = 'dol', sprzet = SPRZET }) {
  const S0 = barki([0, Y0], -90); const us = [0, 0.25, 0.5, 0.75, 1];
  const fr = (u) => { const e = u; const y = Y0 + dy * e; const { P, p } = miednicaPrzyBarkach(S0, y); const nk = (t, k) => ({ t, k, stopa }); const tt = lerp(t0, t1, e), kk = lerp(k0, k1, e);
    return ramka({ u, miednica: P, p, glowa: -90, nogi: { R: { ...nk(tt, kk), z: ZNOG }, L: { ...nk(tt, kk), z: -ZNOG } }, rece: RECE_BOK(S0) }); };
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet, klatki: us.map(fr), bledy: [] });
}
export function reverseCrunch(cw, o = {}) { return ruchMiednica(cw, { t0: 90, k0: 90, t1: 135, k1: 130, dy: 11, ...o }); }
export function legPullIn(cw, o = {}) { const ks = kolanoProste(); return ruchMiednica(cw, { t0: 10, k0: ks, t1: 130, k1: 130, dy: 12, stopa: "gora", ...o }); }

function scissorKick(cw) {
  const ks = kolanoProste(); const us = [0, 0.5, 1]; const S = barki([0, Y0], -90);
  const fr = (u) => ramka({ u, miednica: [0, Y0], p: -90, glowa: -90, nogi: { R: { t: lerp(45, 10, u), k: ks, z: ZNOG, stopa: 'gora' }, L: { t: lerp(10, 45, u), k: ks, z: -ZNOG, stopa: 'gora' } }, rece: RECE_BOK(S) });
  return zbuduj1(cw, us.map(fr));
}
function lyingLegRaise(cw) {
  const ks = kolanoProste(); const S = barki([0, Y0], -90); const us = [0, 0.25, 0.5, 0.75, 1];
  return zbuduj1(cw, us.map((u) => { const t = lerp(16, 88, u); return ramka({ u, miednica: [0, Y0], p: -90, glowa: -90, nogi: { R: { t, k: ks, z: ZNOG, stopa: 'dol' }, L: { t, k: ks, z: -ZNOG, stopa: 'dol' } }, rece: RECE_BOK(S) }); }));
}
function hollowHold(cw) {
  const ks = kolanoProste(); const p = -76; const bend = 35; /* lędźwie dociśnięte (v2-jakosc: ledzwie_przy_podlodze): unosi się górna część pleców (zaokrąglenie) i nogi */ const fr = (u) => ramka({ u, miednica: [0, Y0], p, bend, glowa: p, nogi: { R: { t: 28, k: ks, z: ZNOG }, L: { t: 28, k: ks, z: -ZNOG } }, rece: RECE_NAD_GLOWA(20)(null, p) });
  return zbuduj1(cw, [fr(0), fr(1)]);
}
function deadBug(cw) {
  const S = barki([0, Y0], -90); const ks = kolanoProste(); const us = [0, 0.25, 0.5, 0.75, 1];
  const fr = (u) => { const kR = { t: 90, k: 90, z: ZNOG }; const kL = { t: lerp(90, 14, u), k: lerp(90, ks, u), z: -ZNOG }; const aR = lerp(90, 160, u);
    return ramka({ u, miednica: [0, Y0], p: -90, glowa: -90, nogi: { R: kR, L: kL }, rece: { R: { a: aR, z: 19 }, L: { a: 90, z: -19 } } }); };
  return zbuduj1(cw, us.map(fr));
}
export function cocoons(cw, { bend1 = 40, rise = 3.4, dy0 = -1.3 } = {}) {
  /* R17 (styk z podłożem, recenzja n6): zwijanie, nie lewitacja. Miednica unosi się o `rise` = 3,4 cm (R14b ≥ 3), ale start jest niżej o 1,3 cm (dy0: kość krzyżowa wtapia się w matę jak w pozach leżących), więc najniższy punkt narysowanego ciała zostaje ≤ 0,8 cm nad podłogą w każdej klatce (przy rise = 8 wisiał 6,7 cm). */
  const ks = kolanoProste(); const us = Array.from({ length: 9 }, (_, i) => i / 8);
  const fr = (u) => { const p = lerp(-90, -62, u); const bend = bend1 * u; const y = Y0 + dy0 + rise * wygladzenie(u); /* zwijanie obu końców (R14b): kręgosłup się zgina, a miednica unosi się o `rise` cm (pośladki odrywają się od podłogi) */ const t = lerp(10, 100, u), k = lerp(ks, 100, u); const S = barki([0, y], p, bend);
    const fk = nogaFK([0, y], t, k); const dokolan = Math.atan2(fk.knee[1] - S[1], fk.knee[0] - S[0]) / R; const aOver = KAT_OS(p) - 20; const a = lerp(aOver, dokolan, wygladzenie(Math.min(1, u * 1.2)));
    return ramka({ u, miednica: [0, y], p, bend, glowa: p, nogi: { R: { t, k, z: ZNOG, stopa: 'gora' }, L: { t, k, z: -ZNOG, stopa: 'gora' } }, rece: { R: { a, z: 8 }, L: { a, z: -8 } } }); };
  return zbuduj1(cw, us.map(fr));
}
function vUp(cw) {
  const ks = kolanoProste(); const us = Array.from({ length: 9 }, (_, i) => i / 8);
  const fr = (u) => { const el = lerp(0, 60, u); const p = -90 + el; const t = lerp(10, 60, u); const S = barki([0, Y0], p); const fk = nogaFK([0, Y0], t, ks); const dok = Math.atan2(fk.ankle[1] - S[1], fk.ankle[0] - S[0]) / R; const aOver = KAT_OS(p) - 20; const a = lerp(aOver, dok, u);
    return ramka({ u, miednica: [0, Y0], p, glowa: p, nogi: { R: { t, k: ks, z: ZNOG, stopa: 'gora' }, L: { t, k: ks, z: -ZNOG, stopa: 'gora' } }, rece: { R: { a, z: 14 }, L: { a, z: -14 } } }); };
  return zbuduj1(cw, us.map(fr));
}


/* ---------- poprawki po recenzji ruchu R1 (04.11.2026): Bicycle Crunch, Cross-Body Crunch, Toe Touchers ---------- */
/** Dłoń za głową (łokcie na boki): od barku S wzdłuż osi tułowia o 22 cm (głowa), z ≈ ±14. */
const dlonZaGlowa = (S, p, sg) => { const upv = up(p), fv = [Math.cos(p * R), -Math.sin(p * R)]; return [S[0] + upv[0] * 22 + fv[0] * 2, S[1] + upv[1] * 22 + fv[1] * 2, sg * 14]; };
const reszkaZaGlowa = (S, p) => ({ R: { g: dlonZaGlowa(S, p, 1), pole: [0, 0.1, 1] }, L: { g: dlonZaGlowa(S, p, -1), pole: [0, 0.1, -1] } });
/** Bicycle Crunch (R1 W1, ACE 241/6521): dłonie za głową, łokcie na boki; obie nogi nad podłogą — jedna zgięta, kolano do klatki, druga prosta i uniesiona; tułów skręca się łokciem ku zgiętemu kolanu.
 * u = 0 prawe kolano w klatce i skręt ku prawej, u = 1 lewe kolano i skręt ku lewej (pętla tam i z powrotem pokazuje obie strony); nogi zamieniają się rolami, barki zostają uniesione. */
export function bicycleCrunch(cw, { skret = 28, pBok = -64, pSrodek = -74, bend = 36, zgieta = { t: 108, k: 110 }, prosta = 28 } = {}) {
  const ks = kolanoProste(); const us = [0, 0.25, 0.5, 0.75, 1];
  const fr = (u) => { const s = wygladzenie(u); const dol = 1 - Math.abs(2 * u - 1); /* 1 w środku (barki niżej) */ const p = lerp(pBok, pSrodek, dol); const S = barki([0, Y0], p, bend);
    const tR = lerp(zgieta.t, prosta, s), kR = lerp(zgieta.k, ks, s), tL = lerp(prosta, zgieta.t, s), kL = lerp(ks, zgieta.k, s);
    return ramka({ u, miednica: [0, Y0], p, bend, glowa: p, nogi: { R: { t: tR, k: kR, z: ZNOG, stopa: 'dol' }, L: { t: tL, k: kL, z: -ZNOG, stopa: 'dol' } }, rece: reszkaZaGlowa(S, p), ext: { skretTulowia: lerp(skret, -skret, s) } }); };
  return zbuduj1(cw, us.map(fr));
}
/** Cross-Body Crunch (R1 Ś1, ACE 52 / Fitness Volt): leżenie na plecach, kolana ugięte, stopy płasko, dłonie za głową; barki się unoszą ze skrętem, a łokieć i przeciwne kolano (także unoszone) spotykają się nad pępkiem. */
export function crossBodyCrunch(cw, { skret = 30, p1 = -64, bend1 = 36 } = {}) {
  const us = [0, 0.5, 1];
  const fr = (u) => { const a = wygladzenie(u); const p = lerp(-90, p1, a); const bend = bend1 * a; const S = barki([0, Y0], p, bend);
    const stopa = { ankle: [35, 7], strona: 'gora', pod: 0, z: ZNOG }; const kolano = { t: lerp(62, 108, a), k: lerp(100, 112, a), z: -ZNOG, pod: lerp(0, 40, a) };
    return ramka({ u, miednica: [0, Y0], p, bend, glowa: p, nogi: { R: { ...stopa, z: ZNOG }, L: u === 0 ? { ...stopa, z: -ZNOG } : kolano }, rece: reszkaZaGlowa(S, p), ext: { skretTulowia: -skret * a } }); };
  return zbuduj1(cw, us.map(fr));
}
/** Toe Touchers (R1 Ś2, ACE 243): uda pionowo, kolana wyprostowane, łopatki odrywają się od podłogi, a proste ręce sięgają po udach w stronę stóp; uda nie przechodzą za pion. */
export function toeTouchers(cw, { p1 = -60, bend1 = 44 } = {}) {
  const ks = Math.min(kolanoProste(), 20); const us = [0, 0.5, 1];
  const fr = (u) => { const a = wygladzenie(u); const p = lerp(-90, p1, a); const bend = bend1 * a; const S = barki([0, Y0], p, bend); const noga = (z) => ({ t: 90, k: ks, z, stopa: 'dol' }); const A = nogaFK([0, Y0], 90, ks).ankle;
    const dlon = (sg) => { const d = [A[0] - S[0], A[1] - S[1]]; const l = Math.hypot(...d); const k = Math.min(1, 62 / l); return [S[0] + d[0] * k, S[1] + d[1] * k, sg * 9]; };
    return ramka({ u, miednica: [0, Y0], p, bend, glowa: p, nogi: { R: noga(ZNOG), L: noga(-ZNOG) }, rece: { R: { g: dlon(1), pole: [0, 0.1, 1] }, L: { g: dlon(-1), pole: [0, 0.1, -1] } } }); };
  return zbuduj1(cw, us.map(fr));
}

/* ---------- Superman (na brzuchu, pozycja +x) ---------- */
function superman(cw, { bledy = !!wczytajTeksty()['cobra.mis'] } = {}) { /* błąd tylko, gdy ma opis w tekstach wskazówek (v2-jakosc: etykieta_bledu) */
  const us = [0, 0.25, 0.5, 0.75, 1];
  const fr = (u, wznios) => { const phi = Math.asin(Math.min(1, wznios / BODY().trunk)) / R; const p = 90 - phi; const S = barki([0, Y0], p); const aR = phi * 0.6 - 2 - 3 * (1 - u); const hz = 15; /* ręce prosto przed sobą, lekko w górę */
    const ank = () => { const y = 16 + 10 * u; /* r4: biodro ze znakiem, zakres −17°…133°: wyprost nogi w Supermanie ≤ ok. 17° */ const a = Math.asin((y - Y0) / D_PROSTA_NOGA); return [-D_PROSTA_NOGA * Math.cos(a), y]; };
    const nog = (sg) => ({ ankle: ank(), strona: 'dol', stopaPrzodem: true, z: ZNOG, pole: [0.15, -1, 0.1 * sg] });
    return ramka({ u, miednica: [0, Y0], p, glowa: p * 0.92, nogi: { R: nog(1), L: nog(-1) }, rece: { R: { g: chwyt(S, aR, hz), pole: [0, -1, 0.2] }, L: { g: chwyt(S, aR, -hz), pole: [0, -1, -0.2] } } }); };
  const ok = (u) => fr(u, 8 * u); const zle = (u) => fr(u, 5 + 17 * u); /* błąd: klatka uniesiona o 5 cm już w u = 0, o 22 cm na końcu (przeprost lędźwi) */
  return zbuduj1(cw, us.map(ok), bledy ? [bladZTrajektorii({ cue: 'cobra.mis', postawa: true, znacznik: 'back', us, ok, zle })] : []);
}

/* ---------- Bird Dog (klęk podparty; u = 1: prawa ręka i lewa noga wyprostowane) ---------- */
function birdDog(cw) {
  const B = BODY(); const hx = 60; const Sy = 2 + 63.3; const Py = 8.8 + B.thigh; const phi = Math.asin((Sy - Py) / B.trunk) / R; const P = [hx - B.trunk * Math.cos(phi * R), Py]; const p = 90 - phi; const us = [0, 0.25, 0.5, 0.75, 1];
  const S = [hx, Sy]; const kn = [P[0], 8.8]; const ankleK = (t, k) => nogaFK(P, t, k);
  const fr = (u) => { const aR = lerp(-90, 0, u); const tR = 270, kR = 105; const tL = lerp(270, 184, u), kL = lerp(105, ks0(), u);
    const rG = u === 0 ? [S[0], 2, 19] : chwyt(S, aR, 19, 63.3); const lG = [S[0], 2, -19];
    const nR = nogaFK(P, tR, kR), nL = nogaFK(P, tL, kL); const PODB = -90; const PODL = lerp(-90, -80, u);
    return klatka({ u, miednica: [P[0], P[1], 0], pitch: p, glowa: p, nogi: { R: { k: [nR.ankle[0], nR.ankle[1], 10], pod: PODB, pole: nR.pole ? [nR.pole[0], nR.pole[1], 0.1] : [0.15, -1, 0.1] }, L: { k: [nL.ankle[0], nL.ankle[1], -10], pod: PODL, pole: nL.pole ? [nL.pole[0], nL.pole[1], -0.1] : [0.15, -1, -0.1] } }, rece: { R: { g: rG, pole: [-0.5, -1, 0.3] }, L: { g: lG, pole: [-0.5, -1, -0.3] } } }); };
  void ankleK; void kn;
  return zbuduj1(cw, us.map(fr));
}
const ks0 = () => kolanoProste();


/* ---------- sprzęt: piłka gimnastyczna, wyciąg, zawieszenie, maszyna (dorobione 04.11.2026, fala F2 linii 1.1) ---------- */
const ODL_TULOW = 9.5; /* promień kapsuły tułowia (GIRTH.trunkCollide) */
const dSeg = (c, a, b) => { const abx = b[0] - a[0], aby = b[1] - a[1]; const t = Math.max(0, Math.min(1, ((c[0] - a[0]) * abx + (c[1] - a[1]) * aby) / (abx * abx + aby * aby))); return Math.hypot(c[0] - a[0] - t * abx, c[1] - a[1] - t * aby); };
const chestPt = (S, p, sg) => { const upv = up(p), fv = [Math.cos(p * R), -Math.sin(p * R)]; return [S[0] - upv[0] * 12 + fv[0] * 9.5, S[1] - upv[1] * 12 + fv[1] * 9.5, sg * 6]; }; /* ręce skrzyżowane na klatce */
/** Środek piłki (x) tak, by oś tułowia (miednica → bark) w klatkach `osie` leżała od jej środka nie bliżej niż promień + promień kapsuły − `wnik` (miękka piłka wgniata się do 3 cm). */
function pilkaX(r, osie, wnik = 1) {
  let best = null; for (let x = -90; x <= -5; x += 0.25) { const m = Math.min(...osie.map(([a, b]) => dSeg([x, r], a, b))); if (m >= r + ODL_TULOW - wnik && m <= r + ODL_TULOW - wnik + 4 && (best === null || Math.abs(x) < Math.abs(best))) best = x; } /* najbliższy miednicy */
  return best;
}
/** Środek piłki (x) tak, by w KAŻDEJ z pochyleń `ps` miednica (środek) i odcinek lędźwi (25 cm od miednicy wzdłuż tułowia) leżały od jej powierzchni (promień + promień kapsuły) o co najwyżej ±`tol` cm (R2-W1 / R2-Ś1, 04.11.2026: styk miednicy i lędźwi z piłką przez cały ruch); spośród spełniających — najmniejsze odchylenie. */
export function pilkaStyk(r, Y, ps, tol = 3) {
  let best = null;
  for (let x = -90; x <= -5; x += 0.25) { let ok = true, worst = 0;
    for (const p of ps) { const d = up(p); const dp = Math.hypot(x, Y - r) - r - ODL_TULOW; const dl = dSeg([x, r], [0, Y], [25 * d[0], Y + 25 * d[1]]) - r - ODL_TULOW; if (Math.abs(dp) > tol || Math.abs(dl) > tol) ok = false; worst = Math.max(worst, Math.abs(dp), Math.abs(dl)); }
    if (ok && (best === null || worst < best[1])) best = [x, worst]; }
  return best ? best[0] : null;
}
/** Crunch na piłce (R1 Ś3, ACE 68 / NFPT): piłka 55 cm pod lędźwiami i środkiem pleców, miednica niżej od barków, kolana ≈ 90°, stopy płasko, ręce na klatce; górna część pleców odrywa się od piłki, miednica i stopy zostają. */
function stabilityBallCrunch(cw) {
  const r = 27.5; const Y = 48; const us = [0, 0.5, 1]; const pS = -58, pK = -40, bK = 34;
  const bx = pilkaStyk(r, Y, [pS, (pS + pK) / 2, pK]); if (bx === null) throw new Error('brak położenia piłki');
  const fr = (u) => { const a = wygladzenie(u); const p = lerp(pS, pK, a); const bend = bK * a; const S = barki([0, Y], p, bend); const st = (z) => ({ ankle: [42, 7], strona: 'gora', pod: 0, z, rot: 10 });
    return ramka({ u, miednica: [0, Y], p, bend, glowa: p, nogi: { R: st(ZNOG + 8), L: st(-ZNOG - 8) }, rece: { R: { g: chestPt(S, p, -1), pole: [0, 0.1, 1] }, L: { g: chestPt(S, p, 1), pole: [0, 0.1, -1] } } }); };
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: [...SPRZET, { rodzaj: 'pilka_gimnastyczna', x: r1(bx), promien: r }], klatki: us.map(fr), bledy: [] });
}
/** Crunch z łydkami na piłce: leżenie na plecach, biodra i kolana ≈ 90°, łydki leżą na piłce (mała piłka 41 cm — przy większej łydki nie sięgają jej szczytu), ręce przy głowie; unoszenie barków. */
function crunchLegsOnBall(cw) {
  const r = 20.5; const Y = Y0; const ks = [0, 0.5, 1];
  const fr = (u) => { const p = lerp(-90, -62, wygladzenie(u)); const bend = 38 * wygladzenie(u); const S = barki([0, Y], p, bend);
    const nog = (z) => ({ t: 90, k: 96, z, stopa: 'dol' });
    return ramka({ u, miednica: [0, Y], p, bend, glowa: p, nogi: { R: nog(ZNOG), L: nog(-ZNOG) }, rece: { R: { a: KAT_OS(p) - 25, z: 6 }, L: { a: KAT_OS(p) - 25, z: -6 } } }); };
  const k0 = fr(0); const A = k0.nogi.R.kostka; const bx = A[0] - 10; /* piłka pod łydką */
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: [...SPRZET, { rodzaj: 'pilka_gimnastyczna', x: r1(bx), promien: r }], klatki: ks.map(fr), bledy: [] });
}
export function cableReverseCrunch(cw) { /* wyciąg niski za stopami, opaska na kostkach: kolana do klatki przeciw linki */
  return ruchMiednica(cw, { t0: 90, k0: 90, t1: 135, k1: 130, dy: 11, sprzet: [...SPRZET, { rodzaj: 'wyciag', dwa: true, x: 120, y: 20, chwyt: 'kostka' }] });
}
/** Odwrócone spięcie w zawieszeniu: podpór przodem na dłoniach (ramiona proste, barki nieruchome), stopy w pętlach taśm, kolana do klatki (miednica unosi się). Głowa +x. */
function suspendedReverseCrunch(cw) {
  const B = BODY(); const Sx = 70; const Sy = 2 + 63.3; const us = [0, 0.25, 0.5, 0.75, 1]; const Ay = 220;
  const A0 = [Sx - 131.5, 52], A1 = [Sx - 80, 62]; /* taśma nierozciągliwa: kostki idą po łuku wokół zaczepu P (|P−A0| = |P−A1|) */
  const px = (A1[0] ** 2 + (Ay - A1[1]) ** 2 - A0[0] ** 2 - (Ay - A0[1]) ** 2) / (2 * (A1[0] - A0[0])); const L = Math.hypot(px - A0[0], Ay - A0[1]); const th0 = Math.atan2(A0[1] - Ay, A0[0] - px), th1 = Math.atan2(A1[1] - Ay, A1[0] - px);
  const fr = (u) => { const a = wygladzenie(u); const phi = lerp(-3, 22, a) * R; const P = [Sx - B.trunk * Math.cos(phi), Sy + B.trunk * Math.sin(phi)]; const p = Math.atan2((Sx - P[0]) / B.trunk, (Sy - P[1]) / B.trunk) / R;
    const th = lerp(th0, th1, a); const A = [px + L * Math.cos(th), Ay + L * Math.sin(th)]; const kn = nogaZCelu(P, A, 'dol').knee; const sd = Math.atan2(A[1] - kn[1], A[0] - kn[0]) / R;
    const nog = (z) => ({ ankle: A, strona: 'dol', pod: Math.max(-90, Math.min(90, sd - 45)), z, rot: 10 });
    return ramka({ u, miednica: P, p, glowa: p, nogi: { R: nog(ZNOG), L: nog(-ZNOG) }, rece: { R: { g: [Sx, 2, 19], pole: [-0.5, -1, 0.3] }, L: { g: [Sx, 2, -19], pole: [-0.5, -1, -0.3] } } }); };
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: [...SPRZET, { rodzaj: 'zawieszenie', x: r1(px), y: Ay, punkt: 'kostki', trzyma: 'obie' }], klatki: us.map(fr), bledy: [] });
}
/** Spięcie na klęczkach przy wysokim wyciągu (lina przy głowie): klęk, miednica nad kolanami, zwijanie tułowia do przodu (głowa +x). */
function cableCrunch(cw) {
  const B = BODY(); const Pm = [0, 8.8 + B.thigh]; const us = [0, 0.25, 0.5, 0.75, 1];
  const fr = (u) => { const a = wygladzenie(u); const p = lerp(6, 64, a); const bend = 60 * a; const S = barki(Pm, p, bend); const upv = up(p), fv = [Math.cos(p * R), -Math.sin(p * R)];
    const g = (sg) => [S[0] + upv[0] * 12 + fv[0] * 18, S[1] + upv[1] * 12 + fv[1] * 18, sg * 13];
    const nog = (z) => ({ t: 270, k: 105, z, pod: -90, rot: 10 });
    return ramka({ u, miednica: Pm, p, bend, glowa: p, nogi: { R: nog(ZNOG - 2), L: nog(-ZNOG + 2) }, rece: { R: { g: g(1), pole: [0.3, -1, 0.5] }, L: { g: g(-1), pole: [0.3, -1, -0.5] } } }); };
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: [...SPRZET, { rodzaj: 'wyciag', x: 160, y: 200, z: 0, chwyt: 'lina', trzyma: 'obie' }], klatki: us.map(fr), bledy: [] });
}

/** Spięcie na maszynie (siedząc): oparcie 85°, miednica na siedzisku, uchwyty na dźwigni przy klatce; tułów zwija się do przodu (pochylenie −5° → 33°, zgięcie kręgosłupa 40°). Dźwignia obrotowa: oś P liczona z dwóch skrajnych położeń dłoni i ramienia r. */
function machineCrunch(cw) {
  const kat = 85, top = 45, r = 55; const Bn = naLawce(kat, top, { zr: 24 }); const m = Bn.m; const us = [0, 0.25, 0.5, 0.75, 1];
  const poz = (u) => { const a = wygladzenie(u); return { p: lerp(Bn.p, 33, a), bend: 60 * a }; };
  const hand = (u) => { const { p, bend } = poz(u); const S = barki(m, p, bend); const upv = up(p), fv = [Math.cos(p * R), -Math.sin(p * R)]; return [S[0] - upv[0] * 4 + fv[0] * 19, S[1] - upv[1] * 4 + fv[1] * 19]; };
  const H0 = hand(0), H1 = hand(1); const mid = [(H0[0] + H1[0]) / 2, (H0[1] + H1[1]) / 2]; const dx = H1[0] - H0[0], dy = H1[1] - H0[1]; const l = Math.hypot(dx, dy); const hh = Math.sqrt(Math.max(0, r * r - (l / 2) ** 2)); const n = [-dy / l, dx / l];
  const P = [[mid[0] + n[0] * hh, mid[1] + n[1] * hh], [mid[0] - n[0] * hh, mid[1] - n[1] * hh]].sort((a, b) => b[1] - a[1])[0]; /* oś nad dłońmi */
  const a0 = Math.atan2(H0[1] - P[1], H0[0] - P[0]); let a1 = Math.atan2(H1[1] - P[1], H1[0] - P[0]); if (Math.abs(a1 - a0) > Math.PI) a1 += a1 < a0 ? 2 * Math.PI : -2 * Math.PI;
  const fr = (u) => { const { p, bend } = poz(u); const ang = lerp(a0, a1, wygladzenie(u)); const c = [P[0] + r * Math.cos(ang), P[1] + r * Math.sin(ang)];
    const k = klatka({ u, miednica: [m[0], m[1], 0], pitch: p, bend, glowa: Bn.glowa + (p - Bn.p), nogi: { R: { k: Bn.nogi.R.k, pod: Bn.nogi.R.pod, rot: Bn.nogi.R.rot, pole: Bn.nogi.R.pole }, L: { k: Bn.nogi.L.k, pod: Bn.nogi.L.pod, rot: Bn.nogi.L.rot, pole: Bn.nogi.L.pole } }, rece: { R: { g: [c[0], c[1], 24], pole: [0.4, -1, 0.8] }, L: { g: [c[0], c[1], -24], pole: [0.4, -1, -0.8] } } }); return k; };
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: [...SPRZET, { rodzaj: 'lawka', x: 0, top, kat, dlugosc: 75, siedzisko: 40 }, { rodzaj: 'dzwignia', tryb: 'obrot', x: r1(P[0]), y: r1(P[1]), z: 0, dlugosc: r1(r), punkt: 'dlonie', trzyma: 'obie' }], klatki: us.map(fr), bledy: [] });
}

/* ---------- Fala R3 (04.11.2026): ćwiczenia z tekstem, ale bez pozy ---------- */
/** Butt-Ups (źródła: Lift Manual, HomeGym): podpór na przedramionach, ciało w jednej linii; biodra idą w górę i do tyłu do odwróconego V i wracają do podporu.
 * Łokcie nieruchome pod barkami (przedramiona leżą na podłodze), bark odchyla się do tyłu o `a` stopni (ramię pochyla się wokół łokcia), stopy na palcach podchodzą o `krok` cm ku dłoniom (odległość bark–stopy skraca się, więc bez tego odwrócone V nie powstaje).
 * Biodro z przecięcia okręgów: |biodro − kostka| = noga prosta, |bark − biodro| = tułów. */
export function buttUps(cw, { aMax = -22, krok = 44, podKon = -40 } = {}) {
  const B = BODY(); const DL = 82.0; const L = DL + B.trunk; const Ey = 3; const A0 = [0, kostkaNaPalcach(0, -60)]; const fi = Math.asin((Ey + B.uarm - A0[1]) / L) / R; const Ex = A0[0] + L * Math.cos(fi * R); const G = [Ex + B.farm + B.hand, Ey, 14];
  const us = Array.from({ length: 9 }, (_, i) => i / 8); const tri = wygladzenie; /* 0 podpór, 1 odwrócone V (powrót robi pętla animacji) */
  const fr = (u) => { const e = tri(u); const a = aMax * e; const S = [Ex - B.uarm * Math.sin(a * R), Ey + B.uarm * Math.cos(a * R)]; const pod = -60 + (podKon + 60) * e; const A = [A0[0] + krok * e, kostkaNaPalcach(0, pod)];
    const P = u === 0 ? [A[0] + DL * Math.cos(fi * R), A[1] + DL * Math.sin(fi * R)] : przeciecie(A, DL, S, B.trunk, 'gora'); if (!P) throw new Error('brak biodra');
    const p = Math.atan2(S[0] - P[0], S[1] - P[1]) / R; const f = nogaZCelu(P, A, 'dol'); const noga = (z) => ({ ankle: A, strona: 'dol', pod, z, rot: 10, pole: f.pole ?? undefined });
    return ramka({ u, miednica: P, p, glowa: p * 0.85, nogi: { R: noga(10), L: noga(-10) }, rece: { R: { g: G, pole: [-0.3, -1, 0.4] }, L: { g: [G[0], G[1], -14], pole: [-0.3, -1, -0.4] } } }); };
  return zbuduj1(cw, us.map(fr));
}

/** Otis-Up (Fitness Volt, SmartWorkout): leżenie na plecach, kolana ugięte, stopy płasko, talerz oburącz przy klatce; siad z wypchnięciem talerza nad głowę, powrót z opuszczeniem do klatki.
 * Talerz rysowany zawsze w płaszczyźnie y–z (silnik), dłonie na jego obręczy po bokach (z = ±21): środek talerza = środek chwytów, przesunięty względem barku o `off(u)` (klatka → nad głowę). */
export function otisUp(cw, { p1 = -14, bend1 = 10 } = {}) {
  const us = Array.from({ length: 9 }, (_, i) => i / 8); const zH = 21;
  const fr = (u) => { const a = wygladzenie(u); const p = lerp(-90, p1, a); const bend = bend1 * a; const S = barki([0, Y0], p, bend);
    const off = [lerp(12, 2, a), lerp(35, 62, a)]; const c = [S[0] + off[0], S[1] + off[1]];
    return ramka({ u, miednica: [0, Y0], p, bend, glowa: p, nogi: { R: { ankle: [44, 7], strona: 'gora', pod: 0, z: ZNOG, rot: 10 }, L: { ankle: [44, 7], strona: 'gora', pod: 0, z: -ZNOG, rot: 10 } },
      rece: { R: { g: [c[0], c[1], zH], pole: [0, -1, 0.1] }, L: { g: [c[0], c[1], -zH], pole: [0, -1, -0.1] } } }); };
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: [...SPRZET, { rodzaj: 'talerz', trzyma: 'obie' }], klatki: us.map(fr), bledy: [] });
}

/** GHD Sit Up (Catalyst, CrossFit, aplikacja): na ławce GHD leżąc na plecach, biodra na tylnym skraju poduszki, stopy zablokowane pod wałkami, nogi prawie proste; odchylenie do poziomu i siad (u = 0 tułów poziomo w tył, u = 1 siad), ręce skrzyżowane na klatce.
 * Nogi opadają ku wałkom pod kątem `beta` (równolegle do poduszki), wałek leży nad kostką (stopa wciśnięta pod niego). Zakres wyprostu biodra silnika (−17°) wyznacza `beta` ≤ 17°. */
export function ghdSitUp(cw, { kat = 15, beta = 15, top = 75, p0 = -90, p1 = 8, bend1 = 14 } = {}) {
  const B = BODY(); const th = kat * R; const n = [Math.sin(th), Math.cos(th)]; const pelvis = [0 + 11.5 * n[0] + 0, top + 11.5 * n[1]]; const L = D_PROSTA_NOGA;
  const A = [pelvis[0] + L * Math.cos(beta * R), pelvis[1] - L * Math.sin(beta * R)]; const rollerC = [A[0] + 9.6 * Math.sin(beta * R), A[1] + 9.6 * Math.cos(beta * R)]; void B;
  const us = Array.from({ length: 9 }, (_, i) => i / 8);
  const fr = (u) => { const a = wygladzenie(u); const p = lerp(p0, p1, a); const bend = bend1 * a; const S = barki(pelvis, p, bend); const f = nogaZCelu(pelvis, A, 'gora'); const sd = Math.atan2(A[1] - f.knee[1], A[0] - f.knee[0]) / R;
    const noga = (z) => ({ ankle: A, strona: 'gora', pod: Math.max(-90, Math.min(90, sd + 45)), z, rot: 10 });
    return ramka({ u, miednica: pelvis, p, bend, glowa: p, nogi: { R: noga(ZNOG), L: noga(-ZNOG) }, rece: { R: { g: chestPt(S, p, -1), pole: [0, 0.1, 1] }, L: { g: chestPt(S, p, 1), pole: [0, 0.1, -1] } } }); };
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: [...SPRZET, { rodzaj: 'rzymska', x: 0, top, kat, dlugosc: r1(rollerC[0]), y: r1(rollerC[1]) }], klatki: us.map(fr), bledy: [] });
}

/** Dragon Flag (Catalyst, Fabryka Siły): leżąc na ławce płaskiej, dłonie za głową chwytają ławkę; ciało proste jak deska, oparte na górnej części pleców (bark), biodra i nogi w powietrzu.
 * Ruch (rysowany wg źródeł: tylko opuszczanie): u = 0 ciało prawie pionowo nad barkami, u = 1 ciało nisko nad ławką pod kątem `thDol`; obrót wokół barków jako sztywna linia (tułów + nogi proste), dłonie nieruchome. */
export function dragonFlag(cw, { top = 43, thGora = 80, thDol = 24, dl = 70, dxBark = 14, dxDlon = 32 } = {}) {
  const B = BODY(); const pad = v2().BENCH.padBack; const Sy = top + pad + 1.0; const Sx = -dl + dxBark; const L = D_PROSTA_NOGA; const G = (sg) => [Sx - dxDlon, top + 6, sg * 17];
  const us = Array.from({ length: 9 }, (_, i) => i / 8);
  const fr = (u) => { const a = wygladzenie(u); const th = lerp(thGora, thDol, a); const c = [Math.cos(th * R), Math.sin(th * R)]; const P = [Sx + B.trunk * c[0], Sy + B.trunk * c[1]]; const A = [P[0] + L * c[0], P[1] + L * c[1]];
    const p = Math.atan2(-c[0], -c[1]) / R; const f = nogaZCelu(P, A, 'gora'); const sd = Math.atan2(A[1] - f.knee[1], A[0] - f.knee[0]) / R;
    const noga = (z) => ({ ankle: A, strona: 'gora', pod: Math.max(-90, Math.min(90, sd - 45)), z, rot: 10 });
    return ramka({ u, miednica: P, p, glowa: -92, nogi: { R: noga(8), L: noga(-8) }, rece: { R: { g: G(1), pole: [0, 0.5, 1] }, L: { g: G(-1), pole: [0, 0.5, -1] } } }); };
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: [...SPRZET, { rodzaj: 'lawka', x: 0, top, kat: 0, dlugosc: dl, siedzisko: 40 }], klatki: us.map(fr), bledy: [] });
}

/** Press Sit-Up (aplikacja, jefit): na ławce skośnej w dół (−20°), stopy zablokowane pod wałkami, sztanga przy klatce; siad i w jego trakcie wypchnięcie sztangi nad głowę.
 * Sztanga idzie za dłońmi (podazaZaChwytem): chwyt na wysokości klatki → nad barkami. Tułów obraca się wokół bioder, kolana ugięte wynikają z położenia kostek pod wałkami. */
export function pressSitUp(cw, { kat = -20, top = 60, p1 = -25, bend1 = 12, zH = 20 } = {}) {
  const B = BODY(); const hip = v2().benchHip(kat, top); const m = [hip[0], hip[1]]; const p0 = kat - 90; const A = [m[0] + v2().BENCH.footBack + 4, top + 7.4]; const us = Array.from({ length: 9 }, (_, i) => i / 8);
  const fr = (u) => { const a = wygladzenie(u); const p = lerp(p0, p1, a); const bend = bend1 * a; const S = barki(m, p, bend); const fv = [Math.cos(p * R), -Math.sin(p * R)]; const cp = chestPt(S, p, 1);
    const c0 = [cp[0] - S[0] + fv[0] * 6, cp[1] - S[1] + fv[1] * 6]; const off = [lerp(c0[0], 2, a), lerp(c0[1], 60, a)]; const g = [S[0] + off[0], S[1] + off[1]];
    const noga = (z) => ({ ankle: A, strona: 'gora', pod: 0, z, rot: 10 });
    return ramka({ u, miednica: m, p, bend, glowa: p, nogi: { R: noga(ZNOG), L: noga(-ZNOG) }, rece: { R: { g: [g[0], g[1], zH], pole: [0, -1, 0.1] }, L: { g: [g[0], g[1], -zH], pole: [0, -1, -0.1] } } }); };
  void B;
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: [...SPRZET, { rodzaj: 'lawka', x: 0, top, kat, dlugosc: 75, walki: true }, { rodzaj: 'sztanga', podazaZaChwytem: true, talerze: true, trzyma: 'obie' }], klatki: us.map(fr), bledy: [] });
}

/** Ćwiczenia, których generator rodziny nie robi (powód obowiązkowy). */
export const WYJATKI = {
  'Side Jackknife': 'leżenie na boku (obrotTulowia 90) z jednoczesnym skłonem bocznym i odwiedzeniem górnej nogi: dwie próby (R3, 04.11.2026) padły na zakresach silnika — wyprost biodra górnej nogi −18° (limit −17°) i zgięcie barku górnej ręki przy głowie 218° (limit 171°); wymaga zmiany zakresów albo osobnego rigu, poza zakresem tej sesji',
};
/** Identyfikatory błędów z katalogu bez opisu w lib/cues/text/pl.json (id → powód); do uzupełnienia przez badacza i tłumacza. */
export const WYJATKI_OPISU = { 'cobra.mis': 'zestaw ogólny „cobra” (cue-sets.json: Superman, Lower Back Curl) odwołuje się do wskazówki bez tekstu w lib/cues/text/*.json; tekst do napisania przez badacza, przekład przez tłumacza' };
export const PRZYBLIZENIA = {
  'Alternate Heel Touchers': 'skłon boczny tułowia (przechylTulowia, poza@2) jest sztywny w biodrach, nie łukiem; dłoń kończy ruch przy pięcie, bez dotyku',
  'Superman': 'przybliżenie: stopy grzbietem w dół, palce do tyłu (zgięcie podeszwowe 50°); nogi i ręce unoszą się razem, rysowane dwie fazy skrajne',
  'Tuck Crunch': 'przybliżenie: skrzyżowanie kostek zastąpione zbliżeniem kostek (z = ±3)',
  'Butt-Ups': 'przybliżenie: stopy na palcach podchodzą o 44 cm ku dłoniom podczas unoszenia bioder (przy nieruchomych łokciach i stopach odwrócone V nie powstaje: odległość bark–stopy jest stała); bark odchyla się do przodu o 22° nad łokciem',
  'Press Sit-Up': 'przybliżenie: talerze sztangi rysowane w płaszczyźnie y–z, sztanga idzie za dłońmi (podazaZaChwytem); ławka −20°, stopy pod wałkami',
  'Otis-Up': 'przybliżenie: talerz rysowany zawsze w płaszczyźnie y–z, dłonie na obręczy po bokach',
  'GHD Sit Up': 'przybliżenie: wałek nad kostkami (stopa pod nim), poduszka rysowana jako schemat ławki rzymskiej (kąt 15°), tułów odchylany tylko do poziomu (wyprost biodra do −17°)',
  'Cocoons': 'ruch ramion: z nad głową w stronę kolan (opis katalogu niejednoznaczny)',
};

export function generuj() {
  return {
    'Bird Dog': () => birdDog('Bird Dog'),
    'Crunch - Hands Overhead': () => crunchHandsOverhead('Crunch - Hands Overhead'),
    'Dead Bug': () => deadBug('Dead Bug'),
    'Hollow Hold': () => hollowHold('Hollow Hold'),
    'Lying Leg Raise': () => lyingLegRaise('Lying Leg Raise'),
    'Reverse Crunch': () => reverseCrunch('Reverse Crunch'),
    'Tuck Crunch': () => tuckCrunch('Tuck Crunch'),
    'Alternate Heel Touchers': () => alternateHeelTouchers('Alternate Heel Touchers'),
    'Cocoons': () => cocoons('Cocoons'),
    'Bicycle Crunch': () => bicycleCrunch('Bicycle Crunch'),
    'Cross-Body Crunch': () => crossBodyCrunch('Cross-Body Crunch'),
    'Toe Touchers': () => toeTouchers('Toe Touchers'),
    'Leg Pull-In': () => legPullIn('Leg Pull-In'),
    'Superman': () => superman('Superman'),
    'V-Up': () => vUp('V-Up'),
    'Stability Ball Crunch': () => stabilityBallCrunch('Stability Ball Crunch'),
    'Crunch - Legs On Exercise Ball': () => crunchLegsOnBall('Crunch - Legs On Exercise Ball'),
    'Cable Reverse Crunch': () => cableReverseCrunch('Cable Reverse Crunch'),
    'Suspended Reverse Crunch': () => suspendedReverseCrunch('Suspended Reverse Crunch'),
    'Cable Crunch': () => cableCrunch('Cable Crunch'),
    'Machine Crunch': () => machineCrunch('Machine Crunch'),
    'Butt-Ups': () => buttUps('Butt-Ups'),
    'Otis-Up': () => otisUp('Otis-Up'),
    'GHD Sit Up': () => ghdSitUp('GHD Sit Up'),
    'Dragon Flag': () => dragonFlag('Dragon Flag'),
    'Press Sit-Up': () => pressSitUp('Press Sit-Up'),
  };
}
