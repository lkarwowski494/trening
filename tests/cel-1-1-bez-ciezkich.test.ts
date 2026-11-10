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
    expect(r.c).toBe(38); /* 10.11.2026, partia 6: + 27 skoków plyo (figura i zestawy/karty zrecenzowane r3, brak ról); */ /* ćwiczenia, którym dziś brakuje tylko ról mięśni (09.11.2026, partia 3: + Middle Back Shrug — figura i zestaw zrecenzowane, brak ról; 10.11.2026, partia 2: + 7 ćwiczeń pushup_plank z zrecenzowaną figurą bez ról) */
    expect(r.a).toBe(0);
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
    expect(sym.kontrola.wstrzymane.sort()).toEqual(['Clean Shrug', 'Machine Hip Thrust', 'Plyo Push-Up', 'Seated Calf Raise', 'Snatch Shrug', 'Standing Calf Raise', 'Triceps Dips (ławka)']); /* 10.11.2026: V2_WSTRZYMANE = 09.11 partia 2 (Machine Hip Thrust) + 09.11 partia 1 (2 maszyny calf_raise) + 10.11 partia 4 (ławka dip, W5, P4-DIP-1) + 10.11 partia 2 (Plyo Push-Up, PP-W1) */
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
    expect(doPoprawy).toContain('Front Incline Dumbbell Raise');
    expect(doPoprawy).toContain('Barbell Incline Shoulder Raise');
    expect(sym.kontrola.kartyDoPoprawy).toEqual(doPoprawy);
    for (const k of doPoprawy) expect([k, sym.gain.some(g => g.key === k)]).toEqual([k, false]);
    expect(sym.rozbicie.a).toBe(0); /* delt_raise: zysk (a) znika razem z kartą „do poprawy” */
    expect(cele.min.pelnaKarta).toBe(485); /* 458 → 485 = symulacja po włączeniu plyo (partia 6, 10.11.2026: +27 z (c)); */ /* 452 → 458 = symulacja po scaleniu partii 2 (10.11.2026, scal/pociag-4: pushup_plank +7 z (c), Plyo Push-Up wstrzymany −1); cel zostaje do naprawy fidr.move (wariant A, osobne zadanie); 457 → 452 = symulacja na wspólnym stanie (10.11.2026, scalenie partii 4 z integracją i partiami 1–3; ławka dip wstrzymana w partii 4): Machine Hip Thrust wstrzymany (partia 2, V2_WSTRZYMANE), marsze z gumą (partia 3, P3-MARSZ w docs/21), Standing i Seated Calf Raise w V2_WSTRZYMANE (partia 1) — wynik symulacji, nie poluzowanie */
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
