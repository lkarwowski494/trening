// Generator póz rodziny leg_isolation po stronie agenta (wersja 1.1, 26.10.2026): prostowanie i uginanie nóg na maszynach, w staniu, na linkach i gumie, uginanie na ślizgaczach.
// Pozy WYLICZONE z modelu: miednica nieruchoma, udo poziomo (siad) albo pionowo (stanie), goleń obraca się w kolanie o kąt z modelu (kolano = bieguny z IK), dźwignia maszyny na osi kolana (promień = goleń + przesunięcie boczne).
// Błędy: rodzina ma tylko mis.jerk (tempo, bez animacji); Slider Hamstring Curl (B2, 09.11.2026) — błąd karty ballcurl.mis.sag bez animacji (dawny rząd ht.mis.arch spoza karty usunięty).
import { v2, BODY, R, r1, lerp, ease, HIP, SH, ZASIEG_R, dNogi, rPlan, hipY, tp, S, reka, K, poza, PODLOGA, kolano2D, katXY, bladZTrajektorii, przeciecie, kostkaStopyY } from './dol.mjs';

export const RODZINA = 'leg_isolation';
const ZS = 10; const ZP = 30; /* oś dźwigni maszyny z boku (z) */
const th = () => BODY().thigh, sh = () => BODY().shank;
/** Biegun kolana z jego znanego położenia: kierunek od środka odcinka biodro–kostka do kolana. */
const poleKolana = (hip, ankle, knee) => { const mid = hip.map((v, i) => (v + ankle[i]) / 2); const d = knee.map((v, i) => v - mid[i]); const l = Math.hypot(...d) || 1; return d.map((v) => r1(v / l * 100) / 100); };

/** Siad na maszynie: miednica na siedzisku (oparcie 80°), udo poziomo, kolano w x = miednica + 42. Zwraca geometrię. */
function siad() {
  const E = v2(); const kat = 80; const top = 37.8; const hx = 0; const hp = E.benchHip(kat, top); const m = [hp[0] + hx, hp[1]]; const p = kat - 90;
  const knee = [m[0] + th(), m[1]]; return { kat, top, hx, m, p, knee };
}
const stopaKostka = (knee, psi) => [knee[0] + sh() * Math.sin(psi * R), knee[1] - sh() * Math.cos(psi * R)];

function dzwignia(kneePt, ankle) { const r = Math.hypot(ankle[0] - kneePt[0], ankle[1] - kneePt[1], ZP - ZS); return { rodzaj: 'dzwignia', tryb: 'obrot', punkt: 'kostki', trzyma: 'R', x: r1(kneePt[0]), y: r1(kneePt[1]), z: ZP, dlugosc: r1(r) }; }

/** Prostowanie i uginanie nóg w siadzie: psi = kąt goleni od pionu (do przodu dodatni): 0 = zgięcie 90°, 82 ≈ prawie wyprost. jednonoz: pracuje tylko prawa. */
export function siadMaszyna(cw, o = {}) {
  const { psi0 = 0, psi1 = 80, jednonoz = false, siedzisko = 40, extra = [] } = o;
  const g = siad(); const us = [0, 0.25, 0.5, 0.75, 1];
  const mk = (u) => {
    const psi = lerp(psi0, psi1, ease(u)); const aR3 = (() => { const a = stopaKostka(g.knee, psi); return [a[0], a[1], ZS]; })();
    const aL3 = jednonoz ? [g.knee[0], g.knee[1] - sh(), -ZS] : [aR3[0], aR3[1], -ZS];
    const hipR = [g.m[0], g.m[1], HIP()], hipL = [g.m[0], g.m[1], -HIP()];
    const kR = [g.knee[0], g.knee[1], HIP() + 1], kL = [g.knee[0], g.knee[1], -HIP() - 1];
    const grip = (sg) => ({ g: [g.m[0] + 18, g.top + 5, sg * 24], pole: [-0.2, -0.5, sg] });
    return K({ u, m: g.m, p: g.p, head: g.p, R: { a: aR3, pod: null, rot: 10, pole: poleKolana(hipR, aR3, kR) }, L: { a: aL3, pod: null, rot: 10, pole: poleKolana(hipL, aL3, kL) }, hr: grip(1), hl: grip(-1) });
  };
  const fr = us.map(mk);
  const a0 = stopaKostka(g.knee, psi0); const spr = [PODLOGA(-60, 140), { rodzaj: 'lawka', x: r1(g.m[0] - 8.5), top: g.top, kat: g.kat, siedzisko, dlugosc: 75 }, dzwignia(g.knee, [a0[0], a0[1], ZS]), ...extra];
  return poza(RODZINA, cw, spr, fr, []);
}

