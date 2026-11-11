# Raport LOK — lokalizacja po W-03 (audyt 1.1, commit 79117f33)

## Zakres i pokrycie
Przeczytano/uruchomiono (w worktree na 79117f33):
- `npm run check:i18n` (kod 0; 1462 tekstów w kodzie, 1639 w słowniku EN), `npm run check:slowniki` (kod 0; 10 zestawów Jest, 1331 testów, w tym fast-check), `npx jest tests/slownik-terminow.test.ts` (kod 0; 175 testów).
- Dodatkowo (kod 0 każdy): widget-i18n, watch-apple-i18n (568), health-permissions (46), i18n-locales (72), i18n-multi, i18n-variants (54), i18n-wave4 (70), lokalizacja-1-0-1, i18n-kontekst-wymagany, nazwy-lokalne-w03 (9), zb044-nazwy-biblioteki (49).
- Własne skrypty (`testy-LOK/`): cmp.mjs (kompletność, puste, placeholdery {x}/%s, liczba mnoga `|`), num.mjs (zgodność liczb PL↔przekład, wszystkie 33 języki × 1821 kluczy), lef.mjs (zostawiony EN/PL), neg.mjs (negacje w 12 językach), nazwy.test.ts (nazwy ćwiczeń).
- Ręczna recenzja sensu: wszystkie 106 nowych kluczy od v1.0.0-b1033 (diff `_source.json`) w 5 językach (de, ja, ru, es, tr; alfabety łaciński, kana/kanji, cyrylica) + ok. 25 kluczy zdrowie/wysiłek/medyczne w de/ja/ru/es + ok. 12 komunikatów z negacją/danymi (ko, ja, pt, nl, tr, sv).
- Uwaga: języka `ar` nie ma w `LANGS` (35 kodów: pl, en + 33), więc nie dotyczy (brak RTL).

