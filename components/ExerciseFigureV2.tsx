import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { useTheme, TEXT_SCALE_MAX, FW, font, type Theme } from '@/lib/theme';
import { t, lang, exName } from '@/lib/i18n';
import { catalogKey, type Exercise } from '@/lib/seed';
import { useReduceMotion } from '@/components/ExerciseFigure';
import { figurePalette, figureSpec, shapePath, shapeAttrs, shapesAt, staticPositions, boxFor, uAt, TEMPO, type FigureSpec, type View as FView } from '@/lib/figures/v2';
import { sortShapes } from '@/lib/figures/v2/draw';

/*
 * Figura ruchu v2 (grafiki ćwiczeń 1.0 — decyzja właściciela 25.10.2026): kształty z silnika lib/figures/v2 (szkielet 3D → widok z boku i z przodu/z góry),
 * kolory z motywu (figurePalette z tokenów lib/theme), bez żadnych liczb i etykiet kątów na rysunku (kąty bez źródła nie są pokazywane).
 * Animacja: pętla start → koniec → start w tempie ilustracyjnym 2 s w dół / 1 s w górę (lib/figures/v2/anim.ts); WCAG 2.2.2: przycisk „Zatrzymaj animację”;
 * „Ogranicz ruch” (iOS) albo pauza — pozycje statycznie z podpisami; dopóki ustawienie nie jest znane, też statycznie (bez mignięcia).
 * VoiceOver: cały rysunek to jeden obraz z opisem „Rysunek ruchu: nazwa ćwiczenia”; przycisk pauzy osobno.
 * Podświetlenie mięśni (`muscles`): dane muscleLoad katalogu, stałe (bez animowanego „napięcia”); domyślnie wyłączone do decyzji o sposobie pokazywania.
 */


function ViewSvg({ spec, u, view, box, th, height, muscles, testID }: { spec: FigureSpec; u: number; view: FView; box: { x: number; y: number; w: number; h: number }; th: Theme; height: number; muscles: boolean; testID?: string }) {
  const pal = useMemo(() => figurePalette(th), [th]);
  const list = useMemo(() => sortShapes(shapesAt(spec, u, view, muscles)), [spec, u, view, muscles]);
  return (
    <Svg testID={testID} width="100%" height={height} viewBox={`0 0 ${Math.round(box.w * 10) / 10} ${Math.round(box.h * 10) / 10}`} preserveAspectRatio="xMidYMid meet">
      <G transform={`matrix(1 0 0 -1 ${-box.x} ${box.y + box.h})`}>
        {list.map((s, i) => {
          const a = shapeAttrs(s, pal) as Record<string, string | number | undefined>;
          if (s.k === 'circle') return <Circle key={i} cx={s.c[0]} cy={s.c[1]} r={s.r} {...(a as object)} />;
          return <Path key={i} d={shapePath(s)} {...(a as object)} />;
        })}
      </G>
    </Svg>
  );
}

/** Figura v2 ćwiczenia z katalogu; null, gdy rodzina ćwiczenia nie jest jeszcze gotowa. */
export function ExerciseFigureV2({ exercise, name, muscles = false }: { exercise: Pick<Exercise, 'lib' | 'libKey'> & { name?: string }; name?: string; muscles?: boolean }) {
  const th = useTheme(); const reduce = useReduceMotion();
  const key = catalogKey(exercise);
  const spec = useMemo(() => key ? figureSpec(key) : null, [key]);
  const [paused, setPaused] = useState(false); const [ms, setMs] = useState(0); const last = useRef(0);
  const animate = !!spec && !spec.static && reduce === false && !paused;
  useEffect(() => {
    if (!animate) return;
    last.current = Date.now();
    const id = setInterval(() => { const n = Date.now(); const d = n - last.current; last.current = n; setMs(m => m + d); }, TEMPO.tickMs);
    return () => clearInterval(id);
  }, [animate]);
  if (!spec) return null;
  const label = t('Rysunek ruchu: {opis}', { opis: name ?? exName({ name: exercise.name ?? spec.key, lib: true }) });
  const canPause = !spec.static && reduce === false;
  const u = animate ? uAt(ms, spec.lowerFirst) : 0;
  const views = spec.views;
  return (
    <View testID="exercise-figure-v2" style={{ marginTop: 6, marginBottom: 4 }}>
      <View testID="exercise-figure-v2-image" accessible accessibilityRole="image" accessibilityLabel={label} accessibilityLanguage={lang()}>
        {animate
          ? <View testID="exercise-figure-v2-anim" style={{ flexDirection: 'row', gap: 8 }}>
              {views.map(v => <View key={v} style={{ flex: 1 }}><ViewSvg testID={`exercise-figure-v2-${v}`} spec={spec} u={u} view={v} box={boxFor(spec, v)} th={th} height={170} muscles={muscles} /></View>)}
            </View>
          : <View testID="exercise-figure-v2-static" style={{ gap: 4 }}>
              {staticPositions(spec).map(p => (
                <View key={p}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {views.map(v => <View key={v} style={{ flex: 1 }}><ViewSvg testID={`exercise-figure-v2-${p === 0 ? 'start' : 'end'}-${v}`} spec={spec} u={p} view={v} box={boxFor(spec, v)} th={th} height={110} muscles={muscles} /></View>)}
                  </View>
                  {staticPositions(spec).length > 1 ? <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, ...font('footnote'), ...FW.regular, textAlign: 'center' }}>{p === 0 ? t('Pozycja wyjściowa') : t('Pozycja końcowa')}</Text> : null}
                </View>
              ))}
            </View>}
      </View>
      {canPause
        ? <Pressable accessibilityLanguage={lang()} testID="exercise-figure-v2-pause" onPress={() => setPaused(p => !p)} accessibilityRole="button" accessibilityLabel={paused ? t('Wznów animację') : t('Zatrzymaj animację')} hitSlop={8}
            style={{ minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center' }}>
            <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.accent, ...font('callout'), ...FW.semibold }}>{paused ? t('Wznów animację') : t('Zatrzymaj animację')}</Text>
          </Pressable>
        : null}
      <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, ...font('footnote'), ...FW.regular, marginTop: canPause ? 0 : 6 }}>{t('Rysunek schematyczny — pozycje orientacyjne.')}</Text>
    </View>
  );
}
