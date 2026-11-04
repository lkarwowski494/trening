# Przegląd wsteczny: fedb a książki plyometryczne (badacz, 03.11.2026)

PLIK PRYWATNY (poza repo). Są tu krótkie cytaty z ks-hpp i z fedb. Zlecił koordynator 03.11.2026: parafraza z tym samym układem nie liczy się jako drugie źródło (podstawa: `wyniki-r2c.md:7`).

## Zakres i metoda
- Grep `hpp|High-Powered|Plyometrics|ks-` w `etap2/wyniki-*.md|json` dał 8 plików (plyo, plyo-r2, r2c, p5b). Dodatkowo szukałem `Radcliffe|HK-R|ks-hpp|Jumping Into|\bChu\b` w całym `~/etap2`: wyszły tylko plyo, plyo-r2, r2c, STAN-r2c, gemini/plyo-zrodla-adresy.md i ksiazki/pokrycie-ksiazkami.json. W `~/trening/docs/research/etap2/wyniki-2026-11-03/` jest jedno trafienie (`STAN-POKRYCIA-0311.md:18`). To tylko wzmianka o rundzie i niczego nie liczy.
- Jedyna książka plyometryczna w użyciu to ks-hpp (Radcliffe i Farentinos, HK 1999, `~/zrodla-prywatne/hpp.txt`). HK-R z rundy 1 to wyciąg z tej samej książki (3. wyd.). W `ksiazki/` jest tylko `pokrycie-ksiazkami.json`, a innej książki plyometrycznej tam nie ma.
- Pole `fedb` w `catalog.json` zawiera tylko nazwę (np. `:21589`), bez tekstu. Tekst fedb przeczytałem w repozytorium free-exercise-db: `raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/<Nazwa>.json`, tablica `instructions` (szczebel 5).

## Wynik główny
**Żaden wcześniejszy wynik nie liczy fedb i ks-hpp (ani HK-R) jako dwóch niezależnych źródeł tego samego punktu.**
- Runda 1 (`wyniki-plyo.md`) nie używa fedb.
- Runda 2 (`wyniki-plyo-r2.*`) nie używa fedb. Jedyne źródła to ks-hpp, ks-k2, ks-nsca-podst i usa-hockey.
- r2c (`wyniki-r2c.*`) już wykluczył fedb przy 4 drillach z ks-hpp.
- p5b wspomina „Plyometrics” tylko w adresie ExRx (`wyniki-p5b.md:40`, `wyniki-p5b.json:128`), bez książki.

**Zmienionych stanów: 0.**

## Tabela porównań

