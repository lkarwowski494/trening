/*
 * Ewaluatory reguł sensu ruchu (scripts/figures/v2-sens.mjs; docs/53, bramka 3): 22 typy od badacza (26.10.2026) i typy z pull_up/core_floor.
 * Dla KAŻDEGO typu: przypadek spełniający regułę (brak naruszeń) i przypadek łamiący ją (konkretny komunikat z liczbami). Dane syntetyczne (szkielet jako obiekt):
 * poz tych rodzin jeszcze nie ma, a ewaluator jest czystą funkcją próbek ruchu. Zgodność z danymi: każdy typ z data/zrodla/figury-sens.json ma ewaluator i opis w poleceniu.
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';

jest.setTimeout(120000);
const ROOT = path.join(__dirname, '..');
const SENS = path.join(ROOT, 'scripts/figures/v2-sens.mjs');
const run = (code: string) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(SENS)}; ${code}`], { env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }));

/** Przypadki: [typ, parametry, dobre(sk[]), złe(sk[]), fragment komunikatu]. Szkielet S(zmiany) ma wartości domyślne leżącej/stojącej osoby; próbki = lista zmian na kolejne u. */
const PRZYPADKI = `
const S = (o = {}) => { const sk = { pelvis: [0, 50, 0], shoulderC: [0, 100, 0], head: [0, 122, 0], headUp: [0, 1, 0], spineMid: [0, 75, 0],
  legs: { R: { knee: [0, 25, 8], ankle: [0, 7, 8], heel: [-6, 0, 8], toe: [19, 0, 8], deg: 0, kd: 0, hd: 0, ad: 0, hip: [0, 50, 8] }, L: { knee: [0, 25, -8], ankle: [0, 7, -8], heel: [-6, 0, -8], toe: [19, 0, -8], deg: 0, kd: 0, hd: 0, ad: 0, hip: [0, 50, -8] } }, front: [1, 0, 0],
  arms: { R: { shoulder: [0, 100, 19], elbow: [0, 70, 19], grip: [0, 40, 19], deg: 0, sab: 0 }, L: { shoulder: [0, 100, -19], elbow: [0, 70, -19], grip: [0, 40, -19], deg: 0, sab: 0 } } };
  for (const [k, v] of Object.entries(o)) { if (k === 'legs' || k === 'arms') { for (const s of ['R', 'L']) Object.assign(sk[k][s], v[s] ?? v); } else sk[k] = v; } return sk; };
const P = (sks, pitch = (i) => 0) => sks.map((sk, i) => ({ u: i / Math.max(1, sks.length - 1), kf: { pochylenieTulowia: pitch(i) }, f: { sk, info: {} } }));
const v2 = { jointAngles: (sk, side) => ({ elbow: sk.arms[side].deg, knee: sk.legs[side].kd || sk.legs[side].deg, hip: sk.legs[side].hd, ankle: sk.legs[side].ad, shAbd: sk.arms[side].sab }), BODY: { headR: 9.5 } };
const d = { sprzet: [{ rodzaj: 'sztanga', x: 0, y: 200 }] };
const sym = (k, v) => ({ R: { [k]: v }, L: { [k]: v } });
const przyp = [
  ['kolana_ku_barkom', { min_zblizenie_cm: 15 }, [S(), S({ legs: { R: { knee: [0, 60, 8] }, L: { knee: [0, 60, -8] } } })], [S(), S()], 'maleje tylko'],
  ['miednica_nieruchoma', { max_cm: 3 }, [S(), S({ pelvis: [0, 52, 0] })], [S(), S({ pelvis: [0, 58, 0] })], 'miednicy zmienia się o 8'],
  ['miednica_pion_span', { max_cm: 5 }, [S(), S({ pelvis: [0, 53, 0] })], [S(), S({ pelvis: [0, 60, 0] })], 'zmienia się o 10'],
  ['zgiecie_tulowia_biodra_nieruchome', { min_skrocenie_cm: 6, max_miednica_cm: 4 }, [S(), S({ shoulderC: [0, 90, 0] })], [S(), S({ shoulderC: [0, 99, 0], pelvis: [10, 50, 0] })], 'maleje tylko'],
  ['konczyny_uniesione', { min_cm: 5 }, [S(), S({ arms: { R: { grip: [0, 60, 19] }, L: { grip: [0, 60, -19] } }, legs: { R: { ankle: [0, 20, 8] }, L: { ankle: [0, 20, -8] } } })], [S(), S({ arms: { R: { grip: [0, 60, 19] }, L: { grip: [0, 40, -19] } }, legs: { R: { ankle: [0, 20, 8] }, L: { ankle: [0, 20, -8] } } })], 'dłoń L'],
  ['stawy_proste', { stawy: ['elbow', 'knee'], max_deg: 20 }, [S(), S()], [S(), S({ legs: { R: { deg: 45 }, L: { deg: 45 } } })], 'staw knee R dochodzi do 45'],
  ['barki_unoszenie_max', { max_cm: 10 }, [S(), S({ shoulderC: [0, 105, 0] })], [S(), S({ shoulderC: [0, 115, 0] })], 'barki unoszą się o 15'],
  ['start_lezenie', { max_cm: 12 }, [S({ shoulderC: [-50, 58, 0], legs: { R: { ankle: [30, 8, 8] }, L: { ankle: [30, 8, -8] } } })], [S()], 'barki są 50'],
  ['kat_tulowia_nad_poziomem_u1', { min_deg: 30 }, [S(), S({ shoulderC: [-30, 90, 0] })], [S(), S({ shoulderC: [-50, 52, 0] })], 'nad poziomem'],
  ['kat_nog_nad_poziomem_u1', { min_deg: 30 }, [S(), S({ legs: { R: { ankle: [40, 80, 8] }, L: { ankle: [40, 80, -8] } } })], [S(), S({ legs: { R: { ankle: [80, 55, 8] }, L: { ankle: [80, 55, -8] } } })], 'nogi są'],
  ['szkielet_nieruchomy', { max_cm: 2 }, [S(), S({ head: [0, 123, 0] })], [S(), S({ head: [5, 122, 0] })], 'przesuwa się o 5'],
  ['lokiec_nieruchomy_wzgledem_barku', { max_cm: 8 }, [S(), S({ shoulderC: [0, 110, 0], arms: { R: { elbow: [0, 80, 19] }, L: { elbow: [0, 80, -19] } } })], [S(), S({ arms: { R: { elbow: [20, 70, 19] }, L: { elbow: [0, 70, -19] } } })], 'łokieć R przesuwa się względem barku o 20'],
  ['tulow_nieruchomy', { max_pochylenie_deg: 5, max_miednica_cm: 3 }, [S(), S()], [S(), S({ pelvis: [6, 50, 0] })], 'miednica przesuwa się poziomo o 6', [0, 3], null, [0, 3]],
  ['lokiec_zakres', { u0_max_deg: 30, u1_min_deg: 100 }, [S({ arms: sym('deg', 10) }), S({ arms: sym('deg', 130) })], [S({ arms: sym('deg', 10) }), S({ arms: sym('deg', 60) })], 'w u = 1 ma 60'],
  ['lokiec_zakres_ruch', { min_max_deg: 70, max_min_deg: 20 }, [S({ arms: sym('deg', 10) }), S({ arms: sym('deg', 90) })], [S({ arms: sym('deg', 10) }), S({ arms: sym('deg', 40) })], 'dochodzi tylko do 40'],
  ['lokiec_staly_kat', { max_zmiana_deg: 12, max_deg: 40 }, [S({ arms: sym('deg', 20) }), S({ arms: sym('deg', 25) })], [S({ arms: sym('deg', 20) }), S({ arms: sym('deg', 60) })], 'zmienia kąt o 40'],
  ['lokiec_wysokosc_u1', { min_cm: -12, max_cm: 12 }, [S(), S({ arms: { R: { elbow: [0, 103, 19] }, L: { elbow: [0, 103, -19] } } })], [S(), S()], 'żaden łokieć'],
  ['kat_ramie_tulow_wzrost', { min_deg: 45 }, [S(), S({ arms: { R: { elbow: [40, 100, 19] }, L: { elbow: [40, 100, -19] } } })], [S(), S({ arms: { R: { elbow: [5, 70, 19] }, L: { elbow: [5, 70, -19] } } })], 'rośnie najwyżej'],
  ['dlon_w_plaszczyznie_barkow_u1', { max_cm: 12 }, [S(), S({ arms: { R: { grip: [30, 98, 40] }, L: { grip: [30, 98, -40] } } })], [S(), S({ arms: { R: { grip: [30, 60, 19] }, L: { grip: [30, 98, -19] } } })], 'dłoń R w u = 1'],
  ['dlon_odchodzi_w_bok', { min_cm: 25 }, [S(), S({ arms: { R: { grip: [0, 100, 55] }, L: { grip: [0, 100, -55] } } })], [S(), S({ arms: { R: { grip: [0, 100, 25] }, L: { grip: [0, 100, -25] } } })], 'odchodzi w bok'],
  ['lokiec_nad_dlonia_u1', { min_cm: 0 }, [S(), S()], [S(), S({ arms: { R: { grip: [0, 80, 19] }, L: { grip: [0, 80, -19] } } })], 'nad dłonią'],
  ['ciezar_blisko_glowy', { max_cm: 30 }, [S({ arms: { R: { grip: [0, 120, 19] }, L: { grip: [0, 120, -19] } } })], [S()], 'oddala się od głowy'],
  ['miednica_na_linii', { max_cm: 6, koniec: 'kostka_dalsza' }, [S({ shoulderC: [50, 50, 0], pelvis: [0, 50, 0], legs: { R: { ankle: [-80, 50, 8] }, L: { ankle: [-80, 50, -8] } } })], [S({ shoulderC: [50, 50, 0], pelvis: [0, 70, 0], legs: { R: { ankle: [-80, 50, 8] }, L: { ankle: [-80, 50, -8] } } })], 'odchyla się od linii'],
  ['miednica_poziomo', { osie: ['x', 'z'], max_cm: 3 }, [S(), S({ pelvis: [1, 50, 1] })], [S(), S({ pelvis: [8, 50, 0] })], 'w x o 8'],

  /* --- runda 2 (35 typów) --- */
  ['kregoslup_neutralny', { min_deg: -20, max_deg: 10 }, [S(), S()], [S(), S()], 'zgięcie kręgosłupa w ruchu', null, [0, 30]],
  ['kolano_w_linii_stopy', { strony: 'obie', min_zgiecie_deg: 30, max_do_srodka_cm: 4 }, [S({ legs: { R: { kd: 90, knee: [20, 25, 6] }, L: { kd: 90, knee: [20, 25, -6] } } })], [S({ legs: { R: { kd: 90, knee: [20, 25, 2] }, L: { kd: 90, knee: [20, 25, -2] } } })], 'przyśrodkowo od osi stopy'],
  ['zawias_biodrowy', { noga: 'srednia', min_biodro_deg: 60, min_stosunek: 1.5 }, [S(), S({ legs: { R: { hd: 80, kd: 20 }, L: { hd: 80, kd: 20 } } })], [S(), S({ legs: { R: { hd: 80, kd: 70 }, L: { hd: 80, kd: 70 } } })], 'mniejszy niż 1.5 × zakres kolana'],
  ['klatka_przy_dloniach', { max_cm: 20 }, [S({ arms: sym('deg', 10) }), S({ arms: { R: { deg: 140, grip: [0, 90, 19] }, L: { deg: 140, grip: [0, 90, -19] } } })], [S({ arms: sym('deg', 10) }), S({ arms: sym('deg', 140) })], 'klatka jest 60'],
  ['piety_na_podlodze', { max_cm: 2 }, [S(), S({ legs: { R: { heel: [-6, 1, 8] }, L: { heel: [-6, 1, -8] } } })], [S(), S({ legs: { R: { heel: [-6, 6, 8] }, L: { heel: [-6, 0, -8] } } })], 'pięta R zmienia wysokość o 6'],
  ['kolano_biodro_zakres', { kolano_min_max_deg: 80, biodro_min_max_deg: 60, kolano_max_min_deg: 15 }, [S(), S({ legs: { R: { kd: 100, hd: 70 }, L: { kd: 100, hd: 70 } } })], [S(), S({ legs: { R: { kd: 30, hd: 70 }, L: { kd: 30, hd: 70 } } })], 'kolano w ruchu dochodzi tylko do 30'],
  ['udo_rownolegle_na_dole', { max_deg: 15 }, [S(), S({ pelvis: [0, 30, 0], legs: { R: { hip: [0, 30, 8], knee: [30, 28, 8] }, L: { hip: [0, 30, -8], knee: [30, 28, -8] } } })], [S(), S({ pelvis: [0, 30, 0], legs: { R: { hip: [0, 50, 8], knee: [30, 25, 8] }, L: { hip: [0, 30, -8], knee: [30, 28, -8] } } })], 'udo R w najniższym punkcie'],
  ['stanie_wyprost', { max_kolano_deg: 15, max_biodro_deg: 15, max_tulow_deg: 15 }, [S({ legs: { R: { kd: 5, hd: 5 }, L: { kd: 5, hd: 5 } } })], [S({ legs: { R: { kd: 40, hd: 5 }, L: { kd: 40, hd: 5 } } })], 'nie ma pełnego wyprostu'],
  ['ciezar_blisko_nog', { max_cm: 15, tylko_ponizej_barkow: true }, [S({ arms: { R: { grip: [3, 60, 19] }, L: { grip: [3, 60, -19] } } })], [S({ arms: { R: { grip: [40, 60, 19] }, L: { grip: [40, 60, -19] } } })], 'ciężar oddala się od linii nóg'],
  ['ciezar_ponizej_kolan', { min_cm: 10 }, [S(), S({ arms: { R: { grip: [0, 5, 19] }, L: { grip: [0, 5, -19] } } })], [S(), S()], 'nie schodzi'],
  ['pochylenie_tulowia_ruch', { min_zmiana_deg: 40 }, [S(), S()], [S(), S()], 'zmienia się tylko o 10', [0, 10], null, [0, 50]],
  ['kolana_max', { max_deg: 35 }, [S({ legs: { R: { kd: 20 }, L: { kd: 20 } } })], [S({ legs: { R: { kd: 50 }, L: { kd: 20 } } })], 'kolano dochodzi do 50'],
  ['lawka_kontakt', { max_cm: 2, min_kregoslup_deg: -15 }, [S(), S({ pelvis: [0, 51, 0] })], [S(), S({ pelvis: [0, 58, 0] })], 'miednica zmienia wysokość o 8'],
  ['chwyt_przy_klatce', { max_cm: 20 }, [S({ arms: { R: { deg: 130, grip: [10, 100, 19] }, L: { deg: 130, grip: [10, 100, -19] } } })], [S({ arms: { R: { deg: 130, grip: [50, 100, 19] }, L: { deg: 130, grip: [50, 100, -19] } } })], 'przed klatką'],
  ['lokiec_pod_chwytem', { osie: ['x'], max_cm: 10 }, [S(), S()], [S({ arms: { R: { grip: [25, 40, 19] } } })], 'odchodzi od łokcia'],
  ['odwiedzenie_ramienia_max', { max_deg: 75 }, [S({ arms: { R: { deg: 100, sab: 60 }, L: { deg: 100, sab: 60 } } })], [S({ arms: { R: { deg: 100, sab: 90 }, L: { deg: 100, sab: 60 } } })], 'odwiedzenie ramienia R'],
  ['ciezar_nad_glowa', { min_cm: 5, tylko_u1: true, lokiec_max_deg: 30 }, [S(), S({ arms: { R: { grip: [0, 140, 19], deg: 10 }, L: { grip: [0, 140, -19], deg: 10 } } })], [S(), S()], 'nie jest ≥ 5 cm nad głową'],
  ['chwyt_przy_barkach', { min_cm: -15, max_cm: 15 }, [S({ arms: { R: { grip: [0, 105, 19] }, L: { grip: [0, 105, -19] } } })], [S()], 'nie leży'],
  ['ciezar_nad_barkami', { max_cm: 10 }, [S({ arms: { R: { grip: [3, 150, 19] }, L: { grip: [3, 150, -19] } } })], [S({ arms: { R: { grip: [30, 150, 19] }, L: { grip: [30, 150, -19] } } })], 'przed/za barkami'],
  ['ugiecie_kolan_zakres', { min_deg: 90, max_deg: 140 }, [S(), S({ legs: { R: { kd: 100 }, L: { kd: 100 } } })], [S(), S({ legs: { R: { kd: 40 }, L: { kd: 40 } } })], 'największe zgięcie kolan w ruchu to 40'],
  ['dlonie_zblizaja_sie', { min_cm: 15 }, [S(), S({ arms: { R: { grip: [0, 40, 5] }, L: { grip: [0, 40, -5] } } })], [S(), S()], 'zmienia się tylko o 0'],
  ['chwyt_nie_ponizej_barkow', { min_cm: -10 }, [S({ arms: { R: { grip: [0, 100, 19] }, L: { grip: [0, 100, -19] } } })], [S()], 'schodzi do -60'],
  ['kat_ramie_tulow_zakres', { min_deg: 45 }, [S(), S({ arms: { R: { elbow: [40, 100, 19] }, L: { elbow: [40, 100, -19] } } })], [S(), S()], 'zmienia się najwyżej o 0'],
  ['lokiec_za_tulowiem', { min_cm: 5 }, [S(), S({ arms: { R: { elbow: [-10, 100, 19] }, L: { elbow: [-10, 100, -19] } } })], [S(), S()], 'za linią barku'],
  ['lokcie_w_dol', { min_cm: 10 }, [S()], [S({ arms: { R: { elbow: [0, 105, 19] }, L: { elbow: [0, 70, -19] } } })], 'łokieć R przy najniższym chwycie'],
  ['lot', { min_cm: 5 }, [S(), S({ legs: { R: { heel: [-6, 10, 8], toe: [19, 12, 8] }, L: { heel: [-6, 10, -8], toe: [19, 12, -8] } } })], [S(), S()], 'nie ma lotu'],
  ['amortyzacja_ladowania', { min_cm: 5, min_kolano_deg: 60, min_biodro_deg: 40 }, [S(), S({ legs: { R: { heel: [-6, 10, 8], toe: [19, 12, 8] }, L: { heel: [-6, 10, -8], toe: [19, 12, -8] } } }), S({ legs: { R: { kd: 70, hd: 50 }, L: { kd: 70, hd: 50 } } })], [S(), S({ legs: { R: { heel: [-6, 10, 8], toe: [19, 12, 8] }, L: { heel: [-6, 10, -8], toe: [19, 12, -8] } } }), S()], 'żadna noga nie amortyzuje'],
  ['potrojny_wyprost', { nogi: 'obie', max_kolano_deg: 15, max_biodro_deg: 15, max_kostka_deg: 0 }, [S()], [S({ legs: { R: { kd: 40 }, L: { kd: 40 } } })], 'nie ma potrójnego wyprostu'],
  ['dlonie_na_wysokosci_barkow', { min_cm: 0, min_rak: 2 }, [S({ arms: { R: { grip: [0, 110, 19] }, L: { grip: [0, 110, -19] } } })], [S()], 'nie ma dłoni'],
  ['rece_przed_wyprostem_bioder', { max_biodro_deg: 15, max_lokiec_deg: 20 }, [S({ legs: { R: { hd: 80 }, L: { hd: 80 } } }), S()], [S({ legs: { R: { hd: 80 }, L: { hd: 80 } }, arms: { R: { deg: 60 }, L: { deg: 60 } } }), S()], 'łokcie zginają się do 60'],
  ['odbior_na_barkach_u1', { min_cm: -10, max_cm: 15, max_lokiec_pod_barkiem_cm: 20 }, [S(), S({ arms: { R: { grip: [0, 105, 19], elbow: [0, 95, 19] }, L: { grip: [0, 105, -19], elbow: [0, 95, -19] } } })], [S(), S()], 'odbiór na barkach'],
  ['wolna_noga_przod', { min_y_cm: 10, min_przod_cm: 15 }, [S({ pelvis: [0, 50, 0], legs: { R: { kd: 80, ankle: [0, 7, 8] }, L: { kd: 5, ankle: [30, 30, -8] } } })], [S({ legs: { R: { kd: 80 }, L: { kd: 5, ankle: [0, 7, -8] } } })], 'wolna noga'],
  ['wejscie_na_podwyzszenie', { min_cm: 20, max_kolano_deg: 15 }, [S(), S({ pelvis: [0, 80, 0] })], [S(), S({ pelvis: [0, 55, 0] })], 'miednica unosi się tylko o 5'],
  ['kolano_tylne_nisko', { max_cm: 10 }, [S({ legs: { R: { knee: [0, 5, 8] } } })], [S()], 'tylne kolano'],
  ['lokcie_wysoko', { max_cm: 12 }, [S({ arms: { R: { elbow: [0, 95, 19] }, L: { elbow: [0, 95, -19] } } })], [S()], 'łokieć schodzi do 30'],
  ['chwyt_blisko_tulowia', { max_cm: 25 }, [S({ arms: { R: { grip: [5, 90, 19] }, L: { grip: [5, 90, -19] } } })], [S({ arms: { R: { grip: [50, 90, 19] }, L: { grip: [50, 90, -19] } } })], 'oddala się od tułowia'],
  ['kolana_do_klatki', { min_cm: 5, min_biodro_deg: 70, min_kolano_deg: 70 }, [S(), S({ legs: { R: { heel: [-6, 10, 8], toe: [19, 12, 8], kd: 100, hd: 90 }, L: { heel: [-6, 10, -8], toe: [19, 12, -8], kd: 100, hd: 90 } } })], [S(), S({ legs: { R: { heel: [-6, 10, 8], toe: [19, 12, 8] }, L: { heel: [-6, 10, -8], toe: [19, 12, -8] } } })], 'kolana nie są podciągnięte'],
];
const out = przyp.map(([typ, q, dobre, zle, frag, pitch, spine, pitchDobre]) => { const ev = m.EWALUATORY[typ]; const sam = (sks, bad) => ev({ v2, d, p: P(sks, (bad ? pitch : pitchDobre) ? (i) => (bad ? pitch : pitchDobre)[Math.min(i, (bad ? pitch : pitchDobre).length - 1)] : undefined).map((x, i) => (spine && bad ? { ...x, kf: { ...x.kf, zgiecieKregoslupa: spine[Math.min(i, spine.length - 1)] } } : x)), parametry: q });
  return { typ, dobre: sam(dobre, false), zle: sam(zle, true), frag }; });
console.log(JSON.stringify(out));
`;
const wyniki = run(PRZYPADKI) as { typ: string; dobre: string[]; zle: string[]; frag: string }[];

