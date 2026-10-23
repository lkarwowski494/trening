/*
 * Audyt M1 z 19.10.2026, partia 2 — zmiany workflowów i skryptów CI: 014 (manifest prywatności), 018 (bramka E2E przed TestFlight), 019 (środowisko „release”),
 * 020 (klucz App Store Connect po archiwum i podpisie), 021 (pozostałości EAS), 022 (pliki wskazane przez workflowy istnieją), 023 (mapy źródeł JS).
 * Model po L-001: testy samych plików workflowu NIE zastępują przebiegu dowodowego na gotowym produkcie (lista przebiegów w raporcie M2).
 * Czerwone na 8273448 (nowe skrypty nie istnieją, kroki w innej kolejności, workflow bez bramki).
 */
import { readFileSync, existsSync, readdirSync, mkdtempSync, writeFileSync, chmodSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..'); const read = (f: string) => readFileSync(join(root, f), 'utf8'); const wf = (n: string) => read('.github/workflows/' + n);
const at = (y: string, n: string) => y.indexOf(`- name: ${n}`);

describe('M1-014: manifest prywatności buildu ma cztery kategorie, brak którejś = błąd', () => {
  const CATS = ['NSPrivacyAccessedAPICategoryFileTimestamp', 'NSPrivacyAccessedAPICategoryUserDefaults', 'NSPrivacyAccessedAPICategorySystemBootTime', 'NSPrivacyAccessedAPICategoryDiskSpace'];
  const plist = (cats: string[]) => `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n\t<key>NSPrivacyAccessedAPITypes</key>\n\t<array>\n${cats.map(c => `\t\t<dict>\n\t\t\t<key>NSPrivacyAccessedAPIType</key>\n\t\t\t<string>${c}</string>\n\t\t\t<key>NSPrivacyAccessedAPITypeReasons</key>\n\t\t\t<array>\n\t\t\t\t<string>X.1</string>\n\t\t\t</array>\n\t\t</dict>\n`).join('')}\t</array>\n\t<key>NSPrivacyTracking</key>\n\t<false/>\n</dict>\n</plist>\n`;
  const run = (args: string[], file: string, content: string) => { writeFileSync(file, content); const r = spawnSync('node', [join(root, 'scripts/ci/ensure-privacy-manifest.mjs'), ...args, file], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr, after: readFileSync(file, 'utf8') }; };
  const dir = () => mkdtempSync(join(tmpdir(), 'priv-'));
  test('tryb sprawdzenia: komplet = OK; brak DiskSpace = błąd z nazwą kategorii; plik uszkodzony = błąd', () => {
    const f = join(dir(), 'PrivacyInfo.xcprivacy');
    expect(run(['--check'], f, plist(CATS)).rc).toBe(0);
    const bad = run(['--check'], f, plist(CATS.slice(0, 3))); expect(bad.rc).toBe(1); expect(bad.out).toContain('NSPrivacyAccessedAPICategoryDiskSpace');
    expect(run(['--check'], f, 'to nie jest plist').rc).toBe(1);
  });
  test('tryb uzupełnienia: dopisuje brakującą kategorię z powodami E174.1 i 85F4.1 (jak manifest modułu plików), jest idempotentny i nie rusza reszty', () => {
    const f = join(dir(), 'PrivacyInfo.xcprivacy'); const r = run(['--fix'], f, plist(CATS.slice(0, 3)));
    expect(r.rc).toBe(0); expect(r.after).toContain('NSPrivacyAccessedAPICategoryDiskSpace'); expect(r.after).toContain('<string>E174.1</string>'); expect(r.after).toContain('<string>85F4.1</string>');
    for (const c of CATS) expect((r.after.match(new RegExp(c, 'g')) || []).length).toBe(1);
    expect(r.after).toContain('NSPrivacyTracking'); expect(run(['--check'], f, r.after).rc).toBe(0);
    const again = run(['--fix'], f, r.after); expect(again.after).toBe(r.after);
  });
  test('testflight.yml: po pod install uzupełnia i sprawdza manifest jako BŁĄD (nie ostrzeżenie), a po eksporcie sprawdza manifest w .ipa', () => {
    const y = wf('testflight.yml'); const step = y.slice(at(y, 'Manifest prywatności'), at(y, 'Platforma iOS'));
    expect(step).toContain('ensure-privacy-manifest.mjs'); expect(step).not.toMatch(/::warning::/); expect(at(y, 'Manifest prywatności')).toBeGreaterThan(y.indexOf('pod install'));
    const ipa = y.slice(at(y, 'Strażnik uprawnień w .ipa'), at(y, 'Wysyłka do App Store Connect')); expect(ipa).toContain('ensure-privacy-manifest.mjs --check');
  });
});

describe('M1-018: TestFlight czeka na zielony pakiet podstawowy E2E dla tego samego SHA', () => {
  test('wyzwalacze: dispatch z wejściami i push na main bez zmian samej dokumentacji (te same paths-ignore co e2e-ios.yml)', () => {
    const t = wf('testflight.yml'); const e = wf('e2e-ios.yml');
    const pi = (y: string) => /paths-ignore: (\[[^\]]*\])/.exec(y.slice(y.indexOf('push:')))?.[1];
    expect(pi(e)).toBe("['docs/**', '**/*.md', 'tests/**', '.claude/**']"); /* 21.10.2026 (właściciel): zmiany samych testów Jest i plików agentów nie budują aplikacji */
    expect(t.slice(0, t.indexOf('\npermissions:'))).not.toMatch(/\n  push:/); /* 21.10.2026 (właściciel): TestFlight tylko ręcznie (wersja finalna) */
    for (const k of ['bez_wysylki', 'pomin_bramke_e2e', 'powod']) expect(t).toContain(`      ${k}:`);
  });
  test('e2e-ios.yml: run-name koduje pakiet i zawężenia, żeby bramka rozpoznała pełnowartościowy przebieg', () => {
    const e = wf('e2e-ios.yml'); expect(e).toMatch(/^run-name: .*E2E iOS · /m); expect(e).toContain("inputs.pakiet || 'podstawowy'"); expect(e).toContain('tylko wybrane'); expect(e).toContain('aplikacja z innego przebiegu');
  });
  test('zadanie „bramka” jest pierwsze, bez sekretów, a „build” czeka na nie (przed npm ci); awaryjne pominięcie wymaga powodu i zostaje w podsumowaniu', () => {
    const y = wf('testflight.yml'); const jobs = y.slice(y.indexOf('\njobs:\n'));
    expect(jobs.indexOf('\n  bramka:\n')).toBeGreaterThan(0); expect(jobs.indexOf('\n  bramka:\n')).toBeLessThan(jobs.indexOf('\n  build:\n'));
    const gate = jobs.slice(jobs.indexOf('\n  bramka:\n'), jobs.indexOf('\n  build:\n'));
    expect(gate).toMatch(/runs-on: ubuntu-latest/); expect(gate).toMatch(/actions: read/); expect(gate).not.toMatch(/secrets\.(?!GITHUB_TOKEN)/); expect(gate).toContain('scripts/ci/bramka-e2e.sh'); expect(gate).toContain('GITHUB_SHA');
    expect(gate).toMatch(/powod/); expect(gate).toContain('GITHUB_STEP_SUMMARY'); expect(gate).not.toMatch(/run:[^\n]*\$\{\{/);
    const build = jobs.slice(jobs.indexOf('\n  build:\n'), jobs.indexOf('\n  tag:\n')); expect(build).toMatch(/needs: bramka/);
  });
  const fakeGh = (rows: string[][], sleepFile?: string) => { const d = mkdtempSync(join(tmpdir(), 'gh-')); const bin = join(d, 'bin'); mkdirSync(bin); const cnt = join(d, 'n'); writeFileSync(cnt, '0');
    const frames = rows.map(r => r.join('\n')); writeFileSync(join(bin, 'gh'), `#!/usr/bin/env bash\nn=$(cat "${cnt}"); echo $((n+1)) > "${cnt}"\nframes=(${frames.map(f => `'${f.replace(/'/g, "'\\''")}'`).join(' ')})\ni=$n; [ $i -ge \${#frames[@]} ] && i=$((\${#frames[@]}-1))\nprintf '%s' "\${frames[$i]}"\n`); chmodSync(join(bin, 'gh'), 0o755); return bin; };
  const gate = (frames: string[][], env: Record<string, string> = {}) => { const bin = fakeGh(frames); const r = spawnSync('bash', [join(root, 'scripts/ci/bramka-e2e.sh'), 'o/r', 'abc123'], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, BRAMKA_POLL_SEC: '0', BRAMKA_GRACE_POLLS: '2', BRAMKA_MAX_POLLS: '3', ...env } }); return { rc: r.status, out: r.stdout + r.stderr }; };
  const row = (id: string, status: string, concl: string, title: string) => `${id}\t${status}\t${concl || '-'}\t${title}`;
  test('bramka-e2e.sh: zielony pakiet podstawowy / pełny / ścisły na SHA → przechodzi', () => {
    for (const t of ['podstawowy', 'pelny', 'ścisły']) expect(gate([[row('1', 'completed', 'success', `E2E iOS · ${t}`)]]).rc).toBe(0);
  });
  test('bramka-e2e.sh: przebieg zawężony (tylko wybrane / cudza aplikacja) i niezielony się nie liczą; brak przebiegu → błąd z instrukcją', () => {
    expect(gate([[row('1', 'completed', 'success', 'E2E iOS · podstawowy · tylko wybrane')]]).rc).toBe(1);
    expect(gate([[row('1', 'completed', 'success', 'E2E iOS · podstawowy · aplikacja z innego przebiegu')]]).rc).toBe(1);
    const red = gate([[row('1', 'completed', 'failure', 'E2E iOS · podstawowy')]]); expect(red.rc).toBe(1); expect(red.out).toMatch(/czerwon/i);
    const none = gate([['']]); expect(none.rc).toBe(1); expect(none.out).toContain('e2e-ios.yml'); expect(none.out).toContain('bez_wysylki');
  });
  test('bramka-e2e.sh: trwający przebieg → czeka i przechodzi, gdy zrobi się zielony; po limicie czekania → błąd', () => {
    const run = row('1', 'in_progress', '', 'E2E iOS · podstawowy'); const ok = row('1', 'completed', 'success', 'E2E iOS · podstawowy');
    expect(gate([[run], [run], [ok]]).rc).toBe(0); const to = gate([[run]]); expect(to.rc).toBe(1); expect(to.out).toMatch(/limit czekania/i);
  });
});

