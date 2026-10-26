#!/usr/bin/env node
// Uruchamia generator rodziny po stronie agenta (pilotaż 26.10.2026): generuje pozy z modelu, waliduje (geometria + reguły sensu), zapisuje raport, podglądy PNG i manifest dla recenzenta,
// opcjonalnie nakłada przechodzące pozy (lib/figures/v2/poses/<rodzina>.json). Pomiar: każdy przebieg dopisuje wiersz do --log (iteracja generatora, odsetek zaliczonych).
// Użycie: node scripts/figures/agent-pozy/run.mjs --rodzina pushup_plank --wyjscie <katalog> [--podglad] [--zastosuj] [--log <plik.jsonl>] [--tylko "A;B"]
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { waliduj, podglad, htmlPodgladu, zastosuj, bledyCwiczenia } from '../v2-validate.mjs';
import { zgodnoscManifestu, wczytajTeksty, tabelaKatow, tabelaKatowMd, podgladWazny } from '../v2-jakosc.mjs';
import { v2 as silnikV2 } from './model.mjs';
import { opisCwiczenia, silnikCatalog } from '../gemini-polecenia.mjs';
import { regulyDla, bledyBezAnimacji } from '../v2-sens.mjs';
import { silnik } from './model.mjs';
import { createRequire } from 'node:module';
import * as gora from './gora.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i >= 0 ? process.argv[i + 1] : d; };
const flag = (n) => process.argv.includes('--' + n);

/** Podglądy partii póz jedną przeglądarką (zamiast osobnej na każde ćwiczenie): HTML jak w v2-validate → podglad(), zrzut PNG; zwraca { ćwiczenie: ścieżka PNG }. */
async function podgladPartia(poze, dir, motyw = 'light') {
  const { v2, tokens } = silnik(); const pal = v2.figurePalette(tokens[motyw]); const wynik = {}; mkdirSync(dir, { recursive: true });
  let chromium = null; try { chromium = createRequire(import.meta.url)('playwright').chromium; } catch { /* bez przeglądarki: tylko HTML */ }
  const browser = chromium ? await chromium.launch() : null; const page = browser ? await browser.newPage({ viewport: { width: 1400, height: 700 } }) : null;
  for (const [cw, poza] of Object.entries(poze)) {
    const us = [0, 0.5, 1]; const widoki = ['side', 'front']; const warianty = [undefined, ...poza.bledy.map((_, i) => i)];
    const wiersze = warianty.map((w) => { const komorki = widoki.flatMap((view) => { const listy = []; for (const x of warianty) for (let i = 0; i <= 20; i++) listy.push(v2.dataShapes(poza, i / 20, view, x)); const box = v2.boundsOf(listy); return us.map((u) => v2.svgDocument(v2.dataShapes(poza, u, view, w), box, pal, 1.5)); });
      return `<div style="font:12px sans-serif;color:${tokens[motyw].text};margin:6px 0 2px">${w === undefined ? 'poza poprawna' : 'błąd: ' + poza.bledy[w].cue}</div><div style="display:flex;gap:8px;flex-wrap:wrap">${komorki.join('')}</div>`; });
    const html = `<html><body style="margin:0;padding:8px;background:${tokens[motyw].surface}">${wiersze.join('')}</body></html>`; const nazwa = join(dir, `${poza.cwiczenie.replace(/\W+/g, '-')}-${motyw}`);
    writeFileSync(nazwa + '.html', html);
    if (page) { await page.setContent(html); await page.screenshot({ path: nazwa + '.png', fullPage: true }); wynik[cw] = nazwa + '.png'; } else wynik[cw] = nazwa + '.html';
  }
  if (browser) await browser.close(); return wynik;
}

