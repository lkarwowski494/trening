# Stan koordynatora 1.0 — 31.10.2026 ok. 19:05 PL (przed resetem kontekstu)

Źródła prawdy: docs/48 (kolumna „Stan”), docs/zobowiazania.md (Aktywne), docs/18, docs/40; linia 1.1: origin/integracja-1-1:docs/przekazanie/notatki/linia-1-1/STAN-1-1.md (sekcje „Teraz” i „Weryfikacja ACG”). Ten plik to skrót; przy sprzeczności wygrywa repo. Poprzednia wersja: STAN-koordynator-1-0-stary-31-10-19h.md.

## Limit
- To konto: resztka tygodniowego do 02.11 22:00 PL (właściciel: wykorzystać do końca). Drugie konto: reset 01.11. Max 1–2 sesji naraz, częste commity.

## 1.0 (main) — bez zmian
- W recenzji Apple od 30.10 10:40 PL (build 1033 = fced34b). Nie wycofujemy, NIC nie dodajemy do 1.0 (właściciel 31.10, także ACG-006 WYSOKIE i 7 krytycznych tekstów UI widocznych w 1.0 — naprawa w 1.1). Plan B ZB-022: przypomnienia trig_016Qf5A6biJXMhe6SDYE98dS (03.11 09:47), trig_016dWhQZj728b7dqsgx9XXx9 (05.11 09:47).
- 1.0.1 nie wychodzi osobno (1.1 zamiast). wersja-1-0-1-r2 @ aebcd4cd zamrożona; test telefonu 1.0.1 — właściciel kiedyś.

## 1.1 (integracja-1-1) — zrobione 31.10
- H1/ZB-028 (verify:docs od przodka z pełnym verify), L-080 decyzja A (CLAUDE.md), ACG-002 (skrót recenzji = całe domknięcie importów), ACG-001 (lpd.fullStretch poza podciąganiami; recenzja: ja), ZB-029 decyzja CI T1+T2+T3 (85902f01), ACG-003 przekład 52 zdań + przegląd API Opus 13,94 USD (przebieg 41220388812) → e369cd7e, tests.yml 41225259256 zielony.
- Audyt ćwiczeń i grafik partie 1–4E: gałąź audyt/cwiczenia-grafiki-2026-10-31 @ 1a09dbba (KRYT 0, WYS 0 → po weryfikacji ACG-006 WYSOKIE; ŚRED 8+1; NISK kilka). Weryfikacja 9/9 potwierdzone (audyt/weryfikacja-2026-10-31, część 2).
- W toku przy resecie (sprawdzić u źródła!): ui-krytyczne/przeglad-api (4 z 8 tekstów UI: nb, vi×2, et) → FF do integracji po tests.yml; fale napraw ACG-006 (acg-006/skullcrusher-gryf) i v2 (ACG-008/009/012/013/019/020); ACG-010/015 czekają na badacza; rejestr ryzyk ACG-006 (1.1 nie wychodzi bez poprawki + testu).

## Kolejka 1.1 (po resecie)
1. Dokończyć to, co „w toku” (raporty końcowe obu sesji w ReadNotifications po resecie).
2. Słownik terminów: pojęcie „faza ruchu” vs „pauza treningu” (cs/sk/ro „Pauza”, ro „Podciąganie”) → pozostałe 4 krytyczne UI. Partia 5 audytu.
3. Recenzje 4 rodzin v2 (PROMPT-sesja-recenzje-rodzin.md), nazwy EN ZB-025 + ZB-023 (PROMPT-sesja-nazwy-en-znaczniki.md), K1/K2 ZB-027 (PROMPT-sesja-gcp-k1-k2.md), przyspieszenie CI ZB-029 (PROMPT-sesja-przyspieszenie-ci.md — właściciel otwiera na drugim koncie 01.11). 107 średnich + 140 niskich uwag z przeglądu API UI — lista w STAN-1-1.

## Czeka na właściciela (bez pośpiechu)
- 01.11: sesja CI na drugim koncie. Prompt Gemini K2 (/tmp/claude-0/-home-user/90028a7e-5ac5-41da-af83-942cfc3f42ad/scratchpad/gemini-popularnosc-cwiczen.md). Budżet GCP (alerty). Test telefonu 1.0.1. E-mail od Apple.
- Opcjonalnie: usunięcie gałęzi h1/verify-docs-znacznik, acg-002/skrot-recenzji, acg-001/vpull-pelny-wyprost (0 unikalnych commitów względem integracja-1-1, sprawdzone 31.10).

