/*
 * Nazwy źródeł wiedzy dla strażnika tests/zrodla-wiedzy.test.ts (decyzja właściciela 25.10.2026, „całkiem anonimowo”): publicznie — w aplikacji, na stronach www
 * i w sklepie — nigdzie nie piszemy o źródłach, nawet ogólnie; wiedza „wynika z tego, co przyswoiliśmy”. Ekran Ustawienia → „Źródła wiedzy” (23.10.2026) usunięty.
 * Wewnętrzny rejestr zostaje w repozytorium: lib/cues/data.json, docs/research/rejestr-twierdzen.json, docs/research, docs/brd/zrodla.md.
 * Ten plik nie jest używany w aplikacji — tylko w testach (jedno miejsce wzorców: nazwy organizacji i autorów, cytat „Nazwisko i in. 2016”, odwołania ogólne).
 */

/** Wszystkie rozpoznawane nazwy źródeł (wyrażenia regularne; wielkość liter ma znaczenie: „WHO”, nie „who”). */
export const SOURCE_NAME_PATTERNS: readonly string[] = [
  'ACSM', 'NSCA', 'WHO', 'CDC', 'ISSN', 'MIMIT', 'Teleborsa', 'Pelland', 'Ramos-Campo', 'Zourdos', 'Helms', 'Bastos', 'Epley', 'Sánchez-Moreno', 'Talaber', 'van den Tillaar', 'Gouvali', 'Rogerson',
  'Robinson (?:i in\\.|et al\\.|\\d{4})', 'Lopez (?:i in\\.|et al\\.|\\d{4})', 'Singer (?:i in\\.|et al\\.|\\d{4})', 'Bell (?:i in\\.|et al\\.|\\d{4})',
  'wytyczne USA', 'US guidelines', 'Physical Activity Guidelines',
  'Brzycki', 'Mayhew', 'Schoenfeld', 'Israetel', 'Zatsiorsky', 'Stronger by Science', 'ExRx', 'Nuckols',
  '[A-Z]\\p{L}+(?:-\\p{L}+)* (?:i in\\.|et al\\.) ?\\d{4}', /* cytat „Nazwisko i in. 2016” w dowolnym języku łacińskim */
];

/** Odwołania ogólne do podstaw wiedzy (bez nazw) — też zakazane w tekstach publicznych (PL i EN; wielkość liter bez znaczenia). */
export const GENERIC_REFERENCE_PATTERNS: readonly string[] = [
  'na podstawie (?:badań|zaleceń|wytycznych|przeglądów|źródeł)', 'według (?:zaleceń|badań|wytycznych|przeglądów)', 'zaleceni(?:a|ach|ami) (?:zdrowotn|treningow|organizacji)', 'zaleceniami organizacji',
  'w badaniach', 'badania (?:pokazują|wykazały|wskazują|potwierdzają)', 'przegląd(?:y|u|ów)? badań', 'stanowisk(?:o|a|iem|ach) organizacji', 'organizacj(?:e|i|ach) naukow', 'wytyczn(?:e|ych|ymi)',
  'opier(?:a|ają) się na (?:badaniach|zaleceniach|przeglądach|stanowiskach)', 'oparte na (?:badaniach|zaleceniach)',
  'based on (?:research|studies|guidelines|recommendations)', 'according to (?:research|studies|guidelines)', 'in (?:studies|trials)\\b', 'studies (?:show|have shown|found)', 'research (?:shows|suggests)',
  'health and training (?:guidelines|recommendations)', 'follows (?:health|training)', 'systematic review', 'scientific (?:studies|organi[sz]ations)', 'guidelines',
];
