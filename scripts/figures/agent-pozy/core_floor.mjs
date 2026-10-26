// Generator póz rodziny core_floor po stronie agenta (pilotaż 26.10.2026): ćwiczenia na podłodze (leżenie na plecach, na brzuchu, klęk podparty) wyliczone z modelu przez kinematykę prostą
// (kąty uda i kolana → kostka; kąt ramienia → chwyt), biegun kolana z FK (kolano zawsze po właściwej stronie), parametry per ćwiczenie z katalogu i wskazówek.
// Układ: leżenie na plecach — głowa w stronę −x, nogi w stronę +x, miednica [0, 8, 0], pochylenieTulowia −90 (poziomo); na brzuchu — głowa +x, pochylenie +90.
import { wczytajTeksty } from '../v2-jakosc.mjs';
import { v2, BODY, R, r1, up, dir, klatka, bladZTrajektorii, zbuduj, barki } from './model.mjs';

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
export function ramka({ u, miednica, p, bend = 0, glowa, nogi, rece, polaLokci = {}, przechyl }) {
  const hip = [miednica[0], miednica[1]]; const S = barki([miednica[0], miednica[1]], p, bend); const nog = {}; const rec = {};
  for (const s of ['R', 'L']) {
    const sg = s === 'R' ? 1 : -1; const n = nogi[s]; const hz = sg * 8.5; void hz;
    const f = n.ankle ? nogaZCelu(hip, n.ankle, n.strona ?? 'gora') : nogaFK(hip, n.t, n.k); const pole = n.pole ?? f.pole;
    const sd = n.ankle ? null : n.t - n.k; nog[s] = { k: [f.ankle[0], f.ankle[1], sg * (n.z === undefined ? ZNOG : Math.abs(n.z))], pod: n.pod ?? (sd === null ? 0 : podbicieNeutralne(sd, n.stopa)), rot: n.rot ?? 10, pole: pole ? [pole[0], pole[1], sg * 0.1] : [0.15, 1, sg * 0.1] };
    const r = rece[s]; const g = r.g ? r.g : chwyt(S, r.a, r.z ?? sg * 19, r.d); rec[s] = { g, pole: polaLokci[s] ?? r.pole ?? (r.g ? undefined : [0, 0.2, sg]) };
  }
  return klatka({ u, miednica: [miednica[0], miednica[1], 0], pitch: p, bend, glowa: glowa ?? p, nogi: nog, rece: rec, przechyl });
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
function alternateHeelTouchers(cw, { lean = 16, p1 = -72, heelX = 30, bend1 = 40 } = {}) {
  /* leżąc na plecach, kolana zgięte, stopy płasko; naprzemienny skłon boczny (przechylTulowia, poza@2): u = 0 płasko, 0,5 skłon ku prawej pięcie, 1 ku lewej; ręka po stronie skłonu sięga pięty, druga leży przy boku */
  const us = [0, 0.5, 1]; const zS = 22;
  const fr = (u) => { const sk = u === 0.5 ? 1 : u === 1 ? -1 : 0; const p = u === 0 ? -90 : p1; const bend = u === 0 ? 0 : bend1; const S = barki([0, Y0], p, bend); /* odrywają się tylko łopatki: lędźwie przy podłodze */
    const bok = (s) => { const sg = s === 'R' ? 1 : -1; return { g: [S[0] + Math.sqrt(46 ** 2 - 25), 5, sg * 24], pole: [0, 0, sg] }; }; /* ręka przy boku, na podłodze */
    const sięga = (s) => { const sg = s === 'R' ? 1 : -1; return { g: [heelX - 12, 6, sg * zS], pole: [0, 0.3, sg] }; }; /* dłoń przy pięcie po stronie skłonu */
    const rece = { R: sk === 1 ? sięga('R') : bok('R'), L: sk === -1 ? sięga('L') : bok('L') };
    return ramka({ u, miednica: [0, Y0], p, bend, glowa: p, nogi: { R: { ankle: [heelX, 7], strona: 'gora', pod: 0, z: zS }, L: { ankle: [heelX, 7], strona: 'gora', pod: 0, z: -zS } }, rece, przechyl: sk * lean }); };
  return zbuduj1(cw, us.map(fr));
}
function crunchHandsOverhead(cw) {
  return crunch(cw, { pU1: -62, bend1: 40, nogi: () => stopyPlasko(35, ZNOG), rece: (S, p) => ({ R: { a: KAT_OS(p) - 25, z: 5 }, L: { a: KAT_OS(p) - 25, z: -5 } }) });
}
function tuckCrunch(cw) {
  const us = [0, 0.5, 1]; const fr = (u) => { const p = lerp(-90, -62, u); const S = barki([0, Y0], p); const t = lerp(90, 102, u); const k = lerp(30, 70, u); const fk = (z) => ({ t, k, z, rot: 10, stopa: 'dol' });
    const chest = (sg) => { const upv = up(p), fv = [Math.cos(p * R), -Math.sin(p * R)]; const P = [0 + upv[0] * 32 + fv[0] * 9.5, 9 + upv[1] * 32 + fv[1] * 9.5]; return [P[0], P[1], sg * 6]; }; /* ręce skrzyżowane na klatce */
    return ramka({ u, miednica: [0, Y0], p, glowa: p, nogi: { R: fk(3), L: fk(-3) }, rece: { R: { g: chest(-1), pole: [0, 0.1, 1] }, L: { g: chest(1), pole: [0, 0.1, -1] } } }); };
  return zbuduj1(cw, us.map(fr));
}
/** Ruch prowadzony miednicą (reverse crunch, leg pull-in): barki i głowa nieruchome, miednica unosi się o dy, uda i golenie zgodnie z FK. */
function ruchMiednica(cw, { t0, k0, t1, k1, dy = 12, stopa = 'dol' }) {
  const S0 = barki([0, Y0], -90); const us = [0, 0.25, 0.5, 0.75, 1];
  const fr = (u) => { const e = u; const y = Y0 + dy * e; const { P, p } = miednicaPrzyBarkach(S0, y); const nk = (t, k) => ({ t, k, stopa }); const tt = lerp(t0, t1, e), kk = lerp(k0, k1, e);
    return ramka({ u, miednica: P, p, glowa: -90, nogi: { R: { ...nk(tt, kk), z: ZNOG }, L: { ...nk(tt, kk), z: -ZNOG } }, rece: RECE_BOK(S0) }); };
  return zbuduj1(cw, us.map(fr));
}
function reverseCrunch(cw) { return ruchMiednica(cw, { t0: 90, k0: 90, t1: 130, k1: 125, dy: 13 }); }
function legPullIn(cw) { const ks = kolanoProste(); return ruchMiednica(cw, { t0: 10, k0: ks, t1: 105, k1: 105, stopa: 'gora' }); }

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
function cocoons(cw) {
  const ks = kolanoProste(); const us = Array.from({ length: 9 }, (_, i) => i / 8);
  const fr = (u) => { const p = lerp(-90, -62, u); const y = Y0; /* miednica zostaje na podłodze (siedzi na pośladkach) — v2-jakosc: nic_nie_wisi */ const t = lerp(10, 100, u), k = lerp(ks, 100, u); const S = barki([0, y], p);
    const fk = nogaFK([0, y], t, k); const dokolan = Math.atan2(fk.knee[1] - S[1], fk.knee[0] - S[0]) / R; const aOver = KAT_OS(p) - 20; const a = lerp(aOver, dokolan, wygladzenie(Math.min(1, u * 1.2)));
    return ramka({ u, miednica: [0, y], p, glowa: p, nogi: { R: { t, k, z: ZNOG, stopa: 'gora' }, L: { t, k, z: -ZNOG, stopa: 'gora' } }, rece: { R: { a, z: 8 }, L: { a, z: -8 } } }); };
  return zbuduj1(cw, us.map(fr));
}
function vUp(cw) {
  const ks = kolanoProste(); const us = Array.from({ length: 9 }, (_, i) => i / 8);
  const fr = (u) => { const el = lerp(0, 60, u); const p = -90 + el; const t = lerp(10, 60, u); const S = barki([0, Y0], p); const fk = nogaFK([0, Y0], t, ks); const dok = Math.atan2(fk.ankle[1] - S[1], fk.ankle[0] - S[0]) / R; const aOver = KAT_OS(p) - 20; const a = lerp(aOver, dok, u);
    return ramka({ u, miednica: [0, Y0], p, glowa: p, nogi: { R: { t, k: ks, z: ZNOG, stopa: 'gora' }, L: { t, k: ks, z: -ZNOG, stopa: 'gora' } }, rece: { R: { a, z: 14 }, L: { a, z: -14 } } }); };
  return zbuduj1(cw, us.map(fr));
}

/* ---------- Superman (na brzuchu, pozycja +x) ---------- */
function superman(cw, { bledy = !!wczytajTeksty()['cobra.mis'] } = {}) { /* błąd tylko, gdy ma opis w tekstach wskazówek (v2-jakosc: etykieta_bledu) */
  const us = [0, 0.25, 0.5, 0.75, 1];
  const fr = (u, wznios) => { const phi = Math.asin(Math.min(1, wznios / BODY().trunk)) / R; const p = 90 - phi; const S = barki([0, Y0], p); const aR = phi * 0.6 - 2 - 3 * (1 - u); const hz = 15; /* ręce prosto przed sobą, lekko w górę */
    const ank = () => { const y = 16 + 10 * u; /* r4: biodro ze znakiem, zakres −17°…133°: wyprost nogi w Supermanie ≤ ok. 17° */ const a = Math.asin((y - Y0) / D_PROSTA_NOGA); return [-D_PROSTA_NOGA * Math.cos(a), y]; };
    const nog = (sg) => ({ ankle: ank(), strona: 'dol', pod: 0, rot: 90, z: ZNOG, pole: [0.15, -1, 0.1 * sg] });
    return ramka({ u, miednica: [0, Y0], p, glowa: p * 0.92, nogi: { R: nog(1), L: nog(-1) }, rece: { R: { g: chwyt(S, aR, hz), pole: [0, -1, 0.2] }, L: { g: chwyt(S, aR, -hz), pole: [0, -1, -0.2] } } }); };
  const ok = (u) => fr(u, 8 * u); const zle = (u) => fr(u, 5 + 17 * u); /* błąd: klatka uniesiona o 5 cm już w u = 0, o 22 cm na końcu (przeprost lędźwi) */
  return zbuduj1(cw, us.map(ok), bledy ? [bladZTrajektorii({ cue: 'cobra.mis', postawa: true, znacznik: 'back', us, ok, zle })] : []);
}

/* ---------- Bird Dog (klęk podparty; u = 1: prawa ręka i lewa noga wyprostowane) ---------- */
function birdDog(cw) {
  const B = BODY(); const hx = 60; const Sy = 2 + 61.5; const Py = 8.8 + B.thigh; const phi = Math.asin((Sy - Py) / B.trunk) / R; const P = [hx - B.trunk * Math.cos(phi * R), Py]; const p = 90 - phi; const us = [0, 0.25, 0.5, 0.75, 1];
  const S = [hx, Sy]; const kn = [P[0], 8.8]; const ankleK = (t, k) => nogaFK(P, t, k);
  const fr = (u) => { const aR = lerp(-90, 0, u); const tR = 270, kR = 105; const tL = lerp(270, 184, u), kL = lerp(105, ks0(), u);
    const rG = u === 0 ? [S[0], 2, 19] : chwyt(S, aR, 19, 61.5); const lG = [S[0], 2, -19];
    const nR = nogaFK(P, tR, kR), nL = nogaFK(P, tL, kL); const PODB = -90; const PODL = lerp(-90, -80, u);
    return klatka({ u, miednica: [P[0], P[1], 0], pitch: p, glowa: p, nogi: { R: { k: [nR.ankle[0], nR.ankle[1], 10], pod: PODB, pole: nR.pole ? [nR.pole[0], nR.pole[1], 0.1] : [0.15, -1, 0.1] }, L: { k: [nL.ankle[0], nL.ankle[1], -10], pod: PODL, pole: nL.pole ? [nL.pole[0], nL.pole[1], -0.1] : [0.15, -1, -0.1] } }, rece: { R: { g: rG, pole: [-0.5, -1, 0.3] }, L: { g: lG, pole: [-0.5, -1, -0.3] } } }); };
  void ankleK; void kn;
  return zbuduj1(cw, us.map(fr));
}
const ks0 = () => kolanoProste();

/** Ćwiczenia, których generator rodziny nie robi (powód obowiązkowy). */
export const WYJATKI = {};
/** Identyfikatory błędów z katalogu bez opisu w lib/cues/text/pl.json (id → powód); do uzupełnienia przez badacza i tłumacza. */
export const WYJATKI_OPISU = { 'cobra.mis': 'zestaw ogólny „cobra” (cue-sets.json: Superman, Lower Back Curl) odwołuje się do wskazówki bez tekstu w lib/cues/text/*.json; tekst do napisania przez badacza, przekład przez tłumacza' };
export const PRZYBLIZENIA = {
  'Alternate Heel Touchers': 'skłon boczny tułowia (przechylTulowia, poza@2) jest sztywny w biodrach, nie łukiem; dłoń kończy ruch przy pięcie, bez dotyku',
  'Superman': 'przybliżenie: stopy skierowane na zewnątrz (rotacja 90°), bo model stopy nie ma palców skierowanych do tyłu',
  'Tuck Crunch': 'przybliżenie: skrzyżowanie kostek zastąpione zbliżeniem kostek (z = ±3)',
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
    'Leg Pull-In': () => legPullIn('Leg Pull-In'),
    'Superman': () => superman('Superman'),
    'V-Up': () => vUp('V-Up'),
  };
}
