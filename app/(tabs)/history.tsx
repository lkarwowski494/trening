import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, H1, Item, Muted, Empty, Btn, Chip } from '@/components/ui';
import { wallTs, workoutDurSec, noClock, whenText, useHistTick, finishedWorkouts, fmtDur, volume, deleteWorkout, workingSets } from '@/lib/store';
import { SwipeRow } from '@/components/SwipeRow';
import { PlanningButton } from '@/components/HeaderActions';
import { sessionDelete } from '@/components/sessionDelete';
import { HistoryCalendar } from '@/components/HistoryCalendar';
import { DayPanel } from '@/components/DayPanel';
import { DeloadHint } from '@/components/DeloadHint';
import { workoutsByDay } from '@/lib/calendar';
import { locationLabel } from '@/lib/locations';
import { t, tp } from '@/lib/i18n';
import { font, SPACE } from '@/lib/theme';
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
      {/* M3 p3 (W1 c, decyzja STOP 3): „Planowanie” w nagłówku, w tym samym miejscu co na ekranie Trening (PlanningButton, prawy górny róg przy tytule) */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: SPACE.s + 2 }}><H1>{t('Plan')}</H1><PlanningButton label={t('Planowanie')} onPress={() => router.push('/plan')} /></View>
      {/* 08.10.2026 (decyzja 1A): kalendarz z planem tygodnia nad listą sesji — zawsze, także bez historii (planowanie) */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACE.s, marginBottom: SPACE.s, flexWrap: 'wrap' }}>
        {/* Docs/12: trening wstecz — jak w popularnych aplikacjach treningowych */}
        <Btn nav title={t('Dopisz trening wstecz')} small onPress={() => router.push('/history/add')} />
        <Muted>{all.length} {tp(all.length, 'sesja|sesje|sesji')}</Muted>
      </View>
      {/* Runda 69 (wydajność): FlatList renderuje tylko widoczne wiersze — przy 1000+ sesjach ekran otwierał się sekundy. */}
      <FlatList ref={list} data={ws} keyExtractor={w => w.id} initialNumToRender={15} windowSize={7} ListHeaderComponent={<>
        <DeloadHint />{/* 08.10.2026: deload A */}
        <HistoryCalendar byDay={byDay} selected={day} onSelect={setDay} onMonth={(y, m) => { setDay(null); setMonth({ y, m }); }} />
        {day ? <View testID="day-panel-wrap" onLayout={e => { const first = panelY.current == null; panelY.current = e.nativeEvent.layout.y; if (first) toPanel(); }}><DayPanel day={day} /></View> : null}
        {day || month ? <View style={{ flexDirection: 'row', marginBottom: 6 }}><Chip label={t('Pokaż wszystkie')} on={false} onPress={() => { setDay(null); setMonth(null); }} /></View> : null}
        {!day && month && !ws.length && all.length ? <Muted style={{ ...font('footnote'), marginBottom: SPACE.s }}>{t('Brak treningów w tym miesiącu.')}</Muted> : null}
      </>} renderItem={({ item: w, index }) => { const del = sessionDelete(w) /* jedno okno dla gestu i przycisku w szczegółach (M3 p3, ZM-04) */; return <SwipeRow testID={`session-${index}`} /* E2E 28 */ label={del.label} title={del.title} message={del.message} onDelete={() => deleteWorkout(w.id)}>{a11y => <Item a11y={a11y} title={w.templateName || t('Trening')} sub={(() => { const n = workingSets(w) /* X-15, D3 (audyt 0.10): jak kafelki, Postępy i Zdrowie */; const v = volume(w); return [whenText(w), noClock(w) ? t('godzina nieznana') /* audyt 0.13: import bez godzin */ : fmtDur(workoutDurSec(w)) /* bez pauz (08.10.2026) */, `${n} ${tp(n, 'seria|serie|serii')}`, v ? fmtVol(v) : '', w.locationId ? locationLabel(w.locationId) /* T-057 */ : '', w.deload ? t('deload — mniej serii') /* audyt 0.10 (D1+): trening skrócony w tygodniu deload */ : ''].filter(Boolean).join(' · '); })()} onPress={() => router.push(`/history/${w.id}`)} />}</SwipeRow>; }} ListEmptyComponent={all.length ? null : <Empty>{t('Jeszcze pusto — pierwszy trening czeka.')}</Empty>} />
    </Screen></SafeAreaView>
  );
}
