// Blokada wydania: wyjątek strażnika anonimizacji (stare tłumaczenia z nazwami źródeł pod nowym kluczem, tests/zrodla-wiedzy.test.ts, scripts/check-bundle.mjs)
// musi być PUSTY przed wydaniem (decyzja właściciela 25.10.2026, docs/18; rejestr ryzyk docs/40, R-015). Wyjątek = wpisy rodzaju „zmieniony” w zestawie przekładu
// (docs/lokalizacja/zestaw-przekladu-*.json); znikają razem z przekładem na 33 języki (scripts/i18n/przeklad-api.mjs) — wtedy ta kontrola przechodzi sama.
// Użycie: node scripts/ci/blokada-wydania.mjs   (npm run check:release; kod 1 = wyjątek niepusty → wydania nie robić). NIE jest częścią `npm run verify` (zwykła praca
// ma prawo mieć wyjątek i otwarte ryzyka); uruchamia ją krok wydania: lista zgłoszenia (docs/48, przed wyborem buildu) i lista wydawcy (.claude/agents/wydawca.md);
// testflight.yml jej nie wywołuje (decyzja właściciela 27.10.2026, M1-audytor-generalny-012). Sprawdza też rejestr ryzyk (blockingRisks).
import { fileURLToPath } from 'node:url';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadPatterns, nameRegex } from '../check-bundle.mjs';

const here = fileURLToPath(new URL('../..', import.meta.url));

/** Otwarte wyjątki: klucze „zmieniony” z zestawów przekładu i liczba słowników językowych, które trzymają pod nimi stare tłumaczenie. */
export function openExceptions(root = here) {
  const dir = join(root, 'docs/lokalizacja'), ldir = join(root, 'lib/locales');
  const keys = [];
  if (existsSync(dir)) for (const f of readdirSync(dir).filter(f => /^zestaw-przekladu-.*\.json$/.test(f))) {
    for (const k of JSON.parse(readFileSync(join(dir, f), 'utf8')).klucze ?? []) if (k.rodzaj === 'zmieniony') keys.push(k.pl);
  }
  const dicts = existsSync(ldir) ? readdirSync(ldir).filter(f => f.endsWith('.json') && !f.startsWith('_')).map(f => JSON.parse(readFileSync(join(ldir, f), 'utf8'))) : [];
  const translations = keys.reduce((n, k) => n + dicts.filter(d => typeof d[k] === 'string').length, 0);
  const re = nameRegex(loadPatterns()); /* z nich z nazwami źródeł (to one łamią zasadę „całkiem anonimowo”; reszta czeka tylko na przekład) */
  const withNames = keys.filter(k => dicts.some(d => typeof d[k] === 'string' && (re.lastIndex = 0, re.test(d[k]))));
  const namedTranslations = keys.reduce((n, k) => n + dicts.filter(d => typeof d[k] === 'string' && (re.lastIndex = 0, re.test(d[k]))).length, 0);
  return { keys, translations, languages: dicts.length, withNames, namedTranslations };
}

/** M1-audytor-generalny-012: rejestr ryzyk (docs/40, sekcja „Rejestr ryzyk”) jako bramka — wiersze „otwarte” albo „częściowo” blokują wydanie, chyba że stan
 * zawiera odroczenie decyzją właściciela z datą („odroczone decyzją właściciela DD.MM.RRRR”) albo „sprawdzenie po wydaniu” (warunek do sprawdzenia dopiero
 * w wersji z App Store, np. R-WAL). Zamknięte i zaakceptowane nie blokują. */
export function blockingRisks(md) {
  const sec = md.split(/^## /m).find(s => s.startsWith('Rejestr ryzyk')) ?? '';
  return sec.split('\n').filter(l => /^\| R-[\w-]+ \|/.test(l)).map(l => { const c = l.split(' | '); return { id: c[0].replace('| ', '').trim(), state: c.at(-1).replace(/\|\s*$/, '').trim() }; })
    .filter(r => /otwarte|częściowo/i.test(r.state) && !/odroczone decyzją właściciela \d{2}\.\d{2}\.\d{4}|sprawdzenie po wydaniu/i.test(r.state));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const risks = blockingRisks(readFileSync(join(here, 'docs/40-lekcje.md'), 'utf8'));
  if (risks.length) {
    console.error(`WYDANIE ZABLOKOWANE (rejestr ryzyk docs/40): ${risks.length} otwartych bez odroczenia decyzją właściciela — ${risks.map(r => r.id).join(', ')}`);
    console.error('Warunek: każde ryzyko zamknięte z dowodem, zaakceptowane, odroczone decyzją właściciela z datą albo oznaczone „sprawdzenie po wydaniu” (M1-audytor-generalny-012).');
    process.exitCode = 1;
  }
  const r = openExceptions();
  if (r.keys.length) {
    console.error(`WYDANIE ZABLOKOWANE (R-015, docs/40): wyjątek strażnika anonimizacji niepusty — ${r.keys.length} kluczy „zmieniony” w zestawie przekładu (${r.translations} starych tłumaczeń w ${r.languages} słownikach), w tym ${r.withNames.length} kluczy z nazwami źródeł (${r.namedTranslations} tłumaczeń).`);
    console.error('Warunek zamknięcia: przekład na 33 języki przez API (scripts/i18n/przeklad-api.mjs) usuwa wpisy z zestawu; potem ten test przechodzi.');
    process.exit(1);
  }
  if (!risks.length) console.log('rejestr ryzyk: brak otwartych blokujących wydanie');
  console.log('wyjątek anonimizacji pusty — wydanie nie jest blokowane przez R-015');
}
