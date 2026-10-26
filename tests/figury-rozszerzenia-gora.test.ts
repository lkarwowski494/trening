/*
 * Rozszerzenia modelu figur v2 pod pozy części górnej (26.10.2026; decyzja właściciela: rozszerzamy model zamiast wyjątków):
 * (1) sztanga z trzyma R/L ma środek na chwycie TEJ dłoni (jednorącz: Smith, landmine),
 * (2) czysta pronacja/supinacja: lista „bez_bramki_ruchu” zdejmuje tylko wymóg ruchu ≥ 8 cm (poza nie jest statyczna), a klatki_rozne uznaje obrót przedramienia,
 * (3) leżenie przodem na ławce skośnej (obrotTulowia 180) ma zakres biodra do −45° tylko dla 7 ćwiczeń z deklaracją (rodziny.<rodzina>.zakres_wyjatki); reszta rodzin ma zakres kontraktu,
 * (4) klęk na palcach (stopy z podbiciem −75°) mieści się w zakresach bez wyjątku.
 */
import * as path from 'path';
import { execFileSync } from 'child_process';

jest.setTimeout(180000);
const ROOT = path.join(__dirname, '..');
const run = (code: string) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', code], { cwd: ROOT, env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));

const KOD = `
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { loadV2 } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-build.mjs'))};
import * as J from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-jakosc.mjs'))};
import { waliduj } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-validate.mjs'))};
import * as SENS from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-sens.mjs'))};
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rozszerzenia-test-')); const { v2 } = loadV2(dir);
const poza = (f, cw) => JSON.parse(JSON.stringify(JSON.parse(fs.readFileSync(path.join(${JSON.stringify(ROOT)}, 'lib/figures/v2/poses', f + '.json'), 'utf8')).cwiczenia[cw]));
const klon = (x) => JSON.parse(JSON.stringify(x));
const W = {};
/* 1 sztanga jednorącz: środek na chwycie dłoni R */
const SM = poza('delt_raise', 'Smith Machine One-Arm Upright Row'); const f = v2.keyframeFrame(SM, 0.5); const bar = f.props.find((p) => p.k === 'barbell');
W.sztanga = { c: bar.c, gripR: f.sk.arms.R.grip, held: bar.held, trzyma: SM.sprzet.find((g) => g.rodzaj === 'sztanga').trzyma };
/* 2 pronacja: przechodzi; ta sama poza ze stałym obrotem (statyczna) łamie klatki_rozne; poza spoza listy z obrotem bez ruchu łamie bramkę ruchu */
const PR = poza('forearm', 'Dumbbell Lying Pronation');
const stala = klon(PR); for (const k of stala.klatki) { k.rece.R.obrotPrzedramienia = 10; }
W.pronacja = { ok: waliduj(PR, { rodzina: 'forearm', cwiczenie: 'Dumbbell Lying Pronation' }).ok, obroty: PR.klatki.map((k) => k.rece.R.obrotPrzedramienia),
  bezBramki: SENS.bezBramkiRuchu('Dumbbell Lying Pronation') && SENS.bezBramkiRuchu('Dumbbell Lying Supination') && !SENS.bezBramkiRuchu('Barbell Curl') && !SENS.bezBramkiRuchu('_opis'),
  stala: J.klatkiRozne(v2, stala, false).length, zObrotem: J.klatkiRozne(v2, PR, false).length,
  innaNazwa: waliduj(PR, { rodzina: 'forearm', cwiczenie: 'Wrist Curl (hantle)' }).bledy.map((b) => b.kod) };
/* 3 leżenie przodem: poza w danych i granica biodra */
const SP = poza('curl', 'Spider Curl'); const CS = poza('row', 'Chest Supported Row'); const MB = poza('shrug', 'Middle Back Shrug');
W.przodem = { obrot: [SP, CS, MB].map((p) => p.klatki.every((k) => k.obrotTulowia === 180)), lawka: [SP, CS, MB].map((p) => p.sprzet.find((g) => g.rodzaj === 'lawka').kat),
  ok: [['curl', 'Spider Curl', SP], ['row', 'Chest Supported Row', CS], ['shrug', 'Middle Back Shrug', MB]].map(([r, c, p]) => waliduj(p, { rodzina: r, cwiczenie: c }).ok),
  deklaracje: [['curl', 'Spider Curl'], ['curl', 'Spider Curl (sztanga)'], ['row', 'Chest Supported Row'], ['row', 'Lying T-Bar Row'], ['delt_raise', 'Front Incline Dumbbell Raise'], ['shrug', 'Middle Back Shrug'], ['rotator_cuff', 'Reverse Flyes With External Rotation']].map(([r, c]) => SENS.zakresWyjatek(r, c)?.hipMin),
  bezDeklaracji: [['row', 'Bent Over Row (sztanga)'], ['curl', 'Barbell Curl'], ['delt_raise', 'Lateral Raise (hantle)'], ['shrug', 'Shrugs (sztanga)']].map(([r, c]) => SENS.zakresWyjatek(r, c) ?? null), szablonRodziny: ['row', 'curl', 'delt_raise', 'shrug', 'rotator_cuff'].map((r) => v2.templateFor(r).allow?.hipMin ?? null),
  /* ta sama poza (biodro −45°): bez deklaracji (jak Barbell Row) odrzucona zakresem biodra, z deklaracją przechodzi */
  bezAllow: v2.validatePose({ ...CS, cwiczenie: 'Bent Over Row (sztanga)' }, { family: 'row', exercise: 'Bent Over Row (sztanga)', errorCues: [], rom: JSON.parse(fs.readFileSync(path.join(${JSON.stringify(ROOT)}, 'lib/figures/data.json'), 'utf8')).rom, isometric: false }).filter((i) => i.kod === 'zakres').map((i) => i.szczegol),
  zAllow: v2.validatePose(CS, { family: 'row', exercise: 'Chest Supported Row', errorCues: [], rom: JSON.parse(fs.readFileSync(path.join(${JSON.stringify(ROOT)}, 'lib/figures/data.json'), 'utf8')).rom, isometric: false, allow: SENS.zakresWyjatek('row', 'Chest Supported Row') }).filter((i) => i.kod === 'zakres').map((i) => i.szczegol) };
/* 4 klęk na palcach */
const KL = poza('cable_row', 'Kneeling High Pulley Row'); const KT = poza('triceps', 'Kneeling Cable Triceps Extension');
W.klek = { ok: [waliduj(KL, { rodzina: 'cable_row', cwiczenie: 'Kneeling High Pulley Row' }).ok, waliduj(KT, { rodzina: 'triceps', cwiczenie: 'Kneeling Cable Triceps Extension' }).ok], podbicie: [KL.klatki[0].nogi.R.podbicie, KT.klatki[0].nogi.R.podbicie], lawkaPlaska: KT.sprzet.some((g) => g.rodzaj === 'lawka' && g.kat === 0) };
/* 5 jednorącz landmine */
const LJ = poza('overhead_press', 'Single-Arm Linear Jammer'); const g = LJ.sprzet.map((x) => [x.rodzaj, x.trzyma]);
W.landmine = { sprzet: g, ok: waliduj(LJ, { rodzina: 'overhead_press', cwiczenie: 'Single-Arm Linear Jammer' }).ok };
console.log(JSON.stringify(W));
`;

