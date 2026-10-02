// Model danych. Od schemaVersion 3 (ADR-013) każda encja ma UUID, ownerId i znaczniki czasu —
// przygotowanie pod wielu użytkowników (konto, trener–podopieczny) bez migracji "z bólem" później.
// Backup z wersji webowej v0.3 (bez tych pól) jest nadal importowalny — migrate() w store.ts dopisuje brakujące pola.
import * as Crypto from 'expo-crypto';
import type { LangSetting, Lang } from './i18n';
import type { Unit } from './units';
import type { LoadSpec } from './loads';
import { CATALOG, CATALOG_REV, type LoadSource, type Pattern } from './catalog.generated';

export const SCHEMA_VERSION = 14; // 14 (P-003 E1): miejsca treningu i sprzęt — Settings.locations/mainLocationId/pickerShowAll, Workout/Template.locationId, wymagania sprzętowe ćwiczeń; 11 (runda 55): przyciąganie starych wartości z funtów tylko dla danych sprzed tej wersji; 12 (runda 72): masa ciała zamrożona w zakończonych treningach; 13 (runda 75, Q-001): masa ciała poza obliczeniami — usunięte udział %, waga w Ustawieniach i w treningu; nowe ustawienia progressHint, autoBackup, weighReminder
/** Właściciel danych zanim pojawią się konta (H2). Po logowaniu zostanie podmieniony na id użytkownika. */
export const LOCAL_OWNER = 'local';
/** Rejestr modułów platformy (ADR-011). Dziś działa tylko 'training'; reszta to miejsca w UI/danych, które da się ukryć. */
export const MODULES = ['training', 'diet', 'sleep', 'cardio', 'supplements', 'recommendations'] as const;
export type ModuleId = typeof MODULES[number];
export const MODULE_LABEL: Record<ModuleId, string> = { training: 'Trening', diet: 'Dieta', sleep: 'Sen', cardio: 'Cardio', supplements: 'Suplementy', recommendations: 'Zalecenia' };
/** Moduły, które mają już działającą implementację. Pozostałe pokazujemy jako "wkrótce" i nie da się ich włączyć. */
export const MODULES_AVAILABLE: ReadonlySet<ModuleId> = new Set<ModuleId>(['training']);

/** Wspólne pola każdej encji domenowej (ADR-013). */
export interface Base { id: string; ownerId: string; createdAt: number; updatedAt: number }

/**
 * Typ metryki ćwiczenia (T-020, 0.2). Decyduje, które pola serii są edytowalne:
 *  weight_reps   — ciężar (lub +kg przy masie ciała) + powtórzenia (domyślny)
 *  reps          — same powtórzenia (burpees, box jump)
 *  time          — czas trwania serii (plank, wall sit) — z wbudowanym stoperem
 *  distance_time — dystans + czas (bieg, rower, wioślarz)
 *  weight_time   — ciężar + czas (farmer's walk, suitcase carry)
 */
export const METRICS = ['weight_reps', 'reps', 'time', 'distance_time', 'weight_time'] as const;
export type MetricType = typeof METRICS[number];
export const METRIC_LABEL: Record<MetricType, string> = { weight_reps: 'ciężar + powtórzenia', reps: 'powtórzenia', time: 'czas', distance_time: 'dystans + czas', weight_time: 'ciężar + czas' };
export const hasTime = (m: MetricType) => m === 'time' || m === 'distance_time' || m === 'weight_time';
export const hasReps = (m: MetricType) => m === 'weight_reps' || m === 'reps';
export const hasWeight = (m: MetricType) => m === 'weight_reps' || m === 'weight_time';
export const hasDistance = (m: MetricType) => m === 'distance_time';

/** Partie mięśniowe do liczenia serii tygodniowo (0.4). Ćwiczenie ma partię główną (1 seria) i pomocnicze (0,5 serii), jak w Hevy/Boostcamp. */
export const MUSCLES = ['klatka', 'plecy', 'barki', 'biceps', 'triceps', 'czworogłowe', 'dwugłowe', 'pośladki', 'łydki', 'core', 'przedramiona'] as const;
export type Muscle = typeof MUSCLES[number];

