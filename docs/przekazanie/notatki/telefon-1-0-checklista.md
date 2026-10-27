# Trening 1.0 — test na telefonie (obecny build z TestFlight)

## Wyniki (aktualizacja 27.10.2026)
| Punkt | Wynik |
|---|---|
| T-01 | ✅ OK — wersja 1.0.0 (1031) |
| T-04 | ⚠️ Pogrubiony tekst: OK (wyraźnie grubszy). **Wada:** przy największym tekście (Większe rozmiary dostępności) na ekranie **Trening** ucięta jest większość ikon, m.in. duża szara ikona (start kolejnego treningu). Trafi do przebiegu napraw. |
| T-02 | ✅ OK — bez zegarka: baner + dźwięk + wibracja; z zegarkiem na ręce: wibracja tylko na zegarku (tak działa iOS); zmiana przerwy, „Rest”, „Pause” OK |
| T-03 | ✅ OK — przy trybie skupienia koniec przerwy daje baner (R-004 do zamknięcia) |
| T-05 | ✅ OK |
| T-06 | ✅ OK |
| T-07 | ✅ OK |
| T-13 | ✅ OK |
| T-14 | ✅ OK |
| pozostałe (T-12, T-09, T-08, T-11) | do zrobienia |

**Ważne przy kolejnych punktach z powiadomieniami (T-03, T-13):** zdejmij zegarek albo włącz na nim tryb samolotowy — gdy zegarek jest na ręce i odblokowany, iOS wysyła powiadomienia tylko na zegarek, a telefon milczy.

Zakres: wszystkie punkty z docs/49 **oprócz T-10** (figury — sprawdzisz na nowym buildzie, ok. 10 min).
Wadę zgłaszaj numerem punktu, np. „T-05: …” — najlepiej ze zrzutem ekranu (w TestFlight: zrzut → „Udostępnij uwagi”).
Czas: ok. 45–60 min (w tym trening > 7 min i zakupy). Kolejność poniżej jest celowa — nie zmieniaj jej.

**Zanim zaczniesz (2 min)**
- [ ] iPhone naładowany > 50%, Wi-Fi włączone.
- [ ] Przełącznik dzwonka / przycisk czynności: **tryb dzwonka** (nie wyciszony). Głośność przyciskami z boku na ok. połowę.
- [ ] Apple Watch sparowany i na ręce (T-07), AirPods pod ręką (T-13).
- [ ] Zapisz, ile masz w aplikacji treningów w historii (Plan → historia) — przyda się przy T-09/T-12.

---

## Część 1 — wygląd i ekran blokady

- [ ] **T-01 Instalacja.** Aplikacja TestFlight → Trening → „Aktualizuj” (albo „Zainstaluj”). Uruchom Trening.
  - ikona i nazwa „Trening” poprawne; animacja startowa krótka (ok. 1 s);
  - ekran Trening: w nagłówku **nie ma** przycisku „Co nowego” ✦;
  - Twoje szablony i historia są na miejscu; nie ma komunikatu o błędzie danych;
  - zanotuj numer wersji: Więcej → O aplikacji (np. „1.0 (10xx)”) — podaj mi go.

- [ ] **T-04 Pogrubiony tekst i duży tekst.**
  1. Ustawienia (iOS) → Dostępność → Wyświetlanie i rozmiar tekstu → włącz **Pogrubiony tekst**.
  2. Zamknij Trening całkowicie (przesuń palcem od dołu i przytrzymaj, przesuń kartę Trening w górę), uruchom ponownie.
  3. Treść, przyciski i nagłówki mają być **wyraźnie grubsze** niż przed zmianą. Bez różnicy = wada.
  4. Tam samo → **Większy tekst** → włącz „Większe rozmiary dostępności” → suwak maksymalnie w prawo. Wróć do aplikacji: ekrany Trening, Plan i Więcej → Ustawienia — nic nie jest ucięte ani nie nachodzi na siebie.
  5. **Przywróć:** suwak na środek, „Większe rozmiary dostępności” wyłącz, Pogrubiony tekst wyłącz.

