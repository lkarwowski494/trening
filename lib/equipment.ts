import { CATALOG_CAPS, type LoadSource } from './catalog.generated';
import { achievable, noPlates, rangeValues, type LoadSpec, type LoadUnit } from './loads';
import { lbl, t } from './i18n';
import { fmtNum } from './units';
import type { Exercise, Location, LocEquip, LoadMode, Impl } from './seed';

/*
 * P-003 E1 — jedno źródło prawdy o sprzęcie (docs/10-miejsca-i-sprzet.md, sekcje 3.1–3.4):
 *  - słownik możliwości (capabilities) — z katalogu ćwiczeń (lib/catalog.generated.ts) + kilka używanych tylko po stronie sprzętu;
 *  - pozycje sprzętu (≈50) z polskimi i angielskimi nazwami, grupą, opcjami (dodatkowe możliwości) i rodzajem ciężarów;
 *  - presety miejsc; dostępność ćwiczenia w miejscu; dostępne ciężary dla ćwiczenia w miejscu.
 * Ekrany i testy czytają wszystko stąd.
 */

/** Możliwości dawane przez sprzęt, których nie było w pierwszym katalogu (od katalogu 04.10.2026 część ćwiczeń ich wymaga albo zaleca — mogą się więc powtarzać w CAPABILITIES; dostępność liczy zbiór). */
export const EXTRA_CAPS = ['bands', 'cable.rope', 'ankle_strap', 'cable.handles'] as const;
export const CAPABILITIES: readonly string[] = [...CATALOG_CAPS, ...EXTRA_CAPS];

type L = { pl: string; en: string };
/** Nazwy możliwości do dopisku „brak: …” w wyborze ćwiczenia. */
export const CAP_LABEL: Record<string, L> = {
  'ab_wheel': { pl: 'kółko do brzucha', en: 'ab wheel' }, 'barbell': { pl: 'sztanga', en: 'barbell' },
  'bench.decline': { pl: 'ławka ze skosem w dół', en: 'decline bench' }, 'bench.flat': { pl: 'ławka płaska', en: 'flat bench' },
  'bench.incline': { pl: 'ławka skośna', en: 'incline bench' }, 'bench.uprights': { pl: 'ławka ze stojakami', en: 'bench with uprights' },
  'box': { pl: 'skrzynia / stopień', en: 'box / step' }, 'cable.dual': { pl: 'dwa wyciągi', en: 'two cables' },
  'cable.high': { pl: 'wyciąg górny', en: 'high cable' }, 'cable.low': { pl: 'wyciąg dolny', en: 'low cable' },
  'cable.mid': { pl: 'wyciąg na wysokości klatki', en: 'mid cable' }, 'cable.row_seat': { pl: 'wyciąg do wiosłowania siedząc', en: 'seated row station' },
  'calf_machine': { pl: 'maszyna do łydek', en: 'calf machine' }, 'cardio.bike': { pl: 'rower stacjonarny', en: 'stationary bike' },
  'cardio.rower': { pl: 'wioślarz', en: 'rowing machine' }, 'cardio.treadmill': { pl: 'bieżnia', en: 'treadmill' }, 'cardio.treadmill_incline': { pl: 'bieżnia z nachyleniem', en: 'incline treadmill' },
  'chest_press_machine': { pl: 'maszyna do wyciskania (klatka)', en: 'chest press machine' }, 'db': { pl: 'hantle', en: 'dumbbells' },
  'dip.bars': { pl: 'poręcze', en: 'dip bars' }, 'dip_belt': { pl: 'pas (do dociążania / biodrowy)', en: 'belt (dip / hip)' },
  'ez_bar': { pl: 'gryf łamany', en: 'EZ bar' }, 'floor_mat': { pl: 'mata', en: 'mat' }, 'ghd': { pl: 'GHD', en: 'GHD' },
  'glute_ham_raise': { pl: 'glute-ham raise', en: 'glute-ham raise' }, 'hack_squat': { pl: 'hack squat', en: 'hack squat' },
  'hip_abductor_adductor': { pl: 'maszyna do odwodzenia/przywodzenia', en: 'hip abductor/adductor' }, 'hyperext_bench': { pl: 'ławka rzymska', en: 'hyperextension bench' },
  'jump_rope': { pl: 'skakanka', en: 'jump rope' }, 'kb': { pl: 'kettlebell', en: 'kettlebell' }, 'landmine': { pl: 'landmine', en: 'landmine' },
  'lat_pulldown': { pl: 'wyciąg do ściągania drążka', en: 'lat pulldown' }, 'leg_curl': { pl: 'maszyna do uginania nóg', en: 'leg curl machine' },
  'leg_ext': { pl: 'maszyna do prostowania nóg', en: 'leg extension machine' }, 'leg_press': { pl: 'suwnica na nogi', en: 'leg press' },
  'med_ball': { pl: 'piłka lekarska', en: 'medicine ball' }, 'outdoor': { pl: 'rower (na zewnątrz)', en: 'bicycle (outdoors)' },
  'pec_deck': { pl: 'butterfly (pec deck)', en: 'pec deck' }, 'preacher_bench': { pl: 'modlitewnik', en: 'preacher bench' },
  'pullup.bar': { pl: 'drążek', en: 'pull-up bar' }, 'rack': { pl: 'klatka / stojaki', en: 'rack / stands' },
  'rack.safeties': { pl: 'asekuracja', en: 'safety arms' }, 'rings': { pl: 'kółka gimnastyczne', en: 'gymnastic rings' },
  'shoulder_press_machine': { pl: 'maszyna do wyciskania nad głowę', en: 'shoulder press machine' }, 'smith': { pl: 'suwnica Smitha', en: 'Smith machine' },
  'suspension': { pl: 'taśmy TRX', en: 'suspension trainer' }, 't_bar': { pl: 'T-bar', en: 'T-bar' }, 'trap_bar': { pl: 'trap bar', en: 'trap bar' },
  'bands': { pl: 'gumy', en: 'bands' }, 'cable.rope': { pl: 'lina do wyciągu', en: 'cable rope' }, 'ankle_strap': { pl: 'opaski na kostki', en: 'ankle straps' },
  'cable.handles': { pl: 'uchwyty do linek', en: 'cable handles' },
  /* decyzja właściciela 04.10.2026 (wieczór): brakujący sprzęt i ćwiczenia */
  'row_machine': { pl: 'maszyna do wiosłowania', en: 'row machine' }, 'pullover_machine': { pl: 'maszyna pullover', en: 'pullover machine' },
  'ab_crunch_machine': { pl: 'maszyna do brzucha', en: 'ab crunch machine' }, 'biceps_curl_machine': { pl: 'maszyna do bicepsa', en: 'biceps curl machine' },
  'triceps_ext_machine': { pl: 'maszyna do tricepsa', en: 'triceps extension machine' }, 'lateral_raise_machine': { pl: 'maszyna do wznosów bokiem', en: 'lateral raise machine' },
  'glute_kickback_machine': { pl: 'maszyna do wykopów (pośladki)', en: 'glute kickback machine' }, 'hip_thrust_machine': { pl: 'maszyna do hip thrustu', en: 'hip thrust machine' },
  'belt_squat_machine': { pl: 'maszyna belt squat', en: 'belt squat machine' }, 'pendulum_squat': { pl: 'pendulum squat', en: 'pendulum squat' },
  'reverse_hyper': { pl: 'reverse hyper', en: 'reverse hyper' }, 'sled': { pl: 'sanki', en: 'sled' }, 'battle_ropes': { pl: 'liny bojowe', en: 'battle ropes' },
  'cardio.stair': { pl: 'stepper schodowy', en: 'stair climber' }, 'cardio.elliptical': { pl: 'orbitrek', en: 'elliptical' }, 'cardio.ski': { pl: 'ski erg', en: 'ski erg' },
  'stability_ball': { pl: 'piłka gimnastyczna', en: 'stability ball' }, 'sliders': { pl: 'ślizgacze', en: 'sliders' },
  /* pełna baza ćwiczeń (decyzja właściciela 04.10.2026, wieczór: „dodawaj resztę”) */
  'plate': { pl: 'talerz obciążeniowy', en: 'weight plate' }, 'foam_roller': { pl: 'roller', en: 'foam roller' }, 'bosu': { pl: 'bosu / platforma balansowa', en: 'BOSU / balance board' },
  'sandbag': { pl: 'worek z piaskiem', en: 'sandbag' }, 'chains': { pl: 'łańcuchy', en: 'chains' }, 'climbing_rope': { pl: 'lina do wspinania', en: 'climbing rope' },
  'wrist_roller': { pl: 'roller na nadgarstki', en: 'wrist roller' }, 'neck_harness': { pl: 'uprząż na szyję', en: 'neck harness' }, 'lever_machine': { pl: 'maszyna dźwigniowa', en: 'lever machine' },
  'tire': { pl: 'opona', en: 'tire' }, 'sledgehammer': { pl: 'młot', en: 'sledgehammer' }, 'atlas_stones': { pl: 'kamienie atlas', en: 'atlas stones' }, 'yoke': { pl: 'jarzmo (yoke)', en: 'yoke' },
  'log_bar': { pl: 'kłoda (log)', en: 'log bar' }, 'keg': { pl: 'beczka (keg)', en: 'keg' }, 'axle_bar': { pl: 'gryf gruby (axle)', en: 'axle bar' }, 'farmers_handles': { pl: 'uchwyty farmerskie', en: "farmer's handles" },
  'rickshaw': { pl: 'riksza', en: 'rickshaw' },
};
export const capLabel = (c: string) => { const l = Object.prototype.hasOwnProperty.call(CAP_LABEL, c) ? CAP_LABEL[c] : undefined; return l ? lbl(l) : c; };

