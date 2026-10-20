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

## Bramka W0

Wynik bramki W0: **[DO USTALENIA]** — w repozytorium nie ma zapisanego wyniku ani opisu bramki (materiały roli 02 leżą poza repozytorium, u właściciela). Wpisać wynik z datą i źródłem, gdy właściciel go dostarczy;
informacja nie zmienia modelu.

## Historia (nieaktualne kwoty)

Wcześniejsze ceny i okresy (29 zł/rok, 3 miesiące, 1 miesiąc, 5,99 / 4,99 / 21,99 / 29,99 USD i inne) zostały zastąpione; są w docs/15 (bloki historii) i docs/18 (wpisy z datą). Nie obowiązują.
