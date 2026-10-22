import React from 'react';
import { HeaderButton } from '@/components/DraftHeader';
import { useOnce, NAV_LOCK_MS } from '@/components/ui';
import { t } from '@/lib/i18n';

/*
 * Wspólne przyciski nagłówka z M3 (W1 a–c, 21.10.2026; docs/32 wzorzec 19): każdy to HeaderButton (44 pt, limit powiększenia 1,4), więc strażnik S2
 * (tests/interaction-guards.test.ts) dopuszcza je tam, gdzie ekran składa headerLeft / headerRight. Partia p1 tworzy komponenty; ekrany podpinają je
 * w p2 (trening: „⋯”, „Zakończ”; Start: „Planowanie”) i p5 (Masa ciała, Gumy: „Edytuj”). Etykiety VoiceOver („Opcje treningu”) podaje ekran przez t().
 */

/** (b) listy z trybem usuwania bez ekranu szczegółów: „Edytuj” → „Gotowe” (pogrubione w trybie edycji). */
export function EditButton({ editing, onToggle, testID = 'edit-button' }: { editing: boolean; onToggle: () => void; testID?: string }) {
  return <HeaderButton testID={testID} title={editing ? t('Gotowe') : t('Edytuj')} bold={editing} onPress={onToggle} />;
}
/** (a) trening w toku: „⋯” — menu treningu (miejsce, pauza, głos, notatka szablonu); `label` = „Opcje treningu”. */
export function MoreButton({ label, onPress, testID = 'more-button' }: { label: string; onPress: () => void; testID?: string }) {
  return <HeaderButton testID={testID} icon="more" title={label} label={label} onPress={onPress} />;
}
/** (c) ekran Trening bez treningu w toku: „Planowanie” (przejście do planu; blokada podwójnego tapnięcia jak przyciski przejścia). */
export function PlanningButton({ label, onPress, testID = 'planning-button' }: { label: string; onPress: () => void; testID?: string }) {
  const once = useOnce(NAV_LOCK_MS);
  return <HeaderButton testID={testID} title={label} onPress={once(onPress)} />;
}
