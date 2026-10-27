/*
 * Figury v2 — sprzęt w kontrakcie danych (docs/54): rejestr rodzajów (GEAR_KINDS), rekwizyty ze sprzętu i chwytów (propsFrom), kierunek dzwonu kettlebell (resolveBells),
 * rysunek w trzech widokach i czterech motywach, kolidery (talerz = obręcz + szprychy, piłka, dzwon), kontrola chwytu na obręczy i powierzchni, walidator pozy z nowym
 * sprzętem (macierz: rodzaj × wariant), komunikaty dla generatora. Rodzaje (docs/20): logika, ekran-rysunek, scenariusze, macierz, niezmienniki, dane, motywy.
 */
import {
  GEAR, GEAR_KINDS, BENCH_KAT, BAND_MOUNT, SLED_HOLD, LEVER_MODE, LEVER_POINT, benchHip, SOFT_CONTACT, GEAR_CAPS, GEAR_EXTRA_FIELDS, BELL_MODES, CABLE_ATTACH, gearFieldIssues, gearSetIssues, contactsFrom, WALL_CONTACT, TOL, CABLE_Y, requiredGearIssues, propsFrom, resolveBells, plateColliders, distToRingYZ, HOLD,
  CONTRACT, EQUIP, BENCH, hyperPolys, preacherPolys, templateFor, exampleFor, figureSpec, frameAt, rollerAt, poseSchema, describeContract, gearText, hasOwnTemplate, EXT_FIELDS, figurePalette, propShapes, boundsOf, svgDocument, equipColliders, bodyColliders, gap, checkFrame, holdChecks, keyframeFrame, validatePose, dataShapes, solveSkeleton,
  type Gear, type KeyFrame, type PoseData, type Prop, type V3, type RomData, type Frame, type View,
} from '@/lib/figures/v2';
import { FIG_DATA } from '@/lib/figures';
import { light, dark, lightHC, darkHC } from '@/lib/theme';

const ROM = FIG_DATA.rom as unknown as RomData;
const kf = (u: number, gr: V3, gl: V3): KeyFrame => ({ u, miednica: [0, 88.5, 0], pochylenieTulowia: 0, pochylenieGlowy: 0, nogi: { R: { kostka: [0, 7, 9] }, L: { kostka: [0, 7, -9] } }, rece: { R: { chwyt: gr }, L: { chwyt: gl } } });
const pose = (rodzina: string, cwiczenie: string, sprzet: Gear[], klatki: KeyFrame[]): PoseData => ({ kontrakt: CONTRACT.id, rodzina, cwiczenie, sprzet: [{ rodzaj: 'podloga', x0: -120, x1: 120 }, ...sprzet], klatki, bledy: [] });
const check = (d: PoseData) => validatePose(JSON.parse(JSON.stringify(d)), { family: d.rodzina, exercise: d.cwiczenie, errorCues: [], rom: ROM });
const texts = (d: PoseData): string => check(d).map(i => `[${i.kod}] ${i.szczegol}`).join(' | ');
const sym = (x: number, y: number, z: number): [V3, V3] => [[x, y, z], [x, y, -z]];
const two = (u: number, a: V3, b: V3): KeyFrame => kf(u, a, b);

/** Pozy poprawne per rodzaj sprzętu i wariant (tułów pionowo, dłonie w zasięgu ramienia z zapasem, bez przenikania). */
const CURL = (sp: Gear): PoseData => pose('curl', 'Curl', [sp], [two(0, ...sym(0, 76, 27)), two(1, ...sym(20, 125, 21))]);
const GOBLET = (sp: Gear): PoseData => pose('squat', 'Goblet', [sp], [two(0, ...sym(17, 125, 4)), two(1, ...sym(24, 112, 4))]);
const SWING = (sp: Gear): PoseData => pose('squat', 'KB swing', [sp], [two(0, ...sym(18, 82, 3)), two(1, ...sym(50, 128, 3))]);
const PLATE = (sp: Gear): PoseData => pose('delt_raise', 'Front Plate Raise', [sp], [two(0, ...sym(20, 100, 20.5)), two(1, ...sym(30, 135, 20.5))]);
const BALL = (sp: Gear): PoseData => pose('sled_throw', 'Chest Pass', [sp], [two(0, ...sym(25, 120, 11)), two(1, ...sym(45, 125, 11))]);
const RACKPULL = (sp: Gear[]): PoseData => pose('hinge', 'Rack Pull', [{ rodzaj: 'sztanga', podazaZaChwytem: true, trzyma: 'obie' }, ...sp], [two(0, ...sym(15, 90, 25)), two(1, ...sym(15, 78, 25))]);
const SMITH = (sp: Gear[], bx = 15): PoseData => pose('hinge', 'Smith Machine Stiff-Legged Deadlift', [{ rodzaj: 'sztanga', podazaZaChwytem: true, trzyma: 'obie', talerze: true }, ...sp], [two(0, ...sym(bx, 90, 25)), two(1, ...sym(bx, 78, 25))]);
const arcY = (px: number, gx: number, L = EQUIP.landmineLen): number => Math.round((5 + Math.sqrt(L * L - (gx - px) ** 2)) * 100) / 100;
const LANDMINE = (sp: Gear, px = 178, gxs = [22, 34, 46]): PoseData => pose('overhead_press', 'Landmine Press', [sp], gxs.map((gx, i) => two(i / (gxs.length - 1), [gx, arcY(px, gx), 4], [gx, arcY(px, gx), -4])));
const WALLPOSE = (sp: Gear, g0: V3 = [0, 76, 27], g1: V3 = [30, 125, 22]): PoseData => pose('mobility_stand', 'Wall Slide', [sp], [two(0, g0, [g0[0], g0[1], -g0[2]]), two(1, g1, [g1[0], g1[1], -g1[2]])]);
const TRAP = (sp: Gear = { rodzaj: 'gryf_szesciokatny' }): PoseData => pose('hinge', 'Trap Bar Deadlift', [sp], [two(0, [0, 78, 29], [0, 78, -29]), { ...two(1, [10, 74, 29], [10, 74, -29]), miednica: [0, 86, 0] }]);
const PUSHDOWN = (sp: Gear): PoseData => pose('triceps', 'Triceps Pushdown', [sp], [two(0, ...sym(20, 125, 8)), two(1, ...sym(18, 95, 8))]);
const CABLECURL = (sp: Gear): PoseData => pose('curl', 'Cable Curl', [sp], [two(0, ...sym(18, 80, 20)), two(1, ...sym(25, 125, 20))]);
const FLY = (sp: Gear): PoseData => pose('chest_fly', 'Cable Fly', [sp], [two(0, ...sym(5, 130, 55)), two(1, ...sym(35, 120, 8))]);
const STRAP = (sp: Gear): PoseData => pose('glute_floor', 'Cable Reverse Crunch', [sp], [two(0, ...sym(0, 76, 27)), { ...two(1, ...sym(0, 76, 27)), nogi: { R: { kostka: [25, 40, 9] }, L: { kostka: [0, 7, -9] } } }]);
const EXAMPLE = (key: string, walki = false): PoseData => { const d = exampleFor(key)!; if (walki) d.sprzet = d.sprzet.map(g => g.rodzaj === 'lawka' ? { ...g, walki: true } : g); return d; };
const BANDLAT = (sp: Gear[]): PoseData => pose('delt_raise', 'Band Lateral Raise', sp, [two(0, ...sym(0, 76, 27)), two(1, ...sym(5, 125, 52))]);
const ROTATE = (sp: Gear[]): PoseData => pose('mobility_stand', 'Torso Rotation', sp, [two(0, ...sym(0, 76, 27)), two(1, ...sym(30, 125, 22))]);
const MACHINE_CAPS = ['leg_ext', 'leg_curl', 'leg_press', 'hack_squat', 'pendulum_squat', 'belt_squat_machine', 'chest_press_machine', 'shoulder_press_machine', 'pec_deck', 'row_machine', 'pullover_machine', 'ab_crunch_machine', 'biceps_curl_machine', 'triceps_ext_machine', 'lateral_raise_machine', 'glute_kickback_machine', 'hip_thrust_machine', 'hip_abductor_adductor', 'calf_machine', 'lever_machine', 'dip_machine', 't_bar'];
/** Prostowanie nóg siedząc: oparcie 75°, siedzisko 45 cm wysoko i 40 cm długie; dźwignia obraca się wokół kolana (oś przesunięta na bok o 36 cm), kostka R jest jej punktem mocowania; długość ramienia z modelu. */
const LEGEXT = (over: Partial<Gear> = {}): PoseData => {
  const th = 75, top = 45; const pel = benchHip(th, top); const base = (u: number, a: number, k: V3): KeyFrame => { const ank: V3 = [k[0] + 41 * Math.sin(a * Math.PI / 180), k[1] - 41 * Math.cos(a * Math.PI / 180), 12]; return { u, miednica: pel, pochylenieTulowia: th - 90, pochylenieGlowy: th - 90, nogi: { R: { kostka: ank }, L: { kostka: [ank[0], ank[1], -12] } }, rece: { R: { chwyt: [pel[0] + 10, pel[1] + 5, 22] }, L: { chwyt: [pel[0] + 10, pel[1] + 5, -22] } } }; };
  const probe = pose('leg_isolation', 'Leg Extension', [{ rodzaj: 'lawka', x: 0, top, kat: th, siedzisko: 40 }], [base(0, 0, [50, 54, 0]), base(1, 0, [50, 54, 0])]);
  const knee = keyframeFrame(probe, 0).sk.legs.R.knee; const kn: V3 = [knee[0], knee[1], 0]; const A = [base(0, 0, kn), base(0.5, 30, kn), base(1, 60, kn)];
  const L = Math.round(Math.hypot(...A[0].nogi.R.kostka.map((x, i) => x - [knee[0], knee[1], 36][i])) * 10) / 10;
  return pose('leg_isolation', 'Leg Extension', [{ rodzaj: 'lawka', x: 0, top, kat: th, siedzisko: 40 }, { rodzaj: 'dzwignia', x: knee[0], y: knee[1], z: 36, punkt: 'kostki', trzyma: 'R', dlugosc: L, ...over }], A);
};
/** Wyciskanie na prowadnicy stojąc: dłonie jadą w górę po prowadnicy x = 20 (y = 100…140); punkt mocowania = środek między dłońmi. */
const SLIDE = (over: Partial<Gear> = {}, dx = 0): PoseData => pose('overhead_press', 'Machine Shoulder Press', [{ rodzaj: 'dzwignia', x: 20, y: 100, z: 0, tryb: 'prosta', kat: 90, dlugosc: 40, punkt: 'dlonie', trzyma: 'obie', ...over }], [two(0, ...sym(20 + dx, 100, 22)), two(1, ...sym(20 + dx, 140, 22))]);
const SLEDPUSH = (over: Partial<Gear> = {}): PoseData => pose('sled_throw', 'Sled Push', [{ rodzaj: 'sanie', x: 30, h: 100, ...over }], [two(0, [30, 85, 25], [30, 85, -25]), two(1, [30, 98, 25], [30, 98, -25])]);
const SLEDROPE = (): PoseData => pose('cable_row', 'Sled Row', [{ rodzaj: 'sanie', x: 80, trzymanie: 'lina' }], [two(0, ...sym(30, 90, 10)), two(1, ...sym(15, 105, 10))]);
const ROPE = (over: Partial<Gear> = {}, z = 2): PoseData => pose('pull_up', 'Rope Climb', [{ rodzaj: 'lina_pionowa', x: 20, ...over }], [two(0, [20, 150, z], [20, 150, -z]), two(1, [20, 130, z], [20, 130, -z])]);
const SUSP = (over: Partial<Gear> = {}): PoseData => pose('row', 'Suspension Row', [{ rodzaj: 'zawieszenie', x: 70, y: 230, ...over }], [two(0, ...sym(35, 110, 15)), two(1, ...sym(15, 120, 15))]);
const DIP = (over: Partial<Gear> = {}, gz = 22): PoseData => { const k = (u: number, py: number, ay: number): KeyFrame => ({ ...two(u, [0, 115, gz], [0, 115, -gz]), miednica: [0, py, 0], pochylenieTulowia: 10, nogi: { R: { kostka: [-15, ay, 9], podbicie: -30 }, L: { kostka: [-15, ay, -9], podbicie: -30 } } }); return pose('dip', 'Triceps Dip', [{ rodzaj: 'poreczy', ...over }], [k(0, 125, 70), k(1, 100, 50)]); };
const BENTNECK = (): PoseData => { const b = (u: number, hx: number): KeyFrame => ({ u, miednica: [0, 88, 0], pochylenieTulowia: 90, pochylenieGlowy: 60, nogi: { R: { kostka: [0, 7, 9] }, L: { kostka: [0, 7, -9] } }, rece: { R: { chwyt: [hx, 50, 22] }, L: { chwyt: [hx, 50, -22] } } }); return pose('neck', 'Neck Harness Extension', [{ rodzaj: 'uprzaz_szyja', dlugosc: 15, promien: 10 }], [b(0, 30), b(1, 38)]); };
const MATRIX: [string, PoseData][] = [
  ['platforma balansowa obok osoby', ROTATE([{ rodzaj: 'bosu', x: 70 }])], ['ławka do prostowania tułowia obok osoby', ROTATE([{ rodzaj: 'rzymska', x: 90 }])], ['opona obok osoby', ROTATE([{ rodzaj: 'opona', x: 90 }])],
  ['wałek na nadgarstki: drążek w dłoniach z liną i talerzem', pose('forearm', 'Wrist Roller', [{ rodzaj: 'walek_nadgarstkow' }], [two(0, ...sym(30, 125, 10)), two(1, ...sym(30, 110, 10))])], ['kłoda w dłoniach', pose('strongman', 'Log Lift', [{ rodzaj: 'kloda' }], [two(0, ...sym(30, 110, 12)), two(1, ...sym(30, 125, 12))])],
  ['młot w obu dłoniach', pose('sled_throw', 'Sledgehammer Swings', [{ rodzaj: 'mlot' }], [two(0, [25, 85, 5], [28, 115, 5]), two(1, [20, 95, 5], [23, 125, 5])])], ['sanie ciągnięte za pas', pose('sled_throw', 'Sled Drag (Harness)', [{ rodzaj: 'sanie', x: 120, trzymanie: 'pas' }, { rodzaj: 'pas' }], [two(0, ...sym(30, 100, 20)), two(1, ...sym(20, 110, 20))])], ['uprząż na szyję (pochylony tułów)', BENTNECK()],
  ['ślizgacze pod kostkami (domyślnie)', ROTATE([{ rodzaj: 'slizgacze' }])], ['ślizgacze pod dłońmi jedna strona', ROTATE([{ rodzaj: 'slizgacze', punkt: 'dlonie', trzyma: 'R' }])],
  ['sanie: dłonie na słupkach (pchanie)', SLEDPUSH()], ['sanie: lina do dłoni (wiosłowanie)', SLEDROPE()], ['lina pionowa: obie dłonie na linie', ROPE()], ['taśmy do podwieszania: dwie taśmy do dłoni', SUSP()], ['poręcze do dipów: dłonie na poręczach', DIP()],
  ['modlitewnik przed osobą (bez kontaktu)', ROTATE([{ rodzaj: 'modlitewnik', x: 95, top: 100, kat: 60, dlugosc: 45, y: 48 }])], ['modlitewnik: wartości domyślne', ROTATE([{ rodzaj: 'modlitewnik', x: 95 }])],
  ['maszyna: siedzisko + dźwignia obrotowa na kostkach (prostowanie nóg)', LEGEXT()], ['maszyna: prowadnica liniowa na dłoniach (wyciskanie)', SLIDE()],
  ['piłka gimnastyczna obok osoby (domyślny promień)', ROTATE([{ rodzaj: 'pilka_gimnastyczna', x: 70 }])], ['piłka gimnastyczna 55 cm', ROTATE([{ rodzaj: 'pilka_gimnastyczna', x: 60, promien: 27.5 }])], ['wałek piankowy obok osoby', ROTATE([{ rodzaj: 'rolka', x: 40 }])], ['wałek: promień i długość', ROTATE([{ rodzaj: 'rolka', x: 40, z: 0, promien: 6, dlugosc: 60 }])],
  ['guma pod stopami (wznosy bokiem)', BANDLAT([{ rodzaj: 'guma', mocowanie: 'stopy' }])], ['guma w stałym zaczepie (kolumna za osobą)', BANDLAT([{ rodzaj: 'guma', mocowanie: 'zaczep', x: -60, y: 110 }])], ['guma w pętli między kostkami', BANDLAT([{ rodzaj: 'guma', mocowanie: 'kostki' }])],
  ['guma między dłońmi (rozciąganie)', BANDLAT([{ rodzaj: 'guma', mocowanie: 'dlonie' }])], ['guma od sztangi do podłogi', RACKPULL([{ rodzaj: 'guma', mocowanie: 'sztanga' }])], ['guma odwrócona: od sztangi do wysokiego punktu', RACKPULL([{ rodzaj: 'guma', mocowanie: 'sztanga', y: 200 }])],
  ['ławka płaska: wyciskanie leżąc (przykład z rigu)', EXAMPLE('Bench Press (sztanga)')], ['ławka skośna: wyciskanie na skosie (przykład z rigu)', EXAMPLE('Incline Bench Press (sztanga)')], ['ławka ujemna: wyciskanie na ławce ujemnej', EXAMPLE('Decline Bench Press')], ['ławka ujemna z wałkami na nogi', EXAMPLE('Decline Bench Press', true)],
  ['wyciąg wysoki z liną (pushdown)', PUSHDOWN({ rodzaj: 'wyciag', x: 45, y: 220, chwyt: 'lina' })], ['wyciąg wysoki z uchwytem', PUSHDOWN({ rodzaj: 'wyciag', x: 45, y: 220 })], ['wyciąg niski z drążkiem (curl)', CABLECURL({ rodzaj: 'wyciag', x: 60, y: 20, chwyt: 'drazek' })],
  ['dwa wyciągi (rozpiętki)', FLY({ rodzaj: 'wyciag', x: -10, y: 130, dwa: true, z: 80 })], ['opaska na kostkę (jedna noga)', STRAP({ rodzaj: 'wyciag', x: 60, y: 20, chwyt: 'kostka', trzyma: 'R' })],
  ['łańcuchy na sztandze (martwy ciąg z łańcuchami)', RACKPULL([{ rodzaj: 'lancuchy' }])], ['łańcuchy w dłoniach (bez sztangi)', pose('triceps', 'Chain Handle Extension', [{ rodzaj: 'lancuchy' }], [two(0, ...sym(0, 76, 27)), two(1, ...sym(20, 125, 21))])],
  ['ściana za osobą (bez kontaktu)', WALLPOSE({ rodzaj: 'sciana', x: -20 })], ['ściana przed osobą, dłonie na ścianie', pose('mobility_stand', 'Wall Lat Stretch', [{ rodzaj: 'sciana', x: 40, przed: true }], [two(0, ...sym(36.7, 100, 22)), two(1, ...sym(36.7, 140, 22))])],
  ['gryf sześciokątny: dłonie na uchwytach z = ±29', TRAP()], ['uchwyty farmerskie jako hantle z dużym promieniem', pose('carry', 'Farmer', [{ rodzaj: 'hantel', promien: 12 }], [two(0, ...sym(0, 77, 30)), two(1, ...sym(20, 125, 22))])],
  ['landmine: dłonie na sferze o promieniu gryfu wokół osi obrotu', LANDMINE({ rodzaj: 'landmine', x: 178 })],
  ['smith: sztanga na osi prowadnicy w każdej klatce', SMITH([{ rodzaj: 'smith', x: 15, h: 200 }])],
  ['stojak: słupek z hakiem za osobą przy sztandze', RACKPULL([{ rodzaj: 'slupek', x: -45, h: 200, hak: 70 }])], ['stojak bez haka (asekuracja)', RACKPULL([{ rodzaj: 'slupek', x: -45, h: 100 }])],
  ['hantel obie (dwa hantle)', CURL({ rodzaj: 'hantel' })], ['hantel jedna ręka R', CURL({ rodzaj: 'hantel', trzyma: 'R' })], ['hantel jedna ręka L', CURL({ rodzaj: 'hantel', trzyma: 'L' })],
  ['hantel pionowo (goblet)', GOBLET({ rodzaj: 'hantel', pionowo: true })], ['hantel z promieniem', CURL({ rodzaj: 'hantel', promien: 5 })],
  ['kettlebell dzwon w dół (domyślny)', SWING({ rodzaj: 'kettlebell' })], ['kettlebell wzdłuż przedramienia', SWING({ rodzaj: 'kettlebell', dzwon: 'wzdluz' })], ['kettlebell dzwon za rączką (rack)', pose('squat', 'KB rack', [{ rodzaj: 'kettlebell', dzwon: 'tyl' }], [two(0, ...sym(32, 115, 3)), two(1, ...sym(32, 135, 3))])],
  ['talerz obiema dłońmi', PLATE({ rodzaj: 'talerz' })], ['talerz mniejszy', pose('delt_raise', 'Front Plate Raise', [{ rodzaj: 'talerz', promien: 15 }], [two(0, ...sym(20, 100, 13.5)), two(1, ...sym(30, 135, 13.5))])],
  ['piłka lekarska obiema dłońmi', BALL({ rodzaj: 'pilka_lekarska' })],
];

