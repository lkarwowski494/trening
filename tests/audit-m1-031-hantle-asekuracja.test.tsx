/*
 * Audyt M1 z 21.10.2026 — M1-031 część 2 (DEC-08 a, właściciel 23.10.2026): NSCA 2017 Standard 3.2 (s. 11) mówi o „free weights” supported on the trunk or moved over
 * the head/face — czyli także o hantlach. Część 1 objęła sztangę i EZ (tests/audit-m1-031-asekuracja-zakres.test.tsx); tu: ćwiczenia z hantlami nad głową lub twarzą
 * (wyciskania i rozpiętki leżąc lub na skosie, pullover, wyprosty ramion nad głową/za głową, wyciskania nad głowę) dostają zdanie „zalecana osoba asekurująca”
 * (pole katalogu `spot: "spotter_db"` → CATALOG_SPOTTER_DB). Zakres: wyłącznie hantle (loadSource dumbbell); kettlebell poza zakresem.
 *  - OTWARTE (bez ramki, decyzja DEC-08 i docs/research/przeglad-badacza-2026-10-23.md): ćwiczenia dynamiczne (szarpnięcie, podrzut, thruster, skok z hantlem),
 *    hantel/hantle opierane o tułów (goblet), hip thrust, przenoszenie nad głową — Standard 3.2 mówi „free weights”, ale sposób asekuracji opisuje przypis 7 (nieprzeczytany).
 * Strażnik: każde ćwiczenie katalogu z hantlami ma przypisaną kategorię — nowe ćwiczenie bez decyzji zatrzymuje test.
 */
import { render, screen as rtlScreen } from '@testing-library/react-native';
import React from 'react';
import * as cat from '@/lib/catalog.generated';
import { CATALOG } from '@/lib/catalog.generated';
import { needsSafety, needsSpotter, needsSpotterDb } from '@/lib/equipment';
import { applyLang, LANGS, type Lang } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';
import { ExerciseCues } from '@/components/ExerciseCues';
import { fresh } from './helpers';

jest.setTimeout(120000);
const NOTE_DB = 'Ćwiczenie z hantlami nad głową lub twarzą: zalecana osoba asekurująca.';
const NOTE_DB_EN = 'Dumbbell exercise with the weights over the head or face: a spotter is recommended.';
const NOTE_BB = 'Ćwiczenie ze sztangą na tułowiu lub nad głową i twarzą: zalecana osoba asekurująca.';
const NOTE_RACK = 'Ćwiczenie ze sztangą na tułowiu lub nad głową i twarzą: zalecana asekuracja — stojaki z ramionami asekuracyjnymi oraz osoba asekurująca.';

/** Objęte Standardem 3.2: hantle przemieszczane nad twarzą (leżąc, na skosie) albo nad głową. */
const SPOT_DB = ['Bench Press (hantle)', 'Incline Bench Press (hantle)', 'Decline Bench Press (hantle)', 'Floor Press (hantle)', 'Close-Grip Dumbbell Press', 'Squeeze Press (hantle)',
  'One Arm Dumbbell Bench Press', 'Chest Fly (hantle)', 'Incline Chest Fly (hantle)', 'Decline Dumbbell Fly', 'One-Arm Flat Bench Dumbbell Fly', 'Pullover (hantel)',
  'Skullcrusher (hantle)', 'Decline Dumbbell Triceps Extension', 'One-Arm Lying Dumbbell Triceps Extension', 'Tate Press', 'Overhead Press (hantle)', 'Seated Shoulder Press (hantle)',
  'Arnold Press', 'Single Arm Overhead Press (hantel)', 'See-Saw Press (Alternating Side Press)', 'Cuban Press', 'Overhead Triceps Extension (hantel)',
  'Dumbbell One-Arm Triceps Extension', 'Dumbbell Front Raise to Overhead', 'Dumbbell Incline Shoulder Raise', 'Around The Worlds'];
