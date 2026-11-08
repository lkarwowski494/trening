# Rozmowa o monetyzacji, marketingu i ASO — stan na przerwę (02.11.2026, ~22:45 PL)

Sesja `rozmowa/monetyzacja-marketing` (gałąź od `integracja-1-1`, tylko dokumenty; scala koordynator linii 1.1). Właściciel zarządził przerwę; ten plik pozwala wznowić rozmowę.

## Zapisane decyzje (źródło prawdy — nie ten plik)
- docs/18-przekazanie.md, wpis 02.11.2026 ~21:30 PL: tekst promocyjny „cała aplikacja w Twoim języku” przy 1.0.1 (wariant A) → ZB-035 w `docs/zobowiazania.md`; termin poprawiony 06.11.2026 na 1.1 (1.0.1 wchodzi do 1.1, decyzja 31.10.2026).
- docs/18, 06.11.2026: po wydaniu 1.0 (05.11) czekamy na dane organiczne — bez wpisów w społecznościach, reklam i zmian metadanych do ZB-012/ZB-013 (A); pierwsze pobrania głównie od znajomych z linku.
- docs/fakty-wlasciciela.md: zegarek fēnix 8 AMOLED (źródło: tag `archiwum/f020-garmin`).

## Ocena raportu o konkurencji (Dysk, „Analiza Konkurencji Aplikacji Treningowych iOS”, 02.11.2026, dwie kopie)
Raport Gemini; opinia, nie źródło. Błędy o nas: ceny PL (jest 4,99 / 19,99 / 59,99 zł — docs/monetyzacja.md:22), „zegarek tylko na symulatorze” (testy na urządzeniu — fakty właściciela), „brak lokalizacji sl w App Store” (jest — store/app-store-metadata.json; brak tylko bg, et, lt, lv, sr — docs/45:26).
Stosujemy już: limit dni bez próby, „Co nowego” we wszystkich językach (wydawca.md:12, scripts/asc/metadane.mjs:142), nazwa „Trening” w PL/HR/NO (store/app-store-names.json), lokalne frazy, test zegarka. Częściowo: słowa kluczowe dodatkowych lokalizacji (pomiar H-53), „bez konta” w podtytule PL/EN (zrzuty zaczynają się od pętli treningu — kolejność oceni H-52). Nie stosujemy i nie powinniśmy: porównań z konkurencją (Apple 2.3.7). Niesprawdzone: liczby rynkowe, „zero wywołań sieciowych”, „1 078 komunikatów”.

## Otwarte (bez decyzji, „zdecydujemy później”)
- Garmin — termin rozstrzygnięty później: właściciel 03.11.2026 ~21:20 PL, Garmin do 1.2 (ZB-040); punkt niżej zostaje jako tło.
- **Garmin — wznowienie gałęzi** `archiwum/f020-garmin` (4 commity, 158 plików: aplikacja Connect IQ, moduł iOS, zgoda Bluetooth w 35 językach; nieskompilowane, bez ekranu parowania, bez testu na zegarku). Szacunek (ocena agenta, nie pomiar): ok. 2–4 dni pracy agenta w rundach; kalendarz 2–4 tygodnie (testy właściciela na zegarku, przegląd sklepu Connect IQ — czas otwarty, opłaty „0 zł zakładane, niepotwierdzone”). Opcje: A — decyzja przy punkcie kontrolnym ZB-013 (rekomendacja), B — równolegle z 1.1.
- **Garmin w App Store** (przeczytane 02.11.2026: Apple 2.3.7, 2.3.10, 5.2.1, 5.2.2; developer.garmin.com/brand-guidelines/connect-iq — plakietka Connect IQ tylko dla aplikacji w sklepie Connect IQ, bez marki Garmin w ikonie bez zgody; dopuszczalne brzmienie zdania o zgodności — otwarte, zapytać Garmina). Opcje: A — jedno rzeczowe zdanie w opisie, bez marki w nazwie/podtytule/słowach kluczowych/ikonie (rekomendacja), B — także „garmin” w słowach kluczowych (ryzyko 2.3.7). Przy wydaniu: nazwany wyjątek w CLAUDE.md (dziś ogólny zakaz nazw firm w opisie; decyzja 13.10.2026 w docs/18:40 przewiduje „Garmin” w opisie po wydaniu z Garminem).

## Powiązane: JarAtlas (ta sama rozmowa)
Decyzja `2026-11-02-jaratlas-model-grup` (tablica JarAtlas), plan Z0 w `jaratlas-www/docs/WZNOWIENIE.md`, lista literatury `jaratlas-www/docs/tresci/L1-literatura-2026-11-02.md`; indeks książki w repo `prywatne/indeksy/`.

