import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Screen, Item, Muted, Txt } from '@/components/ui';
import { F } from '@/lib/theme';
import { LICENSES, LICENSE_TEXTS } from '@/lib/licenses.generated';
import { t } from '@/lib/i18n';

/*
 * Audyt 0.10 SEC-08: licencje open source — notki o prawach autorskich i treść licencji (MIT, BSD, ISC i inne wymagają ich dołączenia).
 * Lista: scripts/licenses.mjs z package-lock.json i plików LICENSE (verify sprawdza zgodność). Nazwy pakietów i treść licencji bez tłumaczenia (oryginał prawny).
 */
const COUNTS = Object.keys(LICENSE_TEXTS).map(id => [id, LICENSES.filter(r => r[2].split(/[\s()]+/).includes(id)).length] as const);

export default function LicensesScreen() {
  const [open, setOpen] = useState<string | null>(null);
  const header = <View style={{ paddingVertical: 10 }}>
    <Muted style={{ fontSize: 13, marginBottom: 8 }}>{t('Aplikacja korzysta z bibliotek open source. Niżej licencje (dotknij, by zobaczyć treść) oraz wszystkie pakiety npm, od których zależy aplikacja — także narzędzia budowania — z licencją i notką o prawach autorskich.')}</Muted>
    {COUNTS.map(([id, n]) => <View key={id}>
      <Item title={id} sub={t('pakiety: {n} · treść wg {p}', { n, p: LICENSE_TEXTS[id].from })} icon={open === id ? '▾' : '▸'} onPress={() => setOpen(open === id ? null : id)} />
      {open === id ? <Txt style={{ fontSize: 11, fontFamily: F.mono, marginVertical: 8 }}>{LICENSE_TEXTS[id].text}</Txt> : null}
    </View>)}
    <Muted accessibilityRole="header" style={{ fontSize: 12, fontFamily: F.semibold, paddingTop: 14 }}>{t('Pakiety ({n})', { n: LICENSES.length })}</Muted>
  </View>;
  return (
    <Screen>
      <FlatList testID="licenses-list" data={LICENSES} keyExtractor={r => r[0] + '@' + r[1]} ListHeaderComponent={header} initialNumToRender={20} windowSize={11} contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item: r }) => <Item title={`${r[0]} ${r[1]}`} sub={[r[2], ...r[3]].join(' · ')} />} />
    </Screen>
  );
}
