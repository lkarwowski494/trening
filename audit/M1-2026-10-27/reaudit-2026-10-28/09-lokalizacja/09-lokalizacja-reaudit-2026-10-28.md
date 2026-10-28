# Ponowny audyt: Lokalizacja — Trening (iOS) — 2026-10-28
Commit: 2385e75aeb3880c0c90ba5edd69145a1c6d80b01 (main po naprawach M2, HEAD odłączony, sprawdzony na starcie) · Baza: 025a50b96f504ea9d16d573720d1e92dc951a103 · Tryb: reaudit, pętla 1 · Środowisko: Linux x86_64, Node v22.22.0; sondy w `git worktree` w scratchpadzie (node_modules z repo przez dowiązanie), Jest pojedynczo `--maxWorkers=1`; Chromium z Playwright 1.63 (globalny) tylko do pomiaru szerokości tekstu; GitHub tylko odczyt (MCP); brak macOS, symulatora i telefonu. Prompt przeczytany do ostatniej linii; ostatni nagłówek: „## Kontrola dowodów i sekretów przed oddaniem raportu”.

## Podsumowanie

Większość napraw z obszaru lokalizacji działa na 2385e75. Formy uk/sl, jedna forma „ви” w uk, nowy walidator `check:i18n`, „Rekord:” zamiast „PR:” i symbol masy w piśmie lokalnym (decyzja 10a) są wdrożone, a testy M2 przechodzą. Przegląd tłumaczeń przez API z 28.10 objął stan po ostatniej zmianie tekstów (baza batcha 98aa4a2). W 161 zmienionych wartościach nie ma rozjazdu parametrów ani liczb, a próbka w 8 językach nie wykazała błędu sensu (krytyczna poprawka sl „drop set” jest poprawna). **Nadal otwarte jest M1-006 (P1):** R-010 w rejestrze ryzyk nie ma wpisu z 28.10 i dalej ma status „otwarte”. docs/16 opisuje przegląd natywny jako otwarty, a to przeczy decyzji właściciela z 21.10, że R-010 zamyka przegląd Claude. Lista sprawdzonych zdań z 28.10 jest tylko w artefakcie CI, który wygasa 04.11.2026. Bez tego R-010 dalej blokuje zgłoszenie do App Store. Jedno nowe znalezisko P2 (regresja decyzji 10a): w greckim jednostka to pełne słowo „κιλά”, więc VoiceOver czyta „1 κιλά” przy kroku hantli, a nagłówek kolumny „κιλά/πλευρά” nie mieści się w kolumnie ciężaru.

| ID | M1 | Wynik | Dowód |
|---|---|---|---|
| 09-lokalizacja-001 | M1-006 | nadal otwarte (P1): przegląd wykonany, R-010 niezamknięte w rejestrze, dowód nietrwały | dowody/stan-id.txt, dowody/przeglad-api-zmiany-98aa4a2-2385e75.txt |
| 09-lokalizacja-002 | M1-007 | zweryfikowane (zakres M1-007: rejestr R-WAL + krok Z-36); sam objaw waluty — nie sprawdzono (telefon) | dowody/test-audit-m1-2026-10-27-007-waluta-ryzyko.txt, dowody/stan-id.txt |
| 09-lokalizacja-003 | M1-019 | zweryfikowane | dowody/test-i18n-skrot-liczebnik.txt, dowody/stan-id.txt |
| 09-lokalizacja-004 | M1-011 | zweryfikowane w zakresie scenariusza 58 (przebieg 40624070610 zielony); stan „dziś bez treningu” z dużą ikoną — nie sprawdzono, krok telefonu nie jest zapisany na liście | dowody/stan-id.txt |
| 09-lokalizacja-005 | M1-031 | zweryfikowane (decyzja 10a wdrożona: ru/uk/bg/sr „кг”, el „κιλά”); regresja P2 w el → 09-lokalizacja-601 | dowody/test-units-label.txt, dowody/el-kila.txt |
| 09-lokalizacja-006 | M1-031 | zweryfikowane | dowody/test-i18n-forma-uk.txt, dowody/stan-id.txt |
| 09-lokalizacja-007 | M1-031 | zweryfikowane | dowody/test-check-i18n-script.txt, dowody/check-i18n.txt |
| 09-lokalizacja-008 | M1-030 | zweryfikowane | dowody/test-audit-m1-2026-10-27-030-liczby-w-kodzie.txt, dowody/stan-id.txt |
| 09-lokalizacja-601 | — | nowe, P2, regresja (5ca7577) | dowody/el-kila.txt, dowody/szerokosc-etykiet-el.txt |

