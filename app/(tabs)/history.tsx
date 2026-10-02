import React from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Screen, H1, Item, Muted, Empty } from '@/components/ui';
import { useHistTick, finishedWorkouts, fmtDate, fmtTime, fmtDur, volume } from '@/lib/store';
import { t, tp } from '@/lib/i18n';
import { fmtVol } from '@/lib/units';

export default function HistoryScreen() {
  useHistTick(); const ws = finishedWorkouts(); const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}><Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}><H1>{t('Historia')}</H1><Muted>{ws.length} {tp(ws.length, 'sesja|sesje|sesji')}</Muted></View>
      {/* Runda 69 (wydajność): FlatList renderuje tylko widoczne wiersze — przy 1000+ sesjach ekran otwierał się sekundy. */}
      {ws.length ? <FlatList data={ws} keyExtractor={w => w.id} initialNumToRender={15} windowSize={7} renderItem={({ item: w }) => <Item title={w.templateName || t('Trening')} sub={(() => { const n = w.exercises.reduce((a, e) => a + e.sets.filter(s => s.kind !== 'warmup').length, 0); const v = volume(w); return [`${fmtDate(w.startedAt)} ${fmtTime(w.startedAt)}`, fmtDur(((w.finishedAt ?? w.startedAt) - w.startedAt) / 1000), `${n} ${tp(n, 'seria|serie|serii')}`, v ? fmtVol(v) : ''].filter(Boolean).join(' · '); })()} onPress={() => router.push(`/history/${w.id}`)} />} /> : <Empty>{t('Jeszcze pusto — pierwszy trening czeka.')}</Empty>}
    </Screen></SafeAreaView>
  );
}
