/*
 * Figury v2 — rodziny ruchu (archetypy) i przypisanie ćwiczeń katalogu (709) do rodzin. Rodzina = jeden rig (rigs/*.ts) z parametrami wariantu; ćwiczenie to
 * rodzina + parametry (sprzęt, kąt ławki, chwyt, głębokość…). Przypisanie jest regułami po nazwie, wzorcu (pattern) i sprzęcie z katalogu — z listą wykluczeń;
 * test macierzowy pilnuje, że KAŻDE ćwiczenie ma rodzinę (brak „nieprzypisanych”) i że liczności rodzin się zgadzają z dokumentem docs/50-figury-v2.md.
 * Podział pracy: jedna rodzina = jedno zadanie dla agenta (kolumna effort = szacunek w godzinach pracy agenta, bez czekania na CI).
 */
import { CATALOG, type CatalogEntry } from '../../catalog.generated';

export type FamilyId =
  | 'squat' | 'bench_press' | 'hinge'
  | 'pushup_plank' | 'dip' | 'overhead_press' | 'row' | 'cable_row' | 'pull_up' | 'pulldown' | 'lunge' | 'leg_machine' | 'leg_isolation' | 'calf_raise'
  | 'hip_bridge' | 'kb_ballistic' | 'olympic' | 'back_extension' | 'curl' | 'triceps' | 'delt_raise' | 'chest_fly' | 'shrug' | 'rotator_cuff'
  | 'core_floor' | 'core_hang' | 'core_standing' | 'carry' | 'cardio' | 'plyo' | 'sled_throw' | 'strongman' | 'glute_floor' | 'hip_abd_add'
  | 'mobility_stand' | 'mobility_floor' | 'foam_roll' | 'neck' | 'forearm' | 'thruster' | 'chest_press_machine' | 'cable_press' | 'kneeling_hinge';

export type FamilyStatus = 'ready' | 'planned';
export type Family = {
  id: FamilyId; status: FamilyStatus; label: string;
  /** Widoki (pierwszy = główny). */
  views: ('side' | 'front' | 'top')[];
  /** Szacunek pracy agenta (godziny): rig + testy geometrii + przegląd zrzutów. */
  effort: number;
  note?: string;
};

