# Brief: programista rodziny — partia 2 (linia 1.1), 09.11.2026

Gałąź: `figury/partia-2` (od `origin/integracja-1-1` @ aeabf69a), katalog `/home/user/trening` (sesja chmurowa, własna maszyna — bez `verify.lock`).
Lead partii (nie koordynator linii) zleca Ci JEDNĄ rodzinę (nazwa w zleceniu). Kolejność rodzin partii: hip_bridge, cable_row, pushup_plank, mobility_floor, mobility_stand.

## Najpierw przeczytaj
- `CLAUDE.md` (bramka 4, L-047, L-050 — pole `slad`, testy przed kodem, macierz, rejestr twierdzeń, BRD, repo publiczne).
- `docs/przekazanie/notatki/linia-1-1/plan-recenzji-rodzin-v2.md` pkt 3 — lista kontrolna K1–K15 (obowiązuje).
- `docs/32-wzorce-interakcji.md` tylko jeśli dodajesz element UI (zwykle nie).
- Wzór kompletnego włączenia (tylko do czytania): gałąź `origin/figury/delt_raise`, commity `1cd586a5` (włączenie: families.ts ready, poseData.ts LOAD, test mapping), `1e8f9f8d`+`64ebbbd4` (nakładka techniki + wyjątki testów danych póz), `e297b41b` (poprawki testów, v1 → zastapiona), `d18d02fc` (wpisy „zestawy”), `9034f7ad` (wpisy „karty”). `git show <sha>`.

## Zakres Twojego zlecenia (faza AUTOR — bez wpisów recenzji)
1. `node scripts/pokrycie-symulacja.mjs` — zapisz zysk rodziny (przed).
2. Włączenie (K1): `families.ts` status `ready`; `poseData.ts` — `LOAD` (dopisz na końcu mapy, nie przestawiaj) i wpis `DATA_UI` (nazwy faz: tylko istniejące `PhaseName` z `t()`/`lib/i18n.en.ts`; nowa nazwa = nowy tekst UI PL/EN + kontekst tłumaczenia + zestaw przekładu, przekładu API NIE uruchamiasz). Mobilność: statyczne → `ISOMETRIC` już jest dla części; bez ról mięśni (decyzja właściciela 04.11.2026 (4) B, docs/18:237).
3. Nakładka techniki (decyzja właściciela 09.11.2026 „żadna rodzina nie wychodzi bez nakładki”, docs/18): `lib/figures/v2/overlay/<rodzina>.ts` + rejestr w `overlay.ts` (DOPISZ import i wpis na końcu — inne partie dopisują równolegle). Tylko reguły „ustalone” z `data/zrodla/figury-sens.json` (sekcja rodziny) i wskazówki obecne na karcie (id `cue` = klucze `wskazowki_na_reguly`); bez nowych liczb; komentarz w nagłówku jak `overlay/delt_raise.ts` (co jest, czego nie ma i dlaczego). Cue inline (strażnik S20). Jeśli żadna reguła się nie kwalifikuje — zapisz powód (pytanie do leada), nie wymyślaj.
4. Zestawy ogólne (`lib/figures/v2/cue-sets.json`) i karty własne ćwiczeń rodziny: wypisz, które ćwiczenia mają `own` / `general` / `open`; wpisy v1 (`figury-recenzja.json` → `v1`) ćwiczeń, które teraz rysują v2 → przygotuj listę do `zastapiona` (K10; zmiana statusu w tym samym commicie, gdy test tego wymaga — wzór e297b41b). Nie dopisuj wpisów „v2/karty/zestawy” — robi to przepisujący 1:1 z pliku recenzenta po recenzji.
5. Testy: włączenie zmienia testy (mapping, figures-v2-data, nakladka-fix4, recenzja, strona-eksport, gemini-polecenia …). Czerwone wolno tylko: `figury-recenzja`, `karty-recenzja`, `recenzja-wyjatki-1-1`, `zrodla-runtime` (brak wpisu recenzji). Każde inne dostosowanie testu uzasadnij w commicie (K14: recenzent czyta `git diff -- tests/`); nie poluzowuj progów pod dane (K5). Pojedyncze pliki: `npx jest <plik> --runInBand`.
6. Samokontrola ruchu (K4–K8): `node scripts/figures/arkusz-slad.mjs --out <scratchpad>/arkusze-<rodzina> --key "<ćw>" ...` dla KAŻDEGO ćwiczenia z rysunkiem w każdym widoku (PNG przez playwright — jest w środowisku). Obejrzyj w pełnej rozdzielczości (Read na PNG) przynajmniej po jednym arkuszu na wzorzec ruchu; liczby z `frameAt` (zakres stawów vs karta, styki ≤ 1 cm, orientacja sprzętu, ślad przy właściwym chwycie). Wady, które sam widzisz → popraw w generatorze `scripts/figures/agent-pozy/<rodzina>.mjs` / pozach z testem odtwarzającym (K5), zanim oddasz do recenzji. Ćwiczenia, których rysunek nie pokaże poprawnie → nie łataj na siłę: lista do leada (wyjątek K3 wymaga decyzji).
7. Pochodne: `node scripts/zrodla-runtime.mjs --write`, `node scripts/pokrycie-katalogu.mjs --write`, `node scripts/test-matrix.mjs --write`, README (`node scripts/readme.mjs --write` jeśli istnieje), BRD (`docs/brd/wymagania.md` — nakładka/rodzina jak w delt a421cb8a; `node scripts/kontrola-brd.mjs docs/brd`).
8. Commit(y) po polsku z prefiksem `<rodzina>:` i stopką sesji (Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com> / Claude-Session: https://claude.ai/code/session_01T66VBx1RfrSnnQXw6gc6zC). `git diff --cached` przed commitem. NIE pushuj (push robi lead po verify:szybkie). Nie uruchamiaj pełnego verify.

## Raport do leada (krótko, ≤ 40 linii)
SHA końcowe; zysk rodziny przed/po (`pokrycie-symulacja` / `pokrycie-katalogu`); lista ćwiczeń z rysunkiem (klucze) i widoki; ścieżka katalogu arkuszy (PNG); nakładka: elementy i reguły (oraz odrzucone z powodem); zestawy/karty: lista ćwiczeń `own`/`general`/`open` i wpisy v1 → zastapiona; testy zmienione (plik: dlaczego); wady znalezione i poprawione samodzielnie; czerwone testy pozostałe (tylko dozwolone); pytania (merytoryczne/produktowe — nie zgaduj); czas pracy.

## Limit kontekstu
Ok. 30–35% okna. Powyżej ~30%: domknij krok, commit, zapisz stan w `docs/przekazanie/notatki/linia-1-1/STAN-PARTIA-2.md` (sekcja rodziny: zrobione z SHA, zostało, następny krok, pułapki) i oddaj raport.
