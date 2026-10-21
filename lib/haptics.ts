import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { getState } from '@/lib/store';
import { HAPTICS, type HapticEvent } from '@/lib/theme';

/*
 * Haptyka tablicy „teraz” (M3 p2; decyzja STOP E3 21.10.2026, docs/32 wzorzec 29): „tick” (selection) przy ± i ostrzegawcza (notificationWarning)
 * przy „Seria zrobiona” bez wyniku. Zdarzenia i rodzaje haptyki są w mapie HAPTICS (lib/tokens.ts — jedno miejsce); tu tylko wykonanie.
 * Włącznik: OBECNY przełącznik „Dźwięk i wibracja na koniec przerwy” (settings.sound, jak koniec przerwy w lib/timer.ts). Rozdzielenie na „Dźwięk…” i „Wibracje”
 * (ZM-07) to osobna partia (p5d) — wtedy zmienia się tylko `hapticsOn`. Na web brak haptyki.
 */
export type BoardHaptic = 'step' | 'missing';
const WHEN: Record<BoardHaptic, string> = { step: '± na tablicy', missing: '„Seria zrobiona” bez wartości' };
/** Czy haptyka jest włączona (obecnie ten sam przełącznik co dźwięk końca przerwy). */
export const hapticsOn = (): boolean => { try { return getState().settings.sound !== false; } catch { return true; } };
const spec = (ev: BoardHaptic): HapticEvent | undefined => HAPTICS.find(h => h.kiedy.startsWith(WHEN[ev]));

export function playHaptic(ev: BoardHaptic): void {
  if (Platform.OS === 'web' || !hapticsOn()) return;
  const h = spec(ev)?.haptyka; if (!h) return;
  try {
    if (h === 'selection') void Haptics.selectionAsync().catch(() => {});
    else if (h === 'notificationWarning') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    else if (h === 'notificationSuccess') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    else if (h === 'impactLight') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    else if (h === 'impactMedium') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  } catch { /* brak natywnego modułu */ }
}
