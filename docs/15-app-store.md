# 15. Publikacja w App Store — decyzje i plan (stan 05.10.2026)

## Decyzje właściciela

Rozmowa 05.10.2026, rano: „Chciałbym móc opublikować to w Apple Store” i odpowiedzi na pytania.

- **Publikacja:** „Jeszcze nie publikujemy, zastanowimy się nad tym za chwilę” — **nic nie jest wysyłane** do App Store Connect.
- **Wysyłka (gdy przyjdzie czas):** GitHub Actions i klucz App Store Connect API (.p8).
  - Build na darmowym macOS (`testflight.yml`; wcześniejsze workflowy EAS i `iphone-local.yml` usunięte 08.10.2026). Wysyłka po eksporcie do App Store Connect.
  - Klucz tylko jako sekret GitHub, nigdy w repo (CLAUDE.md, ADR-031). Bez Expo/EAS — workflowy EAS usunięte 08.10.2026.
- **Polityka prywatności:** GitHub Pages z tego repozytorium, z osobnego katalogu `site/` przez GitHub Actions (`.github/workflows/pages.yml`;
  decyzja właściciela 12.10.2026, audyt przed App Store F2, wariant A) — strona `site/privacy.html` (PL/EN, 08.10.2026, audyt N2; treść zgodna
  z kodem: brak wywołań sieciowych, HealthKit tylko zapis, powiadomienia lokalne). Publikowany jest tylko `site/` (trzy strony); reszta `docs/`
  (dziennik decyzji, raporty, research) nie jest publikowana. **Krok właściciela po scaleniu do `main`:** Settings → Pages → Source: GitHub Actions
  (zamiast „Deploy from a branch → main / docs”); pierwsze wdrożenie uruchamia się samo przy zmianie `site/**` na `main` albo ręcznie
  (Actions → Pages → Run workflow). Adres: https://lkarwowski494.github.io/trening/privacy.html (do App Store Connect → App Privacy).
  Bez `.nojekyll` — artefakt z Actions jest podawany bez Jekylla.
  - Treść: brak zbierania danych, wszystko lokalnie na telefonie, HealthKit tylko zapis zakończonych treningów.
- **Strona www i wsparcie (11.10.2026, marka Apps4Brew, PL/EN):** `site/index.html`, `site/support.html`; adres wsparcia (App Store Connect → Support URL): https://lkarwowski494.github.io/trening/support.html. Domena apps4brew.com po zakupie (bez CNAME); kontakt: GitHub Issues — adres e-mail do uzupełnienia po zakupie domeny.
<!-- historia:start A -->
*Historia decyzji (06–20.10.2026): kwoty, okresy próbne i modele z tego bloku są zastąpione — obowiązuje wyłącznie `docs/monetyzacja.md`. Treść zostaje jako zapis, dlaczego model wygląda tak, a nie inaczej.*

- **Cena:** „Darmowa na start” (05.10.2026) — bez reklam i zakupów; w App Store Connect deklaracja „nie jestem traderem” (DSA), bez publicznego adresu.
- ~~**Płatności później, wcześniejsi użytkownicy za darmo**~~ (odwołane 06.10.2026: płatna subskrypcja od pierwszej wersji, bez darmowych użytkowników; było — właściciel 05.10.2026: „Później najwyżej wprowadzimy płatności, ale tym, co już mają, to zostawimy darmową”).
  Kierunek (do decyzji, gdy przyjdzie czas): aplikacja dalej darmowa do pobrania, wersja Pro jako zakup w aplikacji;
  kto pobrał przed wersją płatną, ma Pro bez opłaty — StoreKit 2 `AppTransaction.originalAppVersion` (Apple podaje numer
  **buildu** z pierwszego pobrania, nie wersję marketingową). Wymóg już dziś: numery buildów tylko rosną i są zapisywane
  (od 08.10.2026 jedyne źródło to `BUILD_BASE` + numer przebiegu `testflight.yml`; liczniki EAS usunięte z `eas.json`, audyt M1-021). Płatna wersja = status tradera (DSA: adres i telefon publicznie) i PIT.
- **Okres próbny dla nowych** (właściciel 05.10.2026: „Nowi użytkownicy powinni dostać 30 dni za darmo. Może nawet 60”;
  wcześniejsi — darmowo do końca, „chyba że zrezygnuje z darmowej subskrypcji, a później zdecyduje się wrócić”). Ustalenia:
  - Aplikacja płatna przy pobraniu nie może mieć okresu próbnego w App Store — okres próbny wymaga darmowego pobrania i zakupu w aplikacji.
  - Subskrypcja: darmowy okres próbny Apple ma stałe długości (m.in. 1 miesiąc, 2 miesiące — nie „30/60 dni”); zmienia się go w App Store Connect bez nowej wersji.
  - Jednorazowy zakup „Pro” + okres próbny liczony przez aplikację: dokładnie 30/60 dni (wytyczne Apple 3.1.1 dopuszczają darmowy zakup „trial”).
  - Wcześniejsi użytkownicy: dostęp przypisany do konta Apple (pierwsze pobranie przed wersją płatną) nie ma czego „anulować”, więc
    warunku „zrezygnuje i wróci” nie da się wiarygodnie sprawdzić (usunięcia aplikacji iOS nie zgłasza). Otwarte: zostawić dostęp na zawsze.
  - **Decyzja właściciela 05.10.2026:** „Ci, co teraz pobiorą, będą mieli za darmo. A jak wprowadzimy płatności, to subskrypcja
    będzie płatna po 30 dniach.” → wcześniejsi użytkownicy: dostęp na zawsze (konto Apple, `originalAppVersion` < pierwszy płatny build);
    nowi: subskrypcja z darmowym okresem próbnym **1 miesiąc** (najbliższa „30 dniom” długość w App Store Connect).
  - **Zakres (właściciel 05.10.2026):** „Cała aplikacja stanie się płatna po jakimś czasie” — po okresie próbnym bez subskrypcji
    aplikacja zablokowana (bez wersji „darmowa + Pro”).
  - **Po próbie bez subskrypcji (właściciel 05.10.2026: „Wybieram 1”):** treningi zablokowane, ale kopia zapasowa i eksport danych działają.
  - Otwarte: ceny
    (miesięczna/roczna), data wprowadzenia płatności, Small Business Program (prowizja 15%).
  Konto: Apple Developer jako osoba fizyczna (Individual) — firma niepotrzebna.
<!-- historia:end A -->
- **Nazwa:** decyzja właściciela 05.10.2026 (potwierdzona 06.10) — `store/app-store-names.json` (12 lokalizacji App Store), szczegóły w docs/16 „Nazwa aplikacji”. Unikalność potwierdzi rezerwacja nazwy w App Store Connect.

## Wzrost i promocja — ustalenia (właściciel 06.10.2026)

- **Przekaz i reguły (23.10.2026, DEC-07 K5/K6):** przekaz startowy „szybki zapis serii, także z zegarka; dane tylko na telefonie; bez konta” (zastępuje hasło z 13.10.2026); reguły uczciwej promocji (ujawnienie autorstwa, bez próśb o oceny do znajomych, zgoda na e-maile do klubów, zakaz promocji na forach) — `docs/wzrost.md` pkt 6.

- **Cel:** powolne zdobywanie użytkowników, którzy zostają na stałe — bez ostrej, szybkiej promocji. „100 pobrań miesięcznie byłoby super.”
- **Realistyczny punkt wyjścia (ocena agenta, nie dane):** bez promocji — rzędu kilkudziesięciu pobrań w pierwszym miesiącu, potem od kilku do kilkudziesięciu
  miesięcznie; kategoria „dziennik treningów” zatłoczona (wiele popularnych aplikacji). Liczby do zweryfikowania po premierze (App Store Connect → Analityka).
