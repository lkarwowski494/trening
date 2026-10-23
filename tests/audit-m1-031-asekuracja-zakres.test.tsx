/*
 * Audyt M1 z 21.10.2026 — M1-audytor-generalny-031 (06-tresci-001): ramka „Asekuracja” była tylko przy 29 ze 137 ćwiczeń ze sztangą/EZ, a NSCA 2017
 * Standard 3.2 (s. 11, odczyt 23.10.2026) obejmuje wolne ciężary „supported on the trunk or moved over the head/face”. Bez ramki były m.in. Overhead Press
 * (sztanga) i Skullcrusher (EZ) z biblioteki podstawowej. Teraz (docs/10, sekcja „Asekuracja”; docs/research/przeglad-badacza-2026-10-23.md):
 *  - wariant „stojaki”: ćwiczenia w miejscu, ze sztangą ze stojaków — `recommended: rack.safeties` (zdanie dotychczasowe + dopisek w miejscu bez ramion);
 *  - wariant „osoba”: ćwiczenia, przy których katalog nie przewiduje stojaków albo ćwiczący odchodzi od nich (leżąc nad twarzą, wykroki w marszu) —
 *    pole katalogu `spot: "spotter"` (CATALOG_SPOTTER), nowe zdanie „zalecana osoba asekurująca”, bez dopisku o stojakach;
 *  - OTWARTE (bez ramki, docs/research/przeglad-badacza-2026-10-23.md): ćwiczenia dynamiczne (podrzut, rwanie, zarzut, push press, wyskoki), sztanga
 *    na biodrach (hip thrust, mostek), hantle nad twarzą.
 * Strażnik: każde ćwiczenie katalogu ze sztangą/EZ ma przypisaną kategorię — nowe ćwiczenie bez decyzji zatrzymuje test.
 * Czerwone na f2b0525 (origin/main): 29 zamiast 43 z rack.safeties, brak CATALOG_SPOTTER, brak ramki przy Overhead Press i Skullcrusher (EZ).
 */
import * as store from '@/lib/store';
import { render, screen as rtlScreen } from '@testing-library/react-native';
import React from 'react';
import * as cat from '@/lib/catalog.generated';
import { CATALOG } from '@/lib/catalog.generated';
import { equipEntry, needsSafety, needsSpotter } from '@/lib/equipment';
import { applyLang, LANGS, type Lang } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';
import { ExerciseCues } from '@/components/ExerciseCues';
import { fresh } from './helpers';
import { loc } from './locations-fixtures';
import { renderApp, flushAll, screen, go, type, act } from './app';

jest.setTimeout(120000);
const NOTE_RACK = 'Ćwiczenie ze sztangą na tułowiu lub nad głową i twarzą: zalecana asekuracja — stojaki z ramionami asekuracyjnymi oraz osoba asekurująca.';
const NOTE_SPOT = 'Ćwiczenie ze sztangą na tułowiu lub nad głową i twarzą: zalecana osoba asekurująca.';
const NOTE_SPOT_EN = 'Barbell exercise with the bar on the trunk or over the head and face: a spotter is recommended.';
const TAG = 'bez asekuracji w stojakach';

/** Objęte Standardem 3.2, wariant „stojaki” (29 dotychczasowych + 14 dodanych 23.10.2026). */
const RACK_OLD = ['Bench Press (sztanga)', 'Incline Bench Press (sztanga)', 'Decline Bench Press', 'Good Morning', 'Close Grip Bench Press', 'Back Squat', 'Front Squat', 'Box Squat',
  'Floor Press (sztanga)', 'JM Press', 'Zercher Squat', 'Lunges (sztanga)', 'Barbell Guillotine Bench Press', 'Wide-Grip Barbell Bench Press', 'Seated Good Mornings',
  'Bench Press with Chains', 'Floor Press with Chains', 'Reverse Band Bench Press', 'Board Press', 'Close-Grip EZ-Bar Press', 'Reverse Grip Bench Press',
  'Decline Close-Grip Bench To Skull Crusher', 'Box Squat with Bands', 'Box Squat with Chains', 'Reverse Band Box Squat', 'Reverse Band Power Squat', 'Squat with Bands',
  'Squat with Chains', 'Jerk Dip Squat'];
const RACK_NEW = ['Overhead Press (sztanga)', 'Seated Barbell Military Press', 'Standing Barbell Press Behind Neck', 'Bradford Press', 'Overhead Squat', 'Calf Raise (sztanga)',
  'Kneeling Squat', 'Barbell Side Split Squat', 'Bulgarian Split Squat (sztanga)', 'Elevated Back Lunge', 'Barbell Side Bend', 'Barbell Incline Shoulder Raise',
  'Good Morning off Pins', 'Pin Press'];