## Pułapki
- Znacznik verify żyje w kontenerze (.git/verify-znaczniki.json): nowa sesja = pełne verify przed pierwszym pushem (problem w ZB-029 pkt 7). core.hooksPath ustawiać WZGLĘDNIE (scripts/hooks), inaczej verify stoi na L-014. Lokalny tag v1.0.1-b1035 po fetch czerwieni audit-m1-050 → `git tag -d`. Wpis docs/18 wymaga [wdrożenie] i [wykonalność].
- Pełne verify ~30 min, NODE_OPTIONS=--max-old-space-size=3584, jedno naraz, zatrzymywać po PID. Sesje bezczynne nie budzą się na CI — szturchać send_message.

## Sesje podległe (przy resecie — kończą pracę, archiwizować po raporcie)
- session_01T66VBywrv6a18oUDTxkPcw (ACG-003, UI krytyczne, audyt 3–4E).
- session_01T66VBvQr2aYDfZ5p9AKC57 (weryfikacja ACG + fale napraw).

## Aktualizacja 19:55 PL
- Wykonawca session_01T66VBywrv6a18oUDTxkPcw: raport końcowy odebrany, nic niewypchnięte. ui-krytyczne/przeglad-api @ 6b3d23d5 — DO SCALENIA FF do integracja-1-1 (e369cd7e) po zielonym tests.yml 41231545965 (zrób to sam: git push origin 6b3d23d5:integracja-1-1, jeśli FF). Do zarchiwizowania.
- Pułapka: fetch z tagami → `git fetch --no-tags` / `git config remote.origin.tagOpt --no-tags`. Pomysł trwałej naprawy (backlog): wiersz docs/09 dla v1.0.1-b1035 albo test ignorujący tagi spoza linii.

