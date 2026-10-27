// Generator póz rodziny olympic (zarzut, rwanie, podrzut i ich odmiany) po stronie agenta (wersja 1.1, 26.10.2026).
// Ruch dwufazowy z przechwytem: ciąg (podłoga/zawis/bloki → wyprost na palcach) → przechwyt (zarzut: sztanga na barkach; rwanie i podrzut: nad głową), u = 1 = pozycja po przechwycie (power: ćwierć przysiadu,
// pełny: głęboki przysiad, split: wykrok). Sztanga jest zakotwiczona w świecie, dopóki ręce są proste (chwyt w punkcie sztangi, pochylenie tułowia z zasięgu ramienia), a po wyprostie przechodzi do układu tułowia (przy barkach / nad głową).
// Kinematyka: kąty uda i kolana z FK (dyn.mjs: P), tułów z zasięgu ramion (pitchDoChwytu). Ruch szybki z natury: ćwiczenia z deklaracją „dynamiczne” w danych sensu.
import { kostkaNaPalcach, r1 } from './model.mjs';
import { bledyCwiczenia } from '../v2-validate.mjs';
import { wczytajTeksty } from '../v2-jakosc.mjs';
import { P, ruch, bladZRuchu, zbuduj, PODLOGA, bledyZOpisem, biodroZKostki, pitchDoChwytu, wyjatkiOpisu } from './dyn.mjs';

export const RODZINA = 'olympic';
const OTW = 'ćwiczenie otwarte: brak wskazówek i źródła ruchu (data/zrodla/figury-sens.json → olympic.otwarte); poza wróci po opisie ruchu przez badacza';
export const WYJATKI = { 'Rack Delivery': OTW, 'Jerk Balance': OTW };
export const PRZYBLIZENIA = {
  'Clean and Jerk': 'zarzut do ćwierć przysiadu, wstanie, krótkie ugięcie i podrzut z wykrokiem w jednym przebiegu',
  'Muscle Snatch': 'ruch bez ponownego ugięcia nóg: sztanga z zawisu nad głowę na prostych nogach (przechwyt na palcach)',
  'Hang Clean': 'start ze sztangą na udach (zawis), pierwsza klatka bez opuszczania sztangi do kolan',
  'Hang Snatch': 'start ze sztangą na udach (zawis), pierwsza klatka bez opuszczania sztangi do kolan',
};
export const POMINIETE_BLEDY = {};
export const WYJATKI_OPISU = wyjatkiOpisu(RODZINA);
const yP = (pod) => kostkaNaPalcach(0, pod);
const SPRZ = (...extra) => [PODLOGA(-130, 200), { rodzaj: 'sztanga', talerze: true, podazaZaChwytem: true, dlugosc: 220 }, ...extra];
const RACK = () => ({ rodzaj: 'slupek', x: -75, h: 215, hak: 140 });

/**
 * Punkt zwrotny. A kostka prawej nogi, al/k noga, pod podbicie; chwyt: bar [x, y] w świecie (w = 1: sztanga w świecie, ręce proste: pochylenie z zasięgu; w = 0: w układzie tułowia rel [w górę, do przodu]);
 * z rozstaw chwytu (połowa), pole łokcia, AL (lewa stopa, IK; wykrok), zs rozstaw kostek.
 */
function wp(o) {
  const A = o.A ?? [0, 7]; const ra = { g: o.bar ?? [0, 0], rel: o.rel ?? [0, 0], w: o.w ?? 1, z: o.z ?? 25, pole: o.pole ?? [0, -1, 0.25], reach: o.reach ?? 63.2 };
  const hip = biodroZKostki(A, -90 - o.al + o.k, o.k); const pitch = o.pitch ?? pitchDoChwytu(hip, ra, 0);
  const w = { A, al: o.al, k: o.k, pod: o.pod ?? 0, pitch, ra, ...(o.shrug !== undefined ? { shrug: o.shrug } : {}), kz: o.kz ?? 0.12, zR: o.zs ?? 14, zL: o.zs ?? 14, head: o.head ?? pitch * 0.4 };
  w.AL = o.AL ?? [A[0], A[1]]; w.podL = o.podL ?? (o.AL ? -60 : (o.pod ?? 0)); /* lewa stopa zawsze opisana (ciągłość: brak klucza w jednym punkcie zwrotnym = skok) */
  return w;
}
const BAR0 = 22.5;
const SHRUG = 5; /* uniesienie barków (cm) w wzruszeniu: w granicach kontraktu (−3…+6) */ /* środek sztangi na podłodze (promień talerza) */

