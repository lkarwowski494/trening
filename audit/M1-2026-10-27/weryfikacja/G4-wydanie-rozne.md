# Weryfikacja przeciwna G4 — 2026-10-27

Commit: 025a50b9

Zakres: wydanie i sprawy różne. Pięć mechanizmów (08-programista-001 i 02-monetyzacja-505 to jeden mechanizm). Dowody komend:
- `dowody/G4-build-1031.txt`: git, build 1031 a kandydat;
- `dowody/G4-decyzje-ui.txt`: decyzje UI a kod;
- `dowody/G4-sonda.txt`: sonda Jest w kopii roboczej 025a50b9 w scratchpadzie, exit=0;
- `dowody/G4-testy-przypinajace.txt`: istniejące testy przypinające stary stan, każdy osobno, exit=0;
- `dowody/G4-zrodla.txt`: źródła przeczytane dziś.

| ID | Wynik | Dowód | Realność | Poziom (zgłoszony → właściwy) |
|---|---|---|---|---|
| 10-wydanie-001 | potwierdzone | docs/48-zgloszenie-1-0.md:94 „wybór buildu 1.0 z TestFlight”; docs/09-plan-testow.md:213 „build do testu na telefonie (23.10.2026)” (ostatni wiersz, 1030); `git rev-list --count 001ecf28..025a50b9` = 32, 8 plików `lib/figures/v2` (dowody/G4-build-1031.txt) | brzegowy | P1 → P1 |
| 04-studio-projektowe-003 | potwierdzone na kandydacie; mechanizm częściowo powstaje poza kandydatem (gałąź naprawy-1-0) | lib/products.ts:19 „PLAN_ORDER: readonly EntitlementPlan[] = ['yearly', 'monthly', 'lifetime']”; tests/m5s1-bez-proby.test.ts:86 „kolejność planów bez zmian: roczny, miesięczny, dożywotni”; docs/18-przekazanie.md:470 „w linii tytułu także na ekranie Trening” a app/(tabs)/index.tsx:44 „<View style={{ alignItems: 'flex-end' }}><PlanningButton” | realny (proces) | P1 → P2 |
| 06-tresci-004 | potwierdzone | lib/state/effort.ts:18 „export const RIR_MAX = 5, RPE_LIGHT = 4;”; sonda S1: `effortIn` RIR [5,6,7] = [5,4,4]; Helms 2016 (odczyt dziś): „scores of 5–6 were grouped as 4–6 RIR” (dowody/G4-zrodla.txt) | brzegowy | P2 → P2 |
| 12-niezawodnosc-003 | potwierdzone | components/StartError.tsx:32 „openSupportMail('feedback')”; sonda S2: treść = tylko stopka wersji, `zawiera_begin/loaded= false` (dowody/G4-sonda.txt) | brzegowy | P2 → P2 |
| 08-programista-001 | potwierdzone (mechanizm); objaw z telefonu nie jest zapisany w repo | lib/store-native.ts:126 „await m.deepLinkToSubscriptions()”; node_modules/expo-iap/src/modules/ios.ts:379 „Linking.openURL('https://apps.apple.com/account/subscriptions')”; tests/store-adapter.test.ts:198 „c[0] === 'deepLinkToSubscriptions'” | realny w TestFlight; w produkcji działa, ale wyprowadza z aplikacji | P2 → P2 |
| 02-monetyzacja-505 | potwierdzone (ten sam mechanizm co 08-programista-001) | docs/27-subskrypcja-spec.md:165 „systemowy arkusz, `showManageSubscriptions`”; lib/store-adapter.ts:44 „Systemowy arkusz zarządzania subskrypcją.” | jak wyżej | P2 → P2 |

## 10-wydanie-001

