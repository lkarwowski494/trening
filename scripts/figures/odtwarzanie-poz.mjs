#!/usr/bin/env node
// Odtwarzalność póz (zasada: generator rodziny odtwarza dokładnie zatwierdzony plik póz lib/figures/v2/poses/<rodzina>.json).
// Dla każdej rodziny z generatorem (scripts/figures/agent-pozy/<rodzina>.mjs) uruchamia generuj(), porównuje wynik z plikiem i zwraca rozbieżności:
// ćwiczenie → powód (różne klatki / różne błędy lub sprzęt / pozy NIEWAŻNEJ / w pliku, brak w generatorze / brak w pliku).
// Użycie: node scripts/figures/odtwarzanie-poz.mjs [rodzina …]  → JSON { rodzina: { ćwiczenie: powód } } (puste = zgodne); kod 1, gdy jest jakakolwiek rozbieżność.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { waliduj } from './v2-validate.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const DIR = join(ROOT, 'scripts/figures/agent-pozy');

export async function rozjazdy(rodziny = []) {
  const wynik = {};
  for (const f of readdirSync(join(ROOT, 'lib/figures/v2/poses')).sort()) {
    const r = f.replace('.json', ''); if (rodziny.length && !rodziny.includes(r)) continue;
    const gp = join(DIR, `${r}.mjs`); if (!existsSync(gp)) continue; /* rodzina bez generatora (pozy ręczne) — poza zakresem */
    const mod = await import(pathToFileURL(gp).href); if (typeof mod.generuj !== 'function') continue;
    const gen = mod.generuj(); const plik = JSON.parse(readFileSync(join(ROOT, 'lib/figures/v2/poses', f), 'utf8')); const roz = {};
    for (const [cw, fn] of Object.entries(gen)) {
      if (mod.WYJATKI?.[cw]) { if (cw in plik.cwiczenia) roz[cw] = 'wyjątek generatora, a plik ma pozę'; continue; }
      let p; try { p = fn(); } catch (e) { roz[cw] = `generator zgłasza błąd: ${e.message.slice(0, 80)}`; continue; }
      const w = plik.cwiczenia[cw]; if (!w) { roz[cw] = 'brak w pliku póz'; continue; }
      const v = waliduj(p, { rodzina: r, cwiczenie: cw });
      if (JSON.stringify(JSON.parse(JSON.stringify(p))) !== JSON.stringify(w)) roz[cw] = `${v.ok ? '' : 'poza NIEWAŻNA; '}${JSON.stringify(p.klatki) === JSON.stringify(w.klatki) ? 'różne błędy lub sprzęt' : 'różne klatki'} (błędów: generator ${p.bledy.length}, plik ${(w.bledy ?? []).length})`;
      else if (!v.ok) roz[cw] = 'identyczna z plikiem, ale NIEWAŻNA';
    }
    for (const cw of Object.keys(plik.cwiczenia)) if (!(cw in gen)) roz[cw] = 'w pliku póz, brak w generatorze';
    wynik[r] = roz;
  }
  return wynik;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const w = await rozjazdy(process.argv.slice(2)); const zle = Object.entries(w).filter(([, v]) => Object.keys(v).length);
  console.log(JSON.stringify(w, null, 1)); process.exit(zle.length ? 1 : 0);
}
