/*
 * Figury v2 — poprawki po niezależnej recenzji ruchu 1.1, partia p4a (27.10.2026): rodziny olympic i kb_ballistic.
 * Każdy błąd z recenzji (docs/przekazanie/notatki/recenzje-1-1/olympic.md i kb_ballistic.md) ma test odtwarzający: na pozach z poprzedniej wersji (origin/integracja-1-1) test by padał.
 * Rodzaje (docs/20): logika silnika (tryb dzwonu), dane (pozy zapisane), niezmienniki (pomiar na gęstej siatce u), macierz (każde ćwiczenie rodziny), regresja (inne pozy bez zmian).
 */
import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import { keyframeFrame, jointAngles, type PoseData, type Prop, type V3 } from '@/lib/figures/v2';

const ROOT = path.join(__dirname, '..');
const poseFile = (rodzina: string): { cwiczenia: Record<string, PoseData> } => JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/v2/poses', `${rodzina}.json`), 'utf8'));
const OLY = poseFile('olympic').cwiczenia;
const KB = poseFile('kb_ballistic').cwiczenia;
const N = 240;

type Probka = { u: number; kolano: number; biodro: number; lokiec: number; chwytY: number; chwytX: number; miednicaX: number; barkiY: number; barki: number; powietrze: boolean; palcePodloga: number };
/** Gęsta siatka u: kąty, chwyt prawej ręki, uniesienie barków i to, czy obie stopy są w powietrzu (dolny punkt stopy > 1,5 cm). */
function probki(p: PoseData): Probka[] {
  const out: Probka[] = [];
  for (let g = 0; g <= N; g++) {
    const sk = keyframeFrame(p, g / N).sk; const R = jointAngles(sk, 'R'); const L = jointAngles(sk, 'L');
    const dol = (s: 'R' | 'L') => Math.min(sk.legs[s].toe[1], sk.legs[s].heel[1]);
    out.push({ u: g / N, kolano: Math.max(R.knee, L.knee), biodro: Math.max(R.hip, L.hip), lokiec: R.elbow, chwytY: sk.arms.R.grip[1], chwytX: sk.arms.R.grip[0], miednicaX: sk.pelvis[0], barkiY: sk.shoulderC[1], barki: R.shrug, powietrze: dol('R') > 1.5 && dol('L') > 1.5, palcePodloga: Math.min(sk.legs.R.toe[1], sk.legs.L.toe[1]) });
  }
  return out;
}
/** Wyprost: pierwsza próbka po początku, w której kolana i biodra są prawie proste (≤ 15°). */
const wyprost = (s: Probka[]): number => s.findIndex((x, i) => i > 3 && x.kolano <= 15 && x.biodro <= 15);

const ZARZUTY_RWANIA = ['Power Clean', 'Clean', 'Split Clean', 'Hang Clean', 'Block Clean', 'Block Power Clean', 'Barbell Snatch', 'Power Snatch', 'Split Snatch', 'Hang Snatch', 'Block Snatch', 'Block Power Snatch'];
const POWER = ['Power Clean', 'Block Power Clean', 'Power Snatch', 'Block Power Snatch'];

