import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme, F } from '@/lib/theme';
import { t as tr, tp } from '@/lib/i18n';
import { monthGrid, shiftMonth, weekdayLabels, monthTitle, dayTitle, dayKey } from '@/lib/calendar';
import { plannedOn } from '@/lib/plan';
import { getState } from '@/lib/store';
import type { Workout } from '@/lib/seed';

/*
 * Kalendarz miesiąca nad listą Historii (docs/21 pkt 4a): dni z treningiem wypełnione kolorem akcentu z liczbą dnia; dziś — obwódka.
 * Tapnięcie dnia z treningiem filtruje listę do tego dnia (drugie tapnięcie — wszystkie). VoiceOver: dni z treningiem to przyciski
 * „data, N sesji”; 08.10.2026: każdy dzień miesiąca jest przyciskiem (planowanie) — zaplanowany „data, zaplanowany: X”, opuszczony „data, opuszczony: X”.
 */
export function HistoryCalendar({ byDay, selected, onSelect }: { byDay: Map<string, Workout[]>; selected: string | null; onSelect: (key: string | null) => void }) {
  /* bez przewijania miesięcy kalendarz idzie za dzisiejszą datą (powrót z tła w nowym miesiącu — store.refreshViews) */
  const t = useTheme(); const now = new Date(); const [picked, setYm] = useState<{ y: number; m: number } | null>(null); const ym = picked ?? { y: now.getFullYear(), m: now.getMonth() };
  const today = dayKey(Date.now()); const weeks = monthGrid(ym.y, ym.m); const heads = weekdayLabels();
  const nav = (delta: number) => setYm(shiftMonth(ym.y, ym.m, delta));
  const arrow = (label: string, glyph: string, delta: number) => (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={() => nav(delta)} hitSlop={8} style={({ pressed }) => ({ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.5 : 1 })}>
      <Text maxFontSizeMultiplier={1.3} style={{ color: t.text, fontSize: 22, fontFamily: F.semibold }}>{glyph}</Text>
    </Pressable>);
  return (
    <View style={{ marginBottom: 10 }} testID="history-calendar">
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {arrow(tr('Poprzedni miesiąc'), '‹', -1)}
        <Text accessibilityRole="header" maxFontSizeMultiplier={1.3} style={{ color: t.text, fontSize: 17, fontFamily: F.heavy }}>{monthTitle(ym.y, ym.m)}</Text>
        {arrow(tr('Następny miesiąc'), '›', 1)}
      </View>
      <View style={{ flexDirection: 'row' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {heads.map((h, i) => <Text key={i} maxFontSizeMultiplier={1.2} numberOfLines={1} style={{ flex: 1, textAlign: 'center', color: t.muted, fontSize: 12, fontFamily: F.semibold }}>{h}</Text>)}
      </View>
      {weeks.map((w, wi) => (
        <View key={wi} style={{ flexDirection: 'row' }}>
          {w.map(c => { const n = c.inMonth ? byDay.get(c.key)?.length ?? 0 : 0; const on = selected === c.key; const isToday = c.key === today;
            /* 08.10.2026 (kalendarz z planem): dzień zaplanowany — obwódka i kropka; opuszczony (przed dziś, bez sesji) — szara kropka */
            const plan = c.inMonth && !n ? plannedOn(c.key) : null; const planName = plan ? getState().templates.find(x => x.id === plan)?.name ?? '' : ''; const missed = !!plan && c.key < today;
            const face = (
              <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: n ? t.accent : 'transparent', borderWidth: on || isToday || (plan && !missed) ? 2 : 0, borderColor: on ? t.text : t.accent }}>
                <Text maxFontSizeMultiplier={1.2} style={{ color: n ? t.accentInk : c.inMonth ? (missed ? t.muted : t.text) : t.line, fontSize: 14, fontFamily: n || plan ? F.heavy : F.regular }}>{c.d}</Text>
                {plan ? <View style={{ position: 'absolute', bottom: 3, width: 4, height: 4, borderRadius: 2, backgroundColor: missed ? t.muted : t.accent }} /> : null}
              </View>);
            const label = n ? `${dayTitle(c)}, ${n} ${tp(n, 'sesja|sesje|sesji')}` : plan ? `${dayTitle(c)}, ${missed ? tr('opuszczony: {name}', { name: planName }) : tr('zaplanowany: {name}', { name: planName })}` : dayTitle(c);
            return (
              <View key={c.key} style={{ flex: 1, alignItems: 'center', paddingVertical: 2 }}>
                {c.inMonth ? <Pressable testID={`cal-${c.key}`} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={label} onPress={() => onSelect(on ? null : c.key)} hitSlop={2}>{face}</Pressable>
                  : <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{face}</View>}
              </View>); })}
        </View>))}
    </View>
  );
}
