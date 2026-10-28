#!/usr/bin/env node
// Uruchamia generator rodziny RUCHU DYNAMICZNEGO po stronie agenta (wersja 1.1, 26.10.2026; olympic, plyo, kb_ballistic, sled_throw, strongman). Różnice względem run.mjs: podgląd pokazuje KAŻDĄ klatkę kluczową (lot, przechwyt, wymach mają po 6–12 klatek) w jednym wierszu, jedna przeglądarka na partię, pomiar pierwszego przebiegu, wyjątki z powodem poza walidacją.
// (bazowo: pilotaż 26.10.2026): generuje pozy z modelu, waliduje (geometria + reguły sensu), zapisuje raport, podglądy PNG i manifest dla recenzenta,
// opcjonalnie nakłada przechodzące pozy (lib/figures/v2/poses/<rodzina>.json). Pomiar: każdy przebieg dopisuje wiersz do --log (iteracja generatora, odsetek zaliczonych).
// Użycie: node scripts/figures/agent-pozy/run-dyn.mjs --rodzina pushup_plank --wyjscie <katalog> [--podglad] [--zastosuj] [--log <plik.jsonl>] [--tylko "A;B"]
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { waliduj, podgladPartia, klatkiPodgladu, zastosuj, bledyCwiczenia } from '../v2-validate.mjs';
import { zgodnoscManifestu, wczytajTeksty } from '../v2-jakosc.mjs';
import { opisCwiczenia, silnikCatalog } from '../gemini-polecenia.mjs';
import { regulyDla } from '../v2-sens.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i >= 0 ? process.argv[i + 1] : d; };
const flag = (n) => process.argv.includes('--' + n);

