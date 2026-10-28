# Reaudyt: Monetyzacja — Trening — 2026-10-28
Commit: 2385e75aeb3880c0c90ba5edd69145a1c6d80b01 (HEAD odłączony, sprawdzony na starcie) · Tryb: reaudit, pętla 1 · Baza: 025a50b96f504ea9d16d573720d1e92dc951a103 · Ostatni nagłówek promptu: „## Kontrola dowodów i sekretów przed oddaniem raportu”
Środowisko: Linux x86_64, Node v22.22.0, git; sondy w worktree w scratchpadzie (node_modules jako dowiązanie do drzewa głównego); testy pojedynczo `--maxWorkers=1`; typecheck i lint ze wspólnych wyników (kod 0). Bez macOS, symulatora i telefonu; workflowów nie uruchamiano (jeden przebieg odczytany przez MCP GitHub). Dysk Google: nie sprawdzono.

## Podsumowanie

Wszystkie naprawy w obszarze monetyzacji działają na 2385e75. Testy M2 przechodzą pojedynczo. Sonda renderująca ekran zakupu i wiersz Ustawień w 10 stanach dostępu potwierdza uzgodnienie 1A × DEC-09 a: nagłówek „Masz plan: miesięczny / roczny / dożywotni”, „Zmień plan” zwinięty, „Przejdź na ten plan” zamiast „Subskrybuj” przy posiadanej subskrypcji, uwaga przed dożywotnim przy subskrypcji własnej i z kodu, bez uwagi przy Chmurze rodzinnej. Regresji nie ma. Są dwa nowe znaleziska P2, oba z kodu, który istniał już w 025a50b. (601) Bez sieci płacący z zapamiętanym pełnym dostępem widzi na ekranie zakupu ofertę dla darmowych („Trenuj 5 dni… za darmo”, „Bez zakupu…”), a Ustawienia mówią mu „Masz pełną wersję”. (602) Po zakupie dożywotniego osoba z subskrypcją z Chmury rodzinnej czyta „anuluj ją, żeby nie płacić podwójnie”, choć przed zakupem ta sama sytuacja słusznie uwagi nie pokazuje. Żadne nie blokuje wydania. Nie ma P0 ani P1.

Pozycje źródłowe (ID audytu M1 w drugiej kolumnie):

