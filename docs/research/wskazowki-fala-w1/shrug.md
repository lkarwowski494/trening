# Wskazówki techniki — rodzina `shrug` (fala W1, grupa G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Zakres: ćwiczenia rodziny `shrug` bez własnych wskazówek: Shrugs (linki), Barbell Shrug Behind The Back, Smith Machine Behind the Back Shrug,
  Leverage Shrug, Calf-Machine Shoulder Shrug, Middle Back Shrug. Wzory: „Shrugs (sztanga)”, „Shrugs (hantle)”.
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1.

Metoda jak w `pulldown.md` (ten sam katalog). Strony czytane 02.11.2026. ExRx.net — HTTP 403, web.archive.org zablokowane (warianty ExRx nieczytane).
Wpisy `exrx-TrapeziusUpper/BBShrug` i `exrx-TrapeziusUpper/DBShrug` są w rejestrze (czytane w partii docs/research/27 przez migawkę archiwum) — użyte
wyłącznie z tymi samymi miejscami, które już potwierdzają te zdania dla „Shrugs (sztanga)/(hantle)”.
ACE #72 (Shrug, sztanga) i ACE #75 (Standing Shrug, hantle) przeczytane ponownie 02.11.2026: #72 — chwyt nachwytem na szerokość barków, kolana lekko
ugięte, biodra wyprostowane, plecy wysoko; barki prosto w górę do uszu tak wysoko, jak się da, powolne opuszczenie, tylko barki, bez krążenia.
Żadna z tych stron nie opisuje wariantu z linką, maszyną ani ciężarem za plecami.

Nie znaleziono żadnego przeczytanego opisu szczebla 4 (organizacja szkoleniowa, producent sprzętu, uznany serwis) dla wariantów z tej listy:
NASM i Eleiko nie mają stron szrugów (Eleiko: tylko „Hang Clean/Snatch Shrug” — inne ćwiczenia), Catalyst Athletics — tylko szrugi olimpijskie
(clean/snatch shrug — inne ćwiczenie), Life Fitness/Hammer Strength — tylko karta produktu maszyny do szrugów (bez instrukcji ruchu).
Wyniki wyszukiwania dla wariantów to wyłącznie serwisy konsumenckie i strony innych aplikacji — odrzucone.

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Shrugs (linki) | general (shrug) | częściowe — warunkowo do JSON | Tylko zdania wspólne z wariantów sprzętu (sztanga/hantle: ACE + ExRx). Brak opisu ustawienia przy wyciągu. |
| Leverage Shrug | general (shrug) | częściowe — warunkowo do JSON (bez ustawienia) | Ruch i wskazówki jak w wariantach sprzętu; ustawienie przy maszynie dźwigniowej — brak źródła. |
| Barbell Shrug Behind The Back | general (shrug) | częściowe — warunkowo do JSON (bez ustawienia) | Ruch jak w szrugu ze sztangą; zdanie „sztanga za plecami, dłonie do tyłu” — brak dwóch źródeł (Otwarte). |
| Smith Machine Behind the Back Shrug | general (shrug) | częściowe — warunkowo do JSON (bez ustawienia) | Jak wyżej; dodatkowo brak źródła o ustawieniu w suwnicy. |
| Calf-Machine Shoulder Shrug | general (shrug) | częściowe — warunkowo do JSON (bez ustawienia) | Ciężar na barkach (wałki maszyny), nie w rękach — `shrug.setup` NIE pasuje. Ruch i wskazówki jak w wariantach. |
| Middle Back Shrug | general (row) | otwarte | Inny ruch (ściąganie łopatek, nie unoszenie barków); brak przeczytanego źródła. Zdania `shrug.*` nie pasują. |

„Warunkowo” = każde zdanie ma 2 przeczytane źródła z dwóch organizacji, ale oba opisują inny sprzęt (wariant: sztanga z przodu / hantle).
Decyzja koordynatora: przyjąć jako „wariant sprzętu” (zasada z briefu) albo zostawić te ćwiczenia w trybie ogólnym do czasu znalezienia opisów wariantów.
Rekomendacja: przyjąć tylko dla „Shrugs (linki)” i „Leverage Shrug” (ciężar w opuszczonych rękach, ruch identyczny); dla wariantów „za plecami”
i maszyny na łydki karta bez ustawienia byłaby myląca — zostawić tryb ogólny po przeglądzie zestawu (Otwarte 2–3).

## 2. Blok JSON (warunkowo — patrz wyżej)

