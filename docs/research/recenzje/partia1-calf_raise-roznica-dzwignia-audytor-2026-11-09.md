# Recenzja niezależna różnicy — rodzina v2 `calf_raise` po śladzie dźwigni (55c9f206), linia 1.1, partia 1

Data: 2026-11-09. Recenzent: audytor (nie autor zmiany silnika ani rodziny; L-047). Zakres: tylko różnica względem r2 (`partia1-calf_raise-r2-audytor-2026-11-09.md`, v2.calf_raise sha 77aa8d8a6693).

## Werdykt
**wyswietlana** (bez zmian) — 0 KRYTYCZNYCH, 0 WYSOKICH, 0 ŚREDNICH, 1 NISKIE (luka w teście rodziny, nie w rysunku). Nowe sha v2.calf_raise: **41ff550cd2bf**.

## Metoda
- Czyste kopie: `git archive 3044df5` → `/home/user/rev-p1/calf_raise-roznica`; `git archive 6f208fd^1` (przed scaleniem 55c9f206) → `/home/user/rev-p1/calf_raise-przed`.
- Różnica plików figur 6f208fd^1..3044df5: `lib/figures/v2/contract.ts` (l. 330–334, ślad dźwigni), `poseData.ts` (Crucifix w ISOMETRIC), `cue-sets.json` (ohp), pozy chest_fly i overhead_press, `data.json`. Plik `poses/calf_raise.json` bez zmian.
- Zrzut `frameAt` (szkielet i `info.trail`, 49 kadrów u co 1/48), `trailFor` i `shapesAt` (u = 0; 0,5; 1) dla wszystkich 12 ćwiczeń rodziny z pozą v2 w obu kopiach, porównanie JSON.
- Arkusze `arkusz-slad.mjs` (21 kadrów, widok side — jedyny widok każdego ćwiczenia rodziny): Donkey Calf Raise motyw jasny i ciemny + kopia „przed” (jasny); Standing i Seated Calf Raise (jasny, poglądowo). Wycinki u = 0 i u = 1 ×2: `arkusze/slad/{light,dark}/Donkey-crop-u0-u1.png`, `arkusze/przed/Donkey-crop-u0.png`.
- `node scripts/zrodla-runtime.mjs --skroty` w obu kopiach.
- Testy (pojedyncze pliki w kopii): `tests/figures-v2-calf-raise-p1.test.ts`, `tests/figures-v2-slad-dzwignia.test.ts` — 19/19 zielone.

## Wynik porównania (przed → po)
| Ćwiczenie | Szkielet | Ślad | Kształty sylwetki/sprzętu | Pokazywane |
|---|---|---|---|---|
| Donkey Calf Raise (dźwignia, miednica) | identyczny | **zmieniony** | identyczne | tak |
| Standing Calf Raise (dźwignia, miednica) | identyczny | zmieniony | identyczne | nie (V2_WSTRZYMANE) |
| Seated Calf Raise (dźwignia, kostki) | identyczny | zmieniony | identyczne | nie (V2_WSTRZYMANE) |
| pozostałe 9 (Łydki na stopniu, Smith, sztanga, linki, guma, Single Leg, Seated (hantle), Barbell Seated, Dumbbell Seated One-Leg) | identyczny | identyczny | identyczne | tak |

Innych ćwiczeń z dźwignią w rodzinie nie ma (sprawdzone w `poses/calf_raise.json`: `dzwignia` tylko w trzech powyżej). Smith Machine Reverse Calf Raise — bez pozy v2 (bez zmian).