**Fakty z repo:**
- Tag `v1.0.0-b1031` istnieje tylko na zdalnym repo (lokalnie go brak) i wskazuje 001ecf28.
- Kandydat 025a50b9 jest jego potomkiem, 32 commity dalej. W tych commitach zmieniło się 8 plików `lib/figures/v2` (rigi squat, benchPress, hinge), więc są tam poprawki z L-042.
- Wersja aplikacji jest wspólna: app.json:5 „"version": "1.0.0",”.
- Z-26 nie wskazuje numeru buildu ani SHA: docs/48-zgloszenie-1-0.md:94 „wybór buildu 1.0 z TestFlight”. `grep '1031\|SHA'` w docs/48 nie daje trafień.
- Dziennik wydań nie ma wiersza 1031 (`grep -c` = 0).

**Co osłabia znalezisko (tylko częściowo):**
- Z-07 każe zbudować nowy build: docs/48-zgloszenie-1-0.md:65 „numer buildu = 1000 + numer przebiegu”.
- W1-07 wymaga wiersza w dzienniku: docs/42-plan-wydania-1.0.md:66 „ma wiersz tagu wydania z SHA i numerem przebiegu”.
- Zgodność buildu z dziennikiem sprawdza się jednak dopiero po kliknięciu „Release”: docs/42-plan-wydania-1.0.md:23 „wersja i build zgodne z dziennikiem wydań”. To następuje po recenzji Apple. Przy wyborze buildu w Z-26 nic nie wiąże numeru z SHA zatwierdzonym przez audyt.

**Poziom:** wysłanie 1031 oznacza figury z błędami merytorycznymi z L-042, a to próg wydania. Zostaje P1, realność: brzegowy.

## 04-studio-projektowe-003

**Potwierdzone na kandydacie:**
- **Decyzja 23.10 o kolejności planów** ma wdrożenie przypisane gałęzi: docs/18-przekazanie.md:481 „Wdrożenie: gałąź naprawa-m1-dec07-ui.”. Zakres gałęzi: docs/przekazanie-koordynatora-2026-10-23.md:26 „kolejność planów: miesięczny, roczny, dożywotni + domyślnie miesięczny”. Scalenie 99563b1e wniosło z tej gałęzi tylko K9 (ade64673, dowody/G4-decyzje-ui.txt). Kod został przy kolejności rocznej, a test ją przypina i przechodzi (dowody/G4-testy-przypinajace.txt, exit=0).
- **K3:** na ekranie Trening „Planowanie” stoi w osobnym wierszu nad tytułem, nie w linii tytułu. Test to utrwala: tests/m3-p2-start.test.tsx:31 „nie w karcie planu; stuknięcie → ekran planu”. Na ekranie Plan przycisk jest w wierszu tytułu: app/(tabs)/history.tsx:39 „<TabHeader row><H1>{t('Plan')}</H1><PlanningButton”.
- **Podgląd liczb:** decyzja docs/18-przekazanie.md:460 „podgląd liczb po przytrzymaniu — 1.0.1” nie ma wpisu w docs/21 (`grep -c przytrzym` = 0).

**Co osłabia znalezisko:**
- Commit c9cacfa1 na `origin/naprawy-1-0` (poza kandydatem, `merge-base --is-ancestor` exit=1) robi trzy rzeczy: oznacza decyzję z 23.10 jako zastąpioną 27.10, dodaje `tests/paywall-kolejnosc-domyslna.test.ts` i lekcję ze strażnikiem `[test: …]`.
- Strażnik działa jednak tylko dla nowych wpisów od 28.10 ze słowami kluczowymi. K3 i podgląd 1.0.1 nadal nie mają testu ani pozycji w backlogu.

**Poziom:** skutek dla użytkownika to inne ułożenie interfejsu. Nie jest to utrata danych, awaria, błędna liczba, bariera dostępności ani ryzyko odrzucenia, więc wg progu z CLAUDE.md nie blokuje wydania: P1 → P2. Mechanizm (lekcja systemowa) zostaje do decyzji właściciela.

## 06-tresci-004

**Fakty z kodu:** lib/state/effort.ts:26 „RIR > RIR_MAX → RPE_LIGHT”. Sonda S1: RIR 6 daje zapis RPE 4. W skali RIR widać „6+”, a po przełączeniu na RPE widać 4 (dowody/G4-sonda.txt).

