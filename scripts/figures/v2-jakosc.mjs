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
  wisiCm: 1, /* ćwiczenie na podłodze: najniższy punkt tułowia/miednicy (oś − promień) najwyżej tyle nad podłogą (leżąc i siedząc ciało leży, nie wisi) */
  lokiecPrzedPlecamiMaxCm: 2, /* przyciąganie (wiosłowanie): na końcu łokieć leży najwyżej tyle PRZED płaszczyzną pleców (po stronie klatki/drążka); łokieć ma kończyć przy tułowiu, za linią pleców, nie nad klatką */
  podparcieMarginesCm: 2, /* podpór jednorącz/jednonóż: rzut środka ciężkości leży wewnątrz wielokąta podparcia o co najmniej tyle */
  rzadBleduTolDeg: 15, /* staw spoza obszaru błędu może się różnić od pozy poprawnej najwyżej o tyle (zapas 2 cm w długości nogi w modelu opadania biodra daje ≤ 13°; „wyraźnie ugięte kolana” to ≥ 30°) */
  stykPodparciaCm: 4.5, /* punkt ciała uznany za podparcie, gdy jego (oś) wysokość ≤ tyle: dłoń, stopa, kolano (promień kończyny) */
};
/** Odwiedzenie ramienia widoczne Z PRZODU (stopnie): arcsin(wysunięcie łokcia w bok poza oś barku / długość ramienia), sprawdzane w KAŻDEJ klatce (nie tylko przy największym zgięciu).
 * Konwencja rysunku (nie twierdzenie merytoryczne; do zatwierdzenia przez badacza): NASM (łokcie ok. 45° od tułowia) i ACE (łokcie na boki) rozchodzą się na tym samym szczeblu, a rzut z przodu nie pokazuje głębi,
 * więc 45° czyta się jak litera T (recenzja n2, 26.10.2026: 6 przecieków). Rysujemy ciaśniej: pompka ≤ 30°, wariant wąski ≤ 22°, diamentowa ≤ 25°, szeroka ≤ 70° (jej cechą jest szeroki łokieć), wiosłowanie odwrócone ≤ 60° (tor łokcia pilnuje tor_lokcia_przyciaganie). */
export const ODWIEDZENIE_PRZOD = { domyslnie: 30, 'Push-Up Wide': 70, 'Close-Grip Push-Up': 22, 'Incline Push-Up Close-Grip': 22, 'Diamond Push Up': 25, 'Inverted Row': 60 };
/** Ćwiczenia na podłodze, w których tułów nie leży (czworaki): reguła nic_nie_wisi ich nie obejmuje. */
export const NIE_LEZY = ['Bird Dog'];
/** Ćwiczenia z deklarowanym lotem (ciało oderwane od podłogi z założenia): ćwiczenie → powód. Puste: żadne ćwiczenie na podłodze rodziny core_floor nie ma fazy lotu. */
export const LOT = {};
/** Przyciąganie w poziomie (łokieć kończy za plecami): tylko ćwiczenia z tej listy. */
export const PRZYCIAGANIE = ['Inverted Row'];
/** Podpór jednorącz/jednonóż (stabilność): środek ciężkości nad podparciem. */
export const PODPARCIE_ZMIENNE = ['Single-Arm Push-Up']; /* Plank Shoulder Taps i Mountain Climbers: faza jednej ręki/lotu trwa ułamek ruchu (przybliżenie przejścia) — reguła je mierzy (jakosc-raport), ale ich nie wymusza; powód: ruch dynamiczny, recenzja n2 = OK */
/** Udziały mas segmentów (Dempster; Winter, „Biomechanics and Motor Control of Human Movement”, tab. 4.1 — wartości z pamięci, do potwierdzenia przez badacza; uproszczenie rysunku, nie twierdzenie): głowa 0,081, tułów 0,497, ramię 0,028, przedramię z dłonią 0,022, udo 0,100, goleń 0,0465, stopa 0,0145. */
export const MASY = { glowa: 0.081, tulow: 0.497, ramie: 0.028, przedramie: 0.022, udo: 0.1, golen: 0.0465, stopa: 0.0145 };
/** Dozwolone obszary zmian rzędu błędu według wskazówki: rząd błędu zmienia wyłącznie to, co opisuje jego wskazówka; kąty stawów spoza listy nie mogą się różnić od pozy poprawnej o więcej niż PROGI.rzadBleduTolDeg
 * (etykiety jak `dotyczy`: hip, knee, ankle, elbow, shoulder). Brak wpisu dla wskazówki = brak sprawdzenia. */
