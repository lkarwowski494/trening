// Wspólny strażnik „skrypt uruchomiony bezpośrednio” (07-jakosc-002, 12.11.2026, KO-058 A).
// Node podaje w adresie modułu ścieżkę realną, a pierwszy argument procesu bywa przez dowiązanie (macOS: os.tmpdir() = /var → /private/var),
// więc porównanie ścieżek nierozwiązanych daje fałsz i skrypt kończy się cicho kodem 0. Tu porównujemy ścieżki realne obu stron.
// Pilnuje tests/modul-glowny-symlink.test.ts (żaden skrypt nie porównuje adresu modułu z argumentem procesu bez tej funkcji).
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** @param {string} importMetaUrl adres modułu wołającego (import.meta.url); @param {string|undefined} argv1 ścieżka skryptu z wiersza poleceń (domyślnie pierwszy argument procesu) */
export function jestGlowny(importMetaUrl, argv1 = process.argv[1]) {
  if (!argv1) return false;
  try { return realpathSync(argv1) === realpathSync(fileURLToPath(importMetaUrl)); } catch { return false; }
}
