# Czego brakuje użytkownikom aplikacji do logowania treningu — nasze wnioski

Stan: 05.10.2026 (research), przeniesiony na Dysk 12.10.2026. Pełny raport (recenzje, cytaty, liczby) leży poza repozytorium:
Dysk Google, folder „Trening App / 05 Research konkurencji”, https://drive.google.com/drive/folders/12G3HbHp_JwkvBcwv0zgzjS0h4hevEeAa
(plik `skargi-uzytkownikow-2026-10.md`). Zasada: CLAUDE.md, „Treści cudze i nazwy innych firm”. Poniżej tylko własne wnioski, bez nazw
innych aplikacji i bez cytatów.

Metoda w skrócie: ok. 1050 recenzji 1–3★ ze sklepów mobilnych, dopasowanie słów kluczowych; liczby to rząd wielkości, próbka nie jest losowa.

## Najczęstsze skargi (od najczęstszej)

1. Płatności: ściana płatności po rejestracji, odbieranie funkcji, które były darmowe (najostrzejsze oceny), niskie limity darmowej wersji.
2. Aktualizacje psujące przyzwyczajenia (przebudowa timerów, zmiany interfejsu bez powrotu do starego trybu).
3. Natrętne okna zakupu i „inteligentne” podpowiedzi, które same zmieniają wpisy.
4. Zawodny timer przerw (ekran blokady, dźwięk przy zgaszonym ekranie, powiadomienia).
5. Utrata historii treningów, wymuszone konto, wymagany internet na siłowni.
6. Interfejs niereagujący przy odhaczaniu serii.
7. Synchronizacja zegarka i zapis do Zdrowia.
8. Brak importu albo kopia, której nie da się wczytać.

## Najczęstsze życzenia

Edycja zakończonego treningu i trening wstecz; pauza treningu; „pomiń ćwiczenie dziś”; przeniesienie zmian z treningu do szablonu (u nas tylko
na wyraźne polecenie użytkownika — zasada szablonów w CLAUDE.md); notatka przechodząca na następny trening; ciężar bazowy i poziom maszyny;
strona ciała i RIR; elastyczna baza ćwiczeń (zmiana typu bez utraty historii, scalanie); timer w tle; kalendarz i widok miesiąca; lepsze wykresy;
foldery i archiwum szablonów; import i kopia możliwa do odtworzenia; aplikacja na zegarek; znajomi zamiast publicznego feedu; wypróbowanie przed
zapłatą i jednorazowy zakup zamiast abonamentu.

## Co to znaczy dla nas (propozycja, nie decyzja)

- Mocne strony odpowiadają na najczęstsze skargi: praca offline, brak konta, brak nagabywania, podpowiedź progresji nie zmienia wpisów,
  kopie danych, odzyskiwanie po uszkodzonym stanie.
- Ryzyko: model „cała aplikacja zablokowana po okresie próby” powtarza wzorzec, który najostrzej oceniają użytkownicy. Decyzja o płatnościach:
  docs/15 (sekcja płatności), należy do właściciela.
- Cena i zasady próby powinny być widoczne od pierwszego ekranu i w opisie w App Store (ściana płatności po rejestracji to druga co do ostrości skarga).
- Aktualizacje: zmiany interfejsu wprowadzać stopniowo albo z możliwością powrotu do starego zachowania (lekcja 2 w docs/11).
- Do sprawdzenia: wydajność długiego treningu (np. 30 ćwiczeń × 5 serii), zbędne potwierdzenia i automatyczne przeskoki, zasłanianie przycisków przez
  timer w superserii, możliwość wpisania ciężaru 0,25 kg.
- Poza zakresem teraz: aplikacja na zegarek (największe źródło skarg na synchronizację), publiczny feed (wymaga serwera, ADR-025), tryby interwałowe.
