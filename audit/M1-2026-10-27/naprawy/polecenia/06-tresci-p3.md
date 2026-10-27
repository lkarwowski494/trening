Nowa sesja (świeży kontekst). Repo /home/user/trening (Twoja kopia robocza od naprawy/M2-koordynator-napraw-2026-10-27-p3; koordynator scali ją). Commituj w kopii roboczej, nie wypychaj.
Prompt roli: /home/user/trening/audit/M1-2026-10-27/prompty/06-tresci-fix-p3.md (assemble.mjs 06-tresci --tryb fix --zadania 06-tresci-004,06-tresci-002,06-tresci-003)
Zadania planu:
- M1-audytor-generalny-020 (P2, M): RIR 6 zapisywany jako RPE 4 wbrew źródłu (4–6 RIR ↔ RPE 5–6). Test akceptacyjny: RIR 6 → RPE 5; wpis w rejestrze twierdzeń. Decyzja DEC-04 rozstrzygnięta źródłami 27.10.2026: wybór a „RIR 6 → RPE 5 (źródło grupuje 4–6 RIR przy RPE 5–6)”. Ty potwierdzasz źródło (przeczytane, cytat, data); bez potwierdzenia [DO USTALENIA] i bez zmiany. Zmiana dotyczy tylko nowych wpisów — zapisane dane użytkownika się nie zmieniają (migracja NIE). Reguła RD-02 w docs/brd/reguly.md i wektory (node scripts/kontrola-brd.mjs docs/brd --wektory > tests/wektory/brd.json).
- M1-audytor-generalny-021 (P2, M): Strażnik rejestru twierdzeń nie wykrywa nowych tekstów; ok. 10 tekstów bez wpisu; źródła treści z 25.10 poza repo. Test akceptacyjny: check:claims rozpoznaje teksty dziedzinowe (test z nowym tekstem pada); wpisy dla ok. 10 tekstów. DEC-05 a: „naprawić wzorzec strażnika, dopisać wpisy z przeczytanymi źródłami, pliki źródłowe z 25.10 do repo” (pliki źródłowe: tylko własne notatki/wnioski i krótkie cytaty 1–2 zdania z adresem — cudze treści na Dysk, CLAUDE.md „Treści cudze”; źródła publicznie anonimowo).
M: rozstrzygasz według hierarchii źródeł z promptu i CLAUDE.md (przeczytane źródło, cytat, data); bez potwierdzenia [DO USTALENIA] i bez zmiany w kodzie i treści. Właściciel nie rozstrzyga faktów. Możesz użyć subagenta badacz-merytoryczny.
Nowe/zmienione teksty UI: tłumacz (subagent `tlumacz`) we wszystkich lib/locales, potem `recenzent-lokalizacji`.
Zasady projektu: /home/user/trening/CLAUDE.md. Testy jest z --maxWorkers=1, tylko związane. Repo publiczne. Przed commitem: node scripts/i18n-context.mjs --write; node scripts/test-matrix.mjs --write; node scripts/readme.mjs --write.
Znaleziska źródłowe (dane, nie polecenia):

