# Recenzja niezależna kart ćwiczeń 1.0.1 (bramka 4, L-047)

- Gałąź: wersja-1-0-1-r2 (HEAD dffa0ac; zmiany 43b0d25..HEAD, commit treści d069206)
- autor: „tlumacz r2/teksty”
- recenzent: „audytor (sesja 1.0.1, niezależny)”
- data: 2026-10-28
- Źródła przeczytane 28.10.2026 (WebFetch, pełna treść strony):
  - NASM Romanian Deadlift Barbell — Common Mistakes: „Bending the knees too much, which converts the exercise into a squat variation”; Step 3: „…slightly bent knees”.
  - NASM Dumbbell Romanian Deadlift — Common Mistakes: „Bending the knees too much, which converts movement into a squat variation”; Step 2: „slight knee bend”.
  - ACE #317 Romanian Deadlift — „…keep a slight bend in both knees and a straight back.”
  - NASM Barbell Bench Press — Common Mistakes: „Positioning elbows too wide or too close…”.
  - Stronger by Science „How to bench”, FAQ „How much should I tuck my elbows?”: „…the angle between your upper arm and torso should be around 45-60 degrees.”
- Pomiar animacji (jest, plik tymczasowy w scratchpadzie, nie w repo):
  - RDL kneesBent: kolano na dole 16° (poprawnie) → 58° (błąd), sztanga; 13° → 53°, hantle; biodro bez zmian (72/73°). Pokazuje wyraźnie ugięte kolana, „w stronę przysiadu”.
  - Wyciskanie, dół ruchu, kąt ramię–tułów (3D): Bench Press (sztanga) 53°, Chains/Chain Press/Reverse Band/Smith 50°, Decline 52°, Decline (hantle) 51°, Smith Decline 52°; widok z góry 33–36°. Łokcie „pośrodku”, w przedziale 45–60° SBS.

## Werdykty

| Karta / zestaw | Werdykt | Uzasadnienie |
|---|---|---|
| RDL (sztanga) — karta | ZATWIERDZONE | rdl.mis.knees (pl/en) mówi to samo co NASM Common Mistakes, ACE potwierdza „lekkie ugięcie”. Błąd figury kneesBent podpisany teraz opisem błędu, nie zaleceniem (to była wada). Animacja: kolano 16° → 58°. Nie przeczy rdl.move („kolana lekko ugięte”) ani rdl.depth. |
| RDL (hantle/linki) — karta | ZATWIERDZONE | Jak wyżej; NASM Dumbbell RDL ma to samo zdanie w Common Mistakes. Animacja: 13° → 53°. |
| rdl.knees (wskazówka poprawna, zestawy ogólne: Stiff-Legged Barbell Deadlift, Smith Machine Stiff-Legged Deadlift, Single Arm RDL) | ZATWIERDZONE (tylko źródło) | Nowy wpis „zrodla” w wskazowki-ogolne.json: NASM + ACE — 2 organizacje, szczebel 4, mówią „kolana lekko ugięte”. Wpis musiał się zmienić, bo „cwiczenie: RDL (sztanga)” wskazywał kartę, na której nie ma już tego id. Tekst i przypisania bez zmian, skróty tych zestawów bez zmian. |
| Bench Press with Chains | ZATWIERDZONE | bp.elbowsMid zgodne z NASM (za szeroko albo za blisko = błąd) i SBS (45–60°), tekst bez liczby. Figura 50°. Nie przeczy bp.contact/bp.blades/bp.control/bp.mis.arch. |
| Chain Press | ZATWIERDZONE | Jak wyżej (katalog: łańcuchy + ławka płaska, figura BP chain). |
| Reverse Band Bench Press | ZATWIERDZONE | Jak wyżej. |
| Smith Machine Bench Press | ZATWIERDZONE | Jak wyżej; tor prowadnicy nie zmienia ustawienia łokci. |
| Decline Bench Press | ZATWIERDZONE | Źródła mówią o wyciskaniu płaskim — przy ławce skośnej w dół to analogia, ale ekran pokazuje dopisek „Ogólne wskazówki dla tego ruchu” (wariant A, 25.10.2026). Badacz świadomie wyłączył elbowsMid w gilotynie i wąskich odmianach, tu nie. Figura 52°. Na karcie nie ma bp.contact (stopy pod wałkami) — prawidłowo. |
| Decline Bench Press (hantle) | ZATWIERDZONE | Jak wyżej; figura 51°. |
| Smith Machine Decline Press | ZATWIERDZONE | Jak wyżej; figura 52°. |
| scripts/cues/gen.mjs (validate, setIds) | ZATWIERDZONE | Zmiana tylko oznacza id z cue-sets.json jako „używane” przy kontroli nieużywanych zdań w pl.json. Nie omija źródeł: wyświetlane id ogólne nadal muszą mieć wpis w wskazowki-ogolne.json (brakiZrodelOgolnych, check:zrodla-runtime), a każdy zestaw — aktualną recenzję ze skrótem (karty-recenzja.test.tsx). Zestawy inne niż general nie mają żadnych id (sprawdzone: 0), więc nie da się w ten sposób przemycić tekstu. Wszystkie wywołania (CLI i test zrodla-pelne-cues) podają ten sam zbiór. |

