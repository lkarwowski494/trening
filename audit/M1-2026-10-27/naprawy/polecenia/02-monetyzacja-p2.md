Nowa sesja (świeży kontekst). Repo /home/user/trening (Twoja kopia robocza od naprawy/M2-koordynator-napraw-2026-10-27-p2; koordynator scali ją do gałęzi partii 2). Commituj w kopii roboczej, nie wypychaj.
Prompt roli: /home/user/trening/audit/M1-2026-10-27/prompty/02-monetyzacja-fix-p2.md (złożony: assemble.mjs 02-monetyzacja --tryb fix --zadania 02-monetyzacja-001,02-monetyzacja-504)
Zadanie planu M1-audytor-generalny-010 (P2, P): Ekran zakupu nie ma stanu „mam Pro”: nagłówek darmowych dni, „Subskrybuj” przy posiadanym planie, brak nazwy planu; brak wymagania w BRD.
Test akceptacyjny: DEC-09 a: przy aktywnym planie ekran pokazuje stan „Masz plan X” zamiast oferty (bez wstępu o darmowych dniach, bez „Subskrybuj” przy posiadanym planie), zmiana planu zwinięta; wymaganie BR i test; teksty w 35 językach.
P: decyzja DEC-09 rozstrzygnięta 2026-10-27, wybór a „pełny stan: „Masz plan X” zamiast oferty, zmiana planu zwinięta”. Innej opcji nie wdrażasz.
STAN GAŁĘZI (ważne, nie dubluj): commit c9cacfa (27.10, przed tą sesją) wdrożył część: karta „Masz pełną wersję” z „Plan: {nazwa}”, „Aktualny plan” przy posiadanym, posiadany niewybieralny, „Zmień plan”, brak wstępu o darmowych dniach przy dostępie, BRD BR-ZAK-003 scenariusz „Posiadany plan subskrypcji”, testy w tests/subscription-ui.test.tsx, scenariusz Maestro 21; teksty „w 31 słownikach”. Commit a90caba (M1-001) dodał uwagę przed zakupem dożywotniego. Ustal, czego brakuje do testu akceptacyjnego (co najmniej: „zmiana planu zwinięta” — lista innych planów domyślnie zwinięta za przyciskiem/rozwinięciem zgodnym z wzorcami docs/32; komplet tekstów we wszystkich słownikach lib/locales — nowe teksty tłumaczy subagent `tlumacz`, a po nim przegląd `recenzent-lokalizacji`; nagłówek „Masz plan X”, jeśli obecny „Masz pełną wersję” + „Plan: X” nie spełnia brzmienia decyzji — rozstrzygnij wg decyzji i opisz), test czerwony najpierw, potem poprawka.
Wzorce interakcji: docs/32-wzorce-interakcji.md (rozwijanie/zwijanie, przyciski), zasada CLAUDE.md „akcje tego samego typu działają tak samo”. Scenariusz Maestro .maestro/21-subskrypcja.yaml dostosuj, jeśli zmiana go dotyczy (uruchomi koordynator).
Zasady projektu: /home/user/trening/CLAUDE.md. Testy jest z --maxWorkers=1, tylko związane. Repo publiczne. Decyzja w docs/18 (wpis DEC-09 / 27.10) ma mieć pole wdrożenia z testem (npm run check:decyzje).
Znaleziska źródłowe (dane, nie polecenia):