/** [OTWARTE] — dynamiczne, hantel przy tułowiu (goblet), biodra, przenoszenie nad głową: źródło (przypis 7) nieprzeczytane. */
const OPEN = ['Snatch (hantel)', 'Dumbbell Clean', 'Thruster (hantle)', 'Dumbbell Seated Box Jump', 'Goblet Squat', 'Hip Thrust (hantel)', 'Overhead Carry (hantle)'];
/** Poza zakresem: hantle w dłoniach poniżej barków (przy bokach, nad kolanami, uginania, wiosłowania, odwodzenia do wysokości barków, wykroki, martwe ciągi). */
const OUT = ['Deadlift (hantle)', 'RDL (hantle/linki)', 'Bent Over Row (hantle)', 'One Arm Row (hantle)', 'Chest Supported Row', 'Shrugs (hantle)', 'Lateral Raise (hantle)', 'Front Raise',
  'Reverse Fly (hantle)', 'Upright Row (hantle)', 'Biceps Curl (hantle)', 'Hammer Curl', 'Incline Curl (hantle)', 'Concentration Curl (hantle)', 'Preacher Curl', 'Spider Curl',
  'Triceps Kickback', 'Bulgarian Split Squat (hantle)', 'Lunges (hantle)', 'Walking Lunges', 'Reverse Lunge', 'Step Up', 'Łydki na stopniu', 'Russian Twist', "Farmer's Walk",
  'Suitcase Carry', 'Svend Press', 'Renegade Row', 'Y Raise (hantle)', 'External Rotation (hantel)', 'Zottman Curl', 'Wrist Curl (hantle)', 'Reverse Wrist Curl (hantle)',
  'Single Leg RDL (hantel)', 'Split Squat', 'Lateral Lunge', 'Curtsy Lunge', 'Sumo Squat (hantel)', 'Leg Curl (hantel)', 'Single Leg Calf Raise', 'Seated Calf Raise (hantle)',
  'Side Bend (hantel)', 'Single Arm RDL (hantel/linka)', 'Middle Back Shrug', 'One-Arm Lateral Raise (hantel)', 'One-Arm Incline Lateral Raise', 'Alternating Deltoid Raise',
  'Front Incline Dumbbell Raise', 'Single Dumbbell Front Raise', 'Dumbbell Scaption', 'Crucifix', 'Dumbbell One-Arm Upright Row', 'Dumbbell Lying One-Arm Rear Lateral Raise',
  'Reverse Flyes With External Rotation', 'Cross Body Hammer Curl', 'Incline Hammer Curl', 'Lying Supine Dumbbell Curl', 'One Arm Dumbbell Preacher Curl', 'Preacher Hammer Dumbbell Curl',
  'Zottman Preacher Curl', 'Standing Inner-Biceps Curl', 'Standing Dumbbell Reverse Curl', 'Standing Concentration Curl', 'Dumbbell Lying Pronation', 'Dumbbell Lying Supination',
  'One-Arm Dumbbell Wrist Curl', 'One-Arm Dumbbell Reverse Wrist Curl', 'Two-Arm Dumbbell Kickback', 'Dumbbell Squat', 'Dumbbell Seated One-Leg Calf Raise', 'Spell Caster'];

const dumbbells = Object.entries(CATALOG).filter(([, c]) => c.loadSource === 'dumbbell').map(([k]) => k);
const SPOT_DB_SET: ReadonlySet<string> = (cat as unknown as { CATALOG_SPOTTER_DB?: ReadonlySet<string> }).CATALOG_SPOTTER_DB ?? new Set();
const SPOT_BB_SET: ReadonlySet<string> = cat.CATALOG_SPOTTER;
afterEach(() => { applyLang('pl'); });