/**
 * Zarzut / rwanie / ciąg / wzruszenie. o: { cw, start: 'podloga' | 'zawis' | 'bloki', koniec: 'rack' | 'nad' | 'wyprost' | 'wzrus', glebokosc: 'power' | 'pelny' | 'split', z (chwyt) , blad }.
 * Ciąg: pierwszy ciąg (sztanga przy kolanach) → drugi ciąg (wyprost na palcach, ramiona proste) → [przechwyt pod sztangą].
 */
function ciag(o) {
  const z = o.z ?? 25; const sn = o.chwyt === 'szeroki'; const xb = 22; const zz = sn ? 40 : z;
  const bar = (y, x = xb) => [x, y]; const W = [];
  const ext = (extra = {}) => wp({ k: 8, al: 8, pod: -48, A: [1, yP(-48) + 2.5], bar: bar(sn ? 96 : 91, 18.5), z: zz, ...extra }); /* wspięcie: palce na podłodze (recenzja p4a: 2,5 cm nad podłogą to lewitacja) */
  if (o.start === 'podloga') W.push(wp({ al: 20, k: 100, bar: bar(BAR0, 15), z: zz }));
  if (o.start === 'podloga') W.push(wp({ al: 7, k: 62, bar: bar(52, 19), z: zz }));
  W.push(wp({ al: 5, k: 28, bar: bar(o.start === 'podloga' ? 68 : 62, 12), z: zz })); /* sztanga na wysokości uda; w zawisie punkt wyjścia (tuż nad kolanem) */
  if (o.start === 'zawis') W.unshift(wp({ al: 4, k: 16, bar: bar(sn ? 76 : 72, 12), z: zz })); /* zawis: stanie ze sztangą na udach */
  if (o.start === 'bloki') W.unshift(wp({ al: 7, k: 62, bar: bar(52, 19), z: zz })); /* bloki: sztanga na wysokości kolan */
  const e = ext(); W.push(e);
  if (o.koniec === 'wyprost' || o.koniec === 'wzrus') { /* ciąg i wzruszenie kończą się pełnym wyprostem na palcach i uniesionymi barkami przy prostych rękach (sztanga ok. 5 cm wyżej, bez zginania łokci) */
    W.push(ext({ pitch: e.pitch, shrug: SHRUG, A: [1, yP(-48) + 0.4], bar: bar((sn ? 96 : 91) - 2.1, 18.5) })); /* wzruszenie na końcu: palce na podłodze (≤ 1 cm) */
    for (const w of W) w.shrug = w.shrug ?? 0; /* pole uniesienieBarkow w każdej klatce (brak pola = wartość z najbliższej klatki, nie zero) */
  }
  return W;
}

