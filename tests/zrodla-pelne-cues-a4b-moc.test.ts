/*
 * Partia A4b integracji badań (moc: kb_ballistic, plyo, sled_throw, strongman; przedramiona: forearm; linia 1.1, 09.11.2026):
 * karty własne z badań W1 (po przeliczeniu szczebli 02.11.2026) i W2 z 02.11.2026. Lista ćwiczeń, kart niepełnych, zdań, odrzuconych zdań, odwołań i kart wstrzymanych — tests/fixtures/cues-a4b-moc.json.
 * Zakres strażnika źródeł (L-089): scripts/cues/gen.mjs `validate` (check:cues; MIN_ORGS = 2, MAX_COUNT_LEVEL = 4 — scripts/cues/gen.mjs:17 i :36) — ten plik sprawdza,
 * że dane A4b spełniają regułę bez wyjątków partii: każde zdanie ma ≥ 2 organizacje szczebla ≤ 4 (bez luk „praktyka” i bez „wniosek”), źródła niebyłe nie weszły,
 * pominięte i wstrzymane ćwiczenia nie mają karty własnej, a karty nie zmieniają plików wspólnych silnika rysunku.
 * Rodzaje (docs/20): dane (karty, źródła), logika (≥ 2 organizacje), niezmienniki (bez „wniosek”, bez luk), języki (PL i EN; 33 języki — zestaw przekładu A4b),
 * regresja (cue-sets: własne karty; pominięte i wstrzymane bez karty własnej; karty ukryte do przekładu — karty_nowe; zrecenzowany zestaw ogólny Split Jump na liście zestawy_zmienione).
 * Ocena realności: błąd „karta techniki z jednego źródła albo ze źródła szczebla 5” — realny (treść w aplikacji i na stronie z ćwiczeniami);
 * karty są ukryte do recenzji niezależnej i przekładu (bramka 4, L-047, karty_nowe) — nie sprawdzamy tu ich wyświetlania.
 */
import * as fs from 'fs';
import * as path from 'path';
import { CUE_DATA, CUE_SECTIONS } from '@/lib/cues';
import { CUE_FULL } from './zrodla-pelne';
import A4B from './fixtures/cues-a4b-moc.json';

const root = path.join(__dirname, '..');
const json = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const pl: Record<string, string> = json('lib/cues/text/pl.json'), en: Record<string, string> = json('lib/cues/text/en.json');
const sets = json('lib/figures/v2/cue-sets.json').items as Record<string, { b: string }>;
const orgOf = (sid: string) => CUE_FULL.sources[sid].org;
/** Szczebel źródła: własny (organizacje warunkowe) albo szczebel organizacji — jak srcLevel() w scripts/cues/gen.mjs. */
const lv = (sid: string): number => CUE_FULL.sources[sid].level ?? CUE_FULL.orgs[orgOf(sid)].level;
type Row = { c: string; s: [string, string, string?][]; uproszczenie?: string };
const sentencesOf = (k: string) => CUE_SECTIONS.flatMap(s => (CUE_FULL.exercises[k][s] ?? []) as Row[]);
const WSTRZYMANE = Object.keys(A4B.wstrzymane);

