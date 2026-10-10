import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { Screen, Item, Muted, SectionTitle } from '@/components/ui';
import { LICENSES } from '@/lib/licenses.generated';
import { t, appName } from '@/lib/i18n';
import { versionLabel, BUILD_NUMBER } from '@/lib/version';

/* Audyt 0.10 SEC-08: Więcej → O aplikacji — wersja i licencje open source (lista generowana skryptem scripts/licenses.mjs). */
export default function AboutScreen() {
  const router = useRouter();
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <SectionTitle>{appName()}</SectionTitle>
      <Item title={t('Wersja')} sub={versionLabel(Constants.expoConfig?.version, BUILD_NUMBER) /* „0.11.0 (1005)” — numerowanie wersji, 09.10.2026 */} />
      <Muted style={{ fontSize: 13, marginVertical: 10 }}>{t('Aplikacja nie zbiera danych: wszystko, co wpisujesz, zostaje w telefonie, bez konta, reklam i analityki.')}</Muted>
      <Item title={t('Licencje open source')} sub={t('Pakiety open source: {n}', { n: LICENSES.length })} onPress={() => router.push('/more/licenses')} />
    </ScrollView></Screen>
  );
}
