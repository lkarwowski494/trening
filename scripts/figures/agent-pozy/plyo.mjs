// Generator póz rodziny plyo (skoki i plyometria) po stronie agenta (wersja 1.1, 26.10.2026).
// Skok = punkty zwrotne w przestrzeni parametrów (stanie → ugięcie → wybicie na palcach → lot → lądowanie → amortyzacja), pozy z FK modelu (kąty uda i kolana, ramię z kąta barku i łokcia), sprzęt z silnika (skrzynia, sztanga).
// Poza kończy się amortyzacją po lądowaniu (u = 1), więc reguły sensu „lot” i „miękkie lądowanie” da się sprawdzić (wariant A: lot i lądowanie). Ruch jest szybki z natury: ćwiczenia z deklaracją „dynamiczne” w danych sensu.
// Widok boczny pokazuje ruch w płaszczyźnie strzałkowej; ćwiczenia z przemieszczeniem bocznym mają je w osi z (widać z przodu), a w widoku bocznym tylko wysokość i postawę — przybliżenie w PRZYBLIZENIA.
import { kostkaNaPalcach } from './model.mjs';
import { P, Q, ruch, bladZRuchu, zbuduj, PODLOGA, bledyZOpisem, kostkaZBiodra, biodroZKostki, wyjatkiOpisu } from './dyn.mjs';

export const RODZINA = 'plyo';
export const WYJATKI = {
  'Kneeling Jump Squat': 'ćwiczenie otwarte: brak wskazówek i źródła ruchu (data/zrodla/figury-sens.json → plyo.otwarte); poza wróci po opisie ruchu przez badacza',
};
export const PRZYBLIZENIA = {
  'Side to Side Box Shuffle': 'jedno przejście z podłogi na niski stopień z boku (seria naprzemienna = powtórzenia)',
  'Lateral Bound': 'jeden skok boczny jednonóż; lądowanie na tej samej nodze, wolna noga uniesiona',
  'Side Hop-Sprint': 'sam skok boczny; sprint po lądowaniu poza zakresem rysunku',
  'Alternate Leg Diagonal Bound': 'skok z zamianą nóg w płaszczyźnie strzałkowej (odbicie jedną nogą, lądowanie na drugiej); ukośny tor ciała niewidoczny — model nie przesuwa miednicy w bok',
  'Alternate Leg Push-Off': 'przy lądowaniu na drugiej nodze pierwsza zostaje z tyłu (jeden skok zamiast serii naprzemiennej)',
  'Box Skip': 'wolna noga uniesiona przez cały ruch (skip jako jeden skok jednonóż na skrzynię)',
  'Single-Leg Stride Jump': 'jeden skok jednonóż na skrzynię; lądowanie na tej samej nodze',
  'Single-Leg Hop Progression': 'jeden skok jednonóż w przód (progresja = seria takich skoków)',
  'Front Cone Hops': 'jeden niski skok obunóż w przód (seria nad pachołkami = powtórzenia)',
};
export const POMINIETE_BLEDY = {};
export const WYJATKI_OPISU = wyjatkiOpisu(RODZINA);
const yP = (pod) => kostkaNaPalcach(0, pod); /* wysokość kostki, gdy stopa stoi na palcach (podbicie pod) */
const Z = (a) => ({ z: 19, ...a });
const ARM0 = { stoj: { psi: -95, th: 22 }, tyl: { psi: -105, th: 22 }, gora: { psi: 60, th: 20 }, gora2: { psi: 62, th: 20 }, przod: { psi: -10, th: 20 }, przod2: { psi: -25, th: 25 } };
const ARM = Object.fromEntries(Object.entries(ARM0).map(([k, v]) => [k, Z(v)]));
const SPR = (...extra) => [PODLOGA(-130, 290), ...extra];
const BOX = (x0, x1, top, z) => ({ rodzaj: 'skrzynia', x0, x1, top, ...(z !== undefined ? { z } : {}) });

/**
 * Punkty zwrotne skoku obunóż. o: { x0, dx (przesunięcie w x), top (wysokość lądowania), top0 (start), dip { k, al, pitch }, H (wzniesienie kostki ponad wybicie), lot: 'prosty' | 'kolana' | 'pieta' | 'rozkrok',
 * ramiona, single (noga lewa uniesiona), zo (przesunięcie boczne), kLad, kAmort, sztywno (wariant błędu: lądowanie na prostych nogach) }.
 */
