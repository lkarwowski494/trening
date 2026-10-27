import { requireOptionalNativeModule } from 'expo-modules-core';
import { serial } from './serial';

/**
 * Most do Live Activity timera przerwy i stopera serii (0.7, T-036). Na urządzeniach bez iOS 16.2 albo w Expo Go moduł
 * jest null i wszystkie wywołania są no-op — aplikacja działa jak wcześniej (powiadomienie + pasek w apce).
 * lang — język aplikacji (Lang z lib/i18n; pusty = brak, widżet użyje języka systemu jak dawniej), trafia do ContentState.lang.
 * totalSec zaokrąglany do liczby całkowitej (po stronie Swift to Int — ułamek odrzuciłby wywołanie).
 */
type Native = {
  isSupported(): boolean;
  start(title: string, subtitle: string, endAtMs: number, totalSec: number, kind: string, lang: string): Promise<boolean>;
  update(subtitle: string, endAtMs: number, totalSec: number, lang: string): Promise<boolean>;
  end(): Promise<boolean>;
};
const native = requireOptionalNativeModule<Native>('RestActivity');
const sec = (v: number) => Math.max(0, Math.round(v || 0));

export const isSupported = () => !!native && native.isSupported();
export const start = (title: string, subtitle: string, endAtMs: number, totalSec: number, kind: string, lang = '') => native ? serial(() => native.start(title, subtitle, Math.round(endAtMs), sec(totalSec), kind, lang)).catch(() => false) : Promise.resolve(false);
export const update = (subtitle: string, endAtMs: number, totalSec: number, lang = '') => native ? serial(() => native.update(subtitle, Math.round(endAtMs), sec(totalSec), lang)).catch(() => false) : Promise.resolve(false);
export const end = () => native ? serial(() => native.end()).catch(() => false) : Promise.resolve(false);
