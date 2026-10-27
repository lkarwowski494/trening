// Generator póz rodziny kb_ballistic (kettlebell i hantel: swing, zarzut, rwanie, podrzut, wyciskania balistyczne) po stronie agenta (wersja 1.1, 26.10.2026).
// Wymach i przechwyt: punkty zwrotne w przestrzeni parametrów (kąty uda i kolana, tułów, ramię z kąta barku i łokcia), ciężar podąża za dłonią (silnik), dzwon wzdłuż przedramienia.
// Swing: u = 0 dół (zawias, ciężar za nogami) → u = 1 góra (wyprost, ręce prosto przed sobą). Zarzut: zawis między nogami → pozycja przy barku (rack). Rwanie: zawis → nad głową. Podrzut: rack → dip → wyrzut → nad głową.
import { kostkaNaPalcach } from './model.mjs';
import { bledyCwiczenia } from '../v2-validate.mjs';
import { wczytajTeksty } from '../v2-jakosc.mjs';
import { P, ruch, bladZRuchu, zbuduj, PODLOGA, bledyZOpisem, biodroZKostki, wyjatkiOpisu } from './dyn.mjs';

export const RODZINA = 'kb_ballistic';
export const WYJATKI = {
  'Kettlebell Pirate Ships': 'ćwiczenie otwarte: brak wskazówek i źródła ruchu (data/zrodla/figury-sens.json → kb_ballistic.otwarte); poza wróci po opisie ruchu przez badacza',
};
export const PRZYBLIZENIA = {};
export const POMINIETE_BLEDY = {};
export const WYJATKI_OPISU = wyjatkiOpisu(RODZINA);
const yP = (pod) => kostkaNaPalcach(0, pod);
const SPRZ = (...extra) => [PODLOGA(-130, 200), ...extra];
const KB = (o = {}) => ({ rodzaj: 'kettlebell', dzwon: 'wzdluz', ...o });
const DB = (o = {}) => ({ rodzaj: 'hantel', ...o });

/** Punkt zwrotny. Stanie na A (domyślnie płasko), noga al/k, tułów pitch, ramię prawe ra { psi, th, z }, lewe rl (domyślnie jak prawe); rozstaw stóp zs, kolana na zewnątrz kz. */
function wp(o) {
  const A = o.A ?? [0, 7];
  return { A, al: o.al, k: o.k, pod: o.pod ?? 0, pitch: o.pitch, ra: { z: 19, ...o.ra }, rl: o.rl ? { z: 19, ...o.rl } : { z: 19, ...o.ra }, zR: o.zs ?? 18, zL: o.zs ?? 18, kz: o.kz ?? 0.35, head: o.head ?? (o.pitch ?? 0) * 0.35, bend: o.bend ?? 0, rotR: o.rot ?? 18, rotL: o.rot ?? 18, AL: o.AL ?? [A[0], A[1]], podL: o.podL ?? (o.pod ?? 0) };
}
const gotowe = (cw, sprz, W, bledy = []) => {
  const tk = wczytajTeksty(); const ok = new Set(bledy.map((b) => b.cue));
  for (const c of bledyCwiczenia(cw)) if (!ok.has(c)) POMINIETE_BLEDY[cw] = (POMINIETE_BLEDY[cw] ? POMINIETE_BLEDY[cw] + '; ' : '') + (tk[c] ? `błąd „${c}” (rząd błędu do wygenerowania)` : `błąd „${c}” bez opisu w lib/cues/text/pl.json — nie rysowany (reguła jakości etykieta_bledu); generator narysuje go po wdrożeniu tekstu`);
  const r = ruch(W, P, { rodzina: RODZINA, cw, sprzet: sprz });
  if (process.env.DBG_KB) console.error(cw, 'szczyt', r.szczyt.toFixed(1), 'droga', r.suma.toFixed(0), 'klatek', r.klatki.length);
  return zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: sprz, klatki: r.klatki, bledy: bledyZOpisem(cw, bledy.map((b) => b(r)), POMINIETE_BLEDY) });
};

