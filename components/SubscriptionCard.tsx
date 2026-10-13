import React from 'react';
import { useRouter } from 'expo-router';
import { SectionTitle, Item } from '@/components/ui';
import { t } from '@/lib/i18n';
import { useAccess } from '@/lib/entitlement';
import { fmtDate } from '@/lib/store';

/** Karta „Subskrypcja” w Ustawieniach (docs/27, 0.17.0): stan dostępu i wejście na ekran zakupu. Montowana tylko przy PAYWALL.ENABLED (app/more/settings.tsx). */
export function SubscriptionCard() {
  const router = useRouter(); const v = useAccess(); const a = v.active;
  const sub = v.level === 'full'
    ? (a?.plan === 'lifetime' ? t('Masz dostęp na zawsze') : a?.expiresAt != null ? (a.trial ? t('Okres próbny do {date}', { date: fmtDate(a.expiresAt) }) : t('Dostęp do {date}', { date: fmtDate(a.expiresAt) })) : t('Masz pełną wersję'))
    : t('Darmowe treningi w tym miesiącu: {n} z {limit}', { n: v.decision.used, limit: v.decision.limit });
  return <>
    <SectionTitle>{t('Subskrypcja')}</SectionTitle>
    <Item title={t('Pełna wersja')} sub={sub} accessibilityLabel={`${t('Pełna wersja')}. ${sub}`} onPress={() => router.push('/paywall?reason=settings')} />
  </>;
}
