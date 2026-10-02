import React from 'react';
import { View, Text, type LayoutChangeEvent } from 'react-native';
import Svg, { Polyline, Circle, Line, Rect, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/lib/theme';
import { t as tr, tp } from '@/lib/i18n';

/*
 * Lekkie wykresy na react-native-svg (T-030). Bez bibliotek wykresowych — dwa kształty wystarczą:
 * linia z punktami (metryka per sesja w czasie) i słupki (tygodnie). Oba skalują się do szerokości kontenera.
 */

export interface Pt { x: number; y: number; label: string }

/** Podziałki osi Y (czysta funkcja — testowana właściwościami). Liczone w jednostkach wyświetlanych (`scale`), zwracane w jednostkach danych. */
/** Runda 71 (T3): kroki „zegarowe” dla osi czasu (sekundy) — 15 s, 30 s, 1 min… zamiast 20 s / 50 s / 200 s. */
export const TIME_STEPS = [1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600];
export function axisTicks(values: number[], scale = 1, minStep = 0, intOnly?: boolean, steps?: number[]): { ticks: number[]; yMin: number; yMax: number } {
  const ds = values.map(v => v * scale); let lo = Math.min(...ds), hi = Math.max(...ds); const allInt = intOnly ?? ds.every(Number.isInteger); const nonNeg = lo >= 0;
  if (hi === lo) { const d = Math.max(minStep, 1); hi += d; lo = nonNeg ? Math.max(0, lo - d) : lo - d; } /* runda 16: stała ujemna (asysta) nie odwraca osi */
  { const sp = hi - lo; lo -= sp * 0.1; hi += sp * 0.1; if (nonNeg) lo = Math.max(0, lo); }
  const raw = (hi - lo) / 3; const p10 = Math.pow(10, Math.floor(Math.log10(raw)));
  const top = steps?.length ? steps[steps.length - 1] : 0;
  const nice = (r: number, p: number) => (allInt ? [1, 2, 5, 10] : [1, 2, 2.5, 5, 10]).map(m => m * p).find(x => x >= r - 1e-12) ?? r;
  const step = Math.max(steps?.length ? (steps.find(x => x >= raw - 1e-12) ?? top * nice(raw / top, Math.pow(10, Math.floor(Math.log10(raw / top))))) : nice(raw, p10), minStep, allInt ? 1 : 0);
  let dMin = Math.floor(lo / step + 1e-9) * step; if (nonNeg) dMin = Math.max(0, dMin); let dMax = Math.ceil(hi / step - 1e-9) * step; if (dMax <= dMin) dMax = dMin + step;
  const ticks: number[] = []; for (let k = 0; dMin + k * step <= dMax + step * 1e-6 && k < 7; k++) ticks.push(Math.round((dMin + k * step) / step) * step / scale);
  const yMin = dMin / scale, yMax = dMax / scale;
  return { ticks, yMin, yMax };
}

/** Runda 74: przy długiej historii kropka na każdej sesji to tysiące elementów SVG zlewających się w linię — wtedy tylko pierwsza, najlepsza i ostatnia. */
export const MAX_DOTS = 60;
export function LineChart({ points, fmt, height = 180, color, scale = 1, minStep = 0, intOnly, steps }: { /** runda 71: własna lista kroków (oś czasu) */ steps?: number[]; points: Pt[]; fmt: (v: number) => string; height?: number; color?: string; /** runda 69: przelicznik na jednostki wyświetlane (np. kg→lb) — podziałki „ładne” w tym, co widać */ scale?: number; /** najmniejsza różnica, którą formatter pokazuje */ minStep?: number; intOnly?: boolean }) {
  const t = useTheme(); const [w, setW] = React.useState(0);
  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);
  const c = color ?? t.accent;
  if (points.length < 2) return <View onLayout={onLayout} style={{ height, justifyContent: 'center' }}><Text style={{ color: t.muted, textAlign: 'center', fontSize: 13 }}>{points.length === 1 ? tr('Jedna sesja: {v}. Wykres pojawi się po drugiej.', { v: fmt(points[0].y) }) : tr('Brak danych do wykresu.')}</Text></View>;
  const padR = 12, padT = 14, padB = 26;
  // Runda 69: podziałki liczone w jednostkach wyświetlanych (lb!), krok nie mniejszy niż rozdzielczość etykiet,
  // dla serii całkowitych (powtórzenia, sekundy) tylko kroki całkowite 1/2/5×10^k — etykiety się nie powtarzają i odpowiadają liniom.
  const { ticks, yMin, yMax } = axisTicks(points.map(p => p.y), scale, minStep, intOnly, steps);
  const tickLabels = ticks.map(fmt); const padL = Math.max(44, 8 + 6 * Math.max(...tickLabels.map(s => s.length)));
  const xs = points.map(p => p.x); const xMin = Math.min(...xs), xMax = Math.max(...xs) || xMin + 1;
  const X = (x: number) => padL + (w - padL - padR) * (xMax === xMin ? 0.5 : (x - xMin) / (xMax - xMin));
  const Y = (y: number) => padT + (height - padT - padB) * (1 - (y - yMin) / (yMax - yMin));
  const pts = points.map(p => `${X(p.x)},${Y(p.y)}`).join(' ');
  const last = points[points.length - 1]; const best = points.reduce((a, p) => p.y > a.y ? p : a, points[0]);
  // Runda 50: wartości są tylko w SVG — VoiceOver dostaje streszczenie wykresu.
  const a11y = tr('Wykres, {n} {s}: od {a} ({x}) do {b} ({y}), najlepiej {c} ({z}).', { n: points.length, s: tp(points.length, 'sesja|sesje|sesji'), a: fmt(points[0].y), x: points[0].label, b: fmt(last.y), y: last.label, c: fmt(best.y), z: best.label });
  return (
    <View onLayout={onLayout} style={{ height }} accessible accessibilityRole="image" accessibilityLabel={a11y}>
      {w > 0 ? (
        <Svg width={w} height={height}>
          {ticks.map((v, i) => <React.Fragment key={i}><Line x1={padL} x2={w - padR} y1={Y(v)} y2={Y(v)} stroke={t.line} strokeWidth={1} /><SvgText x={padL - 6} y={Y(v) + 4} fill={t.muted} fontSize={10} textAnchor="end">{tickLabels[i]}</SvgText></React.Fragment>)}
          <Polyline points={pts} fill="none" stroke={c} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {(points.length <= MAX_DOTS ? points : [...new Set([points[0], best, last])]).map((p, i) => <Circle key={i} cx={X(p.x)} cy={Y(p.y)} r={p === best ? 4.5 : 3} fill={p === best ? t.band : c} />)}
          <SvgText x={padL} y={height - 8} fill={t.muted} fontSize={10}>{points[0].label}</SvgText>
          <SvgText x={w - padR} y={height - 8} fill={t.muted} fontSize={10} textAnchor="end">{last.label}</SvgText>
          {(() => { const bl = fmt(best.y); const half = 3 * bl.length; const bx = X(best.x); const anchor = bx + half > w - 2 ? 'end' : bx - half < padL ? 'start' : 'middle'; /* runda 69: nie na etykiecie osi */ const by = Y(best.y) - 8 < padT + 2 ? Y(best.y) + 16 : Y(best.y) - 8; return <SvgText x={anchor === 'end' ? Math.min(bx, w - 2) : anchor === 'start' ? Math.max(bx, padL) : bx} y={by} fill={t.band} fontSize={10} textAnchor={anchor}>{bl}</SvgText>; })() /* runda 13: etykieta rekordu nie wychodzi za krawędź */}
        </Svg>) : null}
    </View>
  );
}