/** Przechwyt na barkach (zarzut): sztanga w układzie tułowia tuż przy barkach, łokcie do przodu; głębokość: power (ćwierć przysiadu), pelny (głęboki), split (wykrok). */
const RACK_REL = [15.4, 10.4];
const SPLIT = (A0 = 30, k = 85, al = 25) => { const hip = biodroZKostki([A0, 7], -90 - al + k, k); return { A: [A0, 7], al, k, AL: [hip[0] - 28, yP(-60) + 0.5], podL: -62 }; };
function lapRack(gl, o = {}) {
  const d = { power: { al: 22, k: 78, pitch: 3, A: [0, 7] }, pelny: { al: 34, k: 125, pitch: 5, A: [0, 7] }, split: { ...SPLIT(), pitch: 4 } }[gl];
  return wp({ ...d, w: 0, rel: gl === 'split' ? [15, 17] : RACK_REL, bar: [26, 120], z: 22, pole: gl === 'split' ? [0.9, -0.3, 1] : [1, -0.4, 0.2], zs: 16, ...o });
}
/** Przechwyt nad głową (rwanie, podrzut): ręce proste nad głową tuż przed linią tułowia (łokcie ≤ 20°, bark < 170°). */
function lapNad(gl, z, o = {}) {
  const d = { power: { al: 22, k: 78, pitch: 5, A: [0, 7] }, pelny: { al: 38, k: 130, pitch: 16, A: [0, 7] }, split: { ...SPLIT(), pitch: 4 } }[gl];
  const wide = z > 30; return wp({ ...d, w: 0, rel: wide ? [58.5, 11] : [62.2, 11], bar: [0, 150], z, pole: [0, -1, 0.3], zs: gl === 'pelny' ? 22 : 16, ...o });
}
/** Wejście pod sztangę (zarzut), recenzja p4a: po wyproście kolana od razu się uginają (stopy krótko odrywają się i lądują szerzej), a sztanga tylko dojeżdża do barków — nie wznosi się w staniu na palcach. */
function podSztanga(W, kon) { /* kon = przechwyt */
  W.push(wp({ al: 14, k: 26, pod: -22, A: [1, yP(-22) + 0.8], w: 0.9, bar: [14, 102], rel: [12, 17], pitch: 4, z: 24, pole: [0.2, -0.9, 0.3], zs: 17 }));
  W.push(wp({ al: 22, k: 44, pod: 0, A: [0, 7], w: 0.95, bar: [11.6, 108], rel: [14.5, 12.5], pitch: 3, z: 23, pole: [0.7, -0.3, 0.9], zs: 19 }));
  W.push(kon);
}
/** Wejście pod sztangę (rwanie), recenzja p4a: ręce szeroko, łokcie na boki, ciało schodzi pod sztangę, która dojeżdża nad głowę dopiero w przyjęciu. */
function podSztangeNad(W, kon, z) {
  W.push(wp({ al: 14, k: 26, pod: -22, A: [1, yP(-22) + 0.8], w: 0.9, bar: [15, 108], rel: [20, 22], pitch: 4, z, pole: [0.2, -0.3, 1], zs: 17 }));
  W.push(wp({ al: 22, k: 44, pod: 0, A: [0, 7], w: 0.5, bar: [14, 130], rel: [36, 16], pitch: 4, z, pole: [0, -0.3, 1], zs: 20 }));
  W.push(kon);
}
/** Wejście pod sztangę w „muscle snatch” (bez ponownego ugięcia nóg; bez zmian od 1.1). */
function podSztangeNadMuscle(W, kon, z) {
  W.push(wp({ al: 4, k: 14, pod: -40, A: [1, yP(-40) + 5], w: 0.5, bar: [15, 125], rel: [26, 22], pitch: 4, z, pole: [0.2, -0.3, 1], zs: 16 }));
  W.push(wp({ al: 13, k: 42, pod: 0, A: [0, 7], w: 0.15, bar: [14, 150], rel: [48, 16], pitch: 4, z, pole: [0, -0.3, 1], zs: 18 }));
  W.push(kon);
}
const gotowe = (cw, sprz, W) => {
  const tk = wczytajTeksty(); for (const c of bledyCwiczenia(cw)) POMINIETE_BLEDY[cw] = (POMINIETE_BLEDY[cw] ? POMINIETE_BLEDY[cw] + '; ' : '') + (tk[c] ? `błąd „${c}” (rząd błędu do wygenerowania — grupa błędu nieokreślona w danych sensu dla tego ćwiczenia)` : `błąd „${c}” bez opisu w lib/cues/text/pl.json — nie rysowany (reguła jakości etykieta_bledu); generator narysuje go po wdrożeniu tekstu`);
  const wagi = W.slice(1).map((w, i) => (W[i].ra.w === 1 && w.ra.w === 1 ? 2 : 1)); /* odcinki z prostymi rękami (sztanga w świecie): więcej klatek, bo kąt łokcia nieliniowo zależy od interpolacji */
  /* uniesienie barków (poza@2): barki jadą w górę, więc chwyt zakotwiczony w świecie unosi się o tyle samo (ręce zostają proste, sztanga wisi na rękach) */
  const buduj = (p) => { if (p.shrug === undefined) return P(p); if (!p.shrug) { const k0 = P(p); for (const s of ['R', 'L']) k0.rece[s].uniesienieBarkow = 0; return k0; } const ra = { ...p.ra, g: [p.ra.g[0], p.ra.g[1] + p.shrug], w: Math.min(p.ra.w, 0.998) }; /* w < 0,999: pochylenie tułowia z parametru, nie z zasięgu (P) */ const k = P({ ...p, ra, rl: ra }); for (const s of ['R', 'L']) k.rece[s].uniesienieBarkow = r1(p.shrug); return k; };
  const r = ruch(W, buduj, { rodzina: RODZINA, cw, sprzet: sprz, wagiOdcinkow: wagi });
  if (process.env.DBG_OLY) console.error(cw, 'szczyt', r.szczyt.toFixed(1), 'droga', r.suma.toFixed(0), 'klatek', r.klatki.length);
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: sprz, klatki: r.klatki, bledy: [] });
};
/** Bloki: dwie skrzynie pod talerzami (z = ±68, środek talerzy), blat = dół talerza sztangi startującej na kolanach (środek 52 cm, promień talerza 22,5 cm). */
const BLOKI = () => ({ rodzaj: 'skrzynia', x0: -4, x1: 42, top: 29.5, z: 68, dwa: true });
const sprzetDla = (start) => SPRZ(...(start === 'bloki' ? [BLOKI()] : []));
/** Wykrok: stopy w locie przed lądowaniem (przednia do przodu, tylna do tyłu), żeby ruch stóp nie przechodził przez podłogę. */
const wLocie = (W, gl) => { if (gl !== 'split') return; const w = W[W.length - 2]; w.A = [10, 24]; w.pod = -20; if (w.ra.w < 0.5) w.ra.rel = [13, 17.5]; w.AL = [0, 28]; w.podL = -45; };
/** Wykrok w zarzucie i rwaniu (recenzja p4a): krótki lot (przednia stopa do przodu, tylna do tyłu, nisko nad podłogą), lądowanie w nożycach i dopiero potem przyjęcie sztangi. */
const wLocieZ = (W, gl, nad) => {
  if (gl !== 'split') return;
  const P2 = nad ? { ax: 4, ay: 10, bx: 29, lx: 34, ly: 122, lk: 62 } : { ax: 10, ay: 12, bx: 23, lx: 38, ly: 114, lk: 68 }; /* parametry dobrane przeszukaniem siatki pod walidator (geometria, zakres łokcia) */
  const w = W[W.length - 2]; w.A = [P2.ax, P2.ay]; w.pod = -10; w.AL = [-9, yP(-45) + 4]; w.podL = -45; if (w.ra.w > 0.5) { w.ra.g = [P2.bx, w.ra.g[1]]; w.ra.pole = [0.7, -0.3, 1.1]; }
  const kon = W[W.length - 1]; const l = wp({ ...SPLIT(30, P2.lk, 22), pitch: 4, w: 0.7, bar: [P2.lx, P2.ly], rel: nad ? [36, 16] : [14.5, 12.5], z: kon.ra.z, pole: kon.ra.pole, zs: 16 }); /* lądowanie: stopy na podłodze, sztanga dojeżdża */
  W.splice(W.length - 1, 0, l);
};
function zarzut(cw, o) { const W = ciag({ ...o, koniec: 'rack' }); podSztanga(W, lapRack(o.glebokosc)); wLocieZ(W, o.glebokosc, false); return gotowe(cw, sprzetDla(o.start), W); }
function rwanie(cw, o) { const W = ciag({ ...o, chwyt: 'szeroki', koniec: 'rack' }); podSztangeNad(W, lapNad(o.glebokosc, 40), 40); wLocieZ(W, o.glebokosc, true); return gotowe(cw, sprzetDla(o.start), W); }
function ciagi(cw, o) { return gotowe(cw, SPRZ(), ciag({ ...o, start: 'podloga', koniec: 'wyprost' })); }
function wzruszenie(cw, o) { const W = ciag({ ...o, start: 'zawis', koniec: 'wzrus' }); return gotowe(cw, SPRZ(), W); }

