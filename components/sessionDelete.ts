import { whenText, fmtDate, wallTs } from '@/lib/store';
import { t } from '@/lib/i18n';
import type { Workout } from '@/lib/seed';

/*
 * Usuwanie sesji z historii (M3 p3, ZM-04 / W2): JEDNO okno dla gestu przesunięcia na liście (zakładka Plan) i przycisku „Usuń sesję” na dole szczegółów —
 * ten sam tytuł, opis i skutek poza aplikacją (kopia w Zdrowiu zostaje; G3 audytu 0.10, DAT-09). Teksty przez t(); nic poza tym tu nie mieszka.
 */
export function sessionDelete(w: Workout): { label: string; title: string; message: string } {
  const name = w.templateName || t('Trening');
  return {
    label: t('Usuń sesję: {name}', { name: `${name}, ${whenText(w)}` }),
    title: t('Usunąć tę sesję z historii?'),
    message: [`${name}, ${fmtDate(wallTs(w))}`, w.healthUUID === 'watch' ? t('Trening z zegarka w Apple Health zostanie — usuniesz go w aplikacji Zdrowie.') : w.healthUUID ? t('Kopia w Apple Health zostanie — usuniesz ją w aplikacji Zdrowie.') : ''].filter(Boolean).join('\n'),
  };
}
