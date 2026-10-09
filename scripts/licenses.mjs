#!/usr/bin/env node
/*
 * Licencje open source (audyt 0.10 SEC-08): lista pakietów npm, od których zależy aplikacja, z licencją i notką o prawach autorskich — generowana
 * z package-lock.json (graf zależności `dependencies` aplikacji, bez devDependencies) i plików LICENSE w node_modules. Wynik: lib/licenses.generated.ts,
 * pokazywany w Więcej → O aplikacji → Licencje open source. MIT/BSD/ISC wymagają dołączenia notki — stąd lista z notkami i treść każdej licencji.
 * Uproszczenie (nazwane): graf z package-lock obejmuje też narzędzia budowania wymagane przez pakiety aplikacji (np. Expo CLI) — lista jest raczej
 * za szeroka niż za wąska. Czcionki IBM Plex: licencja OFL-1.1 (pakiety @expo-google-fonts).
 * Użycie: node scripts/licenses.mjs (zapis) | --check (verify: błąd, gdy plik nie zgadza się z package-lock / node_modules).
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'lib/licenses.generated.ts');
const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));
const P = lock.packages;

/** Rozwiązanie zależności jak w Node: node_modules najbliżej pakietu, potem wyżej. */
function resolve(from, dep) {
  let p = from;
  for (;;) { const k = (p ? p + '/' : '') + 'node_modules/' + dep; if (P[k] && !P[k].dev && !P[k].devOptional) return k; /* bez devDependencies i opcjonalnych peerów z drzewa dev (np. jest) */ if (!p) return null; const i = p.lastIndexOf('/node_modules/'); p = i < 0 ? '' : p.slice(0, i); }
}
const seen = new Map(); const queue = Object.keys(P[''].dependencies ?? {}).map(d => resolve('', d)).filter(Boolean);
while (queue.length) {
  const k = queue.pop(); if (seen.has(k)) continue; const e = P[k]; seen.set(k, e);
  for (const d of Object.keys({ ...e.dependencies, ...e.optionalDependencies, ...e.peerDependencies })) { if (e.peerDependenciesMeta?.[d]?.optional && !e.dependencies?.[d] && !e.optionalDependencies?.[d]) continue; /* opcjonalny peer — nie jest częścią aplikacji */ const r = resolve(k, d); if (r && !seen.has(r)) queue.push(r); }
}

const LICENSE_FILE = /^(licen[cs]e|copying)([._-].*)?$/i; /* także LICENSE_FONT (IBM Plex, OFL-1.1) */
const licenseFiles = dir => { try { return readdirSync(join(root, dir)).filter(f => LICENSE_FILE.test(f)).sort(); } catch { return []; } };
const COPY = /^\s*(?:copyright\b|\(c\)\s*\d|©)/i;
const PLACEHOLDER = /<[^>]+>|\[[^\]]*(?:yyyy|year|name)[^\]]*\]|copyright (?:notice|holders?|owner)|copyright and license|^\s*copyright\s*$/i;
const clean = s => s.replace(/\s+/g, ' ').trim();
function copyrights(dir, pkgJson) {
  const out = [];
  for (const f of licenseFiles(dir)) for (const line of readFileSync(join(root, dir, f), 'utf8').split(/\r?\n/)) { const l = clean(line); if (COPY.test(l) && /\d{4}|©|\(c\)/i.test(l) && !PLACEHOLDER.test(l) && l.length <= 200 && !out.includes(l)) out.push(l); }
  if (!out.length && pkgJson) { const a = typeof pkgJson.author === 'string' ? pkgJson.author : pkgJson.author?.name; if (a) out.push(`© ${clean(a.replace(/\s*[<(][^>)]*[>)]/g, ''))}`); }
  return out.slice(0, 3);
}
const name = k => k.slice(k.lastIndexOf('node_modules/') + 'node_modules/'.length);
const rows = [];
for (const [k, e] of seen) {
  let pj = null; try { pj = JSON.parse(readFileSync(join(root, k, 'package.json'), 'utf8')); } catch {}
  const lic = e.license ?? (typeof pj?.license === 'string' ? pj.license : Array.isArray(pj?.licenses) ? pj.licenses.map(x => x.type ?? x).join(' OR ') : 'UNKNOWN');
  rows.push({ n: name(k), v: e.version ?? pj?.version ?? '', l: lic, c: copyrights(k, pj), dir: k });
}
rows.sort((a, b) => (a.n < b.n ? -1 : a.n > b.n ? 1 : a.v < b.v ? -1 : a.v > b.v ? 1 : 0));
const uniq = []; for (const r of rows) { const last = uniq[uniq.length - 1]; if (last && last.n === r.n && last.v === r.v) continue; uniq.push(r); }

