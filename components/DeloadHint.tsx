import React from 'react';
import { View } from 'react-native';
import { Btn, Muted } from '@/components/ui';
import { useTheme } from '@/lib/theme';
import { toggleDeloadWeek, useTick, fmtDayKey } from '@/lib/store';
import { deloadHint, snoozeDeloadHint, DELOAD_EVERY } from '@/lib/deload';
import { t, locale } from '@/lib/i18n';
import { deloadLessText } from '@/lib/start';

/*
 * Deload A w Kalendarzu (decyzja właściciela 08.10.2026): podpowiedź „zwykle co 4–6 tygodni” opisana jako praktyka trenerów, nie wynik badań
 * (docs/research/22); audyt kontrolny 1 MER2-05: trzy prace o częstotliwości to jeden zespół (docs/research/22 sekcja 2) — oznaczone „jedno źródło”
 * (reguła właściciela 08.10.2026). „Zaplanuj deload od …” oznacza następny tydzień. Oznaczony tydzień — informacja, co się stanie przy starcie treningu
 * (audyt 0.10, MER-04 wariant A: „o około 1/3–1/2 mniej serii (np. 2 z 3)” — zgodnie z deloadKeep, nie „około połowy”).
 */
const keyTs = (k: string) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10), 12).getTime();
const day = (k: string) => fmtDayKey(k); /* H3 (audyt 0.10): jeden format daty dnia */

export function DeloadHint() {
  useTick(); const th = useTheme(); const h = deloadHint(Date.now());
  if (h.kind === 'none') return null;
  const box = { padding: 10, borderRadius: 10, backgroundColor: th.surface2, marginBottom: 10, gap: 6 } as const;
  if (h.kind === 'suggest') return (
    <View testID="deload-hint" style={box}>
      <Muted style={{ fontSize: 13 }}>{t('Tygodnie treningu z rzędu bez deloadu: {n}. Trenerzy zwykle robią deload co {a}–{b} tygodni — to praktyka opisana w ankietach jednego zespołu badaczy (jedno źródło), nie wynik badań skuteczności.', { n: h.weeks, a: DELOAD_EVERY[0], b: DELOAD_EVERY[1] })}</Muted>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        <Btn small title={t('Zaplanuj deload od {date}', { date: day(h.from) })} onPress={() => toggleDeloadWeek(keyTs(h.from))} />
        <Btn small kind="ghost" title={t('Nie teraz')} accessibilityHint={t('Podpowiedź wróci w przyszłym tygodniu.')} onPress={() => snoozeDeloadHint(h.from)} />{/* audyt 0.10 D4 (UX-06) */}
      </View>
    </View>);
  return (
    <View testID="deload-hint" style={box}>
      <Muted style={{ fontSize: 13 }}>{h.kind === 'current' ? t('Ten tydzień: deload. Przy starcie treningu zaproponuję {less}, ciężary bez zmian.', { less: deloadLessText() }) : t('Od {date}: tydzień deload. Przy starcie treningu zaproponuję {less}, ciężary bez zmian.', { date: day(h.from), less: deloadLessText() })}</Muted>
      <Btn small kind="ghost" title={t('Zdejmij oznaczenie deload')} onPress={() => toggleDeloadWeek(h.kind === 'current' ? Date.now() : keyTs(h.from))} style={{ alignSelf: 'flex-start' }} />
    </View>);
}
