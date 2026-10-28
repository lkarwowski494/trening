import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme, F, FW, font, RADIUS } from '@/lib/theme';
import { InfoTip } from '@/components/InfoTip';
import { t, exName, locale, lang } from '@/lib/i18n';
import { fmtSec, isDeloadWeek, useTick } from '@/lib/store';
import { fmtVol } from '@/lib/units';
import { periodSummary, periodTitle, type PeriodKind } from '@/lib/period';
import { Chip, Segmented, H2, Muted, Txt, monoSafe } from '@/components/ui';
import { MuscleMap } from '@/components/MuscleMap';
import { setsSplitByMuscle } from '@/lib/stats';
import { splitTotals } from '@/lib/setSplit';
import { monthWeeks, PLATE_STACK } from '@/lib/motif';
import { PlateStack, a11yHidden } from '@/components/Motif';
import { fmtDayMonth } from '@/lib/calendar';

/** Miesiąc: tygodnie jako rząd stosów talerzy (decyzja właściciela 09.10.2026 ok. 17:25) — ten sam stos co postęp tygodnia (PlateStack): pełny = plan
 * tygodnia wykonany w 100%, obwódka = niepełny, kreska = tydzień bez planu; pod spodem „Tygodnie z wykonanym planem: x z n”. Miesiąc bez planu — nic. */
function MonthWeeks({ start, end }: { start: number; end: number }) {
  const th = useTheme(); const r = monthWeeks(start, end); if (!r.planned) return null;
  const caption = t('Tygodnie z wykonanym planem: {done} z {n}', { done: r.full, n: r.planned });
  return (
    <View testID="month-weeks" accessible accessibilityRole="text" accessibilityLanguage={lang()} accessibilityLabel={caption} style={{ marginBottom: 10, gap: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, flexWrap: 'wrap' }}>
        {r.weeks.map((w, i) => w.state === 'none'
          ? <View key={i} testID={`month-week-${i}`} {...a11yHidden} style={{ width: PLATE_STACK.w, height: 3, borderRadius: RADIUS.marker, backgroundColor: th.ctrlLine }} />
          : <PlateStack key={i} testID={`month-week-${i}`} filled={w.state === 'full'} bg={th.bg} th={th} />)}
      </View>
      <Muted style={{ ...font('footnote') }}>{caption}</Muted>
    </View>);
}

/*
 * Podsumowanie tygodnia / miesiąca na ekranie Postępy (decyzja właściciela 08.10.2026, lib/period.ts): treningi, serie robocze,
 * objętość, łączny czas — z wartością poprzedniego okresu obok — i rekordy z okresu. Strzałki przewijają okresy wstecz (bez przyszłości).
 */