Nowe znaleziska: P0 — 0, P1 — 0, P2 — 1 (09-lokalizacja-601). Znane, nadal otwarte: P1 — 1 (09-lokalizacja-001 / M1-006).

### Szczegóły wyników dla ID źródłowych

- **M1-006 (09-lokalizacja-001) — nadal otwarte, P1.**
  - Wykonano: batch Opus z 28.10 na 98aa4a2, czyli po ostatniej zmianie tekstów krytycznych (przebieg 40642059904, sukces; 98aa4a2 jest przodkiem 2385e75). Po nim zmieniły się tylko poprawki z przeglądu (bcb0f2d, a38ce27) i poprawki strażników (a666257): it „altri”, ko odstęp przy mi/yd, sk „celkom”, pt-BR usunięte wpisy równe bazie pt. Sensu treści krytycznej nie zmieniło żadne z nich.
  - Zapis wyniku: `docs/16-jezyki-i-marka.md:359` (sekcja z 28.10: 1 krytyczna, 165 zmian, 67 odrzuconych).
  - Czego brakuje do zamknięcia według warunku z rejestru:
    - (a) wiersz R-010 w `docs/40-lekcje.md:22` nie ma wpisu z 28.10 i ma status „otwarte (20.10.2026)”;
    - (b) `docs/16-jezyki-i-marka.md:368` mówi „przegląd przez native speakerów nadal otwarty”, a decyzje właściciela K-P4-2 z 20.10 (`docs/18-przekazanie.md:339`) i z 21.10 (`docs/18-przekazanie.md:404`) ustalają, że R-010 zamyka przegląd wykonany przez Claude, a przegląd przez człowieka odrzucono. Rejestr i decyzja są więc sprzeczne;
    - (c) decyzja z 21.10 wymaga „listy sprawdzonych zdań jako dowodu w rejestrze ryzyk”. Dla 22.10 jest trwała kopia w `docs/lokalizacja/raport-api-2026-10-22/`, dla 28.10 jej nie ma. Artefakt `raport-tlumaczen` przebiegu 40642059904 wygasa 2026-11-04T06:13:01Z (odczyt MCP);
    - (d) decyzja 1a ma `docs/18-przekazanie.md:610` „[wdrożenie: otwarte → M1-audytor-generalny-006]”;
    - (e) pkt (2)–(3) warunku R-010 (fr/tr forma, przegląd opisu ryzyka) nie mają zapisu zamknięcia.
  - Ocena: P1, bo według CLAUDE.md „Rejestr ryzyk z blokadą” otwarte ryzyko blokuje wydanie w App Store, a etap to „tuż przed zgłoszeniem”. Naprawa to praca na dokumentach (ok. 15–30 min agenta), bez nowego przeglądu.
  - Opcje:
    - (A) skopiować raport batcha do `docs/lokalizacja/raport-api-2026-10-28/` przed 04.11, zapisać w docs/40 R-010 wynik 28.10 i zamknięcie zgodnie z decyzją 21.10, a kolumnę „native speaker” w docs/16 opisać jako poza warunkiem R-010 (decyzja K-P4-2);
    - (B) zostawić R-010 otwarte i zgłosić 1.0 decyzją właściciela „bez przeglądu natywnego” (wariant pkt 1 warunku) — szybciej, ale rejestr dalej sprzeczny z decyzją.

    Rekomendacja: A, przed wygaśnięciem artefaktu.
