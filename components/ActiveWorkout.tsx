import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet, useWindowDimensions, ActionSheetIOS, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useTheme, F, NUM_SCALE_MAX } from '@/lib/theme';
import { Btn, Input, NumInput, Muted, useOnce, monoSafe } from '@/components/ui';
import { effortLabel, effortField, effortIn, isPaused, workoutDurSec, pauseWorkout, resumeWorkout, progressionFor, skipExercise, unskipExercise, writeLoad, setActiveLocation, lastActivity, staleSince, staleRef, staleKind, ackStale, markActivity, useForegroundTick, bandA11y, clampName, loadLabelShort, getState, useTick, exById, prevOfActiveBlock, previousFor, canUndoSwap, undoSwap, pinnedImpl, rememberRest as storeRememberRest, canRememberAlt, rememberAlt, altHint, acceptAlt, skipAlt, occurrence, occurrences, hintFor, isBW, reps, fmtDur, fmtSec, fmtTime, setSummary, toggleDone, restAfter, roundRest, addSet, removeSet, removeSetById, removeExercise, finishWorkout, cancelWorkout, save, loadLabel, groupLabels, linkWithNext, unlink, cycleBand, findSet, shortBand, setHasValue, locationById, offListNote, liveBlockImpl, listLocFor, srcSetAt, usesBand, focusSet, isDeloadWeek, wallTs, workCount, workSetCount, REPS_MAX, REST_MAX } from '@/lib/store';
import { restLabel, setLabel, nowParts, focusCounter } from '@/lib/live';
import { availability, missingLabel } from '@/lib/equipment';
import { EquipVisual } from '@/components/EquipVisual';
import { SwipeRow, lastSetBlock } from '@/components/SwipeRow';
import { MedicalNote } from '@/components/MedicalNote';
import { templateDiff, templateDiffText, updateTemplateFromWorkout } from '@/lib/tplsync';
import { equipVisFor, equipSlotFor } from '@/lib/equipvis';
import Svg, { Circle } from 'react-native-svg';
import { implLabel } from '@/lib/swap';
import { SetBadge } from '@/components/SetBadge';
import { locationLabel } from '@/lib/locations';
import * as timer from '@/lib/timer';
import { prMap, workoutPRs, prCountOf } from '@/lib/stats';
import { onWorkoutSaved } from '@/lib/backup';
import { hasTime, hasReps, hasWeight, hasDistance, SET_KIND_LABEL, type WExercise, type WSet, type Workout } from '@/lib/seed';
import { t as tr, tp, exName, lang, glue } from '@/lib/i18n';
import { wu, wField, wInKeep, fmtW } from '@/lib/units';

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
  const t = useTheme(); const router = useRouter(); useTick();
  const st = getState(); const w = st.active!;
  const wake = st.settings.wakeLock !== false;
  useEffect(() => { if (!wake) return; activateKeepAwakeAsync('workout').catch(() => {}); return () => { deactivateKeepAwake('workout').catch(() => {}); }; }, [wake]);
  useEffect(() => { timer.ensurePermission().catch(() => {}); }, []);
  const [, force] = useState(0);
  useEffect(() => timer.subscribe(() => force(x => x + 1)), []);
  const finishing = useRef(false); const asking = useRef(false);

  /** Odhaczenie serii: startuje przerwę; cofnięcie — zatrzymuje ją tylko, jeśli pochodziła z tej serii. */
  const onDone = async (ei: number, si: number, at?: number) => {
    if (at == null) Keyboard.dismiss(); /* audyt przed telefonem: klawiatura numeryczna nie ma „Gotowe” i zasłaniała pasek przerwy po ✓ */
    const a = getState().active; if (!a) return; const set = a.exercises[ei]?.sets[si]; if (!set) return;
    if (timer.S.on && timer.S.setId === set.id) { await finishTimedSet(); return; }
    if (timer.S.on && timer.S.setId !== set.id && !set.done) await finishTimedSet(); // runda 19: odhaczenie innej serii kończy trwający pomiar (jeden timer naraz)
    if (!set.done) restLabels(ei, si); // runda 23: tylko przy odhaczeniu — odznaczenie nie zmienia podpisu trwającej przerwy
    const rest = toggleDone(ei, si, at);
    /* T8: przerwa liczona od końca serii — po późnym wybudzeniu zostaje reszta albo nic */
    const live = !!rest && (at == null || at + rest * 1000 > Date.now());
    if (set.done) { if (rest && live) await timer.start(rest, set.id, at); else await timer.stop(); }
    else await timer.stopIfFrom(set.id);
  };
  /** Podpis przerwy na Live Activity: następna seria albo następne ćwiczenie (runda 22: wspólny dla odhaczenia i ponownego pomiaru; audyt 0.10 LIVE-04:
   * ta sama reguła co karta „teraz”, po ostatniej serii — `last`). */
  const restLabels = (ei: number, si: number) => {
    const a = getState().active; if (!a) return; const e = a.exercises[ei]; if (!e) return; timer.labels.title = a.templateName || tr('Trening');
    const r = restLabel(a, ei, si); timer.labels.subtitle = r.sub; timer.labels.last = r.last;
  };
  /* Audyt 0.10 (LIVE-03/04): podpis trwającej przerwy liczony po każdej zmianie treningu („Pomiń dziś”, „Przywróć”, + seria, usunięcie, kolejność) —
   * zawsze ta sama następna seria co na karcie; bez zmiany nic się nie dzieje (timer.relabel porównuje). */
  useEffect(() => { relabelRest(); });
  /** Koniec serii czasowej (auto po osiągnięciu celu, ✓ albo ręcznie): zapisuje czas (maks. cel) i odhacza. */
  const closingSet = useRef(false); /* T11: domykanie serii czasowej w toku — pytanie o porzucony trening czeka */
  const finishTimedSet = async () => { closingSet.current = true; try { await finishTimedSetInner(); } finally { closingSet.current = false; } };
  const finishTimedSetInner = async () => {
    const { setId, sec, endAt } = await timer.stopSet(); const pos = findSet(setId); const a = getState().active; if (!pos || !a) return;
    const set = a.exercises[pos.ei].sets[pos.si]; set.durationSec = Math.max(1, sec); if (set.done) markActivity(a, endAt); /* Q-010 */ save(a);
    if (!set.done) await onDone(pos.ei, pos.si, endAt);
    else { const nx = a.exercises[pos.ei].sets[pos.si + 1]; const rest = nx && nx.kind === 'drop' && !nx.done ? null /* T7: przed drop setem bez przerwy, także po ponownym pomiarze */ : restAfter(pos.ei, pos.si) ?? roundRest(pos.ei); if (rest && endAt + rest * 1000 > Date.now()) { restLabels(pos.ei, pos.si); await timer.start(rest, set.id, endAt); } /* T9: przerwa od końca serii, jak przy pierwszym pomiarze */ } // runda 19/21/22: po ponownym pomiarze przerwa od nowa (w supersecie — przerwa rundy)
  };
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
    const prs = workoutPRs(w); const cur = getState().active;
    /* H5 (audyt 0.10, wariant A): skład treningu z szablonu porównany PRZED zapisem (z nieodhaczonymi seriami) — pytanie tylko, gdy się różni */
    const tplNow = cur?.templateId ? getState().templates.find(x => x.id === cur.templateId) : undefined; const snap: Workout | null = cur ? JSON.parse(JSON.stringify(cur)) : null;
    const diff = snap ? templateDiff(tplNow, snap) : null;
    const askTpl = () => { if (!diff || !tplNow || !snap) return; Alert.alert(tr('Zaktualizować szablon „{name}”?', { name: tplNow.name }), [templateDiffText(diff), tr('Szablon zmieni się tylko po „Zaktualizuj szablon”.')].join('\n'), [{ text: tr('Tylko ten raz'), style: 'cancel' }, { text: tr('Zaktualizuj szablon'), onPress: () => { if (getState().templates.includes(tplNow)) updateTemplateFromWorkout(tplNow, snap); } }]); };
    const saved = finishWorkout(at != null && cur ? Math.max(at, lastActivity(cur)) : at); /* T1: koniec nie wcześniej niż ostatnia zapisana seria */ timer.stop(); timer.stopSet(); timer.cancelStaleReminder().catch(() => {});
    if (saved) { onWorkoutSaved(saved).catch(() => {}); router.push(`/history/${saved.id}`); const nPR = prCountOf(prs); /* T13: liczba rekordów, nie serii; E3 (audyt 0.10): ta sama funkcja co karta „Ostatni trening” */ if (prs.length) setTimeout(() => Alert.alert(nPR === 1 ? tr('Nowy rekord!') : tr('Nowe rekordy: {n}', { n: nPR }), [...prs.slice(0, 6).map(p => `${exName(p.exercise)}: ${p.details.join('; ')}`) /* runda 73: suma treningu i e1RM z wartościami */, prs.length > 6 ? '…' : ''].filter(Boolean).join('\n'), diff ? [{ text: tr('OK'), onPress: askTpl }] : undefined /* H5: pytanie o szablon po zamknięciu okna rekordów */), 400); else if (diff) setTimeout(askTpl, 400); }
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
    if (closingSet.current && tries < 10) { setTimeout(() => askStale(tries + 1), 300); return; }
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
      { text: tr('Odrzuć'), style: 'destructive' as const, onPress: () => { Alert.alert(tr('Odrzucić trening?'), tr('Serie z tej sesji przepadną.'), [{ text: tr('Wróć'), style: 'cancel', onPress: () => { done(); askStale(); } }, { text: tr('Odrzuć trening'), style: 'destructive', onPress: () => { done(); if (!same()) return; cancelWorkout(); timer.stop(); timer.stopSet(); timer.cancelStaleReminder().catch(() => {}); } }]); } }, /* T1: potwierdzenie — okno pojawia się niespodziewanie */
    ]);
  };
  useEffect(() => { askStale(); }, [fg, minute]); // eslint-disable-line react-hooks/exhaustive-deps
  const finish = () => {
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
    if (!done) { ask(tr('Brak odhaczonych serii'), [tr('Nic do zapisania. Odrzucić ten trening?'), pendingLine].filter(Boolean).join('\n'), [{ text: tr('Wróć'), style: 'cancel' }, { text: tr('Odrzuć trening'), style: 'destructive', onPress: () => { cancelWorkout(); timer.stop(); timer.stopSet(); } }]); return; }
    // Zawsze potwierdzenie + ostrzeżenia: wpisane, nieodhaczone serie; odhaczone serie bez powtórzeń.
    const zeroReps = w.exercises.reduce((a, e) => { const ex = exById(e.exerciseId); return a + (ex && hasReps(ex.metric ?? 'weight_reps') ? e.sets.filter(s => s.done && s.kind !== 'warmup' && !(Number(s.reps) > 0)).length : 0); }, 0);
    // Runda 52/53: odhaczone (i mierzona właśnie) serie bez czasu/dystansu; mierzona dostanie czas przy „Zakończ”, dystansu — nie.
    const zeroVal = w.exercises.reduce((a, e) => { const ex = exById(e.exerciseId); const m = ex?.metric ?? 'weight_reps'; return a + (ex && (hasTime(m) || hasDistance(m)) ? e.sets.filter(s => (s.done || s.id === runId) && s.kind !== 'warmup' && ((hasTime(m) && !(Number(s.durationSec) > 0) && s.id !== rset?.id) || (hasDistance(m) && !(Number(s.distanceM) > 0)))).length : 0); }, 0);
    // Runda 6: sama rozgrzewka — jasny komunikat i możliwość odrzucenia (pusta sesja psułaby „Powtórz ostatni”).
    if (!doneWork) { ask(tr('Tylko rozgrzewka'), [tr('Odhaczone są tylko serie rozgrzewkowe ({n}). Zapisać taki trening?', { n: done }), pendingLine].filter(Boolean).join('\n'), [{ text: tr('Wróć'), style: 'cancel' }, { text: tr('Odrzuć trening'), style: 'destructive', onPress: () => { cancelWorkout(); timer.stop(); timer.stopSet(); } }, { text: tr('Zapisz'), onPress: () => { go(); } }]); return; }
    /* weryfikacja 3 (L1): odhaczone serie robocze ćwiczeń z ciężarem (nie masa ciała) bez wpisanego ciężaru — ostrzeżenie jak przy powtórzeniach */
    const zeroW = w.exercises.reduce((a, e) => { const ex = exById(e.exerciseId); return a + (ex && !isBW(ex) && hasWeight(ex.metric ?? 'weight_reps') ? e.sets.filter(s => s.done && s.kind !== 'warmup' && (s.weight === '' || s.weight == null)).length : 0); }, 0);
    const msg = [tr('Zapisane zostaną serie robocze: {n}.', { n: doneWork }), pendingLine, zeroReps ? tr('Odhaczone serie bez powtórzeń: {n}.', { n: zeroReps }) : '', zeroW ? tr('Odhaczone serie bez ciężaru: {n}.', { n: zeroW }) : '', zeroVal ? tr('Odhaczone serie bez czasu lub dystansu: {n}.', { n: zeroVal }) : ''].filter(Boolean).join('\n');
    ask(tr('Zakończyć trening?'), msg, [{ text: tr('Wróć'), style: 'cancel' }, { text: tr('Zakończ'), onPress: () => { go(); } }]);
  };
  /* Audyt 0.10 (LIVE-12): blokada jak w „Zakończ” — dwa szybkie tapnięcia nie otwierają dwóch okien */
  const cancel = () => { if (finishing.current || asking.current) return; asking.current = true; const done = () => { asking.current = false; };
    Alert.alert(tr('Odrzucić trening?'), tr('Serie z tej sesji przepadną.'), [{ text: tr('Wróć'), style: 'cancel', onPress: done }, { text: tr('Odrzuć trening'), style: 'destructive', onPress: () => { done(); cancelWorkout(); timer.stop(); timer.stopSet(); } }]); };
  const once = useOnce(); /* audyt 0.10 (UI-08): przejścia z ekranu treningu bez podwójnego ekranu */
  /* Audyt 0.10 (LIVE-07, wariant A): dolny pasek przerwy w widoku skupionym, gdy przerwa w karcie jest poza ekranem (przewinięcie listy) */
  const restY = useRef<{ card: number | null; panel: number | null }>({ card: null, panel: null }); const scrollY = useRef(0); const [restOff, setRestOff] = useState(false);
  const checkRest = () => { const { card, panel } = restY.current; const off = card != null && panel != null && scrollY.current > card + panel; setRestOff(off); };

  if (!w) return null; // runda 48: druga instancja ekranu po zakończeniu treningu
  const labels = groupLabels(w.exercises);
  const prs = prMap(w);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView testID="workout-scroll" contentContainerStyle={{ paddingBottom: 170 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" automaticallyAdjustKeyboardInsets scrollEventThrottle={64} onScroll={ev => { scrollY.current = ev.nativeEvent.contentOffset.y; checkRest(); }}>
        <View style={s.head}>
          <View style={{ flex: 1 }}><Text accessibilityLanguage={lang()} accessibilityRole="header" style={{ color: t.text, fontSize: 24, fontFamily: F.heavy }}>{w.templateName || tr('Trening')}</Text><LocationChip w={w} /><SessionClock w={w} /><SessionProgress w={w} /></View>
          <Btn title={tr('Zakończ')} kind="primary" onPress={finish} />
        </View>
        <TemplateNote w={w} />
        {st.settings.workoutView !== 'list' ? <FocusCard w={w} onDone={onDone} onFinish={finish} onStartSet={startSet} onCardY={y => { restY.current.card = y; checkRest(); }} onRestY={y => { restY.current.panel = y; checkRest(); }} /> : null}
        {w.exercises.map((e, ei) => <ExerciseBlock key={e.id} w={w} e={e} ei={ei} onDone={onDone} onStartSet={startSet} labels={labels} prs={prs} />)}
        <View style={{ flexDirection: 'row', gap: 8 }}><Btn title={tr('+ Dodaj ćwiczenie')} style={{ flex: 1 }} onPress={once(() => router.push('/picker?target=active'))} />{w.exercises.length > 1 ? <Btn title={tr('≡ Kolejność')} accessibilityLabel={tr('Zmień kolejność ćwiczeń')} onPress={once(() => router.push('/reorder?target=active'))} /> : null}</View>
        <View style={{ marginTop: 16 }}><Muted style={{ marginBottom: 5 }}>{tr('Notatka do treningu')}</Muted><Input maxLength={1000} value={w.note} onChangeText={v => { w.note = v; save(w); }} placeholder={tr('np. samopoczucie, ból, sprzęt')} accessibilityLabel={tr('Notatka do treningu')} multiline /><MedicalNote /></View>
        <Btn title={tr('Zakończ trening i zapisz')} kind="primary" block style={{ marginTop: 10, minHeight: 52 }} onPress={finish} />
        <Muted style={{ textAlign: 'center', fontSize: 13, marginVertical: 10 }}>{tr('Trening w toku zapisuje się na bieżąco. Tapnij numer serii, by oznaczyć rozgrzewkę (W), drop set (D), serię do upadku (F) albo dodać notatkę.')} {tr('Przesuń serię albo nazwę ćwiczenia w lewo, by je usunąć.') /* UI-07 (audyt 0.10): opis gestu także w treningu */}</Muted>
        <Btn title={tr('Odrzuć trening')} kind="danger" block style={{ marginTop: 24 }} onPress={cancel} />
      </ScrollView>
      <TimerBar onFinishSet={() => finishTimedSet()} restInCard={st.settings.workoutView !== 'list' && !restOff} />
    </View>
  );
}