describe('rejestr rodzajów sprzętu (gear.ts)', () => {
  test('GEAR: osiem rodzajów; każdy ma wpis w rejestrze z opisem i rekwizytem; możliwości katalogu pokryte przez rejestr', () => {
    expect(GEAR).toEqual(['sztanga', 'slupek', 'podloga', 'skrzynia', 'hantel', 'kettlebell', 'talerz', 'pilka_lekarska', 'smith', 'landmine', 'sciana', 'gryf_szesciokatny', 'lancuchy', 'wyciag', 'lawka', 'guma', 'pilka_gimnastyczna', 'rolka', 'dzwignia', 'modlitewnik', 'zawieszenie', 'lina_pionowa', 'sanie', 'poreczy', 'slizgacze', 'kolko', 'bosu', 'pas', 'walek_nadgarstkow', 'rzymska', 'kloda', 'opona', 'mlot', 'uprzaz_szyja']);
    for (const k of GEAR) { expect(GEAR_KINDS[k].opis.length).toBeGreaterThan(10); expect(typeof GEAR_KINDS[k].props).toBe('function'); }
    expect(GEAR_CAPS).toEqual(expect.arrayContaining(['pullup.bar', 'rings', 'barbell', 'ez_bar', 'axle_bar', 'box', 'bench.flat', 'db', 'kb', 'plate', 'med_ball', 'rack', 'bench.uprights', 'rack.safeties', 'smith', 'landmine', 'wall', 'trap_bar', 'farmers_handles', 'chains', 'cable.high', 'cable.mid', 'cable.low', 'cable.dual', 'cable.row_seat', 'lat_pulldown', 'ankle_strap', 'cable.handles', 'cable.rope', 'bench.flat', 'bench.incline', 'bench.decline', 'bands', 'stability_ball', 'foam_roller', 'preacher_bench', 'suspension', 'climbing_rope', 'sled', 'dip.bars', 'atlas_stones', 'keg', 'sandbag', 'sliders', 'ab_wheel', 'bosu', 'dip_belt', 'wrist_roller', 'hyperext_bench', 'ghd', 'glute_ham_raise', 'reverse_hyper', 'log_bar', 'tire', 'sledgehammer', 'neck_harness', 'rickshaw', 'yoke', ...MACHINE_CAPS]));
    expect(GEAR_CAPS.filter((c, i) => GEAR_CAPS.indexOf(c) !== i)).toEqual(['plate']); /* jedyna możliwość z dwoma rodzajami: talerz w dłoni albo wiszący na pasie */
    expect(GEAR_EXTRA_FIELDS).toEqual(['promien', 'pionowo', 'dzwon', 'przesuniecie', 'hak', 'z', 'przed', 'dwa', 'chwyt', 'kat', 'walki', 'mocowanie', 'tryb', 'punkt', 'siedzisko', 'trzymanie']); expect(BELL_MODES).toEqual(['dol', 'wzdluz', 'tyl', 'gora', 'wzdluz_gora']);
  });
  test('punkty odniesienia (ref) mają liczby z EQUIP i nazwy pól; rodzaje bez ref (stare) nie mają go', () => {
    for (const k of ['hantel', 'kettlebell', 'talerz', 'pilka_lekarska'] as const) { const r = GEAR_KINDS[k].ref?.().join(' ') ?? ''; expect(r).toContain(k === 'pilka_lekarska' ? 'pilka_lekarska' : k); expect(r).toMatch(/\d/); }
    expect(GEAR_KINDS.talerz.ref?.().join(' ')).toContain(String(EQUIP.plateR).replace('.', ',')); expect(GEAR_KINDS.pilka_lekarska.ref?.().join(' ')).toContain(String(EQUIP.medBallR));
    expect(GEAR_KINDS.kettlebell.ref?.().join(' ')).toMatch(/dzwon "dol".*"wzdluz".*"tyl"/);
    /* zgodność polecenie ↔ walidator: każde pole rodzaju jest opisane w jego punktach odniesienia, a opis nie wspomina pól cudzych rodzajów */
    for (const k of GEAR) { const own = GEAR_KINDS[k].fields ?? []; const ref = GEAR_KINDS[k].ref?.().join(' ') ?? ''; if (!ref) continue; for (const f of own) expect([k, f, ref.includes(f)]).toEqual([k, f, true]); for (const f of (['promien', 'pionowo', 'dzwon', 'przesuniecie', 'hak'] as const).filter(x => !own.includes(x))) expect([k, f, ref.includes(`${f} `) || ref.includes(`${f}:`)]).toEqual([k, f, false]); }
  });
});