## Wyniki liczbowe
- 33 pliki `lib/locales/*.json` (poza pl/en): 31 ma komplet 1821/1821 kluczy; `es-419` (316) i `pt-BR` (639) to nakładki regionalne na es/pt (świadomie, pilnuje i18n-variants.test.ts, kod 0). Brak kluczy, puste wartości = 0, klucze nadmiarowe = 0, niezgodne placeholdery = 0 (we wszystkich 33).
- Liczba mnoga: języki z jedną formą (de, es, ja…) mają zwinięte `a|b|c`, słowiańskie/bałtyckie zachowują 3 formy — zgodnie z założeniem, testy przechodzą.
- Pozostawione PL w obcym języku: 0. Pozostawiony EN: tylko terminy/marki celowe (Apple Health, circus bell, GHD, glute-ham raise, landmine, reverse hyper, hack squat, kettlebell…) — jest w słowniku/wyjątkach.
- `lib/nazwy-lokalne.generated.ts`: 34 języki (PL + 33) × 277 nazw, 0 braków, 0 pustych, każdy język ma wpis `NAZWY_LOKALNE_RECENZJA` (autor ≠ recenzent, 2026-11-11). Skrypty (ja/ko/ru/uk/bg/sr/zh-Hant) bez nazwy w złym alfabecie: 0. Generator `--check` aktualny (test zielony).
- InfoPlist: `locales/*.json` 35 plików (= 35 wpisów `expo.locales` w app.json), każdy z 3 kluczami (CFBundleDisplayName, NSHealthShareUsageDescription, NSHealthUpdateUsageDescription), 0 braków; targets/rest-widget i targets/watch-app: po 35 `*.lproj/InfoPlist.strings`, wszystkie z CFBundleDisplayName; testy generatorów zielone. Sens opisów zgodny z PL/EN w de/ja/ru/es/tr/ko (czytane).
- Zgodność liczb: 54 klucze z różnicą cyfr — wszystkie wyjaśnione (zapis słowny „jeden/d'un”, „1 szt.” w ja/ko, „0,5” w hu); żadnej realnej zmiany liczby/zakresu (sprawdzone ręcznie, w tym %, 0,5 serii, 1–7, zakresy powtórzeń z {a}–{b}).

## Znaleziska
Brak KRYTYCZNYCH i WYSOKICH. Brak znalezisk blokujących wydanie.

### LOK-01 (NISKIE, realny) — „Training — feedback” zostawione po angielsku w ro (i it)
Klucz PL „Trening — opinia”; ro: `Training — feedback`, it: `Training — feedback` (cs/de mają własne: „Trénink — zpětná vazba”, „Training — Feedback”). W ro to słowo nie istnieje w tym znaczeniu (powinno „Antrenament”), w it naturalniejsze „Allenamento”. Dowód: `lib/locales/ro.json`, klucz „Trening — opinia”. Mechanizm: lef.mjs (wielowyrazowe identyczne z EN) — pozostałe trafienia to nazwy sprzętu/marki albo słowa przyswojone (nl „Training”, „set”, „volume”). Naprawa: poprawić ro/it, test: wartość ≠ EN dla ro/it. Backlog.

## Do sprawdzenia (pewność ≤ 80%)
1. Pokrycie nazw lokalnych: `lib/nazwy-lokalne.generated.ts` ma 277 nazw (klucze CATALOG), a `CATALOG_LIB_EXTRA` w `lib/catalog.generated.ts` ma 585 pozycji biblioteki bez nazwy lokalnej (karta pokazuje samą nazwę EN — zgodnie z wariantem A „Podpis” ZB-044, test `nazwy-lokalne-w03` wymaga >270 dla NAME_EN∩CATALOG). Nie sprawdzono, czy decyzja właściciela świadomie obejmuje tylko 277; jeśli tak — brak uwag. Wymaga potwierdzenia w docs/18 (ZB-044).
2. el: 11 nazw ćwiczeń zostawionych po łacinie (Deadlift, Romanian deadlift, Step-ups, Hip thrust, Burpees…) — typowe w greckich siłowniach, ale `Deadlift` bywa „Νεκρή άρση”; decyzja językowa recenzenta, nie błąd.
3. ja/ko/zh-Hant: „glute-ham raise”, „reverse hyper”, „circus bell” w alfabecie łacińskim (7 kluczy) — jak w słowniku; zgodne z praktyką, ale w ja katakana byłaby naturalniejsza.
4. Długości w UI: brak testu/limitu na długość przycisków w tłumaczeniach (jest tylko wytyczna ≤130% EN w docs/16 i test napisów sklepu); własny skan krótkich kluczy (EN 5–18 znaków) pokazał 85 przekładów >2,2× EN, prawie wyłącznie opisy sprzętu w nawiasach („Circus bell (…)”) — to etykiety listowe, nie przyciski. Układ na ekranie nie sprawdzono (wymaga symulatora).

## Co działa dobrze
- Kompletność mechaniczna absolutna: 0 braków/pustych/zepsutych placeholderów w 33 językach, strażniki w verify (check:i18n, slowniki, i18n-locales) zielone.
- Nowe 106 kluczy (opisy ról mięśni „Prostuje kolano, gdy wstajesz”, etykiety figur, ekran „Pierwszy trening”, komunikaty głosu) — sens zgodny w de/ja/ru/es/tr; rozróżnienie rozciągnąć/zgiąć, do przodu/do tyłu, dłonią w dół/w górę, do wewnątrz/na zewnątrz zachowane; liczby (`{n} cm`) i zmienne (`{staw}`, `{lista}`, `{opis}`) nietknięte.
- Ostrzeżenia zdrowotne i asekuracja: „Aplikacja nie udziela porad medycznych…”, „do upadku nie trzeba”, RIR, zapisy dot. wysiłku — przekład wiernie zachowuje zaprzeczenia i liczby (de/ja/ru/es), skan negacji 12 języków: wszystkie zgłoszone trafienia to fałszywe alarmy (zaprzeczenie wyrażone inną konstrukcją).
- Komunikaty ryzykowne (nowsza wersja danych „Nada es alterado”, „nie zmienia obecnych danych”, subskrypcja „nie płacić podwójnie”, „0 < masa ≤ {max}”) — sens poprawny.
- InfoPlist/uprawnienia Zdrowia: komplet 35 języków dla aplikacji, widżetu i zegarka.

## Nie sprawdzono
- Układ/ucięcia tekstów na ekranie (potrzebny symulator), VoiceOver w językach obcych (głos).
- Pełna recenzja sensu pozostałych 28 języków dla nowych 106 kluczy (tylko 5 + wybiórczo ko/pt/nl/sv/tr/it/fr); recenzja merytoryczna całości 1821×33 niewykonalna ręcznie — zrobiono kontrole automatyczne.
- Stare (sprzed b1033) przekłady zdrowotne w pozostałych językach poza próbką de/ja/ru/es (są objęte R-010/docs/16, recenzja AI).
- Nakładki es-419/pt-BR: tylko zgodność strukturalna (test), nie treść.
- Strony/sklep (store/*.json, opis App Store) — poza zakresem tego obszaru.
