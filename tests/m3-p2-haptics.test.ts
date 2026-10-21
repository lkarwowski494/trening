/*
 * M3 p2 — haptyka tablicy „teraz” (decyzja STOP E3, 21.10.2026; docs/32 wzorzec 29; mapa HAPTICS w lib/tokens.ts):
 *  - „tick” (selection) przy ±, ostrzegawcza (notificationWarning) przy „Seria zrobiona” bez wyniku;
 *  - obie przez HAPTICS i OBECNY przełącznik dźwięku/wibracji (settings.sound) — rozdzielenie przełączników to p5d, tu nie ruszane;
 *  - przy wyłączonym przełączniku ani jednej wibracji.
 */
import * as store from '@/lib/store';
import { HAPTICS } from '@/lib/theme';
import { playHaptic } from '@/lib/haptics';
import { fresh } from './helpers';

const calls = () => global.__haptics as string[];
beforeEach(async () => { await fresh(); calls().length = 0; });

describe('mapa HAPTICS: zdarzenia tablicy są zapisane w tokenach (źródło prawdy)', () => {
  test('± → selection, „Seria zrobiona” bez wartości → notificationWarning; oba oznaczone jako nowe (zatwierdzone na STOP E3)', () => {
    const step = HAPTICS.find(h => h.kiedy.startsWith('± na tablicy'))!; const miss = HAPTICS.find(h => h.kiedy.startsWith('„Seria zrobiona” bez wartości'))!;
    expect(step).toMatchObject({ haptyka: 'selection', dzwiek: false, nowe: true }); expect(miss).toMatchObject({ haptyka: 'notificationWarning', dzwiek: false, nowe: true });
  });
});

describe('playHaptic', () => {
  test('± (step): jedno „selection”, gdy przełącznik dźwięku/wibracji włączony', () => { playHaptic('step'); expect(calls()).toEqual(['selection']); });
  test('„Seria zrobiona” bez wartości (missing): jedno ostrzeżenie', () => { playHaptic('missing'); expect(calls()).toEqual(['notification:warning']); });
  test('przełącznik wyłączony (settings.sound = false): żadnej wibracji', () => { store.getState().settings.sound = false; playHaptic('step'); playHaptic('missing'); expect(calls()).toEqual([]); });
  test('ponowne włączenie przywraca wibracje (przełącznik czytany przy każdym zdarzeniu)', () => { store.getState().settings.sound = false; playHaptic('step'); store.getState().settings.sound = true; playHaptic('step'); expect(calls()).toEqual(['selection']); });
});
