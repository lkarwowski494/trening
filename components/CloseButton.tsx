import React, { useMemo, useRef } from 'react';
import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, F } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';

/*
 * Zasada projektowa (właściciel, 13.10.2026; docs/22 „Zasada: zamykanie okien”): każde okno wysuwane z dołu / modalne (trasa z presentation 'modal',
 * arkusz, <Modal>) ma widoczny, spójny przycisk zamknięcia w nagłówku — to samo miejsce (prawy górny róg), ta sama etykieta „Zamknij”, ten sam wygląd
 * i testID. Gest w dół zostaje jako dodatek. Ten plik to jedyne miejsce, które go rysuje; pilnuje tests/close-button-guard.test.tsx.
 */
export const CLOSE_TEST_ID = 'close-modal';

/** Przycisk „Zamknij” (tekst w kolorze akcentu, pole dotyku min. 44 pt dzięki hitSlop). */
export function CloseButton({ onPress }: { onPress: () => void }) {
  const th = useTheme();
  return <Pressable testID={CLOSE_TEST_ID} accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={t('Zamknij')} hitSlop={12} onPress={onPress} style={{ minHeight: 32, justifyContent: 'center' }}>
    <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: th.accent, fontSize: 17, fontFamily: F.regular }}>{t('Zamknij')}</Text>
  </Pressable>;
}

/** Zamknięcie okna trasy: wstecz, a gdy nie ma ekranu pod spodem (link z zewnątrz) — ekran główny. */
export function useDismiss(): () => void {
  const router = useRouter();
  return () => { if (router.canGoBack()) router.back(); else router.replace('/'); };
}

/**
 * Opcje nagłówka okna modalnego z przyciskiem „Zamknij” po prawej. `onClose` domyślnie zamyka okno (useDismiss); okna z blokadą podwójnego
 * tapnięcia (picker, swap, pick-template) podają własną funkcję. Użycie: `<Stack.Screen options={useCloseHeader()} />`.
 */
export function useCloseHeader(onClose?: () => void) {
  const dismiss = useDismiss(); const th = useTheme();
  const ref = useRef<() => void>(dismiss); ref.current = onClose ?? dismiss;
  return useMemo(() => ({ headerRight: () => <CloseButton onPress={() => ref.current()} /> }), [th]); // eslint-disable-line react-hooks/exhaustive-deps
}