| ID | M1 | Wynik | Dowód |
|---|---|---|---|
| 02-monetyzacja-503 | M1-001 | zweryfikowane | `app/paywall.tsx:110` uwaga przed "Kup na zawsze", warunek `app/paywall.tsx:59`; test 5/5 (pierwszy przebieg: przekroczenie 5 s przy zimnym starcie pod obciążeniem, dwie powtórki zielone) — `dowody/jest-id.txt`, `dowody/jest-001-powtorka.txt`; sonda: miesięczny, roczny i z kodu pokazują uwagę, rodzina nie — `dowody/sonda-stany-ekranu.txt` |
| 02-monetyzacja-501 | M1-002 | zweryfikowane | `lib/entitlement.ts:48` zapis `endedAt` przy przejściu full → free, `lib/access.ts:150` użycie w limicie; test 9/9 na kształcie adaptera natywnego (bez wygasłych wpisów) — `dowody/jest-id.txt`. Kompromis opcji (a): po ponownej instalacji w tym samym miesiącu pamięci nie ma (brzegowe, opisane w audycie) |
| 02-monetyzacja-502 | M1-007 | zweryfikowane (ryzyko otwarte decyzją) | R-WAL w rejestrze ryzyk z warunkiem zamknięcia (`docs/40-lekcje.md:35`), krok Z-36 (`docs/48-zgloszenie-1-0.md:119`), decyzja wariant A 27.10 (`docs/18-przekazanie.md:600`); test 2/2. Zamknięcie: telefon pierwszego dnia po wydaniu |
| 02-monetyzacja-003 | M1-009 | zweryfikowane | `npm run check:decyzje` kod 0 (341 wpisów) — `dowody/check-decyzje.txt`; tests/decyzje-straznik.test.ts 21/21 |
| 02-monetyzacja-507 | M1-009 | zweryfikowane | j.w.; część (c): `tests/limity-wydan.json` zawiera `MIN_LIVE_MINUTES_FOR_DAY` i `COUNT_FULL_STARTS_IN_EXPIRY_MONTH`; tests/m5s1-dni-zapis.test.ts 24/24 — `dowody/regresja-probka.txt` |
| 02-monetyzacja-001 | M1-010 | zweryfikowane | `app/paywall.tsx:86` nagłówek `ownedPlanTitle`, `app/paywall.tsx:78` brak wstępu przy aktywnym planie, `app/paywall.tsx:94` "Zmień plan"; test 10/10; sonda 10 stanów — `dowody/sonda-stany-ekranu.txt` |
| 02-monetyzacja-504 | M1-010 | zweryfikowane w zakresie DEC-09 a; reszta wyłączona decyzją | "Odnawia się {data}" i rodzina w podtytule Ustawień wyłączone wprost z wpisu DEC-09 a (`docs/18-przekazanie.md:603`, "Poza tym wpisem"); w docs/21 nie znalazłem dla nich pozycji z wersją (uwaga w "Do sprawdzenia" 3) |
| 02-monetyzacja-505 | M1-016 | zweryfikowane (kod); telefon nie sprawdzony | `lib/store-native.ts:128` arkusz `showManageSubscriptionsIOS`, zapas `deepLinkToSubscriptions`; funkcja jest w expo-iap 5.8.1 (`node_modules/expo-iap/src/modules/ios.ts:186`); test 3/3 |
| 02-monetyzacja-002 | M1-037 | zweryfikowane | `components/SubscriptionCard.tsx:19` tytuł zależny od stanu; sonda: darmowy i wygasły "Zobacz plany Pro", z planem "Masz plan: …"; test 43/43 |
| 02-monetyzacja-506 | M1-037 | zweryfikowane (dokumenty); krok właściciela otwarty | UA zamknięte (`docs/15-app-store.md:135`); krok Z-10b przed 1.0 (`docs/48-zgloszenie-1-0.md:70`), kontrola wszystkich krajów w backlogu (`docs/21-roadmapa-offline.md:169`); test 037-dokumenty 12/12 |
| 02-monetyzacja-005 | M1-037 | zweryfikowane (backlog z wersją) | `docs/21-roadmapa-offline.md:168` (1.0.x, punkt kontrolny) |
| 02-monetyzacja-004 | M1-036 | tylko wypisane: zablokowane DEC-08 a | przeliczenie W0 w punkcie kontrolnym 8 tygodni po premierze (plan-napraw.json, blokada) |
| 02-monetyzacja-601 | nowe | istniało wcześniej | patrz „Znaleziska” |
| 02-monetyzacja-602 | nowe | istniało wcześniej | patrz „Znaleziska” |

| Pozycja spoza ID roli | Wynik | Dowód |
|---|---|---|
| M2-koordynator-napraw-001 (decyzja 5a, dbfa3cd) | zweryfikowane | `app/paywall.tsx:59` `paysSub` wyklucza tylko `family`; test "subskrypcja z kodu promocyjnego … ta sama uwaga" zielony; sonda "miesięczny z kodu" → uwaga widoczna |
| Otwarte poza main (tylko wypisane) | — | 9a eksport figur strony (gałąź naprawy/M2-po-decyzjach-eksport-figur), propozycje A/B w L-047 i L-048 (docs/40), backlog 1.0.1 w docs/21 |

## Przegląd różnicy 025a50b..2385e75 (obszar roli)

