/*
 * Figury v2 — nakładka techniki mobility_stand (10.11.2026, decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18). Rodzaje (docs/20): dane (reguła „ustalone” ze źródłem, element ⇔ wskazówka sb.plane),
 * geometria (pion od miednicy, tułów odchylony ≥ progu reguły), niezmienniki (jedna linia, tylko rzut z przodu, bez tekstu), macierz (8 ćwiczeń z rysunkiem), niezmiennik danych (powód braku pozostałych elementów).
 * Uwaga (bramka 4): dobór elementu przez `techniquesOf` (karta ćwiczenia + reguły wariantu z reguly-cwiczen.json) działa dopiero po wpisach recenzji kart i zestawów rodziny — dziś test sprawdza dobór na poziomie rodziny
 * (`techniquesFor` bez ćwiczenia) i geometrię z jawnym id elementu; wzór: tests/figures-v2-nakladka-cable-row.test.tsx.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza rysowanie, nie recenzję rodziny */
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec, frameAt, overlayShapes, type FigureSpec, type Shape } from '@/lib/figures/v2';
import { OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniquesFor } from '@/lib/figures/v2/overlay';
import { MOBILITY_STAND_TECHNIQUE } from '@/lib/figures/v2/overlay/mobility_stand';
import { ISOMETRIC } from '@/lib/figures/v2/poseData';
import SENS from '@/data/zrodla/figury-sens.json';

type Regula = { pewnosc: string; cue?: string; parametry?: { pole?: string; min_abs?: number } };
const M = (SENS as unknown as { rodziny: Record<string, { reguly: Record<string, Regula>; wskazowki_na_reguly: Record<string, string[]>; warianty: Record<string, string[]> }> }).rodziny.mobility_stand;
const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const KEYS = Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === 'mobility_stand'; } catch { return false; } });
const US = [0, 0.5, 1];
const LATERAL = 'Standing Lateral Stretch', P = 'standLateralPlumb';

describe('nakładka techniki: mobility_stand (skłon boczny — pion od miednicy)', () => {
  test('dane: rejestr ma wpis rodziny z jednym elementem — pion od miednicy (rodzaj ref), tylko rzut z przodu', () => {
    expect(TECHNIQUE.mobility_stand).toBe(MOBILITY_STAND_TECHNIQUE);
    expect(MOBILITY_STAND_TECHNIQUE.map(d => [d.id, d.kind, d.cue, d.rule, d.views, d.ref])).toEqual([[P, 'ref', ['sb.plane'], 'sklon_boczny_statyczny', ['front'], { shape: 'vertical', through: 'pelvis', dir: 'up' }]]);
  });
  test('reguła elementu istnieje, jest „ustalone”, ma to samo cue co element i wskazówka należy do wskazowki_na_reguly tej reguły; Standing Lateral Stretch ma ją w wariancie', () => {
    const r = M.reguly.sklon_boczny_statyczny; expect(r.pewnosc).toMatch(/^ustalone/); expect(r.cue).toBe('sb.plane');
    for (const d of MOBILITY_STAND_TECHNIQUE) { expect(M.reguly[d.rule]).toBeTruthy(); for (const c of d.cue) expect([c, M.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]); } /* każdy element: reguła istnieje, wskazówka należy do wskazowki_na_reguly */
    expect(M.wskazowki_na_reguly['sb.plane']).toEqual(['sklon_boczny_statyczny']); expect(M.warianty[LATERAL]).toContain('sklon_boczny_statyczny');
  });
  test('dobór: element tylko dla wskazówki sb.plane; st.noBounce (poza_nieruchoma, bezruch bez geometrii) i st.tension nie dają elementu', () => {
    expect(techniquesFor('mobility_stand', ['sb.plane', 'st.tension', 'st.noBounce']).map(d => d.id)).toEqual([P]);
    expect(techniquesFor('mobility_stand', ['st.tension', 'st.noBounce', 'st.breathe', 'gcalf.knee'])).toEqual([]);
  });
  test('niezmiennik danych: tylko st.noBounce i sb.plane są powiązane z regułami — powiązanie kolejnej wskazówki (np. st.tension) wymaga zmiany nakładki i tego testu', () => {
    expect(M.wskazowki_na_reguly).toEqual({ 'st.noBounce': ['poza_nieruchoma'], 'sb.plane': ['sklon_boczny_statyczny'] });
  });
  test('macierz: 8 ćwiczeń z rysunkiem, wszystkie to pozycje statyczne (ISOMETRIC); element nakładki ma tylko skłon boczny', () => {
    expect(KEYS.length).toBe(8); for (const k of KEYS) expect([k, ISOMETRIC.has(k)]).toEqual([k, true]);
    expect(MOBILITY_STAND_TECHNIQUE.flatMap(d => d.cue)).toEqual(['sb.plane']);
  });
});

describe('geometria i niezmienniki nakładki mobility_stand', () => {
  test('Standing Lateral Stretch z przodu: dokładnie jedna linia pionowa, bez łuku i tekstu', () => {
    for (const u of US) { const ln = overlayShapes(spec(LATERAL), u, 'front', [P]); expect([u, ln.length]).toEqual([u, 1]); const l = ln[0] as Extract<Shape, { k: 'line' }>; expect(l.k).toBe('line'); expect(l.a[0]).toBeCloseTo(l.b[0], 6); expect(JSON.stringify(ln)).not.toMatch(/"text"/); }
  });
  test('pion zaczyna się w miednicy i idzie w górę: tułów odchyla się od niego w bok o co najmniej próg reguły (przechyl ≥ min_abs), bez pochylenia do przodu', () => {
    const s = spec(LATERAL), sk = frameAt(s, 1).sk; const dy = sk.shoulderC[1] - sk.pelvis[1], dz = sk.shoulderC[2] - sk.pelvis[2], dx = sk.shoulderC[0] - sk.pelvis[0];
    const bok = Math.abs(Math.atan2(dz, dy)) * 180 / Math.PI, przod = Math.abs(Math.atan2(dx, dy)) * 180 / Math.PI;
    expect(dy).toBeGreaterThan(0); expect(bok).toBeGreaterThanOrEqual(M.reguly.sklon_boczny_statyczny.parametry!.min_abs!); expect(przod).toBeLessThan(5);
  });
  test('w rzucie z boku i z góry brak nakładki (przechył w bok jest prostopadły do rzutu z boku)', () => {
    for (const v of ['side', 'top'] as const) for (const u of US) expect([v, u, overlayShapes(spec(LATERAL), u, v, [P])]).toEqual([v, u, []]);
  });
  test('limit czytelności: ≤ 3 linie i ≤ 1 łuk na rzut we wszystkich ćwiczeniach rodziny', () => {
    for (const k of KEYS) for (const v of spec(k).views) { const all = overlayShapes(spec(k), 1, v, [P]);
      expect([k, v, all.filter(x => x.k === 'line').length <= OVERLAY_MAX_LINES]).toEqual([k, v, true]); expect([k, v, all.filter(x => x.k === 'poly').length <= OVERLAY_MAX_ARCS]).toEqual([k, v, true]); }
  });
});
