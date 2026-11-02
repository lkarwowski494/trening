# Wskazówki techniki — rodzina back_extension (fala W1, 02.11.2026)

Tylko zbieranie danych (polecenie właściciela 02.11.2026). Metoda: docs/research/27 i 33 (≥ 2 przeczytane źródła z różnych organizacji;
wariant opisany w miejscu odwołania; inne ćwiczenie = analogia). Wzór: „Back Extension” w `data/zrodla/cues.json`.
Bez twierdzeń o zdrowiu kręgosłupa (jedno ze źródeł je zawiera — nie przenosimy ich).

## 1. Podsumowanie

| klucz | stan | liczba zdań | uwagi |
|---|---|---|---|
| Reverse Hyperextension | gotowe (krótka karta) | 2 (tips) | tylko część wspólna; źródła sprzeczne co do wysokości i wymachu — p. 5 |
| Weighted Ball Hyperextension | otwarte | 0 | nie znaleziono 2 źródeł szczebla 4 spoza aplikacji (p. 5) |
| Lower Back Curl | otwarte | 0 | przeczytane tylko analogie (p. 5) |

Zestaw ogólny dziś:
- Reverse Hyperextension (`f: hipExt`, ok `bext.noArch`, `llc.control`; err `mis.jerk`) — **NIE potwierdzony**: Catalyst każe unosić nogi
  „jak najwyżej” i wykorzystywać wymach, ACE — nie wyżej niż linia tułowia i powoli. Sprzeczność na tym samym szczeblu → w karcie tylko
  część wspólna. **Możliwy błąd zestawu ogólnego** (zdania o kontroli i braku łuku popiera tylko jedno źródło).
- Weighted Ball Hyperextension (`f: backExt`, ok `bext.noArch`; err `mis.jerk`) — nie sprawdzony (brak 2 przeczytanych źródeł).
- Lower Back Curl (`f: cobra`, ok `cobra.hips`, `cobra.control`; err `cobra.mis`) — nie sprawdzony; `cobra.*` pochodzi z innego ćwiczenia
  (wypychanie tułowia rękami), co dla wyprostu w leżeniu z samych mięśni pleców jest analogią — możliwy błąd zestawu ogólnego.

## 2. Blok do `exercises` (tylko gotowe)

```json
{
  "Reverse Hyperextension": {
    "setup": [],
    "move": [],
    "tips": [
      {"c": "rhyp.legsTogether", "s": [
        ["ace-64", "krok 2 (wariant: na piłce, dłonie na podłodze; „Press and hold your legs together so they move at the same time.”)"],
        ["catalyst-529", "opis ćwiczenia („Keep the feet close to each other”)"]
      ]},
      {"c": "plank.brace", "s": [
        ["ace-64", "krok 2 (wariant: na piłce; napnij mięśnie brzucha, żeby usztywnić tułów; parafraza)"],
        ["catalyst-529", "opis ćwiczenia (tułów podparty, brzuch i pośladki napięte przy unoszeniu nóg; parafraza)"]
      ]}
    ],
    "mistakes": []
  }
}
```

## 3. Nowe zdania

| id | PL | EN |
|---|---|---|
| rhyp.legsTogether | Trzymaj nogi razem — unoś je i opuszczaj jednocześnie. | Keep your legs together — raise and lower them at the same time. |

`plank.brace` — istniejące („Napnij brzuch, żeby tułów był sztywny.”).

## 4. Nowe źródła

| id | adres | organizacja | szczebel |
|---|---|---|---|
| ace-64 | https://www.acefitness.org/resources/everyone/exercise-library/64/stability-ball-reverse-extensions/ (Stability Ball Reverse Extensions, #64; czytane 02.11.2026) | ACE | 4 |
| catalyst-529 | https://catalystathletics.com/exercise/529/Reverse-Hyper/ (czytane 02.11.2026 przez adres lustrzany mail.catalystathletics.com) | Catalyst Athletics | 4 |

## 5. Otwarte

- **Reverse Hyperextension — wysokość i tempo (sprzeczność, ten sam szczebel):** ACE 64 krok 2–3: nogi do linii z tułowiem, nie wyżej
  („Avoid hyperextension in your low back by raising your legs past parallel alignment with your torso.”), opuszczanie powoli;
  Catalyst 529: nogi „as high as possible”, wymach w dół i „use the momentum to swing back up”. Część wspólna: nogi razem, tułów napięty
  (w karcie). Różnicy nie rozstrzygam — potrzebne źródło wyższego szczebla albo trzecie źródło szczebla 4 (producent maszyny). Zdania
  `bext.noArch`, `llc.control`, `mis.jerk` z zestawu ogólnego — do usunięcia albo potwierdzenia.
  Catalyst zawiera też twierdzenia o zdrowiu pleców (odciążenie, ból) — nie przenoszone, poza zakresem aplikacji.
- **Setup Reverse Hyperextension** (tułów na podporze, biodra na krawędzi, nogi zwisają) — Catalyst opisuje, ACE opisuje wersję na
  piłce z dłońmi na podłodze (inne ułożenie) — brak drugiego zgodnego źródła.
- **Weighted Ball Hyperextension** — ACE nie ma wpisu wyprostu tułowia na piłce (wyszukiwanie zwróciło tylko #64, wersja odwrócona — inne
  ćwiczenie); pozostałe trafienia to aplikacje i platformy ćwiczeń dla fizjoterapeutów (nie źródło). Kandydaci: ulotki szpitalne/uczelniane
  „back extension on gym ball”, producenci piłek (instrukcje).
- **Lower Back Curl** (wyprost tułowia w leżeniu przodem, unosi się tylko klatka — docs/research/25-biblioteka/L6.json) — przeczytane tylko
  analogie: ACE Supermans #9 (unosi ręce i nogi — inne ćwiczenie), szpitalna ulotka NHS o wyproście z podparciem przedramion (rozciąganie —
  inne ćwiczenie). Brak 2 źródeł. Kandydaci: Catalyst „Superman Raise” (#533) — też analogia; szukać „prone trunk extension” w materiałach uczelnianych.

## 6. Stan

- Zrobione: Reverse Hyperextension (2 zdania, 1 nowe zdanie, 2 nowe źródła); sprzeczność ACE/Catalyst opisana.
- Zostało: Weighted Ball Hyperextension, Lower Back Curl, setup i ruch Reverse Hyperextension (rozstrzygnięcie wysokości).
- Następny krok: znaleźć trzecie źródło do reverse hyper (instrukcja producenta maszyny, PDF) i 2 źródła wyprostu na piłce / w leżeniu.
- Pułapki: strona Westside „Reverse Hyper Fundamentals” — 404; wyszukiwarka zwraca głównie aplikacje (nie źródło); ExRx 403.
