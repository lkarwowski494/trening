import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme, F, TEXT_SCALE_MAX } from '@/lib/theme';
import { t as tr, tp, lang } from '@/lib/i18n';
import { monthGrid, shiftMonth, weekdayLabels, monthTitle, dayTitle, dayKey } from '@/lib/calendar';
import { dayStatusFrom, planTplName } from '@/lib/plan';
import { isDeloadWeek } from '@/lib/store';
import type { Workout } from '@/lib/seed';
import { DAY_LEVELS, DAY_LEVEL_PLATE, dayLevels, daySets, type DayLevel } from '@/lib/motif';
import { DayPlate } from '@/components/Motif';

/** Motyw z ikony (09.10.2026): opis talerza przy dniu — w etykiecie VoiceOver dnia i w legendzie pod kalendarzem (kolor nie jest jedyną informacją). */
const levelText = (l: DayLevel): string => ({ heavy: () => tr('więcej serii niż średnio'), usual: () => tr('serie około średniej'), light: () => tr('mniej serii niż średnio') })[l]();

/*
 * Kalendarz miesiąca nad listą Historii (docs/21 pkt 4a): dni z treningiem — liczba dnia z małym talerzem (od 09.10.2026, motyw z ikony; wcześniej
 * koło w kolorze akcentu); dziś — obwódka.
 * Tapnięcie dnia z treningiem filtruje listę do tego dnia (drugie tapnięcie — wszystkie). VoiceOver: dni z treningiem to przyciski
 * „data, N sesji”; 08.10.2026: każdy dzień miesiąca jest przyciskiem (planowanie) — zaplanowany „data, zaplanowany: X”, opuszczony „data, opuszczony: X”.
 * Audyt 0.10: stan dnia z jednej funkcji (dayStatusFrom — A2, A5: zrobiony inny trening = wypełnione z kropką, zaplanowany czeka / nie zrobiony);
 * A11-05: „dziś” i „tydzień deload” w etykiecie KAŻDEGO dnia; wiersz deload w ramce koloru muted (≥ 3:1), nie tylko tłem.
 */
