import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Screen, H1, H2, Muted, Item, Btn, useOnce, SectionTitle } from '@/components/ui';
import { useTheme } from '@/lib/theme';
import ActiveWorkout from '@/components/ActiveWorkout';
import { Alert } from 'react-native';
import { getState, useTick, finishedWorkouts, templateGroups, startFromTemplate, startEmpty, newTemplate, useForegroundTick, repeatLast, fmtDate, localISODate, getPersistError, getRecovery, clearRecovery, flush, exById, tplWorkSets } from '@/lib/store';
import { exportRecovery } from '@/lib/backup';
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
    {rec ? <Item title={t('Poprzednich danych nie dało się odczytać')} sub={t('Kopia jest zachowana w telefonie. Tapnij, by ją wysłać, a potem zaimportuj backup.')} onPress={() => Alert.alert(t('Poprzednich danych nie dało się odczytać'), t('Po ukryciu komunikatu kopii nie da się już wysłać z aplikacji — najpierw ją wyślij, jeśli jest potrzebna.'), [{ text: t('Anuluj'), style: 'cancel' }, { text: t('Ukryj komunikat'), onPress: () => clearRecovery() }, { text: t('Wyślij kopię'), onPress: () => { exportRecovery().then(ok => { if (!ok) Alert.alert(t('Nie udało się'), t('Spróbuj ponownie.')); }).catch(() => {}); } }])} /> : null /* runda 35: komunikat da się ukryć */}
  </>;
}

function Home() {
  const st = getState(); const router = useRouter(); const once = useOnce(); const th = useTheme();
  const fin = finishedWorkouts(); const last = fin[0];
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={{ marginVertical: 10 }}><H1>{t('Trening')}</H1><Muted>{new Date().toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' })}</Muted></View>
      <DataBanners />
      <SigningBanner />
      {/* Decyzja 03.10.2026 (08:11): świeża instalacja nie ma szablonów (użytkownik ustawia je sam) — wskazówka pierwszego startu nie odsyła wtedy
          do „szablonu niżej”, tylko do „+ Nowy szablon” albo pustego treningu */}
      {!last ? <View style={{ marginTop: 16, padding: 12, borderRadius: 10, borderWidth: 1, borderStyle: 'dashed', borderColor: th.line }}><Muted style={{ fontSize: 13 }}>{st.templates.some(x => !x.archived) ? t('Pierwszy raz? Wybierz szablon niżej, wpisz ciężar i powtórzenia, odhaczaj serie ✓ — przerwa odlicza się sama. Na koniec „Zakończ trening i zapisz”. Szablony i ćwiczenia zmienisz w zakładkach obok.') : t('Pierwszy raz? Utwórz swój szablon („+ Nowy szablon” niżej) albo zacznij pusty trening. Wpisuj ciężar i powtórzenia, odhaczaj serie ✓ — przerwa odlicza się sama. Na koniec „Zakończ trening i zapisz”.')}</Muted></View> : null}
      <H2 style={{ marginTop: 22 }}>{t('Zacznij z szablonu')}</H2>
      {!st.templates.some(x => !x.archived) /* 07.10.2026 wieczór: same zarchiwizowane — jak brak szablonów */ ? <><Muted style={{ fontSize: 13, marginBottom: 8 }}>{t('Nie masz jeszcze szablonów — utwórz pierwszy albo zacznij pusty trening.')}</Muted><Btn title={t('+ Nowy szablon')} block onPress={once(() => { const x = newTemplate(); router.push(`/template/${x.id}`); })} /></> : null /* runda 8: pusty stan; od 03.10.2026 — stan świeżej instalacji */}
      {/* 07.10.2026 wieczór: foldery jako nagłówki, bez zarchiwizowanych (store.templateGroups) */}
      {templateGroups().map(g => <React.Fragment key={g.folder ?? ''}>{g.folder ? <SectionTitle>{g.folder}</SectionTitle> : null}{g.items.map(tpl => { const lw = fin.find(x => x.templateId === tpl.id); const sets = tplWorkSets(tpl); return (
        <Item key={tpl.id} title={tpl.name} sub={`${tpl.items.length} ${t('ćw.')} · ${sets} ${tp(sets, 'seria|serie|serii')}${lw ? ' · ' + t('ostatnio') + ' ' + fmtDate(lw.startedAt) : ''}`} onPress={() => router.push(`/template/${tpl.id}`)} right={tpl.items.length ? <Btn title={t('Start')} kind="primary" small accessibilityLabel={t('Start: {name}', { name: tpl.name })} onPress={() => startFromTemplate(tpl)} /> : undefined} />); })}</React.Fragment>)}
      <View style={{ gap: 8, marginTop: 22 }}>
        {last && last.exercises.some(e => { const x = exById(e.exerciseId); return x && !x.archived; }) /* runda 42: nie proponujemy pustego treningu */ ? <Btn title={t('Powtórz ostatni ({name})', { name: last.templateName || t('bez szablonu') })} block onPress={repeatLast} /> : null}
        <Btn title={t('Pusty trening')} kind="ghost" block onPress={startEmpty} />
      </View>
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
