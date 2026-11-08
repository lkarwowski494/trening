/*
 * ZB-044 W-1 (08.11.2026, recenzja audytora; decyzja koordynatora w nocy 08/09.11 do weta właściciela, docs/18): ćwiczenie z biblioteki PRZEMIANOWANE przez użytkownika — zapisana nazwa różni się od
 * wszystkich nazw katalogowych tego ćwiczenia: klucza katalogu, nazwy ogólnej (LIB_DISPLAY_NAME), dawnych kluczy, nazwy EN i dawnych nazw EN. Bez migracji (e.name i `lib` zostają).
 * Bez prawidłowego klucza: nazwa spoza katalogu = przemianowane (na korzyść danych: nazwa użytkownika nigdy nie znika).
 * Moduł bez zależności: katalog żyje w lib/seed.ts, który rejestruje regułę (seed importuje i18n, i18n nie może importować seed — strażnik cykli M1-054).
 */
type Rule = (e: { name: string; libKey?: string }) => boolean;
let rule: Rule | null = null;
export function setRenamedCheck(f: Rule) { rule = f; }
/** Czy ćwiczenie z biblioteki ma nazwę nadaną przez użytkownika (wtedy pokazujemy ją jak nazwę ćwiczenia własnego). */
export function exRenamed(e: { name: string; lib?: boolean; libKey?: string } | undefined | null): boolean { return !!e && !!e.lib && !!rule && rule(e); }
