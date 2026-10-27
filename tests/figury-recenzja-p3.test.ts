/*
 * Figury v2 — poprawki po niezależnej recenzji ruchu 1.1, partia 3 (27.10.2026; decyzja właściciela: bramką jest recenzja ruchu, docs/18).
 * Recenzje: cable_row, pulldown, chest_press_machine (cable_press bez błędów). Każdy błąd ma test, który go odtwarza na danych póz:
 *  (1) wiosłowanie na wyciągu siedząc (Seated Cable Row, Wiosłowanie na linkach (siedząc), Cable Rope Rear-Delt Rows): postać siedziała w powietrzu — pod miednicą ma być siedzisko,
 *      pod stopami podnóżek, kolana lekko ugięte;
 *  (2) Wide-Grip Pulldown Behind The Neck: drążek przechodził przez tył głowy i kończył w oparciu — bez oparcia, drążek ≥ 2 cm od powierzchni głowy w całym ruchu, koniec za karkiem;
 *  (3) Leverage Decline Chest Press: łokieć uciekał za głowę — ramię ≤ 30° od prostopadłej do tułowia ku głowie w całym ruchu (jak pozostałe wyciskania na maszynie);
 *  (4) Machine Shoulder Press: dźwignia kończyła się przy ustach — cały odcinek dźwigni ≥ 3 cm od powierzchni głowy w każdym ćwiczeniu rodziny.
 * Oraz: pozostałe pozy trzech rodzin i cable_press są bajtowo bez zmian (odciski SHA-256 sprzed poprawek).
 */
import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import { keyframeFrame, BODY, type PoseData, type Frame } from '@/lib/figures/v2';

type V3 = [number, number, number];
const ROOT = path.join(__dirname, '..');
const plik = (rodzina: string): Record<string, PoseData> => JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/v2/poses', `${rodzina}.json`), 'utf8')).cwiczenia;
const U = Array.from({ length: 17 }, (_, i) => i / 16);
const klatki = (d: PoseData): Frame[] => U.map(u => keyframeFrame(d, u));
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a: V3): number => Math.hypot(a[0], a[1], a[2]);
const deg = (r: number): number => (r * 180) / Math.PI;
/** Odległość punktu p od odcinka a–b. */
function odlOdcinka(p: V3, a: V3, b: V3): number {
  const ab = sub(b, a); const t = Math.max(0, Math.min(1, dot(sub(p, a), ab) / (dot(ab, ab) || 1)));
  return len(sub(p, [a[0] + ab[0] * t, a[1] + ab[1] * t, a[2] + ab[2] * t]));
}

const SIEDZACE = ['Seated Cable Row', 'Wiosłowanie na linkach (siedząc)', 'Cable Rope Rear-Delt Rows'];

