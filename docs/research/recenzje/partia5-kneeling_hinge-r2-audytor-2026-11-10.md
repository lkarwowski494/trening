# Recenzja niezależna rodziny v2 `kneeling_hinge` — partia 5, runda r2 (audytor, 10.11.2026)

Stan zamrożony: `figury/partia-5-kneeling_hinge` @ 517694cf (worktree odłączony); baza r1 c483874a/ded30dda. Autor rysunku: programista (subagent, sesja session_01T66VByZrLpWxNF8yF3gpgu); poprawka S1: inny programista. Recenzent: audytor (subagent).

**Werdykt: `wyswietlana`.** S1 z r1 naprawione. Nowe: N1 NISKIE (asercja testu słabsza niż jej nazwa).

Skróty (`zrodla-runtime.mjs --skroty`, worktree recenzenta): v2 `kneeling_hinge` bd7c66c9bb27 → **17d7fac90626**; zestaw `Seated Good Mornings` **6d8665e4bef9** (bez zmian); poza tym żaden skrót się nie zmienił względem r1. `liczba` = 2.

## Zmiana (diff ded30dda..517694cf)
Skrzynia `top` 46 → 47,3 cm w `poses/kneeling_hinge.json` i w generatorze (`agent-pozy/kneeling_hinge.mjs`, miednica dalej 57,8 cm); nowy test styku; odcisk złoty tylko Seated Good Mornings z adnotacją w `figures-v2-zgodnosc-wsteczna`.

## Sprawdzenie
- **S1 naprawione**: `gap(pelvis, box)` = 1,00 cm, `gap(thigh, box)` = 0,79 cm; `contactsOf` zawiera `seat` w u 0; 0,25; 0,5; 0,75; 1 (test: 21 klatek). `checkFrame` = [] (bez przenikania).
- **Arkusz własny** `rec-kneeling_hinge-r2/Seated-Good-Mornings-side.png` (21 kadrów, pełna rozdzielczość, u 0 i u 1 ×3, styk ×8): różni się od r1 (`cmp`) tylko skrzynią; obrys pośladka leży na skrzyni. Ciało bez zmian: stopy na podłodze (pięty i palce w styku), kolano [40,8; 48,0] i biodro 78,2° → 119,5° jak w r1, tułów 2° → 44°, zgięcie kręgosłupa 0°. Sztanga 12,8 cm za barkami / 3,0 cm poniżej w każdej klatce, ślad = chwyt (0,0 cm); w animacji błędu gryf 12,9–13,2 cm od barków.
- **Przypadek negatywny**: po przywróceniu `top` 46 nowy test oblewa 22/22 — odtwarza wadę.
- Testy `--runInBand`: styk-siedzenie (22), zgodność wsteczna (626), generator-odtwarza (10), nakładka (4), tor (198) — zielone.

## Znalezisko
| ID | Poziom | Pewność | Opis | Realność | Miara |
|---|---|---|---|---|---|
| N1 | NISKIE | 95% | Test „odstęp ≤ 1 cm” sprawdza `abs(seat.p[1] − box.top) ≤ 12` (środek miednicy a wierzch skrzyni, dziś 10,5); przy promieniu 9,5 dopuszcza odstęp do 2,5 cm, a od dołu do −12 (przenikanie). Faktyczną górną granicę (≤ 1,5 cm) daje pierwszy test (obecność `seat`), przenikanie łapie `checkFrame` w innych testach — luka K14 tylko w nazwie/asercji, nie w ochronie. | teoretyczny (tylko przy zmianie danych) | Poprawka: `gap(pelvis, box)` z `bodyColliders`/`equipColliders` w [0; 1] cm. Backlog. |

Zestaw ogólny (K12): zdania `hinge.back`, `gm.light`, `mis.roundBack` nadal zgodne z rysunkiem (ciało i ruch bez zmian). Nakładka: ocena z r1 bez zmian (obie reguły „analogia”).