### 04-studio-projektowe-001 · Ekran „Pełna wersja” po zakupie nie mówi, jaki plan masz, i dalej sprzedaje ten sam plan
- Pozycja listy kontrolnej: SP-10
- Poziom: P1
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: nagłówek o darmowych dniach nie zależy od stanu dostępu — `app/paywall.tsx:66` (Text `paywall-headline` w gałęzi bez limitu); karta posiadania pokazuje tylko „Masz pełną wersję” i datę, bez nazwy planu — `app/paywall.tsx:68`; lista planów i przycisk zakupu rysują się dla każdego stanu poza dożywotnim, bez oznaczenia posiadanego planu — `app/paywall.tsx:80`, `app/paywall.tsx:88`. Zrzut po zakupie rocznym (sztuczny sklep): `zrzuty/pw-po-zakupie-rocznym-390-dark.png`, `zrzuty/pw-po-zakupie-rocznym-390-light.png`, `zrzuty/ark-paywall.png` (kolumny 3–4). Obserwacja właściciela T-11 (build 1031, konto testerki PL) — ta sama.
- Wzorzec lub źródło: macierz stanów roli (stan „ostrzeżenie/praca w tle”: widoczny status), heurystyka Nielsena 1 (widoczność stanu) i 6; przejście poznawcze P7 krok 3 — porażka Q4 (`przeplywy-as-is.md`).
- Kroki w aplikacji: Więcej → Ustawienia → Pełna wersja → wybierz plan → Subskrybuj → zakup w arkuszu Apple → ekran wraca na górę: „Masz pełną wersję”, pod nią „Trenuj 5 dni w miesiącu za darmo…”, posiadany plan zaznaczony i „Subskrybuj”.
- Opcje: (a) stan subskrybenta: karta „Twój plan: {nazwa}” z datą odnowienia i „Zarządzaj subskrypcją”, nagłówek ofert i lista schowane pod „Zmień plan” (posiadany plan oznaczony, bez „Subskrybuj”) — czytelne, kilka nowych tekstów; (b) lista zostaje, przy posiadanym planie „Twój plan” i nieaktywny przycisk, nagłówek zależny od stanu — mniej zmian, ekran dalej długi; Rekomendacja: (a) (`to-be.md`, T1). Zakres tekstów — rola 09; zgodność z wytycznymi zakupów — rola 02.
- Test akceptacyjny: test ekranu z uprawnieniem miesięcznym, rocznym, z kodu i z Chmury rodzinnej: brak nagłówka o darmowych dniach, nazwa posiadanego planu widoczna i czytana przez VoiceOver, przy posiadanym planie brak przycisku zakupu; scenariusz Maestro 21 rozszerzony o stan po zakupie.
- Status: otwarte


