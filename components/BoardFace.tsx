import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Animated, Easing, PixelRatio, useWindowDimensions, Keyboard } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme, font, maxScale, boardDigitSize, RADIUS, SIZE, SPACE, MOTION, TEXT_SCALE, type Theme } from '@/lib/theme';
import { Btn, monoSafe } from '@/components/ui';
import { useReduceMotion } from '@/components/ExerciseFigure';
import { exById, focusSet, fmtSec, fmtDur, groupLabels, ssTag } from '@/lib/store';
import { counterLabel, setLabel, spokenLoad, spokenDuration, nowParts } from '@/lib/live';
import { effectiveValues, fieldLayout, compactResult, type Eff } from '@/lib/board';
import * as timer from '@/lib/timer';
import { type Exercise, type WExercise, type Workout } from '@/lib/seed';
import { t as tr, exName, lang, glue } from '@/lib/i18n';

/* Twarze tablicy „teraz” (M3 p2): pola serii, zegar przerwy, ring stopera, opis dla VoiceOver i ruch przewrotu — wydzielone z components/NowBoard.tsx. */
/** Czy przerwa jeszcze trwa (zegar od timer.T), odświeżane tylko w przerwie. */
export function useRestLeft(): number | null {
  const [, force] = useState(0); const on = timer.T.on; /* ekran odświeża się przy zmianie timera (ActiveWorkout subskrybuje), więc `on` jest aktualne */
  useEffect(() => { if (!on) return; const i = setInterval(() => force(x => x + 1), 250); return () => clearInterval(i); }, [on]); /* PERF-06: bez interwału, gdy przerwa nie trwa */
  return on ? Math.round((timer.T.endAt - Date.now()) / 1000) : null;
}

/** Przewrót tablicy (250 ms, ease-out) przy zmianie twarzy; „Ogranicz ruch” — przenikanie 150 ms (MOTION). Treść zmienia się od razu, animacja dotyczy wejścia. */
export function useFlip(face: string) {
  const v = useRef(new Animated.Value(1)).current; const first = useRef(true); const reduce = useReduceMotion() !== false;
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    v.setValue(0); Animated.timing(v, { toValue: 1, duration: reduce ? MOTION.reducedCrossfadeMs : MOTION.boardFlipMs, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [face]); // eslint-disable-line react-hooks/exhaustive-deps
  return reduce ? { opacity: v } : { opacity: v.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1, 1] }), transform: [{ perspective: 900 }, { rotateX: v.interpolate({ inputRange: [0, 1], outputRange: ['70deg', '0deg'] }) }] };
}

