/*
 * Figury v2 — nakładka techniki rodziny rotator_cuff (10.11.2026, decyzja właściciela docs/18: „żadna rodzina nie wychodzi bez nakładki”). Rodzaje (docs/20): dane (reguła „ustalone” ze źródłem, element ⇔ wskazówka karty),
 * geometria (pion od barku w dół — łokieć ma zostać przy boku, ≤ 6 cm wg reguły), niezmienniki (jedna linia, bez tekstu, limit czytelności, brak elementu w widoku z góry). Wzór: tests/figures-v2-nakladka-carry.test.tsx.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec, frameAt, guideShapes, overlayShapes, type FigureSpec, type Shape } from '@/lib/figures/v2';
import { OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniquesFor } from '@/lib/figures/v2/overlay';
import { ROTATOR_CUFF_TECHNIQUE } from '@/lib/figures/v2/overlay/rotator_cuff';
import { techniquesOf, guidesOf, errorsOf } from '@/lib/figures/v2/ui';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const KEYS = Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === 'rotator_cuff'; } catch { return false; } });
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.rotator_cuff;
const T = 'rotElbowPlumb';
const STOJACE = ['External Rotation (linki)', 'External Rotation with Band', 'Internal Rotation with Band', 'Cable Internal Rotation'];
/** Karty własne z rot.elbow (linki, taśma ×2) mają element od początku; Cable Internal Rotation (zestaw ogólny rotCuff) dostał go po wpisie recenzji „zestawy” (cueSelection) — 10.11.2026, recenzja rotator_cuff r1 (N1). */
const WANT: Record<string, string[]> = { 'External Rotation (linki)': [T], 'External Rotation with Band': [T], 'Internal Rotation with Band': [T], 'Cable Internal Rotation': [T] };

describe('dane: element rotator_cuff ← reguła „ustalone” ze źródłem', () => {
  test('rejestr: TECHNIQUE.rotator_cuff = jeden element (pion od barku w dół do miednicy), widoki front i side, tylko ćwiczenia stojące', () => {
    expect(TECHNIQUE.rotator_cuff).toBe(ROTATOR_CUFF_TECHNIQUE);
    expect(ROTATOR_CUFF_TECHNIQUE.map(d => [d.id, d.kind, d.ref, d.views, d.exercises])).toEqual([[T, 'ref', { shape: 'vertical', through: 'shoulder', dir: 'down', until: 'pelvis' }, ['front', 'side'], STOJACE]]);
  });
  test('reguła lokiec_przy_boku istnieje i jest „ustalone”; wskazówka elementu należy do wskazowki_na_reguly tej reguły', () => {
    const d = ROTATOR_CUFF_TECHNIQUE[0]; expect(d.rule).toBe('lokiec_przy_boku'); expect(sens.reguly[d.rule].pewnosc).toMatch(/^ustalone/);
    for (const c of d.cue) expect([c, sens.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]);
  });
  test('element ⇔ wskazówka karty i reguła wariantu: 7 ćwiczeń z rysunkiem, techniquesOf = tabela, bez prowadnic; zestaw ogólny rotCuff (Cable Internal Rotation) daje element; leżenie, odwodzenie i taśma między dłońmi bez elementu', () => {
    expect(KEYS.length).toBe(7);
    for (const k of KEYS) { expect([k, techniquesOf(k)]).toEqual([k, WANT[k] ?? []]); expect([k, guidesOf(k)]).toEqual([k, []]); }
    expect(techniquesFor('rotator_cuff', ['rot.elbow', 'rot.slow'], 'Cable Internal Rotation').map(d => d.id)).toEqual([T]);
    for (const k of ['External Rotation (hantel)', 'Band Pull Apart', 'Reverse Flyes With External Rotation']) expect([k, techniquesFor('rotator_cuff', ['rot.elbow', 'rot.slow', 'rear.elbows'], k)]).toEqual([k, []]);
  });
});

describe('geometria i niezmienniki nakładki rotator_cuff', () => {
  const POPRAWNE = STOJACE.filter(k => KEYS.includes(k));
  test('pion od barku: dokładnie jedna linia pionowa w każdej klatce, bez tekstu; łokieć roboczy ≤ 6 cm od pionu (próg reguły); w rzucie z góry brak nakładki', () => {
    expect(POPRAWNE.length).toBe(4);
    for (const k of POPRAWNE) for (const u of US) for (const v of ['front', 'side'] as const) {
      const s = spec(k), ln = overlayShapes(s, u, v, ROTATOR_CUFF_TECHNIQUE.map(d => d.id) as never);
      expect([k, u, v, ln.length]).toEqual([k, u, v, 1]); const l = ln[0] as Extract<Shape, { k: 'line' }>; expect(l.a[0]).toBeCloseTo(l.b[0], 6); expect(JSON.stringify(ln)).not.toMatch(/"text"/);
      const sk = frameAt(s, u).sk; const a = sk.arms.R; expect([k, u, Math.hypot(a.elbow[0] - a.shoulder[0], a.elbow[2] - a.shoulder[2]) <= 6]).toEqual([k, u, true]);
    }
    for (const k of POPRAWNE) expect(overlayShapes(spec(k), 0.5, 'top', ROTATOR_CUFF_TECHNIQUE.map(d => d.id) as never)).toEqual([]);
  });
  test('limit czytelności: ≤ 3 linie i ≤ 1 łuk na rzut we wszystkich ćwiczeniach, klatkach, widokach i błędach', () => {
    for (const k of KEYS) { const s = spec(k), t = ROTATOR_CUFF_TECHNIQUE.map(d => d.id), g = guidesOf(k);
      for (const v of ['front', 'side'] as const) for (const u of US) for (const e of [undefined, ...errorsOf(s).map(x => x.error)]) { const all = [...guideShapes(s, u, v, g, e), ...overlayShapes(s, u, v, t as never, e, g)];
        expect([k, u, v, all.filter(x => x.k === 'line').length <= OVERLAY_MAX_LINES]).toEqual([k, u, v, true]); expect([k, u, v, all.filter(x => x.k === 'poly').length <= OVERLAY_MAX_ARCS]).toEqual([k, u, v, true]); } }
  });
});
