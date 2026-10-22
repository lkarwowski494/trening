# Badanie zmiany modelu monetyzacji (rola 02, build) — STOP E2

Stan: 22.10.2026 · gałąź `monetyzacja-badanie-2026-10-22` · otwarcie badania: docs/18 (wpis z 22.10.2026).
Obowiązuje model stały z `docs/monetyzacja.md` do wyboru właściciela na tym STOP. Kod, `store/` i App Store Connect bez zmian.
Cudze treści (nazwy aplikacji, ceny konkurentów, cytaty recenzji) są poza repo: plik `rynek.md` i surowe dane z tej sesji. Właściciel wgrywa je na Dysk („Trening App / 05 Research konkurencji”). Tutaj są tylko wnioski.

## 1. Badane warianty

| | A0 obecny | V1 | V2 |
|---|---|---|---|
| Próba 14 dni | oferta wprowadzająca subskrypcji odnawianej (po próbie płatność sama) | Non-Consumable „14-day Trial” za 0 (3.1.1), bez przyszłej opłaty | jak V1 |
| Plany | miesięczna 0,99 i roczna 6,99 USD (odnawiane), dożywotnia 14,99 | Non-Renewing 30 dni 0,99 · 3 mies. 2,49 · 1 rok 6,99; dożywotnia 14,99 (Non-Consumable) | jak V1 bez 3 mies. |
| Po końcu dostępu | 4 treningi na żywo w miesiącu, reszta działa | **blokada z podłogą danych** (wariant **+4**: 4 treningi w miesiącu zamiast blokady) | jak V1 |

Podłoga danych w blokadzie: ekran zakupu i przywracanie (3.1.1), polityka prywatności (5.1.1(i)), historia tylko do odczytu, eksport i kopia, usunięcie danych.

## 2. Reguły sklepu (odczyt 22.10.2026; cytaty sprawdzone dosłownie, curl + grep)

| ID | Źródło | Cytat / ustalenie | Skutek |
|---|---|---|---|
| MS-01 | developer.apple.com/app-store/review/guidelines/, „Last Updated: October 16, 2026”, 3.1.1 | „Non-subscription apps may offer a free time-based trial period before presenting a full unlock option by setting up a Non-Consumable IAP item at Price Tier 0 that follows the naming convention: “XX-day Trial.”” Przed startem: „its duration, the content or services that will no longer be accessible when the trial ends, and any downstream charges” | mechanizm próby V1/V2 |
| MS-02 | tamże, 3.1.2 | „Apps may offer auto-renewable in-app purchase subscriptions…”; wytyczne nie zawierają słowa „non-renewing” (grep: 0 wystąpień) | **[DO USTALENIA] OP-1:** czy aplikacja z Non-Renewing Subscriptions to „non-subscription app”. Źródło Apple tego nie rozstrzyga; wątek na forum Apple z tym pytaniem nie ma odpowiedzi Apple (szczebel 5) |
| MS-03 | tamże, 3.1.2(a) | „should not take away the primary functionality existing users have already paid for” | dotyczy płacących; Trening nie jest jeszcze w sklepie, płatności były tylko w piaskownicy → brak osób do migracji |
| MS-04 | tamże, 3.1.1 | „restore mechanism for any restorable in-app purchases” | przycisk przywracania zostaje |
| MS-05 | ASC Help, in-app-purchase-types | „Non-Renewing Subscription: A product that allows users to purchase a service with a limited duration. The content of this In-App Purchase can be static. This type of Subscription does not renew automatically.” | typ pasuje do 30 dni / 3 mies. / rok |
| MS-06 | ASC Help, create-non-renewing-subscriptions | „Your first non-renewing subscription must be submitted with a new app version.” | produkty wysyłane razem z 1.0 |
| MS-07 | StoreKit, original-api-for-in-app-purchase | „…auto-renewable or non-renewing subscription, your app is responsible for making it available across all the person’s devices, and for restoring past purchases.” | koniec okresu i inne urządzenia liczy aplikacja (rozdz. 3) |
| MS-08 | ASC Help, turn-on-family-sharing-for-in-app-purchases | „Family Sharing is a feature supported only by apps that offer auto-renewable subscriptions and non-consumable In-App Purchases”; „once you turn on Family Sharing … you can't turn it off.” | **plany czasowe nie będą rodzinne**; rodzinny zostaje tylko dożywotni. Próby nie włączać (nieodwracalne) |
| MS-09 | StoreKit, supporting-offer-codes-in-your-app | kody ofertowe dla „non-renewing subscriptions are available starting in iOS 16.3” | kody ofertowe (decyzja 09.10.2026) zostają możliwe |
| MS-10 | developer.apple.com/app-store/small-business-program | „reduced commission rate of 15% on paid apps and Apple In-App Purchases” | 15% dla wszystkich typów; 85% po roku dotyczy tylko odnawianych, przy 15% bez znaczenia |
| MS-11 | guidelines 2.3.2 | opis i zrzuty mają jasno wskazać, czy „subscriptions, etc.” wymagają dodatkowych zakupów (z odczytu narzędziem, pełne zdanie niesprawdzone dosłownie) | opis M5: „14 dni pełnej wersji za darmo, potem zakup” — bez „free app” bez zastrzeżenia |
| MS-12 | ustawa o informowaniu o cenach, t.j. Dz.U. 2023 poz. 168, art. 4 ust. 2 | najniższa cena z 30 dni przy „informowaniu o obniżeniu ceny towaru lub usługi” | **nie dotyczy po decyzji 22.10.2026** (ekran ofert bez procentów i odniesień) |

