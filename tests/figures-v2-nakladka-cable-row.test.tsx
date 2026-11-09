/*
 * Figury v2 — nakładka techniki rodziny cable_row (09.11.2026, decyzja właściciela docs/18: „żadna rodzina nie wychodzi bez nakładki”). Rodzaje (docs/20): dane (reguły „ustalone” ze źródłem, element ⇔ wskazówka karty),
 * geometria (łuk = measuredAngle ±1°), niezmienniki (≤ 3 linie + 1 łuk na rzut łącznie z linią pleców, element tylko w rzucie z boku, bez tekstu), kolor błędu, dźwignia maszyny z przodu (DZWIGNIA_BEZ_GLOWY).
 * Wzór: tests/figures-v2-nakladka-triceps-olympic.test.tsx.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec, frameAt, guideShapes, measuredAngle, measuredSide, overlayShapes, shapesAt, type FigureSpec, type Shape } from '@/lib/figures/v2';
import { OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniqueGeom, techniquesFor } from '@/lib/figures/v2/overlay';
import { CABLE_ROW_TECHNIQUE, CABLE_ROW_ELBOW_BACK_EXERCISES, CABLE_ROW_TORSO_EXERCISES } from '@/lib/figures/v2/overlay/cable_row';
import { dzwigniaPrzezGlowe } from '@/lib/figures/v2/leverGuard';
import { poseDataFor } from '@/lib/figures/v2/poseData';
import { techniquesOf, guidesOf, cueIdsOf, errorsOf } from '@/lib/figures/v2/ui';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const KEYS = Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === 'cable_row'; } catch { return false; } });
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.cable_row;
const L = 'cableRowElbowLimb', T = 'cableRowTorsoPlumb', B = 'cableRowElbowBackPlumb';
/** Oczekiwane elementy i linie odniesienia per ćwiczenie (stan przed recenzją kart): zestawy ogólne (Rope Rear-Delt, Single Arm, Leverage High, Kneeling) liczą się na karcie dopiero z wpisem recenzji „zestawy” (cueSelection) → dziś bez elementu;
 * ich elementy sprawdza test na id wskazówek zestawu (niżej). Standing Cable Row i Machine Row mają karty własne scrow.* / mrow.* (id spoza wskazowki_na_reguly) → bez elementu. */
const WANT: Record<string, { t: string[]; g: string[] }> = {
  'Seated Cable Row': { t: [L, T], g: [] }, 'Wiosłowanie na linkach (siedząc)': { t: [L, T], g: [] }, 'Face Pull': { t: [L, B], g: [] },
  'Cable Rope Rear-Delt Rows': { t: [B], g: [] }, /* 09.11.2026: zestaw ogólny po wpisie „zestawy” r2 (wyswietlana) liczy się na karcie → element łokci za plecami (jak w teście id wskazówek niżej) */ 'Single Arm Cable Row': { t: [T], g: [] }, 'Leverage High Row': { t: [T], g: [] }, /* 09.11.2026: zestawy r3 (po poprawce row.fullStretch 0f069d93) wyswietlana → pion tułowia (scr.chest/scr.control) */ 'Kneeling High Pulley Row': { t: [T], g: [] }, /* 09.11.2026: j.w. — zestaw po wpisie r2 → pion tułowia */
  'Standing Cable Row': { t: [], g: [] }, 'Machine Row': { t: [], g: [] },
};

