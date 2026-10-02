import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert, Keyboard, ActionSheetIOS, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Screen, Muted, Btn, Txt, Field, Input, NumInput, Empty } from '@/components/ui';
import { WhenFields } from '@/components/WhenFields';
import { setLabel } from '@/components/ActiveWorkout';
import { getState, useTick, exById, isBW, loadLabel, loadLabelShort, groupLabels, occurrence, occurrences, deleteWorkout, bandA11y, shortBand, clampName, NAME_MAX } from '@/lib/store';
import { draftOf, beginEdit, discardDraft, isDirty, touchDraft, useDraftTick, checkDraft, commitDraft, draftAddSet, draftRemoveSet, draftRemoveExercise, draftSetWhen, dateText, timeText, type Draft } from '@/lib/edit';
import { onHistoryEdited } from '@/lib/backup';
import { hasTime, hasReps, hasWeight, hasDistance, SET_KIND_LABEL, type WExercise, type WSet } from '@/lib/seed';
import { useTheme } from '@/lib/theme';
import { t, tp, exName } from '@/lib/i18n';
import { wu, wField, wIn } from '@/lib/units';

/*
 * Docs/12: edycja zakończonego treningu i trening wstecz — wspólny edytor szkicu (lib/edit.ts). Wygląd jak szczegóły sesji,
 * pola serii jak w treningu w toku, ale bez stopera, przerw i odhaczania (wszystkie serie historii są wykonane).
 * „Zapisz” podmienia trening jednym zapisem; „Anuluj” (z pytaniem, gdy coś zmieniono) wyrzuca szkic. Gest cofania jest
 * wyłączony (_layout), żeby szkic nie przepadł niezauważony.
 */
