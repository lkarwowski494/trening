# Wskazówki techniki — rodzina `pulldown` (fala W1, grupa G6)

> **Korekta szczebli 02.11.2026** (badacz-merytoryczny, agent; wg „Rozstrzygnięcia koordynatora linii 1.1 — szczeble organizacji”, 02.11.2026). Sprawdzone ponownie tylko kryteria (b) i (c) na już cytowanych stronach (WebFetch 02.11.2026).
> - **NFPT → 5 dla `nfpt-vbar-pulldown`:** artykuł ma autora („by Michele Rogers”) i datę („Posted August 11th, 2025”), ale strona nie podaje kwalifikacji autorki, a strona autorki (`nfpt.com/author/michele-rogers`) zwraca 404 — warunek „autor, data i kwalifikacje w biogramie” niespełniony.
> - **Catalyst Athletics = 4** (rozstrzygnięcie). **NASM = 4** (organizacja certyfikująca, artykuł blogowy). **ACE, ExRx** — zarejestrowane, bez zmian.
> - **Eleiko = 4** bez zmian (zarejestrowane, `kind: maker`; strony z platformy edukacyjnej Eleiko dla trenerów — kryterium (a); rodzaju sprzętu linkowego Eleiko nie sprawdzałem — do wiadomości koordynatora).
> - Skutki: **V-Bar Pulldown** gotowe → otwarte (każde zdanie miało NFPT jako jedno z dwóch źródeł); **Underhand Lat Pulldown** gotowe → częściowe (wypada zdanie `lpd.underhand`); `lpd.still` — bez NFPT w uzasadnieniu (nadal ≥ 2 organizacje w kartach, w których zostaje). Close-Grip, Single Arm, Straight Arm — bez zmian.
>
> **Przeliczenie koordynatora 02.11.2026 — nadrzędne; sekcja na końcu pliku (Eleiko na tych stronach = 5 → Single Arm Lat Pulldown otwarte).**

- Data: 02.11.2026 (korekta szczebli — ten sam dzień)
- Autor: badacz-merytoryczny (agent)
- Zakres: ćwiczenia rodziny `pulldown` bez własnych wskazówek (Close-Grip Front Lat Pulldown, V-Bar Pulldown, Underhand Lat Pulldown,
  Single Arm Lat Pulldown, Wide-Grip Pulldown Behind The Neck, Full Range-Of-Motion Lat Pulldown) + dopełnienie „Straight Arm Pulldown” (lista `partial`).
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1.

Metoda: zasada „wyjątek dla wskazówek techniki” (2 zgodne, niezależne, przeczytane źródła szczebla 4 z różnych organizacji). Wszystkie strony
otwarte 02.11.2026 (WebFetch). ExRx.net: HTTP 403 (sprawdzone 02.11.2026 na CBCloseGripPulldown), web.archive.org zablokowane przez narzędzie —
strony wariantów ExRx nieczytane. Istniejący wpis `exrx-LatissimusDorsi/CBFrontPulldown` (czytany w partii docs/research/27 przez migawkę archiwum)
użyty tylko tam, gdzie już potwierdza to samo zdanie dla „Lat Pulldown”, z dopiskiem „(wariant: chwyt)”.
Dokumentacja innych aplikacji treningowych i serwisy konsumenckie z wyników wyszukiwania — odrzucone (nie są źródłem).

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Close-Grip Front Lat Pulldown | general (vpull) | częściowe — gotowe do JSON (bez zdania o szerokości chwytu) | Brak przeczytanego opisu specyficznego dla wąskiego nachwytu; zdania ogólne ściągania potwierdzają ACE (chwyt nieokreślony) i Catalyst (dowolna szerokość chwytu). Zdanie o chwycie → Otwarte. Bez zmian po korekcie. |
| Underhand Lat Pulldown | general (vpull) | częściowe — gotowe do JSON (bez zdania o podchwycie) | Korekta 02.11.2026: `lpd.underhand` (Catalyst + NFPT) spada — NFPT = 5. Zostają zdania ogólne ściągania (ACE + ExRx / ACE + Catalyst 876). Karta nie wyróżnia podchwytu — jak Close-Grip. |
| Single Arm Lat Pulldown | general (vpull) | gotowe | Eleiko (wariant: klęcząc, jednorącz) + Catalyst (jednorącz). Bez zmian. |
| Straight Arm Pulldown (dopełnienie) | own, `partial` | gotowe — dopełnienie | Druga wskazówka `sapd.torso` (Eleiko + Catalyst); `sapd.arms` dostaje trzecie źródło (Catalyst). Po integracji można usunąć z listy `partial`. Bez zmian. |
| V-Bar Pulldown | general (vpull) | otwarte | Korekta 02.11.2026: wcześniej „gotowe” (NFPT + Catalyst 861; błąd: NFPT + NASM). NFPT = 5 → każde zdanie ma jedno źródło szczebla 4. |
| Wide-Grip Pulldown Behind The Neck | general (vpull) | otwarte | Brak przeczytanego opisu techniki (ExRx 403, Catalyst bez strony); NASM odradza wariant — to ocena zdrowotna, nie wskazówka (Otwarte). Obecny zestaw ogólny `vpull` nie jest potwierdzony dla tego wariantu. |
| Full Range-Of-Motion Lat Pulldown | general (vpull) | otwarte | Nie znaleziono przeczytanego źródła, które definiuje ten wariant (czym różni się od zwykłego ściągania). |