/** Typ serii (0.2.1): normal / rozgrzewkowa (poza objętością i „poprzednio”) / drop set / do upadku. Pole warmup zostaje jako pochodna kind dla zgodności. */
export const SET_KINDS = ['normal', 'warmup', 'drop', 'failure'] as const;
export type SetKind = typeof SET_KINDS[number];
export const SET_KIND_MARK: Record<SetKind, string> = { normal: '', warmup: 'W', drop: 'D', failure: 'F' };
export const SET_KIND_LABEL: Record<SetKind, string> = { normal: 'normalna', warmup: 'rozgrzewkowa', drop: 'drop set', failure: 'do upadku' };
/** Jak liczyć ciężar w objętości (0.2.1): per hantel ×2 / łącznie ×1 / jednostronnie (per strona) ×2. */
export type LoadMode = 'per_dumbbell' | 'total' | 'unilateral';
export const LOAD_MODE_LABEL: Record<LoadMode, string> = { per_dumbbell: 'per hantel (×2)', total: 'łącznie', unilateral: 'jednostronne (per strona, ×2)' };
/** Ćwiczenia z hantlami wykonywane JEDNYM ciężarem (audyt 0.8.1): objętość ×1, nie ×2. */
export const SINGLE_IMPLEMENT: ReadonlySet<string> = new Set(['Goblet Squat', 'Overhead Triceps Extension (hantel)', 'Hip Thrust (hantel)', 'Kettlebell Swing', 'Russian Twist', 'Suitcase Carry']);
export const loadModeFor = (equipment: Equipment, name?: string): LoadMode => equipment === 'hantle' && !(name && SINGLE_IMPLEMENT.has(name)) ? 'per_dumbbell' : 'total';
export const loadMult = (mode: LoadMode) => mode === 'total' ? 1 : 2;
/** Trwały stan timerów (0.2.1): przeżywa zabicie aplikacji; przy starcie odtwarzany z zapisanego znacznika końca. */
/** setId (schemat 10): stoper serii wskazuje serię po id, nie po pozycji — usunięcie ćwiczenia nie przenosi pomiaru na inną serię. */
export interface TimerState { restEndAt: number | null; restTotal: number; restSetId: string | null; setStartAt: number | null; setTarget: number; setId: string | null }

/** Tryb sesji (ADR-016): samodzielnie / zdalnie pod nadzorem trenera / na sali z trenerem. */
export type SessionMode = 'solo' | 'remote' | 'in_gym';
/** Relacja trener–podopieczny (ADR-016). Użytkownik może być własnym trenerem: trainerId === traineeId. Szkielet — UI w module trenerskim (etap 2, ADR-026). */
export interface CoachingRelation extends Base { trainerId: string; traineeId: string; status: 'active' | 'paused' | 'ended'; modules: Partial<Record<ModuleId, boolean>> }
/** Komentarz/feedback przypięty do serii, ćwiczenia lub całego treningu (ADR-016). Szkielet — UI w module trenerskim (etap 2, ADR-026). */
export interface Feedback extends Base { authorId: string; workoutId: string; exerciseIndex: number | null; setId: string | null; text: string }
/** Instrukcje na następną sesję, przypięte do zaplanowanej sesji lub szablonu (ADR-016). Szkielet — UI w module trenerskim (etap 2, ADR-026). */
export interface NextSessionInstructions extends Base { authorId: string; forTemplateId: string | null; forWorkoutId: string | null; text: string; acknowledgedAt: number | null }

export type Equipment = 'hantle' | 'sztanga' | 'masa ciała' | 'maszyna' | 'linki' | 'inne';
export const GROUPS = ['klatka','plecy','barki','biceps','triceps','nogi','pośladki','łydki','core','cardio','inne'] as const;
export type Group = typeof GROUPS[number];