/** Podpis TRWAJĄCEJ przerwy liczony od nowa dla serii, która ją uruchomiła (lib/live.ts restLabel) — po zamianie (E2 pkt 3.8), „Pomiń dziś”
 * i każdej innej zmianie treningu (audyt 0.10, LIVE-03/04). Bez przerwy albo bez tej serii — nic. */
export function relabelRest() { const a = getState().active; const pos = timer.T.on ? findSet(timer.T.setId) : null; if (a && pos) { const r = restLabel(a, pos.ei, pos.si); timer.relabel(r.sub, r.last); } }
/** E2 (docs/14 pkt 3.8): po zamianie albo cofnięciu zamiany — stoper usuniętej serii stop (jak „usuń”), przerwa trwa (seria, która ją uruchomiła,
 * zostaje w bloku A), a jej podpis — także na Live Activity — liczony od nowa dla serii, która ją uruchomiła. */
export function afterSwap(goneSetIds: string[]) {
  if (timer.S.on && goneSetIds.includes(timer.S.setId ?? '')) timer.stopSet();
  if (timer.T.on && goneSetIds.includes(timer.T.setId ?? '')) timer.stop();
  relabelRest();
}
/** E2 (pkt 3.4): „↺ cofnij zamianę” — z potwierdzeniem, gdy w seriach zamiennika są wpisane wartości (C7). */
export function confirmUndoSwap(blockId: string, done?: () => void) {
  const e = getState().active?.exercises.find(x => x.id === blockId); if (!e) return;
  const go = () => { const r = undoSwap(blockId); if (r) afterSwap(r.goneSetIds); done?.(); };
  if (e.sets.some(x => x.edited)) Alert.alert(tr('Cofnąć zamianę?'), tr('Wpisane wartości zamiennika przepadną.'), [{ text: tr('Nie'), style: 'cancel' }, { text: tr('Cofnij'), style: 'destructive', onPress: go }]); else go();
}
/** E2 (pkt 3.2): „zamiast: A · ostatnio 3 serie 80×8” — ostatnia sesja A (previousFor), bez przeliczania. */
function insteadLine(e: WExercise): string {
  const A = e.swappedFrom ? exById(e.swappedFrom) : undefined; if (!A) return '';
  const p = previousFor(A.id); const xs = (p?.sets ?? []).map(x => setSummary(A, x)); const same = xs.length > 1 && xs.every(x => x === xs[0]);
  const last = !xs.length ? '' : same ? `${xs.length} ${tp(xs.length, 'seria|serie|serii')} ${xs[0]}` : xs.slice(0, 4).join(', ') + (xs.length > 4 ? '…' : '');
  return [tr('zamiast: {name}', { name: exName(A) }), last ? tr('ostatnio {s}', { s: last }) : ''].filter(Boolean).join(' · ');
}