describe('propsFrom: rekwizyty ze sprzętu i chwytów (sprzęt trzymany podąża za dłonią)', () => {
  const G = { R: [10, 80, 20] as V3, L: [14, 90, -20] as V3 };
  test('hantel: obie = dwa hantle w dłoniach; R/L = jeden; pionowo = jeden między dłońmi; promień przekazany', () => {
    expect(propsFrom([{ rodzaj: 'hantel' }], G)).toEqual([{ k: 'dumbbell', c: G.R, side: 'R', r: undefined, held: true }, { k: 'dumbbell', c: G.L, side: 'L', r: undefined, held: true }]);
    expect(propsFrom([{ rodzaj: 'hantel', trzyma: 'L', promien: 5 }], G)).toEqual([{ k: 'dumbbell', c: G.L, side: 'L', r: 5, held: true }]);
    expect(propsFrom([{ rodzaj: 'hantel', pionowo: true }], G)).toEqual([{ k: 'dumbbell', c: [12, 85, 0], side: 'R', vertical: true, r: undefined, held: true }]);
  });
  test('kettlebell: obie = jeden między dłońmi (side C), R/L = w dłoni; tryb dzwonu: dol bez kierunku, tyl ma kierunek −x, wzdluz czeka na szkielet', () => {
    const c = propsFrom([{ rodzaj: 'kettlebell' }], G)[0] as Extract<Prop, { k: 'kettlebell' }>; expect([c.k, c.side, c.c, c.bell, c.dir]).toEqual(['kettlebell', 'C', [12, 85, 0], 'down', undefined]);
    expect((propsFrom([{ rodzaj: 'kettlebell', trzyma: 'R' }], G)[0] as Extract<Prop, { k: 'kettlebell' }>).c).toEqual(G.R);
    const t = propsFrom([{ rodzaj: 'kettlebell', dzwon: 'tyl' }], G)[0] as Extract<Prop, { k: 'kettlebell' }>; expect(t.bell).toBe('back'); expect(t.dir?.[0]).toBeLessThan(-0.9);
    const w = propsFrom([{ rodzaj: 'kettlebell', dzwon: 'wzdluz' }], G)[0] as Extract<Prop, { k: 'kettlebell' }>; expect([w.bell, w.dir]).toEqual(['along', undefined]);
  });
  test('talerz i piłka: środek między dłońmi + przesunięcie; jedna dłoń ma domyślne przesunięcie (talerz pod dłonią, piłka na dłoni); held = true albo strona', () => {
    expect(propsFrom([{ rodzaj: 'talerz' }], G)).toEqual([{ k: 'plate', c: [12, 85, 0], r: undefined, held: true }]);
    expect(propsFrom([{ rodzaj: 'talerz', przesuniecie: [0, 3, 0] }], G)[0]).toMatchObject({ c: [12, 88, 0] });
    expect(propsFrom([{ rodzaj: 'talerz', trzyma: 'R' }], G)[0]).toMatchObject({ c: [10, 80 - (EQUIP.plateR - 1), 20], held: 'R' });
    expect(propsFrom([{ rodzaj: 'talerz', trzyma: 'R', promien: 10 }], G)[0]).toMatchObject({ c: [10, 80 - 9, 20], r: 10 });
    expect(propsFrom([{ rodzaj: 'pilka_lekarska' }], G)).toEqual([{ k: 'ball', c: [12, 85, 0], r: undefined, held: true }]);
    expect(propsFrom([{ rodzaj: 'pilka_lekarska', trzyma: 'L' }], G)[0]).toMatchObject({ c: [14, 90 + EQUIP.medBallR - 1, -20], held: 'L' });
    expect(propsFrom([{ rodzaj: 'pilka_lekarska', przesuniecie: [0, 11, 0], promien: 12 }], G)[0]).toMatchObject({ c: [12, 96, 0], r: 12 });
  });
  test('słupek (stojak): hak przekazany do rekwizytu; bez haka rekwizyt bez pola hook; gryf łamany i gruby to sztanga (możliwości katalogu)', () => {
    expect(propsFrom([{ rodzaj: 'slupek', x: -40, h: 200, hak: 70 }], G)).toEqual([{ k: 'post', x: -40, h: 200, hook: 70 }]); expect(propsFrom([{ rodzaj: 'slupek', x: 5, h: 100 }], G)).toEqual([{ k: 'post', x: 5, h: 100 }]);
    expect(GEAR_KINDS.sztanga.caps).toEqual(expect.arrayContaining(['ez_bar', 'axle_bar'])); expect(GEAR_KINDS.slupek.caps).toEqual(['rack', 'bench.uprights', 'rack.safeties']);
  });
  test('smith: rekwizyt prowadnicy z x i h (domyślnie 0 i 200); uwagi o sztandze w punktach odniesienia', () => {
    expect(propsFrom([{ rodzaj: 'smith', x: 12, h: 195 }], G)).toEqual([{ k: 'rail', x: 12, h: 195 }]); expect(propsFrom([{ rodzaj: 'smith' }], G)).toEqual([{ k: 'rail', x: 0, h: 200 }]);
    expect(GEAR_KINDS.smith.ref?.().join(' ')).toMatch(/podazaZaChwytem: true.*prowadnicy \(± 1,5 cm\)/);
  });
  test('landmine: oś obrotu [x, y, z] (domyślnie [0, 5, 0]), koniec gryfu między dłońmi (jedna dłoń: w dłoni), długość z dlugosc albo EQUIP.landmineLen', () => {
    expect(propsFrom([{ rodzaj: 'landmine', x: -150 }], G)).toEqual([{ k: 'pivot', from: [-150, 5, 0], to: [12, 85, 0], len: EQUIP.landmineLen }]);
    expect(propsFrom([{ rodzaj: 'landmine', x: -150, y: 8, z: 30, dlugosc: 180, trzyma: 'L' }], G)).toEqual([{ k: 'pivot', from: [-150, 8, 30], to: G.L, len: 180 }]);
  });
  test('ściana: lita za osobą (domyślnie) albo przed osobą (przed: true), wysokość domyślnie 250; kontakt ze ścianą deklarowany (tolerancja WALL_CONTACT); gryf sześciokątny: środek między dłońmi', () => {
    expect(propsFrom([{ rodzaj: 'sciana', x: -12 }], G)).toEqual([{ k: 'wall', x: -12, h: 250 }]); expect(propsFrom([{ rodzaj: 'sciana', x: 40, h: 200, przed: true }], G)).toEqual([{ k: 'wall', x: 40, h: 200, front: true }]);
    expect(contactsFrom([{ rodzaj: 'sciana' }, { rodzaj: 'sztanga' }])).toEqual([{ body: '', equip: 'wall', tol: WALL_CONTACT }]); expect(WALL_CONTACT).toBe(1.5);
    expect(propsFrom([{ rodzaj: 'gryf_szesciokatny' }], G)).toEqual([{ k: 'trapbar', c: [12, 85, 0] }]);
  });
  test('łańcuchy: na końcach sztangi (z = ±chainZ) od osi sztangi do podłogi; bez sztangi wiszą z dłoni; sztanga niezależnie od kolejności wpisów', () => {
    const bar = { rodzaj: 'sztanga' as const, x: 3, y: 90, trzyma: 'obie' as const };
    expect(propsFrom([bar, { rodzaj: 'lancuchy' }], G).filter(p => p.k === 'chain')).toEqual([{ k: 'chain', from: [3, 90, -EQUIP.chainZ], to: [3, 0, -EQUIP.chainZ] }, { k: 'chain', from: [3, 90, EQUIP.chainZ], to: [3, 0, EQUIP.chainZ] }]);
    expect(propsFrom([{ rodzaj: 'lancuchy' }, bar], G).filter(p => p.k === 'chain').length).toBe(2);
    expect(propsFrom([{ rodzaj: 'lancuchy' }], G)).toEqual([{ k: 'chain', from: G.R, to: [10, 0, 20] }, { k: 'chain', from: G.L, to: [14, 0, -20] }]);
    expect(equipColliders(propsFrom([{ rodzaj: 'lancuchy' }], G))).toEqual([]); /* łańcuchy bez kolidera */
    const sh = propShapes(propsFrom([bar, { rodzaj: 'lancuchy' }], G), 'side').filter(s => s.id === 'chain'); expect(sh.length).toBe(2); for (const x of sh) expect(x.k === 'line' && x.dash).toBeTruthy();
  });
  test('wyciąg: jedna kolumna i jedna linka (środek między dłońmi), osprzęt: handle/rope/bar/strap; dwa: po kolumnie i lince na dłoń w z = ±|z|; kostka bierze kostki, nie dłonie', () => {
    const A = { R: [5, 20, 9] as V3, L: [6, 22, -9] as V3 };
    const one = propsFrom([{ rodzaj: 'wyciag', x: 45, y: 220, h: 230 }], G, A); expect(one).toEqual([{ k: 'tower', x: 45, z: 0, h: 230, solid: true }, { k: 'cable', from: [45, 220, 0], to: [12, 85, 0], attach: 'handle', ends: [G.R, G.L], solid: true }]);
    expect(propsFrom([{ rodzaj: 'wyciag', y: 20, chwyt: 'lina', trzyma: 'R' }], G, A)[1]).toMatchObject({ to: G.R, attach: 'rope', ends: [G.R] }); expect(propsFrom([{ rodzaj: 'wyciag', chwyt: 'drazek' }], G, A)[1]).toMatchObject({ attach: 'bar' });
    expect(propsFrom([{ rodzaj: 'wyciag', y: 20, chwyt: 'kostka', trzyma: 'L' }], G, A)[1]).toMatchObject({ to: A.L, attach: 'strap', ends: [A.L], from: [0, 20, 0] });
    const two2 = propsFrom([{ rodzaj: 'wyciag', y: 130, dwa: true }], G, A); expect(two2.map(p => p.k)).toEqual(['tower', 'cable', 'tower', 'cable']); expect(two2[0]).toMatchObject({ z: EQUIP.cableSpan }); expect(two2[3]).toMatchObject({ from: [0, 130, -EQUIP.cableSpan], to: G.L });
    expect(propsFrom([{ rodzaj: 'wyciag', y: 130, dwa: true, z: -70, trzyma: 'R' }], G, A).map(p => p.k === 'tower' ? p.z : p.k)).toEqual([70, 'cable']); /* jedna dłoń: jedna strona, |z| */
  });
  test('wyciąg: capOk — bloczek niski/średni/wysoki wg CABLE_Y, dwa wyciągi, opaska, uchwyt, lina; capNeed opisuje wymaganie', () => {
    const ok = (cap: string, g: Partial<Gear>) => GEAR_KINDS.wyciag.capOk!(cap, { rodzaj: 'wyciag', ...g });
    expect(CABLE_Y).toEqual({ low: [5, 60], mid: [70, 160], high: [150, 240] });
    expect([ok('cable.high', { y: 220 }), ok('cable.high', { y: 20 }), ok('lat_pulldown', { y: 200 }), ok('cable.mid', { y: 120 }), ok('cable.mid', { y: 20 }), ok('cable.low', { y: 20 }), ok('cable.low', { y: 120 }), ok('cable.row_seat', { y: 30 })]).toEqual([true, false, true, true, false, true, false, true]);
    expect([ok('cable.dual', { dwa: true }), ok('cable.dual', {}), ok('ankle_strap', { chwyt: 'kostka' }), ok('ankle_strap', {}), ok('cable.handles', {}), ok('cable.handles', { chwyt: 'lina' }), ok('cable.rope', { chwyt: 'lina' }), ok('cable.rope', {})]).toEqual([true, false, true, false, true, false, true, false]);
    expect(GEAR_KINDS.wyciag.capNeed?.['cable.high']).toBe('bloczek wysoki: y 150–240 cm'); expect(ok('inna', {})).toBe(true);
  });
  test('requiredGearIssues: brak wymaganego sprzętu → komunikat z rodzajem i wymaganiem; alternatywy (ALBO); grupy bez możliwości w rejestrze i stojak (opcjonalny) pomijane', () => {
    const w = (req: string[][], gear: Gear[]) => requiredGearIssues(req, gear);
    expect(w([['cable.high']], [])).toEqual(['sprzęt: ćwiczenie wymaga: wyciąg z bloczkiem wysokim (rodzaj „wyciag”, bloczek wysoki: y 150–240 cm), a sprzet[] tego nie zawiera']);
    expect(w([['cable.high']], [{ rodzaj: 'wyciag', y: 20 }]).length).toBe(1); expect(w([['cable.high']], [{ rodzaj: 'wyciag', y: 200 }])).toEqual([]);
    expect(w([['cable.high', 'cable.mid']], [{ rodzaj: 'wyciag', y: 120 }])).toEqual([]); expect(w([['cable.high', 'cable.mid']], [{ rodzaj: 'wyciag', y: 20 }])[0]).toContain(' ALBO ');
    expect(w([['cable.dual'], ['cable.low']], [{ rodzaj: 'wyciag', y: 20 }]).length).toBe(1); expect(w([['cable.dual'], ['cable.low']], [{ rodzaj: 'wyciag', y: 20, dwa: true }])).toEqual([]);
    expect(w([['db', 'plate']], [{ rodzaj: 'talerz' }])).toEqual([]); expect(w([['db']], [{ rodzaj: 'talerz' }]).length).toBe(1); expect(w([['barbell'], ['rack']], [{ rodzaj: 'sztanga' }])).toEqual([]); /* stojak opcjonalny */
    expect(w([['circus_bell']], [])).toEqual([]); expect(w([['circus_bell', 'db']], [])).toEqual(['sprzęt: ćwiczenie wymaga: hantle (rodzaj „hantel”), a sprzet[] tego nie zawiera']); /* grupa z możliwością w rejestrze liczy się, reszta bez rodzaju nie pomaga */
    expect(w([['landmine'], ['barbell']], [{ rodzaj: 'landmine' }])).toEqual(['sprzęt: ćwiczenie wymaga: sztanga albo drążek (rodzaj „sztanga”), a sprzet[] tego nie zawiera']); expect(w([['pullup.bar', 'rings']], [])).toEqual(['sprzęt: ćwiczenie wymaga: sztanga albo drążek (rodzaj „sztanga”) ALBO kółka gimnastyczne (rysowane jako uchwyty na taśmach, bez obrotu kółek — uproszczenie) (rodzaj „zawieszenie”), a sprzet[] tego nie zawiera']); /* drążek i kółka to dwie możliwości (kółka = zawieszenie, poprawka p1); ta sama nazwa raz */
    expect(w([['rack'], ['rack.safeties']], [])).toEqual([]);
  });
  test('ławka: rekwizyt z kąta — płaska (kat 0), skośna (głowa wyżej), ujemna (siedzisko 60 cm, głowa niżej); x, top, dlugosc, walki; domyślne wymiary z BENCH', () => {
    const b = (g: Partial<Gear>) => propsFrom([{ rodzaj: 'lawka', ...g }], G)[0] as Extract<Prop, { k: 'bench' }>;
    expect(b({})).toEqual({ k: 'bench', seatFrom: [BENCH.seatLen, BENCH.seatTop], hinge: [0, BENCH.seatTop], backTo: [-BENCH.backLen, BENCH.seatTop], legH: BENCH.seatTop });
    const inc = b({ kat: 30, x: 10 }); expect(inc.hinge).toEqual([10, 43]); expect(inc.backTo[0]).toBeCloseTo(10 - Math.cos(Math.PI / 6) * 75, 9); expect(inc.backTo[1]).toBeCloseTo(43 + 37.5, 9);
    const dec = b({ kat: -15 }); expect(dec.hinge[1]).toBe(BENCH.declineSeat); expect(dec.backTo[1]).toBeLessThan(BENCH.declineSeat); expect(b({ kat: -15, top: 50 }).hinge[1]).toBe(50);
    expect(b({ dlugosc: 60 }).backTo[0]).toBeCloseTo(-60, 9); expect(b({ walki: true }).rollers).toBe(true); expect(b({}).rollers).toBeUndefined(); expect(contactsFrom([{ rodzaj: 'lawka' }]).length).toBe(12);
  });
  test('ławka = ława z rigu: dane przykładu (gearOf) odtwarzają rekwizyt ławki rigu (płaska, skośna, ujemna; ≤ 0,01 cm)', () => {
    for (const key of ['Bench Press (sztanga)', 'Incline Bench Press (sztanga)', 'Decline Bench Press']) {
      const rig = frameAt(figureSpec(key)!, 0).props.find(p => p.k === 'bench') as Extract<Prop, { k: 'bench' }>; const d = exampleFor(key)!; const g = d.sprzet.find(x => x.rodzaj === 'lawka'); expect(g).toBeDefined();
      const dat = keyframeFrame(d, 0).props.find(p => p.k === 'bench') as Extract<Prop, { k: 'bench' }>;
      for (const [a, c] of [[dat.hinge, rig.hinge], [dat.seatFrom, rig.seatFrom], [dat.backTo, rig.backTo]] as const) { expect(Math.abs(a[0] - c[0])).toBeLessThan(0.01); expect(Math.abs(a[1] - c[1])).toBeLessThan(0.01); }
    }
  });
  test('ławka: capOk wg zakresów kąta (płaska ±5°, skośna ≥ 10°, ujemna ≤ −5°); requiredGearIssues odróżnia rodzaje ławek', () => {
    const ok = (cap: string, kat?: number) => GEAR_KINDS.lawka.capOk!(cap, { rodzaj: 'lawka', kat });
    expect(BENCH_KAT).toEqual({ min: -45, max: 90, flat: [-5, 5], incline: [10, 90], decline: [-45, -5] });
    expect([ok('bench.flat', 0), ok('bench.flat', 4), ok('bench.flat', 30), ok('bench.incline', 30), ok('bench.incline', 5), ok('bench.decline', -15), ok('bench.decline', 0), ok('bench.flat', undefined)]).toEqual([true, true, false, true, false, true, false, true]);
    expect(requiredGearIssues([['bench.incline']], [{ rodzaj: 'lawka', kat: 0 }])).toEqual(['sprzęt: ćwiczenie wymaga: ławka skośna (głową wyżej) (rodzaj „lawka”, kat 10…90°), a sprzet[] tego nie zawiera']);
    expect(requiredGearIssues([['bench.incline', 'bench.flat']], [{ rodzaj: 'lawka', kat: 0 }])).toEqual([]); expect(requiredGearIssues([['bench.flat']], [{ rodzaj: 'skrzynia' }]).length).toBe(1); /* skrzynia nie jest już ławką */
  });
  test('ławka: pola — kąt, wysokość siedziska, długość oparcia; wałki: rysunek w trzech widokach i kolider (kapsuła wzdłuż z); ciało pod wałkiem przenika', () => {
    expect(gearFieldIssues({ rodzaj: 'lawka', kat: 100 })).toEqual(['sprzęt: kąt ławki kat = 100° poza przedziałem -45…90°']); expect(gearFieldIssues({ rodzaj: 'lawka', top: 10 })).toEqual(['sprzęt: wysokość siedziska top = 10 cm poza przedziałem 20–80 cm']);
    expect(gearFieldIssues({ rodzaj: 'lawka', dlugosc: 10 })).toEqual(['sprzęt: długość oparcia dlugosc = 10 cm poza przedziałem 30–120 cm']); expect(gearFieldIssues({ rodzaj: 'sztanga', kat: 10 })).toEqual(['sprzęt: pole „kat” nie dotyczy rodzaju „sztanga”']);
    const bp = propsFrom([{ rodzaj: 'lawka', kat: -15, walki: true }], G)[0] as Extract<Prop, { k: 'bench' }>; for (const v of ['side', 'front', 'top'] as View[]) expect(propShapes([bp], v).map(x => x.id)).toContain('benchRoller');
    expect(propShapes([{ ...bp, rollers: undefined }], 'side').map(x => x.id)).not.toContain('benchRoller'); const r = rollerAt(bp); expect(r).toEqual([BENCH.seatLen + EQUIP.rollerDx, BENCH.declineSeat + EQUIP.rollerDy]);
    const cap = equipColliders([bp]).find(c => c.id === 'benchRoller') as Extract<ReturnType<typeof equipColliders>[number], { k: 'capsule' }>; expect(cap).toMatchObject({ a: [r[0], r[1], -EQUIP.rollerHalf], b: [r[0], r[1], EQUIP.rollerHalf], r: EQUIP.rollerR });
    const hi = EXAMPLE('Decline Bench Press', true); for (const k of hi.klatki) for (const sd of ['R', 'L'] as const) k.nogi[sd].kostka = [k.nogi[sd].kostka[0] + 3, k.nogi[sd].kostka[1] + 9, k.nogi[sd].kostka[2]]; expect(texts(hi)).toMatch(/\[geometria\] (shank|foot)[RL] × benchRoller: przenikanie/); /* stopy wyżej niż wałki: nogi w wałku */
    expect(texts(EXAMPLE('Decline Bench Press', true))).toBe('');
  });
  test.each([...BAND_MOUNT])('guma: mocowanie „%s” — linie gumy od właściwego punktu do właściwego celu (macierz po BAND_MOUNT)', m => {
    const A = { R: [5, 20, 9] as V3, L: [6, 22, -9] as V3 }; const bar = { rodzaj: 'sztanga' as const, x: 3, y: 90, trzyma: 'obie' as const };
    const out = propsFrom([bar, { rodzaj: 'guma', mocowanie: m, x: -60, y: 110, z: 5 }], G, A).filter(p => p.k === 'band');
    const want = { zaczep: [[[-60, 110, 5], G.R], [[-60, 110, 5], G.L]], stopy: [[[5, 0, 9], G.R], [[6, 0, -9], G.L]], kostki: [[A.R, A.L]], dlonie: [[G.R, G.L]], sztanga: [[[-60, 110, -EQUIP.chainZ], [3, 90, -EQUIP.chainZ]], [[-60, 110, EQUIP.chainZ], [3, 90, EQUIP.chainZ]]] }[m];
    expect(out.map(p => p.k === 'band' ? [p.from, p.to] : null)).toEqual(want);
    for (const v of ['side', 'front', 'top'] as View[]) { const sh = propShapes(out, v).filter(x => x.id === 'band'); expect(sh.length).toBe(want.length); for (const x of sh) expect(x.k === 'line' && x.dash).toBeTruthy(); }
    expect(equipColliders(out)).toEqual([]); /* guma bez kolidera */
  });
  test('guma: jedna dłoń (trzyma R) → jedna linia; domyślny zaczep [0, 100, 0]; sztanga bez wpisu sztanga → brak linii i komunikat zestawu; wysokość zaczepu poza zakresem', () => {
    expect(propsFrom([{ rodzaj: 'guma', trzyma: 'R' }], G)).toEqual([{ k: 'band', from: [0, 100, 0], to: G.R }]); expect(propsFrom([{ rodzaj: 'guma', mocowanie: 'sztanga' }], G)).toEqual([]);
    expect(gearSetIssues([{ rodzaj: 'guma', mocowanie: 'sztanga' }])).toEqual(['sprzęt: guma z mocowaniem „sztanga” wymaga wpisu sztanga']); expect(gearSetIssues([{ rodzaj: 'guma', mocowanie: 'sztanga' }, { rodzaj: 'sztanga' }])).toEqual([]);
    expect(gearFieldIssues({ rodzaj: 'guma', y: 400 })).toEqual(['sprzęt: wysokość zaczepu gumy y = 400 cm poza przedziałem 0–300 cm']); expect(gearFieldIssues({ rodzaj: 'hantel', mocowanie: 'stopy' })[0]).toContain('pole „mocowanie” nie dotyczy rodzaju „hantel”');
    expect(requiredGearIssues([['bands']], [])).toEqual(['sprzęt: ćwiczenie wymaga: guma oporowa (rodzaj „guma”), a sprzet[] tego nie zawiera']); expect(requiredGearIssues([['bands']], [{ rodzaj: 'guma' }])).toEqual([]);
  });
  test('piłka gimnastyczna: leży na podłodze (środek [x, r, z], held: false), domyślny promień EQUIP.gymBallR; wałek: walec wzdłuż z na podłodze', () => {
    expect(propsFrom([{ rodzaj: 'pilka_gimnastyczna', x: 40 }], G)).toEqual([{ k: 'ball', c: [40, EQUIP.gymBallR, 0], r: undefined, held: false }]);
    expect(propsFrom([{ rodzaj: 'pilka_gimnastyczna', x: 40, z: 3, promien: 27.5 }], G)).toEqual([{ k: 'ball', c: [40, 27.5, 3], r: 27.5, held: false }]);
    expect(propsFrom([{ rodzaj: 'rolka', x: 10 }], G)).toEqual([{ k: 'roll', c: [10, EQUIP.foamR, 0], r: EQUIP.foamR, len: EQUIP.foamLen }]); expect(propsFrom([{ rodzaj: 'rolka', promien: 6, dlugosc: 60, z: 2 }], G)).toEqual([{ k: 'roll', c: [0, 6, 2], r: 6, len: 60 }]);
    expect(contactsFrom([{ rodzaj: 'pilka_gimnastyczna' }, { rodzaj: 'rolka' }])).toEqual([{ body: '', equip: 'gymBall', tol: SOFT_CONTACT.gymBall }, { body: '', equip: 'roll', tol: SOFT_CONTACT.roll }]); expect(SOFT_CONTACT).toEqual({ gymBall: 3, roll: 2 });
  });
  test('piłka gimnastyczna i wałek: rysunek (leżąca piłka w barwie sprzętu stałego za ciałem, id gymBall; trzymana: ball), kolidery (id gymBall, roll; kapsuła wzdłuż z)', () => {
    const gym: Prop = { k: 'ball', c: [40, 32.5, 0], held: false }; const med: Prop = { k: 'ball', c: [40, 100, 0] }; const roll: Prop = { k: 'roll', c: [10, 7.5, 0], r: 7.5, len: 90 };
    for (const v of ['side', 'front', 'top'] as View[]) { expect(propShapes([gym], v).map(x => x.id)).toContain('gymBall'); expect(propShapes([med], v).map(x => x.id)).toContain('ball'); expect(propShapes([roll], v).map(x => x.id)).toEqual(['roll']); }
    expect(propShapes([gym], 'side').find(x => x.id === 'gymBall')).toMatchObject({ k: 'circle', r: EQUIP.gymBallR, fill: 'pad' }); expect(propShapes([med], 'side').find(x => x.id === 'ball')).toMatchObject({ fill: 'load' });
    expect(equipColliders([gym])).toEqual([{ k: 'capsule', id: 'gymBall', a: [40, 32.5, 0], b: [40, 32.5, 0], r: EQUIP.gymBallR }]); expect(equipColliders([med])[0]).toMatchObject({ id: 'ball', r: EQUIP.medBallR });
    expect(equipColliders([roll])).toEqual([{ k: 'capsule', id: 'roll', a: [10, 7.5, -45], b: [10, 7.5, 45], r: 7.5 }]);
  });
  test('piłka gimnastyczna: miękki kontakt — łydka w piłce do 3 cm dozwolona, głębiej odrzucona; bez deklaracji kontaktu obowiązuje 0,3 cm; wałek: 2 cm', () => {
    const pen = (g: Gear, withContacts = true) => { const base = ROTATE([g]); const f = keyframeFrame(base, 0); return checkFrame(withContacts ? f : { ...f, contacts: [] }).filter(i => i.code === 'pen').map(i => i.detail); };
    const first = (xs: number[], g: (x: number) => Gear, c = true) => xs.find(x => pen(g(x), c).length === 0);
    const xs = Array.from({ length: 70 }, (_, i) => 20 + i); const a = first(xs, x => ({ rodzaj: 'pilka_gimnastyczna', x }))!; const b = first(xs, x => ({ rodzaj: 'pilka_gimnastyczna', x }), false)!;
    expect(a).toBeLessThan(b); expect(pen({ rodzaj: 'pilka_gimnastyczna', x: a - 3 }).length).toBeGreaterThan(0); expect(pen({ rodzaj: 'pilka_gimnastyczna', x: 100 })).toEqual([]); expect(b - a).toBeGreaterThanOrEqual(1); expect(b - a).toBeLessThanOrEqual(4);
    expect(pen({ rodzaj: 'pilka_gimnastyczna', x: a - 3 })[0]).toMatch(/× gymBall: przenikanie [\d.]+ cm \(dopuszczalne 3\)/);
    const ra = first(xs, x => ({ rodzaj: 'rolka', x })); expect(ra).toBeDefined(); expect(pen({ rodzaj: 'rolka', x: ra! - 3 })[0]).toMatch(/× roll: przenikanie [\d.]+ cm \(dopuszczalne 2\)/);
  });
  test('piłka gimnastyczna i wałek: pola — promień i długość w granicach; wałek: z', () => {
    expect(gearFieldIssues({ rodzaj: 'pilka_gimnastyczna', promien: 50 })).toEqual(['sprzęt: promien piłki gimnastycznej = 50 cm poza przedziałem 20–40 cm']); expect(gearFieldIssues({ rodzaj: 'rolka', promien: 2 })).toEqual(['sprzęt: promien wałka = 2 cm poza przedziałem 4–12 cm']);
    expect(gearFieldIssues({ rodzaj: 'rolka', dlugosc: 5 })).toEqual(['sprzęt: dlugosc wałka = 5 cm poza przedziałem 30–120 cm']); expect(gearFieldIssues({ rodzaj: 'rolka', z: 4, promien: 7 })).toEqual([]); expect(gearFieldIssues({ rodzaj: 'pilka_gimnastyczna', pionowo: true })[0]).toContain('pole „pionowo” nie dotyczy');
    expect(requiredGearIssues([['stability_ball']], [])).toEqual(['sprzęt: ćwiczenie wymaga: piłka gimnastyczna (rodzaj „pilka_gimnastyczna”), a sprzet[] tego nie zawiera']); expect(requiredGearIssues([['stability_ball', 'med_ball']], [{ rodzaj: 'pilka_lekarska' }])).toEqual([]);
  });
  test('dźwignia: obrót — oś [x, y (50), z], punkt mocowania wg punkt (dłonie / kostki / miednica) i trzyma (domyślnie R), długość z dlugosc albo EQUIP.leverArm, label i cut; prowadnica: slide z dir z kąta', () => {
    const A = { R: [5, 20, 9] as V3, L: [6, 22, -9] as V3 }; const P: V3 = [1, 2, 3]; const d = (g: Partial<Gear>) => propsFrom([{ rodzaj: 'dzwignia', x: 10, y: 60, z: 30, ...g }], G, A, P)[0];
    expect(d({})).toEqual({ k: 'pivot', from: [10, 60, 30], to: G.R, len: EQUIP.leverArm, label: 'dzwignia', cut: EQUIP.leverEnd });
    expect(d({ punkt: 'kostki', trzyma: 'L' })).toMatchObject({ to: A.L }); expect(d({ punkt: 'kostki', trzyma: 'obie' })).toMatchObject({ to: [5.5, 21, 0] }); expect(d({ punkt: 'miednica' })).toMatchObject({ to: P }); expect(d({ trzyma: 'obie' })).toMatchObject({ to: [12, 85, 0] }); expect(d({ dlugosc: 33 })).toMatchObject({ len: 33 });
    expect(propsFrom([{ rodzaj: 'dzwignia' }], G, A, P)[0]).toMatchObject({ from: [0, 50, 0] });
    const sl = d({ tryb: 'prosta', kat: 90, dlugosc: 40 }) as Extract<Prop, { k: 'slide' }>; expect(sl.k).toBe('slide'); expect(sl.dir[0]).toBeCloseTo(0, 9); expect(sl.dir[1]).toBeCloseTo(1, 9); expect(sl.len).toBe(40); expect(d({ tryb: 'prosta' })).toMatchObject({ len: EQUIP.leverStroke, dir: [1, 0, 0] });
  });
  test.each([...LEVER_MODE])('dźwignia: tryb „%s” — rysunek w trzech widokach i właściwe sprawdzenie ruchu (macierz po LEVER_MODE)', tryb => {
    const d = tryb === 'obrot' ? LEGEXT() : SLIDE(); expect(texts(d)).toBe('');
    const ids = (v: View) => propShapes(keyframeFrame(d, 0.5).props, v).map(x => x.id); const own = tryb === 'obrot' ? 'landmine' : 'slideRail';
    for (const v of ['side', 'front', 'top'] as View[]) expect(ids(v)).toContain(own); if (tryb === 'prosta') for (const v of ['side', 'front'] as View[]) expect(ids(v)).toContain('slidePad');
    const bad = tryb === 'obrot' ? LEGEXT({ dlugosc: 70 }) : SLIDE({}, 8); expect(texts(bad)).toMatch(tryb === 'obrot' ? /\[geometria\] dzwignia: punkt mocowania \d+\.\d cm od osi obrotu, a ramię ma 70 cm \(dopuszczalne ± 3\)/ : /\[geometria\] dźwignia \(prowadnica\): punkt mocowania 8\.0 cm od prowadnicy/);
  });
  test.each([...LEVER_POINT])('dźwignia: punkt mocowania „%s” — komunikaty o geometrii nie zależą od punktu; rekwizyt ma właściwy cel (macierz po LEVER_POINT)', punkt => {
    const f = keyframeFrame(LEGEXT({ punkt, trzyma: 'R', dlugosc: 47.5 }), 0); const pv = f.props.find(p => p.k === 'pivot') as Extract<Prop, { k: 'pivot' }>;
    const want = punkt === 'kostki' ? f.sk.legs.R.ankle : punkt === 'miednica' ? f.sk.pelvis : f.sk.arms.R.grip; for (let i = 0; i < 3; i++) expect(pv.to[i]).toBeCloseTo(want[i], 6);
  });
  test('dźwignia: kolider ramienia (id barPivot) kończy się EQUIP.leverEnd cm przed punktem mocowania; prowadnica bez kolidera; ramię przez ciało → przenikanie', () => {
    const f = keyframeFrame(LEGEXT(), 0); const pv = f.props.find(p => p.k === 'pivot') as Extract<Prop, { k: 'pivot' }>; const cap = equipColliders(f.props).find(c => c.id === 'barPivot') as Extract<ReturnType<typeof equipColliders>[number], { k: 'capsule' }>;
    expect(Math.hypot(...cap.b.map((x, i) => x - pv.to[i]))).toBeCloseTo(EQUIP.leverEnd, 6); expect(equipColliders(keyframeFrame(SLIDE(), 0).props).filter(c => c.id !== 'floor')).toEqual([]);
    expect(texts(LEGEXT({ x: 8, y: 55, z: 0 }))).toMatch(/× barPivot: przenikanie/); /* oś dźwigni w miednicy: ramię przechodzi przez ciało (obok błędu długości ramienia) */
  });
  test('maszyny: każda możliwość katalogu (macierz po 22 typach) ma etykietę, wymaga wpisu dzwignia i jest przez niego spełniona; siedzisko i oparcie to osobny wpis lawka', () => {
    for (const cap of MACHINE_CAPS) { expect([cap, GEAR_KINDS.dzwignia.caps.includes(cap)]).toEqual([cap, true]); expect([cap, (GEAR_KINDS.dzwignia.capLabel?.[cap] ?? '').length > 20]).toEqual([cap, true]);
      expect(requiredGearIssues([[cap]], [])).toEqual([`sprzęt: ćwiczenie wymaga: ${GEAR_KINDS.dzwignia.capLabel![cap]} (rodzaj „dzwignia”), a sprzet[] tego nie zawiera`]); expect(requiredGearIssues([[cap]], [{ rodzaj: 'dzwignia' }])).toEqual([]); expect(requiredGearIssues([[cap]], [{ rodzaj: 'lawka' }]).length).toBe(1); }
    expect(GEAR_KINDS.dzwignia.caps.length).toBe(22); expect(MACHINE_CAPS.length).toBe(22);
  });
  test('ławka: długość siedziska (siedzisko) przesuwa koniec siedziska; siedząc miednica leży na dwusiecznej (benchHip), leżąc jak w rigu; zakres pola', () => {
    const b = (g: Partial<Gear>) => propsFrom([{ rodzaj: 'lawka', ...g }], G)[0] as Extract<Prop, { k: 'bench' }>; expect(b({ siedzisko: 40 }).seatFrom).toEqual([40, BENCH.seatTop]); expect(b({}).seatFrom[0]).toBe(BENCH.seatLen);
    expect(benchHip(0, 43)).toEqual([0, 43 + BENCH.padBack, 0]); const h30 = benchHip(30, 43); expect(h30[0]).toBeCloseTo(BENCH.padBack * Math.sin(Math.PI / 6), 9); expect(h30[1]).toBeCloseTo(43 + BENCH.padBack * Math.cos(Math.PI / 6), 9);
    const h75 = benchHip(75, 45); expect(h75[0]).toBeCloseTo(7.8267, 3); expect(h75[1]).toBeCloseTo(55.2, 3); const th = 75 * Math.PI / 180; /* odległość od siedziska i od oparcia = padBack */
    expect(h75[1] - 45).toBeCloseTo(BENCH.padBack, 6); expect(h75[0] * Math.sin(th) + (h75[1] - 45) * Math.cos(th)).toBeCloseTo(BENCH.padBack, 6);
    expect(gearFieldIssues({ rodzaj: 'lawka', siedzisko: 10 })).toEqual(['sprzęt: siedzisko (długość siedziska) = 10 cm poza przedziałem 20–70 cm']);
    expect(gearFieldIssues({ rodzaj: 'dzwignia', dlugosc: 10 })).toEqual(['sprzęt: dlugosc ramienia dźwigni = 10 cm poza przedziałem 20–150 cm']); expect(gearFieldIssues({ rodzaj: 'dzwignia', tryb: 'prosta', dlugosc: 5 })).toEqual(['sprzęt: dlugosc skoku prowadnicy = 5 cm poza przedziałem 10–150 cm']);
    expect(gearFieldIssues({ rodzaj: 'dzwignia', kat: 30 })).toEqual(['sprzęt: pole „kat” (kąt prowadnicy) dotyczy tylko dźwigni w trybie „prosta”']); expect(gearFieldIssues({ rodzaj: 'dzwignia', tryb: 'prosta', kat: 30 })).toEqual([]); expect(gearFieldIssues({ rodzaj: 'hantel', tryb: 'obrot' })[0]).toContain('pole „tryb” nie dotyczy rodzaju „hantel”');
  });
  test('modlitewnik: rekwizyt z domyślnych wymiarów (EQUIP) i z pól; podpórka opada od osoby (+x) pod kątem kat; siedzisko za górnym końcem; wielokąty i kolidery', () => {
    const m = (g: Partial<Gear>) => propsFrom([{ rodzaj: 'modlitewnik', ...g }], G)[0] as Extract<Prop, { k: 'preacher' }>; const d = m({});
    expect(d.top).toEqual([0, EQUIP.preacherTop]); expect(d.seat).toEqual([-EQUIP.preacherSeatDx, EQUIP.preacherSeatY]); const th = EQUIP.preacherKat * Math.PI / 180; expect(d.bottom[0]).toBeCloseTo(Math.cos(th) * EQUIP.preacherLen, 9); expect(d.bottom[1]).toBeCloseTo(EQUIP.preacherTop - Math.sin(th) * EQUIP.preacherLen, 9);
    const e = m({ x: 10, top: 90, kat: 45, dlugosc: 30, y: 50 }); expect(e.top).toEqual([10, 90]); expect(e.bottom[0]).toBeCloseTo(10 + 30 * Math.SQRT1_2, 9); expect(e.bottom[1]).toBeCloseTo(90 - 30 * Math.SQRT1_2, 9); expect(e.seat).toEqual([10 - EQUIP.preacherSeatDx, 50]);
    const pp = preacherPolys(d); expect(pp.pad.length).toBe(4); expect(pp.seat.length).toBe(4); expect(pp.pad[0]).toEqual(d.top); expect(pp.pad[1]).toEqual(d.bottom); expect(pp.pad[2][1]).toBeLessThan(d.bottom[1]); /* grubość w głąb (poniżej powierzchni) */
    const eq = equipColliders([d]); expect(eq.map(c => c.id)).toEqual(['preacherPad', 'preacherSeat']); expect(eq[0].k === 'prism' && [eq[0].z0, eq[0].z1]).toEqual([-EQUIP.preacherW / 2, EQUIP.preacherW / 2]); expect(contactsFrom([{ rodzaj: 'modlitewnik' }]).length).toBe(5);
    for (const v of ['side', 'front', 'top'] as View[]) expect(propShapes([d], v).map(x => x.id)).toEqual(expect.arrayContaining(['preacherPad', 'preacherSeat']));
    expect(propShapes([d], 'side').map(x => x.id).filter(x => x === 'preacherLeg').length).toBe(2);
  });
  test('modlitewnik: miękki kontakt ramion z podpórką (3 cm) — dłonie w podpórce wykrywane; pola: kąt, długość, wysokości', () => {
    const pen = (x: number, ctx = true) => { const f = keyframeFrame(ROTATE([{ rodzaj: 'modlitewnik', x, top: 100, kat: 60, y: 48 }]), 0.5); return checkFrame(ctx ? f : { ...f, contacts: [] }).filter(i => i.code === 'pen' && /preacherPad/.test(i.detail)).map(i => i.detail); };
    const xs = Array.from({ length: 120 }, (_, i) => 10 + i); const free = xs.slice().reverse().find(x => pen(x).length > 0); expect(free).toBeDefined(); expect(pen(free! + 5)).toEqual([]); expect(pen(free!)[0]).toMatch(/(torso|(uarm|farm)[RL]) × preacherPad: przenikanie [\d.]+ cm \(dopuszczalne [23]\)/);
    const strict = xs.slice().reverse().find(x => pen(x, false).length > 0)!; expect(strict).toBeGreaterThanOrEqual(free!); /* bez deklaracji kontaktu granica jest dalej od ramion */
    expect(gearFieldIssues({ rodzaj: 'modlitewnik', kat: 90 })).toEqual(['sprzęt: kąt podpórki modlitewnika kat = 90° poza przedziałem 30–80°']); expect(gearFieldIssues({ rodzaj: 'modlitewnik', dlugosc: 10 })).toEqual(['sprzęt: dlugosc podpórki modlitewnika = 10 cm poza przedziałem 25–70 cm']);
    expect(gearFieldIssues({ rodzaj: 'modlitewnik', y: 10 })).toEqual(['sprzęt: wysokość siedziska modlitewnika y = 10 cm poza przedziałem 30–70 cm']); expect(gearFieldIssues({ rodzaj: 'modlitewnik', top: 20 })).toEqual(['sprzęt: wysokość podpórki modlitewnika top = 20 cm poza przedziałem 60–130 cm']);
    expect(requiredGearIssues([['preacher_bench']], [])).toEqual(['sprzęt: ćwiczenie wymaga: modlitewnik (rodzaj „modlitewnik”), a sprzet[] tego nie zawiera']);
  });
  test('zawieszenie, lina, sanie, poręcze: rekwizyty (taśmy z zaczepu do dłoni/kostek, lina pionowa, sanie ze słupkami albo liną, dwie poręcze)', () => {
    const A = { R: [5, 20, 9] as V3, L: [6, 22, -9] as V3 };
    expect(propsFrom([{ rodzaj: 'zawieszenie', x: 10 }], G, A)).toEqual([{ k: 'cable', from: [10, EQUIP.suspensionY, 0], to: G.R, attach: 'handle', ends: [G.R], solid: true, free: EQUIP.suspensionFree }, { k: 'cable', from: [10, EQUIP.suspensionY, 0], to: G.L, attach: 'handle', ends: [G.L], solid: true, free: EQUIP.suspensionFree }]);
    expect(propsFrom([{ rodzaj: 'zawieszenie', y: 200, punkt: 'kostki', trzyma: 'L' }], G, A)).toEqual([{ k: 'cable', from: [0, 200, 0], to: A.L, attach: 'strap', ends: [A.L], solid: true, free: EQUIP.suspensionFree }]);
    /* kolizja taśmy: ostatnie EQUIP.suspensionFree cm przy uchwycie (dłoń trzyma uchwyt, taśma biegnie wzdłuż przedramienia) bez kolidera, reszta solidna; zwykła linka wyciągu — krótszy odcinek EQUIP.cableEnd */
    const taśma = (free?: number) => equipColliders([{ k: 'cable', from: [0, 220, 0], to: [0, 120, 0], attach: 'handle', ends: [[0, 120, 0]], solid: true, ...(free !== undefined ? { free } : {}) }])[0] as Extract<ReturnType<typeof equipColliders>[number], { k: 'capsule' }>;
    expect(taśma(EQUIP.suspensionFree).b[1]).toBeCloseTo(120 + EQUIP.suspensionFree, 6); expect(taśma().b[1]).toBeCloseTo(120 + EQUIP.cableEnd, 6); expect(EQUIP.suspensionFree).toBeGreaterThan(EQUIP.cableEnd);
    const pada = (free: number) => { const c = equipColliders([{ k: 'cable', from: [0, 220, 0], to: [0, 120, 0], attach: 'handle', ends: [[0, 120, 0]], solid: true, free }])[0] as Extract<ReturnType<typeof equipColliders>[number], { k: 'capsule' }>; return c.b[1]; };
    expect(pada(15)).toBeGreaterThan(pada(0)); expect(pada(0)).toBeCloseTo(120, 6); expect(equipColliders([{ k: 'cable', from: [0, 220, 0], to: [0, 120, 0], solid: false, free: 15 }])).toEqual([]);
    expect(propsFrom([{ rodzaj: 'lina_pionowa', x: 20, z: 3, h: 300, y: 10, trzyma: 'R' }], G)).toEqual([{ k: 'rope', x: 20, z: 3, top: 300, bottom: 10, held: 'R' }]); expect(propsFrom([{ rodzaj: 'lina_pionowa' }], G)).toEqual([{ k: 'rope', x: 0, z: 0, top: EQUIP.ropeTop, bottom: EQUIP.ropeBottom, held: true }]);
    expect(propsFrom([{ rodzaj: 'sanie', x: 30 }], G)).toEqual([{ k: 'sled', x: 30, h: EQUIP.sledPostH, len: EQUIP.sledLen, posts: true }]);
    expect(propsFrom([{ rodzaj: 'sanie', x: 80, h: 90, dlugosc: 50, trzymanie: 'lina' }], G)).toEqual([{ k: 'sled', x: 80, h: 90, len: 50, posts: false }, { k: 'cable', from: [130, 15, 0], to: [12, 85, 0], attach: 'handle', ends: [G.R, G.L], solid: true }]);
    expect(propsFrom([{ rodzaj: 'poreczy' }], G)).toEqual([{ k: 'dipbars', x0: -EQUIP.dipLen / 2, x1: EQUIP.dipLen / 2, h: EQUIP.dipH, z: EQUIP.dipHalf }]); expect(propsFrom([{ rodzaj: 'poreczy', x0: 0, x1: 70, h: 100, z: 25 }], G)).toEqual([{ k: 'dipbars', x0: 0, x1: 70, h: 100, z: 25 }]);
    expect(contactsFrom([{ rodzaj: 'lina_pionowa' }])).toEqual([{ body: 'foot', equip: 'rope', tol: 3 }, { body: 'shank', equip: 'rope', tol: 3 }]);
  });
  test.each([...SLED_HOLD])('sanie: trzymanie „%s” — poprawna poza przechodzi, rysunek (podstawa, talerze, słupki) i właściwe sprawdzenie chwytu (macierz po SLED_HOLD)', trzymanie => {
    const d = trzymanie === 'slupki' ? SLEDPUSH() : SLEDROPE(); expect(texts(d)).toBe('');
    for (const v of ['side', 'front', 'top'] as View[]) expect(propShapes(keyframeFrame(d, 0.5).props, v).map(x => x.id)).toEqual(expect.arrayContaining(['sledBase', 'sledPost']));
    expect(propShapes(keyframeFrame(d, 0.5).props, 'side').map(x => x.id)).toContain('sledPlate'); const hold = holdChecks(keyframeFrame(d, 0.5)).map(h => h.name);
    expect(hold).toEqual(trzymanie === 'slupki' ? ['slupek/R', 'slupek/L'] : []); if (trzymanie === 'slupki') expect(texts(SLEDPUSH({ x: 33 }))).toMatch(/\[chwyt\] slupek\/R: dłoń [\d.]+ cm od chwytu \(dopuszczalne 1\.5\) w fazie u=.* — dłonie na słupkach sań: x = x słupków, z = ±25 cm/);
    else expect(equipColliders(keyframeFrame(d, 0).props).map(c => c.id)).toEqual(expect.arrayContaining(['sled', 'barSled', 'cable']));
  });
  test('lina pionowa: chwyt na osi liny ≤ 3 cm (inaczej „chwyt” lina/R z hintem); stopa i łydka mogą dociskać linę do 3 cm; ciało w linie głębiej odrzucane; szablon pull_up nie wymaga drążka przy linie', () => {
    expect(texts(ROPE())).toBe(''); expect(texts(ROPE({}, 5))).toMatch(/\[chwyt\] lina\/R: dłoń [\d.]+ cm od chwytu \(dopuszczalne 3\) w fazie u=.* — dłoń musi obejmować linę/);
    expect(holdChecks(keyframeFrame(ROPE(), 0)).map(h => [h.name, h.tol])).toEqual([['lina/R', 3], ['lina/L', 3]]); expect(texts(ROPE({ x: 0 }, 2))).toMatch(/\[chwyt\] lina/);
    const f = keyframeFrame(ROPE(), 0); const pen = (x: number) => checkFrame({ ...keyframeFrame(ROPE({ x }), 0), contacts: [] }).filter(i => i.code === 'pen').length; expect(pen(0)).toBeGreaterThan(0);
    const withContact = (x: number) => checkFrame(keyframeFrame(ROPE({ x }), 0)).filter(i => i.code === 'pen' && /(foot|shank)/.test(i.detail)).length; expect(withContact(20)).toBe(0); expect(f.props.some(p => p.k === 'rope')).toBe(true);
    expect(gearFieldIssues({ rodzaj: 'lina_pionowa', h: 50 })).toEqual(['sprzęt: góra liny h = 50 cm poza przedziałem 150–600 cm']); expect(gearFieldIssues({ rodzaj: 'lina_pionowa', y: 200 })).toEqual(['sprzęt: dół liny y = 200 cm poza przedziałem 0–150 cm']);
    expect(templateFor('pull_up').check!([{ rodzaj: 'podloga' }, { rodzaj: 'lina_pionowa' }])).toEqual([]); expect(templateFor('pull_up').check!([{ rodzaj: 'podloga' }]).length).toBe(1);
  });
  test('poręcze: chwyt na poręczy ≤ 1 cm (hint z rozstawem), kolider barDip, rysunek w trzech widokach; zawieszenie: taśma przez ciało odrzucona, kolejne pola', () => {
    expect(texts(DIP())).toBe(''); expect(texts(DIP({}, 25))).toMatch(/\[chwyt\] poreczy\/R: dłoń [\d.]+ cm od chwytu \(dopuszczalne 1\) w fazie u=.* — dłonie na poręczach: y = wysokość poręczy, z = ±22 cm/);
    const f = keyframeFrame(DIP(), 0); expect(equipColliders(f.props).filter(c => c.id === 'barDip').length).toBe(2); for (const v of ['side', 'front', 'top'] as View[]) expect(propShapes(f.props, v).map(x => x.id)).toContain('dipBar');
    expect(holdChecks(f).map(h => h.name)).toEqual(['poreczy/R', 'poreczy/L']);
    expect(gearFieldIssues({ rodzaj: 'poreczy', z: 5 })).toEqual(['sprzęt: rozstaw poręczy z = 5 cm poza przedziałem 15–40 cm']); expect(gearFieldIssues({ rodzaj: 'poreczy', h: 50 })).toEqual(['sprzęt: wysokość poręczy h = 50 cm poza przedziałem 80–160 cm']); expect(gearFieldIssues({ rodzaj: 'poreczy', x0: 0, x1: 10 })).toEqual(['sprzęt: poręcze krótsze niż 30 cm (x0 = 0, x1 = 10)']);
    expect(texts(SUSP())).toBe(''); expect(texts(SUSP({ x: 0, y: 150 }))).toMatch(/× cable: przenikanie/); expect(gearFieldIssues({ rodzaj: 'zawieszenie', y: 50 })).toEqual(['sprzęt: wysokość zaczepu taśm y = 50 cm poza przedziałem 100–350 cm']);
    expect(gearFieldIssues({ rodzaj: 'zawieszenie', punkt: 'miednica' })).toEqual(['sprzęt: taśmy do podwieszania mocujemy do dłoni albo kostek (punkt: "dlonie" lub "kostki")']); expect(gearFieldIssues({ rodzaj: 'sanie', dlugosc: 5 })).toEqual(['sprzęt: dlugosc podstawy sań = 5 cm poza przedziałem 30–120 cm']); expect(gearFieldIssues({ rodzaj: 'sanie', h: 10 })).toEqual(['sprzęt: wysokość słupków sań h = 10 cm poza przedziałem 40–160 cm']);
  });
  test('kamień atlas, beczka i worek: rysowane jak kula (możliwości katalogu pilka_lekarska, promień 6–20); wymagany sprzęt dla sled, suspension, climbing_rope, dip.bars', () => {
    expect(GEAR_KINDS.pilka_lekarska.caps).toEqual(['med_ball', 'atlas_stones', 'keg', 'sandbag']); for (const c of ['atlas_stones', 'keg', 'sandbag']) expect(requiredGearIssues([[c]], [{ rodzaj: 'pilka_lekarska', promien: 18 }])).toEqual([]);
    expect(requiredGearIssues([['atlas_stones']], [])).toEqual(['sprzęt: ćwiczenie wymaga: kamień atlas (rysowany jak kula — uproszczenie) (rodzaj „pilka_lekarska”), a sprzet[] tego nie zawiera']);
    expect(requiredGearIssues([['sled']], [])).toEqual(['sprzęt: ćwiczenie wymaga: sanie obciążeniowe (rodzaj „sanie”), a sprzet[] tego nie zawiera']); expect(requiredGearIssues([['suspension']], [])[0]).toContain('taśmy do podwieszania'); expect(requiredGearIssues([['climbing_rope']], [])[0]).toContain('lina pionowa'); expect(requiredGearIssues([['dip.bars']], [{ rodzaj: 'poreczy' }])).toEqual([]);
  });
  test('ślizgacze: krążki pod kostkami albo dłońmi tej strony (y = połowa grubości), rysunek w trzech widokach; kółko do brzucha: oś między dłońmi, toczy się po podłodze (± TOL.rail), kolider kulą i tolerancja kontaktu dłoni', () => {
    const A = { R: [5, 9, 9] as V3, L: [6, 9, -9] as V3 };
    expect(propsFrom([{ rodzaj: 'slizgacze' }], G, A)).toEqual([{ k: 'slider', c: [5, EQUIP.sliderH / 2, 9], r: EQUIP.sliderR }, { k: 'slider', c: [6, EQUIP.sliderH / 2, -9], r: EQUIP.sliderR }]);
    expect(propsFrom([{ rodzaj: 'slizgacze', punkt: 'dlonie', trzyma: 'L' }], G, A)).toEqual([{ k: 'slider', c: [14, EQUIP.sliderH / 2, -20], r: EQUIP.sliderR }]); expect(gearFieldIssues({ rodzaj: 'slizgacze', punkt: 'miednica' })).toEqual(['sprzęt: ślizgacze mocujemy pod stopami albo dłońmi (punkt: "kostki" lub "dlonie")']);
    for (const v of ['side', 'front', 'top'] as View[]) expect(propShapes(propsFrom([{ rodzaj: 'slizgacze' }], G, A), v).map(x => x.id)).toEqual(['slider', 'slider']); expect(equipColliders(propsFrom([{ rodzaj: 'slizgacze' }], G, A))).toEqual([]);
    expect(propsFrom([{ rodzaj: 'kolko' }], G)).toEqual([{ k: 'wheel', c: [12, 85, 0], r: EQUIP.wheelR }]); expect(propsFrom([{ rodzaj: 'kolko', promien: 6, trzyma: 'R' }], G)).toEqual([{ k: 'wheel', c: G.R, r: 6 }]);
    for (const v of ['side', 'front', 'top'] as View[]) expect(propShapes([{ k: 'wheel', c: [20, 8, 0], r: 8 }], v).map(x => x.id)).toContain('wheel'); expect(propShapes([{ k: 'wheel', c: [20, 8, 0], r: 8 }], 'side').map(x => x.id)).toContain('wheelHub');
    expect(equipColliders([{ k: 'wheel', c: [20, 8, 0], r: 8 }])).toEqual([{ k: 'capsule', id: 'wheel', a: [20, 8, 0], b: [20, 8, 0], r: 8 }]);
    const f = keyframeFrame(ROTATE([{ rodzaj: 'kolko' }]), 0); const on = checkFrame({ ...f, props: [{ k: 'wheel', c: [20, 8, 0], r: 8 }] }).filter(i => i.code === 'wheel'); expect(on).toEqual([]);
    const off = checkFrame({ ...f, props: [{ k: 'wheel', c: [20, 20, 0], r: 8 }] }).filter(i => i.code === 'wheel'); expect(off).toEqual([{ code: 'wheel', detail: 'kółko: oś na wysokości 20.0 cm, a kółko toczy się po podłodze (promień 8 cm; dopuszczalne ± 1.5)' }]);
    expect(texts(ROTATE([{ rodzaj: 'kolko' }]))).toMatch(/\[geometria\] kółko: oś na wysokości/); expect(gearFieldIssues({ rodzaj: 'kolko', promien: 30 })).toEqual(['sprzęt: promien kółka = 30 cm poza przedziałem 4–15 cm']);
    expect(requiredGearIssues([['sliders']], [])).toEqual(['sprzęt: ćwiczenie wymaga: ślizgacze (rodzaj „slizgacze”), a sprzet[] tego nie zawiera']); expect(requiredGearIssues([['ab_wheel']], [{ rodzaj: 'kolko' }])).toEqual([]);
  });
  test('skrzynia poza osią z: z przesuwa skrzynię, dwa = dwie symetrycznie (domyślnie ±EQUIP.boxSide); rysunek z przodu i z góry w miejscu z, kolider w z ± szerokość/2', () => {
    expect(propsFrom([{ rodzaj: 'skrzynia', x0: 0, x1: 40, top: 30 }], G)).toEqual([{ k: 'box', x0: 0, x1: 40, top: 30 }]); expect(propsFrom([{ rodzaj: 'skrzynia', z: 30 }], G)).toEqual([{ k: 'box', x0: 0, x1: 40, top: 40, z: 30 }]);
    expect(propsFrom([{ rodzaj: 'skrzynia', dwa: true }], G)).toEqual([{ k: 'box', x0: 0, x1: 40, top: 40, z: EQUIP.boxSide }, { k: 'box', x0: 0, x1: 40, top: 40, z: -EQUIP.boxSide }]); expect(propsFrom([{ rodzaj: 'skrzynia', dwa: true, z: -50 }], G).map(p => p.k === 'box' ? p.z : 0)).toEqual([50, -50]);
    const b = propsFrom([{ rodzaj: 'skrzynia', z: 30 }], G)[0]; const front = propShapes([b], 'front')[0]; if (front.k === 'poly') { const xs = front.pts.map(p => p[0]); expect([Math.min(...xs), Math.max(...xs)]).toEqual([-30 - EQUIP.boxW / 2, -30 + EQUIP.boxW / 2]); }
    const c = equipColliders([b])[0]; expect(c.k === 'prism' && [c.z0, c.z1]).toEqual([30 - EQUIP.boxW / 2, 30 + EQUIP.boxW / 2]); expect(equipColliders([{ k: 'box', x0: 0, x1: 10, top: 10 }])[0]).toMatchObject({ z0: -EQUIP.boxW / 2, z1: EQUIP.boxW / 2 });
    expect(propShapes([b], 'top')[0].k).toBe('poly');
  });
  test('platforma, pas, wałek, ławka do prostowania, kłoda, opona, młot, uprząż: rekwizyty i rysunek w trzech widokach', () => {
    const A = { R: [5, 20, 9] as V3, L: [6, 22, -9] as V3 }; const P: V3 = [10, 90, 0]; const one = (g: Partial<Gear> & { rodzaj: Gear['rodzaj'] }, a = A, h = G) => propsFrom([g as Gear], h, a, P);
    expect(one({ rodzaj: 'bosu', x: 5 })).toEqual([{ k: 'dome', c: [5, 0, 0], r: EQUIP.domeR }]); expect(one({ rodzaj: 'bosu', promien: 20, z: 3 })[0]).toMatchObject({ c: [0, 0, 3], r: 20 });
    expect(one({ rodzaj: 'pas' })).toEqual([{ k: 'chain', from: P, to: [10, 90 - EQUIP.beltLen, 0] }, { k: 'plate', c: [10, 90 - EQUIP.beltLen - EQUIP.beltPlateR, 0], r: EQUIP.beltPlateR, held: false }]);
    expect(propsFrom([{ rodzaj: 'sanie', x: 100 }, { rodzaj: 'pas' }], G, A, P).filter(p => p.k === 'cable')).toEqual([{ k: 'cable', from: [100 + EQUIP.sledLen, 15, 0], to: P, attach: 'strap', ends: [P], solid: true }]);
    const w = one({ rodzaj: 'walek_nadgarstkow', dlugosc: 40, promien: 8 }); expect(w.map(p => p.k)).toEqual(['barbell', 'chain', 'plate']); expect(w[0]).toMatchObject({ c: [12, 85, 0], plates: false, held: true, len: EQUIP.wristBar }); expect(w[1]).toMatchObject({ to: [12, 45, 0] }); expect(w[2]).toMatchObject({ c: [12, 37, 0], r: 8, held: false });
    expect(one({ rodzaj: 'rzymska', x: 10 })).toEqual([{ k: 'hyper', pad: [10, EQUIP.hyperTop], kat: EQUIP.hyperKat, len: EQUIP.hyperLen, roller: [10 + EQUIP.hyperRollerDx, EQUIP.hyperTop + EQUIP.hyperRollerDy] }]); expect((one({ rodzaj: 'rzymska', walki: false })[0] as Extract<Prop, { k: 'hyper' }>).roller).toBeUndefined(); expect(one({ rodzaj: 'rzymska', top: 80, kat: 30, dlugosc: 40, y: 40 })[0]).toMatchObject({ pad: [0, 80], kat: 30, roller: [40, 40] });
    expect(one({ rodzaj: 'kloda' })).toEqual([{ k: 'roll', c: [12, 85, 0], r: EQUIP.logR, len: EQUIP.logLen, held: true }]); expect(one({ rodzaj: 'kloda', przesuniecie: [0, 5, 0], promien: 10, dlugosc: 50 })[0]).toMatchObject({ c: [12, 90, 0], r: 10, len: 50 });
    expect(one({ rodzaj: 'opona', x: 40, z: 5 })).toEqual([{ k: 'roll', c: [40, EQUIP.tireR, 5], r: EQUIP.tireR, len: EQUIP.tireW }]);
    const m = one({ rodzaj: 'mlot', dlugosc: 80 })[0] as Extract<Prop, { k: 'hammer' }>; const dv = [G.L[0] - G.R[0], G.L[1] - G.R[1], G.L[2] - G.R[2]]; const dl = Math.hypot(...dv); expect(Math.hypot(...m.b.map((x, i) => x - m.a[i]))).toBeCloseTo(80, 6); expect(m.a[0]).toBeCloseTo(G.R[0] - 8 * dv[0] / dl, 6);
    expect((propsFrom([{ rodzaj: 'mlot' }], { R: [1, 2, 3], L: [1, 2, 3] })[0] as Extract<Prop, { k: 'hammer' }>).b[1]).toBeGreaterThan(80); /* dłonie w jednym punkcie: trzonek pionowo */
    expect(one({ rodzaj: 'uprzaz_szyja' })).toEqual([{ k: 'neckload', len: EQUIP.beltLen, r: EQUIP.beltPlateR }]);
    const all: Prop[] = [{ k: 'dome', c: [0, 0, 0], r: 30 }, { k: 'hyper', pad: [0, 75], kat: 45, len: 30, roller: [55, 30] }, { k: 'hammer', a: [0, 50, 0], b: [0, 140, 0] }, { k: 'roll', c: [0, 15, 0], r: 15, len: 60, held: true }];
    for (const v of ['side', 'front', 'top'] as View[]) expect(propShapes(all, v).map(x => x.id)).toEqual(expect.arrayContaining(['dome', 'hyperPad', 'hyperRoller', 'hammerHandle', 'hammerHead', 'roll'])); expect(propShapes(all, 'side').map(x => x.id)).toContain('hyperLeg');
  });
  test('ławka do prostowania: podpórka opada ku stopom (hyperPolys), kolidery podpórki i wałka, kontakty 3 cm; reszta nowych kolidererów: platforma = gymBall, młot = barHammer, kłoda = barLog', () => {
    const hp = hyperPolys({ k: 'hyper', pad: [0, 75], kat: 45, len: 30 }); expect(hp.pad.length).toBe(4); expect(hp.pad[1][1]).toBeLessThan(hp.pad[0][1]); expect(hp.pad[1][0]).toBeGreaterThan(hp.pad[0][0]); expect(hp.pad[2][1]).toBeLessThan(hp.pad[1][1]);
    const eq = equipColliders([{ k: 'hyper', pad: [0, 75], kat: 45, len: 30, roller: [55, 30] }, { k: 'dome', c: [100, 0, 0], r: 30 }, { k: 'hammer', a: [0, 0, 0], b: [0, 90, 0] }, { k: 'roll', c: [0, 15, 0], r: 15, len: 60, held: true }]);
    expect(eq.map(c => c.id)).toEqual(['hyperPad', 'hyperRoller', 'gymBall', 'barHammer', 'barLog']); expect(contactsFrom([{ rodzaj: 'rzymska' }]).length).toBe(5); expect(contactsFrom([{ rodzaj: 'bosu' }, { rodzaj: 'kloda' }, { rodzaj: 'opona' }]).map(c => c.equip)).toEqual(['gymBall', 'barLog', 'barLog', 'roll']);
  });
  test('kłoda: dłonie w ≤ promień + 3 cm od osi (hint), tolerancja kontaktu przedramienia rośnie z promieniem; uprząż na szyję: łańcuch i talerz pod głową po rozwiązaniu ze szkieletu; pas: talerz między nogami przenika; wałek: drążek w dłoniach', () => {
    const f = keyframeFrame(pose('strongman', 'Log Lift', [{ rodzaj: 'kloda', promien: 8 }], [two(0, ...sym(30, 110, 12)), two(1, ...sym(30, 125, 12))]), 0); const far = { ...f, props: [{ k: 'roll', c: [30, 110, 40], r: 8, len: 60, held: true } as Prop] }; expect(holdChecks(far).map(h => h.name)).toEqual(['kloda/R', 'kloda/L']); expect(holdChecks(f).every(h => h.err <= h.tol)).toBe(true);
    expect(checkFrame(far).find(i => i.code === 'grip')?.hint).toContain('promień + 3 cm');
    const n = keyframeFrame(BENTNECK(), 0); expect(n.props.some(p => p.k === 'neckload')).toBe(false); const ch = n.props.find(p => p.k === 'chain') as Extract<Prop, { k: 'chain' }>; const pl = n.props.find(p => p.k === 'plate') as Extract<Prop, { k: 'plate' }>; expect(ch.from).toEqual(n.sk.head); expect(ch.to[1]).toBeCloseTo(n.sk.head[1] - 15, 9); expect(pl.c[1]).toBeCloseTo(n.sk.head[1] - 25, 9); expect(pl.held).toBe(false);
    expect(texts({ ...ROTATE([{ rodzaj: 'pas' }]) })).toMatch(/× plate: przenikanie/); expect(holdChecks(keyframeFrame(pose('forearm', 'Wrist Roller', [{ rodzaj: 'walek_nadgarstkow' }], [two(0, ...sym(30, 125, 10)), two(1, ...sym(30, 110, 10))]), 0)).map(h => h.name)).toEqual(['gryf/R', 'gryf/L']);
    expect(requiredGearIssues([['dip_belt'], ['plate']], [{ rodzaj: 'pas' }])).toEqual([]); expect(requiredGearIssues([['plate']], [{ rodzaj: 'talerz' }])).toEqual([]);
    for (const [cap, rodzaj] of [['tire', 'opona'], ['log_bar', 'kloda'], ['sledgehammer', 'mlot'], ['neck_harness', 'uprzaz_szyja'], ['wrist_roller', 'walek_nadgarstkow'], ['hyperext_bench', 'rzymska'], ['ghd', 'rzymska'], ['glute_ham_raise', 'rzymska'], ['reverse_hyper', 'rzymska'], ['bosu', 'bosu'], ['rickshaw', 'gryf_szesciokatny'], ['yoke', 'sztanga']] as const) { expect([cap, requiredGearIssues([[cap]], [{ rodzaj }])]).toEqual([cap, []]); expect([cap, requiredGearIssues([[cap]], []).length]).toEqual([cap, 1]); }
  });
  test('pola nowych rodzajów: zakresy i komunikaty', () => {
    expect(gearFieldIssues({ rodzaj: 'bosu', promien: 5 })).toEqual(['sprzęt: promien platformy = 5 cm poza przedziałem 15–45 cm']); expect(gearFieldIssues({ rodzaj: 'pas', dlugosc: 5 })).toEqual(['sprzęt: dlugosc łańcucha pasa = 5 cm poza przedziałem 15–80 cm']); expect(gearFieldIssues({ rodzaj: 'pas', promien: 40 })).toEqual(['sprzęt: promien talerza pasa = 40 cm poza przedziałem 8–25 cm']);
    expect(gearFieldIssues({ rodzaj: 'walek_nadgarstkow', dlugosc: 5 })).toEqual(['sprzęt: dlugosc liny wałka = 5 cm poza przedziałem 20–150 cm']); expect(gearFieldIssues({ rodzaj: 'walek_nadgarstkow', promien: 1 })).toEqual(['sprzęt: promien talerza wałka = 1 cm poza przedziałem 5–20 cm']);
    expect(gearFieldIssues({ rodzaj: 'rzymska', kat: 80 })).toEqual(['sprzęt: kąt podpórki kat = 80° poza przedziałem 0–70°']); expect(gearFieldIssues({ rodzaj: 'rzymska', top: 10 })).toEqual(['sprzęt: wysokość podpórki top = 10 cm poza przedziałem 40–120 cm']); expect(gearFieldIssues({ rodzaj: 'rzymska', dlugosc: 10 })).toEqual(['sprzęt: dlugosc (odległość wałków od podpórki) = 10 cm poza przedziałem 30–100 cm']);
    expect(gearFieldIssues({ rodzaj: 'kloda', promien: 2 })).toEqual(['sprzęt: promien kłody = 2 cm poza przedziałem 8–25 cm']); expect(gearFieldIssues({ rodzaj: 'kloda', dlugosc: 5 })).toEqual(['sprzęt: dlugosc kłody = 5 cm poza przedziałem 30–100 cm']);
    expect(gearFieldIssues({ rodzaj: 'opona', promien: 10 })).toEqual(['sprzęt: promien opony = 10 cm poza przedziałem 40–90 cm']); expect(gearFieldIssues({ rodzaj: 'opona', dlugosc: 5 })).toEqual(['sprzęt: dlugosc (szerokość) opony = 5 cm poza przedziałem 15–40 cm']);
    expect(gearFieldIssues({ rodzaj: 'mlot', dlugosc: 10 })).toEqual(['sprzęt: dlugosc młota = 10 cm poza przedziałem 50–120 cm']); expect(gearFieldIssues({ rodzaj: 'uprzaz_szyja', dlugosc: 5 })).toEqual(['sprzęt: dlugosc łańcucha uprzęży = 5 cm poza przedziałem 15–80 cm']); expect(gearFieldIssues({ rodzaj: 'uprzaz_szyja', promien: 40 })).toEqual(['sprzęt: promien talerza uprzęży = 40 cm poza przedziałem 8–25 cm']);
  });
  test('stary sprzęt bez zmian: sztanga podąża za chwytem, słupek, podłoga, skrzynia', () => {
    expect(propsFrom([{ rodzaj: 'sztanga', podazaZaChwytem: true }, { rodzaj: 'slupek', x: 5, h: 100 }, { rodzaj: 'skrzynia', x0: 1, x1: 2, top: 30 }, { rodzaj: 'podloga' }], G).map(p => p.k)).toEqual(['barbell', 'post', 'box', 'floor']);
  });
});

