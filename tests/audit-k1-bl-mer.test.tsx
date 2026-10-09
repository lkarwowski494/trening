/*
 * Audyt kontrolny 1 — backlog obszarów MER i A11 (0.10.1; raporty audytorów: scratchpad koordynatora, docs/25 sekcja „Audyt kontrolny 1”).
 * MER2-07 (= SEC2-02, decyzja właściciela 09.10 ok. 11:40, wariant A): podpis pod wskazówkami techniki bez nazw organizacji i marek
 * („Na podstawie: biblioteki ćwiczeń organizacji szkoleniowych, …”), pełna lista źródeł w docs/research/27.
 * Rodzaje (docs/20): dane (rodzaj każdej organizacji źródeł), logika (cueBasis), ekran (stopka), języki (25 słowników i wskazówki bez nazw),
 * regresja (nazwy nie wracają do tekstów aplikacji).
 */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { CUE_DATA, cueBasis, cueDict, CUE_BASIS_KINDS } from '@/lib/cues';
import { ExerciseCues } from '@/components/ExerciseCues';
import { LANGS, applyLang, t, exName } from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import * as store from '@/lib/store';
import { fresh, saved, addWorkout, ex } from './helpers';
import { renderApp, flushAll, act, screen as appScreen } from './app';

const root = path.join(__dirname, '..');
const lib = (key: string) => ({ lib: true as const, libKey: key });
afterEach(() => { applyLang('pl'); });

/** Nazwy organizacji i marek źródeł wskazówek — tylko w docs/research/27 (zasada właściciela 09.10.2026: nazwy innych firm nie w tekstach aplikacji). */
const SOURCE_NAMES = /\b(ACE|NASM|ExRx|Stronger by Science|Concept ?2|acefitness|nasm\.org)\b/i;

describe('MER2-07: podpis wskazówek bez nazw organizacji i marek', () => {
  beforeEach(async () => { await fresh(); });
  test('dane: każda organizacja źródeł ma rodzaj (organizacja szkoleniowa, serwis, producent, badanie); cueBasis — rodzaje w stałej kolejności, bez powtórzeń', () => {
    for (const [id, o] of Object.entries(CUE_DATA.orgs)) expect([id, (CUE_BASIS_KINDS as readonly string[]).includes(o.kind)]).toEqual([id, true]);
    expect(cueBasis('Rowing Machine')).toEqual(['org', 'maker']);
    expect(cueBasis('Back Squat')).toEqual(['org', 'site', 'study']);
    expect(cueBasis('Sumo Deadlift')).toEqual(['site']);
    expect(cueBasis('xyz')).toEqual([]);
    for (const k of Object.keys(CUE_DATA.exercises)) { const b = cueBasis(k); expect(b.length).toBeGreaterThan(0); expect([...b].sort((x, y) => CUE_BASIS_KINDS.indexOf(x) - CUE_BASIS_KINDS.indexOf(y))).toEqual(b); }
  });
  test('ekran: stopka opisuje rodzaje źródeł ogólnie (PL i EN), bez nazw; nadal „Własne sformułowania”', () => {
    render(<ExerciseCues exercise={lib('Rowing Machine')} />);
    fireEvent.press(screen.getByRole('button', { name: 'Technika' }));
    expect(screen.getByText('Na podstawie: biblioteki ćwiczeń organizacji szkoleniowych, materiały producenta sprzętu. Własne sformułowania.')).toBeTruthy();
    render(<ExerciseCues exercise={lib('Back Squat')} />); fireEvent.press(screen.getByRole('button', { name: 'Technika' }));
    expect(screen.getByText('Na podstawie: biblioteki ćwiczeń organizacji szkoleniowych, specjalistyczne serwisy treningowe, badania naukowe. Własne sformułowania.')).toBeTruthy();
    applyLang('en'); render(<ExerciseCues exercise={lib('Back Squat')} />);
    fireEvent.press(screen.getByRole('button', { name: 'Technique' }));
    expect(screen.getByText('Based on: exercise libraries of fitness education organisations, specialist training websites, scientific studies. Our own wording.')).toBeTruthy();
  });
  test('regresja: żaden tekst aplikacji (słownik EN, 24 słowniki, wskazówki 26 języków, podpis każdego ćwiczenia w każdym języku) nie zawiera nazw źródeł', () => {
    const bad: string[] = [];
    for (const [k, v] of Object.entries(EN)) if (SOURCE_NAMES.test(k) || SOURCE_NAMES.test(v)) bad.push(`en: ${k}`);
    for (const [l, d] of Object.entries(LOCALES)) for (const [k, v] of Object.entries(d ?? {})) if (SOURCE_NAMES.test(v)) bad.push(`${l}: ${k}`);
    for (const l of LANGS) for (const [id, v] of Object.entries(cueDict(l))) if (SOURCE_NAMES.test(v)) bad.push(`cue ${l}: ${id}`);
    for (const l of LANGS) { applyLang(l); for (const k of Object.keys(CUE_DATA.exercises)) { const { unmount } = render(<ExerciseCues exercise={lib(k)} />); fireEvent.press(screen.getByRole('button', { name: t('Technika') })); for (const x of screen.UNSAFE_root.findAll((n: { type: unknown }) => n.type === 'Text')) { const s = JSON.stringify(x.props.children); if (SOURCE_NAMES.test(s)) bad.push(`${l} ${k}: ${s.slice(0, 60)}`); } unmount(); } }
    expect(bad).toEqual([]);
    /* bramka działa: nazwy są w dokumencie źródeł (docs/research/27), tylko nie w aplikacji */
    expect(SOURCE_NAMES.test(fs.readFileSync(path.join(root, 'docs/research/27-wskazowki-zrodla.md'), 'utf8'))).toBe(true);
    expect(fs.readFileSync(path.join(root, 'components/ExerciseCues.tsx'), 'utf8')).not.toMatch(/c\.orgs|cueOrgs/);
  });
});

