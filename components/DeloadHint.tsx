import React from 'react';
import { View } from 'react-native';
import { Btn, Muted } from '@/components/ui';
import { useTheme } from '@/lib/theme';
import { toggleDeloadWeek, useTick } from '@/lib/store';
import { deloadHint, snoozeDeloadHint, DELOAD_EVERY } from '@/lib/deload';
import { t, locale } from '@/lib/i18n';

/*
 * Deload A w Kalendarzu (decyzja właściciela 08.10.2026): podpowiedź „zwykle co 4–6 tygodni” opisana jako praktyka trenerów, nie wynik badań
 * (docs/research/22); „Zaplanuj deload od …” oznacza następny tydzień. Oznaczony tydzień — informacja, co się stanie przy starcie treningu.
 */
const keyTs = (k: string) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10), 12).getTime();
const day = (k: string) => new Date(keyTs(k)).toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'numeric' });

export function DeloadHint() {
  useTick(); const th = useTheme(); const h = deloadHint(Date.now());
  if (h.kind === 'none') return null;
  const box = { padding: 10, borderRadius: 10, backgroundColor: th.surface2, marginBottom: 10, gap: 6 } as const;
  if (h.kind === 'suggest') return (
    <View testID="deload-hint" style={box}>
      <Muted style={{ fontSize: 13 }}>{t('Tygodnie treningu z rzędu bez deloadu: {n}. Trenerzy zwykle robią deload co {a}–{b} tygodni — to praktyka, nie wynik badań.', { n: h.weeks, a: DELOAD_EVERY[0], b: DELOAD_EVERY[1] })}</Muted>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        <Btn small title={t('Zaplanuj deload od {date}', { date: day(h.from) })} onPress={() => toggleDeloadWeek(keyTs(h.from))} />
        <Btn small kind="ghost" title={t('Nie teraz')} accessibilityHint={t('Podpowiedź wróci w przyszłym tygodniu.')} onPress={() => snoozeDeloadHint(h.from)} />{/* audyt 0.10 D4 (UX-06) */}
      </View>
    </View>);
  return (
    <View testID="deload-hint" style={box}>
      <Muted style={{ fontSize: 13 }}>{h.kind === 'current' ? t('Ten tydzień: deload. Przy starcie treningu zaproponuję mniej serii (około połowy), ciężary bez zmian.') : t('Od {date}: tydzień deload. Przy starcie treningu zaproponuję mniej serii (około połowy), ciężary bez zmian.', { date: day(h.from) })}</Muted>
      <Btn small kind="ghost" title={t('Zdejmij oznaczenie deload')} onPress={() => toggleDeloadWeek(h.kind === 'current' ? Date.now() : keyTs(h.from))} style={{ alignSelf: 'flex-start' }} />
    </View>);
}
