import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen, Muted, Txt, Chip, H2 } from '@/components/ui';
import { useTick } from '@/lib/store';
import { compareCached, type CmpKind, type Comparison } from '@/lib/progress';
import { periodTitle } from '@/lib/period';
import { WEEKLY_SETS_MARK } from '@/lib/stats';
import { fmtVol, wu } from '@/lib/units';
import { MuscleMap } from '@/components/MuscleMap';
import { MuscleRows, IndirectLegend, SegBar, SegLegend, setBars, volumeBars } from '@/components/ProgressBars';
import { useTheme, F, TEXT_SCALE_MAX } from '@/lib/theme';
import { t, tp, locale, lang } from '@/lib/i18n';

/*
 * Progresja — szczegóły (docs/22 krok 3 pkt 5; decyzja właściciela 11.10.2026, P8 B): trzy porównania — (a) ten tydzień (wykonane + zaplanowane z szablonów)
 * z poprzednim, (b) poprzedni tydzień z tym sprzed dwóch tygodni (wykonane), (c) miesiąc do miesiąca. W każdym najpierw objętość, potem serie, per partia;
 * sylwetka zaznacza partie, w których objętość wzrosła. Rachunek z historii i planu użytkownika — bez ocen (lib/progress.ts opisuje definicje).
 */
const KINDS: CmpKind[] = ['week', 'prevWeek', 'month'];
const kindOf = (v: unknown): CmpKind => (v === 'prevWeek' || v === 'month' ? v : 'week');
const pctText = (p: number | null) => (p === null ? '—' : p > 0 ? `+${p}%` : p < 0 ? `−${Math.abs(p)}%` : '0%');
const short = (ts: number) => new Date(ts).toLocaleDateString(locale(), { day: 'numeric', month: 'short' });

/** Podpis okresu bieżącego i porównawczego. */
function periodLabels(c: Comparison): { cur: string; prev: string } {
  if (c.kind === 'month') return { cur: `${short(c.cur.start)} – ${short(c.cur.end - 1)}`, prev: `${short(c.prev.start)} – ${short(c.prev.end - 1)}` };
  return { cur: periodTitle('week', c.cur.start), prev: periodTitle('week', c.prev.start) };
}

/** Dwa słupki: bieżący (wykonane + zaplanowane) i poprzedni — wspólna skala. */
function TotalBars({ id, done, planned, prev, curLabel, prevLabel }: { id: string; done: number; planned: number; prev: number; curLabel: string; prevLabel: string }) {
  const max = Math.max(1, done + planned, prev);
  return (
    <View testID={`total-${id}`} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ gap: 4, marginTop: 6 }}>
      <SegBar testID={`total-${id}-cur`} done={done} planned={planned} max={max} height={10} />
      <SegBar testID={`total-${id}-prev`} done={prev} max={max} height={10} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}><Muted style={{ fontSize: 11, flexShrink: 1 }}>{curLabel}</Muted><Muted style={{ fontSize: 11, flexShrink: 1, textAlign: 'right' }}>{prevLabel}</Muted></View>
    </View>);
}