/** Swing: dół (zawias, ciężar za nogami) → środek (wyprost bioder) → góra (stanie, ręce prosto przed sobą na wysokości barków). */
function swing(cw, { jedna = false, sprz }) {
  const ra = (psi, th = jedna ? 14 : 28) => ({ psi, th, z: jedna ? 19 : 5 });
  const PSI0 = -145; /* dół zamachu: ręce za linią kolan, ciężar między udami (recenzja p4a) */
  const W = [
    wp({ al: 18, k: 48, pitch: 62, ra: { ...ra(PSI0, jedna ? 26 : 22), z: jedna ? 3 : 6 }, rl: jedna ? { psi: -60, th: 25, z: 24 } : undefined, kz: 0.5, zs: jedna ? 27 : 20 }),
    wp({ al: 10, k: 26, pitch: 34, ra: ra(-60), rl: jedna ? { psi: -40, th: 25, z: 26 } : undefined, kz: 0.4, zs: 20 }),
    wp({ al: 3, k: 12, pitch: 2, ra: ra(-4), rl: jedna ? { psi: 10, th: 25, z: 28 } : undefined, kz: 0.2, zs: 20 }),
  ];
  return gotowe(cw, sprz, W, jedna ? bledyPlecy(W, 2) : []);
}

const RACK_R = { psi: -90, th: 132, z: 18 }; /* ciężar przy barku: ramię w dół, przedramię w górę, dłoń na wysokości barku */
const WOLNA = (psi = -70, th = 25) => ({ psi, th, z: 26 }); /* wolna ręka: wzdłuż tułowia, lekko od ciała */
const NAD = { psi: 74, th: 10, z: 19 }; /* ręka prosta nad głową (bark < 170°) */
const wl = (o) => (o.jedna ? { rl: WOLNA(o.wpsi ?? -70) } : {});
const dwa = (o, ra) => ({ ra: { ...ra }, ...wl(o) });