/** P-003 E1: „📍 Dom ▾” pod nazwą treningu (tylko gdy są miejsca) — zmiana miejsca tylko dla tej sesji; nic nie jest przepisywane
 * ani zamieniane (A-002) — zmienia się filtr wyboru ćwiczeń, plakietki braku sprzętu i podpowiedzi. */
function LocationChip({ w }: { w: Workout }) {
  const t = useTheme(); const locs = getState().settings.locations; if (!locs.length) return null;
  const name = w.locationId ? locationLabel(w.locationId) : tr('bez miejsca');
  const pick = () => ActionSheetIOS.showActionSheetWithOptions({ options: [...locs.map(l => l.name), tr('Anuluj')], cancelButtonIndex: locs.length, title: tr('Miejsce tego treningu') }, i => {
    const l = locs[i]; const a = getState().active; if (!l || !a || a.id !== w.id) return; setActiveLocation(l.id); /* decyzja 8c: przyrządy bloków wg nowego miejsca */ });
  return <Pressable accessibilityLanguage={lang()} onPress={pick} accessibilityRole="button" accessibilityLabel={tr('Miejsce treningu: {l}', { l: name })} accessibilityHint={tr('Tapnij, by zmienić.')} /* A11-18 */ hitSlop={6} style={{ alignSelf: 'flex-start', paddingVertical: 4 }}>
    <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: t.accent, fontSize: 14, fontFamily: F.semibold }}>{`📍 ${name} ▾`}</Text></Pressable>;
}

/** Etykieta serii (lib/live.ts — wspólna z podpisem przerwy w timerze); eksport zostaje dla ekranów, które importują ją stąd. */
export { setLabel };

/** Czy nieodhaczona seria zawiera tylko wartości wstawione automatycznie (ciężar startowy / „Poprzednio”), a nie wpisane ręcznie. */
function isPrefill(_e: WExercise, s: WSet) { return !s.edited; } // runda 2: liczą się tylko pola wpisane ręcznie

/** Zegar sesji — odświeża tylko siebie co sekundę. */
function SessionClock({ w }: { w: Workout }) {
  const [, force] = useState(0);
  useEffect(() => { const i = setInterval(() => force(x => x + 1), 1000); return () => clearInterval(i); }, []);
  /* 08.10.2026 (decyzja właściciela): pauza zatrzymuje zegar treningu i odejmuje się od czasu trwania; przerwa i stoper serii liczą dalej,
   * odhaczenie serii wznawia trening (store.toggleDone). */
  const paused = isPaused(w);
  return <View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <Muted style={{ fontSize: 13 }}>{tr('start')} {fmtTime(wallTs(w))} · {fmtDur(workoutDurSec(w))}{paused ? ` · ${tr('pauza')}` : ''}</Muted>
      <Btn small kind={paused ? 'primary' : 'ghost'} title={paused ? tr('▶ Wznów') : tr('⏸ Pauza')} accessibilityLabel={paused ? tr('Wznów trening') : tr('Pauza treningu')} onPress={() => { if (paused) resumeWorkout(); else pauseWorkout(); force(x => x + 1); }} />
    </View>
    {paused ? <Muted style={{ fontSize: 12 }}>{tr('Zegar treningu stoi i pauza nie wlicza się do czasu trwania. Przerwa między seriami liczy dalej; odhaczenie serii wznawia trening.')}</Muted> : null}
  </View>;
}

/** Runda 75 (T-016): postęp sesji, cienki pasek pod zegarem. Audyt 0.10 (D3, fala 2): serie ROBOCZE jedną funkcją store.workCount / workSetCount —
 * bez rozgrzewek, drop set razem z serią przed nim (jak Postępy, karta szablonu i lista Historii); „Pomiń dziś” — liczą się tylko odhaczone serie bloku. */
function SessionProgress({ w }: { w: Workout }) {
  const t = useTheme(); let all = 0, done = 0; for (const e of w.exercises) { const sets = e.skipped ? e.sets.filter(x => x.done) : e.sets; all += workCount(sets.map(x => x.kind)); done += workSetCount(e.sets); }
  if (!all) return null; const pct = Math.min(100, Math.round(done / all * 100));
  return <View accessibilityLanguage={lang()} accessible accessibilityRole="progressbar" accessibilityLabel={tr('Postęp treningu: {d} z {n} serii', { d: done, n: all })} accessibilityValue={{ min: 0, max: all, now: done }} style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
    <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: t.line, overflow: 'hidden' }}><View style={{ width: `${pct}%`, height: 4, backgroundColor: t.accent }} /></View>
    <Muted style={{ fontSize: 12 }}>{done}/{all}</Muted>
  </View>;
}

/** Notatka szablonu w trakcie treningu (fala 2 audytu 0.10): np. linijka wysiłku z generatora („Wysiłek: zwykle 0–3 powtórzenia w zapasie…”) —
 * widoczna tam, gdzie się ją stosuje; zmienia się ją w szablonie („Edytuj”). */
function TemplateNote({ w }: { w: Workout }) {
  const t = useTheme(); const note = w.templateId ? getState().templates.find(x => x.id === w.templateId)?.note : undefined; if (!note) return null;
  return <View accessible accessibilityLabel={`${tr('Notatka szablonu')}: ${note}`} style={{ borderLeftWidth: 3, borderLeftColor: t.accent, paddingLeft: 10, marginBottom: 10 }}><Muted style={{ fontSize: 13, color: t.text }}>{note}</Muted></View>;
}

/** Gotowość z porannego wpisu w nagłówku sesji (0.2.1): „tracker wie, jak spałeś”. */

