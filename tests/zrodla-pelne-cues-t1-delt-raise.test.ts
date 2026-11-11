/*
 * Partia T1 integracji badań (rodzina delt_raise; linia 1.1, 04.11.2026): karty własne 23 ćwiczeń (wejście badacza merytorycznego 04.11.2026 po przeliczeniu szczebli W1/W2 i etapie 2;
 * decyzje koordynatora z 04.11.2026). Lista ćwiczeń, kart niepełnych (partial), zdań i luk — tests/fixtures/cues-t1-delt-raise.json.
 * Zakres strażnika źródeł (L-089): scripts/cues/gen.mjs `validate` (check:cues; reguły: tests/cues-reguly-2026-11-02.test.ts) — ten plik sprawdza, że dane T1 spełniają reguły,
 * że „praktyka” (szczebel 5) jest jawna w `luki`, a pominięte ćwiczenia i zdania nie weszły.
 * Rodzaje (docs/20): dane (karty, źródła), logika (≥ 2 organizacje szczebla ≤ 4 albo jawna luka), niezmienniki (źródła sporne poza danymi, szczebel 5 nie liczy się do pary),
 * języki (PL i EN w słownikach, reszta czeka na przekład — zestaw-przekladu-2026-11-04-t1-wskazowki.json), regresja (cue-sets: własne karty, wstrzymane zostają ogólne albo otwarte).
 * Ocena realności: błąd „karta techniki z jednego źródła albo ze źródła spornego, sprzeczna z rysunkiem” — realny (treść w aplikacji i na stronie z ćwiczeniami);
 * karty są ukryte do recenzji niezależnej (bramka 4, L-047) — nie sprawdzamy tu ich wyświetlania.
 */
import * as fs from 'fs';
import * as path from 'path';
import { CUE_DATA, CUE_SECTIONS } from '@/lib/cues';
import { CUE_FULL } from './zrodla-pelne';
import T1 from './fixtures/cues-t1-delt-raise.json';

const root = path.join(__dirname, '..');
const json = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const pl: Record<string, string> = json('lib/cues/text/pl.json'), en: Record<string, string> = json('lib/cues/text/en.json');
const sets = json('lib/figures/v2/cue-sets.json').items as Record<string, { b: string }>;
const orgOf = (sid: string) => CUE_FULL.sources[sid].org;
/** Szczebel źródła: własny (organizacje warunkowe) albo szczebel organizacji — jak srcLevel() w scripts/cues/gen.mjs. */
const lv = (sid: string): number => CUE_FULL.sources[sid].level ?? CUE_FULL.orgs[orgOf(sid)].level;

/** Ćwiczenia z wejścia badacza (31) niewdrożone w T1 — z powodem (decyzje koordynatora 04.11.2026 i zakres strażników). */
const POMINIETE: Record<string, string> = {
  'Y Raise (hantle)': 'rysunek przeczy źródłom (stanie w pochyleniu zamiast leżenia przodem na ławce skośnej) — karta wstrzymana do poprawki rysunku (decyzja koordynatora 4)',
  'Cable Seated Lateral Raise': 'żadne przeczytane źródło nie opisuje wersji z linkami — odrzucona w 1.1 (decyzja koordynatora 5)',
  'Machine Lateral Raise': 'drugie źródło (uczelniany centrum sportu, host uwo.ca) jest na liście spornych źródeł poza danymi (tests/zrodla-pelne-cues.test.ts) — zostaje z jednym źródłem szczebla 4 i zestawem ogólnym',
};
/** Karty wdrożone po dodaniu rodzaju źródła `app` (strona aplikacji, szczebel 5; 04.11.2026, decyzja koordynatora 8): 2 źródła szczebla 5, w tym strony aplikacji. */
const APLIKACJE = ['Front Incline Dumbbell Raise', 'Dumbbell Incline Shoulder Raise', 'Barbell Incline Shoulder Raise', 'Dumbbell Front Raise to Overhead', 'Straight Raises on Incline Bench'];

