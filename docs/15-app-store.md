# 15. Publikacja w App Store — decyzje i plan (stan 05.10.2026)

## Decyzje właściciela

Rozmowa 05.10.2026, rano: „Chciałbym móc opublikować to w Apple Store” i odpowiedzi na pytania.

- **Publikacja:** „Jeszcze nie publikujemy, zastanowimy się nad tym za chwilę” — **nic nie jest wysyłane** do App Store Connect.
- **Wysyłka (gdy przyjdzie czas):** GitHub Actions i klucz App Store Connect API (.p8).
  - Build na darmowym macOS, jak `iphone-local.yml`. Wysyłka przez `xcrun altool`.
  - Klucz tylko jako sekret GitHub, nigdy w repo (CLAUDE.md, ADR-031). Bez `eas submit`: limitów darmowego planu dla Submit nie sprawdzono.
- **Polityka prywatności:** GitHub Pages z tego repozytorium (`docs/`) — strona `docs/privacy.html` (PL/EN, 08.10.2026, audyt N2; treść zgodna
  z kodem: brak wywołań sieciowych, HealthKit tylko zapis, powiadomienia lokalne). Krok właściciela po scaleniu do `main`: Settings → Pages →
  Deploy from a branch → `main` / `/docs`; adres: https://lkarwowski494.github.io/trening/privacy.html (do App Store Connect → App Privacy).
  `docs/.nojekyll` — bez przetwarzania Jekyllem (dokumenty .md podawane bez zmian).
  - Treść: brak zbierania danych, wszystko lokalnie na telefonie, HealthKit tylko zapis zakończonych treningów.
- **Cena:** „Darmowa na start” (05.10.2026) — bez reklam i zakupów; w App Store Connect deklaracja „nie jestem traderem” (DSA), bez publicznego adresu.
- ~~**Płatności później, wcześniejsi użytkownicy za darmo**~~ (odwołane 06.10.2026: płatna subskrypcja od pierwszej wersji, bez darmowych użytkowników; było — właściciel 05.10.2026: „Później najwyżej wprowadzimy płatności, ale tym, co już mają, to zostawimy darmową”).
  Kierunek (do decyzji, gdy przyjdzie czas): aplikacja dalej darmowa do pobrania, wersja Pro jako zakup w aplikacji;
  kto pobrał przed wersją płatną, ma Pro bez opłaty — StoreKit 2 `AppTransaction.originalAppVersion` (Apple podaje numer
  **buildu** z pierwszego pobrania, nie wersję marketingową). Wymóg już dziś: numery buildów tylko rosną i są zapisywane
  (EAS `appVersionSource: remote` + `autoIncrement`). Płatna wersja = status tradera (DSA: adres i telefon publicznie) i PIT.
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
- **Nazwa:** decyzja właściciela 05.10.2026 (potwierdzona 06.10) — `store/app-store-names.json` (12 lokalizacji App Store), szczegóły w docs/16 „Nazwa aplikacji”. Unikalność potwierdzi rezerwacja nazwy w App Store Connect.

## Wzrost i promocja — ustalenia (właściciel 06.10.2026)

- **Cel:** powolne zdobywanie użytkowników, którzy zostają na stałe — bez ostrej, szybkiej promocji. „100 pobrań miesięcznie byłoby super.”
- **Realistyczny punkt wyjścia (ocena agenta, nie dane):** bez promocji — rzędu kilkudziesięciu pobrań w pierwszym miesiącu, potem od kilku do kilkudziesięciu
  miesięcznie; kategoria „dziennik treningów” zatłoczona (Strong, Hevy, Fitbod, JEFIT). Liczby do zweryfikowania po premierze (App Store Connect → Analityka).
- **Kanały za 0 zł (zgoda właściciela 06.10: „Tak” — przygotować przy wydaniu):**
  1. ASO: słowa kluczowe i opisy w 12 lokalizacjach App Store (`store/app-store-names.json` + opisy), zrzuty ekranu w każdym języku (`npm run screens`).
     Największa szansa w mniejszych sklepach (cs, sk, lt, lv, et, hr, sl, ro, hu, bg) — mniejsza konkurencja, nazwa lokalna.
  2. Prośba o ocenę w aplikacji po kilku treningach (systemowe okno Apple) — do zaprojektowania (kiedy, ile razy), decyzja właściciela.
  3. Spokojne wpisy tam, gdzie są osoby trenujące (lokalne fora/grupy, Reddit np. r/homegym): bez konta, dane w telefonie, offline, domowa siłownia.
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
       będzie to kłamstwem”. Warunek (zasada rzetelnych źródeł): przed publikacją opisu potwierdzić źródłami cenę espresso w każdym kraju,
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
  - **Do sprawdzenia w App Store Connect** (nie zgadujemy): czy punkty cenowe 0,99 EUR/GBP, 3,99 PLN i 19,99 PLN istnieją w siatce cen Apple.