export function PeriodSummary() {
  const th = useTheme(); const [kind, setKind] = useState<PeriodKind>('week'); const [offset, setOffset] = useState(0);
  useTick(); const s = periodSummary(kind, offset); const split = setsSplitByMuscle(s.start, s.end); const deload = kind === 'week' && isDeloadWeek(s.start); const prevDeload = kind === 'week' && isDeloadWeek(s.start - 86400e3);
  const pick = (k: PeriodKind) => { setKind(k); setOffset(0); };
  const arrow = (label: string, glyph: string, delta: number, disabled = false) => (
    <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={() => setOffset(o => o + delta)} hitSlop={8}
      style={({ pressed }) => ({ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.25 : pressed ? 0.5 : 1 })}>
      <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: th.text, ...font('sectionTitle'), ...FW.semibold }}>{glyph}</Text>
    </Pressable>);
  const rows: [string, string, string][] = [
    [t('Treningi'), `${s.workouts}`, `${s.prev.workouts}`],
    [t('Serie robocze'), `${s.sets}`, `${s.prev.sets}`],
    [t('Objętość'), fmtVol(s.volume), fmtVol(s.prev.volume)],
    [t('Czas treningów'), fmtSec(s.durationSec), fmtSec(s.prev.durationSec)],
  ];
  const short = (ts: number) => fmtDayMonth(ts);
  return (
    <View testID="period-summary" style={{ marginBottom: 14 }}>
      <H2 infoId="period-summary" info={[t('Obok w nawiasie — cały poprzedni okres. Serie robocze bez rozgrzewki; rekordy jak w podsumowaniu treningu.'), t('Kolor względem partii z największą liczbą serii w tym okresie (partia główna 1 seria, pomocnicza 0,5). Szare — bez serii.')]}>{t('Podsumowanie')}</H2>
      <Segmented label={t('Podsumowanie')} value={kind} onChange={pick} options={[['week', t('Tydzień')], ['month', t('Miesiąc')]]} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
        {arrow(t('Poprzedni okres'), '‹', -1)}
        <Text accessibilityLanguage={lang()} accessibilityRole="header" maxFontSizeMultiplier={1.3} style={{ color: th.text, ...font('body'), fontFamily: F.heavy, flexShrink: 1, textAlign: 'center' }}>{periodTitle(kind, s.start)}</Text>
        {arrow(t('Następny okres'), '›', 1, offset >= 0)}
      </View>
      {deload ? <InfoTip id="period-deload" label={t('Tydzień deload (D na wykresach).')} info={t('Ten tydzień jest oznaczony jako deload (D na wykresach). Oznaczenie zmienisz w zakładce Plan: dzień → „Więcej opcji”.')} style={{ marginBottom: 8 }}><Muted style={{ ...font('footnote') }}>{t('Tydzień deload (D na wykresach).')}</Muted></InfoTip> : null}{/* 11.10.2026: Postępy pokazują oznaczenie, nie zmieniają (chip „Tydzień deload” usunięty) */}
      {kind === 'month' ? <MonthWeeks start={s.start} end={s.end} /> : null}
      {prevDeload ? <Muted style={{ ...font('footnote'), marginBottom: 6 }}>{t('Poprzedni tydzień jest oznaczony jako deload.')}</Muted> : null}
      <View style={{ padding: 12, borderRadius: RADIUS.group, backgroundColor: th.surface2, gap: 6 }}>
        {rows.map(([l, v, p]) => (
          <View accessibilityLanguage={lang()} key={l} accessible accessibilityLabel={t('{label}: {v}, poprzednio {p}', { label: l, v, p })} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Muted>{l}</Muted>
            <Txt maxFontSizeMultiplier={1.4} style={{ fontFamily: F.monoBold, fontVariant: ['tabular-nums'] }}>{monoSafe(v, true)} <Muted style={{ ...font('footnote') }}>({t('poprz.')}{'\u00a0'}<Muted style={{ ...font('footnote'), fontFamily: F.mono, fontVariant: ['tabular-nums'] }}>{monoSafe(p)}</Muted>)</Muted>{/* A11-11: słowo krojem tekstu (Plex Mono bez greckich liter), liczba mono */}</Txt>
          </View>))}
      </View>
      <MuscleMap sets={splitTotals(split)} splits={split} />
      <Muted style={{ ...font('footnote'), ...FW.semibold, marginTop: 10, marginBottom: 4 }}>{t('Rekordy w tym okresie')}</Muted>
      {s.prs.length ? s.prs.map(({ workoutId, at, pr }) => (
        <View key={workoutId + pr.exercise.id + pr.set.id} style={{ paddingVertical: 4 }}>
          <Txt style={{ ...font('callout') }}>{exName(pr.exercise)} <Muted style={{ ...font('footnote') }}>· {short(at)}</Muted></Txt>
          <Muted style={{ ...font('footnote') }}>{pr.details.join(', ') /* M1-audytor-generalny-029: lista pobitych wartości — przecinek (wz. 28) */}</Muted>
        </View>))
        : <Muted style={{ ...font('footnote') }}>{s.workouts ? t('Bez nowych rekordów w tym okresie.') : t('Brak treningów w tym okresie.')}</Muted>}
    </View>
  );
}
