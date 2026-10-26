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
/** Uruchamia main() z atrapą fetch (odpowiedzi z kolejki `odp`: liczba kat, 'probe' = odpowiedź próby połączenia, 'http401'/'http402'/'http403'/'http429'/'blad400'/'http503');
 *  kształt odpowiedzi zależy od `--api` (domyślnie w tych testach `gemini`; vertex = generateContent). Zwraca kod, log, wywołania i pliki wyniku. */
function runMain(root: string, args0: string[], env: Record<string, string>, odp: (string | number)[], limit = ''): { code: number; log: string[]; calls: any[]; files: string[] } {
  const out = path.join(root, 'wyjscie');
  const args = args0.includes('--api') ? args0 : [...args0, '--api', 'gemini'];
  const vertex = args[args.indexOf('--api') + 1] === 'vertex';
  const code = `
    const calls = []; const q = ${JSON.stringify(odp)}; const log = [];
    const usage = { total_input_tokens: 2000, total_output_tokens: 1000, total_thought_tokens: 1000, total_tokens: 4000 };
    const usageV = { promptTokenCount: 2000, candidatesTokenCount: 1000, thoughtsTokenCount: 1000, totalTokenCount: 4000 };
    const err = { http401: 401, http402: 402, http403: 403, http404: 404, http429: 429, blad400: 400, http503: 503 }; const msg = { http401: 'API key not valid. tajny-klucz-z-echa', blad400: 'zły schemat', http429: 'za dużo', http404: 'Publisher model projects/123456789012/locations/us-central1/publishers/google/models/gemini-4-argon was not found or your project does not have access to it' };
    const fetchFn = async (url, init) => { calls.push({ url, headers: init.headers, body: init.body ? JSON.parse(init.body) : null }); const x = q.shift();
      if (typeof x === 'string' && err[x]) return { ok: false, status: err[x], json: async () => ({ error: { message: msg[x] ?? 'błąd ' + err[x] } }) };
      if (x === undefined) throw new Error('nieoczekiwane wywołanie sieci');
      const tekst = JSON.stringify(x === 'probe' ? { ok: true } : { kat: x });
      if (${vertex}) return { ok: true, status: 200, json: async () => ({ candidates: [{ content: { role: 'model', parts: [{ text: 'myśl', thought: true }, { text: tekst }] }, finishReason: 'STOP' }], usageMetadata: usageV }) };
      return { ok: true, status: 200, json: async () => ({ status: 'completed', steps: [{ type: 'model_output', content: [{ type: 'text', text: tekst }] }], usage }) }; };
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

describe('gemini-pozy: tryb vertex (Agent Platform z kluczem API, docs/52 pkt 6; odczyt 26.10.2026)', () => {
  test('--api: domyślnie vertex, dozwolone vertex i gemini, inne odrzucone; endpoint globalny bez projektu', () => {
    expect(run(`console.log(JSON.stringify([m.API_TRYBY, m.DOMYSLNY_API, m.parsujArgumenty([]).api, m.parsujArgumenty(['--api','gemini']).api, m.parsujArgumenty(['--api','vertex']).api]))`)).toEqual([['vertex', 'gemini'], 'vertex', 'vertex', 'gemini', 'vertex']);
    for (const bad of ["['--api','azure']", "['--api']", "['--api','']"]) expect(() => run(`m.parsujArgumenty(${bad})`)).toThrow();
    expect(run(`console.log(JSON.stringify(m.endpointVertex('gemini-4-argon')))`)).toBe('https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-4-argon:generateContent');
    expect(run(`console.log(JSON.stringify([m.ENDPOINT_VERTEX, m.endpointVertex('x','us'), m.endpointVertex('x','eu')]))`).join(' ')).not.toMatch(/projects|locations|[?&]key=/); /* ani projekt, ani klucz w adresie */
  });
  test('cennik Vertex (strona cennika Agent Platform, region global, standard): Argon liczony od ceny listowej 4/20 (do 30.11 promocja = 50% zwrotu w kredytach), 3.1 Pro 2/12, 3.8 Flash 0,75/3,75 do końca 2026', () => {
    expect(run(`console.log(JSON.stringify([m.cena('gemini-4-argon','2026-11-30','vertex'), m.cena('gemini-4-argon','2026-12-01','vertex'), m.cena('gemini-3.1-pro-preview','2026-11-01','vertex'), m.cena('gemini-3.8-flash','2026-12-31','vertex'), m.cena('gemini-3.8-flash','2027-01-01','vertex')]))`))
      .toEqual([{ od: '2026-01-01', we: 4, wy: 20, promo: 0.5 }, { od: '2026-12-01', we: 4, wy: 20 }, { od: '2026-01-01', we: 2, wy: 12 }, { od: '2026-01-01', we: 0.75, wy: 3.75 }, { od: '2027-01-01', we: 1.5, wy: 7.5 }]);
    const u = '{ total_input_tokens: 1e6, total_output_tokens: 5e5, total_thought_tokens: 5e5 }';
    expect(run(`console.log(m.kosztUsd(${u}, 'gemini-4-argon', '2026-11-01', 'vertex'))`)).toBeCloseTo(4 + 20, 6);
    expect(run(`console.log(m.kosztNettoUsd(${u}, 'gemini-4-argon', '2026-11-01', 'vertex'))`)).toBeCloseTo((4 + 20) / 2, 6);
    expect(run(`console.log(m.kosztNettoUsd(${u}, 'gemini-4-argon', '2026-12-01', 'vertex'))`)).toBeCloseTo(24, 6);
    expect(run(`console.log(m.kosztUsd(${u}, 'gemini-4-argon', '2026-11-01'))`)).toBeCloseTo(12, 6); /* tryb gemini bez zmian */
  });
  test('odpowiedź generateContent: tekst bez części „thought”, status z finishReason, usage (prompt, candidates, myślenie) → wspólny kształt; zablokowane i puste', () => {
    const o = `{ candidates: [{ content: { parts: [{ text: 'myśl', thought: true }, { text: '{"a":' }, { text: '1}' }] }, finishReason: 'STOP' }], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5, thoughtsTokenCount: 7, toolUsePromptTokenCount: 2, totalTokenCount: 24 } }`;
    expect(run(`console.log(JSON.stringify(m.odczytajOdpowiedz(${o})))`)).toEqual({ tekst: '{"a":1}', uzycie: { total_input_tokens: 12, total_output_tokens: 5, total_thought_tokens: 7, total_tokens: 24 }, status: 'completed' });
    expect(run(`console.log(JSON.stringify(m.odczytajOdpowiedz({ candidates: [{ content: { parts: [{ text: '{' }] }, finishReason: 'MAX_TOKENS' }] })))`).status).toBe('max_tokens');
    expect(run(`console.log(JSON.stringify(m.odczytajOdpowiedz({ promptFeedback: { blockReason: 'SAFETY' } })))`)).toEqual({ tekst: '', uzycie: null, status: 'zablokowane: safety' });
    /* koszt z usage vertex: wejście 2000 + (wyjście 1000 + myślenie 1000) po cenie Argon (listowa 4/20) */
    expect(run(`console.log(m.kosztUsd(m.odczytajOdpowiedz({ candidates: [], usageMetadata: { promptTokenCount: 2000, candidatesTokenCount: 1000, thoughtsTokenCount: 1000 } }).uzycie, 'gemini-4-argon', '2026-12-05', 'vertex'))`)).toBeCloseTo((2000 * 4 + 2000 * 20) / 1e6, 9);
  });
  test('maskuj: klucz dosłowny i w kształcie klucza Google zastąpiony; krótki lub pusty klucz nie psuje tekstu', () => {
    expect(run(`console.log(JSON.stringify(m.maskuj('błąd klucz-abc-123 oraz klucz-abc-123', 'klucz-abc-123')))`)).toBe('błąd *** oraz ***');
    expect(run(`console.log(JSON.stringify(m.maskuj('x AIza' + 'SyA1234567890abcdefghij_klmn y', '')))`)).toBe('x *** y');
    expect(run(`console.log(JSON.stringify(m.maskuj('tekst', '')))`)).toBe('tekst');
  });
  test('przebieg vertex: pierwsze wywołanie to próba połączenia (mały limit wyjścia), potem pętla; nagłówek x-goog-api-key, globalny adres, brak klucza w URL i ciele; koszt z usageMetadata (próba wliczona)', () => {
    const fx = fixture(); const snap = snapshot(fx);
    const r = runMain(fx, ['--api', 'vertex', '--rodzina', 'pull_up', '--proby', '2', '--limit-usd', '3'], { GEMINI_API_KEY: 'sekretny-klucz-testowy' }, ['probe', 50, 180, 60, 190, 191]);
    expect(r.code).toBe(0); expect(r.calls).toHaveLength(6);
    expect(r.calls[0].url).toBe('https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-4-argon:generateContent');
    expect(r.calls.every((c: any) => c.url === r.calls[0].url && c.headers['x-goog-api-key'] === 'sekretny-klucz-testowy')).toBe(true);
    expect(r.calls[0].body.generationConfig).toMatchObject({ responseMimeType: 'application/json', maxOutputTokens: 1024, responseJsonSchema: { type: 'object', properties: { ok: { type: 'boolean' } } } });
    expect(r.calls[0].body.contents[0].parts[0].text).toContain('"ok": true'); expect(r.calls[0].body.systemInstruction.parts[0].text).toBeTruthy();
    expect(r.calls[1].body.generationConfig).toMatchObject({ responseMimeType: 'application/json', maxOutputTokens: 16000, responseJsonSchema: { type: 'object', properties: { kat: { type: 'number' } } } });
    expect(r.calls[1].body.contents[0].parts[0].text).toContain('Pull Up'); expect(r.calls[3].body.contents[0].parts[0].text).toContain('kat=180 poza 0..100 (łokieć)');
    for (const c of r.calls) { expect(JSON.stringify(c.body)).not.toContain('sekretny-klucz-testowy'); expect(c.url).not.toMatch(/key=|projects/); expect(c.body.model).toBeUndefined(); }
    const rap = JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/raport.json'), 'utf8'));
    expect(rap.api).toBe('vertex'); expect(rap.polaczenie).toMatchObject({ ok: true }); expect(rap.wyniki.map((x: any) => x.ok)).toEqual([true, true, false]);
    expect(JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/poze.json'), 'utf8')).poze).toEqual({ 'Pull Up': { kat: 50 }, 'Chin Up': { kat: 60 } });
    const kosztWywolania = (2000 * 4 + 2000 * 20) / 1e6; /* Argon, cena listowa */
    const koszt = JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/koszt.json'), 'utf8'));
    expect(koszt.koszt_usd).toBeCloseTo(6 * kosztWywolania, 6); expect(koszt.wywolan).toBe(6); expect(koszt.api).toBe('vertex');
    expect(koszt.koszt_po_promocji_usd).toBeCloseTo(3 * kosztWywolania, 6); /* data atrapy 2026-11-01: promocja 50% */
    for (const f of r.files) expect(fs.readFileSync(path.join(fx, 'wyjscie', f), 'utf8')).not.toContain('sekretny-klucz-testowy');
    expect(r.log.join('\n')).not.toContain('sekretny-klucz-testowy'); expect(r.log.join('\n')).toMatch(/próba połączenia \(vertex, gemini-4-argon, format jsonSchema\): OK/); expect(snapshot(fx)).toBe(snap);
  });
  test.each([[401, 'http401', 'GEMINI_API_KEY'], [402, 'http402', 'kredyt'], [403, 'http403', 'uprawnie'], [429, 'http429', 'przydzia']])('próba połączenia kończy się %i: czytelny komunikat, STOP bez dalszych prób (jedno wywołanie, brak ponowień), reszta „api”, kod 5, klucz zamaskowany', (_k, kod, fraza) => {
    const fx = fixture(); const r = runMain(fx, ['--api', 'vertex', '--rodzina', 'pull_up'], { GEMINI_API_KEY: 'tajny-klucz-z-echa' }, [kod, 50, 50, 50, 50]);
    expect(r.code).toBe(5); expect(r.calls).toHaveLength(1);
    const log = r.log.join('\n'); expect(log).toMatch(/PRÓBA POŁĄCZENIA NIEUDANA — STOP bez dalszych prób/); expect(log).toContain(String(_k)); expect(log.toLowerCase()).toContain(fraza.toLowerCase());
    const rap = JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/raport.json'), 'utf8'));
    expect(rap.polaczenie).toMatchObject({ ok: false }); expect(rap.wyniki.map((x: any) => x.przerwane)).toEqual(['api', 'api', 'api']);
    expect(fs.readFileSync(path.join(fx, 'wyjscie/podsumowanie.md'), 'utf8')).toMatch(/PRZEBIEG ZATRZYMANY/);
    for (const f of r.files) expect(fs.readFileSync(path.join(fx, 'wyjscie', f), 'utf8')).not.toContain('tajny-klucz-z-echa'); expect(log).not.toContain('tajny-klucz-z-echa');
    expect(JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/koszt.json'), 'utf8')).koszt_usd).toBe(0);
  });
  test('429 w trakcie pętli (po udanej próbie) zatrzymuje cały przebieg bez ponowień: kolejne ćwiczenia „api”, poprawne wcześniejsze zachowane, kod 5', () => {
    const fx = fixture(); const r = runMain(fx, ['--api', 'vertex', '--rodzina', 'pull_up'], { GEMINI_API_KEY: 'k' }, ['probe', 50, 'http429', 50, 50]);
    expect(r.code).toBe(5); expect(r.calls).toHaveLength(3);
    const rap = JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/raport.json'), 'utf8'));
    expect(rap.wyniki.map((x: any) => [x.ok, x.przerwane])).toEqual([[true, null], [false, 'api'], [false, 'api']]);
    expect(JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/poze.json'), 'utf8')).poze).toEqual({ 'Pull Up': { kat: 50 } }); expect(r.log.join('\n')).toMatch(/STOP bez dalszych prób: API 429/);
  });
  test('401/403 w trybie gemini też kończą przebieg bez ponowień; 5xx w vertex jest ponawiane (2 razy) i kończy sukcesem; 400 we wszystkich formatach próby = stop (kod 5)', () => {
    const fx = fixture(); const r = runMain(fx, ['--api', 'gemini', '--rodzina', 'pull_up'], { GEMINI_API_KEY: 'k' }, ['http403', 50, 50]);
    expect(r.code).toBe(5); expect(r.calls).toHaveLength(1);
    const fy = fixture(); const r2 = runMain(fy, ['--api', 'vertex', '--rodzina', 'pulldown'], { GEMINI_API_KEY: 'k' }, ['probe', 'http503', 'http503', 40]);
    expect(r2.code).toBe(0); expect(r2.calls).toHaveLength(4);
    const fz = fixture(); const r3 = runMain(fz, ['--api', 'vertex', '--rodzina', 'pulldown'], { GEMINI_API_KEY: 'k' }, ['blad400', 'blad400', 'blad400', 'blad400', 'blad400']);
    expect(r3.code).toBe(5); expect(r3.calls).toHaveLength(5); expect(r3.log.join('\n')).toMatch(/PRÓBA POŁĄCZENIA NIEUDANA[\s\S]*API 400[\s\S]*zły schemat/);
  });
  test('twardy limit kosztu w vertex: limit mniejszy niż koszt próby połączenia = ani jednego połączenia płatnego w pętli; suma (próba + pętla) nie przekracza limitu', () => {
    const fx = fixture(); const r = runMain(fx, ['--api', 'vertex', '--rodzina', 'pull_up', '--limit-usd', '0.001'], { GEMINI_API_KEY: 'k' }, ['probe', 50, 50, 50]);
    expect(r.calls).toHaveLength(0); expect(r.code).toBe(3);
    const fy = fixture(); const r2 = runMain(fy, ['--api', 'vertex', '--rodzina', 'pull_up', '--limit-usd', '0.5'], { GEMINI_API_KEY: 'k' }, ['probe', 50, 50, 50]);
    const k = JSON.parse(fs.readFileSync(path.join(fy, 'wyjscie/koszt.json'), 'utf8')); expect(k.koszt_usd).toBeLessThanOrEqual(0.5); expect(r2.calls.length).toBeGreaterThan(0);
  });
});

describe('gemini-pozy: prywatność odpowiedzi błędów, 404 jako twardy stop, lokalizacja, lista modeli (lekcja L-035, 26.10.2026)', () => {
  test('maskuj: ścieżka zasobu z numerem projektu, „project <numer>” i długie ciągi cyfr zamaskowane; zwykłe słowa i liczby tokenów bez zmian', () => {
    const w = run(`console.log(JSON.stringify(m.maskuj('Publisher model \`projects/123456789012/locations/us-central1/publishers/google/models/gemini-4-argon\` not found; project 987654 x; projects/moj-projekt-1/y; konto 12345678901234; rola projektu albo model; tokeny 2000, koszt 0.0123')))`);
    expect(w).not.toMatch(/123456789012|987654|moj-projekt-1|12345678901234/);
    expect(w).toContain('projects/***/locations/us-central1/publishers/google/models/gemini-4-argon'); expect(w).toContain('rola projektu albo model'); expect(w).toContain('tokeny 2000, koszt 0.0123');
  });
  test('404 z numerem projektu w treści: po PIERWSZYM ćwiczeniu stop całego przebiegu (jedno wywołanie), reszta „api”, kod 5; numer projektu nigdzie (log, raport, podsumowanie, koszt, wszystkie pliki)', () => {
    const fx = fixture(); const r = runMain(fx, ['--api', 'vertex', '--rodzina', 'pull_up'], { GEMINI_API_KEY: 'k' }, ['probe', 'http404', 50, 50]);
    expect(r.code).toBe(5); expect(r.calls).toHaveLength(2); /* próba połączenia + pierwsze ćwiczenie */
    const rap = JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/raport.json'), 'utf8')); expect(rap.wyniki.map((x: any) => x.przerwane)).toEqual(['api', 'api', 'api']);
    expect(r.log.join('\n')).toMatch(/404/); expect(r.log.join('\n')).toMatch(/--lokalizacja|lista_modeli/);
    for (const f of r.files) expect(fs.readFileSync(path.join(fx, 'wyjscie', f), 'utf8')).not.toMatch(/123456789012/); expect(r.log.join('\n')).not.toMatch(/123456789012/);
    const fy = fixture(); const r2 = runMain(fy, ['--api', 'vertex', '--rodzina', 'pull_up'], { GEMINI_API_KEY: 'k' }, ['http404', 50]);
    expect(r2.code).toBe(5); expect(r2.calls).toHaveLength(1); expect(r2.log.join('\n')).not.toMatch(/123456789012/);
  });
  test('--lokalizacja: global (domyślnie), us, eu wybierają host bez projektu w adresie; inne odrzucone; wywołanie z lokalizacją us trafia na host us', () => {
    expect(run(`console.log(JSON.stringify([m.LOKALIZACJE, m.DOMYSLNA_LOKALIZACJA, m.parsujArgumenty([]).lokalizacja, m.hostVertex('global'), m.hostVertex('us'), m.hostVertex('eu'), m.endpointVertex('gemini-4-argon','eu')]))`))
      .toEqual([['global', 'us', 'eu'], 'global', 'global', 'aiplatform.googleapis.com', 'us-aiplatform.googleapis.com', 'eu-aiplatform.googleapis.com', 'https://eu-aiplatform.googleapis.com/v1/publishers/google/models/gemini-4-argon:generateContent']);
    for (const bad of ["['--lokalizacja','us-central1']", "['--lokalizacja']"]) expect(() => run(`m.parsujArgumenty(${bad})`)).toThrow();
    const fx = fixture(); const r = runMain(fx, ['--api', 'vertex', '--lokalizacja', 'us', '--rodzina', 'pulldown'], { GEMINI_API_KEY: 'k' }, ['probe', 40]);
    expect(r.calls[0].url).toBe('https://us-aiplatform.googleapis.com/v1/publishers/google/models/gemini-4-argon:generateContent'); expect(JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/raport.json'), 'utf8')).lokalizacja).toBe('us');
  });
  test('lista modeli: GET listy (strony) i GET każdego z naszych modeli, bez kosztu; modele.json bez klucza i projektu; 403 listy kończy z kodem 5; bez klucza kod 2', () => {
    const kod = (extra: string) => `const calls = []; const stron = { 1: { publisherModels: [{ name: 'publishers/google/models/gemini-4-argon' }, { name: 'publishers/google/models/gemini-2.5-flash' }], nextPageToken: 'T2' }, 2: { publisherModels: [{ name: 'publishers/google/models/gemini-3.8-flash' }] } };
      const fetchFn = async (url, init) => { calls.push({ url, metoda: init.method, klucz: init.headers['x-goog-api-key'], body: init.body ?? null }); ${extra} };`;
    const ok = run(kod(`if (url.includes('/v1beta1/')) return { ok: true, status: 200, json: async () => (url.includes('pageToken=T2') ? stron[2] : stron[1]) };
        return url.endsWith('gemini-3.1-pro-preview') ? { ok: false, status: 404, json: async () => ({ error: { message: 'Publisher model \`projects/123456789012/x\` not found' } }) } : { ok: true, status: 200, json: async () => ({ name: 'x' }) };`)
      + `const log = []; const w = await m.listaModeli({ fetchFn, klucz: 'k-testowy', lokalizacja: 'us', log: (s) => log.push(s) }); console.log(JSON.stringify({ w, calls, log }));`);
    expect(ok.w.lista).toEqual(['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-4-argon']);
    expect(ok.calls.every((c: any) => c.metoda === 'GET' && c.klucz === 'k-testowy' && c.body === null && c.url.startsWith('https://us-aiplatform.googleapis.com/'))).toBe(true);
    expect(ok.calls.map((c: any) => c.url)).toEqual([
      'https://us-aiplatform.googleapis.com/v1beta1/publishers/google/models?pageSize=100', 'https://us-aiplatform.googleapis.com/v1beta1/publishers/google/models?pageSize=100&pageToken=T2',
      'https://us-aiplatform.googleapis.com/v1/publishers/google/models/gemini-4-argon', 'https://us-aiplatform.googleapis.com/v1/publishers/google/models/gemini-3.1-pro-preview', 'https://us-aiplatform.googleapis.com/v1/publishers/google/models/gemini-3.8-flash']);
    expect(ok.w.sprawdzone.map((x: any) => [x.model, x.status, x.na_liscie])).toEqual([['gemini-4-argon', 200, true], ['gemini-3.1-pro-preview', 404, false], ['gemini-3.8-flash', 200, true]]);
    expect(JSON.stringify(ok)).not.toMatch(/123456789012/);
    const zakaz = run(kod(`return { ok: false, status: 403, json: async () => ({ error: { message: 'API restrictions' } }) };`) + `const log = []; const w = await m.listaModeli({ fetchFn, klucz: 'k', log: (s) => log.push(s) }); console.log(JSON.stringify({ w, n: calls.length }));`);
    expect(zakaz.w.krytyczny).toBe(403); expect(zakaz.n).toBe(1);
    const fx = fixture(); const out = path.join(fx, 'wyj');
    const wywolaj = (env: string) => run(`const log = []; const c = await m.main(['--lista-modeli', '--wyjscie', ${JSON.stringify(out)}], ${env}, { fetchFn: async (u) => ({ ok: true, status: 200, json: async () => (u.includes('v1beta1') ? { publisherModels: [{ name: 'publishers/google/models/gemini-4-argon' }] } : {}) }), log: (s) => log.push(s), root: ${JSON.stringify(fx)} }); console.log(JSON.stringify({ c, log }));`);
    expect(wywolaj("{}").c).toBe(2);
    const w2 = wywolaj("{ GEMINI_API_KEY: 'tajny-klucz-listy' }"); expect(w2.c).toBe(0);
    const modele = fs.readFileSync(path.join(out, 'modele.json'), 'utf8'); expect(modele).toContain('gemini-4-argon'); expect(modele).not.toContain('tajny-klucz-listy'); expect(JSON.stringify(w2.log)).not.toContain('tajny-klucz-listy');
    expect(fs.readdirSync(out)).toEqual(['modele.json']); /* żadnych kosztów, żadnych póz */
  });
});

describe('gemini-pozy: format żądania vertex (400 „invalid argument”), szczegóły błędu, maskowanie w skryptach tłumaczeń (26.10.2026)', () => {
  const SCH = `{ $schema: 'x', type: 'object', additionalProperties: false, properties: { kat: { type: ['number', 'null'], minimum: 0, maximum: 100, multipleOf: 1 }, t: { const: 'a' }, l: { type: 'array', items: { type: 'number' }, minItems: 2, uniqueItems: true } }, required: ['kat'] }`;
  test('treść generateContent: pięć formatów (schemat JSON, schemat JSON uproszczony, schemat OpenAPI, responseFormat, tylko tryb JSON ze schematem w poleceniu); wspólne: contents/role/parts, systemInstruction, maxOutputTokens, bez pól Interactions', () => {
    const t = (f: string) => run(`console.log(JSON.stringify(m.trescVertex({ input: 'pytanie', system: 'sys', schemat: ${SCH}, maxTokens: 777, format: '${f}' })))`);
    expect(run('console.log(JSON.stringify(m.FORMATY_VERTEX))')).toEqual(['jsonSchema', 'jsonSchemaProsty', 'openApi', 'responseFormat', 'tekst']);
    for (const f of ['jsonSchema', 'jsonSchemaProsty', 'openApi', 'responseFormat', 'tekst']) {
      const b = t(f); expect(b.contents).toEqual([{ role: 'user', parts: [{ text: expect.stringContaining('pytanie') }] }]); expect(b.systemInstruction).toEqual({ parts: [{ text: 'sys' }] });
      expect(b.generationConfig.maxOutputTokens).toBe(777); expect(Object.keys(b).sort()).toEqual(['contents', 'generationConfig', 'systemInstruction']);
    }
    expect(t('jsonSchema').generationConfig).toMatchObject({ responseMimeType: 'application/json', responseJsonSchema: { type: 'object', additionalProperties: false } });
    expect(t('jsonSchemaProsty').generationConfig.responseJsonSchema).toEqual({ type: 'object', additionalProperties: false, properties: { kat: { type: ['number', 'null'], minimum: 0, maximum: 100 }, t: { const: 'a' }, l: { type: 'array', items: { type: 'number' }, minItems: 2 } }, required: ['kat'] }); /* bez $schema, multipleOf, uniqueItems */
    expect(t('openApi').generationConfig.responseSchema).toEqual({ type: 'object', properties: { kat: { type: 'number', nullable: true, minimum: 0, maximum: 100 }, t: { enum: ['a'] }, l: { type: 'array', items: { type: 'number' }, minItems: 2 } }, required: ['kat'] });
    expect(t('responseFormat').generationConfig.responseFormat).toEqual([{ text: { mimeType: 'APPLICATION_JSON', schema: expect.objectContaining({ type: 'object' }) } }]);
    expect(t('tekst').generationConfig).toEqual({ maxOutputTokens: 777, responseMimeType: 'application/json' }); expect(t('tekst').contents[0].parts[0].text).toContain('"additionalProperties":false');
  });
  test('próba połączenia: 400 na pierwszym formacie → następny; wybrany format używany w całej pętli; odrzucone formaty w raporcie i logu', () => {
    const fx = fixture(); const r = runMain(fx, ['--api', 'vertex', '--rodzina', 'pulldown'], { GEMINI_API_KEY: 'k' }, ['blad400', 'probe', 40]);
    expect(r.code).toBe(0); expect(r.calls).toHaveLength(3);
    expect(Object.keys(r.calls[0].body.generationConfig).sort()).toEqual(['maxOutputTokens', 'responseJsonSchema', 'responseMimeType']); expect(r.calls[1].body.generationConfig.responseJsonSchema).toBeTruthy();
    expect(r.calls[2].body.generationConfig.responseJsonSchema).toEqual({ type: 'object', properties: { kat: { type: 'number' } }, required: ['kat'] }); /* pętla używa wybranego formatu */
    const rap = JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/raport.json'), 'utf8')); expect(rap.polaczenie).toMatchObject({ ok: true, format: 'jsonSchemaProsty' }); expect(rap.polaczenie.odrzucone_formaty.map((x: any) => x.format)).toEqual(['jsonSchema']);
    expect(r.log.join('\n')).toMatch(/format jsonSchemaProsty; odrzucone: jsonSchema/);
  });
  test('400 w pętli (po udanej próbie) = twardy stop po pierwszym ćwiczeniu; szczegóły error.details (fieldViolations) w raporcie, zamaskowane (klucz, numer projektu)', () => {
    const fx = fixture(); const out = path.join(fx, 'wyjscie');
    const code = `const calls = []; const q = ['probe', 'det400', 'det400', 'det400', 'det400', 'det400', 50, 50]; const log = [];
      const usageV = { promptTokenCount: 10, candidatesTokenCount: 5, thoughtsTokenCount: 5 };
      const fetchFn = async (url, init) => { calls.push(url); const x = q.shift();
        if (x === 'det400') return { ok: false, status: 400, json: async () => ({ error: { code: 400, message: 'Request contains an invalid argument.', status: 'INVALID_ARGUMENT', details: [{ '@type': 'type.googleapis.com/google.rpc.BadRequest', fieldViolations: [{ field: 'generation_config.response_json_schema', description: 'bad field in projects/123456789012/x with sekret-klucz-1' }] }] } }) };
        return { ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: x === 'probe' ? '{"ok":true}' : '{"kat":1}' }] }, finishReason: 'STOP' }], usageMetadata: usageV }) }; };
      const c = await m.main(['--api', 'vertex', '--rodzina', 'pull_up', '--wyjscie', ${JSON.stringify(out)}], { GEMINI_API_KEY: 'sekret-klucz-1' }, { fetchFn, log: (s) => log.push(s), root: ${JSON.stringify(fx)}, dzis: new Date('2026-11-01T00:00:00Z') });
      console.log(JSON.stringify({ c, n: calls.length, log }));`;
    const r = run(code); expect(r.c).toBe(5); expect(r.n).toBe(6); /* próba + żądanie we wszystkich 5 formatach */
    const raport = fs.readFileSync(path.join(out, 'raport.json'), 'utf8'); expect(raport).toContain('fieldViolations'); expect(raport).toContain('response_json_schema');
    for (const t of [raport, JSON.stringify(r.log), ...fs.readdirSync(out).map(f => fs.readFileSync(path.join(out, f), 'utf8'))]) expect(t).not.toMatch(/123456789012|sekret-klucz-1/);
    expect(JSON.parse(raport).wyniki.map((x: any) => x.przerwane)).toEqual(['api', 'api', 'api']);
  });
  test('skrypty tłumaczeń (przeklad-api, przeglad-api): błąd API i wynik batcha nie zdradzają numeru projektu ani klucza (wspólny scripts/maskuj.mjs)', () => {
    for (const f of ['przeklad-api', 'przeglad-api']) {
      const mod = JSON.stringify(path.join(ROOT, `scripts/i18n/${f}.mjs`));
      const wynik = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${mod};
        const linia = JSON.stringify({ custom_id: 'pr-de', result: { type: 'errored', error: { error: { message: 'bad projects/123456789012/x key sk-ant-api03-ABCDEFGHIJKLMNOP' } } } });
        const o = m.odczytajLinie(linia);
        let blad = null; if (m.klient) { try { await m.klient(async () => ({ ok: false, status: 404, json: async () => ({ error: { message: 'no projects/123456789012/y' } }) }), 'k').utworz([]); } catch (e) { blad = e.message; } }
        console.log(JSON.stringify({ o: o.blad, blad }));`], { env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8' }));
      expect(wynik.o).not.toMatch(/123456789012|sk-ant-api03/); expect(wynik.o).toContain('projects/***'); if (f === 'przeglad-api') expect(wynik.blad).not.toMatch(/123456789012/);
    }
  });
});

