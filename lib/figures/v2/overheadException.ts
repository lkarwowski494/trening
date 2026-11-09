// Wyjątek zakresu barku figur v2 nad głową (101-11) — wydzielony z contract.ts (limit rozmiaru plików M1-054, 29.10.2026); kontrakt importuje go w validatePose.
import type { V3 } from './math';

/**
 * 101-11 (decyzja właściciela D1 = A, 29.10.2026; rozstrzygnięcie: docs/research/1-0-1-zrodla-2026-10-29.md pkt 4): WYJĄTEK zakresu barku dla dwóch figur — Overhead Squat i One-Arm Overhead
 * Kettlebell Squat (od 04.11.2026 także fazy nad głową rodziny olympic, lista `przejscie`). Powód: cecha rozpoznawcza — ręce pionowo nad głową przy pochylonym tułowiu. Reguła zależna od pochylenia tułowia θ (linia biodro–bark od pionu, stopnie):
 * zgięcie barku w płaszczyźnie strzałkowej (kąt ramię–tułów) = 180° + θ − (odchylenie ramienia od pionu, dodatnie = przed pionem), a ramię może być najwyżej `aheadMax`° PRZED pionem i do `behindMax`° ZA pionem,
 * czyli kąt mieści się w [180 + θ − aheadMax, 180 + θ + behindMax]. (Rachunek, szczebel 1: ramię pionowo → 180° + θ. Notatka badacza podaje też „≤ 180° + θ + 5°”, co przy ramieniu 10° za pionem
 * jest sprzeczne z samą granicą 10° — przyjęto granicę z odchylenia ramienia, nie sztywne +5°.) Liczba > 180° to UPROSZCZENIE (tułów jako odcinek: wyprost odcinka piersiowego liczy się jako kąt w barku),
 * tolerancje 5°/10° to KONWENCJA. Zgięcie barku w płaszczyźnie czołowej (shElev) do 180° (ramię nie dalej niż pion). Inne figury nadal mają limit z ROM (ok. 171°).
 */
const OLYMPIC_NAD_GLOWA: readonly string[] = ['Barbell Snatch', 'Power Snatch', 'Split Snatch', 'Hang Snatch', 'Block Snatch', 'Block Power Snatch', 'Snatch Balance', 'Muscle Snatch', 'Power Jerk', 'Split Jerk', 'Squat Jerk', 'Jerk Balance', 'Clean and Jerk'];
export const OVERHEAD_SHOULDER_EXCEPTION = {
  keys: ['Overhead Squat', 'One-Arm Overhead Kettlebell Squat', ...OLYMPIC_NAD_GLOWA] as readonly string[],
  /** Ćwiczenia olympic (decyzja koordynatora 04.11.2026, pkt 4): ten sam wyjątek dla faz nad głową; ruch zaczyna się niżej (podłoga, rack), więc dolnej granicy przedziału nie sprawdzamy w przejściu
   * (zgięcie barku rośnie od ok. 90° do pozycji nad głową) — pozycję końcową nad głową (ręce w pionie) pilnuje test w tests/figury-olympic-przygotowanie.test.ts. */
  przejscie: OLYMPIC_NAD_GLOWA,
  aheadMax: 5, behindMax: 10, elevMax: 180,
  why: 'cecha rozpoznawcza — ręce pionowo nad głową przy pochylonym tułowiu; liczba > 180° to uproszczenie (tułów jako odcinek), tolerancje to konwencja',
} as const;
/** Dozwolony przedział zgięcia barku (stopnie) dla ćwiczenia z wyjątkiem przy pochyleniu tułowia θ; `undefined` = brak wyjątku (obowiązuje limit z ROM). */
export function overheadShoulderRange(exercise: string, thetaDeg: number): { min: number; max: number } | undefined {
  const x = OVERHEAD_SHOULDER_EXCEPTION; if (!x.keys.includes(exercise)) return undefined;
  return { min: x.przejscie.includes(exercise) ? 0 : 180 + thetaDeg - x.aheadMax, max: 180 + thetaDeg + x.behindMax };
}
/** Pochylenie tułowia od pionu (stopnie): linia biodro–bark w płaszczyźnie strzałkowej, dodatnie = do przodu. */
export const trunkLeanDeg = (sk: { pelvis: V3; shoulderC: V3 }): number => Math.atan2(sk.shoulderC[0] - sk.pelvis[0], sk.shoulderC[1] - sk.pelvis[1]) * 180 / Math.PI;
