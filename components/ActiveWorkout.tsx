import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet, useWindowDimensions, ActionSheetIOS, Keyboard, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useTheme, FW, font, maxScale, RADIUS, SPACE } from '@/lib/theme';
import { Btn, Input, Muted, H2, useOnce, monoSafe } from '@/components/ui';
import { MoreButton } from '@/components/HeaderActions';
import { HeaderButton } from '@/components/DraftHeader';
import { NowBoard } from '@/components/NowBoard';
import { InfoTip } from '@/components/InfoTip';
import { isPaused, workoutDurSec, pauseWorkout, resumeWorkout, setActiveLocation, visibleLocations, lastActivity, staleSince, staleRef, staleKind, ackStale, useForegroundTick, getState, useTick, exById, isBW, fmtDur, fmtSec, finishWorkout, cancelWorkout, save, groupLabels, findSet, setHasValue, focusSet, workCount, workSetCount } from '@/lib/store';
import { setLabel } from '@/lib/live';

import { MedicalNote } from '@/components/MedicalNote';
import { templateDiff, rememberTemplateUpdate } from '@/lib/tplsync';

import { locationLabel } from '@/lib/locations';
import * as timer from '@/lib/timer';
import { playHaptic } from '@/lib/haptics';
import { completeSet, finishTimedSet, isClosingSet, relabelRest } from '@/lib/setFlow';
import { prMap } from '@/lib/stats';
import { onWorkoutSaved } from '@/lib/backup';
import { markJustFinished } from '@/lib/review-run';
import { markDoneEarly } from '@/lib/plan';
import { hasTime, hasReps, hasWeight, hasDistance, type WExercise, type WSet, type Workout } from '@/lib/seed';
import { t as tr, tp, lang } from '@/lib/i18n';
import { cancelButton, okButton } from '@/lib/confirm';
import { adaptCandidates, restoreCandidates } from '@/lib/adapt';
import { TestWatchPanel } from '@/components/TestWatchPanel';
import { voiceSetting, setVoiceSetting, voiceSettingLabel, VOICE_SETTINGS } from '@/lib/voice';
import { takeAutoAdapt } from '@/lib/adaptPick';
import { reminderPermission, requestRestNotificationPermission, restExplainDismissed, dismissRestExplain, type ReminderPermission } from '@/lib/planReminder';
import { afterSwap, confirmUndoSwap, ExerciseBlock, rowLayout, LINK_BOX, LINK_SLOP } from '@/components/WorkoutBlocks';

/*
 * Trening w toku. Audyt 0.8.1:
 *  - cały ekran NIE przerysowuje się co 500 ms — zegar sesji i pasek timera mają własne odświeżanie;
 *  - „Poprzednio” dopasowane do serii roboczych (rozgrzewki nie przesuwają podpowiedzi);
 *  - PR przy serii z tego samego silnika co historia i podsumowanie (stats.prMap);
 *  - stoper i przerwa wskazują serię po id; ✓ na trwającej serii kończy pomiar; cofnięcie odhaczenia zatrzymuje
 *    przerwę tylko, jeśli uruchomiła ją ta seria;
 *  - wąski ekran: „Poprzednio” schodzi pod wiersz, gdy kolumny się nie mieszczą.
 */
/** Runda 71 (T1b): jedno pytanie o porzucony trening naraz, nawet gdy ekran treningu jest zamontowany dwa razy. */
let staleOpenFor: string | null = null;

