import React from 'react';
import { Text, View } from 'react-native';
import { useTheme, F, TEXT_SCALE_MAX } from '@/lib/theme';
import { PLATE_HEIGHT, weekBar, type WeekBar } from '@/lib/motif';
import { t as tr, tp, lang } from '@/lib/i18n';
import { Plate, a11yHidden } from '@/components/Motif';

/** Postęp tygodnia jako ładowana sztanga (karta „Dziś”): talerze z lib/motif.weekBar, obok liczba „x z y” (albo liczba treningów bez planu). */
export function WeekBarbell({ bar: given, size = 36 }: { /** domyślnie bieżący tydzień (lib/motif.weekBar) — komponent sam liczy dane, można go wstawić w dowolne miejsce */ bar?: WeekBar; size?: number }) {
  const th = useTheme(); const bar = given ?? weekBar(); const bg = th.surface;
  const label = bar.mode === 'plan' ? tr('Postęp tygodnia: zrobione {done} z {n} treningów z planu', { done: bar.done, n: bar.total }) : tr('Treningi w tym tygodniu: {n}', { n: bar.total });
  const txt = bar.mode === 'plan' ? tr('{done} z {n}', { done: bar.done, n: bar.total }) : (n => `${n} ${tp(n, 'trening|treningi|treningów')}`)(bar.total);
  return (
    <View testID="week-barbell" accessible accessibilityRole="image" accessibilityLanguage={lang()} accessibilityLabel={label} style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
      <View {...a11yHidden} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, height: size }}>
        <View style={{ width: 16, height: 6, borderRadius: 2, backgroundColor: th.text }} />
        <View style={{ width: 4, height: 16, borderRadius: 1.5, backgroundColor: th.text, marginEnd: 2 }} />
        {bar.plates.map((p, i) => <Plate key={i} testID={`week-plate-${i}`} color={p.color} loaded={p.loaded} h={Math.round(size * PLATE_HEIGHT[p.color])} bg={bg} th={th} />)}
        <View style={{ width: 4, height: 12, borderRadius: 1.5, backgroundColor: th.text, marginStart: 2 }} />
        <View style={{ width: 22, height: 6, borderRadius: 2, backgroundColor: th.muted }} />
      </View>
      <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, fontFamily: F.semibold, fontSize: 15 }}>{txt}</Text>
    </View>);
}