## Po wydaniu 1.0 (06–07.11.2026)
- Decyzje: docs/18 06.11 (czekamy — zastąpione), 07.11 (B1 — zastąpione; bez wpisów na forach, reguły `docs/wzrost.md` pkt 6 dosłownie), 07.11 ~20:00 (Apple Ads po 1.1 → ZB-046; nazwa/podtytuł/słowa kluczowe z metadanymi 1.1 po pomiarach → ZB-045). Lekcje L-NNN w docs/40 (06.11 i 07.11).
- Pomiar 07.11 (iTunes Search API, przybliżenie): poza top 200 dla głównych fraz w PL/US i w 15 z 24 storefrontów; nowe małe aplikacje z frazą „Workout Tracker” w nazwie stoją w PL na 16.–17. mimo 1–5 ocen; my nie jesteśmy w czołówce nawet na pełny tekst własnej nazwy (US). Analiza z nazwami innych aplikacji — tylko na Dysku: „05 Research konkurencji” / „Trening — ASO nazwa, podtytuł, słowa kluczowe (07.11.2026)” (przeniesione 07.11.2026).
- Sprostowanie 07.11.2026: we wpisach docs/18 z 06.11 i 07.11 (B1) napisałem „wpisy wracają przy 1.1 razem z nominacją ZB-019” — nominacja ZB-019 jest anulowana od 03.11.2026 (właściciel, docs/18); przy 1.1 nominacji nie ma. Druga odsłona luki z lekcji L-NNN (06.11) — stan z integracji czytany z pamięci sesji.

### Warianty ASO (analiza roli marketing 07.11.2026, do wyboru przy ZB-045)
Żaden wariant nie zmienia części przed dwukropkiem (APP_NAME) — bez zmiany w aplikacji.

### en-US
- **A — bez zmian nazwy i podtytułu** (obecne): „Training: Gym Log & Rest Timer” (30) / „Workout tracker. No account.” (28);
  keywords obecne (100 B). Kompromis: zero pracy; ogon identyczny jak u dwóch małych aplikacji, z którymi idziemy łeb w łeb.
- **B**: „Training: Workout Log & Timer” (29) / „Gym tracker. No account.” (24) /
  `weight,lifting,strength,exercise,journal,planner,routine,barbell,dumbbell,sets,reps,1RM,RPE,rest` (89 B).
  Kompromis: „workout log” w nazwie; „gym log” tylko przez łączenie pól (przybliżenie); „rest timer” słabiej.
- **C (rekomendacja, po pomiarze kontrolnym)**: „Training: Workout Tracker” (25) / „Gym Log & Rest Timer, No Login” (30) /
  `weight,lifting,strength,exercise,journal,planner,routine,barbell,dumbbell,sets,reps,1RM,RPE,watch` (97 B).
  Dlaczego: „workout tracker” ma najsilniejszy sygnał popytu (największe aplikacje celują w tę frazę nazwą), a nowe aplikacje
  z 4–8 ocen i tą frazą w nazwie stoją na 4.–17. miejscu (GB, PL). „Gym log” i „rest timer” zostają dokładnie w podtytule.
  Kompromis: „No account” → „No Login” (to samo znaczenie, ale inne brzmienie niż hasło DEC-07 K6 „bez konta” — **decyzja właściciela**;
  alternatywa bez „No Login”: „Gym Log & Rest Timer. Offline” 29 zn., wtedy „bez konta” zostaje w tekście promocyjnym). Usunięte z keywords: RIR, bands (nisza); dodane: weight.