describe('dane: elementy cable_row ← reguły „ustalone” ze źródłem', () => {
  test('rejestr: TECHNIQUE.cable_row = trzy elementy w stałej kolejności (łokieć, pion tułowia, pion łokcia za plecami), tylko rzut z boku', () => {
    expect(TECHNIQUE.cable_row).toBe(CABLE_ROW_TECHNIQUE); expect(CABLE_ROW_TECHNIQUE.map(d => d.id)).toEqual([L, T, B]);
    expect(CABLE_ROW_TECHNIQUE.map(d => [d.kind, d.joint, d.ref, d.views])).toEqual([
      ['limb', 'elbow', undefined, ['side']], ['ref', undefined, { shape: 'vertical', through: 'pelvis', dir: 'up' }, ['side']], ['ref', undefined, { shape: 'vertical', through: 'shoulder', dir: 'both' }, ['side']]]);
  });
  test('reguła każdego elementu istnieje i jest „ustalone”; każda wskazówka elementu należy do wskazowki_na_reguly tej reguły', () => {
    for (const d of CABLE_ROW_TECHNIQUE) { const r = sens.reguly[d.rule]; expect(r).toBeTruthy(); expect(r.pewnosc).toMatch(/^ustalone/); for (const c of d.cue) expect([c, sens.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]); }
    expect(CABLE_ROW_TECHNIQUE.map(d => d.rule)).toEqual(['zakres_lokcia', 'tulow_stabilny', 'lokiec_za_plecami']);
  });
  test('lokiec_za_plecami: „ustalone” tylko dla face pull (analogia w wiosłowaniu) → lista ćwiczeń elementu; wszystkie ćwiczenia z figurą są pokryte tabelą', () => {
    expect(sens.reguly.lokiec_za_plecami.pewnosc).toMatch(/analogia/); expect(CABLE_ROW_ELBOW_BACK_EXERCISES).toEqual(['Face Pull', 'Cable Rope Rear-Delt Rows']);
    expect(CABLE_ROW_TORSO_EXERCISES).not.toContain('Face Pull'); expect(KEYS.length).toBe(9); expect(Object.keys(WANT).sort()).toEqual([...KEYS].sort());
  });
  test('element ⇔ wskazówka karty i reguła wariantu: techniquesOf i guidesOf = tabela dla KAŻDEGO ćwiczenia rodziny', () => {
    for (const [k, w] of Object.entries(WANT)) { expect([k, techniquesOf(k)]).toEqual([k, w.t]); expect([k, guidesOf(k)]).toEqual([k, w.g]); }
    expect(techniquesFor('cable_row', ['scr.pull'], 'Seated Cable Row').map(d => d.id)).toEqual([L]); expect(techniquesFor('cable_row', ['fp.elbowsBack'], 'Seated Cable Row')).toEqual([]);
    /* zestawy ogólne (id z cue-sets.json): po recenzji „zestawy” dostaną elementy wg reguł wariantu */
    expect(techniquesFor('cable_row', ['scr.chest', 'scr.control'], 'Single Arm Cable Row').map(d => d.id)).toEqual([T]); expect(techniquesFor('cable_row', ['fp.elbowsBack', 'fp.chest'], 'Cable Rope Rear-Delt Rows').map(d => d.id)).toEqual([B]);
    expect(techniquesFor('cable_row', ['scr.chest', 'scr.control'], 'Kneeling High Pulley Row').map(d => d.id)).toEqual([T]); expect(techniquesFor('cable_row', ['fp.elbowsBack'], 'Face Pull').map(d => d.id)).toEqual([B]);
    expect(techniquesFor('cable_row', ['scrow.pull'], 'Standing Cable Row')).toEqual([]); expect(cueIdsOf('Machine Row').ids.some(c => TECHNIQUE.cable_row.some(d => d.cue.includes(c)))).toBe(false);
  });
});

