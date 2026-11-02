# Etap 2 (ZB-033) — 5 luk z P0: Pendlay Row (4 zdania) i `calf.step`

Badacz linii 1.1, 02.11.2026. Brief: `docs/przekazanie/notatki/linia-1-1/briefy/etap2-p0-luki-badacz.md`.
Podstawa: ZB-033 (`docs/zobowiazania.md:42`), docs/18 (`docs/18-przekazanie.md:168` — etap 2: 3 niezależne źródła szczebla 5 na ustawienie
i ruch, „Czego unikać” wnioskowane, oznaczenie „praktyka”, recenzja niezależna z rysunkiem; `:169` — źródła wyłącznie z listy właściciela:
atlas Centrum Respo, atlas Fabryki Siły, grupa SFD = jedno źródło, maniacmuscle.com). Powód luk: `data/zrodla/cues.json:9042–9046`.

Szukano wyłącznie w czterech źródłach z listy (nawigacja po stronach i wyszukiwarki tych serwisów; ogólna wyszukiwarka tylko z ograniczeniem
do domeny listy). Wszystkie cztery = **szczebel 5** (lista właściciela, docs/18:169; Respo = 5 także wg docs/18:140). Żadna strona nie ma
autora z kwalifikacjami ani recenzenta; atlas Kulturystyka.pl ma dopisek „Opracowanie Michał Sulewski” bez kwalifikacji — nadal 5.

## Tabela

| Ćwiczenie | Zdanie (id) | Źródła (szczebel 5, niezależne) | Stan | Uwagi |
|---|---|---|---|---|
| Pendlay Row | `pendlay.setup` | R1, F1, M1 | **komplet 3 — praktyka** | brzmienie bez zmian |
| Pendlay Row | `pendlay.pull` | R1, F1, M1 (część wspólna) | **komplet 3 dla części wspólnej — wymaga zmiany brzmienia** | „dynamicznie” i „albo brzucha” nie mają 3 źródeł (niżej) |
| Pendlay Row | `pendlay.floor` | R1, F1, M1 (część wspólna) | **komplet 3 dla części wspólnej — wymaga zmiany brzmienia** | „nieruchomej” (martwy punkt) tylko M1 |
| Pendlay Row | `pendlay.mis.torso` | `["wniosek", "pendlay.setup"]`; wprost także R1, M1 | **wniosek — praktyka** | F1 tylko „tułów w miejscu” |
| Łydki na stopniu | `calf.step` | R2 (+R3, ta sama firma), F2, S1 (+S2, ta sama grupa) | **komplet 3 — praktyka** | brzmienie bez zmian |

SFD nie ma strony Pendlay Row (atlas Kulturystyka.pl, `plecy.asp` — tylko zwykłe wiosłowanie w opadzie; potreningu.pl — wyszukiwanie
w domenie nie znalazło). maniacmuscle.com nie ma wspięć na palce (kategoria `category/legs/calves/` pusta; wyszukiwanie „calf”, „calf raise”,
„heel raise” — tylko rozciąganie i przysiady). Zatem dla każdego ćwiczenia są dokładnie 3 źródła, bez zapasu.

### Pendlay Row — szczegóły

- **Ustawienie** — wszystkie trzy: sztanga leży na podłodze, tułów prawie równolegle do podłogi, kolana lekko ugięte, plecy proste/neutralne.
  Różnice nieistotne dla zdania: R1 i F1 — chwyt nieco szerzej niż barki; M1 — stopy na szerokość bioder–barków.
- **Ruch** — wspólne: przyciągnięcie sztangi z podłogi do (dolnej części) klatki i odłożenie na podłogę po każdym powtórzeniu.
  Różnice: dynamika — M1 „explosively”, R1 „poderwij” (zgodne), **F1 przeczy**: „Ćwiczenie wykonuj powoli” (ogólna wskazówka do całego ćwiczenia);
  sprzeczność na tym samym szczeblu → do zdania tylko część wspólna, bez „dynamicznie”. Cel ruchu: F1 „dolna część klatki”, R1 „klatka piersiowa”,
  M1 „lower chest or upper stomach” → część wspólna „dolna część klatki”; „brzuch” — jedno źródło.
- **Każde powtórzenie z podłogi** — M1 wprost (dead stop); F1 i R1: opuszczenie „do pozycji wyjściowej”, którą jest sztanga na podłodze (F1 dopowiada
  „tzn. na podłoże”). Część wspólna: start z podłogi; „nieruchoma”/martwy punkt — jedno źródło (M1).
- **Czego unikać: unoszenie tułowia** — wniosek z `pendlay.setup` (tułów prawie równolegle przez cały ruch). Dodatkowo wprost: R1 (za wysoki tułów
  jako częsty błąd), M1 (tułów podnosi się — za duży ciężar); F1 — trzymanie tułowia w miejscu w fazie ruchu.

