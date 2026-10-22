import React from 'react';
import { Pressable, Text, Alert, Keyboard } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme, FW, font, SIZE } from '@/lib/theme';
import { Icon, type IconName } from '@/components/Icon';
import { t, lang } from '@/lib/i18n';
import { backToEditButton } from '@/lib/confirm';

/*
 * Wspólny wzór edycji na szkicu (docs/12 — edycja sesji; decyzja właściciela 08.10.2026 — ćwiczenie i szablon): w nagłówku „Anuluj” po lewej
 * i „Zapisz” po prawej, bez strzałki wstecz i bez gestu cofania (szkic nie przepada niezauważony); „Anuluj” przy zmianach pyta
 * „Odrzucić zmiany?” [Wróć, Odrzuć zmiany].
 */
export function HeaderButton({ title, onPress, bold, label, testID, icon }: { title: string; onPress: () => void; bold?: boolean; label?: string; testID?: string; /** M3 W1 a: przycisk-ikona („⋯”); `title`/`label` to wtedy tylko etykieta VoiceOver */ icon?: IconName }) {
  const th = useTheme();
  return <Pressable testID={testID} accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={label ?? title} hitSlop={10} onPress={onPress} style={{ minHeight: SIZE.hit, minWidth: SIZE.hit, justifyContent: 'center', alignItems: icon ? 'center' : undefined }}>{icon ? <Icon name={icon} color={th.accent} size={SIZE.icon} /> : <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.4} /* nagłówek nawigacji — jak dotąd w edycji sesji */ style={{ color: th.accent, ...font('button'), ...(bold ? FW.semibold : FW.regular) }}>{title}</Text>}</Pressable>;
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
  Alert.alert(t('Odrzucić zmiany?'), message, [backToEditButton(), { text: t('Odrzuć zmiany'), style: 'destructive', onPress: () => { if (same()) discard(); } }]);
}
