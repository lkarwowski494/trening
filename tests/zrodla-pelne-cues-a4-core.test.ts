/*
 * Partia A4a integracji badań (core: core_floor, core_standing, core_hang, carry; linia 1.1, 09.11.2026):
 * karty własne z badań W1 (po przeliczeniu szczebli), W2 i „obowiązkowe 1.1” z 02.11.2026. Lista ćwiczeń, kart niepełnych, zdań, odrzuconych zdań i odwołań — tests/fixtures/cues-a4-core.json.
 * Zakres strażnika źródeł (L-089): scripts/cues/gen.mjs `validate` (check:cues; MIN_ORGS = 2, MAX_COUNT_LEVEL = 4 — scripts/cues/gen.mjs:17 i :33) — ten plik sprawdza,
 * że dane A4a spełniają regułę bez wyjątków partii: każde zdanie ma ≥ 2 organizacje szczebla ≤ 4 (bez luk „praktyka” i bez błędów „wniosek”), źródła szczebla 5 albo
 * o nierozstrzygniętym szczeblu nie weszły, pominięte ćwiczenia nie mają karty własnej, a karty nie zmieniają pliku wspólnego silnika rysunku (reguły sensu póz).
 * Rodzaje (docs/20): dane (karty, źródła), logika (≥ 2 organizacje), niezmienniki (bez „wniosek”, bez luk), języki (PL i EN; 33 języki — zestaw przekładu A4),
 * regresja (cue-sets: własne karty; pominięte bez karty własnej; karty ukryte do przekładu — karty_nowe; zdanie osierocone vup.back usunięte).
 * Ocena realności: błąd „karta techniki z jednego źródła albo ze źródła szczebla 5” — realny (treść w aplikacji i na stronie z ćwiczeniami);
 * karty są ukryte do recenzji niezależnej i przekładu (bramka 4, L-047, karty_nowe) — nie sprawdzamy tu ich wyświetlania.
 */
import * as fs from 'fs';
import * as path from 'path';
import { CUE_DATA, CUE_SECTIONS, cueDict } from '@/lib/cues';
import { LANGS } from '@/lib/i18n';
import { CUE_FULL } from './zrodla-pelne';
import A4 from './fixtures/cues-a4-core.json';

const root = path.join(__dirname, '..');
const json = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const pl: Record<string, string> = json('lib/cues/text/pl.json'), en: Record<string, string> = json('lib/cues/text/en.json');
const sets = json('lib/figures/v2/cue-sets.json').items as Record<string, { b: string }>;
const orgOf = (sid: string) => CUE_FULL.sources[sid].org;
/** Szczebel źródła: własny (organizacje warunkowe) albo szczebel organizacji — jak srcLevel() w scripts/cues/gen.mjs. */
const lv = (sid: string): number => CUE_FULL.sources[sid].level ?? CUE_FULL.orgs[orgOf(sid)].level;
const sentencesOf = (k: string) => CUE_SECTIONS.flatMap(s => CUE_FULL.exercises[k][s] ?? []);
const NIEBYLE = Object.keys(A4.niebyle);

