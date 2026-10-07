import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Screen, H1, Item, Muted, Empty, Btn, Chip } from '@/components/ui';
import { useHistTick, finishedWorkouts, fmtDate, fmtTime, fmtDur, volume, deleteWorkout } from '@/lib/store';
import { SwipeRow } from '@/components/SwipeRow';
import { HistoryCalendar } from '@/components/HistoryCalendar';
import { workoutsByDay } from '@/lib/calendar';
import { t, tp } from '@/lib/i18n';
import { fmtVol } from '@/lib/units';

export default function HistoryScreen() {
  useHistTick(); const all = finishedWorkouts(); const router = useRouter();
  /* Kalendarz (docs/21 pkt 4a, 07.10.2026 wieczór): dzień wybrany w kalendarzu filtruje listę; bez wyboru — wszystkie sesje */
  const [day, setDay] = useState<string | null>(null); const byDay = workoutsByDay(all); const ws = day ? byDay.get(day) ?? [] : all;
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}><Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}><H1>{t('Historia')}</H1><Muted>{all.length} {tp(all.length, 'sesja|sesje|sesji')}</Muted></View>
      {/* Docs/12: trening wstecz — jak „Log a past workout” w Strong/Hevy */}
      <Btn title={t('+ Dodaj trening wstecz')} small style={{ marginBottom: 8, alignSelf: 'flex-start' }} onPress={() => router.push('/history/add')} />
      {/* Runda 69 (wydajność): FlatList renderuje tylko widoczne wiersze — przy 1000+ sesjach ekran otwierał się sekundy. */}
      {all.length ? <FlatList data={ws} keyExtractor={w => w.id} initialNumToRender={15} windowSize={7} ListHeaderComponent={<>
        <HistoryCalendar byDay={byDay} selected={day} onSelect={setDay} />
        {day ? <View style={{ flexDirection: 'row', marginBottom: 6 }}><Chip label={t('Pokaż wszystkie')} on={false} onPress={() => setDay(null)} /></View> : null}
      </>} renderItem={({ item: w }) => <SwipeRow label={t('Usuń sesję: {name}', { name: `${w.templateName || t('Trening')}, ${fmtDate(w.startedAt)} ${fmtTime(w.startedAt)}` })} title={t('Usunąć tę sesję z historii?')} message={`${w.templateName || t('Trening')}, ${fmtDate(w.startedAt)}`} onDelete={() => deleteWorkout(w.id)}>{a11y => <Item a11y={a11y} title={w.templateName || t('Trening')} sub={(() => { const n = w.exercises.reduce((a, e) => a + e.sets.filter(s => s.kind !== 'warmup').length, 0); const v = volume(w); return [`${fmtDate(w.startedAt)} ${fmtTime(w.startedAt)}`, fmtDur(((w.finishedAt ?? w.startedAt) - w.startedAt) / 1000), `${n} ${tp(n, 'seria|serie|serii')}`, v ? fmtVol(v) : ''].filter(Boolean).join(' · '); })()} onPress={() => router.push(`/history/${w.id}`)} />}</SwipeRow>} /> : <Empty>{t('Jeszcze pusto — pierwszy trening czeka.')}</Empty>}
    </Screen></SafeAreaView>
  );
}
