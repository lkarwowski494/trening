/*
 * Partia P1 integracji badań (G2 mobilność: foam_roll, mobility_floor, mobility_stand, rotator_cuff; linia 1.1, 02.11.2026): karty własne 30 ćwiczeń z fali W1 G2 (33 minus 3 z zestawem ogólnym po recenzji — decyzja koordynatora 02.11.2026).
 * Źródło danych: docs/research/wskazowki-fala-w1 (gałąź badania/g2-mobilnosc), przeliczenie-2026-11-02.md ma pierwszeństwo; lista ćwiczeń i zdań — tests/fixtures/cues-p1-mobilnosc.json.
 * Zakres strażnika źródeł (L-089): scripts/cues/gen.mjs `validate` (check:cues) — ten plik sprawdza, że dane P1 spełniają reguły i że pominięte zdania/ćwiczenia nie weszły.
 * Rodzaje (docs/20): dane (karty, źródła), logika (≥ 2 niezależne organizacje szczebla ≤ 4), niezmienniki (niezależność WebMD Ignite, szczebel 5 poza danymi),
 * języki (PL i EN w słownikach, reszta czeka na przekład — zestaw-przekladu-2026-11-02-p1-wskazowki.json), regresja (cue-sets: własne karty, pominięte zostają ogólne).
 * Ocena realności: błąd „karta mobilności z jednego źródła albo ze źródła marketingowego” — realny (treść w aplikacji i na stronie z ćwiczeniami); karty po recenzji niezależnej (bramka 4, L-047; wpisy 02.11.2026).
 */
import * as fs from 'fs';
import * as path from 'path';
import { CUE_DATA, CUE_SECTIONS } from '@/lib/cues';
import { CUE_FULL } from './zrodla-pelne';
import P1 from './fixtures/cues-p1-mobilnosc.json';
import A3 from './fixtures/cues-a3-przyciaganie.json';

const root = path.join(__dirname, '..');
const json = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const pl: Record<string, string> = json('lib/cues/text/pl.json'), en: Record<string, string> = json('lib/cues/text/en.json');
const REC = json('docs/research/figury-recenzja.json') as { karty: Record<string, { werdykt: string; autor: string; recenzent: string }> };
const sets = json('lib/figures/v2/cue-sets.json').items as Record<string, { b: string }>;