describe('A4a core: karty własne (09.11.2026)', () => {
  test('17 ćwiczeń ma komplet ustawienie + ruch w pełnych danych; w runtime ukryte (lista hidden) do przekładu i recenzji; nie są w otwartych; niepełne są na liście partial', () => {
    expect(A4.cwiczenia.length).toBe(17);
    for (const k of A4.cwiczenia) {
      const x = CUE_FULL.exercises[k];
      expect([k, (x.setup ?? []).length >= 1, (x.move ?? []).length >= 1, k in CUE_FULL.open]).toEqual([k, true, true, false]);
      expect([k, CUE_DATA.hidden.includes(k), k in CUE_DATA.exercises]).toEqual([k, true, false]);
      expect([k, (CUE_FULL.partial ?? []).includes(k)]).toEqual([k, (x.tips ?? []).length < 2]);
      for (const s of CUE_SECTIONS) expect([k, s, (CUE_FULL.exercises[k][s] ?? []).length <= 4]).toEqual([k, s, true]);
    }
    expect(A4.partial.length).toBe(11);
    expect([...A4.partial].sort()).toEqual(A4.cwiczenia.filter(k => (CUE_FULL.exercises[k].tips ?? []).length < 2).sort());
  });

  test('karty ukryte do przekładu: wszystkie 17 na liście karty_nowe (tests/recenzja-wyjatki-1-1.json), bez wpisu „karty” w docs/research/figury-recenzja.json (autor nie wpisuje recenzji, L-047)', () => {
    const wyj = json('tests/recenzja-wyjatki-1-1.json'), rec = json('docs/research/figury-recenzja.json');
    for (const k of A4.cwiczenia) expect([k, wyj.karty_nowe.includes(k), !!rec.karty?.[k]]).toEqual([k, true, false]);
  });

  test('cue-sets: 17 ćwiczeń ma własne karty (b = own); pominięte (bez ustawienia/ruchu, bez błędu przy pozach v2) nie mają karty własnej', () => {
    for (const k of A4.cwiczenia) expect([k, sets[k].b]).toEqual([k, 'own']);
    const pominiete = [...A4.bezUstawieniaLubRuchu, ...A4.pominieteBezBledu].sort();
    expect(pominiete).toEqual(['Alternate Heel Touchers', 'Barbell Side Bend', 'Bicycle Crunch', 'Cable Reverse Crunch', 'Cable Woodchop', 'Cross-Body Crunch', 'Crunch - Hands Overhead',
      'Crunch - Legs On Exercise Ball', 'Decline Crunch', 'Decline Reverse Crunch', "Farmer's Walk (Farmers Handles)", "Farmer's Walk (trap bar)", 'GHD Sit Up', 'L-Sit', 'Landmine Rotation',
      'Overhead Carry (hantle)', 'Pallof Press With Rotation', 'Side Bend (hantel)', 'Stability Ball Crunch']);
    for (const k of pominiete) expect([k, sets[k]?.b !== 'own', k in CUE_FULL.exercises, A4.cwiczenia.includes(k)]).toEqual([k, true, false, false]);
  });

  test('Double Kettlebell Windmill ma własne id zdań o dwóch kettlebellach (dblSetup, dblMove, mis.topElbow) — nie dzieli brzmienia z kartą jednego kettlebella', () => {
    const ids = (k: string) => sentencesOf(k).map(r => r.c);
    expect(ids('Double Kettlebell Windmill')).toEqual(expect.arrayContaining(['core_standing.windmill.dblSetup', 'core_standing.windmill.dblMove', 'core_standing.windmill.mis.topElbow']));
    expect(ids('Kettlebell Windmill')).toEqual(expect.arrayContaining(['core_standing.windmill.setup', 'core_standing.windmill.move', 'core_standing.windmill.mis.elbow']));
    expect(ids('Double Kettlebell Windmill').some(c => ['core_standing.windmill.setup', 'core_standing.windmill.move'].includes(c))).toBe(false);
    expect(/każdej ręki|each hand/.test(pl['core_standing.windmill.dblSetup'] + en['core_standing.windmill.dblSetup'])).toBe(true);
  });

  test('Machine Crunch: instrukcja maszyny jednego producenta przy maszynie ogólnej — każde zdanie z jawnym „uproszczeniem” do potwierdzenia przez recenzenta', () => {
    for (const r of sentencesOf('Machine Crunch')) expect([r.c, typeof (r as { uproszczenie?: string }).uproszczenie]).toEqual([r.c, 'string']);
  });

  test('karty zastąpiły zestawy ogólne, z których brały się reguły sensu póz core_floor — te same reguły przypisane jawnie w `warianty` (data/zrodla/figury-sens.json; stan przed kartami, a2db6739)', () => {
    expect(Object.fromEntries(['Cable Crunch', 'Hollow Hold', 'Machine Crunch', 'Scissor Kick', 'Sit Up', 'Suspended Reverse Crunch', 'Tuck Crunch'].map(k => [k, json('data/zrodla/figury-sens.json').rodziny.core_floor.warianty[k]]))).toEqual({
      'Cable Crunch': ['tulow_zwija_sie_biodra_stoja'], 'Hollow Hold': ['miednica_na_podlodze'], 'Machine Crunch': ['tulow_zwija_sie_biodra_stoja'], 'Scissor Kick': ['miednica_na_podlodze'], 'Sit Up': ['szyja_neutralna'],
      'Suspended Reverse Crunch': ['miednica_unosi_sie', 'kolana_ku_barkom'], 'Tuck Crunch': ['szyja_neutralna', 'miednica_na_podlodze'],
    });
  });

  test('plik wspólny silnika rysunku bez zmian: reguły sensu póz tych ćwiczeń nie zależą od zestawu ogólnego (lib/figures/v2/reguly-cwiczen.json bez reguł dla kart A4a spoza wariantów)', () => {
    const reg = json('lib/figures/v2/reguly-cwiczen.json') as Record<string, Record<string, string[]>>;
    const sens = json('data/zrodla/figury-sens.json').rodziny as Record<string, { warianty?: Record<string, string[]> }>;
    for (const [fam, m] of Object.entries(reg)) for (const k of A4.cwiczenia) if (k in m) expect([fam, k, m[k]]).toEqual([fam, k, sens[fam]?.warianty?.[k] ?? m[k]]);
  });
});

