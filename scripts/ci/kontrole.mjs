// Kontrole z `npm run verify` BEZ Jest i bez zapisu znacznika (ZB-029 T1, decyzja właściciela 31.10.2026): osobne zadanie `kontrole` w tests.yml,
// obok czterech części Jest (`node scripts/jest-ponow.mjs --shard=N/4`). JEDNO źródło listy: łańcuch `scripts.verify` z package.json —
// ten skrypt bierze z niego wszystkie kroki poza Jest (scripts/jest-ponow.mjs) i poza zapisem znacznika (scripts/verify-znacznik.mjs), więc nowa kontrola
// dopisana do verify trafia do CI sama, a nie przez drugą listę w YAML. Użycie: node scripts/ci/kontrole.mjs [--wypisz]
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jestGlowny } from '../modul-glowny.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
/** Kroki pomijane: Jest (idzie w częściach) i znacznik (zapis tylko po pełnym verify na maszynie, która go czyta). */
export const POMIJANE = [/jest-ponow\.mjs/, /verify-znacznik\.mjs/];
/** Kroki łańcucha verify (rozdzielane " && ") bez pomijanych. */
export function krokiKontroli(verify) {
  return verify.split(/\s+&&\s+/).map(s => s.trim()).filter(Boolean).filter(k => !POMIJANE.some(re => re.test(k)));
}

export function main(args) {
  const verify = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).scripts.verify;
  const kroki = krokiKontroli(verify);
  if (args.includes('--wypisz')) { console.log(kroki.join('\n')); return 0; }
  for (const k of kroki) {
    console.log(`\n>>> ${k}`);
    const r = spawnSync('sh', ['-c', k], { cwd: ROOT, stdio: 'inherit' });
    if (r.status !== 0) { console.error(`kontrole: krok „${k}” zakończony kodem ${r.status ?? 'sygnał ' + r.signal}`); return r.status || 1; }
  }
  return 0;
}

if (jestGlowny(import.meta.url)) process.exit(main(process.argv.slice(2)));