/** Zarzut: zawis między nogami (hike) → wyprost → ciężar przy barku. */
function zarzut(cw, o) {
  const W = [
    wp({ al: 18, k: 48, pitch: 62, ...dwa(o, { psi: -100, th: 10, z: o.jedna ? 15 : 17 }), kz: 0.5, zs: 20 }),
    wp({ al: 6, k: 14, pitch: 6, ...dwa(o, { psi: -62, th: 20, z: 19 }), kz: 0.3, zs: 20 }),
    wp({ al: 12, k: 34, pitch: 4, ...dwa(o, RACK_R), kz: 0.3, zs: 20 }),
    wp({ al: 4, k: 14, pitch: 2, ...dwa(o, RACK_R), kz: 0.2, zs: 20 }),
  ];
  return gotowe(cw, o.sprz, W);
}
/** Bottoms-up clean z zawieszenia (recenzja p4a): start ze zwisu przy udach (lekki zawias), wyprost, kettlebell dnem do góry przy barku: przedramię pionowo, łokieć pod dłonią, kula nad rączką (tryb dzwonu „gora”). */
function zarzutDnemDoGory(cw) {
  const o = { jedna: true }; const sprz = SPRZ(KB({ trzyma: 'R', dzwon: 'gora' })); const BU = { psi: -62, th: 148, z: 18 };
  const W = [
    wp({ al: 8, k: 26, pitch: 30, ...dwa(o, { psi: -100, th: 10, z: 15 }), kz: 0.3, zs: 20 }),
    wp({ al: 6, k: 14, pitch: 6, ...dwa(o, { psi: -62, th: 20, z: 19 }), kz: 0.3, zs: 20 }),
    wp({ al: 12, k: 30, pitch: 4, ...dwa(o, BU), kz: 0.3, zs: 20 }),
    wp({ al: 4, k: 14, pitch: 2, ...dwa(o, BU), kz: 0.2, zs: 20 }),
  ];
  return gotowe(cw, sprz, W);
}
/** Rwanie: zawis między nogami → wyprost → ciężar prosto nad głową (u = 1). */
function rwanie(cw, o) {
  const W = [
    wp({ al: 18, k: 48, pitch: 62, ...dwa(o, { psi: -100, th: 10, z: o.jedna ? 15 : 17 }), kz: 0.5, zs: 20 }),
    wp({ al: 6, k: 14, pitch: 6, ...dwa(o, { psi: -62, th: 20, z: 19 }), kz: 0.3, zs: 20 }),
    wp({ al: 4, k: 12, pitch: 3, ...dwa(o, { psi: 30, th: 95, z: 21 }), kz: 0.3, zs: 18, A: [1, yP(-40) + 3], pod: -40 }),
    wp({ al: 6, k: 30, pitch: 3, ...dwa(o, NAD), kz: 0.3, zs: 16 }),
  ];
  return gotowe(cw, o.sprz, W);
}
/** Podrzut / wyciskanie balistyczne: ciężar przy barku → krótkie ugięcie → wyprost na palcach → ręka prosta nad głową (split: wykrok). */
function podrzut(cw, o) {
  const rack = (extra = {}) => wp({ al: 3, k: 12, pitch: 2, ...dwa(o, RACK_R), kz: 0.2, zs: 18, ...extra });
  const W = [rack(), rack({ al: 10, k: 38, pitch: 3 }),
    rack({ al: 8, k: 8, pod: -45, A: [1, yP(-45) + 4], ra: { psi: 5, th: 95, z: 19 }, ...(o.jedna ? { rl: WOLNA() } : {}) }),
    o.split ? wp({ ...SPLIT(), pitch: 3, ...dwa(o, NAD), kz: 0.2, zs: 14 }) : o.pp ? wp({ al: 3, k: 6, pitch: 3, ...dwa(o, NAD), kz: 0.2, zs: 18 }) /* wyciskanie z nóg: po wybiciu nogi zostają proste, ręce kończą ruch (recenzja p4a) */ : wp({ al: 12, k: 30, pitch: 3, ...dwa(o, NAD), kz: 0.2, zs: 18 })];
  return gotowe(cw, o.sprz, W);
}
/** Sumo high pull: szeroki rozkrok, dzwon między stopami → wyprost → łokcie wysoko, ciężar przy brodzie. */
function sumoHighPull(cw) {
  const sprz = SPRZ(KB({ dzwon: 'dol' })); const st = { zs: 23, rot: 38, kz: 0.9 };
  const mk = (bend = 0) => [
    wp({ al: 22, k: 88, pitch: 38, ra: { psi: -95, th: 22, z: 5 }, ...st }),
    wp({ al: 8, k: 36, pitch: 24, ra: { psi: -92, th: 24, z: 5 }, ...st, bend: bend * 0.6 }),
    wp({ al: 4, k: 20, pitch: 4, ra: { psi: -92, th: 100, z: 5 }, ...st, bend: 0 }),
    wp({ al: 4, k: 18, pitch: 3, ra: { psi: -55, th: 140, z: 5 }, ...st, A: [1, yP(-40) + 3], pod: -40 }),
  ].map((w, i) => (i === 0 ? { ...w, bend } : w));
  const W = mk(0); const W2 = mk(26); W2[0].bend = 26; W2[1].bend = 26; W2[2].bend = 0;
  void W2;
  return gotowe(cw, sprz, W, bledyPlecy(W));
}
/** Błąd „zaokrąglone plecy” (mis.roundBack): zgięcie kręgosłupa narasta w dole ruchu i wraca do zera w wyproście. */
function bledyPlecy(W, ile = W.length - 2) { const W2 = W.map((w, i) => ({ ...w, bend: i < ile ? 26 : 0, ra: i < ile ? { ...w.ra, th: w.ra.th + 12 } : w.ra, rl: i < ile ? { ...w.rl, th: w.rl.th + 12 } : w.rl })); return [(r) => bladZRuchu({ cue: 'mis.roundBack', znacznik: 'back', ruch: r, W2, buduj2: P, od: 1 })]; }
/** Jednoręczny zarzut z podrzutem: zawis → rack → ugięcie → wyrzut → nad głową (wykrok). */
function cleanJerk(cw) {
  const o = { jedna: true }; const sprz = SPRZ(KB({ trzyma: 'R', dzwon: 'wzdluz' }));
  const rack = (extra = {}) => wp({ al: 3, k: 12, pitch: 2, ...dwa(o, RACK_R), kz: 0.2, zs: 18, ...extra });
  const W = [
    wp({ al: 18, k: 48, pitch: 62, ...dwa(o, { psi: -100, th: 10, z: 15 }), kz: 0.5, zs: 20 }),
    wp({ al: 6, k: 14, pitch: 6, ...dwa(o, { psi: -62, th: 20, z: 19 }), kz: 0.3, zs: 20 }),
    rack({ al: 12, k: 34, pitch: 4 }), rack({ al: 10, k: 38, pitch: 3 }),
    rack({ al: 8, k: 8, pod: -45, A: [1, yP(-45) + 4], ra: { psi: 5, th: 95, z: 19 }, rl: WOLNA() }),
    wp({ ...SPLIT(), pitch: 3, ...dwa(o, NAD), kz: 0.2, zs: 14 }),
  ];
  return gotowe(cw, sprz, W);
}
const SPLIT = () => { const hip = biodroZKostki([26, 7], -90 - 25 + 80, 80); return { A: [26, 7], al: 25, k: 80, AL: [hip[0] - 28, yP(-60) + 0.5], podL: -62 }; };

