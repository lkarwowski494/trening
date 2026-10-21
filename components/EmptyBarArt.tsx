import React from 'react';
import { View } from 'react-native';
import { MOTIF, SPACE } from '@/lib/theme';
import { a11yHidden, BarMotif, useMotifVisible } from '@/components/Motif';

/** Grafika pustych stanów: motyw A2 — gryf z talerzami w barwach IWF (krycie 16% / 20%), 220 pt; dekoracja ukryta przed VoiceOver; znika przy „Zwiększ kontrast” i dużym tekście (M3). */
export function EmptyBarArt({ width = MOTIF.emptyWidthPt }: { width?: number }) {
  const visible = useMotifVisible();
  if (!visible) return null;
  return <View testID="empty-art" {...a11yHidden} style={{ alignItems: 'center', marginBottom: SPACE.m }}><BarMotif width={width} /></View>;
}
