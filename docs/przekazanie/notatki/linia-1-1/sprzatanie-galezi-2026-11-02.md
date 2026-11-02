# Sprzątanie gałęzi — 02.11.2026 (koordynator linii 1.1, polecenie właściciela „uporządkuj repo”)

Decyzje właściciela 02.11.2026: (1) usunąć gałęzie zdalne bez commitów poza gałęziami stałymi (main, integracja-1-1, wersja-1-0-1-r2, przekazanie-konta) — dowód: API compare `ahead_by=0` względem co najmniej jednej z nich; (2) gałęzie z treścią spoza gałęzi stałych — tag `archiwum/<nazwa>` na tym samym SHA, potem usunięcie gałęzi. Odtworzenie: `git push origin <SHA>:refs/heads/<nazwa>` (commity scalonych są w gałęziach stałych; archiwalnych — w tagach).

Zostały (aktywne): gałęzie stałe, `badania/*` (źródła integracji P1–P5 i fali obowiązkowych — do usunięcia po integracji), `proces/scal-galaz-l090`, `integracja/p0-reguly`, `e2e/s33-stare-nazwy`, `claude/wizardly-curie-476stg` (sesja strony 02.11).


## Stan wykonania (02.11.2026 ~21:20 PL)

- Lokalne: zrobione (41 gałęzi, lista niżej).
- Zdalne: **nie wykonane z sesji agenta** — `git push --delete` odrzucony przez politykę gita sesji w chmurze (HTTP 403, nie obchodzimy); tag archiwalny na starym SHA zatrzymuje hak pre-push (L-049: brak znacznika verify dla drzewa). Do wykonania przez właściciela z własnego klona (z katalogu repo, po `git fetch origin`):

