import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Screen, H1, Item, Btn, Empty, useOnce, SectionTitle, Muted } from '@/components/ui';
import { Pressable } from 'react-native';
import { getState, useHistTick, exById, newTemplate, deleteTemplate, templateGroups, archivedTemplates } from '@/lib/store';
import type { Template } from '@/lib/seed';
import { SwipeRow } from '@/components/SwipeRow';
import { t as tr, exName } from '@/lib/i18n';

export default function TemplatesScreen() {
  useHistTick(); const st = getState(); const router = useRouter(); const once = useOnce(); const [showArch, setShowArch] = useState(false); const arch = archivedTemplates();
  const row = (t: Template) => <SwipeRow key={t.id} label={tr('Usuń szablon: {name}', { name: t.name })} title={tr('Usunąć szablon?')} message={t.name} onDelete={() => deleteTemplate(t.id)}>{a11y => <Item a11y={a11y} title={t.name} sub={t.items.map(i => { const e = exById(i.exerciseId); return e ? exName(e) : ''; }).filter(Boolean).slice(0, 4).join(', ') + (t.items.length > 4 ? '…' : '')} onPress={() => router.push(`/template/${t.id}`)} />}</SwipeRow>;
  /* 07.10.2026 wieczór (docs/21 4a): foldery jako nagłówki, archiwum zwinięte na dole; przenosi i archiwizuje tylko użytkownik (edytor szablonu) */
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}><Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}><H1>{tr('Szablony')}</H1><Btn title={tr('+ Nowy')} small onPress={once(() => { const t = newTemplate(); router.push(`/template/${t.id}`); })} /></View>
      <Btn title={tr('Wygeneruj szablony i plan')} small onPress={() => router.push('/generator')} style={{ alignSelf: 'flex-start', marginBottom: 8 }} />{/* 08.10.2026: generator na polecenie (docs/24) */}
      <ScrollView>
        {st.templates.length ? <>
          {templateGroups().map(g => <React.Fragment key={g.folder ?? ''}>{g.folder ? <SectionTitle>{g.folder}</SectionTitle> : null}{g.items.map(row)}</React.Fragment>)}
          {arch.length ? <Pressable accessibilityRole="button" accessibilityLabel={tr('Archiwum ({n})', { n: arch.length })} accessibilityState={{ expanded: showArch }} onPress={() => setShowArch(v => !v)} style={{ paddingVertical: 12 }}><Muted style={{ fontSize: 13 }}>{`${showArch ? '▾' : '▸'} ${tr('Archiwum ({n})', { n: arch.length })}`}</Muted></Pressable> : null}
          {showArch ? arch.map(row) : null}
        </> : <Empty>{tr('Brak szablonów — dodaj pierwszy.')}</Empty>}
      </ScrollView>
    </Screen></SafeAreaView>
  );
}
