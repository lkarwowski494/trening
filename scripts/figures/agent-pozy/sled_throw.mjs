// Generator póz rodziny sled_throw (sanie, rzuty piłką lekarską, slamy, wall ball, Turkish Get Up) po stronie agenta (wersja 1.1, 26.10.2026).
// Piłka jest w dłoniach w każdej klatce (silnik nie pokazuje wyrzutu): rzut kończy się w chwili wyrzutu (wyprost na palcach, ręce w ruchu), slam w chwili uderzenia o podłogę.
// Sanie: dłonie na słupkach (chwyt zakotwiczony w świecie, pochylenie tułowia z zasięgu ramion), kroki naprzemienne nóg.
import { kostkaNaPalcach } from './model.mjs';
import { bledyCwiczenia } from '../v2-validate.mjs';
import { wczytajTeksty } from '../v2-jakosc.mjs';
import { P, Q, ruch, bladZRuchu, bladKolana, zbuduj, PODLOGA, bledyZOpisem, biodroZKostki, kostkaZBiodra, katyNogi, wyjatkiOpisu, cyklLustro } from './dyn.mjs';

export const RODZINA = 'sled_throw';
const OTW = (powod) => `ćwiczenie otwarte: ${powod} (data/zrodla/figury-sens.json → sled_throw.otwarte); poza wróci po opisie ruchu przez badacza`;
export const WYJATKI = {
  'Turkish Get Up': 'faza „tripodu” (klęk na jednym kolanie z dłonią na podłodze i ciężarem nad sobą) wymaga w modelu jednocześnie: ramię podpierające ≤ 64 cm (bark ≤ ok. 70 cm nad podłogą), biodra ≥ 40 cm i wyprost biodra ≥ −17° — przy tych ograniczeniach pochylenie tułowia musi przekroczyć 70°, co daje wyprost biodra ok. −26° (poza zakresem). Trzy podejścia generatora (pozycje leżenie → łokieć → dłoń → mostek → wykrok → stanie) nie zmieściły się w kontrakcie; wymaga decyzji koordynatora (zakres biodra w tripodzie albo uproszczenie ruchu)',
  'Backward Drag': OTW('jedyna wskazówka (napęd z nóg) nie opisuje pozycji ciała'),
  'Bear Crawl Sled Drag': OTW('zestaw „open”, brak źródła ruchu'), 'Medicine Ball Chest Pass': OTW('zestaw „open”, brak źródła ruchu'),
  'Sled Forward Drag with Press': OTW('zestaw „open”, brak źródła ruchu'), 'Sled Overhead Backward Walk': OTW('zestaw „open”, brak źródła ruchu'),
  'Sledgehammer Swings': OTW('zestaw „open”, brak źródła ruchu'), 'Spider Crawl': OTW('zestaw „open”, brak źródła ruchu'),
  'Supine Chest Throw': OTW('zestaw „open”, brak źródła ruchu'), 'Supine One-Arm Overhead Throw': OTW('zestaw „open”, brak źródła ruchu'), 'Supine Two-Arm Overhead Throw': OTW('zestaw „open”, brak źródła ruchu'),
};
export const PRZYBLIZENIA = {};
export const POMINIETE_BLEDY = {};
export const WYJATKI_OPISU = wyjatkiOpisu(RODZINA);
const yP = (pod) => kostkaNaPalcach(0, pod);
const SPRZ = (...extra) => [PODLOGA(-200, 200), ...extra];
const PILKA = (o = {}) => ({ rodzaj: 'pilka_lekarska', ...o });

/** Punkt zwrotny: noga al/k (kostka A), tułów pitch, ramiona ra (psi, th, z) — chwyt na piłce z = ±11 (promień piłki). */
function wp(o) {
  const A = o.A ?? [0, 7];
  return { A, al: o.al, k: o.k, pod: o.pod ?? 0, pitch: o.pitch, ra: { z: 11, ...o.ra }, rl: o.rl ? { z: 24, ...o.rl } : undefined, zR: o.zs ?? 14, zL: o.zs ?? 14, kz: o.kz ?? 0.2, bend: o.bend ?? 0, head: o.head ?? (o.pitch ?? 0) * 0.35, rotR: 14, rotL: 14, nopole: o.nopole, AL: o.AL ?? [A[0], A[1]], podL: o.podL ?? (o.pod ?? 0) };
}
const gotowe = (cw, sprz, W, bledy = [], buduj = P) => {
  const tk = wczytajTeksty(); const ok = new Set(bledy.map((b) => b.cue));
  for (const c of bledyCwiczenia(cw)) if (!ok.has(c)) POMINIETE_BLEDY[cw] = (POMINIETE_BLEDY[cw] ? POMINIETE_BLEDY[cw] + '; ' : '') + (tk[c] ? `błąd „${c}” (rząd błędu do wygenerowania)` : `błąd „${c}” bez opisu w lib/cues/text/pl.json — nie rysowany (reguła jakości etykieta_bledu); generator narysuje go po wdrożeniu tekstu`);
  const r = ruch(W, buduj, { rodzina: RODZINA, cw, sprzet: sprz });
  if (process.env.DBG_SL) console.error(cw, 'szczyt', r.szczyt.toFixed(1), 'droga', r.suma.toFixed(0), 'klatek', r.klatki.length);
  const poza = zbuduj({ rodzina: RODZINA, cwiczenie: cw, sprzet: sprz, klatki: r.klatki, bledy: bledyZOpisem(cw, bledy.map((b) => b(r)), POMINIETE_BLEDY) });
  for (const b of poza.bledy) if (b.cue === 'sq.mis.kneesIn' && !b.dotyczy.includes('kneeLat')) b.dotyczy.push('kneeLat'); /* kolana do środka: wielkość spoza kątów w płaszczyźnie */
  return poza;
};

