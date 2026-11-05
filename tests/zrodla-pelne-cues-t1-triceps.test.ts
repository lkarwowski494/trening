/*
 * Partia T1 integracji badań (rodzina triceps; linia 1.1, 04.11.2026): karty własne 22 ćwiczeń (wejście badacza merytorycznego 04.11.2026, rundy 1 i 2;
 * decyzje koordynatora z 04.11.2026, pkt 1, 3, 9–12). Lista ćwiczeń, kart niepełnych (partial), zdań i luk — tests/fixtures/cues-t1-triceps.json.
 * Zakres strażnika źródeł (L-089): scripts/cues/gen.mjs `validate` (check:cues; reguły: tests/cues-reguly-2026-11-02.test.ts) — ten plik sprawdza, że dane T1 spełniają reguły,
 * że „praktyka” (para szczebel 4 + 5 albo 5 + 5) jest jawna w `luki`, a pominięte ćwiczenia i błędy wnioskowane nie weszły.
 * Rodzaje (docs/20): dane (karty, źródła), logika (≥ 2 organizacje szczebla ≤ 4 albo jawna luka), niezmienniki (szczebel 5 nie liczy się do pary, bez „wniosek”),
 * języki (PL i EN w słownikach, przekład 33 języków z 05.11.2026 — zestaw-przekladu-2026-11-04-t1b-wskazowki.json pusty), regresja (cue-sets: własne karty; pominięte bez karty własnej).
 * Ocena realności: błąd „karta techniki z jednego źródła, ze źródła szczebla 5 albo sprzeczna z rysunkiem” — realny (treść w aplikacji i na stronie z ćwiczeniami);
 * karty są ukryte do recenzji niezależnej (bramka 4, L-047) — nie sprawdzamy tu ich wyświetlania.
 */
import * as fs from 'fs';
import * as path from 'path';
import { CUE_DATA, CUE_SECTIONS } from '@/lib/cues';
import { CUE_FULL } from './zrodla-pelne';
import T1 from './fixtures/cues-t1-triceps.json';

const root = path.join(__dirname, '..');
const json = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const pl: Record<string, string> = json('lib/cues/text/pl.json'), en: Record<string, string> = json('lib/cues/text/en.json');
const sets = json('lib/figures/v2/cue-sets.json').items as Record<string, { b: string }>;
const orgOf = (sid: string) => CUE_FULL.sources[sid].org;
/** Szczebel źródła: własny (organizacje warunkowe) albo szczebel organizacji — jak srcLevel() w scripts/cues/gen.mjs. */
const lv = (sid: string): number => CUE_FULL.sources[sid].level ?? CUE_FULL.orgs[orgOf(sid)].level;
const sentencesOf = (k: string) => CUE_SECTIONS.flatMap(s => CUE_FULL.exercises[k][s] ?? []);

/** Ćwiczenia z wejścia badacza niewdrożone w tej partii — z powodem (decyzje koordynatora 04.11.2026, pkt 2 i 11). */
const POMINIETE: Record<string, string> = {
  'Machine Triceps Extension': 'rysunek bez poduszki pod ramiona przeczy źródłom (ACE #292, Human Kinetics) — karta wstrzymana do poprawki rysunku (decyzja koordynatora 2)',
  'Cable Incline Triceps Extension': 'brak przeczytanego źródła o tej wersji; skośne oparcie to inne podparcie, nie wariant sprzętu — bez kompletu źródeł → 1.2 (decyzja koordynatora 11)',
  'Kneeling Cable Triceps Extension': 'brak przeczytanego źródła o klęku na ławce; klęk to inne podparcie, nie wariant sprzętu — bez kompletu źródeł → 1.2 (decyzja koordynatora 11)',
};
/** Karty „praktyka” (para 4 + 5 albo 5 + 5): zdania z luką w danych. */
const PRAKTYKA = ['Reverse Grip Triceps Pushdown', 'Band Overhead Triceps Extension', 'Decline Dumbbell Triceps Extension', 'Decline EZ Bar Triceps Extension', 'Chain Handle Extension'];

