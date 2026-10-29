import React from 'react';
import { Linking, Modal, Pressable, View } from 'react-native';
import { Text } from '@/components/AppText';
import { useRouter } from 'expo-router';
import { Btn } from '@/components/ui';
import { CloseButton } from '@/components/CloseButton';
import { markFairRulesSeen } from '@/lib/fairrules';
import { PAYWALL } from '@/lib/access';
import { ESPRESSO_URL } from '@/lib/products';
import { useTheme, TEXT_SCALE_MAX, font, RADIUS, SPACE } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';

/*
 * Okno „Uczciwe zasady” (1.0, decyzja właściciela 25.10.2026): jednorazowa informacja po pierwszym ukończonym treningu na żywo, tylko w stanie `free` (kiedy pokazać:
 * lib/fairrules.ts). To nie ekran zakupu — bez listy planów. Przycisk główny zamyka; drugorzędny zamyka i otwiera ekran zakupu. Wzorzec zamykania okien (docs/32 wzorzec 1):
 * „Anuluj” po lewej w nagłówku (też zamyka), tło i gest nie są osobnymi przyciskami. Każde zamknięcie zapamiętuje, że okno już było.
 */
export function FairRulesSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const th = useTheme(); const router = useRouter();
  const close = () => { markFairRulesSeen(); onClose(); };
  const plans = () => { markFairRulesSeen(); onClose(); router.push('/paywall?reason=settings'); };
  const line = (k: string, text: string) => <Text key={k} testID={`fair-rules-${k}`} accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('body') }}>{text}</Text>;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close} accessibilityViewIsModal>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable testID="fair-rules-scrim" accessible={false} importantForAccessibility="no" onPress={close} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
        <View testID="fair-rules" style={{ backgroundColor: th.surface, borderTopLeftRadius: RADIUS.group, borderTopRightRadius: RADIUS.group, paddingHorizontal: SPACE.l, paddingTop: SPACE.s, paddingBottom: 34, gap: SPACE.m }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CloseButton onPress={close} />
            <View style={{ flex: 1 }} />
          </View>
          <Text accessibilityRole="header" accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('sectionTitle') }}>{t('Pierwszy trening za Tobą!')}</Text>
          {line('all', t('Wszystkie funkcje działają od pierwszego dnia, bez konta i bez reklam. Dane zostają w telefonie.'))}
          {line('free', t('Trenuj {n} dni w miesiącu za darmo, bez końca.', { n: PAYWALL.FREE_TRAINING_DAYS_PER_MONTH }))}
          {line('pro', t('Chcesz częściej? Pro zdejmuje limit: subskrypcja albo jednorazowy zakup na zawsze.'))}
          <Btn kind="ghost" small block testID="fair-rules-espresso" title={t('Skąd ta cena? Poznaj indeks espresso.')} accessibilityHint={t('Otwiera stronę w przeglądarce.')} onPress={() => { Linking.openURL(ESPRESSO_URL).catch(() => {}); }} />{/* link zewnętrzny: wzorzec 17 (docs/32); okno zostaje otwarte */}
          <Btn kind="primary" block testID="fair-rules-ok" title={t('Super, trenuję dalej!')} onPress={close} />
          <Btn nav kind="ghost" block testID="fair-rules-plans" title={t('Zobacz plany Pro ›')} onPress={plans} />
        </View>
      </View>
    </Modal>);
}