```bash
# 1) archiwum w tagach (20) — --no-verify świadomie: tag wskazuje commit już obecny na GitHubie, nic nowego nie jest publikowane
git push --no-verify origin origin/asc-kontrola-m5s1:refs/tags/archiwum/asc-kontrola-m5s1
git push --no-verify origin origin/audyt/m1-reaudit-2026-10-28:refs/tags/archiwum/audyt/m1-reaudit-2026-10-28
git push --no-verify origin origin/audyt-m1-1-0-2026-10-27:refs/tags/archiwum/audyt-m1-1-0-2026-10-27
git push --no-verify origin origin/audyt/cwiczenia-grafiki-2026-10-31:refs/tags/archiwum/audyt/cwiczenia-grafiki-2026-10-31
git push --no-verify origin origin/audyt/cwiczenia-grafiki-p5:refs/tags/archiwum/audyt/cwiczenia-grafiki-p5
git push --no-verify origin origin/audyt/weryfikacja-2026-10-31:refs/tags/archiwum/audyt/weryfikacja-2026-10-31
git push --no-verify origin origin/claude/gallant-dirac-iryk11:refs/tags/archiwum/claude/gallant-dirac-iryk11
git push --no-verify origin origin/dowod-asc-metadane:refs/tags/archiwum/dowod-asc-metadane
git push --no-verify origin origin/dowod-walidacja-neg:refs/tags/archiwum/dowod-walidacja-neg
git push --no-verify origin origin/dowod-walidacja-poz:refs/tags/archiwum/dowod-walidacja-poz
git push --no-verify origin origin/f020-sklep:refs/tags/archiwum/f020-sklep
git push --no-verify origin origin/f020-garmin:refs/tags/archiwum/f020-garmin
git push --no-verify origin origin/koordynator/stan-1-0:refs/tags/archiwum/koordynator/stan-1-0
git push --no-verify origin origin/m3-wejscie/029-ikony:refs/tags/archiwum/m3-wejscie/029-ikony
git push --no-verify origin origin/naprawy/M2-po-decyzjach-eksport-figur:refs/tags/archiwum/naprawy/M2-po-decyzjach-eksport-figur
git push --no-verify origin origin/pokrycie-katalogu:refs/tags/archiwum/pokrycie-katalogu
git push --no-verify origin origin/pozy-1-1:refs/tags/archiwum/pozy-1-1
git push --no-verify origin origin/review-notes-1-0:refs/tags/archiwum/review-notes-1-0
git push --no-verify origin origin/strona-eksport:refs/tags/archiwum/strona-eksport
git push --no-verify origin origin/telefon-2026-10-28:refs/tags/archiwum/telefon-2026-10-28
git ls-remote origin 'refs/tags/archiwum/*' | wc -l   # ma być 20
# 2) usunięcie gałęzi: 184 scalone + 20 zarchiwizowanych (dopiero po kroku 1)
git push origin --delete \
  anonimizacja-paczki \
  asc-kontrola \
  acg-003/przeklad-zdan \
  asc-kontrola-404-sha \
  acg-002/skrot-recenzji \
  acg-006/skullcrusher-gryf \
  acg-001/vpull-pelny-wyprost \
  acg-v2/dane-planned \
  acg/fale-napraw \
  asc-metadane-wgranie \
  asc-kontrola-oczekiwane \
  asc-zrzuty-naprawa \
  backlog-figur \
  brzmienia-t002-t003-t032 \
  claude/optimistic-clarke-9tj0im \
  czysta-1.0 \
  decyzje-2026-10-25 \
  decyzje-m1-2026-10-23 \
  decyzja-1-1-zamiast-1-0-1 \
  claude/serene-gauss-wtardk \
  decyzje-1-1-przygotowanie \
  docs-dziennik-1033 \
  docs-maks-serii \
  docs-noc-2026-10-29 \
  dowod-przeglad-api-2210 \
  docs-po-95 \
  docs-zegarek-czekamy \
  ekran-trening-naglowek \
  fix-edit-history-czas \
  e2e/fix-0211 \
  figury-kontrakt-r4 \
  formalnosci/trening-2026-10-21 \
  gemini-figury \
  fala1/zb025-pelna-karta-nazwy-en \
  fix/ci-czas-sdk58 \
  grafiki-cwiczen \
  gemini-vertex \
  gemini-polecenia \
  grafiki-dane-ui \
  grafiki-wyciskanie-2026-10-26 \
  grafiki-sprzet \
  hak-worktree \
  integracja-1-1-g6a \
  h1/verify-docs-znacznik \
  integracja-1-1-g6b \
  integracja-1-1-g6c \
  integracja-1-1-g6d \
  integracja-1-1-g6e \
  integracja-2026-10-23 \
  integracja-1-1-g6f \
  integracja-2026-10-25 \
  integracja-2026-10-26 \
  integracja-1-1-g6g \
  integracja-2026-10-27 \
  integracja-1-1-main-wip \
  integracja-2026-10-26b \
  jezyk-live-activity \
  jezyk-naturalny-zrodla \
  koordynacja-2026-10-21b \
  jakosc-r2 \
  koordynacja-2026-10-22 \
  lekcja-sandbox-testflight \
  lekcja-update-branch \
  m3-kopia/scalenie-main-8b2c14c \
  karta-katy-fazy \
  monetyzacja-1-0 \
  metadane-1-0 \
  monetyzacja-badanie-2026-10-22 \
  monetyzacja-m5s1 \
  metadane-1-0-recenzja \
  naprawa-e2e-26b \
  naprawa-e2e-main-2026-10-26 \
  naprawa-e2e-pierwszy-tydzien \
  naprawa-e2e-maly-2026-10-26 \
  naprawa-m1-028-zegarek-ack \
  naprawa-m1-031-asekuracja \
  naprawa-m1-045-app-review \
  naprawa-figury-1-0 \
  naprawa-m1-048-asc-release \
  naprawa-m1-dec03-generator \
  naprawa-m1-dec07-teksty \
  naprawa-m1-dec07-ui \
  naprawa-m1-p2-kod \
  naprawa-m1-p2-teksty \
  naprawa-m1-p2-tresci \
  naprawa-main-2026-10-26 \
  naprawa-nocne-2026-10-25 \
  naprawa-telefon-1030-a \
  naprawa-telefon-1030-b \
  naprawa-zakup-m5s1 \
  naprawy-1-0 \
  naprawy-audyt-1-0 \
  naprawy/M2-hinge-szczelina \
  naprawy/M2-jm-press-2026-10-28 \
  naprawy/M2-koordynator-napraw-2026-10-27-p1 \
  naprawy/M2-koordynator-napraw-2026-10-27-p2 \
  naprawy/M2-koordynator-napraw-2026-10-27-p2-ax5 \
  naprawy/M2-koordynator-napraw-2026-10-27-p3 \
  naprawy/M2-koordynator-napraw-2026-10-28-p1 \
  naprawy/M2-koordynator-napraw-2026-10-28-p2 \
  naprawy/M2-noc-2026-10-28 \
  naprawy/M2-po-decyzjach-jednostki \
  naprawy/M2-po-decyzjach-podpis \
  naprawy/M2-po-decyzjach-figury \
  naprawy/M2-po-decyzjach-pochodne \
  naprawy/M2-po-decyzjach-znak-email \
  naprawy/M2-scalenie-1-0 \
  naprawy/M2-po-reaudycie-2026-10-28 \
  naprawy/M2-telefon-do-main \
  ochrona-bazy \
  naprawy/duzy-tekst-trening \
  naprawy/R-RES-scenariusz-symulatora \
  notatki-recenzji-1-0 \
  naprawy/M2-tory-2026-10-28 \
  opisy-m5s1 \
  pilotaz-agent-pozy \
  podglad-920d917 \
  podglad-m5s1b \
  plan-1-0-2026-10-29 \
  podglad-m5s1c \
  podglad-m5s1 \
  plan-b-recenzja \
  podglad-klatki \
  podpisy-zrzutow-1-0 \
  poprawki-delt-raise \
  poprawki-p1 \
  poprawki-p3 \
  poprawki-p2 \
  postep-tygodnia-dni \
  poprawki-p4a \
  poprawki-p4b \
  przeglad-tlumaczen-wznow \
  pozy-dol \
  proces-zb018 \
  pozy-dynamiczne \
  pozy-gora \
  przekazanie-koordynatora-2026-10-23 \
  przeklad-2026-10-26 \
  przeklad-workflow \
  r007-manifest-hak \
  przeniesienie-zb004 \
  przeklad-kontekst \
  recenzja-lok-2026-10-26 \
  redesign/trening-2026-10-21 \
  r101/klatka \
  r101/ios-jest \
  slownik-terminow \
  rodziny-mobilnosc \
  role-miesni \
  sanie-zrodla \
  straznik-paczki \
  silnik-chod-cykliczny \
  slownik/faza-pauza-wip \
  straznik-paczki-skroty \
  slownik/faza-pauza \
  technika-rozwinieta-1-0 \
  strona-eksport-naprawy \
  strona-filtr-audytu \
  tlumaczenia-m1-031-045 \
  tlumaczenia-przeglad-api-2210 \
  telefon-1033 \
  teksty-wskazowek-1-1 \
  tryb-cichy-wskazowka \
  walidacja-apple-bez-wysylki \
  wersja-1-0-1 \
  tresc-plyo-sanie \
  tresc-kart-lm \
  wersja-1-0-1-wip \
  widocznosc/opis-ceny-2026-10-21 \
  ui-krytyczne/przeglad-api \
  widocznosc/opisy-2026-10-22 \
  widocznosc/trening-2026-10-21 \
  wydanie-1-0-0 \
  wydanie-1-0-b2 \
  wydanie-1-0-teksty \
  z02-przeklad-1-0 \
  zamkniecie-r017 \
  zgloszenie-1-0-materialy \
  zobowiazania \
  zb010/sdk \
  zrzuty-1-0 \
  zrzuty-sklep-jezyki \
  zrzuty-ramki-lamanie \
  zrzuty-zegarka-parowanie \
  asc-kontrola-m5s1 \
  audyt/m1-reaudit-2026-10-28 \
  audyt-m1-1-0-2026-10-27 \
  audyt/cwiczenia-grafiki-2026-10-31 \
  audyt/cwiczenia-grafiki-p5 \
  audyt/weryfikacja-2026-10-31 \
  claude/gallant-dirac-iryk11 \
  dowod-asc-metadane \
  dowod-walidacja-neg \
  dowod-walidacja-poz \
  f020-sklep \
  f020-garmin \
  koordynator/stan-1-0 \
  m3-wejscie/029-ikony \
  naprawy/M2-po-decyzjach-eksport-figur \
  pokrycie-katalogu \
  pozy-1-1 \
  review-notes-1-0 \
  strona-eksport \
  telefon-2026-10-28
```

