/*
 * Figury v2 — nakładka techniki rodziny carry (10.11.2026, decyzja właściciela docs/18: „żadna rodzina nie wychodzi bez nakładki”). Rodzaje (docs/20): dane (reguła „ustalone” ze źródłem, element ⇔ wskazówka karty),
 * geometria (pion przez miednicę, tułów w granicach reguły), niezmienniki (jedna linia, tylko rzut z boku, bez tekstu, limit czytelności). Wzór: tests/figures-v2-nakladka-cable-row.test.tsx.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec, frameAt, guideShapes, overlayShapes, type FigureSpec, type Shape } from '@/lib/figures/v2';
import { OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniquesFor } from '@/lib/figures/v2/overlay';
import { CARRY_TECHNIQUE } from '@/lib/figures/v2/overlay/carry';
import { techniquesOf, guidesOf, errorsOf } from '@/lib/figures/v2/ui';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const KEYS = Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === 'carry'; } catch { return false; } });
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.carry;
const T = 'carryTorsoPlumb';
/** Karty własne (Farmer's Walk: lunge.torso, Suitcase Carry: carry.noLean) mają element od początku; zestawy ogólne (carry.noLean) dostały go po wpisie recenzji „zestawy” (cueSelection) — 10.11.2026 (recenzja carry r2, wpisy 5 zestawów w figury-recenzja.json) wszystkie 7 ćwiczeń rodziny mają element; wcześniej tabela miała tylko 2 karty własne i test padał już na 5692d55e (integrator partii 5). */
const WANT: Record<string, string[]> = Object.fromEntries(KEYS.map(k => [k, [T]]));

describe('dane: elementy carry ← reguły „ustalone” ze źródłem', () => {
  test('rejestr: TECHNIQUE.carry = jeden element (pion przez miednicę w górę), tylko rzut z boku', () => {
    expect(TECHNIQUE.carry).toBe(CARRY_TECHNIQUE); expect(CARRY_TECHNIQUE.map(d => [d.id, d.kind, d.ref, d.views])).toEqual([[T, 'ref', { shape: 'vertical', through: 'pelvis', dir: 'up' }, ['side']]]);
  });
  test('reguła tulow_pion istnieje i jest „ustalone”; każda wskazówka elementu należy do wskazowki_na_reguly tej reguły', () => {
    const d = CARRY_TECHNIQUE[0]; expect(d.rule).toBe('tulow_pion'); expect(sens.reguly[d.rule].pewnosc).toMatch(/^ustalone/);
    for (const c of d.cue) expect([c, sens.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]);
  });
  test('element ⇔ wskazówka karty i reguła wariantu: 7 ćwiczeń z rysunkiem, techniquesOf = tabela (karty własne), reszta czeka na zestawy; bez prowadnic', () => {
    expect(KEYS.length).toBe(7);
    for (const k of KEYS) { expect([k, techniquesOf(k)]).toEqual([k, WANT[k] ?? []]); expect([k, guidesOf(k)]).toEqual([k, []]); }
    for (const k of KEYS) expect([k, techniquesFor('carry', ['carry.noLean'], k).map(d => d.id)]).toEqual([k, [T]]); /* zestaw ogólny po recenzji: wszystkie 7 mają regułę tulow_pion */
    expect(techniquesFor('carry', ['carry.two', 'carry.one', 'carry.walk'], "Farmer's Walk")).toEqual([]); /* ręce proste i ciężar przy biodrach: bez elementu (nagłówek overlay/carry.ts) */
  });
});

describe('geometria i niezmienniki nakładki carry', () => {
  test('pion tułowia: dokładnie jedna linia pionowa w każdej klatce, bez tekstu; tułów w granicach reguły (±10° od pionu); w rzucie z przodu i z góry brak nakładki', () => {
    for (const k of KEYS) for (const u of US) {
      const s = spec(k), ln = overlayShapes(s, u, 'side', CARRY_TECHNIQUE.map(d => d.id) as never);
      expect([k, u, ln.length]).toEqual([k, u, 1]); const l = ln[0] as Extract<Shape, { k: 'line' }>; expect(l.a[0]).toBeCloseTo(l.b[0], 6); expect(JSON.stringify(ln)).not.toMatch(/"text"/);
      const sk = frameAt(s, u).sk; const dx = sk.shoulderC[0] - sk.pelvis[0], dy = sk.shoulderC[1] - sk.pelvis[1]; expect([k, u, Math.abs(Math.atan2(dx, dy) * 180 / Math.PI) <= 10]).toEqual([k, u, true]);
    }
  });
  test('limit czytelności: ≤ 3 linie i ≤ 1 łuk na rzut we wszystkich ćwiczeniach, klatkach i błędach', () => {
    for (const k of KEYS) { const s = spec(k), t = CARRY_TECHNIQUE.map(d => d.id), g = guidesOf(k);
      for (const u of US) for (const e of [undefined, ...errorsOf(s).map(x => x.error)]) { const all = [...guideShapes(s, u, 'side', g, e), ...overlayShapes(s, u, 'side', t as never, e, g)];
        expect([k, u, all.filter(x => x.k === 'line').length <= OVERLAY_MAX_LINES]).toEqual([k, u, true]); expect([k, u, all.filter(x => x.k === 'poly').length <= OVERLAY_MAX_ARCS]).toEqual([k, u, true]); } }
  });
});
