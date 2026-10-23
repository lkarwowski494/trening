# Monetyzacja — model stały (jedno miejsce)

Stan: 22.10.2026. Model **M5 S1** (decyzja właściciela 22.10.2026, docs/18; badanie: `docs/monetyzacja-badanie-2026-10.md` rozdz. 10–11) jest **stały**: cała aplikacja darmowa do 5 dni treningowych w miesiącu,
Pro (subskrypcja miesięczna, roczna albo dostęp dożywotni) zdejmuje limit, bez okresu próbnego. Żadna naprawa ani decyzja nie zmienia ceny, limitu ani podziału darmowe/płatne (cena roczna 6,99 USD — 20.10.2026).
Ten dokument jest jedynym miejscem, w którym zapisane są kwoty i liczby modelu. Inne dokumenty (docs/15, docs/18, docs/27) opisują historię decyzji i odsyłają tutaj; zgodność z kodem pilnuje `tests/audit-m1-045-store-description.test.ts`
(stałe w kodzie: `FAKE_PRICES` i `PLN_PRICES` w `lib/store-fake.ts`, `PAYWALL.FREE_TRAINING_DAYS_PER_MONTH` w `lib/access.ts`, plik `store/Trening.storekit`).

## Model

| plan | cena bazowa (USD; GBP jak USD, EUR — niżej) | rodzaj |
|---|---|---|
| miesięczna | 0,99 | subskrypcja odnawiana automatycznie |
| roczna | 6,99 | subskrypcja odnawiana automatycznie |
| dożywotnia | 14,99 | zakup jednorazowy (non-consumable) |

- **Okres próbny:** **Bez okresu próbnego** i bez ofert wprowadzających (usunięte 22.10.2026: dawne 14 dni, `TRIAL_DAYS`, przypomnienie o końcu próby i wnioskowanie próby na iOS 16.4–17.1 — M1-011/M1-017/M1-041a). Ryzyko R-M5-3 (docs/40): oferty w App Store Connect usuwa właściciel, zamyka kontrola ASC.
- **Darmowy poziom:** **5 dni treningowych** w miesiącu kalendarzowym (`PAYWALL.FREE_TRAINING_DAYS_PER_MONTH`). Dzień treningowy = data startu (wg strefy treningu) z co najmniej jednym ukończonym treningiem **na żywo trwającym ponad 7 minut** (`MIN_LIVE_MINUTES_FOR_DAY`, czas bez pauz jak w historii; „Zakończ” albo zapis po 6 h bez aktywności).
  Kolejny trening tego samego dnia nie zużywa limitu i zawsze wolno go zacząć. Trening wstecz (także z dzisiejszą datą), import, edycja, anulowany, trwający i krótszy niż 7 minut nie zużywają dnia i nigdy nie są blokowane. Blokada dotyczy tylko startu treningu w nowym dniu ponad limit; dane (historia, edycja, dopisywanie wstecz, kopia, eksport) zawsze dostępne.
  Dni są **zapisane osobno w stanie aplikacji** (`State.liveDays`, w kopii zapasowej; zapis przy ukończeniu sesji; migracja uzupełnia je z historii) — usunięcie treningu nie zwraca dnia (R-M5-1 zamknięte decyzją 22.10.2026). Po wygaśnięciu Pro liczą się dni od chwili wygaśnięcia (P3 B). Ryzyka przyjęte bez naprawy: zmiana daty w telefonie (R-M5-2), ręczne wpisy omijające limit (R-M5-4), ponowna instalacja/drugie urządzenie bez kopii (R-M5-5).
- **Chmura rodzinna (Family Sharing):** TAK dla subskrypcji i dostępu dożywotniego (11.10.2026). **[OTWARTE]** czy włączenie jest nieodwracalne — sprawdzić w App Store Connect przed wysyłką.
- **Euro (21.10.2026, decyzja właściciela):** subskrypcja roczna **7,99 €** — przeliczenie Apple z ceny bazowej w USD (z VAT), bez ręcznej korekty w ~20 krajach strefy euro; odrzucone: ręcznie 6,99 € (zbyt dużo kliknięć). GBP roczna 6,99 £ (sprawdzone 21.10). Miesięczna w euro: 0,99 € (sprawdzone przez właściciela 21.10). **[OTWARTE]** dożywotnia w euro — sprawdzi workflow kontrolny App Store Connect.
- **Ceny lokalne (Polska):** miesięczna 4,99 zł, roczna 19,99 zł, dożywotnia 59,99 zł — ustawione ręcznie w App Store Connect (14.10.2026, docs/18; 20.10.2026: „PL bez zmian”). Pozostałe kraje przelicza Apple z ceny bazowej.
  Ceny w App Store Connect ustawia właściciel (instrukcja: `kroki-wlasciciela.md`, K-CENA).
