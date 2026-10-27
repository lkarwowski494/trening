/*
 * Reguły ruchu z niezależnej recenzji póz mobilności (27.10.2026, recenzja „mobilność” w docs/przekazanie): R1–R6 (runda 1), R6b, R6c, R7, R8 (runda 3: stopy/dłonie zawsze w podparciu, brak kroku wstecz, chwyt kostki w rozciąganiu czworogłowego, łokcie przy ścianie), sprawdzenia geometrii, które na starych pozach były czerwone
 * (Standing Gastrocnemius, Wall Calf, Seated Calf, Cat-Cow, Child's Pose, Chin To Chest, Overhead Triceps, Side-Lying Quad; Inchworm: wyjątek bez animacji od 27.10.2026); R3 ma progi ze źródła (nie z granicy modelu), a dla „dłoni” podparcie = środek dłoni ≤ 4 cm nad podłogą, uruchamiane na WSZYSTKICH pozach z danych
 * (lib/figures/v2/poses/*.json). Rodziny mobilności muszą mieć 0 trafień; pozostałe rodziny mają zapadkę (TRAFIENIA_POZA_MOBILNOSCIA): lista znanych trafień nie może rosnąć,
 * a każde trafienie jest opisane jako prawdziwe (poza do poprawy w swojej rodzinie) albo fałszywe (reguła nie dotyczy tej pozy — ruch dynamiczny, inny rodzaj ćwiczenia).
 * Progi to KONWENCJA RYSUNKU (uproszczenie ilustracyjne), nie twierdzenia merytoryczne. Pozy do testu można podmienić zmienną POZY_DIR (np. stare pozy z gita — dowód, że reguły są czerwone).
 */
import fs from 'node:fs';
import path from 'node:path';
import { keyframeFrame, jointAngles, GIRTH, ISOMETRIC } from '@/lib/figures/v2';
import { metricFor } from '@/lib/seed';
import { EN } from '@/lib/i18n.en';
import { PHASES_BY_EXERCISE } from '@/lib/figures/v2/poseData';
import { MUSCLE_DATA } from '@/lib/figures/v2/muscles.generated';
import type { V3 } from '@/lib/figures/v2/math';

