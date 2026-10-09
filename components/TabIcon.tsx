/* Ikony zakładek (od „Kredy”, docs/16; zostały w stylu „Tuleja”, 07.10.2026) — linie 1,8 pt jak na planszy marki; zamiast emoji, które wyglądały różnie na każdym iOS. */
import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { Text, type ColorValue } from 'react-native';
import { F } from '@/lib/theme';
import { lang } from '@/lib/i18n';

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

/** Audyt 0.10 (A11-03): etykieta zakładki — jedna linia jak w React Navigation (10 pt pod ikoną, 13 pt obok w poziomie), ale długie tłumaczenia
 * (bg „Упражнения”, lv „Vingrinājumi”…) zmniejszają się do TAB_LABEL_MIN_SCALE zamiast „…” na ekranie 320 pt (SE i mini z Display Zoom).
 * allowFontScaling=false jak w BottomTabItem (iOS pokazuje etykietę w Large Content Viewer). Test: tests/matrix-i18n (W = 320) i audit-0.10-lang-ui. Używa: app/(tabs)/_layout.tsx. */
export const TAB_LABEL_MIN_SCALE = 0.8;
export function TabLabel({ color, position, children }: { color: ColorValue; position: 'beside-icon' | 'below-icon'; children: string }) {
  return <Text accessibilityLanguage={lang()} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={TAB_LABEL_MIN_SCALE} allowFontScaling={false}
    style={[{ color, fontFamily: F.semibold, textAlign: 'center', backgroundColor: 'transparent' }, position === 'below-icon' ? { fontSize: 10 } : { fontSize: 13, marginStart: 5, marginEnd: 12, lineHeight: 24 } /* jak labelBeside + labelBesideUikit */]}>{children}</Text>;
}
