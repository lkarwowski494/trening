import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/AppText';
import { useTheme, F, TEXT_SCALE_MAX, FW, font, RADIUS } from '@/lib/theme';
import { t as tr, lang, exName } from '@/lib/i18n';
import { recordCards, type RecordCard, type RecordStat, type WorkoutPR } from '@/lib/stats';

/** Linia pobitej statystyki: „↑ e1RM 112,5 kg (+2,5 kg)”; pierwszy wynik (brak poprzedniego rekordu) — „(pierwszy wynik)”. */
export const statLine = (s: RecordStat): string => s.delta != null && !s.first ? tr('↑ {label} {value} ({delta})', { label: s.label, value: s.value, delta: s.delta }) : tr('↑ {label} {value} (pierwszy wynik)', { label: s.label, value: s.value });
/** Etykieta VoiceOver jednego ćwiczenia (bez strzałki): nazwa, statystyki z przyrostem, najlepsza seria. */
export const cardLabel = (c: RecordCard): string => [exName(c.exercise),
  ...c.stats.map(s => s.delta != null && !s.first ? tr('{label} {value}, przyrost {delta}', { label: s.label, value: s.value, delta: s.delta }) : tr('{label} {value}, pierwszy wynik', { label: s.label, value: s.value })),
  ...(c.bestSet ? [tr('Najlepsza seria: {s}', { s: c.bestSet })] : [])].join('. ');

/**
 * Karta rekordów na ekranie zakończonego treningu (decyzja właściciela 11.10.2026, pkt 7, wariant A bez grafiki): nagłówek z liczbą rekordów (prCountOf),
 * a pod nim ćwiczenia z rekordem — nazwa, tylko pobite statystyki (↑ wartość i przyrost względem poprzedniego rekordu) oraz najlepsza seria.
 * Teksty zawijają się (bez ucinania); jedna etykieta VoiceOver na ćwiczenie.
 */
export function RecordsCard({ count, prs }: { count: number; prs: readonly WorkoutPR[] }) {
  const th = useTheme(); const cards = recordCards(prs); const head = count === 1 ? tr('Nowy rekord!') : tr('Nowe rekordy: {n}', { n: count });
  return (
    <View testID="record-card" style={{ borderRadius: RADIUS.group, borderWidth: 1, borderColor: th.line, backgroundColor: th.surface, marginBottom: 14, padding: 12, gap: 10 }}>
      <Text testID="record-banner" accessible accessibilityRole="header" accessibilityLanguage={lang()} accessibilityLabel={head} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('body'), fontFamily: F.heavy }}>{head}</Text>
      {cards.map(c => (
        <View key={c.exercise.id} testID={`record-ex-${c.exercise.id}`} accessible accessibilityLanguage={lang()} accessibilityLabel={cardLabel(c)} style={{ gap: 2 }}>
          <Text maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('body'), ...FW.semibold }}>{exName(c.exercise)}</Text>
          {c.stats.map(s => <Text key={s.kind} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.band, ...font('callout'), ...FW.semibold }}>{statLine(s)}</Text>)}
          {c.bestSet ? <Text maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, ...font('callout') }}>{tr('Najlepsza seria: {s}', { s: c.bestSet })}</Text> : null}
        </View>))}
    </View>);
}
