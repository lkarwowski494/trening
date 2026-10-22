import React, { useMemo } from 'react';
import { View } from 'react-native';
import { EditButton } from '@/components/HeaderActions';
import { useTheme } from '@/lib/theme';

/*
 * Nagłówek listy z trybem usuwania (M3 W1 b, docs/32 wzorzec 19 b): „Edytuj” / „Gotowe” obok „+” (wzorzec 4); w trybie edycji „+” znika.
 * Składa wspólne komponenty (`EditButton`, a „+” przychodzi z `useAddHeader` jako `base`) — własnego przycisku nie ma. `enabled` false
 * (pusta lista — nie ma czego usuwać) zwraca `base` (bez `base` — pusty nagłówek).
 */
const NONE: { headerRight?: () => React.ReactNode } = { headerRight: () => null } /* jawny reset: opcje nagłówka scalają się, więc samo `{}` zostawiłoby „Edytuj” po usunięciu ostatniego wiersza */;
export function useEditHeader(base: { headerRight?: () => React.ReactNode } | undefined = NONE, editing: boolean, onToggle: () => void, enabled: boolean) {
  const th = useTheme();
  return useMemo(() => enabled ? { ...base, headerRight: () => <View style={{ flexDirection: 'row', alignItems: 'center' }}><EditButton editing={editing} onToggle={onToggle} />{editing ? null : base.headerRight?.()}</View> } : base, [th, base, editing, enabled]); // eslint-disable-line react-hooks/exhaustive-deps
}
