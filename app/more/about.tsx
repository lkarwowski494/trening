import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { Screen, Item, Muted, SectionTitle } from '@/components/ui';
import { LICENSES } from '@/lib/licenses.generated';
import { t, appName } from '@/lib/i18n';
import { SUPPORT_EMAIL, openSupportMail, openWebPage } from '@/lib/support';
import { PRIVACY_URL, TERMS_URL } from '@/lib/products';
import { versionLabel, BUILD_NUMBER } from '@/lib/version';

/* Audyt 0.10 SEC-08: Więcej → O aplikacji — wersja i licencje open source (lista generowana skryptem scripts/licenses.mjs). */
export default function AboutScreen() {
  const router = useRouter();
  const [mailFailed, setMailFailed] = useState(false);
  /* Decyzja właściciela 13.10.2026 (docs/18) i 14.10.2026: „Napisz do nas” i „Poproś o nową funkcję” — ta sama droga (lib/support.ts openSupportMail);
   * błąd (brak poczty / odmowa) → okno z adresem (docs/32 wzorzec 14) i adres do zaznaczenia na ekranie. */
  const mail = (kind: 'feedback' | 'idea') => openSupportMail(kind, () => setMailFailed(true));
  /* Wytyczna Apple 3.1.2 (decyzja właściciela 14.10.2026, docs/18): Warunki korzystania (standardowa licencja Apple) i Prywatność także tutaj, nie tylko na ekranie zakupu. */
  const open = openWebPage;
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <SectionTitle>{appName()}</SectionTitle>
      <Item title={t('Wersja')} sub={versionLabel(Constants.expoConfig?.version, BUILD_NUMBER) /* „0.11.0 (1005)” — numerowanie wersji, 09.10.2026 */} />
      <Item title={t('Napisz do nas')} sub={SUPPORT_EMAIL} accessibilityLabel={t('Napisz do nas')} accessibilityHint={t('Otwiera aplikację Mail')} onPress={() => mail('feedback')} />
      <Item title={t('Poproś o nową funkcję')} accessibilityLabel={t('Poproś o nową funkcję')} accessibilityHint={t('Otwiera aplikację Mail')} onPress={() => mail('idea')} />
      {mailFailed ? <Muted selectable testID="support-mail-fallback" style={{ fontSize: 14, marginVertical: 10 }}>{t('Napisz na: {mail}', { mail: SUPPORT_EMAIL })}</Muted> : null}
      <Muted style={{ fontSize: 13, marginVertical: 10 }}>{t('Aplikacja nie zbiera danych: wszystko, co wpisujesz, zostaje w telefonie, bez konta, reklam i analityki.')}</Muted>
      <Item title={t('Warunki korzystania')} accessibilityLabel={t('Warunki korzystania')} accessibilityHint={t('Otwiera stronę w przeglądarce.')} onPress={() => open(TERMS_URL)} />
      <Item title={t('Prywatność')} accessibilityLabel={t('Prywatność')} accessibilityHint={t('Otwiera stronę w przeglądarce.')} onPress={() => open(PRIVACY_URL)} />
      <Item title={t('Licencje open source')} sub={t('Pakiety open source: {n}', { n: LICENSES.length })} onPress={() => router.push('/more/licenses')} />
    </ScrollView></Screen>
  );
}