export interface Exercise extends Base { name: string; group: Group; equipment: Equipment; metric: MetricType; loadMode: LoadMode; restSec: number | null; restWarmupSec: number | null; muscles: Muscle[]; secondaryMuscles: Muscle[]; bandAssistable: boolean; tempo: string; notes: string; lib?: boolean; archived?: boolean; /** P-003 (schemat 14): wymagania sprzętowe — każda grupa musi być spełniona, w grupie wystarczy jedna możliwość (lib/equipment.ts). Ćwiczenia własne: [] = zawsze dostępne. */ requires?: string[][]; recommended?: string[]; pattern?: Pattern; /** skąd brać dostępne ciężary (lib/equipment.ts loadsFor) */ loadSource?: LoadSource; /** hantle: 1 = jeden hantel, 2 = para (z której listy brać ciężary) */ implements?: 1 | 2; /** audyt E1 (M6): wersja katalogu, z której skopiowano wymagania ('user' = edytowane — nie odświeżać) */ catalogRev?: string }
/** nominalKg (0.5): opcjonalna szacowana asysta gumy w kg — brak standardu kolorów, więc wartość podaje użytkownik (z opakowania lub własny szacunek). */
export interface Band extends Base { color: string; level: number; nominalKg: number | '' }
/** id (schemat 10): stabilny klucz wiersza w edytorze (przesuwanie/usuwanie nie myli pól). */
export interface TemplateItem { id: string; exerciseId: string; sets: number; repMin: number | null; repMax: number | null; /** null = przerwa z ćwiczenia / domyślna (runda 2) */ restSec: number | null; startWeight: number | ''; targetSec: number | ''; groupId: string | null }
export interface Template extends Base { name: string; items: TemplateItem[]; /** P-003: opcjonalne miejsce domyślne szablonu (brak = miejsce główne) */ locationId?: string }
export interface WSet { id: string; weight: number | ''; reps: number | ''; durationSec: number | ''; distanceM: number | ''; rpe: number | ''; bandId: string; addKg: number | ''; kind: SetKind; warmup: boolean; note: string; done: boolean; completedAt: number | null; actualRest: number | null; /** wpisane ręcznie w tym treningu (nie z podpowiedzi) */ edited?: boolean; /** pola uzupełnione z podpowiedzi przy odhaczeniu: {pole: wstawiona wartość} */ hinted?: Record<string, unknown>; /** guma zdjęta ręcznie (cykl do „—”): podpowiedź ani poprzednia seria jej nie przywracają */ noBand?: boolean; /** wartości wstawione przez aplikację przy starcie (poprzedni trening / ciężar startowy) — decyzja 02.10: zmiana w serii przechodzi na nieruszone dalsze serie o tej samej wartości */ pre?: Partial<Record<'weight' | 'reps' | 'distanceM' | 'addKg', number>> }
/** groupId (0.4): ćwiczenia z tym samym groupId tworzą superset — przerwa startuje dopiero po serii ostatniego ćwiczenia grupy. */
export interface WExercise { id: string; exerciseId: string; restSec: number; repMin: number | null; repMax: number | null; groupId: string | null; sets: WSet[]; /** pozycja szablonu, z której powstał blok (runda 10) */ tplItemId?: string }
export interface Workout extends Base { loggedBy: string; sessionMode: SessionMode; healthUUID: string | null; templateId: string | null; templateName: string; startedAt: number; finishedAt: number | null; note: string; exercises: WExercise[]; /** trening w toku: „Kontynuuj” po pytaniu o porzucony trening (runda 69) */ staleAck?: number; /** P-003: miejsce treningu (tylko gdy są zdefiniowane miejsca) */ locationId?: string; }
export interface Morning extends Base { date: string; bb: number | ''; sleepScore: number | ''; sleepH: number | ''; weight: number | '' }
/** language/unit (0.8, schemat 9, LOC-01/02): 'auto' = język systemu; masa zawsze zapisywana w kg. */
export interface Settings { defaultRest: number; sound: boolean; wakeLock: boolean; showRpe: boolean; healthSync: boolean; /** runda 75 (T-017): cicha podpowiedź progresji */ progressHint: boolean; /** runda 75 (T-012): kopia JSON po każdym treningu w Plikach */ autoBackup: boolean; /** runda 75 (T-013): przypomnienie o wadze w poniedziałek rano */ weighReminder: boolean; modules: Record<ModuleId, boolean>; language: LangSetting; unit: Unit; /** P-003 (schemat 14): miejsca treningu; brak miejsc = zachowanie jak przed schematem 14 */ locations: Location[]; mainLocationId: string | null; /** wybór ćwiczenia: pokaż także niedostępne w miejscu (zapamiętany przełącznik) */ pickerShowAll: boolean }
/** P-003: sprzęt w miejscu — pozycja z lib/equipment.ts, zaznaczone opcje i (dla sprzętu z ciężarami) opis dostępnych ciężarów. */
export interface LocEquip { item: string; opts: string[]; load?: LoadSpec; /** audyt E1 (M5): pozycja odznaczona — opcje i ciężary zostają na wypadek ponownego zaznaczenia */ off?: true }
export interface Location extends Base { name: string; equipment: LocEquip[] }
export interface State { v: number; schemaVersion: number; ownerId: string; settings: Settings; exercises: Exercise[]; bands: Band[]; templates: Template[]; workouts: Workout[]; active: Workout | null; mornings: Morning[]; relations: CoachingRelation[]; feedback: Feedback[]; instructions: NextSessionInstructions[]; timer: TimerState; metaUpdatedAt?: number; userTouched?: boolean }

