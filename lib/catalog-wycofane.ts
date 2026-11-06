/**
 * Ćwiczenia wycofane z biblioteki po wydaniu katalogu (poza krokiem 09.10.2026 z docs/research/equipment/catalog-step-2026-10-09.json).
 * Decyzja właściciela 02.11.2026 (docs/18, `[usuwa]`): „Wide-Grip Pulldown Behind The Neck” — ukryte w aplikacji (źródło szczebla 4 odradza wariant;
 * bez własnego ostrzeżenia). Nie wchodzi do LIB, LIB_KEYS ani do nowego stanu; u istniejących użytkowników obsługuje je `retireCatalog`
 * (lib/state/migrate-catalog.ts): użyte w treningu albo szablonie zostaje jako ćwiczenie własne, nieużyte znika — historia i szablony bez zmian.
 * Dane katalogu (docs/research/equipment/catalog.json) i rysunki rodziny zostają, żeby nie unieważniać recenzji rodziny ściągania (skrót póz).
 * Test: tests/wide-grip-pulldown-behind-neck-2026-11-02.test.ts.
 */
export const LIB_WYCOFANE: readonly string[] = ['Wide-Grip Pulldown Behind The Neck'];
