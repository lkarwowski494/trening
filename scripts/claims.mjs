// Rejestr twierdzeń dla tekstów dziedzinowych interfejsu (M1-audytor-generalny-048, DEC-16; CLAUDE.md „Merytoryczne podstawy”).
// Tekst dziedzinowy = tekst słownika (klucz polski w lib/i18n.en.ts), który powołuje się na źródło albo nazywa swoją wagę
// („uproszczenie”, „konwencja”, „jedno źródło”, zalecenia WHO/ACSM/wytycznych itd. — wzorzec DOMAIN_RE). Każdy taki tekst ma wpis w
// docs/research/rejestr-twierdzen.json: ID, kotwica (początek tekstu), skrót polskiego tekstu i angielskiego tłumaczenia z chwili przeglądu,
// rodzaj, cytowane źródła i dokument w repo z uzasadnieniem (dokument musi zawierać wskazaną frazę — wskaźnik nie może być zmyślony).
// verify (npm run check:claims) kończy się błędem, gdy: tekst dziedzinowy nie ma wpisu; wpis nie ma tekstu; skrót tekstu (PL albo EN) różni
// się od zapisanego w przeglądzie (zmieniono brzmienie bez ponownego przeglądu); dokument albo fraza nie istnieje.
// Dodatkowo (23.10.2026): markerErrors — w tekstach UI nie ma oznaczeń pewności .
// Od 27.10.2026 (M1-audytor-generalny-021, 06-tresci-002, DEC-05 a): po decyzjach 23.10 (bez oznaczeń wagi) i 25.10 (bez nazw źródeł) DOMAIN_RE nie łapał
// żadnego tekstu, więc nowy tekst dziedzinowy przechodził bez wpisu. Tekst dziedzinowy rozpoznaje teraz także słownictwo dziedziny (DOMAIN_WORDS_RE)
// i jawna lista kluczy (DOMAIN_KEYS — krótkie teksty z liczbą dziedzinową, których wzorzec nie rozpozna). Kandydat bez twierdzenia (tekst interfejsu,
// rachunek na danych użytkownika, opis reguły produktu) ma w rejestrze wpis w „bezTwierdzenia” { kotwica, powod } — inaczej błąd, jak tekst bez wpisu.
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

/** Wzorzec tekstu dziedzinowego (jedno miejsce). Minimalna długość odsiewa etykiety („Zalecenia”, „e1RM (Epley, per hantel)”).
 * Od 1.0.1 (audyt 1.0, C-2) także LICZBY twierdzeń: stopnie („15–20°”), przedziały ułamków („1/3–1/2”) i procenty — po anonimizacji (25.10.2026) nazwy źródeł
 * zniknęły z tekstów, więc sama liczba bez wpisu przechodziła niezauważona. Parametry sprzętu (kg, lb) i formaty (tempo „3-1-1”) nie są twierdzeniami. */
export const DOMAIN_RE = /ACSM|\bWHO\b|Zourdos|Pelland|Mayhew|Epley|Brzycki|wytyczn|stanowisk|metaanaliz|przegląd(?:y|u|ów)? badań|uproszczeni|konwencj|jedno źródło|nie ustalon|ankiet|zalecen|nasz wybór|wstępn|\bi in\. \d{4}|\d\s?°|\d\/\d\s?[–-]\s?\d\/\d|\d\s?%/i;
export const MIN_LEN = 30;
/** Słownictwo dziedziny (klucz polski): zapas powtórzeń i skale wysiłku, % maksimum, uogólnienie „zwykle”, kąty w stopniach, siła i mięśnie, upadek,
 * regeneracja, cardio, zalecenia. Fałszywe trafienia (teksty interfejsu) trafiają do „bezTwierdzenia” z powodem. */
export const DOMAIN_WORDS_RE = /w zapasie|\bRIR\b|\bRPE\b|% maksimum|\bzwykle\b|°|chroni mięśni|mięśnie rosną|przyrost\p{L}* mięśni|\bsił[aęy]\b|upadk|regenerac|\bcardio\b|zalecan/iu;
/** Teksty dziedzinowe z jawnej listy (pełne klucze): krótkie, z liczbą dziedzinową podstawianą z kodu — wzorzec ich nie rozpozna. */
export const DOMAIN_KEYS = [
  '{faza} {n} s', // tempo faz animacji figury v2 (lib/figures/v2/anim.ts TEMPO: 2 s w dół, 1 s w górę)
];
/** Teksty poza kontrolą pokrycia (początek tekstu). Pusta od 25.10.2026: ekran „Źródła wiedzy” usunięty („całkiem anonimowo”, docs/18). */
export const POZA_REJESTREM = [];
/** Oznaczenia pewności (decyzja właściciela 23.10.2026): „wstępne/potwierdzone”, „jedno źródło”, „uproszczenie”, „nasz wybór”, „konwencja” NIE występują w tekstach interfejsu —
 * zostają w rejestrze twierdzeń (pole rodzaje). Wzorce dla klucza polskiego i angielskiego brzmienia. */
