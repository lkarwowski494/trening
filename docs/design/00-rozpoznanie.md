# 00. Rozpoznanie (E0) — redesign M3, rola 04 build (21.10.2026)

Przebieg M3-2026-10-21, gałąź `redesign/trening-2026-10-21`, start od 6212579. STOP E0 zatwierdzony z góry przez właściciela (STOP 1 i 2, docs/18, 21.10.2026), więc ten raport jest zapisem, a praca idzie od razu do E1 (`01-swiat.md`).
Obecny wygląd i zrzuty to materiał AS IS, nie wzorzec. Raportu AS IS roli 04 nie czytano (świeże spojrzenie); wejście przepływów to `docs/design/to-be.md`.

## 1. Środowisko (sprawdzone komendami 21.10.2026)

| Sprawdzenie | Wynik |
|---|---|
| System, Node, git | Linux x86_64 (chmura, `CLAUDE_CODE_REMOTE=true`), Node v22.22.0, gałąź `redesign/trening-2026-10-21` |
| GitHub | push przez git działa (gałąź robocza); `gh` bez ważnego tokenu, więc do PR i API używa się narzędzi MCP albo kroku właściciela |
| Przeglądarka do zrzutów | Playwright 1.56.1, Chromium 1194 w `/opt/pw-browsers`; uruchomienie sprawdzone (instalacja w scratchpadzie, nie w projekcie) |
| Symulator iOS / Xcode | brak (Linux); natywny wygląd tylko przez `e2e-ios.yml` / `nightly.yml` (CLAUDE.md); podgląd lokalny przez Expo web |
| Sieć | działa (iTunes Search API, przepisy IPF, kopia przepisów IWF na pzpc.pl); `iwf.sport` zwraca 403, więc bieżące wydanie przepisów IWF jest nieprzeczytane |
| Widoczność repo | publiczne (ADR-031): nazwy innych firm, cudze zrzuty i ikony tylko w `audit/M3-2026-10-21/role/04-build/konkurencja/` (poza gitem, `.git/info/exclude`) |
| Dokumenty poza repo | Dysk Google, folder „Trening App” (rejestr decyzji, backlog, research konkurencji) — w tym przebiegu decyzje zapisuje się w `docs/18-przekazanie.md` (projekt nie ma `docs/decyzje.md`) |
| Gałęzie z interfejsem | 85 gałęzi zdalnych; materiał ikon zamiast emoji na `origin/m3-wejscie/029-ikony` (e3b0323, WIP: `components/Icon.tsx`, ikony w `Btn`/`Chip`, strażnik bez emoji) — wejście obowiązkowe M1-029, nie scalać |

## 2. Wejścia i ograniczenia z projektu

- **Kontrakt zakresu:** nie ma (DEC-02, docs/18). Funkcje ogranicza BRD (`docs/brd/`) i DEC-03 (granica: bez diety, snu, suplementów, trenera), DEC-04 (funkcje bez dowodu wartości zostają). Każdy ekran wynika z przepływu TO BE albo przepływu bez zmian.
- **Bramka opłacalności:** „wydać” z punktem kontrolnym po 8 tygodniach (`docs/monetyzacja.md`, 21.10.2026). Ekran zakupu: ujawnienia i model stały (0,99 / 6,99 / 14,99 USD, 14 dni) — bez zmian; zakupy dziś wyłączone przełącznikiem `PAYWALL.ENABLED`.
- **Obowiązkowe decyzje (nie zmieniane):** DEC-09 Postępy: wykres i rekordy na górze · DEC-11 własne ikony zamiast emoji · DEC-10 opisy do 200%, liczby z podglądem po przytrzymaniu (Large Content Viewer) · M1-036 tokeny pisma i promieni · DEC-05 zapowiedzi głosowe domyślnie wyłączone · DEC-06 bez paska talerzy i kalkulatora „na każdą stronę” · DEC-28/29 System miar metryczny/imperialny · wyjątek „ton trenera” (wskazówki techniki w formie „ty”).
- **Decyzje wspólne STOP 2:** nowy element firmowy niosący dane (3 kierunki w E2, wybór okiem); odrzucone: pozostanie przy znacznikach dni. Skala tekstu wg DEC-10, bez rozszerzania do AX5.
- **Zasada projektu:** akcje tego samego typu działają w całej aplikacji tak samo (`docs/32-wzorce-interakcji.md`; „Anuluj” po lewej w nagłówku każdego arkusza — `tests/close-button-guard.test.tsx`).
- **Platformy:** iOS, Apple Watch (`targets/watch-app`), Live Activity przerwy (`targets/rest-widget`). Element firmowy i ikona muszą mieć sens na zegarku i na ekranie blokady.
- **Języki:** 35 (DEC-21), najdłuższe etykiety m.in. de, fi, el, lv (problemy z ucinaniem przy 320 pt w `docs/m3-stan.md`); japoński, koreański i chiński tradycyjny idą krojem zastępczym systemu (`lib/theme.ts`).
- **Lista „zachować” (słowa właściciela, 21.10.2026, wiążące):** „Trudno powiedziec, aplikacja jest dobra ale front end chyba troche odstaje od tego czym moglaby byc. Nie ma efektu wow przy zachowaniu prostoty ducha trackera.” Wniosek dla projektu: zachować prostotę i szybkość dziennika (1 stuknięcie na serię z podpowiedzią — to-be.md, „Bez zmian”), dodać jeden mocny, rozpoznawalny akcent.

