import React from 'react';
import { Pressable, Text, Alert, Keyboard } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme, F } from '@/lib/theme';
import { t } from '@/lib/i18n';

/*
 * Wspólny wzór edycji na szkicu (docs/12 — edycja sesji; decyzja właściciela 08.10.2026 — ćwiczenie i szablon): w nagłówku „Anuluj” po lewej
 * i „Zapisz” po prawej, bez strzałki wstecz i bez gestu cofania (szkic nie przepada niezauważony); „Anuluj” przy zmianach pyta
 * „Odrzucić zmiany?” [Wróć, Odrzuć zmiany].
 */
export function HeaderButton({ title, onPress, bold, label }: { title: string; onPress: () => void; bold?: boolean; label?: string }) {
  const th = useTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={label ?? title} hitSlop={10} onPress={onPress} style={{ minHeight: 44, minWidth: 44, justifyContent: 'center' }}><Text maxFontSizeMultiplier={1.4} style={{ color: th.accent, fontSize: 17, fontFamily: bold ? F.semibold : F.regular }}>{title}</Text></Pressable>;
}
/** Nagłówek trybu edycji: tytuł, „Anuluj” i „Zapisz”; gest cofania wyłączony. Etykiety VoiceOver mogą nazwać obiekt („Zapisz ćwiczenie”). */
export function DraftHeader({ title, onCancel, onSave, cancelLabel, saveLabel }: { title?: string; onCancel: () => void; onSave: () => void; cancelLabel?: string; saveLabel?: string }) {
  return <Stack.Screen options={{ ...(title ? { title } : {}), headerBackVisible: false, gestureEnabled: false, headerLeft: () => <HeaderButton title={t('Anuluj')} label={cancelLabel} onPress={onCancel} />, headerRight: () => <HeaderButton title={t('Zapisz')} label={saveLabel} onPress={onSave} bold /> }} />;
}
/** „Anuluj” w edycji na szkicu: bez zmian — od razu; ze zmianami — pytanie z opisem skutku. `same()` — czy to wciąż ten sam szkic (okno mogło
 * zostać otwarte, gdy szkic już zniknął). */
export function confirmDiscard(dirty: boolean, message: string, discard: () => void, same: () => boolean = () => true) {
  Keyboard.dismiss();
  if (!dirty) { discard(); return; }
  Alert.alert(t('Odrzucić zmiany?'), message, [{ text: t('Wróć'), style: 'cancel' }, { text: t('Odrzuć zmiany'), style: 'destructive', onPress: () => { if (same()) discard(); } }]);
}
