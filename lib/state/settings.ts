/*
 * Ustawienia: przeniesienie języka, jednostki i motywu do warstwy wyświetlania; włączanie modułów.
 * Zależy od: ./core; zewnętrzne: ../i18n, ../units, ../theme, ../seed.
 */
import { applyLang } from '../i18n';
import { applyUnit } from '../units';
import { applyTheme } from '../theme';
import { type State } from '../seed';
import { S, save, getState } from './core';

/** Przenosi język i jednostkę z ustawień do warstwy wyświetlania. Wołane po starcie, imporcie i zmianie ustawień. */
export function applyPrefs() { if (!S) return; applyLang(S.settings.language); applyUnit(S.settings.unit); applyTheme(S.settings.theme); }
/** Włączanie/wyłączanie modułu (ADR-011). 'training' jest zawsze włączony. */
export function setModule(m: keyof State['settings']['modules'], on: boolean) {
  const s = getState().settings;
  s.modules[m] = m === 'training' ? true : on;
  save();
}
