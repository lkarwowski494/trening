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

/** Przycisk akcji po prawej stronie nagłówka okna (np. „Zastosuj (2)” w oknie „Dostosuj do miejsca”): pogrubiony, jak „Zapisz” edytorów. */
export interface CloseHeaderAction { title: string; onPress: () => void; testID?: string }

/**
 * Opcje nagłówka okna modalnego z przyciskiem „Anuluj” po lewej. `onClose` domyślnie zamyka okno (useDismiss); okna z blokadą podwójnego
 * tapnięcia (picker, swap, pick-template) podają własną funkcję. `action` (opcjonalnie) — przycisk akcji po prawej (HeaderButton, bold).
 * Użycie: `<Stack.Screen options={useCloseHeader()} />`.
 */
export function useCloseHeader(onClose?: () => void, action?: CloseHeaderAction | null) {
  const dismiss = useDismiss(); const th = useTheme();
  const ref = useRef<() => void>(dismiss); ref.current = onClose ?? dismiss;
  const aref = useRef<(() => void) | undefined>(undefined); aref.current = action?.onPress;
  const title = action?.title; const testID = action?.testID;
  return useMemo(() => ({ headerLeft: () => <CloseButton onPress={() => ref.current()} />, headerRight: title ? () => <HeaderButton testID={testID} title={title} bold onPress={() => aref.current?.()} /> : undefined /* setOptions scala opcje — bez jawnego undefined stary przycisk zostałby po zdjęciu akcji */ }), [th, title, testID]); // eslint-disable-line react-hooks/exhaustive-deps
}
