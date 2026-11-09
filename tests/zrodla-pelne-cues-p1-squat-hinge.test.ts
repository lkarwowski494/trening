/*
 * Partia P1 integracji badań (rodziny squat i hinge z rysunkiem v2, status ready; linia 1.1, 09.11.2026): karty własne z badań W1 (Single Leg RDL — blok po przeliczeniu
 * szczebli, badania/g4-nogi) i W2 (badania/w2-nogi: hinge-cz1, hinge-cz2, squat-cz1, squat-cz2) z 02.11.2026. Lista 17 ćwiczeń — STAN-A2 (P1); wynik, karty niepełne, zdania, odrzucone
 * zdania i odwołania — tests/fixtures/cues-p1-squat-hinge.json.
 * Zakres strażnika źródeł (L-089): scripts/cues/gen.mjs `validate` (check:cues; MIN_ORGS = 2, MAX_COUNT_LEVEL = 4 — scripts/cues/gen.mjs:17 i :33) — ten plik sprawdza, że dane P1
 * spełniają regułę bez wyjątków partii: każde zdanie ma ≥ 2 organizacje szczebla ≤ 4 (bez „wniosek” i bez luk), źródło szczebla 5 (blog producenta) nie weszło, a każdy błąd karty
 * ma pozę rysunku rigowego (lib/figures/v2/errors.ts ERRORS[].cue i faultApplicable — lib/figures/v2/figure.ts:87); błąd bez pozy i karta bez błędu przy rodzinie ready nie wchodzą
 * (zestaw ogólny z animowanym błędem zostaje — docs/18, 02.11.2026).
 * Rodzaje (docs/20): dane (karty, źródła), logika (≥ 2 organizacje, błąd z pozą), niezmienniki (bez „wniosek”, reguły sensu póz bez zmian), języki (PL i EN; 33 języki — zestaw
 * przekładu P1), regresja (cue-sets: własne karty; odrzucone zostają przy zestawie ogólnym; karty ukryte do przekładu — karty_nowe).
 * Ocena realności: błąd „karta techniki z jednego źródła albo ze źródła szczebla 5” — realny (treść w aplikacji i na stronie z ćwiczeniami); karty ukryte do recenzji niezależnej
 * i przekładu (bramka 4, L-047, karty_nowe) — nie sprawdzamy tu ich wyświetlania.
 */
import * as fs from 'fs';
import * as path from 'path';
import { CUE_DATA, CUE_SECTIONS } from '@/lib/cues';
import { CUE_TO_ERROR } from '@/lib/figures/v2/errors';
import { figureSpec, faultApplicable } from '@/lib/figures/v2/figure';
import { CUE_FULL } from './zrodla-pelne';
import P1 from './fixtures/cues-p1-squat-hinge.json';

const root = path.join(__dirname, '..');
const json = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const pl: Record<string, string> = json('lib/cues/text/pl.json'), en: Record<string, string> = json('lib/cues/text/en.json');
const sets = json('lib/figures/v2/cue-sets.json').items as Record<string, { b: string }>;
const orgOf = (sid: string) => CUE_FULL.sources[sid].org;
/** Szczebel źródła: własny (organizacje warunkowe) albo szczebel organizacji — jak srcLevel() w scripts/cues/gen.mjs. */
const lv = (sid: string): number => CUE_FULL.sources[sid].level ?? CUE_FULL.orgs[orgOf(sid)].level;
const sentencesOf = (k: string) => CUE_SECTIONS.flatMap(s => CUE_FULL.exercises[k][s] ?? []);
const LISTA_P1 = ['Stiff-Legged Barbell Deadlift', 'Smith Machine Stiff-Legged Deadlift', 'Deficit Deadlift', 'Sumo Deadlift (kettlebell)', 'Clean Deadlift', 'Axle Deadlift', 'Cable Deadlift',
  'Single Leg RDL (hantel)', 'Single Leg RDL (linki)', 'Barbell Hack Squat', 'Bodyweight Squat', 'Dumbbell Squat', 'Overhead Squat', 'Zercher Squat', 'Double Kettlebell Front Squat', 'Squat with Chains', 'Squat with Bands'];

