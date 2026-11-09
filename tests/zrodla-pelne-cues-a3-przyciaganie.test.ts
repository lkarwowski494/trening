/*
 * Partia A3 integracji badań (przyciąganie i ramiona: row, cable_row, pulldown, pull_up, shrug, back_extension, delt_raise, curl, triceps, rotator_cuff; linia 1.1, 09.11.2026):
 * karty własne z badań W1 (po przeliczeniu szczebli), W2 i „obowiązkowe 1.1” z 02.11.2026. Lista ćwiczeń, kart niepełnych, zdań, odrzuconych zdań i odwołań — tests/fixtures/cues-a3-przyciaganie.json.
 * Zakres strażnika źródeł (L-089): scripts/cues/gen.mjs `validate` (check:cues; MIN_ORGS = 2, MAX_COUNT_LEVEL = 4 — scripts/cues/gen.mjs:17 i :33) — ten plik sprawdza,
 * że dane A3 spełniają regułę bez wyjątków partii: każde zdanie ma ≥ 2 organizacje szczebla ≤ 4 (bez luk „praktyka” i bez błędów „wniosek”), źródła szczebla 5 albo
 * o nierozstrzygniętym szczeblu nie weszły, pominięte ćwiczenia nie mają karty własnej, a karta Zottman Curl nie zmienia reguł sensu póz (plik wspólny silnika).
 * Rodzaje (docs/20): dane (karty, źródła), logika (≥ 2 organizacje), niezmienniki (bez „wniosek”, bez luk, reguły sensu bez zmian), języki (PL i EN; 33 języki — zestaw przekładu A3),
 * regresja (cue-sets: własne karty; pominięte bez karty własnej; karty ukryte do przekładu — karty_nowe).
 * Ocena realności: błąd „karta techniki z jednego źródła albo ze źródła szczebla 5” — realny (treść w aplikacji i na stronie z ćwiczeniami);
 * karty są ukryte do recenzji niezależnej i przekładu (bramka 4, L-047, karty_nowe) — nie sprawdzamy tu ich wyświetlania.
 */
import * as fs from 'fs';
import * as path from 'path';
import { CUE_DATA, CUE_SECTIONS } from '@/lib/cues';
import { CUE_FULL } from './zrodla-pelne';
import A3 from './fixtures/cues-a3-przyciaganie.json';

const root = path.join(__dirname, '..');
const json = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const pl: Record<string, string> = json('lib/cues/text/pl.json'), en: Record<string, string> = json('lib/cues/text/en.json');
const sets = json('lib/figures/v2/cue-sets.json').items as Record<string, { b: string }>;
const orgOf = (sid: string) => CUE_FULL.sources[sid].org;
/** Szczebel źródła: własny (organizacje warunkowe) albo szczebel organizacji — jak srcLevel() w scripts/cues/gen.mjs. */
const lv = (sid: string): number => CUE_FULL.sources[sid].level ?? CUE_FULL.orgs[orgOf(sid)].level;
const sentencesOf = (k: string) => CUE_SECTIONS.flatMap(s => CUE_FULL.exercises[k][s] ?? []);

/** Źródła szczebla 5 albo o szczeblu nierozstrzygniętym w docs/18 (blogi producentów wg uzupełnienia 3, Bells of Steel jak w A2, strona liny Fitness Volt „do decyzji” w W1). */
const NIEBYLE = ['bellsofsteel-seal-row', 'bellsofsteel-rear-delt-cable', 'majorfitness-smith-row', 'majorfitness-cable-rear-delt-row', 'ritfit-smith-row', 'rxsg-rope-foot-locks', 'fitnessvolt-cable-rear-delt-row-rope'];