const WIDE = { idx: 28, w: 64, reps: 56, dist: 64, time: 56, play: 44, rpe: 46, band: 56, done: 44, gap: 6, prevMin: 70 };
/** Wariant zwarty dla wąskich ekranów (iPhone SE 1. gen., 320 pt) — gdy szerokie kolumny się nie mieszczą. */
const COMPACT = { idx: 24, w: 56, reps: 48, dist: 56, time: 50, play: 40, rpe: 40, band: 48, done: 44, gap: 4, prevMin: 70 };
type Cols = typeof WIDE;
const fixedWidth = (W: Cols, m: import('@/lib/seed').MetricType, band: boolean, showRpe: boolean) => {
  const fixed = [W.idx, hasWeight(m) && W.w, hasReps(m) && W.reps, hasDistance(m) && W.dist, hasTime(m) && W.time, hasTime(m) && W.play, showRpe && W.rpe, band && W.band, W.done].filter(Boolean) as number[];
  return fixed.reduce((a, b) => a + b, 0) + W.gap * fixed.length;
};
/** Układ wiersza serii: kolumny (szerokie albo zwarte), ich łączna szerokość i czy „Poprzednio” mieści się w wierszu. */
export function rowLayout(m: import('@/lib/seed').MetricType, band: boolean, showRpe: boolean, width: number) {
  const avail = width - 28; const wide = fixedWidth(WIDE, m, band, showRpe);
  const W = wide <= avail ? WIDE : COMPACT; const fixedW = W === WIDE ? wide : fixedWidth(COMPACT, m, band, showRpe);
  return { W, fixedW, avail, prevInline: avail - fixedW >= W.prevMin };
}