- **Kanały za 0 zł (zgoda właściciela 06.10: „Tak” — przygotować przy wydaniu):**
  1. ASO: słowa kluczowe i opisy w 12 lokalizacjach App Store (`store/app-store-names.json` + opisy), zrzuty ekranu w każdym języku (`npm run screens`).
     Największa szansa w mniejszych sklepach (cs, sk, lt, lv, et, hr, sl, ro, hu, bg) — mniejsza konkurencja, nazwa lokalna.
  2. Prośba o ocenę w aplikacji po kilku treningach (systemowe okno Apple) — do zaprojektowania (kiedy, ile razy), decyzja właściciela.
  3. Spokojne wpisy tam, gdzie są osoby trenujące (lokalne fora/grupy, Reddit np. r/homegym): bez konta, dane w telefonie, offline, domowa siłownia.
     **Zmiana 23.10.2026 (DEC-02 a, M1-051):** fora i grupy są poza planem startu — wpis tylko po pisemnej zgodzie administracji, zgodnie z jej regulaminem (`docs/wzrost.md`).
<!-- historia:start B -->
*Historia decyzji (06–20.10.2026): kwoty, okresy próbne i modele z tego bloku są zastąpione — obowiązuje wyłącznie `docs/monetyzacja.md`. Treść zostaje jako zapis, dlaczego model wygląda tak, a nie inaczej.*

- **Model płatności — ZMIANA (właściciel 06.10.2026, wariant A):** subskrypcja roczna **odnawiana automatycznie, 29 zł/rok**, z **miesiącem
  za darmo** na start (oferta wprowadzająca App Store). Zastępuje „jednorazową płatność” z 05.10. Uzasadnienie: kto zostaje, ten odnawia bez
  wysiłku, przychód z kolejnych lat się sumuje; anulowanie jednym ruchem w Ustawieniach iOS. Odrzucone: B — subskrypcja nieodnawialna
  (wygasa po roku, trzeba kupić ponownie; gubi zadowolonych przez zapomnienie, trudniejsza bez konta/serwera).
  Rachunek: ok. 20 zł netto/os./rok (PL: VAT 23%, prowizja 15%) → 2000 zł/mies. ≈ 1200 aktywnych subskrybentów.
  **Do sprawdzenia w dokumentacji Apple przed wdrożeniem** (nie zgadujemy): dostępne długości okresu próbnego dla subskrypcji rocznej,
  stawka prowizji dla subskrypcji w Small Business Program, wymagania przywracania zakupów bez konta (StoreKit 2).
  **Decyzja właściciela 06.10.2026 (późniejsza):** „od razu 30 dni za free, a potem subskrypcja na rok. Nie będzie użytkowników za darmo” —
  od pierwszej wersji w App Store; ustalenie „wcześniejsi użytkownicy za darmo” (05.10, niżej) **odwołane**.
  **Po wygaśnięciu subskrypcji (potwierdzone przez właściciela 06.10.2026):** nowe treningi zablokowane; historia, kopia (backup) i eksport
  danych działają zawsze — dane użytkownika zostają jego niezależnie od płatności.
- **Decyzja właściciela 06.10.2026 (ostateczna na dziś):** „od pierwszego dnia status tradera i po problemie. Najpierw 90 dni za darmo, później
  zmienimy na 30.” Czyli: konto jako **trader (DSA)** od pierwszej wersji w UE; subskrypcja roczna 29 zł odnawiana automatycznie; oferta
  wprowadzająca **3 miesiące za darmo** (dostępna długość), później nowa oferta **1 miesiąc** dla nowych (każdy korzysta z jednej oferty).
  Kroki właściciela przed płatną wersją: deklaracja tradera w App Store Connect (adres lub skrytka pocztowa, telefon, e-mail — publiczne
  w sklepie UE); umowa na aplikacje płatne (Paid Apps Agreement), dane bankowe i podatkowe; zapis do App Store Small Business Program;
  podatek/VAT — księgowy. Po stronie aplikacji: ekran subskrypcji (StoreKit), przywracanie zakupu, zachowanie po wygaśnięciu (ustalone wyżej) — do zaprojektowania i wdrożenia z pełnym zakresem testów (docs/20).
