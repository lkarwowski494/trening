/*
 * „Całkiem anonimowo” (decyzja właściciela 25.10.2026, docs/18; wcześniej: język naturalny 23.10.2026): publicznie nigdzie nie piszemy o źródłach, nawet ogólnie — wiedza „wynika
 * z tego, co przyswoiliśmy”. ŻADEN tekst interfejsu (35 języków), wskazówek techniki, sklepu, uprawnień iOS ani strony www (site/) nie zawiera nazw źródeł ani organizacji
 * (WHO, ACSM, NSCA, CDC, MIMIT…, nazwisk autorów) ani odwołań ogólnych typu „na podstawie badań”, „według zaleceń”, „w badaniach”. Ekran „Źródła wiedzy” usunięty.
 * Rodzaje (docs/20): logika (wzorce), języki (wszystkie słowniki, wskazówki, sklep), niezmienniki (zero nazw i odwołań poza wyjątkiem przekładu), dane (rejestr wewnętrzny zostaje).
 * Wzorce są w jednym miejscu: lib/sources.ts. Stare tłumaczenia kluczy z zestawu do przekładu (docs/lokalizacja/zestaw-przekladu-2026-10-23.json, rodzaj „zmieniony”)
 * są wyjątkiem do czasu przekładu na 33 języki — wyjątek znika razem z wpisem w zestawie.
 */
import * as fs from 'fs';
import * as path from 'path';
import { EN } from '@/lib/i18n.en';
import { LANGS } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { cueDict } from '@/lib/cues';
import { allLabels } from '@/lib/equipment';
import { SOURCE_NAME_PATTERNS, GENERIC_REFERENCE_PATTERNS } from '@/lib/sources';
import { PENDING, PENDING_CHANGED } from './pending-translation';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
/** Nazwa źródła: wzorzec z listy, poprzedzony czymkolwiek poza literą (wielkość liter ma znaczenie: „WHO”, nie „who”). */
export const NAME = new RegExp(`(?<![\\p{L}])(?:${SOURCE_NAME_PATTERNS.join('|')})`, 'u');
/** Odwołanie ogólne do podstaw wiedzy (bez wielkości liter). */
export const GENERIC = new RegExp(`(?<![\\p{L}])(?:${GENERIC_REFERENCE_PATTERNS.join('|')})`, 'iu');
export const BAD = (s: string) => NAME.test(s) || GENERIC.test(s);
/** Wszystkie łańcuchy JSON; pola zaczynające się od „_” to dokumentacja wewnętrzna (np. „_opis” plików sklepu — nie są wysyłane), więc pomijane. */
const strings = (o: unknown, out: string[] = []): string[] => { if (typeof o === 'string') out.push(o); else if (Array.isArray(o)) o.forEach(x => strings(x, out)); else if (o && typeof o === 'object') Object.entries(o).forEach(([k, x]) => { if (!k.startsWith('_')) strings(x, out); }); return out; };

describe('wzorce nazw źródeł i odwołań ogólnych (jedna lista: lib/sources.ts)', () => {
  test('rozpoznaje cytaty, skróty i odwołania ogólne w PL i EN, nie łapie zwykłych słów', () => {
    for (const s of ['Zourdos i in., JSCR 2016', 'ACSM 2026', 'wytyczne USA 2018', 'WHO 2020', 'Pelland et al. 2026', 'wzór Epleya', 'Epley formula', 'NSCA 2017', 'Helms i in. 2016', 'Bell i in. 2023', 'Kowalski i in. 2020', 'CDC', 'MIMIT', 'Teleborsa',
      'Opiera się na zaleceniach zdrowotnych i treningowych.', 'Na podstawie badań.', 'według zaleceń organizacji', 'W badaniach nie wykazano.', 'Based on research.', 'It follows health and training guidelines.', 'Studies show that', 'a review of the guidelines',
      'Nie ma dość dowodów, że więcej dni daje więcej.', 'To nie dowód, że działa.', 'Tak robią trenerzy i zawodnicy.', 'Zdaniem ekspertów', 'Naukowcy zalecają', 'Wyniki badań', 'Badania są niejednoznaczne',
      'There is not enough evidence.', 'Studies agree', 'Research suggests', 'What experts recommend', 'Coaches and athletes do this'])
      expect([s, BAD(s)]).toEqual([s, true]);
    for (const s of ['people who used earlier versions', 'Dumbbell row', 'Zrób 3 serie', 'RPE 8 = 2 RIR', 'Bellows', 'Apple Health', 'e1RM (na hantel)', 'Propozycja według Twoich założeń — przejrzysz ją przed zapisem.', 'Dobre samopoczucie po treningu', 'Dowolny dzień tygodnia', 'Wpisz dowolną liczbę', 'Badanie krwi nie jest częścią aplikacji'.replace('Badanie krwi', 'Wynik krwi'), 'Researchers'.replace('Researchers', 'Searchers'), 'Trener personalny']) expect([s, BAD(s)]).toEqual([s, false]);
  });
  test('każde źródło z rejestru twierdzeń (pole zrodla, poza etykietą prywatności sklepu) jest rozpoznawane przez wzorzec nazw', () => {
    const reg = JSON.parse(read('docs/research/rejestr-twierdzen.json')).twierdzenia as { id: string; zrodla: string[] }[];
    const missing: string[] = [];
    for (const e of reg) for (const z of e.zrodla) { if (/^App Store/.test(z)) continue; if (!NAME.test(z)) missing.push(`${e.id}: ${z}`); }
    expect(missing).toEqual([]);
  });
});

