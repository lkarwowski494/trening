import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { t } from './i18n';

/*
 * Ważność podpisu (T-038, ADR-025). Aplikacja instalowana przez sideload ma w bundle'u plik
 * embedded.mobileprovision z datą wygaśnięcia profilu (7 dni przy darmowym Apple ID). Czytamy ją bezpośrednio,
 * więc przypomnienie jest dokładne, a nie szacowane od pierwszego uruchomienia. W Expo Go i w buildzie ze sklepu
 * pliku nie ma albo ważność jest roczna — wtedy nic nie pokazujemy.
 */
let cached: { expiry: Date | null; at: number } | null = null;
const REMINDER_ID = 'signing-reminder';

/** Dekodowanie base64 do tekstu latin1 (bez zależności — atob bywa niedostępne poza RN). */
export function decodeB64(b64: string): string {
  if (typeof atob === 'function') return atob(b64);
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'; let out = ''; let buf = 0, bits = 0;
  for (const ch of b64.replace(/[^A-Za-z0-9+/]/g, '')) { buf = (buf << 6) | A.indexOf(ch); bits += 6; if (bits >= 8) { bits -= 8; out += String.fromCharCode((buf >> bits) & 255); } }
  return out;
}
/** Data wygaśnięcia z treści profilu. */
export function parseExpiry(txt: string): Date | null { const m = /<key>ExpirationDate<\/key>\s*<date>([^<]+)<\/date>/.exec(txt); if (!m) return null; const d = new Date(m[1]); return isNaN(d.getTime()) ? null : d; }

export async function getProfileExpiry(): Promise<Date | null> {
  if (Platform.OS !== 'ios') return null;
  if (cached && Date.now() - cached.at < 3600e3) return cached.expiry;
  let expiry: Date | null = null;
  try {
    const dir = FileSystem.bundleDirectory; if (!dir) throw new Error('no bundle dir');
    // bundleDirectory na iOS to goła ścieżka — bez „file://” getInfoAsync rzuca UnsupportedScheme (audyt 0.8.1).
    const uri = (dir.startsWith('file://') ? dir : 'file://' + dir) + 'embedded.mobileprovision';
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) {
      // Plik to binarny CMS/PKCS7 z plistem w środku — odczyt jako UTF-8 się wywraca, więc czytamy base64
      // i szukamy daty w bajtach zdekodowanych jako latin1 (XML plisty jest ASCII).
      const b64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      expiry = parseExpiry(decodeB64(b64));
    }
  } catch { expiry = null; }
  cached = { expiry, at: Date.now() };
  return expiry;
}
/**
 * Dni kalendarzowe do wygaśnięcia: 0 = wygasa dziś, 1 = jutro (runda 32: jak przypomnienie „Jutro wygasa…”, a nie pełne doby);
 * −1 = już wygasł; null gdy nieznane albo profil dłuższy niż 30 dni (sklep/TestFlight).
 */
export async function daysLeft(): Promise<number | null> {
  const e = await getProfileExpiry(); return e ? calendarDaysLeft(e, new Date()) : null;
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
    const e = await getProfileExpiry(); if (!e || e.getTime() - Date.now() > 30 * 86400e3) return;
    // Dzień kalendarzowy przed wygaśnięciem, 18:00 (runda 33: odejmowanie 24 h myliło dzień przy zmianie czasu).
    const when = reminderAt(e);
    if (when.getTime() - Date.now() < 60e3) return; // runda 34: margines — iOS nie przyjmuje interwału ≤ 0
    await Notifications.scheduleNotificationAsync({
      identifier: REMINDER_ID,
      content: { title: t('Jutro wygasa podpis aplikacji'), body: t('Zrób backup (Więcej → Backup) i odnów w Sideloadly. Dane zostają.'), sound: true },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when },
    });
  } catch {}
}
