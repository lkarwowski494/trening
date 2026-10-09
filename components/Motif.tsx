import React from 'react';
import { View } from 'react-native';
import { PLATE_COLORS, type PlateColor } from '@/lib/plates';
import { PLATE_HEIGHT, needsEdge } from '@/lib/motif';
import type { Theme } from '@/lib/theme';

/*
 * Motyw z ikony (decyzja właściciela 09.10.2026, zestaw pełny; liczby i reguły — lib/motif.ts, kolory — lib/plates.ts PLATE_COLORS).
 * Wspólne części rysunków. Każdy element motywu to osobny komponent, który można przenieść w inne miejsce bez zmian (układ ekranu głównego
 * może się zmienić — ostrzeżenie koordynatora 09.10.2026): WeekBarbell, PlateStripe, EmptyBarArt, RecordPlates (components/*.tsx), DayPlate (tu).
 * Grafiki dekoracyjne są ukryte przed VoiceOver; tam, gdzie grafika niesie informację, ta sama informacja jest tekstem obok i w etykiecie.
 */
export const a11yHidden = { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const };

/** Jeden talerz z boku (zaokrąglony prostokąt jak na ikonie). Puste miejsce = kontur ctrlLine (≥ 3:1 do tła karty). */
export function Plate({ color, loaded = true, h, w = 10, bg, th, testID }: { color: PlateColor; loaded?: boolean; h: number; w?: number; bg: string; th: Theme; testID?: string }) {
  const fill = PLATE_COLORS[color];
  return <View testID={testID} style={{ width: w, height: h, borderRadius: Math.min(4, w / 2.5), backgroundColor: loaded ? fill : 'transparent', borderWidth: !loaded || needsEdge(fill, bg) ? 1.5 : 0, borderColor: loaded ? th.text : th.ctrlLine }} />;
}

/** Mały talerz obok numeru dnia w kalendarzu (kolor i wysokość wg lib/motif.dayLevels; opis dnia czyta VoiceOver z etykiety dnia). */
export const DAY_PLATE_MAX_H = 18;
export function DayPlate({ color, bg, th }: { color: PlateColor; bg: string; th: Theme }) {
  return <View {...a11yHidden} testID={`day-plate-${color}`}><Plate color={color} h={Math.round(DAY_PLATE_MAX_H * PLATE_HEIGHT[color])} w={5} bg={bg} th={th} /></View>;
}
