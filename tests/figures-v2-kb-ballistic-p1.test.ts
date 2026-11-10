/*
 * Rodzina v2 kb_ballistic (kettlebell i hantel balistycznie), partia 1 linii 1.1, 09.11.2026 — podłączenie, DATA_UI, nakładka, zakresy stawów z reguł karty i tor ciężaru.
 * Progi z reguł w data/zrodla/figury-sens.json (kb_ballistic), nie z bieżących danych (K5): swing — biodro na dole ≥ 60° (zawias_swing), na górze biodro ≤ 25° i kolano ≤ 15° (wyprost_swing),
 * dłonie na górze nie niżej niż 20 cm pod barkiem (reka_na_wysokosc); zarzut — chwyt −15…15 cm od barków w u = 1 (kbo_rack); rwanie i wyciskania — chwyt ≥ 10 cm nad barkiem, łokieć ≤ 20° (kbo_nad_glowa);
 * przy barkach na starcie wyciskań ≤ 20 cm (pp_start), ugięcie kolan ≥ 15° w ćwiczeniach z podrzutem (pp_ugiecie). Ślad ciężaru ≤ 3 cm od chwytu (wzór tests/figures-v2-tor.test.ts).
 */
import { FAMILIES, assignAll, figureSpec, frameAt, keyframeFrame, jointAngles, equipColliders, poseKeys, hasPoseFile, overlayShapes, phaseNames, phasesFor, type PoseData } from '@/lib/figures/v2';
import { DATA_UI, poseFile } from '@/lib/figures/v2/poseData';
import { TECHNIQUE, techniquesFor } from '@/lib/figures/v2/overlay';
import { KB_BALLISTIC_TECHNIQUE } from '@/lib/figures/v2/overlay/kb_ballistic';
import { BODY } from '@/lib/figures/v2/skeleton';
import { CONTRACT } from '@/lib/figures/v2/contract';
import { stykKlatki } from './helpers/styk-figur';
import * as fs from 'fs';
import * as path from 'path';

const FAM = 'kb_ballistic';
const KEYS = poseKeys(FAM);
const SWING = ['Kettlebell Swing', 'One-Arm Kettlebell Swings'];
const RACK = ['Kettlebell Clean', 'Double Kettlebell Clean', 'Dumbbell Clean', 'Bottoms-Up Clean From The Hang Position'];
const NAD = ['Kettlebell Snatch', 'Double Kettlebell Snatch', 'Snatch (hantel)', 'Double Kettlebell Push Press', 'Double Kettlebell Jerk', 'One-Arm Kettlebell Push Press', 'One-Arm Kettlebell Jerk', 'One-Arm Kettlebell Split Jerk', 'One-Arm Kettlebell Clean and Jerk'];
const WYCISKANIA = ['Double Kettlebell Push Press', 'Double Kettlebell Jerk', 'One-Arm Kettlebell Push Press', 'One-Arm Kettlebell Jerk', 'One-Arm Kettlebell Split Jerk'];
const PODRZUT = ['Double Kettlebell Jerk', 'One-Arm Kettlebell Jerk', 'One-Arm Kettlebell Split Jerk', 'One-Arm Kettlebell Push Press', 'Double Kettlebell Push Press'];
const DYNAMICZNE = ['One-Arm Kettlebell Clean and Jerk', 'Kettlebell Snatch', 'Double Kettlebell Snatch', 'Snatch (hantel)'];
const data = (k: string) => poseFile(FAM)!.cwiczenia[k];
const us = Array.from({ length: 21 }, (_, i) => i / 20);
const fr = (k: string, u: number, err?: number) => keyframeFrame(data(k), u, err);
const ang = (k: string, u: number, s: 'R' | 'L' = 'R', err?: number) => jointAngles(fr(k, u, err).sk, s);
const dy = (k: string, u: number, err?: number) => { const f = fr(k, u, err); return f.sk.arms.R.grip[1] - f.sk.shoulderC[1]; };
const dist = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

