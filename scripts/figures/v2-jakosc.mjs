// Reguły JAKOŚCI póz figur v2 (docs/53, bramka 3 i 4; L-036): luki znalezione przez recenzenta ruchu w pilotażu agent-pozy 26.10.2026 zamienione w sprawdzenia automatyczne.
// Każda reguła: funkcja czysta (poza lub kształty → lista komunikatów z liczbami), id w REGULY_JAKOSCI, test na pozie spełniającej i łamiącej (tests/figury-jakosc.test.ts).
// Używa je waliduj() (v2-validate.mjs, kod „jakosc”) po przejściu schematu, geometrii i sensu; liczby w PROGI (jedno miejsce).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const f1 = (x) => x.toFixed(1);
const dist3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/** Progi (cm, stopnie). Wartości bez źródła to konwencje rysunku (uproszczenie ilustracyjne), nie twierdzenia merytoryczne. */
export const PROGI = {
  bladMinCm: 4, /* błąd postawy: różnica punktu poza błędu − poprawna w KAŻDEJ klatce */
  rozneKlatkiCm: 0.5, /* kolejne klatki ruchu nie są kopiami: różnią się o co najmniej tyle w którymś punkcie (gęste klatki ruchu płynnego mogą różnić się niewiele) */
  statyczneMaxKlatek: 2, /* ćwiczenie izometryczne: najwyżej tyle klatek (minimum kontraktu) */
  podlogaKonczyna: -1.6, /* oś ramienia/przedramienia minus promień nie niżej niż (cm; dłoń leżąca na podłodze ma −1,3) */
  podlogaTulow: -2, /* tułów, miednica, głowa leżące (oś − promień) */
  stykFrontCm: 1.5, /* rzut z przodu: but stojący na podłodze sięga najwyżej tyle nad linią podłogi */
  szyjaMaxDeg: 40, /* kąt osi głowy względem osi tułowia w podporze */
  podstawaMinCm: 28, /* podpór na jednej ręce: rozstaw kostek (szerzej niż biodra ±8,5) */
  receWzdluz: { lokiecNadBarkiemCm: 2, dlonMaxY: 12 }, /* leżąc: łokieć nie wyżej niż bark, dłoń blisko podłogi */
};
/** Dopuszczalne odwiedzenie ramienia (stopnie) przy największym zgięciu łokcia w pompkach i wiosłowaniu; wariant wąski i diamentowy mają łokcie przy tułowiu. Konwencja rysunku (NASM: ok. 45°, ACE: łokcie na boki → część wspólna). */
export const ODWIEDZENIE = { domyslnie: 60, 'Push-Up Wide': 90, 'Close-Grip Push-Up': 40, 'Incline Push-Up Close-Grip': 40, 'Diamond Push Up': 35 };
export const LOKIEC_ZA_BARKIEM = { 'Close-Grip Push-Up': 6, 'Incline Push-Up Close-Grip': 6, 'Diamond Push Up': 6 }; /* cm za barkiem w rzucie bocznym (łokieć w tył) */
/** Grupy błędów POSTAWY (widoczne w każdej klatce); pozostałe (zakres, tempo, bujanie) narastają z fazą ruchu. */
export const GRUPY_POSTAWY = ['linia', 'przeprost', 'lokcie'];
export const RECE_WZDLUZ = ['Lying Leg Raise', 'Reverse Crunch', 'Leg Pull-In', 'Scissor Kick'];
export const PODSTAWA_SZEROKA = ['Single-Arm Push-Up'];
export const WYMAGA_PODWIESZENIA = /^Suspended /;
export const REGULY_JAKOSCI = ['blad_widoczny_stale', 'pod_podloga', 'styk_z_podloga_przod', 'zaslanianie_sprzetu', 'rece_wzdluz_ciala', 'klatki_rozne', 'sprzet_rozpoznawczy', 'podstawa_szeroka', 'szyja_neutralna', 'etykieta_bledu', 'odwiedzenie_lokcia', 'lokiec_za_barkiem'];

const pts = (f) => { const s = f.sk; return [s.pelvis, s.head, s.shoulderC, s.spineMid, ...['R', 'L'].flatMap((k) => [s.legs[k].knee, s.legs[k].ankle, s.legs[k].heel, s.legs[k].toe, s.arms[k].elbow, s.arms[k].grip])]; };
const maxPrzem = (a, b) => Math.max(...a.map((p, i) => dist3(p, b[i])));
const siatka = (poza, n = 20) => [...new Set([...Array.from({ length: n + 1 }, (_, i) => i / n), ...poza.klatki.map((k) => k.u)])].sort((a, b) => a - b);