- **Cel przychodu (właściciel 06.10.2026):** ~2000 zł miesięcznie; model bez zmian: 30 dni za darmo, potem jednorazowa płatność.
  Rachunek orientacyjny (agent, do sprawdzenia): z ceny w App Store odpada VAT kraju kupującego (PL 23%) i prowizja Apple (15% w Small Business
  Program), czyli na konto ok. 0,69 × cena przy kupującym z Polski. Potrzebne zakupy miesięcznie: cena 29 zł → ok. 100; 49 zł → ok. 59;
  79 zł → ok. 37; 99 zł → ok. 29. Jednorazowa płatność = przychód tylko z NOWYCH kupujących, więc przy ~100 pobraniach/mies. cel wymaga,
  żeby kupowała duża część pobierających — realnie potrzeba kilkuset pobrań miesięcznie albo wyższej ceny (założenie, nie dane;
  odsetek kupujących po okresie próbnym zmierzymy po premierze w App Store Connect). Darmowych użytkowników nie będzie (decyzja 06.10).
  **Otwarte:** cena; podatek dochodowy od sprzedaży w App Store przy koncie osoby prywatnej — pytanie do księgowego
  (nie zgadujemy).
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
3. **Profil „App Store”:** certyfikat dystrybucyjny i profil App Store w EAS credentials. Dziś jest tylko ad hoc.
4. **`ITSAppUsesNonExemptEncryption: false`** w `app.json` (aplikacja nie używa własnego szyfrowania). Do potwierdzenia przy audycie.
5. **Zrzuty ekranu** (6,9″ i 6,5″) z symulatora — Maestro `takeScreenshot` albo `scripts/screens`. Opis PL/EN.
6. **Strona polityki prywatności i wsparcia** na GitHub Pages.
7. **Elementy specyficzne dla właściciela do przejrzenia** przed sklepem: presety ViShape, teksty o „domu właściciela” w podpowiedziach, dane demo.
8. **Prawa autorskie — OBOWIĄZKOWE przed upublicznieniem aplikacji** (polecenie właściciela 09.10.2026). Bez tego nie wysyłamy do App Store:
   - **cytaty w repozytorium:** w `docs/research` jest ok. 800 dosłownych fragmentów cudzych stron (najwięcej w `docs/research/kb/` — research
     konkurencji z 03.10; także pliki źródeł researchu biblioteki), niektóre do ~900 znaków. Skrócić do niezbędnego fragmentu (1–2 zdania +
     adres i miejsce) — prawo cytatu (art. 29 ustawy o prawie autorskim) obejmuje fragmenty w zakresie uzasadnionym analizą; test pilnujący
     maksymalnej długości cytatu w `docs/research`. Wariant do potwierdzenia przez właściciela przy realizacji: A skrócić (rekomendacja) /
     B przenieść research konkurencji na Dysk / C zostawić. Historia gita zostaje bez przepisywania (jak decyzja z 06.10 przy N1);
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

Po researchu skarg (docs/research/skargi-uzytkownikow-2026-10.md: płatności to skarga nr 1, najostrzej oceniane odbieranie darmowych
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

## Limit Expo na buildy lokalne (06.10.2026)
Przebieg `iphone-local.yml` 37422172177: build lokalny OK, ale `eas upload` odrzucony — „This account has used its local builds from the free plan
this month, which will reset in 25 days (on Sun Nov 01 2026)”. Darmowy plan Expo liczy też buildy lokalne wysłane przez `eas upload`
(wcześniej zakładano, że tylko buildy w chmurze — docs/13). Link instalacyjny przez Expo niedostępny do 01.11.2026.
Do decyzji właściciela: TestFlight (testy wewnętrzne — bez recenzji Apple) albo instalacja pliku .ipa z komputera Mac; płatny plan Expo — nie (0 zł).

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
- **WYSOKIE (sprawdzone):** stare przebiegi `iphone-eas.yml` sprzed maskowania UDID — lista przebiegów tego workflow jest pusta (0), nie ma czego usuwać.
- **ŚREDNIE:** (1) `iphone-eas.yml`/`iphone-local.yml` — sekrety ustawione dla całego workflow (dostępne podczas `npm ci`/testów) — do przeniesienia
  do pojedynczych kroków (otwarte; workflowy i tak nieużywane do 01.11 — limit Expo); (2) `testflight.yml` — klucz na dysku dopiero przed archiwum
  (naprawione); (3) `tests/fixtures/web03-backup.json` zawierał wagę ciała i wpisy z 02.10.2026 — właściciel: „Tak — zamień na zmyślone” (06.10): poranny wpis fikcyjny, daty przesunięte o 300 dni; stare wartości zostają w historii git (przepisanie historii — nie).
- **NISKIE:** `ios-unsigned.yml` artefakty 1 dzień (naprawione); `.gitignore` dla `.env*`, `*.p8`, `*.p12`, `*.mobileprovision`, `*.cer` (naprawione);
  `appleTeamId` w `app.json` — Apple nie traktuje go jako sekretu (zostaje); Maestro instalowany bez przypiętej wersji (bez sekretów — zostaje).
- Do sprawdzenia przez właściciela: GitHub → Settings → Actions → General → „Fork pull request workflows” — wymagane zatwierdzenie.
