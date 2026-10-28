# Ponowny audyt: Studio Projektowe (UX, marka, przepływy) — Trening — 2026-10-28
Commit: 2385e75aeb3880c0c90ba5edd69145a1c6d80b01 (main po naprawach M2, HEAD odłączony; sprawdzony na starcie) · Baza: 025a50b96f504ea9d16d573720d1e92dc951a103 · Tryb: reaudit, pętla 1 · Ostatni nagłówek promptu: „## Kontrola dowodów i sekretów przed oddaniem raportu”.
Środowisko (ETAP 0): Linux, Node 22, Playwright 1.63, git; brak Xcode, symulatora i telefonu; sondy w worktree w scratchpadzie (node_modules z repo przez dowiązanie), testy pojedynczo z `--maxWorkers=1`; typecheck i lint z wyników wspólnych (kod 0). Workflowów nie uruchamiałem. Dowód: `dowody/srodowisko.txt`.

## Podsumowanie
Naprawy obszaru roli są w kodzie 2385e75 i ich testy przechodzą (13 zestawów, `dowody/testy-napraw.txt`). Dziesięć z jedenastu ID zweryfikowanych; 003 (mechanizm decyzja → test) działa, ale jedna pozycja z jego testu akceptacyjnego (podgląd liczb w 1.0.1) dalej nie ma wpisu w backlogu. Przegląd różnicy dał trzy nowe znaleziska: jedno P1, które **istniało wcześniej** (karta stanu na ekranie zakupu jest jednym elementem VoiceOver i chowa przycisk „Zarządzaj subskrypcją”), oraz dwa P2 w nowym kodzie (przezroczystość posiadanego planu obniża kontrast tekstu pomocniczego; znak „›” w „Pierwszych krokach” bez limitu 1,4, poza zasięgiem strażnika). Zrzuty 580–589 pochodzą z buildów sprzed scalenia partii 3 (na 583 „Planowanie” stoi jeszcze nad tytułem, na 586 widać ucięty „×”), więc nie pokazują wyglądu 2385e75.

| ID | Wynik | Dowód (2385e75) |
|---|---|---|
| 04-studio-projektowe-003 | nadal otwarte (częściowo): strażnik `check:decyzje` działa (341 wpisów, kod 0; test 21/21), K3 wdrożone; podgląd liczb 1.0.1 (DEC-01 a) bez wpisu w docs/21, a wpis DEC-07 wskazuje „otwarte → M1-audytor-generalny-009” mimo statusu zadania „naprawione” | `dowody/sondy-kod.txt`, `dowody/testy-napraw.txt`, docs/18-przekazanie.md:468 |
| 04-studio-projektowe-001 | zweryfikowane (stan „Masz plan: …”, lista zwinięta pod „Zmień plan”, test 10/10 w powtórce; pierwszy przebieg 1 czerwony z czasu przy zimnym starcie); nowe: 601 (istniało wcześniej), 602 | app/paywall.tsx:86, `dowody/testy-napraw.txt` |
| 04-studio-projektowe-002 | zweryfikowane w kodzie: `GLYPH_SCALE_MAX` 1,4 i strażnik T-04 32/32, scenariusz 58 zielony (40624070610); stan „dzień bez treningu” nie sprawdzono (krok telefonu); scenariusz 58 poza pakietem podstawowym i nocą | lib/theme.ts:37, `dowody/sondy-kod.txt` |
| 04-studio-projektowe-005 | zweryfikowane („Planowanie” w wierszu `title-row`, test 11/11) | app/(tabs)/index.tsx:46 |
| 04-studio-projektowe-007 | zweryfikowane (test 7/7); nowy znak „›” — 603 | components/Dashboard.tsx:108 |
| 04-studio-projektowe-009 | zweryfikowane („⋯” → Przesuń wyżej / niżej, test 4/4) | components/DragList.tsx:104 |
| 04-studio-projektowe-010 | zweryfikowane (skróty jednoliterowe przy braku miejsca, test 5/5) | components/TodayPlan.tsx:40 |
| 04-studio-projektowe-004 | zweryfikowane w teście (hitSlop do 44 pt, 1/1); pole dotyku na urządzeniu nie sprawdzono | components/WorkoutBlocks.tsx:55 |
| 04-studio-projektowe-011 | zweryfikowane (przegląd „·” zamknięty, strażnik 5/5; podpisy startu zostają — wariant a) | docs/32-wzorce-interakcji.md:159 |
| 04-studio-projektowe-008 | zweryfikowane jako odłożenie: pozycja backlogu 1.0.1 z ID, test 3/3, zapadka tokenów 6/6 | docs/21-roadmapa-offline.md:157 |
| 04-studio-projektowe-006 | zweryfikowane (tytuł wiersza zależny od stanu, test 43/43); „Pro” obok „Pełna wersja” (K1) czeka na właściciela przy M1-009 | components/SubscriptionCard.tsx:19 |
| 04-studio-projektowe-601 | NOWE · P1 · istniało wcześniej — karta stanu jednym elementem VoiceOver chowa „Zarządzaj subskrypcją” | app/paywall.tsx:84 |
| 04-studio-projektowe-602 | NOWE · P2 · nowy kod — posiadany plan z przezroczystością 0,7: tekst pomocniczy 3,52:1 / 4,06:1 | `dowody/paywall-opacity-kontrast.txt` |
| 04-studio-projektowe-603 | NOWE · P2 · regresja naprawy 025 — „›” w „Pierwszych krokach” z limitem 2,0 zamiast 1,4; strażnik tego stanu nie renderuje | components/Dashboard.tsx:112 |