## Archiwum w tagach (20)

| Gałąź → tag archiwum/… | SHA | Ostatni commit |
|---|---|---|
| `asc-kontrola-m5s1` | b3a131ee19 | 2026-10-22 |
| `audyt/m1-reaudit-2026-10-28` | 02115dc15a | 2026-10-28 |
| `audyt-m1-1-0-2026-10-27` | ab4c0a54e2 | 2026-10-29 |
| `audyt/cwiczenia-grafiki-2026-10-31` | 1a09dbba47 | 2026-10-31 |
| `audyt/cwiczenia-grafiki-p5` | b16f61c5cb | 2026-10-31 |
| `audyt/weryfikacja-2026-10-31` | a1e50b806f | 2026-10-31 |
| `claude/gallant-dirac-iryk11` | 87ad00e4f1 | 2026-10-28 |
| `dowod-asc-metadane` | ee04e26327 | 2026-10-22 |
| `dowod-walidacja-neg` | 6a10f05055 | 2026-10-22 |
| `dowod-walidacja-poz` | 82a1205ce9 | 2026-10-22 |
| `f020-sklep` | b9ce5c4381 | 2026-10-19 |
| `f020-garmin` | 4e2c5866d0 | 2026-10-13 |
| `koordynator/stan-1-0` | 5e11abc9f6 | 2026-10-31 |
| `m3-wejscie/029-ikony` | e3b0323d94 | 2026-10-20 |
| `naprawy/M2-po-decyzjach-eksport-figur` | 34df69f760 | 2026-10-28 |
| `pokrycie-katalogu` | b82baeb131 | 2026-10-28 |
| `pozy-1-1` | 52519d51ff | 2026-10-26 |
| `review-notes-1-0` | 2ca29fff5a | 2026-10-27 |
| `strona-eksport` | a4ba3320e7 | 2026-10-26 |
| `telefon-2026-10-28` | 5a43fd89e7 | 2026-10-28 |