## 2. Blok JSON (do `exercises` w `data/zrodla/cues.json`) — NIEAKTUALNY — patrz przeliczenie 02.11.2026

Tylko zdania z ≥ 2 źródłami szczebla 4 z różnych organizacji (po korekcie szczebli 02.11.2026).
Dla „Straight Arm Pulldown” — pełny wpis zastępujący obecny (istniejące `setup`/`move` bez zmian, `tips` uzupełnione).

```json
{
  "Close-Grip Front Lat Pulldown": {
    "setup": [
      {"c": "lpd.thighs", "s": [["ace-158", "Step 1 (wariant: chwyt nieokreślony)"], ["exrx-LatissimusDorsi/CBFrontPulldown", "Preparation (wariant: chwyt szeroki)"]]}
    ],
    "move": [
      {"c": "lpd.pull", "s": [["ace-158", "Step 2 (wariant: chwyt nieokreślony)"], ["catalyst-725", "opis (wariant: chwyt; strona dopuszcza dowolną szerokość chwytu)"]]}
    ],
    "tips": [
      {"c": "lpd.fullStretch", "s": [["ace-158", "Step 4 (wariant: chwyt nieokreślony)"], ["catalyst-725", "opis (powrót do pełnego wyprostu rąk; wariant: chwyt)"]]},
      {"c": "lpd.toChest", "s": [["ace-158", "Step 3 (wariant: chwyt nieokreślony)"], ["catalyst-725", "opis (drążek przy obojczykach; wariant: chwyt)"]]},
      {"c": "lpd.still", "s": [["ace-158", "Step 2 (nie odchylaj się dalej w trakcie ściągania; wariant: chwyt nieokreślony)"], ["catalyst-725", "opis (tułów napięty, bez zaokrąglania i bujania; wariant: chwyt)"]]}
    ],
    "mistakes": []
  },
  "Underhand Lat Pulldown": {
    "setup": [
      {"c": "lpd.thighs", "s": [["ace-158", "Step 1 (wariant: chwyt nieokreślony)"], ["exrx-LatissimusDorsi/CBFrontPulldown", "Preparation (wariant: chwyt szeroki)"]]}
    ],
    "move": [
      {"c": "lpd.pull", "s": [["ace-158", "Step 2 (wariant: chwyt nieokreślony)"], ["catalyst-876", "opis (do górnej części klatki)"]]}
    ],
    "tips": [
      {"c": "lpd.toChest", "s": [["ace-158", "Step 3 (wariant: chwyt nieokreślony)"], ["catalyst-876", "opis (drążek przy obojczykach)"]]},
      {"c": "lpd.fullStretch", "s": [["ace-158", "Step 4 (wariant: chwyt nieokreślony)"], ["catalyst-876", "opis (powrót do pełnego wyprostu rąk nad głową)"]]}
    ],
    "mistakes": []
  },
  "Single Arm Lat Pulldown": {
    "setup": [
      {"c": "lpd1.setup", "s": [["eleiko-659827ed", "Setup (wariant: klęcząc; uchwyt, ręka wyprostowana nad głową)"], ["catalyst-895", "opis (uchwyt jedną ręką, ręka wyprostowana nad głową)"]]}
    ],
    "move": [
      {"c": "lpd1.pull", "s": [["eleiko-659827ed", "Procedure (dłoń do przodu barku, powrót nad głowę; wariant: klęcząc)"], ["catalyst-895", "opis (uchwyt w stronę barku, powolny powrót)"]]}
    ],
    "tips": [
      {"c": "lpd1.blade", "s": [["eleiko-659827ed", "Coaching points (zacznij od ściągnięcia łopatek w tył i w dół)"], ["catalyst-895", "opis (ściąganie łopatki w dół i do tyłu)"]]},
      {"c": "lpd.still", "s": [["eleiko-659827ed", "Procedure (tułów nieruchomo)"], ["catalyst-895", "opis (tułów napięty, plecy neutralnie)"]]}
    ],
    "mistakes": []
  },
  "Straight Arm Pulldown": {
    "setup": [
      {"c": "sapd.setup", "s": [["ace-334", "opis (wyciąg w najwyższym położeniu, drążek; parafraza)"], ["eleiko-659842f4", "Setup (bloczek na wysokości głowy, ręce proste; parafraza)"]]}
    ],
    "move": [
      {"c": "sapd.move", "s": [["ace-334", "opis (proste ręce, dłonie do przodu pasa, powolny powrót; parafraza)"], ["eleiko-659842f4", "Procedure (drążek w stronę ud prostymi rękami, powrót pod kontrolą; parafraza)"], ["eleiko-6598447e", "(wariant: uchwyty) Procedure"]]}
    ],
    "tips": [
      {"c": "sapd.arms", "s": [["ace-334", "opis (ręce proste przez cały ruch; parafraza)"], ["eleiko-659842f4", "Procedure (ręce proste; parafraza)"], ["eleiko-6598447e", "(wariant: uchwyty) Procedure"], ["catalyst-907", "opis (ręce wyprostowane przez całe powtórzenie)"]]},
      {"c": "sapd.torso", "s": [["eleiko-659842f4", "Procedure (keep your torso still)"], ["catalyst-907", "opis (brzuch napięty, tułów stabilny)"]]}
    ],
    "mistakes": []
  }
}
```

