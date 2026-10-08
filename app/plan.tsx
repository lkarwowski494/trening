import React from 'react';
import { ScrollView, View } from 'react-native';
import { Screen, Chip, Muted, H2 } from '@/components/ui';
import { getState, useTick } from '@/lib/store';
import { weekPlanDays, setWeekDay } from '@/lib/plan';
import { t, locale } from '@/lib/i18n';

/*
 * Plan tygodnia (kalendarz, decyzja właściciela 08.10.2026, wariant 2A): dla każdego dnia pon…nd szablon albo „Wolne”. Plan powtarza się co tydzień;
 * zmiany pojedynczych dni robi się w Kalendarzu (panel dnia). Szablony ustawia właściciel — tu tylko przypisanie do dni.
 */
const weekdayName = (i: number) => new Date(2024, 0, 1 + i).toLocaleDateString(locale(), { weekday: 'long' }); /* 1.01.2024 = poniedziałek */

export default function PlanScreen() {
  useTick(); const days = weekPlanDays(); const live = getState().templates.filter(x => !x.archived);
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 40 }}>
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
    </ScrollView></Screen>
  );
}
