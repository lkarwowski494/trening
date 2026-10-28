# BRD Trening — wymagania uzupełnione 2026-10-28
Funkcje, które działały w kodzie bez wymagania BR (audyt 1.0 z 27.10.2026: 01-odkrywanie-004, 03-zakres-003; naprawa M1-audytor-generalny-022). Odtworzone z kodu, testów, katalogu przepływów (`tests/przeplywy.json`) i decyzji w `docs/18-przekazanie.md`, bez ocen wartości (OP-01). Osobny plik, bo `wymagania.md` przekracza ok. 20 KB; moduły BR te same. Liczby w kryteriach pochodzą z decyzji (D-nnn, indeks w `README.md`) albo z reguł RD (`reguly.md`).

## Prace i przepływy dopisane

### PR-10: Pomoc i kontakt
- P-1, J-06. Kroki: na starcie czyta „Pierwsze kroki”; otwiera Przewodnik; w Więcej → O aplikacji pisze do autora albo prosi o nową funkcję. Kontekst: poza treningiem, telefon w ręku.
### PR-11: Podsumowanie po treningu
- P-1, J-01, J-03. Kroki: kończy trening; ogląda podsumowanie sesji (rekordy, zmiany względem szablonu); reaguje na najwyżej jedno okno albo link. Kontekst: siłownia lub dom, zaraz po treningu.
### PR-12: Historia: dopisanie i poprawienie treningu
- P-1, J-01, J-04. Kroki: dopisuje trening, którego nie zapisał na żywo, z datą z przeszłości; poprawia zapisaną sesję. Kontekst: poza treningiem.

## Wymagania funkcjonalne

### BR-HIS-002: Dopisanie treningu wstecz
- Przepływ: PR-12
- Dowód potrzeby: J-04; decyzja właściciela 2026-10-11 („Dopisz trening wstecz” jedna nazwa, docs/18); M5 S1 (D-101: trening wstecz poza limitem)
- Ekrany: `app/history/add.tsx`
- Test: `tests/edit-history.test.tsx`, `.maestro/05-edycja-historii.yaml`
- Kryteria akceptacji:
  - Scenariusz: Trening z wczoraj z szablonu
    - Zakładając, że użytkownik ma szablon
    - Gdy w Planie wybiera „Dopisz trening wstecz”, termin „Dzień wcześniej”, szablon, wpisuje serie i stuka „Zapisz sesję”
    - Wtedy sesja ma datę wczorajszą i widać ją w kalendarzu
  - Scenariusz: Miniony dzień z panelu dnia
    - Zakładając, że w kalendarzu jest miniony dzień
    - Gdy użytkownik wybiera ten dzień i „Dopisz trening wstecz”
    - Wtedy sesja dostaje datę tego dnia i szablon z planu
  - Scenariusz: Trening wstecz nie zużywa limitu
    - Zakładając, że zakupy są włączone, a darmowe dni treningowe są wykorzystane
    - Gdy użytkownik dopisuje trening wstecz, także z dzisiejszą datą
    - Wtedy zapis się udaje i nie zużywa dnia treningowego (BR-ZAK-002)

### BR-HIS-003: Edycja zapisanej sesji
- Przepływ: PR-12
- Dowód potrzeby: J-04; docs/12-edycja-treningow.md
- Ekrany: `app/history/edit/[id].tsx`
- Test: `tests/edit-history.test.tsx`, `tests/backlog-0.10.1-dane-ui.test.tsx`, `.maestro/05-edycja-historii.yaml`
- Kryteria akceptacji:
  - Scenariusz: Zmiana nazwy i serii
    - Zakładając, że użytkownik otworzył zapisaną sesję
    - Gdy stuka „Edytuj sesję”, zmienia nazwę lub serie, stuka „Zapisz sesję” i potwierdza „Zapisz” w oknie „Zapisać zmiany?”
    - Wtedy zmiany widać na ekranie sesji i w statystykach
  - Scenariusz: Wyjście bez zapisu
    - Zakładając, że użytkownik zmienił sesję w edytorze
    - Gdy wychodzi bez zapisu i potwierdza odrzucenie zmian
    - Wtedy okno mówi „Sesja w historii zostanie bez zmian.”, a zapisana sesja zostaje bez zmian
  - Scenariusz: Nieudany zapis
    - Zakładając, że zapis danych się nie udaje (np. brak miejsca w telefonie)
    - Gdy użytkownik zapisuje sesję
    - Wtedy widzi okno „Nie udało się zapisać danych” z „Spróbuj ponownie” (BR-DAN-003)

