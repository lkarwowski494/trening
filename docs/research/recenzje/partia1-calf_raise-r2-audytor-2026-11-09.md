# Recenzja niezależna rodziny v2 `calf_raise` — runda r2 (audytor, 09.11.2026)

**Werdykt rodziny: wyswietlana** — 0 KRYTYCZNYCH, 0 WYSOKICH, 0 ŚREDNICH, 1 NISKIE.
Znaleziska WYSOKIE z r1 zamknięte: W3 (Calf Raise (linki)) poprawione w danych; W1 i W2 (Standing Calf Raise, Seated Calf Raise) wyłączone z aplikacji przez `V2_WSTRZYMANE` (decyzja koordynatora A, docs/18 09.11.2026) — ich ruchu w r2 nie recenzuję, wpis v2 obejmuje 10 pokazywanych ćwiczeń. NISKIE z r1: N1 (Łydki na stopniu bez podpory), N2 (tautologia w przypadku negatywnym), N3 (luki w teście toru i brak K7) — zamknięte.

## Metoda
- Kopia: `git archive 4170ecd9` (gałąź figury/partia-1-calf) → `/home/user/rev-p1/calf_raise-r2`; baza r1 `dfae8739`. Autor: programista partii 1; recenzent: audytor (L-047), nie pisał rodziny ani poprawek.
- Zakres zmian (`git diff dfae8739..4170ecd9`): pozy tylko „Łydki na stopniu” (ściana `przed` x 40, dłonie [37; 137,1; ±16]) i „Calf Raise (linki)” (wyciąg x 105 → 16); `figure.ts` — dwa wpisy `V2_WSTRZYMANE`; komentarz nakładki; testy; cele pokrycia. Silnik bez zmian.
- `assignAll()` → 13 ćwiczeń rodziny; 12 z pozą v2; 10 pokazywanych (Standing i Seated Calf Raise wstrzymane: `shownFigureSpec` = null przy otwartej bramce, test rodziny); Smith Machine Reverse Calf Raise bez figury.
- Arkusze własne: `arkusz-slad.mjs` 10 ćwiczeń × widok side × 21 kadrów, motyw jasny i ciemny (20 PNG); `arkusz-nakladka.mjs --family calf_raise` 22 PNG. Porównanie bajtowe (`cmp`) z arkuszami r1: 8 ćwiczeń bez zmian pozy ma arkusze identyczne bajtowo w obu motywach i w nakładce (ocena r1 obowiązuje); różnią się tylko arkusze Łydki na stopniu i Calf Raise (linki) — obejrzane w pełnej rozdzielczości (wycinki ×3 kadrów u = 0 i 1: `arkusze/crop/ls-u0.png`, `ls-u1.png`, `lk-u0.png`, `lk-u1.png`), oba motywy i nakładka. Obejrzałem też całe arkusze Donkey Calf Raise i Single Leg Calf Raise.
- Liczby z `frameAt`/`jointAngles` w u = 0; 0,5; 1 (skrypt poza repo).
- Testy w kopii: `tests/figures-v2-calf-raise-p1.test.ts` + `tests/figures-v2-wstrzymane.test.ts` — 75/75 zielone; `tests/cel-1-1-bez-ciezkich.test.ts` — 57/57 zielone.
- Skróty z `node scripts/zrodla-runtime.mjs --skroty` w kopii: v2.calf_raise `77aa8d8a6693`; zestawy.Donkey Calf Raise `58dfc0b13605`; karty.Łydki na stopniu `97256f2c49e7` (oba jak w r1 — treść bez zmian).

## Poprawki r1 — sprawdzenie
| r1 | Stan w 4170ecd9 | Dowód |
|---|---|---|
| W3 Calf Raise (linki) | zamknięte | wyciąg `x 16, y 22, z ±45` (dwa); chwyt R [0; 78,3 → 90,5; 24]. Linka w rzucie z boku 16° od pionu (u=0) → 13° (u=1); w 3D (z odchyleniem bocznym 21 cm) 25° → 21° od pionu, składowa pionowa naciągu ≥ 90%. Kolumny stoją z boku osoby (z ±45), nie w stopach; linka biegnie od dłoni na zewnątrz, nie przez nogę (K7 w teście rodziny zielony). Sylwetka pionowa, kostka +10,8° → −42,2°, kolano 5–7°. |
| W1 Standing / W2 Seated | wyłączone z aplikacji | `lib/figures/v2/figure.ts:51–53` (powody > 30 znaków), `shownFigureSpec` → null (`figure.ts:59`); test rodziny „wstrzymanie maszyn” |
| N1 Łydki na stopniu | zamknięte | ściana przed osobą x 40, obie dłonie na ścianie stale (137,1 cm), łokieć 107° → 95° przy wspięciu 14 cm — podpora dla równowagi zgodna z `calf.step` („przytrzymaj się czegoś dla równowagi”); kostka +20,9° → −42,2°, kolano 5–6°, stopień 8 cm |
| N2 | zamknięte | przypadek negatywny na danych: ślad z klatki przesunięty o 5 cm oblewa miarę |
| N3 | zamknięte | test toru obejmuje linki i gumę; nowy test odstępu K7 (≤ 0,3 cm, `PROG_STYKU`) z przypadkiem negatywnym na danych (Seated Calf Raise > 5 cm) |

