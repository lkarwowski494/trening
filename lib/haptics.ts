import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { getState } from '@/lib/store';
import { HAPTICS, type HapticEvent } from '@/lib/theme';

/*
 * Haptyka tablicy „teraz” (M3 p2; decyzja STOP E3 21.10.2026, docs/32 wzorzec 29): „tick” (selection) przy ± i ostrzegawcza (notificationWarning)
 * przy „Seria zrobiona” bez wyniku; krótka (impactLight) przy odhaczeniu serii — ✓ w wierszu i „Seria zrobiona” (ZM-07 pkt 2, ActiveWorkout.onDone; cofnięcie bez wibracji). Zdarzenia i rodzaje haptyki są w mapie HAPTICS (lib/tokens.ts — jedno miejsce); tu tylko wykonanie.
 * Włącznik (ZM-07, p5d, 21.10.2026): przełącznik „Wibracje” (settings.haptics); BRAK pola = za „Dźwiękiem na koniec przerwy” (settings.sound) — dane sprzed
 * rozdzielenia zachowują się jak dotąd. Jedyne miejsce tej reguły: `hapticsEnabled`; lib/timer.ts i components/DragList.tsx używają `hapticsOn`. Dźwięk zależy tylko od `sound`. Na web brak haptyki.
 */
export type BoardHaptic = 'step' | 'missing' | 'done';
const WHEN: Record<BoardHaptic, string> = { step: '± na tablicy', missing: '„Seria zrobiona” bez wartości', done: 'Seria zrobiona (✓' };
/** Czy wibracje są włączone dla danych ustawień: zapisane `haptics` wygrywa, brak (lub zła wartość) = jak `sound` (brak `sound` = włączone). Czysta. */
export const hapticsEnabled = (s: { sound?: boolean; haptics?: unknown }): boolean => typeof s.haptics === 'boolean' ? s.haptics : s.sound !== false;
/** Czy wibracje są włączone teraz (ustawienia czytane przy każdym zdarzeniu). */
export const hapticsOn = (): boolean => { try { return hapticsEnabled(getState().settings); } catch { return true; } };
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
