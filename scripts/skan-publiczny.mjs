// Skan historii przed publikacją (lekcja z docs/40 o briefie z adresem e-mail w stopce, 10.11.2026; mechanizm wybrany przez programistę partii 5 w trybie „analogia”, do weta).
// Dlaczego: strażniki w tests/public-repo.test.ts („adresy e-mail w repozytorium”, SEC2-08) sprawdzają tylko pliki w stanie końcowym. Commit, który dodał adres,
// a następny go usunął, i tak trafia do publicznej historii przy wypchnięciu gałęzi — hak tego nie widział.
// Co robi: dla commitów osiągalnych z <rewizja> (domyślnie HEAD), których nie ma jeszcze w żadnej gałęzi zdalnej (git rev-list <rewizja> --not --remotes, bez scaleń),
// czyta DODANE linie i zgłasza: adres e-mail spoza listy dozwolonych w docs/, site/, lib/, app/ (te same rozszerzenia i wyjątek co test) oraz ścieżki /tmp/claude-…
// i .claude/worktrees/agent-… w docs/ (md, html, txt), README.md i CLAUDE.md. Commity już opublikowane pomija (ich historii nie da się cofnąć bez force-push).
// Uruchamia go check:pochodne (hak pre-push). Kod 1 = znalezisko (plik, commit; samego adresu nie wypisuje — log haka bywa publiczny). Test: tests/skan-publiczny.test.ts.
// Użycie: node scripts/skan-publiczny.mjs [rewizja]
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { jestGlowny } from './modul-glowny.mjs';

/** Te same reguły co tests/public-repo.test.ts (zgodność pilnuje tests/skan-publiczny.test.ts). */
export const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
export const ALLOWED_EMAILS = ['support@apps4brew.com', 'hello@apps4brew.com'];
export const EMAIL_EXEMPT = ['lib/licenses.generated.ts'];
const EMAIL_PLIK = f => /^(docs|site|lib|app)\//.test(f) && /\.(md|html|json|ts|tsx|mjs|js|txt|csv)$/.test(f) && !EMAIL_EXEMPT.includes(f);
const SCIEZKA_PLIK = f => (/^docs\//.test(f) && /\.(md|html|txt)$/.test(f)) || f === 'README.md' || f === 'CLAUDE.md';
const SCIEZKA_RE = /\/tmp\/claude-\d+\/|\.claude\/worktrees\/agent-[0-9a-f]+/;

/** Znaleziska w jednej dodanej linii pliku `plik`: lista rodzajów ('e-mail' | 'ścieżka lokalna'). */
export function znaleziskaLinii(plik, linia) {
  const r = [];
  if (EMAIL_PLIK(plik) && [...linia.matchAll(EMAIL_RE)].some(m => !ALLOWED_EMAILS.includes(m[0]))) r.push('e-mail');
  if (SCIEZKA_PLIK(plik) && SCIEZKA_RE.test(linia)) r.push('ścieżka lokalna');
  return r;
}

const git = (cwd, args) => spawnSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });

/** Znaleziska w nieopublikowanych commitach: [{ commit, plik, rodzaj }]. */
export function skanuj(cwd, rewizja = 'HEAD') {
  const lista = git(cwd, ['rev-list', '--no-merges', rewizja, '--not', '--remotes']);
  if (lista.status !== 0) throw new Error(`git rev-list: ${lista.stderr.trim()}`);
  const wynik = [];
  for (const commit of lista.stdout.split('\n').filter(Boolean)) {
    const d = git(cwd, ['show', '--format=', '--no-renames', '--unified=0', '--no-color', commit]);
    let plik = '';
    for (const l of d.stdout.split('\n')) {
      if (l.startsWith('+++ ')) { plik = l.startsWith('+++ b/') ? l.slice(6) : ''; continue; }
      if (!plik || !l.startsWith('+')) continue;
      for (const rodzaj of znaleziskaLinii(plik, l.slice(1))) wynik.push({ commit: commit.slice(0, 8), plik, rodzaj });
    }
  }
  return wynik;
}

if (jestGlowny(import.meta.url)) {
  const wynik = skanuj(process.cwd(), process.argv[2] ?? 'HEAD');
  const unikalne = [...new Set(wynik.map(w => `${w.commit} ${w.plik}: ${w.rodzaj}`))];
  if (unikalne.length) {
    console.error(`skan-publiczny: ${unikalne.length} znalezisk w commitach jeszcze nieopublikowanych (adres e-mail spoza listy dozwolonych albo lokalna ścieżka agenta):`);
    for (const u of unikalne) console.error(`  ${u}`);
    console.error('Jak naprawić: usuń treść w commicie, który ją dodał (git rebase na niewypchniętych commitach albo nowa gałąź z czystą historią) — poprawka w kolejnym commicie zostawia ją w publicznej historii.');
    process.exit(1);
  }
  console.log('skan-publiczny: czysto (commity nieopublikowane)');
}
