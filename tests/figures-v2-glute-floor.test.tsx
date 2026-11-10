/*
 * (10.11.2026, partia 7 linii 1.1) Rodzina glute_floor (Donkey Kick, Fire Hydrant, Clamshell, Cable Kickback, Hip Extension with Bands, Machine Glute Kickback, Prone Flutter Kicks) po włączeniu:
 *  - rysunki: 7 ćwiczeń, dane póz = generator (błąd hext.mis.arch narysowany tam, gdzie karta go ma: Donkey Kick, Cable Kickback, Hip Extension with Bands + zestawy ogólne Machine Glute Kickback, Prone Flutter Kicks);
 *  - podpory (K7): noga podporowa na podłodze w kickbackach (≤ 1 cm), miednica na ławce w flutter kicks (≤ 1 cm), wnikanie ≤ 1 cm;
 *  - zakresy z reguł rodziny (figury-sens.json, progi z danych reguł, K5): rozstaw kolan ≥ 15 cm (Clamshell, Fire Hydrant), miednica nieruchoma ≤ 3 cm (flutter), biodro do linii ≤ 25° (Donkey Kick), plecy −10°…15°;
 *  - znak kąta biodra w kickbackach (przeprost ujemny — poza@2) i ukrycie kąta tam, gdzie ruch nie jest zgięciem biodra;
 *  - prezentacja: fazy, kierunek u, staw; nakładka: jedna linia pleców dla Donkey Kick (reguła plecy_wprost; powody braku pozostałych w nagłówku overlay/glute_floor.ts).
 * Nie jest strażnikiem procesu — przypadek „gałąź z wcześniejszymi zmianami” (L-080) nie dotyczy.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { overlayShapes, type Shape, figureSpec, frameAt, keyframeFrame, measuredJoint, measuredAngle, phasesFor, DATA_UI, poseKeys, type PoseData } from '@/lib/figures/v2';
import { bodyColliders, equipColliders, gap } from '@/lib/figures/v2/colliders';
import { OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniquesFor } from '@/lib/figures/v2/overlay';
import { GLUTE_FLOOR_TECHNIQUE } from '@/lib/figures/v2/overlay/glute_floor';
import { techniquesOf } from '@/lib/figures/v2/ui';
import { jointAngles } from '@/lib/figures/v2/skeleton';
import { MIN_MEASURED_ROM } from '@/lib/figures/v2/poseData';

const ROOT = path.join(__dirname, '..');
const poses = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/v2/poses/glute_floor.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const reguly = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.glute_floor.reguly;
const SENS_G = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.glute_floor;
const rulesAllowed = (k: string): string[] => (SENS_G.warianty[k] as string[]).filter(r => GLUTE_FLOOR_TECHNIQUE.some(d => d.rule === r));
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

describe('glute_floor: nakładka techniki (plecy_wprost — linia pleców, tylko Donkey Kick)', () => {
  const ID = 'gluteBackRef';
  test('dane: rejestr ma jeden element ref (miednica → bark), rzut z boku, reguła plecy_wprost „ustalone” z tym samym cue; wskazówki hext.* należą do reguł plecy i plecy_wprost', () => {
    expect(TECHNIQUE.glute_floor).toBe(GLUTE_FLOOR_TECHNIQUE);
    expect(GLUTE_FLOOR_TECHNIQUE.map(d => [d.id, d.kind, d.cue, d.rule, d.views, d.ref])).toEqual([[ID, 'ref', ['hext.range'], 'plecy_wprost', ['side'], { shape: 'segment', from: 'pelvis', to: 'shoulderC' }]]);
    expect(reguly.plecy_wprost.pewnosc).toMatch(/^ustalone/); expect(reguly.plecy_wprost.cue).toBe('hext.range'); expect(reguly.plecy_wprost.typ).toBe('kregoslup_neutralny');
    for (const c of ['hext.range', 'hext.mis.arch']) expect([c, SENS_G.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining(['plecy', 'plecy_wprost'])]);
  });
  test('reguła plecy_wprost ma tylko Donkey Kick; pozostałe ćwiczenia zostają przy regule plecy (pewność poniżej „ustalone”) — bez elementu', () => {
    const w = SENS_G.warianty as Record<string, string[]>;
    expect(Object.keys(w).filter(k => w[k].includes('plecy_wprost'))).toEqual(['Donkey Kick']);
    for (const k of ['Hip Extension with Bands', 'Cable Kickback', 'Machine Glute Kickback', 'Prone Flutter Kicks']) { expect([k, w[k]]).toEqual([k, expect.arrayContaining(['plecy'])]); expect(rulesAllowed(k)).toEqual([]); }
    expect(reguly.plecy.pewnosc).not.toMatch(/^ustalone/);
  });
  test('pewność miednica_bez_przechylu obniżona do „analogia” (badacz 10.11.2026) — Clamshell i Fire Hydrant bez elementu; miednica_bez_skretu bez rodzaju elementu', () => {
    expect(reguly.miednica_bez_przechylu.pewnosc).toMatch(/^analogia/);
    expect(GLUTE_FLOOR_TECHNIQUE.map(d => d.rule)).toEqual(['plecy_wprost']);
  });
  test('dobór: element tylko przy hext.range; hext.mis.arch (błąd), plank.brace i brak wskazówek nie dają elementu', () => {
    expect(techniquesFor('glute_floor', ['hext.range', 'plank.brace']).map(d => d.id)).toEqual([ID]);
    expect(techniquesFor('glute_floor', ['hext.mis.arch', 'plank.brace', 'hab.hips'])).toEqual([]);
  });
  test('geometria: Donkey Kick z boku — jedna linia, bez łuku i tekstu, od miednicy w stronę barku (zgodnie ze szkieletem), w całym ruchu', () => {
    for (const u of US) {
      const sp = figureSpec('Donkey Kick')!; const ln = overlayShapes(sp, u, 'side', [ID]); expect([u, ln.length]).toEqual([u, 1]);
      const l = ln[0] as Extract<Shape, { k: 'line' }>; expect(l.k).toBe('line'); expect(JSON.stringify(ln)).not.toMatch(/"text"/);
      const sk = frameAt(sp, u).sk; const p = [sk.pelvis[0], sk.pelvis[1]], sh = [sk.shoulderC[0], sk.shoulderC[1]];
      const d = [l.b[0] - l.a[0], l.b[1] - l.a[1]]; const cross = Math.abs(d[0] * (sh[1] - p[1]) - d[1] * (sh[0] - p[0])) / (Math.hypot(...d) * Math.hypot(sh[0] - p[0], sh[1] - p[1]));
      expect([u, cross < 1e-3]).toEqual([u, true]);
    }
  });
  test('w rzucie z przodu i z góry brak nakładki; limit czytelności (≤ OVERLAY_MAX_LINES linii, ≤ OVERLAY_MAX_ARCS łuków) we wszystkich ćwiczeniach rodziny', () => {
    for (const v of ['front', 'top'] as const) for (const u of US) expect([v, u, overlayShapes(figureSpec('Donkey Kick')!, u, v, [ID])]).toEqual([v, u, []]);
    for (const k of poseKeys('glute_floor')) for (const v of figureSpec(k)!.views) { const all = overlayShapes(figureSpec(k)!, 1, v, [ID]);
      expect([k, v, all.filter(x => x.k === 'line').length <= OVERLAY_MAX_LINES]).toEqual([k, v, true]); expect([k, v, all.filter(x => x.k === 'poly').length <= OVERLAY_MAX_ARCS]).toEqual([k, v, true]); }
  });
});

describe('glute_floor: recenzja r1 (10.11.2026)', () => {
  test('W1 Cable Kickback: dłonie trzymają kolumnę wyciągu (gap(przedramię, kolumna) ≤ 1 cm) w każdym kadrze — karta mówi „trzymając się jej”', () => {
    for (const u of US) {
      const f = keyframeFrame(poses['Cable Kickback'], u); const tower = equipColliders(f.props).find(e => e.id === 'tower')!; expect(tower).toBeDefined();
      for (const s of ['R', 'L']) { const farm = bodyColliders(f.sk).find(b => b.id === 'farm' + s)!; expect([s, u, gap(farm, tower) <= 1]).toEqual([s, u, true]); }
    }
  });
  test('W2 Prone Flutter Kicks, poza błędu hext.mis.arch: tułów (środek − grubość) nie zapada się w blat ławki (≥ blat − 1 cm) w każdym u', () => {
    const BLAT = 43; const d = poses['Prone Flutter Kicks'];
    for (const u of US) { const y = keyframeFrame(d, u, 0).sk.spineMid[1] - 10.5; expect([u, y >= BLAT - 1]).toEqual([u, true]); }
  });
});
