/*
 * P3-MARSZ (11.11.2026, wariant A koordynatora sesji L; recenzja H-1/H-2 partii 3): Lateral Band Walk i Monster Walk to marsz, nie wahadło jednej nogi.
 * Generator rysuje CAŁE powtórzenie w trybie `jednokierunkowa` (u = 1 ≡ u = 0; `cykl_lustro` odpada — lustro odwraca kierunek kroku w bok), nogi na przemian,
 * guma napięta między kostkami, fazy „Marsz”. Wstrzymanie (WYJATKI) zdejmuje koordynator po recenzji niezależnej — testy działają na wyniku generuj().
 */
import * as path from 'path';
import { execFileSync } from 'child_process';
import { DATA_UI } from '@/lib/figures/v2/poseData';

jest.setTimeout(120000);
const ROOT = path.join(__dirname, '..');
type V3 = [number, number, number];
type Poza = { petla?: string; sprzet: { rodzaj: string; mocowanie?: string }[]; klatki: { u: number; nogi: Record<'R' | 'L', { kostka: V3 }> }[]; bledy: unknown[] };
const SKRYPT = `import { generuj } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/agent-pozy/hip_abd_add.mjs'))}; import { waliduj } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-validate.mjs'))};
const o = {}; for (const cw of ['Lateral Band Walk', 'Monster Walk']) { const p = JSON.parse(JSON.stringify(generuj()[cw]())); o[cw] = { p, v: waliduj(p, { rodzina: 'hip_abd_add', cwiczenie: cw }) }; } process.stdout.write(JSON.stringify(o));`;
const WYNIK = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', SKRYPT], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26 })) as Record<string, { p: Poza; v: { ok: boolean; bledy: unknown[] } }>;
const dist = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const PODLOGA_Y = 7; /* kostka stopy płasko na podłodze */

describe.each(['Lateral Band Walk', 'Monster Walk'])('%s', (cw) => {
  const { p, v } = WYNIK[cw]; const R = p.klatki.map((k) => k.nogi.R.kostka); const L = p.klatki.map((k) => k.nogi.L.kostka);
  test('poza przechodzi walidator (geometria i reguły sensu), bez błędów w pozie', () => { expect([v.ok, v.bledy]).toEqual([true, []]); expect(p.bledy).toEqual([]); });
  test('tryb jednokierunkowa: całe powtórzenie, klatka u = 1 ≡ u = 0 (pętla ciągła, bez cofania ruchu)', () => {
    expect(p.petla).toBe('jednokierunkowa'); expect(p.klatki[0].u).toBe(0); expect(p.klatki[p.klatki.length - 1].u).toBe(1);
    expect(p.klatki[p.klatki.length - 1].nogi).toEqual(p.klatki[0].nogi);
  });
  test('stopy na przemian: nigdy obie w powietrzu; każda noga odrywa się od podłogi, w kroku w bok prawa przed lewą', () => {
    const wPow = (a: V3) => a[1] > PODLOGA_Y + 1;
    for (let i = 0; i < R.length; i++) expect([i, wPow(R[i]) && wPow(L[i])]).toEqual([i, false]);
    const iR = R.findIndex(wPow); const iL = L.findIndex(wPow);
    expect(iR).toBeGreaterThanOrEqual(0); expect(iL).toBeGreaterThanOrEqual(0); if (cw === 'Lateral Band Walk') expect(iL).toBeGreaterThan(iR); else expect(iL).not.toBe(iR);
    if (cw === 'Lateral Band Walk') expect(R.slice(iL).some(wPow)).toBe(false); /* prawa lata tylko w pierwszej połowie, lewa dostawia się w drugiej */
  });
  test('guma na kostkach napięta w każdej klatce (kostki ≥ 28 cm) i nogi się nie krzyżują (prawa po prawej, lewa po lewej)', () => {
    expect(p.sprzet.some((s) => s.rodzaj === 'guma' && s.mocowanie === 'kostki')).toBe(true);
    for (let i = 0; i < R.length; i++) { expect([i, dist(R[i], L[i]) >= 28]).toEqual([i, true]); expect([i, R[i][2] > 0 && L[i][2] < 0]).toEqual([i, true]); }
  });
});
describe('Lateral Band Walk: krok w bok z dostawieniem', () => {
  const p = WYNIK['Lateral Band Walk'].p; const szer = p.klatki.map((k) => k.nogi.R.kostka[2] - k.nogi.L.kostka[2]);
  test('szerokość stóp rośnie (krok prawą) i wraca (dostawienie lewej): 28 → 54 → 28 cm', () => { expect([szer[0], Math.max(...szer), szer[szer.length - 1]]).toEqual([28, 54, 28]); expect(szer.indexOf(54)).toBe(2); });
  test('stopa lewa dostawia się: w drugiej połowie lewa jest w powietrzu, a prawa stoi', () => { const k3 = p.klatki[3].nogi; expect(k3.L.kostka[1]).toBeGreaterThan(PODLOGA_Y + 1); expect(k3.R.kostka[1]).toBe(PODLOGA_Y); });
});
describe('Monster Walk: naprzemienne kroki po skosie w przód', () => {
  const p = WYNIK['Monster Walk'].p;
  test('stopa podporowa cofa się względem miednicy (x maleje), przenoszona wychodzi do przodu; obie w pełnym zakresie ±12 cm', () => {
    const xs = p.klatki.map((k) => k.nogi.R.kostka[0]); expect([Math.max(...xs), Math.min(...xs)]).toEqual([12, -12]);
    expect(xs[1]).toBeLessThan(xs[0]); /* faza podparcia prawej: x maleje */
  });
});
describe('fazy marszu (licznik)', () => {
  test.each(['Lateral Band Walk', 'Monster Walk'])('%s: faza „Marsz” (nie „Rozsuwanie/Powrót”), kąt ukryty', (cw) => {
    const x = DATA_UI.hip_abd_add.exceptions![cw]; expect(x.names).toEqual({ first: 'Marsz', second: 'Marsz' }); expect(x.hideAngle).toBe(true);
  });
});
