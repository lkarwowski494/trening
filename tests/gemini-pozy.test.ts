/*
 * Pilotaż póz figur v2 przez API Gemini (25.10.2026): scripts/figures/gemini-pozy.mjs + .github/workflows/gemini-figury.yml. Bez sieci: atrapa fetch, fixture z fałszywym walidatorem
 * (kontrakt z gałęzi grafiki-cwiczen jest wstrzykiwany jako scripts/figures/v2-validate.mjs w katalogu tymczasowym). Rodzaje: cennik i koszt, argumenty, ćwiczenia i wskazówki, prompt,
 * odpowiedź API, pętla generuj-waliduj-popraw, twardy limit kosztu, przebieg z atrapą (nic poza katalogiem wyniku), brak klucza/kontraktu, strażnik workflowu.
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const SCRIPT = path.join(ROOT, 'scripts/figures/gemini-pozy.mjs');
const wf = fs.readFileSync(path.join(ROOT, '.github/workflows/gemini-figury.yml'), 'utf8');
const run = (code: string) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(SCRIPT)}; ${code}`], { env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 1 << 26 }));

const w = (root: string, f: string, c: string) => { fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true }); fs.writeFileSync(path.join(root, f), c); };
/** Fałszywy walidator: poza = { kat: liczba }; poprawna dla 0..100; błąd „zakres” z konkretnym komunikatem. */
const VALIDATE = `
export const schematPozy = () => ({ type: 'object', properties: { kat: { type: 'number' } }, required: ['kat'] });
export const opisKontraktu = () => 'kat = kąt w stopniach (0..100)';
export const waliduj = (poza) => (poza && poza.kat >= 0 && poza.kat <= 100) ? { ok: true, bledy: [] } : { ok: false, bledy: [{ kod: 'zakres', szczegol: 'kat=' + (poza && poza.kat) + ' poza 0..100 (łokieć)' }] };
export const przyklad = (r) => [{ cwiczenie: 'Back Squat', poza: { kat: 42 } }];
export const zastosuj = async (root, wynik) => ({ nalozono: Object.keys(wynik.poze).length });
`;
function fixture(opts: { kontrakt?: boolean } = {}): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gemini-'));
  w(root, 'docs/51-figury-v2-pokrycie.md', '## Rodziny\n\n### squat (1) — gotowa\n\nBack Squat\n\n### pull_up (3) — do zrobienia\n\nPull Up; Chin Up; Dead Hang\n\n### pulldown (1) — do zrobienia\n\nLat Pulldown\n');
  w(root, 'lib/figures/v2/cue-sets.json', JSON.stringify({ items: { 'Pull Up': { b: 'general', ok: ['hang.ribs'], err: ['hang.swing'] } } }));
  w(root, 'lib/cues/text/pl.json', JSON.stringify({ 'hang.ribs': 'Żebra opuszczone, brzuch napięty.', 'hang.swing': 'Bujanie nogami.' }));
  if (opts.kontrakt !== false) w(root, 'scripts/figures/v2-validate.mjs', VALIDATE);
  return root;
}
/** Uruchamia main() z atrapą fetch (odpowiedzi z kolejki `odp`: liczba kat albo 'http429' / 'blad400'); zwraca kod, log, wywołania i pliki wyniku. */
function runMain(root: string, args: string[], env: Record<string, string>, odp: (string | number)[], limit = ''): { code: number; log: string[]; calls: any[]; files: string[] } {
  const out = path.join(root, 'wyjscie');
  const code = `
    const calls = []; const q = ${JSON.stringify(odp)}; const log = [];
    const usage = { total_input_tokens: 2000, total_output_tokens: 1000, total_thought_tokens: 1000, total_tokens: 4000 };
    const fetchFn = async (url, init) => { calls.push({ url, headers: init.headers, body: JSON.parse(init.body) }); const x = q.shift();
      if (x === 'http429') return { ok: false, status: 429, json: async () => ({ error: { message: 'za dużo' } }) };
      if (x === 'blad400') return { ok: false, status: 400, json: async () => ({ error: { message: 'zły schemat' } }) };
      if (x === undefined) throw new Error('nieoczekiwane wywołanie sieci');
      return { ok: true, status: 200, json: async () => ({ status: 'completed', steps: [{ type: 'model_output', content: [{ type: 'text', text: JSON.stringify({ kat: x }) }] }], usage }) }; };
    let t = 0; const c = await m.main(${JSON.stringify([...args, '--wyjscie', out])}, ${JSON.stringify(env)}, { fetchFn, log: (s) => log.push(s), root: ${JSON.stringify(root)}, dzis: new Date('2026-11-01T00:00:00Z'), zegar: () => (t += 10), spij: async () => {} });
    console.log(JSON.stringify({ code: c, log, calls }));`;
  const r = run(code);
  return { ...r, files: fs.existsSync(out) ? fs.readdirSync(out).sort() : [] };
}
const snapshot = (root: string) => ['docs/51-figury-v2-pokrycie.md', 'lib/figures/v2/cue-sets.json', 'lib/cues/text/pl.json', 'scripts/figures/v2-validate.mjs'].map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n#\n');

