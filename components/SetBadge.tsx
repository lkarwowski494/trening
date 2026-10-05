/* Etykieta serii — wspólna dla treningu i szablonu (decyzja 05.10.2026: typ serii widoczny, nie ukryty pod cyfrą). */
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme, F } from '@/lib/theme';
import { SET_KIND_MARK, type SetKind } from '@/lib/seed';

/** „W” dla rozgrzewki, numer serii roboczej z literą typu (np. „2D”). */
export function kindLabel(kinds: readonly SetKind[], i: number): string { const k = kinds[i]; if (!k) return String(i + 1); if (k === 'warmup') return 'W'; const n = kinds.slice(0, i + 1).filter(x => x !== 'warmup').length; return `${n}${SET_KIND_MARK[k]}`; }
export function SetBadge({ kind, label, note }: { kind: SetKind; label: string; note?: boolean }) {
  const t = useTheme(); const txt = `${label}${note ? '•' : ''}`;
  return kind !== 'normal'
    ? <View style={{ alignSelf: 'flex-start', backgroundColor: t.band, borderRadius: 6, paddingHorizontal: 4, paddingVertical: 1 }}><Text maxFontSizeMultiplier={1.3} style={{ color: t.bg, fontSize: 13, fontFamily: F.semibold }}>{txt}</Text></View>
    : <Text maxFontSizeMultiplier={1.3} style={{ color: t.muted, fontSize: 14, fontFamily: F.regular }}>{txt}</Text>;
}
