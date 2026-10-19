# 34. Wsparcie i opinie użytkowników — proces

Stan: 13.10.2026. Decyzje właściciela z tego dnia: pkt „Decyzje” na końcu. Strony publiczne: `site/support.html`, `site/privacy.html` (sekcja „Gdy do nas piszesz”).
Specyfikacja źródłowa: raport analityka z 13.10.2026 (w transkrypcie; skrót poza repo). Zmiana procesu → zmiana tego pliku i stron.

## 1. Kanały
| Kanał | Co tam trafia | Uwagi |
|---|---|---|
| support@apps4brew.com | pytania, błędy, pomysły | główny; adres przekierowany (Porkbun) do osobnej skrzynki Gmail tylko dla wsparcia; hello@apps4brew.com przekierowany tak samo |
| Recenzje w App Store Connect | oceny i recenzje | odczyt osobnym kluczem o najmniejszej roli (decyzja 5A) |
| TestFlight | opinie testerów i raporty awarii | odczyt przy przeglądzie tygodniowym |
| GitHub Issues | zgłoszenia techniczne | publiczne — strona wsparcia ostrzega, żeby nie podawać danych osobowych |
| Przycisk „Napisz do nas” w Więcej → O aplikacji | otwiera pocztę użytkownika (mailto) | decyzja 2A; wdraża osobna gałąź (f-zamykanie), aplikacja nadal niczego nie wysyła |
| Przycisk „Poproś o nową funkcję” w Więcej → O aplikacji oraz link „Czego Ci brakuje? Poproś o funkcję” na podsumowaniu co 10. trening | ta sama poczta i ten sam adres; temat „Pomysł: …” | decyzja właściciela 14.10.2026 (pkt 8); wdraża gałąź f020-pomysl, bez serwera |

## 2. Obieg sprawy
1. **Zbieranie** — przegląd skrzynki, recenzji, TestFlight i Issues (rytm: pkt 3).
2. **Porządkowanie** (agent): kategoria (błąd / pomysł / pytanie / pochwała / inne), duplikaty (łączymy w jedną sprawę z licznikiem), **ocena realności** wg CLAUDE.md, „Audyty i wydania” pkt 6
   (realny / brzegowy / teoretyczny, z krokami w aplikacji) oraz **próg wydań** (KRYTYCZNE i WYSOKIE blokują wydanie; ŚREDNIE i NISKIE → backlog z wersją).
3. **Zapis** w arkuszu Dysku „Trening App / 06 Opinie”: zakładka *Zgłoszenia z danymi osobowymi* (adres, treść, data, status; dostęp ograniczony), zakładka *Sprawy zanonimizowane*
   (kategoria, realność, ważność, wersja aplikacji, status, bez danych osobowych — tylko ta trafia do analiz i do repozytorium w postaci wniosków), zakładka *Mierniki*.
4. **Decyzja właściciela** — co robimy (naprawa teraz / backlog z wersją / nie planujemy). Decyzje produktowe: co najmniej dwie opcje i rekomendacja (CLAUDE.md).
5. **Odpowiedź** — agent przygotowuje **szkic** wg szablonów (na Dysku, PL/EN), wysyła **właściciel** (decyzja 3A; po miesiącu bez wpadek możliwe przejście na wysyłkę po akceptacji zbiorczej — wariant B, do decyzji).
6. **„Zrobione w X”** — po wydaniu osoba, która poprosiła, dostaje wiadomość z numerem wersji; w „Co nowego” dopisek „na Waszą prośbę” (decyzja 6B, bez imion i danych).

## 3. Rytm i pilne
- Przegląd **raz w tygodniu** oraz **przed każdym audytem** (decyzja 4A).
- **Pilne**: filtr Gmail na słowa pilne (m.in. „utrata danych”, „zniknęły”, „crash”, „nie otwiera się”, „prywatność”, „dane osobowe”, „urgent”, „lost data”) — lista słów w ustawieniach filtra, nie w repozytorium. Treść spełniająca próg KRYTYCZNE/WYSOKIE
  (utrata lub zepsucie danych, awaria, prywatność/bezpieczeństwo, bariera dostępności) → **eskalacja do właściciela natychmiast**, bez czekania na przegląd; ocena realności zawsze, także przy rzadkim przypadku.
- Czas odpowiedzi zapowiedziany na stronie: „zwykle w ciągu tygodnia”.

## 4. Prywatność
- **Zero danych osobowych w repozytorium** (publiczne, ADR-031): adresy, treści wiadomości, nazwiska, UDID. Pilnuje test w `tests/public-repo.test.ts` (adresy e-mail w `docs/`, `site/`, `lib/`, `app/` tylko z listy:
  support@apps4brew.com, hello@apps4brew.com; skan plików, nie historii; wyjątek: wygenerowany `lib/licenses.generated.ts` z autorami pakietów). W repo trafiają wyłącznie wnioski zanonimizowane.