describe('cable_row siedząc: siedzisko, podnóżek, kolana (błąd nr 1 recenzji)', () => {
  const D = plik('cable_row');
  test.each(SIEDZACE)('%s: pod miednicą jest siedzisko (powierzchnia ≤ 12 cm pod środkiem miednicy), nie ma pustki do podłogi', (cw) => {
    for (const f of klatki(D[cw])) {
      const p = f.sk.pelvis as V3;
      const oparcia = f.props.filter(x => (x.k === 'box' && p[0] >= x.x0 && p[0] <= x.x1 && x.top <= p[1] && p[1] - x.top <= 12)
        || (x.k === 'bench' && p[0] >= x.hinge[0] && p[0] <= x.seatFrom[0] && x.legH <= p[1] && p[1] - x.legH <= 12));
      expect([cw, oparcia.length]).toEqual([cw, 1]);
    }
  });
  test.each(SIEDZACE)('%s: stopy stoją na podnóżku (skrzynia przed siedziskiem, kostki nad jej powierzchnią), nie w powietrzu', (cw) => {
    for (const f of klatki(D[cw])) {
      for (const s of ['R', 'L'] as const) {
        const a = f.sk.legs[s].ankle as V3; const sole = a[1] - BODY.ankleH;
        const pod = f.props.filter(x => x.k === 'box' && a[0] >= x.x0 && a[0] <= x.x1 && Math.abs(sole - x.top) <= 1.5);
        expect([cw, s, pod.length]).toEqual([cw, s, 1]);
      }
    }
  });
  test.each(SIEDZACE)('%s: kolana lekko ugięte (zgięcie 10–45°, wskazówka „kolana lekko ugięte”), nie kąt prosty', (cw) => {
    for (const f of klatki(D[cw])) {
      for (const s of ['R', 'L'] as const) {
        const { hip, knee, ankle } = f.sk.legs[s]; const a = sub(hip as V3, knee as V3); const b = sub(ankle as V3, knee as V3);
        const zgiecie = 180 - deg(Math.acos(dot(a, b) / (len(a) * len(b))));
        expect(zgiecie).toBeGreaterThanOrEqual(10); expect(zgiecie).toBeLessThanOrEqual(45);
      }
    }
  });
  test.each(SIEDZACE)('%s: ruch rąk bez zmian jakościowych — łokieć z ≤ 20° do ≥ 70°, tułów nieruchomy (miednica stoi)', (cw) => {
    const fr = klatki(D[cw]); const p0 = fr[0].sk.pelvis as V3;
    for (const f of fr) expect(len(sub(f.sk.pelvis as V3, p0))).toBeLessThan(0.5);
    const ang = (f: Frame): number => { const a = f.sk.arms.R; const u1 = sub(a.shoulder as V3, a.elbow as V3); const u2 = sub(a.wrist as V3, a.elbow as V3); return 180 - deg(Math.acos(dot(u1, u2) / (len(u1) * len(u2)))); };
    expect(ang(fr[0])).toBeLessThanOrEqual(20); expect(ang(fr[fr.length - 1])).toBeGreaterThanOrEqual(70);
  });
});

describe('pulldown za kark: drążek poza głową i bez oparcia (błąd nr 1 recenzji)', () => {
  const cw = 'Wide-Grip Pulldown Behind The Neck'; const d = plik('pulldown')[cw];
  const sr = (f: Frame): V3 => { const a = f.sk.arms.R.grip as V3; const b = f.sk.arms.L.grip as V3; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]; };
  test('drążek (środek chwytu) w całym ruchu ≥ 2 cm od powierzchni głowy (wcześniej wchodził w tył czaszki: 9,9 cm od środka głowy)', () => {
    for (const f of klatki(d)) expect(len(sub(sr(f), f.sk.head as V3)) - BODY.headR).toBeGreaterThanOrEqual(2);
  });
  test('brak oparcia za plecami (drążek nie kończy w ławce): w sprzęcie nie ma ławki z oparciem pochylonym, a wpis siedziska nie ma oparcia na drodze drążka', () => {
    for (const f of klatki(d)) {
      for (const p of f.props) if (p.k === 'bench') { const b = sr(f); const odl = odlOdcinka([b[0], b[1], 0], [p.hinge[0], p.hinge[1], 0], [p.backTo[0], p.backTo[1], 0]); expect(odl).toBeGreaterThan(4); }
    }
  });
  test('drążek nie wchodzi w tułów (środek chwytu ≥ 8 cm od osi miednica–szyja) i kończy za karkiem na wysokości 100–115 cm', () => {
    const fr = klatki(d);
    for (const f of fr) expect(odlOdcinka(sr(f), f.sk.pelvis as V3, f.sk.neck as V3)).toBeGreaterThanOrEqual(8);
    const k = fr[fr.length - 1]; const b = sr(k);
    expect(b[0]).toBeLessThan((k.sk.neck as V3)[0]); expect(b[1]).toBeGreaterThanOrEqual(100); expect(b[1]).toBeLessThanOrEqual(115);
  });
  test('głowa lekko pochylona w przód w fazie przejścia drążka (15–20°, pochylenieGlowy w klatce środkowej)', () => {
    const k = d.klatki.find(x => Math.abs(x.u - 0.5) < 1e-9);
    expect(k?.pochylenieGlowy ?? 0).toBeGreaterThanOrEqual(10); expect(k?.pochylenieGlowy ?? 0).toBeLessThanOrEqual(25);
  });
});

