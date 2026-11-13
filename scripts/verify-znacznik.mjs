// Znacznik zielonego verify (L-049, decyzja właściciela 28.10.2026, opcja A): reguła „pełne verify przed wypchnięciem” z CLAUDE.md jako mechanizm.
//   node scripts/verify-znacznik.mjs --zapisz pelne|szybkie|lekkie|dokumenty — koniec `npm run verify` / `npm run verify:szybkie` / `npm run verify:lekkie` / `npm run verify:docs`: zapisuje drzewo HEAD (git rev-parse HEAD^{tree}),
//                                                                  tylko przy czystej kopii roboczej (bez zmian i bez nieśledzonych plików); w CI nic nie robi
//   node scripts/verify-znacznik.mjs --czysta — start verify / verify:szybkie / verify:docs (ZB-041 G2, 04.11.2026): kod 1 z listą plików, gdy kopia robocza ma zmiany albo nieśledzone pliki
//                                                                  (inaczej przebieg skończyłby się zielony, ale bez znacznika — i trzeba by go powtarzać); w CI nic nie robi
//   node scripts/verify-znacznik.mjs --sprawdz <sha> [--wymagaj pelne] [--galaz <nazwa>] — hak pre-push: kod 0, gdy drzewo commitu <sha> ma znacznik „pelne” albo „szybkie” (od 03.11.2026,
//                                                                  decyzja właściciela ~21:45 PL, wariant A: pełne testy w CI), albo „dokumenty” i zmiany od origin/main albo od najbliższego
//                                                                  przodka ze znacznikiem „pelne”/„szybkie” to same dokumenty (H1, 31.10.2026, ZB-028); inaczej kod 1 z poleceniem naprawy.
//                                                                  „lekkie” (verify:lekkie, 08.11.2026, wariant A „A + B mądrze”: bez testów Jest, pełne w tests.yml) wystarcza tylko, gdy wypychana gałąź (--galaz) to nie main;
//                                                                  na main (--galaz main) tylko „pelne” (decyzja koordynatora 08/09.11.2026 z upoważnienia właściciela, do weta rano; „szybkie” już nie);
//                                                                  --wymagaj pelne (scal-galaz --do main): „szybkie” nie wystarcza, baza dla dokumentów tylko „pelne"
//                                                                  --galaz (hak: wypychana gałąź): baza dla dokumentów może być też origin/<gałąź> z zielonym tests.yml (ZB-041 G4, 04.11.2026)
// Plik: <wspólny katalog .git>/verify-znaczniki.json (wspólny dla worktree), ostatnie MAKS wpisów; VERIFY_ZNACZNIK_PLIK zastępuje ścieżkę (testy).
// Obejście świadome: git push --no-verify.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { jestDokumentem } from './dokumenty.mjs';
import { zielonyTests } from './ci-wynik.mjs';
import { jestGlowny } from './modul-glowny.mjs';

const MAKS = 50;
const RODZAJE = ['pelne', 'szybkie', 'lekkie', 'dokumenty'];
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const sprobuj = (...a) => { try { return git(...a); } catch { return null; } };
const GLEBIA = 500; /* ilu przodków przeglądamy w poszukiwaniu commitu z pełnym verify */

const plik = () => process.env.VERIFY_ZNACZNIK_PLIK || resolve(git('rev-parse', '--git-common-dir'), 'verify-znaczniki.json');
const czytaj = () => { try { const d = JSON.parse(readFileSync(plik(), 'utf8')); return Array.isArray(d) ? d : []; } catch { return []; } };

/** ZB-041 G2: czysta kopia robocza na starcie verify (kod 0 / 1 z listą plików); w CI pomijane. */
export function czystaKopia() {
  if (process.env.CI) return 0;
  const brud = git('status', '--porcelain');
  if (!brud) return 0;
  const w = brud.split('\n');
  console.error(`verify: kopia robocza ma zmiany albo nieśledzone pliki (${w.length}) — zatwierdź je (git add, commit) i uruchom verify ponownie; inaczej przebieg zakończy się bez znacznika dla haka pre-push.\n${w.slice(0, 10).join('\n')}${w.length > 10 ? '\n…' : ''}`);
  return 1;
}