/** Objęte Standardem 3.2, wariant „osoba asekurująca”. */
const SPOT = ['Skullcrusher (EZ)', 'Skullcrusher (sztanga)', 'Overhead Triceps Extension (EZ)', 'Standing Overhead Barbell Triceps Extension', 'Barbell Front Raise to Overhead',
  'Front Raise And Pullover', 'Wide-Grip Decline Barbell Pullover', 'Bent-Arm Barbell Pullover', 'Decline EZ Bar Triceps Extension', 'Incline Barbell Triceps Extension',
  'Lying Close-Grip Barbell Triceps Extension Behind The Head', 'Press Sit-Up', 'Barbell Walking Lunge', 'Barbell Step Up', 'Seated Barbell Twist'];
/** [OTWARTE] — Standard 3.2 dosłownie je obejmuje, ale sposób asekuracji (ćwiczenia dynamiczne) albo zakres słowa „trunk” (biodra) wymaga źródła, którego dziś nie przeczytano. */
const OPEN = ['Push Press', 'Push Press - Behind the Neck', 'Power Jerk', 'Split Jerk', 'Squat Jerk', 'Jerk Balance', 'Snatch Balance', 'Clean and Press', 'Clean and Jerk',
  'Clean', 'Power Clean', 'Hang Clean', 'Split Clean', 'Block Clean', 'Block Power Clean', 'Barbell Snatch', 'Power Snatch', 'Hang Snatch', 'Split Snatch', 'Muscle Snatch',
  'Block Snatch', 'Block Power Snatch', 'Rack Delivery', 'Weighted Jump Squat', 'Kneeling Jump Squat', 'Hip Thrust (sztanga)', 'Glute Bridge (sztanga)'];
/** Poza zakresem: sztanga w dłoniach poniżej barków (martwe ciągi, wiosłowania, uginania, szrugsy), koniec sztangi w landminie, sztanga na kolanach. */
const OUT = ['Deadlift (sztanga)', 'Sumo Deadlift', 'RDL (sztanga)', 'Bent Over Row (sztanga)', 'Pendlay Row', 'T-Bar Row', 'Shrugs (sztanga)', 'Barbell Curl', 'EZ Bar Curl',
  'Meadows Row', 'Seal Row (sztanga)', 'Rack Pull', 'Landmine Press', 'Upright Row (sztanga)', 'Preacher Curl (EZ)', 'Reverse Curl', 'Landmine Squat', 'Landmine Rotation',
  'Axle Deadlift', 'Barbell Shrug Behind The Back', 'Clean Shrug', 'Snatch Shrug', 'Deadlift with Bands', 'Deadlift with Chains', 'Deficit Deadlift', 'Rack Pull with Bands',
  'Reverse Band Deadlift', 'Reverse Grip Bent Over Row', 'Landmine Linear Jammer', 'Single-Arm Linear Jammer', 'Straight Raises on Incline Bench', 'Barbell Rear Delt Row',
  'Spider Curl (sztanga)', 'Drag Curl', 'Barbell Preacher Curl', 'Reverse EZ-Bar Preacher Curl', 'Seated Close-Grip Concentration Barbell Curl', 'Barbell Wrist Curl',
  'Barbell Reverse Wrist Curl', 'Behind-the-Back Barbell Wrist Curl', 'Jefferson Squat', 'Barbell Hack Squat', 'One-Arm Side Deadlift', 'Clean Pull', 'Barbell Seated Calf Raise',
  'Clean Deadlift', 'Reverse Band Sumo Deadlift', 'Snatch Deadlift', 'Snatch Pull', 'Stiff-Legged Barbell Deadlift', 'Sumo Deadlift with Bands', 'Sumo Deadlift with Chains'];

const barbell = Object.entries(CATALOG).filter(([, c]) => c.loadSource === 'barbell' || c.loadSource === 'ez_bar').map(([k]) => k);
const SPOTTER: ReadonlySet<string> = (cat as unknown as { CATALOG_SPOTTER?: ReadonlySet<string> }).CATALOG_SPOTTER ?? new Set();
afterEach(() => { applyLang('pl'); });

