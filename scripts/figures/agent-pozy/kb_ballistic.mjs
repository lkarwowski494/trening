// Generator póz rodziny kb_ballistic (kettlebell i hantel: swing, zarzut, rwanie, podrzut, wyciskania balistyczne) po stronie agenta (wersja 1.1, 26.10.2026).
// Wymach i przechwyt: punkty zwrotne w przestrzeni parametrów (kąty uda i kolana, tułów, ramię z kąta barku i łokcia), ciężar podąża za dłonią (silnik), dzwon wzdłuż przedramienia.
// Swing: u = 0 dół (zawias, ciężar za nogami) → u = 1 góra (wyprost, ręce prosto przed sobą). Zarzut: zawis między nogami → pozycja przy barku (rack). Rwanie: zawis → nad głową. Podrzut: rack → dip → wyrzut → nad głową.
import { kostkaNaPalcach } from './model.mjs';
import { bledyCwiczenia } from '../v2-validate.mjs';
import { wczytajTeksty } from '../v2-jakosc.mjs';
import { P, mix, ruch, bladZRuchu, zbuduj, PODLOGA, bledyZOpisem, biodroZKostki, wyjatkiOpisu, jednokierunkowa, ramieFK, up, front, barki, pitchDoChwytu } from './dyn.mjs';

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
  if (process.env.DBG_KB) console.error(cw, 'szczyt', r.szczyt.toFixed(1), 'droga', r.suma.toFixed(0), 'klatek', r.klatki.length, 'dl', JSON.stringify(r.dl?.map((x) => Math.round(x))));
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

/** W1-r2 (recenzja r2, 09.11.2026): ramię w układzie tułowia ({ rel: [w górę wzdłuż tułowia, do przodu] od barku, pole, z }), żeby ciężar w ciągu jechał blisko ciała, a nie po łuku przed nim.
 * Opis ramienia prawego; lewe = lustro (z bieguna łokcia odwraca się składową poprzeczną). Opis kątami (psi, th) jest przeliczany na rel dla pochylenia tułowia danego punktu zwrotnego (ta sama poza, inny sposób mieszania punktów). */
function relRamie(a, pitch, sg) {
  if (a.rel) return { rel: a.rel, z: a.z, pole: [a.pole[0], a.pole[1], sg * a.pole[2]] };
  const r = ramieFK([0, 0], a.psi, a.th); const u = up(pitch), f = front(pitch); const d = r.grip;
  return { rel: [d[0] * u[0] + d[1] * u[1], d[0] * f[0] + d[1] * f[1]], z: a.z, pole: r.pole ? [r.pole[0], r.pole[1], sg * (a.pz ?? 0.25)] : [-0.3, -1, sg * 0.25] };
}
const wR = (o) => { const w = wp(o); return { ...w, ra: relRamie(w.ra, w.pitch, 1), rl: relRamie(w.rl, w.pitch, -1) }; };
/** Ramię z celu w świecie: chwyt G = [x, y] przy danym biodrze i pochyleniu → rel względem barku (start z podłogi). */
const relZCelu = (o, G, pole, z) => { const hip = biodroZKostki(o.A ?? [0, 7], -90 - o.al + o.k, o.k); const S = barki(hip, o.pitch, 0); const d = [G[0] - S[0], G[1] - S[1]]; const u = up(o.pitch), f = front(o.pitch); return { rel: [d[0] * u[0] + d[1] * u[1], d[0] * f[0] + d[1] * f[1]], pole, z }; };

