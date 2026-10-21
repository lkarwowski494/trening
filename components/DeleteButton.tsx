import React from 'react';
import { View } from 'react-native';
import { Btn } from '@/components/ui';
import { confirmDelete } from '@/components/SwipeRow';
import { SPACE } from '@/lib/theme';

/*
 * Przycisk „Usuń {obiekt}” (M3, W2 wariant a, 21.10.2026; docs/32 wzorzec 5, ZM-04): na dole szczegółów (sesja, szablon, ćwiczenie własne, miejsce) jest zawsze
 * ten sam przycisk — Btn `danger` na całą szerokość, 24 pt pod treścią — a po stuknięciu to samo okno co przy geście przesunięcia: pytanie z obiektem,
 * [Anuluj, Usuń] (confirmDelete z SwipeRow). Gest zostaje skrótem (DEC-12). Etykietę („Usuń sesję”, „Usuń szablon”…), tytuł i skutek poza aplikacją
 * (np. kopia w Zdrowiu) podaje ekran przez t(); komponent nie ma własnych tekstów. Jeden na ekran — pilnuje tests/interaction-guards.test.ts.
 */
export function DeleteButton({ label, title, message, onDelete, testID = 'delete-object' }: { label: string; title: string; message?: string; onDelete: () => void; testID?: string }) {
  return (
    <View testID="delete-button-wrap" style={{ marginTop: SPACE.xl }}>
      <Btn kind="danger" block testID={testID} title={label} onPress={() => confirmDelete({ title, message, onDelete })} />
    </View>
  );
}
