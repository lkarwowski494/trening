import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { F } from '@/lib/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Screen, H1, Item, Btn, Input, Muted, Empty, useOnce } from '@/components/ui';
import { useHistTick, newExercise, visibleExercises, getState, save, exerciseInHistory, usesBand, restoreExercise, deleteExercise, exercisesInUse, inCoreList, libShowAll, setLibShowAll } from '@/lib/store';
import { LibScopeChip } from '@/components/LibScope';
import { SwipeRow } from '@/components/SwipeRow';
import { GROUPS } from '@/lib/seed';
import { t, exName, locale, fold } from '@/lib/i18n';

export default function ExercisesScreen() {
  useHistTick(); const router = useRouter(); const once = useOnce(); const [q, setQ] = useState(''); const all = visibleExercises();
  const ql = fold(q.trim());
  /* research biblioteki (decyzja 09.10.2026, wariant B): domyślnie podstawowe + własne + użyte; niszowe — wyszukiwaniem albo po zdjęciu filtra */
  const [libAll, setLibAll] = useState(libShowAll()); const used = exercisesInUse(); let nicheHidden = 0;
  const list = [...all].filter(e => !ql || fold(e.name).includes(ql) || fold(exName(e)).includes(ql)).filter(e => { if (libAll || ql || inCoreList(e, used)) return true; nicheHidden++; return false; }).sort((a, b) => GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group) || exName(a).localeCompare(exName(b), locale()));
  // Runda 7: usunięte ćwiczenie z historią można tu przywrócić zamiast tworzyć duplikat (jak w pickerze).
  const archived = ql ? getState().exercises.filter(e => e.archived && (fold(e.name).includes(ql) || fold(exName(e)).includes(ql))) : [];
  let last = ''; const rows: React.ReactNode[] = [];
  list.forEach(e => { if (e.group !== last) { last = e.group; rows.push(<Muted key={'g' + e.group} accessibilityRole="header" style={{ fontSize: 12, fontFamily: F.semibold, paddingTop: 14, paddingBottom: 2 }}>{t(e.group)}</Muted>); }
    /* 07.10.2026 wieczór: usuwanie przesunięciem w lewo (z ekranu ćwiczenia przycisk zniknął); treść potwierdzenia jak wcześniej (runda 40) */
    rows.push(<SwipeRow key={e.id} label={t('Usuń z biblioteki: {name}', { name: exName(e) })} title={t('Usunąć ćwiczenie?')} message={[exerciseInHistory(e.id) ? t('Zniknie z list i szablonów; historia, wykresy i eksport zostaną.') : t('Zniknie z list i szablonów.'), getState().active?.exercises.some(x => x.exerciseId === e.id) ? t('W trwającym treningu zostanie oznaczone jako usunięte.') : ''].filter(Boolean).join(' ')} onDelete={() => { const cur = getState().exercises.find(x => x.id === e.id); if (cur && !cur.archived) deleteExercise(e.id); }}>{a11y => <Item a11y={a11y} title={exName(e)} sub={`${t(e.equipment)}${usesBand(e) ? ' · ' + t('guma') : ''}${e.tempo ? ' · ' + t('tempo') + ' ' + e.tempo : ''}`} onPress={() => router.push(`/exercise/${e.id}`)} />}</SwipeRow>); });
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}><Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}><H1>{t('Ćwiczenia')} <Muted>{list.length}</Muted></H1><Btn title={t('+ Nowe')} small onPress={once(() => { const e = newExercise(); router.push(`/exercise/${e.id}`); })} /></View>
      <Input value={q} onChangeText={setQ} placeholder={t('Szukaj…')} maxLength={80} autoCorrect={false} />
      <LibScopeChip all={libAll} hidden={nicheHidden} searching={!!ql} onToggle={() => { const v = !libAll; setLibAll(v); setLibShowAll(v); }} />
      <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>{archived.map(e => <Item key={'a' + e.id} title={t('Przywróć „{name}”', { name: exName(e) })} sub={exerciseInHistory(e.id) ? t('usunięte ćwiczenie z historią') : t('usunięte ćwiczenie (w bieżącym treningu)')} icon="↺" onPress={() => { restoreExercise(e); setQ(''); router.push(`/exercise/${e.id}`); }} />)}{rows.length ? rows : archived.length ? null : <><Empty>{t('Nic nie pasuje.')}</Empty>{ql ? <Btn title={t('Utwórz „{name}”', { name: q.trim() })} block onPress={once(() => { const e = newExercise(q.replace(/\s+/g, ' ').trim()); setQ(''); router.push(`/exercise/${e.id}`); })} /> : null}</>}</ScrollView>
    </Screen></SafeAreaView>
  );
}