/*
 * MER2-08 (= rekomendacja MER-14): w skali RIR wpis 0–5; więcej niż 5 powtórzeń w zapasie = „lekko”. Helms i in. 2016 (PMC4961270): poniżej RPE 5
 * skala opisuje wysiłek słowami („1–2 RPE = ‘little to no effort,’ 3–4 RPE = ‘light effort’”), nie powtórzeniami w zapasie — RIR 6–9 nie
 * przeliczamy już na RPE 4–1. Zapis „lekko” = RPE_LIGHT (4, górna granica „light effort”); w RIR pokazywane jako „6+”.
 */
describe('MER2-08: RIR > 5 = „lekko”', () => {
  const scale = (v: 'rpe' | 'rir') => { const st = store.getState(); st.settings.showRpe = true; st.settings.effortScale = v; store.save(); };
  beforeEach(async () => { await fresh(); });
  test('logika: RIR 0–5 = 10 − RPE; RIR > 5 zapisuje RPE_LIGHT; RPE < 5 pokazuje się w RIR jako RIR_MAX + 1 („6+”); RPE bez zmian', () => {
    expect([store.RIR_MAX, store.RPE_LIGHT]).toEqual([5, 4]);
    scale('rir');
    expect([0, 2, 5, 5.5, 6, 9, 12].map(v => store.effortIn(v))).toEqual([10, 8, 5, 4, 4, 4, 4]);
    expect([10, 8, 5, 4.5, 4, 1].map(r => store.effortOut(r))).toEqual([0, 2, 5, 6, 6, 6]);
    expect([5, 4, 1].map(r => store.effortText(r))).toEqual(['5', '6+', '6+']);
    expect([store.effortField(4), store.effortField('')]).toEqual([6, '']);
    /* niezmiennik: RIR 0–5 co 0,5 → RPE → RIR bez zmian; „lekko” → RPE_LIGHT → „lekko” */
    for (let v = 0; v <= 5; v += 0.5) expect(store.effortOut(store.effortIn(v) as number)).toBe(v);
    expect(store.effortIn(store.effortOut(store.RPE_LIGHT))).toBe(store.RPE_LIGHT);
    scale('rpe'); expect([store.effortIn(3), store.effortOut(3), store.effortText(3), store.effortText(7.5)]).toEqual([3, 3, '3', '7,5']);
  });
  test('opis serii i ekran historii: RPE 3 w skali RIR — „RIR 6+”', async () => {
    const w = addWorkout(Date.now() - 864e5, [['Back Squat', [{ weight: 100, reps: 5, rpe: 3 }]]]); scale('rir');
    expect(store.setSummary(ex('Back Squat'), w.exercises[0].sets[0])).toMatch(/ RIR 6\+$/);
    await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: `/history/${w.id}` }); await flushAll(10);
    expect(appScreen.getByLabelText(/RIR: 6\+/)).toBeTruthy();
  });
  test('Ustawienia: opis skali RIR mówi o zakresie 0–5 i „lekko” (z parametrów RIR_MAX, RPE_LIGHT) — PL i EN', async () => {
    scale('rpe'); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/more/settings' }); await flushAll(10);
    expect(appScreen.getByText('RIR wpisuje się w zakresie 0–5; więcej niż 5 powtórzeń w zapasie zapisuje się jako „lekko” (RPE 4), bo poniżej RPE 5 skala opisuje wysiłek słowami, a nie powtórzeniami w zapasie (Helms i in. 2016).')).toBeTruthy();
    applyLang('en'); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/more/settings', locale: 'en' }); await flushAll(10);
    expect(appScreen.getByText('Enter RIR from 0 to 5; more than 5 reps in reserve is saved as “light” (RPE 4), because below RPE 5 the scale describes effort in words, not reps in reserve (Helms et al. 2016).')).toBeTruthy();
  });
});