describe('geometria i niezmienniki nakładki cable_row', () => {
  test('łuk łokcia = measuredAngle (±1°) w każdej klatce ćwiczeń z elementem ruchu (Seated, Wiosłowanie, Face Pull); jedna linia i łuk, gdy rozwarcie ≥ progu', () => {
    for (const k of ['Seated Cable Row', 'Wiosłowanie na linkach (siedząc)', 'Face Pull']) for (const u of US) {
      const s = spec(k), f = frameAt(s, u), m = measuredAngle(s, u); expect([k, m.joint]).toEqual([k, 'elbow']);
      const g = techniqueGeom('limb', f.sk, measuredSide(s), 'elbow')!; expect([k, u, Math.abs(g.sweepDeg - m.deg) <= 1]).toEqual([k, u, true]);
      const sh = overlayShapes(s, u, 'side', [L]); expect([k, u, sh.filter(x => x.k === 'line').length]).toEqual([k, u, 1]); expect([k, u, sh.filter(x => x.k === 'poly').length]).toEqual([k, u, g.arc ? 1 : 0]);
    }
  });
  test('zakres łokcia na końcach ruchu zgodny z regułą zakres_lokcia (≥ 70° zgięcia na końcu ściągania, ≤ 20° na starcie) — Seated Cable Row', () => {
    const s = spec('Seated Cable Row'); expect(measuredAngle(s, 0).deg).toBeLessThanOrEqual(20); expect(measuredAngle(s, 1).deg).toBeGreaterThanOrEqual(70);
  });
  test('pion tułowia i pion łokcia: dokładnie jedna linia pionowa, bez tekstu i liczb; w rzucie z przodu i z góry brak nakładki', () => {
    for (const k of ['Seated Cable Row', 'Kneeling High Pulley Row']) for (const u of US) { const ln = overlayShapes(spec(k), u, 'side', [T]); expect(ln.length).toBe(1); const l = ln[0] as Extract<Shape, { k: 'line' }>; expect(l.a[0]).toBeCloseTo(l.b[0], 6); expect(JSON.stringify(ln)).not.toMatch(/"text"/); }
    for (const u of US) { const s = spec('Face Pull'); const ln = overlayShapes(s, u, 'side', [B]); expect(ln.length).toBe(1); const l = ln[0] as Extract<Shape, { k: 'line' }>; expect(l.a[0]).toBeCloseTo(l.b[0], 6);
      for (const v of ['front', 'top'] as const) expect(overlayShapes(s, u, v, techniquesOf('Face Pull'))).toEqual([]); }
  });
  test('Face Pull: łokieć przechodzi za pion barku na końcu ruchu (lokiec_za_plecami), na starcie jest przed nim', () => {
    const s = spec('Face Pull'); const side = measuredSide(s); const dx = (u: number) => { const A = frameAt(s, u).sk.arms[side]; return A.elbow[0] - A.shoulder[0]; };
    expect(dx(0)).toBeGreaterThan(5); expect(dx(1)).toBeLessThanOrEqual(-5 + 1e-6);
  });
  test('limit czytelności: ≤ 3 linie i ≤ 1 łuk na rzut, we wszystkich ćwiczeniach, klatkach i błędach', () => {
    for (const k of KEYS) { const s = spec(k), t = techniquesOf(k), g = guidesOf(k);
      for (const u of US) for (const e of [undefined, ...errorsOf(s).map(x => x.error)]) { const all = [...guideShapes(s, u, 'side', g, e), ...overlayShapes(s, u, 'side', t, e, g)];
        expect([k, u, all.filter(x => x.k === 'line').length <= OVERLAY_MAX_LINES]).toEqual([k, u, true]); expect([k, u, all.filter(x => x.k === 'poly').length <= OVERLAY_MAX_ARCS]).toEqual([k, u, true]); } }
  });
});

describe('dźwignia maszyny z przodu (DZWIGNIA_BEZ_GLOWY ∋ cable_row; backlog 1.1, docs/21)', () => {
  const lever = (k: string, u: number, view: 'front' | 'side'): boolean => shapesAt(spec(k), u, view, false).some(x => x.id === 'landmine');
  test('Leverage High Row: dźwignia przechodzi przez głowę w u 0–0,1 → z przodu ukryta w całym ruchu, z boku jest', () => {
    expect(dzwigniaPrzezGlowe(poseDataFor('Leverage High Row', 'cable_row')!)).toBe(true);
    for (const u of US) { expect([u, lever('Leverage High Row', u, 'front')]).toEqual([u, false]); expect([u, lever('Leverage High Row', u, 'side')]).toEqual([u, true]); }
  });
  test('Machine Row: dźwignia nie dotyka głowy → rysowana z przodu w całym ruchu (decyzja ćwiczenia, nie rodziny)', () => {
    expect(dzwigniaPrzezGlowe(poseDataFor('Machine Row', 'cable_row')!)).toBe(false);
    for (const u of US) expect([u, lever('Machine Row', u, 'front')]).toEqual([u, true]);
  });
});
