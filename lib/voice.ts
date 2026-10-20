import { AccessibilityInfo, AppState } from 'react-native';
import * as Voice from '@/modules/voice-cue';
import { getState, saveCfg } from './store';
import { locale, t, tp } from './i18n';
import { announce } from './announce';
import { prMap } from './stats';
import { restCue, spokenUnit } from './live';
import { wOut, fmtNum } from './units';
import type { Workout } from './seed';

/*
 * Głos w słuchawkach (0.20 „Zegarki i głos”; docs/36-glos.md; decyzje właściciela 13.10.2026): na POCZĄTKU przerwy telefon mówi to samo, co pokazuje zegarek i podpis
 * przerwy (lib/live.ts restCue: ćwiczenie, ciężar, liczba powtórzeń — bez talerzy), a przy rekordzie najpierw „Nowy rekord!”. Koniec przerwy to osobny krótki sygnał —
 * dotychczasowe powiadomienie lokalne (dźwięk + wibracja), nie mowa. Mówi telefon. Wybór „Zapowiedzi głosowe” (19.10.2026, decyzja właściciela; zastępuje przełącznik głośnika):
 * Wyłączone (domyślnie dla nowej instalacji od 20.10.2026, DEC-05) / W słuchawkach (bez słuchawek cisza) / Także przez głośnik — w Ustawieniach i przyciskiem „Głos” na ekranie treningu (zmiana trwała).
 * Etap 1: tylko przy aplikacji na wierzchu (bez trybu audio w tle — docs/36 rozdz. 5). Muzykę ściszamy na czas zdania (moduł natywny VoiceCue).
 * Tu jest cała LOGIKA (kiedy i co mówi) — czysta i testowana; moduł natywny tylko wykonuje.
 */
export type VoiceMode = 'speak' | 'announce' | 'silent';
export const VOICE_REASONS = ['voice-off', 'sound-off', 'background', 'no-headphones', 'screen-reader', 'headphones', 'speaker'] as const;
export type VoiceReason = typeof VOICE_REASONS[number];
/** Wybór „Zapowiedzi głosowe” (19.10.2026): kolejność opcji w Ustawieniach i w arkuszu na ekranie treningu. */
export const VOICE_SETTINGS = ['off', 'headphones', 'speaker'] as const;
export type VoiceSetting = typeof VOICE_SETTINGS[number];
/** Sens BRAKU pola `Settings.voice` w zapisanych danych: „W słuchawkach” (tak działało od wydania 0.20, decyzja 19.10.2026). Zostaje, żeby użytkownik, który
 * ustawienia nie ruszał, nie stracił zachowania po aktualizacji (DEC-05, 20.10.2026: bez migracji i bez zmiany schematu). */
export const VOICE_DEFAULT: VoiceSetting = 'headphones';
/** Nowa instalacja (DEC-05, decyzja właściciela 20.10.2026, zastępuje „W słuchawkach” z 19.10): głos wyłączony — seed zapisuje to JAWNIE (lib/seed.ts seedState). */
export const VOICE_NEW_INSTALL: VoiceSetting = 'off';
export interface VoiceInput { sound: boolean; setting: VoiceSetting; headphones: boolean; appActive: boolean; screenReader: boolean }
export interface VoiceDecision { mode: VoiceMode; reason: VoiceReason }

/**
 * Kiedy i jak mówimy. „Wyłączone” → nigdy (także przez VoiceOver). Dźwięk wyłączony w Ustawieniach (wspólny wyłącznik „Dźwięk i wibracja”) albo aplikacja w tle → cisza.
 * Bez słuchawek przy „W słuchawkach” → cisza; „Także przez głośnik” mówi też bez słuchawek.
 * Przy włączonym VoiceOver nie odpalamy własnej syntezy równolegle — zapowiedź idzie przez `announce` (głos i tempo VoiceOvera użytkownika), z tą samą regułą trasy dźwięku.
 */
export function voicePolicy(i: VoiceInput): VoiceDecision {
  if (i.setting === 'off') return { mode: 'silent', reason: 'voice-off' };
  if (!i.sound) return { mode: 'silent', reason: 'sound-off' };
  if (!i.appActive) return { mode: 'silent', reason: 'background' };
  if (!i.headphones && i.setting !== 'speaker') return { mode: 'silent', reason: 'no-headphones' };
  if (i.screenReader) return { mode: 'announce', reason: 'screen-reader' };
  return { mode: 'speak', reason: i.headphones ? 'headphones' : 'speaker' };
}

