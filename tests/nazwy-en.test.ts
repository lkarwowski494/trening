/*
 * ZB-025 b (decyzja właściciela 31.10.2026: „nazwy EN — wariant A, P1–P4 wg szkicu”): warstwa kanonicznych nazw angielskich po `rid` (ścieżka B — bez migracji danych,
 * bez zmiany kluczy katalogu, SCHEMA_VERSION 19 bez zmian). Źródło: docs/research/equipment/nazwy-en.json (267 z 709 nazw), generator scripts/equipment/gen-nazwy-en.mjs →
 * lib/nazwy-en.generated.ts (mapa po kluczu; rid nie trafia do kodu aplikacji — tests/provenance-guard.test.ts). Przewodnik: notatki/katalog-1-1/przewodnik-nazw-en-szkic-2026-10-30.md
 * (gałąź przekazanie-konta). Zakres testów: (a) źródło i generator, (b) macierz: każda zmieniona nazwa × każdy język poza polskim, polski bez zmian,
 * (c) P1–P4 na przykładach, (d) strażnik regex wszystkich 709 nazw EN, (e) stare nazwy EN jako aliasy wyszukiwania, (f) VoiceOver, ćwiczenie własne, slug eksportu.
 */
import { LIB_WYCOFANE } from '@/lib/catalog-wycofane';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';
import { LIB, LIB_DISPLAY_NAME, libExercise, formerMatch, formerExact, formerEnNamesOf } from '@/lib/seed';
import { exName, exNameLang, applyLang, fold, LANGS } from '@/lib/i18n';
import { NAME_EN } from '@/lib/nazwy-en.generated';
import { indexExercises, matchExercise } from '@/lib/csvparse';

