import { appleWatch, toLinkTransport, type WatchLinkStatus, type WatchTransport as NativeWatchTransport } from '@/modules/watch-link';
import { startWatchLink, stopWatchLink } from './link';

/*
 * Apple Watch jako transport łącza z zegarkiem (docs/35 rozdz. 2, docs/35-zegarek-apple): moduł natywny WatchLink (WatchConnectivity) rejestruje się przez `startWatchLink`.
 * Łącze działa tylko wtedy, gdy iPhone ma sparowany zegarek z zainstalowaną aplikacją — bez niego nie budujemy migawek przy każdej zmianie treningu.
 * Status zmienia się po aktywacji sesji, parowaniu i instalacji aplikacji na zegarku, więc łącze startuje i zatrzymuje się samo. Bez modułu natywnego
 * (Expo Go, Android, testy) nic się nie dzieje. Zwraca funkcję zatrzymującą.
 */
export function startAppleWatchLink(native: NativeWatchTransport = appleWatch): () => void {
  let running = false;
  const sync = (s: WatchLinkStatus) => {
    const want = s.supported && s.paired && s.installed;
    if (want && !running) { startWatchLink(toLinkTransport(native)); running = true; }
    else if (!want && running) { stopWatchLink(); running = false; }
  };
  const off = native.subscribe(() => {}, sync);
  sync(native.status());
  return () => { off(); if (running) { stopWatchLink(); running = false; } };
}
