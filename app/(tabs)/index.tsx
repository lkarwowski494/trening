import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen, H1, Muted, Item } from '@/components/ui';
import ActiveWorkout from '@/components/ActiveWorkout';
import { Alert } from 'react-native';
import { getState, useTick, getPersistError, getRecovery, clearRecovery, flush } from '@/lib/store';
import { exportRecovery } from '@/lib/backup';
import { TodayPlan } from '@/components/TodayPlan';
import { WeekStats, FirstSteps } from '@/components/Dashboard';
import { WhatsNewHeader } from '@/components/WhatsNew';
import { StartPanel } from '@/components/StartPanel';
import { t, locale } from '@/lib/i18n';
import { cancelButton } from '@/lib/confirm';
import { setAutoSavedNotice, useAutoSavedNotice } from '@/lib/notices';
import { fmtWeekdayDayMonth } from '@/lib/calendar';

/** Problemy z zapisem: błąd zapisu na dysk albo nieczytelne dane przy starcie (kopia odłożona, nie nadpisana). */
function DataBanners() {
  const err = getPersistError(); const rec = getRecovery(); const auto = useAutoSavedNotice();
  return <>
    {auto ? <Item title={t('Trening zapisał się sam')} sub={auto} icon="✕" accessibilityLabel={`${t('Trening zapisał się sam')}, ${auto}. ${t('Tapnij, by ukryć.')}`} onPress={() => setAutoSavedNotice(null)} /> : null}
    {err ? <Item title={t('Nie udało się zapisać danych')} sub={t('Tapnij, by spróbować ponownie. Zrób też backup.')} onPress={() => flush()} /> : null}
    {rec ? <Item title={t('Poprzednich danych nie dało się odczytać')} sub={t('Kopia jest zachowana w telefonie. Tapnij, by ją wysłać, a potem zaimportuj backup.')} onPress={() => Alert.alert(t('Poprzednich danych nie dało się odczytać'), t('Po ukryciu komunikatu kopii nie da się już wysłać z aplikacji — najpierw ją wyślij, jeśli jest potrzebna.'), [{ ...cancelButton() }, { text: t('Ukryj komunikat'), style: 'destructive' /* G5 (audyt 0.10 UI-14): kopii nie da się potem wysłać */, onPress: () => clearRecovery() }, { text: t('Wyślij kopię'), onPress: () => { exportRecovery().then(ok => { if (!ok) Alert.alert(t('Nie udało się wysłać kopii'), t('Spróbuj ponownie.')); }).catch(() => {}); } }])} /> : null /* runda 35: komunikat da się ukryć */}
  </>;
}

function Home() {
  /* Układ B „najpierw trening” (decyzja właściciela 09.10.2026, docs/18) po zmianach z 11.10.2026 (docs/22 krok 3; P2–P4, P8): nagłówek planu z „Planowaniem”
   * nad kalendarzem tygodnia (components/TodayPlan) → duży przycisk startu i „Inny trening” (arkusz: inny z planu, powtórz ostatni, z szablonu — pełnoekranowy
   * wybór ze Startem, pusty) → „Pierwsze kroki” (tylko nowa osoba) → „Ten tydzień” (kafelki, stosy planu, sylwetka i serie na partię: wykonane + zaplanowane)
   * (14.10.2026, uwaga właściciela z telefonu: sekcja „Progresja” zniknęła z tego ekranu — jest w Postępach). Lista „Zacznij z szablonu”, karta Planowania i wiersz „Plan: … Planowanie ›” usunięte jako duplikaty. */
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <WhatsNewHeader>{/* 08.10.2026: „i” — Co nowego (decyzja właściciela) */}<H1>{t('Trening')}</H1><Muted>{fmtWeekdayDayMonth(new Date())}</Muted></WhatsNewHeader>
      <DataBanners />
      <TodayPlan />{/* 08.10.2026: kalendarz z planem (decyzja 1A); 11.10.2026: z nagłówkiem planu i „Planowaniem” */}
      <StartPanel />
      <FirstSteps />
      <WeekStats />
    </ScrollView>
  );
}

export default function TrainScreen() {
  useTick(); const st = getState();
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Screen>{st.active ? <><DataBanners /><ActiveWorkout /></> : <Home />}</Screen>{/* runda 32: błąd zapisu widoczny także w trakcie treningu */}
    </SafeAreaView>
  );
}