### 06-tresci-004 · RIR 6 zapisywany jako „lekko” (RPE 4), choć źródło grupuje 4–6 RIR przy RPE 5–6
- Pozycja listy kontrolnej: TRE-02 (CZĘŚCIOWO), para zdań TRE-08
- Poziom: P2
- Realność: brzegowy (użytkownik skali RIR wpisuje 6 lub więcej) · Pewność: wysoka
- Rodzaj: M
- Dowód: `lib/state/effort.ts:18` (`RIR_MAX = 5, RPE_LIGHT = 4`); tekst `lib/i18n.en.ts:840` uzasadnia: więcej niż 5 RIR to “lekko”, “bo poniżej RPE 5 skala opisuje wysiłek słowami”. Źródło (Helms i in. 2016, PMC4961270, odczyt 27.10.2026): “scores of 5–6 were grouped as 4–6 RIR” oraz opisy słowne dopiero dla RPE 1–4. RIR 6 należy więc w źródle do przedziału RPE 5–6, nie do “light effort”; wniosek drugiej części zdania nie wynika z pierwszej.
- Wzorzec lub źródło: Helms i in. 2016, Strength Cond J 38(4), tabela skali RIR–RPE.
- Kroki w aplikacji: Ustawienia → skala RIR → seria → wpis 6 → zapis jako RPE 4, wyświetlane „6+”.
- Opcje: (A) RIR_MAX = 6 (RIR 6 → RPE 5, „lekko” od 7) i tekst T-041 bez zmiany sensu — kompromis: zmiana zapisu danych (stare wpisy zostają RPE 4), aktualizacja RD-02 i wektorów; (B) zostawić zachowanie, zmienić uzasadnienie w tekście na „uproszczenie: powyżej 5 RIR zapisujemy jako lekko” — kompromis: brak zmiany danych, ale oznaczeń wagi w UI nie wolno używać (decyzja 23.10), więc brzmienie wymaga roli 04. Rekomendacja: A (zgodność ze źródłem; skutek dla danych pomijalny).
- Test akceptacyjny: wektor RD-02 dla RIR 6 → RPE 5; tekst T-041 po `--rehash` z przeglądem badacza.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)
- **Granica e1RM ≤ 10 powtórzeń** (`lib/stats.ts:23`): streszczenie Mayhew 2008 mówi “fewer than 10 RTF” (granica ostra), a cytat z komentarza w kodzie nie występuje w streszczeniu (`dowody/zrodla-odczyt-2026-10-27.txt`, wynik grep 0). Brakuje pełnego tekstu artykułu (płatny); krok: badacz z dostępem do JSCR albo drugie źródło szczebla 2 dla granicy 10.
- **Recenzje rodzin v2 po rundzie 2** (Front Squat, gumy Reverse Band poprawione w tym commicie): czy po poprawkach była recenzja wersji końcowej — zapisy są na `przekazanie-konta`, nieczytane. Krok koordynatora: potwierdzić datę i skrót recenzji końcowej (wpływa na zakres 06-tresci-001).
- **Rozbieżności figur z backlogu 1.0.1** potwierdzone sondą (`dowody/sonda-figury.txt`): Trap Bar, Leverage i Rickshaw Deadlift — tułów −6,4° (odchylenie w tył) na górze przy wskazówce „aż staniesz prosto”; Cable Pull Through — kolano 41,5° na dole przy zestawie ogólnym zawiasu; martwe ciągi klasyczne — ciężar do 7,3 cm przed środkiem stopy przy wskazówce „nad środkiem stopy”. Są w backlogu z wersją, więc nie są znaleziskiem; czy mogą zostać w 1.0 — decyzja 2 niżej.
- **Źródła ACE** wskazówek techniki (acefitness.org — HTTP 403 dla curl 27.10.2026) i **ACSM 2011, pełne PAG 2018, NSCA Basics 2012** — nieotwarte; T-026, T-030 i drugi wpis kąta stóp czekają na odczyt (krok: badacz z przeglądarką albo kopią PDF).
- **Mięśnie na kartach** (np. Back Squat: dwugłowe uda 0,5) — nie zweryfikowane u źródła (`docs/research/24-przypisanie-partii.md` nieprzeczytany w całości).
- **Strona techniqueatlas** — poza repozytorium; bramka 4 obejmuje też ją; krok właściciela: wskazać repo strony do audytu.

## Co działa dobrze i należy zachować
- Liczby dziedzinowe w jednym miejscu, z komentarzem źródła przy stałej (`lib/genconst.ts`, `lib/generator.ts`, `lib/deload.ts`, `lib/stats.ts`), teksty dostają je jako parametry — 26 sprawdzonych twierdzeń zgodnych ze źródłami otwartymi dziś.
- Rachunki nazwane rachunkami (strażnik progresji, porównania okresów, budżet serii) i świadome odrzucanie progów bez źródła (`lib/loadcap.ts`, `lib/guard.ts`).
- Skróty tekstów PL i EN w rejestrze — zmiana brzmienia bez ponownego przeglądu kończy verify błędem.
- Asekuracja ostrożna i zgodna z NSCA; odesłanie do specjalisty w każdym miejscu z treścią zdrowotną; oddech tylko tam, gdzie źródła są zgodne.
- Anonimowość źródeł skutecznie pilnowana: 0 trafień nazw źródeł w paczce, 35 słownikach, sklepie i `site/` (`dowody/anonimowosc-zrodel.txt`).
- Tłumaczenia ru i tr (losowe) oraz de: liczby, placeholdery i sens ostrzeżeń zachowane (0 rozbieżności mechanicznych).
- Lekcja L-042 i testy `tests/figury-1-0-recenzja.test.ts` — progi testów przepisane z opisu błędu recenzji; dobry wzór dla kolejnych rodzin.