/** Uginanie nóg leżąc przodem (głowa +x, nogi −x): ławka płaska, kolana na krawędzi, goleń podnosi się o kąt phi nad poziomem. */
export function lezac(cw) {
  const g = { top: 43 }; const m = [0, g.top + 10.2]; const knee = [-th(), m[1]]; const us = [0, 0.25, 0.5, 0.75, 1]; const phi0 = 4, phi1 = 100;
  const mk = (u) => { const phi = lerp(phi0, phi1, ease(u)); const a = [knee[0] - sh() * Math.cos(phi * R), knee[1] + sh() * Math.sin(phi * R)];
    const aR3 = [a[0], a[1], ZS], aL3 = [a[0], a[1], -ZS]; const hipR = [m[0], m[1], HIP()], hipL = [m[0], m[1], -HIP()]; const kR = [knee[0], knee[1], HIP() + 1], kL = [knee[0], knee[1], -HIP() - 1];
    const grip = (sg) => ({ g: [78, g.top + 4, sg * 20], pole: [0, -1, sg * 0.4] });
    return K({ u, m, p: 90, head: 72, R: { a: aR3, pod: null, rot: 10, pole: poleKolana(hipR, aR3, kR) }, L: { a: aL3, pod: null, rot: 10, pole: poleKolana(hipL, aL3, kL) }, hr: grip(1), hl: grip(-1) }); };
  const fr = us.map(mk); const a0 = [knee[0] - sh() * Math.cos(phi0 * R), knee[1] + sh() * Math.sin(phi0 * R)];
  const spr = [PODLOGA(-120, 100), { rodzaj: 'lawka', x: 0, top: g.top, kat: 0, siedzisko: 70, dlugosc: 45 }, dzwignia(knee, [a0[0], a0[1], ZS])];
  return poza(RODZINA, cw, spr, fr, []);
}

/** Uginanie nogi stojąc (maszyna albo linka): noga podporowa L prosta, pracująca R: udo pionowo, goleń odchyla się do tyłu o beta (0 = prosta, 95 = zgięcie). */
export function stojac(cw, o = {}) {
  const { maszyna = true, pitch = 24, linka = false } = o; const us = [0, 0.25, 0.5, 0.75, 1];
  const aL = [0, 7, -ZS]; const y = hipY(aL, 0, -HIP(), 8); const m = [0, y]; const pr = maszyna ? pitch : 6;
  const kneeR = [0, y - th()]; const kneeR3 = [0, y - th(), HIP() + 1];
  const mk = (u) => { const beta = lerp(10, 95, ease(u)); const a = [kneeR[0] - sh() * Math.sin(beta * R), kneeR[1] - sh() * Math.cos(beta * R)]; const aR3 = [a[0], a[1], ZS]; const hipR = [m[0], m[1], HIP()];
    const Sx = S(m, pr); const grip = (sg) => maszyna ? ({ g: [Sx[0] + 24, Sx[1] - 30, sg * 22], pole: [0, -1, sg * 0.5] }) : ({ g: [m[0] - 3, m[1] + 10, sg * 21], pole: [-0.5, 0, sg] });
    return K({ u, m, p: pr, head: pr * 0.5, R: { a: aR3, pod: null, rot: 10, pole: poleKolana(hipR, aR3, kneeR3) }, L: { a: aL, pod: 0, rot: 10, odch: 6 }, hr: grip(1), hl: grip(-1) }); };
  const fr = us.map(mk); const a0 = [kneeR[0] - sh() * Math.sin(10 * R), kneeR[1] - sh() * Math.cos(10 * R)];
  const spr = [PODLOGA(-90, 110)];
  if (maszyna) spr.push(dzwignia(kneeR, [a0[0], a0[1], ZS]));
  if (linka) spr.push({ rodzaj: 'wyciag', x: 95, y: 18, z: 78, chwyt: 'kostka', trzyma: 'R', h: 120 });
  return poza(RODZINA, cw, spr, fr, []);
}

