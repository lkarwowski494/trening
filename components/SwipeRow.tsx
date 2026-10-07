import React, { useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, PanResponder, Alert, StyleSheet, type StyleProp, type ViewStyle, type AccessibilityActionEvent } from 'react-native';
import { useTheme, F } from '@/lib/theme';
import { t as tr } from '@/lib/i18n';

/*
 * Usuwanie przesunięciem w lewo (decyzja właściciela 07.10.2026 wieczór, docs/18): wszędzie ten sam gest, zawsze z potwierdzeniem,
 * bez osobnych przycisków „Usuń”. Bez nowych modułów natywnych (PanResponder + Animated, jak „≡ Kolejność”, T-010).
 * VoiceOver nie przesuwa wierszy — ta sama akcja jest akcją dostępności „usuń” na głównym elemencie wiersza (props z `a11y`).
 */
export const SWIPE = { button: 88, open: 0.5, ask: 2, velocity: -0.5, start: 12 } as const;

/** Decyzja po puszczeniu palca: dx — przesunięcie od pozycji zamkniętej (ujemne w lewo), vx — prędkość, w — szerokość przycisku. */
export function swipeDecision(dx: number, vx: number, w: number = SWIPE.button): 'close' | 'open' | 'ask' {
  if (dx <= -w * SWIPE.ask) return 'ask';
  if (dx <= -w * SWIPE.open || (dx < 0 && vx <= SWIPE.velocity)) return 'open';
  return 'close';
}

export type DeleteA11y = { accessibilityActions?: { name: string; label: string }[]; onAccessibilityAction?: (e: AccessibilityActionEvent) => void };

type Props = {
  /** Etykieta akcji dla VoiceOver i przycisku pod wierszem, np. „Usuń serię 2 — Back Squat”. */
  label: string;
  /** Pytanie w potwierdzeniu, np. „Usunąć serię?”, i opcjonalny opis. */
  title: string; message?: string;
  onDelete: () => void;
  /** Tło przesuwanej części (domyślnie tło ekranu). */
  bg?: string; style?: StyleProp<ViewStyle>; testID?: string;
  /** Bez gestu i akcji (np. ostatnia seria bloku, której się nie usuwa). */
  disabled?: boolean;
  children: (a11y: DeleteA11y) => React.ReactNode;
};

export function SwipeRow({ label, title, message, onDelete, bg, style, testID, disabled, children }: Props) {
  const t = useTheme(); const x = useRef(new Animated.Value(0)).current; const [open, setOpen] = useState(false); const openRef = useRef(false);
  const snap = (to: number) => { openRef.current = to !== 0; setOpen(to !== 0); Animated.spring(x, { toValue: to, useNativeDriver: true, bounciness: 0 }).start(); };
  const ask = () => Alert.alert(title, message, [
    { text: tr('Nie'), style: 'cancel', onPress: () => snap(0) },
    { text: tr('Usuń'), style: 'destructive', onPress: () => { snap(0); onDelete(); } },
  ]);
  const pan = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dx) > SWIPE.start && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
    onPanResponderTerminationRequest: () => false,
    onPanResponderMove: (_e, g) => { const base = openRef.current ? -SWIPE.button : 0; x.setValue(Math.min(0, Math.max(-SWIPE.button * SWIPE.ask * 1.2, base + g.dx))); },
    onPanResponderRelease: (_e, g) => {
      const d = swipeDecision((openRef.current ? -SWIPE.button : 0) + g.dx, g.vx);
      if (d === 'ask') { snap(-SWIPE.button); ask(); } else snap(d === 'open' ? -SWIPE.button : 0);
    },
    onPanResponderTerminate: () => snap(openRef.current ? -SWIPE.button : 0),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [title, message, onDelete]);
  if (disabled) return <View style={style} testID={testID}>{children({})}</View>;
  const a11y: DeleteA11y = { accessibilityActions: [{ name: 'delete', label }], onAccessibilityAction: e => { if (e.nativeEvent.actionName === 'delete') ask(); } };
  return (
    <View style={[{ overflow: 'hidden' }, style]} testID={testID}>
      <View style={[StyleSheet.absoluteFill, { flexDirection: 'row', justifyContent: 'flex-end' }]} pointerEvents={open ? 'auto' : 'none'}
        accessibilityElementsHidden={!open} importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}>
        <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={ask} testID={testID ? `${testID}-del` : undefined}
          style={({ pressed }) => ({ width: SWIPE.button, backgroundColor: t.danger, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1 })}>
          <Text maxFontSizeMultiplier={1.3} style={{ color: '#FFFFFF', fontFamily: F.semibold, fontSize: 15 }}>{tr('Usuń')}</Text>
        </Pressable>
      </View>
      <Animated.View {...pan.panHandlers} style={{ transform: [{ translateX: x }], backgroundColor: bg ?? t.bg }}>{children(a11y)}</Animated.View>
    </View>
  );
}