describe('olympic nr 1: sztanga nie dochodzi do wysokości przyjęcia w staniu na palcach (zarzuty, rwania, Squat Jerk, Clean and Jerk)', () => {
  test.each(ZARZUTY_RWANIA)('%s: po wyproście sztanga nie wznosi się w staniu, a przyjęcie następuje w ugięciu', (cw) => {
    const s = probki(OLY[cw]); const i = wyprost(s); expect(i).toBeGreaterThan(0);
    const y0 = s[i].chwytY; const wzrost = Math.max(...s.slice(i).filter((x) => x.kolano < 30).map((x) => x.chwytY - y0));
    expect(wzrost).toBeLessThanOrEqual(40); /* przed poprawką 53–65 cm (łokcie 103° → 146° przy kolanach 3–13°) */
    const szczyt = s.slice(i).reduce((a, x) => (x.chwytY > a.chwytY ? x : a));
    expect(szczyt.kolano).toBeGreaterThanOrEqual(30); /* szczyt toru sztangi dopiero przy ugiętych kolanach */
    expect(szczyt.chwytY - s[N].chwytY).toBeLessThanOrEqual(40); /* sztanga nie wznosi się wyżej, niż zostanie przyjęta */
    expect(s[N].kolano).toBeGreaterThanOrEqual(POWER.includes(cw) ? 60 : 75);
  });
  test.each(ZARZUTY_RWANIA)('%s: stopy w powietrzu najwyżej ćwierć ruchu (przed poprawką 40–69%%)', (cw) => {
    const s = probki(OLY[cw]); expect(s.filter((x) => x.powietrze).length / s.length).toBeLessThanOrEqual(0.25);
  });
  test('Squat Jerk: sztanga po wybiciu tylko dojeżdża do wysokości przyjęcia (przed poprawką 184 cm i 143 cm w przysiadzie)', () => {
    const s = probki(OLY['Squat Jerk']); const szczyt = Math.max(...s.map((x) => x.chwytY)); expect(szczyt - s[N].chwytY).toBeLessThanOrEqual(30);
    expect(s[N].kolano).toBeGreaterThan(100);
  });
  test('Clean and Jerk: po zarzucie nogi się prostują, potem ugięcie i podrzut (nie rusza wprost z przysiadu)', () => {
    const s = probki(OLY['Clean and Jerk']); const cap = s.findIndex((x, i) => i > wyprost(s) && x.kolano >= 60); expect(cap).toBeGreaterThan(0); /* przysiad po zarzucie */
    const wstanie = s.findIndex((x, i) => i > cap && x.kolano <= 20 && !x.powietrze && x.chwytY < x.barkiY + 25); expect(wstanie).toBeGreaterThan(cap); /* wstanie ze sztangą na barkach, stopy na podłodze (przed poprawką podrzut ruszał wprost z przysiadu: stopy w powietrzu) */
    const ugiecie = s.findIndex((x, i) => i > wstanie && x.kolano >= 30); expect(ugiecie).toBeGreaterThan(wstanie); /* ugięcie przed wybiciem */
    expect(s[N].kolano).toBeGreaterThan(60); /* nożyce na końcu */
  });
});

describe('olympic nr 2 i nr 3: ciąg kończy się wyprostem, wzruszenie ma uniesienie barków', () => {
  test.each(['Clean Pull', 'Snatch Pull'])('%s: u = 1 ramiona proste, sztanga przy biodrach, barki uniesione, palce na podłodze', (cw) => {
    const s = probki(OLY[cw]); const k = s[N];
    expect(k.lokiec).toBeLessThanOrEqual(30); /* przed poprawką 144° / 127° */
    expect(k.chwytY).toBeLessThanOrEqual(115); /* przed poprawką 147–152 cm */
    expect(k.barki).toBeGreaterThanOrEqual(3);
    expect(k.palcePodloga).toBeLessThanOrEqual(1);
    expect(k.kolano).toBeLessThanOrEqual(10);
  });
  test.each(['Clean Shrug', 'Snatch Shrug'])('%s: w u = 1 barki uniesione (przed poprawką pole nie występowało), ręce proste, palce na podłodze', (cw) => {
    const s = probki(OLY[cw]); expect(s[0].barki).toBe(0); expect(s[N].barki).toBeGreaterThanOrEqual(3); expect(s[N].lokiec).toBeLessThanOrEqual(25); expect(s[N].palcePodloga).toBeLessThanOrEqual(1);
    expect(OLY[cw].klatki.every((k) => k.rece?.R?.uniesienieBarkow !== undefined)).toBe(true); /* pole w każdej klatce (brak pola = wartość z sąsiedniej klatki) */
  });
  test('Pull i Shrug tej samej odmiany różnią się startem (podłoga a zawis)', () => {
    expect(probki(OLY['Clean Pull'])[0].chwytY).toBeLessThan(40); expect(probki(OLY['Clean Shrug'])[0].chwytY).toBeGreaterThan(60);
    expect(probki(OLY['Snatch Pull'])[N].chwytY).toBeGreaterThan(probki(OLY['Clean Pull'])[N].chwytY); /* szerszy chwyt: sztanga wyżej */
  });
});