const root = join(__dirname, '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
type Wpis = { rid: string; dawna: string; nazwa: string; reguly: string[]; wyswietlana?: string };
const zrodlo = JSON.parse(read('docs/research/equipment/nazwy-en.json')) as { wpisy: Wpis[]; recenzja: { badacz: unknown; lokalizacja: unknown } };
const katalog = JSON.parse(read('docs/research/equipment/catalog.json')) as { name: string; rid: string }[];
const kluczOd = Object.fromEntries(katalog.map(c => [c.rid, c.name]));
const WSZYSTKIE = zrodlo.wpisy.slice(); /* 02.11.2026: ćwiczenie wycofane z biblioteki zostaje w tabeli źródła (rid), ale nie w LIB — dalsze testy dotyczą biblioteki */
zrodlo.wpisy = zrodlo.wpisy.filter(w => !LIB_WYCOFANE.includes(kluczOd[w.rid]));
const wiersz = (klucz: string) => LIB.find(r => r[0] === klucz)!;
const nazwaEn = (klucz: string, lang: Parameters<typeof applyLang>[0] = 'en') => { applyLang(lang); return exName(libExercise(wiersz(klucz))); };
const wpis = (rid: string) => zrodlo.wpisy.find(w => w.rid === rid)!;
afterEach(() => { applyLang('pl'); });

describe('nazwy EN po rid: źródło i generator', () => {
  test('267 zmienionych nazw (442 bez zmian z 709); rid istnieją w katalogu, są unikalne; każda nowa nazwa różni się od dawnej', () => {
    expect(WSZYSTKIE).toHaveLength(267);
    expect(LIB).toHaveLength(708);
    const rids = WSZYSTKIE.map(w => w.rid);
    expect(new Set(rids).size).toBe(267);
    for (const w of zrodlo.wpisy) { expect(kluczOd[w.rid]).toBeDefined(); expect(w.nazwa).not.toBe(w.dawna); expect(w.reguly.length).toBeGreaterThan(0); }
  });
  test('lib/nazwy-en.generated.ts jest aktualny względem źródła (gen-nazwy-en.mjs --check)', () => {
    expect(() => execFileSync('node', ['scripts/equipment/gen-nazwy-en.mjs', '--check'], { cwd: root, stdio: 'pipe' })).not.toThrow();
  });
  test('wygenerowana mapa jest po kluczu katalogu i nie zawiera identyfikatorów wierszy', () => {
    const plik = read('lib/nazwy-en.generated.ts');
    for (const w of zrodlo.wpisy) { expect(plik).not.toContain(w.rid); expect(NAME_EN[kluczOd[w.rid]]).toBe(w.nazwa); }
  });
  test('klucze katalogu bez zmian: żaden klucz z tabeli nie zniknął z biblioteki (ścieżka B, SCHEMA_VERSION 19)', () => {
    for (const w of zrodlo.wpisy) expect(LIB.some(r => r[0] === kluczOd[w.rid])).toBe(true);
    expect(read('lib/seed.ts')).toMatch(/export const SCHEMA_VERSION = 19\b/);
  });
  test('recenzje: pola recenzja.badacz i recenzja.lokalizacja istnieją (wypełnia koordynator po recenzji przed zamrożeniem adresów strony)', () => {
    expect(Object.keys(zrodlo.recenzja).sort()).toEqual(['badacz', 'lokalizacja']);
  });
});

describe('nazwy EN po rid: macierz — nazwa × język', () => {
  test('angielski: każda z 267 pozycji pokazuje nową nazwę', () => {
    const zle = zrodlo.wpisy.filter(w => nazwaEn(kluczOd[w.rid]) !== w.nazwa).map(w => [w.rid, nazwaEn(kluczOd[w.rid]), w.nazwa]);
    expect(zle).toEqual([]);
  });
  test.each(LANGS.filter(l => l !== 'pl' && l !== 'en'))('%s: nazwy biblioteki są angielskie (DEC-13) — te same nowe nazwy', l => {
    const zle = zrodlo.wpisy.filter(w => nazwaEn(kluczOd[w.rid], l) !== w.nazwa).map(w => w.rid);
    expect(zle).toEqual([]);
  });
  test('polski: nazwy bez zmian (klucz katalogu albo nazwa wyświetlana z LIB_DISPLAY_NAME)', () => {
    for (const w of zrodlo.wpisy) { const k = kluczOd[w.rid]; expect([k, nazwaEn(k, 'pl')]).toEqual([k, Object.prototype.hasOwnProperty.call(LIB_DISPLAY_NAME, k) ? LIB_DISPLAY_NAME[k] : k]); }
  });
  test('nazwy spoza tabeli (442) bez zmian względem poprzedniego zachowania: równe kluczowi (albo wcześniejszej nazwie EN z EX_FULL/EX_PAREN)', () => {
    const wTabeli = new Set(zrodlo.wpisy.map(w => kluczOd[w.rid]));
    applyLang('en');
    const zmienione = LIB.map(r => r[0]).filter(k => !wTabeli.has(k) && Object.prototype.hasOwnProperty.call(NAME_EN, k));
    expect(zmienione).toEqual([]);
  });
});

describe('nazwy EN: rozstrzygnięcia P1–P4 (przewodnik, rekomendacje szkicu przyjęte 31.10.2026)', () => {
  test('P1: jednostronność „Single-Arm / Single-Leg” wszędzie (nie One-Arm / One Arm / One-Leg)', () => {
    expect(wpis('204baa77').nazwa).toBe('Single-Arm Dumbbell Row');
    expect(wpis('d8d3e457').nazwa).toBe('Single-Arm Chin-Up');
    expect(wpis('378641ff').nazwa).toBe('Single-Leg Press');
    expect(wpis('e564de06').nazwa).toBe('Seated Single-Leg Dumbbell Calf Raise');
  });
  test('P2: liczba pojedyncza z zamkniętą listą wyjątków', () => {
    expect(wpis('a1b79aac').nazwa).toBe('Dumbbell Lunge'); expect(wpis('3a3a28c0').nazwa).toBe('Burpee'); expect(wpis('cf6131e9').nazwa).toBe('Walking Lunge');
  });
  test('P3: bez „Barbell” w klasycznych bojach, jawnie tam, gdzie sztanga odróżnia wariant', () => {
    expect(wpis('96e58da0').nazwa).toBe('Bench Press'); expect(wpis('8d99cc4f').nazwa).toBe('Deadlift'); expect(wpis('611efa54').nazwa).toBe('Overhead Press');
    expect(wpis('8bdff5bd').nazwa).toBe('Barbell Shrug'); expect(wpis('83ddab84').nazwa).toBe('Barbell Lunge');
  });
  test('P4: ćwiczenia z dwoma przyrządami do wyboru — „Dumbbell or Cable …” (rozdzielenie na dwa ćwiczenia → backlog 1.2)', () => {
    expect(wpis('2368ad5c').nazwa).toBe('Dumbbell or Cable Romanian Deadlift');
    expect(wpis('6f635cdd').nazwa).toBe('Single-Arm Dumbbell or Cable Romanian Deadlift');
  });
});

/** Strażnik regex kanonicznych nazw EN (przewodnik, sekcja 1, „Strażnik”): dotyczy WSZYSTKICH 709 nazw widocznych po angielsku, nie tylko zmienionych. */
const FUNKCYJNE = new Set(['a', 'an', 'the', 'and', 'or', 'to', 'on', 'in', 'at', 'of', 'for', 'by', 'with', 'from', 'off', 'into', 'onto', 'per', 'vs']);
const LACZNIK_MALE = new Set(['a', 'an', 'the', 'to', 'of', 'and']);
/** Zamknięta lista wyjątków liczby mnogiej (L2, P2 = a): ćwiczenia ciągłe z wzorca mobilność/kondycja, których nazwa żyje w liczbie mnogiej (Circles, Swings, Jumping Jacks, …)
 *  — nazwa własna ruchu, nie „jedno powtórzenie”. Nowy wyjątek tylko z decyzją (przewodnik, sekcja 5, P2). */
const MNOGA_WYJATKI: ReadonlySet<string> = new Set([
  'Mountain Climbers', 'Jumping Jacks', 'High Knees', 'Ankle Circles', 'Arm Circles', 'Knee Circles', 'Shoulder Circles', 'Wrist Circles', 'Prone Hip Circles', 'Standing Hip Circles',
  'Front-to-Back Leg Swings', 'Side-to-Side Leg Swings', 'Lying Leg Crossover Swings', /* nazwy własne konkurencji i sprzętu w liczbie mnogiej: */ 'Battle Ropes', 'Atlas Stones', 'Power Stairs',
]);
function naruszenia(n: string): string[] {
  const out: string[] = [];
  if (/[()]/.test(n)) out.push('nawias');
  if (/ - /.test(n)) out.push('separator " - "');
  if (n.includes('/')) out.push('ukośnik');
  if (/Flye/.test(n)) out.push('Flye');
  if (/Skullcrusher/.test(n)) out.push('Skullcrusher');
  if (/\bPush Up\b/.test(n)) out.push('Push Up bez łącznika');
  if (/\bOne[- ]Arm\b|\bOne[- ]Leg\b/.test(n)) out.push('One-Arm/One-Leg (P1)');
  if (/SMR/.test(n)) out.push('SMR');
  if (/Leverage/.test(n)) out.push('Leverage');
  if (/Pulley/.test(n)) out.push('Pulley');
  if (/^(The|A|An) /.test(n)) out.push('przedimek na początku');
  if (/[ąćęłńóśźż]/i.test(n)) out.push('polskie znaki');
  const slowa = n.split(' ');
  slowa.forEach((s, i) => {
    const tnij = s.replace(/[^A-Za-z'’-]/g, '');
    if (!tnij) return;
    if (i > 0 && FUNKCYJNE.has(tnij.toLowerCase()) && tnij !== tnij.toLowerCase()) out.push(`W1: "${tnij}" małą literą`);
    if (i === 0 && tnij[0] !== tnij[0].toUpperCase()) out.push(`W1: początek małą literą "${tnij}"`);
    if (i > 0 && !FUNKCYJNE.has(tnij.toLowerCase()) && tnij[0] !== tnij[0].toUpperCase() && !tnij.includes('-')) out.push(`W1: "${tnij}" małą literą`);
    tnij.split('-').slice(1).forEach(c => { if (LACZNIK_MALE.has(c.toLowerCase()) && c !== c.toLowerCase()) out.push(`W1: "${c}" w złożeniu z łącznikiem`); });
  });
  /* L2: liczba pojedyncza; słowo po „with/on/to/off…” zostaje w naturalnej liczbie („… with Alternating Oblique Twists”) */
  const ostatnie = slowa[slowa.length - 1];
  if (!slowa.slice(1, -1).some(x => ['with', 'on', 'to', 'off', 'from', 'in', 'at', 'for', 'by', 'of'].includes(x)) && /[^s]s$/.test(ostatnie) && !/(us|is)$/.test(ostatnie) && !MNOGA_WYJATKI.has(n)) out.push('liczba mnoga (L2)');
  return out;
}

describe('nazwy EN: strażnik regex wszystkich 709 nazw (P1–P4, przewodnik sekcja 1)', () => {
  const wszystkie = () => { applyLang('en'); return LIB.map(r => [r[0], exName(libExercise(r))] as const); };
  test('brak nawiasów, separatora „ - ”, ukośnika, Flye/Skullcrusher/Push Up/One-Arm/SMR/Leverage/Pulley, przedimka na początku; W1 i liczba wg reguł', () => {
    const zle = wszystkie().map(([k, n]) => [k, n, naruszenia(n)] as const).filter(([, , v]) => v.length);
    expect(zle).toEqual([]);
  });
  test('brak duplikatów nazw po złożeniu (fold) w całej bibliotece', () => {
    const widziane = new Map<string, string>(); const dup: string[] = [];
    for (const [k, n] of wszystkie()) { const f = fold(n); if (widziane.has(f)) dup.push(`${widziane.get(f)} / ${k}`); else widziane.set(f, k); }
    expect(dup).toEqual([]);
  });
  test('strażnik wyłapuje naruszenia (macierz reguł na przykładach negatywnych)', () => {
    const przyklady: [string, string][] = [['Bench Press (Barbell)', 'nawias'], ['Crunch - Hands Overhead', 'separator " - "'], ['Gorilla Chin/Crunch', 'ukośnik'], ['Reverse Flyes', 'Flye'],
      ['Skullcrusher', 'Skullcrusher'], ['Diamond Push Up', 'Push Up bez łącznika'], ['One Arm Row', 'One-Arm/One-Leg (P1)'], ['Adductor-SMR', 'SMR'], ['Leverage Shrug', 'Leverage'],
      ['High Pulley Row', 'Pulley'], ['The Straddle', 'przedimek na początku'], ['Chin To Chest Stretch', 'W1: "To" małą literą'], ['Walking Lunges', 'liczba mnoga (L2)'], ['Wiosłowanie', 'polskie znaki']];
    for (const [n, ma] of przyklady) expect([n, naruszenia(n).join('|')]).toEqual([n, expect.stringContaining(ma)]);
    expect(naruszenia('Toes-to-Bar')).toEqual([]); expect(naruszenia('Chin to Chest Stretch')).toEqual([]); expect(naruszenia('Single-Arm Dumbbell Row')).toEqual([]);
  });
});

describe('nazwy EN: stare nazwy jako aliasy wyszukiwania', () => {
  test('po angielsku: dawna nazwa EN znajduje obecne ćwiczenie (formerMatch/formerExact), a lista „dawnych nazw” ją zawiera', () => {
    applyLang('en');
    for (const w of zrodlo.wpisy) {
      const e = libExercise(wiersz(kluczOd[w.rid]));
      expect([w.rid, formerEnNamesOf(e)]).toEqual([w.rid, [w.dawna]]);
      expect([w.rid, formerExact(e, fold(w.dawna))]).toEqual([w.rid, true]);
      expect([w.rid, !!formerMatch(e, fold(w.dawna))]).toEqual([w.rid, true]);
    }
  });
  test('przykłady z przewodnika: „RDL (Barbell)”, „Bench Press (Barbell)”, „Push Up”, „Adductor-SMR”', () => {
    applyLang('en');
    for (const [rid, q] of [['e89a5985', 'rdl (barbell)'], ['96e58da0', 'bench press (barbell)'], ['de556ca6', 'push up'], ['3c85132c', 'adductor-smr']] as const) {
      const e = libExercise(wiersz(kluczOd[rid]));
      expect([rid, !!formerMatch(e, fold(q))]).toEqual([rid, true]);
    }
  });
  test('po polsku aliasy EN nie działają (nazwa polska = klucz bez zmian, brak dawnych nazw EN w wyszukiwarce i na ekranie)', () => {
    applyLang('pl');
    const e = libExercise(wiersz(kluczOd['96e58da0']));
    expect(formerEnNamesOf(e)).toEqual([]); expect(formerMatch(e, fold('bench press (barbell)'))).toBeUndefined();
  });
  test('ćwiczenie nie jest własną dawną nazwą: wpis bez zmiany nazwy (442) nie ma aliasu', () => {
    applyLang('en');
    expect(formerEnNamesOf(libExercise(wiersz('Back Squat')))).toEqual([]);
  });
});

describe('nazwy EN: VoiceOver, ćwiczenia własne, slug eksportu strony', () => {
  test('exNameLang bez zmian: biblioteka poza polskim czytana głosem angielskim (nowa nazwa jest angielska), własne — język interfejsu', () => {
    const e = libExercise(wiersz(kluczOd['96e58da0']));
    for (const [l, want] of [['pl', 'pl'], ['en', 'en'], ['de', 'en'], ['ja', 'en']] as const) { applyLang(l); expect([l, exNameLang(e)]).toEqual([l, want]); }
    applyLang('de'); expect(exNameLang({ lib: false })).toBe('de');
  });
  test('ćwiczenie własne o nazwie równej kluczowi (lib = false) pokazuje się tak, jak je nazwano', () => {
    applyLang('en');
    expect(exName({ name: 'Push Up', lib: false })).toBe('Push Up'); expect(exName({ name: 'Push Up', lib: true })).toBe('Push-Up');
  });
  test('nazwa wyświetlana z LIB_DISPLAY_NAME (znak towarowy) też dostaje nową nazwę EN: exName po nazwie wyświetlanej i po kluczu (libKey)', () => {
    applyLang('en');
    const k = 'Bosu Ball Cable Crunch With Side Bends';
    expect(exName({ name: LIB_DISPLAY_NAME[k], lib: true })).toBe('Balance Dome Cable Crunch with Side Bend');
    expect(exName(libExercise(wiersz(k)))).toBe('Balance Dome Cable Crunch with Side Bend');
  });
  test('slug eksportu strony powstaje z nowej nazwy (scripts/strona/eksport.mjs makeSlugs): „Push-Up” → push-up, „Bench Press” → bench-press', () => {
    const nazwy = [['a', nazwaEn('Push Up')], ['b', nazwaEn(kluczOd['96e58da0'])], ['c', nazwaEn(kluczOd['2368ad5c'])]];
    const s = JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import { makeSlugs } from './scripts/strona/eksport.mjs'; console.log(JSON.stringify(makeSlugs(${JSON.stringify(nazwy)})));`], { cwd: root, encoding: 'utf8' }));
    expect(s).toEqual({ a: 'push-up', b: 'bench-press', c: 'dumbbell-or-cable-romanian-deadlift' });
  });
});

describe('nazwy EN: scenariusze Maestro szukają po nowych nazwach', () => {
  const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pliki = [...readdirSync(join(root, '.maestro')).filter(f => f.endsWith('.yaml')).map(f => `.maestro/${f}`), ...readdirSync(join(root, '.maestro/subflows')).map(f => `.maestro/subflows/${f}`)];
  /* dawna nazwa EN w trzech zapisach: zwykłym, z nawiasami jako regex (\\( w komentarzu, \\\\( w YAML w cudzysłowie) — poza rodziną nazw rozpoczynających się/kończących znakiem słowa albo „-” */
  const warianty = (d: string) => [d, d.replace(/[()]/g, c => `\\${c}`), d.replace(/[()]/g, c => `\\\\${c}`)];
  test('żaden plik ani podprzepływ Maestro nie zawiera dawnej nazwy EN ćwiczenia zmienionego w tabeli (ekran pokazuje już nową)', () => {
    const trafienia: string[] = [];
    for (const f of pliki) {
      const t = read(f);
      for (const w of zrodlo.wpisy) for (const v of warianty(w.dawna)) if (new RegExp(`(?<![\\w-])${esc(v)}(?![\\w-])`).test(t)) trafienia.push(`${f}: ${w.dawna}`);
    }
    expect(trafienia).toEqual([]);
  });
  test('scenariusze z nazwami ćwiczeń używają nowych nazw (przykłady: Dumbbell Bench Press, Pull-Up, Dumbbell Bent-Over Row)', () => {
    expect(read('.maestro/subflows/szablon-testowy.yaml')).toContain('Dumbbell Bench Press, dumbbells');
    expect(read('.maestro/10-gumy.yaml')).toContain('Set 1 done — Pull-Up');
    expect(read('.maestro/25-trening-narzedzia.yaml')).toContain('assertNotVisible: "Dumbbell Bent-Over Row.*"');
    expect(read('.maestro/07-zamiana.yaml')).toContain('(?<!Dumbbell )Overhead Press');
  });
});

describe('nazwy EN: import CSV po dawnej nazwie (eksport z poprzedniej wersji w angielskim)', () => {
  /* backup.ts zapisuje w CSV nazwę wyświetlaną (exName); plik z wersji 1.0 ma więc dawne nazwy EN — import nie może przez to tworzyć duplikatów ćwiczeń */
  const ix = () => indexExercises(LIB.map(r => libExercise(r)));
  test.each(['en', 'pl', 'de'] as const)('%s: każda dawna nazwa EN z tabeli dopasowuje się do tego samego ćwiczenia z biblioteki', l => {
    applyLang(l); const index = ix();
    const zle = zrodlo.wpisy.filter(w => matchExercise(w.dawna, index)?.libKey !== kluczOd[w.rid]).map(w => `${w.dawna} → ${matchExercise(w.dawna, index)?.libKey}`);
    expect(zle).toEqual([]);
  });
  test('nowa nazwa EN też się dopasowuje (eksport z tej wersji)', () => {
    applyLang('en'); const index = ix();
    const zle = zrodlo.wpisy.filter(w => matchExercise(w.nazwa, index)?.libKey !== kluczOd[w.rid]).map(w => w.nazwa);
    expect(zle).toEqual([]);
  });
});