- **M1-007 (09-lokalizacja-002) — zweryfikowane w zakresie M1-007.** Wiersz R-WAL jest w `docs/40-lekcje.md:35` z warunkiem zamknięcia, krok Z-36 w `docs/48-zgloszenie-1-0.md:119` („ekran zakupu w wersji z App Store”). Test M2: 2/2, kod 0. Przyczyna samego objawu USD przy sklepie PL — nie sprawdzono (wymaga telefonu, krok Z-36 po wydaniu). Rola 02 sama oceniła ryzyko jako NISKIE (środowisko testowe); tego nie zgłaszam ponownie.
- **M1-019 (09-lokalizacja-003) — zweryfikowane.** `lib/locales/uk.json:321` „сьогодні в плані · {n} впр.” i `lib/locales/sl.json:321` „danes v načrtu · {n} vaj.” (także linie 659 i 1338). `tests/i18n-skrot-liczebnik.test.ts`: 11/11, kod 0. Pytanie recenzenta o naturalność „vaj.” po słoweńsku zostaje do przeglądu natywnego (nie znalezisko).
- **M1-030 (09-lokalizacja-008) — zweryfikowane.** `app/history/[id].tsx:74` używa klucza „Rekord: {list}”, w pliku nie ma już „PR: {”. Test M2: 3/3, kod 0.
- **M1-031 / 005 — zweryfikowane, z regresją P2 w el.** Etykieta idzie przez słownik (`lib/units.ts:20`, `lib/units.ts:96`), a `wu()` zostaje wartością logiczną (`lib/units.ts:16`). We wszystkich pięciu językach `{n} kg` ma lokalne pismo (dowody/stan-id.txt). W bazie 025a50b klucza nie było (symbol doklejany łacinką, dowody/el-kila.txt). `tests/units-label.test.ts`: 42/42. Skutek uboczny w el → 09-lokalizacja-601.
- **M1-031 / 006 — zweryfikowane.** 0 trafień form „ти” z audytu w `lib/locales/uk.json`, także po 165 poprawkach i nowych tekstach „Masz plan”. `tests/i18n-forma-uk.test.ts`: 2/2.
- **M1-031 / 007 — zweryfikowane.** `scripts/check-i18n.mjs` czyta kod składnią TS (t/tr/tp i wywołanie przez obiekt), traktuje podstawienie i sklejanie jako błąd i kontroluje pismo (`scripts/check-i18n.mjs:64`). Test liter polskich usunięty (0 trafień `PL_ONLY`). `npm run check:i18n`: kod 0 (1446 tekstów w kodzie, 1542 w słowniku EN). `tests/check-i18n-script.test.ts`: 15/15. Uwaga, nie znalezisko: kontrola pisma wykrywa tylko wartości bez żadnej litery pisma języka, więc pojedyncze słowo łacinką w zdaniu cyrylicą przechodzi.
- **M1-011 (09-lokalizacja-004) — zweryfikowane w zakresie scenariusza.** `.maestro/58-duzy-tekst.yaml` (przepływ US-21, `docs/37-katalog-przeplywow.md:191`), przebieg e2e-ios 40624070610 na 4c73243 (przodek 2385e75) zakończony sukcesem, limit `GLYPH_SCALE_MAX` w `lib/theme.ts:37`. Zrzutów 580–589 nie oglądałem (obszar roli 04 i testera). Zakres M1-011 jest spełniony. Raport M2 zostawił jednak krok telefonu T-04 dla stanu dziś bez treningu z dużą ikoną startu, a tego kroku nie ma ani w `docs/49-testflight-1-0.md` (T-04 tam to Pogrubiony tekst, R-014, `docs/49-testflight-1-0.md:19`), ani w docs/48 — patrz sekcja Do sprawdzenia.

## Przegląd różnicy 025a50b..2385e75 (obszar roli)

| Obszar | Wynik | Dowód |
|---|---|---|
| Poprawki z przeglądu API (161 zmienionych wartości od bazy batcha 98aa4a2 w `lib/locales`, `lib/cues/text`) | parametry `{…}` i liczby: 0 rozjazdów | dowody/przeglad-api-parametry-liczby.txt (kod 0) |
| Próbka sensu: de, ru, uk, el, ja, zh-Hant, sl, fr, nb, da, es, tr (wszystkie zmiany tych języków; pl/en bez zmian; ar nie ma w zestawie) | bez błędów sensu. Sprawdzone: sl drop set (seria przed nim), tr „Pauza” → rzeczownik (nazwa fazy tempa, `components/ExerciseFigureV2.tsx:94`), es/el/zh-Hant/da/nb asekuracja spójna ze słownikiem, ru/sl „visi”, gramatyka | dowody/przeglad-api-zmiany-98aa4a2-2385e75.txt |
| Słownik terminów, kontekst, skróty przekładu, wyjątki pisma | strażniki zielone | dowody/test-slownik-terminow.txt (109/109), dowody/test-i18n-locales.txt (72/72), dowody/check-i18n.txt |
| Treść krytyczna i rejestr języków | testy zielone; stan R-010 — patrz 001 | dowody/test-audit-m1-049-critical-content.txt, dowody/test-audit-m1-067-language-registry.txt |
| Symbol masy (5ca7577, 98aa4a2) | spójny w ru/uk/bg/sr („кг”), el „κιλά”; lb i mi/yd według słownika (el łacinką, ru/uk/sr cyrylicą) | dowody/stan-id.txt, dowody/test-units-label.txt; skutek w el: 601 |
| `store/screenshot-captions.json` (27 nowych języków) | strażnik 34/34; próbka de/ru/uk/el/ja/zh-Hant: nazwa „Strażnik progresji” zgodna ze słownikiem aplikacji, bez nazw marek i źródeł; status „do recenzji lokalizacji” (obszar roli 10) | dowody/test-podpisy-zrzutow.txt |
| `docs/16-jezyki-i-marka.md` | sekcja z 28.10 jest; sprzeczność z decyzją 21.10 — patrz 001 | dowody/stan-id.txt |

**Próbka regresji (3 pozycje spoza zmienionych plików):** LOK-09 — łańcuch słownik → EN → PL bez surowego klucza (`lib/i18n.ts:99`), plik bez zmian; LOK-13 — klucz synchronizacji powiadomień z `lang()` (`lib/planReminder.ts:51`) i przeliczenie po zmianie języka (`app/more/language.tsx:14`), bez zmian; LOK-14 — przełączenie kroju dla greki/cyrylicy/CJK (`lib/theme.ts:121`), w pliku doszedł tylko `GLYPH_SCALE_MAX`. Wynik: bez regresji (dowody/regresja-probka.txt).

**Otwarte poza main (tylko wypis):** 9a eksport figur strony (gałąź naprawy/M2-po-decyzjach-eksport-figur); propozycje A/B w lekcjach L-047 i L-048 (docs/40); backlog 1.0.1 (docs/21).

## Znaleziska (szczegóły)

### 09-lokalizacja-601 · Po grecku jednostka masy to pełne słowo „κιλά”: VoiceOver czyta „1 κιλά”, a nagłówek „κιλά/πλευρά” nie mieści się w kolumnie ciężaru
- Pozycja listy kontrolnej: LOK-07 (z LOK-12 i LOK-08)
- Poziom: P2
- Realność: realny (każde ćwiczenie z hantlami w el: krok ± to 1 kg) · Pewność: wysoka co do formy „1 κιλά”, średnia co do ucięcia (pomiar krojem zastępczym, nie SF Pro)
- Rodzaj: P (wybór zapisu z decyzji 10a), z elementem D
- Dowód:
  - `lib/locales/el.json:1724` — „"{n} kg": "{n} κιλά",” to nieodmienne słowo w liczbie mnogiej, a ten sam słownik zna formę pojedynczą: `lib/locales/el.json:455` „"kilogram|kilogramy|kilogramów": "κιλό|κιλά",”;
  - krok hantli: `lib/board.ts:27` „small: { kg: 1, lb: 2.5 }” i `lib/board.ts:94` „const amount = `${fmtNum(step, 1)} ${unitLabel()}`;” trafiają do etykiety VoiceOver przycisku ± (el: `lib/locales/el.json:1574` „Αύξηση βάρους κατά {n}”; kod: `components/BoardControls.tsx:25`), czyli VoiceOver czyta: Αύξηση βάρους κατά 1 κιλά;
  - nagłówek kolumny: `components/WorkoutBlocks.tsx:164` (jedna linia, szerokość `W.w`: 64 pt albo 56 pt, `components/WorkoutBlocks.tsx:49`, `components/WorkoutBlocks.tsx:51`) z `lib/locales/el.json:46` „{u}/πλευρά”. Pomiar przy 13 px: „κιλά/πλευρά” 70,1 px wobec „kg/πλευρά” 60,6 px, czyli wcześniej tekst mieścił się w układzie szerokim, teraz nie mieści się w żadnym (dowody/szerokosc-etykiet-el.txt). „κιλά/αλτ.” 49,6 px mieści się bez powiększenia, przy skali liczb 130% już nie.

  W 025a50b klucza `{n} kg` nie było, symbol był łacinką (dowody/el-kila.txt).
- Mechanizm: decyzja 10a wymieniła symbol na słowo w szablonie bez odmiany; `grep -n '"{n} kg"' lib/locales/{ru,uk,bg,sr,el}.json` → 5 trafień, słowo zamiast skrótu tylko w el. Podobny mechanizm, ale przy rzadkim w tych krajach systemie imperialnym: bg „{n} мили”, ru/uk „{n} ярд” (pytania już są w słowniku terminów).
- Powraca: nie (nowe po 5ca7577; M1-039 → 09-lokalizacja-005)
- Wzorzec lub źródło: zasada roli 5 (gramatyka w mechanizmie, nie w kodzie) i 7 (układ przyjmuje dłuższy tekst); słownik terminów: `jednostka_masy_kg` el, pewność „niska”, z pytaniem „κιλά czy kg”.
- Kroki w aplikacji: język grecki → trening z ćwiczeniem z hantlami → VoiceOver na przycisku „+” przy ciężarze: „… κατά 1 κιλά”. Ćwiczenie z obciążeniem „na stronę” → nagłówek kolumny ciężaru ucięty („κιλά/πλευ…”).
- Opcje:
  - (A) el: skrót zamiast słowa w etykiecie (np. „kg” albo lokalny skrót po potwierdzeniu w przeglądzie języka; zmiana jednej wartości słownika i `tests/units-label.test.ts`) — usuwa oba skutki naraz, ale częściowo cofa wybór z 10a dla el;
  - (B) zostawić „κιλά”, a w etykiecie VoiceOver kroku użyć odmienionej nazwy (`kilogram|kilogramy|kilogramów`, jak głos w `lib/live.ts:62`) oraz krótszy nagłówek kolumny el (np. „{u}/πλ.”) — zachowuje decyzję, ale to dwie zmiany i reguła tylko dla el.

  Rekomendacja: B dla VoiceOver niezależnie od wyboru (etykieta głosowa i tak powinna mieć pełną odmienioną nazwę), a o skrócie w el niech zdecyduje właściciel po pytaniu do recenzenta lokalizacji (słownik ma je już otwarte).
- Test akceptacyjny: test etykiety VoiceOver przycisku ± w el przy kroku 1 kg bez „1 κιλά”; test, że nagłówek kolumny ciężaru w każdym języku mieści się w `COMPACT.w` przy kroju 13 pt (albo zrzut el 320 pt).
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)