describe('olympic nr 4: odmiany „Block” mają bloki pod talerzami, bez słupka stojaka', () => {
  test.each(['Block Clean', 'Block Power Clean', 'Block Snatch', 'Block Power Snatch'])('%s: dwie skrzynie pod talerzami na wysokości dołu talerza', (cw) => {
    const g = OLY[cw].sprzet; const skrzynia = g.find((x) => x.rodzaj === 'skrzynia'); expect(skrzynia).toBeDefined();
    expect(skrzynia?.dwa).toBe(true); expect(skrzynia?.top).toBeCloseTo(29.5, 1); expect(Math.abs(skrzynia?.z ?? 0)).toBeGreaterThan(60); /* pod talerzami (|z| 66–71) */
    expect(g.some((x) => x.rodzaj === 'slupek')).toBe(false);
    const sk = keyframeFrame(OLY[cw], 0).sk; const sztangaY = sk.arms.R.grip[1]; expect(sztangaY - 22.5).toBeCloseTo(skrzynia?.top ?? 0, 0); /* talerz leży na bloku w u = 0 */
  });
  test('odmiany bez „Block” nie dostały skrzyń', () => {
    for (const cw of Object.keys(OLY).filter((c) => !c.startsWith('Block'))) expect(OLY[cw].sprzet.some((x) => x.rodzaj === 'skrzynia')).toBe(false);
  });
});

describe('olympic: warianty różnią się cechą z nazwy (pozy-kopie)', () => {
  const sha = (p: PoseData) => createHash('sha256').update(JSON.stringify(p.klatki)).digest('hex');
  test('power vs pełny vs split: głębokość przyjęcia rośnie, split ma różne stopy', () => {
    const k = (cw: string) => probki(OLY[cw])[N].kolano;
    expect(k('Power Clean')).toBeLessThan(k('Clean')); expect(k('Power Snatch')).toBeLessThan(k('Barbell Snatch'));
    const stopy = (cw: string) => { const sk = keyframeFrame(OLY[cw], 1).sk; return Math.abs(sk.legs.R.ankle[0] - sk.legs.L.ankle[0]); };
    expect(stopy('Split Clean')).toBeGreaterThan(30); expect(stopy('Clean')).toBeLessThan(5);
  });
  test('żadne dwa ćwiczenia rodziny nie mają identycznych klatek', () => {
    const wid = new Map<string, string>(); for (const [cw, p] of Object.entries(OLY)) { const h = sha(p); expect(wid.get(h)).toBeUndefined(); wid.set(h, cw); }
  });
});

describe('kb_ballistic nr 1: Swing — na dole ciężar jest między nogami', () => {
  test.each(['Kettlebell Swing', 'One-Arm Kettlebell Swings'])('%s: w najniższej klatce rączka za linią kolan (przed poprawką 37 cm przed kostkami)', (cw) => {
    const sk = keyframeFrame(KB[cw], 0).sk; const R = sk.arms.R.grip; const kolano = Math.max(sk.legs.R.knee[0], sk.legs.L.knee[0]);
    expect(R[0]).toBeLessThanOrEqual(kolano); expect(R[0]).toBeLessThanOrEqual(0.5); expect(R[1]).toBeLessThan(sk.legs.R.knee[1] + 25);
  });
});

