#!/usr/bin/env node
// Sprzątanie gałęzi zdalnych (decyzja właściciela 21.10.2026, docs/18). Uruchamia workflow `sprzatanie-galezi.yml` (tylko ręcznie).
// Usuwa wyłącznie: gałęzie w całości zawarte w main ALBO wymienione w scripts/ci/sprzatanie-zatwierdzone.json (zgoda właściciela z datą).
// Nigdy: main, gałęzie chronione (wzorce niżej), gałęzie z otwartym PR. Domyślnie tylko podgląd; usuwa przy --usun.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const CHRONIONE = [/^main$/, /^redesign\//, /^widocznosc\//, /^m3-wejscie\//, /^f020-garmin$/, /^f020-sklep$/, /^gh-pages$/];

/** Plan: { usun: string[], zostaw: {galaz, powod}[] } — czysta funkcja (testy). */
export function plan({ galezie, scalone, otwartePR, zatwierdzone }) {
  const usun = []; const zostaw = [];
  for (const g of [...new Set(galezie)].sort()) {
    if (CHRONIONE.some((r) => r.test(g))) zostaw.push({ galaz: g, powod: 'chroniona' });
    else if (otwartePR.has(g)) zostaw.push({ galaz: g, powod: 'otwarty PR' });
    else if (scalone.has(g)) usun.push(g);
    else if (zatwierdzone.has(g)) usun.push(g);
    else zostaw.push({ galaz: g, powod: 'nie scalona i bez zgody' });
  }
  return { usun, zostaw };
}

const sh = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', maxBuffer: 1 << 26 }).trim();

function main() {
  const usunNaprawde = process.argv.includes('--usun');
  sh('git', ['fetch', '--prune', 'origin']);
  const galezie = sh('git', ['for-each-ref', '--format=%(refname:strip=3)', 'refs/remotes/origin']).split('\n').filter((g) => g && g !== 'HEAD');
  const scalone = new Set(galezie.filter((g) => { try { execFileSync('git', ['merge-base', '--is-ancestor', `origin/${g}`, 'origin/main']); return true; } catch { return false; } }));
  const otwartePR = new Set(JSON.parse(sh('gh', ['pr', 'list', '--state', 'open', '--limit', '200', '--json', 'headRefName'])).map((p) => p.headRefName));
  const zatwierdzone = new Set(JSON.parse(readFileSync(new URL('./sprzatanie-zatwierdzone.json', import.meta.url), 'utf8')).galezie.map((z) => z.galaz));
  const p = plan({ galezie, scalone, otwartePR, zatwierdzone });
  console.log(`Do usunięcia (${p.usun.length}):\n${p.usun.map((g) => `- ${g}`).join('\n')}`);
  console.log(`Zostają (${p.zostaw.length}):\n${p.zostaw.map((z) => `- ${z.galaz} — ${z.powod}`).join('\n')}`);
  if (!usunNaprawde) { console.log('\nTryb podglądu: nic nie usunięto (uruchom z „usun”).'); return; }
  for (const g of p.usun) { sh('git', ['push', 'origin', '--delete', g]); console.log(`usunięto: ${g}`); }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