`git diff --stat` dla 10 plików z polecenia: 141 wierszy dodanych, 35 usuniętych. Commity: c9cacfa, 644c498, 01f8bf0, a90caba, 8c12be9, 72338f0, f775eb5, 1a96768, dbfa3cd, 5bbc84a; poza monetyzacją także 7fb4f1a, dbc9f3b, 0311996, e66902b.
- `app/paywall.tsx`: stan posiadanego planu, zwinięta lista, etykieta „Przejdź na ten plan”, uwaga przed dożywotnim, odświeżenie po arkuszu zarządzania. Przeczytany w całości. Uwagi → 601, 602.
- `lib/access.ts`, `lib/entitlement.ts`: P3 B z pamięcią `endedAt`. Odczyt kv następuje przed pierwszym odświeżeniem (`lib/entitlement.ts:77`), więc przejście full → free widzi poprzedni stan. Bez uwag.
- `lib/store-native.ts`: arkusz zarządzania z zapasem. Bez uwag (telefon: „Do sprawdzenia” 1).
- `components/SubscriptionCard.tsx`, `app/more/settings.tsx` (tylko stała RPE), `lib/store.ts` (eksport stałych), `lib/support.ts` (linia techniczna w e-mailu, poza płatnościami): bez uwag w obszarze roli.
- `.maestro/21-subskrypcja.yaml`: asercje „Your plan: …”, „Change plan”, „Switch to this plan”, „See Pro plans”. Przebieg E2E 40646282170 (wybrane scenariusze, sukces, SHA acb7d72) zawiera wszystkie commity zakupu (sprawdzone `git merge-base --is-ancestor`). Pliki ekranu zakupu na acb7d72 i 2385e75 są takie same. Listy scenariuszy przebiegu nie odczytałem.
- `docs/waluta-ekranu-zakupu-1031.md`: opis R-WAL, zgodny z decyzją z 27.10.
- Uzgodnienie 1A × DEC-09 a, stany (`dowody/sonda-stany-ekranu.txt`):

| Stan | Nagłówek ekranu zakupu | „Zmień plan” / zakup | Uwaga przed dożywotnim | Wiersz Ustawień |
|---|---|---|---|---|
| darmowy | „Trenuj 5 dni… za darmo…” | lista + „Subskrybuj” | — | „Zobacz plany Pro” + licznik |
| miesięczny / roczny | „Masz plan: miesięczny / roczny” + „Dostęp do …” | zwinięta; „Kup na zawsze” | tak | „Masz plan: …” + „Dostęp do …” |
| dożywotni | „Masz plan: dożywotni” + „Masz dostęp na zawsze” | brak | — | to samo |
| z kodu | „Masz plan: miesięczny” + „Dostęp z kodu do …” | zwinięta | tak (5a) | „Masz plan: miesięczny” + „Dostęp do …” |
| rodzinny | „Masz plan: roczny” + „Dostęp z Chmury rodzinnej” | zwinięta | nie (słusznie) | „Masz plan: roczny” + „Dostęp do …” |
| wygasły | oferta jak darmowy | lista + „Subskrybuj” | — | „Zobacz plany Pro” |
| dożywotni + subskrypcja z rodziny | „Masz plan: dożywotni” + „anuluj ją, żeby nie płacić podwójnie” | — | — | „Masz plan: dożywotni” → 602 |
| offline, zapamiętany pełny | oferta jak darmowy | lista albo „Ceny są niedostępne” | — | „Pełna wersja / Masz pełną wersję” → 601 |

Sprzecznych tekstów między ekranem zakupu, Ustawieniami i kartą nie ma poza stanami 601 i 602. Ustawienia przy planie z kodu i z rodziny podają mniej szczegółów niż ekran zakupu (bez „z kodu” i „z Chmury rodzinnej”), ale to nie jest sprzeczność; resztka 504 opisana wyżej.

## Próbka regresji (3 pozycje spoza zmienionych plików)

Pliki `lib/start.ts`, `lib/store-adapter.ts`, `lib/products.ts`, `lib/state/finish.ts` nie zmieniły się od 025a50b (`git diff --quiet`, kod 0). Dowody: `dowody/regresja-probka.txt`.
- MON-06: wszystkie trzy drogi startu przez strażnika (`lib/start.ts:64`, `lib/start.ts:70`, `lib/start.ts:75`). Wynik: ok.
- MON-12: sztuczny sklep tylko przy zmiennej buildu E2E (`lib/products.ts:54`); tests/store-adapter.test.ts 39/39. Wynik: ok.
- MON-10 (cena z `displayPrice`): tests/cena-z-displayprice.test.ts 8/8; MON-09 (zapis dnia, `lib/state/finish.ts:92`): tests/m5s1-dni-zapis.test.ts 24/24. Wynik: ok.

