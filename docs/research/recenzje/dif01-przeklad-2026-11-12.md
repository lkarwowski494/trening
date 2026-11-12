# Recenzja lokalizacji: DIF-01 („Co nowego” 1.1, nazwy lokalne ćwiczeń), 33 języki, 12.11.2026

- autor: przekład API (przeklad-tlumaczen.yml 43117339440), nałożył programista sesji Y
- recenzent: recenzent-lokalizacji (subagent, niezależny)
- data: 12.11.2026
- stan repo: gałąź `naprawy/w11b-1-1`, commit `a378a224` (różnice: `git show a378a224 -- lib/locales`)

## Tekst

- PL: „Nazwy ćwiczeń z biblioteki są po angielsku, jak na większości siłowni. Przy wielu ćwiczeniach na karcie pod nazwą widać też nazwę w Twoim języku, a wyszukiwarka znajduje je po obu nazwach.”
- EN: „Library exercise names are in English, as in most gyms. For many exercises, the card also shows the name in your language below it, and search finds them by either name.”
- Miejsce: `lib/whatsnew-wpisy.ts:27` — trzeci punkt wpisu 1.1 w panelu „Co nowego” (pokazywany tylko poza angielskim), także pole whatsNew w sklepie (`scripts/store-whatsnew.mjs`). Sąsiednie punkty: rysunki ruchu, wskazówki techniki, zapowiedzi głosowe, nowa osoba, nazwa aplikacji.
- Sens do zachowania: nazwa lokalna jest tylko przy części ćwiczeń (248–276 z 708 według `_opis` zestawu) — „przy wielu”, bez liczb.

## Metoda

1. Odczyt tłumaczeń 33 języków z `lib/locales/<kod>.json` (pt-BR i es-419: klucz jest w nakładce, więc tekst efektywny = nakładka).
2. Porównanie z sąsiednimi punktami „Co nowego” 1.1 w tym samym słowniku (rysunki ruchu, głos) oraz z kluczami „Nazwy ćwiczeń z biblioteki są po angielsku we wszystkich językach poza polskim.”, „Usuń z biblioteki”, „Szukaj ćwiczenia…” i z innym użyciem „karty” („Zakończ trening” w karcie po ostatniej serii) — spójność terminów „biblioteka”, „karta”, „wyszukiwarka/szukaj”.
3. Rejestr: tabela w `docs/16-jezyki-i-marka.md` (ekrany formalne w bg, cs, el, hr, hu, lt, lv, pt, ro, sk, sl, sr, tr, uk, ru, fr; „ty” w de, it, nl, sv, da, nb, fi, es, es-419, et, zh-Hant; „Anda/anda/bạn”; pt-BR „você”; ja です/ます, ko -니다).
4. Słownik terminów `docs/lokalizacja/slownik-terminow.json` (pojęcia `cwiczenie`, `szablon`), strażnik `npx jest tests/slownik-terminow.test.ts` — 175/175 zielone.
5. Kryteria: sens „przy wielu, nie przy każdym” (f), rejestr i naturalność (b), warianty regionalne (c), typografia (d), długość (e), brak nazw źródeł/organizacji/innych aplikacji.

## Wynik — 33 języki

