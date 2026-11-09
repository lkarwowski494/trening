/*
 * Partia A1 integracji badań (rodziny pchania; linia 1.1, 08.11.2026): karty własne 14 ćwiczeń z badań W1 i W2 (02.11.2026, po przeliczeniu szczebli),
 * nowe zdania PL/EN, rola mięśni „skośne w deskach bocznych”. Lista, karty niepełne i odrzucone błędy: tests/fixtures/cues-a1-pchanie.json.
 * Rodzaje (docs/20): dane (karty, źródła), logika (≥ 2 organizacje szczebla ≤ 4 na każde zdanie, bez luk), niezmienniki (błąd wnioskowany bez własnego
 * źródła nie wchodzi), języki (PL i EN; pozostałe języki czekają na przekład — zestaw docs/lokalizacja/zestaw-przekladu-2026-11-08-a1-wskazowki.json),
 * regresja (karty ukryte do recenzji niezależnej L-047 — wyświetlanie sprawdza strażnik recenzji, nie ten plik).
 * Ocena realności: błąd „karta techniki z jednego źródła albo wnioskowana” — realny (treść w aplikacji); roli — realny (opis mięśnia przy ćwiczeniu).
 */
import * as fs from 'fs';
import * as path from 'path';
import { CUE_DATA, CUE_SECTIONS } from '@/lib/cues';
import { CUE_FULL } from './zrodla-pelne';
import A1 from './fixtures/cues-a1-pchanie.json';

const root = path.join(__dirname, '..');
const json = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const pl: Record<string, string> = json('lib/cues/text/pl.json'), en: Record<string, string> = json('lib/cues/text/en.json');
const orgOf = (sid: string) => CUE_FULL.sources[sid].org;
const lv = (sid: string): number => CUE_FULL.sources[sid].level ?? CUE_FULL.orgs[orgOf(sid)].level;
const sentencesOf = (k: string) => CUE_SECTIONS.flatMap(s => CUE_FULL.exercises[k][s] ?? []);

/** Ćwiczenia z badań W1/W2 niewdrożone w tej partii — z powodem. */
const POMINIETE: Record<string, string> = {
  'Cable Fly (low to high)': 'źródło ustawienia i ruchu (blog producenta sprzętu) ma szczebel 5 po korekcie 2 z 02.11.2026 — zostaje jedno źródło szczebla 4',
  'Svend Press': 'karta opiera się warunkowo na wpisie autora bez nazwiska i kwalifikacji (szczebel 5) — bez kompletu źródeł',
  'Plyo Push-Up': 'jedyne źródło ruchu to program federacji bez daty (szczebel warunkowy) — bez kompletu źródeł',
};

describe('A1 pchanie: karty własne', () => {
  test('14 ćwiczeń ma komplet ustawienie + ruch w pełnych danych i w runtime (widoczne albo ukryte do recenzji); nie są w otwartych; niepełne są na liście partial', () => {
    expect(A1.cwiczenia.length).toBe(14);
    for (const k of A1.cwiczenia) {
      const x = CUE_FULL.exercises[k];
      expect([k, (x.setup ?? []).length >= 1, (x.move ?? []).length >= 1, k in CUE_FULL.open]).toEqual([k, true, true, false]);
      expect(CUE_DATA.exercises[k] ?? CUE_DATA.hidden.includes(k)).toBeTruthy();
      expect([k, (CUE_FULL.partial ?? []).includes(k)]).toEqual([k, (x.tips ?? []).length < 2]);
      for (const s of CUE_SECTIONS) expect([k, s, (CUE_FULL.exercises[k][s] ?? []).length <= 4]).toEqual([k, s, true]);
    }
    expect([...A1.partial].sort()).toEqual(A1.cwiczenia.filter(k => (CUE_FULL.exercises[k].tips ?? []).length < 2).sort());
  });

  test('pominięte ćwiczenia nie mają kart ani wskazówek, a powód jest zapisany', () => {
    for (const k of Object.keys(POMINIETE)) expect([k, k in CUE_FULL.exercises, A1.cwiczenia.includes(k), POMINIETE[k].length > 20]).toEqual([k, false, false, true]);
  });
});

describe('A1 pchanie: karty bez błędu', () => {
  test('ćwiczenie z pozami v2 dostaje kartę tylko z co najmniej jednym błędem (decyzja 02.11.2026); 4 karty bez błędu nie weszły', () => {
    expect(A1.pominieteBezBledu.length).toBe(4);
    for (const k of A1.pominieteBezBledu) expect([k, k in CUE_FULL.exercises]).toEqual([k, false]);
    const poseKeys = new Set(fs.readdirSync(path.join(root, 'lib/figures/v2/poses')).flatMap(f => Object.keys(json(`lib/figures/v2/poses/${f}`).cwiczenia)));
    for (const k of A1.cwiczenia) expect([k, !poseKeys.has(k) || (CUE_FULL.exercises[k].mistakes ?? []).length > 0]).toEqual([k, true]);
  });
});

