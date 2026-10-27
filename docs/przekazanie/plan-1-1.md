# Plan prac 1.0 → 1.1 (stan na koniec sesji 27.10.2026 ~09:00 UTC; weryfikacja nowej sesji 27.10 08:50 UTC — sekcja niżej)

Legenda: ✅ zrobione · 🔶 w toku/niedokończone (stan na gałęzi) · ⬜ do zrobienia · **TERAZ** = można zacząć bez ryzyka przeróbki.
Zasady: verify przez `flock /tmp/claude-0/verify.lock npm run verify` (decyzja B 27.10); przed verify `git config --get core.hooksPath` = `scripts/hooks`; worktree na agenta; agenci wypychają po każdym kroku i dopisują stan w docs/przekazanie/README.md; nic do main bez polecenia właściciela.
Decyzje 27.10: docs/18 na integracja-1-1 (ded4827, 88c2bf7) + linie „DECYZJA” w README przekazania (oparcie maszyn A, verify B).

## Weryfikacja nowej sesji koordynatora (27.10.2026, 08:50 UTC) — stan CI na GitHubie
| Gałąź @ SHA | tests.yml | Inne | Agent nowej sesji |
|---|---|---|---|
| naprawa-figury-1-0 @ 6a9dd65 | ✅ 40468378516 | E2E podst. 40468399399 w kolejce od 07:39 (brak maszyny); PR #73 | A2 + port pull_up z p1 + podglądy do A2r |
| technika-rozwinieta-1-0 @ 5f3d92d | ⏳ 40473034847 | wcześniejsze SHA czerwone | A3 |
| z02-przeklad-1-0 @ 5309766 | ❌ 40464325134 | | A4+A5 |
| review-notes-1-0 @ 891ded9 | ❌ 40464521009 | notatka mówi o 3 rodzinach ready, w 1.0 są 4 (pull_up) | A4+A5 |
| zrzuty-1-0 @ c5d0177 | ✅ 40464320899 | store-screenshots 40464544722 „in_progress” od 07:00 | A6+A7 |
| poprawki-p1 @ 76d4b3c | ❌ 40464294526 | | G3 (CI p1/p4b) |
| poprawki-p4b @ e65ae28 | ❌ 40466829470 | podglądy p4b skasowane wyścigiem w e63bbdb → przywrócone c30cda8 | G3 (CI p1/p4b) |
| jakosc-r2 @ e1b31d6 | ✅ 40464552537 | | G1 (R17b/R19/R21 + 3 lunge) |
| poprawki-p2 @ b0baa9f, p3 @ 28381fb, p4a @ aa4253f | ✅ 40465151377 / 40464181234 / 40466271258 | | G3r: recenzenci p2+p3, p4a |
| rodziny-mobilnosc @ c3913af | ✅ 40466344263 | | G3r: recenzent mobilność |
| przeklad-kontekst @ f9b0926 | ✅ 40466811901 | gotowe do G6 | — |
| strona-filtr-audytu @ 2463e83 | ✅ 40469744168 | lokalne verify niezrobione | kolejka (priorytet 3) |
| wersja-1-0-1-wip @ 4b3055e | ❌ 40464284389 | | kolejka (priorytet 3) |
Uwagi: `gh` CLI w tym kontenerze niezalogowane — CI przez narzędzia MCP. Zapis stanu wyłącznie przez `/home/user/wt/zapisz-stan.sh` (blokada, `[skip ci]`, push `--no-verify` — gałąź tylko z dokumentami; wyjątek koordynatora 27.10) — chroni przed wyścigiem jak e63bbdb.

