import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, Text, View } from 'react-native';
import { useTheme, F, TEXT_SCALE_MAX } from '@/lib/theme';
import { LOAD_ORDER, PLATE_HEIGHT, RECORD_ANIM_MS, plateAt } from '@/lib/motif';
import { t as tr, lang } from '@/lib/i18n';
import { Plate, a11yHidden } from '@/components/Motif';

/**
 * Karta rekordu na ekranie zakończonego treningu: talerz za każdy rekord (do 4), ostatni „dokładany” (wsuwa się na gryf). Przy włączonym
 * ograniczeniu ruchu (iOS: Ograniczanie ruchu) — od razu obraz statyczny. Animated z React Native (bez nowych zależności natywnych).
 */
export function RecordPlates({ count, animate }: { count: number; animate: boolean }) {
  const th = useTheme(); const n = Math.max(1, Math.min(count, LOAD_ORDER.length)); const size = 40;
  const v = useRef(new Animated.Value(animate ? 0 : 1)).current;
  useEffect(() => {
    if (!animate) return;
    let on = true;
    AccessibilityInfo.isReduceMotionEnabled().then(rm => { if (!on) return; if (rm) v.setValue(1); else Animated.timing(v, { toValue: 1, duration: RECORD_ANIM_MS, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); }).catch(() => v.setValue(1));
    return () => { on = false; };
  }, [animate, v]);
  const text = count === 1 ? tr('Nowy rekord!') : tr('Nowe rekordy: {n}', { n: count });
  return (
    <View testID="record-banner" accessible accessibilityLanguage={lang()} accessibilityLabel={text} style={{ borderRadius: 12, borderWidth: 1, borderColor: th.line, backgroundColor: th.surface, overflow: 'hidden', marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, flexWrap: 'wrap' }}>
        <View {...a11yHidden} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, height: size }}>
          <View style={{ width: 14, height: 6, borderRadius: 2, backgroundColor: th.text }} />
          <View style={{ width: 4, height: 16, borderRadius: 1.5, backgroundColor: th.text, marginEnd: 2 }} />
          {Array.from({ length: n }, (_, i) => { const c = plateAt(i); const plate = <Plate color={c} h={Math.round(size * PLATE_HEIGHT[c])} w={11} bg={th.surface} th={th} />;
            return i < n - 1 ? <View key={i}>{plate}</View> : <Animated.View key={i} testID="record-plate-new" style={{ opacity: v, transform: [{ translateX: v.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }] }}>{plate}</Animated.View>; })}
          <View style={{ width: 26, height: 6, borderRadius: 2, backgroundColor: th.muted }} />
        </View>
        <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ flexShrink: 1, color: th.text, fontFamily: F.heavy, fontSize: 18 }}>{text}</Text>
      </View>
    </View>);
}