| Ćwiczenie | Punkt | Plik:linia wyniku | fedb a ks-hpp (porównanie) | Ocena | Stan (było → jest) |
|---|---|---|---|---|---|
| Star Jump | setup, move | `wyniki-r2c.json:104`, `:106` | fedb, krok 1: „Begin in a relaxed stance with your feet shoulder width apart and hold your arms close to the body.” ks-hpp drill 5: „Assume a relaxed, upright stance with feet about shoulderwidth apart.” Ta sama kolejność (półprzysiad → wyskok → rozłożenie kończyn → złożenie przy lądowaniu) | przeróbka (fedb już wykluczony w r2c) | bez zmian: setup to jedno źródło, move komplet (ks-hpp + Topend) |
| Side Hop-Sprint | setup, move | `wyniki-r2c.json:58`, `:61–62` | fedb: przeskoki w bok tam i z powrotem, potem „finish this drill by sprinting a short distance upon landing the last hop”. ks-hpp drill 36: lądowanie po ostatnim powtórzeniu w pozycji startu do sprintu. Ten sam nietypowy układ | przeróbka (już wykluczony) | bez zmian: przeskoki komplet (ks-hpp + NISMAT), sprint to jedno źródło |
| Double Leg Butt Kick | setup, move | `wyniki-r2c.json:6`, `:8` | Porównania nie powtarzałem. r2c (`:6`) wskazuje parafrazę instr. 1, a cytat ks-hpp jest w `:6` | przeróbka wg r2c (już wykluczony) | bez zmian |
| Single Leg Butt Kick | setup, move | `wyniki-r2c.json:96–97` | r2c: fedb „Using a countermovement jump, take off upward…”. ks-hpp drill 38: „Using a quick countermovement jump, extend the hips…” | przeróbka (już wykluczony) | bez zmian: jedno źródło |
| Box Skip | setup, move | `wyniki-plyo-r2.json:37`; `wyniki-plyo.md:38`; `pokrycie-ksiazkami.json:461` | fedb krok 3: „Drive off the back leg, attempting to gain as much height with the hips as possible.” ks-hpp drill 30 (hpp.txt l. 2039–2040) ma to samo zdanie dosłownie. Kroki 4–5 (lądowanie między skrzyniami na tej samej nodze, krok do następnej skrzyni) mają ten sam układ | przeróbka (fedb dotąd nie był liczony) | bez zmian: jedno źródło. **Na przyszłość: fedb nie może być drugim źródłem** |
| Alternate Leg Diagonal Bound | setup | `wyniki-plyo-r2.json:15` | fedb krok 1: „Assume a comfortable stance with one foot slightly in front of the other.” ks-hpp drill 27 (l. 1983), do którego odsyła drill 29: „Assume a comfortable stance with one foot slightly ahead of the other” | przeróbka (fedb nie był liczony) | bez zmian: jedno źródło. Na przyszłość fedb się nie liczy |
| Single-Leg Stride Jump | setup, move | `wyniki-plyo-r2.json:120–121` | fedb: „Stand to the side of a box with your inside foot on top of it”, potem zamach rąk w górę i „jumping upward as high as possible”. ks-hpp drill 11 (l. 1658–1663): bokiem do ławki, „inside foot on top of the bench”, „upward movement of the arms… jump upward as high as possible”. Ten sam układ i te same frazy. Różnica: fedb ląduje „in the same position”, ks-hpp przesuwa się wzdłuż ławki (tryb MR) | przeróbka (fedb nie był liczony, para to ks-hpp + ks-k2) | bez zmian (stan „ustalone (tekst)” stoi na ks-hpp + ks-k2; nadal blokuje rozbieżność z rysunkiem). Na przyszłość fedb się nie liczy |
| Single-Leg Hop Progression | setup | `wyniki-plyo-r2.json:108` | fedb krok 1: „Assume a relaxed standing position, balanced on one leg.” ks-hpp drill 39 (l. 2227–2228): „Assume a relaxed standing position… Completely balance on one leg”. Do tego „countermovement” w obu | przeróbka (fedb nie był liczony, para to ks-hpp + ks-k2) | bez zmian: ustalone. Na przyszłość fedb się nie liczy |
| Bench Jump | setup, move | `wyniki-plyo-r2.json:24–26` | fedb: przeskok **nad** ławką i z powrotem („Jump over the bench… jump back over the bench”). ks-hpp drill 3: wskok **na** skrzynię. Inny ruch i inny układ | niezależne, ale to inna odmiana (fedb nie był liczony) | bez zmian. Uwaga dla recenzenta: fedb opisuje przeskok nad ławką, a rysunek (`plyo.mjs:198`) i zdania pokazują wskok na ławkę. [OTWARTE] Którą odmianę oznacza nazwa w katalogu |

## Uwagi
- HK-R (runda 1) i ks-hpp (runda 2) to ta sama książka, tylko w innych wydaniach. Nigdzie nie są liczone jako dwa źródła: przy Box Skip obie rundy dają „jedno źródło”. Z kolei `pokrycie-ksiazkami.json:2` wymienia HK-R jako osobną książkę obok K1, K2 i Basics. Przy następnym liczeniu HK-R trzeba traktować jako ks-hpp.
- Wzorzec jest powtarzalny: w 7 z 8 porównanych pozycji drillu z ks-hpp opis fedb (szczebel 5) przerabia ks-hpp. Proponowana reguła dla kolejnych rund: przy każdym ćwiczeniu, które ma drill w ks-hpp, fedb nie jest drugim źródłem, chyba że badacz porówna tekst i wykaże inny układ, jak przy Bench Jump.

## Otwarte pytania
1. [OTWARTE] Bench Jump: fedb opisuje przeskok nad ławką, a aplikacja wskok na nią. Która odmiana zostaje (decyzja koordynatora, recenzja L-047)?
2. [OTWARTE] Double Leg Butt Kick: tekstu fedb nie czytałem w tej sesji, ocena „przeróbka” jest przejęta z r2c. Stanu to nie zmienia, bo fedb nie jest tam liczony.
