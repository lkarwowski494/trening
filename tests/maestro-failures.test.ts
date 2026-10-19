/* CI (E2E): logi przebiegów są publiczne, a artefakty (zrzuty) bywają nieosiągalne — po porażce Maestro skrypt wypisuje
 * nieudane polecenie, kilka poprzednich i teksty z ekranu w chwili błędu (scripts/ci/maestro-failures.py). */
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..');
const run = (dir: string, ...rest: string[]) => execFileSync('python3', [path.join(root, 'scripts/ci/maestro-failures.py'), dir, ...rest], { encoding: 'utf8' });

test('maestro-failures: nieudane polecenie, poprzednie kroki i teksty z ekranu; UUID zamaskowany', () => {
  const out = run(path.join(__dirname, 'fixtures/maestro-out'));
  expect(out).toMatch(/Flow A/);
  expect(out).toMatch(/FAILED.*assertConditionCommand/);
  expect(out).toMatch(/Assertion is false: "Exercise order" is visible/);
  expect(out).toMatch(/tapOnElement.*Reorder exercises/);
  expect(out).toMatch(/Swap exercise/);
  expect(out).toMatch(/Suggestion 1: Push Up, same movement/);
  expect(out).not.toMatch(/1A2B3C4D-1111-2222-3333-444455556666/);
  expect(out).toMatch(/<UUID>/);
});

test('maestro-failures: zrzut nieudanego kroku (step-NNN) trafia na listę, zrzuty innych kroków nie', () => {
  const list = path.join(require('os').tmpdir(), `mf-list-${process.pid}.txt`);
  const out = run(path.join(__dirname, 'fixtures/maestro-out'), list);
  expect(out).toMatch(/zrzut: Flow A\/screenshots\/step-003-assertCondition-Exercise_order\.png/);
  const lines = fs.readFileSync(list, 'utf8').trim().split('\n');
  expect(lines).toHaveLength(1); expect(lines[0]).toMatch(/step-003-/);
});

test('maestro-failures: bez nieudanych kroków i bez katalogu — kod 0, krótka informacja', () => {
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'mf-'));
  expect(run(tmp)).toMatch(/brak nieudanych/);
  expect(run(path.join(tmp, 'nie-ma'))).toMatch(/brak katalogu/);
});

test('e2e-ios.yml: podsumowanie porażki uruchamiane tylko po błędzie, przed wysyłką artefaktów', () => {
  const y = fs.readFileSync(path.join(root, '.github/workflows/e2e-ios.yml'), 'utf8');
  const i = y.indexOf('python3 scripts/ci/maestro-failures.py e2e-out');
  expect(i).toBeGreaterThan(0);
  expect(y.slice(y.lastIndexOf('- name:', i), i)).toMatch(/if: failure\(\)/);
  expect(y.slice(i, y.indexOf('name: e2e-ios'))).toMatch(/\/tmp\/zrzuty\.txt[\s\S]*ZRZUT-BLEDU[\s\S]*BEGIN-B64[\s\S]*END-B64/);
  expect(i).toBeLessThan(y.indexOf('name: e2e-ios'));
});

