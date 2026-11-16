# RepsGoat — plan dotarcia na 6 tygodni po wydaniu 1.1 (wersja 2, szkic)

Przygotował agent marketingu, 16.11.2026. Nic nie zostało opublikowane ani wysłane. Każdy film, link i wpis w App Store Connect zatwierdza i wykonuje właściciel.
Zastępuje szkic z 16.11.2026 (`plan-dotarcia-repsgoat.md`) po decyzjach właściciela z tego samego dnia. Plik nie zawiera nazw społeczności, twórców ani danych osobowych.

## 1. Stan i decyzje (16.11.2026)

- **1.1 zgłoszona do recenzji Apple 16.11.2026.** Po akceptacji wychodzi sama, od razu dla wszystkich (`docs/49-wydanie-1-1.md:74-75`: W-29 bez wydania stopniowego, W-30 „Automatically release”). **T0 = dzień akceptacji**, daty nie znamy i jej nie zgadujemy.
- Nazwa i zrzuty RepsGoat są już w sklepie (32 lokalizacje, W-22 i W-23 w `docs/49-wydanie-1-1.md:67-68`). Słowa kluczowe i metadane zostają bez zmian do następnej wersji.
- **Punkt wyjścia (App Analytics do 14.11, stara karta „Trening”):** 16 pierwszych pobrań, 274 wyświetlenia, 79 odsłon karty; Polska: 65 odsłon i 10 pobrań.
- **TikTok, stan faktyczny:** konto należy do właściciela. Wcześniej wrzucił ok. 8 filmów o treningu, każdy miał ok. 1 tys. wyświetleń, a pobrań nie widać. Nie był to jednak czysty test, bo aplikacja nazywała się „Trening” (nie dało się jej wyszukać) i nie było linku kampanii. Nie wiemy, czy filmy pokazywały aplikację (pytanie F1).

**Decyzje właściciela (wiążące):**
1. TikTok: jeden test rozstrzygający, 3 filmy w 3 tygodnie od T0, z nazwą RepsGoat i linkiem kampanii w profilu. Jeśli kampania nie przekroczy progu Apple (5 pobrań od różnych osób), kanał zamykamy z dowodem.
2. Społeczności: nie w tym cyklu. Przez 6 tygodni nie piszemy do żadnej administracji. Wolno tylko przygotować listę miejsc i regulaminów na następny cykl.
3. Pomiar: 3 linki kampanii, po jednym na kanał.
4. Bez strony niestandardowej, link prowadzi do zwykłej karty.
5. Wydarzenie w App Store „duża aktualizacja” dla 1.1: tak (szkic: `wydarzenie-1-1-szkic.md`).
6. Ocena po 6 tygodniach jest jakościowa: który kanał przekroczył próg 5 pobrań i co pokazał test pierwszego użycia (ZB-009, `docs/zobowiazania.md:23`).

Odrzucone w poprzednim szkicu: TikTok jako centrum (6–12 filmów), strona niestandardowa, pytania o zgodę do społeczności w tym cyklu, token na każdy film, liczbowy próg oceny.

**Ryzyko (jedno zdanie):** 3 filmy to mała próba, a widz, który wpisze nazwę w sklepie zamiast kliknąć link, nie liczy się do kampanii. Wynik „poniżej progu” zamknie więc kanał przy słabszym dowodzie, niż sugeruje sama liczba.

## 2. Trzy linki kampanii (propozycja do potwierdzenia)

Strona Apple „Campaign links” (odczyt 16.11.2026, cytaty w poprzednim szkicu, sekcja 2): kampania pokazuje się w danych po co najmniej 24 h i dopiero przy pierwszych pobraniach od co najmniej 5 osób; nazwa kampanii jest tokenem.

| Token | Kanał | Uwagi |
|---|---|---|
| `tiktok` | link w profilu TikTok | jedyny link w profilu przez cały test |
| `www` | strona aplikacji na apps4brew.com | dziś w `site/` nie ma linku do App Store (szukałem `apps.apple.com` w `site/`, 0 trafień), więc potrzebna jest zmiana strony i publikacja za zgodą właściciela (droga jak w W-18, `docs/49-wydanie-1-1.md:56`). Wykonalność: sama droga publikacji sprawdzona, a skąd prowadzi link na żywej stronie, nie sprawdziłem |
| `bezposredni` | link, który właściciel podaje sam, gdy ktoś zapyta o aplikację | alternatywa: `atlas`, zarezerwowany dla strony z ćwiczeniami, gdy wystartuje (pkt 6, K1) |

