import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, Muted, Txt } from '@/components/ui';
import { useTheme, F } from '@/lib/theme';
import { getState, finishedWorkouts, useForegroundTick } from '@/lib/store';
import { hasPlan, plannedOn, dayKeyOf } from '@/lib/plan';
import { weekStrip } from '@/lib/dashboard';
import { startTemplate } from '@/lib/start';
import { t, locale } from '@/lib/i18n';

/*
 * Karta „Dziś” na ekranie treningu (decyzje właściciela 08.10.2026: 1A, potem dashboard wariant A): „Dziś: X” ze startem i pasek bieżącego
 * tygodnia pon…nd — zrobione (wypełnione), zaplanowane (obwódka), opuszczone (szara kropka), wolne. Tapnięcie paska otwiera Kalendarz.
 * Bez planu: tydzień z odbytymi treningami i zachęta do ustawienia planu. Nowa osoba bez treningów i planu — karty nie ma (są „Pierwsze kroki”).
 */
export function TodayPlan() {
  useForegroundTick(); const th = useTheme(); const router = useRouter();
  const plan = hasPlan(); if (!plan && !finishedWorkouts().length) return null;
  const today = dayKeyOf(Date.now()); const days = weekStrip(); const name = (id: string | null) => (id ? getState().templates.find(x => x.id === id)?.name ?? '' : '');
  const id = plannedOn(today); const doneToday = days.find(d => d.today)?.status === 'done';
  const wd = (k: string) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10)).toLocaleDateString(locale(), { weekday: 'short' });
  const word = (d: (typeof days)[number]) => d.status === 'done' ? t('zrobione') : d.status === 'planned' ? t('zaplanowany: {name}', { name: name(d.templateId) }) : d.status === 'missed' ? t('opuszczony: {name}', { name: name(d.templateId) }) : t('wolne');
  return (
    <View testID="today-plan" style={{ marginTop: 6, padding: 14, borderRadius: 12, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line, gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <View style={{ flexShrink: 1 }}>
          <Muted style={{ fontSize: 12, fontFamily: F.semibold, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Dziś')}</Muted>
          <Txt style={{ fontFamily: F.semibold, fontSize: 18 }}>{plan ? (id ? t('Dziś: {name}', { name: name(id) }) : t('Dziś wolne')) : t('Bez planu tygodnia')}{id && doneToday ? ` · ${t('zrobione')}` : ''}</Txt>
        </View>
        {id && !doneToday ? <Btn small kind="primary" title={t('Start')} accessibilityLabel={t('Start zaplanowanego treningu: {name}', { name: name(id) })} onPress={() => { const tpl = getState().templates.find(x => x.id === id); if (tpl) startTemplate(tpl); }} />
          : !plan ? <Btn small title={t('Plan tygodnia')} onPress={() => router.push('/plan')} /> : null}
      </View>
      <Pressable testID="week-strip" accessibilityRole="button" accessibilityLabel={t('Ten tydzień: {list}. Tapnij, by otworzyć Kalendarz.', { list: days.map(d => `${wd(d.date)} ${word(d)}`).join(', ') })} onPress={() => router.push('/history')} style={{ flexDirection: 'row' }}>
        {days.map(d => (
          <View key={d.date} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
            <Muted style={{ fontSize: 11, fontFamily: d.today ? F.semibold : F.regular, color: d.today ? th.text : th.muted }}>{wd(d.date)}</Muted>
            <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: d.status === 'done' ? th.accent : 'transparent', borderWidth: d.status === 'planned' || (d.today && d.status !== 'done') ? 2 : 0, borderColor: d.today ? th.text : th.accent }}>
              {d.status === 'missed' ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: th.muted }} /> : d.status === 'done' ? <Txt style={{ color: th.accentInk, fontSize: 12, fontFamily: F.semibold }}>✓</Txt> : null}
            </View>
          </View>))}
      </Pressable>
      {!plan ? <Muted style={{ fontSize: 12 }}>{t('Ustaw plan tygodnia, by widzieć tu dzisiejszy trening i dostawać przypomnienie.')}</Muted> : null}
    </View>
  );
}