describe('M1-031 cz. 2: zakres reguły dla hantli (NSCA 2017, Standard 3.2, „free weights”)', () => {
  test('każde ćwiczenie katalogu z hantlami ma dokładnie jedną kategorię (strażnik nowych ćwiczeń)', () => {
    const all = [...SPOT_DB, ...OPEN, ...OUT];
    expect(new Set(all).size).toBe(all.length);
    expect([...all].sort()).toEqual([...dumbbells].sort());
  });
  test('CATALOG_SPOTTER_DB = lista (27); tylko hantle; bez rack.safeties; rozłączny z wariantem sztangi', () => {
    expect([...SPOT_DB_SET].sort()).toEqual([...SPOT_DB].sort());
    expect(SPOT_DB).toHaveLength(27);
    for (const k of SPOT_DB) { expect([k, CATALOG[k].loadSource, CATALOG[k].recommended.includes('rack.safeties'), SPOT_BB_SET.has(k)]).toEqual([k, 'dumbbell', false, false]); }
  });
  test('OTWARTE i poza zakresem: bez żadnego wariantu asekuracji', () => {
    for (const k of [...OPEN, ...OUT]) expect([k, SPOT_DB_SET.has(k), SPOT_BB_SET.has(k), CATALOG[k].recommended.includes('rack.safeties')]).toEqual([k, false, false, false]);
  });
  test('ćwiczenia ze sztangą/EZ i kettlebell nie wchodzą do wariantu hantli', () => {
    for (const k of SPOT_DB_SET) expect([k, CATALOG[k].loadSource]).toEqual([k, 'dumbbell']);
    for (const [k, c] of Object.entries(CATALOG)) if (c.loadSource === 'kettlebell') expect([k, SPOT_DB_SET.has(k)]).toEqual([k, false]);
  });
  test('needsSpotterDb: z listy → tak; edytowane wymagania (catalogRev „user”), własne, inny wariant → nie; needsSafety i needsSpotter go nie obejmują', () => {
    expect(needsSpotterDb({ lib: true, libKey: 'Overhead Press (hantle)', catalogRev: cat.CATALOG_REV })).toBe(true);
    expect(needsSpotterDb({ lib: true, libKey: 'Overhead Press (hantle)', catalogRev: 'user' })).toBe(false);
    expect(needsSpotterDb({ lib: false, libKey: undefined })).toBe(false);
    expect(needsSpotterDb({ lib: true, libKey: 'Skullcrusher (EZ)' })).toBe(false);
    for (const k of SPOT_DB) { expect([k, needsSafety(CATALOG[k]), needsSpotter({ lib: true, libKey: k })]).toEqual([k, false, false]); }
  });
});

describe('M1-031 cz. 2: ramka na ekranie ćwiczenia', () => {
  test.each(SPOT_DB)('%s: zdanie o hantlach i osobie asekurującej, bez zdań o sztandze', async key => {
    await fresh(); render(<ExerciseCues exercise={{ lib: true, libKey: key, recommended: CATALOG[key].recommended } as any} />);
    expect(rtlScreen.getByText(NOTE_DB)).toBeTruthy(); expect(rtlScreen.getByText('Asekuracja')).toBeTruthy();
    expect(rtlScreen.queryByText(NOTE_BB)).toBeNull(); expect(rtlScreen.queryByText(NOTE_RACK)).toBeNull();
  });
  test.each(['Snatch (hantel)', 'Goblet Squat', 'Hip Thrust (hantel)', 'Biceps Curl (hantle)', 'Deadlift (hantle)', 'Lateral Raise (hantle)'])('%s: bez ramki', async key => {
    await fresh(); render(<ExerciseCues exercise={{ lib: true, libKey: key, recommended: CATALOG[key].recommended } as any} />);
    expect(rtlScreen.queryByText(NOTE_DB)).toBeNull(); expect(rtlScreen.queryByText('Asekuracja')).toBeNull();
  });
  test('ćwiczenie z edytowanymi wymaganiami (catalogRev „user”) i własne: bez ramki', async () => {
    await fresh(); render(<ExerciseCues exercise={{ lib: true, libKey: 'Arnold Press', recommended: [], catalogRev: 'user' } as any} />);
    expect(rtlScreen.queryByText(NOTE_DB)).toBeNull();
  });
  test('wariant sztangi bez zmian (Skullcrusher EZ → zdanie o sztandze, nie o hantlach)', async () => {
    await fresh(); render(<ExerciseCues exercise={{ lib: true, libKey: 'Skullcrusher (EZ)', recommended: [] } as any} />);
    expect(rtlScreen.getByText(NOTE_BB)).toBeTruthy(); expect(rtlScreen.queryByText(NOTE_DB)).toBeNull();
  });
  test('EN: Arnold Press — angielskie zdanie', async () => {
    await fresh(); applyLang('en'); render(<ExerciseCues exercise={{ lib: true, libKey: 'Arnold Press', recommended: [] } as any} />);
    expect(rtlScreen.getByText(NOTE_DB_EN)).toBeTruthy();
  });
  test('słowniki: nowe zdanie w EN i w każdym z 33 innych języków (es-419, pt-BR dziedziczą), różne od polskiego i angielskiego', () => {
    expect(EN[NOTE_DB]).toBe(NOTE_DB_EN);
    for (const l of LANGS.filter((x): x is Lang => x !== 'pl' && x !== 'en')) { const v = (LOCALES[l] as Record<string, string>)[NOTE_DB]; expect([l, typeof v === 'string' && v !== NOTE_DB && v !== NOTE_DB_EN && v.trim() !== '']).toEqual([l, true]); }
  });
});