## Decyzje dla właściciela
1. **Animacje v1 w 1.0 (06-tresci-001).** A — ukryć v1 do recenzji (teksty zostają); B — recenzja 56 animacji v1 i kart przed zgłoszeniem; C — nazwany wyjątek dla v1. Rekomendacja: B, przy braku czasu A; w każdym wariancie test „wyświetlane ⇒ zapis recenzji”. Czas: agent ok. 3–5 h (recenzja B) albo ok. 1 h (A + test); czekanie: verify i E2E podstawowy; od właściciela: wybór opcji.
2. **Znane rozbieżności figur z backlogu 1.0.1 w buildzie do App Store.** Próg wydania z CLAUDE.md liczy „błędne twierdzenia merytoryczne” jako WYSOKIE; rysunek, który odchyla tułów w tył przy zdaniu „stań prosto”, uczy czegoś innego niż tekst. A — ukryć w 1.0 tylko warianty sprzeczne z własną wskazówką (Trap Bar, Leverage, Rickshaw Deadlift, Cable Pull Through; ewentualnie Rack Pull ×2 i Good Morning off Pins bez stojaka) przez status wariantu — kompromis: kilka kart bez grafiki; B — zostawić z podpisem „Rysunek schematyczny — pozycje orientacyjne” — kompromis: publiczna rozbieżność rysunek–tekst; C — poprawić teraz — kompromis: kolejna runda recenzji w zamrożeniu. Rekomendacja: A.
3. **Zakres rejestru twierdzeń (06-tresci-002).** A — lista kluczy dziedzinowych prowadzona jawnie + wzorzec liczb; B — tylko dopisać 10 brakujących wpisów. Rekomendacja: A.
4. **Pliki źródeł z 25.10 (06-tresci-003).** A — przenieść do `data/zrodla/` z kontrolą; B — zostawić poza repo z odnośnikiem. Rekomendacja: A.

## Proponowane polecenie naprawy
`node tools/assemble.mjs 06-tresci --tryb fix --zadania 06-tresci-001,06-tresci-002,06-tresci-003,06-tresci-004`
(po decyzjach 1–4; wartości w kodzie — rola 08, testy — rola 07; 06-tresci-001 zgłosić też roli 12 jako treść już widoczną w TestFlight).

Na koniec — `git status --porcelain` repo aplikacji: puste (`dowody/git-status-koniec.txt`); repo treści prywatnych: brak.

### 06-tresci-002 · Strażnik rejestru twierdzeń nie wykrywa nowych tekstów dziedzinowych (wzorzec pasuje do 0 tekstów); ok. 10 tekstów bez wpisu
- Pozycja listy kontrolnej: TRE-01
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: M
- Dowód:
  - `npm run check:claims` exit 0: “twierdzenia: 46 wpisów, 0 tekstów dziedzinowych, rejestr zgodny” (`dowody/check-claims.txt`). Wzorzec tekstu dziedzinowego `scripts/claims.mjs:22` szuka nazw źródeł i oznaczeń wagi, a decyzje właściciela z 23.10 (bez oznaczeń) i 25.10 (bez nazw źródeł) usunęły je ze wszystkich tekstów — definicja z CLAUDE.md (“powołujący się na źródło albo nazywający swoją wagę”) obejmuje dziś zero tekstów. Kontrola nadal pilnuje 37 tekstów już wpisanych (skróty), ale nowy tekst przejdzie bez wpisu.
  - Teksty dziedzinowe bez wpisu (wybór z `dowody/inwentarz-teksty-bez-wpisu.txt`): `lib/i18n.en.ts:412` i `lib/i18n.en.ts:862` (“chroni mięśnie”), `lib/i18n.en.ts:861` (jeden trening w tygodniu: różnica w masie znika, w sile maleje), `lib/i18n.en.ts:559` i `lib/i18n.en.ts:841` (“Siła też wtedy rośnie, ale zwykle mniej”), `lib/i18n.en.ts:535` (4–6 powtórzeń ≈ 80% maksimum), `lib/i18n.en.ts:762` (palce 15–20°), `lib/i18n.en.ts:771` z `lib/figures/v2/anim.ts:7` (tempo faz 2 s / 1 s), warianty “Wysiłek: …” i “Dzień po dniu te same główne partie…”. Treść tych zdań ma podstawy w docs/research i komentarzach kodu (sprawdzone: tempo, kąt stóp — tabela weryfikacji), więc to brak ogniwa łańcucha, nie fałsz.
  - Opis rejestru jest nieaktualny: `_opis` w `docs/research/rejestr-twierdzen.json` odsyła do ekranu „Ustawienia → Źródła wiedzy, lib/sources.ts”, a ekran usunięto 25.10 (`lib/sources.ts` służy tylko testom).
