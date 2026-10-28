import { View, Pressable, Alert, StyleSheet, useWindowDimensions, ActionSheetIOS } from 'react-native';
import { Text } from '@/components/AppText';
import { useRouter } from 'expo-router';
import { useTheme, NUM_SCALE_MAX, FW, font, RADIUS, SIZE } from '@/lib/theme';
import { Icon } from '@/components/Icon';
import { Btn, NumInput, Muted, useOnce } from '@/components/ui';
import { TechniqueLink } from '@/components/ExerciseCues';
import { effortLabel, effortField, effortIn, progressionFor, skipExercise, unskipExercise, typeSetValue, bandA11y, clampName, SET_NOTE_MAX, loadLabelShort, getState, exById, prevOfActiveBlock, previousFor, canUndoSwap, undoSwap, pinnedImpl, rememberRest as storeRememberRest, canRememberAlt, rememberAlt, altHint, skipAlt, occurrence, occurrences, hintFor, isBW, reps, fmtSec, setSummary, roundRest, addSet, removeSetById, removeExercise, save, loadLabel, ssTag, ssBtn, linkWithNext, unlink, cycleBand, shortBand, locationById, offListNote, liveBlockImpl, listLocFor, srcSetAt, usesBand, isDeloadWeek, wallTs, REPS_MAX, REST_MAX } from '@/lib/store';
import { setLabel, timedLabel } from '@/lib/live';
import { availability, missingLabel } from '@/lib/equipment';
import { SwipeRow, lastSetBlock, confirmDelete } from '@/components/SwipeRow';
import { implLabel } from '@/lib/swap';
import { SetBadge } from '@/components/SetBadge';
import { locationLabel } from '@/lib/locations';
import * as timer from '@/lib/timer';
import { relabelRest } from '@/lib/setFlow';
import { hasTime, hasReps, hasWeight, hasDistance, SET_KIND_LABEL, type WExercise, type WSet, type Workout } from '@/lib/seed';
import { t as tr, tp, exName, exNameLang, lang } from '@/lib/i18n';
import { unitLabel, distLabel, wField, wInKeep, fmtW, dIn, dOut } from '@/lib/units';
import { cancelButton, okButton, confirmSkipTimedSet } from '@/lib/confirm';

/*
 * Bloki ćwiczeń na ekranie treningu: wiersze serii, akcje bloku, zamiana i cofnięcie zamiany. Wydzielone z components/ActiveWorkout.tsx (M3 p2, zmiana strukturalna
 * bez zmiany zachowania — podział ekranu treningu, o którym mówi limit w tests/architecture-limits.test.ts).
 */
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
  if (e.sets.some(x => x.edited)) Alert.alert(tr('Cofnąć zamianę?'), tr('Wpisane wartości zamiennika przepadną.'), [{ ...cancelButton() }, { text: tr('Cofnij'), style: 'destructive', onPress: go }]); else go();
}
/** E2 (pkt 3.2): „zamiast: A · ostatnio 3 serie 80×8” — ostatnia sesja A (previousFor), bez przeliczania. */
function insteadLine(e: WExercise): string {
  const A = e.swappedFrom ? exById(e.swappedFrom) : undefined; if (!A) return '';
  const p = previousFor(A.id); const xs = (p?.sets ?? []).map(x => setSummary(A, x)); const same = xs.length > 1 && xs.every(x => x === xs[0]);
  const last = !xs.length ? '' : same ? `${xs.length} ${tp(xs.length, 'seria|serie|serii')} ${xs[0]}` : xs.slice(0, 4).join(', ') + (xs.length > 4 ? '…' : '');
  return [tr('zamiast: {name}', { name: exName(A) }), last ? tr('ostatnio {s}', { s: last }) : ''].filter(Boolean).join(', '); /* M3 p2 (wz. 28): lista o zmiennej liczbie elementów — przecinek, nie „·” */
}