describe('gemini-pozy: cennik i koszt (docs/52, odczyt 25.10.2026)', () => {
  test('modele dozwolone, domyślny flagowy; cena Argon rośnie od 1 grudnia 2026 (2/10 → 4/20 USD za 1 mln), Flash od 1 stycznia 2027', () => {
    expect(run('console.log(JSON.stringify([m.MODELE, m.DOMYSLNY_MODEL]))')).toEqual([['gemini-4-argon', 'gemini-3.1-pro-preview', 'gemini-3.8-flash'], 'gemini-4-argon']);
    expect(run(`console.log(JSON.stringify([m.cena('gemini-4-argon','2026-11-30'), m.cena('gemini-4-argon','2026-12-01'), m.cena('gemini-3.1-pro-preview','2027-06-01'), m.cena('gemini-3.8-flash','2027-01-01')]))`))
      .toEqual([{ od: '2026-01-01', we: 2, wy: 10 }, { od: '2026-12-01', we: 4, wy: 20 }, { od: '2026-01-01', we: 2, wy: 12 }, { od: '2027-01-01', we: 1.5, wy: 7.5 }]);
    expect(() => run(`m.cena('gpt-x')`)).toThrow();
  });
  test('koszt z usage: wejście + (wyjście + myślenie) po cenie wyjścia; brak usage = 0', () => {
    expect(run(`console.log(m.kosztUsd({ total_input_tokens: 1e6, total_output_tokens: 5e5, total_thought_tokens: 5e5 }, 'gemini-4-argon', '2026-11-01'))`)).toBeCloseTo(2 + 10, 6);
    expect(run(`console.log(m.kosztUsd({ total_input_tokens: 1e6, total_output_tokens: 5e5, total_thought_tokens: 5e5 }, 'gemini-4-argon', '2026-12-01'))`)).toBeCloseTo(4 + 20, 6);
    expect(run(`console.log(m.kosztUsd(null, 'gemini-4-argon'))`)).toBe(0);
  });
  test('domyślny limit 3 USD i 4 próby; limit w opisie workflowu zgodny ze skryptem', () => {
    expect(run('console.log(JSON.stringify([m.LIMIT_USD, m.PROBY]))')).toEqual([3, 4]);
    expect(wf).toMatch(/limit_usd:[\s\S]*?default: '3'/); expect(wf).toMatch(/proby:[\s\S]*?default: '4'/);
  });
});

