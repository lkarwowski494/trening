/*
 * Cel pokrycia katalogu 1.1 bez „ciężkich” (decyzja właściciela 09.11.2026, docs/18: „Obniżmy próg wyciągając z niego ciężkie.”).
 * Cel każdej metryki w docs/research/pokrycie-cele.json = wartość w symulowanym stanie końcowym linii 1.1, który nie wymaga nowych badań ani treści
 * (scripts/pokrycie-symulacja.mjs: rodziny z danymi póz v2 włączone i zrecenzowane, karty z tekstem w źródłach odsłonięte i przetłumaczone, role dla ćwiczeń bez samych ról),
 * ale nie niższa niż minimum zapadki. Strażnik: (1) cel = wynik symulacji dla każdej metryki, (2) symulacja nie jest gorsza niż stan dzisiejszy,
 * (3) rozbicie przyrostu pełnej karty sumuje się do celu, (4) definicje „ciężkich” (macierz powodów), (5) decyzja i backlog 1.2 są zapisane w docs.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';

const root = join(__dirname, '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const json = <T,>(p: string) => JSON.parse(read(p)) as T;

type Sym = {
  cel: Record<string, number>; symulacja: Record<string, number>; obecne: Record<string, number>;
  rozbicie: { obecnie: number; przyrost: number; kombinacje: Record<string, number>; a: number; b: number; c: number; aB: number };
  rodziny: { rodzina: string; przyrost: number; pelnaDzis: number; pelnaKoniec: number; cwiczen: number; wlaczenie: number; zestawOgolny: number; karta: number; role: number }[];
  cwiczeniaCiezkie: { cwiczen: number; brakFigury: number; brakTekstu: number; brakRol: number };
  kontrola: { cuesSetsOwnRownaZrodlu: boolean; wstrzymane: string[]; kartyDoPoprawy: string[] };
  gain: { key: string; rodzina: string; braki: string }[];
};
const sym = JSON.parse(execFileSync('node', ['scripts/pokrycie-symulacja.mjs', '--json'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })) as Sym;
const cele = json<{ wersje: Record<string, { status: string; opis: string; min: Record<string, number> }> }>('docs/research/pokrycie-cele.json').wersje['1.1'];
const fix = json<{ dobre: Record<string, number>; razem: { cwiczen: number } }>('tests/fixtures/pokrycie-katalogu.json');
const min = json<{ minimum: Record<string, number> }>('tests/fixtures/pokrycie-katalogu-min.json').minimum;

describe('cel 1.1 bez „ciężkich” (decyzja właściciela 09.11.2026)', () => {
  test('cel w pokrycie-cele.json = wynik symulacji stanu końcowego dla każdej metryki (te same metryki, bez pelnaKartaBlad)', () => {
    expect(Object.keys(cele.min).sort()).toEqual(Object.keys(sym.cel).sort());
    expect(Object.keys(cele.min)).not.toContain('pelnaKartaBlad');
    for (const [m, v] of Object.entries(cele.min)) expect([m, v]).toEqual([m, sym.cel[m]]);
  });
  test.each(Object.keys(sym.cel))('metryka %s: cel = max(symulacja, minimum zapadki) i nie jest niższy niż minimum zapadki', m => {
    expect(sym.cel[m]).toBe(Math.max(sym.symulacja[m], min[m] ?? 0));
    expect(sym.cel[m]).toBeGreaterThanOrEqual(min[m] ?? 0);
  });
  test('stan końcowy nie ma mniej pełnych kart, figur ani kart własnych niż dziś (włączenie i odsłonięcie nic nie odbiera)', () => {
    for (const m of ['pelnaKarta', 'figura.v2', 'figura.wAplikacji', 'wskazowki.wlasne', 'wskazowki.zTekstem', 'czesteBledyTekst', 'animowanyBlad', 'roleMiesni', 'recenzjaFigur']) expect([m, sym.symulacja[m] >= fix.dobre[m]]).toEqual([m, true]);
  });
  test('pełna karta: 180 dziś + przyrost = cel; przyrost = (b) + (a i b) + (c); żadne ćwiczenie nie zyskuje samą pracą (a), bo każda ukryta karta ma figurę w niewłączonej rodzinie', () => {
    const r = sym.rozbicie;
    expect(r.obecnie).toBe(fix.dobre.pelnaKarta);
    expect(r.obecnie + r.przyrost).toBe(sym.symulacja.pelnaKarta);
    expect(r.a + r.b + r.c + r.aB).toBe(r.przyrost);
    expect(Object.values(r.kombinacje).reduce((s, n) => s + n, 0)).toBe(r.przyrost);
    expect(sym.gain).toHaveLength(r.przyrost);
    expect(r.c).toBe(73); /* 10.11.2026 (scalenie partii 8 na scal/pociag-7): 51 → 73 — +22 core_standing, sled_throw i strongman z partii 8 (c); wynik symulacji */ /* 10.11.2026 (scalenie partii 7 z partią 6 na scal/pociag-6): 45 → 51 — +6 core_floor z partii 7; wynik symulacji */ /* 10.11.2026 (partia 7, scalenie integracji 649b0504): 18 → 24 — + 6 ćwiczeń core_floor (Dead Bug, Bird Dog, Hollow Hold, Alternate Heel Touchers, Oblique Crunches - On The Floor, Scissor Kick) z figurą i zestawem zrecenzowanym (r2), bez ról; wynik symulacji */ /* 10.11.2026 (partia 6, scalenie integracji na figury/partia-6): 18 → 45 — +27 skoków plyo (figura i zestawy/karty po r3, brak tylko ról); wynik symulacji */ /* 10.11.2026 (scalenie partii 5 z partiami 1–4 i 2 na scal/pociag-5): 11 → 18 — wynik symulacji na wspólnym stanie (+7 pushup_plank z integracji i +7 rotator_cuff/carry z partii 5 względem bazy 4; każda strona miała 11) */ /* 10.11.2026 (sesja B, scalenie rotator_cuff po recenzji r1): 6 → 11 — 5 kart własnych rotator_cuff zrecenzowanych wobec rysunku v2 (brakuje im tylko ról); wynik symulacji; */ /* 10.11.2026 (integracja partii 5 z partią 3): 4 → 6 — karty własne Farmer's Walk i Suitcase Carry zrecenzowane wobec rysunku v2 (recenzja carry r2), brakuje im tylko ról; wynik symulacji; */ /* ćwiczenia, którym dziś brakuje tylko ról mięśni (09.11.2026, partia 3: + Middle Back Shrug — figura i zestaw zrecenzowane, brak ról; 10.11.2026, partia 2: + 7 ćwiczeń pushup_plank z zrecenzowaną figurą bez ról) */
    expect(r.a).toBe(0); /* 11.11.2026 (W-02): Front Incline Dumbbell Raise — karta poprawiona, zrecenzowana i już wyświetlana (lib/cues/data.json), więc liczy się do stanu obecnego, nie do zysku */
  });
  test('rodziny wg zysku: suma przyrostów = przyrost pełnej karty; rodzina ma niemalejącą liczbę pełnych kart; lista posortowana malejąco', () => {
    expect(sym.rodziny.reduce((s, f) => s + f.przyrost, 0)).toBe(sym.rozbicie.przyrost);
    for (const f of sym.rodziny) { expect(f.pelnaKoniec - f.pelnaDzis).toBe(f.przyrost); expect(f.pelnaKoniec).toBeLessThanOrEqual(f.cwiczen); expect(f.wlaczenie + f.zestawOgolny + f.karta + f.role).toBe(f.przyrost); }
    for (let i = 1; i < sym.rodziny.length; i++) expect(sym.rodziny[i - 1].przyrost).toBeGreaterThanOrEqual(sym.rodziny[i].przyrost);
  });
  test('„ciężkie” = ćwiczenia poza pełną kartą w stanie końcowym: liczba = katalog − cel pełnej karty', () => {
    expect(sym.cwiczeniaCiezkie.cwiczen).toBe(fix.razem.cwiczen - cele.min.pelnaKarta);
    expect(sym.cwiczeniaCiezkie.brakFigury + sym.cwiczeniaCiezkie.brakTekstu + sym.cwiczeniaCiezkie.brakRol).toBeGreaterThanOrEqual(sym.cwiczeniaCiezkie.cwiczen);
  });
  test('założenia symulacji: karty własne cue-sets (b = own) = karty w źródłach; wstrzymane figury (V2_WSTRZYMANE) poza stanem końcowym', () => {
    expect(sym.kontrola.cuesSetsOwnRownaZrodlu).toBe(true);
    expect(sym.kontrola.wstrzymane.sort()).toEqual(['Barbell Side Bend', 'Clean Shrug', 'Machine Hip Thrust', 'Plyo Push-Up', 'Snatch Shrug', 'Triceps Dips (ławka)']); /* 10.11.2026: V2_WSTRZYMANE = 09.11 partia 2 (Machine Hip Thrust) + 09.11 partia 1 (2 maszyny calf_raise) + 10.11 partia 4 (ławka dip, W5, P4-DIP-1) + 10.11 partia 2 (Plyo Push-Up, PP-W1) + 10.11 partia 8 (Barbell Side Bend, core_standing W2, P8-CS-1) */
  });
  test('komplet kart języków: w stanie końcowym każdy język ma tyle samo kart kompletnych (wszystkie teksty przetłumaczone — założenie (a))', () => {
    const lang = Object.keys(cele.min).filter(k => /^jezyk\..+\.kompletne$/.test(k));
    expect(lang).toHaveLength(35);
    expect(new Set(lang.map(k => cele.min[k])).size).toBe(1);
  });
  test('status i opis celu zapisują decyzję z 09.11.2026 oraz stare → nowe wartości', () => {
    expect(cele.status).toMatch(/09\.11\.2026[^]*bez „ciężkich”/);
    expect(cele.opis).toMatch(/09\.11\.2026 \(decyzja właściciela 09\.11\.2026[^)]*\)[^]*scripts\/pokrycie-symulacja\.mjs/);
    expect(cele.opis).toMatch(/pelnaKarta 456 → 457/);
  });
  test('regresja 09.11.2026 (wariant B koordynatora): karta z werdyktem „do poprawy” w figury-recenzja.json nie liczy się do zysku — ćwiczenie bez pełnej karty, bez karty własnej w stanie końcowym', () => {
    const rec = json<{ karty: Record<string, { werdykt: string }> }>('docs/research/figury-recenzja.json').karty;
    const doPoprawy = Object.keys(rec).filter(k => rec[k].werdykt === 'do poprawy').sort();
    expect(doPoprawy).not.toContain('Front Incline Dumbbell Raise'); /* 11.11.2026 (W-02): fidr.move poprawione, karta zrecenzowana niezależnie — „wyswietlana” */
    expect(doPoprawy).toContain('Barbell Incline Shoulder Raise');
    expect(sym.kontrola.kartyDoPoprawy).toEqual(doPoprawy);
    for (const k of doPoprawy) expect([k, sym.gain.some(g => g.key === k)]).toEqual([k, false]);
    expect(sym.rozbicie.a).toBe(0); /* 11.11.2026 (W-02): karta Front Incline Dumbbell Raise wyświetlana — w stanie obecnym, nie w zysku (a) */
    expect(cele.min.pelnaKarta).toBe(523); /* 11.11.2026 (W-02): 521 → 523 — Standing i Seated Calf Raise zdjęte z V2_WSTRZYMANE po recenzji, wynik symulacji */ /* 11.11.2026 (W-02): 520 → 521 — karta Front Incline Dumbbell Raise po poprawce fidr.move, wynik symulacji */ /* 10.11.2026 (scalenie partii 8 na scal/pociag-7): 498 → 520 — +22 z partii 8 (c), wynik symulacji */ /* 10.11.2026 (scalenie partii 7 z partią 6 na scal/pociag-6): 492 → 498 — +6 core_floor z partii 7 (c), wynik symulacji */ /* 10.11.2026 (partia 7, scalenie integracji 649b0504): 465 → 471 — +6 z (c) core_floor, wynik symulacji */ /* 10.11.2026 (partia 6, scalenie integracji na figury/partia-6): 465 → 492 — wynik symulacji po włączeniu plyo (+27 w (c)), nie poluzowanie */ /* 10.11.2026 (scalenie partii 5 na scal/pociag-5): 458 → 465 — wynik symulacji na wspólnym stanie (rodziny partii 5: role brakujące rotator_cuff i carry dochodzą w (c)), nie poluzowanie; */ /* 10.11.2026 (sesja B, scalenie partii 5 z integracją @ dfaeeefe): 453 → 460 — wynik symulacji na wspólnym stanie (rodziny partii 5 i rotator_cuff), nie poluzowanie; */ /* 452 → 458 = symulacja po scaleniu partii 2 (10.11.2026, scal/pociag-4: pushup_plank +7 z (c), Plyo Push-Up wstrzymany −1); cel zostaje do naprawy fidr.move (wariant A, osobne zadanie); 457 → 452 = symulacja na wspólnym stanie (10.11.2026, scalenie partii 4 z integracją i partiami 1–3; ławka dip wstrzymana w partii 4): Machine Hip Thrust wstrzymany (partia 2, V2_WSTRZYMANE), marsze z gumą (partia 3, P3-MARSZ w docs/21), Standing i Seated Calf Raise w V2_WSTRZYMANE (partia 1) — wynik symulacji, nie poluzowanie */
  });
  test('docs/18 ma wpis decyzji z 09.11.2026 (cytat właściciela, definicja, stare → nowe, odrzucone) z polami wdrożenia i testu', () => {
    const d = read('docs/18-przekazanie.md');
    const wpis = d.split('\n').find(l => l.startsWith('- 09.11.2026') && l.includes('Obniżmy próg wyciągając z niego ciężkie')) ?? '';
    expect(wpis).not.toBe('');
    expect(wpis).toMatch(/\[wdrożenie: kod\]/);
    expect(wpis).toMatch(/\[test: tests\/cel-1-1-bez-ciezkich\.test\.ts\]/);
    expect(wpis).toMatch(/Odrzucone: B[^]*A —/);
    expect(wpis).toMatch(/pelnaKarta 456 → 457/);
  });
  test('docs/21: jeden wpis backlogu 1.2 o ćwiczeniach „ciężkich” z liczbą i odwołaniem do skryptu (bez listy nazw)', () => {
    const blok = read('docs/21-roadmapa-offline.md').split('### Backlog 1.2 — pokrycie: ćwiczenia „ciężkie”')[1]?.split('\n### ')[0] ?? '';
    expect(blok).toContain('scripts/pokrycie-symulacja.mjs');
    expect(blok).toContain(String(sym.cwiczeniaCiezkie.cwiczen));
    expect(blok).not.toContain('Nordic Curl');
  });
});
