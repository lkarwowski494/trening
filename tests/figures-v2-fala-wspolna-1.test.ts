/*
 * Fala wspólna FW1 (kod wspólny figur v2, 04.11.2026; recenzje ruchu delt_raise i triceps, plan-recenzji-rodzin-v2 §3–§4).
 * H-A: oś hantla lewej ręki jest lustrem prawej (contract.ts withDumbbellAxis). H-B: oś hantla prostopadła do przedramienia także przy przedramieniu w poprzek ciała.
 * H-C: ślad toru (info.trail) przy chwycie dla gumy, talerza, kettlebell i łańcuchów w dłoniach (K4/W1b), nie w miednicy.
 * N-1 (noga ławki skośnej, draw.ts:194–195) NIE wchodzi do FW1: sprzeczne z tests/figury-p2-r2.test.ts („ławka z siedziskiem … nogi jak dotąd”) i zmienia ~37 póz niegotowych rodzin — decyzja koordynatora.
 * Narzędzia: styk-figur.ts i odstep-ciezaru.mjs (arkusz-slad.mjs) nie wywracają się bez info.load.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execFileSync } from 'child_process';
import { keyframeFrame, SIDES, type PoseData, type Prop } from '@/lib/figures/v2';
import { stykKlatki } from './helpers/styk-figur';

const ROOT = path.join(__dirname, '..');
const poza = (rodzina: string, cw: string): PoseData => JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/v2/poses', rodzina + '.json'), 'utf8')).cwiczenia[cw];
const US = Array.from({ length: 21 }, (_, i) => i / 20);
type V = number[];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dist = (a: V, b: V): number => Math.hypot(...sub(a, b));
/** Kąt między PROSTYMI (0–90°): znak wersora nie ma znaczenia. */
const katProstych = (a: V, b: V): number => { const c = Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (Math.hypot(...a) * Math.hypot(...b)); return Math.acos(Math.min(1, c)) * 180 / Math.PI; };
const hantel = (props: Prop[], s: 'R' | 'L') => props.find(p => p.k === 'dumbbell' && p.side === s) as Extract<Prop, { k: 'dumbbell' }>;
const lustroZ = (a: V): V => [a[0], a[1], -a[2]];

describe('H-A: oś hantla lewej ręki = lustro prawej (04.11.2026)', () => {
  test.each([['delt_raise', 'Lateral Raise (hantle)'], ['delt_raise', 'Upright Row (hantle)']])('%s / %s: kąt osi L względem lustra osi R ≤ 5° w każdej klatce', (rodz, cw) => {
    const d = poza(rodz, cw); let ile = 0;
    for (const u of US) { const f = keyframeFrame(d, u); const R = hantel(f.props, 'R').axis, L = hantel(f.props, 'L').axis; if (!R || !L) continue; ile++; expect([cw, u, katProstych(L, lustroZ(R)) <= 5]).toEqual([cw, u, true]); }
    expect(ile).toBeGreaterThan(10);
  });
  test('przypadek negatywny: miara potrafi paść — oś L skopiowana z R (bez lustra, jak przed poprawką) odbiega od lustra o > 10°', () => {
    const R = hantel(keyframeFrame(poza('delt_raise', 'Lateral Raise (hantle)'), 1).props, 'R').axis!;
    expect(katProstych([...R], lustroZ(R))).toBeGreaterThan(10);
  });
  test('ręka R bez zmian: oś prawej ręki Lateral Raise przy u = 1 wciąż jak w recenzji (przód–tył z lekkim pochyleniem)', () => {
    const R = hantel(keyframeFrame(poza('delt_raise', 'Lateral Raise (hantle)'), 1).props, 'R').axis!;
    expect(Math.abs(R[0])).toBeGreaterThan(0.9); expect(Math.abs(R[2])).toBeLessThan(0.35);
  });
});

