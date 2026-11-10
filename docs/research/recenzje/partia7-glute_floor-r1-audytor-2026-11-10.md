# Recenzja niezależna r1 — rodzina `glute_floor` (partia 7, linia 1.1), 10.11.2026

Recenzent: audytor (subagent, partia 7, sesja D). Autor: programista (subagent, partia 7, sesja D). Stan zamrożony: `figury/partia-7-glute_floor` @ 843bbe38 (worktree odłączony).
Zakres: 7 ćwiczeń z rysunkiem v2 (Donkey Kick, Fire Hydrant, Clamshell, Cable Kickback, Hip Extension with Bands, Machine Glute Kickback, Prone Flutter Kicks), widoki side i front, pozy błędu `hext.mis.arch`, nakładka, zestawy ogólne, karty własne, testy (K4–K15).

**Werdykt rodziny: do poprawy** — 2 × WYSOKIE (W1 Cable Kickback, W2 Prone Flutter Kicks — poza błędu). Pozostałe 5 ćwiczeń bez znalezisk blokujących.

## Metoda
- Arkusze własne: `scripts/figures/arkusz-slad.mjs` (14 arkuszy: 7 ćwiczeń × side/front, 21 kadrów co 0,05) i `scripts/figures/arkusz-nakladka.mjs --family glute_floor` (24 arkusze, w tym pozy błędu `data:0`); obejrzane w pełnej rozdzielczości. Dodatkowo własny render u = 1 poprawnie / błąd i u = 0,5 błąd (5 ćwiczeń z błędem).
- Liczby: `frameAt` (miednica, barki, kolana, kostki, `jointAngles`), kolidery `bodyColliders`/`equipColliders`/`gap`, odległości od podłogi.
- Źródła reguły `plecy_wprost`: ACE #270 (krok 1) i ISSA Donkey Kicks — odczytane curl-em 10.11.2026, brzmienie w `figury-sens.json` zgodne.
- Testy (pojedynczo, `--runInBand`): `figures-v2-glute-floor`, `figures-v2-tor`, `figury-generator-odtwarza` — 235/235 zielone.

## Znaleziska

