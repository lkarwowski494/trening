import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Alert, Keyboard, ActionSheetIOS, StyleSheet } from 'react-native';
import { ScrollView } from '@/components/Scroll';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Screen, Muted, Btn, Txt, Field, Input, NumInput, Empty, Missing } from '@/components/ui';
import { IconRow } from '@/components/Icon';
import { WhenFields } from '@/components/WhenFields';
import { setLabel } from '@/components/ActiveWorkout';
import { visibleLocations, effortLabel, effortField, effortIn, getState, useTick, exById, isBW, loadLabel, loadLabelShort, groupLabels, ssTag, occurrence, occurrences, deleteWorkout, bandA11y, shortBand, clampName, SET_NOTE_MAX, NAME_MAX, blockImpl, liveBlockImpl, nextBandId, loadFieldValue, loadOf, writeLoad, usesBand, workCount, wallTs, REPS_MAX } from '@/lib/store';
import { draftOf, beginEdit, discardDraft, isDirty, touchDraft, useDraftTick, checkDraft, commitDraft, draftAddSet, draftRemoveSet, draftRemoveExercise, draftSetWhen, draftSetLocation, dateText, timeText, prefilledOffList, type Draft } from '@/lib/edit';
import { onHistoryEdited } from '@/lib/backup';
import { locationLabel } from '@/lib/locations';
import { hasTime, hasReps, hasWeight, hasDistance, SET_KIND_LABEL, type WExercise, type WSet } from '@/lib/seed';
import { SwipeRow, lastSetBlock, confirmDelete } from '@/components/SwipeRow';
import { ExMenuButton } from '@/components/ExMenuButton';
import { SetBadge } from '@/components/SetBadge';
import { DraftHeader, HeaderButton, confirmDiscard } from '@/components/DraftHeader';
import { MedicalNote } from '@/components/MedicalNote';
import { useTheme, NUM_SCALE_MAX, FW, font, RADIUS } from '@/lib/theme';
import { t, tp, exName, lang } from '@/lib/i18n';
import { wu, wField, wInKeep, fmtW, dIn, dOut, distUnit } from '@/lib/units';
import { cancelButton, okButton } from '@/lib/confirm';

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
  if (!d) return <Screen>{leaving.current ? null : <Missing>{t('Brak sesji.')}</Missing>}</Screen>;

  /* wspólny wzór edycji na szkicu (components/DraftHeader — także ćwiczenie i szablon, decyzja właściciela 08.10.2026) */
  const cancel = () => {
    const cur = draftOf(key); if (!cur) { close(); return; }
    confirmDiscard(isDirty(cur), cur.sourceId ? t('Sesja w historii zostanie bez zmian.') : t('Ten trening nie zostanie zapisany.'), () => { discardDraft(key); close(); }, () => draftOf(key) === cur);
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
      if (cur.sourceId) { const id = cur.sourceId; Alert.alert(t('Pusty trening'), [t('Nie zostałaby żadna seria z wynikiem. Usunąć tę sesję z historii?'), getState().workouts.find(x => x.id === id)?.healthUUID ? t('Kopia w Apple Health zostanie — usuniesz ją w aplikacji Zdrowie.') : ''].filter(Boolean).join('\n'), [{ ...cancelButton() }, { text: t('Usuń sesję'), style: 'destructive', onPress: () => { if (draftOf(key) !== cur) return; discardDraft(key); if (getState().workouts.some(x => x.id === id)) { deleteWorkout(id); onHistoryEdited().catch(() => {}); /* audyt (LOW): kopia jak po każdej zmianie historii */ } leaving.current = true; Keyboard.dismiss(); if (router.canDismiss()) router.dismissAll(); router.navigate('/history'); /* weryfikacja 2 (L5): zawsze lista Historii — także gdy szczegóły otwarto z zakładki Trening */ } }]); }
      else Alert.alert(t('Pusty trening'), t('Nie ma żadnej serii z wynikiem — nic do zapisania.'), [{ ...cancelButton() }, { text: t('Odrzuć trening'), style: 'destructive', onPress: () => { if (draftOf(key) !== cur) return; discardDraft(key); close(); } }]);
      return;
    }
    /* audyt M5: nachodzenie na inną sesję z historii — ostrzeżenie z potwierdzeniem (dwa treningi jednego dnia bywają celowe) */
    const warn = [c.dropped ? t('Serie bez wyniku zostaną pominięte: {n}.', { n: c.dropped }) : '', c.noWeight ? t('Serie bez ciężaru: {n}.', { n: c.noWeight }) : '', c.overlap ? t('Ten termin nachodzi na sesję „{name}” ({d}).', { name: c.overlap.templateName || t('Trening'), d: `${dateText(wallTs(c.overlap))} ${timeText(wallTs(c.overlap))}` /* X2-04: zegar strefy startu tamtej sesji, jak lista */ }) : ''].filter(Boolean);
    if (warn.length) { Alert.alert(t('Zapisać zmiany?'), warn.join('\n'), [{ ...cancelButton() }, { text: t('Zapisz'), onPress: () => { if (draftOf(key) === cur) commit(); } }]); return; }
    commit();
  };

  const w = d.w; const st = getState(); const labels = groupLabels(w.exercises);
  const health = st.settings.healthSync || !!st.workouts.find(x => x.id === d.sourceId)?.healthUUID;
  return (
    <Screen>
      <DraftHeader title={d.sourceId ? t('Edycja sesji') : t('Trening wstecz')} onCancel={cancel} onSave={saveDraft} cancelLabel={t('Anuluj edycję sesji')} saveLabel={t('Zapisz sesję')} />
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 80 }}>
        {health ? <Muted style={{ ...font('footnote'), marginBottom: 10 }}>{t('Zmiany nie trafiają do Apple Health.')}</Muted> : null}
        <LocationChip d={d} />{/* T-057 (0.14.0): wybór / zmiana miejsca treningu (wcześniej tylko do odczytu) */}
        <Field label={t('Nazwa')}><Input value={w.templateName} placeholder={t('Trening')} maxLength={NAME_MAX} onChangeText={v => { w.templateName = v; touchDraft(); }} /></Field>
        <WhenFields date={d.date} time={d.time} min={d.min} onChange={p => draftSetWhen(key, p)} />
        <View style={{ height: 10 }} />
        {w.exercises.map((e, ei) => <EditBlock key={e.id} d={d} e={e} ei={ei} labels={labels} />)}
        {!w.exercises.length ? <Empty>{t('Brak ćwiczeń — dodaj pierwsze.')}</Empty> : null}
        <Btn nav title={t('+ Dodaj ćwiczenie')} block style={{ marginTop: 12 }} onPress={() => router.push(`/picker?target=${encodeURIComponent('edit:' + key)}`)} />
        <View style={{ marginTop: 16 }}><Muted style={{ marginBottom: 5 }}>{t('Notatka do treningu')}</Muted><Input maxLength={1000} value={w.note} onChangeText={v => { w.note = v; touchDraft(); }} placeholder={t('np. samopoczucie, ból, sprzęt')} accessibilityLabel={t('Notatka do treningu')} multiline /><MedicalNote /></View>
        <Muted style={{ textAlign: 'center', ...font('footnote'), marginVertical: 10 }}>{t('Serie bez wyniku nie zostaną zapisane.') /* utrata danych zostaje na wierzchu; gesty (typ serii, usuwanie) — w Przewodniku, 14.10.2026 */}</Muted>
      </ScrollView>
    </Screen>
  );
}