/** Pola serii (bez dotyku — poza przewijaniem rzędu powyżej 12 pól palcem, 04-studio-projektowe-006): stan niesie kształt, nie sam kolor. */
export function Fields({ w, ei, cur }: { w: Workout; ei: number; cur: number }) {
  const th = useTheme(); const e = w.exercises[ei]; const ex = exById(e.exerciseId)!; const { width, fontScale } = useWindowDimensions();
  const inner = width - 4 * SPACE.l; const L = fieldLayout(e.sets.length, inner, fontScale); const scroller = useRef<ScrollView>(null);
  const cell = (i: number) => { const s = e.sets[i]; const state = s.done ? 'done' : i === cur ? 'current' : 'pending'; const warm = s.kind === 'warmup';
    const bg = state === 'done' ? th.boardText : 'transparent'; const fg = state === 'done' ? th.board : state === 'current' ? th.boardText : th.boardMuted;
    return <View key={s.id} testID={`board-field-${i}`} accessibilityValue={{ text: state }} style={[{ flex: L.scroll ? undefined : 1, width: L.scroll ? SIZE.boardFieldMinWidth + 20 : undefined, minHeight: SIZE.boardFieldMin, borderRadius: RADIUS.field, alignItems: 'center', justifyContent: 'center', backgroundColor: bg,
      borderWidth: state === 'current' ? 3 : 1, borderColor: state === 'current' ? th.now : state === 'pending' ? th.boardMuted : th.boardEdge, borderStyle: warm && state === 'pending' ? 'dashed' : 'solid', paddingHorizontal: 2 }]}>
      <Text accessibilityLanguage={lang()} accessible={false} numberOfLines={1} maxFontSizeMultiplier={TEXT_SCALE.num} adjustsFontSizeToFit minimumFontScale={0.7} style={{ ...font('boardField'), color: fg }}>{state === 'done' && L.showResult ? compactResult(ex, s) : setLabel(e, i)}</Text></View>; };
  useEffect(() => { if (L.scroll) scroller.current?.scrollTo({ x: Math.max(0, cur * (SIZE.boardFieldMinWidth + 20 + SIZE.boardFieldGap) - 80), animated: false }); }, [L.scroll, cur]);
  const all = e.sets.map((_, i) => i);
  return <View testID="board-fields" pointerEvents={L.scroll ? 'box-none' : 'none'} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    {L.scroll ? <ScrollView testID="board-fields-scroll" ref={scroller} horizontal showsHorizontalScrollIndicator={false} scrollEnabled contentContainerStyle={{ gap: SIZE.boardFieldGap }}>{all.map(cell)}</ScrollView>
      : Array.from({ length: L.rows }, (_, r) => <View key={r} style={{ flexDirection: 'row', gap: SIZE.boardFieldGap, marginTop: r ? SIZE.boardFieldGap : 0 }}>{all.slice(r * L.perRow, (r + 1) * L.perRow).map(cell)}{r === L.rows - 1 ? Array.from({ length: L.rows * L.perRow - e.sets.length }, (_, j) => <View key={'f' + j} style={{ flex: 1 }} />) : null}</View>)}
  </View>;
}

/** Opis tablicy dla VoiceOver: „{ćwiczenie}, seria 3 z 4, 80 kilogramów, 6 powtórzeń. Serie: 2 z 4 zrobione”. */
export function boardLabel(e: WExercise, ex: Exercise, si: number, eff: Eff, scrolls: boolean): string {
  const set = { ...e.sets[si], ...Object.fromEntries(Object.entries(eff).filter(([, v]) => v !== '')) }; const spoken = spokenLoad(ex, set);
  const warm = e.sets.filter(x => x.kind === 'warmup'); const work = e.sets.filter(x => x.kind !== 'warmup'); const done = (a: typeof warm) => a.filter(x => x.done).length;
  return [`${exName(ex)}, ${counterLabel(e, si)}`, spoken, warm.length ? tr('Rozgrzewki: {d} z {n} zrobione', { d: done(warm), n: warm.length }) : '', work.length ? tr('Serie: {d} z {n} zrobione', { d: done(work), n: work.length }) : '', scrolls ? tr('lista serii przewijana') : ''].filter(Boolean).join('. ');
}

/** Bieżąca (albo następna) seria: opis „seria n z m, 80 kg × 6” do wiersza „Następna: …” i do etykiety. */
export function nextText(w: Workout, ei: number, si: number): string {
  const e = w.exercises[ei]; const ex = exById(e.exerciseId)!; const eff = effectiveValues(w, e, si); const set = { ...e.sets[si], ...Object.fromEntries(Object.entries(eff).filter(([, v]) => v !== '')) };
  const p = nowParts(ex, set); const ss = e.groupId ? `${ssTag(groupLabels(w.exercises)[e.groupId])} · ` : ''; const cur = focusSet(w);
  return `${cur && cur.ei !== ei ? `${exName(ex)}, ` : ''}${ss}${counterLabel(e, si)}, ${p.num}${p.unit ? ' ' + p.unit : ''}${p.tail}`;
}

