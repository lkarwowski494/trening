/*
 * Rodzina v2 kb_ballistic (kettlebell i hantel balistycznie), partia 1 linii 1.1, 09.11.2026 — podłączenie, DATA_UI, nakładka, zakresy stawów z reguł karty i tor ciężaru.
 * Progi z reguł w data/zrodla/figury-sens.json (kb_ballistic), nie z bieżących danych (K5): swing — biodro na dole ≥ 60° (zawias_swing), na górze biodro ≤ 25° i kolano ≤ 15° (wyprost_swing),
 * dłonie na górze nie niżej niż 20 cm pod barkiem (reka_na_wysokosc); zarzut — chwyt −15…15 cm od barków w u = 1 (kbo_rack); rwanie i wyciskania — chwyt ≥ 10 cm nad barkiem, łokieć ≤ 20° (kbo_nad_glowa);
 * przy barkach na starcie wyciskań ≤ 20 cm (pp_start), ugięcie kolan ≥ 15° w ćwiczeniach z podrzutem (pp_ugiecie). Ślad ciężaru ≤ 3 cm od chwytu (wzór tests/figures-v2-tor.test.ts).
 */
import { FAMILIES, assignAll, figureSpec, frameAt, keyframeFrame, jointAngles, poseKeys, hasPoseFile, overlayShapes, phaseNames, phasesFor } from '@/lib/figures/v2';
import { DATA_UI, poseFile } from '@/lib/figures/v2/poseData';
import { TECHNIQUE, techniquesFor } from '@/lib/figures/v2/overlay';
import { KB_BALLISTIC_TECHNIQUE } from '@/lib/figures/v2/overlay/kb_ballistic';
import { BODY } from '@/lib/figures/v2/skeleton';
import { CONTRACT } from '@/lib/figures/v2/contract';

const FAM = 'kb_ballistic';
const KEYS = poseKeys(FAM);
const SWING = ['Kettlebell Swing', 'One-Arm Kettlebell Swings'];
const RACK = ['Kettlebell Clean', 'Double Kettlebell Clean', 'Dumbbell Clean', 'Bottoms-Up Clean From The Hang Position'];
const NAD = ['Kettlebell Snatch', 'Double Kettlebell Snatch', 'Snatch (hantel)', 'Double Kettlebell Push Press', 'Double Kettlebell Jerk', 'One-Arm Kettlebell Push Press', 'One-Arm Kettlebell Jerk', 'One-Arm Kettlebell Split Jerk', 'One-Arm Kettlebell Clean and Jerk'];
const WYCISKANIA = ['Double Kettlebell Push Press', 'Double Kettlebell Jerk', 'One-Arm Kettlebell Push Press', 'One-Arm Kettlebell Jerk', 'One-Arm Kettlebell Split Jerk'];
const PODRZUT = ['Double Kettlebell Jerk', 'One-Arm Kettlebell Jerk', 'One-Arm Kettlebell Split Jerk', 'One-Arm Kettlebell Push Press', 'Double Kettlebell Push Press'];
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
/** Najdalsze wysunięcie chwytu przed bark, gdy chwyt jest jeszcze poniżej barku (ciąg ciężaru od bioder do barku), cm. */
const wysuniecie = (k: string) => Math.max(...Array.from({ length: 49 }, (_, i) => { const f = fr(k, i / 48); const g = f.sk.arms.R.grip; return g[1] < f.sk.shoulderC[1] ? g[0] - f.sk.shoulderC[0] : -1e9; }));
/** Próg z geometrii: w ciągu blisko ciała chwyt nie wychodzi przed bark dalej niż przedramię + dłoń (łokieć przy tułowiu, przedramię w górę); dane sprzed poprawki W1: zarzut 37 cm, rwanie kettlebella 49–58 cm. */
const MAX_WYSUNIECIE = BODY.farm + BODY.hand;
describe('kb_ballistic p1: start i ciąg zarzutu i rwania (W1, recenzja r1 09.11.2026; K5)', () => {
  test.each(DOLNY_START_KB)('%s: w u = 0 chwyt za linią kostek jak w swingu („przeszły między nogami”, „zamach jak przy swingu”), nie 30 cm przed nimi', k => {
    const f = fr(k, 0); const ankle = f.sk.legs.R.ankle[0]; expect([k, f.sk.arms.R.grip[0] - ankle <= 0]).toEqual([k, true]);
  });
  test('Dumbbell Clean (hantle po bokach ud): w u = 0 chwyt nie dalej niż 25 cm przed kostką; Snatch (hantel) startuje między stopami jak kettlebell (karta: „postaw hantel między stopami”)', () => {
    const f = fr('Dumbbell Clean', 0); expect(f.sk.arms.R.grip[0] - f.sk.legs.R.ankle[0] <= 25).toBe(true);
  });
  test('przypadek negatywny miary startu: dane sprzed poprawki (chwyt 30,4 cm przed kostką) nie spełniają progu 0 ani 25 cm', () => { expect(30.4 <= 0).toBe(false); expect(30.4 <= 25).toBe(false); });
  test.each(ZARZUT_RWANIE)('%s: ciąg blisko ciała — chwyt poniżej barku wysunięty przed bark najwyżej o przedramię + dłoń (BODY.farm + BODY.hand = 33 cm)', k => {
    expect([k, wysuniecie(k) <= MAX_WYSUNIECIE]).toEqual([k, true]);
  });
  test('przypadek negatywny miary ciągu: wartości sprzed poprawki (zarzut 37 cm, rwanie 49–58 cm) przekraczają próg', () => { for (const v of [37, 49, 58]) expect(v <= MAX_WYSUNIECIE).toBe(false); });
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
      if (prev) expect([k, u, dist(prev, t) <= 3 * (k === 'One-Arm Kettlebell Clean and Jerk' ? CONTRACT.maxJumpDynamic : CONTRACT.maxJump)]).toEqual([k, u, true]); /* 3 klatki (0,05 × 48) × limit ciągłości kontraktu; Clean and Jerk jest w danych sensu jako „dynamiczne” */ prev = t; }
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
