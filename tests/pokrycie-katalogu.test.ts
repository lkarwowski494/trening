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
    expect(r.pelnaKarta).toBeLessThanOrEqual(Math.min(r.wskazowki.wlasneZBledami, r.figura.v2, r.animowanyBlad, r.roleMiesni));
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
    expect(r.status).toBe(1); expect(r.stderr).toMatch(/NIE osiągnięty/); expect(braki).toEqual(expect.arrayContaining(['figura.v2', 'pelnaKarta']));
    for (const m of ['figura.v2', 'pelnaKarta']) expect(r.stderr).toMatch(m === 'pelnaKarta' ? /pełna karta: \d+ z \d+/ : /figura v2 w aplikacji: \d+ z \d+/);
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

describe('pokrycie katalogu: lista kontrolna wydania', () => {
  test('docs/39 ma krok „Pokrycie katalogu: cel wersji osiągnięty … albo zgoda właściciela z datą”', () => {
    const d = read('docs/39-lista-kontrolna-wydania.md');
    expect(d).toMatch(/Pokrycie katalogu: cel wersji osiągnięty \(docs\/55, sekcja Cele\) albo zgoda właściciela z datą/);
    expect(d).toContain('node scripts/pokrycie-katalogu.mjs --cel');
  });
});