Uwaga do „Close-Grip Front Lat Pulldown” i „Underhand Lat Pulldown”: każde zdanie ma 2 źródła, ale żadne zdanie nie opisuje wprost wąskiego
chwytu ani podchwytu (ACE nie podaje szerokości ani ułożenia dłoni). Jeśli koordynator uzna kartę bez zdania o chwycie za za słabą dla wariantu —
przenieść do „Otwarte” (wtedy zostaje zestaw ogólny albo tryb open).

Usunięte z bloku przy korekcie 02.11.2026: cały wpis „V-Bar Pulldown” (`lpd.vbarGrip`, `lpd.vbarPull`, `lpd.fullStretch`, `lpd.still`, `lpd.mis.shrug`)
oraz `lpd.underhand` z „Underhand Lat Pulldown” — sekcja 5.

## 3. Nowe źródła

| id | org | tytuł | url | szczebel | czytane |
|---|---|---|---|---|---|
| catalyst-725 | Catalyst Athletics | Lat Pulldown | https://www.catalystathletics.com/exercise/725/Lat-Pulldown/ | 4 | 02.11.2026 |
| catalyst-861 | Catalyst Athletics | Neutral-Grip Lat Pulldown | https://www.catalystathletics.com/exercise/861/Neutral-Grip-Lat-Pulldown/ | 4 | 02.11.2026 |
| catalyst-876 | Catalyst Athletics | Reverse-Grip Lat Pulldown | https://www.catalystathletics.com/exercise/876/Reverse-Grip-Lat-Pulldown/ | 4 | 02.11.2026 |
| catalyst-895 | Catalyst Athletics | Single-Arm Pulldown | https://catalystathletics.com/exercise/895/Single-Arm-Pulldown/ | 4 | 02.11.2026 |
| catalyst-907 | Catalyst Athletics | Straight-Arm Pulldown | https://www.catalystathletics.com/exercise/907/Straight-Arm-Pulldown/ | 4 | 02.11.2026 |
| eleiko-659827ed | Eleiko | Cable Pulldown – Kneeling, 1-Arm | https://eleiko.inspire360.com/resource/659827ede629c99e2b085e81 | 4 (przeliczenie 02.11.2026: **5** — bez autora i daty) | 02.11.2026 |
| nfpt-vbar-pulldown | NFPT | How to Do a Close Grip V-Bar Lat Pulldown (M. Rogers, 11.08.2025) | https://nfpt.com/close-grip-lat-pulldown-v-bar | 5 (korekta 02.11.2026: brak kwalifikacji autorki; strona autorki 404) — nie liczy się | 02.11.2026 (ponownie przy korekcie) |
| nasm-lpd-biomech | NASM | The Biomechanics of the Lat Pulldown: Muscles, Grips, and Form (blog) | https://www.nasm.org/resource-center/blog/training/the-biomechanics-of-the-lat-pulldown-muscles-grip-and-form | 4 | 02.11.2026 |