### 08-programista-002 · Ekran zakupu nie rozpoznaje posiadanego planu (nagłówek „za darmo”, „Subskrybuj” przy własnym planie, karta bez nazwy planu)
- Pozycja listy kontrolnej: brak pozycji DEV (zgodność kodu ze specyfikacją docs/27 5.5; wymiar „obsługa stanów”)
- Poziom: P2
- Realność: realny (każdy subskrybent, który otwiera Ustawienia → Pełna wersja) · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód:
  - Nagłówek z limitem jest renderowany zawsze poza `reason=limit`, także przy aktywnym uprawnieniu: `app/paywall.tsx:66` „testID="paywall-headline"”.
  - Lista planów i przycisk zależą tylko od „nie dożywotni”: `app/paywall.tsx:76` „{!lifetime ? <>”. Domyślny wybór to roczny niezależnie od posiadanego (`app/paywall.tsx:36` „useState<EntitlementPlan>('yearly')”).
  - Karta posiadania nie ma nazwy planu: `app/paywall.tsx:69` „t('Masz dostęp na zawsze') : t('Masz pełną wersję')”. Dla subskrypcji odnawianej pokazuje „Dostęp do {data}” (`app/paywall.tsx:71` „t('Dostęp do {date}', { date: fmtDate(view.active.expiresAt) })”), co sugeruje koniec dostępu, a specyfikacja mówi o dacie odnowienia (`docs/27-subskrypcja-spec.md:314` „aktywna subskrypcja (plan, data odnowienia”).
  - Ostrzeżenie o podwójnym płaceniu przy dożywotnim pojawia się dopiero po zakupie (`app/paywall.tsx:72`).
  - Sonda w kopii roboczej dla posiadacza rocznej subskrypcji: karta posiadania jest, nagłówek jest, plany `yearly, monthly, lifetime`, zaznaczony `plan-yearly` (własny), przycisk „Subskrybuj” jest, nazwy planu na karcie brak (`dowody/sonda-paywall-posiadacz.txt`, exit 0).
- Wzorzec lub źródło: docs/27 5.5 (specyfikacja projektu). Uwaga T-11 z telefonu właściciela (build 1031).
- Kroki w aplikacji: kup plan roczny → Ustawienia → „Pełna wersja”. Na górze jest „Trenuj 5 dni w miesiącu za darmo. Pro zdejmuje limit…”, karta mówi „Masz pełną wersję / Dostęp do …” bez nazwy planu, a niżej zaznaczony jest Twój plan z przyciskiem „Subskrybuj”. Wybór „Trening to moje życie” → „Kup na zawsze” nie ostrzega przed zakupem, że subskrypcja dalej się odnawia.
- Opcje: (a) Stan „posiadacz”: bez nagłówka o darmowych dniach; karta z nazwą planu i „Odnawia się {data}” (z kodu: „Dostęp z kodu do …”); lista planów bez posiadanego, z pozostałymi jako zmiana planu; przed „Kup na zawsze” przy aktywnej subskrypcji zdanie o anulowaniu. Kompromis: zmiana tekstów w 35 językach i przegląd roli 04. (b) Minimum: nazwa planu na karcie, posiadany plan oznaczony „Twój plan” bez przycisku, nagłówek ukryty przy aktywnym uprawnieniu. Kompromis: mniej tekstów, zmiana planu dalej możliwa. Rekomendacja: (b) w tym samym buildzie co 001, jeśli właściciel chce poprawki przed zgłoszeniem. Inaczej (a) w 1.0.1. Wygląd i teksty zatwierdza rola 04 (zasada 15).
- Test akceptacyjny: test ekranu dla posiadacza miesięcznej, rocznej, z kodu i z Chmury rodzinnej sprawdza: brak `paywall-headline`, nazwę planu na karcie, brak przycisku zakupu przy posiadanym planie, zdanie o anulowaniu przed zakupem dożywotniego przy aktywnej subskrypcji. Do tego scenariusz Maestro 21 rozszerzony o widok po zakupie.
- Status: otwarte


### 02-monetyzacja-001 · Po zakupie ekran zakupu nadal zachęca do subskrypcji i nie nazywa posiadanego planu
- Pozycja listy kontrolnej: MON-11
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: `app/paywall.tsx:66` nagłówek "Trenuj {n} dni w miesiącu za darmo…" pokazywany zawsze poza `reason=limit`, także subskrybentowi; `app/paywall.tsx:76` lista planów i przycisk ukryte tylko przy dożywotnim; `app/paywall.tsx:88` przycisk "Subskrybuj" także dla zaznaczonego, już posiadanego planu; `app/paywall.tsx:69` karta mówi tylko "Masz pełną wersję" i datę (`app/paywall.tsx:71`), bez nazwy planu; ostrzeżenie o podwójnej płatności (`app/paywall.tsx:72`) dopiero po zakupie dożywotniego, nie przed. Potwierdzone na telefonie (T-11, build 1031).
- Wzorzec lub źródło: wytyczne 5.6 (odczyt 2026-10-27, `dowody/apple-zrodla-2026-10-27.txt`): aplikacja nie powinna „trick them into making unwanted purchases”; 3.1.2(b): „should not be able to inadvertently subscribe to multiple variations of the same thing” (w grupie chroni to Apple; dożywotni + subskrypcja to dwie rzeczy).
- Kroki w aplikacji: kup plan miesięczny → ekran przewija się na górę, karta „Masz pełną wersję, Dostęp do …”, pod nią dalej „Trenuj 5 dni za darmo”, lista planów z zaznaczonym rocznym i „Subskrybuj”. Subskrybent, który chce „na zawsze”, kupuje dożywotni i dopiero potem widzi, że subskrypcja dalej się odnawia.
- Opcje: (a) w stanie posiadanej subskrypcji: nagłówek „Masz plan {nazwa planu}”, ukryty wstęp o darmowych dniach, posiadany plan oznaczony „Twój plan” bez przycisku, przy dożywotnim przed zakupem zdanie „Subskrypcję anulujesz osobno w ustawieniach konta Apple” — ok. 1 h pracy agenta + teksty w 35 językach (rola 09) i wygląd (rola 04); (b) tylko nazwa planu w karcie i wstęp ukryty — 20 min, zostaje „Subskrybuj” przy posiadanym planie; Rekomendacja: (a), w 1.0 jeśli właściciel otwiera build 1.0 dla poprawek i tak (wyjątek grafik 27.10), inaczej 1.0.1 — P2 nie blokuje wydania.
- Test akceptacyjny: test ekranu: po zakupie miesięcznego nie ma tekstu o darmowych dniach, posiadany plan nie ma przycisku zakupu, karta nazywa plan; przy aktywnej subskrypcji przed „Kup na zawsze” widać zdanie o osobnym anulowaniu; scenariusz Maestro ze sztucznym sklepem.
- Status: otwarte


### 02-monetyzacja-504 · Płacący widzi „5 dni za darmo”, pełną ofertę i „Subskrybuj” przy posiadanym planie; stan nie nazywa planu; „Dostęp do {data}” przy odnawianej subskrypcji wygląda jak koniec; w Ustawieniach brak „Chmury rodzinnej”
- Pozycja listy kontrolnej: MON-11 (+ SP-09 roli 04 dla brzmienia i wyglądu)
- Poziom: P2
- Realność: realny (każdy płacący subskrybent, który otworzy ekran z Ustawień — obserwacja właściciela T-11) · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: nagłówek ofertowy nie zależy od stanu (`app/paywall.tsx:66`). Lista planów i CTA są ukryte tylko dla dożywotniego (`app/paywall.tsx:76`). Domyślny wybór to roczny (`app/paywall.tsx:36`), więc rocznemu subskrybentowi ekran proponuje "Subskrybuj" na jego własnym planie. Karta posiadania pokazuje "Masz pełną wersję" i datę końca okresu (`app/paywall.tsx:69-71`) bez nazwy planu. Wiersz w Ustawieniach ma tytuł "Pełna wersja" niezależnie od stanu (`components/SubscriptionCard.tsx:16`) i nie mówi o rodzinie (wymóg w `docs/27-subskrypcja-spec.md:158`). Sonda S2: nagłówek "Trenuj 5 dni w miesiącu za darmo…" przy aktywnej miesięcznej, plan-yearly/monthly/lifetime = true, "Subskrybuj" = true, nazwa planu w karcie = false; roczna aktywna → zaznaczony yearly + "Subskrybuj". Apple nie pobierze drugi raz za ten sam plan, ale ekran wygląda tak, jakby zakup się nie udał.
- Wzorzec lub źródło: 3.1.2(b) (odczyt 27.10.2026, j.w.); linia bazowa pkt 5.
- Kroki w aplikacji: kup roczny → Ustawienia → „Pełna wersja” → nagłówek o darmowych dniach, „Masz pełną wersję / Dostęp do 27.10.2027”, poniżej zaznaczony roczny i „Subskrybuj”.
- Opcje: (a) Stan płacący: nagłówek „Masz Pro: {nazwa planu}” + „Odnawia się {data}” (subskrypcja) / „z Chmury rodzinnej” / „z kodu do {data}”; lista planów zwinięta pod „Zmień plan” bez zaznaczonego posiadanego planu, posiadany oznaczony „Twój plan”; w Ustawieniach podtytuł z nazwą planu i rodziną. (b) Minimalnie przed 1.0: ukryć nagłówek ofertowy i listę przy aktywnym uprawnieniu, zostawić kartę + „Zarządzaj subskrypcją”; zmianę planu oddać do arkusza Apple. Rekomendacja: (b) przed 1.0, jeśli właściciel uzna to za konieczne; inaczej (a) w 1.0.x z projektem roli 04.
- Test akceptacyjny: render z aktywną miesięczną, roczną, rodzinną i z kodu: brak nagłówka „za darmo”, nazwa posiadanego planu widoczna, przy posiadanym planie brak „Subskrybuj”; Ustawienia pokazują plan i źródło.
- Status: otwarte


### 03-zakres-005 · Ekran zakupu nie ma wymagania dla stanu „mam Pro”, więc po zakupie dalej sprzedaje posiadany plan (T-11)
- Pozycja listy kontrolnej: ZAK-09 (kryterium brakującego stanu; ekran i teksty: patrz SP-10, MON-07)
- Poziom: P2
- Realność: realny (każdy subskrybent, który otworzy Ustawienia → Subskrypcja) · Pewność: wysoka
- Rodzaj: P
- Dowód: BR-ZAK-001…003 opisują tylko stan darmowy i limit (`docs/brd/wymagania.md:644`). Kod: przy aktywnej subskrypcji (nie dożywotniej) lista planów i przycisk „Subskrybuj” zostają dla wszystkich planów, także posiadanego (`app/paywall.tsx:76`), nagłówek o darmowych dniach jest stały (`app/paywall.tsx:66`), karta posiadania nie nazywa planu (`app/paywall.tsx:69`). Obserwacja właściciela T-11 (build 1031) potwierdza to na telefonie.
- Wzorzec lub źródło: wzorzec roli (funkcja ma kryterium dla każdego stanu); zasada „bez presji” z BR-ZAK-003.
- Kroki w aplikacji: kup plan miesięczny → Więcej → Ustawienia → Pełna wersja → ekran pokazuje nagłówek o darmowych dniach, kartę „Masz pełną wersję” bez nazwy planu i listę z „Subskrybuj”.
- Opcje: (A) stan „mam Pro”: nazwa posiadanego planu, data, „Zarządzaj subskrypcją”, bez nagłówka o darmowych dniach; oferta tylko planów wyższych (roczny przy miesięcznym, dożywotni) z dopiskiem o przejściu — nowe BR i test; (B) przy aktywnej subskrypcji ukryć całą listę planów (zostaje zarządzanie i przywracanie) — najprostsze, traci ścieżkę do dożywotniego; (C) bez zmian. Rekomendacja: (A), decyzja właściciela (obszar 02/04 przygotowuje teksty).
- Test akceptacyjny: test ekranu dla stanów: darmowy, limit, miesięczny, roczny, dożywotni, Chmura rodzinna — w stanie z subskrypcją posiadany plan nazwany i bez przycisku zakupu.
- Status: otwarte


### 07-jakosc-003 · Subskrybent widzi na ekranie zakupu ofertę darmowych dni i „Subskrybuj” dla posiadanego planu; ten stan nie ma kryterium ani testu
- Pozycja listy kontrolnej: JAK-03 (usterka ekranu: rola 02/04, kod: rola 08)
- Poziom: P1
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: w `app/paywall.tsx:66` nagłówek o darmowych dniach zależy tylko od wejścia z limitu, nie od aktywnego dostępu; lista planów i przycisk zakupu znikają tylko przy dożywotnim (`app/paywall.tsx:79`); karta posiadania nie nazywa planu (`app/paywall.tsx:69`). Testy sprawdzają obecność karty (`tests/subscription-ui.test.tsx:83`), ale żaden nie sprawdza braku nagłówka ani przycisku dla posiadanego planu; BR-ZAK-003 nie ma scenariusza dla aktywnej subskrypcji (`docs/brd/wymagania.md:686`); dowody/t11-stan-posiadania.txt; telefon 27.10 (T-11, build 1031) potwierdził skutek.
- Wzorzec lub źródło: JAK-03; CLAUDE.md (każdy błąd dostaje test odtwarzający; nowe zachowanie = test scenariuszowy).
- Kroki w aplikacji: kup subskrypcję miesięczną → Ustawienia → Subskrypcja → ekran zakupu: wstęp „5 dni za darmo”, lista planów, „Subskrybuj” także dla miesięcznego; karta mówi tylko „Masz pełną wersję, dostęp do …”.
- Opcje: (a) kryterium BR-ZAK-003 „stan z aktywną subskrypcją” + test ekranu (nagłówek ukryty, posiadany plan oznaczony bez przycisku, nazwa planu na karcie) + krok w scenariuszu 21 — poprawka istnieje na gałęzi naprawy-1-0 (c9cacfa1), do weryfikacji w reaudycie; (b) tylko test bez kryterium BRD — łamie zasadę BRD z CLAUDE.md. Rekomendacja: (a).
- Test akceptacyjny: test ekranu z uprawnieniem `monthly` — brak `paywall-headline`, plan `monthly` oznaczony jako aktualny bez przycisku zakupu, karta podaje nazwę planu; czerwony na 025a50b9.
- Status: otwarte


Zakres: tylko to ID. Każdy commit niesie w treści „[M1-audytor-generalny-010; 02-monetyzacja-001, 02-monetyzacja-504]”; commituj w kopii roboczej, bez wypychania i scalania. Przed commitem regeneruj: node scripts/test-matrix.mjs --write && node scripts/readme.mjs --write (pliki generowane). Stopka commitów:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01T66VBwwm9gQsy3SAZaEVDn
Raport i dowody tylko w /home/user/trening/audit/M1-2026-10-27/role/02-monetyzacja/fix-2026-10-27/ (poza gitem).
Na koniec, do 25 linii: gałąź kopii i commity (SHA → ID), testy przed/po, pliki dowodów, przekazania, co otwarte, kroki właściciela.
Plan E0 zatwierdził właściciel w planie M2 2026-10-27; na STOP nie czekasz. Gdy potrzebna nowa decyzja, opisz opcje i zakończ. Wynik zapisz w /home/user/trening/audit/M1-2026-10-27/role/02-monetyzacja/fix-2026-10-27/wynik.md
