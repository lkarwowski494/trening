/*
 * Figury v2 — rodzina thruster (10.11.2026, partia 4 linii 1.1; włączenie rodziny + nakładka techniki wg decyzji właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18).
 * Rodzaje (docs/20): dane (3 ćwiczenia z rysunkiem, pętla jednokierunkowa, widok z boku), logika (fazy, staw), geometria (dłonie na ciężarze w każdym kadrze, z negatywem; ślad ciężaru ≤ 3 cm od chwytu;
 * pięty na podłodze w pozie poprawnej), nakładka (rejestr elementów ← reguły „ustalone”, element ⇔ reguła wariantu + wskazówka na karcie), regresja (reguły bez „ustalone” nie mają elementu).
 * Nie jest strażnikiem procesu — przypadek „gałąź z wcześniejszymi zmianami” (L-080) nie dotyczy.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { figureSpec, frameAt, keyframeFrame, phasesFor, measuredJoint, type PoseData } from '@/lib/figures/v2';
import { TECHNIQUE } from '@/lib/figures/v2/overlay';
import { THRUSTER_TECHNIQUE } from '@/lib/figures/v2/overlay/thruster';

const poses = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/thruster.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.thruster;
const NAMES = ['Thruster (hantle)', 'Kettlebell Thruster', 'Clean and Press'];
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const dist = (a: number[], b: number[]) => Math.hypot(...a.map((x, i) => x - b[i]));

/** Błędy chwytu: dłoń dalej niż `tol` cm od ciężaru (hantel i kettlebell: środek; sztanga: oś, w granicach długości gryfu). Pusta lista = każda dłoń na ciężarze. */
function bladChwytu(d: PoseData, tol = 3, przes = [0, 0, 0]): unknown[] {
  const out: unknown[] = [];
  for (const u of US) {
    const f = keyframeFrame(d, u); const props = f.props as any[];
    for (const s of ['R', 'L'] as const) {
      const g = (f.sk.arms[s].grip as number[]).map((x, i) => x + przes[i]); /* przes ≠ 0 tylko w teście negatywnym: dłoń odsunięta od ciężaru */
      const own = props.filter(p => (p.k === 'dumbbell' || p.k === 'kettlebell') && p.side === s);
      const bar = props.filter(p => p.k === 'barbell');
      if (own.length) { const e = dist(g, own[0].c); if (e > tol) out.push([own[0].k, u, s, e]); }
      else if (bar.length) { const b = bar[0]; const e = Math.hypot(g[0] - b.c[0], g[1] - b.c[1]); if (e > tol || Math.abs(g[2]) > b.len / 2) out.push(['sztanga', u, s, e]); }
      else out.push(['brak ciężaru', u, s, 0]);
    }
  }
  return out;
}

describe('dane: rodzina thruster', () => {
  test('3 ćwiczenia z rysunkiem v2, tylko rzut z boku, każde w pętli jednokierunkowej (przysiad i wyciskanie w jednym przebiegu)', () => {
    expect(Object.keys(poses).sort()).toEqual([...NAMES].sort());
    for (const k of NAMES) { const s = figureSpec(k)!; expect([k, s.family, s.views]).toEqual([k, 'thruster', ['side']]); expect([k, poses[k].petla]).toEqual([k, 'jednokierunkowa']); }
  });
  test('fazy: jedna faza „Podnoszenie” (bez sekund opuszczania), mierzony staw kolano albo biodro', () => {
    for (const k of NAMES) { const s = figureSpec(k)!; expect([k, phasesFor(s).map(p => p.name).filter(n => n !== 'Pauza')]).toEqual([k, ['Podnoszenie']]); expect(['knee', 'hip']).toContain(measuredJoint(s)); }
  });
});

describe('geometria: dłonie na ciężarze (10.11.2026, K4)', () => {
  test.each(NAMES)('%s: każda dłoń ≤ 3 cm od ciężaru w 21 kadrach', (k) => { expect(bladChwytu(poses[k])).toEqual([]); });
  test('negatyw: dłoń odsunięta o 8 cm od ciężaru jest wykrywana (hantel, kettlebell i sztanga)', () => {
    for (const k of NAMES) {
      expect([k, bladChwytu(poses[k], 3, [8, 0, 0]).length > 0]).toEqual([k, true]);
    }
  });
});