### Łydki na stopniu (`calf.step`) — szczegóły

Wspólne: przednia część stopy na stopniu/podwyższeniu, pięty niżej niż stopień (poza krawędzią), podparcie ręką dla równowagi. Różnice: R2 —
przytrzymanie się „możesz” (opcjonalne), F2 — stopień „jeżeli to możliwe”, S1 — wprost „złap się jedną ręką”. Strony F2, R3 i S1 opisują wersję
jednonóż; ustawienie stopy na stopniu i podparcie są w nich takie samo jak w wersji obunóż (R2 — obunóż, S2 — obunóż bez wzmianki o podparciu,
bo ręce trzymają sztangę). Do recenzenta: potwierdzić, że to nie zmienia zdania (inaczej oznaczyć „uproszczenie”).

## Zdania PL + EN

Bez zmian (komplet 3):
- `pendlay.setup` — PL: „Sztanga leży na podłodze. Pochyl tułów prawie równolegle do podłogi, kolana lekko ugięte, plecy proste.” EN: bez zmian.
- `calf.step` — PL: „Stań przednią częścią stóp na stabilnym stopniu, pięty poza krawędzią; przytrzymaj się czegoś dla równowagi.” EN: bez zmian.
- `pendlay.mis.torso` — PL: „Unoszenie tułowia przy przyciąganiu.” EN: bez zmian (wniosek).

Proponowana zmiana brzmienia (część wspólna 3 źródeł; wymaga `node scripts/claims.mjs --rehash` i tłumaczeń — decyzja koordynatora):
- `pendlay.pull` — PL: „Przyciągnij sztangę z podłogi do dolnej części klatki, potem odłóż ją na podłogę.”
  EN: „Pull the bar off the floor to your lower chest, then set it back down on the floor.”
- `pendlay.floor` — PL: „Każde powtórzenie zaczynaj od sztangi leżącej na podłodze.”
  EN: „Start every rep with the bar on the floor.”

Jeśli koordynator woli zachować obecne brzmienie („dynamicznie… albo brzucha”, „nieruchomej”) — te dwa zdania zostają luką (jedno źródło na te fragmenty, F1 przeczy dynamice).

## Blok do wdrożenia (JSON, `_tryb: dopisz`)

```json
{
  "_tryb": "dopisz",
  "_oznaczenie": "praktyka",
  "_decyzja": "etap 2, docs/18 02.11.2026 (~18:20 i ~19:50), ZB-033",
  "sources": {
    "respo-wioslowanie-pendlaya": { "org": "Centrum Respo", "title": "Wiosłowanie Pendlaya", "url": "https://centrumrespo.pl/atlas/wioslowanie-pendlaya/", "level": 5 },
    "fabrykasily-wioslo-pendlaya": { "org": "Fabryka Siły", "title": "Wiosło Pendlaya", "url": "https://fabrykasily.pl/atlas-cwiczen/plecy/wioslo-pendleya", "level": 5 },
    "maniacmuscle-barbell-pendlay-row": { "org": "ManiacMuscle", "title": "Barbell Pendlay Row", "url": "https://maniacmuscle.com/barbell-pendlay-row/", "level": 5 },
    "respo-wspiecia-na-palce": { "org": "Centrum Respo", "title": "Wspięcia na palce", "url": "https://centrumrespo.pl/atlas/wspiecia-na-palce/", "level": 5 },
    "fabrykasily-wspiecia-jednonoz": { "org": "Fabryka Siły", "title": "Wspięcia na palce jednonóż", "url": "https://fabrykasily.pl/atlas-cwiczen/lydki/wspiecia-na-palce-jednonoz", "level": 5 },
    "sfd-potreningu-wspiecia-jednonoz": { "org": "SFD (potreningu.pl)", "title": "Wspięcia na palce jednonóż", "url": "https://potreningu.pl/atlas-cwiczen/dla-kobiet/372/wspiecia-na-palce-jednonoz", "level": 5 }
  },
  "cues": {
    "Pendlay Row": {
      "setup": [ { "c": "pendlay.setup", "s": [
        ["respo-wioslowanie-pendlaya", "Pozycja wyjściowa (sztanga na ziemi, lekko ugięte kolana, naturalne krzywizny); Wskazówki (tułów prawie równolegle)"],
        ["fabrykasily-wioslo-pendlaya", "Pozycja wyjściowa (sztanga na podłodze pod klatką, tułów niemalże równolegle, kolana lekko ugięte)"],
        ["maniacmuscle-barbell-pendlay-row", "Starting Position (bar rests on the floor, torso close to parallel, knees soft, flat back)"] ] } ],
      "move": [ { "c": "pendlay.pull", "s": [
        ["respo-wioslowanie-pendlaya", "Ruch 1–2 (poderwij z ziemi do klatki; opuść do pozycji wyjściowej)"],
        ["fabrykasily-wioslo-pendlaya", "Ruch (z ziemi do dolnej części klatki; opuść na podłoże)"],
        ["maniacmuscle-barbell-pendlay-row", "Execution (from the floor toward the lower chest; return the bar to the floor)"] ] } ],
      "tips": [ { "c": "pendlay.floor", "s": [
        ["maniacmuscle-barbell-pendlay-row", "Starting Position (every rep begins from a dead stop)"],
        ["fabrykasily-wioslo-pendlaya", "Ruch (opuszczenie do pozycji wyjściowej, tzn. na podłoże)"],
        ["respo-wioslowanie-pendlaya", "Ruch 2 (opuść do pozycji wyjściowej = sztanga oparta na ziemi)"] ] } ],
      "mistakes": [ { "c": "pendlay.mis.torso", "s": [ ["wniosek", "pendlay.setup"] ] } ]
    },
    "Łydki na stopniu": {
      "setup": [ { "c": "calf.step", "s": [
        ["respo-wspiecia-na-palce", "Pozycja wyjściowa (step, przodostopie, pięty nisko; opcjonalnie przytrzymanie)"],
        ["fabrykasily-wspiecia-jednonoz", "Pozycja wyjściowa (przednia część stopy na stopniu; oprzyj się o coś stabilnego)"],
        ["sfd-potreningu-wspiecia-jednonoz", "Pozycja wyjściowa (1/3 stopy na podeście, pięty poniżej; złap się ręką)"] ] } ]
    }
  },
  "usun_luki": [
    "Pendlay Row::pendlay.setup",
    "Pendlay Row::pendlay.pull",
    "Pendlay Row::pendlay.floor",
    "Pendlay Row::pendlay.mis.torso",
    "Łydki na stopniu::calf.step"
  ]
}
```