export const FAMILIES: Family[] = [
  { id: 'squat', status: 'ready', label: 'Przysiad obustronny', views: ['side', 'front'], effort: 0 },
  { id: 'bench_press', status: 'ready', label: 'Wyciskanie leżąc (ławka płaska, skośna, ujemna, podłoga)', views: ['side', 'top'], effort: 0 },
  { id: 'hinge', status: 'ready', label: 'Zawias biodrowy (martwy ciąg, RDL, dzień dobry)', views: ['side', 'front'], effort: 0 },
  { id: 'pushup_plank', status: 'planned', label: 'Pompki, deski, rollouty, ruchy w podporze', views: ['side', 'front'], effort: 4, note: 'rig w podporze: dwie podpory (dłonie, stopy), obrót wokół kotwicy' },
  { id: 'dip', status: 'planned', label: 'Dipy (poręcze, ławka, maszyna, kółka)', views: ['side', 'front'], effort: 2 },
  { id: 'overhead_press', status: 'planned', label: 'Wyciskanie nad głowę i pionowe (stojąc, siedząc, landmine, jerk)', views: ['side', 'front'], effort: 4 },
  { id: 'row', status: 'planned', label: 'Wiosłowanie w pochyleniu / z podparciem / jednorącz', views: ['side', 'top'], effort: 4 },
  { id: 'cable_row', status: 'planned', label: 'Wiosłowanie na linkach i maszynie, face pull', views: ['side', 'front'], effort: 3 },
  { id: 'pull_up', status: 'ready', label: 'Podciąganie i zwis (drążek, kółka, lina)', views: ['side', 'front'], effort: 0, note: 'pozy z danych (poses/pull_up.json); ćwiczenia bez wpisu w danych bez figury v2' },
  { id: 'pulldown', status: 'planned', label: 'Ściąganie drążka (wyciąg górny)', views: ['side', 'front'], effort: 2 },
  { id: 'lunge', status: 'planned', label: 'Wykroki, przysiad bułgarski, wejścia na stopień, pistolet', views: ['side', 'front'], effort: 5 },
  { id: 'leg_machine', status: 'planned', label: 'Suwnice i maszyny nóg (leg press, hack, wahadło)', views: ['side', 'front'], effort: 3 },
  { id: 'leg_isolation', status: 'planned', label: 'Prostowanie i uginanie nóg, nordic, sissy', views: ['side'], effort: 3 },
  { id: 'calf_raise', status: 'planned', label: 'Wspięcia na palce', views: ['side'], effort: 2 },
  { id: 'hip_bridge', status: 'planned', label: 'Hip thrust i mostki', views: ['side'], effort: 3 },
  { id: 'kb_ballistic', status: 'planned', label: 'Kettlebell: swing, clean, snatch, wyciskania balistyczne', views: ['side'], effort: 3 },
  { id: 'olympic', status: 'planned', label: 'Podrzut, rwanie i ich odmiany', views: ['side'], effort: 6 },
  { id: 'back_extension', status: 'planned', label: 'Prostowanie tułowia na ławce, reverse hyper', views: ['side'], effort: 2 },
  { id: 'curl', status: 'planned', label: 'Uginanie ramion (sztanga, hantle, linka, modlitewnik)', views: ['side', 'front'], effort: 4 },
  { id: 'triceps', status: 'planned', label: 'Prostowanie ramion (francuskie, nad głową, wyciąg, odwodzenie w tył)', views: ['side'], effort: 4 },
  { id: 'delt_raise', status: 'planned', label: 'Unoszenie ramion (bokiem, przodem, tyłem, wiosłowanie pionowe)', views: ['front', 'side'], effort: 4 },
  { id: 'chest_fly', status: 'planned', label: 'Rozpiętki, pec deck, przenoszenie za głowę', views: ['top', 'side'], effort: 3 },
  { id: 'shrug', status: 'planned', label: 'Szrugsy', views: ['front', 'side'], effort: 1 },
  { id: 'rotator_cuff', status: 'planned', label: 'Rotacje zewnętrzne/wewnętrzne, taśmy do ramion', views: ['front', 'side'], effort: 2 },
  { id: 'core_floor', status: 'planned', label: 'Brzuch na leżąco i siedząco (spięcia, unoszenie nóg, V-up)', views: ['side'], effort: 4 },
  { id: 'core_hang', status: 'planned', label: 'Brzuch w zwisie (unoszenie nóg/kolan, toes to bar)', views: ['side'], effort: 2 },
  { id: 'core_standing', status: 'planned', label: 'Core stojąc i rotacje (Pallof, drwal, skłony, windmill)', views: ['front', 'side'], effort: 4 },
  { id: 'carry', status: 'planned', label: 'Noszenie', views: ['side'], effort: 2 },
  { id: 'cardio', status: 'planned', label: 'Cardio i lokomocja (bieg, rower, wioślarz, skakanka, burpees)', views: ['side'], effort: 6 },
  { id: 'plyo', status: 'planned', label: 'Skoki i plyometria', views: ['side', 'front'], effort: 4, note: 'skoki w bok i Star Jump widać z przodu (recenzja ruchu 27.10.2026)' },
  { id: 'sled_throw', status: 'planned', label: 'Sanie, rzuty piłką, uderzenia', views: ['side'], effort: 3 },
  { id: 'strongman', status: 'planned', label: 'Strongman i podnoszenia nietypowych ciężarów', views: ['side'], effort: 3 },
  { id: 'glute_floor', status: 'planned', label: 'Pośladki i biodra na podłodze/linkach (clamshell, kickback, odwodzenie)', views: ['side', 'front'], effort: 4 },
  { id: 'hip_abd_add', status: 'planned', label: 'Przywodzenie i odwodzenie (maszyny, linki, taśmy)', views: ['front'], effort: 2 },
  { id: 'mobility_stand', status: 'planned', label: 'Mobilność i rozciąganie stojąc / w ruchu', views: ['side', 'front'], effort: 6 },
  { id: 'mobility_floor', status: 'planned', label: 'Mobilność i rozciąganie na podłodze', views: ['side'], effort: 6 },
  { id: 'foam_roll', status: 'planned', label: 'Rolowanie i automasaż', views: ['side'], effort: 2 },
  { id: 'neck', status: 'planned', label: 'Szyja', views: ['side'], effort: 1 },
  { id: 'forearm', status: 'planned', label: 'Przedramiona i chwyt', views: ['side'], effort: 2 },
  { id: 'thruster', status: 'planned', label: 'Thruster i ruchy złożone przysiad + wyciskanie', views: ['side'], effort: 2 },
  { id: 'chest_press_machine', status: 'planned', label: 'Maszyny wyciskające siedząc (klatka, barki)', views: ['side'], effort: 3 },
  { id: 'cable_press', status: 'planned', label: 'Wyciskania na linkach', views: ['side', 'top'], effort: 2 },
  { id: 'kneeling_hinge', status: 'planned', label: 'Zawias w klęku i siedząc (dzień dobry siedząc, klęczący przysiad)', views: ['side'], effort: 1 },
];
export const FAMILY: Record<FamilyId, Family> = Object.fromEntries(FAMILIES.map(f => [f.id, f])) as Record<FamilyId, Family>;

