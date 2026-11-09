// Próg wolnego miejsca przed długimi testami (L-121, ZB-050; decyzja koordynatora 09.11.2026, zatwierdzona przez właściciela 09.11.2026).
// Pierwszy krok `npm run verify:lekkie`: poniżej progu testy padają na ENOSPC w połowie przebiegu (09.11.2026 dysk spadł do 23 MB).
// Użycie: node scripts/sprawdz-dysk.mjs [ścieżka]   (TRENING_WOLNE_BAJTY_TEST — tylko dla testu strażnika: podmienia odczyt wolnego miejsca)
import { statfsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/** Jedyne miejsce z progiem (GB wolnego miejsca na dysku roboczym). */
export const MIN_WOLNE_GB = 2;
const GB = 1024 ** 3;

export function wolneBajty(sciezka = '.') {
  if (process.env.TRENING_WOLNE_BAJTY_TEST) return Number(process.env.TRENING_WOLNE_BAJTY_TEST);
  const s = statfsSync(sciezka);
  return s.bavail * s.bsize;
}

/** { ok, wolneGB, komunikat } — komunikat tylko przy braku miejsca. */
export function ocenaDysku(bajty, minGB = MIN_WOLNE_GB) {
  const wolneGB = bajty / GB;
  if (wolneGB >= minGB) return { ok: true, wolneGB, komunikat: '' };
  return {
    ok: false, wolneGB,
    komunikat: [
      `Za mało wolnego miejsca na dysku: ${wolneGB.toFixed(2)} GB < ${minGB} GB — przerywam, testy padłyby na ENOSPC (L-121).`,
      'Zwolnij miejsce: usuń własne zakończone worktree (`git worktree remove <ścieżka>`), stare katalogi `/tmp/atlas-dist-*` i `/tmp/jest_*` swojego przebiegu',
      '(cudzych worktree i plików nie usuwaj — zgłoś koordynatorowi), sprawdź `df -h /` i `du -sh /home/user/* /tmp/* | sort -h | tail`, potem powtórz.',
    ].join('\n'),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const o = ocenaDysku(wolneBajty(process.argv[2] ?? '.'));
  if (!o.ok) { console.error(o.komunikat); process.exit(1); }
  console.log(`dysk: ${o.wolneGB.toFixed(1)} GB wolne (próg ${MIN_WOLNE_GB} GB)`);
}
