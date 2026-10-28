import React from 'react';
import { useRouter } from 'expo-router';
import { SectionTitle, Item } from '@/components/ui';
import { t } from '@/lib/i18n';
import { useAccess } from '@/lib/entitlement';
import type { EntitlementPlan } from '@/lib/access';
import { fmtDate } from '@/lib/store';

/** Nazwa planu — jedno miejsce dla ekranu zakupu (app/paywall.tsx) i wiersza w Ustawieniach. */
export const planName = (p: EntitlementPlan): string => (p === 'yearly' ? t('Trening to część mojego tygodnia') : p === 'monthly' ? t('Szukam swojego rytmu') : t('Trening to moje życie'));
/** Tytuł stanu posiadanego planu — rodzaj planu, nie nazwa z wyboru planu (DEC-09 a + 1A, właściciel 28.10.2026: „Masz plan: roczny”); ekran zakupu i wiersz w Ustawieniach. */
export const ownedPlanTitle = (p: EntitlementPlan): string => (p === 'yearly' ? t('Masz plan: roczny') : p === 'monthly' ? t('Masz plan: miesięczny') : t('Masz plan: dożywotni'));

/** Karta „Subskrypcja” w Ustawieniach (docs/27, 0.17.0): stan dostępu i wejście na ekran zakupu. Montowana tylko przy PAYWALL.ENABLED (app/more/settings.tsx).
 * M1-037 A (DEC-07 b, 27.10.2026; T-11): tytuł wiersza zależy od stanu — darmowy: akcja „Zobacz plany Pro” (ta sama etykieta co pozostałe wejścia
 * na ekran zakupu, docs/32 wzorzec 17), z dostępem: „Masz plan: {rodzaj}” (jak nagłówek karty stanu na ekranie zakupu, DEC-09 a; rodzaj planu — 28.10.2026). */
export function SubscriptionCard() {
  const router = useRouter(); const v = useAccess(); const a = v.active;
  const title = v.level === 'full' ? (a ? ownedPlanTitle(a.plan) : t('Pełna wersja')) : t('Zobacz plany Pro');
  const sub = v.level === 'full'
    ? (a?.plan === 'lifetime' ? t('Masz dostęp na zawsze') : a?.expiresAt != null ? t('Dostęp do {date}', { date: fmtDate(a.expiresAt) }) : t('Masz pełną wersję'))
    : t('Darmowe dni treningowe w tym miesiącu: wykorzystano {n} z {limit}', { n: v.decision.used, limit: v.decision.limit });
  return <>
    <SectionTitle>{t('Subskrypcja')}</SectionTitle>
    <Item title={title} sub={sub} accessibilityLabel={`${title}. ${sub}`} onPress={() => router.push('/paywall?reason=settings')} />
  </>;
}