| język | ocena | nowe brzmienie (gdy poprawka) | powód (kategoria) | pewność |
|---|---|---|---|---|
| bg | ok | — | „При много упражнения”, „вашия” (formalnie), „търсенето” jak „Търсене на упражнение…” | — |
| cs | ok | — | „U mnoha cviků”, „vašem”, „knihovna” jak w sąsiednich punktach | — |
| da | ok | — | „Ved mange øvelser”, „dit sprog”; naturalne | — |
| de | poprawka | Die Übungsnamen in der Bibliothek sind auf Englisch, wie in den meisten Fitnessstudios. Bei vielen Übungen steht auf der Karte unter dem Namen auch der Name in deiner Sprache, und die Suche findet sie unter beiden Namen. | (b) „auf der Karte darunter” — „darunter” nie ma do czego się odnieść (nazwa nie padła wcześniej w zdaniu) i może czytać się jako „wśród nich”; „unter dem Namen” jednoznaczne | średnia |
| el | poprawka | Τα ονόματα των ασκήσεων της βιβλιοθήκης είναι στα αγγλικά, όπως στα περισσότερα γυμναστήρια. Σε πολλές ασκήσεις, η κάρτα δείχνει κάτω από το όνομα και το όνομα στη γλώσσα σας, και η αναζήτηση τις βρίσκει και με τα δύο ονόματα. | (a/b) „καρτέλα” w greckim iOS i w tym słowniku znaczy „zakładka” („στην καρτέλα Πρόγραμμα”, 12 użyć); karta to „κάρτα” (jak „στην κάρτα μετά το τελευταίο σετ”) | wysoka |
| es | ok | — | „En muchos ejercicios”, „tu idioma”, „la ficha” naturalne dla karty ćwiczenia w Hiszpanii, „el buscador” | — |
| es-419 | ok | — | „la tarjeta” (jak w innym zdaniu es-419), „la búsqueda”; bez słów europejskich | — |
| et | ok | — | „Paljude harjutuste”, „sinu keeles” (sina jak w docs/16), „Teegi” jak w sąsiednich punktach | — |
| fi | poprawka | Kirjaston liikkeiden nimet ovat englanniksi, kuten useimmilla saleilla. Monen liikkeen kortissa näkyy nimen alla myös nimi omalla kielelläsi, ja haku löytää liikkeen kummallakin nimellä. | (b) „Monessa liikkeessä kortilla” — „w wielu ruchach, na karcie” brzmi jak kalka; „Monen liikkeen kortissa” = „na karcie wielu ćwiczeń”, a „kortissa” jak w drugim zdaniu fi o karcie („kortissa viimeisen sarjan jälkeen”) | średnia |
| fr | ok | — | „Pour de nombreux exercices”, „votre langue” (vous), „la fiche” naturalne; brak znaków ; : ! ? wymagających spacji; apostrof ’ jak w pliku | — |
| hr | ok | — | „Kod mnogih vježbi”, „vašem”; „biblioteke” jak w sąsiednich punktach 1.1 (uwaga poboczna niżej) | — |
| hu | ok | — | „Sok gyakorlatnál”, „a saját nyelvén” (forma ön), „könyvtár” spójne | — |
| id | ok | — | „Untuk banyak gerakan”, „Anda”, „gerakan” i „pustaka” zgodne ze słownikiem i sąsiednimi punktami | — |
| it | poprawka | I nomi degli esercizi della libreria sono in inglese, come nella maggior parte delle palestre. Per molti esercizi, nella pagina dell’esercizio sotto il nome vedi anche quello nella tua lingua, e la ricerca li trova con entrambi i nomi. | (a) „scheda” to w słowniku i w całym it.json termin na **szablon** (pojęcie `szablon`: zalecany „Scheda”; 59 użyć: „+ Nuova scheda”, „Archiviare la scheda?”); „nella scheda” sugeruje, że nazwa jest w szablonie | wysoka (konflikt terminu); dobór „pagina dell’esercizio” — średnia |
| ja | poprawka | ライブラリの種目名は、ほとんどのジムと同じく英語表記です。多くの種目では、カードの名前の下に日本語名も表示され、どちらの名前でも検索できます。 | (b/f) „多くのジムと同じく” = „jak w wielu siłowniach”, a PL/EN mówią „w większości”; dwa razy „多く” w sąsiednich zdaniach; „どちらの名前でも検索できます” krótsze i naturalniejsze | do sprawdzenia przez native speakera (pytanie 2) |
| ko | ok | — | „많은 종목은”, „한국어 이름”, styl -니다 | — |
| lt | ok | — | „Daugelio pratimų”, „jūsų” (formalnie) | — |
| lv | ok | — | „Daudziem vingrinājumiem”, „jūsu”, „kartītē” | — |
| ms | ok | — | „Bagi banyak senaman”, „anda”, „senaman” zgodne ze słownikiem | — |
| nb | ok | — | „For mange øvelser”, „det norske navnet” naturalne (słownik nb = norweski), „øvelseskortet” | — |
| nl | ok | — | „Bij veel oefeningen”, „jouw taal” (je/jij), „met zoeken vind je ze” potoczne | — |
| pt | poprawka | Os nomes dos exercícios da biblioteca estão em inglês, como na maioria dos ginásios. Em muitos exercícios, o cartão mostra também, por baixo do nome, o nome no seu idioma, e a pesquisa encontra-os por qualquer um dos dois. | (a/b) „ficha” na siłowni w Portugalii to plan/szablon treningu (uwaga przy pojęciu `szablon` dla pt w słowniku); w pt.json karta to „cartão” („no cartão após a última série”) | średnia |
| pt-BR | poprawka | Os nomes dos exercícios da biblioteca estão em inglês, como na maioria das academias. Em muitos exercícios, o cartão também mostra o nome no seu idioma logo abaixo, e a busca encontra o exercício por qualquer um dos dois nomes. | (a/c) samodzielne „card” to jedyne takie użycie w pt-BR (inne trafienia to „cardio”, „cardíaca”); w pt-BR karta to „cartão” („no cartão após a última série”) — spójność terminu | do sprawdzenia przez native speakera (pytanie 1) |
| ro | ok | — | „La multe exerciții”, „dvs.” (formalnie), „fișa” zrozumiałe; „căutarea” | — |
| ru | ok | — | „У многих упражнений”, „вашем”, „как в большинстве залов” potoczne | — |
| sk | ok | — | „Pri mnohých cvikoch”, „vašom” | — |
| sl | ok | — | „Pri številnih vajah”, „vašem”, „fitnesov” potoczne | — |
| sr | ok | — | „Код многих вежби”, „вашем”, cyrylica, „пише и назив” potoczne | — |
| sv | ok | — | „För många övningar”, „ditt språk”, „på de flesta gym” | — |
| tr | ok | — | „Birçok egzersizin”, „kendi dilinizdeki” (siz), „Kütüphanedeki” jak w sąsiednim punkcie 1.1 (uwaga poboczna niżej) | — |
| uk | ok | — | „Для багатьох вправ”, „вашою мовою” | — |
| vi | ok | — | „Với nhiều bài tập”, „của bạn”, „để bằng tiếng Anh” jak w kluczu ustawień | — |
| zh-Hant | ok | — | „許多動作”, „中文名稱”, „動作庫” spójne; pełnoszerokie „，” i „。” | — |

