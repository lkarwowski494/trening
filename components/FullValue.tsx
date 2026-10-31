import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

/*
 * Podgląd liczby po przytrzymaniu (DEC-01 a, właściciel 23.10.2026; wdrożenie 1.0.1; docs/32 wzorzec 32).
 * Przy dużej skali tekstu liczba w ciasnym polu (ciężar, powtórzenia, dystans, czas, RPE, kafelki podsumowań) bywa przycięta — pole nie rośnie (układ ekranu bez zmian,
 * DEC-10: liczby do 130%). Przytrzymanie pola pokazuje ją w całości w systemowym podglądzie dużej zawartości (iOS Large Content Viewer: nakładka nad ekranem, zamyka się
 * po puszczeniu palca — bez okna i bez przycisku „Anuluj”, bo to nie okno, tylko chwilowy podgląd). Ta sama mechanika jest na tablicy „teraz” (components/BoardControls.tsx)
 * i na pasku zakładek. VoiceOver czyta pełną wartość z samego pola (etykieta + wartość), podgląd go nie zastępuje ani nie dubluje (kontener nie jest elementem dostępności).
 * Jeden komponent na całą aplikację: nowe ciasne pole z liczbą używa `FullValue` (albo `fullValueProps` na elemencie, który już jest dotykalny).
 * Tytuł podglądu = „etykieta: wartość”; pusta wartość → bez podglądu (nie ma czego pokazać).
 */
export function fullValueProps(label: string, value: string | number | null | undefined) {
  const v = value === null || value === undefined ? '' : String(value).trim();
  return v ? { accessibilityShowsLargeContentViewer: true, accessibilityLargeContentTitle: `${label}: ${v}` } : {};
}

export function FullValue({ label, value, style, children }: { label: string; value: string | number | null | undefined; style?: StyleProp<ViewStyle>; children: React.ReactNode }) {
  return <View {...fullValueProps(label, value)} style={style}>{children}</View>;
}
