/* Repozytorium publiczne (ADR-031, 03.10.2026): logi, podsumowania i artefakty przebiegów widzi każdy. */
import { readFileSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';

const wf = (n: string) => readFileSync(join(__dirname, '../.github/workflows', n), 'utf8');

describe('workflowy na publicznym repozytorium', () => {
  test('każdy workflow ma jawne uprawnienia tokenu tylko do odczytu treści i uruchamia się tylko ręcznie', () => {
    for (const n of ['iphone-eas.yml', 'iphone-local.yml', 'ios-unsigned.yml', 'e2e-ios.yml']) {
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
    const out = execFileSync('sed', ['-E', sedExpr], { input: 'iPhone (00008110-001A2B3C4D5E801E) stary 0123456789abcdef0123456789abcdef01234567 build 0fd66ae9-1234-4abc-9def-0123456789ab\n' }).toString();
    expect(out).toBe('iPhone (<UDID>) stary <UDID> build 0fd66ae9-1234-4abc-9def-0123456789ab\n');
  });
  test('build lokalny (bez limitu Expo): kompilacja na maszynie GitHuba, do Expo tylko eas upload; log z maskowaniem UDID', () => {
    const y = wf('iphone-local.yml');
    expect(y).toMatch(/runs-on: macos-15/);
    expect(y).toMatch(/build -p ios --profile adhoc --local --non-interactive --output build\/Trening\.ipa 2>&1 \| sed -E "\$UDID_SED"/);
    expect(y).toMatch(/upload -p ios --build-path build\/Trening\.ipa/);
    expect(y).not.toMatch(/eas-cli@\$EAS_CLI build -p ios --profile adhoc --non-interactive/); // bez buildu w chmurze
    expect(/UDID_SED: '([^']+)'/.exec(y)![1]).toBe(/UDID_SED: '([^']+)'/.exec(wf('iphone-eas.yml'))![1]);
  });
  test('podspec modułu wskazuje właściwe repozytorium', () => {
    expect(readFileSync(join(__dirname, '../modules/rest-activity/RestActivity.podspec'), 'utf8')).toMatch(/s\.homepage\s+= 'https:\/\/github\.com\/lkarwowski494\/trening'/);
  });
});
