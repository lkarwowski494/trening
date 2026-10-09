import React, { useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { Field } from '@/components/ui';
import { useTheme, F, NUM_SCALE_MAX, TEXT_SCALE_MAX } from '@/lib/theme';
import { weekdayLabels, weekdayNames } from '@/lib/calendar';
import { t, lang } from '@/lib/i18n';

/*
 * Wybór dni treningowych (decyzja właściciela 09.10.2026 wieczór, wariant B; docs/18) — jedno miejsce dla generatora (app/generator.tsx) i „Planu
 * z moich szablonów” (components/OwnPlan.tsx). 7 przycisków od poniedziałku (tydzień w aplikacji zawsze od poniedziałku — lib/calendar weekdayLabels),
 * skróty dni i pełne nazwy z Intl (bez własnych tłumaczeń). Przełączanie dowolne; liczba zaznaczonych spoza [min, max] — komunikat, a ekran
 * nie pokazuje podglądu ani zapisu (opcja A w raporcie; odrzucona B: blokada odznaczania/zaznaczania na granicy).
 * Dostępność: rola „switch” ze stanem „checked” (jak przełączane chipy w ui.tsx), etykieta = pełna nazwa dnia, podpowiedź = nazwa pola; pole dotyku
 * ≥ DAY_TOUCH pt w obu wymiarach — gdy 7 przycisków się nie mieści (np. 320 pt), układ 4 + 3.
 */
/** Najmniejsze pole dotyku przycisku dnia (Apple HIG: 44 × 44 pt). */
export const DAY_TOUCH = 44;
const GAP = 4;
/** Ile kolumn: 7, gdy każdy przycisk ma ≥ DAY_TOUCH przy szerokości `w`; inaczej 4 (dwa rzędy: 4 + 3). */
export const dayCols = (w: number) => (7 * DAY_TOUCH + 6 * GAP <= w ? 7 : 4);
/** Czy liczba zaznaczonych dni mieści się w zakresie. */
export const daysOk = (days: readonly number[], min: number, max: number) => days.length >= min && days.length <= max;
/** Komunikat o dozwolonej liczbie dni (bez form mnogich: „Wybierz dni treningowe: od 2 do 6.”). */
export const daysRangeText = (min: number, max: number) => (min === max ? t('Wybierz dni treningowe: {n}.', { n: min }) : t('Wybierz dni treningowe: od {a} do {b}.', { a: min, b: max }));

export function DayPicker({ label, value, onChange, min, max }: { label: string; value: readonly number[]; onChange: (days: number[]) => void; min: number; max: number }) {
  const th = useTheme(); const win = useWindowDimensions(); const [w, setW] = useState(win.width - 28 /* Screen: paddingHorizontal 14 */);
  const cols = dayCols(w); const cell = (w - (cols - 1) * GAP) / cols; const short = weekdayLabels(); const long = weekdayNames();
  const toggle = (d: number) => onChange(value.includes(d) ? value.filter(x => x !== d) : [...value, d].sort((a, b) => a - b));
  const ok = daysOk(value, min, max);
  return (
    <Field label={label}>
      <View testID="day-picker" onLayout={e => setW(e.nativeEvent.layout.width)} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP }}>
        {short.map((s, d) => { const on = value.includes(d); return (
          <Pressable key={d} testID={`day-${d}`} accessibilityLanguage={lang()} accessibilityRole="switch" accessibilityLabel={long[d]} accessibilityHint={label} accessibilityState={{ checked: on }} onPress={() => toggle(d)}
            style={({ pressed }) => ({ width: cell, minHeight: DAY_TOUCH, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: on ? 2 : 1, borderColor: on ? th.accent : th.ctrlLine, backgroundColor: on ? th.accent : th.surface2, opacity: pressed ? 0.7 : 1 })}>
            <Text accessibilityLanguage={lang()} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} maxFontSizeMultiplier={NUM_SCALE_MAX} style={{ color: on ? th.accentInk : th.text, fontFamily: on ? F.semibold : F.regular, fontSize: 14, paddingHorizontal: 2 }}>{s}</Text>
          </Pressable>); })}
      </View>
      {ok ? null : <Text testID="day-picker-range" accessibilityLanguage={lang()} accessibilityLiveRegion="polite" maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, fontSize: 13, marginTop: 6, fontFamily: F.regular }}>{daysRangeText(min, max)}</Text>}
    </Field>
  );
}