- **Zakres dostępu agenta do skrzynki**: tylko skrzynka wsparcia (nie prywatna poczta właściciela); odczyt i szkice; **bez wysyłki bez akceptacji właściciela**; **bez usuwania** poza retencją.
- **Retencja**: 12 miesięcy od zamknięcia sprawy (decyzja 7A), potem usunięcie wiadomości i wiersza z zakładki z danymi osobowymi; zanonimizowana sprawa zostaje.
- Podstawa prawna i odbiorcy: `site/privacy.html` (art. 6 ust. 1 lit. f RODO; Porkbun, Google, dostawca narzędzi AI). **[OTWARTE]** weryfikacja przez badacza RODO/DPA (patrz pkt 6).
- Załączniki: kopia zapasowa z danymi tylko na prośbę; po sprawie usuwana razem z wiadomością.

## 5. Mierniki (zakładka *Mierniki*)
Liczba zgłoszeń na tydzień; czas do pierwszej odpowiedzi (cel: do tygodnia); udział błędów realnych / brzegowych / teoretycznych; liczba spraw zamkniętych „zrobione w X”;
liczba eskalacji pilnych; liczba wpadek w szkicach (warunek przejścia z wariantu A na B w decyzji 3). Mierniki liczone z zakładki zanonimizowanej, nie z danych osobowych.

## 6. Otwarte (do badacza, wyniki dopisać z datą)
- Rola klucza App Store Connect wystarczająca do czytania recenzji (najmniejsza możliwa) — decyzja 5A zakłada potwierdzenie.
- App Privacy (etykieta w App Store) wobec opcjonalnego kontaktu e-mail przez przycisk w aplikacji.
- RODO/DPA przy skrzynce Gmail jako narzędziu właściciela (osoba fizyczna): umowy powierzenia, retencja 12 mies. — zastrzeżenie do decyzji 7A.
- Warunki dostawcy narzędzi AI (czy treść wiadomości może być przetwarzana, retencja po stronie dostawcy).

## 7. Decyzje właściciela (13.10.2026)
1. **1C** — osobna skrzynka Gmail tylko dla wsparcia (zakłada właściciel); support@apps4brew.com i hello@apps4brew.com przekierowane przez Porkbun. Odrzucone: A (etykieta w prywatnej poczcie), B (ręczne przeglądanie).
2. **2A** — przycisk „Napisz do nas” w Więcej → O aplikacji (wdraża inny agent, gałąź f-zamykanie).
3. **3A** — agent przygotowuje szkice, wysyła właściciel; po miesiącu bez wpadek rozważyć B.
4. **4A** — przegląd raz w tygodniu + przed audytem + filtr Gmail na słowa pilne.
5. **5A** — osobny klucz App Store Connect o najmniejszej roli do czytania recenzji (rolę potwierdzi badacz).
6. **6B** — „na Waszą prośbę” w „Co nowego”.
7. **7A** — retencja 12 miesięcy od zamknięcia sprawy (z zastrzeżeniem wyniku badacza RODO/DPA).
8. **„Poproś o nową funkcję”** (14.10.2026, docs/18) — osobny przycisk obok „Napisz do nas” (ta sama funkcja `openSupportMail` w `lib/support.ts`, ten sam adres, to samo zachowanie bez poczty), temat „Pomysł: …”, treść: „Czego brakuje:” / „W jakiej sytuacji na treningu:” + stopka techniczna (wersja, iOS, język; bez danych treningowych i identyfikatorów).
   Dodatkowo dyskretny link na podsumowaniu świeżo zakończonego treningu co N-ty trening: **N = 10 (`IDEA.EVERY_N_WORKOUTS` w `lib/review.ts`; liczba produktowa, decyzja właściciela — nie merytoryczna)**, zamykany „✕” bez skutków.
   Licznik: opcjonalne pole `Settings.ideaShownAt` (liczba ukończonych treningów w chwili pokazania; bez zmiany schematu, migracja odrzuca złe wartości, trafia do kopii).
   Niezmienniki: link nigdy na tym samym ekranie co prośba o ocenę — przy kolizji **pierwszeństwo ma ocena** (Apple ogranicza liczbę próśb), link czeka na najbliższy trening bez oceny (licznik liczy od ostatniego POKAZANIA, więc zaległość nie przepada);
   link tylko na podsumowaniu świeżo zakończonego treningu (nie przy otwarciu z historii); jedna reguła nie wyłącza drugiej (test 100 treningów: ocena i link pojawiają się). Odrzucone: jeden przycisk z wyborem rodzaju, formularz w aplikacji (serwer, prywatność).
   Teksty (5 kluczy × 35 języków) wpisane z najlepszą wiedzą — **do przeglądu tłumacza** (lista w raporcie wdrożenia).
