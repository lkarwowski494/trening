import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Screen, H1, Item, Muted } from '@/components/ui';
import Constants from 'expo-constants';
import { getProfileExpiry } from '@/lib/signing';
import { useHistTick } from '@/lib/store';
import { t, locale, appName } from '@/lib/i18n';
import { guideProgress } from '@/lib/guide';

export default function MoreScreen() {
  const tick = useHistTick(); const router = useRouter(); const [exp, setExp] = useState<Date | null>(null);
  useEffect(() => { getProfileExpiry().then(setExp).catch(() => {}); }, [tick]); // runda 31: odświeżane po powrocie z tła
  const expTxt = exp && exp.getTime() - Date.now() < 30 * 86400e3 ? ' ' + t('Podpis ważny do {d}.', { d: `${exp.toLocaleDateString(locale(), { day: 'numeric', month: 'short' })} ${exp.toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' })}` }) : '';
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}><Screen>
      <View style={{ marginVertical: 10 }}><H1>{t('Więcej')}</H1></View>
      <Item title={t('Przewodnik')} sub={(p => t('Przeczytane: {n} z {m}', { n: p.seen, m: p.total }))(guideProgress())} onPress={() => router.push('/guide')} />{/* 08.10.2026: przewodnik (decyzja właściciela) */}
      <Item title={t('Postępy')} onPress={() => router.push('/more/progress')} />
      <Item title={t('Miejsca i sprzęt')} onPress={() => router.push('/more/locations')} /* decyzja 05.10.2026: osobna pozycja, nie tylko w Ustawieniach */ />
      {/* decyzja 05.10.2026: gumy w dodawaniu sprzętu (Miejsca i sprzęt → Gumy oporowe); ekran /more/bands zostaje dla usuwania gum */}
      <Item title={t('Backup (eksport / import)')} onPress={() => router.push('/more/backup')} />
      <Item title={t('Ustawienia')} onPress={() => router.push('/more/settings')} />
      <Muted style={{ marginTop: 20, fontSize: 12 }}>{/* decyzja właściciela 06.10.2026: tylko numer wersji, małym drukiem */}{`${appName()} ${Constants.expoConfig?.version ?? ''}`}{expTxt}</Muted>
    </Screen></SafeAreaView>
  );
}