/** T-057: „📍 Dom ▾” — wybór miejsca treningu (jak chip w treningu w toku): miejsca użytkownika i, gdy trening ma miejsce, „bez miejsca”. Bez zdefiniowanych
 * miejsc — tylko podpis (jeśli trening ma miejsce, także usunięte). Zmiana: lib/edit.ts draftSetLocation. */
function LocationChip({ d }: { d: Draft }) {
  const th = useTheme(); const locs = visibleLocations(); const cur = d.w.locationId; /* 0.19: miejsca jednorazowe poza listą */
  if (!locs.length && !cur) return null;
  const name = cur ? locationLabel(cur) : t('bez miejsca');
  if (!locs.length) return <View style={{ marginBottom: 10, alignSelf: 'flex-start' }}><IconRow icon="pin" color={th.muted}><Text accessibilityLanguage={lang()} accessibilityLabel={`${t('Miejsce')}: ${name}`} maxFontSizeMultiplier={1.3} style={{ color: th.muted, ...font('callout'), ...FW.semibold }}>{name}</Text></IconRow></View>;
  const pick = () => { const none = cur ? [t('bez miejsca')] : []; ActionSheetIOS.showActionSheetWithOptions({ options: [...locs.map(l => l.name), ...none, t('Anuluj')], cancelButtonIndex: locs.length + none.length, title: t('Miejsce tego treningu') }, i => {
    if (i < locs.length) draftSetLocation(d.key, locs[i].id); else if (none.length && i === locs.length) draftSetLocation(d.key, null); }); };
  return <Pressable accessibilityLanguage={lang()} onPress={pick} accessibilityRole="button" accessibilityLabel={t('Miejsce treningu: {l}', { l: name })} accessibilityHint={t('Tapnij, by zmienić.')} hitSlop={6} style={{ alignSelf: 'flex-start', paddingVertical: 4, marginBottom: 6 }}>
    <IconRow icon="pin" color={th.accent}><Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: th.accent, ...font('callout'), ...FW.semibold }}>{`${name} ▾`}</Text></IconRow></Pressable>;
}

