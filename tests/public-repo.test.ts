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
      expect(y).not.toMatch(/pull_request/);
      expect(y).toMatch(/on:\n\s+workflow_dispatch:/);
    }
    expect(wf('ios-unsigned.yml')).not.toMatch(/contents: write|^\s+push:/m);
    const tf = wf('testflight.yml'); expect(tf).toMatch(/\non:\n  workflow_dispatch:\n  push:\n    branches: \[main\]\n/); /* dokładne wcięcie (12.10: `push:` pod workflow_dispatch przeszło luźny test) */ expect(tf.match(/contents: write/g)).toHaveLength(1);
    const tagJob = tf.slice(tf.indexOf('\n  tag:\n')); expect(tagJob.length).toBeGreaterThan(10); expect(tagJob).toMatch(/needs: build/);
    expect(tagJob).toMatch(/permissions:\n\s+contents: write/); expect(tagJob).not.toMatch(/secrets\./);
    expect(tf.slice(0, tf.indexOf('\n  tag:\n'))).not.toMatch(/contents: write/);
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
    expect(files).toEqual(['asc-iap-localizations.yml', 'e2e-ios.yml', 'ios-unsigned.yml', 'nightly.yml', 'pages.yml', 'store-screenshots.yml', 'testflight.yml', 'tests-tz.yml', 'tests.yml']);
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
    expect((y.match(/unset ASC_KEY_ID ASC_ISSUER_ID/g) || []).length).toBe(1); expect(y).not.toMatch(/-authenticationKeyID "\$ASC_KEY_ID"/); /* logi w artefakcie bez identyfikatorów */ /* audyt 06.10: klucz na dysku dopiero przed archiwum */
    /* 13.10.2026 (build 1011): archiwum nie tworzy certyfikatu Apple Development; klucz API tylko w eksporcie (podpis dystrybucyjny w chmurze) */
    const arch = y.slice(y.indexOf('- name: Archiwum'), y.indexOf('- name: Eksport i wysyłka'));
    expect(arch).toContain('CODE_SIGNING_ALLOWED=NO'); expect(arch).toContain('CODE_SIGNING_REQUIRED=NO');
    expect(arch).not.toMatch(/CODE_SIGN_STYLE=Automatic|authenticationKey|allowProvisioningUpdates/);
    const exp = y.slice(y.indexOf('- name: Eksport i wysyłka'), y.indexOf('- name: Usunięcie klucza'));
    expect(exp).toContain('-allowProvisioningUpdates'); expect(exp).toContain('<key>signingStyle</key><string>automatic</string>');
  });
  test('asc-iap-localizations.yml (14.10.2026): tylko ręcznie z wejściem tryb (dry-run domyślnie), ubuntu, odczyt treści, klucz maskowany w RUNNER_TEMP i usuwany zawsze, bez zapisów do repozytorium', () => {
    const y = wf('asc-iap-localizations.yml');
    expect(y).toMatch(/\non:\n  workflow_dispatch:\n    inputs:\n      tryb:\n/); expect(y).toMatch(/options: \[dry-run, apply\]\n\s+default: dry-run\n/);
    expect(y).toMatch(/permissions:\n\s+contents: read\n/); expect(y).not.toMatch(/contents: write|pull_request|schedule:|^\s+push:/m);
    expect(y).toMatch(/runs-on: ubuntu-latest/); expect(y).not.toMatch(/macos|eas-cli|EXPO_TOKEN/);
    for (const k of ['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_KEY_P8']) expect(y).toContain(`secrets.${k}`);
    expect(y).toContain('::add-mask::$ASC_KEY_ID'); expect(y).toContain('::add-mask::$ASC_ISSUER_ID'); expect(y).toMatch(/umask 077/);
    expect(y).not.toMatch(/echo[^\n]*\$\{?ASC_KEY_P8(?!" \|)/); expect(y).not.toMatch(/echo "\$ASC_KEY_(ID|P8)|echo "\$ASC_ISSUER_ID/);
    expect(y).toMatch(/- name: Usunięcie klucza z maszyny\n\s+if: always\(\)\n\s+run: rm -f "\$RUNNER_TEMP\/AuthKey\.p8"/);
    expect(y).toMatch(/TRYB: \$\{\{ inputs\.tryb \}\}/); expect(y).not.toMatch(/run:[^\n]*\$\{\{ inputs/); /* wejście tylko przez zmienną środowiskową (bez wstrzyknięcia do powłoki) */
    expect(y).toMatch(/case "\$TRYB" in dry-run\|apply\)/); expect(y).not.toMatch(/\bDELETE\b/);
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

/* audyt 08.10.2026 (N2): polityka prywatności (site/privacy.html, GitHub Pages) zgodna z kodem — zmiana działania aplikacji wymaga zmiany strony */
describe('polityka prywatności zgodna z kodem', () => {
  const fs = require('fs') as typeof import('fs'); const root = join(__dirname, '..');
  const files = (d: string): string[] => fs.readdirSync(join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(d, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [join(d, e.name)] : []);
  test('strona PL/EN istnieje, Pages bez Jekylla; aplikacja nie wykonuje żadnych wywołań sieciowych; HealthKit: zapis, a od 0.16.0 odczyt tylko do wyświetlenia', () => {
    const html = readFileSync(join(root, 'site/privacy.html'), 'utf8');
    expect(html).toMatch(/<section lang="pl">/); expect(html).toMatch(/<section lang="en">/); expect(fs.existsSync(join(root, 'docs/.nojekyll'))).toBe(false); /* Pages z Actions (12.10.2026): artefakt z site/, Jekyll nie działa */
    expect(html).toContain('nie łączy się z internetem'); expect(html).toContain('does not connect to the internet');
    const net = ['lib', 'app', 'components'].flatMap(files).filter(f => /\bfetch\(|XMLHttpRequest|WebSocket|axios|EventSource/.test(readFileSync(join(root, f), 'utf8')));
    expect(net).toEqual([]);
    const hk = readFileSync(join(root, 'lib/health.ts'), 'utf8');
    expect(hk).toMatch(/requestAuthorization\(\{ toRead: \[\], toShare: \[/); /* zapis: bez odczytu (kontrakt 16.x) */
    expect(hk).toMatch(/requestAuthorization\(\{ toRead: HEALTH_READ_TYPES, toShare: \[\] \}\)/); /* 0.16.0: odczyt osobną zgodą, bez zapisu; strona opisuje odczyt (tests/health-permissions.test.ts) */
  });
  /* fala 2 audytu 0.10: masa ciała z datą (State.bodyMassLog), Zdrowie — siłowe i cardio z ponowieniem, CSV bez masy ciała, pliki udostępniania usuwane */
  test('strona mówi to, co robi kod: pomiary masy ciała z datą (kopia tak, CSV nie), Zdrowie — siłowe i cardio z ponowieniem, sprzątanie plików udostępniania', () => {
    const html = readFileSync(join(root, 'site/privacy.html'), 'utf8'); const seed = readFileSync(join(root, 'lib/seed.ts'), 'utf8'); const backup = readFileSync(join(root, 'lib/backup.ts'), 'utf8'); const health = readFileSync(join(root, 'lib/health.ts'), 'utf8');
    expect(seed).toMatch(/bodyMassLog\?: BodyMassEntry\[\]/); expect(html).toContain('pomiary masy ciała z datą pomiaru'); expect(html).toContain('body-mass measurements with their dates');
    expect(html).toContain('Kopia zapasowa obejmuje wszystkie dane'); expect(html).toContain('eksport CSV zawiera tylko serie treningów (bez masy ciała)'); expect(html).toContain('a CSV\nexport contains only workout sets (no body mass)');
    expect(backup).toMatch(/state: getState\(\)/); /* kopia = cały stan (z pomiarami) */ expect(backup).toContain("'Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE'"); /* CSV bez kolumny masy ciała */
    expect(html).toContain('siłowe i cardio'); expect(html).toContain('strength and cardio'); expect(health).toMatch(/HK_ACTIVITY\.running/); expect(health).toMatch(/export function retryHealth/);
    expect(html).toContain('ponownie przy kolejnym uruchomieniu'); expect(html).toContain('saved again the next time the app starts');
    expect(html).toContain('usuwa ze swojej pamięci podręcznej'); expect(backup).toMatch(/finally \{ await FileSystem\.deleteAsync\(path/);
  });
});

/* F2 (audyt przed App Store, 12.10.2026, wariant A): strona publikowana z osobnego katalogu site/ przez Pages z GitHub Actions — nie z docs/ */
describe('publikacja strony: site/ + pages.yml', () => {
  const fs = require('fs') as typeof import('fs'); const root = join(__dirname, '..');
  const SITE = ['index.html', 'privacy.html', 'support.html'];
  test('site/ zawiera dokładnie trzy strony (bez .md, JSON, CSV, obrazów); docs/ nie ma stron HTML ani .nojekyll', () => {
    expect(fs.readdirSync(join(root, 'site')).sort()).toEqual([...SITE].sort());
    expect(fs.readdirSync(join(root, 'docs')).filter(f => /\.html$|^\.nojekyll$/.test(f))).toEqual([]);
  });
  test('pages.yml: wypchnięcie na main tylko ze zmianą site/** (i samego workflow), ręcznie; uprawnienia minimalne; bez sekretów', () => {
    const y = wf('pages.yml');
    expect(y).toMatch(/on:\n\s+push:\n\s+branches: \[main\]\n\s+paths:\n\s+- 'site\/\*\*'\n\s+- '\.github\/workflows\/pages\.yml'\n\s+workflow_dispatch:/);
    expect(y).not.toMatch(/pull_request|schedule:|^\s+push:\n\s+branches: \[(?!main\])/m);
    expect(y).toMatch(/permissions:\n\s+contents: read\n\s+pages: write\n\s+id-token: write\n/);
    expect(y).not.toMatch(/contents: write|secrets\.|packages: write|actions: write/);
    expect([...y.matchAll(/^\s+(\w[\w-]*): (read|write)$/gm)].map(m => m[1]).sort()).toEqual(['contents', 'id-token', 'pages']);
  });
  test('pages.yml: artefakt tylko z site/, wdrożenie przez deploy-pages w środowisku github-pages, akcje z oficjalnej organizacji actions/ z numerem wersji', () => {
    const y = wf('pages.yml');
    expect(y).toMatch(/uses: actions\/upload-pages-artifact@v\d+\n\s+with:\n\s+path: site\n/);
    expect(y).toMatch(/uses: actions\/deploy-pages@v\d+/); expect(y).toMatch(/environment:\n\s+name: github-pages/);
    expect(y).toMatch(/concurrency:\n\s+group: pages\n\s+cancel-in-progress: false/);
    const uses = [...y.matchAll(/uses: (\S+)/g)].map(m => m[1]);
    expect(uses.length).toBeGreaterThanOrEqual(3);
    for (const u of uses) expect(u).toMatch(/^actions\/[\w-]+@v\d+$/);
    expect(y).not.toMatch(/run: .*(curl|wget|npm|npx)/);
  });
  test('docs/15 opisuje źródło „GitHub Actions” i adresy stron; nie każe już włączać „Deploy from a branch /docs”', () => {
    const d = readFileSync(join(root, 'docs/15-app-store.md'), 'utf8');
    expect(d).toContain('Settings → Pages → Source: GitHub Actions');
    for (const p of ['privacy.html', 'support.html']) expect(d).toContain(`https://lkarwowski494.github.io/trening/${p}`);
    expect(d).not.toMatch(/Deploy from a branch\*?\*? → `main` \/ `\/docs`/);
  });
});

/* strona www (11.10.2026): site/index.html i site/support.html — PL/EN, linki do polityki, bez e-maili i zasobów zewnętrznych, liczby zgodne z kodem */
describe('strona www aplikacji (GitHub Pages)', () => {
  const fs = require('fs') as typeof import('fs'); const root = join(__dirname, '..');
  const { LANGS } = require('../lib/i18n') as typeof import('../lib/i18n');
  test.each(['index.html', 'support.html'])('%s: istnieje, PL i EN, link do polityki prywatności, bez e-maili i zewnętrznych skryptów/fontów/trackerów', (name) => {
    expect(fs.existsSync(join(root, 'site', name))).toBe(true); expect(fs.existsSync(join(root, 'docs', name))).toBe(false);
    const html = readFileSync(join(root, 'site', name), 'utf8');
    expect(html).toMatch(/<section lang="pl"/); expect(html).toMatch(/<section lang="en"/); expect(html).toContain('href="privacy.html"');
    expect([...html.matchAll(EMAIL_RE)].map(m => m[0]).filter(a => !ALLOWED_EMAILS.includes(a))).toEqual([]); expect([...html.matchAll(/mailto:([^"?]+)/g)].map(m => m[1]).filter(a => a !== 'support@apps4brew.com')).toEqual([]); /* wsparcie 13.10.2026: tylko adres wsparcia */
    expect(html).not.toMatch(/<script/i); expect(html).not.toMatch(/<link\b[^>]*stylesheet/i); expect(html).not.toMatch(/<(img|iframe)\b/i); expect(html).not.toMatch(/@import|url\(/);
    expect([...html.matchAll(/(?:src|href)="(https?:[^"]+)"/g)].map(m => m[1]).filter(u => !u.startsWith('https://github.com/lkarwowski494/trening/issues'))).toEqual([]);
    expect(fs.existsSync(join(root, 'site/CNAME'))).toBe(false); expect(fs.existsSync(join(root, 'docs/CNAME'))).toBe(false); /* domena apps4brew.com dopiero po zakupie */
  });
  test('index.html linkuje do wsparcia; liczba języków na obu stronach = LANGS z kodu; kontakt przez GitHub Issues', () => {
    const idx = readFileSync(join(root, 'site/index.html'), 'utf8'); const sup = readFileSync(join(root, 'site/support.html'), 'utf8');
    expect(idx).toContain('href="support.html"'); expect(idx).toContain('Apps4Brew');
    for (const h of [idx, sup]) expect(h).toContain(`${LANGS.length} języków`);
    expect(idx).toContain(`${LANGS.length} languages`); expect(sup).toContain(`${LANGS.length} languages`);
    expect(sup).toContain('https://github.com/lkarwowski494/trening/issues'); expect(sup).not.toContain('DO UZUPEŁNIENIA');
  });
  /* proces wsparcia (docs/34, decyzje właściciela 13.10.2026) */
  test('wsparcie PL/EN: adres support@, czas odpowiedzi „w ciągu tygodnia”, co dołączyć (wersja z O aplikacji, bez kopii z danymi), ostrzeżenie o publicznych zgłoszeniach, zdanie o AI z linkiem do polityki', () => {
    const sup = readFileSync(join(root, 'site/support.html'), 'utf8'); const pl = sup.slice(sup.indexOf('<section lang="pl"'), sup.indexOf('<section lang="en"')); const en = sup.slice(sup.indexOf('<section lang="en"'));
    for (const w of ['href="mailto:support@apps4brew.com"', 'zwykle w ciągu tygodnia', 'Więcej → O aplikacji', 'Nie dołączaj kopii zapasowej z danymi, chyba że o to poprosimy', 'zgłoszenia tam są publiczne', 'AI pomaga nam porządkować opinie', 'href="privacy.html"']) expect(pl).toContain(w);
    for (const w of ['href="mailto:support@apps4brew.com"', 'usually reply within a week', 'More → About', 'do not attach a backup containing your data unless we ask for it', 'reports there are public', 'AI helps us sort feedback', 'href="privacy.html"']) expect(en).toContain(w);
    /* kolejność: najpierw e-mail, GitHub jako opcja */ expect(pl.indexOf('support@apps4brew.com')).toBeLessThan(pl.indexOf('github.com/lkarwowski494'));
  });
  test('polityka: sekcja „Gdy do nas piszesz” / „When you write to us” — administrator, dane, cel, podstawa art. 6 ust. 1 lit. f, 12 miesięcy, odbiorcy, prawa, PUODO, aplikacja nic nie wysyła; znacznik weryfikacji tylko w komentarzu; nowa data', () => {
    const h = readFileSync(join(root, 'site/privacy.html'), 'utf8'); const body = h.replace(/<!--[\s\S]*?-->/g, '');
    expect(h).toMatch(/<!-- \[DO WERYFIKACJI: badacz RODO\/DPA\]/); expect(body).not.toContain('DO WERYFIKACJI');
    const pl = body.slice(body.indexOf('<h2>Gdy do nas piszesz</h2>'), body.indexOf('<h2>Zmiany i kontakt</h2>')); const en = body.slice(body.indexOf('<h2>When you write to us</h2>'), body.indexOf('<h2>Changes and contact</h2>'));
    for (const w of ['Łukasz Karwowski, osoba fizyczna', 'support@apps4brew.com', 'adres e-mail, treść wiadomości, załączniki', 'wersja aplikacji i iOS', 'art. 6 ust. 1 lit. f RODO', '12 miesięcy od zamknięcia sprawy', 'Porkbun', 'Google (Gmail, Dysk)', 'dostawca narzędzi AI', 'dostęp do danych, sprostowanie, usunięcie, sprzeciw', 'PUODO', 'Aplikacja nadal niczego nie wysyła — e-mail wysyłasz Ty, swoją pocztą']) expect(pl).toContain(w);
    for (const w of ['Łukasz Karwowski, a natural person', 'support@apps4brew.com', 'email address, the message text, attachments', 'app and iOS versions', 'Article 6(1)(f) GDPR', '12 months after the case is closed', 'Porkbun', 'Google (Gmail, Drive)', 'provider of the AI tools', 'access, rectification, erasure, objection', 'PUODO', 'The app still sends nothing — you send the email, from your own mail app']) expect(en).toContain(w);
    expect(h).toContain('Obowiązuje od 13 października 2026 r.'); expect(h).toContain('Effective 13 October 2026'); expect(h).not.toContain('12 października 2026');
  });

  test('FAQ wsparcia zgodne z kodem: ścieżki menu i nazwy przycisków istnieją w tekstach aplikacji', () => {
    const sup = readFileSync(join(root, 'site/support.html'), 'utf8'); const en = readFileSync(join(root, 'lib/i18n.en.ts'), 'utf8');
    for (const pl of ['Eksportuj backup (plik JSON)', 'Eksportuj historię do CSV', 'Wyczyść wszystkie dane', 'Kopia zapasowa (eksport / import)', 'Język', 'Jak w telefonie']) {
      expect(en).toContain(`'${pl}': '`); const val = new RegExp(`'${pl.replace(/[()/]/g, '\\$&')}': '([^']+)'`).exec(en)![1]; expect(sup).toContain(val);
    }
    for (const pl of ['Eksportuj backup (plik JSON)', 'Eksportuj historię do CSV', 'Wyczyść wszystkie dane']) expect(sup).toContain(pl);
    expect(readFileSync(join(root, 'lib/backup.ts'), 'utf8')).toContain("AUTO_DIR = 'Backup/'");
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

describe('TST2-09 (audyt kontrolny 1): testflight.yml sprawdza to samo co verify', () => {
  test('krok testów uruchamia `npm run verify` (jedno źródło listy sprawdzeń) z limitem sterty 3 GB; verify obejmuje wszystkie sprawdzenia', () => {
    const y = wf('testflight.yml'); const step = y.slice(y.indexOf('- name: Testy'), y.indexOf('- name:', y.indexOf('- name: Testy') + 5));
    expect(step).toMatch(/NODE_OPTIONS: --max-old-space-size=3072/);
    expect(step).toMatch(/run: npm run verify\s*$/m);
    const v = require('../package.json').scripts.verify as string;
    for (const c of ['npm run typecheck', 'npm run check:i18n', 'npm run check:cues', 'npm run check:figures', 'jest', 'npm run check:matrix', 'npm run check:licenses', 'expo export --platform ios', 'npm run verify:native']) expect({ c, in: v.includes(c) }).toEqual({ c, in: true });
    expect(wf('tests.yml')).toMatch(/run: npm run verify\s*$/m);
  });
});

describe('SEC2-08 (audyt kontrolny 1): dokumenty bez identyfikatorów sesji i lokalnych ścieżek agentów', () => {
  const root = join(__dirname, '..');
  const docs = (d: string): string[] => require('fs').readdirSync(join(root, d), { withFileTypes: true }).flatMap((e: { name: string; isDirectory: () => boolean }) => e.isDirectory() ? docs(join(d, e.name)) : /\.(md|html|txt)$/.test(e.name) ? [join(d, e.name)] : []);
  test('docs/, README i CLAUDE.md: bez UUID poza adresami URL, bez ścieżek /tmp/claude-… i .claude/worktrees/agent-…', () => {
    const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i; const bad: string[] = [];
    for (const f of [...docs('docs'), 'README.md', 'CLAUDE.md']) readFileSync(join(root, f), 'utf8').split('\n').forEach((l, i) => {
      const noUrls = l.replace(/https?:\/\/\S+/g, '');
      if (UUID.test(noUrls) || /\/tmp\/claude-\d+\//.test(l) || /\.claude\/worktrees\/agent-[0-9a-f]+/.test(l)) bad.push(`${f}:${i + 1}`);
    });
    expect(bad).toEqual([]);
  });
});

/* adresy e-mail w repozytorium (13.10.2026): w docs/, site/, lib/, app/ tylko z listy dozwolonych; skan plików, nie historii. Wyjątek: lib/licenses.generated.ts (autorzy pakietów z licencji, generowany) */
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
const ALLOWED_EMAILS = ['support@apps4brew.com', 'hello@apps4brew.com'];
describe('adresy e-mail w repozytorium', () => {
  const fs = require('fs') as typeof import('fs'); const root = join(__dirname, '..');
  const walk = (d: string): string[] => fs.readdirSync(join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? (e.name === 'node_modules' ? [] : walk(join(d, e.name))) : [join(d, e.name)]);
  const EXEMPT = ['lib/licenses.generated.ts'];
  const scanned = ['docs', 'site', 'lib', 'app'].flatMap(walk).filter(f => /\.(md|html|json|ts|tsx|mjs|js|txt|csv)$/.test(f) && !EXEMPT.includes(f));
  test('żaden plik w docs/, site/, lib/, app/ nie zawiera adresu e-mail spoza listy dozwolonych', () => {
    expect(scanned.length).toBeGreaterThan(100);
    const bad = scanned.flatMap(f => [...readFileSync(join(root, f), 'utf8').matchAll(EMAIL_RE)].map(m => `${f}: ${m[0]}`).filter(x => !ALLOWED_EMAILS.includes(x.split(': ')[1])));
    expect(bad).toEqual([]);
  });
  test('reguła wykrywa adres prywatny i przepuszcza dozwolone (sprawdzenie samej reguły)', () => {
    expect('a jan.kowalski@gmail.com b'.match(EMAIL_RE)).toEqual(['jan.kowalski@gmail.com']); expect('support@apps4brew.com hello@apps4brew.com'.match(EMAIL_RE)!.every(a => ALLOWED_EMAILS.includes(a))).toBe(true);
    expect('@babel/core i git@github.com'.match(EMAIL_RE)).toEqual(['git@github.com']);
  });
  test('wyjątek licenses.generated.ts istnieje i jest plikiem generowanym', () => { expect(fs.readFileSync(join(root, EXEMPT[0]), 'utf8')).toMatch(/Wygenerowane/); });
});
