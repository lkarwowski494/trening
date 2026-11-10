/*
 * Figury v2 — rodzina leg_isolation (10.11.2026, partia 9 linii 1.1; włączenie rodziny + nakładka techniki wg decyzji właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18).
 * Rodzaje (docs/20): dane (8 ćwiczeń z rysunkiem z boku, 6 bez rysunku), logika (fazy, kierunek, staw), geometria (zakres kolana wg reguł „ustalone” z negatywem; piętom nie wolno zejść pod podłogę),
 * nakładka (rejestr elementów ← reguły „ustalone”, element ⇔ reguła wariantu + wskazówka na karcie), regresja (ćwiczenia bez wskazówki ruchu i reguły nie „ustalone” nie mają elementu).
 * Nie jest strażnikiem procesu — przypadek „gałąź z wcześniejszymi zmianami” (L-080) nie dotyczy.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { figureSpec, frameAt, jointAngles, phasesFor, measuredJoint, type PoseData } from '@/lib/figures/v2';
import { TECHNIQUE, techniquesFor } from '@/lib/figures/v2/overlay';
import { LEG_ISOLATION_TECHNIQUE } from '@/lib/figures/v2/overlay/leg_isolation';

const poses = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/leg_isolation.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.leg_isolation;
const NAMES = ['Leg Extension', 'Single-Leg Leg Extension', 'Leg Curl', 'Lying Leg Curl', 'Standing Leg Curl', 'Standing Cable Leg Curl', 'Seated Band Hamstring Curl', 'Slider Hamstring Curl'];
const BEZ_POZY = ['Glute Ham Raise', 'Leg Curl (hantel)', 'Nordic Curl', 'Reverse Nordic', 'Sissy Squat', 'Stability Ball Hamstring Curl'];
const US = Array.from({ length: 41 }, (_, i) => i / 40);
const fazy = (k: string) => phasesFor(figureSpec(k)!).map(p => p.name).filter(n => n !== 'Pauza');
/** Zakres zgięcia kolana (stopnie) w ruchu: [minimum, maksimum] dla nogi `s` w kadrach `us`. */
function kolano(k: string, s: 'R' | 'L', us = US): [number, number] {
  const v = us.map(u => jointAngles(frameAt(figureSpec(k)!, u).sk, s).knee); return [Math.min(...v), Math.max(...v)];
}

describe('dane: rodzina leg_isolation', () => {
  test('8 ćwiczeń z rysunkiem v2, tylko rzut z boku; 6 ćwiczeń rodziny bez rysunku (brak pozy, powód w generatorze: WYJATKI)', () => {
    expect(Object.keys(poses).sort()).toEqual([...NAMES].sort());
    for (const k of NAMES) { const s = figureSpec(k)!; expect([k, s.family, s.views]).toEqual([k, 'leg_isolation', ['side']]); }
    for (const k of BEZ_POZY) expect([k, figureSpec(k)]).toEqual([k, null]);
  });
});

describe('logika: fazy licznika i mierzony staw', () => {
  test.each([
    ['Leg Extension', ['Prostowanie', 'Opuszczanie']], ['Single-Leg Leg Extension', ['Prostowanie', 'Opuszczanie']],
    ['Leg Curl', ['Uginanie', 'Powrót']], ['Lying Leg Curl', ['Uginanie', 'Powrót']], ['Standing Leg Curl', ['Uginanie', 'Powrót']], ['Standing Cable Leg Curl', ['Uginanie', 'Powrót']], ['Seated Band Hamstring Curl', ['Uginanie', 'Powrót']],
    ['Slider Hamstring Curl', ['Opuszczanie', 'Uginanie']],
  ])('%s: fazy %j, mierzone kolano', (k, nazwy) => { expect(fazy(k)).toEqual(nazwy); expect(measuredJoint(figureSpec(k)!)).toBe('knee'); });
  test('Slider Hamstring Curl zaczyna od zgięcia (u = 0), pozostałe uginania od nogi prostej (u = 0) — kierunek u zgodny z fazami', () => {
    const k0 = (k: string) => jointAngles(frameAt(figureSpec(k)!, 0).sk, 'R').knee;
    expect(k0('Slider Hamstring Curl')).toBeGreaterThan(80);
    for (const k of ['Leg Curl', 'Lying Leg Curl', 'Standing Leg Curl', 'Standing Cable Leg Curl', 'Seated Band Hamstring Curl']) expect([k, k0(k) < 20]).toEqual([k, true]);
    expect(k0('Leg Extension')).toBeGreaterThan(80);
  });
});

