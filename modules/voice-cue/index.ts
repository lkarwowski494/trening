import { requireOptionalNativeModule } from 'expo-modules-core';

/**
 * Most do zapowiedzi głosowych (0.20, docs/36): synteza mowy na urządzeniu, sesja dźwięku `playback`/`spokenAudio` ze ściszaniem muzyki na czas zdania.
 * W Expo Go, na Androidzie i w testach moduł jest null — wszystkie wywołania są no-op i nic nie mówią (aplikacja działa jak wcześniej).
 */
type Native = {
  isSupported(): boolean;
  hasVoice(language: string): boolean;
  headphonesConnected(): boolean;
  speak(text: string, language: string): Promise<boolean>;
  stop(): void;
};
const native = requireOptionalNativeModule<Native>('VoiceCue');

export const isSupported = (): boolean => !!native && native.isSupported();
/** Czy telefon ma głos dla języka (BCP 47); bez modułu false. */
export const hasVoice = (language: string): boolean => { try { return !!native && native.hasVoice(language); } catch { return false; } };
/** Czy dźwięk idzie do słuchawek; bez modułu false. */
export const headphonesConnected = (): boolean => { try { return !!native && native.headphonesConnected(); } catch { return false; } };
/** Mówi tekst; true = wypowiedziano do końca. Nowe wywołanie przerywa poprzednie. */
export const speak = (text: string, language: string): Promise<boolean> => native ? native.speak(text, language).catch(() => false) : Promise.resolve(false);
/** Przerywa mowę. */
export const stop = (): void => { try { native?.stop(); } catch { /* brak modułu */ } };
