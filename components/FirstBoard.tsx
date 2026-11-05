import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Text } from '@/components/AppText';
import { upperText } from '@/components/ui';
import { useReduceMotion } from '@/components/ExerciseFigure';
import { useTheme, font, maxScale, RADIUS, SPACE, SIZE, MOTION } from '@/lib/theme';
import { firstBoardParts } from '@/lib/dashboard';
import { fmtWeekdayDayMonth } from '@/lib/calendar';
import { t, lang } from '@/lib/i18n';

/*
 * Tablica „Pierwszy trening” (nowa osoba do pierwszego zakończonego treningu; decyzja właściciela 05.11.2026, kierunek C′, docs/18; makieta docs/design/kierunki/start-1-1-r4.html):
 * ta sama tablica co „Dziś” i „teraz” (granat, obwódka boardEdge, krój tytułów), pola jak pola serii — skrót dnia, dzień, miesiąc; duża „1” na klapce w roli boardClock.
 * Ruch: kaskada klapek raz przy wejściu (każda klapka MOTION.boardFlipMs, odstęp 0,6 tego czasu → ok. 0,7 s); „Ogranicz ruch” — samo przenikanie MOTION.reducedCrossfadeMs.
 * VoiceOver: jeden opis tekstowy, elementy dekoracyjne ukryte.
 */
/** Odstęp klapek w kaskadzie (ułamek czasu jednej klapki — bez nowej liczby w tokenach). */
const STAGGER = 0.6;
function useCascade(n: number) {
  /* Ruch startuje dopiero, gdy ustawienie „Ogranicz ruch” jest znane (useReduceMotion: null do odczytu). Wcześniej start przy null liczył się jak „Ogranicz ruch” i — przez started — klapki
   * nigdy się nie obracały u osoby bez tego ustawienia (test: tests/ekran-nowej-osoby-1-1.test.tsx „ruch dozwolony”). */
  const rm = useReduceMotion(); const reduce = rm !== false; const v = useRef(Array.from({ length: n }, () => new Animated.Value(0))).current; const started = useRef(false);
  useEffect(() => {
    if (rm === null || started.current) return; started.current = true;
    Animated.parallel(v.map((x, i) => Animated.timing(x, { toValue: 1, delay: reduce ? 0 : i * STAGGER * MOTION.boardFlipMs, duration: reduce ? MOTION.reducedCrossfadeMs : MOTION.boardFlipMs, easing: Easing.out(Easing.ease), useNativeDriver: true }))).start();
  }, [rm]); // eslint-disable-line react-hooks/exhaustive-deps
  return v.map(x => reduce ? { opacity: x } : { opacity: x.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1, 1] }), transform: [{ perspective: 900 }, { rotateX: x.interpolate({ inputRange: [0, 1], outputRange: ['70deg', '0deg'] }) }] });
}

export function FirstBoard() {
  const th = useTheme(); const flip = useCascade(4); const p = firstBoardParts(new Date()); const title = upperText(t('Pierwszy trening'));
  const label = t('Pierwszy trening, dziś, {date}', { date: fmtWeekdayDayMonth(new Date()) });
  const field = (txt: string, i: number, id: string) => (
    <Animated.View key={id} testID={`first-board-${id}`} style={[{ flexGrow: id === 'day' ? 0.8 : 1, flexBasis: 0, minHeight: SIZE.boardFieldMin, borderRadius: RADIUS.field, borderWidth: 1, borderColor: th.boardMuted, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 }, flip[i]]}>
      <Text accessible={false} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} maxFontSizeMultiplier={maxScale('boardField')} style={{ ...font('boardField'), color: th.boardText, letterSpacing: 4 }}>{txt}</Text>
    </Animated.View>);
  return (
    <View testID="first-board" accessible accessibilityRole="image" accessibilityLanguage={lang()} accessibilityLabel={label} style={{ marginTop: SPACE.m, backgroundColor: th.board, borderColor: th.boardEdge, borderWidth: 1, borderRadius: RADIUS.board, padding: SPACE.l, gap: SPACE.s }}>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ gap: SPACE.s }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: SPACE.s }}>
          <Text maxFontSizeMultiplier={maxScale('boardName')} style={[{ ...font('boardName'), color: th.boardText, flexShrink: 1 }, title.style]}>{title.text}</Text>
          <Text maxFontSizeMultiplier={maxScale('boardMeta')} style={{ ...font('boardMeta'), color: th.boardMuted }}>{t('dziś')}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: SPACE.m, marginVertical: SPACE.s }}>
          <Animated.View testID="first-board-big" style={[{ minWidth: 88, paddingHorizontal: SPACE.m, backgroundColor: th.boardField, borderRadius: RADIUS.board, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, flip[0]]}>
            <Text maxFontSizeMultiplier={1} style={{ ...font('boardClock'), color: th.boardText }}>1</Text>
            <View style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 2, marginTop: -1, backgroundColor: th.board }} />
          </Animated.View>
          <Text maxFontSizeMultiplier={maxScale('boardMeta')} style={{ ...font('boardMeta'), color: th.boardMuted, paddingBottom: SPACE.xs }}>{t('trening')}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: SIZE.boardFieldGap }}>{field(p.weekday, 1, 'weekday')}{field(p.day, 2, 'day')}{field(p.month, 3, 'month')}</View>
      </View>
    </View>);
}