describe('niezmiennik: żaden tekst interfejsu ani strony nie ma nazwy źródła ani odwołania do podstaw wiedzy', () => {
  test('słownik PL (klucze) i EN (wartości) — bez wyjątków', () => {
    const bad = Object.entries(EN).filter(([k, v]) => BAD(k) || BAD(v)).map(([k]) => k.slice(0, 80));
    expect(bad).toEqual([]);
  });
  test('słowniki 33 języków (poza PL i EN): bez nazw i odwołań; wyjątek tylko stare tłumaczenia kluczy z zestawu do przekładu', () => {
    const bad: string[] = [];
    for (const l of LANGS) { if (l === 'pl' || l === 'en') continue; for (const [k, v] of Object.entries(LOCALES[l] ?? {})) if (NAME.test(v) && !PENDING_CHANGED.has(k)) bad.push(`${l}: ${k.slice(0, 60)}`); }
    expect(bad).toEqual([]);
  });
  test('wyjątek jest wąski: każdy klucz „zmieniony” z zestawu ma w PL i EN brzmienie bez nazw i odwołań (tylko stare tłumaczenia czekają)', () => {
    for (const p of PENDING) { expect([p.pl.slice(0, 50), BAD(p.pl), BAD(p.en)]).toEqual([p.pl.slice(0, 50), false, false]); }
  });
  test('wskazówki techniki (wszystkie języki), etykiety sprzętu, metadane sklepu, uprawnienia iOS i strony www', () => {
    const bad: string[] = [];
    for (const l of LANGS) for (const [id, v] of Object.entries(cueDict(l))) if (NAME.test(v)) bad.push(`wskazówka ${l}: ${id}`);
    for (const l of ['pl', 'en'] as const) for (const [id, v] of Object.entries(cueDict(l))) if (BAD(v)) bad.push(`wskazówka ${l}: ${id}`);
    for (const x of allLabels()) if (BAD(x.pl) || BAD(x.en)) bad.push(`sprzęt: ${x.pl}`);
    for (const f of ['store/app-store-metadata.json', 'store/app-store-names.json', 'store/iap-localizations.json']) for (const s of strings(JSON.parse(read(f)))) if (NAME.test(s) || GENERIC.test(s)) bad.push(`${f}: ${s.slice(0, 60)}`);
    for (const s of strings(JSON.parse(read('store/screenshot-captions.json')).podpisy)) if (BAD(s)) bad.push(`store/screenshot-captions.json: ${s.slice(0, 60)}`); /* bez pola _opis (dokumentacja wewnętrzna) */
    for (const f of fs.readdirSync(path.join(root, 'locales'))) for (const s of strings(JSON.parse(read(`locales/${f}`)))) if (NAME.test(s)) bad.push(`locales/${f}: ${s.slice(0, 60)}`);
    for (const f of fs.readdirSync(path.join(root, 'site')).filter(f => f.endsWith('.html'))) { const txt = read(`site/${f}`).replace(/<!--[\s\S]*?-->|<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<[^>]+>/g, ' '); if (BAD(txt)) bad.push(`site/${f}: ${(txt.match(NAME) ?? txt.match(GENERIC) ?? [''])[0]}`); }
    expect(bad).toEqual([]);
  });
  test('stopka wskazówek techniki nie wymienia podstawy (tylko zdanie medyczne); klucze stopki usunięte ze słowników', () => {
    expect(read('components/ExerciseCues.tsx')).not.toMatch(/Na podstawie|Własne sformułowania|BASIS/);
    expect(EN['Na podstawie: {list}. Własne sformułowania.']).toBeUndefined();
    for (const l of LANGS) if (l !== 'pl' && l !== 'en') expect([l, (LOCALES[l] ?? {})['Na podstawie: {list}. Własne sformułowania.']]).toEqual([l, undefined]);
  });
  test('ekran „Źródła wiedzy” usunięty (25.10.2026): brak pliku, wpisu w Ustawieniach i nawigacji, kluczy w słowniku EN', () => {
    expect(fs.existsSync(path.join(root, 'app/more/sources.tsx'))).toBe(false);
    expect(read('app/more/settings.tsx')).not.toMatch(/more\/sources|Źródła wiedzy/);
    expect(read('app/_layout.tsx')).not.toMatch(/more\/sources|Źródła wiedzy/);
    expect(fs.existsSync(path.join(root, '.maestro/55-zrodla-wiedzy.yaml'))).toBe(false);
    for (const k of ['Źródła wiedzy', 'Na czym opierają się liczby i zalecenia', 'Nasze uproszczenia i wybory', 'Partie mięśniowe w ćwiczeniach', 'Technika ćwiczeń']) expect([k, EN[k]]).toEqual([k, undefined]);
  });
});