## Znaleziska (szczegóły)

### 02-monetyzacja-601 · Bez sieci płacący widzi na ekranie zakupu ofertę dla darmowych, a Ustawienia mówią „Masz pełną wersję”
- Pozycja listy kontrolnej: MON-11 (spójność z MON-08; DEC-09 a nie obejmuje stanu `unknown`)
- Poziom: P2
- Realność: brzegowy (aplikacja offline, siłownia bez zasięgu; trzeba wejść w Ustawienia → Subskrypcja) · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: stan "mam plan" zależy od `view.active`, który powstaje tylko z odpowiedzi sklepu (`lib/entitlement.ts:100`). Przy błędzie odczytu jest `null`, choć poziom to `full` z pamięci. Ekran zakupu pokazuje wtedy wstęp o darmowych dniach (`app/paywall.tsx:78`) i stopkę "Bez zakupu…" (`app/paywall.tsx:116`). Wiersz w Ustawieniach używa `v.level` i pokazuje "Pełna wersja / Masz pełną wersję" (`components/SubscriptionCard.tsx:19`). Sonda: "state=unknown level=full active=null" → na ekranie zakupu "Trenuj 5 dni w miesiącu za darmo…", "Subskrybuj" (ceny wczytane przed utratą sieci), "Bez zakupu: do 5 dni…"; w Ustawieniach "Pełna wersja", "Masz pełną wersję" — `dowody/sonda-offline-pelny.txt`. W 025a50b wstęp był pokazywany wszystkim (`dowody/025a50b-paywall-wczesniej.txt`), więc problem istniał wcześniej.
- Mechanizm: dwa źródła stanu w dwóch widokach (`view.active` i `view.level`); `grep -n "view.active" app/paywall.tsx` → 9 trafień, żadne nie sprawdza `view.level`.
- Powraca: nie (nowe; pokrewne 02-monetyzacja-504 dla stanu online)
- Wzorzec lub źródło: zasada roli 7 (brak sieci nie zabiera opłaconego, także w komunikacie); DEC-09 a (`docs/18-przekazanie.md:603`).
- Kroki w aplikacji: kup plan → zamknij aplikację → tryb samolotowy → otwórz aplikację → Więcej → Ustawienia („Pełna wersja / Masz pełną wersję”) → stuknij → „Trenuj 5 dni w miesiącu za darmo. Pro zdejmuje limit.”, „Ceny są niedostępne bez połączenia…”, „Bez zakupu: do 5 dni…”. Start treningu działa (karencja 7 dni), więc szkody nie ma, ale komunikat myli.
- Opcje: (a) przy `level === 'full'` i braku `active` pokazać kartę „Masz pełną wersję” + „Sprawdzimy plan po połączeniu z internetem” i ukryć wstęp, stopkę i listę. Kompromis: nowy tekst w 35 językach. (b) Ukryć tylko wstęp i stopkę przy `level === 'full'`, bez nowego tekstu. Kompromis: ekran bez nazwy planu. Rekomendacja: (b) w 1.0.1. P2 nie blokuje wydania.
- Test akceptacyjny: render ekranu zakupu po utracie sieci z zapamiętanym pełnym dostępem: brak „paywall-headline” i stopki „Bez zakupu”, brak „Subskrybuj”.
- Status: otwarte (istniało wcześniej, do decyzji właściciela)