describe('kb_ballistic p1: podłączenie (09.11.2026)', () => {
  test('rodzina ready, ma plik póz, 16 ćwiczeń — wszystkie z figurą v2 z danych i przypisane do rodziny (Kettlebell Pirate Ships otwarte: bez figury)', () => {
    expect(FAMILIES.find(f => f.id === FAM)!.status).toBe('ready'); expect(hasPoseFile(FAM)).toBe(true);
    expect(KEYS.length).toBe(16); expect(KEYS).not.toContain('Kettlebell Pirate Ships');
    const all = assignAll(); for (const k of KEYS) { expect([k, all[k]]).toEqual([k, FAM]); const s = figureSpec(k); expect([k, !!s, s && 'data' in s.variant]).toEqual([k, true, true]); }
    expect(figureSpec('Kettlebell Pirate Ships')).toBeNull();
  });
  const JEDNOKIERUNKOWE = ['Kettlebell Snatch', 'Double Kettlebell Snatch', 'Snatch (hantel)', 'Double Kettlebell Push Press', 'Double Kettlebell Jerk', 'One-Arm Kettlebell Push Press', 'One-Arm Kettlebell Jerk', 'One-Arm Kettlebell Split Jerk', 'One-Arm Kettlebell Clean and Jerk'];
  test('DATA_UI: wahadło (swing, zarzut, wysoki ciąg): Podnoszenie 1 s / Opuszczanie 2 s; rwanie, wyciskania z nóg i podrzut (9, petla = jednokierunkowa): jedna faza „Podnoszenie” bez czasu; mierzone biodro albo kolano', () => {
    expect(DATA_UI[FAM].names).toEqual({ first: 'Podnoszenie', second: 'Opuszczanie' }); expect(DATA_UI[FAM].lowerFirst).toBe(false); expect(DATA_UI[FAM].joints).toEqual(['hip', 'knee']);
    expect(KEYS.filter(k => data(k).petla === 'jednokierunkowa').sort()).toEqual([...JEDNOKIERUNKOWE].sort());
    for (const k of KEYS) { const s = figureSpec(k)!; const one = JEDNOKIERUNKOWE.includes(k);
      expect([k, phaseNames(s)]).toEqual([k, one ? { first: 'Podnoszenie', second: 'Podnoszenie' } : { first: 'Podnoszenie', second: 'Opuszczanie' }]);
      expect([k, phasesFor(s).map(p => [p.name, p.untimed ?? false])]).toEqual([k, one ? [['Podnoszenie', true]] : [['Podnoszenie', false], ['Pauza', false], ['Opuszczanie', false], ['Pauza', false]]]); }
  });
});