/** UUID v4 (ADR-013). Fallback losowy tylko gdyby natywny moduł był niedostępny (np. web/testy). */
export function uid(): string {
  try { const u = Crypto.randomUUID(); if (typeof u === 'string' && u.length >= 32) return u; } catch { /* fallthrough */ }
  const h = () => Math.random().toString(16).slice(2, 10);
  return `${h()}-${h().slice(0, 4)}-4${h().slice(0, 3)}-${h().slice(0, 4)}-${h()}${h().slice(0, 4)}`;
}
/** Nowa encja: świeże id, właściciel i znaczniki czasu. */
export function base(ownerId: string = LOCAL_OWNER): Base { const now = Date.now(); return { id: uid(), ownerId, createdAt: now, updatedAt: now }; }
export function defaultModules(): Record<ModuleId, boolean> {
  return { training: true, diet: false, sleep: false, cardio: false, supplements: false, recommendations: false };
}

// [nazwa, partia, sprzęt, asysta gumą]
export const LIB: [string, Group, Equipment, boolean?][] = [
  ['Bench Press (sztanga)','klatka','sztanga'],['Bench Press (hantle)','klatka','hantle'],['Incline Bench Press (sztanga)','klatka','sztanga'],['Incline Bench Press (hantle)','klatka','hantle'],['Decline Bench Press','klatka','sztanga'],['Chest Fly (hantle)','klatka','hantle'],['Cable Fly','klatka','linki'],['Pec Deck','klatka','maszyna'],['Machine Chest Press','klatka','maszyna'],['Wyciskanie na linkach (stojąc)','klatka','linki'],['Chest Dip','klatka','masa ciała',true],['Push Up','klatka','masa ciała'],['Incline Push Up','klatka','masa ciała'],['Diamond Push Up','triceps','masa ciała'],
  ['Deadlift (sztanga)','plecy','sztanga'],['Deadlift (hantle)','plecy','hantle'],['Sumo Deadlift','plecy','sztanga'],['Trap Bar Deadlift','plecy','sztanga'],['RDL (sztanga)','plecy','sztanga'],['RDL (hantle/linki)','plecy','hantle'],['Bent Over Row (sztanga)','plecy','sztanga'],['Bent Over Row (hantle)','plecy','hantle'],['Pendlay Row','plecy','sztanga'],['One Arm Row (hantle)','plecy','hantle'],['Chest Supported Row','plecy','hantle'],['T-Bar Row','plecy','sztanga'],['Seated Cable Row','plecy','linki'],['Wiosłowanie na linkach (siedząc)','plecy','linki'],['Lat Pulldown','plecy','linki'],['Straight Arm Pulldown','plecy','linki'],['Chin Up','plecy','masa ciała',true],['Pull Up','plecy','masa ciała',true],['Neutral Grip Pull Up','plecy','masa ciała',true],['Inverted Row','plecy','masa ciała'],['Face Pull','plecy','linki'],['Back Extension','plecy','masa ciała'],['Shrugs (hantle)','plecy','hantle'],['Shrugs (sztanga)','plecy','sztanga'],['Good Morning','plecy','sztanga'],
  ['Overhead Press (sztanga)','barki','sztanga'],['Overhead Press (hantle)','barki','hantle'],['Seated Shoulder Press (hantle)','barki','hantle'],['Arnold Press','barki','hantle'],['Push Press','barki','sztanga'],['Machine Shoulder Press','barki','maszyna'],['Wyciskanie nad głowę (linki)','barki','linki'],['Lateral Raise (hantle)','barki','hantle'],['Cable Lateral Raise','barki','linki'],['Front Raise','barki','hantle'],['Rear Delt Raise (hantle)','barki','hantle'],['Reverse Fly (hantle)','barki','hantle'],['Reverse Pec Deck','barki','maszyna'],['Upright Row','barki','hantle'],
  ['Biceps Curl (hantle)','biceps','hantle'],['Barbell Curl','biceps','sztanga'],['EZ Bar Curl','biceps','sztanga'],['Hammer Curl','biceps','hantle'],['Incline Curl (hantle)','biceps','hantle'],['Concentration Curl (hantle)','biceps','hantle'],['Preacher Curl','biceps','hantle'],['Spider Curl','biceps','hantle'],['Cable Curl','biceps','linki'],
  ['Skullcrusher (hantle)','triceps','hantle'],['Skullcrusher (EZ)','triceps','sztanga'],['Triceps Dips (ławka)','triceps','masa ciała'],['Triceps Pushdown','triceps','linki'],['Overhead Triceps Extension (hantel)','triceps','hantle'],['Cable Overhead Extension','triceps','linki'],['Close Grip Bench Press','triceps','sztanga'],['Triceps Kickback','triceps','hantle'],
  ['Back Squat','nogi','sztanga'],['Front Squat','nogi','sztanga'],['Goblet Squat','nogi','hantle'],['Przysiad z pasem (linki)','nogi','linki'],['Box Squat','nogi','sztanga'],['Hack Squat','nogi','maszyna'],['Leg Press','nogi','maszyna'],['Bulgarian Split Squat (hantle)','nogi','hantle'],['Lunges (hantle)','nogi','hantle'],['Walking Lunges','nogi','hantle'],['Reverse Lunge','nogi','hantle'],['Step Up','nogi','hantle'],['Leg Extension','nogi','maszyna'],['Leg Curl','nogi','maszyna'],['Lying Leg Curl','nogi','maszyna'],['Nordic Curl','nogi','masa ciała',true],['Pistol Squat','nogi','masa ciała',true],['Sissy Squat','nogi','masa ciała'],['Wall Sit','nogi','masa ciała'],
  ['Hip Thrust (sztanga)','pośladki','sztanga'],['Hip Thrust (hantel)','pośladki','hantle'],['Glute Bridge','pośladki','masa ciała'],['Cable Kickback','pośladki','linki'],['Hip Abduction','pośladki','maszyna'],['Hip Adduction','pośladki','maszyna'],['Kettlebell Swing','pośladki','hantle'],
  ['Standing Calf Raise','łydki','maszyna'],['Seated Calf Raise','łydki','maszyna'],['Łydki na stopniu','łydki','hantle'],['Calf Press (leg press)','łydki','maszyna'],
  ['Plank','core','masa ciała'],['Side Plank','core','masa ciała'],['Dead Bug','core','masa ciała'],['Bird Dog','core','masa ciała'],['Ab Wheel','core','masa ciała'],['Pallof Press','core','linki'],['Hanging Leg Raise','core','masa ciała'],['Hanging Knee Raise','core','masa ciała'],['Cable Crunch','core','linki'],['Crunch','core','masa ciała'],['Reverse Crunch','core','masa ciała'],['Russian Twist','core','hantle'],['Hollow Hold','core','masa ciała'],["Farmer's Walk",'core','hantle'],['Suitcase Carry','core','hantle'],['Mountain Climbers','core','masa ciała'],
  ['Incline Walk (bieżnia)','cardio','inne'],['Bieg','cardio','inne'],['Rower','cardio','inne'],['Rowing Machine','cardio','maszyna'],['Assault Bike','cardio','maszyna'],['Skakanka','cardio','inne'],['Burpees','cardio','masa ciała'],['Box Jump','cardio','masa ciała'],['Medicine Ball Slam','cardio','inne'],
];