function EditBlock({ d, e, ei, labels }: { d: Draft; e: WExercise; ei: number; labels: Record<string, string> }) {
  const th = useTheme(); const st = getState(); const ex = exById(e.exerciseId); const router = useRouter();
  /* M3 p3 (design-spec §10 wiersz 11): kolumny liczb — font('callout') + cyfry tabelaryczne (pola ciężaru, powtórzeń, dystansu, czasu, wysiłku) */
  const numCol = { ...font('callout'), fontVariant: ['tabular-nums' as const] };
  const nOcc = occurrences(d.w.exercises, e.exerciseId); const nm = ex ? (nOcc > 1 ? `${exName(ex)} (${occurrence(d.w.exercises, ei) + 1})` : exName(ex)) : t('Usunięte ćwiczenie');
  const m = ex?.metric ?? 'weight_reps'; const bw = !!ex && isBW(ex); const band = usesBand(ex); /* 06.10.2026: także opór gumy */ const showRpe = st.settings.showRpe;
  const setMenu = (set: WSet, si: number) => {
    /* 04-003: „Usuń serię” w menu jak w treningu */
    const opts = [t('Seria normalna'), t('Rozgrzewka (W)'), t('Drop set (D)'), t('Do upadku (F)'), set.note ? t('Edytuj notatkę') : t('Dodaj notatkę'), t('Usuń serię'), t('Anuluj')];
    const kinds = ['normal', 'warmup', 'drop', 'failure'] as const;
    ActionSheetIOS.showActionSheetWithOptions({ options: opts, cancelButtonIndex: 6, destructiveButtonIndex: 5, title: t('Seria {n}', { n: setLabel(e, si) }) }, i => {
      if (i < 4) { set.kind = kinds[i]; set.warmup = set.kind === 'warmup'; touchDraft(); }
      else if (i === 4) Alert.prompt?.(t('Notatka do serii'), undefined, [{ ...cancelButton() }, { text: t('Zapisz'), onPress: (v?: string) => { set.note = clampName((v ?? '').trim(), SET_NOTE_MAX); touchDraft(); } }], 'plain-text', set.note);
      else if (i === 5) {
        if (e.sets.length <= 1) { const b = lastSetBlock(); Alert.alert(b.title, b.message, [okButton()]); }
        else confirmDelete({ title: t('Usunąć serię?'), message: nm, onDelete: () => draftRemoveSet(d.key, ei, set.id) });
      }
    });
  };
  const cycleBand = (set: WSet) => { set.bandId = nextBandId(set.bandId, d.w.locationId ?? null); touchDraft(); }; /* ten sam cykl co w treningu (store.nextBandId) */
  /* MEDIUM 2: blok na stacji — „kg/str.” (na stronę). Runda 82b (LOW 4): zapisany trening — przyrząd z zapisu (jak szczegóły sesji, docs/10);
   * nowy trening wstecz — jak trening w toku (bez miejsc przyrząd się nie liczy) */
  const impl = d.sourceId ? blockImpl(e, d.w.locationId) : liveBlockImpl(e, d.w.locationId);
  const off = prefilledOffList(d, e); /* MEDIUM 1 / runda 82b: ta sama reguła dopisku co w treningu (store.offListNote) — wartość zostaje */
  const heads = ['#', ...(hasWeight(m) ? [ex ? loadLabelShort(ex, impl) : wu()] : []), ...(hasReps(m) ? [t('Pow.')] : []), ...(hasDistance(m) ? ['m'] : []), ...(hasTime(m) ? [t('sek.')] : []), ...(showRpe ? [effortLabel()] : [])];
  return (
    <View style={[s.ex, { borderBottomColor: th.line }]}>
      {/* usuwanie: gest albo „⋯” (04-003) */}
      <SwipeRow label={t('Usuń ćwiczenie: {name}', { name: nm })} title={t('Usunąć z treningu?')} message={nm} onDelete={() => draftRemoveExercise(d.key, e.id)}>{a11y => <View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ flex: 1 }} accessibilityLanguage={lang()} {...a11y} accessible accessibilityRole="header" accessibilityLabel={nm}><Txt style={{ ...font('body'), ...FW.semibold, marginBottom: 6 }}>{e.groupId && labels[e.groupId] ? <Txt style={{ color: th.band, ...FW.semibold }}>{`${ssTag(labels[e.groupId])} · `}</Txt> : null}{nm}{ex?.archived ? <Txt style={{ color: th.muted, ...font('footnote') }}>{' (' + t('usunięte') + ')'}</Txt> : null}</Txt></View><ExMenuButton testID={`edit-ex-menu-${ei}`} name={nm} title={t('Usunąć z treningu?')} onDelete={() => draftRemoveExercise(d.key, e.id)} /></View>}</SwipeRow>
      {off != null ? <Muted style={{ ...font('footnote'), marginTop: -2, marginBottom: 6 }}>{t('ciężaru {w} nie ma tutaj — wpisz ciężar', { w: fmtW(off) })}</Muted> : null}
      <View style={s.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {heads.map((h, k) => <Muted key={k} numberOfLines={1} maxFontSizeMultiplier={NUM_SCALE_MAX} style={[s.head, font('footnote'), k === 0 ? { width: 32, textAlign: 'left' } : { flex: 1 }]}>{h}</Muted>)}
        {band ? <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} style={[s.head, font('footnote'), { width: 52 }]}>{t('Guma')}</Muted> : null}
        <View style={{ width: 44 }} />
      </View>
      {e.sets.map((set, si) => {
        const lbl = setLabel(e, si); const hint = t('Seria {n} — {ex}', { n: lbl, ex: nm }); const kind = set.kind ?? 'normal';
        return (
          <SwipeRow key={set.id} disabled={e.sets.length <= 1} blocked={lastSetBlock()} /* G4 (audyt 0.10 UI-07, wariant A): ostatniej serii nie usuwa się nigdzie */ label={t('Usuń serię {n} — {ex}', { n: lbl, ex: nm })} title={t('Usunąć serię?')} message={nm} onDelete={() => draftRemoveSet(d.key, ei, set.id)}>{a11y => <View>
            <View style={s.row}>
              <Pressable accessibilityLanguage={lang()} {...a11y} onPress={() => setMenu(set, si)} hitSlop={8} accessibilityRole="button" accessibilityHint={`${hint}. ${t('Tapnij, by zmienić typ lub dodać notatkę.')}`} /* A11-18 */ accessibilityLabel={t('Seria {n}, typ: {k}', { n: lbl, k: t(SET_KIND_LABEL[kind]) })} style={{ width: 32, minHeight: 44, justifyContent: 'center' }}>
                <SetBadge kind={kind} label={lbl} note={!!set.note} /* przegląd 06.10: jak w treningu i szablonie */ />
              </Pressable>
              {hasWeight(m) ? <View style={s.cell}><NumInput style={numCol} weightTol decimal allowNegative={bw} value={wField(loadFieldValue(ex, set))} stored={loadFieldValue(ex, set)} onNum={(v, keep) => { writeLoad(ex, set, wInKeep(v, keep)); /* Q-021; audyt 83b (LOW 2): pole pokazuje to samo co ekran sesji (store.loadOf), wpis trafia do pola obecnego sprzętu */ touchDraft(); }} placeholder={bw ? '±0' : wu()} accessibilityLabel={ex ? loadLabel(ex, impl) : t('ciężar')} accessibilityHint={hint} testID={`w-${ei}-${si}`} /* E2E 28 */ /></View> : null}
              {hasReps(m) ? <View style={s.cell}><NumInput style={numCol} value={set.reps} onNum={v => { set.reps = v === '' ? '' : Math.min(REPS_MAX, Math.max(0, Math.floor(v))); touchDraft(); }} placeholder={t('pow.')} accessibilityLabel={t('Powtórzenia')} accessibilityHint={hint} testID={`reps-${ei}-${si}`} /* E2E (Maestro 05) */ /></View> : null}
              {hasDistance(m) ? <View style={s.cell}><NumInput style={numCol} value={dOut(set.distanceM)} stored={set.distanceM} onNum={(v, keep) => { set.distanceM = dIn(v, keep); touchDraft(); }} placeholder={distUnit()} accessibilityLabel={t('dystans')} accessibilityHint={hint} /></View> : null}
              {hasTime(m) ? <View style={s.cell}><NumInput style={numCol} value={set.durationSec} onNum={v => { set.durationSec = v === '' ? '' : Math.min(86400, Math.max(0, Math.round(v))); touchDraft(); }} placeholder="s" accessibilityLabel={t('czas')} accessibilityHint={hint} /></View> : null}
              {showRpe ? <View style={s.cell}><NumInput style={numCol} decimal value={effortField(set.rpe)} onNum={v => { set.rpe = effortIn(v); touchDraft(); }} placeholder="—" accessibilityLabel={effortLabel()} accessibilityHint={hint} /></View> : null}
              {band ? <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityHint={`${hint}. ${t('Tapnij, by zmienić.')}`} /* A11-18 */ accessibilityLabel={t('Guma: {b}', { b: set.bandId ? bandA11y(st.bands.find(b => b.id === set.bandId)) : t('brak') })} onPress={() => cycleBand(set)} style={[s.box, { width: 52, backgroundColor: th.surface2, borderColor: th.line }]}><Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: set.bandId ? th.band : th.muted, ...font('footnote'), ...FW.semibold }}>{set.bandId ? shortBand(st.bands.find(b => b.id === set.bandId)) : '—'}</Text></Pressable> : null}
              <View style={{ width: 44 }} />
            </View>
            {ex && hasWeight(m) && (() => { const l = loadOf(ex, set); return !l.own && l.raw !== ''; })() ? <Muted style={{ ...font('footnote'), marginLeft: 38, marginTop: -4, marginBottom: 6 }}>{t('Ciężar z innego sprzętu — nie liczy się do rekordów, dopóki go tu nie wpiszesz.') /* Q-026 (0.14.0) */}</Muted> : null}
            {set.note ? <Muted style={{ ...font('footnote'), marginLeft: 38, marginTop: -4, marginBottom: 6 }}>{set.note}</Muted> : null}
          </View>}</SwipeRow>
        );
      })}
      {/* G4 (audyt 0.10): blok zawsze ma serię (historia bez pustych bloków — migrate; nowe ćwiczenie z jedną serią; ostatniej nie usuwa się) — dawny dopisek „Bez serii” zbędny */}
      <View style={s.actions}>
        <Btn title={t('+ seria')} small accessibilityHint={nm} onPress={() => draftAddSet(d.key, ei)} /><Btn title={t('+ rozgrzewka')} small kind="ghost" accessibilityHint={nm} onPress={() => draftAddSet(d.key, ei, 'warmup')} /><Btn title={t('+ drop set')} small kind="ghost" accessibilityHint={nm} onPress={() => draftAddSet(d.key, ei, 'drop')} />
        <Btn nav title={t('⇄ zamień')} small kind="ghost" accessibilityLabel={t('Zamień ćwiczenie: {name}', { name: nm })} onPress={() => router.push(`/swap?target=edit:${d.key}:${e.id}`)} /* E2 D6 (H1) */ />
        <Muted style={{ ...font('footnote'), alignSelf: 'center' }}>{(() => { const n = workCount(e.sets.map(x => x.kind)), w = e.sets.filter(x => x.kind === 'warmup').length; return [`${n} ${tp(n, 'seria|serie|serii')}`, w ? t('{n} rozgrz.', { n: w }) : ''].filter(Boolean).join(' · '); })() /* UI-13 / D3 (audyt 0.10): serie robocze jak w edytorze szablonu */}</Muted>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  ex: { marginBottom: 16, paddingBottom: 8, borderBottomWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  head: { textAlign: 'center' },
  cell: { flex: 1, minWidth: 44 },
  box: { height: 44, borderRadius: RADIUS.field, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap' },
});