describe('M1-031: zakres reguły (NSCA 2017, Standard 3.2)', () => {
  test('każde ćwiczenie katalogu ze sztangą/EZ ma dokładnie jedną kategorię (strażnik nowych ćwiczeń)', () => {
    const all = [...RACK_OLD, ...RACK_NEW, ...SPOT, ...OPEN, ...OUT];
    expect(new Set(all).size).toBe(all.length);
    expect([...all].sort()).toEqual([...barbell].sort());
  });
  test('wariant „stojaki”: dokładnie 43 ćwiczenia z rack.safeties w zaleceniach', () => {
    const rack = Object.entries(CATALOG).filter(([, c]) => c.recommended.includes('rack.safeties')).map(([k]) => k).sort();
    expect(rack).toEqual([...RACK_OLD, ...RACK_NEW].sort());
  });
  test('wariant „osoba”: CATALOG_SPOTTER = lista; bez rack.safeties; tylko sztanga/EZ', () => {
    expect([...SPOTTER].sort()).toEqual([...SPOT].sort());
    for (const k of SPOT) { expect([k, CATALOG[k].recommended.includes('rack.safeties')]).toEqual([k, false]); expect(['barbell', 'ez_bar']).toContain(CATALOG[k].loadSource); }
  });
  test('OTWARTE i poza zakresem: bez żadnego wariantu', () => {
    for (const k of [...OPEN, ...OUT]) expect([k, CATALOG[k].recommended.includes('rack.safeties'), SPOTTER.has(k)]).toEqual([k, false, false]);
  });
  test('needsSpotter: ćwiczenie z biblioteki z listy → tak; edytowane wymagania (catalogRev „user”), własne, z listy „stojaki” → nie', () => {
    expect(needsSpotter({ lib: true, libKey: 'Skullcrusher (EZ)', catalogRev: cat.CATALOG_REV })).toBe(true);
    expect(needsSpotter({ lib: true, libKey: 'Skullcrusher (EZ)', catalogRev: 'user' })).toBe(false);
    expect(needsSpotter({ lib: false, libKey: undefined })).toBe(false);
    expect(needsSpotter({ lib: true, libKey: 'Bench Press (sztanga)' })).toBe(false);
  });
});

describe('M1-031: ramka na ekranie ćwiczenia', () => {
  test.each(RACK_NEW)('%s: zdanie „stojaki … oraz osoba asekurująca”', async key => {
    await fresh(); render(<ExerciseCues exercise={{ lib: true, libKey: key, recommended: CATALOG[key].recommended } as any} />);
    expect(rtlScreen.getByText(NOTE_RACK)).toBeTruthy(); expect(rtlScreen.queryByText(NOTE_SPOT)).toBeNull();
  });
  test.each(SPOT)('%s: zdanie „zalecana osoba asekurująca”, bez stojaków', async key => {
    await fresh(); render(<ExerciseCues exercise={{ lib: true, libKey: key, recommended: CATALOG[key].recommended } as any} />);
    expect(rtlScreen.getByText(NOTE_SPOT)).toBeTruthy(); expect(rtlScreen.getByText('Asekuracja')).toBeTruthy(); expect(rtlScreen.queryByText(NOTE_RACK)).toBeNull();
  });
  test.each(['Push Press', 'Hip Thrust (sztanga)', 'Deadlift (sztanga)', 'Bench Press (hantle)'])('%s: bez ramki', async key => {
    await fresh(); render(<ExerciseCues exercise={{ lib: true, libKey: key, recommended: CATALOG[key].recommended } as any} />);
    expect(rtlScreen.queryByText(NOTE_RACK)).toBeNull(); expect(rtlScreen.queryByText(NOTE_SPOT)).toBeNull();
  });
  test('EN: Skullcrusher (EZ) — angielskie zdanie', async () => {
    await fresh(); applyLang('en'); render(<ExerciseCues exercise={{ lib: true, libKey: 'Skullcrusher (EZ)', recommended: [] } as any} />);
    expect(rtlScreen.getByText(NOTE_SPOT_EN)).toBeTruthy();
  });
  test('słowniki: nowe zdanie w EN i w każdym z 33 innych języków (es-419, pt-BR dziedziczą)', () => {
    expect(EN[NOTE_SPOT]).toBe(NOTE_SPOT_EN);
    for (const l of LANGS.filter((x): x is Lang => x !== 'pl' && x !== 'en')) { const v = (LOCALES[l] as Record<string, string>)[NOTE_SPOT]; expect([l, typeof v === 'string' && v !== NOTE_SPOT && v !== NOTE_SPOT_EN]).toEqual([l, true]); }
  });
});

describe('M1-031: wybór ćwiczenia w miejscu bez ramion asekuracyjnych', () => {
  const noSafe = () => loc('Bez ramion', [equipEntry('barbell'), equipEntry('ez_bar'), equipEntry('bench_flat'), equipEntry('squat_stands')], 'nosafe31');
  const pick = async (q: string) => {
    await fresh(); const s = store.getState().settings; const l = noSafe(); s.locations.push(l); s.mainLocationId = l.id; await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await act(async () => { store.startEmpty(); }); await go('/picker?target=active'); await flushAll(10);
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), q); await flushAll(5);
  };
  test('Overhead Press (sztanga): dopisek „bez asekuracji w stojakach”', async () => {
    await pick('Overhead Press (sztanga)'); expect(screen.getAllByText(new RegExp(`${TAG}$`)).length).toBeGreaterThan(0);
  });
  test('Skullcrusher (EZ): bez dopisku o stojakach (wariant „osoba”)', async () => {
    await pick('Skullcrusher (EZ)'); expect(screen.queryByText(new RegExp(TAG))).toBeNull();
  });
  test('needsSafety (wariant „stojaki”) nie obejmuje wariantu „osoba”', () => {
    for (const k of SPOT) expect([k, needsSafety(CATALOG[k])]).toEqual([k, false]);
  });
});