export default function EditWorkout() {
  const raw = useLocalSearchParams<{ id?: string | string[] }>().id; const key = typeof raw === 'string' ? raw : '';
  useTick(); useDraftTick(); const router = useRouter(); const th = useTheme(); const leaving = useRef(false);
  /* szkic edycji zakłada „Edytuj”; przy wejściu z linku (bez szkicu) — świeża kopia treningu */
  useState(() => { if (key && !draftOf(key) && !key.startsWith('new-')) beginEdit(key); return 0; });
  /* audyt (LOW): zamknięcie ekranu w jakikolwiek sposób wyrzuca szkic — nie zostaje w pamięci ani nie wraca przy następnym wejściu */
  useEffect(() => () => { discardDraft(key); }, [key]);
  const d = draftOf(key);
  const close = () => { leaving.current = true; Keyboard.dismiss(); if (router.canGoBack()) router.back(); else router.replace('/history'); };
  const header = (title: string, onPress: () => void, bold?: boolean) => () => <Pressable accessibilityRole="button" accessibilityLabel={title} hitSlop={10} onPress={onPress} style={{ minHeight: 44, minWidth: 44, justifyContent: 'center' }}><Text maxFontSizeMultiplier={1.4} style={{ color: th.accent, fontSize: 17, fontWeight: bold ? '700' : '400' }}>{title}</Text></Pressable>;
  if (!d) return <Screen><Stack.Screen options={{ headerLeft: header(t('Wróć'), close) }} />{leaving.current ? null : <><Muted style={{ marginTop: 14 }}>{t('Brak sesji.')}</Muted><Btn title={t('Wróć')} block style={{ marginTop: 12 }} onPress={close} /></>}</Screen>;

  const cancel = () => {
    const cur = draftOf(key); if (!cur || !isDirty(cur)) { discardDraft(key); close(); return; }
    Alert.alert(t('Odrzucić zmiany?'), cur.sourceId ? t('Sesja w historii zostanie bez zmian.') : t('Ten trening nie zostanie zapisany.'), [{ text: t('Wróć') }, { text: t('Odrzuć zmiany'), style: 'destructive', onPress: () => { if (draftOf(key) !== cur) return; discardDraft(key); close(); } }]);
  };
  const commit = () => {
    const sourceId = draftOf(key)?.sourceId ?? null; const r = commitDraft(key);
    if ('error' in r) { Alert.alert(t('Nie udało się zapisać'), r.error); return; }
    onHistoryEdited().catch(() => {}); leaving.current = true; Keyboard.dismiss();
    if (sourceId) close(); else router.replace(`/history/${r.w.id}`);
  };
  const saveDraft = () => {
    const cur = draftOf(key); if (!cur || leaving.current) return; Keyboard.dismiss();
    const c = checkDraft(key);
    if ('error' in c) { Alert.alert(t('Sprawdź datę i godzinę'), c.error); return; }
    if (c.empty) {
      if (cur.sourceId) { const id = cur.sourceId; Alert.alert(t('Pusty trening'), t('Nie zostałaby żadna seria z wynikiem. Usunąć tę sesję z historii?'), [{ text: t('Wróć') }, { text: t('Usuń sesję'), style: 'destructive', onPress: () => { if (draftOf(key) !== cur) return; discardDraft(key); if (getState().workouts.some(x => x.id === id)) { deleteWorkout(id); onHistoryEdited().catch(() => {}); /* audyt (LOW): kopia jak po każdej zmianie historii */ } leaving.current = true; Keyboard.dismiss(); if (router.canDismiss()) router.dismissAll(); router.navigate('/history'); /* weryfikacja 2 (L5): zawsze lista Historii — także gdy szczegóły otwarto z zakładki Trening */ } }]); }
      else Alert.alert(t('Pusty trening'), t('Nie ma żadnej serii z wynikiem — nic do zapisania.'), [{ text: t('Wróć') }, { text: t('Odrzuć trening'), style: 'destructive', onPress: () => { if (draftOf(key) !== cur) return; discardDraft(key); close(); } }]);
      return;
    }
    /* audyt M5: nachodzenie na inną sesję z historii — ostrzeżenie z potwierdzeniem (dwa treningi jednego dnia bywają celowe) */
    const warn = [c.dropped ? t('Serie bez wyniku zostaną pominięte: {n}.', { n: c.dropped }) : '', c.overlap ? t('Ten termin nachodzi na sesję „{name}” ({d}).', { name: c.overlap.templateName || t('Trening'), d: `${dateText(c.overlap.startedAt)} ${timeText(c.overlap.startedAt)}` }) : ''].filter(Boolean);
    if (warn.length) { Alert.alert(t('Zapisać zmiany?'), warn.join('\n'), [{ text: t('Wróć') }, { text: t('Zapisz'), onPress: () => { if (draftOf(key) === cur) commit(); } }]); return; }
    commit();
  };

  const w = d.w; const st = getState(); const labels = groupLabels(w.exercises);
  const health = st.settings.healthSync || !!st.workouts.find(x => x.id === d.sourceId)?.healthUUID;
  return (
    <Screen>
      <Stack.Screen options={{ title: d.sourceId ? t('Edycja sesji') : t('Trening wstecz'), headerBackVisible: false, headerLeft: header(t('Anuluj'), cancel), headerRight: header(t('Zapisz'), saveDraft, true) }} />
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 80 }}>
        {health ? <Muted style={{ fontSize: 13, marginBottom: 10 }}>{t('Zmiany nie trafiają do Apple Health.')}</Muted> : null}
        <Field label={t('Nazwa')}><Input value={w.templateName} placeholder={t('Trening')} maxLength={NAME_MAX} onChangeText={v => { w.templateName = v; touchDraft(); }} /></Field>
        <WhenFields date={d.date} time={d.time} min={d.min} onChange={p => draftSetWhen(key, p)} />
        <View style={{ height: 10 }} />
        {w.exercises.map((e, ei) => <EditBlock key={e.id} d={d} e={e} ei={ei} labels={labels} />)}
        {!w.exercises.length ? <Empty>{t('Brak ćwiczeń — dodaj pierwsze.')}</Empty> : null}
        <Btn title={t('+ Dodaj ćwiczenie')} block style={{ marginTop: 12 }} onPress={() => router.push(`/picker?target=${encodeURIComponent('edit:' + key)}`)} />
        <View style={{ marginTop: 16 }}><Muted style={{ marginBottom: 5 }}>{t('Notatka do treningu')}</Muted><Input maxLength={1000} value={w.note} onChangeText={v => { w.note = v; touchDraft(); }} placeholder={t('np. BB 86 rano, świeżo')} accessibilityLabel={t('Notatka do treningu')} multiline /></View>
        <Btn title={t('Zapisz zmiany')} kind="primary" block style={{ marginTop: 16, minHeight: 52 }} onPress={saveDraft} />
        <Muted style={{ textAlign: 'center', fontSize: 13, marginVertical: 10 }}>{t('Tapnij numer serii, by zmienić typ (W, D, F) albo dodać notatkę. Serie bez wyniku nie zostaną zapisane.')}</Muted>
      </ScrollView>
    </Screen>
  );
}