describe('T1 delt_raise: karty własne', () => {
  test('28 ćwiczeń ma komplet ustawienie + ruch w pełnych danych i w runtime (widoczne albo ukryte do recenzji); nie są w otwartych; niepełne są na liście partial', () => {
    expect(T1.cwiczenia.length).toBe(28);
    for (const k of T1.cwiczenia) {
      const x = CUE_FULL.exercises[k];
      expect([k, x.setup.length >= 1, x.move.length >= 1, k in CUE_FULL.open]).toEqual([k, true, true, false]);
      expect(CUE_DATA.exercises[k] ?? CUE_DATA.hidden.includes(k)).toBeTruthy();
      expect([k, (CUE_FULL.partial ?? []).includes(k)]).toEqual([k, x.tips.length < 2]);
      for (const s of CUE_SECTIONS) expect([k, s, CUE_FULL.exercises[k][s].length <= 4]).toEqual([k, s, true]);
    }
    expect(T1.partial.length).toBe(12);
    expect([...T1.partial].sort()).toEqual(T1.cwiczenia.filter(k => CUE_FULL.exercises[k].tips.length < 2).sort());
  });

  test('cue-sets: 28 ćwiczeń ma własne karty (b = own); pominięte nie mają karty własnej', () => {
    for (const k of T1.cwiczenia) expect([k, sets[k].b]).toEqual([k, 'own']);
    for (const k of Object.keys(POMINIETE)) expect([k, sets[k].b !== 'own', k in CUE_FULL.exercises, T1.cwiczenia.includes(k)]).toEqual([k, true, false, false]);
  });

  test('Upright Row: 7 ćwiczeń na dwóch organizacjach szczebla 4 (ISSA, Catalyst), bez przedruku NSCA ETM i WebMD Ignite; urow.setup ma tekst PL i EN (odwrócenie stanu z tests/cues-014.test.tsx, 04.11.2026)', () => {
    const UR = ['Upright Row (sztanga)', 'Upright Row (hantle)', 'Upright Row (linki)', 'Smith Machine Upright Row', 'Dumbbell One-Arm Upright Row', 'Smith Machine One-Arm Upright Row', 'Band Upright Row'];
    for (const k of UR) {
      const orgs = new Set([...CUE_FULL.exercises[k].setup, ...CUE_FULL.exercises[k].move].flatMap(r => r.s.map(([sid]) => orgOf(sid))));
      expect([k, orgs.has('ISSA'), orgs.has('Catalyst Athletics')]).toEqual([k, true, true]);
      expect([k, [...orgs].some(o => /NSCA ETM|WebMD/.test(o))]).toEqual([k, false]);
      expect([k, CUE_FULL.exercises[k].mistakes ?? []]).toEqual([k, []]); // błąd urow.mis.curl wymagał przedruku NSCA ETM (poza danymi)
    }
    expect(typeof pl['urow.setup']).toBe('string'); expect(typeof en['urow.setup']).toBe('string');
    expect('urow.mis.curl' in pl).toBe(false); // błąd opierał się na przedruku NSCA ETM (poza danymi)
    expect(CUE_FULL.open['Upright Row (hantle)']).toBeUndefined();
  });
});