describe('resolveBells: dzwon kettlebell wzdłuż przedramienia (ze szkieletu)', () => {
  const frameWith = (grips: [V3, V3]): Frame => keyframeFrame({ ...SWING({ rodzaj: 'kettlebell', dzwon: 'wzdluz' }), klatki: [two(0, ...grips), two(1, ...grips)] }, 0);
  const dirOf = (f: Frame): V3 => (f.props.find(p => p.k === 'kettlebell') as Extract<Prop, { k: 'kettlebell' }>).dir as V3;
  test('przedramię w dół → dzwon w dół; przedramię w przód → dzwon w przód; przedramię w górę → dzwon za przedramieniem (−x, w dół); wersor jednostkowy', () => {
    const down = dirOf(frameWith(sym(18, 82, 3))); expect(down[1]).toBeLessThan(-0.5);
    const fwd = dirOf(frameWith(sym(50, 128, 3))); expect(fwd[0]).toBeGreaterThan(0.8);
    const up = dirOf(frameWith(sym(20, 150, 4))); expect(up[0]).toBeLessThan(-0.3); expect(up[1]).toBeLessThan(0);
    for (const d of [down, fwd, up]) expect(Math.hypot(...d)).toBeCloseTo(1, 6);
  });
  test('klatka bez dzwonu „wzdluz” zwracana bez zmian (ta sama referencja)', () => {
    const f = keyframeFrame(SWING({ rodzaj: 'kettlebell' }), 0); expect(resolveBells(f)).toBe(f);
  });
});