describe('A4b moc i przedramiona: karty własne (09.11.2026)', () => {
  test('10 ćwiczeń ma komplet ustawienie + ruch w pełnych danych; po przekładzie i recenzji (09.11.2026) widoczne w runtime (nie na liście hidden); niepełne są na liście partial', () => {
    expect([...A4B.cwiczenia].sort()).toEqual(['Atlas Stones', 'Backward Drag', 'Double Kettlebell Push Press', 'Double Kettlebell Snatch', 'Kettlebell Clean', 'Kettlebell Snatch',
      'Lateral Cone Hops', 'One-Arm Kettlebell Push Press', 'Plate Pinch', 'Split Jump']);
    for (const k of A4B.cwiczenia) {
      const x = CUE_FULL.exercises[k];
      expect([k, (x.setup ?? []).length >= 1, (x.move ?? []).length >= 1, k in CUE_FULL.open]).toEqual([k, true, true, false]);
      expect([k, CUE_DATA.hidden.includes(k), k in CUE_DATA.exercises]).toEqual([k, false, true]);
      expect([k, (CUE_FULL.partial ?? []).includes(k)]).toEqual([k, (x.tips ?? []).length < 2]);
      for (const s of CUE_SECTIONS) expect([k, s, (CUE_FULL.exercises[k][s] ?? []).length <= 4]).toEqual([k, s, true]);
    }
    expect([...A4B.partial].sort()).toEqual(A4B.cwiczenia.filter(k => (CUE_FULL.exercises[k].tips ?? []).length < 2).sort());
    expect(A4B.partial.length).toBe(9);
  });

  test('karty odsłonięte po przekładzie i recenzji (09.11.2026): żadna z 10 nie jest na liście karty_nowe; każda ma wpis „karty” wyswietlana, którego recenzent ≠ autor (L-047)', () => {
    const wyj = json('tests/recenzja-wyjatki-1-1.json'), rec = json('docs/research/figury-recenzja.json');
    for (const k of A4B.cwiczenia) expect([k, wyj.karty_nowe.includes(k), rec.karty?.[k]?.werdykt, rec.karty?.[k]?.recenzent !== rec.karty?.[k]?.autor]).toEqual([k, false, 'wyswietlana', true]);
  });

  test('Split Jump: zrecenzowany zestaw ogólny (02.11.2026) zastąpiony kartą — na liście zestawy_zmienione (mechanizm z 08.11.2026, jak Cable Russian Twists w A4a)', () => {
    const wyj = json('tests/recenzja-wyjatki-1-1.json'), rec = json('docs/research/figury-recenzja.json');
    expect(A4B.zestawyZmienione).toEqual(['Split Jump']);
    expect([rec.zestawy?.['Split Jump']?.werdykt, wyj.zestawy_zmienione.includes('Split Jump'), sets['Split Jump'].b]).toEqual(['wyswietlana', true, 'own']);
  });

  test('cue-sets: 10 ćwiczeń ma własne karty (b = own); pominięte (bez ustawienia/ruchu, bez błędu przy pozach v2) i wstrzymane do decyzji nie mają karty własnej', () => {
    for (const k of A4B.cwiczenia) expect([k, sets[k].b]).toEqual([k, 'own']);
    const pominiete = [...A4B.bezUstawieniaLubRuchu, ...A4B.pominieteBezBledu, ...WSTRZYMANE];
    expect(pominiete.length).toBe(23);
    for (const k of pominiete) expect([k, sets[k]?.b !== 'own', k in CUE_FULL.exercises, A4B.cwiczenia.includes(k)]).toEqual([k, true, false, false]);
    expect(WSTRZYMANE.sort()).toEqual(['Depth Jump', 'Medicine Ball Scoop Throw', 'One-Arm Kettlebell Clean and Jerk', 'Turkish Get Up']);
  });

  test('P2 (03.11.2026): Depth Jump i Turkish Get Up nadal „do decyzji koordynatora” — A4b ich nie rozstrzyga (zestaw ogólny zostaje)', () => {
    for (const k of ['Depth Jump', 'Turkish Get Up']) expect([k, sets[k].b, k in CUE_FULL.exercises]).toEqual([k, 'general', false]);
    expect(typeof pl['tgu.eyes']).toBe('string');
  });

  test('uproszczenia wariantu (pole uproszczenie przy zdaniu, do potwierdzenia przez recenzenta): One-Arm Kettlebell Push Press, Double Kettlebell Snatch, Plate Pinch — każde zdanie; Backward Drag — ruch', () => {
    for (const k of ['One-Arm Kettlebell Push Press', 'Double Kettlebell Snatch', 'Plate Pinch']) for (const r of sentencesOf(k)) expect([k, r.c, typeof r.uproszczenie]).toEqual([k, r.c, 'string']);
    expect(sentencesOf('Backward Drag').filter(r => r.uproszczenie).map(r => r.c)).toEqual(['sled.backPedal']);
  });

  test('pliki wspólne silnika rysunku: reguły sensu póz kart A4b nie zależą od zestawu ogólnego (lib/figures/v2/reguly-cwiczen.json bez reguł dla kart A4b spoza wariantów)', () => {
    const reg = json('lib/figures/v2/reguly-cwiczen.json') as Record<string, Record<string, string[]>>;
    const sens = json('data/zrodla/figury-sens.json').rodziny as Record<string, { warianty?: Record<string, string[] | string>; reguly?: Record<string, { pewnosc?: string }> }>;
    /* 10.11.2026 (partia 6, plyo): wariant może być aliasem zestawu (`"_skok"`), a reguly-cwiczen.json zawiera tylko reguły „ustalone” (scripts/zrodla-runtime.mjs, buildReguly) — porównanie z rozwiniętym wariantem po tym samym filtrze, nie z surowym wpisem */
    const wariant = (fam: string, k: string): string[] | undefined => { const w = sens[fam]?.warianty; const v = w?.[k]; const lista = typeof v === 'string' ? w?.[v] : v; return Array.isArray(lista) ? lista.filter(id => /^ustalone/.test(sens[fam]?.reguly?.[id]?.pewnosc ?? '')) : undefined; };
    for (const [fam, m] of Object.entries(reg)) for (const k of A4B.cwiczenia) if (k in m) expect([fam, k, m[k]]).toEqual([fam, k, wariant(fam, k) ?? m[k]]);
  });
});