export function generuj() {
  const G = {};
  G['Kettlebell Swing'] = () => swing('Kettlebell Swing', { sprz: SPRZ(KB()) });
  G['One-Arm Kettlebell Swings'] = () => swing('One-Arm Kettlebell Swings', { jedna: true, sprz: SPRZ(KB({ trzyma: 'R' })) });
  const k1 = (o = {}) => ({ jedna: true, sprz: SPRZ(KB({ trzyma: 'R', dzwon: o.dzwon ?? 'wzdluz' })), ...o });
  const k2 = () => ({ sprz: SPRZ(KB({ trzyma: 'R', dzwon: 'wzdluz' }), KB({ trzyma: 'L', dzwon: 'wzdluz' })) });
  G['Kettlebell Clean'] = () => zarzut('Kettlebell Clean', k1());
  G['Double Kettlebell Clean'] = () => zarzut('Double Kettlebell Clean', k2());
  G['Dumbbell Clean'] = () => zarzut('Dumbbell Clean', { sprz: SPRZ(DB({ trzyma: 'R' }), DB({ trzyma: 'L' })) });
  G['Bottoms-Up Clean From The Hang Position'] = () => zarzutDnemDoGory('Bottoms-Up Clean From The Hang Position');
  G['Kettlebell Snatch'] = () => rwanie('Kettlebell Snatch', k1());
  G['Double Kettlebell Snatch'] = () => rwanie('Double Kettlebell Snatch', k2());
  G['Snatch (hantel)'] = () => rwanie('Snatch (hantel)', { jedna: true, sprz: SPRZ(DB({ trzyma: 'R' })) });
  G['Double Kettlebell Push Press'] = () => podrzut('Double Kettlebell Push Press', { ...k2(), pp: true });
  G['Double Kettlebell Jerk'] = () => podrzut('Double Kettlebell Jerk', k2());
  G['One-Arm Kettlebell Push Press'] = () => podrzut('One-Arm Kettlebell Push Press', { ...k1(), pp: true });
  G['One-Arm Kettlebell Jerk'] = () => podrzut('One-Arm Kettlebell Jerk', k1());
  G['One-Arm Kettlebell Split Jerk'] = () => podrzut('One-Arm Kettlebell Split Jerk', k1({ split: true }));
  G['Kettlebell Sumo High Pull'] = () => sumoHighPull('Kettlebell Sumo High Pull');
  G['One-Arm Kettlebell Clean and Jerk'] = () => cleanJerk('One-Arm Kettlebell Clean and Jerk');
  return G;
}