Z odczytu narzędziem (szczebel niższy, do potwierdzenia w App Store Connect przez właściciela): 900 punktów cenowych, krok 0,10 USD do 10 USD → 2,49 USD powinno istnieć **[DO USTALENIA OP-2]**; cena 0 dla „14-day Trial” **[DO USTALENIA OP-3]**; identyfikatora produktu nie da się użyć ponownie ani zmienić typu → nowe ID dla planów czasowych; produkt w stanie roboczym, którego nie da się usunąć, był na forum przyczyną odrzuceń 2.1(b) **[DO USTALENIA OP-4]**.

## 3. StoreKit 2 i `expo-iap` 5.8.1 (raport techniczny z tej sesji, plik:linia w `storekit-kod.md` poza repo)

- `Transaction.currentEntitlements` zwraca „The latest transaction for each non-renewing subscription, including finished ones” (dosłownie) → **koniec liczy aplikacja**: data zakupu + długość planu (długości w `lib/products.ts`). Dziś adapter (`lib/store-native.ts:55`) nie podaje daty końca dla planu innego niż dożywotni, a `lib/access.ts` traktuje brak daty jako uszkodzone dane → **zakup nieodnawialny nie dałby dostępu bez zmiany kodu**.
- **Dokupienie przed końcem:** sklep zwraca tylko ostatnią transakcję produktu → liczenie z niej skraca opłacony czas. Opcje: historia z `getAllTransactionsIOS` (czy zawiera nieodnawialne — **[DO USTALENIA OP-5]**, piaskownica), własny dziennik zakupów, albo przedłużanie dopiero po końcu okresu (w ostatnich dniach przycisk „Przedłuż od <data>” liczy od końca). Decyzja techniczna roli 05/08 po wyborze.
- Próba (Non-Consumable za 0): przywraca się po ponownej instalacji i na nowym urządzeniu, więc reinstalacja nie zeruje próby, jeśli koniec liczy się z daty pierwotnej transakcji. Czy arkusz zakupu za 0 pyta o Face ID — piaskownica.
- Zwrot: produkt znika z uprawnień; `revocationDate` „The date that the App Store refunded the transaction or revoked it from Family Sharing.”
- `expo-iap` 5.8.1 obsługuje `non-renewing-subscription`, zakup, `getAvailablePurchases`, `getAllTransactionsIOS`, `syncIOS` — **bez zmiany wersji biblioteki** (bez łączenia aktualizacji SDK ze zmianą danych — CLAUDE.md).
- Zostaje bez zmian: stany full/free/unknown/testflight, karencja offline 7 dni, zapamiętany wynik, nasłuch od startu, strażnik startu, przywracanie, kody ofertowe. Odpada: oferta wprowadzająca i jej wnioskowanie (M1-012, M1-017), karencja płatności, „Zarządzaj subskrypcją”, tekst o odnawianiu, grupa subskrypcji w `.storekit`. Do zmiany: lista planów, przypomnienie przed końcem próby (dziś mówi o anulowaniu subskrypcji — w V nieprawdziwe), ekran zakupu z ujawnieniami 3.1.1, sztuczny sklep, `.storekit`, 4 pliki w `store/`.
- **Blokada przeczy obecnej liście `ALWAYS_AVAILABLE`** (`lib/access.ts`: edycja historii, trening wstecz, szablony, plan, biblioteka) — ok. 20 ekranów i akcji zapisu do zablokowania; wariant +4 korzysta z istniejącego licznika.