| Pozycja M2 | Wynik | Dowód |
|---|---|---|
| M2-koordynator-napraw-003 (znak „×” na tablicy, decyzja 6a, 0311996e) | zweryfikowane w kodzie i teście: wysokość linii liczona z rozmiaru znaku, `tests/m3-p2-board-ui.test.tsx` 41/41; po poprawce brak zrzutu — wygląd na iOS nie sprawdzono (586 z 40624070610 jest sprzed poprawki) | components/NowBoard.tsx:83, `dowody/kadr-586-znak-x-przed-6a.png` |

Liczby nowych znalezisk: P0 — 0, P1 — 1 (601, istniało wcześniej), P2 — 2 (602, 603).

Otwarte poza main (tylko wypisuję): 9a eksport figur strony (gałąź naprawy/M2-po-decyzjach-eksport-figur), propozycje A/B w L-047 i L-048 (docs/40), backlog 1.0.1 w docs/21.

## Sprawdzone ID — szczegóły
- **003 (M1-009).** `node scripts/decyzje.mjs --check` kod 0, `tests/decyzje-straznik.test.ts` 21/21; K3 ma pole wdrożenia z testem. Pozostaje: test akceptacyjny 003 wymagał, żeby 'podgląd 1.0.1' miał wpis w backlogu z wersją — w docs/21 brak (grep 'przytrzym': 0 trafień). Wpis DEC-07 (docs/18-przekazanie.md:468) ma pole 'otwarte → M1-audytor-generalny-009', a zadanie M1-009 jest w planie napraw 'naprawione-do-weryfikacji' — strażnik nie sprawdza, czy ID w 'otwarte → ID' jest dalej otwarte, więc K1 ('Pro' obok 'Pełna wersja') i podgląd liczb mogą zostać bez właściciela. Do decyzji właściciela przy K1; dopisek do docs/21 to zadanie dokumentu.
- **001 (M1-010).** Kod zgodny z DEC-09 a i uzgodnieniem 1A × DEC-09 a: nagłówek `ownedPlanTitle` (app/paywall.tsx:86), wstęp o darmowych dniach i stopka ukryte przy aktywnym planie, 'Zmień plan' z `expanded`, 'Przejdź na ten plan', 'Aktualny plan'. Wzorzec 20 docs/32 (przełącznik ze stałą etykietą) zachowany. VoiceOver — patrz 601: test M1-010 sprawdza rolę nagłówka w drzewie React, czego iOS przy grupie `accessible` nie przeniesie.
- **002 (M1-011), ocena T-04.** Zrzuty 583–585 (z planem, dzień planu) w pełnej rozdzielczości 1206×2622: nic ucięte, pasek zakładek czytelny. Stan 'dziś bez treningu' różni się od zrzuconego tylko podpisem przycisku startu (components/StartPanel.tsx:28 wobec :27) i brakiem karty dnia; '›' w przycisku ma już limit 1,4. Ryzyko ucięcia w tym stanie oceniam jako niskie, ale niepotwierdzone. Opcje: (a) krok telefonu T-04 (2 min właściciela, dzień spoza planu) — zostaje, rekomendacja; (b) scenariusz 58 z planem na dni inne niż dziś (wymuszenie stanu) i dopisanie 58 z dużym tekstem do nocy — mechanizm na przyszłość, ok. 1 h agenta + przebieg; dziś duży tekst na iOS biegnie tylko na żądanie (`dowody/sondy-kod.txt`).
- **005, 007, 009, 010, 004, 011, 008, 006** — testy w `dowody/testy-napraw.txt`. Zrzut 583 pokazuje jeszcze stary układ K3 (`dowody/kadr-583-planowanie-nad-tytulem.png`), bo przebieg był z gałęzi bez partii 3 — dowodem jest kod i test, nie zrzut. Znane uwagi z wyniku fix (etykieta „Opcje ćwiczenia” przy supersecie, „Btn nav” bez „›”, podpowiedź o „⋯” na ekranie Kolejność) — nie zgłaszam ponownie.