describe('gemini-pozy: argumenty, ćwiczenia, wskazówki, prompt, odpowiedź', () => {
  test('argumenty: domyślne i poprawne wartości; błędne odrzucone (rodzina, model, limit, próby, nieznany)', () => {
    expect(run(`console.log(JSON.stringify(m.parsujArgumenty(['--rodzina','pull_up','--model','gemini-3.1-pro-preview','--limit-usd','1.5','--proby','2','--szacuj','--cwiczenia','Pull Up, Chin Up'])))`))
      .toMatchObject({ rodzina: 'pull_up', model: 'gemini-3.1-pro-preview', limitUsd: 1.5, proby: 2, szacuj: true, cwiczenia: ['Pull Up', 'Chin Up'] });
    expect(run(`console.log(JSON.stringify(m.parsujArgumenty([])))`)).toMatchObject({ model: 'gemini-4-argon', limitUsd: 3, proby: 4, szacuj: false, wyjscie: 'raport-pozy' });
    for (const bad of ["['--rodzina','Pull Up']", "['--rodzina','x;rm']", "['--model','gpt']", "['--limit-usd','0']", "['--limit-usd','99']", "['--proby','9']", "['--nic']", "['--model']"]) expect(() => run(`m.parsujArgumenty(${bad})`)).toThrow();
  });
  test('ćwiczenia rodziny z docs/51 i błąd dla nieznanej rodziny lub braku pliku', () => {
    const fx = fixture(); const p = JSON.stringify(path.join(fx, 'docs/51-figury-v2-pokrycie.md'));
    expect(run(`console.log(JSON.stringify(m.cwiczeniaRodziny('pull_up', ${p})))`)).toEqual(['Pull Up', 'Chin Up', 'Dead Hang']);
    expect(run(`console.log(JSON.stringify(m.cwiczeniaRodziny('pulldown', ${p})))`)).toEqual(['Lat Pulldown']);
    expect(() => run(`m.cwiczeniaRodziny('nie_ma', ${p})`)).toThrow(); expect(() => run(`m.cwiczeniaRodziny('pull_up', '/nie/ma.md')`)).toThrow();
  });
  test('wskazówki i błędy ćwiczenia z cue-sets.json + tekstów; brak wpisu = puste listy', () => {
    const fx = fixture(); const R = JSON.stringify(fx);
    expect(run(`console.log(JSON.stringify(m.wskazowki('Pull Up', ${R})))`)).toEqual({ ok: [{ id: 'hang.ribs', tekst: 'Żebra opuszczone, brzuch napięty.' }], bledy: [{ id: 'hang.swing', tekst: 'Bujanie nogami.' }] });
    expect(run(`console.log(JSON.stringify(m.wskazowki('Chin Up', ${R})))`)).toEqual({ ok: [], bledy: [] });
  });
  test('prompt: kontrakt, przykład gotowej rodziny, wskazówki i błędy ✕; przy poprawce poprzednia odpowiedź i konkretny komunikat walidacji; bez klucza', () => {
    const base = `{ rodzina: 'pull_up', cwiczenie: 'Pull Up', opis: 'kat = kąt', przyklady: [{ cwiczenie: 'Back Squat', poza: { kat: 42 } }], wsk: { ok: [{ id: 'a', tekst: 'Żebra w dół' }], bledy: [{ id: 'b', tekst: 'Bujanie' }] }`;
    const p1 = run(`console.log(JSON.stringify(m.budujPrompt(${base} })))`);
    expect(p1).toContain('Rodzina ruchu: pull_up'); expect(p1).toContain('kat = kąt'); expect(p1).toContain('"cwiczenie":"Back Squat"'); expect(p1).toContain('- Żebra w dół'); expect(p1).toContain('- b: Bujanie'); expect(p1).toContain('Wygeneruj dane póz dla ćwiczenia „Pull Up”');
    const p2 = run(`console.log(JSON.stringify(m.budujPrompt(${base}, poprzednia: { poza: { kat: 180 }, bledy: [{ kod: 'zakres', szczegol: 'kat=180 poza 0..100 (łokieć)' }] } })))`);
    expect(p2).toContain('{"kat":180}'); expect(p2).toContain('- zakres: kat=180 poza 0..100 (łokieć)'); expect(p2).not.toContain('Wygeneruj dane');
    expect(run('console.log(JSON.stringify(m.SYSTEM))')).not.toMatch(/GEMINI_API_KEY|AIza/);
  });
  test('odpowiedź Interaction: tekst z kroków model_output, usage, status; JSON w bloku kodu; niepoprawny JSON = błąd', () => {
    expect(run(`console.log(JSON.stringify(m.odczytajOdpowiedz({ status: 'completed', usage: { total_input_tokens: 3 }, steps: [{ type: 'thought' }, { type: 'model_output', content: [{ type: 'text', text: '{"a":' }, { type: 'text', text: '1}' }] }] })))`))
      .toEqual({ tekst: '{"a":1}', uzycie: { total_input_tokens: 3 }, status: 'completed' });
    expect(run(`console.log(JSON.stringify(m.odczytajOdpowiedz({})))`)).toEqual({ tekst: '', uzycie: null, status: null });
    expect(run('console.log(JSON.stringify(m.parsujPoze("```json\\n{\\"kat\\": 5}\\n```")))')).toEqual({ poza: { kat: 5 }, blad: null });
    expect(run('console.log(JSON.stringify(m.parsujPoze("nie json")))').blad).toMatch(/niepoprawny JSON/);
  });
});