```json
{
  "Shrugs (linki)": {
    "setup": [
      {"c": "shrug.setup", "s": [["ace-72", "opis (wariant: sztanga; ręce opuszczone, stań prosto)"], ["exrx-TrapeziusUpper/DBShrug", "Preparation (wariant: hantle)"]]}
    ],
    "move": [
      {"c": "shrug.move", "s": [["ace-72", "opis (wariant: sztanga)"], ["exrx-TrapeziusUpper/BBShrug", "Execution (wariant: sztanga)"]]}
    ],
    "tips": [
      {"c": "shrug.high", "s": [["ace-72", "opis (as high as possible; wariant: sztanga)"], ["exrx-TrapeziusUpper/BBShrug", "Execution (as high as possible; wariant: sztanga)"]]},
      {"c": "shrug.tall", "s": [["ace-72", "opis (hips straight, back tall; only the shoulders; wariant: sztanga)"], ["exrx-TrapeziusUpper/DBShrug", "Comments (standing upright; wariant: hantle)"]]}
    ],
    "mistakes": []
  },
  "Leverage Shrug": {
    "setup": [],
    "move": [
      {"c": "shrug.move", "s": [["ace-72", "opis (wariant: sztanga)"], ["exrx-TrapeziusUpper/BBShrug", "Execution (wariant: sztanga)"]]}
    ],
    "tips": [
      {"c": "shrug.high", "s": [["ace-72", "opis (as high as possible; wariant: sztanga)"], ["exrx-TrapeziusUpper/BBShrug", "Execution (as high as possible; wariant: sztanga)"]]},
      {"c": "shrug.tall", "s": [["ace-72", "opis (hips straight, back tall; wariant: sztanga)"], ["exrx-TrapeziusUpper/DBShrug", "Comments (standing upright; wariant: hantle)"]]}
    ],
    "mistakes": []
  }
}
```

Dla „Barbell Shrug Behind The Back”, „Smith Machine Behind the Back Shrug” i „Calf-Machine Shoulder Shrug” — jeśli koordynator przyjmie „wariant
sprzętu” także dla nich: `move` + `tips` identyczne jak w „Leverage Shrug”, `setup` pusty (karta bez ustawienia). Nie rekomenduję (Otwarte 2–3).

## 3. Nowe źródła

Brak. (ACE #72 i #75 — istniejące `ace-72`, `ace-75`, przeczytane ponownie 02.11.2026.)

## 4. Nowe zdania

Brak (użyte istniejące: `shrug.setup`, `shrug.move`, `shrug.high`, `shrug.tall`).

## 5. Otwarte

1. **Shrugs (linki), Leverage Shrug — ustawienie przy sprzęcie** (np. „chwyć uchwyty dolnego wyciągu, ręce opuszczone”): brak przeczytanego opisu
   wariantu w ACE, NASM, Eleiko, Catalyst, Life Fitness; ExRx (CBShrug, LVShrug) — 403.
2. **Barbell / Smith Machine Behind the Back Shrug** — zdanie o trzymaniu sztangi za plecami (dłonie do tyłu): znalezione wyłącznie w serwisach
   konsumenckich i na stronach innych aplikacji (odrzucone); jedna strona firmy fizjoterapeutów (biblioteka ćwiczeń) — szczebel nieustalony,
   nie czytana do końca. ExRx (BBRearShrug, SMRearShrug) — 403. Bez tego zdania karta nie odróżnia wariantu od zwykłego szrugu.
3. **Calf-Machine Shoulder Shrug** — obecny zestaw ogólny `shrug` (jeśli zawiera ciężar w rękach) jest dla tego wariantu błędny: ciężar leży na
   barkach pod wałkami maszyny. Do przeglądu zestawu ogólnego; własne ustawienie — brak źródła.
4. **Middle Back Shrug** — inny ruch (ściąganie łopatek, zwykle w leżeniu przodem — niepotwierdzone); obecny tryb ogólny `row` — nie sprawdzono
   źródłem, czy pasuje. Brak przeczytanego opisu.
5. **Błąd „krążenie barkami”** — ACE #72 mówi, by nie krążyć barkami (opis); drugie niezależne źródło nieprzeczytane (ExRx 403). Po znalezieniu
   drugiego źródła — kandydat na `shrug.mis.roll` dla całej rodziny („Krążenie barkami zamiast ruchu prosto w górę i w dół.”).

## 6. Stan

Zrobione: przegląd źródeł dla 6 wariantów; wynik warunkowy dla 2, otwarte 4. Zostało: znaleźć drugie (poza ExRx) źródła wariantów — najlepiej
w środowisku z dostępem do web.archive.org (ExRx: CBShrug, LVShrug, BBRearShrug, SMRearShrug, LVShrugCalfMachine) albo w materiałach producentów
maszyn (instrukcje obsługi z opisem ćwiczenia). Pułapki: exrx.net 403; web.archive.org zablokowane; karty produktów Hammer Strength bez instrukcji ruchu.