/** Metryka dla pozycji biblioteki innych niż ciężar+powtórzenia. Używane też w migracji (po nazwie). */
export const METRIC_BY_NAME: Record<string, MetricType> = {
  'Plank': 'time', 'Side Plank': 'time', 'Wall Sit': 'time', 'Hollow Hold': 'time', 'Skakanka': 'time', 'Mountain Climbers': 'time',
  "Farmer's Walk": 'weight_time', 'Suitcase Carry': 'weight_time',
  'Incline Walk (bieżnia)': 'distance_time', 'Bieg': 'distance_time', 'Rower': 'distance_time', 'Rowing Machine': 'distance_time', 'Assault Bike': 'distance_time',
  'Burpees': 'reps', 'Box Jump': 'reps', 'Medicine Ball Slam': 'reps', 'Bird Dog': 'reps', 'Dead Bug': 'reps',
};
/** Runda 55: tylko własne klucze tablic (nazwa „toString” czy „constructor” nie trafia w Object.prototype). */
export const own = <T,>(o: Record<string, T>, k: string): T | undefined => Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined;
export const metricFor = (name: string): MetricType => own(METRIC_BY_NAME, name) ?? 'weight_reps';

/** Partie mięśniowe głównych ćwiczeń biblioteki: [główne, pomocnicze]. Reszta bierze partię z pola group. */
export const MUSCLES_BY_NAME: Record<string, [Muscle[], Muscle[]]> = {
  'Bench Press (sztanga)': [['klatka'], ['triceps', 'barki']], 'Bench Press (hantle)': [['klatka'], ['triceps', 'barki']], 'Incline Bench Press (sztanga)': [['klatka'], ['barki', 'triceps']], 'Incline Bench Press (hantle)': [['klatka'], ['barki', 'triceps']], 'Decline Bench Press': [['klatka'], ['triceps']], 'Machine Chest Press': [['klatka'], ['triceps']], 'Wyciskanie na linkach (stojąc)': [['klatka'], ['triceps']], 'Chest Dip': [['klatka'], ['triceps']], 'Push Up': [['klatka'], ['triceps', 'barki']], 'Incline Push Up': [['klatka'], ['triceps']], 'Diamond Push Up': [['triceps'], ['klatka']],
  'Deadlift (sztanga)': [['plecy', 'dwugłowe'], ['pośladki', 'czworogłowe']], 'Deadlift (hantle)': [['plecy', 'dwugłowe'], ['pośladki']], 'Sumo Deadlift': [['pośladki', 'czworogłowe'], ['plecy', 'dwugłowe']], 'Trap Bar Deadlift': [['czworogłowe', 'plecy'], ['pośladki', 'dwugłowe']], 'RDL (sztanga)': [['dwugłowe'], ['pośladki', 'plecy']], 'RDL (hantle/linki)': [['dwugłowe'], ['pośladki', 'plecy']], 'Bent Over Row (sztanga)': [['plecy'], ['biceps']], 'Bent Over Row (hantle)': [['plecy'], ['biceps']], 'Pendlay Row': [['plecy'], ['biceps']], 'One Arm Row (hantle)': [['plecy'], ['biceps']], 'Chest Supported Row': [['plecy'], ['biceps']], 'T-Bar Row': [['plecy'], ['biceps']], 'Seated Cable Row': [['plecy'], ['biceps']], 'Wiosłowanie na linkach (siedząc)': [['plecy'], ['biceps']], 'Lat Pulldown': [['plecy'], ['biceps']], 'Chin Up': [['plecy'], ['biceps']], 'Pull Up': [['plecy'], ['biceps']], 'Neutral Grip Pull Up': [['plecy'], ['biceps']], 'Inverted Row': [['plecy'], ['biceps']], 'Face Pull': [['barki'], ['plecy']], 'Good Morning': [['dwugłowe'], ['plecy']],
  'Overhead Press (sztanga)': [['barki'], ['triceps']], 'Overhead Press (hantle)': [['barki'], ['triceps']], 'Seated Shoulder Press (hantle)': [['barki'], ['triceps']], 'Arnold Press': [['barki'], ['triceps']], 'Push Press': [['barki'], ['triceps', 'czworogłowe']], 'Machine Shoulder Press': [['barki'], ['triceps']], 'Wyciskanie nad głowę (linki)': [['barki'], ['triceps']], 'Upright Row': [['barki'], ['biceps']],
  'Close Grip Bench Press': [['triceps'], ['klatka']], 'Triceps Dips (ławka)': [['triceps'], ['klatka']],
  'Back Squat': [['czworogłowe'], ['pośladki', 'dwugłowe']], 'Front Squat': [['czworogłowe'], ['pośladki', 'core']], 'Goblet Squat': [['czworogłowe'], ['pośladki']], 'Przysiad z pasem (linki)': [['czworogłowe'], ['pośladki']], 'Box Squat': [['czworogłowe'], ['pośladki']], 'Hack Squat': [['czworogłowe'], ['pośladki']], 'Leg Press': [['czworogłowe'], ['pośladki']], 'Bulgarian Split Squat (hantle)': [['czworogłowe', 'pośladki'], ['dwugłowe']], 'Lunges (hantle)': [['czworogłowe', 'pośladki'], []], 'Walking Lunges': [['czworogłowe', 'pośladki'], []], 'Reverse Lunge': [['czworogłowe', 'pośladki'], []], 'Step Up': [['czworogłowe', 'pośladki'], []], 'Leg Extension': [['czworogłowe'], []], 'Leg Curl': [['dwugłowe'], []], 'Lying Leg Curl': [['dwugłowe'], []], 'Nordic Curl': [['dwugłowe'], []], 'Pistol Squat': [['czworogłowe'], ['pośladki']], 'Sissy Squat': [['czworogłowe'], []], 'Wall Sit': [['czworogłowe'], []],
  'Hip Thrust (sztanga)': [['pośladki'], ['dwugłowe']], 'Hip Thrust (hantel)': [['pośladki'], ['dwugłowe']], 'Glute Bridge': [['pośladki'], ['dwugłowe']], 'Kettlebell Swing': [['pośladki', 'dwugłowe'], ['plecy']],
  "Farmer's Walk": [['przedramiona', 'core'], []], 'Suitcase Carry': [['core'], ['przedramiona']],
};
export const GROUP_TO_MUSCLE: Partial<Record<Group, Muscle>> = { klatka: 'klatka', plecy: 'plecy', barki: 'barki', biceps: 'biceps', triceps: 'triceps', nogi: 'czworogłowe', pośladki: 'pośladki', łydki: 'łydki', core: 'core' };
export const musclesFor = (name: string, group: Group): [Muscle[], Muscle[]] => own(MUSCLES_BY_NAME, name) ?? [GROUP_TO_MUSCLE[group] ? [GROUP_TO_MUSCLE[group]!] : [], []];

