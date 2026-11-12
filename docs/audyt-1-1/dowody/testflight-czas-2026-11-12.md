# Dowody: diagnoza testflight.yml 43267558799 (sesja AA, 12.11.2026)

Ścieżki scratchpada zastąpione przez `<S>`. Logi zadań pobrane przez `gh api repos/<repo>/actions/jobs/<id>/logs` (build: 124498824304, 128209124193, 131355231235; tests.yml 43205473216: 6 zadań).

## a-sonda-symlink

```
$ node <link-tmp>/sonda/x.mjs
NIE-MAIN file://<S>/real-tmp/sonda/x.mjs <S>/link-tmp/sonda/x.mjs
exit 0
$ node <real-tmp>/sonda/x.mjs
MAIN
exit 0
```

## a-odtworzenie-symlink

```
$ TMPDIR=<link-tmp> npx jest tests/strona-eksport-recenzja.test.ts --runInBand --ci -t "pilotaż"
FAIL iOS tests/strona-eksport-recenzja.test.ts (82.82 s)
    ENOENT: no such file or directory, open '<S>/link-tmp/atlas-rec-Hii4Em/pilotaz/figury.json'
      at Object.readFileSync (tests/strona-eksport-recenzja.test.ts:55:47)
Tests:       1 failed, 10 skipped, 1 passed, 12 total
exit 1 czas 85 s
```

## a-kontrola-bez-symlink

```
$ TMPDIR=<real-tmp> npx jest tests/strona-eksport-recenzja.test.ts --runInBand --ci -t "pilotaż"
Tests:       10 skipped, 2 passed, 12 total
exit 0 czas 104 s
```

## a-mechanizm-grep

