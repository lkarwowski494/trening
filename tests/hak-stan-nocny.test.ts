/* L-119 wariant A (decyzja koordynatora 09.11.2026, ZB-049): hak SessionStart wypisuje stan ostatnich nocy `nightly.yml` (harmonogram) i licznik czerwonych z rzędu;
   przy ≥ 2 czerwonych z rzędu wiersz „rozpatrz nocne przed planem”. Bez sieci — cisza i kod 0 (hak nie blokuje startu sesji); bez treści logów (repo publiczne).
   Logika: scripts/hooks/stan-nocny.mjs (moduł ESM — Jest wywołuje go podprocesem Node, odpowiedź API podstawiona przez stub fetch). */
import { readFileSync } from 'fs';
import { join } from 'path';
import { execFileSync, spawnSync } from 'child_process';

const root = join(__dirname, '..');
const skrypt = join(root, 'scripts/hooks/stan-nocny.mjs');
const mod = (expr: string) => JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import * as w from ${JSON.stringify('file://' + skrypt)}; console.log(JSON.stringify(await (async () => (${expr}))()))`], { encoding: 'utf8' }));

const przebieg = (conclusion: string | null, dzien: string, branch = 'main', status = 'completed') => ({ status, conclusion, created_at: `2026-11-${dzien}T09:28:17Z`, head_branch: branch, event: 'schedule', html_url: 'https://example.invalid/x', display_title: 'SEKRET-TRESC' });
const odp = (...runs: any[]) => ({ total_count: runs.length, workflow_runs: runs });
const stub = (body: any, ok = true) => `async () => ({ ok: ${ok}, json: async () => (${JSON.stringify(body)}) })`;
const stan = (body: any, ok = true) => mod(`w.stanNocny({ fetch: ${stub(body, ok)} })`);

describe('liczenie czerwonych z rzędu (L-119, 09.11.2026)', () => {
  const licz = (runs: any[]) => mod(`w.licznikCzerwonych(${JSON.stringify(runs)})`);
  test('same czerwone: licznik = liczba przebiegów', () => { expect(licz([przebieg('failure', '08'), przebieg('failure', '07'), przebieg('failure', '06')])).toBe(3); });
  test('zielony przerywa serię od najnowszego', () => { expect(licz([przebieg('failure', '08'), przebieg('success', '07'), przebieg('failure', '06')])).toBe(1); });
  test('najnowszy zielony: 0', () => { expect(licz([przebieg('success', '08'), przebieg('failure', '07')])).toBe(0); });
  test.each(['failure', 'cancelled', 'timed_out'])('wynik %s liczy się jako czerwony (jak w raporcie nocnym: anulowanie to sygnał)', c => { expect(licz([przebieg(c, '08')])).toBe(1); });
  test('przebieg w toku (bez wyniku) jest pomijany, nie przerywa serii', () => { expect(licz([przebieg(null, '09', 'main', 'in_progress'), przebieg('failure', '08'), przebieg('failure', '07')])).toBe(2); });
  test('brak przebiegów: 0', () => { expect(licz([])).toBe(0); });
});

describe('wyjście haka — parsowanie odpowiedzi API (stub fetch)', () => {
  test('3 ostatnie przebiegi: wynik, data, gałąź — bez treści z odpowiedzi poza tymi polami', () => {
    const w: string[] = stan(odp(przebieg('failure', '08'), przebieg('success', '07', 'integracja-1-1'), przebieg('failure', '06')));
    const t = w.join('\n');
    expect(t).toContain('2026-11-08'); expect(t).toContain('main'); expect(t).toContain('integracja-1-1'); expect(t).toContain('czerwony'); expect(t).toContain('zielony');
    expect(t).not.toContain('SEKRET-TRESC'); expect(t).not.toContain('example.invalid');
  });
  test('pokazuje tylko 3 najnowsze, licznik liczy z całej odpowiedzi', () => {
    const w: string[] = stan(odp(...['09', '08', '07', '06', '05'].map(d => przebieg('failure', d))));
    expect(w.filter(l => l.startsWith('- ')).length).toBe(3);
    expect(w.join('\n')).toContain('5');
  });
  test('1 czerwony z rzędu: stan bez ostrzeżenia', () => {
    expect(stan(odp(przebieg('failure', '08'), przebieg('success', '07'))).join('\n')).not.toContain('rozpatrz nocne przed planem');
  });
  test('≥ 2 czerwone z rzędu: wiersz „rozpatrz nocne przed planem (docs/40 L-119)”', () => {
    const t = stan(odp(przebieg('failure', '08'), przebieg('failure', '07'), przebieg('success', '06'))).join('\n');
    expect(t).toContain('rozpatrz nocne przed planem (docs/40 L-119)');
  });
  test('wszystkie zielone: stan bez ostrzeżenia', () => {
    expect(stan(odp(przebieg('success', '08'), przebieg('success', '07'))).join('\n')).not.toContain('rozpatrz');
  });
  test('odpowiedź błędna (ok=false, brak pola workflow_runs, pusta lista): brak wyjścia', () => {
    expect(stan(odp(przebieg('failure', '08')), false)).toEqual([]);
    expect(stan({ message: 'rate limit' })).toEqual([]);
    expect(stan(odp())).toEqual([]);
  });
  test('wyjątek fetch (brak sieci): brak wyjścia i brak błędu', () => {
    expect(mod(`w.stanNocny({ fetch: async () => { throw new Error('ENOTFOUND'); } })`)).toEqual([]);
  });
  test('zapytanie: tylko event=schedule dla nightly.yml, krótki limit czasu', () => {
    const wywolanie = mod(`(async () => { let u; let o; await w.stanNocny({ fetch: async (url, opt) => { u = url; o = opt; return { ok: true, json: async () => ({ workflow_runs: [] }) }; } }); return { u, sygnal: !!o.signal }; })()`);
    expect(wywolanie.u).toContain('actions/workflows/nightly.yml/runs'); expect(wywolanie.u).toContain('event=schedule'); expect(wywolanie.sygnal).toBe(true);
  });
});

describe('uruchomienie jako skrypt — hak nie blokuje startu sesji', () => {
  test('adres API nieosiągalny (brak sieci): kod 0, pusty stdout i stderr; zawieszenie przerywa limit spawnSync (wtedy status null)', () => {
    const r = spawnSync('node', [skrypt], { encoding: 'utf8', env: { ...process.env, STAN_NOCNY_API: 'http://127.0.0.1:1', STAN_NOCNY_LIMIT_MS: '1500' }, timeout: 15000 });
    expect(r.status).toBe(0); expect(r.stdout).toBe(''); expect(r.stderr).toBe('');
  });
  test('domyślny limit czasu ≤ 5 s', () => { expect(mod('w.LIMIT_MS')).toBeLessThanOrEqual(5000); });
});

describe('strażnik: hak jest w .claude/settings.json i CLAUDE.md wskazuje, kto rozpatruje noc (L-119)', () => {
  const settings = JSON.parse(readFileSync(join(root, '.claude/settings.json'), 'utf8'));
  const wpisy: { matcher: string; hooks: { type: string; command: string; timeout: number }[] }[] = settings.hooks.SessionStart;
  test('SessionStart (startup) uruchamia scripts/hooks/stan-nocny.mjs z krótkim limitem i bez błędu przy porażce; istniejące wpisy zostają', () => {
    const w = wpisy.flatMap(x => x.hooks.map(h => ({ m: x.matcher, ...h }))).filter(h => h.command.includes('scripts/hooks/stan-nocny.mjs'));
    expect(w.length).toBe(1);
    expect(w[0].m).toMatch(/startup/); expect(w[0].timeout).toBeLessThanOrEqual(10);
    expect(w[0].command).toMatch(/\|\| true|; true$/); expect(w[0].command).toContain('NODE_USE_ENV_PROXY=1');
    expect(wpisy.some(x => x.matcher === 'compact' && x.hooks[0].command.includes('CLAUDE.md z dysku'))).toBe(true);
    expect(wpisy.some(x => x.hooks.some(h => h.command.includes('docs/zobowiazania.md')))).toBe(true);
  });
  test('CLAUDE.md: koordynator rozpatruje noc na początku sesji (naprawa, backlog z ID, „znane, naprawione na gałęzi X” + git merge-base --is-ancestor)', () => {
    const c = readFileSync(join(root, 'CLAUDE.md'), 'utf8');
    expect(c).toContain('stan-nocny.mjs'); expect(c).toContain('L-119'); expect(c).toContain('git merge-base --is-ancestor');
  });
  test('docs/18: wpis L-119 ma wdrożenie „kod” i test tego pliku', () => {
    const d = readFileSync(join(root, 'docs/18-przekazanie.md'), 'utf8');
    const wiersz = d.split('\n').find(l => l.includes('09.11.2026') && l.includes('lekcja L-119'))!;
    expect(wiersz).toContain('[wdrożenie: kod]'); expect(wiersz).toContain('[test: tests/hak-stan-nocny.test.ts]');
  });
});
