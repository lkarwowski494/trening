// Generator póz rodziny calf_raise po stronie agenta (wersja 1.1, 26.10.2026): wspięcia na palce stojąc, na jednej nodze, w siadzie i na maszynach.
// Pozy WYLICZONE z modelu: stopa obraca się wokół czubka palców stojących na podłodze (albo na brzegu stopnia): kostka z długości stopy i podbicia, miednica z odległości biodro–kostka (kolano IK).
// Błąd z cue (calf.mis.partial): płytkie wspięcie — podbicie na górze tylko −12° (reguła wspiecie wymaga ≤ −15°); łamie wyłącznie grupę „zakres”.
import { v2, BODY, R, r1, lerp, ease, HIP, SH, ZASIEG_R, hipY, tp, S, reka, K, poza, PODLOGA, kolano2D, katXY, bladZTrajektorii, delta } from './dol.mjs';

export const RODZINA = 'calf_raise';
const ZS = 10;
const POD_GORA = -45; /* podbicie na górze wspięcia (palce): kąt kostki ≈ −45° */
const POD_GORA_SIEDZ = -34; /* w siadzie goleń odchyla się do przodu, więc podbicie mniejsze (kąt kostki ≈ −48°) */
const POD_PLYTKO = -10; /* błąd: płytkie wspięcie (kąt kostki > −15°) */
/** Stopień: krawędź blatu pod głowami kości śródstopia (70% długości stopy od pięty, czyli 7,5 cm od czubka palców); blat sięga od niej 1 cm w głąb przodostopia, pięta wisi poza krawędzią (recenzja 1.1, partia 2, nr 1). */
export const STOPIEN_X0 = (xT) => r1(xT - 0.3 * (BODY().heelBack + BODY().toeFwd) - 1);
/** Kostka (x, y) stopy obracającej się wokół czubka palców stojącego w punkcie (xT, top): podbicie pod (stopnie, ujemne = pięta w górze). */
export const kostkaZPalcow = (xT, top, pod, xE = null) => {
  const f = pod * R;
  /* stopień (xE = krawędź blatu): przy piętach poniżej poziomu (podbicie > 0) stopa obraca się wokół krawędzi (głowy kości śródstopia na krawędzi, pięta wisi), przy wspięciu wokół czubka palców */
  if (xE !== null && pod > 0) { const vx = xT - 19 - xE, vy = 7; return [xE + vx * Math.cos(f) - vy * Math.sin(f), top + vx * Math.sin(f) + vy * Math.cos(f)]; }
  return [xT - 19 * Math.cos(f) - 7 * Math.sin(f), top + 7 * Math.cos(f) - 19 * Math.sin(f)];
};