/** 1. Błąd postawy (nie błąd zakresu) jest widoczny w KAŻDEJ klatce kluczowej, także w u = 0; rząd błędu różni się od poprawnego tylko tym błędem (reszta kątów ≤ 4° — pilnuje kontrakt). `postural` = zbiór cue błędów postawy. */
export function bladWidocznyStale(v2, poza, postural) {
  const o = [];
  poza.bledy.forEach((b, j) => { if (!postural.has(b.cue)) return; const nie = [];
    for (const k of poza.klatki) { const d = maxPrzem(pts(v2.keyframeFrame(poza, k.u)), pts(v2.keyframeFrame(poza, k.u, j))); if (d < PROGI.bladMinCm) nie.push(`u = ${k.u}: ${f1(d)} cm`); }
    if (nie.length) o.push(`błąd „${b.cue}” (postawa) jest za słabo widoczny w klatkach: ${nie.join('; ')} — musi różnić się o ≥ ${PROGI.bladMinCm} cm w każdej klatce, także w u = 0 (błąd postawy nie narasta z fazą ruchu)`); });
  return o;
}
/** 2. Nic pod podłogą: oś ramienia i przedramienia minus promień, tułów/miednica/głowa — w żadnej klatce (3D, więc w każdym widoku). */
export function podPodloga(v2, poza) {
  const o = []; const seen = new Set(); const B = v2.BODY, G = v2.GIRTH;
  const ramki = [[undefined]]; poza.bledy.forEach((_, j) => ramki.push([j]));
  for (const [j] of ramki) for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u, j).sk; const et = j === undefined ? '' : `błąd ${poza.bledy[j].cue}, `;
    const spr = (nazwa, y, prog) => { if (y < prog && !seen.has(nazwa + et)) { seen.add(nazwa + et); o.push(`${et}${nazwa} schodzi o ${f1(prog - y)} cm pod podłogę (u = ${u}; próg ${prog} cm)`); } };
    for (const k of ['R', 'L']) { const a = s.arms[k]; spr(`przedramię ${k}`, Math.min(a.elbow[1], a.grip[1]) - 3.3, PROGI.podlogaKonczyna); spr(`ramię ${k}`, Math.min(a.shoulder[1], a.elbow[1]) - G.uarm[0], PROGI.podlogaKonczyna); }
    spr('tułów', Math.min(s.pelvis[1], s.shoulderC[1]) - G.trunkCollide, PROGI.podlogaTulow); spr('głowa', s.head[1] - B.headR, PROGI.podlogaTulow); }
  return o;
}
const bbox = (pts2) => pts2.reduce((b, p) => [Math.min(b[0], p[0]), Math.min(b[1], p[1]), Math.max(b[2], p[0]), Math.max(b[3], p[1])], [Infinity, Infinity, -Infinity, -Infinity]);
const polyPts = (s) => s.pts ?? (s.a && s.b ? [s.a, s.b] : []);
/** 3. Styk z podłogą w rzucie z przodu: stopa stojąca na podłodze (podeszwa ≤ 1 cm) ma kształt sięgający linii podłogi (≤ stykFrontCm), a nie wiszący nad nią. `sole` = {R,L} wysokość podeszwy. */
export function stykZPodlogaPrzod(shapes, sole, u = 0) {
  const o = []; for (const k of ['R', 'L']) { if (sole[k] > 1) continue; const s = shapes.find((x) => x.id === 'foot' + k); if (!s) continue; const low = bbox(polyPts(s))[1]; if (low > PROGI.stykFrontCm) o.push(`stopa ${k} stoi na podłodze, a w rzucie z przodu jej kształt kończy się ${f1(low)} cm nad linią podłogi (u = ${u}; ≤ ${PROGI.stykFrontCm} cm)`); }
  return o;
}
/** 4. Kolejność zasłaniania w rzucie z przodu: sprzęt (skrzynia) bliżej widza niż część ciała, z którą nakłada się w rzucie, jest rysowany PO niej. `layerBody` = 0; głębokość kształtu ciała = z − 1000·warstwa. */
export function zaslanianieSprzetu(shapes, boxX1) {
  const o = []; const boxes = shapes.filter((s) => s.id === 'box'); const dep = (s) => s.z; if (!boxes.length) return o;
  for (const bx of boxes) { const bb = bbox(polyPts(bx)); for (const s of shapes) { if (s === bx || !/^(foot|shank|thigh|farm|uarm|torso|shoes?)/.test(s.id ?? '')) continue; const sb = bbox(polyPts(s)); if (sb[2] < bb[0] || sb[0] > bb[2] || sb[3] < bb[1] || sb[1] > bb[3]) continue;
      if (dep(s) < boxX1 && dep(s) >= -500 && dep(bx) < dep(s)) o.push(`„${s.id}” jest dalej od widza niż skrzynia (głębokość ${f1(dep(s))} < ${f1(boxX1)}), ale narysowana przed nią — skrzynia ma ją zasłaniać`); } }
  return [...new Set(o)];
}
/** 5. Ręce leżące wzdłuż ciała (leżenie na plecach): łokieć nie wyżej niż bark (+margines), dłoń blisko podłogi — w KAŻDEJ klatce. */
export function receWzdluzCiala(v2, poza) {
  const o = []; const P = PROGI.receWzdluz; for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; for (const k of ['R', 'L']) { const a = s.arms[k];
    if (a.elbow[1] > s.shoulderC[1] + P.lokiecNadBarkiemCm) { o.push(`łokieć ${k} (y = ${f1(a.elbow[1])}) jest ${f1(a.elbow[1] - s.shoulderC[1])} cm nad barkiem (u = ${u}) — leżące ręce wzdłuż ciała mają łokieć przy podłodze`); return o; }
    if (a.grip[1] > P.dlonMaxY) { o.push(`dłoń ${k} jest na y = ${f1(a.grip[1])} cm (u = ${u}; ≤ ${P.dlonMaxY}) — ręka wzdłuż ciała leży przy podłodze`); return o; } } }
  return o;
}
/** 6. Kolejne klatki kluczowe różnią się (≥ rozneKlatkiCm w którymś punkcie); ćwiczenie izometryczne ma najwyżej statyczneMaxKlatek klatek. */
export function klatkiRozne(v2, poza, izometryczne) {
  const o = []; if (izometryczne) { if (poza.klatki.length > PROGI.statyczneMaxKlatek) o.push(`ćwiczenie izometryczne ma ${poza.klatki.length} klatek, a ma najwyżej ${PROGI.statyczneMaxKlatek} (poza statyczna: jedna klatka zamiast kopii)`); return o; }
  for (let i = 1; i < poza.klatki.length; i++) { const d = maxPrzem(pts(v2.keyframeFrame(poza, poza.klatki[i - 1].u)), pts(v2.keyframeFrame(poza, poza.klatki[i].u))); if (d < PROGI.rozneKlatkiCm) o.push(`klatki ${i - 1} i ${i} (u = ${poza.klatki[i - 1].u} i ${poza.klatki[i].u}) różnią się tylko o ${f1(d)} cm (≥ ${PROGI.rozneKlatkiCm}) — zbędna kopia klatki albo brak ruchu`); }
  return o;
}
/** 7. Sprzęt rozpoznawczy obecny w pozie: ćwiczenia „Suspended …” muszą mieć w sprzecie zawieszenie (taśmy), inaczej wyjątek. */
export function sprzetRozpoznawczy(poza) {
  if (!WYMAGA_PODWIESZENIA.test(poza.cwiczenie)) return [];
  return poza.sprzet.some((g) => g.rodzaj === 'zawieszenie') ? [] : [`ćwiczenie „${poza.cwiczenie}” wymaga zawieszenia (taśm) w sprzęcie, a ma: ${poza.sprzet.map((g) => g.rodzaj).join(', ')} — bez taśm jest nierozpoznawalne (do czasu rodzaju „zawieszenie” w kontrakcie: wyjątek)`];
}
/** 8. Podpór na jednej ręce: rozstaw kostek ≥ podstawaMinCm w każdej klatce (stabilność). */
export function podstawaSzeroka(poza) {
  return poza.klatki.flatMap((k) => { const d = Math.abs(k.nogi.R.kostka[2] - k.nogi.L.kostka[2]); return d < PROGI.podstawaMinCm ? [`rozstaw kostek ${f1(d)} cm (u = ${k.u}), a ma ≥ ${PROGI.podstawaMinCm} cm — podpór na jednej ręce wymaga szerokiej podstawy`] : []; });
}
/** 9. Szyja neutralna w podporze: kąt osi głowy względem osi tułowia ≤ szyjaMaxDeg. */
export function szyjaNeutralna(v2, poza) {
  const o = []; for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const dot = s.up[0] * s.headUp[0] + s.up[1] * s.headUp[1] + s.up[2] * s.headUp[2]; const a = (Math.acos(Math.max(-1, Math.min(1, dot))) * 180) / Math.PI; if (a > PROGI.szyjaMaxDeg) { o.push(`kąt głowa–tułów ${f1(a)}° w u = ${u}, a ma ≤ ${PROGI.szyjaMaxDeg}° (szyja nie w przeproście)`); break; } }
  return o;
}
/** 10. Etykieta błędu: każdy identyfikator błędu w pozie ma opis w tekstach wskazówek (żeby recenzent i manifest wiedziały, jaki błąd widzą). `teksty` = pl.json. */
export function etykietaBledu(poza, teksty) { return poza.bledy.filter((b) => !teksty[b.cue]).map((b) => `błąd „${b.cue}” nie ma opisu w lib/cues/text/pl.json — manifest nie powie, jaki błąd pokazuje`); }
/** 11. Odwiedzenie łokcia (kąt ramię–płaszczyzna strzałkowa tułowia przy największym zgięciu łokcia) ≤ próg wariantu: łokcie nie w literę T. */
export function odwiedzenieLokcia(v2, poza) {
  const lim = ODWIEDZENIE[poza.cwiczenie] ?? ODWIEDZENIE.domyslnie; let best = null; for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const e = (v2.jointAngles(s, 'R').elbow + v2.jointAngles(s, 'L').elbow) / 2; if (!best || e > best.e) best = { e, s, u }; }
  const o = []; for (const k of ['R', 'L']) { const a = v2.jointAngles(best.s, k).shAbd; if (a > lim) o.push(`odwiedzenie ramienia ${k} przy największym zgięciu łokcia (u = ${best.u}) to ${f1(a)}°, a ma ≤ ${lim}° (łokcie bliżej tułowia, nie w literę T)`); }
  return o;
}
/** 12. Wariant wąski/diamentowy: przy największym zgięciu łokieć leży w rzucie bocznym ≥ N cm za barkiem (łokieć w tył). Kierunek „w tył” = przeciwny do przodu tułowia (do głowy). */
export function lokiecZaBarkiem(v2, poza) {
  const need = LOKIEC_ZA_BARKIEM[poza.cwiczenie]; if (need === undefined) return []; let best = null; for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const e = (v2.jointAngles(s, 'R').elbow + v2.jointAngles(s, 'L').elbow) / 2; if (!best || e > best.e) best = { e, s, u }; }
  const s = best.s; const ax = [s.shoulderC[0] - s.pelvis[0], s.shoulderC[1] - s.pelvis[1]]; const l = Math.hypot(...ax); const o = [];
  for (const k of ['R', 'L']) { const el = s.arms[k].elbow; const za = -((el[0] - s.shoulderC[0]) * ax[0] + (el[1] - s.shoulderC[1]) * ax[1]) / l; if (za < need) o.push(`łokieć ${k} jest ${f1(za)} cm za barkiem wzdłuż tułowia (u = ${best.u}), a ma ≥ ${need} cm (łokcie wzdłuż żeber, do tyłu)`); }
  return o;
}

