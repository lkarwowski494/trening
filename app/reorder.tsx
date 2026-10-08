import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, Btn, Muted, Txt, Empty } from '@/components/ui';
import { DragList, DragScroll } from '@/components/DragList';
import { getState, useTick, exById, groupLabels, blockRanges, moveBlockOf, moveInGroup, occurrence, occurrences, workCount, workSetCount, tplRows, type Grouped } from '@/lib/store';
import { useTheme, F } from '@/lib/theme';
import { t, tp, exName } from '@/lib/i18n';
import type { Base, TemplateItem, WSet } from '@/lib/seed';

/*
 * T-010 (02.10.2026): kolejność ćwiczeń przeciąganiem — w szablonie i w trakcie treningu (target = 'active' | 'template:<id>').
 * Zwarta lista samych nazw: wysokie wiersze z polami serii przeciągałoby się źle. Superset przesuwa się w całości (uchwyt przy
 * „SS A”), a kolejność w nim — uchwytami przy ćwiczeniach. Członkostwo w supersetach się tu nie zmienia. Każde upuszczenie
 * zapisuje się od razu, jak reszta aplikacji; strzałki ↑/↓ w edytorze szablonu zostają.
 */
type Row = Grouped & { id: string; exerciseId: string };
export default function ReorderScreen() {
  useTick(); const th = useTheme(); const router = useRouter();
  const raw = useLocalSearchParams<{ target?: string | string[] }>().target; const target = typeof raw === 'string' ? raw : '';
  const st = getState(); const tpl = target.startsWith('template:') ? st.templates.find(x => x.id === target.slice(9)) : undefined;
  const owner: Base | null | undefined = target === 'active' ? st.active : tpl;
  const list: Row[] | undefined = target === 'active' ? st.active?.exercises : tpl?.items;
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/'); };
  if (!list || !owner) return <Screen><Empty>{target === 'active' ? t('Nie ma treningu w toku.') : t('Nie ma takiego szablonu.')}</Empty><Btn title={t('Wróć')} block style={{ marginTop: 12 }} onPress={back} /></Screen>;

  const labels = groupLabels(list);
  const name = (r: Row) => { const ex = exById(r.exerciseId); const base = ex ? exName(ex) : t('Usunięte ćwiczenie'); const i = list.indexOf(r); return occurrences(list, r.exerciseId) > 1 ? `${base} (${occurrence(list, i) + 1})` : base; };
  /* UI-13 / D3 (audyt 0.10): serie robocze jak w Treningu i edytorze — bez rozgrzewek, drop razem z serią (store.workCount) */
  const sub = (r: Row) => { if ('sets' in r && Array.isArray(r.sets)) { const sets = r.sets as WSet[]; const n = workCount(sets.map(x => x.kind)), d = workSetCount(sets); return `${n} ${tp(n, 'seria|serie|serii')}${d ? ` · ✓ ${d}` : ''}`; } const n = workCount(tplRows(r as unknown as TemplateItem).map(x => x.kind)); return `${n} ${tp(n, 'seria|serie|serii')}`; };
  const blocks = blockRanges(list).map(([s, e]) => list.slice(s, e + 1));
  const card = (dragging: boolean) => ({ backgroundColor: dragging ? th.surface2 : th.surface, borderColor: dragging ? th.accent : th.line, borderWidth: 1, borderRadius: 10, marginBottom: 8, overflow: 'hidden' as const });
  const line = (r: Row, handle: React.ReactNode, small?: boolean) => <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48, paddingRight: 12 }}>{handle}<View style={{ flex: 1 }}><Txt style={{ fontFamily: small ? F.regular : F.semibold }}>{name(r)}</Txt><Muted style={{ fontSize: 12 }}>{sub(r)}</Muted></View></View>;
  return (
    <Screen>
      <DragScroll contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
        <Muted style={{ fontSize: 13, marginBottom: 10 }}>{t('Przeciągnij za ≡, żeby zmienić kolejność. Superset przesuwa się w całości; kolejność w nim zmienisz uchwytami przy ćwiczeniach.')}</Muted>
        <DragList items={blocks} keyOf={b => b[0].groupId ? 'g:' + b[0].groupId : 'i:' + b[0].id} label={b => b[0].groupId ? `${t('superset')} ${labels[b[0].groupId]}: ${b.map(name).join(', ')}` : name(b[0])}
          onMove={(k, to) => { const b = blocks.find(x => (x[0].groupId ? 'g:' + x[0].groupId : 'i:' + x[0].id) === k); return !!b && moveBlockOf(list, b[0].id, to, owner); }}
          renderItem={(b, handle, dragging) => b[0].groupId ? <View style={card(dragging)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 44 }}>{handle}<Txt style={{ color: th.band, fontFamily: F.semibold }}>{`SS ${labels[b[0].groupId]}`}</Txt><Muted style={{ fontSize: 12 }}>{` · ${b.length} ${tp(b.length, 'ćwiczenie|ćwiczenia|ćwiczeń')}`}</Muted></View>
            <View style={{ borderTopWidth: 1, borderTopColor: th.line, marginLeft: 12 }}>
              <DragList items={b} keyOf={r => 'i:' + r.id} label={name} onMove={(k, to) => moveInGroup(list, k.slice(2), to, owner)} renderItem={(r, h, dr) => <View style={{ backgroundColor: dr ? th.surface2 : th.surface }}>{line(r, h, true)}</View>} />
            </View>
          </View> : <View style={card(dragging)}>{line(b[0], handle)}</View>} />
        <Btn title={t('Gotowe')} kind="primary" block style={{ marginTop: 12 }} onPress={back} />
      </DragScroll>
    </Screen>
  );
}
