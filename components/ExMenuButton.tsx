import React from 'react';
import { Pressable, ActionSheetIOS } from 'react-native';
import { confirmDelete } from '@/components/SwipeRow';
import { Icon } from '@/components/Icon';
import { useTheme, SIZE } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';

/*
 * „⋯” ćwiczenia poza treningiem (04-studio-projektowe-003; docs/32 wzorzec 5): edytor szablonu i edycja sesji mają tak jak trening (DEC-12) widoczną drogę
 * bez gestu — stuknięcie otwiera menu z „Usuń ćwiczenie” (to samo okno co gest przesunięcia). Etykieta VoiceOver „Opcje ćwiczenia: {nazwa}”, pole dotyku 44 pt.
 */
/** `title` i `onDelete` = okno potwierdzenia jak przy geście (np. „Usunąć z szablonu?”); menu ma jedną pozycję „Usuń ćwiczenie” (destrukcyjną) i „Anuluj”. */
export function ExMenuButton({ name, title, onDelete, testID }: { name: string; title: string; onDelete: () => void; testID: string }) {
  const th = useTheme();
  return <Pressable testID={testID} accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={t('Opcje ćwiczenia: {name}', { name })} onPress={() => ActionSheetIOS.showActionSheetWithOptions({ options: [t('Usuń ćwiczenie'), t('Anuluj')], cancelButtonIndex: 1, destructiveButtonIndex: 0, title: name }, k => { if (k === 0) confirmDelete({ title, message: name, onDelete }); })} hitSlop={4} style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
    <Icon name="more" color={th.muted} size={SIZE.icon} />
  </Pressable>;
}
