import React from 'react';
import { Pressable } from 'react-native';
import { Icon } from '@/components/Icon';
import { useTheme, SIZE } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';

/*
 * „⋯” ćwiczenia poza treningiem (04-studio-projektowe-003; docs/32 wzorzec 5): edytor szablonu i edycja sesji mają tak jak trening (DEC-12) widoczną drogę
 * bez gestu — stuknięcie otwiera menu z „Usuń ćwiczenie” (to samo okno co gest przesunięcia). Etykieta VoiceOver „Opcje ćwiczenia: {nazwa}”, pole dotyku 44 pt.
 */
export function ExMenuButton({ name, onPress, testID }: { name: string; onPress: () => void; testID: string }) {
  const th = useTheme();
  return <Pressable testID={testID} accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={t('Opcje ćwiczenia: {name}', { name })} onPress={onPress} hitSlop={4} style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
    <Icon name="more" color={th.muted} size={SIZE.icon} />
  </Pressable>;
}