/*
 * Oznaczenia pewności w tekstach UI (decyzja właściciela 23.10.2026, docs/18): „wstępne/potwierdzone”, „jedno źródło”, „uproszczenie”, „nasz wybór”, „konwencja”
 * nie występują w żadnym tekście interfejsu — zostają w rejestrze twierdzeń (pole rodzaje). Wzorce i lista tekstów ekranu: scripts/claims.mjs
 * (MARKER_RE_PL, MARKER_RE_EN, EKRAN_ZRODEL (pusta)); ta sama kontrola biegnie w `npm run check:claims`.
 */
import { execFileSync } from 'child_process';
const CLAIMS = path.join(root, 'scripts/claims.mjs');
const viaClaims = (code: string, ...args: string[]): unknown => JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import * as c from ${JSON.stringify('file://' + CLAIMS)}; ${code}`, ...args], { encoding: 'utf8' }));

describe('niezmiennik: brak oznaczeń pewności w tekstach UI', () => {
  test('strażnik rozpoznaje oznaczenia w PL i EN (każde z pięciu) i przepuszcza zwykłe zdania oraz teksty ekranu źródeł', () => {
    const dict = {
      'Serie: {s} to uproszczenie.': 'Sets: {s}.',
      'Krok to nasz wybór.': 'The step is our choice.',
      'Reguła to konwencja.': 'A rule.',
      'Opiera się na jednym źródle.': 'Rests on one source.',
      'Przypisanie partii: wstępne.': 'Assignment: preliminary.',
      'Przypisanie partii: potwierdzone.': 'Assignment: confirmed.',
      'Zwykłe zdanie bez oznaczeń, o seriach i przerwach.': 'A plain sentence about sets and rest.',
    };
    const errs = viaClaims('process.stdout.write(JSON.stringify(c.markerErrors(JSON.parse(process.argv[1]))))', JSON.stringify(dict)) as string[];
    expect(errs.map(e => e.split('… — ')[0]).sort()).toEqual(['Krok to nasz wybór.', 'Opiera się na jednym źródle.', 'Przypisanie partii: potwierdzone.', 'Przypisanie partii: wstępne.', 'Reguła to konwencja.', 'Serie: {s} to uproszczenie.'].sort());
    const en = viaClaims('process.stdout.write(JSON.stringify(c.markerErrors(JSON.parse(process.argv[1]))))', JSON.stringify({ 'Zdanie A bez oznaczeń, dość długie.': 'This is a simplification.', 'Zdanie B bez oznaczeń, dość długie.': 'The assignment is confirmed.', 'Zdanie C bez oznaczeń, dość długie.': 'One source only; our choice.' })) as string[];
    expect(en).toHaveLength(3);
  });
  test('słownik PL (klucze) i EN (wartości): zero tekstów z oznaczeniem pewności ', () => {
    expect(viaClaims('process.stdout.write(JSON.stringify(c.markerErrors(c.loadDictionary())))')).toEqual([]);
  });
  test('wskazówka progresji i opisy w Ustawieniach, generatorze, Postępach i ćwiczeniu nie mają oznaczeń (klucze usuniętych oznaczeń nie wracają)', () => {
    for (const k of ['Przypisanie partii: wstępne.', 'Przypisanie partii: potwierdzone.', 'Przypisanie partii: uproszczenie.', 'Krok zmiany (np. +2,5 kg) to nasz wybór, a nie wynik badań.']) expect([k, EN[k]]).toEqual([k, undefined]);
    expect(Object.keys(EN).filter(k => /^Przypisanie partii mięśniowych — /.test(k))).toEqual([]);
    expect(read('app/exercise/[id].tsx')).not.toMatch(/Przypisanie partii/);
  });
  test('T-029 (decyzja 25.10.2026, „całkiem anonimowo”): zdanie o ćwiczeniach wzmacniających bez odwołania do badań', () => {
    const k = Object.keys(EN).find(x => x.startsWith('Cardio: przy {k}–{m} dniach'))!;
    expect(k).toContain('Więcej ćwiczeń wzmacniających nie musi dawać więcej korzyści dla zdrowia');
    expect(k).not.toMatch(/Nie ma dowodów|WHO|badani/);
    expect(EN[k]).toContain('More muscle-strengthening activity does not necessarily bring more health benefits');
    expect(EN[k]).not.toMatch(/[Ss]tudies/);
  });
  test('druga decyzja 25.10.2026: tekst o częstotliwości na partię i podpowiedź deloadu bez słów „dowody”, „trenerzy i zawodnicy”; klucze w zestawie przekładu (zmieniony) i w słownikach 33 języków', () => {
    const freq = Object.keys(EN).find(x => x.startsWith('Każda główna partia co najmniej {n} dni'))!;
    const del = Object.keys(EN).find(x => x.startsWith('Tygodnie treningu z rzędu bez deloadu'))!;
    expect(freq).toContain('ale więcej dni nie musi dawać proporcjonalnie więcej;'); expect(EN[freq]).toContain('but more days do not have to give proportionally more;');
    expect(del).toContain('Deload zwykle co {a}–{b} tygodni — to częsta praktyka, nie sztywna reguła.'); expect(EN[del]).toContain('that is common practice, not a fixed rule.');
    for (const x of [freq, del, EN[freq], EN[del]]) expect([x.slice(0, 40), BAD(x)]).toEqual([x.slice(0, 40), false]);
    for (const k of [freq, del]) {
      const czeka = PENDING.find(p => p.pl === k); expect([k.slice(0, 30), !czeka || (czeka.rodzaj === 'zmieniony' && !!czeka.poprzedni_pl)]).toEqual([k.slice(0, 30), true]); /* po przekładzie (26.10.2026) wpisu w zestawie już nie ma */
      for (const l of LANGS) if (l !== 'pl' && l !== 'en' && l !== 'es-419' && l !== 'pt-BR') expect([l, typeof (LOCALES[l] ?? {})[k]]).toEqual([l, 'string']); /* stare tłumaczenie pod nowym kluczem do czasu przekładu */
    }
  });
  test('nagłówek ⓘ w generatorze i Planie z moich szablonów: „Zasady planu” (nie „Na czym to oparte”)', () => {
    expect(EN['Zasady planu']).toBe('Plan rules'); expect(EN['Na czym to oparte']).toBeUndefined();
    for (const f of ['app/generator.tsx', 'components/OwnPlan.tsx']) { expect(read(f)).toMatch(/t\('Zasady planu'\)/); expect(read(f)).not.toMatch(/Na czym to oparte/); }
    expect(EN['Przejrzyj podgląd i „Zasady planu” — wynik zapisuje się dopiero po zatwierdzeniu.']).toBeDefined();
  });
  test('rejestr twierdzeń zachowuje rodzaje (uproszczenie, konwencja…) i źródła mimo usunięcia z UI; wpisy wycofane z UI mają znacznik i powód', () => {
    const reg = JSON.parse(read('docs/research/rejestr-twierdzen.json')).twierdzenia as { id: string; rodzaje: string[]; wycofane?: string }[];
    expect(reg.filter(e => e.rodzaje.includes('uproszczenie')).length).toBeGreaterThan(10); expect(reg.filter(e => e.rodzaje.includes('konwencja')).length).toBeGreaterThan(3);
    const out = reg.filter(e => e.wycofane); expect(out.map(e => e.id).sort()).toEqual(['T-014', 'T-019', 'T-035', 'T-036', 'T-037', 'T-038', 'T-039', 'T-046'].sort());
    for (const e of out) expect([e.id, e.wycofane!.length > 20]).toEqual([e.id, true]);
  });
});
