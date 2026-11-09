/*
 * Partia B2 linii 1.1 (figury nóg, 09.11.2026): 7 kart własnych z badań A2 wstrzymanych w A2, bo animowany błąd w pozach v2 nie był błędem karty
 * (tests/fixtures/cues-a2-nogi.json „konfliktPozy”). Lista ćwiczeń, zdań, decyzji o błędach — tests/fixtures/cues-b2-nogi.json.
 * Zakres strażników (L-089): kontrakt „animowany błąd = błąd karty” — scripts/figures/agent-pozy/model.mjs:85 (zbuduj filtruje bledy po bledyCwiczenia)
 * i scripts/figures/v2-validate.mjs:30–35 (bledyCwiczenia: karta własna z pełnych danych); źródła — scripts/cues/gen.mjs `validate` (MIN_ORGS = 2, MAX_COUNT_LEVEL = 4).
 * Ten plik sprawdza dane B2 i niezmiennik w CAŁYCH plikach póz rodzin lunge, leg_isolation i glute_floor.
 * Rodzaje (docs/20): dane (karty, źródła, pozy), logika (≥ 2 organizacje; błąd w pozie ⊆ błędy karty), niezmienniki (każdy błąd karty: animowany albo z powodem
 * w bledy_bez_animacji), języki (PL i EN; 33 języki — zestaw przekładu B2), regresja (A2 „konfliktPozy” = karty B2; glute_floor wstrzymany — grupy błędów bez zmian).
 * Ocena realności: błąd „animacja pokazuje błąd, którego karta nie opisuje” — realny (niespójność karta–rysunek widoczna w aplikacji i na stronie);
 * karty są ukryte do recenzji niezależnej (bramka 4, L-047, L-050) — nie sprawdzamy tu ich wyświetlania.
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { CUE_DATA, CUE_SECTIONS } from '@/lib/cues';
import { CUE_FULL } from './zrodla-pelne';
import A2 from './fixtures/cues-a2-nogi.json';
import B2 from './fixtures/cues-b2-nogi.json';

jest.setTimeout(60000);
const root = path.join(__dirname, '..');
const json = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const pl: Record<string, string> = json('lib/cues/text/pl.json'), en: Record<string, string> = json('lib/cues/text/en.json');
const sets = json('lib/figures/v2/cue-sets.json').items as Record<string, { b: string }>;
const sens = json('data/zrodla/figury-sens.json').rodziny as Record<string, { grupy_bledow?: Record<string, string>; bledy_bez_animacji?: Record<string, string> }>;
type Poza = { bledy: { cue: string }[] };
const pozy = (r: string) => json(`lib/figures/v2/poses/${r}.json`).cwiczenia as Record<string, Poza>;
const orgOf = (sid: string) => CUE_FULL.sources[sid].org;
const lv = (sid: string): number => CUE_FULL.sources[sid].level ?? CUE_FULL.orgs[orgOf(sid)].level;
const sentencesOf = (k: string) => CUE_SECTIONS.flatMap(s => CUE_FULL.exercises[k][s] ?? []);
const RODZINY = ['lunge', 'leg_isolation', 'glute_floor'];
const RODZINA: Record<string, string> = { 'Slider Hamstring Curl': 'leg_isolation' };
const rodzinaOf = (k: string) => RODZINA[k] ?? 'lunge';
/** bledyCwiczenia (scripts/figures/v2-validate.mjs) dla wszystkich ćwiczeń z plików póz trzech rodzin — te same dane, które filtruje generator. */
const DOZWOLONE: Record<string, string[]> = JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import { bledyCwiczenia } from ${JSON.stringify(path.join(root, 'scripts/figures/v2-validate.mjs'))};
import { readFileSync } from 'node:fs';
const out = {}; for (const r of ${JSON.stringify(RODZINY)}) for (const k of Object.keys(JSON.parse(readFileSync(${JSON.stringify(path.join(root, 'lib/figures/v2/poses'))} + '/' + r + '.json', 'utf8')).cwiczenia)) out[k] = bledyCwiczenia(k);
console.log(JSON.stringify(out));`], { encoding: 'utf8' }));

describe('B2 nogi (09.11.2026): karty własne 7 ćwiczeń wstrzymanych w A2', () => {
  test('7 ćwiczeń = A2 „konfliktPozy”; komplet ustawienie + ruch, karta własna (b = own), ukryta do recenzji (hidden, karty_nowe), nie w otwartych; niepełne na liście partial', () => {
    expect([...B2.cwiczenia].sort()).toEqual(A2.konfliktPozy.map(([k]) => k as string).sort());
    const nowe = json('tests/recenzja-wyjatki-1-1.json').karty_nowe as string[];
    for (const k of B2.cwiczenia) {
      const x = CUE_FULL.exercises[k];
      expect([k, (x.setup ?? []).length >= 1, (x.move ?? []).length >= 1, k in CUE_FULL.open, sets[k].b, CUE_DATA.hidden.includes(k), nowe.includes(k)]).toEqual([k, true, true, false, 'own', true, true]);
      expect([k, (CUE_FULL.partial ?? []).includes(k)]).toEqual([k, (x.tips ?? []).length < 2]);
    }
    expect([...B2.partial].sort()).toEqual(B2.cwiczenia.filter(k => (CUE_FULL.exercises[k].tips ?? []).length < 2).sort());
  });

  test('każde zdanie ma ≥ 2 różne organizacje szczebla ≤ 4; bez „wniosek” i bez luk; zdanie odrzucone (llc.control — jedna organizacja) nie jest w karcie', () => {
    for (const k of B2.cwiczenia) for (const r of sentencesOf(k)) {
      const orgs4 = new Set(r.s.filter(([sid]) => sid !== 'wniosek' && lv(sid) <= 4).map(([sid]) => orgOf(sid)));
      expect([k, r.c, orgs4.size >= 2, r.s.some(([sid]) => sid === 'wniosek'), CUE_FULL.luki?.[`${k}::${r.c}`]]).toEqual([k, r.c, true, false, undefined]);
    }
    expect(B2.odrzucone).toEqual([['Slider Hamstring Curl', 'tips', 'llc.control', ['ACE']]]);
    expect(sentencesOf('Slider Hamstring Curl').some(r => r.c === 'llc.control')).toBe(false);
    for (const sid of B2.noweZrodla) expect([sid, /^https:\/\//.test(CUE_FULL.sources[sid].url ?? ''), CUE_FULL.sources[sid].org in CUE_FULL.orgs]).toEqual([sid, true, true]);
  });
});

describe('B2 nogi (09.11.2026): animowany błąd = błąd karty', () => {
  test('niezmiennik w całych plikach póz lunge, leg_isolation, glute_floor: każdy rząd błędu jest błędem ćwiczenia (bledyCwiczenia)', () => {
    for (const r of RODZINY) for (const [k, p] of Object.entries(pozy(r))) for (const b of p.bledy) expect([r, k, b.cue, (DOZWOLONE[k] ?? []).includes(b.cue)]).toEqual([r, k, b.cue, true]);
  });

  test('wycofane z animacji (lunge.mis.kneeIn, ht.mis.arch): pozy 5 kart bez rzędu błędu; każdy błąd tych kart ma w figury-sens.json powód braku animacji', () => {
    expect(B2.wycofaneZAnimacji.map(([k]) => k).sort()).toEqual(['Barbell Step Up', 'Barbell Walking Lunge', 'Lunges (sztanga)', 'Slider Hamstring Curl', 'Split Squat']);
    for (const [k] of B2.wycofaneZAnimacji) {
      const r = rodzinaOf(k);
      expect([k, pozy(r)[k].bledy]).toEqual([k, []]);
      for (const m of CUE_FULL.exercises[k].mistakes ?? []) expect([k, m.c, (sens[r].bledy_bez_animacji?.[m.c] ?? '').length > 20]).toEqual([k, m.c, true]);
    }
    for (const [r, ids] of Object.entries(B2.bledyBezAnimacji)) for (const id of ids) expect([r, id, sens[r].bledy_bez_animacji?.[id]]).toEqual([r, id, expect.stringMatching(/^B2 09\.11\.2026: /)]);
  });

  test('przysiad bułgarski ze sztangą i w suwnicy: lunge.mis.kneeIn na karcie ze źródłami karty Bulgarian Split Squat (hantle) jako uproszczenie „wariant sprzętu”; animacja błędu kolana zostaje', () => {
    const baza = CUE_FULL.exercises['Bulgarian Split Squat (hantle)'].mistakes!.find(m => m.c === 'lunge.mis.kneeIn')!;
    for (const [k, c, z] of B2.bladDodanyWariantSprzetu) {
      expect(z).toBe('Bulgarian Split Squat (hantle)');
      const m = CUE_FULL.exercises[k].mistakes!.find(x => x.c === c)!;
      // źródła karty hantli + dopisane NSCA PTQ 4.4 tab. 1 (recenzja badacza 09.11.2026, b2-nogi-karty-badacz-2026-11-09.md)
      expect([k, m.s, /^wariant sprzętu: hantle/.test((m as { uproszczenie?: string }).uproszczenie ?? '')]).toEqual([k, [...baza.s, ['nsca-ptq-lunge', expect.stringMatching(/^Table 1, .*Knee Caves Inward/)]], true]);
      expect([k, pozy('lunge')[k].bledy.map(b => b.cue)]).toEqual([k, ['lunge.mis.kneeIn']]);
    }
  });

  test('glute_floor bez zmian (wstrzymane do decyzji koordynatora): Clamshell i Fire Hydrant bez rzędu błędu, karta ma błąd bez animacji; grupy błędów rodziny nie zmienione (lib/figures/v2/grupy.json to plik wspólny skrótu rodzin v2)', () => {
    for (const [k, c] of B2.gluteFloorWstrzymane) {
      expect([k, pozy('glute_floor')[k].bledy]).toEqual([k, []]);
      expect([k, (CUE_FULL.exercises[k].mistakes ?? []).map(m => m.c)]).toEqual([k, [c]]);
    }
    expect(sens.glute_floor.grupy_bledow).toEqual({ 'hext.mis.arch': 'plecy', 'hab.mis.high': 'miednica' });
    const V2_WSPOLNE = fs.readFileSync(path.join(root, 'scripts/zrodla-runtime.mjs'), 'utf8').match(/export const V2_WSPOLNE = \[([^\]]*)\]/)![1];
    expect(V2_WSPOLNE).toContain("'lib/figures/v2/grupy.json'");
  });
});

describe('B2 nogi (09.11.2026): zdania', () => {
  test('8 nowych zdań ma tekst PL i EN różny od siebie; wszystkie czekają na przekład w zestawie B2', () => {
    expect(B2.zdania.length).toBe(8);
    for (const c of B2.zdania) expect([c, typeof pl[c], typeof en[c], pl[c] !== en[c]]).toEqual([c, 'string', 'string', true]);
    const z = json('docs/lokalizacja/zestaw-przekladu-2026-11-09-b2-wskazowki.json');
    expect(z.klucze.map((x: { id: string }) => x.id)).toEqual([...B2.zdania].sort());
    for (const x of z.klucze as { id: string; pl: string; en: string }[]) expect([x.id, x.pl, x.en]).toEqual([x.id, pl[x.id], en[x.id]]);
  });

  test('teksty: bez cyfr, bez twierdzeń o bólu i zdrowiu, bez nazw źródeł i marek', () => {
    for (const c of B2.zdania) for (const t of [pl[c], en[c]]) {
      expect([c, /\d/.test(t)]).toEqual([c, false]);
      expect([c, /\b(boli|ból|bólu|kontuzj|pain|injur)/i.test(t)]).toEqual([c, false]);
      expect([c, /NASM|\bACE\b|ISSA|NFPT|NCSF|NISMAT|NSCA|Catalyst|BarBend|Human Kinetics|ExRx/i.test(t)]).toEqual([c, false]);
    }
  });
});
