import React from 'react';
import { ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Item, Muted } from '@/components/ui';
import { getState, useTick, save, applyPrefs } from '@/lib/store';
import * as timer from '@/lib/timer';
import { resyncTrialReminder } from '@/lib/entitlement';
import { t, lang, LANGS, LANG_NAME, type LangSetting } from '@/lib/i18n';
import { font } from '@/lib/theme';

/** Wybór języka (decyzja właściciela 05.10.2026: lista zamiast przełącznika; 07.10.2026: 26 języków). Nazwy języków w nich samych. */
export default function LanguageScreen() {
  useTick(); const s = getState().settings; const router = useRouter(); const cur = (s.language ?? 'auto') as LangSetting;
  const pick = (k: LangSetting) => { s.language = k; applyPrefs(); save(); timer.refreshScheduled().catch(() => {}); timer.relocalize().catch(() => {}); resyncTrialReminder().catch(() => {}); /* T4b/Q-004: powiadomienia, Live Activity i podpis przerwy w nowym języku */ if (router.canGoBack()) router.back(); };
  const opts: [LangSetting, string][] = [['auto', t('Jak w telefonie')], ...LANGS.map(l => [l, LANG_NAME[l]] as [LangSetting, string])];
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 40 }}>
      {opts.map(([k, name]) => <Item key={k} title={name} icon={k === cur ? '✓' : ' '} onPress={() => pick(k)} accessibilityLabel={k === cur ? t('{name}, wybrany', { name }) : name} a11yLang={k === 'auto' ? lang() : k} /* A11-09: nazwa języka czytana jego głosem */ />)}
      <Muted style={{ ...font('footnote'), marginTop: 12 }}>{t('Nazwy ćwiczeń z biblioteki są po angielsku we wszystkich językach poza polskim.')}</Muted>
      {/* M1-audytor-generalny-064 (DEC-18, 20.10.2026): nazwa pod ikoną i opis zgody Zdrowia zależą od języka aplikacji ustawionego w iOS — wybór w aplikacji ich nie zmienia */}
      <Item title={t('Zmień w ustawieniach iOS')} sub={t('Nazwa pod ikoną i opis zgody Zdrowia zmienią język dopiero po ustawieniu języka aplikacji w Ustawieniach iOS.')} icon="›" onPress={() => { Linking.openSettings().catch(() => {}); }} />
    </ScrollView></Screen>
  );
}