**Źródło przeczytane dziś (pełny tekst z Europe PMC, PMC4961270):**
- „scores of 5–6 were grouped as 4–6 RIR”;
- opisy słowne tylko dla RPE 1–4.

RIR 6 należy więc do przedziału RPE 5–6. Uzasadnienie w tekście jest niespójne: lib/i18n.en.ts:840 „because below RPE {min} the scale describes effort in words”. Wpis dotyczy RPE poniżej 5, a RIR 6 do tego przedziału nie należy.

**To samo zapisują BRD i testy:**
- docs/brd/wymagania.md:153 „Gdy użytkownik wpisuje RIR 6”, z oczekiwanym zapisem RPE 4;
- docs/brd/reguly.md:23 „zapisywane jako RPE 4”.

**Zawężenie:** błędne jest tylko RIR 6. Dla RIR 7–9 źródło nie podaje przeliczenia, więc „lekko” (RPE 4) jest obronione.

**Wpływ:** RPE służy tylko do wyświetlania i eksportu, nie wchodzi w obliczenia (`grep rpe` w lib). Rzadki przypadek, P2 zostaje. Naprawa jest tania, ale wymaga przeglądu badacza (T-041 `--rehash`).

## 12-niezawodnosc-003

**Potwierdzone:**
- Przycisk woła `openSupportMail('feedback')` bez kodu.
- Treść maila to tylko stopka, zgodnie z zamierzeniem modułu: lib/support.ts:16 „bez danych treningowych, masy ciała, nazw szablonów, identyfikatorów”.
- Kod etapu startu jest tylko na ekranie: components/StartError.tsx:28 „testID="start-error-diag" selectable”. Lekcja zapowiada kod tylko na ekranie: docs/40-lekcje.md:168 „widoczna jako kod na ekranie awaryjnym”. Nie ma decyzji, która wyklucza dołączenie kodu do maila.

**Co łagodzi skutek:** kod można zaznaczyć i wkleić ręcznie. Obok jest też „Wyślij dane”: components/StartError.tsx:30 „link(t('Wyślij dane'), send)”.

**Poziom:** to jakość sygnału po awarii, nie blokada. P2.

## 08-programista-001 + 02-monetyzacja-505 (jeden mechanizm)

**Potwierdzone:**
- Adapter woła `deepLinkToSubscriptions`.
- W expo-iap 5.8.1 na iOS prowadzi to do node_modules/expo-iap/src/index.ts:1266 „await deepLinkToSubscriptionsIOS();”, czyli `Linking.openURL` na stronę App Store.
- Arkusz systemowy jest dostępny i nieużywany: node_modules/expo-iap/src/modules/ios.ts:190 „ExpoIapModule.showManageSubscriptionsIOS()”.
- Sonda S4 potwierdza tę ścieżkę.

**Testy przypinają obecne zachowanie, nie arkusz:**
- tests/subscription-ui.test.tsx:85 „expect(fake.calls.manageSubscriptions).toBe(1)”: liczy wywołania atrapy;
- tests/store-adapter.test.ts:198: wprost wymaga wywołania `deepLinkToSubscriptions` (exit=0, dowody/G4-testy-przypinajace.txt).

**Apple (odczyt dziś, dowody/G4-zrodla.txt):** „Use this function to display the manage subscriptions sheet within your app.” oraz „Test the managing subscriptions functionality in the sandbox environment…”.

**Sprawdzenie zaplanowane i niewykonane:** docs/przekazanie-koordynatora-2026-10-23.md:48 „sprawdzenie „Zarządzaj subskrypcją” w TestFlight”.

**Niepotwierdzone tutaj:** objaw z telefonu (pusta lista w TestFlight) nie jest zapisany w repo. Lista T-11 w docs/49 nie zawiera tego kroku.

**Ryzyko odrzucenia:** żadna przeczytana strona Apple nie wymaga arkusza, więc ryzyka odrzucenia nie wykazano. P2 zostaje.
