import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions, type TextStyle } from 'react-native';
import { useTheme, FW, font, TEXT_SCALE_MAX, RADIUS, SIZE, SPACE } from '@/lib/theme';
import { lang } from '@/lib/i18n';

/** Styl roli bez interlinii (jak w components/ui.tsx). */
const plain = (role: Parameters<typeof font>[0]): TextStyle => { const f = font(role); delete f.lineHeight; return f; };

/** Kontrolka segmentowa: jedna z kilku opcji w jednym wąskim pasku (język, jednostka).
 * Audyt 0.10 (A11-12): na 320 pt długie jednowyrazowe opcje (de „Muskelaufbau”, sv „Fettförbränning”) łamały się w środku wyrazu — opcja z jednym
 * wyrazem ma jedną linię, a krój zmniejsza się do SEG_MIN_SCALE. Od p5d (21.10.2026) zawijania w opcji nie ma wcale: etykiety mieszczą się w jednej linii (równe kolumny albo
 * kolumny proporcjonalne do długości — `segLayout`), a gdy by się nie zmieściły, opcje są jedna pod drugą na pełnej szerokości (jak przy powiększonym tekście).
 * Przy powiększonym tekście (Dynamic Type > 100%) opcje układają się jedna pod drugą na pełnej szerokości (rosną do 200%); w poziomie krój
 * się nie powiększa (jak UISegmentedControl — iOS pokazuje wtedy Large Content Viewer). A11-15: pole dotyku opcji ≥ 44 pt (HIG). Test szerokości: tests/matrix-i18n (W = 320). */
export const SEG_MIN_SCALE = 0.75;
/** p5d (21.10.2026, decyzja właściciela: segmenty bez zawijania przy 390 pt): opcja mieści się w jednej linii, gdy krój zmniejszony najwyżej do tej skali
 * (= SEG_MIN_SCALE; szacunek szerokości segEm jest zawyżony względem prawdziwego kroju, więc zapas jest w nim); inaczej opcje układają się jedna pod drugą — zawijania w opcji nie ma. */
export const SEG_FIT_SCALE = 0.75;
/** Szacunek szerokości etykiety w em bez czytania kroju (zapas: IBM Plex Sans półgruby ≈ 0,55–0,62 em na znak łaciński i cyrylicę, systemowy węższy; CJK i hangul = 1 em).
 * Test tests/m3-p5d-settings-ui.test.tsx porównuje szacunek z prawdziwymi szerokościami kroju we wszystkich językach. */
export const segEm = (l: string): number => [...l.trim()].reduce((a, c) => { const n = c.codePointAt(0) ?? 0; return a + (n >= 0x2E80 ? 1 : n >= 0x370 && n < 0x530 ? 0.7 /* grecki, cyrylica */ : 0.64); }, 0);
/** Układ kontrolki segmentowej: 'equal' — równe kolumny; 'weighted' — szerokość opcji proporcjonalna do jej potrzeby (`segWeight`), więc każda dostaje ten sam zapas;
 * 'column' — jedna pod drugą na pełnej szerokości. `width` = szerokość kontrolki, `px` = rozmiar kroju etykiety, `scale` = do jakiej skali wolno zmniejszyć krój
 * (natywnie SEG_FIT_SCALE; w przeglądarce 1 — `adjustsFontSizeToFit` tam nie działa). Czysta. */
export const SEG_PAD = 12; /* padding poziomy opcji 6 + 6 (s.segItem) */
export const segWeight = (l: string, px: number, scale: number): number => Math.max(1, Math.round(segEm(l) * px * scale + SEG_PAD));
export function segLayout(labels: string[], width: number, px: number, scale: number = SEG_FIT_SCALE): 'equal' | 'weighted' | 'column' {
  const n = labels.length; const inner = width - 2 - 4; /* ramka 1+1, padding 2+2 (s.seg) */
  if (n === 0 || inner <= 0) return 'column';
  const need = labels.map(l => segWeight(l, px, scale));
  if (Math.max(...need) <= inner / n) return 'equal';
  return need.reduce((a, b) => a + b, 0) <= inner ? 'weighted' : 'column';
}
export function Segmented<T extends string>({ options, value, onChange, label, testID }: { options: [T, string][]; value: T; onChange: (v: T) => void; label: string; /** stały identyfikator (E2E): opcja dostaje `${testID}-${klucz}` */ testID?: string }) {
  const t = useTheme(); const { width: winW, fontScale } = useWindowDimensions(); const [w, setW] = React.useState(0);
  const big = fontScale > 1; /* A11-07/A11-12: przy powiększonym tekście opcje jedna pod drugą (pełna szerokość, rosną do 200%) — jak układy iOS przy rozmiarach dostępności */
  const px = font('callout').fontSize ?? 15; const sc = Platform.OS === 'web' ? 1 : SEG_FIT_SCALE;
  const mode = big ? 'column' : segLayout(options.map(o => o[1]), w || winW - 2 * SPACE.l, px, sc); const stacked = mode === 'column';
  return (
    <View onLayout={e => { const x = Math.round(e.nativeEvent.layout.width); if (x && x !== w) setW(x); }} accessibilityLanguage={lang()} accessibilityRole="radiogroup" accessibilityLabel={label} style={[s.seg, stacked && { flexDirection: 'column' }, { backgroundColor: t.surface2, borderColor: t.line }]}>
      {options.map(([k, l]) => { const on = k === value; return (
        <Pressable testID={testID ? `${testID}-${k}` : undefined} accessibilityLanguage={lang()} key={k} onPress={() => { if (!on) onChange(k); }} accessibilityRole="button" accessibilityLabel={l} accessibilityHint={label} accessibilityState={{ selected: on }} style={[s.segItem, stacked && { flex: 0, alignSelf: 'stretch' }, mode === 'weighted' && { flex: segWeight(l, px, sc) }, on && { backgroundColor: t.accent }]}>
          <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={stacked ? TEXT_SCALE_MAX : 1} numberOfLines={stacked ? undefined : 1} adjustsFontSizeToFit={!stacked} minimumFontScale={SEG_MIN_SCALE} style={{ color: on ? t.accentInk : t.text, ...plain('callout'), ...(on ? FW.semibold : FW.regular), textAlign: 'center' }}>{l}</Text>
        </Pressable>); })}
    </View>
  );
}

const s = StyleSheet.create({
  seg: { flexDirection: 'row', borderWidth: 1, borderRadius: RADIUS.button, padding: 2, alignSelf: 'stretch' },
  segItem: { flex: 1, minHeight: SIZE.hit, alignItems: 'center', justifyContent: 'center', borderRadius: RADIUS.field, paddingHorizontal: 6 },
});