describe('A3 przyciąganie: karty własne (09.11.2026)', () => {
  test('17 ćwiczeń ma komplet ustawienie + ruch w pełnych danych; w runtime ukryte (lista hidden) do przekładu i recenzji; nie są w otwartych; niepełne są na liście partial', () => {
    expect(A3.cwiczenia.length).toBe(17);
    for (const k of A3.cwiczenia) {
      const x = CUE_FULL.exercises[k];
      expect([k, (x.setup ?? []).length >= 1, (x.move ?? []).length >= 1, k in CUE_FULL.open]).toEqual([k, true, true, false]);
      expect([k, CUE_DATA.hidden.includes(k), k in CUE_DATA.exercises]).toEqual([k, true, false]);
      expect([k, (CUE_FULL.partial ?? []).includes(k)]).toEqual([k, (x.tips ?? []).length < 2]);
      for (const s of CUE_SECTIONS) expect([k, s, (CUE_FULL.exercises[k][s] ?? []).length <= 4]).toEqual([k, s, true]);
    }
    expect(A3.partial.length).toBe(13);
    expect([...A3.partial].sort()).toEqual(A3.cwiczenia.filter(k => (CUE_FULL.exercises[k].tips ?? []).length < 2).sort());
  });

  test('karty ukryte do przekładu: wszystkie 17 na liście karty_nowe (tests/recenzja-wyjatki-1-1.json), bez wpisu „karty” w docs/research/figury-recenzja.json (autor nie wpisuje recenzji, L-047)', () => {
    const wyj = json('tests/recenzja-wyjatki-1-1.json'), rec = json('docs/research/figury-recenzja.json');
    for (const k of A3.cwiczenia) expect([k, wyj.karty_nowe.includes(k), !!rec.karty?.[k]]).toEqual([k, true, false]);
  });

  test('cue-sets: 17 ćwiczeń ma własne karty (b = own); pominięte (bez ustawienia/ruchu, bez błędu przy pozach v2, wstrzymane) nie mają karty własnej', () => {
    for (const k of A3.cwiczenia) expect([k, sets[k].b]).toEqual([k, 'own']);
    const pominiete = [...A3.bezUstawieniaLubRuchu, ...A3.pominieteBezBledu, ...A3.wstrzymane.map(([k]) => k as string), ...(A3.konfliktPozy as unknown as [string, string[]][]).map(([k]) => k)];
    expect(pominiete.sort()).toEqual(['Cable Internal Rotation', 'Cable Rope Rear-Delt Rows', 'Lower Back Curl', 'Lying T-Bar Row', 'Reverse Hyperextension', 'Rope Climb', 'Seal Row (sztanga)', 'Single Arm Cable Row', 'Smith Machine Behind the Back Shrug', 'Smith Machine Bent Over Row']);
    for (const k of pominiete) expect([k, sets[k]?.b !== 'own', k in CUE_FULL.exercises, A3.cwiczenia.includes(k)]).toEqual([k, true, false, false]);
  });

  test('karta Zottman Curl zastąpiła zestaw ogólny bez zmiany reguł sensu póz: reguły przypisane jawnie w `warianty` (data/zrodla/figury-sens.json), plik wspólny silnika lib/figures/v2/reguly-cwiczen.json ma te same reguły co przed kartą', () => {
    expect(json('data/zrodla/figury-sens.json').rodziny.curl.warianty['Zottman Curl']).toEqual(['lokiec_zgina_sie', 'lokiec_przy_tulowiu', 'tulow_nieruchomy']);
    expect(json('lib/figures/v2/reguly-cwiczen.json').curl['Zottman Curl']).toEqual(['lokiec_zgina_sie', 'lokiec_przy_tulowiu', 'tulow_nieruchomy']);
  });
});

