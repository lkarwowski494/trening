import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { t } from './i18n';

/*
 * Ważność podpisu (T-038, ADR-025). Aplikacja instalowana spoza sklepu ma w bundle'u plik
 * embedded.mobileprovision z datą wygaśnięcia profilu. Czytamy ją bezpośrednio, więc przypomnienie jest dokładne,
 * a nie szacowane od pierwszego uruchomienia. W Expo Go i w buildzie ze sklepu pliku nie ma — wtedy nic nie pokazujemy.
 *
 * Dwie drogi instalacji (T-053, od 02.10.2026):
 *  - ad hoc przez EAS (droga główna, płatne konto) — profil ważny ok. roku; odnowienie = nowy build w GitHub Actions
 *    („iPhone (EAS)” → build), bez Sideloadly;
 *  - Sideloadly z darmowym Apple ID (zapas) — profil ważny 7 dni; odnowienie = Sideloadly.
 * Rozróżniamy je po okresie ważności profilu: ExpirationDate − CreationDate. Darmowe Apple ID daje zawsze 7 dni,
 * płatne konto — rok (także profil deweloperski z Sideloadly na płatnym koncie, ale tej drogi nie używamy).
 * Inne pola nie wystarczą: ProvisionedDevices mają oba rodzaje, get-task-allow = true ma każdy profil deweloperski
 * (także płatny), TeamName to po prostu nazwa zespołu/osoby. Brak CreationDate → przyjmujemy drogę główną.
 */
export type RenewKind = 'sideloadly' | 'rebuild';
export type ProfileInfo = { expiry: Date | null; kind: RenewKind };
let cached: { info: ProfileInfo; at: number } | null = null;
const REMINDER_ID = 'signing-reminder';

/** Dekodowanie base64 do tekstu latin1 (bez zależności — atob bywa niedostępne poza RN). */
export function decodeB64(b64: string): string {
  if (typeof atob === 'function') return atob(b64);
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'; let out = ''; let buf = 0, bits = 0;
  for (const ch of b64.replace(/[^A-Za-z0-9+/]/g, '')) { buf = (buf << 6) | A.indexOf(ch); bits += 6; if (bits >= 8) { bits -= 8; out += String.fromCharCode((buf >> bits) & 255); } }
  return out;
}
const plistDate = (txt: string, key: string): Date | null => { const m = new RegExp(`<key>${key}</key>\\s*<date>([^<]+)</date>`).exec(txt); if (!m) return null; const d = new Date(m[1]); return isNaN(d.getTime()) ? null : d; };
/** Data wygaśnięcia z treści profilu. */
export function parseExpiry(txt: string): Date | null { return plistDate(txt, 'ExpirationDate'); }
/** Profil krótszy niż ten próg = darmowe Apple ID (7 dni) → odnowienie w Sideloadly; dłuższy (rok) = ad hoc → nowy build. */
export const FREE_PROFILE_MAX_DAYS = 10;
/** Sposób odnowienia z treści profilu (T-053): po okresie ważności ExpirationDate − CreationDate. */
export function parseRenewKind(txt: string): RenewKind {
  const e = plistDate(txt, 'ExpirationDate'), c = plistDate(txt, 'CreationDate');
  return e && c && e.getTime() - c.getTime() <= FREE_PROFILE_MAX_DAYS * 86400e3 ? 'sideloadly' : 'rebuild';
}
/** Teksty przypomnienia zależne od drogi instalacji (T-053) — jedno miejsce dla banera i powiadomienia. */
export function renewTexts(kind: RenewKind): { expired: string; sub: string; notify: string } {
  return kind === 'sideloadly'
    ? { expired: t('Podpis aplikacji wygasł — odnów w Sideloadly.'), sub: t('Zrób backup i odnów w Sideloadly (ok. 2 min). Dane zostają w telefonie.'), notify: t('Zrób backup (Więcej → Backup) i odnów w Sideloadly. Dane zostają.') }
    : { expired: t('Podpis aplikacji wygasł — zbuduj ją od nowa w GitHubie.'), sub: t('Zrób backup, potem w GitHubie: Actions → iPhone (EAS) → build i zainstaluj z linku. Dane zostają w telefonie.'), notify: t('Zrób backup (Więcej → Backup) i zbuduj aplikację od nowa w GitHubie: iPhone (EAS) → build. Dane zostają.') };
}