## 4. Rynek (odczyt 22.10.2026; szczegóły i nazwy na Dysku)

- 28 dzienników treningu siłowego (sklepy PL i US): subskrypcję odnawianą ma 28 z 28, dożywotni dodatkowo 5 z 28; **zakupy czasowe bez odnawiania 0 z 28, produkt „XX-day Trial” 0 z 28**. W 168 przejrzanych aplikacjach (1082 pozycje zakupów) model bez odnawiania potwierdzają opisy tylko w małych aplikacjach (najbliższy odpowiednik: 79 ocen). Wyróżnik — i brak dowodu, że model działa na skali.
- Ceny: rok 6,99 USD to druga najniższa cena roczna w próbce; 3 mies. kosztuje u konkurencji zwykle 2,3–2,5 ceny miesięcznej (nasze 2,49 = 2,52×); okres 3/6 mies. widać w nazwie produktu w 7 z 28 (dolna granica).
- Recenzje (10 aplikacji, 6115 recenzji, średnio 3,92★): o pieniądzach 22% (2,85★); „darmowa próba pobrała opłatę” 54 (0,9%, **1,26★**) — wszystkie w aplikacjach z próbą odnawianą; skargi na twardą blokadę 218 (3,6%, 2,10★); pochwały zakupu jednorazowego / braku subskrypcji 167 (4,40★, bez aplikacji, która odebrała dożywotnie). Aplikacja, która w 2026 przeszła na twardą blokadę z odcięciem historii, spadła ze średniej 4,4–4,6 do ok. 2★. Klasyfikacja słownikiem — liczby przybliżone.
- Wskaźniki (szczebel 4, jedno źródło; sprawdzone w zapisanym tekście strony): RevenueCat „State of Subscription Apps 2026” — Health & Fitness: pobranie → próba 6,9%, próba → płatny 37,7%, pobranie → płatny 2,9%; najniższy próg cen: pobranie → płatny 1,4%; twarda zapora 10,7% vs freemium 2,1% (miara niejasna w źródle). Próba bez przyszłej opłaty vs z opłatą — **dla aplikacji mobilnych brak danych**; jedyna analogia (SaaS, FirstPageSage): start próby 8,5% vs 2,5%, próba → płatny 18,2% vs 48,8%.

## 5. Rachunek (`docs/monetyzacja/porownanie.mjs` + `porownanie.json`, kod 0; `rachunek.mjs` + `rachunek.json` — wpływ jednostkowy PL)

Jedna roczna kohorta pobrań w horyzoncie 24 mies. ≈ wpływ roczny w stanie ustalonym; prowizja 15%, podatek efektywny 12% [OCENA]; pobrania: 100 / 310 / 1000 mies. (pes. = cel właściciela 06.10, norm. = W0, opt. [OCENA]). Każda liczba wejściowa ma źródło albo [OCENA] z metodą w pliku danych. **Sprawdzian:** A0 normalny 549 USD ≈ wynik bramki W0 (ok. 570 USD).

| model | pesymistyczny USD/rok | normalny USD/rok | optymistyczny USD/rok |
|---|---|---|---|
| A0 obecny | 76 | **549** | 3385 |
| V1 blokada | 40 | **520** | 6005 |
| V2 blokada | 39 | **509** | 5766 |
| V1 + 4 treningi | 37 | 409 | 4301 |
| V2 + 4 treningi | 37 | 401 | 4130 |

Wrażliwość (normalny, jedna wielkość ×0,75 / ×1,25): A0 424–674 (start/konwersja), **465–878 (odnowienia — A0 zależy od płatności, o których ludzie zapominają)**; V1 400–640 (start/konwersja), 487–568 (powtórne zakupy). **Próg zrównania:** V1 z blokadą dorównuje A0 przy konwersji po próbie 12,8% (założone 12,0%), V2 przy 13,1%, V1 +4 przy 11,7% (założone 8,4%).

Wpływ jednostkowy PL (rachunek.mjs, VAT 23%, prowizja 15%): 30 dni 4,99 zł → 3,45 zł · 3 mies. 11,99 zł (propozycja, OP-6) → 8,29 zł · rok 19,99 zł → 13,81 zł · dożywotni 59,99 zł → 41,46 zł.

