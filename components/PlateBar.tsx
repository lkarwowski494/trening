import React from 'react';
import { View, Text } from 'react-native';
import { useTheme, F } from '@/lib/theme';
import { PLATE_COLORS, plateColor, plateInk, plateList, plateOutlined, type PlatePlan } from '@/lib/plates';
import { t as tr, lang } from '@/lib/i18n';
import { fmtNum } from '@/lib/units';

/** Wysokość talerza rośnie z ciężarem (25 kg i 55 lb = pełna wysokość); szerokość mieści liczbę. */
const height = (w: number, unit: 'kg' | 'lb', max: number) => Math.round(max * Math.max(0.36, Math.min(1, Math.sqrt(w / (unit === 'lb' ? 55 : 25)))));

/**
 * Styl „Tuleja” (07.10.2026): koniec sztangi z boku i talerze na jedną stronę w kolorach IWF (lib/plates.ts) — każdy z liczbą,
 * VoiceOver czyta jedną etykietę „Na każdą stronę: 25 + 5 kg”. Bez talerzy — „sam gryf”.
 */
export function PlateBar({ plan, size = 64 }: { plan: PlatePlan; size?: number }) {
  const t = useTheme(); const txt = plan.plates.length ? `${plateList(plan)} ${plan.unit}` : tr('sam gryf');
  return (
    <View accessibilityLanguage={lang()} accessible accessibilityRole="image" accessibilityLabel={tr('Na każdą stronę: {p}', { p: txt })} style={{ gap: 4 }}>
      <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: t.muted, fontSize: 12, fontFamily: F.semibold }}>{tr('Na każdą stronę')} · {txt}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, height: size }}>
        <View style={{ width: 36, height: 8, borderRadius: 2, backgroundColor: t.text }} />
        {plan.plates.map((w, i) => { const c = plateColor(w, plan.unit); const bg = c ? PLATE_COLORS[c] : t.surface2; return (
          <View key={i} style={{ minWidth: 22, paddingHorizontal: 3, height: height(w, plan.unit, size), borderRadius: 5, backgroundColor: bg, borderWidth: plateOutlined(c) ? 1.5 : 0, borderColor: t.text, alignItems: 'center', justifyContent: 'center' }}>
            <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.2} style={{ color: c ? plateInk(c) : t.text, fontSize: 11, fontFamily: F.monoBold }}>{fmtNum(w, 2)}</Text>
          </View>); })}
        <View style={{ width: 8, height: 22, borderRadius: 2, backgroundColor: t.text }} />
        <View style={{ flex: 1, height: 8, borderRadius: 2, backgroundColor: t.muted }} />
      </View>
    </View>
  );
}
