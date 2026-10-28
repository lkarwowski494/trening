import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Linking, ActivityIndicator, Alert } from 'react-native';
import { ScrollView } from '@/components/Scroll';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useCloseHeader } from '@/components/CloseButton';
import { Screen, Muted, Btn, SectionTitle } from '@/components/ui';
import { useTheme, TEXT_SCALE_MAX, FW, font, RADIUS } from '@/lib/theme';
import { t, lang, appName } from '@/lib/i18n';
import { fmtDate } from '@/lib/store';
import { PAYWALL, entitlementActive, type EntitlementPlan } from '@/lib/access';
import { PLAN_ORDER, SUBSCRIPTION_PLANS, PRIVACY_URL, TERMS_URL, isFakeStoreBuild } from '@/lib/products';
import { getStoreAdapter, type StoreProduct } from '@/lib/store-adapter';
import type { FakeStoreControl } from '@/lib/store-fake';
import { useAccess, purchasePlan, restorePurchases, refreshEntitlements, nextMonthDay } from '@/lib/entitlement';
import { useAnnounce } from '@/lib/announce';
import { planName, ownedPlanTitle } from '@/components/SubscriptionCard';

/*
 * Ekran zakupu (docs/27 rozdz. 5; M5 S1, decyzja właściciela 22.10.2026): ceny wyłącznie z App Store (displayPrice), „{cena}/{okres}” albo „{cena} jednorazowo”,
 * „Przywróć zakupy”, linki Prywatność + Warunki (standardowa licencja Apple, P9 A), ujawnienia 3.1.2(a). Bez oferty wprowadzającej (okresu próbnego) i bez
 * liczb w opisach planów. Stany: ładowanie, brak sieci, błąd, zakupione. Dostęp z Ustawień → „Subskrypcja” (tylko gdy PAYWALL.ENABLED) oraz automatycznie
 * przy starcie treningu ponad limit dni (reason=limit); nie pokazuje się samoczynnie w żadnym innym miejscu. Żadna akcja tego ekranu nie zmienia danych.
 */
/** Nazwy planów (propozycja do przeglądu właściciela 22.10.2026; EN z docs/18) — jedno miejsce w components/SubscriptionCard.tsx (też tytuł wiersza w Ustawieniach, M1-037 A). */
export { planName };
/** Opis planu: co się dostaje, bez liczb, procentów i porównań cen. */
export const planBlurb = (p: EntitlementPlan): string => (p === 'yearly' ? t('Cały rok treningów, rozliczany rocznie.') : p === 'monthly' ? t('Płacisz co miesiąc i kończysz, kiedy chcesz.') : t('Płacisz raz i masz na zawsze.'));
const periodWord = (p: StoreProduct['period']): string => (p === 'year' ? t('rok') : t('miesiąc'));
/** Wiersz ceny planu: cena okresowa albo cena jednorazowa (cena za okres jest najwyraźniejszym elementem — 3.1.2(a)). */
export function priceLine(p: StoreProduct): string {
  return p.period === null ? t('{price} jednorazowo', { price: p.displayPrice }) : t('{price}/{period}', { price: p.displayPrice, period: periodWord(p.period) });
}
/** Przycisk zakupu: dożywotni „Kup na zawsze”; subskrypcja „Subskrybuj”, a gdy osoba ma już subskrypcję — „Przejdź na ten plan” (Apple pokazuje wtedy arkusz zmiany planu;
 *  „Zmień plan” to przełącznik zwiniętej listy — DEC-09 a, 27.10.2026 — więc zakup ma inną etykietę, żeby VoiceOver nie czytał dwóch przycisków o tej samej nazwie). */
const ctaLabel = (p: StoreProduct, hasSub: boolean): string => (p.period === null ? t('Kup na zawsze') : hasSub ? t('Przejdź na ten plan') : t('Subskrybuj'));