- [ ] **T-02 Ekran blokady (Live Activity) w języku aplikacji.**
  1. Ustawienia (iOS) → Trening → **Live Activities** włączone; Ustawienia → Trening → Powiadomienia → „Zezwalaj na powiadomienia” włączone, „Dźwięki” włączone.
  2. W aplikacji zacznij dowolny trening, odhacz serię (przerwa 2:00), zablokuj telefon przyciskiem bocznym.
  3. Na ekranie blokady: odliczanie przerwy; po 2:00 baner + dźwięk + wibracja.
  4. Odblokuj, w trakcie przerwy zmień jej długość (+/–): odliczanie na ekranie blokady też się zmienia.
  5. Więcej → Język → **English**. Nowa seria, zablokuj: etykieta **„Rest”** (nie „Przerwa”).
  6. Więcej → Język → **Deutsch**, nowa seria, zablokuj: **„Pause”**.
  7. Przywróć język aplikacji (Polski). Trening możesz porzucić albo kontynuować do T-03.

- [ ] **T-03 Powiadomienia pilne przy trybie skupienia (ryzyko R-004).**
  1. Ustawienia (iOS) → Powiadomienia → Trening: jest przełącznik **„Powiadomienia pilne”** — ma być włączony (zanotuj, czy w ogóle jest).
  2. Ustawienia → Skupienie → **Nie przeszkadzać** → Aplikacje → wybierz „**Wycisz powiadomienia z**” i dodaj **Trening** (w tym samym ekranie zostaw włączone „Powiadomienia pilne”).
  3. Włącz Nie przeszkadzać (Centrum sterowania → Skupienie → Nie przeszkadzać).
  4. W aplikacji odhacz serię z przerwą **1:00**, zablokuj telefon.
  5. Po 1:00: **ma pojawić się baner**. Sama wibracja bez banera = wada. Napisz mi dokładnie, co się stało (baner / dźwięk / wibracja).
  6. **Przywróć:** wyłącz Nie przeszkadzać; w ustawieniach skupienia usuń Trening z listy wyciszonych.

## Część 2 — Zdrowie, zegarek, głos

- [ ] **T-05 Zdrowie — zapis.**
  1. Trening → Więcej → Ustawienia → włącz „Zapisuj zakończone treningi do Apple Health” → w arkuszu Apple zezwól.
  2. Zrób krótki trening (1–2 serie) i zakończ go.
  3. Aplikacja Zdrowie → Przeglądaj → Aktywność → Treningi: **jeden** nowy wpis „Trening siłowy” (nie dwa).
  4. Odmowa: Ustawienia (iOS) → Zdrowie → Dostęp do danych i urządzenia → Trening → wyłącz wszystko. W aplikacji wyłącz i włącz ponownie przełącznik zapisu: ma być komunikat, a przełącznik zostaje wyłączony.
  5. **Przywróć:** w Ustawieniach Zdrowia włącz z powrotem dostęp dla Trening.

- [ ] **T-06 Zdrowie — odczyt.**
  1. Więcej → Ustawienia → włącz „Pokazuj dane z Apple Health”, zezwól.
  2. Plan → dzień z aktywnością: widać kroki itd.; sesja z treningiem z zegarka (jeśli masz): tętno i kcal.
  3. Wyłącz odczyt: te linie znikają.

- [ ] **T-07 Zegarek.**
  1. Na zegarku otwórz aplikację Trening (jeśli jej nie ma: iPhone → aplikacja Watch → Moje zegarki → przewiń do „Dostępne aplikacje” → Trening → Zainstaluj).
  2. Bez treningu na telefonie zegarek pokazuje „Zacznij trening na telefonie”.
  3. Zacznij trening na iPhonie: zegarek pokazuje ćwiczenie, serię, ciężar i powtórzenia.
  4. Odhacz serię na zegarku („Seria zrobiona”), sprawdź „Cofnij”; przerwa odlicza się na zegarku, na końcu wibracja.

- [ ] **T-13 Głos.**
  1. Więcej → Ustawienia → włącz „Zapowiedzi głosowe”.
  2. Załóż AirPods, włącz muzykę (dowolna aplikacja), wróć do treningu, odhacz serię: w słuchawkach zapowiedź następnego ćwiczenia, muzyka na chwilę ściszona i wraca.
  3. Zdejmij AirPods (bez słuchawek), odhacz serię: **cisza** z głośnika.

- [ ] **T-14 „Napisz do nas”.** Więcej → O aplikacji → „Napisz do nas”: otwiera się wiadomość z adresem wsparcia i wersją 1.0 w treści.

