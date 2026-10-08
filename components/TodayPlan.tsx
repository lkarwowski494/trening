import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, Muted, Txt } from '@/components/ui';
import { useTheme, F } from '@/lib/theme';
import { getState, finishedWorkouts, useForegroundTick } from '@/lib/store';
import { hasPlan, upcoming, dayKeyOf } from '@/lib/plan';
import { startTemplate } from '@/lib/start';
import { t, locale } from '@/lib/i18n';

/*
 * Ekran treningu (decyzja właściciela 08.10.2026, wariant 1A): „Dziś: X” ze startem i podgląd 7 najbliższych dni z planu. Tapnięcie podglądu
 * otwiera Kalendarz. Bez planu — nic (ekran jak dotąd).
 */
export function TodayPlan() {
  useForegroundTick(); const th = useTheme(); const router = useRouter();
  if (!hasPlan()) return null;
  const today = dayKeyOf(Date.now()); const days = upcoming(7, today); const name = (id: string | null) => (id ? getState().templates.find(x => x.id === id)?.name ?? '' : '');
  const id = days[0].templateId; const doneToday = finishedWorkouts().some(w => dayKeyOf(w.startedAt) === today);
  const wd = (k: string) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10)).toLocaleDateString(locale(), { weekday: 'short' });
  return (
    <View testID="today-plan" style={{ marginTop: 14, padding: 12, borderRadius: 10, backgroundColor: th.surface2, gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <Txt style={{ fontFamily: F.semibold, flexShrink: 1 }}>{id ? t('Dziś: {name}', { name: name(id) }) : t('Dziś wolne')}{id && doneToday ? ` · ${t('zrobione')}` : ''}</Txt>
        {id && !doneToday ? <Btn small kind="primary" title={t('Start')} accessibilityLabel={t('Start zaplanowanego treningu: {name}', { name: name(id) })} onPress={() => { const tpl = getState().templates.find(x => x.id === id); if (tpl) startTemplate(tpl); }} /> : null}
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={t('Plan na 7 dni: {list}. Tapnij, by otworzyć Kalendarz.', { list: days.map(d => `${wd(d.date)} ${d.templateId ? name(d.templateId) : t('wolne')}`).join(', ') })} onPress={() => router.push('/history')} style={{ flexDirection: 'row' }}>
        {days.map(d => (
          <View key={d.date} style={{ flex: 1, alignItems: 'center' }}>
            <Muted style={{ fontSize: 11 }}>{wd(d.date)}</Muted>
            <View style={{ width: 8, height: 8, borderRadius: 4, marginTop: 3, backgroundColor: d.templateId ? th.accent : th.line }} />
            <Muted numberOfLines={1} style={{ fontSize: 10, marginTop: 2 }}>{d.templateId ? name(d.templateId) : '—'}</Muted>
          </View>))}
      </Pressable>
    </View>
  );
}