## Usunięte scalone (184)

| Gałąź | SHA |
|---|---|
| `anonimizacja-paczki` | e6bedc27fb |
| `asc-kontrola` | 098d9d9368 |
| `acg-003/przeklad-zdan` | e369cd7ee8 |
| `asc-kontrola-404-sha` | 2e612e2361 |
| `acg-002/skrot-recenzji` | b46efa9e59 |
| `acg-006/skullcrusher-gryf` | bf20488a33 |
| `acg-001/vpull-pelny-wyprost` | 1c683be3bc |
| `acg-v2/dane-planned` | f109af9f86 |
| `acg/fale-napraw` | 6330c7213a |
| `asc-metadane-wgranie` | c1a3349e33 |
| `asc-kontrola-oczekiwane` | 188a89a314 |
| `asc-zrzuty-naprawa` | b1746ea1c5 |
| `backlog-figur` | be89aae229 |
| `brzmienia-t002-t003-t032` | 16feba467e |
| `claude/optimistic-clarke-9tj0im` | c2121423d1 |
| `czysta-1.0` | e3c1af1462 |
| `decyzje-2026-10-25` | 52cfb784b9 |
| `decyzje-m1-2026-10-23` | a581c1019b |
| `decyzja-1-1-zamiast-1-0-1` | c78058339f |
| `claude/serene-gauss-wtardk` | 851f0dafac |
| `decyzje-1-1-przygotowanie` | 7a94645fbb |
| `docs-dziennik-1033` | 1ea763181f |
| `docs-maks-serii` | e1bfed7345 |
| `docs-noc-2026-10-29` | 817eab8403 |
| `dowod-przeglad-api-2210` | 9895548867 |
| `docs-po-95` | 9a136877b2 |
| `docs-zegarek-czekamy` | 38b53cbbdc |
| `ekran-trening-naglowek` | 30e57c260a |
| `fix-edit-history-czas` | 8cb8a47326 |
| `e2e/fix-0211` | cce0ece94b |
| `figury-kontrakt-r4` | 7d56de1f41 |
| `formalnosci/trening-2026-10-21` | 89b3ebe4bf |
| `gemini-figury` | 517174d5e2 |
| `fala1/zb025-pelna-karta-nazwy-en` | d2002a3240 |
| `fix/ci-czas-sdk58` | 238634aa61 |
| `grafiki-cwiczen` | 9d611b84ea |
| `gemini-vertex` | f511ebfdf1 |
| `gemini-polecenia` | c472269fc6 |
| `grafiki-dane-ui` | 66bcbc71ba |
| `grafiki-wyciskanie-2026-10-26` | bfb9f84a67 |
| `grafiki-sprzet` | 1ea6fe1704 |
| `hak-worktree` | 06df4e431b |
| `integracja-1-1-g6a` | 84f0a76e9a |
| `h1/verify-docs-znacznik` | db2dc91894 |
| `integracja-1-1-g6b` | 552df205dd |
| `integracja-1-1-g6c` | b2067b8c1f |
| `integracja-1-1-g6d` | 6bee23f7b0 |
| `integracja-1-1-g6e` | 55ba40cbcc |
| `integracja-2026-10-23` | 901ab58bfe |
| `integracja-1-1-g6f` | fefb23169f |
| `integracja-2026-10-25` | 3670e4c7e8 |
| `integracja-2026-10-26` | f12d6e423d |
| `integracja-1-1-g6g` | 15e3ab45ba |
| `integracja-2026-10-27` | d309204d1f |
| `integracja-1-1-main-wip` | b6f06d2133 |
| `integracja-2026-10-26b` | c56ef5d1de |
| `jezyk-live-activity` | 48b98150cd |
| `jezyk-naturalny-zrodla` | 4d24cc0672 |
| `koordynacja-2026-10-21b` | 591a6faf4f |
| `jakosc-r2` | 3c4ccd56d6 |
| `koordynacja-2026-10-22` | ace5563b61 |
| `lekcja-sandbox-testflight` | 698d887f8e |
| `lekcja-update-branch` | d8a95d638c |
| `m3-kopia/scalenie-main-8b2c14c` | 0549a826dd |
| `karta-katy-fazy` | d5bcd05739 |
| `monetyzacja-1-0` | 1f679b29e1 |
| `metadane-1-0` | 9246e40555 |
| `monetyzacja-badanie-2026-10-22` | 32da478bd5 |
| `monetyzacja-m5s1` | 31eeba291e |
| `metadane-1-0-recenzja` | 1ee29eda92 |
| `naprawa-e2e-26b` | 764015f133 |
| `naprawa-e2e-main-2026-10-26` | 5de9d96ecb |
| `naprawa-e2e-pierwszy-tydzien` | ccfbe15a3b |
| `naprawa-e2e-maly-2026-10-26` | 870264e60a |
| `naprawa-m1-028-zegarek-ack` | d26c6638a1 |
| `naprawa-m1-031-asekuracja` | 41b7917c7d |
| `naprawa-m1-045-app-review` | 60de4bbb72 |
| `naprawa-figury-1-0` | 03723210ee |
| `naprawa-m1-048-asc-release` | d847e3b1a7 |
| `naprawa-m1-dec03-generator` | 8af8b14156 |
| `naprawa-m1-dec07-teksty` | 95fa19c4d3 |
| `naprawa-m1-dec07-ui` | ade64673a8 |
| `naprawa-m1-p2-kod` | 39d8ce8a08 |
| `naprawa-m1-p2-teksty` | cdc1486107 |
| `naprawa-m1-p2-tresci` | 5102ba0fd3 |
| `naprawa-main-2026-10-26` | f07c175652 |
| `naprawa-nocne-2026-10-25` | b3bce35488 |
| `naprawa-telefon-1030-a` | bf79d9e558 |
| `naprawa-telefon-1030-b` | 38a6af3fb2 |
| `naprawa-zakup-m5s1` | 739071a277 |
| `naprawy-1-0` | 234f82f5db |
| `naprawy-audyt-1-0` | bc28bc33a0 |
| `naprawy/M2-hinge-szczelina` | bd2233b44f |
| `naprawy/M2-jm-press-2026-10-28` | c9847b6812 |
| `naprawy/M2-koordynator-napraw-2026-10-27-p1` | 451862d779 |
| `naprawy/M2-koordynator-napraw-2026-10-27-p2` | 4b6df8e671 |
| `naprawy/M2-koordynator-napraw-2026-10-27-p2-ax5` | 4c7324304c |
| `naprawy/M2-koordynator-napraw-2026-10-27-p3` | b3e580eafb |
| `naprawy/M2-koordynator-napraw-2026-10-28-p1` | a41cdbcf87 |
| `naprawy/M2-koordynator-napraw-2026-10-28-p2` | f5af3bee61 |
| `naprawy/M2-noc-2026-10-28` | c5af60625e |
| `naprawy/M2-po-decyzjach-jednostki` | 5ca7577860 |
| `naprawy/M2-po-decyzjach-podpis` | 89ff9fa5e7 |
| `naprawy/M2-po-decyzjach-figury` | 31ad7c05a1 |
| `naprawy/M2-po-decyzjach-pochodne` | 7a0a92e7ed |
| `naprawy/M2-po-decyzjach-znak-email` | 0311996e0b |
| `naprawy/M2-scalenie-1-0` | 513ea04082 |
| `naprawy/M2-po-reaudycie-2026-10-28` | 3864a7ae18 |
| `naprawy/M2-telefon-do-main` | 352b66650e |
| `ochrona-bazy` | 5bd0a7862e |
| `naprawy/duzy-tekst-trening` | 0a566a1848 |
| `naprawy/R-RES-scenariusz-symulatora` | 6ea484bff9 |
| `notatki-recenzji-1-0` | 52ce616f2d |
| `naprawy/M2-tory-2026-10-28` | b704e30922 |
| `opisy-m5s1` | f822cffd0f |
| `pilotaz-agent-pozy` | d5ca2b645a |
| `podglad-920d917` | 920d917b8b |
| `podglad-m5s1b` | b31bcd3b22 |
| `plan-1-0-2026-10-29` | 57444ea57a |
| `podglad-m5s1c` | f2b0525f65 |
| `podglad-m5s1` | 97882a0c3d |
| `plan-b-recenzja` | a56aaa184c |
| `podglad-klatki` | 7cc9b86c5b |
| `podpisy-zrzutow-1-0` | d13da6f4a6 |
| `poprawki-delt-raise` | bbb5f341f9 |
| `poprawki-p1` | 96ceaebaa5 |
| `poprawki-p3` | 28381fb945 |
| `poprawki-p2` | 64ba5f2e4b |
| `postep-tygodnia-dni` | 66eb364613 |
| `poprawki-p4a` | c7015fbcb1 |
| `poprawki-p4b` | 252392c9a2 |
| `przeglad-tlumaczen-wznow` | aa864e934e |
| `pozy-dol` | a4591d3777 |
| `proces-zb018` | 94bfef23b3 |
| `pozy-dynamiczne` | 8f8f97a461 |
| `pozy-gora` | b9d6808084 |
| `przekazanie-koordynatora-2026-10-23` | 38c46d5e7c |
| `przeklad-2026-10-26` | 34a1978e43 |
| `przeklad-workflow` | a9667e5710 |
| `r007-manifest-hak` | f8b00ca451 |
| `przeniesienie-zb004` | f664a07b84 |
| `przeklad-kontekst` | f9b09264e3 |
| `recenzja-lok-2026-10-26` | f4ea7e4763 |
| `redesign/trening-2026-10-21` | 29266c9a58 |
| `r101/klatka` | f9a4718d1e |
| `r101/ios-jest` | 15e8ac8af2 |
| `slownik-terminow` | 350a54695d |
| `rodziny-mobilnosc` | ff7332e779 |
| `role-miesni` | 77a6e28580 |
| `sanie-zrodla` | e44921de4e |
| `straznik-paczki` | 11dcbe564e |
| `silnik-chod-cykliczny` | 89c67ab9e0 |
| `slownik/faza-pauza-wip` | e7ce5f1e23 |
| `straznik-paczki-skroty` | cf5f228743 |
| `slownik/faza-pauza` | e7ce5f1e23 |
| `technika-rozwinieta-1-0` | 60d19b93af |
| `strona-eksport-naprawy` | f8429e641c |
| `strona-filtr-audytu` | 2463e83bf6 |
| `tlumaczenia-m1-031-045` | 826bb19b54 |
| `tlumaczenia-przeglad-api-2210` | c816348c6e |
| `telefon-1033` | cd151b8e1d |
| `teksty-wskazowek-1-1` | afbfc13826 |
| `tryb-cichy-wskazowka` | b056bac1bc |
| `walidacja-apple-bez-wysylki` | d136ac26a1 |
| `wersja-1-0-1` | dba56fce7e |
| `tresc-plyo-sanie` | 4d4092f45e |
| `tresc-kart-lm` | 8089a81660 |
| `wersja-1-0-1-wip` | 4e06a60f38 |
| `widocznosc/opis-ceny-2026-10-21` | eb028bf86a |
| `ui-krytyczne/przeglad-api` | 6b3d23d538 |
| `widocznosc/opisy-2026-10-22` | 6a7a70fc07 |
| `widocznosc/trening-2026-10-21` | 77b4247419 |
| `wydanie-1-0-0` | c0b8d6d58b |
| `wydanie-1-0-b2` | e6d0375d0a |
| `wydanie-1-0-teksty` | af0ae67a7d |
| `z02-przeklad-1-0` | f7cad15146 |
| `zamkniecie-r017` | b5baac2b18 |
| `zgloszenie-1-0-materialy` | 0587f2052b |
| `zobowiazania` | b542d0e535 |
| `zb010/sdk` | db64c5bd1a |
| `zrzuty-1-0` | 2f06c33f09 |
| `zrzuty-sklep-jezyki` | 0b5f475eaf |
| `zrzuty-ramki-lamanie` | 0b5f475eaf |
| `zrzuty-zegarka-parowanie` | 886a1cc6c2 |