- **Model płatności — ZMIANA (właściciel 09.10.2026, 10:14):** zastępuje cenę i okres próbny z 06.10 (29 zł/rok; 3 miesiące, potem 1 miesiąc).
  Słowa właściciela: „0.99 USD / 0.99 EUR / 0.99 GBP / 4.99 PLN / równowartość jako porównanie do taniej niż espresso za miesiąc w krajach,
  które wydamy. Dodatkowo roczne subskrypcje za 5.99 USD / 5.99 EUR / 5.99 GBP z góry. 30 dni okresu próbnego”.
  - Subskrypcja miesięczna: 0,99 USD / 0,99 EUR / 0,99 GBP / 4,99 PLN; w pozostałych krajach równowartość („taniej niż espresso miesięcznie”
    — zasada ustalania ceny).
  - Subskrypcja roczna, płatna z góry: 5,99 USD / 5,99 EUR / 5,99 GBP (ok. połowa ceny 12 miesięcy).
  - Okres próbny 30 dni = oferta wprowadzająca **1 miesiąc** (Apple nie ma „30 dni”, zob. sekcję DSA niżej).
  - Bez zmian: historia, kopia i eksport zawsze działają; status tradera; kroki właściciela wyżej (po wygaśnięciu — limit, pkt 5 niżej).
  - Wdrożenie: po wydaniu 1 (zakres wydania zamrożony, CLAUDE.md „Audyty i wydania” pkt 3), przed App Store.
  - **Decyzje właściciela 09.10.2026 (ok. 10:30):**
    1. ~~Cena roczna w PLN: **29,99 zł** (A: ten sam stosunek roczna/miesięczna co w EUR; odrzucone B: 24,99 zł — kursowa równowartość)~~ — **zmienione przez właściciela 09.10.2026 (ok. 10:35): 3,99 zł miesięcznie i 19,99 zł rocznie** („Nie chcę, żeby moi rodacy
       byli dyskryminowani”). Zastępuje też 4,99 zł/mies. z decyzji o 10:14. Rachunek: roczna = 5 miesięcznych (w USD/EUR/GBP ok. 6).
    2. Okres próbny **w obu planach** (A; jedna oferta wprowadzająca na osobę w grupie subskrypcji; odrzucone B: tylko roczny).
    3. Hasło w sklepie: **„w cenie espresso lub taniej”** (sformułowanie ostateczne przy opisach sklepu) — właściciel: „Nawet we Włoszech nie
       będzie to kłamstwem”. Warunek (zasada rzetelnych źródeł): przed publikacją opisu potwierdzić źródłami cenę espresso w każdym kraju, — **warunek zniesiony przez właściciela 11.10.2026 (wyjątek), zob. sekcję metadanych niżej, pkt 4**
       w którym hasło się pojawi; gdzie się nie potwierdzi — bez hasła w tym kraju.
    4. Ceny w innych krajach: wariant A wg zasady z 20:20 (właściciel nie wybrał) — cena bazowa 0,99 USD, Apple przelicza pozostałe kraje,
       EUR/GBP/PLN ustawione ręcznie; odrzucone B: każdy kraj ręcznie.
    5. **Po wygaśnięciu subskrypcji lub próby: 4 darmowe treningi na miesiąc kalendarzowy** (zastępuje pełną blokadę nowych treningów
       z 06.10; odrzucone: 5/mies., pełna blokada). Liczone na telefonie, bez serwera; limit liczy tylko treningi na żywo — **dopisywanie
       wstecz bez limitu** (właściciel 09.10.2026, wariant A: „nikt tak nie zrobi”; odrzucone B: wliczać do limitu, C: bez subskrypcji bez
       dopisywania wstecz). Historia, kopia i eksport bez limitu.
  - **Zasada cenowa (właściciel 09.10.2026):** „polityka cenowa opiera się na impulsywnych zakupach i odczuciu, co jest takim progiem w danym
    kraju. U nas to 3.99 i 19.99”. Cena w każdym kraju = lokalny próg zakupu impulsowego, nie przeliczenie kursowe. Skutek dla pkt 4:
    automatyczne przeliczenie Apple tylko jako punkt wyjścia — przed publikacją przegląd cen w krajach wydania i ręczna korekta tam, gdzie
    wynik nie trafia w lokalny próg.
  - **Kody na darmową subskrypcję (właściciel 09.10.2026, wariant A):** kody ofertowe Apple (offer codes; jednorazowe lub własny kod),
    tworzone w App Store Connect; w aplikacji przycisk „Zrealizuj kod” (ekran subskrypcji i Ustawienia) otwiera systemowe okno StoreKit.
    Odrzucone: B — tylko realizacja w App Store, bez przycisku; własny system kodów — niedozwolony (wytyczne Apple 3.1.1: zakaz własnych
    mechanizmów odblokowania, np. kluczy licencyjnych). Kody dają subskrypcję na określony czas, nie na zawsze.
    **Sprawdzone w dokumentacji Apple (09.10.2026):**
    - Najdłuższy darmowy okres: **1 rok** — „The duration can be 3 days, 1 week, 2 weeks, 1 month, 2 months, 3 months, 6 months, or 1 year”
      (developer.apple.com/help/app-store-connect/reference/in-app-purchase-and-subscriptions-pricing-and-availability/, typ „Free”; ta sama
      strona: kody ofertowe mają „a specified duration and type (pay as you go, pay up front, free)”). Strona o kodach nie wylicza długości —
      potwierdzić w polu „Duration” w App Store Connect.
    - Limit: „a maximum of 1 million redemptions per app, per quarter”; kody jednorazowe ważne do 6 miesięcy, własny kod (np. KOLEDZY) może
      być bez daty ważności („No End Date”), opcjonalnie z limitem użyć (developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-subscription-offer-codes).
    - Własny kod realizuje się tylko przez link albo w aplikacji („redeem custom codes within your app if you've implemented the appropriate
      StoreKit method”) — przemawia za przyciskiem w aplikacji (wariant A).
    - Opcja bez automatycznego odnowienia: „you'll only be able to choose Free offers” — darmowy okres bez zobowiązania (po nim brak opłaty).
    - **Decyzja właściciela 09.10.2026 (ok. 12:00):** kody dla kolegów — **bez zobowiązań** (bez automatycznego odnowienia), **osobny kod na
      osobę**, **najdłuższy dostępny okres** (wg dokumentacji 1 rok). Sposób wykonania do potwierdzenia przy wdrożeniu (dokumentacja nie
      rozstrzyga): A) własny kod na osobę (np. KOLEGA-JAN) z limitem 1 użycia, bez daty ważności — nie wiadomo, czy limit 1 jest dozwolony
      i czy jedna oferta mieści wiele własnych kodów („up to 10 active offers per subscription SKU”); B) partia kodów jednorazowych
      (minimum 500 w partii, ważne do 6 miesięcy od utworzenia — niewykorzystane wygasają bez kosztów), po jednym kodzie na osobę.
      **Wybór właściciela 09.10.2026: A** (własne kody); B tylko jako plan zapasowy, jeśli App Store Connect nie pozwoli na limit 1 użycia
      albo wiele własnych kodów w jednej ofercie (sprawdzić przy wdrożeniu, wynik tutaj).
  - **Dostęp dożywotni (decyzja właściciela 10.10.2026, wariant A):** jednorazowy zakup (non-consumable) **99,99 zł**, w pozostałych walutach
    5× cena roczna (np. **29,99 USD/EUR/GBP**); obok subskrypcji, ten sam ekran zakupu i „Przywróć zakupy”. Uzasadnienie: aplikacja offline —
    brak kosztu na użytkownika; prośba o jednorazowy zakup w researchu skarg (docs/research, pkt 18). Odrzucone: B 59,99 zł (3 lata planu
    rocznego), C 99,99 zł z promocją 59,99 zł na premierę, D bez dożywotniego. „5× roczna” to kalkulacja, nie dane rynkowe; cenę zmienia się
    w App Store Connect bez nowej wersji. Wdrożenie: paczka przed App Store, razem z subskrypcją (biblioteka iOS+Android).
  - **ZMIANA CEN (decyzja właściciela 13.10.2026, wariant M1; zapis: docs/18, wpis „cennik … M1”):** miesięczna 0,99 USD/EUR/GBP (PL 3,99 zł — **zmienione 14.10.2026 na 4,99 zł**, bo 3,99 nie ma w siatce Apple; docs/18),
    roczna **4,99** (PL 19,99 zł) = 5 × miesięczna, dożywotnia **14,99** (PL 59,99 zł) = 3 × roczna. Zastępuje ceny z 11.10.2026 (6,99 / 21,99)
    i „5× roczna” z 10.10.2026. Ukraina: niższy punkt cenowy poniżej ceny espresso — zamknięte 27.10.2026 (DEC-07 b, docs/18): bez osobnego punktu,
    bo opis od 21.10.2026 mówi „porównywalnej” (1,06–1,51 €); ceny wszystkich krajów wobec 1,51 € — krok Z-10b w docs/48. Poniższy wpis z 11.10.2026 zostaje jako historia decyzji.
  - **ZMIANA CENY ROCZNEJ (decyzja właściciela 20.10.2026; zapis: docs/18):** roczna **6,99 USD** (USD/EUR/GBP; Apple przelicza pozostałe kraje) — **zmiana 21.10.2026 (docs/18): strefa euro 7,99 € (przeliczenie Apple), nie 6,99 €**; aktualne kwoty: docs/monetyzacja.md, zastępuje 4,99 z 13–14.10.2026
    (odrzucone: zostać przy 4,99). Miesięczna 0,99 i dożywotnia 14,99 bez zmian; PL bez zmian (4,99 / 19,99 / 59,99 zł). Proporcje „5× miesięczna” i „3× roczna” z 13.10.2026 nie obowiązują.
    Cenę w App Store Connect ustawia właściciel (krok K-CENA); w kodzie jedno źródło: `FAKE_PRICES` (`lib/store-fake.ts`), zgodność pilnuje `tests/prices-decision.test.ts`.
  - **(historia) ZMIANA CEN (decyzja właściciela 11.10.2026, po porównaniu z konkurentem — docs/research/raporty-rynkowe-2026-10.md):** „zachowamy
    proporcje z nimi” (konkurent: roczna 14,99 USD, dożywotnio 44,99 USD ≈ 3× roczna; okresów subskrypcji nie podaje). Obowiązuje:
    | | PL | USD / EUR / GBP |
    |---|---|---|
    | miesięczna | 3,99 zł (bez zmian) | 0,99 (bez zmian) |
    | roczna | 19,99 zł (bez zmian) | **6,99** (było 5,99) |
    | dożywotnio | **59,99 zł** (było 99,99) | **21,99** (było 29,99) |
    Okres próbny, 4 darmowe treningi/mies., kody, zasada progu impulsowego — bez zmian. EUR/GBP równe USD — potwierdzone przez właściciela 11.10.2026
    (także odczyt: 6,99 = roczna, 21,99 = dożywotnio). Zastępuje „5× roczna” z 10.10.2026 (dożywotnio ≈ 3× roczna).
  - **Chmura rodzinna (Family Sharing) — TAK (właściciel 11.10.2026)** dla subskrypcji i dostępu dożywotniego. **[OTWARTE]**: czy włączenie
    jest nieodwracalne (strona pomocy Apple pod znanym adresem zwróciła 404 — sprawdzić przy wdrożeniu w App Store Connect).
  - **Sprawdzone 14.10.2026 (docs/18):** 3,99 PLN nie istnieje w siatce Apple (miesięczna PL = 4,99 zł), 19,99 i 59,99 PLN ustawione ręcznie. Było do sprawdzenia: czy punkty cenowe 0,99 EUR/GBP, 3,99 PLN i 19,99 PLN istnieją w siatce cen Apple.