export default function PaywallScreen() {
  const th = useTheme(); const router = useRouter(); const headerOpts = useCloseHeader(); /* zasada 13.10.2026: „Zamknij” w nagłówku zawsze (także reason=settings); „Nie teraz” na dole zostaje */ const { reason } = useLocalSearchParams<{ reason?: string }>(); const view = useAccess();
  const [products, setProducts] = useState<StoreProduct[] | 'loading' | 'unavailable'>('loading'); const [sel, setSel] = useState<EntitlementPlan>('yearly');
  const scrollRef = useRef<ScrollView>(null); const [busy, setBusy] = useState(false); const [note, setNote] = useState<string | null>(null);
  /* DEC-09 a (27.10.2026): przy aktywnym planie lista planów zwinięta pod „Zmień plan” (wzorzec 20 docs/32; stan niezapamiętywany — każde wejście zaczyna od zwiniętej) */
  const [plansOpen, setPlansOpen] = useState(false);
  const load = useCallback(() => { setProducts('loading'); getStoreAdapter().getProducts().then(p => { setProducts(p); }).catch(() => setProducts('unavailable')); }, []);
  useEffect(load, [load]);
  /* Plany, które osoba już ma (aktywne uprawnienia): nie do kupienia drugi raz — Apple pokazałby „Już to subskrybujesz”; zaznaczenie przeskakuje na pierwszy plan do wyboru wg PLAN_ORDER */
  const ownedPlans = new Set<EntitlementPlan>((view.entitlements ?? []).filter(e => entitlementActive(e, Date.now())).map(e => e.plan));
  const ownedKey = [...ownedPlans].sort().join(',');
  useEffect(() => {
    if (!Array.isArray(products) || !products.length) return;
    if (products.some(p => p.plan === sel) && !ownedPlans.has(sel)) return;
    const next = PLAN_ORDER.find(pl => products.some(p => p.plan === pl) && !ownedPlans.has(pl)); if (next) setSel(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, sel, ownedKey]);
  const open = (url: string) => { Linking.openURL(url).catch(() => {}); };
  const lifetime = view.active?.plan === 'lifetime'; const subActive = (view.entitlements ?? []).some(e => e.plan !== 'lifetime' && entitlementActive(e, Date.now()));
  const chosen = Array.isArray(products) ? products.find(p => p.plan === sel && !ownedPlans.has(p.plan)) : undefined; const hasSub = SUBSCRIPTION_PLANS.some(p => ownedPlans.has(p));
  /* M1-audytor-generalny-001 (docs/27 3.11): subskrypcja, za którą osoba płaci sama, odnawia się dalej po zakupie dożywotniego — uwaga przed arkuszem Apple, nie dopiero po zakupie;
   * także z kodu promocyjnego (po promocji odnawia się płatnie; decyzja 5a, 28.10.2026), bez Chmury rodzinnej (płaci organizator) */
  const paysSub = (view.entitlements ?? []).some(e => e.plan !== 'lifetime' && e.source !== 'family' && entitlementActive(e, Date.now()));
  const buy = async () => {
    if (!chosen || busy || ownedPlans.has(chosen.plan)) return; setBusy(true); setNote(null);
    try {
      const r = await purchasePlan(chosen.plan);
      if (r.status === 'success') { setPlansOpen(false); scrollRef.current?.scrollTo({ y: 0, animated: false }); } /* karta „Masz plan: X” jest na górze; lista planów zwija się z powrotem; zakup robi się na dole długiego ekranu — bez przewinięcia nic się nie zmienia w polu widzenia (E2E 39825973624) */
      if (r.status === 'pending') setNote(t('Czeka na zgodę organizatora rodziny.'));
      else if (r.status === 'error') Alert.alert(t('Nie udało się dokończyć zakupu'), t('Spróbuj ponownie.'));
    } finally { setBusy(false); }
  };
  const restore = async () => {
    if (busy) return; setBusy(true); setNote(null);
    try { const r = await restorePurchases(); setNote(r === 'restored' ? t('Przywrócono zakupy.') : r === 'none' ? t('Nie znaleziono zakupów dla tego konta Apple.') : t('Nie udało się przywrócić zakupów. Sprawdź połączenie z internetem.')); } finally { setBusy(false); }
  };
  const store = async (fn: () => Promise<void>) => { try { await fn(); } catch { setNote(t('Potrzebne połączenie z internetem.')); } };
  useAnnounce(note); /* teksty o limicie czytają stałą produktu (PAYWALL), nie konfigurację buildu E2E (limit 0) */
  const fake = isFakeStoreBuild() ? (getStoreAdapter() as unknown as FakeStoreControl) : null;
  return (
    <Screen><Stack.Screen options={headerOpts} /><ScrollView ref={scrollRef} testID="paywall-scroll" contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      {view.active ? null : reason === 'limit' && view.decision.resetsAt ? <View testID="paywall-limit" style={{ marginTop: 8, marginBottom: 12, gap: 6 }}>{/* wariant B (decyzja właściciela 22.10.2026): pochwała, jawny limit, kim jest autor, kiedy wracają dni */}
        <Text accessibilityRole="header" accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('sectionTitle') }}>{t('Jesteśmy z Ciebie dumni!')}</Text>
        <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('body'), ...FW.semibold }}>{t('W tym miesiącu ciężko trenujesz i wykorzystujesz wszystkie darmowe dni treningowe ({n}). Dobra robota!', { n: PAYWALL.FREE_TRAINING_DAYS_PER_MONTH })}</Text>
        <Muted>{t('{app} tworzy niezależny deweloper: bez reklam, bez zbierania danych. Jeśli Ci pomaga, wybierz plan i trenuj bez limitu. Darmowe dni wracają {date}.', { app: appName(), date: fmtDate(nextMonthDay()) })}</Muted>
      </View> : <Text testID="paywall-headline" accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('body'), ...FW.semibold, marginTop: 8, marginBottom: 12 }}>{t('Trenuj {n} dni w miesiącu za darmo. Pro zdejmuje limit. Anulujesz w ustawieniach konta Apple, kiedy zechcesz.', { n: PAYWALL.FREE_TRAINING_DAYS_PER_MONTH })}</Text>}

      {view.active ? <View testID="paywall-owned" style={{ borderWidth: 1, borderColor: th.line, borderRadius: RADIUS.group, padding: 12, gap: 4, marginBottom: 12, backgroundColor: th.surface }}>
        {/* DEC-09 a (27.10.2026): nagłówek nazywa posiadany plan zamiast ogólnego „Masz pełną wersję”; rodzaj planu, nie nazwa z wyboru (1A, właściciel 28.10.2026).
            DEC-11 a (28.10.2026, M1-audytor-generalny-039): karta NIE jest grupą `accessible` — iOS chowa potomków grupy przed VoiceOver i XCTest, a „Zarządzaj subskrypcją” musi być
            osobnym przyciskiem; nagłówek, dopiski i przycisk to kolejne elementy w kolejności wizualnej (strażnik S19, tests/interaction-guards.test.ts) */}
        <Text testID="paywall-owned-title" accessibilityRole="header" accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('sectionTitle') }}>{ownedPlanTitle(view.active.plan)}</Text>
        {lifetime ? <Muted>{t('Masz dostęp na zawsze')}</Muted> : null}
        {view.active.source === 'family' ? <Muted>{t('Dostęp z Chmury rodzinnej')}</Muted> : null}
        {!lifetime && view.active.expiresAt != null ? <Muted>{view.active.source === 'code' ? t('Dostęp z kodu do {date}', { date: fmtDate(view.active.expiresAt) }) : t('Dostęp do {date}', { date: fmtDate(view.active.expiresAt) })}</Muted> : null}
        {lifetime && subActive ? <Muted>{t('Twoja subskrypcja nadal się odnawia — anuluj ją, żeby nie płacić podwójnie.')}</Muted> : null}
        {!lifetime || subActive ? <Btn small testID="paywall-manage" title={t('Zarządzaj subskrypcją')} style={{ alignSelf: 'flex-start', marginTop: 6 }} onPress={() => { void store(() => getStoreAdapter().manageSubscriptions().then(() => refreshEntitlements())); /* M1-audytor-generalny-016: zmiana w arkuszu widoczna od razu */ }} /> : null}
      </View> : null}

      {!lifetime && view.active ? <Btn small testID="paywall-change-plan" expanded={plansOpen} title={t('Zmień plan')} style={{ alignSelf: 'flex-start', marginBottom: 8 }} onPress={() => setPlansOpen(o => !o)} /> : null}
      {!lifetime && (!view.active || plansOpen) ? <>
        {products === 'loading' ? <View testID="paywall-loading" accessible accessibilityLabel={t('Ładowanie cen…')} accessibilityLanguage={lang()} style={{ paddingVertical: 20, alignItems: 'center', gap: 8 }}><ActivityIndicator color={th.accent} /><Muted>{t('Ładowanie cen…')}</Muted></View> : null}
        {products === 'unavailable' ? <View testID="paywall-offline" style={{ gap: 8, paddingVertical: 8 }}><Muted>{t('Ceny są niedostępne bez połączenia z internetem.')}</Muted><Btn small title={t('Spróbuj ponownie')} style={{ alignSelf: 'flex-start' }} onPress={load} /></View> : null}
        {Array.isArray(products) && !products.length ? <View testID="paywall-empty" style={{ gap: 8, paddingVertical: 8 }}><Muted>{t('Sklep chwilowo niedostępny')}</Muted><Btn small title={t('Spróbuj ponownie')} style={{ alignSelf: 'flex-start' }} onPress={load} /></View> : null}
        {Array.isArray(products) ? PLAN_ORDER.map(plan => products.find(p => p.plan === plan)).filter((p): p is StoreProduct => !!p).map(p => {
          const own = ownedPlans.has(p.plan); const on = !own && p.plan === sel; const line = priceLine(p);
          return <Pressable key={p.plan} testID={`plan-${p.plan}`} accessibilityRole="radio" disabled={own} accessibilityState={{ selected: on, disabled: own }} accessibilityLanguage={lang()} accessibilityLabel={`${planName(p.plan)}, ${line}. ${planBlurb(p.plan)}${own ? `. ${t('Aktualny plan')}` : ''}`} onPress={() => setSel(p.plan)}
            style={{ borderWidth: on ? 2 : 1, borderColor: on ? th.accent : th.line, borderRadius: RADIUS.group, padding: 12, marginBottom: 8, backgroundColor: th.surface, minHeight: 56 /* M1-044 (A11-16): posiadany plan bez przezroczystości — stan niesie „Aktualny plan” i brak ramki wyboru */ }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 8 }}>
              <Text maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, ...font('callout'), ...FW.semibold }}>{planName(p.plan)}</Text>
              {own ? <Text testID={`plan-${p.plan}-own`} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.accent, ...font('footnote'), ...FW.semibold }}>{t('Aktualny plan')}</Text> : null}
            </View>
            <Text maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('sectionTitle') }}>{line}</Text>
            <Text maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, ...font('footnote'), marginTop: 2 }}>{planBlurb(p.plan)}</Text>
          </Pressable>; }) : null}
        {chosen?.period === null && paysSub ? <Muted testID="paywall-lifetime-warning" style={{ marginBottom: 8 }}>{t('Twoja subskrypcja nadal się odnawia — anuluj ją, żeby nie płacić podwójnie.')}</Muted> : null}
        {chosen ? <Btn testID="paywall-buy" kind="primary" block title={ctaLabel(chosen, hasSub)} style={{ marginTop: 4 }} onPress={() => { void buy(); }} /> : null}
        {chosen && chosen.period !== null ? <Muted style={{ ...font('footnote'), marginTop: 8 }}>{t('Subskrypcja odnawia się automatycznie, dopóki jej nie anulujesz w ustawieniach konta Apple.')}</Muted> : null}
      </> : null}

      {note ? <Text testID="paywall-note" accessibilityLanguage={lang()} style={{ color: th.text, marginTop: 10 }}>{note}</Text> : null}
      {view.active ? null : <Muted style={{ ...font('footnote'), marginTop: 12 }}>{t('Bez zakupu: do {n} dni treningowych w miesiącu; historia, kopia i eksport zawsze dostępne.', { n: PAYWALL.FREE_TRAINING_DAYS_PER_MONTH })}</Muted>}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        <Btn small title={t('Przywróć zakupy')} onPress={() => { void restore(); }} />
        <Btn small title={t('Zrealizuj kod')} onPress={() => { void store(() => getStoreAdapter().redeemCode().then(() => refreshEntitlements())); }} />
      </View>
      <Muted style={{ ...font('footnote'), marginTop: 8 }}>{t('Zakupy są przypisane do konta Apple. Treningi przywrócisz z kopii zapasowej.')}</Muted>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {TERMS_URL ? <Btn small kind="ghost" title={t('Warunki korzystania')} accessibilityHint={t('Otwiera stronę w przeglądarce.')} onPress={() => open(TERMS_URL!)} /> : null}
        <Btn small kind="ghost" title={t('Prywatność')} accessibilityHint={t('Otwiera stronę w przeglądarce.')} onPress={() => open(PRIVACY_URL)} />
      </View>
      {reason === 'limit' ? <View style={{ gap: 8, marginTop: 14 }}>
        <Btn nav title={t('Dopisz trening wstecz')} onPress={() => router.replace('/history/add')} />
        <Btn kind="ghost" title={t('Nie teraz')} onPress={() => router.back()} />
      </View> : null}

      {fake ? <View testID="fake-store-panel" style={{ marginTop: 24, gap: 8 }}>{/* tylko build E2E (EXPO_PUBLIC_STORE_FAKE=1) — sterowanie sztucznym sklepem w Maestro; bez t(), nie trafia do TestFlight */}
        <SectionTitle>Test store</SectionTitle>
        <Btn small title="Test store: expire access" onPress={() => fake.setEntitlements([{ plan: 'monthly', source: 'purchase', expiresAt: Date.now() }])} />{/* wygasa „teraz”: treningi sprzed tej chwili nie liczą się do limitu (P3 B) */}
        <Btn small title="Test store: go offline" onPress={() => { fake.offline = true; load(); }} />
        <Btn small title="Test store: go online" onPress={() => { fake.offline = false; load(); }} />
      </View> : null}
    </ScrollView></Screen>
  );
}