/** P-003: źródło obciążenia ćwiczenia własnego z jego zgrubnego sprzętu (żeby działało zaokrąglanie do dostępnych ciężarów). */
export const LOAD_SOURCE_BY_EQUIPMENT: Record<Equipment, LoadSource> = { hantle: 'dumbbell', sztanga: 'barbell', 'masa ciała': 'bodyweight', maszyna: 'machine_stack', linki: 'cable', inne: 'none' };
/** P-003: pola sprzętowe ćwiczenia — z katalogu dla biblioteki (po nazwie kanonicznej), dla własnych: bez wymagań. */
export function equipFields(name: string, equipment: Equipment, lib: boolean): Pick<Exercise, 'requires' | 'recommended' | 'pattern' | 'loadSource' | 'implements' | 'catalogRev'> {
  const c = lib ? own(CATALOG as Record<string, typeof CATALOG[string]>, name) : undefined;
  if (c) { const o: Pick<Exercise, 'requires' | 'recommended' | 'pattern' | 'loadSource' | 'implements' | 'catalogRev'> = { requires: c.requires.map(g => [...g]), recommended: [...c.recommended], pattern: c.pattern, loadSource: c.loadSource }; if (c.implements) o.implements = c.implements; o.catalogRev = CATALOG_REV; return o; }
  return { requires: [], recommended: [], loadSource: LOAD_SOURCE_BY_EQUIPMENT[equipment] ?? 'none' };
}
export const blankTimer = (): TimerState => ({ restEndAt: null, restTotal: 0, restSetId: null, setStartAt: null, setTarget: 0, setId: null });
/** Domyślne ustawienia — jedno źródło dla seeda i migracji (audyt 0.8.1: 90 s żyło w 4 miejscach). */
export const DEFAULT_REST = 90;
export const defaultSettings = (): Settings => ({ defaultRest: DEFAULT_REST, sound: true, wakeLock: true, showRpe: false, healthSync: false, progressHint: true, autoBackup: true, weighReminder: false, modules: defaultModules(), language: 'auto', unit: 'kg', locations: [], mainLocationId: null, pickerShowAll: false });

