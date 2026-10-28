# Reaudyt: Programista — Trening (iOS) — 2026-10-28
Commit: 2385e75aeb3880c0c90ba5edd69145a1c6d80b01 (HEAD odłączony, sprawdzony na starcie) · Baza: 025a50b96f504ea9d16d573720d1e92dc951a103 · Tryb: reaudit, pętla 1 · Środowisko: Linux x86_64, Node 22.22.0, git; bez Xcode, symulatora i telefonu; testy Jest pojedynczo `--maxWorkers=1`; typecheck kod 0 i lint kod 0 ze wspólnych wyników (`wspolne/typecheck.txt`, `wspolne/lint.txt`), nie powtarzane; sondy w kopii roboczej w scratchpadzie (`dowody/srodowisko.txt`).

## Podsumowanie
Wszystkie pięć pozycji źródłowych roli jest naprawionych w kodzie z testem, który przechodzi. Wyjątek to 08-programista-006 (literały `fontSize`): zadanie M1-030 świadomie przeniosło je do backlogu 1.0.1 z wpisem w docs/21, a liczba wystąpień się nie zmieniła (67 → 67). Rozdzielenie wartości logicznej `wu()` od etykiety lokalnej (5ca75778) jest czyste. Żadne porównanie, zapis, parsowanie, klucz pamięci podręcznej ani eksport nie używa etykiety, a CSV i kopia zostają w łacince (strażnik `tests/units-label.test.ts`, 42/42). Wykryłem jedną regresję P2: podpis przerwy (ekran, Live Activity, zegarek) ma dystans na sztywno „m”, więc w ru, uk, bg, sr i el wychodzi mieszanka pism „40 кг, 30 m”, a karta „teraz” pokazuje „40 кг × 30 м”. Nie ma znalezisk P0 ani P1. Próbka regresji spoza zmienionych plików (DEV-05, DEV-14, DEV-15) nic nie wykazała.

| ID | Poziom | Wynik reaudytu | Dowód |
|---|---|---|---|
| 08-programista-001 | P2 | zweryfikowane (M1-016, f775eb5c) | `lib/store-native.ts:128`, `dowody/jest-audit-m1-2026-10-27-016-arkusz-subskrypcji.txt` (3/3, kod 0) |
| 08-programista-002 | P2 | zweryfikowane (M1-010, 72338f0 + 5bbc84ad) | `app/paywall.tsx:78`, `app/paywall.tsx:86`, `dowody/jest-audit-m1-2026-10-27-010-stan-mam-plan.txt` (10/10, kod 0) |
| 08-programista-003 | P2 | zweryfikowane (M1-009, ee1713b; część b opcji nie wdrożona, poza testem akceptacyjnym) | `scripts/decyzje.mjs:23`, `dowody/check-decyzje.txt` (341 wpisów, kod 0), `dowody/jest-decyzje-straznik.txt` (21/21) |
| 08-programista-004 | P2 | zweryfikowane (M1-030, 79857552) | `lib/stats.ts:351`, `lib/progress.ts:57`, `dowody/jest-audit-m1-2026-10-27-030-liczby-w-kodzie.txt` (3/3) |
| 08-programista-006 | P2 | nadal otwarte, odłożone do 1.0.1 decyzją z zadania M1-030 (backlog docs/21) | `docs/21-roadmapa-offline.md:157`, `dowody/fontsize-liczba.txt` (67 = 67), `dowody/jest-m3-token-guard.txt` (6/6) |
| 08-programista-005 | P2 | zweryfikowane (M1-037 A, 848f9b0 + 5bbc84ad) | `components/SubscriptionCard.tsx:19`, `dowody/jest-037-wiersz-pelna-wersja.txt` (43/43) |
| 08-programista-601 | P2 | regresja (nowe; wprowadzone przez 5ca75778) | `lib/live.ts:108`, `dowody/sonda-601-dystans-podpis-przerwy.txt` |

Liczby nowych znalezisk: P0 0 · P1 0 · P2 1 (601).