describe('gemini-pozy: negocjacja formatu przy 400 w pętli i diagnoza schematu (--diagnoza)', () => {
  const SCH = `{ $schema: 'https://json-schema.org/draft/2020-12/schema', type: 'object', properties: { a: { type: 'string', maxLength: 5 }, b: { type: 'number', minimum: 0 } }, required: ['a'] }`;
  /** fetch: odrzuca (400) każde żądanie, którego `generationConfig` zawiera `$schema`. */
  const MOCK = `const calls = []; const usageV = { promptTokenCount: 100, candidatesTokenCount: 10, thoughtsTokenCount: 10 };
    const fetchFn = async (url, init) => { calls.push(JSON.parse(init.body)); const t = JSON.stringify(JSON.parse(init.body).generationConfig);
      if (t.includes('$schema')) return { ok: false, status: 400, json: async () => ({ error: { code: 400, message: 'Request contains an invalid argument.', details: [] } }) };
      return { ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: '{"a":"x"}' }] }, finishReason: 'STOP' }], usageMetadata: usageV }) }; };`;
  test('400 na pierwszym właściwym żądaniu (po udanej próbie): kolejne formaty bez ponownego liczenia kosztu błędu; działający zostaje dla następnych wywołań; wywołanie zwrotne z odrzuconymi', () => {
    const w = run(`${MOCK} const api = m.klient(fetchFn, 'k', { tryb: 'vertex' }); const zm = []; api.naZmianieFormatu = (f, o) => zm.push([f, o.map((x) => x.format)]);
      const odp1 = await api.generuj({ model: 'gemini-3.1-pro-preview', system: 's', input: 'i', schemat: ${SCH} }); const n1 = calls.length; const odp2 = await api.generuj({ model: 'gemini-3.1-pro-preview', system: 's', input: 'i', schemat: ${SCH} });
      console.log(JSON.stringify({ format: api.format, zm, n1, n2: calls.length, f1: Object.keys(calls[1].generationConfig), ok: !!odp1.candidates && !!odp2.candidates }));`);
    expect(w.format).toBe('jsonSchemaProsty'); expect(w.zm).toEqual([['jsonSchemaProsty', ['jsonSchema']]]); expect(w.n1).toBe(2); expect(w.n2).toBe(3); expect(w.ok).toBe(true); expect(w.f1).toContain('responseJsonSchema');
  });
  test('wszystkie formaty odrzucone: błąd krytyczny 400 z listą odrzuconych; bez negocjacji w trybie gemini i przy jawnym formacie', () => {
    const w = run(`const calls = []; const fetchFn = async (u, i) => { calls.push(1); return { ok: false, status: 400, json: async () => ({ error: { message: 'zły' } }) }; };
      const api = m.klient(fetchFn, 'k', { tryb: 'vertex' }); let e1 = null; try { await api.generuj({ model: 'x', system: 's', input: 'i', schemat: {} }); } catch (e) { e1 = e; }
      const n = calls.length; const apiJ = m.klient(fetchFn, 'k', { tryb: 'vertex' }); let e2 = null; try { await apiJ.generuj({ model: 'x', system: 's', input: 'i', schemat: {}, format: 'openApi' }); } catch (e) { e2 = e; }
      const apiG = m.klient(fetchFn, 'k', { tryb: 'gemini' }); let e3 = null; const n0 = calls.length; try { await apiG.generuj({ model: 'x', system: 's', input: 'i', schemat: {} }); } catch (e) { e3 = e; }
      console.log(JSON.stringify({ n, kryt: e1.krytyczny, odrz: e1.odrzucone_formaty.map((x) => x.format), n2: calls.length - n - (calls.length - n0), n3: calls.length - n0, k3: e3.krytyczny }));`);
    expect(w.n).toBe(5); expect(w.kryt).toBe(true); expect(w.odrz).toEqual(['jsonSchema', 'jsonSchemaProsty', 'openApi', 'responseFormat', 'tekst']); expect(w.n3).toBe(1); expect(w.k3).toBe(false);
  });
  test('przebieg: schemat kontraktu ze słowem „$schema”, API odrzuca je w dwóch pierwszych formatach, nie w prostym → ćwiczenia przechodzą, format w raporcie, 400 nie wpływa na kod wyjścia', () => {
    const fx = fixture(); w(fx, 'scripts/figures/v2-validate.mjs', VALIDATE.replace("({ type: 'object', properties: { kat: { type: 'number' } }, required: ['kat'] })", "({ $schema: 'x', type: 'object', properties: { kat: { type: 'number', maxLength: 3 } }, required: ['kat'] })"));
    const out = path.join(fx, 'wyjscie');
    const r = run(`const calls = []; const q = [50, 60, 70]; const log = [];
      const fetchFn = async (u, init) => { calls.push(1); if (init.body.includes('responseJsonSchema') && init.body.includes('$schema')) return { ok: false, status: 400, json: async () => ({ error: { message: 'Request contains an invalid argument.' } }) };
        const x = init.body.includes('"ok"') ? { ok: true } : { kat: q.shift() }; return { ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify(x) }] }, finishReason: 'STOP' }], usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 10 } }) }; };
      const c = await m.main(['--api', 'vertex', '--rodzina', 'pull_up', '--wyjscie', ${JSON.stringify(out)}], { GEMINI_API_KEY: 'k' }, { fetchFn, log: (s) => log.push(s), root: ${JSON.stringify(fx)}, dzis: new Date('2026-11-01T00:00:00Z') });
      console.log(JSON.stringify({ c, n: calls.length, log }));`);
    expect(r.c).toBe(0); const rap = JSON.parse(fs.readFileSync(path.join(out, 'raport.json'), 'utf8')); expect(rap.format).toBe('jsonSchemaProsty'); expect(rap.wyniki.map((x: any) => x.ok)).toEqual([true, true, true]);
    expect(r.log.join('\n')).toMatch(/format JSON zmieniony na jsonSchemaProsty po odrzuceniu: jsonSchema/);
  });
  test('--diagnoza: pełny schemat w każdym formacie, trywialny z dużym maxOutputTokens, bisekcja właściwości i słów kluczowych tylko gdy pełny jsonSchema odrzucony; wynik wskazuje „$schema”; diagnoza.json; koszt ograniczony limitem; nic poza katalogiem wyniku', () => {
    const fx = fixture(); w(fx, 'scripts/figures/v2-validate.mjs', VALIDATE.replace("({ type: 'object', properties: { kat: { type: 'number' } }, required: ['kat'] })", "({ $schema: 'x', type: 'object', properties: { kat: { type: 'number', maxLength: 3 }, t: { type: 'string' } }, required: ['kat'] })")); const snap = snapshot(fx);
    const out = path.join(fx, 'wyjscie');
    const r = run(`${MOCK} const log = [];
      const c = await m.main(['--diagnoza', '--api', 'vertex', '--rodzina', 'pull_up', '--model', 'gemini-3.1-pro-preview', '--limit-usd', '0.3', '--wyjscie', ${JSON.stringify(out)}], { GEMINI_API_KEY: 'k' }, { fetchFn, log: (s) => log.push(s), root: ${JSON.stringify(fx)}, dzis: new Date('2026-11-01T00:00:00Z') });
      console.log(JSON.stringify({ c, n: calls.length, log, max: Math.max(...calls.map((b) => b.generationConfig.maxOutputTokens)) }));`);
    expect(r.c).toBe(0); const d = JSON.parse(fs.readFileSync(path.join(out, 'diagnoza.json'), 'utf8')); const wynik = (n: string) => d.wyniki.find((x: any) => x.nazwa === n);
    expect(wynik('pełny schemat, format jsonSchema').ok).toBe(false); expect(wynik('pełny schemat, format jsonSchemaProsty').ok).toBe(true); expect(wynik('pełny schemat, format openApi').ok).toBe(true); expect(wynik('pełny schemat, format tekst').ok).toBe(true);
    expect(wynik('schemat trywialny, format jsonSchema, maxOutputTokens 16000').ok).toBe(true); expect(wynik('pełny schemat bez $schema, format jsonSchema').ok).toBe(true); expect(wynik('pełny schemat bez enum, format jsonSchema').ok).toBe(false);
    expect(wynik('tylko właściwość „kat”, format jsonSchema').ok).toBe(true); expect(d.koszt_usd).toBeGreaterThan(0); expect(d.koszt_usd).toBeLessThanOrEqual(0.3); expect(r.max).toBeLessThanOrEqual(16000);
    expect(r.log.join('\n')).toMatch(/ODRZUCONE \(HTTP 400\): pełny schemat, format jsonSchema/); expect(fs.readdirSync(out).sort()).toEqual(['diagnoza.json', 'szacunek.json']); expect(snapshot(fx)).toBe(snap);
    expect(runMain(fixture(), ['--diagnoza', '--api', 'gemini', '--rodzina', 'pull_up'], { GEMINI_API_KEY: 'k' }, []).code).toBe(4);
  });
  test('--diagnoza: limit kosztu mniejszy niż koszt jednego wywołania = żadnych połączeń, wszystkie kroki „pominięte (limit)”', () => {
    const fx = fixture(); const out = path.join(fx, 'wyjscie');
    const r = run(`${MOCK} const log = []; const c = await m.main(['--diagnoza', '--api', 'vertex', '--rodzina', 'pull_up', '--limit-usd', '0.0001', '--wyjscie', ${JSON.stringify(out)}], { GEMINI_API_KEY: 'k' }, { fetchFn, log: (s) => log.push(s), root: ${JSON.stringify(fx)} }); console.log(JSON.stringify({ c, n: calls.length }));`);
    expect(r.n).toBe(0); expect(JSON.parse(fs.readFileSync(path.join(out, 'diagnoza.json'), 'utf8')).wyniki.every((x: any) => x.pominiete === 'limit')).toBe(true);
  });
});