### BR-DAN-006: Wyczyszczenie wszystkich danych z kopią bezpieczeństwa
- Przepływ: PR-06
- Dowód potrzeby: J-04; kod `app/more/settings.tsx` (sekcja „Dane w telefonie”), `lib/backup.ts` (`safetyBackup('reset')`)
- Test: `tests/audit-r83.test.tsx`, `tests/audit-1-0-a2-reset.test.ts`, `.maestro/32-regularny-uzytkownik.yaml`
- Kryteria akceptacji:
  - Scenariusz: Anulowanie zostawia dane
    - Zakładając, że użytkownik ma historię
    - Gdy stuka „Wyczyść wszystkie dane”, a w oknie „Wyczyścić wszystkie dane?” wybiera „Anuluj”
    - Wtedy dane zostają bez zmian
  - Scenariusz: Wyczyszczenie po kopii
    - Zakładając, że użytkownik ma historię, szablony i plan
    - Gdy potwierdza „Wyczyść”
    - Wtedy najpierw w Plikach (aplikacja → Backup) powstaje kopia obecnych danych, którą da się zaimportować, a potem aplikacja wraca do stanu jak po instalacji z kartą „Pierwsze kroki”
  - Scenariusz: Nieudana kopia przerywa czyszczenie
    - Zakładając, że zapis kopii bezpieczeństwa się nie udaje
    - Gdy użytkownik potwierdza „Wyczyść”
    - Wtedy dane nie są czyszczone, a okno „Dane nie zostały wyczyszczone” podaje powód
  - Scenariusz: Trening w toku
    - Zakładając, że trwa trening
    - Gdy użytkownik otwiera okno czyszczenia
    - Wtedy okno mówi, że trening w toku też zostanie usunięty

### BR-DAN-007: Import historii z pliku CSV
- Przepływ: PR-06
- Dowód potrzeby: J-04; D-103 (rozszerzony import, decyzja właściciela 2026-10-25); decyzje 2026-10-11 (import CSV przed App Store, docs/18)
- Ekrany: `app/more/import.tsx`
- Test: `tests/csv-import-logic.test.ts`, `tests/csv-import-ui.test.tsx`, `tests/monetyzacja-csv.test.ts`
- Kryteria akceptacji:
  - Scenariusz: Podgląd i dopisanie
    - Zakładając, że użytkownik ma plik CSV z historią z popularnego dziennika treningowego
    - Gdy w Kopii zapasowej wybiera „Importuj historię z pliku CSV”, wskazuje plik i po podglądzie importuje
    - Wtedy treningi są dopisane, obecne dane zostają, a treningi już obecne (ten sam czas startu) są pominięte jako duplikaty z podaną liczbą
  - Scenariusz: Kopia bezpieczeństwa przed importem
    - Zakładając, że użytkownik ma dane
    - Gdy rozpoczyna import CSV
    - Wtedy przed zapisem powstaje kopia bezpieczeństwa; gdy kopia się nie udaje, import jest przerwany, a dane bez zmian
  - Scenariusz: Ćwiczenia spoza biblioteki
    - Zakładając, że plik zawiera ćwiczenie, którego nie ma w bibliotece
    - Gdy użytkownik importuje plik
    - Wtedy ćwiczenie powstaje jako własne ćwiczenie użytkownika
  - Scenariusz: Import nie zużywa dni treningowych
    - Zakładając, że zakupy są włączone
    - Gdy użytkownik importuje treningi z bieżącego miesiąca
    - Wtedy licznik darmowych dni treningowych się nie zmienia (treningi z importu nie są treningami na żywo)
  - Scenariusz: Plik obcy albo uszkodzony
    - Zakładając, że wskazany plik nie jest historią w rozpoznawanym układzie
    - Gdy użytkownik próbuje go zaimportować
    - Wtedy widzi okno „Nie udało się zaimportować pliku” z powodem, a dane zostają bez zmian

### BR-DAN-008: Eksport historii do CSV
- Przepływ: PR-06
- Dowód potrzeby: J-04; README.md; decyzja właściciela 2026-10-23 (kolumny jednostek przy miarach imperialnych, docs/18); kod `lib/backup.ts` (`buildCsv`, `exportCsv`)
- Test: `tests/csv-jednostka-eksportu.test.ts`, `tests/audit-0.10-data-ui.test.tsx`
- Kryteria akceptacji:
  - Scenariusz: Eksport w systemie metrycznym
    - Zakładając, że użytkownik ma historię i system metryczny
    - Gdy stuka „Eksportuj historię do CSV”
    - Wtedy arkusz udostępniania dostaje plik CSV z nagłówkiem zgodnym z popularnymi dziennikami, z ciężarem w kg
  - Scenariusz: Eksport w systemie imperialnym
    - Zakładając, że użytkownik ma system imperialny
    - Gdy eksportuje historię do CSV
    - Wtedy plik ma ciężar w lb oraz na końcu kolumny `Weight Unit` i `Distance Unit` z jednostką w każdym wierszu, a import tego pliku rozpoznaje jednostkę