describe('P1 mobilność: karty własne', () => {
  test('30 ćwiczeń ma komplet ustawienie + ruch w pełnych danych i w runtime; nie są w otwartych; 23 niepełne są na liście partial', () => {
    expect(P1.cwiczenia.length).toBe(30);
    for (const k of P1.cwiczenia) {
      const x = CUE_FULL.exercises[k];
      expect([k, x.setup.length >= 1, x.move.length >= 1, k in CUE_FULL.open]).toEqual([k, true, true, false]);
      expect(CUE_DATA.exercises[k] ?? CUE_DATA.hidden.includes(k)).toBeTruthy();
      expect([k, (CUE_FULL.partial ?? []).includes(k)]).toEqual([k, x.tips.length < 2]);
    }
    expect(P1.partial.length).toBe(23);
    expect([...P1.partial].sort()).toEqual(P1.cwiczenia.filter(k => CUE_FULL.exercises[k].tips.length < 2).sort());
  });

  test('bramka 4 (L-047): 30 kart ma recenzję niezależną (wyświetlane) — Supine Spinal Twist po poprawce i ponownej recenzji (03.11.2026)', () => {
    for (const k of P1.cwiczenia) {
      const rec = REC.karty[k];
      expect([k, rec.werdykt, rec.autor !== rec.recenzent]).toEqual([k, 'wyswietlana', true]);
      expect([k, CUE_DATA.hidden.includes(k), k in CUE_DATA.exercises]).toEqual([k, false, true]);
    }
    expect((REC.karty['Supine Spinal Twist'] as { data?: string }).data).toBe('2026-11-03');
  });

  test('Supine Spinal Twist: opis obu kolan (źródła opisują oba kolana, decyzja koordynatora 02.11.2026), bez „jednego kolana” i „w poprzek ciała”', () => {
    expect([pl['mobility_floor.t.supTwist.setup'], pl['mobility_floor.t.supTwist.move']]).toEqual(['Połóż się na plecach, kolana ugięte, stopy płasko na podłodze.', 'Powoli opuść oba kolana na jedną stronę; barki zostają na podłodze.']);
    expect([en['mobility_floor.t.supTwist.setup'], en['mobility_floor.t.supTwist.move']]).toEqual(['Lie on your back with your knees bent and your feet flat on the floor.', 'Slowly lower both knees to one side; your shoulders stay on the floor.']);
  });

  test('cue-sets: 30 ćwiczeń ma własne karty (b = own); 4 pominięte do decyzji zostają przy zestawie ogólnym', () => {
    for (const k of P1.cwiczenia) expect([k, sets[k].b]).toEqual([k, 'own']);
    for (const k of Object.keys(P1.pominiete_do_decyzji)) expect([k, sets[k].b, k in CUE_FULL.exercises]).toEqual([k, 'general', false]);
  });

  test('3 ćwiczenia ze zrecenzowanym zestawem ogólnym wyłączone z P1 (decyzja koordynatora 02.11.2026): zostają przy zestawie ogólnym, bez karty własnej', () => {
    expect(Object.keys(P1.wylaczone_zestaw_ogolny).sort()).toEqual(['Kneeling Hip Flexor Stretch', 'Overhead Stretch', 'Standing Gastrocnemius Calf Stretch']);
    for (const k of Object.keys(P1.wylaczone_zestaw_ogolny)) expect([k, sets[k].b, k in CUE_FULL.exercises, P1.cwiczenia.includes(k)]).toEqual([k, 'general', false, false]);
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

  test('producent sprzętu z działem edukacji: organizacja warunkowo szczebla 4 — każde źródło ma własny szczebel i opis strony (docs/18, 02.11.2026, uzupełnienie 3)', () => {
    /* 08.11.2026 (A1 pchanie): organizacje warunkowe są dwóch rodzajów — producent sprzętu z działem edukacji (uzupełnienie 3, kind „maker”) i serwis z artykułami autorskimi (uzupełnienie 2, kind „site”: The Prehab Guys, karta Decline Push Up). Ten test pilnuje pierwszego rodzaju (jedna taka organizacja w danych), więc filtruje po kind „maker”; drugi rodzaj ma osobną kontrolę „strona” przy każdym źródle (tests/zrodla-pelne-cues-a1-pchanie.test.ts). */
    const warunkowe = Object.entries(CUE_FULL.orgs).filter(([, o]) => typeof (o as { warunkowo?: string }).warunkowo === 'string' && (o as { kind?: string }).kind === 'maker').map(([k]) => k);
    // organizacje warunkowe szczebla 5 (np. serwis bez autora) nie wchodzą do danych jako szczebel 4 — tu tylko producent sprzętu z edukacją (szczebel 4)
    const org4 = warunkowe.filter(k => Object.values(CUE_FULL.sources).some(s => s.org === k && s.level === 4));
    expect(org4.length).toBe(1);
    const src = Object.values(CUE_FULL.sources).filter(s => s.org === org4[0]);
    expect(src.length).toBeGreaterThan(0);
    for (const s of src) expect([s.level, (s.strona ?? '').length > 20]).toEqual([4, true]);
  });

  test('źródła spoza zakresu pominięte: sportowe centra uczelni, sieci siłowni, marketing i strony bez daty nie wchodzą do danych', () => {
    for (const bad of ['hku-foam-rolling', 'sussex-rotations', 'sussex-trapezius', 'gymreapers-band-pull-aparts', 'sole-cuban-press', 'webmd-heelcord', 'webmd-side-bend', 'staywell-89925', 'topend-quads-lying', 'baystate-pmc-strap', 'sportsg-inclusive-warmup', 'kmpt-stretches'])
      expect([bad, bad in CUE_FULL.sources]).toEqual([bad, false]);
  });
});

describe('P1 mobilność: zdania', () => {
  test('76 nowych zdań mają tekst PL i EN, a pominięte (z < 2 źródłami szczebla ≤ 4) nie istnieją w słownikach', () => {
    expect(P1.zdania.length).toBe(76);
    for (const c of idyP1Nowe()) expect([c, typeof pl[c], typeof en[c], pl[c].trim().length > 0, en[c].trim().length > 0]).toEqual([c, 'string', 'string', true, true]);
    expect(idyP1Nowe().size).toBe(76);
    /* zdanie pominięte w P1 (02.11.2026) może wejść w późniejszej partii z nowymi źródłami (A3 przyciąganie, 09.11.2026: rotator_cuff.cableSetup — badania W2 dały drugą organizację; reguła ≥ 2 organizacji pilnowana w tests/zrodla-pelne-cues-a3-przyciaganie.test.ts) */
    for (const c of P1.pominiete_zdania.filter(c => !A3.zdania.includes(c))) expect([c, c in pl, c in en]).toEqual([c, false, false]);
    expect(P1.pominiete_zdania.length).toBe(48);
  });

  test('zdania nowe przełożone na 33 języki (02.11.2026 → przekład P1, 03.11.2026): zestaw oczekujących pusty, każdy język ma wszystkie 76 zdań (nakładki es-419/pt-BR na bazie)', () => {
    const z = json('docs/lokalizacja/zestaw-przekladu-2026-11-02-p1-wskazowki.json').klucze as unknown[];
    expect(z).toEqual([]);
    for (const l of ['bg', 'cs', 'da', 'de', 'el', 'es', 'es-419', 'et', 'fi', 'fr', 'hr', 'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'ms', 'nb', 'nl', 'pt', 'pt-BR', 'ro', 'ru', 'sk', 'sl', 'sr', 'sv', 'tr', 'uk', 'vi', 'zh-Hant']) {
      const baza = l === 'es-419' ? 'es' : l === 'pt-BR' ? 'pt' : null; /* nakładka ma tylko teksty różne od bazy */
      const d = { ...(baza ? json(`lib/cues/text/${baza}.json`) : {}), ...json(`lib/cues/text/${l}.json`) } as Record<string, string>;
      for (const c of idyP1Nowe()) expect([l, c, typeof d[c], (d[c] ?? '').trim().length > 0]).toEqual([l, c, 'string', true]);
    }
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
  return new Set<string>(P1.zdania);
}
