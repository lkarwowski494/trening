/*
 * Nakładka techniki rodziny chest_press_machine (partia 4, 09.11.2026; decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18): scenariusz i macierz.
 * Element rysuje się tylko, gdy ćwiczenie ma jego wskazówkę na karcie ORAZ regułę „ustalone” wariantu (data/zrodla/figury-sens.json → rodziny.chest_press_machine.warianty):
 * łuk łokcia (zakres_klatka / nad_glowa), linia tułowia przy oparciu (plecy_przy_oparciu, mcp.blades), poziom barków przy starcie wyciskania nad głowę (start_przy_barkach, msp.seat).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { figureSpec, overlayShapes, type FigureSpec } from '@/lib/figures/v2';
import { TECHNIQUE, techniquesFor } from '@/lib/figures/v2/overlay';
import { techniquesOf } from '@/lib/figures/v2/ui';
import { CUE_SETS } from '@/lib/figures/v2/cueSets';
import { CHEST_PRESS_MACHINE_TECHNIQUE } from '@/lib/figures/v2/overlay/chest_press_machine';

const SENS = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/zrodla/figury-sens.json'), 'utf8')).rodziny.chest_press_machine;
const OCZEKIWANE: Record<string, string[]> = {
  'Machine Chest Press': ['machineBackRef', 'machineChestElbowLimb'],
  'Leverage Incline Chest Press': ['machineBackRef', 'machineChestElbowLimb'],
  'Leverage Decline Chest Press': ['machineBackRef', 'machineChestElbowLimb'],
  'Machine Shoulder Press': ['machineOverheadElbowLimb', 'machineShoulderLevelRef'],
  'Smith Machine Shoulder Press': ['machineOverheadElbowLimb'],
};

describe('chest_press_machine: nakładka techniki (09.11.2026)', () => {
  test('rejestr: 4 elementy, każdy z regułą „ustalone” i wskazówkami z wskazowki_na_reguly tej reguły', () => {
    expect(TECHNIQUE.chest_press_machine).toBe(CHEST_PRESS_MACHINE_TECHNIQUE); expect(CHEST_PRESS_MACHINE_TECHNIQUE.map(d => d.id)).toEqual(['machineChestElbowLimb', 'machineOverheadElbowLimb', 'machineBackRef', 'machineShoulderLevelRef']);
    for (const d of CHEST_PRESS_MACHINE_TECHNIQUE) {
      expect([d.id, String(SENS.reguly[d.rule].pewnosc).startsWith('ustalone')]).toEqual([d.id, true]);
      for (const c of d.cue) expect([d.id, c, SENS.wskazowki_na_reguly[c]]).toEqual([d.id, c, expect.arrayContaining([d.rule])]);
      expect(d.views).toEqual(['side']);
    }
  });
  test.each(Object.entries(OCZEKIWANE))('%s: elementy nakładki wg wskazówek karty i reguł wariantu', (k, ids) => {
    /* karta własna: elementy wprost z karty (techniquesOf); zestaw ogólny: techniquesOf zwraca elementy dopiero po wpisie recenzji „zestawy” (strażnik kazda-rodzina), więc tu wybór po wskazówkach zestawu */
    const e = CUE_SETS.items[k]; const cues = e.b === 'general' ? e.ok ?? [] : null;
    const wybrane = cues ? techniquesFor('chest_press_machine', cues, k).map(d => d.id) : techniquesOf(k);
    expect([...wybrane].sort()).toEqual(ids);
  });
  test.each(Object.entries(OCZEKIWANE))('%s: każdy wybrany element ma kształty w rzucie z boku (linia/łuk) w którejś klatce', (k, ids) => {
    const s = figureSpec(k) as FigureSpec; expect(s.views).toEqual(['side']);
    for (const id of ids) expect([k, id, [0, 0.25, 0.5, 0.75, 1].some(u => overlayShapes(s, u, 'side', [id]).length > 0)]).toEqual([k, id, true]);
  });
  test('reguła wariantu steruje wyborem: Smith nie dostaje łuku klatki ani poziomu barków (karta ogólna bez msp.seat), maszyna klatki nie dostaje łuku „nad głową”', () => {
    expect(techniquesFor('chest_press_machine', ['mcp.move', 'ohp.move', 'msp.seat'], 'Smith Machine Shoulder Press').map(d => d.id).sort()).toEqual(['machineOverheadElbowLimb', 'machineShoulderLevelRef']);
    expect(techniquesFor('chest_press_machine', ['mcp.move', 'ohp.move', 'mcp.blades'], 'Machine Chest Press').map(d => d.id).sort()).toEqual(['machineBackRef', 'machineChestElbowLimb']);
    expect(techniquesFor('chest_press_machine', ['mcp.move'], 'Ćwiczenie spoza rodziny')).toEqual([]);
    expect(techniquesFor('chest_press_machine', [], 'Machine Chest Press')).toEqual([]);
  });
});
