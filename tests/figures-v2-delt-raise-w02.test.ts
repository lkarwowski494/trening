/*
 * W-02 (11.11.2026), rodzina delt_raise — Straight Raises on Incline Bench: zgłoszenie koordynatora „kolana idą do tyłu, siedzisko ławki przenika ciało”.
 * Pomiar (11.11.2026, pozy sprzed poprawki): kolano zgięte o ok. 67°, oś kolana ok. 30 cm NAD cięciwą biodro–kostka (przy leżeniu przodem tył ciała = w górę, więc zgięcie w złą stronę, ku plecom),
 * a narysowane „spodenki” uda i tułów wchodziły w siedzisko 20 cm (do 0,7 cm; w Y Raise z siedziskiem 2 cm: 0). Przyczyna: generator przodemLezac jawnie odtwarzał nogi i siedzisko sprzed partii 2 (wspólne lezyPrzodem dawało już nogi proste).
 * Miary mają negatyw (dane okaleczone do dawnego stanu) i pozytyw odniesienia (Y Raise: ten sam układ leżenia, nogi proste).
 */
import { keyframeFrame, bodyShapes, benchPolys, sdPoly, jointAngles, type PoseData } from '@/lib/figures/v2';
import * as fs from 'fs';
import * as path from 'path';

const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/delt_raise.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const K = 'Straight Raises on Incline Bench';
const kopia = (d: PoseData) => JSON.parse(JSON.stringify(d)) as PoseData;
const UU = Array.from({ length: 11 }, (_, i) => i / 10);

/** Największe wysunięcie kolana ku tyłowi ciała (leżenie przodem: tył = w górę): wysokość kolana minus wysokość cięciwy biodro–kostka w x kolana, cm; > 0 = kolano wygięte w złą stronę. */
const kolanoZaCiecziwa = (d: PoseData) => Math.max(...UU.flatMap(u => { const sk = keyframeFrame(d, u).sk; return (['R', 'L'] as const).map(s => { const l = sk.legs[s]; const t = (l.knee[0] - l.hip[0]) / (l.ankle[0] - l.hip[0]); return l.knee[1] - (l.hip[1] + t * (l.ankle[1] - l.hip[1])); }); }));
const maxZgiecieKolana = (d: PoseData) => Math.max(...UU.flatMap(u => { const sk = keyframeFrame(d, u).sk; return (['R', 'L'] as const).map(s => jointAngles(sk, s).knee); }));
/** Najgłębsze wejście narysowanych kształtów ciała (rzut z boku) w siedzisko ławki, cm. */
const wejscieWSiedzisko = (d: PoseData) => Math.max(...UU.flatMap(u => { const f = keyframeFrame(d, u); const b = f.props.find((p: any) => p.k === 'bench') as any; const sp = benchPolys(b).seat;
  return bodyShapes(f.sk, 'side').flatMap(sh => (sh.k === 'poly' ? sh.pts.map(p => -sdPoly(p, sp)) : [0])); }));

