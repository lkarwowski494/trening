# Reaudyt: Wzrost (rynek i retencja) — Trening — 2026-10-28
Commit: 2385e75aeb3880c0c90ba5edd69145a1c6d80b01 (main po naprawach M2, HEAD odłączony, sprawdzony na starcie: `dowody/srodowisko-start.txt`) · Baza: 025a50b96f504ea9d16d573720d1e92dc951a103 · Tryb: reaudit, pętla 1 · Środowisko: Linux 6.18, Node v22.22.0, git; testy Jest pojedynczo (`--maxWorkers=1`) w worktree w scratchpadzie z dowiązanymi `node_modules`; bez macOS, symulatora i telefonu (okno systemowe oceny i arkusz „Uczciwe zasady” na urządzeniu nie sprawdzone); typecheck i lint ze wspólnych wyników (kod 0). Workflowów nie uruchamiano.

Ostatni nagłówek promptu: „## Kontrola dowodów i sekretów przed oddaniem raportu”.

## Podsumowanie

Naprawa M1-018 działa: bramka prośby o ocenę liczy tylko treningi na żywo, a okno „Uczciwe zasady” wyklucza na tym samym podsumowaniu link „Poproś o funkcję” i prośbę o ocenę; test M2 zielony, a sonda na trzech kolejnych treningach importera pokazuje kolejno okno, link, prośbę (po jednym na podsumowanie). Pozycje 11-wzrost-002 i -004 trafiły do backlogu 1.0.x w docs/21 z wersją i warunkiem, pilnowane testem. 11-wzrost-003 tylko wypisane: odłożone decyzją 4a. W różnicy 025a50b..2385e75 w obszarze wzrostu nie ma regresji: brak nowych SDK, sieci, powiadomień i mechanik powrotu; strony wsparcia i prywatności zgadzają się z aplikacją. Jedno nowe znalezisko P2 (istniało wcześniej): okno „Pierwszy trening za Tobą!” pokazuje się też byłemu subskrybentowi po dziesiątkach treningów. Nic w tym obszarze nie blokuje wydania 1.0.

| ID | Wynik | Dowód |
|---|---|---|
| 11-wzrost-001 | zweryfikowane (M1-audytor-generalny-018, a2300a1) | `lib/review-run.ts:29`, `lib/review-run.ts:64`; `dowody/jest-018-jedno-okno.txt` (2/2, kod 0); `dowody/sonda-okna-2385e75.txt` (sonda C) |
| 11-wzrost-002 | zweryfikowane jako przeniesione do backlogu 1.0.x (M1-audytor-generalny-037, 848f9b0, DEC-07 b); działanie właściciela nadal przed nim | `docs/21-roadmapa-offline.md:166`; `dowody/jest-audit-m1-2026-10-27-037-dokumenty-wydania.txt` (12/12, kod 0) |
| 11-wzrost-004 | zweryfikowane jako przeniesione do backlogu 1.0.x (M1-audytor-generalny-037, 848f9b0) | `docs/21-roadmapa-offline.md:167`; ten sam test |
| 11-wzrost-003 | tylko wypisane — odłożone decyzją 4a (8 tygodni po premierze); część dokumentu poprawiona (4c11a45) | `docs/18-przekazanie.md:613`, `docs/wzrost.md:60`; `dowody/jest-audit-m1-2026-10-27-033-hipoteza-android.txt` (2/2, kod 0) |
| 11-wzrost-601 | nowe, istniało wcześniej, P2 | `lib/fairrules.ts:19`; `dowody/sonda-okna-2385e75.txt` (sonda A) |

Liczby nowych znalezisk: P0 = 0, P1 = 0, P2 = 1 (11-wzrost-601, istniało wcześniej).

## Wyniki według ID (szczegóły)

**11-wzrost-001 → zweryfikowane.**
- Bramka: `lib/review-run.ts:29` „finishedWorkouts().filter(x => x.live === true).length”.
- Jedno okno: `lib/review-run.ts:64` „if (onFairRules && fairRulesDue(w)) { onFairRules(); return; }”.
- Test M2: `npx jest tests/audit-m1-2026-10-27-018-jedno-okno.test.tsx --maxWorkers=1` → 2 z 2, kod 0 (`dowody/jest-018-jedno-okno.txt`).
- Sonda własna (`dowody/sonda-okna.test.tsx.txt`, wynik `dowody/sonda-okna-2385e75.txt`, kod 0). Zamknięcie okna w sondzie ustawia flagę tak samo jak arkusz. Użytkownik free, 10 treningów z importu, potem 3 treningi na żywo z rekordem. Kolejne podsumowania: {okno 1, link 0, ocena 0}, {0, 1, 0}, {0, 0, 1}. Najwyżej jedno na podsumowanie, prośba dopiero po trzecim treningu w aplikacji, zgodnie z rekomendacją (a).
- Wektory bramki (`lib/review.ts`) bez zmian od bazy (`dowody/probka-regresji.txt`: pusty diff dla `lib/review.ts`).

