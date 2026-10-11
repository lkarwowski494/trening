# 18. Przekazanie — stan bieżący (od 11.10.2026)

Krótki stan dla nowej sesji. Historia decyzji 06.10–11.10.2026 (pełne zapisy z uzasadnieniami): **docs/18-archiwum-do-11.10.md** — nie edytować,
nowe decyzje dopisywać tutaj (sekcja „Decyzje”), z datą. Kolejność czytania: `CLAUDE.md` → ten plik → docs/21 (roadmapa, „Przed App Store”,
backlog) → docs/15 (App Store, ceny) → docs/09 (dziennik testów; stare rundy w docs/09-archiwum-do-0.11.md).

## Gałęzie i wydania
- `main` = **0.11.0**, build **1005** (TestFlight, 10.10.2026), commit 0d71775, tag `v0.11.0-b1005` (tag zakłada właściciel w GitHubie —
  sesja agenta nie może wypychać tagów, decyzja 10.10 wariant A). Wcześniej 0.10.0 / build 1004 (09.10).
- `feature/e2-swap` = **0.12.0** (niewydana): języki fal 1–4 (pt-BR, es-419, id, ms, vi, ru, ja, ko, zh-Hant; razem 35), wpis „Co nowego” 0.12.
  E2E z językami zielone (run 38035814445); E2E dla 0.12.0 w toku. **Audyt 0.12 wstrzymany** (polecenie właściciela 11.10).
- `refactor-store` (w toku, 11.10): podział `lib/store.ts` na moduły bez zmiany działania — decyzja właściciela 11.10, wariant B.

## W toku (11.10.2026) — lista tematów właściciela, przerabiana po kolei
1. Ocena realności znalezisk — **zrobione** (CLAUDE.md, „Audyty i wydania” pkt 6).
2. Sposób pracy (wariant B — wszystko naraz): agenci-role z modelem per rola (`.claude/agents/`), research sprawdzonych promptów (pkt 3),
   odchudzenie docs (09 i 18 — archiwa), szybki cykl testów w trakcie pracy, podział `store.ts`.
3. Research promptów znanych osób/organizacji (tylko przeczytane źródła).
4. Trening zrobiony dzień wcześniej: jutro dzień wolny, reszta bez zmian; cel tygodnia liczy trening do tygodnia, z którego pochodzi.
5. Dezaktywacja wszystkich planów (pusty kalendarz), nadal najwyżej jeden aktywny.
6. Autouzupełnianie kolejnych serii po wpisie w pierwszej.
7. Podsumowanie rekordów po treningu (ćwiczenie + statystyki ze strzałką; bez sztangi z czerwonym talerzem).
8. Przepływy użytkownika → nawigacja, ekran główny, „Progresja” (tydzień/miesiąc), porządek przycisków; prompt do audytu UX.
9. Apple Zdrowie: treningi z zegarka, inne aktywności jako cardio, kroki w planie tygodnia.
10. Baza ćwiczeń: wskazówki i animacje (ExRx — brak API/licencji; MuscleWiki — płatne API i serwer).
11. Nazwa wydawcy Apps4Brew. 12. Strona internetowa. 13. Ryzyko FitNotes.

## Otwarte ryzyka
- E2E-105: zgubione znaki przy szybkim wpisie masy ciała na wolnym symulatorze — do sprawdzenia na telefonie (docs/25).
- Scenariusz E2E 05 (Plank) — zgubione znaki po zimnym starcie; poprawka jak w 15 (backlog).

## Decyzje (od 11.10.2026)
- 11.10.2026: raporty rynkowe — wnioski w docs/research/raporty-rynkowe-2026-10.md; import CSV i prośba o ocenę → „Przed App Store” (A+A).
- 11.10.2026: ocena realności znalezisk (A) — CLAUDE.md.
- 11.10.2026: usprawnienie pracy — wariant B (wszystko naraz, przed nowymi funkcjami); docs/09 i docs/18 dostały archiwa.
- 11.10.2026: **trening zrobiony wcześniej (pkt 4) — wariant A**: trening szablonem X w dniu bez X w planie → jeśli najbliższy dzień treningowy
  w planie ma X, ten dzień „zrobiony wcześniej” (w kalendarzu wolny z ✓), liczy się do celu SWOJEGO tygodnia, reszta planu bez zmian; po zakończeniu
  jedna linijka informacji, „Cofnij” w panelu dnia. Sprawdzić sąsiednie reguły: poranne przypomnienie, „Przesuń plan”/propozycje, stosy miesiąca
  i postęp tygodnia, deload. Odrzucone: B (pytanie po treningu — dodatkowe stuknięcie), C (tylko ręcznie). Wdrożenie po scaleniu refactor-store.