describe('M1-019: środowisko „release” i sekrety', () => {
  test('zadanie build deklaruje environment: release (GitHub utworzy je przy pierwszym użyciu; reguły ustawia właściciel); zadanie tag go nie potrzebuje', () => {
    const y = wf('testflight.yml'); const build = y.slice(y.indexOf('\n  build:\n'), y.indexOf('\n  tag:\n')); expect(build).toMatch(/\n    environment: release\n/);
    expect(y.slice(y.indexOf('\n  bramka:\n'), y.indexOf('\n  build:\n'))).not.toContain('environment:');
  });
  test('żaden workflow nie wymienia nieużywanych sekretów EXPO_TOKEN, ASC_API_KEY_P8, APPLE_TEAM_ID', () => {
    for (const f of readdirSync(join(root, '.github/workflows'))) expect([f, /EXPO_TOKEN|ASC_API_KEY_P8|APPLE_TEAM_ID/.test(wf(f))]).toEqual([f, false]);
  });
});

describe('M1-020: klucz API App Store Connect trafia na dysk dopiero po archiwum i podpisie ad hoc', () => {
  test('kolejność: Archiwum → Uprawnienia w archiwum → Klucz API na dysk → Eksport; archiwum i codesign nie dotykają klucza', () => {
    const y = wf('testflight.yml'); const order = ['Archiwum (bez podpisu', 'Uprawnienia w archiwum', 'Klucz API na dysk', 'Eksport do pliku'].map(n => at(y, n));
    expect(order.every(i => i > 0)).toBe(true); expect([...order].sort((a, b) => a - b)).toEqual(order);
    const before = y.slice(0, order[2]); expect(before).not.toMatch(/AuthKey\.p8/); expect(before).not.toMatch(/ASC_KEY_P8/.source.replace('ASC_KEY_P8', 'printf .*ASC_KEY_P8'));
  });
});