Uwaga do wdrożenia: blok zastępuje dotychczasowe listy źródeł tych zdań (BarBend 4 / Breaking Muscle 5 / Coach 5, ExRx 4 / Physitrack 5 /
The Prehab Guys 5) albo je uzupełnia — decyzja koordynatora; `pendlay.pull` i `pendlay.floor` usunąć z luk tylko razem ze zmianą brzmienia.
Format pliku fali W2 (wzór `wskazowki-fala-w2/triceps.md`) nie był dostępny lokalnie bez git — blok odtworzony z układu `data/zrodla/cues.json`
(klucze `c`, `s`, `sources`, `luki`); pola `_oznaczenie` i `usun_luki` do dopasowania przez programistę.

## Źródła (odczyt 02.11.2026, wszystkie szczebel 5)

- **R1** Centrum Respo, „Wiosłowanie Pendlaya”, https://centrumrespo.pl/atlas/wioslowanie-pendlaya/ — bez autora i daty. Pozycja wyjściowa:
  „Stań przed sztangą opartą na ziemi z założonym obciążeniem.” Wskazówki: „Tułów powinien być ustawiony prawie równolegle do podłoża, częstym błędem jest zbyt pionowa pozycja.”
- **F1** Fabryka Siły, „Wiosło Pendlaya”, https://fabrykasily.pl/atlas-cwiczen/plecy/wioslo-pendleya — bez autora, data 2025-01-20. Ruch:
  „podnieś sztangę bezpośrednio z ziemi, przyciągnij gryf w okolicę dolnej części klatki piersiowej”; „obniżając sztangę do pozycji wyjściowej – tzn. na podłoże”.
  Wskazówki (sprzeczność z dynamiką): „Ćwiczenie wykonuj powoli, z zachowaniem odpowiedniej techniki.”
- **M1** ManiacMuscle, „Barbell Pendlay Row”, https://maniacmuscle.com/barbell-pendlay-row/ — bez autora i daty. Starting Position:
  „Every rep begins from a dead stop, not from a hanging position.” Execution: „Pull the bar explosively from the floor toward the lower chest or upper stomach.”
- **R2** Centrum Respo, „Wspięcia na palce”, https://centrumrespo.pl/atlas/wspiecia-na-palce/ — bez autora i daty. Pozycja wyjściowa:
  „Stopy ustaw równolegle do siebie na przodostopiu, w taki sposób, aby piętę opuścić nisko do podłogi.”
- **R3** Centrum Respo, „Single Leg Dumbbell Calf Raise”, https://centrumrespo.pl/atlas/single-leg-dumbbell-calf-raise/ — ta sama firma co R2
  (nie liczy się osobno). Pozycja wyjściowa: „Drugą ręką podeprzyj się np. o ścianę lub stojak od sztangi.”