export async function getProfileInfo(): Promise<ProfileInfo> {
  const none: ProfileInfo = { expiry: null, kind: 'rebuild' };
  if (Platform.OS !== 'ios') return none;
  if (cached && Date.now() - cached.at < 3600e3) return cached.info;
  let info = none;
  try {
    const dir = FileSystem.bundleDirectory; if (!dir) throw new Error('no bundle dir');
    // bundleDirectory na iOS to goła ścieżka — bez „file://” getInfoAsync rzuca UnsupportedScheme (audyt 0.8.1).
    const uri = (dir.startsWith('file://') ? dir : 'file://' + dir) + 'embedded.mobileprovision';
    const fi = await FileSystem.getInfoAsync(uri);
    if (fi.exists) {
      // Plik to binarny CMS/PKCS7 z plistem w środku — odczyt jako UTF-8 się wywraca, więc czytamy base64
      // i szukamy daty w bajtach zdekodowanych jako latin1 (XML plisty jest ASCII).
      const txt = decodeB64(await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 }));
      info = { expiry: parseExpiry(txt), kind: parseRenewKind(txt) };
    }
  } catch { info = none; }
  cached = { info, at: Date.now() };
  return info;
}
export async function getProfileExpiry(): Promise<Date | null> { return (await getProfileInfo()).expiry; }
/** Tylko dla testów: zapomnij odczytany profil. */
export function __resetSigningCache() { cached = null; }
/**
 * Dni kalendarzowe do wygaśnięcia: 0 = wygasa dziś, 1 = jutro (runda 32: jak przypomnienie „Jutro wygasa…”, a nie pełne doby);
 * −1 = już wygasł; null gdy nieznane albo profil dłuższy niż 30 dni (sklep/TestFlight).
 */
/** Dni do wygaśnięcia + sposób odnowienia (baner na ekranie głównym, T-053). */
export async function signingState(): Promise<{ days: number | null; kind: RenewKind }> {
  const { expiry, kind } = await getProfileInfo(); return { days: expiry ? calendarDaysLeft(expiry, new Date()) : null, kind };
}
export function calendarDaysLeft(e: Date, now: Date): number | null {
  if (e.getTime() - now.getTime() > 30 * 86400e3) return null; if (e.getTime() <= now.getTime()) return -1;
  const mid = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((mid(e) - mid(now)) / 86400e3);
}
export const reminderAt = (e: Date) => new Date(e.getFullYear(), e.getMonth(), e.getDate() - 1, 18, 0, 0, 0);
/** Planuje jedno przypomnienie na dzień przed wygaśnięciem (18:00) — idempotentnie. */
export async function scheduleReminder(): Promise<void> {
  try {
    // Runda 33: najpierw zawsze kasujemy stare przypomnienie — po ponownym podpisaniu (dłuższy profil / brak profilu) nie może zostać.
    const all = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of all) if (n.identifier === REMINDER_ID) await Notifications.cancelScheduledNotificationAsync(REMINDER_ID);
    const { expiry: e, kind } = await getProfileInfo(); if (!e || e.getTime() - Date.now() > 30 * 86400e3) return;
    // Dzień kalendarzowy przed wygaśnięciem, 18:00 (runda 33: odejmowanie 24 h myliło dzień przy zmianie czasu).
    const when = reminderAt(e);
    if (when.getTime() - Date.now() < 60e3) return; // runda 34: margines — iOS nie przyjmuje interwału ≤ 0
    await Notifications.scheduleNotificationAsync({
      identifier: REMINDER_ID,
      content: { title: t('Jutro wygasa podpis aplikacji'), body: renewTexts(kind).notify, sound: true },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when },
    });
  } catch {}
}