function punktyZwrotne(o) {
  const x0 = o.x0 ?? 0, x1 = x0 + (o.dx ?? 0), top0 = o.top0 ?? 0, top = o.top ?? 0; const dip = { k: 95, al: 28, pitch: 32, ...(o.dip ?? {}) }; const a = { ...ARM, ...Object.fromEntries(Object.entries(o.ramiona ?? {}).map(([k, v]) => [k, Z(v)])) };
  const H = o.H ?? 26; const lean = (o.dx ?? 0) > 60 ? 9 : 3; const zo1 = o.zo ?? 0; const kLad = o.sztywno ? 22 : (o.kLad ?? 22); const kAm = o.sztywno ? 26 : (o.kAmort ?? 90); const alAm = o.sztywno ? 6 : 28; const pAm = o.sztywno ? 3 : (o.pitchAmort ?? 32);
  const lyP = top0 + yP(-45) + 4; const apexY = Math.max(lyP + H, top + yP(-45) + 14 + (top > top0 ? 4 : 0));
  const lot = { prosty: { al: 0, k: 30, pitch: 0, pod: -45 }, kolana: { al: 10, k: 112, pitch: 18, pod: -30 }, pieta: { al: 100, k: 100, pitch: 0, pod: -85 }, rozkrok: { al: 0, k: 25, pitch: 0, pod: -45 } }[o.lot ?? 'prosty'];
  const L = (A) => (o.single ? { AL: [A[0] - 22, A[1] + 20], podL: -75 } : {});
  const kopnij = o.single === 'pieta'; /* wolna noga: pięta do pośladka w locie */
  const W = [
    { A: [x0, top0 + 7], al: 3, k: 12, pod: 0, pitch: 0, ra: a.stoj, ...L([x0, top0 + 7]), zo: 0 },
    { A: [x0, top0 + 7], al: dip.al, k: dip.k, pod: 0, pitch: dip.pitch, ra: a.tyl, ...L([x0, top0 + 7]), zo: 0 },
    { A: [x0 + 2, lyP], al: 10, k: 10, pod: -45, pitch: lean, ra: a.gora, ...L([x0, lyP]), zo: 0 },
    { A: [(x0 + x1) / 2, apexY], al: lot.al, k: lot.k, pod: lot.pod, pitch: lot.pitch, ra: a.gora2, ...L([(x0 + x1) / 2, apexY]), zo: zo1 * (o.zoApex ?? 0.5) },
    { A: [x1, top + yP(-12) + (o.lad ?? 0.5)], al: 8, k: kLad, pod: -12, pitch: 10, ra: a.przod, ...L([x1, top + 8]), zo: zo1 },
    { A: [x1, top + 7], al: alAm, k: kAm, pod: 0, pitch: pAm, ra: a.przod2, ...L([x1, top + 7]), zo: zo1 },
  ];
  if (kopnij) { const w = W[3]; const hip = biodroZKostki(w.A, -90 - w.al + w.k, w.k); const k = kostkaZBiodra(hip, 100, 100); w.AL = [k[0] - 8, k[1] + 0]; w.podL = -90; }
  W.forEach((w) => { w.zR = 12; w.zL = 12; if (o.bocz) w.bocz = true; });
  if (o.lot === 'rozkrok') { W[3].zR = 30; W[3].zL = 30; W[3].k = 40; W[3].ra = { psi: 55, th: 45, z: 36 }; }
  return W;
}
function skok(o) {
  const sprz = o.sprzet ?? SPR(); const W = punktyZwrotne(o); const r = ruch(W, P, { rodzina: RODZINA, cw: o.cw, sprzet: sprz });
  const bledy = []; if (o.blad) { const W2 = punktyZwrotne({ ...o, sztywno: true }); bledy.push(bladZRuchu({ cue: o.blad, znacznik: 'knees', ruch: r, W2, buduj2: P, od: 4 })); }
  if (process.env.DBG_PLYO) console.error(o.cw, 'szczyt', r.szczyt.toFixed(1), 'droga', r.suma.toFixed(0));
  return zbuduj({ rodzina: RODZINA, cwiczenie: o.cw, sprzet: sprz, klatki: r.klatki, bledy: bledyZOpisem(o.cw, bledy, POMINIETE_BLEDY) });
}