## Ocena śladu
- **Donkey Calf Raise** (pokazywane): przed — punkt w nieruchomej dłoni na skrzyni [67,7; 65; 16] (uwaga z r2). Po — ślad = miednica: x 0, z 0, y 93,1 → 107,3 cm (Δy 14,2 cm, Δx 0), największy krok 0,5 cm na 1/48 — bez skoków. Leży w miejscu styku dźwigni z ciałem (wałek dźwigni y 92,1, x 0 — 1 cm od punktu śladu, na biodrach). Kształt: pionowy odcinek ok. 14 cm, zgodny z prowadnicą „prosta” i z wysokością wspięcia w Łydki na stopniu (14 cm, r2) przy tym samym zakresie kostki (+20,9° → −42,2°). Grot na obu końcach i znacznik startu widoczne w obu motywach; przy u = 0 górna część odcinka (droga, którą biodra dopiero przejdą) wystaje kilka cm nad zarys bioder — to kształt toru, nie błąd. Uwaga r2 („ślad do ponownej recenzji po figury/slad-dzwignia”) — zamknięta.
- **Standing Calf Raise** (wstrzymane): ślad = miednica pionowo 93,1 → 107,3 cm. Niewidoczne w aplikacji; ocena ruchu i śladu przy zdjęciu z V2_WSTRZYMANE (P1-CALF-1).
- **Seated Calf Raise** (wstrzymane): ślad = kostka R, łuk [42; 11,1] → [49,2; 22,4] (Δx 7,2, Δy 11,3 cm), bez skoków. Kształt jak łuk kostki wokół przodostopia, ale w maszynie ciężar spoczywa na udach przy kolanach (powód wstrzymania: brak punktu „uda”). Niewidoczne w aplikacji — nie zgłaszam; przy zdjęciu z V2_WSTRZYMANE ślad ma być na udach, nie przy kostce.
- Karta i rysunek: kształty sylwetki i sprzętu identyczne we wszystkich 12 ćwiczeniach (u = 0; 0,5; 1); karty, zestawy i v1 bez zmian skrótów — nic się nie rozjechało.

## Skróty (`--skroty`, 6f208fd^1 → 3044df5)
- v2.calf_raise: 77aa8d8a6693 → **41ff550cd2bf** (jedyna zmiana).
- karty (Standing, Smith, sztanga `ba118e804b14`; Seated `391a8cab9dab`; Single Leg `8a286d41591b`; Seated (hantle), Barbell Seated `3aad793b63ec`; linki `ecbc9d005955`; Band `515cadf17b7d`; Dumbbell Seated One-Leg `14eb7315f1d8`; Łydki na stopniu `97256f2c49e7`), zestawy (Donkey `58dfc0b13605`) i v1 (Standing `9f988839b4bf`, Łydki `c9c064b6d644`) — bez zmian; wpisy zostają.

## Znaleziska
| # | Poziom | Pewność | Realność | Ćwiczenie / miejsce | Opis | Kierunek |
|---|---|---|---|---|---|---|
| N1 | NISKIE | 95% | teoretyczny (regresja w kodzie, nie droga przez UI) | `tests/figures-v2-calf-raise-p1.test.ts:54–57, 74–76` | Donkey Calf Raise nadal na liście `CZEKA_NA_SLAD_DZWIGNI` z komentarzem „ślad … jest zły (contract.ts:330–332 bierze dłoń)” — nieaktualne po 55c9f206. Ślad Donkey nie jest przypięty żadnym testem: `figures-v2-tor.test.ts` wyklucza dźwignie poza dłońmi (ZESTAW), a `figures-v2-slad-dzwignia.test.ts` sprawdza w calf_raise tylko Standing (wstrzymane) i Seated (wstrzymane). Powrót śladu do dłoni w jedynym pokazywanym ćwiczeniu z dźwignią przeszedłby niezauważony. | W teście rodziny zamienić listę na test: Donkey — ślad = miednica w każdej klatce, Δy ≥ 10 cm, Δx < 1 cm; przypadek negatywny (ślad = chwyt dłoni oblewa). Backlog 1.1. |

## Ćwiczenia (werdykt)
Bez zmian względem r2: 10 pokazywanych — wyswietlana; Donkey Calf Raise — wyswietlana, uwaga o śladzie zamknięta; Standing i Seated Calf Raise — wstrzymane (poza zakresem).

Czas pracy: ok. 20 min.
