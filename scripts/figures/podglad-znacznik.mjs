#!/usr/bin/env node
// Znacznik ważności podglądu (docs/53, bramka 4, krok 6; backlog figur 28.10.2026): PODGLAD-WAZNY.txt wiąże podgląd z danymi — zapisuje odcisk póz (poze.json) i odcisk przybliżeń (manifest.json → przyblizenia),
// a `sprawdzPodglad` dowodzi, że podgląd nie jest nieaktualny: (1) odciski w znaczniku zgadzają się z plikami podglądu, (2) pozy i przybliżenia wygenerowane TERAZ przez generator rodziny
// są takie same jak w podglądzie. Luka z recenzji mobilności r6: podgląd z nieaktualnym polem `przyblizenie` przeszedł jako ważny, bo znacznik potwierdzał tylko kontrolę manifestu.
// Użycie: node scripts/figures/podglad-znacznik.mjs --katalog <wyjscie>/<rodzina>   (kod 1 = podgląd nieważny)
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const stabilny = (x) => (Array.isArray(x) ? `[${x.map(stabilny).join(',')}]` : x && typeof x === 'object' ? `{${Object.keys(x).filter((k) => x[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${stabilny(x[k])}`).join(',')}}` : JSON.stringify(x));
/** Odcisk SHA-256 wartości JSON (klucze posortowane, pola undefined pominięte, więc odcisk przeżywa zapis i odczyt pliku). */
export const odcisk = (x) => createHash('sha256').update(stabilny(x === undefined ? null : JSON.parse(JSON.stringify(x)))).digest('hex');

const git = (...a) => { try { return execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } };
/** Treść znacznika PODGLAD-WAZNY.txt: odciski póz i przybliżeń (+ SHA commitu i stan drzewa dla człowieka; rozstrzyga odcisk, nie commit). `ekstra` = dopisek wywołującego (wynik kontroli manifestu). */
export function zbudujZnacznik({ rodzina, poze, przyblizenia, ekstra = '' }) {
  const sha = git('rev-parse', 'HEAD'); const status = git('status', '--porcelain'); const drzewo = status === null ? 'brak-git' : status === '' ? 'czyste' : 'zmienione';
  return `${ekstra ? ekstra.replace(/\n*$/, '\n') : ''}rodzina: ${rodzina}\nodcisk_poz: ${odcisk(poze)}\nodcisk_przyblizen: ${odcisk(przyblizenia)}\ncommit: ${sha ?? 'brak'}\ndrzewo: ${drzewo}\n`;
}
const pole = (tekst, nazwa) => new RegExp(`^${nazwa}: (.+)$`, 'm').exec(tekst)?.[1]?.trim() ?? null;
const wczytaj = (p) => JSON.parse(readFileSync(p, 'utf8'));

/** Lista powodów, dla których podgląd w katalogu `dir` jest NIEWAŻNY (pusta = ważny). `generator` = moduł generatora rodziny (generuj, PRZYBLIZENIA); domyślnie importowany z agent-pozy/<rodzina>.mjs. */
export async function sprawdzPodglad(dir, { generator } = {}) {
  const o = []; const znacznik = join(dir, 'PODGLAD-WAZNY.txt');
  if (!existsSync(znacznik)) return [`brak znacznika PODGLAD-WAZNY.txt w ${dir}${existsSync(join(dir, 'PODGLAD-NIEWAZNY.txt')) ? ' (jest PODGLAD-NIEWAZNY.txt)' : ''} — podgląd nie przeszedł kontroli`];
  const tekst = readFileSync(znacznik, 'utf8'); const oPoz = pole(tekst, 'odcisk_poz'); const oPrz = pole(tekst, 'odcisk_przyblizen'); const rodzina = pole(tekst, 'rodzina');
  if (!oPoz || !oPrz || !rodzina) return ['znacznik PODGLAD-WAZNY.txt nie ma odcisku póz, odcisku przybliżeń albo rodziny (stary format) — zbuduj podgląd ponownie'];
  if (!existsSync(join(dir, 'poze.json')) || !existsSync(join(dir, 'manifest.json'))) return ['brak poze.json albo manifest.json w katalogu podglądu'];
  const poze = wczytaj(join(dir, 'poze.json')).poze ?? {}; const manifest = wczytaj(join(dir, 'manifest.json')); const przyblizenia = manifest.przyblizenia ?? {};
  if (odcisk(poze) !== oPoz) o.push('poze.json nie zgadza się z odciskiem póz w znaczniku (poz zmieniono po zbudowaniu podglądu)');
  if (odcisk(przyblizenia) !== oPrz) o.push('manifest.json: przybliżenia nie zgadzają się z odciskiem przybliżeń w znaczniku (przybliżenia zmieniono po zbudowaniu podglądu)');
  const gen = generator ?? await import(pathToFileURL(join(ROOT, 'scripts/figures/agent-pozy', `${rodzina}.mjs`)).href);
  const G = gen.generuj();
  for (const cw of Object.keys(poze)) {
    if (!(cw in G)) { o.push(`poza „${cw}” z podglądu nie istnieje już w generatorze rodziny ${rodzina}`); continue; }
    let teraz; try { teraz = JSON.parse(JSON.stringify(G[cw]())); } catch (e) { o.push(`generator rodziny ${rodzina} nie buduje już pozy „${cw}”: ${e.message}`); continue; }
    if (odcisk(teraz) !== odcisk(poze[cw])) o.push(`poza „${cw}” w podglądzie różni się od tego, co generator buduje teraz (podgląd nieaktualny wobec generatora)`);
  }
  for (const cw of Object.keys(przyblizenia)) if ((gen.PRZYBLIZENIA ?? {})[cw] !== przyblizenia[cw]) o.push(`przybliżenie „${cw}” w manifeście różni się od PRZYBLIZENIA w generatorze (podgląd nieaktualny)`);
  for (const cw of Object.keys(poze)) if ((gen.PRZYBLIZENIA ?? {})[cw] !== undefined && przyblizenia[cw] === undefined) o.push(`generator ma przybliżenie dla „${cw}”, a manifest podglądu go nie zawiera`);
  return o;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const i = process.argv.indexOf('--katalog'); if (i < 0) { console.error('użycie: node scripts/figures/podglad-znacznik.mjs --katalog <wyjscie>/<rodzina>'); process.exit(2); }
  const dir = resolve(process.argv[i + 1]); const p = await sprawdzPodglad(dir);
  if (p.length) { console.error('PODGLĄD NIEWAŻNY:\n' + p.map((x) => `  - ${x}`).join('\n')); process.exit(1); }
  console.log(`podgląd ważny (odciski póz i przybliżeń zgodne z plikami i z generatorem): ${dir}`);
}