export const DOTYCZY_BLEDU = {
  'plank.mis.sag': ['hip', 'shoulder'], /* opadające biodra: kąt biodra i ramienia; kolana, kostki i łokcie bez zmian (poza tolerancją) */
  'push.mis.partial': ['elbow', 'shoulder', 'hip'], /* płytki dół: łokcie i ułożenie tułowia; kolana bez zmian */
  'cobra.mis': ['hip', 'shoulder'], /* przeprost lędźwi */
};
/** Wyjątki per ćwiczenie: w rollout z podparciem na kolanach opadanie miednicy obraca udo wokół kolana na podłodze, więc kąt kolana, kostki i łokcia (chwyt na sztandze) zmienia się z natury błędu. */
export const DOTYCZY_BLEDU_CWICZENIE = { 'Rollout (sztanga)': { 'plank.mis.sag': ['knee', 'ankle', 'elbow'] }, 'Barbell Rollout from Bench': { 'plank.mis.sag': ['knee', 'ankle', 'elbow'] } };
const KAT_STAWU = { hip: 'hip', knee: 'knee', ankle: 'ankle', elbow: 'elbow', shElev: 'shoulder' };
/** Dopuszczalne odwiedzenie ramienia (stopnie) przy największym zgięciu łokcia w pompkach i wiosłowaniu; wariant wąski i diamentowy mają łokcie przy tułowiu. Konwencja rysunku (NASM: ok. 45°, ACE: łokcie na boki → część wspólna). */
export const ODWIEDZENIE = { domyslnie: 60, 'Push-Up Wide': 90, 'Close-Grip Push-Up': 40, 'Incline Push-Up Close-Grip': 40, 'Diamond Push Up': 35 };
export const LOKIEC_ZA_BARKIEM = { 'Close-Grip Push-Up': 6, 'Incline Push-Up Close-Grip': 6, 'Diamond Push Up': 6 }; /* cm za barkiem w rzucie bocznym (łokieć w tył) */
/** Grupy błędów POSTAWY (widoczne w każdej klatce); pozostałe (zakres, tempo, bujanie) narastają z fazą ruchu. */
export const GRUPY_POSTAWY = ['linia', 'przeprost', 'lokcie'];
export const RECE_WZDLUZ = ['Lying Leg Raise', 'Reverse Crunch', 'Leg Pull-In', 'Scissor Kick'];
export const PODSTAWA_SZEROKA = ['Single-Arm Push-Up'];
export const WYMAGA_PODWIESZENIA = /^Suspended /;
export const REGULY_JAKOSCI = ['blad_widoczny_stale', 'pod_podloga', 'styk_z_podloga_przod', 'zaslanianie_sprzetu', 'rece_wzdluz_ciala', 'klatki_rozne', 'sprzet_rozpoznawczy', 'podstawa_szeroka', 'szyja_neutralna', 'etykieta_bledu', 'odwiedzenie_lokcia', 'lokiec_za_barkiem', 'odwiedzenie_lokcia_przod', 'nic_nie_wisi', 'rzad_bledu_dotyczy', 'tor_lokcia_przyciaganie', 'srodek_ciezkosci_podparcie'];
/** Reguły poziomu manifestu podglądu (nie pozy): zgodność manifestu z obrazem i układ podglądu. */
export const REGULY_MANIFESTU = ['manifest_klatki', 'manifest_przyblizenia', 'manifest_opis_bledu', 'podglad_jeden_wiersz'];

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
  for (let i = 1; i < poza.klatki.length; i++) { const d = maxPrzem(pts(v2.keyframeFrame(poza, poza.klatki[i - 1].u)), pts(v2.keyframeFrame(poza, poza.klatki[i].u))); const dObr = Math.max(...['R', 'L'].map((sd) => Math.abs((poza.klatki[i].rece?.[sd]?.obrotPrzedramienia ?? 0) - (poza.klatki[i - 1].rece?.[sd]?.obrotPrzedramienia ?? 0)))); /* czysty obrót przedramienia (pronacja/supinacja) nie przemieszcza punktów szkieletu, ale jest widocznym ruchem */ if (d < PROGI.rozneKlatkiCm && dObr < 5) o.push(`klatki ${i - 1} i ${i} (u = ${poza.klatki[i - 1].u} i ${poza.klatki[i].u}) różnią się tylko o ${f1(d)} cm (≥ ${PROGI.rozneKlatkiCm}) — zbędna kopia klatki albo brak ruchu`); }
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

