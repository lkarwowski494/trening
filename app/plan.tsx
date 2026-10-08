import React from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Chip, Muted, H2, Btn, Item, Field, Input, SectionTitle } from '@/components/ui';
import { SwipeRow } from '@/components/SwipeRow';
import { getState, useTick } from '@/lib/store';
import { weekPlanDays, setWeekDay, planName, setPlanName, savedPlans, saveCopyAs, activatePlan, deletePlan, futureChanges, type PlanDays } from '@/lib/plan';
import { activationNote } from '@/lib/planActivation';
import { t, locale } from '@/lib/i18n';

/*
 * Plan tygodnia (kalendarz, decyzja właściciela 08.10.2026, wariant 2A): dla każdego dnia pon…nd szablon albo „Wolne”. Plan powtarza się co tydzień;
 * zmiany pojedynczych dni robi się w Kalendarzu (panel dnia). Szablony ustawia właściciel — tu tylko przypisanie do dni.
 * 08.10.2026 (docs/24): kilka planów, jeden aktywny — nazwa, „Zapisz kopię jako nowy plan”, „Inne plany” z „Ustaw jako aktywny”, usuwanie gestem.
 */
const weekdayName = (i: number) => new Date(2024, 0, 1 + i).toLocaleDateString(locale(), { weekday: 'long' }); /* 1.01.2024 = poniedziałek */
const weekdayShort = (i: number) => new Date(2024, 0, 1 + i).toLocaleDateString(locale(), { weekday: 'short' });
const tplName = (id: string | null) => (id ? getState().templates.find(x => x.id === id && !x.archived)?.name ?? '' : '');
/** „pon. Upper A · śr. Upper B” — dni z treningiem. */
export const planSummary = (days: PlanDays) => days.map((id, i) => (tplName(id) ? `${weekdayShort(i)} ${tplName(id)}` : '')).filter(Boolean).join(' · ') || t('bez treningów');
const nameOr = (n: string) => n || t('Poprzedni plan');

export default function PlanScreen() {
  useTick(); const router = useRouter(); const days = weekPlanDays(); const live = getState().templates.filter(x => !x.archived); const other = savedPlans();
  const activate = (id: string, name: string) => { /* audyt 0.10 B1: wspólny tekst z generatorem (lib/planActivation.ts) */
    Alert.alert(t('Ustawić „{name}” jako aktywny plan?', { name: nameOr(name) }), activationNote(), [
      { text: t('Anuluj'), style: 'cancel' }, { text: t('Ustaw'), style: futureChanges() ? 'destructive' : 'default', onPress: () => activatePlan(id) }, /* jak w generatorze: znikną zmiany dni */
    ]); };
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingVertical: 10, paddingBottom: 40 }}>
      <Field label={t('Nazwa planu')}><Input key={planName()} defaultValue={planName()} placeholder={t('Mój plan')} maxLength={40} accessibilityLabel={t('Nazwa planu')} onEndEditing={e => setPlanName(e.nativeEvent.text)} /></Field>
      <Muted style={{ fontSize: 13, marginBottom: 8 }}>{t('Plan powtarza się co tydzień. Pojedyncze dni zmienisz w Kalendarzu.')}</Muted>
      {!live.length ? <Muted style={{ fontSize: 13 }}>{t('Nie masz jeszcze szablonów.')}</Muted> : null}
      {days.map((id, i) => (
        <View key={i} style={{ marginBottom: 12 }} testID={`plan-day-${i}`}>
          <H2>{weekdayName(i)}</H2>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            <Chip label={t('Wolne')} on={!id || !live.some(x => x.id === id)} a11yLabel={`${weekdayName(i)}: ${t('Wolne')}`} onPress={() => setWeekDay(i, null)} />
            {live.map(x => <Chip key={x.id} label={x.name} on={x.id === id} a11yLabel={`${weekdayName(i)}: ${x.name}`} onPress={() => setWeekDay(i, x.id)} />)}
          </View>
        </View>))}
      <Btn title={t('Wygeneruj szablony i plan')} small onPress={() => router.push('/generator')} style={{ alignSelf: 'flex-start', marginBottom: 8 }} />{/* 08.10.2026: generator (docs/24) */}
      <Btn title={t('Zapisz kopię jako nowy plan')} small onPress={() => saveCopyAs(t('Kopia: {name}', { name: planName() || t('Mój plan') }))} style={{ alignSelf: 'flex-start' }} />
      {other.length ? <>
        <SectionTitle>{t('Inne plany')}</SectionTitle>
        <Muted style={{ fontSize: 13, marginBottom: 6 }}>{t('Obowiązuje jeden plan naraz. Po okresie przejściowym wrócisz do poprzedniego jednym przyciskiem.')}</Muted>
        {other.map(p => <SwipeRow key={p.id} label={t('Usuń plan: {name}', { name: nameOr(p.name) })} title={t('Usunąć ten plan?')} message={nameOr(p.name)} onDelete={() => deletePlan(p.id)}>
          {a11y => <Item a11y={a11y} title={nameOr(p.name)} sub={planSummary(p.days)} right={<Btn small title={t('Ustaw jako aktywny')} accessibilityLabel={t('Ustaw jako aktywny: {name}', { name: nameOr(p.name) })} onPress={() => activate(p.id, p.name)} />} />}
        </SwipeRow>)}
      </> : null}
    </ScrollView></Screen>
  );
}
