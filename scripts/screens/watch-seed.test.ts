/*
 * Zapis migawek zegarka w języku zrzutu (A7, 27.10.2026). Uruchamiane tylko jawnie, poza zwykłym `jest`:
 *   WATCH_SEED_OUT=<katalog> npx jest --testMatch "**\/scripts/screens/watch-seed.test.ts"
 * Wynik: <katalog>/<język>-<stan>.json (scripts/ci/watch-screenshots.sh czyta je zamiast polskich plików wzorcowych). Logika: scripts/screens/watch-seed.ts.
 */
import * as fs from 'fs';
import * as path from 'path';
import { teardownWorld } from '../../tests/watch-world';
import { watchSnapshotsFor, watchShotLangs } from './watch-seed';

afterEach(teardownWorld);

test('migawki zegarka dla wszystkich języków', async () => {
  const out = process.env.WATCH_SEED_OUT; if (!out) throw new Error('Ustaw WATCH_SEED_OUT=<katalog>');
  fs.mkdirSync(out, { recursive: true });
  for (const lang of watchShotLangs()) {
    const snaps = await watchSnapshotsFor(lang);
    for (const [state, snap] of Object.entries(snaps)) fs.writeFileSync(path.join(out, `${lang}-${state}.json`), JSON.stringify(snap));
    teardownWorld();
  }
}, 600e3);
