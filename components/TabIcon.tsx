/* Ikony zakładek (od „Kredy”, docs/16; linie 1,8 pt jak na planszy marki) — od 09.10.2026 (motyw z ikony, decyzja właściciela: zestaw pełny)
 * w geometrii talerzy: zaokrąglone prostokąty jak na ikonie aplikacji, bez kół. Jeden kolor (odcień zakładki: aktywna/nieaktywna) — kolory
 * talerzy zostają dla grafik z liczbą obok. Etykiety VoiceOver bez zmian (app/(tabs)/_layout.tsx, tabA11y).
 *  - Trening: koniec sztangi z dwoma talerzami (jak ikona aplikacji);
 *  - Plan (dawniej Kalendarz): karta kalendarza z małymi talerzami w miejscu dni (jak dni z treningiem w kalendarzu);
 *  - Postępy: trzy rosnące słupki (kontury — „Więcej” ma pełne, malejące);
 *  - Więcej: trzy talerze malejąco (zamiast trzech kropek). */
import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { type ColorValue } from 'react-native';
import { Text } from '@/components/AppText';
import { FW, font, maxScale } from '@/lib/theme';
import { lang } from '@/lib/i18n';

export type TabIconName = 'workout' | 'history' | 'progress' | 'more';
export function TabIcon({ name, color, size = 26 }: { name: TabIconName; color: ColorValue; size?: number }) {
  const p = { fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const solid = { fill: color };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      {name === 'workout' ? <><Path {...p} d="M2 12h3.2M14.6 12h7.4" /><Rect {...p} x={5.2} y={3.5} width={4} height={17} rx={1.4} /><Rect {...p} x={10.4} y={6.5} width={3.4} height={11} rx={1.3} /><Rect {...solid} x={15.6} y={9.6} width={1.8} height={4.8} rx={0.6} /></> : null}
      {name === 'history' ? <><Rect {...p} x={3.5} y={5} width={17} height={15.5} rx={2} /><Path {...p} d="M3.5 10h17M8 3v4M16 3v4" /><Rect {...solid} x={7} y={12.5} width={2.4} height={6} rx={0.8} /><Rect {...solid} x={11} y={13.5} width={2.4} height={5} rx={0.8} /><Rect {...solid} x={15} y={14.8} width={2.4} height={3.7} rx={0.8} /></> : null /* H2 (audyt 0.10 UX-14): zakładka Kalendarz — ikona kalendarza */}
      {name === 'progress' ? <><Rect {...p} x={3.5} y={13} width={3.6} height={7.5} rx={1.3} /><Rect {...p} x={10.2} y={8.5} width={3.6} height={12} rx={1.3} /><Rect {...p} x={16.9} y={3.5} width={3.6} height={17} rx={1.3} /></> : null}
      {name === 'more' ? <><Rect {...solid} x={4.5} y={5} width={3.6} height={14} rx={1.3} /><Rect {...solid} x={10.2} y={7} width={3.6} height={10} rx={1.3} /><Rect {...solid} x={15.9} y={9} width={3.6} height={6} rx={1.3} /></> : null}
    </Svg>
  );
}

/** Audyt 0.10 (A11-03): etykieta zakładki — jedna linia jak w React Navigation (11 pt pod ikoną, 13 pt obok w poziomie; M3: do 125%), ale długie tłumaczenia
 * (bg „Упражнения”, lv „Vingrinājumi”…) zmniejszają się do TAB_LABEL_MIN_SCALE zamiast „…” na ekranie 320 pt (SE i mini z Display Zoom).
 * M3 (DEC-10, design-spec §1): podpis rośnie z tekstem systemu do TEXT_SCALE.bar (125%), dalej mieści go zmniejszanie. Test: tests/matrix-i18n (W = 320) i audit-0.10-lang-ui. Używa: app/(tabs)/_layout.tsx. */
export const TAB_LABEL_MIN_SCALE = 0.8;
export function TabLabel({ color, position, children }: { color: ColorValue; position: 'beside-icon' | 'below-icon'; children: string }) {
  return <Text accessibilityLanguage={lang()} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={TAB_LABEL_MIN_SCALE}
    maxFontSizeMultiplier={maxScale('caption') /* M3: pasek zakładek do 125% (DEC-10); dalej mieści go zmniejszanie do TAB_LABEL_MIN_SCALE */}
    style={[{ color, textAlign: 'center', backgroundColor: 'transparent' }, position === 'below-icon' ? font('caption') : { ...font('footnote'), ...FW.semibold, marginStart: 5, marginEnd: 12, lineHeight: 24 } /* jak labelBeside + labelBesideUikit */]}>{children}</Text>;
}