## Znaleziska
| # | Poziom | Pewność | Realność | Ćwiczenie / widok / kadr | Miara | Kierunek naprawy |
|---|---|---|---|---|---|---|
| N1 | NISKIE | 90% | realny (widoczne na każdej karcie, kosmetyczne) | Łydki na stopniu i Single Leg Calf Raise / side / wszystkie u | `skrzynia` x0 −0,5…x1 48, `sciana` przed x 40 (lita dla x > 40) — stopień wchodzi 8 cm w ścianę; na rysunku ściana „stoi” na stopniu, a stopień wystaje za nią (`arkusze/crop/ls-u0.png`, `ls-u1.png`) | `x1` stopnia ≤ 40 (stopień dosunięty do ściany) albo ściana przy x ≥ 48 z dłońmi przesuniętymi o tyle samo. Backlog 1.1, bez wpływu na ruch. |

Bez znalezisk w ruchu 10 pokazywanych ćwiczeń: zakres kostki i kolana zgodny z regułami „wspiecie”, „kolana_proste”, „kolana_zgiete_siad” (`data/zrodla/figury-sens.json`) i z kartami; bez skoków; bez przenikania.

### Ślad Donkey Calf Raise
Bez zmian od r1 (arkusz identyczny bajtowo): ślad to punkt w nieruchomej dłoni na podporze (`contract.ts:330–332` — dłoń z `trzyma`), nie tor dźwigni na biodrach. Rysowany na karcie (`components/ExerciseFigureV2.tsx:30,36`). Ocena jak w r1: mały punkt, mylący, ale nie fałszuje ruchu (dźwignia i ciało poruszają się poprawnie) — **nie blokuje** „wyswietlana”; do ponownej recenzji śladu po scaleniu figury/slad-dzwignia (test rodziny trzyma Donkey na liście `CZEKA_NA_SLAD_DZWIGNI`).

## Tabela ćwiczeń
| Ćwiczenie | Kostka u=0 → u=1 | Kolano | Werdykt |
|---|---|---|---|
| Łydki na stopniu | +20,9° → −42,2° | 5–6° | wyswietlana (N1 kosmetyczne) |
| Smith Machine Calf Raise | +20,9° → −42,2° | 5–6° | wyswietlana (bez zmian od r1) |
| Calf Raise (sztanga) | +20,9° → −42,2° | 5–6° | wyswietlana (bez zmian) |
| Calf Raise (linki) | +10,8° → −42,2° | 5–7° | wyswietlana (W3 zamknięte) |
| Donkey Calf Raise | +20,9° → −42,2° | 5–6° (biodro 78–86°) | wyswietlana (ślad po figury/slad-dzwignia) |
| Band Calf Raise | +10,8° → −42,2° | 5–7° | wyswietlana (bez zmian) |
| Single Leg Calf Raise | +20,9° → −42,2° (R) | R 5–6°, L ~86° | wyswietlana (N1 kosmetyczne) |
| Seated Calf Raise (hantle) | +10° → −45,7° | 90–95° | wyswietlana (bez zmian) |
| Barbell Seated Calf Raise | +10° → −45,7° | 90–95° | wyswietlana (bez zmian) |
| Dumbbell Seated One-Leg Calf Raise | +10° → −45,7° (R) | 90–95° | wyswietlana (bez zmian) |
| Standing Calf Raise | — | — | wstrzymana (V2_WSTRZYMANE, poza zakresem r2) |
| Seated Calf Raise | — | — | wstrzymana (V2_WSTRZYMANE, poza zakresem r2) |

## Nakładka
`calfKneeStraightRef` w arkuszach Łydki na stopniu i Calf Raise (linki): linia uda przedłużona w dół goleni, w płaszczyźnie z boku, w każdym kadrze; po kartach element dostają 4 pokazywane ćwiczenia (Łydki na stopniu, Smith, sztanga, linki) — zgodne z `calf.knees` na ich kartach. Pozy błędu `calf.mis.partial` (arkusze `*-data-0`) bez zmian od r1 (cmp) — znaczą pięty, nie kolana; poprawnie.

## Zestaw ogólny i karty
- Donkey Calf Raise (zestaw `calf`, skrót `58dfc0b13605` jak w r1): calf.move, calf.pause, calf.mis.partial zgodne z rysunkiem → wyswietlana.
- Łydki na stopniu (karta własna, K11, skrót `97256f2c49e7` jak w r1): calf.step, calf.move, calf.knees, calf.pause zgodne z rysunkiem; rozbieżność z r1 (brak podpory) usunięta → wyswietlana.
- Karty z istniejącym wpisem „karty” — `sha` w `docs/research/figury-recenzja.json` równe `--skroty` dla wszystkich: Standing Calf Raise, Smith Machine Calf Raise, Calf Raise (sztanga) `ba118e804b14`; Seated Calf Raise `391a8cab9dab`; Single Leg `8a286d41591b`; Seated Calf Raise (hantle), Barbell Seated `3aad793b63ec`; Calf Raise (linki) `ecbc9d005955`; Band `515cadf17b7d`; Dumbbell Seated One-Leg `14eb7315f1d8`. Bez znalezisk. (Karta linki: „Stań prosto…”, „Wspinaj się na palce…” — zgodna z nowym ustawieniem przy niskim wyciągu.)

