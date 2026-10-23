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
### P-1: Osoba trenująca siłowo z iPhone'em
- Opis z README.md („na iPhone'a i Apple Watch”); bez wywiadu — dowód: opis produktu w repo. Prace: J-01, J-02, J-03, J-04, J-05.

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
### ZP-09: Język naturalny, źródła w jednym miejscu
- Aplikacja jest dla zwykłych ludzi, nie dla naukowców: teksty przy funkcjach nie mają przypisów (nazwy źródeł, autorów, organizacji, lat); źródła podstaw liczb i reguł są w jednym miejscu — Ustawienia → „Źródła wiedzy” (decyzja właściciela 2026-10-23, docs/18). Źródła zostają podstawą w rejestrze twierdzeń i dokumentach badacza (ZP-02).

## Ograniczenia

### OG-01: Integracja ze Zdrowiem wskazana w opisie sklepu
- Opis w sklepie ma wskazywać integrację z Apple Zdrowie (docs/41-droga-do-app-store.md, D3; docs/29-zdrowie-odczyt-spec.md); prośba o dostęp tylko do typów faktycznie używanych.
### OG-02: Brak porad medycznych
- Aplikacja nie udziela porad medycznych; przy bólu, urazie lub chorobie odsyła do lekarza lub fizjoterapeuty (CLAUDE.md, `components/MedicalNote.tsx`).
### OG-03: Bez nazw innych aplikacji w sklepie
- Opis sklepu bez nazw innych aplikacji i marek (wytyczne Apple 2.3.7, 5.2.1 — CLAUDE.md; docs/15-app-store.md).
