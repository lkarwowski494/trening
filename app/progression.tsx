import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen, Muted, Txt, Chip, H2 } from '@/components/ui';
import { useTick } from '@/lib/store';
import { compareCached, pctText, signedNum, type CmpKind, type Comparison } from '@/lib/progress';
import { periodTitle } from '@/lib/period';
import { WEEKLY_SETS_MARK } from '@/lib/stats';
import { fmtVol, wu } from '@/lib/units';
import { MuscleMap } from '@/components/MuscleMap';
import { MuscleRows, IndirectLegend, SegBar, SegLegend, HatchBar, PeriodLine, setBars, volumeBars } from '@/components/ProgressBars';
import { useTheme, F, TEXT_SCALE_MAX } from '@/lib/theme';
import { t, tp, locale, lang } from '@/lib/i18n';
import { fmtDayMonth } from '@/lib/calendar';

/*
 * Progresja — szczegóły (docs/22 krok 3 pkt 5; decyzja właściciela 11.10.2026, P8 B): trzy porównania — (a) ten tydzień (wykonane + zaplanowane z szablonów)
 * z poprzednim, (b) poprzedni tydzień z tym sprzed dwóch tygodni (wykonane), (c) miesiąc do miesiąca. W każdym najpierw objętość, potem serie, per partia;
 * sylwetka zaznacza partie, w których objętość wzrosła. Rachunek z historii i planu użytkownika — bez ocen (lib/progress.ts opisuje definicje).
 */
const KINDS: CmpKind[] = ['week', 'prevWeek', 'month'];
const kindOf = (v: unknown): CmpKind => (v === 'prevWeek' || v === 'month' ? v : 'week');
const short = (ts: number) => fmtDayMonth(ts);

/** Podpis okresu bieżącego i porównawczego. */
function periodLabels(c: Comparison): { cur: string; prev: string } {
  if (c.kind === 'month') return { cur: `${short(c.cur.start)} – ${short(c.cur.end - 1)}`, prev: `${short(c.prev.start)} – ${short(c.prev.end - 1)}` };
  return { cur: periodTitle('week', c.cur.start), prev: periodTitle('week', c.prev.start) };
}

/** Dwa słupki na wspólnej osi (M1-audytor-generalny-032, 20.10.2026): okres 1 (wykonane + zaplanowane) — pełny kolor, okres 2 — szary z prążkami (HatchBar), przy każdym
 * nazwa okresu i liczba (PeriodLine) — ten sam język co paski partii; okresów nie odróżnia sama kolejność ani kolor. */
function TotalBars({ id, done, planned, prev, curName, prevName, curText, prevText }: { id: string; done: number; planned: number; prev: number; curName: string; prevName: string; curText: string; prevText: string }) {
  const max = Math.max(1, done + planned, prev);
  return (
    <View testID={`total-${id}`} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ gap: 2, marginTop: 4 }}>
      <PeriodLine n={1} id={`total-${id}`} name={curName} text={curText}><SegBar testID={`total-${id}-cur`} done={done} planned={planned} max={max} height={10} /></PeriodLine>
      <PeriodLine n={2} id={`total-${id}`} name={prevName} text={prevText}><HatchBar testID={`total-${id}-prev`} pct={Math.min(100, (100 * prev) / max)} height={10} /></PeriodLine>
    </View>);
}