/** Ręce wg wariantu: tryb 'sztanga' (sztanga na plecach), 'hantle' (przy bokach), 'biodra', 'maszyna' (uchwyty przy klatce), 'sciana' (ręka na ścianie przed osobą) itd. */
function rece(tryb, m, p, o = {}) {
  const Sx = S(m, p);
  switch (tryb) {
    case 'sztanga': { const g = (sg) => ({ g: tp(m, p, BODY().trunk - 3, -12.8, sg * 32), pole: [-0.7, -1, sg * 0.5] }); return { hr: g(1), hl: g(-1), sprzet: [{ rodzaj: 'sztanga', talerze: true, podazaZaChwytem: true, dlugosc: 220 }] }; }
    case 'hantle': { const f = reka(Sx, { z: 26, d: ZASIEG_R() - 1.5, dx: 2 }); return { hr: f(1), hl: f(-1), sprzet: [{ rodzaj: 'hantel' }] }; }
    case 'bok': { const f = reka(Sx, { z: 24, d: ZASIEG_R() - 3 }); return { hr: f(1), hl: f(-1), sprzet: [] }; }
    case 'biodra': { const g = (sg) => ({ g: [m[0] - 3, m[1] + 10, sg * 21], pole: [-0.5, 0, sg] }); return { hr: g(1), hl: g(-1), sprzet: [] }; }
    case 'maszyna': { const g = (sg) => ({ g: [Sx[0] + 14, Sx[1] - 20, sg * 24], pole: [0, -1, sg * 0.5] }); return { hr: g(1), hl: g(-1), sprzet: [] }; }
    case 'donkey': { const g = (sg) => ({ g: [Sx[0] + 18, 65, sg * 16], pole: [-0.3, -1, sg * 0.6] }); return { hr: g(1), hl: g(-1), sprzet: [] }; }
    case 'guma': { const f = reka(Sx, { z: 24, d: ZASIEG_R() - 6 }); return { hr: f(1), hl: f(-1), sprzet: [{ rodzaj: 'guma', mocowanie: 'stopy', trzyma: 'obie' }] }; }
    default: return rece('biodra', m, p, o);
  }
}
const stopy = (xT, top, pod, stopien = false) => kostkaZPalcow(xT, top, pod, stopien ? STOPIEN_X0(xT) : null);
/** Klatka: nogi proste (kolano ~ k0), miednica nad kostkami w stałym x (pierwsza klatka wyznacza x). */
function klatka(u, { xT = 0, top = 0, pod, x, k0 = 6, p = 0, tryb = 'bok', jednonoz = false, wolna = null, rece: rr = null, mfun = null }) {
  const aR = stopy(xT, top, pod); const aL = jednonoz ? null : stopy(xT, top, pod);
  const ar = [aR[0], aR[1], ZS]; const al = jednonoz ? wolna.a : [aL[0], aL[1], -ZS];
  const y = jednonoz ? hipY(ar, x, HIP(), k0) : Math.min(hipY(ar, x, HIP(), k0), hipY(al, x, -HIP(), k0));
  const m = [x, y]; const o = (rr ?? rece)(tryb, m, p);
  return { f: K({ u, m, p, head: p * 0.3, R: { a: ar, pod, rot: 10, odch: 6 }, L: { a: al, pod: jednonoz ? wolna.pod : pod, rot: 10, odch: 6, pole: jednonoz ? wolna.pole : undefined }, hr: o.hr, hl: o.hl }), o, m, ar, al };
}

/** Wspięcie na stojąco: stopy na podłodze (blok = 0) albo na brzegu bloku/stopnia (blok > 0: pięta zawieszona, podbicie dołem +10°). */
export function stojac(cw, o = {}) {
  const { tryb = 'bok', blok = 0, x = 0, sprzetFn = null, pod0 = blok ? 10 : 0, bledy = true, jednonoz = false, recFn = null, p = 0, wolnaFn = null } = o;
  const xT = x + 8; const us = [0, 0.25, 0.5, 0.75, 1];
  const mk = (u, podGora) => { const pod = lerp(pod0, podGora, ease(u)); const aR = stopy(xT, blok, pod, blok > 0); const ar = [aR[0], aR[1], ZS];
    const al = jednonoz ? null : [aR[0], aR[1], -ZS]; const y = jednonoz ? hipY(ar, x, HIP(), 6) : Math.min(hipY(ar, x, HIP(), 6), hipY(al, x, -HIP(), 6)); const m = [x, y];
    const w = jednonoz ? wolnaFn(m) : null; const rr = (recFn ?? rece)(tryb, m, p, { u });
    return { f: K({ u, m, p, head: p * 0.3, R: { a: ar, pod, rot: 10, odch: 6 }, L: { a: jednonoz ? w.a : al, pod: jednonoz ? w.pod : pod, rot: 10, odch: 6, pole: jednonoz ? w.pole : undefined }, hr: rr.hr, hl: rr.hl }), o: rr, m }; };
  const fr = us.map((u) => mk(u, POD_GORA)); const zle = us.map((u) => mk(u, POD_PLYTKO));
  const spr = [PODLOGA(-120, 160), ...fr[0].o.sprzet, ...(blok ? [{ rodzaj: 'skrzynia', x0: STOPIEN_X0(xT), x1: r1(xT + 40), top: blok }] : []), ...(sprzetFn ? sprzetFn(fr) : [])];
  const b = bledy ? [bladZTrajektorii({ cue: 'calf.mis.partial', znacznik: 'heels', us, ok: (u) => fr[us.indexOf(u)].f, zle: (u) => zle[us.indexOf(u)].f })] : [];
  return poza(RODZINA, cw, spr, fr.map((r) => r.f), b);
}