- **Kody ofertowe Apple** (offer codes) na darmową subskrypcję: decyzja 09.10.2026 (wariant A), szczegóły wdrożenia: docs/27.
- **Zasada cenowa (09.10.2026):** cena w kraju = lokalny próg zakupu impulsowego, nie przeliczenie kursowe — dotyczy ręcznych korekt cen lokalnych w App Store Connect.

## Ceny w App Store Connect — oczekiwane (kontrola)

Stan: 21.10.2026 (właściciel). Te kwoty czyta kontrola `store/asc-kontrola.json` (workflow „ASC kontrola ustawień”, tylko odczyt); zgodność tabeli z plikiem pilnuje `tests/asc-kontrola.test.ts`.
Roczna w euro 7,99 € i dożywotnia 17,99 € to przeliczenie Apple z ceny bazowej (decyzje właściciela 21.10.2026), miesięczna 0,99 €; funty jak USD (0,99 / 6,99 / 14,99 £) — stan potwierdzony kontrolą ASC 21.10.2026.

| plan | USA (USD) | Polska (PLN) | strefa euro (EUR) | Wielka Brytania (GBP) |
|---|---|---|---|---|
| miesięczna | 0,99 | 4,99 | 0,99 | 0,99 |
| roczna | 6,99 | 19,99 | 7,99 | 6,99 |
| dożywotnia | 14,99 | 59,99 | 17,99 | 14,99 |

## Stan wdrożenia w kodzie

Zakupy są włączone: `PAYWALL.ENABLED = true` (`lib/access.ts`; w Jest przełącznik jest domyślnie wyłączony w `tests/setup.js`, testy dostępu włączają go jawnie). Ekran zakupu pokazuje się tylko przy starcie treningu ponad limit
i z Ustawień → „Subskrypcja”; na ekranie startu licznik „Pozostało X z 5 darmowych dni treningowych w tym miesiącu”. Plany (nazwy robocze, do przeglądu właściciela): roczny „Training is part of my week”, miesięczny „Still finding my rhythm”, dożywotni „Training is my life”.
Build E2E (sztuczny sklep) ma limit 0 dni (`E2E_FREE_TRAINING_DAYS`), żeby pierwszy start po wygaśnięciu dostępu otwierał ekran zakupu.

## Bramka W0 — opłacalność (21.10.2026)

Bramkę przeprowadziła rola 02 (moduł „opłacalność”) 21.10.2026 na prośbę właściciela; zastępuje wcześniejszy zapis „brak” (K-P4-3). Raport i dane źródłowe (oceny konkurentów, ceny, kursy) są poza repozytorium, w katalogu przebiegu M3 u właściciela.

- **Próg:** 500 USD netto/rok globalnie (po prowizji i VAT; decyzja właściciela 21.10.2026). Koszty pieniężne aplikacji: 0 USD (opłata Apple Developer to koszt portfela).
- **Uwaga 22.10.2026:** poniższy wynik dotyczy modelu z 19.10.2026 (14 dni próby, 4 treningi). Dla M5 S1 rachunek badania (rozdz. 10) daje wynik normalny ok. 471 USD/rok, czyli poniżej progu 500 USD; model wybrany przez właściciela świadomie (decyzja 22.10.2026).
- **Wynik (sam iOS, model stały):** pesymistyczny ok. 4 USD · normalny ok. **570 USD** · optymistyczny ok. 23 tys. USD/rok → werdykt **wydać**, ale tuż nad progiem. Wynik normalny przeliczony niezależnie przez weryfikatora (zgodny).
- **Wrażliwość:** spadek o 25% jednego z głównych założeń (instalacje na ocenę, udział nowej aplikacji w ocenach kategorii, konwersja pobranie → płacący) daje ok. 427 USD („przerobić”). Instalacje na ocenę to założenie bez benchmarku (rozrzut 10×); konwersja z jednego raportu branżowego (szczebel 4) — oznaczenie „jedno źródło”.
- **Prowizja:** liczona 15% (Small Business Program; zgłoszenie złożone 14.10.2026, docs/18). Przy 30% wynik normalny ok. 469 USD. Potwierdzenie przyjęcia przez Apple — krok właściciela.
- **Punkt kontrolny (decyzja właściciela 21.10.2026):** po 8 tygodniach od premiery w App Store Connect (Analityka): **≥ ok. 310 pobrań miesięcznie** albo tempo **≥ 75 płacących rocznie**. Poniżej — przegląd modelu dotarcia i zakresu (nie cen; model stały). Ten sam termin co decyzja o Androidzie (DEC-26).

## Historia (nieaktualne kwoty)

Wcześniejsze ceny i okresy (29 zł/rok, 3 miesiące, 1 miesiąc, 5,99 / 4,99 / 21,99 / 29,99 USD i inne) zostały zastąpione; są w docs/15 (bloki historii) i docs/18 (wpisy z datą). Nie obowiązują.