## Część 3 — dane (ważne: najpierw kopia)

- [ ] **T-12 Kopia i CSV.**
  1. Więcej → Kopia zapasowa → **eksport kopii** → w arkuszu „Zachowaj w Plikach” → wybierz folder (np. Na moim iPhonie → Trening). Zapamiętaj nazwę pliku.
  2. Tam samo **eksport CSV** do Plików.
  3. Import tej samej kopii: dane identyczne (liczba treningów jak w notatce z początku).
  4. Import CSV (tego samego pliku): jest podgląd; import **dopisuje**, nic nie usuwa. Bez zakupu pojawia się karta „Historia jest już w telefonie” z „Zobacz plany Pro ›”.

- [ ] **T-09 „Wyczyść wszystkie dane”** (dopiero gdy w T-12 kopia jest w Plikach — sprawdź w aplikacji Pliki, że plik istnieje).
  1. Więcej → Ustawienia → na dole „Wyczyść wszystkie dane” → potwierdź.
  2. Ćwiczenia, szablony i historia znikają; ustawienia wracają do domyślnych.
  3. Pliki → Na moim iPhonie → Trening → Backup: jest **nowy** plik kopii (zrobiony automatycznie przed czyszczeniem).
  4. **Nie przywracaj jeszcze** — najpierw T-08 (po czyszczeniu łatwiej wywołać „pierwszy trening”).

- [ ] **T-08 Okno „Pierwszy trening za Tobą!”** (bez zakupu).
  1. Zacznij trening na żywo i prowadź go **ponad 7 minut**, zakończ.
  2. Po podsumowaniu pojawia się okno „Pierwszy trening za Tobą!”.
  3. „Skąd ta cena? Poznaj indeks espresso.” → otwiera stronę w przeglądarce, strona się ładuje. Wróć.
  4. „Zobacz plany Pro ›” → ekran zakupu (nie kupuj). Wróć.
  5. „Super, trenuję dalej!” → okno się zamyka.
  6. Krótki kolejny trening (> 7 min nie jest konieczne): okno **nie wraca**.
  7. Jeśli okno się w ogóle nie pojawiło — napisz mi (to też informacja).

- [ ] **Przywrócenie danych.** Więcej → Kopia zapasowa → import kopii z T-12 (pierwszy plik). Sprawdź: historia i szablony wróciły (liczba treningów jak w notatce).

## Część 4 — zakupy (na końcu)

Aplikacja z TestFlight kupuje w środowisku testowym Apple — **nic nie płacisz**, nie potrzebujesz osobnego konta (arkusz zakupu ma dopisek o środowisku testowym; jeśli go nie ma — przerwij i napisz mi).

- [ ] **T-11 Zakup.**
  1. Bez zakupu: Więcej → Ustawienia → Subskrypcja → „Pełna wersja”: ekran zakupu z cenami, linki do polityki prywatności i warunków działają; „Zrealizuj kod” otwiera okno Apple (zamknij).
  2. Kup **miesięczny**: arkusz Apple — właściwa cena, **bez** okresu próbnego. Po zakupie: „Masz pełną wersję”.
  3. Kup **roczny** (zmiana planu w tej samej grupie): cena właściwa, bez okresu próbnego. Jeśli Apple nie pozwala — zapisz komunikat.
  4. Kup **dożywotni**: po zakupie „Masz dostęp na zawsze”.
  5. Włącz tryb samolotowy, zamknij i uruchom aplikację: pełna wersja nadal aktywna. Wyłącz tryb samolotowy.
  6. Usuń aplikację (przytrzymaj ikonę → Usuń aplikację), zainstaluj ponownie z TestFlight, Więcej → Ustawienia → Subskrypcja → „Przywróć zakupy”: dostęp wraca. (Dane po reinstalacji znikną — przywróć je importem kopii z Plików jak wyżej.)
  7. Jeśli któregoś planu nie da się kupić, bo konto testowe ma już zakup — napisz, który; zrobimy to inaczej.

---

**Na koniec napisz mi:** numer buildu (T-01) i listę: „OK” albo „T-xx: opis wady”. Wyniki T-03 i T-04 zamkną ryzyka R-004 i R-014.
Po nowym buildzie dostaniesz krótką listę różnicową (ok. 10 min): T-10 figury, karta ćwiczenia z rozwiniętą „Techniką”, jeden język z poprawek.