export default function ActiveWorkout() {
  const router = useRouter(); useTick();
  const st = getState(); const w = st.active!;
  const wake = st.settings.wakeLock !== false;
  useEffect(() => { if (!wake) return; activateKeepAwakeAsync('workout').catch(() => {}); return () => { deactivateKeepAwake('workout').catch(() => {}); }; }, [wake]);
  /* M1-audytor-generalny-035: zgoda na powiadomienie o końcu przerwy — karta z wyjaśnieniem przed pytaniem systemu (tylko gdy iOS jeszcze nie pytał); odmowa widoczna jedną linią (niżej) */
  const [perm, setPerm] = useState<ReminderPermission | null>(null); const permTick = useForegroundTick();
  useEffect(() => { reminderPermission().then(setPerm).catch(() => {}); }, [permTick]);
  /* 0.19 (docs/33 B, P4 A): start w dniu z miejscem z planu — okno „Dostosuj do: X” otwiera się samo (raz, tylko gdy są propozycje); nigdy automatyczna zamiana */
  useEffect(() => { const a = getState().active; if (a && takeAutoAdapt(a.id) && a.locationId && (adaptCandidates(a, a.locationId).length || restoreCandidates(a, a.locationId).length)) router.push('/adapt'); }, [w.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const [, force] = useState(0);
  useEffect(() => timer.subscribe(() => force(x => x + 1)), []);
  const finishing = useRef(false); const asking = useRef(false);

  /** Odhaczenie serii: startuje przerwę; cofnięcie — zatrzymuje ją tylko, jeśli pochodziła z tej serii (lib/setFlow.ts — wspólne z zegarkiem). */
  const onDone = async (ei: number, si: number, at?: number) => {
    if (at == null) Keyboard.dismiss(); /* audyt przed telefonem: klawiatura numeryczna nie ma „Gotowe” i zasłaniała pasek przerwy po ✓ */
    const was = !!getState().active?.exercises[ei]?.sets[si]?.done;
    await completeSet(ei, si, at);
    if (!was && getState().active?.exercises[ei]?.sets[si]?.done) playHaptic('done'); /* ZM-07 pkt 2: ✓ w wierszu i „Seria zrobiona” — jedna ścieżka; cofnięcie bez wibracji */
  };
  /* Audyt 0.10 (LIVE-03/04): podpis trwającej przerwy liczony po każdej zmianie treningu („Pomiń dziś”, „Przywróć”, + seria, usunięcie, kolejność) —
   * zawsze ta sama następna seria co na karcie; bez zmiany nic się nie dzieje (timer.relabel porównuje). */
  useEffect(() => { relabelRest(); });
  const finishRef = useRef(finishTimedSet); finishRef.current = finishTimedSet;
  useEffect(() => {
    const i = setInterval(() => { timer.tick(); if (timer.setReached()) finishRef.current().catch(() => {}); }, 500);
    return () => clearInterval(i);
  }, []);
  const startSet = async (setId: string, target: number, subtitle: string, remeasure = false) => {
    Keyboard.dismiss(); /* jak przy ✓ — pasek stopera widoczny */
    if (timer.S.on && timer.S.setId !== setId) await finishTimedSet(); // poprzedni pomiar nie przepada
    timer.labels.title = w.templateName || tr('Trening'); timer.labels.subtitle = subtitle; timer.labels.last = false;
    { const a = getState().active; if (a && isPaused(a)) resumeWorkout(); } /* audyt 0.10 (LIVE-09): start pomiaru w pauzie wznawia trening od tej chwili, jak ✓ */
    // Runda 19: jeden timer naraz — ponowny pomiar zatrzymuje przerwę, a po nim startuje nowa (runda 21: pełna przerwa
    // rundy, bez pamiętania przerwanej — nic nie trzeba przechowywać między restartami ani sprzątać po odznaczeniu).
    void remeasure; await timer.startSet(setId, target);
  };

  /** Zapis treningu (wspólne dla „Zakończ” i porzuconego treningu). `at` — koniec po czasie: ostatnia seria, stoper nie jest liczony. */
  const finalize = async (at?: number) => {
    if (finishing.current) return; finishing.current = true;
    if (at == null && timer.S.on) await finishTimedSet(); // stoper kończymy dopiero po potwierdzeniu — „Wróć” go nie rusza (runda 4)
    const cur = getState().active;
    /* H5 (audyt 0.10, wariant A): skład treningu z szablonu porównany PRZED zapisem (z nieodhaczonymi seriami) — pytanie tylko, gdy się różni */
    const tplNow = cur?.templateId ? getState().templates.find(x => x.id === cur.templateId) : undefined; const snap: Workout | null = cur ? JSON.parse(JSON.stringify(cur)) : null;
    const diff = snap ? templateDiff(tplNow, snap) : null;
    const saved = finishWorkout(at != null && cur ? Math.max(at, lastActivity(cur)) : at); /* T1: koniec nie wcześniej niż ostatnia zapisana seria */ timer.stop(); timer.stopSet(); timer.cancelStaleReminder().catch(() => {});
    if (saved) { markJustFinished(saved.id); /* 0.17.0: ekran sesji może poprosić o ocenę / pokazać zakup po pierwszym treningu */ markDoneEarly(saved); /* docs/18 pkt 4 (11.10.2026): trening zrobiony wcześniej */ onWorkoutSaved(saved).catch(() => {}); if (diff && tplNow && snap) rememberTemplateUpdate(saved.id, tplNow.id, snap); router.push(`/history/${saved.id}`); /* decyzja właściciela 11.10.2026: bez okienka z rekordami — od razu ekran sesji z kartą rekordów (RecordsCard); zmiany w szablonie (H5, 8A 11.10.2026) — przycisk na ekranie sesji, bez okna */ }
  };
  // Runda 69: porzucony trening — po 2 h bez odhaczonej serii pytanie przy otwarciu (także po powrocie z tła);
  // przypomnienie w powiadomieniu 2 h po ostatniej serii.
  const fg = useForegroundTick(); const last = w ? lastActivity(w) : 0; const ref = w ? staleRef(w) : 0; /* T1b: z trwającym stoperem serii — jak pytanie */
  const kind: timer.StaleKind = w ? staleKind(w) : 'none'; const lng = lang(), snd = getState().settings.sound;
  const [minute, setMinute] = useState(0); useEffect(() => { const i = setInterval(() => setMinute(x => x + 1), 60e3); return () => clearInterval(i); }, []); /* T1: sprawdzenie także przy otwartej aplikacji */
  const pausedAt = w?.pausedAt ?? null; /* audyt 0.10 (LIVE-10, wariant B): treść wspomina pauzę */
  const tz = w?.tzOffsetMin; /* LIVE2-04: godziny na zegarze strefy startu */
  useEffect(() => { if (w) timer.scheduleStaleReminder(ref, last, kind, pausedAt, tz).catch(() => {}); return () => { if (!getState().active) timer.cancelStaleReminder().catch(() => {}); }; }, [ref, kind, last, lng, snd, pausedAt, tz]); /* T4a/T4b: godzina w treści, język i dźwięk przypomnienia aktualne */ // eslint-disable-line react-hooks/exhaustive-deps
  /** Pytanie o porzucony trening. Runda 71: blokada na poziomie modułu (dwa zamontowane ekrany nie otwierają dwóch okien),
   * przyciski działają tylko na tym samym treningu (T3), a „Wróć” z potwierdzenia odrzucenia wraca do pytania. */
  const askStale = (tries = 0) => {
    if (isClosingSet() && tries < 10) { setTimeout(() => askStale(tries + 1), 300); return; }
    if (timer.setReached()) { finishRef.current().then(() => askStale()).catch(() => {}); return; } /* T11: najpierw domknięcie serii czasowej po celu — pytanie widzi te same dane co zapis po 6 h */
    { const tm = getState().timer; const pos = tm?.setStartAt && Number(tm.setTarget) > 0 ? findSet(tm.setId) : null; const cur0 = getState().active;
      /* T11: zimny start — stoper z zapisu jeszcze nie odtworzony (timer.restore), a jego cel już minął: chwila na domknięcie serii */
      if (pos && cur0 && !cur0.exercises[pos.ei].sets[pos.si].done && Date.now() - tm.setStartAt! >= Number(tm.setTarget) * 1000 && tries < 10) { setTimeout(() => askStale(tries + 1), 300); return; } }
    const cur = getState().active; const since = staleSince(); if (!cur || since == null || staleOpenFor === cur.id || asking.current || finishing.current) return;
    const id = cur.id; staleOpenFor = id; asking.current = true; const done = () => { asking.current = false; staleOpenFor = null; };
    const same = () => getState().active?.id === id; const k = staleKind(cur);
    Alert.alert(tr('Trening wciąż trwa'), timer.staleBody(k, since, true, cur.pausedAt, cur.tzOffsetMin), [
      { text: tr('Kontynuuj'), onPress: () => { done(); if (same()) ackStale(); } },
      ...(k === 'work' ? [{ text: tr('Zakończ i zapisz'), onPress: () => { done(); if (same()) finalize(since); } }] : []),
      { text: tr('Odrzuć'), style: 'destructive' as const, onPress: () => { Alert.alert(tr('Odrzucić trening?'), tr('Serie z tej sesji przepadną.'), [{ ...cancelButton(), onPress: () => { done(); askStale(); } }, { text: tr('Odrzuć trening'), style: 'destructive', onPress: () => { done(); if (!same()) return; cancelWorkout(); timer.stop(); timer.stopSet(); timer.cancelStaleReminder().catch(() => {}); } }]); } }, /* T1: potwierdzenie — okno pojawia się niespodziewanie */
    ]);
  };
  useEffect(() => { askStale(); }, [fg, minute]); // eslint-disable-line react-hooks/exhaustive-deps
  /** 0.20 (decyzja właściciela 13.10.2026): przed „Zakończ” prośba o uzupełnienie serii odhaczonych na zegarku jako „zrobione inaczej niż w planie” (wzorzec potwierdzeń docs/32:
   * „Anuluj” wraca do treningu, „Zakończ mimo to” zostawia wartości z planu). Rekord dla takich serii liczy się dopiero po uzupełnieniu. */
  const finish = () => {
    if (finishing.current || asking.current) return;
    const toFill = w.exercises.reduce((a, e) => a + e.sets.filter(x => x.done && x.toFill).length, 0);
    if (toFill) { asking.current = true; Alert.alert(tr('Serie do uzupełnienia'), tr('Z zegarka oznaczono serie jako zrobione inaczej niż w planie: {n}. Uzupełnij powtórzenia i ciężar — rekord liczy się dopiero po uzupełnieniu.', { n: toFill }),
      [{ ...cancelButton(), onPress: () => { asking.current = false; } }, { text: tr('Zakończ mimo to'), onPress: () => { asking.current = false; finishCore(); } }]); return; }
    finishCore();
  };
  const finishCore = () => {
    if (finishing.current || asking.current) return; // runda 6: podwójne tapnięcie nie otwiera dwóch okien
    const ask = (title: string, msg: string, buttons: { text: string; style?: 'destructive' | 'cancel'; onPress?: () => void }[]) => { asking.current = true; Alert.alert(title, msg, buttons.map(b => ({ ...b, onPress: () => { asking.current = false; b.onPress?.(); } }))); };
    // Trwająca seria na czas liczy się jak odhaczona — zapisze się dopiero po „Zakończ”. Runda 5: tylko gdy ta seria
    // istnieje i nie jest już odhaczona; do serii roboczych tylko, gdy nie jest rozgrzewką.
    const rpos = timer.S.on ? findSet(timer.S.setId) : null; const rset = rpos ? w.exercises[rpos.ei]?.sets[rpos.si] : null;
    const runId = rset && !rset.done ? rset.id : null;
    const running = runId ? 1 : 0;
    const done = w.exercises.reduce((a, e) => a + e.sets.filter(s => s.done).length, 0) + running;
    /* LIVE2-02 (audyt kontrolny 1): serie robocze jak workingSets (D3 — drop razem z serią przed nim); trwający pomiar liczy się jak odhaczony */
    const doneWork = w.exercises.reduce((a, e) => a + (exById(e.exerciseId) ? workSetCount(e.sets.map(s => s.id === runId ? { ...s, done: true } : s)) : 0), 0);
    const go = () => finalize();
    // Runda 7: wpisane, nieodhaczone serie liczymy przed wszystkimi oknami — każde o nich ostrzega.
    const typed = (e: WExercise, s: WSet) => !e.skipped /* „Pomiń dziś” — świadomie pominięte */ && !s.done && s.id !== runId && setHasValue(s) && !isPrefill(e, s);
    const pending = w.exercises.reduce((a, e) => a + e.sets.filter(s => typed(e, s)).length, 0);
    /* Audyt 0.10 (LIVE-05, wariant B): pozostałe nieodhaczone serie (także wstawione z planu) w ćwiczeniach zaczętych (≥ 1 odhaczona albo mierzona) —
     * bez szumu przy świadomie przerwanym treningu (ćwiczenia niezaczęte i pominięte się nie liczą); rozłącznie z liczbą wpisanych wyników. */
    const started = (e: WExercise) => !e.skipped && e.sets.some(s => s.done || s.id === runId);
    const rest = w.exercises.reduce((a, e) => a + (started(e) ? e.sets.filter(s => !s.done && s.id !== runId && !typed(e, s)).length : 0), 0);
    const pendingLine = [pending ? tr('Nieodhaczone serie z wpisanymi wynikami: {n} — nie zostaną zapisane. Seria zapisuje się po odhaczeniu ✓.', { n: pending }) : '',
      rest ? (pending ? tr('Pozostałe nieodhaczone serie: {n} — też nie zostaną zapisane.', { n: rest }) : tr('Nieodhaczone serie: {n} — nie zostaną zapisane.', { n: rest })) : ''].filter(Boolean).join('\n');
    // Bez odhaczonych serii nie zapisujemy pustej sesji (stałaby się źródłem „Powtórz ostatni”).
    if (!done) { ask(tr('Brak odhaczonych serii'), [tr('Nic do zapisania. Odrzucić ten trening?'), pendingLine].filter(Boolean).join('\n'), [{ ...cancelButton() }, { text: tr('Odrzuć trening'), style: 'destructive', onPress: () => { cancelWorkout(); timer.stop(); timer.stopSet(); } }]); return; }
    // Zawsze potwierdzenie + ostrzeżenia: wpisane, nieodhaczone serie; odhaczone serie bez powtórzeń.
    const zeroReps = w.exercises.reduce((a, e) => { const ex = exById(e.exerciseId); return a + (ex && hasReps(ex.metric ?? 'weight_reps') ? e.sets.filter(s => s.done && s.kind !== 'warmup' && !(Number(s.reps) > 0)).length : 0); }, 0);
    // Runda 52/53: odhaczone (i mierzona właśnie) serie bez czasu/dystansu; mierzona dostanie czas przy „Zakończ”, dystansu — nie.
    const zeroVal = w.exercises.reduce((a, e) => { const ex = exById(e.exerciseId); const m = ex?.metric ?? 'weight_reps'; return a + (ex && (hasTime(m) || hasDistance(m)) ? e.sets.filter(s => (s.done || s.id === runId) && s.kind !== 'warmup' && ((hasTime(m) && !(Number(s.durationSec) > 0) && s.id !== rset?.id) || (hasDistance(m) && !(Number(s.distanceM) > 0)))).length : 0); }, 0);
    // Runda 6: sama rozgrzewka — jasny komunikat i możliwość odrzucenia (pusta sesja psułaby „Powtórz ostatni”).
    if (!doneWork) { ask(tr('Tylko rozgrzewka'), [tr('Odhaczone są tylko serie rozgrzewkowe ({n}). Zapisać taki trening?', { n: done }), pendingLine].filter(Boolean).join('\n'), [{ ...cancelButton() }, { text: tr('Odrzuć trening'), style: 'destructive', onPress: () => { cancelWorkout(); timer.stop(); timer.stopSet(); } }, { text: tr('Zapisz'), onPress: () => { go(); } }]); return; }
    /* weryfikacja 3 (L1): odhaczone serie robocze ćwiczeń z ciężarem (nie masa ciała) bez wpisanego ciężaru — ostrzeżenie jak przy powtórzeniach */
    const zeroW = w.exercises.reduce((a, e) => { const ex = exById(e.exerciseId); return a + (ex && !isBW(ex) && hasWeight(ex.metric ?? 'weight_reps') ? e.sets.filter(s => s.done && s.kind !== 'warmup' && (s.weight === '' || s.weight == null)).length : 0); }, 0);
    const msg = [tr('Zapisane zostaną serie robocze: {n}.', { n: doneWork }), pendingLine, zeroReps ? tr('Odhaczone serie bez powtórzeń: {n}.', { n: zeroReps }) : '', zeroW ? tr('Odhaczone serie bez ciężaru: {n}.', { n: zeroW }) : '', zeroVal ? tr('Odhaczone serie bez czasu lub dystansu: {n}.', { n: zeroVal }) : ''].filter(Boolean).join('\n');
    ask(tr('Zakończyć trening?'), msg, [{ ...cancelButton() }, { text: tr('Zakończ'), onPress: () => { go(); } }]);
  };
  /* Audyt 0.10 (LIVE-12): blokada jak w „Zakończ” — dwa szybkie tapnięcia nie otwierają dwóch okien */
  const cancel = () => { if (finishing.current || asking.current) return; asking.current = true; const done = () => { asking.current = false; };
    Alert.alert(tr('Odrzucić trening?'), tr('Serie z tej sesji przepadną.'), [{ ...cancelButton(), onPress: done }, { text: tr('Odrzuć trening'), style: 'destructive', onPress: () => { done(); cancelWorkout(); timer.stop(); timer.stopSet(); } }]); };
  const once = useOnce(); /* audyt 0.10 (UI-08): przejścia z ekranu treningu bez podwójnego ekranu */
  /* Audyt 0.10 (LIVE-07, wariant A): dolny pasek przerwy w widoku skupionym, gdy przerwa w karcie jest poza ekranem (przewinięcie listy) */
  const restY = useRef<{ card: number | null; panel: number | null }>({ card: null, panel: null }); const scrollY = useRef(0); const [restOff, setRestOff] = useState(false);
  const checkRest = () => { const { card, panel } = restY.current; const off = card != null && panel != null && scrollY.current > card + panel; setRestOff(off); };

  if (!w) return null; // runda 48: druga instancja ekranu po zakończeniu treningu
  const labels = groupLabels(w.exercises);
  const prs = prMap(w);
  const board = st.settings.workoutView !== 'list'; const cur = board ? focusSet(w) : null; const next = cur && cur.ei + 1 < w.exercises.length ? cur.ei + 1 : -1; /* „Następne ćwiczenia” — nagłówek przed blokami po bieżącym */
  return (
    <View style={{ flex: 1 }}>
      <ScrollView testID="workout-scroll" contentContainerStyle={{ paddingBottom: 170 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" automaticallyAdjustKeyboardInsets scrollEventThrottle={64} onScroll={ev => { scrollY.current = ev.nativeEvent.contentOffset.y; checkRest(); }}>
        <View style={s.head}>
          <WorkoutTitle w={w} />
          <MoreButton label={tr('Opcje treningu')} onPress={() => openWorkoutMenu(w, router, () => force(x => x + 1))} />
          <HeaderButton testID="finish-workout" title={tr('Zakończ')} onPress={finish} />{/* ZM-02 / W1 a: „Zakończ” drugorzędny (tekst w nagłówku, nie przycisk główny) */}
        </View>
        <SessionProgress w={w} />
        <PauseNote w={w} />
        <AdaptLine w={w} />
        {board ? <NowBoard w={w} onDone={onDone} onFinish={finish} onStartSet={startSet} onCardY={y => { restY.current.card = y; checkRest(); }} onRestY={y => { restY.current.panel = y; checkRest(); }} /> : null}
        <RestNotices perm={perm} setPerm={setPerm} />
        {w.exercises.map((e, ei) => <React.Fragment key={e.id}>{board && next === ei ? <H2 style={{ marginTop: SPACE.s }}>{tr('Następne ćwiczenia')}</H2> : null}<ExerciseBlock w={w} e={e} ei={ei} onDone={onDone} onStartSet={startSet} labels={labels} prs={prs} /></React.Fragment>)}
        <View style={{ flexDirection: 'row', gap: 8 }}><Btn title={tr('+ Dodaj ćwiczenie')} style={{ flex: 1 }} onPress={once(() => router.push('/picker?target=active'))} />{w.exercises.length > 1 ? <Btn title={tr('≡ Kolejność')} accessibilityLabel={tr('Zmień kolejność ćwiczeń')} onPress={once(() => router.push('/reorder?target=active'))} /> : null}</View>
        <View style={{ marginTop: 16 }}><Muted style={{ marginBottom: 5 }}>{tr('Notatka do treningu')}</Muted><Input testID="workout-note" /* E2E 25 */ maxLength={1000} value={w.note} onChangeText={v => { w.note = v; save(w); }} placeholder={tr('np. samopoczucie, ból, sprzęt')} accessibilityLabel={tr('Notatka do treningu')} multiline /><MedicalNote /></View>
        <Btn title={tr('Odrzuć trening')} kind="danger" block style={{ marginTop: 24 }} onPress={cancel} />
        {/* tylko build E2E z udawanym zegarkiem (lib/watch/test-mode.ts); poza nim null */}
        <TestWatchPanel />
      </ScrollView>
      <TimerBar onFinishSet={() => finishTimedSet()} restInCard={board && !restOff} />
    </View>
  );
}

export { afterSwap, confirmUndoSwap, rowLayout }; /* przeniesione do components/WorkoutBlocks.tsx (M3 p2) — ekrany i testy importują je stąd jak dotąd */
export { relabelRest }; /* lib/setFlow.ts — wspólne z zegarkiem */

/** P-003 E1: miejsce treningu (tylko gdy są miejsca) — zmiana miejsca tylko dla tej sesji; nic nie jest przepisywane ani zamieniane (A-002) — zmienia się filtr
 * wyboru ćwiczeń, plakietki braku sprzętu i podpowiedzi. M3 p2 (ZM-02): wpis w menu „⋯” treningu zamiast chipa pod nazwą; arkusz bez zmian. */
function openLocationSheet(w: Workout, router: ReturnType<typeof useRouter>) {
  const locs = visibleLocations(); if (!locs.length) return;
  /* 0.19 (docs/33 A4): ostatnia pozycja arkusza — „Inne miejsce (tylko dziś)…” (szybka lista sprzętu, app/place-once.tsx); miejsca jednorazowe nie są na liście */
  ActionSheetIOS.showActionSheetWithOptions({ options: [...locs.map(l => l.name), tr('Inne miejsce (tylko dziś)…'), tr('Anuluj')], cancelButtonIndex: locs.length + 1, title: tr('Miejsce tego treningu') }, i => {
    if (i === locs.length) { if (getState().active?.id === w.id) router.push('/place-once'); return; }
    const l = locs[i]; const a = getState().active; if (!l || !a || a.id !== w.id) return; const was = a.locationId; setActiveLocation(l.id); /* decyzja 8c: przyrządy bloków wg nowego miejsca */
    /* 0.18 (docs/33, P2 A): miejsce z brakami albo z ćwiczeniami do przywrócenia — okno „Dostosuj do: X” otwiera się samo (tylko propozycje do przejrzenia) */
    const cur = getState().active; if (cur && was !== l.id && (adaptCandidates(cur, l.id).length || restoreCandidates(cur, l.id).length)) router.push('/adapt'); });
}

/** 0.18 (docs/33, P2 A): wiersz pod chipem miejsca — „N ćwiczeń bez sprzętu · Dostosuj” (do ponownego otwarcia okna i przy starcie z miejscem z brakami);
 * gdy brak braków, a są ćwiczenia do przywrócenia z planu — „N ćwiczeń wraca do planu · Dostosuj”. Nic nie zmienia samo. */
function AdaptLine({ w }: { w: Workout }) {
  const th = useTheme(); const router = useRouter(); const once = useOnce();
  const na = w.locationId ? adaptCandidates(w, w.locationId).length : 0; const nr = w.locationId ? restoreCandidates(w, w.locationId).length : 0; if (!na && !nr) return null;
  const text = na ? tr('{n} {w} · Dostosuj', { n: na, w: tp(na, 'ćwiczenie bez sprzętu|ćwiczenia bez sprzętu|ćwiczeń bez sprzętu') }) : tr('{n} {w} · Dostosuj', { n: nr, w: tp(nr, 'ćwiczenie wraca do planu|ćwiczenia wracają do planu|ćwiczeń wraca do planu') });
  return <Pressable testID="adapt-line" accessibilityLanguage={lang()} onPress={once(() => router.push('/adapt'))} accessibilityRole="button" accessibilityLabel={text} accessibilityHint={tr('Otwiera propozycje zamian na to miejsce.')} hitSlop={LINK_SLOP} style={[LINK_BOX, { alignSelf: 'flex-start' }]}>
    <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: th.accent, ...font('callout'), ...FW.semibold }}>{text}</Text></Pressable>;
}

/** Etykieta serii (lib/live.ts — wspólna z podpisem przerwy w timerze); eksport zostaje dla ekranów, które importują ją stąd. */
export { setLabel };

/** Czy nieodhaczona seria zawiera tylko wartości wstawione automatycznie (ciężar startowy / „Poprzednio”), a nie wpisane ręcznie. */
function isPrefill(_e: WExercise, s: WSet) { return !s.edited; } // runda 2: liczą się tylko pola wpisane ręcznie

/** Nagłówek treningu w jednej linii (ZM-02, wzorzec 30): nazwa i czas trwania; odświeża tylko siebie co sekundę. 08.10.2026 (decyzja właściciela): pauza zatrzymuje zegar treningu
 * i odejmuje się od czasu trwania; przerwa i stoper serii liczą dalej, odhaczenie serii wznawia trening (store.toggleDone). */
function WorkoutTitle({ w }: { w: Workout }) {
  const th = useTheme(); const [, force] = useState(0);
  useEffect(() => { const i = setInterval(() => force(x => x + 1), 1000); return () => clearInterval(i); }, []);
  const paused = isPaused(w);
  return <View style={{ flex: 1, minWidth: 0, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: SPACE.s }}>{/* jedna linia przy zwykłym tekście; przy dużym tekście nazwa się zawija, nie ucina (DEC-10) */}
    <Text testID="workout-name" accessibilityLanguage={lang()} accessibilityRole="header" maxFontSizeMultiplier={maxScale('navTitle')} style={{ color: th.text, ...font('navTitle'), flexShrink: 1 }}>{w.templateName || tr('Trening')}</Text>
    <Muted testID="workout-clock" maxFontSizeMultiplier={maxScale('callout')} style={{ flexShrink: 0 }}>{fmtDur(workoutDurSec(w))}{paused ? ` · ${tr('pauza')}` : ''}</Muted>
  </View>;
}
/** Pauza zwinięta do jednej linii pod nagłówkiem (tylko w pauzie) — wznowienie w menu „⋯”. */
function PauseNote({ w }: { w: Workout }) {
  if (!isPaused(w)) return null;
  return <InfoTip id="pause" label={tr('Pauza — czas treningu stoi. Odhaczenie serii wznawia.')} info={tr('Zegar treningu stoi i pauza nie wlicza się do czasu trwania. Przerwa między seriami liczy dalej; odhaczenie serii wznawia trening.')}><Muted style={font('footnote')}>{tr('Pauza — czas treningu stoi. Odhaczenie serii wznawia.')}</Muted></InfoTip>;
}

/** 19.10.2026 (decyzja właściciela: „ludzie odkryją to w trakcie treningu”): „Głos” pod ręką w trakcie treningu — od M3 p2 (ZM-02) w menu „⋯” (arkusz z trzema opcjami,
 * bez przełączania po kolei — nie trafimy przypadkiem w głośnik). Zmiana jest trwała — to samo pole co w Ustawieniach. */
function openVoiceSheet(done: () => void) {
  const v = voiceSetting(); const cancel = VOICE_SETTINGS.length;
  ActionSheetIOS.showActionSheetWithOptions({ title: tr('Zapowiedzi głosowe'), options: [...VOICE_SETTINGS.map(k => (k === v ? '✓ ' : '') + voiceSettingLabel(k)), tr('Anuluj')], cancelButtonIndex: cancel }, i => {
    const k = VOICE_SETTINGS[i]; if (i === cancel || !k) return; setVoiceSetting(k); done(); });
}
/** Menu „⋯” treningu (ZM-02, wzorzec 30): miejsce (gdy są miejsca), pauza / wznowienie, głos, notatka szablonu (gdy jest) — arkusz akcji z „Anuluj”. */
function openWorkoutMenu(w: Workout, router: ReturnType<typeof useRouter>, done: () => void) {
  const items: { label: string; run: () => void }[] = []; const note = w.templateId ? getState().templates.find(x => x.id === w.templateId)?.note : undefined; const paused = isPaused(w);
  if (visibleLocations().length) items.push({ label: tr('Miejsce treningu: {l}', { l: w.locationId ? locationLabel(w.locationId) : tr('bez miejsca') }), run: () => openLocationSheet(w, router) });
  items.push({ label: paused ? tr('Wznów trening') : tr('Pauza treningu'), run: () => { if (paused) resumeWorkout(); else pauseWorkout(); done(); } });
  items.push({ label: tr('Zapowiedzi głosowe: {mode}', { mode: voiceSettingLabel(voiceSetting()) }), run: () => openVoiceSheet(done) });
  if (note) items.push({ label: tr('Notatka szablonu'), run: () => Alert.alert(tr('Notatka szablonu'), note, [okButton()]) });
  ActionSheetIOS.showActionSheetWithOptions({ title: w.templateName || tr('Trening'), options: [...items.map(x => x.label), tr('Anuluj')], cancelButtonIndex: items.length }, i => { items[i]?.run(); });
}

/** Runda 75 (T-016): postęp sesji, cienki pasek pod zegarem. Audyt 0.10 (D3, fala 2): serie ROBOCZE jedną funkcją store.workCount / workSetCount —
 * bez rozgrzewek, drop set razem z serią przed nim (jak Postępy, karta szablonu i lista Historii); „Pomiń dziś” — liczą się tylko odhaczone serie bloku. */
function SessionProgress({ w }: { w: Workout }) {
  const t = useTheme(); let all = 0, done = 0; for (const e of w.exercises) { const sets = e.skipped ? e.sets.filter(x => x.done) : e.sets; all += workCount(sets.map(x => x.kind)); done += workSetCount(e.sets); }
  if (!all) return null; const pct = Math.min(100, Math.round(done / all * 100));
  return <View accessibilityLanguage={lang()} accessible accessibilityRole="progressbar" accessibilityLabel={tr('Postęp treningu: {d} z {n} serii', { d: done, n: all })} accessibilityValue={{ min: 0, max: all, now: done }} style={{ marginTop: SPACE.xs, flexDirection: 'row', alignItems: 'center', gap: SPACE.s }}>
    <View style={{ flex: 1, height: SPACE.xs, borderRadius: RADIUS.marker, backgroundColor: t.line, overflow: 'hidden' }}><View style={{ width: `${pct}%`, height: SPACE.xs, backgroundColor: t.accent }} /></View>
    <Muted style={font('footnote')}>{done}/{all}</Muted>
  </View>;
}

/** ZM-02 pkt 4 (wzorzec 30): prośba o zgodę na powiadomienia o końcu przerwy przy PIERWSZEJ przerwie — jeden wiersz pod tablicą, nie w nagłówku; iOS zapyta dopiero po „Powiadamiaj”
 * (M1-035: wyjaśnienie przed pytaniem systemu). „Nie teraz” chowa wiersz do końca uruchomienia aplikacji. Po odmowie komunikat pojawia się raz (w tej przerwie), potem zgodę
 * włącza się tylko w Ustawieniach iOS (przełącznik przypomnień pokazuje ten stan). „Raz” = raz na uruchomienie aplikacji — trwałe „widziałem” wymagałoby nowego pola danych [DO USTALENIA]. */
let deniedSeen = false;
export const __resetRestNoticesForTests = () => { deniedSeen = false; };
function RestNotices({ perm, setPerm }: { perm: ReminderPermission | null; setPerm: (p: ReminderPermission) => void }) {
  const th = useTheme(); const [, force] = useState(0); const resting = timer.T.on; const [denyShown, setDenyShown] = useState(false);
  useEffect(() => { if (resting && perm === 'denied' && !deniedSeen) { deniedSeen = true; setDenyShown(true); } if (!resting) setDenyShown(false); }, [resting, perm]);
  if (!resting) return null;
  const box = { gap: SPACE.s, marginTop: SPACE.s, padding: SPACE.m, borderRadius: RADIUS.group, backgroundColor: th.surface2 };
  if (perm === 'undetermined' && !restExplainDismissed()) return <View testID="perm-explain-workout" style={box}>
    <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={maxScale('callout')} style={{ color: th.text, ...font('callout') }}>{tr('Przerwa trwa — powiadomić na koniec?')}</Text>
    <View style={{ flexDirection: 'row', gap: SPACE.s, flexWrap: 'wrap' }}><Btn small kind="primary" title={tr('Powiadamiaj')} onPress={() => { requestRestNotificationPermission().then(setPerm).catch(() => {}); }} /><Btn small kind="ghost" title={tr('Nie teraz')} onPress={() => { dismissRestExplain(); force(x => x + 1); }} /></View>
  </View>;
  if (denyShown) return <View testID="perm-denied-workout" style={box}><Muted>{tr('Brak zgody na powiadomienia — przypomnienia i koniec przerwy nie przyjdą. Zgodę włączysz w Ustawieniach iOS.')}</Muted><Btn small title={tr('Otwórz Ustawienia iOS')} onPress={() => { Linking.openSettings().catch(() => {}); }} style={{ alignSelf: 'flex-start' }} /></View>;
  return null;
}

/** Dolny pasek: stoper serii czasowej (gdy trwa) albo timer przerwy. Odświeża się sam (250 ms), bez reszty ekranu. */
function TimerBar({ onFinishSet, restInCard }: { onFinishSet: () => void; restInCard?: boolean }) {
  const t = useTheme(); const [, force] = useState(0); const { width } = useWindowDimensions(); const big = width < 360 ? 28 : 34;
  useEffect(() => timer.subscribe(() => force(x => x + 1)), []);
  useEffect(() => { const i = setInterval(() => { if (timer.S.on || timer.T.on) force(x => x + 1); }, 250); return () => clearInterval(i); }, []);
  if (timer.S.on) {
    const el = timer.setElapsed(); const target = timer.S.targetSec; const left = target - el; const over = target > 0 && left <= 0;
    const txt = target > 0 ? (over ? '+' + fmtSec(-left) : fmtSec(left)) : fmtSec(el);
    return (
      <View style={[s.timer, { backgroundColor: t.surface, borderColor: t.band }]}>
        <View><Text accessibilityLanguage={lang()} style={{ color: over ? t.danger : t.band, ...font('boardClock'), fontSize: big, lineHeight: big + 4 }} maxFontSizeMultiplier={maxScale('stat')}>{monoSafe(txt, true)}</Text><Muted style={font('footnote')}>{target > 0 ? tr('seria · cel {s}', { s: fmtSec(target) }) : tr('seria · bez celu')}</Muted></View>
        <View style={{ flex: 1 }} />
        <Btn title={tr('Zakończ serię')} small kind="primary" onPress={onFinishSet} />
      </View>
    );
  }
  if (!timer.T.on || restInCard) return null; /* widok skupiony (07.10.2026): przerwa w karcie „teraz” (RestPanel) — jeden zestaw przycisków na ekranie */
  return <View style={[s.timer, { backgroundColor: t.surface, borderColor: t.accent }]}><RestPanel big={big} /></View>;
}

/** Przerwa: odliczanie i −15 / +15 / Pomiń — w dolnym pasku (widok listy) albo w karcie „teraz” (widok skupiony, decyzja 07.10.2026 pkt 3). */
function RestPanel({ big }: { big: number }) {
  const t = useTheme(); const [, force] = useState(0);
  useEffect(() => { const i = setInterval(() => { if (timer.T.on) force(x => x + 1); }, 250); return () => clearInterval(i); }, []);
  const left = Math.round((timer.T.endAt - Date.now()) / 1000); const over = left <= 0;
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
    <View><Text accessibilityLanguage={lang()} style={{ color: over ? t.danger : t.accent, ...font('boardClock'), fontSize: big, lineHeight: big + 4 }} maxFontSizeMultiplier={maxScale('stat')}>{over ? '+' + fmtDur(-left) : fmtDur(left)}</Text><Muted style={font('footnote')}>{over ? tr('przerwa minęła') : tr('przerwa z {s}', { s: fmtDur(timer.T.total) })}</Muted></View>
    <View style={{ flex: 1 }} />
    <Btn title="−15" small accessibilityLabel={tr('Skróć przerwę o 15 sekund')} onPress={() => timer.adjust(-15)} /><Btn title="+15" small accessibilityLabel={tr('Wydłuż przerwę o 15 sekund')} onPress={() => timer.adjust(15)} /><Btn title={tr('Pomiń')} small kind="primary" onPress={() => timer.stop()} />
  </View>;
}
const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACE.s, gap: SPACE.xs },
  timer: { position: 'absolute', left: 0, right: 0, bottom: SPACE.s, borderWidth: 1, borderRadius: RADIUS.group, padding: SPACE.m, flexDirection: 'row', alignItems: 'center', gap: SPACE.s },
});
