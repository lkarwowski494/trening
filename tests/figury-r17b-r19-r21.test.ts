/*
 * Reguły z recenzji n7 (27.10.2026), luki R17:
 * - R17b `styk_kazdego_podparcia`: R17 sprawdza tylko NAJNIŻSZY punkt ciała, więc stopy w Decline Push Up (nad skrzynią) nie były sprawdzane wcale — poza ze skrzynią 10 cm albo 0 cm
 *   (stopy 33–43 cm w powietrzu) przechodziła walidator. R17b: każda część ciała, która ma podpierać (dłonie i stopy w pompkach; każda zadeklarowana skrzynia/ławka), styka się z powierzchnią w KAŻDEJ klatce;
 * - R19 `podparcie_wyzej_niz_dlonie`: warianty decline pompki — w u = 0 linia kostka–bark nie wznosi się ku głowie ponad 5° (Decline z n6: +15,5°, n7: +0,3°, zwykła pompka +20,1°);
 * - R21 `baza_lezenia`: pozy leżące — środek miednicy w u = 0 na wysokości promienia kolizji tułowia z silnika (GIRTH.trunkCollide = 9,5 cm), najwyżej wisiCm wyżej, najwyżej lezenieUgniecenieCm niżej
 *   (8,0 cm starszych póz = 9,5 − 1,5; wartość bez źródła, KONWENCJA RYSUNKU). Dla płaskich póz dolna granica pokrywa się z R15 (kształt tułowia sięga 11,5 cm pod środkiem miednicy: 8,0 → −3,5 cm).
 * Zapis błędnych póz: tests/fixtures/figury-n6-bledne.json (nie edytować); pozostałe przypadki to mutacje póz z lib/figures/v2/poses.
 */
import * as path from 'path';
import { execFileSync } from 'child_process';

jest.setTimeout(240000);
const ROOT = path.join(__dirname, '..');
const run = (code: string) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', code], { cwd: ROOT, env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));