### BR-DAN-009: Automatyczna kopia po każdym treningu
- Przepływ: PR-06
- Dowód potrzeby: J-04; kod `lib/backup.ts` (`autoBackup`, `AUTO_KEEP`), ustawienie „Automatyczna kopia po każdym treningu” (domyślnie włączone, `lib/seed.ts`)
- Test: `tests/audit-m1-008-kopia-ui.test.tsx`, `tests/audit-m1-041-reminder-files.test.tsx`, `.maestro/35-ustawienia-dostepnosc.yaml`, `.maestro/42-kopia-przywrocenie.yaml`
- Kryteria akceptacji:
  - Scenariusz: Kopia po zapisaniu treningu
    - Zakładając, że ustawienie jest włączone
    - Gdy użytkownik kończy trening albo zapisuje edycję historii
    - Wtedy w Plikach (aplikacja → Backup) powstaje plik kopii JSON, a najstarsze kopie automatyczne ponad `AUTO_KEEP` znikają; inne pliki w folderze zostają
  - Scenariusz: Przywrócenie z kopii automatycznej
    - Zakładając, że dane wyczyszczono, a w folderze Backup jest kopia automatyczna
    - Gdy użytkownik importuje ją w Kopii zapasowej
    - Wtedy historia, szablony, plan i ustawienia wracają
  - Scenariusz: Nieudany zapis kopii
    - Zakładając, że zapis kopii automatycznej się nie udaje
    - Gdy kończy się trening
    - Wtedy trening jest zapisany, a błąd kopii niczego nie przerywa

### BR-PLN-004: Przypomnienie rano w dniu treningu z planu
- Przepływ: PR-03
- Dowód potrzeby: J-02; D-111 (decyzja właściciela 2026-10-08: jedno lokalne powiadomienie rano, godzina 8:00); kod `lib/planReminder.ts`
- Test: `tests/plan-reminder.test.tsx`, `.maestro/38-pomoc-powiadomienia.yaml`
- Kryteria akceptacji:
  - Scenariusz: Dzień z treningiem w planie
    - Zakładając, że przypomnienie jest włączone, a w planie jest dzień z niepustym szablonem
    - Gdy nadchodzi ten dzień
    - Wtedy o godzinie 8:00 (D-111) przychodzi jedno powiadomienie z nazwą treningu (i miejscem, gdy plan je ma)
  - Scenariusz: Trening już zrobiony albo trwa
    - Zakładając, że zaplanowany trening dnia jest zrobiony, trwa albo szablon dnia jest pusty
    - Gdy aplikacja planuje przypomnienia
    - Wtedy na ten dzień przypomnienia nie ma
  - Scenariusz: Wyłączenie i brak zgody
    - Zakładając, że użytkownik wyłącza „Przypomnienie o treningu z planu” albo nie dał zgody na powiadomienia
    - Gdy otwiera Ustawienia
    - Wtedy przełącznik zapisuje wybór, a przy braku zgody widać informację i „Otwórz Ustawienia iOS”

### BR-PLN-005: Przesunięcie i pominięcie dnia planu; trening „zrobiony wcześniej”
- Przepływ: PR-03 · Reguła: RD-13
- Dowód potrzeby: J-02; D-112 (decyzja właściciela 2026-10-11, wariant A); kod `lib/plan.ts` (`shiftPlan`, `moveOnly`, `markDoneEarly`)
- Test: `tests/plan-calendar.test.ts`, `tests/plan-wczesniej.test.ts`, `tests/plan-wczesniej-ui.test.tsx`, `.maestro/13-kalendarz-plan.yaml`
- Kryteria akceptacji:
  - Scenariusz: Przesunięcie planu o dzień
    - Zakładając, że w planie jest dzisiejszy trening
    - Gdy użytkownik w panelu dnia wybiera „Przesuń albo pomiń” i „Przesuń plan o 1 dzień”
    - Wtedy dni planu przesuwają się, a „Przywróć z planu” przywraca stan sprzed zmiany
  - Scenariusz: Trening zrobiony wcześniej
    - Zakładając, że użytkownik zrobił trening szablonem X w dniu, w którym planu z X nie ma, a najbliższy dzień treningowy w planie ma X
    - Gdy kończy trening
    - Wtedy tamten dzień jest oznaczony „zrobiony wcześniej” (wolny z ✓), trening liczy się do celu swojego tygodnia, reszta planu bez zmian, a „Cofnij” w panelu dnia przywraca dzień (D-112)