describe('kb_ballistic p1: zakresy stawów z reguł karty', () => {
  test.each(SWING)('%s: biodro na dole ≥ 60° (zawias_swing), na górze biodro ≤ 25°, kolano ≤ 15° (wyprost_swing), dłonie ≥ 20 cm pod barkiem na górze (reka_na_wysokosc)', k => {
    for (const s of ['R', 'L'] as const) { expect([k, s, ang(k, 0, s).hip >= 60]).toEqual([k, s, true]); expect([k, s, ang(k, 1, s).hip <= 25]).toEqual([k, s, true]); expect([k, s, ang(k, 1, s).knee <= 15]).toEqual([k, s, true]); }
    expect([k, dy(k, 1) >= -20]).toEqual([k, true]);
  });
  test('przypadek negatywny miar swingu: dół ruchu nie spełnia wyprostu ani wysokości dłoni (miary potrafią paść)', () => {
    for (const k of SWING) { expect(ang(k, 0).hip <= 25).toBe(false); expect(ang(k, 0).knee <= 15).toBe(false); expect(dy(k, 0) >= -20).toBe(false); }
  });
  test.each(RACK)('%s (zarzut): w u = 1 chwyt przy barkach (−15…15 cm; kbo_rack), łokieć zgięty', k => {
    const d = dy(k, 1); expect([k, d >= -15 && d <= 15]).toEqual([k, true]); expect([k, ang(k, 1).elbow >= 90]).toEqual([k, true]);
  });
  test.each(NAD)('%s: w u = 1 ciężar nad głową — chwyt ≥ 10 cm nad barkiem, łokieć ≤ 20° (kbo_nad_glowa); u = 0 nie jest nad głową', k => {
    expect([k, dy(k, 1) >= 10]).toEqual([k, true]); expect([k, ang(k, 1).elbow <= 20]).toEqual([k, true]); expect([k, dy(k, 0) >= 10]).toEqual([k, false]);
  });
  test.each(WYCISKANIA)('%s: start przy barkach (pp_start: chwyt ≤ 20 cm od barku w u = 0)', k => { expect([k, Math.abs(dy(k, 0)) <= 20]).toEqual([k, true]); });
  test.each(PODRZUT)('%s: ugięcie kolan ≥ 15° w ruchu (pp_ugiecie; N3a, recenzja r1: także Push Press)', k => {
    expect([k, Math.max(...us.map(u => ang(k, u).knee)) >= 15]).toEqual([k, true]);
  });
  test('błąd „zaokrąglone plecy” (mis.roundBack; One-Arm Swings, Sumo High Pull) różni się od ruchu poprawnego pochyleniem tułowia albo zgięciem kręgosłupa w którejś klatce', () => {
    for (const k of ['One-Arm Kettlebell Swings', 'Kettlebell Sumo High Pull']) { const i = data(k).bledy.findIndex(b => b.cue === 'mis.roundBack'); expect(i).toBeGreaterThanOrEqual(0);
      expect([k, us.some(u => JSON.stringify(fr(k, u, i).sk.shoulderC) !== JSON.stringify(fr(k, u).sk.shoulderC))]).toEqual([k, true]); }
  });
});

const ZARZUT_RWANIE = ['Kettlebell Clean', 'Double Kettlebell Clean', 'Dumbbell Clean', 'Kettlebell Snatch', 'Double Kettlebell Snatch', 'Snatch (hantel)', 'One-Arm Kettlebell Clean and Jerk'];
const DOLNY_START_KB = ZARZUT_RWANIE.filter(k => k !== 'Dumbbell Clean');
/*
 * W1-r2 (recenzja r2 audytora, 09.11.2026): ciąg zarzutu i rwania. Karty: „po wyproście bioder przyciągnij je blisko ciała”, „ręka włącza się dopiero po wyproście bioder i kolan”.
 * Miary liczone na danych (nie na stałych): (1) kolejność — łokieć ≤ 20° dopóki biodro nie jest wyprostowane (zgięcie bioder ≤ 15°; w danych v2 zgięcie bioder 0° = wyprost);
 * (2) odstęp ciężaru od ciała (stykKlatki: powierzchnia ciężaru – nogi i tułów) ≤ 15 cm, gdy chwyt jest poniżej barku (ciąg od zawisu do barku; wyrzut nad głowę poza oknem).
 * 15 cm to liczba robocza recenzenta (UPROSZCZENIE: „blisko ciała” bez źródła liczbowego, do potwierdzenia przez badacza); 15° bioder i 20° łokcia — konwencja progów „prosta ręka”, jak kbo_nad_glowa.
 * Przypadki negatywne: te same miary na pozach sprzed poprawki (fixture tests/fixtures/kb-ballistic-przed-w1r2.json = lib/figures/v2/poses/kb_ballistic.json @ c92df2c9).
 */
