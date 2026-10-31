/* Bramka adresów wydania (audyt 1.0, B-01): scripts/check-urls.mjs — logika porównania treści strony na żywo z site/ (bez sieci) i lista adresów. */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { PRIVACY_URL, SUPPORT_URL, ESPRESSO_URL, TERMS_URL } from '@/lib/products';

const ROOT = path.join(__dirname, '..');
const run = (code: string): any => JSON.parse(execFileSync('node', ['--input-type=module', '-e',
  `import * as m from ${JSON.stringify(path.join(ROOT, 'scripts/check-urls.mjs'))}; const out = await (async () => { ${code} })(); console.log(JSON.stringify(out));`], { encoding: 'utf8' }));
const site = (n: string) => fs.readFileSync(path.join(ROOT, 'site', n), 'utf8');
const SHELL = (sections: string) => `<html><body><nav>Menu</nav>${sections}<footer>stopka</footer></body></html>`;

describe('check-urls: adresy', () => {
  test('lista = adresy z lib/products.ts i store/app-store-urls.json (prywatność, wsparcie, espresso, EULA, marketing)', () => {
    const urls = run('return m.adresy().map(a => a.url)') as string[];
    const json = JSON.parse(fs.readFileSync(path.join(ROOT, 'store/app-store-urls.json'), 'utf8'));
    expect(new Set(urls)).toEqual(new Set([PRIVACY_URL, SUPPORT_URL, ESPRESSO_URL, TERMS_URL, json.privacyPolicyUrl, json.supportUrl, json.marketingUrl]));
  });
  test('skrypt nie jest częścią verify (verify działa offline), a bramka wydania go opisuje', () => {
    expect(JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).scripts.verify).not.toContain('check-urls');
    expect(fs.readFileSync(path.join(ROOT, 'docs/48-zgloszenie-1-0.md'), 'utf8')).toContain('scripts/check-urls.mjs');
  });
});
describe('check-urls: porównanie treści', () => {
  test('strona na żywo z tą samą treścią (inna powłoka, bez h1 i bez zgłoszeń na GitHubie) jest zgodna — każda ze stron site/', () => {
    for (const n of ['privacy.html', 'support.html', 'espresso.html']) {
      const src = site(n);
      const sekcje = [...src.matchAll(/<section lang="(?:pl|en)"[\s\S]*?<\/section>/g)].map(x => x[0]
        .replace(/<h1[\s\S]*?<\/h1>/g, '').replace(/<p class="brand"[\s\S]*?<\/p>/g, '').replace(/<p>(?:Zgłoszenia techniczne|You can also report technical issues)[\s\S]*?<\/p>/g, '')).join('\n');
      expect(run(`return m.brakujace(${JSON.stringify(src)}, ${JSON.stringify(SHELL(sekcje))})`)).toEqual([]);
      expect(run(`return m.fragmenty(${JSON.stringify(src)}).length`)).toBeGreaterThan(3);
    }
  });
  test('stara treść na żywo (inny znacznik wersji / brakujący akapit) jest wykryta', () => {
    const src = site('privacy.html'); expect(run(`return m.wersje(${JSON.stringify(src)})`).length).toBeGreaterThan(0);
    const stara = src.replace(/(wersja aplikacji|app version) \d+\.\d+\.\d+/g, '$1 0.9.0'); /* 31.10.2026: niezależnie od bieżącej wersji (build 1.0.1) */
    expect(run(`return m.brakujace(${JSON.stringify(src)}, ${JSON.stringify(stara)}).length`)).toBeGreaterThan(0);
    expect(run(`return m.wersje(${JSON.stringify(stara)})`)).not.toEqual(run(`return m.wersje(${JSON.stringify(src)})`));
    expect(run(`return m.brakujace(${JSON.stringify(src)}, ${JSON.stringify(SHELL('<section lang="pl"><p>Zupełnie inna strona</p></section>'))}).length`)).toBeGreaterThan(0);
  });
  test('strona 404 (pusta treść) nie jest zgodna', () => {
    expect(run(`return m.brakujace(${JSON.stringify(site('espresso.html'))}, '<html><body>404 Not Found</body></html>').length`)).toBeGreaterThan(0);
  });
});

describe('eksport do repozytorium strony marki (scripts/site/eksport-apps4brew.mjs)', () => {
  const os = require('os');
  const mk = () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'a4b-')); fs.mkdirSync(path.join(dir, 'trening'));
    const shell = (n: string) => `<!doctype html><html><head><title data-pl="Trening — wsparcie — Apps4Brew" data-en="Training — Support — Apps4Brew">Trening — wsparcie — Apps4Brew</title>
<meta property="og:title" content="Trening — wsparcie — Apps4Brew"><link rel="canonical" href="https://apps4brew.com/trening/${n}.html"></head><body>
<!-- WYGENEROWANE z support.html -->
<h1 data-pl="x" data-en="y">x</h1>
<section lang="pl" data-lang-section="pl"><p>stary</p></section><section lang="en" data-lang-section="en"><p>old</p></section>
<footer><a href="../trening/support.html">Wsparcie</a></footer></body></html>`;
    for (const n of ['privacy', 'support']) fs.writeFileSync(path.join(dir, 'trening', n + '.html'), shell(n));
    return dir;
  };
  test('wstawia sekcje ze site/ do powłoki; espresso z powłoki wsparcia; link Wsparcie w stopce zostaje; ponowny eksport nic nie zmienia', () => {
    const dir = mk();
    try {
      const go = () => execFileSync('node', [path.join(ROOT, 'scripts/site/eksport-apps4brew.mjs'), dir], { encoding: 'utf8' });
      go();
      const out = (n: string) => fs.readFileSync(path.join(dir, 'trening', n + '.html'), 'utf8');
      for (const n of ['privacy', 'support', 'espresso']) {
        expect(out(n)).not.toContain('stary');
        expect(out(n)).toContain('data-lang-section="pl"');
        expect(run(`return m.brakujace(${JSON.stringify(site(n + '.html'))}, ${JSON.stringify(out(n))})`)).toEqual([]);
        expect(out(n)).toContain('<a href="../trening/support.html">Wsparcie</a>');
      }
      expect(out('espresso')).toContain('apps4brew.com/trening/espresso.html'); expect(out('espresso')).not.toContain('apps4brew.com/trening/support.html');
      const before = ['privacy', 'support', 'espresso'].map(out); go();
      expect(['privacy', 'support', 'espresso'].map(out)).toEqual(before);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
});
describe('workflow check-urls.yml', () => {
  const y = fs.readFileSync(path.join(ROOT, '.github/workflows/check-urls.yml'), 'utf8');
  test('tylko ręcznie (workflow_dispatch), odczyt repozytorium, bez sekretów, uruchamia scripts/check-urls.mjs', () => {
    expect(y).toMatch(/on:\s*\n\s*workflow_dispatch:/); expect(y).not.toMatch(/\n\s+(push|pull_request|schedule):/);
    expect(y).toMatch(/permissions:\s*\n\s*contents: read/); expect(y).not.toMatch(/secrets\./);
    expect(y).toContain('node scripts/check-urls.mjs');
  });
});
