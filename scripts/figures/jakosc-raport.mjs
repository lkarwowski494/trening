#!/usr/bin/env node
// Raport: ile naruszeń reguł jakości (v2-jakosc.mjs) łapią pozy z danych (lib/figures/v2/poses/*.json) i gotowe figury z rigów (squat, bench_press, hinge przez exampleFor).
// Użycie: node scripts/figures/jakosc-raport.mjs [--json] [--styk-wszystkie: R17/R17b także poza STYK_RODZINY] [--root <katalog repozytorium z poses/ — np. worktree innej gałęzi; reguły i silnik zawsze z tego repozytorium>]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadV2 } from './v2-build.mjs';
import { sprawdzJakosc, wczytajTeksty, REGULY_JAKOSCI, GRUPY_POSTAWY } from './v2-jakosc.mjs';
import { grupaBledu, izometryczne, regulyDla } from './v2-sens.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export function raport(root = ROOT) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jakosc-')); process.on('exit', () => { try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* best effort */ } });
  const { v2, catalog } = loadV2(dir); const teksty = wczytajTeksty(root); const wynik = [];
  const oceń = (zrodlo, rodzina, cw, poza) => { const postural = new Set((poza.bledy ?? []).map((b) => b.cue).filter((c) => { const g = grupaBledu(rodzina, c, root); return g && GRUPY_POSTAWY.includes(g); }));
    let n = []; try { n = sprawdzJakosc(poza, { v2, rodzina, cwiczenie: cw, postural, izometryczne: izometryczne(rodzina, cw, root), teksty, reguly: regulyDla(rodzina, cw, root), root, stykWszystkie: process.argv.includes('--styk-wszystkie'), zRigu: zrodlo === 'rig' }); } catch (e) { n = [{ regula: 'wyjatek', szczegol: e.message }]; }
    wynik.push({ zrodlo, rodzina, cwiczenie: cw, naruszenia: n.map((x) => x.regula) }); };
  const pd = path.join(root, 'lib/figures/v2/poses');
  for (const f of fs.existsSync(pd) ? fs.readdirSync(pd) : []) { const d = JSON.parse(fs.readFileSync(path.join(pd, f), 'utf8')); for (const [cw, poza] of Object.entries(d.cwiczenia ?? {})) oceń('dane', d.rodzina, cw, poza); }
  for (const cw of Object.keys(catalog.CATALOG)) { const spec = v2.figureSpec(cw); if (!spec) continue; const poza = v2.exampleFor(cw); if (poza) oceń('rig', spec.family, cw, poza); }
  return wynik;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const rootArg = process.argv.indexOf('--root'); const w = raport(rootArg > 0 ? path.resolve(process.argv[rootArg + 1]) : ROOT); const per = {}; for (const x of w) for (const r of new Set(x.naruszenia)) { per[x.zrodlo + '/' + x.rodzina] ??= {}; per[x.zrodlo + '/' + x.rodzina][r] = (per[x.zrodlo + '/' + x.rodzina][r] ?? 0) + 1; }
  if (process.argv.includes('--json')) console.log(JSON.stringify(w, null, 1));
  else { console.log(`póz ocenionych: ${w.length} (dane ${w.filter((x) => x.zrodlo === 'dane').length}, rigi ${w.filter((x) => x.zrodlo === 'rig').length}); z naruszeniem jakości: ${w.filter((x) => x.naruszenia.length).length}`);
    for (const r of REGULY_JAKOSCI) { const lista = w.filter((x) => x.naruszenia.includes(r)); console.log(`  ${r}: ${lista.length}${lista.length ? ' — ' + lista.slice(0, 6).map((x) => x.cwiczenie).join(', ') + (lista.length > 6 ? '…' : '') : ''}`); } }
}