Wydarzenie w App Store nie potrzebuje linku kampanii, bo Apple pokazuje pobrania według wydarzenia (`developer.apple.com/app-store/in-app-events/`, odczyt 16.11.2026: „viewing downloads and filtering by a specific event”).

## 3. Kalendarz T0 … T0+6 tygodni

Czas właściciela to szacunek. Nagranie i publikację filmu szacuję na ok. 30 min; właściciel potwierdzi to po pierwszym filmie.

| Kiedy | Agent | Właściciel (czas) |
|---|---|---|
| Teraz, przed T0 | Teksty wydarzenia PL/EN (gotowe), brief grafik dla wykonawcy, 3 scenariusze filmów (sekcja 5), tabela tygodniowa z punktem wyjścia | 3 linki kampanii w App Analytics (10 min); odpowiedzi F1–F4 (5 min) |
| T0 (dzień akceptacji) | Sprawdzenie, że karta pokazuje 1.1 i że link `tiktok` otwiera kartę | Sprawdzenie linku `trening://exercises` w Notatkach na telefonie (5 min); zgłoszenie wydarzenia (20 min); link `tiktok` w profilu (5 min); film 1 (30 min). Razem ok. 60 min |
| T0 + 1 tydz. | Odczyt 1 | Zrzut danych (10 min); film 2 (30 min); ZB-009, osoba 1 (30 min) |
| T0 + 2 tydz. | Odczyt 2 | Zrzut (10 min); film 3 (30 min); ZB-009, osoba 2 (30 min) |
| T0 + 3 tydz. | Odczyt 3; lista przeszkód z ZB-009 dla analityka produktu | Zrzut (10 min); ZB-009, osoba 3 (30 min) |
| T0 + 4 tydz. (T0+28) | Raport zamknięcia testu TikTok (sekcja 4) | Zrzut (10 min); decyzja o TikToku (10 min) |
| T0 + 5 tydz. | Odczyt 5; koniec wydarzenia (ok. T0+33); dane do ZB-012 (26.12.2026) z podziałem przed i po 1.1 | Zrzut (10 min) |
| T0 + 6 tydz. (T0+42) | Raport oceny (decyzja 6) i propozycja następnego cyklu (≥ 2 opcje) | Ocena (30 min) |

W tym oknie wypadają też ZB-012 (26.12.2026) i ZB-013 (`docs/zobowiazania.md:25-26`). Dane rozdzielamy na okres „Trening” i okres „RepsGoat”.

**Co mierzymy co tydzień** (zrzut z App Analytics, agent zapisuje w tabeli): wyświetlenia; odsłony karty; pierwsze pobrania według źródła (wyszukiwanie, przeglądanie, strony WWW, aplikacje, kampanie) i według kraju, osobno Polska; wiersze kampanii `tiktok`, `www` i `bezposredni` (puste poniżej progu); wydarzenie, czyli wyświetlenia karty, odsłony szczegółów, otwarcia aplikacji, pobrania i „powiadom mnie” (lista metryk ze strony Apple o wydarzeniach, odczyt 16.11.2026); wyświetlenia każdego filmu w statystykach TikToka; oceny i recenzje. Wniosków o retencji i sprzedaży nie wyciągamy, bo próba jest za mała.

## 4. Test TikTok: kryteria zamknięcia

- **Test jest ważny, gdy** 3 filmy wyszły między T0 a T0+21, w każdym widać i słychać nazwę RepsGoat, przez cały czas w profilu jest link `tiktok`, a przy każdym filmie włączono ujawnienie treści komercyjnej. Ustawienie TikToka dla własnej marki sprawdzono w poprzednim szkicu (odczyt 16.11.2026); nazwę opcji właściciel sprawdza w aplikacji. Gdy któryś warunek nie jest spełniony, test jest nierozstrzygnięty, a nie zamknięty.
- **Odczyt T0+28** (co najmniej 7 dni po ostatnim filmie i dobę opóźnienia danych):
  - kampania `tiktok` nie pojawia się w App Analytics → **kanał zamknięty**. Dowodem jest zrzut widoku kampanii i wyświetlenia 3 filmów. Wpis w docs/18 dodaje koordynator;
  - kampania widoczna (≥ 5 pobrań) → kanał zostaje jako kandydat na następny cykl, a decyzja należy do właściciela.
- Notujemy też pobrania z wyszukiwania w Polsce w dniu filmu i dzień po nim, ale tylko jako kontekst, bo kryterium się nie zmienia.

## 5. Trzy scenariusze filmów (20–30 s, PL)

