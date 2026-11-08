/**
 * Nazwy lokalne ćwiczeń biblioteki (ZB-044, decyzja właściciela 07.11.2026 i 08.11.2026): klucz katalogu → nazwa w języku interfejsu, pokazywana TYLKO na karcie
 * ćwiczenia pod nazwą angielską (wariant A „Podpis”) i używana w wyszukiwaniu. Źródło: wyłącznie lista nazw PO RECENZJI (ta sama co dla strony z ćwiczeniami);
 * nazw z dawnego katalogu PL (angielska z dopiskiem, np. „Bench Press (sztanga)”) nie wolno tu przepisywać bez recenzji. Dziś lista nie istnieje — mapy puste,
 * karta pokazuje samą nazwę angielską we wszystkich językach. Gdy lista powstanie: wpisy `{ [język]: { [klucz katalogu]: nazwa } }` (test pilnuje kluczy i języków).
 */
export const NAZWY_LOKALNE: Readonly<Record<string, Readonly<Record<string, string>>>> = {};
