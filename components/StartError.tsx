import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useTheme, FW } from '@/lib/theme';
import { t, lang, appName } from '@/lib/i18n';
import { exportStartDataDetailed } from '@/lib/backup';
import { openSupportMail } from '@/lib/support';

const DIAG_FONT = 12; /* kod diagnostyczny pod komunikatem — mniejszy od treści, bez tokenów (ekran nie zależy od motywu) */

/*
 * Ekran zastępczy, gdy aplikacja nie może przejść dalej (M1-audytor-generalny-003 i 004): błąd startu (baza się nie otwiera, wyjątek po wczytaniu danych),
 * pętla awarii (lib/state/crashguard.ts) i wyjątek przy rysowaniu ekranu (ErrorBoundary w app/_layout.tsx). Nie zależy od wczytanego stanu (store może być
 * niezainicjowany). Akcje: „Wyślij dane” (surowe dane z bazy albo, gdy bazy nie da się otworzyć, najnowsza kopia z Plików → Backup), „Spróbuj ponownie”
 * i „Napisz do nas”; żadna z nich nie zmienia bazy (wysyłanie tylko czyta).
 */
export function StartError({ title, message, detail, diag, onRetry }: { title: string; message?: string; detail?: string; /** ZK-07: kod diagnostyczny ostatniego startu (lib/state/bootphase.ts), bez tłumaczenia i bez danych osobowych */ diag?: string; onRetry: () => void }) {
  const th = useTheme();
  const fail = () => Alert.alert(t('Nie udało się wysłać danych'), t('Spróbuj ponownie.'));
  /* M1-audytor-generalny-004: przy bazie, która się nie otwiera, komplet plików bazy trafia do folderu w Plikach — ekran podaje, gdzie go szukać */
  const send = () => { exportStartDataDetailed().then(r => { if (!r.ok) fail(); else if (r.rescue) Alert.alert(t('Kopia bazy w Plikach'), t('Pliki → Na moim iPhonie → {app} → Backup → {folder}. Zapisz ten folder poza telefonem.', { app: appName(), folder: r.rescue })); }).catch(fail); };
  const link = (label: string, onPress: () => void) => (
    <Pressable accessibilityLanguage={lang()} accessibilityRole="button" onPress={onPress} style={{ padding: 12 }}>
      <Text accessibilityLanguage={lang()} style={{ color: th.accent, fontSize: 16, ...FW.semibold }}>{label}</Text>
    </Pressable>);
  return (
    <View testID="start-error" style={{ flex: 1, backgroundColor: th.bg, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }}>
      <Text accessibilityLanguage={lang()} accessibilityRole="header" style={{ color: th.text, fontSize: 17, textAlign: 'center' }}>{title}</Text>
      {message ? <Text accessibilityLanguage={lang()} style={{ color: th.muted, textAlign: 'center' }}>{message}</Text> : null}
      {detail ? <Text accessibilityLanguage={lang()} style={{ color: th.muted, textAlign: 'center' }}>{detail}</Text> : null}
      {diag ? <Text testID="start-error-diag" selectable accessibilityLanguage="en" style={{ color: th.muted, textAlign: 'center', fontSize: DIAG_FONT }}>{diag}</Text> : null}
      <Text accessibilityLanguage={lang()} style={{ color: th.muted, textAlign: 'center', fontSize: 13 }}>{t('Automatyczna kopia po każdym treningu: Pliki → Na moim iPhonie → {app} → Backup.', { app: appName() })}</Text>
      <Text testID="start-error-warning" accessibilityLanguage={lang()} style={{ color: th.text, textAlign: 'center', fontSize: 16, ...FW.semibold }}>{t('Nie usuwaj aplikacji — razem z nią znikną dane i kopie. Najpierw stuknij „Wyślij dane” i zapisz plik poza telefonem.')}</Text>
      {link(t('Wyślij dane'), send)}
      {link(t('Spróbuj ponownie'), onRetry)}
      {link(t('Napisz do nas'), () => openSupportMail('feedback', undefined, [diag, detail].filter(Boolean).join(' · ') || undefined))}{/* M1-audytor-generalny-032: kod etapu i treść błędu w treści wiadomości */}
    </View>
  );
}