/** Bieżący wybór „Zapowiedzi głosowe” (brak pola albo zła wartość = VOICE_DEFAULT, sens danych sprzed 20.10.2026; nowa instalacja ma pole jawnie). */
export function voiceSetting(s: { voice?: unknown } = getState().settings): VoiceSetting { return s.voice === 'off' || s.voice === 'speaker' || s.voice === 'headphones' ? s.voice : VOICE_DEFAULT; }
/** Zmiana wyboru (Ustawienia i przycisk „Głos” na ekranie treningu) — trwała; od 20.10.2026 zawsze jawna wartość (brak pola = „W słuchawkach” tylko w danych starszych). „Wyłączone” przerywa trwającą zapowiedź. */
export function setVoiceSetting(v: VoiceSetting): void {
  const s = getState().settings; s.voice = v; saveCfg(); if (v === 'off') silenceVoice();
}
const VOICE_LABEL: Record<VoiceSetting, () => string> = { off: () => t('Wyłączone'), headphones: () => t('W słuchawkach'), speaker: () => t('Także przez głośnik') };
/** Nazwa opcji w języku interfejsu (Ustawienia, arkusz i etykieta VoiceOver przycisku na ekranie treningu). */
export const voiceSettingLabel = (v: VoiceSetting): string => VOICE_LABEL[v]();

let screenReader = false; let watching = false;
function watchScreenReader() {
  if (watching) return; watching = true;
  try { AccessibilityInfo.isScreenReaderEnabled().then(v => { screenReader = v; }).catch(() => {}); AccessibilityInfo.addEventListener('screenReaderChanged', v => { screenReader = v; }); } catch { /* test / brak API */ }
}
/** Tylko testy: wymusza stan VoiceOvera i wyłącza nasłuch systemowy. */
export function __setScreenReaderForTests(v: boolean) { watching = true; screenReader = v; }

/** Aplikacja na wierzchu (etap 1: bez trybu audio w tle mowa w tle by się nie udała). „Nieznany” stan (testy, start) liczy się jak na wierzchu. */
export const appActive = (): boolean => { try { const st = AppState.currentState as string | null | undefined; return st !== 'background' && st !== 'inactive'; } catch { return true; } };

/** Tekst zapowiedzi do wypowiedzenia: zapowiedź przerwy (restCue), przy rekordzie w odhaczonej serii poprzedzona „Nowy rekord!” (serie „do uzupełnienia” rekordu nie mają). Pusty = nic do powiedzenia. */
export function cueSpeech(w: Workout, setId: string): string {
  const c = restCue(w, setId); if (!c.speech) return '';
  return prMap(w).get(setId)?.length ? `${t('Nowy rekord!')} ${c.speech}` : c.speech;
}

/** Zapowiedź po odhaczeniu serii `setId` (start przerwy). Zwraca decyzję (testy); nowa zapowiedź przerywa poprzednią, brak głosu w telefonie → cisza. */
export async function sayRestStart(w: Workout, setId: string): Promise<VoiceDecision & { text: string }> {
  watchScreenReader(); const s = getState().settings; const text = cueSpeech(w, setId);
  const d = voicePolicy({ sound: s.sound !== false, setting: voiceSetting(s), headphones: Voice.headphonesConnected(), appActive: appActive(), screenReader });
  if (!text) return { ...d, mode: 'silent', text };
  if (d.mode === 'announce') announce(text); else if (d.mode === 'speak') { await Voice.speak(text, locale()); }
  return { ...d, text };
}
/** Przerywa mowę (cofnięcie odhaczenia, koniec treningu). */
export const silenceVoice = (): void => { Voice.stop(); };
/** Czy telefon ma głos dla języka aplikacji (ekran Ustawień pokazuje wskazówkę, gdy nie). */
export const voiceAvailable = (): boolean => Voice.isSupported() && Voice.hasVoice(locale());
/** „Posłuchaj przykładu” w Ustawieniach: przykładowa zapowiedź w języku aplikacji, trasa dźwięku jak telefon ją ustawił (użytkownik sam o to poprosił — bez warunku słuchawek). */
export async function sampleVoice(): Promise<boolean> {
  watchScreenReader(); const n = 8; const text = `${t('dalej: {name}', { name: 'Bench Press' })}, ${fmtNum(wOut(80), 2)} ${spokenUnit(wOut(80))}, ${n} ${tp(n, 'powtórzenie|powtórzenia|powtórzeń')}`;
  if (screenReader) { announce(text); return true; }
  return Voice.speak(text, locale());
}