export const EQUIP_GROUPS = ['free', 'benches', 'bars', 'cables', 'machines', 'accessories', 'cardio', 'strongman'] as const;
export type EquipGroup = typeof EQUIP_GROUPS[number];
export const EQUIP_GROUP_LABEL: Record<EquipGroup, L> = {
  free: { pl: 'Wolne ciężary', en: 'Free weights' }, benches: { pl: 'Ławki i stojaki', en: 'Benches and racks' }, bars: { pl: 'Drążki i poręcze', en: 'Bars and dip stations' },
  cables: { pl: 'Wyciągi', en: 'Cables' }, machines: { pl: 'Maszyny', en: 'Machines' }, accessories: { pl: 'Akcesoria', en: 'Accessories' }, cardio: { pl: 'Cardio', en: 'Cardio' }, strongman: { pl: 'Strongman', en: 'Strongman' },
};
/** Rodzaj ciężarów pozycji: decyduje, z której pozycji brać ciężary dla ćwiczenia (loadSource) i jaki edytor pokazać. */
export type LoadKind = 'barbell' | 'ez_bar' | 'trap_bar' | 'dumbbell' | 'kettlebell' | 'cable' | 'machine';
export interface EquipOption extends L { id: string; gives: string[]; /** zaznaczona przy dodaniu pozycji */ defaultOn?: boolean }
export interface EquipItem extends L { id: string; group: EquipGroup; gives: string[]; options?: EquipOption[]; load?: LoadKind; /** domyślny opis ciężarów przy zaznaczeniu pozycji */ defaultLoad?: 'list' | 'plates' | 'electric'; /** audyt E1 (M1): możliwości „przy okazji” (wyciąg górny stacji do ściągania) — liczą się do dostępności, ale ciężary dla ćwiczenia bierze się najpierw z pozycji, która daje je wprost */ secondary?: string[] }

const it = (id: string, group: EquipGroup, pl: string, en: string, gives: string[], extra: Partial<EquipItem> = {}): EquipItem => ({ id, group, pl, en, gives, ...extra });
const op = (id: string, pl: string, en: string, gives: string[], defaultOn = false): EquipOption => ({ id, pl, en, gives, ...(defaultOn ? { defaultOn } : {}) });