### Konflikt do zgłoszenia (nie rozstrzygam)
Podłoga studia „tekst skaluje się do AX5 (treść 17→53 pt, ok. 310%)” jest wyższa niż DEC-10 („opisy do 200%”, liczby w kolumnach 130% + podgląd po przytrzymaniu; `TEXT_SCALE_MAX = 2`, `NUM_SCALE_MAX = 1.3` w `lib/theme.ts`). STOP 2 potwierdził DEC-10 bez rozszerzania do AX5. Konsekwencja dla E2–E3: makiety renderuję w wariancie „AX5” skryptu studia, ale oceniam je według DEC-10 (opisy do 200%, liczby z podglądem); różnicę pokazuję właścicielowi na STOP E1 jako pytanie.

## 3. Przepływy (z `docs/design/to-be.md`, katalog: `docs/37-katalog-przeplywow.md`)

Kto: P-1, osoba trenująca siłowo z iPhone'em (i opcjonalnie zegarkiem) — `docs/brd/odkrywanie.md`. Częstotliwość: szacunek z opisu produktu, nie z pomiaru `[DO USTALENIA]`.

| Przepływ | Cel | Kroki (TO BE) | Częstotliwość |
|---|---|---|---|
| Trening z podpowiedziami (P01, ZM-01/02) | zapisać serie bez myślenia | Start → karta „teraz” z ciężarem i powtórzeniami → „Seria zrobiona” → przerwa → kolejna seria | najczęstszy: kilkanaście–kilkadziesiąt razy na trening, 2–5 treningów w tygodniu |
| Trening bez podpowiedzi (P03, ZM-01) | wpisać wynik pierwszy raz | liczba na karcie → klawiatura albo ± → „Seria zrobiona”; brak wartości przenosi do pola | na początku i przy nowych ćwiczeniach |
| Seria na czas (P09, ZM-05) | odmierzyć serię (np. deska) | start pomiaru → „Zakończ serię” → „Seria zrobiona” | kilka razy w tygodniu, gdy w planie |
| Generator (P02, ZM-03) | dostać szablony i plan | parametry → „Zapisz szablony i plan” → Planowanie z jednym zdaniem potwierdzenia | raz na start, potem rzadko |
| Postępy (P07, ZM-06, DEC-09) | zobaczyć, co się zmienia | wykres i rekordy na górze; pusty stan z „Zacznij trening”; chipy tylko ćwiczeń z danymi | po treningu, raz w tygodniu |
| Usuwanie poza treningiem (P08, ZM-04) | usunąć sesję, szablon, miejsce | „Usuń {obiekt}” na dole szczegółów albo „Edytuj” na liście; gest zostaje | rzadko |
| Dźwięk i wibracje (P11, ZM-07) | ustawić sygnały | dwa przełączniki w Ustawieniach; krótka wibracja przy ✓ | raz |
| Bez zmian (P04–P06, P10, P12–P15) | m.in. plan tygodnia i kalendarz, szablony i biblioteka, historia, miejsca i sprzęt, ustawienia, kopia i eksport (grupy PL, SZ, HI, US, DA w docs/37) | jak dziś; dostaną nowy wygląd, nie nowy przebieg | różnie |

Otwarte z przepływów: ZM-03 (usunięcie przełącznika trybu w generatorze) czeka na potwierdzenie roli 03 przed E3; reguła kroku ± i to, czy seria bez wyniku jest serią — sprawdza badacz.

## 4. Kontekst użycia