const KOD = `
import fs from 'node:fs';
import { waliduj } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-validate.mjs'))};
import * as J from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-jakosc.mjs'))};
import { v2 } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/agent-pozy/model.mjs'))};
const eng = typeof v2 === 'function' ? v2() : v2;
const POZY = ${JSON.stringify(path.join(ROOT, 'lib/figures/v2/poses'))};
const wczytaj = (r) => JSON.parse(fs.readFileSync(POZY + '/' + r + '.json', 'utf8')).cwiczenia;
const kopia = (x) => JSON.parse(JSON.stringify(x));
const pp = wczytaj('pushup_plank'), cf = wczytaj('core_floor');
const fx = JSON.parse(fs.readFileSync(${JSON.stringify(path.join(ROOT, 'tests/fixtures/figury-n6-bledne.json'))}, 'utf8'));
const dec6 = fx.poze[1].poza;
const r17b = (p) => J.stykKazdegoPodparcia(eng, p).length, r17 = (p) => J.stykZPodlozem(eng, p).length;
const kody = (p, rodzina) => [...new Set(waliduj(p, { rodzina, cwiczenie: p.cwiczenie }).bledy.map((b) => (b.szczegol.match(/^(?:jakosc: )?([a-z0-9_]+):/) ?? [])[1]))];
const skrzynia = (p, top) => { const q = kopia(p); q.sprzet.find((g) => g.rodzaj === 'skrzynia').top = top; return q; };
const wszystkieKlatki = (p, f) => { const q = kopia(p); for (const k of q.klatki) f(k); return q; };
const out = {};
/* R17b */
const dec = pp['Decline Push Up'];
out.decline = { dane: r17b(dec), n6: r17b(dec6), s10: r17b(skrzynia(dec, 10)), s10r17: r17(skrzynia(dec, 10)), s0: r17b(skrzynia(dec, 0)), s0r17: r17(skrzynia(dec, 0)), s10kody: kody(skrzynia(dec, 10), 'pushup_plank'), s10szczegol: J.stykKazdegoPodparcia(eng, skrzynia(dec, 10))[0] ?? '' };
const inne = (p, nazwa) => { const q = kopia(p); q.cwiczenie = nazwa; return q; };
out.inne = { s10: J.stykKazdegoPodparcia(eng, inne(skrzynia(dec, 10), 'Test Box Hold')).length, dane: J.stykKazdegoPodparcia(eng, inne(dec, 'Test Box Hold')).length, szczegol: J.stykKazdegoPodparcia(eng, inne(skrzynia(dec, 10), 'Test Box Hold'))[0] ?? '' };
out.incline = { dane: r17b(pp['Incline Push Up']), zawieszona: r17b(skrzynia(pp['Incline Push Up'], 60)), zawieszonaR17: r17(skrzynia(pp['Incline Push Up'], 60)) };
const dlonieWGorze = wszystkieKlatki(pp['Push Up'], (k) => { k.rece.R.chwyt[1] += 10; k.rece.L.chwyt[1] += 10; });
const stopyWGorze = wszystkieKlatki(pp['Push Up'], (k) => { k.nogi.R.kostka[1] += 10; k.nogi.L.kostka[1] += 10; });
out.pushup = { dane: r17b(pp['Push Up']), dlonie: r17b(dlonieWGorze), dlonieR17: r17(dlonieWGorze), stopy: r17b(stopyWGorze), stopyR17: r17(stopyWGorze), dlonieSzczegol: J.stykKazdegoPodparcia(eng, dlonieWGorze)[0] ?? '', stopySzczegol: J.stykKazdegoPodparcia(eng, stopyWGorze)[0] ?? '' };
out.lot = (() => { J.LOT['Push Up'] = 'test: lot zadeklarowany'; const n = r17b(stopyWGorze); delete J.LOT['Push Up']; return n; })();
out.nogiWPowietrzu = { deadBug: r17b(cf['Dead Bug']), legRaise: r17b(cf['Lying Leg Raise']) };
out.wszystkie = {}; for (const f of fs.readdirSync(POZY)) { const r = f.replace('.json', ''); out.wszystkie[r] = Object.entries(wczytaj(r)).filter(([, p]) => r17b(p) || J.podparcieWyzejNizDlonie(eng, p, r).length || J.bazaLezenia(eng, p).length).map(([c]) => c); }
/* R19 */
const nach = (p) => { const s = eng.keyframeFrame(p, 0).sk; const a = s.legs.R.ankle, b = s.shoulderC; return Math.atan2(b[1] - a[1], Math.abs(b[0] - a[0])) * 180 / Math.PI; };
out.r19 = { dane: J.podparcieWyzejNizDlonie(eng, dec, 'pushup_plank').length, n6: J.podparcieWyzejNizDlonie(eng, dec6, 'pushup_plank').length, n6kat: nach(dec6), danekat: nach(dec), zwykla: J.podparcieWyzejNizDlonie(eng, pp['Push Up'], 'pushup_plank').length, zwyklakat: nach(pp['Push Up']), inna: J.podparcieWyzejNizDlonie(eng, dec6, 'core_floor').length, n6kody: kody(dec6, 'pushup_plank'), prog: J.PROGI.declineNachylenieMaxDeg };
/* R21 */
const baza = (p, dy) => { const q = kopia(p); for (const k of q.klatki) k.miednica[1] += dy; return q; };
const b21 = (p) => J.bazaLezenia(eng, p).length;
out.r21 = { trunkCollide: eng.GIRTH.trunkCollide, stala: J.lezenieBazaCm(eng), ugniecenie: J.PROGI.lezenieUgniecenieCm, crunch80: b21(cf['Crunch']), crunch95: b21(baza(cf['Crunch'], 1.5)), crunch70: b21(baza(cf['Crunch'], -1)), crunch70szczegol: J.bazaLezenia(eng, baza(cf['Crunch'], -1))[0] ?? '', crunch105: b21(baza(cf['Crunch'], 2.5)), crunch106: b21(baza(cf['Crunch'], 2.6)), crunch11: b21(baza(cf['Crunch'], 3.2)),
  cocoons: b21(cf['Cocoons']), superman: b21(cf['Superman']), birdDog: b21(cf['Bird Dog']), pushup: b21(pp['Push Up']), r15Crunch70: J.ksztaltyNadPodloga(eng, baza(cf['Crunch'], -1)).length };
console.log(JSON.stringify(out));
`;
type R = {
  decline: { dane: number; n6: number; s10: number; s10r17: number; s0: number; s0r17: number; s10kody: string[]; s10szczegol: string };
  inne: { s10: number; dane: number; szczegol: string };
  incline: { dane: number; zawieszona: number; zawieszonaR17: number };
  pushup: { dane: number; dlonie: number; dlonieR17: number; stopy: number; stopyR17: number; dlonieSzczegol: string; stopySzczegol: string };
  lot: number; nogiWPowietrzu: { deadBug: number; legRaise: number }; wszystkie: Record<string, string[]>;
  r19: { dane: number; n6: number; n6kat: number; danekat: number; zwykla: number; zwyklakat: number; inna: number; n6kody: string[]; prog: number };
  r21: { trunkCollide: number; stala: number; ugniecenie: number; crunch80: number; crunch95: number; crunch70: number; crunch70szczegol: string; crunch105: number; crunch106: number; crunch11: number; cocoons: number; superman: number; birdDog: number; pushup: number; r15Crunch70: number };
};
const W = run(KOD) as R;