## Przegląd różnicy 025a50b..2385e75 (obszar roli)
39 plików (`git diff --stat` w zakresie z polecenia). Poza naprawami ID roli: jednostki przez `unitLabel()`/`distLabel()`/`unitName()` (symbol masy lokalnie, decyzja 10a) — spójne w tablicy, tabeli serii, szablonie, edycji historii, imporcie i edytorze ciężarów; okno błędu zapisu (`PersistErrorAlert`, app/_layout.tsx) z „OK” i „Spróbuj ponownie” zgodnie ze wzorcem potwierdzeń; ekran błędu startu z ostrzeżeniem i stałą `STRONG`; limity `GLYPH_SCALE_MAX` na strzałkach i znakach w 12 plikach. Ekran zakupu po 1A × DEC-09 a: wygląd zgodny z wzorcami 17 i 20 docs/32, kolejność planów wg `PLAN_ORDER`; uwagi 601, 602. `.maestro/58-duzy-tekst.yaml`: bez danych osobowych, zrzuty 580–589 z opisem stanów.

## Próbka regresji (pozycje spoza zmienionych plików)
| Pozycja | Pliki (bez zmian 025a50b..2385e75) | Wynik |
|---|---|---|
| SP-16 intro i ekran startowy | components/Intro.tsx, app.json | ok — `tests/intro.test.tsx` 21/21 |
| SP-20 gesty niszczące | components/SwipeRow.tsx, components/DeleteButton.tsx | ok — `tests/swipe-delete.test.tsx` 32/32 |
| SP-15 / SP-14 zamykanie okien, kroje | `tests/close-button-guard.test.tsx`, assets/fonts (Barlow + OFL), lib/a11yPrefs.ts:32 | ok — 29/29; licencja OFL na miejscu |
Dowód: `dowody/regresja-probka.txt`.

## Znaleziska (szczegóły)