/** Start z podłogi (karta Snatch (hantel): „postaw hantel między stopami; zejdź jak do martwego ciągu”): kolana mocno ugięte (jak start martwego ciągu z niskim chwytem), ręka prawie prosta w dół do hantla na podłodze na linii kostek; pochylenie tułowia dobrane tak, by chwyt leżał w zasięgu ramienia. */
function startZPodlogi(o) {
  const al = 24, k = 78, G = [8, 9], th = 16; const hip = biodroZKostki([0, 7], -90 - al + k, k); const reach = Math.sqrt(31 ** 2 + 33 ** 2 + 2 * 31 * 33 * Math.cos(th * Math.PI / 180));
  let best = 0, bv = Infinity; for (let p = 20; p <= 90; p += 0.25) { const S = barki(hip, p, 0); const e = Math.abs(Math.hypot(G[0] - S[0], G[1] - S[1]) - reach); if (e < bv) { bv = e; best = p; } }
  const S = barki(hip, best, 0); const psi = Math.atan2(G[1] - S[1], G[0] - S[0]) * 180 / Math.PI;
  return { al, k, pitch: best, ra: { psi, th, z: 8 }, kz: 0.5, zs: 18 };
}
/** W1 (recenzja r1, 09.11.2026): start zarzutu i rwania jak dół swingu — ręce cofnięte, ciężar między nogami za linią kostek (karta: „oba kettlebelle przeszły między nogami”, „zamach jak przy swingu”).
 * W1-r2 (recenzja r2): do wyprostu bioder ręka prosta (łokieć ≤ ok. 15°; karta: „ręka włącza się dopiero po wyproście bioder i kolan”), dopiero potem łokieć zgina się przy tułowiu, a ciężar jedzie w górę blisko ciała
 * (odstęp ciężaru od tułowia ≤ ok. 15 cm; karta: „po wyproście bioder przyciągnij je blisko ciała”), bez poziomego przedramienia z ciężarem przed brzuchem. Hantle (po bokach nóg): mniej cofnięta ręka. */
const hike = (o) => (o.hantle ? { psi: -108, th: 12, z: 18 } : { psi: -140, th: o.jedna ? 26 : 22, z: o.jedna ? 3 : 6 });
const pociag = (o) => ({ psi: -95, th: o.hantle ? 10 : o.jedna ? 18 : 30, z: o.hantle ? 20 : o.jedna ? 7 : 3 }); /* biodra w połowie wyprostu: ręka prosta (łokieć ≤ 30°; boczne przesunięcie chwytu skraca zasięg), ciężar mija uda */
const wyprost = (o) => ({ psi: -85, th: o.jedna || o.hantle ? 8 : 14, z: 21 }); /* biodra i kolana wyprostowane: ręka nadal prosta, ciężar tuż przed udami */
/** Napęd (od zawisu do wyprostu bioder): punkty zwrotne w kątach (psi, th) próbkowane gęściej (5), żeby ciężar jechał po łuku prostej ręki, a nie po cięciwie (cięciwa skraca ramię i zgina łokieć). */
function naped(o) {
  const S = [
    o.podloga ? startZPodlogi(o) : { al: 18, k: 48, pitch: 62, ra: hike(o), kz: 0.5, zs: o.jedna ? 27 : 20 },
    { al: 12, k: 30, pitch: 22, ra: pociag(o), kz: 0.4, zs: o.jedna && !o.hantle ? 26 : o.hantle ? 20 : 24 },
    { al: 6, k: 14, pitch: 6, ra: wyprost(o), kz: 0.3, zs: 20 },
  ];
  const rl = (x) => (o.jedna ? { rl: WOLNA(o.wpsi ?? -70) } : { rl: { ...x.ra } });
  return [0, 0.25, 0.5, 0.75, 1].map((t) => { const x = t <= 0.5 ? mix(S[0], S[1], t * 2) : mix(S[1], S[2], (t - 0.5) * 2); return wR({ ...x, ...rl(x) }); });
}
const PRZY_CIELE = { rel: [-36, 14], pole: [0.3, -1, 0.7], z: 19 }; /* łokieć zgięty przy żebrach, ciężar na wysokości mostka tuż przy tułowiu */
/** Zarzut: zawis między nogami (hike) → wyprost → ciężar przy tułowiu → rack. */
function zarzut(cw, o) {
  const W = [
    ...naped(o),
    wR({ al: 6, k: 14, pitch: 5, ...dwa(o, PRZY_CIELE), kz: 0.3, zs: 20 }),
    wR({ al: 12, k: 34, pitch: 4, ...dwa(o, RACK_R), kz: 0.3, zs: 20 }),
    wR({ al: 4, k: 14, pitch: 2, ...dwa(o, RACK_R), kz: 0.2, zs: 20 }),
  ];
  return gotowe(cw, o.sprz, W);
}
/** Bottoms-up clean z zawieszenia (recenzja p4a, runda 2): start ze zwisu przy udach (lekki zawias, dzwon w dół), rączka idzie blisko ciała (łokieć cofnięty, przedramię coraz bardziej w górę), na końcu kettlebell dnem do góry przy barku:
 * przedramię pionowo, łokieć pod dłonią. Tryb dzwonu „wzdluz_gora”: dzwon wzdłuż przedramienia, a dnem do góry dopiero przy przedramieniu ≤ 45° od pionu. Wolna ręka wzdłuż ciała. */
