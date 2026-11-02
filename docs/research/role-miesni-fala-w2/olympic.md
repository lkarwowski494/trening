# Role mięśni — rodzina olympic, fala W2 (grupa G3 „moc”)

Data: 02.11.2026 · Autor: badacz-merytoryczny (W2, G3) · Tylko zbieranie danych. Stan W1 (N1–N4, N7–N8) bez ponownego badania.
Wiersze liczone jak w `plyo.md` (`muscleLoadOf`, `lib/seed.ts:153–162`: region ≥ 0,5 spoza partii ćwiczenia znika).

## Tabela wierszy po W2

| Ćwiczenie | Wiersz | Dane katalogu | Status po W2 |
|---|---|---|---|
| Clean and Press | upper_back aux | udział 0,5, partia „plecy” w pomocniczych (`lib/catalog.generated.ts:1087, 1763`) | **gotowe** — dopisać do N4 (patrz niżej) |
| Snatch Balance | front_delt aux | 0,5, „barki” w pomocniczych (`:1243, 1919`) | otwarte (bez nowego źródła; W1: tylko analogia do podrzutu) |
| Snatch Balance | upper_back aux | 0,5, ale „plecy” poza partiami (`:1919`) | **brak wiersza** — nie dotyczy |
| Snatch Balance | triceps aux | 0,5, „triceps” poza partiami | brak wiersza — nie dotyczy |
| Jerk Dip Squat | abs aux | 0,5, „core” w pomocniczych (`:1214, 1890`) | otwarte — brak funkcji ≥ dwa_zrodla (`abs.antilordosis` = jedno_zrodlo, `data/zrodla/role-miesni.json:284`) |

## Clean and Press — korekta założenia W1

W1 (`olympic.md`, wiersz tabeli `v_push|upper_back|aux`) zostawiła wiersz otwarty, bo przyjęła **zarzut kettlebell**, a badania (S29, W1G3-S6)
dotyczą sztangi. W katalogu „Clean and Press” to ćwiczenie **ze sztangą**: `lib/catalog.generated.ts:372`
(`"requires":[["barbell"]]`, `"loadSource":"barbell"`, `"pattern":"v_push"`) i `:1763` (sprzęt „sztanga”). Powód otwarcia odpada: zarzut
sztangi w tym ćwiczeniu to ten sam ruch co w zarzutach objętych N4 (2. ciąg), a wyciskanie po zarzucie nie zmienia pracy czworobocznego w ciągu.
Źródła bez nowego badania: te same co N4 (S29, W1G3-S6 z W1).

Propozycja: dopisać `"Clean and Press"` do listy `exercises` reguły N4 (`upper_back`, `["aux"]`, `upper_back.scap_elevate`). Zdanie N4 (wariant „_”).

```json
{ "regula": "N4 (W1, upper_back.scap_elevate, aux)", "dopisz": ["Clean and Press"], "zrodla": ["S29", "W1G3-S6"],
  "uzasadnienie": "zarzut sztangi (lib/catalog.generated.ts:372) — 2. ciąg jak w zarzutach N4" }
```

Skutek uboczny do sprawdzenia przez koordynatora: reguła N2 (W1, `glutes.hip_ext` dla Clean and Press) opiera się m.in. na S34 — stronie
**kettlebell** Clean and Press. Dla ćwiczenia ze sztangą S34 to wariant sprzętu (uproszczenie: wariant sprzętu), S29 (zarzut sztangą) zostaje
źródłem wprost. Ocena, czy N2 nadal ma dwa źródła, należy do recenzenta.

## Źródła

Bez nowych źródeł — S29, W1G3-S6, S34 jak w W1 (`olympic.md`, sekcja Źródła).

## Otwarte

- [OTWARTE] Snatch Balance front_delt aux — tylko analogia (W1); nie szukane ponownie.
- [OTWARTE] Jerk Dip Squat abs aux — brakuje funkcji ze statusem ≥ dwa_zrodla dla mięśnia prostego brzucha poza zginaniem tułowia; to sprawa danych funkcji, nie źródeł ćwiczenia.

## Stan

Zrobione: liczenie wierszy; Clean and Press upper_back → gotowe (N4). Zostało: Snatch Balance front_delt, Jerk Dip Squat abs.
Pułapka: przy W1 przyjęto sprzęt bez sprawdzenia `requires` w katalogu — sprawdzać `lib/catalog.generated.ts` (sekcja sprzętu) przed oceną „analogii”.
