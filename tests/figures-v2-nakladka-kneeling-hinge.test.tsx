/*
 * Figury v2 — nakładka techniki rodziny kneeling_hinge (10.11.2026, partia 5; decyzja właściciela docs/18: „żadna rodzina nie wychodzi bez nakładki” — z wyjątkiem rodziny bez reguły „ustalone”,
 * bo nakładka tylko z reguł „ustalone”, bez nowych liczb). Obie reguły rodziny (plecy: neutralny kręgosłup; pochylenie: zmiana ≥ 30°, najwyżej 95°) mają pewność „analogia” (siad zamiast stania,
 * NSCA/ACE i NASM dla zawiasu stojąc; ExRx jako analogia) — dlatego TECHNIQUE.kneeling_hinge nie istnieje, a ćwiczenie nie ma elementu ani prowadnicy. Rodzaje (docs/20): dane (pewność reguł, brak wpisu),
 * niezmienniki (techniquesOf/guidesOf puste, overlayShapes puste w każdej klatce i rzucie), geometria rysunku (skłon zgodny z regułą pochylenie, sztanga na barkach w każdej klatce).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { figureSpec, frameAt, overlayShapes, measuredAngle, type FigureSpec } from '@/lib/figures/v2';
import { TECHNIQUE } from '@/lib/figures/v2/overlay';
import { techniquesOf, guidesOf } from '@/lib/figures/v2/ui';

const K = 'Seated Good Mornings';
const spec = (): FigureSpec => figureSpec(K) as FigureSpec;
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.kneeling_hinge;
const US = Array.from({ length: 21 }, (_, i) => i / 20);

describe('nakładka kneeling_hinge: brak elementu, bo żadna reguła nie jest „ustalone”', () => {
  test('dane: obie reguły rodziny mają pewność „analogia” (nie „ustalone”), więc rodzina nie ma wpisu w TECHNIQUE', () => {
    expect(Object.keys(sens.reguly).sort()).toEqual(['plecy', 'pochylenie']);
    for (const [r, d] of Object.entries(sens.reguly) as [string, { pewnosc: string }][]) expect([r, d.pewnosc]).toEqual([r, 'analogia']);
    expect(Object.prototype.hasOwnProperty.call(TECHNIQUE, 'kneeling_hinge')).toBe(false);
  });
  test('niezmiennik: rodzina ma jedno ćwiczenie z rysunkiem (Seated Good Mornings), bez elementów i prowadnic w tabeli, nakładka pusta w każdej klatce i rzucie', () => {
    expect(spec().family).toBe('kneeling_hinge'); expect(figureSpec('Kneeling Squat')).toBeNull();
    expect(techniquesOf(K)).toEqual([]); expect(guidesOf(K)).toEqual([]);
    for (const u of US) for (const v of spec().views) expect([u, v, overlayShapes(spec(), u, v, [] as never)]).toEqual([u, v, []]);
  });
});

describe('geometria rysunku Seated Good Mornings (ruch)', () => {
  test('reguła pochylenie: skłon w biodrach rośnie o ≥ 30° (zmiana) i nie przekracza 95° od pionu; miednica nieruchoma na skrzyni (siad), tułów nie schodzi poniżej poziomu skrzyni', () => {
    const s = spec(); const a = frameAt(s, 0).sk, b = frameAt(s, 1).sk; const tilt = (sk: typeof a) => Math.abs(Math.atan2(sk.shoulderC[0] - sk.pelvis[0], sk.shoulderC[1] - sk.pelvis[1]) * 180 / Math.PI);
    expect(tilt(b) - tilt(a)).toBeGreaterThanOrEqual(30); expect(tilt(b)).toBeLessThanOrEqual(95); expect(measuredAngle(s, 1).deg - measuredAngle(s, 0).deg).toBeGreaterThanOrEqual(30);
    for (const u of US) { const sk = frameAt(s, u).sk; expect([u, sk.pelvis[0], sk.pelvis[1]]).toEqual([u, a.pelvis[0], a.pelvis[1]]); expect([u, sk.shoulderC[1] > sk.pelvis[1]]).toEqual([u, true]); }
  });
  test('ślad toru: sztanga na plecach w każdej klatce — odległość od środka barków 12–15 cm i zmienia się o najwyżej 2 cm (niesiona z tułowiem), w górnej części pleców (nie niżej niż 8 cm pod barkiem), ślad (info.load) = środek gryfu', () => {
    const s = spec(); const d: number[] = [];
    for (const u of US) { const f = frameAt(s, u); const bar = f.props.find(p => p.k === 'barbell') as unknown as { c: number[] }; const sh = f.sk.shoulderC;
      const dist = Math.hypot(bar.c[0] - sh[0], bar.c[1] - sh[1]); d.push(dist); expect([u, dist >= 12 && dist <= 15]).toEqual([u, true]); expect([u, bar.c[1] - sh[1] > -8]).toEqual([u, true]);
      expect([u, f.info.load]).toEqual([u, expect.any(Array)]); }
    expect(Math.max(...d) - Math.min(...d)).toBeLessThanOrEqual(2);
  });
});