**Wnioski z rachunku:** (1) w scenariuszu normalnym A0, V1 i V2 z blokadą różnią się o 5–7% — mniej niż rozrzut założeń; wszystkie są przy progu 500 USD. (2) Rozstrzyga nieznana konwersja próby bez przyszłej opłaty w aplikacji mobilnej — nie ma na nią danych; dowie się tego dopiero App Store Connect. (3) Oferta 3 mies. daje +2% (V1 vs V2) — poniżej szumu. (4) Blokada vs 4 treningi: ok. +27% w modelu, ale ta różnica wynika z założenia [OCENA] (konwersja ×0,7 przy miękkiej zaporze), a ryzyko ocen jest po stronie blokady.

## 6. Etyka

- V usuwa źródło najostrzejszych skarg (próba sama zamieniona w opłatę, 1,26★) i opłaty za zapomniane subskrypcje; nagłówek „No subscriptions. Nothing renews by itself…” jest prawdziwy **tylko wtedy, gdy w aplikacji nie ma żadnego produktu odnawianego** → strażnik w testach (żaden produkt w `PRODUCT_IDS`/`.storekit` nie jest auto-renewable) i usunięcie/wycofanie produktów odnawianych w App Store Connect.
- Twarda blokada: zapowiedziana przed startem próby (wymóg 3.1.1 — co przestanie działać), dane nigdy zakładnikiem (podłoga), trening w toku w chwili wygaśnięcia kończy się normalnie (do decyzji).
- Przypomnienie przed końcem próby: informacyjne, bez odliczania i „ostatniej szansy” (2005/29/WE zał. I pkt 7), tylko po zgodzie na powiadomienia; treść „Twoja próba kończy się <data>. Potem: wybierz plan albo zostań przy odczycie i eksporcie danych.”
- Opis w sklepie: bez „darmowa aplikacja” bez zastrzeżenia (2.3.2, 2005/29/WE zał. I pkt 20).
- Offline: karencja 7 dni zostaje, ale tylko do daty końca okresu policzonej z ostatniego udanego odczytu (bez wydłużania przez cofnięcie zegara telefonu — ryzyko R-NR-5).

## 7. Skutki dla 1.0 (cel ok. 29–31.10)

| obszar | V1/V2 | A0 |
|---|---|---|
| kod (`lib/products.ts`, `lib/access.ts`, adapter, ekran zakupu, przypomnienie, blokada, sztuczny sklep, `.storekit`) | ok. 20 plików testów do przepisania, 2–3 do usunięcia, nowy tryb blokady (~20 ekranów/akcji); Maestro: `21-subskrypcja` przepisany, `35-ustawienia-dostepnosc` zmieniony, 3–4 nowe scenariusze, `tests/przeplywy.json` | bez zmian |
| teksty | ekran ofert, ujawnienia 3.1.1, przypomnienie, blokada — 35 języków (tłumacz) | bez zmian |
| opisy App Store (M5, 33 lokalizacje) | blok subskrypcji przepisany | bez zmian |
| App Store Connect (właściciel) | 3–4 nowe produkty + „14-day Trial”, ceny ręczne PL/EUR, wycofanie odnawianych, Family Sharing tylko dożywotni | bez zmian |
| piaskownica, audyt M1 | test zakupów na nowych typach; zakres audytu powiększony o płatności | jak planowano |
| BRD, rejestr twierdzeń, docs/27, docs/30, docs/monetyzacja.md | aktualizacja | bez zmian |

Czas agenta (szacunek, praca równoległa 2–3 agentów): ok. 8–12 h pracy, ok. 4–6 h zegarowo + pełne verify (~12 min) i E2E pakiet podstawowy. Oczekiwanie: odpowiedź App Review na OP-1 (dni, nieznane — **[DO USTALENIA]**), kolejka maszyn macOS. Czas właściciela: decyzje na tym STOP (~15 min), App Store Connect (~45 min), test w piaskownicy (~20 min), ewentualne pytanie do App Review (~10 min). **Ryzyko terminu:** realne — V mieści się w 29–31.10 tylko bez czekania na odpowiedź App Review (wysyłka 1.0 z opisem modelu w „Notes for Review” i gotowym planem awaryjnym).

Plan awaryjny przy odrzuceniu z 3.1.1 (OP-1): usunąć „14-day Trial” i zostawić plany nieodnawialne + **limit użycia** (np. pierwsze treningi za darmo) zamiast czasu — limit użyć nie jest okresem próbnym w rozumieniu 3.1.1 (kalibracja biblioteki ról); zmiana jednej listy produktów i stałej limitu.

## 8. Decyzje dla właściciela (STOP E2)

