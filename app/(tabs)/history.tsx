import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, H1, Item, Muted, Empty, Btn, Chip } from '@/components/ui';
import { workoutDurSec, useHistTick, finishedWorkouts, fmtDate, fmtTime, fmtDur, volume, deleteWorkout, workingSets } from '@/lib/store';
import { SwipeRow } from '@/components/SwipeRow';
import { HistoryCalendar } from '@/components/HistoryCalendar';
import { DayPanel } from '@/components/DayPanel';
import { DeloadHint } from '@/components/DeloadHint';
import { hasPlan } from '@/lib/plan';
import { workoutsByDay } from '@/lib/calendar';
import { t, tp } from '@/lib/i18n';
import { fmtVol } from '@/lib/units';
import type { Workout } from '@/lib/seed';

export default function HistoryScreen() {
  useHistTick(); const all = finishedWorkouts(); const router = useRouter();
  /* Kalendarz (docs/21 pkt 4a, 07.10.2026 wieczór): dzień wybrany w kalendarzu filtruje listę; bez wyboru — wszystkie sesje */
  const [day, setDay] = useState<string | null>(null); const byDay = workoutsByDay(all); const ws = day ? byDay.get(day) ?? [] : all;
  /* audyt 0.10 A9: tapnięcie dnia w pasku tygodnia (ekran Trening) otwiera ten dzień — /history?day=RRRR-MM-DD */
  const params = useLocalSearchParams<{ day?: string }>(); useEffect(() => { if (typeof params.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(params.day)) setDay(params.day); }, [params.day]);
  /* audyt 0.10 UX-13 (wariant A): po wyborze dnia lista przewija się do panelu dnia (na SE panel był poza ekranem) */
  const list = useRef<FlatList<Workout>>(null); const panelY = useRef<number | null>(null);
  const toPanel = () => { if (panelY.current != null) list.current?.scrollToOffset({ offset: Math.max(0, panelY.current - 8), animated: true }); };
  useEffect(() => { if (day) toPanel(); else panelY.current = null; }, [day]);
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}><Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}><H1>{t('Kalendarz')}</H1><Muted>{all.length} {tp(all.length, 'sesja|sesje|sesji')}</Muted></View>
      {/* 08.10.2026 (decyzja 1A): kalendarz z planem tygodnia nad listą sesji — zawsze, także bez historii (planowanie) */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <Btn title={t('Plan tygodnia')} small onPress={() => router.push('/plan')} />
        {/* Docs/12: trening wstecz — jak „Log a past workout” w Strong/Hevy */}
        <Btn title={t('+ Dodaj trening wstecz')} small onPress={() => router.push('/history/add')} />
      </View>
      {/* Runda 69 (wydajność): FlatList renderuje tylko widoczne wiersze — przy 1000+ sesjach ekran otwierał się sekundy. */}
      <FlatList ref={list} data={ws} keyExtractor={w => w.id} initialNumToRender={15} windowSize={7} ListHeaderComponent={<>
        <DeloadHint />{/* 08.10.2026: deload A */}
        <HistoryCalendar byDay={byDay} selected={day} onSelect={setDay} />
        {!hasPlan() ? <Muted style={{ fontSize: 13, marginBottom: 8 }}>{t('Ustaw plan tygodnia, by widzieć zaplanowane treningi i przesuwać je w kalendarzu.')}</Muted> : null}
        {day ? <View testID="day-panel-wrap" onLayout={e => { const first = panelY.current == null; panelY.current = e.nativeEvent.layout.y; if (first) toPanel(); }}><DayPanel day={day} /></View> : null}
        {day ? <View style={{ flexDirection: 'row', marginBottom: 6 }}><Chip label={t('Pokaż wszystkie')} on={false} onPress={() => setDay(null)} /></View> : null}
      </>} renderItem={({ item: w }) => <SwipeRow label={t('Usuń sesję: {name}', { name: `${w.templateName || t('Trening')}, ${fmtDate(w.startedAt)} ${fmtTime(w.startedAt)}` })} title={t('Usunąć tę sesję z historii?')} message={`${w.templateName || t('Trening')}, ${fmtDate(w.startedAt)}`} onDelete={() => deleteWorkout(w.id)}>{a11y => <Item a11y={a11y} title={w.templateName || t('Trening')} sub={(() => { const n = workingSets(w) /* X-15, D3 (audyt 0.10): jak kafelki, Postępy i Zdrowie */; const v = volume(w); return [`${fmtDate(w.startedAt)} ${fmtTime(w.startedAt)}`, fmtDur(workoutDurSec(w)) /* bez pauz (08.10.2026) */, `${n} ${tp(n, 'seria|serie|serii')}`, v ? fmtVol(v) : '', w.deload ? t('deload — mniej serii') /* audyt 0.10 (D1+): trening skrócony w tygodniu deload */ : ''].filter(Boolean).join(' · '); })()} onPress={() => router.push(`/history/${w.id}`)} />}</SwipeRow>} ListEmptyComponent={all.length ? null : <Empty>{t('Jeszcze pusto — pierwszy trening czeka.')}</Empty>} />
    </Screen></SafeAreaView>
  );
}
