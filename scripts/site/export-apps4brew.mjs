// Strony aplikacji Trening dla apps4brew.com/trening/ (decyzja właściciela 14.10.2026, D-2 A — docs/41).
// Źródłem treści zostają site/privacy.html i site/support.html w tym repo (testy zgodności z kodem: tests/public-repo.test.ts,
// tests/health-permissions.test.ts). Skrypt przenosi sekcje PL/EN do szablonu strony marki (assets/site.css, przełącznik PL/EN z assets/site.js):
// jeden <h1> na stronę (wymóg testów strony marki), sekcje językowe z atrybutem data-lang-section, link do GitHub Issues usunięty
// (zgłoszenia przez e-mail; repozytorium zmienia się przy przenosinach do organizacji). Bez zależności.
// Użycie: node scripts/site/export-apps4brew.mjs <katalog_repo_strony>   (zapisuje <katalog>/trening/privacy.html i support.html)
import fs from 'node:fs';
import path from 'node:path';

const PAGES = {
  'privacy.html': {
    title: { pl: 'Trening — polityka prywatności', en: 'Trening — Privacy Policy' },
    desc: 'Polityka prywatności aplikacji Trening (Apps4Brew): aplikacja nie zbiera danych, wszystko zostaje na iPhonie.',
  },
  'support.html': {
    title: { pl: 'Trening — wsparcie', en: 'Trening — Support' },
    desc: 'Wsparcie aplikacji Trening (Apps4Brew): kontakt e-mail i odpowiedzi na częste pytania.',
  },
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** Treść sekcji języka bez <h1> i bez akapitu o GitHub Issues; linki wewnętrzne dopasowane do apps4brew.com/trening/. */
export function sectionBody(html, lang) {
  const m = html.match(new RegExp(`<section lang="${lang}"[^>]*>([\\s\\S]*?)</section>`));
  if (!m) throw new Error(`brak sekcji ${lang}`);
  return m[1]
    .replace(/<h1>[\s\S]*?<\/h1>\n?/, '')
    .replace(/<p>[^<]*<a href="https:\/\/github\.com\/[^"]+">GitHub Issues<\/a>[\s\S]*?<\/p>\n?/, '')
    .replace(/href="index\.html"/g, 'href="../"')
    .trim();
}

export function page(src, name) {
  const p = PAGES[name]; if (!p) throw new Error(`nieznana strona ${name}`);
  const comments = [...src.matchAll(/<!--([\s\S]*?)-->/g)].map((c) => `<!--${c[1]}-->`).join('\n');
  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'">
<meta name="referrer" content="no-referrer">
<title data-pl="${esc(p.title.pl)} — Apps4Brew" data-en="${esc(p.title.en)} — Apps4Brew">${p.title.pl} — Apps4Brew</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/site.css">
</head>
<body>
<!-- WYGENEROWANE z repozytorium aplikacji Trening (site/${name}) skryptem scripts/site/export-apps4brew.mjs — nie edytować ręcznie; zmiana treści: w site/${name} i ponowny eksport. -->
<!-- [UWAGA 14.10.2026] Skrzynka support@apps4brew.com działa dopiero po weryfikacji DSA i założeniu Google Workspace (docs/41 E4 w repo aplikacji). -->
${comments}
<a class="skip" href="#main" data-pl="Przejdź do treści" data-en="Skip to content">Przejdź do treści</a>
<header class="hero doc-hero">
  <div class="wrap">
    <div class="bar">
      <a class="logo" href="../">Apps<b>4</b>Brew</a>
      <div class="lang" role="group" aria-label="Język / Language">
        <button type="button" id="lang-pl" aria-pressed="true" lang="pl" aria-label="Polski">PL</button>
        <button type="button" id="lang-en" aria-pressed="false" lang="en" aria-label="English">EN</button>
      </div>
    </div>
    <h1 data-pl="${esc(p.title.pl)}" data-en="${esc(p.title.en)}">${p.title.pl}</h1>
  </div>
</header>
<main class="wrap doc" id="main">
<section lang="pl" data-lang-section="pl">
${sectionBody(src, 'pl')}
</section>
<section lang="en" data-lang-section="en">
${sectionBody(src, 'en')}
</section>
</main>
<footer>
  <div class="wrap foot">
    <span>© 2026 Apps4Brew · Warszawa</span>
    <nav data-label-pl="Stopka" data-label-en="Footer" aria-label="Stopka">
      <a href="support.html" data-pl="Wsparcie" data-en="Support">Wsparcie</a>
      <a href="privacy.html" data-pl="Prywatność" data-en="Privacy">Prywatność</a>
      <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" data-pl="Warunki" data-en="Terms">Warunki</a>
      <a href="mailto:support@apps4brew.com">support@apps4brew.com</a>
    </nav>
  </div>
</footer>
<script src="../assets/site.js"></script>
</body>
</html>
`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = process.argv[2]; if (!out) { console.error('Użycie: node scripts/site/export-apps4brew.mjs <katalog_repo_strony>'); process.exit(2); }
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
  fs.mkdirSync(path.join(out, 'trening'), { recursive: true });
  for (const name of Object.keys(PAGES)) {
    fs.writeFileSync(path.join(out, 'trening', name), page(fs.readFileSync(path.join(root, 'site', name), 'utf8'), name));
    console.log(`trening/${name}`);
  }
}