/** 13. Odwiedzenie łokcia widoczne z przodu w KAŻDEJ klatce (ODWIEDZENIE_PRZOD, per ćwiczenie/wariant): arcsin(wysunięcie łokcia w bok poza oś barku / długość ramienia). Poprzednia reguła (11) ocenia tylko klatkę największego zgięcia. */
export function odwiedzenieLokciaPrzod(v2, poza) {
  const lim = ODWIEDZENIE_PRZOD[poza.cwiczenie] ?? ODWIEDZENIE_PRZOD.domyslnie; let naj = null;
  for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; for (const k of ['R', 'L']) { const a = s.arms[k]; const sg = Math.sign(a.shoulder[2]) || 1; const w = Math.max(0, sg * (a.elbow[2] - a.shoulder[2])); const kat = (Math.asin(Math.min(1, w / (dist3(a.shoulder, a.elbow) || 1))) * 180) / Math.PI; if (!naj || kat > naj.kat) naj = { kat, u, k, w }; } }
  return naj && naj.kat > lim ? [`łokieć ${naj.k} wychodzi w rzucie z przodu ${f1(naj.w)} cm poza oś barku, czyli odwiedzenie ${f1(naj.kat)}° (u = ${naj.u}), a ma ≤ ${lim}° dla „${poza.cwiczenie}” w KAŻDEJ klatce (łokcie nie w literę T)`] : [];
}
/** 14. Nic nie wisi: w ćwiczeniu na podłodze najniższy punkt tułowia/miednicy (oś − promień kolidera) jest najwyżej wisiCm nad podłogą w każdej klatce (leżąc i siedząc ciało leży). */
export function nicNieWisi(v2, poza) {
  const G = v2.GIRTH; for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const nisko = Math.min(s.pelvis[1], s.shoulderC[1]) - G.trunkCollide; if (nisko > PROGI.wisiCm) return [`najniższy punkt tułowia jest ${f1(nisko)} cm nad podłogą (u = ${u}; ≤ ${PROGI.wisiCm} cm) — ciało leży albo siedzi na podłodze, nie wisi w powietrzu`]; }
  return [];
}
/** 15. Rząd błędu zmienia tylko to, co opisuje jego wskazówka: kąty stawów spoza DOTYCZY_BLEDU[cue] różnią się od pozy poprawnej o ≤ rzadBleduTolDeg w każdej klatce (np. „sag” nie zgina kolan). Liczone z kątów, nie z deklaracji `dotyczy` (ta jest wyliczana z tych samych zmian). */
export function rzadBleduDotyczy(v2, poza) {
  const o = [];
  poza.bledy.forEach((b, j) => { const baza = DOTYCZY_BLEDU[b.cue]; if (!baza) return; const dop = new Set([...baza, ...(DOTYCZY_BLEDU_CWICZENIE[poza.cwiczenie]?.[b.cue] ?? [])]); const naj = {};
    for (const u of siatka(poza)) { const a = v2.keyframeFrame(poza, u).sk, c = v2.keyframeFrame(poza, u, j).sk; for (const k of ['R', 'L']) { const x = v2.jointAngles(a, k), y = v2.jointAngles(c, k); for (const [kat, et] of Object.entries(KAT_STAWU)) { if (dop.has(et)) continue; const d = Math.abs(x[kat] - y[kat]); if (d > (naj[et]?.d ?? 0)) naj[et] = { d, u }; } } }
    const zle = Object.entries(naj).filter(([, v]) => v.d > PROGI.rzadBleduTolDeg);
    if (zle.length) o.push(`błąd „${b.cue}” zmienia też: ${zle.map(([et, v]) => `${et} o ${f1(v.d)}° (u = ${v.u})`).join(', ')} (dozwolone: ${[...dop].join(', ')}; tolerancja ${PROGI.rzadBleduTolDeg}°) — rząd błędu ma pokazywać wyłącznie ten jeden błąd`); });
  return o;
}
/** 16. Tor łokcia w przyciąganiu (wiosłowanie odwrócone): w ostatniej klatce łokieć leży najwyżej lokiecPrzedPlecamiMaxCm PRZED płaszczyzną pleców (po stronie klatki, czyli drążka) i nie dalej ku głowie niż bark (kończy przy tułowiu, ku biodrom).
 * Wskazówka: ruch łokcia za linię pleców, mostek do drążka (inv.pull; ExRx BWSupineRow, ACE #84 — por. data/zrodla/figury-sens.json). */
