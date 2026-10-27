import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View, type TextStyle } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { useTheme, TEXT_SCALE_MAX, FW, font, type Theme } from '@/lib/theme';
import { t, lang, exName } from '@/lib/i18n';
import { catalogKey, type Exercise } from '@/lib/seed';
import { useReduceMotion } from '@/components/ExerciseFigure';
import {
  figurePalette, figureSpec, shapePath, shapeAttrs, shapesAt, staticPositions, boxFor, uAt, TEMPO, tempoFor, spaceBadges, BADGE_GAP_PT, phasesFor, phaseIndexAt, trailFor, loopOf, cycleAt, guideShapes, measuredAngle, angleLineShown, contactShapes, badgeShapes, type Badge, type FigureSpec,
  type View as FView, type FigError, type GuideId,
} from '@/lib/figures/v2';
import { sortShapes } from '@/lib/figures/v2/draw';
import { badgesFor, measureLine, errorsOf, errorText, guidesOf, legendOf, toeAngleApplies } from '@/lib/figures/v2/ui';

/*
 * Figura ruchu v2 (grafiki ćwiczeń 1.0 — decyzja właściciela 25.10.2026; silnik: lib/figures/v2, projekt: docs/50). Widoki z boku i z przodu/z góry obok siebie, kolory z motywu,
 * mięśnie ZAWSZE widoczne z legendą (główne / pomocnicze; „uproszczenie” przy pewności katalogu „uproszczenie”), tor ruchu, licznik faz z tempem ilustracyjnym
 * (2 s / pauza / 1 s — ACSM 2009, docs/50), linie odniesienia tylko przy wskazówkach ze źródłem, przełącznik „Pokaż częsty błąd” (poza błędu jako modyfikacja pozy poprawnej, znacznik ✕).
 * Bez liczb i kątów na rysunku. WCAG 2.2.2: „Zatrzymaj animację”; „Ogranicz ruch” / pauza → pozycje statycznie z podpisami. VoiceOver: jeden obraz z opisem, kontrolki osobno.
 */

function ViewSvg({ spec, u, view, box, th, height, error, guides, testID, onBadge }: { spec: FigureSpec; u: number; view: FView; box: { x: number; y: number; w: number; h: number }; th: Theme; height: number; error?: FigError; guides: GuideId[]; testID?: string; onBadge?: (b: Badge) => void }) {
  const pal = useMemo(() => figurePalette(th), [th]);
  const trail = useMemo(() => trailFor(spec, view), [spec, view]);
  const all = useMemo(() => badgesFor(spec, u, view, error), [spec, u, view, error]);
  const [w, setW] = useState(0);
  const sc = w > 0 ? Math.min(w / box.w, height / box.h) : 0;
  /* odstęp ≥ BADGE_GAP_PT na ekranie: znaczki bliższe sobie są pomijane (przed pomiarem układu pokazujemy wszystkie) */
  const badges = useMemo(() => sc > 0 ? spaceBadges(all, BADGE_GAP_PT / sc) : all, [all, sc]);
  const list = useMemo(() => sortShapes([...shapesAt(spec, u, view, true, error), ...trail, ...guideShapes(spec, u, view, guides, error), ...contactShapes(spec, u, view, error), ...badgeShapes(badges)]), [spec, u, view, error, trail, guides, badges]);
  /* piksele znaczka: viewBox z preserveAspectRatio „meet” (wyśrodkowany) — przeliczenie współrzędnych rysunku (y w górę) na układ widoku */
  const ox = (w - box.w * sc) / 2, oy = (height - box.h * sc) / 2;
  return (
    <View onLayout={e => setW(e.nativeEvent.layout.width)} style={{ position: 'relative' }}>
    <Svg testID={testID} width="100%" height={height} viewBox={`0 0 ${Math.round(box.w * 10) / 10} ${Math.round(box.h * 10) / 10}`} preserveAspectRatio="xMidYMid meet">
      <G transform={`matrix(1 0 0 -1 ${-box.x} ${box.y + box.h})`}>
        {list.map((s, i) => {
          const a = shapeAttrs(s, pal) as Record<string, string | number | undefined>;
          if (s.k === 'circle') return <Circle key={i} cx={s.c[0]} cy={s.c[1]} r={s.r} {...(a as object)} />;
          return <Path key={i} d={shapePath(s)} {...(a as object)} />;
        })}
      </G>
    </Svg>
    {sc > 0 ? badges.map((b, i) => (
      <Pressable key={b.id} testID={`exercise-figure-v2-badge-${view}-${i}`} onPress={() => onBadge?.(b)} accessibilityRole="button" accessibilityLanguage={lang()}
        accessibilityLabel={b.kind === 'err' ? t('Częsty błąd: {opis}', { opis: errorText(b.cue) }) : t('Wskazówka: {opis}', { opis: errorText(b.cue) })}
        style={{ position: 'absolute', width: 44, height: 44, left: ox + (b.at[0] - box.x) * sc - 22, top: oy + (box.y + box.h - b.at[1]) * sc - 22 }} />
    )) : null}
    </View>
  );
}