describe('T1 triceps: karty własne', () => {
  test('22 ćwiczenia mają komplet ustawienie + ruch w pełnych danych i w runtime (widoczne albo ukryte do recenzji); nie są w otwartych; niepełne są na liście partial', () => {
    expect(T1.cwiczenia.length).toBe(22);
    for (const k of T1.cwiczenia) {
      const x = CUE_FULL.exercises[k];
      expect([k, (x.setup ?? []).length >= 1, (x.move ?? []).length >= 1, k in CUE_FULL.open]).toEqual([k, true, true, false]);
      expect(CUE_DATA.exercises[k] ?? CUE_DATA.hidden.includes(k)).toBeTruthy();
      expect([k, (CUE_FULL.partial ?? []).includes(k)]).toEqual([k, (x.tips ?? []).length < 2]);
      for (const s of CUE_SECTIONS) expect([k, s, (CUE_FULL.exercises[k][s] ?? []).length <= 4]).toEqual([k, s, true]);
    }
    expect(T1.partial.length).toBe(16);
    expect([...T1.partial].sort()).toEqual(T1.cwiczenia.filter(k => (CUE_FULL.exercises[k].tips ?? []).length < 2).sort());
  });

  test('cue-sets: 22 ćwiczeń ma własne karty (b = own); pominięte nie mają karty własnej ani wskazówek', () => {
    for (const k of T1.cwiczenia) expect([k, sets[k].b]).toEqual([k, 'own']);
    for (const k of Object.keys(POMINIETE)) expect([k, sets[k].b !== 'own', k in CUE_FULL.exercises, T1.cwiczenia.includes(k), POMINIETE[k].length > 20]).toEqual([k, true, false, false, true]);
  });

  test('Skullcrusher (hantle) i Triceps Kickback wyszły z listy otwartych (karty własne); zdanie skull.depthFree zostaje jako wskazówka Skullcrusher (hantle)', () => {
    for (const k of ['Skullcrusher (hantle)', 'Triceps Kickback']) expect([k, k in CUE_FULL.open, k in CUE_FULL.exercises]).toEqual([k, false, true]);
    expect(CUE_FULL.exercises['Skullcrusher (hantle)'].tips.map(r => r.c)).toEqual(['skull.upperArm', 'skull.depthFree']);
    expect(CUE_FULL.exercises['Skullcrusher (hantle)'].tips.every(r => typeof r.uproszczenie === 'string' || r.c === 'skull.upperArm')).toBe(true);
  });
});

