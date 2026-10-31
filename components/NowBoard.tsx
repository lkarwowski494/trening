import React, { useState } from 'react';
import { View, Animated, PixelRatio, useWindowDimensions } from 'react-native';
import { Text } from '@/components/AppText';
import { useTheme, font, maxScale, boardDigitSize, RADIUS, SIZE, SPACE } from '@/lib/theme';
import { Btn, Muted, upperText, monoSafe } from '@/components/ui';
import { startTimed } from '@/components/WorkoutBlocks';
import { exById, focusSet, prevOfActiveBlock, hintFor, typeSetValue, setSummary, groupLabels, ssTag } from '@/lib/store';
import { counterLabel, setLabel } from '@/lib/live';
import { equipVisFor, equipSlotFor, slotHeight } from '@/lib/equipvis';
import { EquipVisual } from '@/components/EquipVisual';
import { boardKeys, boardDigitChars, effectiveValues, missingKey, stepOf, fieldLayout, type BoardKey } from '@/lib/board';
import { playHaptic } from '@/lib/haptics';
import { announce } from '@/lib/announce';
import { finishTimedSet } from '@/lib/setFlow';
import * as timer from '@/lib/timer';
import { hasTime, type Workout } from '@/lib/seed';
import { t as tr, exName, exNameLang, lang, glue } from '@/lib/i18n';
import { BoardNum, StepBtn, unitOf, stepLabelKey, shownValue } from '@/components/BoardControls';
import { Fields, boardLabel, RestFace, TimedRing, RestControls, useRestLeft, useFlip } from '@/components/BoardFace';

/*
 * Tablica „teraz” (M3 p2; kierunek A „tablica podejść”, design-spec §1 i §2, docs/32 wzorzec 29, ZM-01 i ZM-05) — zastępuje kartę „teraz” (FocusCard):
 *  - nazwa ćwiczenia wersalikami (upperText, W3), „seria n z m”, ciężar × powtórzenia (albo dystans, czas) liczbami Barlow dopasowanymi do szerokości
 *    (boardDigitSize); stuknięcie liczby otwiera wpis (klawiatura numeryczna), obok przyciski ± o krok sprzętu (lib/board.ts);
 *  - pola serii (zrobiona — wypełnienie, bieżąca — ramka „teraz”, czekająca — kontur, rozgrzewka — kontur kreskowany), bez dotyku; do 4 z wynikiem,
 *    5–12 w 1–3 rzędach, powyżej 12 przewijany rząd (fieldLayout);
 *  - „Seria zrobiona” bez wyniku nie odhacza serii: kursor trafia do brakującego pola, haptyka ostrzegawcza i ogłoszenie VoiceOver;
 *  - w przerwie tablica pokazuje zegar „teraz”, „z {s}” i następną serię; −15 / +15 / Pomiń pod tablicą; po upływie przerwy wraca tablica serii
 *    (1 stuknięcie na serię jak dotąd); seria na czas: „▶ Start”, w trakcie pomiaru „Zakończ serię” (jedna nazwa z dolnym paskiem, ZM-05);
 *  - VoiceOver: nagłówek z nazwą to jeden element z opisem zawierającym liczby (rola obrazu); wiersz liczb z polem wpisu i przyciski ± leżą POZA tą grupą (E2E-11: potomkowie grupy accessible są niewidoczni dla VoiceOver i XCTest), mają własne etykiety; pola serii są ukryte (opis je zawiera).
 * Widok listy (Ustawienia → Widok treningu) nie używa tablicy (decyzja STOP 3).
 */

