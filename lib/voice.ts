import { AccessibilityInfo, AppState } from 'react-native';
import * as Voice from '@/modules/voice-cue';
import { getState } from './store';
import { locale, t, tp } from './i18n';
import { announce } from './announce';
import { prMap } from './stats';
import { restCue } from './live';
import { wOut, wu, fmtNum } from './units';
import type { Workout } from './seed';

/*
 * Głos w słuchawkach (0.20 „Zegarki i głos”; docs/36-glos.md; decyzje właściciela 13.10.2026): na POCZĄTKU przerwy telefon mówi to samo, co pokazuje zegarek i podpis
 * przerwy (lib/live.ts restCue: ćwiczenie, ciężar, liczba powtórzeń — bez talerzy), a przy rekordzie najpierw „Nowy rekord!”. Koniec przerwy to osobny krótki sygnał —
 * dotychczasowe powiadomienie lokalne (dźwięk + wibracja), nie mowa. Mówi telefon. Głośnik telefonu to przełącznik w Ustawieniach, domyślnie wyłączony: bez słuchawek cisza.
 * Etap 1: tylko przy aplikacji na wierzchu (bez trybu audio w tle — docs/36 rozdz. 5). Muzykę ściszamy na czas zdania (moduł natywny VoiceCue).
 * Tu jest cała LOGIKA (kiedy i co mówi) — czysta i testowana; moduł natywny tylko wykonuje.
 */
export type VoiceMode = 'speak' | 'announce' | 'silent';
export const VOICE_REASONS = ['sound-off', 'background', 'no-headphones', 'screen-reader', 'headphones', 'speaker'] as const;
export type VoiceReason = typeof VOICE_REASONS[number];
export interface VoiceInput { sound: boolean; speaker: boolean; headphones: boolean; appActive: boolean; screenReader: boolean }
export interface VoiceDecision { mode: VoiceMode; reason: VoiceReason }

/**
 * Kiedy i jak mówimy. Dźwięk wyłączony w Ustawieniach (wspólny wyłącznik „Dźwięk i wibracja”) albo aplikacja w tle → cisza. Bez słuchawek i bez przełącznika głośnika → cisza.
 * Przy włączonym VoiceOver nie odpalamy własnej syntezy równolegle — zapowiedź idzie przez `announce` (głos i tempo VoiceOvera użytkownika), z tą samą regułą trasy dźwięku.
 */
export function voicePolicy(i: VoiceInput): VoiceDecision {
  if (!i.sound) return { mode: 'silent', reason: 'sound-off' };
  if (!i.appActive) return { mode: 'silent', reason: 'background' };
  if (!i.headphones && !i.speaker) return { mode: 'silent', reason: 'no-headphones' };
  if (i.screenReader) return { mode: 'announce', reason: 'screen-reader' };
  return { mode: 'speak', reason: i.headphones ? 'headphones' : 'speaker' };
}

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
  const c = restCue(w, setId); if (!c.text) return '';
  return prMap(w).get(setId)?.length ? `${t('Nowy rekord!')} ${c.text}` : c.text;
}

/** Zapowiedź po odhaczeniu serii `setId` (start przerwy). Zwraca decyzję (testy); nowa zapowiedź przerywa poprzednią, brak głosu w telefonie → cisza. */
export async function sayRestStart(w: Workout, setId: string): Promise<VoiceDecision & { text: string }> {
  watchScreenReader(); const s = getState().settings; const text = cueSpeech(w, setId);
  const d = voicePolicy({ sound: s.sound !== false, speaker: s.voiceSpeaker === true, headphones: Voice.headphonesConnected(), appActive: appActive(), screenReader });
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
  watchScreenReader(); const n = 8; const text = `${t('dalej: {name}', { name: 'Bench Press' })}, ${fmtNum(wOut(80), 2)} ${wu()}, ${n} ${tp(n, 'powtórzenie|powtórzenia|powtórzeń')}`;
  if (screenReader) { announce(text); return true; }
  return Voice.speak(text, locale());
}
