import React from 'react';
import { View } from 'react-native';
import { PLATE_COLORS, type PlateColor } from '@/lib/plates';
import Svg, { Rect } from 'react-native-svg';
import { needsEdge, miniIcon, MINI_ICON, MARK_STROKE, plateStack, plateStackHeight, PLATE_STACK, type DayMark } from '@/lib/motif';
import type { Theme } from '@/lib/theme';

/*
 * Motyw z ikony (decyzja właściciela 09.10.2026, zestaw pełny; liczby i reguły — lib/motif.ts, kolory — lib/plates.ts PLATE_COLORS).
 * Wspólne części rysunków. Każdy element motywu to osobny komponent, który można przenieść w inne miejsce bez zmian (układ ekranu głównego
 * może się zmienić — ostrzeżenie koordynatora 09.10.2026): WeekStacks, EmptyBarArt, RecordPlates (components/*.tsx), DayIcon i PlateStack (tu).
 * Grafiki dekoracyjne są ukryte przed VoiceOver; tam, gdzie grafika niesie informację, ta sama informacja jest tekstem obok i w etykiecie.
 */
export const a11yHidden = { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const };

/** Jeden talerz z boku (zaokrąglony prostokąt jak na ikonie). Puste miejsce = kontur ctrlLine (≥ 3:1 do tła karty). */
export function Plate({ color, loaded = true, h, w = 10, bg, th, testID }: { color: PlateColor; loaded?: boolean; h: number; w?: number; bg: string; th: Theme; testID?: string }) {
  const fill = PLATE_COLORS[color];
  return <View testID={testID} style={{ width: w, height: h, borderRadius: Math.min(4, w / 2.5), backgroundColor: loaded ? fill : 'transparent', borderWidth: !loaded || needsEdge(fill, bg) ? 1.5 : 0, borderColor: loaded ? th.text : th.ctrlLine }} />;
}

/**
 * Znacznik dnia (pasek tygodnia na karcie „Dziś” i kalendarz; korekta właściciela 09.10.2026 ok. 17:00): zrobione — mała ikona aplikacji w kolorach
 * (gryf w kolorze tekstu — w ciemnym motywie jasny), zaplanowane — sama obwódka ikony w kolorze tekstu, opuszczone — obwódka wyszarzona (ctrlLine).
 * Geometria: lib/motif.miniIcon. Dekoracja: stan dnia czyta VoiceOver z etykiety i wartości dnia.
 */
export function DayIcon({ mark, bg, th }: { mark: DayMark; bg: string; th: Theme }) {
  const parts = miniIcon(); const { w, h } = MINI_ICON;
  if (mark === 'done') return (
    <View {...a11yHidden} testID="day-icon-done"><Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} accessible={false}>
      {parts.map((p, i) => { const fill = p.color ? PLATE_COLORS[p.color] : th.text; const edge = !!p.color && needsEdge(fill, bg);
        return <Rect key={i} x={edge ? p.x + 0.4 : p.x} y={edge ? p.y + 0.4 : p.y} width={edge ? p.w - 0.8 : p.w} height={edge ? p.h - 0.8 : p.h} rx={p.rx} fill={fill} stroke={edge ? th.text : undefined} strokeWidth={edge ? 0.8 : undefined} />; })}
    </Svg></View>);
  const stroke = th[MARK_STROKE[mark]]; const sw = 1;
  return (
    <View {...a11yHidden} testID={`day-icon-${mark}`}><Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} accessible={false}>
      {parts.map((p, i) => p.part === 'bar' ? <Rect key={i} x={0} y={h / 2 - sw / 2} width={w} height={sw} fill={stroke} />
        : <Rect key={i} x={p.x + sw / 2} y={p.y + sw / 2} width={p.w - sw} height={p.h - sw} rx={p.rx} fill={bg} stroke={stroke} strokeWidth={sw} />)}
    </Svg></View>);
}

/** Stos talerzy (postęp tygodnia): pełny — kolory talerzy ikony, pusty — obwódka w kolorze tekstu (jak dzień zaplanowany). Geometria: lib/motif.plateStack. */
export function PlateStack({ filled, bg, th, testID }: { filled: boolean; bg: string; th: Theme; testID?: string }) {
  const parts = plateStack(); const w = PLATE_STACK.w; const h = plateStackHeight(); const sw = 1.25;
  return (
    <View testID={testID} {...a11yHidden}><Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} accessible={false}>
      {parts.map((p, i) => { const fill = PLATE_COLORS[p.color!]; const edge = filled && needsEdge(fill, bg);
        return filled ? <Rect key={i} x={edge ? p.x + 0.5 : p.x} y={edge ? p.y + 0.5 : p.y} width={edge ? p.w - 1 : p.w} height={edge ? p.h - 1 : p.h} rx={p.rx} fill={fill} stroke={edge ? th.text : undefined} strokeWidth={edge ? 1 : undefined} />
          : <Rect key={i} x={p.x + sw / 2} y={p.y + sw / 2} width={p.w - sw} height={p.h - sw} rx={p.rx} fill="none" stroke={th.text} strokeWidth={sw} />; })}
    </Svg></View>);
}
