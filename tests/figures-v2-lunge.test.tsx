/*
 * Figury v2 — rodzina lunge (10.11.2026, partia 9 linii 1.1; włączenie rodziny + nakładka techniki wg decyzji właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18).
 * Rodzaje (docs/20): dane (24 ćwiczenia z rysunkiem, widoki z boku i z przodu), logika (nazwy faz, kierunek u: wejście na stopień odwrócone), nakładka (rejestr elementów ← reguły „ustalone”,
 * element ⇔ reguła wariantu + wskazówka na karcie albo w zestawie), regresja (reguły bez elementu: głębokość wykroku, wejście, wolna noga).
 * Nie jest strażnikiem procesu — przypadek „gałąź z wcześniejszymi zmianami” (L-080) nie dotyczy.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { figureSpec, phasesFor, lowerFirstOf, DATA_UI, FAMILIES, type PoseData } from '@/lib/figures/v2';
import { TECHNIQUE, techniquesFor } from '@/lib/figures/v2/overlay';
import { LUNGE_TECHNIQUE } from '@/lib/figures/v2/overlay/lunge';

const poses = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/lunge.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.lunge;
const KEYS = Object.keys(poses);
const STEP = ['Step Up', 'Barbell Step Up'];

describe('dane: rodzina lunge', () => {
  test('rodzina ready, 24 ćwiczenia z rysunkiem v2, widoki z boku i z przodu', () => {
    expect(FAMILIES.find(f => f.id === 'lunge')!.status).toBe('ready'); expect(KEYS).toHaveLength(24);
    for (const k of KEYS) { const s = figureSpec(k)!; expect([k, s.family, s.views]).toEqual([k, 'lunge', ['side', 'front']]); }
  });
  test('fazy: wykroki i przysiady — Opuszczanie → Wstawanie (opuszczanie pierwsze), wejścia na stopień — Wstawanie → Opuszczanie', () => {
    for (const k of KEYS) {
      const s = figureSpec(k)!; const n = phasesFor(s).map(p => p.name).filter(x => x !== 'Pauza');
      expect([k, n, lowerFirstOf(DATA_UI.lunge, k)]).toEqual(STEP.includes(k) ? [k, ['Wstawanie', 'Opuszczanie'], false] : [k, ['Opuszczanie', 'Wstawanie'], true]);
    }
  });
});

describe('nakładka: elementy rodziny ← reguły „ustalone”', () => {
  test('rejestr: plecy (ref, z boku) i kolano nad stopą (ref, z przodu); TECHNIQUE.lunge wskazuje tę tablicę', () => {
    expect(LUNGE_TECHNIQUE.map(d => [d.id, d.kind, d.rule, d.views])).toEqual([['lungeBackRef', 'ref', 'plecy_proste', ['side']], ['lungeKneeToeRef', 'ref', 'kolano_nad_stopa', ['front']]]);
    expect(TECHNIQUE.lunge).toBe(LUNGE_TECHNIQUE);
  });
  test('reguły elementów są „ustalone”, a każda wskazówka elementu należy do wskazowki_na_reguly tej reguły', () => {
    for (const d of LUNGE_TECHNIQUE) { expect(sens.reguly[d.rule].pewnosc).toMatch(/^ustalone/); for (const c of d.cue) expect([c, sens.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]); }
  });
  test.each([
    ['Reverse Lunge', ['lunge.torso'], ['lungeBackRef']],
    ['Bulgarian Split Squat (hantle)', ['lunge.torso', 'lunge.knee'], ['lungeBackRef', 'lungeKneeToeRef']],
    ['Step Up', ['lunge.torso', 'stepup.knee'], ['lungeBackRef', 'lungeKneeToeRef']],
    ['Lateral Lunge', ['sq.back', 'lunge.knee'], ['lungeBackRef', 'lungeKneeToeRef']],
    ['Pistol Squat', ['pistol.knee'], ['lungeKneeToeRef']],
    ['Smith Machine Pistol Squat', ['pistol.knee'], ['lungeKneeToeRef']],
    ['Crossover Reverse Lunge', ['lunge.knee'], ['lungeKneeToeRef']],
  ])('%s: elementy nakładki wg wskazówek (%j)', (k, cues, oczekiwane) => { expect(techniquesFor('lunge', cues, k).map(d => d.id)).toEqual(oczekiwane); });
  test('regresja: pistolet nie ma linii pleców (reguła plecy_proste nie jest przypisana wariantowi), nawet gdy wskazówka o plecach jest podana', () => {
    expect(sens.warianty['Pistol Squat']).not.toContain('plecy_proste'); expect(techniquesFor('lunge', ['lunge.torso', 'pistol.knee'], 'Pistol Squat').map(d => d.id)).toEqual(['lungeKneeToeRef']);
  });
  test('regresja: reguły bez rodzaju elementu w silniku (głębokość wykroku, wejście, wolna noga) nie mają elementu', () => {
    const reguly = LUNGE_TECHNIQUE.map(d => d.rule); for (const r of ['glebokosc_wykroku', 'wejscie', 'wolna_noga_w_przod']) expect(reguly).not.toContain(r);
    expect(techniquesFor('lunge', ['lunge.fwd', 'stepup.move', 'pistol.setup'], 'Pistol Squat')).toEqual([]);
  });
});