describe('R17b styk_kazdego_podparcia: luka R17 z recenzji n7 (stopy w Decline niesprawdzane)', () => {
  test('poza Decline Push Up w danych (skrzynia 43 cm, palce na wierzchu) przechodzi', () => { expect(W.decline.dane).toBe(0); });
  test('Decline ze skrzynią 10 cm: stopy wiszą w powietrzu — R17 tego nie widzi (najniższe są dłonie), R17b odrzuca z nazwą stopy', () => {
    expect(W.decline.s10r17).toBe(0); expect(W.decline.s10).toBeGreaterThan(0); expect(W.decline.s10szczegol).toMatch(/stopa/);
  });
  test('Decline ze skrzynią 0 cm (wierzch na poziomie podłogi): R17 przechodzi, R17b odrzuca', () => { expect(W.decline.s0r17).toBe(0); expect(W.decline.s0).toBeGreaterThan(0); });
  test('poza Decline z n6 (fixture) ma stopy NA skrzyni 10 cm, więc styk jest poprawny (R17b = 0); jej błąd (za niskie podwyższenie) łapie R19', () => { expect(W.decline.n6).toBe(0); });
  test('pełny walidator odrzuca Decline ze skrzynią 10 cm regułą styk_kazdego_podparcia', () => { expect(W.decline.s10kody).toContain('styk_kazdego_podparcia'); });
  test('ćwiczenie spoza listy pompek (reguła ogólna dla skrzyni): stopy w każdej klatce nad skrzynią i nigdy na niej — odrzucone; stopy na skrzyni — przechodzą', () => { expect(W.inne.dane).toBe(0); expect(W.inne.s10).toBeGreaterThan(0); expect(W.inne.szczegol).toMatch(/nigdy go nie dotyka/); });
  test('Incline Push Up: poza w danych przechodzi, a skrzynia 15 cm wyżej (dłonie w powietrzu, najniżej stopy na podłodze) jest odrzucona, choć R17 przechodzi', () => {
    expect(W.incline.dane).toBe(0); expect(W.incline.zawieszona).toBeGreaterThan(0); expect(W.incline.zawieszonaR17).toBe(0);
  });
  test('Push Up: dłonie 10 cm nad podłogą (najniżej stopy) — R17 przechodzi, R17b odrzuca z nazwą dłoni', () => { expect(W.pushup.dane).toBe(0); expect(W.pushup.dlonieR17).toBe(0); expect(W.pushup.dlonie).toBeGreaterThan(0); expect(W.pushup.dlonieSzczegol).toMatch(/dłoń/); });
  test('Push Up: stopy 10 cm nad podłogą (najniżej dłonie) — R17 przechodzi, R17b odrzuca z nazwą stopy', () => { expect(W.pushup.stopyR17).toBe(0); expect(W.pushup.stopy).toBeGreaterThan(0); expect(W.pushup.stopySzczegol).toMatch(/stopa/); });
  test('zadeklarowany lot (LOT) wyłącza regułę', () => { expect(W.lot).toBe(0); });
  test('brak fałszywego alarmu: leżące pozy z nogami w powietrzu (Dead Bug, Lying Leg Raise) nie podpierają się stopami', () => { expect(W.nogiWPowietrzu).toEqual({ deadBug: 0, legRaise: 0 }); });
  test.each(['core_floor', 'pushup_plank', 'pull_up'])('brak fałszywych alarmów R17b, R19 i R21 na pozach rodziny %s w danych', (r) => { expect(W.wszystkie[r]).toEqual([]); });
});