/*
 * MER2-02 (wariant A, docs/25 backlog 0.10.1): generator „Siła” w miejscu z lekkimi hantlami (hotel 2,5–25 kg) daje bój główny 3 × 4–6 „ciężko,
 * ok. 80% maksimum” — wykonalne tylko przy małej sile. Ostrzeżenie: najcięższy ciężar w miejscu dla boju głównego robionego hantlami / kettlem
 * + co robić, gdy 4–6 powtórzeń wychodzi lekko (więcej powtórzeń bliżej upadku; siła rośnie, zwykle mniej — ta sama podstawa co MER-01, docs/research/22 R3).
 * Bez progu liczbowego (wariant B — próg bez źródła, odrzucony). Logika w lib/loadcap.ts; podpięcie do ekranu generatora — fala 2 (lib/generator.ts
 * i app/generator.tsx zmienia równolegle inny agent).
 */
describe('MER2-02: najcięższy ciężar w miejscu przy celu „Siła”', () => {
  const { generate, REPS, HEAVY_PCT } = require('@/lib/generator') as typeof import('@/lib/generator');
  const { heavyLoadCaps, loadCapWarning, CAPPED_IMPLS } = require('@/lib/loadcap') as typeof import('@/lib/loadcap');
  const { addLocation } = require('@/lib/locations') as typeof import('@/lib/locations');
  const { applyUnit } = require('@/lib/units') as typeof import('@/lib/units');
  const inp = (goal: 'strength' | 'hypertrophy' | 'cut', locationId: string | null) => ({ goal, locationId, sessions: 3, minutes: 60 });
  beforeEach(async () => { await fresh(); });
  afterEach(() => { applyUnit('kg'); });
  test('hotel (hantle 2,5–25 kg), Siła: każdy bój główny z hantlami ma limit 25 kg; ostrzeżenie z liczbą, zakresem powtórzeń i nazwami ćwiczeń', () => {
    expect([...CAPPED_IMPLS]).toEqual(['dumbbell', 'kettlebell']);
    const l = addLocation('hotel'); const i = inp('strength', l.id); const r = generate(i);
    const heavy = r.templates.flatMap(tp => tp.items.filter(it => it.repMin === REPS.heavy[0] && it.repMax === REPS.heavy[1]));
    const caps = heavyLoadCaps(r, i);
    expect(caps.length).toBe(new Set(heavy.map(h => h.exerciseId)).size); expect(caps.length).toBeGreaterThan(0);
    for (const c of caps) expect([c.impl, c.maxKg]).toEqual(['dumbbell', 25]);
    const w = loadCapWarning(r, i)!;
    expect(w.kind).toBe('loadcap');
    const names = caps.map(c => exName(store.exById(c.exerciseId)!)).join(', ');
    expect(w.text).toBe(`Najcięższy ciężar w miejscu dla boju głównego (${names}): 25 kg. Ciężkie serie ${REPS.heavy[0]}–${REPS.heavy[1]} powtórzeń (ok. ${HEAVY_PCT}% maksimum) mogą być z nim za lekkie — jeśli ${REPS.heavy[1]} powtórzeń wychodzi lekko, rób więcej powtórzeń, bliżej upadku. Siła też wtedy rośnie, ale zwykle mniej niż przy dużym ciężarze.`);
  });
  test('bez ostrzeżenia: pełna siłownia (sztanga), Masa i Redukcja w hotelu, Siła bez obciążenia (masa ciała — tam jest ostrzeżenie MER-01)', () => {
    expect(loadCapWarning(generate(inp('strength', null)), inp('strength', null))).toBeNull();
    expect(heavyLoadCaps(generate(inp('strength', addLocation('gym').id)), inp('strength', null))).toEqual([]);
    const h = addLocation('hotel').id;
    for (const g of ['hypertrophy', 'cut'] as const) expect(loadCapWarning(generate(inp(g, h)), inp(g, h))).toBeNull();
    const bw = addLocation('bodyweight').id; expect(loadCapWarning(generate(inp('strength', bw)), inp('strength', bw))).toBeNull();
  });
  test('limit z danych miejsca: odznaczone najcięższe hantle → niższa liczba; jednostka lb — „50 lb”; EN', () => {
    const l = addLocation('hotel'); const db = l.equipment.find(e => e.item === 'db_fixed')!;
    if (db.load?.kind === 'list') for (const it of db.load.items) it.on = it.w <= 12.5;
    const i = inp('strength', l.id); expect(new Set(heavyLoadCaps(generate(i), i).map(c => c.maxKg))).toEqual(new Set([12.5]));
    expect(loadCapWarning(generate(i), i)!.text).toContain(': 12,5 kg.');
    applyUnit('lb'); store.getState().settings.unit = 'lb';
    const lb = addLocation('hotel'); const j = inp('strength', lb.id);
    expect(loadCapWarning(generate(j), j)!.text).toContain(': 50 lb.');
    applyUnit('kg'); store.getState().settings.unit = 'kg'; applyLang('en');
    const k = inp('strength', addLocation('hotel').id); expect(loadCapWarning(generate(k), k)!.text).toMatch(/^Heaviest weight at this place for the main lift \(.+\): 25 kg\. Heavy sets of 4–6 reps \(about 80% of max\) may be too light with it — if 6 reps feel light, do more reps, closer to failure\. Strength still increases, but usually less than with heavy loads\.$/);
  });
});

