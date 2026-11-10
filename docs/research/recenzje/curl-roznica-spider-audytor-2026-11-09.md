# Recenzja różnicy v2 `curl` — stopy w Spider Curl ×2 (audytor, 09.11.2026)

**Werdykt rodziny: `wyswietlana`.** Brak znalezisk KRYTYCZNYCH, WYSOKICH i ŚREDNICH; 1 uwaga NISKIE (bez drogi przez UI).
Recenzent: audytor (L-047; nie pisał poprawki). Autor: programista partii 1 (f4ec3263).

## Metoda
- Baza: `bb1072f3` (wpis v2.curl w integracji), zmiana: `0b390518` (figury/partia-1). Czyste kopie `git archive`: `/home/user/rev-p1/curl-baza`, `/home/user/rev-p1/curl-roznica`.
- Zmiana w kodzie: `scripts/figures/agent-pozy/gora.mjs` (nowa `stopyNaPalcach`, `STOPA_LEZY_PODBICIE = -75`, `STOPA_LEZY_ODSUN = 2`), `scripts/figures/agent-pozy/curl.mjs` (wywołanie w `spider()` po `lezyPrzodem`). `delt_raise` nie oceniane (zgodnie ze zleceniem).
- Dane: `lib/figures/v2/poses/curl.json` — 34/34 ćwiczenia; kontrakt, lista i 32 ćwiczenia identyczne; w Spider Curl i Spider Curl (sztanga) zmieniły się wyłącznie `nogi.{R,L}.kostka` i `nogi.{R,L}.podbicie`.
- Arkusze ze śladem (`arkusz-slad.mjs`, kadry co 0,05): 34 ćw. × side/front × jasny/ciemny = 136 PNG na kopię. `cmp`: 64/68 na motyw identyczne bajtowo; różne tylko `Spider-Curl-{side,front}.png` i `Spider-Curl-sztanga-{side,front}.png`. Różnica pikseli obejmuje cały kadr (zmiana obrysu sceny przesuwa skalę), co zgadza się z różnicą danych ograniczoną do stóp.
- Nakładka (`arkusz-nakladka.mjs --family curl`): 96 PNG na kopię, różne tylko 4 arkusze Spider Curl.
- Pomiar `frameAt`/`jointAngles`/`checkFrame` w 201 kadrach (u co 0,005), obie strony, oba Spider Curl (plik pomocniczy w kopii, usunięty).
- Skróty: `node scripts/zrodla-runtime.mjs --skroty` w obu kopiach.

## Ocena Spider Curl ×2
| Miara | Wartość (0b390518) |
|---|---|
| zgięcie podeszwowe (`jointAngles.ankle`) | −25,3° (stałe) — w zakresie człowieka, stopa ok. prostopadle do goleni jak w podporze |
| palce / pięta nad podłogą | 0,34 cm / 24,5 cm — stopa na palcach, pięta w górze |
| kolano | 25,2°, ugięte ku podłodze (kolano 9,8 cm pod linią biodro–kostka) |
| biodro | −9,8° (limit kontraktu −17°) |
| łokieć | 1,5° → 124,6° (bez zmian) |
| nogi × ławka | odstęp 3,9 cm, bez przenikania |
| `checkFrame` | brak zgłoszeń (kości, zasięg, podłoga, przenikanie, chwyt) |

Obejrzane w pełnej rozdzielczości (kadr u=0 powiększony ×3, side jasny; side i front ciemny dla wersji ze sztangą; front jasny cały arkusz): stopy na palcach, palce dotykają podłogi, pięty w górze, w ciemnym motywie stopy widoczne. Widok z przodu: stopy jako wąskie pionowe kształty pod miednicą — spójne z rzutem stopy ustawionej pionowo. Ślad toru (hantel R / środek gryfu): łuk wokół stałego łokcia, bez zawróceń i skoków, bez zmian względem bazy. Tułów, ramiona, ławka, gryf i talerze bez zmian. Wada z recenzji row r2 (stopa płasko palcami od osoby, ok. 119°) usunięta.

Nakładka: `curlElbowLimb` (łuk łokcia) bez zmian, nie dotyczy nóg; brak nowych elementów.

## Zestawy i karty
Skróty `zestawy.*` i `karty.*` ćwiczeń curl identyczne w obu kopiach i zgodne z `docs/research/figury-recenzja.json` (28 zestawów, 6 kart) — nowe wpisy niepotrzebne. `v2.curl`: 39470f3a2918 → **3380994ca6df** (oczekiwane). `liczba` z `assignAll()` = 36 (34 z rysunkiem, bez rysunku: Zottman Curl, Zottman Preacher Curl).

## Testy (K14)
- `tests/figures-v2-row-p1.test.ts` „W1-r2” obejmuje oba Spider Curl i ma negatyw (stopa płasko > 60°) — dobry test regresji. Zmiany w `tests/` dot. curl to rozszerzenia list rodzin, nie poluzowania progów curl.
- W kopii 0b390518 przeszły: `figures-v2-row-p1`, `figury-generator-odtwarza` (curl w zakresie — generator odtwarza plik), `figury-curl-poprawki-r2`, `figury-curl-wspolne-w1-w2`, `figures-v2-nakladka-curl-pullup`.
- `figures-v2-tor.test.ts` **czerwony w 0b390518**, ale wyłącznie dla 17 ćwiczeń `overhead_press` (side, odchylenie toru 9,6–12,1 cm, np. „Overhead Press (sztanga)|side: 9.7 cm”); żadne ćwiczenie curl nie jest na liście. Poza zakresem tej recenzji — sygnał dla koordynatora (scalenie partia-1-ohp).

## Znaleziska
| # | Poziom | Pewność | Realność | Opis | Dowód | Kierunek |
|---|---|---|---|---|---|---|
| 1 | NISKIE | 90% | teoretyczny (brak drogi przez UI; luka w strażniku danych) | `curl.zakres_wyjatki["Spider Curl"].hipMin = −45` z powodem „uda leżą poziomo na siedzisku” jest nieaktualny: biodro wynosi już −9,8° (w limicie −17°). Wyjątek pozwoliłby na regresję do −45° bez sygnału. | `data/zrodla/figury-sens.json` (kopia 0b390518), pomiar `jointAngles.hip` | usunąć wyjątek (i zmienić deklarację w teście „deklaracje” tak jak dla row) — backlog |

## Tabela ćwiczeń
| Ćwiczenie | Werdykt |
|---|---|
| Spider Curl | wyswietlana |
| Spider Curl (sztanga) | wyswietlana |
| pozostałe 32 ćw. curl z rysunkiem | bez zmian (arkusze identyczne bajtowo) — werdykt z wpisu 08.11 utrzymany |
