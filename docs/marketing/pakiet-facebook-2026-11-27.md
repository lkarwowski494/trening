# Pakiet: wpisy w grupach na Facebooku o RepsGoat (rola 11-wzrost, build, 27.11.2026)

Dla właściciela. Publikujesz Ty, ze swojego konta. Agent niczego nie publikuje i nie dołącza do grup. Repo jest publiczne, dlatego tu **nie ma nazw grup ani osób**: dziennik wpisów (grupy, daty, komentarze) prowadź poza repo, w prywatnym repo treści albo na Dysku, według szablonu Oczka (`docs/wzrost/szablon-grupy.md` w repo oczko).

Wzór: pakiet Oczka z 27.11 (repo oczko, gałąź `claude/youthful-pasteur-kx83sn`: `docs/wzrost/pakiet-startowy.md`, `docs/wydanie/kody-ofert.md`, `docs/wzrost/szablon-grupy.md`). Źródła Apple o kodach ofert (odczyt 27.11.2026) są w `kody-ofert.md` Oczka, §2. Tutaj ich nie powtarzam.

## 0. Stan i decyzje (27.11.2026)

- **Wersja w sklepie:** RepsGoat 1.1.1 (lookup `itunes.apple.com/lookup?bundleId=pl.lukasz.trening&country=pl&lang=pl_pl`, 27.11.2026 ok. 20:30 UTC). Identyfikator aplikacji: 6819977165. Oceny: PL 2, US 0.
- **Polecenie właściciela (27.11.2026, przekazane do tej sesji):** „przygotuj materiały na 1–2 wpisy w grupach na Facebooku o aplikacji RepsGoat […] Publikuje właściciel ze swojego konta”. Reguły z doświadczeń Oczka: otwarcie pytaniem do grupy, prezent zamiast prośby, 1 nowa grupa dziennie, każdy wpis z innym pierwszym zdaniem, zasada stop, „nie pytamy administratorów przed wpisem (najwyżej odrzucą)”.
- **Kod (właściciel, 27.11.2026):** „Kod na lifetime acces - REPSGOATPL”. Link do realizacji (kształt jak w Oczku, sprawdzony tam na produkcji): `https://apps.apple.com/redeem?ctx=offercodes&id=6819977165&code=REPSGOATPL`
- **Zmiana zasady kanałów (do weta właściciela):** dotąd obowiązywało DEC-02 a (23.10.2026): wpis w grupie tylko po pisemnej zgodzie administracji, oraz KO-086 (16.11): bez społeczności do ok. 28.12. Zostało też otwarte pytanie WZR-D03 z 24.11 („Facebook i grupy” a DEC-02 a). Dzisiejsze polecenie przyjmuje dla grup na Facebooku zasadę z Oczka: wpis bez pytania administracji, zgodnie z regulaminem grupy. Odczyt regulaminu zostaje: grupa, której zasady zakazują reklamy lub linków, odpada. Wpis do docs/18 z polem `[wdrożenie: …]` robi koordynator przy scalaniu.

## 1. Co sprawdzone w aplikacji (wydana wersja 1.1.1, tag `v1.1.1-b1042`, kod tylko czytany)

| Sprawa | Wynik | Dowód |
|---|---|---|
| Czy jest produkt „na zawsze” (nie subskrypcja)? | Tak: `pl.lukasz.trening.full.lifetime`. Opis w sklepie: „jednorazowy dostęp dożywotni” | `lib/products.ts:16` |
| Czy aplikacja rozpoznaje kod zrealizowany poza aplikacją (link)? | Tak, w kodzie: dostęp liczony z `currentEntitlements`, nasłuch transakcji od startu, odświeżenie przy starcie i po każdym powrocie aplikacji na ekran | `lib/store-native.ts:5-7, 113-119`; `lib/entitlement.ts:78-79`; `app/_layout.tsx:57` |
| Kod z oferty oznaczony jako źródło „kod” | Tak (`offerIOS.type = code`), dla „na zawsze” bez daty końca | `lib/store-native.ts:44-51` |
| Czy da się wpisać kod w samej aplikacji? | Tak: ekran planów Pro, przycisk „Zrealizuj kod” (arkusz Apple) | `app/paywall.tsx:124` |
| Gdzie widać, że działa | Więcej → Ustawienia → sekcja „Subskrypcja”: „Masz plan: dożywotni” i „Masz dostęp na zawsze” | `app/(tabs)/more.tsx:24`, `components/SubscriptionCard.tsx:19-21` |
| Chmura rodzinna | Opis w sklepie: „Pro i dostęp dożywotni można udostępnić w Chmurze rodzinnej”. Jedna realizacja może więc objąć rodzinę. Zdanie we wpisie tego nie obiecuje | opis w sklepie, lookup 27.11 |
| Darmowy limit | 5 dni treningowych w miesiącu. Dzień liczy się dopiero przy treningu na żywo dłuższym niż 7 minut | `lib/access.ts` (`FREE_TRAINING_DAYS_PER_MONTH: 5`, `MIN_LIVE_MINUTES_FOR_DAY = 7`) |