| Przepływ | Miejsce i światło | Ręce | Oczy | Spojrzenie / sesja | Hałas |
|---|---|---|---|---|---|
| Trening (P01, P03, P09) | siłownia (światło sztuczne, często silne z góry), dom, czasem plener w słońcu | **w trakcie serii zajęte** (gryf, hantle); między seriami wolne, ale spocone, z magnezją, czasem w rękawiczkach — mniejsza celność dotyku | w trakcie serii na ruchu; telefon leży na ławce lub podłodze 1–2 m dalej; między seriami wolne | 1–3 s spojrzenia z odległości; sesja 45–90 min z ekranem włączanym kilkanaście–kilkadziesiąt razy `[DO USTALENIA]` (szacunek, bez pomiaru) | głośna muzyka i stukot sprzętu: dźwięk zawodny, haptyka i duży obraz pewniejsze; zegarek i ekran blokady (Live Activity) przejmują część spojrzeń |
| Generator, plan, szablony | dom, kanapa, przed treningiem | wolne | wolne | minuty, spokojnie | brak znaczenia |
| Postępy, historia | dom albo po treningu na siłowni | wolne | wolne | 10–60 s | brak znaczenia |
| Ustawienia, kopia | dom | wolne | wolne | rzadko, krótko | brak znaczenia |

**Wniosek dla koordynatora:** E0 wykazuje kontekst **rąk zajętych w trakcie serii i patrzenia z odległości** w głównym przepływie (trening). Oczy nie są zajęte przez cały czas jak w jeździe — zajęte w trakcie serii, wolne w przerwie. Proponuję dołożyć moduł `kontekst-oczy-zajete` do E2, zawężony do karty „teraz”, przerwy, ekranu blokady i zegarka.

## 5. Pamięć portfolio — czego ta aplikacja nie powtarza bez zapisanej decyzji

- **Obecny wygląd Treningu („Tuleja”, `lib/theme.ts`, docs/16):** papier `#F4F3EF`, tusz `#15171A`, akcent `#1F5FD1` (niebieski talerza 20 kg), paleta talerzy IWF jako paleta marki, IBM Plex Sans/Mono, ikona — koniec sztangi z talerzami, stosy talerzy tygodnia i znaczniki dni (odrzucone na STOP 2), intro z talerzami wjeżdżającymi na gryf. Pasek talerzy usunięty (DEC-06).
- **Organizer („Wstążki”):** piasek + terakota, Bricolage Grotesque + Atkinson Hyperlegible Next, linie i wstążki.
- **NaviStories („Drogowskaz”):** brąz + biel + sylwetka obiektu, Jost z ss01, kod kształtu linii (pełny / kreskowany / kontur).
- **Obserwacja ze skanu (E1):** niebieski akcent, sztanga na ikonie i tabela serii z ✓ to też klisze kategorii, więc obecny wygląd dzieli je z popularnymi dziennikami treningowymi.

## 6. Ekran kluczowy

**Ekran treningu z kartą „teraz”, w dwóch stanach obok siebie:** (a) „seria” — ćwiczenie, ciężar × powtórzenia z ± (ZM-01), „Seria zrobiona”, nagłówek w jednej linii (ZM-02); (b) „przerwa” — odliczanie, następna seria, ±15 s / Pomiń. Powód: to najczęstsza czynność (P01), tu działa kontekst spojrzenia z odległości, tu element firmowy ma najwięcej danych (seria, ćwiczenie, tydzień), a lista „zachować” mówi o „duchu trackera”. Te same dane trafiają na zegarek i ekran blokady, więc kierunek musi przenosić się do małego formatu.

## 7. Plan i szacunek czasu

| Etap | Praca agenta | Oczekiwanie | Czas właściciela |
|---|---|---|---|
| E0 (ten plik) | ok. 0,5 h | — | 0 (zatwierdzony z góry) |
| E1 świat dziedziny (`01-swiat.md`) | ok. 1,5 h | — | ok. 10–15 min: przeczytać STOP E1, odpowiedzieć na pytania |
| E2 trzy kierunki, karty kontrolne, makiety, ikony, strona porównania | ok. 4–6 h | brak (render lokalny) | ok. 20–30 min: wybór okiem; po wyborze ok. 10 min: wybór kroju |
| E3 system, tokeny, kontrast, ikona do plików, 3–5 ekranów w wariantach | ok. 6–10 h | brak; natywny podgląd dopiero w E2E po wdrożeniu (kolejka macOS) | ok. 20 min: ikona i ekrany |
| E4 przekazanie | ok. 1 h | — | wpis do pamięci portfolio (repo `prompts`) |
