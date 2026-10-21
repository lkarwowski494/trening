# Monetyzacja — model stały (jedno miejsce)

Stan: 20.10.2026. Model jest **stały** (decyzja właściciela 19.10.2026; cena roczna 6,99 USD — 20.10.2026, docs/18): żadna naprawa ani decyzja nie zmienia ceny, okresu próbnego, limitu ani podziału darmowe/płatne.
Ten dokument jest jedynym miejscem, w którym zapisane są kwoty i liczby modelu. Inne dokumenty (docs/15, docs/18, docs/27) opisują historię decyzji i odsyłają tutaj; zgodność z kodem pilnuje `tests/audit-m1-045-store-description.test.ts`
(stałe w kodzie: `FAKE_PRICES` i `PLN_PRICES` w `lib/store-fake.ts`, `TRIAL_DAYS` w `lib/products.ts`, `PAYWALL.FREE_LIVE_PER_MONTH` w `lib/access.ts`, plik `store/Trening.storekit`).

## Model

| plan | USD / EUR / GBP | rodzaj |
|---|---|---|
| miesięczna | 0,99 | subskrypcja odnawiana automatycznie |
| roczna | 6,99 | subskrypcja odnawiana automatycznie |
| dożywotnia | 14,99 | zakup jednorazowy (non-consumable) |

- **Okres próbny:** **14 dni** — oferta wprowadzająca Apple (2 tygodnie) w obu subskrypcjach; dożywotnia bez okresu próbnego.
- **Po wygaśnięciu subskrypcji lub próby:** **4 treningi na żywo** w miesiącu kalendarzowym za darmo; dopisywanie wstecz bez limitu; historia, kopia zapasowa i eksport zawsze (decyzje 09.10.2026 pkt 5 i 06.10.2026, docs/15 — historia).
- **Chmura rodzinna (Family Sharing):** TAK dla subskrypcji i dostępu dożywotniego (11.10.2026). **[OTWARTE]** czy włączenie jest nieodwracalne — sprawdzić w App Store Connect przed wysyłką.
- **Ceny lokalne (Polska):** miesięczna 4,99 zł, roczna 19,99 zł, dożywotnia 59,99 zł — ustawione ręcznie w App Store Connect (14.10.2026, docs/18; 20.10.2026: „PL bez zmian”). Pozostałe kraje przelicza Apple z ceny bazowej.
  Ceny w App Store Connect ustawia właściciel (instrukcja: `kroki-wlasciciela.md`, K-CENA).
- **Kody ofertowe Apple** (offer codes) na darmową subskrypcję: decyzja 09.10.2026 (wariant A), szczegóły wdrożenia: docs/27.
- **Zasada cenowa (09.10.2026):** cena w kraju = lokalny próg zakupu impulsowego, nie przeliczenie kursowe — dotyczy ręcznych korekt cen lokalnych w App Store Connect.

## Stan wdrożenia w kodzie

Zakupy są za przełącznikiem: `PAYWALL.ENABLED = false` (`lib/access.ts`), więc bieżący TestFlight działa bez limitu i bez ekranu zakupu. Włączenie = zmiana tej stałej + wydanie.
Blok cenowy w opisie sklepu (docs/15) wstawia się dopiero z działającym zakupem.

## Bramka W0 — opłacalność (21.10.2026)

Bramkę przeprowadziła rola 02 (moduł „opłacalność”) 21.10.2026 na prośbę właściciela; zastępuje wcześniejszy zapis „brak” (K-P4-3). Raport i dane źródłowe (oceny konkurentów, ceny, kursy) są poza repozytorium, w katalogu przebiegu M3 u właściciela.

- **Próg:** 500 USD netto/rok globalnie (po prowizji i VAT; decyzja właściciela 21.10.2026). Koszty pieniężne aplikacji: 0 USD (opłata Apple Developer to koszt portfela).
- **Wynik (sam iOS, model stały):** pesymistyczny ok. 4 USD · normalny ok. **570 USD** · optymistyczny ok. 23 tys. USD/rok → werdykt **wydać**, ale tuż nad progiem. Wynik normalny przeliczony niezależnie przez weryfikatora (zgodny).
- **Wrażliwość:** spadek o 25% jednego z głównych założeń (instalacje na ocenę, udział nowej aplikacji w ocenach kategorii, konwersja pobranie → płacący) daje ok. 427 USD („przerobić”). Instalacje na ocenę to założenie bez benchmarku (rozrzut 10×); konwersja z jednego raportu branżowego (szczebel 4) — oznaczenie „jedno źródło”.
- **Prowizja:** liczona 15% (Small Business Program; zgłoszenie złożone 14.10.2026, docs/18). Przy 30% wynik normalny ok. 469 USD. Potwierdzenie przyjęcia przez Apple — krok właściciela.
- **Punkt kontrolny (decyzja właściciela 21.10.2026):** po 8 tygodniach od premiery w App Store Connect (Analityka): **≥ ok. 310 pobrań miesięcznie** albo tempo **≥ 75 płacących rocznie**. Poniżej — przegląd modelu dotarcia i zakresu (nie cen; model stały). Ten sam termin co decyzja o Androidzie (DEC-26).

## Historia (nieaktualne kwoty)

Wcześniejsze ceny i okresy (29 zł/rok, 3 miesiące, 1 miesiąc, 5,99 / 4,99 / 21,99 / 29,99 USD i inne) zostały zastąpione; są w docs/15 (bloki historii) i docs/18 (wpisy z datą). Nie obowiązują.
