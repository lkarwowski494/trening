import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Screen, H1, H2, Muted, Item, Btn, useOnce, SectionTitle } from '@/components/ui';
import ActiveWorkout from '@/components/ActiveWorkout';
import { Alert } from 'react-native';
import { wallTs, getState, useTick, finishedWorkouts, templateGroups, useForegroundTick, fmtDate, getPersistError, getRecovery, clearRecovery, flush, tplWorkSets } from '@/lib/store';
import { exportRecovery } from '@/lib/backup';
import { TodayPlan } from '@/components/TodayPlan';
import { WeekStats, FirstSteps } from '@/components/Dashboard';
import { firstSteps } from '@/lib/dashboard';
import { WhatsNewHeader } from '@/components/WhatsNew';
import { startTemplate } from '@/lib/start';
import { StartPanel } from '@/components/StartPanel';
import { PlanningCard } from '@/components/PlanningCard';
import { signingState, scheduleReminder, renewTexts, type RenewKind } from '@/lib/signing';
import { t, tp, locale } from '@/lib/i18n';
import { fmtW, fmtNum } from '@/lib/units';

function SigningBanner() {
  const [st, setSt] = useState<{ days: number | null; kind: RenewKind }>({ days: null, kind: 'rebuild' }); const router = useRouter();
  const fg = useForegroundTick(); // runda 30: po powrocie z tła (np. następnego dnia) liczymy od nowa
  useEffect(() => { signingState().then(setSt).catch(() => {}); scheduleReminder(); }, [fg]);
  const days = st.days; if (days == null || days > 2) return null;
  // T-053: tekst zależy od drogi instalacji — ad hoc (rok) → nowy build w GitHubie; darmowe Apple ID (7 dni) → Sideloadly.
  const rt = renewTexts(st.kind);
  const txt = days < 0 ? rt.expired : days === 0 ? t('Podpis aplikacji wygasa dziś.') : t('Podpis aplikacji wygasa za {n} {d}.', { n: days, d: tp(days, 'dzień|dni|dni') });
  return <Item title={txt} sub={rt.sub} onPress={() => router.push('/more/backup')} />;
}

/** Problemy z zapisem: błąd zapisu na dysk albo nieczytelne dane przy starcie (kopia odłożona, nie nadpisana). */
function DataBanners() {
  const err = getPersistError(); const rec = getRecovery();
  return <>
    {err ? <Item title={t('Nie udało się zapisać danych')} sub={t('Tapnij, by spróbować ponownie. Zrób też backup.')} onPress={() => flush()} /> : null}
    {rec ? <Item title={t('Poprzednich danych nie dało się odczytać')} sub={t('Kopia jest zachowana w telefonie. Tapnij, by ją wysłać, a potem zaimportuj backup.')} onPress={() => Alert.alert(t('Poprzednich danych nie dało się odczytać'), t('Po ukryciu komunikatu kopii nie da się już wysłać z aplikacji — najpierw ją wyślij, jeśli jest potrzebna.'), [{ text: t('Anuluj'), style: 'cancel' }, { text: t('Ukryj komunikat'), style: 'destructive' /* G5 (audyt 0.10 UI-14): kopii nie da się potem wysłać */, onPress: () => clearRecovery() }, { text: t('Wyślij kopię'), onPress: () => { exportRecovery().then(ok => { if (!ok) Alert.alert(t('Nie udało się'), t('Spróbuj ponownie.')); }).catch(() => {}); } }])} /> : null /* runda 35: komunikat da się ukryć */}
  </>;
}

function Home() {
  const st = getState(); const router = useRouter(); const once = useOnce();
  const fin = finishedWorkouts();
  /* Układ B „najpierw trening” (decyzja właściciela 09.10.2026 ok. 15:20, doprecyzowanie 15:30; docs/18): karta „Dziś” na górze, pod nią duży
   * przycisk startu i „Inny trening” (arkusz: inny z planu, powtórz ostatni, z szablonu, pusty — dawne przyciski na dole ekranu), bez planu karta
   * Planowania zaraz pod startem; „Ostatni trening” usunięty (właściciel 09.10.2026 ok. 16:20 — jest w arkuszu przy „Powtórz ostatni”); nowa osoba — „Pierwsze kroki” w miejscu Planowania; „Ten tydzień” (kafelki, przy planie sztanga postępu),
   * przy planie Planowanie zwinięte do wiersza, lista szablonów ze Startem (zostaje — szybki start konkretnego szablonu). */
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <WhatsNewHeader>{/* 08.10.2026: „i” — Co nowego (decyzja właściciela) */}<H1>{t('Trening')}</H1><Muted>{new Date().toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' })}</Muted></WhatsNewHeader>
      <DataBanners />
      <SigningBanner />
      <TodayPlan />{/* 08.10.2026: kalendarz z planem (decyzja 1A) */}
      <StartPanel />
      <PlanningCard when="noPlan" />
      <FirstSteps />
      <WeekStats />
      <PlanningCard when="plan" />
      <H2 style={{ marginTop: 22 }}>{t('Zacznij z szablonu')}</H2>
      {!st.templates.some(x => !x.archived) && !firstSteps() /* 07.10.2026 wieczór: same zarchiwizowane — jak brak szablonów; UX-12 A: bez powtórzenia „Pierwszych kroków” */ ? <Muted style={{ fontSize: 13, marginBottom: 8 }}>{t('Nie masz jeszcze szablonów — utwórz pierwszy albo zacznij pusty trening.')}</Muted> : null /* runda 8: pusty stan; układ B: „+ Nowy szablon” w karcie Planowania */}
      {/* 07.10.2026 wieczór: foldery jako nagłówki, bez zarchiwizowanych (store.templateGroups) */}
      {templateGroups().map(g => <React.Fragment key={g.folder ?? ''}>{g.folder ? <SectionTitle>{g.folder}</SectionTitle> : null}{g.items.map(tpl => { const lw = fin.find(x => x.templateId === tpl.id); const sets = tplWorkSets(tpl); return (
        <Item key={tpl.id} title={tpl.name} sub={`${tpl.items.length} ${t('ćw.')} · ${sets} ${tp(sets, 'seria|serie|serii')}${lw ? ' · ' + t('ostatnio') + ' ' + fmtDate(wallTs(lw)) : ''}`} onPress={() => router.push(`/template/${tpl.id}`)} right={tpl.items.length ? <Btn title={t('Start')} kind="primary" small accessibilityLabel={t('Start: {name}', { name: tpl.name })} onPress={once(() => startTemplate(tpl)) /* audyt 0.10 (LIVE-12): podwójne tapnięcie — jedno pytanie / jeden trening */} /> : undefined} />); })}</React.Fragment>)}
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
