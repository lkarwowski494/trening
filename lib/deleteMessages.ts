import { getState } from '@/lib/store';
import { t } from '@/lib/i18n';

/*
 * Opisy skutków usunięcia — jedno źródło dla gestu przesunięcia i przycisku usunięcia (M3 ZM-04, W2): ta sama droga w obie strony daje to samo okno
 * (docs/32 wzorzec 5). Czysta odczytowa logika, bez zapisu danych.
 */

/** Skutki usunięcia gumy: serie w historii pokażą „?”, w trwającym treningu guma znika z nieodhaczonych serii (undefined = bez dopisku). */
export function bandDeleteMessage(bandId: string): string | undefined {
  const s = getState();
  return [
    s.workouts.some(w => w.exercises.some(e => e.sets.some(x => x.bandId === bandId))) ? t('W historii serie z tą gumą pokażą „?”.') : '',
    s.active?.exercises.some(e => e.sets.some(x => x.bandId === bandId)) ? t('W trwającym treningu guma zniknie z nieodhaczonych serii.') : '',
  ].filter(Boolean).join(' ') || undefined;
}

/** Skutki usunięcia miejsca (G3, audyt 0.10 UI-06): treningi i szablony z tym miejscem oraz trening w toku (undefined = bez dopisku). */
export function locationDeleteMessage(id: string): string | undefined {
  const s = getState();
  const used = s.workouts.some(w => w.locationId === id) || s.templates.some(x => x.locationId === id);
  return [
    used ? t('Treningi i szablony z tym miejscem pokażą „(usunięte miejsce)”.') : '',
    s.active?.locationId === id ? t('Trwający trening w tym miejscu trwa dalej; miejsce pokaże się jako „(usunięte miejsce)”.') : '',
  ].filter(Boolean).join(' ') || undefined;
}
