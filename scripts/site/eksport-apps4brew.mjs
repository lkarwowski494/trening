#!/usr/bin/env node
// Eksport stron Trening (site/privacy|support|espresso.html) do repozytorium strony marki lkarwowski494/apps4brew-www (apps4brew.com; Pages z main, CNAME).
// pages.yml publikuje site/ tylko pod github.io/trening/ — adres w aplikacji i w App Store Connect to apps4brew.com (rejestr ryzyk docs/40: kopie site/ rozjeżdżają się
// przy zmianie). Skrypt wstawia sekcje pl/en ze site/ do powłoki strony marki (trening/<strona>.html) w podanym katalogu repo; espresso powstaje z powłoki wsparcia.
// Po eksporcie: commit i push w apps4brew-www (publikacja w kilka minut), potem "node scripts/check-urls.mjs" (bramka wydania).
// Użycie: node scripts/site/eksport-apps4brew.mjs <katalog repozytorium apps4brew-www>
import fs from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const S = resolve(dirname(fileURLToPath(import.meta.url)), '../../site') + '/';
if (!process.argv[2]) { console.error('Podaj katalog repozytorium apps4brew-www.'); process.exit(2); }
const R = resolve(process.argv[2]) + '/';
const src = (n) => fs.readFileSync(S + n + '.html', 'utf8');
const sec = (html, l) => {
  let s = html.match(new RegExp(`<section lang="${l}"(?: id="${l}")?>([\\s\\S]*?)</section>`))[1];
  s = s.replace(/\s*<h1>[^<]*<\/h1>/, '').replace(/\s*<p class="brand">[^<]*<\/p>/, '');
  // wsparcie: bez zgłoszeń na GitHubie (github.com poza dozwolonymi domenami strony marki, test site.test.mjs)
  s = s.replace(/<p>(Zgłoszenia techniczne|You can also report technical issues)[\s\S]*?<\/p>\n/, '');
  return `<section lang="${l}" data-lang-section="${l}">${s}</section>`;
};
function swap(shell, html) {
  return shell
    .replace(/<section lang="pl" data-lang-section="pl">[\s\S]*?<\/section>/, () => sec(html, 'pl'))
    .replace(/<section lang="en" data-lang-section="en">[\s\S]*?<\/section>/, () => sec(html, 'en'));
}
for (const n of ['privacy', 'support']) {
  const f = R + `trening/${n}.html`;
  fs.writeFileSync(f, swap(fs.readFileSync(f, 'utf8'), src(n)));
}
// espresso: powłoka ze strony wsparcia
let e = fs.readFileSync(R + 'trening/support.html', 'utf8');
const T = { pl: 'Trening — indeks espresso — Apps4Brew', en: 'Training — Espresso index — Apps4Brew' };
const D = 'Skąd ta cena? Indeks espresso: porównanie ceny aplikacji Trening ze średnią ceną espresso w barze.';
e = e.replace('<title data-pl="Trening — wsparcie — Apps4Brew" data-en="Training — Support — Apps4Brew">Trening — wsparcie — Apps4Brew</title>',
  `<title data-pl="${T.pl}" data-en="${T.en}">${T.pl}</title>`)
  .replaceAll('Wsparcie aplikacji Trening (Apps4Brew): kontakt e-mail i odpowiedzi na częste pytania.', D)
  .replaceAll('content="Trening — wsparcie — Apps4Brew"', `content="${T.pl}"`)
  .replaceAll('apps4brew.com/trening/support.html"', 'apps4brew.com/trening/espresso.html"') /* tylko adres kanoniczny strony, nie link „Wsparcie” w stopce */
  .replace(/<h1 data-pl="[^"]*" data-en="[^"]*">[^<]*<\/h1>/, '<h1 data-pl="Skąd ta cena? Indeks espresso" data-en="Why this price? The espresso index">Skąd ta cena? Indeks espresso</h1>')
  .replace(/(<!-- WYGENEROWANE[^>]*support\.html[^>]*-->)/, '<!-- Treść z repozytorium aplikacji Trening (site/espresso.html); bez cen aplikacji (ceny tylko w App Store). -->')
  .replace(/<!-- Szablon zmieniony[^>]*-->\n/, '').replace(/<!-- Kontakt jak w privacy[^>]*-->\n/, '');
e = swap(e, src('espresso'));
fs.writeFileSync(R + 'trening/espresso.html', e);
