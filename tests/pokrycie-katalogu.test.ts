/*
 * Strażnik pokrycia katalogu ćwiczeń (decyzja właściciela 28.10.2026, M-B: „licznik pokrycia generowany z kodu + strażnik CI, że pokrycie nie spada + cel na wersję
 * w liście kontrolnej wydania”; odrzucone M-C). Licznik: scripts/pokrycie-katalogu.mjs (docs/55, tests/fixtures/pokrycie-katalogu.json); część `npm run verify` (jest).
 *   (a) dokument i fixture są aktualne względem kodu (`--check`),
 *   (b) zapadka: żadna liczba „dobra” nie spada poniżej tests/fixtures/pokrycie-katalogu-min.json; obniżka minimum tylko z polem `powod`,
 *   (c) cele wersji (docs/research/pokrycie-cele.json) mają poprawny kształt, a `--cel` zwraca kod 1, gdy cel jest nieosiągnięty albo go brak,
 *   (d) krok „Pokrycie katalogu” jest w liście kontrolnej wydania (docs/39).
 */
import { readFileSync, writeFileSync, mkdtempSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { execFileSync, spawnSync } from 'child_process';

const root = join(__dirname, '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const json = <T,>(p: string) => JSON.parse(read(p)) as T;

type Fixture = { schemat: string; razem: Record<string, any>; kartZTekstami: number; rodziny: Record<string, any>; jezyki: Record<string, { kompletne: number; zBrakiem: number; brakTekstow: number; nazwaLokalna: number }>; dobre: Record<string, number> };
type Min = { opis: string; minimum: Record<string, number>; rekord: Record<string, number>; obnizenia: Record<string, { powod: string; data: string }> };
type Cele = { wersje: Record<string, { status: string; opis?: string; min: Record<string, number> }> };

/** Naruszenia zapadki: spadek poniżej minimum, metryka bez minimum (nowa — podnieś minimum), metryka usunięta z licznika, obniżka minimum bez powodu. Pusta lista = zgodne. */
function naruszenia(dobre: Record<string, number>, min: Min): string[] {
  const out: string[] = [];
  for (const [m, v] of Object.entries(dobre)) {
    if (!(m in min.minimum)) out.push(`${m}: brak w minimum — node scripts/pokrycie-katalogu.mjs --podnies-minimum`);
    else if (v < min.minimum[m]) out.push(`${m}: ${v} < minimum ${min.minimum[m]} (pokrycie spadło)`);
  }
  for (const m of Object.keys(min.minimum)) if (!(m in dobre)) out.push(`${m}: jest w minimum, a licznik jej nie liczy (usunięta metryka wymaga świadomej zmiany minimum)`);
  for (const [m, v] of Object.entries(min.minimum)) {
    const rek = min.rekord?.[m];
    if (typeof rek === 'number' && v < rek && !(typeof min.obnizenia?.[m]?.powod === 'string' && min.obnizenia[m].powod.trim().length >= 10)) out.push(`${m}: minimum ${v} < rekord ${rek} bez pola obnizenia.${m}.powod`);
    if (typeof rek === 'number' && v > rek) out.push(`${m}: minimum ${v} > rekord ${rek}`);
  }
  return out;
}

const fix = json<Fixture>('tests/fixtures/pokrycie-katalogu.json');
const min = json<Min>('tests/fixtures/pokrycie-katalogu-min.json');
const cele = json<Cele>('docs/research/pokrycie-cele.json');
const skrypt = (...a: string[]) => spawnSync('node', ['scripts/pokrycie-katalogu.mjs', ...a], { cwd: root, encoding: 'utf8' });

describe('pokrycie katalogu: dokument i liczby z kodu', () => {
  test('docs/55 i fixture są aktualne (node scripts/pokrycie-katalogu.mjs --write)', () => {
    expect(() => execFileSync('node', ['scripts/pokrycie-katalogu.mjs', '--check'], { cwd: root, stdio: 'pipe' })).not.toThrow();
  });
  test('liczby odniesienia z analizy 28.10.2026 (stan startowy) — katalog 709 ćwiczeń, definicje liczników', () => {
    expect(fix.schemat).toBe('pokrycie-katalogu@1');
    /* sumy kontrolne definicji: każde ćwiczenie ma dokładnie jeden stan figury w aplikacji i jeden tryb wskazówek */
    const r = fix.razem;
    expect(r.figura.v2 + r.figura.v1 + r.figura.bezFigury).toBe(r.cwiczen);
    expect(r.wskazowki.wlasne + r.wskazowki.ogolne + r.wskazowki.bezTekstu).toBe(r.cwiczen);
    expect(r.wskazowki.wlasneZBledami).toBeLessThanOrEqual(r.wskazowki.wlasne);
    /* dwa standardy (02.11.2026): standard 1 wymaga wskazówek i figury v2 (ról nie wymaga mobilność — 04.11.2026), standard 2 dodatkowo częstych błędów i animowanego błędu */
    expect(r.pelnaKarta).toBeLessThanOrEqual(Math.min(r.wskazowki.wlasne + r.wskazowki.ogolne, r.figura.v2));
    expect(r.pelnaKartaBlad).toBeLessThanOrEqual(Math.min(r.pelnaKarta, r.czesteBledyTekst, r.animowanyBlad));
    expect(Object.values(fix.rodziny).reduce((s, f) => s + f.cwiczen, 0)).toBe(r.cwiczen);
    expect(Object.values(fix.rodziny).reduce((s, f) => s + f.pelnaKarta, 0)).toBe(r.pelnaKarta);
  });
  test('35 języków; kart kompletnych nie więcej niż kart z tekstami; polski i angielski mają komplet (słownik bazowy)', () => {
    expect(Object.keys(fix.jezyki)).toHaveLength(35);
    for (const [l, j] of Object.entries(fix.jezyki)) {
      expect(j.kompletne + j.zBrakiem).toBe(fix.kartZTekstami);
      expect(j.nazwaLokalna).toBeGreaterThanOrEqual(0);
      if (l === 'pl' || l === 'en') expect(j.zBrakiem).toBe(0);
    }
  });
  test('nazwy lokalne: pole jeszcze nie istnieje — 0 w każdym języku (miejsce przygotowane w liczniku)', () => {
    expect(fix.dobre['nazwaLokalna.razem']).toBe(0);
    for (const j of Object.values(fix.jezyki)) expect(j.nazwaLokalna).toBe(0);
  });
});

describe('pokrycie katalogu: zapadka (nie spada)', () => {
  test('bieżące „dobre” liczby ≥ minimum zapisane w tests/fixtures/pokrycie-katalogu-min.json', () => {
    expect(naruszenia(fix.dobre, min)).toEqual([]);
  });
  test('minimum obejmuje każdą metrykę: pełne karty, figury v2, karty własne, komplet kart każdego z 35 języków, recenzje', () => {
    for (const m of ['pelnaKarta', 'figura.v2', 'figura.wAplikacji', 'figura.zDanymiV2', 'animowanyBlad', 'wskazowki.wlasne', 'wskazowki.wlasneZBledami', 'wskazowki.zTekstem', 'czesteBledyTekst', 'roleMiesni', 'recenzjaFigur', 'nazwaLokalna.razem']) expect(Object.keys(min.minimum)).toContain(m);
    expect(Object.keys(min.minimum).filter(k => /^jezyk\..+\.kompletne$/.test(k))).toHaveLength(35);
  });
  test('scenariusz: spadek pełnych kart poniżej minimum jest wykryty', () => {
    expect(naruszenia({ ...fix.dobre, pelnaKarta: min.minimum.pelnaKarta - 1 }, min).join('|')).toMatch(/pelnaKarta: .* < minimum/);
  });
  test('scenariusz: spadek kompletu kart w jednym języku (np. usunięty przekład) jest wykryty', () => {
    const d = { ...fix.dobre, 'jezyk.de.kompletne': fix.dobre['jezyk.de.kompletne'] - 1 };
    expect(naruszenia(d, min).join('|')).toMatch(/jezyk\.de\.kompletne/);
  });
  test('scenariusz: wzrost nie jest naruszeniem; nowa metryka bez minimum jest zgłoszona', () => {
    expect(naruszenia({ ...fix.dobre, pelnaKarta: min.minimum.pelnaKarta + 5 }, min)).toEqual([]);
    expect(naruszenia({ ...fix.dobre, 'jezyk.xx.kompletne': 1 }, min).join('|')).toMatch(/jezyk\.xx\.kompletne: brak w minimum/);
  });
  test('scenariusz: obniżka minimum bez powodu jest wykryta, z powodem — dozwolona', () => {
    /* niezależnie od bieżącego stanu (po scaleniu main 29.10.2026 pełnych kart jest 0, a rekord 17): stan = rekord, minimum celowo o 1 niżej, pozostałe wpisy obnizenia bez zmian */
    const dobre = { ...fix.dobre, pelnaKarta: min.rekord.pelnaKarta };
    const { pelnaKarta: _o, ...inneObnizenia } = min.obnizenia;
    const obniz: Min = { ...min, obnizenia: inneObnizenia, minimum: { ...min.minimum, pelnaKarta: min.rekord.pelnaKarta - 1 } };
    expect(naruszenia(dobre, obniz).join('|')).toMatch(/pelnaKarta: minimum .* < rekord .* bez pola obnizenia/);
    const zPowodem: Min = { ...obniz, obnizenia: { ...inneObnizenia, pelnaKarta: { powod: 'karta usunięta z katalogu decyzją właściciela', data: '01.01.2027' } } };
    expect(naruszenia(dobre, zPowodem)).toEqual([]);
    const pusty: Min = { ...obniz, obnizenia: { ...inneObnizenia, pelnaKarta: { powod: '', data: '01.01.2027' } } };
    expect(naruszenia(dobre, pusty).join('|')).toMatch(/bez pola obnizenia/);
  });
  test('scenariusz: metryka usunięta z licznika (ale zostaje w minimum) jest wykryta', () => {
    const { pelnaKarta: _p, ...bez } = fix.dobre;
    expect(naruszenia(bez, min).join('|')).toMatch(/pelnaKarta: jest w minimum, a licznik jej nie liczy/);
  });
  test('scenariusz: minimum nie może przekraczać rekordu (ręczna podwyżka tylko przez --podnies-minimum)', () => {
    expect(naruszenia(fix.dobre, { ...min, minimum: { ...min.minimum, pelnaKarta: min.rekord.pelnaKarta + 1 } }).join('|')).toMatch(/pelnaKarta: minimum .* > rekord/);
  });
  test('wpisy obnizenia mają powód i datę, a dotyczą istniejących metryk', () => {
    for (const [m, o] of Object.entries(min.obnizenia ?? {})) { expect(Object.keys(min.minimum)).toContain(m); expect(o.powod.trim().length).toBeGreaterThanOrEqual(10); expect(o.data).toMatch(/^\d{2}\.\d{2}\.\d{4}$/); }
  });
});

describe('pokrycie katalogu: cele wersji', () => {
  test('cel 1.1 istnieje, ma status i liczby tylko ze znanych metryk (stan bieżący do potwierdzenia przez właściciela)', () => {
    const c = cele.wersje['1.1'];
    expect(c).toBeDefined();
    expect(c.status).toMatch(/^(do potwierdzenia przez właściciela|potwierdzony przez właściciela \d{2}\.\d{2}\.\d{4})/);
    expect(Object.keys(c.min).length).toBeGreaterThan(0);
    for (const [m, v] of Object.entries(c.min)) { expect(Object.keys(fix.dobre)).toContain(m); expect(Number.isInteger(v) && v >= 0).toBe(true); }
  });
  test('cel 1.1 „pełna karta” (standard 1): 465 z 08.11.2026 (Z0), lista `poza11` (ZB-053, 09.11.2026) — 9 ćwiczeń bez danych póz v2 przeniesionych do 1.2; wartość celu wynika od 09.11.2026 z symulacji (tests/cel-1-1-bez-ciezkich.test.ts), nie z odejmowania listy', () => {
    const c = cele.wersje['1.1'] as any;
    const poza: string[] = c.poza11.pelnaKarta;
    const oblig = json<{ cwiczenia: { cwiczenie: string; danePozV2: boolean }[] }>('docs/research/pokrycie-1-1-obowiazkowe.json').cwiczenia;
    expect(poza).toHaveLength(9);
    expect(new Set(poza).size).toBe(9);
    for (const n of poza) expect(oblig.find(o => o.cwiczenie === n)?.danePozV2).toBe(false); /* wypadają tylko te, którym brak ruchu silnika (danych póz) */
    expect(c.opis).toMatch(/08\.11\.2026 \(Z0[^)]*\)[^]*465 = 452[^]*13 spośród 51 obowiązkowych/);
    expect(c.opis).toMatch(/09\.11\.2026 \(ZB-053[^)]*\)[^]*456 = 465 − 9/);
    expect(c.min.pelnaKarta).toBeGreaterThanOrEqual(fix.dobre.pelnaKarta);
  });
  test('9 ćwiczeń z `poza11` jest w backlogu 1.2 (docs/21, ZB-053, 09.11.2026)', () => {
    const c = cele.wersje['1.1'] as any;
    const blok = read('docs/21-roadmapa-offline.md').split('### Backlog 1.2 — pełna karta')[1]?.split('\n### ')[0] ?? '';
    expect(blok).toMatch(/ZB-053/);
    for (const n of c.poza11.pelnaKarta) expect(blok).toContain(n);
  });
  test('cel wersji nie jest niższy niż minimum zapadki (cel nie może być łatwiejszy niż stan chroniony)', () => {
    for (const [wer, c] of Object.entries(cele.wersje)) for (const [m, v] of Object.entries(c.min)) expect({ wer, m, ok: v >= (min.minimum[m] ?? 0) || !!min.obnizenia?.[m] }).toEqual({ wer, m, ok: true });
  });
  test('docs/55 ma sekcję „Cele wersji” z wersją 1.1', () => {
    const d = read('docs/55-pokrycie-katalogu.md');
    expect(d).toContain('## Cele wersji'); expect(d).toContain('### Wersja 1.1');
  });
  test('--cel 1.1: kod 0 i „osiągnięty”, gdy wszystkie liczby celu są osiągnięte; inaczej kod 1 i dokładnie te metryki, których brakuje (po scaleniu main 29.10.2026 rodziny v2 są ukryte do recenzji 1.1 — cel nieosiągnięty)', () => {
    const r = skrypt('--cel', '1.1'); const braki = Object.entries(cele.wersje['1.1'].min).filter(([m, v]) => (fix.dobre[m] ?? 0) < v).map(([m]) => m);
    if (!braki.length) { expect(r.status).toBe(0); expect(r.stdout).toMatch(/osiągnięty/); return; }
    expect(r.status).toBe(1); expect(r.stderr).toMatch(/NIE osiągnięty/);
    /* 09.11.2026 (decyzja właściciela: cel = stan końcowy 1.1 bez „ciężkich”, tests/cel-1-1-bez-ciezkich.test.ts): cel obejmuje także figury v2 rodzin jeszcze niewłączonych (533) i karty ukryte do recenzji,
     * więc każda nieosiągnięta metryka jest nazwana w komunikacie z liczbą stanu i celu (wcześniej cel figur v2 = 98 był osiągnięty, a komunikat nie mógł ich wymieniać). */
    for (const m of braki) expect(r.stderr).toMatch(new RegExp(`: ${fix.dobre[m] ?? 0} z ${cele.wersje['1.1'].min[m]}`));
    if (braki.includes('pelnaKarta')) expect(r.stderr).toMatch(/pełna karta: \d+ z \d+/); else expect(r.stderr).not.toMatch(/pełna karta: \d+ z \d+/);
  });
  test('--cel: wersja bez celu → kod 1', () => {
    const r = skrypt('--cel', '9.9'); expect(r.status).toBe(1); expect(r.stderr).toMatch(/brak celu pokrycia dla wersji 9\.9/);
  });
  test('scenariusz: cel wyższy niż stan → kod 1 i lista braków', () => {
    const dir = mkdtempSync(join(tmpdir(), 'pokrycie-'));
    const plik = join(dir, 'cele.json');
    writeFileSync(plik, JSON.stringify({ wersje: { '2.0': { status: 'próba', min: { pelnaKarta: fix.dobre.pelnaKarta + 10, 'figura.v2': fix.dobre['figura.v2'] } } } }));
    const r = skrypt('--cel', '2.0', '--cele', plik);
    expect(r.status).toBe(1); expect(r.stderr).toMatch(/NIE osiągnięty/); expect(r.stderr).toMatch(/pełna karta: \d+ z \d+/); expect(r.stderr).not.toMatch(/figura v2 w aplikacji/);
  });
  test('scenariusz: cel równy stanowi → kod 0', () => {
    const dir = mkdtempSync(join(tmpdir(), 'pokrycie-'));
    const plik = join(dir, 'cele.json');
    writeFileSync(plik, JSON.stringify({ wersje: { '2.0': { status: 'próba', min: { pelnaKarta: fix.dobre.pelnaKarta } } } }));
    expect(skrypt('--cel', '2.0', '--cele', plik).status).toBe(0);
  });
});