test('e2e-ios.yml: całość powtarzana najwyżej raz i tylko, gdy sterownik XCTest nie wystartował; nieudany scenariusz — osobne ponowienie tylko jego (raz), w trybie ścisłym bez ponowień', () => {
  const y = fs.readFileSync(path.join(root, '.github/workflows/e2e-ios.yml'), 'utf8');
  const step = y.slice(y.indexOf('- name: Maestro'), y.indexOf('- name: Aktualizacja — wybór'));
  expect(step.match(/maestro --device/g)).toHaveLength(3); /* całość, jej powtórka po awarii sterownika i ponowienie pojedynczego scenariusza — wszystkie przez strażnika czasu (guard) */
  expect(step).toMatch(/if \[ "\$rc" -ne 0 \] && grep -qE "iOS driver not ready in time\|deviceInfo failed"/);
  expect(step).toMatch(/exit \$rc/);
  const bash = require('child_process').execFileSync; /* logika powtórzenia na atrapie maestro */
  const body = step.slice(step.indexOf('run: |') + 6).split('\n').map(l => l.replace(/^ {10}/, '')).join('\n');
  const sim = (first: string, code1: number) => { const d = fs.mkdtempSync(path.join(require('os').tmpdir(), 'mx-'));
    fs.writeFileSync(path.join(d, 'maestro'), `#!/bin/bash\nn=$(cat ${d}/n 2>/dev/null || echo 0); echo $((n+1)) > ${d}/n\nif [ "$n" = 0 ]; then echo "${first}"; exit ${code1}; fi\necho ok; exit 0\n`, { mode: 0o755 });
    let rc = 0; try { bash('bash', ['-e', '-c', body], { cwd: d, env: { ...process.env, PATH: `${d}:${process.env.PATH}`, SIM: 'x' }, stdio: 'pipe' }); } catch (e: any) { rc = e.status; }
    return { rc, runs: Number(fs.readFileSync(path.join(d, 'n'), 'utf8')) }; };
  expect(sim('iOS driver not ready in time, consider increasing timeout', 1)).toEqual({ rc: 0, runs: 2 });
  /* 04.10.2026 (run 37229659437): sterownik XCTest zwrócił 500 na deviceInfo przed pierwszym scenariuszem — też awaria maszyny */
  expect(sim('UnknownFailure(errorResponse=Request for http://127.0.0.1:50514/deviceInfo failed, code: 500, body: )', 1)).toEqual({ rc: 0, runs: 2 });
  expect(sim('Assertion is false: "Propozycje" is visible', 1)).toEqual({ rc: 1, runs: 1 });
  expect(sim('ok', 0)).toEqual({ rc: 0, runs: 1 });
  /* 19.10.2026: ponowienie pojedynczego nieudanego scenariusza (osobne uruchomienie tylko jego, raz); tryb ścisły (STRICT=true) — bez ponowień */
  const ponow = (strict: boolean, retryOk: boolean) => { const d = fs.mkdtempSync(path.join(require('os').tmpdir(), 'mr-')); fs.mkdirSync(path.join(d, 'scripts/ci'), { recursive: true }); fs.copyFileSync(path.join(root, 'scripts/ci/e2e-wyniki.mjs'), path.join(d, 'scripts/ci/e2e-wyniki.mjs')); fs.mkdirSync(path.join(d, '.maestro-czesc'));
    fs.writeFileSync(path.join(d, '.maestro-czesc', '09-a.yaml'), 'appId: x\nname: Scen A\n---\n- launchApp\n'); fs.writeFileSync(path.join(d, '.maestro-czesc', '10-b.yaml'), 'appId: x\nname: Scen B\n---\n- launchApp\n');
    const xml = (a: boolean, b: boolean) => `<testsuites><testsuite><testcase id="Scen A" name="Scen A" time="3">${a ? '' : '<failure>x</failure>'}</testcase><testcase id="Scen B" name="Scen B" time="4">${b ? '' : '<failure>x</failure>'}</testcase></testsuite></testsuites>`;
    fs.writeFileSync(path.join(d, 'maestro'), `#!/bin/bash\necho "$@" >> ${d}/calls\nif [[ "$*" == *"/09-a.yaml"* ]]; then out=$(echo "$@" | sed -E 's/.*--output ([^ ]+).*/\\1/'); mkdir -p $(dirname $out); echo '${xml(retryOk, true)}' > $out; exit ${retryOk ? 0 : 1}; fi\nmkdir -p e2e-out; echo '${xml(false, true)}' > e2e-out/report.xml; exit 1\n`, { mode: 0o755 });
    let rc = 0; try { bash('bash', ['-e', '-c', body], { cwd: d, env: { ...process.env, PATH: `${d}:${process.env.PATH}`, SIM: 'x', STRICT: strict ? 'true' : 'false' }, stdio: 'pipe' }); } catch (e: any) { rc = e.status; }
    const calls = fs.readFileSync(path.join(d, 'calls'), 'utf8').trim().split('\n'); return { rc, calls: calls.length, retried: calls.filter(c => c.includes('/09-a.yaml')).length, other: calls.filter(c => c.includes('/10-b.yaml')).length }; };
  expect(ponow(false, true)).toEqual({ rc: 0, calls: 2, retried: 1, other: 0 }); /* nieudany A ponowiony raz i zielony; B (zielony) nie jest uruchamiany ponownie */
  expect(ponow(false, false)).toEqual({ rc: 1, calls: 2, retried: 1, other: 0 }); /* drugi czerwony = porażka, bez trzeciej próby */
  expect(ponow(true, true)).toEqual({ rc: 1, calls: 1, retried: 0, other: 0 }); /* tryb ścisły: bez ponowień */
  /* zawieszony Maestro (ten sam przebieg: wyjątek w wątku głównym, proces nie kończył się 68 min) — strażnik czasu kończy podejście */
  expect(step.match(/guard maestro --device/g)).toHaveLength(3); const alarm = Number(step.match(/MAESTRO_ALARM:-(\d+)/)![1]); const jobMin = Number(require('fs').readFileSync(require('path').join(__dirname, '..', '.github/workflows/e2e-ios.yml'), 'utf8').split('\n  e2e:\n')[1].match(/timeout-minutes: (\d+)/)![1]); /* 13.10.2026: limit zadania „e2e” (części), nie „build” */
  /* 06.10.2026: 10 scenariuszy — strażnik ≥ 30 min na podejście; limit zadania mieści build (~40 min) i 2 podejścia, żeby powtórka nie była ucinana */
  expect(alarm).toBeGreaterThanOrEqual(1800); expect(jobMin).toBeGreaterThanOrEqual(15 + 2 * alarm / 60); /* po podziale na części build jest osobnym zadaniem — tu symulator ~10 min + 2 podejścia */
  const d = fs.mkdtempSync(path.join(require('os').tmpdir(), 'mh-')); fs.writeFileSync(path.join(d, 'maestro'), '#!/bin/bash\nsleep 30\n', { mode: 0o755 });
  const t0 = Date.now(); let rc = 0; try { bash('bash', ['-e', '-c', body], { cwd: d, env: { ...process.env, PATH: `${d}:${process.env.PATH}`, SIM: 'x', MAESTRO_ALARM: '1' }, stdio: 'pipe' }); } catch (e: any) { rc = e.status; }
  expect(rc).not.toBe(0); expect(Date.now() - t0).toBeLessThan(15000); /* zawieszenie przerwane, bez powtórki (brak komunikatu sterownika) */
  fs.writeFileSync(path.join(d, 'maestro'), '#!/bin/bash\nkill -9 $$\n', { mode: 0o755 }); let rc2 = 0; /* proces zabity sygnałem — porażka, nie sukces */
  try { bash('bash', ['-e', '-c', body], { cwd: d, env: { ...process.env, PATH: `${d}:${process.env.PATH}`, SIM: 'x' }, stdio: 'pipe' }); } catch (e: any) { rc2 = e.status; }
  expect(rc2).toBe(137);
});
