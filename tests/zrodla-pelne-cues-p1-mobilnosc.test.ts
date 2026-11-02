/*
 * Partia P1 integracji badań (G2 mobilność: foam_roll, mobility_floor, mobility_stand, rotator_cuff; linia 1.1, 02.11.2026): karty własne 33 ćwiczeń z fali W1 G2.
 * Źródło danych: docs/research/wskazowki-fala-w1 (gałąź badania/g2-mobilnosc), przeliczenie-2026-11-02.md ma pierwszeństwo; lista ćwiczeń i zdań — tests/fixtures/cues-p1-mobilnosc.json.
 * Zakres strażnika źródeł (L-089): scripts/cues/gen.mjs `validate` (check:cues) — ten plik sprawdza, że dane P1 spełniają reguły i że pominięte zdania/ćwiczenia nie weszły.
 * Rodzaje (docs/20): dane (karty, źródła), logika (≥ 2 niezależne organizacje szczebla ≤ 4), niezmienniki (niezależność WebMD Ignite, szczebel 5 poza danymi),
 * języki (PL i EN w słownikach, reszta czeka na przekład — zestaw-przekladu-2026-11-02-p1-wskazowki.json), regresja (cue-sets: własne karty, pominięte zostają ogólne).
 * Ocena realności: błąd „karta mobilności z jednego źródła albo ze źródła marketingowego” — realny (treść w aplikacji i na stronie z ćwiczeniami); karty ukryte do recenzji niezależnej (bramka 4, L-047).
 */
import * as fs from 'fs';
import * as path from 'path';
import { CUE_DATA, CUE_SECTIONS } from '@/lib/cues';
import { CUE_FULL } from './zrodla-pelne';
import P1 from './fixtures/cues-p1-mobilnosc.json';

const root = path.join(__dirname, '..');
const json = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const pl: Record<string, string> = json('lib/cues/text/pl.json'), en: Record<string, string> = json('lib/cues/text/en.json');
const sets = json('lib/figures/v2/cue-sets.json').items as Record<string, { b: string }>;

describe('P1 mobilność: karty własne', () => {
  test('33 ćwiczeń ma komplet ustawienie + ruch w pełnych danych i w runtime; nie są w otwartych; 24 niepełne są na liście partial', () => {
    expect(P1.cwiczenia.length).toBe(33);
    for (const k of P1.cwiczenia) {
      const x = CUE_FULL.exercises[k];
      expect([k, x.setup.length >= 1, x.move.length >= 1, k in CUE_FULL.open]).toEqual([k, true, true, false]);
      expect(CUE_DATA.exercises[k] ?? CUE_DATA.hidden.includes(k)).toBeTruthy();
      expect([k, (CUE_FULL.partial ?? []).includes(k)]).toEqual([k, x.tips.length < 2]);
    }
    expect(P1.partial.length).toBe(24);
    expect([...P1.partial].sort()).toEqual(P1.cwiczenia.filter(k => CUE_FULL.exercises[k].tips.length < 2).sort());
  });

  test('karty ukryte do recenzji niezależnej (bramka 4, L-047): żadna z 33 nie jest wyświetlana, dopóki nie ma aktualnej recenzji', () => {
    for (const k of P1.cwiczenia) expect([k, CUE_DATA.hidden.includes(k), k in CUE_DATA.exercises]).toEqual([k, true, false]);
  });

  test('cue-sets: 33 ćwiczeń ma własne karty (b = own); 4 pominięte do decyzji zostają przy zestawie ogólnym', () => {
    for (const k of P1.cwiczenia) expect([k, sets[k].b]).toEqual([k, 'own']);
    for (const k of Object.keys(P1.pominiete_do_decyzji)) expect([k, sets[k].b, k in CUE_FULL.exercises]).toEqual([k, 'general', false]);
  });
});

