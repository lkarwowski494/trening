/* Ikony zakładek w stylu „Kreda” (docs/16) — linie 1,8 pt jak na planszy marki; zamiast emoji, które wyglądały różnie na każdym iOS. */
import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import type { ColorValue } from 'react-native';

export type TabIconName = 'workout' | 'templates' | 'exercises' | 'history' | 'more';
export function TabIcon({ name, color, size = 26 }: { name: TabIconName; color: ColorValue; size?: number }) {
  const p = { fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      {name === 'workout' ? <Path {...p} d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" /> : null}
      {name === 'templates' ? <><Rect {...p} x={5} y={3} width={14} height={18} rx={2} /><Path {...p} d="M9 8h6M9 12h6M9 16h4" /></> : null}
      {name === 'exercises' ? <><Circle {...p} cx={12} cy={12} r={8} /><Circle {...p} cx={12} cy={12} r={2.5} /></> : null}
      {name === 'history' ? <Path {...p} d="M4 19h16M7 16v-5M12 16V7M17 16v-3" /> : null}
      {name === 'more' ? <><Circle cx={6} cy={12} r={1.6} fill={color} /><Circle cx={12} cy={12} r={1.6} fill={color} /><Circle cx={18} cy={12} r={1.6} fill={color} /></> : null}
    </Svg>
  );
}