let W: any;
beforeAll(() => { W = run(KOD); });

describe('rozszerzenia modelu pod pozy części górnej (26.10.2026)', () => {
  test('sztanga z trzyma R: środek gryfu (x, y) leży na chwycie trzymającej dłoni, nie w średniej obu', () => {
    expect(W.sztanga.trzyma).toBe('R'); expect(W.sztanga.held).toBe('R');
    expect(Math.abs(W.sztanga.c[0] - W.sztanga.gripR[0])).toBeLessThan(0.01); expect(Math.abs(W.sztanga.c[1] - W.sztanga.gripR[1])).toBeLessThan(0.01);
  });
  test('jednorącz w landmine (Single-Arm Linear Jammer): landmine i sztanga z trzyma R, poza przechodzi walidator', () => {
    expect(W.landmine.sprzet).toEqual(expect.arrayContaining([['landmine', 'R'], ['sztanga', 'R']])); expect(W.landmine.ok).toBe(true);
  });
  test('pronacja i supinacja: lista bez_bramki_ruchu zdejmuje tylko wymóg ruchu; poza zmienia obrót przedramienia, nie jest statyczna', () => {
    expect(W.pronacja.bezBramki).toBe(true); expect(W.pronacja.ok).toBe(true);
    expect(Math.max(...W.pronacja.obroty) - Math.min(...W.pronacja.obroty)).toBeGreaterThanOrEqual(100);
    expect(W.pronacja.zObrotem).toBe(0);
  });
  test('klatki_rozne: kopie klatek bez ruchu i bez obrotu przedramienia dalej łamią regułę (obrót ≥ 5° ją spełnia)', () => {
    expect(W.pronacja.stala).toBeGreaterThan(0);
  });
  test('ćwiczenie spoza listy nie dostaje wyjątku od bramki ruchu (ta sama poza w innym ćwiczeniu ma błędy)', () => {
    expect(W.pronacja.innaNazwa.length).toBeGreaterThan(0);
  });
  test('leżenie przodem na ławce skośnej: obrotTulowia 180 w każdej klatce, ławka skośna, poza przechodzi; zakres biodra −45° tylko dla 7 ćwiczeń z deklaracją; Barbell Row z biodrem −45° bez deklaracji jest odrzucany', () => {
    expect(W.przodem.obrot).toEqual([true, true, true]); for (const k of W.przodem.lawka) expect(k).toBeGreaterThanOrEqual(10);
    expect(W.przodem.ok).toEqual([true, true, true]); expect(W.przodem.deklaracje).toEqual([-45, -45, -45, -45, -45, -45, -45]); expect(W.przodem.bezDeklaracji).toEqual([null, null, null, null]); expect(W.przodem.szablonRodziny).toEqual([null, null, null, null, null]);
    expect(W.przodem.bezAllow.some((t: string) => /hip/.test(t))).toBe(true); expect(W.przodem.zAllow).toEqual([]);
  });
  test('klęk na palcach (podbicie −75°, kolana przy podłodze) przechodzi walidator bez wyjątku kostki; Kneeling Cable Triceps Extension ma ławkę płaską', () => {
    expect(W.klek.ok).toEqual([true, true]); expect(W.klek.podbicie).toEqual([-75, -75]); expect(W.klek.lawkaPlaska).toBe(true);
  });
});