function zarzutDnemDoGory(cw) {
  const sprz = SPRZ(KB({ trzyma: 'R', dzwon: 'wzdluz_gora' })); const BU = { psi: -62, th: 148, z: 18 }; const WOLNA_BU = { psi: -90, th: 8, z: 26 };
  const r = (ra) => ({ ra, rl: WOLNA_BU });
  const W = [
    wp({ al: 14, k: 40, pitch: 50, ...r({ psi: -100, th: 10, z: 15 }), kz: 0.3, zs: 20 }), /* zwis przy kolanach: dzwon w dół bez przenikania ud */
    wp({ al: 6, k: 14, pitch: 6, ...r({ psi: -118, th: 100, z: 17 }), kz: 0.3, zs: 20 }),
    wp({ al: 8, k: 22, pitch: 5, ...r({ psi: -96, th: 134, z: 18 }), kz: 0.3, zs: 20 }),
    wp({ al: 12, k: 30, pitch: 4, ...r(BU), kz: 0.3, zs: 20 }),
    wp({ al: 4, k: 14, pitch: 2, ...r(BU), kz: 0.2, zs: 20 }),
  ];
  return gotowe(cw, sprz, W);
}
/** Rwanie: zawis między nogami → wyprost → ciężar prosto nad głową (u = 1). */
function rwanie(cw, o) {
  const W = [
    ...naped(o),
    wR({ al: 4, k: 12, pitch: 3, ...dwa(o, { rel: [-6, 19], pole: [0, 0, 4], z: 21 }), kz: 0.3, zs: 18, A: [1, yP(-30) + 3], pod: -30 }),
    wR({ al: 4, k: 14, pitch: 3, ...dwa(o, { rel: [24, 28], pole: [0, 0, 4], z: 21 }), kz: 0.3, zs: 17, A: [1, yP(-30) + 3], pod: -30 }), /* ciężar mija głowę z przodu (bez przenikania), dopiero potem wyrzut nad głowę */
    wR({ al: 6, k: 30, pitch: 3, ...dwa(o, NAD), kz: 0.3, zs: 16 }),
  ];
  return gotowe(cw, o.sprz, W);
}
/** Podrzut / wyciskanie balistyczne: ciężar przy barku → krótkie ugięcie → wyprost na palcach → ręka prosta nad głową (split: wykrok). */
function podrzut(cw, o) {
  const rack = (extra = {}) => wp({ al: 3, k: 12, pitch: 2, ...dwa(o, RACK_R), kz: 0.2, zs: 18, ...extra });
  const W = [rack(), rack({ al: 10, k: 38, pitch: 3 }),
    rack({ al: 8, k: 8, pod: -45, A: [1, yP(-45) + 4], ra: { psi: 5, th: 95, z: 19 }, ...(o.jedna ? { rl: WOLNA() } : {}) }),
    o.split ? wp({ ...SPLIT(), pitch: 3, ...dwa(o, NAD), kz: 0.2, zs: 14 }) : o.pp ? wp({ al: 3, k: 6, pitch: 3, ...dwa(o, NAD), kz: 0.2, zs: 18 }) /* wyciskanie z nóg: po wybiciu nogi zostają proste, ręce kończą ruch (recenzja p4a) */ : wp({ al: 12, k: 30, pitch: 3, ...dwa(o, NAD), kz: 0.2, zs: 18 })];
  /* N1 (recenzja r1): podrzut kończy się wstaniem z ciężarem nad głową na prostych nogach (karta: „zejdź pod nie drugim ugięciem … i wstań”) */
  if (!o.split && !o.pp) W.push(wp({ al: 3, k: 6, pitch: 3, ...dwa(o, NAD), kz: 0.2, zs: 18 }));
  return gotowe(cw, o.sprz, W);
}
/** Chwyt kettlebella w świecie (x, y, |z|) i kierunek łokcia pole = [x, y, |z|] (łokieć na zewnątrz i w górę); obie ręce symetrycznie. */
const dlonie = (x, y, z, pole) => ({ ra: { g: [x, y, z], pole }, rl: { g: [x, y, -z], pole: [pole[0], pole[1], -pole[2]] } });
/** Sumo high pull: szeroki rozkrok, dzwon między stopami → wyprost → łokcie wysoko i na boki (nad dłońmi, odwiedzenie ≥ 45°), ciężar przy brodzie; stopy na podłodze także w klatce końcowej (recenzja p4a, runda 2). */
function sumoHighPull(cw) {
  const sprz = SPRZ(KB({ dzwon: 'dol' })); const st = { zs: 23, rot: 38, kz: 0.9 };
  const mk = (bend = 0) => [
    wp({ al: 22, k: 88, pitch: 38, ra: { psi: -95, th: 22, z: 5, pz: 2 }, ...st }),
    wp({ al: 6, k: 28, pitch: 12, ra: { psi: -98, th: 55, z: 5, pz: 2 }, ...st, bend: bend * 0.6 }), /* N2 (r1): ciąg zaczyna się w trakcie wyprostu bioder, bez zatrzymania w pół zawiasu */
    wp({ al: 4, k: 20, pitch: 4, ra: { psi: -115, th: 112, z: 6.5, pz: 6 }, ...st, bend: 0 }),
    wp({ al: 4, k: 18, pitch: 3, ra: { psi: -80, th: 140, z: 6.5, pz: 9.5 }, ...st, A: [1, yP(-40) + 1], pod: -40 }),
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
  const rack = (extra = {}) => wR({ al: 3, k: 12, pitch: 2, ...dwa(o, RACK_R), kz: 0.2, zs: 18, ...extra });
  const W = [
    ...naped(o),
    wR({ al: 6, k: 14, pitch: 5, ...dwa(o, PRZY_CIELE), kz: 0.3, zs: 20 }),
    rack({ al: 12, k: 34, pitch: 4 }), rack({ al: 10, k: 38, pitch: 3 }),
    rack({ al: 9, k: 22, pod: -22, A: [0.5, yP(-22) + 2], ra: { psi: -42, th: 113, z: 19 }, rl: WOLNA() }), /* W1-r2: punkt pośredni łuku (po zmianie na opis w układzie tułowia łuk bez niego przechodzi przez ramię) */
    rack({ al: 8, k: 8, pod: -45, A: [1, yP(-45) + 4], ra: { psi: 5, th: 95, z: 19 }, rl: WOLNA() }),
    wR({ ...SPLIT(), pitch: 3, ...dwa(o, NAD), kz: 0.2, zs: 14 }),
  ];
  return gotowe(cw, sprz, W);
}
const SPLIT = () => { const hip = biodroZKostki([26, 7], -90 - 25 + 80, 80); return { A: [26, 7], al: 25, k: 80, AL: [hip[0] - 28, yP(-60) + 0.5], podL: -62 }; };

export const JEDNOKIERUNKOWE = ['Kettlebell Snatch', 'Double Kettlebell Snatch', 'Snatch (hantel)', 'Double Kettlebell Push Press', 'Double Kettlebell Jerk', 'One-Arm Kettlebell Push Press', 'One-Arm Kettlebell Jerk', 'One-Arm Kettlebell Split Jerk', 'One-Arm Kettlebell Clean and Jerk'];
export function generuj() {
  const G = {};
  G['Kettlebell Swing'] = () => swing('Kettlebell Swing', { sprz: SPRZ(KB()) });
  G['One-Arm Kettlebell Swings'] = () => swing('One-Arm Kettlebell Swings', { jedna: true, sprz: SPRZ(KB({ trzyma: 'R' })) });
  const k1 = (o = {}) => ({ jedna: true, sprz: SPRZ(KB({ trzyma: 'R', dzwon: o.dzwon ?? 'wzdluz' })), ...o });
  const k2 = () => ({ sprz: SPRZ(KB({ trzyma: 'R', dzwon: 'wzdluz' }), KB({ trzyma: 'L', dzwon: 'wzdluz' })) });
  G['Kettlebell Clean'] = () => zarzut('Kettlebell Clean', k1());
  G['Double Kettlebell Clean'] = () => zarzut('Double Kettlebell Clean', k2());
  G['Dumbbell Clean'] = () => zarzut('Dumbbell Clean', { hantle: true, sprz: SPRZ(DB({ trzyma: 'R' }), DB({ trzyma: 'L' })) });
  G['Bottoms-Up Clean From The Hang Position'] = () => zarzutDnemDoGory('Bottoms-Up Clean From The Hang Position');
  G['Kettlebell Snatch'] = () => rwanie('Kettlebell Snatch', k1());
  G['Double Kettlebell Snatch'] = () => rwanie('Double Kettlebell Snatch', k2());
  G['Snatch (hantel)'] = () => rwanie('Snatch (hantel)', { jedna: true, podloga: true, sprz: SPRZ(DB({ trzyma: 'R' })) });
  G['Double Kettlebell Push Press'] = () => podrzut('Double Kettlebell Push Press', { ...k2(), pp: true });
  G['Double Kettlebell Jerk'] = () => podrzut('Double Kettlebell Jerk', k2());
  G['One-Arm Kettlebell Push Press'] = () => podrzut('One-Arm Kettlebell Push Press', { ...k1(), pp: true });
  G['One-Arm Kettlebell Jerk'] = () => podrzut('One-Arm Kettlebell Jerk', k1());
  G['One-Arm Kettlebell Split Jerk'] = () => podrzut('One-Arm Kettlebell Split Jerk', k1({ split: true }));
  G['Kettlebell Sumo High Pull'] = () => sumoHighPull('Kettlebell Sumo High Pull');
  G['One-Arm Kettlebell Clean and Jerk'] = () => cleanJerk('One-Arm Kettlebell Clean and Jerk');
  /* 09.11.2026 (partia 1): ćwiczenia z wyrzutem albo lotem ciężaru (rwanie, wyciskanie z nóg, podrzut: miednica nie monotoniczna — wyprost na palcach i ugięcie pod ciężarem) to pętla jednokierunkowa:
   * u 0 → 1 = całe powtórzenie (jak olympic), bez powrotu tą samą drogą; swing, zarzut i wysoki ciąg zostają wahadłem (strażnik: tests/figures-v2-kierunek-u.test.ts). */
  for (const k of JEDNOKIERUNKOWE) { const f = G[k]; G[k] = () => jednokierunkowa(f()); }
  return G;
}