describe('M1-021: jedno źródło numerów buildu', () => {
  test('eas.json (jeśli jest) nie ma licznika buildów EAS; docs/15 nie opisuje go jako wymogu', () => {
    if (existsSync(join(root, 'eas.json'))) { const s = read('eas.json'); expect(s).not.toMatch(/autoIncrement|appVersionSource/); }
    expect(read('docs/15-app-store.md')).not.toMatch(/appVersionSource|autoIncrement/); expect(read('docs/15-app-store.md')).toContain('BUILD_BASE');
  });
});

describe('M1-022: pliki wskazane przez workflowy istnieją', () => {
  test('każda ścieżka scripts/…, store/…, docs/…, .maestro/… z workflowów (także w komentarzach) istnieje w repozytorium', () => {
    const miss: string[] = [];
    for (const f of readdirSync(join(root, '.github/workflows'))) {
      const y = wf(f); for (const m of y.matchAll(/(?<![\w./$-])((?:scripts|store|docs|\.maestro|targets|site|tests)\/[\w./-]*\.[a-z]{2,5})(?![\w-])/g)) {
        const p = m[1].replace(/\/$/, ''); if (/[*{}$]/.test(p)) continue; if (!existsSync(join(root, p))) miss.push(`${f}: ${p}`);
      }
    }
    expect([...new Set(miss)]).toEqual([]);
  });
});

