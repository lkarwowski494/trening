// Rejestr twierdzeń dla tekstów dziedzinowych interfejsu (M1-audytor-generalny-048, DEC-16; CLAUDE.md „Merytoryczne podstawy”).
// Tekst dziedzinowy = tekst słownika (klucz polski w lib/i18n.en.ts), który powołuje się na źródło albo nazywa swoją wagę
// („uproszczenie”, „konwencja”, „jedno źródło”, zalecenia WHO/ACSM/wytycznych itd. — wzorzec DOMAIN_RE). Każdy taki tekst ma wpis w
// docs/research/rejestr-twierdzen.json: ID, kotwica (początek tekstu), skrót polskiego tekstu i angielskiego tłumaczenia z chwili przeglądu,
// rodzaj, cytowane źródła i dokument w repo z uzasadnieniem (dokument musi zawierać wskazaną frazę — wskaźnik nie może być zmyślony).
// verify (npm run check:claims) kończy się błędem, gdy: tekst dziedzinowy nie ma wpisu; wpis nie ma tekstu; skrót tekstu (PL albo EN) różni
// się od zapisanego w przeglądzie (zmieniono brzmienie bez ponownego przeglądu); dokument albo fraza nie istnieje.
// Użycie: node scripts/claims.mjs --check | --stub (wpisy do wklejenia dla tekstów bez ID) | --rehash <ID>… --przeglad "<data: kto>" (po przeglądzie).
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const root = fileURLToPath(new URL('..', import.meta.url));
const DICT = join(root, 'lib/i18n.en.ts');
const REG = join(root, 'docs/research/rejestr-twierdzen.json');

/** Wzorzec tekstu dziedzinowego (jedno miejsce). Minimalna długość odsiewa etykiety („Zalecenia”, „e1RM (Epley, per hantel)”). */
export const DOMAIN_RE = /ACSM|\bWHO\b|Zourdos|Pelland|Mayhew|Epley|Brzycki|wytyczn|stanowisk|metaanaliz|przegląd(?:y|u|ów)? badań|uproszczeni|konwencj|jedno źródło|nie ustalon|ankiet|zalecen|\bi in\. \d{4}/i;
export const MIN_LEN = 30;
export const KINDS = ['uproszczenie', 'konwencja', 'jedno źródło', 'źródło cytowane w tekście', 'przegląd badań', 'otwarte'];
export const hash = (s) => createHash('sha1').update(s, 'utf8').digest('hex').slice(0, 10);

export function loadDictionary() {
  const require = createRequire(import.meta.url);
  const ts = require('typescript');
  const out = ts.transpileModule(readFileSync(DICT, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 } }).outputText;
  const mod = { exports: {} }; vm.runInNewContext(out, { module: mod, exports: mod.exports });
  return mod.exports.EN;
}

export const domainTexts = (EN) => Object.keys(EN).filter((k) => k.length >= MIN_LEN && DOMAIN_RE.test(k));

