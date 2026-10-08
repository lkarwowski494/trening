import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme, F } from '@/lib/theme';
import { t, exName, locale } from '@/lib/i18n';
import { fmtSec, isDeloadWeek, toggleDeloadWeek, useTick } from '@/lib/store';
import { fmtVol } from '@/lib/units';
import { periodSummary, periodTitle, type PeriodKind } from '@/lib/period';
import { Chip, H2, Muted, Txt } from '@/components/ui';
import { MuscleMap } from '@/components/MuscleMap';
import { setsByMuscle } from '@/lib/stats';

/*
 * Podsumowanie tygodnia / miesiąca na ekranie Postępy (decyzja właściciela 08.10.2026, lib/period.ts): treningi, serie robocze,
 * objętość, łączny czas — z wartością poprzedniego okresu obok — i rekordy z okresu. Strzałki przewijają okresy wstecz (bez przyszłości).
 */
export function PeriodSummary() {
  const th = useTheme(); const [kind, setKind] = useState<PeriodKind>('week'); const [offset, setOffset] = useState(0);
  useTick(); const s = periodSummary(kind, offset); const deload = kind === 'week' && isDeloadWeek(s.start); const prevDeload = kind === 'week' && isDeloadWeek(s.start - 86400e3);
  const pick = (k: PeriodKind) => { setKind(k); setOffset(0); };
  const arrow = (label: string, glyph: string, delta: number, disabled = false) => (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={() => setOffset(o => o + delta)} hitSlop={8}
      style={({ pressed }) => ({ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.25 : pressed ? 0.5 : 1 })}>
      <Text maxFontSizeMultiplier={1.3} style={{ color: th.text, fontSize: 22, fontFamily: F.semibold }}>{glyph}</Text>
    </Pressable>);
  const rows: [string, string, string][] = [
    [t('Treningi'), `${s.workouts}`, `${s.prev.workouts}`],
    [t('Serie robocze'), `${s.sets}`, `${s.prev.sets}`],
    [t('Objętość'), fmtVol(s.volume), fmtVol(s.prev.volume)],
    [t('Czas treningów'), fmtSec(s.durationSec), fmtSec(s.prev.durationSec)],
  ];
  const short = (ts: number) => new Date(ts).toLocaleDateString(locale(), { day: 'numeric', month: 'short' });
  return (
    <View testID="period-summary" style={{ marginBottom: 14 }}>
      <H2>{t('Podsumowanie')}</H2>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <Chip label={t('Tydzień')} on={kind === 'week'} onPress={() => pick('week')} />
        <Chip label={t('Miesiąc')} on={kind === 'month'} onPress={() => pick('month')} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
        {arrow(t('Poprzedni okres'), '‹', -1)}
        <Text accessibilityRole="header" maxFontSizeMultiplier={1.3} style={{ color: th.text, fontSize: 16, fontFamily: F.heavy, flexShrink: 1, textAlign: 'center' }}>{periodTitle(kind, s.start)}</Text>
        {arrow(t('Następny okres'), '›', 1, offset >= 0)}
      </View>
      {kind === 'week' ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <Chip label={t('Tydzień deload')} on={deload} toggle onPress={() => toggleDeloadWeek(s.start)} />
        <Muted style={{ fontSize: 12, flexShrink: 1 }}>{t('Twoje oznaczenie, np. lżejszy tydzień. Przy starcie treningu zaproponuję mniej serii (około połowy), ciężary bez zmian.')}</Muted>
      </View> : null}
      {prevDeload ? <Muted style={{ fontSize: 12, marginBottom: 6 }}>{t('Poprzedni tydzień jest oznaczony jako deload.')}</Muted> : null}
      <View style={{ padding: 12, borderRadius: 10, backgroundColor: th.surface2, gap: 6 }}>
        {rows.map(([l, v, p]) => (
          <View key={l} accessible accessibilityLabel={t('{label}: {v}, poprzednio {p}', { label: l, v, p })} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Muted>{l}</Muted>
            <Txt maxFontSizeMultiplier={1.4} style={{ fontFamily: F.monoBold }}>{v} <Muted style={{ fontSize: 12, fontFamily: F.mono }}>({t('poprz.')} {p})</Muted></Txt>
          </View>))}
      </View>
      <MuscleMap sets={setsByMuscle(s.start, s.end)} />
      <Muted style={{ fontSize: 12, fontFamily: F.semibold, marginTop: 10, marginBottom: 4 }}>{t('Rekordy w tym okresie')}</Muted>
      {s.prs.length ? s.prs.map(({ workoutId, at, pr }) => (
        <View key={workoutId + pr.exercise.id + pr.set.id} style={{ paddingVertical: 4 }}>
          <Txt style={{ fontSize: 14 }}>{exName(pr.exercise)} <Muted style={{ fontSize: 12 }}>· {short(at)}</Muted></Txt>
          <Muted style={{ fontSize: 13 }}>{pr.details.join(' · ')}</Muted>
        </View>))
        : <Muted style={{ fontSize: 13 }}>{s.workouts ? t('Bez nowych rekordów w tym okresie.') : t('Brak treningów w tym okresie.')}</Muted>}
      <Muted style={{ fontSize: 12, marginTop: 6 }}>{t('Obok w nawiasie — cały poprzedni okres. Serie robocze bez rozgrzewki; rekordy jak w podsumowaniu treningu.')}</Muted>
    </View>
  );
}
