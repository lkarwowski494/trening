import { requireOptionalNativeModule } from 'expo-modules-core';
import { serial } from './serial';

/**
 * Most do Live Activity timera przerwy i stopera serii (0.7, T-036). Na urządzeniach bez iOS 16.2 albo w Expo Go moduł
 * jest null i wszystkie wywołania są no-op — aplikacja działa jak wcześniej (powiadomienie + pasek w apce).
 * totalSec zaokrąglany do liczby całkowitej (po stronie Swift to Int — ułamek odrzuciłby wywołanie).
 */
type Native = {
  isSupported(): boolean;
  start(title: string, subtitle: string, endAtMs: number, totalSec: number, kind: string): Promise<boolean>;
  update(subtitle: string, endAtMs: number, totalSec: number): Promise<boolean>;
  end(): Promise<boolean>;
  /** 07.10.2026 wieczór: stan po przycisku ekranu blokady (JSON) — odczyt zdejmuje wpis; brak — null. */
  takeAdjust?(): string | null;
};
const native = requireOptionalNativeModule<Native>('RestActivity');
const sec = (v: number) => Math.max(0, Math.round(v || 0));

export const isSupported = () => !!native && native.isSupported();
export const start = (title: string, subtitle: string, endAtMs: number, totalSec: number, kind: string) => native ? serial(() => native.start(title, subtitle, Math.round(endAtMs), sec(totalSec), kind)).catch(() => false) : Promise.resolve(false);
export const update = (subtitle: string, endAtMs: number, totalSec: number) => native ? serial(() => native.update(subtitle, Math.round(endAtMs), sec(totalSec))).catch(() => false) : Promise.resolve(false);
export const end = () => native ? serial(() => native.end()).catch(() => false) : Promise.resolve(false);
export const takeAdjust = (): string | null => { try { return native?.takeAdjust?.() ?? null; } catch { return null; } };