/** M1-audytor-generalny-034: linki tekstowe na ekranie treningu — minHeight 32 + hitSlop 6 z góry i z dołu = pole dotyku 44 pt (HIG). */
export const LINK_BOX = { minHeight: 32, justifyContent: 'center' } as const; export const LINK_SLOP = { top: 6, bottom: 6, left: 6, right: 6 } as const;

const WIDE = { idx: 28, w: 64, reps: 56, dist: 64, time: 56, play: 44, rpe: 46, band: 56, done: 44, gap: 6, prevMin: 70 };
/** Wariant zwarty dla wąskich ekranów (iPhone SE 1. gen., 320 pt) — gdy szerokie kolumny się nie mieszczą. */
const COMPACT = { idx: 24, w: 56, reps: 48, dist: 56, time: 50, play: 40, rpe: 40, band: 48, done: 44, gap: 4, prevMin: 70 };
type Cols = typeof WIDE;
/** M1-audytor-generalny-028 (04-studio-projektowe-004, 27.10.2026): kolumna węższa niż cel dotyku (COMPACT: stoper i RPE 40 pt) dostaje hitSlop po bokach
 * do SIZE.hit (44 pt) — pole dotyku bez zmiany układu (odstęp kolumn ≥ 4 pt, więc pola sąsiadów się nie nakładają). */
const slopTo = (w: number) => { const d = Math.max(0, Math.ceil((SIZE.hit - w) / 2)); return d ? { left: d, right: d } : undefined; };
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

