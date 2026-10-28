# Recenzja lokalizacji: „Szablony i plan” i „Pierwszy trening: duży przycisk „Pusty trening” u góry.” (28.10.2026)

Zakres: 34 słowniki `lib/locales/*.json` (bez `_source.json`), es-419 i pt-BR jako tekst efektywny (baza + nakładka; żaden z dwóch kluczy nie jest nadpisany w nakładce).
Gałąź: naprawy/M2-koordynator-napraw-2026-10-27-p3. Niczego nie zmieniano.

Kontekst (grep): oba teksty występują tylko w `components/Dashboard.tsx:106` i `:108` (karta „Pierwsze kroki” na ekranie Trening).
„Szablony i plan” to **mały przycisk nawigacyjny** (`Btn nav small`, przejście do `/plan`) pod krokiem 1, nie tytuł ani etykieta w linii tytułu.
W linii tytułu ekranu Trening (`app/(tabs)/index.tsx:46`) jest „Planowanie” / „Ustaw plan”, a nie ten klucz. Przycisk ma `alignSelf: flex-start`
w kolumnie `flex: 1`, więc może się zawinąć; najdłuższy wariant (el, 21 znaków) mieści się na 320 pt.

Sprawdzenia:
- Cudzysłów w kroku 3 = tłumaczenie klucza „Pusty trening”: **zgodne we wszystkich 34 słownikach** (sprawdzone skryptem: zawieranie podciągu).
- `npx jest tests/slownik-terminow.test.ts`: 109/109 zaliczonych.
- Terminy „Szablony”/„Plan”: zgodne z kluczami „Szablony” i „Plan” oraz ze słownikiem wszędzie poza fr (niżej).

## Poprawki

| język | klucz (polski) | obecnie | proponowane | powód | pewność |
|---|---|---|---|---|---|
| fr | Pierwszy trening: duży przycisk „Pusty trening” u góry. | `Première séance : le grand bouton « Séance vide » en haut.` (zwykłe spacje U+0020 przed „:” i wewnątrz « ») | ten sam tekst ze spacją nierozdzielającą U+00A0 przed „:”, po „«” i przed „»” (jak w sąsiednim kluczu „…„Start” u góry albo „Pusty trening”.”) | (d) typografia fr wg docs/16 | wysoka |
| zh-Hant | Pierwszy trening: duży przycisk „Pusty trening” u góry. | 第一次訓練：上方大的「空白訓練」按鈕。 | 第一次訓練：點上方的大按鈕「空白訓練」。 | (b) „上方大的…按鈕” brzmi sztucznie; szyk „大按鈕「…」” i czasownik „點” są naturalniejsze (to samo w kluczu z „Start”: 第一次訓練：點上方的大按鈕「開始」，或「空白訓練」。) | średnia |
| fr | Szablony i plan | Modèles et programme | bez zmiany w tekście; **rozbieżność ze słownikiem**: zalecany fr „Plan” (pewność średnia), ale fr.json ma „programme” w ok. 58 tekstach, a „Plan” tylko jako klucz „Plan” | (a) spójność: kolega na siłowni we Francji powie „programme”; decyzja należy do słownika (niżej), nie do tego klucza | do sprawdzenia przez native speakera |
| cs, sk | (sąsiedni tekst kroku 1) Utwórz pierwszy szablon albo wygeneruj szablony i plan. | cs: Vytvořte první šablonu nebo vygeneruj šablony a plán. / sk: Vytvorte prvú šablónu alebo vygeneruj šablóny a plán. | cs: …nebo vygenerujte šablony a plán. / sk: …alebo vygenerujte šablóny a plán. | (b) rejestr: w jednym zdaniu forma grzecznościowa i „ty”; ekrany cs/sk formalnie (docs/16); stoi bezpośrednio nad przyciskiem „Szablony i plan” | wysoka |
| pt-BR | Pierwszy trening: duży przycisk „Pusty trening” u góry. | Primeiro treino: o botão grande «Treino vazio» em cima. (z pt) | ewentualnie nakładka: Primeiro treino: o botão grande “Treino vazio” no topo. | (c)/(d) w Brazylii cudzysłowy “ ” i „no topo” w interfejsie; ale nakładka pt-BR ma już 56 tekstów z « » — zmieniać tylko całościowo | do sprawdzenia przez native speakera |

Pozostałe języki (bg, da, de, el, es, es-419, et, fi, hr, hu, id, it, ja, ko, lt, lv, ms, nb, nl, pt, ro, ru, sl, sr, sv, tr, uk, vi): oba teksty bez uwag.
Naturalne, terminy jak w kluczach „Szablony”/„Plan”, cudzysłowy jak w istniejących tekstach danego języka.

## Nowe terminy / zmiany w słowniku
- `plan`, fr: rozważyć zalecany „Programme” (obecny „Plan”, pewność średnia). Powód: fr.json konsekwentnie używa „programme” (ok. 58 tekstów),
  w tym w sąsiednim kroku 1 („…des modèles et un programme”); tylko klucz zakładki „Plan” ma „Plan”. Słownik i aplikacja są teraz rozjechane, a test tego nie łapie,
  bo „programme” nie jest terminem zakazanym.

## Pytania do native speakerów
1. fr: czy na ekranie z planem tygodnia ćwiczeń naturalniej brzmi „programme” czy „plan” (np. „Modèles et programme” czy „Modèles et plan”)?
2. pt-BR: czy w aplikacji brazylijskiej cudzysłów «Treino vazio» i „em cima” brzmią naturalnie, czy lepiej “Treino vazio” i „no topo”?

Podsumowanie: przeczytane 68 tekstów (2 klucze × 34 słowniki) + 3 sąsiednie klucze dla kontekstu; 3 poprawki (fr typografia, zh-Hant, cs/sk rejestr sąsiedniego tekstu), 2 pytania do native speakerów.
