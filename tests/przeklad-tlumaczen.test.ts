/*
 * Przekład kluczy słownika na 33 języki przez API Anthropic (23.10.2026, zgoda właściciela do 6 USD): scripts/i18n/przeklad-api.mjs + .github/workflows/przeklad-tlumaczen.yml.
 * Bez sieci: zestaw i budowa żądań na fixture, parsowanie odpowiedzi batcha z atrapą, szacunek i limit kosztu, przebieg z atrapą fetch (skrypt nie zapisuje słowników),
 * tryb --zastosuj (lokalnie, po przeglądzie) oraz strażnik workflowu (styl public-repo.test.ts). Skrypt jest modułem ESM — wywołujemy go przez `node --input-type=module`.
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync, spawnSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const SCRIPT = path.join(ROOT, 'scripts/i18n/przeklad-api.mjs');
const wf = fs.readFileSync(path.join(ROOT, '.github/workflows/przeklad-tlumaczen.yml'), 'utf8');
/** Wykonuje kod w module ESM z zaimportowanym skryptem jako `m`; wynik = JSON z console.log. */
const run = (code: string, env: Record<string, string> = {}) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(SCRIPT)}; ${code}`], { env: { PATH: process.env.PATH ?? '', ...env } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 1 << 26 }));

const T1 = 'Zapisz {n} serii — zmienione brzmienie';
const T2 = 'Nowy tekst bez zmiennych';
const T3 = 'Przerwy: {a} min po ciężkich seriach';
const w = (root: string, f: string, o: unknown) => { fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true }); fs.writeFileSync(path.join(root, f), JSON.stringify(o, null, 1) + '\n'); };
/** Fixture: „projekt” z trzema językami (fr, pt, de) i zestawem: jedna pozycja „zmieniony” (stare tłumaczenie w słownikach), dwie „nowy”. */
function fixture(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'przeklad-'));
  w(root, 'lib/locales/_source.json', []);
  w(root, 'lib/locales/fr.json', { [T1]: 'Enregistrer {n} séries (stare, ACSM 2026)', 'Inny': 'Autre' });
  w(root, 'lib/locales/pt.json', { [T1]: 'Guardar {n} séries (stare)', 'Inny': 'Outro' });
  w(root, 'lib/locales/de.json', { [T1]: 'Speichere {n} Sätze (stare)', 'Inny': 'Anderes' });
  w(root, 'docs/lokalizacja/zestaw.json', { klucze: [
    { rodzaj: 'zmieniony', pl: T1, en: 'Save {n} sets — changed wording', poprzedni_pl: 'Zapisz {n} serii (ACSM 2026)' },
    { rodzaj: 'nowy', pl: T2, en: 'New text without variables' },
    { rodzaj: 'nowy', pl: T3, en: 'Rest: {a} min after heavy sets' },
  ] });
  return root;
}
const fx = fixture(); const R = JSON.stringify(fx); const Z = JSON.stringify(path.join(fx, 'docs/lokalizacja/zestaw.json'));
const snapshot = (root: string) => ['fr', 'pt', 'de'].map(k => fs.readFileSync(path.join(root, `lib/locales/${k}.json`), 'utf8')).join('\n#\n');

describe('przekład API: zestaw i żądania', () => {
  test('zestaw: pozycje numerowane od 1 z rodzajem; brak pliku i pozycja bez en → czytelny błąd', () => {
    const z = run(`console.log(JSON.stringify(m.wczytajZestaw(${Z})))`);
    expect(z.map((x: any) => [x.id, x.rodzaj])).toEqual([[1, 'zmieniony'], [2, 'nowy'], [3, 'nowy']]);
    expect(z[0].poprzedni_pl).toBe('Zapisz {n} serii (ACSM 2026)');
    const r = spawnSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(SCRIPT)}; m.wczytajZestaw('/nie/ma/takiego.json')`], { encoding: 'utf8' });
    expect(r.status).not.toBe(0); expect(r.stderr).toMatch(/brak zestawu do przekładu/);
  });
  test('języki do przekładu = słowniki lib/locales bez PL i EN (w repozytorium: 33)', () => {
    expect(run(`console.log(JSON.stringify(m.kodyDoPrzekladu(${R})))`)).toEqual(['de', 'fr', 'pt']);
    const real = run(`console.log(JSON.stringify(m.kodyDoPrzekladu(${JSON.stringify(ROOT)})))`);
    expect(real).toHaveLength(fs.readdirSync(path.join(ROOT, 'lib/locales')).filter(f => f.endsWith('.json') && !f.startsWith('_')).length);
    expect(real).not.toContain('pl'); expect(real).not.toContain('en');
  });
  test('żądanie: pl+en każdej pozycji, „stare” tylko przy „zmieniony”, rejestr języka z docs/16, zakaz nazw źródeł i oznaczeń pewności, bez ceny/klucza', () => {
    const z = run(`const p = m.wczytajZestaw(${Z}); const st = m.stare(${R}, 'fr'); console.log(JSON.stringify(m.budujZadanie('fr', p, st)))`);
    const lista = JSON.parse(z.messages[0].content.split('\n').pop());
    expect(lista).toEqual([
      { id: '1', pl: T1, en: 'Save {n} sets — changed wording', stare: 'Enregistrer {n} séries (stare, ACSM 2026)' },
      { id: '2', pl: T2, en: 'New text without variables' }, { id: '3', pl: T3, en: 'Rest: {a} min after heavy sets' },
    ]);
    expect(z.messages[0].content).toMatch(/Język docelowy: .*\(fr\)/); expect(z.messages[0].content).toContain('vous'); /* REJESTR.fr: forma grzecznościowa */
    expect(z.system).toMatch(/nie dodawaj nazw źródeł, autorów, organizacji, lat ani oznaczeń pewności/);
    expect(z.system).toMatch(/nie przenoś z niego nazw źródeł/);
    expect(JSON.stringify(z)).not.toMatch(/sk-ant|ANTHROPIC_API_KEY/);
  });
  test('rejestr z docs/16 jest ten sam co w przeglądzie (jedno źródło prawdy); wyjątek „ton trenera” nie dotyczy kluczy interfejsu', () => {
    const y = run(`const r = await import(${JSON.stringify(path.join(ROOT, 'scripts/i18n/przeglad-api.mjs'))}); const p = m.wczytajZestaw(${Z}); console.log(JSON.stringify({ ru: r.REJESTR.ru, req: m.budujZadanie('ru', p, {}).messages[0].content }))`);
    expect(y.req).toContain(y.ru); expect(y.ru).toMatch(/interfejs „вы”/);
    expect(fs.readFileSync(SCRIPT, 'utf8')).toMatch(/Wyjątek „ton trenera”[^\n]*dotyczy tylko wskazówek techniki/);
    expect(run(`console.log(JSON.stringify(m.SYSTEM))`)).not.toMatch(/ton trenera|wskazówk[ia] techniki/);
  });
  test('zadanie batcha: custom_id pr-<kod>, model Opus (claude-opus-5-5), effort medium domyślnie, max_tokens bez temperatury', () => {
    const b = run(`const p = m.wczytajZestaw(${Z}); const o = m.parsujArgumenty([]); console.log(JSON.stringify({ o, b: m.budujZadanieBatcha('fr', p, {}, o) }))`);
    expect(b.o).toMatchObject({ model: 'claude-opus-5-5', effort: 'medium', maxKoszt: 6, szacuj: false });
    expect(b.b.custom_id).toBe('pr-fr'); expect(b.b.params).toMatchObject({ model: 'claude-opus-5-5', output_config: { effort: 'medium' } });
    expect(Object.keys(b.b.params).sort()).toEqual(['max_tokens', 'messages', 'model', 'output_config', 'system']); /* bez temperature/top_p/thinking.budget_tokens */
  });
  test('argumenty: --model sonnet, --limit, --zastosuj; błędne wartości odrzucone', () => {
    expect(run(`console.log(JSON.stringify(m.parsujArgumenty(['--model','sonnet','--limit','2','--szacuj','--zastosuj','x'])))`)).toMatchObject({ model: 'claude-sonnet-5-5', limit: 2, szacuj: true, zastosuj: 'x' });
    for (const bad of ["['--limit','0']", "['--effort','ultra']", "['--model','gpt']", "['--nic']"]) expect(spawnSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(SCRIPT)}; m.parsujArgumenty(${bad})`]).status).not.toBe(0);
  });
});

describe('przekład API: odpowiedź modelu', () => {
  const poz = [{ id: 1, pl: T1, en: 'x' }, { id: 2, pl: T2, en: 'x' }, { id: 3, pl: T3, en: 'x' }];
  const parse = (txt: string) => run(`console.log(JSON.stringify(m.parsujOdpowiedz(${JSON.stringify(txt)}, ${JSON.stringify(poz)})))`);
  test('poprawna odpowiedź (także w bloku kodu): propozycje po kluczu polskim', () => {
    const ok = JSON.stringify({ 1: 'Enregistrer {n} séries', 2: 'Nouveau texte', 3: 'Pauses : {a} min' });
    expect(parse(ok)).toEqual({ blad: null, propozycje: { [T1]: 'Enregistrer {n} séries', [T2]: 'Nouveau texte', [T3]: 'Pauses : {a} min' }, odrzucone: [] });
    expect(parse('```json\n' + ok + '\n```').blad).toBeNull();
  });
  test('zmienne {…} muszą być te same: niezgodne i puste tłumaczenia trafiają do „odrzucone”, nie do propozycji', () => {
    const r = parse(JSON.stringify({ 1: 'Enregistrer {x} séries', 2: '   ', 3: 'Pauses : {a} min' }));
    expect(Object.keys(r.propozycje)).toEqual([T3]);
    expect(r.odrzucone.map((o: any) => o.klucz)).toEqual([T1, T2]); expect(r.odrzucone[0].powod).toMatch(/zmienne/);
  });
  test('brak JSON / niepoprawny JSON / brakująca pozycja', () => {
    expect(parse('Przepraszam, nie mogę.')).toMatchObject({ blad: 'brak obiektu JSON w odpowiedzi', propozycje: {} });
    expect(parse('{ nie json }').blad).toMatch(/niepoprawny JSON/);
    expect(parse(JSON.stringify({ 1: 'a {n}' })).odrzucone.map((o: any) => o.klucz)).toEqual([T2, T3]);
  });
  test('linie wyniku batcha: sukces, błąd, ucięcie (max_tokens) i odmowa (refusal) — bez surowej odpowiedzi w wyniku błędu', () => {
    const line = (res: unknown) => JSON.stringify({ custom_id: 'pr-fr', result: res });
    const o = (res: unknown) => run(`console.log(JSON.stringify(m.odczytajLinie(${JSON.stringify(line(res))})))`);
    expect(o({ type: 'succeeded', message: { stop_reason: 'end_turn', content: [{ type: 'text', text: '{"1":"a"}' }], usage: { input_tokens: 1, output_tokens: 2 } } })).toMatchObject({ kod: 'fr', blad: null, tekst: '{"1":"a"}' });
    expect(o({ type: 'errored', error: { error: { message: 'overloaded' } } })).toMatchObject({ kod: 'fr', blad: 'errored: overloaded', tekst: null });
    expect(o({ type: 'succeeded', message: { stop_reason: 'max_tokens', content: [] } }).blad).toMatch(/ucięta/);
    expect(o({ type: 'succeeded', message: { stop_reason: 'refusal', content: [] } }).blad).toMatch(/refusal/);
  });
});

describe('przekład API: koszt, limit 6 USD i przebieg z atrapą (bez sieci)', () => {
  const przebieg = (args: string[], key: boolean, extra = '') => run(`
    const calls = []; const logs = []; const batchId = 'msgbatch_TEST1';
    const reqs = []; 
    const fetchFn = async (url, init) => {
      calls.push({ url, method: init?.method, key: init?.headers?.['x-api-key'] ?? null });
      if (url.endsWith('/messages/count_tokens')) return { ok: true, json: async () => ({ input_tokens: 1000 }) };
      if (url.endsWith('/messages/batches') && init.method === 'POST') { reqs.push(...JSON.parse(init.body).requests); return { ok: true, json: async () => ({ id: batchId }) }; }
      if (url.endsWith('/results')) {
        const kody = reqs.map(r => r.custom_id.replace('pr-', ''));
        return { ok: true, text: async () => kody.map(k => JSON.stringify({ custom_id: 'pr-' + k, result: { type: 'succeeded', message: { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(k === 'pt' ? { 1: 'Guardar {x} séries', 2: 'Novo texto', 3: 'Pausas: {a} min' } : { 1: 'T1 ' + k + ' {n}', 2: 'T2 ' + k, 3: 'T3 ' + k + ' {a}' }) }] } } })).join('\\n') };
      }
      if (url.includes('/messages/batches/')) return { ok: true, json: async () => ({ processing_status: 'ended', results_url: 'https://api.anthropic.com/v1/messages/batches/' + batchId + '/results' }) };
      throw new Error('nieoczekiwane wywołanie ' + url);
    };
    const out = ${JSON.stringify(path.join(fx, 'wyjscie'))}; ${extra}
    const code = await m.main(${JSON.stringify(args)}.concat(['--wyjscie', out, '--zestaw', ${Z}]), ${key ? "{ ANTHROPIC_API_KEY: 'sk-ant-TEST-SECRET' }" : '{}'}, { fetchFn, log: (s) => logs.push(s), root: ${R} });
    console.log(JSON.stringify({ code, calls, logs }));`);
  test('--szacuj bez klucza: przybliżenie, szacunek.json, zero połączeń; koszt dla trzech pozycji dużo poniżej limitu', () => {
    const before = snapshot(fx);
    const r = przebieg(['--szacuj'], false);
    expect(r.code).toBe(0); expect(r.calls).toEqual([]);
    const s = JSON.parse(fs.readFileSync(path.join(fx, 'wyjscie/szacunek.json'), 'utf8'));
    expect(s).toMatchObject({ model: 'claude-opus-5-5', effort: 'medium', jezykow: 3, pozycji: 3 });
    expect(s.koszt_usd).toBeGreaterThan(0); expect(s.koszt_usd).toBeLessThan(6); expect(snapshot(fx)).toBe(before);
  });
  test('limit kosztu: powyżej --max-koszt przebieg staje (kod 3) bez połączeń płatnych; --zgoda-koszt go odblokowuje', () => {
    const stop = przebieg(['--max-koszt', '0.0001'], true);
    expect(stop.code).toBe(3); expect(stop.logs.join('\n')).toMatch(/STOP: szacowany koszt .* przekracza limit 0.0001 USD/);
    expect(stop.calls.every((c: any) => c.url.endsWith('/count_tokens'))).toBe(true);
    const ok = przebieg(['--max-koszt', '0.0001', '--zgoda-koszt'], true);
    expect(ok.calls.some((c: any) => c.method === 'POST' && c.url.endsWith('/messages/batches'))).toBe(true);
  });
  test('domyślny limit to 6 USD (zgoda właściciela 23.10.2026)', () => {
    expect(run(`console.log(JSON.stringify(m.LIMIT_KOSZTU_USD))`)).toBe(6);
  });
  test('bez klucza i bez --szacuj: kod 2, nic nie wysłane', () => {
    const r = przebieg([], false); expect(r.code).toBe(2); expect(r.calls).toEqual([]);
  });
  test('pełny przebieg z atrapą: batch na 3 języki, raport na język + podsumowanie, słowniki bez zmian, klucz tylko w nagłówku', () => {
    const before = snapshot(fx);
    const r = przebieg([], true);
    expect(r.code).toBe(0);
    expect(r.calls.filter((c: any) => c.url.endsWith('/messages/batches') && c.method === 'POST')).toHaveLength(1);
    expect(r.calls.every((c: any) => c.key === 'sk-ant-TEST-SECRET')).toBe(true);
    expect(JSON.stringify(r.logs)).not.toContain('sk-ant-TEST-SECRET');
    const dir = path.join(fx, 'wyjscie');
    const fr = JSON.parse(fs.readFileSync(path.join(dir, 'fr.json'), 'utf8'));
    expect(fr).toMatchObject({ jezyk: 'fr', model: 'claude-opus-5-5', effort: 'medium', batch_id: 'msgbatch_TEST1', pozycji: 3, przyjete: 3, odrzucone: [] });
    expect(fr.propozycje[T1]).toBe('T1 fr {n}');
    const pt = JSON.parse(fs.readFileSync(path.join(dir, 'pt.json'), 'utf8'));
    expect(pt.przyjete).toBe(2); expect(pt.odrzucone[0].klucz).toBe(T1); /* zmienna {x} zamiast {n} */
    expect(fs.readFileSync(path.join(dir, 'podsumowanie.md'), 'utf8')).toMatch(/\| pt \| 3 \| 2 \| 1 \|/);
    expect(JSON.stringify([fr, pt])).not.toContain('sk-ant');
    expect(snapshot(fx)).toBe(before); /* skrypt nie zapisuje słowników */
  });
  test('--limit 2: tylko dwa pierwsze języki', () => {
    const r = przebieg(['--limit', '2'], true);
    expect(r.code).toBe(0); const b = fs.readdirSync(path.join(fx, 'wyjscie')).filter(f => /^[a-z]{2}\.json$/.test(f)); expect(b).toEqual(expect.arrayContaining(['de.json', 'fr.json']));
  });
});

describe('przekład API: --zastosuj (lokalnie, po przeglądzie)', () => {
  test('nakłada propozycje na lib/locales (tylko klucze z zestawu, zgodne zmienne), usuwa z zestawu wpisy pokryte we wszystkich językach', () => {
    const root = fixture(); const dir = path.join(root, 'raport'); fs.mkdirSync(dir);
    const rap = (kod: string, p: Record<string, string>) => w(dir, `${kod}.json`, { jezyk: kod, propozycje: p });
    rap('fr', { [T1]: 'FR1 {n}', [T2]: 'FR2', 'Obcy klucz': 'x' });
    rap('pt', { [T1]: 'PT1 {n}', [T2]: 'PT2' });
    rap('de', { [T1]: 'DE1 {x}', [T2]: 'DE2' }); /* zła zmienna → pominięte */
    w(dir, 'szacunek.json', { koszt_usd: 1 }); /* nie jest językiem */
    const out = run(`const p = m.zastosuj(${JSON.stringify(root)}, ${JSON.stringify(dir)}, ${JSON.stringify(path.join(root, 'docs/lokalizacja/zestaw.json'))}); console.log(JSON.stringify(p))`);
    expect(out).toMatchObject({ jezykow: 3, zapisanych: 5, zestaw_przed: 3, zestaw_po: 2 });
    expect(out.pominietych).toEqual(expect.arrayContaining([expect.stringMatching(/Obcy klucz/), expect.stringMatching(/zmienne/)]));
    const fr = JSON.parse(fs.readFileSync(path.join(root, 'lib/locales/fr.json'), 'utf8'));
    expect(fr[T1]).toBe('FR1 {n}'); expect(fr[T2]).toBe('FR2'); expect(fr['Obcy klucz']).toBeUndefined(); expect(fr['Inny']).toBe('Autre');
    expect(JSON.parse(fs.readFileSync(path.join(root, 'lib/locales/de.json'), 'utf8'))[T1]).toContain('stare'); /* odrzucone: stare tłumaczenie zostaje */
    const z = JSON.parse(fs.readFileSync(path.join(root, 'docs/lokalizacja/zestaw.json'), 'utf8')).klucze.map((k: any) => k.pl);
    expect(z).toEqual([T1, T3]); /* T2 pokryty we wszystkich trzech językach; T1 — nie w de; T3 — w żadnym */
  });
  test('tryb --zastosuj nie potrzebuje klucza ani sieci (main z pustym env i fetch rzucającym)', () => {
    const root = fixture(); const dir = path.join(root, 'raport'); fs.mkdirSync(dir); w(dir, 'fr.json', { jezyk: 'fr', propozycje: { [T2]: 'FR2' } });
    const out = run(`const logs = []; const code = await m.main(['--zastosuj', ${JSON.stringify(dir)}, '--zestaw', 'docs/lokalizacja/zestaw.json'], {}, { fetchFn: () => { throw new Error('sieć!'); }, log: (s) => logs.push(s), root: ${JSON.stringify(root)} }); console.log(JSON.stringify({ code, logs }))`);
    expect(out.code).toBe(0); expect(out.logs[0]).toMatch(/nałożono 1 tłumaczeń w 1 językach/);
  });
});

describe('workflow przeklad-tlumaczen.yml (strażnik)', () => {
  test('tylko workflow_dispatch; odczyt repozytorium; model domyślnie opus; zgoda na koszt powyżej 6 USD', () => {
    expect(wf).toMatch(/^on:\n  workflow_dispatch:/m); expect(wf).not.toMatch(/^\s+(push|pull_request|schedule|workflow_run|repository_dispatch):/m);
    expect(wf).toMatch(/permissions:\n  contents: read/);
    expect(wf).toMatch(/model:[\s\S]*?default: opus[\s\S]*?options: \[opus, sonnet\]/);
    expect(wf).toMatch(/zgoda_koszt:\n\s+description: 'Zgoda na koszt powyżej 6 USD/); expect(wf).toMatch(/tylko_szacuj:[\s\S]*?default: true/);
    expect(wf).toMatch(/concurrency:\n  group: przeklad-tlumaczen\n  cancel-in-progress: false/);
  });
  test('sekret ANTHROPIC_API_KEY w jednym kroku, jako zmienna środowiskowa; nigdy w run/echo; bez innych sekretów', () => {
    expect(wf.match(/secrets\.[A-Z_0-9]+/g)).toEqual(['secrets.ANTHROPIC_API_KEY']);
    const steps = wf.split(/\n      - /); const z = steps.filter(s => /secrets\.ANTHROPIC_API_KEY/.test(s));
    expect(z).toHaveLength(1); expect(z[0]).toMatch(/env:\n\s+ANTHROPIC_API_KEY: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/);
    expect(wf).not.toMatch(/echo[^\n]*ANTHROPIC_API_KEY/);
    for (const blok of wf.split(/\n        run: \|\n/).slice(1)) expect(blok.split('\n      - ')[0]).not.toContain('${{'); /* wejścia i sekret tylko przez env, nigdy w treści run */
  });
  test('krok szacunku bez klucza poprzedza przekład; wznowienie tylko dla identyfikatora msgbatch_…; artefakt tylko raporty, 7 dni', () => {
    const iSz = wf.indexOf('Szacunek kosztu bez klucza'), iPr = wf.indexOf('- name: Przekład');
    expect(iSz).toBeGreaterThan(0); expect(iPr).toBeGreaterThan(iSz);
    expect(wf.slice(iSz, iPr)).not.toMatch(/ANTHROPIC_API_KEY/); expect(wf.slice(iSz, iPr)).toMatch(/--szacuj/);
    expect(wf).toMatch(/\^msgbatch_\[A-Za-z0-9\]\+\$/);
    expect(wf).toMatch(/upload-artifact@v4[\s\S]*?name: raport-przekladu[\s\S]*?raport-przekladu\/\*\.json[\s\S]*?podsumowanie\.md[\s\S]*?retention-days: 7/);
    expect(wf).not.toMatch(/git (commit|push)|lib\/locales|contents: write/); /* workflow niczego nie zapisuje w repozytorium */
  });
  test('skrypt: nie zapisuje słowników poza trybem --zastosuj; domyślny limit kosztu w skrypcie = limit w opisie workflowu', () => {
    const s = fs.readFileSync(SCRIPT, 'utf8');
    const main = s.slice(s.indexOf('export async function main'));
    expect((main.match(/writeFileSync\(/g) ?? []).length).toBe(3); /* szacunek.json, raport języka, podsumowanie.md; zapis słowników i zestawu jest tylko w zastosuj() */
    expect(main).not.toMatch(/writeFileSync\([^)]*lib\/locales/);
    expect(s).toMatch(/LIMIT_KOSZTU_USD = 6;/);
  });
});

describe('słownik terminów w przekładzie przez API (25.10.2026, bez sieci)', () => {
  const Z2 = JSON.stringify(path.join(ROOT, 'docs/lokalizacja/slownik-terminow.json'));
  const pozycje = `[{ id: 1, rodzaj: 'nowy', pl: 'Przerwa robocza (s)', en: 'Working rest (s)' }, { id: 2, rodzaj: 'nowy', pl: 'Seria zrobiona', en: 'Set done' }]`;
  test('żądanie dla języka zawiera słownik tylko tego języka (termin zalecany i zakazany z powodem) oraz zasadę naturalności', () => {
    const y = run(`const sl = m.slownikTerminow(${JSON.stringify(ROOT)}); const p = ${pozycje}; console.log(JSON.stringify({ ja: m.budujZadanie('ja', p, {}, sl).messages[0].content, pt: m.budujZadanie('pt-BR', p, {}, sl).messages[0].content, system: m.SYSTEM }))`);
    expect(y.ja).toContain('Słownik terminów treningowych'); expect(y.ja).toContain('インターバル'); expect(y.ja).toContain('NIE używaj: „休憩”');
    expect(y.ja).not.toContain('faixa'); expect(y.pt).toContain('faixa de repetições'); expect(y.pt).not.toContain('インターバル');
    expect(y.system).toMatch(/trener albo kolega na siłowni/); expect(y.system).toMatch(/NIE używaj/);
  });
  test('bez słownika (fixture) żądanie jest jak dotąd; odpowiedź z terminem zakazanym trafia do odrzuconych z powodem', () => {
    const y = run(`const sl = m.slownikTerminow(${JSON.stringify(ROOT)}); const p = ${pozycje}; const bez = m.budujZadanie('pt', p, {}).messages[0].content; const r = m.parsujOdpowiedz(JSON.stringify({ 1: 'Descanso de trabalho (s)', 2: 'Série feita' }), p, 'pt', sl); console.log(JSON.stringify({ bez, r, nul: m.slownikTerminow('/nie/ma/takiego') }))`);
    expect(y.bez).not.toContain('Słownik terminów'); expect(y.nul).toBeNull();
    expect(Object.keys(y.r.propozycje)).toEqual(['Seria zrobiona']);
    expect(y.r.odrzucone).toHaveLength(1); expect(y.r.odrzucone[0].powod).toMatch(/słownik terminów: przerwa_robocza/);
  });
  test('słownik z repozytorium ładuje się w przekładzie (ten sam plik co w strażniku)', () => {
    expect(run(`console.log(JSON.stringify(m.slownikTerminow(${JSON.stringify(ROOT)}).pojecia.length))`)).toBeGreaterThanOrEqual(40);
    expect(fs.existsSync(JSON.parse(Z2))).toBe(true);
  });
});
