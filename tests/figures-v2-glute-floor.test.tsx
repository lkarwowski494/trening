/*
 * (10.11.2026, partia 7 linii 1.1) Rodzina glute_floor (Donkey Kick, Fire Hydrant, Clamshell, Cable Kickback, Hip Extension with Bands, Machine Glute Kickback, Prone Flutter Kicks) po włączeniu:
 *  - rysunki: 7 ćwiczeń, dane póz = generator (błąd hext.mis.arch narysowany tam, gdzie karta go ma: Donkey Kick, Cable Kickback, Hip Extension with Bands + zestawy ogólne Machine Glute Kickback, Prone Flutter Kicks);
 *  - podpory (K7): noga podporowa na podłodze w kickbackach (≤ 1 cm), miednica na ławce w flutter kicks (≤ 1 cm), wnikanie ≤ 1 cm;
 *  - zakresy z reguł rodziny (figury-sens.json, progi z danych reguł, K5): rozstaw kolan ≥ 15 cm (Clamshell, Fire Hydrant), miednica nieruchoma ≤ 3 cm (flutter), biodro do linii ≤ 25° (Donkey Kick), plecy −10°…15°;
 *  - znak kąta biodra w kickbackach (przeprost ujemny — poza@2) i ukrycie kąta tam, gdzie ruch nie jest zgięciem biodra;
 *  - prezentacja: fazy, kierunek u, staw; nakładka: wpis bez elementów (powód w nagłówku overlay/glute_floor.ts).
 * Nie jest strażnikiem procesu — przypadek „gałąź z wcześniejszymi zmianami” (L-080) nie dotyczy.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { figureSpec, frameAt, keyframeFrame, measuredJoint, measuredAngle, phasesFor, DATA_UI, poseKeys, type PoseData } from '@/lib/figures/v2';
import { bodyColliders, equipColliders, gap } from '@/lib/figures/v2/colliders';
import { TECHNIQUE } from '@/lib/figures/v2/overlay';
import { techniquesOf } from '@/lib/figures/v2/ui';
import { jointAngles } from '@/lib/figures/v2/skeleton';
import { MIN_MEASURED_ROM } from '@/lib/figures/v2/poseData';

const ROOT = path.join(__dirname, '..');
const poses = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/v2/poses/glute_floor.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const reguly = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.glute_floor.reguly;
const US = Array.from({ length: 21 }, (_, i) => +(i / 20).toFixed(2));
const TOL = 1; /* cm — K7 */
const KICKBACKI = ['Cable Kickback', 'Hip Extension with Bands', 'Machine Glute Kickback'];
const klon = (k: string): PoseData => JSON.parse(JSON.stringify(poses[k]));
const dist = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/** Błędy podparcia nogi stojącej (L): podeszwa na podłodze ± 1 cm w każdym kadrze. */
const bladPodlogi = (d: PoseData): unknown[] => US.flatMap(u => { const l = keyframeFrame(d, u).sk.legs.L; const y = Math.min(l.heel[1], l.toe[1]); return Math.abs(y) > TOL ? [['podeszwa', u, y]] : []; });
/** Odstępy miednicy i uda od ławki (flutter): miednica przy ławce ≤ 1 cm, wnikanie ≤ 1 cm. */
function bladLawki(d: PoseData): unknown[] {
  const out: unknown[] = [];
  for (const u of US) {
    const f = keyframeFrame(d, u); const ec = equipColliders(f.props); const m: Record<string, number> = {};
    for (const b of bodyColliders(f.sk)) for (const e of ec) { const k = b.id.replace(/[RL]$/, '') + '>' + e.id; m[k] = Math.min(m[k] ?? Infinity, gap(b, e)); }
    for (const k of ['pelvis>benchBack', 'torso>benchBack', 'thigh>benchBack']) if (m[k] !== undefined && m[k] < -TOL) out.push([k, u, m[k]]);
    if (m['pelvis>benchBack'] === undefined || m['pelvis>benchBack'] > TOL) out.push(['miednica nie na ławce', u, m['pelvis>benchBack']]);
  }
  return out;
}

describe('glute_floor: rysunki i błędy', () => {
  test('7 ćwiczeń z rysunkiem v2, staw mierzony: biodro', () => {
    expect(poseKeys('glute_floor').sort()).toEqual(['Cable Kickback', 'Clamshell', 'Donkey Kick', 'Fire Hydrant', 'Hip Extension with Bands', 'Machine Glute Kickback', 'Prone Flutter Kicks']);
    for (const k of poseKeys('glute_floor')) expect([k, figureSpec(k)?.family, measuredJoint(figureSpec(k)!)]).toEqual([k, 'glute_floor', 'hip']);
  });
  test('błąd hext.mis.arch (przeprost lędźwi) narysowany przy Donkey Kick, kickbackach i flutter; Clamshell i Fire Hydrant bez pozy błędu (karty mają inne błędy)', () => {
    for (const k of ['Donkey Kick', ...KICKBACKI, 'Prone Flutter Kicks']) expect([k, (poses[k] as any).bledy.map((b: { cue: string }) => b.cue)]).toEqual([k, ['hext.mis.arch']]);
    for (const k of ['Clamshell', 'Fire Hydrant']) expect([k, (poses[k] as any).bledy]).toEqual([k, []]);
  });
});