### BR-ZAK-004: Okno „Uczciwe zasady” po pierwszym treningu na żywo
- Przepływ: PR-11
- Dowód potrzeby: ZP-06; D-103 (decyzja właściciela 2026-10-25, teksty zatwierdzone 2026-10-25); docs/monetyzacja.md; kod `components/FairRulesSheet.tsx`, `lib/fairrules.ts`
- Test: `tests/monetyzacja-ui.test.tsx`, `.maestro/56-uczciwe-zasady.yaml`, `tests/m1-046-monetyzacja-stany.test.tsx`
- Kryteria akceptacji:
  - Scenariusz: Pierwszy trening na żywo w stanie darmowym
    - Zakładając, że zakupy są włączone, użytkownik jest na darmowym poziomie, a okna jeszcze nie widział
    - Gdy kończy trening na żywo i otwiera się podsumowanie
    - Wtedy pokazuje się okno z trzema zdaniami o modelu (wszystkie funkcje od pierwszego dnia; darmowe dni w miesiącu; Pro zdejmuje limit), przyciskiem „Super, trenuję dalej!” i „Zobacz plany Pro ›”, bez listy planów i kwot
  - Scenariusz: Tylko raz
    - Zakładając, że użytkownik zamknął okno dowolnym przyciskiem, także „Anuluj”
    - Gdy kończy kolejny trening
    - Wtedy okno się nie pokazuje
  - Scenariusz: Pełna wersja, stan niepewny i trening wstecz
    - Zakładając, że użytkownik ma Pro, stan dostępu jest niepewny bez zapamiętanego wyniku albo zapisano trening wstecz
    - Gdy otwiera się podsumowanie
    - Wtedy okna nie ma
  - Scenariusz: Były subskrybent (M1-audytor-generalny-046)
    - Zakładając, że użytkownik miał pełny dostęp, który się skończył (lista sklepu albo zapamiętany koniec dostępu)
    - Gdy kończy kolejny trening na żywo
    - Wtedy okna „Pierwszy trening za Tobą!” nie ma
  - Scenariusz: Przejście do planów
    - Zakładając, że okno jest otwarte
    - Gdy użytkownik stuka „Zobacz plany Pro ›”
    - Wtedy okno się zamyka, a otwiera się ekran zakupu

### BR-ZAK-005: Karta po imporcie historii w stanie darmowym
- Przepływ: PR-06
- Dowód potrzeby: ZP-06; D-103; kod `components/ImportProCard.tsx`
- Test: `tests/monetyzacja-ui.test.tsx`
- Kryteria akceptacji:
  - Scenariusz: Udany import w stanie darmowym
    - Zakładając, że zakupy są włączone, a użytkownik jest na darmowym poziomie
    - Gdy import CSV się udaje
    - Wtedy pod komunikatem sukcesu jest karta „Historia jest już w telefonie” z przyciskiem „Zobacz plany Pro ›”, który otwiera ekran zakupu
  - Scenariusz: Pro albo zakupy wyłączone
    - Zakładając, że użytkownik ma Pro albo zakupy są wyłączone
    - Gdy import się udaje
    - Wtedy karty nie ma

### BR-ZAK-006: Przywracanie zakupów i realizacja kodu
- Przepływ: PR-08
- Dowód potrzeby: ZP-06; OG-04; kod `app/paywall.tsx` („Przywróć zakupy”, „Zrealizuj kod”), `lib/access.ts` (`ALWAYS_AVAILABLE`)
- Test: `tests/subscription-ui.test.tsx`, `tests/store-adapter.test.ts`, `.maestro/21-subskrypcja.yaml`, `tests/audit-m1-2026-10-27-016-arkusz-subskrypcji.test.tsx`
- Kryteria akceptacji:
  - Scenariusz: Przywrócenie zakupu
    - Zakładając, że konto Apple ma zakup aplikacji
    - Gdy użytkownik na ekranie zakupu stuka „Przywróć zakupy”
    - Wtedy dostęp odpowiada zakupowi, a ekran pokazuje „Przywrócono zakupy.”
  - Scenariusz: Brak zakupów albo błąd
    - Zakładając, że konto nie ma zakupów albo sklep nie odpowiada
    - Gdy użytkownik stuka „Przywróć zakupy”
    - Wtedy widzi „Nie znaleziono zakupów dla tego konta Apple.” albo prośbę o sprawdzenie połączenia, a stan dostępu się nie zmienia
  - Scenariusz: Kod ofertowy
    - Zakładając, że użytkownik ma kod od autora
    - Gdy stuka „Zrealizuj kod”
    - Wtedy otwiera się systemowe okno realizacji kodu, a po jego zamknięciu aplikacja odświeża dostęp (kod daje Pro do daty pokazanej na ekranie)
  - Scenariusz: Zawsze dostępne
    - Zakładając, że darmowe dni są wykorzystane
    - Gdy użytkownik otwiera ekran zakupu
    - Wtedy „Przywróć zakupy” i „Zrealizuj kod” działają bez względu na limit
  - Scenariusz: Zarządzanie subskrypcją (M1-audytor-generalny-016, 047)
    - Zakładając, że użytkownik ma aktywną subskrypcję
    - Gdy na ekranie zakupu stuka „Zarządzaj subskrypcją” i zamyka systemowy arkusz subskrypcji
    - Wtedy aplikacja odświeża dostęp — anulowanie albo zmiana planu w arkuszu widać od razu, bez ponownego uruchomienia

