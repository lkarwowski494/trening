# Do recenzji lokalizacji — przekład API 09.11.2026 (B2, figury nóg)

Przebieg 42600305903 (zestaw B2, 8 zdań × 33 języki poza pl, en); 0 odrzuconych, wszystkie już w `lib/cues/text/<język>.json` (klucz = id), strażnik słownika zielony. Karty nie odsłonięte (`karty_nowe` bez zmian) — to po tej recenzji. Poprawki ręczne: ms (`ballcurl.mis.sag`: „gerakan” → „bergerak”, słownictwo id) oraz ja (4 zdania `*.mis.*` → forma „…こと。”, jak w A4a), do sprawdzenia przez native speakera.

## B2 (8 zdań × 33 języków)
- ballcurl.mis.sag
- lunge.bbSetup
- lunge2.mis.lean
- lunge2.mis.shallow
- slcurl.move
- slcurl.setup
- split.setup
- stepup.mis.drop

## Poprawki po recenzji lokalizacji B2 (09.11.2026) — naniesione
Raport recenzenta: 35 poprawek (2 BLOK, 12 ŚREDNIE, 21 NISKIE); naniesione wszystkie poza dwiema (niżej). Nowe pojęcia słownika: `wykrok_postawa` (hu, nl), `przodostopie` (sv), `slidery` (ms, ro) z zakazanymi `terpesz`, `spreidstand`, `fotblad`, `pelungsur`, `glisoar`; test regresyjny w `tests/slownik-terminow.test.ts` (09.11.2026).

**Do native speakera (zamiennik niepewny):**
- split.setup hu „kitöréses állás” (alternatywa „lépőállás”) — BLOK, zamiennik do potwierdzenia
- split.setup nl „lunge-houding” (alternatywa „uitvalspas-houding”) — BLOK, zamiennik do potwierdzenia
- split.setup sv „på tå” (alternatywa „på trampdynan”); stepup.mis.drop sv „Att falla ner…”; lunge2.mis.lean sv fraza rzeczownikowa
- split.setup lt „kita gale, ant pirštų”; slcurl.move lt „paslink kojas”
- stepup.mis.drop hr/sr „padanje/падање”; sl „padanje s povišanja”
- ja: `ballcurl.mis.sag` „お尻が下がって…”, `lunge2.mis.shallow` skrócone; ms: „melendut”, „slider”; ro: „discurile de alunecare”, „întinde picioarele alunecând pe discuri”
- nb `lunge2.mis.shallow` „Går ikke dypt nok”

**Pominięte:** `lunge2.mis.lean` ja („下りる” — recenzent dopuszcza bez zmiany; zostawione „しゃがむ”); `slcurl.setup` es „discos deslizantes” (wymaga zmiany razem z es-419, zamiennik niepewny — do native speakera).