/** Rodziny, w których dźwignia maszyny nie jest rysowana w widoku z przodu, gdy jej rzut przechodzi przez głowę (draw.ts, case 'pivot'; recenzja p2-r2, U-L2: Lying Machine Squat). Rodziny z tym samym defektem, których nie przeglądano w tej rundzie (cable_row, chest_press_machine, leg_isolation), czekają w backlogu 1.1 (docs/21): ich rysunek bez zmian. */
export const DZWIGNIA_BEZ_GLOWY: readonly string[] = ['leg_machine'];
/** Widoki ustawione na poziomie ćwiczenia (nadpisują widoki rodziny). Suwnice pokazujemy tylko z boku (recenzja p2-r2, U-L1, decyzja koordynatora 27.10.2026): z przodu uda są w skrócie, platforma nie jest rysowana, więc stopy i siedzisko wiszą w powietrzu, a ruch w kostce jest niewidoczny. */
export const EXERCISE_VIEWS: Record<string, { family: FamilyId; views: ('side' | 'front' | 'top')[]; reason: string }> = {
  'Leg Press': { family: 'leg_machine', views: ['side'], reason: 'suwnica: z przodu bez platformy stopy i siedzisko wiszą, uda w skrócie' },
  'Single Leg Press': { family: 'leg_machine', views: ['side'], reason: 'suwnica: z przodu bez platformy stopy i siedzisko wiszą, uda w skrócie' },
};
/** Widoki figury ćwiczenia: wyjątek ćwiczenia (EXERCISE_VIEWS), a w jego braku widoki rodziny. */
export function viewsOf(key: string, family: FamilyId): ('side' | 'front' | 'top')[] {
  const x = Object.prototype.hasOwnProperty.call(EXERCISE_VIEWS, key) ? EXERCISE_VIEWS[key] : undefined;
  return x && x.family === family ? x.views : FAMILY[family].views;
}

const has = (n: string, ...parts: string[]): boolean => parts.some(p => n.includes(p));

