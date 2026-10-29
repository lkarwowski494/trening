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
import { V2_WSTRZYMANE } from '@/lib/figures/v2/figure';

const root = path.join(__dirname, '..');
const SCRIPT = path.join(root, 'scripts/strona/eksport.mjs');
const POMOC = path.join(root, 'scripts/strona/recenzja-figur.mjs');
const node = (script: string, ...a: string[]) => execFileSync('node', [script, ...a], { encoding: 'utf8' });
type Skroty = { ready: string[]; skroty: Record<string, string>; eksportowane: string[] };
const skroty = (...a: string[]): Skroty => JSON.parse(node(POMOC, '--skroty', ...a));
const POZY = new Map<string, string>(); /* ćwiczenie → rodzina, dla wszystkich plików poses/*.json (pilotaż i rodziny z danych) */
for (const f of fs.readdirSync(path.join(root, 'lib/figures/v2/poses')).filter(x => x.endsWith('.json'))) for (const k of Object.keys(JSON.parse(fs.readFileSync(path.join(root, 'lib/figures/v2/poses', f), 'utf8')).cwiczenia)) POZY.set(k, f.replace(/\.json$/, ''));

type Fig = { figures: Record<string, { family: string }> };
type Atlas = { exercises: { id: string; slug: string; family: string; figure: unknown }[] };
let tmp = '';
beforeAll(() => { tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-rec-')); }, 60000);
afterAll(() => { fs.rmSync(tmp, { recursive: true, force: true }); });
const wpis = (sha: string) => ({ werdykt: 'wyswietlana', data: '2026-10-28', kto: 'wpis testowy (fixture testu tests/strona-eksport-recenzja.test.ts)', sha, liczba: 1 });
const eksport = (name: string, recenzja?: object) => {
  const out = path.join(tmp, name); const args = ['--out', out, '--langs', 'en', '--commit', 'abc1234def'];
  if (recenzja) { const p = path.join(tmp, `${name}.json`); fs.writeFileSync(p, JSON.stringify({ v2: recenzja })); args.push('--recenzja', p); }
  node(SCRIPT, ...args);
  return { fig: JSON.parse(fs.readFileSync(path.join(out, 'figury.json'), 'utf8')) as Fig, atlas: JSON.parse(fs.readFileSync(path.join(out, 'atlas-en.json'), 'utf8')) as Atlas };
};
/** Figura jak w aplikacji: bez rysunków wstrzymanych (V2_WSTRZYMANE, PR #84) — eksport ich nie rysuje. */
const figureSpec = (k: string) => Object.prototype.hasOwnProperty.call(V2_WSTRZYMANE, k) ? null : figureSpecAll(k);
/** Ćwiczenia, które eksport mógłby narysować (rodzina ready ze specyfikacją albo poza z pliku danych), z rodziną. */
const rysowalne = (atlas: Atlas) => atlas.exercises.filter(e => figureSpec(e.id) || POZY.has(e.id)).map(e => ({ slug: e.slug, id: e.id, family: figureSpec(e.id)?.family ?? familyOf(e.id) }));

describe('eksport dla strony: figura tylko z rodziny ready z aktualną recenzją', () => {
  test('pilotaż z plików pozy (core_floor, pushup_plank) nie ma statusu ready — istnieje w danych, a jego figur nie ma w eksporcie bez recenzji', () => {
    const s = skroty(); expect(s.ready).not.toContain('core_floor'); expect(s.ready).not.toContain('pushup_plank');
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