async function main() {
  const rodzina = arg('rodzina'); if (!rodzina) throw new Error('wymagane: --rodzina');
  const wyjscie = resolve(arg('wyjscie', join(ROOT, 'podglad-agent'))); const logPlik = arg('log'); const tylko = arg('tylko')?.split(';').map((x) => x.trim()).filter(Boolean);
  const mod = await import(pathToFileURL(join(dirname(fileURLToPath(import.meta.url)), `${rodzina}.mjs`)).href);
  const gen = mod.generuj(); const wyniki = {}; const poze = {}; const t0 = Date.now();
  for (const [cw, f] of Object.entries(gen)) {
    if (tylko && !tylko.includes(cw)) continue;
    if (mod.WYJATKI?.[cw]) { console.log(`  WYJĄTEK ${cw}: ${mod.WYJATKI[cw].slice(0, 160)}`); continue; } /* jawny wyjątek z powodem (manifest.wyjatki), nie liczy się jako porażka */
    let poza = null; try { poza = f(); } catch (e) { wyniki[cw] = { ok: false, bledy: [{ kod: 'generator', szczegol: e.message }] }; continue; }
    const v = waliduj(poza, { rodzina, cwiczenie: cw }); wyniki[cw] = v; if (v.ok) poze[cw] = poza;
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
  for (const [cw, v] of Object.entries(wyniki)) { if (v.ok) console.log(`  OK  ${cw}`); else { console.log(`  NIE ${cw}`); for (const b of v.bledy.slice(0, 4)) console.log(`      [${b.kod}] ${b.szczegol.slice(0, 230)}`); } }
  if (flag('podglad')) {
    const catalog = silnikCatalog(); const manifest = { rodzina, wygenerowano: new Date().toISOString(), wyjatki: mod.WYJATKI ?? {}, przyblizenia: mod.PRZYBLIZENIA ?? {}, bledy_pominiete: gora.POMINIETE_BLEDY, pytania_recenzenta: 'patrz docs/53 (bramka 4)', cwiczenia: [] };
    let obrazy = {}; try { obrazy = await podgladPartia(poze, dir, 'light'); } catch (e) { console.log(`podglądy: ${e.message}`); }
    for (const [cw, poza] of Object.entries(poze)) {
      const png = obrazy[cw] ?? null;
      const op = opisCwiczenia(cw, { root: ROOT, bledyCwiczenia, catalog, rodzina });
      const bez = bledyBezAnimacji(rodzina, ROOT);
      manifest.cwiczenia.push({ cwiczenie: cw, obraz: png ? png.split('/').pop() : null, sprzet: poza.sprzet, klatki_u: poza.klatki.map((k) => k.u), klatki_na_obrazie: htmlPodgladu(poza, 'light').klatki, katy_stawow: tabelaKatow(silnikV2(), poza), bledy_w_pozie: poza.bledy.map((b) => b.cue), bledy_wskazowki_id: bledyCwiczenia(cw, ROOT).filter((id) => !(id in bez)), opis: { sens: op.sens, ruch: op.ruch, bledy_wskazowki: op.bledy }, reguly_sensu: regulyDla(rodzina, cw, ROOT).map((r) => r.id), przyblizenie: mod.PRZYBLIZENIA?.[cw] ?? null });
    }
    if (tylko) { const tylkoPodzbior = (o) => Object.fromEntries(Object.entries(o ?? {}).filter(([k]) => tylko.includes(k))); manifest.wyjatki = tylkoPodzbior(manifest.wyjatki); manifest.przyblizenia = tylkoPodzbior(manifest.przyblizenia); } /* przebieg częściowy: manifest dotyczy tylko wybranych ćwiczeń */
    manifest.wyjatki_opisu = mod.WYJATKI_OPISU ?? {}; const uwagi = zgodnoscManifestu(manifest, wczytajTeksty(ROOT), manifest.wyjatki_opisu); manifest.zgodnosc_manifestu = uwagi;
    writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest, null, 1) + '\n'); console.log(`podglądy + manifest: ${dir}`);
    writeFileSync(join(dir, 'katy-stawow.md'), `# Kąty stawów (min…max w całym ruchu, obie strony; silnik v2)\n\n` + tabelaKatowMd(manifest.cwiczenia.map((c) => ({ cwiczenie: c.cwiczenie, katy: c.katy_stawow }))));
    if (uwagi.length) { console.log('NIEZGODNOŚĆ MANIFESTU Z OBRAZEM:'); for (const u of uwagi) console.log(`  [${u.regula}] ${u.szczegol}`); }
    /* P1: znacznik ważności podglądu dla recenzji (mechanizm, nie notatka): bez wyniku kontroli manifestu i tabeli kątów podgląd jest NIEWAŻNY */
    const niewazny = podgladWazny(manifest); for (const f of ['PODGLAD-WAZNY.txt', 'PODGLAD-NIEWAZNY.txt']) rmSync(join(dir, f), { force: true });
    if (niewazny.length) { writeFileSync(join(dir, 'PODGLAD-NIEWAZNY.txt'), 'Podgląd NIE trafia do recenzji:\n' + niewazny.map((x) => `- ${x}`).join('\n') + '\n'); console.log('PODGLĄD NIEWAŻNY DLA RECENZJI:'); for (const x of niewazny) console.log(`  - ${x}`); process.exitCode = 1; }
    else writeFileSync(join(dir, 'PODGLAD-WAZNY.txt'), `Kontrola manifestu (zgodnosc_manifestu) wykonana, bez niezgodności; tabela kątów stawów w manifest.json i katy-stawow.md.\n`);
  }
  if (flag('zastosuj') && ok.length) { const r = zastosuj(ROOT, { rodzina, poze }); const plik = join(ROOT, r.plik); const dane = JSON.parse(readFileSync(plik, 'utf8')); const usuniete = Object.keys(mod.WYJATKI ?? {}).filter((k) => k in dane.cwiczenia); for (const k of usuniete) delete dane.cwiczenia[k]; if (usuniete.length) { writeFileSync(plik, JSON.stringify(dane, null, 1) + '\n'); console.log(`usunięto z danych ćwiczenia z wyjątkiem: ${usuniete.join(', ')}`); } console.log(`nałożono: ${r.zapisano.length} → ${r.plik}${r.odrzucone.length ? `; odrzucone: ${r.odrzucone.map((x) => x.cwiczenie).join(', ')}` : ''}`); }
}
main().catch((e) => { console.error(e.stack); process.exit(1); });