describe('T1 delt_raise: źródła i reguły szczebli', () => {
  test('każda wskazówka ma ≥ 2 organizacje szczebla ≤ 4 albo jawną lukę (praktyka) z powodem; luka nie jest zbędna', () => {
    for (const k of T1.cwiczenia) for (const s of CUE_SECTIONS) for (const r of CUE_FULL.exercises[k][s]) {
      const orgs4 = new Set(r.s.filter(([sid]) => lv(sid) <= 4).map(([sid]) => orgOf(sid)));
      const luka = CUE_FULL.luki?.[`${k}::${r.c}`];
      expect([k, r.c, orgs4.size >= 2 || typeof luka === 'string']).toEqual([k, r.c, true]);
      expect([k, r.c, orgs4.size >= 2 && luka !== undefined]).toEqual([k, r.c, false]);
    }
    expect(T1.luki.length).toBe(36);
    for (const id of T1.luki) expect([id, /^praktyka/.test(CUE_FULL.luki![id])]).toEqual([id, true]);
  });

  test('karty bez żadnego źródła szczebla 5 nie mają luk; karty „praktyka” nie mają źródeł wyższych szczebli dla zdań z luką poza jednym szczeblem 4', () => {
    const PRAKTYKA = ['One-Arm Cable Rear Lateral Raise', 'Cable Reverse Fly', 'Cable Y Raise', 'One-Arm Incline Lateral Raise', 'Barbell Front Raise to Overhead', 'Sled Reverse Flye', 'Car Drivers'];
    for (const k of T1.cwiczenia) {
      const maLuke = Object.keys(CUE_FULL.luki ?? {}).some(id => id.startsWith(`${k}::`));
      const ma5 = [...CUE_SECTIONS].some(s => CUE_FULL.exercises[k][s].some(r => r.s.some(([sid]) => lv(sid) === 5)));
      if (PRAKTYKA.includes(k)) expect([k, maLuke && ma5]).toEqual([k, true]);
    }
    expect([...PRAKTYKA, ...APLIKACJE].sort()).toEqual(T1.partial.slice().sort());
  });

  test('źródła sporne (przedruk NSCA ETM, WebMD Ignite, uczelniany centrum sportu) i adresy stron aplikacji nie weszły do danych tych kart', () => {
    for (const k of T1.cwiczenia) for (const s of CUE_SECTIONS) for (const r of CUE_FULL.exercises[k][s]) for (const [sid] of r.s) {
      const u = CUE_FULL.sources[sid].url ?? '';
      expect([k, sid, /coachesontario|ummhealth|uwo\.ca|jefit|strongermobileapp|hueman|kovofitness|ellim\.app|motra\.com|lyfta/.test(u)]).toEqual([k, sid, false]);
    }
  });

  test('niewdrożone ćwiczenia (powody w tym pliku) nie mają kart własnych; Y Raise (hantle) i Cable Seated Lateral Raise nie mają zdań yr.* ani wersji z linkami', () => {
    expect(Object.keys(POMINIETE).length).toBe(3);
    for (const k of Object.keys(POMINIETE)) expect(POMINIETE[k].length).toBeGreaterThan(20);
    for (const c of ['yr.setup', 'yr.move', 'mlat.setup', 'mlat.move']) expect([c, c in pl, c in en]).toEqual([c, false, false]);
  });

  test('błędy wnioskowane z ruchu (decyzja koordynatora 3, 04.11.2026) nie weszły; błędy tylko z danych źródłowych', () => {
    for (const c of ['delt1.mis.elbows', 'scap.mis.plane', 'urow.mis.away', 'delt2.overHeight', 'rfly.mis.row']) expect([c, c in pl]).toEqual([c, false]);
    for (const k of T1.cwiczenia) for (const r of CUE_FULL.exercises[k].mistakes) expect([k, r.c, r.s.some(([sid]) => sid === 'wniosek')]).toEqual([k, r.c, false]);
    expect(CUE_FULL.exercises['Car Drivers'].mistakes.map(r => r.c)).toEqual(['cdr.mis.drop', 'mis.jerk']);
  });
});