**11-wzrost-002, 11-wzrost-004 → zweryfikowane (przeniesienie do backlogu z wersją).** Wpis `docs/21-roadmapa-offline.md:166` „agent marketingu szkicuje prośbę o pisemną zgodę administracji forum” i `docs/21-roadmapa-offline.md:167` „po pojawieniu się zakładki kampanii w App Analytics właściciel kopiuje `pt`”. Oba z wersją 1.0.x, poza „Backlogiem bez priorytetu”. Test `tests/audit-m1-2026-10-27-037-dokumenty-wydania.test.ts` (12 z 12, kod 0) pilnuje wiersza z wersją i warunkiem. Samo działanie (prośba do forum, linki `ct`) czeka na właściciela po premierze. To nie znalezisko.

**11-wzrost-003 → tylko wypisane (odłożone, 4a).** Decyzja `docs/18-przekazanie.md:613` „hipoteza Androida oceniana 8 tygodni po premierze, próg liczbowy ustalany przy tej ocenie”. Część dokumentu jest poprawiona: `docs/wzrost.md:60` „Odsetek płacących wśród pobierających” (bez okresu próbnego). Próg zostaje otwarty (tabela w sekcji 5 `docs/wzrost.md`). Uwaga redakcyjna, nie znalezisko: zdanie `docs/wzrost.md:63` „próg, minimalna próba i data premiery pozostają otwarte” nie odsyła do decyzji 4a. Kolejny agent może wtedy znów pytać właściciela o próg przed premierą. Propozycja: dopisek „4a, 28.10.2026: próg przy ocenie”.

## Przegląd różnicy 025a50b..2385e75 w obszarze wzrostu

| Plik / zmiana | Wynik |
|---|---|
| `lib/review-run.ts` (a2300a1) | ok, patrz 001 |
| `docs/wzrost.md` (4c11a45) | ok, patrz 003 |
| `docs/21-roadmapa-offline.md` (+23 linie: backlog 1.0.1/1.1 i DEC-07 b) | ok; pozycje wzrostu z wersją; backlogu bez priorytetu nie wymieniam (CLAUDE.md) |
| `docs/research/espresso-mimit-2026-10.md` | ok; Z-10b jako [OTWARTE], czeka na eksport właściciela; strona espresso bez kwot planów (link w oknie „Uczciwe zasady”) |
| `.maestro/56-uczciwe-zasady.yaml` | ok; tylko selektor wiersza „Your plan: .*” (decyzja 1A × DEC-09 a); przebieg zmienionych scenariuszy zielony według raportu M2 (40646282170), nie powtarzałem |
| `components/IdeaLink.tsx` | ok; tylko skalowanie znaku ✕ |
| `app/history/[id].tsx` | ok; „PR:” zastąpione przez `t('Rekord: {list}')` |
| `lib/support.ts` (M1-032) | ok dla pętli opinii (WZR-08); linia techniczna pod stopką widoczna przed wysłaniem, bez danych treningowych |
| `site/support.html`, `site/privacy.html` (WZR-01) | ok; `site/support.html:45` „po zakupie „Masz plan: …”” zgodne z `components/SubscriptionCard.tsx:12`; dalej bez narzędzi sztucznej inteligencji i bez okresu próbnego; polityka wymienia tylko Google Workspace zgodnie z decyzją 21.10.2026 (`docs/18-przekazanie.md:398`) |
| `app/_layout.tsx` — nowe okno błędu zapisu (M1-015) | nowa droga drugiego okna na podsumowaniu, tylko przy błędzie zapisu; w sekcji „Do sprawdzenia” |
| `package.json` | tylko skrypty (`check:decyzje`, `check:pochodne`); bez nowych zależności |