const STARE: Record<string, PoseData> = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'kb-ballistic-przed-w1r2.json'), 'utf8')).cwiczenia;
/** W1-r3 / W2-r3 (recenzja r3 audytora, 10.11.2026): progi w jednym miejscu. */
const RATIO_PREDKOSCI = 2.2, HANTEL_MIEDZY_STOPAMI = 9, TULOW_START_MIN = 25, LOKIEC_START_HANTEL = 15, SKOK_RWANIA_48 = 9;
const HIP_WYPROST = 15, LOKIEC_PROSTA = 20, ODSTEP_BLISKO = 15, KROKI = 96;
const hipR = (d: PoseData, u: number) => jointAngles(keyframeFrame(d, u).sk, 'R');
/** Pierwsze u, w którym zgięcie bioder ≤ HIP_WYPROST (wyprost bioder), albo null. */
const uWyprost = (d: PoseData): number | null => { for (let i = 0; i <= KROKI; i++) if (hipR(d, i / KROKI).hip <= HIP_WYPROST) return i / KROKI; return null; };
/** Największe zgięcie łokcia przed wyprostem bioder. */
const lokiecPrzedWyprostem = (d: PoseData): number => { const w = uWyprost(d) ?? 1; let m = 0; for (let i = 0; i / KROKI < w; i++) m = Math.max(m, hipR(d, i / KROKI).elbow); return m; };
/** Największy odstęp ciężaru od ciała (powierzchnia) w ciągu: chwyt poniżej barku, u < 0,8 (potem ugięcie przed rackiem / wyrzut). */
const odstepCiagu = (d: PoseData): number => { let m = -Infinity; for (let i = 0; i <= KROKI; i++) { const u = i / KROKI; if (u >= 0.8) break; const f = keyframeFrame(d, u); if (f.sk.arms.R.grip[1] < f.sk.shoulderC[1]) m = Math.max(m, stykKlatki(f, u).odstep); } return m; };
/** Najniższy punkt ciężaru nad podłogą w u = 0, cm. */
const spodCiezaru = (d: PoseData): number => Math.min(...equipColliders(keyframeFrame(d, 0).props).flatMap(c => (c.k === 'capsule' && /^(db|kb)/.test(c.id) ? [Math.min(c.a[1], c.b[1]) - c.r] : [])));
describe('kb_ballistic p1: start i ciąg zarzutu i rwania (W1 r1 i W1-r2, recenzja 09.11.2026; K5)', () => {
  test.each(DOLNY_START_KB)('%s: w u = 0 chwyt za linią kostek jak w swingu („przeszły między nogami”, „zamach jak przy swingu”), nie 30 cm przed nimi', k => {
    const f = fr(k, 0); const ankle = f.sk.legs.R.ankle[0]; const prog = k === 'Snatch (hantel)' ? HANTEL_MIEDZY_STOPAMI : 0; /* W2-r3: hantel z podłogi leży między stopami (nie dalej niż 9 cm przed kostką, pod łukiem stopy; nie nad palcami), nie za kostkami jak kettlebell w zamachu */ expect([k, f.sk.arms.R.grip[0] - ankle <= prog]).toEqual([k, true]);
  });
  test('Dumbbell Clean (hantle po bokach ud): w u = 0 chwyt nie dalej niż 25 cm przed kostką', () => {
    const f = fr('Dumbbell Clean', 0); expect(f.sk.arms.R.grip[0] - f.sk.legs.R.ankle[0] <= 25).toBe(true);
  });
  test('przypadek negatywny miary startu: ta sama miara (chwyt ≤ linia kostek) na Dumbbell Clean (hantle po bokach ud, ok. 23 cm przed kostką) nie przechodzi — miara potrafi paść na danych', () => {
    const f = fr('Dumbbell Clean', 0); expect(f.sk.arms.R.grip[0] - f.sk.legs.R.ankle[0] <= 0).toBe(false);
  });
  test.each(ZARZUT_RWANIE)('%s: ręka prosta do wyprostu bioder — łokieć ≤ 20° dopóki zgięcie bioder > 15° (karta: „ręka włącza się dopiero po wyproście bioder”)', k => {
    expect([k, uWyprost(data(k)) !== null]).toEqual([k, true]); expect([k, lokiecPrzedWyprostem(data(k)) <= LOKIEC_PROSTA]).toEqual([k, true]);
  });
  test.each(ZARZUT_RWANIE)('%s: ciężar blisko ciała w ciągu — odstęp od nóg i tułowia ≤ 15 cm, gdy chwyt jest poniżej barku (karta: „przyciągnij je blisko ciała”)', k => {
    expect([k, odstepCiagu(data(k)) <= ODSTEP_BLISKO]).toEqual([k, true]);
  });
  test.each(ZARZUT_RWANIE)('%s: przypadek negatywny — te same miary na danych sprzed poprawki (łokieć zgięty w zawiasie, ciężar 24–32 cm od ciała) nie spełniają progów', k => {
    expect([k, lokiecPrzedWyprostem(STARE[k]) > LOKIEC_PROSTA]).toEqual([k, true]); expect([k, odstepCiagu(STARE[k]) > ODSTEP_BLISKO]).toEqual([k, true]);
  });
  test('Snatch (hantel) startuje z podłogi (karta: „postaw hantel między stopami”): w u = 0 spód hantla ≤ 5 cm nad podłogą; dane sprzed poprawki (zawis 56 cm) to nie spełniały', () => {
    expect(spodCiezaru(data('Snatch (hantel)')) <= 5).toBe(true); expect(spodCiezaru(STARE['Snatch (hantel)']) <= 5).toBe(false);
  });
});
/*
 * W1-r3 (recenzja r3 audytora, 10.11.2026): po wyproście bioder ciężar przyspiesza płynnie (pęd z bioder) — bez przestoju 0,4–0,7 s i bez nagłego skoku prędkości. Karty: „siła idzie z bioder … ręce tylko prowadzą”, „mocno wyprostuj biodra i kolana, a potem poprowadź hantel w górę”.
 * Miara: stosunek prędkości śladu ciężaru w sąsiednich kadrach 1/48 (większa / mniejsza, mniejsza nie niżej niż 0,5 cm; kadry o prędkości ≤ 2 cm pomijam) od wyprostu bioder do końca ≤ RATIO_PREDKOSCI = 2,2 (jak w przyjętych rwaniach olympic: Power Snatch 2,0, Muscle Snatch 1,9).
 * Liczone na danych. Przypadek negatywny: pozy sprzed poprawki (fixture kb-ballistic-przed-w1r3.json = d35ce6c4).
 */