/** Slam: piłka nad głową (u = 0) → uderzenie w podłogę (zawias, ręce w dół). */
function slam(cw, { jedna = false }) {
  const ra = (psi, th, z = 11) => ({ psi, th, z });
  const W = [
    wp({ al: 3, k: 10, pod: -45, A: [1, yP(-45) + 2], pitch: -2, ra: ra(72, 12, jedna ? 19 : 11), rl: jedna ? { psi: 40, th: 25 } : undefined }),
    wp({ al: 10, k: 36, pitch: 30, ra: ra(-5, 20, jedna ? 19 : 11), rl: jedna ? { psi: -30, th: 25 } : undefined }),
    wp({ al: 22, k: 60, pitch: 52, ra: ra(-72, 12, jedna ? 19 : 11), rl: jedna ? { psi: -60, th: 25 } : undefined, zs: 18, kz: 0.4 }),
  ];
  return gotowe(cw, SPRZ(PILKA(jedna ? { trzyma: 'R' } : {})), W);
}

/** Rzut obunóż: zamach (ugięcie nóg, piłka nisko albo za głową) → wyprost na palcach z ręką w ruchu → moment wyrzutu (ręce w górę i do przodu). */
function rzut(cw, typ) {
  const T = { al: 3, k: 8, pod: -45, A: [1, yP(-45) + 3] };
  const W = {
    nad: [wp({ al: 12, k: 34, pitch: -8, ra: { psi: 80, th: 34 }, zs: 16 }), wp({ ...T, pitch: 3, ra: { psi: 62, th: 20 } }), wp({ ...T, pitch: 18, ra: { psi: 22, th: 16 } })],
    tyl: [wp({ al: 30, k: 105, pitch: 40, ra: { psi: -78, th: 12 }, zs: 26, kz: 0.9 }), wp({ ...T, pitch: 5, ra: { psi: 58, th: 14 } }), wp({ ...T, pitch: -6, ra: { psi: 78, th: 14 } })],
    scoop: [wp({ al: 30, k: 105, pitch: 38, ra: { psi: -62, th: 24 }, zs: 22, kz: 0.8 }), wp({ al: 8, k: 40, pitch: 14, ra: { psi: -25, th: 24 } }), wp({ ...T, pitch: 6, ra: { psi: 40, th: 16 } })],
  }[typ];
  return gotowe(cw, SPRZ(PILKA()), W);
}
/** Wall ball: przysiad z piłką przy klatce → wyprost → piłka nad głowę w stronę ściany (przed osobą). */
function wallBall(cw) {
  const sprz = SPRZ(PILKA(), { rodzaj: 'sciana', x: 95, h: 300, przed: true }); const np = { nopole: true, rot: 18 };
  const W = [wp({ al: 4, k: 12, pitch: 2, ra: { psi: -62, th: 95 }, zs: 18, ...np }), wp({ al: 32, k: 105, pitch: 22, ra: { psi: -62, th: 95 }, zs: 20, ...np }),
    wp({ al: 6, k: 16, pitch: 4, ra: { psi: 15, th: 55 }, zs: 17, pod: -30, A: [1, yP(-30) + 3], ...np }), wp({ al: 4, k: 14, pitch: 3, ra: { psi: 62, th: 16 }, zs: 17, pod: -45, A: [1, yP(-45) + 3], ...np })];
  return gotowe(cw, sprz, W, [(r) => bladKolana(r, { cue: 'sq.mis.kneesIn' })]);
}
/** Chód w miejscu (figura stoi w x = hx, podłoże „przesuwa się”, jak w rodzinie carry): połowa cyklu kroku w 4 punktach zwrotnych. Stopa podporowa (lewa) stoi na podłożu i względem miednicy cofa się
 * (przed ciałem → pod ciałem → za ciałem, na palcach), a stopa wykroczna (prawa) odrywa się z tyłu i przenosi nad podłożem do przodu. Poprawka po recenzji 27.10.2026: wcześniej stopa na podłożu sunęła do przodu (chód odwrotny, „moonwalk”).
 * Punkty: { R: [x względem hx, y, podbicie], L: [x względem hx, y, podbicie] }; y = null → stopa na podłożu (kostka nad podeszwą dla danego podbicia). */
