/* Odczyt wyniku tests.yml przez proxy środowiska (właściciel 05.11.2026, wariant A): wbudowany fetch Node 22 nie używa HTTPS_PROXY,
 * więc w kontenerze z proxy wychodzącym API zwracało 403 i scal-galaz odmawiał scalenia mimo zielonego CI. Z proxy — curl; bez proxy (CI) — fetch.
 * Moduł .mjs uruchamiany w osobnym procesie node (jak tests/scal-galaz.test.ts), bez sieci: curl podmieniony atrapą `exec`. */
import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawnSync } from 'child_process';

const MOD = JSON.stringify(join(__dirname, '..', 'scripts', 'ci-wynik.mjs'));
const URL_API = 'https://api.github.com/repos/lkarwowski494/trening/actions/runs?head_sha=abc&per_page=100';

/** Uruchamia kod ESM z `m` = moduł ci-wynik; wynik = JSON wypisany przez `wypisz(x)`. */
function uruchom(kod: string, env: Record<string, string> = {}) {
  const czyste: Record<string, string | undefined> = { ...process.env, HTTPS_PROXY: '', https_proxy: '', CI_RUNY_PLIK: '', ...env };
  const skrypt = `const m = await import(${MOD}); const wypisz = x => process.stdout.write(JSON.stringify(x)); ${kod}`;
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', skrypt], { env: czyste as NodeJS.ProcessEnv, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(r.stderr);
  return JSON.parse(r.stdout);
}

describe('ci-wynik: proxy ze środowiska (05.11.2026)', () => {
  test('przezProxy: https + HTTPS_PROXY/https_proxy → tak; bez proxy albo lokalny serwer http → nie', () => {
    expect(uruchom(`wypisz([
      m.przezProxy(${JSON.stringify(URL_API)}, { HTTPS_PROXY: 'http://proxy:1' }),
      m.przezProxy(${JSON.stringify(URL_API)}, { https_proxy: 'http://proxy:1' }),
      m.przezProxy(${JSON.stringify(URL_API)}, {}),
      m.przezProxy('http://127.0.0.1:45999/repos/x', { HTTPS_PROXY: 'http://proxy:1' }),
    ]);`)).toEqual([true, true, false, false]);
  });

  test('domyslnyFetch z proxy woła curl z nagłówkami i adresem, zwraca JSON', () => {
    const w = uruchom(`const wyw = []; const exec = (cmd, args) => { wyw.push([cmd, args]); return JSON.stringify({ workflow_runs: [{ id: 1 }] }); };
      const r = await m.domyslnyFetch(${JSON.stringify(URL_API)}, { env: { HTTPS_PROXY: 'http://proxy:1' }, exec }); wypisz({ r, wyw });`);
    expect(w.r.workflow_runs[0].id).toBe(1);
    expect(w.wyw).toHaveLength(1);
    expect(w.wyw[0][0]).toBe('curl');
    expect(w.wyw[0][1]).toEqual(expect.arrayContaining(['-f', '-H', 'accept: application/vnd.github+json', URL_API]));
  });

  test('błąd curl przez proxy → wyjątek z opisem; zielonyTests zwraca wtedy false (nie zgaduje)', () => {
    const w = uruchom(`const exec = () => { const e = new Error('curl failed'); e.stderr = 'curl: (22) The requested URL returned error: 403\\n'; throw e; };
      const f = u => m.domyslnyFetch(u, { env: { HTTPS_PROXY: 'x' }, exec });
      let blad = ''; try { await f(${JSON.stringify(URL_API)}); } catch (e) { blad = e.message; }
      wypisz({ blad, zielony: await m.zielonyTests('abc', { fetchJson: f }) });`);
    expect(w.blad).toMatch(/przez proxy: curl: \(22\).*403/);
    expect(w.zielony).toBe(false);
  });

  /* L-080: gałąź z wcześniejszymi zmianami względem main — baza H1 z pliku przebiegów (CI_RUNY_PLIK) działa tak samo przy ustawionym proxy, bez sieci. */
  test('H1: gałąź z wcześniejszymi zmianami — CI_RUNY_PLIK ma pierwszeństwo także przy HTTPS_PROXY', () => {
    const plik = join(mkdtempSync(join(tmpdir(), 'ci-proxy-')), 'runy.json');
    writeFileSync(plik, JSON.stringify([{ id: 7, head_sha: 'wczesniejszy', path: '.github/workflows/tests.yml', status: 'completed', conclusion: 'success', created_at: '2026-11-05T00:00:00Z' }]));
    expect(uruchom(`const nieWolno = () => { throw new Error('sieć niedozwolona'); };
      wypisz(await m.zielonyTests('wczesniejszy', { fetchJson: nieWolno }));`, { CI_RUNY_PLIK: plik, HTTPS_PROXY: 'http://proxy:1' })).toBe(true);
  });
});
