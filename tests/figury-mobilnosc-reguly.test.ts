/*
 * Reguły ruchu z niezależnej recenzji póz mobilności (27.10.2026, recenzja „mobilność” w docs/przekazanie): R1–R6 (runda 1), R6b, R6c, R7, R8 (runda 3: stopy/dłonie zawsze w podparciu, brak kroku wstecz, chwyt kostki w rozciąganiu czworogłowego, łokcie przy ścianie), sprawdzenia geometrii, które na starych pozach były czerwone
 * (Standing Gastrocnemius, Wall Calf, Seated Calf, Cat-Cow, Child's Pose, Chin To Chest, Overhead Triceps, Side-Lying Quad; Inchworm: wyjątek bez animacji od 27.10.2026); R3 ma progi ze źródła (nie z granicy modelu), a dla „dłoni” podparcie = środek dłoni ≤ 4 cm nad podłogą, uruchamiane na WSZYSTKICH pozach z danych
 * (lib/figures/v2/poses/*.json). Rodziny mobilności muszą mieć 0 trafień; pozostałe rodziny mają zapadkę (TRAFIENIA_POZA_MOBILNOSCIA): lista znanych trafień nie może rosnąć,
 * a każde trafienie jest opisane jako prawdziwe (poza do poprawy w swojej rodzinie) albo fałszywe (reguła nie dotyczy tej pozy — ruch dynamiczny, inny rodzaj ćwiczenia).
 * Progi to KONWENCJA RYSUNKU (uproszczenie ilustracyjne), nie twierdzenia merytoryczne. Pozy do testu można podmienić zmienną POZY_DIR (np. stare pozy z gita — dowód, że reguły są czerwone).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
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
  'R6_palce_nie_slizgaja_sie|kb_ballistic': { max: 4, ocena: 'BRZEGOWE: przeskok stóp w podrzucie, ślizg 2,7–6,9 cm; dodano po scaleniu z integracją (28.10.2026): Kettlebell Sumo High Pull i One-Arm Kettlebell Clean and Jerk / Split Jerk / Swings — ślizg stóp 2,7–7,0 cm przy wymachu i przeskoku, ta sama ocena brzegowa' },
  'R6_palce_nie_slizgaja_sie|plyo': { max: 3, ocena: 'FAŁSZYWE: skoki — stopy w locie i lądowanie, nie podparcie; Lateral Bound i Side to Side Box Shuffle — skoki w bok i przeskoki, stopa nie jest stałym podparciem' },
  'R6_palce_nie_slizgaja_sie|pushup_plank': { max: 1, ocena: 'FAŁSZYWE: ruch nóg w podporze (wspinaczka/przenoszenie), stopa nie jest stałym podparciem' },
  'R6b_zawsze_podparcie|carry': { max: 7, ocena: 'PRAWDZIWE: marsz z ciężarem — obie stopy w powietrzu w 9% ruchu (u 0,15–0,23: podskok zamiast kroku); do poprawy w rodzinie carry razem z R6' },
  'R6b_zawsze_podparcie|pushup_plank': { max: 3, ocena: 'Plank Shoulder Taps: PRAWDZIWE (obie dłonie w powietrzu w 46% ruchu: ręka wraca na podłogę dopiero po zdjęciu drugiej; do poprawy w rodzinie pushup_plank); Plyo Push-Up: FAŁSZYWE (lot dłoni jest istotą ćwiczenia); Standing Barbell Rollout: FAŁSZYWE (palce stoją na granicy progu 0,3 cm, artefakt progu)' },
  'R6b_zawsze_podparcie|olympic': { max: 21, ocena: 'FAŁSZYWE: zarzut, rwanie i podrzut — stopy odrywają się obie przy wyskoku pod sztangą (przeskok jest częścią ruchu)' },
  'R6b_zawsze_podparcie|plyo': { max: 19, ocena: 'FAŁSZYWE: skoki — faza lotu z definicji' },
  'R6b_zawsze_podparcie|sled_throw': { max: 6, ocena: 'FAŁSZYWE: rzuty i uderzenia piłką — wyskok lub wspięcie na palce w rzucie' },
  'R6b_zawsze_podparcie|kb_ballistic': { max: 10, ocena: 'BRZEGOWE: szarpnięcia i wyrzuty ciężarka — stopy odrywają się obie (wyskok lub wspięcie na palce, 40–75% ruchu); nie zbadano, czy lot jest zamierzony' },
  'R6b_zawsze_podparcie|leg_isolation': { max: 2, ocena: 'FAŁSZYWE: Leg Extension i Leg Curl na maszynie — stopy zawieszone w powietrzu cały ruch poza początkiem (nie chód)' },
  'R6b_zawsze_podparcie|core_floor': { max: 2, ocena: 'FAŁSZYWE: Superman — leżenie przodem, ręce i nogi w powietrzu (nie podparcie); Alternate Heel Touchers — leżenie na plecach, dłonie sięgają pięt w powietrzu, łopatki i stopy na podłodze (dłonie nie są podparciem)' },
  'R6c_bez_cofania|olympic': { max: 3, ocena: 'FAŁSZYWE: Split Clean, Split Snatch i Clean and Jerk — przeskok nóg w rozkrok (jedna stopa do przodu, druga do tyłu), reguła „kierunku marszu” nie dotyczy' },
  'R6c_bez_cofania|core_floor': { max: 1, ocena: 'FAŁSZYWE: Alternate Heel Touchers — dłonie sięgają pięt na przemian (ruch rąk, nie krok): reguła „kierunku marszu” nie dotyczy' },
  'R5_chwyt_pomocniczy|pull_up': { max: 1, ocena: 'FAŁSZYWE: Dead Hang — zwis na drążku obiema rękami; reguła „chwyt pomocniczy” dotyczy rozciągania z ręką pomagającą (ACE), nie zwisu' },
  'R6c_bez_cofania|plyo': { max: 1, ocena: 'FAŁSZYWE: Alternate Leg Diagonal Bound — skok z lądowaniem na zmianę nóg' },
  'R6_palce_nie_slizgaja_sie|sled_throw': { max: 7, ocena: 'FAŁSZYWE: pchanie sań i rzuty — kroki z poślizgiem są częścią ruchu; wymagają osobnej oceny; rzuty piłką (Slam, Scoop, Backward, Standing Two-Arm Overhead) — stopy przestawiają się w zamachu 2,6–8,9 cm; Sled Push i Sled Drag — krok z sanią, ślizg 2,9–3,0 cm (BRZEGOWE, próg 2 cm dla marszu z oporem za ostry)' },
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

/* ---------- recenzja mobilności r4 (28.10.2026): R9 „ciało leży” (z obrysu), R10 „część ciała nie znika”, górny próg „lekko” (kolano) ---------- */
const ROOT = path.resolve(__dirname, '..');
const SKAN = `
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { loadV2 } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-build.mjs'))};
import * as J from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-jakosc.mjs'))};
import { regulyDla } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-sens.mjs'))};
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'skan-mob-')); const { v2 } = loadV2(dir); const D = ${JSON.stringify(DIR)};
const out = { lezy: [], znika: [], lekko: [], poz: 0, lezacych: 0 };
for (const f of fs.readdirSync(D).filter((x) => x.endsWith('.json'))) {
  const d = JSON.parse(fs.readFileSync(path.join(D, f), 'utf8'));
  for (const [cw, p] of Object.entries(d.cwiczenia)) { out.poz++; if (J.lezyAlboSiedzi(v2, p)) out.lezacych++;
    const a = J.cialoLezy(v2, p, { glowa: p.rodzina === 'mobility_floor' }); if (a.length) out.lezy.push({ rodzina: p.rodzina, cwiczenie: cw, opisy: a }); /* L3 (recenzja r5): reguła na pozach WSZYSTKICH rodzin: obrys tułowia i miednicy, kończyny leżące (L1, L2); brak podparcia głowy tylko w mobility_floor (w ćwiczeniach brzucha głowa unosi się z definicji ruchu) */
    const b = J.czescCialaNieZnika(v2, p); if (b.length) out.znika.push({ rodzina: p.rodzina, cwiczenie: cw, opisy: b });
    const rl = regulyDla(p.rodzina, cw).filter((r) => /lekko/i.test(r.id) && ['kolana_max', 'kolano_zakres_ruch'].includes(r.typ));
    if (rl.length) { let mx = 0; const us = new Set([...Array.from({ length: 41 }, (_, i) => i / 40), ...p.klatki.map((k) => k.u)]);
      for (const u of us) { const sk = v2.keyframeFrame(p, u).sk; for (const s of ['R', 'L']) mx = Math.max(mx, v2.jointAngles(sk, s).knee); }
      out.lekko.push({ rodzina: p.rodzina, cwiczenie: cw, reguly: rl.map((r) => r.id), max: Math.round(mx * 10) / 10 }); } }
}
const dk = (x) => { const q = x.k === 'poly' ? x.pts : x.k === 'ellipse' ? v2.ellipsePts(x.c, x.rx, x.ry, x.rot) : x.k === 'circle' ? [[x.c[0], x.c[1] - x.r]] : null; return q ? Math.min(...q.map((z) => z[1])) : null; };
const sq = JSON.parse(fs.readFileSync(path.join(D, 'mobility_floor.json'), 'utf8')).cwiczenia['Side-Lying Quad Stretch'];
out.sl = {}; for (const u of [0, 1]) { const sh = v2.dataShapes(sq, u, 'side'); const nis = (re) => { const l = sh.filter((x) => re.test(x.id ?? '')).map(dk).filter((y) => y !== null); return l.length ? Math.round(Math.min(...l) * 10) / 10 : null; };
  const s = v2.keyframeFrame(sq, u).sk; const C = v2.bodyColliders(s); const gl = C.find((c) => c.id === 'head');
  out.sl[u] = { przedramie: nis(/^farmL$/), dlon: nis(/^handL$/), udo: nis(/^thighL$/), golen: nis(/^shankL$/), stopa: nis(/^footL$/), tulow: nis(/^torso$/), glowaKolizor: Math.round((gl.a[1] - gl.r) * 10) / 10, kolanoDolne: Math.round(v2.jointAngles(s, 'L').knee * 10) / 10, obrotTulowia: v2.jointAngles(s, 'L').trunkRoll }; }
const klon = () => JSON.parse(JSON.stringify(sq));
const rekaWisi = klon(); for (const k of rekaWisi.klatki) { k.rece.L.chwyt[1] += 7; delete k.przechylGlowy; } /* dolna ręka wisi 7 cm wyżej, a głowa (bez skłonu bocznego) nadal na niej: dokładnie błąd z recenzji r5 */
const nogaWisi = klon(); for (const k of nogaWisi.klatki) k.nogi.L.kostka[1] += 6; /* dolna noga podnosi się */
const wzorzec = klon(); const glowaNaPodlodze = klon(); for (const k of glowaNaPodlodze.klatki) { k.rece.L.chwyt[1] += 7; k.przechylGlowy = -35; k.przechylTulowia = -2; }
out.mut = { rekaWisi: J.cialoLezy(v2, rekaWisi, { glowa: true }), nogaWisi: J.cialoLezy(v2, nogaWisi, { glowa: true }), wzorzec: J.cialoLezy(v2, wzorzec, { glowa: true }), glowaNaPodlodze: J.cialoLezy(v2, glowaNaPodlodze, { glowa: true }) };
console.log(JSON.stringify(out));
`;
type PomiarSL = { przedramie: number; dlon: number; udo: number; golen: number; stopa: number; tulow: number; glowaKolizor: number; kolanoDolne: number; obrotTulowia: number };
const skan = ((): { sl: Record<string, PomiarSL>; mut: Record<'rekaWisi' | 'nogaWisi' | 'wzorzec' | 'glowaNaPodlodze', string[]>; lezy: { rodzina: string; cwiczenie: string; opisy: string[] }[]; znika: { rodzina: string; cwiczenie: string; opisy: string[] }[]; lekko: { rodzina: string; cwiczenie: string; reguly: string[]; max: number }[]; poz: number; lezacych: number } =>
  JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', SKAN], { cwd: ROOT, env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })))();

/** Znane trafienia R9/R10 poza mobilnością (zapadka: nowe pary rodzina|ćwiczenie nie powstają; naprawa pozy tylko zmniejsza listę). Ocena: PRAWDZIWE = poza do poprawy w swojej rodzinie; FAŁSZYWE = reguła nie dotyczy ruchu. */
export const TRAFIENIA_R9_R10: Record<string, string> = {};
/* Backlog figur (28.10.2026): zapadka opróżniona — Clamshell, External Rotation (hantel), Lower Back Curl, Superman i Seal Row poprawione generatorami, Slider Hamstring Curl (mostek) zdjęty z listy przez warunek reguły (miednica unoszona celowo); R9 i R10 są bramką sprawdzJakosc dla WSZYSTKICH rodzin (tests/figury-backlog-bramka.test.ts). */
/** Pozy z regułą „lekko” (kolano), w których kolano przekracza 30° (konwencja „lekko” z obie_kolana_lekko): znane, bo ich reguły mają własny, wyższy próg (wiosłowanie w opadzie ≤ 40°). Zapadka. */
export const LEKKO_PONAD_30: string[] = []; /* jedna wspólna stała KOLANO_LEKKO_MAX_DEG = 30 (konwencja; backlog figur 28.10.2026): wiosłowanie w opadzie nie ma już własnego, wyższego progu */

describe('R9 „ciało leży” (obrys z boku) i R10 „część ciała nie znika” na wszystkich pozach z danych (recenzja mobilności r4, 28.10.2026)', () => {
  const klucz = (r: string, t: { rodzina: string; cwiczenie: string }) => `${r}|${t.rodzina}|${t.cwiczenie}`;
  test('skan obejmuje wszystkie pozy z danych, z czego ≥ 25 leżących lub siedzących (reguła nie jest martwa)', () => { expect(skan.poz).toBeGreaterThan(400); expect(skan.lezacych).toBeGreaterThanOrEqual(25); });
  test('rodziny mobilności: 0 trafień R9 i R10 (Side-Lying Quad Stretch leży: tułów i spodenki ≤ 2 cm, głowa na przedramieniu, stopa widoczna)', () => {
    expect([...skan.lezy, ...skan.znika].filter((t) => MOB.includes(t.rodzina))).toEqual([]);
  });
  test('pozostałe rodziny: trafienia są znane i opisane (zapadka; nowe trafienie = poza do poprawy albo świadomy wpis z oceną)', () => {
    const znalezione = [...skan.lezy.filter((t) => !MOB.includes(t.rodzina)).map((t) => klucz('cialo_lezy', t)), ...skan.znika.filter((t) => !MOB.includes(t.rodzina)).map((t) => klucz('czesc_ciala_nie_znika', t))];
    for (const k of znalezione) expect([k, k in TRAFIENIA_R9_R10]).toEqual([k, true]);
    for (const k of Object.keys(TRAFIENIA_R9_R10)) expect([k, znalezione.includes(k)]).toEqual([k, true]); /* zapadka tylko maleje: poza naprawiona w swojej rodzinie musi zniknąć z listy */
    for (const [k, ocena] of Object.entries(TRAFIENIA_R9_R10)) { expect(ocena).toMatch(/^(PRAWDZIWE|FAŁSZYWE)/); expect(k.split('|').length).toBe(3); }
  });
});

describe('R9 rozszerzone (recenzja mobilności r5, 28.10.2026): kończyna podpierająca głowę i dolna noga leżącego na boku same leżą', () => {
  test('L1: głowa podparta ręką, która sama wisi 7 cm nad podłogą, jest zgłaszana (głowa na wiszącej dłoni nie jest podparta); głowa na podłodze nie wymaga ręki', () => {
    expect(skan.mut.rekaWisi.filter((x) => /podpiera|wisi/.test(x)).length).toBeGreaterThan(0);
    expect(skan.mut.glowaNaPodlodze.filter((x) => /głow|podpiera|wisi/.test(x))).toEqual([]); /* mutant przesuwa też ramię pod podłogę — łapie je nowy próg obrysu kończyn (backlog figur), tu liczy się tylko podparcie głowy */
  });
  test('L2: dolna noga podniesiona o 6 cm (udo i goleń nad podłogą) jest zgłaszana; poza wzorcowa (dane) nie ma żadnego zgłoszenia', () => {
    expect(skan.mut.nogaWisi.filter((x) => /dolna noga|udo|goleń/.test(x)).length).toBeGreaterThan(0);
    expect(skan.mut.wzorzec).toEqual([]);
  });
  test('próg nogi na boku (lezyBokNogaCm) to konwencja 4 cm (miara profilem od 28.10.2026; było 3 cm dla minimum kształtu) i jest jedną liczbą w v2-jakosc.mjs; ręka podpierająca głowę używa progu lezyCm (2 cm)', () => {
    const src = fs.readFileSync(path.join(ROOT, 'scripts/figures/v2-jakosc.mjs'), 'utf8');
    expect(src).toMatch(/lezyBokNogaCm: 4, \/\* [^*]*konwencja/i);
    expect(src).toMatch(/lezyCm: 2,/);
  });
  test('Side-Lying Quad Stretch (obie klatki): przedramię i dłoń dolnej ręki ≤ 2 cm nad podłogą, udo i goleń dolnej nogi ≤ 3 cm, stopa leży (0…2 cm), głowa na dłoni (kolizor głowy 4…10 cm nad podłogą), tułów ≤ 2 cm', () => {
    for (const u of ['0', '1']) { const m = skan.sl[u];
      expect([u, 'przedramię', m.przedramie <= 2]).toEqual([u, 'przedramię', true]); expect([u, 'dłoń', m.dlon <= 2]).toEqual([u, 'dłoń', true]);
      expect([u, 'udo', m.udo <= 3]).toEqual([u, 'udo', true]); expect([u, 'goleń', m.golen <= 3]).toEqual([u, 'goleń', true]);
      expect([u, 'stopa', m.stopa >= -0.5 && m.stopa <= 2]).toEqual([u, 'stopa', true]); expect([u, 'tułów', m.tulow <= 2]).toEqual([u, 'tułów', true]);
      expect([u, 'głowa', m.glowaKolizor >= 2 && m.glowaKolizor <= 10]).toEqual([u, 'głowa', true]); expect([u, 'kolano dolne ≤ 15°', m.kolanoDolne <= 15]).toEqual([u, 'kolano dolne ≤ 15°', true]); }
  });
  test('przybliżenie Side-Lying w manifeście nazywa odchylenie tułowia do tyłu o 15° (obrót −75°) i skłon głowy na dłoń (recenzja r5 #3: nie tylko komentarz w kodzie)', () => {
    const src = fs.readFileSync(path.join(ROOT, 'scripts/figures/agent-pozy/mobility_floor.mjs'), 'utf8');
    const wpis = src.match(/'Side-Lying Quad Stretch': 'przybliżenie:[^\n]*'/)?.[0] ?? '';
    expect(wpis).toMatch(/odchylon\w+ do tyłu o 15°/); expect(wpis).toMatch(/−75°/); expect(wpis).toMatch(/głowa opada skłonem bocznym/);
    expect(skan.sl['0'].obrotTulowia).toBe(-75);
  });
});

/** L4 (model pracy, recenzja mobilności r5): zmiana pozy wymuszona ograniczeniem rysunku (modelu) ma wpis w `przyblizenie` manifestu. Kontrola tania, heurystyczna: dla każdego ćwiczenia generatora bierzemy tekst
 * od końca poprzedniej funkcji do końca funkcji ćwiczenia (stałe i komentarze nad funkcją + doc + ciało) i szukamy słów oznaczających odstępstwo od źródła z powodu ograniczenia (ograniczenie, granica modelu, uproszczenie, model nie ma…);
 * znalezione słowo bez wpisu w PRZYBLIZENIA (ten sam plik) = czerwone. Nie wykryje odstępstwa opisanego innymi słowami ani bez komentarza — to uzupełnienie recenzji (bramka 4, krok 1), nie jej zamiennik. */
const ODSTEPSTWO = /ogranicze|granic[aęy] modelu|granicy modelu|uproszcz|obejś|model nie ma|nie mieści się w modelu/i;
export const odstepstwaBezPrzyblizenia = (zrodlo: string): string[] => {
  const src = zrodlo.replace(/^(\/\/[^\n]*\n)+/, ''); /* nagłówek pliku (wspólne „uproszczenie ilustracyjne”) nie jest odstępstwem żadnego ćwiczenia */
  const mapa = [...src.matchAll(/(?:'([^']+)'|"([^"]+)"): \(\) => (\w+)\(/g)].map((m) => ({ cw: m[1] ?? m[2], fn: m[3] }));
  const blok = src.match(/export const PRZYBLIZENIA = \{([\s\S]*?)\n\};/)?.[1] ?? ''; const maWpis = new Set([...blok.matchAll(/^\s+(?:'([^']+)'|"([^"]+)"):/gm)].map((m) => m[1] ?? m[2]));
  return mapa.flatMap(({ cw, fn }) => {
    const start = src.indexOf(`function ${fn}(`); if (start < 0) return []; const poprzedni = src.lastIndexOf('\n}\n', start); const koniec = src.indexOf('\n}\n', start);
    const tekst = src.slice(poprzedni < 0 ? 0 : poprzedni, koniec < 0 ? src.length : koniec); const slowo = tekst.match(ODSTEPSTWO)?.[0];
    return slowo && !maWpis.has(cw) ? [`${cw}: w kodzie „${slowo}”, a PRZYBLIZENIA nie ma wpisu`] : [];
  });
};
describe('L4: odstępstwo od źródła z powodu ograniczenia rysunku ma wpis w przyblizenie (manifest)', () => {
  const gen = (f: string) => fs.readFileSync(path.join(ROOT, 'scripts/figures/agent-pozy', f), 'utf8');
  test('mobility_floor i mobility_stand: każde ćwiczenie z odstępstwem w komentarzu ma wpis w PRZYBLIZENIA', () => {
    expect(odstepstwaBezPrzyblizenia(gen('mobility_floor.mjs'))).toEqual([]); expect(odstepstwaBezPrzyblizenia(gen('mobility_stand.mjs'))).toEqual([]);
  });
  test('kontrola działa: komentarz „ograniczenie modelu” w funkcji ćwiczenia bez wpisu jest wykrywany, z wpisem nie', () => {
    const bez = "export const PRZYBLIZENIA = {\n};\nfunction a(cw) {\n  /* obrót −75°: ograniczenie modelu */\n  return 1;\n}\nexport function generuj() { return { 'Ćw A': () => a('Ćw A') }; }\n";
    expect(odstepstwaBezPrzyblizenia(bez)).toEqual(['Ćw A: w kodzie „ogranicze”, a PRZYBLIZENIA nie ma wpisu']);
    expect(odstepstwaBezPrzyblizenia(bez.replace('PRZYBLIZENIA = {\n}', "PRZYBLIZENIA = {\n  'Ćw A': 'przybliżenie: x',\n}"))).toEqual([]);
  });
});

describe('„lekko” ma górny próg: kolano ≤ 30° (konwencja) w regule obie_kolana_lekko (recenzja mobilności r4: Standing Soleus And Achilles Stretch miał tylne kolano 58°)', () => {
  const SENS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sens.json'), 'utf8')).rodziny as Record<string, { reguly: Record<string, { typ: string; parametry: Record<string, number | string>; liczba: string }> }>;
  const lekkie = Object.entries(SENS).flatMap(([rodzina, d]) => Object.entries(d.reguly).filter(([id, r]) => /lekko/i.test(id) && ['kolana_max', 'kolano_zakres_ruch'].includes(r.typ)).map(([id, r]) => ({ rodzina, id, r })));
  test('każda reguła „lekko” (kolano) ma górny próg (max_deg albo max_max_deg), a obie_kolana_lekko ma 30° opisane jako konwencja', () => {
    expect(lekkie.length).toBeGreaterThanOrEqual(5);
    for (const { rodzina, id, r } of lekkie) { const g = r.parametry.max_deg ?? r.parametry.max_max_deg; expect([rodzina, id, typeof g === 'number' || g === '@kolano_lekko_max_deg']).toEqual([rodzina, id, true]); } /* liczba albo odnośnik do jedynej stałej */
    const o = SENS.mobility_stand.reguly.obie_kolana_lekko; expect(o.parametry).toEqual({ nogi: 'obie', min_max_deg: 10, max_max_deg: '@kolano_lekko_max_deg' }); expect(o.liczba).toMatch(/konwencja/); expect(o.liczba).toMatch(/30°/);
  });
  test('pozy z regułą „lekko”: kolano > 30° tylko w znanych pozach (lista pusta od 28.10.2026: jedna stała ≤ 30°); mobilność i zwis ≤ 30°', () => {
    const ponad = skan.lekko.filter((x) => x.max > 30).map((x) => x.cwiczenie).sort(); expect(ponad).toEqual([...LEKKO_PONAD_30].sort());
    for (const x of skan.lekko.filter((y) => MOB.includes(y.rodzina) || y.rodzina === 'core_hang')) expect([x.cwiczenie, x.max <= 30]).toEqual([x.cwiczenie, true]);
    expect(skan.lekko.some((x) => x.cwiczenie === 'Standing Soleus And Achilles Stretch')).toBe(true);
  });
  test('Standing Soleus And Achilles Stretch: oba kolana zgięte 10–30°, tylna pięta na podłodze, kostka tylnej nogi ≥ 20° (R1 nadal spełniona)', () => {
    const p = wczytaj().find((x) => x.cwiczenie === 'Standing Soleus And Achilles Stretch')!; const s = sk(p, 0);
    for (const x of ['R', 'L'] as const) { const k = jointAngles(s, x).knee; expect([x, k >= 10 && k <= 30]).toEqual([x, true]); }
    expect(Math.min(s.legs.R.heel[1], s.legs.L.heel[1])).toBeLessThanOrEqual(PROGI.piętaNaPodlodzeCm); expect(REGULY.R1_kostka_lydki(p)).toEqual([]);
  });
});

describe('Cat-Cow: kolana nie jeżdżą po podłodze (recenzja mobilności r4: 1,6 cm między klatkami)', () => {
  test('środek kolan (x) zmienia się o ≤ 0,5 cm w ruchu, dłonie stoją', () => {
    const p = wczytaj().find((x) => x.cwiczenie === 'Cat-Cow')!; const kx: number[] = []; const dx: number[] = [];
    for (const u of siatka(40)) { const s = sk(p, u); kx.push(s.legs.R.knee[0], s.legs.L.knee[0]); dx.push(s.arms.R.grip[0], s.arms.L.grip[0]); }
    expect(Math.max(...kx) - Math.min(...kx)).toBeLessThanOrEqual(0.5); expect(Math.max(...dx) - Math.min(...dx)).toBeLessThanOrEqual(0.5);
  });
});