/** Wypchnięcie z podwyższenia (Single / Alternate Leg Push-Off): stopa prowadząca na skrzyni, druga z tyłu na palcach na podłodze; siła z nogi na skrzyni, kolano wolnej nogi w górę, lądowanie na skrzyni
 * (alt: lądowanie na drugiej nodze, pierwsza zostaje z tyłu). */
function pushOff(cw, { alt }) {
  const top = 30; const bx = 40; const sprz = SPR(BOX(bx - 8, bx + 45, top)); const yT = top + 7;
  const hipOf = (A, al, k) => biodroZKostki(A, -90 - al + k, k); const Alead = [bx, yT];
  const st = (hip, aR, aL, extra = {}) => ({ pel: hip, AR: aR, AL: aL, podR: 0, podL: -60, pitch: 12, ra: { psi: -90, th: 40, z: 19 }, zo: 0, ...extra });
  const h0 = hipOf(Alead, 20, 70), h1 = hipOf(Alead, 28, 95), h2 = hipOf(Alead, 10, 12);
  const rear = (h, dx, dy = 0) => [h[0] - dx - 2, yP(-60) + 0.5 + dy];
  const hAir = [h2[0] + 4, h2[1] + 30]; const hLand = hipOf([bx + 2, yT], 8, 24); const hAbs = hipOf([bx + 2, yT], 24, 80);
  const knee = (h) => kostkaZBiodra(h, 16, 100); const kd = knee(hAir);
  const W = [
    st(h0, Alead, rear(h0, 26), { pitch: 14 }),
    st(h1, Alead, rear(h1, 22), { pitch: 26, ra: { psi: -105, th: 30, z: 19 } }),
    st(h2, [bx + 2, yT + yP(-45) - 7 + 3], [h2[0] - 14, 62], { pitch: 6, podR: -45, ra: { psi: 50, th: 25, z: 19 } }),
    st(hAir, [bx + 4, yT + yP(-45) - 7 + 26], [kd[0], kd[1]], { pitch: 4, podR: -45, podL: -30, ra: { psi: 60, th: 25, z: 19 } }),
    alt ? st(hLand, [bx - 30, yP(-45) + 24], [bx + 2, yT + yP(-12) - 7 + 0.5], { podR: -60, podL: -12, ra: { psi: -10, th: 25, z: 19 } }) : st(hLand, [bx + 2, yT + yP(-12) - 7 + 0.5], [hLand[0] - 20, hLand[1] - 40], { podR: -12, podL: -75, ra: { psi: -10, th: 25, z: 19 } }),
    alt ? st(hAbs, [bx - 34, yP(-60) + 20], [bx + 2, yT], { podR: -60, podL: 0, pitch: 26, ra: { psi: -25, th: 30, z: 19 } }) : st(hAbs, Alead.map((x, i) => (i ? x : bx + 2)), [hAbs[0] - 22, hAbs[1] - 38], { podR: 0, podL: -75, pitch: 26, ra: { psi: -25, th: 30, z: 19 } }),
  ];
  const r = ruch(W, Q, { rodzina: RODZINA, cw, sprzet: sprz });
  if (process.env.DBG_PLYO) console.error(cw, 'szczyt', r.szczyt.toFixed(1), 'droga', r.suma.toFixed(0));
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: sprz, klatki: r.klatki, bledy: [] });
}

