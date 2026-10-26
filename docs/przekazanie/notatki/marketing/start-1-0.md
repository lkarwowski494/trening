# Start Trening 1.0 — szkice wpisów, plan dnia startu, lista przed „Release”

Stan: 26.10.2026. Przygotował agent marketingu. **Nic nie zostało opublikowane ani wysłane.** Każdy wpis i każdą wiadomość zatwierdza i wysyła właściciel; przed publikacją wpis do dziennika zgód (`docs/wzrost.md` pkt 3: data, kanał, treść, słowa zgody).
Miejsce docelowe: Dysk, „Trening App” (plan marketingu). Nazwy osób, adresy i listy kontaktów — tylko na Dysku, w szkicach są pola `{…}`.

Podstawa: `docs/42` pkt 2 i 5, `docs/48` Z-31, `docs/wzrost.md` (kanały, DEC-02 a, reguły pkt 6), `docs/18` (13.10, 23.10, 26.10.2026), `docs/monetyzacja.md` (model, kwoty), `store/app-store-metadata.json` (funkcje 1.0).

## 0. Zasady, które pilnują każdego szkicu

- Przekaz startowy (DEC-07 K6): **szybki zapis serii, także z zegarka; dane tylko na telefonie; bez konta**.
- Autorstwo wprost w każdym tekście („jestem autorem aplikacji” / „I'm the developer”).
- Tylko funkcje z 1.0 (opis sklepu). **Nie obiecujemy:** nowych grafik ćwiczeń ani strony z biblioteką (1.1), zegarków innych firm (po App Store), synchronizacji, Androida.
- **Zero wzmianek o źródłach wiedzy** — także „oparte na badaniach”, „sprawdzone wskazówki”, nazwiska autorów wzorów. Bez nazw innych aplikacji (import: „pliki CSV popularnych dzienników”).
- Limit darmowy uczciwie i w pierwszym akapicie albo zaraz po nim: cała aplikacja za darmo do **5 dni treningowych w miesiącu**; dzień liczy się, gdy kończysz trening na żywo dłuższy niż **7 minut**, a kilka treningów jednego dnia to jeden dzień; dopisywanie treningów wstecz, historia, kopia i eksport działają zawsze; **bez okresu próbnego**; Pro zdejmuje limit (miesięcznie, rocznie albo jednorazowo). Liczby: `lib/access.ts` (`MIN_LIVE_MINUTES_FOR_DAY = 7`), `docs/monetyzacja.md`.
- Kwoty (jeśli właściciel wybierze decyzję M-3 A): PL 4,99 zł / mies., 19,99 zł / rok, 59,99 zł jednorazowo; EN 0.99 USD / month, 6.99 USD / year, 14.99 USD one-time (inne waluty — w App Store). Przed publikacją porównać z ekranem zakupu w App Store (Apple 2.3.1).
- Bez próśb o oceny i głosy (także do znajomych i rodziny); ocena tylko systemowym oknem w aplikacji.
- Link do App Store: `{LINK_CT_<kanał>}` = link kampanii z App Store Connect (pkt 4). Do czasu, aż będzie dostępny — zwykły link do App Store.

## 1. Lista miejsc i tryb

| # | miejsce | język | czy autopromocja dozwolona (odczyt) | tryb na start |
|---|---|---|---|---|
| A1 | apps4brew.com (strona produktu) | PL, EN | własny kanał | wpis w dniu D0 po potwierdzeniu, że aplikacja jest w sklepie |
| A2 | nowe konto twórcy (platforma — decyzja M-5) | PL, EN | własny kanał | D+1 z linkiem kampanii |
| A3 | Show HN (Hacker News) | EN | **tak**, dla rzeczy, którą można wypróbować; „Please make it easy for users to try your thing out, ideally without barriers such as signups or emails.”; „Please don't ask friends to upvote or comment.” (news.ycombinator.com/showhn.html, odczyt 26.10.2026) | **propozycja** — decyzja M-4 |
| A4 | Product Hunt | EN | **tak**, twórca może sam zgłosić produkt: „We encourage makers to hunt their own products.”; „you cannot ask people directly to upvote your product.”; „Company accounts are prohibited.” (producthunt.com/launch, odczyt 26.10.2026) — konto osobiste | **propozycja** — decyzja M-4 |
| B1 | Forum SFD | PL | **zakaz** bez pisemnej zgody (regulamin, odczyt 23.10.2026, `docs/wzrost.md` wiersz 2) | najpierw prośba o zgodę do administracji; wpis tylko po zgodzie |
| B2 | Reddit r/homegym | EN | **nieprzeczytane** — reddit.com zwraca 403 z maszyny agenta (20.10 i 26.10.2026); ogólne zasady autopromocji Reddita też 403 | prośba o zgodę do moderatorów (wiadomość do moderacji); wpis tylko po zgodzie |
| B3 | lokalne fora i grupy treningowe (lista na Dysku, prompt Gemini w pliku obok) | PL, EN | nieprzeczytane | prośba o zgodę do administracji; wpis tylko po zgodzie |
| C1 | sekcje AZS (siłownia, trójbój, podnoszenie ciężarów) | PL (EN dla sekcji z wymianą studencką) | wiadomość do klubu = reguła 3: najpierw pytanie o zgodę na kontakt | krok 1: pytanie o zgodę; krok 2: informacja tylko po „tak” |
| C2 | kluby trójboju siłowego | PL, EN | jak C1 | jak C1 |
| D1 | media o iPhonie i fitnessie (PL, EN; lista na Dysku) | PL, EN | adres redakcji do zgłoszeń — jedna nota, bez ponawiania | jedna krótka nota w D+1; **propozycja** — decyzja M-6 |

Fora i grupy z zakazem albo z nieprzeczytanymi zasadami **nie dostają wpisu** bez zgody (DEC-02 a). Prośby o zgodę warto wysłać **teraz** (przed akceptacją Apple), żeby odpowiedzi przyszły przed startem.

## 2. Szkice — kanały własne

### A1. apps4brew.com — krótka nota

**PL**
> **Trening 1.0 jest w App Store.** Dziennik treningowy na iPhone'a i Apple Watch: szybki zapis serii, także z zegarka; dane tylko na telefonie; bez konta. Własne szablony, plan tygodnia, timer przerw, rekordy i wykresy, import historii z plików CSV.
> Za darmo do 5 dni treningowych w miesiącu, bez okresu próbnego. Pro zdejmuje limit — miesięcznie, rocznie albo jednorazowo. Historia, kopia i eksport działają zawsze.
> Jestem autorem aplikacji — uwagi i błędy: „Napisz do nas” w aplikacji albo support@apps4brew.com.
> [Pobierz z App Store]({LINK_CT_strona})

**EN**
> **Training 1.0 is on the App Store.** A workout log for iPhone and Apple Watch: quick set logging, also from your watch; your data stays on your phone; no account. Your own templates, a weekly plan, a rest timer, records and charts, and history import from CSV files.
> Free for up to 5 training days a month, no trial. Pro removes the limit — monthly, yearly or a one-time purchase. History, backup and export always work.
> I'm the developer — feedback and bugs: "Write to us" in the app or support@apps4brew.com.
> [Download on the App Store]({LINK_CT_strona})

### A2. Konto twórcy — post startowy (do ok. 300 znaków, mieści się na każdej platformie tekstowej)

**PL**
> Wydałem Trening — dziennik siłowni na iPhone'a i Apple Watch. Serie odhaczasz także z zegarka, dane zostają na telefonie, bez konta i reklam. Za darmo do 5 dni treningowych w miesiącu, Pro bez limitu. Jestem autorem — chętnie przeczytam uwagi. {LINK_CT_social-pl}

**EN**
> I've released Training, a gym log for iPhone and Apple Watch. Tick off sets from your watch, data stays on your phone, no account, no ads. Free for up to 5 training days a month; Pro removes the limit. I'm the developer — feedback welcome. {LINK_CT_social-en}

Wariant z obrazem (jeśli platforma jest obrazkowa, decyzja M-5): 3 zrzuty ze sklepu w kolejności `trening`, zegarek, `postepy-cwiczenia` — te same pliki co w App Store (bez nowych grafik z 1.1).

### A3. Show HN (tylko EN; propozycja, decyzja M-4)

Tytuł (≤ 80 znaków):
> Show HN: Training – offline workout log for iPhone and Apple Watch, no account

Tekst:
> I'm the developer. Training is a gym log: you record sets, weights and reps, and it calculates volume, records and an estimated one-rep max. You can tick off sets and see the rest countdown on an Apple Watch.
>
> Everything is stored on the device. There is no sign-in and no backend; the app makes no network requests of its own and has no analytics or ads (App Store label: "Data Not Collected"). Backups are plain JSON/CSV files in the Files app, and you can import history from CSV exports of popular workout logs, with a preview before anything is saved.
>
> Pricing, up front: the whole app is free for 5 training days a month (a day counts when you finish a live workout longer than 7 minutes). There is no trial. Pro removes the limit: 0.99 USD/month, 6.99 USD/year or 14.99 USD once. Logging past workouts, history, backup and export always work without paying.
>
> It's available in 35 languages. I'd especially like feedback on the set-logging flow and the CSV import.
> {LINK_CT_showhn}

Uwaga: HN nie lubi „ładowania” — bez emotek, bez superlatyw; odpowiada właściciel w ciągu pierwszych 2–3 h (czas — decyzja M-4).

### A4. Product Hunt (tylko EN; propozycja, decyzja M-4)

- Nazwa: Training
- Hasło (≤ 60 znaków): `Gym log for iPhone & Apple Watch. No account.` (45)
- Opis (≤ 260 znaków):
> Log sets fast, also from your Apple Watch. Your data stays on your phone: no account, no ads, no tracking. Templates, weekly plan, rest timer, records, CSV import. Free for 5 training days a month; Pro removes the limit.
- Pierwszy komentarz twórcy:
> Hi, I'm the developer. I built Training because I wanted a log I could use between sets without signing up or sending my data anywhere. Free tier: the whole app for 5 training days a month, no trial; Pro (monthly, yearly or one-time) removes the limit, and history, backup and export always stay free. Questions and bug reports are welcome here or via "Write to us" in the app.
- Galeria: zrzuty ze sklepu (EN). Bez próśb o głosy — także w poście A2.

## 3. Szkice — miejsca za zgodą

### B1. Forum SFD

**Krok 1 — prośba o pisemną zgodę do administracji (PL)**
> Dzień dobry,
> jestem autorem aplikacji Trening — dziennika treningowego na iPhone'a i Apple Watch (bez konta, dane tylko na telefonie). Regulamin forum zakazuje materiałów promujących produkty bez pisemnej zgody, dlatego pytam najpierw: czy mogę opublikować jeden wpis o wydaniu aplikacji? Jeśli tak — w którym dziale i na jakich zasadach (np. bez linku, tylko w dziale ogłoszeń)? Treść prześlę wcześniej do akceptacji. Jeśli odpowiedź brzmi „nie”, oczywiście się do niej zastosuję.
> Pozdrawiam, {PODPIS}

(EN nie dotyczy — forum polskojęzyczne. Ta sama treść po angielsku jest w B3.)

**Krok 2 — wpis, tylko po zgodzie (PL), w dziale wskazanym przez administrację**
> Tytuł: Trening — dziennik siłowni na iPhone'a i Apple Watch (jestem autorem)
> Cześć, za zgodą administracji: wydałem aplikację Trening. Zapisujesz serie, ciężary i powtórzenia, aplikacja liczy objętość, rekordy i szacowany ciężar maksymalny. Serie można odhaczać z zegarka, odliczanie przerwy widać na nadgarstku i na ekranie blokady. Dane zostają na telefonie, bez konta i reklam; historię z innego dziennika przeniesiesz z pliku CSV.
> Za darmo do 5 dni treningowych w miesiącu (liczy się trening na żywo dłuższy niż 7 minut), bez okresu próbnego. Pro bez limitu: 4,99 zł / mies., 19,99 zł / rok albo 59,99 zł jednorazowo. Historia, kopia i eksport — zawsze za darmo.
> Chętnie odpowiem na pytania i przyjmę krytykę. {LINK_CT_sfd — tylko jeśli zgoda obejmuje link}

### B2. Reddit r/homegym

**Krok 1 — wiadomość do moderatorów (EN; PL — tłumaczenie dla właściciela)**
> Hi mods, I'm the developer of Training, an offline workout log for iPhone and Apple Watch (no account, data stays on the phone, free tier available). Before posting anything I'd like to ask: is a single launch post allowed here, and if so, under which rules (flair, day, link or no link)? If self-promotion isn't allowed, no problem — I won't post. Thanks.

> PL: Cześć, jestem autorem aplikacji Training — dziennika treningowego offline na iPhone'a i Apple Watch (bez konta, dane na telefonie, jest wersja darmowa). Zanim cokolwiek opublikuję: czy wolno tu zamieścić jeden wpis o premierze, a jeśli tak, na jakich zasadach (oznaczenie, dzień, link albo bez linku)? Jeśli autopromocja jest niedozwolona — w porządku, nie publikuję.

**Krok 2 — wpis, tylko po zgodzie (EN; PL — tłumaczenie)**
> Title: I made an offline gym log for iPhone + Apple Watch (developer here)
> With the mods' permission: I built Training for logging in a home gym where the phone is on a shelf and the signal is bad. You can tick off sets and see the rest countdown on your watch; it works fully offline and needs no account. It handles resistance bands (colors and levels) and has "Adjust to location" — swap exercises for today when the equipment at hand is different, without touching your template.
> Free for up to 5 training days a month (a day counts after a live workout longer than 7 minutes), no trial; Pro removes the limit (monthly, yearly or one-time). History, backup and export are always free. Happy to answer questions. {LINK_CT_reddit-homegym — only if allowed}

> PL: Za zgodą moderatorów: zrobiłem Training do zapisu w domowej siłowni, gdzie telefon leży na półce, a zasięg jest słaby. Serie odhaczasz i przerwę widzisz na zegarku; działa w pełni offline, bez konta. Obsługuje gumy oporowe (kolory i poziomy) i „Dostosuj do miejsca” — zamiana ćwiczeń tylko na dziś, gdy sprzęt jest inny, bez zmiany szablonu. Za darmo do 5 dni treningowych w miesiącu (dzień liczy się po treningu na żywo dłuższym niż 7 minut), bez okresu próbnego; Pro bez limitu. Historia, kopia i eksport zawsze za darmo.

### B3. Lokalne fora i grupy — prośba o zgodę (wzór)

**PL**
> Dzień dobry, jestem autorem aplikacji Trening (dziennik treningowy na iPhone'a i Apple Watch, bez konta, dane tylko na telefonie, wersja darmowa do 5 dni treningowych w miesiącu). Czy regulamin grupy pozwala na jeden wpis o jej wydaniu? Jeśli tak, proszę o wskazanie zasad; treść prześlę wcześniej. Jeśli nie — rozumiem i nie publikuję.

**EN**
> Hello, I'm the developer of Training (a workout log for iPhone and Apple Watch; no account, data stays on the phone; free for up to 5 training days a month). Do the group rules allow one post about its release? If so, please let me know the rules and I'll send the text first. If not, I understand and won't post.

Wpis po zgodzie: treść B1 krok 2 (PL) albo B2 krok 2 (EN), dopasowana do zasad z odpowiedzi.

## 4. Szkice — kluby i sekcje (reguła 3: najpierw pytanie o zgodę)

Adresaci tylko z publicznych danych kontaktowych klubu/sekcji (bez list zakupionych i bez zbierania adresów); lista i nazwiska — Dysk.

### C1 / C2. Krok 1 — pytanie o zgodę na kontakt

**PL**
> Dzień dobry,
> jestem autorem aplikacji Trening — dziennika treningowego na iPhone'a i Apple Watch. Czy mogę przesłać {NAZWA_SEKCJI_LUB_KLUBU} krótką informację o aplikacji (kilka zdań)? Jeśli nie jesteście zainteresowani, wystarczy nie odpowiadać — nie będę pisać ponownie.
> Pozdrawiam, {PODPIS}

**EN**
> Hello,
> I'm the developer of Training, a workout log for iPhone and Apple Watch. May I send {CLUB_NAME} a short note about the app (a few sentences)? If you're not interested, no need to reply — I won't write again.
> Best regards, {SIGNATURE}

### Krok 2 — informacja, tylko po „tak”

**PL (sekcja AZS)**
> Dziękuję za zgodę. W skrócie: Trening to dziennik siłowni — serie, ciężary i powtórzenia, rekordy, wykresy i plan tygodnia; serie można odhaczać z Apple Watch. Bez konta i bez zbierania danych, więc sekcja nie musi niczego zakładać ani zbierać. Aplikacja jest w 35 językach (także dla osób z wymiany). Za darmo do 5 dni treningowych w miesiącu, bez okresu próbnego; Pro bez limitu: 4,99 zł / mies., 19,99 zł / rok albo 59,99 zł jednorazowo. {LINK_CT_azs-<skrót>}
> Jeśli zechcecie przekazać to członkom — świetnie; jeśli nie — dziękuję za poświęcony czas.

**PL (klub trójboju)**
> Dziękuję za zgodę. W skrócie: Trening zapisuje serie z ciężarem, powtórzeniami i opcjonalnie RPE albo RIR, liczy objętość, rekordy i szacowany ciężar maksymalny dla każdego ćwiczenia; timer przerw działa na ekranie blokady i na Apple Watch. Dane zostają na telefonie, bez konta. Za darmo do 5 dni treningowych w miesiącu, bez okresu próbnego; Pro bez limitu (miesięcznie, rocznie albo jednorazowo). {LINK_CT_klub-<skrót>}

**EN (club / university section)**
> Thank you. In short: Training logs sets with weight, reps and optional RPE or RIR, and shows volume, records and an estimated one-rep max per exercise; the rest timer works on the Lock Screen and on Apple Watch. Data stays on the phone, no account. Free for up to 5 training days a month, no trial; Pro removes the limit (monthly, yearly or one-time). {LINK_CT_club-<short>}

Kody ofertowe dla klubu (decyzja M-7) — dopiero w kolejnej wiadomości, po odpowiedzi klubu, nie w kroku 1 ani 2.

## 5. D1. Nota dla mediów (propozycja, decyzja M-6)

**PL** — temat: „Trening: dziennik siłowni na iPhone'a i Apple Watch bez konta i bez zbierania danych”
> Dzień dobry, jestem autorem aplikacji Trening, wydanej {DATA} w App Store. To dziennik treningowy: szybki zapis serii, także z zegarka; dane tylko na telefonie; bez konta. Aplikacja nie wysyła danych (etykieta App Store „Data Not Collected”), działa offline, ma kopię i eksport do plików JSON/CSV oraz import historii z CSV. 35 języków. Za darmo do 5 dni treningowych w miesiącu, bez okresu próbnego; Pro bez limitu od 4,99 zł miesięcznie. Zrzuty i ikona: {LINK_DO_PACZKI_NA_DYSKU}. Chętnie odpowiem na pytania. {PODPIS}

**EN** — subject: "Training: an iPhone and Apple Watch gym log with no account and no data collection"
> Hello, I'm the developer of Training, released on the App Store on {DATE}. It's a workout log: quick set logging, also from the watch; data only on the phone; no account. The app sends no data ("Data Not Collected" on the App Store), works offline, offers backup and export to JSON/CSV files and history import from CSV. 35 languages. Free for up to 5 training days a month, no trial; Pro removes the limit from 0.99 USD a month. Screenshots and icon: {PRESS_KIT_LINK}. Happy to answer questions. {SIGNATURE}

## 6. Odpowiedzi na częste pytania (szkice do komentarzy)

| pytanie | PL | EN |
|---|---|---|
| Android? | Na razie tylko iPhone. Decyzję o Androidzie podejmę po kilku tygodniach od premiery — jeśli chcesz, napisz przez „Napisz do nas”, każde zgłoszenie liczę. | iPhone only for now. I'll decide about Android a few weeks after launch — if you'd like it, use "Write to us"; I count every request. |
| Synchronizacja, drugi telefon? | Nie ma konta ani serwera, więc nie ma synchronizacji. Przenosisz dane plikiem kopii (Pliki) albo CSV. | No account or server, so no sync. You move data with a backup file (Files) or CSV. |
| Inne zegarki? | W tej wersji tylko Apple Watch. | Apple Watch only in this version. |
| Co jest za darmo? | Cała aplikacja przez 5 dni treningowych w miesiącu; dopisywanie wstecz, historia, kopia i eksport zawsze. | The whole app for 5 training days a month; logging past workouts, history, backup and export always. |
| Dlaczego subskrypcja? | Finansuje dalszy rozwój; kto woli, kupuje dostęp jednorazowo. | It funds further development; if you prefer, there's a one-time purchase. |
| Plany? | Pracuję nad kolejnymi aktualizacjami; nie zapowiadam dat. | I'm working on further updates; no dates announced. |

## 7. Pomiar bez śledzenia — linki kampanii

- Linki kampanii tworzy właściciel w App Store Connect → aplikacja → Analytics → Acquisition → Campaigns → „+”. Nazwa kampanii = token `ct`, do 30 znaków; token `pt` jest stały dla konta (developer.apple.com/help/app-store-connect/view-app-analytics/manage-campaigns/, odczyt 26.10.2026).
- **Ograniczenie ważne dla dnia startu:** „The Campaigns feature becomes available only after your app has received analytics data.” — link wygenerujesz najwcześniej ok. 24 h po pojawieniu się danych (ta sama strona). Stąd decyzja M-1.
- Metryka pojawia się dopiero przy co najmniej 5 pierwszych pobraniach z kampanii w wybranym okresie (ta sama strona) — przy małych kanałach wynik „brak danych” nie znaczy „zero”.
- Tokeny (propozycja): `strona`, `social-pl`, `social-en`, `showhn`, `producthunt`, `sfd`, `reddit-homegym`, `forum-<skrót>`, `azs-<skrót>`, `klub-<skrót>`, `media-pl`, `media-en`.
- Zestawienie tygodniowe (agent, `docs/42` pkt 6): pobrania łącznie i z kampanii, odsłony strony produktu, oceny, zgłoszenia „Napisz do nas” (w tym prośby o Androida — metryka C z DEC-26).

## 8. Plan dnia startu (czas polski, CET)

Założenie: Apple zaakceptowało wersję (status „Pending Developer Release”), dzień roboczy wtorek–czwartek, właściciel ma w D0 ok. 1 h, a w D+1 ok. 2–3 h (patrz M-4). Godziny HN i PH to praktyka, nie reguła serwisów.

**Teraz → akceptacja Apple (od 27.10.2026)**
1. Wysłać prośby o zgodę: B1 SFD, B2 r/homegym, B3 (lista z Gemini), C1/C2 krok 1. Każde wysłanie — wpis w dzienniku zgód.
2. Gemini: lista grup, klubów, sekcji i redakcji z zasadami (prompt: `gemini-prompt-start-1-0.md` obok); wynik na Dysk; badacz sprawdza zasady przed użyciem.
3. Konto twórcy na wybranej platformie (M-5) i ewentualnie konto osobiste na HN/PH (M-4) — zakłada właściciel.
4. Paczka dla mediów na Dysku: ikona, 3–5 zrzutów PL i EN ze sklepu.

**D0 — dzień kliknięcia „Release”**
- 08:00 — lista z `docs/39` na tym samym buildzie z TestFlight (15–20 min) i lista kontrolna z pkt 9 niżej.
- 08:30 — „Release this version” w App Store Connect.
- 09:00–12:00 — co godzinę: czy aplikacja jest widoczna i instaluje się z App Store na telefonie właściciela (wersja i build zgodne z dziennikiem wydań). Czas pojawienia się w sklepie: **[DO PRZECZYTANIA — badacz]**, nie zakładamy.
- Po pojawieniu się — A1 na apps4brew.com (zwykły link do App Store), tag `v1.0.0-b<numer>` i wiersz w `docs/09` (Z-32).
- Bez wpisów w innych miejscach w D0 (wariant M-1 A).

**D+1**
- 09:00 — sprawdzić, czy w App Store Connect jest już „Campaigns”; utworzyć linki z tokenami z pkt 7. Jeśli funkcja jeszcze niedostępna — przesunąć A2–A4 o dzień (albo wariant M-1 C).
- 09:05 — Product Hunt (jeśli M-4 A): nowy dzień serwisu zaczyna się o północy czasu pacyficznego (09:00 CET) — **[praktyka, do potwierdzenia]**.
- 10:00 — A2 PL i EN (konto twórcy).
- 15:30 — Show HN (jeśli M-4 A lub B); właściciel odpowiada na komentarze do ok. 18:30.
- Nota D1 do redakcji z listy (jeśli M-6 A) — jedna wiadomość na redakcję, bez ponawiania.

**D+2 → D+14**
- Wpisy B1–B3 i wiadomości C (krok 2) tylko tam, gdzie przyszła zgoda; każdy z osobnym tokenem `ct` i wpisem w dzienniku zgód.
- Odpowiedzi na recenzje w App Store w 48 h (`docs/42` pkt 6); agent przygotowuje szkice.
- D+7 — pierwsze zestawienie tygodniowe (pkt 7).

## 9. Lista kontrolna przed kliknięciem „Release”

Produkt (z `docs/42` pkt 5 i `docs/48`):
- [ ] W1-01…W1-08 z `docs/42` pkt 5 odhaczone (bramki, verify, E2E, TestFlight + `docs/39`, zakupy, metadane, opcja ręczna, dziennik wydań, plan „zły build”).
- [ ] Ryzyka telefonu zamknięte albo odłożone decyzją z datą: R-004 (powiadomienia pilne), R-013 (ikona na zegarku), R-014 (pogrubiony tekst).
- [ ] Notatki dla recenzenta mają próg **7 minut**, nie 20 (patrz „Do poprawy” niżej) — to warunek przed zgłoszeniem, ale sprawdzić też tutaj.

Spójność przekazu (Apple 2.3.1 — to, co piszemy, zgadza się z aplikacją):
- [ ] Opis, tekst promocyjny i zrzuty w App Store **nie** mówią o nowych grafikach ćwiczeń ani o źródłach wiedzy; wpisy z tego pliku też nie.
- [ ] Kwoty we wpisach = ekran zakupu w App Store w PL i US (jeśli M-3 A).
- [ ] Ekran zakupu, okno „Uczciwe zasady” i licznik dni działają w wersji ze sklepu (telefon właściciela, bez zakupu).

Strony i kontakt:
- [ ] apps4brew.com aktualne: strona produktu z Apple Watch, polityka prywatności i wsparcie w wersji ≥ 1.0; link „espresso” działa (B-01 z audytu 26.10.2026).
- [ ] Skrzynka support@apps4brew.com odbiera (wysłać próbną wiadomość z „Napisz do nas”).
- [ ] Paczka dla mediów na Dysku (jeśli M-6 A).

Uczciwa promocja:
- [ ] Każdy wpis planowany na D0–D+1 ma wpis w dzienniku zgód z zatwierdzeniem właściciela.
- [ ] Miejsca B i C: wpis tylko tam, gdzie zgoda jest na piśmie i zapisana w dzienniku.
- [ ] Żadnych próśb o oceny ani głosy, żadnego publicznego linku do TestFlight.
- [ ] Konto twórcy założone (M-5); na HN i PH konta osobiste, nie firmowe (M-4).
- [ ] Odpowiedzi z pkt 6 pod ręką; zarezerwowany czas na D+1 (M-4).

## 10. Decyzje dla właściciela

| # | decyzja | opcje i kompromisy | rekomendacja |
|---|---|---|---|
| M-1 | Kolejność „Release” i wpisów (linki kampanii działają dopiero ok. 24 h po pierwszych danych) | **A:** „Release” w D0, tylko strona; wpisy w D+1 z linkami kampanii — pomiar od pierwszego wpisu, start o dzień później. **B:** wszystko w D0 ze zwykłym linkiem — szybciej, ale nie wiemy, który kanał zadziałał w dniu, w którym jest najwięcej ruchu. **C:** D0 kanały własne bez pomiaru, w D+1 i dalej kanały z linkami kampanii — kompromis. | **A** |
| M-2 | Nominacja „App Launch” (Apple: minimalne wyprzedzenie 3 tygodnie — developer.apple.com/help/app-store-connect/manage-featuring-nominations/nominate-your-app-for-featuring/, odczyt 26.10.2026) | **A:** nominacja dziś, „Release” nie wcześniej niż ok. 16.11.2026 — szansa na wyróżnienie, ok. 2 tygodnie zwłoki. **B:** 1.0 bez nominacji; nominacja „App Enhancements” dla 1.1 (biblioteka ćwiczeń, strona) z 3-tygodniowym wyprzedzeniem — 1.0 bez zwłoki, mocniejsza historia przy 1.1. **C:** nominacja dziś z datą premiery wcześniejszą niż 3 tygodnie — sprzeczne z zaleceniem Apple, odradzam. | **B** |
| M-3 | Kwoty we wpisach | **A:** podawać (PL w zł, EN w USD + „inne waluty w App Store”) — pełna uczciwość, trzeba poprawiać wpisy przy zmianie cen. **B:** tylko „ceny w App Store” — wpisy się nie starzeją, ale czytelnik nie wie od razu, ile zapłaci. | **A** |
| M-4 | Show HN i Product Hunt (wymagają obecności 2–3 h w D+1, ponad budżet 2 h tygodniowo z `docs/42` pkt 6) | **A:** oba — największy zasięg, ale odbiorcy techniczni, nie tylko trenujący; ok. 4–5 h właściciela w tygodniu startu. **B:** tylko Show HN — temat „bez konta, bez zbierania danych” pasuje do tych czytelników; ok. 3 h, jednorazowy wyjątek od budżetu. **C:** żadne — mieści się w budżecie, start tylko przez stronę, konto twórcy i miejsca za zgodą. | **B** |
| M-5 | Platforma nowego konta twórcy | **A:** jedna platforma tekstowa — mało pracy, mały zasięg nowego konta. **B:** jedna platforma obrazkowa (zrzuty ze sklepu jako karuzela) — tam są osoby trenujące, trochę więcej pracy przy każdym wpisie. **C:** bez konta, tylko apps4brew.com — zero pracy, brak miejsca na rozmowę. | **B** |
| M-6 | Nota dla mediów | **A:** jedna nota do 5–10 redakcji (PL i EN) z listy na Dysku — 0 zł, ok. 30 min właściciela. **B:** bez noty na start; nota przy 1.1 (więcej nowości). | **A** |
| M-7 | Kody ofertowe dla klubów i sekcji (`docs/27`; zasady Apple dla kodów **[DO PRZECZYTANIA — badacz]**) | **A:** po zgodzie klubu kilka kodów na darmowy okres Pro — mierzalne, zachęta dla klubu; wymaga zgłoszenia kodów w App Store Connect. **B:** bez kodów na start — prościej, klub dostaje tylko informację. | **B** na start, A po pierwszych odpowiedziach klubów |

## 11. Do poprawy przed zgłoszeniem (znalezione przy pracy, dla koordynatora)

1. **Notatki dla recenzenta (`docs/48` pkt 2, wiersz „Free tier”) podają „longer than 20 minutes”**, a kod ma `MIN_LIVE_MINUTES_FOR_DAY = 7` (`lib/access.ts:31`; decyzja 23.10.2026 w `docs/18`). To samo „20 minut” jest w `docs/48` pkt 2 (uwaga o limicie) i w `docs/brd/wymagania.md` (wiersze ok. 653–655). Notatka niezgodna z aplikacją to ryzyko przy recenzji — poprawić przed Z-25. Wniosek „recenzent nie dojdzie do limitu” zostaje prawdziwy (potrzeba 5 różnych dni).
2. **Propozycja D4 z `docs/48` pkt 6** („wskazówki ze źródeł”, „each with its sources listed”, „rysunki ruchu”) stoi w sprzeczności z decyzją o grafikach w 1.1 (`docs/18`, 26.10.2026) i z zasadą zero publicznych wzmianek o źródłach wiedzy. Obecny opis w `store/app-store-metadata.json` („krótkie wskazówki techniki”) jest zgodny — **nie wdrażać D4 w 1.0**.
3. **B-01** (link „espresso” 404 na apps4brew.com) musi być naprawiony przed wpisem A1 — opis sklepu ma przypis, a wpisy odsyłają na stronę.