**D1 — model.**
- **(a) V2 z blokadą i podłogą danych (rekomendacja).** Rachunek: normalny 509 USD (−7% wobec A0, w granicach rozrzutu), optymistyczny wyższy niż A0. Nie ma płatności, o których ktoś zapomniał, ani próby, która sama zamienia się w opłatę. Najmniej produktów do testu i tłumaczeń. Ryzyka: OP-1 (zgodność z 3.1.1), nieznana konwersja próby bez opłaty, ok. 8–12 h pracy agenta przed 1.0 i ryzyko terminu.
- **(b) V1 z blokadą.** +2% wobec V2, tekst oferty 3 mies. już jest („One training block at a time” pasuje do bloku treningowego). Kosztem jest jeden produkt i wiersz więcej. Ofertę 3 mies. da się dodać później z nową wersją aplikacji (MS-06).
- **(c) A0 bez zmian.** Najwyższy wynik pesymistyczny i normalny, zero pracy, termin pewny. Zostaje jednak to, co właściciel nazwał „red flag”, a 0,9% skarg na 1,26★ w kategorii pochodzi właśnie z tego mechanizmu.

**D2 — po końcu dostępu.** (a) **blokada z podłogą danych (rekomendacja, kierunek właściciela)**: w modelu ok. +27%, ale z założenia; wymaga zapowiedzi przed próbą i nowego trybu UI. (b) 4 treningi w miesiącu: mniej skarg na blokadę i istniejący licznik, ale normalny wynik ok. 400 USD, poniżej progu 500.

**D3 — termin wobec OP-1.** (a) **wysłać 1.0 z V i opisem w Notes for Review, z planem awaryjnym gotowym w kodzie (rekomendacja)**: termin się nie przesuwa, ale odrzucenie może kosztować jedną rundę przeglądu. (b) najpierw zapytać App Review i dopiero potem budować: bezpieczniej, ale 1.0 przesuwa się o czas odpowiedzi (nieznany).

**D4 — teksty ofert (z decyzji 22.10.2026).** Czy pod nazwami zostają opisy bez liczb („One more month to get to know Trening.”, „A whole year of workouts.”, „Pay once, keep it forever.”)? (a) **tak (rekomendacja)**: opis mówi, co się dostaje, bez porównań. (b) same nazwy.

**D5 — przedłużanie przed końcem okresu.** (a) **zakup kolejnego okresu dodaje czas od końca bieżącego (rekomendacja)**: aplikacja sumuje z historii transakcji albo własnego dziennika; nikt nie traci opłaconych dni. (b) przycisk zakupu tego samego planu nieaktywny do końca okresu: prostsze, ale przerwa w dostępie przy przedłużaniu.

**D6 — Family Sharing.** Plany czasowe nie mogą być rodzinne (MS-08). (a) **dożywotni rodzinny jak dotąd, próba bez Family Sharing (rekomendacja)**. (b) bez Family Sharing nigdzie: tylko dla nowego produktu, bo włączenia nie da się cofnąć.

## 9. Otwarte pytania i ryzyka (do „Rejestru ryzyk” docs/40 po wyborze V)

| ID | Pytanie / ryzyko | Rozstrzyga |
|---|---|---|
| OP-1 | czy „14-day Trial” (3.1.1) wolno łączyć z Non-Renewing Subscriptions | App Review (Notes for Review albo pytanie właściciela) |
| OP-2 | czy 2,49 USD jest na liście cen IAP | właściciel w App Store Connect (~2 min) |
| OP-3 | czy Non-Consumable może mieć cenę 0 („Free”) | jw. |
| OP-4 | czy istniejące produkty odnawiane (niewysłane) da się usunąć; inaczej „Remove from sale” i ryzyko 2.1(b) | właściciel w App Store Connect |
| OP-5 | czy `getAllTransactionsIOS` zwraca wszystkie transakcje nieodnawialne (sumowanie okresów) i czy zakup za 0 wymaga Face ID | test w piaskownicy |
| OP-6 | cena 3 mies. w PL i EUR (propozycja 11,99 zł; EUR — przeliczenie Apple) | właściciel (tylko V1) |
| R-NR-5 | cofnięcie zegara telefonu wydłuża dostęp offline | rola 05/08: koniec z daty transakcji, karencja liczona od ostatniego odczytu sklepu |
| OP-7 | wytyczne Komisji do art. 6a dyrektywy 98/6/WE — strona EUR-Lex blokuje odczyt automatyczny | nieistotne po decyzji „bez procentów”; zamknięte warunkowo |

