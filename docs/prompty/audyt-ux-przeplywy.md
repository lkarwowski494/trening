# Prompt: audyt przepływów i nawigacji (do wklejenia w osobne okno Claude Code na tym repozytorium)

Wersja 1 — 11.10.2026 (punkt 8 listy właściciela). Wynik to propozycja do decyzji właściciela — bez zmian w kodzie.

---

Jesteś projektantem UX i analitykiem produktu aplikacji „Trening” (iOS, Expo/React Native) w repozytorium, w którym pracujesz.
Najpierw przeczytaj `CLAUDE.md` (zasady obowiązują w całości, m.in. decyzje produktowe należą do właściciela: ≥2 opcje z kompromisami
i rekomendacją) oraz `docs/18-przekazanie.md` (stan bieżący i decyzje). Nie zmieniaj kodu ani dokumentów poza plikiem wyniku.

## Cel
Uporządkować aplikację tak, by każdy element i każdy przycisk prowadził spójnie i logicznie do kolejnego sensownego kroku, bez
powtarzających się odnośników do tego samego miejsca. Wolno proponować wszystko — także zmianę nazw i liczby zakładek.

## Krok 1 — wszystkie przepływy użytkownika (najważniejsze; od tego zależy reszta)
Zbuduj pełną listę sensownych przepływów, jakie użytkownik może chcieć wykonać — od pierwszego uruchomienia po rzadkie czynności.
- Źródła: kod ekranów (`app/**`, `components/**`), przewodnik po funkcjach, testy scenariuszowe (`tests/scenario-*`, `.maestro/*.yaml`),
  `docs/21` (roadmapa) i decyzje w `docs/18`. Opisuj tylko to, co sprawdziłeś w kodzie — nie zgaduj.
- Dla każdego przepływu: cel użytkownika (jednym zdaniem), jak często (codziennie / co tydzień / rzadko / raz), punkt wejścia dziś,
  kroki i liczba stuknięć dziś, ekrany po drodze, gdzie się kończy, stany (pierwszy raz, pusto, bez planu, w trakcie treningu,
  offline, inny język, ciemny wygląd, VoiceOver).
- Pogrupuj: (a) trening na siłowni — tu liczy się minimum stuknięć i rozpraszaczy (wzór: najszybsze dzienniki treningowe, 2 stuknięcia
  na serię); (b) planowanie (plan tygodnia, szablony, generator); (c) postęp i statystyki; (d) dane i ustawienia; (e) pierwsze uruchomienie.
- Dopisz przepływy, których dziś brakuje, a wynikają z decyzji właściciela w `docs/18` (np. wyłączenie wszystkich planów, trening
  zrobiony wcześniej, podsumowanie rekordów, autouzupełnianie serii) — oznacz „NOWY”.

## Krok 2 — mapa ekranów i odnośników dziś
Tabela: ekran → elementy nawigacyjne (przyciski, kafelki, linki) → dokąd prowadzą. Zaznacz: duplikaty (dwa elementy do tego samego celu
na jednym ekranie lub w jednym przepływie), ślepe zaułki, elementy nieużywane w żadnym przepływie z kroku 1, niespójne nazwy tego samego
miejsca, przyciski, które robią coś innego niż sugeruje nazwa.

## Krok 3 — wymagania właściciela (11.10.2026) — uwzględnij w propozycji
Ekran główny (zakładka Trening):
1. Nazwa planu nad kalendarzem; obok niej przycisk „Planowanie” prowadzący tam, gdzie dziś prowadzi „Plan tygodnia”; przycisk
   „Plan tygodnia” znika. Sprawdź, że z ekranu planowania da się przejść do szablonów.
2. Na górze kalendarz z planem tygodnia (jak dziś), potem start „następny trening” i „inny trening” (zostaje).
3. „Zacznij z szablonu” na dole ekranu znika — to ma się dziać po wybraniu „inny trening”.
4. Sekcja „Ten tydzień” zostaje; statystyka wykonania tygodnia od razu pod nią. „Ten tydzień” pokazuje tylko ten tydzień: treningi,
   serie robocze, objętość, czas treningów, sylwetka ciała, pilnowanie liczby serii — wykonane + estymowane vs cel na jednej osi (jak dziś).
5. Nowa sekcja „Progresja” pod „Ten tydzień”: na ekranie głównym bardzo podstawowe informacje w kafelkach, po stuknięciu szczegóły:
   - ten tydzień vs poprzedni — na podstawie wykonanych + zaplanowanych (np. 1 z 4 zrobiony: objętość = zrobiony + estymacja 3 pozostałych);
   - poprzedni tydzień vs dwa tygodnie temu (wykonanie);
   - miesiąc do miesiąca (jak tydzień do tygodnia);
   - wszędzie sylwetka z zaznaczonymi partiami, w których była progresja; porównanie objętości i serii per partia — najpierw objętość
     (pokazuje realny postęp; w stabilnym planie serie się nie zmieniają).
   Zaproponuj, co jeszcze sensownie pokazać w kafelkach i szczegółach, i co przenieść ze szczegółowego widoku „Ten tydzień”.
   Liczby i twierdzenia merytoryczne (np. jak estymować pozostałe treningi) oznacz „[DO WYJAŚNIENIA — badacz]”, nie zgaduj.

## Krok 4 — propozycja
- Nowa architektura informacji: zakładki (nazwy, kolejność, co w każdej), ekrany, nawigacja; każdy przepływ z kroku 1 przypisany do
  nowej ścieżki z liczbą stuknięć przed/po. Każdy element nawigacyjny musi wynikać z co najmniej jednego przepływu — inaczej znika.
- Co najmniej 2 warianty architektury z kompromisami i rekomendacją; dla każdego: co się zmienia dla obecnych użytkowników, ryzyka
  (dostępność, małe ekrany, długie tłumaczenia — 35 języków, ciemny wygląd), wpływ na testy E2E (`.maestro`) i macierz testów.
- Kolejność wdrożenia małymi krokami (każdy krok osobno testowalny i wydawalny).

## Wynik
Jeden plik `docs/22-przeplywy-i-nawigacja.md` (po polsku): krok 1 (lista przepływów — tabela), krok 2 (mapa + problemy), krok 3–4
(warianty, rekomendacja, kolejność), na końcu lista „[DO WYJAŚNIENIA]” i pytania do właściciela (pojedynczo, z opcjami).
Bez nazw innych aplikacji w propozycjach tekstów aplikacji (opis neutralny). Nie zmieniaj kodu.