Podwójne okna po pierwszym treningu nie wróciły w kodzie napraw: `onSummaryShown` jest jedynym wejściem z podsumowania (`app/history/[id].tsx:35`). Okno przypomnienia o planie (`lib/planReminder.ts:71`) i karta zgody na koniec przerwy nie zmieniły się od bazy i nie są wołane z podsumowania.

## Próbka regresji (3 pozycje spoza zmienionych plików)

Plik: `dowody/probka-regresji.txt`.
- **WZR-10, pomiar prywatny:** w `package.json` i lockfile nie ma SDK analityki ani atrybucji (grep, 0 trafień); w `lib/`, `components/` i `app/` nie ma `fetch` ani XHR (0 trafień). `app.json:67` ma „"NSPrivacyTracking": false”. Wynik: ok.
- **WZR-05, powiadomienia:** `lib/timer.ts` i `lib/planReminder.ts` bez zmian od bazy. Te same 4 harmonogramy, Time Sensitive tylko w `lib/timer.ts:33`. Macierz z raportu M1 aktualna. Wynik: ok.
- **WZR-06, mechaniki powrotu:** `lib/home.ts` i `lib/deload.ts` bez zmian. „Odznaki” w kodzie to tylko znaczniki rekordu przy serii, bez serii dni i bez „wróć” poza treningiem w toku. Wynik: ok.

## Hipotezy

Aplikacja jest niewydana (TestFlight), więc ocena hipotez nie dotyczy (przed premierą). `hipotezy.mjs` nie uruchomiony: brak danych App Analytics, a H2 nie ma progu (4a). Daty oceny to premiera + 8 tygodni. Statusy bez zmian: H1 przed premierą, H2 odłożona do oceny (4a). Proponowanych zmian statusów H i ZAL brak (`docs/zalozenia.md` nie istnieje).

## Znaleziska (szczegóły)

### 11-wzrost-601 · Były subskrybent po dziesiątkach treningów dostaje okno „Pierwszy trening za Tobą!” z ofertą Pro
- Pozycja listy kontrolnej: WZR-06
- Poziom: P2
- Realność: brzegowy (trzeba mieć pełny dostęp przy pierwszym zakończonym treningu na żywo, a potem go stracić: zakup Pro z Ustawień przed pierwszym treningem, członek Chmury rodzinnej, kod promocyjny; potem rezygnacja albo koniec udostępniania) · Pewność: wysoka
- Rodzaj: D
- Dowód:
  - warunek nie ma górnej granicy liczby treningów: `lib/fairrules.ts:19` „if (!st.workouts.some(x => x.live === true && x.finishedAt != null)) return false;”;
  - tytuł okna: `components/FairRulesSheet.tsx:31` „Pierwszy trening za Tobą!”;
  - decyzja mówi o pierwszym treningu: `docs/18-przekazanie.md:513` „po pierwszym ukończonym treningu na żywo”;
  - sonda A (`dowody/sonda-okna-2385e75.txt`, kod 0): miesięczna subskrypcja, 20 treningów na żywo, potem dostęp wygasa, 21. trening daje „liveFinished”:21, „fair”:1;
  - stan w bazie: `git show 025a50b:lib/fairrules.ts` ma ten sam warunek, więc istniało wcześniej (commit d492910), poza naprawami M2.