export function torLokciaPrzyciagania(v2, poza) {
  const o = []; const u = poza.klatki[poza.klatki.length - 1].u; const s = v2.keyframeFrame(poza, u).sk;
  for (const k of ['R', 'L']) { const a = s.arms[k]; const d = [a.elbow[0] - a.shoulder[0], a.elbow[1] - a.shoulder[1], a.elbow[2] - a.shoulder[2]]; const przodem = d[0] * s.front[0] + d[1] * s.front[1] + d[2] * s.front[2]; const wBiodra = -(d[0] * s.up[0] + d[1] * s.up[1] + d[2] * s.up[2]);
    if (przodem > PROGI.lokiecPrzedPlecamiMaxCm) o.push(`łokieć ${k} na końcu (u = ${u}) leży ${f1(przodem)} cm PRZED płaszczyzną pleców (po stronie klatki i drążka), a ma ≤ ${PROGI.lokiecPrzedPlecamiMaxCm} cm (łokieć wychodzi za linię pleców, nie przed klatkę)`);
    else if (wBiodra < 0) o.push(`łokieć ${k} na końcu (u = ${u}) leży ${f1(-wBiodra)} cm bliżej głowy niż bark, a ma być przy tułowiu (ku biodrom)`); }
  return o;
}
const srodek = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
/** Środek ciężkości ciała (3D) z udziałów mas segmentów (MASY); segment w połowie osi. */
export function srodekCiezkosci(s) {
  const m = MASY; const czesci = [[m.tulow, srodek(s.pelvis, s.shoulderC)], [m.glowa, s.head]];
  for (const k of ['R', 'L']) { const a = s.arms[k], l = s.legs[k]; czesci.push([m.ramie, srodek(a.shoulder, a.elbow)], [m.przedramie, srodek(a.elbow, a.grip)], [m.udo, srodek(l.hip, l.knee)], [m.golen, srodek(l.knee, l.ankle)], [m.stopa, srodek(l.heel, l.toe)]); }
  const M = czesci.reduce((t, c) => t + c[0], 0); return [0, 1, 2].map((i) => czesci.reduce((t, c) => t + c[0] * c[1][i], 0) / M);
}
/** Wypukła otoczka punktów (x, z), przeciwnie do wskazówek zegara. */
export function otoczka(pts2) {
  const p = [...new Map(pts2.map((q) => [q.join(','), q])).values()].sort((a, b) => a[0] - b[0] || a[1] - b[1]); if (p.length < 3) return p;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); const dol = [], gora = [];
  for (const q of p) { while (dol.length >= 2 && cr(dol[dol.length - 2], dol[dol.length - 1], q) <= 0) dol.pop(); dol.push(q); }
  for (const q of [...p].reverse()) { while (gora.length >= 2 && cr(gora[gora.length - 2], gora[gora.length - 1], q) <= 0) gora.pop(); gora.push(q); }
  return [...dol.slice(0, -1), ...gora.slice(0, -1)];
}
/** Punkty podparcia w płaszczyźnie podłogi (x, z): dłonie i stopy (palce, pięta) dotykające podłogi (oś ≤ stykPodparciaCm). */
export function punktyPodparcia(s) {
  const o = []; for (const k of ['R', 'L']) { const g = s.arms[k].grip; if (g[1] <= PROGI.stykPodparciaCm) o.push([g[0], g[2]]); for (const q of [s.legs[k].toe, s.legs[k].heel]) if (q[1] <= PROGI.stykPodparciaCm / 2) o.push([q[0], q[2]]); }
  return o;
}
/** 17. Środek ciężkości nad podparciem: rzut środka ciężkości na podłogę leży wewnątrz wielokąta podparcia (≥ podparcieMarginesCm od krawędzi) w każdej klatce — podpór jednorącz/jednonóż. */
export function srodekCiezkosciNadPodparciem(v2, poza) {
  for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const c = srodekCiezkosci(s); const h = otoczka(punktyPodparcia(s));
    if (h.length < 3) return [`podparcie w u = ${u} nie tworzy wielokąta (${h.length} p.) — środek ciężkości nie ma nad czym się znaleźć`];
    let min = Infinity; for (let i = 0; i < h.length; i++) { const a = h[i], b = h[(i + 1) % h.length]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; min = Math.min(min, ((b[0] - a[0]) * (c[2] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) / l); }
    if (min < PROGI.podparcieMarginesCm) return [`rzut środka ciężkości (x = ${f1(c[0])}, z = ${f1(c[2])}) leży ${f1(min)} cm od krawędzi wielokąta podparcia (u = ${u}; ≥ ${PROGI.podparcieMarginesCm} cm wewnątrz) — tułów wypada poza podparcie`]; }
  return [];
}