const STARE_R3: Record<string, PoseData> = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'kb-ballistic-przed-w1r3.json'), 'utf8')).cwiczenia;
const slad = (d: PoseData, u: number): number[] => { const f = keyframeFrame(d, u); return (f.info.trail ?? f.info.load) as number[]; };
const ratioPoWyprosci = (d: PoseData): number => {
  const w = uWyprost(d) ?? 1; let worst = 0; let prev: number[] | null = null, vPrev = -1;
  for (let i = 0; i <= CONTRACT.step; i++) { const t = slad(d, i / CONTRACT.step); if (prev) { const v = dist(prev, t); if (vPrev >= 0 && i / CONTRACT.step > w) { const a = Math.max(v, vPrev), b = Math.max(0.5, Math.min(v, vPrev)); if (a > 2) worst = Math.max(worst, a / b); } vPrev = v; } prev = t; }
  return worst;
};
describe('kb_ballistic p1: płynny ciąg po wyproście bioder (W1-r3, 10.11.2026)', () => {
  test.each(ZARZUT_RWANIE)('%s: stosunek prędkości śladu sąsiednich kadrów 1/48 po wyproście bioder ≤ 2,2 (bez przestoju i szarpnięcia)', k => {
    expect([k, ratioPoWyprosci(data(k)) <= RATIO_PREDKOSCI]).toEqual([k, true]);
  });
  test.each(['Kettlebell Snatch', 'Double Kettlebell Snatch', 'Snatch (hantel)', 'Kettlebell Clean', 'Dumbbell Clean', 'One-Arm Kettlebell Clean and Jerk'])('%s: przypadek negatywny — ta sama miara na danych sprzed poprawki (pełzanie ciężaru przy biodrze, potem szarpnięcie) przekracza 2,2', k => {
    expect([k, ratioPoWyprosci(STARE_R3[k]) > RATIO_PREDKOSCI]).toEqual([k, true]);
  });
  test('miara potrafi padać i przechodzić: Power Snatch z rodziny olympic (przyjęty) mieści się w progu — próg nie jest dopasowany do kb', () => {
    const o = poseFile('olympic')!.cwiczenia['Power Snatch'] as PoseData; expect(ratioPoWyprosci(o) <= RATIO_PREDKOSCI).toBe(true);
  });
  test.each(DYNAMICZNE)('%s: skok śladu ciężaru na 1/48 ≤ 9 cm (zaostrzenie względem 3 × 16 cm na 0,05)', k => {
    let m = 0; for (let i = 1; i <= CONTRACT.step; i++) m = Math.max(m, dist(slad(data(k), i / CONTRACT.step), slad(data(k), (i - 1) / CONTRACT.step)));
    expect([k, m <= SKOK_RWANIA_48]).toEqual([k, true]);
  });
});
/*
 * W2-r3: Snatch (hantel) startuje jak do martwego ciągu (karta: „zejdź jak do martwego ciągu — plecy proste, klatka uniesiona”): tułów ≥ 25° nad poziomem (Deadlift (hantle) 32°), bark nie za hantlem,
 * hantel między stopami (≤ 9 cm przed kostką), łokieć ≤ 15° do wyprostu bioder (zapas względem ogólnego progu 20°). Przypadek negatywny: poza sprzed poprawki (tułów poziomo, hantel nad palcami, łokieć 19,6°).
 */