describe('ewaluatory reguł sensu: każdy typ ma przypadek spełniający i łamiący (syntetyczne próbki ruchu)', () => {
  test.each(wyniki.map((w) => [w.typ, w] as const))('%s: poprawna poza bez naruszeń, łamiąca — komunikat z liczbami', (_t, w) => {
    expect(w.dobre).toEqual([]); expect(w.zle.length).toBeGreaterThan(0); expect(w.zle.join('|')).toContain(w.frag);
  });
  test('pokrycie typów: wszystkie typy z danych mają ewaluator, opis w poleceniu i przypadek w tym teście; typy liczbowe z komunikatem zawierają wartość i limit', () => {
    const dane = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sens.json'), 'utf8')); const typy = new Set<string>(Object.values(dane.rodziny as Record<string, { reguly: Record<string, { typ: string }> }>).flatMap((r) => Object.values(r.reguly).map((x) => x.typ)));
    const ewal = run('console.log(JSON.stringify(Object.keys(m.EWALUATORY)))') as string[]; const opisy = fs.readFileSync(path.join(ROOT, 'scripts/figures/gemini-polecenia.mjs'), 'utf8');
    const testowane = new Set(wyniki.map((w) => w.typ)); const bezPrzypadku = ['broda_nad_drazkiem', 'lokiec_u0', 'lokiec_caly_ruch', 'kostka_wzgledem_miednicy', 'pochylenie_tulowia', 'miednica_na_podlodze', 'szyja_neutralna', 'lopatki_od_podlogi', 'miednica_unosi_sie', 'bird_dog_linia', 'jedna_reka']; /* testowane na prawdziwych pozach: tests/gemini-polecenia.test.ts */
    for (const t of typy) { expect([t, ewal.includes(t)]).toEqual([t, true]); expect([t, new RegExp(`\\b${t}: \\(q\\)`).test(opisy)]).toEqual([t, true]); expect([t, testowane.has(t) || bezPrzypadku.includes(t)]).toEqual([t, true]); }
    expect(typy.size).toBeGreaterThanOrEqual(30);
  });
});
