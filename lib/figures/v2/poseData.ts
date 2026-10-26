/*
 * Figury v2 — pozy z DANYCH (kontrakt figury-v2/poza@1, docs/50 pkt 10, docs/53): jeden plik `poses/<rodzina>.json` na rodzinę, wypełniany przez importer
 * (scripts/figures/gemini-pozy.mjs --z-pliku) po bramkach geometrii i sensu ruchu. Rodzina z plikiem jest „gotowa” (families.ts), a każde jej ćwiczenie z wpisem w pliku
 * dostaje figurę z tych danych (figure.ts: figureSpec / frameAt / shapesAt) — tak samo jak ćwiczenia rodzin z rigiem (przysiad, wyciskanie leżąc, zawias).
 * Ćwiczenie rodziny bez wpisu w pliku nie ma figury v2 (zachowanie jak dotąd: v1 albo brak).
 * Parametry prezentacji rodziny (nazwy faz licznika, kierunek pętli, mierzony staw) to DATA_UI: nowa rodzina z danymi MUSI mieć wpis (test), bo licznik faz i „Kąt na rysunku” zależą od ruchu.
 * Pliki wczytywane leniwie (require w funkcji): 43 rodziny × kilkadziesiąt KB nie mogą ładować się przy starcie.
 */
import type { PoseData } from './contract';
import type { PhaseName } from './anim';

type PoseFile = { kontrakt: string; rodzina: string; cwiczenia: Record<string, PoseData> };
const LOAD: Record<string, () => PoseFile> = {
  pull_up: () => require('./poses/pull_up.json'),
};
const CACHE: Record<string, PoseFile> = {};
const own = <T>(o: Record<string, T>, k: string): T | undefined => Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined;

/** Rodziny, które mają plik póz (kolejność rejestru). */
export const POSE_FAMILIES: readonly string[] = Object.keys(LOAD);
export const hasPoseFile = (family: string): boolean => !!own(LOAD, family);
/** Plik póz rodziny (null, gdy rodzina nie ma danych). */
export function poseFile(family: string): PoseFile | null {
  const f = own(LOAD, family); if (!f) return null;
  return own(CACHE, family) ?? (CACHE[family] = f());
}
/** Poza ćwiczenia z danych rodziny `family` (null: rodzina bez pliku albo ćwiczenie bez wpisu). */
export function poseDataFor(key: string, family: string): PoseData | null {
  const f = poseFile(family); if (!f) return null;
  const d = own(f.cwiczenia, key); return d && d.cwiczenie === key && d.rodzina === family ? d : null;
}
/** Klucze ćwiczeń z danymi w rodzinie. */
export const poseKeys = (family: string): string[] => Object.keys(poseFile(family)?.cwiczenia ?? {});

export type MeasuredJoint = 'knee' | 'elbow' | 'hip';
export type DataUi = {
  /** Nazwy faz licznika: first = faza u: 0 → 1, second = powrót. */
  names: { first: PhaseName; second: PhaseName };
  /** true: faza 0 → 1 to opuszczanie (dłuższa, 2 s); false: faza 0 → 1 to wysiłek (1 s), powrót dłuższy (jak martwy ciąg z podłogi). */
  lowerFirst: boolean;
  /** Staw pokazywany w linii „Kąt na rysunku”. */
  joint: MeasuredJoint;
};
export const DATA_UI: Record<string, DataUi> = {
  /* u = 0 zwis, u = 1 górna pozycja: podciąganie 1 s, opuszczanie 2 s (tempo ilustracyjne, anim.ts) */
  pull_up: { names: { first: 'Podciąganie', second: 'Opuszczanie' }, lowerFirst: false, joint: 'elbow' },
};
export const dataUiFor = (family: string): DataUi | null => own(DATA_UI, family) ?? null;

/** Ćwiczenia z danymi, które są izometrią (zwis, wytrzymanie): jedna pozycja statyczna bez animacji. Test: pomiar czasu w katalogu (metric „time”). */
export const ISOMETRIC: ReadonlySet<string> = new Set(['Dead Hang']);
