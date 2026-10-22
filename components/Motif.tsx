import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { PLATE_COLORS, type PlateColor } from '@/lib/discColors';
import Svg, { Path, Rect } from 'react-native-svg';
import { needsEdge, MINI_ICON, MARK_STROKE, restCup, REST_CUP, MARK_FILL, MARK_SQUARE, plateStack, plateStackHeight, PLATE_STACK, type DayMark } from '@/lib/motif';
import { useTheme, MOTIF, SPACE, RADIUS, type Theme } from '@/lib/theme';
import { useA11yPrefs } from '@/lib/a11yPrefs';
import { ICON_BAR, ICON_PLATES, ICON_COLLAR } from '@/lib/brandIcon';

/*
 * Motyw z ikony (decyzja właściciela 09.10.2026, zestaw pełny; liczby i reguły — lib/motif.ts, kolory — lib/discColors.ts PLATE_COLORS).
 * Wspólne części rysunków. Każdy element motywu to osobny komponent, który można przenieść w inne miejsce bez zmian (układ ekranu głównego
 * może się zmienić — ostrzeżenie koordynatora 09.10.2026): WeekStacks, EmptyBarArt, RecordsCard (components/*.tsx, bez grafiki od 11.10.2026), DayIcon i PlateStack (tu).
 * Grafiki dekoracyjne są ukryte przed VoiceOver; tam, gdzie grafika niesie informację, ta sama informacja jest tekstem obok i w etykiecie.
 */
export const a11yHidden = { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const };

/** Jeden talerz z boku (zaokrąglony prostokąt jak na ikonie). Puste miejsce = kontur ctrlLine (≥ 3:1 do tła karty). */
export function Plate({ color, loaded = true, h, w = 10, bg, th, testID }: { color: PlateColor; loaded?: boolean; h: number; w?: number; bg: string; th: Theme; testID?: string }) {
  const fill = PLATE_COLORS[color];
  return <View testID={testID} style={{ width: w, height: h, borderRadius: Math.min(4, w / 2.5), backgroundColor: loaded ? fill : 'transparent', borderWidth: !loaded || needsEdge(fill, bg) ? 1.5 : 0, borderColor: loaded ? th.text : th.ctrlLine }} />;
}

/**
 * Znacznik dnia (pasek tygodnia na karcie „Dziś” i kalendarz; makieta A2, decyzja właściciela 22.10.2026, docs/18): zrobione — kwadrat pełny w kolorze znacznika,
 * zaplanowane — kontur tego samego koloru, opuszczone — kontur wyszarzony (ctrlLine). Bez barw talerzy (te tylko jako tło startu). Odpoczynek (dzień bez
 * treningu w aktywnym planie) — filiżanka (RestCup). Geometria: lib/motif.MARK_SQUARE, MINI_ICON, restCup. Dekoracja: stan dnia czyta VoiceOver z etykiety i wartości dnia.
 */
export function DayIcon({ mark, bg, th }: { mark: DayMark; bg: string; th: Theme }) {
  const { w, h } = MINI_ICON; const { size, sw } = MARK_SQUARE; const x = (w - size) / 2; const y = (h - size) / 2;
  if (mark === 'rest') return <RestCup color={th[MARK_STROKE.rest]} />;
  return (
    <View {...a11yHidden} testID={`day-icon-${mark}`}><Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} accessible={false}>
      {mark === 'done' ? <Rect x={x} y={y} width={size} height={size} rx={RADIUS.marker} fill={th[MARK_FILL.done]} />
        : <Rect x={x + sw / 2} y={y + sw / 2} width={size - sw} height={size - sw} rx={RADIUS.marker} fill="none" stroke={th[MARK_STROKE[mark]]} strokeWidth={sw} />}
    </Svg></View>);
}

/**
 * Filiżanka espresso na spodku — dzień odpoczynku (rozstrzygnięcie agenta 09.10.2026: pełna płaska sylwetka, jak kształty ikony; odrzucona obwódka —
 * w tym samym stonowanym kolorze co ikona dnia opuszczonego byłaby drugim szarym konturem; zrzuty: docs/09). Kolor `ctrlLine` (MARK_STROKE.rest):
 * stonowany, ≥ 3:1 do tła w obu motywach. Spodek i czarka wypełnione, ucho — pierścień. Geometria: lib/motif.REST_CUP.
 */
