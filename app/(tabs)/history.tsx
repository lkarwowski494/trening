import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, H1, Item, Muted, Empty, Btn, Chip } from '@/components/ui';
import { wallTs, getState, setPlanHintHidden, workoutDurSec, useHistTick, finishedWorkouts, fmtDate, fmtTime, fmtDur, volume, deleteWorkout, workingSets } from '@/lib/store';
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
  const [day, setDay] = useState<string | null>(null); const byDay = workoutsByDay(all);
  /* UX-16 A (audyt 0.10): po przewinięciu kalendarza na inny miesiąc lista pokazuje sesje tego miesiąca („Pokaż wszystkie” wraca do całej historii);
   * bez przewijania — wszystkie sesje (jak dotąd) */
  const [month, setMonth] = useState<{ y: number; m: number } | null>(null);
  const inMonth = (w: Workout) => { const d = new Date(wallTs(w)) /* J3: dzień w strefie treningu */; return !!month && d.getFullYear() === month.y && d.getMonth() === month.m; };
  const ws = day ? byDay.get(day) ?? [] : month ? all.filter(inMonth) : all;
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
        <Btn nav title={t('Plan tygodnia')} small onPress={() => router.push('/plan')} />
        {/* Docs/12: trening wstecz — jak w popularnych aplikacjach treningowych */}
        <Btn nav title={t('+ Dodaj trening wstecz')} small onPress={() => router.push('/history/add')} />
      </View>
      {/* Runda 69 (wydajność): FlatList renderuje tylko widoczne wiersze — przy 1000+ sesjach ekran otwierał się sekundy. */}
      <FlatList ref={list} data={ws} keyExtractor={w => w.id} initialNumToRender={15} windowSize={7} ListHeaderComponent={<>
        <DeloadHint />{/* 08.10.2026: deload A */}
        <HistoryCalendar byDay={byDay} selected={day} onSelect={setDay} onMonth={(y, m) => { setDay(null); setMonth({ y, m }); }} />
        {!hasPlan() && !getState().planHintHidden ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}><Muted style={{ fontSize: 13, flex: 1 }}>{t('Ustaw plan tygodnia, by widzieć zaplanowane treningi i przesuwać je w kalendarzu.')}</Muted><Btn small kind="ghost" title={t('Ukryj')} accessibilityLabel={t('Ukryj zachętę do planu tygodnia')} onPress={() => setPlanHintHidden(true)} /></View> : null /* UX-16 A (audyt 0.10) */}
        {day ? <View testID="day-panel-wrap" onLayout={e => { const first = panelY.current == null; panelY.current = e.nativeEvent.layout.y; if (first) toPanel(); }}><DayPanel day={day} /></View> : null}
        {day || month ? <View style={{ flexDirection: 'row', marginBottom: 6 }}><Chip label={t('Pokaż wszystkie')} on={false} onPress={() => { setDay(null); setMonth(null); }} /></View> : null}
        {!day && month && !ws.length && all.length ? <Muted style={{ fontSize: 13, marginBottom: 8 }}>{t('Brak treningów w tym miesiącu.')}</Muted> : null}
      </>} renderItem={({ item: w }) => <SwipeRow label={t('Usuń sesję: {name}', { name: `${w.templateName || t('Trening')}, ${fmtDate(wallTs(w))} ${fmtTime(wallTs(w))}` })} title={t('Usunąć tę sesję z historii?')} message={[`${w.templateName || t('Trening')}, ${fmtDate(wallTs(w))}`, w.healthUUID ? t('Kopia w Apple Health zostanie — usuniesz ją w aplikacji Zdrowie.') : ''].filter(Boolean).join('\n') /* G3 (audyt 0.10 DAT-09) */} onDelete={() => deleteWorkout(w.id)}>{a11y => <Item a11y={a11y} title={w.templateName || t('Trening')} sub={(() => { const n = workingSets(w) /* X-15, D3 (audyt 0.10): jak kafelki, Postępy i Zdrowie */; const v = volume(w); return [`${fmtDate(wallTs(w))} ${fmtTime(wallTs(w))}`, fmtDur(workoutDurSec(w)) /* bez pauz (08.10.2026) */, `${n} ${tp(n, 'seria|serie|serii')}`, v ? fmtVol(v) : '', w.deload ? t('deload — mniej serii') /* audyt 0.10 (D1+): trening skrócony w tygodniu deload */ : ''].filter(Boolean).join(' · '); })()} onPress={() => router.push(`/history/${w.id}`)} />}</SwipeRow>} ListEmptyComponent={all.length ? null : <Empty>{t('Jeszcze pusto — pierwszy trening czeka.')}</Empty>} />
    </Screen></SafeAreaView>
  );
}
