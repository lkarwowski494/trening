import React from 'react';
import { View } from 'react-native';
import { useTheme, F } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';
import { fmtNum, volOut } from '@/lib/units';
import { Muted, Txt, monoSafe } from '@/components/ui';
import type { MuscleRow, SetRow } from '@/lib/progress';
import { SECONDARY_SHARE, splitText, splitLabel, type SetSplit } from '@/lib/setSplit';

/*
 * Słupki „Progresji” i „Ten tydzień” (docs/22 krok 3 pkt 4–5, 11.10.2026): część wykonana i zaplanowana innym kolorem, rozdzielone cienką kreską
 * (podziałka), z legendą „wykonane / zaplanowane”; opcjonalna pionowa kreska celu. Kolor nigdy nie jest jedynym nośnikiem — liczby „x + y” stoją obok.
 */
/** Odcinek paska: pełny kolor (bezpośrednie / wykonane / zaplanowane) albo POŚREDNI — ten sam kolor, ale półprzezroczysty z obrysem (13.10.2026): rozróżnienie
 * nie opiera się na kolorze (wypełnienie + obrys), czytelne w jasnym i ciemnym motywie (obrys = kolor tekstu paska, wypełnienie 35% krycia). */
export function Seg({ width, color, indirect, testID, edge }: { width: `${number}%`; color: string; indirect?: boolean; testID?: string; edge?: boolean }) {
  if (!indirect) return <View testID={testID} style={{ width, backgroundColor: color }} />;
  return <View testID={testID} style={{ width, borderWidth: 1.5, borderColor: color, borderLeftWidth: edge ? 1.5 : 0 }}><View testID={testID ? `${testID}-fill` : undefined} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: color, opacity: 0.35 }} /></View>;
}
export function SegBar({ done, doneIndirect = 0, planned = 0, plannedIndirect = 0, max, mark, testID, height = 6 }: { done: number; /** część `done` pochodząca z serii pośrednich (już z wagą) — rysowana jako odcinek pośredni */ doneIndirect?: number; planned?: number; plannedIndirect?: number; max: number; mark?: number; testID?: string; height?: number }) {
  const th = useTheme(); const w = (v: number) => `${Math.max(0, Math.min(100, (100 * v) / (max || 1)))}%` as const;
  const dd = Math.max(0, done - doneIndirect), pd = Math.max(0, planned - plannedIndirect); const id = (k: string) => (testID ? `${testID}-${k}` : undefined);
  const sep = { borderLeftWidth: 2, borderLeftColor: th.surface };
  return (
    <View testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ height, backgroundColor: th.line, borderRadius: height / 2 }}>
      <View style={{ flexDirection: 'row', height, borderRadius: height / 2, overflow: 'hidden' }}>
        {/* testID `-done` = cały odcinek wykonanych (kontener), `-done-direct` / `-done-indirect` — jego części */}
        <View testID={id('done')} style={{ width: w(done), flexDirection: 'row' }}>
          {dd > 0 ? <Seg testID={id('done-direct')} width={`${done > 0 ? (100 * dd) / done : 0}%`} color={th.accent} /> : null}
          {doneIndirect > 0 ? <Seg testID={id('done-indirect')} width={`${(100 * doneIndirect) / done}%`} color={th.accent} indirect edge={dd > 0} /> : null}
        </View>
        {planned > 0 ? <View testID={id('planned')} style={[{ width: w(planned), flexDirection: 'row' }, done > 0 ? sep : null]}>
          {pd > 0 ? <Seg testID={id('planned-direct')} width={`${(100 * pd) / planned}%`} color={th.band} /> : null}
          {plannedIndirect > 0 ? <Seg testID={id('planned-indirect')} width={`${(100 * plannedIndirect) / planned}%`} color={th.band} indirect edge={pd > 0} /> : null}
        </View> : null}
      </View>
      {mark ? <View testID={id('mark')} style={{ position: 'absolute', left: w(mark), top: -3, width: 2, height: height + 6, marginLeft: -1, backgroundColor: th.text }} /> : null}
    </View>);
}

/** Legenda: dwa kolory z nazwami (nie sam kolor). */
export function SegLegend({ planned = true }: { planned?: boolean }) {
  const th = useTheme();
  return (
    <View testID="seg-legend" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 2, marginTop: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ width: 12, height: 8, borderRadius: 2, backgroundColor: th.accent }} /><Muted style={{ fontSize: 12 }}>{t('wykonane')}</Muted></View>
      {planned ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ width: 12, height: 8, borderRadius: 2, backgroundColor: th.band }} /><Muted style={{ fontSize: 12 }}>{t('zaplanowane')}</Muted></View> : null}
    </View>);
}

/** Legenda odcinków serii na partię: bezpośrednie (pełne wypełnienie) i pośrednie (półprzezroczyste z obrysem; pomocnicze, liczone po SECONDARY_SHARE). */
export function IndirectLegend() {
  const th = useTheme();
  return (
    <View testID="seg-legend-indirect" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 2, marginTop: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ width: 12, height: 8, borderRadius: 2, backgroundColor: th.accent }} /><Muted style={{ fontSize: 12 }}>{t('bezpośrednie')}</Muted></View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ width: 12, height: 8, borderRadius: 2, borderWidth: 1.5, borderColor: th.accent, overflow: 'hidden' }}><View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: th.accent, opacity: 0.35 }} /></View><Muted style={{ fontSize: 12 }}>{t('pośrednie (pomocnicze, po {h})', { h: fmtNum(SECONDARY_SHARE, 1) })}</Muted></View>
    </View>);
}