/** Kontrola; `readDoc(ścieżka)` zwraca treść dokumentu albo null. Zwraca listę błędów (pustą, gdy rejestr zgodny). */
export function checkClaims(EN, registry, readDoc) {
  const errs = []; const entries = registry.twierdzenia ?? [];
  const ids = new Set(); const covered = new Set();
  for (const e of entries) {
    const w = `${e.id ?? '(bez id)'}`;
    if (!/^T-\d{3}$/.test(e.id ?? '')) errs.push(`${w}: id w formacie T-NNN`);
    if (ids.has(e.id)) errs.push(`${w}: id powtórzone`); ids.add(e.id);
    if (typeof e.kotwica !== 'string' || e.kotwica.length < 20) errs.push(`${w}: kotwica (początek polskiego tekstu, ≥ 20 znaków)`);
    if (!Array.isArray(e.rodzaje) || !e.rodzaje.length || e.rodzaje.some((k) => !KINDS.includes(k))) errs.push(`${w}: rodzaje spośród: ${KINDS.join(', ')}`);
    if (typeof e.przeglad !== 'string' || !e.przeglad) errs.push(`${w}: pole przeglad (data: kto, zakres)`);
    const hits = Object.keys(EN).filter((k) => typeof e.kotwica === 'string' && k.startsWith(e.kotwica));
    if (hits.length === 0) { errs.push(`${w}: tekst o kotwicy „${String(e.kotwica).slice(0, 40)}…” nie istnieje w słowniku (zmieniony bez przeglądu albo usunięty)`); continue; }
    if (hits.length > 1) { errs.push(`${w}: kotwica niejednoznaczna (${hits.length} teksty)`); continue; }
    const k = hits[0]; covered.add(k);
    if (hash(k) !== e.skrot) errs.push(`${w}: polski tekst zmieniony od przeglądu (skrót ${hash(k)} ≠ ${e.skrot}) — przejrzyj źródła i wykonaj --rehash ${e.id}`);
    if (hash(EN[k]) !== e.skrotEn) errs.push(`${w}: angielskie brzmienie zmienione od przeglądu (skrót ${hash(EN[k])} ≠ ${e.skrotEn}) — przejrzyj i wykonaj --rehash ${e.id}`);
    if (e.dokument) {
      const d = readDoc(e.dokument);
      if (d == null) errs.push(`${w}: dokument ${e.dokument} nie istnieje`);
      else if (!e.fraza || !d.includes(e.fraza)) errs.push(`${w}: dokument ${e.dokument} nie zawiera frazy „${e.fraza ?? ''}”`);
    } else if (!/\[OTWARTE/.test(e.uwaga ?? '')) errs.push(`${w}: bez dokumentu wymagana uwaga z „[OTWARTE …]”`);
  }
  for (const k of domainTexts(EN)) if (!covered.has(k)) errs.push(`tekst dziedzinowy bez ID w rejestrze: „${k.slice(0, 80)}…” (node scripts/claims.mjs --stub)`);
  return errs;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const EN = loadDictionary(); const registry = JSON.parse(readFileSync(REG, 'utf8'));
  const readDoc = (p) => (existsSync(join(root, p)) ? readFileSync(join(root, p), 'utf8') : null);
  const a = process.argv.slice(2);
  if (a.includes('--stub')) {
    const have = new Set((registry.twierdzenia ?? []).map((e) => e.kotwica)); let n = (registry.twierdzenia ?? []).length;
    const stubs = domainTexts(EN).filter((k) => ![...have].some((c) => k.startsWith(c))).map((k) => ({ id: `T-${String(++n).padStart(3, '0')}`, kotwica: k.slice(0, 48), skrot: hash(k), skrotEn: hash(EN[k]), rodzaje: ['otwarte'], zrodla: [], dokument: null, fraza: null, uwaga: '[OTWARTE — źródło do wskazania]', przeglad: '' }));
    console.log(JSON.stringify(stubs, null, 1)); process.exit(0);
  }
  const r = a.indexOf('--rehash');
  if (r >= 0) {
    const pi = a.indexOf('--przeglad'); const przeglad = pi >= 0 ? a[pi + 1] : '';
    const ids = a.slice(r + 1).filter((x) => /^T-\d{3}$/.test(x));
    if (!przeglad || !ids.length) { console.error('Użycie: --rehash T-001 [T-002…] --przeglad "<data: kto, co sprawdzono>"'); process.exit(1); }
    for (const e of registry.twierdzenia) if (ids.includes(e.id)) { const k = Object.keys(EN).find((x) => x.startsWith(e.kotwica)); if (!k) { console.error(`${e.id}: brak tekstu`); process.exit(1); } e.skrot = hash(k); e.skrotEn = hash(EN[k]); e.przeglad = przeglad; }
    writeFileSync(REG, JSON.stringify(registry, null, 1) + '\n'); console.log('zapisano', ids.join(', ')); process.exit(0);
  }
  const errs = checkClaims(EN, registry, readDoc);
  if (errs.length) { console.error('Rejestr twierdzeń (docs/research/rejestr-twierdzen.json):\n' + errs.map((e) => '  ' + e).join('\n')); process.exit(1); }
  console.log(`twierdzenia: ${registry.twierdzenia.length} wpisów, ${domainTexts(EN).length} tekstów dziedzinowych, rejestr zgodny`);
}