export function ExerciseBlock({ w, e, ei, onDone, onStartSet, labels, prs }: { w: Workout; e: WExercise; ei: number; onDone: (ei: number, si: number) => void; onStartSet: (setId: string, target: number, subtitle: string, remeasure?: boolean) => void; labels: Record<string, string>; prs: Map<string, string[]> }) {
  const t = useTheme(); const st = getState(); const { width } = useWindowDimensions(); const router = useRouter(); const once = useOnce(); /* audyt 0.10 (UI-08): „⇄ zamień” */
  const ex = exById(e.exerciseId);
  const k = occurrence(w.exercises, ei); const nOcc = occurrences(w.exercises, e.exerciseId); const prev = ex ? prevOfActiveBlock(w, e) : null; /* decyzja 8c: ostatni raz tym samym przyrządem; E2 pkt 3.6: zamiennik — najpierw z tej pozycji szablonu */ /* runda 50: bez useMemo — zależy też od szablonu (edycja w trakcie); ta sama podpowiedź co przy odhaczeniu */
  if (!ex) {
    // Ćwiczenie usunięte na stałe w trakcie treningu — pokazujemy blok, żeby dało się go usunąć (wcześniej znikał niewidoczny).
    const dropGone = () => { const i = getState().active?.exercises.findIndex(x => x.id === e.id) ?? -1; if (i >= 0) { const ids = e.sets.map(x => x.id); if (timer.S.on && ids.includes(timer.S.setId ?? '')) timer.stopSet(); if (timer.T.on && ids.includes(timer.T.setId ?? '')) timer.stop(); removeExercise(i); } }; /* runda 43: timery tego bloku stop */
    /* 07.10.2026 wieczór: usuwanie przesunięciem w lewo (components/SwipeRow.tsx), bez przycisku */
    return <SwipeRow label={tr('Usuń usunięte ćwiczenie z treningu')} title={tr('Usunąć z treningu?')} message={tr('Usunięte ćwiczenie')} onDelete={dropGone} style={[s.ex, { borderBottomColor: t.line }]}>{a11y => <Text accessibilityLanguage={lang()} {...a11y} accessible maxFontSizeMultiplier={1.3} style={{ color: t.muted, ...FW.regular, ...font('callout') }}>{tr('Usunięte ćwiczenie')} · {e.sets.length} {tp(e.sets.length, 'seria|serie|serii')}</Text>}</SwipeRow>;
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
    if (timer.S.on && e.sets.some(x => x.id === timer.S.setId)) confirmSkipTimedSet(go);
    else go();
  };
  const removeBlock = () => { const i = getState().active?.exercises.findIndex(x => x.id === e.id) ?? -1; if (i < 0) return; /* runda 10: po id — drugie okno nie usuwa sąsiada */ dropBlockTimers(); removeExercise(i); };
  /* „Pomiń dziś” (docs/21 4a, 07.10.2026 wieczór): blok zwinięty do jednej linii; szablon bez zmian; odhaczone serie zapiszą się jak zawsze */
  if (e.skipped) return (
    <View style={[s.ex, { borderBottomColor: t.line }]}>
      <SwipeRow label={tr('Usuń ćwiczenie: {name}', { name: nm })} title={tr('Usunąć z treningu?')} message={delMsg} onDelete={removeBlock}>{a11y => <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text accessibilityLanguage={exNameLang(ex)} {...a11y} accessibilityRole="header" maxFontSizeMultiplier={1.3} style={{ color: t.muted, ...font('body'), ...FW.semibold, flexShrink: 1 }}>{exName(ex)}</Text>
        <Muted style={{ ...font('footnote'), flexGrow: 1 }}>{tr('pominięte dziś')}</Muted>
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
  const headMeta = [e.implPinned && e.impl ? implLabel(e.impl) /* E2 D5: przyrząd wybrany ręcznie */ : '', hasReps(m) && e.repMin != null ? reps(e.repMin, e.repMax) + ' ' + tr('pow.') : '', progText, inSS ? tr('superset · przerwa po rundzie {t}', { t: fmtSec(roundRest(ei) ?? e.restSec) }) /* T7: przerwa po zamknięciu rundy, niezależnie od kolejności odhaczania */ : tr('przerwa') + ' ' + fmtSec(e.restSec), ex.tempo].filter(Boolean).join(', ');
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
    const labels = [tr('Seria normalna'), tr('Rozgrzewka (W)'), tr('Drop set (D)'), tr('Do upadku (F)'), set.note ? tr('Edytuj notatkę') : tr('Dodaj notatkę'), tr('Usuń serię'), tr('Anuluj')]; /* M1-028: alternatywa dla gestu */
    const kinds = ['normal', 'warmup', 'drop', 'failure'] as const;
    ActionSheetIOS.showActionSheetWithOptions({ options: labels, cancelButtonIndex: labels.length - 1, destructiveButtonIndex: labels.length - 2, title: tr('Seria {n}', { n: setLabel(e, si) }) }, i => {
      if (i < 4) { set.kind = kinds[i]; set.warmup = set.kind === 'warmup'; save(st.active); }
      else if (i === 4) Alert.prompt?.(tr('Notatka do serii'), undefined, [{ ...cancelButton() }, { text: tr('Zapisz'), onPress: (v?: string) => { set.note = clampName((v ?? '').trim(), SET_NOTE_MAX); /* runda 49: limit notatki */ save(st.active); } }], 'plain-text', set.note);
      else if (i === 5) { /* M1-028: to samo potwierdzenie i ta sama blokada ostatniej serii co przy geście */
        if (e.sets.length <= 1) { const b = lastSetBlock(); Alert.alert(b.title, b.message, [okButton()]); }
        else confirmDelete({ title: tr('Usunąć serię?'), message: set.done ? tr('Seria jest już odhaczona.') : undefined, onDelete: () => deleteSet(set.id) });
      }
    });
  };
  /* 07.10.2026 wieczór (docs/18): usuwanie serii przesunięciem w lewo, zawsze z potwierdzeniem; ostatniej serii bloku się nie usuwa (jak wcześniej) */
  const deleteSet = (id: string) => { const cur = getState().active?.exercises.find(x => x.id === e.id); if (!cur || cur.sets.length <= 1 || !cur.sets.some(x => x.id === id)) return; dropTimers([id]); removeSetById(getState().active!.exercises.indexOf(cur), id); };
  const exMenu = () => ActionSheetIOS.showActionSheetWithOptions({ options: [tr('Usuń ćwiczenie'), tr('Anuluj')], cancelButtonIndex: 1, destructiveButtonIndex: 0, title: nm }, i => { /* M1-028: alternatywa dla gestu */
    if (i === 0) confirmDelete({ title: tr('Usunąć z treningu?'), message: delMsg, onDelete: removeBlock }); });
  return (
    <View style={[s.ex, { borderBottomColor: t.line }]}>
      <SwipeRow testID={`ex-${ei}`} /* E2E 25 */ label={tr('Usuń ćwiczenie: {name}', { name: nm })} title={tr('Usunąć z treningu?')} message={delMsg} onDelete={removeBlock}>{a11y => <View style={s.exHead}>
        <Text accessibilityLanguage={exNameLang(ex)} {...a11y} accessibilityRole="header" style={{ color: t.text, ...font('body'), ...FW.semibold, flexGrow: 1, flexShrink: 1, minWidth: '58%' }}>{inSS ? <Text accessibilityLanguage={lang()} style={{ color: t.band }}>{`${ssTag(labels[e.groupId!])} · `}</Text> : null}{exName(ex)}{ex.archived ? <Text accessibilityLanguage={lang()} style={{ color: t.muted, ...font('footnote') }}>{' (' + tr('usunięte') + ')'}</Text> : null}</Text>
        <Muted numberOfLines={2} style={{ ...font('footnote'), flexShrink: 1, flexGrow: 1, textAlign: 'right' }}>{headMeta}</Muted>
        <Pressable testID={`ex-menu-${ei}`} accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={tr('Opcje ćwiczenia: {name}', { name: nm })} onPress={exMenu} hitSlop={4} style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="more" color={t.muted} size={SIZE.icon} />{/* M1-029: ikona zamiast znaku „⋯” */}
        </Pressable>
      </View>}</SwipeRow>
      {insteadTxt || remember ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: -2, marginBottom: 6 }}><Muted style={{ ...font('footnote'), flexShrink: 1 }}>{insteadTxt || (e.impl ? tr('przyrząd: {impl}', { impl: implLabel(e.impl) }) : '')}</Muted>{canUndoSwap(e) ? <Btn title={tr('↺ cofnij')} small kind="ghost" accessibilityLabel={tr('Cofnij zamianę: {name}', { name: nm })} onPress={() => confirmUndoSwap(e.id)} /> : null}{remember && place ? <Btn title={tr('Zawsze w: {l}', { l: place.name })} small kind="ghost" accessibilityLabel={tr('Zawsze w: {l} — {name}', { l: place.name, name: nm })} accessibilityHint={tr('Zapisuje zamiennik w szablonie dla tego miejsca.')} onPress={() => rememberAlt(e.id)} /> : null}</View> : null}
      {hint && place ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: -2, marginBottom: 6 }}><Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={tr('Zamień na zamiennik: {name}', { name: hintName })} onPress={openSwap} hitSlop={LINK_SLOP} style={[LINK_BOX, { flexShrink: 1 }]}><Muted style={{ ...font('footnote'), textDecorationLine: 'underline' }}>{tr('Zwykle w: {l} — {name}. Zamienić?', { l: place.name, name: hintName })}</Muted></Pressable><Btn title="✕" small kind="ghost" accessibilityLabel={tr('Nie zamieniaj: {name}', { name: hintName })} onPress={() => skipAlt(e.id)} /></View> : null}
      {place && avail && !avail.ok ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -2, marginBottom: 6 }}><Pressable accessibilityLanguage={lang()} accessibilityRole="button" disabled={!swappable} accessibilityLabel={tr('Brak sprzętu w: {l}. Brakuje: {m}', { l: place.name, m: missingLabel(avail.missing) })} accessibilityHint={swappable ? tr('Otwiera zamianę ćwiczenia') : undefined} onPress={openSwap} hitSlop={8} style={{ flexShrink: 1 }}><Muted style={{ ...font('footnote'), color: t.danger, textDecorationLine: swappable ? 'underline' : 'none' }}>{tr('brak sprzętu w: {l}', { l: place.name })} ({missingLabel(avail.missing)})</Muted></Pressable></View> : null}
      {prevElsewhere || offNote ? <Muted style={{ ...font('footnote'), marginTop: -2, marginBottom: 6 }}>{[prevElsewhere ? tr('Poprzednio: {l}', { l: prevElsewhere }) : '', offNote].filter(Boolean).join(', ')}</Muted> : null}
      <View style={[s.row, { gap: W.gap }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" /* A11-18: nagłówki kolumn „#”, „✓”, „▶” — szum dla VoiceOver; każde pole ma własną etykietę (jak w historii) */>
        <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} style={[s.c, { width: W.idx, textAlign: 'left' }]}>#</Muted>
        {prevInline ? <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} numberOfLines={1} style={[s.c, { flex: 1, textAlign: 'left' }]}>{tr('Poprzednio')}</Muted> : <View style={{ flex: 1 }} />}
        {hasWeight(m) ? <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} numberOfLines={1} style={[s.c, { width: W.w }]}>{loadLabelShort(ex, impl)}</Muted> : null}
        {hasReps(m) ? <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} style={[s.c, { width: W.reps }]}>{tr('Pow.')}</Muted> : null}
        {hasDistance(m) ? <Muted maxFontSizeMultiplier={NUM_SCALE_MAX} style={[s.c, { width: W.dist }]}>{distLabel()}</Muted> : null}
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
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 }}>{prevInline ? <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} numberOfLines={1} style={{ flexShrink: 1, color: t.muted, ...font('footnote'), ...FW.regular /* audyt 0.10 (LIVE-13 / UI-11) */ }}>{prevTxt}</Text> : null}{pr ? <Text accessibilityLanguage={lang()} accessibilityLabel={tr('Rekord: {list}', { list: pr.map(k => tr(k)).join(', ') })} /* A11-18: VoiceOver czyta, jaki rekord, nie „P R” */ maxFontSizeMultiplier={1.3} style={{ color: t.band, ...font('caption'), ...FW.semibold }}>{tr('PR')}</Text> : null}</View>
              {hasWeight(m) ? <View style={{ width: W.w }}><NumInput weightTol decimal allowNegative={bw} value={wField(bw ? set.addKg : set.weight)} stored={bw ? set.addKg : set.weight} onNum={(v, keep) => { typeSetValue(ei, si, 'load', wInKeep(v, keep)); /* runda 54: ciężar nieujemny (writeLoad); Q-021: ta sama liczba co na ekranie = te same kg; 11.10.2026: kaskada w dół */ }} placeholder={bw ? '±0' : unitLabel()} style={doneStyle(set)} accessibilityLabel={loadLabel(ex, impl)} accessibilityHint={hint} testID={`w-${ei}-${si}`} /* E2E 11 */ /></View> : null}
              {hasReps(m) ? <View style={{ width: W.reps }}><NumInput value={set.reps} onNum={v => { typeSetValue(ei, si, 'reps', v === '' ? '' : Math.min(REPS_MAX, Math.max(0, Math.floor(v)))); /* UI-16; kaskada w dół */ }} placeholder={reps(e.repMin, e.repMax)} style={doneStyle(set)} accessibilityLabel={tr('Powtórzenia')} accessibilityHint={hint} testID={`r-${ei}-${si}`} /></View> : null}
              {hasDistance(m) ? <View style={{ width: W.dist }}><NumInput value={dOut(set.distanceM)} stored={set.distanceM} onNum={(v, keep) => { typeSetValue(ei, si, 'distanceM', dIn(v, keep)); /* runda 55/56: pełne metry jak klawiatura; kaskada w dół; LOK07-01: w imperialnym yardy → metry (cm) */ }} placeholder={distLabel()} style={doneStyle(set)} accessibilityLabel={tr('dystans')} accessibilityHint={hint} /></View> : null}
              {hasTime(m) ? <View style={{ width: W.time }}><NumInput value={set.durationSec} onNum={v => { typeSetValue(ei, si, 'durationSec', v === '' ? '' : Math.min(86400, Math.max(0, Math.round(v)))); /* runda 56: pełne sekundy jak klawiatura; kaskada w dół */ }} placeholder="s" style={doneStyle(set)} accessibilityLabel={tr('czas')} accessibilityHint={hint} /></View> : null}
              {hasTime(m) ? (
                <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={running ? tr('Stoper trwa') : tr('Start stopera serii')} accessibilityHint={hint} onPress={() => { if (!running) startTimed(w, e, set, si, onStartSet); }} hitSlop={slopTo(W.play)} style={[s.doneBtn, { width: W.play, backgroundColor: running ? t.accent : t.surface2, borderColor: running ? t.accent : t.line }]}>
                  <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: running ? t.accentInk : t.text, ...font('callout') }}>{running ? '…' : '▶'}</Text>
                </Pressable>) : null}
              {showRpe ? <View style={{ width: W.rpe }}><NumInput decimal value={effortField(set.rpe)} onNum={v => { set.rpe = effortIn(v); tick(); }} placeholder="—" style={doneStyle(set)} hitSlop={slopTo(W.rpe)} accessibilityLabel={effortLabel()} accessibilityHint={hint} /></View> : null}
              {band ? <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityHint={`${hint}. ${tr('Tapnij, by zmienić.')}`} /* A11-18 */ accessibilityLabel={tr('Guma: {b}', { b: set.bandId ? bandA11y(st.bands.find(b => b.id === set.bandId)) : tr('brak') })} onPress={() => cycleBand(set, bw && hasWeight(m))} style={[s.bandBtn, { width: W.band, backgroundColor: t.surface2, borderColor: set.done ? t.doneLine : t.line }]}><Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: set.bandId ? t.band : t.muted, ...font('footnote'), ...FW.semibold }}>{set.bandId ? shortBand(st.bands.find(b => b.id === set.bandId)) : '—'}</Text></Pressable> : null}
              <Pressable accessibilityLanguage={lang()} accessibilityRole="checkbox" accessibilityState={{ checked: set.done }} accessibilityLabel={tr('Seria {n} zrobiona — {ex}', { n: lbl, ex: nm })} onPress={() => onDone(ei, si)} style={[s.doneBtn, { width: W.done, backgroundColor: set.done ? t.accent : t.surface2, borderColor: set.done ? t.accent : t.ctrlLine /* A11-06 */ }]}><Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.3} style={{ color: set.done ? t.accentInk : t.muted, ...font('button') }}>{set.done ? '✓' : ''}</Text></Pressable>
            </View>
            {!prevInline && p ? <Muted numberOfLines={1} style={{ ...font('footnote'), marginLeft: W.idx + W.gap, marginTop: -4, marginBottom: 6 }}>{tr('Poprzednio')}: {prevTxt}</Muted> : null}
            {set.note ? <Muted style={{ ...font('footnote'), marginLeft: W.idx + W.gap, marginTop: -4, marginBottom: 6 }}>{set.note}</Muted> : null}
            {set.done && set.toFill ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: W.idx + W.gap, marginTop: -4, marginBottom: 6 }} testID={`tofill-${ei}-${si}`}>
              <Muted accessibilityLabel={tr('Seria {n} do uzupełnienia — {ex}', { n: lbl, ex: nm })} style={{ ...font('footnote'), color: t.danger /* 0.20: seria odhaczona na zegarku jako „zrobione inaczej” — znacznik słowem, nie samym kolorem */ }}>{tr('do uzupełnienia')}</Muted>
              <Btn small kind="ghost" title={tr('Gotowe')} accessibilityLabel={tr('Seria {n} uzupełniona — {ex}', { n: lbl, ex: nm })} onPress={() => { delete set.toFill; save(st.active); }} />
            </View> : null}
          </View>}</SwipeRow>
        );
      })}
      <View style={s.actions}>
        <Btn title={tr('+ seria')} small accessibilityHint={nm} onPress={() => addSet(ei)} /><Btn title={tr('+ rozgrzewka')} small kind="ghost" accessibilityHint={nm} onPress={() => addSet(ei, 'warmup')} /><Btn title={tr('+ drop set')} small kind="ghost" accessibilityHint={nm} onPress={() => addSet(ei, 'drop')} />
        <Btn icon="timer" title={fmtSec(e.restSec)} small accessibilityHint={`${nm}. ${tr('Tapnij, by zmienić.')}`} /* A11-18 */ accessibilityLabel={tr('Przerwa: {s}', { s: fmtSec(e.restSec) })} onPress={() => { Alert.prompt?.(tr('Przerwa (s)'), tr('Zapamiętać dla tego ćwiczenia?'), [{ ...cancelButton() }, { text: tr('Tylko teraz'), onPress: (v?: string) => { const n = parseRest(v); if (n != null) { e.restSec = n; save(st.active); } else badRest(); } }, { text: tr('Zapamiętaj'), onPress: (v?: string) => { const n = parseRest(v); if (n != null) rememberRest(n); else badRest(); } }], 'plain-text', String(e.restSec), 'number-pad'); }} />
        {ei + 1 < w.exercises.length && (!inSS || w.exercises[ei + 1].groupId !== e.groupId) ? <Btn title={ssBtn('link')} small kind="ghost" accessibilityLabel={tr('Połącz z następnym w superset')} accessibilityHint={nm} onPress={() => linkWithNext(w.exercises, ei, w)} /> : null}
        {inSS ? <Btn title={ssBtn('unlink')} small kind="ghost" accessibilityLabel={tr('Wyjmij z supersetu')} accessibilityHint={nm} onPress={() => unlink(w.exercises, ei, w)} /> : null}
        <TechniqueLink exercise={ex} name={nm} />{/* UX2-05 (audyt kontrolny 1): wskazówki techniki i figura w trakcie treningu */}
        {swappable ? <Btn title={tr('⇄ zamień')} small kind="ghost" accessibilityLabel={tr('Zamień ćwiczenie: {name}', { name: nm })} onPress={openSwap} /> : null}
        {e.sets.some(x => !x.done) ? <Btn title={tr('Pomiń dziś')} small kind="ghost" accessibilityLabel={tr('Pomiń dziś: {name}', { name: nm })} onPress={skipToday} /> : null}
      </View>
    </View>
  );
}

