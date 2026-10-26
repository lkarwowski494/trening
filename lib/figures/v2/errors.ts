/*
 * Figury v2 — „poza błędu” jako MODYFIKACJA pozy poprawnej (decyzja właściciela 25.10.2026: animacja błędu ✕ dla każdego ćwiczenia z błędem ze źródłami).
 * Błąd = wskazówka typu „częsty błąd” (id z lib/cues: err w cue-sets.json albo mistakes w lib/cues/data.json) + delta parametrów rigu (FaultMods), nie osobna poza.
 * Rig liczy tę samą pozę z tymi samymi ograniczeniami (stopy, chwyt, kontakt ze sprzętem) z zmienionymi parametrami, więc poza błędu nie przenika sprzętu i różni się tylko
 * tym, co deklaruje `affects` (test: figures-v2-errors). Intensywność rośnie z postępem ruchu (waga w ∈ [0,1], figure.ts → faultWeight).
 * Błędy bez pozy (kind = 'tempo', np. „szarpanie zamiast kontroli”) zmieniają tylko czas animacji.
 */
import type { ShinRule } from './rigs/common';

/** Delta parametrów rigu przy pełnej wadze (w = 1). Wartości bez źródła liczbowego = uproszczenie ilustracyjne (nie pokazujemy ich użytkownikowi). */
export type FaultMods = {
  /** Docelowe odchylenie kolan w poziomie (stopnie; ujemne = do środka). */
  kneeOutTo?: number;
  /** Uniesienie pięt (cm). */
  heelLift?: number;
  /** Zgięcie kręgosłupa (stopnie; dodatnie = zaokrąglenie, ujemne = wygięcie). */
  spineBend?: number;
  /** Uniesienie miednicy nad ławkę (cm). */
  archLift?: number;
  /** Odsunięcie gryfu od ciała (cm). */
  barAway?: number;
  /** Zmiana reguły podudzia (głębsze zgięcie kolan w ruchu zawiasowym). */
  shin?: Partial<ShinRule>;
  /** Czasy animacji w ms (błędy tempa). */
  tempo?: { downMs: number; upMs: number };
};
export type Fault = { m: FaultMods; w: number };

export type ErrorId = 'kneesIn' | 'heels' | 'roundBack' | 'arch' | 'barAway' | 'kneesBent' | 'jerk';
/** Wielkości, które błąd może zmienić (reszta musi zostać taka sama — test). */
export type Affects = 'knee' | 'ankle' | 'hip' | 'spine' | 'kneeLat' | 'heel' | 'pelvis' | 'bar' | 'shoulder' | 'elbow';
export type ErrorDef = { id: ErrorId; cue: string[]; kind: 'pose' | 'tempo'; mods: FaultMods; affects: Affects[]; mark: 'knees' | 'heels' | 'back' | 'pelvis' | 'bar'; why: string };

export const ERRORS: Record<ErrorId, ErrorDef> = {
  kneesIn: { id: 'kneesIn', cue: ['sq.mis.kneesIn'], kind: 'pose', mods: { kneeOutTo: -20 }, affects: ['kneeLat', 'knee', 'hip', 'ankle'], mark: 'knees', why: 'kolana zapadają się do środka (poza linię palców)' },
  heels: { id: 'heels', cue: ['sq.mis.heels'], kind: 'pose', mods: { heelLift: 8 }, affects: ['heel', 'ankle', 'knee', 'hip'], mark: 'heels', why: 'pięty odrywają się od podłogi' },
  roundBack: { id: 'roundBack', cue: ['mis.roundBack'], kind: 'pose', mods: { spineBend: 45 }, affects: ['spine', 'hip', 'knee', 'ankle', 'shoulder', 'elbow'], mark: 'back', why: 'plecy zaokrąglone' },
  arch: { id: 'arch', cue: ['bp.mis.arch'], kind: 'pose', mods: { spineBend: -32, archLift: 8 }, affects: ['spine', 'pelvis', 'hip', 'knee', 'ankle', 'shoulder'], mark: 'pelvis', why: 'nadmierne wygięcie lędźwi, miednica odrywa się od ławki' },
  barAway: { id: 'barAway', cue: ['mis.barAway'], kind: 'pose', mods: { barAway: 12 }, affects: ['bar', 'hip', 'shoulder', 'knee', 'ankle', 'elbow'], mark: 'bar', why: 'sztanga odjeżdża od ciała' },
  kneesBent: { id: 'kneesBent', cue: ['rdl.knees'], kind: 'pose', mods: { shin: { perKnee: 0.3, max: 26 } }, affects: ['knee', 'hip', 'ankle'], mark: 'knees', why: 'kolana ugięte jak w przysiadzie' },
  jerk: { id: 'jerk', cue: ['mis.jerk'], kind: 'tempo', mods: { tempo: { downMs: 450, upMs: 350 } }, affects: [], mark: 'bar', why: 'szarpanie zamiast kontrolowanego ruchu' },
};

/** Błąd z danych rodziny (kontrakt: bledy[]): indeks w `bledy` ćwiczenia, np. „data:0”. Poza błędu = poza poprawna + delty z danych (contract.keyframeFrame). */
export type DataErrorId = `data:${number}`;
/** Błąd rysunku: rigowy (ERRORS) albo z danych. */
export type FigError = ErrorId | DataErrorId;
export const isDataError = (e: FigError): e is DataErrorId => e.startsWith('data:');
export const dataErrorIndex = (e: DataErrorId): number => Number(e.slice(5));
export const dataErrorId = (index: number): DataErrorId => `data:${index}`;
/** Opis błędu niezależny od źródła (rig albo dane): to, czego potrzebują kadr, znaczniki i licznik. */
export type AnyErrorDef = Omit<ErrorDef, 'id'> & { id: FigError };

/** Id wskazówki „częsty błąd” → błąd na rysunku. Wskazówki bez wpisu nie mają animacji błędu (nie da się ich pokazać pozą). */
export const CUE_TO_ERROR: Record<string, ErrorId> = Object.fromEntries(Object.values(ERRORS).flatMap(e => e.cue.map(c => [c, e.id])));