/* treść licencji: z pliku LICENSE pierwszego pakietu z tą (prostą) licencją, bez linii z prawami autorskimi (notki są przy pakietach) */
const ids = [...new Set(uniq.flatMap(r => r.l.replace(/[()]/g, ' ').split(/\s+(?:OR|AND)\s+|\s+/).filter(x => x && x !== 'OR' && x !== 'AND')))].sort();
const texts = {}; const NAMED = { 'OFL-1.1': /SIL OPEN FONT LICENSE Version 1\.1/i };
for (const id of ids) {
  const src = uniq.find(r => r.l === id && licenseFiles(r.dir).length) ?? uniq.find(r => r.l.includes(id) && licenseFiles(r.dir).length && !/\b(OR|AND)\b/.test(r.l));
  /* licencja w parze (np. „MIT AND OFL-1.1” czcionek): plik, którego treść ją nazywa; GPL-2.0 tylko jako alternatywa „BSD-3-Clause OR GPL-2.0” — bez treści */
  const named = !src && NAMED[id] ? uniq.filter(r => r.l.includes(id)).flatMap(r => licenseFiles(r.dir).map(f => ({ r, f }))).find(x => NAMED[id].test(readFileSync(join(root, x.r.dir, x.f), 'utf8'))) : null;
  if (!src && !named) continue;
  const txt = readFileSync(join(root, (src ?? named.r).dir, src ? licenseFiles(src.dir)[0] : named.f), 'utf8').split(/\r?\n/).filter(l => !(COPY.test(clean(l)) && !PLACEHOLDER.test(clean(l)))).join('\n').replace(/\n{3,}/g, '\n\n').trim();
  texts[id] = { from: (src ?? named.r).n, text: txt };
}
const missing = ids.filter(id => !texts[id]);
const list = uniq.map(r => [r.n, r.v, r.l, r.c]);
const body = `/* Wygenerowane: node scripts/licenses.mjs (audyt 0.10 SEC-08) — nie edytuj ręcznie; verify sprawdza zgodność (--check). */
/** [nazwa, wersja, licencja (SPDX), notki o prawach autorskich] — pakiety npm, od których zależy aplikacja (package-lock, bez devDependencies). */
export const LICENSES: readonly (readonly [string, string, string, readonly string[]])[] = ${JSON.stringify(list)};
/** Treść licencji wg identyfikatora SPDX (z pliku LICENSE pakietu \`from\`). Bez treści w pakietach: ${JSON.stringify(missing)}. */
export const LICENSE_TEXTS: Readonly<Record<string, { from: string; text: string }>> = ${JSON.stringify(texts)};
`;
if (process.argv.includes('--check')) {
  const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (cur !== body) { console.error('licencje: lib/licenses.generated.ts nie zgadza się z package-lock.json / node_modules — uruchom: node scripts/licenses.mjs'); process.exit(1); }
  console.log(`licencje: OK (${list.length} pakietów, ${Object.keys(texts).length} treści licencji)`);
} else { writeFileSync(OUT, body); console.log(`licencje: zapisano ${list.length} pakietów, ${Object.keys(texts).length} treści licencji; bez treści: ${missing.join(', ') || '—'}`); }
