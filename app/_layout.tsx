import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ActivityIndicator, View, Text, Pressable } from 'react-native';
import { wallTs, init, usePrefsTick, flush, refreshViews, autoFinishStale, resolveColdStopwatch, fmtTime, fmtDate, getState, getNewerSchema } from '@/lib/store';
import { Alert } from 'react-native';
import { onWorkoutSaved, exportRawData, cleanShareLeftovers } from '@/lib/backup';
import { retryHealth } from '@/lib/health';
import { cancelLegacyReminders } from '@/lib/planReminder';
import { SCHEMA_VERSION, type Workout } from '@/lib/seed';
import { AppState } from 'react-native';
import { t, lang } from '@/lib/i18n';
import * as timer from '@/lib/timer';
import { useTheme, F, FONT_FILES } from '@/lib/theme';
import * as Font from 'expo-font';
import { Intro } from '@/components/Intro';
import { takeColdStart } from '@/lib/intro';

/** Kroje marki (docs/16). Błąd lub brak odpowiedzi w 3 s nie blokuje startu — zostaje krój systemowy. */
const loadFonts = () => { let to: ReturnType<typeof setTimeout> | undefined; return Promise.race([Font.loadAsync(FONT_FILES), new Promise(r => { to = setTimeout(r, 3000); })]).catch(() => {}).finally(() => clearTimeout(to)); };

// Runda 27: link otwierający ekran ze stosu (np. trening://template/…) kładzie pod nim zakładki — zawsze jest droga powrotu.
export const unstable_settings = { initialRouteName: '(tabs)' };

