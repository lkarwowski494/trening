import { requireOptionalNativeModule } from 'expo-modules-core';

/**
 * Most do zegarka z aplikacją Connect IQ (0.20): parowanie przez aplikację pomocniczą producenta zegarka, wysyłanie migawek i odbiór zdarzeń przez Bluetooth.
 * Bez modułu natywnego (Expo Go, testy, Android) `native` jest null, a warstwa lib/watch/ciqLink.ts działa jak „brak zegarka”.
 * Wiadomości to proste słowniki (tekst i liczby całkowite) — format w lib/watch/ciqWire.ts.
 */
export type NativeSendResult = { ok: boolean; code: number; name: string };
export type NativeDevice = { id: string; name: string; model: string; status: number };
export type NativeAppStatus = { installed: boolean; version: number };
export type NativeSubscription = { remove(): void };
export type CiqNative = {
  isSupported(): boolean;
  pair(): void;
  showCompanionStore(): void;
  forget(): void;
  devices(): NativeDevice[];
  showStore(deviceId: string): void;
  send(deviceId: string, message: Record<string, unknown>): Promise<NativeSendResult>;
  openApp(deviceId: string): Promise<NativeSendResult>;
  appStatus(deviceId: string): Promise<NativeAppStatus>;
  addListener(event: 'onMessage', cb: (e: { id: string; message: Record<string, unknown> }) => void): NativeSubscription;
  addListener(event: 'onDeviceStatus', cb: (e: { id: string; status: number }) => void): NativeSubscription;
  addListener(event: 'onDevices', cb: (e: { devices: NativeDevice[]; needsCompanion?: boolean }) => void): NativeSubscription;
};
export const native = requireOptionalNativeModule<CiqNative>('CiqLink');
