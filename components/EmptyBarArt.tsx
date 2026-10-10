import React from 'react';
import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useTheme } from '@/lib/theme';
import { a11yHidden } from '@/components/Motif';

/** Gryf bez talerzy — grafika pustych stanów (SVG, dekoracja, kolory z motywu: jasny i ciemny). */
export function EmptyBarArt({ width = 112 }: { width?: number }) {
  const th = useTheme(); const h = width / 3;
  return (
    <View testID="empty-art" {...a11yHidden} style={{ alignItems: 'center', marginBottom: 10 }}>
      <Svg width={width} height={h} viewBox="0 0 120 40" accessible={false}>
        <Rect x={4} y={18} width={112} height={4} rx={2} fill={th.muted} />
        <Rect x={4} y={16} width={20} height={8} rx={2} fill={th.muted} />
        <Rect x={96} y={16} width={20} height={8} rx={2} fill={th.muted} />
        <Rect x={24} y={11} width={5} height={18} rx={1.5} fill={th.text} />
        <Rect x={91} y={11} width={5} height={18} rx={1.5} fill={th.text} />
        {/* miejsca na talerze — kontury */}
        <Rect x={9} y={4} width={9} height={32} rx={3} fill="none" stroke={th.ctrlLine} strokeWidth={1.5} strokeDasharray="3 3" />
        <Rect x={102} y={4} width={9} height={32} rx={3} fill="none" stroke={th.ctrlLine} strokeWidth={1.5} strokeDasharray="3 3" />
      </Svg>
    </View>);
}

