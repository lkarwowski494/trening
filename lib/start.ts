import { Alert } from 'react-native';
import { startFromTemplate, repeatLast, finishedWorkouts, isDeloadWeek, tplRows, workCount, startableItem, repeatBlocks, deloadTail } from '@/lib/store';
import { deloadKeep } from '@/lib/deload-sets';
import { t } from '@/lib/i18n';
import type { Template, Workout } from '@/lib/seed';

/** Liczby do pytania deload z serii roboczych na ćwiczenie (bez rozgrzewek i drop setów): pełne, po cięciu i czy jest ćwiczenie z 1 serią.
 * `shortened` — źródło jest już skrócone (Workout.deload): „mniej” = jak ostatnio, „pełne” = po przywróceniu (D1+, decyzja 08.10.2026). */
const counts = (per: number[]) => ({ full: per.reduce((a, n) => a + n, 0), less: per.reduce((a, n) => a + deloadKeep(n), 0), single: per.some(n => n === 1), shortened: false });
/** Serie robocze szablonu: pełne i po cięciu deload. Audyt 0.10 (LOG-17): te same pozycje co przy starcie (store.startableItem). */
export function deloadCounts(tpl: Template) { return counts(tpl.items.filter(startableItem).map(it => workCount(tplRows(it).map(r => r.kind)))); } /* D3: ta sama definicja co karta szablonu i Postępy */
/** To samo dla „Powtórz ostatni” (audyt 0.10, D1 / MER-05): bloki, które wstawi store.repeatLast. Trening już skrócony (D1+): bez drugiego cięcia —
 * „mniej” to liczba jak ostatnio, „pełne” — po przywróceniu (store.deloadTail: szablon albo zapamiętana liczba). */
export function repeatCounts(w: Workout) {
  const blocks = repeatBlocks(w); const now = blocks.map(e => workCount(e.sets.map(s => s.kind))); /* D3: jedna definicja serii roboczej */
  if (!w.deload) return counts(now);
  const full = blocks.map(e => workCount([...e.sets, ...deloadTail(w, e)].map(x => x.kind)));
  return { full: full.reduce((a, n) => a + n, 0), less: now.reduce((a, n) => a + n, 0), single: false, shortened: true };
}

/**
 * Ile serii mniej w tygodniu deload — jedno sformułowanie dla Kalendarza, Postępów, przewodnika i „Co nowego” (audyt 0.10, MER-04, wariant A):
 * deloadKeep = ceil(n/2) tnie o 1/3–1/2 serii dla n ≥ 2 (n = 3 → 2, sprawdzane w teście dla n = 2..6), a 1 seria zostaje. Przykład liczony z deloadKeep.
 */
export const deloadLessText = () => t('o około 1/3–1/2 mniej serii (np. {k} z {n}; ćwiczenia z 1 serią bez zmian)', { k: deloadKeep(3), n: 3 });

/** Pytanie „Tydzień deload” (decyzja właściciela 08.10.2026, B) — wspólne dla startu z szablonu i „Powtórz ostatni”. */
function askDeload(c: ReturnType<typeof counts>, go: (deload: boolean) => void) {
  if (c.shortened) { askShortened(c, go); return; }
  if (!isDeloadWeek(Date.now()) || !c.full) { go(false); return; }
  /* Audyt 0.10 (D1): same ćwiczenia z 1 serią — nie ma czego skrócić; informacja zamiast cichego startu (teksty obiecują propozycję przy starcie) */
  if (c.less >= c.full) { Alert.alert(t('Tydzień deload'), t('Każde ćwiczenie ma tu 1 serię — liczba serii zostaje bez zmian (ćwiczenia z 1 serią nie są skracane). Ciężary bez zmian.'), [{ text: t('Anuluj'), style: 'cancel' }, { text: t('Start'), onPress: () => go(false) }]); return; }
  const msg = t('Zacząć z mniejszą liczbą serii: {a} zamiast {b} serii roboczych? Ciężary bez zmian, szablon się nie zmienia.', { a: c.less, b: c.full }) + (c.single ? ' ' + t('Ćwiczenia z 1 serią bez zmian.') : '');
  Alert.alert(t('Tydzień deload'), msg, [
    { text: t('Anuluj'), style: 'cancel' }, { text: t('Pełny trening'), onPress: () => go(false) }, { text: t('Mniej serii'), onPress: () => go(true) },
  ]);
}

/**
 * Audyt 0.10 (D1+, decyzja 08.10.2026): „Powtórz ostatni”, gdy ostatni trening był już skrócony. W tygodniu deload to samo pytanie co zwykle, ale
 * „Mniej serii” powtarza go jak jest (bez drugiego cięcia — liczby w pytaniu to pokazują), a „Pełny trening” przywraca pełny. Poza tygodniem deload
 * domyślnie pełny trening (przycisk wyróżniony), z wyjaśnieniem i możliwością „Jak ostatnio”. Nic do przywrócenia — powtórzenie jak jest, bez pytania.
 */
function askShortened(c: ReturnType<typeof counts>, go: (deload: boolean) => void) {
  if (c.full <= c.less) { go(isDeloadWeek(Date.now())); return; } /* nic do przywrócenia: w tygodniu deload — jak ostatnio (znacznik zostaje), poza nim — zwykłe powtórzenie */
  if (isDeloadWeek(Date.now())) {
    Alert.alert(t('Tydzień deload'), t('Zacząć z mniejszą liczbą serii: {a} zamiast {b} serii roboczych? Ciężary bez zmian, szablon się nie zmienia.', { a: c.less, b: c.full }) + ' ' + t('Ostatni trening był już skrócony — „Mniej serii” powtórzy go bez dalszego cięcia.'), [
      { text: t('Anuluj'), style: 'cancel' }, { text: t('Pełny trening'), onPress: () => go(false) }, { text: t('Mniej serii'), onPress: () => go(true) },
    ]); return;
  }
  Alert.alert(t('Ostatni trening był lżejszy'), t('Był skrócony w tygodniu deload: {a} zamiast {b} serii roboczych. Powtórzyć pełny trening?', { a: c.less, b: c.full }), [
    { text: t('Anuluj'), style: 'cancel' }, { text: t('Jak ostatnio'), onPress: () => go(true) }, { text: t('Pełny trening'), onPress: () => go(false), isPreferred: true },
  ]);
}

/*
 * Start z szablonu z każdego miejsca w aplikacji (ekran treningu, „Dziś”, panel dnia, szablon). W tygodniu deload (decyzja właściciela 08.10.2026, B)
 * pytanie: mniej serii (o około 1/3–1/2, ciężary bez zmian, szablon bez zmian) czy pełny trening. `after` — np. przejście na ekran treningu.
 */
export function startTemplate(tpl: Template, after?: () => void) {
  askDeload(deloadCounts(tpl), deload => { startFromTemplate(tpl, deload ? { deload: true } : undefined); after?.(); });
}
/** „Powtórz ostatni” (audyt 0.10, D1 / MER-05 / UI-03 / UX-06 / X-16): w tygodniu deload to samo pytanie co Start, cięcie deloadKeep na blok. */
export function startRepeatLast(after?: () => void) {
  const last = finishedWorkouts()[0]; if (!last) return;
  askDeload(repeatCounts(last), deload => { repeatLast(deload ? { deload: true } : undefined); after?.(); });
}