Kroki po wyborze (nie wcześniej): wpis decyzji w docs/18 słowami właściciela, aktualizacja `docs/monetyzacja.md` (model), BRD, kontrakt płatności (E3), zlecenia dla ról 05/08/tłumacza/M5.

## 10. Model M — darmowe do N dni treningowych w miesiącu (zlecenie właściciela 22.10.2026, badanie)

**Model:** cała aplikacja darmowa; blokada tylko na „Zacznij trening” (każda droga startu z `GUARDED_STARTS` — także zegarek, bo startuje z telefonu, docs/35), gdy w miesiącu jest już N dni treningowych (N = 4, 5 albo 6). Dzień treningowy = dzień z co najmniej jednym ukończonym treningiem na żywo; drugi trening tego samego dnia nie zużywa limitu. Pro (0,99 / 6,99 / 14,99 USD) zdejmuje limit. Bez okresu próbnego.

**Reguły sklepu:** limit użycia to nie okres próbny w rozumieniu 3.1.1 (kalibracja biblioteki ról: licznik użyć to limit darmowej wersji), więc **znika ryzyko OP-1** (próba „XX-day Trial” z planami nieodnawialnymi). „Pro w subskrypcji” da się zrobić na dwa sposoby:
- **S1 — subskrypcje odnawiane + dożywotni** (produkty już są w App Store Connect, kod jest; usunąć tylko ofertę wprowadzającą 14 dni). Obowiązują ujawnienia 3.1.2(a) i „Zarządzaj subskrypcją”. Nie ma próby, która sama zamienia się w opłatę, ale nagłówek „No subscriptions. Nothing renews by itself…” **nie pasuje** — ekran ofert potrzebuje innego nagłówka.
- **S2 — 30 dni / rok bez odnawiania + dożywotni** (jak V2; nagłówek „No subscriptions…” prawdziwy; wymaga liczenia końca okresu w aplikacji i nowych produktów — rozdz. 3).

**Reguła liczenia (propozycja do decyzji, zgodna z dzisiejszym licznikiem docs/27):** dzień = data **startu** treningu na zegarze z jego strefą (trening 23:50–00:40 liczy się do dnia startu); liczy się trening zakończony „Zakończ” albo zapisany automatycznie po 6 h bez aktywności (`autoFinishStale`) — niekończenie treningu nie obchodzi limitu, bo w toku może być tylko jeden; anulowany się nie liczy. Start dozwolony, gdy dni w miesiącu < N **albo dziś już jest dniem treningowym**. Miesiąc od północy 1. dnia (jak dziś). Usunięcie treningu z historii zwalnia dzień (**brzegowy**, kosztem własnych danych → bez naprawy); zmiana daty w telefonie (**teoretyczny**).

**Rachunek** (`limit-dni.mjs` + `limit-dni.json`: rozkład częstotliwości 1–5/tydz. [OCENA], retencja [OCENA], dni w miesiącu ~ dwumian, pierwszy miesiąc niepełny; p-stwo zakupu przy blokadzie dobrane tak, by N=4 dało 1,4 / 2,0 / 2,9 płacących na 100 pobrań — RevenueCat SOSA 2026 i W0; potem `porownanie.mjs`, kod 0):

| model | pes. USD/rok | norm. USD/rok | opt. USD/rok | aktywni, którzy w pełnym miesiącu trafią na limit |
|---|---|---|---|---|
| A0 obecny | 76 | 549 | 3385 | — |
| V2 blokada | 39 | 509 | 5766 | — |
| M4 odnawiane (S1) | 101 | **498** | 2578 | 90% |
| M5 odnawiane (S1) | 95 | **471** | 2431 | 86% |
| M6 odnawiane (S1) | 90 | **443** | 2280 | 82% |
| M4 bez odnawiania (S2) | 85 | 421 | 2251 | 90% |
| M5 bez odnawiania (S2) | 80 | 398 | 2123 | 86% |
| M6 bez odnawiania (S2) | 75 | 374 | 1991 | 82% |

