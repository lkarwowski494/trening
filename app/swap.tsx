import React, { useMemo, useRef } from 'react';
import { ScrollView, Pressable, Text } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme } from '@/lib/theme';
import { Screen, Item, Muted, Empty, SectionTitle } from '@/components/ui';
import { getState, useTick, exById, swapBlock, swapImpl, canUndoSwap, locationById } from '@/lib/store';
import { draftOf, useDraftTick, draftSwapExercise, canRestoreExercise, draftRestoreExercise, draftImplChoices, draftSetImpl } from '@/lib/edit';
import { swapCandidates, reasonText, otherImpls, implLabel, parseSwapTarget, SWAP_TOP } from '@/lib/swap';
import { afterSwap, confirmUndoSwap } from '@/components/ActiveWorkout';
import { t, exName } from '@/lib/i18n';
import type { Exercise, Impl, WExercise } from '@/lib/seed';

/**
 * E2 (docs/14 pkt 3.1, 5): arkusz zamiany ćwiczenia.
 *  - trening w toku: „Propozycje” (top-3 rankingu lib/swap.ts z linijką „dlaczego” i „już w treningu”), „Ten sam ruch, inny przyrząd” (D5),
 *    „↺ przywróć: A”, „Cała biblioteka” → picker z celem swap:;
 *  - edytor historii (D6, H1): ten sam arkusz w szkicu — ranking z miejscem szkicu i licznikami sprzed daty treningu, przepięcie całego bloku
 *    (P3 a), poprawka samego przyrządu (P5b a), „↺ przywróć” ćwiczenia z otwarcia szkicu (H8).
 * Okno jak picker: „Anuluj” w nagłówku, blokada podwójnego tapnięcia.
 */
export default function SwapScreen() {
  const raw = useLocalSearchParams<{ target?: string | string[] }>().target; const target = typeof raw === 'string' ? raw : ''; const router = useRouter();
  const th = useTheme(); useTick(); useDraftTick(); const chosen = useRef(false);
  const close = () => { if (router.canGoBack()) router.back(); else router.replace('/'); };
  const headerOpts = useMemo(() => ({ headerRight: () => <Pressable accessibilityRole="button" hitSlop={10} onPress={() => { if (chosen.current) return; chosen.current = true; close(); }}><Text style={{ color: th.accent, fontSize: 17 }}>{t('Anuluj')}</Text></Pressable> }), [th, router]); // eslint-disable-line react-hooks/exhaustive-deps
  const tg = parseSwapTarget(target);
  const d = tg?.kind === 'edit' ? draftOf(tg.key) : undefined; const a = tg?.kind === 'active' ? getState().active : null;
  const w = d ? d.w : a; const e: WExercise | undefined = tg && w ? w.exercises.find(x => x.id === tg.blockId) : undefined; const ex = e ? exById(e.exerciseId) : undefined;
  const gone = <Screen style={{ paddingTop: 10 }}><Stack.Screen options={headerOpts} /><Empty>{t('Tego ćwiczenia nie da się już zamienić.')}</Empty></Screen>;
  if (!tg || !w || !e || (tg.kind === 'active' && (!ex || !e.sets.some(x => !x.done)))) return gone;
  const once = (f: () => void) => { if (chosen.current) return; chosen.current = true; f(); };
  const inW = new Set(w.exercises.map(x => x.exerciseId));
  const props = ex ? swapCandidates(ex.id, { locationId: w.locationId, showAll: false, inWorkout: inW, before: d ? w.startedAt : undefined }).slice(0, SWAP_TOP) : [];
  const pick = (toId: string) => once(() => { if (tg.kind === 'active') { const r = swapBlock(tg.blockId, toId); if (r) afterSwap(r.goneSetIds); } else draftSwapExercise(tg.key, tg.blockId, toId); close(); });
  const impls: Impl[] = !ex ? [] : d ? draftImplChoices(d, e) : otherImpls(ex, locationById(w.locationId), e.impl);
  const pickImpl = (i: Impl) => once(() => { if (tg.kind === 'active') { const r = swapImpl(tg.blockId, i); if (r) afterSwap(r.goneSetIds); } else draftSetImpl(tg.key, tg.blockId, i); close(); });
  /* „↺ przywróć”: w treningu — cofnięcie zamiany (pkt 3.4); w edytorze — stan z otwarcia szkicu (H8) */
  const restore: { ex: Exercise; go: () => void } | null = tg.kind === 'active'
    ? (e.swappedFrom && canUndoSwap(e) ? { ex: exById(e.swappedFrom)!, go: () => { if (chosen.current) return; confirmUndoSwap(tg.blockId, () => { chosen.current = true; close(); }); } } : null)
    : (d && canRestoreExercise(d, e) ? { ex: exById(d.origEx[e.id].exerciseId)!, go: () => once(() => { draftRestoreExercise(tg.key, tg.blockId); close(); }) } : null);
  const libTarget = tg.kind === 'active' ? `swap:active:${tg.blockId}` : `swap:edit:${tg.key}:${tg.blockId}`;
  return (
    <Screen style={{ paddingTop: 10 }}>
      <Stack.Screen options={headerOpts} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Muted style={{ marginBottom: 4 }}>{d ? t('Poprawka zapisu: wszystkie serie bloku „{name}” przejdą pod wybrane ćwiczenie (wartości bez zmian).', { name: ex ? exName(ex) : t('Usunięte ćwiczenie') }) : t('Zamiana tylko w tym treningu: {name}', { name: exName(ex) })}</Muted>
        {restore ? <Item title={t('↺ przywróć: {name}', { name: exName(restore.ex) })} icon="↺" onPress={restore.go} /> : null}
        {ex ? <><SectionTitle>{t('Propozycje')}</SectionTitle>
          {props.length ? props.map((c, i) => { const b = exById(c.exId)!; const sub = [reasonText(c), c.inWorkout ? t('już w treningu') : ''].filter(Boolean).join(' · ');
            return <Item key={c.exId} title={exName(b)} sub={sub} icon="⇄" onPress={() => pick(c.exId)} accessibilityLabel={t('Propozycja {n}: {name}', { n: i + 1, name: exName(b) }) + (sub ? `, ${sub}` : '')} />; })
            : <Empty>{t('Brak podobnych ćwiczeń w tym miejscu — wybierz z całej biblioteki.')}</Empty>}</> : null}
        {ex && impls.length ? <><SectionTitle>{t('Ten sam ruch, inny przyrząd')}</SectionTitle>
          {impls.map(i => <Item key={i} title={`${exName(ex)} — ${implLabel(i)}`} sub={e.impl ? t('zamiast: {name}', { name: implLabel(e.impl) }) : undefined} icon="⇄" onPress={() => pickImpl(i)} accessibilityLabel={t('Inny przyrząd: {impl}', { impl: implLabel(i) })} />)}</> : null}
        <SectionTitle>{t('Inne')}</SectionTitle>
        <Item title={t('Cała biblioteka')} sub={ex ? t('wszystkie ćwiczenia z tą samą miarą') : undefined} onPress={() => once(() => router.replace(`/picker?target=${libTarget}`))} />
      </ScrollView>
    </Screen>
  );
}