/** Objętość w jednostce wyświetlania, krótko („12,4k” od 10 000) — jak per partia w Postępach. */
export const fmtVolShort = (v: number) => { const x = volOut(v); return x >= 10000 ? `${fmtNum(x / 1000, 1)}k` : fmtNum(Math.round(x)); };
export const fmtSets = (v: number) => fmtNum(v, 1);

/** Wiersz słupka: `label` już przetłumaczony; `mark` — kreska celu tego wiersza (serie: cel części — ręczny albo automatyczny). */
export type BarRow = { key: string; label: string; done: number; planned: number; prev: number; up: boolean; mark?: number; /** serie: podział wykonanych / zaplanowanych na bezpośrednie i pośrednie (13.10.2026) */ doneSplit?: SetSplit; plannedSplit?: SetSplit };
/** Objętość per partia. */
export const volumeBars = (rows: MuscleRow[]): BarRow[] => rows.map(r => ({ key: r.muscle, label: t(r.muscle), done: r.doneVolume, planned: r.plannedVolume, prev: r.prevVolume, up: r.volumeUp }));
/** Serie per partia; `goals` — czy rysować kreski celu (miesiąc: bez kresek). */
export const setBars = (rows: SetRow[], goals: boolean): BarRow[] => rows.map(r => ({ key: r.part, label: t(r.part), done: r.doneSets, planned: r.plannedSets, prev: r.prevSets, up: r.setsUp, doneSplit: r.doneSplit, plannedSplit: r.plannedSplit, ...(goals ? { mark: r.goal } : {}) }));

/** Wiersze partii: bieżący okres (wykonane + zaplanowane, słupek dwukolorowy) i poprzedni (cienki słupek); ▲ — wzrost. `metric` — co jest słupkiem; kreska celu — osobna dla każdego wiersza. */
export function MuscleRows({ rows, metric, showPrev = true }: { rows: BarRow[]; metric: 'volume' | 'sets'; /** false — „Ten tydzień”: tylko bieżący tydzień, bez poprzedniego */ showPrev?: boolean }) {
  const th = useTheme(); const fmt = metric === 'volume' ? fmtVolShort : fmtSets;
  const list = rows.filter(r => r.done + r.planned + (showPrev ? r.prev : 0) > 0); const max = Math.max(1, ...list.map(r => Math.max(r.mark ?? 0, r.done + r.planned, showPrev ? r.prev : 0)));
  if (!list.length) return <Muted style={{ fontSize: 13 }}>{showPrev ? t('Brak serii w tym i poprzednim okresie.') : t('Brak serii w tym tygodniu.')}</Muted>;
  return <>{list.map(r => {
    const ds = r.doneSplit; /* serie: podpis „6 + 1,5 pośrednio (3 serie) [+ zaplanowane] / cel”; objętość: liczby jak dotąd */
    const value = (ds ? splitText(ds) : fmt(r.done)) + (r.planned > 0 ? ` + ${fmt(r.planned)}` : '') + (ds && r.mark ? ` / ${fmt(r.mark)}` : '');
    const label = `${r.label}: ${ds ? splitLabel(ds) : fmt(r.done)}${r.planned > 0 ? ` + ${fmt(r.planned)} (${t('wykonane')} + ${t('zaplanowane')})` : ''}${ds && r.mark ? `, ${t('cel {n}', { n: fmt(r.mark) })}` : ''}${showPrev ? `, ${t('poprz.')} ${fmt(r.prev)}${r.up ? ', ' + t('więcej niż poprzednio') : ''}` : ''}${r.mark && r.done + r.planned >= r.mark ? ', ' + t('co najmniej {n}', { n: r.mark }) : ''}`;
    return (
      <View accessibilityLanguage={lang()} key={r.key} testID={`prow-${metric}-${r.key}`} accessible accessibilityLabel={label} style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <Txt style={{ fontSize: 14, flexShrink: 1 }}>{showPrev && r.up ? '▲ ' : ''}{r.label}</Txt>
          <Muted style={{ fontSize: 13, fontFamily: F.mono, flexShrink: 1, textAlign: 'right' }}>{monoSafe(value) /* A11-11: litery greckie krojem tekstu */}{showPrev ? <Muted style={{ fontSize: 12 }}> ({t('poprz.')} {fmt(r.prev)})</Muted> : null}</Muted>
        </View>
        <View style={{ marginTop: 4 }}><SegBar testID={`pbar-${metric}-${r.key}`} done={r.done} doneIndirect={ds?.indirectWeighted ?? 0} planned={r.planned} plannedIndirect={r.plannedSplit?.indirectWeighted ?? 0} max={max} mark={r.mark} /></View>
        {showPrev ? <View style={{ marginTop: 3, height: 3, borderRadius: 1.5, backgroundColor: th.line }}><View testID={`pprev-${metric}-${r.key}`} style={{ width: `${Math.min(100, (100 * r.prev) / max)}%`, height: 3, borderRadius: 1.5, backgroundColor: th.muted }} /></View> : null}
      </View>); })}</>;
}