### BR-ZAK-007: Podsumowanie treningu: najwyżej jedno okno albo link
- Przepływ: PR-11
- Dowód potrzeby: naprawa M1-audytor-generalny-018 (audyt 1.0, 27.10.2026; 11-wzrost-001): po imporcie historii pierwszy trening na żywo z rekordem dawał naraz okno „Uczciwe zasady” i prośbę o ocenę; kod `lib/review-run.ts` (`onSummaryShown`)
- Test: `tests/audit-m1-2026-10-27-018-jedno-okno.test.tsx`
- Kryteria akceptacji:
  - Scenariusz: Okno zasad wyklucza resztę
    - Zakładając, że użytkownik zaimportował historię, jest na darmowym poziomie i kończy pierwszy trening na żywo z rekordem
    - Gdy otwiera się podsumowanie
    - Wtedy pokazuje się tylko okno „Uczciwe zasady”, bez prośby o ocenę i bez linku „Poproś o funkcję”
  - Scenariusz: Niezmiennik
    - Zakładając, że w historii jest dowolna liczba treningów z importu
    - Gdy otwiera się podsumowanie świeżo zakończonego treningu
    - Wtedy pokazuje się najwyżej jedno z: okno „Uczciwe zasady”, systemowa prośba o ocenę, link „Poproś o funkcję”
  - Scenariusz: Bramka oceny liczy tylko treningi na żywo
    - Zakładając, że historia ma wiele treningów z importu i wstecz, a treningów na żywo jest mniej niż próg z BR-KON-001
    - Gdy użytkownik kończy trening na żywo z rekordem
    - Wtedy prośby o ocenę nie ma

### BR-KON-001: Prośba o ocenę w App Store
- Przepływ: PR-11
- Dowód potrzeby: D-104 (decyzje właściciela 2026-10-11: po N-tym treningu z rekordem, odstęp 14 dni, najwyżej raz na wersję; 2026-10-22: N = 3); docs/26-prosba-o-ocene.md; OG-10; kod `lib/review.ts` (`REVIEW`), `lib/review-run.ts`
- Test: `tests/review.test.ts`, `tests/review-run.test.tsx`
- Kryteria akceptacji:
  - Scenariusz: Trzeci trening na żywo z rekordem
    - Zakładając, że użytkownik ukończył 3 treningi na żywo (D-104), ostatni z nowym rekordem, i jeszcze nie był proszony
    - Gdy otwiera się podsumowanie
    - Wtedy po krótkim opóźnieniu aplikacja woła systemową prośbę o ocenę (system może jej nie pokazać)
  - Scenariusz: Bez rekordu albo za mało treningów
    - Zakładając, że ostatni trening nie ma rekordu albo treningów na żywo jest mniej niż 3
    - Gdy otwiera się podsumowanie
    - Wtedy prośby nie ma
  - Scenariusz: Odstęp i wersja
    - Zakładając, że prośba padła w tej wersji aplikacji albo mniej niż 14 dni temu (D-104), albo data poprzedniej prośby jest w przyszłości
    - Gdy użytkownik kończy kolejny trening z rekordem
    - Wtedy prośby nie ma
  - Scenariusz: Nigdy w trakcie ani przy błędzie
    - Zakładając, że trwa trening, kopia, import albo eksport, ostatnia operacja się nie udała albo start jest zablokowany limitem
    - Gdy aplikacja sprawdza bramkę
    - Wtedy prośby nie ma