/** Podest pod przodostopiem w siadzie (ACG-020, 31.10.2026; zatwierdzone pozy): blat 6 cm, krawędź 53,6 cm od osi miednicy, palce stoją na nim (xT = 61), pięta w dole poniżej blatu. */
const PODEST_SIEDZ = { x0: 53.6, x1: 100, top: 6 };
/** Dół wspięcia w siadzie: goleń pionowo pod kolanem (kostka = miednica + [42, −41]), podbicie +10° (pięta ≥ 2 cm poniżej krawędzi podestu); wyższe klatki — stopa obraca się wokół palców na podeście. */
const SIEDZ_DOL = { ankle: [42, 11.1], pod: 10 };
/** Miednica na siedzisku: kostka dołu + goleń 41 cm (y = 11,1 + 41). */
const SIEDZ_M = [0, 52.1];
/** Ręce wariantów w siadzie zostają jak w wersji bez podestu (kolano liczone dla stopy na podłodze, miednica y 48), przesunięte o różnicę siedziska 5,3 cm (zatwierdzone pozy). */
const SIEDZ_REKA_DY = 5.3;
/** Dźwignia z poduszką na ciele (punkt „barki” albo „uda”, P1-CALF-1, 11.11.2026): prowadnica od poduszki w klatce u = 0 wzdłuż cięciwy toru poduszki (do klatki u = 1), z zapasem skoku. Punkt liczy silnik (leverBodyFrom). */
const DZW_ZAPAS = 6;
export function dzwigniaPoduszka(punkt, cw, spr, klatki) {
  const E = v2(); const pad = (u) => { const sk = E.keyframeFrame({ kontrakt: E.CONTRACT.id, rodzina: RODZINA, cwiczenie: cw, sprzet: spr, klatki, bledy: [] }, u).sk; const b = E.leverBodyFrom(sk); return (punkt === 'barki' ? b.shoulders : b.thighs).R; };
  const a = pad(0), c = pad(1); const kat0 = Math.atan2(c[1] - a[1], c[0] - a[0]) / R; const dl = Math.hypot(c[0] - a[0], c[1] - a[1]);
  /* tor bliski pionu (do 10°; kontrakt dopuszcza kat ≤ 90): prowadnica pionowa przez środek toru w poziomie, odchylenie poduszki od niej ≤ połowa przesunięcia (≤ 3 cm: tolerancja kolizji) */
  const pion = Math.abs(kat0 - 90) < 10; const kat = pion ? 90 : kat0; const x = pion ? (a[0] + c[0]) / 2 : a[0];
  return { rodzaj: 'dzwignia', tryb: 'prosta', kat: r1(kat), punkt, trzyma: 'R', x: r1(x), y: r1(a[1]), z: r1(a[2]), dlugosc: r1(dl + DZW_ZAPAS) };
}

