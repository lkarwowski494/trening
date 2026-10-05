import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Screen, H1, Item, Muted } from '@/components/ui';
import Constants from 'expo-constants';
import { getProfileExpiry } from '@/lib/signing';
import { useHistTick } from '@/lib/store';
import { t, locale } from '@/lib/i18n';

export default function MoreScreen() {
  const tick = useHistTick(); const router = useRouter(); const [exp, setExp] = useState<Date | null>(null);
  useEffect(() => { getProfileExpiry().then(setExp).catch(() => {}); }, [tick]); // runda 31: odświeżane po powrocie z tła
  const expTxt = exp && exp.getTime() - Date.now() < 30 * 86400e3 ? ' ' + t('Podpis ważny do {d}.', { d: `${exp.toLocaleDateString(locale(), { day: 'numeric', month: 'short' })} ${exp.toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' })}` }) : '';
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}><Screen>
      <View style={{ marginVertical: 10 }}><H1>{t('Więcej')}</H1></View>
      <Item title={t('Postępy')} onPress={() => router.push('/more/progress')} />
      <Item title={t('Gumy')} onPress={() => router.push('/more/bands')} />
      <Item title={t('Backup (eksport / import)')} onPress={() => router.push('/more/backup')} />
      <Item title={t('Ustawienia')} onPress={() => router.push('/more/settings')} />
      <Muted style={{ marginTop: 20, fontSize: 13 }}>{t('Trening {v} · dane tylko w telefonie, bez konta i bez sieci. Backup po ważnych sesjach (i przed odnowieniem podpisu).', { v: Constants.expoConfig?.version ?? '' })}{expTxt}</Muted>
    </Screen></SafeAreaView>
  );
}
