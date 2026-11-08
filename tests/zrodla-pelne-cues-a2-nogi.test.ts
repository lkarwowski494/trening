/*
 * Partia A2 integracji badań (nogi i biodra: calf_raise, glute_floor, hip_abd_add, hip_bridge, leg_isolation, leg_machine, lunge; linia 1.1, 08.11.2026):
 * karty własne z badań W1 (po przeliczeniu szczebli) i W2 z 02.11.2026. Lista ćwiczeń, kart niepełnych, zdań, odrzuconych zdań i odwołań — tests/fixtures/cues-a2-nogi.json.
 * Zakres strażnika źródeł (L-089): scripts/cues/gen.mjs `validate` (check:cues; MIN_ORGS = 2, MAX_COUNT_LEVEL = 4 — scripts/cues/gen.mjs:17 i :33) — ten plik sprawdza,
 * że dane A2 spełniają regułę bez wyjątków partii: każde zdanie ma ≥ 2 organizacje szczebla ≤ 4 (bez luk „praktyka” i bez błędów „wniosek”), źródła o nierozstrzygniętym
 * szczeblu nie weszły, a pominięte ćwiczenia nie mają karty własnej.
 * Rodzaje (docs/20): dane (karty, źródła), logika (≥ 2 organizacje), niezmienniki (bez „wniosek”, bez luk), języki (PL i EN; 33 języki — zestaw przekładu A2),
 * regresja (cue-sets: własne karty; pominięte bez karty własnej; Hack Squat zastąpiony bez osieroconego zdania).
 * Ocena realności: błąd „karta techniki z jednego źródła albo ze źródła szczebla 5” — realny (treść w aplikacji i na stronie z ćwiczeniami);
 * karty są ukryte do recenzji niezależnej (bramka 4, L-047) — nie sprawdzamy tu ich wyświetlania.
 */
import * as fs from 'fs';
import * as path from 'path';
import { CUE_DATA, CUE_SECTIONS } from '@/lib/cues';
import { CUE_FULL } from './zrodla-pelne';
import A2 from './fixtures/cues-a2-nogi.json';

const root = path.join(__dirname, '..');
const json = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const pl: Record<string, string> = json('lib/cues/text/pl.json'), en: Record<string, string> = json('lib/cues/text/en.json');
const sets = json('lib/figures/v2/cue-sets.json').items as Record<string, { b: string }>;
const orgOf = (sid: string) => CUE_FULL.sources[sid].org;
/** Szczebel źródła: własny (organizacje warunkowe) albo szczebel organizacji — jak srcLevel() w scripts/cues/gen.mjs. */
const lv = (sid: string): number => CUE_FULL.sources[sid].level ?? CUE_FULL.orgs[orgOf(sid)].level;
const sentencesOf = (k: string) => CUE_SECTIONS.flatMap(s => CUE_FULL.exercises[k][s] ?? []);

/** Źródła o szczeblu nierozstrzygniętym w docs/18 do 08.11.2026 — nie wchodzą do danych (pytanie P3 do koordynatora linii 1.1). */
const WARUNKOWE = ['ama-curtsy', 'canfitpro-curtsey', 'bos-hip-thrust-machine', 'rts-valslide-leg-curl', 'nfpt-leg-extensions'];

