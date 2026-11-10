/*
 * Figury v2 — nakładka techniki mobility_floor (09.11.2026, decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18): rodzina bez elementów (powód w nagłówku overlay/mobility_floor.ts).
 * Rodzaje (docs/20): dane (rejestr ma wpis rodziny, pusty), logika (żadne ćwiczenie rodziny nie dostaje elementu), macierz (9 ćwiczeń z rysunkiem), niezmiennik (każda reguła „ustalone” rodziny
 * bez wskazówki na karcie wskazującej regułę, poza st.noBounce → poza_nieruchoma, której silnik nie narysuje: zmiana tych danych wymaga zmiany tego testu i nakładki).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza dobór elementów, nie recenzję rodziny */
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec } from '@/lib/figures/v2';
import { TECHNIQUE } from '@/lib/figures/v2/overlay';
import { MOBILITY_FLOOR_TECHNIQUE } from '@/lib/figures/v2/overlay/mobility_floor';
import { techniquesOf } from '@/lib/figures/v2/ui';
import SENS from '@/data/zrodla/figury-sens.json';

const KEYS = Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === 'mobility_floor'; } catch { return false; } });

describe('nakładka techniki: mobility_floor (rodzina bez elementów)', () => {
  test('dane: rejestr ma wpis rodziny, pusty (MOBILITY_FLOOR_TECHNIQUE)', () => {
    expect(TECHNIQUE.mobility_floor).toBe(MOBILITY_FLOOR_TECHNIQUE); expect(MOBILITY_FLOOR_TECHNIQUE).toEqual([]);
    for (const d of MOBILITY_FLOOR_TECHNIQUE) expect([d.id, d.cue.length > 0 && d.rule.length > 0]).toEqual([d.id, true]); /* każdy przyszły element ma wskazówkę i regułę */
  });
  test('wyjątki (mobility_floor: decyzja koordynatora 09.11.2026, docs/18, zdjęcie MOB-F1 w docs/21; strongman: decyzja leada partii 8 z 10.11.2026, tryb „analogia”, docs/18 — reguły rodziny „analogia”, karta Yoke Walk bez wskazówki powiązanej z regułą): tylko te dwie rodziny są bez elementów, każda inna rodzina w rejestrze ma co najmniej 1 element', () => {
    const puste = Object.entries(TECHNIQUE).filter(([, v]) => v.length === 0).map(([f]) => f);
    expect(puste.sort()).toEqual(['mobility_floor', 'strongman']);
  });
  test('macierz: 9 ćwiczeń z rysunkiem, żadne nie dostaje elementu nakładki (logika doboru)', () => {
    expect(KEYS.length).toBe(9);
    for (const k of KEYS) expect([k, techniquesOf(k)]).toEqual([k, []]);
  });
  test('niezmiennik: jedyna wskazówka powiązana z regułą to st.noBounce → poza_nieruchoma (bezruch, bez rodzaju elementu)', () => {
    const m = (SENS as unknown as { rodziny: Record<string, { wskazowki_na_reguly: Record<string, string[]> }> }).rodziny.mobility_floor;
    expect(m.wskazowki_na_reguly).toEqual({ 'st.noBounce': ['poza_nieruchoma'] });
  });
});