/** Start stopera serii na czas (▶ w wierszu i „▶ Start” na karcie — audyt 0.10, LIVE-06): cel z pola serii albo z szablonu; ponowny pomiar odhaczonej
 * serii — z pytaniem, cel z szablonu albo bez limitu (runda 18/22). */
export function startTimed(w: Workout, e: WExercise, set: WSet, si: number, onStartSet: (setId: string, target: number, subtitle: string, remeasure?: boolean) => void) {
  const tpl = w.templateId ? getState().templates.find(x => x.id === w.templateId) : null; const it = tpl && e.tplItemId ? tpl.items.find(x => x.id === e.tplItemId) : null;
  const tplTarget = Number(it?.targetSec) || 0; /* runda 18: ponowny pomiar liczy od nowa — cel z szablonu albo bez limitu, nie stary wynik */
  const ei = w.exercises.indexOf(e);
  const go = () => onStartSet(set.id, set.done ? tplTarget : Number(set.durationSec) || tplTarget /* runda 22: pusty czas → cel z szablonu */, timedLabel(w, ei, si), set.done);
  if (set.done) Alert.alert(tr('Zmierzyć serię od nowa?'), tr('Zapisany czas zostanie nadpisany.'), [{ ...cancelButton() }, { text: tr('Zmierz'), onPress: go }]); else go();
}

const s = StyleSheet.create({
  ex: { marginBottom: 18, paddingBottom: 6, borderBottomWidth: 1 },
  exHead: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', columnGap: 8, rowGap: 2, marginBottom: 6 }, // runda 69: wąski ekran — opis schodzi pod nazwę
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  c: { ...font('footnote'), textAlign: 'center' },
  doneBtn: { height: 44, borderRadius: RADIUS.button, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  bandBtn: { height: 44, borderRadius: RADIUS.button, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
});
