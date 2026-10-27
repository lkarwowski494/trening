# Weryfikacja przeciwna G5 — 2026-10-27

Commit: 025a50b9

Zakres: P2 w obszarach pieniądze i prywatność. Są cztery mechanizmy: (a) porównanie z espresso i decyzja o Ukrainie, (b) dwa okna naraz po imporcie, (c) odbiorcy poczty w polityce prywatności, (d) wiersz „Pełna wersja”. 02-monetyzacja-002 i 08-programista-005 to ten sam mechanizm, więc oceniam je jako jedną pozycję.

Dowody komend:
- `dowody/G5-sonda-ocena.txt`: sonda Jest w kopii roboczej w scratchpadzie, exit=0;
- `dowody/G5-polityka.txt`: grep w `site/` oraz curl opublikowanych stron;
- `dowody/G5-espresso.txt`: liczba lokalizacji, terytoria kontroli ASC, grep Ukrainy;
- `dowody/G5-zrodla-apple.txt`: źródła Apple przeczytane dziś.

| ID | Wynik | Dowód | Realność | Poziom (zgłoszony → właściwy) |
|---|---|---|---|---|
| 02-monetyzacja-506 | potwierdzone (brak sprawdzenia cen we wszystkich krajach, decyzja UA niezamknięta); powód wyjątku UA prawdopodobnie zdezaktualizowany przez zmianę brzmienia 21.10 | docs/research/espresso-mimit-2026-10.md:19 „ceny planu miesięcznego we wszystkich krajach”; store/asc-kontrola.json:10 „"wybrane": ["USA", "POL", "DEU", "FRA", "ITA", "ESP", "NLD", "GBR"]”; docs/15-app-store.md:135 „niższy punkt cenowy poniżej ceny espresso”; dowody/G5-espresso.txt (33 z 33 lokalizacji z przypisem, grep UA w kontroli i docs/monetyzacja.md → exit=1) | brzegowy | P2 → P2 |
| 11-wzrost-001 | potwierdzone | lib/review-run.ts:63 „if (onFairRules && fairRulesDue(w)) onFairRules();”; lib/review-run.ts:28 „finishedWorkouts: finishedWorkouts().length”; sonda: import CSV + pierwszy trening na żywo z rekordem → okno=1, prośba=1 (dowody/G5-sonda-ocena.txt, exit=0) | realny (użytkownik po imporcie albo z treningami dopisanymi wstecz, gdy pierwszy trening na żywo ma rekord) | P2 → P2 |
| 01-odkrywanie-008 | potwierdzone, zakres szerszy niż w zgłoszeniu (4 linie PL/EN, także „Przekazanie poza EOG”) | site/privacy.html:89 „(rejestrator domeny, który przekazuje pocztę do skrzynki)”; site/privacy.html:91 „mogą przetwarzać dane w USA”; docs/18-przekazanie.md:400 „Do zrobienia: usunięcie”; opublikowane strony: HTTP 200, ta sama treść (dowody/G5-polityka.txt) | realny (każdy czytelnik polityki), skutek mały | P2 → P2 |
| 02-monetyzacja-002 + 08-programista-005 | niepewne: fakty potwierdzone, teza „defekt” obalona (wiersz spełnia wzorzec docs/32 i decyzję K1), zostaje decyzja produktowa | components/SubscriptionCard.tsx:16 „<Item title={t('Pełna wersja')}”; docs/32-wzorce-interakcji.md:94 „przechodzi na inny ekran**, ma po tytule”; docs/18-przekazanie.md:470 „K1 (a) jedna nazwa”; cytat Apple dotyczy ekranu zakupu (dowody/G5-zrodla-apple.txt) | realny (każdy użytkownik `free`), skutek niepotwierdzony | P2 → P2 (rodzaj P: decyzja właściciela, nie D) |

## 02-monetyzacja-506

**Potwierdzone fakty**