export default function ProgressionScreen() {
  const { c: param } = useLocalSearchParams<{ c?: string }>(); useTick(); const th = useTheme();
  const [kind, setKind] = useState<CmpKind>(kindOf(param)); const c = compareCached(kind); const lb = periodLabels(c);
  const names: Record<CmpKind, string> = { week: t('Ten tydzień'), prevWeek: t('Poprzedni tydzień'), month: t('Miesiąc') };
  const plannedV = c.planned?.volume ?? 0; const plannedS = c.planned?.sets ?? 0; const vol = `${fmtVol(c.total.volume)}${c.unknown ? '+?' : ''}`;
  const improved: Record<string, number> = {}; c.rows.filter(r => r.volumeUp).forEach(r => { improved[r.muscle] = r.doneVolume + r.plannedVolume - r.prevVolume; });
  const empty = !c.total.sets && !c.before.sets; const n = c.planned?.unknownSets ?? 0;
  const rowText = (label: string, value: string, p: string, pct: string, sub?: string) => (
    <View accessibilityLanguage={lang()} accessible accessibilityLabel={t('{label}: {v}, poprzednio {p}, {d}', { label, v: value + (sub ? ` (${sub})` : ''), p, d: pct })} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
      <Muted style={{ flexShrink: 1 }}>{label}</Muted>
      <Txt maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ fontFamily: F.monoBold, flexShrink: 1, textAlign: 'right' }}>{value} <Muted style={{ fontSize: 12 }}>({t('poprz.')}{' '}{p}) {pct}</Muted></Txt>
    </View>);
  return (
    <Screen><ScrollView testID="progression-screen" contentContainerStyle={{ paddingVertical: 10, paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {KINDS.map(k => <Chip key={k} label={names[k]} on={kind === k} onPress={() => setKind(k)} a11yLabel={t('Porównanie: {name}', { name: names[k] })} />)}
      </View>
      <H2 style={{ marginTop: 12 }}>{kind === 'week' ? t('Ten tydzień vs poprzedni') : kind === 'prevWeek' ? t('Poprzedni tydzień vs 2 tyg. temu') : t('Miesiąc do miesiąca')}</H2>
      <View testID="progress-periods"><Muted style={{ fontSize: 13, marginBottom: 8 }}>{t('{cur} wobec {prev}', { cur: lb.cur, prev: lb.prev })}</Muted></View>
      {kind === 'month' ? <Muted style={{ fontSize: 12, marginBottom: 8 }}>{t('Porównanie tych samych dni miesiąca: 1–{n}.', { n: new Date(c.cur.end - 1).getDate() })}</Muted> : null}
      {c.deloadCur || c.deloadPrev ? <Muted style={{ fontSize: 12, marginBottom: 8 }}>{[c.deloadCur ? t('Ten tydzień jest oznaczony jako deload.') : '', c.deloadPrev ? t('Poprzedni tydzień jest oznaczony jako deload.') : ''].filter(Boolean).join(' ')}</Muted> : null}
      {empty ? <View testID="progress-empty"><Muted style={{ fontSize: 13 }}>{t('Brak treningów w tym i poprzednim okresie.')}</Muted></View> : <>
        <View style={{ padding: 12, borderRadius: 10, backgroundColor: th.surface2, gap: 6 }}>
          {rowText(t('Objętość'), vol, fmtVol(c.before.volume), pctText(c.volumePct), c.planned ? `${fmtVol(c.done.volume)} + ${fmtVol(plannedV)}${c.unknown ? '+?' : ''}` : undefined)}
          <TotalBars id="volume" done={c.done.volume} planned={plannedV} prev={c.before.volume} curLabel={`${t('Ten okres')}: ${vol}`} prevLabel={`${t('Poprzedni okres')}: ${fmtVol(c.before.volume)}`} />
          {rowText(t('Serie robocze'), String(c.total.sets), String(c.before.sets), pctText(c.setsPct), c.planned ? `${c.done.sets} + ${plannedS}` : undefined)}
          <TotalBars id="sets" done={c.done.sets} planned={plannedS} prev={c.before.sets} curLabel={`${t('Ten okres')}: ${c.total.sets}`} prevLabel={`${t('Poprzedni okres')}: ${c.before.sets}`} />
          {rowText(t('Treningi'), String(c.total.workouts), String(c.before.workouts), pctText(c.before.workouts ? Math.round(((c.total.workouts - c.before.workouts) / c.before.workouts) * 100) : null), c.planned ? `${c.done.workouts} + ${c.planned.workouts}` : undefined)}
          {c.planned ? <SegLegend /> : null}
        </View>
        {c.unknown ? <View testID="progress-unknown"><Muted style={{ fontSize: 12, marginTop: 6 }}>{t('„+?” — w zaplanowanych szablonach {n} {s} nie ma ciężaru ani powtórzeń (i nie ma „Poprzednio”): liczą się do serii, ale nie do objętości.', { n, s: tp(n, 'seria|serie|serii') })}</Muted></View> : null}
        <MuscleMap sets={improved} title={t('Partie z większą objętością')} legend={false}
          label={Object.keys(improved).length ? t('Partie z większą objętością niż poprzednio: {list}', { list: c.rows.filter(r => r.volumeUp).map(r => t(r.muscle)).join(', ') }) : t('Żadna partia nie ma większej objętości niż poprzednio.')}
          caption={t('Zaznaczone partie, w których objętość jest większa niż w okresie porównawczym; im ciemniej, tym większy wzrost. Szare — bez wzrostu.')} />
        <H2 style={{ marginTop: 16 }}>{t('Objętość per partia ({u})', { u: wu() })}</H2>
        <MuscleRows rows={volumeBars(c.rows)} metric="volume" />
        <H2 style={{ marginTop: 10 }}>{t('Serie per partia')}</H2>
        <MuscleRows rows={setBars(c.setRows, kind !== 'month')} metric="sets" />
        {c.setRows.some(r => r.doneSplit.indirectSets + r.plannedSplit.indirectSets > 0) ? <IndirectLegend /> : null}
        {kind !== 'month' ? <Muted style={{ fontSize: 12, marginTop: 2 }}>{t('Kreska = cel serii na partię w tygodniu: {n} automatycznie albo Twoja liczba z Ustawień.', { n: WEEKLY_SETS_MARK })}</Muted> : null}
        <Muted style={{ fontSize: 12, marginTop: 8 }}>{kind === 'week'
          ? t('Zaplanowane = szablony z planu na pozostałe dni tygodnia, policzone z wartości w szablonie (brakujące — z „Poprzednio”). To rachunek z Twojego planu, nie prognoza. Partia główna liczy 1 serię, pomocnicza 0,5.')
          : t('Objętość = ciężar × powtórzenia × mnożnik ćwiczenia (jak w Postępach); rozgrzewka poza. Partia główna liczy całość, pomocnicza połowę.')}</Muted>
      </>}
    </ScrollView></Screen>
  );
}