describe('rysunek: trzy widoki, cztery motywy, role z palety', () => {
  const props: Prop[] = [{ k: 'dumbbell', c: [10, 80, 20], side: 'R', held: true }, { k: 'kettlebell', c: [10, 80, 0], side: 'C', dir: [0, -1, 0] }, { k: 'plate', c: [20, 110, 0], r: 22.5, held: true }, { k: 'ball', c: [20, 110, 0], r: 11, held: true }];
  const themes = { jasny: light, ciemny: dark, 'jasny + HC': lightHC, 'ciemny + HC': darkHC };
  test.each(Object.entries(themes))('motyw %s: talerz i piłka mają kształty w każdym widoku, kolory z palety (bez kolorów na sztywno), dokument SVG poprawny', (_n, th) => {
    const pal = figurePalette(th);
    for (const v of ['side', 'front', 'top'] as View[]) {
      const sh = propShapes(props, v); const ids = sh.map(s => s.id);
      expect(ids).toEqual(expect.arrayContaining(['plateHeld', 'ball', 'ballSeam', 'kb', 'kbHandle']));
      const svg = svgDocument(sh, boundsOf([sh]), pal); expect(svg).toContain(pal.plate); expect(svg).toContain(pal.load); expect(svg).toMatch(/^<svg[\s\S]*<\/svg>$/);
    }
  });
  test('talerz: z boku cienki pas (grubość plateW), z przodu koło o promieniu talerza z piastą, z góry pas o szerokości średnicy', () => {
    const side = propShapes([props[2]], 'side')[0]; expect(side.k).toBe('poly'); if (side.k === 'poly') { const xs = side.pts.map(p => p[0]); expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(EQUIP.plateW, 6); const ys = side.pts.map(p => p[1]); expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(45, 6); }
    const front = propShapes([props[2]], 'front'); expect(front.find(s => s.id === 'plateHeld')).toMatchObject({ k: 'circle', r: 22.5 }); expect(front.map(s => s.id)).toContain('plateHub');
    const top = propShapes([props[2]], 'top')[0]; if (top.k === 'poly') { const xs = top.pts.map(p => p[0]); expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(45, 6); }
  });
  test('piłka: koło o promieniu r i dwa szwy; domyślny promień z EQUIP; kettlebell: dzwon i rączka przesunięte wzdłuż dir', () => {
    expect(propShapes([{ k: 'ball', c: [0, 50, 0] }], 'side').find(s => s.id === 'ball')).toMatchObject({ k: 'circle', r: EQUIP.medBallR });
    expect(propShapes([{ k: 'ball', c: [0, 50, 0], r: 15 }], 'side').filter(s => s.id === 'ballSeam').length).toBe(2);
    const kb = propShapes([{ k: 'kettlebell', c: [0, 80, 0], dir: [1, 0, 0] }], 'side'); const bell = kb.find(s => s.id === 'kb'); if (bell?.k === 'circle') expect(bell.c[0]).toBeCloseTo(EQUIP.kbBallR + 2, 6);
    const dflt = propShapes([{ k: 'kettlebell', c: [0, 80, 0] }], 'side').find(s => s.id === 'kb'); if (dflt?.k === 'circle') expect(dflt.c[1]).toBeCloseTo(80 - EQUIP.kbBallR - 2, 6);
  });
  test('dataShapes: poza z nowym sprzętem daje kształty sprzętu w widoku z boku, z przodu i z góry', () => {
    for (const [, d] of MATRIX) for (const v of ['side', 'front', 'top'] as View[]) expect(dataShapes(d, 0.5, v).length).toBeGreaterThan(20);
  });
});

