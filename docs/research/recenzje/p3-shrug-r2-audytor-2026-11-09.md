# Recenzja niezależna bramki 4 — rodzina v2 `shrug`, runda 2 (partia 3), 09.11.2026

- Recenzent: audytor. Nie pisał tych zmian (L-047). Autor: programista partii 3 (`figury/partia-3` @ d7dd7a84). Runda 1: `p3-shrug-audytor-2026-11-09.md`.
- Kopia: `git archive d7dd7a84` → `/tmp/rec-p3-shrug2`. Pliki w `/tmp` nie trafiają do repo.
- Skróty z czystej kopii (`node scripts/zrodla-runtime.mjs --skroty`): v2.shrug **cf2edb2c70fe** (zgodny z oczekiwanym). Karta Shrugs (sztanga) i (hantle) 5e140bf234c0. Linki 2a27c76a6ad6. Behind The Back e5d7a98886ed. Leverage 2e70f293d7f6. Zestaw shrug (Smith, Calf-Machine) 193c74683067. Middle Back Shrug ae52305bc674.
- Obejrzane w pełnej rozdzielczości:
  - arkusze ze śladem: `/tmp/rec-p3-shrug2/ark` (light) i `/tmp/rec-p3-shrug2/ark-dark` (dark), 8 ćwiczeń × front i side, kadr co 0,05;
  - nakładka: `/tmp/rec-p3-shrug2/nak` (16 PNG).
- Pomiary z `frameAt`: kąt łokcia, tułowia, ramienia i odwiedzenia, chwyt, odstęp ciężaru (`odstepCiezaru`).
- `v2-validate.mjs` na `poses/shrug.json`: 8/8 OK.

## Werdykt rodziny: **wyswietlana** (bez znalezisk KRYTYCZNYCH ani WYSOKICH)

| Ćwiczenie | Łokieć u=0→1 | Tułów | Chwyt Δy / bark Δy | Odstęp od ud u=0→1 |
|---|---|---|---|---|
| Shrugs (sztanga) | 3,9° → 3,9° | 0° | 6,0 / 6,0 cm | 1,4 → 1,7 cm |
| Shrugs (hantle) | 3,8° → 3,8° (odwiedzenie 6,3° stałe) | 0° | 6,0 / 6,0 | 3,2 → 3,4 |
| Shrugs (linki) | 3,9° → 3,9° | 0° | 6,0 / 6,0 | 4,1 → 4,7 |
| Barbell Shrug Behind The Back | 2,8° → 2,8° (ramię −12,9° stałe) | 0° | 6,0 / 6,0 | 5,6 → 4,9 (za udami) |
| Smith Machine Behind the Back Shrug | 2,8° → 2,8° | 0° | 6,0 / 6,0, szyna pod gryfem | 5,6 → 4,9 |
| Leverage Shrug / Calf-Machine | 3,8° → 3,8° | 0° | 6,0 / 6,0, uchwyt z = 28,2 cm (poza udem) | artefakt −10,3…−11,1 (W7) |
| Middle Back Shrug | ~42° stały | −45° (ławka) | — | bez zmian względem rundy 1 |

Na arkuszach ślad jest pionowy i równoległy do uniesienia barku. Hantle nie odchodzą na boki. Gryf za plecami trzyma się ud.

## Znaleziska z rundy 1

| ID | Stan |
|---|---|
| W1 (Leverage, Calf — łokcie 32→45°) | naprawione: łokieć 3,8° stały |
| W2 (Smith — łokcie 21→38°) | naprawione: 2,8° stały |
| W3 (Behind — gryf odjeżdża 5,6→16,1 cm) | naprawione: 5,6→4,9 cm, ruch pionowy |
| W4 (hantle na boki) | naprawione: z i odwiedzenie stałe |
| W5 (sztanga, linki — łokieć do 13,5°, tułów −4,5°) | naprawione |
| W6 (Calf = Leverage, brak poduszek) | backlog, bez zmian, teksty mu nie przeczą |
| W7 (jeden uchwyt, artefakt miary) | backlog, bez zmian |

## Nowe znaleziska

| ID | Waga | Pewność | Opis | Realność | Dowód |
|---|---|---|---|---|---|
| N1 | NISKIE | 90% | Lista `bez_bramki_ruchu` dostała 7 szrugsów, ale opis sekcji (`_opis`) nadal mówi „ruch to czysty obrót przedramienia”. Komunikat `DEKLARACJA` w poleceniu generatora pisze „(ruch to obrót przedramienia)” także dla szrugsów. Nie ma to wpływu na aplikację. | teoretyczny | `data/zrodla/figury-sens.json` → `bez_bramki_ruchu._opis`; `scripts/figures/v2-sens.mjs:57` |
| N2 | NISKIE | 85% | `rece_proste` sprawdza tylko górną granicę łokcia (15°), a nie to, czy kąt jest stały. Zmiana 0,5° → 14°, czyli dokładnie W5 z rundy 1, przeszłaby. Dziś łokieć jest stały, więc nie ma skutku. | teoretyczny (przyszła regresja) | `rodziny.shrug.rece_proste.max_deg`; `scripts/figures/v2-sens.mjs:182` |

## Ocena `bez_bramki_ruchu` dla szrugsów (do weta koordynatora)

Analogia do decyzji z 26.10.2026 jest rozsądna. Tamta decyzja dotyczyła ruchu, który z natury nie przesuwa żadnego punktu o 8 cm. Tutaj ruch ogranicza kontrakt (`EXT_ROM.shrug.max = 6`). Bramka 8 cm wymuszała kompensację (zgięcie łokci, odchylenie tułowia), której przeczy karta. Flaga `isometric` zdejmuje wyłącznie bramkę ruchu (`lib/figures/v2/contract.ts:437`). Reguła `klatki_rozne` i reguły sensu działają dalej, a `barki_w_gore` dalej wymaga uniesienia. Middle Back Shrug nie jest na liście, i słusznie, bo jego bark przesuwa się o ok. 9 cm. Zastrzeżenie redakcyjne opisuje N1.

## Karty i zestawy wobec nowego rysunku

- **Shrugs (sztanga), Shrugs (hantle)** (5e140bf234c0): wskazówki „ręce proste”, „tułów nieruchomo”, „barki w górę” zgadzają się z rysunkiem. Wpisy v1 można przestawić na „zastapiona”.
- **Shrugs (linki)**: karta jest spójna z rysunkiem. **Barbell Shrug Behind The Back** (e5d7a98886ed): `shrug.setupBehind` zgadza się z rysunkiem. **Leverage Shrug** (2e70f293d7f6): rysunek nie pokazuje już błędu `shrug.mis.elbows`.
- **Zestawy**:
  - Smith i Calf-Machine (193c74683067, `shrug.move`/`shrug.tall`/`mis.jerk`) są zgodne z rysunkiem.
  - Middle Back Shrug (ae52305bc674, zestaw row) jest zgodny i bez zmian.

## Sprawdzone bez znalezisk

- Skróty zgodne z oczekiwanymi.
- Walidator: 8/8 OK.
- Nakładka `shrugShoulderUpRef`: bark idzie po pionie, nic nie nachodzi.
- Motyw ciemny: rysunek czytelny.
- Odstęp ciężaru od ud jest dodatni w ćwiczeniach z gryfem, hantlami i linką. Przenikania nie widać.
- Prezentacja (fazy, cm) bez zmian.
- Dane użytkownika, migracje, prywatność, sekrety: zmiana ich nie dotyka.
