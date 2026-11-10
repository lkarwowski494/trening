/*
 * Figury v2 — pozy z DANYCH (kontrakt figury-v2/poza@1, docs/50 pkt 10, docs/53): jeden plik `poses/<rodzina>.json` na rodzinę, wypełniany przez importer
 * (scripts/figures/gemini-pozy.mjs --z-pliku) po bramkach geometrii i sensu ruchu. Rodzina z plikiem jest „gotowa” (families.ts), a każde jej ćwiczenie z wpisem w pliku
 * dostaje figurę z tych danych (figure.ts: figureSpec / frameAt / shapesAt) — tak samo jak ćwiczenia rodzin z rigiem (przysiad, wyciskanie leżąc, zawias).
 * Ćwiczenie rodziny bez wpisu w pliku nie ma figury v2 (zachowanie jak dotąd: v1 albo brak).
 * Rejestr rodzin: `rodziny/<rodzina>.ts` (plik póz, DATA_UI, ONE_WAY_UI) i jedna linia w `rodziny/index.ts` (KO-022, 10.11.2026); tu tylko składanie. Parametry prezentacji rodziny (nazwy faz licznika, kierunek pętli, mierzony staw) to DATA_UI: nowa rodzina z danymi MUSI mieć wpis (test), bo licznik faz i „Kąt na rysunku” zależą od ruchu.
 * Pliki wczytywane leniwie (require w funkcji): 43 rodziny × kilkadziesiąt KB nie mogą ładować się przy starcie.
 */
import type { PoseData } from './contract';
import type { PhaseName } from './anim';
import { RODZINY_POZ } from './rodziny';

export type PoseFile = { kontrakt: string; rodzina: string; cwiczenia: Record<string, PoseData> };
/** Wpis rodziny w `rodziny/<rodzina>.ts` (KO-022): plik póz (`load`), prezentacja (`ui` = DATA_UI) i pętla jednokierunkowa (`oneWay` = ONE_WAY_UI). */
export type RodzinaPoz = { load?: () => PoseFile; ui?: DataUi; oneWay?: DataUi };
const z = <T>(f: (r: RodzinaPoz) => T | undefined): Record<string, T> => Object.fromEntries(Object.entries(RODZINY_POZ).flatMap(([k, r]): [string, T][] => { const v = f(r); return v ? [[k, v]] : []; }));
const LOAD: Record<string, () => PoseFile> = z(r => r.load);
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

/** Staw (albo przesunięcie) pokazywany w linii pod licznikiem faz; nazwy = klucze `jointAngles` (skeleton.ts), więc wartość wynika wprost z geometrii klatki. */
export type MeasuredJoint = 'knee' | 'elbow' | 'hip' | 'shElev' | 'shAbd' | 'shRot' | 'shrug' | 'protract' | 'wristFlex' | 'forearmRoll';
/** Jednostka miary: stopnie (kąt stawu) albo centymetry (barki unoszone i wysuwane w cm — silnik nie ma dla nich kąta, EXT_ROM.shrug / protract). */
export const MEASURE_UNIT: Record<MeasuredJoint, 'deg' | 'cm'> = { knee: 'deg', elbow: 'deg', hip: 'deg', shElev: 'deg', shAbd: 'deg', shRot: 'deg', shrug: 'cm', protract: 'cm', wristFlex: 'deg', forearmRoll: 'deg' };
/**
 * KONWENCJA (27.10.2026, bez źródła — nazwana, nie twierdzenie o wiedzy): linia „Kąt na rysunku” pojawia się tylko wtedy, gdy mierzony staw zmienia się w ruchu o więcej niż ten próg
 * (stopnie albo cm). Poniżej staw „stoi” i liczba byłaby prawdziwa, ale nieistotna (np. kolano przy wznosie bokiem). Jedno miejsce; test: tests/figures-v2-katy-fazy.test.tsx.
 */