/** Stan startowy. Nazwy tworzone dla użytkownika (szablony, gumy) w jego języku; nazwy ćwiczeń z biblioteki zostają kanoniczne i tłumaczy je exName(). */
export function seedState(lng: Lang = 'pl'): State {
  const en = lng === 'en';
  const byName: Record<string, Exercise> = {};
  const exercises: Exercise[] = LIB.map(([name, group, equipment, band]) => {
    const [mu, mu2] = musclesFor(name, group); const e: Exercise = { ...base(), name, group, equipment, metric: metricFor(name), loadMode: loadModeFor(equipment, name), restSec: null, restWarmupSec: null, muscles: mu, secondaryMuscles: mu2, bandAssistable: !!band, tempo: '', notes: '', lib: true, ...equipFields(name, equipment, true) };
    byName[name] = e; return e;
  });
  const it = (n: string, sets: number, min: number | null, max: number | null, rest: number, w: number): TemplateItem =>
    ({ id: uid(), exerciseId: byName[n].id, sets, repMin: min, repMax: max, restSec: rest, startWeight: w, targetSec: '', groupId: null });
  const templates: Template[] = [
    { ...base(), name: 'Upper A', items: [it('Bench Press (hantle)',4,6,8,150,24), it('Bent Over Row (hantle)',4,6,8,120,20), it('Overhead Press (hantle)',3,10,12,90,11), it('Chin Up',3,null,null,90,0), it('Chest Dip',3,null,null,90,0), it('Biceps Curl (hantle)',3,10,12,60,8), it('Skullcrusher (hantle)',3,10,12,60,6), it('Lateral Raise (hantle)',3,15,15,60,4), it('Rear Delt Raise (hantle)',3,15,15,60,6)] },
    { ...base(), name: 'Upper B', items: [it('Incline Bench Press (hantle)',4,8,10,120,21), it('One Arm Row (hantle)',4,8,8,90,22), it('Chest Fly (hantle)',3,8,10,90,12.5), it('Pull Up',3,null,null,90,0), it('Triceps Dips (ławka)',3,12,12,60,0), it('Incline Curl (hantle)',3,8,10,60,8), it('Reverse Fly (hantle)',3,10,12,60,5), it('Concentration Curl (hantle)',3,8,12,60,9)] },
    { ...base(), name: en ? 'Legs — gym' : 'Legs — siłownia', items: [it('Leg Press',5,6,12,120,130), it('Deadlift (hantle)',5,8,8,150,48), it('Leg Extension',5,10,15,60,41), it('Leg Curl',4,10,12,60,41), it('Hip Thrust (sztanga)',4,6,8,90,30), it('Seated Calf Raise',4,10,12,60,30)] },
    { ...base(), name: en ? 'Legs — home' : 'Legs — dom', items: [it('Przysiad z pasem (linki)',4,6,8,150,45), it('RDL (hantle/linki)',4,8,10,150,48), it('Bulgarian Split Squat (hantle)',3,8,8,90,7), it('Hip Thrust (hantel)',3,10,12,90,24), it('Łydki na stopniu',4,15,15,60,24)] },
  ];
  return {
    v: 2, schemaVersion: SCHEMA_VERSION, ownerId: LOCAL_OWNER,
    settings: defaultSettings(), exercises,
    bands: [{ ...base(), color: en ? 'red' : 'czerwona', level: 2, nominalKg: '' }, { ...base(), color: en ? 'black' : 'czarna', level: 4, nominalKg: '' }, { ...base(), color: en ? 'purple' : 'fioletowa', level: 6, nominalKg: '' }],
    templates, workouts: [], active: null, mornings: [], relations: [], feedback: [], instructions: [], timer: blankTimer(),
  };
}