describe('P1 squat i hinge: karty własne (09.11.2026)', () => {
  test('9 z 17 ćwiczeń listy P1 ma komplet ustawienie + ruch + ≥ 1 błąd w pełnych danych; w runtime ukryte (hidden) do recenzji i przekładu; nie są w otwartych; niepełne na liście partial', () => {
    expect([...P1.cwiczenia, ...P1.bezBledu].sort()).toEqual([...LISTA_P1].sort());
    expect(P1.cwiczenia.length).toBe(9);
    for (const k of P1.cwiczenia) {
      const x = CUE_FULL.exercises[k];
      expect([k, (x.setup ?? []).length >= 1, (x.move ?? []).length >= 1, (x.mistakes ?? []).length >= 1, k in CUE_FULL.open]).toEqual([k, true, true, true, false]);
      expect([k, CUE_DATA.hidden.includes(k), k in CUE_DATA.exercises]).toEqual([k, true, false]);
      expect([k, (CUE_FULL.partial ?? []).includes(k)]).toEqual([k, (x.tips ?? []).length < 2]);
      for (const s of CUE_SECTIONS) expect([k, s, (CUE_FULL.exercises[k][s] ?? []).length <= 4]).toEqual([k, s, true]);
    }
    expect([...P1.partial].sort()).toEqual(P1.cwiczenia.filter(k => (CUE_FULL.exercises[k].tips ?? []).length < 2).sort());
  });

  test('karty ukryte do przekładu: wszystkie 9 na liście karty_nowe (tests/recenzja-wyjatki-1-1.json), bez wpisu „karty” w docs/research/figury-recenzja.json (autor nie wpisuje recenzji, L-047)', () => {
    const wyj = json('tests/recenzja-wyjatki-1-1.json'), rec = json('docs/research/figury-recenzja.json');
    for (const k of P1.cwiczenia) expect([k, wyj.karty_nowe.includes(k), !!rec.karty?.[k]]).toEqual([k, true, false]);
  });

  test('cue-sets: 9 ćwiczeń ma własne karty (b = own); 8 bez błędu z dwiema organizacjami zostaje przy zestawie ogólnym rodziny (z animowanym błędem) i bez karty własnej', () => {
    for (const k of P1.cwiczenia) expect([k, sets[k].b]).toEqual([k, 'own']);
    expect([...P1.bezBledu].sort()).toEqual(['Axle Deadlift', 'Cable Deadlift', 'Deficit Deadlift', 'Double Kettlebell Front Squat', 'Smith Machine Stiff-Legged Deadlift', 'Stiff-Legged Barbell Deadlift', 'Sumo Deadlift (kettlebell)', 'Zercher Squat']);
    for (const k of P1.bezBledu) expect([k, sets[k].b, k in CUE_FULL.exercises]).toEqual([k, 'general', false]);
    expect(P1.bezUstawieniaLubRuchu).toEqual([]);
  });

  test('reguły sensu póz (lib/figures/v2/reguly-cwiczen.json — plik wspólny silnika) bez zmian dla kart P1', () => {
    const r = json('lib/figures/v2/reguly-cwiczen.json');
    const SQ = ['plecy_neutralne', 'kolana_nad_stopami', 'piety_na_podlodze', 'zejscie_biodra_i_kolana', 'udo_rownolegle'];
    for (const k of ['Barbell Hack Squat', 'Bodyweight Squat', 'Dumbbell Squat', 'Overhead Squat', 'Squat with Chains', 'Squat with Bands']) expect([k, r.squat[k]]).toEqual([k, SQ]);
    expect(r.hinge['Clean Deadlift']).toEqual(['plecy_neutralne', 'ciezar_przy_nogach', 'wyprost_na_gorze']);
    for (const k of ['Single Leg RDL (hantel)', 'Single Leg RDL (linki)']) expect([k, r.hinge[k]]).toEqual([k, ['plecy_neutralne', 'ciezar_przy_nogach_jednonoz']]);
  });
});