/** Pozycje sprzętu. Kolejność = kolejność na ekranie w grupie. Id są trwałe (zapisane w danych). */
export const EQUIPMENT: readonly EquipItem[] = [
  /* wolne ciężary */
  it('barbell', 'free', 'Sztanga (gryf olimpijski / prosty) + talerze', 'Barbell (olympic / straight bar) + plates', ['barbell'], { load: 'barbell', defaultLoad: 'plates' }),
  it('ez_bar', 'free', 'Gryf łamany (EZ) + talerze', 'EZ bar + plates', ['ez_bar'], { load: 'ez_bar', defaultLoad: 'plates' }),
  it('trap_bar', 'free', 'Gryf trap bar (heksagonalny) + talerze', 'Trap (hex) bar + plates', ['trap_bar'], { load: 'trap_bar', defaultLoad: 'plates' }),
  it('db_fixed', 'free', 'Hantle (stała waga albo z szybką regulacją)', 'Dumbbells (fixed or quick-adjust)', ['db'], { load: 'dumbbell', defaultLoad: 'list' }),
  it('db_plate', 'free', 'Hantle na talerze (uchwyty + talerze)', 'Plate-loaded dumbbells (handles + plates)', ['db'], { load: 'dumbbell', defaultLoad: 'plates' }),
  it('kettlebell', 'free', 'Kettlebell', 'Kettlebells', ['kb'], { load: 'kettlebell', defaultLoad: 'list' }),
  it('landmine', 'free', 'Landmine (uchwyt końca gryfu)', 'Landmine', ['landmine']),
  it('med_ball', 'free', 'Piłka lekarska', 'Medicine ball', ['med_ball']),
  it('dip_belt', 'free', 'Pas do dociążania', 'Dip belt', ['dip_belt']),
  it('plate', 'free', 'Talerz obciążeniowy (osobno, do trzymania)', 'Weight plate (held)', ['plate']),
  it('sandbag', 'free', 'Worek z piaskiem (sandbag)', 'Sandbag', ['sandbag']),
  it('chains', 'free', 'Łańcuchy (do sztangi)', 'Chains (for the barbell)', ['chains']),
  /* ławki i stojaki */
  it('bench_flat', 'benches', 'Ławka płaska', 'Flat bench', ['bench.flat']),
  it('bench_adj', 'benches', 'Ławka regulowana', 'Adjustable bench', ['bench.flat', 'bench.incline'], { options: [op('decline', 'ze skosem w dół', 'with decline', ['bench.decline'])] }),
  it('bench_decline', 'benches', 'Ławka skośna ujemna', 'Decline bench', ['bench.decline']),
  it('bench_press', 'benches', 'Ławka ze stojakami (do wyciskania)', 'Bench with uprights (press bench)', ['bench.flat', 'bench.uprights'], { options: [op('incline', 'z oparciem skośnym', 'with incline back', ['bench.incline'])] }),
  it('rack', 'benches', 'Klatka treningowa (power rack)', 'Power rack', ['rack', 'rack.safeties'], { options: [op('pullup', 'z drążkiem do podciągania', 'with pull-up bar', ['pullup.bar'], true)] }),
  it('squat_stands', 'benches', 'Stojaki do przysiadów', 'Squat stands', ['rack'], { options: [op('safeties', 'z asekuracją', 'with safety arms', ['rack.safeties'])] }),
  it('smith', 'benches', 'Suwnica Smitha', 'Smith machine', ['smith']),
  it('preacher', 'benches', 'Modlitewnik', 'Preacher bench', ['preacher_bench']),
  it('hyperext', 'benches', 'Ławka rzymska (hiperekstensje)', 'Hyperextension bench', ['hyperext_bench']),
  it('ghd', 'benches', 'GHD (glute-ham developer)', 'GHD (glute-ham developer)', ['ghd', 'glute_ham_raise']),
  it('box', 'benches', 'Skrzynia / stopień', 'Plyo box / step', ['box']),
  /* drążki i poręcze */
  it('pullup_bar', 'bars', 'Drążek do podciągania (rozporowy, ścienny)', 'Pull-up bar (doorway, wall-mounted)', ['pullup.bar']),
  it('dip_bars', 'bars', 'Poręcze do dipów', 'Dip bars', ['dip.bars']),
  it('power_tower', 'bars', 'Stacja: drążek + poręcze (power tower)', 'Power tower (pull-up + dip)', ['pullup.bar', 'dip.bars']),
  it('rings', 'bars', 'Kółka gimnastyczne', 'Gymnastic rings', ['rings']),
  it('suspension', 'bars', 'Taśmy TRX (podwieszane)', 'Suspension trainer (TRX)', ['suspension']),
  it('climbing_rope', 'bars', 'Lina do wspinania', 'Climbing rope', ['climbing_rope']),
  /* wyciągi */
  it('cable_cross', 'cables', 'Brama (dwa wyciągi z regulacją wysokości)', 'Cable crossover (two adjustable pulleys)', ['cable.high', 'cable.mid', 'cable.low', 'cable.dual', 'cable.handles'], { load: 'cable', defaultLoad: 'list', options: [op('rope', 'lina', 'rope', ['cable.rope'], true), op('ankle', 'opaski na kostki', 'ankle straps', ['ankle_strap'])] }),
  it('cable_single', 'cables', 'Wyciąg z regulacją wysokości (jeden)', 'Single adjustable pulley', ['cable.high', 'cable.mid', 'cable.low', 'cable.handles'], { load: 'cable', defaultLoad: 'list', options: [op('rope', 'lina', 'rope', ['cable.rope'], true), op('ankle', 'opaski na kostki', 'ankle straps', ['ankle_strap'])] }),
  it('lat_pulldown', 'cables', 'Wyciąg górny (ściąganie drążka)', 'Lat pulldown', ['lat_pulldown', 'cable.high'], { load: 'cable', defaultLoad: 'list', secondary: ['cable.high'] }),
  it('cable_row', 'cables', 'Wyciąg dolny (wiosłowanie siedząc)', 'Seated cable row', ['cable.row_seat', 'cable.low'], { load: 'cable', defaultLoad: 'list', secondary: ['cable.low'] }),
  /* 3.4: jedna pozycja dla wszystkich stacji z oporem elektrycznym / magnetycznym */
  it('electric', 'cables', 'Stacja z oporem elektrycznym / magnetycznym (np. ViShape, Speediance, Tonal…)', 'Electric / magnetic resistance station (e.g. ViShape, Speediance, Tonal…)', ['cable.low', 'cable.handles'], {
    load: 'cable', defaultLoad: 'electric', options: [
      op('dual', 'dwie niezależne linki', 'two independent cables', ['cable.dual'], true),
      op('belt', 'pas biodrowy', 'hip belt', ['dip_belt'], true),
      op('ankle', 'opaski na kostki', 'ankle straps', ['ankle_strap'], true),
      op('arms', 'ramiona regulowane / wysoki wyciąg', 'adjustable arms / high pulley', ['cable.high', 'cable.mid']),
      op('bench', 'ławka w zestawie', 'bench included', ['bench.flat', 'bench.incline']),
      op('rope', 'lina', 'rope', ['cable.rope']),
    ] }),
  /* maszyny */
  it('leg_press', 'machines', 'Suwnica na nogi (leg press)', 'Leg press', ['leg_press'], { load: 'machine', defaultLoad: 'list' }),
  it('hack_squat', 'machines', 'Hack squat', 'Hack squat', ['hack_squat'], { load: 'machine', defaultLoad: 'list' }),
  it('leg_ext', 'machines', 'Maszyna do prostowania nóg', 'Leg extension', ['leg_ext'], { load: 'machine', defaultLoad: 'list' }),
  it('leg_curl', 'machines', 'Maszyna do uginania nóg', 'Leg curl', ['leg_curl'], { load: 'machine', defaultLoad: 'list' }),
  it('chest_press', 'machines', 'Maszyna do wyciskania (klatka)', 'Chest press machine', ['chest_press_machine'], { load: 'machine', defaultLoad: 'list' }),
  it('pec_deck', 'machines', 'Butterfly (pec deck)', 'Pec deck', ['pec_deck'], { load: 'machine', defaultLoad: 'list' }),
  it('shoulder_press', 'machines', 'Maszyna do wyciskania nad głowę', 'Shoulder press machine', ['shoulder_press_machine'], { load: 'machine', defaultLoad: 'list' }),
  it('hip_abd_add', 'machines', 'Maszyna do odwodzenia / przywodzenia', 'Hip abductor / adductor', ['hip_abductor_adductor'], { load: 'machine', defaultLoad: 'list' }),
  it('calf_machine', 'machines', 'Maszyna do łydek', 'Calf machine', ['calf_machine'], { load: 'machine', defaultLoad: 'list' }),
  it('t_bar', 'machines', 'Wiosłowanie T-bar', 'T-bar row', ['t_bar'], { load: 'machine', defaultLoad: 'list' }),
  /* decyzja właściciela 04.10.2026 (wieczór): brakujący sprzęt */
  it('row_machine', 'machines', 'Maszyna do wiosłowania (siedząc)', 'Seated row machine', ['row_machine'], { load: 'machine', defaultLoad: 'list' }),
  it('pullover_machine', 'machines', 'Maszyna pullover', 'Pullover machine', ['pullover_machine'], { load: 'machine', defaultLoad: 'list' }),
  it('ab_crunch_machine', 'machines', 'Maszyna do brzucha (spięcia)', 'Ab crunch machine', ['ab_crunch_machine'], { load: 'machine', defaultLoad: 'list' }),
  it('biceps_curl_machine', 'machines', 'Maszyna do uginania ramion (biceps)', 'Biceps curl machine', ['biceps_curl_machine'], { load: 'machine', defaultLoad: 'list' }),
  it('triceps_ext_machine', 'machines', 'Maszyna do prostowania ramion (triceps)', 'Triceps extension machine', ['triceps_ext_machine'], { load: 'machine', defaultLoad: 'list' }),
  it('lateral_raise_machine', 'machines', 'Maszyna do wznosów bokiem', 'Lateral raise machine', ['lateral_raise_machine'], { load: 'machine', defaultLoad: 'list' }),
  it('glute_kickback_machine', 'machines', 'Maszyna do wykopów nogą w tył (pośladki)', 'Glute kickback machine', ['glute_kickback_machine'], { load: 'machine', defaultLoad: 'list' }),
  it('hip_thrust_machine', 'machines', 'Maszyna do hip thrustu', 'Hip thrust machine', ['hip_thrust_machine'], { load: 'machine', defaultLoad: 'list' }),
  it('belt_squat', 'machines', 'Maszyna do przysiadów z pasem (belt squat)', 'Belt squat machine', ['belt_squat_machine'], { load: 'machine', defaultLoad: 'list' }),
  it('pendulum_squat', 'machines', 'Pendulum squat', 'Pendulum squat machine', ['pendulum_squat'], { load: 'machine', defaultLoad: 'list' }),
  it('lever_machine', 'machines', 'Maszyny dźwigniowe na talerze (wiosłowanie, wyciskanie, martwy ciąg…)', 'Plate-loaded lever machines (row, press, deadlift…)', ['lever_machine'], { load: 'machine', defaultLoad: 'list' }),
  it('reverse_hyper', 'machines', 'Reverse hyper (odwrotne hiperekstensje)', 'Reverse hyper machine', ['reverse_hyper'], { load: 'machine', defaultLoad: 'list' }),
  /* akcesoria */
  it('bands', 'accessories', 'Gumy oporowe', 'Resistance bands', ['bands']),
  it('ab_wheel', 'accessories', 'Kółko do brzucha', 'Ab wheel', ['ab_wheel']),
  it('floor_mat', 'accessories', 'Mata', 'Mat', ['floor_mat']),
  it('jump_rope', 'accessories', 'Skakanka', 'Jump rope', ['jump_rope']),
  it('stability_ball', 'accessories', 'Piłka gimnastyczna (fitball)', 'Stability ball', ['stability_ball']),
  it('sliders', 'accessories', 'Ślizgacze (slidery)', 'Sliders', ['sliders']),
  it('sled', 'accessories', 'Sanki (prowler)', 'Sled (prowler)', ['sled']),
  it('battle_ropes', 'accessories', 'Liny bojowe (battle ropes)', 'Battle ropes', ['battle_ropes']),
  it('foam_roller', 'accessories', 'Roller do automasażu', 'Foam roller', ['foam_roller']),
  it('bosu', 'accessories', 'Bosu / platforma balansowa', 'BOSU / balance board', ['bosu']),
  it('wrist_roller', 'accessories', 'Roller na nadgarstki', 'Wrist roller', ['wrist_roller']),
  it('neck_harness', 'accessories', 'Uprząż na szyję', 'Neck harness', ['neck_harness']),
  /* cardio */
  it('treadmill', 'cardio', 'Bieżnia', 'Treadmill', ['cardio.treadmill'], { options: [op('incline', 'z regulacją nachylenia (marsz pod górę)', 'with incline (uphill walking)', ['cardio.treadmill_incline'], true)] }), /* uwaga właściciela 05.10.2026 */
  it('bike', 'cardio', 'Rower stacjonarny / air bike', 'Stationary / air bike', ['cardio.bike']),
  it('rower', 'cardio', 'Wioślarz', 'Rowing machine', ['cardio.rower']),
  it('stair_climber', 'cardio', 'Stepper schodowy (stair climber)', 'Stair climber', ['cardio.stair']),
  it('elliptical', 'cardio', 'Orbitrek', 'Elliptical', ['cardio.elliptical']),
  it('ski_erg', 'cardio', 'Ski erg', 'Ski erg', ['cardio.ski']),
  /* strongman — poza presetem „Pełna siłownia” */
  it('tire', 'strongman', 'Opona do przewracania', 'Tire (flips)', ['tire']),
  it('sledgehammer', 'strongman', 'Młot', 'Sledgehammer', ['sledgehammer']),
  it('atlas_stones', 'strongman', 'Kamienie atlas', 'Atlas stones', ['atlas_stones']),
  it('yoke', 'strongman', 'Jarzmo (yoke)', 'Yoke', ['yoke']),
  it('log_bar', 'strongman', 'Kłoda (log bar)', 'Log bar', ['log_bar']),
  it('keg', 'strongman', 'Beczka (keg)', 'Keg', ['keg']),
  it('axle_bar', 'strongman', 'Gryf gruby (axle)', 'Axle bar', ['axle_bar']),
  it('farmers_handles', 'strongman', 'Uchwyty farmerskie', "Farmer's walk handles", ['farmers_handles']),
  it('rickshaw', 'strongman', 'Riksza (rickshaw)', 'Rickshaw', ['rickshaw']),
  it('bicycle', 'cardio', 'Rower (jazda na zewnątrz)', 'Bicycle (outdoors)', ['outdoor']),
];
const BY_ID = new Map(EQUIPMENT.map(x => [x.id, x]));
export const equipById = (id: string) => BY_ID.get(id);
export const equipLabel = (x: L) => lbl(x);

