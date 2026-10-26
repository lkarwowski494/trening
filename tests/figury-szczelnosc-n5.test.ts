/*
 * Szczelność bramek póz figur v2 mierzona wstecz (docs/53, recenzja n5, 26.10.2026): 5 póz, które recenzent n5 ocenił jako BŁĄD (tests/fixtures/figury-n5-bledne.json, zapis póz z jakosc-r2 @ aa3093f),
 * musi odrzucić dzisiejszy walidator — niezmiennikami konstrukcyjnymi silnika (taśma stała, kolano po swojej stronie) albo regułami jakości (R13–R16). To pomiar na próbie, na której reguły wymyślono (nie dowód szczelności na nowych pozach);
 * stąd osobno test na pozach spoza próby (wszystkie pozy z danych przechodzą bez błędu: brak fałszywych alarmów).
 * Ostatni błąd (Heel Touchers: kształt tułowia pod podłogą) był wadą rysowania silnika, usuniętą w 1ff58bd; reguła R15 łapie ją na kształtach sprzed poprawki (sprawdzone na silniku sprzed poprawki: −6,3 cm; tu: kształty syntetyczne o tej wartości).
 */
import * as path from 'path';
import { execFileSync } from 'child_process';

jest.setTimeout(180000);
const ROOT = path.join(__dirname, '..');
const run = (code: string) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', code], { cwd: ROOT, env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));

const KOD = `
import fs from 'node:fs';
import { waliduj } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-validate.mjs'))};
import * as J from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-jakosc.mjs'))};
const fx = JSON.parse(fs.readFileSync(${JSON.stringify(path.join(ROOT, 'tests/fixtures/figury-n5-bledne.json'))}, 'utf8'));
const n5 = {};
for (const { rodzina, cwiczenie, poza } of fx.poze) { const w = waliduj(poza, { rodzina, cwiczenie }); n5[cwiczenie] = { ok: w.ok, kody: [...new Set(w.bledy.map((b) => b.kod + ':' + ((b.szczegol.match(/^(?:jakosc: )?([a-z_]+):/) ?? [])[1] ?? '')))] }; }
/* R15 na kształtach o głębokości błędu z n5 (−6,4 cm): silnik syntetyczny */
const sztuczny = (y) => ({ dataShapes: () => [{ k: 'poly', id: 'torso', pts: [[0, y], [10, y], [10, 20]] }] });
const poza = { bledy: [], klatki: [{ u: 0 }, { u: 1 }] };
const heel = { dobre: J.ksztaltyNadPodloga(sztuczny(-2.0), poza).length, zle: J.ksztaltyNadPodloga(sztuczny(-6.4), poza).length };
/* pozy spoza próby: wszystkie pozy z danych przechodzą (brak fałszywych alarmów) */
const dane = {};
for (const r of ['pushup_plank', 'core_floor']) { const d = JSON.parse(fs.readFileSync(${JSON.stringify(path.join(ROOT, 'lib/figures/v2/poses')) } + '/' + r + '.json', 'utf8')); dane[r] = Object.entries(d.cwiczenia).filter(([, p]) => !waliduj(p, { rodzina: r, cwiczenie: p.cwiczenie }).ok).map(([c]) => c); }
console.log(JSON.stringify({ n5, heel, dane }));
`;
const W = run(KOD) as { n5: Record<string, { ok: boolean; kody: string[] }>; heel: { dobre: number; zle: number }; dane: Record<string, string[]> };

describe('szczelność bramek mierzona wstecz na 5 błędach z recenzji n5', () => {
  test('Suspended Fallout: taśma zawieszenia zmienia długość 131,7 → 207,2 cm (niezmiennik silnika tasma-dlugosc)', () => { expect(W.n5['Suspended Fallout'].ok).toBe(false); expect(W.n5['Suspended Fallout'].kody).toContain('tasma-dlugosc:'); });
  test('Mountain Climbers: kolano po drugiej stronie osi ciała niż biodro (niezmiennik silnika kolano-strona)', () => { expect(W.n5['Mountain Climbers'].ok).toBe(false); expect(W.n5['Mountain Climbers'].kody).toContain('kolano-strona:'); });
  test('Barbell Rollout from Bench: kolano 13,1 cm nad blatem ławki (R13 podparcie_kolan)', () => { expect(W.n5['Barbell Rollout from Bench'].ok).toBe(false); expect(W.n5['Barbell Rollout from Bench'].kody).toContain('jakosc:podparcie_kolan'); });
  test('Tuck Crunch: tułów sztywny jak deska i lędźwie 3,0 cm nad podłogą (R16 kregoslup_zwija_sie, ledzwie_przy_podlodze; wyjątek R14 usunięty)', () => { expect(W.n5['Tuck Crunch'].ok).toBe(false); expect(W.n5['Tuck Crunch'].kody).toContain('jakosc:kregoslup_zwija_sie'); expect(W.n5['Tuck Crunch'].kody).toContain('jakosc:ledzwie_przy_podlodze'); });
  test('Alternate Heel Touchers: kształt tułowia pod podłogą łapie R15; sam błąd rysowania naprawiony w silniku (n5 przechodzi, bo wada była w rysunku, nie w pozie)', () => { expect(W.heel.dobre).toBe(0); expect(W.heel.zle).toBeGreaterThan(0); expect(W.n5['Alternate Heel Touchers'].ok).toBe(true); });
  test('szczelność: co najmniej 4 z 5 odrzuca pozę z n5 bez udziału poprawki silnika, piąty przypadek pokryty regułą R15 (5/5)', () => { const odrzucone = Object.values(W.n5).filter((x) => !x.ok).length; expect(odrzucone).toBe(4); expect(W.heel.zle).toBeGreaterThan(0); });
});

describe('brak fałszywych alarmów', () => {
  test.each(['pushup_plank', 'core_floor'])('wszystkie pozy rodziny %s w danych przechodzą walidator', (r) => { expect(W.dane[r]).toEqual([]); });
});