### BR-KON-002: „Napisz do nas”
- Przepływ: PR-10
- Dowód potrzeby: D-106 (decyzja właściciela 2026-10-13, wariant A); kod `app/more/about.tsx`, `lib/support.ts`
- Test: `tests/support-mail.test.tsx`, `tests/audit-m1-2026-10-27-032-kod-diagnostyczny.test.tsx`
- Kryteria akceptacji:
  - Scenariusz: Wiadomość z poczty użytkownika
    - Zakładając, że telefon ma aplikację poczty
    - Gdy użytkownik w Więcej → O aplikacji stuka „Napisz do nas”
    - Wtedy otwiera się nowa wiadomość na adres wsparcia z tematem i stopką techniczną (wersja z buildem, iOS, język); aplikacja niczego nie wysyła sama
  - Scenariusz: Brak poczty
    - Zakładając, że poczty nie da się otworzyć
    - Gdy użytkownik stuka „Napisz do nas”
    - Wtedy okno podaje adres wsparcia
  - Scenariusz: Z ekranu błędu startu (decyzja 7a, 28.10.2026; M1-audytor-generalny-047)
    - Zakładając, że aplikacja nie otworzyła danych i pokazuje ekran błędu startu
    - Gdy użytkownik stuka „Napisz do nas”
    - Wtedy wiadomość ma kod diagnostyczny etapu startu pod stopką techniczną, a nie zawiera treści błędu ani danych treningowych; treść błędu zostaje tylko na ekranie

### BR-KON-003: „Poproś o nową funkcję” i link na podsumowaniu
- Przepływ: PR-10 · PR-11
- Dowód potrzeby: D-105 (decyzja właściciela 2026-10-14: przycisk obok „Napisz do nas”, link co N-ty trening, N = 10 jako liczba produktowa, nigdy razem z prośbą o ocenę); kod `app/more/about.tsx`, `lib/review.ts` (`IDEA`)
- Test: `tests/idea-request.test.tsx`, `.maestro/15-masa-licencje.yaml`
- Kryteria akceptacji:
  - Scenariusz: Przycisk w O aplikacji
    - Zakładając, że użytkownik jest w Więcej → O aplikacji
    - Gdy stuka „Poproś o nową funkcję”
    - Wtedy otwiera się wiadomość do wsparcia z tematem „Pomysł: ” i krótkim szablonem, tą samą drogą co „Napisz do nas”
  - Scenariusz: Link co 10. trening (D-105)
    - Zakładając, że od ostatniego pokazania linku minęło 10 ukończonych treningów, a na tym podsumowaniu nie ma prośby o ocenę ani okna „Uczciwe zasady”
    - Gdy otwiera się podsumowanie
    - Wtedy jest dyskretny link „Czego Ci brakuje? Poproś o funkcję” z „✕”; „✕” zamyka go bez zmian w danych
  - Scenariusz: Prośba o ocenę na tym samym ekranie
    - Zakładając, że na tym podsumowaniu wypada prośba o ocenę
    - Gdy otwiera się podsumowanie
    - Wtedy linku nie ma; pojawia się na następnym treningu

### BR-KON-004: O aplikacji i licencje open source
- Przepływ: PR-10
- Dowód potrzeby: README.md; kod `app/more/about.tsx`
- Ekrany: `app/more/licenses.tsx`
- Test: `tests/licenses-native.test.tsx`, `.maestro/15-masa-licencje.yaml`
- Kryteria akceptacji:
  - Scenariusz: Lista licencji
    - Zakładając, że użytkownik jest w Więcej → O aplikacji
    - Gdy stuka „Licencje open source”
    - Wtedy widzi listę pakietów i bibliotek natywnych z licencjami; ekran O aplikacji pokazuje wersję aplikacji

### BR-PST-006: Masa ciała z datą
- Przepływ: PR-05 · Reguła: RD-12
- Dowód potrzeby: J-03; D-118 (decyzje właściciela 2026-10-08: masa ciała z datą do e1RM ćwiczeń z masą ciała; 2026-10-11: sekcja w Postępach); docs/research/masa-ciala-e1rm-2026-10.md
- Ekrany: `app/more/bodymass.tsx`
- Test: `tests/audit-0.10-data-ui.test.tsx`, `tests/m3-p5-delete.test.tsx`, `.maestro/15-masa-licencje.yaml`
- Kryteria akceptacji:
  - Scenariusz: Pomiar z datą
    - Zakładając, że użytkownik jest w Postępach
    - Gdy otwiera „Masa ciała — pomiary”, wpisuje masę i stuka „Zapisz pomiar”
    - Wtedy pomiar jest na liście i w sekcji „Masa ciała” w Postępach
  - Scenariusz: Masa poza zakresem
    - Zakładając, że użytkownik wpisuje masę 0 albo większą niż górna granica wpisu (`BODY_MASS_MAX`, tylko walidacja)
    - Gdy stuka „Zapisz pomiar”
    - Wtedy okno mówi, że masa ciała musi być większa od zera i nie większa niż granica, a pomiar nie jest zapisany
  - Scenariusz: Ten sam dzień
    - Zakładając, że w danym dniu jest już pomiar
    - Gdy użytkownik zapisuje drugi pomiar z tą samą datą
    - Wtedy nowy pomiar zastępuje poprzedni
  - Scenariusz: Usunięcie pomiaru
    - Zakładając, że lista ma pomiar
    - Gdy użytkownik usuwa go gestem albo przez „Edytuj” i przycisk usunięcia
    - Wtedy pojawia się okno [Anuluj, Usuń] (BR-DAN-004)

