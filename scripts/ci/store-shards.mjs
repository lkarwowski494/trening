#!/usr/bin/env node
// Podział zrzutów do App Store na równoległe zadania macOS (store-screenshots.yml, 27.10.2026; decyzja właściciela: wszystkie 35 języków, wariant A).
// Pomiar z 27.10.2026 (run 40464544722): ok. 2,7 min na ekran → 10 ekranów × 35 języków ≈ 16 h na rozmiar w jednym zadaniu (limit zadania 180 min ucinał przebieg po ok. 6 językach).
// Wejście: języki ("all" = z plików routes-<język>.json w katalogu danych albo lista po przecinku), rozmiary ("6.9,6.3"), liczba zadań na rozmiar.
// Wyjście (stdout): JSON macierzy GitHub Actions {"include":[{rozmiar, wzorzec, shard, jezyki}]}. Języki dzielone kolejno na zadania o prawie równej liczbie.
// Użycie: node scripts/ci/store-shards.mjs <języki|all> <rozmiary> <zadan> <katalog_danych>
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** Rozmiary iPhone: wzorzec nazwy symulatora (docs/48 pkt 5). */
export const SIZES = { '6.9': 'iPhone 17 Pro Max \\(', '6.3': 'iPhone 17 Pro \\(' };
/** Zmierzony czas na ekran w minutach (run 40464544722, 27.10.2026) — jedyne miejsce tej liczby; plan zadań i test limitu czasu liczą z niej, a przebieg zapisuje nowy pomiar (store-screenshots.sh → podsumowanie). */
export const PER_SCREEN_MIN = 2.7;
/** Maksymalna liczba zadań na rozmiar (macOS w repo publicznym: do 5 równoległych zadań naraz). */
export const MAX_SHARDS = 5;

export function languagesFrom(spec, dir, ls = readdirSync) {
  if (spec.trim() === 'all') {
    return ls(dir).map(f => /^routes-(.+)\.json$/.exec(f)?.[1]).filter(Boolean).sort();
  }
  const list = spec.split(',').map(s => s.trim()).filter(Boolean);
  return [...new Set(list)];
}

export function split(list, n) {
  const k = Math.max(1, Math.min(n, list.length)); const out = []; let from = 0;
  for (let i = 0; i < k; i++) { const size = Math.floor(list.length / k) + (i < list.length % k ? 1 : 0); out.push(list.slice(from, from + size)); from += size; }
  return out;
}

export function plan(langSpec, sizeSpec, shards, dir, ls) {
  const langs = languagesFrom(langSpec, dir, ls);
  if (!langs.length) throw new Error('brak języków do zrzutów');
  const sizes = sizeSpec.split(',').map(s => s.trim()).filter(Boolean);
  for (const s of sizes) if (!SIZES[s]) throw new Error(`nieznany rozmiar ${s} (dozwolone: ${Object.keys(SIZES).join(', ')})`);
  const n = Number(shards);
  if (!Number.isInteger(n) || n < 1 || n > MAX_SHARDS) throw new Error(`liczba zadań na rozmiar: 1–${MAX_SHARDS}`);
  const include = [];
  for (const rozmiar of sizes) split(langs, n).forEach((chunk, i) => include.push({ rozmiar, wzorzec: SIZES[rozmiar], shard: i + 1, jezyki: chunk.join(',') }));
  return { include };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [lang, sizes, shards, dir] = process.argv.slice(2);
  try { process.stdout.write(JSON.stringify(plan(lang ?? 'pl,en', sizes ?? '6.9', shards ?? '1', dir ?? 'sklep-dane'))); }
  catch (e) { console.error(`::error::${e.message}`); process.exit(1); }
}
