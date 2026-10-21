import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions, type TextStyle } from 'react-native';
import { useTheme, FW, font, TEXT_SCALE_MAX, RADIUS, SIZE } from '@/lib/theme';
import { lang } from '@/lib/i18n';

/** Styl roli bez interlinii (jak w components/ui.tsx). */
const plain = (role: Parameters<typeof font>[0]): TextStyle => { const f = font(role); delete f.lineHeight; return f; };

/** Kontrolka segmentowa: jedna z kilku opcji w jednym wąskim pasku (język, jednostka).
 * Audyt 0.10 (A11-12): na 320 pt długie jednowyrazowe opcje (de „Muskelaufbau”, sv „Fettförbränning”) łamały się w środku wyrazu — opcja z jednym
 * wyrazem ma jedną linię, a krój zmniejsza się do SEG_MIN_SCALE; opcja z kilku wyrazów — 2 linie (też ze zmniejszaniem zamiast „…”).
 * Przy powiększonym tekście (Dynamic Type > 100%) opcje układają się jedna pod drugą na pełnej szerokości (rosną do 200%); w poziomie krój
 * się nie powiększa (jak UISegmentedControl — iOS pokazuje wtedy Large Content Viewer). A11-15: pole dotyku opcji ≥ 44 pt (HIG). Test szerokości: tests/matrix-i18n (W = 320). */
export const SEG_MIN_SCALE = 0.75;
export function Segmented<T extends string>({ options, value, onChange, label, testID }: { options: [T, string][]; value: T; onChange: (v: T) => void; label: string; /** stały identyfikator (E2E): opcja dostaje `${testID}-${klucz}` */ testID?: string }) {
  const t = useTheme(); const stacked = useWindowDimensions().fontScale > 1; /* A11-07/A11-12: przy powiększonym tekście opcje jedna pod drugą (pełna szerokość, rosną do 200%) — jak układy iOS przy rozmiarach dostępności */
  return (
    <View accessibilityLanguage={lang()} accessibilityRole="radiogroup" accessibilityLabel={label} style={[s.seg, stacked && { flexDirection: 'column' }, { backgroundColor: t.surface2, borderColor: t.line }]}>
      {options.map(([k, l]) => { const on = k === value; return (
        <Pressable testID={testID ? `${testID}-${k}` : undefined} accessibilityLanguage={lang()} key={k} onPress={() => { if (!on) onChange(k); }} accessibilityRole="button" accessibilityLabel={l} accessibilityHint={label} accessibilityState={{ selected: on }} style={[s.segItem, stacked && { flex: 0, alignSelf: 'stretch' }, on && { backgroundColor: t.accent }]}>
          <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={stacked ? TEXT_SCALE_MAX : 1} numberOfLines={stacked ? undefined : /\s/.test(l.trim()) ? 2 : 1} adjustsFontSizeToFit={!stacked} minimumFontScale={SEG_MIN_SCALE} style={{ color: on ? t.accentInk : t.text, ...plain('callout'), ...(on ? FW.semibold : FW.regular), textAlign: 'center' }}>{l}</Text>
        </Pressable>); })}
    </View>
  );
}

const s = StyleSheet.create({
  seg: { flexDirection: 'row', borderWidth: 1, borderRadius: RADIUS.button, padding: 2, alignSelf: 'stretch' },
  segItem: { flex: 1, minHeight: SIZE.hit, alignItems: 'center', justifyContent: 'center', borderRadius: RADIUS.field, paddingHorizontal: 6 },
});