export function BarChart({ bars, fmt, height = 140, color }: { bars: { label: string; value: number }[]; fmt: (v: number) => string; height?: number; color?: string }) {
  const t = useTheme(); const [w, setW] = React.useState(0);
  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);
  const c = color ?? t.accent; const max = Math.max(1, ...bars.map(b => b.value));
  const padT = 16, padB = 22; const gap = 6; const bw = bars.length ? (w - gap * (bars.length - 1)) / bars.length : 0;
  return (
    <View onLayout={onLayout} style={{ height }} accessible accessibilityRole="image" accessibilityLabel={tr('Wykres słupkowy: {v}', { v: bars.map(b => `${b.label}: ${fmt(b.value)}`).join(', ') })}>
      {w > 0 ? (
        <Svg width={w} height={height}>
          {bars.map((b, i) => { const h = (height - padT - padB) * (b.value / max); const x = i * (bw + gap); const y = height - padB - h; return (
            <React.Fragment key={i}>
              <Rect x={x} y={y} width={bw} height={Math.max(1, h)} rx={3} fill={b.value ? c : t.line} />
              {b.value ? <SvgText x={x + bw / 2} y={y - 4} fill={t.muted} fontSize={9} textAnchor="middle">{fmt(b.value)}</SvgText> : null}
              <SvgText x={x + bw / 2} y={height - 6} fill={t.muted} fontSize={9} textAnchor="middle">{b.label}</SvgText>
            </React.Fragment>); })}
        </Svg>) : null}
    </View>
  );
}