describe('workflow gemini-figury.yml (strażnik)', () => {
  test('tylko workflow_dispatch; odczyt repozytorium; model z listy dozwolonych (zgodnej ze skryptem), domyślnie flagowy; tylko_szacuj domyślnie true', () => {
    expect(wf).toMatch(/^on:\n  workflow_dispatch:/m); expect(wf).not.toMatch(/^\s+(push|pull_request|schedule|workflow_run|repository_dispatch):/m);
    expect(wf).toMatch(/permissions:\n  contents: read/); expect(wf).not.toMatch(/contents: write|git (commit|push)/);
    expect(wf).toMatch(/model:[\s\S]*?default: gemini-4-argon[\s\S]*?options: \[gemini-4-argon, gemini-3\.1-pro-preview, gemini-3\.8-flash\]/);
    expect(run('console.log(JSON.stringify(m.MODELE))')).toEqual(['gemini-4-argon', 'gemini-3.1-pro-preview', 'gemini-3.8-flash']);
    expect(wf).toMatch(/api:[\s\S]*?type: choice[\s\S]*?default: vertex[\s\S]*?options: \[vertex, gemini\]/); expect(run('console.log(JSON.stringify([m.API_TRYBY, m.DOMYSLNY_API]))')).toEqual([['vertex', 'gemini'], 'vertex']);
    expect(wf).toMatch(/lokalizacja:[\s\S]*?type: choice[\s\S]*?default: global[\s\S]*?options: \[global, us, eu\]/); expect(run('console.log(JSON.stringify(m.LOKALIZACJE))')).toEqual(['global', 'us', 'eu']);
    expect(wf).toMatch(/diagnoza:[\s\S]*?type: boolean[\s\S]*?default: false/); expect(wf).toMatch(/--diagnoza --api "\$WEJ_API" --lokalizacja "\$WEJ_LOKALIZACJA" --rodzina "\$WEJ_RODZINA" --model "\$WEJ_MODEL" --limit-usd "\$WEJ_LIMIT"/);
    expect(wf).toMatch(/lista_modeli:[\s\S]*?type: boolean[\s\S]*?default: false/); expect(wf).toMatch(/WEJ_LOKALIZACJA: \$\{\{ inputs\.lokalizacja \}\}/); expect(wf).toMatch(/--lista-modeli --api "\$WEJ_API" --lokalizacja "\$WEJ_LOKALIZACJA"/);
    expect(wf).toMatch(/WEJ_API: \$\{\{ inputs\.api \}\}/); expect(wf.match(/--api "\$WEJ_API"/g)).toHaveLength(3); /* szacunek, lista modeli i generowanie */
    expect(wf).toMatch(/tylko_szacuj:[\s\S]*?default: true/); expect(wf).toMatch(/rodzina:[\s\S]*?default: pull_up/);
    expect(wf).toMatch(/concurrency:\n  group: gemini-figury\n  cancel-in-progress: false/);
  });
  test('sekret GEMINI_API_KEY w jednym kroku, jako zmienna środowiskowa; nigdy w run/echo; bez innych sekretów; wejścia tylko przez env', () => {
    expect(wf.match(/secrets\.[A-Z_0-9]+/g)).toEqual(['secrets.GEMINI_API_KEY']);
    const z = wf.split(/\n      - /).filter(s => /secrets\.GEMINI_API_KEY/.test(s));
    expect(z).toHaveLength(1); expect(z[0]).toMatch(/env:\n\s+GEMINI_API_KEY: \$\{\{ secrets\.GEMINI_API_KEY \}\}/); expect(z[0]).toMatch(/if: \$\{\{ !inputs\.tylko_szacuj \|\| inputs\.lista_modeli \}\}/);
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
