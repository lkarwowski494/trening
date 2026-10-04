import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme } from '@/lib/theme';
import { Screen, Item, Muted, Empty, SectionTitle, Chip, Input } from '@/components/ui';
import { getState, useTick, exById, swapBlock, swapImpl, canUndoSwap, locationById, visibleExercises, newExercise, save, exerciseInHistory } from '@/lib/store';
import { availability, capsOf, missingLabel } from '@/lib/equipment';
import { draftOf, useDraftTick, draftSwapExercise, canRestoreExercise, draftRestoreExercise, draftImplChoices, draftSetImpl, swapTargetOk } from '@/lib/edit';
import { swapCandidates, reasonText, otherImpls, implLabel, parseSwapTarget, SWAP_TOP } from '@/lib/swap';
import { afterSwap, confirmUndoSwap } from '@/components/ActiveWorkout';
import { t, exName, locale, fold } from '@/lib/i18n';
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
  /* „Inne” (decyzja właściciela 04.10.2026): rozwijana lista z filtrami-etykietami partii i miejsca, które da się zdjąć (✕) */
  const [open, setOpen] = useState(false); const [grpOn, setGrpOn] = useState(true); const [locOn, setLocOn] = useState(true); const [q, setQ] = useState('');
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
  const place = locationById(w.locationId); const caps = place ? capsOf(place) : null; const ql = fold(q.trim());
  const okEx = (b: Exercise) => d ? swapTargetOk(d, e, b, b.archived === true) : !!ex && b.id !== ex.id && (b.metric ?? 'weight_reps') === (ex.metric ?? 'weight_reps');
  const hit = (b: Exercise) => !!ql && (fold(b.name).includes(ql) || fold(exName(b)).includes(ql));
  /* audyt 04.10 (MEDIUM 2): jak w pickerze — „Przywróć …” usuniętego ćwiczenia (z historią) i „Utwórz …” z miarą bieżącego ćwiczenia */
  const archived = open && ql ? getState().exercises.filter(b => b.archived && okEx(b) && hit(b)) : [];
  const exact = (b: Exercise) => fold(b.name) === ql || fold(exName(b)) === ql;
  const canCreate = open && !!ql && !getState().exercises.some(exact);
  const others = open ? visibleExercises().filter(b => okEx(b) && (!grpOn || !ex || b.group === ex.group) && (!locOn || !caps || availability(b, place, caps).ok) && (!ql || fold(b.name).includes(ql) || fold(exName(b)).includes(ql)))
    .sort((x, y) => exName(x).localeCompare(exName(y), locale())) : [];
  return (
    <Screen style={{ paddingTop: 10 }}>
      <Stack.Screen options={headerOpts} />
      <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingBottom: 40 }} /* audyt 04.10 (MEDIUM 1): tapnięcie w wynik przy otwartej klawiaturze działa za pierwszym razem */>
        <Muted style={{ marginBottom: 4 }}>{d ? t('Poprawka zapisu: wszystkie serie bloku „{name}” przejdą pod wybrane ćwiczenie (wartości bez zmian).', { name: ex ? exName(ex) : t('Usunięte ćwiczenie') }) : t('Zamiana tylko w tym treningu: {name}', { name: exName(ex) })}</Muted>
        {restore ? <Item title={t('↺ przywróć: {name}', { name: exName(restore.ex) })} icon="↺" onPress={restore.go} /> : null}
        {ex ? <><SectionTitle>{t('Propozycje')}</SectionTitle>
          {props.length ? props.map((c, i) => { const b = exById(c.exId)!; const sub = [reasonText(c), c.inWorkout ? t('już w treningu') : ''].filter(Boolean).join(' · ');
            return <Item key={c.exId} title={exName(b)} sub={sub} icon="⇄" onPress={() => pick(c.exId)} accessibilityLabel={t('Propozycja {n}: {name}', { n: i + 1, name: exName(b) }) + (sub ? `, ${sub}` : '')} />; })
            : <Empty>{t('Brak podobnych ćwiczeń w tym miejscu — rozwiń „Inne”.')}</Empty>}</> : null}
        {ex && impls.length ? <><SectionTitle>{t('Ten sam ruch, inny przyrząd')}</SectionTitle>
          {impls.map(i => <Item key={i} title={`${exName(ex)} — ${implLabel(i)}`} sub={e.impl ? t('zamiast: {name}', { name: implLabel(e.impl) }) : undefined} icon="⇄" onPress={() => pickImpl(i)} accessibilityLabel={t('Inny przyrząd: {impl}', { impl: implLabel(i) })} />)}</> : null}
        <SectionTitle>{t('Inne')}</SectionTitle>
        <Item title={open ? t('Inne ▴') : t('Inne ▾')} sub={t('lista ćwiczeń z filtrami, które możesz zdjąć')} onPress={() => setOpen(x => !x)} icon={open ? '▴' : '▾'} accessibilityLabel={open ? t('Zwiń inne ćwiczenia') : t('Pokaż inne ćwiczenia')} />
        {open ? <View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 }}>
            {ex ? <Chip label={grpOn ? `${t(ex.group)} ✕` : `+ ${t(ex.group)}`} on={grpOn} onPress={() => setGrpOn(x => !x)} a11yLabel={grpOn ? t('Filtr partii: {g}. Tapnij, by zdjąć.', { g: t(ex.group) }) : t('Filtr partii wyłączony: {g}. Tapnij, by włączyć.', { g: t(ex.group) })} /> : null}
            {place ? <Chip label={locOn ? `📍 ${place.name} ✕` : `+ 📍 ${place.name}`} on={locOn} onPress={() => setLocOn(x => !x)} a11yLabel={locOn ? t('Filtr miejsca: {l}. Tapnij, by zdjąć.', { l: place.name }) : t('Filtr miejsca wyłączony: {l}. Tapnij, by pokazać tylko dostępne.', { l: place.name })} /> : null}
          </View>
          <Input value={q} onChangeText={setQ} placeholder={t('Szukaj ćwiczenia…')} maxLength={80} autoCorrect={false} />
          {others.length ? others.map(b => { const av = caps ? availability(b, place, caps) : null; const miss = av && !av.ok ? ' · ' + t('brak: {m}', { m: missingLabel(av.missing) }) : '';
            return <Item key={b.id} title={exName(b)} sub={`${t(b.equipment)}${miss}`} icon="⇄" dim={!!miss} onPress={() => pick(b.id)} />; }) : !archived.length && !canCreate ? <Empty>{t('Nic nie pasuje.')}</Empty> : null}
          {archived.map(b => <Item key={'a' + b.id} title={t('Przywróć „{name}”', { name: exName(b) })} sub={exerciseInHistory(b.id) ? t('usunięte ćwiczenie z historią') : t('usunięte ćwiczenie (w bieżącym treningu)')} icon="↺" onPress={() => { if (chosen.current) return; b.archived = false; save(b); pick(b.id); }} />)}
          {canCreate ? <Item title={t('Utwórz „{name}”', { name: q.trim() })} sub={t('nowe ćwiczenie własne')} icon="+" onPress={() => { if (chosen.current) return; const n = newExercise(q.replace(/\s+/g, ' ').trim()); if (ex) { n.metric = ex.metric; n.group = ex.group; n.muscles = [...ex.muscles]; save(n); } pick(n.id); }} /> : null}
        </View> : null}
      </ScrollView>
    </Screen>
  );
}