| ID | Klasa | Pewność | Ćwiczenie / miejsce | Opis i miara | Realność | Test odtwarzający |
|---|---|---|---|---|---|---|
| W1 | WYSOKIE | 95% | Cable Kickback, oba widoki, wszystkie 21 kadrów | Dłonie nie trzymają maszyny. Karta (`ck.setup`): „stań przodem do maszyny, trzymając się jej”. Chwyt `[76,3; 123,6; ±14]` (`poses/glute_floor.json`, rece.chwyt), kolumna wyciągu `x = 86,3, z = 0`, szerokość 10 cm (`EQUIP.towerW`) → krawędź w `x 81,3`, `z ±5`. `gap(farm, tower)` = **7,0 cm** w każdym kadrze. Z boku dłonie kończą się tuż przed kolumną (wygląda prawie na styk), z przodu stoją wyraźnie obok kolumny. Ten sam wzorzec co W1 Triceps Dips w partii 4 (dłonie obok ławki przy karcie „oprzyj dłonie”). | realny (każde otwarcie karty) | w każdym u: `gap(farm{R,L}, tower) ≤ 1`. Poprawka: chwyt w `z ≤ ±5` (dłonie na kolumnie) i `x ≈ 81` albo sprzęt z uchwytem/ramą w miejscu dłoni |
| W2 | WYSOKIE | 90% | Prone Flutter Kicks, poza błędu `hext.mis.arch` (data:0), side, u ≥ ok. 0,4 | Przy łuku lędźwi tułów zapada się w ławkę. `zgiecieKregoslupa −30°` przesuwa `spineMid` w dół: 53,2 → 47,2 cm (u = 1). Przy grubości tułowia 10,5 cm (`GIRTH.trunkDepth`) dolna krawędź ma ok. 36,7 cm, a blat ławki 43 cm (`benchBack`), czyli tułów wchodzi w ławkę na **ok. 6 cm**; u = 0,5: ok. 3,4 cm. Widać to w arkuszu nakładki i w renderze błędu. Kolidery tułowia biegną odcinkiem miednica→bark i nie idą za zgięciem kręgosłupa, więc `bladLawki` w teście rodziny tego nie łapie. Łuk lędźwi na ławce unosi klatkę albo nogi, nie zapada brzucha w blat. | realny (użytkownik dotyka „częsty błąd” w zestawie ogólnym hipExt) | dla pozy `data:0` w każdym u: `spineMid.y − GIRTH.trunkDepth ≥ blat − 1`. Poprawka: łuk przez uniesienie barków/klatki (pochylenie tułowia, miednica na ławce) zamiast ujemnego zgięcia przy stałych barkach |
| Ś1 | ŚREDNIE | 85% | Machine Glute Kickback | Maszyna nie ma ramy. Poręcze (`x 67,5–97,5`, `h 120,3`, `z ±15`) i oś dźwigni (`[0; 89,9; 38]`) wiszą w powietrzu, bez kolumny ani podstawy. Ruch jest poprawny. Por. S-1 w recenzji `leg_machine` (p3). | realny (czytelność) → backlog | — |
| N1 | NISKIE | 90% | Machine Glute Kickback, ręce | Tezę autora „przedramię wnika 5 cm, identycznie jak w Chest Dip” potwierdzam tylko dla miary kontraktu. `gap(farm, barDip)` = −5,0 cm w obu ćwiczeniach, bo kapsuła `farm` biegnie łokieć→chwyt, a chwyt leży na osi poręczy. Sam odcinek łokieć→nadgarstek wnika jednak tylko tutaj: Machine −2,5 cm, Chest Dip 0 (≥ 0). Poręcz biegnie wzdłuż przedramienia (oś x), więc ok. 11 cm drążka leży w ręce. Niewidoczne z boku, bo drążek jest pod ramieniem. | brzegowy | odcinek łokieć→nadgarstek: `gap ≥ −1` |
| N2 | NISKIE | 90% | Donkey Kick, Fire Hydrant — kolano podporowe (L) | Kolano na podłodze w klęku podpartym: `thighL` min. 1,4 cm nad podłogą (u = 1), `thighR` w u = 0: 1,2 cm. Tolerancja K7 to 1 cm. Okiem niewidoczne. | brzegowy | min(thighL) nad podłogą ≤ 1 |
| N3 | NISKIE | 85% | `tests/tor-wyjatki.json` (Cable Kickback, Machine Glute Kickback) | Wyjątek jest słuszny: łuk kostki wokół biodra ma promień ok. 82 cm. Kąt jednak się nie zgadza: Δθ ≈ 44° (kostka od +9° do −35° względem pionu przez biodro), a nie „ok. 20°–30°”. Strzałka r·(1−cos 22°) = 6,0 cm odpowiada zmierzonym 6,1 cm. Do poprawy tylko liczba w opisie. | teoretyczny (tekst wyjątku) | — |
| N4 | NISKIE | 85% | `figury-sens.json` `miednica_bez_skretu` | Pewność to nadal „ustalone (kierunek)”, a `zrodlo` = „jak miednica_bez_przechylu” (wniosek z ACE #38, odwodzenie prostej nogi — po obniżeniu siostrzanej reguły do „analogia” to niespójne). Badacz (propozycja 6) wskazał źródła bezpośrednie dla clamshell (NASM, ISSA, Catalyst). Ani na rysunku, ani w nakładce nie widać skutku: reguła nie ma elementu. | teoretyczny (dane wewnętrzne) | — |
| N5 | NISKIE | 80% | Clamshell — nazwy faz | „Rozsuwanie” / EN „Pulling apart” (klucz już istniał, wziął się z band pull-apart). Przy otwieraniu kolan bardziej pasuje „Otwieranie” (EN „Opening”). | realny, kosmetyka → backlog | — |

## Ocena punktów wskazanych przez autorów
- **Pozy błędu `hext.mis.arch` (5 ćwiczeń):** łuk jest widoczny we wszystkich pięciu (render u = 1: przy Donkey Kick, Cable i Machine plecy wyraźnie się wyginają, przy Hip Extension with Bands słabiej, ale da się to odczytać). Tezy autora, że przeprost jest „prawie niewidoczny”, nie potwierdzam. Wadą jest tylko przenikanie w Prone Flutter Kicks (W2). Karty mają ten błąd (Donkey Kick, Cable Kickback, Hip Extension with Bands — `mistakes`; Machine i Prone — zestaw hipExt `err`), więc K15 jest spełnione.
- **Wyjątki toru (6,1 cm przy progu 4 cm):** przyjęte. To łuk wokół biodra (geometria wyżej), ślad = mankiet na kostce (Cable) / punkt styku dźwigni przy kostce (Machine), 0 zawróceń. Opis do poprawy (N3).
- **Machine Glute Kickback, przedramię i poręcz:** patrz N1. Miara kontraktu jest identyczna, ale geometria już nie.
- **Fazy i ukryty kąt:** Fire Hydrant i Clamshell to odwodzenie. Kąt zgięcia biodra prawie się w nich nie zmienia (Fire Hydrant 75°→73°, Clamshell 47°→35° to skutek rotacji, nie istota ruchu), więc ukrycie kąta jest słuszne. Prone Flutter Kicks pracuje dwiema nogami naprzemiennie, ukrycie też słuszne. Nazwy faz przechodzą przez `t()`: wszystkie klucze są w `lib/i18n.en.ts` (N5 to tylko kosmetyka).
- **Cel `animowanyBlad` 259 → 264:** +5 = pięć nowych póz błędu. Spójne.
- **Nakładka:** jeden element `gluteBackRef` (ref, miednica→bark), tylko widok z boku, tylko Donkey Kick (`reguly-cwiczen.json`: `Donkey Kick: [plecy_wprost]`; Machine i Prone mają w zestawie `hext.range`, ale nie mają reguły, więc nie dostają elementu, co potwierdza filtr `techniquesFor`, `overlay.ts:83`). Reguła `plecy_wprost` = „ustalone (kierunek)” na 2 źródłach szczebla 4 wprost dla tego ćwiczenia, a cytaty sprawdziłem curl-em. Cue `hext.range` jest na karcie Donkey Kick. Linia leży na plecach w całym ruchu, w pozie błędu jest czerwona. Pozostałe reguły bez elementu, powody w nagłówku `overlay/glute_floor.ts` są trafne.

## Ruch — liczby (K4–K8)
- Donkey Kick: zgodnie z `bd.setup` kolana są pod biodrami (x 11,6 = miednica), a dłonie pod barkami (x 60). Kolano robocze 105° → 90°, biodro 76° → 11° (≤ 25°, `biodro_do_linii`). Na górze goleń prawie pionowa, stopa podeszwą ku górze (−155°), czyli zgodnie z `dk.move` „podeszwą w stronę sufitu”. Miednica i barki nieruchome, kręgosłup 0°.
- Fire Hydrant: kolano odchodzi w bok z z = 8,5 na ok. 43 cm, a rozstaw kolan rośnie o ok. 34 cm (≥ 15). Udo na górze jest ok. 35° poniżej poziomu, kolano przez cały ruch zgięte 105°. Miednica: przechył i skręt 0°, zgodnie z `fh.level`.
- Clamshell: stopy cały czas razem (kostki nieruchome), kolano górne unosi się z y 24 na 42 cm (rozstaw kolan +20 cm), skręt 0°, zgodnie z `clam.move` i `clam.noRoll`.
- Cable Kickback / Machine Glute Kickback: mankiet na kostce (Cable: wyciąg nisko, y = 22, zgodnie z `ck.setup`), miednica nieruchoma (`hab.hips`), biodro +36° → −14° (przeprost ze znakiem). Noga stojąca na podłodze (0,1 cm).
- Hip Extension with Bands: guma przy kostkach, ciężar na jednej nodze, biodro 36° → przeprost. Noga stojąca na podłodze.
- Prone Flutter Kicks: katalog wymaga `bench.flat`, więc ławka się zgadza. Miednica na ławce (0,7 cm), nogi poza ławką naprzemiennie ±17 cm na wysokości kostek. Ślad: miednica nieruchoma.
- Ślad toru (ćwiczenia bez ciężaru): Cable i Machine — mankiet/punkt styku przy kostce (ślad = kostka, 0 cm). Hip Extension with Bands — guma między kostkami. Donkey Kick, Fire Hydrant i Clamshell bez śladu w arkuszu, więc zmierzyłem tor kolana i kostki nogi ruchomej: łuki wokół biodra, bez zawróceń. Miednica nieruchoma we wszystkich 7.

## Zestawy ogólne (K12) i karty własne (K11)
- Machine Glute Kickback, Prone Flutter Kicks (wzorzec hipExt: `hext.range`, `plank.brace`, `err hext.mis.arch`): zdania pasują do rysunku (kręgosłup 0° w pozie poprawnej, noga w wyproście biodra). Prone: zdanie błędu pasuje, ale poza błędu ma przenikanie (W2), więc werdykt zestawu zależy od W2.
- Karty własne (Donkey Kick, Fire Hydrant, Clamshell, Cable Kickback, Hip Extension with Bands): treść wobec rysunku v2 jest zgodna, poza zdaniem `ck.setup` „trzymając się jej” (W1). Wpisów v1 tych ćwiczeń w `figury-recenzja.json` nie ma, więc K10 nie dotyczy.

## Testy (K14) — `git diff b66ecfa2..843bbe38 -- tests/`
| Plik | Zmiana | Ocena |
|---|---|---|
| figures-v2-data.test.tsx | glute_floor wyłączona z pętli „dłonie na drążku / fazy / staw” | poluzowanie uzasadnione: rodzina ma własne sprawdzenie faz, stawu i ROM w `figures-v2-glute-floor.test.tsx` (fazy, `measuredJoint = hip`, ROM ≥ MIN_MEASURED_ROM) |
| figury-generator-odtwarza.test.ts | glute_floor zdjęta z listy rozjazdów, dopisana do `W_ZAKRESIE` | zaostrzenie (plik ≡ generator) |
| figures-v2-mapping / nakladka-triceps-olympic / skrot-v2-wynik / gemini-polecenia / strona-eksport | dopisanie rodziny i liczby (+7, 28 rodzin) | zmiany wymagane włączeniem, bez poluzowania |
| tor-wyjatki.json | 2 wyjątki łuku | przyjęte (N3 — tylko opis) |
| figures-v2-glute-floor.test.tsx (nowy) | podpory, zakresy z reguł, znak kąta, fazy, nakładka, negatywy | brakuje testów styku dłoni z kolumną (W1) i ławki w pozie błędu (W2) |

## Skróty (`node scripts/zrodla-runtime.mjs --skroty` w worktree 843bbe38)
v2 glute_floor `d82513002485`; karty: Donkey Kick `90713799544e`, Fire Hydrant `9941c4ec90d1`, Clamshell `eeb474aeef3c`, Cable Kickback `00c3363b505c`, Hip Extension with Bands `8c83adfcf23f`; zestawy: Machine Glute Kickback `5541a16a3e76`, Prone Flutter Kicks `5541a16a3e76`. Liczba z `assignAll()`: 7.