- Przypis jest we wszystkich 33 lokalizacjach. Przykład: store/app-store-metadata.json:8 „plan miesięczny w cenie porównywalnej z jednym espresso w barze*” (dowody/G5-espresso.txt: „lokalizacje: 33 z przypisem: 33”).
- Warunek nadal jest otwarty w źródle: docs/research/espresso-mimit-2026-10.md:19 „ceny planu miesięcznego we wszystkich krajach”.
- Kontrola ASC obejmuje 8 terytoriów i strefę euro: store/asc-kontrola.json:10. Dostępność w kontroli nie jest ustalona (`dostepnosc.terytoria: null`).
- Kontrola z 21.10 sprawdziła tylko 4 waluty, a mimo to wyciągnęła wniosek ogólny: docs/45-widocznosc-w-sklepie.md:162 „kontrola ASC 21.10.2026), więc twierdzenie nadal prawdziwe”.
- Aplikacja jest dostępna we wszystkich krajach poza Chinami kontynentalnymi: docs/18-przekazanie.md:591 „wszystkie kraje poza Chinami kontynentalnymi”.
- Ukrainy nie ma w `store/`, w docs/monetyzacja.md, w docs/40 ani w docs/brd (grep, exit=1). W docs/18 nadal jest otwarte: docs/18-przekazanie.md:179 „[OTWARTE]: punkt cenowy UA”. W docs/15 status to także [OTWARTE] (docs/15-app-store.md:135).

**Co osłabia znalezisko (nie obala go)**

- Decyzja 13.10 dotyczyła hasła „tańsze niż espresso” i miała zastrzeżenie „bez potwierdzania ceny espresso w każdym kraju” (docs/18-przekazanie.md:179).
- 21.10 brzmienie zmieniono na porównanie z ceną we Włoszech, z przypisem: docs/18-przekazanie.md:397 „w cenie porównywalnej z jednym espresso w barze*”. Od tej pory lokalna cena espresso na Ukrainie nie ma znaczenia dla prawdziwości zdania, więc powód wyjątku UA jest prawdopodobnie nieaktualny. Nikt jednak nie zapisał zamknięcia ani odrzucenia tej decyzji. To luka w zapisie, a rozstrzyga ją właściciel.
- Twierdzenie dotyczy liczby w opisie sklepu (próg wydania: „błędne liczby lub twierdzenia”), ale fałszu nie wykazano.
- Równoważników Apple dla wszystkich krajów nie da się sprawdzić z Linuksa bez App Store Connect.

**Drobna różnica rachunku:** rachunek PL w źródle to ≈ 1,17 € z kursem [DO USTALENIA], a w zgłoszeniu ≈ 1,13 €. Obie wartości leżą w przedziale.

**Ocena:** P2, brzegowy. Jeśli kontrola wykaże kraj wyraźnie powyżej 1,51 €, poziom rośnie do P1 (błędne twierdzenie).

## 11-wzrost-001

**Mechanizm potwierdzony w kodzie**

- Okno „Uczciwe zasady” wymaga tylko, żeby bieżący trening był na żywo: lib/fairrules.ts:18 „st.seenFairRulesManifest === true || w.live !== true”.
- Bramka oceny liczy wszystkie zakończone treningi: lib/state/history.ts:15 „getState().workouts.filter(w => w.finishedAt)”.
- Próg to 3 treningi: lib/review.ts:69 „if (i.finishedWorkouts < REVIEW.MIN_WORKOUTS) return 'tooFewWorkouts';”.
- Obie reguły biegną w jednym przebiegu, a prośba o ocenę idzie po opóźnieniu: lib/review-run.ts:63.

**Sonda (dowody/G5-sonda-ocena.txt, exit=0)**

| Scenariusz | Okno „Uczciwe zasady” | Prośba o ocenę |
|---|---|---|
| S1: prawdziwy `commitCsvImport` (fixture, 3 treningi) + pierwszy trening na żywo z rekordem, `free` | 1 | 1 |
| S2: 2 treningi wstecz + pierwszy na żywo z rekordem | 1 | 1 |
| S3: kontrola, nowa instalacja bez historii | 1 | 0 |

**Czego nie potwierdzam**

