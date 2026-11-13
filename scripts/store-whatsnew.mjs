#!/usr/bin/env node
// Pole „What's New in this Version” (whatsNew) metadanych sklepu generowane z wpisu „Co nowego” aplikacji (W-22, 11.11.2026, docs/49; wzór: gen.mjs --check).
// Źródło: najnowszy wpis WHATS_NEW (lib/whatsnew-wpisy.ts) i słowniki aplikacji (t(), lib/locales, lib/i18n.en.ts) — tekst w sklepie jest dokładnie tym,
// co użytkownik zobaczy po aktualizacji pod „i” na ekranie Trening; nie przepisujemy go ręcznie do store/app-store-metadata.json.
// Zapis do App Store Connect tylko przez asc-metadane.yml za zgodą właściciela (środowisko release) — ten skrypt zmienia wyłącznie plik w repo.
// Użycie: node scripts/store-whatsnew.mjs --write | --check
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { appRequire, repoRoot } from './strona/ts-loader.mjs';
import { jestGlowny } from './modul-glowny.mjs';

export const PLIK = 'store/app-store-metadata.json';
/** Lokalizacja sklepu → język aplikacji (lib/i18n LANGS). Lokalizacja bez wpisu = błąd generatora (nowy język sklepu wymaga decyzji, nie zgadujemy). */
export const JEZYK_APLIKACJI = {
  pl: 'pl', 'en-US': 'en', 'en-GB': 'en', 'en-AU': 'en', 'en-CA': 'en', cs: 'cs', sk: 'sk', hu: 'hu', ro: 'ro', hr: 'hr', sl: 'sl', uk: 'uk',
  'es-ES': 'es', 'es-MX': 'es-419', 'pt-PT': 'pt', 'pt-BR': 'pt-BR', 'de-DE': 'de', 'fr-FR': 'fr', it: 'it', 'nl-NL': 'nl', sv: 'sv', da: 'da',
  no: 'nb', fi: 'fi', tr: 'tr', el: 'el', id: 'id', ms: 'ms', vi: 'vi', ru: 'ru', ja: 'ja', ko: 'ko', 'zh-Hant': 'zh-Hant',
};
/** Punkt listy w polu tekstowym sklepu (zwykły tekst, bez formatowania): jeden punkt w wierszu. */
export const PUNKT = '• ';

/** Tekst whatsNew dla języka aplikacji: punkty najnowszego wpisu „Co nowego”; null, gdy historia jest pusta (pole znika z metadanych). */
export function tekstDla(lang, rq = appRequire()) {
  const i18n = rq('lib/i18n.ts'), { WHATS_NEW } = rq('lib/whatsnew-wpisy.ts');
  if (!WHATS_NEW.length) return null;
  i18n.applyLang(lang);
  try { return WHATS_NEW[0].items().map(x => PUNKT + x).join('\n'); } finally { i18n.applyLang('pl'); }
}

/** Metadane z polem whatsNew w każdej lokalizacji (kolejność pól zachowana; whatsNew na końcu). */
export function zbuduj(meta, rq = appRequire()) {
  const brak = Object.keys(meta.lokalizacje).filter(l => !Object.prototype.hasOwnProperty.call(JEZYK_APLIKACJI, l));
  if (brak.length) throw new Error(`lokalizacje sklepu bez języka aplikacji: ${brak.join(', ')} — dopisz do JEZYK_APLIKACJI w scripts/store-whatsnew.mjs`);
  const lokalizacje = {};
  for (const [loc, m] of Object.entries(meta.lokalizacje)) {
    const { whatsNew: _stare, ...reszta } = m; const t = tekstDla(JEZYK_APLIKACJI[loc], rq);
    lokalizacje[loc] = t === null ? reszta : { ...reszta, whatsNew: t };
  }
  return { ...meta, lokalizacje };
}

export const serializuj = meta => JSON.stringify(meta, null, 2) + '\n';

if (jestGlowny(import.meta.url)) {
  const tryb = process.argv[2];
  if (tryb !== '--write' && tryb !== '--check') { console.error('użycie: node scripts/store-whatsnew.mjs --write | --check'); process.exit(2); }
  const p = join(repoRoot, PLIK), teraz = readFileSync(p, 'utf8'), nowe = serializuj(zbuduj(JSON.parse(teraz)));
  if (tryb === '--write') { if (nowe !== teraz) writeFileSync(p, nowe); console.log(`store-whatsnew: ${nowe === teraz ? 'bez zmian' : 'zapisano'} ${PLIK}`); }
  else if (nowe !== teraz) { console.error(`store-whatsnew: ${PLIK} nieaktualny (whatsNew ≠ wpis „Co nowego” aplikacji) — node scripts/store-whatsnew.mjs --write, potem git add store.`); process.exit(1); }
  else console.log(`store-whatsnew: ${PLIK} aktualny (${Object.keys(JSON.parse(teraz).lokalizacje).length} lokalizacji)`);
}