describe('gemini-pozy: przebieg z atrapą (bez sieci)', () => {
  test('--szacuj: zero połączeń, tylko szacunek.json w katalogu wyniku; działa także bez kontraktu (wejście z założenia); koszt rośnie z liczbą ćwiczeń', () => {
    const fx = fixture({ kontrakt: false }); const snap = fs.readdirSync(fx).sort();
    const r = runMain(fx, ['--rodzina', 'pull_up', '--szacuj'], {}, []);
    expect(r.code).toBe(0); expect(r.calls).toHaveLength(0); expect(r.files).toEqual(['szacunek.json']); expect(fs.readdirSync(fx).sort()).toEqual([...snap, 'wyjscie'].sort());
    const s = JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/szacunek.json'), 'utf8'));
    expect(s).toMatchObject({ cwiczen: 3, kontrakt: false, limit_usd: 3, model: 'gemini-4-argon' }); expect(s.koszt_usd).toBeGreaterThan(0);
    expect(run(`const a = m.szacunek({ model: 'gemini-4-argon', liczbaCwiczen: 13, tokenyWejsciaNaProbe: 6000, dzis: '2026-11-01' }); const b = m.szacunek({ model: 'gemini-4-argon', liczbaCwiczen: 600, tokenyWejsciaNaProbe: 6000, dzis: '2026-11-01' }); console.log(JSON.stringify([a.koszt_usd, b.koszt_usd]))`)[1]).toBeGreaterThan(20);
  });
  test('bez klucza i bez --szacuj: kod 2, zero połączeń; bez kontraktu: kod 4', () => {
    const fx = fixture(); const r = runMain(fx, ['--rodzina', 'pull_up'], {}, []);
    expect(r.code).toBe(2); expect(r.calls).toHaveLength(0);
    const fy = fixture({ kontrakt: false }); const r2 = runMain(fy, ['--rodzina', 'pull_up'], { GEMINI_API_KEY: 'k' }, []);
    expect(r2.code).toBe(4); expect(r2.calls).toHaveLength(0); expect(r2.log.join('\n')).toMatch(/v2-validate\.mjs/);
  });
  test('pętla: 1. ćwiczenie OK za pierwszym razem, 2. po jednej poprawce (komunikat walidacji odesłany), 3. nie przechodzi w 2 próbach; poze.json tylko z poprawnych; klucz tylko w nagłówku', () => {
    const fx = fixture(); const snap = snapshot(fx);
    const r = runMain(fx, ['--rodzina', 'pull_up', '--proby', '2', '--limit-usd', '3'], { GEMINI_API_KEY: 'sekretny-klucz-testowy' }, [50, 180, 60, 190, 191]);
    expect(r.code).toBe(0); expect(r.calls).toHaveLength(5);
    expect(r.files).toEqual(['koszt.json', 'podsumowanie.md', 'poze.json', 'raport.json', 'szacunek.json']);
    expect(r.calls[0].url).toBe('https://generativelanguage.googleapis.com/v1beta/interactions'); expect(r.calls[0].headers['x-goog-api-key']).toBe('sekretny-klucz-testowy');
    expect(r.calls[0].body).toMatchObject({ model: 'gemini-4-argon', response_format: { type: 'text', mime_type: 'application/json' }, generation_config: { max_output_tokens: 16000 } });
    expect(r.calls[0].body.input).toContain('Pull Up'); expect(r.calls[0].body.input).toContain('Bujanie nogami'); expect(r.calls[0].body.input).toContain('"cwiczenie":"Back Squat"');
    expect(r.calls[2].body.input).toContain('kat=180 poza 0..100 (łokieć)'); /* poprawka Chin Up: błąd z poprzedniej próby odesłany */
    const rap = JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/raport.json'), 'utf8')); const [a, b, c] = rap.wyniki;
    expect([a.ok, a.pierwsza_proba_ok, a.proby]).toEqual([true, true, 1]);
    expect([b.cwiczenie, b.ok, b.pierwsza_proba_ok, b.poprawki, b.proby]).toEqual(['Chin Up', true, false, 1, 2]);
    expect([c.cwiczenie, c.ok, c.przerwane, c.proby]).toEqual(['Dead Hang', false, 'proby', 2]);
    expect(JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/poze.json'), 'utf8')).poze).toEqual({ 'Pull Up': { kat: 50 }, 'Chin Up': { kat: 60 } });
    const koszt = JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/koszt.json'), 'utf8'));
    expect(koszt.koszt_usd).toBeCloseTo(5 * (2000 * 2 + 2000 * 10) / 1e6, 6); expect(koszt.wywolan).toBe(5);
    const md = fs.readFileSync(path.join(fx, 'wyjscie/podsumowanie.md'), 'utf8'); expect(md).toContain('| przeszło walidację | 2 (67%) |'); expect(md).toContain('| za pierwszym razem | 1 (33%) |'); expect(md).toContain('Dead Hang (proby)');
    for (const f of r.files) expect(fs.readFileSync(path.join(fx, 'wyjscie', f), 'utf8')).not.toContain('sekretny-klucz-testowy');
    expect(r.log.join('\n')).not.toContain('sekretny-klucz-testowy'); expect(snapshot(fx)).toBe(snap); /* nic poza katalogiem wyniku */
  });
  test('twardy limit kosztu: wywołanie, którego górna granica kosztu nie mieści się w limicie, nie jest wysyłane; reszta ćwiczeń „limit”, kod 3, suma nigdy ponad limit', () => {
    const fx = fixture(); const r = runMain(fx, ['--rodzina', 'pull_up', '--limit-usd', '0.5'], { GEMINI_API_KEY: 'k' }, [50, 50, 50]);
    /* górna granica jednego wywołania ≈ 16000 tokenów wyjścia po 10 USD/mln = 0,16 USD + wejście; faktyczny koszt atrapy 0,024 USD */
    const rap = JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/raport.json'), 'utf8'));
    expect(rap.wyniki.reduce((s: number, x: any) => s + x.koszt_usd, 0)).toBeLessThanOrEqual(0.5); expect(r.code).toBe(0);
    const fy = fixture(); const r2 = runMain(fy, ['--rodzina', 'pull_up', '--limit-usd', '0.05'], { GEMINI_API_KEY: 'k' }, [50, 50, 50]);
    expect(r2.code).toBe(3); expect(r2.calls).toHaveLength(0); /* limit mniejszy niż górna granica pierwszego wywołania → ani jednego płatnego połączenia */
    const rap2 = JSON.parse(fs.readFileSync(path.join(fy, 'wyjscie/raport.json'), 'utf8'));
    expect(rap2.wyniki.map((x: any) => x.przerwane)).toEqual(['limit', 'limit', 'limit']);
    /* limit pęka w trakcie przebiegu: 0,18 USD mieści jedno wywołanie (granica ≈ 0,17), po nim (0,024 wydane) kolejne już nie */
    const fz = fixture(); const r3 = runMain(fz, ['--rodzina', 'pull_up', '--limit-usd', '0.18'], { GEMINI_API_KEY: 'k' }, [50, 50, 50]);
    expect(r3.code).toBe(3); expect(r3.calls).toHaveLength(1);
    expect(JSON.parse(fs.readFileSync(path.join(fz, 'wyjscie/raport.json'), 'utf8')).wyniki.map((x: any) => x.przerwane)).toEqual([null, 'limit', 'limit']);
  });
  test('błąd API (400) nie zdradza klucza, kończy ćwiczenie jako „api” i daje kod 1; 429 jest ponawiane i kończy się sukcesem', () => {
    const fx = fixture(); const r = runMain(fx, ['--rodzina', 'pulldown'], { GEMINI_API_KEY: 'tajny' }, ['blad400']);
    expect(r.code).toBe(1); const rap = JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/raport.json'), 'utf8'));
    expect(rap.wyniki[0]).toMatchObject({ ok: false, przerwane: 'api' }); expect(JSON.stringify(rap)).toContain('API 400: zły schemat'); expect(JSON.stringify(rap)).not.toContain('tajny');
    const fy = fixture(); const r2 = runMain(fy, ['--rodzina', 'pulldown'], { GEMINI_API_KEY: 'k' }, ['http429', 'http429', 40]);
    expect(r2.code).toBe(0); expect(r2.calls).toHaveLength(3);
  });
  test('--cwiczenia zawęża listę; --zastosuj deleguje do walidatora (zastosuj) i nie potrzebuje klucza ani sieci', () => {
    const fx = fixture(); const r = runMain(fx, ['--rodzina', 'pull_up', '--cwiczenia', 'Chin Up'], { GEMINI_API_KEY: 'k' }, [10]);
    expect(r.calls).toHaveLength(1); expect(r.calls[0].body.input).toContain('Chin Up');
    const z = runMain(fx, ['--zastosuj', path.join(fx, 'wyjscie')], {}, []); expect(z.code).toBe(0); expect(z.log).toEqual(['{"nalozono":1}']);
  });
});

describe('workflow gemini-figury.yml (strażnik)', () => {
  test('tylko workflow_dispatch; odczyt repozytorium; model z listy dozwolonych (zgodnej ze skryptem), domyślnie flagowy; tylko_szacuj domyślnie true', () => {
    expect(wf).toMatch(/^on:\n  workflow_dispatch:/m); expect(wf).not.toMatch(/^\s+(push|pull_request|schedule|workflow_run|repository_dispatch):/m);
    expect(wf).toMatch(/permissions:\n  contents: read/); expect(wf).not.toMatch(/contents: write|git (commit|push)/);
    expect(wf).toMatch(/model:[\s\S]*?default: gemini-4-argon[\s\S]*?options: \[gemini-4-argon, gemini-3\.1-pro-preview, gemini-3\.8-flash\]/);
    expect(run('console.log(JSON.stringify(m.MODELE))')).toEqual(['gemini-4-argon', 'gemini-3.1-pro-preview', 'gemini-3.8-flash']);
    expect(wf).toMatch(/tylko_szacuj:[\s\S]*?default: true/); expect(wf).toMatch(/rodzina:[\s\S]*?default: pull_up/);
    expect(wf).toMatch(/concurrency:\n  group: gemini-figury\n  cancel-in-progress: false/);
  });
  test('sekret GEMINI_API_KEY w jednym kroku, jako zmienna środowiskowa; nigdy w run/echo; bez innych sekretów; wejścia tylko przez env', () => {
    expect(wf.match(/secrets\.[A-Z_0-9]+/g)).toEqual(['secrets.GEMINI_API_KEY']);
    const z = wf.split(/\n      - /).filter(s => /secrets\.GEMINI_API_KEY/.test(s));
    expect(z).toHaveLength(1); expect(z[0]).toMatch(/env:\n\s+GEMINI_API_KEY: \$\{\{ secrets\.GEMINI_API_KEY \}\}/); expect(z[0]).toMatch(/if: \$\{\{ !inputs\.tylko_szacuj \}\}/);
    expect(wf).not.toMatch(/echo[^\n]*GEMINI_API_KEY/);
    for (const blok of wf.split(/\n        run: \|\n/).slice(1)) expect(blok.split('\n      - ')[0]).not.toContain('${{');
  });
  test('krok szacunku bez klucza poprzedza generowanie; artefakt tylko raporty, 7 dni', () => {
    const iSz = wf.indexOf('Szacunek kosztu bez klucza'), iGen = wf.indexOf('- name: Generowanie póz');
    expect(iSz).toBeGreaterThan(0); expect(iGen).toBeGreaterThan(iSz); expect(wf.slice(iSz, iGen)).not.toMatch(/GEMINI_API_KEY/); expect(wf.slice(iSz, iGen)).toMatch(/--szacuj/);
    expect(wf).toMatch(/upload-artifact@v4[\s\S]*?name: raport-pozy[\s\S]*?raport-pozy\/\*\.json[\s\S]*?podsumowanie\.md[\s\S]*?retention-days: 7/);
  });
  test('skrypt: zapisuje tylko w katalogu wyniku (nie w repozytorium); klucz tylko z env i w nagłówku', () => {
    const s = fs.readFileSync(SCRIPT, 'utf8'); const main = s.slice(s.indexOf('export async function main'));
    for (const m of main.match(/writeFileSync\([^\n]*/g) ?? []) expect(m).toMatch(/join\(o\.wyjscie/);
    expect(s.match(/GEMINI_API_KEY/g)!.length).toBeGreaterThan(0); expect(s).not.toMatch(/console\.(log|error)\([^)]*klucz/); expect(s).not.toMatch(/AIza[0-9A-Za-z_-]{20}/);
  });
});