/** Figura v2 ćwiczenia z katalogu; null, gdy rodzina ćwiczenia nie jest jeszcze gotowa. */
export function ExerciseFigureV2({ exercise, name }: { exercise: Pick<Exercise, 'lib' | 'libKey'> & { name?: string }; name?: string }) {
  const th = useTheme(); const reduce = useReduceMotion();
  const key = catalogKey(exercise);
  const spec = useMemo(() => key ? figureSpec(key) : null, [key]);
  const errors = useMemo(() => spec ? errorsOf(spec) : [], [spec]);
  const guides = useMemo(() => key ? guidesOf(key) : [], [key]);
  const legend = useMemo(() => key ? legendOf(key) : null, [key]);
  const [paused, setPaused] = useState(false); const [ms, setMs] = useState(0); const last = useRef(0);
  const [errIdx, setErrIdx] = useState(-1); const [width, setWidth] = useState(320); const [sel, setSel] = useState<{ cue: string; kind: 'ok' | 'err' } | null>(null);
  const animate = !!spec && !spec.static && reduce === false && !paused;
  useEffect(() => {
    if (!animate) return;
    last.current = Date.now();
    const id = setInterval(() => { const n = Date.now(); const d = n - last.current; last.current = n; setMs(m => m + d); }, TEMPO.tickMs);
    return () => clearInterval(id);
  }, [animate]);
  if (!spec) return null;
  const error = errIdx >= 0 ? errors[errIdx] : undefined; const errId = error?.error;
  const tempo = tempoFor(spec, errId);
  /* stuknięcie znaczka zatrzymuje animację (znaczek się porusza) i pokazuje tekst wskazówki pod rysunkiem */
  const onBadge = (b: Badge) => { setPaused(true); setSel({ cue: b.cue, kind: b.kind }); };
  const label = t('Rysunek ruchu: {opis}', { opis: name ?? exName({ name: exercise.name ?? spec.key, lib: true }) });
  const canPause = !spec.static && reduce === false;
  const u = animate ? (loopOf(spec) === 'cykl_lustro' ? cycleAt(ms) : uAt(ms, spec.lowerFirst, tempo)) : 0; /* marsz: pozycja 0–2 (druga połowa w lustrze, bez cofania) */
  const views = spec.views;
  const boxes = views.map(v => boxFor(spec, v, errors.map(e => e.error)));
  const aspects = boxes.map(b => b.w / b.h); const sumA = aspects.reduce((a, b) => a + b, 0);
  const height = Math.max(110, Math.min(200, (width - 8 * (views.length - 1)) / sumA));
  const measured = measuredAngle(spec, animate ? u : 1, errId); /* statycznie: pozycja końcowa */ const phases = phasesFor(spec, tempo); const cur = animate ? phaseIndexAt(ms, phases) : -1;
  const sec = (x: number): string => String(Math.round(x / 100) / 10).replace('.', ',');
  const shown = phases.filter((p, i) => !(p.name === 'Pauza' && (i === 3 || p.ms === 0)));
  const txt = { color: th.muted, ...font('footnote'), ...FW.regular } as const;
  return (
    <View testID="exercise-figure-v2" style={{ marginTop: 6, marginBottom: 4 }} onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      <View testID="exercise-figure-v2-image" accessible accessibilityRole="image" accessibilityLabel={label} accessibilityLanguage={lang()}>
        {animate
          ? <View testID="exercise-figure-v2-anim" style={{ flexDirection: 'row', gap: 8 }}>
              {views.map((v, i) => <View key={v} style={{ flex: aspects[i] }}><ViewSvg testID={`exercise-figure-v2-${v}`} spec={spec} u={u} view={v} box={boxes[i]} th={th} height={height} error={errId} guides={guides} onBadge={onBadge} /></View>)}
            </View>
          : <View testID="exercise-figure-v2-static" style={{ gap: 4 }}>
              {staticPositions(spec).map(p => (
                <View key={p}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {views.map((v, i) => <View key={v} style={{ flex: aspects[i] }}><ViewSvg testID={`exercise-figure-v2-${p === 0 ? 'start' : 'end'}-${v}`} spec={spec} u={p} view={v} box={boxes[i]} th={th} height={Math.round(height * 0.8)} error={errId} guides={guides} onBadge={onBadge} /></View>)}
                  </View>
                  {staticPositions(spec).length > 1 ? <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ ...txt, textAlign: 'center' }}>{p === 0 ? t('Pozycja wyjściowa') : t('Pozycja końcowa')}</Text> : null}
                </View>
              ))}
            </View>}
      </View>
      {!spec.static
        ? <View testID="exercise-figure-v2-phases" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
            {shown.map((p, i) => <Text key={i} accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ ...txt, color: phases.indexOf(p) === cur ? th.accent : th.muted, ...(phases.indexOf(p) === cur ? FW.semibold : {}) }}>
              {p.name === 'Pauza' ? t('Pauza') : p.untimed ? t(p.name) : t('{faza} {n} s', { faza: t(p.name), n: sec(p.ms) })}{i < shown.length - 1 ? ' ·' : ''}</Text>)}
          </View>
        : null}
      {angleLineShown(spec) ? <Text testID="exercise-figure-v2-angle" accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ ...txt, fontStyle: 'italic', marginTop: 2 }}>{(() => { const ml = measureLine(measured); return t(ml.template, { staw: t(ml.staw), n: ml.n }); })()}</Text> : null}
      {legend
        ? <View testID="exercise-figure-v2-legend" style={{ marginTop: 4, gap: 2 }}>
            {legend.main.length ? <LegendRow color={figurePalette(th).muscleMain} text={t('Mięśnie główne: {lista}', { lista: legend.main.map(r => t(legend.label(r))).join(', ') })} txt={txt} /> : null}
            {legend.aux.length ? <LegendRow color={figurePalette(th).muscleAux} text={t('Mięśnie pomocnicze: {lista}', { lista: legend.aux.map(r => t(legend.label(r))).join(', ') })} txt={txt} /> : null}
            {legend.simplified ? <Text testID="exercise-figure-v2-simplified" accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={txt}>{t('Dobór mięśni: przybliżony')}</Text> : null}
          </View>
        : null}
      {sel && !(sel.kind === 'err' && error && sel.cue === error.cue) /* tekst błędu jest już w wierszu „Częsty błąd” — nie powtarzamy */ ? <Text testID="exercise-figure-v2-badge-text" accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ ...font('footnote'), ...FW.semibold, marginTop: 4, color: sel.kind === 'err' ? th.danger : th.doneLine }}>{sel.kind === 'err' ? '✕ ' : '✓ '}{errorText(sel.cue)}</Text> : null}
      {toeAngleApplies(spec) ? <Text testID="exercise-figure-v2-toes" accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ ...txt, ...FW.semibold, marginTop: 2 }}>{t('Palce stóp lekko na zewnątrz — zwykle mniej więcej 15–20°.')}</Text> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 16 }}>
        {canPause
          ? <Pressable accessibilityLanguage={lang()} testID="exercise-figure-v2-pause" onPress={() => setPaused(p => !p)} accessibilityRole="button" accessibilityLabel={paused ? t('Wznów animację') : t('Zatrzymaj animację')} hitSlop={8}
              style={{ minHeight: 44, justifyContent: 'center' }}>
              <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.accent, ...font('callout'), ...FW.semibold }}>{paused ? t('Wznów animację') : t('Zatrzymaj animację')}</Text>
            </Pressable>
          : null}
        {errors.length
          ? <Pressable accessibilityLanguage={lang()} testID="exercise-figure-v2-error-toggle" onPress={() => { setSel(null); setErrIdx(i => i >= 0 ? -1 : 0); }} accessibilityRole="button" accessibilityState={{ selected: errIdx >= 0 }}
              accessibilityLabel={errIdx >= 0 ? t('Ukryj częsty błąd') : t('Pokaż częsty błąd')} hitSlop={8} style={{ minHeight: 44, justifyContent: 'center' }}>
              <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: errIdx >= 0 ? th.danger : th.accent, ...font('callout'), ...FW.semibold }}>{errIdx >= 0 ? t('Ukryj częsty błąd') : t('Pokaż częsty błąd')}</Text>
            </Pressable>
          : null}
      </View>
      {error
        ? <View testID="exercise-figure-v2-error" style={{ gap: 2, marginBottom: 4 }}>
            <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.danger, ...font('footnote'), ...FW.semibold }}>{t('Częsty błąd: {opis}', { opis: errorText(error.cue) })}</Text>
            {errors.length > 1
              ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {errors.map((e, i) => i === errIdx ? null : <Pressable accessibilityLanguage={lang()} key={e.error} testID={`exercise-figure-v2-error-${e.error.replace(':', '')}`} onPress={() => { setSel(null); setErrIdx(i); }} accessibilityRole="button" accessibilityState={{ selected: i === errIdx }} accessibilityLabel={errorText(e.cue)} hitSlop={8} style={{ minHeight: 44, justifyContent: 'center' }}>
                    <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: i === errIdx ? th.danger : th.muted, ...font('footnote'), ...(i === errIdx ? FW.semibold : FW.regular) }}>✕ {errorText(e.cue)}</Text>
                  </Pressable>)}
                </View>
              : null}
          </View>
        : null}
      <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ ...txt, marginTop: canPause || errors.length ? 0 : 6 }}>{t('Rysunek schematyczny — pozycje orientacyjne.')}</Text>
    </View>
  );
}

function LegendRow({ color, text, txt }: { color: string; text: string; txt: TextStyle }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View importantForAccessibility="no-hide-descendants" style={{ width: 12, height: 12, backgroundColor: color, opacity: 0.85 }} />
      <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={[txt, { flex: 1 }]}>{text}</Text>
    </View>
  );
}
