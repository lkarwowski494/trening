#!/usr/bin/env node
// Pokrycie regułami sensu ruchu (docs/53, bramka 3 i 5): dla każdego ćwiczenia katalogu — czy ma reguły sensu, jest OTWARTE (brak źródła ruchu), pominięte (sprzęt poza kontraktem) albo bez reguł.
// Osobno: GOTOWE FIGURY (rodziny squat, bench_press, hinge — silnik v2 zrobiony przed bramką): ćwiczenia z figurą, które NIE mają reguł sensu, oraz ile z nich ma wskazówki (kandydaci do reguł) i jakie.
// Użycie: node scripts/figures/pokrycie-sensu.mjs [--json]   (kod 0). Test: tests/figury-sens-pokrycie.test.ts.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadV2 } from './v2-build.mjs';
import { regulyDla, otwarteDla, pominiecie, wskazowkiCwiczenia } from './v2-sens.mjs';
import { SPRZET_OBSLUGIWANY } from './gemini-polecenia.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export function pokrycie(root = ROOT) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pokrycie-')); process.on('exit', () => { try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* best effort */ } });
  const { v2, catalog } = loadV2(dir);
  const wiersze = [];
  for (const cw of Object.keys(catalog.CATALOG)) {
    const rodzina = v2.familyOf(cw); const fam = v2.FAMILY[rodzina]; const e = catalog.CATALOG[cw];
    const sprzet = e.requires.some((g) => g.length && !g.some((c) => SPRZET_OBSLUGIWANY.includes(c)));
    const reguly = regulyDla(rodzina, cw, root).map((r) => r.id); const otw = otwarteDla(rodzina, cw, root); const wsk = wskazowkiCwiczenia(cw, root);
    const figura = fam.status === 'ready' && Object.prototype.hasOwnProperty.call(v2.VARIANTS, cw) && v2.VARIANTS[cw].family === rodzina;
    wiersze.push({ cwiczenie: cw, rodzina, gotowa_rodzina: fam.status === 'ready', figura, reguly, otwarte: otw, pomin: pominiecie(rodzina, cw, root), sprzet_poza_kontraktem: sprzet, wskazowki: wsk });
  }
  const rodziny = {};
  for (const w of wiersze) { const r = (rodziny[w.rodzina] ??= { cwiczen: 0, z_regulami: 0, otwarte: 0, sprzet_poza_kontraktem: 0, bez_regul: 0 }); r.cwiczen++;
    if (w.reguly.length) r.z_regulami++; else if (w.otwarte) r.otwarte++; else if (w.sprzet_poza_kontraktem) r.sprzet_poza_kontraktem++; else r.bez_regul++; }
  const gotoweBezRegul = wiersze.filter((w) => w.figura && !w.reguly.length);
  const kandydaci = gotoweBezRegul.filter((w) => w.wskazowki.length);
  const cues = {}; for (const w of kandydaci) for (const c of w.wskazowki) cues[c] = (cues[c] ?? 0) + 1;
  return { cwiczen: wiersze.length, rodziny, gotowe_figury: wiersze.filter((w) => w.figura).length, gotowe_bez_regul: gotoweBezRegul.map((w) => w.cwiczenie), gotowe_z_wskazowkami: kandydaci.length, gotowe_bez_wskazowek: gotoweBezRegul.length - kandydaci.length, wskazowki_gotowych: Object.fromEntries(Object.entries(cues).sort((a, b) => b[1] - a[1])) };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const p = pokrycie(); if (process.argv.includes('--json')) console.log(JSON.stringify(p, null, 1));
  else { console.log(`ćwiczeń: ${p.cwiczen}; gotowe figury: ${p.gotowe_figury}, w tym BEZ reguł sensu: ${p.gotowe_bez_regul.length} (z wskazówkami: ${p.gotowe_z_wskazowkami}, bez: ${p.gotowe_bez_wskazowek})`);
    for (const [r, x] of Object.entries(p.rodziny)) if (x.z_regulami || x.otwarte) console.log(`${r}: ${x.cwiczen} ćw., z regułami ${x.z_regulami}, otwarte ${x.otwarte}, sprzęt poza kontraktem ${x.sprzet_poza_kontraktem}, bez reguł ${x.bez_regul}`); }
}
