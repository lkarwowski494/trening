import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, Pressable, Text } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTheme, F } from '@/lib/theme';
import { Screen, Input, Item, Btn, Muted, SectionTitle, Empty, useOnce } from '@/components/ui';
import { getState, useTick, finishedWorkouts, templateGroups, wallTs, fmtDate, tplWorkSets } from '@/lib/store';
import { startTemplate } from '@/lib/start';
import { t, tp, fold, lang } from '@/lib/i18n';

/*
 * Wybór szablonu do startu (docs/22 P2 B, decyzja właściciela 11.10.2026): „Z szablonu” w arkuszu „Inny trening” otwiera ten pełnoekranowy wybór
 * (wzorem „Wybierz ćwiczenie”) — foldery jak na liście szablonów (bez zarchiwizowanych), przy każdym szablonie „Start”, a wiersz otwiera podgląd.
 * Start tymi samymi funkcjami co duży przycisk i arkusz (lib/start.startTemplate: pytanie o deload, strażnik treningu w toku). Wyszukiwarka
 * pojawia się od SEARCH_MIN szablonów (przy kilku zajmowałaby tylko miejsce). Zastąpił listę „Zacznij z szablonu” na dole ekranu głównego.
 */
export const SEARCH_MIN = 6;

export default function PickTemplateScreen() {
  useTick(); const th = useTheme(); const router = useRouter(); const once = useOnce(); const [q, setQ] = useState(''); const chosen = useRef(false);
  const headerOpts = useMemo(() => ({ headerRight: () => <Pressable accessibilityLanguage={lang()} accessibilityRole="button" hitSlop={10} onPress={() => { if (chosen.current) return; chosen.current = true; if (router.canGoBack()) router.back(); else router.replace('/'); }}><Text accessibilityLanguage={lang()} style={{ color: th.accent, fontSize: 17, fontFamily: F.regular }}>{t('Anuluj')}</Text></Pressable> }), [th, router]); // eslint-disable-line react-hooks/exhaustive-deps
  const fin = finishedWorkouts(); const all = templateGroups(); const total = all.reduce((a, g) => a + g.items.length, 0); const ql = fold(q.trim());
  const groups = all.map(g => ({ ...g, items: g.items.filter(x => !ql || fold(x.name).includes(ql)) })).filter(g => g.items.length);
  const goHome = () => { if (router.canDismiss()) router.dismissAll(); router.navigate('/'); }; /* jak „Start” w podglądzie szablonu */
  return (
    <Screen style={{ paddingTop: 10 }}>
      <Stack.Screen options={headerOpts} />
      {total >= SEARCH_MIN ? <Input value={q} onChangeText={setQ} placeholder={t('Szukaj szablonu…')} accessibilityLabel={t('Szukaj szablonu…')} maxLength={80} autoCorrect={false} /> : null}
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
        {!total ? <Empty>{t('Nie masz jeszcze szablonów.')}</Empty> : !groups.length ? <Empty>{t('Nic nie pasuje.')}</Empty> : null}
        {groups.map(g => <React.Fragment key={g.folder ?? ''}>{g.folder ? <SectionTitle>{g.folder}</SectionTitle> : null}{g.items.map(tpl => { const lw = fin.find(x => x.templateId === tpl.id); const sets = tplWorkSets(tpl); return (
          <Item key={tpl.id} title={tpl.name} sub={`${tpl.items.length} ${t('ćw.')} · ${sets} ${tp(sets, 'seria|serie|serii')}${lw ? ' · ' + t('ostatnio') + ' ' + fmtDate(wallTs(lw)) : ''}`} onPress={() => router.push(`/template/${tpl.id}`)}
            right={tpl.items.length ? <Btn title={t('Start')} kind="primary" small accessibilityLabel={t('Start: {name}', { name: tpl.name })} onPress={once(() => { if (chosen.current) return; if (getState().active) { chosen.current = true; goHome(); return; } startTemplate(tpl, () => { chosen.current = true; goHome(); }); })} /> : undefined} />); })}</React.Fragment>)}
        {total && groups.length ? <Muted style={{ fontSize: 12, marginTop: 8 }}>{t('Wiersz otwiera podgląd szablonu, „Start” zaczyna trening.')}</Muted> : null}
      </ScrollView>
    </Screen>
  );
}