/** Zegar „teraz” w przerwie, w tym samym miejscu co liczby serii (tablica przewrócona na zegar). */
export function RestFace({ w, pos }: { w: Workout; pos: { ei: number; si: number } | null }) {
  const th = useTheme(); const { width } = useWindowDimensions(); const left = Math.max(0, Math.round((timer.T.endAt - Date.now()) / 1000)); const txt = fmtDur(left);
  const size = boardDigitSize('boardClock', width - 4 * SPACE.l, txt.length, PixelRatio.getFontScale());
  const nx = pos ? nextText(w, pos.ei, pos.si) : '';
  return <View testID="board-rest" accessible accessibilityRole="image" accessibilityLanguage={lang()} accessibilityLabel={[tr('Przerwa. Pozostały czas: {t}. Cała przerwa: {all}.', { t: spokenDuration(left), all: spokenDuration(timer.T.total) }), nx ? tr('Następna: {x}', { x: nx }) : ''].filter(Boolean).join(' ')} style={{ gap: SPACE.s }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: SPACE.s }}>
      <Text accessibilityLanguage={lang()} accessibilityRole="header" accessible={false} maxFontSizeMultiplier={maxScale('boardName')} style={{ ...font('boardName'), color: th.boardText }}>{tr('Przerwa')}</Text>
      <Text accessibilityLanguage={lang()} accessible={false} maxFontSizeMultiplier={maxScale('boardMeta')} style={{ ...font('boardMeta'), color: th.boardMuted }}>{monoSafe(tr('z {s}', { s: fmtDur(timer.T.total) }), true)}</Text>
    </View>
    <Text testID="board-clock" accessibilityLanguage={lang()} accessible={false} maxFontSizeMultiplier={1} style={{ ...font('boardClock'), fontSize: size, lineHeight: Math.round(size * 0.95), color: th.now, textAlign: 'center' }}>{txt}</Text>
    {pos ? <Text testID="board-next" accessibilityLanguage={lang()} accessible={false} maxFontSizeMultiplier={maxScale('boardNext')} style={{ ...font('boardNext'), color: th.boardText, textAlign: 'center' }}>{monoSafe(tr('Następna: {x}', { x: glue(nx) }), true)}</Text> : null}
  </View>;
}

/** Ring stopera serii na tablicy (bez celu — sam czas). */
export function TimedRing({ setId, th }: { setId: string; th: Theme }) {
  const [, force] = useState(0); const on = timer.S.on && timer.S.setId === setId;
  useEffect(() => { if (!on) return; const i = setInterval(() => force(x => x + 1), 250); return () => clearInterval(i); }, [on]); /* audyt 0.10 (PERF-06): odświeżanie tylko w trakcie pomiaru */
  if (!on) return null;
  const el = timer.setElapsed(); const target = timer.S.targetSec; const frac = target > 0 ? Math.min(1, el / target) : 0;
  const R = 34, C = 2 * Math.PI * R; const txt = target > 0 ? fmtSec(Math.max(0, target - el)) : fmtSec(el);
  return <View accessibilityLanguage={lang()} accessible accessibilityRole="progressbar" accessibilityLabel={target > 0 ? tr('seria · cel {s}', { s: fmtSec(target) }) : tr('seria · bez celu')} accessibilityValue={{ text: txt }} style={{ alignSelf: 'center', width: 84, height: 84, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width={84} height={84} style={{ position: 'absolute' }}><Circle cx={42} cy={42} r={R} stroke={th.boardField} strokeWidth={8} fill="none" /><Circle cx={42} cy={42} r={R} stroke={th.now} strokeWidth={8} fill="none" strokeDasharray={`${C * frac} ${C}`} strokeLinecap="round" transform="rotate(-90 42 42)" /></Svg>
    <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE.num} style={{ ...font('boardField'), color: th.boardText }}>{monoSafe(txt, true)}</Text>
  </View>;
}

/** −15 / +15 / Pomiń pod tablicą w przerwie (etykiety VoiceOver jak w dolnym pasku). */
export function RestControls() {
  return <View style={{ flexDirection: 'row', gap: SPACE.s, marginTop: SPACE.s }}>
    <Btn title="−15" style={{ flex: 1 }} accessibilityLabel={tr('Skróć przerwę o 15 sekund')} onPress={() => timer.adjust(-15)} />
    <Btn title="+15" style={{ flex: 1 }} accessibilityLabel={tr('Wydłuż przerwę o 15 sekund')} onPress={() => timer.adjust(15)} />
    <Btn title={tr('Pomiń')} kind="primary" style={{ flex: 2 }} onPress={() => { Keyboard.dismiss(); timer.stop(); }} />
  </View>;
}
