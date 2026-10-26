#!/usr/bin/env node
// Gotowe figury v2 (rodziny squat, bench_press, hinge — rigi z kodu) przepuszczone przez reguły sensu (docs/53): dla każdego ćwiczenia z figurą klatki u = 0…1 (siatka 0,05) → ewaluatory reguł rodziny.
// Wynik: lista naruszeń (ćwiczenie, reguła, komunikat z liczbami). Naruszenia naprawia się PARAMETRAMI figury (variants.ts / rig), nie luzowaniem progu reguły.
// Użycie: node scripts/figures/sens-gotowe.mjs [--json] [--rodzina squat]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadV2 } from './v2-build.mjs';
import { regulyDla, EWALUATORY } from './v2-sens.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export function naruszeniaGotowych(root = ROOT, tylkoRodzina = null) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gotowe-')); process.on('exit', () => { try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* best effort */ } });
  const { v2, catalog } = loadV2(dir); const wynik = [];
  for (const cw of Object.keys(catalog.CATALOG)) {
    const spec = v2.figureSpec(cw); if (!spec || (tylkoRodzina && spec.family !== tylkoRodzina) || fs.existsSync(path.join(root, 'lib/figures/v2/poses', `${spec.family}.json`))) continue; /* rodziny gotowe z DANYCH (poses/<rodzina>.json) przechodzą waliduj() w v2-validate.mjs, nie ten przegląd rigów */
    const reguly = regulyDla(spec.family, cw, root); const p = Array.from({ length: 21 }, (_, i) => i / 20).map((u) => ({ u, f: v2.frameAt(spec, u), kf: null }));
    const naruszenia = []; for (const r of reguly) { const opisy = EWALUATORY[r.typ]({ v2, d: { sprzet: spec.variant?.p?.oneArm || spec.variant?.p?.style === 'singleLeg' ? [{ rodzaj: 'sztanga', trzyma: 'R' }] : [] }, p, parametry: r.parametry }); if (opisy.length) naruszenia.push({ regula: r.id, typ: r.typ, opisy }); }
    wynik.push({ cwiczenie: cw, rodzina: spec.family, reguly: reguly.map((r) => r.id), naruszenia });
  }
  return wynik;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const i = process.argv.indexOf('--rodzina'); const w = naruszeniaGotowych(ROOT, i >= 0 ? process.argv[i + 1] : null);
  if (process.argv.includes('--json')) console.log(JSON.stringify(w, null, 1));
  else { const z = w.filter((x) => x.naruszenia.length); console.log(`figur: ${w.length}, z regułami: ${w.filter((x) => x.reguly.length).length}, z naruszeniami: ${z.length}`);
    for (const x of z) { console.log(`${x.rodzina} / ${x.cwiczenie}`); for (const n of x.naruszenia) for (const o of n.opisy) console.log(`   [${n.regula}] ${o}`); } }
}