## Gałęzie lokalne usunięte (41; zawartość na GitHubie albo zastąpiona nowszą wersją w `badania/lokalne-0211`)

- `badania/curl-2-lokalnie` 84f35321ce
- `badania/curl-lokalnie` b71a691142
- `badania/delt-raise-2-lokalnie` b83726d09c
- `badania/delt-raise-lokalnie` 6bd8597c27
- `badania/lokalne-0211` 9eaf9a558a
- `badania/lunge-2-lokalnie` d0450263e2
- `badania/lunge-lokalnie` 6220205867
- `badania/szczeble-lokalnie` 785a7a7dea
- `badania/triceps-2-lokalnie` 1e49e155d5
- `badania/triceps-lokalnie` 042b639646
- `ci/mechanizmy-0211` fe97a1cbd4
- `e2e/57-58` 2d7b5aa678
- `e2e/fix-0211` cce0ece94b
- `fala1/zb025-pelna-karta-nazwy-en` c093b2aae0
- `fala25/poprawki-stykow` 70bf2ea142
- `fala25/pull-up` db0ea8e782
- `fix/ci-czas-sdk58` 238634aa61
- `fix/verify-zb025` cabe74e1d1
- `lok/pullup-c-poprawki` bc46bce398
- `pilot/zestawy-ogolne` 600290730a
- `pullup/uproszczenie-c` a467515f23
- `worktree-agent-a0669fe4fc05fbec5` 2e4b0f8284
- `worktree-agent-a0d50f2414ebed555` 2e4b0f8284
- `worktree-agent-a1062781079bd5387` 2e4b0f8284
- `worktree-agent-a1a20736998511bfe` 2e4b0f8284
- `worktree-agent-a43697820a561d2a6` 2e4b0f8284
- `worktree-agent-a6633ba9c38357a0f` 2e4b0f8284
- `worktree-agent-a6bc31021b99d2aab` 2e4b0f8284
- `worktree-agent-a71017dc066a09dcd` 2e4b0f8284
- `worktree-agent-a7332f77cc6ead121` 2e4b0f8284
- `worktree-agent-a89019caf1c28c0c5` 2e4b0f8284
- `worktree-agent-aa0cf6c65318e6038` 2e4b0f8284
- `worktree-agent-aaa45f5869b06afed` 2e4b0f8284
- `worktree-agent-aaa720089206e1a61` 2e4b0f8284
- `worktree-agent-ab4cdff55a826ef8a` 2e4b0f8284
- `worktree-agent-ab67f4b77cdc56525` 2e4b0f8284
- `worktree-agent-ab725cc87bc0c4452` 2e4b0f8284
- `worktree-agent-adca77759b82124db` 2e4b0f8284
- `worktree-agent-ade38c7372ae30adb` 2e4b0f8284
- `worktree-agent-ae631c473887da039` 2e4b0f8284
- `zb010/sdk` db64c5bd1a
