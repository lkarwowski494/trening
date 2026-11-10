# Brief: recenzja niezależna rodziny figur v2 — partia 1 (linia 1.1, 09.11.2026)

Jesteś **recenzentem** (audytor, L-047): nie pisałeś tej rodziny i niczego w niej nie poprawiasz. Po polsku. Bramka 4 z CLAUDE.md: animacja i karta ćwiczenia w wydaniu
przechodzi niezależną, dogłębną recenzję ruchu i treści; recenzja ruchu obowiązkowo z arkuszem z nałożonym śladem toru ciężaru (L-050).

## Wejście (w zleceniu)
Rodzina, SHA autora, numer rundy N, raport autora (lista ćwiczeń, nakładka, zestawy ogólne, karty).

## Czysta kopia
`mkdir -p /home/user/rev-p1/<rodzina>-r<N> && git -C /home/user/trening archive <SHA> | tar -x -C /home/user/rev-p1/<rodzina>-r<N> && ln -s /home/user/trening/node_modules /home/user/rev-p1/<rodzina>-r<N>/node_modules`.
Pracuj tylko w kopii. W repo `/home/user/trening` nic nie zmieniaj (inni agenci tam pracują). Nie uruchamiaj pełnego Jest; pojedyncze pliki testów rodziny wolno.

## Zakres
1. **Ruch (K4–K8 z `docs/przekazanie/notatki/linia-1-1/plan-recenzji-rodzin-v2.md`)** — dla **każdego** ćwiczenia z rysunkiem w **każdym** widoku: własne arkusze
   `node scripts/figures/arkusz-slad.mjs --out /home/user/rev-p1/<rodzina>-r<N>/arkusze/slad --key "<ćw>" …` (oba motywy dla części), obejrzane w pełnej rozdzielczości (Read na PNG; kadruj, nie oceniaj z miniatur).
   Oceń jak trener: ustawienie, przebieg, zakres stawu na końcach wobec tekstu karty (liczby z `frameAt`), ślad w chwycie (para hantli/dwie linki = chwyt R; `trzyma` = chwyt tej ręki; sztanga = środek gryfu),
   skoki, przenikanie (ławka/podłoga > 1 cm), orientacja sprzętu (oś hantla, kettlebell, talerze, linka), tempo/fazy licznika (`DATA_UI`).
2. **Nakładka** — `node scripts/figures/arkusz-nakladka.mjs --out … --family <rodzina>`: elementy tylko z reguł „ustalone” (`data/zrodla/figury-sens.json`), w płaszczyźnie ruchu (bez artefaktu w rzucie poprzecznym), zgodne z wskazówkami na karcie; pozy błędów kolorują właściwy element.
3. **Zestawy ogólne** (`lib/figures/v2/cue-sets.json`, `b: "general"`) przy ćwiczeniach rodziny z rysunkiem: czy każde zdanie zgadza się z ruchem na rysunku i z ćwiczeniem.
4. **Karty własne** ćwiczeń rodziny z rysunkiem v2 bez wpisu `karty` w `docs/research/figury-recenzja.json` (K11): treść karty (ustawienie, ruch, wskazówki, błędy) wobec rysunku v2 — spójność, nie ponowne badanie źródeł (źródła kart przeszły recenzję w partiach tekstowych; zgłoś tylko sprzeczność, którą widzisz).
5. **Testy (K14)**: `git -C /home/user/trening diff <baza>..<SHA> -- tests/` — każde poluzowanie oczekiwania oceń (uzasadnione / nie).

## Znaleziska
Każde: poziom (KRYTYCZNE / WYSOKIE / ŚREDNIE / NISKIE wg progu z CLAUDE.md „Audyty i wydania”), realność (realny / brzegowy / teoretyczny), ćwiczenie, widok, kadr u, miara (liczba z `frameAt` albo ścieżka PNG + opis), proponowany kierunek naprawy.
Werdykt rodziny „wyswietlana” tylko bez KRYTYCZNYCH i WYSOKICH; ćwiczenie z WYSOKIM → werdykt ćwiczenia „do poprawy”.

## Wyjście (zapisz w `/home/user/rev-p1/out/`, programista partii przeniesie do repo 1:1)
- `partia1-<rodzina>-r<N>-audytor-2026-11-09.md` — raport: werdykt, metoda (SHA, kopia, liczba arkuszy), znaleziska, tabela ćwiczeń (werdykt), uwagi do testów. Cytaty ze źródeł najwyżej 2 zdania.
- `partia1-<rodzina>-r<N>.json` — wpisy do przeniesienia 1:1:
  ```
  { "v2": { "<rodzina>": { "werdykt", "data": "2026-11-09", "stan", "kto", "autor", "recenzent": "audytor", "sha", "liczba", "slad", "uwagi",
                          "cwiczenia": { "<ćw>": { "werdykt", "uwagi" } } } },
    "zestawy": { "<ćw>": { "rodzina": "<wzorzec zestawu>", "werdykt", "data", "stan", "autor", "recenzent", "kto", "sha", "uwagi" } },
    "karty":   { "<ćw>": { "werdykt", "data", "stan", "autor", "recenzent", "kto", "sha", "uwagi" } } }
  ```
  `sha` — **tylko** z `node scripts/zrodla-runtime.mjs --skroty` uruchomionego w kopii (v2.<rodzina>, zestawy.<ćw>, karty.<ćw>), nigdy z pamięci ani z raportu autora;
  `liczba` = liczba ćwiczeń rodziny z `assignAll()` (także bez rysunku); `slad` = co obejrzano (arkusze, widoki, kadry, motywy) i co widać na torze; `autor` ≠ `recenzent`.
  Wpisy tylko z werdyktem, który wystawiasz (przy WYSOKIM w rodzinie: v2 z werdyktem „do poprawy” i bez sha albo pominięte — opisz w raporcie).
Odpowiedź końcowa: werdykt, liczba znalezisk wg poziomu, ścieżki plików wyjścia, czas pracy.