const stare = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/thruster-r1-przed-poprawka.json'), 'utf8')).cwiczenia as Record<string, PoseData>; /* poza sprzed poprawek r1 — negatyw */
const GRID = Array.from({ length: 101 }, (_, i) => i / 100);
/** Miary r1 (W1–W3), 10.11.2026: klatka z najwyższym chwytem (koniec wyciskania), najniższe udo, odległość chwytu od chwytu startowego. */
function miary(d: PoseData) {
  let top = { u: 0, y: -1e9 }; let udo = { u: 0, kat: 1e9 };
  for (const u of GRID) { const f = keyframeFrame(d, u); const gy = (f.sk.arms.R.grip as number[])[1]; if (gy > top.y) top = { u, y: gy };
    const L = f.sk.legs.R; const kat = Math.atan2(L.hip[1] - L.knee[1], Math.abs(L.hip[0] - L.knee[0])) * 180 / Math.PI; if (kat < udo.kat) udo = { u, kat }; }
  const ft = keyframeFrame(d, top.u); const gx = (ft.sk.arms.R.grip as number[])[0];
  const g0 = keyframeFrame(d, 0).sk.arms.R.grip as number[]; const g1 = keyframeFrame(d, 1).sk.arms.R.grip as number[];
  return { dxBark: Math.abs(gx - ft.sk.shoulderC[0]), dxKostka: Math.abs(gx - ft.sk.legs.R.ankle[0]), udoNadPoziom: udo.kat, powrot: Math.hypot(g1[0] - g0[0], g1[1] - g0[1]) };
}
describe('ruch: koniec wyciskania, głębokość, powrót na barki (r1 W1–W3, 10.11.2026)', () => {
  test.each(NAMES)('W1 %s: na górze chwyt nad barkami (≤ 10 cm) i nad kostką (≤ 5 cm)', (k) => { const m = miary(poses[k]); expect([k, m.dxBark <= 10, m.dxKostka <= 5]).toEqual([k, true, true]); });
  test.each(['Thruster (hantle)', 'Kettlebell Thruster'])('W2 %s: udo do równoległego lub niżej (biodro nie wyżej niż kolano)', (k) => { expect([k, miary(poses[k]).udoNadPoziom <= 0]).toEqual([k, true]); });
  test.each(['Thruster (hantle)', 'Kettlebell Thruster'])('W3 %s: ciężar wraca na barki (chwyt w u = 1 ≤ 5 cm od chwytu w u = 0)', (k) => { expect([k, miary(poses[k]).powrot <= 5]).toEqual([k, true]); });
  test('negatyw: poza sprzed poprawek (r1) oblewa W1, W2 i W3', () => {
    const t = miary(stare['Thruster (hantle)']); expect(t.dxBark).toBeGreaterThan(10); expect(t.dxKostka).toBeGreaterThan(5); expect(t.udoNadPoziom).toBeGreaterThan(0); expect(t.powrot).toBeGreaterThan(5);
    expect(miary(stare['Clean and Press']).dxBark).toBeGreaterThan(10);
  });
});

describe('geometria: pozy poprawne', () => {
  test.each(['Thruster (hantle)', 'Kettlebell Thruster'])('%s: stopy płasko — pięta ≤ 2 cm nad podłogą w każdym kadrze poprawnej pozy (reguła „piety”)', (k) => {
    for (const u of US) { const f = frameAt(figureSpec(k)!, u); for (const s of ['R', 'L'] as const) expect([k, u, s, f.sk.legs[s].heel[1] <= 2]).toEqual([k, u, s, true]); }
  });
});

describe('nakładka: elementy rodziny ← reguły „ustalone”', () => {
  test('rejestr: dwa elementy ref (plecy, ciężar blisko), rzut z boku; TECHNIQUE.thruster wskazuje tę tablicę', () => {
    expect(THRUSTER_TECHNIQUE.map(d => [d.id, d.kind, d.rule, d.views])).toEqual([['thrusterBackRef', 'ref', 'plecy_neutralne', ['side']], ['thrusterBarCloseRef', 'ref', 'ciezar_blisko', ['side']]]);
    expect(TECHNIQUE.thruster).toBe(THRUSTER_TECHNIQUE);
  });
  test('reguły elementów są „ustalone”, a każda wskazówka elementu należy do wskazowki_na_reguly tej reguły', () => {
    for (const d of THRUSTER_TECHNIQUE) { expect(sens.reguly[d.rule].pewnosc).toMatch(/^ustalone/); for (const c of d.cue) expect([c, sens.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]); }
  });
  test('regresja: reguły bez „ustalone” (przysiad, start_przy_barkach, nad_glowa) i reguły styku bez wskazówki (piety, kolana_nad_stopami z rzutem tylko z boku) nie mają elementu', () => {
    const reguly = THRUSTER_TECHNIQUE.map(d => d.rule); for (const r of ['przysiad', 'start_przy_barkach', 'nad_glowa', 'piety', 'kolana_nad_stopami']) expect(reguly).not.toContain(r);
  });
  test('Thruster (hantle) i Kettlebell Thruster nie mają reguł plecy_neutralne ani ciezar_blisko, Clean and Press ma obie', () => {
    expect(sens.warianty['Clean and Press']).toEqual(expect.arrayContaining(['plecy_neutralne', 'ciezar_blisko']));
    for (const k of ['Thruster (hantle)', 'Kettlebell Thruster']) { expect(sens.warianty[k]).not.toContain('plecy_neutralne'); expect(sens.warianty[k]).not.toContain('ciezar_blisko'); }
  });
});