describe('A1 pchanie: źródła i reguły szczebli', () => {
  test('każde zdanie karty ma ≥ 2 organizacje szczebla ≤ 4 (bez luk „praktyka”)', () => {
    for (const k of A1.cwiczenia) for (const r of sentencesOf(k)) {
      const orgs4 = new Set(r.s.filter(([sid]) => sid !== 'wniosek' && lv(sid) <= 4).map(([sid]) => orgOf(sid)));
      expect([k, r.c, orgs4.size >= 2, CUE_FULL.luki?.[`${k}::${r.c}`]]).toEqual([k, r.c, true, undefined]);
    }
  });

  test('błędy wnioskowane (zaprzeczenie standardu bez własnego źródła) i błędy z jednym źródłem nie weszły: 10 pozycji odrzuconych jawnie', () => {
    expect(A1.odrzuconeBledy.length).toBe(10);
    for (const [k, c] of A1.odrzuconeBledy) expect([k, c, (CUE_FULL.exercises[k]?.mistakes ?? []).some(r => r.c === c)]).toEqual([k, c, false]);
    /* błąd może mieć dodatkowo pozycję „wniosek” (zaprzeczenie standardu), ale liczą się tylko prawdziwe źródła: ≥ 2 organizacje — test wyżej */
  });

  test('uproszczenie „wariant sprzętu” przy Seated Cable Chest Press jest jawne na każdej pozycji karty', () => {
    const s = sentencesOf('Seated Cable Chest Press');
    expect(s.length).toBeGreaterThanOrEqual(5);
    for (const r of s) expect([r.c, r.uproszczenie]).toEqual([r.c, 'wariant sprzętu Machine Chest Press']);
  });

  test('organizacje warunkowe: źródło szczebla 4 ma opis strony (autor z kwalifikacjami, data)', () => {
    for (const k of A1.cwiczenia) for (const r of sentencesOf(k)) for (const [sid] of r.s) {
      if (sid === 'wniosek') continue;
      if (CUE_FULL.orgs[orgOf(sid)].warunkowo !== undefined) expect([sid, typeof CUE_FULL.sources[sid].strona]).toEqual([sid, 'string']);
    }
  });
});

describe('A1 pchanie: zdania', () => {
  test('37 nowych zdań ma tekst PL i EN różny od siebie i niepusty', () => {
    expect(A1.zdania.length).toBe(37);
    for (const c of A1.zdania) expect([c, typeof pl[c], typeof en[c], pl[c].trim().length > 0, en[c].trim().length > 0, pl[c] !== en[c]]).toEqual([c, 'string', 'string', true, true, true]);
  });

  test('nowe zdania A1 przełożone na 31 języków bazowych (przekład API 09.11.2026), zestaw przekładu pusty', () => {
    const z = json('docs/lokalizacja/zestaw-przekladu-2026-11-08-a1-wskazowki.json');
    expect(z.klucze).toEqual([]); /* przekład API naniesiony 09.11.2026 (ZB-051; docs/18) — zestaw opróżniony */
    for (const l of ['bg','cs','da','de','el','es','et','fi','fr','hr','hu','id','it','ja','ko','lt','lv','ms','nb','nl','pt','ro','ru','sk','sl','sr','sv','tr','uk','vi','zh-Hant']) { const d = json(`lib/cues/text/${l}.json`); expect([l, A1.zdania.filter((k: string) => !(k in d))]).toEqual([l, []]); }
  });

  test('teksty: bez cyfr, bez twierdzeń o bólu i zdrowiu, bez nazw źródeł i marek', () => {
    for (const c of A1.zdania) for (const t of [pl[c], en[c]]) {
      expect([c, /\d/.test(t)]).toEqual([c, false]);
      expect([c, /\b(boli|ból|bólu|kontuzj|pain|injur)/i.test(t)]).toEqual([c, false]);
      expect([c, /NASM|\bACE\b|ISSA|NFPT|Catalyst|BarBend|Bodylastics|HSS|ExRx|Fitness Volt|StrongFirst|TRX\b|Thera/i.test(t)]).toEqual([c, false]);
    }
  });
});

describe('A1 pchanie: rola mięśni (skośne w deskach bocznych)', () => {
  const rm = json('data/zrodla/role-miesni.json');
  test('funkcja obliques.side_hold ma dwa źródła szczebla 4 z różnych organizacji i status dwa_zrodla; reguły po nazwie tylko dla deski bocznej i wariantów z deską boczną', () => {
    const f = rm.functions['obliques.side_hold'];
    expect([f.status, f.zrodla.slice(0, 2)]).toEqual(['dwa_zrodla', ['S29', 'S30']]);
    const src = (id: string) => rm.sources.find((s: { id: string }) => s.id === id);
    expect([src('S29').tier, src('S30').tier]).toEqual([4, 4]);
    expect(src('S29').url).not.toBe(src('S30').url);
    const reg = rm.nameRules.reguly.filter((r: { function: string }) => r.function === 'obliques.side_hold');
    expect(reg.map((r: { roles: string[]; exercises: string[] }) => [r.roles, r.exercises])).toEqual([[['main'], ['Side Plank']], [['aux'], ['Copenhagen Plank', 'Push Up to Side Plank']]]);
  });
});
