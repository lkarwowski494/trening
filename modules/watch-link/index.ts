import { requireOptionalNativeModule } from 'expo-modules-core';
import { createNativeTransport, type NativeWatchLink, type WatchTransport } from './transport';

export * from './transport';

/**
 * Most do aplikacji na Apple Watch (0.20, docs/36): WatchConnectivity po stronie iPhone'a. Bez modułu natywnego (Expo Go, testy, Android)
 * transport jest „bez zegarka” i wszystkie wywołania są no-op — aplikacja działa jak wcześniej.
 */
export const nativeWatchLink = requireOptionalNativeModule<NativeWatchLink>('WatchLink');
export const appleWatch: WatchTransport = createNativeTransport(nativeWatchLink);