describe('A4a core: źródła i reguły szczebli', () => {
  test('każde zdanie ma ≥ 2 różne organizacje szczebla ≤ 4; bez luk „praktyka” i bez „wniosek”', () => {
    for (const k of A4.cwiczenia) for (const r of sentencesOf(k)) {
      const orgs4 = new Set(r.s.filter(([sid]) => sid !== 'wniosek' && lv(sid) <= 4).map(([sid]) => orgOf(sid)));
      expect([k, r.c, orgs4.size >= 2]).toEqual([k, r.c, true]);
      expect([k, r.c, r.s.some(([sid]) => sid === 'wniosek'), CUE_FULL.luki?.[`${k}::${r.c}`]]).toEqual([k, r.c, false, undefined]);
    }
  });

  test('webmd.com (V-Up) należy do organizacji WebMD Ignite (jedna organizacja z Healthwise, StayWell, ColumbiaDoctors — ustalenie z 02.11.2026); osobnej organizacji WebMD nie ma', () => {
    expect(orgOf('webmd-v-ups')).toBe('WebMD Ignite');
    expect('WebMD' in CUE_FULL.orgs).toBe(false);
  });

  test('źródła szczebla 5 albo o nierozstrzygniętym szczeblu (Speediance, FIG, NFPT bez biogramu na stronie, Fitness Volt bez nazwiska autora, Institute of Motion) nie są w danych; ich odwołania zapisane w fixture', () => {
    expect(NIEBYLE.sort()).toEqual(['fig-a202', 'fitnessvolt-bb-side-bend', 'fv-heel-touchers', 'iom-lx48264v', 'nfpt-stability-ball-crunch', 'speediance-pallof-training']);
    for (const sid of NIEBYLE) expect([sid, sid in CUE_FULL.sources]).toEqual([sid, false]);
    expect(new Set(A4.usunieteOdwolania.map(([, , sid]) => sid))).toEqual(new Set(NIEBYLE));
  });

  test('zdania odrzucone (mniej niż dwie organizacje, w tym błędy wnioskowane) nie są w kartach tych ćwiczeń; zdania tylko z odrzuconych kart nie weszły do słowników', () => {
    expect(A4.odrzucone.length).toBe(34);
    for (const [k, , c] of A4.odrzucone) if (A4.cwiczenia.includes(k as string)) expect([k, c, sentencesOf(k as string).some(r => r.c === c)]).toEqual([k, c, false]);
    for (const c of ['core_floor.ballSetup', 'core_floor.mis.ghdDeep', 'core_floor.mis.thighsPast', 'core_standing.woodchop.setup', 'core_standing.sidebend.barSetup', 'core_standing.pallofrot.move', 'lsit.setup', 'ohc.setup', 'carry.mis.arms', 'core_standing.figure8.mis.straightLegs'])
      expect([c, c in pl, c in en]).toEqual([c, false, false]);
  });

  test('nowe źródła: adres https, organizacja z danych; organizacje warunkowe (Healthline) — źródło ma własny szczebel 4 i opis strony z nazwanym recenzentem', () => {
    expect(A4.noweZrodla.length).toBe(33);
    for (const sid of A4.noweZrodla) {
      const s = CUE_FULL.sources[sid] as { url?: string; org: string; level?: number; strona?: string };
      expect([sid, /^https:\/\//.test(s.url ?? ''), s.org in CUE_FULL.orgs]).toEqual([sid, true, true]);
      if (CUE_FULL.orgs[s.org].warunkowo) expect([sid, s.level, typeof s.strona]).toEqual([sid, 4, 'string']);
    }
    expect(A4.noweZrodla.filter(sid => CUE_FULL.orgs[orgOf(sid)].warunkowo).sort()).toEqual(['healthline-hkr', 'healthline-scissor-kicks', 'healthline-stomach-vacuum']);
    expect(A4.noweOrganizacje.sort()).toEqual(['Hoist Fitness', 'Virginia Mason Franciscan Health']);
  });
});

describe('A4a core: zdania', () => {
  test('50 nowych zdań ma tekst PL i EN różny od siebie; wszystkie czekają na przekład w zestawie A4 (pozostałe języki — angielski w zastępstwie)', () => {
    expect(A4.zdania.length).toBe(50);
    for (const c of A4.zdania) expect([c, typeof pl[c], typeof en[c], pl[c].trim().length > 0, en[c].trim().length > 0, pl[c] !== en[c]]).toEqual([c, 'string', 'string', true, true, true]);
    const z = json('docs/lokalizacja/zestaw-przekladu-2026-11-09-a4-wskazowki.json');
    expect(z.klucze.map((x: { id: string }) => x.id)).toEqual([...A4.zdania].sort());
    for (const x of z.klucze as { id: string; pl: string; en: string }[]) expect([x.id, x.pl, x.en]).toEqual([x.id, pl[x.id], en[x.id]]);
  });

  test('teksty: bez cyfr, bez twierdzeń o bólu i zdrowiu, bez nazw źródeł i marek', () => {
    for (const c of A4.zdania) for (const t of [pl[c], en[c]]) {
      expect([c, /\d/.test(t)]).toEqual([c, false]);
      expect([c, /\b(boli|ból|bólu|kontuzj|pain|injur)/i.test(t)]).toEqual([c, false]);
      expect([c, /NASM|\bACE\b|ISSA|Catalyst|BarBend|Fitness Volt|Healthline|CrossFit|Cleveland|WebMD|Hoist|TRX|StrongFirst|Life Time|Virginia Mason/i.test(t)]).toEqual([c, false]);
    }
  });

  test('zdanie zestawu ogólnego V-Up (vup.back) osierocone po karcie własnej — usunięte ze wszystkich słowników i z rejestru zestawów (precedens ur.height, 04.11.2026)', () => {
    for (const l of LANGS) expect([l, Object.prototype.hasOwnProperty.call(cueDict(l), 'vup.back')]).toEqual([l, false]);
    expect('vup.back' in json('data/zrodla/cues-zestawy.json').wskazowki).toBe(false);
  });
});

describe('A4a core: role mięśni z istniejących funkcji (09.11.2026; bez nowych tekstów UI)', () => {
  const rm = json('data/zrodla/role-miesni.json');
  const reg = rm.nameRules.reguly as { muscle: string; roles: string[]; function: string; exercises: string[] }[];
  test('Superman → dolny odcinek pleców: lower_back.spine_ext (główna), pośladki: glutes.hip_ext (pomocnicza); funkcje wyświetlane', () => {
    expect(reg.filter(r => r.exercises.includes('Superman')).map(r => [r.muscle, r.roles, r.function])).toEqual([['lower_back', ['main'], 'lower_back.spine_ext'], ['glutes', ['aux'], 'glutes.hip_ext']]);
    for (const f of ['lower_back.spine_ext', 'glutes.hip_ext']) expect([f, ['dwa_zrodla', 'ustalone'].includes(rm.functions[f].status)]).toEqual([f, true]);
  });
  test('otwarte w tej partii: nowe funkcje (abs.brace, obliques.antirotation, obliques.side_bend) wymagają tekstów UI w 31 językach; abs.antilordosis zostaje jedno_zrodlo (Scissor Kick w noRole)', () => {
    for (const f of ['abs.brace', 'obliques.antirotation', 'obliques.side_bend']) expect([f, rm.functions[f]]).toEqual([f, undefined]);
    expect(rm.functions['abs.antilordosis'].status).toBe('jedno_zrodlo');
    expect(rm.exceptions.noRole.map((x: { exercise: string }) => x.exercise)).toContain('Scissor Kick');
  });
});
