import React from 'react';
import { Text, View } from 'react-native';
import { useTheme, F, TEXT_SCALE_MAX } from '@/lib/theme';
import { weekProgress, type WeekProgress } from '@/lib/motif';
import { t as tr, lang } from '@/lib/i18n';
import { PlateStack } from '@/components/Motif';

/**
 * Postęp tygodnia (korekta właściciela 09.10.2026 ok. 17:00, zamiast sztangi): N stosów talerzy obok siebie (N = dni treningowe w planie
 * bieżącego tygodnia, lib/motif.weekProgress), pełny stos = trening z planu zrobiony, obwódka = jeszcze nie; obok „60% planu tygodnia (3 z 5)”.
 * Tylko przy aktywnym planie (bez planu — nic). Stosy to dekoracja; liczby czyta VoiceOver z etykiety całości.
 */
export function WeekStacks({ progress: given }: { /** domyślnie bieżący tydzień — komponent sam liczy dane, można go wstawić w dowolne miejsce */ progress?: WeekProgress | null }) {
  const th = useTheme(); const p = given === undefined ? weekProgress() : given; if (!p) return null;
  const txt = tr('{p}% planu tygodnia ({done} z {n})', { p: p.pct, done: p.done, n: p.total });
  return (
    <View testID="week-stacks" accessible accessibilityRole="text" accessibilityLanguage={lang()} accessibilityLabel={tr('Postęp tygodnia: {p}% planu, zrobione {done} z {n} treningów z planu', { p: p.pct, done: p.done, n: p.total })}
      style={{ flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'wrap', columnGap: 12, rowGap: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
        {p.stacks.map((on, i) => <PlateStack key={i} testID={`week-stack-${i}`} filled={on} bg={th.bg} th={th} />)}
      </View>
      <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, fontFamily: F.semibold, fontSize: 15 }}>{txt}</Text>
    </View>);
}