describe('T1 triceps: źródła i reguły szczebli', () => {
  test('każda wskazówka ma ≥ 2 organizacje szczebla ≤ 4 albo jawną lukę (praktyka) z powodem; luka nie jest zbędna', () => {
    for (const k of T1.cwiczenia) for (const r of sentencesOf(k)) {
      const orgs4 = new Set(r.s.filter(([sid]) => lv(sid) <= 4).map(([sid]) => orgOf(sid)));
      const luka = CUE_FULL.luki?.[`${k}::${r.c}`];
      expect([k, r.c, orgs4.size >= 2 || typeof luka === 'string']).toEqual([k, r.c, true]);
      expect([k, r.c, orgs4.size >= 2 && luka !== undefined]).toEqual([k, r.c, false]);
    }
    expect(T1.luki.length).toBe(14);
    for (const id of T1.luki) expect([id, /^praktyka/.test(CUE_FULL.luki![id])]).toEqual([id, true]);
  });

  test('„praktyka”: luki mają tylko karty z listy PRAKTYKA, a każda z nich ma ≥ 1 źródło szczebla 5; Reverse Grip: Catalyst (4) + wpis gościnny bez nazwanego autora (5)', () => {
    const zLuka = new Set(T1.luki.map(id => id.split('::')[0]));
    expect([...zLuka].sort()).toEqual([...PRAKTYKA].sort());
    for (const k of PRAKTYKA) expect([k, sentencesOf(k).some(r => r.s.some(([sid]) => lv(sid) === 5))]).toEqual([k, true]);
    const rg = CUE_FULL.exercises['Reverse Grip Triceps Pushdown'].setup[0];
    expect(rg.s.map(([sid]) => [orgOf(sid), lv(sid)])).toEqual([['Catalyst Athletics', 4], ['NFPT (wpisy gościnne)', 5]]);
    expect(CUE_FULL.luki!['Reverse Grip Triceps Pushdown::mis.elbowsAway']).toBeUndefined();
  });

  test('bez źródeł „wniosek”: błędy wnioskowane z ruchu nie weszły (decyzja koordynatora 3); tri.mis.tateElbows, tri.mis.kickBack, tri.mis.lyingArm, mis.torso nie mają tekstu', () => {
    for (const c of ['tri.mis.tateElbows', 'tri.mis.kickBack', 'tri.mis.lyingArm', 'mis.torso', 'tri.mis.padLift', 'machTri.setup']) expect([c, c in pl, c in en]).toEqual([c, false, false]);
    for (const k of T1.cwiczenia) for (const r of CUE_FULL.exercises[k].mistakes ?? []) expect([k, r.c, r.s.some(([sid]) => sid === 'wniosek')]).toEqual([k, r.c, false]);
    expect(CUE_FULL.exercises['Tate Press'].mistakes ?? []).toEqual([]);
  });

  test('spór o blokowanie łokcia (Catalyst: „full lockout”, ISSA: „not lock”): press.noLock nie trafia do skull crusherów ani wersji na ławce skośnej i za głową; decyzja 12: bez skull.upperArm przy Behind The Head i Incline Barbell', () => {
    const SKULL = ['Skullcrusher (hantle)', 'Skullcrusher (sztanga)', 'Band Skull Crusher', 'Cable Lying Triceps Extension', 'Incline Barbell Triceps Extension', 'Decline Dumbbell Triceps Extension', 'Decline EZ Bar Triceps Extension', 'Lying Close-Grip Barbell Triceps Extension Behind The Head', 'One-Arm Lying Dumbbell Triceps Extension', 'Chain Handle Extension'];
    for (const k of SKULL) expect([k, sentencesOf(k).some(r => /noLock/.test(r.c))]).toEqual([k, false]);
    for (const k of ['Lying Close-Grip Barbell Triceps Extension Behind The Head', 'Incline Barbell Triceps Extension']) expect([k, sentencesOf(k).some(r => r.c === 'skull.upperArm')]).toEqual([k, false]);
    for (const c of ['skull.setup', 'skull.move', 'skull.depth', 'machTri.pivot']) for (const k of T1.cwiczenia) expect([c, k, sentencesOf(k).some(r => r.c === c)]).toEqual([c, k, false]); /* zdania z jednego źródła lub szczebla 5 poza kartami */
  });

  test('źródła: strony aplikacji tylko jako identyfikator app-s8 bez adresu; sporne i niezależność — brak dwóch źródeł tej samej organizacji w jednym zdaniu', () => {
    const app = CUE_FULL.sources['app-s8'];
    expect([app.url, app.title, CUE_FULL.orgs['app-s8'].kind, CUE_FULL.orgs['app-s8'].level]).toEqual([undefined, 'app-s8', 'app', 5]);
    expect(sentencesOf('Chain Handle Extension').every(r => r.s.some(([sid]) => sid === 'app-s8'))).toBe(true);
    for (const k of T1.cwiczenia) for (const r of sentencesOf(k)) {
      const orgs = r.s.map(([sid]) => orgOf(sid));
      // dwa odwołania do tej samej organizacji w jednym zdaniu dozwolone tylko dla ISSA/Catalyst (różne strony tej samej organizacji nie dublują pary)
      expect([k, r.c, new Set(orgs).size >= 2]).toEqual([k, r.c, true]);
    }
  });

  test('uproszczenia (wariant sprzętu, jedna ręka, guma ≈ wyciąg) są jawne: Band Skull Crusher, One-Arm Lying, Two-Arm Kickback i Triceps Kickback (linki) czekają na potwierdzenie recenzenta L-047', () => {
    for (const k of ['Band Skull Crusher', 'One-Arm Lying Dumbbell Triceps Extension', 'Two-Arm Dumbbell Kickback', 'Triceps Kickback (linki)']) {
      const s = sentencesOf(k).filter(r => r.uproszczenie !== undefined);
      expect([k, s.length >= 3]).toEqual([k, true]);
    }
    expect(CUE_FULL.exercises['Band Skull Crusher'].setup[0].uproszczenie).toMatch(/recenzenta L-047/);
    expect(CUE_FULL.exercises['Cable Lying Triceps Extension'].setup[0].s.map(([sid]) => sid)).toContain('exrx-Triceps/CBLyingTriExt');
  });
});