## Aktualizacja 20:10 PL (koordynator po resecie)
- session_01T66VBywrv6a18oUDTxkPcw: zarchiwizowana (raport odebrany przed resetem).
- session_01T66VBvQr2aYDfZ5p9AKC57: verify acg/fale-napraw @ 40625931 w toku (tests.yml 41231690530). fale stoją na 85902f01 — BRAK e369cd7e (ACG-003) → nie FF. Wysłałem: dokończ, wypchnij, raport, nie wypychaj na integrację. Po raporcie archiwizacja.
- ui-krytyczne @ 6b3d23d5: tests.yml 41231545965 w toku → po zielonym `git push origin 6b3d23d5:integracja-1-1` (ja).
- NOWA sesja B: session_01T66VBwYbswGyfQ4Q56yzhf (słownik faza/pauza, 4 UI, partia 5 audytu), gałąź slownik/faza-pauza od 6b3d23d5.
- DO ZAŁOŻENIA po raporcie QR2: sesja A — scalenie integracja→acg/fale-napraw + pełne verify + FF integracji; ACG-010/015 (badacz), NISKIE ACG-007/011/014/016/017/018/021, szrugsy; ewent. scalenie gałęzi audytu (docs) do integracji.
- Właściciel 31.10 ~20:15: mało limitu → każda sesja zapisuje postęp regularnie (commit+push po każdym kroku, verify od razu na starcie, raport przed dłuższym krokiem, ustalenia do repo). Wpisać do promptu każdej nowej sesji. Wysłane do B i QR2.
## Aktualizacja 20:16 PL
- QR2 raport końcowy odebrany (0 niewypchniętych; acg/fale-napraw @ 83af39af), zarchiwizowana. tests.yml fal: 41231690530 (40625931), 41233303423 (83af39af). acg-006 i acg-v2 osobno czerwone (pliki generowane) — nie scalać osobno.
- NOWA sesja A: session_01T66VBxtTk5PaUMPE3kVWo7 — merge 6b3d23d5 → acg/fale-napraw, verify, SHA do FF; ACG-010/015, NISKIE.
- Ja: po zielonym 41231545965 → git push origin 6b3d23d5:integracja-1-1; potem FF do SHA od A.
## 20:25 PL
- A: merge a797ac41 lokalnie, verify w toku; badacz ACG-010/015.
- B: c589f9c4 (faza_pauza: cs/sk Výdrž, ro Menținere, et Hoidmine, de Halten — zgodnie z K1 09.10, nie „Pauza” z API; ro Tragere în sus) lokalnie, verify w toku. Partia 5: audyt/cwiczenia-grafiki-p5 @ b16f61c5 lokalnie — 709/709 zamknięty, ACG-022 NISKIE, OP-13 (pytanie do badacza), brak ŚREDNICH+. Opcja B (Pauza + zmiana K1) odradzona — nie idzie do właściciela, bo zgodne z istniejącą decyzją.
## 20:32 PL
- integracja-1-1 → 6b3d23d5 (FF). Wyjątek nazwany: --no-verify, bo znacznik w innym kontenerze, a ten sam SHA ma zielony tests.yml 41231545965 (+ pełne verify 899d52d7 w sesji ywr). Do STAN-1-1 przy najbliższym commicie sesji A.
## 20:36 PL
- A: verify a797ac41 czerwone przez falę 2 (testy przypinające stare dane: figury-recenzja-p2, figury-mobilnosc-reguly) — naprawa + lekcja. ACG-010/015 → B (odłożone do włączenia rodzin, ZB w zobowiązaniach; teoretyczne). ACG-007 Glute Bridge (widoczny): poprawka + recenzja; do recenzji rysunek ukryty w 1.1.
## 21:23 PL
- B: slownik/faza-pauza @ 343f2ca5 wypchnięte (verify zielone), tests.yml 41238490844. NIE FF teraz — najpierw fale (A verify #3), potem B scala integrację przed kolejnym verify. Wyjątek: jeśli limit zagraża → FF do 343f2ca5 po zielonym.
- B dalej: p5 verify→push; 107 średnich (90 UI + 17 wskazówek) 2 tłumaczy + recenzja.
- A: verify #2 czerwone (złote odciski, generator, wyjątki recenzji, audit-037 ENOBUFS) → verify #3. ACG-007 recenzja: wyswietlana.
## 21:57 PL
- A: acg/fale-napraw @ da5177b2 wypchnięte (verify zielone 15785), tests.yml 41241000203 → FF integracji (ja). A dalej: ACG-007 (recenzja: wyswietlana).
- B: p5 @ b16f61c5 wypchnięte (scalić z gałęzią audytu — docs). B: kazałem zatrzymać verify e0eced7f, scalić da5177b2, jedno verify → SHA do FF.
- Do właściciela wysłane: decyzja docs/18 rozmiar A (archiwizacja, rekomendacja) / B (tylko odczyt). Czekam.
## 22:08 PL — DECYZJA WŁAŚCICIELA
- docs/18 rozmiar: **A** (archiwizacja starszych wpisów do docs/18-archiwum-do-….md, check:decyzje czyta oba) — właściciel 31.10.2026 ~22:07 PL. Zapis w docs/18 + wdrożenie: sesja A po ACG-007, po FF B (żeby ograniczyć konflikty docs/18).
## 22:12 PL — LIMIT 100% (właściciel)
- Wysłano A i B: natychmiastowy push wszystkiego (wip z --no-verify jako wyjątek nazwany, gdy verify niedokończone).
- Po resecie (02.11 22:00 PL lub drugie konto): (1) tests.yml 41241000203 (fale da5177b2) zielony → FF integracja-1-1 do da5177b2 (--no-verify, wyjątek jak 20:32); (2) B: slownik/faza-pauza (aba31409 = fale + słownik + średnie UI) verify → FF; (3) A: ACG-007 (recenzja: wyswietlana) → potem archiwizacja docs/18 (decyzja A właściciela 31.10 ~22:07; liczba wpisów check:decyzje 490 przed=po); (4) p5 b16f61c5 scalić z gałęzią audytu; (5) 17 średnich wskazówek + 10 pytań native; (6) kolejka 3 ze STAN wyżej (recenzje rodzin v2, ZB-025/023, K1/K2, CI).
- Sesje: A session_01T66VBxtTk5PaUMPE3kVWo7, B session_01T66VBwYbswGyfQ4Q56yzhf — zarchiwizować po raportach.
## 22:17 PL
- B wypchnęła `slownik/faza-pauza-wip` @ aba31409 (--no-verify, verify niedokończone; = słownik + średnie UI + scalenie fal da5177b2). Po resecie: pełne verify aba31409 → push na slownik/faza-pauza → FF integracji. Kolejka B w STAN-1-1 na tej gałęzi.
- A: czekam na raport (ACG-007).
## 22:23 PL
- A raport końcowy: acg/fale-napraw @ 6330c721 (ACG-007 92c1feef, verify zielone 15787) — 0 niewypchniętych. tests.yml 6330c721 niesprawdzony. Decyzja A docs/18 — jeszcze NIE w docs/18. Prompt przejęcia zaktualizowany.
- 22:24 PL: B: verify aba31409 czerwone (DEC-04 a, maestro 59) → cofnięte, wip @ e7ce5f1e; verify nowego HEAD w toku. tests.yml 6330c721 (fale) = 41243267412 w toku; da5177b2 anulowany.