/** 18. Zgodność manifestu podglądu z obrazem (poziom manifestu, nie pozy): (a) liczba i położenie klatek na obrazie = klatki_u; (b) ćwiczenie z przybliżeń jest w zestawie albo w wyjątkach z powodem;
 * (c) każdy identyfikator błędu (rząd w pozie i wskazówki katalogu) ma opis w tekstach albo jawny wyjątek z powodem (`wyjatkiOpisu`: id → powód). Zwraca [{ regula, szczegol }]. */
export function zgodnoscManifestu(manifest, teksty, wyjatkiOpisu = {}) {
  const out = []; const dodaj = (regula, szczegol) => out.push({ regula, szczegol }); const cw = manifest.cwiczenia ?? [];
  for (const c of cw) {
    if (!Array.isArray(c.klatki_na_obrazie)) dodaj('manifest_klatki', `${c.cwiczenie}: manifest nie podaje klatek na obrazie (klatki_na_obrazie) — nie da się sprawdzić zgodności z klatki_u`);
    else if (JSON.stringify(c.klatki_na_obrazie) !== JSON.stringify(c.klatki_u)) dodaj('manifest_klatki', `${c.cwiczenie}: obraz ma ${c.klatki_na_obrazie.length} klatek (${c.klatki_na_obrazie.join(', ')}), a klatki_u ma ${c.klatki_u.length} (${c.klatki_u.join(', ')})`);
    for (const id of new Set([...(c.bledy_wskazowki_id ?? []), ...(c.bledy_w_pozie ?? [])])) if (!teksty[id] && !wyjatkiOpisu[id]) dodaj('manifest_opis_bledu', `${c.cwiczenie}: błąd „${id}” nie ma opisu w lib/cues/text/pl.json ani wyjątku z powodem`);
  }
  for (const [id, powod] of Object.entries(wyjatkiOpisu)) if (!String(powod ?? '').trim()) dodaj('manifest_opis_bledu', `wyjątek opisu „${id}” bez powodu`);
  for (const nazwa of Object.keys(manifest.przyblizenia ?? {})) if (!cw.some((c) => c.cwiczenie === nazwa) && !String(manifest.wyjatki?.[nazwa] ?? '').trim()) dodaj('manifest_przyblizenia', `„${nazwa}” jest w przybliżeniach, a nie ma go w zestawie ani w wyjątkach z powodem — wypada z pomiaru po cichu`);
  for (const [nazwa, powod] of Object.entries(manifest.wyjatki ?? {})) if (!String(powod ?? '').trim()) dodaj('manifest_przyblizenia', `wyjątek „${nazwa}” bez powodu`);
  return out;
}
/** 19. Układ podglądu: wszystkie komórki jednego wiersza (poprawna poza / błąd) leżą w jednej linii — mają wspólną dolną krawędź (wiersz wyrównany do dołu; zawinięta komórka ma dolną krawędź o wysokość wiersza niżej). `wiersze` = [{ etykieta, dolne: [px…] }] (pomiar z przeglądarki). */
export function wierszeWJednejLinii(wiersze, tolPx = 2) {
  return wiersze.flatMap((w) => { const t = w.dolne; const rozrzut = t.length ? Math.max(...t) - Math.min(...t) : 0; return rozrzut > tolPx ? [`wiersz „${w.etykieta}”: komórki mają różne położenie pionowe (rozrzut ${f1(rozrzut)} px) — klatki jednego rzędu muszą leżeć w jednym wierszu`] : []; });
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
  if (rodzina === 'pushup_plank' && /Push[- ]?Up|Inverted Row/.test(cwiczenie)) dodaj('odwiedzenie_lokcia_przod', odwiedzenieLokciaPrzod(v2, poza));
  if (rodzina === 'core_floor' && !NIE_LEZY.includes(cwiczenie) && !(cwiczenie in LOT)) dodaj('nic_nie_wisi', nicNieWisi(v2, poza));
  dodaj('rzad_bledu_dotyczy', rzadBleduDotyczy(v2, poza));
  if (PRZYCIAGANIE.includes(cwiczenie)) dodaj('tor_lokcia_przyciaganie', torLokciaPrzyciagania(v2, poza));
  if (PODPARCIE_ZMIENNE.includes(cwiczenie)) dodaj('srodek_ciezkosci_podparcie', srodekCiezkosciNadPodparciem(v2, poza));
  return out;
}
export const wczytajTeksty = (root = ROOT) => { const p = path.join(root, 'lib/cues/text/pl.json'); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {}; };