/* ---------- ciężary: domyślne opisy i presety modeli (wartości ze źródeł w dokumencie; reszta do wpisania przez użytkownika) ---------- */
const listOf = (vals: number[], unit: LoadUnit = 'kg'): LoadSpec => ({ kind: 'list', unit, items: vals.map(w => ({ w, on: true })) });
const OLY_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
/** Domyślny (pusty) opis ciężarów dla pozycji — do wypełnienia w edytorze. Pusta lista = ciężary nieznane (podpowiedź jak przed P-003). */
export function blankLoad(item: EquipItem, unit: LoadUnit = 'kg'): LoadSpec | undefined {
  if (!item.load) return undefined;
  if (item.defaultLoad === 'plates') return { kind: 'plates', unit, base: item.id === 'db_plate' ? 0 : item.id === 'ez_bar' ? 10 : 20, plates: [] };
  if (item.defaultLoad === 'electric') return { kind: 'electric', unit, min: 0, max: 0, step: unit === 'lb' ? 1 : 0.5 };
  return { kind: 'list', unit, items: [] };
}
/** Presety modeli w edytorze ciężarów — tylko z danymi ze źródeł (docs/10, sekcje 3.2 i 3.4). TREXO TXO-B4W002: kroki nieznane → brak presetu. */
export const LOAD_PRESETS: { id: string; item: string; label: L; spec: () => LoadSpec; optsOff?: string[] }[] = [ /* audyt (LOW): nazwy z przecinkiem / kropką wg języka */
  { id: 'gymtek24', item: 'db_fixed', label: { pl: 'Gymtek 2,5–24 kg', en: 'Gymtek 2.5–24 kg' }, spec: () => listOf([2.5, 3.5, 4.5, 5.5, 6.5, 8, 9, 10, 11.5, 13.5, 16, 18, 20.5, 22.5, 24]) },
  { id: 'hopsport2x10', item: 'db_plate', label: { pl: 'Hop-Sport 2×10 kg', en: 'Hop-Sport 2×10 kg' }, spec: () => ({ kind: 'plates', unit: 'kg', base: 1.5, plates: [{ w: 2.5, n: 4 }, { w: 1.25, n: 4 }, { w: 0.5, n: 4 }] }) },
  { id: 'vishape_pro', item: 'electric', label: { pl: 'ViShape SmartGym Pro (1,5–65 kg/str.)', en: 'ViShape SmartGym Pro (1.5–65 kg/side)' }, spec: () => ({ kind: 'electric', unit: 'kg', min: 1.5, max: 65, step: 0.5 }) },
  /* 06.10.2026: dane z docs/research/equipment/stations.json (strona producenta i centrum pomocy); jedna linka */
  { id: 'voltra1', item: 'electric', label: { pl: 'Beyond Power Voltra I (5–200 lb)', en: 'Beyond Power Voltra I (5–200 lb)' }, spec: () => ({ kind: 'electric', unit: 'lb', min: 5, max: 200, step: 1 }), optsOff: ['dual'] },
  { id: 'vishape_lite', item: 'electric', label: { pl: 'ViShape SmartGym Lite (1,5–35 kg/str.)', en: 'ViShape SmartGym Lite (1.5–35 kg/side)' }, spec: () => ({ kind: 'electric', unit: 'kg', min: 1.5, max: 35, step: 0.5 }) },
];