const ZACZEP_GUMY = [125, 40, ZS]; /* punkt zaczepu gumy (x, y, z): noga stojaka 125 cm przed osobą, na wysokości kostki ćwiczonej nogi w pozycji startowej (ACG-019: kostka uniesiona, nie przy podłodze), w osi ćwiczonej nogi */
/** Uginanie nogi na gumie w siadzie na skrzyni (ACG-019, 31.10.2026: „uda i biodra nieruchomo — ruch tylko w kolanie”; regresja d4febb6 — generator rysował ruch pięty po podłodze z udem opuszczającym się):
 * miednica i udo STOJĄ (kolano w jednym miejscu), goleń prawej nogi obraca się w kolanie od prawie wyprostu (psi 80°, kostka uniesiona przed osobą) do zgięcia 90° (psi 0, kostka pod kolanem 8,6 cm nad podłogą);
 * guma zaczepiona z przodu na wysokości kostki startowej rozciąga się, gdy pięta idzie pod siedzisko (tryb zaczep_kostki; recenzja 1.1, partia 2, nr 6). */
export function guma(cw) {
  const E0 = 8.6; const m = [0, 48]; const us = [0, 0.25, 0.5, 0.75, 1]; const ky = E0 + sh(); const kx = Math.sqrt(Math.max(1, th() ** 2 - (m[1] - ky) ** 2)); const knee = [kx, ky];
  const aL3 = [kx, 7, -ZS];
  const mk = (u) => { const psi = lerp(80, 0, ease(u)); const a = [knee[0] + sh() * Math.sin(psi * R), knee[1] - sh() * Math.cos(psi * R)]; const aR3 = [r1(a[0]), r1(a[1]), ZS];
    const hipR = [m[0], m[1], HIP()], kR = [knee[0], knee[1], HIP() + 1]; const grip = (sg) => ({ g: [8, 40, sg * 27], pole: [-0.2, -0.6, sg] });
    return K({ u, m, p: 0, head: 0, R: { a: aR3, pod: r1(psi * 0.63 - 5), rot: 10, odch: 6, pole: poleKolana(hipR, aR3, kR) }, L: { a: aL3, pod: 0, rot: 10, odch: 6, pole: [1, 0.3, -0.05] }, hr: grip(1), hl: grip(-1) }); };
  const spr = [PODLOGA(-60, 160), { rodzaj: 'skrzynia', x0: -40, x1: -1, top: 38.6 }, { rodzaj: 'slupek', x: ZACZEP_GUMY[0], h: 60 }, { rodzaj: 'guma', mocowanie: 'zaczep_kostki', trzyma: 'R', x: ZACZEP_GUMY[0], y: ZACZEP_GUMY[1], z: ZACZEP_GUMY[2] }];
  return poza(RODZINA, cw, spr, us.map(mk), []);
}

/** Uginanie nóg na ślizgaczach w pozycji mostka: barki na podłodze, miednica nieruchomo wysoko (θ = 26°), pięty na ślizgaczach wysuwają się od zgięcia 100° do prawie wyprostu. */
/** Ślizgacze w moście (B2, 09.11.2026 — karta: „unieś biodra… biodra cały czas w górze”; poprzednio ACG-019: miednica nisko, biodro zginało się z kolanem, co karta nazywa błędem
 * „biodra opadające”). Barki na podłodze, kąt tułowia dobierany w każdej klatce tak, by biodro było prawie wyprostowane (zgięcie ≈ BIODRO_MOST°): przy ugiętych kolanach miednica
 * wysoko (most), przy wyprostowanych ciało w linii barki–biodra–pięty. Pięty na ślizgaczach na podłodze. */