describe('A2 nogi: karty własne', () => {
  test('20 ćwiczeń ma komplet ustawienie + ruch w pełnych danych i w runtime (widoczne albo ukryte do recenzji); nie są w otwartych; niepełne są na liście partial', () => {
    expect(A2.cwiczenia.length).toBe(20);
    for (const k of A2.cwiczenia) {
      const x = CUE_FULL.exercises[k];
      expect([k, (x.setup ?? []).length >= 1, (x.move ?? []).length >= 1, k in CUE_FULL.open]).toEqual([k, true, true, false]);
      expect(CUE_DATA.exercises[k] ?? CUE_DATA.hidden.includes(k)).toBeTruthy();
      expect([k, (CUE_FULL.partial ?? []).includes(k)]).toEqual([k, (x.tips ?? []).length < 2]);
      for (const s of CUE_SECTIONS) expect([k, s, (CUE_FULL.exercises[k][s] ?? []).length <= 4]).toEqual([k, s, true]);
    }
    expect(A2.partial.length).toBe(13);
    expect([...A2.partial].sort()).toEqual(A2.cwiczenia.filter(k => (CUE_FULL.exercises[k].tips ?? []).length < 2).sort());
  });

  test('cue-sets: 20 ćwiczeń ma własne karty (b = own); pominięte (bez ustawienia/ruchu, bez błędu przy pozach v2 albo z animowanym błędem póz spoza karty — partia figur B2) nie mają karty własnej', () => {
    for (const k of A2.cwiczenia) expect([k, sets[k].b]).toEqual([k, 'own']);
    const pominiete = [...A2.bezUstawieniaLubRuchu, ...A2.pominieteBezBledu, ...A2.konfliktPozy.map(([k]) => k as string)];
    expect(pominiete.sort()).toEqual(['Barbell Step Up', 'Barbell Walking Lunge', 'Bulgarian Split Squat (sztanga)', 'Cable Hip Adduction', 'Curtsy Lunge', 'Lunges (sztanga)', 'Machine Hip Thrust', 'Single-Leg Leg Extension', 'Slider Hamstring Curl', 'Smith Machine Bulgarian Split Squat', 'Smith Machine Hip Thrust', 'Split Squat']);
    for (const k of pominiete) expect([k, sets[k]?.b !== 'own', k in CUE_FULL.exercises, A2.cwiczenia.includes(k)]).toEqual([k, true, false, false]);
  });

  test('rodziny squat i hinge (ready, zrecenzowane zestawy ogólne) bez kart własnych z tej partii — pokrycie „Pełna karta” nie spada', () => {
    const fam = json('lib/figures/v2/cue-sets.json').items as Record<string, { b: string; f?: string }>;
    for (const k of ['Box Squat', 'Zercher Squat', 'Overhead Squat', 'Deficit Deadlift', 'Axle Deadlift', 'Clean Deadlift']) expect([k, fam[k].b]).toEqual([k, 'general']);
  });

  test('Hack Squat: karta „do poprawy” zastąpiona kartą W2 — ustawienie hack.setup2, błąd hack.mis.hips; stare zdanie hack.setup i źródło ExRx usunięte ze wszystkich słowników', () => {
    const h = CUE_FULL.exercises['Hack Squat'];
    expect(h.setup.map(r => r.c)).toEqual(['hack.setup2']);
    expect((h.mistakes ?? []).map(r => r.c)).toContain('hack.mis.hips');
    expect(CUE_FULL.sources['exrx-Quadriceps/SLHackSquat']).toBeUndefined();
    for (const f of fs.readdirSync(path.join(root, 'lib/cues/text'))) expect([f, 'hack.setup' in json(`lib/cues/text/${f}`)]).toEqual([f, false]);
  });
});