Sens „przy wielu, nie przy każdym” jest zachowany we wszystkich 33 językach (żaden nie mówi „przy każdym” ani nie podaje liczby). Parametrów brak. Brak nazw źródeł, organizacji i innych aplikacji. Długość: punkt listy w panelu z zawijaniem wierszy, bez ryzyka obcięcia; whatsNew sklepu ma limit 4000 znaków — bez znaczenia.

## Pytania do native speakerów

1. pt-BR: na karcie ćwiczenia w aplikacji — „o cartão” czy „o card” brzmi naturalniej dla brazylijskiego użytkownika?
2. ja: „ほとんどのジムと同じく英語表記です” czy obecne „多くのジムと同じく英語で表記しています” — które brzmi naturalniej w notce „Co nowego”?

## Nowe terminy do słownika (dla koordynatora/programisty, z testem)

- **karta ćwiczenia** (ekran szczegółów ćwiczenia): it — zakazane „scheda” w znaczeniu karty (koliduje z `szablon` = „Scheda”), zalecane „pagina dell’esercizio”; el — zalecane „κάρτα”, zakazane „καρτέλα” w znaczeniu karty (= zakładka); pt/pt-BR — zalecane „cartão”, „ficha” odradzane (na siłowni = plan treningu). Powód: ten sam błąd wrócił w dwóch językach przy pierwszym tekście o karcie ćwiczenia.

## Uwagi poboczne (poza zakresem DIF-01, do backlogu tłumacza)

- hr: „biblioteka” w punktach „Co nowego” i kluczu ustawień, ale „knjižnica” w „Obriši iz knjižnice” — niespójny termin biblioteki w hr.json.
- tr: „Kütüphane” w punktach 1.1 i „Kütüphaneden sil”, ale „Kitaplıktaki” w kluczu „Nazwy ćwiczeń z biblioteki są po angielsku we wszystkich językach poza polskim.” — niespójny termin w tr.json.

## Podsumowanie

33 teksty przeczytane: 26 ok, 7 poprawek (el i it — wysoka pewność, konflikt terminu; de, fi, pt — średnia; pt-BR, ja — do sprawdzenia przez native speakera), 2 pytania do native speakerów. Strażnik słownika zielony (175/175), więc obecne błędy el/it nie są wykrywane automatycznie — patrz „Nowe terminy”.

## Naniesienie (12.11.2026, programista sesji Y)

7 poprawek naniesionych dosłownie (el, it, de, fi, pt, pt-BR, ja); whatsNew sklepu przeliczony (`store-whatsnew --write`). Słownik terminów, pytania do native speakerów i hr/tr → backlog docs/21 („przekład DIF-01”).
