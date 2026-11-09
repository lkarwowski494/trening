/**
 * Pisownia marki — JEDNO miejsce źródłowe (decyzja właściciela 09.11.2026, docs/18 „nowa nazwa aplikacji od wersji 1.1”; ZB-056).
 * Zmiana wielkości liter (np. „RepsGOAT”) = zmiana tej jednej linii + `node scripts/marka.mjs --write` (pliki, których nie importuje kod:
 * locales/*.json, app.json, store/*.json, strony site/, zgody Zdrowia) oraz UPDATE_WATCH_APPLE=1 / UPDATE_WIDGET=1 dla InfoPlist zegarka i widżetu.
 * Marka nie jest tłumaczona: ta sama we wszystkich językach aplikacji i lokalizacjach sklepu.
 */
export const BRAND_NAME = 'RepsGoat';
/** Limit pola Name w App Store Connect (znaki). */
export const APP_STORE_NAME_MAX = 30;