## Szczegóły weryfikacji ID źródłowych
- **001 → M1-016.** `lib/store-native.ts:128` „async manageSubscriptions() { const m = iap(); try { await m.showManageSubscriptionsIOS(); }”. Strona App Store zostaje tylko w `catch`. Przed powrotem z arkusza ekran woła `refreshEntitlements()` (`app/paywall.tsx:91`). Natywnie (OpenIAP Apple 3.6.0, wersja z `node_modules/expo-iap/openiap-versions.json`, plik pobrany 28.10.2026) `showManageSubscriptionsIOS` zbiera transakcje, woła natywne `deepLinkToSubscriptions` z `AppStore.showManageSubscriptions(in: scene)` i sam inicjuje połączenie (`ensureConnection`). Brak `connect()` po stronie JS niczego więc nie psuje. Test 3/3, kod 0. Na telefonie (arkusz z subskrypcją testową w TestFlight): nie sprawdzono. Krok właściciela, ok. 1 min: Ustawienia → Subskrypcja → „Zarządzaj subskrypcją” w buildzie TestFlight.
- **002 → M1-010.** Wstęp o darmowych dniach jest ukryty przy aktywnym planie (`app/paywall.tsx:78`, `view.active ? null`). Nagłówek karty nazywa plan (`app/paywall.tsx:86`, `ownedPlanTitle`). Lista planów jest zwinięta pod przełącznikiem zmiany planu (`app/paywall.tsx:94`), posiadany plan jest niewybieralny, a zakup innej subskrypcji ma osobną etykietę (`app/paywall.tsx:35`). Napis z datą dostępu zostaje zgodnie z decyzją (`docs/18-przekazanie.md:603`: aplikacja nie zna stanu automatycznego odnawiania), więc to nie jest znalezisko. Test 10/10, kod 0.
- **003 → M1-009.** `npm run check:decyzje` → 341 wpisów decyzji bez błędu, kod 0. Strażnik jest w `verify` i `verify:docs`. Od 28.10.2026 wskazany test musi zawierać datę decyzji (`scripts/decyzje.mjs:23`). Opcja (b) z raportu audytu, czyli lista zadań gałęzi przy scalaniu PR, nie powstała. Test akceptacyjny M1-009 jej nie obejmował, więc nie liczę tego jako pozycji nadal otwartej. Odnotowuję jako informację dla koordynatora.
- **004 → M1-030.** `lib/stats.ts:351` „v * SECONDARY_SHARE”, `lib/progress.ts:57` „e.volume * SECONDARY_SHARE”. Literału `* 0.5` przy `secondaryMuscles` brak. Test 3/3.
- **006 → M1-030.** Liczba literałów `fontSize` w `components/` i `app/` jest równa na 025a50b i 2385e75: 67 i 67 (`dowody/fontsize-liczba.txt`). Pozycja w backlogu 1.0.1: `docs/21-roadmapa-offline.md:157`. Zapadka `tests/m3-token-guard.test.ts` przechodzi (6/6).
- **005 → M1-037 A.** `components/SubscriptionCard.tsx:19`: bez planu „Zobacz plany Pro”, z planem `ownedPlanTitle` („Masz plan: …”, uzgodnienie 1A × DEC-09 a). Test 43/43.
- **Decyzje 28.10.2026 w obszarze kodu** (intencja, nie znaleziska): 5a (`app/paywall.tsx:59`, uwaga przed dożywotnim także przy subskrypcji z kodu, bez Chmury rodzinnej), 6a (`components/NowBoard.tsx:83`, wysokość linii znaku „×” liczona z jego rozmiaru), 7a (`components/StartError.tsx:37`, e-mail tylko z kodem etapu), 10a (5ca75778, opis niżej) i 1A (`components/SubscriptionCard.tsx:19`) są zrealizowane w kodzie. Otwarte poza main, tylko odnotowuję: 9a eksport figur strony (gałąź `naprawy/M2-po-decyzjach-eksport-figur`), propozycje A/B w L-047 i L-048 (docs/40), backlog 1.0.1 (docs/21).

## Przegląd różnicy 025a50b..2385e75 (obszar roli)
- **wu() i etykieta (5ca75778).**
  - Wszystkie użycia `wu()` poza `lib/units.ts` to porównania z `'lb'` albo klucz pamięci podręcznej `ex.id + '|' + wu()` w `lib/stats.ts:120` (wartość logiczna, poprawnie) — `dowody/grep-wu.txt`.
  - `distUnit()` (wartość logiczna dystansu) nie ma użyć poza modułem.
  - Etykiety `unitLabel`, `unitName`, `distLabel` i `distLongLabel` (`lib/units.ts:20`, `lib/units.ts:35`) trafiają wyłącznie do tekstu: podpisy, placeholdery, etykiety VoiceOver, parametry `t()` — 44 trafienia w `dowody/grep-etykiety.txt`.
  - Grep porównań, `split`, `indexOf`, `includes` i `replace` z etykietą: 0 trafień (kod 1).
  - Wartości segmentów w imporcie i edytorze sprzętu zostały logiczne (`['kg', unitName('kg')]`).
  - Kod Swift w `modules/` i `targets/` nie porównuje jednostek: dostaje gotowy napis (`lib/watch/snapshot.ts:26`).
  - CSV i kopia są w łacince niezależnie od języka (test `tests/units-label.test.ts`, 42/42, kod 0, `dowody/jest-units-label.txt`).
  - Jedyna pozostałość to dystans na sztywno w podpisie przerwy → 08-programista-601.
- **Liczby na sztywno (030).** Nowe stałe paska tygodnia mają nazwy i komentarz w `lib/calendar.ts` (`STRIP_*`). `IMPORT_NOTE_MAX` = `SET_NOTE_MAX` (jedno miejsce). Próg RIR jest w `lib/state/effort.ts` z odwołaniem do źródła (rola 06). Nowych literałów `fontSize` nie ma: liczba się nie zmieniła.
- **Pozostałe pliki z zakresu** (`board.ts`, `live.ts`, `stats.ts`, `progress.ts`, `equipment.ts`, `swap.ts`, `review-run.ts`, `calendar.ts`; także `entitlement.ts`, `access.ts`, `boot.ts`, `rescue.ts`, `backup.ts`) przeczytane w diffie: sprawdzone, brak znalezisk w obszarze roli.
  - Zapis `endedAt` w pamięci dostępu przechodzi przez parser z `fin()`.
  - Wyjątek migracji nie zapisuje niczego.
  - Kopia ratunkowa tylko kopiuje komplet plików bazy (`-wal`, `-shm`, `-journal`).
- **DEV-02 na commitach M2:** 11/11 commitów zmieniających kod ma test w tym samym commicie (`dowody/dev02-proba.txt`).

## Próbka regresji (pliki niezmienione od 025a50b)
| Pozycja | Wynik | Dowód |
|---|---|---|
| DEV-05 | ok: jedna tabela `kv` (tabela-liść bez kluczy obcych), `INSERT OR REPLACE` ustawia obie kolumny, transakcja tylko przy przeniesieniu bazy (`lib/state/db.ts:24`), brak `withExclusiveTransactionAsync` | `dowody/regresja-probka.txt` |
| DEV-14 | ok: brak plików kluczy w `git ls-files`; jedyne trafienie wzorca klucza to napis testowy maskowania w `tests/gemini-pozy.test.ts:343` (29 znaków, nie sekret) | `dowody/regresja-probka.txt` |
| DEV-15 | ok: blokada wygaszania z parą `activateKeepAwakeAsync`/`deactivateKeepAwake` (`components/ActiveWorkout.tsx:52`), każdy `setInterval` ma `clearInterval` w sprzątaniu | `dowody/regresja-probka.txt` |

## Znaleziska (szczegóły)

### 08-programista-601 · Podpis przerwy pokazuje dystans łacińskim „m” obok lokalnego symbolu masy („40 кг, 30 m”) w ru, uk, bg, sr i el
- Pozycja listy kontrolnej: DEV-12
- Poziom: P2
- Realność: realny (każdy użytkownik w ru, uk, bg, sr albo el w systemie metrycznym, który robi ćwiczenie z dystansem, np. spacer farmera albo sanki, i odpoczywa po serii) · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód:
  - `lib/live.ts:108` „isImperial() ? fmtDist(Number(set.distanceM))”. Gałąź metryczna składa napis `${set.distanceM} m` z literałem, a gałąź imperialna i karta „teraz” (`distParts`, `lib/live.ts:81`) biorą etykietę ze słownika.
  - Sonda (`dowody/sonda-601-dystans-podpis-przerwy.txt`, kod 0) na 2385e75 dla ru: `nowParts` „40 кг × 30 м”, `cueLoad` „40 кг, 30 m” (tak samo uk, bg, sr; el „40 κιλά, 30 m”).
  - Na 025a50b oba miejsca dawały „kg” i „m”: spójnie, w łacince.
  - Ten sam tekst (`restCue`) idzie na ekran przerwy, do Live Activity i na zegarek (`lib/watch/protocol.ts:88`).
- Mechanizm: 5ca75778 zamieniło jednostki na etykiety w `distParts`, `nowParts` i `fmtW`, ale pominęło literał w `loadText`. Strażnik `tests/units-label.test.ts` szuka tylko `wu()` i parametrów `t()`, nie literałów jednostek. `grep -rnE '\$\{[^}]+\} ?(kg|lb|m|yd|km|mi)\b' app components lib` → 1 trafienie: `lib/live.ts:108`.
- Powraca: nie (pierwsze zgłoszenie) → trwała kontrola: rozszerzenie strażnika jednostek o literały jednostek w napisach.
- Wzorzec lub źródło: decyzja właściciela 10a (28.10.2026, symbol masy lokalnie w cyrylicy i grece) i komentarz kontraktu `lib/tokens.ts:119` („zawsze z unitLabel()/distLabel(), nigdy na sztywno”).
- Kroki w aplikacji: język rosyjski → trening z ćwiczeniem na ciężar i dystans → odhacz serię → podpis przerwy (ekran, ekran blokady, zegarek) pokazuje „…, 40 кг, 30 m”.
- Opcje: (a) metryczna gałąź przez `fmtDist(Number(set.distanceM))`, jak gałąź imperialna. Kompromis: od 1000 m pokaże „km” zamiast „m” (zgodnie z resztą podpisów, inaczej niż karta „teraz”). (b) `` `${set.distanceM} ${distLabel()}` ``. Kompromis: zachowuje dzisiejsze liczby, minimalna zmiana. Rekomendacja: (b) przy najbliższym buildzie (5 min agenta i test macierzy języków), razem z rozszerzeniem strażnika.
- Test akceptacyjny: dla ru, uk, bg, sr i el `cueLoad` dla serii z ciężarem i dystansem zawiera ten sam symbol dystansu co `nowParts`; strażnik nie znajduje literału jednostki w napisach w `app`, `components` i `lib`.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)
- `lib/store-native.ts:128`: `catch` obejmuje cały `showManageSubscriptionsIOS`, także odczyt transakcji po zamknięciu arkusza. Jeśli ten odczyt rzuci (np. niezweryfikowana transakcja), po zamknięciu arkusza otworzy się dodatkowo strona App Store. Taki stan nie ma drogi przez UI (teoretyczny), więc go nie naprawiamy.
- `tests/audit-m1-2026-10-27-016-arkusz-subskrypcji.test.tsx:35` „fake.calls.manageSubscriptions ?? 1”: `?? 1` nie działa, bo licznik jest zawsze liczbą (od 0), więc asercja nie jest osłabiona (DEV-03: ok). To tylko styl.

## Kontrola dowodów i sekretów
Wynik `node sprawdz-raport.mjs` w `dowody/sprawdz-raport.txt` (kod 0 przed oddaniem). Hasła i klucze w raporcie i dowodach są zamaskowane. Nie ma w nich danych osobowych ani nazw innych aplikacji.

Komendy (kody wyjścia):
- `npx jest <plik> --ci --maxWorkers=1` dla 016, 010, 030, decyzje-straznik, 037-wiersz, units-label, m3-token-guard: każdy kod 0 (pliki `jest-*.txt` w katalogu dowodów);
- `npm run check:decyzje`: kod 0;
- sondy 601 na 2385e75 i 025a50b: kod 0.

`git status --porcelain` w /home/user/trening na starcie i na końcu: pusty wynik. Pliki śledzone są nietknięte. Kopię roboczą sondy usuwa na końcu `git worktree remove` (`dowody/git-status-koniec.txt`).

Nie sprawdzono:
- arkusz zarządzania subskrypcją na telefonie (krok właściciela wyżej);
- wygląd podpisu przerwy na ekranie blokady i zegarku (sonda tylko w Node);
- testy Swift zegarka (brak macOS).