describe('A4b moc i przedramiona: źródła i reguły szczebli', () => {
  test('każde zdanie ma ≥ 2 różne organizacje szczebla ≤ 4; bez luk „praktyka” i bez „wniosek”', () => {
    for (const k of A4B.cwiczenia) for (const r of sentencesOf(k)) {
      const orgs4 = new Set(r.s.filter(([sid, , mark]) => sid !== 'wniosek' && mark === undefined && lv(sid) <= 4).map(([sid]) => orgOf(sid)));
      expect([k, r.c, orgs4.size >= 2]).toEqual([k, r.c, true]);
      expect([k, r.c, r.s.some(([sid]) => sid === 'wniosek'), CUE_FULL.luki?.[`${k}::${r.c}`]]).toEqual([k, r.c, false, undefined]);
    }
  });

  test('źródła niebyłe (blog producenta Bells of Steel, EliteFTS bez kwalifikacji autora, fragment książki Human Kinetics bez kwalifikacji i daty) nie są w danych; ich odwołania zapisane w fixture', () => {
    const niebyle = ['bos-wrist-roller', 'bos-yoke', 'elitefts-eight-drag', 'hk-blob-throw'];
    expect(Object.keys(A4B.niebyle).filter(k => !k.includes(' ')).sort()).toEqual(niebyle);
    for (const sid of niebyle) expect([sid, sid in CUE_FULL.sources]).toEqual([sid, false]);
    for (const [k, c, sid] of A4B.usunieteOdwolania) if (A4B.cwiczenia.includes(k)) expect([k, c, sentencesOf(k).find(r => r.c === c)?.s.some(([s]) => s === sid) ?? false]).toEqual([k, c, false]);
  });

  test('zdania odrzucone (mniej niż dwie organizacje, w tym błędy wnioskowane) nie są w kartach tych ćwiczeń; zdania tylko z odrzuconych kart nie weszły do słowników', () => {
    expect(A4B.odrzucone.length).toBe(42);
    for (const [k, , c] of A4B.odrzucone) if (A4B.cwiczenia.includes(k as string)) expect([k, c, sentencesOf(k as string).some(r => r.c === c)]).toEqual([k, c, false]);
    for (const c of ['kbpp.mis.noLegs', 'kbb.mis.dblNarrow', 'plyo.depth.mis.jumpOff', 'sled.mis.row', 'as.mis.away', 'pinch.mis.handle', 'wr.setupUp', 'wroll.setup', 'yoke.setup', 'tgu.mis.bentArm', 'scoop.move'])
      expect([c, c in pl, c in en]).toEqual([c, false, false]);
  });

  test('nowe źródła: adres https, organizacja z danych; nowe organizacje: przegląd systematyczny strongman (szczebel 2), PEP i NISMAT (szczebel 4)', () => {
    expect(A4B.noweZrodla.length).toBe(18);
    for (const sid of A4B.noweZrodla) {
      const s = CUE_FULL.sources[sid] as { url?: string; org: string };
      expect([sid, /^https:\/\//.test(s.url ?? ''), s.org in CUE_FULL.orgs]).toEqual([sid, true, true]);
    }
    expect(A4B.noweOrganizacje.map(o => [o, CUE_FULL.orgs[o].level])).toEqual([['Hindle i in. (Sports Med Open 2019)', 2], ['NISMAT', 4], ['Santa Monica Sports Medicine Research Foundation', 4]]);
  });
});

describe('A4b moc i przedramiona: zdania', () => {
  test('24 nowe zdania mają tekst PL i EN różny od siebie; wszystkie przełożone na 31 języków bazowych (przekład API 09.11.2026), zestaw A4b pusty', () => {
    expect(A4B.zdania.length).toBe(24);
    for (const c of A4B.zdania) expect([c, typeof pl[c], typeof en[c], pl[c].trim().length > 0, en[c].trim().length > 0, pl[c] !== en[c]]).toEqual([c, 'string', 'string', true, true, true]);
    const z = json('docs/lokalizacja/zestaw-przekladu-2026-11-09-a4b-wskazowki.json');
    expect(z.klucze).toEqual([]); /* przekład API naniesiony 09.11.2026 (ZB-054; docs/18) — zestaw opróżniony */
    for (const l of ['bg','cs','da','de','el','es','et','fi','fr','hr','hu','id','it','ja','ko','lt','lv','ms','nb','nl','pt','ro','ru','sk','sl','sr','sv','tr','uk','vi','zh-Hant']) { const d = json(`lib/cues/text/${l}.json`); expect([l, A4B.zdania.filter((k: string) => !(k in d))]).toEqual([l, []]); }
  });

  test('teksty: bez cyfr, bez twierdzeń o bólu i zdrowiu, bez nazw źródeł i marek, bez „pozycja rack” (słownik terminów: „oparty przy barku”)', () => {
    for (const c of A4B.zdania) for (const t of [pl[c], en[c]]) {
      expect([c, /\d/.test(t)]).toEqual([c, false]);
      expect([c, /\b(boli|ból|bólu|kontuzj|pain|injur)/i.test(t)]).toEqual([c, false]);
      expect([c, /NASM|\bACE\b|BarBend|StrongFirst|CrossFit|Fitness Volt|EliteFTS|REP Fitness|Torque|NISMAT|PEP\b|Catalyst/i.test(t)]).toEqual([c, false]);
    }
    for (const c of A4B.zdania) expect([c, /pozycj\w*\s+rack|(?<![\p{L}])rack(?![\p{L}])/u.test(pl[c])]).toEqual([c, false]);
  });
});

describe('A4b: poprawki rundy 1 recenzji niezależnej (09.11.2026)', () => {
  test('sled.backGrip bez „pasów” w rękach (źródła: lina w rękach albo pas na biodrach); zamach kettlebellem bez „przerzuć”; push press bez „wyciskania z wybiciem”', () => {
    expect([pl['sled.backGrip'], en['sled.backGrip']]).toEqual(['Chwyć linę sanek w obie ręce.', 'Grab the sled rope with both hands.']);
    for (const c of A4B.zdania) {
      expect([c, /(?<![\p{L}])pas(y|ami|ów)?(?![\p{L}])/u.test(pl[c]) || /\bstraps?\b/i.test(en[c])]).toEqual([c, false]);
      expect([c, /przerzu\w*[^.]*między nogami/u.test(pl[c]), /wyciskani\w* z wybicie/u.test(pl[c])]).toEqual([c, false, false]);
    }
  });
  test('miejsca źródeł poprawione: barbend-kb-snatch przy kbb.bellSetup — progresja swingu; cf-dkb-pp-jerk przy pp.legs — sekcja Push Press', () => {
    const miejsce = (k: string, c: string, sid: string) => sentencesOf(k).find(r => r.c === c)!.s.find(([s]) => s === sid)![1];
    expect(miejsce('Kettlebell Snatch', 'kbb.bellSetup', 'barbend-kb-snatch')).toMatch(/progresji Kettlebell Swing/);
    for (const k of ['Double Kettlebell Push Press', 'One-Arm Kettlebell Push Press']) expect(miejsce(k, 'pp.legs', 'cf-dkb-pp-jerk')).toMatch(/^Push Press \(push the floor away/);
  });
});