/** Skok w rozkroku (Split Jump) i naprzemienny skok diagonalny (Alternate Leg Diagonal Bound): wybicie z nóg prostych pod biodrami, lot z zamianą nóg, lądowanie w wykroku. */
function rozkrok(cw, { diag }) {
  const sprz = SPR(); const front = 30, back = -30; const yB = yP(-60) + 0.5; const yL = yP(-45) + 3;
  const mk = (pel, aR, aL, extra = {}) => ({ pel, AR: aR, AL: aL, podR: 0, podL: 0, pitch: 4, ra: { psi: -80, th: 70, z: 19 }, zo: 0, ...extra });
  const W = [
    mk([diag ? -20 : 0, 80], [diag ? 6 : front, 7], [diag ? -45 : back, yB], { podL: -80, pitch: 6 }),
    mk([diag ? -14 : 0, 54], [diag ? 10 : front, 7], [diag ? -45 : back, yB], { podL: -80, pitch: 14, ra: { psi: -100, th: 55, z: 19 } }),
    mk([diag ? -6 : 0, yL + 82.5], [diag ? -1 : 4, yL], [diag ? -11 : -4, yL], { podR: -45, podL: -45, pitch: 4, ra: { psi: 40, th: 55, z: 19 } }),
    mk([diag ? 30 : 0, 135], [diag ? 62 : back + 8, 70], [diag ? -20 : front + 8, diag ? 90 : 78], { podR: -45, podL: -60, pitch: 6, ra: { psi: 55, th: 50, z: 19 } }),
    mk([diag ? 62 : 0, 96], [diag ? 80 : back, yB + 4], [diag ? 74 : front, yP(-12) + 1.5], { podR: -62, podL: -12, pitch: 10, ra: { psi: -10, th: 50, z: 19 } }),
    mk([diag ? 66 : 0, 70], [diag ? 62 : back, yB], [diag ? 80 : front, 7], { podR: -62, podL: 0, pitch: 16, ra: { psi: -25, th: 60, z: 19 } }),
  ];
  const r = ruch(W, Q, { rodzina: RODZINA, cw, sprzet: sprz });
  if (process.env.DBG_PLYO) console.error(cw, 'szczyt', r.szczyt.toFixed(1), 'droga', r.suma.toFixed(0));
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: sprz, klatki: r.klatki, bledy: [] });
}

/** Depth Jump: zejście ze skrzyni, lądowanie z amortyzacją i natychmiastowy wyskok (dwie fazy lotu). */
function depth(cw) {
  const top = 50; const sprz = SPR(BOX(-45, 35, top)); const yT = top + 7; const a = { z: 19 };
  const W = [
    { A: [25, yT], al: 3, k: 12, pod: 0, pitch: 0, ra: { psi: -90, th: 25, ...a }, zo: 0 },
    { A: [45, yT + 0.5], al: 3, k: 16, pod: -10, pitch: 4, ra: { psi: -80, th: 30, ...a }, zo: 0 },
    { A: [62, yP(-12) + 1], al: 6, k: 18, pod: -12, pitch: 8, ra: { psi: -60, th: 30, ...a }, zo: 0 },
    { A: [62, 7], al: 26, k: 85, pod: 0, pitch: 30, ra: { psi: -105, th: 22, ...a }, zo: 0 },
    { A: [62, yP(-45) + 4], al: 10, k: 10, pod: -45, pitch: 3, ra: { psi: 60, th: 20, ...a }, zo: 0 },
    { A: [62, yP(-45) + 34], al: 0, k: 28, pod: -45, pitch: 0, ra: { psi: 62, th: 20, ...a }, zo: 0 },
    { A: [62, yP(-12) + 0.5], al: 8, k: 22, pod: -12, pitch: 10, ra: { psi: -10, th: 20, ...a }, zo: 0 },
    { A: [62, 7], al: 28, k: 90, pod: 0, pitch: 32, ra: { psi: -25, th: 25, ...a }, zo: 0 },
  ];
  W.forEach((w) => { w.zR = 12; w.zL = 12; });
  const r = ruch(W, P, { rodzina: RODZINA, cw, sprzet: sprz });
  if (process.env.DBG_PLYO) console.error(cw, 'szczyt', r.szczyt.toFixed(1), 'droga', r.suma.toFixed(0));
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: sprz, klatki: r.klatki, bledy: [] });
}