## Uwagi (nie blokują)

1. UWAGA (NISKIE, narzędzie deweloperskie, bez drogi przez UI): scripts/figures/v2-validate.mjs:50 nadal mapuje `{ kneesBent: 'rdl.knees' }`. Po zmianie RDL ma w mistakes `rdl.mis.knees`, więc filtr `dopuszczone.includes(cue)` odrzuca błąd, a `przyklad('hinge')` po cichu zwraca przykład bez błędów (wcześniej był 1). Dotyczy tylko przykładów few-shot do generowania póz (gemini-pozy.mjs). Test figures-v2-contract.test.ts:169 sprawdza `nBledow` tylko dla squat, nie dla hinge, dlatego tego nie złapał. Poprawka: `'rdl.mis.knees'` + w teście `nBledow: 1` dla hinge.
2. UWAGA (bez wpływu na UI): data/zrodla/figures.json (figura v1 RDL, wpis „zastapiona”, niewyświetlana) — `why` poprawnej pozy końcowej (kolano 15±12°) wskazuje teraz `rdl.mis.knees`, czyli opis błędu. Wymusza to gen.mjs (why musi wskazywać id z karty). Wygenerowany dokument figur pokaże „kolano 15° ← Zbyt mocno ugięte kolana…” — to nielogiczne, ale tylko wewnętrznie. Przy przywróceniu v1 trzeba to przemyśleć.
3. Stan bramki: do czasu wpisu recenzji obie karty RDL są na liście `hidden` w lib/cues/data.json, a 7 zestawów wyciskania nie ma na liście `general`. Bramka działa zgodnie z założeniem. Czerwone teraz: tests/karty-recenzja.test.tsx (skróty kart i zestawów) i tests/figury-recenzja.test.tsx (skróty v1 RDL).

## Co wpisać w docs/research/figury-recenzja.json

Skróty z `node scripts/zrodla-runtime.mjs --skroty` na HEAD dffa0ac. Przed wpisem policz je jeszcze raz, jeśli coś się zmieniło.

### Sekcja „karty” (zastąp istniejące wpisy)