### BR-PST-007: Strażnik progresji
- Przepływ: PR-05 · Reguła: RD-15, RD-11
- Dowód potrzeby: J-03; D-113 (specyfikacja zatwierdzona przez właściciela 2026-10-14, nazwa widoczna w aplikacji; doprecyzowanie 2026-10-19: ciężar roboczy z 0 kg do ciężaru = progres); kod `lib/guard.ts`
- Test: `tests/guard.test.ts`, `tests/guard-ui.test.tsx`, `.maestro/52-straznik-progresji.yaml`
- Kryteria akceptacji:
  - Scenariusz: Sylwetka na ekranie Trening
    - Zakładając, że użytkownik zrobił trening w tym tygodniu, a w poprzednim tygodniu trenował te same ćwiczenia
    - Gdy otwiera „Ten tydzień” na ekranie Trening
    - Wtedy sylwetka pokazuje kierunek zmiany każdej partii (więcej, tyle samo, mniej, bez porównania, nowe) z legendą, a zdanie wymienia partie poniżej celu serii nawet po całym planie tygodnia
  - Scenariusz: Szczegóły w Postępach
    - Zakładając, że użytkownik stuka „Szczegóły w Postępach”
    - Gdy otwiera się sekcja „Strażnik progresji”
    - Wtedy partie są od problemów, a stuknięcie partii rozwija wykonane i zaplanowane serie z dniami oraz porównywane ćwiczenia
  - Scenariusz: Tydzień deloadu
    - Zakładając, że bieżący tydzień jest oznaczony jako deload
    - Gdy użytkownik ogląda „Ten tydzień”
    - Wtedy widzi „Tydzień deloadu — bez porównania”, bez legendy i bez zdań o brakach
  - Scenariusz: Pierwszy tydzień
    - Zakładając, że w poprzednim tygodniu nie było treningu
    - Gdy użytkownik ogląda sylwetkę
    - Wtedy trenowane partie są „nowe”, bez zdania o spadkach

### BR-MJS-003: Gumy oporowe w miejscu
- Przepływ: PR-09
- Dowód potrzeby: J-05; docs/10-miejsca-i-sprzet.md; decyzja właściciela 2026-10-06 (scenariusz E2E gum, docs/18)
- Ekrany: `app/more/bands.tsx`
- Test: `tests/band-exercises.test.tsx`, `.maestro/10-gumy.yaml`
- Kryteria akceptacji:
  - Scenariusz: Poziomy i kolor
    - Zakładając, że miejsce ma gumy
    - Gdy użytkownik w ekranie „Gumy” ustawia poziomy i kolor
    - Wtedy ustawienia są zapisane, a w treningu przycisk gumy przechodzi tylko przez poziomy tego miejsca i guma zapisuje się w sesji
  - Scenariusz: Usunięcie gumy
    - Zakładając, że lista ma gumę
    - Gdy użytkownik usuwa ją gestem albo przez „Edytuj” i przycisk usunięcia
    - Wtedy okno [Anuluj, Usuń] mówi o skutkach w historii (BR-DAN-004)

### BR-TRN-012: Zmiana kolejności ćwiczeń
- Przepływ: PR-01
- Dowód potrzeby: J-01; README.md; katalog przepływów TR-14
- Ekrany: `app/reorder.tsx`
- Test: `tests/m3-p2-start.test.tsx`, `.maestro/03-kolejnosc.yaml`
- Kryteria akceptacji:
  - Scenariusz: Kolejność w trakcie treningu
    - Zakładając, że trwa trening z kilkoma ćwiczeniami i wpisanymi wartościami
    - Gdy użytkownik wybiera „Zmień kolejność”, przestawia ćwiczenia i stuka „Gotowe”
    - Wtedy kolejność jest zmieniona, a wpisane wartości zostają

### BR-TRN-013: Superserie
- Przepływ: PR-01 · PR-02
- Dowód potrzeby: J-01; README.md; katalog przepływów TR-19; kod `components/WorkoutBlocks.tsx`
- Test: `tests/audit-0.10-live-logic.test.ts`, `.maestro/25-trening-narzedzia.yaml`
- Kryteria akceptacji:
  - Scenariusz: Łączenie i rozdzielanie
    - Zakładając, że trwa trening z co najmniej dwoma ćwiczeniami
    - Gdy użytkownik w stopce bloku stuka „⇅ SS”, a potem „✕ SS”
    - Wtedy ćwiczenie łączy się z następnym w superserię, a potem z niej wychodzi
  - Scenariusz: Przerwa po rundzie
    - Zakładając, że dwa ćwiczenia są w superserii
    - Gdy użytkownik odhacza serię pierwszego ćwiczenia
    - Wtedy przerwa zaczyna się dopiero po serii ostatniego ćwiczenia rundy

