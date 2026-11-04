/*
 * Rodzina core_floor przed recenzją niezależną (fala F2, linia 1.1, 04.11.2026): dane póz czytane wprost z pliku (rodzina niepodłączona, status „planned”).
 * K2 pokrycie póz (7 dorobionych), K5 tor (ćwiczenia bez ciężaru: ślad = miednica, K4; kształt z geometrii), K7 styki z podłożem, K8 zakres stawów z tekstów kart.
 * Znaleziska wspólne H-A/H-B/H-C: tu dotyczą tylko Cable Crunch, Cable Reverse Crunch (wyciąg → `nosi`, ślad w miednicy) i Machine Crunch (dźwignia → `nosi`); reszta bez ciężaru.
 */
import * as fs from 'fs';
import * as path from 'path';
import { keyframeFrame, jointAngles, type PoseData } from '@/lib/figures/v2';

const P: Record<string, PoseData> = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/core_floor.json'), 'utf8')).cwiczenia;
const GEN = fs.readFileSync(path.join(__dirname, '../scripts/figures/agent-pozy/core_floor.mjs'), 'utf8');
const KEYS = Object.keys(P);
const N = 160; const US = Array.from({ length: N + 1 }, (_, i) => i / N);
const frame = (k: string, u: number) => keyframeFrame(P[k], u);
const A = (k: string, u: number) => jointAngles(frame(k, u).sk, 'R');
const DORABIANE = ['Stability Ball Crunch', 'Crunch - Legs On Exercise Ball', 'Cable Reverse Crunch', 'Suspended Reverse Crunch', 'Cable Crunch', 'Machine Crunch'];

/** Zawrócenia pionowego ruchu miednicy poza klatkami kluczowymi (±0,02 u) = wybrzuszenie z interpolacji. */
function zawroceniaPoza(k: string, y: number[]): number {
  const kf = P[k].klatki.map(f => f.u); let sg = 0, n = 0;
  for (let i = 1; i < y.length; i++) { const dy = y[i] - y[i - 1]; if (Math.abs(dy) < 0.02) continue; const s = Math.sign(dy); if (sg && s !== sg && Math.min(...kf.map(x => Math.abs(x - i / N))) > 0.02) n++; sg = s; }
  return n;
}

describe('core_floor: pokrycie póz (K2)', () => {
  test('27 póz: 21 z poprzedniej wersji + 6 dorobionych; Stability Ball Knee Tuck celowo bez pozy (kandydat K3: piłka toczy się, silnik ma piłkę nieruchomą)', () => {
    expect(KEYS).toHaveLength(27); for (const k of DORABIANE) expect(P[k]).toBeDefined(); expect(KEYS).not.toContain('Stability Ball Knee Tuck');
    expect(GEN).toMatch(/Stability Ball Crunch/); expect(GEN).not.toMatch(/'Stability Ball Knee Tuck': \(\)/);
  });
  test('sprzęt: podłoga, piłka, wyciąg, zawieszenie, ławka, dźwignia — bez hantli i gryfu (H-A/H-B niedotyczące)', () => {
    for (const k of KEYS) for (const g of P[k].sprzet) expect([k, ['podloga', 'pilka_gimnastyczna', 'wyciag', 'zawieszenie', 'lawka', 'dzwignia'].includes(g.rodzaj)]).toEqual([k, true]);
  });
});

describe('core_floor: tor (K5, ślad = miednica dla ćwiczeń bez ciężaru)', () => {
  test.each(KEYS)('%s: miednica nie ma zawróceń poza klatkami kluczowymi (bez wybrzuszeń z interpolacji)', k => { expect(zawroceniaPoza(k, US.map(u => frame(k, u).sk.pelvis[1]))).toBe(0); });
  test('miara potrafi paść: tor z falą między klatkami ma zawrócenia poza klatką', () => { expect(zawroceniaPoza('Crunch', US.map(u => frame('Crunch', u).sk.pelvis[1] + 3 * Math.sin(u * 60)))).toBeGreaterThan(0); });
  test.each(['Cable Crunch', 'Cable Reverse Crunch', 'Machine Crunch', 'Suspended Reverse Crunch'])('%s: kostki/dłonie pozostają w zasięgu sprzętu (przełożenie ślad = miednica, zasięg ramienia ≤ 64,5 cm od barku)', k => {
    for (const u of US) { const f = frame(k, u); for (const s of ['R', 'L'] as const) { const g = f.sk.arms[s].grip, sh = f.sk.arms[s].shoulder; expect([k, u, Math.hypot(g[0] - sh[0], g[1] - sh[1], g[2] - sh[2]) <= 64.5]).toEqual([k, u, true]); } }
  });
});