function ExerciseBlock({ w, e, ei, onDone, onStartSet, labels, prs }: { w: Workout; e: WExercise; ei: number; onDone: (ei: number, si: number) => void; onStartSet: (setId: string, target: number, subtitle: string, remeasure?: boolean) => void; labels: Record<string, string>; prs: Map<string, string[]> }) {
  const t = useTheme(); const st = getState(); const { width } = useWindowDimensions(); const router = useRouter(); const once = useOnce(); /* audyt 0.10 (UI-08): „⇄ zamień” */
  const ex = exById(e.exerciseId);
  const k = occurrence(w.exercises, ei); const nOcc = occurrences(w.exercises, e.exerciseId); const prev = ex ? prevOfActiveBlock(w, e) : null; /* decyzja 8c: ostatni raz tym samym przyrządem; E2 pkt 3.6: zamiennik — najpierw z tej pozycji szablonu */ /* runda 50: bez useMemo — zależy też od szablonu (edycja w trakcie); ta sama podpowiedź co przy odhaczeniu */ // eslint-disable-line react-hooks/exhaustive-deps
  if (!ex) {
    // Ćwiczenie usunięte na stałe w trakcie treningu — pokazujemy blok, żeby dało się go usunąć (wcześniej znikał niewidoczny).
    const dropGone = () => { const i = getState().active?.exercises.findIndex(x => x.id === e.id) ?? -1; if (i >= 0) { const ids = e.sets.map(x => x.id); if (timer.S.on && ids.includes(timer.S.setId ?? '')) timer.stopSet(); if (timer.T.on && ids.includes(timer.T.setId ?? '')) timer.stop(); removeExercise(i); } }; /* runda 43: timery tego bloku stop */
    /* 07.10.2026 wieczór: usuwanie przesunięciem w lewo (components/SwipeRow.tsx), bez przycisku */
    return <SwipeRow label={tr('Usuń usunięte ćwiczenie z treningu')} title={tr('Usunąć z treningu?')} message={tr('Usunięte ćwiczenie')} onDelete={dropGone} style={[s.ex, { borderBottomColor: t.line }]}>{a11y => <Text accessibilityLanguage={lang()} {...a11y} accessible maxFontSizeMultiplier={1.3} style={{ color: t.muted, fontFamily: F.regular, fontSize: 14 }}>{tr('Usunięte ćwiczenie')} · {e.sets.length} {tp(e.sets.length, 'seria|serie|serii')}</Text>}</SwipeRow>;
  }
  const bw = isBW(ex); const band = usesBand(ex); /* 06.10.2026: także opór gumy */
  /* P-003 E1: plakietka „brak sprzętu w: Dom” (nigdy automatyczna zamiana) i dopisek, gdy „Poprzednio” pochodzi z innego, znanego miejsca (8c: źródłem bywa każde miejsce) */
  const place = locationById(w.locationId); const avail = place ? availability(ex, place) : null;
  const prevElsewhere = place && prev?.workout.locationId && prev.workout.locationId !== place.id ? locationLabel(prev.workout.locationId) : '';
  /* weryfikacja 3 (L1): poprzedni ciężar, którego tu nie ma — dopisek przy ćwiczeniu. Audyt f132330/025ee6a (MEDIUM 1): także gdy „Poprzednio” jest
   * z sesji bez miejsca (0.8.5 / web 0.3 — wartość wstawiona do pól) albo innym przyrządem (LOW 3 — pole puste). Runda 82b (weryfikacja 6ea37a3):
   * jedna reguła z edytorem historii (store.offListNote) — tylko źródło „gdzie indziej” albo bez miejsca, tylko wartość serii roboczej (bez drop
   * setów, > 0) spoza listy (wg jednostki), liczone z BIEŻĄCYCH pól: wpisany ciężar chowa dopisek; blok innym przyrządem niż tutaj — bez dopisku.
   * Prefiks „Poprzednio: ‹miejsce›” nadal tylko dla innego, OKREŚLONEGO miejsca (audyt M8 — bez „Poprzednio: bez miejsca”) */
  const prevOff = offListNote(e, prev, w.locationId, si => srcSetAt(prev?.sets, si)); /* runda 82c (LOW 1): seria źródła jak przy wstawianiu wartości (srcSetAt: i-ta, dalej ostatnia) — nie hintFor, który za końcem „Poprzednio” nic nie daje */
  const offNote = prevOff != null ? tr('ciężaru {w} nie ma tutaj — wpisz ciężar', { w: fmtW(prevOff) }) : '';
  const impl = liveBlockImpl(e, w.locationId); /* MEDIUM 2: stacja — kolumna „kg/str.” (na stronę); runda 82b (LOW 4): bez miejsc — jak w main */
  const nm = nOcc > 1 ? `${exName(ex)} (${k + 1})` : exName(ex); /* runda 66: dwa bloki tego samego ćwiczenia rozróżnialne dla VoiceOver */
  const dropBlockTimers = () => { const ids = e.sets.map(x => x.id); if (timer.S.on && ids.includes(timer.S.setId ?? '')) timer.stopSet(); if (timer.T.on && ids.includes(timer.T.setId ?? '')) timer.stop(); };
  /* Audyt 0.10 (LIVE-11): okno usuwania mówi, ile odhaczonych serii przepadnie (jak „Seria jest już odhaczona.” przy serii) */
  const nDone = e.sets.filter(x => x.done).length; const delMsg = [nm, nDone ? tr('Odhaczone serie: {n} — przepadną.', { n: nDone }) : ''].filter(Boolean).join('\n');
  /* Audyt 0.10 (LIVE-03): „Pomiń dziś” zatrzymuje tylko stoper serii tego bloku (z pytaniem, bo pomiar przepada); przerwa po odhaczonej serii trwa,
   * a jej podpis liczy się od nowa (relabelRest — następna seria jak na karcie). */
  const skipToday = () => {
    const go = () => { if (timer.S.on && e.sets.some(x => x.id === timer.S.setId)) timer.stopSet(); skipExercise(e.id); relabelRest(); };
    if (timer.S.on && e.sets.some(x => x.id === timer.S.setId)) Alert.alert(tr('Trwa pomiar serii'), tr('Pominięcie ćwiczenia przerwie pomiar — ten czas się nie zapisze.'), [{ text: tr('Wróć'), style: 'cancel' }, { text: tr('Pomiń dziś'), style: 'destructive', onPress: go }]);
    else go();
  };
  const removeBlock = () => { const i = getState().active?.exercises.findIndex(x => x.id === e.id) ?? -1; if (i < 0) return; /* runda 10: po id — drugie okno nie usuwa sąsiada */ dropBlockTimers(); removeExercise(i); };
  /* „Pomiń dziś” (docs/21 4a, 07.10.2026 wieczór): blok zwinięty do jednej linii; szablon bez zmian; odhaczone serie zapiszą się jak zawsze */
  if (e.skipped) return (
    <View style={[s.ex, { borderBottomColor: t.line }]}>
      <SwipeRow label={tr('Usuń ćwiczenie: {name}', { name: nm })} title={tr('Usunąć z treningu?')} message={delMsg} onDelete={removeBlock}>{a11y => <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text accessibilityLanguage={lang()} {...a11y} accessibilityRole="header" maxFontSizeMultiplier={1.3} style={{ color: t.muted, fontSize: 17, fontFamily: F.semibold, flexShrink: 1 }}>{exName(ex)}</Text>
        <Muted style={{ fontSize: 13, flexGrow: 1 }}>{tr('pominięte dziś')}</Muted>
        <Btn title={tr('Przywróć')} small kind="ghost" accessibilityLabel={tr('Przywróć ćwiczenie: {name}', { name: nm })} onPress={() => unskipExercise(e.id)} />
      </View>}</SwipeRow>
    </View>);
  const m = ex.metric ?? 'weight_reps'; const showRpe = st.settings.showRpe;
  /* E2 W1: „⇄ zamień” — ukryty, gdy wszystkie serie odhaczone (D3 a); arkusz app/swap.tsx */
  const swappable = e.sets.some(x => !x.done); const openSwap = once(() => router.push(`/swap?target=active:${e.id}`)); const insteadTxt = insteadLine(e);
  /* E2 W3: „Zawsze w: <Miejsce>” (P1 a, P5a a) i podpowiedź zamiennika per miejsce — liczone przy renderze (pkt 4.2) */
  const remember = canRememberAlt(w, e); const hint = altHint(w, e); const hintEx = hint ? exById(hint.exerciseId) : undefined;
  const hintName = hintEx ? exName(hintEx) + (hint?.impl ? ` — ${implLabel(hint.impl)}` : '') : '';
  const doneStyle = (set: WSet) => set.done ? { backgroundColor: t.done, borderColor: t.doneLine } : undefined;
  const inSS = !!e.groupId;
  const prog = progressionFor(ex, e.repMax, prev?.sets, listLocFor(e, w.locationId), pinnedImpl(e)); /* E2 D5: przypięty przyrząd */ /* T-017: cicha podpowiedź progresji; P-003: z ciężarów miejsca; runda 82b (LOW 5): blok innym przyrządem niż tutaj — bez listy miejsca */
  /* Audyt 0.10 (D1 / MER-05): w tygodniu deload bez „↑ spróbuj” — ciężary bez zmian (Rogerson 2024, Travis 2020: intensywność utrzymana albo niższa) */
  const progText = prog && !isDeloadWeek(wallTs(w)) ? (prog.kind === 'reps' ? tr('↑ spróbuj {n} pow.', { n: prog.reps }) : (bw && prog.kg === 0 ? tr('↑ spróbuj bez asysty') : tr('↑ spróbuj {v}', { v: (bw && prog.kg > 0 ? '+' : '') + fmtW(prog.kg) }))) : '';
  const headMeta = [e.implPinned && e.impl ? implLabel(e.impl) /* E2 D5: przyrząd wybrany ręcznie */ : '', hasReps(m) && e.repMin != null ? reps(e.repMin, e.repMax) + ' ' + tr('pow.') : '', progText, inSS ? tr('superset · przerwa po rundzie {t}', { t: fmtDur(roundRest(ei) ?? e.restSec) }) /* T7: przerwa po zamknięciu rundy, niezależnie od kolejności odhaczania */ : tr('przerwa') + ' ' + fmtDur(e.restSec), ex.tempo].filter(Boolean).join(' · ');
  // Szerokość: czy kolumna „Poprzednio” zmieści się w wierszu (ekran − marginesy 2×14).
  const { prevInline, W } = rowLayout(m, band, showRpe, width);
  // „Poprzednio” po numerze serii roboczej: rozgrzewki w tym treningu nie przesuwają podpowiedzi.
  const prevFor = (si: number) => hintFor(prev?.sets, e.sets, si, ex ?? undefined); // runda 9: w ramach rodziny serii (drop ↔ drop)
  const dropTimers = (ids: string[]) => { if (timer.S.on && ids.includes(timer.S.setId ?? '')) timer.stopSet(); if (timer.T.on && ids.includes(timer.T.setId ?? '')) timer.stop(); };
  const rememberRest = (n: number) => storeRememberRest(w, e, n); /* runda 10: tylko pozycja szablonu, z której powstał blok; blok dodany w trakcie zmienia tylko ćwiczenie; E2 W3: blok-zamiennik — przerwa wpisu zamiennika */
  /* UI-16 (audyt 0.10): odrzucony wpis nie znika po cichu */
  const badRest = () => Alert.alert(tr('Nie zmieniono przerwy'), tr('Wpisz liczbę sekund od 0 do {n}.', { n: REST_MAX }));
  const parseRest = (v?: string) => { const x = (v ?? '').trim(); if (!x) return null; const n = Math.round(Number(x.replace(',', '.'))); return n >= 0 && isFinite(n) ? Math.min(REST_MAX, n) : null; }; // runda 11: ten sam limit co w edycji ćwiczenia i szablonu
  const setMenu = (set: WSet, si: number) => {
    /* 07.10.2026 wieczór: usuwanie serii — przesunięciem wiersza w lewo (deleteSet), nie z menu */
    const labels = [tr('Seria normalna'), tr('Rozgrzewka (W)'), tr('Drop set (D)'), tr('Do upadku (F)'), set.note ? tr('Edytuj notatkę') : tr('Dodaj notatkę'), tr('Anuluj')];
    const kinds = ['normal', 'warmup', 'drop', 'failure'] as const;
    ActionSheetIOS.showActionSheetWithOptions({ options: labels, cancelButtonIndex: labels.length - 1, title: tr('Seria {n}', { n: setLabel(e, si) }) }, i => {
      if (i < 4) { set.kind = kinds[i]; set.warmup = set.kind === 'warmup'; save(st.active); }
      else if (i === 4) Alert.prompt?.(tr('Notatka do serii'), undefined, [{ text: tr('Anuluj'), style: 'cancel' }, { text: tr('Zapisz'), onPress: (v?: string) => { set.note = clampName((v ?? '').trim(), 300); /* runda 49: limit notatki */ save(st.active); } }], 'plain-text', set.note);
    });
  };
  /* 07.10.2026 wieczór (docs/18): usuwanie serii przesunięciem w lewo, zawsze z potwierdzeniem; ostatniej serii bloku się nie usuwa (jak wcześniej) */
  const deleteSet = (id: string) => { const cur = getState().active?.exercises.find(x => x.id === e.id); if (!cur || cur.sets.length <= 1 || !cur.sets.some(x => x.id === id)) return; dropTimers([id]); removeSetById(getState().active!.exercises.indexOf(cur), id); };
  return (
    <View style={[s.ex, { borderBottomColor: t.line }]}>
      <SwipeRow label={tr('Usuń ćwiczenie: {name}', { name: nm })} title={tr('Usunąć z treningu?')} message={delMsg} onDelete={removeBlock}>{a11y => <View style={s.exHead}>
        <Text accessibilityLanguage={lang()} {...a11y} accessibilityRole="header" style={{ color: t.text, fontSize: 17, fontFamily: F.semibold, flexGrow: 1, flexShrink: 1, minWidth: '58%' }}>{inSS ? <Text accessibilityLanguage={lang()} style={{ color: t.band }}>{`SS ${labels[e.groupId!]} · `}</Text> : null}{exName(ex)}{ex.archived ? <Text accessibilityLanguage={lang()} style={{ color: t.muted, fontSize: 13 }}>{' (' + tr('usunięte') + ')'}</Text> : null}</Text>
        <Muted numberOfLines={2} style={{ fontSize: 13, flexShrink: 1, flexGrow: 1, textAlign: 'right' }}>{headMeta}</Muted>
      </View>}</SwipeRow>
      {insteadTxt || remember ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: -2, marginBottom: 6 }}><Muted style={{ fontSize: 12, flexShrink: 1 }}>{insteadTxt || (e.impl ? tr('przyrząd: {impl}', { impl: implLabel(e.impl) }) : '')}</Muted>{canUndoSwap(e) ? <Btn title={tr('↺ cofnij')} small kind="ghost" accessibilityLabel={tr('Cofnij zamianę: {name}', { name: nm })} onPress={() => confirmUndoSwap(e.id)} /> : null}{remember && place ? <Btn title={tr('Zawsze w: {l}', { l: place.name })} small kind="ghost" accessibilityLabel={tr('Zawsze w: {l} — {name}', { l: place.name, name: nm })} accessibilityHint={tr('Zapisuje zamiennik w szablonie dla tego miejsca.')} onPress={() => rememberAlt(e.id)} /> : null}</View> : null}
      {hint && place ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: -2, marginBottom: 6 }}><Muted style={{ fontSize: 12, flexShrink: 1 }}>{tr('Zwykle w: {l} — {name}. Zamienić?', { l: place.name, name: hintName })}</Muted><Btn title={tr('Zamień')} small accessibilityLabel={tr('Zamień na zamiennik: {name}', { name: hintName })} onPress={() => { const r = acceptAlt(e.id); if (r) afterSwap(r.goneSetIds); }} /><Btn title="✕" small kind="ghost" accessibilityLabel={tr('Nie zamieniaj: {name}', { name: hintName })} onPress={() => skipAlt(e.id)} /></View> : null}
      {place && avail && !avail.ok ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -2, marginBottom: 6 }}><Muted style={{ fontSize: 12, color: t.danger, flexShrink: 1 }} accessibilityLabel={tr('Brak sprzętu w: {l}. Brakuje: {m}', { l: place.name, m: missingLabel(avail.missing) })}>{tr('brak sprzętu w: {l}', { l: place.name })} ({missingLabel(avail.missing)})</Muted>{swappable ? <Btn title="⇄" small kind="ghost" accessibilityLabel={tr('Zamień ćwiczenie (brak sprzętu): {name}', { name: nm })} onPress={openSwap} /> : null}</View> : null}
      {prevElsewhere || offNote ? <Muted style={{ fontSize: 12, marginTop: -2, marginBottom: 6 }}>{[prevElsewhere ? tr('Poprzednio: {l}', { l: prevElsewhere }) : '', offNote].filter(Boolean).join(' · ')}</Muted> : null}
      <View style={[s.row, { gap: W.gap }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" /* A11-18: nagłówki kolumn „#”, „✓”, „▶” — szum dla VoiceOver; każde pole ma własną etykietę (jak w historii) */>
        <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} style={[s.c, { width: W.idx, textAlign: 'left' }]}>#</Muted>
        {prevInline ? <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} numberOfLines={1} style={[s.c, { flex: 1, textAlign: 'left' }]}>{tr('Poprzednio')}</Muted> : <View style={{ flex: 1 }} />}
        {hasWeight(m) ? <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} numberOfLines={1} style={[s.c, { width: W.w }]}>{loadLabelShort(ex, impl)}</Muted> : null}
        {hasReps(m) ? <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} style={[s.c, { width: W.reps }]}>{tr('Pow.')}</Muted> : null}
        {hasDistance(m) ? <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} style={[s.c, { width: W.dist }]}>m</Muted> : null}
        {hasTime(m) ? <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} style={[s.c, { width: W.time }]}>{tr('sek.')}</Muted> : null}
        {hasTime(m) ? <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} style={[s.c, { width: W.play }]}>▶</Muted> : null}
        {showRpe ? <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} style={[s.c, { width: W.rpe }]}>{effortLabel()}</Muted> : null}
        {band ? <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} style={[s.c, { width: W.band }]}>{tr('Guma')}</Muted> : null}
        <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} style={[s.c, { width: W.done }]}>✓</Muted>
      </View>
      {e.sets.map((set, si) => {
        const p = prevFor(si); const tick = () => { set.edited = true; save(st.active); }; const lbl = setLabel(e, si); const hint = tr('Seria {n} — {ex}', { n: lbl, ex: nm }); // runda 6: VoiceOver mówi, której serii dotyczy pole
        const running = timer.S.on && timer.S.setId === set.id;
        const pr = prs.get(set.id); const kind = set.kind ?? 'normal';
        const prevTxt = p ? setSummary(ex, p, 'calc') : '—'; /* audyt 83b (MEDIUM 1b): ciężar jak wpisze podpowiedź — tylko pole obecnego sprzętu */
        return (
          <SwipeRow key={set.id} testID={`set-${ei}-${si}`} /* E2E 12 */ disabled={e.sets.length <= 1} blocked={lastSetBlock()} label={tr('Usuń serię {n} — {ex}', { n: lbl, ex: nm })} title={tr('Usunąć serię?')} message={set.done ? tr('Seria jest już odhaczona.') : undefined} onDelete={() => deleteSet(set.id)}>{a11y => <View>
            <View style={[s.row, { gap: W.gap }]}>
              <Pressable accessibilityLanguage={lang()} {...a11y} onPress={() => setMenu(set, si)} hitSlop={8} accessibilityHint={`${hint}. ${tr('Tapnij, by zmienić typ lub dodać notatkę.')}`} /* runda 63; A11-18: instrukcja w podpowiedzi */ accessibilityRole="button" accessibilityLabel={tr('Seria {n}, typ: {k}', { n: lbl, k: tr(SET_KIND_LABEL[kind]) })} style={{ width: W.idx, minHeight: 44, justifyContent: 'center' }}>
                <SetBadge kind={kind} label={lbl} note={!!set.note} />
              </Pressable>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 }}>{prevInline ? <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} numberOfLines={1} style={{ flexShrink: 1, color: t.muted, fontSize: 13, fontFamily: F.regular /* audyt 0.10 (LIVE-13 / UI-11) */ }}>{prevTxt}</Text> : null}{pr ? <Text accessibilityLanguage={lang()} accessibilityLabel={tr('Rekord: {list}', { list: pr.map(k => tr(k)).join(', ') })} /* A11-18: VoiceOver czyta, jaki rekord, nie „P R” */ maxFontSizeMultiplier={1.3} style={{ color: t.band, fontSize: 11, fontFamily: F.semibold }}>PR</Text> : null}</View>
              {hasWeight(m) ? <View style={{ width: W.w }}><NumInput weightTol decimal allowNegative={bw} value={wField(bw ? set.addKg : set.weight)} stored={bw ? set.addKg : set.weight} onNum={(v, keep) => { writeLoad(ex, set, wInKeep(v, keep)); /* runda 54: ciężar nieujemny; Q-021: ta sama liczba co na ekranie = te same kg; 83b: jeden zapis (store.writeLoad) */ tick(); }} placeholder={bw ? '±0' : wu()} style={doneStyle(set)} accessibilityLabel={loadLabel(ex, impl)} accessibilityHint={hint} testID={`w-${ei}-${si}`} /* E2E 11 */ /></View> : null}
              {hasReps(m) ? <View style={{ width: W.reps }}><NumInput value={set.reps} onNum={v => { set.reps = v === '' ? '' : Math.min(REPS_MAX, Math.max(0, Math.floor(v))); tick(); /* UI-16 */ }} placeholder={reps(e.repMin, e.repMax)} style={doneStyle(set)} accessibilityLabel={tr('Powtórzenia')} accessibilityHint={hint} testID={`r-${ei}-${si}`} /></View> : null}
              {hasDistance(m) ? <View style={{ width: W.dist }}><NumInput value={set.distanceM} onNum={v => { set.distanceM = v === '' ? '' : Math.max(0, Math.round(v)); /* runda 55/56: pełne metry jak klawiatura */ tick(); }} placeholder="m" style={doneStyle(set)} accessibilityLabel={tr('dystans')} accessibilityHint={hint} /></View> : null}
              {hasTime(m) ? <View style={{ width: W.time }}><NumInput value={set.durationSec} onNum={v => { set.durationSec = v === '' ? '' : Math.min(86400, Math.max(0, Math.round(v))); /* runda 56: pełne sekundy jak klawiatura */ tick(); }} placeholder="s" style={doneStyle(set)} accessibilityLabel={tr('czas')} accessibilityHint={hint} /></View> : null}
              {hasTime(m) ? (
                <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={running ? tr('Stoper trwa') : tr('Start stopera serii')} accessibilityHint={hint} onPress={() => { if (!running) startTimed(w, e, set, si, onStartSet); }} style={[s.doneBtn, { width: W.play, backgroundColor: running ? t.accent : t.surface2, borderColor: running ? t.accent : t.line }]}>
                  <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: running ? t.accentInk : t.text, fontSize: 16 }}>{running ? '…' : '▶'}</Text>
                </Pressable>) : null}
              {showRpe ? <View style={{ width: W.rpe }}><NumInput decimal value={effortField(set.rpe)} onNum={v => { set.rpe = effortIn(v); tick(); }} placeholder="—" style={doneStyle(set)} accessibilityLabel={effortLabel()} accessibilityHint={hint} /></View> : null}
              {band ? <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityHint={`${hint}. ${tr('Tapnij, by zmienić.')}`} /* A11-18 */ accessibilityLabel={tr('Guma: {b}', { b: set.bandId ? bandA11y(st.bands.find(b => b.id === set.bandId)) : tr('brak') })} onPress={() => cycleBand(set, bw && hasWeight(m))} style={[s.bandBtn, { width: W.band, backgroundColor: t.surface2, borderColor: set.done ? t.doneLine : t.line }]}><Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: set.bandId ? t.band : t.muted, fontSize: 13, fontFamily: F.semibold }}>{set.bandId ? shortBand(st.bands.find(b => b.id === set.bandId)) : '—'}</Text></Pressable> : null}
              <Pressable accessibilityLanguage={lang()} accessibilityRole="checkbox" accessibilityState={{ checked: set.done }} accessibilityLabel={tr('Seria {n} zrobiona — {ex}', { n: lbl, ex: nm })} onPress={() => onDone(ei, si)} style={[s.doneBtn, { width: W.done, backgroundColor: set.done ? t.accent : t.surface2, borderColor: set.done ? t.accent : t.ctrlLine /* A11-06 */ }]}><Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: set.done ? t.accentInk : t.muted, fontSize: 18 }}>{set.done ? '✓' : ''}</Text></Pressable>
            </View>
            {!prevInline && p ? <Muted numberOfLines={1} style={{ fontSize: 12, marginLeft: W.idx + W.gap, marginTop: -4, marginBottom: 6 }}>{tr('Poprzednio')}: {prevTxt}</Muted> : null}
            {set.note ? <Muted style={{ fontSize: 12, marginLeft: W.idx + W.gap, marginTop: -4, marginBottom: 6 }}>{set.note}</Muted> : null}
          </View>}</SwipeRow>
        );
      })}
      <View style={s.actions}>
        <Btn title={tr('+ seria')} small accessibilityHint={nm} onPress={() => addSet(ei)} /><Btn title={tr('+ rozgrzewka')} small kind="ghost" accessibilityHint={nm} onPress={() => addSet(ei, 'warmup')} /><Btn title={tr('+ drop set')} small kind="ghost" accessibilityHint={nm} onPress={() => addSet(ei, 'drop')} />
        <Btn title={`⏱ ${fmtDur(e.restSec)}`} small accessibilityHint={`${nm}. ${tr('Tapnij, by zmienić.')}`} /* A11-18 */ accessibilityLabel={tr('Przerwa: {s}', { s: fmtDur(e.restSec) })} onPress={() => { Alert.prompt?.(tr('Przerwa (sekundy)'), tr('Zapamiętać dla tego ćwiczenia?'), [{ text: tr('Anuluj'), style: 'cancel' }, { text: tr('Tylko teraz'), onPress: (v?: string) => { const n = parseRest(v); if (n != null) { e.restSec = n; save(st.active); } else badRest(); } }, { text: tr('Zapamiętaj'), onPress: (v?: string) => { const n = parseRest(v); if (n != null) rememberRest(n); else badRest(); } }], 'plain-text', String(e.restSec), 'number-pad'); }} />
        {ei + 1 < w.exercises.length && (!inSS || w.exercises[ei + 1].groupId !== e.groupId) ? <Btn title="⇅ SS" small kind="ghost" accessibilityLabel={tr('Połącz z następnym w superset')} accessibilityHint={nm} onPress={() => linkWithNext(w.exercises, ei, w)} /> : null}
        {inSS ? <Btn title="✂ SS" small kind="ghost" accessibilityLabel={tr('Wyjmij z supersetu')} accessibilityHint={nm} onPress={() => unlink(w.exercises, ei, w)} /> : null}
        {swappable ? <Btn title={tr('⇄ zamień')} small kind="ghost" accessibilityLabel={tr('Zamień ćwiczenie: {name}', { name: nm })} onPress={openSwap} /> : null}
        {e.sets.some(x => !x.done) ? <Btn title={tr('Pomiń dziś')} small kind="ghost" accessibilityLabel={tr('Pomiń dziś: {name}', { name: nm })} onPress={skipToday} /> : null}
      </View>
    </View>
  );
}

