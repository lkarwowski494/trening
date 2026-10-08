import React from 'react';
import { View } from 'react-native';
import Svg, { Ellipse, Path, G } from 'react-native-svg';
import { useTheme } from '@/lib/theme';
import { t } from '@/lib/i18n';
import { fmtNum } from '@/lib/units';
import { MUSCLES } from '@/lib/seed';
import { PARTS, shadeLevel, shadeColor, rankedMuscles, type View as Side } from '@/lib/musclemap';
import { Muted } from '@/components/ui';

/*
 * Mapa mięśni (decyzja właściciela 08.10.2026): sylwetka przód i tył, partie zabarwione według serii roboczych w okresie podsumowania
 * (lib/musclemap.ts — skala względna, 4 stopnie). Dla VoiceOver jeden opis: partie z liczbą serii od największej.
 */
export function MuscleMap({ sets }: { sets: Partial<Record<string, number>> }) {
  const th = useTheme(); const max = Math.max(0, ...MUSCLES.map(m => sets[m] ?? 0)); const ranked = rankedMuscles(sets);
  const label = ranked.length ? t('Mapa mięśni: {list}', { list: ranked.map(([m, v]) => `${t(m)} ${fmtNum(v, 1)}`).join(', ') }) : t('Mapa mięśni: brak serii w tym okresie.');
  const side = (view: Side, dx: number) => (
    <G key={view}>{PARTS.filter(p => p.view === view).map((p, i) => {
      const lvl = p.muscle ? shadeLevel(sets[p.muscle] ?? 0, max) : 0;
      const fill = p.muscle == null ? th.surface2 : shadeColor(lvl, th.line, th.accent);
      return p.shapes.map((s, j) => 'e' in s
        ? <Ellipse key={`${i}-${j}`} cx={s.e[0] + dx} cy={s.e[1]} rx={s.e[2]} ry={s.e[3]} fill={fill} />
        : <Path key={`${i}-${j}`} d={s.d} translateX={dx} fill={fill} />);
    })}</G>);
  return (
    <View testID="muscle-map" accessible accessibilityRole="image" accessibilityLabel={label} style={{ marginTop: 12 }}>
      <Muted style={{ fontSize: 12, marginBottom: 6 }}>{t('Mapa mięśni')}</Muted>
      <View style={{ alignItems: 'center' }}>
        <Svg width="100%" height={220} viewBox="0 0 250 260" preserveAspectRatio="xMidYMid meet">{side('front', 0)}{side('back', 130)}</Svg>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 2 }}>
        <Muted style={{ fontSize: 12 }}>{t('Przód')}</Muted><Muted style={{ fontSize: 12 }}>{t('Tył')}</Muted>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 6 }}>
        <Muted style={{ fontSize: 12, marginRight: 4 }}>{t('mniej')}</Muted>
        {[0, 1, 2, 3, 4].map(l => <View key={l} style={{ width: 16, height: 10, borderRadius: 3, backgroundColor: shadeColor(l, th.line, th.accent) }} />)}
        <Muted style={{ fontSize: 12, marginLeft: 4 }}>{t('więcej')}</Muted>
      </View>
      <Muted style={{ fontSize: 12, marginTop: 6 }}>{t('Kolor względem partii z największą liczbą serii w tym okresie (partia główna 1 seria, pomocnicza 0,5). Szare — bez serii.')}</Muted>
    </View>
  );
}