/** Podrzut / dip: ze stojaka (sztanga na barkach), krótkie ugięcie nóg, wyprost na palcach i przechwyt nad głową (power: ćwierć przysiadu, split: wykrok, squat: głęboki przysiad). */
const RACK_STOJ = (o = {}) => wp({ al: 3, k: 12, pitch: 2, w: 0, rel: RACK_REL, bar: [0, 0], z: 22, pole: [1, -0.4, 0.2], zs: 14, ...o });
const DIP = (k = 40) => RACK_STOJ({ al: 10, k, pitch: 3 });
function podrzut(cw, gl) {
  const W = [RACK_STOJ(), DIP(40),
    RACK_STOJ({ al: 8, k: 8, pod: -45, A: [1, yP(-45) + 4], pitch: 2, rel: gl === 'pelny' ? [14, 12] : [30, 12], pole: [0.3, -0.2, 0.8], z: 24 }), lapNad(gl, 25)]; /* przysiad: sztanga po wybiciu tylko dojeżdża do wysokości przyjęcia (recenzja p4a) */
  wLocie(W, gl); return gotowe(cw, SPRZ(RACK()), W);
}
function dipSquat(cw) { return gotowe(cw, SPRZ(RACK()), [RACK_STOJ(), DIP(32), DIP(52)]); }
function snatchBalance(cw) {
  const sprz = SPRZ(RACK()); const z = 40; const kz = 0.9;
  const tyl = (o = {}) => wp({ al: 3, k: 12, pitch: 2, w: 0, rel: [-2, -14], bar: [0, 0], z, pole: [0, -1, 0.8], zs: 18, kz, ...o });
  const W = [tyl(), tyl({ al: 10, k: 40, pitch: 3 }),
    tyl({ al: 20, k: 70, pitch: 6, rel: [34, -12], zs: 22 }),
    wp({ al: 30, k: 100, pitch: 10, A: [0, 7], w: 0, rel: [48, 8], bar: [0, 0], z, pole: [0, -0.5, 1], zs: 22, kz }), lapNad('pelny', z, { zs: 22, kz })];
  return gotowe(cw, sprz, W);
}
function muscleSnatch(cw) {
  const W = ciag({ start: 'zawis', chwyt: 'szeroki', koniec: 'rack', stopyWisza: true }); const kon = wp({ al: 3, k: 12, pitch: 3, w: 0, rel: [58.5, 11], bar: [0, 150], z: 40, pole: [0, -1, 0.3], zs: 14 });
  podSztangeNadMuscle(W, kon, 40); W[W.length - 2].k = 12; W[W.length - 2].al = 3; W[W.length - 3].k = 10;
  return gotowe(cw, SPRZ(), W);
}
function cleanJerk(cw) {
  const W = ciag({ start: 'podloga', koniec: 'rack' }); podSztanga(W, lapRack('power'));
  W[W.length - 2].ra.pole = [0.7, -0.3, 1.4]; W.push(RACK_STOJ({ al: 4, k: 12, pitch: 2 })); /* po zarzucie: wstanie ze sztangą na barkach (recenzja p4a: podrzut nie rusza wprost z przysiadu) */
  W.push(DIP(38), RACK_STOJ({ al: 8, k: 8, pod: -45, A: [1, yP(-45) + 4], pitch: 2, rel: [30, 12], pole: [0.3, -0.2, 0.8], z: 24 }), lapNad('split', 25)); wLocie(W, 'split');
  return gotowe(cw, SPRZ(), W);
}