const tulowStart = (d: PoseData): number => { const f = keyframeFrame(d, 0); return Math.atan2(f.sk.shoulderC[1] - f.sk.pelvis[1], f.sk.shoulderC[0] - f.sk.pelvis[0]) * 180 / Math.PI; };
const hantelPrzedKostka = (d: PoseData): number => { const f = keyframeFrame(d, 0); return f.sk.arms.R.grip[0] - f.sk.legs.R.ankle[0]; };
describe('kb_ballistic p1: start Snatch (hantel) jak do martwego ciągu (W2-r3, 10.11.2026)', () => {
  const k = 'Snatch (hantel)';
  test('tułów ≥ 25° nad poziomem, bark nie za hantlem (≥ −2 cm), hantel ≤ 9 cm przed kostką, łokieć ≤ 15° do wyprostu bioder, biodro w zakresie ruchu', () => {
    const f = keyframeFrame(data(k), 0);
    expect(tulowStart(data(k)) >= TULOW_START_MIN).toBe(true); expect(f.sk.shoulderC[0] - f.sk.arms.R.grip[0] >= -2).toBe(true);
    expect(hantelPrzedKostka(data(k)) <= HANTEL_MIEDZY_STOPAMI).toBe(true); expect(lokiecPrzedWyprostem(data(k)) <= LOKIEC_START_HANTEL).toBe(true);
  });
  test('przypadek negatywny: poza sprzed poprawki (tułów poziomo, hantel 17 cm przed kostką, łokieć 19,6°) nie spełnia progów', () => {
    expect(tulowStart(STARE_R3[k]) >= TULOW_START_MIN).toBe(false); expect(hantelPrzedKostka(STARE_R3[k]) <= HANTEL_MIEDZY_STOPAMI).toBe(false); expect(lokiecPrzedWyprostem(STARE_R3[k]) <= LOKIEC_START_HANTEL).toBe(false);
  });
});
describe('kb_ballistic p1: podrzut kończy się wstaniem (N1, recenzja r1)', () => {
  test.each(['Double Kettlebell Jerk', 'One-Arm Kettlebell Jerk'])('%s: w u = 1 kolana proste (≤ 5°), łokieć ≤ 20°, chwyt nad głową', k => {
    expect([k, ang(k, 1).knee <= 5 && ang(k, 1).elbow <= 20 && dy(k, 1) >= 10]).toEqual([k, true]);
  });
});