export const MARKER_RE_PL = /uproszczeni|konwencj|jedno źródło|jednego źródła|jednym źródle|nasz(?:e|ym|a)? wyb|wstępn(?:e|a|y|ie)\b|potwierdzon/i;
export const MARKER_RE_EN = /simplif|convention|single source|one source|our (?:own )?choice|preliminary|\bconfirmed\b/i;
/** Teksty, w których oznaczenia wolno nazwać (od 25.10.2026 brak): początki kluczy polskich. */
export const EKRAN_ZRODEL = [...POZA_REJESTREM];
export const KINDS = ['uproszczenie', 'konwencja', 'jedno źródło', 'źródło cytowane w tekście', 'przegląd badań', 'otwarte'];
export const hash = (s) => createHash('sha1').update(s, 'utf8').digest('hex').slice(0, 10);

export function loadDictionary() {
  const require = createRequire(import.meta.url);
  const ts = require('typescript');
  const out = ts.transpileModule(readFileSync(DICT, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 } }).outputText;
  const mod = { exports: {} }; vm.runInNewContext(out, { module: mod, exports: mod.exports });
  return mod.exports.EN;
}

/** Błędy: teksty słownika (klucz PL albo wartość EN) z oznaczeniem pewności  */
export function markerErrors(EN) {
  return Object.keys(EN).filter((k) => !EKRAN_ZRODEL.some((p) => k.startsWith(p)) && (MARKER_RE_PL.test(k) || MARKER_RE_EN.test(EN[k])))
    .map((k) => `${k.slice(0, 90)}… — oznaczenie pewności w tekście interfejsu (wstępne/potwierdzone, jedno źródło, uproszczenie, nasz wybór, konwencja): usuń z tekstu, rodzaj zostaje w rejestrze twierdzeń`);
}

export const domainTexts = (EN) => Object.keys(EN).filter((k) => (DOMAIN_KEYS.includes(k) || (k.length >= MIN_LEN && (DOMAIN_RE.test(k) || DOMAIN_WORDS_RE.test(k)))) && !POZA_REJESTREM.some((p) => k.startsWith(p)));