export function HistoryCalendar({ byDay, selected, onSelect, onMonth }: { byDay: Map<string, Workout[]>; selected: string | null; onSelect: (key: string | null) => void; /** UX-16 A (audyt 0.10): oglądany miesiąc po przewinięciu strzałką — lista sesji idzie za nim */ onMonth?: (y: number, m: number) => void }) {
  /* bez przewijania miesięcy kalendarz idzie za dzisiejszą datą (powrót z tła w nowym miesiącu — store.refreshViews) */
  const t = useTheme(); const now = new Date(); const [picked, setYm] = useState<{ y: number; m: number } | null>(null); const ym = picked ?? { y: now.getFullYear(), m: now.getMonth() };
  const today = dayKey(Date.now()); const weeks = monthGrid(ym.y, ym.m); const heads = weekdayLabels();
  /* motyw z ikony (09.10.2026): dzień z treningiem — mały talerz obok numeru; kolor i wysokość = serie robocze dnia względem średniej
   * z dni treningowych oglądanego miesiąca (lib/motif.dayLevels: więcej — czerwony, wysoki; około średniej — niebieski; mniej — zielony, niski) */
  const sets = new Map(weeks.flat().filter(c => c.inMonth && (byDay.get(c.key)?.length ?? 0) > 0).map(c => [c.key, daySets(byDay.get(c.key)!)] as const)); const levels = dayLevels(sets);
  const nav = (delta: number) => { const n = shiftMonth(ym.y, ym.m, delta); setYm(n); onMonth?.(n.y, n.m); };
  const arrow = (label: string, glyph: string, delta: number) => (
    <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={label} onPress={() => nav(delta)} hitSlop={8} style={({ pressed }) => ({ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.5 : 1 })}>
      <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: t.text, fontSize: 22, fontFamily: F.semibold }}>{glyph}</Text>
    </Pressable>);
  return (
    <View style={{ marginBottom: 10 }} testID="history-calendar">
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {arrow(tr('Poprzedni miesiąc'), '‹', -1)}
        <Text accessibilityLanguage={lang()} accessibilityRole="header" maxFontSizeMultiplier={1.3} style={{ color: t.text, fontSize: 17, fontFamily: F.heavy }}>{monthTitle(ym.y, ym.m)}</Text>
        {arrow(tr('Następny miesiąc'), '›', 1)}
      </View>
      <View style={{ flexDirection: 'row' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {heads.map((h, i) => <Text accessibilityLanguage={lang()} key={i} maxFontSizeMultiplier={1.2} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} /* A11-19: lv „Ceturtdiena” bez „…” */ style={{ flex: 1, textAlign: 'center', color: t.muted, fontSize: 12, fontFamily: F.semibold }}>{h}</Text>)}
      </View>
      {weeks.map((w, wi) => { const dl = isDeloadWeek(new Date(+w[0].key.slice(0, 4), +w[0].key.slice(5, 7) - 1, +w[0].key.slice(8, 10), 12).getTime()); /* 08.10.2026: tydzień deload — tło wiersza; audyt 0.10 A11-05: ramka muted */ return (
        <View key={wi} testID={dl ? `cal-deload-${w[0].key}` : undefined} style={{ flexDirection: 'row', borderRadius: 18, backgroundColor: dl ? t.surface2 : 'transparent', borderWidth: 1, borderColor: dl ? t.muted : 'transparent' }}>
          {w.map(c => { const ws = c.inMonth ? byDay.get(c.key) ?? [] : []; const n = ws.length; const on = selected === c.key; const isToday = c.key === today;
            const st = c.inMonth ? dayStatusFrom(c.key, ws, today) : null; const status = st?.status ?? 'rest'; const name = planTplName(st?.templateId);
            /* 08.10.2026 (kalendarz z planem): dzień zaplanowany — obwódka i kropka; opuszczony (przed dziś, bez sesji) — szara kropka; zrobiony inny trening — kropka na wypełnieniu */
            const lv = n ? levels.get(c.key) : undefined; const ns = sets.get(c.key) ?? 0;
            const planned = status === 'planned'; const missed = status === 'missed'; const other = status === 'other';
            const face = (
              <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: on || isToday || planned ? 2 : 0, borderColor: on ? t.text : t.accent }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.2} style={{ color: c.inMonth ? (missed ? t.muted : t.text) : t.line, fontSize: 14, fontFamily: n || planned || missed ? F.heavy : F.regular }}>{c.d}</Text>
                  {lv ? <DayPlate color={DAY_LEVEL_PLATE[lv]} bg={dl ? t.surface2 : t.bg} th={t} /> : null}
                </View>
                {planned || missed || other ? <View style={{ position: 'absolute', bottom: 3, width: 4, height: 4, borderRadius: 2, backgroundColor: missed ? t.muted : t.accent }} /> : null}
              </View>);
            const parts = [dayTitle(c), ...(isToday ? [tr('dziś')] : []), ...(n ? [`${n} ${tp(n, 'sesja|sesje|sesji')}`] : []), ...(other ? [tr('zrobiony inny trening')] : []),
              ...(other || planned || missed ? [c.key < today ? tr('opuszczony: {name}', { name }) : tr('zaplanowany: {name}', { name })] : []), ...(dl ? [tr('tydzień deload')] : [])];
            const label = parts.join(', ');
            return (
              <View key={c.key} style={{ flex: 1, alignItems: 'center', paddingVertical: 2 }}>
                {c.inMonth ? <Pressable accessibilityLanguage={lang()} testID={`cal-${c.key}`} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={label} accessibilityValue={lv ? { text: `${ns} ${tp(ns, 'seria|serie|serii')}, ${levelText(lv)}` } : undefined} /* motyw (09.10.2026): talerz dnia słownie — wartość, etykieta dnia bez zmian */ onPress={() => onSelect(on ? null : c.key)} hitSlop={4} /* A11-15: 36 + 2×4 = 44 pt */>{face}</Pressable>
                  : <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{face}</View>}
              </View>); })}
        </View>); })}
      {sets.size ? <View testID="cal-legend" style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 12, rowGap: 4, marginTop: 6 }}>
        <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: t.muted, fontSize: 12, fontFamily: F.regular }}>{tr('Talerz przy dniu — serie względem średniej w miesiącu:')}</Text>
        {[...DAY_LEVELS].reverse().map(l => <View key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><DayPlate color={DAY_LEVEL_PLATE[l]} bg={t.bg} th={t} /><Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: t.muted, fontSize: 12, fontFamily: F.regular }}>{levelText(l)}</Text></View>)}
      </View> : null}
      {weeks.some(w => isDeloadWeek(new Date(+w[0].key.slice(0, 4), +w[0].key.slice(5, 7) - 1, +w[0].key.slice(8, 10), 12).getTime())) ? <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: t.muted, fontSize: 12, marginTop: 4, fontFamily: F.regular }}>{tr('Wiersz w ramce — tydzień deload.')}</Text> : null}
    </View>
  );
}