function EditBlock({ d, e, ei, labels }: { d: Draft; e: WExercise; ei: number; labels: Record<string, string> }) {
  const th = useTheme(); const st = getState(); const ex = exById(e.exerciseId);
  const nOcc = occurrences(d.w.exercises, e.exerciseId); const nm = ex ? (nOcc > 1 ? `${exName(ex)} (${occurrence(d.w.exercises, ei) + 1})` : exName(ex)) : t('Usunięte ćwiczenie');
  const m = ex?.metric ?? 'weight_reps'; const bw = !!ex && isBW(ex); const band = !!ex?.bandAssistable; const showRpe = st.settings.showRpe;
  const removeEx = () => Alert.alert(t('Usunąć z treningu?'), nm, [{ text: t('Nie') }, { text: t('Usuń'), style: 'destructive', onPress: () => draftRemoveExercise(d.key, e.id) }]);
  const setMenu = (set: WSet, si: number) => {
    const opts = [t('Seria normalna'), t('Rozgrzewka (W)'), t('Drop set (D)'), t('Do upadku (F)'), set.note ? t('Edytuj notatkę') : t('Dodaj notatkę'), t('Anuluj')];
    const kinds = ['normal', 'warmup', 'drop', 'failure'] as const;
    ActionSheetIOS.showActionSheetWithOptions({ options: opts, cancelButtonIndex: 5, title: t('Seria {n}', { n: setLabel(e, si) }) }, i => {
      if (i < 4) { set.kind = kinds[i]; set.warmup = set.kind === 'warmup'; touchDraft(); }
      else if (i === 4) Alert.prompt?.(t('Notatka do serii'), undefined, [{ text: t('Anuluj'), style: 'cancel' }, { text: t('Zapisz'), onPress: v => { set.note = clampName((v ?? '').trim(), 300); touchDraft(); } }], 'plain-text', set.note);
    });
  };
  const cycleBand = (set: WSet) => { const sorted = [...st.bands].sort((a, b) => a.level - b.level); const i = sorted.findIndex(b => b.id === set.bandId); set.bandId = i < 0 ? (sorted[0]?.id ?? '') : (i + 1 < sorted.length ? sorted[i + 1].id : ''); touchDraft(); };
  const heads = ['#', ...(hasWeight(m) ? [ex ? loadLabelShort(ex) : wu()] : []), ...(hasReps(m) ? [t('Pow.')] : []), ...(hasDistance(m) ? ['m'] : []), ...(hasTime(m) ? [t('sek.')] : []), ...(showRpe ? ['RPE'] : [])];
  return (
    <View style={[s.ex, { borderBottomColor: th.line }]}>
      <Txt accessibilityRole="header" style={{ fontWeight: '600', fontSize: 17, marginBottom: 6 }}>{e.groupId && labels[e.groupId] ? <Txt style={{ color: th.band, fontWeight: '700' }}>{`SS ${labels[e.groupId]} · `}</Txt> : null}{nm}{ex?.archived ? <Txt style={{ color: th.muted, fontSize: 13 }}>{' (' + t('usunięte') + ')'}</Txt> : null}</Txt>
      <View style={s.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {heads.map((h, k) => <Muted key={k} numberOfLines={1} style={[s.head, k === 0 ? { width: 32, textAlign: 'left' } : { flex: 1 }]}>{h}</Muted>)}
        {band ? <Muted style={[s.head, { width: 52 }]}>{t('Guma')}</Muted> : null}
        <View style={{ width: 44 }} />
      </View>
      {e.sets.map((set, si) => {
        const lbl = setLabel(e, si); const hint = t('Seria {n} — {ex}', { n: lbl, ex: nm }); const kind = set.kind ?? 'normal';
        return (
          <View key={set.id}>
            <View style={s.row}>
              <Pressable onPress={() => setMenu(set, si)} hitSlop={8} accessibilityRole="button" accessibilityHint={hint} accessibilityLabel={t('Seria {n}, typ: {k}. Tapnij, by zmienić typ lub dodać notatkę.', { n: lbl, k: t(SET_KIND_LABEL[kind]) })} style={{ width: 32, minHeight: 44, justifyContent: 'center' }}>
                <Text maxFontSizeMultiplier={1.3} style={{ color: kind !== 'normal' ? th.band : th.muted, fontSize: 14, fontWeight: kind !== 'normal' ? '700' : '400' }}>{lbl}{set.note ? '•' : ''}</Text>
              </Pressable>
              {hasWeight(m) ? <View style={s.cell}><NumInput weightTol decimal allowNegative={bw} value={wField(bw ? set.addKg : set.weight)} onNum={v => { if (bw) set.addKg = wIn(v); else set.weight = v === '' ? '' : wIn(Math.max(0, v)); touchDraft(); }} placeholder={bw ? '±0' : wu()} accessibilityLabel={ex ? loadLabel(ex) : t('ciężar')} accessibilityHint={hint} /></View> : null}
              {hasReps(m) ? <View style={s.cell}><NumInput value={set.reps} onNum={v => { set.reps = v === '' ? '' : Math.min(1000, Math.max(0, Math.floor(v))); touchDraft(); }} placeholder="0" accessibilityLabel={t('Powtórzenia')} accessibilityHint={hint} /></View> : null}
              {hasDistance(m) ? <View style={s.cell}><NumInput value={set.distanceM} onNum={v => { set.distanceM = v === '' ? '' : Math.max(0, Math.round(v)); touchDraft(); }} placeholder="m" accessibilityLabel={t('dystans')} accessibilityHint={hint} /></View> : null}
              {hasTime(m) ? <View style={s.cell}><NumInput value={set.durationSec} onNum={v => { set.durationSec = v === '' ? '' : Math.min(86400, Math.max(0, Math.round(v))); touchDraft(); }} placeholder="s" accessibilityLabel={t('czas')} accessibilityHint={hint} /></View> : null}
              {showRpe ? <View style={s.cell}><NumInput decimal value={set.rpe} onNum={v => { set.rpe = v === '' ? '' : Math.min(10, Math.max(0, Math.round(v * 10) / 10)); touchDraft(); }} placeholder="—" accessibilityLabel="RPE" accessibilityHint={hint} /></View> : null}
              {band ? <Pressable accessibilityRole="button" accessibilityHint={hint} accessibilityLabel={t('Guma: {b}. Tapnij, by zmienić.', { b: set.bandId ? bandA11y(st.bands.find(b => b.id === set.bandId)) : t('brak') })} onPress={() => cycleBand(set)} style={[s.box, { width: 52, backgroundColor: th.surface2, borderColor: th.line }]}><Text maxFontSizeMultiplier={1.3} style={{ color: set.bandId ? th.band : th.muted, fontSize: 13, fontWeight: '600' }}>{set.bandId ? shortBand(st.bands.find(b => b.id === set.bandId)) : '—'}</Text></Pressable> : null}
              <Pressable accessibilityRole="button" accessibilityLabel={t('Usuń serię {n} — {ex}', { n: lbl, ex: nm })} hitSlop={4} onPress={() => draftRemoveSet(d.key, ei, set.id)} style={[s.box, { width: 44, borderColor: 'transparent' }]}><Text maxFontSizeMultiplier={1.3} style={{ color: th.danger, fontSize: 18 }}>✕</Text></Pressable>
            </View>
            {set.note ? <Muted style={{ fontSize: 12, marginLeft: 38, marginTop: -4, marginBottom: 6 }}>{set.note}</Muted> : null}
          </View>
        );
      })}
      {!e.sets.length ? <Muted style={{ fontSize: 13, marginBottom: 6 }}>{t('Bez serii — ćwiczenie nie zostanie zapisane.')}</Muted> : null}
      <View style={s.actions}>
        <Btn title={t('+ seria')} small accessibilityHint={nm} onPress={() => draftAddSet(d.key, ei)} />
        <Btn title={t('usuń')} small kind="ghost" accessibilityLabel={t('Usuń ćwiczenie: {name}', { name: nm })} onPress={removeEx} />
        <Muted style={{ fontSize: 13, alignSelf: 'center' }}>{`${e.sets.length} ${tp(e.sets.length, 'seria|serie|serii')}`}</Muted>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  ex: { marginBottom: 16, paddingBottom: 8, borderBottomWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  head: { fontSize: 12, textAlign: 'center' },
  cell: { flex: 1, minWidth: 44 },
  box: { height: 44, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap' },
});
