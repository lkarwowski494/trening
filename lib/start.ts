import { Alert } from 'react-native';
import { startFromTemplate, isDeloadWeek, tplRows, workCount } from '@/lib/store';
import { deloadKeep } from '@/lib/deload-sets';
import { t } from '@/lib/i18n';
import type { Template } from '@/lib/seed';

/** Serie robocze szablonu (bez rozgrzewek i drop setów): pełne i po cięciu deload. */
export function deloadCounts(tpl: Template) {
  const per = tpl.items.map(it => workCount(tplRows(it).map(r => r.kind))); /* D3 (audyt 0.10): ta sama definicja co karta szablonu i Postępy */
  return { full: per.reduce((a, n) => a + n, 0), less: per.reduce((a, n) => a + deloadKeep(n), 0) };
}

/*
 * Start z szablonu z każdego miejsca w aplikacji (ekran treningu, „Dziś”, panel dnia, szablon). W tygodniu deload (decyzja właściciela 08.10.2026, B)
 * pytanie: mniej serii (około połowy, ciężary bez zmian, szablon bez zmian) czy pełny trening. `after` — np. przejście na ekran treningu.
 */
export function startTemplate(tpl: Template, after?: () => void) {
  const go = (deload: boolean) => { startFromTemplate(tpl, deload ? { deload: true } : undefined); after?.(); };
  const c = deloadCounts(tpl);
  if (!isDeloadWeek(Date.now()) || c.less >= c.full) { go(false); return; }
  Alert.alert(t('Tydzień deload'), t('Zacząć z mniejszą liczbą serii: {a} zamiast {b} serii roboczych? Ciężary bez zmian, szablon się nie zmienia.', { a: c.less, b: c.full }), [
    { text: t('Anuluj'), style: 'cancel' }, { text: t('Pełny trening'), onPress: () => go(false) }, { text: t('Mniej serii'), onPress: () => go(true) },
  ]);
}
