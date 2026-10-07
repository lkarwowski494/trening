import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Screen, H1, Item, Btn, Empty, useOnce } from '@/components/ui';
import { getState, useHistTick, exById, newTemplate, deleteTemplate } from '@/lib/store';
import { SwipeRow } from '@/components/SwipeRow';
import { t as tr, exName } from '@/lib/i18n';

export default function TemplatesScreen() {
  useHistTick(); const st = getState(); const router = useRouter(); const once = useOnce();
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}><Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}><H1>{tr('Szablony')}</H1><Btn title={tr('+ Nowy')} small onPress={once(() => { const t = newTemplate(); router.push(`/template/${t.id}`); })} /></View>
      <ScrollView>
        {st.templates.length ? st.templates.map(t => <SwipeRow key={t.id} label={tr('Usuń szablon: {name}', { name: t.name })} title={tr('Usunąć szablon?')} message={t.name} onDelete={() => deleteTemplate(t.id)}>{a11y => <Item a11y={a11y} title={t.name} sub={t.items.map(i => { const e = exById(i.exerciseId); return e ? exName(e) : ''; }).filter(Boolean).slice(0, 4).join(', ') + (t.items.length > 4 ? '…' : '')} onPress={() => router.push(`/template/${t.id}`)} />}</SwipeRow>) : <Empty>{tr('Brak szablonów — dodaj pierwszy.')}</Empty>}
      </ScrollView>
    </Screen></SafeAreaView>
  );
}