```
$ grep -rn "import.meta.url ===" scripts --include=*.mjs
scripts/ci/sim-wybor.mjs:28:if (import.meta.url === `file://${process.argv[1]}`) {
scripts/ci/store-powtorz.mjs:22:if (process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`) {
scripts/figures/v2-validate.mjs:180:if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2)).then((c) => proc
scripts/figures/sens-gotowe.mjs:24:if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
scripts/figures/pokrycie-sensu.mjs:33:if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
scripts/figures/gemini-polecenia.mjs:493:if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2)).then((c) =>
scripts/figures/gemini-pozy.mjs:615:if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
scripts/sprawdz-dysk.mjs:31:if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
scripts/scal-galaz.mjs:167:if (import.meta.url === `file://${process.argv[1]}`) {
scripts/store-whatsnew.mjs:44:if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
scripts/pokrycie-katalogu.mjs:238:if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
scripts/strona/eksport.mjs:188:if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
scripts/strona/silnik-build.mjs:41:if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
scripts/pokrycie-symulacja.mjs:109:if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
scripts/equipment/gen-nazwy-en.mjs:51:if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
scripts/przeniesienie-1.0.mjs:325:if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
scripts/i18n/przeglad-api.mjs:352:if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
scripts/i18n/przeklad-api.mjs:280:if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
trafien: 18
$ grep realpath w tych plikach
scripts/scal-galaz.mjs
```

## b-kroki-build

```
== 124498824304
1	Set up job                                                  	success	0.0 min
2	Run actions/checkout@v5                                     	success	0.1 min
3	Select Xcode 26.x                                           	success	0.0 min
4	Run actions/setup-node@v5                                   	success	0.1 min
5	Sekrety obecne (bez wypisywania wartości)                  	success	0.0 min
6	Run npm ci                                                  	success	0.4 min
7	Testy (jak przed każdym buildem — pełne npm run verify) 	success	38.2 min
8	Logika zegarka — testy jednostkowe Swift (targets/watch-test	success	0.5 min
9	Straż 0.17.0 — build dla telefonu ma prawdziwy sklep i prawd	success	0.0 min
10	Generate native iOS project (expo prebuild)                 	success	0.0 min
11	Numer buildu (aplikacja, widżet i zegarek ten sam CFBundleVe	success	0.0 min
12	Install pods                                                	success	1.3 min
13	Manifest prywatności (deklaracja w app.json ios.privacyManif	success	0.0 min
14	Platforma iOS zgodna z SDK wybranego Xcode (pobranie tylko, 	success	0.1 min
15	Archiwum (bez podpisu — podpis dystrybucyjny dopiero przy ek	success	11.2 min
16	Mapa źródeł JS (audyt M1-023 — bez niej stos błędu z telefon	success	0.0 min
17	Run actions/upload-artifact@v4                              	success	0.1 min
18	Zegarek w archiwum (osadzony, ta sama wersja i numer buildu,	success	0.0 min
19	Uprawnienia w archiwum (podpis ad hoc z plikami uprawnień — 	success	0.0 min
20	Klucz API na dysk (dopiero po archiwum i podpisie ad hoc, tu	success	0.0 min
21	Eksport do pliku .ipa (jeszcze bez wysyłki)                	success	0.4 min
22	Strażnik uprawnień w .ipa (aplikacja i zegarek) — brak upraw	success	0.0 min
23	Walidacja Apple na gotowym .ipa (tylko przy bez_wysylki — pr	skipped	0.0 min
24	Wysyłka do App Store Connect                               	success	1.9 min
25	Usunięcie klucza z maszyny                                 	success	0.0 min
26	Identyfikatory klucza wycięte z logów przed artefaktem (xcod	skipped	0.0 min
27	Run actions/upload-artifact@v4                              	skipped	0.0 min
53	Post Run actions/setup-node@v5                              	success	0.0 min
54	Post Run actions/checkout@v5                                	success	0.0 min
55	Complete job                                                	success	0.1 min
== 128209124193
1	Set up job                                                  	success	0.0 min
2	Run actions/checkout@v5                                     	success	0.2 min
3	Select Xcode 26.x                                           	success	0.0 min
4	Run actions/setup-node@v5                                   	success	0.1 min
5	Sekrety obecne (bez wypisywania wartości)                  	success	0.0 min
6	Run npm ci                                                  	success	0.4 min
7	Testy (jak przed każdym buildem — pełne npm run verify) 	success	56.9 min
8	Logika zegarka — testy jednostkowe Swift (targets/watch-test	success	1.2 min
9	Straż 0.17.0 — build dla telefonu ma prawdziwy sklep i prawd	success	0.0 min
10	Generate native iOS project (expo prebuild)                 	success	0.1 min
11	Numer buildu (aplikacja, widżet i zegarek ten sam CFBundleVe	success	0.0 min
12	Install pods                                                	success	2.9 min
13	Manifest prywatności (deklaracja w app.json ios.privacyManif	success	0.0 min
14	Platforma iOS zgodna z SDK wybranego Xcode (pobranie tylko, 	success	0.2 min
15	Archiwum (bez podpisu — podpis dystrybucyjny dopiero przy ek	success	14.8 min
16	Mapa źródeł JS (audyt M1-023 — bez niej stos błędu z telefon	success	0.0 min
17	Run actions/upload-artifact@v4                              	success	0.0 min
18	Zegarek w archiwum (osadzony, ta sama wersja i numer buildu,	success	0.0 min
19	Uprawnienia w archiwum (podpis ad hoc z plikami uprawnień — 	success	0.0 min
20	Klucz API na dysk (dopiero po archiwum i podpisie ad hoc, tu	success	0.0 min
21	Eksport do pliku .ipa (jeszcze bez wysyłki)                	success	0.6 min
22	Strażnik uprawnień w .ipa (aplikacja i zegarek) — brak upraw	success	0.0 min
23	Walidacja Apple na gotowym .ipa (tylko przy bez_wysylki — pr	skipped	0.0 min
24	Wysyłka do App Store Connect                               	success	2.4 min
25	Usunięcie klucza z maszyny                                 	success	0.0 min
26	Identyfikatory klucza wycięte z logów przed artefaktem (xcod	skipped	0.0 min
27	Run actions/upload-artifact@v4                              	skipped	0.0 min
53	Post Run actions/setup-node@v5                              	success	0.0 min
54	Post Run actions/checkout@v5                                	success	0.0 min
55	Complete job                                                	success	0.1 min
== 131355231235
1	Set up job                                                  	success	0.0 min
2	Run actions/checkout@v5                                     	success	0.3 min
3	Select Xcode 26.x                                           	success	0.0 min
4	Run actions/setup-node@v5                                   	success	0.1 min
5	Sekrety obecne (bez wypisywania wartości)                  	success	0.0 min
6	Run npm ci                                                  	success	0.6 min
7	Testy (jak przed każdym buildem — pełne npm run verify) 	cancelled	89.2 min
8	Logika zegarka — testy jednostkowe Swift (targets/watch-test	skipped	0.0 min
9	Straż 0.17.0 — build dla telefonu ma prawdziwy sklep i prawd	skipped	0.0 min
10	Generate native iOS project (expo prebuild)                 	skipped	0.0 min
11	Numer buildu (aplikacja, widżet i zegarek ten sam CFBundleVe	skipped	0.0 min
12	Install pods                                                	skipped	0.0 min
13	Manifest prywatności (deklaracja w app.json ios.privacyManif	skipped	0.0 min
14	Platforma iOS zgodna z SDK wybranego Xcode (pobranie tylko, 	skipped	0.0 min
15	Archiwum (bez podpisu — podpis dystrybucyjny dopiero przy ek	skipped	0.0 min
16	Mapa źródeł JS (audyt M1-023 — bez niej stos błędu z telefon	skipped	0.0 min
17	Run actions/upload-artifact@v4                              	skipped	0.0 min
18	Zegarek w archiwum (osadzony, ta sama wersja i numer buildu,	skipped	0.0 min
19	Uprawnienia w archiwum (podpis ad hoc z plikami uprawnień — 	skipped	0.0 min
20	Klucz API na dysk (dopiero po archiwum i podpisie ad hoc, tu	skipped	0.0 min
21	Eksport do pliku .ipa (jeszcze bez wysyłki)                	skipped	0.0 min
22	Strażnik uprawnień w .ipa (aplikacja i zegarek) — brak upraw	skipped	0.0 min
23	Walidacja Apple na gotowym .ipa (tylko przy bez_wysylki — pr	skipped	0.0 min
24	Wysyłka do App Store Connect                               	skipped	0.0 min
25	Usunięcie klucza z maszyny                                 	success	0.0 min
26	Identyfikatory klucza wycięte z logów przed artefaktem (xcod	skipped	0.0 min
27	Run actions/upload-artifact@v4                              	skipped	0.0 min
53	Post Run actions/setup-node@v5                              	skipped	0.0 min
54	Post Run actions/checkout@v5                                	success	0.1 min
55	Complete job                                                	success	0.2 min
```

## b-top15

```
| # | Plik | 31.10 (41183061869) s | 06.11 (42298549942) s | 12.11 (43267558799) s |
|---|---|---|---|---|
| 1 | tests/strona-eksport-recenzja.test.ts | brak pliku | 86 | 624 |
| 2 | tests/audit-k1-bl-mer-podpisy1.test.tsx | brak pliku | 90 | 556 |
| 3 | tests/audit-k1-bl-mer-podpisy6.test.tsx | brak pliku | 88 | 541 |
| 4 | tests/matrix-dim-langs3.test.tsx | 67 | 181 | 404 |
| 5 | tests/matrix-dim-langs4.test.tsx | 84 | 171 | 375 |
| 6 | tests/gemini-polecenia.test.ts | brak pliku | 298 | 286 |
| 7 | tests/matrix-dim-langs1.test.tsx | 89 | 141 | 234 |
| 8 | tests/strona-eksport.test.ts | brak pliku | 42 | 205 |
| 9 | tests/invariants.test.ts | 205 | 171 | 199 |
| 10 | tests/skrot-v2-wynik.test.ts | brak pliku | brak pliku | 188 |
| 11 | tests/maestro-flows.test.tsx | 309 | 177 | 182 |
| 12 | tests/pokrycie-katalogu.test.ts | brak pliku | 11 | 179 |
| 13 | tests/figury-generator-odtwarza.test.ts | brak pliku | 89 | 172 |
| 14 | tests/matrix-dim-langs2.test.tsx | 64 | 125 | 155 |
| 15 | tests/matrix-invariants.test.ts | 132 | 148 | 146 |

| Grupa | 31.10 | 06.11 | 12.11 |
|---|---|---|---|
| pozostałe | 2693 | 2805 | 4184 |
| figury/figures* | 349 | 1042 | 1468 |
| matrix-dim* (inne) | 303 | 628 | 1177 |
| matrix-dim-langs-routes* | 370 | 579 | 465 |
| skrot-v2* | 0 | 60 | 328 |
| audit-k1-bl-mer-podpisy* | 0 | 718 | 1097 |
42298549942: pliki nowe od 31.10 z czasem >=5 s: 48, suma 1973 s
43267558799: pliki nowe od 31.10 z czasem >=5 s: 52, suma 3931 s
tests/audit-k1-bl-mer-podpisy2.test.tsx
tests/audit-k1-bl-mer-podpisy3.test.tsx
tests/audit-k1-bl-mer-podpisy4.test.tsx
tests/audit-k1-bl-mer-podpisy5.test.tsx
tests/audit-k1-bl-mer-podpisy7.test.tsx
```

## b-eksport-czas

```
== 1f339f4c7
eksport --langs en: 3.916 s (kod 0)
recenzja-figur --skroty: 1.658 s (kod 0)
== 37bb8a071
eksport --langs en: 24.21 s (kod 0)
recenzja-figur --skroty: 21.30 s (kod 0)
```

## b-jest-czas (wiersze `Time:` i pierwszy/ostatni wynik pliku z logów)

```
41183061869: Test Suites: 591 passed, 591 total Time:        2202.741 s 
  pierwszy: 2026-10-31T09:33:05.8887290Z PASS iOS tests/scenario-full.test.tsx (95.059 s)
  ostatni:  2026-10-31T10:08:11.4137390Z PASS iOS tests/matrix-dim-langs-routes6.test.tsx (52.82 s)
42298549942:             actualStartTime: 1794001946390, Test Suites: 717 passed, 717 total Time:        3310.56 s 
  pierwszy: 2026-11-06T21:52:08.2829640Z PASS iOS tests/scenario-full.test.tsx (85.76 s)
  ostatni:  2026-11-06T22:45:52.4308570Z PASS iOS tests/audit-k1-bl-mer-podpisy4.test.tsx (92.829 s)
43267558799:             actualStartTime: 1794506984292, 
  pierwszy: 2026-11-12T18:09:23.0992380Z PASS iOS tests/scenario-full.test.tsx (90.302 s)
  ostatni:  2026-11-12T19:27:22.4933310Z PASS iOS tests/audit-k1-bl-mer-podpisy1.test.tsx (555.983 s)
43267558799 koniec: 2026-11-12T19:35:00.3232450Z ##[error]The operation was canceled.
tests.yml 43205473216 (Ubuntu, 5 części):
PASS iOS tests/strona-eksport-recenzja.test.ts (712.664 s)
PASS iOS tests/audit-k1-bl-mer-podpisy1.test.tsx (272.468 s)
PASS iOS tests/audit-k1-bl-mer-podpisy6.test.tsx (267.136 s)
PASS iOS tests/matrix-dim-langs3.test.tsx (117.258 s)
PASS iOS tests/gemini-polecenia.test.ts (448.117 s)
rodziny ready: 1f339f4c=7 37bb8a07=40  (grep -c "status: 'ready'" lib/figures/v2/families.ts)
```