const NA_PODLODZE = (pod) => yP(pod) + 0.6;
/** Stopa w powietrzu: podbicie z kierunku goleni (zgięcie podeszwowe `plant` stopni względem prostopadłej do goleni: stopa rozluźniona, kąt kostki w zakresie). */
const podPowietrze = (hip, A, plant) => { const k = katyNogi(hip, A); return Math.max(-85, k.t - k.k + 90 - plant); }; /* schemat: podbicie ≥ −90° */
const chodKrok = (hx, hy, { R, L }, extra = {}) => {
  const ank = (f) => [hx + f[0], f[1] === null ? NA_PODLODZE(f[2]) : f[1]]; const hip = [hx, hy];
  const pod = (f) => (f[1] === null ? f[2] : podPowietrze(hip, ank(f), f[2]));
  return { pel: hip, AR: ank(R), AL: ank(L), podR: pod(R), podL: pod(L), zR: 12, zL: 12, rot: 14, kz: 0.2, ...extra };
};
/** Półkrok: prawa noga odpycha się z tyłu i leci do przodu, lewa ląduje przed ciałem i cofa się do odbicia (cały chód to ten półkrok na przemian, zamiana nóg przy powtórzeniu).
 * Stopa w powietrzu: trzeci element = zgięcie podeszwowe względem goleni; na podłożu: bezwzględne podbicie (dla ostatniego kroku podporu pośredni punkt toczenia stopy: pięta unosi się, palce stoją). */
const polkrok = (hx, hy, extra = [{}, {}, {}, {}, {}]) => [
  chodKrok(hx, hy, { R: [-58, null, -55], L: [22, 28, 25] }, extra[0]),
  chodKrok(hx, hy, { R: [-40, 38, 35], L: [24, null, 0] }, extra[1]),
  chodKrok(hx, hy, { R: [-2, 44, 25], L: [-2, null, 0] }, extra[2]),
  chodKrok(hx, hy, { R: [12, 40, 20], L: [-30, null, -25] }, extra[3]),
  chodKrok(hx, hy, { R: [22, 28, 25], L: [-58, null, -55] }, extra[4]), /* tryb cykliczny: klatka końcowa = lustro początkowej (R ↔ L), stopa lądująca nie cofa się o kilkadziesiąt cm */
];
function sledPush(cw) {
  const sprz = SPRZ({ rodzaj: 'sanie', x: 75, h: 100, dlugosc: 60 }); const post = { g: [75, 88], rel: [0, 0], w: 1, z: 25, reach: 62, pole: [0, -1, 0.3] };
  const W = polkrok(-4, 79, Array(5).fill({ ra: post }));
  return cyklLustro(gotowe(cw, sprz, W, [], Q));
}
function sledDrag(cw) {
  const sprz = SPRZ({ rodzaj: 'sanie', x: -170, dlugosc: 60, trzymanie: 'pas' }, { rodzaj: 'pas' });
  const ra = (a) => ({ psi: a, th: 30, z: 19 }); const R_ = [-20, -42, -65, -88, -110]; const L_ = [-110, -88, -65, -42, -20]; /* ręka przeciwna do nogi: prawa noga do przodu → prawa ręka do tyłu */
  const W = polkrok(0, 79, R_.map((a, i) => ({ pitch: 34, ra: ra(a), rl: ra(L_[i]) })));
  return cyklLustro(gotowe(cw, sprz, W, [], Q), { rece: true }); /* ręka przeciwna do nogi zamienia strony razem z nogami */
}

const KB = (o = {}) => ({ rodzaj: 'kettlebell', ...o });

export function generuj() {
  const G = {};
  G['Medicine Ball Slam'] = () => slam('Medicine Ball Slam', {});
  G['One-Arm Medicine Ball Slam'] = () => slam('One-Arm Medicine Ball Slam', { jedna: true });
  G['Standing Two-Arm Overhead Throw'] = () => rzut('Standing Two-Arm Overhead Throw', 'nad');
  G['Backward Medicine Ball Throw'] = () => rzut('Backward Medicine Ball Throw', 'tyl');
  G['Medicine Ball Scoop Throw'] = () => rzut('Medicine Ball Scoop Throw', 'scoop');
  G['Wall Ball'] = () => wallBall('Wall Ball');
  G['Sled Push'] = () => sledPush('Sled Push');
  G['Sled Drag (Harness)'] = () => sledDrag('Sled Drag (Harness)');
  return G;
}
