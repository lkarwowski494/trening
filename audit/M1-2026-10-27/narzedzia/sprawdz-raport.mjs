// sprawdz-raport.mjs — użycie: node sprawdz-raport.mjs <raport.md> [katalog-repo=.] [katalog-raportu=dirname(raport)] [--rola <id>]
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, join, basename } from 'node:path';
const arg = process.argv.slice(2), ir = arg.indexOf('--rola');
let rola = ir >= 0 ? arg.splice(ir, 2)[1] : undefined;
const [raport, repo = '.', baza = dirname(raport)] = arg;
const tekst = readFileSync(raport, 'utf8');
const bledy = [];
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const ile = (s, z) => s.split(z).length - 1;
const ref = /`?((?:[\w@.()[\]+-]+\/)*[\w@.()[\]+-]+\.[A-Za-z0-9]+):(\d+)(?:[-–](\d+))?`?/g;
for (const [nr, wiersz] of tekst.split('\n').entries()) {
  for (const m of wiersz.matchAll(ref)) {
    let [, plik, od, doL] = m;
    while (ile(plik, '(') > ile(plik, ')') || ile(plik, '[') > ile(plik, ']')) plik = plik.replace(/^[^([]*[([]/, '');
    if (/^https?$/.test(plik) || wiersz.slice(Math.max(0, m.index - 8), m.index).includes('://')) continue;
    const sciezka = resolve(repo, plik);
    if (!existsSync(sciezka) || !statSync(sciezka).isFile()) { bledy.push(`w${nr + 1}: brak pliku ${plik}`); continue; }
    const linie = readFileSync(sciezka, 'utf8').split('\n');
    const a = Number(od), b = Number(doL || od);
    if (a < 1 || b > linie.length || b < a) { bledy.push(`w${nr + 1}: ${plik}:${od}${doL ? '-' + doL : ''} poza plikiem (${linie.length} linii)`); continue; }
    const cyt = wiersz.slice(m.index).match(/„([^”]{12,})”/);
    if (cyt) {
      const okno = norm(linie.slice(Math.max(0, a - 4), Math.min(linie.length, b + 3)).join(' '));
      if (!okno.includes(norm(cyt[1]).replace(/…$/, ''))) bledy.push(`w${nr + 1}: cytat nie występuje w ${plik} w pobliżu linii ${od}`);
    }
  }
  for (const m of wiersz.matchAll(/(?:^|[\s(`])((?:dowody|zrzuty)\/[\w./-]+)/g)) {
    if (!existsSync(join(baza, m[1]))) bledy.push(`w${nr + 1}: brak pliku dowodu ${m[1]}`);
  }
}
const sekrety = [/AKIA[0-9A-Z]{16}/, /gh[pousr]_[A-Za-z0-9]{30,}/, /github_pat_[A-Za-z0-9_]{30,}/, /sk-[A-Za-z0-9_-]{20,}/, /AIza[0-9A-Za-z_-]{30,}/, /xox[abpr]-[A-Za-z0-9-]{10,}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/];
for (const r of sekrety) if (r.test(tekst)) bledy.push(`sekret? wzorzec ${r.source}`);
// tylko audit, reaudit: format (--rola albo nazwa <rola ścieżki albo M1>-[reaudit-]RRRR-MM-DD.md): ID <rola>-NNN i sekcje szablonu raportu.
const zN = basename(raport).match(/^((?:\d\d|M1)-[a-z-]+?)-(reaudit-)?\d{4}-\d\d-\d\d(?:-p\d+)?\.md$/);
rola ??= zN?.[1];
if (rola) {
  const S = {};
  let k;
  for (const l of tekst.split('\n')) if (l.startsWith('## ')) S[(k = l.slice(3).toLowerCase())] = []; else if (k) S[k].push(l);
  const w = (n) => S[Object.keys(S).find((x) => x.includes(n.toLowerCase()))];
  const wym = zN?.[2] ? ['Podsumowanie', 'Kontrola dowodów'] : ['Podsumowanie', 'Linia bazowa', 'Pokrycie', 'Kontrola dowodów', 'Stosowalność', 'Znaleziska', 'Do sprawdzenia', 'Co działa dobrze', 'Decyzje dla właściciela', 'Proponowane polecenie'];
  for (const n of [...wym, ...(rola.startsWith('M1') ? ['Werdykt'] : [])]) if (!w(n)) bledy.push(`brak sekcji „## ${n}…” (szablon raportu)`);
  const ids = (w('Znaleziska') ?? []).flatMap((l) => l.match(/^### ([^\s:·]+)/)?.[1] ?? []);
  let nag = null;
  for (const l of w('Podsumowanie') ?? []) {
    const c = l.startsWith('|') ? l.split('|')[1].trim() : null;
    nag = c === null ? null : nag ?? c;
    if (nag === 'ID' && c !== 'ID' && c && !/^:?-+/.test(c)) ids.push(c);
  }
  for (const x of ids) if (!new RegExp(`^${rola}-\\d{3,}$`).test(x)) bledy.push(`ID „${x}” zamiast ${rola}-NNN`);
}
// koniec audit, reaudit
for (const b of new Set(bledy)) console.log('BŁĄD', b);
console.log(bledy.length ? `${new Set(bledy).size} błędów` : `OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone${rola ? `; format raportu ${rola}` : ''}`);
process.exit(bledy.length ? 1 : 0);