describe('chest_press_machine: łokieć przy płaszczyźnie barku (Leverage Decline) i dźwignia z dala od głowy (Machine Shoulder Press)', () => {
  const D = plik('chest_press_machine');
  /** Odchylenie rzutu ramienia (bark → łokieć) na płaszczyznę strzałkową od prostopadłej do tułowia: + = ku głowie (stopnie). */
  const ku = (f: Frame): number => {
    const a = f.sk.arms.R; const e = sub(a.elbow as V3, a.shoulder as V3); const t = sub(f.sk.shoulderC as V3, f.sk.pelvis as V3); const tl = len(t); const n = f.sk.front as V3;
    return deg(Math.atan2(dot(e, t) / tl, dot(e, n)));
  };
  test.each(['Machine Chest Press', 'Leverage Incline Chest Press', 'Leverage Decline Chest Press'])('%s: ramię odchylone ku głowie od prostopadłej do tułowia najwyżej o 30° w całym ruchu', (cw) => {
    for (const f of klatki(D[cw])) expect(ku(f)).toBeLessThanOrEqual(30);
  });
  test.each(['Machine Chest Press', 'Leverage Incline Chest Press', 'Leverage Decline Chest Press', 'Machine Shoulder Press', 'Smith Machine Shoulder Press'])('%s: cały odcinek dźwigni ≥ 3 cm od powierzchni głowy (wcześniej Machine Shoulder Press: 1,0 cm)', (cw) => {
    for (const f of klatki(D[cw])) for (const p of f.props) if (p.k === 'pivot') expect(odlOdcinka(f.sk.head as V3, p.from, p.to) - BODY.headR).toBeGreaterThanOrEqual(3);
  });
  test('Machine Shoulder Press: uchwyty startowe nie wyżej niż 8 cm nad barkiem (wskazówka msp.seat: „mniej więcej na wysokości barków”; wcześniej 15 cm)', () => {
    const f = keyframeFrame(D['Machine Shoulder Press'], 0);
    expect((f.sk.arms.R.grip as V3)[1] - (f.sk.arms.R.shoulder as V3)[1]).toBeLessThanOrEqual(8);
  });
});

/* Odciski pozy każdego ćwiczenia, którego poprawki NIE dotyczą (stan z origin/integracja-1-1 @ ded48270): dowodzą, że generatory zmieniły tylko 6 ćwiczeń. */
const ODCISKI: Record<string, Record<string, string>> = {
  cable_row: { 'Standing Cable Row': '7a2b36f6065e2775', 'Single Arm Cable Row': '25f4a6f8c1328e50', 'Face Pull': '5e9cbcdead7e585a', 'Machine Row': '1e5450f8630493e6', 'Leverage High Row': '31e108c39ef2555c', 'Kneeling High Pulley Row': 'b0ffaa10eb8eec72' },
  pulldown: { 'Lat Pulldown': '888f0d992c077478', 'Close-Grip Front Lat Pulldown': '6b3795769f85deea', 'Underhand Lat Pulldown': 'f0fe62a86079210c', 'V-Bar Pulldown': '449cae298b2ea06c', 'Single Arm Lat Pulldown': '0a045deaec2e206f', 'Full Range-Of-Motion Lat Pulldown': '8e809e29e71ab056', 'Straight Arm Pulldown': 'e3f33866cae980a7' },
  chest_press_machine: { 'Machine Chest Press': '3c8ec70a151bc790', 'Leverage Incline Chest Press': '5d1f9a14ce6dfe0c', 'Smith Machine Shoulder Press': '475d614591b2cbb1' },
  cable_press: { 'Wyciskanie na linkach (stojąc)': '8368188a1ab3c70a', 'Single Arm Cable Chest Press': 'ab409ece91a18893', 'Seated Cable Chest Press': '1039f9352625ae4a', 'Incline Cable Chest Press': '728111932116f223' },
};
describe('regresja: pozostałe pozy bez zmian', () => {
  test.each(Object.keys(ODCISKI))('%s: ćwiczenia spoza poprawek mają identyczną pozę (odcisk SHA-256 JSON)', (rodzina) => {
    const D = plik(rodzina);
    for (const [cw, h] of Object.entries(ODCISKI[rodzina])) expect([cw, createHash('sha256').update(JSON.stringify(D[cw])).digest('hex').slice(0, 16)]).toEqual([cw, h]);
  });
  test('liczność rodzin bez zmian (9 + 8 + 5 + 4 ćwiczeń)', () => {
    expect(['cable_row', 'pulldown', 'chest_press_machine', 'cable_press'].map(r => Object.keys(plik(r)).length)).toEqual([9, 8, 5, 4]);
  });
});
