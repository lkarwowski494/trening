import React, { useMemo, useRef, useState } from 'react';
import { FlatList, ScrollView, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme, F } from '@/lib/theme';
import { Screen, Input, Chip, Item, Muted, Empty } from '@/components/ui';
import { getState, addExerciseToActive, newExercise, save, visibleExercises, exerciseInHistory, locationById, swapBlock, exById } from '@/lib/store';
import { afterSwap } from '@/components/ActiveWorkout';
import { availability, capsOf, missingLabel, type Availability } from '@/lib/equipment';
import { uid } from '@/lib/seed';
import { draftAddExercise, draftOf, draftSwapExercise, swapTargetOk } from '@/lib/edit';
import { parseSwapTarget } from '@/lib/swap';
import { GROUPS, GROUP_TO_MUSCLE, hasReps, type Exercise } from '@/lib/seed';
import { t, exName, locale, fold } from '@/lib/i18n';

/** target = 'active' (dodaj do treningu) | 'template:<id>' (dodaj do szablonu) | 'edit:<klucz szkicu>' (edytor historii, docs/12)
 *  | 'swap:active:<id bloku>' (E2: zamiana ćwiczenia bloku treningu w toku — „Cała biblioteka” z arkusza app/swap.tsx)
 *  | 'swap:edit:<klucz szkicu>:<id bloku>' (E2 D6: przepięcie bloku w edytorze historii)
 * Cele swap: — od 04.10.2026 arkusz ma własną listę „Inne”; cel zostaje dla linków i testów (tests/backlog-0410.test.tsx). */