describe('H-B: oś hantla prostopadła do przedramienia, także w poprzek ciała (04.11.2026)', () => {
  const kat = (f: ReturnType<typeof keyframeFrame>, s: 'R' | 'L'): number => { const a = f.sk.arms[s]; const ax = hantel(f.props, s).axis ?? [0, 0, 1]; return katProstych(ax, sub(a.wrist, a.elbow)); };
  test('Reverse Fly (hantle): przedramię w poprzek ciała jest w danych (kąt do osi z < 60°), a oś ≥ 60° od przedramienia w każdej klatce i ręce', () => {
    const d = poza('delt_raise', 'Reverse Fly (hantle)'); let wPoprzek = 0;
    for (const u of US) { const f = keyframeFrame(d, u); for (const s of SIDES) { const a = f.sk.arms[s]; if (katProstych([0, 0, 1], sub(a.wrist, a.elbow)) < 60) wPoprzek++; expect([u, s, kat(f, s) >= 60]).toEqual([u, s, true]); } }
    expect(wPoprzek).toBeGreaterThan(4);
  });
  test('oś ≥ 60° od przedramienia w każdym ćwiczeniu z hantlami rodziny delt_raise i curl (żadnego gryfu wzdłuż ręki)', () => {
    for (const rodz of ['delt_raise', 'curl']) {
      const file = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/v2/poses', rodz + '.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
      for (const [cw, d] of Object.entries(file)) { if (!d.sprzet.some(g => g.rodzaj === 'hantel' && !g.pionowo)) continue;
        for (const u of US) { const f = keyframeFrame(d, u); for (const s of SIDES) { if (!f.props.some(p => p.k === 'dumbbell' && p.side === s)) continue; const k = kat(f, s); if (k < 60) throw new Error(`${rodz} / ${cw} u=${u} ${s}: ${k.toFixed(0)}°`); } } }
    }
  });
  test('przypadek negatywny: przedramię w płaszczyźnie strzałkowej, obrót 0 — oś zostaje w tej płaszczyźnie (formuła sagittalna bez zmian, nie „w poprzek”)', () => {
    const f = keyframeFrame(poza('delt_raise', 'Lateral Raise (hantle)'), 0); const ax = hantel(f.props, 'R').axis!;
    expect(Math.abs(ax[2])).toBeLessThan(0.1);
  });
});

