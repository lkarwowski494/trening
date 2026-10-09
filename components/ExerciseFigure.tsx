import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { useTheme, F, type Theme } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';
import { figureAt, figureFor, figureFrames, figureLabel, frameLabel, svgPath, toSvg } from '@/lib/figures';
import { ANIM, type Role, type Shape } from '@/lib/figures/geom';
import type { Exercise } from '@/lib/seed';

/*
 * Figura ruchu w sekcji „Technika” (etap 2–3 — decyzja właściciela 08.10.2026 ok. 23:50; dane i geometria: lib/figures).
 * Animacja: pętla między pozycjami kluczowymi (interpolacja kątów stawów, zatrzymanie w każdej pozycji), kolory z motywu, bez migania.
 * WCAG 2.2.2: ruch trwający > 5 s ma przycisk „Zatrzymaj animację”. „Ogranicz ruch” (iOS) albo pauza — pozycje statycznie obok siebie
 * z podpisami. Dopóki ustawienie „Ogranicz ruch” nie jest znane, też statycznie (bez mignięcia animacji przed odczytem).
 * VoiceOver: cały rysunek to jeden obraz z opisem ruchu ze zdań wskazówek (figureLabel); przycisk pauzy osobno.
 */

/** Stan systemowego „Ogranicz ruch”: null = jeszcze nieznany (traktowany jak włączony), potem true/false; reaguje na zmianę ustawienia. */
export function useReduceMotion(): boolean | null {
  const [v, setV] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then(x => { if (alive) setV(!!x); }, () => { if (alive) setV(false); });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (x: boolean) => setV(!!x));
    return () => { alive = false; sub?.remove?.(); };
  }, []);
  return v;
}

const color = (th: Theme, r: Role): string => r === 'body' ? th.text : r === 'far' ? th.muted : r === 'load' ? th.accent : r === 'pad' ? th.surface2 : th.ctrlLine;

function FigureSvg({ list, box, floor, height, th, testID }: { list: Shape[]; box: { x: number; y: number; w: number; h: number }; floor: boolean; height: number; th: Theme; testID?: string }) {
  const fy = toSvg([0, 0], box)[1];
  return (
    <Svg testID={testID} width="100%" height={height} viewBox={`0 0 ${Math.round(box.w * 10) / 10} ${Math.round(box.h * 10) / 10}`} preserveAspectRatio="xMidYMid meet">
      {floor ? <Line x1={0} y1={fy} x2={box.w} y2={fy} stroke={th.line} strokeWidth={1.5} /> : null}
      {list.map((s, i) => {
        const c = color(th, s.role);
        if (s.s === 'circle') { const [cx, cy] = toSvg(s.c, box); return <Circle key={i} cx={cx} cy={cy} r={s.r} fill={s.fill ? c : 'none'} stroke={s.fill ? undefined : c} strokeWidth={s.w ?? 0} />; }
        return <Path key={i} d={svgPath(s.pts, box, s.close)} fill={s.fill ? c : 'none'} stroke={s.role === 'pad' ? th.line : c} strokeWidth={s.w} strokeLinecap="round" strokeLinejoin="round" />;
      })}
    </Svg>
  );
}

export function ExerciseFigure({ exercise }: { exercise: Pick<Exercise, 'lib' | 'libKey'> }) {
  const th = useTheme(); const reduce = useReduceMotion();
  const fig = useMemo(() => figureFor(exercise), [exercise.lib, exercise.libKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const frames = useMemo(() => fig ? figureFrames(fig) : null, [fig]);
  const [paused, setPaused] = useState(false); const [ms, setMs] = useState(0); const last = useRef(0);
  const animate = !!fig && fig.frames.length > 1 && reduce === false && !paused;
  useEffect(() => {
    if (!animate) return;
    last.current = Date.now();
    const id = setInterval(() => { const n = Date.now(); const d = n - last.current; last.current = n; setMs(m => m + d); }, ANIM.tickMs);
    return () => clearInterval(id);
  }, [animate]);
  if (!fig || !frames) return null;
  const label = figureLabel(fig.key);
  const canPause = fig.frames.length > 1 && reduce === false;
  return (
    <View testID="exercise-figure" style={{ marginTop: 6, marginBottom: 4 }}>
      <View testID="exercise-figure-image" accessible accessibilityRole="image" accessibilityLabel={label} accessibilityLanguage={lang()}>
        {animate
          ? <FigureSvg testID="exercise-figure-anim" list={figureAt(fig, ms)} box={frames.box} floor={fig.floor} height={170} th={th} />
          : <View testID="exercise-figure-static" style={{ flexDirection: 'row', gap: 8 }}>
              {fig.frames.map((fr, i) => (
                <View key={fr.n} style={{ flex: 1, alignItems: 'center' }}>
                  <FigureSvg testID={`exercise-figure-frame-${fr.n}`} list={frames.shapes[i]} box={frames.box} floor={fig.floor} height={fig.frames.length > 2 ? 110 : 140} th={th} />
                  {fig.frames.length > 1 ? <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.6} style={{ color: th.muted, fontSize: 12, fontFamily: F.regular, marginTop: 2, textAlign: 'center' }}>{frameLabel(fr.n)}</Text> : null}
                </View>
              ))}
            </View>}
      </View>
      {canPause
        ? <Pressable accessibilityLanguage={lang()} /* A11N-01 */ testID="exercise-figure-pause" onPress={() => setPaused(p => !p)} accessibilityRole="button" accessibilityLabel={paused ? t('Wznów animację') : t('Zatrzymaj animację')} hitSlop={4}
            style={{ minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center' }}>
            <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.6} style={{ color: th.accent, fontSize: 14, fontFamily: F.semibold }}>{paused ? t('Wznów animację') : t('Zatrzymaj animację')}</Text>
          </Pressable>
        : null}
      <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.6} style={{ color: th.muted, fontSize: 12, fontFamily: F.regular, marginTop: canPause ? 0 : 6 }}>{t('Rysunek schematyczny — pozycje orientacyjne.')}</Text>
    </View>
  );
}