Wrażliwość (normalny): M5 S1 — zakup przy blokadzie ×0,75/×1,25: 353–588; odnowienia: 399–753. **Wnioski:** (1) każdy dodatkowy darmowy dzień to ok. −6% wpływu — mało, bo przy założonym rozkładzie większość aktywnych trenuje częściej niż 6 dni w miesiącu; (2) **N = 5 ma prosty sens dla użytkownika: trening raz w tygodniu jest zawsze darmowy** (miesiąc ma najwyżej 5 tych samych dni tygodnia), przy N = 4 osoba trenująca raz w tygodniu trafia na limit w miesiącach z pięcioma takimi dniami; (3) M z S1 i A0 różnią się mniej niż rozrzut założeń — obie kalibracje stoją na tym samym ok. 2% płacących; (4) S2 daje ok. 15% mniej niż S1 przez brak automatycznych odnowień (to są także płatności, o których ludzie zapominają).

**Etyka:** brak próby zamieniającej się w opłatę (główne źródło skarg 1,26★); limit jawny od pierwszego ekranu i w opisie sklepu („darmowe do N dni treningowych w miesiącu”); licznik widoczny przed startem („Zostały 2 z 5 dni w tym miesiącu”), bez okien zakupu w trakcie pracy (P2 B: raz po pierwszym treningu — do ponownej decyzji); dane, historia, eksport, trening wstecz, edycja zawsze dostępne (`ALWAYS_AVAILABLE` bez zmian); skarga „niskie limity darmowej wersji” (docs/research/skargi-wnioski-2026-10.md, pkt 1) — ryzyko przy N = 4.

**Skutki dla 1.0 (M + S1):** `lib/access.ts` (`freeUsed` → dni ukończonych treningów + wyjątek „dziś”, `FREE_LIVE_PER_MONTH` → N, `ENABLED` → true), usunięcie oferty wprowadzającej (`TRIAL_DAYS`, przypomnienie o końcu próby, teksty ekranu zakupu), teksty „4 treningi” → „N dni treningowych” w 35 językach, testy licznika i regresji, Maestro `21-subskrypcja`, opisy App Store (blok subskrypcji, 33 lokalizacje), App Store Connect: usunąć oferty wprowadzające z dwóch subskrypcji (właściciel, ok. 10 min). Czas agenta ok. 3–5 h (praca równoległa: kod + tłumacz + M5), właściciela ok. 15 min + test w piaskownicy ok. 20 min. **Mieści się w terminie 29–31.10 z zapasem; to najmniejsza zmiana ze wszystkich badanych.** M + S2: jak V2 (rozdz. 7) bez blokady i bez próby — ok. 6–9 h agenta.

**Do decyzji przy M (gdy właściciel zechce):** N (4 / 5 / 6; rachunek: 498 / 471 / 443 USD przy S1); S1 czy S2; trening wstecz (a) bez limitu jak dziś — dane zawsze wolno wpisać, mała furtka dla osób z notatnikiem, (b) liczony do limitu; nagłówek ekranu ofert przy S1.

## 11. E3 — kontrakt płatności M5 S1 (decyzja właściciela 22.10.2026, docs/18)

Model wybrany: **M5 S1**. `docs/monetyzacja.md` (jedyne miejsce kwot i liczb, pilnowane testem `audit-m1-045`) zmienia się **w tym samym commicie co kod** — inaczej test zgodności dokumentu z kodem będzie czerwony.

### Produkty (bez zmian identyfikatorów)
| produkt | ID (`lib/products.ts`) | typ | cena USD / PLN / EUR / GBP | Family Sharing | oferta wprowadzająca |
|---|---|---|---|---|---|
| miesięczna „Still finding my rhythm” | `pl.lukasz.trening.full.monthly` | auto-renewable | 0,99 / 4,99 zł / 0,99 € / 0,99 £ | tak (bez zmian) | **usunąć** |
| roczna „Training is part of my week” | `pl.lukasz.trening.full.yearly` | auto-renewable | 6,99 / 19,99 zł / 7,99 € / 6,99 £ | tak | **usunąć** |
| dożywotnia „Training is my life” | `pl.lukasz.trening.full.lifetime` | Non-Consumable | 14,99 / 59,99 zł / 17,99 € / 14,99 £ | tak | — |

### Logika dostępu (zmiany w `lib/access.ts`)
- `PAYWALL.ENABLED = true`; `FREE_LIVE_PER_MONTH` → **`FREE_TRAINING_DAYS_PER_MONTH = 5`** (jedno miejsce).
- `freeUsed` → liczba **różnych dni** (data startu wg `tzOffsetMin` treningu) w bieżącym miesiącu z ukończonym treningiem na żywo (zakończony albo zapisany po 6 h; trwający i anulowany się nie liczą; trening wstecz i edycja nie są treningiem na żywo). P3 B bez zmian (po wygaśnięciu Pro liczą się dni od chwili wygaśnięcia).
- `canStartLive`: dozwolone, gdy `level = full` **albo** dni < 5 **albo dziś jest już dniem treningowym**. Reszta (`ALWAYS_AVAILABLE`, `GUARDED_STARTS`, karencja offline 7 dni, `unknown`/`testflight`) bez zmian.
- Wektory do testów (N = 5, miesiąc bieżący, `free`):

