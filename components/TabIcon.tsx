/* Ikony zakładek (od „Kredy”, docs/16; linie 1,8 pt jak na planszy marki) — od 09.10.2026 (motyw z ikony, decyzja właściciela: zestaw pełny)
 * w geometrii talerzy: zaokrąglone prostokąty jak na ikonie aplikacji, bez kół. Jeden kolor (odcień zakładki: aktywna/nieaktywna) — kolory
 * talerzy zostają dla grafik z liczbą obok. Etykiety VoiceOver bez zmian (app/(tabs)/_layout.tsx, tabA11y).
 *  - Trening: koniec sztangi z dwoma talerzami (jak ikona aplikacji);
 *  - Szablony: stos talerzy leżących (lista);
 *  - Ćwiczenia: hantla — gryf z talerzem po obu stronach;
 *  - Kalendarz: karta kalendarza z małymi talerzami w miejscu dni (jak dni z treningiem w Kalendarzu);
 *  - Więcej: trzy talerze malejąco (zamiast trzech kropek). */
import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { Text, type ColorValue } from 'react-native';
import { F } from '@/lib/theme';
import { lang } from '@/lib/i18n';

export type TabIconName = 'workout' | 'templates' | 'exercises' | 'history' | 'more';
export function TabIcon({ name, color, size = 26 }: { name: TabIconName; color: ColorValue; size?: number }) {
  const p = { fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const solid = { fill: color };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      {name === 'workout' ? <><Path {...p} d="M2 12h3.2M14.6 12h7.4" /><Rect {...p} x={5.2} y={3.5} width={4} height={17} rx={1.4} /><Rect {...p} x={10.4} y={6.5} width={3.4} height={11} rx={1.3} /><Rect {...solid} x={15.6} y={9.6} width={1.8} height={4.8} rx={0.6} /></> : null}
      {name === 'templates' ? <><Rect {...p} x={3} y={4} width={18} height={4} rx={1.5} /><Rect {...p} x={5} y={10} width={14} height={4} rx={1.5} /><Rect {...p} x={7} y={16} width={10} height={4} rx={1.5} /></> : null}
      {name === 'exercises' ? <><Path {...p} d="M7.6 12h8.8M1.8 12h1M21.2 12h1" /><Rect {...p} x={3.4} y={6} width={3.6} height={12} rx={1.3} /><Rect {...p} x={17} y={6} width={3.6} height={12} rx={1.3} /></> : null}
      {name === 'history' ? <><Rect {...p} x={3.5} y={5} width={17} height={15.5} rx={2} /><Path {...p} d="M3.5 10h17M8 3v4M16 3v4" /><Rect {...solid} x={7} y={12.5} width={2.4} height={6} rx={0.8} /><Rect {...solid} x={11} y={13.5} width={2.4} height={5} rx={0.8} /><Rect {...solid} x={15} y={14.8} width={2.4} height={3.7} rx={0.8} /></> : null /* H2 (audyt 0.10 UX-14): zakładka Kalendarz — ikona kalendarza */}
      {name === 'more' ? <><Rect {...solid} x={4.5} y={5} width={3.6} height={14} rx={1.3} /><Rect {...solid} x={10.2} y={7} width={3.6} height={10} rx={1.3} /><Rect {...solid} x={15.9} y={9} width={3.6} height={6} rx={1.3} /></> : null}
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