Nowe organizacje:
- **Catalyst Athletics** (catalystathletics.com, biblioteka ćwiczeń zespołu trenerskiego Grega Everetta) — szczebel 4 (rozstrzygnięcie 02.11.2026).
- **NFPT** (organizacja certyfikująca trenerów) — szczebel 4 tylko dla artykułu z autorem, datą i kwalifikacjami w biogramie; cytowany artykuł tego
  nie spełnia → 5.
- NASM — organizacja już w rejestrze; nowe tylko źródło (artykuł blogowy, a nie biblioteka ćwiczeń).

## 4. Nowe zdania

| id | PL | EN (propozycja) | źródła |
|---|---|---|---|
| lpd.still | Tułów stabilny — bez bujania. | Keep your torso steady — no swinging. | ACE 158 Step 2; Catalyst 725/895; Eleiko 659827ed (NFPT usunięte przy korekcie) |
| lpd1.setup | Chwyć uchwyt jedną ręką; ręka wyprostowana nad głową. | Hold the handle in one hand, arm straight overhead. | Eleiko 659827ed (Setup); Catalyst 895 |
| lpd1.pull | Ściągnij uchwyt w dół do barku; wróć powoli do wyprostu ręki. | Pull the handle down to your shoulder; return slowly until your arm is straight. | Eleiko 659827ed (Procedure); Catalyst 895 |
| lpd1.blade | Zacznij ruch od ściągnięcia łopatki w dół i do tyłu. | Start by drawing your shoulder blade down and back. | Eleiko 659827ed (Coaching points); Catalyst 895 |
| sapd.torso | Napnij brzuch; tułów zostaje nieruchomo. | Brace your abs; your torso stays still. | Eleiko 659842f4 (Procedure); Catalyst 907 |

Istniejące zdania użyte ponownie: `lpd.thighs`, `lpd.pull`, `lpd.fullStretch`, `lpd.toChest`, `sapd.setup`, `sapd.move`, `sapd.arms`.
Nowe zdania wymagają wpisu w rejestrze twierdzeń (`node scripts/claims.mjs --stub`) przy integracji.

Zdania zaproponowane wcześniej, po korekcie 02.11.2026 bez kompletu źródeł — NIE do integracji (sekcja 5): `lpd.vbarGrip` „Chwyć uchwyt V oburącz;
ręce wyprostowane nad głową.”, `lpd.vbarPull` „Ściągnij uchwyt w dół przed twarzą, ściągając łopatki w dół i do tyłu.”, `lpd.underhand` „Chwyć drążek
podchwytem — dłonie zwrócone do siebie.”, `lpd.mis.shrug` „Barki uciekają w górę, do uszu.”

## 5. Otwarte

1. **V-Bar Pulldown (cała karta) — szczebel źródła wg rozstrzygnięcia 02.11.2026:** `lpd.vbarGrip`, `lpd.vbarPull`, `lpd.fullStretch`, `lpd.still`
   (NFPT + Catalyst 861) i `lpd.mis.shrug` (NFPT + NASM) — NFPT = 5, więc każde zdanie ma jedno źródło szczebla 4 (Catalyst 861 albo NASM).
   Możliwy następny krok: drugie źródło szczebla 4 opisujące uchwyt V/neutralny (np. ACE, Eleiko) albo artykuł NFPT z biogramem autora.
   Punkt końcowy nadal sprzeczny (NFPT — broda, Catalyst 861 — górna część klatki).
2. **Underhand Lat Pulldown — zdanie o podchwycie (`lpd.underhand`) — szczebel źródła wg rozstrzygnięcia 02.11.2026:** Catalyst 876 + NFPT;
   NFPT = 5 → jedno źródło.
3. **Wide-Grip Pulldown Behind The Neck** — brak przeczytanego opisu techniki z dwóch organizacji (ExRx 403; Catalyst wymienia wariant tylko
   w liście programowej, bez opisu; NASM nie opisuje techniki). NASM (artykuł o biomechanice, sekcja „Common Compensations”) pisze, że ten wariant
   „is generally best avoided” — to ocena ryzyka (twierdzenie zdrowotne), nie wskazówka techniki; wymaga zasad szczebla 1–2, nie wpisywać do karty.
   Obecny zestaw ogólny `vpull` dla tego ćwiczenia nie jest potwierdzony żadnym przeczytanym źródłem dla wariantu zza karku — rekomendacja:
   zestaw ogólny dla tego wariantu przejrzeć (zdania „do klatki” byłyby błędne).