export default function ProgressionScreen() {
  const { c: param } = useLocalSearchParams<{ c?: string }>(); useTick(); const th = useTheme();
  const [kind, setKind] = useState<CmpKind>(kindOf(param)); const c = compareCached(kind); const lb = periodLabels(c);
  const names: Record<CmpKind, string> = { week: t('Ten tydzień'), prevWeek: t('Poprzedni tydzień'), month: t('Miesiąc') };
  const periods: [string, string] = kind === 'week' ? [t('Ten tydzień'), t('Poprzedni tydzień')] : kind === 'prevWeek' ? [t('Poprzedni tydzień'), t('2 tyg. temu')] : [t('Ten miesiąc'), t('Poprzedni miesiąc')]; /* podpisy dwóch słupków na partię (14.10.2026) */
  const plannedV = c.planned?.volume ?? 0; const plannedS = c.planned?.sets ?? 0; const vol = `${c.unknown ? '≥ ' : ''}${fmtVol(c.total.volume)}`;
  /* 14.10.2026: procent i różnica bezwzględna (kg / liczba serii); pusty poprzedni okres = samo „brak poprzedniego okresu” */
  const volPct = c.volumePct === null ? pctText(null) : `${pctText(c.volumePct)} (${signedNum(c.volumeDelta, fmtVol)})`; const setsPct = c.setsPct === null ? pctText(null) : `${pctText(c.setsPct)} (${signedNum(c.setsDelta)})`;
  const improved: Record<string, number> = {}; c.rows.filter(r => r.volumeUp).forEach(r => { improved[r.muscle] = r.doneVolume + r.plannedVolume - r.prevVolume; });
  const empty = !c.total.sets && !c.before.sets; const n = c.planned?.unknownSets ?? 0;
  /* Test 0.20 (19.10.2026): przy długiej wartości etykieta kurczyła się i łamała w środku słowa („Objętoś / ć”). Etykieta ma własną szerokość (flexShrink 0,
   * maxWidth 100% — bardzo długie tłumaczenie zawija się po słowach), wiersz się zawija, a wartość zajmuje resztę wiersza albo przechodzi pod etykietę. */
  const rowText = (id: string, label: string, value: string, p: string, pct: string, sub?: string, spoken?: string) => (
    <View testID={`psum-${id}`} accessibilityLanguage={lang()} accessible accessibilityLabel={t('{label}: {v}, poprzednio {p}, {d}', { label, v: (spoken ?? value) + (sub ? ` (${sub})` : ''), p, d: pct })} style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', columnGap: 8 }}>
      <Muted testID={`psum-${id}-label`} style={{ flexShrink: 0, maxWidth: '100%' }}>{label}</Muted>
      <Txt testID={`psum-${id}-value`} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ fontFamily: F.monoBold, flexShrink: 1, flexGrow: 1, textAlign: 'right' }}>{value} <Muted style={{ fontSize: 12 }}>({t('poprz.')}{' '}{p}) {pct}</Muted></Txt>
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
          {rowText('volume', t('Objętość'), vol, fmtVol(c.before.volume), volPct, c.planned ? `${fmtVol(c.done.volume)} + ${c.unknown ? '≥ ' : ''}${fmtVol(plannedV)}` : undefined, c.unknown ? `${t('co najmniej {n}', { n: fmtVol(c.total.volume) })}, ${t('część zaplanowanych serii nie ma ciężaru')}` : undefined)}
          <TotalBars id="volume" done={c.done.volume} planned={plannedV} prev={c.before.volume} curName={periods[0]} prevName={periods[1]} curText={vol} prevText={fmtVol(c.before.volume)} />
          {rowText('sets', t('Serie robocze'), String(c.total.sets), String(c.before.sets), setsPct, c.planned ? `${c.done.sets} + ${plannedS}` : undefined)}
          <TotalBars id="sets" done={c.done.sets} planned={plannedS} prev={c.before.sets} curName={periods[0]} prevName={periods[1]} curText={String(c.total.sets)} prevText={String(c.before.sets)} />
          {rowText('workouts', t('Treningi'), String(c.total.workouts), String(c.before.workouts), pctText(c.before.workouts ? Math.round(((c.total.workouts - c.before.workouts) / c.before.workouts) * 100) : null), c.planned ? `${c.done.workouts} + ${c.planned.workouts}` : undefined)}
          {c.planned ? <SegLegend /> : null}
        </View>
        {c.unknown ? <View testID="progress-unknown"><Muted style={{ fontSize: 12, marginTop: 6 }}>{t('„≥” — w zaplanowanych szablonach {n} {s} nie ma ciężaru ani powtórzeń (i nie ma „Poprzednio”): liczą się do serii, ale nie do objętości.', { n, s: tp(n, 'seria|serie|serii') })}</Muted></View> : null}
        <MuscleMap sets={improved} title={t('Partie z większą objętością')} legend={false}
          label={Object.keys(improved).length ? t('Partie z większą objętością niż poprzednio: {list}', { list: c.rows.filter(r => r.volumeUp).map(r => t(r.muscle)).join(', ') }) : t('Żadna partia nie ma większej objętości niż poprzednio.')}
          caption={t('Zaznaczone partie, w których objętość jest większa niż w okresie porównawczym; im mocniejszy kolor, tym większy wzrost. Szare — bez wzrostu.')} />
        <H2 style={{ marginTop: 16 }}>{t('Objętość per partia ({u})', { u: wu() })}</H2>
        <MuscleRows rows={volumeBars(c.rows)} metric="volume" names={periods} />
        <H2 style={{ marginTop: 10 }} infoId="prog-sets" info={kind === 'week'
          ? t('Zaplanowane = szablony z planu na pozostałe dni tygodnia, policzone z wartości w szablonie (brakujące — z „Poprzednio”). To rachunek z Twojego planu, nie prognoza. Partia główna liczy 1 serię, pomocnicza 0,5.')
          : t('Objętość = ciężar × powtórzenia × mnożnik ćwiczenia (jak w Postępach); rozgrzewka poza. Partia główna liczy całość, pomocnicza połowę.')}>{t('Serie per partia')}</H2>
        <MuscleRows rows={setBars(c.setRows, kind !== 'month')} metric="sets" names={periods} />
        {c.setRows.some(r => r.doneSplit.indirectSets + r.plannedSplit.indirectSets > 0) ? <IndirectLegend /> : null}
        {kind !== 'month' ? <Muted style={{ fontSize: 12, marginTop: 2 }}>{t('Kreska = cel serii na partię w tygodniu: {n} automatycznie albo Twoja liczba z Ustawień.', { n: WEEKLY_SETS_MARK })}</Muted> : null}
      </>}
    </ScrollView></Screen>
  );
}