async function main() {
  const rodzina = arg('rodzina'); if (!rodzina) throw new Error('wymagane: --rodzina');
  const wyjscie = resolve(arg('wyjscie', join(ROOT, 'podglad-agent'))); const logPlik = arg('log'); const tylko = arg('tylko')?.split(';').map((x) => x.trim()).filter(Boolean);
  const mod = await import(pathToFileURL(join(dirname(fileURLToPath(import.meta.url)), `${rodzina}.mjs`)).href);
  const gen = mod.generuj(); const wyniki = {}; const poze = {}; const t0 = Date.now();
  for (const [cw, f] of Object.entries(gen)) {
    if (tylko && !tylko.includes(cw)) continue;
    if (mod.WYJATKI?.[cw]) { console.log(`  WYJĄTEK ${cw}: ${mod.WYJATKI[cw].slice(0, 160)}`); continue; } /* jawny wyjątek z powodem (manifest.wyjatki), nie liczy się jako porażka */
    let poza = null; try { poza = f(); } catch (e) { wyniki[cw] = { ok: false, bledy: [{ kod: 'generator', szczegol: e.message }] }; continue; }
    const v = waliduj(poza, { rodzina, cwiczenie: cw });
    if (process.env.POZY_TEKSTY_BLEDOW === 'wszystkie') { v.bledy = v.bledy.filter((b) => !/^etykieta_bledu/.test(b.szczegol)); v.ok = v.bledy.length === 0; } /* tryb próbny: geometria i sens błędów bez tekstów wskazówek (teksty wdroży tłumacz) */ wyniki[cw] = v; if (v.ok || process.env.POZY_PODGLAD_NIEZALICZONE) poze[cw] = poza; /* zmienna tylko do diagnostyki podglądu (nie z --zastosuj) */
  }
  const n = Object.keys(wyniki).length; const ok = Object.keys(poze);
  const dir = join(wyjscie, rodzina); mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'raport.json'), JSON.stringify({ rodzina, przeszly: ok, nie: Object.fromEntries(Object.entries(wyniki).filter(([, v]) => !v.ok).map(([k, v]) => [k, v.bledy])) }, null, 1) + '\n');
  writeFileSync(join(dir, 'poze.json'), JSON.stringify({ rodzina, poze }) + '\n');
  if (logPlik) { let iter = 1; if (existsSync(logPlik)) iter = readFileSync(logPlik, 'utf8').split('\n').filter((l) => { try { return JSON.parse(l).rodzina === rodzina && !JSON.parse(l).czesciowy; } catch { return false; } }).length + 1;
    appendFileSync(logPlik, JSON.stringify({ t: new Date().toISOString(), rodzina, iteracja: tylko ? null : iter, czesciowy: !!tylko, wszystkich: n, przeszlo: ok.length, nie: Object.entries(wyniki).filter(([, v]) => !v.ok).map(([k, v]) => ({ cw: k, kod: v.bledy[0]?.kod, szczegol: v.bledy[0]?.szczegol?.slice(0, 140) })) }) + '\n'); }
  { /* pomiar: wynik PIERWSZEGO wygenerowania każdego ćwiczenia (zapisywany raz, nie nadpisywany) → <wyjscie>/pierwsze.json */
    const pf = join(wyjscie, 'pierwsze.json'); let pw = {}; try { pw = JSON.parse(readFileSync(pf, 'utf8')); } catch { /* brak pliku: pierwszy przebieg */ }
    pw[rodzina] = pw[rodzina] ?? {}; for (const [cw, v] of Object.entries(wyniki)) if (!(cw in pw[rodzina])) pw[rodzina][cw] = !!v.ok; writeFileSync(pf, JSON.stringify(pw, null, 1) + '\n'); }
  console.log(`${rodzina}: ${ok.length}/${n} przechodzi (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  for (const [cw, v] of Object.entries(wyniki)) { if (v.ok) console.log(`  OK  ${cw}`); else { console.log(`  NIE ${cw}`); for (const b of v.bledy.slice(0, 10)) console.log(`      [${b.kod}] ${b.szczegol.slice(0, 230)}`); } }
  if (flag('podglad')) {
    const catalog = silnikCatalog(); const manifest = { rodzina, wygenerowano: new Date().toISOString(), wyjatki: mod.WYJATKI ?? {}, przyblizenia: mod.PRZYBLIZENIA ?? {}, bledy_pominiete: mod.POMINIETE_BLEDY ?? {}, pytania_recenzenta: 'patrz docs/53 (bramka 4)', cwiczenia: [] };
    let obrazy = {}; try { obrazy = await podgladPartia(poze, dir, 'light'); } catch (e) { console.log(`podglądy: ${e.message}`); }
    for (const [cw, poza] of Object.entries(poze)) {
      const png = obrazy[cw]?.plik ?? null;
      const op = opisCwiczenia(cw, { root: ROOT, bledyCwiczenia, catalog, rodzina });
      manifest.cwiczenia.push({ cwiczenie: cw, obraz: png ? png.split('/').pop() : null, sprzet: poza.sprzet, klatki_u: klatkiPodgladu(poza), klatki_na_obrazie: obrazy[cw]?.klatki, bledy_w_pozie: poza.bledy.map((b) => b.cue), bledy_wskazowki_id: bledyCwiczenia(cw, ROOT), opis: { sens: op.sens, ruch: op.ruch, bledy_wskazowki: op.bledy }, reguly_sensu: regulyDla(rodzina, cw, ROOT).map((r) => r.id), przyblizenie: mod.PRZYBLIZENIA?.[cw] ?? null });
    }
    if (tylko) { const pod = (o) => Object.fromEntries(Object.entries(o ?? {}).filter(([k]) => tylko.includes(k))); manifest.wyjatki = pod(manifest.wyjatki); manifest.przyblizenia = pod(manifest.przyblizenia); }
    manifest.wyjatki_opisu = mod.WYJATKI_OPISU ?? {}; const uwagi = [...zgodnoscManifestu(manifest, wczytajTeksty(ROOT), manifest.wyjatki_opisu), ...Object.entries(obrazy).flatMap(([cw, o]) => o.uwagi.map((szczegol) => ({ regula: 'manifest_klatki', szczegol: `${cw}: ${szczegol}` })))]; manifest.zgodnosc_manifestu = uwagi;
    if (uwagi.length) { console.log('NIEZGODNOŚĆ MANIFESTU Z OBRAZEM:'); for (const u of uwagi) console.log(`  [${u.regula}] ${u.szczegol}`); process.exitCode = 1; }
    writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest, null, 1) + '\n'); console.log(`podglądy + manifest: ${dir}`);
  }
  if (flag('zastosuj') && ok.length) { const r = zastosuj(ROOT, { rodzina, poze }); console.log(`nałożono: ${r.zapisano.length} → ${r.plik}${r.odrzucone.length ? `; odrzucone: ${r.odrzucone.map((x) => x.cwiczenie).join(', ')}` : ''}`); }
}
main().catch((e) => { console.error(e.stack); process.exit(1); });