describe('P1 squat i hinge: błędy a rysunek v2 (docs/18, 02.11.2026: błąd karty ma pozę albo jest odrzucony)', () => {
  test('każdy błąd karty ma pozę rysunku rigowego (CUE_TO_ERROR) i stosuje się do wariantu rysunku ćwiczenia (faultApplicable), gdy ćwiczenie ma figurę v2', () => {
    for (const k of P1.cwiczenia) {
      const spec = figureSpec(k);
      for (const r of CUE_FULL.exercises[k].mistakes ?? []) {
        const e = CUE_TO_ERROR[r.c];
        expect([k, r.c, typeof e]).toEqual([k, r.c, 'string']);
        if (spec) expect([k, r.c, faultApplicable(spec, e)]).toEqual([k, r.c, true]);
      }
    }
  });
  test('błędy bez pozy rigu odrzucone i zapisane (slrdl.mis.hipOpen, ohs.mis.armsForward) — nie są w kartach ani w słownikach', () => {
    expect(P1.bezPozy).toEqual([['Single Leg RDL (hantel)', 'slrdl.mis.hipOpen'], ['Single Leg RDL (linki)', 'slrdl.mis.hipOpen'], ['Overhead Squat', 'ohs.mis.armsForward']]);
    for (const [k, c] of P1.bezPozy) expect([k, c, sentencesOf(k).some(r => r.c === c), c in pl]).toEqual([k, c, false, false]);
  });
});