/** Start stopera serii na czas (▶ w wierszu i „▶ Start” na karcie — audyt 0.10, LIVE-06): cel z pola serii albo z szablonu; ponowny pomiar odhaczonej
 * serii — z pytaniem, cel z szablonu albo bez limitu (runda 18/22). */
function startTimed(w: Workout, e: WExercise, set: WSet, si: number, onStartSet: (setId: string, target: number, subtitle: string, remeasure?: boolean) => void) {
  const tpl = w.templateId ? getState().templates.find(x => x.id === w.templateId) : null; const it = tpl && e.tplItemId ? tpl.items.find(x => x.id === e.tplItemId) : null;
  const tplTarget = Number(it?.targetSec) || 0; /* runda 18: ponowny pomiar liczy od nowa — cel z szablonu albo bez limitu, nie stary wynik */
  const ei = w.exercises.indexOf(e); const nm = occurrences(w.exercises, e.exerciseId) > 1 ? `${exName(exById(e.exerciseId))} (${occurrence(w.exercises, ei) + 1})` : exName(exById(e.exerciseId));
  const go = () => onStartSet(set.id, set.done ? tplTarget : Number(set.durationSec) || tplTarget /* runda 22: pusty czas → cel z szablonu */, `${nm} · ${tr('seria {n}', { n: setLabel(e, si) })}`, set.done);
  if (set.done) Alert.alert(tr('Zmierzyć serię od nowa?'), tr('Zapisany czas zostanie nadpisany.'), [{ text: tr('Nie'), style: 'cancel' }, { text: tr('Zmierz'), onPress: go }]); else go();
}
/**
 * Widok skupiony (styl „Tuleja”, decyzja właściciela 07.10.2026; docs/21 pkt 3): karta serii „teraz” (store.focusSet) nad listą — ćwiczenie,
 * numer serii, notatka ćwiczenia, ciężar × powtórzenia dużymi cyframi, „ostatnio …”, grafika sprzętu (lib/equipvis.ts: talerze, stos, hantle, kettle,
 * stacja, guma, dociążenie; 07.10.2026), pierścień serii na czas, przerwa w karcie z podglądem następnej serii („dalej: …”) i jeden duży przycisk, który działa jak ✓ w wierszu tej serii
 * (ta sama funkcja onDone — przerwa, stoper, Live Activity bez zmian), z własną etykietą VoiceOver (dwa przyciski o tej samej nazwie na jednym
 * ekranie — tests/matrix-a11y). Podpowiedź „↑” zostaje w nagłówku ćwiczenia (jedno miejsce). Wartości zmienia się w wierszu serii niżej.
 * Wszystko odhaczone — „Zakończ trening”. Wyłączenie: Ustawienia → Widok treningu → Lista.
 */