describe('kolidery i kontrola chwytu', () => {
  test('talerz: 16 odcinków obręczy i 4 średnice (kapsuły grubości plateW); piłka: jedna kapsuła o promieniu piłki; dzwon: w kierunku dir', () => {
    const pc = plateColliders({ k: 'plate', c: [0, 100, 0] }); expect(pc.length).toBe(20); for (const c of pc) expect(c).toMatchObject({ k: 'capsule', id: 'plate', r: EQUIP.plateW / 2 });
    const all = equipColliders([{ k: 'plate', c: [5, 100, 0], r: 10 }, { k: 'ball', c: [0, 50, 0] }, { k: 'kettlebell', c: [0, 80, 0], r: 9.5, dir: [1, 0, 0] }]);
    expect(all.filter(c => c.id === 'plate').length).toBe(20); expect(all.find(c => c.id === 'ball')).toMatchObject({ r: EQUIP.medBallR, a: [0, 50, 0] });
    expect(all.find(c => c.id === 'kb')).toMatchObject({ a: [12, 80, 0], r: 9.5 });
    expect(equipColliders([{ k: 'kettlebell', c: [0, 80, 0] }])[0]).toMatchObject({ a: [0, 68, 0], r: EQUIP.kbBallR }); /* dzwon w dół: jak dotychczas */
  });
  test('distToRingYZ: punkt na okręgu 0, w środku r, przed płaszczyzną talerza = odległość w x', () => {
    expect(distToRingYZ([0, 110, 22.5], [0, 110, 0], 22.5)).toBeCloseTo(0, 9); expect(distToRingYZ([0, 110, 0], [0, 110, 0], 22.5)).toBeCloseTo(22.5, 9); expect(distToRingYZ([4, 110, 22.5], [0, 110, 0], 22.5)).toBeCloseTo(4, 9);
    expect(HOLD).toEqual({ plateRim: 3, ballSurface: 3 });
  });
  const hold = (d: PoseData, u = 0) => holdChecks(keyframeFrame(d, u));
  test('holdChecks: dłonie na obręczy talerza i na powierzchni piłki dają błąd ≈ 0; nazwy talerz/R, pilka/L; hint opisuje naprawę', () => {
    const p = hold(PLATE({ rodzaj: 'talerz' })); expect(p.map(h => h.name)).toEqual(['talerz/R', 'talerz/L']); for (const h of p) { expect(h.err).toBeLessThan(HOLD.plateRim); expect(h.hint).toContain('obręczy'); }
    const b = hold(BALL({ rodzaj: 'pilka_lekarska' })); expect(b.map(h => h.name)).toEqual(['pilka/R', 'pilka/L']); for (const h of b) { expect(h.err).toBeLessThan(HOLD.ballSurface); expect(h.hint).toContain('powierzchni'); }
    expect(hold(PLATE({ rodzaj: 'talerz', trzyma: 'R' })).map(h => h.name)).toEqual(['talerz/R']);
  });
  test('checkFrame: ręce za blisko środka piłki → „grip” z hintem; piłka i talerz pod podłogą → „floor”; piłka w tułowiu → „pen”', () => {
    const near = BALL({ rodzaj: 'pilka_lekarska' }); near.klatki[0].rece.R.chwyt = [25, 120, 4]; const g = checkFrame(keyframeFrame(near, 0)).find(i => i.code === 'grip'); expect(g?.hint).toContain('powierzchni piłki'); expect(g?.detail).toMatch(/pilka\/R: dłoń \d+\.\d+ cm od chwytu \(dopuszczalne 3\)/);
    const low = checkFrame({ ...keyframeFrame(BALL({ rodzaj: 'pilka_lekarska' }), 0), props: [{ k: 'ball', c: [25, 5, 0], r: 11 }, { k: 'plate', c: [25, 20, 0], r: 22.5 }] }); expect(low.filter(i => i.code === 'floor').map(i => i.detail.split(' ')[0])).toEqual(['ball', 'plate']);
    const f = keyframeFrame(BALL({ rodzaj: 'pilka_lekarska' }), 0); const inside = checkFrame({ ...f, props: [{ k: 'ball', c: [3, 120, 0], r: 11, held: false }] }); expect(inside.some(i => i.code === 'pen' && /torso × gymBall/.test(i.detail))).toBe(true); /* held: false = piłka leżąca (id gymBall) */
    const held = checkFrame({ ...f, props: [{ k: 'ball', c: [3, 120, 0], r: 11 }] }); expect(held.some(i => i.code === 'pen' && /torso × ball/.test(i.detail))).toBe(true);
  });
  test('przedramię trzymające talerz i piłkę ma tolerancję kontaktu (jak sztanga i hantel)', () => {
    for (const [, d] of MATRIX.filter(([n]) => /talerz|piłka/.test(n))) expect(checkFrame(keyframeFrame(d, 0.5)).filter(i => i.code === 'pen')).toEqual([]);
  });
  test('smith: sztanga poza osią prowadnicy → „geometria” z liczbami (x sztangi, x prowadnicy, różnica); sztanga porusza się tylko w pionie', () => {
    expect(texts(SMITH([{ rodzaj: 'smith', x: 25, h: 200 }]))).toMatch(/\[geometria\] sztanga × prowadnica: x sztangi 15\.0 cm, x prowadnicy 25\.0 cm \(różnica 10\.0 cm, dopuszczalne 1\.5\) w fazie u=0\.00/);
    const f = keyframeFrame(SMITH([{ rodzaj: 'smith', x: 16, h: 200 }]), 0); expect(checkFrame(f).filter(i => i.code === 'rail')).toEqual([]); expect(TOL.rail).toBe(1.5);
    const g = keyframeFrame(SMITH([{ rodzaj: 'smith', x: 17, h: 200 }]), 0); expect(checkFrame(g).filter(i => i.code === 'rail').length).toBe(1);
  });
  test('smith: zestaw sprzętu — wymaga sztangi i dokładnie jednej prowadnicy (komunikaty „sprzet”)', () => {
    expect(gearSetIssues([{ rodzaj: 'smith' }])).toEqual(['sprzęt: smith wymaga wpisu sztanga (talerze: true, podazaZaChwytem: true) — sztanga porusza się po prowadnicy']);
    expect(gearSetIssues([{ rodzaj: 'smith' }, { rodzaj: 'smith' }, { rodzaj: 'sztanga' }])).toEqual(['sprzęt: dokładnie jedna prowadnica smith']); expect(gearSetIssues([{ rodzaj: 'smith' }, { rodzaj: 'sztanga' }])).toEqual([]);
    expect(texts({ ...SMITH([{ rodzaj: 'smith', x: 15 }]), sprzet: [{ rodzaj: 'podloga' }, { rodzaj: 'smith', x: 15 }] })).toContain('smith wymaga wpisu sztanga');
  });
  test('landmine: gryf sztywny — odległość dłoni od osi obrotu ≠ długość gryfu → „geometria” z liczbami; kolider gryfu ma id barPivot (jak sztanga: przedramię z tolerancją kontaktu)', () => {
    expect(texts(LANDMINE({ rodzaj: 'landmine', x: 178 }, 150))).toMatch(/\[geometria\] landmine: dłonie \d+\.\d cm od osi obrotu, a gryf ma 200 cm \(dopuszczalne ± 3\) w fazie u=0\.00/);
    expect(texts(LANDMINE({ rodzaj: 'landmine', x: 178, dlugosc: 150 }))).toMatch(/gryf ma 150 cm/);
    const f = keyframeFrame(LANDMINE({ rodzaj: 'landmine', x: 178 }), 0.5); expect(checkFrame(f).filter(i => i.code === 'pivot')).toEqual([]); expect(TOL.pivot).toBe(3);
    const eq = equipColliders(f.props); expect(eq).toEqual([{ k: 'capsule', id: 'barPivot', a: [178, 5, 0], b: expect.any(Array), r: EQUIP.landmineR }]);
    const pv = f.props.find(p => p.k === 'pivot') as Extract<Prop, { k: 'pivot' }>; const cap = eq[0] as Extract<typeof eq[number], { k: 'capsule' }>; expect(Math.hypot(...cap.b.map((x, i) => x - pv.to[i]))).toBeCloseTo(EQUIP.landmineHand, 6); /* dłonie na końcu: bez kolidera */
    expect(equipColliders([{ k: 'pivot', from: [0, 5, 0], to: [100, 100, 0] }])).toEqual([]); /* pivot z rigu gotowej rodziny (bez len): jak dotychczas bez kolidera */
    expect(checkFrame(f).filter(i => i.code === 'pen')).toEqual([]); /* gryf w dłoniach: kontakt dozwolony */
  });
  test('landmine: łuk dłoni — klatki co ≤ ok. 30 cm drogi (interpolacja liniowa skraca łuk o < 3 cm); za rzadkie klatki odrzucone', () => {
    expect(texts(LANDMINE({ rodzaj: 'landmine', x: 178 }, 178, [22, 46]))).toBe(''); /* 24 cm drogi: sagitta ≈ 0,4 cm */
    expect(texts(LANDMINE({ rodzaj: 'landmine', x: 178 }, 178, [0, 120]))).toMatch(/landmine: dłonie/);
  });
  test('ściana: rysunek (z boku pas po właściwej stronie x; z przodu ściana przed osobą nie jest rysowana) i kolider po właściwej stronie x', () => {
    const rect = (pr: Prop, v: View) => { const sh = propShapes([pr], v)[0]; return sh && sh.k === 'poly' ? [Math.min(...sh.pts.map(p => p[0])), Math.max(...sh.pts.map(p => p[0]))] : null; };
    expect(rect({ k: 'wall', x: 40, h: 200 }, 'side')).toEqual([40 - EQUIP.wallW, 40]); expect(rect({ k: 'wall', x: 40, h: 200, front: true }, 'side')).toEqual([40, 40 + EQUIP.wallW]);
    expect(propShapes([{ k: 'wall', x: 40, h: 200, front: true }], 'front')).toEqual([]); expect(propShapes([{ k: 'wall', x: 40, h: 200 }], 'front').length).toBe(1);
    const c = (pr: Prop) => equipColliders([pr])[0]; const xs = (pr: Prop) => { const q = c(pr); return q.k === 'prism' ? [Math.min(...q.poly.map(p => p[0])), Math.max(...q.poly.map(p => p[0]))] : []; };
    expect(xs({ k: 'wall', x: 40, h: 200 })).toEqual([40 - EQUIP.wallW, 40]); expect(xs({ k: 'wall', x: 40, h: 200, front: true })).toEqual([40, 40 + EQUIP.wallW]);
  });
  test('ściana: ciało dotykające ściany (tułów, miednica) w tolerancji kontaktu OK, głębsze przenikanie odrzucone; bez deklaracji kontaktu (sztanga) obowiązuje 0,3 cm', () => {
    const base = WALLPOSE({ rodzaj: 'sciana', x: -8.5 }, [0, 76, 27], [0, 76, 27]); const f = keyframeFrame(base, 0); expect(checkFrame(f).filter(i => /torso|pelvis|head/.test(i.detail))).toEqual([]);
    const deep = checkFrame(keyframeFrame(WALLPOSE({ rodzaj: 'sciana', x: -5 }), 0)).filter(i => i.code === 'pen'); expect(deep.map(i => i.detail).join(' ')).toMatch(/torso × wall: przenikanie 4\.\d+ cm \(dopuszczalne 1\.5\)/);
    const strict = checkFrame({ ...f, contacts: [] }).filter(i => i.code === 'pen'); expect(strict.length).toBeGreaterThan(0);
  });
  test('gryf sześciokątny: dłoń poza uchwytem → „chwyt” uchwyt/R z hintem (z = ±29); trapbar w klatce ma uchwyty w z = ±EQUIP.trapW', () => {
    const d = TRAP(); d.klatki[1].rece.R.chwyt = [10, 74, 22]; expect(texts(d)).toMatch(/\[chwyt\] uchwyt\/R: dłoń \d+\.\d+ cm od chwytu \(dopuszczalne 0\.6\) w fazie u=.* — dłonie na uchwytach gryfu sześciokątnego: z = ±29 cm/);
    expect(holdChecks(keyframeFrame(TRAP(), 0)).map(h => [h.name, h.err < 0.6])).toEqual([['uchwyt/R', true], ['uchwyt/L', true]]);
  });
  test('uchwyty farmerskie: hantel z promieniem 12 — tolerancja kontaktu przedramienia rośnie z promieniem (r + 6); hantel domyślny 12', () => {
    const f = keyframeFrame(pose('carry', 'Farmer', [{ rodzaj: 'hantel', promien: 12 }], [two(0, ...sym(0, 77, 30)), two(1, ...sym(20, 125, 22))]), 0); expect(checkFrame(f).filter(i => i.code === 'pen')).toEqual([]);
    expect(gearFieldIssues({ rodzaj: 'hantel', promien: 12 })).toEqual([]);
  });
  test('wyciąg: rysunek — kolumna, bloczek, linka i osprzęt w trzech widokach; kolizje: kolumna i linka tylko z danych kontraktu (solid), ostatnie EQUIP.cableEnd cm linki bez kolidera', () => {
    const base: Prop[] = [{ k: 'tower', x: 45, z: 0, h: 230 }, { k: 'cable', from: [45, 220, 0], to: [20, 120, 0], ends: [[20, 120, 8], [20, 120, -8]] }];
    for (const v of ['side', 'front', 'top'] as View[]) expect(propShapes(base, v).map(x => x.id)).toEqual(expect.arrayContaining(['tower', 'cable', 'pulley']));
    const ids = (attach: 'handle' | 'rope' | 'bar' | 'strap', v: View = 'side') => propShapes([{ k: 'cable', from: [45, 220, 0], to: [20, 120, 0], attach, ends: [[20, 120, 8], [20, 120, -8]] }], v).map(x => x.id);
    expect(ids('handle')).toEqual(expect.arrayContaining(['cableHandle'])); expect(ids('rope')).toEqual(expect.arrayContaining(['cableRope', 'cableHandle'])); expect(ids('bar', 'front')).toContain('cableBar'); expect(ids('strap')).toContain('cableStrap');
    expect(equipColliders(base)).toEqual([]); /* rig gotowej rodziny: linka i kolumna bez kolidera */
    const sol = equipColliders([{ ...base[0], solid: true } as Prop, { ...base[1], solid: true } as Prop]); expect(sol.map(c => c.id)).toEqual(['tower', 'cable']);
    const cab = sol[1] as Extract<typeof sol[number], { k: 'capsule' }>; expect(Math.hypot(...cab.b.map((x, i) => x - [20, 120, 0][i]))).toBeCloseTo(EQUIP.cableEnd, 6); expect(cab.r).toBe(EQUIP.cableR);
    const twr = sol[0]; expect(twr.k === 'prism' && [twr.z0, twr.z1]).toEqual([-EQUIP.towerW / 2, EQUIP.towerW / 2]);
  });
  test.each([...CABLE_ATTACH])('wyciąg: osprzęt „%s” — rekwizyt linki ma właściwy typ osprzętu i rysunek (macierz po CABLE_ATTACH)', chwyt => {
    const A = { R: [5, 20, 9] as V3, L: [6, 22, -9] as V3 }; const G2 = { R: [10, 80, 20] as V3, L: [14, 90, -20] as V3 };
    const cab = propsFrom([{ rodzaj: 'wyciag', y: 20, chwyt, trzyma: 'R' }], G2, A).find(p => p.k === 'cable') as Extract<Prop, { k: 'cable' }>;
    expect(cab.attach).toBe({ uchwyt: 'handle', lina: 'rope', drazek: 'bar', kostka: 'strap' }[chwyt]); expect(cab.to).toEqual(chwyt === 'kostka' ? A.R : G2.R);
    const ids = propShapes([cab], 'side').map(x => x.id); expect(ids).toContain({ uchwyt: 'cableHandle', lina: 'cableRope', drazek: 'cableBar', kostka: 'cableStrap' }[chwyt]);
  });
  test('wyciąg: kolumna w ciele i linka przez tułów → „geometria” z nazwami (tower, cable); poprawna ustawiona z przodu osoby przechodzi', () => {
    expect(texts(PUSHDOWN({ rodzaj: 'wyciag', x: 0, y: 220 }))).toMatch(/torso × tower: przenikanie/);
    expect(texts(PUSHDOWN({ rodzaj: 'wyciag', x: -30, y: 220 }))).toMatch(/torso × cable: przenikanie/); /* kolumna za plecami: linka do dłoni przed tułowiem przechodzi przez tułów */
    expect(texts(PUSHDOWN({ rodzaj: 'wyciag', x: 45, y: 220 }))).toBe('');
  });
  test('wyciąg: pola — wysokość bloczka i kolumny, opaska bez wskazania nogi, pole z nie dla innych rodzajów', () => {
    expect(gearFieldIssues({ rodzaj: 'wyciag', y: 300 })).toEqual(['sprzęt: wysokość bloczka y = 300 cm poza przedziałem 5–240 cm']); expect(gearFieldIssues({ rodzaj: 'wyciag', y: 200, h: 150 })).toEqual(['sprzęt: kolumna wyciągu h = 150 cm niższa niż bloczek (y = 200 cm)']);
    expect(gearFieldIssues({ rodzaj: 'wyciag', chwyt: 'kostka' })).toEqual(['sprzęt: opaska na kostkę (chwyt: "kostka") jednego wyciągu wymaga trzyma: "R" albo "L" (kostka tej nogi)']); expect(gearFieldIssues({ rodzaj: 'wyciag', chwyt: 'kostka', trzyma: 'R' })).toEqual([]); expect(gearFieldIssues({ rodzaj: 'wyciag', chwyt: 'kostka', dwa: true })).toEqual([]);
    expect(gearFieldIssues({ rodzaj: 'hantel', dwa: true })).toEqual(['sprzęt: pole „dwa” nie dotyczy rodzaju „hantel” (dla tego rodzaju: promien, pionowo)']); expect(gearFieldIssues({ rodzaj: 'smith', chwyt: 'lina' })[0]).toContain('pole „chwyt” nie dotyczy rodzaju „smith”');
  });
  test('stojak: słupki w z = ±64 poza zasięgiem ciała — poza przechodzi niezależnie od x słupka; kolider słupka to dwa graniastosłupy (z = ±64)', () => {
    for (const x of [-45, 0, 15]) expect(texts(RACKPULL([{ rodzaj: 'slupek', x, h: 200 }]))).toBe('');
    const posts = equipColliders(propsFrom([{ rodzaj: 'slupek', x: 0, h: 200 }], { R: [0, 0, 0], L: [0, 0, 0] })); expect(posts.map(c => c.id)).toEqual(['post', 'post']); expect(posts.map(c => c.k === 'prism' ? (c.z0 + c.z1) / 2 : 0)).toEqual([-EQUIP.postSpan, EQUIP.postSpan]);
  });
  test('ciało i sprzęt z kolizjami: bodyColliders × talerz — udo w płaszczyźnie talerza wykrywa przenikanie', () => {
    const sk = solveSkeleton(keyframeFrame(PLATE({ rodzaj: 'talerz' }), 0).pose!); const eq = equipColliders([{ k: 'plate', c: [sk.legs.R.knee[0], sk.legs.R.knee[1], sk.legs.R.knee[2]], r: 22.5 }]);
    expect(Math.min(...bodyColliders(sk).flatMap(b => eq.map(e => gap(b, e))))).toBeLessThan(0);
  });
});

