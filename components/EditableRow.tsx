import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/AppText';
import { confirmDelete } from '@/components/SwipeRow';
import { useTheme, font, FW, RADIUS, SIZE, SPACE } from '@/lib/theme';
import { lang } from '@/lib/i18n';

/*
 * Wiersz listy w trybie usuwania (M3 ZM-04, W1 b; docs/32 wzorce 5 i 19): listy bez ekranu szczegółów (Masa ciała, Gumy) mają „Edytuj” w nagłówku
 * (`EditButton`); w trybie edycji przy wierszu pojawia się okrągły przycisk „−” (jak w listach iOS) z etykietą VoiceOver „Usuń {obiekt}: {nazwa}”,
 * a po stuknięciu to samo okno co gest przesunięcia (`confirmDelete` z SwipeRow: pytanie, [Anuluj, Usuń]). Wiersz stoi wewnątrz `SwipeRow`, więc gest zostaje skrótem.
 * Komponent nie ma własnych tekstów — etykietę, tytuł i opis podaje ekran przez t().
 */
export function EditableRow({ editing, label, title, message, onDelete, children }: { editing: boolean; label: string; title: string; message?: string | (() => string); onDelete: () => void; children: React.ReactNode }) {
  const th = useTheme();
  if (!editing) return <>{children}</>;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Pressable testID="row-delete" accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={label} hitSlop={SPACE.s}
        onPress={() => confirmDelete({ title, message: typeof message === 'function' ? message() : message, onDelete })}
        style={{ minHeight: SIZE.hit, minWidth: SIZE.hit, alignItems: 'center', justifyContent: 'center' }}>
        <View accessibilityElementsHidden importantForAccessibility="no" style={{ width: SPACE.xl, height: SPACE.xl, borderRadius: RADIUS.round, backgroundColor: th.danger, alignItems: 'center', justifyContent: 'center' }}>
          <Text maxFontSizeMultiplier={1.3} style={{ color: th.dangerInk, ...font('button'), ...FW.bold }}>−</Text>
        </View>
      </Pressable>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