type Rule = [FamilyId, (n: string, e: CatalogEntry) => boolean];
/** Reguły w kolejności: pierwsza pasująca wygrywa. `n` = nazwa małymi literami. */
const iso = (e: CatalogEntry): boolean => e.pattern === 'isolation';
const RULES: Rule[] = [
  /* ---- wyjątki o jednoznacznych nazwach (przed rodzinami wzorcowymi) ---- */
  ['thruster', n => has(n, 'thruster', 'clean and press')],
  ['neck', n => has(n, 'neck') && !has(n, 'chin to chest', 'side neck stretch')],
  ['foam_roll', n => has(n, '-smr', 'foam roll', 'wrist roller')],
  ['olympic', n => (/\b(clean|snatch|jerk)\b/.test(n) && !has(n, 'deadlift', 'kettlebell', 'dumbbell', 'press', 'bottoms', '(hantel)', 'one-arm'))
    || has(n, 'clean pull', 'snatch pull', 'clean shrug', 'snatch shrug', 'jerk balance', 'rack delivery', 'jerk dip', 'snatch balance')],
  ['kb_ballistic', n => (has(n, 'kettlebell') && has(n, 'swing', 'clean', 'snatch', 'high pull', 'jerk', 'push press', 'pirate')) || has(n, 'snatch (hantel)', 'dumbbell clean')],
  ['strongman', n => has(n, 'atlas stones', 'keg load', 'sandbag load', 'tire flip', 'power stairs', 'log lift', 'circus bell', 'conan', 'yoke')],
  ['carry', (n, e) => e.pattern === 'carry'],
  ['back_extension', n => has(n, 'back extension', 'hyperextension', 'reverse hyper', 'lower back curl')],
  ['hip_bridge', n => has(n, 'hip thrust', 'glute bridge', 'frog pump', 'hip bridge', 'london bridges')],
  ['kneeling_hinge', n => has(n, 'kneeling squat', 'seated good morning')],
  ['sled_throw', n => has(n, 'sled', 'throw', 'slam', 'sledgehammer', 'drag', 'wall ball', 'backward medicine') && !has(n, 'sled row', 'sled reverse flye', 'sled overhead triceps')],
  ['leg_machine', n => has(n, 'leg press', 'hack squat', 'pendulum', 'belt squat machine', 'lying machine squat', 'calf press') && n !== 'barbell hack squat'],
  /* ---- gotowe rodziny ---- */
  ['hinge', (n, e) => (e.pattern === 'hinge' && !has(n, 'stone', 'snatch', 'clean', 'swing', 'kettlebell high') ) || has(n, 'clean deadlift', 'snatch deadlift')],
  ['squat', (n, e) => (e.pattern === 'squat' && !has(n, 'jefferson', 'jump', 'thruster')) || n === 'barbell hack squat'],
  ['bench_press', (n, e) => e.pattern === 'h_push' && !/push[ -]?up|wipers|drop push|chest pass|machine chest press|leverage|cable|linkach/.test(n)],
  /* ---- pozostałe po wzorcu ---- */
  ['cable_press', (n, e) => e.pattern === 'h_push' && has(n, 'cable', 'linkach')],
  ['chest_press_machine', (n, e) => (e.pattern === 'h_push' && has(n, 'machine chest press', 'leverage')) || has(n, 'machine shoulder press')],
  ['pushup_plank', (n, e) => (e.pattern === 'h_push' && !has(n, 'chest pass')) || /\bplank\b|rollout|ab wheel|fallout|bear crawl|mountain climber|renegade|dragon flag|inverted row/.test(n)],
  ['dip', n => /\bdips?\b/.test(n) && !has(n, 'jerk dip', 'dip belt', 'hip dip')],
  ['overhead_press', (n, e) => e.pattern === 'v_push'],
  ['pull_up', n => /\bchin(s|-up)?\b|pull[ -]?up|muscle up|rope climb|dead hang/.test(n) && !has(n, 'to chest', 'pulldown')],
  ['pulldown', (n, e) => e.pattern === 'v_pull' || has(n, 'pulldown') && !has(n, 'triceps')],
  ['cable_row', n => has(n, 'face pull', 'cable row', 'seated cable', 'machine row', 'high pulley row', 'wiosłowanie na linkach', 'leverage high row', 'sled row', 'cable rope rear')],
  ['row', (n, e) => e.pattern === 'h_pull'],
  ['lunge', (n, e) => e.pattern === 'lunge_single_leg'],
  /* izolacje (pattern = isolation) po nazwie */
  ['leg_isolation', (n, e) => iso(e) && has(n, 'leg extension', 'leg curl', 'hamstring curl', 'nordic', 'glute ham', 'sissy')],
  ['calf_raise', (n, e) => iso(e) && has(n, 'calf', 'łydki') && !has(n, 'shrug')],
  ['shrug', (n, e) => iso(e) && has(n, 'shrug') || has(n, 'scapular pull')],
  ['hip_abd_add', (n, e) => iso(e) && has(n, 'hip abduction', 'hip adduction', 'hip flexion', 'monster walk', 'lateral band walk')],
  ['glute_floor', (n, e) => iso(e) && has(n, 'clamshell', 'fire hydrant', 'donkey kick', 'glute kickback', 'cable kickback', 'hip extension with bands', 'prone flutter')],
  ['curl', (n, e) => iso(e) && has(n, 'curl') && !has(n, 'wrist', 'leg curl', 'hamstring', 'plate curl', 'reverse plate')],
  ['forearm', (n, e) => iso(e) && has(n, 'wrist', 'plate pinch', 'pronation', 'supination', 'reverse plate curls')],
  ['triceps', (n, e) => iso(e) && has(n, 'triceps', 'tricep', 'skull', 'tate press', 'kickback', 'body-up', 'pushdown', 'chain handle') || has(n, 'jm press')],
  ['rotator_cuff', (n, e) => iso(e) && has(n, 'external rotation', 'internal rotation', 'band pull apart', 'cuban press')],
  ['chest_fly', (n, e) => iso(e) && has(n, 'fly', 'flye', 'pec deck', 'pullover', 'svend', 'squeeze', 'around the worlds', 'crucifix') && !has(n, 'reverse', 'rear')],
  ['delt_raise', (n, e) => iso(e) && has(n, 'raise', 'upright row', 'reverse fly', 'reverse pec', 'y raise', 'scaption', 'halo', 'car drivers', 'reverse flye', 'front raise', 'rear')],
  ['core_hang', n => has(n, 'hanging', 'toes to bar', 'l-sit', 'gorilla chin')],
  ['core_standing', (n, e) => has(n, 'pallof', 'woodchop', 'landmine rotation', 'side bend', 'windmill', 'bent press', 'spell caster', 'judo flip', 'russian twist', 'figure 8', 'full twist', 'seated barbell twist')],
  ['core_floor', (n, e) => e.pattern.startsWith('core') || has(n, 'bird dog', 'superman', 'dead bug', 'stomach vacuum')],
  ['cardio', (n, e) => e.pattern === 'cardio'],
  ['plyo', n => has(n, 'jump', 'hop', 'bound', 'skip', 'push-off', 'butt kick', 'shuffle', 'frog hops', 'jumping', 'carioca')],
  ['sled_throw', n => has(n, 'spider crawl', 'turkish')],
  ['mobility_stand', (n, e) => e.pattern === 'mobility' && has(n, 'standing', 'circles', 'swing', 'torso rotation', 'toe touches', 'overhead', 'wall', 'arm circles', 'shoulder', 'dynamic', 'chest', 'biceps', 'triceps', 'lateral', 'pelvic', "world's greatest", 'inchworm', 'groiners', 'iron crosses', 'neck')],
  ['mobility_floor', () => true],
];