## Ścieżka 1 — 1.0 (priorytet 1)
| ID | Zadanie | Stan / gałąź | Następny krok |
|---|---|---|---|
| A1 | Lista z telefonu docs/49 T-01–T-14 (bez T-10) + zakupy sandbox | ⬜ właściciel (po pracy) | prowadzić krok po kroku od T-01 |
| A2 | Naprawa figur 1.0: squat/bench_press/hinge (Deadlift hantle — zgłoszenie właściciela), lekcja w docs/40, reguła CLAUDE.md | 🔶 `naprawa-figury-1-0` 6a9dd65, tests.yml zielony 40468378516, PR https://github.com/lkarwowski494/trening/pull/73 (nie scalony), E2E podstawowy 40468399399 (wynik nieznany; brak maszyny → ponowić) | ~60 wariantów poprawionych (martwe ciągi 14, RDL/stiff, Front Squat, wyciskanie 18, Dip Belt, gumy); lekcja L-NNN do numeracji; ~~dołożyć pull_up~~ — KOREKTA 27.10 08:50: na main pull_up ma status `planned` (families.ts:35), w 1.0 niewidoczny; ready tylko na integracja-1-1 → poprawka pull_up zostaje w 1.1 (poprawki-p1) |
| A2r | Niezależna ponowna recenzja ruchu i treści kart 3 rodzin z 1.0 (squat, bench_press, hinge) | ⬜ PO A2 | recenzent bez dostępu do uzasadnień |
| A3 | „Technika” rozwinięta w karcie (decyzja B) | 🔶 `technika-rozwinieta-1-0` 5f3d92d | verify, tests.yml, E2E 16/17/57, PR; sprawdzić, czy w treningu na żywo jest wejście, które ma być zwinięte (?cues=0) |
| A4 | Z-02 przekład po 26.10 | 🔶 `z02-przeklad-1-0` 5309766 | verify, PR (49 nieblokujących w osobnym commicie → akceptacja właściciela) |
| A5 | Notatki App Review 1.0 | 🔶 `review-notes-1-0` 891ded9 | verify, PR; tekst EN do akceptacji |
| A6 | Zrzuty iPhone | 🔶 `zrzuty-1-0` c5d0177, przebieg 40464544722 | przegląd 1:1 obrazów; powtórzyć ekran 02-cwiczenie po scaleniu A2; dry-run asc-zrzuty |
| A7 | Zrzuty zegarka: kanał alfa, dane po polsku we wszystkich językach, nakładka „Trening wstrzymany”/„Przerwa” (też błąd UI w aplikacji, kosmetyczny) | ⬜ TERAZ | poprawka + watch-sim.yml |
| A8 | Scalenie A2+A3(+A4,A5) do main (polecenie właściciela) → nowy build testflight.yml → `release` (właściciel) → T-10 i figury na telefonie | ⬜ PO A2–A5 | |
| A9 | ASC: ocena wiekowa (dziś 4+, plan 9+), metadane Z-14, App Review Info Z-25, kroki Z-11–Z-29 | ⬜ właściciel | asc-kontrola 40457521342: 36 OK |
| A10 | 1.0.1: merge main | 🔶 `wersja-1-0-1-wip` 4b3055e | verify, push na wersja-1-0-1; po A8 dołączyć main ponownie |