export function zapisz(rodzaj) {
  if (!RODZAJE.includes(rodzaj)) { console.error(`verify-znacznik: nieznany rodzaj „${rodzaj}” (${RODZAJE.join(', ')})`); return 2; }
  if (process.env.CI) return 0;
  const brud = git('status', '--porcelain');
  if (brud) {
    console.error(`verify-znacznik: kopia robocza ma zmiany albo nieśledzone pliki — znacznik NIE zapisany (hak pre-push zatrzyma wypchnięcie).\n${brud.split('\n').slice(0, 10).join('\n')}\nZatwierdź zmiany (git add, commit) i uruchom verify ponownie.`);
    return 0; /* verify było zielone — nie wywracamy go; brak znacznika wystarczy */
  }
  const wpis = { drzewo: git('rev-parse', 'HEAD^{tree}'), rodzaj, commit: git('rev-parse', '--short', 'HEAD'), data: new Date().toISOString() };
  const lista = [wpis, ...czytaj().filter(w => !(w.drzewo === wpis.drzewo && w.rodzaj === rodzaj))].slice(0, MAKS);
  writeFileSync(plik(), JSON.stringify(lista, null, 1) + '\n');
  console.log(`verify-znacznik: zapisany (${rodzaj}, ${wpis.commit}, drzewo ${wpis.drzewo.slice(0, 12)})`);
  return 0;
}

/** H1 (31.10.2026): najbliższy przodek <sha> (z nim włącznie), którego drzewo ma znacznik „pelne”; null, gdy brak. */
export function bazaPelnego(sha = 'HEAD', rodzaje = ['pelne']) {
  const pelne = new Set(czytaj().filter(w => rodzaje.includes(w.rodzaj)).map(w => w.drzewo));
  if (!pelne.size) return null;
  for (const l of (sprobuj('log', `--max-count=${GLEBIA}`, '--format=%H %T', sha) ?? '').split('\n')) {
    const [commit, drzewo] = l.split(' ');
    if (drzewo && pelne.has(drzewo)) return commit;
  }
  return null;
}

/** ZB-041 G4 (+ G4b, 04.11.2026): SHA najbliższego commitu gałęzi origin/<gałąź> (będącego przodkiem <sha>, z nim włącznie), którego tests.yml ma conclusion success, o ile od niego do <sha> zmieniły się
 *  TYLKO dokumenty; inaczej null. Koniec gałęzi bywa commitem z dokumentami bez zielonego przebiegu (wypchnięty po verify:docs, CI w toku albo anulowane przez nowsze wypchnięcie) — wtedy szukamy wstecz.
 *  Przeglądamy najwyżej MAKS_ZDALNYCH commitów i przerywamy, gdy od kandydata zmienił się kod (starsi też by go zawierali). Błąd sieci → null. */
export const MAKS_ZDALNYCH = 10;
export async function bazaZdalna(galaz, sha = 'HEAD', deps = {}) {
  if (!galaz || galaz === 'HEAD') return null;
  const zdalny = sprobuj('rev-parse', '--verify', '--quiet', `refs/remotes/origin/${galaz}^{commit}`);
  if (!zdalny || sprobuj('merge-base', '--is-ancestor', zdalny, sha) === null) return null;
  const kandydaci = (sprobuj('rev-list', `--max-count=${MAKS_ZDALNYCH}`, zdalny) ?? '').split('\n').filter(Boolean);
  for (const k of kandydaci) {
    if (!tylkoDokumentyOd(k, sha)) {
      /* brak zmian (k == sha) to nie „same dokumenty”, ale wtedy sam k jest końcem gałęzi: wystarczy jego CI */
      if (git('rev-parse', `${k}^{tree}`) !== git('rev-parse', `${sha}^{tree}`)) return null;
    }
    if (await zielonyTests(k, deps)) return k;
  }
  return null;
}
/** Nazwa bieżącej gałęzi (null przy odłączonym HEAD). */
export const biezacaGalaz = () => { const g = sprobuj('rev-parse', '--abbrev-ref', 'HEAD'); return g && g !== 'HEAD' ? g : null; };

