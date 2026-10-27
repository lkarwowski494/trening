# BRD Trening — odkrywanie: prace, persona, zasady produktu, ograniczenia
Odtworzone z `README.md`, `CLAUDE.md`, `docs/15-app-store.md` i `docs/18-przekazanie.md`. Bez badania użytkowników (OP-01).

## Prace i persona

### J-01: Zapisać trening na bieżąco
- Kiedy trenuję siłowo, chcę zapisywać serie, ciężary i powtórzenia podczas treningu i odmierzać przerwy, żeby nie polegać na pamięci. Źródło: README.md („Dziennik treningu siłowego”, „przerwy z powiadomieniem i Live Activity”).
### J-02: Zaplanować tydzień treningów
- Kiedy układam trening na tydzień, chcę przypisać szablony do dni i dostać plan z podglądem, żeby wiedzieć, co robię danego dnia. Źródło: README.md („plan tygodnia z kalendarzem”), docs/24-generator-i-plany.md.
### J-03: Zobaczyć postępy
- Kiedy skończę trening, chcę widzieć rekordy, objętość i obciążenie partii w czasie, żeby wiedzieć, co się zmienia. Źródło: README.md („postępy z wykresami i rekordami”).
### J-04: Mieć swoje dane przy sobie
- Kiedy zmieniam telefon albo chcę zabezpieczyć historię, chcę kopię, eksport i import oraz brak konta, żeby dane zostały moje. Źródło: README.md („Dane należą do użytkownika”).
### J-05: Dopasować trening do sprzętu i miejsca
- Kiedy trenuję w innym miejscu niż zwykle, chcę żeby ćwiczenia pasowały do dostępnego sprzętu, żeby nie planować ćwiczeń, których nie zrobię. Źródło: docs/10-miejsca-i-sprzet.md, docs/33-dostosowanie-do-miejsca-spec.md.
### J-06: Wiedzieć, jak zacząć, i dać znać autorowi
- Kiedy zaczynam albo czegoś nie wiem, chcę krótkich wskazówek na starcie i przewodnika, a gdy coś nie działa albo czegoś mi brakuje — napisać do autora, żeby nie zostać z problemem. Źródło: decyzje właściciela 2026-10-11 („Pierwsze kroki”, D-117), 2026-10-13 („Napisz do nas”, D-106), 2026-10-14 („Poproś o nową funkcję”, D-105); docs/34-wsparcie-i-opinie.md. Dopisane 2026-10-28 (M1-audytor-generalny-022).
### P-1: Osoba trenująca siłowo z iPhone'em
- Opis z README.md („na iPhone'a i Apple Watch”); bez wywiadu — dowód: opis produktu w repo. Prace: J-01, J-02, J-03, J-04, J-05, J-06.

## Zasady produktu

### ZP-01: Szablony ustawia użytkownik
- Szablonów treningów nie tworzy ani nie zmienia aplikacja sama (decyzja właściciela 2026-10-03). Wyjątek (2026-10-08): opcjonalny generator na wyraźne polecenie, wynik do przejrzenia przed zapisem; deload przelicza szablony tylko jako propozycję do zatwierdzenia (CLAUDE.md).
### ZP-02: Merytoryczne podstawy
- Wszystko, czego aplikacja uczy albo co twierdzi, ma przeczytane źródło według hierarchii; uproszczenia i konwencje są nazwane (zasada właściciela 2026-10-04, CLAUDE.md).
### ZP-03: Spójność akcji
- Akcje i elementy tego samego typu działają w całej aplikacji tak samo (zasada właściciela 2026-10-13; `docs/32-wzorce-interakcji.md`).
### ZP-04: Własne treści
- Bez nazw innych aplikacji w kodzie i tekstach; własne teksty i grafiki (zasada właściciela 2026-10-09, CLAUDE.md).
### ZP-05: Offline, dane tylko w telefonie, bez konta
- Zapis w lokalnej bazie; bez konta, reklam, analityki i śledzenia (README.md, docs/15-app-store.md, `site/privacy.html`).
### ZP-06: Model dostępu stały
- Model monetyzacji jest stały: M5 S1 (decyzja właściciela 2026-10-22; wcześniej model z 2026-10-19 z okresem próbnym); kwoty i liczby: `docs/monetyzacja.md`.
### ZP-07: Zapowiedzi głosowe domyślnie wyłączone
- Decyzja właściciela 2026-10-20 (D-005 w tym BRD = DEC-05), docs/36-glos.md.
### ZP-08: Granica aplikacji
- Dieta, sen, suplementy i relacja trener–podopieczny poza zakresem (decyzja właściciela 2026-10-19, D-003).
### ZP-09: Język naturalny, źródła tylko w wewnętrznym rejestrze
- Aplikacja jest dla zwykłych ludzi, nie dla naukowców: teksty przy funkcjach nie mają przypisów ani oznaczeń pewności (decyzje właściciela 2026-10-23, D-109). Publicznie (aplikacja, strony, sklep) nie piszemy o źródłach, nawet ogólnie; źródła żyją tylko w wewnętrznym rejestrze w repo — rejestr twierdzeń i dokumenty badacza (decyzja właściciela 2026-10-25, D-108; zastępuje wariant z 2026-10-23 z ekranem źródeł w Ustawieniach, BR-ZRO-001 wycofane, ER-02). Źródła zostają podstawą (ZP-02).

## Ograniczenia
Brzmienie wytycznych App Review odczytane 2026-10-27 (strona „Last Updated: October 16, 2026”), cytaty w `zrodla.md` (S-15…S-24); przegląd przed każdym zgłoszeniem do App Store, najpóźniej w terminie z kolumny „Przegląd”. Dopisane i uzupełnione 2026-10-28 (01-odkrywanie-010).

### OG-01: Integracja ze Zdrowiem wskazana w opisie sklepu
- Aplikacja używa HealthKit zgodnie z przeznaczeniem i wskazuje tę integrację w opisie [FAKT S-15]; prośba o dostęp tylko do typów faktycznie używanych (docs/41-droga-do-app-store.md, D3; docs/29-zdrowie-odczyt-spec.md). Dotyczy: BR-ZDR-001, BR-ZDR-002.
### OG-02: Brak porad medycznych
- Zasada właściciela (CLAUDE.md), nie polityka sklepu: aplikacja nie udziela porad medycznych; przy bólu, urazie lub chorobie odsyła do lekarza lub fizjoterapeuty (`components/MedicalNote.tsx`). Dotyczy: BR-PRV-001.
### OG-03: Bez nazw innych aplikacji w sklepie
- Metadane bez cudzych nazw, znaków towarowych i nazw popularnych aplikacji [FAKT S-16] [FAKT S-17] (CLAUDE.md; docs/15-app-store.md). Dotyczy: opis sklepu (rola 10), BR-DAN-007 (opis neutralny „popularne dzienniki treningowe”).
### OG-04: Przywracanie zakupów
- Zakupy, które da się przywrócić, mają mechanizm przywracania [FAKT S-18]. Dotyczy: BR-ZAK-006.
### OG-05: Informacja przed subskrypcją
- Przed prośbą o subskrypcję ekran jasno mówi, co użytkownik dostaje za cenę [FAKT S-19]. Dotyczy: BR-ZAK-001, BR-ZAK-003.
### OG-06: Zmiana planu bez podwójnej subskrypcji
- Zmiana planu nie może prowadzić do przypadkowego wykupienia kilku wariantów tego samego [FAKT S-20]. Dotyczy: BR-ZAK-003 (scenariusze „Zmiana planu” i „Dożywotni przy aktywnej subskrypcji”).
### OG-07: Zakupy w aplikacji wskazane w opisie sklepu
- Opis, zrzuty i podglądy mówią, które elementy wymagają dodatkowego zakupu [FAKT S-21]; cena nie trafia do pól metadanych [FAKT S-16]. Dotyczy: opis sklepu (rola 10), BR-ZAK-001.
### OG-08: Dane zdrowotne nie trafiają do stron trzecich
- Danych ze Zdrowia nie wolno używać ani ujawniać stronom trzecim do reklamy, marketingu ani analizy użycia [FAKT S-22]; aplikacja nie wykonuje wywołań sieciowych (NFR-PRV-001). Dotyczy: BR-ZDR-002.
### OG-09: Bez fałszywych zapisów w Zdrowiu i bez danych zdrowotnych w iCloud
- Aplikacja nie zapisuje do Zdrowia danych fałszywych ani niedokładnych i nie przechowuje osobistych danych zdrowotnych w iCloud [FAKT S-23]; zapis do Zdrowia bez szacunku kalorii (BR-ZDR-001), odczyt tylko w pamięci (BR-ZDR-002). Czy pliki kopii w folderze aplikacji (objęte kopią urządzenia) podpadają pod tę wytyczną — [DO USTALENIA] (OP-09).
### OG-10: Prośba o ocenę tylko przez systemowe API
- Prośba o ocenę idzie przez systemowe API; własne okna prośby o ocenę są niedozwolone [FAKT S-24]. Dotyczy: BR-KON-001.
