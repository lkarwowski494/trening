import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, Linking, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, H1, Muted, Btn, SectionTitle } from '@/components/ui';
import { useTheme, F, TEXT_SCALE_MAX } from '@/lib/theme';
import { t, tp, lang } from '@/lib/i18n';
import { fmtDate } from '@/lib/store';
import { entitlementActive, type EntitlementPlan } from '@/lib/access';
import { PLAN_ORDER, PRIVACY_URL, TERMS_URL, isFakeStoreBuild } from '@/lib/products';
import { getStoreAdapter, type StoreProduct } from '@/lib/store-adapter';
import type { FakeStoreControl } from '@/lib/store-fake';
import { useAccess, purchasePlan, restorePurchases, paywallConfig, refreshEntitlements, nextMonthDay } from '@/lib/entitlement';

/*
 * Ekran zakupu (docs/27 rozdz. 5, wydanie 0.17.0): ceny wyłącznie z App Store (displayPrice), „1 miesiąc za darmo, potem {cena}/{okres}” tylko dla osób
 * uprawnionych do próby, „Przywróć zakupy”, linki Prywatność + Warunki (standardowa licencja Apple, P9 A). Stany: ładowanie, brak sieci, błąd, zakupione.
 * Dostęp z Ustawień → „Subskrypcja” (tylko gdy PAYWALL.ENABLED) oraz automatycznie przy starcie treningu ponad limit (reason=limit) i raz po pierwszym treningu
 * (reason=first, P2 B). Żadna akcja tego ekranu nie zmienia treningów ani danych użytkownika.
 */
export const planName = (p: EntitlementPlan): string => (p === 'yearly' ? t('Rocznie') : p === 'monthly' ? t('Miesięcznie') : t('Na zawsze'));
const periodWord = (p: StoreProduct['period']): string => (p === 'year' ? t('rok') : t('miesiąc'));
/** Wiersz ceny planu: z miesiącem za darmo (osoba uprawniona do próby), sama cena okresowa albo cena jednorazowa. */
export function priceLine(p: StoreProduct): string {
  if (p.period === null) return t('{price} jednorazowo', { price: p.displayPrice });
  return p.trial ? t('1 miesiąc za darmo, potem {price}/{period}', { price: p.displayPrice, period: periodWord(p.period) }) : t('{price}/{period}', { price: p.displayPrice, period: periodWord(p.period) });
}
const ctaLabel = (p: StoreProduct): string => (p.period === null ? t('Kup na zawsze') : p.trial ? t('Zacznij miesiąc za darmo') : t('Subskrybuj'));