const BIODRO_MOST = -3; /* zgięcie liczone w płaszczyźnie z barku; w jointAngles silnika to ok. 0–2° (biodro w linii z tułowiem) */
export function slizgacze(cw) {
  const T = BODY().trunk; const Sx = [-50, 9.5]; const us = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]; /* 9 klatek: przy 5 interpolacja miednicy i kostek między klatkami zginała biodro do ok. +6° (chwilowe opadnięcie bioder) */
  const geo = (u, th0) => { const m = [Sx[0] + T * Math.cos(th0 * R), Sx[1] + T * Math.sin(th0 * R)]; const K1 = lerp(100, 12, ease(u)); const zasieg = () => rPlan(dNogi(K1), HIP() - ZS);
    let ax = m[0] + Math.sqrt(Math.max(1, zasieg() ** 2 - (m[1] - 9) ** 2)), pod = 0, ay = 9;
    for (let i = 0; i < 8; i++) { const kn = kolano2D(m, [ax, ay], [0.1, 1]); const ang = katXY([ax, ay], kn); pod = Math.max(-30, Math.min(75, ang - 82)); ay = kostkaStopyY(2, pod); ax = m[0] + Math.sqrt(Math.max(1, zasieg() ** 2 - (m[1] - ay) ** 2)); }
    const kn = kolano2D(m, [ax, ay], [0.1, 1]); return { m, ax, ay, pod, zgiecie: katXY(m, kn) - katXY(Sx, m) }; };
  const mk = (u) => { let best = null; for (let t = 2; t <= 45; t += 0.25) { const g = geo(u, t); const d = Math.abs(g.zgiecie - BIODRO_MOST); if (!best || d < best.d) best = { ...g, t, d }; }
    const { m, ax, ay, pod, t } = best; const g = (sg) => ({ g: [Sx[0] + 60, 3.5, sg * 24], pole: [0, 0.3, sg] });
    return K({ u, m: [r1(m[0]), r1(m[1])], p: r1(-(90 + t)), head: -86, R: { a: [r1(ax), r1(ay), ZS], pod: r1(pod), rot: 10, pole: [0.1, 1, 0.08] }, L: { a: [r1(ax), r1(ay), -ZS], pod: r1(pod), rot: 10, pole: [0.1, 1, -0.08] }, hr: g(1), hl: g(-1) }); };
  const spr = [PODLOGA(-120, 160), { rodzaj: 'slizgacze', punkt: 'kostki', trzyma: 'obie' }];
  return poza(RODZINA, cw, spr, us.map(mk), []); /* błąd karty ballcurl.mis.sag bez animacji — powód w figury-sens.json bledy_bez_animacji */
}

export const WYJATKI = {
  'Leg Curl (hantel)': 'hantel zaciśnięty między stopami: sprzęt „hantel” podąża tylko za dłonią (chwyt), a nie za kostką — kontrakt nie umie narysować ciężaru trzymanego stopami',
  'Stability Ball Hamstring Curl': 'piłka gimnastyczna ma w kontrakcie stałe położenie (x, z) i toczy się po podłodze razem z piętami, więc przy ruchu kostek o ok. 40 cm pięty nie mogą leżeć na piłce w każdej klatce',
  'Glute Ham Raise': 'schemat „rzymskiej” ma podpórkę pod biodrami i wałki na kostki (oś ruchu = biodra, osoba leży przodem), a w GHR ciało obraca się wokół podpórki pod udami/kolanami z kolanem jako głównym stawem ruchu — takiej podpórki ani ruchu kolana pod obciążeniem tułowia nie da się odwzorować w tym schemacie bez naginania sprzętu (sprzęt rzymska: kontakty biodra/uda/tułów z podpórką do 3 cm)',
  'Nordic Curl': 'ćwiczenie wymaga klęku na podpórce z kostkami zaczepionymi za sobą (ghd, glute ham, wyciąg górny albo sztanga) i opadania prostego ciała do przodu wokół kolan; w kontrakcie nie ma podpórki pod kolana (rzymska ma podpórkę biodrową z kostkami po stronie +x przy leżeniu przodem), a sztanga/wyciąg jako zaczep kostek nie mają chwytu na kostce — poza nie byłaby zgodna ze sprzętem',
};
export const PRZYBLIZENIA = {
  'Seated Band Hamstring Curl': 'przybliżenie: zaczep gumy to nieruchomy punkt przed osobą na wysokości kostek (noga stojaka, schematycznie słupek); guma biegnie do kostki ćwiczonej nogi i rozciąga się, gdy pięta idzie pod siedzisko (tryb zaczep_kostki)',
};
export function generuj() {
  return {
    'Leg Extension': () => siadMaszyna('Leg Extension'),
    'Single-Leg Leg Extension': () => siadMaszyna('Single-Leg Leg Extension', { jednonoz: true }),
    'Leg Curl': () => siadMaszyna('Leg Curl', { psi0: 80, psi1: -10, siedzisko: 30 }),
    'Lying Leg Curl': () => lezac('Lying Leg Curl'),
    'Standing Leg Curl': () => stojac('Standing Leg Curl'),
    'Standing Cable Leg Curl': () => stojac('Standing Cable Leg Curl', { maszyna: false, linka: true }),
    'Seated Band Hamstring Curl': () => guma('Seated Band Hamstring Curl'),
    'Slider Hamstring Curl': () => slizgacze('Slider Hamstring Curl'),
  };
}
