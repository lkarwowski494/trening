/*
 * Eksport dla strony: bramka 4 (CLAUDE.md 27.10.2026: „rodzina bez recenzji = nie wyświetlana, strona jej nie eksportuje”; decyzja właściciela 9a, 28.10.2026).
 * Figura trafia do figury.json tylko, gdy jej rodzina ma status „ready” ORAZ wpis recenzji (docs/research/figury-recenzja.json, sekcja v2, werdykt „wyswietlana”)
 * z aktualnym skrótem (scripts/strona/recenzja-figur.mjs). Rodzaje (docs/20): logika (warunek), niezmienniki (parytet eksportu z rodzinami ready z aktualną recenzją),
 * dane (pilotaż bez recenzji i wpis z nieaktualnym skrótem nie przechodzą), regresja (przed zmianą pilotaż core_floor, pull_up, pushup_plank trafiał do eksportu bez recenzji).
 */
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { figureSpec as figureSpecAll, familyOf } from '@/lib/figures/v2';
import { V2_WSTRZYMANE, loopOf } from '@/lib/figures/v2/figure';
import { CUE_DATA, generalCuesReviewed } from '@/lib/cues';
import { cueSelection } from '@/lib/figures/v2/cueSets';
import { kopia, odlaczenie, usunKopie } from './helpers/skrot-v2-kopia';

const root = path.join(__dirname, '..');
const SCRIPT = path.join(root, 'scripts/strona/eksport.mjs');
const POMOC = path.join(root, 'scripts/strona/recenzja-figur.mjs');
const node = (script: string, ...a: string[]) => execFileSync('node', [script, ...a], { encoding: 'utf8' });
type Skroty = { ready: string[]; skroty: Record<string, string>; eksportowane: string[] };
const skroty = (...a: string[]): Skroty => JSON.parse(node(POMOC, '--skroty', ...a));
const POZY = new Map<string, string>(); /* ćwiczenie → rodzina, dla wszystkich plików poses/*.json (pilotaż i rodziny z danych) */
for (const f of fs.readdirSync(path.join(root, 'lib/figures/v2/poses')).filter(x => x.endsWith('.json'))) for (const k of Object.keys(JSON.parse(fs.readFileSync(path.join(root, 'lib/figures/v2/poses', f), 'utf8')).cwiczenia)) POZY.set(k, f.replace(/\.json$/, ''));