/** Dumbbell Seated Box Jump: start siedząc na ławce (uda poziomo, hantle w opuszczonych rękach), wyskok na skrzynię z przodu, lądowanie z amortyzacją. */
function siedzacy(cw) {
  const top = 50; const sprz = SPR({ rodzaj: 'lawka', kat: 0, x: -4, top: 38, dlugosc: 60, siedzisko: 32 }, BOX(95, 165, top), { rodzaj: 'hantel' });
  const a = { z: 28 }; const x1 = 128;
  const W = [
    { A: [38, 7], al: 0, k: 90, pod: 0, pitch: 4, ra: { psi: -90, th: 15, ...a }, zo: 0 },
    { A: [38, 7], al: 20, k: 100, pod: 0, pitch: 24, ra: { psi: -105, th: 18, ...a }, zo: 0 },
    { A: [42, yP(-45) + 4], al: 10, k: 10, pod: -45, pitch: 8, ra: { psi: 40, th: 30, ...a }, zo: 0 },
    { A: [(42 + x1) / 2, top + yP(-45) + 26], al: 0, k: 40, pod: -45, pitch: 0, ra: { psi: 45, th: 30, ...a }, zo: 0 },
    { A: [x1, top + yP(-12) + 0.5], al: 8, k: 22, pod: -12, pitch: 10, ra: { psi: -20, th: 25, ...a }, zo: 0 },
    { A: [x1, top + 7], al: 26, k: 85, pod: 0, pitch: 30, ra: { psi: -45, th: 25, ...a }, zo: 0 },
  ];
  W.forEach((w) => { w.zR = 12; w.zL = 12; });
  const r = ruch(W, P, { rodzina: RODZINA, cw, sprzet: sprz });
  if (process.env.DBG_PLYO) console.error(cw, 'szczyt', r.szczyt.toFixed(1), 'droga', r.suma.toFixed(0));
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: sprz, klatki: r.klatki, bledy: [] });
}

const SZTANGA_PLECY = { rel: [-3, -12.7], z: 32 };
const SPRZET_SZTANGA = () => SPR({ rodzaj: 'sztanga', talerze: true, podazaZaChwytem: true, dlugosc: 220 }, { rodzaj: 'slupek', x: -70, h: 215, hak: 140 });