Na urządzeniu niczego nie sprawdzałem. Kod w kodzie wygląda dobrze, ale dowodem jest Twój test (lista w pkt 4, krok 1).

## 2. Zdjęcia

Pierwsze 4 zrzuty ze strony RepsGoat w App Store, z ramkami i podpisami, pobrane 27.11 z adresów sklepu (lookup, pole `screenshotUrls`). Dla PL: „Szybki zapis serii, także z zegarka”, „Rysunki ruchu i wskazówki techniki”, „Każdy rekord i postęp na wykresie”, „Strażnik progresji Twojego tygodnia”. EN: te same kadry w wersji angielskiej. Wrzucaj je jako 4 osobne zdjęcia, nie jako kolaż. Pliki dostajesz w czacie. W repo ich nie ma (są publiczne w sklepie, a repo nie potrzebuje kopii).

## 3. Gotowe teksty

Punkty są wzięte z opisu wydanej wersji w sklepie (lookup 27.11). Zdanie „szybki zapis” celowo pominąłem, bo nikt go nie zmierzył (zgłoszenie E1 z 24.11, pkt 2). „Działa w całości na telefonie” to brzmienie z opisu w sklepie. Gdy ktoś zapyta o kopię w iCloud: kopię zapasową w Plikach włącza i wybiera użytkownik.

### W1-PL: z kodem (pierwsza polska grupa, ogólna siłowniana)

Wpis z kodem nie ma prośby o ocenę, żeby ocena nie wyglądała na warunek prezentu.

```text
Pytanie do Was: jak zapisujecie treningi? Zeszyt, notatki w telefonie, arkusz, aplikacja, a może wszystko w głowie?

Pytam, bo jestem autorem aplikacji RepsGoat i chcę ją robić tak, żeby naprawdę pomagała. Dziś umie to:
• zapis serii (ciężar × powtórzenia) z timerem przerwy, także z Apple Watch
• historia, rekordy i wykres dla każdego ćwiczenia, a do tego porównanie tygodnia z poprzednim dla każdej partii mięśni
• animowane rysunki ruchu i wskazówki techniki przy ponad 100 ćwiczeniach

Jest na iPhone'a, działa w całości na telefonie, bez konta i bez reklam:
https://apps.apple.com/pl/app/repsgoat-dziennik-treningowy/id6819977165
Aplikacja jest w fazie rozwoju, dlatego na start daję RepsGoat Pro na zawsze za darmo: kod REPSGOATPL → https://apps.apple.com/redeem?ctx=offercodes&id=6819977165&code=REPSGOATPL (jedna realizacja na osobę, do wyczerpania puli [LIMIT] kodów). Bez subskrypcji i bez opłat.

Chętnie przeczytam, czego Wam brakuje w takich aplikacjach.
```

`[LIMIT]` = limit realizacji ustawiony dla REPSGOATPL w App Store Connect. Wpisz dokładną liczbę albo usuń cały nawias z „do wyczerpania puli”, jeśli nie chcesz jej podawać.

### W2-PL: z kodem, druga polska grupa (inne otwarcie, inna kolejność punktów; najwcześniej następnego dnia)