/** Jawne wyjątki od reguł (nazwy mylące dla reguł po słowach). */
export const OVERRIDES: Record<string, FamilyId> = {
  'Drag Curl': 'curl', 'Dragon Flag': 'core_floor', 'Cable Overhead Extension': 'triceps', 'Bottoms-Up Clean From The Hang Position': 'kb_ballistic',
  'Medicine Ball Chest Pass': 'sled_throw', 'Jefferson Squat': 'strongman', 'Crossover Reverse Lunge': 'lunge',
  /* słowo „neck” w nazwie to chwyt zza karku, nie ćwiczenie szyi (badacz r4, NSCA Basics s. 42) */
  'Push Press - Behind the Neck': 'overhead_press', 'Standing Barbell Press Behind Neck': 'overhead_press', 'Wide-Grip Pulldown Behind The Neck': 'pulldown',
};

export function familyOf(key: string, entry: CatalogEntry = CATALOG[key]): FamilyId {
  if (Object.prototype.hasOwnProperty.call(OVERRIDES, key)) return OVERRIDES[key];
  const n = key.toLowerCase();
  for (const [id, f] of RULES) if (f(n, entry)) return id;
  return 'mobility_floor';
}

/** Przypisanie wszystkich ćwiczeń katalogu do rodzin. */
export function assignAll(): Record<string, FamilyId> {
  const out: Record<string, FamilyId> = {};
  for (const k of Object.keys(CATALOG)) out[k] = familyOf(k);
  return out;
}
