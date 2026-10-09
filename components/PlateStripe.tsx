import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { PLATE_COLORS } from '@/lib/plates';
import { LOAD_ORDER } from '@/lib/motif';
import { a11yHidden } from '@/components/Motif';

/** Czterokolorowy pasek-akcent (dekoracja): kolory talerzy w kolejności ładowania. Używany z umiarem: górna krawędź karty „Dziś” i karty rekordu. */
export function PlateStripe({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View testID="plate-stripe" {...a11yHidden} style={[{ flexDirection: 'row', height: 4 }, style]}>{LOAD_ORDER.map(c => <View key={c} style={{ flex: 1, backgroundColor: PLATE_COLORS[c] }} />)}</View>;
}