type Fig = { figures: Record<string, { family: string }> };
type Atlas = { exercises: { id: string; slug: string; family: string; figure: unknown; cues: { scope: string } }[] };
let tmp = '';
beforeAll(() => { tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-rec-')); }, 60000);
afterAll(() => { fs.rmSync(tmp, { recursive: true, force: true }); usunKopie(); });
const wpis = (sha: string) => ({ werdykt: 'wyswietlana', data: '2026-10-28', kto: 'wpis testowy (fixture testu tests/strona-eksport-recenzja.test.ts)', sha, liczba: 1 });
const eksport = (name: string, recenzja?: object) => {
  const out = path.join(tmp, name); const args = ['--out', out, '--langs', 'en', '--commit', 'abc1234def'];
  if (recenzja) { const p = path.join(tmp, `${name}.json`); fs.writeFileSync(p, JSON.stringify({ v2: recenzja })); args.push('--recenzja', p); }
  node(SCRIPT, ...args);
  return { fig: JSON.parse(fs.readFileSync(path.join(out, 'figury.json'), 'utf8')) as Fig, atlas: JSON.parse(fs.readFileSync(path.join(out, 'atlas-en.json'), 'utf8')) as Atlas };
};
/** Figura jak w aplikacji: bez rysunków wstrzymanych (V2_WSTRZYMANE, PR #84) — eksport ich nie rysuje. */
const figureSpec = (k: string) => Object.prototype.hasOwnProperty.call(V2_WSTRZYMANE, k) ? null : figureSpecAll(k);
/** Ćwiczenia, które eksport mógłby narysować (rodzina ready ze specyfikacją albo poza z pliku danych), z rodziną. Wstrzymane (V2_WSTRZYMANE) wypadają także z gałęzi „poza z pliku danych” — scripts/strona/eksport.mjs:73,133 ich nie rysuje (05.11.2026: Clean Shrug i Snatch Shrug mają pozy w olympic.json, a rysunek wstrzymany do kart T2). */
const rysowalne = (atlas: Atlas) => atlas.exercises.filter(e => !Object.prototype.hasOwnProperty.call(V2_WSTRZYMANE, e.id) && (figureSpec(e.id) || POZY.has(e.id))).map(e => ({ slug: e.slug, id: e.id, family: figureSpec(e.id)?.family ?? familyOf(e.id) }));

describe('eksport dla strony: figura tylko z rodziny ready z aktualną recenzją', () => {
  test('rodzina z plikiem pozy bez statusu ready (pilotaż) istnieje w danych, a jej figur nie ma w eksporcie bez recenzji; core_floor ma status ready od 10.11.2026 (partia 7, recenzja r2), pushup_plank od 09.11.2026 (partia 2), eksport tylko z aktualnym wpisem recenzji (testy niżej)', () => {
    const s = skroty(); expect(s.ready).toContain('core_floor'); expect(s.ready).toContain('pushup_plank'); /* 10.11.2026 (partia 7): core_floor włączona po recenzji r2 (zmiana celowa) — pilotaż = każda rodzina z plikiem pozy bez statusu ready (dziś m.in. carry, lunge, strongman) */
    /* 10.11.2026 (scalenie pociąg-7, docs/18 do weta): po partii 8 w repo nie ma już rodziny pilotażu (plik póz bez statusu ready) — pilotaż powstaje w kopii drzewa: strongman odłączona
     * (tests/helpers/skrot-v2-kopia.ts: odlaczenie). W kopii: plik póz jest, status nie ready, a eksport nie bierze jej figur nawet z wpisem recenzji o bieżącym skrócie z repo. */
    expect(s.ready).toContain('strongman'); expect([...POZY.values()]).toContain('strongman');
    const kop = kopia(odlaczenie('strongman')); for (const p of ['app.json', 'package.json']) fs.copyFileSync(path.join(root, p), path.join(kop, p)); /* eksport czyta app.json i package.json z katalogu skryptu */
    const ks = JSON.parse(execFileSync('node', [path.join(kop, 'scripts/strona/recenzja-figur.mjs'), '--skroty'], { cwd: kop, encoding: 'utf8' })) as Skroty;
    expect(ks.ready).not.toContain('strongman'); expect(fs.existsSync(path.join(kop, 'lib/figures/v2/poses/strongman.json'))).toBe(true);
    const rec = JSON.parse(fs.readFileSync(path.join(root, 'docs/research/figury-recenzja.json'), 'utf8')) as { v2: Record<string, { sha: string }> }; expect(rec.v2.strongman.sha).toBe(s.skroty.strongman);
    const recP = path.join(tmp, 'pilotaz-rec.json'); fs.writeFileSync(recP, JSON.stringify({ v2: rec.v2 })); const out = path.join(tmp, 'pilotaz');
    execFileSync('node', [path.join(kop, 'scripts/strona/eksport.mjs'), '--out', out, '--langs', 'en', '--commit', 'abc1234def', '--recenzja', recP], { cwd: kop, encoding: 'utf8' });
    const fams = Object.values((JSON.parse(fs.readFileSync(path.join(out, 'figury.json'), 'utf8')) as Fig).figures).map(x => x.family);
    expect(fams).not.toContain('strongman'); expect(fams).toContain('core_standing'); /* pilotaż odpada, reszta eksportu działa */
    expect([...POZY.values()]).toEqual(expect.arrayContaining(['core_floor', 'pull_up', 'pushup_plank']));
  });
  test('fixture: recenzja squat, bench_press, hinge (aktualne skróty) + pull_up z nieaktualnym skrótem + brak wpisów pilotażu ⇒ figury dokładnie z tych trzech rodzin (parytet)', () => {
    const s = skroty(); const zapis = { squat: wpis(s.skroty.squat), bench_press: wpis(s.skroty.bench_press), hinge: wpis(s.skroty.hinge), pull_up: wpis('000000000000') };
    const { fig, atlas } = eksport('fixture', zapis);
    const oczekiwane = rysowalne(atlas).filter(x => ['squat', 'bench_press', 'hinge'].includes(x.family)).map(x => x.slug).sort();
    expect(oczekiwane.length).toBeGreaterThan(50);
    expect(Object.keys(fig.figures).sort()).toEqual(oczekiwane);
    for (const f of Object.values(fig.figures)) expect(['squat', 'bench_press', 'hinge']).toContain(f.family);
    for (const e of atlas.exercises) expect([e.id, !!e.figure]).toEqual([e.id, oczekiwane.includes(e.slug)]); /* karta bez figury = figure: null (strona pokazuje same wskazówki) */
  });
  test('regresja: pull_up (ready, wpis z nieaktualnym skrótem), core_floor i pushup_plank (bez wpisu) nie trafiają do eksportu', () => {
    const s = skroty(); const { fig, atlas } = eksport('regresja', { squat: wpis(s.skroty.squat), pull_up: wpis('000000000000') });
    const wykluczone = rysowalne(atlas).filter(x => ['pull_up', 'core_floor', 'pushup_plank'].includes(x.family));
    expect(wykluczone.length).toBeGreaterThan(5);
    for (const x of wykluczone) expect([x.id, x.slug in fig.figures]).toEqual([x.id, false]);
  });
  test('wpis z werdyktem innym niż „wyswietlana” albo bez skrótu nie wystarcza; aktualny skrót pull_up wpuszcza jej figury (warunek jest jedyną przeszkodą)', () => {
    const s = skroty(); const bad = eksport('zly-werdykt', { squat: { ...wpis(s.skroty.squat), werdykt: 'ukryta' } });
    expect(Object.keys(bad.fig.figures)).toEqual([]);
    const ok = eksport('pull-up', { pull_up: wpis(s.skroty.pull_up) });
    const oczek = rysowalne(ok.atlas).filter(x => x.family === 'pull_up').map(x => x.slug).sort(); expect(oczek.length).toBeGreaterThan(0);
    expect(Object.keys(ok.fig.figures).sort()).toEqual(oczek);
  });
  test('r6-W2 A (05.11.2026): olympic z aktualną recenzją — 19 ćwiczeń jednokierunkowych (Power Clean, Block Power Snatch) wraca do eksportu razem z wahadłami; bez wpisu olympic żadne z nich (negatyw)', () => {
    const s = skroty(); const jedn = (id: string) => loopOf(figureSpecAll(id)!) === 'jednokierunkowa';
    const ok = eksport('olympic', { olympic: wpis(s.skroty.olympic) });
    const oly = ok.atlas.exercises.filter(e => e.id !== 'Clean Shrug' && e.id !== 'Snatch Shrug' && figureSpecAll(e.id)?.family === 'olympic');
    expect(oly.filter(e => jedn(e.id)).length).toBe(19);
    for (const e of oly) expect([e.id, e.slug in ok.fig.figures, !!e.figure]).toEqual([e.id, true, true]);
    for (const k of ['Power Clean', 'Block Power Snatch']) expect(ok.atlas.exercises.find(e => e.id === k)!.cues.scope).not.toBe('none'); /* r7-N1: zestaw ogólny wraca razem z figurą */
    const bez = eksport('olympic-bez', { squat: wpis(s.skroty.squat) });
    for (const e of oly) expect([e.id, e.slug in bez.fig.figures]).toEqual([e.id, false]);
  });
  test('bez pliku zapisu (fail closed): pusty figury.json', () => {
    expect(Object.keys(eksport('brak', {}).fig.figures)).toEqual([]);
  });
  test('stan repozytorium: figury w domyślnym eksporcie = rodziny ready z aktualną recenzją w docs/research/figury-recenzja.json (parytet)', () => {
    const s = skroty(); const { fig, atlas } = eksport('domyslny');
    const oczekiwane = rysowalne(atlas).filter(x => s.eksportowane.includes(x.family)).map(x => x.slug).sort();
    expect(Object.keys(fig.figures).sort()).toEqual(oczekiwane);
    for (const f of Object.values(fig.figures)) { expect(s.ready).toContain(f.family); expect(s.eksportowane).toContain(f.family); }
  });
});

describe('eksport dla strony: karty i figury jak w aplikacji (bramka 4, DEC-10 a; BR-BIB-006, 29.10.2026)', () => {
  /** To, co aplikacja pokazuje przy ćwiczeniu (components/ExerciseCues.tsx): karta własna z lib/cues/data.json, zestaw ogólny — z recenzją treści i przy rysowanej figurze. */
  const tryb = (id: string, maFigure: boolean) => { const m = cueSelection(id).mode; return m === 'own' ? (CUE_DATA.exercises[id] ? 'own' : 'none') : m === 'general' ? (generalCuesReviewed(id) && maFigure ? 'general' : 'none') : 'none'; };
  const fixture = () => { const s = skroty(); return { squat: wpis(s.skroty.squat), bench_press: wpis(s.skroty.bench_press), hinge: wpis(s.skroty.hinge) }; };
  test('tryb wskazówek w eksporcie = tryb w aplikacji dla każdego ćwiczenia (karta własna spoza listy hidden; zestaw ogólny tylko z recenzją treści i przy figurze)', () => {
    const { atlas } = eksport('karty-fixture', fixture());
    expect(atlas.exercises.length).toBe(708);
    for (const e of atlas.exercises) expect([e.id, e.cues.scope]).toEqual([e.id, tryb(e.id, !!e.figure)]);
    expect(atlas.exercises.filter(e => e.cues.scope === 'general').length).toBeGreaterThan(10); /* są zestawy ogólne z recenzją przy figurach squat/bench/hinge */
  });
  test('karta ukryta po recenzji treści (lista hidden) nie trafia do eksportu jako „own”; zestaw ogólny bez recenzji treści nie trafia jako „general”', () => {
    const { atlas } = eksport('karty-hidden', fixture());
    expect(CUE_DATA.hidden.length).toBeGreaterThan(0);
    for (const k of CUE_DATA.hidden) expect([k, atlas.exercises.find(e => e.id === k)!.cues.scope]).toEqual([k, 'none']);
    const bez = atlas.exercises.filter(e => cueSelection(e.id).mode === 'general' && !generalCuesReviewed(e.id));
    expect(bez.length).toBeGreaterThan(0);
    for (const e of bez) expect([e.id, e.cues.scope]).toEqual([e.id, 'none']);
  });
  test('bez zapisu recenzji rodzin (fail closed): zero figur, a zestawy ogólne (przy figurze v2) nie są eksportowane', () => {
    const { fig, atlas } = eksport('karty-brak', {});
    expect(Object.keys(fig.figures)).toEqual([]);
    expect(atlas.exercises.filter(e => e.cues.scope === 'general')).toEqual([]);
    for (const e of atlas.exercises) expect([e.id, e.cues.scope]).toEqual([e.id, tryb(e.id, false)]);
  });
  test('rysunki wstrzymane w aplikacji (V2_WSTRZYMANE) nie trafiają do figur; od 1.0.1 (scalenie 31.10.2026) lista jest pusta — JM Press i Decline Close-Grip Bench To Skull Crusher po poprawce i recenzji trafiają do figur jak sąsiednie wyciskania wąskim chwytem', () => {
    const { fig, atlas } = eksport('wstrzymane', fixture());
    const slug = (id: string) => atlas.exercises.find(e => e.id === id)!.slug;
    expect(Object.keys(V2_WSTRZYMANE).sort()).toEqual(['Barbell Side Bend', 'Clean Shrug', 'Machine Hip Thrust', 'Plyo Push-Up', 'Snatch Shrug', 'Triceps Dips (ławka)']); /* 11.11.2026 (W-02, P1-CALF-1): Standing i Seated Calf Raise zdjęte z V2_WSTRZYMANE po recenzji recenzja w02-calf_raise-roznica-audytor-2026-11-11.md (oba „wyswietlana”) */ /* 04.11.2026: wzruszenia olympic wstrzymane do kart T2 (olympic r4); 09.11.2026: Standing i Seated Calf Raise (calf_raise r1, decyzja koordynatora wariant A — P1-CALF-1) i Machine Hip Thrust (hip_bridge r1, partia 2) */ /* 10.11.2026 (scalenie partii 4): + ławka dip (W5, P4-DIP-1) */ /* 10.11.2026 (scalenie partii 2): + Plyo Push-Up (PP-W1) */ /* 10.11.2026 (core_standing r1 W2, decyzja leada): + Barbell Side Bend (P8-CS-1) */
    for (const k of Object.keys(V2_WSTRZYMANE)) { expect([k, slug(k) in fig.figures]).toEqual([k, false]); expect([k, atlas.exercises.find(e => e.id === k)!.figure]).toEqual([k, null]); }
    for (const k of ['JM Press', 'Decline Close-Grip Bench To Skull Crusher', 'Smith Machine Close-Grip Bench Press', 'Standing Calf Raise', 'Seated Calf Raise']) expect([k, slug(k) in fig.figures]).toEqual([k, true]); /* 11.11.2026 (W-02): oba wspięcia z dźwignią po zdjęciu wstrzymania trafiają do figur strony */
  });
  test('31.10.2026 (scalenie wersja-1-0-1-r2): skrót rodziny strony = skrót aplikacji (scripts/zrodla-runtime.mjs, z plikami wspólnymi R2-6) — strona nie eksportuje rodziny, której aplikacja nie pokazuje', () => {
    const app = JSON.parse(execFileSync('node', [path.join(root, 'scripts/zrodla-runtime.mjs'), '--skroty'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })) as { v2: Record<string, string> };
    const s = skroty();
    for (const f of Object.keys(s.skroty)) expect([f, s.skroty[f]]).toEqual([f, app.v2[f]]);
    expect(Object.keys(s.skroty).length).toBeGreaterThanOrEqual(4);
  });
});
