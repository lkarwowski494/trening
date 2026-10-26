/*
 * Reguły JAKOŚCI póz figur v2 (scripts/figures/v2-jakosc.mjs; docs/53; L-036): 12 luk z recenzji ruchu pilotażu agent-pozy (26.10.2026) zamienionych w sprawdzenia automatyczne.
 * Dla KAŻDEJ reguły: poza spełniająca (brak komunikatu) i łamiąca (komunikat z liczbami). Pozy bierzemy z danych (lib/figures/v2/poses) i modyfikujemy; reguły oparte na kształtach rysunku
 * (styk z podłogą z przodu, zasłanianie) dostają kształty syntetyczne. Plus: remis „skrajnej” w regule miednica_na_linii i zdjęcie wymogu zerowej delty w u = 0 dla błędów postawy.
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
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jakosc-test-')); const { v2 } = loadV2(dir);
const poza = (f, cw) => JSON.parse(JSON.stringify(JSON.parse(fs.readFileSync(path.join(${JSON.stringify(ROOT)}, 'lib/figures/v2/poses', f + '.json'), 'utf8')).cwiczenia[cw]));
const PU = poza('pushup_plank', 'Push Up'), PL = poza('pushup_plank', 'Plank'), CL = poza('pushup_plank', 'Close-Grip Push-Up'), SA = poza('pushup_plank', 'Single-Arm Push-Up'), RC = poza('core_floor', 'Reverse Crunch');
const W = {};
/* 1 błąd postawy w każdej klatce */
const bad1 = JSON.parse(JSON.stringify(PL)); bad1.bledy[0].klatki[0] = { u: 0 };
W.blad_widoczny_stale = { dobre: J.bladWidocznyStale(v2, PL, new Set(['plank.mis.sag'])), zle: J.bladWidocznyStale(v2, bad1, new Set(['plank.mis.sag'])) };
/* 2 nic pod podłogą */
const bad2 = JSON.parse(JSON.stringify(PU)); for (const k of bad2.klatki) { k.rece.R.chwyt[1] = -12; k.rece.L.chwyt[1] = -12; }
W.pod_podloga = { dobre: J.podPodloga(v2, PU), zle: J.podPodloga(v2, bad2) };
/* 3 styk z podłogą z przodu (kształty) */
const stopa = (id, y0) => ({ id, pts: [[-5, y0], [5, y0], [3, y0 + 11]] });
W.styk_z_podloga_przod = { dobre: J.stykZPodlogaPrzod([stopa('footR', 0), stopa('footL', 0.5)], { R: 0, L: 0.5 }), zle: J.stykZPodlogaPrzod([stopa('footR', 13), stopa('footL', 0)], { R: 0, L: 0 }) };
/* 4 kolejność zasłaniania (kształty: z = głębokość, skrzynia ma być PO dalszych częściach ciała) */
const kszt = (id, z, x0) => ({ id, z, pts: [[x0, 0], [x0 + 20, 0], [x0 + 20, 30], [x0, 30]] });
W.zaslanianie_sprzetu = { dobre: J.zaslanianieSprzetu([kszt('footR', 5, 0), kszt('box', 14.5, 0)], 14), zle: J.zaslanianieSprzetu([kszt('footR', 5, 0), kszt('box', -1040, 0)], 14) };
/* 5 ręce wzdłuż ciała */
const bad5 = JSON.parse(JSON.stringify(RC)); for (const k of bad5.klatki) { k.rece.R.chwyt[1] = 60; k.rece.L.chwyt[1] = 60; k.rece.R.biegunLokcia = [0, 1, 0]; k.rece.L.biegunLokcia = [0, 1, 0]; }
W.rece_wzdluz_ciala = { dobre: J.receWzdluzCiala(v2, RC), zle: J.receWzdluzCiala(v2, bad5) };
/* 6 kolejne klatki różne / statyczne */
const bad6 = JSON.parse(JSON.stringify(PU)); bad6.klatki.splice(2, 0, { ...JSON.parse(JSON.stringify(bad6.klatki[1])), u: 0.4 });
const bad6b = JSON.parse(JSON.stringify(PL)); bad6b.klatki = [bad6b.klatki[0], { ...bad6b.klatki[0], u: 0.5 }, { ...bad6b.klatki[0], u: 1 }];
W.klatki_rozne = { dobre: [...J.klatkiRozne(v2, PU, false), ...J.klatkiRozne(v2, PL, true)], zle: [...J.klatkiRozne(v2, bad6, false), ...J.klatkiRozne(v2, bad6b, true)] };
/* 7 sprzęt rozpoznawczy */
const z1 = { cwiczenie: 'Suspended Push-Up', sprzet: [{ rodzaj: 'podloga' }, { rodzaj: 'zawieszenie' }] }, z2 = { cwiczenie: 'Suspended Push-Up', sprzet: [{ rodzaj: 'podloga' }, { rodzaj: 'sztanga' }] };
W.sprzet_rozpoznawczy = { dobre: [...J.sprzetRozpoznawczy(z1), ...J.sprzetRozpoznawczy({ cwiczenie: 'Push Up', sprzet: [] })], zle: J.sprzetRozpoznawczy(z2) };
/* 8 podstawa szeroka */
const bad8 = JSON.parse(JSON.stringify(SA)); for (const k of bad8.klatki) { k.nogi.R.kostka[2] = 8; k.nogi.L.kostka[2] = -8; }
W.podstawa_szeroka = { dobre: J.podstawaSzeroka(SA), zle: J.podstawaSzeroka(bad8) };
/* 9 szyja */
const bad9 = JSON.parse(JSON.stringify(PU)); for (const k of bad9.klatki) k.pochylenieGlowy = 0;
W.szyja_neutralna = { dobre: J.szyjaNeutralna(v2, PU), zle: J.szyjaNeutralna(v2, bad9) };
/* 10 etykieta błędu */
W.etykieta_bledu = { dobre: J.etykietaBledu(PU, { 'push.mis.partial': 'Skracanie ruchu.' }), zle: J.etykietaBledu(PU, {}) };
/* 11 odwiedzenie łokcia */
const bad11 = JSON.parse(JSON.stringify(PU)); for (const k of bad11.klatki) { k.rece.R.biegunLokcia = [0, 0, 1]; k.rece.L.biegunLokcia = [0, 0, -1]; }
W.odwiedzenie_lokcia = { dobre: J.odwiedzenieLokcia(v2, PU), zle: J.odwiedzenieLokcia(v2, bad11) };
/* 12 łokieć za barkiem (wariant wąski) */
const bad12 = JSON.parse(JSON.stringify(CL)); for (const k of bad12.klatki) { k.rece.R.biegunLokcia = [1, 0, 0.1]; k.rece.L.biegunLokcia = [1, 0, -0.1]; }
W.lokiec_za_barkiem = { dobre: J.lokiecZaBarkiem(v2, CL), zle: J.lokiecZaBarkiem(v2, bad12) };
/* remis „skrajnej”: sztywne ciało (odległość bark–kostka stała), miednica poza linią dopiero w drugiej klatce */
const sk = (pel) => ({ pelvis: pel, shoulderC: [100, 40, 0], legs: { R: { knee: [60, 25, 8], ankle: [0, 20, 8], heel: [0, 20, 8], toe: [0, 20, 8] }, L: { knee: [60, 25, -8], ankle: [0, 20, -8], heel: [0, 20, -8], toe: [0, 20, -8] } } });
const probki = (a, b) => [{ u: 0, f: { sk: sk(a) }, kf: {} }, { u: 1, f: { sk: sk(b) }, kf: {} }];
const q = { max_cm: 6, koniec: 'kostka_dalsza', tylko_skrajna: true };
W.skrajna_remis = { dobre: SENS.EWALUATORY.miednica_na_linii({ p: probki([50, 31, 0], [50, 31, 0]), parametry: q }), zle: SENS.EWALUATORY.miednica_na_linii({ p: probki([50, 31, 0], [50, 18, 0]), parametry: q }) };
/* kontrakt: błąd postawy może mieć deltę w u = 0, błąd zakresu nie */
const kontrakt = (p, cue) => waliduj(p, { rodzina: 'pushup_plank', cwiczenie: p.cwiczenie }).bledy.filter((b) => b.kod === 'blad-start').length;
const sagNaStarcie = JSON.parse(JSON.stringify(PL)); sagNaStarcie.bledy[0].klatki[0] = { u: 0, miednica: [0, -5, 0] };
const partialNaStarcie = JSON.parse(JSON.stringify(PU)); partialNaStarcie.bledy[0].klatki[0] = { u: 0, miednica: [0, -5, 0] };
W.kontrakt_start = { dobre: [kontrakt(sagNaStarcie)], zle: [kontrakt(partialNaStarcie)] };
console.log(JSON.stringify(W));
`;
const W = run(KOD) as Record<string, { dobre: unknown[]; zle: unknown[] }>;
const REGULY = ['blad_widoczny_stale', 'pod_podloga', 'styk_z_podloga_przod', 'zaslanianie_sprzetu', 'rece_wzdluz_ciala', 'klatki_rozne', 'sprzet_rozpoznawczy', 'podstawa_szeroka', 'szyja_neutralna', 'etykieta_bledu', 'odwiedzenie_lokcia', 'lokiec_za_barkiem'];

describe('reguły jakości póz (luki z recenzji ruchu): poza spełniająca bez komunikatu, łamiąca z komunikatem', () => {
  test.each(REGULY)('%s', (r) => {
    expect(W[r].dobre).toEqual([]); expect(W[r].zle.length).toBeGreaterThan(0); if (!['sprzet_rozpoznawczy', 'etykieta_bledu'].includes(r)) expect(String(W[r].zle[0])).toMatch(/\d/); /* komunikat z liczbą (poza regułami nazwowymi) */
  });
  test('naprawa luki „skrajna”: przy remisie odległości bark–kostka oceniana jest także późniejsza klatka', () => { expect(W.skrajna_remis.dobre).toEqual([]); expect(W.skrajna_remis.zle.length).toBeGreaterThan(0); });
  test('kontrakt: błąd postawy może mieć niezerową deltę w u = 0, błąd zakresu (partial) nadal nie', () => { expect(W.kontrakt_start.dobre).toEqual([0]); expect(W.kontrakt_start.zle[0]).toBeGreaterThan(0); });
});