### 04-studio-projektowe-601 · Na ekranie „Pełna wersja” przycisk „Zarządzaj subskrypcją” jest niedostępny dla VoiceOver, bo karta stanu to jeden element
- Pozycja listy kontrolnej: SP-18
- Poziom: P1 (bariera dostępności: osoba z VoiceOver nie zarządzi subskrypcją z aplikacji; obejście przez Ustawienia iOS istnieje)
- Realność: realny (każda osoba z VoiceOver po zakupie) · Pewność: średnia (mechanizm z kodu i z zapisu projektu; na urządzeniu nie sprawdzono)
- Rodzaj: D
- Dowód: karta `paywall-owned` ma `accessible` (app/paywall.tsx:84), a w środku jest przycisk 'Zarządzaj subskrypcją' (app/paywall.tsx:91) i nagłówek z rolą `header` (app/paywall.tsx:86). Projekt sam zapisał, że iOS chowa potomków takiej grupy przed VoiceOver i XCTest (components/NowBoard.tsx:80). Żaden scenariusz Maestro nie stuka 'Manage subscription' (`dowody/sondy-kod.txt`, grep kod 1); testy Jest stukają przycisk po tekście, czego grupa w drzewie React nie blokuje. Ten sam układ w 025a50b (app/paywall.tsx linie 68 i 73 w bazie) — **istniało wcześniej**.
- Mechanizm: grupa `accessible` zastępuje potomków jednym elementem; podwójne stuknięcie aktywuje środek karty, nie przycisk; `grep -n 'accessible' app/paywall.tsx` → 2 grupy, tylko `paywall-owned` zawiera przycisk.
- Powraca: nie → strażnik: żaden element `accessible` (bez `accessibilityRole` przycisku) nie zawiera potomka z `onPress`
- Wzorzec lub źródło: podłoga VoiceOver roli (elementy interaktywne mają rolę i etykietę), docs/32 (VoiceOver jako część wzorca akcji).
- Kroki w aplikacji: VoiceOver włączony → Więcej → Ustawienia → wiersz „Masz plan: …” → karta stanu czytana jako jeden tekst, przycisku „Zarządzaj subskrypcją” nie da się wybrać.
- Opcje: (a) zdjąć `accessible` z karty, nagłówek zostaje nagłówkiem, przycisk osobnym elementem — tanie, kolejność czytania naturalna; (b) zostawić grupę z `accessibilityActions` „Zarządzaj subskrypcją” — mniej zmian, akcja ukryta w rotorze; Rekomendacja: (a) + strażnik.
- Test akceptacyjny: strażnik grup `accessible` z przyciskiem w środku (czerwony na obecnym kodzie); scenariusz 21 stuka „Manage subscription” po zakupie (XCTest widzi przycisk).
- Status: otwarte (poza bieżącą pętlą — istniało wcześniej, do decyzji właściciela)

### 04-studio-projektowe-602 · Posiadany plan na liście „Zmień plan” jest wyszarzony przezroczystością i tekst pomocniczy spada poniżej 4,5:1
- Pozycja listy kontrolnej: SP-04
- Poziom: P2
- Realność: realny (każda osoba z subskrypcją po rozwinięciu „Zmień plan”) · Pewność: wysoka
- Rodzaj: D
- Dowód: `opacity: own ? 0.7 : 1` na karcie planu (app/paywall.tsx:102, nowy kod DEC-09 a). Rachunek na tokenach (nałożenie warstwy 0,7 na tło `bg`, WCAG 2.2): nazwa i opis planu (`muted`) 3,52:1 w jasnym i 4,06:1 w ciemnym; cena i 'Aktualny plan' ≥ 5,48:1 — `dowody/paywall-opacity-kontrast.txt` (kod 1). WCAG 1.4.3 zwalnia nieaktywne elementy, ale projekt przyjął regułę A11-16: wyszarzenie kolorem `muted`, nie przezroczystością (components/ui.tsx:63).
- Mechanizm: przezroczystość grupy miesza tekst z tłem ekranu; `grep -n "opacity: own"` → 1 trafienie.
- Powraca: nie
- Wzorzec lub źródło: A11-16 w kodzie projektu; podłoga kontrastu roli.
- Kroki w aplikacji: kupiony plan roczny → Pełna wersja → Zmień plan → karta rocznego blada.
- Opcje: (a) bez przezroczystości; stan niesie „Aktualny plan” i brak ramki wyboru — zgodne z A11-16; (b) zostawić jako wyjątek WCAG dla elementu nieaktywnego z wpisem w docs/32 — bez pracy, słabsza czytelność w słońcu; Rekomendacja: (a).
- Test akceptacyjny: test ekranu: karta posiadanego planu bez `opacity` < 1; kontrast tekstów karty ≥ 4,5:1 w czterech paletach.
- Status: otwarte