## Ścieżka 2 — grafiki 1.1 (wariant A: niezależna recenzja każdej rodziny = bramka; reguła CLAUDE.md: audyt ruchu i treści karty przed wyświetleniem w aplikacji i na stronie)
| ID | Zadanie | Stan / gałąź | Następny krok |
|---|---|---|---|
| G1 | Bramki: n6 poprawione, R17, P3, recenzja n7 OK | ✅ `jakosc-r2` e1b31d6 | R17b (styk każdego podparcia), R19 (decline), R21 (wysokość bazowa leżenia 9,5 vs 8,0 — ustalić); przed scaleniem naprawić 3 pozy lunge łamiące „kolano-strona” (Lateral Lunge, Cossack Squat, Barbell Side Split Squat) |
| G2 | Recenzje ruchu 36 rodzin (partie 1–4 + rigi) | ✅ `docs/przekazanie/notatki/recenzje-1-1/` | — |
| G3 | Poprawki po recenzjach | ✅ p1 76d4b3c (16 ćw.), ✅ p2 b0baa9f (19), ✅ p3 28381fb (6), ✅ p4a aa4253f (24), 🔶 p4b e65ae28 (14; verify/CI) | p4b: verify + tests.yml; p1: verify + tests.yml |
| G3r | Niezależne ponowne recenzje zmienionych póz (p1 16, p2 19, p3 6, p4a 24, p4b 14, mobilność 18) | ⬜ TERAZ (dla gałęzi z zielonym CI) | podglądy w `docs/przekazanie/notatki/podglady-1-1/` |
| G4a | Nowe rodziny mobility_stand/floor, foam_roll, neck | ✅ `rodziny-mobilnosc` c3913af (18 póz, 56 wyjątków) | recenzja (G3r); podłączenie po recenzji (poseData.ts, teksty faz Cat-Cow/Inchworm przez t()) |
| G4b | Luki w istniejących rodzinach (~120 ćw.) | ⬜ PO G3r danej rodziny | |
| G2b | Audyt treści kart (wskazówki, mięśnie, kąt na rysunku, tempo, wiersze błędów vs rysunek) | ⬜ TERAZ dla rodzin po G3r | |
| G5 | Wyjątki bez animacji w teście pokrycia (cardio, bez istoty ruchu, bez źródła) | 🔶 częściowo (mobilność) | |
| G6 | Scalenia do integracja-1-1: jakosc-r2, poprawki-p1..p4b, rodziny-mobilnosc, przeklad-kontekst, strona-filtr-audytu; po p1+p2 regenerować 7 póz leżących przodem (lista w linii agenta p2); regeneracja docs/51, macierzy, README, odcisków; pełne verify integracji | ⬜ PO G3/G3r | merge, nie rebase |
| G7a | Kontekst ekranu w przekładzie API + 145 kontekstów | ✅ `przeklad-kontekst` f9b0926 | do G6 |
| G7b | Przekład nowych tekstów 1.1 (API ≤6 USD) + recenzent lokalizacji + JEDEN plik pytań pt-BR dla native speakera | ⬜ PO G6 | |
| G8 | Definicja ukończenia: BRD, rejestr twierdzeń, macierz, Maestro 57 na próbce, budżet klatek, VoiceOver | ⬜ PO G6 | |

## Ścieżka 3 — techniqueatlas
| S1 | PIN na role mięśni | ✅ PR https://github.com/lkarwowski494/techniqueatlas/pull/1 (CI zielone, nie scalać) | |
| S1b | Plik rodzin zatwierdzonych + filtr eksportu | 🔶 `strona-filtr-audytu` 2463e83 | verify, tests.yml; strona: wyjątek S6 dla `audit != zatwierdzona`, odrzucanie `manifest.audit.filter == false` |
| S2 | Przy 1.1: PIN na SHA wydania, noindex off, domena (właściciel), check-urls | ⬜ PO 1.1 | |

## Wydanie 1.1
Audyt zmian od 1.0 → naprawy blokerów → 1.1.0 → pełny E2E → TestFlight → telefon → App Store. Po 1.1: wspólny pakiet silnika (kalistenika, wznowienie 2.11).

## Pytania do właściciela (otwarte)
1. Animacje w 1.0: A) 3 rodziny (squat, bench, hinge; korekta 27.10 — pull_up w 1.0 nie jest ready) po naprawie + ponownej recenzji (rek.), B) 1.0 bez animacji do audytu.
2. Strona: ćwiczenia bez zatwierdzonej animacji zostają z tekstem (zrobione) czy znikają.
3. Kółka gimnastyczne: A uproszczenie (rek.) / B osobny sprzęt.
4. Czy plik `data/figury-audyt.json` ma sterować też statusem `ready` w aplikacji (jedno źródło; rek. tak, po 1.0).
5. Opcja A dla verify (gałęzie robocze: test:fast + CI), jeśli kolejka znów blokuje.
