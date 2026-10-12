import React from 'react';
import { View } from 'react-native';
import { useTheme, F } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';
import { fmtNum, volOut } from '@/lib/units';
import { Muted, Txt } from '@/components/ui';
import type { MuscleRow, SetRow } from '@/lib/progress';
import { partLabel } from '@/lib/setParts';

/*
 * Słupki „Progresji” i „Ten tydzień” (docs/22 krok 3 pkt 4–5, 11.10.2026): część wykonana i zaplanowana innym kolorem, rozdzielone cienką kreską
 * (podziałka), z legendą „wykonane / zaplanowane”; opcjonalna pionowa kreska celu. Kolor nigdy nie jest jedynym nośnikiem — liczby „x + y” stoją obok.
 */
export function SegBar({ done, planned = 0, max, mark, testID, height = 6 }: { done: number; planned?: number; max: number; mark?: number; testID?: string; height?: number }) {
  const th = useTheme(); const w = (v: number) => `${Math.max(0, Math.min(100, (100 * v) / (max || 1)))}%` as const;
  return (
    <View testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ height, backgroundColor: th.line, borderRadius: height / 2 }}>
      <View style={{ flexDirection: 'row', height, borderRadius: height / 2, overflow: 'hidden' }}>
        <View testID={testID ? `${testID}-done` : undefined} style={{ width: w(done), backgroundColor: th.accent }} />
        {planned > 0 ? <View testID={testID ? `${testID}-planned` : undefined} style={{ width: w(planned), backgroundColor: th.band, borderLeftWidth: done > 0 ? 2 : 0, borderLeftColor: th.surface }} /> : null}
      </View>
      {mark ? <View testID={testID ? `${testID}-mark` : undefined} style={{ position: 'absolute', left: w(mark), top: -3, width: 2, height: height + 6, marginLeft: -1, backgroundColor: th.text }} /> : null}
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

/** Objętość w jednostce wyświetlania, krótko („12,4k” od 10 000) — jak per partia w Postępach. */
export const fmtVolShort = (v: number) => { const x = volOut(v); return x >= 10000 ? `${fmtNum(x / 1000, 1)}k` : fmtNum(Math.round(x)); };
export const fmtSets = (v: number) => fmtNum(v, 1);

/** Wiersz słupka: `label` już przetłumaczony; `mark` — kreska celu tego wiersza (serie: cel części — ręczny albo automatyczny). */
export type BarRow = { key: string; label: string; done: number; planned: number; prev: number; up: boolean; mark?: number };
/** Objętość per partia zbiorcza (bez rozbicia — rozbicie dotyczy tylko serii). */
export const volumeBars = (rows: MuscleRow[]): BarRow[] => rows.map(r => ({ key: r.muscle, label: t(r.muscle), done: r.doneVolume, planned: r.plannedVolume, prev: r.prevVolume, up: r.volumeUp }));
/** Serie per część (z rozbiciem barków i pleców); `goals` — czy rysować kreski celu (miesiąc: bez kresek). */
export const setBars = (rows: SetRow[], goals: boolean): BarRow[] => rows.map(r => ({ key: r.part, label: t(partLabel(r.part)), done: r.doneSets, planned: r.plannedSets, prev: r.prevSets, up: r.setsUp, ...(goals ? { mark: r.goal } : {}) }));

/** Wiersze partii: bieżący okres (wykonane + zaplanowane, słupek dwukolorowy) i poprzedni (cienki słupek); ▲ — wzrost. `metric` — co jest słupkiem; kreska celu — osobna dla każdego wiersza. */
export function MuscleRows({ rows, metric, showPrev = true }: { rows: BarRow[]; metric: 'volume' | 'sets'; /** false — „Ten tydzień”: tylko bieżący tydzień, bez poprzedniego */ showPrev?: boolean }) {
  const th = useTheme(); const fmt = metric === 'volume' ? fmtVolShort : fmtSets;
  const list = rows.filter(r => r.done + r.planned + (showPrev ? r.prev : 0) > 0); const max = Math.max(1, ...list.map(r => Math.max(r.mark ?? 0, r.done + r.planned, showPrev ? r.prev : 0)));
  if (!list.length) return <Muted style={{ fontSize: 13 }}>{showPrev ? t('Brak serii w tym i poprzednim okresie.') : t('Brak serii w tym tygodniu.')}</Muted>;
  return <>{list.map(r => {
    const value = r.planned > 0 ? `${fmt(r.done)} + ${fmt(r.planned)}` : fmt(r.done);
    const label = `${r.label}: ${value}${r.planned > 0 ? ` (${t('wykonane')} + ${t('zaplanowane')})` : ''}${showPrev ? `, ${t('poprz.')} ${fmt(r.prev)}${r.up ? ', ' + t('więcej niż poprzednio') : ''}` : ''}${r.mark && r.done + r.planned >= r.mark ? ', ' + t('co najmniej {n}', { n: r.mark }) : ''}`;
    return (
      <View accessibilityLanguage={lang()} key={r.key} testID={`prow-${metric}-${r.key}`} accessible accessibilityLabel={label} style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <Txt style={{ fontSize: 14, flexShrink: 1 }}>{showPrev && r.up ? '▲ ' : ''}{r.label}</Txt>
          <Muted style={{ fontSize: 13, fontFamily: F.mono, flexShrink: 1, textAlign: 'right' }}>{value}{showPrev ? <Muted style={{ fontSize: 12 }}> ({t('poprz.')} {fmt(r.prev)})</Muted> : null}</Muted>
        </View>
        <View style={{ marginTop: 4 }}><SegBar testID={`pbar-${metric}-${r.key}`} done={r.done} planned={r.planned} max={max} mark={r.mark} /></View>
        {showPrev ? <View style={{ marginTop: 3, height: 3, borderRadius: 1.5, backgroundColor: th.line }}><View testID={`pprev-${metric}-${r.key}`} style={{ width: `${Math.min(100, (100 * r.prev) / max)}%`, height: 3, borderRadius: 1.5, backgroundColor: th.muted }} /></View> : null}
      </View>); })}</>;
}
