/*
 * Figury v2 — nakładka techniki rodziny core_hang (10.11.2026, decyzja właściciela docs/18: „żadna rodzina nie wychodzi bez nakładki”). Rodzaje (docs/20): dane (reguła „ustalone” ze źródłem, element ⇔ wskazówka karty),
 * geometria (łuk biodra = measuredAngle ±1°), niezmienniki (jedna linia i łuk, tylko rzut z boku, bez tekstu, limit czytelności). Wzór: tests/figures-v2-nakladka-cable-row.test.tsx.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec, frameAt, guideShapes, measuredAngle, measuredSide, overlayShapes, type FigureSpec, type Shape } from '@/lib/figures/v2';
import { OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniqueGeom, techniquesFor } from '@/lib/figures/v2/overlay';
import { CORE_HANG_TECHNIQUE } from '@/lib/figures/v2/overlay/core_hang';
import { techniquesOf, guidesOf, errorsOf } from '@/lib/figures/v2/ui';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const KEYS = Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === 'core_hang'; } catch { return false; } });
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.core_hang;
const H = 'hangHipLimb';
/** Hanging Knee Raise: hang.ribs na karcie + reguła kolana_ku_klatce w wariancie → element. Hanging Leg Raise: hang.ribs, ale wariant bez tej reguły (nogi proste) → bez elementu. Toes to Bar: bez hang.ribs. */
const WANT: Record<string, string[]> = { 'Hanging Knee Raise': [H], 'Hanging Leg Raise': [], 'Toes to Bar': [] };

describe('dane: elementy core_hang ← reguły „ustalone” ze źródłem', () => {
  test('rejestr: TECHNIQUE.core_hang = jeden element (zgięcie biodra, staw biodra), tylko rzut z boku', () => {
    expect(TECHNIQUE.core_hang).toBe(CORE_HANG_TECHNIQUE); expect(CORE_HANG_TECHNIQUE.map(d => [d.id, d.kind, d.joint, d.views])).toEqual([[H, 'limb', 'hip', ['side']]]);
  });
  test('reguła kolana_ku_klatce istnieje i jest „ustalone”; wskazówka elementu należy do wskazowki_na_reguly tej reguły', () => {
    const d = CORE_HANG_TECHNIQUE[0]; expect(d.rule).toBe('kolana_ku_klatce'); expect(sens.reguly[d.rule].pewnosc).toMatch(/^ustalone/);
    for (const c of d.cue) expect([c, sens.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]);
  });
  test('element ⇔ wskazówka karty i reguła wariantu: 3 ćwiczenia z rysunkiem (L-Sit bez rysunku), techniquesOf = tabela, bez prowadnic; reguły bez „ustalone” nie dają elementów', () => {
    expect(KEYS.sort()).toEqual(Object.keys(WANT).sort());
    for (const [k, w] of Object.entries(WANT)) { expect([k, techniquesOf(k)]).toEqual([k, w]); expect([k, guidesOf(k)]).toEqual([k, []]); }
    expect(techniquesFor('core_hang', ['hang.ribs'], 'Hanging Knee Raise').map(d => d.id)).toEqual([H]); expect(techniquesFor('core_hang', ['hang.ribs'], 'Hanging Leg Raise')).toEqual([]);
    expect(techniquesFor('core_hang', ['hang.t2b.move', 'hang.t2b.straight', 'hang.pressBar', 'hang.slow', 'hang.setup'], 'Toes to Bar')).toEqual([]);
    for (const r of ['rece_proste', 'nogi_uniesione', 'kolana_lekko', 'palce_do_drazka']) expect([r, sens.reguly[r].pewnosc]).toEqual([r, expect.not.stringMatching(/^ustalone/)]);
  });
});

describe('geometria i niezmienniki nakładki core_hang', () => {
  test('łuk biodra = measuredAngle (±1°) w każdej klatce Hanging Knee Raise; staw = biodro; jedna linia, łuk tylko gdy rozwarcie ≥ progu; zgięcie rośnie od zwisu ku górze', () => {
    const k = 'Hanging Knee Raise', s = spec(k); const sw: number[] = [];
    for (const u of US) {
      const f = frameAt(s, u), m = measuredAngle(s, u); expect([u, m.joint]).toEqual([u, 'hip']);
      const g = techniqueGeom('limb', f.sk, measuredSide(s), 'hip')!; expect([u, Math.abs(g.sweepDeg - m.deg) <= 1]).toEqual([u, true]); sw.push(g.sweepDeg);
      const sh = overlayShapes(s, u, 'side', [H]); expect([u, sh.filter(x => x.k === 'line').length]).toEqual([u, 1]); expect([u, sh.filter(x => x.k === 'poly').length]).toEqual([u, g.arc ? 1 : 0]); expect(JSON.stringify(sh)).not.toMatch(/"text"/);
    }
    expect(Math.max(...sw) - Math.min(...sw)).toBeGreaterThan(60); expect(sw[sw.length - 1]).toBeGreaterThan(sw[0]);
  });
  test('rzut z przodu i z góry: brak nakładki; limit czytelności ≤ 3 linie i ≤ 1 łuk na rzut we wszystkich ćwiczeniach, klatkach i błędach', () => {
    for (const k of KEYS) { const s = spec(k), g = guidesOf(k);
      for (const u of US) { expect([k, u, overlayShapes(s, u, 'front', [H]).length]).toEqual([k, u, 0]); expect([k, u, overlayShapes(s, u, 'top', [H]).length]).toEqual([k, u, 0]);
        for (const e of [undefined, ...errorsOf(s).map(x => x.error)]) { const all: Shape[] = [...guideShapes(s, u, 'side', g, e), ...overlayShapes(s, u, 'side', [H], e, g)];
          expect([k, u, all.filter(x => x.k === 'line').length <= OVERLAY_MAX_LINES]).toEqual([k, u, true]); expect([k, u, all.filter(x => x.k === 'poly').length <= OVERLAY_MAX_ARCS]).toEqual([k, u, true]); } } }
  });
});