```text
Ile razy zdarzyło Wam się stać przy sztandze i nie pamiętać, ile było ostatnio na tym ćwiczeniu? Jestem autorem RepsGoat, dziennika treningowego na iPhone'a, zrobionego właśnie na to.

Rozwijam go sam, więc na pewno nie jest jeszcze idealny. Dlatego bardzo cenię konkretne uwagi, w komentarzu albo prywatnie.
• historia, rekordy i wykres dla każdego ćwiczenia, a przy serii widać, co było poprzednio
• animowane rysunki ruchu i wskazówki techniki przy ponad 100 ćwiczeniach
• timer przerwy, także na ekranie blokady i na Apple Watch

Działa w całości na telefonie, bez konta i bez reklam:
https://apps.apple.com/pl/app/repsgoat-dziennik-treningowy/id6819977165
Na start daję RepsGoat Pro na zawsze za darmo: kod REPSGOATPL → https://apps.apple.com/redeem?ctx=offercodes&id=6819977165&code=REPSGOATPL (jedna realizacja na osobę, do wyczerpania puli [LIMIT] kodów). Bez subskrypcji i bez opłat.
```

„Przy serii widać, co było poprzednio”: kolumna „Poprzednio” jest na pierwszym zrzucie w sklepie. „Rozwijam go sam” zostaw tylko, jeśli to prawda (w Oczku ten wariant wymagał Twojego potwierdzenia).

### W1-EN: bez kodu (grupa anglojęzyczna)

Kodu EN jeszcze nie ma. Polski kod zadziała wszędzie, ale liczba w zdaniu dotyczy jednej puli, więc lepiej mieć osobny kod na język. Dopóki go nie ma, wpis EN idzie bez kodu, z jednym zdaniem warunkowym o ocenie.

```text
Question for you: how do you log your workouts? A notebook, notes on your phone, a spreadsheet, an app, or just memory?

I'm asking because I'm the developer of an app called RepsGoat, and I want to make it genuinely helpful. Today it can do this:
• log sets (weight × reps) with a rest timer, also from Apple Watch
• history, records and a chart for every exercise, plus this week vs. last week for each muscle group
• animated drawings of the movement and technique tips for over 100 exercises

It's on iPhone, runs entirely on your phone, with no account and no ads:
https://apps.apple.com/us/app/repsgoat-progressive-overload/id6819977165
Free for up to 5 training days a month; Pro removes the limit. History, backup and export always work.

I'd love to read what's missing for you in apps like this. And if RepsGoat comes in handy, I'd be grateful for an honest rating on the App Store.
```

Dla grupy z Wielkiej Brytanii, Kanady albo Australii zamień `/us/` na `/gb/`, `/ca/` albo `/au/` w adresie.

**Wersja z kodem EN:** jeśli utworzysz kod (np. `REPSGOATEN`, oferta na tym samym produkcie Lifetime, Custom Codes), zamień linię „Free for up to 5…” i ostatnie zdanie na:
```text
The app is still in development, so to start I'm giving away RepsGoat Pro for free, forever: code REPSGOATEN → https://apps.apple.com/redeem?ctx=offercodes&id=6819977165&code=REPSGOATEN (one redemption per person, while the [LIMIT] codes last). No subscription and no charges.

I'd love to read what's missing for you in apps like this.
```

### W3-PL: grupy kupna i sprzedaży sprzętu (właściciel 27.11.2026: „Znajde grupy gdzie ludzie sprzedaja sprzet i tam bede to dodawal. Tam mozna dawac ogloszenia wiec to przewjdzie - sprzedaje appke nie sprzet”)

**Publikuj jako zwykły wpis, nie przez opcję „Sprzedaj” (ogłoszenie z ceną).** Zasady handlowe Facebooka (Commerce Policies, facebook.com/policies_center/commerce, odczyt 27.11.2026) obejmują „any attempt to buy, sell, or trade products - even for free” w usługach do handlu, także na Marketplace. Zakazują też: „Commerce content may not promote the buying, selling, or trading of downloadable digital content, digital subscriptions or digital accounts”. Ogłoszenie z ceną dla aplikacji albo kodu Pro to dokładnie ten przypadek. Grozi odrzuceniem ogłoszenia, a powtórki mogą ograniczyć konto. Zwykły wpis w dyskusji grupy nie jest opisany wprost w tym fragmencie [OCENA], więc o tym, czy wpis zostanie, decyduje regulamin grupy. Grupy sprzedażowe często dopuszczają tylko ogłoszenia o przedmiotach: grupa z taką zasadą odpada.