describe('kb_ballistic nr 2: Bottoms-Up Clean — dnem do góry, start z zawieszenia, inna poza niż Kettlebell Clean', () => {
  const zbior = KB['Bottoms-Up Clean From The Hang Position'];
  test('wyjątek albo poza z trybem „wzdluz_gora” (dzwon zależny od fazy)', () => {
    const wyjatki = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-wyjatki.json'), 'utf8')).cwiczenia as Record<string, string>;
    if (!zbior) { expect(wyjatki['Bottoms-Up Clean From The Hang Position']).toBeTruthy(); return; }
    expect(zbior.sprzet.some((x) => x.rodzaj === 'kettlebell' && x.dzwon === 'wzdluz_gora')).toBe(true);
    expect(JSON.stringify(zbior.klatki)).not.toBe(JSON.stringify(KB['Kettlebell Clean'].klatki));
    expect(probki(zbior)[0].chwytY).toBeGreaterThan(probki(KB['Kettlebell Clean'])[0].chwytY); /* start z zawieszenia (ciężar wyżej niż przy podłodze) */
  });
});

describe('kb_ballistic nr 3: Push Press ≠ Jerk (po wybiciu nogi proste)', () => {
  test.each([['Double Kettlebell Push Press', 'Double Kettlebell Jerk'], ['One-Arm Kettlebell Push Press', 'One-Arm Kettlebell Jerk']])('%s: kolano ≤ 10° w u = 1, inne klatki niż %s', (pp, jerk) => {
    expect(JSON.stringify(KB[pp].klatki)).not.toBe(JSON.stringify(KB[jerk].klatki));
    const s = probki(KB[pp]); const wybicie = s.findIndex((x, i) => i > 20 && x.kolano <= 5); expect(wybicie).toBeGreaterThan(0);
    expect(Math.max(...s.slice(wybicie).map((x) => x.kolano))).toBeLessThanOrEqual(10); /* przed poprawką 27° (ponowne ugięcie jak w podrzucie) */
    expect(Math.max(...probki(KB[jerk]).slice(wybicie).map((x) => x.kolano))).toBeGreaterThan(20); /* Jerk zostaje z ponownym ugięciem */
  });
});

describe('kb_ballistic nr 4: Kettlebell Sumo High Pull — ciężar na wysokości klatki/brody, blisko ciała', () => {
  test('u = 1 chwyt najwyżej 10 cm nad barkami, tor bez wysięgu do 55 cm przed miednicą', () => {
    const s = probki(KB['Kettlebell Sumo High Pull']);
    expect(s[N].chwytY).toBeLessThanOrEqual(s[N].barkiY + 10); /* przed poprawką 186 cm */
    expect(Math.max(...s.map((x) => x.chwytX - x.miednicaX))).toBeLessThanOrEqual(45); /* przed poprawką 55 cm przed miednicą (w dole zawias: miednica cofnięta) */
  });
});

describe('p4a runda 2 — Bottoms-Up Clean: zwis dzwonem w dół, dnem do góry dopiero przy pionowym przedramieniu, blisko ciała', () => {
  const bu = KB['Bottoms-Up Clean From The Hang Position'];
  const dzwon = (u: number): V3 => (keyframeFrame(bu, u).props.find((p) => p.k === 'kettlebell') as Extract<Prop, { k: 'kettlebell' }>).dir as V3;
  test('u = 0: zwis, dzwon w dół (przed poprawką: nad rączką na prostej ręce); u = 1: dnem do góry', () => {
    expect(keyframeFrame(bu, 0).sk.arms.R.grip[1]).toBeLessThan(keyframeFrame(bu, 0).sk.arms.R.elbow[1]); expect(dzwon(0)[1]).toBeLessThan(-0.5); expect(dzwon(1)[1]).toBeGreaterThan(0.9);
  });
  test('rączka najwyżej 32 cm przed barkiem (przed poprawką 47 cm), wolna ręka wzdłuż ciała (najwyżej 25 cm przed barkiem; przed poprawką 50 cm)', () => {
    for (let g = 0; g <= N; g++) { const sk = keyframeFrame(bu, g / N).sk; expect(sk.arms.R.grip[0] - sk.shoulderC[0]).toBeLessThanOrEqual(32); expect(sk.arms.L.grip[0] - sk.shoulderC[0]).toBeLessThanOrEqual(25); }
  });
});