4. **Full Range-Of-Motion Lat Pulldown** — nie znaleziono przeczytanego źródła, które definiuje ten wariant.
5. **Close-Grip Front Lat Pulldown — zdanie o wąskim nachwycie** — brak dwóch przeczytanych opisów wariantu (ExRx CBCloseGripPulldown: 403).
6. **Liczby pominięte:** NFPT podaje czas powrotu 2–3 s — źródło szczebla 5 po korekcie; nie wpisano. NFPT łączy błędy z „poważnym urazem” —
   twierdzenie zdrowotne, nie wpisano.

## 6. Stan

Rodzina `pulldown` zakończona w zakresie dostępnych źródeł; korekta szczebli 02.11.2026 wykonana. Gotowe: Single Arm Lat Pulldown, Straight Arm
Pulldown (dopełnienie); częściowe (do JSON, bez zdania o chwycie): Close-Grip Front Lat Pulldown, Underhand Lat Pulldown; otwarte: V-Bar Pulldown
(spadło), Wide-Grip Pulldown Behind The Neck, Full Range-Of-Motion Lat Pulldown.
Pułapki: exrx.net 403, web.archive.org zablokowane; strony ACE #35 (Kneeling Lat Pulldown) zwracają tylko metadane (brak kroków);
`nfpt.com/?p=8954` przekierowuje na inny artykuł; `nfpt.com/author/michele-rogers` — 404.

## Korekta szczebli — przeliczenie koordynatora 02.11.2026

Reguły: `szczeble-organizacji-2026-11-02.md` (rozstrzygnięcie + uzupełnienia 1–3); kryterium karty z decyzji 02.11.2026. Strony warunkowe sprawdzone WebFetch 02.11.2026.

### Źródła → szczebel

| Źródło | Szczebel | Dowód |
|---|---|---|
| `ace-158`, `ace-334` (ACE) | 4 | organizacja certyfikująca; firmowane (precedens docs/research/27) |
| `exrx-LatissimusDorsi/CBFrontPulldown` (ExRx) | 4 | precedens docs/research/27 (migawka archiwum) |
| `catalyst-725`, `-861`, `-876`, `-895`, `-907` (Catalyst Athletics) | 4 | rozstrzygnięcie (tabela główna): biblioteka firmowana przez Catalyst Athletics, Inc.; jedna organizacja = jedno źródło |
| `nasm-lpd-biomech` (NASM) | 4 | organizacja certyfikująca |
| `eleiko-659827ed` (Eleiko, platforma edukacyjna eleiko.inspire360.com) | **5** | WebFetch 02.11.2026: brak autora, brak daty, nagłówek „Eleiko”, sformułowanie „Eleiko Education” nie występuje; opis ogólny („Attach a handle to a cable pulley at head height”), nie dokumentacja konkretnego wyciągu Eleiko. Uzupełnienie 3: dział edukacji liczy się z autorem albo firmowany „Eleiko Education”; jako producent — tylko dokumentacja własnego sprzętu |
| `eleiko-659842f4`, `eleiko-6598447e` (ta sama platforma) | nie liczy się | `659842f4` — HTTP 500 (dwie próby 02.11.2026), nieotwarta → nie liczy się; `6598447e` nieotwierana — ta sama platforma i format co `659827ed` |
| `nfpt-vbar-pulldown` (NFPT) | 5 | bez kwalifikacji autorki (korekta 02.11.2026, bez zmian) |

### Zdania → stan

| Zdanie | Ćwiczenie | Źródła po przeliczeniu | Stan |
|---|---|---|---|
| `lpd.thighs`, `lpd.pull`, `lpd.fullStretch`, `lpd.toChest`, `lpd.still` | Close-Grip Front | ACE + ExRx / ACE + Catalyst | zostają |
| `lpd.thighs`, `lpd.pull`, `lpd.toChest`, `lpd.fullStretch` | Underhand | ACE + ExRx / ACE + Catalyst | zostają |
| `lpd1.setup`, `lpd1.pull`, `lpd1.blade`, `lpd.still` | Single Arm | tylko Catalyst | **spadają** |
| `sapd.torso` | Straight Arm (dopełnienie) | tylko Catalyst | **spada** |
| `sapd.arms` (trzecie źródło) | Straight Arm | ACE + Catalyst | zostaje (2 organizacje) |

