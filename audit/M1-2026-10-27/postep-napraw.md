# Postęp napraw M2 — Trening
Pętla 1 · Zadania: zatwierdzone (37) · Audyt 025a50b96f504ea9d16d573720d1e92dc951a103 · Baza: 862f119e58213eb96829f357f468ad351980fdef (origin/naprawy-1-0) · Sesje ról: subagenci po kolei

Prompt: K/prompty/M2.md (assemble.mjs, biblioteka prompts 8f3d47f, zawiera 97ec212). Narzędzia: K/narzedzia/{sprawdz-plan,zakres-napraw,sprawdz-raport}.mjs.

## Zgody
- 2026-10-27 STOP start: „1A 2a3a 4 zgoda zgodnie z twoją rekomendacją.” → baza naprawy-1-0; przed push: test:fast + hak pre-push, CI tests.yml po każdym push, pełne verify lokalnie na końcu partii (nazwany wyjątek od CLAUDE.md „verify przed wypchnięciem”, powód: pełne jest lokalnie ok. 2 h); sesje ról: subagenci po kolei; push gałęzi partii po każdym commicie i stanu K (bez treści biblioteki) na gałąź audytu przy każdym STOP; bez scalania z main.
- 2026-10-27: dołączenie repo prompts tylko do odczytu — właściciel: „A”.

## Partie
| Partia | Gałąź | Od | Do | STOP przed | Stan |
|---|---|---|---|---|---|
| 1 | naprawy/M2-koordynator-napraw-2026-10-27-p1 | — | — | tak (009 P; 003, 004 dane) | czeka na STOP start |
| 2 | naprawy/M2-koordynator-napraw-2026-10-27-p2 | — | — | tak (005, 010 P) | czeka |
| 3 | naprawy/M2-koordynator-napraw-2026-10-27-p3 | — | — | tak (014, 037 P; 020, 021, 036 M; 013, 015 dane) | czeka |

## Zadania
| ID | Partia | Krok | Commit | Dowód | Przeczytane reguły | Następny krok |
|---|---|---|---|---|---|---|
| wszystkie 37 | 1–3 | czeka | — | dowody/M2/zakres.txt | — | zgoda STOP start |

## Dziennik
- 2026-10-27 E0: sprawdz-plan kod 0 (dowody/M2/sprawdz-plan-start.txt); zakres-napraw kod 0, 37 zadań, 3 partie (dowody/M2/zakres.txt).
- 2026-10-27 E0: bramka D-025 — docs/monetyzacja.md:77 werdykt „wydać” (21.10.2026) → pełny zakres dozwolony.
- 2026-10-27 E0: git status czysty; commit audytu istnieje; HEAD main = 025a50b (0 commitów od audytu); K ignorowany (.git/info/exclude:7 audit/).
- 2026-10-27 E0: origin/naprawy-1-0 = main + 5 commitów (c9cacfa, 644c498, b448491, 01f8bf0, 862f119) — dotykają zadań 010 (stan „mam plan”), 011 (limit skali znaków), 007 (R-WAL), 009 (odnośnik decyzja–test w docs/18): do ponownego odtworzenia.
- 2026-10-27 E0: npm ci (dowody/M2/npm-ci.txt); stan wyjściowy komend: dowody/M2/stan-*.txt.
- 2026-10-27 E0: stan wyjściowy — typecheck 0, lint 0, jest lokalnie przerwany po 60 min (207/208 PASS, 1 OOM środowiska), CI tests.yml zielone na 025a50b i 862f119 (dowody/M2/stan-podsumowanie.txt). STOP start przedstawiony (K/M2-stop-start.md).

## Czekające zgody i kroki właściciela
- STOP przed partią 1 (009 P; 003, 004 dane).
- Telefon: zrzut AX5 ekranu Trening (T-04, 011), region konta Sandbox testerki (T-11, 007), R-005, AK-05.