describe('geometria: zakres kolana wg reguł „ustalone” (figury-sens.json, leg_isolation)', () => {
  const R = sens.reguly;
  test.each(['Leg Extension'])('%s: kolano od ≥ 80° do ≤ 15° (wyprost_kolan, obie nogi)', (k) => {
    for (const s of ['R', 'L'] as const) { const [mn, mx] = kolano(k, s); expect([k, s, mx >= R.wyprost_kolan.parametry.min_max_deg, mn <= R.wyprost_kolan.parametry.max_min_deg]).toEqual([k, s, true, true]); }
  });
  test('Single-Leg Leg Extension: co najmniej jedna noga pokrywa zakres (wyprost_kolan_jednonoz)', () => {
    const [mn, mx] = kolano('Single-Leg Leg Extension', 'R'); expect([mx >= R.wyprost_kolan_jednonoz.parametry.min_max_deg, mn <= R.wyprost_kolan_jednonoz.parametry.max_min_deg]).toEqual([true, true]);
  });
  test.each(['Leg Curl', 'Lying Leg Curl', 'Slider Hamstring Curl'])('%s: kolano od ≤ 20° do ≥ 80° (uginanie_kolan, obie nogi)', (k) => {
    for (const s of ['R', 'L'] as const) { const [mn, mx] = kolano(k, s); expect([k, s, mx >= R.uginanie_kolan.parametry.min_max_deg, mn <= R.uginanie_kolan.parametry.max_min_deg]).toEqual([k, s, true, true]); }
  });
  test.each(['Standing Leg Curl', 'Standing Cable Leg Curl', 'Seated Band Hamstring Curl'])('%s: pracująca noga (prawa) pokrywa zakres uginania (uginanie_kolan_jednonoz)', (k) => {
    const [mn, mx] = kolano(k, 'R'); expect([k, mx >= R.uginanie_kolan_jednonoz.parametry.min_max_deg, mn <= R.uginanie_kolan_jednonoz.parametry.max_min_deg]).toEqual([k, true, true]);
  });
  test('negatyw: połowa ruchu (u ≤ 0,4) nie wyprostowuje kolana poniżej 15° w Leg Extension i nie zgina go do 80° w Leg Curl', () => {
    const polowa = US.filter(u => u <= 0.4);
    expect(kolano('Leg Extension', 'R', polowa)[0]).toBeGreaterThan(15);
    expect(kolano('Leg Curl', 'R', polowa)[1]).toBeLessThan(80);
  });
  test.each(NAMES)('%s: pięty nigdy pod podłogą (≥ −0,5 cm) w żadnym kadrze', (k) => {
    for (const u of US) { const f = frameAt(figureSpec(k)!, u); for (const s of ['R', 'L'] as const) expect([k, u, s, f.sk.legs[s].heel[1] >= -0.5]).toEqual([k, u, s, true]); }
  });
});

describe('nakładka: elementy rodziny ← reguły „ustalone”', () => {
  test('rejestr: trzy elementy „limb” (kolano) w rzucie z boku; TECHNIQUE.leg_isolation wskazuje tę tablicę', () => {
    expect(LEG_ISOLATION_TECHNIQUE.map(d => [d.id, d.kind, d.rule, d.views, d.joint])).toEqual([
      ['legExtKneeLimb', 'limb', 'wyprost_kolan', ['side'], 'knee'], ['legExtSingleKneeLimb', 'limb', 'wyprost_kolan_jednonoz', ['side'], 'knee'], ['legCurlKneeLimb', 'limb', 'uginanie_kolan', ['side'], 'knee']]);
    expect(LEG_ISOLATION_TECHNIQUE.map(d => d.exercises)).toEqual([['Leg Extension'], ['Single-Leg Leg Extension'], undefined]);
    expect(TECHNIQUE.leg_isolation).toBe(LEG_ISOLATION_TECHNIQUE);
  });
  test('reguły elementów są „ustalone”, a każda wskazówka elementu należy do wskazowki_na_reguly tej reguły', () => {
    for (const d of LEG_ISOLATION_TECHNIQUE) {
      expect(sens.reguly[d.rule].pewnosc).toMatch(/^ustalone/);
      /* wyprost_kolan_jednonoz nie jest wpisany w wskazowki_na_reguly (lext.range → tylko wyprost_kolan), ale jest regułą wariantu Single-Leg Leg Extension (warianty) — wskazówka legExt z zestawu ogólnego opisuje ten sam ruch (pytanie do badacza w raporcie) */
      if (d.rule !== 'wyprost_kolan_jednonoz') for (const c of d.cue) expect([c, sens.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]);
      for (const k of d.exercises ?? []) expect([k, sens.warianty[k]]).toEqual([k, expect.arrayContaining([d.rule])]);
    }
  });
  test.each([
    ['Leg Extension', ['lext.range', 'llc.control'], ['legExtKneeLimb']],
    ['Single-Leg Leg Extension', ['lext.range', 'llc.control'], ['legExtSingleKneeLimb']],
    ['Leg Curl', ['lcurl.move', 'lcurl.still', 'llc.control'], ['legCurlKneeLimb']],
    ['Lying Leg Curl', ['llc.setup', 'llc.move', 'llc.hips', 'llc.control'], ['legCurlKneeLimb']],
  ])('%s: element nakładki %j ⇔ reguła wariantu i wskazówka ruchu na karcie', (k, cue, ids) => {
    expect(techniquesFor('leg_isolation', cue, k).map(d => d.id)).toEqual(ids);
  });
  test.each([
    ['Standing Leg Curl', ['lcurl.still', 'llc.control']], ['Standing Cable Leg Curl', ['lcurl.still', 'llc.control']],
    ['Seated Band Hamstring Curl', ['bandcurl.setup', 'bandcurl.move', 'lcurl.full']], ['Slider Hamstring Curl', ['slcurl.setup', 'slcurl.move', 'plank.brace']],
  ])('regresja: %s nie ma elementu (karta ani zestaw nie mają wskazówki ruchu będącej kluczem reguły uginania)', (k, cue) => { expect(techniquesFor('leg_isolation', cue, k)).toEqual([]); });
  test('regresja: reguły niemierzalne w nakładce (nieruchoma miednica w cm, nordic, plecy_most) nie mają elementu', () => {
    const reguly = LEG_ISOLATION_TECHNIQUE.map(d => d.rule);
    for (const r of ['biodra_nieruchome_poziom', 'biodra_nieruchome_pion', 'nordic_biodra_proste', 'nordic_zakres', 'plecy_most', 'uginanie_kolan_jednonoz']) expect(reguly).not.toContain(r);
  });
});