### Karty → stan

| Ćwiczenie | Stan | Powód |
|---|---|---|
| Close-Grip Front Lat Pulldown | własna bez błędów | ustawienie (`lpd.thighs`) + ruch (`lpd.pull`); zastrzeżenie bez zmian: karta nie opisuje wąskiego chwytu |
| Underhand Lat Pulldown | własna bez błędów | jw.; karta nie opisuje podchwytu |
| Single Arm Lat Pulldown | **otwarta** (było: gotowe) | Eleiko na tej stronie = 5 → każde zdanie ma tylko Catalyst |
| Straight Arm Pulldown (istniejący wpis `partial`) | **[OTWARTE] — do przeglądu koordynatora** | dopełnienie `sapd.torso` spada; istniejące w `data/zrodla/cues.json` (wiersz 8000 i dalej) `sapd.setup` i `sapd.move` stoją na ACE + `eleiko-659842f4` — strona nieotwarta (HTTP 500), a ta platforma bez autora i daty = 5 wg uzupełnienia 3 → po przeliczeniu jedno źródło. Wpis jest już w danych aplikacji — decyzja o nim należy do koordynatora (poza tą falą) |
| V-Bar Pulldown, Wide-Grip Behind The Neck, Full ROM | otwarte | bez zmian |

Liczby: przed — gotowe 1 (+ dopełnienie), częściowe 2, otwarte 3; po — własne z błędami 0, własne bez błędów 2, otwarte 4; dopełnienie Straight Arm: tylko trzecie źródło `catalyst-907` przy `sapd.arms` (do decyzji razem z przeglądem wpisu).

### Blok do wdrożenia (po przeliczeniu 02.11.2026)

```json
{
  "Close-Grip Front Lat Pulldown": {
    "setup": [
      {"c": "lpd.thighs", "s": [["ace-158", "Step 1 (wariant: chwyt nieokreślony)"], ["exrx-LatissimusDorsi/CBFrontPulldown", "Preparation (wariant: chwyt szeroki)"]]}
    ],
    "move": [
      {"c": "lpd.pull", "s": [["ace-158", "Step 2 (wariant: chwyt nieokreślony)"], ["catalyst-725", "opis (wariant: chwyt; strona dopuszcza dowolną szerokość chwytu)"]]}
    ],
    "tips": [
      {"c": "lpd.fullStretch", "s": [["ace-158", "Step 4 (wariant: chwyt nieokreślony)"], ["catalyst-725", "opis (powrót do pełnego wyprostu rąk; wariant: chwyt)"]]},
      {"c": "lpd.toChest", "s": [["ace-158", "Step 3 (wariant: chwyt nieokreślony)"], ["catalyst-725", "opis (drążek przy obojczykach; wariant: chwyt)"]]},
      {"c": "lpd.still", "s": [["ace-158", "Step 2 (nie odchylaj się dalej w trakcie ściągania; wariant: chwyt nieokreślony)"], ["catalyst-725", "opis (tułów napięty, bez zaokrąglania i bujania; wariant: chwyt)"]]}
    ],
    "mistakes": []
  },
  "Underhand Lat Pulldown": {
    "setup": [
      {"c": "lpd.thighs", "s": [["ace-158", "Step 1 (wariant: chwyt nieokreślony)"], ["exrx-LatissimusDorsi/CBFrontPulldown", "Preparation (wariant: chwyt szeroki)"]]}
    ],
    "move": [
      {"c": "lpd.pull", "s": [["ace-158", "Step 2 (wariant: chwyt nieokreślony)"], ["catalyst-876", "opis (do górnej części klatki)"]]}
    ],
    "tips": [
      {"c": "lpd.toChest", "s": [["ace-158", "Step 3 (wariant: chwyt nieokreślony)"], ["catalyst-876", "opis (drążek przy obojczykach)"]]},
      {"c": "lpd.fullStretch", "s": [["ace-158", "Step 4 (wariant: chwyt nieokreślony)"], ["catalyst-876", "opis (powrót do pełnego wyprostu rąk nad głową)"]]}
    ],
    "mistakes": []
  }
}
```

Nowe zdania w bloku: `lpd.still` (1). Wpis „Straight Arm Pulldown” celowo poza blokiem (wyżej).