export default function PaywallScreen() {
  const th = useTheme(); const router = useRouter(); const { reason } = useLocalSearchParams<{ reason?: string }>(); const view = useAccess();
  const [products, setProducts] = useState<StoreProduct[] | 'loading' | 'unavailable'>('loading'); const [sel, setSel] = useState<EntitlementPlan>('yearly');
  const [busy, setBusy] = useState(false); const [note, setNote] = useState<string | null>(null);
  const load = useCallback(() => { setProducts('loading'); getStoreAdapter().getProducts().then(p => { setProducts(p); }).catch(() => setProducts('unavailable')); }, []);
  useEffect(load, [load]);
  useEffect(() => { if (Array.isArray(products) && products.length && !products.some(p => p.plan === sel)) setSel(products[0].plan); }, [products, sel]);
  const open = (url: string) => { Linking.openURL(url).catch(() => {}); };
  const lifetime = view.active?.plan === 'lifetime'; const subActive = (view.entitlements ?? []).some(e => e.plan !== 'lifetime' && entitlementActive(e, Date.now()));
  const chosen = Array.isArray(products) ? products.find(p => p.plan === sel) : undefined;
  const buy = async () => {
    if (!chosen || busy) return; setBusy(true); setNote(null);
    try {
      const r = await purchasePlan(chosen.plan);
      if (r.status === 'pending') setNote(t('Czeka na zgodę organizatora rodziny.'));
      else if (r.status === 'error') Alert.alert(t('Nie udało się'), t('Spróbuj ponownie.'));
    } finally { setBusy(false); }
  };
  const restore = async () => {
    if (busy) return; setBusy(true); setNote(null);
    try { const r = await restorePurchases(); setNote(r === 'restored' ? t('Przywrócono zakupy.') : r === 'none' ? t('Nie znaleziono zakupów dla tego konta Apple.') : t('Nie udało się przywrócić zakupów. Sprawdź połączenie z internetem.')); } finally { setBusy(false); }
  };
  const store = async (fn: () => Promise<void>) => { try { await fn(); } catch { setNote(t('Potrzebne połączenie z internetem.')); } };
  const cfg = paywallConfig();
  const fake = isFakeStoreBuild() ? (getStoreAdapter() as unknown as FakeStoreControl) : null;
  return (
    <Screen><ScrollView testID="paywall-scroll" contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <H1>{t('Pełna wersja')}</H1>
      {reason === 'limit' && view.decision.resetsAt ? <Text testID="paywall-limit" accessibilityRole="header" accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, fontFamily: F.semibold, fontSize: 16, marginTop: 8 }}>{t('Wykorzystano limit darmowych treningów w tym miesiącu ({n}). Kolejne od {date}.', { n: view.decision.limit, date: fmtDate(nextMonthDay()) })}</Text> : null}
      <Muted style={{ marginTop: 8, marginBottom: 12 }}>{t('Treningi bez limitu. Bez reklam. Wszystko zostaje na Twoim telefonie.')}</Muted>

      {view.active ? <View testID="paywall-owned" accessible accessibilityLanguage={lang()} style={{ borderWidth: 1, borderColor: th.line, borderRadius: 12, padding: 12, gap: 4, marginBottom: 12, backgroundColor: th.surface }}>
        <Text accessibilityRole="header" maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, fontFamily: F.heavy, fontSize: 17 }}>{lifetime ? t('Masz dostęp na zawsze') : t('Masz pełną wersję')}</Text>
        {view.active.source === 'family' ? <Muted>{t('Dostęp z Chmury rodzinnej')}</Muted> : null}
        {!lifetime && view.active.expiresAt != null ? <Muted>{view.active.trial ? t('Okres próbny do {date}', { date: fmtDate(view.active.expiresAt) }) : view.active.source === 'code' ? t('Dostęp z kodu do {date}', { date: fmtDate(view.active.expiresAt) }) : t('Dostęp do {date}', { date: fmtDate(view.active.expiresAt) })}</Muted> : null}
        {lifetime && subActive ? <Muted>{t('Twoja subskrypcja nadal się odnawia — anuluj ją, żeby nie płacić podwójnie.')}</Muted> : null}
        {!lifetime || subActive ? <Btn small title={t('Zarządzaj subskrypcją')} style={{ alignSelf: 'flex-start', marginTop: 6 }} onPress={() => { void store(() => getStoreAdapter().manageSubscriptions()); }} /> : null}
      </View> : null}

      {!lifetime ? <>
        {products === 'loading' ? <View testID="paywall-loading" accessible accessibilityLabel={t('Ładowanie cen…')} accessibilityLanguage={lang()} style={{ paddingVertical: 20, alignItems: 'center', gap: 8 }}><ActivityIndicator color={th.accent} /><Muted>{t('Ładowanie cen…')}</Muted></View> : null}
        {products === 'unavailable' ? <View testID="paywall-offline" style={{ gap: 8, paddingVertical: 8 }}><Muted>{t('Ceny są niedostępne bez połączenia z internetem.')}</Muted><Btn small title={t('Spróbuj ponownie')} style={{ alignSelf: 'flex-start' }} onPress={load} /></View> : null}
        {Array.isArray(products) && !products.length ? <View testID="paywall-empty" style={{ gap: 8, paddingVertical: 8 }}><Muted>{t('Ceny są niedostępne bez połączenia z internetem.')}</Muted><Btn small title={t('Spróbuj ponownie')} style={{ alignSelf: 'flex-start' }} onPress={load} /></View> : null}
        {Array.isArray(products) ? PLAN_ORDER.map(plan => products.find(p => p.plan === plan)).filter((p): p is StoreProduct => !!p).map(p => {
          const on = p.plan === sel; const line = priceLine(p);
          return <Pressable key={p.plan} testID={`plan-${p.plan}`} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLanguage={lang()} accessibilityLabel={`${planName(p.plan)}, ${line}`} onPress={() => setSel(p.plan)}
            style={{ borderWidth: on ? 2 : 1, borderColor: on ? th.accent : th.line, borderRadius: 12, padding: 12, marginBottom: 8, backgroundColor: th.surface, minHeight: 56 }}>
            <Text maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, fontFamily: F.semibold, fontSize: 14 }}>{planName(p.plan)}</Text>
            <Text maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, fontFamily: F.heavy, fontSize: 18 }}>{line}</Text>
          </Pressable>; }) : null}
        {chosen ? <Btn kind="primary" block title={ctaLabel(chosen)} style={{ marginTop: 4 }} onPress={() => { void buy(); }} /> : null}
        {chosen && chosen.period !== null ? <Muted style={{ fontSize: 13, marginTop: 8 }}>{t('Subskrypcja odnawia się automatycznie, dopóki jej nie anulujesz w ustawieniach konta Apple.')}</Muted> : null}
      </> : null}

      {note ? <Text testID="paywall-note" accessibilityLiveRegion="polite" accessibilityLanguage={lang()} style={{ color: th.text, marginTop: 10 }}>{note}</Text> : null}
      <Muted style={{ fontSize: 13, marginTop: 12 }}>{t('Bez zakupu: {n} {s} na żywo w miesiącu; historia, kopia zapasowa i eksport są zawsze dostępne.', { n: cfg.FREE_LIVE_PER_MONTH, s: tp(cfg.FREE_LIVE_PER_MONTH, 'trening|treningi|treningów') })}</Muted>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        <Btn small title={t('Przywróć zakupy')} onPress={() => { void restore(); }} />
        <Btn small title={t('Zrealizuj kod')} onPress={() => { void store(() => getStoreAdapter().redeemCode().then(() => refreshEntitlements())); }} />
      </View>
      <Muted style={{ fontSize: 13, marginTop: 8 }}>{t('Zakupy są przypisane do konta Apple. Treningi przywrócisz z kopii zapasowej.')}</Muted>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {TERMS_URL ? <Btn small kind="ghost" title={t('Warunki korzystania')} accessibilityHint={t('Otwiera stronę w przeglądarce.')} onPress={() => open(TERMS_URL!)} /> : null}
        <Btn small kind="ghost" title={t('Prywatność')} accessibilityHint={t('Otwiera stronę w przeglądarce.')} onPress={() => open(PRIVACY_URL)} />
      </View>
      {reason === 'limit' ? <View style={{ gap: 8, marginTop: 14 }}>
        <Btn nav title={t('Dopisz trening wstecz')} onPress={() => router.replace('/history/add')} />
        <Btn kind="ghost" title={t('Nie teraz')} onPress={() => router.back()} />
      </View> : reason === 'first' ? <Btn kind="ghost" title={t('Nie teraz')} style={{ marginTop: 14 }} onPress={() => router.back()} /> : null}

      {fake ? <View testID="fake-store-panel" style={{ marginTop: 24, gap: 8 }}>{/* tylko build E2E (EXPO_PUBLIC_STORE_FAKE=1) — sterowanie sztucznym sklepem w Maestro; bez t(), nie trafia do TestFlight */}
        <SectionTitle>Test store</SectionTitle>
        <Btn small title="Test store: expire access" onPress={() => fake.setEntitlements([])} />
        <Btn small title="Test store: go offline" onPress={() => { fake.offline = true; load(); }} />
        <Btn small title="Test store: go online" onPress={() => { fake.offline = false; load(); }} />
      </View> : null}
    </ScrollView></Screen>
  );
}