/** Czy wszystkie zmiany commitu od bazy to dokumenty (brak bazy albo brak zmian → nie). */
function tylkoDokumentyOd(baza, sha) {
  if (!baza) return false;
  const pliki = (sprobuj('diff', '--name-only', baza, sha) ?? '').split('\n').filter(Boolean);
  return pliki.length > 0 && pliki.every(jestDokumentem);
}
/** Baza origin/main (jak dotąd) albo — H1 — najbliższy przodek z pełnym verify. */
const tylkoDokumenty = (sha, rodzaje, zdalne = []) => tylkoDokumentyOd(sprobuj('merge-base', 'origin/main', sha), sha) || tylkoDokumentyOd(bazaPelnego(sha, rodzaje), sha) || zdalne.some(b => tylkoDokumentyOd(b, sha));

/** Rodzaje znaczników wystarczające dla gałęzi docelowej: main i scalenie (--wymagaj pelne) tylko „pelne” (decyzja koordynatora 08/09.11.2026 z upoważnienia właściciela, do weta rano; zgodnie z decyzją 08.11 „main pełne”),
 *  inne gałęzie „pelne”/„szybkie”/„lekkie”; bez nazwy gałęzi (nieznany cel) jak dotąd „pelne”/„szybkie”. */
export const rodzajeDla = (wymagaj = null, galaz = null) => wymagaj === 'pelne' || galaz === 'main' ? ['pelne'] : galaz ? ['pelne', 'szybkie', 'lekkie'] : ['pelne', 'szybkie'];

export function sprawdz(sha, wymagaj = null, zdalne = [], cicho = false, galaz = null) {
  const rodzaje = rodzajeDla(wymagaj, galaz);
  const drzewo = sha && sprobuj('rev-parse', `${sha}^{tree}`);
  if (!drzewo) { console.error(`verify-znacznik: nie znam commitu ${sha}`); return 1; }
  const wpisy = czytaj().filter(w => w.drzewo === drzewo);
  if (wpisy.some(w => rodzaje.includes(w.rodzaj))) return 0;
  if (wpisy.some(w => w.rodzaj === 'dokumenty') && tylkoDokumenty(sha, rodzaje, zdalne)) return 0;
  if (!cicho) console.error(`verify-znacznik: commit ${sha.slice(0, 7)} nie ma zielonego ${wymagaj === 'pelne' || galaz === 'main' ? 'PEŁNEGO verify (npm run verify)' : !galaz ? 'verify (verify:szybkie)' : 'verify (verify:lekkie)'} dla tego stanu plików${wpisy.length ? ' (znacznik verify:docs, a zmiany to nie same dokumenty)' : ''}.`);
  return 1;
}

if (jestGlowny(import.meta.url)) {
  const a = process.argv.slice(2);
  const i = a.indexOf('--zapisz'), j = a.indexOf('--sprawdz');
  if (a.includes('--czysta')) process.exit(czystaKopia());
  if (i >= 0) process.exit(zapisz(a[i + 1]));
  if (j >= 0) {
    const wymagaj = a[a.indexOf('--wymagaj') + 1] === 'pelne' && a.includes('--wymagaj') ? 'pelne' : null;
    const galaz = a.includes('--galaz') ? a[a.indexOf('--galaz') + 1] : null;
    /* G4: najpierw bez sieci; baza z zielonym tests.yml gałęzi (zapytanie do API) dopiero, gdy to nie wystarcza — nie dla scalenia do main (--wymagaj pelne) */
    let kod = sprawdz(a[j + 1], wymagaj, [], Boolean(galaz) && !wymagaj, galaz);
    if (kod !== 0 && galaz && !wymagaj) {
      const b = await bazaZdalna(galaz, a[j + 1]);
      kod = b ? sprawdz(a[j + 1], wymagaj, [b], false, galaz) : sprawdz(a[j + 1], wymagaj, [], false, galaz);
    }
    process.exit(kod);
  }
  console.error('użycie: --czysta | --zapisz pelne|szybkie|lekkie|dokumenty | --sprawdz <sha> [--wymagaj pelne] [--galaz <nazwa>]'); process.exit(2);
}
