import { Alert } from 'react-native';
import { t } from '@/lib/i18n';

export type CancelBtn = { text: string; style: 'cancel'; onPress?: () => void };

/*
 * Wzorzec „potwierdzanie” (właściciel, 13.10.2026; docs/32 wzorzec 6; HIG Alerts: „Always use the title “Cancel” for a button that cancels an alert’s action”):
 * przycisk rezygnacji w oknach potwierdzenia ma ZAWSZE jedno słowo — „Anuluj” (styl cancel). Jedyny wyjątek: pytanie „Odrzucić zmiany?” po „Anuluj”
 * w edytorze — tam „Anuluj” anulujące „Anuluj” myli, więc przycisk to „Wróć do edycji” (backToEdit). Żaden inny plik nie wpisuje `style: 'cancel'` ręcznie
 * (pilnuje tests/interaction-guards.test.ts).
 */
/** Przycisk rezygnacji „Anuluj” (opcjonalnie z akcją, np. zamknięciem odsłoniętego wiersza). */
export const cancelButton = (onPress?: () => void): CancelBtn => ({ text: t('Anuluj'), style: 'cancel', ...(onPress ? { onPress } : {}) });
/** Wyjątek: rezygnacja z odrzucenia zmian w edytorze. */
export const backToEditButton = (): CancelBtn => ({ text: t('Wróć do edycji'), style: 'cancel' });
/** Przycisk „OK” okna informacyjnego (jedyne okno bez rezygnacji; HIG: „In informational alerts only, you can use “OK””). */
export const okButton = (): CancelBtn => ({ text: t('OK'), style: 'cancel' });

/** Pytanie z dwoma przyciskami: „Anuluj” + akcja (destructive — czerwona). */
export function confirm({ title, message, action, destructive, onConfirm, onCancel }: { title: string; message?: string; action: string; destructive?: boolean; onConfirm: () => void; onCancel?: () => void }) {
  Alert.alert(title, message, [cancelButton(onCancel), { text: action, ...(destructive ? { style: 'destructive' as const } : {}), onPress: onConfirm }]);
}

/** Pytanie „Trwa pomiar serii” przed pominięciem bloku z trwającym stoperem serii (jedno miejsce: „Pomiń dziś” w bloku i „Zastosuj” w oknie „Dostosuj do miejsca” — docs/32). */
export function confirmSkipTimedSet(onConfirm: () => void) {
  confirm({ title: t('Trwa pomiar serii'), message: t('Pominięcie ćwiczenia przerwie pomiar — ten czas się nie zapisze.'), action: t('Pomiń dziś'), destructive: true, onConfirm });
}