```text
Dla osób, które kompletują sprzęt do domu albo na siłownię: jestem autorem RepsGoat, dziennika treningowego na iPhone'a. Nic nie sprzedaję, to darmowy prezent dla tej grupy.
• ćwiczenia dobierane do miejsca i sprzętu, który masz
• zapis serii (ciężar × powtórzenia) z timerem przerwy, także z Apple Watch
• historia, rekordy i wykres dla każdego ćwiczenia

Działa w całości na telefonie, bez konta i bez reklam:
https://apps.apple.com/pl/app/repsgoat-dziennik-treningowy/id6819977165
Na start daję RepsGoat Pro na zawsze za darmo: kod REPSGOATPL → https://apps.apple.com/redeem?ctx=offercodes&id=6819977165&code=REPSGOATPL (jedna realizacja na osobę, do wyczerpania puli [LIMIT] kodów). Bez subskrypcji i bez opłat.

Jeśli to nie miejsce na taki wpis, daj znać, usunę go.
```

Punkt o miejscu i sprzęcie pochodzi z opisu w sklepie („Miejsca i sprzęt: ćwiczenia dobierane do tego, czym dysponujesz”).

## 4. Lista 5 punktów przed publikacją

1. **Test kodu na produkcji (raz, przed pierwszym wpisem).** Otwórz link REPSGOATPL na iPhonie i zrealizuj kod. Potem otwórz RepsGoat → Więcej → Ustawienia → „Subskrypcja” i sprawdź napis „Masz plan: dożywotni”. Jeśli kod nie działa (Apple podaje do godziny na aktywację), nie publikuj wersji z kodem. Uwaga: Twoje konto może już mieć Pro z innego zakupu. Wtedy test pokaże tylko, że link działa. Zapisz, co zobaczyłeś.
2. **Regulamin grupy:** zakładka „Informacje” i przypięte posty. Jeśli zasady zakazują reklamy lub linków, grupa odpada. Jeśli jest osobny wątek promocyjny, piszesz tylko w nim. Wiersz grupy wpisz do prywatnego dziennika.
3. **Tekst:** jeden wariant na grupę, nigdy dwa razy ten sam. W tekście wpisz `[LIMIT]` (albo usuń nawias). Nie dopisuj funkcji ani cen spoza opisu w sklepie. Przy funkcjach, których sam nie używałeś na telefonie (rysunki ruchu, Strażnik progresji, porównanie tygodni), zdecyduj, czy chcesz za nie ręczyć; jeśli nie, usuń punkt.
4. **Zdjęcia:** 4 osobne pliki w języku wpisu (pl albo en), w kolejności 1–4.
5. **Tempo i stop:** 1 nowa grupa dziennie. Wpis usunięty → ta grupa odpada, bez ponawiania. 2 usunięcia albo jakiekolwiek ostrzeżenie Facebooka → koniec wpisów i rozmowa z koordynatorem.

## 5. Komentarze

Wklejaj komentarze koordynatorowi albo do tej sesji. Dostaniesz gotową odpowiedź (tylko prawdziwe funkcje, ze ścieżką w aplikacji). Sygnały zapisujemy bez nazwisk, z liczbą osób na pomysł, w prywatnym repo treści. Po tygodniu idą jako wejście dla roli 03.
- Cena: „Za darmo do 5 dni treningowych w miesiącu. Pro znosi limit (miesięcznie, rocznie albo raz na zawsze). Cenę zobaczysz w App Store”. Kwot nie podajemy, bo różnią się między krajami.
- „Gdzie wpisać kod?”: link otwiera App Store. W aplikacji: Więcej → Ustawienia → „Subskrypcja” → „Zrealizuj kod”.
- „Czy jest na Androida?”: nie, tylko iPhone (i Apple Watch). Zapisz to jako sygnał (metryka C decyzji o Androidzie, ZB-013).
- Krytyka: zostaw ją, odpowiedz rzeczowo i niczego nie obiecuj. Błąd: poproś o wersję iOS i opis tego, co się stało.
- Nie proś o polubienia, udostępnienia ani oceny w komentarzach.
