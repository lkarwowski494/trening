#!/usr/bin/env node
// Eksport stron Trening (site/privacy|support|espresso.html) do repozytorium strony marki lkarwowski494/apps4brew-www (apps4brew.com; Pages z main, CNAME).
// pages.yml publikuje site/ tylko pod github.io/trening/ — adres w aplikacji i w App Store Connect to apps4brew.com (rejestr ryzyk docs/40: kopie site/ rozjeżdżają się
// przy zmianie). Skrypt wstawia sekcje pl/en ze site/ do powłoki strony marki (trening/<strona>.html) w podanym katalogu repo; espresso powstaje z powłoki wsparcia.
// Po eksporcie: commit i push w apps4brew-www (publikacja w kilka minut), potem "node scripts/check-urls.mjs" (bramka wydania).
// Użycie: node scripts/site/eksport-apps4brew.mjs <katalog repozytorium apps4brew-www>
import fs from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { markaZKodu } from '../marka.mjs';
import { przemarkuj } from './marka-powloki.mjs';
const S = resolve(dirname(fileURLToPath(import.meta.url)), '../../site') + '/';
if (!process.argv[2]) { console.error('Podaj katalog repozytorium apps4brew-www.'); process.exit(2); }
const R = resolve(process.argv[2]) + '/';
const MARKA = markaZKodu(); /* lib/brand.ts — jedno źródło pisowni marki (W-18, 15.11.2026) */
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
const surowe = {}; /* powłoka po podmianie treści, przed przemarkowaniem — espresso szuka w niej starych brzmień tytułu i opisu */
for (const n of ['privacy', 'support']) {
  const f = R + `trening/${n}.html`;
  surowe[n] = swap(fs.readFileSync(f, 'utf8'), src(n));
  fs.writeFileSync(f, przemarkuj(surowe[n], MARKA));
}
// espresso: powłoka ze strony wsparcia (surowa, nie przemarkowana)
let e = surowe.support;
const T = { pl: `${MARKA} — indeks espresso — Apps4Brew`, en: `${MARKA} — Espresso index — Apps4Brew` };
const D = `Skąd ta cena? Indeks espresso: porównanie ceny aplikacji ${MARKA} ze średnią ceną espresso w barze.`;
/* Podmiany niezależne od nazwy w powłoce wsparcia (po pierwszej publikacji ma już nową markę; ponowny eksport musi dać to samo — tests/site-eksport-marka.test.ts). */
e = e.replace(/<title data-pl="[^"]*" data-en="[^"]*">[^<]*<\/title>/, `<title data-pl="${T.pl}" data-en="${T.en}">${T.pl}</title>`)
  .replace(/Wsparcie aplikacji [^"(<]+ \(Apps4Brew\): kontakt e-mail i odpowiedzi na częste pytania\./g, D)
  .replace(/content="[^"]*— wsparcie — Apps4Brew"/g, `content="${T.pl}"`)
  .replaceAll('apps4brew.com/trening/support.html"', 'apps4brew.com/trening/espresso.html"') /* tylko adres kanoniczny strony, nie link „Wsparcie” w stopce */
  .replace(/<h1 data-pl="[^"]*" data-en="[^"]*">[^<]*<\/h1>/, '<h1 data-pl="Skąd ta cena? Indeks espresso" data-en="Why this price? The espresso index">Skąd ta cena? Indeks espresso</h1>')
  .replace(/(<!-- WYGENEROWANE[^>]*support\.html[^>]*-->)/, '<!-- Treść z repozytorium aplikacji ' + MARKA + ' (site/espresso.html); bez cen aplikacji (ceny tylko w App Store). -->')
  .replace(/<!-- Szablon zmieniony[^>]*-->\n/, '').replace(/<!-- Kontakt jak w privacy[^>]*-->\n/, '');
e = swap(e, src('espresso'));
fs.writeFileSync(R + 'trening/espresso.html', przemarkuj(e, MARKA));
