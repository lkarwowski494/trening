import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Item, Muted } from '@/components/ui';
import { getState, useTick, save, applyPrefs } from '@/lib/store';
import * as timer from '@/lib/timer';
import { t, LANGS, LANG_NAME, type LangSetting } from '@/lib/i18n';

/** Wybór języka (decyzja właściciela 05.10.2026: 16 języków — lista zamiast przełącznika). Nazwy języków w nich samych. */
export default function LanguageScreen() {
  useTick(); const s = getState().settings; const router = useRouter(); const cur = (s.language ?? 'auto') as LangSetting;
  const pick = (k: LangSetting) => { s.language = k; applyPrefs(); save(); timer.refreshScheduled().catch(() => {}); /* T4b: zaplanowane powiadomienia w nowym języku */ if (router.canGoBack()) router.back(); };
  const opts: [LangSetting, string][] = [['auto', t('Jak w telefonie')], ...LANGS.map(l => [l, LANG_NAME[l]] as [LangSetting, string])];
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 40 }}>
      {opts.map(([k, name]) => <Item key={k} title={name} icon={k === cur ? '✓' : ' '} onPress={() => pick(k)} accessibilityLabel={k === cur ? t('{name}, wybrany', { name }) : name} />)}
      <Muted style={{ fontSize: 12, marginTop: 12 }}>{t('Nazwy ćwiczeń z biblioteki są po angielsku we wszystkich językach poza polskim.')}</Muted>
    </ScrollView></Screen>
  );
}