describe('P1 squat i hinge: źródła i reguły szczebli', () => {
  test('każde zdanie ma ≥ 2 różne organizacje szczebla ≤ 4; bez luk i bez „wniosek”', () => {
    for (const k of P1.cwiczenia) for (const r of sentencesOf(k)) {
      const orgs4 = new Set(r.s.filter(([sid]) => sid !== 'wniosek' && lv(sid) <= 4).map(([sid]) => orgOf(sid)));
      expect([k, r.c, orgs4.size >= 2]).toEqual([k, r.c, true]);
      expect([k, r.c, r.s.some(([sid]) => sid === 'wniosek'), CUE_FULL.luki?.[`${k}::${r.c}`]]).toEqual([k, r.c, false, undefined]);
    }
  });

  test('blog producenta (Bells of Steel, Cable Deadlift) = szczebel 5: nie ma go w danych, odwołania zapisane w fixture', () => {
    expect('bos-cable-deadlift' in CUE_FULL.sources).toBe(false);
    expect(new Set(P1.usunieteOdwolania.map(([, , sid]) => sid))).toEqual(new Set(['bos-cable-deadlift']));
  });

  test('zdania odrzucone (mniej niż dwie organizacje, w tym błędy wnioskowane) nie są w kartach; zdania tylko z odrzuconych pozycji nie weszły do słowników', () => {
    expect(P1.odrzucone.length).toBe(14);
    for (const [k, , c] of P1.odrzucone) if (P1.cwiczenia.includes(k as string)) expect([k, c, sentencesOf(k as string).some(r => r.c === c)]).toEqual([k, c, false]);
    for (const c of ['sq.mis.roundBack', 'sq.mis.chestDrop', 'kbfs.mis.drop', 'dl.mis.hipsFirst', 'sldl.setup', 'def.setup', 'sumoKb.grip', 'axle.setup', 'cabledl.setup', 'zer.hold', 'kbfs.rack']) expect([c, c in pl, c in en]).toEqual([c, false, false]);
  });

  test('nowe źródła: adres https, organizacja z danych; Coach (organizacja warunkowa) — szczebel 4 z opisem strony (autor z kwalifikacjami i data); EliteFTS — instrukcje ustawienia własnego sprzętu (gumy, łańcuchy)', () => {
    expect(P1.noweZrodla.length).toBe(16);
    for (const sid of P1.noweZrodla) {
      const s = CUE_FULL.sources[sid] as { url?: string; org: string; level?: number; strona?: string };
      expect([sid, /^https:\/\//.test(s.url ?? ''), s.org in CUE_FULL.orgs, lv(sid)]).toEqual([sid, true, true, 4]);
      if (CUE_FULL.orgs[s.org].warunkowo) expect([sid, s.level, typeof s.strona]).toEqual([sid, 4, 'string']);
    }
    expect(P1.noweZrodla.filter(sid => CUE_FULL.orgs[orgOf(sid)].warunkowo).sort()).toEqual(['coach-hack-squat', 'coach-single-leg-romanian-deadlift']);
    expect(P1.noweZrodla.filter(sid => orgOf(sid) === 'EliteFTS').sort()).toEqual(['elitefts-bands-setup', 'elitefts-set-up-chains']);
  });

  test('wariant sprzętu (źródła wersji bazowej) ma jawne „uproszczenie” przy zdaniu — do potwierdzenia przez recenzenta niezależnego (docs/18, 02.11.2026, pkt 2)', () => {
    const upr = (k: string, c: string) => typeof (sentencesOf(k).find(r => r.c === c) as { uproszczenie?: string } | undefined)?.uproszczenie;
    for (const k of ['Dumbbell Squat', 'Squat with Chains', 'Squat with Bands']) for (const r of sentencesOf(k)) if (r.s.some(([, m]) => /uproszczenie/.test(m))) expect([k, r.c, upr(k, r.c)]).toEqual([k, r.c, 'string']);
    for (const c of ['ohs.setup', 'ohs.move', 'ohs.arms', 'sq.mis.heels']) expect(['Overhead Squat', c, upr('Overhead Squat', c)]).toEqual(['Overhead Squat', c, 'string']);
    for (const k of ['Clean Deadlift', 'Bodyweight Squat', 'Barbell Hack Squat']) for (const r of sentencesOf(k)) expect([k, r.c, upr(k, r.c)]).toEqual([k, r.c, 'undefined']);
  });
});

describe('P1 squat i hinge: zdania', () => {
  test('10 nowych zdań ma tekst PL i EN różny od siebie; wszystkie czekają na przekład w zestawie P1 (pozostałe języki — angielski w zastępstwie)', () => {
    expect(P1.zdania.length).toBe(10);
    for (const c of P1.zdania) expect([c, typeof pl[c], typeof en[c], pl[c].trim().length > 0, en[c].trim().length > 0, pl[c] !== en[c]]).toEqual([c, 'string', 'string', true, true, true]);
    const z = json('docs/lokalizacja/zestaw-przekladu-2026-11-09-p1-wskazowki.json');
    expect(z.klucze.map((x: { id: string }) => x.id)).toEqual([...P1.zdania].sort());
    for (const x of z.klucze as { id: string; pl: string; en: string }[]) expect([x.id, x.pl, x.en]).toEqual([x.id, pl[x.id], en[x.id]]);
  });

  test('teksty: bez cyfr, bez twierdzeń o bólu i zdrowiu, bez nazw źródeł i marek', () => {
    for (const c of P1.zdania) for (const t of [pl[c], en[c]]) {
      expect([c, /\d/.test(t)]).toEqual([c, false]);
      expect([c, /\b(boli|ból|bólu|kontuzj|pain|injur)/i.test(t)]).toEqual([c, false]);
      expect([c, /NASM|\bACE\b|ISSA|Catalyst|BarBend|EliteFTS|Coach|Bells of Steel|ExRx|Stronger by Science/i.test(t)]).toEqual([c, false]);
    }
  });
});