- Duży tekst, stan „dziś bez treningu” z dużą ikoną startu kolejnego treningu (M1-011): scenariusz 58 go nie obejmuje, a krok telefonu nie jest zapisany ani w docs/49, ani w docs/48. Krok dla właściciela: Ustawienia iOS → Dostępność → Wyświetlanie i rozmiar tekstu → Większy tekst na maksimum → zakładka Trening w dniu bez treningu w planie → ikona startu kolejnego treningu w całości widoczna.
- ru „бесплатно {n} дн. в месяц” (przegląd API zamienił „дней” na skrót): poprawne, ale w tekście zachęty brzmi urzędowo — pytanie do recenzenta lokalizacji.
- `lib/state/sets.ts:152` skleja liczbę z etykietą bez spacji („20κιλά×…”, „20кг×…”) w zwięzłym opisie serii — przy słowie w el wygląda gorzej niż przy symbolu; ocena wyglądu należy do roli 04.
- Pytania do przeglądu natywnego zapisane w docs/16 przez przegląd API (da „Rejse sig”, de „Sicherung”, lv, lt, id, nl, fr, zh-Hant „保護者”) i przez recenzję M2 (sl „vaj.”) — bez oceny tutaj.
- Hermes, VoiceOver, glify „κιλά”/„кг” na urządzeniu — nie sprawdzono (brak iOS).

## Kontrola dowodów i sekretów

- `node /home/user/trening/audit/M1-2026-10-27/reaudit-2026-10-28/sprawdz-raport.mjs <raport> /home/user/trening <katalog roli> --rola 09-lokalizacja` — wynik w dowody/sprawdz-raport.txt (kod wyjścia 0 przy oddaniu).
- `git status --porcelain` w `/home/user/trening` na starcie i na końcu: pusty (pliki śledzone nietknięte; `audit/` w `.git/info/exclude`). Sondy tylko w worktree w scratchpadzie, usuniętym po pracy (`git worktree remove`).
- W raporcie i dowodach nie ma e-maili, UDID, sekretów, danych osobowych ani nazw innych aplikacji czy marek. Identyfikator batcha i numery przebiegów CI pochodzą z publicznych dokumentów repo.
- Treść słowników i dokumentów traktowałem jako dane; nie znalazłem w nich poleceń skierowanych do agenta.