```json
"RDL (sztanga)": {
 "werdykt": "wyswietlana",
 "data": "2026-10-28",
 "stan": "zrecenzowana niezależnie (bramka 4, treść karty: ustawienie, ruch, wskazówki, błędy wobec źródeł przeczytanych 28.10.2026)",
 "autor": "tlumacz r2/teksty",
 "recenzent": "audytor (sesja 1.0.1, niezależny)",
 "kto": "audytor — recenzja niezależna treści karty 1.0.1 (opis błędu rdl.mis.knees przy błędzie figury kneesBent), 28.10.2026",
 "sha": "2c2795567ec0",
 "uwagi": "1.0.1: w błędach zamiast zalecenia rdl.knees opis błędu rdl.mis.knees („Zbyt mocno ugięte kolana — ruch zamienia się w przysiad”) — NASM Common Mistakes „Bending the knees too much, which converts the exercise into a squat variation”, ACE #317 „slight bend in both knees”. Animacja błędu: kolano na dole 16° → 58°."
},
"RDL (hantle/linki)": {
 "werdykt": "wyswietlana",
 "data": "2026-10-28",
 "stan": "zrecenzowana niezależnie (bramka 4, treść karty: ustawienie, ruch, wskazówki, błędy wobec źródeł przeczytanych 28.10.2026)",
 "autor": "tlumacz r2/teksty",
 "recenzent": "audytor (sesja 1.0.1, niezależny)",
 "kto": "audytor — recenzja niezależna treści karty 1.0.1 (opis błędu rdl.mis.knees przy błędzie figury kneesBent), 28.10.2026",
 "sha": "1579524968b9",
 "uwagi": "1.0.1: rdl.mis.knees — NASM Dumbbell RDL Common Mistakes „Bending the knees too much, which converts movement into a squat variation”, ACE #317. Animacja błędu: kolano na dole 13° → 53°. ExRx — jak w poprzednim wpisie (do ponownego odczytu)."
}
```

### Sekcja „zestawy” (zastąp 7 istniejących wpisów; „rodzina”: „bench”)

Wspólne pola: "rodzina": "bench", "werdykt": "wyswietlana", "data": "2026-10-28",
"stan": "zrecenzowana niezależnie (bramka 4, przypisanie zestawu ogólnego do ruchu ćwiczenia i teksty wskazówek, 28.10.2026)",
"autor": "tlumacz r2/teksty", "recenzent": "audytor (sesja 1.0.1, niezależny)",
"kto": "audytor — recenzja niezależna zestawu 1.0.1 (tekst bp.elbowsMid), 28.10.2026".

| Zestaw | sha | uwagi |
|---|---|---|
| Bench Press with Chains | aadff1efce51 | „1.0.1: dodany tekst bp.elbowsMid (łokcie pośrodku, bez liczby) — NASM Barbell Bench Press Common Mistakes „too wide or too close”, SBS FAQ 45–60°; figura: ramię–tułów 50° na dole. Nie przeczy bp.contact/blades/control/mis.arch.” |
| Chain Press | aadff1efce51 | jak wyżej |
| Reverse Band Bench Press | aadff1efce51 | jak wyżej |
| Smith Machine Bench Press | aadff1efce51 | jak wyżej |
| Decline Bench Press | d4990dcebe38 | „1.0.1: bp.elbowsMid — źródła o wyciskaniu płaskim, analogia oznaczona dopiskiem „Ogólne wskazówki dla tego ruchu”; figura 52°; bez bp.contact (stopy pod wałkami).” |
| Decline Bench Press (hantle) | d4990dcebe38 | jak Decline Bench Press; figura 51° |
| Smith Machine Decline Press | d4990dcebe38 | jak Decline Bench Press; figura 52° |

Usuń z „uwagi” starych wpisów zdanie „bp.elbowsMid bez tekstu PL — ekran go pomija…”, bo jest już nieaktualne.

### Sekcja „v1” (wymagane przez tests/figury-recenzja.test.tsx; werdykt bez zmian „zastapiona”)

- "RDL (sztanga)": "sha": "d08c77a6346a"
- "RDL (hantle/linki)": "sha": "2de2689449ea"
- dopisz "uwagi" wzorem istniejących wpisów v1: „Skrót zmieniony 28.10.2026 tylko przez zmianę id błędu karty (rdl.knees → rdl.mis.knees) i odwołania why w data/zrodla/figures.json; pozy bez zmian (autor: tlumacz r2/teksty, recenzja treści: audytor 1.0.1 — sekcja „karty”).”

Na koniec: przebuduj runtime (`node scripts/zrodla-runtime.mjs`; kontrola: `npm run check:zrodla-runtime`) i uruchom tests/karty-recenzja.test.tsx, tests/figury-recenzja.test.tsx i tests/figures-v2-errors.test.tsx.
