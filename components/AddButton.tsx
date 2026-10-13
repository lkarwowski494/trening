import React, { useMemo, useRef } from 'react';
import { Pressable, Text } from 'react-native';
import { useTheme, F } from '@/lib/theme';
import { lang } from '@/lib/i18n';
import { useOnce } from '@/components/ui';

/*
 * Wzorzec „dodawanie na liście” (właściciel, 13.10.2026; docs/32 wzorzec 4; HIG Toolbars — akcja „nowy” w przycisku paska u góry): ekrany list
 * (Szablony, Ćwiczenia, Miejsca, Gumy, Plan) mają „+” w prawym górnym rogu nagłówka, zawsze ten sam komponent, etykieta VoiceOver „Dodaj …”
 * (przekazana z ekranu przez t()). Dodawanie do edytowanego obiektu (ćwiczenie do treningu, seria) zostaje na dole listy. Pilnuje tests/interaction-guards.test.ts.
 */
export const ADD_TEST_ID = 'add-button';

export function AddButton({ label, hint, onPress, lock = true }: { label: string; hint?: string; onPress: () => void; /** blokada podwójnego tapnięcia (domyślnie tak); wyłączona tylko tam, gdzie akcja jest idempotentna (np. otwarcie listy w treści) */ lock?: boolean }) {
  const th = useTheme(); const once = useOnce();
  return <Pressable testID={ADD_TEST_ID} accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={label} accessibilityHint={hint} hitSlop={10} onPress={lock ? once(onPress) : onPress} style={{ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' }}>
    <Text accessibilityElementsHidden importantForAccessibility="no" maxFontSizeMultiplier={1.4} style={{ color: th.accent, fontSize: 30, lineHeight: 34, fontFamily: F.regular }}>+</Text>
  </Pressable>;
}

/** Opcje nagłówka z „+” po prawej. `label` null (np. limit planów) — bez przycisku. Użycie: `<Stack.Screen options={useAddHeader(t('Dodaj szablon'), add)} />`. */
export function useAddHeader(label: string | null, onPress: () => void, hint?: string, lock = true) {
  const th = useTheme(); const ref = useRef(onPress); ref.current = onPress;
  return useMemo(() => ({ headerRight: label ? () => <AddButton label={label} hint={hint} lock={lock} onPress={() => ref.current()} /> : () => null }), [th, label, hint, lock]);
}