/** Preset modelu: ciężary i — gdy model czegoś nie ma — odznaczone opcje (Voltra I: jedna linka; przegląd 06.10). Pozostałe opcje bez zmian:
 * wyposażenia dodatkowego (pas, opaski) źródła nie podają. */
export function applyLoadPreset(entry: { load?: LoadSpec; opts: string[] }, p: typeof LOAD_PRESETS[number]) { entry.load = p.spec(); if (p.optsOff) entry.opts = entry.opts.filter(o => !p.optsOff!.includes(o)); }

/* ---------- presety miejsc ---------- */
export const LOCATION_PRESETS = ['gym', 'home', 'bodyweight', 'hotel'] as const;
export type LocationPreset = typeof LOCATION_PRESETS[number];
export const LOCATION_PRESET_LABEL: Record<LocationPreset, L> = {
  gym: { pl: 'Pełna siłownia', en: 'Full gym' }, home: { pl: 'Dom', en: 'Home' }, bodyweight: { pl: 'Tylko masa ciała', en: 'Bodyweight only' }, hotel: { pl: 'Hotel', en: 'Hotel' },
};
/** Opis presetów bez ciężarów w kreatorze (wartości presetów do potwierdzenia — docs/10, sekcja 5). Siłownia i hotel — presetHint (z danych). */
export const LOCATION_PRESET_HINT: Record<Exclude<LocationPreset, 'gym' | 'hotel'>, L> = {
  home: { pl: 'pusto — zaznaczysz, co masz', en: 'empty — tick what you have' },
  bodyweight: { pl: 'tylko mata', en: 'mat only' },
};
/** Pozycja z domyślnymi opcjami i opisem ciężarów. */
export function equipEntry(id: string, unit: LoadUnit = 'kg', allOptions = false): LocEquip {
  const x = equipById(id); if (!x) throw new Error('unknown equipment ' + id);
  const e: LocEquip = { item: id, opts: (x.options ?? []).filter(o => allOptions || o.defaultOn).map(o => o.id) }; const l = blankLoad(x, unit); if (l) e.load = l; return e;
}
/** Sprzęt presetu miejsca. Audyt (LOW): w jednostce aplikacji — przy lb typowe ciężary w funtach (gryf 45 lb, talerze 45…2,5 lb, hantle co 5 lb). */
const LB_PLATES = [45, 35, 25, 10, 5, 2.5];
export function presetEquipment(p: LocationPreset, unit: LoadUnit = 'kg'): LocEquip[] {
  const lb = unit === 'lb';
  if (p === 'home') return [];
  if (p === 'bodyweight') return [equipEntry('floor_mat', unit)];
  if (p === 'hotel') { const db = equipEntry('db_fixed', unit); db.load = lb ? listOf(rangeValues(5, 50, 5), 'lb') : listOf(rangeValues(2.5, 25, 2.5)); return [db, equipEntry('bench_adj'), equipEntry('floor_mat'), equipEntry('treadmill'), equipEntry('bike')]; }
  return EQUIPMENT.map(x => { const e = equipEntry(x.id, unit, true);
    if (x.id === 'electric') e.opts = e.opts.filter(o => o !== 'bench'); /* ławki siłowni są osobno */
    if (x.id === 'barbell' || x.id === 'trap_bar' || x.id === 'ez_bar') e.load = lb ? { kind: 'plates', unit: 'lb', base: x.id === 'ez_bar' ? 25 : 45, plates: LB_PLATES.map(w => ({ w, n: 8 })) } : { kind: 'plates', unit: 'kg', base: x.id === 'ez_bar' ? 10 : 20, plates: OLY_PLATES.map(w => ({ w, n: 8 })) };
    if (x.id === 'db_fixed') e.load = lb ? listOf(rangeValues(5, 100, 5), 'lb') : listOf(rangeValues(2.5, 50, 2.5));
    if (x.id === 'db_plate' || x.id === 'electric' || x.group === 'strongman') return null; /* siłownia: hantle stałe; stacji elektrycznej i sprzętu strongman zwykle nie ma */
    return e; }).filter((e): e is LocEquip => !!e);
}

