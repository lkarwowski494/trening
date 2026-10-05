# 15. Publikacja w App Store — decyzje i plan (stan 05.10.2026)

## Decyzje właściciela

Rozmowa 05.10.2026, rano: „Chciałbym móc opublikować to w Apple Store” i odpowiedzi na pytania.

- **Publikacja:** „Jeszcze nie publikujemy, zastanowimy się nad tym za chwilę” — **nic nie jest wysyłane** do App Store Connect.
- **Wysyłka (gdy przyjdzie czas):** GitHub Actions i klucz App Store Connect API (.p8).
  - Build na darmowym macOS, jak `iphone-local.yml`. Wysyłka przez `xcrun altool`.
  - Klucz tylko jako sekret GitHub, nigdy w repo (CLAUDE.md, ADR-031). Bez `eas submit`: limitów darmowego planu dla Submit nie sprawdzono.
- **Polityka prywatności:** GitHub Pages z tego repozytorium (`docs/`).
  - Treść: brak zbierania danych, wszystko lokalnie na telefonie, HealthKit tylko zapis zakończonych treningów.
- **Cena:** „Darmowa na start” (05.10.2026) — bez reklam i zakupów; w App Store Connect deklaracja „nie jestem traderem” (DSA), bez publicznego adresu.
- **Płatności później, wcześniejsi użytkownicy za darmo** (właściciel 05.10.2026: „Później najwyżej wprowadzimy płatności, ale tym, co już mają, to zostawimy darmową”).
  Kierunek (do decyzji, gdy przyjdzie czas): aplikacja dalej darmowa do pobrania, wersja Pro jako zakup w aplikacji;
  kto pobrał przed wersją płatną, ma Pro bez opłaty — StoreKit 2 `AppTransaction.originalAppVersion` (Apple podaje numer
  **buildu** z pierwszego pobrania, nie wersję marketingową). Wymóg już dziś: numery buildów tylko rosną i są zapisywane
  (EAS `appVersionSource: remote` + `autoIncrement`). Płatna wersja = status tradera (DSA: adres i telefon publicznie) i PIT.
  Konto: Apple Developer jako osoba fizyczna (Individual) — firma niepotrzebna.
- **Nazwa:** otwarta. Propozycja „Trening” — do sprawdzenia w sklepie.

## Zmiany w aplikacji już zrobione pod publikację

- **Poranny wpis usunięty z aplikacji** (decyzja 05.10.2026: „Nie wszyscy mają czym to mierzyć”, wariant „usunąć z aplikacji”).
  - Zniknęły: ekran `more/morning`, pozycje na ekranie głównym i w Więcej, dopisek „BB · sen” w nagłówku treningu i przypomnienie o wadze.
  - Przypomnienie zaplanowane przez starszą wersję jest odwoływane przy starcie.
  - Zapisane wpisy (`State.mornings`) **zostają** w danych i w kopii — możliwy powrót.
  - Przy okazji znika nazwa „Body Battery” (znak towarowy Garmina), która przy recenzji Apple byłaby ryzykiem.
  - Podpowiedź notatki treningu: „np. samopoczucie, ból, sprzęt”.
  - Testy: `tests/morning-removed.test.tsx`.

## Do zrobienia przed pierwszą wysyłką (otwarte)

1. **Twoja reguła publikacji:** audyt całej historii git przed publikacją.
   - Klucze, tokeny, .env, .p8, certyfikaty.
   - Adresy e-mail w commitach.
   - Ustawienia workflow: zgoda na przebiegi z cudzych zmian, brak sekretów dla forków.
   - Logi i artefakty przebiegów.
   - Wyniki — przed włączeniem wysyłki.
2. **App Store Connect (właściciel, w przeglądarce):**
   - rekord aplikacji (bundle `pl.lukasz.trening`), nazwa, kategoria (Health & Fitness), ocena wieku;
   - App Privacy: „Data Not Collected”, do potwierdzenia;
   - klucz API (rola App Manager) → sekrety repo.
3. **Profil „App Store”:** certyfikat dystrybucyjny i profil App Store w EAS credentials. Dziś jest tylko ad hoc.
4. **`ITSAppUsesNonExemptEncryption: false`** w `app.json` (aplikacja nie używa własnego szyfrowania). Do potwierdzenia przy audycie.
5. **Zrzuty ekranu** (6,9″ i 6,5″) z symulatora — Maestro `takeScreenshot` albo `scripts/screens`. Opis PL/EN.
6. **Strona polityki prywatności i wsparcia** na GitHub Pages.
7. **Elementy specyficzne dla właściciela do przejrzenia** przed sklepem: presety ViShape, teksty o „domu właściciela” w podpowiedziach, dane demo.
