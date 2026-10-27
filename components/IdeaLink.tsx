import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme, TEXT_SCALE_MAX, GLYPH_SCALE_MAX, FW, font } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';
import { openSupportMail } from '@/lib/support';

/**
 * Dyskretny link na podsumowaniu świeżo zakończonego treningu (decyzja właściciela 14.10.2026; reguła co N-tego treningu: lib/review.ts IDEA, lib/review-run.ts ideaLinkDue):
 * „Czego Ci brakuje? Poproś o funkcję” otwiera pocztę tą samą drogą co „Napisz do nas” (openSupportMail); „×” zamyka link bez skutków ubocznych (tylko ukrywa — licznik zapisano przy pokazaniu).
 * Oba pola dotyku mają co najmniej 44 pt (docs/32).
 */
export function IdeaLink() {
  const th = useTheme(); const [open, setOpen] = React.useState(true);
  if (!open) return null;
  return (
    <View testID="idea-link" style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <Pressable testID="idea-link-open" accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={t('Czego Ci brakuje? Poproś o funkcję')} accessibilityHint={t('Otwiera aplikację Mail')}
        onPress={() => openSupportMail('idea')} style={{ flex: 1, minHeight: 44, justifyContent: 'center' }}>
        <Text maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, ...font('callout'), ...FW.regular, textDecorationLine: 'underline' }}>{t('Czego Ci brakuje? Poproś o funkcję')}</Text>
      </Pressable>
      <Pressable testID="idea-link-close" accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={t('Zamknij')} onPress={() => setOpen(false)} style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
        <Text accessible={false} importantForAccessibility="no" maxFontSizeMultiplier={GLYPH_SCALE_MAX} style={{ color: th.muted, ...font('body') }}>✕</Text>
      </Pressable>
    </View>);
}