/** Audyt 0.10 LOG-08: opis presetu w kreatorze z danych presetEquipment(p, unit) — liczby i jednostka takie, jakie preset naprawdę utworzy (kg albo lb). */
export function presetHint(p: LocationPreset, unit: LoadUnit = 'kg'): string {
  if (p === 'home' || p === 'bodyweight') return lbl(LOCATION_PRESET_HINT[p]);
  const eq = presetEquipment(p, unit); const ws = (id: string) => { const l = eq.find(e => e.item === id)?.load; return l?.kind === 'list' ? l.items.map(x => x.w) : []; };
  const db = ws('db_fixed'); const dbA = fmtNum(db[0] ?? 0), dbB = fmtNum(db[db.length - 1] ?? 0);
  if (p === 'hotel') return t('hantle {a}–{b} {u}, ławka regulowana, mata, bieżnia, rower', { a: dbA, b: dbB, u: unit });
  const bar = eq.find(e => e.item === 'barbell')?.load; const plates = bar?.kind === 'plates' ? bar.plates.map(x => x.w) : [];
  return t('cały sprzęt; sztanga {bar} {u} + talerze {max}…{min} {u}; hantle {a}–{b} {u} co {step}', { bar: fmtNum(bar?.kind === 'plates' ? bar.base : 0), u: unit, max: fmtNum(Math.max(...plates)), min: fmtNum(Math.min(...plates)), a: dbA, b: dbB, step: fmtNum(db.length > 1 ? db[1] - db[0] : 0) });
}

/** Decyzja właściciela 05.10.2026 („1.a”): nowy sprzęt (katalog krok b i pełna baza, 04.10.2026) dopisany RAZ do zapisanych miejsc opartych na
 * presecie siłowni (State.equipFill = rev); miejsce kwalifikuje się, gdy ma co najmniej GYM_FILL.share pozycji dawnego presetu (dom, hotel — nie).
 * Pozycje usunięte później przez użytkownika nie wracają (znacznik); istniejące pozycje, ciężary i opcje bez zmian (poza dopisaniem opcji z `opts`). */
export const GYM_FILL = {
  rev: 'sprzet-2026-10-05',
  share: 0.75,
  items: ['row_machine', 'pullover_machine', 'ab_crunch_machine', 'biceps_curl_machine', 'triceps_ext_machine', 'lateral_raise_machine', 'glute_kickback_machine', 'hip_thrust_machine', 'belt_squat', 'pendulum_squat', 'reverse_hyper', 'lever_machine',
    'plate', 'sandbag', 'chains', 'climbing_rope', 'stability_ball', 'sliders', 'sled', 'battle_ropes', 'foam_roller', 'bosu', 'wrist_roller', 'neck_harness', 'stair_climber', 'elliptical', 'ski_erg'] as readonly string[],
  opts: { cable_cross: ['ankle'], cable_single: ['ankle'] } as Readonly<Record<string, readonly string[]>>,
};
/**
 * Nowe opcje istniejących pozycji, dopisywane raz (State.optFill = rev) do pozycji sprzed opcji — żeby ćwiczenie dotąd dostępne
 * nie zniknęło po aktualizacji (bieżnia: „marsz pod górę” wymaga od 05.10.2026 nachylenia). Odznaczenie później zostaje.
 */
export const OPT_FILL = { rev: 'opcje-2026-10-05', opts: { treadmill: ['incline'] } as Readonly<Record<string, readonly string[]>> };
export function fillOpts(loc: Pick<Location, 'equipment'>) { for (const e of loc.equipment) for (const o of OPT_FILL.opts[e.item] ?? []) if (!e.opts.includes(o)) e.opts.push(o); }
/** Dopisuje nowy sprzęt do miejsca opartego na presecie siłowni; zwraca, czy miejsce się kwalifikowało. */
export function fillGym(loc: Pick<Location, 'equipment'>, unit: LoadUnit = 'kg'): boolean {
  const old = presetEquipment('gym', unit).map(e => e.item).filter(id => !GYM_FILL.items.includes(id)); const have = new Set(loc.equipment.map(e => e.item)); const on = new Set(loc.equipment.filter(e => !e.off).map(e => e.item)); /* audyt 05.10 (MEDIUM): kwalifikują tylko zaznaczone pozycje */
  if (!old.length || old.filter(id => on.has(id)).length < old.length * GYM_FILL.share) return false;
  for (const id of GYM_FILL.items) if (!have.has(id) && equipById(id)) loc.equipment.push(equipEntry(id, unit, true));
  for (const e of loc.equipment) if (!e.off) for (const o of GYM_FILL.opts[e.item] ?? []) if (!e.opts.includes(o)) e.opts.push(o); /* audyt 05.10 (LOW): tylko zaznaczone wyciągi */
  return true;
}

/** Wszystkie etykiety {pl, en} sprzętu i presetów — źródło tłumaczeń na inne języki (lib/locales/_source.json). */
export function allLabels(): L[] {
  return [...Object.values(CAP_LABEL), ...Object.values(EQUIP_GROUP_LABEL), ...EQUIPMENT.flatMap(x => [x, ...(x.options ?? [])]), ...LOAD_PRESETS.map(p => p.label),
    ...Object.values(LOCATION_PRESET_LABEL), ...Object.values(LOCATION_PRESET_HINT)].map(x => ({ pl: x.pl, en: x.en }));
}