### 02-monetyzacja-602 · Po zakupie dożywotniego członek Chmury rodzinnej czyta „anuluj subskrypcję, żeby nie płacić podwójnie”, choć nie płaci za nią sam
- Pozycja listy kontrolnej: MON-10
- Poziom: P2
- Realność: brzegowy (członek rodziny z udostępnioną subskrypcją kupuje sobie dożywotni) · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: uwaga po zakupie liczy `subActive` z każdą subskrypcją, także rodzinną (`app/paywall.tsx:55`, `app/paywall.tsx:90`). Uwaga przed zakupem używa `paysSub`, który rodzinę wyklucza (`app/paywall.tsx:59`). Ten sam stan dostaje więc przed zakupem i po nim sprzeczne komunikaty. Sonda "dożywotni + subskrypcja z Chmury rodzinnej" → "Twoja subskrypcja nadal się odnawia — anuluj ją, żeby nie płacić podwójnie." i "Zarządzaj subskrypcją" (`dowody/sonda-stany-ekranu.txt`). Warunek po zakupie był taki sam w 025a50b (`dowody/025a50b-paywall-wczesniej.txt`); sprzeczność ujawniła się, gdy a90caba dodał `paysSub`.
- Mechanizm: dwa warunki dla jednego komunikatu; `grep -n "subActive\|paysSub" app/paywall.tsx` → `app/paywall.tsx:55`, `app/paywall.tsx:59`, `app/paywall.tsx:90`, `app/paywall.tsx:91`, `app/paywall.tsx:110`.
- Powraca: nie (pokrewne 02-monetyzacja-503)
- Wzorzec lub źródło: zasada roli 6 (uczciwie); decyzja 5a 28.10 (uwaga dla subskrypcji, za którą osoba płaci sama, także z kodu).
- Kroki w aplikacji: członek rodziny z udostępnionym rocznym → Ustawienia → „Masz plan: roczny” → „Zmień plan” → „Kup na zawsze” (bez uwagi, słusznie) → po zakupie karta „Masz plan: dożywotni” z poleceniem anulowania subskrypcji, której ta osoba nie może anulować.
- Opcje: (a) uwaga po zakupie z warunkiem `paysSub` („Zarządzaj subskrypcją” może zostać przy `subActive`). Kompromis: brak. (b) Zostawić. Kompromis: myląca rada. Rekomendacja: (a), jedna linia z testem w 1.0.1 albo w 1.0, jeśli build i tak powstaje.
- Test akceptacyjny: render z dożywotnim i roczną subskrypcją `source: 'family'`: brak zdania o anulowaniu; z `purchase` i `code`: zdanie jest.
- Status: otwarte (istniało wcześniej, do decyzji właściciela)

## Do sprawdzenia (pewność ≤ 80%)

1. **Arkusz "Zarządzaj subskrypcją" (M1-016) na telefonie.** Kod woła `showManageSubscriptionsIOS` bez wcześniejszego `connect()` (`lib/store-native.ts:128`). Jeśli moduł natywny wymaga połączenia, zadziała zapas (strona App Store). Krok właściciela (TestFlight, 2 min): ekran zakupu z aktywną subskrypcją piaskownicy → "Zarządzaj subskrypcją" → oczekiwany arkusz systemowy w aplikacji z tą subskrypcją. Stan: nie sprawdzono.
2. **Test 001 przy obciążeniu.** Pierwszy test pliku przekroczył domyślne 5 s przy zimnym starcie (9,3 s), a drugi upadł za nim. Dwie powtórki są zielone (`dowody/jest-001-powtorka.txt`). Jest to niestabilność czasu, nie asercji (obszar JAK).
3. **Resztka 504 bez pozycji w backlogu.** „Odnawia się {data}” (wymaga stanu odnawiania z adaptera) i rodzina w podtytule Ustawień są wyłączone z DEC-09 a, ale `grep -n "Odnawia się\|willRenew" docs/21-roadmapa-offline.md` nie daje trafień. Czy ma tam być wpis z wersją, rozstrzyga koordynator.
4. **R-WAL** zamyka dopiero krok Z-36 pierwszego dnia po wydaniu (decyzja z 27.10). Telefonu nie sprawdzono.

## Kontrola dowodów i sekretów

`node /home/user/trening/audit/M1-2026-10-27/reaudit-2026-10-28/sprawdz-raport.mjs <raport> /home/user/trening /home/user/trening/audit/M1-2026-10-27/reaudit-2026-10-28/02-monetyzacja --rola 02-monetyzacja` — wynik w `dowody/sprawdz-raport.txt`. Raport i dowody bez e-maili, UDID, sekretów i nazw innych aplikacji (sprawdzone grepem adresów e-mail w dowodach: 0 trafień). `git status --porcelain` na starcie pusty (`dowody/git-status-start.txt`), na końcu w `dowody/git-status-koniec.txt`. Sonda powstała tylko w worktree w scratchpadzie; worktree usunięty na końcu.