export function NowBoard({ w, onDone, onFinish, onStartSet, onCardY, onRestY }: { w: Workout; onDone: (ei: number, si: number) => void; onFinish: () => void; onStartSet: (setId: string, target: number, subtitle: string, remeasure?: boolean) => void; onCardY?: (y: number) => void; onRestY?: (y: number) => void }) {
  const th = useTheme(); const pos = focusSet(w); const left = useRestLeft(); const { width } = useWindowDimensions();
  const [req, setReq] = useState<{ setId: string; key: BoardKey; n: number } | null>(null);
  const [slot, setSlot] = useState({ key: '', h: 0 }); /* wariant A (07.10.2026): miejsce na grafikę sprzętu nie maleje w obrębie serii — wiersz pod tablicą nie skacze pod klawiaturę */
  const resting = left != null && left > 0; const face = !pos ? 'done' : resting ? 'rest' : 'set'; const flip = useFlip(face);
  const cardLayout = (ev: { nativeEvent: { layout: { y: number } } }) => onCardY?.(ev.nativeEvent.layout.y);
  const box = { backgroundColor: th.board, borderColor: th.boardEdge, borderWidth: 1, borderRadius: RADIUS.board, padding: SPACE.l, gap: SPACE.s };
  if (!pos) {
    if (!w.exercises.some(x => x.sets.length)) return null;
    /* Audyt 0.10 (LIVE-08): „Wszystkie serie odhaczone” tylko, gdy naprawdę wszystkie; reszta pominięta — inny tekst; nic nie odhaczono — jeszcze inny */
    const all = w.exercises.every(x => x.sets.every(s => s.done)); const any = w.exercises.some(x => x.sets.some(s => s.done));
    return <View testID="focus-card" onLayout={cardLayout}>
      <Animated.View style={[box, flip]}>
        {resting ? <RestFace w={w} pos={null} /> : null}
        <Text accessibilityLanguage={lang()} accessibilityRole="header" maxFontSizeMultiplier={maxScale('boardName')} style={{ ...font('boardName'), color: th.boardText }}>{all ? tr('Wszystkie serie odhaczone') : any ? tr('Nic więcej do zrobienia (część pominięta)') : tr('Nic nie odhaczono — wszystkie ćwiczenia pominięte')}</Text>
      </Animated.View>
      <Btn kind="primary" block title={tr('Zakończ trening')} onPress={onFinish} style={{ marginTop: SPACE.s, minHeight: SIZE.buttonPrimary }} />
      {resting ? <RestControls /> : null}
    </View>;
  }
  const e = w.exercises[pos.ei]; const ex = exById(e.exerciseId)!; const set = e.sets[pos.si]; const m = ex.metric ?? 'weight_reps'; const keys = boardKeys(ex);
  const eff = effectiveValues(w, e, pos.si); const lbl = setLabel(e, pos.si); const prev = prevOfActiveBlock(w, e); const p = hintFor(prev?.sets, e.sets, pos.si, ex);
  const name = exName(ex); const ss = e.groupId ? `${ssTag(groupLabels(w.exercises)[e.groupId])} · ` : ''; const counter = counterLabel(e, pos.si);
  const innerW = width - 4 * SPACE.l; const strs = keys.map(k => shownValue(ex, k, eff[k] ?? ''));
  const size = boardDigitSize('boardNumber', width, Math.max(3, boardDigitChars(strs)), PixelRatio.getFontScale(), innerW); /* 04-studio-projektowe-001: cyfry liczone jak w makiecie (bez „×” i jednostek), 24% szerokości ekranu */
  const vis = equipVisFor(w, e, set); const ghost = vis.length ? [] : equipSlotFor(w, e, set); const minH = slot.key === set.id ? slot.h : 0;
  const running = timer.S.on && timer.S.setId === set.id; const timedIdle = hasTime(m) && !running; const scrolls = fieldLayout(e.sets.length, innerW, 1).scroll;
  /* 04-studio-projektowe-007: przy wąskim ekranie (320 pt) wiersz ± ciaśniej (odstęp 4, etykieta min. 24), żeby prawy „+” nie wychodził poza tablicę */
  const tight = keys.length * (2 * SIZE.stepButton + 2 * SPACE.s + 32) + (keys.length - 1) * SPACE.s > innerW;
  const sepSize = Math.round(size * 0.45);
  const press = () => {
    const miss = missingKey(w, e, pos.si);
    if (miss) { setReq({ setId: set.id, key: miss, n: Date.now() }); playHaptic('missing'); announce(tr('Wpisz {co}, żeby zapisać serię.', { co: miss === 'weight' || miss === 'addKg' ? tr('ciężar') : miss === 'reps' ? tr('powtórzenia') : miss === 'durationSec' ? tr('czas') : tr('dystans') })); return; }
    onDone(pos.ei, pos.si);
  };
  const step = (k: BoardKey, plus: boolean) => { const st = stepOf(w, e, k, plus ? 1 : -1, eff[k] ?? ''); if (st.to == null) return; playHaptic('step'); typeSetValue(pos.ei, pos.si, k === 'weight' || k === 'addKg' ? 'load' : k, st.to); };
  return (
    <View testID="focus-card" onLayout={cardLayout}>
      <Animated.View testID="board-face" style={[box, flip]} onLayout={ev => { if (resting) onRestY?.(ev.nativeEvent.layout.height); }}>
        {resting ? <RestFace w={w} pos={pos} /> : <>
          <View testID="board-desc" accessible accessibilityRole="image" accessibilityLanguage={exNameLang(ex)} accessibilityLabel={boardLabel(e, ex, pos.si, eff, scrolls)} style={{ gap: SPACE.s }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: SPACE.s }}>
              <Text accessibilityLanguage={exNameLang(ex)} accessibilityRole="header" accessible={false} maxFontSizeMultiplier={maxScale('boardName')} style={{ ...font('boardName'), color: th.boardText, flexShrink: 1, ...upperText(`${ss}${name}`).style }}>{upperText(`${ss}${name}`).text}</Text>
              <Text accessible={false} maxFontSizeMultiplier={maxScale('boardMeta')} style={{ ...font('boardMeta'), color: th.boardMuted }}>{monoSafe(glue(counter), true) /* A11-19; litery greckie krojem tekstu (A11-11) */}</Text>
            </View>
            {ex.notes?.trim() ? <Text accessible={false} numberOfLines={3} maxFontSizeMultiplier={maxScale('footnote')} style={{ ...font('footnote'), color: th.boardMuted }}>{ex.notes.trim()}</Text> : null}
          </View>
          {/* E2E-11: liczby i pole wpisu poza grupą accessible (iOS chowa potomków grupy przed VoiceOver i XCTest); opis tablicy wyżej zawiera te wartości */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: SPACE.xs, flexWrap: 'nowrap' }}>
            {keys.map((k, i) => <React.Fragment key={k}>
              {i ? <Text accessible={false} maxFontSizeMultiplier={1} style={{ ...font('boardMeta'), fontSize: sepSize, lineHeight: Math.round(sepSize * 1.3) /* M2-koordynator-napraw-003: wysokość linii z rozmiaru znaku, nie z tokenu boardMeta (22) — inaczej „×” przy dużych cyfrach jest ucięty */, color: th.boardMuted }}>{k === 'durationSec' && keys[0] === 'distanceM' ? '·' : '×'}</Text> : null}
              <BoardNum w={w} ei={pos.ei} si={pos.si} k={k} eff={eff} size={size} req={req} />
              {k === 'weight' || k === 'distanceM' || (k === 'addKg' && (eff.addKg ?? 0) !== 0) ? <Text accessible={false} maxFontSizeMultiplier={maxScale('stepLabel')} style={{ ...font('stepLabel'), color: th.boardMuted }}>{unitOf(k)}</Text> : null}
            </React.Fragment>)}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', gap: SPACE.s }}>
            {keys.map(k => { const dn = stepOf(w, e, k, -1, eff[k] ?? ''); const up = stepOf(w, e, k, 1, eff[k] ?? ''); return (
              <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: tight ? SPACE.xs : SPACE.s }}>
                <StepBtn th={th} plus={false} testID={`step-${k}-down`} label={stepLabelKey(k, false, dn.amount)} disabled={dn.to == null} onPress={() => step(k, false)} />
                <Text accessible={false} maxFontSizeMultiplier={maxScale('stepLabel')} style={{ ...font('stepLabel'), color: th.boardText, minWidth: tight ? 24 : 32, textAlign: 'center' }}>{unitOf(k)}</Text>
                <StepBtn th={th} plus testID={`step-${k}-up`} label={stepLabelKey(k, true, up.amount)} disabled={up.to == null} onPress={() => step(k, true)} />
              </View>); })}
          </View>
          {hasTime(m) ? <TimedRing setId={set.id} th={th} /> : null}
        </>}
        <Fields w={w} ei={pos.ei} cur={pos.si} />
      </Animated.View>
      {resting ? <RestControls /> : <>
        {vis.length || ghost.length ? (
          <View style={{ gap: SPACE.s, minHeight: minH, marginTop: SPACE.s }} onLayout={ev => { const h = slotHeight(ev.nativeEvent.layout.height); if (slot.key !== set.id || h > slot.h) setSlot({ key: set.id, h }); }}>
            {vis.map((v, i) => <EquipVisual key={i} v={v} />)}
            {ghost.length ? <View style={{ gap: SPACE.s, opacity: 0 }} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{ghost.map((v, i) => <EquipVisual key={i} v={v} />)}</View> : null}
          </View>) : null}
        {running ? <Btn kind="primary" block testID="focus-finish-set" title={tr('Zakończ serię')} accessibilityLabel={tr('Zakończ serię: {ex}, seria {n}', { n: lbl, ex: name })} onPress={() => { finishTimedSet().catch(() => {}); }} style={{ marginTop: SPACE.s, minHeight: SIZE.buttonPrimary }} />
          : timedIdle ? <>
            <Btn kind="primary" block testID="focus-start" title={tr('▶ Start')} accessibilityLabel={tr('Start stopera: {ex}, seria {n}', { n: lbl, ex: name })} onPress={() => startTimed(w, e, set, pos.si, onStartSet)} style={{ marginTop: SPACE.s, minHeight: SIZE.buttonPrimary }} />
            <Btn small kind="ghost" title={tr('Odhacz bez pomiaru')} accessibilityLabel={tr('Odhacz bez pomiaru: {ex}, seria {n}', { n: lbl, ex: name })} onPress={press} style={{ alignSelf: 'center' }} /></>
          : <Btn kind="primary" block testID="focus-done" title={tr('Seria zrobiona')} accessibilityLabel={tr('Seria zrobiona: {ex}, seria {n}', { n: lbl, ex: name })} onPress={press} style={{ marginTop: SPACE.s, minHeight: SIZE.buttonPrimary }} />}
        {p ? <Muted style={{ textAlign: 'center', marginTop: SPACE.xs }}>{tr('ostatnio {s}', { s: setSummary(ex, p, 'calc') })}</Muted> : null}
        {left != null && left <= 0 ? <Muted style={{ textAlign: 'center' }}>{tr('przerwa minęła')}</Muted> : null}
      </>}
    </View>
  );
}

