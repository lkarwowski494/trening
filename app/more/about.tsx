import React, { useState } from 'react';
import { ScrollView, Linking, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { Screen, Item, Muted, SectionTitle } from '@/components/ui';
import { LICENSES } from '@/lib/licenses.generated';
import { t, appName, lang } from '@/lib/i18n';
import { okButton } from '@/lib/confirm';
import { SUPPORT_EMAIL, buildSupportMailto } from '@/lib/support';
import { versionLabel, BUILD_NUMBER } from '@/lib/version';

/* Audyt 0.10 SEC-08: Więcej → O aplikacji — wersja i licencje open source (lista generowana skryptem scripts/licenses.mjs). */
export default function AboutScreen() {
  const router = useRouter();
  const [mailFailed, setMailFailed] = useState(false);
  /* Decyzja właściciela 13.10.2026 (docs/18): „Napisz do nas” — mailto przez Linking.openURL, bez sprawdzania wcześniej, czy poczta jest (nie trzeba LSApplicationQueriesSchemes);
   * błąd (brak poczty / odmowa) → okno z adresem (docs/32 wzorzec 14) i adres do zaznaczenia na ekranie. Treść maila: lib/support.ts (tylko stopka techniczna). */
  const writeToUs = () => {
    const url = buildSupportMailto({ version: versionLabel(Constants.expoConfig?.version, BUILD_NUMBER), os: Platform.Version, language: lang() });
    Promise.resolve().then(() => Linking.openURL(url)).catch(() => {
      setMailFailed(true);
      Alert.alert(t('Nie udało się otworzyć poczty'), t('Napisz na: {mail}', { mail: SUPPORT_EMAIL }), [okButton()]);
    });
  };
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <SectionTitle>{appName()}</SectionTitle>
      <Item title={t('Wersja')} sub={versionLabel(Constants.expoConfig?.version, BUILD_NUMBER) /* „0.11.0 (1005)” — numerowanie wersji, 09.10.2026 */} />
      <Item title={t('Napisz do nas')} sub={SUPPORT_EMAIL} accessibilityLabel={t('Napisz do nas')} accessibilityHint={t('Otwiera aplikację Mail')} onPress={writeToUs} />
      {mailFailed ? <Muted selectable testID="support-mail-fallback" style={{ fontSize: 14, marginVertical: 10 }}>{t('Napisz na: {mail}', { mail: SUPPORT_EMAIL })}</Muted> : null}
      <Muted style={{ fontSize: 13, marginVertical: 10 }}>{t('Aplikacja nie zbiera danych: wszystko, co wpisujesz, zostaje w telefonie, bez konta, reklam i analityki.')}</Muted>
      <Item title={t('Licencje open source')} sub={t('Pakiety open source: {n}', { n: LICENSES.length })} onPress={() => router.push('/more/licenses')} />
    </ScrollView></Screen>
  );
}