const hits0 = (EN, kotwica) => typeof kotwica === 'string' && Object.keys(EN).some((k) => k.startsWith(kotwica));
/** Kontrola; `readDoc(ścieżka)` zwraca treść dokumentu albo null. Zwraca listę błędów (pustą, gdy rejestr zgodny). */
export function checkClaims(EN, registry, readDoc) {
  const errs = []; const entries = registry.twierdzenia ?? [];
  const ids = new Set(); const covered = new Set();
  for (const e of entries) {
    const w = `${e.id ?? '(bez id)'}`;
    if (!/^T-\d{3}$/.test(e.id ?? '')) errs.push(`${w}: id w formacie T-NNN`);
    if (ids.has(e.id)) errs.push(`${w}: id powtórzone`); ids.add(e.id);
    /* wpis wycofany z interfejsu (tekst usunięty z aplikacji, np. oznaczenie pewności — decyzja 23.10.2026): zostaje w rejestrze jako ślad decyzji, bez kontroli tekstu */
    if (typeof e.wycofane === 'string' && e.wycofane.length > 20) { if (hits0(EN, e.kotwica)) errs.push(`${w}: wpis wycofany, a tekst o kotwicy nadal jest w słowniku`); continue; }
    if (typeof e.kotwica !== 'string' || (e.kotwica.length < 20 && !DOMAIN_KEYS.includes(e.kotwica))) errs.push(`${w}: kotwica (początek polskiego tekstu, ≥ 20 znaków, albo pełny klucz z DOMAIN_KEYS)`);
    if (!Array.isArray(e.rodzaje) || !e.rodzaje.length || e.rodzaje.some((k) => !KINDS.includes(k))) errs.push(`${w}: rodzaje spośród: ${KINDS.join(', ')}`);
    if (typeof e.przeglad !== 'string' || !e.przeglad) errs.push(`${w}: pole przeglad (data: kto, zakres)`);
    const hits = Object.keys(EN).filter((k) => typeof e.kotwica === 'string' && (DOMAIN_KEYS.includes(e.kotwica) ? k === e.kotwica : k.startsWith(e.kotwica)));
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
  /* kandydaci bez twierdzenia (M1-audytor-generalny-021): tekst interfejsu, rachunek na danych użytkownika, opis reguły produktu — z powodem */
  for (const b of registry.bezTwierdzenia ?? []) {
    const w = `bezTwierdzenia „${String(b.kotwica).slice(0, 40)}…”`;
    if (typeof b.powod !== 'string' || b.powod.length < 10) errs.push(`${w}: powód (≥ 10 znaków), dlaczego tekst nie jest twierdzeniem dziedzinowym`);
    const pre = Object.keys(EN).filter((k) => typeof b.kotwica === 'string' && b.kotwica.length >= 15 && k.startsWith(b.kotwica));
    const hits = pre.includes(b.kotwica) ? [b.kotwica] : pre; /* kotwica = cały tekst, który jest też początkiem dłuższego */
    if (hits.length === 0) { errs.push(`${w}: tekst nie istnieje w słowniku (usuń wpis albo popraw kotwicę)`); continue; }
    if (hits.length > 1) { errs.push(`${w}: kotwica niejednoznaczna (${hits.length} teksty)`); continue; }
    if (covered.has(hits[0])) errs.push(`${w}: tekst ma też wpis twierdzenia — usuń jedno z dwóch`);
    covered.add(hits[0]);
  }
  for (const k of domainTexts(EN)) if (!covered.has(k)) errs.push(`tekst dziedzinowy bez ID w rejestrze: „${k.slice(0, 80)}…” (node scripts/claims.mjs --stub; gdy to nie twierdzenie — wpis w „bezTwierdzenia” z powodem)`);
  return errs;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const EN = loadDictionary(); const registry = JSON.parse(readFileSync(REG, 'utf8'));
  const readDoc = (p) => (existsSync(join(root, p)) ? readFileSync(join(root, p), 'utf8') : null);
  const a = process.argv.slice(2);
  if (a.includes('--stub')) {
    const have = new Set([...(registry.twierdzenia ?? []), ...(registry.bezTwierdzenia ?? [])].map((e) => e.kotwica)); let n = Math.max(0, ...(registry.twierdzenia ?? []).map((e) => Number(String(e.id).slice(2)) || 0));
    const stubs = domainTexts(EN).filter((k) => ![...have].some((c) => (DOMAIN_KEYS.includes(c) ? k === c : k.startsWith(c)))).map((k) => ({ id: `T-${String(++n).padStart(3, '0')}`, kotwica: DOMAIN_KEYS.includes(k) ? k : k.slice(0, 48), skrot: hash(k), skrotEn: hash(EN[k]), rodzaje: ['otwarte'], zrodla: [], dokument: null, fraza: null, uwaga: '[OTWARTE — źródło do wskazania]', przeglad: '' }));
    console.log(JSON.stringify(stubs, null, 1)); process.exit(0);
  }
  const r = a.indexOf('--rehash');
  if (r >= 0) {
    const pi = a.indexOf('--przeglad'); const przeglad = pi >= 0 ? a[pi + 1] : '';
    const ids = a.slice(r + 1).filter((x) => /^T-\d{3}$/.test(x));
    if (!przeglad || !ids.length) { console.error('Użycie: --rehash T-001 [T-002…] --przeglad "<data: kto, co sprawdzono>"'); process.exit(1); }
    for (const e of registry.twierdzenia) if (ids.includes(e.id)) { const k = Object.keys(EN).find((x) => (DOMAIN_KEYS.includes(e.kotwica) ? x === e.kotwica : x.startsWith(e.kotwica))); if (!k) { console.error(`${e.id}: brak tekstu`); process.exit(1); } e.skrot = hash(k); e.skrotEn = hash(EN[k]); e.przeglad = przeglad; }
    writeFileSync(REG, JSON.stringify(registry, null, 1) + '\n'); console.log('zapisano', ids.join(', ')); process.exit(0);
  }
  const errs = [...checkClaims(EN, registry, readDoc), ...markerErrors(EN)];
  if (errs.length) { console.error('Rejestr twierdzeń (docs/research/rejestr-twierdzen.json):\n' + errs.map((e) => '  ' + e).join('\n')); process.exit(1); }
  console.log(`twierdzenia: ${registry.twierdzenia.length} wpisów, ${domainTexts(EN).length} tekstów dziedzinowych (w tym bez twierdzenia: ${(registry.bezTwierdzenia ?? []).length}), rejestr zgodny`);
}