export const MIN_MEASURED_ROM = { deg: 15, cm: 2 } as const;
/** `lowerFirst` w wyjątku odwraca kierunek tylko tego ćwiczenia: rodzina z różnym kierunkiem u: 0 → 1 (suwnica: wypychanie, hack: opuszczanie; wejście na stopień: w górę, wykrok: w dół) nie może mieć jednego wpisu dla wszystkich (strażnik: tests/figures-v2-kierunek-u.test.ts). */
export type PhaseOverride = { side?: 'R' | 'L'; names?: { first: PhaseName; second: PhaseName }; joints?: readonly MeasuredJoint[]; hideAngle?: true; lowerFirst?: boolean };
export type DataUi = {
  /** Nazwy faz licznika: first = faza u: 0 → 1, second = powrót. */
  names: { first: PhaseName; second: PhaseName };
  /** true: faza 0 → 1 to opuszczanie (dłuższa, 2 s); false: faza 0 → 1 to wysiłek (1 s), powrót dłuższy (jak martwy ciąg z podłogi). */
  lowerFirst: boolean;
  /** Stawy do linii „Kąt na rysunku” (kandydaci, jedna jednostka): pokazany jest ten, który w ćwiczeniu rusza się najbardziej (figure.ts: measuredJoint). */
  joints: readonly MeasuredJoint[];
  /** Ruch to chód (noszenie): licznik pokazuje jedną fazę „Marsz” bez sekund — tempo opuszczania i podnoszenia nie dotyczy kroku, a czasu kroku nie podajemy (brak źródła). */
  walk?: true;
  /** Wyjątki dla pojedynczych ćwiczeń rodziny (inne nazwy faz, inny staw, ukrycie linii kąta). */
  exceptions?: Record<string, PhaseOverride>;
};
export const DATA_UI: Record<string, DataUi> = z(r => r.ui);
/** Ustawienia prezentacji ćwiczenia w trybie cyklicznym (marsz) z rodziny bez wpisu w DATA_UI (sled_throw, strongman): licznik „Marsz”, mierzone kolano albo biodro (decyzja właściciela 27.10.2026). */
export const GAIT_UI: DataUi = { names: { first: 'Marsz', second: 'Marsz' }, lowerFirst: false, joints: ['knee', 'hip'], walk: true };
/**
 * Prezentacja ćwiczeń w pętli jednokierunkowej (`petla: 'jednokierunkowa'`, 28.10.2026): jedna faza bez sekund, nazwa z `names.first` — „Skok” (plyo) albo „Rzut” (sled_throw: Slamy, rzuty, Wall Ball). Kierunek u: 0 → 1 nie dotyczy
 * (całe powtórzenie w jednym przebiegu, bez opuszczania i podnoszenia), więc `lowerFirst` jest tu nieistotne. Mierzone kolano albo biodro (skok i przysiad piłki). Wpis nie jest DATA_UI: rodzina z jednokierunkowym i innym ruchem
 * (marsz sanek w sled_throw) zachowuje GAIT_UI dla cyklicznych (dataUiForPose).
 */
export const ONE_WAY_UI: Record<string, DataUi> = z(r => r.oneWay);
/** Wpis prezentacji rodziny; ćwiczenie w trybie cyklicznym w rodzinie bez wpisu dostaje GAIT_UI, w trybie jednokierunkowym — ONE_WAY_UI rodziny, inne ćwiczenia takiej rodziny: null (bez figury). */
export const dataUiForPose = (family: string, data: PoseData): DataUi | null => own(DATA_UI, family) ?? (data.petla === 'cykl_lustro' ? GAIT_UI : data.petla === 'jednokierunkowa' ? own(ONE_WAY_UI, family) ?? null : null);
/** Nazwy faz licznika dla ruchów rodzin z poza statycznymi: wpis po ćwiczeniu ma pierwszeństwo przed DATA_UI rodziny (Cat-Cow nie jest Opuszczaniem/Wstawaniem). Teksty przez t() (lib/i18n.en.ts). */
export const PHASES_BY_EXERCISE: Record<string, { first: PhaseName; second: PhaseName }> = {
  /* u = 0 koci grzbiet → u = 1 krowa */
  'Cat-Cow': { first: 'Grzbiet w dół', second: 'Koci grzbiet' },
};
export const dataUiFor = (family: string): DataUi | null => own(DATA_UI, family) ?? null;
/** Czy faza u: 0 → 1 ćwiczenia to opuszczanie (dłuższa, 2 s): wyjątek ćwiczenia (`lowerFirst`) wygrywa z wpisem rodziny. */
export const lowerFirstOf = (ui: DataUi, key: string): boolean => (ui.exceptions && Object.prototype.hasOwnProperty.call(ui.exceptions, key) ? ui.exceptions[key].lowerFirst : undefined) ?? ui.lowerFirst;

/** Ćwiczenia z danymi, które są izometrią (zwis, wytrzymanie): jedna pozycja statyczna bez animacji. Test: pomiar czasu w katalogu (metric „time”). */
export const ISOMETRIC: ReadonlySet<string> = new Set([
  'Dead Hang',
  /* utrzymanie ramion w bok na czas (weight_time, chest_fly r1 W2, 09.11.2026): jedna pozycja bez faz Unoszenie/Opuszczanie */
  'Crucifix',
  /* deska: dwie identyczne klatki — utrzymanie pozycji (09.11.2026, pushup_plank) */
  'Plank',
  /* utrzymanie na czas (time, core_floor 10.11.2026): dwie identyczne klatki */
  'Hollow Hold',
  /* rozciąganie statyczne = utrzymanie pozycji (poza z dwóch identycznych klatek): jedna pozycja bez pętli i licznika faz (27.10.2026; mobility_stand 8, mobility_floor 8 — Cat-Cow jest ruchem) */
  'Chin To Chest Stretch', 'Side Neck Stretch', 'Overhead Triceps Stretch', 'Standing Chest Stretch', 'Standing Gastrocnemius Calf Stretch', 'Wall Calf Stretch', 'Standing Soleus And Achilles Stretch', 'Standing Lateral Stretch',
  'The Straddle', 'Seated Calf Stretch', 'Seated Floor Hamstring Stretch', 'Butterfly Stretch', "Child's Pose", 'Kneeling Hip Flexor Stretch', 'Supine Hamstring Stretch', 'Side-Lying Quad Stretch',
]);