Używam tylko funkcji z opisu sklepu i „Co nowego” 1.1 (`store/app-store-metadata.json:8-9`, pl). W filmach nie ma porad o technice ani zdrowiu, nazw innych firm i źródeł; mówimy „zegarek”. W każdym filmie pada zdanie o autorstwie (`docs/wzrost.md:69`).

**Przed nagraniem (telefon, ok. 10 min raz, po T0):** aplikacja 1.1 ze sklepu, pod ikoną nazwa RepsGoat; tryb skupienia włączony, żeby na ekranie blokady nie było cudzych powiadomień; na ekranie nie widać danych osobowych; każde ujęcie wygląda dokładnie tak jak w opisie. Jeśli coś wygląda inaczej, poprawiamy napis tak, żeby zgadzał się z aplikacją.

**Film 1 — „Seria z zegarka”**
- 0–4 s: zegarek na nadgarstku, odhaczenie serii. Napis: „Seria zapisana. Z zegarka.”
- 4–10 s: zegarek odlicza przerwę. Napis: „Przerwa odlicza się na nadgarstku.”
- 10–18 s: telefon, ta sama seria w treningu. Napis: „Bez konta. Treningi zostają na telefonie.”
- 18–26 s: właściciel do kamery albo napis: „Jestem autorem tej aplikacji. Nazywa się RepsGoat.”
- Opis: „Jestem autorem aplikacji RepsGoat. Szybki zapis serii, także z zegarka. Dane tylko na telefonie, bez konta i bez reklam. Za darmo do 5 dni treningowych w miesiącu. Link w profilu. #siłownia #dzienniktreningowy”
- Do sprawdzenia: seria odhaczona na zegarku pojawia się na telefonie (opis sklepu: „odhaczasz serie i widzisz odliczanie przerwy na nadgarstku”).

**Film 2 — „Rysunki ruchu”**
- 0–6 s: biblioteka ćwiczeń, przewijanie. Napis: „Nowość: rysunki ruchu przy większości ćwiczeń z biblioteki.”
- 6–16 s: karta ćwiczenia (np. maszyna albo kettlebell), rysunek się porusza, potem pauza animacji. Napis: „Animację możesz zatrzymać.”
- 16–22 s: przewinięcie do sekcji „Technika” bez czytania jej na głos. Napis: „Na karcie: ustawienie, ruch i częste błędy.”
- 22–28 s: napis: „Jestem autorem aplikacji. RepsGoat, link w profilu.”
- Opis: „Jestem autorem aplikacji RepsGoat. W wersji 1.1 większość ćwiczeń z biblioteki ma rysunek ruchu: maszyny i linki, kettlebell, skoki, brzuch, mobilność. Bez konta, dane tylko na telefonie. Link w profilu.”
- Do sprawdzenia: wybrane ćwiczenie ma rysunek w 1.1, a animacja daje się zatrzymać. Nie komentujemy, czy ruch jest „poprawny”.

**Film 3 — „Pierwszy trening bez zakładania konta”**
- 0–6 s: ekran Trening nowej osoby z przyciskiem „Zacznij pierwszy trening” i tablicą „Pierwszy trening”. Napis: „Bez rejestracji. Od razu do treningu.”
- 6–16 s: zapis serii (ciężar, powtórzenia), start timera przerw. Napis: „Zapisujesz serię, timer liczy przerwę.”
- 16–22 s: powiadomienie o końcu przerwy na ekranie blokady. Napis: „Koniec przerwy także na ekranie blokady.”
- 22–28 s: napis: „Jestem autorem tej aplikacji. RepsGoat, link w profilu.”
- Opis: „Jestem autorem aplikacji RepsGoat. Bez konta, bez reklam, dane tylko na telefonie. Szybki zapis serii, także z zegarka. Za darmo do 5 dni treningowych w miesiącu. Link w profilu.”
- **Uwaga:** ekran nowej osoby wymaga świeżej instalacji. Usunięcie aplikacji kasuje dane, więc nie rób tego na głównym telefonie. Potrzebny jest drugi iPhone (F3) albo nagranie z symulatora (wykonalność niesprawdzona: w repo nie znalazłem workflowu, który nagrywa wideo; dziś `scripts/ci/store-screenshots.sh:62` robi tylko zrzuty). Inaczej film 3 zastępujemy ujęciem zapisu serii i timera bez ekranu nowej osoby.

## 6. Szczerze: co realnie może dać pobrania w 6 tygodniach

Po odjęciu filmów i społeczności zostają:
- karta w sklepie z nową nazwą i zrzutami;
- jedno wydarzenie;
- obecny tekst promocyjny. Już mówi o rysunkach ruchu i bez decyzji go nie zmieniam, bo metadane zostają bez zmian;
- test pierwszego użycia, który daje sygnał jakości, a nie pobrania.