describe('H-C: ślad toru przy chwycie (guma, talerz, kettlebell, łańcuchy), nie w miednicy (04.11.2026)', () => {
  const slad = (d: PoseData, u: number) => { const f = keyframeFrame(d, u); return { f, t: f.info.trail as V }; };
  const platek = (f: ReturnType<typeof keyframeFrame>) => f.props.find(p => p.k === 'plate') as Extract<Prop, { k: 'plate' }>;
  const kb = (f: ReturnType<typeof keyframeFrame>) => f.props.find(p => p.k === 'kettlebell') as Extract<Prop, { k: 'kettlebell' }>;
  test.each([['delt_raise', 'Band Lateral Raise'], ['delt_raise', 'Band Upright Row'], ['triceps', 'Band Overhead Triceps Extension'], ['triceps', 'Band Skull Crusher']])('%s / %s: guma — ślad ≤ 3 cm od chwytu R w każdej klatce', (r, cw) => {
    const d = poza(r, cw); let max = 0, odMiednicy = 0;
    for (const u of US) { const { f, t } = slad(d, u); max = Math.max(max, dist(t, f.sk.arms.R.grip)); odMiednicy = Math.max(odMiednicy, dist(t, f.sk.pelvis)); }
    expect(max).toBeLessThanOrEqual(3); expect(odMiednicy).toBeGreaterThan(15);
  });
  test.each([['Front Plate Raise'], ['Car Drivers']])('delt_raise / %s: talerz oburącz — ślad ≤ 3 cm od środka talerza', cw => {
    const d = poza('delt_raise', cw); let max = 0, odMiednicy = 0;
    for (const u of US) { const { f, t } = slad(d, u); max = Math.max(max, dist(t, platek(f).c)); odMiednicy = Math.max(odMiednicy, dist(t, f.sk.pelvis)); }
    expect(max).toBeLessThanOrEqual(3); expect(odMiednicy).toBeGreaterThan(15);
  });
  test('triceps / Kettlebell Overhead Triceps Extension: kettlebell w obu dłoniach — ślad ≤ 3 cm od środka uchwytu', () => {
    const d = poza('triceps', 'Kettlebell Overhead Triceps Extension'); let max = 0, odMiednicy = 0;
    for (const u of US) { const { f, t } = slad(d, u); max = Math.max(max, dist(t, kb(f).c)); odMiednicy = Math.max(odMiednicy, dist(t, f.sk.pelvis)); }
    expect(max).toBeLessThanOrEqual(3); expect(odMiednicy).toBeGreaterThan(15);
  });
  test('triceps / Chain Handle Extension: łańcuchy w dłoniach (dwa uchwyty) — ślad ≤ 3 cm od chwytu R', () => {
    const d = poza('triceps', 'Chain Handle Extension'); let max = 0, odMiednicy = 0;
    for (const u of US) { const { f, t } = slad(d, u); max = Math.max(max, dist(t, f.sk.arms.R.grip)); odMiednicy = Math.max(odMiednicy, dist(t, f.sk.pelvis)); }
    expect(max).toBeLessThanOrEqual(3); expect(odMiednicy).toBeGreaterThan(15);
  });
  test('jedna ręka: guma, talerz i kettlebell z `trzyma` L — ślad przy chwycie L (nie R, nie miednica)', () => {
    const baza = poza('delt_raise', 'Band Lateral Raise');
    for (const gear of [{ rodzaj: 'guma', mocowanie: 'stopy', trzyma: 'L' }, { rodzaj: 'talerz', trzyma: 'L' }, { rodzaj: 'kettlebell', trzyma: 'L' }]) {
      const d = { ...baza, sprzet: [baza.sprzet[0], gear] } as unknown as PoseData;
      for (const u of [0, 0.5, 1]) { const f = keyframeFrame(d, u); expect([gear.rodzaj, u, dist(f.info.trail as V, f.sk.arms.L.grip) <= 3]).toEqual([gear.rodzaj, u, true]); }
    }
  });
  test('przypadek negatywny: guma między kostkami (nie w dłoniach) — ślad zostaje w miednicy', () => {
    const baza = poza('delt_raise', 'Band Lateral Raise'); const d = { ...baza, sprzet: [baza.sprzet[0], { rodzaj: 'guma', mocowanie: 'kostki' }] } as unknown as PoseData;
    const f = keyframeFrame(d, 0.5); expect(dist(f.info.trail as V, f.sk.pelvis)).toBeLessThan(0.01);
  });
  test('przypadek negatywny: ze sztangą (Barbell Curl + guma) ślad nie jest przesuwany do dłoni — bez śladu, tor = gryf (info.load)', () => {
    const baza = poza('curl', 'Barbell Curl'); const d = { ...baza, sprzet: [...baza.sprzet, { rodzaj: 'guma', mocowanie: 'stopy' }] } as unknown as PoseData;
    const f = keyframeFrame(d, 0.5); expect(f.info.load).toBeDefined(); expect(f.info.trail).toBeUndefined();
  });
});

describe('narzędzia bez info.load (guma, talerz, łańcuchy; 04.11.2026)', () => {
  test('styk-figur.ts: stykKlatki działa dla ćwiczenia bez hantla i gryfu (guma) — nie rzuca, odstęp jest liczbą', () => {
    const d = poza('delt_raise', 'Band Lateral Raise');
    for (const u of US) { const f = keyframeFrame(d, u); expect(f.info.load).toBeUndefined(); const s = stykKlatki(f, u); expect(Number.isNaN(s.odstep)).toBe(false); }
  });
  test('arkusz-slad.mjs: odstepCiezaru nie rzuca bez info.load i daje liczbę', () => {
    const kod = `
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { loadV2 } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-build.mjs'))};
import { odstepCiezaru } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/odstep-ciezaru.mjs'))};
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fw1-')); const { v2 } = loadV2(dir);
const d = JSON.parse(fs.readFileSync(${JSON.stringify(path.join(ROOT, 'lib/figures/v2/poses/delt_raise.json'))}, 'utf8')).cwiczenia['Band Lateral Raise'];
const w = [0, 0.5, 1].map(u => odstepCiezaru(v2, v2.keyframeFrame(d, u))); fs.rmSync(dir, { recursive: true });
console.log(JSON.stringify(w));`;
    const out = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', kod], { cwd: ROOT, env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8' }).trim());
    expect(out).toHaveLength(3); for (const x of out) expect(typeof x === 'number' && !Number.isNaN(x)).toBe(true);
  });
});