describe('T1 delt_raise: karty na źródłach typu strona aplikacji (rodzaj `app`, 04.11.2026)', () => {
  test('5 kart: każde zdanie ma 2 źródła szczebla 5 (praktyka) i jawną lukę; źródła-aplikacje to tylko identyfikatory app-sN bez adresu; ≥ 1 strona aplikacji na kartę', () => {
    for (const k of APLIKACJE) {
      expect([k, T1.cwiczenia.includes(k), CUE_FULL.exercises[k].tips.length, (CUE_FULL.partial ?? []).includes(k)]).toEqual([k, true, 0, true]);
      let apki = 0;
      for (const s of CUE_SECTIONS) for (const r of CUE_FULL.exercises[k][s]) {
        expect([k, r.c, r.s.length, r.s.every(([sid]) => lv(sid) === 5), r.s.some(([sid]) => sid === 'wniosek')]).toEqual([k, r.c, 2, true, false]);
        expect([k, r.c, typeof CUE_FULL.luki?.[`${k}::${r.c}`]]).toEqual([k, r.c, 'string']);
        for (const [sid] of r.s) if (CUE_FULL.orgs[orgOf(sid)].kind === 'app') { apki++; expect([sid, /^app-s\d+$/.test(sid), CUE_FULL.sources[sid].url, CUE_FULL.sources[sid].title]).toEqual([sid, true, undefined, sid]); }
      }
      expect([k, apki > 0]).toEqual([k, true]);
    }
  });
  test('niezależność: w żadnym zdaniu dwa źródła nie są z tej samej organizacji; zdanie o ruchu sztangi (isr.move) ma oznaczone uproszczenie dla recenzenta', () => {
    for (const k of APLIKACJE) for (const s of CUE_SECTIONS) for (const r of CUE_FULL.exercises[k][s]) expect([k, r.c, new Set(r.s.map(([sid]) => orgOf(sid))).size]).toEqual([k, r.c, 2]);
    expect(typeof CUE_FULL.exercises['Barbell Incline Shoulder Raise'].move[0].uproszczenie).toBe('string');
  });
  test('11 nowych zdań ma PL i EN, bez cyfr; istniejące zdania fro.move, fro.mis.arch, mis.jerk są użyte ponownie', () => {
    for (const c of ['fidr.setup', 'fidr.move', 'fidr.mis.back', 'isr.setupDb', 'isr.setupBb', 'isr.move', 'isr.mis.press', 'dfro.setup', 'sri.setup', 'sri.move', 'yr.mis.chest']) expect([c, T1.zdania.includes(c), typeof pl[c], typeof en[c]]).toEqual([c, true, 'string', 'string']);
    for (const c of ['fro.move', 'fro.mis.arch', 'mis.jerk']) expect(CUE_FULL.exercises['Dumbbell Front Raise to Overhead'].setup.concat(CUE_FULL.exercises['Dumbbell Front Raise to Overhead'].move, CUE_FULL.exercises['Dumbbell Front Raise to Overhead'].mistakes).some(r => r.c === c)).toBe(true);
  });
});

describe('T1 delt_raise: poprawki po recenzji L-047 (04.11.2026)', () => {
  test('WYS: karty własne upright row używają id urow.height (wysokość ciężaru, część wspólna ISSA, Catalyst, Bodylastics); ur.height zestawu ogólnego (zestaw uprightRow zastąpiony kartami) nie zostaje jako zdanie osierocone (04.11.2026, decyzja koordynatora D1)', () => {
    expect(pl['urow.height']).not.toMatch(/Unoś łokcie/); expect(en['urow.height']).toMatch(/shoulder height/);
    expect(pl['ur.height']).toBeUndefined(); expect(en['ur.height']).toBeUndefined();
    for (const l of ['de', 'fr', 'ja', 'cs', 'es']) { const d = json(`lib/cues/text/${l}.json`); expect([l, typeof d['urow.height'], d['ur.height']]).toEqual([l, 'string', undefined]); }
    expect(Object.entries(CUE_FULL.exercises).filter(([, e]) => (e.tips ?? []).some(r => r.c === 'urow.height')).length).toBe(7);
    for (const [k, e] of Object.entries(CUE_FULL.exercises)) expect([k, (e.tips ?? []).some(r => r.c === 'ur.height')]).toEqual([k, false]);
    const ISSA = CUE_FULL.exercises['Upright Row (sztanga)'].tips.find(r => r.c === 'urow.height')!;
    expect(ISSA.s.some(([, at]) => /shoulder height/.test(at))).toBe(true); expect(ISSA.s.some(([, at]) => /jak najwyżej/.test(at))).toBe(true);
  });
  test('ŚR: Sled Reverse Flye srf.move ma 3 źródła szczebla 5 (w tym strona aplikacji); Band Lateral Raise blat.setup ma 2 organizacje szczebla ≤ 4 i brak luki', () => {
    const m = CUE_FULL.exercises['Sled Reverse Flye'].move[0]; expect(m.s.length).toBe(3); expect(m.s.some(([sid]) => CUE_FULL.orgs[orgOf(sid)].kind === 'app')).toBe(true);
    const b = CUE_FULL.exercises['Band Lateral Raise'].setup[0];
    expect(new Set(b.s.filter(([sid]) => lv(sid) <= 4).map(([sid]) => orgOf(sid))).size).toBe(2); expect(CUE_FULL.luki?.['Band Lateral Raise::blat.setup']).toBeUndefined(); expect(typeof b.uproszczenie).toBe('string');
  });
});