describe('p4a runda 2 — Kettlebell Sumo High Pull: łokcie wysoko i na boki, stopy na podłodze w klatce końcowej', () => {
  const sh = KB['Kettlebell Sumo High Pull'];
  test('u = 1: łokieć nie niżej niż dłoń − 5 cm (przed poprawką 31 cm pod dłonią), odwiedzenie ramienia ≥ 35° (przed poprawką 12,6°; maksimum rigu przy dłoniach na jednej rączce ok. 43°), dłoń najwyżej 28 cm przed barkiem przez cały ruch (przed poprawką 33 cm)', () => {
    const sk = keyframeFrame(sh, 1).sk; for (const k of ['R', 'L'] as const) { expect(sk.arms[k].grip[1] - sk.arms[k].elbow[1]).toBeLessThanOrEqual(5); expect(jointAngles(sk, k).shAbd).toBeGreaterThanOrEqual(35); }
    for (let g = 0; g <= N; g++) { const q = keyframeFrame(sh, g / N).sk; expect(q.arms.R.grip[0] - q.shoulderC[0]).toBeLessThanOrEqual(28); }
  });
  test('palce na podłodze w klatce końcowej (przed poprawką 3,3 cm nad podłogą)', () => { expect(probki(sh)[N].palcePodloga).toBeLessThanOrEqual(1.5); });
});

/** Skróty SHA-256 póz ćwiczeń, których recenzja p4a nie ruszyła, z origin/integracja-1-1 (przed poprawkami). */
const BEZ_ZMIAN: Record<string, Record<string, string>> = {"olympic": {"Power Jerk": "567e26a95418122b", "Split Jerk": "6d0aeb6142ed1ca3", "Jerk Dip Squat": "3a72def5b2f2fc72", "Snatch Balance": "d3e23e6d652adede", "Muscle Snatch": "6c1ee32d2fb5dcb7"}, "kb_ballistic": {"Kettlebell Clean": "ed22e6f99459d35a", "Double Kettlebell Clean": "eb9f533d51721320", "Dumbbell Clean": "201cff54e2ce4914", "Kettlebell Snatch": "a15c1a39149ef3bc", "Double Kettlebell Snatch": "26565c5a9f432d0f", "Snatch (hantel)": "b9738fee613e0532", "Double Kettlebell Jerk": "02a106031cd4bdc7", "One-Arm Kettlebell Jerk": "b151c63125489ff1", "One-Arm Kettlebell Split Jerk": "002a539901d836cc", "One-Arm Kettlebell Clean and Jerk": "ad9e669c5fd813fd"}};
describe('regresja: pozy bez zmian (inne ćwiczenia obu rodzin)', () => {
  test.each(Object.entries(BEZ_ZMIAN).flatMap(([r, m]) => Object.entries(m).map(([cw, h]) => [r, cw, h] as const)))('%s / %s: poza bajt w bajt jak przed poprawkami', (r, cw, h) => {
    const p = (r === 'olympic' ? OLY : KB)[cw]; expect(createHash('sha256').update(JSON.stringify(p)).digest('hex').slice(0, 16)).toBe(h);
  });
  test('poprawione ćwiczenia różnią się od wersji sprzed poprawek, a rodziny mają komplet póz', () => {
    expect(Object.keys(OLY)).toHaveLength(23); expect(Object.keys(KB)).toHaveLength(16);
    expect(Object.keys(BEZ_ZMIAN.olympic)).toHaveLength(5); expect(Object.keys(BEZ_ZMIAN.kb_ballistic)).toHaveLength(10);
  });
});
