import React, { useMemo, useRef } from 'react';
import { useRouter } from 'expo-router';
import { HeaderButton } from '@/components/DraftHeader';
import { t } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';

/*
 * Zasada projektowa (właściciel, 13.10.2026; docs/32 wzorzec 1, docs/22): każde okno wysuwane z dołu / modalne (trasa z presentation 'modal', arkusz, <Modal>)
 * ma widoczny, spójny przycisk zamknięcia w nagłówku — „Anuluj” po LEWEJ (HIG Sheets; jak „Anuluj” edytorów na szkicu, components/DraftHeader.tsx),
 * ten sam komponent (HeaderButton: pole dotyku 44 pt, limit powiększenia tekstu), testID `close-modal`. Gest w dół zostaje jako dodatek.
 * Ten plik to jedyne miejsce, które go rysuje; pilnuje tests/close-button-guard.test.tsx.
 */
export const CLOSE_TEST_ID = 'close-modal';

/** Przycisk „Anuluj” (lewa strona nagłówka okna). */
export function CloseButton({ onPress }: { onPress: () => void }) {
  return <HeaderButton testID={CLOSE_TEST_ID} title={t('Anuluj')} onPress={onPress} />;
}

/** Zamknięcie okna trasy: wstecz, a gdy nie ma ekranu pod spodem (link z zewnątrz) — ekran główny. */
export function useDismiss(): () => void {
  const router = useRouter();
  return () => { if (router.canGoBack()) router.back(); else router.replace('/'); };
}

/**
 * Opcje nagłówka okna modalnego z przyciskiem „Anuluj” po lewej. `onClose` domyślnie zamyka okno (useDismiss); okna z blokadą podwójnego
 * tapnięcia (picker, swap, pick-template) podają własną funkcję. Użycie: `<Stack.Screen options={useCloseHeader()} />`.
 */
export function useCloseHeader(onClose?: () => void) {
  const dismiss = useDismiss(); const th = useTheme();
  const ref = useRef<() => void>(dismiss); ref.current = onClose ?? dismiss;
  return useMemo(() => ({ headerLeft: () => <CloseButton onPress={() => ref.current()} /> }), [th]); // eslint-disable-line react-hooks/exhaustive-deps
}
