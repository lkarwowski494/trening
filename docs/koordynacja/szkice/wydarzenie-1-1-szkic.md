# Wydarzenie w App Store dla wersji 1.1 — szkic (do zatwierdzenia przez właściciela)

Przygotował agent marketingu, 16.11.2026. Nic nie zostało zgłoszone. Wydarzenie zgłasza właściciel w App Store Connect, w dniu T0, czyli w dniu akceptacji 1.1. Przed tą sesją agent czyta jeszcze raz strony pomocy Apple (zasada „przejście na sucho”, CLAUDE.md).

**Źródła przeczytane 16.11.2026:**
- (A) https://developer.apple.com/app-store/in-app-events/ — wytyczne jakości, odznaki, „purpose”, limity, grafiki, link;
- (B) https://developer.apple.com/help/app-store-connect/offer-in-app-events/offer-in-app-events — pola formularza;
- oraz odczyt koordynatora 16.11.2026 (wydarzenie można zgłosić bez nowej wersji, gdy aplikacja jest już zatwierdzona). Strony z odznakami w pomocy App Store Connect nie czytałem, bo definicje odznak są w (A).

## 1. Temat — dwa warianty

| | Wariant A: „Nowe rysunki ruchu” (odznaka Major Update) | Wariant B: „RepsGoat — nowy start” (nowa nazwa i ekran pierwszego treningu) |
|---|---|---|
| O czym | Większość ćwiczeń z biblioteki ma teraz rysunek ruchu, do tego nowe wskazówki techniki | Zmiana nazwy i nowy ekran startowy dla nowej osoby |
| Pokrycie | „Co nowego” 1.1, punkty 1–2 | „Co nowego” 1.1, punkty 5–6 |
| Za | Nowa treść, którą widać i którą da się otworzyć linkiem; pasuje do definicji Major Update w (A) | Prosty przekaz o nowej marce |
| Przeciw | Treść jest stała, nie czasowa, więc wydarzenie trzeba ująć jako premierę nowej treści | Zmiana nazwy to promocja samej aplikacji, a ekran startowy to nie treść. (A) wprost wymienia „General promotions that raise awareness about your app” wśród złych kandydatów, więc ryzyko odrzucenia jest wysokie |

**Rekomendacja: A.**

## 2. Teksty (wariant A)

Liczyłem znaki ręcznie, ze spacjami i interpunkcją. Limity (A, B): nazwa ≤ 30, krótki opis ≤ 50, długi opis ≤ 120. Apple prosi o nazwę w title case. Po polsku takiego zapisu się nie stosuje, więc w PL proponuję zwykłą pisownię; ostatecznie rozstrzyga recenzent lokalizacji.

| Pole | PL | Znaki | EN | Znaki |
|---|---|---|---|---|
| Nazwa | Nowe rysunki ruchu | 18 | New Movement Drawings | 21 |
| Krótki opis | Większość ćwiczeń z biblioteki ma rysunek ruchu | 47 | Most exercises now have a movement drawing | 42 |
| Długi opis | Maszyny i linki, kettlebell, skoki, brzuch, mobilność. Do tego nowe wskazówki techniki na karcie ćwiczenia. | 107 | Machines and cables, kettlebells, jumps, abs and mobility, plus new technique tips on the exercise card. | 104 |

**Pokrycie twierdzeń** (`store/app-store-metadata.json`; wytyczna 2.3.1: nic ponad to, co jest w aplikacji):

| Twierdzenie | PL | EN |
|---|---|---|
| większość ćwiczeń z biblioteki ma rysunek ruchu | `lokalizacje.pl.whatsNew`, punkt 1 (`:9`) | `lokalizacje.en-US.whatsNew`, punkt 1 (`:16`) |
| maszyny i linki, kettlebell, skoki, brzuch, mobilność | to samo | to samo |
| nowe wskazówki techniki | `pl.whatsNew`, punkt 2 | `en-US.whatsNew`, punkt 2 |
| na karcie ćwiczenia | `pl.description`, sekcja TECHNIKA („Sekcja „Technika” na karcie ćwiczenia”, `:8`) | `en-US.description`, sekcja TECHNIQUE (`:15`) |

