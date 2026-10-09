import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme, F, TEXT_SCALE_MAX } from '@/lib/theme';
import { t as tr, tp, lang } from '@/lib/i18n';
import { monthGrid, shiftMonth, weekdayLabels, monthTitle, dayTitle, dayKey } from '@/lib/calendar';
import { dayStatusFrom, planTplName } from '@/lib/plan';
import { isDeloadWeek } from '@/lib/store';
import type { Workout } from '@/lib/seed';
import { dayMark, MINI_ICON, type DayMark } from '@/lib/motif';
import { DayIcon } from '@/components/Motif';

/** Wartość VoiceOver dnia ze znacznikiem (korekta właściciela 09.10.2026 ok. 17:00): „zrobione” albo „zaplanowane” — etykieta dnia bez zmian (E2E). */
const markText = (m: DayMark): string => m === 'done' ? tr('zrobione') : tr('zaplanowane');
/** Komórka dnia: numer nad ikoną dnia (lib/motif.MINI_ICON) — 38 × 44 pt, z hitSlop 4 cel ≥ 44 pt (A11-15). */
export const CAL_FACE = { w: MINI_ICON.w + 14, h: 44 } as const;

/*
 * Kalendarz miesiąca nad listą Historii (docs/21 pkt 4a). Korekta właściciela 09.10.2026 ok. 17:00: pod numerem dnia mała ikona aplikacji —
 * pełna = trening zrobiony, sama obwódka = zaplanowany (opuszczony — obwódka wyszarzona), bez planu i treningu — nic; to jedyny kod
 * „zrobione / zaplanowane” (bez kółek planu, kropek i legendy kolorów). Zostają: dziś — ramka w kolorze akcentu, wybrany dzień — ramka
 * w kolorze tekstu i tło, tydzień deload — ramka wiersza.
 * Tapnięcie dnia z treningiem filtruje listę do tego dnia (drugie tapnięcie — wszystkie). VoiceOver: dni z treningiem to przyciski
 * „data, N sesji”; 08.10.2026: każdy dzień miesiąca jest przyciskiem (planowanie) — zaplanowany „data, zaplanowany: X”, opuszczony „data, opuszczony: X”.
 * Audyt 0.10: stan dnia z jednej funkcji (dayStatusFrom — A2, A5: zrobiony inny trening = wypełnione z kropką, zaplanowany czeka / nie zrobiony);
 * A11-05: „dziś” i „tydzień deload” w etykiecie KAŻDEGO dnia; wiersz deload w ramce koloru muted (≥ 3:1), nie tylko tłem.
 */
export function HistoryCalendar({ byDay, selected, onSelect, onMonth }: { byDay: Map<string, Workout[]>; selected: string | null; onSelect: (key: string | null) => void; /** UX-16 A (audyt 0.10): oglądany miesiąc po przewinięciu strzałką — lista sesji idzie za nim */ onMonth?: (y: number, m: number) => void }) {
  /* bez przewijania miesięcy kalendarz idzie za dzisiejszą datą (powrót z tła w nowym miesiącu — store.refreshViews) */
  const t = useTheme(); const now = new Date(); const [picked, setYm] = useState<{ y: number; m: number } | null>(null); const ym = picked ?? { y: now.getFullYear(), m: now.getMonth() };
  const today = dayKey(Date.now()); const weeks = monthGrid(ym.y, ym.m); const heads = weekdayLabels();
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
            const mark = c.inMonth ? dayMark(status) : null; const missed = status === 'missed'; const other = status === 'other'; const planned = status === 'planned';
            const face = (
              <View style={{ width: CAL_FACE.w, height: CAL_FACE.h, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 1, borderWidth: on || isToday ? 2 : 0, borderColor: on ? t.text : t.accent, backgroundColor: on ? t.surface2 : 'transparent' }}>
                <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.2} style={{ color: c.inMonth ? (missed ? t.muted : t.text) : t.line, fontSize: 14, lineHeight: 18, fontFamily: n ? F.heavy : F.regular }}>{c.d}</Text>
                <View style={{ height: MINI_ICON.h }}>{mark ? <DayIcon mark={mark} bg={on ? t.surface2 : dl ? t.surface2 : t.bg} th={t} /> : null}</View>
              </View>);
            const parts = [dayTitle(c), ...(isToday ? [tr('dziś')] : []), ...(n ? [`${n} ${tp(n, 'sesja|sesje|sesji')}`] : []), ...(other ? [tr('zrobiony inny trening')] : []),
              ...(other || planned || missed ? [c.key < today ? tr('opuszczony: {name}', { name }) : tr('zaplanowany: {name}', { name })] : []), ...(dl ? [tr('tydzień deload')] : [])];
            const label = parts.join(', ');
            return (
              <View key={c.key} style={{ flex: 1, alignItems: 'center', paddingVertical: 2 }}>
                {c.inMonth ? <Pressable accessibilityLanguage={lang()} testID={`cal-${c.key}`} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={label} accessibilityValue={mark ? { text: markText(mark) } : undefined} /* znacznik dnia słownie — wartość; etykieta dnia bez zmian */ onPress={() => onSelect(on ? null : c.key)} hitSlop={4} /* A11-15: 36 + 2×4 = 44 pt */>{face}</Pressable>
                  : <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{face}</View>}
              </View>); })}
        </View>); })}
      {weeks.some(w => isDeloadWeek(new Date(+w[0].key.slice(0, 4), +w[0].key.slice(5, 7) - 1, +w[0].key.slice(8, 10), 12).getTime())) ? <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: t.muted, fontSize: 12, marginTop: 4, fontFamily: F.regular }}>{tr('Wiersz w ramce — tydzień deload.')}</Text> : null}
    </View>
  );
}