export default function RootLayout() {
  const th = useTheme(); const [ready, setReady] = useState(false); const [err, setErr] = useState<string | null>(null);
  /* Animacja przy starcie (decyzja 09.10.2026, components/Intro.tsx): tylko zimny start; dane ładują się równolegle (start() niżej). */
  const [intro, setIntro] = useState(() => takeColdStart(AppState.currentState));
  // Runda 69: trening porzucony ponad 6 h temu zapisuje się sam (koniec = ostatnia odhaczona seria) — przy starcie i powrocie z tła.
  const autoSaved = (w: Workout | null) => { if (!w) return; timer.stop().catch(() => {}); timer.stopSet().catch(() => {}); timer.cancelStaleReminder().catch(() => {}); onWorkoutSaved(w).catch(() => {});
    setTimeout(() => Alert.alert(t('Zapisałem trening'), t('Trening z {d} {s} nie miał aktywności od 6 godzin, więc zapisał się sam. Koniec: {e} (ostatnia seria). Znajdziesz go w Kalendarzu.' /* H2 (audyt 0.10): zakładka nazywa się Kalendarz */, { d: fmtDate(wallTs(w)), s: fmtTime(wallTs(w)), e: fmtTime(wallTs(w, w.finishedAt ?? w.startedAt)) })), 500); };
  const start = () => { setErr(null); Promise.all([init(), loadFonts()]).then(() => { resolveColdStopwatch(); /* Q-002 */ autoSaved(autoFinishStale()); retryHealth().catch(() => {}); /* J2: zapisy do Zdrowia, które się nie udały */ cleanShareLeftovers().catch(() => {}); /* SEC-09 */ cancelLegacyReminders().catch(() => {}); /* decyzja 09.10.2026: bez przypomnienia o podpisie — stare odwołane */ return timer.restore().catch(() => {}); }).then(() => setReady(true)).catch(e => setErr(e instanceof Error ? e.message : String(e))); };
  useEffect(start, []);
  /* T-051 (SDK 56+, audyt aktualizacji): expo-router trzyma ekran powitalny, dopóki nie zamontuje się nawigator — ekran błędu startu
   * (poniżej) nie ma nawigatora, więc zostałby pod logo i aplikacja wyglądałaby na zawieszoną. Przy błędzie chowamy go sami. */
  useEffect(() => { if (err) SplashScreen.hideAsync().catch(() => {}); }, [err]);
  // Zapis wymuszony przy wyjściu do tła — debounce 300 ms nie może zgubić ostatniej zmiany, gdy system ubije apkę.
  useEffect(() => { const sub = AppState.addEventListener('change', st => { if (st !== 'active') flush(); else { const w = autoFinishStale(); /* runda 74 (audyt): stoper zdjęty z zapisu przez cichy zapis (Q-011, seria z celem odhaczona) nie liczy dalej w pamięci */ if (!w && timer.S.on && !getState().timer?.setStartAt) timer.stopSet().catch(() => {}); autoSaved(w); timer.onForeground(); refreshViews(); retryHealth().catch(() => {}); /* J2 */ } }); return () => sub.remove(); }, []);
  /* Audyt 0.10 J1 (DAT-05): dane z nowszej wersji aplikacji — niczego nie nadpisujemy; „zaktualizuj” i wysłanie surowych danych. */
  const newer = err ? getNewerSchema() : null;
  const body = newer != null ? <View testID="newer-data" style={{ flex: 1, backgroundColor: th.bg, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }}>
    <Text accessibilityLanguage={lang()} accessibilityRole="header" style={{ color: th.text, fontSize: 18, textAlign: 'center', fontFamily: F.semibold }}>{t('Dane z nowszej wersji aplikacji — zaktualizuj aplikację')}</Text>
    <Text accessibilityLanguage={lang()} style={{ color: th.muted, textAlign: 'center' }}>{t('Dane w telefonie zapisała nowsza wersja (schemat {a}); ta wersja obsługuje do {b}. Niczego nie zmieniam — zainstaluj najnowszą wersję (TestFlight). Dane możesz też wysłać jako plik.', { a: newer, b: SCHEMA_VERSION })}</Text>
    <Pressable accessibilityLanguage={lang()} accessibilityRole="button" onPress={() => { exportRawData().then(ok => { if (!ok) Alert.alert(t('Nie udało się'), t('Spróbuj ponownie.')); }).catch(() => {}); }} style={{ padding: 12 }}><Text accessibilityLanguage={lang()} style={{ color: th.accent, fontSize: 16, fontFamily: F.semibold }}>{t('Wyślij dane')}</Text></Pressable>
    <Pressable accessibilityLanguage={lang()} accessibilityRole="button" onPress={start} style={{ padding: 12 }}><Text accessibilityLanguage={lang()} style={{ color: th.accent, fontSize: 16, fontFamily: F.semibold }}>{t('Spróbuj ponownie')}</Text></Pressable>
  </View>
  // Błąd startu (np. baza niedostępna) — komunikat i ponowienie zamiast wiecznego kółka (runda 2).
  : err ? <View style={{ flex: 1, backgroundColor: th.bg, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }}><Text accessibilityLanguage={lang()} style={{ color: th.text, fontSize: 17, textAlign: 'center' }}>{t('Nie udało się otworzyć danych.')}</Text><Text accessibilityLanguage={lang()} style={{ color: th.muted, textAlign: 'center' }}>{err}</Text><Pressable accessibilityLanguage={lang()} accessibilityRole="button" onPress={start} style={{ padding: 12 }}><Text accessibilityLanguage={lang()} style={{ color: th.accent, fontSize: 16, fontFamily: F.semibold }}>{t('Spróbuj ponownie')}</Text></Pressable></View>
  : !ready ? <View style={{ flex: 1, backgroundColor: th.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={th.accent} /></View>
  : <Root />;
  /* Na czas animacji treść pod nakładką jest ukryta dla VoiceOver (i dla Maestro — scenariusze czekają na tekst, aż animacja się skończy). */
  return <View style={{ flex: 1 }}>
    <View style={{ flex: 1 }} accessibilityElementsHidden={intro} importantForAccessibility={intro ? 'no-hide-descendants' : 'auto'}>{body}</View>
    {intro ? <Intro ready={ready || err != null} onDone={() => setIntro(false)} /> : null}
  </View>;
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
        <Stack.Screen name="generator" options={{ title: t('Generator szablonów i planu') }} />{/* audyt 0.10 UX-14: jedna nazwa (przewodnik, przycisk „Wygeneruj szablony i plan”) */}
        <Stack.Screen name="guide" options={{ title: t('Przewodnik') }} />
        <Stack.Screen name="reorder" options={{ title: t('Kolejność ćwiczeń') }} />
        <Stack.Screen name="exercise/[id]" options={{ title: t('Ćwiczenie') }} />
        <Stack.Screen name="history/[id]" options={{ title: t('Sesja') }} />
        <Stack.Screen name="history/add" options={{ title: t('Trening wstecz') }} />
        <Stack.Screen name="history/edit/[id]" options={{ title: t('Edycja sesji'), gestureEnabled: false /* docs/12: szkic nie przepada gestem — Anuluj/Zapisz w nagłówku */ }} />
        <Stack.Screen name="more/bands" options={{ title: t('Gumy') }} />
        <Stack.Screen name="more/progress" options={{ title: t('Postępy') }} />
        <Stack.Screen name="more/settings" options={{ title: t('Ustawienia') }} />
        <Stack.Screen name="more/bodymass" options={{ title: t('Masa ciała') }} />
        <Stack.Screen name="more/about" options={{ title: t('O aplikacji') }} />{/* SEC-08 */}
        <Stack.Screen name="more/licenses" options={{ title: t('Licencje open source') }} />{/* fala 2 audytu 0.10: masa ciała z datą */}
        <Stack.Screen name="more/backup" options={{ title: t('Kopia zapasowa') }} />{/* H2 (audyt 0.10): „Kopia zapasowa” */}
        <Stack.Screen name="more/language" options={{ title: t('Język') }} />
        <Stack.Screen name="more/locations" options={{ title: t('Miejsca i sprzęt') }} />
        <Stack.Screen name="more/location/[id]" options={{ title: t('Miejsce') }} />
      </Stack>
    </>
  );
}
