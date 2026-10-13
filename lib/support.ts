import { t } from '@/lib/i18n';

/** Adres wsparcia — jedno źródło (decyzja właściciela 13.10.2026): przycisk „Napisz do nas”, podpis pod nim i komunikat o błędzie. */
export const SUPPORT_EMAIL = 'support@apps4brew.com';

/**
 * Adres mailto: dla „Napisz do nas” (Więcej → O aplikacji). Treść: pusta linia i stopka techniczna (wersja z numerem buildu, system, język) — nic więcej:
 * bez danych treningowych, masy ciała, nazw szablonów, identyfikatorów, modelu urządzenia ani kopii. Temat i stopka przez t() (język aplikacji).
 */
export function buildSupportMailto({ version, os, language }: { version: string; os: string | number; language: string }): string {
  const subject = t('Trening — opinia');
  const footer = t('Wersja: {v} · iOS {os} · Język: {lang}', { v: version, os: String(os), lang: language });
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`\n\n${footer}`)}`;
}