- **Cel przychodu (właściciel 06.10.2026):** ~2000 zł miesięcznie; model bez zmian: 30 dni za darmo, potem jednorazowa płatność.
  Rachunek orientacyjny (agent, do sprawdzenia): z ceny w App Store odpada VAT kraju kupującego (PL 23%) i prowizja Apple (15% w Small Business
  Program), czyli na konto ok. 0,69 × cena przy kupującym z Polski. Potrzebne zakupy miesięcznie: cena 29 zł → ok. 100; 49 zł → ok. 59;
  79 zł → ok. 37; 99 zł → ok. 29. Jednorazowa płatność = przychód tylko z NOWYCH kupujących, więc przy ~100 pobraniach/mies. cel wymaga,
  żeby kupowała duża część pobierających — realnie potrzeba kilkuset pobrań miesięcznie albo wyższej ceny (założenie, nie dane;
  odsetek kupujących po okresie próbnym zmierzymy po premierze w App Store Connect). Darmowych użytkowników nie będzie (decyzja 06.10).
  **Otwarte:** cena; podatek dochodowy od sprzedaży w App Store przy koncie osoby prywatnej — pytanie do księgowego
  (nie zgadujemy).
<!-- historia:end B -->
- **Sprzedaż bez rejestracji firmy (pytanie właściciela 09.10.2026; informacja, nie porada podatkowa — do potwierdzenia u księgowego):**
  - Apple: konto Individual (osoba fizyczna) wystarcza do umowy Paid Apps i statusu tradera DSA (dane kontaktowe osoby, skrytka dozwolona).
  - Prawo polskie: działalność nierejestrowana — od 2026 limit kwartalny 225% płacy minimalnej = **10 813,50 zł przychodu należnego na kwartał**
    (przy płacy minimalnej 4806 zł); warunek: brak firmy w ostatnich 60 miesiącach; po przekroczeniu — działalność gospodarcza od dnia
    przekroczenia, 7 dni na wpis do CEIDG; PIT-36 wg skali, bez ZUS; bieżąca ewidencja sprzedaży. Źródło: direct.money.pl, „Działalność
    nierejestrowana 2026: limit 10 813,50 zł, po przekroczeniu 7 dni na CEIDG” (19.08.2026) — omówienie, nie tekst ustawy; tekstu
    Prawa przedsiębiorców nie czytano (otwarte). Cel 2000 zł/mies. ≈ 6000 zł/kwartał — poniżej limitu.
  - **Druga droga bez firmy — przychód z praw majątkowych (licencja):** interpretacja indywidualna Dyrektora Izby Skarbowej w Bydgoszczy
    (wniosek z 15.08.2014; e-prawnik.pl/interpretacje-podatkowe/itpb1415-84314ak.html): programista sprzedający płatną wersję aplikacji m.in.
    przez App Store — stanowisko „przychód z tytułu udzielenia licencji … z praw majątkowych (art. 18 ustawy o PIT)” uznane za **prawidłowe**;
    PIT w zeznaniu rocznym wg skali, bez zaliczek. ifirma.pl (26.11.2020): bez działalności — „przychód ze sprzedaży praw majątkowych
    (sprzedaż licencji)”; z działalnością — VAT-UE, odwrotne obciążenie (kontrahent: Apple w Irlandii). Zastrzeżenia: interpretacja wiąże
    tylko wnioskodawcę, jest z 2014 r. i dotyczyła hobbystycznej aplikacji; subskrypcja, promocja i status tradera mogą przemawiać za
    działalnością gospodarczą (ciągłą, zorganizowaną) — do oceny księgowego albo własnej interpretacji indywidualnej (KIS, opłata).
  - **Właściciel pracuje równolegle na umowie o pracę (09.10.2026)** — dodatkowe pytania do księgowego/prawnika (nie sprawdzone w źródłach):
    1) przychód z aplikacji sumuje się z wynagrodzeniem w zeznaniu rocznym (skala — możliwy wyższy próg); 2) przy firmie (JDG) i pensji co
    najmniej minimalnej — zwykle tylko składka zdrowotna z firmy (zbieg tytułów), do potwierdzenia; 3) umowa o pracę: zakaz konkurencji
    i klauzule o prawach do programów (art. 74 ust. 3 prawa autorskiego — program stworzony w ramach obowiązków pracownika należy do
    pracodawcy); 4) droga „licencja = prawa majątkowe” zakłada utwór człowieka — kod pisany głównie przez agentów AI może mieć słabszą
    ochronę autorską, co osłabia tę kwalifikację.
    Właściciel (09.10.2026): zakaz konkurencji w umowie jest, ale aplikacja powstaje w wolnym czasie, na własnym sprzęcie, w obszarze
    niezwiązanym z pracą — ryzyko z pkt 3 niskie. Do sprawdzenia: wewnętrzne zasady pracodawcy o zgłaszaniu dodatkowej działalności
    zarobkowej (w dużych firmach bywa obowiązek zgłoszenia niezależnie od branży).
  - **Opracowanie księgowej (podatkiprogramisty.pl, M. Salawa, „Sprzedaż aplikacji w App Store — jak rozliczyć przychód i VAT”,
    11.09.2025, akt. 13.07.2026; zastrzeżenie: nie jest poradą podatkową):** „Jeśli prowadzisz działalność nierejestrowaną albo nie masz
    firmy – przychód rozliczasz jako przychód z praw majątkowych (licencji)”. VAT: wewnątrzwspólnotowe świadczenie usług, faktura dla Apple
    (Apple Distribution International, Irlandia, albo Apple Services, Luksemburg — wg raportu i przelewu) z „odwrotnym obciążeniem”, „np”,
    JPK_V7 i VAT-UE — opisane dla firmy; czy osoba bez firmy musi rejestrować VAT-UE — artykuł nie mówi (otwarte). Faktura zbiorcza
    za okres raportu Apple, kwota „zgodnie z raportem”; waluta (zwykle EUR) — kurs NBP z dnia poprzedzającego uzyskanie przychodu.
    Nie omawia: prowizji (brutto czy netto), W-8BEN.
  - **Kierunek właściciela (09.10.2026, ok. 13:10): działalność nierejestrowana / bez firmy, rozliczana jako przychód z praw majątkowych
    (licencja)** — „jak najmniej formalności”; do potwierdzenia u księgowego (VAT-UE, brutto/netto, W-8BEN, kod pisany z AI).
    Szacunek podatku (agent, nie porada): przychód = wypłata Apple ≈ cena ÷ 1,23 (VAT PL) × 0,85 (prowizja 15% w Small Business Program);
    PIT wg skali razem z pensją — 12% (32% powyżej progu; skala i próg na 2026 nieprzeczytane w ustawie — otwarte); bez ZUS i zdrowotnej;
    koszty uzyskania 20%/50% — niepewne (interpretacja z 2021 odmówiła 50%), w szacunku pominięte. Polska: 3,99 zł → wypłata 2,76 zł →
    podatek 0,33 zł → zostaje 2,43 zł; 19,99 zł/rok → 13,81 zł → 1,66 zł → 12,16 zł. Przy 2000 zł wypłat miesięcznie: 240 zł podatku (12%).
  - **Decyzja właściciela 09.10.2026 (ok. 13:20):** start płatności jak najszybciej, bez czekania na interpretację; formalności (wniosek
    o interpretację, ewentualnie VAT-UE, korekty) nadrabiane równolegle — wariant A; odrzucone B: płatności dopiero po interpretacji.
  - **Decyzja właściciela 09.10.2026 (ok. 13:25): bez księgowego (A)** — interpretacja indywidualna i samodzielne rozliczenie; odrzucone
    B (jednorazowa konsultacja), C (stały księgowy). Projekt wniosku: Dysk, folder „Trening App” (dane osobowe poza repozytorium).
  - **Drogi w urzędzie skarbowym (09.10.2026):** 1) infolinia KAS (telefon, e-mail, czat) — bezpłatnie, szybko, bez mocy wiążącej;
    2) baza interpretacji Ministerstwa Finansów (EUREKA) — bezpłatnie, cudze sprawy, bez ochrony; 3) interpretacja indywidualna KIS —
    formularz ORD-IN (kreator ord-in.podatki.gov.pl; e-Urząd Skarbowy/ePUAP, podpis zaufany), **40 zł za każdy stan faktyczny lub zdarzenie
    przyszłe**, wydanie bez zbędnej zwłoki, najpóźniej w 3 miesiące; chroni wnioskodawcę, który się do niej stosuje. Źródła: podatki.biz
    „KIS wyjaśnia: Jak złożyć wniosek o interpretację indywidualną” (06.06.2025) — opłata, formularz, infolinia; termin 3 miesięcy
    (Ordynacja podatkowa) — ze streszczeń wyszukiwarki, nieprzeczytany w ustawie (otwarte).
  - **Otwarte dla księgowego:** czy przychodem jest cena dla klienta czy wypłata od Apple (po prowizji i VAT); VAT od usługi dla Apple
    (podmiot zagraniczny) — czy potrzebna rejestracja VAT-UE; jak dokumentować wypłaty Apple.
