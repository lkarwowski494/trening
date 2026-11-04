/*
 * Nakładka techniki: podciąganie (etap 2, 04.11.2026). Na razie BEZ elementów: żadna reguła rodziny pull_up w data/zrodla/figury-sens.json nie ma pola `pewnosc`
 * (jedyna rodzina w całości bez niego), więc żadna nie jest „ustalone” — decyzja właściciela 04.11.2026: element tylko dla reguły „ustalone”.
 * Kandydat po uzupełnieniu statusu przez badacza (trzy źródła w cues.json: ACE, NASM, ExRx): `dol_rece_proste` (cue pu.partial; pu.pull) → limb, joint 'elbow', views ['side']
 * (linia bark–łokieć–dłoń + łuk łokcia: na dole prosta ręka, bez łuku). `broda_nad_drazkiem` (poziom drążka) i `miednica_nie_buja` (pion pod drążkiem) wymagają rodzaju E3 w silniku.
 * Test (tests/figures-v2-nakladka-curl-pullup.test.tsx) wymusza: element tylko z regułą „ustalone”; dziś lista pusta.
 */
import type { TechniqueDef } from '../overlay';

export const PULL_UP_TECHNIQUE: TechniqueDef[] = [];