describe('R19 podparcie_wyzej_niz_dlonie: wariant decline pompki', () => {
  test('poza Decline w danych: w u = 0 linia kostka–bark ≤ próg (konwencja 5°); Decline z n6 (+15,5°) jest odrzucona', () => {
    expect(W.r19.prog).toBe(5); expect(W.r19.danekat).toBeLessThanOrEqual(5); expect(W.r19.dane).toBe(0);
    expect(W.r19.n6kat).toBeGreaterThan(15); expect(W.r19.n6).toBeGreaterThan(0); expect(W.r19.n6kody).toContain('podparcie_wyzej_niz_dlonie');
  });
  test('reguła dotyczy tylko wariantu decline pompki: zwykła pompka (+20°) i ta sama poza w innej rodzinie nie są sprawdzane', () => { expect(W.r19.zwyklakat).toBeGreaterThan(5); expect(W.r19.zwykla).toBe(0); expect(W.r19.inna).toBe(0); });
});

describe('R21 baza_lezenia: jedna wysokość bazowa póz leżących', () => {
  test('wysokość bazowa pochodzi z silnika (promień kolizji tułowia GIRTH.trunkCollide = 9,5), ugniecenie 1,5 cm to konwencja w PROGI', () => { expect(W.r21.trunkCollide).toBe(9.5); expect(W.r21.stala).toBe(9.5); expect(W.r21.ugniecenie).toBe(1.5); });
  test('pozy leżące: 8,0 (starsze) i 9,5 (pilotaż) przechodzą; Cocoons 8,2 i Superman (brzuchem) przechodzą', () => { expect(W.r21.crunch80).toBe(0); expect(W.r21.crunch95).toBe(0); expect(W.r21.cocoons).toBe(0); expect(W.r21.superman).toBe(0); });
  test('miednica obniżona do 7,0 (pokrętło „obniż bazę, żeby liczba się zmieściła”) jest odrzucona z wartością w komunikacie; dla płaskiej pozy ten sam błąd łapie też R15 (dolna granica R21 = próg R15)', () => { expect(W.r21.crunch70).toBeGreaterThan(0); expect(W.r21.crunch70szczegol).toMatch(/7[.,]0/); expect(W.r21.r15Crunch70).toBeGreaterThan(0); });
  test('miednica uniesiona: 10,5 (granica wisiCm) przechodzi, 10,6 i 11,2 są odrzucone', () => { expect(W.r21.crunch105).toBe(0); expect(W.r21.crunch106).toBeGreaterThan(0); expect(W.r21.crunch11).toBeGreaterThan(0); });
  test('reguła nie dotyczy póz nieleżących: czworaki (Bird Dog) i pompka', () => { expect(W.r21.birdDog).toBe(0); expect(W.r21.pushup).toBe(0); });
});