**To niewiele.** Sklep sprowadza ludzi, którzy czegoś szukają, a nowa nazwa pomaga tylko tym, którzy ją znają. Ile pobrań daje wydarzenie przy aplikacji tej skali, nie wiem; benchmarku nie mam. Uczciwie: w tym cyklu spodziewam się raczej odczytu i porządnego pomiaru niż istotnego wzrostu. Nie dokładam pomysłów bez pokrycia.

**Kierunki na następny cykl:**

| | Co | Zysk | Koszt i ryzyko | Wykonalność |
|---|---|---|---|---|
| K1 | Strona z ćwiczeniami jako darmowe narzędzie, z linkiem `atlas` | Jedyny kierunek z własnym, stałym ruchem z wyszukiwarki | Otwarte blokery (stan 11.11.2026): S-02 eksport F-20, S-03 podłogi W0 (ok. 8 h agenta), S-04 domena (dziś przekierowanie na parking), S-05 Pages, S-06 metoda sprawdzenia znaków towarowych bez ustalenia (`docs/49-wydanie-1-1.md:158-162`); warunek startu: `:145`. Ruch z wyszukiwarki rośnie tygodniami, nie dniami | Częściowa. Plan kroków jest (`docs/49-wydanie-1-1.md:155-170`), ale S-02, S-04 i S-13 mają oznaczenie „wykonalność niesprawdzona”, a S-06 nie ma metody |
| K2 | Społeczności: najpierw pytanie o zgodę do 3–5 miejsc, wpis tylko po pisemnej zgodzie | Trafia do ludzi z problemem | Odpowiedzi są nieprzewidywalne, a regulaminy nieprzeczytane (`docs/wzrost.md:21-25`); lepiej zacząć po wnioskach z ZB-009 | Zasady procesu są (`docs/wzrost.md:65-72`); każde miejsce osobno: wykonalność niesprawdzona |
| K3 | ASO w wersji 1.2: słowa kluczowe z danych ZB-012 i ewentualnie fraza o technice | Tanie, bo jedzie z wydaniem | Mały ruch z wyszukiwania w niszy; efekt nieznany | Słowa kluczowe zmieniają się tylko z nową wersją (`docs/45-widocznosc-w-sklepie.md:200-201`), więc wykonalne przy 1.2 |

**Rekomendacja:** K3 jako stały element 1.2. K1 to główny zakład, ale tylko jeśli właściciel w tym cyklu rozstrzygnie S-04 (kto ma domenę) i S-06 (metoda), bo to jego decyzje, a nie praca agenta. K2 po ZB-009.

**Na następny cykl agent przygotowuje w tym cyklu:** listę miejsc i regulaminów (prompt dla Gemini niżej; wynik na Dysk, cytaty sprawdza badacz), opis decyzji S-04 i S-06 z opcjami oraz kandydatów na słowa kluczowe 1.2 po ZB-012.

> **Prompt dla Gemini:** Szukam miejsc w internecie (PL i EN), gdzie rozmawiają osoby trenujące siłowo na siłowni lub w domu, które prowadzą dziennik treningowy na papierze, w arkuszu albo w notatkach telefonu. Dla każdego miejsca podaj: typ (subreddit, forum, grupa, serwer czatu, klub lub sekcja uczelniana), adres URL, przybliżoną liczbę członków z datą i miejscem, z którego ją wziąłeś, oraz dosłowny cytat z regulaminu o autopromocji, reklamie i linkach do aplikacji z adresem strony regulaminu. Napisz też, czy miejsce ma wydzielony wątek na projekty własne. Nie wymyślaj liczb ani cytatów: jeśli nie znalazłeś, napisz „brak”. Pomiń miejsca dla twórców aplikacji. Wynik w tabeli, maks. 15 miejsc PL i 15 EN.

## 7. Pytania o fakty do właściciela

Szukałem w `docs/fakty-wlasciciela.md` (jest tylko iPhone i Apple Watch, wiersz 8) i w docs/18. TikToka dotyczy tylko wpis z 09.11.2026, według którego widzowie wpisywali w sklepie „trening”.
- **F1.** Czy 8 wcześniejszych filmów pokazywało aplikację, czy mówiło ogólnie o treningu?
- **F2.** Czy na żywej stronie apps4brew.com jest dziś link do App Store (potrzebne do tokenu `www`)?
- **F3.** Czy masz drugi iPhone do nagrania ekranu nowej osoby (film 3)?
- **F4.** Ile realnie zajmuje Ci jeden film? 30 min to mój szacunek.
