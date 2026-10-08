/* Etykieta serii — wspólna dla treningu i szablonu (decyzja 05.10.2026: typ serii widoczny, nie ukryty pod cyfrą). */
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme, F } from '@/lib/theme';
import { type SetKind } from '@/lib/seed';
import { setMarkOf } from '@/lib/live';
import { lang } from '@/lib/i18n';

/** „W” dla rozgrzewki, numer serii roboczej z literą typu (np. „2F”), drop set z numerem serii, po której jest („2D”) — ta sama numeracja co w treningu
 * (lib/live.ts setMarkOf; audyt 0.10, LIVE-14). */
export function kindLabel(kinds: readonly SetKind[], i: number): string { return setMarkOf(kinds, i); }
export function SetBadge({ kind, label, note }: { kind: SetKind; label: string; note?: boolean }) {
  const t = useTheme(); const txt = `${label}${note ? '•' : ''}`;
  return kind !== 'normal'
    ? <View style={{ alignSelf: 'flex-start', backgroundColor: t.band, borderRadius: 6, paddingHorizontal: 4, paddingVertical: 1 }}><Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: t.bg, fontSize: 13, fontFamily: F.semibold }}>{txt}</Text></View>
    : <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: t.muted, fontSize: 14, fontFamily: F.regular }}>{txt}</Text>;
}
