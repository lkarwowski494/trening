import React, { useMemo, useRef } from 'react';
import { ScrollView, Pressable, Text } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme } from '@/lib/theme';
import { Screen, Item, Muted, Empty, SectionTitle } from '@/components/ui';
import { getState, useTick, exById, swapBlock, canUndoSwap } from '@/lib/store';
import { swapCandidates, reasonText, SWAP_TOP } from '@/lib/swap';
import { afterSwap, confirmUndoSwap } from '@/components/ActiveWorkout';
import { t, exName } from '@/lib/i18n';

/**
 * E2 (docs/14 pkt 3.1): arkusz zamiany ćwiczenia. target = 'active:<id bloku>' (trening w toku).
 * „Propozycje” — top-3 rankingu (lib/swap.ts) z linijką „dlaczego” i dopiskiem „już w treningu”; „Cała biblioteka” → picker z celem swap:;
 * „↺ przywróć: A” na górze, gdy blok jest zamiennikiem (to samo co „cofnij”). Okno jak picker: „Anuluj” w nagłówku, blokada podwójnego tapnięcia.
 */
export default function SwapScreen() {
  const raw = useLocalSearchParams<{ target?: string | string[] }>().target; const target = typeof raw === 'string' ? raw : ''; const router = useRouter();
  const th = useTheme(); useTick(); const chosen = useRef(false);
  const close = () => { if (router.canGoBack()) router.back(); else router.replace('/'); };
  const headerOpts = useMemo(() => ({ headerRight: () => <Pressable accessibilityRole="button" hitSlop={10} onPress={() => { if (chosen.current) return; chosen.current = true; close(); }}><Text style={{ color: th.accent, fontSize: 17 }}>{t('Anuluj')}</Text></Pressable> }), [th, router]); // eslint-disable-line react-hooks/exhaustive-deps
  const a = getState().active; const blockId = target.startsWith('active:') ? target.slice(7) : '';
  const e = a && blockId ? a.exercises.find(x => x.id === blockId) : undefined; const ex = e ? exById(e.exerciseId) : undefined;
  if (!a || !e || !ex || !e.sets.some(x => !x.done)) return <Screen style={{ paddingTop: 10 }}><Stack.Screen options={headerOpts} /><Empty>{t('Tego ćwiczenia nie da się już zamienić.')}</Empty></Screen>;
  const inW = new Set(a.exercises.map(x => x.exerciseId));
  const props = swapCandidates(ex.id, { locationId: a.locationId, showAll: false, inWorkout: inW }).slice(0, SWAP_TOP);
  const pick = (toId: string) => { if (chosen.current) return; chosen.current = true; const r = swapBlock(blockId, toId); if (r) afterSwap(r.goneSetIds); close(); };
  const orig = e.swappedFrom ? exById(e.swappedFrom) : undefined;
  return (
    <Screen style={{ paddingTop: 10 }}>
      <Stack.Screen options={headerOpts} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Muted style={{ marginBottom: 4 }}>{t('Zamiana tylko w tym treningu: {name}', { name: exName(ex) })}</Muted>
        {orig && canUndoSwap(e) ? <Item title={t('↺ przywróć: {name}', { name: exName(orig) })} icon="↺" onPress={() => { if (chosen.current) return; confirmUndoSwap(blockId, () => { chosen.current = true; close(); }); }} /> : null}
        <SectionTitle>{t('Propozycje')}</SectionTitle>
        {props.length ? props.map((c, i) => { const b = exById(c.exId)!; const sub = [reasonText(c), c.inWorkout ? t('już w treningu') : ''].filter(Boolean).join(' · ');
          return <Item key={c.exId} title={exName(b)} sub={sub} icon="⇄" onPress={() => pick(c.exId)} accessibilityLabel={t('Propozycja {n}: {name}', { n: i + 1, name: exName(b) }) + (sub ? `, ${sub}` : '')} />; })
          : <Empty>{t('Brak podobnych ćwiczeń w tym miejscu — wybierz z całej biblioteki.')}</Empty>}
        <SectionTitle>{t('Inne')}</SectionTitle>
        <Item title={t('Cała biblioteka')} sub={t('wszystkie ćwiczenia z tą samą miarą')} onPress={() => { if (chosen.current) return; chosen.current = true; router.replace(`/picker?target=swap:active:${blockId}`); }} />
      </ScrollView>
    </Screen>
  );
}
