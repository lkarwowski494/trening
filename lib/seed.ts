// Model danych. Od schemaVersion 3 (ADR-013) każda encja ma UUID, ownerId i znaczniki czasu —
// przygotowanie pod wielu użytkowników (konto, trener–podopieczny) bez migracji "z bólem" później.
// Backup z wersji webowej v0.3 (bez tych pól) jest nadal importowalny — migrate() w store.ts dopisuje brakujące pola.
import * as Crypto from 'expo-crypto';
import { tIn, type LangSetting, type Lang } from './i18n';
import type { Unit } from './units';
import type { LoadSpec } from './loads';
import { GYM_FILL, OPT_FILL, EQUIP_FILL2 } from './equipment';
import { CATALOG, CATALOG_REV, CATALOG_LIB_EXTRA, CATALOG_ADDED_REVS, MUSCLE_LOAD, CATALOG_NICHE, CATALOG_RESEARCH, CATALOG_STEP, CATALOG_UNMAPPED, type LoadSource, type Pattern, type MuscleRegion } from './catalog.generated';

export const SCHEMA_VERSION = 18; // 18 (audyt 0.10 A1, decyzja właściciela 08.10.2026 — wariant B): State.planHistory — historia planu tygodnia (odcinki „od dnia”), dzień liczony wg planu, który wtedy obowiązywał; dane sprzed 18: plan obowiązuje od dnia migracji (wcześniejsze dni bez planu); weekPlan zostaje (czytają go starsze wersje); kopia 18 odrzucana przez 17; baza ze schematem wyższym niż obsługiwany nie jest nadpisywana (J1, store.init); 17 (decyzja 05.10.2026, docs/17): TemplateItem.rows — serie szablonu jako wiersze (typ, powtórzenia, ciężar); pole opcjonalne, szablony sprzed 17 bez zmian; kopia 17 odrzucana przez 16; 16 (E2, docs/14 pkt 2): WExercise.swappedFrom / implPinned (trening w toku i historia), splitFrom / altSkip (tylko trening w toku), TemplateItem.alternates (W3); pola opcjonalne — blok bez zamiany i szablon bez zamienników wyglądają jak w 15; kopia 16 jest odrzucana przez wersję 15 (pkt 2.4); 15 (decyzje 03.10.2026): WExercise.impl — przyrząd użyty w bloku (decyzja 8c); ciężarów ani treści szablonów użytkownika migracja nie zmienia (decyzja 03.10, 08:11 — bez dawnej jednorazowej zmiany 48 → 24 kg z P-004; zostaje tylko normalizacja pól i usuwanie pozycji z brakującym/usuniętym ćwiczeniem, jak w main); 14 (P-003 E1): miejsca treningu i sprzęt — Settings.locations/mainLocationId/pickerShowAll, Workout/Template.locationId, wymagania sprzętowe ćwiczeń; 11 (runda 55): przyciąganie starych wartości z funtów tylko dla danych sprzed tej wersji; 12 (runda 72): masa ciała zamrożona w zakończonych treningach; 13 (runda 75, Q-001): masa ciała poza obliczeniami — usunięte udział %, waga w Ustawieniach i w treningu; nowe ustawienia progressHint, autoBackup, weighReminder
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
 *  weight_time   — ciężar + czas (wytrzymania z ciężarem: plate pinch, crucifix)
 *  weight_distance — ciężar + dystans (noszenie i sanki: farmer's walk, suitcase carry, sled push — research biblioteki 09.10.2026: L3 Q2 (a),
 *                  L6 Q-L6-3; ACE Farmer's Carry „walk a specified, pre-determined distance”, Hindle i in. 2021 „over a set distance”)
 */
export const METRICS = ['weight_reps', 'reps', 'time', 'distance_time', 'weight_time', 'weight_distance'] as const;
export type MetricType = typeof METRICS[number];
export const METRIC_LABEL: Record<MetricType, string> = { weight_reps: 'ciężar + powtórzenia', reps: 'powtórzenia', time: 'czas', distance_time: 'dystans + czas', weight_time: 'ciężar + czas', weight_distance: 'ciężar + dystans' };
export const hasTime = (m: MetricType) => m === 'time' || m === 'distance_time' || m === 'weight_time';
export const hasReps = (m: MetricType) => m === 'weight_reps' || m === 'reps';
export const hasWeight = (m: MetricType) => m === 'weight_reps' || m === 'weight_time' || m === 'weight_distance';
export const hasDistance = (m: MetricType) => m === 'distance_time' || m === 'weight_distance';

/** Partie mięśniowe do liczenia serii tygodniowo (0.4). Ćwiczenie ma partię główną (1 seria) i pomocnicze (0,5 serii), jak w popularnych aplikacjach treningowych. */
export const MUSCLES = ['klatka', 'plecy', 'barki', 'biceps', 'triceps', 'czworogłowe', 'dwugłowe', 'pośladki', 'łydki', 'core', 'przedramiona', 'przywodziciele'] as const; /* „przywodziciele” — decyzja właściciela 04.10.2026 (wieczór) */
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
/** Research biblioteki (09.10.2026, L2/L6): ćwiczenia bazowe wykonywane jednostronnie — tryb „jednostronne” (per strona, ×2), dopóki sprzęt ten sam co w bibliotece. */
const BASE_LOAD_MODE: Readonly<Record<string, [Equipment, LoadMode]>> = { 'Concentration Curl (hantle)': ['hantle', 'unilateral'], 'Triceps Kickback': ['hantle', 'unilateral'], 'Pallof Press': ['linki', 'unilateral'] };
export const loadModeFor = (equipment: Equipment, name?: string): LoadMode => (name && EXTRA.has(name) && EXTRA.get(name)![2] === equipment ? EXTRA.get(name)![5] as LoadMode : undefined) ?? ((b => b && b[0] === equipment ? b[1] : undefined)(name ? own(BASE_LOAD_MODE, name) : undefined)) ?? (equipment === 'hantle' && !(name && SINGLE_IMPLEMENT.has(name)) ? 'per_dumbbell' : 'total'); /* katalog 04.10: nowe ćwiczenia mają tryb z katalogu (dopóki sprzęt ten sam) */
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

export interface Exercise extends Base { name: string; group: Group; equipment: Equipment; metric: MetricType; loadMode: LoadMode; restSec: number | null; restWarmupSec: number | null; muscles: Muscle[]; secondaryMuscles: Muscle[]; bandAssistable: boolean; tempo: string; notes: string; lib?: boolean; /** audyt 0.10 (E2 / X-03, 08.10.2026): trwały klucz katalogu = nazwa kanoniczna z biblioteki (tylko `lib`). Reguły zależne od tożsamości ćwiczenia z katalogu (mnożnik linek, obciążenie partii, katalog bazowy generatora, krok katalogu, odświeżanie wymagań, poprawki partii, udział masy ciała) idą po nim — nazwa jest tylko do wyświetlania i można ją zmieniać. Brak = ćwiczenie własne albo przemianowane przed poprawką bez możliwości odzyskania (migrate). */ libKey?: string; archived?: boolean; /** P-003 (schemat 14): wymagania sprzętowe — każda grupa musi być spełniona, w grupie wystarczy jedna możliwość (lib/equipment.ts). Ćwiczenia własne: [] = zawsze dostępne. */ requires?: string[][]; recommended?: string[]; pattern?: Pattern; /** skąd brać dostępne ciężary (lib/equipment.ts loadsFor) */ loadSource?: LoadSource; /** hantle: 1 = jeden hantel, 2 = para (z której listy brać ciężary) */ implements?: 1 | 2; /** audyt E1 (M6): wersja katalogu, z której skopiowano wymagania ('user' = edytowane — nie odświeżać) */ catalogRev?: string }
/** Guma (P-001, 02.10.2026): tylko kolor i poziom 1–7 — bez kilogramów. Dawne pole nominalKg (asysta kg, 0.5) jest przy imporcie
 * starych kopii przyjmowane i usuwane w migrate (T-055); aplikacja go nie zapisuje ani nie czyta. */
export interface Band extends Base { color: string; level: number }
/** id (schemat 10): stabilny klucz wiersza w edytorze (przesuwanie/usuwanie nie myli pól). */
/** E2 W3 (schemat 16, docs/14 pkt 2.1): zamiennik pozycji szablonu w miejscu — „w Domu zamiast A robię B” (albo A innym przyrządem — P5a).
 * restSec null = przerwa pozycji szablonu (D4 a); impl — przyrząd przypinany przy przyjęciu. Usunięte miejsce: wpis zostaje (M7). */
export interface TemplateAlt { locationId: string; exerciseId: string; restSec: number | null; impl?: Impl }
/** Wiersz serii w pozycji szablonu (schemat 17, decyzja 05.10.2026 „szablon = nieaktywny trening”): typ i plan wartości (`weight` — jak dawny
 * ciężar startowy: przy ćwiczeniach z masą ciała ±kg). */
export interface TRow { id: string; kind: SetKind; reps: number | ''; weight: number | ''; durationSec: number | ''; distanceM: number | ''; /** guma serii (ćwiczenia z gumą, 06.10.2026) */ bandId?: string }
export interface TemplateItem { id: string; exerciseId: string; /** liczba serii — z `rows`, gdy są */ sets: number; repMin: number | null; repMax: number | null; /** null = przerwa z ćwiczenia / domyślna (runda 2) */ restSec: number | null; startWeight: number | ''; targetSec: number | ''; groupId: string | null; /** E2 W3: zamienniki per miejsce (najwyżej jeden na miejsce) */ alternates?: TemplateAlt[]; /** schemat 17: serie jako wiersze; brak = `sets` zwykłych serii z `startWeight` (dane sprzed 17 bez zmian) */ rows?: TRow[] }
export interface Template extends Base { name: string; items: TemplateItem[]; /** P-003: opcjonalne miejsce domyślne szablonu (brak = miejsce główne) */ locationId?: string; /** 07.10.2026 wieczór (docs/21 4a): folder na liście szablonów (≤ 40 znaków; brak = bez folderu) */ folder?: string; /** 07.10.2026 wieczór: w archiwum — poza listą startu, do przywrócenia */ archived?: true; /** audyt 0.10 UX-10: notatka szablonu (≤ TEMPLATE_NOTE_MAX; generator wpisuje jedną linijkę wysiłku — RIR); brak = bez notatki */ note?: string }
export interface WSet { id: string; weight: number | ''; reps: number | ''; durationSec: number | ''; distanceM: number | ''; rpe: number | ''; bandId: string; addKg: number | ''; kind: SetKind; warmup: boolean; note: string; done: boolean; completedAt: number | null; actualRest: number | null; /** wpisane ręcznie w tym treningu (nie z podpowiedzi) */ edited?: boolean; /** pola uzupełnione z podpowiedzi przy odhaczeniu: {pole: wstawiona wartość} */ hinted?: Record<string, unknown>; /** guma zdjęta ręcznie (cykl do „—”): podpowiedź ani poprzednia seria jej nie przywracają */ noBand?: boolean; /** wartości wstawione przez aplikację przy starcie (poprzedni trening / ciężar startowy) — decyzja 02.10: zmiana w serii przechodzi na nieruszone dalsze serie o tej samej wartości */ pre?: Partial<Record<'weight' | 'reps' | 'distanceM' | 'addKg', number>> }
/** groupId (0.4): ćwiczenia z tym samym groupId tworzą superset — przerwa startuje dopiero po serii ostatniego ćwiczenia grupy. */
/** Decyzja 8c (03.10.2026): przyrząd / źródło obciążenia, którym zrobiono blok (rozstrzygnięte w miejscu treningu — lib/equipment.ts implAt).
 * 'electric' = stacja z oporem elektrycznym / magnetycznym (inteligentna stacja kablowa), 'cable' = zwykły wyciąg. Brak = trening bez miejsca albo dane sprzed schematu 15. */
export const IMPLS = ['barbell', 'ez_bar', 'trap_bar', 'dumbbell', 'kettlebell', 'cable', 'electric', 'machine'] as const;
export type Impl = typeof IMPLS[number];
export interface WExercise { id: string; exerciseId: string; restSec: number; repMin: number | null; repMax: number | null; groupId: string | null; sets: WSet[]; /** pozycja szablonu, z której powstał blok (runda 10) */ tplItemId?: string; /** decyzja 8c: przyrząd użyty w bloku (tylko gdy trening ma miejsce) */ impl?: Impl; /** E2 (schemat 16): id ćwiczenia, które ten blok zastąpił (oryginał — A→B→C zostaje A); trening w toku i historia */ swappedFrom?: string; /** E2 D5 (schemat 16): przyrząd wybrany ręcznie — restampUntouched go nie nadpisuje */ implPinned?: true; /** E2 (schemat 16), tylko trening w toku: id bloku A, z którego po podziale wydzielono ten blok (rundy supersetu, cofnięcie) */ splitFrom?: string; /** E2 W3 (schemat 16), tylko trening w toku: podpowiedź zamiennika odrzucona „✕” */ altSkip?: true; /** 07.10.2026 wieczór (docs/21 4a), tylko trening w toku: „Pomiń dziś” — reszta bloku pominięta, szablon bez zmian */ skipped?: true; /** audyt 0.10 (D1+, 08.10.2026): trening deload — liczba serii roboczych bloku przed cięciem (tylko gdy cięcie ją zmniejszyło); „Powtórz ostatni” przywraca z niej pełny blok, gdy pozycji szablonu już nie ma */ deloadFull?: number }
export interface Workout extends Base { loggedBy: string; sessionMode: SessionMode; healthUUID: string | null; templateId: string | null; templateName: string; startedAt: number; finishedAt: number | null; note: string; exercises: WExercise[]; /** trening w toku: „Kontynuuj” po pytaniu o porzucony trening (runda 69) */ staleAck?: number; /** P-003: miejsce treningu (tylko gdy są zdefiniowane miejsca) */ locationId?: string; /** 08.10.2026 (pauza, decyzja właściciela): zakończone pauzy [od, do] (ms) — ich suma odejmuje się od czasu trwania; przedziały, nie sama suma, żeby wydanie Health mogło zapisać zdarzenia pauzy */ pauses?: [number, number][]; /** pauza trwająca od tej chwili (tylko trening w toku) */ pausedAt?: number; /** audyt 0.10 (D1+, 08.10.2026): trening rozpoczęty z cięciem deload („Mniej serii”) — znacznik w historii; „Powtórz ostatni” nie tnie go drugi raz i umie wrócić do pełnego */ deload?: true; /** audyt 0.10 J2 (fala 2): zakończony z włączoną synchronizacją, a jeszcze nie zapisany w Apple Health — ponawiany przy starcie i powrocie z tła (lib/health.retryHealth); tylko true */ healthPending?: true; /** audyt 0.10 J3 (DAT-07, wariant B, 08.10.2026): przesunięcie strefy czasowej telefonu przy starcie treningu w minutach na wschód od UTC (Polska latem 120) — dzień i tydzień treningu liczone z niego (lib/store.wallTs); brak = strefa bieżąca, jak dotąd */ tzOffsetMin?: number; }
export interface Morning extends Base { date: string; bb: number | ''; sleepScore: number | ''; sleepH: number | ''; weight: number | '' }
/** language/unit (0.8, schemat 9, LOC-01/02): 'auto' = język systemu; masa zawsze zapisywana w kg. */
export type ThemeSetting = 'light' | 'dark' | 'auto';
/** Widok treningu w toku (styl „Tuleja”, decyzja właściciela 07.10.2026; docs/21 pkt 3): karta bieżącej serii na górze albo sama lista ćwiczeń. */
export const WORKOUT_VIEWS = ['focus', 'list'] as const;
export type WorkoutView = typeof WORKOUT_VIEWS[number];
export interface Settings { defaultRest: number; sound: boolean; wakeLock: boolean; showRpe: boolean; /** 08.10.2026 (pakiet C): skala pola wysiłku — zapis zawsze jako RPE, RIR = 10 − RPE (Zourdos i in. 2016; niezależnie opisane: Bastos i in. 2024, PMC11127506) */ effortScale?: 'rpe' | 'rir'; /** 08.10.2026: przypomnienie o treningu z planu — brak = włączone; zapisywane tylko false (lib/planReminder) */ planReminder?: false; healthSync: boolean; /** runda 75 (T-017): cicha podpowiedź progresji */ progressHint: boolean; /** runda 75 (T-012): kopia JSON po każdym treningu w Plikach */ autoBackup: boolean; /** runda 75 (T-013): przypomnienie o wadze w poniedziałek rano */ weighReminder: boolean; modules: Record<ModuleId, boolean>; language: LangSetting; unit: Unit; /** P-003 (schemat 14): miejsca treningu; brak miejsc = zachowanie jak przed schematem 14 */ locations: Location[]; mainLocationId: string | null; /** wybór ćwiczenia: pokaż także niedostępne w miejscu (zapamiętany przełącznik) */ pickerShowAll: boolean; /** research biblioteki (decyzja właściciela 09.10.2026, wariant B): lista Ćwiczeń i wybór ćwiczenia pokazują także ćwiczenia niszowe (filtr „Podstawowe” zdjęty); brak = tylko podstawowe + własne + użyte */ libShowAll?: true; /** decyzja 05.10.2026: wygląd — domyślnie jasna Kreda; 'auto' = jak w telefonie */ theme: ThemeSetting; /** 07.10.2026: domyślnie 'focus' */ workoutView: WorkoutView }
/** P-003: sprzęt w miejscu — pozycja z lib/equipment.ts, zaznaczone opcje i (dla sprzętu z ciężarami) opis dostępnych ciężarów. */
export interface LocEquip { item: string; opts: string[]; load?: LoadSpec; /** audyt E1 (M5): pozycja odznaczona — opcje i ciężary zostają na wypadek ponownego zaznaczenia */ off?: true; /** gumy (decyzja właściciela 05.10.2026): posiadane poziomy 1–7 w tym miejscu (jak lista ciężarów); brak = wszystkie gumy */ levels?: number[] }
export interface Location extends Base { name: string; equipment: LocEquip[] }
/** Zapisany (nieaktywny) plan tygodnia — docs/24 sekcja 1. */
export interface SavedPlan { id: string; name: string; days: (string | null)[]; /** audyt 0.10 B1 (DAT-02 B, decyzja właściciela 08.10.2026 wieczór): zmiany pojedynczych dni od dnia wyłączenia planu — wracają przy ponownej aktywacji */ overrides?: Record<string, string | null> }
/** Odcinek historii planu tygodnia (schemat 18, audyt 0.10 A1): od dnia `from` (RRRR-MM-DD) obowiązywały dni `days` (pon…nd); do następnego odcinka. */
export interface PlanSegment { from: string; days: (string | null)[] }
export interface State { v: number; schemaVersion: number; ownerId: string; settings: Settings; exercises: Exercise[]; bands: Band[]; templates: Template[]; workouts: Workout[]; active: Workout | null; mornings: Morning[]; relations: CoachingRelation[]; feedback: Feedback[]; instructions: NextSessionInstructions[]; timer: TimerState; metaUpdatedAt?: number; userTouched?: boolean; /** katalog 04.10.2026: nowe ćwiczenia biblioteki już dopisane — pierwszy krok (wartość stała, czyta ją build 643cba7) */ libExtra?: string; /** ostatni dopisany krok katalogu (LIB_EXTRA_REVS) */ libExtraStep?: string; /** decyzja 05.10.2026 (1.a): nowy sprzęt dopisany do miejsc z presetu siłowni (GYM_FILL.rev) */ equipFill?: string; /** research biblioteki (09.10.2026, L5 Q7): ściana i maszyna do dipów dopisane raz do zapisanych miejsc (EQUIP_FILL2.rev) */ equipFill2?: string; /** 05.10.2026: nowe opcje sprzętu dopisane raz do istniejących pozycji (OPT_FILL.rev) */ optFill?: string; /** pakiet C (08.10.2026): tygodnie oznaczone ręcznie jako deload — poniedziałki RRRR-MM-DD; tylko etykieta, bez porad */ deloadWeeks?: string[]; /** kalendarz (08.10.2026): stały plan tygodnia pon…nd — id szablonu albo null */ weekPlan?: { days: (string | null)[]; /** 08.10.2026: nazwa aktywnego planu (≤ 40 znaków) */ name?: string }; /** 08.10.2026 (docs/24): inne zapisane plany tygodnia — „Ustaw jako aktywny” zamienia z weekPlan */ savedPlans?: SavedPlan[]; /** zmiany pojedynczych dni RRRR-MM-DD → id szablonu albo null (wolne) */ planOverrides?: Record<string, string | null>; /** schemat 18 (audyt 0.10 A1): historia planu — odcinki rosnąco po `from`; ostatni = weekPlan.days (lib/plan.ts) */ planHistory?: PlanSegment[]; /** audyt 0.10 D4: „Nie teraz” przy podpowiedzi deload — poniedziałek proponowanego tygodnia (RRRR-MM-DD) */ deloadSnooze?: string; /** „Co nowego” (08.10.2026): id ostatnio otwartego wpisu (lib/whatsnew) */ whatsNewSeen?: string; /** przewodnik (08.10.2026): id przeczytanych tematów (lib/guide) */ guideSeen?: string[]; /** audyt 0.10 (fala 2, decyzja: masa ciała z datą): pomiary masy ciała (kg) rosnąco po dacie, jeden na dzień — e1RM ćwiczeń z masą ciała liczony z ostatniego pomiaru nie późniejszego niż dzień treningu (store.bodyMassOn); dawne Settings.bodyMass (bez daty) migruje do pierwszego wpisu; brak = nie podano */ bodyMassLog?: BodyMassEntry[]; /** audyt 0.10 UX-16 A: zachęta do planu tygodnia ukryta („Ukryj” — kto tylko zapisuje treningi); brak = widoczna */ planHintHidden?: true }
/** Pomiar masy ciała: dzień RRRR-MM-DD i kg (> 0, ≤ BODY_MASS_MAX, siatka 0,01). */
export interface BodyMassEntry { date: string; kg: number }

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

// [nazwa, partia, sprzęt, asysta gumą] — ćwiczenia z pierwszej wersji (125; od researchu biblioteki 09.10.2026: 124 — Rear Delt Raise (hantle) scalone z Reverse Fly (hantle), Upright Row → Upright Row (hantle)); ćwiczenia dodane w katalogu 04.10.2026 dochodzą z CATALOG_LIB_EXTRA (niżej)
const LIB_BASE: [string, Group, Equipment, boolean?][] = [
  ['Bench Press (sztanga)','klatka','sztanga'],['Bench Press (hantle)','klatka','hantle'],['Incline Bench Press (sztanga)','klatka','sztanga'],['Incline Bench Press (hantle)','klatka','hantle'],['Decline Bench Press','klatka','sztanga'],['Chest Fly (hantle)','klatka','hantle'],['Cable Fly','klatka','linki'],['Pec Deck','klatka','maszyna'],['Machine Chest Press','klatka','maszyna'],['Wyciskanie na linkach (stojąc)','klatka','linki'],['Chest Dip','klatka','masa ciała',true],['Push Up','klatka','masa ciała'],['Incline Push Up','klatka','masa ciała'],['Diamond Push Up','triceps','masa ciała'],
  ['Deadlift (sztanga)','plecy','sztanga'],['Deadlift (hantle)','plecy','hantle'],['Sumo Deadlift','plecy','sztanga'],['Trap Bar Deadlift','plecy','sztanga'],['RDL (sztanga)','plecy','sztanga'],['RDL (hantle/linki)','plecy','hantle'],['Bent Over Row (sztanga)','plecy','sztanga'],['Bent Over Row (hantle)','plecy','hantle'],['Pendlay Row','plecy','sztanga'],['One Arm Row (hantle)','plecy','hantle'],['Chest Supported Row','plecy','hantle'],['T-Bar Row','plecy','sztanga'],['Seated Cable Row','plecy','linki'],['Wiosłowanie na linkach (siedząc)','plecy','linki'],['Lat Pulldown','plecy','linki'],['Straight Arm Pulldown','plecy','linki'],['Chin Up','plecy','masa ciała',true],['Pull Up','plecy','masa ciała',true],['Neutral Grip Pull Up','plecy','masa ciała',true],['Inverted Row','plecy','masa ciała'],['Face Pull','plecy','linki'],['Back Extension','plecy','masa ciała'],['Shrugs (hantle)','plecy','hantle'],['Shrugs (sztanga)','plecy','sztanga'],['Good Morning','plecy','sztanga'],
  ['Overhead Press (sztanga)','barki','sztanga'],['Overhead Press (hantle)','barki','hantle'],['Seated Shoulder Press (hantle)','barki','hantle'],['Arnold Press','barki','hantle'],['Push Press','barki','sztanga'],['Machine Shoulder Press','barki','maszyna'],['Wyciskanie nad głowę (linki)','barki','linki'],['Lateral Raise (hantle)','barki','hantle'],['Cable Lateral Raise','barki','linki'],['Front Raise','barki','hantle'],['Reverse Fly (hantle)','barki','hantle'],['Reverse Pec Deck','barki','maszyna'],['Upright Row (hantle)','barki','hantle'],
  ['Biceps Curl (hantle)','biceps','hantle'],['Barbell Curl','biceps','sztanga'],['EZ Bar Curl','biceps','sztanga'],['Hammer Curl','biceps','hantle'],['Incline Curl (hantle)','biceps','hantle'],['Concentration Curl (hantle)','biceps','hantle'],['Preacher Curl','biceps','hantle'],['Spider Curl','biceps','hantle'],['Cable Curl','biceps','linki'],
  ['Skullcrusher (hantle)','triceps','hantle'],['Skullcrusher (EZ)','triceps','sztanga'],['Triceps Dips (ławka)','triceps','masa ciała'],['Triceps Pushdown','triceps','linki'],['Overhead Triceps Extension (hantel)','triceps','hantle'],['Cable Overhead Extension','triceps','linki'],['Close Grip Bench Press','triceps','sztanga'],['Triceps Kickback','triceps','hantle'],
  ['Back Squat','nogi','sztanga'],['Front Squat','nogi','sztanga'],['Goblet Squat','nogi','hantle'],['Przysiad z pasem (linki)','nogi','linki'],['Box Squat','nogi','sztanga'],['Hack Squat','nogi','maszyna'],['Leg Press','nogi','maszyna'],['Bulgarian Split Squat (hantle)','nogi','hantle'],['Lunges (hantle)','nogi','hantle'],['Walking Lunges','nogi','hantle'],['Reverse Lunge','nogi','hantle'],['Step Up','nogi','hantle'],['Leg Extension','nogi','maszyna'],['Leg Curl','nogi','maszyna'],['Lying Leg Curl','nogi','maszyna'],['Nordic Curl','nogi','masa ciała',true],['Pistol Squat','nogi','masa ciała',true],['Sissy Squat','nogi','masa ciała'],['Wall Sit','nogi','masa ciała'],
  ['Hip Thrust (sztanga)','pośladki','sztanga'],['Hip Thrust (hantel)','pośladki','hantle'],['Glute Bridge','pośladki','masa ciała'],['Cable Kickback','pośladki','linki'],['Hip Abduction','pośladki','maszyna'],['Hip Adduction','pośladki','maszyna'],['Kettlebell Swing','pośladki','hantle'],
  ['Standing Calf Raise','łydki','maszyna'],['Seated Calf Raise','łydki','maszyna'],['Łydki na stopniu','łydki','hantle'],['Calf Press (leg press)','łydki','maszyna'],
  ['Plank','core','masa ciała'],['Side Plank','core','masa ciała'],['Dead Bug','core','masa ciała'],['Bird Dog','core','masa ciała'],['Ab Wheel','core','masa ciała'],['Pallof Press','core','linki'],['Hanging Leg Raise','core','masa ciała'],['Hanging Knee Raise','core','masa ciała'],['Cable Crunch','core','linki'],['Crunch','core','masa ciała'],['Reverse Crunch','core','masa ciała'],['Russian Twist','core','hantle'],['Hollow Hold','core','masa ciała'],["Farmer's Walk",'core','hantle'],['Suitcase Carry','core','hantle'],['Mountain Climbers','core','masa ciała'],
  ['Incline Walk (bieżnia)','cardio','inne'],['Bieg','cardio','inne'],['Rower','cardio','inne'],['Rowing Machine','cardio','maszyna'],['Assault Bike','cardio','maszyna'],['Skakanka','cardio','inne'],['Burpees','cardio','masa ciała'],['Box Jump','nogi','masa ciała'],['Medicine Ball Slam','cardio','inne'],
];

/** Katalog 04.10.2026: regiony mięśni do obciążenia partii (dane w catalog.json; przyszła regeneracja partii). */
export const REGION_LABEL: Record<MuscleRegion, string> = { chest: 'klatka', front_delt: 'barki — przód', side_delt: 'barki — bok', rear_delt: 'barki — tył', lats: 'najszersze grzbietu', upper_back: 'góra pleców', lower_back: 'prostowniki grzbietu', biceps: 'biceps', triceps: 'triceps', forearms: 'przedramiona', abs: 'brzuch', obliques: 'skośne brzucha', glutes: 'pośladki', quads: 'czworogłowe', hamstrings: 'dwugłowe', adductors: 'przywodziciele', abductors: 'odwodziciele', calves: 'łydki', neck: 'szyja' };
/** Partia aplikacji (pola muscles / secondaryMuscles), do której należy region katalogu. Odwodziciele → pośladki (pośladkowy średni i mały to główne
 * odwodziciele biodra — uproszczenie: mapa partii nie ma osobnych odwodzicieli); szyja — poza mapą partii (null). */
export const REGION_MUSCLE: Readonly<Record<MuscleRegion, Muscle | null>> = { chest: 'klatka', front_delt: 'barki', side_delt: 'barki', rear_delt: 'barki', lats: 'plecy', upper_back: 'plecy', lower_back: 'plecy', biceps: 'biceps', triceps: 'triceps', forearms: 'przedramiona', abs: 'core', obliques: 'core', glutes: 'pośladki', quads: 'czworogłowe', hamstrings: 'dwugłowe', adductors: 'przywodziciele', abductors: 'pośladki', calves: 'łydki', neck: null };
/** Obciążenie partii ćwiczenia z biblioteki (1 główny, 0,5 pomocniczy, 0,25 stabilizacja), od największego; ćwiczenia własne i przemianowane — brak.
 * Audyt kontrolny 1 (UX2-06, wariant A — jedno źródło prawdy): poziomy ●●● / ●● wynikają z pól ćwiczenia (partie główne / pomocnicze po researchu
 * L1–L6 albo zmianie użytkownika). Region partii spoza pól traci ●●/●●● (zostaje tylko ● stabilizacja z katalogu); ●●● partii pomocniczej → ●●;
 * partia z pól bez poziomu dostaje go na swoim najmocniejszym regionie z katalogu. Żadnego regionu nie dopisujemy. */
export const muscleLoadOf = (e: Pick<Exercise, 'lib' | 'libKey'> & Partial<Pick<Exercise, 'muscles' | 'secondaryMuscles'>>): [MuscleRegion, number][] => {
  const k = catalogKey(e); const m = k ? own(MUSCLE_LOAD as Record<string, Partial<Record<MuscleRegion, number>>>, k) : undefined; /* E2: po kluczu katalogu */ if (!m) return [];
  const P = new Set<Muscle>(e.muscles ?? []), S = new Set<Muscle>(e.secondaryMuscles ?? []);
  const rows = (Object.entries(m) as [MuscleRegion, number][]).map(([r, w]): [MuscleRegion, number] | null => {
    const M = REGION_MUSCLE[r]; if (!M || P.has(M)) return [r, w]; if (S.has(M)) return [r, Math.min(w, 0.5)]; return w >= 0.5 ? null : [r, w];
  }).filter((x): x is [MuscleRegion, number] => !!x);
  const lift = (M: Muscle, to: number) => { const rs = rows.filter(([r]) => REGION_MUSCLE[r] === M); if (!rs.length || rs.some(([, w]) => w === to)) return; rs.sort((a, b) => b[1] - a[1])[0][1] = to; };
  for (const M of P) lift(M, 1); for (const M of S) if (!P.has(M)) lift(M, 0.5);
  return rows.sort((a, b) => b[1] - a[1]);
};
/** Katalog 04.10.2026 (decyzja właściciela: rozbudowa własnego katalogu): nowe ćwiczenia biblioteki — JEDNO źródło: docs/research/equipment/catalog.json
 * (pola group/equipment/metric/loadMode/muscles), generowane do lib/catalog.generated.ts. */
const EXTRA = new Map(CATALOG_LIB_EXTRA.map(r => [r[0], r]));
export const LIB_EXTRA_NAMES: readonly string[] = CATALOG_LIB_EXTRA.map(r => r[0]);
/** Nazwy 125 ćwiczeń pierwszej wersji (reguły migracji danych sprzed schematu 10 — runda 52/56). */
export const LIB_BASE_NAMES: ReadonlySet<string> = new Set(LIB_BASE.map(l => l[0]));
/** Nazwy pierwszej wersji biblioteki (125, także scalone i przemianowane później) — tylko reguła danych sprzed schematu 10 (flaga lib). */
export const LIB_BASE_NAMES_V1: ReadonlySet<string> = new Set([...LIB_BASE_NAMES, 'Upright Row', 'Rear Delt Raise (hantle)']);
/** Kroki dopisywania ćwiczeń katalogu do danych użytkownika (State.libExtraStep = ostatni dopisany krok, State.libExtra = pierwszy — audyt kroku b; pole „added” w catalog.json). Audyt 04.10 (HIGH):
 * osobny znacznik, nie numer schematu — schemat 16 miał już build sprzed katalogu (01f2bee), więc granica „< 16” pomijałaby te dane.
 * Krok b (04.10.2026, wieczór): jednorącz/oburącz jako osobne ćwiczenia, partia „przywodziciele”, nowy sprzęt i ćwiczenia. */
export const LIB_EXTRA_REVS: readonly string[] = CATALOG_ADDED_REVS;
export const LIB_EXTRA_REV = LIB_EXTRA_REVS[LIB_EXTRA_REVS.length - 1];
/** Krok, w którym ćwiczenie katalogu trafia do danych użytkownika. */
export const libExtraRevOf = (name: string): string | undefined => EXTRA.get(name)?.[8];
/** Poprawki zgrubnych partii ćwiczeń biblioteki przy kroku katalogu — tylko gdy zapisane partie są dokładnie dawnymi domyślnymi (zmian użytkownika
 * nie ruszamy); nowe partie = musclesFor (jedno źródło). */
export const LIB_MUSCLE_FIXES: readonly { rev: string; name: string; from: [Muscle[], Muscle[]] }[] = [
  { rev: 'katalog-2026-10-04b', name: 'Hip Adduction', from: [['pośladki'], []] },
  { rev: 'katalog-2026-10-04b', name: 'Copenhagen Plank', from: [['core'], []] },
];
export const LIB: [string, Group, Equipment, boolean?][] = [...LIB_BASE, ...CATALOG_LIB_EXTRA.map(r => [r[0], r[1] as Group, r[2] as Equipment, r[3]] as [string, Group, Equipment, boolean])];
/** E2 (audyt 0.10): nazwy kanoniczne całego katalogu — dozwolone wartości Exercise.libKey. */
export const LIB_KEYS: ReadonlySet<string> = new Set(LIB.map(r => r[0]));
/** E2 (audyt 0.10, X-03): klucz katalogu ćwiczenia z biblioteki (tylko prawidłowy) — nazwa wyświetlana nie wpływa na reguły. */
export const catalogKey = (e: Pick<Exercise, 'lib' | 'libKey'> | null | undefined): string | undefined => e?.lib === true && typeof e.libKey === 'string' && LIB_KEYS.has(e.libKey) ? e.libKey : undefined;
/** E2: ćwiczenie z 125 podstawowych (generator bierze je najpierw) — po kluczu, nie po nazwie. */
export const isLibBase = (e: Pick<Exercise, 'lib' | 'libKey'>): boolean => { const k = catalogKey(e); return !!k && LIB_BASE_NAMES.has(k); };
/** Metryka dla pozycji biblioteki innych niż ciężar+powtórzenia. Używane też w migracji (po nazwie). */
export const METRIC_BY_NAME: Record<string, MetricType> = {
  'Plank': 'time', 'Side Plank': 'time', 'Wall Sit': 'time', 'Hollow Hold': 'time', 'Skakanka': 'time', 'Mountain Climbers': 'time',
  "Farmer's Walk": 'weight_distance', 'Suitcase Carry': 'weight_distance', /* research 25: noszenie — ciężar + dystans */
  'Incline Walk (bieżnia)': 'distance_time', 'Bieg': 'distance_time', 'Rower': 'distance_time', 'Rowing Machine': 'distance_time', 'Assault Bike': 'distance_time',
  'Burpees': 'reps', 'Box Jump': 'reps', 'Medicine Ball Slam': 'reps', 'Bird Dog': 'reps', 'Dead Bug': 'reps',
};
/** Runda 55: tylko własne klucze tablic (nazwa „toString” czy „constructor” nie trafia w Object.prototype). */
export const own = <T,>(o: Record<string, T>, k: string): T | undefined => Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined;
export const metricFor = (name: string): MetricType => own(METRIC_BY_NAME, name) ?? (EXTRA.get(name)?.[4] as MetricType | undefined) ?? 'weight_reps';

/** Partie mięśniowe głównych ćwiczeń biblioteki: [główne, pomocnicze]. Reszta bierze partię z pola group. */
export const MUSCLES_BY_NAME: Record<string, [Muscle[], Muscle[]]> = {
  'Bench Press (sztanga)': [['klatka'], ['triceps', 'barki']], 'Bench Press (hantle)': [['klatka'], ['triceps', 'barki']], 'Incline Bench Press (sztanga)': [['klatka'], ['barki', 'triceps']], 'Incline Bench Press (hantle)': [['klatka'], ['barki', 'triceps']], 'Decline Bench Press': [['klatka'], ['triceps']], 'Machine Chest Press': [['klatka'], ['triceps']], 'Wyciskanie na linkach (stojąc)': [['klatka'], ['triceps']], 'Chest Dip': [['klatka'], ['triceps']], 'Push Up': [['klatka'], ['triceps', 'barki']], 'Incline Push Up': [['klatka'], ['triceps']], 'Diamond Push Up': [['triceps'], ['klatka']],
  'Deadlift (sztanga)': [['dwugłowe', 'pośladki'], ['plecy', 'czworogłowe']], 'Deadlift (hantle)': [['dwugłowe', 'pośladki'], ['plecy']], 'Sumo Deadlift': [['pośladki', 'czworogłowe'], ['plecy', 'dwugłowe']], 'Trap Bar Deadlift': [['czworogłowe', 'pośladki'], ['dwugłowe', 'plecy']], 'RDL (sztanga)': [['dwugłowe'], ['pośladki', 'plecy']], 'RDL (hantle/linki)': [['dwugłowe'], ['pośladki', 'plecy']], 'Bent Over Row (sztanga)': [['plecy'], ['biceps']], 'Bent Over Row (hantle)': [['plecy'], ['biceps']], 'Pendlay Row': [['plecy'], ['biceps']], 'One Arm Row (hantle)': [['plecy'], ['biceps']], 'Chest Supported Row': [['plecy'], ['biceps']], 'T-Bar Row': [['plecy'], ['biceps']], 'Seated Cable Row': [['plecy'], ['biceps']], 'Wiosłowanie na linkach (siedząc)': [['plecy'], ['biceps']], 'Lat Pulldown': [['plecy'], ['biceps']], 'Chin Up': [['plecy'], ['biceps']], 'Pull Up': [['plecy'], ['biceps']], 'Neutral Grip Pull Up': [['plecy'], ['biceps']], 'Inverted Row': [['plecy'], ['biceps']], 'Face Pull': [['barki'], ['plecy']], 'Good Morning': [['dwugłowe'], ['plecy']], 'Back Extension': [['plecy', 'dwugłowe'], ['pośladki']], /* katalog 04.10.2026: korekty zgrubnych partii po przeglądzie obciążenia (Upright Row, Farmer's Walk, Back Extension) — tylko nowe instalacje; zapisane ćwiczenia bez zmian */
  'Overhead Press (sztanga)': [['barki'], ['triceps']], 'Overhead Press (hantle)': [['barki'], ['triceps']], 'Seated Shoulder Press (hantle)': [['barki'], ['triceps']], 'Arnold Press': [['barki'], ['triceps']], 'Push Press': [['barki'], ['triceps', 'czworogłowe']], 'Machine Shoulder Press': [['barki'], ['triceps']], 'Wyciskanie nad głowę (linki)': [['barki'], ['triceps']], 'Upright Row (hantle)': [['barki'], ['plecy', 'biceps']],
  'Close Grip Bench Press': [['triceps'], ['klatka']], 'Triceps Dips (ławka)': [['triceps'], ['klatka']],
  'Back Squat': [['czworogłowe'], ['pośladki', 'przywodziciele']] /* docs/24 pkt 2.1 i Q1 B (09.10.2026) */, 'Front Squat': [['czworogłowe'], ['pośladki', 'core']], 'Goblet Squat': [['czworogłowe'], ['pośladki']], 'Przysiad z pasem (linki)': [['czworogłowe'], ['pośladki']], 'Box Squat': [['czworogłowe'], ['pośladki']], 'Hack Squat': [['czworogłowe'], ['pośladki']], 'Leg Press': [['czworogłowe'], ['pośladki', 'przywodziciele']] /* docs/24 Q1 B (09.10.2026) */, 'Bulgarian Split Squat (hantle)': [['czworogłowe', 'pośladki'], []], 'Lunges (hantle)': [['czworogłowe', 'pośladki'], []], 'Walking Lunges': [['czworogłowe', 'pośladki'], []], 'Reverse Lunge': [['czworogłowe', 'pośladki'], []], 'Step Up': [['czworogłowe', 'pośladki'], []], 'Leg Extension': [['czworogłowe'], []], 'Leg Curl': [['dwugłowe'], []], 'Lying Leg Curl': [['dwugłowe'], []], 'Nordic Curl': [['dwugłowe'], []], 'Pistol Squat': [['czworogłowe'], ['pośladki']], 'Sissy Squat': [['czworogłowe'], []], 'Wall Sit': [['czworogłowe'], []],
  'Hip Adduction': [['przywodziciele'], []], 'Hip Thrust (sztanga)': [['pośladki'], []], 'Hip Thrust (hantel)': [['pośladki'], []], 'Glute Bridge': [['pośladki'], []], 'Kettlebell Swing': [['pośladki', 'dwugłowe'], ['plecy']],
  "Farmer's Walk": [['przedramiona', 'plecy'], ['core']], 'Suitcase Carry': [['core'], ['przedramiona']],
  'Box Jump': [['czworogłowe'], ['pośladki', 'łydki']], /* research 25 (L6): skok — czworogłowe główne */
};
/** E4 (audyt 0.10, MER-10; decyzja właściciela 08.10.2026: teraz wariant B, źródła — wariant A — osobnym researchem): partie z katalogu są
 * uproszczeniem bez źródeł (docs/research/equipment/catalog-notes.md; przykład sprzeczny z badaniem: Back Squat → dwugłowe, Kubo i in. 2019).
 * Ćwiczenie katalogu dostaje tu wpis (klucz → źródła, docs/research), gdy jego przypisanie ma źródła — wtedy ekran ćwiczenia przestaje pokazywać
 * dopisek „uproszczenie” (tylko gdy partie są nadal takie jak w katalogu). Na razie pusto. */
export const MUSCLE_SOURCES: Readonly<Record<string, string>> = Object.fromEntries(Object.entries(CATALOG_RESEARCH).filter(([, r]) => /^(mocne|umiarkowane)/.test(r[1]) && r[2].length).map(([k, r]) => [k, `docs/research/25-biblioteka/${r[0]}: ${r[2].join(', ')}`]));
/** Research 25 (09.10.2026): pewność przypisania partii (mocne / umiarkowane / jedno źródło / brak źródła — uproszczenie; „(analogia)”) — po kluczu katalogu. */
export const muscleConfidence = (e: Pick<Exercise, 'lib' | 'libKey'>): string | undefined => { const k = catalogKey(e); return k ? own(CATALOG_RESEARCH as Record<string, readonly [string, string, readonly string[]]>, k)?.[1] : undefined; };
/** L2 Q1/Q2/Q5 (decyzja 09.10.2026): mięsień docelowy spoza mapy regionów (stożek rotatorów, zębaty przedni, piszczelowy przedni) — oznaczenie przy partiach. */
export const unmappedMuscleOf = (e: Pick<Exercise, 'lib' | 'libKey'>): string | undefined => { const k = catalogKey(e); return k ? own(CATALOG_UNMAPPED as Record<string, string>, k) : undefined; };
/** Research biblioteki (decyzja właściciela 09.10.2026, wariant B): ćwiczenie NISZOWE — w katalogu, ale poza listą domyślną (po kluczu katalogu). */
export const isNiche = (e: Pick<Exercise, 'lib' | 'libKey'>): boolean => { const k = catalogKey(e); return !!k && CATALOG_NICHE.has(k); };
/** Krok danych 09.10.2026: dawne klucze przemianowane (→ nowy klucz), scalone (→ klucz docelowy) i usunięte z biblioteki. */
export const LIB_RENAMED: Readonly<Record<string, string>> = CATALOG_STEP.renamed;
export const LIB_MERGED: Readonly<Record<string, string>> = CATALOG_STEP.merged;
export const LIB_REMOVED: ReadonlySet<string> = new Set(CATALOG_STEP.removed);
/** Klucze wycofane z katalogu (scalone i usunięte) — migrate przenosi ich dane (lib/store.ts retireCatalog). */
export const LIB_RETIRED: ReadonlySet<string> = new Set([...Object.keys(LIB_MERGED), ...LIB_REMOVED]);
/** Poprawki pól kopiowanych do ćwiczenia (partia, miara, tryb, asysta gumą, partie mięśni) przy kroku katalogu — tylko gdy zapisana wartość jest
 * dokładnie dawną domyślną (zmian użytkownika nie ruszamy); miara i tryb ciężaru z innym mnożnikiem objętości (X2-01) — tylko gdy ćwiczenie nie ma
 * serii ani pozycji szablonu (nic nie znika z widoku, zapisane ciężary nie zmieniają sensu); asysta gumą (DAT2-01) — tylko bez serii z gumą. */
export const LIB_FIELD_FIXES: readonly { rev: string; name: string; field: 'group' | 'metric' | 'loadMode' | 'bandAssistable' | 'muscles' | 'secondaryMuscles'; from: unknown; to: unknown }[] =
  CATALOG_STEP.fieldFixes.map(f => ({ rev: CATALOG_STEP.rev, name: f.name, field: f.field as 'group', from: f.from, to: f.to }));
export const musclesSourced = (e: Pick<Exercise, 'lib' | 'libKey' | 'group' | 'muscles' | 'secondaryMuscles'>): boolean => {
  const k = catalogKey(e); if (!k || !own(MUSCLE_SOURCES, k)) return false;
  const [a, b] = musclesFor(k, e.group); const same = (x: readonly string[], y: readonly string[]) => x.length === y.length && x.every(v => y.includes(v));
  return same(e.muscles ?? [], a) && same(e.secondaryMuscles ?? [], b);
};
export const GROUP_TO_MUSCLE: Partial<Record<Group, Muscle>> = { klatka: 'klatka', plecy: 'plecy', barki: 'barki', biceps: 'biceps', triceps: 'triceps', nogi: 'czworogłowe', pośladki: 'pośladki', łydki: 'łydki', core: 'core' };
export const musclesFor = (name: string, group: Group): [Muscle[], Muscle[]] => own(MUSCLES_BY_NAME, name) ?? (EXTRA.has(name) ? [[...EXTRA.get(name)![6]] as Muscle[], [...EXTRA.get(name)![7]] as Muscle[]] : null) ?? [GROUP_TO_MUSCLE[group] ? [GROUP_TO_MUSCLE[group]!] : [], []];

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
/** E1 (audyt 0.10): górna granica masy ciała w Ustawieniach (kg) — tylko walidacja wpisu i importu, bez znaczenia merytorycznego. */
export const BODY_MASS_MAX = 500;
/** Najwięcej zapisanych pomiarów masy ciała (10 lat codziennych pomiarów) — starsze odpadają przy migracji; tylko ochrona przed absurdalnym importem. */
export const BODY_MASS_LOG_MAX = 3660;
export const defaultSettings = (): Settings => ({ defaultRest: DEFAULT_REST, sound: true, wakeLock: true, showRpe: false, healthSync: false, progressHint: true, autoBackup: true, weighReminder: false, modules: defaultModules(), language: 'auto', unit: 'kg', locations: [], mainLocationId: null, pickerShowAll: false, theme: 'light', workoutView: 'focus' });

/**
 * SEC2-01 (audyt kontrolny 1, 09.10.2026): nazwa wyświetlana ćwiczeń katalogu, których nazwa kanoniczna zawiera znak towarowy innej firmy — ogólna,
 * opisowa (PL; inne języki — angielska z lib/i18n.ts exName, jak cała biblioteka). Klucz (`libKey`, wpis LIB) zostaje: dane użytkownika, wskazówki,
 * figury, rodzaj aktywności w Zdrowiu i kroki katalogu idą po nim. Dane z wcześniejszych wersji — `migrate` (nazwa równa kluczowi).
 */
export const LIB_DISPLAY_NAME: Readonly<Record<string, string>> = {
  'Assault Bike': 'Rower powietrzny', 'Ski Erg': 'Ergometr narciarski', 'Bosu Ball Cable Crunch With Side Bends': 'Cable Crunch With Side Bends (półkula balansowa)',
};
/** Ćwiczenie z biblioteki (wpis LIB) — wspólne dla stanu startowego i migracji dopisującej ćwiczenia katalogu 04.10.2026. */
export function libExercise([name, group, equipment, band]: [string, Group, Equipment, boolean?], owner: string = LOCAL_OWNER): Exercise {
  const [mu, mu2] = musclesFor(name, group); return { ...base(owner), name: own(LIB_DISPLAY_NAME, name) ?? name, group, equipment, metric: metricFor(name), loadMode: loadModeFor(equipment, name), restSec: null, restWarmupSec: null, muscles: mu, secondaryMuscles: mu2, bandAssistable: !!band, tempo: '', notes: '', lib: true, libKey: name /* E2: klucz katalogu */, ...equipFields(name, equipment, true) };
}
/** E2 (audyt 0.10, X-03): odzyskanie klucza katalogu ćwiczenia z biblioteki przemianowanego przed wprowadzeniem libKey — po polach skopiowanych
 * z katalogu przy tworzeniu (partia, sprzęt, metryka, tryb, asysta gumą, partie mięśni, wymagania, zalecany sprzęt, wzorzec, źródło obciążenia, liczba
 * przyrządów). Tylko gdy ten zestaw pól jest w całym katalogu jednoznaczny (inaczej undefined) — migrate przypisuje go dodatkowo tylko wtedy,
 * gdy żadne inne ćwiczenie nie ma już tego klucza. Pola zmienione przez użytkownika albo z innej wersji katalogu → brak dopasowania (bez zgadywania). */
type FpFields = Pick<Exercise, 'group' | 'equipment' | 'metric' | 'loadMode' | 'bandAssistable' | 'muscles' | 'secondaryMuscles' | 'requires' | 'recommended' | 'pattern' | 'loadSource' | 'implements'>;
const fpOf = (e: FpFields) => JSON.stringify([e.group, e.equipment, e.metric, e.loadMode, !!e.bandAssistable, e.muscles ?? [], e.secondaryMuscles ?? [], e.requires ?? null, e.recommended ?? null, e.pattern ?? null, e.loadSource ?? null, e.implements ?? null]);
let LIB_FP: Map<string, string | null> | null = null;
export function libKeyFromFields(e: FpFields): string | undefined {
  if (!LIB_FP) { const m = new Map<string, string | null>(); for (const r of LIB) { const k = fpOf(libExercise(r)); m.set(k, m.has(k) ? null : r[0]); } LIB_FP = m; }
  return LIB_FP.get(fpOf(e)) ?? undefined;
}
/** Stan startowy: biblioteka ćwiczeń i gumy, BEZ szablonów (decyzja właściciela 03.10.2026, 08:11: „Nie przenoś do aplikacji żadnych moich szablonów.
 * Sam je ustawię.” — świeża instalacja ma `templates: []`; dawne cztery szablony żyją tylko w danych testowych: tests/fixtures/demo-templates.ts).
 * Nazwy gum w języku użytkownika; nazwy ćwiczeń z biblioteki zostają kanoniczne i tłumaczy je exName(). */
export function seedState(lng: Lang = 'pl'): State {
  const c = (pl: string) => tIn(lng, pl); /* nazwy gum w języku użytkownika (słowniki: lib/i18n) */
  const exercises: Exercise[] = LIB.map(r => libExercise(r));
  return {
    v: 2, schemaVersion: SCHEMA_VERSION, ownerId: LOCAL_OWNER,
    settings: defaultSettings(), exercises,
    bands: [{ ...base(), color: c('czerwona'), level: 2 }, { ...base(), color: c('czarna'), level: 4 }, { ...base(), color: c('fioletowa'), level: 6 }],
    templates: [], workouts: [], active: null, mornings: [], relations: [], feedback: [], instructions: [], timer: blankTimer(), libExtra: LIB_EXTRA_REVS[0], libExtraStep: LIB_EXTRA_REV, equipFill: GYM_FILL.rev /* nowa instalacja nie ma dawnych miejsc */, equipFill2: EQUIP_FILL2.rev, optFill: OPT_FILL.rev,
  };
}
