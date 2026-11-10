# Brief: autor rodziny figur v2 — partia 1 (linia 1.1, 09.11.2026)

Jesteś **autorem** (programista) jednej rodziny figur v2. Po polsku. Nie recenzujesz własnej pracy (L-047) — recenzję zleca programista partii audytorowi.

## Miejsce pracy
- Repo `/home/user/trening`, gałąź `figury/partia-1` (już wybrana — **nie zmieniaj gałęzi, nie wypychaj, nie scalaj**). Commituj na niej (stopka commitu: `Co-Authored-By` jak w ostatnich commitach).
- Testy: pojedyncze pliki `npx jest <plik> --runInBand` (nie `test:fast` całości, nie `verify` — robi je programista partii przed wypchnięciem).
- Arkusze PNG: poza repo, `/home/user/arkusze-partia-1/<rodzina>/` (nigdy w repo).
- Limit kontekstu: przy ok. 30% okna domknij krok, commit, zapisz stan w `docs/przekazanie/notatki/linia-1-1/STAN-PARTIA-1.md` (sekcja rodziny: zrobione z SHA, zostało, pułapki) i oddaj raport.

## Wzór
Rodzina `delt_raise` na gałęzi `origin/figury/delt_raise` (tylko do czytania: `git show origin/figury/delt_raise:<plik>`, `git log origin/integracja-1-1..origin/figury/delt_raise`):
podłączenie 1cd586a5 (families.ts `ready` + `LOAD` w poseData.ts), nakładka `lib/figures/v2/overlay/delt_raise.ts` + rejestr w `overlay.ts`, poprawki testów e297b41b, 1b50362b.
Plan i lista kontrolna K0–K15: `docs/przekazanie/notatki/linia-1-1/plan-recenzji-rodzin-v2.md` (pkt 3) — przeczytaj K1–K15 i stosuj.

## Kroki autora
1. **Stan danych:** `node scripts/pokrycie-symulacja.mjs` (zysk rodziny); ćwiczenia rodziny = `assignAll()` z `lib/figures/v2/families.ts`; pozy `lib/figures/v2/poses/<rodzina>.json`,
   generator `scripts/figures/agent-pozy/<rodzina>.mjs`. K2: każde ćwiczenie z tekstem ma pozę; wpisy `do_przegladu` w `data/zrodla/figury-ograniczenia-silnika.json` dla rodziny — rozstrzygnij albo zgłoś.
   K3: ćwiczenie, którego rysunek nie pokaże poprawnie — **zgłoś w raporcie** (wyjątek usuwający rysunek wymaga decyzji właściciela; nie dopisuj sam).
2. **Podłączenie:** `families.ts` status `ready`; `poseData.ts` — wpis `LOAD` (dopisz na końcu listy) i `DATA_UI`, jeśli brak; potem `node scripts/zrodla-runtime.mjs --write` i inne generatory, które wskaże `--check`.
3. **Nakładka techniki:** `lib/figures/v2/overlay/<rodzina>.ts` (eksport `<RODZINA>_TECHNIQUE`) i rejestr w `lib/figures/v2/overlay.ts` — **dopisz** import i klucz na końcu mapy `TECHNIQUE`, nie przestawiaj (inne partie robią to samo równolegle).
   Tylko reguły z pewnością „ustalone” z `data/zrodla/figury-sens.json` (rodzina) i rodzaje obsługiwane przez silnik (`limb`, `abduction`, `ref`); id w `cue` = wskazówki z karty powiązane z regułą.
   W komentarzu nagłówka: co rysujesz i czego nie (z powodem), jak w delt_raise.ts. Bez nowych liczb na rysunku. Gdy żadna reguła się nie nadaje — pusta tablica z uzasadnieniem w komentarzu.