describe('W-02 Straight Raises on Incline Bench: nogi proste za siedziskiem, kolana nie za ciałem, siedzisko bez przenikania', () => {
  test('kolana nie są wygięte ku tyłowi ciała: oś kolana najwyżej 1 cm nad cięciwą biodro–kostka w każdej klatce', () => { expect(kolanoZaCiecziwa(DATA[K])).toBeLessThanOrEqual(1); });
  test('nogi leżącego są proste (zgięcie kolana ≤ 15°) w każdej klatce', () => { expect(maxZgiecieKolana(DATA[K])).toBeLessThanOrEqual(15); });
  test('narysowane uda, spodenki i tułów wchodzą w siedzisko ławki najwyżej 0,3 cm (TOL.pen) w każdej klatce', () => { expect(wejscieWSiedzisko(DATA[K])).toBeLessThanOrEqual(0.3); });
  test('siedzisko ławki leżenia przodem ma długość oparcia 2 cm, jak w pozostałych ćwiczeniach rodziny na tej ławce (Y Raise)', () => {
    const sied = (k: string) => (DATA[k].sprzet as any[]).find(s => s.rodzaj === 'lawka').siedzisko; expect([sied(K), sied('Y Raise (hantle)')]).toEqual([2, 2]);
  });
  test('poza nogami i siedziskiem rysunek bez zmian: chwyt rąk w pierwszej klatce (wartość z pliku sprzed poprawki, ręce i tułów we wszystkich 9 klatkach identyczne), kąt, wysokość i długość oparcia ławki', () => {
    const f0 = keyframeFrame(DATA[K], 0), f1 = keyframeFrame(DATA[K], 1);
    expect(f0.sk.arms.R.grip.map(x => Math.round(x * 10) / 10)).toEqual([-26.3, 25.5, -22]); expect(f1.sk.arms.R.grip[1]).toBeGreaterThan(f0.sk.arms.R.grip[1] + 40);
    expect((DATA[K].sprzet as any[]).find(s => s.rodzaj === 'lawka')).toMatchObject({ top: 43, kat: 45, dlugosc: 38 });
  });
  test('pozytyw odniesienia: Y Raise (ta sama poza leżenia) spełnia te same trzy miary', () => {
    expect([kolanoZaCiecziwa(DATA['Y Raise (hantle)']) <= 1, maxZgiecieKolana(DATA['Y Raise (hantle)']) <= 15, wejscieWSiedzisko(DATA['Y Raise (hantle)']) <= 0.3]).toEqual([true, true, true]);
  });
  test('negatyw: stan sprzed poprawki (kostki 52 cm za biodrem, siedzisko 20 cm) nie spełnia miar', () => {
    const stare = kopia(DATA[K]); (stare.sprzet as any[]).find(s => s.rodzaj === 'lawka').siedzisko = 20;
    for (const k of stare.klatki) for (const s of ['R', 'L'] as const) { const n = (k as any).nogi[s]; const sg = Math.sign(n.kostka[2]); n.kostka = [keyframeFrame(DATA[K], 0).sk.pelvis[0] + 52, 7, n.kostka[2]]; n.biegunKolana = [1, 0.2, 0]; void sg; }
    expect([kolanoZaCiecziwa(stare) > 1, maxZgiecieKolana(stare) > 15, wejscieWSiedzisko(stare) > 0.3]).toEqual([true, true, true]);
  });
  test('generator nie odtwarza już nóg sprzed partii 2 (brak jawnego nadpisania kolDx 52 i siedziska 20 w przodemLezac)', () => {
    const G = fs.readFileSync(path.join(__dirname, '../scripts/figures/agent-pozy/delt_raise.mjs'), 'utf8'); const fn = G.slice(G.indexOf('function przodemLezac'), G.indexOf('function yLezac'));
    expect(fn).not.toMatch(/sedzisko: 20/); expect(fn).not.toMatch(/\.k\[0\] = L\.m\[0\] \+ 52/);
  });
});

describe('W-02 Front Incline Dumbbell Raise: zdanie fidr.move bez wysokości sprzecznej ze źródłami (recenzja L-047 r2, 04.11.2026; poprawka 11.11.2026)', () => {
  const ROOT = path.join(__dirname, '..');
  const cue = (l: string) => JSON.parse(fs.readFileSync(path.join(ROOT, `lib/cues/text/${l}.json`), 'utf8'))['fidr.move'] as string | undefined;
  const ZRODLA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/cues.json'), 'utf8'));
  const sciezka = ZRODLA.exercises as Record<string, any>;
  test('PL i EN: „co najmniej do wysokości barków” / „at least to shoulder height”, bez „mniej więcej” i „about”', () => {
    expect(cue('pl')).toMatch(/co najmniej do wysokości barków/); expect(cue('pl')).not.toMatch(/mniej więcej/);
    expect(cue('en')).toMatch(/at least to shoulder height/); expect(cue('en')).not.toMatch(/\babout\b/);
  });
  test('źródła fidr.move: oba cytaty dotyczą wysokości (część wspólna), nie tylko łokcia', () => {
    const move = sciezka['Front Incline Dumbbell Raise'].move[0]; const txt = JSON.stringify(move.s);
    expect(txt).toMatch(/way above the height of your shoulders/); expect(txt).toMatch(/slightly above shoulder level/); expect(move.s.length).toBeGreaterThanOrEqual(2);
  });
  test('negatyw: stare brzmienie „mniej więcej do wysokości barków” nie przechodzi miary', () => { expect(/co najmniej do wysokości barków/.test('Unieś hantle przed sobą, łokcie lekko ugięte, mniej więcej do wysokości barków; opuść je powoli.')).toBe(false); });
  test('pozostałe 33 języki nie mają starego zdania (czekają na przekład W-03: angielski w zastępstwie), a zestaw przekładu je wymienia', () => {
    const jezyki = fs.readdirSync(path.join(ROOT, 'lib/cues/text')).map(f => f.replace('.json', '')).filter(l => l !== 'pl' && l !== 'en');
    expect(jezyki.length).toBe(33); expect(jezyki.filter(l => cue(l) !== undefined)).toEqual([]);
    const Z = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/lokalizacja/zestaw-przekladu-2026-11-11-w02-wskazowki.json'), 'utf8')); expect(Z.klucze.map((k: any) => k.id)).toEqual(['fidr.move']);
  });
  test('karta zostaje ukryta do recenzji niezależnej: werdykt karty nie jest „wyswietlana” (L-047: autor poprawki nie ustawia go sam)', () => {
    const R = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/research/figury-recenzja.json'), 'utf8')); expect(R.karty['Front Incline Dumbbell Raise'].werdykt).not.toBe('wyswietlana');
  });
});