/** Dwa standardy publikacji (właściciel 02.11.2026 ~15:30, zastępuje definicję Z3 z 31.10.2026): (1) „Pełna karta” = wskazówki (własne albo zrecenzowany zestaw ogólny) + figura v2 + role mięśni;
 * (2) „Pełna karta + błąd” = (1) + częste błędy (tekst) + animowany błąd. Mobilność bez ról mięśni (04.11.2026 (4) B). Funkcja czysta `elementyKarty` — macierz 3 trybów wskazówek × obecność elementów × mobilność. */
type Wej = { wskazowki: 'wlasne' | 'ogolne' | 'brak'; bledyTekst: boolean; figuraV2: boolean; animowanyBlad: boolean; roleMiesni: boolean; mobilnosc?: boolean };
type Wyj = { el: Record<string, boolean>; pelna: boolean; pelnaBlad: boolean; poziom: string; brakiPelna: string[] };
const elementy = (w: Wej) => JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import { elementyKarty } from './scripts/pokrycie-katalogu.mjs'; console.log(JSON.stringify(elementyKarty(${JSON.stringify(w)})));`], { cwd: root, encoding: 'utf8' })) as Wyj;
const pelneWej: Wej = { wskazowki: 'wlasne', bledyTekst: true, figuraV2: true, animowanyBlad: true, roleMiesni: true };

describe('pokrycie katalogu: dwa standardy publikacji (decyzja właściciela 02.11.2026 ~15:30)', () => {
  test.each([['wlasne', true], ['ogolne', true], ['brak', false]] as const)('tryb wskazówek %s → element „wskazówki” = %s (zestaw ogólny po recenzji liczy się jak własne; bez tekstu nie)', (tryb, ok) => {
    const r = elementy({ ...pelneWej, wskazowki: tryb });
    expect(r.el.wskazowki).toBe(ok); expect(r.pelna).toBe(ok); expect(r.pelnaBlad).toBe(ok);
  });
  test('zestaw ogólny po recenzji z figurą, rolami, częstymi błędami i animowanym błędem → standard 2 (to, czego stara definicja nie liczyła)', () => {
    expect(elementy({ ...pelneWej, wskazowki: 'ogolne' }).poziom).toBe('pelna_blad');
  });
  test.each(['figuraV2', 'roleMiesni'] as const)('brak elementu %s → ani standard 1, ani 2; brak wskazany w brakiPelna', brak => {
    const r = elementy({ ...pelneWej, [brak]: false });
    expect(r.pelna).toBe(false); expect(r.pelnaBlad).toBe(false); expect(r.poziom).toBe('brak'); expect(r.brakiPelna).toEqual([brak]);
  });
  test.each(['bledyTekst', 'animowanyBlad'] as const)('brak elementu %s → standard 1 tak, standard 2 nie (bez wymogu błędów w pełnej karcie)', brak => {
    const r = elementy({ ...pelneWej, [brak]: false });
    expect(r.pelna).toBe(true); expect(r.pelnaBlad).toBe(false); expect(r.poziom).toBe('pelna'); expect(r.brakiPelna).toEqual([]);
  });
  test('bez żadnego błędu (tekst i animacja) nadal standard 1 — drugi standard to nadbudowa, nie warunek publikacji', () => {
    expect(elementy({ ...pelneWej, bledyTekst: false, animowanyBlad: false }).poziom).toBe('pelna');
  });
  test.each([false, true])('mobilność (rozciąganie) bez ról mięśni (decyzja 04.11.2026 (4) B): standard 1 i 2 bez ról; element „roleMiesni” nadal faktem = %s', role => {
    const r = elementy({ ...pelneWej, mobilnosc: true, roleMiesni: role });
    expect(r.pelna).toBe(true); expect(r.pelnaBlad).toBe(true); expect(r.el.roleMiesni).toBe(role);
  });
  test('mobilność nadal wymaga wskazówek i figury v2 (wyjątek dotyczy tylko ról)', () => {
    expect(elementy({ ...pelneWej, mobilnosc: true, roleMiesni: false, wskazowki: 'brak' }).brakiPelna).toEqual(['wskazowki']);
    expect(elementy({ ...pelneWej, mobilnosc: true, roleMiesni: false, figuraV2: false }).brakiPelna).toEqual(['figuraV2']);
  });
  test('ćwiczenie nie-mobilnościowe bez ról nie dostaje wyjątku (mobilnosc domyślnie fałsz)', () => {
    expect(elementy({ ...pelneWej, roleMiesni: false }).pelna).toBe(false);
  });
  test('wszystkie elementy z listy ELEMENTY (docs/55) mają wartość w wyniku', () => {
    expect(Object.keys(elementy(pelneWej).el).sort()).toEqual(['animowanyBlad', 'czesteBledy', 'figuraV2', 'roleMiesni', 'wskazowki']);
  });
  test('docs/55 opisuje oba standardy i wyjątek mobilności', () => {
    const d = read('docs/55-pokrycie-katalogu.md');
    expect(d).toMatch(/\*\*Pełna karta\*\* = wskazówki \(własne albo zrecenzowany zestaw ogólny wzorca ruchu\) \+ figura v2 w aplikacji \+ role mięśni/);
    expect(d).toMatch(/\*\*Pełna karta \+ błąd\*\* = pełna karta \+ częste błędy \(tekst\) \+ animowany błąd/);
    expect(d).toMatch(/mobilności[^.]*bez ról mięśni/);
  });
  test('fixture: standard 2 ⊆ standard 1, a metryka zapadki równa liczbie', () => {
    expect(fix.razem.pelnaKartaBlad).toBeLessThanOrEqual(fix.razem.pelnaKarta);
    expect(fix.dobre.pelnaKartaBlad).toBe(fix.razem.pelnaKartaBlad);
  });
});

describe('pokrycie katalogu: lista kontrolna wydania', () => {
  test('docs/39 ma krok „Pokrycie katalogu: cel wersji osiągnięty … albo zgoda właściciela z datą”', () => {
    const d = read('docs/39-lista-kontrolna-wydania.md');
    expect(d).toMatch(/Pokrycie katalogu: cel wersji osiągnięty \(docs\/55, sekcja Cele\) albo zgoda właściciela z datą/);
    expect(d).toContain('node scripts/pokrycie-katalogu.mjs --cel');
  });
});