describe('kb_ballistic p1: tor ciężaru', () => {
  test.each(KEYS)('%s: ślad ≤ 3 cm od chwytu (trzyma: ta ręka; dwa ciężary i swing oburącz: chwyt którejkolwiek ręki albo środek dłoni) w każdej klatce, bez skoków ponad limit ciągłości kontraktu między klatkami co 0,05', k => {
    const s = figureSpec(k)!; const tr = data(k).sprzet.filter(g => 'trzyma' in g && g.trzyma).map(g => (g as { trzyma: string }).trzyma); let prev: number[] | null = null;
    for (const u of us) { const f = frameAt(s, u); const t = (f.info.trail ?? f.info.load) as number[]; expect([k, u, !!t]).toEqual([k, u, true]);
      const gR = f.sk.arms.R.grip, gL = f.sk.arms.L.grip, mid = [0, 1, 2].map(i => (gR[i] + gL[i]) / 2);
      const d = tr.length === 1 ? dist(t, tr[0] === 'R' ? gR : gL) : Math.min(dist(t, gR), dist(t, gL), dist(t, mid)); expect([k, u, d <= 3]).toEqual([k, u, true]);
      if (prev) expect([k, u, dist(prev, t) <= 3 * (DYNAMICZNE.includes(k) ? CONTRACT.maxJumpDynamic : CONTRACT.maxJump)]).toEqual([k, u, true]); /* 3 klatki (0,05 × 48) × limit ciągłości kontraktu; dynamiczne w danych sensu: Clean and Jerk i trzy rwania (W1-r2) */ prev = t; }
  });
  test('przypadek negatywny miary: ślad przesunięty o 5 cm od chwytu nie mieści się w 3 cm', () => {
    const f = frameAt(figureSpec('Kettlebell Snatch')!, 0.5); const t = f.info.trail as number[]; expect(dist(t, f.sk.arms.R.grip) <= 3).toBe(true); expect(dist([t[0] + 5, t[1], t[2]], f.sk.arms.R.grip) <= 3).toBe(false);
  });
});

describe('kb_ballistic p1: nakładka techniki', () => {
  test('rejestr: plecy (ref segment miednica → bark, hinge.back, reguła plecy) i biodro (limb, kb.move, wyprost_swing), obie „ustalone”; TECHNIQUE wskazuje tę tablicę', () => {
    expect(TECHNIQUE[FAM]).toBe(KB_BALLISTIC_TECHNIQUE);
    expect(KB_BALLISTIC_TECHNIQUE.map(d => [d.id, d.kind, d.rule, d.cue, d.views, d.joint])).toEqual([['kbBackRef', 'ref', 'plecy', ['hinge.back'], ['side'], undefined], ['kbHipLimb', 'limb', 'wyprost_swing', ['kb.move'], ['side'], 'hip']]);
    for (const d of KB_BALLISTIC_TECHNIQUE) expect(['limb', 'abduction', 'ref']).toContain(d.kind);
  });
  test('elementy dostają tylko ćwiczenia z regułą „ustalone”: swing ×2 — plecy i biodro, Sumo High Pull — plecy; zarzut, rwanie i wyciskania (reguły „analogia”) — żaden', () => {
    const z = (k: string) => techniquesFor(FAM, ['hinge.back', 'kb.move', 'oly.back', 'oly.legs', 'pp.dip', 'sumo.kneesOut'], k).map(d => d.id);
    for (const k of KEYS) expect([k, z(k)]).toEqual([k, SWING.includes(k) ? ['kbBackRef', 'kbHipLimb'] : k === 'Kettlebell Sumo High Pull' ? ['kbBackRef'] : []]);
  });
  test('elementy rysują się w rzucie z boku w każdej klatce swingu', () => {
    for (const k of SWING) { const s = figureSpec(k)!; for (const u of us) for (const id of ['kbBackRef', 'kbHipLimb']) expect([k, u, id, overlayShapes(s, u, 'side', [id]).length > 0]).toEqual([k, u, id, true]); }
  });
});