describe('T1 triceps: zdania', () => {
  test('46 nowych zdań ma tekst PL i EN; id z fixture nie było w słownikach przed partią; po przekładzie (05.11.2026) zestaw T1b jest pusty', () => {
    expect(T1.zdania.length).toBe(46);
    for (const c of T1.zdania) expect([c, typeof pl[c], typeof en[c], pl[c].trim().length > 0, en[c].trim().length > 0, pl[c] !== en[c]]).toEqual([c, 'string', 'string', true, true, true]);
    expect(json('docs/lokalizacja/zestaw-przekladu-2026-11-04-t1b-wskazowki.json').klucze).toEqual([]);
  });

  const NAKLADKI = ['pt-BR', 'es-419'];
  test('zdania nowe są przetłumaczone (05.11.2026): komplet języków lib/cues/text (35 plików: 33 języki przekładu i nakładki) ma niepuste teksty, parametry {…} bez zmian', () => {
    const langs = fs.readdirSync(path.join(__dirname, '..', 'lib/cues/text')).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
    expect(langs.length).toBe(35);
    for (const l of langs) { const d = json(`lib/cues/text/${l}.json`); for (const id of T1.zdania) { if (NAKLADKI.includes(l) && d[id] === undefined) continue; /* nakładki zawierają tylko teksty różne od bazowych pt/es */ expect([l, id, typeof d[id], String(d[id] ?? '').trim().length > 0]).toEqual([l, id, 'string', true]); expect([l, id, (String(d[id]).match(/\{[^}]+\}/g) ?? []).sort()]).toEqual([l, id, (pl[id].match(/\{[^}]+\}/g) ?? []).sort()]); } }
  });

  test('teksty: bez cyfr (liczby wymagają osobnych źródeł; kąt prosty słowami), bez twierdzeń o bólu i zdrowiu, bez nazw źródeł i marek', () => {
    for (const c of T1.zdania) for (const t of [pl[c], en[c]]) {
      expect([c, /\d/.test(t)]).toEqual([c, false]);
      expect([c, /\b(boli|ból|bólu|kontuzj|pain|injur)/i.test(t)]).toEqual([c, false]);
      expect([c, /NASM|\bACE\b|ISSA|NFPT|Catalyst|BarBend|Bodylastics|HSS|ExRx|Fitness Volt|Fit Father|BodBot/i.test(t)]).toEqual([c, false]);
    }
  });

  test('zdania jednorącz mają liczbę pojedynczą, a odmiany sprzętu nazywają przyrząd (hantel, sztanga, wyciąg, guma, łańcuch)', () => {
    expect(pl['tri.skullDb1.setup']).toMatch(/hantel nad sobą na prostej ręce/); expect(pl['tri.mis.elbowFlare1']).toMatch(/Łokieć rozjeżdża się/);
    expect(pl['tri.skullBand.setup']).toMatch(/gumę/); expect(pl['tri.skullCb.setup']).toMatch(/wyciągu/); expect(pl['tri.skullInc.setup']).toMatch(/skośnej/);
    expect(pl['tri.skullDec.setup']).toMatch(/głową w dół/); expect(pl['tri.chainExt.setup']).toMatch(/łańcuchem/); expect(en['tri.chainExt.setup']).toMatch(/chain handle/);
    expect(pl['ote.setupLoad']).not.toMatch(/hantel|sztang|kettlebell/i); /* zdanie neutralne sprzętowo: kettlebell, gryf EZ i sztanga */
  });
});
