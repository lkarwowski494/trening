# Ponowna recenzja ruchu r2: Sled Push i Sled Drag (Harness), tryb cykliczny marszu, 27.10.2026

Recenzent niezależny („recenzent sanie r2”). Nie czytałem README podglądów, komentarzy w `agent-pozy` ani linii stanu agentów. Poprzednia recenzja: `recenzje-1-1/ponowne/chod-cykliczny.md`, uwaga 1 (lot obu stóp u 0,02–0,25).

## Co sprawdziłem

- **Gałąź:** `origin/silnik-chod-cykliczny` @ 89c67ab9, odłączony worktree `/home/user/wt/rec-sanie` (usunięty po pracy). Lokalnie bez jest (pkt 12); pomiary jednym wątkiem przez `keyframeFrame` z `scripts/figures/v2-build.mjs`.
- **Render własny: 17 klatek (u 0 → 2 co 1/8) × 2 widoki (bok, przód) × 2 ćwiczenia**, `dataShapes` + `svgDocument`; plus powiększenia klatek u 0; 0,125; 0,25. Pliki poza repo: `/tmp/claude-0/rec-sanie/png/`; skrypty: `/tmp/claude-0/rec-sanie/s/`.
- **Liczby:** siatka 1/400 połowy (801 próbek pętli) dla podparcia; siatka 1/80 (2 pętle z zawinięciem) dla ślizgu, `stanceAdvance` i `loopJoinGap`.
- **CI:** tests.yml dla 89c67ab9 — przebieg **40506670974, w toku** w chwili recenzji (start 12:48 UTC). Poprzedni SHA e3e7620d: 40499445415 zielony. Wynik dla 89c67ab9 [DO USTALENIA] — sprawdza koordynator.

## Wynik

| Werdykt | Liczba | Ćwiczenia |
|---|---|---|
| OK | 0 | — |
| OK z uwagą | 2 | Sled Push, Sled Drag (Harness) |
| BŁĄD | 0 | — |

**Uwaga 1 z poprzedniej recenzji (lot obu stóp) jest usunięta w obu ćwiczeniach.**

## Tabela

| Ćwiczenie | Ruch | Treść karty | Werdykt | Szczegóły |
|---|---|---|---|---|
| Sled Push | zawsze podparcie: maks. min(podeszwa) 0,92 cm (u 0,695), 0/801 próbek bez podparcia; obunóż 4,6% próbek (u ≈ 0,99–1,013 i lustrzanie); ślizg w kontakcie w przód maks. 0,4 cm (kostka) / 0,59 cm (punkt kontaktu, przy lądowaniu), z 0 cm; cofnięcie 81,6 cm; styk połówek 0 cm, zawinięcie u 2 → 0 0 cm, maks. skok między klatkami 1/80 2,2 cm; tułów 33° stały, dłonie na słupkach, linia stopa–biodro–bark prosta przy odbiciu (u 0, 1) | bez zmian od r1: 0 wskazówek (`sled.lean`, `sled.legs` bez tekstu w `pl.json`) | OK z uwagą | uwagi A, B; r1 uwagi 4 i 5 bez zmian |
| Sled Drag (Harness) | jak Push: maks. min(podeszwa) 0,92 cm, 0/801 bez podparcia, obunóż 4,6%; ślizg maks. 0,4 / 0,59 cm; styk 0 cm, maks. skok 2,3 cm; tułów 34° stały, lina od sań do pasa/bioder, ręce przeciwnie do nóg | jak Push | OK z uwagą | uwagi A, B; r1 uwagi 2, 4, 5 bez zmian |

Pochylenie: 33–34° od pionu, stałe w całej pętli. Przy pchaniu za wysokie słupki i ciągnięciu na szelkach wiarygodne (ciało w linii z tylną nogą przy odbiciu, na obrazie czytelne „pochylenie w ciężar”).

## OK z uwagą (backlog 1.1, nie blokuje)

A. **Postój stopy podporowej przez ¼ półkroku (u 0 → 0,25).** Waga: NISKIE. Realność: realny (każde wyświetlenie), mało widoczny.
   - Kostka/palce stopy L w kontakcie stoją względem miednicy na x = 24,0 cm od u 0 do 0,25 (średnia prędkość cofania 0,00–0,06 cm/klatkę 1/80), potem cofają się 1,1–2,1 cm/klatkę. Ciało w tym czasie „nie idzie do przodu”: ruch sań jest skokowy (stop-start w każdym kroku, ok. 250 ms przy 1 s/krok).
   - To nie jest ślizg ani moonwalk (kierunek poprawny), tylko nierówna prędkość. Przy ciężkich saniach pulsowanie prędkości jest naturalne, pełne zatrzymanie mniej.
   - Propozycja: rozłożyć cofanie stopy podporowej także na u 0–0,25 (np. ok. 0,8–1 cm/klatkę), skracając odpowiednio dalszą część. Reguła mogłaby sprawdzać minimalną prędkość cofania w kontakcie przy stałej miednicy. Pewność: 55%.
B. **Podwójne podparcie bardzo krótkie (ok. 2,5% półkroku).** Waga: NISKIE. Tylna stopa odrywa palce już przy u ≈ 0,013 i potem przez u 0,013–0,125 „sunie” nisko nad podłogą (palce 2,6–4,4 cm, x −58 → −54). Na klatkach wygląda poprawnie (bok u 0,125: tylna stopa uniesiona, przednia płasko), więc to tylko zgodność z chodem z oporem, gdzie obunóż trwa dłużej. Pewność: 40%.

## Szczelność reguł

Nowa reguła `marsz_zawsze_podparcie` jest w `tests/figures-v2-chod-cykliczny.test.tsx` (wszystkie ćwiczenia cykliczne, 2 × 160 próbek, próg `CONTRACT.cycle.contactCm`) — pokrywa uwagę 1 z r1. Moje pomiary niezależne (siatka 1/400) potwierdzają 0 klatek bez podparcia. Uwagi A nie łapie żadna reguła (`stanceAdvance` mierzy tylko ruch w przód).

## Rodzina gotowa do statusu „zatwierdzona” (ruch)

- **sled_throw (Sled Push, Sled Drag):** tak, pod warunkiem zielonego tests.yml 40506670974; uwagi A, B oraz r1 2, 4, 5 do backlogu 1.1.