const DIR = process.env.POZY_DIR ?? path.resolve(__dirname, '../lib/figures/v2/poses');
const MOB = ['mobility_stand', 'mobility_floor'];
type Poza = { cwiczenie: string; rodzina: string; klatki: { u: number; zgiecieKregoslupa?: number; pochylenieTulowia?: number; pochylenieGlowy?: number }[]; sprzet: unknown[]; bledy: unknown[] };
const wczytaj = (): Poza[] => fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).flatMap((f) => Object.values(JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')).cwiczenia as Record<string, Poza>));
const sk = (p: Poza, u: number) => keyframeFrame(p as never, u).sk;
const dist = (a: V3, b: V3): number => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const siatka = (n: number): number[] => Array.from({ length: n + 1 }, (_, i) => i / n);
const statyczna = (p: Poza): boolean => p.klatki.length === 2 && JSON.stringify({ ...p.klatki[0], u: 0 }) === JSON.stringify({ ...p.klatki[1], u: 0 });

export const PROGI = {
  kostkaStojacaDeg: 20, /* R1: rozciąganie łydki stojąc: tylna (rozciągana) noga: kostka ≥ tyle, pięta na podłodze */
  kostkaSiedzacaDeg: 0, /* R1: siad: stopa co najmniej prostopadła do goleni (maks. podbicie modelu to 90°, więc większego zgięcia grzbietowego nie da się pokazać) */
  piętaNaPodlodzeCm: 1.5,
  kregoslupZmianaDeg: 10, /* R2: zmiana zgięcia kręgosłupa uznawana za ruch „koci grzbiet ↔ krowa” */
  miednicaPietaMaxCm: 13, /* R3: środek miednicy najwyżej tyle od pięty w pozie dziecka = styk (ACE #227: „bringing your glutes to your heels”; promień miednicy 9,5 cm + ok. 3,5 cm pięty). Próg wynika ze źródła, nie z granicy modelu: gdy model nie pozwala, poza dostaje wyjątek zakresu (zakres_wyjatki) albo wyjątek bez animacji, a nie wyższy próg */
  biodroDzieckoMinDeg: 110, /* R3: zgięcie biodra w pozie dziecka (tułów złożony na uda) */
  rekaWzdluzCiala: 20, /* R3: dłoń najwyżej tyle cm przed miednicą (ręce wzdłuż ciała, ACE #227 krok 4) */
  lokiecSciana: 45, /* R8: rozciąganie łydki przy ścianie: łokcie zgięte co najmniej tyle stopni (ACE #152 krok 2: „allowing your elbows to bend as you shift your weight forward”) */
  chwytKostkaMaxCm: 8, biodroQuadMaxDeg: 30, /* R7: rozciąganie czworogłowego leżąc na boku: dłoń przy kostce tej samej nogi, udo rozciąganej nogi blisko linii tułowia (ACE #149) */
  glowaPodlogaMaxCm: 5, /* R3: najniższy punkt głowy nad podłogą */
  chwytPrzyLokciuMaxCm: 8, lokiecPrzedTwarzaMaxCm: 8, /* R5 */
  poslizgMaxCm: 2, podparcieYCm: 0.3, dlonPodlogaY: 4, /* R6 (dłoń na podłodze: środek ≤ 4 cm nad nią) */
  zaslonaGlowaCm: 4.75, /* R4: kończyna zasłania głowę, gdy jej krawędź leży bliżej środka głowy niż połowa promienia głowy */
  zaslonaMarginesZ: 3, /* R4: kończyna jest „bliżej kamery”, gdy jej z przewyższa z punktu cechy o tyle */
};

type Trafienie = { regula: string; cwiczenie: string; rodzina: string; szczegol: string };

/** R1: rozciąganie łydki (nazwa): rozciągana noga ma kostkę ≥ próg i piętę na podłodze. */
const R1 = (p: Poza): string[] => {
  if (!/calf stretch|soleus and achilles|gastrocnemius/i.test(p.cwiczenie)) return [];
  const s = sk(p, 0); const stojac = s.pelvis[1] > 50; const prog = stojac ? PROGI.kostkaStojacaDeg : PROGI.kostkaSiedzacaDeg;
  const ok = (['R', 'L'] as const).some((x) => jointAngles(s, x).ankle >= prog && s.legs[x].heel[1] <= PROGI.piętaNaPodlodzeCm);
  return ok ? [] : [`żadna noga nie ma kostki ≥ ${prog}° z piętą na podłodze (kostki ${(['R', 'L'] as const).map((x) => jointAngles(s, x).ankle.toFixed(0)).join('/')}°, pięty y ${(['R', 'L'] as const).map((x) => s.legs[x].heel[1].toFixed(1)).join('/')})`];
};
/** R2: ruch kręgosłupa (zmiana zgięcia ≥ próg) → głowa względem tułowia zmienia się w tę samą stronę (zaokrąglenie = głowa niżej względem tułowia). */
const R2 = (p: Poza): string[] => {
  const a = p.klatki[0], b = p.klatki[p.klatki.length - 1]; const dB = (a.zgiecieKregoslupa ?? 0) - (b.zgiecieKregoslupa ?? 0);
  if (Math.abs(dB) < PROGI.kregoslupZmianaDeg) return [];
  const rel = (k: typeof a): number => (k.pochylenieGlowy ?? 0) - (k.pochylenieTulowia ?? 0);
  const dH = rel(a) - rel(b); /* a → b: zgięcie maleje o dB; głowa względem tułowia powinna maleć razem z nim */
  return Math.sign(dH) === Math.sign(dB) || dH === 0 ? [] : [`zgięcie kręgosłupa ${a.zgiecieKregoslupa}° → ${b.zgiecieKregoslupa}°, głowa względem tułowia ${rel(a).toFixed(0)}° → ${rel(b).toFixed(0)}° (przeciwna faza; brak zmiany głowy względem tułowia = głowa sztywno z tułowiem, bez trafienia)`];
};
/** R3: pozycja odpoczynku „dziecka”: miednica blisko pięt, biodro mocno zgięte, głowa przy podłodze, ręce wzdłuż ciała (krok 4 ACE #227). */
const R3 = (p: Poza): string[] => {
  if (!/child/i.test(p.cwiczenie)) return [];
  const s = sk(p, 0); const d = Math.min(...(['R', 'L'] as const).map((x) => dist(s.pelvis, s.legs[x].heel)));
  const o: string[] = []; if (d > PROGI.miednicaPietaMaxCm) o.push(`miednica ${d.toFixed(1)} cm od pięt (> ${PROGI.miednicaPietaMaxCm})`);
  if (s.head[1] - 9.5 > PROGI.glowaPodlogaMaxCm) o.push(`głowa ${(s.head[1] - 9.5).toFixed(1)} cm nad podłogą (> ${PROGI.glowaPodlogaMaxCm})`);
  const bio = Math.min(...(['R', 'L'] as const).map((x) => jointAngles(s, x).hip)); if (bio < PROGI.biodroDzieckoMinDeg) o.push(`biodro zgięte tylko ${bio.toFixed(0)}° (< ${PROGI.biodroDzieckoMinDeg}°)`);
  for (const x of ['R', 'L'] as const) { const przed = s.arms[x].grip[0] - s.pelvis[0]; if (przed > PROGI.rekaWzdluzCiala) o.push(`dłoń ${x} ${przed.toFixed(0)} cm przed miednicą (> ${PROGI.rekaWzdluzCiala}: ręce nie leżą wzdłuż ciała)`); }
  return o;
};
/** R4: cecha rozpoznawcza widoczna w rzucie z boku (kamera po stronie +z): broda przy skłonie głowy ≥ 25° i (w rozciąganiu czworogłowego) pięta przy kolanie ≥ 110° nie mogą leżeć za bliższą kończyną. */
const zaslania = (s: ReturnType<typeof sk>, P: V3, pomin: string, zapas = 0): string | null => {
  const seg: [string, V3, V3, number][] = [];
  for (const x of ['R', 'L'] as const) { const A = s.arms[x], L = s.legs[x]; seg.push([`ramię ${x}`, A.shoulder, A.elbow, GIRTH.uarm[0]], [`przedramię ${x}`, A.elbow, A.grip, GIRTH.farm[0]], [`udo ${x}`, L.hip, L.knee, GIRTH.thigh[0]], [`goleń ${x}`, L.knee, L.ankle, GIRTH.shank[0]]); }
  for (const [nazwa, a, b, r] of seg) {
    if (nazwa === pomin) continue;
    const ab = [b[0] - a[0], b[1] - a[1]]; const ap = [P[0] - a[0], P[1] - a[1]]; const l2 = ab[0] * ab[0] + ab[1] * ab[1] || 1; const t = Math.max(0, Math.min(1, (ap[0] * ab[0] + ap[1] * ab[1]) / l2));
    const d = Math.hypot(a[0] + t * ab[0] - P[0], a[1] + t * ab[1] - P[1]); const z = a[2] + t * (b[2] - a[2]);
    if (d < r + zapas && z > P[2] + PROGI.zaslonaMarginesZ) return nazwa;
  }
  return null;
};
const R4 = (p: Poza): string[] => {
  const s = sk(p, 0); const o: string[] = [];
  const flex = Math.acos(Math.max(-1, Math.min(1, s.headUp[0] * s.up[0] + s.headUp[1] * s.up[1] + s.headUp[2] * s.up[2]))) * 180 / Math.PI;
  if (flex >= 25) { const z = zaslania(s, s.head as V3, '', PROGI.zaslonaGlowaCm); if (z) o.push(`głowa (broda) zasłonięta w rzucie z boku: ${z}`); }
  for (const x of ['R', 'L'] as const) if (/quad stretch/i.test(p.cwiczenie) && jointAngles(s, x).knee >= 110) { const z = zaslania(s, s.legs[x].heel, `goleń ${x}`); if (z) o.push(`pięta ${x} zasłonięta w rzucie z boku: ${z}`); }
  return o;
};
/** R5: poza statyczna z dwiema rękami nad barkami (rozciąganie z ręką pomocniczą): dłoń pomocnicza przy łokciu rozciąganej ręki (≤ 8 cm), łokieć pomocniczy nie przed twarzą. */
const R5 = (p: Poza): string[] => {
  if (!statyczna(p)) return []; const s = sk(p, 0); if (s.pelvis[1] < 50) return []; /* tylko stanie: leżenie z rękami nad głową to nie rozciąganie z chwytem */ const sy = s.shoulderC[1];
  const rozc = (['R', 'L'] as const).find((x) => s.arms[x].elbow[1] - sy >= 15); if (!rozc) return [];
  const pom = rozc === 'R' ? 'L' : 'R'; if (s.arms[pom].grip[1] < sy + 5) return []; /* druga ręka nie jest uniesiona: brak chwytu pomocniczego */
  const o: string[] = []; const d = dist(s.arms[pom].grip, s.arms[rozc].elbow); if (d > PROGI.chwytPrzyLokciuMaxCm) o.push(`dłoń pomocnicza ${d.toFixed(1)} cm od łokcia rozciąganej ręki (> ${PROGI.chwytPrzyLokciuMaxCm})`);
  const dx = s.arms[pom].elbow[0] - s.head[0]; if (dx > PROGI.lokiecPrzedTwarzaMaxCm) o.push(`łokieć pomocniczy ${dx.toFixed(1)} cm przed osią głowy (> ${PROGI.lokiecPrzedTwarzaMaxCm})`); return o;
};
/** R6: palce stopy w podparciu (y ≤ 0,3 cm) nie ślizgają się po podłodze o więcej niż 2 cm w jednym podparciu (ruch ciągły: siatka 0,005). */
const R6 = (p: Poza): string[] => {
  if (statyczna(p)) return []; const o: string[] = [];
  for (const x of ['R', 'L'] as const) {
    let start: V3 | null = null; let maks = 0;
    for (const u of siatka(200)) { const t = sk(p, u).legs[x].toe; if (t[1] <= PROGI.podparcieYCm) { start = start ?? t; maks = Math.max(maks, Math.hypot(t[0] - start[0], t[2] - start[2])); } else start = null; }
    if (maks > PROGI.poslizgMaxCm) o.push(`palce ${x} ślizgają się o ${maks.toFixed(1)} cm w podparciu (> ${PROGI.poslizgMaxCm})`);
  }
  return o;
};
/** Punkt podparcia kończyny (palce stopy albo środek dłoni): podparcie = palce ≤ 0,3 cm albo środek dłoni ≤ PROGI.dlonPodlogaY nad podłogą (dłoń płasko na podłodze ma środek ≈ 2 cm nad nią). */
const podpora = (p: Poza, rodzaj: 'stopy' | 'dlonie'): { x: number; ruch: [number, boolean][] }[] => (['R', 'L'] as const).map((sd) => {
  const pts = siatka(200).map((u) => { const k = sk(p, u); return rodzaj === 'stopy' ? k.legs[sd].toe : k.arms[sd].grip; });
  const prog = rodzaj === 'stopy' ? PROGI.podparcieYCm : PROGI.dlonPodlogaY; return { x: prog, ruch: pts.map((t) => [t[0], t[1] <= prog] as [number, boolean]) };
});
/** R6b: ruch, w którym kończyny na zmianę odrywają się od podłogi (chód w podporze): w każdej chwili co najmniej jedna stopa (dłoń) w podparciu; nie dotyczy póz, w których żadna kończyna nie ma podparcia (zwis, leżenie z uniesionymi nogami). */
const R6b = (p: Poza): string[] => {
  if (statyczna(p)) return []; const o: string[] = [];
  for (const rodzaj of ['stopy', 'dlonie'] as const) {
    const t = podpora(p, rodzaj); if (!t.some((k) => k.ruch.some((r) => r[1]))) continue; /* żadna kończyna nie dotyka podłogi */
    if (!t.every((k) => k.ruch.some((r) => r[1]))) continue; /* tylko jedna kończyna ma podparcie (ruch jednostronny) */
    const bez = siatka(200).filter((_, i) => !t[0].ruch[i][1] && !t[1].ruch[i][1]); if (bez.length) o.push(`${rodzaj}: obie kończyny nad podłogą w ${bez.length} z 201 chwil (u od ${bez[0].toFixed(2)} do ${bez[bez.length - 1].toFixed(2)})`);
  }
  return o;
};
/** R6c: kroki bez cofania: przy lądowaniu stopa (dłoń) nie ląduje za miejscem, z którego ruch już się posunął (x w kierunku marszu rośnie monotonicznie z tolerancją poślizgu), liczone od u = 0 do u = 1 dla kończyn, które w ruchu przesuwają się o ≥ 5 cm. */
const R6c = (p: Poza): string[] => {
  if (statyczna(p)) return []; const o: string[] = [];
  for (const rodzaj of ['stopy', 'dlonie'] as const) {
    podpora(p, rodzaj).forEach((k, i) => {
      const x = k.ruch.map((r) => r[0]); const net = x[x.length - 1] - x[0]; if (Math.abs(net) < 5) return; const dir = Math.sign(net);
      let naj = -Infinity; let cofniecie = 0; k.ruch.forEach(([xx, naPodlodze]) => { if (!naPodlodze) return; naj = Math.max(naj, dir * xx); cofniecie = Math.max(cofniecie, naj - dir * xx); });
      if (cofniecie > PROGI.poslizgMaxCm) o.push(`${rodzaj} ${['R', 'L'][i]}: lądują ${cofniecie.toFixed(1)} cm za miejscem już zajętym w kierunku ruchu (> ${PROGI.poslizgMaxCm})`);
    });
  }
  return o;
};
/** R7: rozciąganie czworogłowego (pozycja „pięta do pośladka”): dłoń tej samej nogi trzyma kostkę (≤ 8 cm), udo rozciąganej nogi blisko linii tułowia (zgięcie biodra ≤ 30°), bo zgięte biodro osłabia rozciąganie. */
const R7 = (p: Poza): string[] => {
  if (!/quad.* stretch|quadriceps/i.test(p.cwiczenie) || !statyczna(p)) return []; const s = sk(p, 0); const o: string[] = [];
  const nogi = (['R', 'L'] as const).filter((x) => jointAngles(s, x).knee >= 110); if (!nogi.length) return ['żadna noga nie ma kolana zgiętego ≥ 110° (brak pozycji „pięta do pośladka”)'];
  for (const x of nogi) {
    const d = dist(s.arms[x].grip, s.legs[x].ankle); if (d > PROGI.chwytKostkaMaxCm) o.push(`dłoń ${x} ${d.toFixed(1)} cm od kostki (> ${PROGI.chwytKostkaMaxCm})`);
    const b = jointAngles(s, x).hip; if (b > PROGI.biodroQuadMaxDeg) o.push(`biodro ${x} zgięte ${b.toFixed(0)}° (> ${PROGI.biodroQuadMaxDeg}°)`);
  }
  return o;
};
/** R8: rozciąganie łydki przy ścianie (dłonie na ścianie): łokcie zgięte przy przenoszeniu ciężaru do przodu (ACE #152 krok 2), nie ręce proste. */
const R8 = (p: Poza): string[] => {
  if (!/calf stretch|gastrocnemius/i.test(p.cwiczenie) || !(p.sprzet as { rodzaj?: string }[]).some((g) => g.rodzaj === 'sciana')) return [];
  const s = sk(p, 0); const e = Math.min(...(['R', 'L'] as const).map((x) => jointAngles(s, x).elbow)); return e >= PROGI.lokiecSciana ? [] : [`łokcie zgięte tylko ${e.toFixed(0)}° (< ${PROGI.lokiecSciana}°): ręce prawie proste przy ścianie`];
};
export const REGULY: Record<string, (p: Poza) => string[]> = { R1_kostka_lydki: R1, R2_glowa_za_kregoslupem: R2, R3_dziecko_odpoczynek: R3, R4_cecha_widoczna: R4, R5_chwyt_pomocniczy: R5, R6_palce_nie_slizgaja_sie: R6, R6b_zawsze_podparcie: R6b, R6c_bez_cofania: R6c, R7_chwyt_kostki_czworoglowy: R7, R8_lokcie_przy_scianie: R8 };

const wszystkie = (): Trafienie[] => wczytaj().flatMap((p) => Object.entries(REGULY).flatMap(([regula, f]) => f(p).map((szczegol) => ({ regula, cwiczenie: p.cwiczenie, rodzina: p.rodzina, szczegol }))));

/** Znane trafienia poza rodzinami mobilności (zapadka, klucz: reguła|rodzina, wartość: największa liczba ćwiczeń z trafieniem + ocena). PRAWDZIWE = poza do poprawy przez właściciela rodziny (stopa suwa się po podłodze w kroku);
 * FAŁSZYWE = reguła nie dotyczy tego ruchu (noga robocza przy podłodze, przeskok, ruch bez stałego podparcia). Zmiana liczby wymaga świadomej decyzji. */
export const TRAFIENIA_POZA_MOBILNOSCIA: Record<string, { max: number; ocena: string }> = {
  'R6_palce_nie_slizgaja_sie|carry': { max: 7, ocena: 'PRAWDZIWE: marsz z ciężarem — palce suną po podłodze 9–52 cm (stopa „jeździ” zamiast kroków); do poprawy w rodzinie carry' },
  'R6_palce_nie_slizgaja_sie|lunge': { max: 10, ocena: 'PRAWDZIWE: tylna stopa wykroku suwa się 17–93 cm po podłodze; do poprawy w rodzinie lunge' },
  'R6_palce_nie_slizgaja_sie|olympic': { max: 20, ocena: 'BRZEGOWE: przeskok stóp w rwaniu i podrzucie, ślizg 3,8–4,4 cm przy zmianie ustawienia; reguła o progu 2 cm jest dla olympic za ostra' },
  'R6_palce_nie_slizgaja_sie|glute_floor': { max: 3, ocena: 'FAŁSZYWE: noga robocza (kickback) dotyka podłogi palcami w ruchu, to nie podparcie' },
  'R6_palce_nie_slizgaja_sie|hip_abd_add': { max: 1, ocena: 'FAŁSZYWE: noga robocza przy podłodze, nie podparcie' },
  'R6_palce_nie_slizgaja_sie|leg_isolation': { max: 4, ocena: 'FAŁSZYWE: ugięcie nogi (stopa pracująca przy podłodze/podkładce), nie podparcie' },
  'R6_palce_nie_slizgaja_sie|kb_ballistic': { max: 2, ocena: 'BRZEGOWE: przeskok stóp w podrzucie, ślizg 2,7–6,9 cm' },
  'R6_palce_nie_slizgaja_sie|plyo': { max: 2, ocena: 'FAŁSZYWE: skoki — stopy w locie i lądowanie, nie podparcie' },
  'R6_palce_nie_slizgaja_sie|pushup_plank': { max: 1, ocena: 'FAŁSZYWE: ruch nóg w podporze (wspinaczka/przenoszenie), stopa nie jest stałym podparciem' },
  'R6b_zawsze_podparcie|carry': { max: 7, ocena: 'PRAWDZIWE: marsz z ciężarem — obie stopy w powietrzu w 9% ruchu (u 0,15–0,23: podskok zamiast kroku); do poprawy w rodzinie carry razem z R6' },
  'R6b_zawsze_podparcie|pushup_plank': { max: 3, ocena: 'Plank Shoulder Taps: PRAWDZIWE (obie dłonie w powietrzu w 46% ruchu: ręka wraca na podłogę dopiero po zdjęciu drugiej; do poprawy w rodzinie pushup_plank); Plyo Push-Up: FAŁSZYWE (lot dłoni jest istotą ćwiczenia); Standing Barbell Rollout: FAŁSZYWE (palce stoją na granicy progu 0,3 cm, artefakt progu)' },
  'R6b_zawsze_podparcie|olympic': { max: 21, ocena: 'FAŁSZYWE: zarzut, rwanie i podrzut — stopy odrywają się obie przy wyskoku pod sztangą (przeskok jest częścią ruchu)' },
  'R6b_zawsze_podparcie|plyo': { max: 19, ocena: 'FAŁSZYWE: skoki — faza lotu z definicji' },
  'R6b_zawsze_podparcie|sled_throw': { max: 6, ocena: 'FAŁSZYWE: rzuty i uderzenia piłką — wyskok lub wspięcie na palce w rzucie' },
  'R6b_zawsze_podparcie|kb_ballistic': { max: 10, ocena: 'BRZEGOWE: szarpnięcia i wyrzuty ciężarka — stopy odrywają się obie (wyskok lub wspięcie na palce, 40–75% ruchu); nie zbadano, czy lot jest zamierzony' },
  'R6b_zawsze_podparcie|leg_isolation': { max: 2, ocena: 'FAŁSZYWE: Leg Extension i Leg Curl na maszynie — stopy zawieszone w powietrzu cały ruch poza początkiem (nie chód)' },
  'R6b_zawsze_podparcie|core_floor': { max: 1, ocena: 'FAŁSZYWE: Superman — leżenie przodem, ręce i nogi w powietrzu (nie podparcie)' },
  'R6c_bez_cofania|olympic': { max: 3, ocena: 'FAŁSZYWE: Split Clean, Split Snatch i Clean and Jerk — przeskok nóg w rozkrok (jedna stopa do przodu, druga do tyłu), reguła „kierunku marszu” nie dotyczy' },
  'R6c_bez_cofania|plyo': { max: 1, ocena: 'FAŁSZYWE: Alternate Leg Diagonal Bound — skok z lądowaniem na zmianę nóg' },
  'R6_palce_nie_slizgaja_sie|sled_throw': { max: 5, ocena: 'FAŁSZYWE: pchanie sań i rzuty — kroki z poślizgiem są częścią ruchu; wymagają osobnej oceny' },
};

describe('reguły ruchu z recenzji mobilności na wszystkich pozach', () => {
  const trafienia = wszystkie();
  if (process.env.REGULY_RAPORT) fs.writeFileSync(process.env.REGULY_RAPORT, JSON.stringify(trafienia, null, 1));
  test('rodziny mobilności: 0 trafień wszystkich reguł (R1–R8)', () => {
    expect(trafienia.filter((t) => MOB.includes(t.rodzina))).toEqual([]);
  });
  test('pozostałe rodziny: trafienia są znane i opisane (zapadka — liczba ćwiczeń z trafieniem na regułę i rodzinę nie rośnie, nowe pary nie powstają)', () => {
    const grupy: Record<string, Set<string>> = {};
    for (const t of trafienia.filter((x) => !MOB.includes(x.rodzina))) (grupy[`${t.regula}|${t.rodzina}`] ??= new Set()).add(t.cwiczenie);
    for (const [k, v] of Object.entries(grupy)) { expect([k, k in TRAFIENIA_POZA_MOBILNOSCIA]).toEqual([k, true]); expect([k, v.size <= TRAFIENIA_POZA_MOBILNOSCIA[k].max]).toEqual([k, true]); }
  });
  test('reguły są czerwone na starych pozach mobilności (dowód: POZY_DIR wskazuje pliki z c3913afd) — tu: sprawdzenie, że każda reguła ma zastosowanie (≥ 1 poza)', () => {
    for (const [nazwa, f] of Object.entries(REGULY)) {
      const stosuje = wczytaj().some((p) => { try { return f(p).length > 0 || ({ R1_kostka_lydki: /calf|soleus|gastro/i, R2_glowa_za_kregoslupem: /cat-cow/i, R3_dziecko_odpoczynek: /child/i, R4_cecha_widoczna: /chin to chest|side-lying quad/i, R5_chwyt_pomocniczy: /overhead triceps/i, R6_palce_nie_slizgaja_sie: /^$/, R6b_zawsze_podparcie: /^$/, R6c_bez_cofania: /^$/, /* R6–R6c: po usunięciu Inchworm (wyjątek bez animacji, 27.10.2026) żadna poza mobilności ich nie wymaga; reguły ogólne trafiają w pozy innych rodzin (f(p).length > 0) */ R7_chwyt_kostki_czworoglowy: /side-lying quad/i, R8_lokcie_przy_scianie: /wall calf|gastrocnemius/i } as Record<string, RegExp>)[nazwa].test(p.cwiczenie); } catch { return false; } });
      expect([nazwa, stosuje]).toEqual([nazwa, true]);
    }
  });
});

describe('rozciąganie statyczne = poza statyczna (bez pętli i licznika faz)', () => {
  const mob = wczytaj().filter((p) => MOB.includes(p.rodzina));
  test('każda poza z dwóch identycznych klatek jest w ISOMETRIC, a ruchowa (Cat-Cow) nie; zbiór liczy 16 rozciągań + Dead Hang', () => {
    for (const p of mob) expect([p.cwiczenie, ISOMETRIC.has(p.cwiczenie)]).toEqual([p.cwiczenie, statyczna(p)]);
    expect(mob.filter(statyczna).length).toBe(16); expect(ISOMETRIC.size).toBe(17);
  });
  test('pozy statyczne mają w katalogu miarę czasu (utrzymanie), ruchowe — powtórzenia', () => {
    for (const p of mob) expect([p.cwiczenie, metricFor(p.cwiczenie) === 'time']).toEqual([p.cwiczenie, statyczna(p)]);
  });
});

describe('nazwy faz ruchów mobilności (Cat-Cow) — własne klucze t(), nie Opuszczanie/Wstawanie', () => {
  test('wpisy PHASES_BY_EXERCISE: dokładnie Cat-Cow, nazwy różne od istniejących faz siłowych i z tekstem EN w słowniku', () => {
    expect(Object.keys(PHASES_BY_EXERCISE).sort()).toEqual(['Cat-Cow']);
    expect(PHASES_BY_EXERCISE['Cat-Cow']).toEqual({ first: 'Grzbiet w dół', second: 'Koci grzbiet' });
    const silowe = ['Podciąganie', 'Opuszczanie', 'Wypychanie', 'Wstawanie', 'Podnoszenie', 'Prostowanie'];
    for (const n of Object.values(PHASES_BY_EXERCISE)) for (const k of [n.first, n.second]) { expect(silowe).not.toContain(k); expect(typeof EN[k]).toBe('string'); expect(EN[k]).not.toBe(k); }
    expect([EN['Grzbiet w dół'], EN['Koci grzbiet']]).toEqual(['Arching', 'Rounding']);
  });
});

describe('mięśnie karty zgodne z rysunkiem pozy (recenzja mobilności r2: Gastrocnemius, Child\'s Pose)', () => {
  const mob = wczytaj().filter((p) => MOB.includes(p.rodzina));
  const mieśnie = (cw: string): string[] => Object.keys(MUSCLE_DATA[cw]?.load ?? {}).sort();
  test('ćwiczenia o identycznym rysunku mają identyczne mięśnie (Standing Gastrocnemius = Wall Calf)', () => {
    const grupy: Record<string, string[]> = {};
    for (const p of mob) (grupy[JSON.stringify({ k: p.klatki, s: p.sprzet })] ??= []).push(p.cwiczenie);
    const wspolne = Object.values(grupy).filter((g) => g.length > 1); expect(wspolne.length).toBeGreaterThan(0);
    for (const g of wspolne) for (const cw of g) expect([cw, mieśnie(cw)]).toEqual([cw, mieśnie(g[0])]);
    expect(mieśnie('Standing Gastrocnemius Calf Stretch')).toEqual(['calves']);
  });
  test('najszerszy grzbietu (lats) w rozciąganiu wymaga ręki (łokcia) nad barkiem o ≥ 15 cm; Child\'s Pose z rękami wzdłuż ciała go nie ma', () => {
    for (const p of mob) {
      if (!(mieśnie(p.cwiczenie).includes('lats'))) continue; const s = sk(p, 0);
      const wyzej = Math.max(...(['R', 'L'] as const).flatMap((x) => [s.arms[x].grip[1], s.arms[x].elbow[1]])) - s.shoulderC[1];
      expect([p.cwiczenie, wyzej >= 15]).toEqual([p.cwiczenie, true]);
    }
    expect(mieśnie("Child's Pose")).not.toContain('lats');
  });
});
