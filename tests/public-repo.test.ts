/* Repozytorium publiczne (ADR-031, 03.10.2026): logi, podsumowania i artefakty przebiegów widzi każdy. */
import { readFileSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';

const wf = (n: string) => readFileSync(join(__dirname, '../.github/workflows', n), 'utf8');

describe('workflowy na publicznym repozytorium', () => {
  test('każdy workflow ma jawne uprawnienia tokenu tylko do odczytu treści i uruchamia się tylko ręcznie', () => {
    for (const n of ['ios-unsigned.yml', 'testflight.yml']) {
      const y = wf(n);
      expect(y).toMatch(/permissions:\n\s+contents: read/);
      expect(y).not.toMatch(/contents: write|pull_request_target|^\s+push:/m);
      expect(y).toMatch(/on:\n\s+workflow_dispatch:/);
    }
    /* decyzja właściciela 06.10.2026 (wariant A): testy przy każdym wypchnięciu; E2E samo tylko na main i integration/**; nigdy pull_request (forki) */
    const e = wf('e2e-ios.yml'); expect(e).toMatch(/permissions:\n\s+contents: read/); expect(e).not.toMatch(/contents: write|pull_request/);
    expect(e).toMatch(/push:\n\s+branches: \[main, 'integration\/\*\*'\]/); expect(e).toMatch(/workflow_dispatch:/); expect(e).not.toMatch(/secrets\.(?!GITHUB_TOKEN)/);
    const t = wf('tests.yml'); expect(t).toMatch(/permissions:\n\s+contents: read/); expect(t).not.toMatch(/contents: write|pull_request|secrets\./);
    expect(t).toMatch(/on:\n\s+push:/); expect(t).toMatch(/run: npm run verify/);
  });
  test('przebiegi według harmonogramu (nightly.yml, tests-tz.yml; 06.10.2026): tylko harmonogram i ręcznie, odczyt, bez sekretów, artefakty 1 dzień', () => {
    const fs = require('fs') as typeof import('fs');
    for (const n of ['nightly.yml', 'tests-tz.yml'].filter(n => fs.existsSync(join(__dirname, '../.github/workflows', n)))) {
      const y = wf(n);
      expect([n, /permissions:\n\s+contents: read/.test(y), /contents: write|pull_request|^\s+push:/m.test(y), /secrets\./.test(y), /\n\s+schedule:\n/.test(y), /workflow_dispatch:/.test(y)]).toEqual([n, true, false, false, true, true]);
      const ups = y.split('actions/upload-artifact@v4').length - 1; expect([n, (y.match(/retention-days: 1\n/g) || []).length]).toEqual([n, ups]);
    }
    const n = wf('nightly.yml'); for (const y of [n, wf('tests-tz.yml')]) { expect(y).toContain(`vars.NIGHTLY_REFS || '["main","feature/e2-swap"]'`); expect(y).toMatch(/ref: \$\{\{ matrix\.ref \}\}\n\s+persist-credentials: false/); } /* audyt TST-01: noc także na gałęzi wydania */ expect(n).toMatch(/MATRIX_SEED=random/); expect(n).toMatch(/npx stryker run/); expect(n).toMatch(/uses: \.\/\.github\/workflows\/e2e-ios\.yml/); expect(n).toMatch(/wyglad: dark/);
    const e = wf('e2e-ios.yml'); expect(e).toMatch(/workflow_call:/); expect(e).toMatch(/WANT: \$\{\{ inputs\.urzadzenie \}\}/); expect(e).toMatch(/simctl ui "\$DEV" appearance dark/);
  });
  test('artefakty E2E trzymane 1 dzień', () => {
    const y = wf('e2e-ios.yml');
    const uploads = y.split('actions/upload-artifact@v4').length - 1;
    expect(uploads).toBeGreaterThan(0);
    expect((y.match(/retention-days: 1\n/g) || []).length).toBe(uploads);
  });
  test('decyzja właściciela 08.10.2026 (audyt M4): workflowy EAS usunięte — żaden workflow nie używa Expo ani sekretów spoza klucza App Store Connect', () => {
    const fs = require('fs') as typeof import('fs'); const dir = join(__dirname, '../.github/workflows');
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.yml')).sort();
    expect(files).toEqual(['e2e-ios.yml', 'ios-unsigned.yml', 'nightly.yml', 'testflight.yml', 'tests-tz.yml', 'tests.yml']);
    expect(fs.existsSync(join(__dirname, '../scripts/eas'))).toBe(false);
    const allowed = ['secrets.GITHUB_TOKEN', 'secrets.ASC_KEY_ID', 'secrets.ASC_ISSUER_ID', 'secrets.ASC_KEY_P8'];
    for (const f of files) {
      const y = wf(f);
      expect([f, /EXPO_TOKEN|eas-cli|eas build|eas upload|ASC_API_KEY_P8|APPLE_TEAM_ID/.test(y)]).toEqual([f, false]);
      for (const m of y.match(/secrets\.[A-Z_0-9]+/g) || []) expect([f, m, allowed.includes(m)]).toEqual([f, m, true]);
    }
  });
  test('TestFlight (06.10.2026): tylko narzędzia Apple, klucz API z sekretów — nigdy wypisywany, usuwany zawsze; logi 1 dzień; numer buildu rośnie', () => {
    const y = wf('testflight.yml');
    expect(y).not.toMatch(/eas-cli|eas build|eas upload/);
    for (const k of ['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_KEY_P8']) expect(y).toContain(`secrets.${k}`);
    expect(y).not.toMatch(/echo[^\n]*\$\{?ASC_KEY_P8/); expect(y).toMatch(/umask 077/);
    expect(y).toMatch(/- name: Usunięcie klucza z maszyny\n\s+if: always\(\)\n\s+run: rm -f "\$RUNNER_TEMP\/AuthKey\.p8"/);
    expect(y).toMatch(/BUILD_BASE: \$\{\{ vars\.BUILD_BASE \|\| '1000' \}\}/); expect(y).toMatch(/BUILD_NUMBER=\$\(\(BUILD_BASE \+ GITHUB_RUN_NUMBER\)\)/); /* audyt NAT-03: baza w zmiennej repozytorium */ expect(y).not.toMatch(/\$\{\{[^}]*\+/); /* wyrażenia Actions nie liczą */ expect(y).toMatch(/retention-days: 1/);
    expect(y).toMatch(/<string>app-store-connect<\/string>/);
    expect(y.indexOf('AuthKey.p8"\n')).toBeGreaterThan(y.indexOf('pod install'));
    expect(y.indexOf('Sekrety obecne')).toBeLessThan(y.indexOf('npm ci')); /* brak sekretu kończy przebieg od razu */
    /* audyt SEC-02: xcodebuild wypisuje pełną linię poleceń (z identyfikatorami) — przed artefaktem logi są czyszczone; filtr sprawdzony na przykładzie */
    const mask = y.indexOf('Identyfikatory klucza wycięte z logów przed artefaktem'); expect(mask).toBeGreaterThan(y.indexOf('Eksport i wysyłka')); expect(mask).toBeLessThan(y.indexOf('actions/upload-artifact@v4'));
    const step = y.slice(mask, y.indexOf('actions/upload-artifact@v4')); expect(step).toMatch(/if: failure\(\)/); expect(step).toContain('ios/xcodebuild.log export.log');
    const exprs = [...step.matchAll(/-e "(s\/\$\{ASC_(?:KEY|ISSUER)_ID\}\/<[A-Z_]+>\/g)"/g)].map(m => m[1].replace('${ASC_KEY_ID}', 'ABC123DEFG').replace('${ASC_ISSUER_ID}', '69a6de70-0000-47e3-e053-5b8c7c11a4d1')); expect(exprs.length).toBe(2);
    const line = 'Command line invocation: xcodebuild -authenticationKeyID ABC123DEFG -authenticationKeyIssuerID 69a6de70-0000-47e3-e053-5b8c7c11a4d1\n';
    expect(execFileSync('sed', exprs.flatMap(e => ['-e', e]), { input: line }).toString()).toBe('Command line invocation: xcodebuild -authenticationKeyID <KEY_ID> -authenticationKeyIssuerID <ISSUER_ID>\n');
    expect((y.match(/unset ASC_KEY_ID ASC_ISSUER_ID/g) || []).length).toBe(2); expect(y).not.toMatch(/-authenticationKeyID "\$ASC_KEY_ID"/); /* logi w artefakcie bez identyfikatorów */ /* audyt 06.10: klucz na dysku dopiero przed archiwum */
  });
  test('deklaracja szyfrowania: aplikacja nie używa szyfrowania poza systemowym (bez pytania przy każdym buildzie w App Store Connect)', () => {
    expect(JSON.parse(readFileSync(join(__dirname, '../app.json'), 'utf8')).expo.ios.infoPlist.ITSAppUsesNonExemptEncryption).toBe(false);
  });
  test('audyt 06.10.2026: artefakty buildu bez podpisu 1 dzień; .gitignore chroni pliki z sekretami', () => {
    const y = wf('ios-unsigned.yml'); expect((y.match(/retention-days: 1\n/g) || []).length).toBe(y.split('actions/upload-artifact@v4').length - 1);
    const g = readFileSync(join(__dirname, '../.gitignore'), 'utf8'); for (const p of ['.env*', '*.p8', '*.p12', '*.mobileprovision', '*.cer', 'credentials.json', '*.pem', '*.key', '*.jks', '*.keystore', '*.xcarchive/', 'e2e-out/', '.claude/worktrees/']) expect(g.split('\n')).toContain(p); /* + audyt SEC-07 (08.10.2026) */
  });
  test('podspec modułu wskazuje właściwe repozytorium', () => {
    expect(readFileSync(join(__dirname, '../modules/rest-activity/RestActivity.podspec'), 'utf8')).toMatch(/s\.homepage\s+= 'https:\/\/github\.com\/lkarwowski494\/trening'/);
  });
});

/* audyt 08.10.2026 (N2): polityka prywatności (docs/privacy.html, GitHub Pages) zgodna z kodem — zmiana działania aplikacji wymaga zmiany strony */
describe('polityka prywatności zgodna z kodem', () => {
  const fs = require('fs') as typeof import('fs'); const root = join(__dirname, '..');
  const files = (d: string): string[] => fs.readdirSync(join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(d, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [join(d, e.name)] : []);
  test('strona PL/EN istnieje, Pages bez Jekylla; aplikacja nie wykonuje żadnych wywołań sieciowych; HealthKit tylko zapis', () => {
    const html = readFileSync(join(root, 'docs/privacy.html'), 'utf8');
    expect(html).toMatch(/<section lang="pl">/); expect(html).toMatch(/<section lang="en">/); expect(fs.existsSync(join(root, 'docs/.nojekyll'))).toBe(true);
    expect(html).toContain('nie łączy się z internetem'); expect(html).toContain('does not connect to the internet');
    const net = ['lib', 'app', 'components'].flatMap(files).filter(f => /\bfetch\(|XMLHttpRequest|WebSocket|axios|EventSource/.test(readFileSync(join(root, f), 'utf8')));
    expect(net).toEqual([]);
    expect(readFileSync(join(root, 'lib/health.ts'), 'utf8')).toMatch(/requestAuthorization\(\[\], \[/); /* odczyt: pusta lista */
  });
  /* fala 2 audytu 0.10: masa ciała z datą (State.bodyMassLog), Zdrowie — siłowe i cardio z ponowieniem, CSV bez masy ciała, pliki udostępniania usuwane */
  test('strona mówi to, co robi kod: pomiary masy ciała z datą (kopia tak, CSV nie), Zdrowie — siłowe i cardio z ponowieniem, sprzątanie plików udostępniania', () => {
    const html = readFileSync(join(root, 'docs/privacy.html'), 'utf8'); const seed = readFileSync(join(root, 'lib/seed.ts'), 'utf8'); const backup = readFileSync(join(root, 'lib/backup.ts'), 'utf8'); const health = readFileSync(join(root, 'lib/health.ts'), 'utf8');
    expect(seed).toMatch(/bodyMassLog\?: BodyMassEntry\[\]/); expect(html).toContain('pomiary masy ciała z datą pomiaru'); expect(html).toContain('body-mass measurements with their dates');
    expect(html).toContain('Kopia zapasowa obejmuje wszystkie dane'); expect(html).toContain('eksport CSV zawiera tylko serie treningów (bez masy ciała)'); expect(html).toContain('a CSV\nexport contains only workout sets (no body mass)');
    expect(backup).toMatch(/state: getState\(\)/); /* kopia = cały stan (z pomiarami) */ expect(backup).toContain("'Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE'"); /* CSV bez kolumny masy ciała */
    expect(html).toContain('siłowe i cardio'); expect(html).toContain('strength and cardio'); expect(health).toMatch(/HK_ACTIVITY\.running/); expect(health).toMatch(/export function retryHealth/);
    expect(html).toContain('ponownie przy kolejnym uruchomieniu'); expect(html).toContain('saved again the next time the app starts');
    expect(html).toContain('usuwa ze swojej pamięci podręcznej'); expect(backup).toMatch(/finally \{ await FileSystem\.deleteAsync\(path/);
  });
});

/* audyt 0.10 SEC-06, SEC-08, NAT-07 (fala 2) */
describe('zależności i konfiguracja natywna', () => {
  const fs = require('fs') as typeof import('fs'); const root = join(__dirname, '..');
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')); const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));
  test('SEC-06: query-string nie jest zależnością bezpośrednią (kod jej nie importuje; zostaje jako zależność expo-router)', () => {
    expect(pkg.dependencies['query-string']).toBeUndefined(); expect(lock.packages[''].dependencies['query-string']).toBeUndefined();
    expect(lock.packages['node_modules/expo-router'].dependencies['query-string']).toBeTruthy();
    const files = (d: string): string[] => fs.readdirSync(join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(d, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [join(d, e.name)] : []);
    expect(['lib', 'app', 'components'].flatMap(files).filter(f => /from 'query-string'|require\('query-string'\)/.test(readFileSync(join(root, f), 'utf8')))).toEqual([]);
  });
  test('SEC-08: lista licencji zgodna z package-lock i node_modules (scripts/licenses.mjs --check, także w verify)', () => {
    expect(pkg.scripts['check:licenses']).toBe('node scripts/licenses.mjs --check'); expect(pkg.scripts.verify).toContain('npm run check:licenses');
    expect(require('child_process').execFileSync('node', ['scripts/licenses.mjs', '--check'], { cwd: root }).toString()).toMatch(/^licencje: OK/);
  });
  test('NAT-07: ekran startowy z wariantem ciemnym (tło jak motyw ciemny), martwy moduł ExtensionStorage poza autolinkowaniem', () => {
    const app = JSON.parse(readFileSync(join(root, 'app.json'), 'utf8')); const sp = app.expo.plugins.find((p: unknown) => Array.isArray(p) && p[0] === 'expo-splash-screen')[1];
    expect(sp.dark.backgroundColor).toBe(require('../lib/theme').dark.bg); expect(sp.backgroundColor).toBe('#F4F3EF');
    expect(pkg.expo.autolinking.exclude).toEqual(['@bacons/apple-targets']);
  });
});
