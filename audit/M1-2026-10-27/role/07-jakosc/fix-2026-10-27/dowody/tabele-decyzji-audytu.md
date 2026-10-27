=== 01-odkrywanie/01-odkrywanie-2026-10-27.md:181
| Decyzja (data, miejsce) | Kod (plik:linia) | Test-strażnik | Wynik |
|---|---|---|---|
| M5 S1: bez próby, 5 dni, blokada tylko startu (22.10, `docs/18-przekazanie.md:441`) | `lib/access.ts:25`; `store/Trening.storekit` bez introductoryOffer | `tests/m5s1-bez-proby.test.ts`, `tests/access.test.ts` | zgodne |
| Ekran zakupu tylko ponad limitem i z Ustawień; licznik dni (22.10, `docs/18-przekazanie.md:442`) | `components/StartPanel.tsx:67`; `app/paywall.tsx:62` | `tests/subscription-ui.test.tsx` | zgodne (okno zasad 25.10 to osobna decyzja) |
| Nagłówek ekranu z Ustawień, nazwy planów (22.10, `docs/18-przekazanie.md:442`) | `app/paywall.tsx:66`; `app/paywall.tsx:24` | `tests/subscription-i18n.test.ts` | zgodne |
| Prośba o ocenę po 3. treningu (22.10, `docs/18-przekazanie.md:443`) | `lib/review.ts:14` | `tests/review.test.ts` | zgodne; brak BR → 004 |
| Tekst ponad limitem wariant B (22.10, `docs/18-przekazanie.md:444`) | `app/paywall.tsx:63` | `tests/subscription-i18n.test.ts` | zgodne |
| Dni zapisane osobno, wstecz nie zużywa, usunięcie nie zwraca, błąd sklepu = nieznany, expo-iap 5.8.1 (22.10, `docs/18-przekazanie.md:445`) | `lib/access.ts:192`; `lib/store-native.ts:2`; package.json | `tests/m5s1-dni-zapis.test.ts`, `tests/limity-wydan.json` | zgodne |
| Próg dnia 7 min (23.10, `docs/18-przekazanie.md:484`) | `lib/access.ts:31` | `tests/m5s1-dni-zapis.test.ts` | zgodne; w BRD bez ID decyzji → 011 |
| «Sklep chwilowo niedostępny» (23.10 DEC-05, `docs/18-przekazanie.md:464`) | `app/paywall.tsx:79` | `tests/m1-013-sklep-niedostepny-jezyki.test.ts` | zgodne |
| DEC-07 K9: najwyżej 1 stuknięcie do odhaczonej serii (23.10, `docs/18-przekazanie.md:470`) | tablica «teraz» | `tests/dec07-k9-stukniecia.test.tsx` | kod zgodny; brak w BRD → 006 |
| DEC-08 asekuracja przy hantlach (23.10, `docs/18-przekazanie.md:467`) | katalog | `tests/audit-m1-031-hantle-asekuracja.test.tsx` | zgodne |
| Kolejność planów: miesięczny pierwszy, domyślnie miesięczny (23.10, `docs/18-przekazanie.md:481`) | `lib/products.ts:19` (roczny pierwszy) | `tests/m5s1-bez-proby.test.ts:86` asertuje stan przeciwny | **niewdrożone**; zastąpione decyzją 27.10 → mechanizm 007 |
| Kolejność roczny, miesięczny, dożywotni; domyślnie roczny (27.10 ~17:00, polecenie M1) | `lib/products.ts:19`; `app/paywall.tsx:36` | `tests/m5s1-bez-proby.test.ts:86`; `tests/subscription-ui.test.tsx` (plan-yearly zaznaczony) | zgodne (nie znalezisko) |
| Domyślny motyw ciemny; eksport CSV z jednostkami (23.10, `docs/18-przekazanie.md:485`) | `lib/seed.ts:273`; `lib/backup.ts` | `tests/domyslny-motyw.test.ts`, `tests/csv-jednostka-eksportu.test.ts` | zgodne; eksport CSV bez BR → 004 |
| Tryb cichy wariant A (23.10, `docs/18-przekazanie.md:498`) | `app/more/settings.tsx:44` | `tests/tryb-cichy-wskazowka.test.tsx` | zgodne |
| Oznaczenia pewności poza interfejsem (23.10, `docs/18-przekazanie.md:487`) | `scripts/claims.mjs` (markerErrors) | `tests/zrodla-wiedzy.test.ts` | kod zgodny; BR-JEZ-004 sprzeczny → 006 |
| Okno «Uczciwe zasady», karta po imporcie, import CSV (25.10, `docs/18-przekazanie.md:515`, `docs/18-przekazanie.md:535`) | `lib/fairrules.ts:17`; `components/FairRulesSheet.tsx:20`; `components/ImportProCard.tsx:22` | `tests/monetyzacja-ui.test.tsx`, `tests/monetyzacja-csv.test.ts` | kod zgodny; brak BR → 004, 006 |
| Źródła nigdzie publicznie; ekran «Źródła wiedzy» usunięty (25.10, `docs/18-przekazanie.md:524`) | brak `app/more/sources.tsx`; `lib/sources.ts` | `tests/zrodla-wiedzy.test.ts`, check:bundle | kod zgodny; BR-ZRO-001 i ZP-09 sprzeczne → 006 |
| 1.0 bez nowych grafik (26.10, `docs/18-przekazanie.md:579`); recenzja ruchu przed wydaniem (27.10, CLAUDE.md) | `lib/figures/v2/families.ts:27` (3 rodziny «ready») | `tests/figury-1-0-recenzja.test.ts` | zgodne (treść figur — rola 06) |
| «Co nowego» puste w 1.0 (26.10, `docs/18-przekazanie.md:597`) | `lib/whatsnew.ts:18` | `tests/release-1.0.test.tsx` | zgodne |
| Technika domyślnie rozwinięta (27.10, `docs/18-przekazanie.md:600`) | `app/exercise/[id].tsx:41` | `tests/audit-k1-fala2b.test.tsx` | zgodne; BR-BIB-001 zaktualizowany |
| Głos domyślnie wyłączony (20.10 DEC-05, `docs/18-przekazanie.md:327`) | `lib/seed.ts:323`; `lib/voice.ts:27` (stare dane bez pola = W słuchawkach) | `tests/voice.test.ts` | zgodne z zapisaną interpretacją |
| System miar z regionu (20.10, `docs/18-przekazanie.md:333`) | `lib/units.ts` | `tests/audit-m1-lok07-02-default-system.test.ts` | kod zgodny; BR-JEZ-003 nieaktualny → 006 |
| Porzucony trening 2 h / 6 h (20.10 DEC-08, `docs/18-przekazanie.md:329`) | `lib/state/finish.ts:17` | `tests/audit-m1-044-brd.test.ts` (RD-03) | zgodne |
| Family Sharing, standardowa licencja Apple (14.10, `docs/18-przekazanie.md:203`) | `store/Trening.storekit`; `lib/products.ts:41` | `tests/prices-decision.test.ts`, `tests/store-adapter.test.ts` | zgodne |
| «Poproś o nową funkcję» + link co N treningów (14.10, `docs/18-przekazanie.md:290`) | `app/more/about.tsx:27`; `lib/review.ts:23` | `tests/idea-request.test.tsx` | zgodne; brak BR → 004 |
| «Napisz do nas» mailto (13.10, `docs/18-przekazanie.md:180`) | `app/more/about.tsx:26` | `tests/support-mail.test.tsx` | zgodne; brak BR → 004 |
| Dane Zdrowia tylko w pamięci, nie w kopii (11.10, `docs/18-przekazanie.md:60`) | `lib/healthRead.ts:8` | `tests/health-read.test.ts`, `tests/matrix-invariants.test.ts` | zgodne |
| Opis sklepu bez kwot, espresso (21.10, `docs/18-przekazanie.md:397`) | `store/app-store-metadata.json` | `tests/store-metadata.test.ts` | zgodne |
| Poczta na Workspace; usunąć Porkbun z polityki (21.10, `docs/18-przekazanie.md:400`) | `site/privacy.html:89` | brak | **niewdrożone** → 008 |
| Przypomnienie rano w dniu treningu (08.10, `docs/18-archiwum-do-11.10.md:130`) | `lib/planReminder.ts:13` | `tests/audit-0.10-live.test.tsx` | zgodne; brak BR → 004 |
| Historia, kopia, eksport zawsze (06.10, `docs/18-archiwum-do-11.10.md:70`) | `lib/access.ts:246` | `tests/access.test.ts` | zgodne |
=== 02-monetyzacja/02-monetyzacja-2026-10-27.md:129
| Decyzja (data, miejsce) | Kod (plik:linia) | Test-strażnik | Wynik |
|---|---|---|---|
| Model M5 S1: limit 5 dni treningowych, bez próby, Pro mies./rok/dożywotni (22.10, `docs/18-przekazanie.md:441`) | `lib/access.ts:25`, `lib/products.ts:13` | `tests/access.test.ts`, `tests/m5s1-bez-proby.test.ts` | zgodne |
| Ekran zakupu tylko ponad limit i w Ustawieniach + licznik na ekranie startu (22.10, `docs/18-przekazanie.md:442`) | `lib/entitlement.ts:112`, `components/StartPanel.tsx:67` | `tests/subscription-ui.test.tsx` | zgodne (rozszerzone decyzją 25.10) |
| Nagłówek ekranu z limitem (22.10 B) i nazwy planów (22.10 C) | `app/paywall.tsx:66`, `app/paywall.tsx:24` | `tests/subscription-ui.test.tsx`, `tests/subscription-i18n.test.ts` | zgodne |
| Tekst ekranu przy limicie, wariant B (22.10, `docs/18-przekazanie.md:444`) | `app/paywall.tsx:63` | `tests/subscription-i18n.test.ts` | zgodne |
| Dzień = trening na żywo > 20 min, potem 7 min (22.10 i 23.10, `docs/18-przekazanie.md:445`) | `lib/access.ts:31` | `tests/m5s1-dni-zapis.test.ts` | zgodne |
| Dopisanie i import nie zużywają dnia; usunięcie nie zwraca (22.10) | `lib/state/finish.ts:114` | `tests/m5s1-dni-zapis.test.ts`, `tests/monetyzacja-csv.test.ts` | zgodne |
| Limit tylko się luzuje; `expo-iap` przypięte 5.8.1 (22.10) | `package.json:43` | `tests/limity-wydan.json` przez `tests/m5s1-dni-zapis.test.ts`; `tests/store-adapter.test.ts` | zgodne |
| Prośba o ocenę po 3. treningu (22.10) | `lib/review.ts:14` | `tests/review.test.ts` | zgodne |
| P3 B, P6 A — 7 dni offline (12.10, docs/27) | `lib/access.ts:26`, `lib/access.ts:27` | `tests/access.test.ts`, `tests/entitlement.test.ts` | zgodne |
| P7 A karencja płatności | `lib/store-native.ts:77` | `tests/audit-m1-012-status.test.ts` | zgodne |
| P8 A kody ofertowe | `app/paywall.tsx:96` | `tests/subscription-ui.test.tsx` | zgodne |
| P9 A standardowa licencja Apple | `lib/products.ts:41` | `tests/legal-links.test.tsx` | zgodne |
| Family Sharing TAK (11.10 / 14.10) | `lib/store-native.ts:48` | `tests/store-adapter.test.ts` | zgodne |
| Jeden przełącznik `PAYWALL.ENABLED`, płatności od 1.0 (12.10, 14.10 D-1) | `lib/access.ts:24` | `tests/access.test.ts` | zgodne |
| DEC-07 K1 jedna nazwa „Pełna wersja” (23.10, `docs/18-przekazanie.md:470`) | `app/_layout.tsx:119` | `tests/subscription-ui.test.tsx` | zgodne |
| Okno „Uczciwe zasady”, karta po imporcie, link „indeks espresso” (25.10, `docs/18-przekazanie.md:515`) | `lib/fairrules.ts:17`, `lib/products.ts:33` | `tests/monetyzacja-ui.test.tsx`, `tests/check-urls.test.ts` | zgodne |
| Kolejność planów mies., rok, dożywotni; domyślnie miesięczny (23.10, `docs/18-przekazanie.md:481`) | `lib/products.ts:19` ma kolejność roczny pierwszy | `tests/subscription-ui.test.tsx` pilnuje kolejności przeciwnej | nie wdrożono; decyzja zastąpiona 27.10 (kod zostaje) — nie znalezisko; mechanizm → 02-monetyzacja-003 |
| Kolejność roczny, miesięczny, dożywotni; domyślnie roczny (27.10 ok. 17:00, polecenie M1; jeszcze nie w docs/18) | `lib/products.ts:19`, `app/paywall.tsx:36` | `tests/subscription-ui.test.tsx` (kolejność i zaznaczenie) | zgodne; brak wpisu w docs/18 → 02-monetyzacja-003 |
| Small Business Program przyjęty (26.10, `docs/18-przekazanie.md:591`) | `docs/monetyzacja.md:80` nadal "krok właściciela" | brak | rozjazd dokumentu → 02-monetyzacja-004 |
=== 02-monetyzacja-b/02-monetyzacja-2026-10-27.md:128
| Decyzja (data, miejsce) | Kod (plik:linia) | Test-strażnik | Wynik |
|---|---|---|---|
| 12.10 jeden przełącznik płatności (`docs/18-przekazanie.md:169`) | `lib/access.ts:24` | tests/m5s1-dni-treningowe.test.ts (ENABLED w źródle) | zgodne |
| 12.10 expo-iap; 22.10 wersja przypięta 5.8.1 (`docs/18-przekazanie.md:445`) | package.json (5.8.1) | `tests/m5s1-dni-zapis.test.ts:173` | zgodne |
| 12.10 P3 B (`docs/18-przekazanie.md:176`) | `lib/access.ts:26`, `lib/access.ts:135-143` | tests/m5s1-dni-treningowe.test.ts (10b), `tests/entitlement.test.ts:121` — oba z wygasłym wpisem na liście | **niezgodne w produkcji** → 501, 507 |
| 12.10 P6 A offline 7 dni | `lib/access.ts:27`, `lib/access.ts:103` | tests/entitlement.test.ts | zgodne |
| 12.10 Family Sharing TAK | `lib/store-native.ts:48`, `app/paywall.tsx:70` | tests/subscription-ui.test.tsx (rodzina), tests/asc-kontrola.test.ts | zgodne w kodzie; ASC nie sprawdzono; docs/27 3.9 (Ustawienia) częściowo → 504 |
| 12.10 P7 A karencja (ASC) | `lib/store-native.ts:69-83` | tests/audit-m1-012-status.test.ts | kod zgodny; ustawienie ASC nie sprawdzono |
| 12.10 P8 A kody | `app/paywall.tsx:96` | tests/subscription-ui.test.tsx | zgodne |
| 12.10 P9 A standardowa licencja | `lib/products.ts:41` | tests/store-adapter.test.ts | zgodne |
| 12.10 spec docs/27 przyjęta "zgodnie z rekomendacją" (`docs/18-przekazanie.md:177`): ostrzeżenie przed dożywotnim przy subskrypcji (`docs/27-subskrypcja-spec.md:183`) | `app/paywall.tsx:72` (tylko po zakupie) | brak | **bez wdrożenia** → 503 |
| j.w.: zarządzanie przez systemowy arkusz (`docs/27-subskrypcja-spec.md:165`) | `lib/store-native.ts:126` (URL) | brak | **niezgodne** → 505 |
| 13.10 Ukraina: niższy punkt cenowy (`docs/18-przekazanie.md:179`) | ASC (poza kodem); `store/asc-kontrola.json:10` nie obejmuje UKR | brak | **bez wdrożenia/zamknięcia** → 506 |
| 14.10 D-1 płatności od 1.0 (`docs/18-przekazanie.md:270`) | `lib/access.ts:24` | tests/m5s1-dni-treningowe.test.ts | zgodne |
| 20–21.10 ceny 0,99/6,99/14,99 USD, PL 4,99/19,99/59,99, EUR 0,99/7,99/17,99 | `store/asc-kontrola.json:20-24` (kontrola), kod bez kwot | tests/asc-kontrola.test.ts, tests/prices-decision.test.ts | zgodne po stronie repo; ASC według docs (przebieg 39822823188, nie odtwarzano) |
| 21.10 opis bez kwot + espresso z przypisem (`docs/18-przekazanie.md:397`) | store/app-store-metadata.json | tests/audit-m1-045-store-description.test.ts | tekst zgodny; kraje niesprawdzone → 506 |
| 22.10 M5 S1: 5 dni, bez próby, wstecz poza limitem (`docs/18-przekazanie.md:441`) | `lib/access.ts:25`, `lib/state/finish.ts:91` | tests/m5s1-*.test.ts | zgodne |
| 22.10 (A) ekran zakupu tylko przy limicie i w Ustawieniach; 25.10 okno + karta (`docs/18-przekazanie.md:515`) | `lib/entitlement.ts:112`, `components/SubscriptionCard.tsx:16`, `components/FairRulesSheet.tsx:20`, `components/ImportProCard.tsx:22` | tests/entitlement.test.ts, tests/monetyzacja-ui.test.tsx, .maestro/56 | zgodne |
| 22.10 (B) nagłówek ekranu ofert (`docs/18-przekazanie.md:442`) | `app/paywall.tsx:66` | tests/subscription-ui.test.tsx | zgodne; pokazywany także płacącym (decyzja tego nie rozstrzyga) → 504 |
| 22.10 (C) nazwy planów | `app/paywall.tsx:24` | `tests/m5s1-bez-proby.test.ts:83` | zgodne |
| 22.10 prośba o ocenę po 3. treningu (`docs/18-przekazanie.md:443`) | `lib/review.ts:14` | tests (review) | zgodne |
| 22.10 tekst limitu wariant B (`docs/18-przekazanie.md:444`) | `app/paywall.tsx:62-65` | tests/subscription-ui.test.tsx | zgodne |
| 22.10 (2)(3)(4)(5) dopisanie nie zużywa, usunięcie nie zwraca, "limit tylko się luzuje", licznik bez zdania (`docs/18-przekazanie.md:445`) | `lib/state/finish.ts:90-93`, `components/StartPanel.tsx:67` | tests/m5s1-dni-zapis.test.ts, tests/limity-wydan.json (tylko dni i ALWAYS_AVAILABLE) | zgodne; strażnik "luzowania" bez progu minut i P3 → 507 |
| 23.10 próg 7 min (`docs/18-przekazanie.md:484`) | `lib/access.ts:31` | tests/m5s1-dni-zapis.test.ts | zgodne |
| 23.10 DEC-07 K1 nazwa "Pełna wersja" (`docs/18-przekazanie.md:470`) | `app/_layout.tsx:119` | tests/subscription-ui.test.tsx | zgodne |
| 23.10 kolejność mies./rok/dożyw., domyślnie mies. (`docs/18-przekazanie.md:481`) | `lib/products.ts:19`, `app/paywall.tsx:36` (roczny) | `tests/m5s1-bez-proby.test.ts:86` pilnował **starego** stanu | nigdy niewdrożona; zastąpiona 27.10 (nie znalezisko) → mechanizm 507 |
| 27.10 kolejność zostaje jak w kodzie (polecenie M1) | `lib/products.ts:19`, `app/paywall.tsx:36` | `tests/m5s1-bez-proby.test.ts:86`, `tests/store-adapter.test.ts:34` | zgodne (zapis w docs/18 jeszcze brak — commit sprzed decyzji) |
| 25.10 okno, karta, link espresso (`docs/18-przekazanie.md:535`) | `lib/fairrules.ts:11-14`, `lib/products.ts:33` | tests/monetyzacja-ui.test.tsx | zgodne |
=== 03-zakres/03-zakres-2026-10-27.md:155
| Decyzja (data, miejsce) | Kod (plik:linia) | Test-strażnik | Wynik |
|---|---|---|---|
| Granica: dieta, sen, suplementy, trener–podopieczny poza zakresem (DEC-03, `docs/18-przekazanie.md:329`) | `lib/seed.ts:20` (tylko moduł training) | `tests/audit-m1-044-brd.test.ts` (granica w BRD) | zgodne |
| Funkcje bez dowodu wartości zostają (DEC-04, `docs/18-przekazanie.md:329`) | generator, odczyt Zdrowia, kilka planów, Dostosuj — obecne | `tests/audit-m1-044-brd.test.ts` | zgodne |
| Bez kontraktu zakresu (DEC-02, `docs/18-przekazanie.md:329`) | brak `docs/scope-contract.md` | — | zgodne; skutek: 03-zakres-002 |
| Pasek talerzy i kalkulator usunięte (DEC-06, `docs/18-przekazanie.md:322`) | `lib/discColors.ts:6`, `lib/equipvis.ts:18` | `tests/tuleja.test.tsx` (test braku) | zgodne; brak warunku powrotu → 03-zakres-007 |
| Naklejki/QR NIE, Siri NIE, trening we dwoje po premierze (`docs/18-przekazanie.md:196`) | brak w kodzie | brak strażnika | zgodne |
| Garmin po App Store, bez Bluetooth (`docs/18-przekazanie.md:201`) | `app.json` bez uprawnienia Bluetooth | `verify:native` (lista uprawnień) | zgodne |
| 1.0 = zawartość 0.20 + poprawki, pusta historia „Co nowego” (`docs/18-przekazanie.md:258`, `docs/18-przekazanie.md:597`) | `lib/whatsnew.ts:18` | `tests/release-1.0.test.tsx` | zgodne |
| Poproś o nową funkcję: przycisk + link co N-ty trening (`docs/18-przekazanie.md:290`) | `app/more/about.tsx:27`, `lib/review.ts:25` | `tests/idea-request.test.tsx` | zgodne |
| Kroki ze Zdrowia zostają (`docs/18-przekazanie.md:299`) | odczyt Zdrowia w planie | `tests/health-permissions.test.ts` | zgodne |
| Głos domyślnie wyłączony (DEC-05, `docs/18-przekazanie.md:327`) | `lib/seed.ts:323` | `tests/audit-m1-027-voice-default.test.ts` | zgodne |
| Zakres 1.0 zamrożony, M4 po 1.0 (`docs/18-przekazanie.md:360`) | wyjątki nazwane: DEC-03 c, grafiki (cofnięte 26.10), Technika 27.10 | — | zgodne (wyjątki zapisane) |
| Masa ciała tylko w Postępach (ZM-06, `docs/18-przekazanie.md:423`) | `app/(tabs)/progress.tsx:96` | `tests/m3-p3-postepy-historia.test.tsx` | zgodne |
| M5 S1: 5 dni, bez próby, ekran zakupu tylko przy limicie i w Ustawieniach (`docs/18-przekazanie.md:441`, `docs/18-przekazanie.md:442`) | `lib/access.ts:25`, `lib/entitlement.ts:108` | `tests/m5s1-bez-proby.test.ts`, `tests/access.test.ts` | zgodne |
| Prośba o ocenę po 3. treningu (`docs/18-przekazanie.md:443`) | `lib/review.ts:14` | `tests/review.test.ts` | zgodne |
| Próg dnia treningowego 7 min (`docs/18-przekazanie.md:484`) | `lib/access.ts:31` | `tests/m5s1-dni-zapis.test.ts` | zgodne |
| Przełącznik trybu generatora przywrócony (DEC-03 c, `docs/18-przekazanie.md:462`) | `app/generator.tsx:41` | `tests/m1-dec03-przelacznik.test.tsx` | zgodne |
| Krok importu w Pierwszych krokach → 1.0.1 (DEC-04 a, `docs/18-przekazanie.md:463`) | brak kroku (komentarz nieaktualny: `components/Dashboard.tsx:87`) | — | zgodne (odłożone) |
| K1: jedna nazwa "Pełna wersja" (`docs/18-przekazanie.md:470`) | tytuł `app/_layout.tsx:119`; „Pro” w `app/paywall.tsx:66`, `components/FairRulesSheet.tsx:34`, `components/ImportProCard.tsx:22` | brak | **niezgodne częściowo** → 03-zakres-002 |
| K3: „Planowanie” w linii tytułu także na ekranie Trening (`docs/18-przekazanie.md:470`) | Plan: w linii (`app/(tabs)/history.tsx:39`); Trening: nad tytułem (`app/(tabs)/index.tsx:44`) | brak | **niewdrożone** → 03-zakres-002 |
| K9: ≤ 1 stuknięcie do odhaczonej serii (`docs/18-przekazanie.md:470`) | stan wyjściowy | `tests/dec07-k9-stukniecia.test.tsx` | zgodne |
| Kolejność planów miesięczny–roczny–dożywotni, domyślnie miesięczny (`docs/18-przekazanie.md:481`) | `lib/products.ts:19`, `app/paywall.tsx:36` (roczny, domyślnie roczny) | test pilnował odwrotnej (`tests/m5s1-bez-proby.test.ts`) | nigdy niewdrożone; **zastąpione decyzją 27.10 ~17:00** (kod zostaje — nie znalezisko); brak wpisu w docs/18 → 03-zakres-002 |
| Dźwięk w trybie cichym — wariant A, wskazówka (`docs/18-przekazanie.md:498`) | `app/more/settings.tsx:44` | `tests/tryb-cichy-wskazowka.test.tsx` | zgodne |
| Monetyzacja 1.0: okno „Uczciwe zasady”, import CSV, karta (`docs/18-przekazanie.md:515`) | `app/history/[id].tsx:51`, `app/more/backup.tsx:27` | `tests/monetyzacja-ui.test.tsx` | zgodne w kodzie; BRD bez wpisu → 03-zakres-003 |
| Funkcje z makiety figur (metronom, tempo głosem, czytanie wskazówek) po 1.0 (`docs/18-przekazanie.md:520`) | brak w kodzie | brak strażnika | zgodne |
| Kalistenika osobną aplikacją (`docs/18-przekazanie.md:522`, `docs/18-przekazanie.md:592`) | nic w kodzie Treningu (odnośnik "Inne aplikacje studia" osobnym wydaniem) | — | zgodne |
| Ekran „Źródła wiedzy” usunięty, „całkiem anonimowo” (`docs/18-przekazanie.md:524`) | ekranu brak | `tests/zrodla-wiedzy.test.ts` | zgodne w kodzie; BRD nieaktualny → 03-zakres-004 |
| 1.0 bez nowych grafik (C, `docs/18-przekazanie.md:579`) | 3 rodziny `ready`, 40 `planned` | `tests/figury-1-0-recenzja.test.ts` | zgodne |
| Poprawka figur i reguła bramki 4 (`docs/18-przekazanie.md:599`, CLAUDE.md) | brak pola recenzji przy rodzinie; figury v1 wyświetlane (`components/ExerciseCues.tsx:44`) | brak strażnika `ready ⇒ recenzja` | **niewdrożone** → 03-zakres-001 |
| Technika rozwinięta w karcie (`docs/18-przekazanie.md:600`) | `app/exercise/[id].tsx:41` | `tests/audit-k1-fala2b.test.tsx` | zgodne |
| Kolejność planów zostaje jak w kodzie (27.10 ~17:00, polecenie M1) | `lib/products.ts:19` | `tests/m5s1-bez-proby.test.ts` | zgodne; zapis w docs/18 brak → 03-zakres-002 |
=== 04-studio-projektowe/04-studio-projektowe-2026-10-27.md:106
| Decyzja (data, miejsce) | Kod | Test-strażnik | Wynik |
|---|---|---|---|
| 07.10 usuwanie: przesunięcie + potwierdzenie wszędzie (archiwum) → 19.10 DEC-12 menu → 21.10 ZM-04/W2 „Usuń {obiekt}” | `components/SwipeRow.tsx`, `components/DeleteButton.tsx` | `tests/swipe-delete.test.tsx` | zgodne (zielony) |
| 09.10 intro ok. 1 s, stuknięcie pomija, „Ogranicz ruch” bez animacji (archiwum) | `components/Intro.tsx:39` | `tests/intro.test.tsx` | zgodne |
| 09.10 filiżanka dnia odpoczynku → 22.10 znaczniki dni A2 (docs/18) | `components/Motif.tsx:29` | `tests/motyw.test.tsx` | zgodne (zrzut `zrzuty/ark-390-dark.png`) |
| 11.10 4 zakładki (docs/18) | `app/(tabs)/_layout.tsx` | `tests/tabs-four.test.tsx` | zgodne |
| 11.10 P4 „Pierwsze kroki” 3 kroki, każdy z jednym przyciskiem | `components/Dashboard.tsx:98` | `tests/m3-p2-start.test.tsx` (częściowo) | zgodne z literą; etykiety mylą → 007 |
| 13.10 docs/32 decyzje 1–5 (Anuluj po lewej, Anuluj w potwierdzeniach, „+”, szkic, „Wróć”) | `components/CloseButton.tsx`, `lib/confirm.ts`, `components/AddButton.tsx` | S1–S5 (`tests/close-button-guard.test.tsx`, `tests/interaction-guards.test.ts`) | zgodne (zielone) |
| 14.10 nazwa „Strażnik progresji” widoczna | `components/GuardSection.tsx` | `tests/guard-ui.test.tsx` | zgodne |
| 19.10 / DEC-06 pasek talerzy i kalkulator usunięte | brak `PlateBar` w app/ components/ lib/ | `dowody/decyzje-kod.txt` (0 plików) | zgodne |
| 20.10 DEC-05 głos domyślnie wyłączony (nowa instalacja) | `lib/seed.ts:323` | `tests/` (M1-027, test ustawień domyślnych) | zgodne |
| 20.10 DEC-09 Postępy: wykres i rekordy na górze | `app/(tabs)/progress.tsx:80` | `tests/m3-p3*.test.tsx` | zgodne (zrzut) |
| 20.10 DEC-10 opisy do 200%, liczby do 130%; 23.10 DEC-01 a: kalendarz 130% przed 1.0, podgląd po przytrzymaniu 1.0.1 | `lib/theme.ts:71`, `components/HistoryCalendar.tsx` | `tests/matrix-a11y.test.tsx` | limity zgodne; podgląd 1.0.1 **nie ma w backlogu docs/21** → 003 |
| 20.10 DEC-11 własne ikony zamiast emoji | `components/Icon.tsx` | `dowody/sp11-emoji.txt` (emoji tylko w komentarzach) | zgodne |
| 20.10 DEC-17 wersaliki i „·” | `components/ui.tsx` `upperText()` | `tests/audit-m1-063-caps-separators.test.ts` | wersaliki zgodne; przegląd „·” otwarty → 011 |
| 20.10 DEC-18 ekran Język „Zmień w ustawieniach iOS” | `app/more/language.tsx:21` | testy ekranu języka | zgodne |
| 21.10 M3 system E3 (palety, Barlow, HC, tło startu = bg) | `lib/tokens.ts`, `lib/theme.ts`, `app.json` | `tests/m3-contrast.test.ts`, `tests/audit-m1-031-contrast.test.tsx` | zgodne; migracja literałów niedokończona → 008 |
| 21.10 ZM-01/ZM-05 tablica, „Seria zrobiona” bez wartości → pole, „Zakończ serię” | `components/NowBoard.tsx` | `tests/m3-p2-board-ui.test.tsx` | zgodne |
| 21.10 ZM-02 zgoda na powiadomienia przy pierwszej przerwie | `components/ActiveWorkout.tsx:291` | testy M3 p2 | zgodne |
| 21.10 ZM-07 dwa przełączniki dźwięk/wibracje; 23.10 wariant A wskazówka trybu cichego | `app/more/settings.tsx:44` | testy p5d, `tests/dzwiek-telefon-1030.test.ts` | zgodne |
| 21.10 W1 c „Planowanie” w tym samym miejscu co w zakładce Plan; 23.10 DEC-07 K3 w linii tytułu także na Trening | `app/(tabs)/index.tsx:44` vs `app/(tabs)/history.tsx:39` | `tests/m3-p2-start.test.tsx:31` pilnuje stanu **sprzed** K3 | **niewdrożone** → 005, 003 |
| 22.10 sztanga po tytule, `TabHeader`, wskaźnik przewijania ukryty | `components/Motif.tsx`, `components/Scroll.tsx:10` | `tests/trening-naglowek.test.tsx`, S18 | zgodne |
| 22.10 M5 S1 (A) zakup tylko przy limicie i w Ustawieniach, licznik dni na starcie; (B) nagłówek o limicie; (C) nazwy planów; tekst przy limicie wariant B | `components/StartPanel.tsx`, `app/paywall.tsx:66` | `tests/subscription-ui.test.tsx`, `tests/m5s1-bez-proby.test.ts` | zgodne dla stanu darmowego; stan po zakupie nieprzewidziany → 001 |
| 23.10 kolejność planów miesięczny / roczny / dożywotni, domyślnie miesięczny | `lib/products.ts:19` (roczny pierwszy) | `tests/m5s1-bez-proby.test.ts:86` pilnuje roczny pierwszy | niewdrożone przez 4 dni; **zastąpione decyzją 27.10 ok. 17:00** (kod zgodny z nią) — samo w sobie nie znalezisko; mechanizm → 003 |
| 23.10 domyślny motyw ciemny nowej instalacji | `lib/seed.ts:273` | testy ustawień domyślnych | zgodne |
| 23.10 DEC-03 c przywrócony przełącznik trybu generatora | `app/generator.tsx:41` | testy generatora | zgodne |
| 23.10 DEC-05 a „Sklep chwilowo niedostępny” | `app/paywall.tsx:79` (`paywall-empty`) | `tests/subscription-ui.test.tsx` | zgodne |
| 23.10 DEC-07 K1 jedna nazwa „Pełna wersja” | `app/_layout.tsx` (tytuł okna), `components/SubscriptionCard.tsx:16` | testy ekranu zakupu | zgodne; ta sama nazwa jako tytuł wiersza w Ustawieniach myli → 006 |
| 23.10 DEC-07 K9 ≤ 1 stuknięcie do odhaczonej serii | `components/NowBoard.tsx` | `tests/dec07-k9-stukniecia.test.tsx` | zgodne |
| 25.10 okno „Uczciwe zasady” z „Anuluj” w nagłówku | `components/FairRulesSheet.tsx` | S1 (`tests/close-button-guard.test.tsx`) | zgodne |
| 26.10 pusta historia „Co nowego” — bez przycisku ✦ | `lib/whatsnew.ts:18` | `tests/release-1.0.test.tsx` | zgodne |
| 27.10 „Technika” rozwinięta w karcie, zwinięta w podglądzie z treningu (`?cues=0`) | `components/ExerciseCues.tsx:80` (wejście z treningu daje `?cues=1`) | `tests/cues.test.tsx` | zgodne z zapisem (docs/18 sam notuje brak wejścia `?cues=0`) |
| 27.10 ok. 17:00 kolejność planów roczny / miesięczny / dożywotni, domyślnie roczny | `lib/products.ts:19`, `app/paywall.tsx:36` | `tests/m5s1-bez-proby.test.ts:86` | zgodne |
=== 07-jakosc/07-jakosc-2026-10-27.md:97
| Decyzja (data, miejsce) | Kod (plik:linia) | Test-strażnik | Wynik |
|---|---|---|---|
| 06.10 — `tests.yml` z pełnym verify na każdej gałęzi; E2E samo na main i integration (`docs/18-archiwum-do-11.10.md:62`) | `.github/workflows/tests.yml:25`; `.github/workflows/e2e-ios.yml:19` | `tests/public-repo.test.ts` | zgodne |
| 06.10 — macierz testów blokuje verify (CLAUDE.md) | `package.json:24` | `tests/hak-pre-push.test.ts`, kontrola zielona | zgodne |
| 13–14.10 — katalog przepływów: scenariusz albo wyjątek (CLAUDE.md) | `tests/przeplywy.json` (157 przepływów, 132 ze scenariuszem, 25 wyjątków z powodem) | `tests/przeplywy.test.ts` | zgodne |
| 18.10 (1) — szybki przebieg wybranych scenariuszy (`docs/18-przekazanie.md:284`) | `.github/workflows/e2e-ios.yml:38` | `tests/e2e-pakiet.test.ts` | zgodne |
| 18.10 (2) — stałe identyfikatory i test blokujący nowe stuknięcia po tekście (`docs/18-przekazanie.md:284`) | brak strażnika; 901 stuknięć po tekście, 125 po id | brak | **niewdrożone** (07-jakosc-007) |
| 19.10 — pakiet podstawowy blokuje TestFlight (`docs/18-przekazanie.md:286`) | `.github/workflows/testflight.yml:63`, `scripts/ci/e2e-podstawowy.json` | `tests/e2e-pakiet.test.ts`, `tests/audit-m1-workflows.test.ts` | zgodne; dowód R-009 |
| 21.10 — bramka App Store: pełny katalog na standardowym iPhonie, jedno ponowienie (`docs/18-przekazanie.md:361`) | krok ręczny docs/48 Z-06; opis wejścia `tryb_scisly` nadal mówi o braku ponowień | brak (krok ręczny) | zgodne co do mechanizmu; dokumenty sprzeczne (07-jakosc-008) |
| 21.10 — zgłoszenie `nocne-testy` (`docs/18-przekazanie.md:352`) | `.github/workflows/nightly.yml:132` | `tests/nocny-raport.test.ts` | zgodne |
| 21.10 — `paths-ignore` dla dokumentów i testów (`docs/18-przekazanie.md:354`) | `.github/workflows/e2e-ios.yml:19` | `tests/audit-m1-workflows.test.ts` | zgodne |
| 21.10 — TestFlight tylko ręcznie (`docs/18-przekazanie.md:355`) | `.github/workflows/testflight.yml:19` | `tests/audit-m1-workflows.test.ts` | zgodne |
| 21.10 — hak pre-push (`docs/18-przekazanie.md:376`) | `scripts/hooks/pre-push:47` | `tests/hak-pre-push.test.ts` | zgodne |
| 21.10 — verify:docs (`docs/18-przekazanie.md:377`) | `scripts/verify-docs.mjs` | `tests/verify-docs.test.ts` | zgodne |
| 21.10 — verify zaczyna od sprawdzenia haka (`docs/18-przekazanie.md:396`) | `package.json:24` | `tests/hak-pre-push.test.ts` | zgodne |
| 22.10 — walidacja Apple przy `bez_wysylki` (`docs/18-przekazanie.md:408`) | `.github/workflows/testflight.yml:219` | `tests/walidacja-apple-bez-wysylki.test.ts` | zgodne; przebiegi dowodowe 39761285067 i 39761281617 |
| 23.10 — kolejność planów miesięczny-pierwszy, domyślnie miesięczny (`docs/18-przekazanie.md:481`) | `lib/products.ts:19` (roczny pierwszy) | `tests/m5s1-bez-proby.test.ts:86` przypinał kolejność przeciwną | **niewdrożone**, zastąpione 27.10 (07-jakosc-005) |
| 25.10 — tests-tz z chwilą zmiany czasu, mutacje po modułach (`docs/18-przekazanie.md:501`) | `.github/workflows/tests-tz.yml:54`, `.github/workflows/nightly.yml:68` | `tests/nocne-workflowy.test.ts`, `tests/pin-now.test.ts` | zgodne; noc 27.10 zielona |
| 25.10 — wyjątek anonimizacji pusty przed wydaniem, kontrola w kroku wydania (`docs/40-lekcje.md:32`) | `scripts/ci/blokada-wydania.mjs:5` — brak kroku w workflowach i na liście wydawcy | `tests/blokada-wydania.test.ts` (nie sprawdza podpięcia) | **niewdrożone** (07-jakosc-001) |
| 27.10 — kolejność roczny, miesięczny, dożywotni, domyślnie roczny (polecenie M1) | `lib/products.ts:19`, `app/paywall.tsx:36` | `tests/m5s1-bez-proby.test.ts:86`, `tests/store-adapter.test.ts:34`, `tests/subscription-ui.test.tsx:44` | zgodne (strażnik istniał przed decyzją); zapis decyzji tylko poza SHA |
| 27.10 — bramka 4: rodzina bez recenzji ruchu nie jest wyświetlana (CLAUDE.md) | `lib/figures/v2/families.ts:27` (status `ready` bez pola recenzji) | brak (L-042 akcja 3 otwarta, `docs/40-lekcje.md:43`) | **bez wymuszenia** (07-jakosc-006) |
| CLAUDE.md, model po L-001 pkt 2 — otwarte ryzyko blokuje wydanie | jedyny automat: R-015 (niepodpięty) | brak | **bez mechanizmu** (07-jakosc-002) |
=== 08-programista/08-programista-2026-10-27.md:62
| Decyzja (data, miejsce) | Kod | Test-strażnik | Wynik |
|---|---|---|---|
| M5 S1: limit 5 dni treningowych, blokada tylko startu ponad limit (22.10, `docs/18-przekazanie.md:441`) | `lib/access.ts:25`, `lib/access.ts:239` | `tests/access.test.ts`, `tests/m5s1-dni-treningowe.test.ts` | zgodne |
| (A) ekran zakupu tylko przy starcie ponad limit i z Ustawień (22.10, `docs/18-przekazanie.md:442`) | `lib/entitlement.ts:108`, `components/SubscriptionCard.tsx:16` | `tests/subscription-ui.test.tsx` | zgodne |
| (B) nagłówek ekranu z Ustawień (22.10, `docs/18-przekazanie.md:442`) | `app/paywall.tsx:66` | `tests/subscription-ui.test.tsx` | zgodne; pokazywany też posiadaczowi Pro → 002 |
| (C) nazwy planów (22.10, `docs/18-przekazanie.md:442`) | `app/paywall.tsx:24` | `tests/subscription-i18n.test.ts` | zgodne |
| Prośba o ocenę po 3. treningu (22.10, `docs/18-przekazanie.md:443`) | `lib/review.ts:14` | `tests/review.test.ts` | zgodne |
| Tekst przy starcie ponad limit, wariant B (22.10, `docs/18-przekazanie.md:444`) | `app/paywall.tsx:63` | `tests/subscription-i18n.test.ts` | zgodne |
| Trening wstecz i import nie zużywają dnia; dni zapisane osobno; migracja z historii; `expo-iap` przypięty 5.8.1; błąd sklepu = „nieznany” (22.10, `docs/18-przekazanie.md:445`) | `lib/state/finish.ts:91`, `lib/state/finish.ts:114`, `lib/state/migrate-live.ts:16`, `package.json:43`, `lib/entitlement.ts:63` | `tests/m5s1-dni-zapis.test.ts:173`, `tests/limity-wydan.json`, `tests/monetyzacja-csv.test.ts` | zgodne |
| Próg dnia 7 minut (23.10, `docs/18-przekazanie.md:484`) | `lib/access.ts:31` | `tests/m5s1-dni-zapis.test.ts:23` | zgodne |
| Kolejność planów miesięczny–roczny–dożywotni, domyślnie miesięczny (23.10, `docs/18-przekazanie.md:481`) | `lib/products.ts:19`, `app/paywall.tsx:36` (stara kolejność) | `tests/m5s1-bez-proby.test.ts:86` pilnuje STAREJ kolejności | niewdrożona; 27.10 ok. 17:00 zastąpiona decyzją, że kolejność zostaje jak w kodzie, więc nie jest znaleziskiem. Luka mechanizmu → 003 |
| Pozostałe pozycje gałęzi `naprawa-m1-dec07-ui`, m.in. „sprawdzenie Zarządzaj subskrypcją w TestFlight” (23.10, `docs/przekazanie-koordynatora-2026-10-23.md:48`) | scalono tylko K9 (`dowody/decyzja-kolejnosc-planow.txt`) | brak | niewykonane → 001, 003 |
| K1 jedna nazwa Pełna wersja (23.10, `docs/18-przekazanie.md:470`) | `app/_layout.tsx:119` | `tests/subscription-ui.test.tsx` (tytuł Full version) | zgodne |
| K9 ≤ 1 stuknięcie do odhaczonej serii (23.10, `docs/18-przekazanie.md:470`) | stan wyjściowy | `tests/dec07-k9-stukniecia.test.tsx` | zgodne |
| Domyślny motyw ciemny dla nowej instalacji (23.10, `docs/18-przekazanie.md:485`) | `lib/seed.ts:273` | `tests/domyslny-motyw.test.ts` | zgodne |
| DEC-05 zapowiedzi głosowe domyślnie wyłączone (20.10, `docs/18-przekazanie.md:327`) | `lib/seed.ts:323` | `tests/audit-m1-027-voice-default.test.ts` | zgodne |
| System miar nowej instalacji z regionu (20.10, `docs/18-przekazanie.md:333`) | `lib/state/boot.ts:135` | `tests/audit-m1-lok07-02-default-system.test.ts` | zgodne |
| ZM-07 pole `haptics` bez zmiany schematu (21.10, `docs/18-przekazanie.md:422`) | `lib/haptics.ts:15` | `tests/m3-p5d-haptics-done.test.tsx`, `tests/fixtures/p5d-zapis-starej-wersji.json` | zgodne |
| Manifest prywatności w `app.json` (21.10, `docs/18-przekazanie.md:395`) | `app.json:66` | `tests/privacy-manifest.test.ts` | zgodne w źródle; gotowy pakiet sprawdza tylko CI (nie sprawdzono tu) |
| Ikona zegarka przez pole `icon:` (22.10, `docs/18-przekazanie.md:429`) | `targets/watch-app/expo-target.config.js:8` | `tests/watch-availability.test.ts` | zgodne w źródle; walidacja Apple tylko w CI |
| Dopisek „plan zmieniony w …” w pasku tygodnia (22.10, `docs/18-przekazanie.md:437`) | `lib/plan.ts:62` | `tests/postep-tygodnia-zmiana-planu.test.tsx` | zgodne |
| Tryb cichy: wskazówka przy dźwięku (23.10, `docs/18-przekazanie.md:498`) | `app/more/settings.tsx:44` | `tests/tryb-cichy-wskazowka.test.tsx` | zgodne |
| Okno „Uczciwe zasady” raz, tylko `free` (25.10, `docs/18-przekazanie.md:515`, `docs/18-przekazanie.md:534`) | `lib/fairrules.ts:18` | `tests/monetyzacja-ui.test.tsx` | zgodne |
| Sekcja „Technika” domyślnie rozwinięta, zwinięta przy `?cues=0` (27.10, `docs/18-przekazanie.md:600`) | `app/exercise/[id].tsx:41` | `tests/audit-k1-fala2b.test.tsx` | zgodne; przypadek zwiniętej sekcji w treningu nie ma dziś drogi wejścia (zapisane w samej decyzji) |
| P3 B, P6 A, P7 A (12.10, docs/27; komentarze `lib/access.ts:16`) | `lib/access.ts:26`, `lib/access.ts:27` | `tests/access.test.ts`, `tests/audit-m1-012-status.test.ts` | zgodne |