export function generuj() {
  const G = {};
  const bj = 'bj.mis.stiff'; const jm = 'jump.mis.stiff';
  const box = (top, x0 = 45, x1 = 115) => SPR(BOX(x0, x1, top));
  G['Jump Squat'] = () => skok({ cw: 'Jump Squat', blad: jm });
  G['Tuck Jump'] = () => skok({ cw: 'Tuck Jump', lot: 'kolana', H: 30, blad: jm });
  G['Double Leg Butt Kick'] = () => skok({ cw: 'Double Leg Butt Kick', lot: 'pieta', blad: jm });
  G['Star Jump'] = () => skok({ cw: 'Star Jump', lot: 'rozkrok', blad: jm });
  G['Box Jump'] = () => skok({ cw: 'Box Jump', x0: 0, dx: 75, top: 50, sprzet: box(50), blad: bj, H: 30 });
  G['Bench Jump'] = () => skok({ cw: 'Bench Jump', x0: 0, dx: 75, top: 40, sprzet: box(40), blad: jm, H: 28 });
  G['Broad Jump'] = () => skok({ cw: 'Broad Jump', dx: 130, H: 22, dip: { k: 80, al: 25, pitch: 40 }, ramiona: { stoj: { psi: -95, th: 30 }, tyl: { psi: -100, th: 30 }, gora: { psi: 30, th: 25 }, gora2: { psi: 35, th: 25 } }, blad: jm });
  G['Frog Hops'] = () => skok({ cw: 'Frog Hops', dx: 70, H: 18, dip: { k: 118, al: 38, pitch: 42 }, ramiona: { stoj: { psi: -70, th: 55 }, tyl: { psi: -75, th: 50 }, gora: { psi: 25, th: 30 }, gora2: { psi: 30, th: 30 }, przod: { psi: -35, th: 40 }, przod2: { psi: -70, th: 55 } }, kAmort: 118, pitchAmort: 42, blad: jm });
  G['Front Cone Hops'] = () => skok({ cw: 'Front Cone Hops', dx: 45, H: 14, dip: { k: 60, al: 20, pitch: 20 }, ramiona: { gora: { psi: 10, th: 45 }, gora2: { psi: 15, th: 45 }, tyl: { psi: -95, th: 40 }, stoj: { psi: -90, th: 35 }, przod: { psi: -40, th: 50 }, przod2: { psi: -50, th: 50 } }, kAmort: 60, pitchAmort: 20, blad: jm });
  G['Single-Leg Hop Progression'] = () => skok({ cw: 'Single-Leg Hop Progression', single: true, dx: 40, H: 16, dip: { k: 60, al: 20, pitch: 20 }, kAmort: 60, pitchAmort: 20, ramiona: { gora: { psi: 10, th: 45 }, gora2: { psi: 15, th: 45 }, tyl: { psi: -95, th: 40 }, stoj: { psi: -90, th: 35 }, przod: { psi: -40, th: 50 }, przod2: { psi: -50, th: 50 } } });
  G['Single Leg Butt Kick'] = () => skok({ cw: 'Single Leg Butt Kick', single: 'pieta', H: 18, dip: { k: 60, al: 20, pitch: 20 }, kAmort: 60, pitchAmort: 20 });
  G['Box Skip'] = () => skok({ cw: 'Box Skip', single: true, x0: 0, dx: 70, top: 40, sprzet: box(40, 40, 110), H: 22, dip: { k: 70, al: 22, pitch: 22 }, kAmort: 70, pitchAmort: 22 });
  G['Single-Leg Stride Jump'] = () => skok({ cw: 'Single-Leg Stride Jump', single: true, x0: 0, dx: 80, top: 40, sprzet: box(40, 45, 115), H: 28 });
  G['Weighted Jump Squat'] = () => skok({ cw: 'Weighted Jump Squat', sprzet: SPRZET_SZTANGA(), ramiona: { stoj: SZTANGA_PLECY, tyl: SZTANGA_PLECY, gora: SZTANGA_PLECY, gora2: SZTANGA_PLECY, przod: SZTANGA_PLECY, przod2: SZTANGA_PLECY }, blad: jm, H: 20 });
  /* Ruchy boczne (poza@2, przesuniecieBoczne): zo = przesunięcie korzenia w bok (cm; + = ku prawej stronie osoby), kostki i chwyty w świecie. */
  const bok = (cw, o) => () => skok({ cw, bocz: true, blad: jm, ...o });
  G['Lateral Cone Hops'] = bok('Lateral Cone Hops', { zo: 55, H: 14, dip: { k: 60, al: 20, pitch: 20 }, ramiona: { gora: { psi: 10, th: 45 }, gora2: { psi: 15, th: 45 }, tyl: { psi: -95, th: 40 }, stoj: { psi: -90, th: 35 }, przod: { psi: -40, th: 40 }, przod2: { psi: -45, th: 40 } } });
  G['Side Hop-Sprint'] = bok('Side Hop-Sprint', { zo: 60, H: 16, dip: { k: 70, al: 22, pitch: 26 } });
  G['Side Standing Long Jump'] = bok('Side Standing Long Jump', { zo: 110, H: 22, dip: { k: 80, al: 25, pitch: 40 }, ramiona: { stoj: { psi: -95, th: 30 }, tyl: { psi: -100, th: 30 }, gora: { psi: 30, th: 25 }, gora2: { psi: 35, th: 25 } } });
  G['Lateral Bound'] = bok('Lateral Bound', { single: true, zo: 90, H: 22, dip: { k: 70, al: 22, pitch: 24 }, kAmort: 70, pitchAmort: 24 });
  G['Single-Leg Lateral Hop'] = bok('Single-Leg Lateral Hop', { single: true, zo: 45, H: 16, dip: { k: 60, al: 20, pitch: 20 }, kAmort: 60, pitchAmort: 20 });
  G['Lateral Box Jump'] = bok('Lateral Box Jump', { zo: 55, top: 40, sprzet: SPR(BOX(-25, 25, 40, 55)), H: 36, zoApex: 0.4 });
  G['Side to Side Box Shuffle'] = bok('Side to Side Box Shuffle', { zo: 55, top: 12, H: 20, sprzet: SPR(BOX(-25, 25, 12, 55)), dip: { k: 60, al: 20, pitch: 20 } });
  G['Alternate Leg Push-Off'] = () => pushOff('Alternate Leg Push-Off', { alt: true });
  G['Single Leg Push-Off'] = () => pushOff('Single Leg Push-Off', { alt: false });
  G['Split Jump'] = () => rozkrok('Split Jump', { diag: false });
  G['Alternate Leg Diagonal Bound'] = () => rozkrok('Alternate Leg Diagonal Bound', { diag: true });
  G['Depth Jump'] = () => depth('Depth Jump');
  G['Dumbbell Seated Box Jump'] = () => siedzacy('Dumbbell Seated Box Jump');
  return G;
}