4. **Zestawy ogólne** (`lib/figures/v2/cue-sets.json`, `b: "general"`) przy ćwiczeniach rodziny: sprawdź, czy zdania pasują do ruchu na rysunku; id przeczące ruchowi → `CUE_REQUIRES`/`CUE_NOT_IN_FAMILY` (`lib/figures/v2/cueSets.ts`). Lista do recenzji „zestawy” w raporcie.
5. **Karty v1** (K10/K11): ćwiczenia rodziny z wpisem `v1` w `docs/research/figury-recenzja.json` — po podłączeniu rysuje v2 → do zmiany na `zastapiona` (zmiany robi programista partii po recenzji); karty własne bez wpisu `karty` — lista do recenzji. **Nie edytuj wpisów recenzji** (to zapis recenzenta).
6. **Arkusze i samokontrola ruchu (K4–K8):** dla każdego ćwiczenia w każdym widoku: `node scripts/figures/arkusz-slad.mjs --out /home/user/arkusze-partia-1/<rodzina>/slad --key "<ćw>" ...` oraz
   `node scripts/figures/arkusz-nakladka.mjs --out /home/user/arkusze-partia-1/<rodzina>/nakladka --family <rodzina>`. Obejrzyj PNG w pełnej rozdzielczości (narzędzie Read na PNG; kadrowanie np. przez `sharp`/playwright), oba motywy przynajmniej dla kilku.
   Szukaj: ślad nie w chwycie, skoki, przenikanie przez ławkę/podłogę (>1 cm), zakres stawu niezgodny z tekstem karty (liczby z `frameAt`), orientacja sprzętu (oś hantla, kettlebell, talerze), poza „dziwna dla trenera”.
   Wady popraw w generatorze `scripts/figures/agent-pozy/<rodzina>.mjs` (pliki póz generowane — zobacz nagłówek generatora i jak delt_raise przeliczał), nie ręcznie w JSON. **Nie zmieniaj plików wspólnych silnika** (`contract.ts`, `scene.ts`, `draw.ts`, `anim.ts`, `figure.ts` …) — wadę wymagającą zmiany silnika zgłoś.
7. **Testy:** uruchom testy figur (`npx jest tests/figures-v2 tests/figury --runInBand` w paczkach) i popraw te, które zmieniły się przez podłączenie, **bez osłabiania** (K14: każda zmiana oczekiwania ma powód w komentarzu/commicie; listy dopisujesz, nie zawężasz pętli).
   Czerwone dozwolone do czasu wpisów recenzji: `figury-recenzja`, `karty-recenzja`, `recenzja-wyjatki-1-1`, `zrodla-runtime` (skróty), `l047`.
   Dodaj test rodziny `tests/figures-v2-<rodzina>-p1.test.ts(x)` z datą 09.11.2026: tor (ślad ≤ 3 cm od chwytu, wzór `tests/figures-v2-tor.test.ts`), zakres stawu z tekstu karty, rejestr nakładki — progi z karty i geometrii, z przypadkiem negatywnym (K5).
   Macierz: `node scripts/test-matrix.mjs --write`, pokrycie: `node scripts/pokrycie-katalogu.mjs --write`, README: `node scripts/readme.mjs --write` (jeśli istnieje i zmienia się).
8. **Nowe teksty UI** (np. nazwy faz `DATA_UI`, podpisy statyczne): przez `t()` + `lib/i18n.en.ts`, rejestr twierdzeń `node scripts/claims.mjs --stub` dla tekstów dziedzinowych. **Przekładu API nie uruchamiaj.**
9. **Commit** (może być kilka). Raport (krótko): SHA, lista ćwiczeń (z rysunkiem / bez i dlaczego), arkusze (ścieżki), co poprawiłeś w ruchu, nakładka (elementy + czego nie i dlaczego),
   zestawy ogólne do recenzji (ćwiczenie → wzorzec), karty v1 do `zastapiona`, karty własne bez wpisu `karty`, nowe klucze UI, testy czerwone (tylko dozwolone), otwarte pytania, czas pracy.

## Zakazy
Bez pushu, scalania, `--no-verify`, przekładu API, zmian workflowów, edycji wpisów recenzji, zmian silnika wspólnego, danych osobowych w repo.