- **F2** Fabryka Siły, „Wspięcia na palce jednonóż”, https://fabrykasily.pl/atlas-cwiczen/lydki/wspiecia-na-palce-jednonoz — bez autora,
  data 2022-02-18. Pozycja wyjściowa: „Stań prosto, napnij brzuch i oprzyj się o coś stabilnego.”; „ustaw przednią część stopy na podwyższeniu, np. stopniu schodów”.
- **S1** SFD — potreningu.pl, „Wspięcia na palce jednonóż”, https://potreningu.pl/atlas-cwiczen/dla-kobiet/372/wspiecia-na-palce-jednonoz —
  bez autora i daty. „Stań 1/3 powierzchnią stopy na podeście.”; „Złap się jedną ręką czegoś dla utrzymania równowagi.”
- **S2** SFD — potreningu.pl, „Wspięcia na palce obunóż stojąc”, https://potreningu.pl/atlas-cwiczen/dla-kobiet/374/wspiecia-na-palce-obunoz-stojac
  (ta sama grupa co S1): „opuszczając pięty poniżej poziomu podestu”. Także atlas Kulturystyka.pl, https://atlas.kulturystyka.pl/nogi.asp, poz. 1
  (gruba podkładka pod palce, łydki rozciągnięte) — grupa SFD, nie liczy się osobno.

Przeczytane bez wyniku: https://centrumrespo.pl/atlas/kategoria/lydki/, https://centrumrespo.pl/atlas/kategoria/plecy/,
wyszukiwarka atlasu Respo (`?s=pendlay`, `?s=wiosłowanie`), https://fabrykasily.pl/atlas-cwiczen, https://fabrykasily.pl/cwiczenia/na-lydki,
https://fabrykasily.pl/cwiczenia/na-plecy, https://atlas.kulturystyka.pl/ i `plecy.asp` (brak Pendlay), https://potreningu.pl/atlas-cwiczen
(lista ładowana skryptem), https://maniacmuscle.com/category/legs/calves/ (pusta), wyszukiwarka maniacmuscle (`?s=calf`, str. 1–2;
`?s=calf+raise`; `?s=heel+raise`).

Odczyt przez narzędzie pobierające stronę (tekst strony streszczany przez model pomocniczy); cytaty powyżej to fragmenty podane przez
narzędzie jako dosłowne — recenzent niezależny powinien je sprawdzić na stronie przed statusem „gotowe”.

## Pytania dla koordynatora

1. `pendlay.pull` i `pendlay.floor`: przyjąć brzmienie z części wspólnej (rekomendacja; luka zamknięta) czy zostawić obecne (luka zostaje)?
2. `pendlay.floor` to wskazówka („tips”), nie ustawienie/ruch — czy etap 2 obejmuje wskazówkę, która powtarza przebieg ruchu? Jeśli nie — zdanie zostaje luką albo trafia do `pendlay.pull`.
3. Każde zdanie ma dokładnie 3 źródła, bez zapasu: jeśli recenzent odrzuci którekolwiek (np. maniacmuscle jako kopię albo serwis generowany), zdanie wraca do luk.
4. `calf.step`: dwie z trzech stron to wersja jednonóż — recenzent potwierdza, że ustawienie się nie różni (inaczej „uproszczenie”).
5. Rysunek: recenzja niezależna z porównaniem z rysunkiem (wymóg etapu 2) — figura Pendlay Row ma pokazywać sztangę wracającą na podłogę.

## Stan agenta

Zrobione: odczyt 4 źródeł z listy, plik wyniku. Bez git, npm i zmian w danych. Zostało: decyzja koordynatora (pyt. 1–2), wdrożenie bloku
przez programistę, recenzja niezależna (L-047) z rysunkiem, rehash wpisów w rejestrze twierdzeń przy zmianie brzmienia.

## Decyzje koordynatora (02.11.2026 ~23:40 PL, merytoryczne wg hierarchii — do wpisu w docs/18)
1. `pendlay.pull` i `pendlay.floor`: przyjęte nowe brzmienie (część wspólna źródeł tego samego szczebla — reguła „Merytoryczne podstawy”, sprzeczność na tym samym szczeblu → część wspólna). Wymaga `claims.mjs --rehash` i przekładu (partia z P1).
2. `pendlay.floor` (wskazówka powtarzająca przebieg ruchu) — w zakresie etapu 2 na tych samych zasadach.
3. Źródła: uzupełnić, nie zastępować — dotychczasowe wpisy zostają w rejestrze ze szczeblem po P0 (nie liczą się do kompletu); liczą się tylko źródła z listy właściciela (ZB-033) i ewentualne nadal ważne ≤ 4.
4. Status „gotowe” dopiero po recenzji niezależnej L-047 (z porównaniem z rysunkiem; sztanga wraca na podłogę) i sprawdzeniu cytatów na stronach — zleca koordynator razem z recenzją P1.
