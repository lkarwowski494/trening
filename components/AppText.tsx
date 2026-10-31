/*
 * Tekst aplikacji (28.10.2026, telefon właściciela, build 1032; docs/18, docs/40): `Text` z React Native bez `maxFontSizeMultiplier` rośnie z Dynamic Type
 * do 357% (tabela mnożników RN: „Większe rozmiary dostępności” AX5), a układ ekranów jest liczony na limit DEC-10 (200%) — tekst wychodzi poza ramkę i jest ucinany.
 * Ten komponent ustawia domyślny limit TEXT_SCALE_MAX; rola o innym limicie (liczby 130%, pasek 125%, znaki-ikony 140%) podaje własny prop, który ma pierwszeństwo.
 * Cała aplikacja importuje Text stąd, nie z 'react-native' (strażnik: eslint no-restricted-imports + tests/matrix-a11y.test.tsx).
 */
import React from 'react';
import { Text as RNText, type TextProps } from 'react-native';
import { TEXT_SCALE_MAX } from '@/lib/theme';

export function Text(props: TextProps & { ref?: React.Ref<RNText> }) {
  return <RNText {...props} maxFontSizeMultiplier={props.maxFontSizeMultiplier ?? TEXT_SCALE_MAX} />; /* `?? `: jawne undefined (np. Txt bez limitu) też dostaje domyślny */
}
export type { TextProps };