/** Wspięcie w siadzie: miednica nieruchoma na siedzisku (ławka z siedziskiem 40 cm), uda poziomo, stopy na podeście pod przodostopiem, obracają się wokół palców; dźwignia/ciężar na kolanach (maszyna: poduszka na udach). */
export function siedzac(cw, o = {}) {
  const { tryb = 'hantle', jednonoz = false, maszyna = false, bledy = true } = o;
  const [xp, yp] = SIEDZ_M; const xT = xp + 61; const us = [0, 0.25, 0.5, 0.75, 1]; const mOld = [0, 48];
  const mk = (u, podGora) => {
    const pod = lerp(0, podGora, ease(u)); const a = u === 0 ? SIEDZ_DOL.ankle : kostkaZPalcow(xT, PODEST_SIEDZ.top, pod); const podK = u === 0 ? SIEDZ_DOL.pod : pod;
    const aR = [a[0], a[1], ZS]; const aL = jednonoz ? [SIEDZ_DOL.ankle[0], SIEDZ_DOL.ankle[1], -ZS] : [a[0], a[1], -ZS];
    const m = [xp, yp]; const aOld = kostkaZPalcow(xT, 0, pod); const kR = kolano2D(mOld, aOld, [1, 0.4]); const kL = kolano2D(mOld, jednonoz ? [xT - 19, 7] : aOld, [1, 0.4]);
    const gr = (k, sg) => [k[0] - 5, k[1] + 13.9 + SIEDZ_REKA_DY, sg * 12];
    let hr, hl, sprzet = [];
    if (tryb === 'hantle') { hr = { g: gr(kR, 1), pole: [-0.3, -1, 0.6] }; hl = jednonoz ? { g: [xp + 22, mOld[1] + 10 + SIEDZ_REKA_DY, -14], pole: [-0.3, -1, -0.6] } : { g: gr(kL, -1), pole: [-0.3, -1, -0.6] };
      sprzet = jednonoz ? [{ rodzaj: 'hantel', trzyma: 'R' }] : [{ rodzaj: 'hantel' }]; }
    else if (tryb === 'sztanga') { const g = (sg) => ({ g: [kR[0] - 3, kR[1] + 10 + SIEDZ_REKA_DY, sg * 30], pole: [-0.3, -1, sg * 0.6] }); hr = g(1); hl = g(-1); sprzet = [{ rodzaj: 'sztanga', talerze: true, podazaZaChwytem: true, dlugosc: 120 }]; }
    else { const g = (sg) => ({ g: [xp + 30, yp + 8, sg * 15], pole: [-0.3, -1, sg * 0.6] }); hr = g(1); hl = g(-1); }
    return { f: K({ u, m, p: 0, head: 0, R: { a: aR, pod: podK, rot: 10, odch: 6, pole: [1, 0.4, 0.05] }, L: { a: aL, pod: jednonoz ? SIEDZ_DOL.pod : podK, rot: 10, odch: 6, pole: [1, 0.4, -0.05] }, hr, hl }), o: { sprzet } };
  };
  const fr = us.map((u) => mk(u, POD_GORA_SIEDZ)); const zle = us.map((u) => mk(u, POD_PLYTKO));
  const podloga = PODEST_SIEDZ; const podest = { rodzaj: 'skrzynia', x0: podloga.x0, x1: podloga.x1, top: podloga.top };
  const reszta = fr[0].o.sprzet; const bazowy = [PODLOGA(-80, 130), podest, ...reszta];
  const siedzisko = maszyna ? { rodzaj: 'lawka', x: r1(xp - 10.2), top: 41.9, kat: 90, siedzisko: 40, dlugosc: 75 } : { rodzaj: 'lawka', x: r1(xp - 10.2), top: 42.7, kat: 0, siedzisko: 40, dlugosc: 75 };
  const spr = [...bazowy, siedzisko, ...(maszyna ? [dzwigniaPoduszka('uda', cw, [...bazowy, siedzisko], fr.map((r) => r.f))] : [])];
  const b = bledy ? [bladZTrajektorii({ cue: 'calf.mis.partial', znacznik: 'heels', us, ok: (u) => fr[us.indexOf(u)].f, zle: (u) => zle[us.indexOf(u)].f })] : [];
  return poza(RODZINA, cw, spr, fr.map((r) => r.f), b);
}

/** Donkey Calf Raise: dźwignia prosta (prowadnica pionowa) z punktem na miednicy (ciężar na biodrach). */
const dzwigniaMiednica = (fr) => { const m0 = fr[0].m; const m1 = fr[fr.length - 1].m; return [{ rodzaj: 'dzwignia', tryb: 'prosta', kat: 90, punkt: 'miednica', trzyma: 'R', x: r1(m0[0]), y: r1(m0[1] - 1), z: 0, dlugosc: r1(m1[1] - m0[1] + 6) }]; };
/** Maszyna stojąca: dźwignia prosta (prowadnica pionowa) z poduszką na barku (punkt „barki”, P1-CALF-1 — poduszki na barkach, nie na miednicy). */
const dzwigniaBarki = (cw) => (fr) => { const bez = [PODLOGA(-120, 160), ...fr[0].o.sprzet, { rodzaj: 'skrzynia', x0: STOPIEN_X0(fr[0].m[0] + 8), x1: r1(fr[0].m[0] + 8 + 40), top: 6 }]; return [dzwigniaPoduszka('barki', cw, bez, fr.map((r) => r.f))]; };