/** Wszystkie reguły dla pozy (waliduj): [{ kod: 'jakosc', regula, szczegol }]. `ctx` = { v2, rodzina, cwiczenie, postural:Set, izometryczne, teksty }. */
export function sprawdzJakosc(poza, ctx) {
  const { v2, rodzina, cwiczenie, postural, izometryczne, teksty } = ctx; const out = []; const dodaj = (regula, lista) => lista.forEach((szczegol) => out.push({ kod: 'jakosc', regula, szczegol: `${regula}: ${szczegol}` }));
  dodaj('blad_widoczny_stale', bladWidocznyStale(v2, poza, postural)); dodaj('pod_podloga', podPodloga(v2, poza));
  const front = poza.klatki.flatMap((k) => { const f = v2.keyframeFrame(poza, k.u); const sole = { R: Math.min(f.sk.legs.R.heel[1], f.sk.legs.R.toe[1]), L: Math.min(f.sk.legs.L.heel[1], f.sk.legs.L.toe[1]) }; const sh = v2.dataShapes(poza, k.u, 'front'); return stykZPodlogaPrzod(sh, sole, k.u); });
  dodaj('styk_z_podloga_przod', [...new Set(front)].slice(0, 3));
  const box = poza.sprzet.filter((g) => g.rodzaj === 'skrzynia'); if (box.length) dodaj('zaslanianie_sprzetu', zaslanianieSprzetu(v2.dataShapes(poza, 0, 'front'), Math.max(...box.map((g) => g.x1 ?? 0))));
  if (RECE_WZDLUZ.includes(cwiczenie)) dodaj('rece_wzdluz_ciala', receWzdluzCiala(v2, poza));
  dodaj('klatki_rozne', klatkiRozne(v2, poza, izometryczne)); dodaj('sprzet_rozpoznawczy', sprzetRozpoznawczy(poza));
  if (PODSTAWA_SZEROKA.includes(cwiczenie)) dodaj('podstawa_szeroka', podstawaSzeroka(poza));
  if (rodzina === 'pushup_plank') { dodaj('szyja_neutralna', szyjaNeutralna(v2, poza)); if (/Push[- ]?Up|Inverted Row/.test(cwiczenie)) { dodaj('odwiedzenie_lokcia', odwiedzenieLokcia(v2, poza)); dodaj('lokiec_za_barkiem', lokiecZaBarkiem(v2, poza)); } }
  dodaj('etykieta_bledu', etykietaBledu(poza, teksty ?? {}));
  return out;
}
export const wczytajTeksty = (root = ROOT) => { const p = path.join(root, 'lib/cues/text/pl.json'); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {}; };