describe('A2 nogi: źródła i reguły szczebli', () => {
  test('każde zdanie ma ≥ 2 różne organizacje szczebla ≤ 4; bez luk „praktyka” i bez „wniosek”', () => {
    for (const k of A2.cwiczenia) for (const r of sentencesOf(k)) {
      const orgs4 = new Set(r.s.filter(([sid]) => sid !== 'wniosek' && lv(sid) <= 4).map(([sid]) => orgOf(sid)));
      expect([k, r.c, orgs4.size >= 2]).toEqual([k, r.c, true]);
      expect([k, r.c, r.s.some(([sid]) => sid === 'wniosek'), CUE_FULL.luki?.[`${k}::${r.c}`]]).toEqual([k, r.c, false, undefined]);
    }
  });

  test('źródła o nierozstrzygniętym szczeblu (AMA, canfitpro, Bells of Steel, Robertson Training Systems, strona NFPT o prostowaniu nóg) nie są w danych; ich odwołania zapisane w fixture', () => {
    for (const sid of WARUNKOWE) expect([sid, sid in CUE_FULL.sources]).toEqual([sid, false]);
    expect(new Set(A2.usunieteOdwolania.map(([, , sid]) => sid))).toEqual(new Set(WARUNKOWE));
  });

  test('zdania odrzucone (mniej niż dwie organizacje, w tym błędy wnioskowane) nie są w kartach tych ćwiczeń', () => {
    expect(A2.odrzucone.length).toBe(19);
    for (const [k, , c] of A2.odrzucone) if (A2.cwiczenia.includes(k as string)) expect([k, c, sentencesOf(k as string).some(r => r.c === c)]).toEqual([k, c, false]);
    for (const c of ['dk.mis.straight', 'clam.mis.feet', 'bw.mis.straight', 'bw.mis.narrow', 'hadd.mis.short', 'calf.mis.otherLeg', 'ht.machSetup', 'curtsy.move', 'lext.setup', 'lext.mis.back']) expect([c, c in pl, c in en]).toEqual([c, false, false]);
  });

  test('nowe źródła: adres https, organizacja z danych; bez organizacji warunkowych (Human Kinetics odpadł razem z kartą Barbell Step Up)', () => {
    expect(A2.noweZrodla.length).toBe(28);
    for (const sid of A2.noweZrodla) {
      const s = CUE_FULL.sources[sid];
      expect([sid, /^https:\/\//.test(s.url ?? ''), s.org in CUE_FULL.orgs]).toEqual([sid, true, true]);
    }
    for (const sid of A2.noweZrodla) expect([sid, CUE_FULL.orgs[CUE_FULL.sources[sid].org].warunkowo]).toEqual([sid, undefined]);
  });
});

describe('A2 nogi: zdania', () => {
  test('34 nowych zdań ma tekst PL i EN różny od siebie; wszystkie czekają na przekład w zestawie A2 (pozostałe języki — angielski w zastępstwie)', () => {
    expect(A2.zdania.length).toBe(34);
    for (const c of A2.zdania) expect([c, typeof pl[c], typeof en[c], pl[c].trim().length > 0, en[c].trim().length > 0, pl[c] !== en[c]]).toEqual([c, 'string', 'string', true, true, true]);
    const z = json('docs/lokalizacja/zestaw-przekladu-2026-11-08-a2-wskazowki.json');
    expect(z.klucze.map((x: { id: string }) => x.id)).toEqual([...A2.zdania].sort());
    for (const x of z.klucze as { id: string; pl: string; en: string }[]) expect([x.id, x.pl, x.en]).toEqual([x.id, pl[x.id], en[x.id]]);
  });

  test('teksty: bez cyfr, bez twierdzeń o bólu i zdrowiu, bez nazw źródeł i marek', () => {
    for (const c of A2.zdania) for (const t of [pl[c], en[c]]) {
      expect([c, /\d/.test(t)]).toEqual([c, false]);
      expect([c, /\b(boli|ból|bólu|kontuzj|pain|injur)/i.test(t)]).toEqual([c, false]);
      expect([c, /NASM|\bACE\b|ISSA|NFPT|NCSF|NISMAT|NSCA|Catalyst|BarBend|Bodylastics|Hoist|Thera-?Band|HSS|ExRx|Human Kinetics/i.test(t)]).toEqual([c, false]);
    }
  });
});

describe('A2 nogi: narzędzia figur widzą kartę ukrytą do recenzji (scripts/figures/v2-sens.mjs kartaWlasna, 08.11.2026)', () => {
  const { execFileSync } = require('child_process') as typeof import('child_process');
  const R = JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import { kartaWlasna, wskazowkiCwiczenia } from ${JSON.stringify(path.join(root, 'scripts/figures/v2-sens.mjs'))};
import { bledyCwiczenia } from ${JSON.stringify(path.join(root, 'scripts/figures/v2-validate.mjs'))};
const ids = (k) => k ? Object.values(k).flat().map((x) => x.c) : null;
console.log(JSON.stringify({ ukryta: ids(kartaWlasna('Smith Machine Calf Raise')), bledy: bledyCwiczenia('Smith Machine Calf Raise'), widoczna: ids(kartaWlasna('Back Squat')) !== null, brak: kartaWlasna('Ćwiczenie bez karty'), ogolny: wskazowkiCwiczenia('Stability Ball Hamstring Curl') }));`], { encoding: 'utf8' }));
  test('karta ukryta (lista hidden) — z pełnych danych; karta widoczna — z runtime; brak karty — null; zestaw ogólny bez zmian', () => {
    expect(CUE_DATA.hidden).toContain('Smith Machine Calf Raise');
    expect(R.ukryta).toEqual(CUE_SECTIONS.flatMap(s => (CUE_FULL.exercises['Smith Machine Calf Raise'][s] ?? []).map(r => r.c)));
    expect(R.bledy).toEqual(['calf.mis.partial']);
    expect([R.widoczna, R.brak]).toEqual([true, null]);
    expect(R.ogolny).toEqual(json('lib/figures/v2/cue-sets.json').items['Stability Ball Hamstring Curl'].ok.concat(json('lib/figures/v2/cue-sets.json').items['Stability Ball Hamstring Curl'].err ?? []));
  });
});

describe('A2 nogi: poprawki recenzji niezależnej (08.11.2026, runda 1: badacz i lokalizacja PL/EN)', () => {
  test('Band Calf Raise: guma pod przednią częścią stóp (blokujące); karta jednonóż siedząc ma zdanie w liczbie pojedynczej (calf.seatedEdge1)', () => {
    expect(pl['calf.band']).toMatch(/przednią częścią stóp na gumie/); expect(en['calf.band']).toMatch(/Stand on the band/);
    expect(CUE_FULL.exercises['Dumbbell Seated One-Leg Calf Raise'].setup.map(r => r.c)).toEqual(['calf.seatedEdge1']);
    expect(pl['calf.seatedEdge1']).toMatch(/ugiętym kolanem.*stopy.*piętę/);
    for (const k of ['Seated Calf Raise (hantle)', 'Barbell Seated Calf Raise']) expect(CUE_FULL.exercises[k].setup.map(r => r.c)).toContain('calf.seatedEdge');
  });
  test('słownik (08.11.2026): „miniguma” zamiast „mała guma”, błąd prasy „w przeproście”, nie „w pełnym wyproście”', () => {
    for (const [id, t] of Object.entries(pl)) { expect([id, /mał(a|ą|ej) gum/i.test(t)]).toEqual([id, false]); expect([id, /blokow\w* kolan\w* w pełnym wyproście/i.test(t)]).toEqual([id, false]); }
    expect(pl['hexb.setup']).toMatch(/minigumę/); expect(pl['lp.mis.lock']).toMatch(/przeproście/);
  });
  test('miejsca źródeł poprawione: HSS przy hext.mis.arch bez nieistniejącej sekcji „Cautions”; linia barki–biodra–kolana przy gb.move na NASM, nie na ACE 49', () => {
    for (const k of ['Cable Kickback', 'Hip Extension with Bands']) for (const r of CUE_FULL.exercises[k].mistakes) for (const [sid, at] of r.s) if (sid === 'hss-mini-band-hip-ext') expect([k, /Cautions/.test(at)]).toEqual([k, false]);
    const gb = CUE_FULL.exercises['Glute Bridge (sztanga)'].move.find(r => r.c === 'gb.move')!;
    expect(gb.s.find(([sid]) => sid === 'ace-49')![1]).not.toMatch(/linia/);
    expect(gb.s.find(([sid]) => sid === 'nasm-floor-bridge')![1]).toMatch(/linia/);
    expect(CUE_FULL.sources['nsca-scj-hip-thrust'].title).toMatch(/Strength and Conditioning Journal 33\(5\):58–61/);
  });
});