Teksty nie zawierają cen (A: „Including specific pricing will lead to rejection by App Review.”), nazw innych firm, źródeł, porad o technice ani obietnic typu „najlepszy”. Pozostałe języki: opcjonalnie przez tłumacza i recenzenta lokalizacji. Język główny wydarzenia (B: wyświetla się, gdy brak przekładu na język urządzenia) proponuję angielski, a polski jako lokalizację, bo w polskim sklepie domyślny jest English (U.K.) (`docs/45-widocznosc-w-sklepie.md:24`). To decyzja właściciela.

## 3. Ustawienia formularza

- **Nazwa wewnętrzna** (≤ 64, niewidoczna): `1.1 rysunki ruchu`.
- **Odznaka:** Major Update. Definicja z (A): „Introducing significant new features, content, or experiences – for example, the launch of new game modes or levels. These events go beyond minor enhancements like UI adjustments or bug fixes.” Inne odznaki z (A): Challenge, Competition, Live Event, New Season, Premiere, Special Event. Żadna nie pasuje lepiej.
- **Purpose** (opcje z A): „Appropriate for all users”, „Attract new users”, „Keep active users informed”, „Bring back lapsed users”. **Rekomendacja: Attract new users**, bo celem są pobrania, a obecnych użytkowników jest kilkunastu. Alternatywa: Appropriate for all users. Jak dokładnie Apple wykorzystuje to pole, poza zdaniem „help make sure your event reaches the most relevant users” (B), nie wiem.
- **Priorytet:** dowolny, to nasze jedyne wydarzenie.
- **„In-App Purchase required”:** nie. Biblioteka i karta ćwiczenia nie odwołują się do zakupu: w `app/` odwołania do zakupu i limitu mają tylko `more/settings.tsx`, `paywall.tsx` i `_layout.tsx`. Na telefonie trzeba potwierdzić, że po wyczerpaniu darmowych dni biblioteka nadal się otwiera.
- **Kraje:** domyślnie wszystkie (B).

## 4. Daty względem T0

- Wydarzenie zgłaszamy **w dniu T0**, nie wcześniej. Przed wydaniem 1.1 link otwierałby wersję 1.0 bez nowych rysunków, a to byłoby niezgodne z opisem (2.3.1).
- **Start:** T0 + 2 dni. **Koniec:** start + 31 dni, czyli maksimum z (B). **Publikacja:** od chwili zatwierdzenia (B: najwcześniej 14 dni przed startem).
- Czasu recenzji wydarzeń nie znam i go nie zgaduję. Co się dzieje, gdy wydarzenie nie zostanie zatwierdzone przed startem, nie przeczytałem **[DO PRZECZYTANIA]**. Agent sprawdzi to na stronie Apple o zgłaszaniu wydarzeń przed sesją T0. Wariant awaryjny: przesunięcie startu w formularzu.
- Alternatywa: 14 dni zamiast 31, żeby wydarzenie bardziej wyglądało na „moment”. Kompromis: krótsza widoczność. Rekomenduję 31 dni.

## 5. Link do treści (wymagany)

