/* Ikony zakładek (od „Kredy”, docs/16; zostały w stylu „Tuleja”, 07.10.2026) — linie 1,8 pt jak na planszy marki; zamiast emoji, które wyglądały różnie na każdym iOS. */
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
      {name === 'history' ? <><Rect {...p} x={3.5} y={5} width={17} height={15.5} rx={2} /><Path {...p} d="M3.5 10h17M8 3v4M16 3v4M8 14h2M14 14h2" /></> : null /* H2 (audyt 0.10 UX-14): zakładka Kalendarz — ikona kalendarza, nie wykresu */}
      {name === 'more' ? <><Circle cx={6} cy={12} r={1.6} fill={color} /><Circle cx={12} cy={12} r={1.6} fill={color} /><Circle cx={18} cy={12} r={1.6} fill={color} /></> : null}
    </Svg>
  );
}
