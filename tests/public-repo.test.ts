/* Repozytorium publiczne (ADR-031, 03.10.2026): logi, podsumowania i artefakty przebiegów widzi każdy. */
import { readFileSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';

const wf = (n: string) => readFileSync(join(__dirname, '../.github/workflows', n), 'utf8');

describe('workflowy na publicznym repozytorium', () => {
  test('każdy workflow ma jawne uprawnienia tokenu tylko do odczytu treści i uruchamia się tylko ręcznie', () => {
    for (const n of ['iphone-eas.yml', 'iphone-local.yml', 'ios-unsigned.yml', 'e2e-ios.yml', 'testflight.yml']) {
      const y = wf(n);
      expect(y).toMatch(/permissions:\n\s+contents: read/);
      expect(y).not.toMatch(/contents: write|pull_request_target|^\s+push:/m);
      expect(y).toMatch(/on:\n\s+workflow_dispatch:/);
    }
  });
  test('artefakty E2E trzymane 1 dzień', () => {
    const y = wf('e2e-ios.yml');
    const uploads = y.split('actions/upload-artifact@v4').length - 1;
    expect(uploads).toBeGreaterThan(0);
    expect((y.match(/retention-days: 1\n/g) || []).length).toBe(uploads);
  });
  test('link rejestracji urządzenia nie powstaje na publicznym repo; UDID w logach zamaskowane', () => {
    const y = wf('iphone-eas.yml');
    const guard = y.indexOf('github.event.repository.private'); const url = y.indexOf('node scripts/eas/device-url.cjs');
    expect(guard).toBeGreaterThan(0); expect(guard).toBeLessThan(url);
    expect(y).toMatch(/2> >\(tee build\.err \| sed -E "\$UDID_SED" >&2\)/);
    expect(y).toMatch(/configure-credentials\.exp 2>&1 \| sed -E "\$UDID_SED"/);
    const sedExpr = /UDID_SED: '([^']+)'/.exec(y)![1];
    const out = execFileSync('sed', ['-E', sedExpr], { input: 'iPhone (00008110-001A2B3C4D5E801E) stary 0123456789abcdef0123456789abcdef01234567 build 0fd66ae9-1234-4abc-9def-0123456789ab\n0123456789abcdef0123456789abcdef01234567,fedcba9876543210fedcba9876543210fedcba98 commit 0123456789abcdef0123456789abcdef012345678\n' }).toString();
    expect(out).toBe('iPhone (<UDID>) stary <UDID> build 0fd66ae9-1234-4abc-9def-0123456789ab\n<UDID>,<UDID> commit 0123456789abcdef0123456789abcdef012345678\n'); // 41 znaków to nie UDID
  });
  test('build lokalny (bez limitu Expo): kompilacja na maszynie GitHuba, do Expo tylko eas upload; log z maskowaniem UDID', () => {
    const y = wf('iphone-local.yml');
    expect(y).toMatch(/runs-on: macos-26/); // od SDK 56 (Xcode 26.4+); wcześniej macos-15
    expect(y).toMatch(/build -p ios --profile adhoc --local --non-interactive --output build\/Trening\.ipa 2>&1 \| sed -E "\$UDID_SED"/);
    expect(y).toMatch(/upload -p ios --build-path build\/Trening\.ipa/);
    expect(y).not.toMatch(/eas-cli@\$EAS_CLI build -p ios --profile adhoc --non-interactive/); // bez buildu w chmurze
    expect(/UDID_SED: '([^']+)'/.exec(y)![1]).toBe(/UDID_SED: '([^']+)'/.exec(wf('iphone-eas.yml'))![1]);
  });
  test('TestFlight (06.10.2026): tylko narzędzia Apple, klucz API z sekretów — nigdy wypisywany, usuwany zawsze; logi 1 dzień; numer buildu rośnie', () => {
    const y = wf('testflight.yml');
    expect(y).not.toMatch(/eas-cli|eas build|eas upload/);
    for (const k of ['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_KEY_P8']) expect(y).toContain(`secrets.${k}`);
    expect(y).not.toMatch(/echo[^\n]*\$\{?ASC_KEY_P8/); expect(y).toMatch(/umask 077/);
    expect(y).toMatch(/- name: Usunięcie klucza z maszyny\n\s+if: always\(\)\n\s+run: rm -f "\$RUNNER_TEMP\/AuthKey\.p8"/);
    expect(y).toMatch(/BUILD_NUMBER=\$\(\(1000 \+ GITHUB_RUN_NUMBER\)\)/); expect(y).not.toMatch(/\$\{\{[^}]*\+/); /* wyrażenia Actions nie liczą */ expect(y).toMatch(/retention-days: 1/);
    expect(y).toMatch(/<string>app-store-connect<\/string>/);
    expect(y.indexOf('AuthKey.p8"\n')).toBeGreaterThan(y.indexOf('pod install'));
    expect(y.indexOf('Sekrety obecne')).toBeLessThan(y.indexOf('npm ci')); /* brak sekretu kończy przebieg od razu */
    expect((y.match(/unset ASC_KEY_ID ASC_ISSUER_ID/g) || []).length).toBe(2); expect(y).not.toMatch(/-authenticationKeyID "\$ASC_KEY_ID"/); /* logi w artefakcie bez identyfikatorów */ /* audyt 06.10: klucz na dysku dopiero przed archiwum */
  });
  test('deklaracja szyfrowania: aplikacja nie używa szyfrowania poza systemowym (bez pytania przy każdym buildzie w App Store Connect)', () => {
    expect(JSON.parse(readFileSync(join(__dirname, '../app.json'), 'utf8')).expo.ios.infoPlist.ITSAppUsesNonExemptEncryption).toBe(false);
  });
  test('audyt 06.10.2026: artefakty buildu bez podpisu 1 dzień; .gitignore chroni pliki z sekretami', () => {
    const y = wf('ios-unsigned.yml'); expect((y.match(/retention-days: 1\n/g) || []).length).toBe(y.split('actions/upload-artifact@v4').length - 1);
    const g = readFileSync(join(__dirname, '../.gitignore'), 'utf8'); for (const p of ['.env*', '*.p8', '*.p12', '*.mobileprovision', '*.cer']) expect(g.split('\n')).toContain(p);
  });
  test('podspec modułu wskazuje właściwe repozytorium', () => {
    expect(readFileSync(join(__dirname, '../modules/rest-activity/RestActivity.podspec'), 'utf8')).toMatch(/s\.homepage\s+= 'https:\/\/github\.com\/lkarwowski494\/trening'/);
  });
});