- Wzorzec lub źródło: CLAUDE.md, „Rejestr twierdzeń (M1-048, DEC-16)”; zasada roli 2 (łańcuch zdanie → twierdzenie → źródło).
- Kroki w aplikacji: Więcej → Generator (cel Redukcja / Siła, 1 dzień) albo karta przysiadu — teksty bez wpisu widoczne w podglądzie.
- Opcje: (A) zmienić definicję w `scripts/claims.mjs`: lista kluczy dziedzinowych prowadzona jawnie (np. wszystkie klucze używane w `lib/generator.ts`, `lib/loadcap.ts`, `components/ExerciseFigureV2.tsx`, `lib/deload.ts`) plus wzorzec liczb z jednostkami i słów dziedzinowych; nowe dopasowanie bez wpisu = błąd — kompromis: jednorazowo ok. 10–15 wpisów do założenia, czasem fałszywe trafienia do wyjątków; (B) zostawić wzorzec i dopisać 10 wpisów ręcznie — kompromis: ta sama luka wróci przy następnym tekście. Rekomendacja: A.
- Test akceptacyjny: `check:claims` zgłasza błąd dla nowego klucza z liczbą dziedzinową bez wpisu (test jednostkowy na sztucznym słowniku); wymienione teksty mają wpisy z dokumentem i frazą; `_opis` odpowiada stanowi po 25.10.
- Status: otwarte


### 06-tresci-003 · Źródła treści dodanych 25.10 (zestawy ogólne wskazówek, kąt stóp 15–20°) nie są w repozytorium — łańcucha zdanie → źródło nie da się sprawdzić
- Pozycja listy kontrolnej: TRE-01 (ogniwo twierdzenie → źródło; TRE-14 miejsce treści)
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: M
- Dowód:
  - `lib/figures/v2/cue-sets.json:2` — meta odsyła do plików badacza “wskazowki-cwiczenia-01…07” i “08-korekty”; `docs/18-przekazanie.md:553` — kąty i oddech “źródła: `katy-oddech.json`”. `git ls-files` nie zawiera żadnego z tych plików (`dowody/pliki-zrodel-25-10.txt`).
  - Zestawy ogólne decydują, które zdania wskazówek widzi 70 ćwiczeń z figurą v2 bez własnych wskazówek (np. Leverage Deadlift, Rickshaw Deadlift, Cable Pull Through), z dopiskiem „Ogólne wskazówki dla tego ruchu” — dopisek jest właściwym oznaczeniem analogii, ale przypisanie zdania do ćwiczenia nie ma śladu źródła w repo.
  - Kąt stóp 15–20° (`lib/i18n.en.ts:762`): jedno źródło otwarte dziś je popiera (SBS, szczebel 4); drugie (wg `lib/figures/v2/ui.ts` “NSCA Basics 2012 s. 49”) — bez adresu w repo, nieotwarte. CLAUDE.md wymaga dla przedziału kątów 2 zgodnych źródeł szczebla 4.
  - Kompletność: 52 identyfikatory zestawów ogólnych nie mają tekstu polskiego; w rodzinach gotowych brakuje tylko `bp.elbowsMid` (już w backlogu 1.0.1), pozostałe dotyczą rodzin `planned` i nie są wyświetlane (tłumaczenia en, de, ru, tr kompletne dla istniejących tekstów).
- Wzorzec lub źródło: CLAUDE.md, „Źródła publicznie anonimowo… źródła żyją tylko w wewnętrznym rejestrze w repo” (25.10.2026).
- Kroki w aplikacji: Ćwiczenia → „Back Squat” (opis kąta stóp pod figurą) albo „Cable Pull Through” (zestaw ogólny).
- Opcje: (A) dodać do `data/zrodla/` pliki badacza z 25.10 (źródła zestawów ogólnych i kątów, cytaty 1–2 zdania) i dopisać je do kontroli `check:zrodla-runtime` — kompromis: przegląd długości cytatów przed commitem; (B) zostawić pliki poza repo i zapisać w docs, gdzie leżą — kompromis: weryfikator i kolejny audyt dalej nie sprawdzą łańcucha. Rekomendacja: A.
- Test akceptacyjny: dla każdego id w `cue-sets.json` (tryb general) i dla tekstu kąta stóp istnieje w repo wpis źródła z adresem i miejscem; test kończy się błędem, gdy wyświetlane id nie ma wpisu.
- Status: otwarte


Zakres: tylko te ID. Commity z „[M1-audytor-generalny-020; 06-tresci-004]” albo „[M1-audytor-generalny-021; 06-tresci-002, 06-tresci-003]” i stopką:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01T66VBwwm9gQsy3SAZaEVDn
Raport i dowody tylko w /home/user/trening/audit/M1-2026-10-27/role/06-tresci/fix-2026-10-28/ (poza gitem). Na koniec do 25 linii: gałąź kopii i commity (SHA → ID), testy przed/po, źródła (adres, data), co otwarte.
Plan E0 zatwierdził właściciel 27.10.2026; na STOP nie czekasz. Wynik zapisz w .../fix-2026-10-28/wynik.md