/* ---------- dostępność ---------- */
/** Możliwości, które daje miejsce (pozycje + zaznaczone opcje). */
export function capsOf(loc: Location | null | undefined): Set<string> {
  const out = new Set<string>(); if (!loc) return out;
  for (const e of loc.equipment) { const x = equipById(e.item); if (!x || e.off) continue; x.gives.forEach(c => out.add(c)); for (const o of x.options ?? []) if (e.opts.includes(o.id)) o.gives.forEach(c => out.add(c)); }
  return out;
}
export interface Availability { ok: boolean; /** niespełnione grupy wymagań (w grupie: którakolwiek możliwość wystarczy) */ missing: string[][]; /** brakujące zalecane (tylko informacja) */ missingRecommended: string[] }
/** Czy ćwiczenie da się zrobić w miejscu. Ćwiczenie bez wymagań (własne) jest zawsze dostępne. */
export function availability(ex: Pick<Exercise, 'requires' | 'recommended'>, loc: Location | null | undefined, caps: Set<string> = capsOf(loc)): Availability {
  const missing = (ex.requires ?? []).filter(g => !g.some(c => caps.has(c)));
  return { ok: !missing.length, missing, missingRecommended: (ex.recommended ?? []).filter(c => !caps.has(c)) };
}
/** „ławka skośna, drążek / kółka gimnastyczne” — dopisek do niedostępnego ćwiczenia. */
export const missingLabel = (missing: string[][]) => missing.map(g => g.map(capLabel).join(' / ')).join(', ');

/* ---------- ciężary dla ćwiczenia w miejscu ---------- */
const KIND_BY_SOURCE: Partial<Record<LoadSource, LoadKind>> = { barbell: 'barbell', dumbbell: 'dumbbell', kettlebell: 'kettlebell', ez_bar: 'ez_bar', trap_bar: 'trap_bar', cable: 'cable', machine_stack: 'machine', plate_loaded_machine: 'machine' };
/** Możliwości dawane przez maszyny z ciężarami (T-bar, suwnica…): wymaganie takiej możliwości = maszyna może być źródłem obciążenia (audyt M2). */
const MACHINE_CAPS = new Set(EQUIPMENT.filter(x => x.load === 'machine').flatMap(x => x.gives));
/** Rodzaje ciężarów, z których ćwiczenie może brać obciążenie: najpierw z loadSource, potem z alternatyw w wymaganiach (RDL: hantle albo wyciąg;
 * goblet: hantel albo kettle; T-Bar Row: sztanga albo maszyna T-bar). */
export function loadKindsFor(ex: Pick<Exercise, 'loadSource' | 'requires'>): LoadKind[] {
  const out: LoadKind[] = []; const add = (k: LoadKind | undefined) => { if (k && !out.includes(k)) out.push(k); };
  add(ex.loadSource ? KIND_BY_SOURCE[ex.loadSource] : undefined);
  if (!out.length) return out; /* masa ciała / bez obciążenia — bez listy ciężarów */
  for (const c of (ex.requires ?? []).flat()) add(c === 'db' ? 'dumbbell' : c === 'kb' ? 'kettlebell' : c.startsWith('cable.') ? 'cable' : c === 'barbell' ? 'barbell' : c === 'ez_bar' ? 'ez_bar' : c === 'trap_bar' ? 'trap_bar' : MACHINE_CAPS.has(c) ? 'machine' : undefined); /* przegląd 06.10: EZ i trap bar jako alternatywa (Upright Row, Reverse Curl…) */
  return out;
}
export type ExLoads = { kind: 'loads'; loads: number[]; item: string } | { kind: 'unknown' } | { kind: 'none' };
/** Możliwości pozycji w miejscu (z zaznaczonymi opcjami); `primary` — bez możliwości „przy okazji”. */
function entryCaps(e: LocEquip, x: EquipItem, primary: boolean): Set<string> {
  const out = new Set(x.gives.filter(c => !primary || !(x.secondary ?? []).includes(c))); for (const o of x.options ?? []) if (e.opts.includes(o.id)) o.gives.forEach(c => out.add(c)); return out;
}
/**
 * Dostępne ciężary ćwiczenia w miejscu (kg, rosnąco), w tej postaci, w jakiej wpisuje się ciężar serii:
 *  - hantle per hantel: lista jednego hantla albo pary (talerze dzielone na 4 — implements: 2), łącznie: suma pary;
 *  - stacja elektryczna: zawsze NA STRONĘ — tak, jak pokazuje urządzenie (decyzja 03.10.2026 „ViShape na stronę”; także ćwiczenia na dwie
 *    linki i przysiad z pasem — wpisuje się liczbę z ekranu urządzenia, nie sumę linek);
 *  - przyrządy dobierane po tym, co ćwiczenie wymaga (audyt M1): najpierw pozycje, które dają wymaganą możliwość wprost (Triceps Pushdown —
 *    brama, nie stos wyciągu do ściągania), potem „przy okazji”; maszyny zawsze tylko spełniające wymaganie (Leg Press ≠ prostowanie nóg);
 *    wolne ciężary i wyciągi bez dopasowania — wszystkie pozycje tego rodzaju (np. wykroki: hantle są tylko zalecane).
 * 'none' = ćwiczenie z biblioteki z obciążeniem tylko zalecanym (wykroki, russian twist — decyzja 4a), a w miejscu nie ma tego przyrządu;
 * 'unknown' = podpowiedź jak przed P-003 (przyrząd bez wpisanych ciężarów, ćwiczenie własne bez wymagań, nic nie pasuje — audyt H3).
 */
/** `prefer` (E2 D5, docs/14 pkt 3.7.3): przyrząd wybrany ręcznie w bloku (implPinned) — ciężary tylko z pozycji tego przyrządu; gdy go w miejscu nie ma
 * (implsAt) — bez znaczenia (dobór jak bez niego). */
export function loadsFor(ex: Pick<Exercise, 'loadSource' | 'requires' | 'recommended' | 'loadMode' | 'implements'>, loc: Location | null | undefined, prefer?: Impl): ExLoads {
  return resolveLoads(ex, loc, prefer).res;
}
/**
 * Decyzja 8c (03.10.2026): przyrząd, którym ćwiczenie robi się w tym miejscu — ten sam dobór co loadsFor (pierwszy rodzaj ciężaru z wpisanymi
 * ciężarami; gdy żaden nie ma ciężarów — pierwszy obecny): 'dumbbell', 'kettlebell', 'barbell', 'machine'…; wyciąg: 'electric', gdy wartości
 * (albo pierwsza pasująca pozycja) pochodzą ze stacji z oporem elektrycznym / magnetycznym, inaczej 'cable'. Bez miejsca, ćwiczenie bez
 * obciążenia (masa ciała) albo bez pasującego przyrządu — undefined.
 */