describe('M1-023: mapy źródeł JS buildu są archiwizowane', () => {
  test('archiwum dostaje SOURCEMAP_FILE, plik mapy jest sprawdzany (niepusty), wysyłany jako artefakt i dołączany do tagu wydania', () => {
    const y = wf('testflight.yml'); const arch = y.slice(at(y, 'Archiwum (bez podpisu'), at(y, 'Zegarek w archiwum'));
    expect(arch).toContain('SOURCEMAP_FILE='); const chk = y.slice(at(y, 'Mapa źródeł JS'), at(y, 'Zegarek w archiwum')); expect(chk).toMatch(/-s /); expect(chk).toContain('::error::');
    expect(y).toMatch(/name: mapy-zrodel-b\$\{\{ env\.BUILD_NUMBER \}\}/); expect(y).toMatch(/retention-days: 90/);
    const tag = y.slice(y.indexOf('\n  tag:\n')); expect(tag).toContain('download-artifact'); expect(tag).toMatch(/gh release (create|upload)/); expect(tag).toContain('bez_wysylki');
  });
});

describe('M1-048 (DEC-06 a): zapis lokalizacji produktów w App Store Connect tylko za środowiskiem „release”', () => {
  const y = wf('asc-iap-localizations.yml'); const jobs = y.slice(y.indexOf('\njobs:\n') + 7).split(/\n(?=  [a-z-]+:\n)/);
  const apply = jobs.filter(j => /--apply/.test(j)); const readOnly = jobs.filter(j => /--dry-run/.test(j));
  test('dokładnie jeden job wykonuje --apply, deklaruje environment: release i działa tylko dla wejścia tryb=apply', () => {
    expect(apply).toHaveLength(1); expect(apply[0]).toMatch(/\n    environment: release\n/); expect(apply[0]).toMatch(/if: \$\{\{ inputs\.tryb == 'apply' \}\}/);
  });
  test('tryb tylko-odczyt (--dry-run) jest osobnym jobem bez środowiska i bez --apply; apply czeka na plan', () => {
    expect(readOnly).toHaveLength(1); expect(readOnly[0]).not.toContain('environment:'); expect(readOnly[0]).not.toContain('--apply'); expect(apply[0]).toMatch(/needs: /);
  });
  test('bez nowych sekretów: tylko ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8; wejście tryb nadal tylko przez zmienną środowiskową', () => {
    expect([...new Set([...y.matchAll(/secrets\.(\w+)/g)].map(m => m[1]))].sort()).toEqual(['ASC_ISSUER_ID', 'ASC_KEY_ID', 'ASC_KEY_P8']);
    expect(y).not.toMatch(/run:[^\n]*\$\{\{ inputs/);
  });
});
