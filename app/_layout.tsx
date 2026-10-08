import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ActivityIndicator, View, Text, Pressable } from 'react-native';
import { init, usePrefsTick, flush, refreshViews, autoFinishStale, resolveColdStopwatch, fmtTime, fmtDate, getState } from '@/lib/store';
import { Alert } from 'react-native';
import { onWorkoutSaved } from '@/lib/backup';
import type { Workout } from '@/lib/seed';
import { AppState } from 'react-native';
import { t } from '@/lib/i18n';
import * as timer from '@/lib/timer';
import { useTheme, F, FONT_FILES } from '@/lib/theme';
import * as Font from 'expo-font';

/** Kroje marki (docs/16). Błąd lub brak odpowiedzi w 3 s nie blokuje startu — zostaje krój systemowy. */
const loadFonts = () => { let to: ReturnType<typeof setTimeout> | undefined; return Promise.race([Font.loadAsync(FONT_FILES), new Promise(r => { to = setTimeout(r, 3000); })]).catch(() => {}).finally(() => clearTimeout(to)); };

// Runda 27: link otwierający ekran ze stosu (np. trening://template/…) kładzie pod nim zakładki — zawsze jest droga powrotu.
export const unstable_settings = { initialRouteName: '(tabs)' };

export default function RootLayout() {
  const th = useTheme(); const [ready, setReady] = useState(false); const [err, setErr] = useState<string | null>(null);
  // Runda 69: trening porzucony ponad 6 h temu zapisuje się sam (koniec = ostatnia odhaczona seria) — przy starcie i powrocie z tła.
  const autoSaved = (w: Workout | null) => { if (!w) return; timer.stop().catch(() => {}); timer.stopSet().catch(() => {}); timer.cancelStaleReminder().catch(() => {}); onWorkoutSaved(w).catch(() => {});
    setTimeout(() => Alert.alert(t('Zapisałem trening'), t('Trening z {d} {s} nie miał aktywności od 6 godzin, więc zapisał się sam. Koniec: {e} (ostatnia seria). Znajdziesz go w Historii.', { d: fmtDate(w.startedAt), s: fmtTime(w.startedAt), e: fmtTime(w.finishedAt ?? w.startedAt) })), 500); };
  const start = () => { setErr(null); Promise.all([init(), loadFonts()]).then(() => { resolveColdStopwatch(); /* Q-002 */ autoSaved(autoFinishStale()); return timer.restore().catch(() => {}); }).then(() => setReady(true)).catch(e => setErr(e instanceof Error ? e.message : String(e))); };
  useEffect(start, []);
  /* T-051 (SDK 56+, audyt aktualizacji): expo-router trzyma ekran powitalny, dopóki nie zamontuje się nawigator — ekran błędu startu
   * (poniżej) nie ma nawigatora, więc zostałby pod logo i aplikacja wyglądałaby na zawieszoną. Przy błędzie chowamy go sami. */
  useEffect(() => { if (err) SplashScreen.hideAsync().catch(() => {}); }, [err]);
  // Zapis wymuszony przy wyjściu do tła — debounce 300 ms nie może zgubić ostatniej zmiany, gdy system ubije apkę.
  useEffect(() => { const sub = AppState.addEventListener('change', st => { if (st !== 'active') flush(); else { const w = autoFinishStale(); /* runda 74 (audyt): stoper zdjęty z zapisu przez cichy zapis (Q-011, seria z celem odhaczona) nie liczy dalej w pamięci */ if (!w && timer.S.on && !getState().timer?.setStartAt) timer.stopSet().catch(() => {}); autoSaved(w); timer.onForeground(); refreshViews(); } }); return () => sub.remove(); }, []);
  // Błąd startu (np. baza niedostępna) — komunikat i ponowienie zamiast wiecznego kółka (runda 2).
  if (err) return <View style={{ flex: 1, backgroundColor: th.bg, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }}><Text style={{ color: th.text, fontSize: 17, textAlign: 'center' }}>{t('Nie udało się otworzyć danych.')}</Text><Text style={{ color: th.muted, textAlign: 'center' }}>{err}</Text><Pressable accessibilityRole="button" onPress={start} style={{ padding: 12 }}><Text style={{ color: th.accent, fontSize: 16, fontFamily: F.semibold }}>{t('Spróbuj ponownie')}</Text></Pressable></View>;
  if (!ready) return <View style={{ flex: 1, backgroundColor: th.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={th.accent} /></View>;
  return <Root />;
}

/** Osobny komponent, bo useTick() wymaga zainicjowanego stanu; odświeża tytuły po zmianie języka. */
function Root() {
  const th = useTheme(); usePrefsTick();
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerStyle: { backgroundColor: th.bg }, headerTintColor: th.text, headerTitleStyle: { fontFamily: F.semibold }, headerShadowVisible: false, contentStyle: { backgroundColor: th.bg }, headerBackTitle: t('Wróć') }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="picker" options={{ presentation: 'modal', title: t('Wybierz ćwiczenie') }} />
        <Stack.Screen name="swap" options={{ presentation: 'modal', title: t('Zamień ćwiczenie') }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="_sitemap" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="template/[id]" options={{ title: t('Szablon') }} />
        <Stack.Screen name="plan" options={{ title: t('Plan tygodnia') }} />
        <Stack.Screen name="generator" options={{ title: t('Generator planu') }} />
        <Stack.Screen name="guide" options={{ title: t('Przewodnik') }} />
        <Stack.Screen name="reorder" options={{ title: t('Kolejność ćwiczeń') }} />
        <Stack.Screen name="exercise/[id]" options={{ title: t('Ćwiczenie') }} />
        <Stack.Screen name="history/[id]" options={{ title: t('Sesja') }} />
        <Stack.Screen name="history/add" options={{ title: t('Trening wstecz') }} />
        <Stack.Screen name="history/edit/[id]" options={{ title: t('Edycja sesji'), gestureEnabled: false /* docs/12: szkic nie przepada gestem — Anuluj/Zapisz w nagłówku */ }} />
        <Stack.Screen name="more/bands" options={{ title: t('Gumy') }} />
        <Stack.Screen name="more/progress" options={{ title: t('Postępy') }} />
        <Stack.Screen name="more/settings" options={{ title: t('Ustawienia') }} />
        <Stack.Screen name="more/backup" options={{ title: t('Backup') }} />
        <Stack.Screen name="more/language" options={{ title: t('Język') }} />
        <Stack.Screen name="more/locations" options={{ title: t('Miejsca treningu') }} />
        <Stack.Screen name="more/location/[id]" options={{ title: t('Miejsce') }} />
      </Stack>
    </>
  );
}