- **Priorytet produktu wynikający z celu:** zatrzymanie użytkowników (jakość, brak błędów, dane bezpieczne) ważniejsze niż liczba pobrań —
  zgodne z pełnym zakresem testów (docs/20).

## Status tradera (DSA) i okres próbny — sprawdzone w źródłach Apple (06.10.2026, na prośbę właściciela, wariant A „najpierw za darmo”)

Źródła (przeczytane): Apple, „Manage European Union Digital Services Act trader requirements”
(developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements/);
„Set up introductory offers for auto-renewable subscriptions” (developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-introductory-offers-for-auto-renewable-subscriptions/);
„Provide your trader status in App Store Connect” (developer.apple.com/news/?id=x60uzbu9).
- Trader = osoba działająca „for purposes relating to his or her trade, business, craft or profession” (definicja DSA cytowana przez Apple).
  Czynniki wg Apple: przychód z aplikacji („for example if your app includes In-App Purchases, or if it's a paid or ad-sponsored app”), praktyki
  handlowe wobec konsumentów (reklama, promocja), rejestracja VAT, działanie zawodowe. Cytat: „if you're a hobbyist and you developed your app
  with no intention of commercializing it, you may not be considered a trader.”
- **Ocenę robi sam deweloper** (Apple nie rozstrzyga). Ryzyko dla wariantu A: darmowa pierwsza wersja z ZAMIAREM późniejszej monetyzacji może
  być oceniona jako działanie handlowe już teraz — szara strefa, do potwierdzenia u prawnika/księgowego (nie zgadujemy).
- Non-trader: aplikacja może być w UE; konsumenci widzą, że prawa konsumenckie z umów z nami nie obowiązują. Trader (osoba fizyczna): na stronie
  aplikacji w UE publicznie adres (lub skrytka pocztowa — „Address or P.O. Box”), telefon, e-mail.
- Status można zmienić później dla aplikacji (App Information → Digital Services Act → Edit); przy pierwszej deklaracji tradera trzeba podać i
  zweryfikować dane kontaktowe.
- Okres próbny subskrypcji rocznej: dostępne 3 dni, 1–2 tyg., 1, 2, 3, 6 mies. i **1 rok**. Ofertę wprowadzającą usuwa się i tworzy na nowo
  (nie edytuje); każdy może skorzystać z jednej oferty wprowadzającej w grupie subskrypcji.
- Wniosek (agent): wariant A (bez płatności w aplikacji) daje najmocniejszą podstawę do deklaracji non-trader; wariant B (roczny okres próbny
  w subskrypcji) = płatności w aplikacji od pierwszego dnia → według kryteriów Apple prawie na pewno trader. Ostateczną ocenę przy zamiarze
  monetyzacji warto potwierdzić u prawnika/księgowego. Skrytka pocztowa zamiast adresu domowego jest dopuszczalna.

## Zmiany w aplikacji już zrobione pod publikację

- **Przypomnienie o odnowieniu podpisu i instalacja z komputera usunięte** (decyzja właściciela 09.10.2026 ok. 17:10, docs/18).
  - Aplikację instalujemy tylko przez TestFlight (a potem App Store); build z TestFlight nie ma profilu w paczce, więc przypomnienie i tak nie działało.
  - Powód: tekst przypomnienia wymieniał narzędzie innej firmy do instalacji z komputera — ryzyko odrzucenia (wytyczne Apple 2.3.7, 5.2.1)
    i naruszenie zasady z 09.10 (CLAUDE.md „Treści cudze i nazwy innych firm”).
  - Zniknęły: baner na ekranie głównym, dopisek „Podpis ważny do …” w Więcej, powiadomienie dzień przed wygaśnięciem, 10 tekstów w 26 językach.
  - Przypomnienie zaplanowane przez starszy build jest odwoływane przy starcie.
  - `ios-unsigned.yml` tylko sprawdza kompilację — bez paczki .ipa do pobrania.
  - Testy: `tests/rm-signing.test.tsx`.

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
   - klucz API (rola **Admin** — przegląd CI 06.10: podpis w chmurze przy eksporcie wymaga uprawnień do certyfikatów dystrybucyjnych) → sekrety repo.
3. **Profil „App Store”:** certyfikat dystrybucyjny i profil App Store — od 08.10.2026 podpis w chmurze Apple przy eksporcie (klucz API, `testflight.yml`), bez EAS credentials.
4. **`ITSAppUsesNonExemptEncryption: false`** w `app.json` (aplikacja nie używa własnego szyfrowania). Do potwierdzenia przy audycie.
5. **Zrzuty ekranu** (6,9″ i 6,5″) z symulatora — Maestro `takeScreenshot` albo `scripts/screens`. Opis PL/EN.
6. **Strona polityki prywatności i wsparcia** na GitHub Pages.
7. **Elementy specyficzne dla właściciela do przejrzenia** przed sklepem: presety ViShape, teksty o „domu właściciela” w podpowiedziach, dane demo.
8. **Prawa autorskie — OBOWIĄZKOWE przed upublicznieniem aplikacji** (polecenie właściciela 09.10.2026). Bez tego nie wysyłamy do App Store:
   - **cytaty w repozytorium:** w `docs/research` było ok. 800 dosłownych fragmentów cudzych stron (najwięcej w `docs/research/kb/` — research
     konkurencji z 03.10, przeniesiony na Dysk 12.10.2026; zostały pliki źródeł researchu biblioteki), niektóre do ~900 znaków. Skrócić do niezbędnego fragmentu (1–2 zdania +
     adres i miejsce) — prawo cytatu (art. 29 ustawy o prawie autorskim) obejmuje fragmenty w zakresie uzasadnionym analizą; test pilnujący
     maksymalnej długości cytatu w `docs/research`. Wariant do potwierdzenia przez właściciela przy realizacji: A skrócić (rekomendacja) /
     B przenieść research konkurencji na Dysk / C zostawić. [Aktualizacja 12.10.2026: ten wariant zastąpiła decyzja z 09.10 (ok. 06:45 i 07:00) — research konkurencji na Dysk i przepisanie historii gita
     po wydaniu 1 na TestFlight, przed App Store (docs/18); zdanie „historia zostaje bez przepisywania” nie obowiązuje.];
   - **treść w aplikacji** (wskazówki techniki `lib/cues`, opisy, nazwy): automatyczne sprawdzenie podobieństwa do pobranych stron źródeł
     (wspólne ciągi słów) — żadne zdanie nie może być przepisane zbyt blisko oryginału; wynik w docs/09;
   - **grafiki:** tylko własne (figury SVG z danych, ikony własne) — sprawdzić, że w paczce nie ma cudzych obrazów, zdjęć ani filmów;
   - **licencje zależności:** ekran licencji open source (SEC-08) aktualny (`check:licenses`).
   - **decyzje właściciela 09.10.2026 (ok. 06:45):** (1) research konkurencji (`docs/research/kb/` i cytaty w plikach źródeł) → **na Dysk**
     (B), w repo tylko wnioski z linkami — zasada w CLAUDE.md; czysta historia gita (D) — TAK, po wydaniu 1 na TestFlight, przed App Store; zakres i kolejność w docs/18 (09.10, ok. 07:00); (2) nazwy innych
     aplikacji w komentarzach kodu → neutralne opisy (B); (3) marka ViShape SmartGym w presetach miejsc → nazwa ogólna sprzętu (A), model
     użytkownik wpisuje sam; (4) w nazwie, podtytule, słowach kluczowych i zrzutach App Store żadnych nazw innych aplikacji ani cudzych
     znaków towarowych (wytyczne Apple 2.3.7 i 5.2.1).

## Model płatności — ponowna analiza (05.10.2026)

> **Zastąpione 06.10.2026** (decyzje właściciela): subskrypcja roczna 29 zł odnawiana automatycznie, miesiąc za darmo, bez darmowych
> użytkowników — sekcja „Decyzje właściciela” wyżej. Analiza niżej zostaje jako historia (wzmianki o „wcześniejszych użytkownikach” nieaktualne).

Po researchu skarg (wnioski: docs/research/skargi-wnioski-2026-10.md; pełny raport na Dysku: płatności to skarga nr 1, najostrzej oceniane odbieranie darmowych
funkcji i ściana płatności po rejestracji; częsta prośba o jednorazowy zakup) właściciel: „Tak, rozważmy alternatywy”.
Wcześniejsza decyzja (subskrypcja, miesiąc próby, potem blokada treningów; eksport danych zawsze) — do potwierdzenia albo zmiany.

| Opcja | Na czym polega | Za | Przeciw |
|---|---|---|---|
| A. Subskrypcja + blokada po próbie (obecna decyzja) | miesiąc za darmo, potem bez subskrypcji tylko eksport | stały przychód; prosta zasada | dokładnie to, za co konkurencja zbiera najgorsze oceny |
| B. Jednorazowy zakup po próbie | 30 dni za darmo (liczy aplikacja), potem jednorazowo „pełna wersja” | ludzie to lubią; Chmura rodzinna Apple | przychód jednorazowy; kolejne zarobki tylko z nowych użytkowników |
| C. Darmowe podstawy na zawsze + płatne Pro | zapis treningów, szablony, historia — zawsze za darmo; Pro: np. postępy/wykresy, wiele miejsc i sprzętu, presety stacji, Apple Health | najlepsze opinie, szeroki zasięg; nikt nie traci tego, co miał | trzeba z góry dobrze wybrać, co jest w Pro (późniejsze przenoszenie = skarga nr 1) |
| D. C + wybór: subskrypcja albo dożywotnio | Pro miesięcznie/rocznie albo raz na zawsze | wybór dla obu typów klientów; częsty model w kategorii | więcej produktów do utrzymania w App Store Connect |
| E. Darmowa + „napiwek” | wszystko za darmo, dobrowolne wsparcie | zero skarg na płatności | mały przychód |

Rekomendacja (do decyzji właściciela): **D** — darmowe podstawy na zawsze, Pro jako subskrypcja albo zakup dożywotni; wcześniejsi
użytkownicy — Pro za darmo (jak w decyzji wyżej). Eksport danych zawsze darmowy.

**Decyzja właściciela 05.10.2026: „B: jednorazowy zakup po próbie”.** Zastępuje subskrypcję (wyżej): 30 dni całości za darmo (liczy aplikacja —
wytyczne Apple 3.1.1 dopuszczają darmowy zakup „trial”), potem jednorazowy zakup pełnej wersji. Bez zakupu: treningi zablokowane,
kopia i eksport danych działają (decyzja „Wybieram 1” zostaje). Wcześniejsi użytkownicy (pobrani przed płatnościami): pełna wersja za darmo.
Otwarte: cena, data wprowadzenia, Chmura rodzinna (Family Sharing) — tak/nie.

**Uzupełnienie decyzji (właściciel 05.10.2026):** „Wersja offline do jednorazowego wykupienia po wypróbowaniu. Jeżeli kiedyś dodamy funkcjonalności
online, to będą to dodatkowo płatne funkcje.” Ustalenia:
- Wszystko, co działa bez sieci, należy do zakupu jednorazowego — **na zawsze**; nic z tej części nie przechodzi później do płatnych funkcji online
  (odbieranie funkcji to skarga nr 1 w researchu).
- Funkcje online (np. synchronizacja między urządzeniami, trener, współdzielenie) — osobny produkt; ze względu na koszty serwera zwykle subskrypcja.
  Apple pozwala łączyć zakup jednorazowy i subskrypcję w jednej aplikacji.
- Otwarte: czy wcześniejsi użytkownicy dostają funkcje online za darmo; koszty serwera — przed wdrożeniem sprawdzić darmowe limity (zasada: 0 zł poza Apple).

<!-- historia:start C -->
## Limit Expo na buildy lokalne (06.10.2026)
*Historia: workflowy EAS i `iphone-local.yml` usunięte 08.10.2026; build i wysyłka tylko przez `testflight.yml` (sekcja niżej).*

Przebieg `iphone-local.yml` 37422172177: build lokalny OK, ale `eas upload` odrzucony — „This account has used its local builds from the free plan
this month, which will reset in 25 days (on Sun Nov 01 2026)”. Darmowy plan Expo liczy też buildy lokalne wysłane przez `eas upload`
(wcześniej zakładano, że tylko buildy w chmurze — docs/13). Link instalacyjny przez Expo niedostępny do 01.11.2026.
Do decyzji właściciela: TestFlight (testy wewnętrzne — bez recenzji Apple) albo instalacja pliku .ipa z komputera Mac; płatny plan Expo — nie (0 zł).

<!-- historia:end C -->

## TestFlight — testy wewnętrzne (decyzja właściciela 06.10.2026: „TestFlight — testy wewnętrzne”)
Workflow `.github/workflows/testflight.yml`: build i podpis tylko narzędziami Apple (xcodebuild z kluczem App Store Connect API, podpis
automatyczny), wysyłka do App Store Connect; bez Expo/EAS i ich limitów. Numer buildu 1000 + numer przebiegu (rośnie).
`ITSAppUsesNonExemptEncryption: false` w `app.json` (aplikacja nie używa szyfrowania poza systemowym — bez pytania przy każdym buildzie).

**Kroki właściciela (przeglądarka, ~30 min):**
1. App Store Connect → Apps → „+” → New App: platforma iOS, nazwa (np. „Trening” — jeśli zajęta, inna), język główny Polski,
   Bundle ID `pl.lukasz.trening` (jeśli nie ma go na liście: developer.apple.com → Identifiers → „+” → App ID z tym identyfikatorem), SKU dowolne.
2. Users and Access → Integrations → App Store Connect API → „+”: nazwa „GitHub”, dostęp **Admin** (podpis w chmurze przy eksporcie — z rolą App Manager zwykle błąd „Cloud signing permission error”) → pobierz plik `AuthKey_XXXX.p8`
   (do pobrania tylko raz), zanotuj Key ID i Issuer ID.
3. GitHub → repozytorium → Settings → Secrets and variables → Actions → New repository secret: `ASC_KEY_ID`, `ASC_ISSUER_ID`,
   `ASC_KEY_P8` (cała treść pliku .p8). Pliku nie wysyłać nigdzie indziej (ani na czat).
   - **Stan 06.10.2026 (właściciel):** sekrety `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` są dodane (agent ich nie widzi — sprawdza je pierwszy krok `testflight.yml`).
4. App Store Connect → aplikacja → TestFlight → Internal Testing → „+” grupa → dodaj siebie. Na iPhonie aplikacja TestFlight (App Store).

**Przed pierwszą wysyłką:** audyt historii repozytorium wg reguły właściciela (wynik w tej sekcji).

### Audyt repozytorium przed pierwszą wysyłką (06.10.2026, niezależny subagent, tylko odczyt)
Zakres: 168 commitów ze wszystkich gałęzi, wiadomości, tagi, 289 plików z historii, workflowy.
- **Czysto:** brak kluczy prywatnych, certyfikatów, .p8/.p12/.mobileprovision/.env w całej historii; brak tokenów; brak prawdziwych UDID;
  autorzy commitów — tylko adresy noreply; workflowy tylko `workflow_dispatch`, `contents: read`, bez `pull_request(_target)` (forki bez sekretów);
  sekrety nie są wypisywane; brak logów CI w repo.
- **WYSOKIE (sprawdzone):** stare przebiegi `iphone-eas.yml` (workflow usunięty 08.10.2026) sprzed maskowania UDID — lista przebiegów tego workflow jest pusta (0), nie ma czego usuwać.
- **ŚREDNIE:** (1) `iphone-eas.yml`/`iphone-local.yml` (oba usunięte 08.10.2026) — sekrety ustawione dla całego workflow (dostępne podczas `npm ci`/testów) — do przeniesienia
  do pojedynczych kroków (otwarte; workflowy i tak nieużywane do 01.11 — limit Expo); (2) `testflight.yml` — klucz na dysku dopiero przed archiwum
  (naprawione); (3) `tests/fixtures/web03-backup.json` zawierał wagę ciała i wpisy z 02.10.2026 — właściciel: „Tak — zamień na zmyślone” (06.10): poranny wpis fikcyjny, daty przesunięte o 300 dni; stare wartości zostają w historii git (przepisanie historii — nie).
- **NISKIE:** `ios-unsigned.yml` artefakty 1 dzień (naprawione); `.gitignore` dla `.env*`, `*.p8`, `*.p12`, `*.mobileprovision`, `*.cer` (naprawione);
  `appleTeamId` w `app.json` — Apple nie traktuje go jako sekretu (zostaje); Maestro instalowany bez przypiętej wersji (bez sekretów — zostaje).
- Do sprawdzenia przez właściciela: GitHub → Settings → Actions → General → „Fork pull request workflows” — wymagane zatwierdzenie.

## Metadane App Store — projekt PL/EN (11.10.2026, odświeżony 20.10.2026 do stanu kodu po audycie M1-045; do akceptacji właściciela)

Projekt do przejrzenia; nic nie wysłano do App Store Connect. Liczby znaków policzone skryptem node (znaki Unicode). Tłumaczenia na pozostałe lokalizacje — później (nazwy już w `store/app-store-names.json`). Zasady: bez nazw innych aplikacji i marek (wytyczne Apple 2.3.7), bez twierdzeń zdrowotnych i obietnic efektów, bez superlatywów; jedyna liczba merytoryczna to e1RM (wzór Epleya, który aplikacja pokazuje ze źródłem).

**Uwaga o stanie kodu (20.10.2026):** ekran zakupu i StoreKit są w kodzie, ale za przełącznikiem `PAYWALL.ENABLED = false` (bieżący TestFlight bez limitu i bez ekranu zakupu) — blok cenowy w opisie i hasło o darmowym okresie w tekście promocyjnym opisują decyzję; wstawić dopiero z włączonym zakupem. Kwoty i liczby modelu (0,99 / 6,99 / 14,99 USD, 14 dni, 4 treningi na żywo w miesiącu, ceny lokalne PL) są wyłącznie w `docs/monetyzacja.md`; poniższe teksty muszą się z nim zgadzać (pilnuje `tests/audit-m1-045-store-description.test.ts`). Opis zgodny z kodem: bez kalkulatora talerzy (usunięty 19.10.2026), z aplikacją na Apple Watch, zapowiedziami głosowymi (domyślnie wyłączone), odczytem i zapisem Apple Health (wytyczne 2.5.1: integracja ze Zdrowiem ma być wskazana w opisie — docs/41 D3) i systemem miar metrycznym/imperialnym.

### Polski (pl)

**Nazwa / podtytuł — dwa warianty (decyzja właściciela):**

| Wariant | Nazwa | Podtytuł | Znaki (nazwa / podtytuł) |
|---|---|---|---|
| A | Trening: dziennik siłowni | Plan, serie i timer przerw | 25 / 26 (limit 30 / 30) |
| B | Trening | Dziennik siłowni, plan, timer | 7 / 29 (limit 30 / 30) |

| Pole | Znaki | Limit |
|---|---|---|
| Nazwa A | 25 / 30 | ok |
| Podtytuł A | 26 / 30 | ok |
| Nazwa B | 7 / 30 | ok |
| Podtytuł B | 29 / 30 | ok |
| Słowa kluczowe | 87 / 100 | ok |
| What's New 0.12.0 | 175 / 4000 | ok |

**Słowa kluczowe** (dla wariantu A; bez słów z nazwy i podtytułu):

`ćwiczenia,hantle,sztanga,siła,masa,rekordy,e1RM,szablony,kalendarz,offline,RPE,RIR,gumy`

**Tekst promocyjny i opis:** od 22.10.2026 jedno źródło dla wszystkich 33 lokalizacji — `store/app-store-metadata.json` (pola `promotionalText`, `description`; test `tests/store-metadata.test.ts` i `tests/audit-m1-045-store-description.test.ts`); tu nie powtarzamy (zasada jednego miejsca). Opis po redesignie M3: docs/45.

**Co nowego (0.12.0):**

- 9 nowych języków: Português (Brasil), Español (Latinoamérica), Bahasa Indonesia, Bahasa Melayu, Tiếng Việt, Русский, 日本語, 한국어, 繁體中文.
- 35 języków; język zmienisz w Ustawieniach.

### English (en-US)

**Nazwa / podtytuł — dwa warianty (decyzja właściciela):**

| Wariant | Nazwa | Podtytuł | Znaki (nazwa / podtytuł) |
|---|---|---|---|
| A | Training: Gym Log & Rest Timer | Plans, sets & progress offline | 30 / 30 (limit 30 / 30) |
| B | Training | Gym log, plans & rest timer | 8 / 27 (limit 30 / 30) |

| Pole | Znaki | Limit |
|---|---|---|
| Nazwa A | 30 / 30 | ok |
| Podtytuł A | 30 / 30 | ok |
| Nazwa B | 8 / 30 | ok |
| Podtytuł B | 27 / 30 | ok |
| Słowa kluczowe | 96 / 100 | ok |
| What's New 0.12.0 | 186 / 4000 | ok |

**Słowa kluczowe** (dla wariantu A; bez słów z nazwy i podtytułu):

`workout,exercise,strength,barbell,dumbbell,templates,calendar,records,e1RM,RPE,RIR,lifting,bands`

**Promotional text and description:** since 22.10.2026 in `store/app-store-metadata.json` (one source for all 33 localisations) — see the Polish section above.

**What's New (0.12.0):**

- 9 new languages: Português (Brasil), Español (Latinoamérica), Bahasa Indonesia, Bahasa Melayu, Tiếng Việt, Русский, 日本語, 한국어, 繁體中文.
- 35 languages; you can change the language in Settings.

### Rekomendacja nazwy i podtytułu

**Zastąpione 21.10.2026 (STOP 2 M5, docs/45):** nazwy, podtytuły i słowa kluczowe wszystkich lokalizacji — `store/app-store-names.json` i `store/app-store-metadata.json` (PL „Trening: dziennik treningowy” / „Serie i przerwy. Bez konta”; EN podtytuł „Workout tracker. No account.”). Warianty A/B niżej i wyżej zostają jako zapis; opis i tekst promocyjny z tego dokumentu obowiązują do czasu M3.

- **Wariant A (rekomendowany):** nazwa z rejestru (decyzja 05.10/06.10, `store/app-store-names.json`) zawiera słowa wyszukiwane przez ludzi („dziennik siłowni”, „gym log”, „rest timer”), a podtytuł dokłada plan i serie. Kompromis: dłuższa nazwa w sklepie, mniej „markowa”.
- **Wariant B:** krótka nazwa „Trening”/„Training” (jak nazwa pod ikoną), opis funkcji w podtytule. Kompromis: bardzo ogólne słowo — trudniej o unikalność nazwy w App Store Connect i słabsza widoczność w wyszukiwaniu; słowa kluczowe trzeba by przeliczyć.
- Decyzja należy do właściciela. Liczby znaków w tabelach wyżej.

### Do potwierdzenia przez właściciela

1. **Rozstrzygnięte 21.10.2026 (właściciel, przekazane przez koordynatora; docs/18):** opis bez list kwot, plan miesięczny porównany z ceną espresso w barze, przypis z przedziałem cen. **Zmiana 25.10.2026 (właściciel, „całkiem anonimowo”, docs/18): przypis w opisie sklepu i na stronie `site/espresso.html` podaje tylko średnią cenę (przedział 1,06–1,51 €) bez wskazania źródła (usunięto MIMIT, C.r.c., Assoutenti, Teleborsa z tekstów publicznych we wszystkich lokalizacjach); źródło zostaje wyłącznie w docs/research/espresso-mimit-2026-10.md.** Było: **Cena w opisie i tekście promocyjnym** (blok cenowy, „pierwszy miesiąc za darmo”): wstawiać dopiero z działającym zakupem; czy podawać kwoty w opisie (zmieniają się w App Store Connect bez nowej wersji, w innych krajach inne), czy tylko „subskrypcja lub dostęp dożywotni” — Apple (3.1.2) wymaga jasnych warunków odnawiania.
2. **Rozstrzygnięte 21.10.2026 — bez kwot (pkt 1).** Było: **Waluty w opisie:** EN podaje 0,99/6,99/14,99 w USD/EUR/GBP (opis jest jeden dla wszystkich krajów angielskiego) — czy tak, czy bez kwot.
3. **Family Sharing:** decyzja TAK (11.10.2026), opis ją wspomina; otwarte w docs/15: czy włączenie jest nieodwracalne — sprawdzić w App Store Connect przed wysyłką.
4. **Zastąpione 21.10.2026 (pkt 1): porównanie planu miesięczny ↔ espresso w barze z przypisem źródła (docs/research/espresso-mimit-2026-10.md).** Było: **Hasło „w cenie espresso lub taniej”** — pominięte; wymaga potwierdzenia cen espresso źródłami w każdym kraju (decyzja 09.10 pkt 3). **Zmiana (właściciel 11.10.2026, ok. 23:10): wyjątek od warunku źródeł — hasło wolno użyć bez potwierdzania cen espresso w każdym kraju** (hasło marketingowe, nie twierdzenie merytoryczne o treningu; ryzyko: w krajach z bardzo tanią kawą porównanie może być nieścisłe — Apple 2.3.1). Wstawić razem z blokiem cenowym, gdy zakup trafi do wydania.
5. **„What's New 0.12.0”:** szkic z 11.10.2026 zostaje jako zapis; tekst „Co nowego” dla 1.0 powstaje z `lib/whatsnew.ts` przy wydaniu.
6. **Zakres funkcji w opisie (odświeżony 20.10.2026 wg kodu):** generator planu, zamiana ćwiczenia, Apple Health (zapis i odczyt), Apple Watch, zapowiedzi głosowe, system miar, kopia/eksport JSON i CSV oraz import CSV — potwierdzić zakres 1.0 (docs/41, A4).
7. **Twierdzenie „bez śledzenia”** — zgodne z `site/privacy.html` (brak wywołań sieciowych); zweryfikować przed wysyłką, jeśli dojdzie StoreKit.
8. **Słowo „offline” w podtytule EN A i „bands” w słowach kluczowych** — czy zostają jako wyróżniki.
9. Poza tym zadaniem: zrzuty ekranu, kategoria, rating wiekowy, adres URL wsparcia.

## TestFlight po audycie M1 (20.10.2026): bramka E2E, środowisko „release”, manifest prywatności, mapy źródeł
- **Bramka E2E (M1-018).** `testflight.yml` ma pierwsze zadanie „bramka” (`scripts/ci/bramka-e2e.sh`): wysyłka rusza dopiero, gdy na TYM SAMYM commicie istnieje zielony przebieg `e2e-ios.yml` z pakietem podstawowym (albo pełnym / ścisłym). Przebieg rozpoznaje po tytule (`run-name` w `e2e-ios.yml`: „E2E iOS · podstawowy”, bez dopisków „tylko wybrane” i „aplikacja z innego przebiegu”). Trwający przebieg: bramka czeka (do ok. 110 min); czerwony albo brak: błąd z instrukcją. Push samej dokumentacji (`docs/**`, `*.md`) nie uruchamia ani E2E, ani TestFlight.
- **Jak dalej wydawać.** Normalnie: push na `main` uruchamia E2E (pakiet podstawowy) i TestFlight równocześnie; TestFlight czeka na wynik. Ręcznie: najpierw `e2e-ios.yml` (Run workflow, pakiet podstawowy) na gałęzi, potem `testflight.yml`. **Ścieżka awaryjna** (E2E padło z winy maszyny, nie kodu): `testflight.yml` → wejścia `pomin_bramke_e2e` = true i `powod` (obowiązkowy; trafia do podsumowania przebiegu). **Przebieg dowodowy** (zmiana budowania, podpisu, wysyłki — model po L-001): wejście `bez_wysylki` = true wykonuje pełną budowę, podpis i wszystkie strażniki, ale bez wysyłki do App Store Connect i bez tagu.
- **Środowisko „release” (M1-019).** Zadanie `build` deklaruje `environment: release`. GitHub tworzy je samo przy pierwszym użyciu (bez reguł i sekretów — dokumentacja GitHub, „Managing environments”: „Running a workflow that references an environment that does not exist will create an environment with the referenced name”). Dopóki właściciel nie doda wymaganego zatwierdzenia, nic się nie zmienia; po dodaniu każdy przebieg `build` czeka na zatwierdzenie (po przejściu bramki E2E). Ustawienia GitHub — tylko właściciel (kroki: osobny plik).
- **Manifest prywatności (M1-014, R-007).** Deklaracja w `app.json` → `ios.privacyManifests` (jedno źródło): FileTimestamp C617.1, UserDefaults CA92.1, SystemBootTime 35F9.1, DiskSpace E174.1 + 85F4.1 (ExpoFileSystem jest prekompilowany, jego manifest nie wchodzi do zbioru CocoaPods, więc kategorię deklarujemy sami). Prebuild zapisuje je do `ios/Trening/PrivacyInfo.xcprivacy`, `pod install` dokłada manifesty podów; `ensure-privacy-manifest.mjs --check` (kategorie czyta z `app.json`) sprawdza plik po `pod install` (`testflight.yml`, `ios-unsigned.yml`) i manifest w gotowej aplikacji; brak którejkolwiek kategorii jest błędem. Test: `tests/privacy-manifest.test.ts`, `verify:native`.
- **Mapy źródeł JS (M1-023).** Archiwum dostaje `SOURCEMAP_FILE`; plik jest sprawdzany (niepusty), wysyłany jako artefakt `mapy-zrodel-b<numer>` (90 dni) i dołączany do GitHub Release przy tagu `v<wersja>-b<numer>` (trwale). Symbolikacja stosu: `npx metro-symbolicate main.jsbundle.map < stos.txt`.
- **Klucz API (M1-020).** Zapis klucza `AuthKey.p8` na dysk maszyny następuje dopiero po archiwum i podpisie ad hoc, tuż przed eksportem (archiwum go nie potrzebuje).

## Wgranie opisów i nazw do App Store Connect — instrukcja dla właściciela (22.10.2026)
Zamiast przepisywać 33 lokalizacje ręcznie, wgrywa je workflow **„ASC metadane sklepu”** (`asc-metadane.yml`; decyzja i zakres: docs/18, 22.10.2026).
1. Najpierw w App Store Connect musi istnieć wersja **1.0** w stanie „Prepare for Submission” (Trening → „+” przy iOS App). Bez niej workflow zakończy się komunikatem z tym krokiem i nic nie zapisze.
2. GitHub → **Actions → ASC metadane sklepu → Run workflow** → tryb **podglad** → Run. Podsumowanie przebiegu pokazuje tabelę „lokalizacja × pole” (bez zmian / zmiana / nowa / błąd) i listę zmian; nic nie jest zapisywane.
3. Jeśli tabela jest zgodna z oczekiwaniami: **Run workflow → tryb zapis** → Run → w oknie przebiegu **Review deployments → release → Approve and deploy** (zatwierdzenie działa, gdy w środowisku `release` jest ustawiony wymagany recenzent — ustawienie opisane wyżej, tylko właściciel).
4. Po zapisie ten sam podgląd powinien pokazać same „bez zmian”. Workflow niczego nie usuwa i nie rusza lokalizacji spoza repozytorium; `sl` (słoweński) jest pomijany.
