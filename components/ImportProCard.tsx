import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/AppText';
import { useRouter } from 'expo-router';
import { Btn } from '@/components/ui';
import { offerAudience } from '@/lib/fairrules';
import { useAccess } from '@/lib/entitlement';
import { PAYWALL } from '@/lib/access';
import { useTheme, TEXT_SCALE_MAX, font, RADIUS } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';

/*
 * Karta po udanym imporcie CSV (1.0, decyzja właściciela 25.10.2026; docs/monetyzacja.md): tylko w stanie `free` przy włączonym PAYWALL (ta sama zasada co okno „Uczciwe zasady”,
 * lib/fairrules.ts). Informuje, że zaimportowana historia jest zawsze dostępna, i prowadzi do ekranu zakupu. Nie zmienia danych.
 */
export function ImportProCard() {
  const th = useTheme(); const router = useRouter(); useAccess(); /* odświeża kartę przy zmianie dostępu */
  if (!offerAudience()) return null;
  return (
    <View testID="import-pro-card" style={{ borderWidth: 1, borderColor: th.line, borderRadius: RADIUS.group, padding: 12, gap: 8, backgroundColor: th.surface }}>
      <Text accessibilityRole="header" accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('sectionTitle') }}>{t('Historia jest już w telefonie')}</Text>
      <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('body') }}>{t('Zaimportowane treningi, rekordy i wykresy są zawsze dostępne, także bez internetu. Trenuj {n} dni w miesiącu za darmo — Pro zdejmuje limit, także jednorazowo na zawsze.', { n: PAYWALL.FREE_TRAINING_DAYS_PER_MONTH })}</Text>
      <Btn nav testID="import-pro-plans" title={t('Zobacz plany Pro ›')} onPress={() => router.push('/paywall?reason=settings')} />
    </View>);
}
