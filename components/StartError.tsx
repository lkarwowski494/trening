import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useTheme, F } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';
import { exportRawData } from '@/lib/backup';

/*
 * Ekran zastępczy, gdy aplikacja nie może przejść dalej (M1-audytor-generalny-003 i 004): błąd startu (baza się nie otwiera, wyjątek po wczytaniu danych),
 * pętla awarii (lib/state/crashguard.ts) i wyjątek przy rysowaniu ekranu (ErrorBoundary w app/_layout.tsx). Nie zależy od wczytanego stanu (store może być
 * niezainicjowany). Akcje: „Wyślij dane” (surowe dane z bazy) i „Spróbuj ponownie”;
 * żadna z nich nie zmienia bazy (wysyłanie tylko czyta).
 */
export function StartError({ title, message, detail, onRetry }: { title: string; message?: string; detail?: string; onRetry: () => void }) {
  const th = useTheme();
  const send = () => { exportRawData().then(ok => { if (!ok) Alert.alert(t('Nie udało się wysłać danych'), t('Spróbuj ponownie.')); }).catch(() => { Alert.alert(t('Nie udało się wysłać danych'), t('Spróbuj ponownie.')); }); };
  const link = (label: string, onPress: () => void) => (
    <Pressable accessibilityLanguage={lang()} accessibilityRole="button" onPress={onPress} style={{ padding: 12 }}>
      <Text accessibilityLanguage={lang()} style={{ color: th.accent, fontSize: 16, fontFamily: F.semibold }}>{label}</Text>
    </Pressable>);
  return (
    <View testID="start-error" style={{ flex: 1, backgroundColor: th.bg, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }}>
      <Text accessibilityLanguage={lang()} accessibilityRole="header" style={{ color: th.text, fontSize: 17, textAlign: 'center' }}>{title}</Text>
      {message ? <Text accessibilityLanguage={lang()} style={{ color: th.muted, textAlign: 'center' }}>{message}</Text> : null}
      {detail ? <Text accessibilityLanguage={lang()} style={{ color: th.muted, textAlign: 'center' }}>{detail}</Text> : null}
      {link(t('Wyślij dane'), send)}
      {link(t('Spróbuj ponownie'), onRetry)}
    </View>
  );
}
