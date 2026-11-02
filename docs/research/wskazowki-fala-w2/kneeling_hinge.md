# Wskazówki techniki — rodzina `kneeling_hinge` (fala W2)

Data: 02.11.2026 · rodzina: `kneeling_hinge` · **Status: PROPOZYCJA** · autor: badacz-merytoryczny (fala W2)

Podstawa: `przeliczenie-szczebli-2026-11-02.md` (gałąź badania/g4-nogi, sekcja „kneeling_hinge.md”) — obie pozycje otwarte; Fitness Volt
(Seated Good Mornings) = 5 (data tylko w metadanych). Szczeble: `szczeble-organizacji-2026-11-02.md` (gałąź badania/lokalne-0211).
Rodzina: `lib/figures/v2/families.ts:104` (dopasowanie „kneeling squat”, „seated good morning”); poza v2 tylko dla Seated Good Mornings
(`lib/figures/v2/poses/kneeling_hinge.json:5`).

## Ćwiczenia

| Ćwiczenie | poza v2 | stan | co dodano w W2 | brak |
|---|---|---|---|---|
| Seated Good Mornings | tak | otwarte | wyszukiwanie drugiego źródła 02.11; przeczytany kandydat: Westside Barbell (niżej) — szczebel nieustalony; nawet po uznaniu nie potwierdza ustawienia | drugie źródło szczebla 4 dla ustawienia (sztanga na górze pleców, siad okrakiem na ławce, stopy płasko) i ruchu |
| Kneeling Squat | nie | otwarte | wyszukiwanie 02.11 — wyniki: aplikacje, serwisy bez autora, blog osobisty; nic szczebla 4 | 2 źródła szczebla 4 o przysiadzie w klęku ze sztangą |

### Blok do wdrożenia

```json
{}
```

Brak kart: żadne ćwiczenie nie ma ustawienia i ruchu z 2 źródeł szczebla 4 (ani z jednego szczebla 3). Błędów wnioskowanych nie ma
z czego wyprowadzić (brak potwierdzonych zdań ustawienia i ruchu).

## Kandydat na drugie źródło — Seated Good Mornings

| id (propozycja) | adres | organizacja | autor / kwalifikacje / data | szczebel |
|---|---|---|---|---|
| `westside-seated-good-mornings` | https://www.westside-barbell.com/a/blog/seated-good-mornings | Westside Barbell (siłownia trójboju, sklep, programy online) | Burley Hawk — w biogramie „Lead Powerlifting Coach” Westside Barbell, trener metody sprzężonej; data 08.04.2025 widoczna | **[OTWARTE]** — organizacji nie ma w `szczeble-organizacji-2026-11-02.md`. Autor z funkcją trenerską i data są (pkt 2), certyfikatu nie podano; w treści brak reklamy, ale biogram promuje płatny klub, a pasek boczny — sprzedaż (pkt 3). Do decyzji koordynatora: 4 warunkowo (jak IronMind/Torokhtiy: autor z kwalifikacjami) albo 5 |

Co ten artykuł potwierdza (gdyby był szczeblem 4), obok `catalyst-184` (4):
- ruch — tułów napięty, kręgosłup blisko neutralnego przy opuszczaniu, powrót do pionu (sekcja o wykonaniu): „We want to ensure the trunk
  remains braced and the spine posture remains near neutral.” — zgodne z Catalyst 184 („without losing the back extension”);
  wspierałby `gm.seatMove` i `hinge.back`;
- błędy — słabe napięcie tułowia, źle dobrany ciężar (sekcja o błędach); `gm.seatLoad` miałby wtedy 2 źródła (Catalyst: nie dokładaj
  ciężaru, który psuje pozycję);
- **nie** potwierdza ustawienia: nie opisuje położenia sztangi na plecach ani ustawienia stóp (mówi tylko o wysokości stojaka i odległości
  ławki od stojaka). Bez drugiego źródła ustawienia karta i tak nie wejdzie.

Różnica do odnotowania: Westside dopuszcza „trochę zgięcia” kręgosłupa jako oczekiwane, Catalyst — wyprost pleców przez cały ruch
(zaokrąglenie tylko u bardzo doświadczonych, wyjątek; W1). Część wspólna: plecy blisko neutralnych, bez celowego zaokrąglania — dlatego
`mis.roundBack` jako błąd nadal nie jest proponowany (W1).

## Nowe zdania

Brak nowych (propozycje W1 `gm.seatSetup`, `gm.seatMove`, `gm.seatLoad` nadal wstrzymane — ćwiczenie otwarte).

## Źródła (czytane w W2)

| id | adres | organizacja | autor / data | szczebel |
|---|---|---|---|---|
| `catalyst-184` (z W1, nieczytane ponownie) | https://www.catalystathletics.com/exercise/184/Seated-Good-Morning/ | Catalyst Athletics | biblioteka firmowana | 4 |
| `westside-seated-good-mornings` | jw. | Westside Barbell | B. Hawk, 08.04.2025 | [OTWARTE] (wyżej) |

## Otwarte

| ćwiczenie / zdanie | powód |
|---|---|
| Seated Good Mornings — całość | jedno źródło szczebla 4 (Catalyst 184); Fitness Volt = 5; Westside — szczebel nieustalony i bez ustawienia; Prehab Guys (strony biblioteki bez autora) = 5 |
| Seated Good Mornings — zestaw ogólny | `gm.light` i `mis.roundBack` w `cue-sets.json:514` bez potwierdzenia dla tej wersji (W1) |
| Kneeling Squat — całość | brak źródeł szczebla 4 |
| Nazwa rodziny | Seated Good Mornings to siad, nie klęk (W1) — bez wpływu na wskazówki |