describe('P1 mobilność: źródła i reguły szczebli', () => {
  test('każda wskazówka ma ≥ 2 organizacje szczebla ≤ 4; szczebel 5 nie wszedł do danych tych kart', () => {
    for (const k of P1.cwiczenia) for (const s of CUE_SECTIONS) for (const r of CUE_FULL.exercises[k][s]) {
      const orgs = new Set(r.s.map(([sid]) => CUE_FULL.sources[sid]).filter(x => x.level <= 4).map(x => x.org));
      expect([k, r.c, orgs.size >= 2]).toEqual([k, r.c, true]);
      for (const [sid] of r.s) expect([k, r.c, sid, CUE_FULL.sources[sid].level]).toEqual([k, r.c, sid, 4]);
    }
  });

  test('WebMD Ignite, Healthwise, StayWell i ColumbiaDoctors to jedna organizacja (korekta szczebli 02.11.2026, ustalenie przekrojowe 1)', () => {
    const ids = Object.keys(CUE_FULL.sources).filter(i => /^(webmd|healthwise|staywell|columbia|vumc|alberta)/.test(i));
    expect(ids.length).toBeGreaterThan(5);
    expect(new Set(ids.map(i => CUE_FULL.sources[i].org))).toEqual(new Set(['WebMD Ignite']));
  });

  test('nhs.uk to jedna organizacja, jedno id (nhs-sitting scalone z nhs-sitting-exercises)', () => {
    expect(CUE_FULL.sources['nhs-sitting']).toBeUndefined();
    for (const i of ['nhs-sitting-exercises', 'nhs-flexibility']) expect(CUE_FULL.sources[i]?.org ?? 'NHS (nhs.uk)').toBe('NHS (nhs.uk)');
  });

  test('Eleiko: organizacja warunkowo szczebla 4 — każde źródło ma własny szczebel i opis strony (docs/18, 02.11.2026, uzupełnienie 3)', () => {
    expect(typeof CUE_FULL.orgs.Eleiko.warunkowo).toBe('string');
    const src = Object.values(CUE_FULL.sources).filter(s => s.org === 'Eleiko');
    expect(src.length).toBeGreaterThan(0);
    for (const s of src) expect([s.level, (s.strona ?? '').length > 20]).toEqual([4, true]);
  });

  test('źródła spoza zakresu pominięte: sportowe centra uczelni, sieci siłowni, marketing i strony bez daty nie wchodzą do danych', () => {
    for (const bad of ['hku-foam-rolling', 'sussex-rotations', 'sussex-trapezius', 'gymreapers-band-pull-aparts', 'sole-cuban-press', 'webmd-heelcord', 'webmd-side-bend', 'staywell-89925', 'topend-quads-lying', 'baystate-pmc-strap', 'sportsg-inclusive-warmup', 'kmpt-stretches'])
      expect([bad, bad in CUE_FULL.sources]).toEqual([bad, false]);
  });
});

describe('P1 mobilność: zdania', () => {
  test('82 nowe zdania mają tekst PL i EN, a pominięte (z < 2 źródłami szczebla ≤ 4) nie istnieją w słownikach', () => {
    expect(P1.zdania.length).toBe(82);
    for (const c of idyP1Nowe()) expect([c, typeof pl[c], typeof en[c], pl[c].trim().length > 0, en[c].trim().length > 0]).toEqual([c, 'string', 'string', true, true]);
    expect(idyP1Nowe().size).toBe(82);
    for (const c of P1.pominiete_zdania) expect([c, c in pl, c in en]).toEqual([c, false, false]);
    expect(P1.pominiete_zdania.length).toBe(48);
  });

  test('zdania nowe czekają na przekład w zestawie zestaw-przekladu-2026-11-02-p1-wskazowki.json (rodzaj „nowy”) i nie mają tekstu w innych językach', () => {
    const z = json('docs/lokalizacja/zestaw-przekladu-2026-11-02-p1-wskazowki.json').klucze as { rodzaj: string; id: string; pl: string; en: string }[];
    expect(z.map(k => k.id).sort()).toEqual([...idyP1Nowe()].sort());
    for (const k of z) expect([k.id, k.rodzaj, k.pl, k.en]).toEqual([k.id, 'nowy', pl[k.id], en[k.id]]);
    for (const l of ['de', 'fr', 'ja']) { const d = json(`lib/cues/text/${l}.json`); for (const k of z) expect([l, k.id, d[k.id]]).toEqual([l, k.id, undefined]); }
  });

  test('teksty nowych zdań: bez liczb (czas, powtórzenia), bez twierdzeń o bólu i zdrowiu, bez nazw źródeł — liczby i zdrowie wymagają osobnych źródeł', () => {
    for (const c of idyP1Nowe()) for (const t of [pl[c], en[c]]) {
      expect([c, /\d/.test(t)]).toEqual([c, false]);
      expect([c, /\b(boli|ból|bólu|kontuzj|pain|injur)/i.test(t)]).toEqual([c, false]);
      expect([c, /NASM|\bACE\b|NHS|WebMD|Healthline|OrthoBethesda/i.test(t)]).toEqual([c, false]);
    }
  });
});

/** Zdania dodane w P1: id z fixture, których nie było przed partią (przetłumaczone zdania ogólne `smr.*`, `st.*`, `dyn.*` istnieją w 35 słownikach). */
function idyP1Nowe(): Set<string> {
  const de = json('lib/cues/text/de.json') as Record<string, string>;
  return new Set(P1.zdania.filter(c => !(c in de)));
}