export default function PickerScreen() {
  // Runda 26: parametr z linku może być tablicą (powtórzony ?target=) — tylko tekst, inaczej nic nie dodajemy.
  const raw = useLocalSearchParams<{ target?: string | string[] }>().target; const target = typeof raw === 'string' ? raw : ''; const router = useRouter();
  const th = useTheme(); const [q, setQ] = useState(''); const [g, setG] = useState(''); const st = getState(); const chosen = useRef(false);
  const headerOpts = useMemo(() => ({ headerRight: () => <Pressable accessibilityRole="button" hitSlop={10} onPress={() => { if (chosen.current) return; chosen.current = true; /* weryfikacja: podwójne „Anuluj” zamykało też ekran pod spodem */ if (router.canGoBack()) router.back(); else router.replace('/'); }}><Text style={{ color: th.accent, fontSize: 17 }}>{t('Anuluj')}</Text></Pressable> }), [th, router]); // eslint-disable-line react-hooks/exhaustive-deps
  const ql = fold(q.trim());
  // Runda 6: dokładne trafienie nazwy pokazujemy mimo filtra partii — inaczej picker proponował utworzenie duplikatu.
  const exact = (e: Exercise) => !!ql && (fold(e.name) === ql || fold(exName(e)) === ql);
  /* P-003 E1 (decyzja 3a): miejsce treningu w toku albo miejsce domyślne edytowanego szablonu — domyślnie tylko dostępne ćwiczenia,
   * przełącznik „Pokaż wszystkie” zapamiętany; niedostępne wyszarzone z dopiskiem „brak: …”. Bez miejsca — lista jak dotąd.
   * Integracja 0.9.0: edytor historii ('edit:<klucz>') jak trening w toku — filtr po miejscu edytowanego treningu, gdy je ma (i miejsce
   * wciąż istnieje); trening wstecz i treningi sprzed miejsc nie mają miejsca → pełna lista. */
  /* E2 (docs/14 pkt 3.1): cel swap: — filtr miejsca jak w 'active', bez bieżącego ćwiczenia bloku i bez ćwiczeń o innej mierze (pola serii by nie pasowały) */
  const sw = target.startsWith('swap:') ? parseSwapTarget(target.slice(5)) : null; const swapId = sw?.blockId ?? '';
  const swapDraft = sw?.kind === 'edit' ? draftOf(sw.key) : undefined; const swapW = sw?.kind === 'edit' ? swapDraft?.w : sw ? st.active : undefined;
  const swapBlk = swapW?.exercises.find(x => x.id === swapId); const swapEx = swapBlk ? exById(swapBlk.exerciseId) : undefined;
  /* D6 (H3): w edytorze — ta sama reguła co przepięcie (swapTargetOk: blok usuniętego ćwiczenia bez filtra miary) */
  const swapOk = (e: Exercise) => !sw || (swapDraft && swapBlk ? swapTargetOk(swapDraft, swapBlk, e, e.archived === true /* „Przywróć …” jak w treningu (backlog 04.10) */) : !!swapEx && e.id !== swapEx.id && (e.metric ?? 'weight_reps') === (swapEx.metric ?? 'weight_reps'));
  const ctx = target === 'active' || sw?.kind === 'active' ? locationById(st.active?.locationId) : sw?.kind === 'edit' ? locationById(swapW?.locationId) : target.startsWith('template:') ? locationById(st.templates.find(x => x.id === target.slice(9))?.locationId)
    : target.startsWith('edit:') ? locationById(draftOf(target.slice(5))?.w.locationId) : undefined;
  const [allOn, setAllOn] = useState(st.settings.pickerShowAll); const showAll = !ctx || allOn; const caps = ctx ? capsOf(ctx) : null; const av = new Map<string, Availability>();
  const avail = (e: Exercise) => { if (!caps) return null; let a = av.get(e.id); if (!a) { a = availability(e, ctx, caps); av.set(e.id, a); } return a; };
  let hidden = 0;
  const list = visibleExercises().filter(swapOk).filter(e => (!g || e.group === g || exact(e)) && (!ql || fold(e.name).includes(ql) || fold(exName(e)).includes(ql))).filter(e => { if (showAll || exact(e) || avail(e)!.ok) return true; hidden++; return false; }).sort((a, b) => GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group) || exName(a).localeCompare(exName(b), locale()));
  const choose = (ex: Exercise) => {
    if (chosen.current) return; chosen.current = true; // podwójne tapnięcie nie doda ćwiczenia dwa razy ani nie cofnie o dwa ekrany
    if (target === 'active') addExerciseToActive(ex);
    else if (sw?.kind === 'active') { const r = swapBlock(swapId, ex.id); if (r) afterSwap(r.goneSetIds); }
    else if (sw?.kind === 'edit') draftSwapExercise(sw.key, swapId, ex.id);
    else if (target.startsWith('edit:')) draftAddExercise(target.slice(5), ex);
    else if (target?.startsWith('template:')) { const tpl = st.templates.find(x => x.id === target.slice(9)); tpl?.items.push({ id: uid(), exerciseId: ex.id, sets: 3, repMin: hasReps(ex.metric ?? 'weight_reps') ? 8 : null, repMax: hasReps(ex.metric ?? 'weight_reps') ? 10 : null, restSec: null, startWeight: '', targetSec: '', groupId: null }); save(tpl); }
    if (router.canGoBack()) router.back(); else router.replace('/');
  };
  let last = ''; const rows: React.ReactNode[] = [];
  list.forEach(e => { if (!g && !ql && e.group !== last) { last = e.group; rows.push(<Muted key={'g' + e.group} accessibilityRole="header" style={{ fontSize: 12, fontFamily: F.semibold, paddingTop: 12, paddingBottom: 2 }}>{t(e.group)}</Muted>); }
    const a = avail(e); const miss = a && !a.ok ? ' · ' + t('brak: {m}', { m: missingLabel(a.missing) }) : '';
    rows.push(<Item key={e.id} title={exName(e)} sub={`${t(e.equipment)}${e.bandAssistable ? ' · ' + t('guma') : ''}${miss}`} onPress={() => choose(e)} icon="+" dim={!!miss} />); });
  // Usunięte ćwiczenie o pasującej nazwie można przywrócić razem z historią, zamiast tworzyć puste nowe (runda 4).
  const archived = ql ? st.exercises.filter(e => e.archived && swapOk(e) && (fold(e.name).includes(ql) || fold(exName(e)).includes(ql))) : [];
  archived.forEach(e => rows.push(<Item key={'a' + e.id} title={t('Przywróć „{name}”', { name: exName(e) })} sub={exerciseInHistory(e.id) ? t('usunięte ćwiczenie z historią') : t('usunięte ćwiczenie (w bieżącym treningu)')} onPress={() => { if (chosen.current) return; e.archived = false; save(e); choose(e); }} icon="↺" />));
  if (ql && !list.some(e => fold(e.name) === ql || fold(exName(e)) === ql) && !archived.some(e => fold(e.name) === ql || fold(exName(e)) === ql)) rows.push(<Item key="new" title={t('Utwórz „{name}”', { name: q.trim() })} sub={t('nowe ćwiczenie własne')} onPress={() => { if (chosen.current) return; const e = newExercise(q.replace(/\s+/g, ' ').trim()); if (swapEx) { e.metric = swapEx.metric; save(e); } /* E2: „Utwórz …” przy zamianie — z miarą A */ if (g) { e.group = g as Exercise['group']; const mu = GROUP_TO_MUSCLE[e.group]; e.muscles = mu ? [mu] : []; save(e); } /* runda 6: partia jak przy zmianie grupy w edycji */ choose(e); }} icon="+" />);
  return (
    <Screen style={{ paddingTop: 10 }}>
      {/* Audyt przed telefonem: okno zamykało się tylko gestem w dół (niedostępnym dla VoiceOver) — przycisk w nagłówku */}
      <Stack.Screen options={headerOpts} />
      <Input value={q} onChangeText={setQ} placeholder={t('Szukaj ćwiczenia…')} maxLength={80} autoFocus autoCorrect={false} />
      {ctx ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 8 }}>
        {/* decyzja właściciela 04.10.2026: miejsce jako filtr-etykieta (jak etykieta w JIRA) — „📍 Dom ✕” zdejmuje filtr, „+ 📍 Dom” przywraca; wybór zapamiętany */}
        <Chip label={showAll ? `+ 📍 ${ctx.name}` : `📍 ${ctx.name} ✕`} on={!showAll} onPress={() => { const v = !showAll; setAllOn(v); st.settings.pickerShowAll = v; save(); }} a11yLabel={showAll ? t('Filtr miejsca wyłączony: {l}. Tapnij, by pokazać tylko dostępne.', { l: ctx.name }) : t('Filtr miejsca: {l}. Tapnij, by zdjąć.', { l: ctx.name })} />
        <Muted style={{ fontSize: 12, flexShrink: 1 }}>{showAll ? t('niedostępne w: {l} są wyszarzone', { l: ctx.name }) : t('tylko dostępne w: {l}', { l: ctx.name }) + (hidden ? ' · ' + t('ukryte: {n}', { n: hidden }) : '')}</Muted>
      </View> : null}
      <ScrollView horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, flexShrink: 0, marginVertical: 8 }} /* runda 69: chipy nie są ściskane do zera */>
        <Chip label={t('Wszystkie')} on={g === ''} onPress={() => setG('')} />{GROUPS.map(x => <Chip key={x} label={t(x)} on={g === x} onPress={() => setG(x)} />)}
      </ScrollView>
      {/* pełna baza ćwiczeń (04.10.2026, ~870): lista wirtualizowana — ScrollView renderował wszystkie wiersze naraz (270 → 433 ms w Node, npm run perf) */}
      <FlatList data={rows} renderItem={({ item }) => item as React.ReactElement} keyExtractor={(x, i) => String((x as React.ReactElement)?.key ?? i)} initialNumToRender={30} maxToRenderPerBatch={30} windowSize={11}
        keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingBottom: 40 }} ListEmptyComponent={<Empty>{t('Nic nie pasuje.')}</Empty>} />
    </Screen>
  );
}