describe('glute_floor: podpory (K7)', () => {
  test('kickbacki: noga stojąca na podłodze (podeszwa ≤ 1 cm) w każdym kadrze', () => { for (const k of KICKBACKI) expect([k, bladPodlogi(poses[k])]).toEqual([k, []]); });
  test('Prone Flutter Kicks: miednica na ławce ≤ 1 cm, wnikanie ≤ 1 cm', () => { expect(bladLawki(poses['Prone Flutter Kicks'])).toEqual([]); });
  describe('negatywy (test wykrywa błąd)', () => {
    test('Cable Kickback: stopa stojąca 4 cm nad podłogą → wykryte', () => { const d = klon('Cable Kickback'); for (const kf of (d as any).klatki) kf.nogi.L.kostka[1] += 4; expect(bladPodlogi(d).length).toBeGreaterThan(0); });
    test('Prone Flutter Kicks: miednica 4 cm nad ławką → wykryte', () => { const d = klon('Prone Flutter Kicks'); for (const kf of (d as any).klatki) kf.miednica[1] += 4; expect(bladLawki(d).length).toBeGreaterThan(0); });
  });
});

describe('glute_floor: zakresy z reguł rodziny (K5: progi z danych reguł)', () => {
  const kolana = (k: string, u: number) => { const s = keyframeFrame(poses[k], u).sk; return dist(s.legs.R.knee, s.legs.L.knee); };
  test('Clamshell i Fire Hydrant: odległość kolan zmienia się o ≥ rozstaw_kolan.min_cm', () => {
    for (const k of ['Clamshell', 'Fire Hydrant']) expect([k, Math.abs(kolana(k, 1) - kolana(k, 0)) >= reguly.rozstaw_kolan.parametry.min_cm]).toEqual([k, true]);
  });
  test('Prone Flutter Kicks: miednica nieruchoma (≤ miednica_podpora.max_cm od pozycji początkowej)', () => {
    const y = (u: number) => keyframeFrame(poses['Prone Flutter Kicks'], u).sk.pelvis[1];
    for (const u of US) expect([u, Math.abs(y(u) - y(0)) <= reguly.miednica_podpora.parametry.max_cm]).toEqual([u, true]);
  });
  test('Donkey Kick: biodro pracującej nogi na górze ≤ biodro_do_linii.max_biodro_deg; plecy w zakresie reguły (zgięcie kręgosłupa −10°…15°) w całym ruchu', () => {
    expect(jointAngles(frameAt(figureSpec('Donkey Kick')!, 1).sk, 'R').hip).toBeLessThanOrEqual(reguly.biodro_do_linii.parametry.max_biodro_deg);
    for (const k of poseKeys('glute_floor')) for (const kl of poses[k].klatki) { const z = (kl as any).zgiecieKregoslupa ?? 0; expect([k, kl.u, z >= reguly.plecy.parametry.min_deg && z <= reguly.plecy.parametry.max_deg]).toEqual([k, kl.u, true]); }
  });
});

describe('glute_floor: kąt biodra', () => {
  const hip = (k: string, u: number) => measuredAngle(figureSpec(k)!, u).deg;
  test('Cable Kickback i Hip Extension with Bands: noga za linią tułowia daje kąt biodra UJEMNY na końcu ruchu (znak kąta, poza@2), na początku dodatni', () => {
    for (const k of ['Cable Kickback', 'Hip Extension with Bands']) { expect([k, hip(k, 0) > 0]).toEqual([k, true]); expect([k, hip(k, 1) < 0]).toEqual([k, true]); }
  });
  test('kąt pokazany (ROM ≥ MIN_MEASURED_ROM) w Donkey Kick, Cable Kickback, Hip Extension with Bands, Machine Glute Kickback; ukryty (hideAngle) w Fire Hydrant, Clamshell, Prone Flutter Kicks', () => {
    for (const k of ['Donkey Kick', ...KICKBACKI]) expect([k, Math.abs(hip(k, 1) - hip(k, 0)) >= MIN_MEASURED_ROM.deg]).toEqual([k, true]);
    for (const k of ['Donkey Kick', ...KICKBACKI]) expect([k, DATA_UI.glute_floor.exceptions?.[k]?.hideAngle]).toEqual([k, undefined]);
    for (const k of ['Fire Hydrant', 'Clamshell', 'Prone Flutter Kicks']) expect([k, DATA_UI.glute_floor.exceptions?.[k]?.hideAngle]).toEqual([k, true]);
  });
});

describe('glute_floor: prezentacja (fazy)', () => {
  const f = (k: string) => phasesFor(figureSpec(k)!).map(p => [p.name, p.ms]);
  test('Donkey Kick, kickbacki, Fire Hydrant: Unoszenie 1 s, Opuszczanie 2 s; Clamshell: Rozsuwanie / Powrót; Prone Flutter Kicks: Naprzemiennie', () => {
    for (const k of ['Donkey Kick', 'Fire Hydrant', ...KICKBACKI]) expect([k, f(k)]).toEqual([k, [['Unoszenie', 1000], ['Pauza', 500], ['Opuszczanie', 2000], ['Pauza', 500]]]);
    expect(f('Clamshell')).toEqual([['Rozsuwanie', 1000], ['Pauza', 500], ['Powrót', 2000], ['Pauza', 500]]);
    expect(f('Prone Flutter Kicks').map(x => x[0])).toContain('Naprzemiennie');
  });
});

describe('glute_floor: nakładka techniki', () => {
  test('wpis zarejestrowany bez elementów (żadna reguła nie jest „ustalona” dla karty ćwiczenia; miednica_bez_przechylu wyłączona po sprawdzeniu pewności 10.11.2026) — ćwiczenia bez elementu', () => {
    expect(Object.prototype.hasOwnProperty.call(TECHNIQUE, 'glute_floor')).toBe(true); expect(TECHNIQUE.glute_floor).toEqual([]);
    for (const k of poseKeys('glute_floor')) expect([k, techniquesOf(k)]).toEqual([k, []]);
    expect(reguly.miednica_bez_skretu.pewnosc).toMatch(/^ustalone/);
  });
});
