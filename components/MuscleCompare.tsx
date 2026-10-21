import React from 'react';
import { View } from 'react-native';
import { Muted, Txt } from '@/components/ui';
import { MUSCLES } from '@/lib/seed';
import { splitText, splitLabel, splitTotals, emptySplit, type SetSplit } from '@/lib/setSplit';
import { Seg, PeriodLine, HatchBar, prevText } from '@/components/ProgressBars';
import { useTheme, font } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';

/** Wysokość paska partii (pt); promień = połowa wysokości (pasek zaokrąglony jak w ProgressBars). */
const BAR_H = 8;
/** Porównanie partii: ten tydzień vs poprzedni — DWA słupki na partię na wspólnej osi (14.10.2026): wyżej okres 1 (pełny), niżej okres 2 (szary z prążkami), przy każdym
 * nazwa okresu i liczby; serie albo objętość (06.10.2026). `mark` — pionowa kreska (pakiet C: WEEKLY_SETS_MARK przy seriach, ACSM 2026); oś obejmuje kreskę i oba słupki. */
export function MuscleCompare({ cur: curIn, prev: prevIn, curSplit, prevSplit, fmt, markOf, parts = MUSCLES }: { cur?: Record<string, number>; prev?: Record<string, number>; /** serie (13.10.2026): podział bezpośrednio / pośrednio zamiast samych sum — odcinki paska i podpis „6 + 1,5 pośrednio (3 serie) / 10” */ curSplit?: Record<string, SetSplit>; prevSplit?: Record<string, SetSplit>; fmt: (v: number) => string; /** kreska celu wiersza (serie: cel części) */ markOf?: (part: string) => number; parts?: readonly string[] }) {
  const th = useTheme(); const cur = curSplit ? splitTotals(curSplit) : curIn ?? {}; const prev = prevSplit ? splitTotals(prevSplit) : prevIn ?? {};
  const rows = parts.filter(mu => (cur[mu] ?? 0) > 0 || (prev[mu] ?? 0) > 0); const max = Math.max(1, ...rows.map(mu => Math.max(markOf?.(mu) ?? 0, cur[mu] ?? 0, prev[mu] ?? 0)));
  if (!rows.length) return <Muted style={{ ...font('footnote') }}>{t('Brak serii w tym i poprzednim tygodniu.')}</Muted>;
  const n1 = t('Ten tydzień'), n2 = t('Poprzedni tydzień'); const prevEmpty = !rows.some(mu => (prev[mu] ?? 0) > 0);
  return <>{rows.map(mu => { const c = cur[mu] ?? 0, p = prev[mu] ?? 0; const mark = markOf?.(mu); const label = t(mu); const sp = curSplit ? curSplit[mu] ?? emptySplit() : undefined; const ind = sp?.indirectWeighted ?? 0;
    const shown = sp ? splitText(sp, mark) : fmt(c); const bid = curSplit ? 'cbar' : 'cvol'; const kind = curSplit ? 'sets' : 'vol'; /* serie / objętość: osobne testID */ const pv = prevText(p, fmt, prevEmpty);
    return (
    <View accessibilityLanguage={lang()} testID={`crow-${kind}-${mu}`} key={mu} style={{ marginBottom: 10 }} accessible accessibilityLabel={`${label}: ${n1} ${sp ? splitLabel(sp) : fmt(c)}, ${n2} ${pv}${mark ? ', ' + t('cel {n}', { n: fmt(mark) }) : ''}${mark && c >= mark ? ', ' + t('co najmniej {n}', { n: mark }) : ''}`}>
      <Txt style={{ ...font('callout') }}>{label}</Txt>
      <PeriodLine n={1} id={`${kind}-${mu}`} name={n1} text={shown}>
        <View style={{ height: BAR_H, backgroundColor: th.line, borderRadius: BAR_H / 2 }}>
          <View testID={`${bid}-${mu}`} style={{ width: `${Math.round(100 * c / max)}%`, height: BAR_H, borderRadius: BAR_H / 2, overflow: 'hidden', flexDirection: 'row' }}>
            {c - ind > 0 ? <Seg testID={`${bid}-${mu}-direct`} width={`${(100 * (c - ind)) / c}%`} color={th.accent} /> : null}
            {ind > 0 ? <Seg testID={`${bid}-${mu}-indirect`} width={`${(100 * ind) / c}%`} color={th.accent} indirect edge={c - ind > 0} /> : null}
          </View>
          {c === 0 ? <View testID={`${bid}-${mu}-zero`} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: th.accent, borderRadius: BAR_H / 2 }} /> : null}
          {mark ? <View testID={`mark-${mu}`} style={{ position: 'absolute', left: `${Math.round(100 * mark / max)}%`, top: -3, width: 2, height: 14, marginLeft: -1, backgroundColor: th.text }} /> : null}
        </View>
      </PeriodLine>
      <PeriodLine n={2} id={`${kind}-${mu}`} name={n2} text={pv}><HatchBar testID={`${bid}-prev-${mu}`} pct={Math.round(100 * p / max)} /></PeriodLine>
    </View>); })}</>;
}
