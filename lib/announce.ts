import { useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

/*
 * Wzorzec „informacja zwrotna” (docs/32 wzorzec 14; HIG Feedback: „Make sure all feedback is accessible”): komunikat pojawiający się w treści
 * (zamiast okna) ogłasza VoiceOver ta funkcja. `accessibilityLiveRegion` w React Native działa tylko na Androidzie — zakazane (tests/interaction-guards.test.ts).
 */
export const announce = (text: string): void => { try { AccessibilityInfo.announceForAccessibility(text); } catch { /* brak VoiceOver / test */ } };
/** Ogłasza `text`, gdy się zmieni na niepusty (np. notka pod przyciskiem, komunikat walidacji). */
export function useAnnounce(text: string | null | undefined): void { useEffect(() => { if (text) announce(text); }, [text]); }
