import React, { useEffect, useRef, useState } from 'react';
import { Stack, router, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ActivityIndicator, View, Text, Pressable } from 'react-native';
import { wallTs, init, usePrefsTick, flush, refreshViews, autoFinishStale, resolveColdStopwatch, fmtTime, fmtDate, getState, getNewerSchema, markBootStable, BOOT_STABLE_MS } from '@/lib/store';
import { Alert } from 'react-native';
import { onWorkoutSaved, exportRawData, cleanShareLeftovers } from '@/lib/backup';
import { markDoneEarly } from '@/lib/plan';
import { retryHealth } from '@/lib/health';
import { startAppleWatchLink } from '@/lib/watch/apple';
import { isFakeWatchBuild, startTestWatch } from '@/lib/watch/test-mode';
import { cancelLegacyReminders } from '@/lib/planReminder';
import { SCHEMA_VERSION, type Workout } from '@/lib/seed';
import { AppState } from 'react-native';
import { t, lang } from '@/lib/i18n';
import * as timer from '@/lib/timer';
import { restoreObjDrafts, dropRestored, type RestoredDraft } from '@/lib/draft';
import { useTheme, FONT_FILES, FW, font } from '@/lib/theme';
import { initA11yPrefs } from '@/lib/a11yPrefs';
import * as Font from 'expo-font';
import { Intro } from '@/components/Intro';
import { takeColdStart } from '@/lib/intro';
import { setAutoSavedNotice } from '@/lib/notices';
import { initEntitlements, refreshEntitlements } from '@/lib/entitlement';
import { StartError } from '@/components/StartError';

/** Kroje marki (docs/16). Błąd lub brak odpowiedzi w 3 s nie blokuje startu — zostaje krój systemowy. */
const loadFonts = () => { let to: ReturnType<typeof setTimeout> | undefined; return Promise.race([Font.loadAsync(FONT_FILES), new Promise(r => { to = setTimeout(r, 3000); })]).catch(() => {}).finally(() => clearTimeout(to)); };

// Runda 27: link otwierający ekran ze stosu (np. trening://template/…) kładzie pod nim zakładki — zawsze jest droga powrotu.
export const unstable_settings = { initialRouteName: '(tabs)' };