### BR-UST-002: Ekran włączony podczas treningu
- Przepływ: PR-08 · PR-01
- Dowód potrzeby: J-01; kod `app/more/settings.tsx` („Ekran włączony podczas treningu”, domyślnie włączone w `lib/seed.ts`), `components/ActiveWorkout.tsx`
- Test: `tests/logic.test.ts`, `.maestro/35-ustawienia-dostepnosc.yaml`
- Kryteria akceptacji:
  - Scenariusz: Włączone
    - Zakładając, że ustawienie jest włączone (domyślnie)
    - Gdy trwa trening na ekranie treningu
    - Wtedy ekran telefonu nie wygasa sam
  - Scenariusz: Wyłączone
    - Zakładając, że użytkownik wyłączył ustawienie
    - Gdy trwa trening
    - Wtedy ekran wygasa według ustawień iOS

### BR-SZB-002: „Zapisz zmiany w szablonie” po treningu
- Przepływ: PR-11
- Dowód potrzeby: ZP-01; D-116 (decyzje właściciela 2026-10-11, 8A i 1A); kod `app/history/[id].tsx`
- Test: `tests/tplsync-pending.test.ts`, `tests/live2-split-template.test.tsx`, `.maestro/24-szablony-zarzadzanie.yaml`
- Kryteria akceptacji:
  - Scenariusz: Zmieniony skład treningu
    - Zakładając, że w treningu z szablonu użytkownik zamienił albo dodał ćwiczenie
    - Gdy kończy trening i stuka na podsumowaniu „Zapisz zmiany w szablonie”
    - Wtedy szablon ma nowy skład
  - Scenariusz: Bez wyboru użytkownika
    - Zakładając, że skład treningu się zmienił
    - Gdy użytkownik nie stuka przycisku
    - Wtedy szablon zostaje bez zmian, a przycisk jest tylko zaraz po treningu (D-116)

### BR-POM-001: „Pierwsze kroki” dla nowej osoby
- Przepływ: PR-10
- Dowód potrzeby: D-117 (decyzja właściciela 2026-10-11, docs/22 P4 A); kod `components/Dashboard.tsx`
- Test: `tests/first-steps-empty.test.tsx`, `tests/dashboard.test.tsx`, `tests/dec04a-import-w-pierwszych-krokach.test.tsx`, `.maestro/31-pierwszy-tydzien.yaml`
- Kryteria akceptacji:
  - Scenariusz: Pierwsze uruchomienie
    - Zakładając, że baza jest pusta (nowa instalacja albo po wyczyszczeniu danych)
    - Gdy użytkownik otwiera ekran Trening
    - Wtedy widzi kartę „Pierwsze kroki” z trzema krokami (szablon, plan tygodnia, pierwszy trening), każdy z jednym przyciskiem (Planowanie albo Przewodnik), a duży przycisk startu to „Pusty trening”
  - Scenariusz: Zrobione kroki
    - Zakładając, że użytkownik utworzył szablon i plan
    - Gdy wraca na ekran Trening
    - Wtedy te kroki są oznaczone jako zrobione
  - Scenariusz: Krok „zaimportuj historię” (DEC-04 a, właściciel 23.10.2026; wersja 1.0.1)
    - Zakładając, że nowa osoba ma kartę „Pierwsze kroki”
    - Gdy patrzy na krok 4 „Masz historię w innej aplikacji? Możesz ją dopisać z pliku CSV.” i stuka „Importuj historię z pliku CSV”
    - Wtedy otwiera się istniejący ekran importu CSV (podgląd przed zapisem, obecne dane bez zmian); krok jest pomijalny i nigdy nie bywa oznaczony jako zrobiony, a razem z kartą znika po pierwszym zakończonym treningu

### BR-POM-002: Przewodnik po funkcjach
- Przepływ: PR-10
- Dowód potrzeby: D-117; kod `lib/guide.ts`
- Ekrany: `app/guide.tsx`
- Test: `tests/guide.test.tsx`, `.maestro/38-pomoc-powiadomienia.yaml`
- Kryteria akceptacji:
  - Scenariusz: Temat i „Pokaż”
    - Zakładając, że użytkownik otwiera Przewodnik z „Pierwszych kroków” albo z Więcej
    - Gdy wybiera temat, czyta kroki i stuka „Pokaż”
    - Wtedy przechodzi na właściwy ekran i może wrócić; temat jest zapamiętany jako przeczytany
