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
  curl: () => require('./poses/curl.json'),
  olympic: () => require('./poses/olympic.json'),
  triceps: () => require('./poses/triceps.json'),
  pulldown: () => require('./poses/pulldown.json'),
  shrug: () => require('./poses/shrug.json'),
  hip_abd_add: () => require('./poses/hip_abd_add.json'),
  leg_machine: () => require('./poses/leg_machine.json'),
  calf_raise: () => require('./poses/calf_raise.json'),
  kb_ballistic: () => require('./poses/kb_ballistic.json'),
  hip_bridge: () => require('./poses/hip_bridge.json'),
  cable_row: () => require('./poses/cable_row.json'),
  delt_raise: () => require('./poses/delt_raise.json'),
  row: () => require('./poses/row.json'),
  chest_fly: () => require('./poses/chest_fly.json'),
  overhead_press: () => require('./poses/overhead_press.json'),
  dip: () => require('./poses/dip.json'),
  chest_press_machine: () => require('./poses/chest_press_machine.json'),
  cable_press: () => require('./poses/cable_press.json'),
  back_extension: () => require('./poses/back_extension.json'),
  thruster: () => require('./poses/thruster.json'),
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
export type PhaseOverride = { names?: { first: PhaseName; second: PhaseName }; joints?: readonly MeasuredJoint[]; hideAngle?: true; lowerFirst?: boolean };
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
export const DATA_UI: Record<string, DataUi> = {
  /* u = 0 zwis, u = 1 górna pozycja: podciąganie 1 s, opuszczanie 2 s (tempo ilustracyjne, anim.ts) */
  curl: { names: { first: 'Uginanie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['elbow'] },
  /* olympic: u = 0 start (podłoga, wiszenie, rack), u = 1 przechwyt/wyprost; Jerk Dip Squat to zejście w dół (u: 0 → 1 = ugięcie 52°), więc wyjątek odwraca kierunek (R1-N1) */
  olympic: { names: { first: 'Podnoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['knee', 'hip'],
    /* 05.11.2026: 19 ćwiczeń (18 z lotem albo wyrzutem i Snatch Balance, 05.11.2026 r6-W1) ma petla = jednokierunkowa — jedna faza „Podnoszenie” (całe powtórzenie od podłogi, wiszenia albo racka do przechwytu i wstania), bez opuszczania; kierunek u 0 → 1 ich nie dotyczy.
     * Jerk Dip Squat to zejście w dół (u 0 → 1 = opuszczanie, wahadło); Snatch Balance (wybicie i zejście pod sztangę, jak Squat Jerk) jest jednokierunkowy — wahadło cofałoby wybicie, a licznik z 2 s przeczyłby błędowi „zbyt wolne zejście”. Clean Pull, Snatch Pull i wzruszenia (bez lotu) zostają wahadłem z nazwami rodziny. Wyjątki są we wpisie olympic, nie w ONE_WAY_UI:
     * wpis rodziny pozostaje jeden, a skróty recenzji pozostałych rodzin nie zmieniają się od poprawki olympic (skrót liczy się z wyniku rysunku rodziny: scripts/skrot-v2-wynik.mjs). */
    exceptions: { 'Jerk Dip Squat': { names: { first: 'Opuszczanie', second: 'Podnoszenie' }, lowerFirst: true },
      ...Object.fromEntries(['Power Clean', 'Clean', 'Split Clean', 'Hang Clean', 'Block Clean', 'Block Power Clean', 'Barbell Snatch', 'Power Snatch', 'Split Snatch', 'Hang Snatch', 'Block Snatch', 'Block Power Snatch',
        'Power Jerk', 'Split Jerk', 'Squat Jerk', 'Muscle Snatch', 'Clean and Jerk', 'Jerk Balance', 'Snatch Balance'].map((k): [string, PhaseOverride] => [k, { names: { first: 'Podnoszenie', second: 'Podnoszenie' } }])) } },
  /* thruster (10.11.2026): całe powtórzenie w jednej pętli (petla = jednokierunkowa, jak olympic z lotem): przysiad z ciężarem na barkach i wyciskanie nad głowę — jedna faza „Podnoszenie”, bez opuszczania */
  thruster: { names: { first: 'Podnoszenie', second: 'Podnoszenie' }, lowerFirst: false, joints: ['knee', 'hip'] },
  triceps: { names: { first: 'Prostowanie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['elbow'] },
  pull_up: { names: { first: 'Podciąganie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['elbow'] },
  /* dip (09.11.2026): u = 0 podpór na wyprostowanych rękach, u = 1 dół (łokieć ≈ 95°) — faza 0 → 1 to opuszczanie (2 s), powrót to podnoszenie (1 s) */
  dip: { names: { first: 'Opuszczanie', second: 'Podnoszenie' }, lowerFirst: true, joints: ['elbow'],
    /* Dip Machine: siedzący, miednica stoi; u = 0 uchwyty w górze (łokieć 90°), u = 1 wypchnięte w dół (łokieć 21°) — faza 0 → 1 to wysiłek (1 s), powrót 2 s */
    exceptions: { 'Dip Machine': { names: { first: 'Wypychanie', second: 'Powrót' }, lowerFirst: false } } },
  /* cable_press (10.11.2026): u = 0 dłonie przy klatce (łokieć ≥ 70°), u = 1 wyprost przed sobą (łokieć ≤ 25°) — faza 0 → 1 to wypychanie (1 s), powrót 2 s */
  cable_press: { names: { first: 'Wypychanie', second: 'Powrót' }, lowerFirst: false, joints: ['elbow'] },
  /* pulldown (partia 3, 09.11.2026): u = 0 ręce w górze (rozciągnięcie), u = 1 drążek przy górnej klatce — ściąganie 1 s, powrót 2 s (tempo ilustracyjne, anim.ts); Straight Arm Pulldown: łokieć prosty, rusza się bark */
  pulldown: { names: { first: 'Ściąganie', second: 'Powrót' }, lowerFirst: false, joints: ['elbow'],
    exceptions: { 'Straight Arm Pulldown': { joints: ['shElev'] } } },
  /* hip_abd_add (partia 3, 09.11.2026): u = 0 start, u = 1 noga(i) odwiedzione / przywiedzione; wysiłek 1 s, powrót 2 s. Kąt ukryty we wszystkich ćwiczeniach: jedyny staw biodra w silniku
   * („hip”) nazywa się w podpisie „zgięcie biodra”, a ruch tej rodziny to odwodzenie/przywodzenie — podpis byłby nieprawdziwy (brak stawu „odwiedzenie biodra” w MeasuredJoint). */
  hip_abd_add: { names: { first: 'Rozsuwanie', second: 'Powrót' }, lowerFirst: false, joints: ['hip'], /* lowerFirst jawnie w wyjątkach: kierunku u nie da się zmierzyć z kolan i miednicy (strażnik figures-v2-kierunek-u) — u = 0 → 1 to wysiłek (noga od pozycji wyjściowej) */
    exceptions: { 'Hip Abduction': { hideAngle: true, lowerFirst: false }, 'Cable Hip Abduction': { hideAngle: true, lowerFirst: false }, 'Lateral Band Walk': { hideAngle: true }, 'Monster Walk': { hideAngle: true },
      'Hip Adduction': { hideAngle: true, lowerFirst: false, names: { first: 'Ściąganie', second: 'Powrót' } }, 'Cable Hip Adduction': { hideAngle: true, lowerFirst: false, names: { first: 'Ściąganie', second: 'Powrót' } } } },
  /* leg_machine (partia 3, 09.11.2026): maszyny przysiadu (Hack, Pendulum, Lying Machine, Belt Squat) — u = 0 góra, u = 1 dół: opuszczanie 2 s, wstawanie 1 s (jak przysiad);
   * suwnica (Leg Press, Single Leg Press) — u = 0 nogi zgięte, u = 1 platforma wypchnięta: wypychanie 1 s, opuszczanie 2 s. Staw: kolano. */
  leg_machine: { names: { first: 'Opuszczanie', second: 'Wstawanie' }, lowerFirst: true, joints: ['knee'],
    exceptions: { 'Leg Press': { names: { first: 'Wypychanie', second: 'Opuszczanie' }, lowerFirst: false }, 'Single Leg Press': { names: { first: 'Wypychanie', second: 'Opuszczanie' }, lowerFirst: false } } },
  /* row (09.11.2026, partia 1): u = 0 ręce w zwisie (łokcie prawie proste), u = 1 łokcie za tułowiem: przyciąganie ciężaru 1 s, opuszczanie 2 s; mierzony staw — łokieć */
  row: { names: { first: 'Podciąganie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['elbow'] },
  /* overhead_press (09.11.2026, partia 1): u = 0 dłonie przy barkach (landmine: gryf przy klatce), u = 1 ręce wyprostowane nad głową / przed sobą: wypychanie 1 s, opuszczanie 2 s; mierzony staw — łokieć.
   * Pike Push Up jest odwrócony (u = 0 ręce proste, biodra w górze; u = 1 łokcie zgięte, głowa przy podłodze), więc wyjątek: najpierw opuszczanie (2 s), potem wypychanie. */
  /* 10.11.2026 (partia 1): ćwiczenia bez ruchu miednicy i kolan między u = 0 i u = 1 (ruch tylko w rękach; push press wraca do stania) deklarują kierunek wprost — strażnik tests/figures-v2-kierunek-u.test.ts
   * (rodzina ma ćwiczenia mierzalne: Pike Push Up, Linear Jammer). Wartość = wpis rodziny, więc rysunek i fazy bez zmian. */
  overhead_press: { names: { first: 'Wypychanie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['elbow'],
    exceptions: { 'Pike Push Up': { names: { first: 'Opuszczanie', second: 'Wypychanie' }, lowerFirst: true },
      ...Object.fromEntries(['Overhead Press (sztanga)', 'Overhead Press (hantle)', 'Band Shoulder Press', 'Double Kettlebell Press', 'Kettlebell Press', 'Single Arm Overhead Press (hantel)',
        'See-Saw Press (Alternating Side Press)', 'Arnold Press', 'Kettlebell Arnold Press', 'Seated Shoulder Press (hantle)', 'Kettlebell Seated Press', 'Seated Barbell Military Press',
        'Seated Cable Shoulder Press', 'Wyciskanie nad głowę (linki)', 'Standing Barbell Press Behind Neck', 'Push Press', 'Push Press - Behind the Neck', 'Landmine Press'].map(k => [k, { lowerFirst: false }])) } },
  /* hip_bridge (09.11.2026): u = 0 miednica nisko (podłoga, ławka), u = 1 pełny wyprost bioder; unoszenie 1 s, opuszczanie 2 s; mierzone biodro */
  hip_bridge: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['hip'] },
  /* Rodziny z danymi, jeszcze niepodłączone (status „planned”, families.ts) — wpisy gotowe, żeby podłączenie nie pokazało kąta stawu, który się nie rusza (S2, 27.10.2026). */
  delt_raise: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['shElev', 'shAbd'],
    exceptions: { 'Car Drivers': { hideAngle: true, names: { first: 'Obrót', second: 'Powrót' } }, /* r5-W1 08.11.2026: kierownica obraca się, nie unosi */ 'Alternating Deltoid Raise': { names: { first: 'Naprzemiennie', second: 'Naprzemiennie' } } } },
  back_extension: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['hip'],
    /* u = 0 góra (tułów w linii z nogami), u = 1 dół (biodro ≥ 70°): ruch od u = 0 to opuszczanie; Reverse Hyperextension (u = 0 nogi w dół → u = 1 w linii z tułowiem) i Lower Back Curl (u = 1 barki w górę) mają wysiłek w u: 0 → 1 jak wpis rodziny */
    exceptions: { 'Back Extension': { names: { first: 'Opuszczanie', second: 'Unoszenie' }, lowerFirst: true }, 'Lower Back Curl': { hideAngle: true } /* r1-W1 10.11.2026: pomiar 3D biodra z odsunięciem w bok daje 9° i skok znaku; rzeczywisty zakres ok. 7° */ } },
  shrug: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['shrug', 'protract'],
    exceptions: { 'Middle Back Shrug': { names: { first: 'Ściąganie', second: 'Powrót' }, joints: ['protract'] /* partia 3, 09.11.2026: łopatki ściągają się (wysunięcie barków), uniesienie stoi */ } } },
  rotator_cuff: { names: { first: 'Obrót', second: 'Powrót' }, lowerFirst: false, joints: ['shRot'],
    exceptions: { 'Band Pull Apart': { names: { first: 'Rozsuwanie', second: 'Powrót' }, joints: ['shAbd'] }, 'Reverse Flyes With External Rotation': { names: { first: 'Unoszenie', second: 'Opuszczanie' }, joints: ['shAbd'] } } },
  forearm: { names: { first: 'Uginanie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['wristFlex', 'forearmRoll', 'elbow'],
    exceptions: { 'Dumbbell Lying Pronation': { names: { first: 'Obrót', second: 'Powrót' } }, 'Dumbbell Lying Supination': { names: { first: 'Obrót', second: 'Powrót' } } } },
  /* chest_fly (09.11.2026): rozpiętki (u = 0 ramiona szeroko, u = 1 dłonie nad klatką / przed klatką) i pullover (u = 0 ciężar za głową, u = 1 nad klatką). Mierzone ramię jak w delt_raise: odsunięcie w bok (shAbd, rozpiętki) albo zgięcie
   * w płaszczyźnie strzałkowej (shElev, pullover i Crucifix — pierwszy staw przy utrzymaniu); łokieć w rozpiętce stoi (zmiana ≤ 12°), więc nie jest mierzonym stawem (nakładka „limb” wymaga, by staw był pokazany: overlay.ts). */
  chest_fly: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['shElev', 'shAbd'] },
  /* u = 0 uchwyty przy barkach, u = 1 ręce wyprostowane (wypychanie 1 s, powrót 2 s) */
  chest_press_machine: { names: { first: 'Wypychanie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['elbow'] },
  carry: { names: { first: 'Marsz', second: 'Marsz' }, lowerFirst: false, joints: ['knee', 'hip'], walk: true },
  /* calf_raise (09.11.2026): wspięcie na palce — u = 0 pięty na dole, u = 1 pięty w górze (1 s), opuszczanie 2 s. Mierzonym stawem byłaby kostka, ale MeasuredJoint jej nie ma (silnik, bez zmian w tej partii — zgłoszone w raporcie);
   * kandydat 'knee' (ruch kolana w wspięciu < 15°) powoduje, że linia „Kąt na rysunku” się nie pokazuje (MIN_MEASURED_ROM) — zamiast liczby, która nie jest ruchem wspięcia. */
  calf_raise: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['knee'] },
  /* kb_ballistic (09.11.2026): swing, zarzut i wysoki ciąg to wahadło: u = 0 dół (zawias, zawis między nogami) → u = 1 góra (swing: ręce przed sobą; zarzut: rack), powrót tą samą drogą.
   * Rwanie, wyciskanie z nóg i podrzut (9 ćwiczeń, miednica nie monotoniczna — wyrzut i ugięcie pod ciężarem) mają petla = jednokierunkowa (całe powtórzenie w jednym przebiegu, jak w olympic): jedna faza „Podnoszenie” bez opuszczania — wyjątki poniżej,
   * wpis rodziny pozostaje jeden. Mierzone biodro (swing, zarzut, rwanie) albo kolano (dip w podrzucie) — pokazany jest staw, który rusza się najbardziej. */
  kb_ballistic: { names: { first: 'Podnoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['hip', 'knee'],
    exceptions: Object.fromEntries(['Kettlebell Snatch', 'Double Kettlebell Snatch', 'Snatch (hantel)', 'Double Kettlebell Push Press', 'Double Kettlebell Jerk', 'One-Arm Kettlebell Push Press', 'One-Arm Kettlebell Jerk', 'One-Arm Kettlebell Split Jerk', 'One-Arm Kettlebell Clean and Jerk'].map((k): [string, PhaseOverride] => [k, { names: { first: 'Podnoszenie', second: 'Podnoszenie' } }])) },
  /* cable_row: u = 0 ręce wyprostowane (start), u = 1 uchwyt przy tułowiu albo twarzy; ściąganie 1 s, powrót 2 s (tempo ilustracyjne). Mierzony łokieć (zakres_lokcia). */
  cable_row: { names: { first: 'Ściąganie', second: 'Powrót' }, lowerFirst: false, joints: ['elbow'] },
};
/** Ustawienia prezentacji ćwiczenia w trybie cyklicznym (marsz) z rodziny bez wpisu w DATA_UI (sled_throw, strongman): licznik „Marsz”, mierzone kolano albo biodro (decyzja właściciela 27.10.2026). */
export const GAIT_UI: DataUi = { names: { first: 'Marsz', second: 'Marsz' }, lowerFirst: false, joints: ['knee', 'hip'], walk: true };
/**
 * Prezentacja ćwiczeń w pętli jednokierunkowej (`petla: 'jednokierunkowa'`, 28.10.2026): jedna faza bez sekund, nazwa z `names.first` — „Skok” (plyo) albo „Rzut” (sled_throw: Slamy, rzuty, Wall Ball). Kierunek u: 0 → 1 nie dotyczy
 * (całe powtórzenie w jednym przebiegu, bez opuszczania i podnoszenia), więc `lowerFirst` jest tu nieistotne. Mierzone kolano albo biodro (skok i przysiad piłki). Wpis nie jest DATA_UI: rodzina z jednokierunkowym i innym ruchem
 * (marsz sanek w sled_throw) zachowuje GAIT_UI dla cyklicznych (dataUiForPose).
 */
export const ONE_WAY_UI: Record<string, DataUi> = {
  plyo: { names: { first: 'Skok', second: 'Skok' }, lowerFirst: false, joints: ['knee', 'hip'] },
  sled_throw: { names: { first: 'Rzut', second: 'Rzut' }, lowerFirst: false, joints: ['knee', 'hip'] },
};
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
  /* rozciąganie statyczne = utrzymanie pozycji (poza z dwóch identycznych klatek): jedna pozycja bez pętli i licznika faz (27.10.2026; mobility_stand 8, mobility_floor 8 — Cat-Cow jest ruchem) */
  'Chin To Chest Stretch', 'Side Neck Stretch', 'Overhead Triceps Stretch', 'Standing Chest Stretch', 'Standing Gastrocnemius Calf Stretch', 'Wall Calf Stretch', 'Standing Soleus And Achilles Stretch', 'Standing Lateral Stretch',
  'The Straddle', 'Seated Calf Stretch', 'Seated Floor Hamstring Stretch', 'Butterfly Stretch', "Child's Pose", 'Kneeling Hip Flexor Stretch', 'Supine Hamstring Stretch', 'Side-Lying Quad Stretch',
]);