| scenariusz | ukończone treningi na żywo w miesiącu | dziś | oczekiwane |
|---|---|---|---|
| nowy użytkownik | brak | — | start dozwolony, „Zostało 5 z 5” |
| dwa treningi jednego dnia | 2 × dzień 3 | dzień 3 | dozwolony, zużyty 1 dzień |
| limit, dziś już trening | dni 1, 4, 8, 12, 15 (dziś = 15) | 15 | **dozwolony** (ten sam dzień) |
| limit, nowy dzień | dni 1, 4, 8, 12, 15 | 16 | **zablokowany**, odnowienie 1. dnia następnego miesiąca |
| trening przez północ | start 31.10 23:50, koniec 1.11 00:40 | 1.11 | liczy się do października; listopad 0 dni |
| trening wstecz | 6 treningów wstecz, 0 na żywo | — | dozwolony (wstecz się nie liczy) |
| anulowany | anulowany dziś, 4 dni wcześniej | nowy dzień | dozwolony (4 dni) |
| trwający | trwa trening (5. dzień jeszcze nieukończony) | — | start innego blokuje strażnik „trening w toku” (F7), nie limit |
| Pro aktywne / dożywotni | dowolne | — | dozwolony, bez licznika |
| Pro wygasło 10.10 | dni 2, 5, 8 (przed), 12, 14 (po) | 20 | dozwolony, zużyte 2 (P3 B) |

### Ekran zakupu i teksty (zmiany; projekt ekranu — rola 04 w systemie M3)
- Pokazuje się **tylko** przy starcie ponad limit i z Ustawień (usunąć `PAYWALL_MOMENTS.AFTER_FIRST_WORKOUT`); na ekranie startu licznik „Zostały {n} z 5 darmowych dni w tym miesiącu” (tylko w `free`).
- Nagłówek roboczy: „Train 5 days a month for free. Pro removes the limit. Cancel anytime in your Apple ID settings.” (do przeglądu właściciela przy tekstach), plany w kolejności roczna, miesięczna, dożywotnia (`PLAN_ORDER` bez zmian), nazwy z docs/18, opisy bez liczb i porównań.
- Usunąć: ofertę wprowadzającą i jej teksty („14 dni za darmo”, wnioskowanie M1-012/M1-017), przypomnienie o końcu próby (`lib/trialReminder.ts`, `TRIAL_END_REMINDER_DAYS`), `TRIAL_DAYS`.
- Ujawnienia bez zmian (3.1.2(a)): cena za okres jako najwyraźniejszy element, długość okresu, odnawianie i jak anulować, „Przywróć zakupy”, polityka prywatności i warunki (Apple EULA), „Zarządzaj subskrypcją”, „Zrealizuj kod”.
- Opis App Store (M5, 33 lokalizacje): „Darmowe do 5 dni treningowych w miesiącu; Pro bez limitu — subskrypcja miesięczna, roczna albo dostęp dożywotni”, bez „free trial”.

### Kroki właściciela w App Store Connect (po scaleniu kodu, przed testem w piaskownicy)
1. Subskrypcje → grupa „Pełna wersja” → miesięczna → Subscription Prices / Introductory Offers → usuń ofertę „2 weeks free” (ok. 3 min).
2. To samo dla rocznej (ok. 3 min).
3. Sprawdź kontrolą ASC (workflow „ASC kontrola ustawień”) — oczekiwane wartości w `store/asc-kontrola.json` zaktualizuje programista (brak oferty wprowadzającej).
4. Test w piaskownicy (lista „tylko telefon”): 5 dni → blokada → zakup miesięcznej → limit zdjęty → przywracanie (ok. 20 min).

### Ryzyka do „Rejestru ryzyk” (docs/40)
- R-M5-1: licznik dni z historii — usunięcie treningu zwalnia dzień (brzegowy, bez naprawy).
- R-M5-2: zmiana daty w telefonie (teoretyczny, bez naprawy).
- R-M5-3: produkty w ASC z ofertą wprowadzającą przy wydaniu 1.0 — warunek zamknięcia: kontrola ASC zielona bez ofert.