### en-GB (warstwa angielska także w PL, FI, ID, CZ, HU, RO, PT)
- **A — bez zmian.**
- **C (rekomendacja)**: „Training: Workout Tracker” (25) / „Gym Diary & Rest Timer” (22) /
  `log,weights,lifting,strength,exercise,journal,planner,routine,barbell,sets,reps,1RM,RPE,watch` (93 B).
  Dlaczego: GB mówi „diary” — „gym diary” ma w top 7 dwie aplikacje z 5 i 45 ocen; „workout tracker” w nazwie działa dla małych
  aplikacji w GB (#4, #7) i w PL (#16, #17 wg koord.). „log” w keywords łączy się z „Gym” i „Workout” (przybliżenie).
  Kompromis: brak „bez konta” w polach indeksowanych (zostaje w promotional text i opisie); 8 wolnych bajtów.

### pl
- **A (rekomendacja)** — nazwa bez zmian „Trening: dziennik treningowy” (28), podtytuł **„Timer przerw i serie. Bez konta”** (30),
  keywords `siłownia,plan,ćwiczenia,domu,stoper,progres,hantle,sztanga,rekordy,1RM,offline,gumy,siłowy` (93 B; ł, ć = 2 B).
  Dlaczego: „dziennik treningowy” — średnia konkurencja, 0-ocenowa aplikacja w top 10; „timer przerw” — nisza z 6 wynikami, wszystkie 0 ocen,
  a nas tam nie ma (dokładna forma „przerw” brak w naszych polach); „siłowy” + „Trening” z nazwy → „trening siłowy” (7 z 10 w top 10 z 0 ocen).
  „Bez konta” zostaje (DEC-07 K6). Usunięte z keywords: timer (jest w podtytule), rekordy zostają.
- **B**: „Trening: timer przerw i serie” (29) / „Dziennik treningowy. Bez konta” (30) / keywords jak A.
  Kompromis: nisza „timer przerw” w nazwie (silniejsza waga), ale fraza z popytem („dziennik treningowy” — duzi gracze w nazwie) spada do podtytułu;
  popyt „timer przerw” nieznany i prawdopodobnie mały (żaden duży gracz nie celuje). Nie polecam.
- **C**: „Trening: dziennik na siłownię” (30) / „Timer przerw i serie. Bez konta” (30). Kompromis: ryzyko, że Apple nie łączy „siłownię”↔„siłownia”;
  tracimy dokładną frazę „dziennik treningowy” z nazwy. Nie polecam.

Teksty pl i en do przeglądu tłumacza/recenzenta lokalizacji (kryterium: „czy tak powie kolega na siłowni”).


## Problemy, które rozwiązuje Trening (07.11.2026, lista zaakceptowana przez właściciela)
Źródło funkcji: opis PL w `store/app-store-metadata.json`; sformułowania problemów — hipotezy (do sprawdzenia testem ZB-009). Zastosowanie: tematy krótkich filmów (2–3 na problem, ZB-047), test nazwy/podtytułu (ZB-045).
1. Zapis serii wybija z rytmu → szybki zapis, widok „Skupiony”, serie z Apple Watch.
2. Nie pilnuję przerw → timer przerw z powiadomieniem i odliczaniem na zegarku.
3. Maszyna zajęta / brak sprzętu → zamiana ćwiczenia w trakcie, „Dostosuj do miejsca”.
4. Nie wiem, czy dobrze robię ćwiczenie → animacje ruchu (100+ ćwiczeń), „Technika”, częste błędy, pracujące mięśnie.
5. Nie wiem, czy robię postępy → rekordy, wykresy, e1RM, podsumowania, porównanie okresów.
6. Zaniedbuję partie mięśni → mapa mięśni, serie na partię, „Strażnik progresji”.
7. Nie wiem, ile dołożyć → podpowiedź progresji.
8. Nie mam planu → generator szablonu i planu tygodnia z podglądem.
9. Ćwiczę w różnych miejscach → miejsca i sprzęt, gumy oporowe.
10. Zapominam o treningu → plan tygodnia, przypomnienie rano.
11. Nie chcę konta, reklam, śledzenia → wszystko na telefonie.
12. Boję się utraty zapisów → automatyczna kopia w Plikach, eksport JSON/CSV.
13. Przechodzę z innego dziennika → import CSV z podglądem.
14. Aplikacja nie w moim języku → 35 języków.
15. Nie chcę płacić w ciemno → za darmo 5 dni treningowych w miesiącu, historia/kopia/eksport zawsze.

### Pierwsza seria filmów — technika (właściciel 07.11.2026)
Haki: (1) „Ćwiczysz od dawna, ale nie masz pewności, czy technika jest poprawna?”; (2) „Nigdy nie ćwiczyłeś i nie wiesz, jak wykonać ćwiczenie?”; (3) „Masz dość ładnych grafik ćwiczeń, które nic nie tłumaczą?”. Odpowiedź: aplikacja pokazuje poprawną technikę i częste błędy na rysunku. Prototyp: 3 filmy próbne (przysiad ze sztangą, rodzina `squat` po recenzji) — programista, scratchpad sesji 07.11. Kanały: Instagram, TikTok, YouTube — wszystkie „apps4brew”.
**Zasada każdego filmu (właściciel 07.11.2026):** film zaczyna się od problemu użytkownika, z którym widz się utożsamia (hak = pytanie o jego sytuację), potem pokazuje, jak aplikacja go rozwiązuje. Plansza końcowa: ikona aplikacji Trening + „Trening — dziennik treningowy · App Store”, bez „apps4brew”.

### Stan filmów (07.11.2026 ~21:30)
Prototyp: 3 filmy (Back Squat, błąd „kolana do środka”, haki 1–3), 17,5 s, render ok. 45 s/film; skrypt i wyniki w scratchpadzie sesji (`shorts/render.mjs`, `shorts/out/`) — przy wdrożeniu przenieść do `scripts/`. Uwagi: rysunek zajmuje ok. 1/3 wysokości (powiększyć), znaczniki błędu pojawiają się dopiero przy uginaniu kolan. W 1.0 błąd na rysunku mają: Back Squat, Goblet Squat, Front Squat, Deadlift (sztanga), Trap Bar Deadlift, Bench Press (sztanga, hantle), Incline Bench Press — lista odrzucona jako niepełna; kampania po 1.1 (docs/18 07.11 ~21:30).

**Filmy o technice — nazwa ćwiczenia od pierwszej sekundy (właściciel 07.11.2026):** nazwa ćwiczenia widoczna od 0 s, razem z hakiem (przyciąga widza szukającego tego ćwiczenia). Zapis nazwy jak na karcie w aplikacji: nazwa angielska + nazwa lokalna pod nią (decyzja 07.11.2026 o nazwach biblioteki, ZB-044).

### Pierwsze publikacje (TikTok, profil apps4brew, 07.11.2026)
2c PL 21:35, 1a PL 21:36, 1a EN 21:49, 2c EN ok. 21:50 (w przetwarzaniu) — czasy z TikTok Studio (strefa czasowa panelu niesprawdzona). Format A (hak, 3 ujęcia, plansza), 12,8 s, nagranie wersji web aplikacji. Odczyt po 48 h i po tygodniu: wyświetlenia, średni czas oglądania, odsetek obejrzeń do końca, wejścia na profil; porównanie PL/EN i 1a/2c.
Instagram (apps4brew, 07.11.2026 wieczorem): 1a EN i 2c EN jako rolki. YouTube Shorts: pliki z muzyką „Good Energy” (Dyalla, YouTube Audio Library) przygotowane 07.11; publikacja — do potwierdzenia przez właściciela. TikTok 07.11 ~22:15: 0 wyświetleń na wszystkich 4 filmach, filmy publiczne (widoczne w trybie incognito), bez komunikatu o blokadzie — odczyt 08.11 rano.
YouTube Shorts (07.11.2026, 4 filmy z muzyką, tytuły właściciela inne niż haki): „Maszyna na siłowni znów zajęta i cały plan się sypie?” 0 · „Forgot about the rest timer between sets while scrolling?” 4 · „Scrollując zapomniałeś o końcu przerwy między seriami?” 6 · „Machine taken and your workout plan falls apart?” 6 wyświetleń (stan wieczorem 07.11). TikTok: profil uzupełniony (ikona Treningu, opis PL/EN), nadal 0; Instagram (2 × EN): 0.
Stan 08.11.2026 (zrzuty właściciela): YouTube Shorts — 1a PL 0, 2c EN 14, 2c PL 8, 1a EN 38 (razem 60); Instagram (1a EN + 2c EN) — 52 razem; TikTok — 0 na wszystkich 4 (profil uzupełniony, filmy publiczne).

### Automat filmów o technice (08.11.2026)
Prototyp z 07.11 zginął w scratchpadzie (L-NNN w docs/40); odtworzony na gałęzi `filmy/automat-zb047`: `node scripts/filmy/render.mjs --film technika-back-squat-kolana --jezyk pl,en` (MP4 do `.filmy/`), `--plan` (kontrola, JSON), `--klatka N` (HTML klatki). Definicje w `scripts/filmy/filmy.json` (ćwiczenie, błąd rysunku, id wskazówek, haki per język ze stanem akceptacji). Pierwszy film: Back Squat, „kolana do środka”, hak 1. Widoki: zawsze wszystkie widoki ćwiczenia (profil i przód), jak na karcie w aplikacji (właściciel 08.11.2026). Uwaga do wyglądu: dwa widoki obok siebie i szeroka sztanga z przodu — rysunek zajmuje mniej wysokości kadru (do oceny właściciela na pliku).
Stan 08.11.2026 ~21:15: automat nagrywa rysunek z eksportu web aplikacji (wszystkie warstwy karty), scenariusz 1, koniec z pełną nazwą ze sklepu; `node scripts/filmy/render.mjs --film technika-back-squat-kolana --jezyk pl,en` (pierwszy przebieg robi eksport web ok. 1 min; `--bez-eksportu` używa poprzedniego; `--uklad pion` — widoki jeden nad drugim; `--klatki 0,200` — podgląd PNG).