- Zasada docs/26-prosba-o-ocene.md:30 („przed pierwszym ukończonym treningiem”) nie jest łamana dosłownie, bo po imporcie są ukończone treningi.
- Cytat HIG o „first launch or during onboarding” pasuje tylko co do ducha.
- Trafniejsze jest „Avoid interrupting people…” (dowody/G5-zrodla-apple.txt): systemowa prośba nakłada się na otwarte okno.

**Brak strażnika:** niezmiennik „jedno na ekranie” obejmuje tylko link: docs/34-wsparcie-i-opinie.md:61 „link nigdy na tym samym ekranie co prośba o ocenę”.

**Ocena:** P2, realny dla osób przesiadających się z importem, gdy pierwszy trening na żywo ma rekord. W TestFlight okna oceny nie ma.

## 01-odkrywanie-008

**Potwierdzone w repo**

- Nazwa rejestratora występuje w 4 liniach `site/privacy.html`: PL 89 i 91, EN 169 i 171. Przykład EN: site/privacy.html:169 „the domain registrar that forwards mail to the mailbox”.
- Polityka mówi też, że poczta „dziś” działa na darmowej skrzynce, a przeniesienie jest dopiero zapowiedziane.
- Decyzja z 21.10 mówi co innego: docs/18-przekazanie.md:400: poczta przeniesiona na firmowe konto 21.10, przekierowania usunięte, „Do zrobienia: usunięcie”.

**Opublikowane strony (dowody/G5-polityka.txt)**

- Zarówno apps4brew.com, jak i github.io zwracają 200 i zawierają nazwę rejestratora w 4 liniach.
- Strona github.io jest identyczna z `site/privacy.html` (`cmp`, exit=0).

**Dlaczego obecne zabezpieczenie tego nie łapie:** R-017 (docs/40-lekcje.md:34 „porównuje treść na żywo z”) sprawdza tylko zgodność strony z `site/`, nie zgodność `site/` ze stanem faktycznym. Przebieg będzie więc zielony mimo błędu.

**Ocena:** Apple 2.3 wymaga aktualnych metadanych „including privacy information” (dowody/G5-zrodla-apple.txt). Tu polityka ujawnia za dużo, niczego nie zataja, więc ryzyko odrzucenia jest małe. P2 pasuje. Poprawka wymaga też linii 91/171 (przekazanie poza EOG) i ponownej publikacji (docs/48 Z-10a).

## 02-monetyzacja-002 + 08-programista-005

**Fakty potwierdzone:** tytuł wiersza jest stały, a podtytuł w stanie `free` to licznik dni (components/SubscriptionCard.tsx:13 „Darmowe dni treningowe w tym miesiącu: wykorzystano {n} z {limit}”).

**Dlaczego teza „defekt” nie wytrzymuje**

- Wiersz działa według wzorca docs/32 pkt 17: rola `button` i znak „›” (components/ui.tsx:58 „onPress && !right ? '›' : null”). Ten sam układ „tytuł = ekran docelowy, podtytuł = stan, ›” ma wiersz Język: app/more/settings.tsx:35 „<Item title={t('Język')}”.
- Tytuł odpowiada nagłówkowi ekranu, do którego prowadzi: app/_layout.tsx:119 „presentation: 'modal', title: t('Pełna wersja')”. Zgadza się to z decyzją K1 o jednej nazwie (docs/18-przekazanie.md:470).
- Cytat Apple dotyczy „subscription’s sign-up screen”, czyli ekranu zakupu, nie wiersza w Ustawieniach (dowody/G5-zrodla-apple.txt).
- Obserwacji właściciela T-11 z 27.10 nie ma zapisanej w repo.

**Co zostaje:** w stanie `free` wiersz może się czytać jak opis posiadanego stanu. To ocena czytelności i decyzja produktowa: na przykład tytuł zależny od stanu albo pozostawienie wzorca. Zgłoszenie 08-programista-005 klasyfikuje to trafnie (P).

**Ocena:** P2, bez wpływu na próg wydania. Zmiana tytułu wymaga też aktualizacji strażnika tests/audit-m1-050-support-subscription.test.ts:46.