export default function RootLayout() {
  const th = useTheme(); const [ready, setReady] = useState(false); const [err, setErr] = useState<string | null>(null);
  /* Animacja przy starcie (decyzja 09.10.2026, components/Intro.tsx): tylko zimny start; dane ładują się równolegle (start() niżej). */
  const [intro, setIntro] = useState(() => takeColdStart(AppState.currentState));
  // Runda 69: trening porzucony ponad 6 h temu zapisuje się sam (koniec = ostatnia odhaczona seria) — przy starcie i powrocie z tła.
  const autoSaved = (w: Workout | null) => { if (!w) return; markDoneEarly(w); timer.stop().catch(() => {}); timer.stopSet().catch(() => {}); timer.cancelStaleReminder().catch(() => {}); onWorkoutSaved(w).catch(() => {});
    setAutoSavedNotice(t('Trening z {d} {s} nie miał aktywności od 6 godzin, więc zapisał się sam. Koniec: {e} (ostatnia seria). Znajdziesz go w zakładce Plan.' /* H2 (audyt 0.10): zakładka nazywa się Kalendarz */, { d: fmtDate(wallTs(w)), s: fmtTime(wallTs(w)), e: fmtTime(wallTs(w, w.finishedAt ?? w.startedAt)) })); };
  /* `retry` — „Spróbuj ponownie” na ekranie błędu: strażnik pętli awarii liczy ten start od zera (M1-audytor-generalny-003) */
  const start = (retry = false) => { setErr(null); Promise.all([init({ guard: true, retry }), loadFonts()]).then(() => { resolveColdStopwatch(); /* Q-002 */ autoSaved(autoFinishStale()); retryHealth().catch(() => {}); /* J2: zapisy do Zdrowia, które się nie udały */ cleanShareLeftovers().catch(() => {}); /* SEC-09 */ restored = restoreObjDrafts(); /* UX2-03 = DAT2-06: szkice edycji sprzed zamknięcia aplikacji */ cancelLegacyReminders().catch(() => {}); /* decyzja 09.10.2026: bez przypomnienia o podpisie — stare odwołane */ initEntitlements().catch(() => {}); /* 0.17.0: sklep tylko przy PAYWALL.ENABLED */ return timer.restore().catch(() => {}); }).then(() => setReady(true)).catch(e => setErr(e instanceof Error ? e.message : String(e))); };
  useEffect(() => { start(); }, []);
  useEffect(() => initA11yPrefs(), []); /* M1-024: „Pogrubiony tekst” z ustawień iOS (odczyt i nasłuch) */
  /* M1-audytor-generalny-003: „kamień” strażnika pętli awarii — pierwszy ekran działa BOOT_STABLE_MS po starcie (albo aplikacja idzie do tła). Wyjątek przy rysowaniu
   * odmontowuje ten komponent (ErrorBoundary niżej), więc licznik nie jest zerowany, a ponowna awaria prowadzi do ekranu awaryjnego. */
  const readyRef = useRef(false); readyRef.current = ready;
  useEffect(() => { if (!ready) return; const to = setTimeout(() => { markBootStable().catch(() => {}); }, BOOT_STABLE_MS); return () => clearTimeout(to); }, [ready]);
  /* 0.20: łącze z Apple Watch — startuje samo przy sparowanym zegarku z aplikacją (docs/36); build E2E: atrapa zegarka (lib/watch/test-mode.ts). Dopiero po init() (`ready`): migawka czyta stan, a przed wczytaniem danych getState() rzuca „store not initialised” (E2E 50, 14.10.2026) */
  useEffect(() => (ready ? (isFakeWatchBuild() ? startTestWatch() : startAppleWatchLink()) : undefined), [ready]);
  /* T-051 (SDK 56+, audyt aktualizacji): expo-router trzyma ekran powitalny, dopóki nie zamontuje się nawigator — ekran błędu startu
   * (poniżej) nie ma nawigatora, więc zostałby pod logo i aplikacja wyglądałaby na zawieszoną. Przy błędzie chowamy go sami. */
  useEffect(() => { if (err) SplashScreen.hideAsync().catch(() => {}); }, [err]);
  // Zapis wymuszony przy wyjściu do tła — debounce 300 ms nie może zgubić ostatniej zmiany, gdy system ubije apkę.
  useEffect(() => { const sub = AppState.addEventListener('change', st => { if (st !== 'active') { flush(); if (readyRef.current) markBootStable().catch(() => {}); } else { const w = autoFinishStale(); /* runda 74 (audyt): stoper zdjęty z zapisu przez cichy zapis (Q-011, seria z celem odhaczona) nie liczy dalej w pamięci */ if (!w && timer.S.on && !getState().timer?.setStartAt) timer.stopSet().catch(() => {}); autoSaved(w); timer.onForeground(); refreshViews(); retryHealth().catch(() => {}); /* J2 */ refreshEntitlements().catch(() => {}); /* 0.17.0: powrót z tła */ } }); return () => sub.remove(); }, []);
  /* Audyt 0.10 J1 (DAT-05): dane z nowszej wersji aplikacji — niczego nie nadpisujemy; „zaktualizuj” i wysłanie surowych danych. */
  const newer = err ? getNewerSchema() : null;
  const body = newer != null ? <View testID="newer-data" style={{ flex: 1, backgroundColor: th.bg, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }}>
    <Text accessibilityLanguage={lang()} accessibilityRole="header" style={{ color: th.text, textAlign: 'center', ...font('sectionTitle') }}>{t('Dane z nowszej wersji aplikacji — zaktualizuj aplikację')}</Text>
    <Text accessibilityLanguage={lang()} style={{ color: th.muted, textAlign: 'center' }}>{t('Dane w telefonie zapisała nowsza wersja (schemat {a}); ta wersja obsługuje do {b}. Niczego nie zmieniam — zainstaluj najnowszą wersję (TestFlight). Dane możesz też wysłać jako plik.', { a: newer, b: SCHEMA_VERSION })}</Text>
    <Pressable accessibilityLanguage={lang()} accessibilityRole="button" onPress={() => { exportRawData().then(ok => { if (!ok) Alert.alert(t('Nie udało się wysłać danych'), t('Spróbuj ponownie.')); }).catch(() => {}); }} style={{ padding: 12 }}><Text accessibilityLanguage={lang()} style={{ color: th.accent, ...font('button') }}>{t('Wyślij dane')}</Text></Pressable>
    <Pressable accessibilityLanguage={lang()} accessibilityRole="button" onPress={() => start(true)} style={{ padding: 12 }}><Text accessibilityLanguage={lang()} style={{ color: th.accent, ...font('button') }}>{t('Spróbuj ponownie')}</Text></Pressable>
  </View>
  // Błąd startu (np. baza niedostępna, wyjątek po wczytaniu danych, pętla awarii) — komunikat, wysłanie danych, ponowienie i kontakt (M1-audytor-generalny-003, 004).
  : err ? <StartError title={t('Nie udało się otworzyć danych.')} message={t('Dane w telefonie nie zostały zmienione — możesz je wysłać jako plik.')} detail={err} onRetry={() => start(true)} />
  : !ready ? <View style={{ flex: 1, backgroundColor: th.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={th.accent} /></View>
  : <Root />;
  /* Na czas animacji treść pod nakładką jest ukryta dla VoiceOver (i dla Maestro — scenariusze czekają na tekst, aż animacja się skończy). */
  return <View style={{ flex: 1 }}>
    <View style={{ flex: 1 }} accessibilityElementsHidden={intro} importantForAccessibility={intro ? 'no-hide-descendants' : 'auto'}>{body}</View>
    {intro ? <Intro ready={ready || err != null} onDone={() => setIntro(false)} /> : null}
  </View>;
}

/** M1-audytor-generalny-003: wyjątek przy rysowaniu dowolnego ekranu (granica błędu expo-router dla całego drzewa) — ekran zastępczy zamiast zamknięcia aplikacji,
 * z wysłaniem danych, ponowieniem i kontaktem. Dane w bazie nie są ruszane. */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <StartError title={t('Ekran nie mógł się wyświetlić.')} message={t('Dane w telefonie nie zostały zmienione — możesz je wysłać jako plik.')} detail={error.message} onRetry={() => { retry().catch(() => {}); }} />;
}

/** UX2-03 = DAT2-06 (audyt kontrolny 1, wariant A): szkice przywrócone po starcie — pytanie po kolei: wrócić do edycji czy odrzucić zmiany. */
let restored: RestoredDraft[] = [];
function askRestored() {
  const d = restored.shift(); if (!d) return;
  Alert.alert(t('Niezapisane zmiany'), d.kind === 'template' ? t('Aplikacja zamknęła się w trakcie edycji szablonu „{name}”. Wrócić do edycji?', { name: d.name }) : t('Aplikacja zamknęła się w trakcie edycji ćwiczenia „{name}”. Wrócić do edycji?', { name: d.name }), [
    { text: t('Odrzuć zmiany'), style: 'destructive', onPress: () => { dropRestored(d); askRestored(); } },
    { text: t('Wróć do edycji'), onPress: () => { router.push(`/${d.kind}/${d.id}?edit=1${d.isNew ? '&new=1' : ''}` as never); } }, /* pozostałe szkice zostają (w pamięci i w bazie) — pytanie przy następnym starcie albo „Edytuj” */
  ]);
}

/** Osobny komponent, bo useTick() wymaga zainicjowanego stanu; odświeża tytuły po zmianie języka. */
function Root() {
  const th = useTheme(); usePrefsTick();
  useEffect(() => { const i = setTimeout(askRestored, 600); return () => clearTimeout(i); }, []); /* po komunikacie „Zapisałem trening” (500 ms) */
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerStyle: { backgroundColor: th.bg }, headerTintColor: th.text, headerTitleStyle: { fontFamily: font('navTitle').fontFamily, fontSize: font('navTitle').fontSize }, headerShadowVisible: false, contentStyle: { backgroundColor: th.bg }, headerBackTitle: t('Wróć') }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="picker" options={{ presentation: 'modal', title: t('Wybierz ćwiczenie') }} />
        <Stack.Screen name="swap" options={{ presentation: 'modal', title: t('Zamień ćwiczenie') }} />
        <Stack.Screen name="adapt" options={{ presentation: 'modal', title: t('Dostosuj do miejsca') }} />{/* 0.18 (docs/33): okno „Dostosuj do: X” */}
        <Stack.Screen name="place-once" options={{ presentation: 'modal', title: t('Inne miejsce') }} />{/* 0.19 (docs/33 A4, B): szybka lista sprzętu — miejsce jednorazowe / na dni planu */}
        <Stack.Screen name="pick-template" options={{ presentation: 'modal', title: t('Wybierz szablon') }} />{/* P2 B (11.10.2026): „Z szablonu” w arkuszu „Inny trening” */}
        <Stack.Screen name="templates" options={{ title: t('Szablony') }} />{/* 11.10.2026 (docs/22, wariant A): Szablony i Ćwiczenia pod Więcej */}
        <Stack.Screen name="exercises" options={{ title: t('Ćwiczenia') }} />
        <Stack.Screen name="progression" options={{ title: t('Progresja') }} />{/* docs/22 krok 3 pkt 5; P8 B */}
        <Stack.Screen name="+not-found" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="_sitemap" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="template/[id]" options={{ title: t('Szablon') }} />
        <Stack.Screen name="plan" options={{ title: t('Planowanie') }} />
        <Stack.Screen name="generator" options={{ title: t('Generator szablonów i planu') }} />{/* audyt 0.10 UX-14: jedna nazwa (przewodnik, przycisk „Wygeneruj szablony i plan”) */}
        <Stack.Screen name="guide" options={{ title: t('Przewodnik') }} />
        <Stack.Screen name="reorder" options={{ title: t('Kolejność ćwiczeń') }} />
        <Stack.Screen name="exercise/[id]" options={{ title: t('Ćwiczenie') }} />
        <Stack.Screen name="history/[id]" options={{ title: t('Sesja') }} />
        <Stack.Screen name="history/add" options={{ title: t('Trening wstecz') }} />
        <Stack.Screen name="history/edit/[id]" options={{ title: t('Edycja sesji'), gestureEnabled: false /* docs/12: szkic nie przepada gestem — Anuluj/Zapisz w nagłówku */ }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal', title: t('Pełna wersja') }} />{/* 0.17.0 (docs/27): ekran zakupu */}
        <Stack.Screen name="more/bands" options={{ title: t('Gumy') }} />
        <Stack.Screen name="more/settings" options={{ title: t('Ustawienia') }} />
        <Stack.Screen name="more/bodymass" options={{ title: t('Masa ciała') }} />
        <Stack.Screen name="more/about" options={{ title: t('O aplikacji') }} />{/* SEC-08 */}
        <Stack.Screen name="more/licenses" options={{ title: t('Licencje open source') }} />{/* fala 2 audytu 0.10: masa ciała z datą */}
        <Stack.Screen name="more/backup" options={{ title: t('Kopia zapasowa') }} />
        <Stack.Screen name="more/import" options={{ title: t('Import historii z CSV') }} />{/* H2 (audyt 0.10): „Kopia zapasowa” */}
        <Stack.Screen name="more/language" options={{ title: t('Język') }} />
        <Stack.Screen name="more/locations" options={{ title: t('Miejsca i sprzęt') }} />
        <Stack.Screen name="more/location/[id]" options={{ title: t('Miejsce') }} />
      </Stack>
    </>
  );
}
