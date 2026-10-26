/*
 * Reguły sensu rund 4 i 5 (badacz, 26.10.2026) — L-036: każdy NOWY typ reguły sprawdzony na PRAWDZIWEJ pozie (dane kontraktu → ten sam silnik co aplikacja, nie szkielet z liczb):
 * kolano_zakres_ruch, rozstaw_zakres (r4), stopien_swobody, punkt_zakres (r5), pole `wymaga` (poza@2). Dla każdego: poza spełniająca (brak naruszeń) i łamiąca (komunikat z liczbami).
 * Do tego poprawki badacza: jedna ręka pracująca z dowolnego sprzętu (trzyma), potrójny wyprost z parametrem `nogi`, zawias jednonóż po nodze podporowej, biodro ze znakiem w regule,
 * rodziny „behind the neck”, zapadka naruszeń gotowych figur = 0, oraz ćwiczenia czekające na kontrakt.
 */
import * as path from 'path';
import { execFileSync } from 'child_process';

jest.setTimeout(240000);
const ROOT = path.join(__dirname, '..');
const run = (code: string): any => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-sens.mjs'))}; import { loadV2 } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-build.mjs'))}; const os = await import('node:os'); const fs = await import('node:fs'); const dir = fs.mkdtempSync(os.tmpdir() + '/r45-'); process.on('exit', () => fs.rmSync(dir, { recursive: true, force: true })); const { v2 } = loadV2(dir); ${code}`], { env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }));

/** Wspólne pomoce: poza z danych (klatki kluczowe) → próbki jak w walidatorze (naruszenia() z v2-sens.mjs). */
const PRE = `
const ST = (x) => ({ R: { kostka: [x[0], 7, x[1]] }, L: { kostka: [x[0], 7, -x[1]] } });
const arm = (g) => ({ R: { chwyt: [g[0], g[1], g[2]] }, L: { chwyt: [g[0], g[1], -g[2]] } });
const kf = (u, o = {}) => ({ u, miednica: [0, 89.5, 0], pochylenieTulowia: 0, nogi: ST([0, 14]), rece: arm([8, 80, 24]), ...o });
const poza = (klatki, sprzet = [{ rodzaj: 'podloga', x0: -150, x1: 150 }]) => ({ kontrakt: v2.CONTRACT.id, rodzina: 'core_standing', cwiczenie: 'Test', sprzet, klatki, bledy: [] });
const ocen = (d, typ, parametry) => m.naruszenia(v2, d, [{ id: 'r', typ, grupa: 'g', parametry }]).flatMap((n) => n.opisy);
`;

describe('kolano_zakres_ruch (r4) na prawdziwej pozie: przysiad z danych', () => {
  const kod = `${PRE}
  const sq = (y) => poza([kf(0), kf(0.5, { miednica: [-10, y, 0], pochylenieTulowia: 30, nogi: ST([0, 14]) }), kf(1)]);
  const q = { nogi: 'obie', min_max_deg: 80, max_min_deg: 15 };
  const jednaNoga = poza([kf(0, { nogi: { R: { kostka: [0, 7, 8.5] }, L: { kostka: [-61, 33, -8.5] } } }), kf(0.5, { miednica: [0, 60, 0], nogi: { R: { kostka: [0, 7, 8.5] }, L: { kostka: [-75, 25, -8.5] } } }), kf(1, { nogi: { R: { kostka: [0, 7, 8.5] }, L: { kostka: [-61, 33, -8.5] } } })]);
  console.log(JSON.stringify({ glebokiDobry: ocen(sq(52), 'kolano_zakres_ruch', q), plytki: ocen(sq(76), 'kolano_zakres_ruch', q),
    jednaObie: ocen(jednaNoga, 'kolano_zakres_ruch', { nogi: 'obie', min_max_deg: 60 }), jednaJedna: ocen(jednaNoga, 'kolano_zakres_ruch', { nogi: 'co_najmniej_jedna', min_max_deg: 60 }), minMin: ocen(sq(52), 'kolano_zakres_ruch', { nogi: 'obie', min_min_deg: 20 }),
    maxK: v2.jointAngles(v2.keyframeFrame(sq(52), 0.5).sk, 'R').knee }));`;
  const w = run(kod);
  test('głęboki przysiad (kolano ≥ 80°, prostuje się ≤ 15°) nie łamie reguły; płytki łamie z liczbą (kolano R i L)', () => {
    expect(w.maxK).toBeGreaterThan(80); expect(w.glebokiDobry).toEqual([]); expect(w.plytki.join('|')).toMatch(/kolano R w ruchu dochodzi tylko do \d+\.\d°, a ma sięgać ≥ 80°/); expect(w.plytki.join('|')).toContain('kolano L');
  });
  test('jednonóż: noga wolna prosta — „obie” łamie (kolano L), „co_najmniej_jedna” przechodzi (pracuje noga podporowa)', () => {
    expect(w.jednaObie.join('|')).toContain('kolano L'); expect(w.jednaJedna).toEqual([]);
  });
  test('min_min_deg: kolano prawie prosta noga (≈ 10°) — łamie regułę „zawsze lekko ugięte”', () => { expect(w.minMin.join('|')).toMatch(/kolano [RL] schodzi do 10\.0°, a ma być zawsze ≥ 20°/); });
});

describe('rozstaw_zakres (r4) na prawdziwej pozie: odwodzenie nóg', () => {
  const w = run(`${PRE}
  const roz = (a, b) => poza([kf(0, { nogi: ST([0, a]) }), kf(1, { nogi: ST([0, b]) })]);
  console.log(JSON.stringify({ szeroko: ocen(roz(10, 34), 'rozstaw_zakres', { punkt: 'kostki', min_cm: 15 }), stale: ocen(roz(14, 14), 'rozstaw_zakres', { punkt: 'kostki', min_cm: 15 }), kolanaZle: ocen(roz(14, 14), 'rozstaw_zakres', { punkt: 'kolana', min_cm: 10 }),
    kolanaDobre: ocen(roz(8.5, 30), 'rozstaw_zakres', { punkt: 'kolana', min_cm: 10 }) }));`);
  test('kostki rozchodzą się z ±10 do ±34 cm (rozstaw 20 → 68, zmiana 48 cm) — reguła spełniona; stałe ±14 — łamie z liczbą', () => {
    expect(w.szeroko).toEqual([]); expect(w.stale.join('|')).toMatch(/odległość kostek zmienia się tylko o 0\.0 cm.*a ma ≥ 15 cm/);
  });
  test('kolana: punkt „kolana” liczy kolana (nie kostki)', () => { expect(w.kolanaDobre).toEqual([]); expect(w.kolanaZle.join('|')).toContain('kolan zmienia się tylko o'); });
});

describe('stopien_swobody (r5) na prawdziwej pozie: skręt tułowia, nadgarstek, szyja', () => {
  const w = run(`${PRE}
  const skret = (a, b, pitch = 0, extra = {}) => poza([kf(0, { skretTulowia: a, pochylenieTulowia: pitch, ...extra }), kf(0.5, { skretTulowia: (a + b) / 2, pochylenieTulowia: pitch, ...extra }), kf(1, { skretTulowia: b, pochylenieTulowia: pitch, ...extra })]);
  const lez = (a, b) => poza([kf(0, { miednica: [0, 8, 0], pochylenieTulowia: -90, pochylenieGlowy: -90, skretTulowia: a, nogi: { R: { kostka: [35, 7, 15] }, L: { kostka: [35, 7, -15] } }, rece: arm([0, 20, 24]) }), kf(1, { miednica: [0, 8, 0], pochylenieTulowia: -90, pochylenieGlowy: -90, skretTulowia: b, nogi: { R: { kostka: [35, 7, 15] }, L: { kostka: [35, 7, -15] } }, rece: arm([0, 20, 24]) })]);
  const reka = (a, b) => poza([kf(0, { rece: { R: { chwyt: [8, 80, 24], zgiecieNadgarstka: a }, L: { chwyt: [8, 80, -24], zgiecieNadgarstka: a } } }), kf(1, { rece: { R: { chwyt: [8, 80, 24], zgiecieNadgarstka: b }, L: { chwyt: [8, 80, -24], zgiecieNadgarstka: b } } })]);
  const jednaReka = poza([kf(0, { rece: { R: { chwyt: [8, 80, 24], zgiecieNadgarstka: -40 }, L: { chwyt: [8, 80, -24] } } }), kf(1, { rece: { R: { chwyt: [8, 80, 24], zgiecieNadgarstka: 40 }, L: { chwyt: [8, 80, -24] } } })]);
  const szyja = (gl) => poza([kf(0), kf(1, { pochylenieGlowy: gl })]);
  const q = { pole: 'skretTulowia', min_zakres: 40 };
  console.log(JSON.stringify({ obieStrony: ocen(skret(-30, 30), 'stopien_swobody', q), malySkret: ocen(skret(-10, 10), 'stopien_swobody', q), lezacy: ocen(lez(-30, 30), 'stopien_swobody', q), lezacyMaly: ocen(lez(-5, 5), 'stopien_swobody', q),
    jedna: ocen(skret(0, 30), 'stopien_swobody', { pole: 'skretTulowia', min_abs: 25 }), jednaZle: ocen(skret(0, 10), 'stopien_swobody', { pole: 'skretTulowia', min_abs: 25 }),
    maxZakres: ocen(skret(-30, 30), 'stopien_swobody', { pole: 'skretTulowia', max_zakres: 20 }), minMax: ocen(skret(-30, 30), 'stopien_swobody', { pole: 'skretTulowia', min: -20, max: 20 }),
    nadgarstek: ocen(reka(-30, 40), 'stopien_swobody', { pole: 'zgiecieNadgarstka', strona: 'obie', min_zakres: 50 }), nadgarstekZle: ocen(reka(0, 20), 'stopien_swobody', { pole: 'zgiecieNadgarstka', strona: 'obie', min_zakres: 50 }),
    jednaRekaDowolna: ocen(jednaReka, 'stopien_swobody', { pole: 'zgiecieNadgarstka', strona: 'dowolna', min_zakres: 50 }), jednaRekaObie: ocen(jednaReka, 'stopien_swobody', { pole: 'zgiecieNadgarstka', strona: 'obie', min_zakres: 50 }), jednaRekaR: ocen(jednaReka, 'stopien_swobody', { pole: 'zgiecieNadgarstka', strona: 'R', min_zakres: 50 }),
    szyjaFlex: ocen(szyja(35), 'stopien_swobody', { pole: 'zgiecieSzyi', osiaga_co_najmniej: 25 }), szyjaProsta: ocen(szyja(0), 'stopien_swobody', { pole: 'zgiecieSzyi', osiaga_co_najmniej: 25 }),
    szyjaLezacaWOsi: ocen(lez(0, 0), 'stopien_swobody', { pole: 'zgiecieSzyi', max: 5 }), szyjaLezacaDomyslna: ocen(poza([kf(0, { miednica: [0, 8, 0], pochylenieTulowia: -90, nogi: { R: { kostka: [35, 7, 15] }, L: { kostka: [35, 7, -15] } }, rece: arm([0, 20, 24]) }), kf(1, { miednica: [0, 8, 0], pochylenieTulowia: -90, nogi: { R: { kostka: [35, 7, 15] }, L: { kostka: [35, 7, -15] } }, rece: arm([0, 20, 24]) })]), 'stopien_swobody', { pole: 'zgiecieSzyi', max: 5 }),
    kregoslup: ocen(poza([kf(0), kf(1, { zgiecieKregoslupa: 30 })]), 'stopien_swobody', { pole: 'zgiecieKregoslupa', osiaga_co_najmniej: 20 }), tulowPoza1: ocen(poza([kf(0), kf(1, { pochylenieTulowia: 50 })]), 'stopien_swobody', { pole: 'pochylenieTulowia', max: 20 }),
    odSkeletuSkret: m.POLA_POZA2 }));`);
  test('skręt −30…+30° (zakres 60 ≥ 40): spełnia; −10…+10° łamie z liczbą (zakres 20)', () => { expect(w.obieStrony).toEqual([]); expect(w.malySkret.join('|')).toMatch(/skretTulowia zmienia się tylko o 20\.0.*zakres ma być ≥ 40/); });
  test('skręt względem ciała, nie świata: w leżeniu na plecach (tułów poziomo) te same wartości dają ten sam wynik', () => { expect(w.lezacy).toEqual([]); expect(w.lezacyMaly.join('|')).toMatch(/zmienia się tylko o 10\.0/); });
  test('min_abs: skręt do 30° w jedną stronę spełnia ≥ 25°; do 10° łamie; max_zakres i min/max w całym ruchu', () => {
    expect(w.jedna).toEqual([]); expect(w.jednaZle.join('|')).toMatch(/nie osiąga \|wartości\| ≥ 25.*największa 10\.0/); expect(w.maxZakres.join('|')).toMatch(/zmienia się o 60\.0, a zakres ma być ≤ 20/); expect(w.minMax.join('|')).toMatch(/skretTulowia (schodzi do -30\.0|dochodzi do 30\.0)/);
  });
  test('pole ręki (nadgarstek): „obie” wymaga obu rąk, „dowolna” jednej, „R” wskazanej; zakres 70° spełnia ≥ 50°, 20° łamie', () => {
    expect(w.nadgarstek).toEqual([]); expect(w.nadgarstekZle.join('|')).toMatch(/zgiecieNadgarstka R zmienia się tylko o 20\.0/); expect(w.jednaRekaDowolna).toEqual([]); expect(w.jednaRekaR).toEqual([]); expect(w.jednaRekaObie.join('|')).toContain('zgiecieNadgarstka L');
  });
  test('zgiecieSzyi z geometrii szkieletu: głowa 35° przed osią tułowia spełnia ≥ 25°, głowa w osi łamie; w leżeniu głowa w osi tułowia = 0 (nie fałszywe 70° z różnicy kątów), a domyślna głowa w leżeniu wychodzi poza oś', () => {
    expect(w.szyjaFlex).toEqual([]); expect(w.szyjaProsta.join('|')).toMatch(/dochodzi tylko do 0\.0/); expect(w.szyjaLezacaWOsi).toEqual([]); expect(w.szyjaLezacaDomyslna.join('|')).toMatch(/zgiecieSzyi dochodzi do (-)?\d+\.\d, a ma być ≤ 5/);
  });
  test('pola poza@1 (zgiecieKregoslupa, pochylenieTulowia) działają tym samym typem', () => { expect(w.kregoslup).toEqual([]); expect(w.tulowPoza1.join('|')).toContain('pochylenieTulowia dochodzi do 50.0, a ma być ≤ 20'); });
  test('lista pól poza@2 w regułach = pola kontraktu (nazwy zgodne z silnikiem)', () => { expect(Object.keys(w.odSkeletuSkret).sort()).toEqual(['obrotPrzedramienia', 'obrotTulowia', 'przechylGlowy', 'przechylMiednicy', 'przechylTulowia', 'przesuniecieBoczne', 'skretTulowia', 'uniesienieBarkow', 'wysuniecieBarkow', 'zgiecieNadgarstka']); });
});

describe('punkt_zakres (r5) na prawdziwej pozie: krążenie dłoni i rolowanie', () => {
  const w = run(`${PRE}
  const kolo = (r) => poza([0, 0.25, 0.5, 0.75, 1].map((u) => { const a = u * 2 * Math.PI; return kf(u, { rece: { R: { chwyt: [20 + r * Math.cos(a), 95 + r * Math.sin(a), 24] }, L: { chwyt: [20 + r * Math.cos(a), 95 + r * Math.sin(a), -24] } } }); }));
  const pion = poza([kf(0, { rece: arm([20, 85, 24]) }), kf(1, { rece: arm([20, 105, 24]) })]);
  const toczenie = poza([kf(0, { miednica: [0, 30, 0] }), kf(1, { miednica: [0, 60, 0] })]);
  console.log(JSON.stringify({ kolo: ocen(kolo(8), 'punkt_zakres', { punkt: 'dlonie', osie: ['x', 'y'], tryb: 'wszystkie', min_cm: 10 }), pion: ocen(pion, 'punkt_zakres', { punkt: 'dlonie', osie: ['x', 'y'], tryb: 'wszystkie', min_cm: 10 }), pionDowolna: ocen(pion, 'punkt_zakres', { punkt: 'dlonie', osie: ['x', 'y'], tryb: 'dowolna', min_cm: 10 }),
    miednica: ocen(toczenie, 'punkt_zakres', { punkt: 'miednica', osie: ['y'], tryb: 'dowolna', min_cm: 20 }), miednicaZle: ocen(toczenie, 'punkt_zakres', { punkt: 'miednica', osie: ['x', 'z'], tryb: 'dowolna', min_cm: 5 }),
    kostkiDowolna: ocen(pion, 'punkt_zakres', { punkt: 'dlonie', strona: 'dowolna', osie: ['y'], tryb: 'wszystkie', min_cm: 15 }) }));`);
  test('dłonie po okręgu r = 8 cm (zakres 16 cm w x i y): tryb „wszystkie” spełniony; ruch tylko w pionie łamie „wszystkie” (oś x), spełnia „dowolna”', () => {
    expect(w.kolo).toEqual([]); expect(w.pion.join('|')).toMatch(/x: 0\.0 cm, y: 20\.0 cm.*każda oś ma ≥ 10 cm/); expect(w.pionDowolna).toEqual([]);
  });
  test('miednica rolowana w pionie 30 cm: „dowolna” w osi y spełnia; w osiach x/z łamie z liczbą; strona „dowolna” dla dłoni', () => {
    expect(w.miednica).toEqual([]); expect(w.miednicaZle.join('|')).toMatch(/ruch punktu „miednica”.*x: 0\.0 cm, z: 0\.0 cm/); expect(w.kostkiDowolna).toEqual([]);
  });
});

describe('poprawki badacza i wdrożenie (r4, r5)', () => {
  test('(c) potrojny_wyprost: parametr „nogi” = obie wymaga obu nóg (stary alias „strony” nadal czytany); reguła olympic.wyprost_bioder_kolan używa „nogi”', () => {
    const w = run(`${PRE}
    const nogaGiętaL = (k) => kf(0, { nogi: { R: { kostka: [0, 5.5, 8.5] }, L: { kostka: [10, 40, -8.5] } } });
    const d = poza([nogaGiętaL(), nogaGiętaL()]); const q = { max_kolano_deg: 15, max_biodro_deg: 15 };
    console.log(JSON.stringify({ obie: ocen(d, 'potrojny_wyprost', { nogi: 'obie', ...q }), alias: ocen(d, 'potrojny_wyprost', { strony: 'obie', ...q }), jedna: ocen(d, 'potrojny_wyprost', { nogi: 'co_najmniej_jedna', ...q }),
      olympic: m.wczytajSens().rodziny.olympic.reguly.wyprost_bioder_kolan.parametry }));`);
    expect(w.obie.length).toBeGreaterThan(0); expect(w.alias.length).toBeGreaterThan(0); expect(w.jedna).toEqual([]); expect(w.olympic).toEqual({ nogi: 'obie', max_kolano_deg: 15, max_biodro_deg: 15 });
  });
  test('(d) ręka pracująca z dowolnego sprzętu: trzyma R/L na hantlu/kettlebellu/linkach wyłącza wolną rękę z reguł rąk (nie tylko na sztandze)', () => {
    const w = run(`${PRE}
    const d = poza([kf(0, { rece: { R: { chwyt: [8, 80, 24], biegunLokcia: [0, -1, 0.3] }, L: { chwyt: [8, 85, -24] } } }), kf(1, { rece: { R: { chwyt: [8, 80, 24], biegunLokcia: [0, -1, 0.3] }, L: { chwyt: [8, 85, -24] } } })]);
    const q = { max_deg: 60, stawy: ['elbow'] };
    const bez = m.naruszenia(v2, d, [{ id: 'r', typ: 'stawy_proste', grupa: 'g', parametry: { stawy: ['elbow'], max_deg: 5 } }]).flatMap((n) => n.opisy);
    d.sprzet = [{ rodzaj: 'podloga' }, { rodzaj: 'skrzynia', x0: 0, x1: 1, top: 1, trzyma: 'R' }];
    const z = m.naruszenia(v2, d, [{ id: 'r', typ: 'stawy_proste', grupa: 'g', parametry: { stawy: ['elbow'], max_deg: 5 } }]).flatMap((n) => n.opisy);
    console.log(JSON.stringify({ bez, z, q }));`);
    expect(w.bez.join('|')).toMatch(/elbow [RL]/); expect(w.z.join('|')).not.toContain('elbow L');
  });
  test('(b) biodro ze znakiem w regule: przeprost (udo za linią tułowia) daje ujemne biodro, więc „biodro ≤ X” nie przepuszcza już wymachu w tył jako zgięcia', () => {
    const w = run(`${PRE}
    const tyl = poza([kf(0), kf(1, { nogi: { R: { kostka: [-35, 12, 8.5] }, L: { kostka: [0, 7, -14] } } })]);
    const f = v2.keyframeFrame(tyl, 1); console.log(JSON.stringify({ hip: v2.jointAngles(f.sk, 'R').hip, hipL: v2.jointAngles(f.sk, 'L').hip }));`);
    expect(w.hip).toBeLessThan(-10); expect(w.hipL).toBeGreaterThan(-5);
  });
  test('(a) „behind the neck” trafia do rodzin chwytów nad głową/ściągania, nie do szyi', () => {
    const w = run(`const o = v2.OVERRIDES; console.log(JSON.stringify({ a: v2.familyOf('Push Press - Behind the Neck'), b: v2.familyOf('Standing Barbell Press Behind Neck'), c: v2.familyOf('Wide-Grip Pulldown Behind The Neck'), szyja: v2.familyOf('Neck Bridge Prone') }));`);
    expect([w.a, w.b, w.c]).toEqual(['overhead_press', 'overhead_press', 'pulldown']); expect(w.szyja).toBe('neck');
  });
  test('wymaga: „poza@2” — reguła z polem kontraktu przechodzi, z polem spoza kontraktu lub nowszą wersją czeka na kontrakt (ćwiczenie bez polecenia)', () => {
    const w = run(`const id = v2.CONTRACT.id; const r = (o) => ({ id: 'x', typ: 'stopien_swobody', ...o });
    console.log(JSON.stringify({ ok: m.czekaNaKontrakt(r({ wymaga: 'poza@2', parametry: { pole: 'skretTulowia' } }), id), bez: m.czekaNaKontrakt(r({ parametry: { pole: 'skretTulowia' } }), id), nowsza: m.czekaNaKontrakt(r({ wymaga: 'poza@3', parametry: { pole: 'skretTulowia' } }), id),
      nieznane: m.czekaNaKontrakt(r({ wymaga: 'poza@2', parametry: { pole: 'zgiecieBiodra' } }), id), poza1: m.czekaNaKontrakt(r({ wymaga: 'poza@2', parametry: { pole: 'zgiecieSzyi' } }), id), stare: m.czekaNaKontrakt(r({ wymaga: 'poza@2', parametry: { pole: 'skretTulowia' } }), 'figury-v2/poza@1') }));`);
    expect(w.ok).toBeNull(); expect(w.bez).toBeNull(); expect(w.poza1).toBeNull(); expect(w.nowsza).toContain('poza@3'); expect(w.nieznane).toContain('zgiecieBiodra'); expect(w.stare).toContain('poza@2');
  });
  test('zapadka naruszeń gotowych figur (87) po wdrożeniu r4: 0 — poprawki rigów (Incline DB, Pull Through, Stiff-Legged) i definicji (Single Leg RDL po nodze podporowej)', () => {
    const n = JSON.parse(execFileSync(process.execPath, [path.join(ROOT, 'scripts/figures/sens-gotowe.mjs'), '--json'], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })) as { cwiczenie: string; reguly: string[]; naruszenia: unknown[] }[];
    expect(n).toHaveLength(87); expect(n.filter(x => x.naruszenia.length).map(x => x.cwiczenie)).toEqual([]);
    expect(n.find(x => x.cwiczenie === 'Single Leg RDL (hantel)')!.reguly).toEqual(expect.arrayContaining(['zawias_w_biodrach_jednonoz', 'kolana_lekko_ugiete_jednonoz', 'ciezar_przy_nogach_jednonoz']));
  });
});