describe('T1 delt_raise: zdania', () => {
  test('52 nowe zdania (w tym urow.height po recenzji L-047) mają tekst PL i EN; kolizji z istniejącymi id nie ma (id z fixture nie były w słownikach przed partią)', () => {
    expect(T1.zdania.length).toBe(52);
    for (const c of T1.zdania) expect([c, typeof pl[c], typeof en[c], pl[c].trim().length > 0, en[c].trim().length > 0, pl[c] !== en[c]]).toEqual([c, 'string', 'string', true, true, true]);
    /* po przekładzie (04.11.2026) zestaw T1 jest pusty: wpisy znikają po nałożeniu tłumaczeń (wzór: zestaw P2) */
    expect(json('docs/lokalizacja/zestaw-przekladu-2026-11-04-t1-wskazowki.json').klucze).toEqual([]);
  });

  const NAKLADKI = ['pt-BR', 'es-419']; const PO_ZMIANIE_W02 = ['fidr.move'];
  test('zdania nowe są przetłumaczone: komplet języków lib/cues/text (35 plików: 33 języki przekładu i nakładki) ma niepuste teksty, parametry {…} bez zmian, a zestaw oczekujących jest pusty (po przekładzie 04.11.2026)', () => {
    const langs = fs.readdirSync(path.join(__dirname, '..', 'lib/cues/text')).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
    expect(langs.length).toBe(35);
    for (const l of langs) { const d = json(`lib/cues/text/${l}.json`); for (const id of T1.zdania) { if (NAKLADKI.includes(l) && d[id] === undefined) continue; if (PO_ZMIANIE_W02.includes(id) && d[id] === undefined) continue; /* 11.11.2026 (W-02): fidr.move zmienione w PL/EN (część wspólna źródeł), stare tłumaczenia usunięte, przekład w W-03 (docs/lokalizacja/zestaw-przekladu-2026-11-11-w02-wskazowki.json; pilnuje tests/figures-v2-delt-raise-w02.test.ts) */ /* nakładki pt-BR i es-419 zawierają tylko teksty różne od bazowych pt/es */ expect([l, id, typeof d[id], String(d[id] ?? '').trim().length > 0]).toEqual([l, id, 'string', true]); expect([l, id, (String(d[id]).match(/\{[^}]+\}/g) ?? []).sort()]).toEqual([l, id, (pl[id].match(/\{[^}]+\}/g) ?? []).sort()]); } }
  });

  test('teksty nowych zdań: bez cyfr (liczby wymagają osobnych źródeł; kąt 30° ze Scaption poza tekstem), bez twierdzeń o bólu i zdrowiu, bez nazw źródeł i marek', () => {
    for (const c of T1.zdania) for (const t of [pl[c], en[c]]) {
      expect([c, /\d/.test(t)]).toEqual([c, false]);
      expect([c, /\b(boli|ból|bólu|kontuzj|pain|injur)/i.test(t)]).toEqual([c, false]);
      expect([c, /NASM|\bACE\b|ISSA|NFPT|Catalyst|BarBend|Bodylastics|HSS/i.test(t)]).toEqual([c, false]);
    }
  });

  test('wskazówki pozostałe: reużyte id mają to samo brzmienie co w wejściu badacza (lat.height, front.elbows, rear.arms)', () => {
    expect(pl['lat.height']).toBe('Unoś mniej więcej do wysokości barków.');
    expect(pl['front.elbows']).toBe('Łokcie proste lub lekko ugięte — w tym samym ustawieniu przez cały ruch.');
    expect(pl['rear.arms']).toBe('Ramiona idą w bok, nie w tył — dłonie kończą ruch mniej więcej na linii barków.');
  });
});