describe('core_floor: styki z podłożem (K7, co 0,0125 u)', () => {
  test.each(KEYS)('%s: stopy i dłonie nie pod podłogą > 1 cm', k => {
    for (const u of US) { const f = frame(k, u); for (const s of ['R', 'L'] as const) { const l = f.sk.legs[s]; expect([k, u, s, Math.min(l.toe[1], l.heel[1], l.ankle[1], f.sk.arms[s].grip[1]) >= -1]).toEqual([k, u, s, true]); } }
  });
  test('miara potrafi paść: stopy Dead Bug obniżone o 6 cm schodzą pod podłogę (najniższy punkt 3,6 cm)', () => { const m = Math.min(...US.map(u => { const f = frame('Dead Bug', u); return Math.min(...(['R', 'L'] as const).map(x => Math.min(f.sk.legs[x].toe[1], f.sk.legs[x].heel[1], f.sk.legs[x].ankle[1]))); })); expect(m - 6).toBeLessThan(-1); });
});

describe('core_floor: zakres stawów zgodny z tekstem (K8)', () => {
  test('Superman: wyprost biodra w granicach ruchu (≥ −17°), nogi i ręce proste (kolano, łokieć ≤ 15°)', () => { expect(A('Superman', 1).hip).toBeGreaterThanOrEqual(-17); expect(A('Superman', 1).knee).toBeLessThanOrEqual(15); expect(A('Superman', 1).elbow).toBeLessThanOrEqual(15); });
  test('Dead Bug i Hollow Hold: ręce proste (łokieć ≤ 15°); Hollow Hold nogi proste (kolano ≤ 15°); Lying Leg Raise nogi proste i biodro kończy ≥ 85°', () => {
    expect(A('Dead Bug', 1).elbow).toBeLessThanOrEqual(15); expect(A('Hollow Hold', 0).elbow).toBeLessThanOrEqual(15); expect(A('Hollow Hold', 0).knee).toBeLessThanOrEqual(15);
    expect(A('Lying Leg Raise', 1).knee).toBeLessThanOrEqual(15); expect(A('Lying Leg Raise', 1).hip).toBeGreaterThanOrEqual(85);
  });
  test('V-Up, Cocoons, Leg Pull-In: na końcu biodro zgięte ≥ 110° (kolana/nogi blisko klatki)', () => { for (const k of ['V-Up', 'Cocoons', 'Leg Pull-In', 'Reverse Crunch', 'Cable Reverse Crunch', 'Suspended Reverse Crunch']) expect([k, A(k, 1).hip >= 110]).toEqual([k, true]); });
  test('Reverse Crunch i wariant na wyciągu: biodro rośnie ≥ 25° (miednica prowadzi ruch)', () => { for (const k of ['Reverse Crunch', 'Cable Reverse Crunch']) expect([k, A(k, 1).hip - A(k, 0).hip >= 25]).toEqual([k, true]); });
  test('Crunch z łydkami na piłce: kolano ≈ 90–100° (łydki na piłce), biodro zgięte 85–120°', () => { const k = 'Crunch - Legs On Exercise Ball'; for (const u of [0, 1]) { expect(A(k, u).knee).toBeGreaterThanOrEqual(85); expect(A(k, u).knee).toBeLessThanOrEqual(100); expect(A(k, u).hip).toBeGreaterThanOrEqual(85); expect(A(k, u).hip).toBeLessThanOrEqual(120); } });
  test('Stability Ball Crunch: kolana zgięte 70–100° (stopy płasko), tułów unosi się (biodro rośnie ≥ 15°)', () => { const k = 'Stability Ball Crunch'; expect(A(k, 0).knee).toBeGreaterThanOrEqual(70); expect(A(k, 0).knee).toBeLessThanOrEqual(100); expect(A(k, 1).hip - A(k, 0).hip).toBeGreaterThanOrEqual(15); });
  test('Cable Crunch (klęk): biodro rośnie ≥ 45° (zwijanie do przodu), kolano 105° przez cały ruch; Machine Crunch: biodro rośnie ≥ 25°', () => {
    expect(A('Cable Crunch', 1).hip - A('Cable Crunch', 0).hip).toBeGreaterThanOrEqual(45); expect(A('Cable Crunch', 0.5).knee).toBeCloseTo(A('Cable Crunch', 0).knee, 0); expect(A('Machine Crunch', 1).hip - A('Machine Crunch', 0).hip).toBeGreaterThanOrEqual(25);
  });
  test('Suspended Reverse Crunch: ręce proste (łokieć ≤ 20°), kolano na końcu ≥ 110° (kolana do klatki)', () => { expect(A('Suspended Reverse Crunch', 0).elbow).toBeLessThanOrEqual(20); expect(A('Suspended Reverse Crunch', 1).knee).toBeGreaterThanOrEqual(110); });
  test('miara potrafi paść: Dead Bug nie kończy ruchu z biodrem ≥ 110°', () => { expect(A('Dead Bug', 1).hip).toBeLessThan(110); });
});
