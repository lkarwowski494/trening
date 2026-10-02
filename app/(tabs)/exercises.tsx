import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Screen, H1, Item, Btn, Input, Muted, Empty, useOnce } from '@/components/ui';
import { useHistTick, newExercise, visibleExercises, getState, save, exerciseInHistory } from '@/lib/store';
import { GROUPS } from '@/lib/seed';
import { t, exName, locale, fold } from '@/lib/i18n';

export default function ExercisesScreen() {
  useHistTick(); const router = useRouter(); const once = useOnce(); const [q, setQ] = useState(''); const all = visibleExercises();
  const ql = fold(q.trim());
  const list = [...all].filter(e => !ql || fold(e.name).includes(ql) || fold(exName(e)).includes(ql)).sort((a, b) => GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group) || exName(a).localeCompare(exName(b), locale()));
  // Runda 7: usunięte ćwiczenie z historią można tu przywrócić zamiast tworzyć duplikat (jak w pickerze).
  const archived = ql ? getState().exercises.filter(e => e.archived && (fold(e.name).includes(ql) || fold(exName(e)).includes(ql))) : [];
  let last = ''; const rows: React.ReactNode[] = [];
  list.forEach(e => { if (e.group !== last) { last = e.group; rows.push(<Muted key={'g' + e.group} accessibilityRole="header" style={{ fontSize: 12, fontWeight: '600', paddingTop: 14, paddingBottom: 2 }}>{t(e.group)}</Muted>); }
    rows.push(<Item key={e.id} title={exName(e)} sub={`${t(e.equipment)}${e.bandAssistable ? ' · ' + t('guma') : ''}${e.tempo ? ' · ' + t('tempo') + ' ' + e.tempo : ''}`} onPress={() => router.push(`/exercise/${e.id}`)} />); });
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}><Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}><H1>{t('Ćwiczenia')} <Muted>{all.length}</Muted></H1><Btn title={t('+ Nowe')} small onPress={once(() => { const e = newExercise(); router.push(`/exercise/${e.id}`); })} /></View>
      <Input value={q} onChangeText={setQ} placeholder={t('Szukaj…')} maxLength={80} autoCorrect={false} />
      <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>{archived.map(e => <Item key={'a' + e.id} title={t('Przywróć „{name}”', { name: exName(e) })} sub={exerciseInHistory(e.id) ? t('usunięte ćwiczenie z historią') : t('usunięte ćwiczenie (w bieżącym treningu)')} icon="↺" onPress={() => { e.archived = false; save(e); setQ(''); router.push(`/exercise/${e.id}`); }} />)}{rows.length ? rows : archived.length ? null : <><Empty>{t('Nic nie pasuje.')}</Empty>{ql ? <Btn title={t('Utwórz „{name}”', { name: q.trim() })} block onPress={once(() => { const e = newExercise(q.replace(/\s+/g, ' ').trim()); setQ(''); router.push(`/exercise/${e.id}`); })} /> : null}</>}</ScrollView>
    </Screen></SafeAreaView>
  );
}