export function RestCup({ color }: { color: string }) {
  const { w, h } = MINI_ICON; const c = restCup(); const sw = REST_CUP.sw; const { handle: hd, saucer: sc } = c;
  return (
    <View {...a11yHidden} testID="day-icon-rest"><Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} accessible={false}>
      <Rect x={sc.x} y={sc.y} width={sc.w} height={sc.h} rx={sc.rx} fill={color} />
      <Rect x={hd.x + sw / 2} y={hd.y + sw / 2} width={hd.w - sw} height={hd.h - sw} rx={hd.rx} fill="none" stroke={color} strokeWidth={sw} />
      <Path d={c.body} fill={color} />
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

/*
 * Motyw A2 (M3, STOP E3 21.10.2026; docs/design/design-spec.md §1): koniec sztangi z talerzami w barwach IWF jako subtelne tło — tylko na starcie (sylwetka ok. 30% szerokości
 * ekranu, prawy górny róg) i w pustych stanach (gryf z talerzami, 220 pt). Barwy talerzy w paletach (motif25/20/15/10, motifBar: krycie 16% / 20% policzone z góry),
 * więc w tym pliku nie ma przezroczystości. Nigdy na tablicy, przy liczbach kg, w paskach, listach ani przyciskach; barwa nic nie znaczy (decyzja 09.10.2026).
 * Znika przy „Zwiększ kontrast” i od skali tekstu 1,4; ukryty dla VoiceOver. Geometria z rysunku ikony (lib/brandIcon).
 */
const MOTIF_VIEW = { x: 6, y: 12, w: 106, h: 96 } as const;
const MOTIF_PLATE_KEY = { red: 'motif25', blue: 'motif20', yellow: 'motif15', green: 'motif10', white: 'motifBar' } as const;
/** Czy motyw jest widoczny: nie przy „Zwiększ kontrast” i nie od skali tekstu MOTIF.hideFromFontScale (zająłby miejsce tytułu). */
export function useMotifVisible(): boolean {
  const { fontScale } = useWindowDimensions(); const { contrast } = useA11yPrefs();
  return !(contrast && MOTIF.hideWhenIncreasedContrast) && fontScale < MOTIF.hideFromFontScale;
}
/** Rysunek: gryf, cztery talerze (25, 20, 15, 10 kg) i zacisk w barwach motywu. Bez logiki widoczności — ta jest w StartMotif i EmptyBarArt. */
export function BarMotif({ width }: { width: number }) {
  const th = useTheme(); const { x, y, w, h } = MOTIF_VIEW;
  return (
    <View testID="bar-motif" {...a11yHidden} style={{ width, height: (width * h) / w }}>
      <Svg width={width} height={(width * h) / w} viewBox={`${x} ${y} ${w} ${h}`} accessible={false}>
        <Rect x={ICON_BAR.x} y={ICON_BAR.y} width={ICON_BAR.w} height={ICON_BAR.h} rx={ICON_BAR.rx} fill={th.motifBar} />
        {ICON_PLATES.map((p, i) => <Rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={p.rx} fill={th[MOTIF_PLATE_KEY[p.color]]} />)}
        <Rect x={ICON_COLLAR.x} y={ICON_COLLAR.y} width={ICON_COLLAR.w} height={ICON_COLLAR.h} rx={ICON_COLLAR.rx} fill={th.motifBar} />
      </Svg>
    </View>);
}
/** Sylwetka na ekranie Start: ok. 30% szerokości ekranu w prawym górnym rogu (ekran Start umieszcza ją w p2). */
export function StartMotif() {
  const { width } = useWindowDimensions(); const visible = useMotifVisible();
  if (!visible) return null;
  return <View testID="start-motif" pointerEvents="none" {...a11yHidden} style={{ position: 'absolute', top: 0, right: 0, paddingTop: SPACE.xs }}><BarMotif width={Math.round(width * MOTIF.startWidthRatio)} /></View>;
}