### 04-studio-projektowe-603 · Znak „›” w „Pierwszych krokach” rośnie do 200%, wbrew limitowi 1,4 dla znaków-ikon, a strażnik T-04 tego stanu nie sprawdza
- Pozycja listy kontrolnej: SP-07
- Poziom: P2
- Realność: brzegowy (nowa osoba z dużym tekstem, przed pierwszym treningiem) · Pewność: wysoka
- Rodzaj: D
- Dowód: components/Dashboard.tsx:112 — `maxFontSizeMultiplier={TEXT_SCALE_MAX}` (2,0) przy '›', dodane naprawą M1-025 (w 025a50b brak tego znaku); reguła `GLYPH_SCALE_MAX = 1.4` (lib/theme.ts:37). Strażnik T-04 w `tests/matrix-a11y.test.tsx` przechodzi trasy z zakończonym treningiem, więc 'Pierwszych kroków' nie renderuje (grep `first-steps` w strażniku i trasach: 0 trafień) — `dowody/sondy-kod.txt`.
- Mechanizm: dwie równoległe naprawy (011 i 025) — reguła nowa, nowy znak napisany wg starej; jedyny „›” poza limitem w components/.
- Powraca: tak, T-04 (04-studio-projektowe-002) → strażnik ma objąć stan pierwszego uruchomienia
- Wzorzec lub źródło: decyzja T-04 w lib/theme.ts:36; podłoga 'Tekst' roli.
- Kroki w aplikacji: nowa instalacja, Większe rozmiary dostępności → Trening → „Pierwsze kroki”, zdanie o miejscach i sprzęcie.
- Opcje: (a) `GLYPH_SCALE_MAX` + trasa „pierwsze uruchomienie” w strażniku — tanie; (b) zostawić (znak ma 200%, nie 310%, wiersz się zawija) — strażnik dalej ślepy na ten stan; Rekomendacja: (a).
- Test akceptacyjny: strażnik T-04 renderuje stan bez treningów i jest czerwony na obecnym components/Dashboard.tsx:112.
- Status: otwarte

**Weryfikacja przeciwna 601 (P1):** próbowałem obalić — czy `Btn` mógłby wyjść poza grupę albo czy karta ma akcję dostępności? Karta nie ma `accessibilityActions` ani `onAccessibilityTap`; `accessible` na widoku iOS czyni go elementem i ukrywa potomków (zapis projektu w components/NowBoard.tsx:80). Czy obejście czyni to P2? Zarządzanie subskrypcją jest w Ustawieniach iOS, ale aplikacja pokazuje przycisk, którego osoba z VoiceOver nie użyje, a nagłówek planu traci rolę. Przetrwało jako P1 z pewnością średnią; potwierdzenie: VoiceOver na telefonie albo scenariusz 21 stukający 'Manage subscription'.

## Czego nie sprawdzono
- VoiceOver i pola dotyku (`hitSlop` na polu RPE) na urządzeniu; wygląd „×” po poprawce 6a i ekranu zakupu na iOS (brak zrzutu z 2385e75; zrzuty 580–589 z wcześniejszych buildów); stan T-04 „dzień bez treningu” — krok telefonu.
- Przebiegi CI czytane tylko z wyników wspólnych (tests.yml na 2385e75 zielone, e2e w toku w chwili odczytu).
- Dysk Google i repo prompts (pamięć portfolio) — niedostępne.

## Kontrola dowodów i sekretów
Wynik `node audit/M1-2026-10-27/reaudit-2026-10-28/sprawdz-raport.mjs <raport> /home/user/trening <katalog roli> --rola 04-studio-projektowe`: `dowody/sprawdz-raport.txt`.

`git status --porcelain` w /home/user/trening na końcu: `dowody/git-status-koniec.txt` (pliki śledzone nietknięte; worktree sondy usunięty). W raporcie i dowodach brak e-maili, UDID, sekretów i nazw innych aplikacji.