export const WYJATKI = {};
export const PRZYBLIZENIA = {};
export function generuj() {
  const smith = (fr) => [{ rodzaj: 'smith', x: r1(fr[0].m[0] - 12.8), h: 200 }];
  /* niski wyciąg tuż przed stopami (recenzja r1 W3, 09.11.2026): opór wspięcia ma być prawie pionowy — bloczek 16 cm przed grzbietem stóp, linka do dłoni pod kątem ok. 16° od pionu (było 105 cm i 28° pod poziomem) */
  const linki = () => [{ rodzaj: 'wyciag', dwa: true, x: 16, y: 22, z: 45, chwyt: 'uchwyt', h: 120 }];
  const sciana = () => { let y0 = null; return (tryb, m, p) => { y0 ??= S(m, p)[1] - 8; const g = (sg) => ({ g: [37, y0, sg * 16], pole: [-0.3, -1, sg * 0.6] }); return { hr: g(1), hl: g(-1), sprzet: [] }; }; };
  const wolna = (m) => { const a = [m[0] - 28, m[1] - 54, -ZS]; const kn = kolano2D(m, a, [1, -0.2]); return { a, pod: Math.max(-70, Math.min(20, katXY(a, kn) - 84)), pole: [1, -0.2, 0] }; };
  const pudlo = (fr) => { const Sx = S(fr[0].m, 84); return [{ rodzaj: 'skrzynia', x0: r1(Sx[0] + 8), x1: r1(Sx[0] + 40), top: 62 }, ...dzwigniaMiednica(fr)]; };
  return {
    /* karta „przytrzymaj się czegoś dla równowagi” (calf.step; recenzja r1 N1, 09.11.2026): obie dłonie na ścianie przed osobą, jak w Single Leg Calf Raise */
    'Łydki na stopniu': () => stojac('Łydki na stopniu', { blok: 8, bledy: false, recFn: sciana(), sprzetFn: () => [{ rodzaj: 'sciana', x: 40, h: 220, przed: true }] }),
    'Standing Calf Raise': () => stojac('Standing Calf Raise', { blok: 6, tryb: 'maszyna', sprzetFn: dzwigniaBarki('Standing Calf Raise') }),
    'Smith Machine Calf Raise': () => stojac('Smith Machine Calf Raise', { blok: 6, tryb: 'sztanga', sprzetFn: smith }),
    'Calf Raise (sztanga)': () => stojac('Calf Raise (sztanga)', { blok: 6, tryb: 'sztanga' }),
    'Calf Raise (linki)': () => stojac('Calf Raise (linki)', { tryb: 'bok', sprzetFn: linki }),
    'Donkey Calf Raise': () => stojac('Donkey Calf Raise', { blok: 6, tryb: 'donkey', p: 84, sprzetFn: pudlo }),
    'Band Calf Raise': () => stojac('Band Calf Raise', { tryb: 'guma' }),
    'Single Leg Calf Raise': () => stojac('Single Leg Calf Raise', { blok: 6, jednonoz: true, wolnaFn: wolna, recFn: sciana(), sprzetFn: () => [{ rodzaj: 'sciana', x: 40, h: 220, przed: true }] }),
    'Seated Calf Raise': () => siedzac('Seated Calf Raise', { tryb: 'maszyna', maszyna: true, bledy: false }),
    'Seated Calf Raise (hantle)': () => siedzac('Seated Calf Raise (hantle)', { tryb: 'hantle' }),
    'Barbell Seated Calf Raise': () => siedzac('Barbell Seated Calf Raise', { tryb: 'sztanga' }),
    'Dumbbell Seated One-Leg Calf Raise': () => siedzac('Dumbbell Seated One-Leg Calf Raise', { tryb: 'hantle', jednonoz: true }),
  };
}