## K10 — wpisy v1 (zalecenie)
Mechanizm: `components/ExerciseCues.tsx:44` — gdy `shownFigureSpec(key)` jest null, karta pokazuje figurę v1 (`ExerciseFigure`, `lib/figures/index.ts:24` `figureByKey`), chyba że `figureWithheld(key)` (`lib/figures/v2/figure.ts:65`: v2 istnieje, nie jest pokazywana, a v1 ma werdykt „zastapiona”) — wtedy karta jest bez rysunku.
- **Standing Calf Raise (v1 `9f988839b4bf`, „wyswietlana”, skrót aktualny)**: zostawić „wyswietlana” — **nie** zmieniać na „zastapiona”, dopóki v2 jest w `V2_WSTRZYMANE`. Użytkownik zobaczy wtedy zrecenzowany rysunek v1 (sylwetka na podwyższeniu, pięty poza krawędzią, bez maszyny — nie pokazuje błędnej dźwigni z W1). Zmiana na „zastapiona” dałaby kartę bez rysunku. Zgodne z celami pokrycia autora (`figura.wAplikacji` 535 → 534 = tylko Seated traci rysunek). Przy zdjęciu z `V2_WSTRZYMANE` (po silniku i recenzji) — v1 na „zastapiona”.
- **Łydki na stopniu (v1 `c9c064b6d644`)**: po przeniesieniu wpisu v2 → „zastapiona” (v2 pokazywana; v1 nie wraca na ekran przy ewentualnym ukryciu rodziny — fail-closed).
- Seated Calf Raise: v1 brak (lista `open`) — karta bez rysunku, z tekstem; bez zmian.

## Testy (K14, `git diff dfae8739..4170ecd9 -- tests/ docs/research/pokrycie-cele.json`)
| Plik | Zmiana | Ocena |
|---|---|---|
| figures-v2-calf-raise-p1.test.ts | lista `CZEKA_NA_SLAD_DZWIGNI` 3 → 1 (Donkey), Standing/Seated jako `WSTRZYMANE` | uzasadnione (wstrzymane nie są pokazywane; test wstrzymania je pilnuje) |
| ″ | test toru + linki, guma; przypadek negatywny na danych | zaostrzenie (N2, N3) |
| ″ | nowy test K7 (przenikanie ≤ `PROG_STYKU` 0,3 cm) dla 6 ćwiczeń z ciężarem + negatyw Seated Calf Raise | zaostrzenie; pominięcia (guma, bez ciężaru, Donkey) z powodem |
| ″ | nakładka: zamiast wymuszonego cue dla wszystkich stojących — faktyczny dobór `techniquesOf` (4 ćwiczenia); test rysowania elementu na 4 ćwiczeniach zamiast 7 | uzasadnione — odpowiada temu, co widzi użytkownik; warunek kolana ≤ 20° dla Band i Donkey nadal pilnuje test „stojąc kolana ≤ 20°” dla wszystkich KEYS |
| ″ | test W3: kąt linki ≤ 25° od pionu | uzasadnione; uwaga: liczony w rzucie z boku (bez z) — w 3D 21–25°, nadal w progu |
| figures-v2-wstrzymane.test.ts | oczekiwana lista `V2_WSTRZYMANE` + 2 | uzasadnione (decyzja koordynatora A, data w komentarzu) |
| cel-1-1-bez-ciezkich.test.ts | lista wstrzymanych + 2 | uzasadnione |
| strona-eksport.test.ts | 195 → 193 | uzasadnione (−2 wstrzymane); `pelna` zazieleni się po wpisie v2 |
| pokrycie-cele.json | figura.v2 533→531, recenzjaFigur 533→531, pelnaKarta 457→455, wAplikacji 535→534, animowanyBlad 264→263 | uzasadnione: −2 wstrzymane; wAplikacji −1, bo Standing zachowuje v1; animowanyBlad −1, bo tylko Standing ma pozę błędu (Seated bez calf.mis.partial). Opis pola `opis` nie dopisuje tej zmiany — kosmetyka, nie znalezisko. |

## Uwagi
- Rekord `zestawy."Calf Raise (linki)"` (02.11.2026) nie ma odpowiednika w `--skroty` (ćwiczenie ma kartę własną, zestaw ogólny się nie wyświetla) — bez skutku dla użytkownika.
- Smith Machine Reverse Calf Raise: bez rysunku, bez wpisu w `figury-wyjatki.json` — jak w r1, nie blokuje.