function FocusCard({ w, onDone, onFinish, onStartSet, onCardY, onRestY }: { w: Workout; onDone: (ei: number, si: number) => void; onFinish: () => void; onStartSet: (setId: string, target: number, subtitle: string, remeasure?: boolean) => void; onCardY?: (y: number) => void; onRestY?: (y: number) => void }) {
  const t = useTheme(); const pos = focusSet(w);
  /* wariant A (07.10.2026, E2E run 37611882320): miejsce na grafikę nie maleje w obrębie serii — wiersz pod kartą nie skacze pod klawiaturę */
  const [slot, setSlot] = useState({ key: '', h: 0 });
  const cardLayout = (ev: { nativeEvent: { layout: { y: number } } }) => onCardY?.(ev.nativeEvent.layout.y);
  const restPanel = <View testID="focus-rest" onLayout={ev => onRestY?.(ev.nativeEvent.layout.y + ev.nativeEvent.layout.height)} style={[s.focusRest, { borderColor: t.accent }]}><RestPanel big={34} /></View>;
  if (!pos) {
    if (!w.exercises.some(e => e.sets.length)) return null;
    /* Audyt 0.10 (LIVE-08): „Wszystkie serie odhaczone” tylko, gdy naprawdę wszystkie; reszta pominięta — inny tekst; nic nie odhaczono — jeszcze inny */
    const all = w.exercises.every(e => e.sets.every(x => x.done)); const any = w.exercises.some(e => e.sets.some(x => x.done));
    return (
      <View testID="focus-card" onLayout={cardLayout} style={[s.focus, { backgroundColor: t.surface, borderColor: t.text }]}>
        {timer.T.on ? restPanel : null}
        <Text accessibilityLanguage={lang()} accessibilityRole="header" maxFontSizeMultiplier={1.3} style={{ color: t.text, fontSize: 20, fontFamily: F.heavy }}>{all ? tr('Wszystkie serie odhaczone') : any ? tr('Nic więcej do zrobienia (część pominięta)') : tr('Nic nie odhaczono — wszystkie ćwiczenia pominięte')}</Text>
        <Pressable accessibilityLanguage={lang()} accessibilityRole="button" onPress={onFinish} style={[s.focusBtn, { backgroundColor: t.text }]}><Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: t.bg, fontSize: 19, fontFamily: F.heavy }}>{tr('Zakończ trening')}</Text></Pressable>
      </View>);
  }
  const e = w.exercises[pos.ei]; const ex = exById(e.exerciseId)!; const set = e.sets[pos.si]; const m = ex.metric ?? 'weight_reps'; const lbl = setLabel(e, pos.si);
  const prev = prevOfActiveBlock(w, e); const p = hintFor(prev?.sets, e.sets, pos.si, ex);
  const vis = equipVisFor(w, e, set); const ghost = vis.some(v => v.kind !== 'noplates') ? [] : equipSlotFor(w, e, set); const minH = slot.key === set.id ? slot.h : 0; const resting = timer.T.on;
  /* Audyt 0.10 (UI-10 / LIVE-14, wariant A): „80 kg × 8” — jednostka przy ciężarze, ta sama treść dla VoiceOver; licznik bez drop setów */
  const big = nowParts(ex, set); const bigTxt = `${big.num}${big.unit ? ' ' + big.unit : ''}${big.tail}`; const cnt = focusCounter(e, pos.si);
  const counter = cnt.kind === 'warmup' ? tr('rozgrzewka') : cnt.kind === 'drop' ? tr('seria {n} z {all} · drop set', { n: cnt.n, all: cnt.all }) : tr('seria {n} z {all}', { n: cnt.n, all: cnt.all });
  const name = exName(ex); const ss = e.groupId ? `SS ${groupLabels(w.exercises)[e.groupId]} · ` : '';
  /* Audyt 0.10 (LIVE-06, wariant A): seria na czas bez trwającego pomiaru — duży „▶ Start”, pod nim mały „Odhacz bez pomiaru” (czas z pola serii) */
  const timedIdle = hasTime(m) && !(timer.S.on && timer.S.setId === set.id);
  return (
    <View testID="focus-card" onLayout={cardLayout} style={[s.focus, { backgroundColor: t.surface, borderColor: t.text }]}>
      {resting ? restPanel : null}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <Text accessibilityLanguage={lang()} accessibilityRole="header" maxFontSizeMultiplier={1.3} style={{ color: t.text, fontSize: 20, fontFamily: F.heavy, flexShrink: 1 }}>{ss}{resting ? tr('dalej: {name}', { name }) : name}</Text>
        <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: t.muted, fontSize: 14, fontFamily: F.semibold }}>{glue(counter) /* A11-19 */}</Text>
      </View>
      {ex.notes?.trim() ? <Muted numberOfLines={3} style={{ fontSize: 13 }}>{ex.notes.trim()}</Muted> : null}
      <Text accessibilityLanguage={lang()} accessible accessibilityLabel={tr('Teraz: {v}', { v: bigTxt })} adjustsFontSizeToFit numberOfLines={1} maxFontSizeMultiplier={1.2} style={{ color: t.text, fontSize: 64, lineHeight: 72, fontFamily: F.display }}>{big.num}{big.unit ? <Text accessibilityLanguage={lang()} style={{ fontSize: 18, fontFamily: F.semibold, color: t.muted }}>{` ${big.unit}`}</Text> : null}{big.tail}</Text>
      {p ? <Muted style={{ fontSize: 13 }}>{tr('ostatnio {s}', { s: setSummary(ex, p, 'calc') })}</Muted> : null}
      {vis.length || ghost.length ? (
        <View style={{ gap: 10, minHeight: minH }} onLayout={ev => { const h = Math.ceil(ev.nativeEvent.layout.height); if (slot.key !== set.id || h > slot.h) setSlot({ key: set.id, h }); }}>
          {vis.map((v, i) => <EquipVisual key={i} v={v} />)}
          {ghost.length ? <View style={{ gap: 10, opacity: 0 }} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{ghost.map((v, i) => <EquipVisual key={i} v={v} />)}</View> : null}
        </View>) : null}
      {hasTime(m) ? <TimedRing setId={set.id} /> : null}
      {timedIdle ? <>
        <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={tr('Start stopera: {ex}, seria {n}', { n: lbl, ex: name })} testID="focus-start" onPress={() => startTimed(w, e, set, pos.si, onStartSet)} style={({ pressed }) => [s.focusBtn, { backgroundColor: t.text, opacity: pressed ? 0.8 : 1 }]}>
          <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: t.bg, fontSize: 19, fontFamily: F.heavy }}>{tr('▶ Start')}</Text>
        </Pressable>
        <Btn small kind="ghost" title={tr('Odhacz bez pomiaru')} accessibilityLabel={tr('Odhacz bez pomiaru: {ex}, seria {n}', { n: lbl, ex: name })} onPress={() => onDone(pos.ei, pos.si)} style={{ alignSelf: 'center' }} />
      </> : (
        <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={tr('Seria zrobiona: {ex}, seria {n}', { n: lbl, ex: name })} testID="focus-done" onPress={() => onDone(pos.ei, pos.si)} style={({ pressed }) => [s.focusBtn, { backgroundColor: t.text, opacity: pressed ? 0.8 : 1 }]}>
          <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: t.bg, fontSize: 19, fontFamily: F.heavy }}>{tr('Seria zrobiona')}</Text>
        </Pressable>)}
      <Muted style={{ fontSize: 12, textAlign: 'center' }}>{tr('Wartości zmienisz w wierszu serii poniżej.')}</Muted>
    </View>
  );
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
        <View><Text accessibilityLanguage={lang()} style={{ color: over ? t.danger : t.band, fontSize: big, fontFamily: F.monoBold }} maxFontSizeMultiplier={1.3}>{monoSafe(txt, true)}</Text><Muted style={{ fontSize: 12 }}>{target > 0 ? tr('seria · cel {s}', { s: fmtSec(target) }) : tr('seria · bez celu')}</Muted></View>
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
    <View><Text accessibilityLanguage={lang()} style={{ color: over ? t.danger : t.accent, fontSize: big, fontFamily: F.monoBold }} maxFontSizeMultiplier={1.3}>{over ? '+' + fmtDur(-left) : fmtDur(left)}</Text><Muted style={{ fontSize: 12 }}>{over ? tr('przerwa minęła') : tr('przerwa z {s}', { s: fmtDur(timer.T.total) })}</Muted></View>
    <View style={{ flex: 1 }} />
    <Btn title="−15" small accessibilityLabel={tr('Skróć przerwę o 15 sekund')} onPress={() => timer.adjust(-15)} /><Btn title="+15" small accessibilityLabel={tr('Wydłuż przerwę o 15 sekund')} onPress={() => timer.adjust(15)} /><Btn title={tr('Pomiń')} small kind="primary" onPress={() => timer.stop()} />
  </View>;
}
/** Seria na czas w karcie „teraz”: pierścień postępu do celu (bez celu — sam czas). Dolny pasek stopera bez zmian (tam „Zakończ serię”). */
function TimedRing({ setId }: { setId: string }) {
  const t = useTheme(); const [, force] = useState(0); const on = timer.S.on && timer.S.setId === setId;
  useEffect(() => { if (!on) return; const i = setInterval(() => force(x => x + 1), 250); return () => clearInterval(i); }, [on]); /* audyt 0.10 (PERF-06): odświeżanie tylko w trakcie pomiaru */
  if (!on) return null;
  const el = timer.setElapsed(); const target = timer.S.targetSec; const frac = target > 0 ? Math.min(1, el / target) : 0;
  const R = 34, C = 2 * Math.PI * R; const txt = target > 0 ? fmtSec(Math.max(0, target - el)) : fmtSec(el);
  return <View accessibilityLanguage={lang()} accessible accessibilityRole="progressbar" accessibilityLabel={target > 0 ? tr('seria · cel {s}', { s: fmtSec(target) }) : tr('seria · bez celu')} accessibilityValue={{ text: txt }} style={{ alignSelf: 'center', width: 84, height: 84, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width={84} height={84} style={{ position: 'absolute' }}><Circle cx={42} cy={42} r={R} stroke={t.line} strokeWidth={8} fill="none" /><Circle cx={42} cy={42} r={R} stroke={t.band} strokeWidth={8} fill="none" strokeDasharray={`${C * frac} ${C}`} strokeLinecap="round" transform="rotate(-90 42 42)" /></Svg>
    <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.2} style={{ color: t.text, fontSize: 18, fontFamily: F.monoBold }}>{monoSafe(txt, true)}</Text>
  </View>;
}

const s = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, gap: 8 },
  ex: { marginBottom: 18, paddingBottom: 6, borderBottomWidth: 1 },
  exHead: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', columnGap: 8, rowGap: 2, marginBottom: 6 }, // runda 69: wąski ekran — opis schodzi pod nazwę
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  c: { fontSize: 12, textAlign: 'center' },
  doneBtn: { height: 44, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  bandBtn: { height: 44, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  focus: { borderWidth: 2, borderRadius: 18, padding: 16, gap: 10, marginBottom: 18 },
  focusRest: { borderWidth: 1, borderRadius: 12, padding: 10, flexDirection: 'row' },
  focusBtn: { minHeight: 60, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  timer: { position: 'absolute', left: 0, right: 0, bottom: 8, borderWidth: 1, borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
});