describe('A3 przyciąganie: źródła i reguły szczebli', () => {
  test('każde zdanie ma ≥ 2 różne organizacje szczebla ≤ 4; bez luk „praktyka” i bez „wniosek”', () => {
    for (const k of A3.cwiczenia) for (const r of sentencesOf(k)) {
      const orgs4 = new Set(r.s.filter(([sid]) => sid !== 'wniosek' && lv(sid) <= 4).map(([sid]) => orgOf(sid)));
      expect([k, r.c, orgs4.size >= 2]).toEqual([k, r.c, true]);
      expect([k, r.c, r.s.some(([sid]) => sid === 'wniosek'), CUE_FULL.luki?.[`${k}::${r.c}`]]).toEqual([k, r.c, false, undefined]);
    }
  });

  test('źródła szczebla 5 albo o nierozstrzygniętym szczeblu (blogi producentów, Bells of Steel, strona liny) nie są w danych; ich odwołania zapisane w fixture', () => {
    for (const sid of NIEBYLE) expect([sid, sid in CUE_FULL.sources]).toEqual([sid, false]);
    expect(new Set(A3.usunieteOdwolania.map(([, , sid]) => sid))).toEqual(new Set(NIEBYLE));
  });

  test('zdania odrzucone (mniej niż dwie organizacje, w tym błędy wnioskowane) nie są w kartach tych ćwiczeń; zdania tylko z odrzuconych kart nie weszły do słowników', () => {
    expect(A3.odrzucone.length).toBe(34);
    for (const [k, , c] of A3.odrzucone) if (A3.cwiczenia.includes(k as string)) expect([k, c, sentencesOf(k as string).some(r => r.c === c)]).toEqual([k, c, false]);
    for (const c of ['row.mis.chestOff', 'rdcr.mis.elbowsIn', 'lpd.mis.thighs', 'rope.mis.arms', 'curl2.mis.zottNoTurn', 'curl2.mis.preacherLift', 'rotator_cuff.mis.elbowOpens', 'rotator_cuff.mis.handsDrop', 'rotator_cuff.mis.elbowsDrop', 'lbc.mis.tooHigh', 'seal.setup', 'smith.rowSetup', 'rope.lock']) expect([c, c in pl, c in en]).toEqual([c, false, false]);
  });

  test('nowe źródła: adres https, organizacja z danych; organizacje warunkowe (Generation Iron, Healthline) — źródło ma własny szczebel 4 i opis strony', () => {
    expect(A3.noweZrodla.length).toBe(25);
    for (const sid of A3.noweZrodla) {
      const s = CUE_FULL.sources[sid] as { url?: string; org: string; level?: number; strona?: string };
      expect([sid, /^https:\/\//.test(s.url ?? ''), s.org in CUE_FULL.orgs]).toEqual([sid, true, true]);
      if (CUE_FULL.orgs[s.org].warunkowo) expect([sid, s.level, typeof s.strona]).toEqual([sid, 4, 'string']);
    }
    expect(A3.noweZrodla.filter(sid => CUE_FULL.orgs[orgOf(sid)].warunkowo).sort()).toEqual(['generationiron-meadows-row', 'healthline-seated-row']);
  });

  test('wariant sprzętu lub chwytu (źródła wersji bazowej) ma jawne „uproszczenie” przy zdaniu — do potwierdzenia przez recenzenta niezależnego (docs/18, 02.11.2026, pkt 2)', () => {
    for (const k of ['Bent Over Row (linki)', 'Shrugs (linki)', 'Leverage Shrug', 'V-Bar Pulldown']) for (const r of [...CUE_FULL.exercises[k].setup, ...CUE_FULL.exercises[k].move])
      expect([k, r.c, typeof (r as { uproszczenie?: string }).uproszczenie]).toEqual([k, r.c, 'string']);
  });
});

describe('A3 przyciąganie: zdania', () => {
  test('33 nowe zdania mają tekst PL i EN różny od siebie; wszystkie czekają na przekład w zestawie A3 (pozostałe języki — angielski w zastępstwie)', () => {
    expect(A3.zdania.length).toBe(33);
    for (const c of A3.zdania) expect([c, typeof pl[c], typeof en[c], pl[c].trim().length > 0, en[c].trim().length > 0, pl[c] !== en[c]]).toEqual([c, 'string', 'string', true, true, true]);
    const z = json('docs/lokalizacja/zestaw-przekladu-2026-11-09-a3-wskazowki.json');
    expect(z.klucze.map((x: { id: string }) => x.id)).toEqual([...A3.zdania].sort());
    for (const x of z.klucze as { id: string; pl: string; en: string }[]) expect([x.id, x.pl, x.en]).toEqual([x.id, pl[x.id], en[x.id]]);
  });

  test('teksty: bez cyfr, bez twierdzeń o bólu i zdrowiu, bez nazw źródeł i marek', () => {
    for (const c of A3.zdania) for (const t of [pl[c], en[c]]) {
      expect([c, /\d/.test(t)]).toEqual([c, false]);
      expect([c, /\b(boli|ból|bólu|kontuzj|pain|injur)/i.test(t)]).toEqual([c, false]);
      expect([c, /NASM|\bACE\b|ISSA|Catalyst|BarBend|Fitness Volt|Generation Iron|Healthline|HSS|AAOS|ExRx|WebMD/i.test(t)]).toEqual([c, false]);
    }
  });
});

describe('A3 przyciąganie: role mięśni z istniejących funkcji (09.11.2026; bez nowych tekstów UI)', () => {
  const rm = json('data/zrodla/role-miesni.json');
  test('Dead Hang → przedramiona: forearms.grip (główna); Lower Back Curl → dolny odcinek pleców: lower_back.spine_ext (główna); obie funkcje wyświetlane (dwa_zrodla)', () => {
    const reg = rm.nameRules.reguly as { muscle: string; roles: string[]; function: string; exercises: string[] }[];
    expect(reg.filter(r => r.exercises.includes('Dead Hang')).map(r => [r.muscle, r.roles, r.function])).toEqual([['forearms', ['main'], 'forearms.grip']]);
    expect(reg.filter(r => r.exercises.includes('Lower Back Curl')).map(r => [r.muscle, r.roles, r.function])).toEqual([['lower_back', ['main'], 'lower_back.spine_ext']]);
    for (const f of ['forearms.grip', 'lower_back.spine_ext']) expect([f, rm.functions[f].status]).toEqual([f, 'dwa_zrodla']);
  });
  test('rotator_cuff (5 ćwiczeń) bez ról w tej partii — nowe funkcje rotacji wymagają tekstów UI w 31 językach (otwarte); Scapular Pull-Up, Middle Back Shrug, Incline Shoulder Raise ×3 — otwarte w badaniach', () => {
    const reg = rm.nameRules.reguly as { function: string; exercises: string[] }[];
    for (const k of ['External Rotation (linki)', 'External Rotation (hantel)', 'External Rotation with Band', 'Internal Rotation with Band', 'Cable Internal Rotation', 'Scapular Pull-Up', 'Middle Back Shrug'])
      expect([k, reg.some(r => r.exercises.includes(k))]).toEqual([k, false]);
    expect(rm.functions['rear_delt.shoulder_er']).toBeUndefined();
    expect(rm.functions['front_delt.shoulder_ir']).toBeUndefined();
  });
});