- Mechanizm: flaga `seenFairRulesManifest` ustawia się tylko po pokazaniu okna. Kto miał pełny dostęp przy pierwszym treningu, nigdy jej nie dostaje, a warunek „co najmniej 1 trening na żywo” spełnia każdy późniejszy trening. `grep -rn "seenFairRulesManifest" lib components app` → 4 trafienia (`lib/fairrules.ts:18`, `lib/fairrules.ts:25`, `lib/fairrules.ts:26`, `lib/state/migrate.ts:284`), żadne nie ustawia flagi przy zakupie.
- Powraca: nie
- Wzorzec lub źródło: tabela etyki modułu `retencja-i-etyka` (tekst zgodny ze stanem faktycznym, bez nacisku); zasada roli 5 (twierdzenie z dowodem).
- Kroki w aplikacji: nowa instalacja → Więcej → Ustawienia → „Zobacz plany Pro” → zakup miesięczny → kilkanaście treningów → rezygnacja w ustawieniach Apple, koniec okresu → kolejny trening → „Zakończ” → okno „Pierwszy trening za Tobą!” z „Zobacz plany Pro ›”.
- Opcje: (a) okno tylko wtedy, gdy zakończony trening jest pierwszym treningiem na żywo (dokładnie 1). Kompromis: kto zaczął od Pro, nigdy nie zobaczy okna; zasady zna z ekranu zakupu. Jedna linia i test. (b) przy przejściu z pełnego dostępu na `free` (pole `endedAt`, M1-002) ustawić flagę albo pokazać inny tekst. Kompromis: nowy tekst do 35 języków i recenzji lokalizacji. (c) bez zmian: rzadki przypadek, tekst nieprawdziwy, ale bez szkody dla danych. Rekomendacja: (a), w 1.0.1 (P2 nie blokuje wydania; zamrożenie zakresu).
- Test akceptacyjny: sonda A jako test: 20 treningów na żywo z pełnym dostępem, wygaśnięcie, 21. trening, wynik `fairRulesDue` = false. Test M1-018 i scenariusz Maestro 56 dalej zielone.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)
- **Okno błędu zapisu i okno „Uczciwe zasady” naraz** (nowe od M1-015): `app/_layout.tsx:100` „Alert.alert(t('Nie udało się zapisać danych')”. Okno pokazuje się na każdym ekranie, a `fairRulesDue` nie sprawdza błędu zapisu (prośba o ocenę sprawdza: `lastFailed`). Przy błędzie zapisu w chwili zakończenia pierwszego treningu na żywo użytkownik free zobaczy alert nad arkuszem. Przypadek rzadki (pełny dysk). Kolejności na urządzeniu nie sprawdzono. Proponuję, żeby rola 12 albo 04 oceniła, czy `fairRulesDue` ma odmawiać przy `getPersistError()`.
- **Link „Poproś o funkcję” liczy też treningi z importu** (istniało wcześniej, nie znalezisko): `lib/review-run.ts:52` „const finished = finishedWorkouts().length;”. Sonda B: użytkownik Pro po imporcie 10 treningów widzi link na pierwszym treningu w aplikacji. To link w treści, nie okno. Po naprawie 018 ocena liczy tylko treningi na żywo, a link wszystkie. Ujednolicenie to decyzja produktowa (docs/34), bez wpływu na wydanie.
- **Stały tekst wewnętrzny** `docs/34-wsparcie-i-opinie.md:9` „adres przekierowany (Porkbun) do osobnej skrzynki Gmail” jest nieaktualny wobec decyzji 21.10.2026 i polityki prywatności. To dokument wewnętrzny, strona publiczna jest poprawna.
- **Okno systemowe oceny i arkusz na urządzeniu**: nie sprawdzono (TestFlight nie pokazuje okna oceny). Krok: pierwszy build ze sklepu.

## Co działa dobrze i należy zachować
- Reguła „najwyżej jedno okno na podsumowaniu” jest w jednym miejscu (`onSummaryShown`) i ma niezmiennik w teście (0–12 importowanych treningów).
- Backlog wzrostu ma wersję, warunek i test, więc pozycje nie giną w „bez priorytetu”.
- Strony publiczne aktualizowane razem ze zmianą UI (wiersz „Masz plan: …”), bez kwot planów i z prawdą o prywatności.

## Decyzje dla właściciela
1. **601:** (a) okno tylko po pierwszym treningu na żywo (rekomendacja, 1.0.1); (b) flaga przy wygaśnięciu albo osobny tekst; (c) bez zmian. Czas agenta: ok. 30 min z testem. Czeka się na verify (~12 min). Zmiana JS, bez builda natywnego.
2. **003 (redakcja):** dopisać w `docs/wzrost.md` odesłanie do 4a. Tylko dokument, `verify:docs`.

Otwarte poza main (tylko wypisuję): 9a eksport figur strony (gałąź naprawy/M2-po-decyzjach-eksport-figur), propozycje A/B w L-047 i L-048 (docs/40), backlog 1.0.1 w docs/21.

## Proponowane polecenie naprawy
`node tools/assemble.mjs 11-wzrost --tryb fix --zadania 11-wzrost-601` (po decyzji 1).

## Kontrola dowodów i sekretów
Wynik `node audit/M1-2026-10-27/reaudit-2026-10-28/sprawdz-raport.mjs … --rola 11-wzrost`: `dowody/sprawdz-raport.txt`. W raporcie i dowodach nie ma e-maili osób, UDID, sekretów ani nazw innych aplikacji. Sondy działały w worktree w scratchpadzie, który na końcu usunięto. `git status --porcelain` w repo był pusty na starcie (`dowody/srodowisko-start.txt`) i na końcu (`dowody/git-status-koniec.txt`).
