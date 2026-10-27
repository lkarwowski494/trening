import { Alert, Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import { t, lang } from '@/lib/i18n';
import { okButton } from '@/lib/confirm';
import { versionLabel, BUILD_NUMBER } from '@/lib/version';

/** Adres wsparcia — jedno źródło (decyzja właściciela 13.10.2026): przyciski „Napisz do nas” i „Poproś o nową funkcję”, podpis pod nimi i komunikat o błędzie. */
export const SUPPORT_EMAIL = 'support@apps4brew.com';

/** Rodzaj wiadomości do wsparcia: opinia („Napisz do nas”) albo pomysł na funkcję („Poproś o nową funkcję”, decyzja właściciela 14.10.2026). */
export type SupportKind = 'feedback' | 'idea';

/**
 * Adres mailto: dla „Napisz do nas” i „Poproś o nową funkcję”. Treść opinii: pusta linia i stopka techniczna (wersja z numerem buildu, system, język);
 * treść pomysłu: dwa krótkie pytania (czego brakuje, w jakiej sytuacji na treningu) i ta sama stopka. Nic więcej:
 * bez danych treningowych, masy ciała, nazw szablonów, identyfikatorów, modelu urządzenia ani kopii. Temat i teksty przez t() (język aplikacji).
 */
export function buildSupportMailto({ version, os, language, kind = 'feedback', extra }: { version: string; os: string | number; language: string; kind?: SupportKind;
  /** M1-audytor-generalny-032: linia techniczna pod stopką (ekran błędu startu: kod diagnostyczny etapu i treść błędu; bez danych treningowych) */ extra?: string }): string {
  const footer = t('Wersja: {v} · iOS {os} · Język: {lang}', { v: version, os: String(os), lang: language });
  const subject = kind === 'idea' ? `${t('Pomysł')}: ` : t('Trening — opinia');
  const body = (kind === 'idea' ? `\n\n${t('Czego brakuje:')}\n\n${t('W jakiej sytuacji na treningu:')}\n\n\n${footer}` : `\n\n${footer}`) + (extra ? `\n${extra}` : '');
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Jedna droga otwarcia poczty dla obu przycisków (docs/32 wzorzec 14; decyzja właściciela 13.10.2026): mailto: przez Linking.openURL bez wcześniejszego canOpenURL
 * (nie trzeba LSApplicationQueriesSchemes); brak poczty / odmowa / wyjątek synchroniczny → okno z adresem, a wołający dostaje `onFail` (adres do zaznaczenia na ekranie).
 */
export function openSupportMail(kind: SupportKind, onFail?: () => void, extra?: string): void {
  const url = buildSupportMailto({ version: versionLabel(Constants.expoConfig?.version, BUILD_NUMBER), os: Platform.Version, language: lang(), kind, extra });
  Promise.resolve().then(() => Linking.openURL(url)).catch(() => {
    onFail?.();
    Alert.alert(t('Nie udało się otworzyć poczty'), t('Napisz na: {mail}', { mail: SUPPORT_EMAIL }), [okButton()]);
  });
}

/** Otwarcie strony (Warunki korzystania, Prywatność) w przeglądarce; błąd otwarcia jest cichy (jak na ekranie zakupu). */
export function openWebPage(url: string): void { Promise.resolve().then(() => Linking.openURL(url)).catch(() => {}); }