describe('walidator pozy z nowym sprzętem — macierz rodzaj × wariant', () => {
  test.each(MATRIX)('%s: poza przechodzi walidację (geometria, zakresy, ciągłość, chwyt)', (_n, d) => { expect(texts(d)).toBe(''); });
  test('poza z hantlem pionowo: dłonie > 13 cm od siebie → chwyt hantla (tolerancja 6,5 cm od środka)', () => {
    const d = GOBLET({ rodzaj: 'hantel', pionowo: true }); d.klatki[0].rece.R.chwyt = [17, 125, 12]; d.klatki[0].rece.L.chwyt = [17, 125, -12]; expect(texts(d)).toMatch(/\[chwyt\].*hantel\/R: dłoń/);
  });
  test('dłoń poza obręczą talerza → „chwyt” z talerz/R i wskazówką naprawy; poprawne w innej fazie nie maskuje', () => {
    const d = PLATE({ rodzaj: 'talerz' }); d.klatki[1].rece.R.chwyt = [30, 135, 12]; const t = texts(d); expect(t).toMatch(/\[chwyt\] talerz\/R: dłoń \d+\.\d+ cm od chwytu \(dopuszczalne 3\) w fazie u=\d\.\d\d — dłoń musi leżeć na obręczy talerza/);
  });
  test('dłoń poza powierzchnią piłki → „chwyt” pilka/R z hintem', () => {
    const d = BALL({ rodzaj: 'pilka_lekarska' }); d.klatki[0].rece.R.chwyt = [25, 120, 20]; expect(texts(d)).toMatch(/\[chwyt\] pilka\/R: dłoń .* na powierzchni piłki/);
  });
  test('piłka w udach i hantel w udzie → „geometria” z przenikaniem (nazwa kolidera i sprzętu)', () => {
    const ball = pose('sled_throw', 'Chest Pass', [{ rodzaj: 'pilka_lekarska' }], [two(0, ...sym(0, 76, 11)), two(1, ...sym(45, 125, 11))]); expect(texts(ball)).toMatch(/\[geometria\] thighR × ball: przenikanie/);
    const thigh = CURL({ rodzaj: 'hantel' }); thigh.klatki[0].rece.R.chwyt = [0, 76, 20]; thigh.klatki[0].rece.L.chwyt = [0, 76, -20]; expect(texts(thigh)).toMatch(/thighR × dbR: przenikanie/);
  });
  test('pola sprzętu: nieznany rodzaj i pole nie dla rodzaju odrzucone konkretnym komunikatem; zakresy promienia', () => {
    expect(texts(CURL({ rodzaj: 'hantel', dzwon: 'dol' }))).toContain('sprzęt: pole „dzwon” nie dotyczy rodzaju „hantel” (dla tego rodzaju: promien, pionowo)');
    expect(texts(SWING({ rodzaj: 'kettlebell', pionowo: true }))).toContain('pole „pionowo” nie dotyczy rodzaju „kettlebell”');
    expect(texts(PLATE({ rodzaj: 'talerz', promien: 50 }))).toMatch(/\[schemat\].*promien/); /* poza przedziałem schematu 3–30 */
    expect(gearFieldIssues({ rodzaj: 'talerz', promien: 5 })).toEqual(['sprzęt: promien talerza = 5 cm poza przedziałem 8–30 cm']);
    expect(gearFieldIssues({ rodzaj: 'kettlebell', promien: 20 })).toEqual(['sprzęt: promien dzwonu = 20 cm poza przedziałem 5–15 cm']);
    expect(gearFieldIssues({ rodzaj: 'hantel', promien: 2 })).toEqual(['sprzęt: promien hantla = 2 cm poza przedziałem 3–12 cm']);
    expect(gearFieldIssues({ rodzaj: 'pilka_lekarska', promien: 25 })).toEqual(['sprzęt: promien piłki = 25 cm poza przedziałem 6–20 cm']);
    expect(gearFieldIssues({ rodzaj: 'sztanga', przesuniecie: [0, 0, 0] })).toEqual(['sprzęt: pole „przesuniecie” nie dotyczy rodzaju „sztanga”']);
    expect(gearFieldIssues({ rodzaj: 'slupek', h: 100, hak: 150 })).toEqual(['sprzęt: hak = 150 cm wyżej niż słupek (h = 100 cm)']); expect(gearFieldIssues({ rodzaj: 'skrzynia', hak: 5 })).toEqual(['sprzęt: pole „hak” nie dotyczy rodzaju „skrzynia” (dla tego rodzaju: z, dwa)']);
    expect(texts(RACKPULL([{ rodzaj: 'slupek', x: -45, h: 100, hak: 150 }]))).toContain('hak = 150 cm wyżej niż słupek');
    expect(gearFieldIssues({ rodzaj: 'landmine', dlugosc: 50 })).toEqual(['sprzęt: dlugosc gryfu landmine = 50 cm poza przedziałem 100–300 cm']); expect(gearFieldIssues({ rodzaj: 'landmine', y: 50 })).toEqual(['sprzęt: wysokość osi obrotu y = 50 cm poza przedziałem 0–30 cm']);
    expect(gearFieldIssues({ rodzaj: 'smith', z: 3 })).toEqual(['sprzęt: pole „z” nie dotyczy rodzaju „smith”']);
    expect(texts({ ...CURL({ rodzaj: 'hantel' }), sprzet: [{ rodzaj: 'maszyna' as never }] })).toMatch(/\[schemat\].*spoza listy/);
  });
  test('schemat: rodzaje i pola nowego sprzętu w JSON Schema (enum rodzajów, dzwon, przesuniecie jako wektor)', () => {
    const s = JSON.stringify(poseSchema('curl')); for (const k of GEAR) expect(s).toContain(`"${k}"`); for (const f of GEAR_EXTRA_FIELDS) expect(s).toContain(`"${f}"`);
  });
  test('opis kontraktu wspomina sprzęt trzymany w dłoniach i tolerancję 3 cm', () => {
    const t = describeContract('curl'); expect(t).toContain('podąża za chwytem'); expect(t).toContain('tolerancja 3 cm'); expect(t).toContain('hantel — hantel trzymany w dłoni');
  });
  test('zakres polecenia (gearText, hasOwnTemplate, EXT_FIELDS): rodzina z własnym szablonem zachowuje jego tekst, generyczna dostaje tylko rodzaje z zakresu; EXT_FIELDS = 10 pól poza@2 usuwanych ze schematu spoza zakresu', () => {
    expect(hasOwnTemplate('pull_up')).toBe(true); expect(hasOwnTemplate('shrug')).toBe(false);
    expect(gearText('pull_up', { gear: ['podloga'] })).toBe(templateFor('pull_up').gear);
    const t = gearText('shrug', { gear: ['podloga', 'hantel'] }); expect(t).toContain('podloga —'); expect(t).toContain('hantel —'); expect(t).not.toContain('kettlebell —'); expect(gearText('shrug')).toBe(templateFor('shrug').gear);
    expect(EXT_FIELDS).toHaveLength(10); expect(EXT_FIELDS).toContain('obrotTulowia'); expect(EXT_FIELDS).toContain('obrotPrzedramienia');
    const w = poseSchema('shrug', { gear: ['podloga'], ext: ['uniesienieBarkow'] }) as any; const k = Object.keys(w.properties.klatki.items.properties); const r = Object.keys(w.properties.klatki.items.properties.rece.properties.R.properties); expect(r).toContain('uniesienieBarkow'); expect(r).not.toContain('obrotPrzedramienia'); expect(k).not.toContain('obrotTulowia'); expect(Object.keys(w.properties.sprzet.items.properties)).not.toContain('promien');
    expect(describeContract('shrug', { gear: ['podloga'], ext: [] })).not.toContain('Opcjonalne stopnie swobody');
  });
});