export function implAt(ex: Pick<Exercise, 'loadSource' | 'requires' | 'recommended' | 'loadMode' | 'implements'>, loc: Location | null | undefined): Impl | undefined {
  return resolveLoads(ex, loc).impl;
}
const implOf = (kind: LoadKind, item: string): Impl => kind === 'cable' && item === 'electric' ? 'electric' : kind;
function resolveLoads(ex: Pick<Exercise, 'loadSource' | 'requires' | 'recommended' | 'loadMode' | 'implements'>, loc: Location | null | undefined, prefer?: Impl): { res: ExLoads; impl?: Impl } {
  if (!loc) return { res: { kind: 'unknown' } };
  const kinds = loadKindsFor(ex); if (!kinds.length) return { res: { kind: 'unknown' } };
  const only = prefer && implsAt(ex, loc).includes(prefer) ? prefer : undefined; /* E2 D5: tylko pozycje przypiętego przyrządu */
  const need = new Set((ex.requires ?? []).flat()); const firsts = new Set((ex.requires ?? []).map(g => g[0]));
  const mode: LoadMode = ex.loadMode ?? 'total'; const nImpl = ex.implements ?? (mode === 'per_dumbbell' ? 2 : 1);
  const valsOf = (e: LocEquip, kind: LoadKind): number[] => {
    if (!e.load || noPlates(e.load)) return []; /* decyzja 06.10.2026: gryf bez talerzy = ciężary nieznane */
    if (e.load.kind === 'electric') return achievable(e.load, { mult: [1] }); /* decyzja 03.10.2026: ciężar stacji zawsze na stronę (jak na ekranie urządzenia) */
    if (kind === 'dumbbell') return achievable(e.load, { perStep: nImpl === 2 ? 4 : 2, mult: mode === 'total' && nImpl === 2 ? [2] : [1] });
    return achievable(e.load, { perStep: 2 });
  };
  let present: Impl | undefined;
  for (const kind of kinds) {
    const of = loc.equipment.flatMap(e => { const x = equipById(e.item); return x && !e.off && x.load === kind && (!only || implOf(kind, e.item) === only) ? [{ e, x }] : []; });
    const hits = (primary: boolean, caps: Set<string>) => of.filter(({ e, x }) => [...entryCaps(e, x, primary)].some(c => caps.has(c)));
    /* kolejność: pozycja dająca wprost PIERWSZĄ możliwość grupy (Lat Pulldown → stos wyciągu do ściągania), potem dowolną wymaganą wprost, potem „przy okazji” */
    let use = hits(true, firsts); if (!use.length) use = hits(true, need); if (!use.length) use = hits(false, need);
    if (!use.length && kind !== 'machine') use = of; /* nic nie daje wymaganej możliwości wprost — wszystkie pozycje tego rodzaju */
    if (use.length && !present) present = implOf(kind, use[0].e.item);
    const all: number[] = []; let item = '';
    for (const { e } of use) { const v = valsOf(e, kind); if (v.length) { all.push(...v); item = item || e.item; } }
    if (all.length) { all.sort((a, b) => a - b); const u: number[] = []; for (const v of all) if (!u.length || v - u[u.length - 1] > 0.01 + 1e-9) u.push(v); return { res: { kind: 'loads', loads: u, item }, impl: implOf(kind, item) }; }
  }
  if (present) return { res: { kind: 'unknown' }, impl: present };
  /* brak przyrządu: tylko dla ćwiczeń bez wymagań z obciążeniem zalecanym (decyzja 4a) — reszta jak przed P-003 */
  const recLoad = (ex.recommended ?? []).some(c => c === 'db' || c === 'kb' || c === 'barbell');
  return { res: !(ex.requires ?? []).length && recLoad ? { kind: 'none' } : { kind: 'unknown' } };
}
/**
 * E2 D5 (docs/14 pkt 3.7.1): wszystkie przyrządy, którymi ćwiczenie da się zrobić w miejscu — rodzaje ciężaru z loadKindsFor (w tej kolejności),
 * każdy jako przyrząd jak w implAt (stacja → 'electric', zwykły wyciąg → 'cable'). Pozycja liczy się, gdy daje możliwość z wymagań ćwiczenia
 * (RDL: hantle albo wyciąg dolny — stacja tak, brama też); gdy ŻADNA pozycja tego rodzaju w ogóle nie może dać możliwości z wymagań (np. hantle
 * tylko zalecane) — każda pozycja tego rodzaju. Maszyny zawsze tylko spełniające wymaganie (jak resolveLoads). Bez miejsca — pusto.
 */
export function implsAt(ex: Pick<Exercise, 'loadSource' | 'requires'>, loc: Location | null | undefined): Impl[] {
  if (!loc) return []; const need = new Set((ex.requires ?? []).flat()); const out: Impl[] = [];
  for (const kind of loadKindsFor(ex)) {
    const can = kind === 'machine' || EQUIPMENT.some(x => x.load === kind && [...x.gives, ...(x.options ?? []).flatMap(o => o.gives)].some(c => need.has(c)));
    for (const e of loc.equipment) {
      const x = equipById(e.item); if (!x || e.off || x.load !== kind) continue;
      if (can && ![...entryCaps(e, x, false)].some(c => need.has(c))) continue;
      const i = implOf(kind, e.item); if (!out.includes(i)) out.push(i);
    }
  }
  return out;
}
/**
 * Styl „Tuleja” (07.10.2026): opis „gryf + talerze” przyrządu, z którego ćwiczenie bierze ciężar w miejscu — dla rysunku „co nałożyć na stronę”
 * (lib/plates.ts). Tylko sztanga, gryf EZ i trap bar liczone łącznie (ciężar serii = gryf + talerze z obu stron); hantle, maszyny, stacje — null.
 * Ten sam dobór pozycji co loadsFor (`prefer` — przyrząd przypięty w bloku). Gryf bez talerzy (noPlates) — null (ciężary nieznane, 06.10.2026).
 */
export function plateSpecFor(ex: Pick<Exercise, 'loadSource' | 'requires' | 'recommended' | 'loadMode' | 'implements'>, loc: Location | null | undefined, prefer?: Impl): LoadSpec | null {
  if (!loc || (ex.loadMode ?? 'total') !== 'total' || (ex.implements ?? 1) !== 1) return null;
  const { res, impl } = resolveLoads(ex, loc, prefer); if (res.kind !== 'loads' || !(impl === 'barbell' || impl === 'ez_bar' || impl === 'trap_bar')) return null;
  const e = loc.equipment.find(x => x.item === res.item && !x.off); const spec = e?.load;
  return spec && spec.kind === 'plates' && !noPlates(spec) ? spec : null;
}