/*
 * MER2-04: wskazania źródeł we wskazówkach (przeczytane strony, 09.10.2026): reguła docs/research/27 „gdzie źródła się różnią — przedział”.
 *  - OHP (sztanga): ACE #71 „about shoulder-width”, ExRx „slightly wider” → „na szerokość barków lub trochę szerzej”; stopy: ACE #71 nic,
 *    ACE #43 (siedząc) „press the feet into the floor”, ExRx „shoulder width or one foot in front” → bez szerokości.
 *  - Kettlebell Swing: ACE #391 „shoulder-width”, ExRx „slightly wider” → przedział. RDL: chwyt NASM „slightly wider”, ExRx „shoulder width to wide”.
 *  - Leg Press: szerokość stóp tylko NASM → zamiast niej kąt w kolanach (~90°: ACE #154 i NASM).
 *  - Face Pull: ACE #336 to High Row (inne ćwiczenie) — odwołanie oznaczone „analogia” i NIE liczy się do ≥ 2 źródeł (gen.mjs); „łokcie za linią
 *    pleców” (tylko ExRx) i „klatka uniesiona” (tylko High Row) zastąpione częścią wspólną NASM i ExRx.
 */
describe('MER2-04: wskazania źródeł wskazówek', () => {
  const { execFileSync } = require('child_process') as typeof import('child_process');
  const { cueText } = require('@/lib/cues') as typeof import('@/lib/cues');
  const refs = (ex: string) => Object.values(CUE_DATA.exercises[ex]).flat() as unknown as { c: string; s: string[][] }[];
  const validate = (data: unknown): string[] => JSON.parse(execFileSync('node', ['--input-type=module', '-e',
    `import { validate } from ${JSON.stringify(path.join(root, 'scripts/cues/gen.mjs'))}; import { readFileSync } from 'node:fs';
     const pl = JSON.parse(readFileSync(${JSON.stringify(path.join(root, 'lib/cues/text/pl.json'))}, 'utf8')); let d = ''; process.stdin.on('data', c => d += c);
     process.stdin.on('end', () => process.stdout.write(JSON.stringify(validate(JSON.parse(d), pl))));`], { input: JSON.stringify(data) }).toString());
  test('rozstaw jako przedział: OHP (sztanga), Kettlebell Swing, RDL — „na szerokość barków lub trochę szerzej”; stopy w OHP i Leg Press bez szerokości', () => {
    expect(cueText('ohp.bbSetup', 'pl')).toContain('chwyt na szerokość barków lub trochę szerzej');
    expect(cueText('kb.setup', 'pl')).toContain('stopy na szerokość barków lub trochę szerzej');
    expect(cueText('rdl.setup', 'pl')).toContain('chwyt na szerokość barków lub trochę szerzej');
    expect(cueText('ohp.feet', 'pl')).not.toMatch(/szeroko/);
    expect(cueText('lp.setup', 'pl')).not.toMatch(/szeroko/);
    expect(cueText('ohp.bbSetup', 'en')).toContain('shoulder-width or a little wider');
  });
  test('Face Pull: High Row (ACE #336) oznaczone „analogia”; zdania bez twierdzeń jednego źródła; każde zdanie ma ≥ 2 organizacje bez analogii', () => {
    const fp = refs('Face Pull');
    for (const r of fp) for (const ref of r.s) if (ref[0] === 'ace-336') expect([r.c, ref[2]]).toEqual([r.c, 'analogia']);
    for (const r of fp) expect([r.c, new Set(r.s.filter(x => x[2] !== 'analogia').map(x => CUE_DATA.sources[x[0]].org)).size >= 2]).toEqual([r.c, true]);
    expect(cueText('fp.elbowsBack', 'pl')).not.toMatch(/za linią pleców/); expect(cueText('fp.chest', 'pl')).not.toMatch(/Klatka uniesiona/);
  });
  test('gen.mjs: odwołanie „analogia” nie liczy się do ≥ 2 źródeł; nieznany znacznik — błąd; dokument pokazuje „analogia”', () => {
    expect(validate(CUE_DATA)).toEqual([]);
    const d = JSON.parse(JSON.stringify(CUE_DATA)); const r = d.exercises['Face Pull'].tips.find((x: { c: string }) => x.c === 'fp.chest');
    r.s = [r.s.find((x: string[]) => x[0].startsWith('exrx')), ['ace-336', 'opis', 'analogia']];
    expect(validate(d).join('\n')).toMatch(/Face Pull\.fp\.chest: 1 organizacja/);
    r.s[1][2] = 'cokolwiek'; expect(validate(d).join('\n')).toMatch(/znacznik/);
    expect(fs.readFileSync(path.join(root, 'docs/research/27-wskazowki-zrodla.md'), 'utf8')).toMatch(/High Row \(#336\)\]\([^)]*\) \(analogia — inne ćwiczenie; /);
  });
});

/*
 * A11N-02 (wariant A — rekomendacja; docs/16: fr „vous”, tr „siz”): wskazówki techniki fr były w całości na „tu” (130/265 zdań), tr w 2. os. lp.
 * („çek”, „tut”, „indir”), a ok. 30 tekstów UI fr z fali 1–2 na „tu”. Teraz jeden rejestr w języku: UI i wskazówki.
 */
describe('A11N-02: rejestr grzecznościowy fr („vous”) i tr („siz”)', () => {
  const FR_TU = /(^|[^\p{L}’-])(tu|ton|ta|tes|toi|t’)(?![\p{L}])|-toi(?![\p{L}])/iu;
  /** Tryb rozkazujący 2. os. lp. na początku zdania lub członu — czasowniki z dawnych tekstów (wieloznaczne jak „Place”, „Pose”, „Crée”, „Ouvre” — pominięte). */
  const FR_IMP2 = /(^|[.:;—(«]\s*|,\s+|\bpuis\s+|\bet\s+)(Lève|Descends|Saisis|Serre|Tire|Pousse|Garde|Tiens|Monte|Fléchis|Allonge|Assieds|Reviens|Redescends|Remonte|Tends|Bouge|Respire|Utilise|Règle|Prends|Fais|Choisis|Appuie|Mène|Attache|Contracte|Soulève|Termine|Penche|Ramène|Rapproche|Repousse|Enchaîne|Relève|Abaisse|Réduis|Laisse|Touche|Vérifie|Définis|Balaye|Coche|Ajoute|Augmente|Réceptionne|Atterris|Saute|Ouvre l’app)(?![\p{L}])/iu;
  /** tr: dawne formy 2. os. lp. (rozkaźnik bez -in/-ın, zaimki dzierżawcze 2. os. lp.) — przykłady z raportu i z dawnych zdań. */
  const TR_SEN = /(^|[\s(])(çek|tut|indir|kavra|kaldır|dön|in|it|koy|kalk|uzan|bük|getir|otur|düzelt|yasla|daya|bas|eğil|başla|sık|seç|yükselt|bekle|yüksel|asıl|çömel|uzat|yap|sıçra|kullan|ayarla|al|aç|gir|dur|değiştir|bağla|yerleştir|döndür|göğsünü|kollarını|kalçanı|sırtını|başının|ellerini|dizlerini|vücudunu|gövdeni|arkandaki|sana)(?=[\s,.;:—)]|$)/u;
  test('wskazówki fr: żadne zdanie bez formy „tu” (zaimki i rozkaźnik 2. os. lp.); co najmniej 120 zdań w formie „vous”', () => {
    const fr = cueDict('fr');
    expect(Object.entries(fr).filter(([, v]) => FR_TU.test(v) || FR_IMP2.test(v)).map(([k, v]) => `${k}: ${v}`)).toEqual([]);
    expect(Object.values(fr).filter(v => /\b\p{L}+ez\b|\bvous\b|\bvotre\b|\bvos\b/u.test(v)).length).toBeGreaterThanOrEqual(120);
  });
  test('wskazówki tr: bez rozkaźnika i zaimków 2. os. lp.; forma „siz” (-in/-ın/-un/-ün, -ınız) w co najmniej 150 zdaniach', () => {
    const tr = cueDict('tr');
    expect(Object.entries(tr).filter(([, v]) => TR_SEN.test(v)).map(([k, v]) => `${k}: ${v}`)).toEqual([]);
    expect(Object.values(tr).filter(v => /\p{L}+(in|ın|un|ün|iniz|ınız|unuz|ünüz)\b|(yin|yın|yun|yün)\b/u.test(v)).length).toBeGreaterThanOrEqual(150);
  });
  test('UI fr: żaden tekst słownika w formie „tu” (np. „Séance de ton programme… Ouvre l’app”, „tu verras”, „Touche un programme”)', () => {
    const fr = LOCALES.fr!;
    expect(Object.entries(fr).filter(([, v]) => FR_TU.test(v) || FR_IMP2.test(v)).map(([k, v]) => `${k.slice(0, 40)}: ${v}`)).toEqual([]);
    expect(fr['Trening z Twojego planu tygodnia. Otwórz aplikację, by zacząć.']).toBe('Séance de votre programme de la semaine. Ouvrez l’app pour commencer.');
  });
  test('bramka działa: dawne zdania („Serre les omoplates…”, „Barı … kavra”, „tu verras”) są wykrywane', () => {
    expect(FR_IMP2.test('Serre les omoplates vers l’arrière.')).toBe(true); expect(FR_TU.test('— tu verras ici la séance')).toBe(true);
    expect(FR_TU.test('Allonge-toi sur le dos.')).toBe(true); expect(FR_TU.test('Vous pouvez aussi démarrer.')).toBe(false);
    expect(TR_SEN.test('Barı omuz genişliğinden biraz daha geniş tut.')).toBe(true); expect(TR_SEN.test('Halteri omuz genişliğinden biraz daha geniş tutun.')).toBe(false);
  });
});

/*
 * A11N-03: fr — przed „; : ! ?” i „»” oraz po „«” spacja nierozdzielająca (docs/16), żeby znak nie trafiał na początek wiersza. Było: UI 184 teksty
 * ze zwykłą spacją (116 z NBSP), wskazówki 87 z 265. Dozwolone U+00A0 i U+202F (wąska).
 */
describe('A11N-03: fr — spacja nierozdzielająca przed ; : ! ? » i po «', () => {
  const BAD = /[ \t][;:!?»]|«[ \t]/;
  test('słownik UI fr i wskazówki fr: żadnej zwykłej spacji przed ; : ! ? » ani po «', () => {
    expect(Object.entries(LOCALES.fr!).filter(([, v]) => BAD.test(v)).map(([k]) => k.slice(0, 50))).toEqual([]);
    expect(Object.entries(cueDict('fr')).filter(([, v]) => BAD.test(v)).map(([k]) => k)).toEqual([]);
  });
  test('ekran: stopka „Technika” i wskazówka po francusku mają NBSP („D’après\\u00a0:”, „…\\u00a0;”)', () => {
    applyLang('fr'); render(<ExerciseCues exercise={lib('Bird Dog')} />); fireEvent.press(screen.getByRole('button', { name: t('Technika') }));
    expect(screen.getByText(/^D’après\u00a0: /, { normalizer: (x: string) => x } /* domyślny normalizator zamienia NBSP na spację */)).toBeTruthy();
    expect(screen.getByText(`• ${cueDict('fr')['bd.setup']}`, { normalizer: (x: string) => x }).props.children).toMatch(/pattes\u00a0: mains/);
  });
  test('bramka działa', () => { expect(BAD.test('À quatre pattes : mains')).toBe(true); expect(BAD.test('À quatre pattes\u00a0: mains')).toBe(false); expect(BAD.test('« Afficher\u00a0»')).toBe(true); });
});

/*
 * A11N-05: spójność terminów we wskazówkach. el: drążek w podciąganiu to „μονόζυγο” (rodzaj nijaki: „το μονόζυγο”), nie „τη μπάρα”; tr: sztanga
 * „halter” jak w UI (było „bar”). Nagłówek sekcji „Ustawienie” (przygotowanie przed ruchem) brzmiał jak podpis klatki figury „Pozycja wyjściowa”
 * w fr, tr, lt, hu (i es, it, pt, hr, sk, sl, sr, uk) — dwa różne pojęcia w jednej sekcji.
 */
describe('A11N-05: terminy we wskazówkach i nagłówek „Ustawienie”', () => {
  test('w każdym języku nagłówek „Ustawienie” ≠ podpis klatki „Pozycja wyjściowa” / „Pozycja końcowa”; podpowiedź „Technika” zaczyna się od nagłówka', () => {
    const bad: string[] = [];
    for (const l of LANGS) { applyLang(l); const u = t('Ustawienie'); if (u === t('Pozycja wyjściowa') || u === t('Pozycja końcowa')) bad.push(`${l}: ${u}`); if (!t('Ustawienie, ruch, wskazówki i częste błędy.').startsWith(u)) bad.push(`${l} (podpowiedź): ${u}`); }
    expect(bad).toEqual([]);
  });
  test('el: podciąganie (pu.*, cu.*) — drążek „το μονόζυγο” (termin UI „drążek”), bez „τη μπάρα” i „τη μονόζυγο”; w całych wskazówkach el „την μπάρα”', () => {
    const el = cueDict('el'); const bar = LOCALES.el!['drążek'];
    expect(bar).toBe('μονόζυγο');
    for (const id of ['pu.grip', 'pu.pull', 'cu.grip']) expect([id, el[id].includes('το μονόζυγο')]).toEqual([id, true]);
    expect(Object.entries(el).filter(([, v]) => /τη μπάρα|τη μονόζυγο/.test(v)).map(([k]) => k)).toEqual([]);
  });
  test('tr: zdania o sztandze (ćwiczenia ze sztangą) używają terminu UI „halter”; drążek do podciągania — „barfiks barı”', () => {
    const tr = cueDict('tr'); const ui = LOCALES.tr!['sztanga'];
    expect(ui).toBe('halter');
    const bbKeys = Object.keys(CUE_DATA.exercises).filter(k => /\(sztanga\)$|^Back Squat$|^Front Squat$|^Sumo Deadlift$|^Hip Thrust$|^Good Morning$|^Push Press$/.test(k));
    const ids = new Set(bbKeys.flatMap(k => Object.values(CUE_DATA.exercises[k]).flat().map((r: { c: string }) => r.c)));
    const withBar = [...ids].filter(id => /\b[Bb]ar(ı|a|ın)?\b/u.test(tr[id]) && !/barfiks|EZ bar/iu.test(tr[id]));
    expect(withBar).toEqual([]);
    expect([...ids].filter(id => /[Hh]alter/u.test(tr[id])).length).toBeGreaterThan(15);
    for (const id of ['pu.grip', 'pu.pull', 'cu.grip']) expect([id, /barfiks bar/iu.test(tr[id])]).toEqual([id, true]);
  });
});

/*
 * MER2-09: drobne niespójności dokumentacji i komentarzy (liczby i stan w dokumentach mają odpowiadać kodowi).
 */
describe('MER2-09: dokumenty i komentarze zgodne z kodem', () => {
  const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
  test('docs/09: liczba ćwiczeń ze wskazówkami = dane (lib/cues/data.json)', () => {
    const row = read('docs/09-plan-testow.md').split('\n').find(l => l.startsWith('| Wskazówki techniki, etap 1'))!;
    expect(row).toContain(`data.json\`: ${Object.keys(CUE_DATA.exercises).length} ćwiczeń bazowych`);
  });
  test('lib/seed.ts: komentarz MUSCLE_SOURCES nie mówi „Na razie pusto”, gdy mapa ma wpisy', () => {
    const { MUSCLE_SOURCES } = require('@/lib/seed') as typeof import('@/lib/seed');
    expect(Object.keys(MUSCLE_SOURCES).length).toBeGreaterThan(0);
    const src = read('lib/seed.ts'); const i = src.indexOf('export const MUSCLE_SOURCES');
    expect(src.slice(i - 700, i)).not.toMatch(/Na razie pusto/);
  });
  test('docs/research/masa-ciala-e1rm: masa ciała z datą (bodyMassLog) zamiast „jednej masy z Ustawień”; niejednoznaczność kamizelki w źródle opisana', () => {
    const doc = read('docs/research/masa-ciala-e1rm-2026-10.md');
    expect(doc).not.toMatch(/aplikacja ma jedną masę ciała \(z Ustawień\)/);
    expect(doc).toMatch(/bodyMassLog/);
    expect(doc).toMatch(/„of body mass \(\+ weight vest\)”/);
  });
});
