import { useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';

/**
 * Runda 28: bez <Redirect> (replace dokładał drugi zestaw zakładek na stos). Wracamy do ekranu pod spodem — przy zimnym
 * starcie to zakładki z unstable_settings — a gdy nie ma dokąd, zastępujemy ekranem głównym.
 */
export function useLeave() {
  const router = useRouter();
  useFocusEffect(useCallback(() => { if (router.canGoBack()) router.back(); else router.replace('/'); }, [router]));
}