export function generuj() {
  const G = {};
  G['Power Clean'] = () => zarzut('Power Clean', { start: 'podloga', glebokosc: 'power' });
  G['Clean'] = () => zarzut('Clean', { start: 'podloga', glebokosc: 'pelny' });
  G['Split Clean'] = () => zarzut('Split Clean', { start: 'podloga', glebokosc: 'split' });
  G['Hang Clean'] = () => zarzut('Hang Clean', { start: 'zawis', glebokosc: 'pelny' });
  G['Block Clean'] = () => zarzut('Block Clean', { start: 'bloki', glebokosc: 'pelny' });
  G['Block Power Clean'] = () => zarzut('Block Power Clean', { start: 'bloki', glebokosc: 'power' });
  G['Barbell Snatch'] = () => rwanie('Barbell Snatch', { start: 'podloga', glebokosc: 'pelny' });
  G['Power Snatch'] = () => rwanie('Power Snatch', { start: 'podloga', glebokosc: 'power' });
  G['Split Snatch'] = () => rwanie('Split Snatch', { start: 'podloga', glebokosc: 'split' });
  G['Hang Snatch'] = () => rwanie('Hang Snatch', { start: 'zawis', glebokosc: 'pelny' });
  G['Block Snatch'] = () => rwanie('Block Snatch', { start: 'bloki', glebokosc: 'pelny' });
  G['Block Power Snatch'] = () => rwanie('Block Power Snatch', { start: 'bloki', glebokosc: 'power' });
  G['Clean Pull'] = () => ciagi('Clean Pull', {});
  G['Snatch Pull'] = () => ciagi('Snatch Pull', { chwyt: 'szeroki' });
  G['Clean Shrug'] = () => wzruszenie('Clean Shrug', {});
  G['Snatch Shrug'] = () => wzruszenie('Snatch Shrug', { chwyt: 'szeroki' });
  G['Power Jerk'] = () => podrzut('Power Jerk', 'power');
  G['Split Jerk'] = () => podrzut('Split Jerk', 'split');
  G['Squat Jerk'] = () => podrzut('Squat Jerk', 'pelny');
  G['Jerk Dip Squat'] = () => dipSquat('Jerk Dip Squat');
  G['Snatch Balance'] = () => snatchBalance('Snatch Balance');
  G['Muscle Snatch'] = () => muscleSnatch('Muscle Snatch');
  G['Clean and Jerk'] = () => cleanJerk('Clean and Jerk');
  return G;
}