- **Propozycja: `trening://exercises`**, czyli biblioteka ćwiczeń, ekran `app/exercises.tsx`. Schemat `trening` jest w `app.json:6` i zostaje mimo nowej nazwy, bo użytkownik go nie widzi.
- **Dowód, że link działa:** zrzuty do sklepu otwierają ekrany tym samym schematem (`scripts/ci/store-screenshots.sh:62`, symulator). Ekran otwarty linkiem ma pod spodem zakładki, więc jest droga powrotu (`app/_layout.tsx:33`), czego wymaga (A): „Always provide a way for users to return to your main app experience.” Wejście z linku jest w katalogu przepływów jako wyjątek „brzegowe” sprawdzany testem routingu (`docs/37-katalog-przeplywow.md:259`). Scenariusza Maestro brak.
- **Test na telefonie w T0 (5 min, według A):** wkleić `trening://exercises` do Notatek, stuknąć, potem sprawdzić, że otwiera się biblioteka, widać zakładki i karta wybranego ćwiczenia pokazuje rysunek.
- Alternatywa: karta jednego ćwiczenia `trening://exercise/<id>` (`app/exercise/[id].tsx`). Musi to być identyfikator ćwiczenia z biblioteki, który jest w każdej instalacji. Wykonalność niesprawdzona, nie wskazałem konkretnego id.

## 6. Grafiki — brief dla wykonawcy

Wymagania z (A): karta 16:9, od 1920×1080 do 3840×2160 px; strona szczegółów 9:16, od 1080×1920 do 2160×3840 px; .jpg/.jpeg/.png (zamiast obrazu można dać pętlę wideo). Zasady z (A):
- „When possible, avoid using text or logos in your media”;
- bez ramek i gradientów (Apple dodaje je sam);
- spójne kolory na obu grafikach;
- tylko własne treści.

- **Karta 16:9:** 3–4 rysunki ruchu z różnych grup z „Co nowego” (np. maszyna lub linka, kettlebell, skok, mobilność) obok siebie, każdy w kluczowej fazie ruchu, na tle aplikacji w ciemnym motywie. Bez tekstu, logo i ramki telefonu. Ważne elementy trzymamy w środku, bo Apple przycina obraz (podgląd przycięcia jest w App Store Connect).
- **Szczegóły 9:16:** jeden rysunek w pionie, duży, jak na karcie ćwiczenia (`app/exercise/[id].tsx`), z kilkoma fazami ruchu albo bez nich. Bez tekstu interfejsu. Zrzut ekranu ze sklepu 6,9″ odpada: ma podpis i obwódkę, a do karty 16:9 jest za wąski (1320 px szerokości).
- **Skąd rysunki:** rysunki są wektorowe (`components/ExerciseFigureV2.tsx:4,41`, SVG), więc da się je wyrenderować w wysokiej rozdzielczości. Wykonalność niesprawdzona: w repo nie wskazałem skryptu, który zapisuje sam rysunek do PNG. Wariant z pętlą wideo animacji też ma wykonalność niesprawdzoną.
- **Bramka 4 (CLAUDE.md):** biorę tylko ćwiczenia, których rysunek jest wyświetlany w 1.1 (rodzina `ready` z recenzją niezależną; `docs/research/figury-recenzja.json`, ten sam filtr co eksport strony, `scripts/strona/eksport.mjs:70-72`). Wybór ćwiczeń sprawdza ktoś inny niż wykonawca grafiki.

## 7. Ryzyko odrzucenia

- (A), wśród złych kandydatów: „General promotions that raise awareness about your app or game. While an In-App Event can highlight added content or features that are permanent or ongoing, the event itself should focus on a related limited-time moment or experience.”
- Tamże, o opisie: „Don't use the description to promote your app or services.”

**Ocena: średnie.** Za przyjęciem przemawia to, że odznaka Major Update istnieje właśnie dla „launch of new … content”, a w 1.1 doszła nowa treść (rysunki do większości biblioteki), więc to więcej niż „UI adjustments or bug fixes”. Teksty mówią tylko o tej treści, bez cen i bez zachęt do aplikacji jako całości. Przeciw przemawia to, że treść jest stała, więc recenzent może uznać wydarzenie za ogólną promocję. Dlatego nazwa mówi „Nowe…” (moment premiery), a czas trwania jest ograniczony. Wariant B ma ryzyko wysokie (sekcja 1). Koszt odrzucenia jest niski: praca agenta i ok. 20 min właściciela. Wydarzenie nie ma wpływu na samą wersję 1.1.
