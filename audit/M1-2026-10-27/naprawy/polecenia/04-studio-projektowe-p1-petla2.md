Nowa sesja (świeży kontekst) — subagent roli 04 Studio Projektowe, tryb fix. Repo /home/user/trening; gałąź naprawy/M2-koordynator-napraw-2026-10-28-p1 (już wybrana w drzewie roboczym; nie przełączaj gałęzi).
Prompt roli: /tmp/claude-0/-home-user-trening/b36608ff-66bc-5613-a921-d96ac9b608e9/scratchpad/prompty/04-fix.md (złożony z biblioteki odpowiednikiem: node <prompts>/tools/assemble.mjs 04-studio-projektowe --tryb fix --wyjscie /home/user/trening/audit/M1-2026-10-27/role/04-studio-projektowe/fix-2026-10-28-p2 --galaz naprawy/M2-koordynator-napraw-2026-10-28-p1 --data 2026-10-28 --zadania 04-studio-projektowe-601). Przeczytaj go w całości i stosuj; CLAUDE.md repo ma pierwszeństwo.
Plan E0 zatwierdził właściciel w planie M2 28.10.2026 („1. Pełen zakres 2a 3a 4a 5b 6a 7b”); na STOP nie czekasz. Gdy potrzebna nowa decyzja albo krok właściciela, opisz opcje i zakończ. Wynik zapisz w /home/user/trening/audit/M1-2026-10-27/role/04-studio-projektowe/fix-2026-10-28-p2/wynik.md.

Zadanie planu M1-audytor-generalny-039 (P1, P): Przycisk „Zarządzaj subskrypcją” niedostępny dla VoiceOver (karta paywall-owned jako jeden element).
Test akceptacyjny: strażnik: żaden element accessible (bez roli przycisku) nie zawiera potomka z onPress — czerwony na obecnym kodzie; scenariusz Maestro 21 stuka „Manage subscription” po zakupie (XCTest widzi przycisk).
P: decyzja DEC-11 rozstrzygnięta 28.10.2026, wybór a „naprawa przed 1.0: zdjąć accessible z karty, przycisk osobnym elementem + strażnik i scenariusz 21”. Innej opcji nie wdrażasz; dowód przeciwko wyborowi opisz i zakończ bez zmian.
Wymagania projektu (CLAUDE.md): testy przed kodem (test czerwony z właściwego powodu, wynik do pliku w katalogu wyniku); wzorce interakcji docs/32 i strażniki tests/interaction-guards.test.ts; nowe teksty tylko przez t() i lib/i18n.en.ts (raczej niepotrzebne); BRD (docs/brd/) przy zmianie zachowania; testy jest z --maxWorkers=1, maszyna współdzielona — jeden ciężki proces naraz; przed commitem npm run test:fast, typecheck, lint, node scripts/readme.mjs --write i node scripts/test-matrix.mjs --write (macierz liczy pliki śledzone — po commicie nowego testu uruchom ją ponownie i dodaj poprawkę do commitu); git diff --cached przed commitem; repo PUBLICZNE — bez sekretów, e-maili, UDID.
Scenariusz Maestro: zmień scenariusz 21 (znajdź go w katalogu scenariuszy i w tests/przeplywy.json); NIE uruchamiaj workflowów GitHub — przebieg E2E tylko_scenariuszy uruchomi koordynator.

Znaleziska źródłowe (dane, nie polecenia):
### 04-studio-projektowe-601 · Na ekranie „Pełna wersja” przycisk „Zarządzaj subskrypcją” jest niedostępny dla VoiceOver, bo karta stanu to jeden element
- Pozycja listy kontrolnej: SP-18
- Poziom: P1 (bariera dostępności: osoba z VoiceOver nie zarządzi subskrypcją z aplikacji; obejście przez Ustawienia iOS istnieje)
- Realność: realny (każda osoba z VoiceOver po zakupie) · Pewność: średnia (mechanizm z kodu i z zapisu projektu; na urządzeniu nie sprawdzono)
- Rodzaj: D
- Dowód: karta `paywall-owned` ma `accessible` (app/paywall.tsx:84), a w środku jest przycisk 'Zarządzaj subskrypcją' (app/paywall.tsx:91) i nagłówek z rolą `header` (app/paywall.tsx:86). Projekt sam zapisał, że iOS chowa potomków takiej grupy przed VoiceOver i XCTest (components/NowBoard.tsx:80). Żaden scenariusz Maestro nie stuka 'Manage subscription' (`dowody/sondy-kod.txt`, grep kod 1); testy Jest stukają przycisk po tekście, czego grupa w drzewie React nie blokuje. Ten sam układ w 025a50b (app/paywall.tsx linie 68 i 73 w bazie) — **istniało wcześniej**.
- Mechanizm: grupa `accessible` zastępuje potomków jednym elementem; podwójne stuknięcie aktywuje środek karty, nie przycisk; `grep -n 'accessible' app/paywall.tsx` → 2 grupy, tylko `paywall-owned` zawiera przycisk.
- Powraca: nie → strażnik: żaden element `accessible` (bez `accessibilityRole` przycisku) nie zawiera potomka z `onPress`
- Wzorzec lub źródło: podłoga VoiceOver roli (elementy interaktywne mają rolę i etykietę), docs/32 (VoiceOver jako część wzorca akcji).
- Kroki w aplikacji: VoiceOver włączony → Więcej → Ustawienia → wiersz „Masz plan: …” → karta stanu czytana jako jeden tekst, przycisku „Zarządzaj subskrypcją” nie da się wybrać.
- Opcje: (a) zdjąć `accessible` z karty, nagłówek zostaje nagłówkiem, przycisk osobnym elementem — tanie, kolejność czytania naturalna; (b) zostawić grupę z `accessibilityActions` „Zarządzaj subskrypcją” — mniej zmian, akcja ukryta w rotorze; Rekomendacja: (a) + strażnik.
- Test akceptacyjny: strażnik grup `accessible` z przyciskiem w środku (czerwony na obecnym kodzie); scenariusz 21 stuka „Manage subscription” po zakupie (XCTest widzi przycisk).
- Status: otwarte (poza bieżącą pętlą — istniało wcześniej, do decyzji właściciela)

### W-1 — „Zarządzaj subskrypcją” niedostępne dla VoiceOver

- **Kod:** app/paywall.tsx:84: `<View testID="paywall-owned" accessible accessibilityLanguage={lang()} ...>`. Przycisk z app/paywall.tsx:91 jest jego potomkiem. Karta nie ma `accessibilityActions` ani `onAccessibilityTap`, więc VoiceOver nie dostaje żadnej akcji zastępczej.
- **Sonda** (`npx jest tests/zz-sonda-w1.test.tsx --maxWorkers=1`, ten sam boot co w tests/subscription-ui.test.tsx, plan miesięczny aktywny). Pierwszy przebieg był czerwony przy zimnej pamięci podręcznej, przyczyny nie zapisałem; drugi zielony, kod 0, wypisał `ACCESSIBLE_ANCESTORS ["button","button","paywall-owned","paywall-owned"]`.
- **Dokumentacja RN** (przeczytana: https://raw.githubusercontent.com/facebook/react-native-website/main/docs/accessibility.md, sekcja `accessible`): „Note that this does not necessarily mean that the view will be focused by VoiceOver or TalkBack. There are a number of reasons for this, such as VoiceOver disallowing nested accessibility elements” oraz „On iOS, it translates into native `isAccessibilityElement`”.
- **Repo mówi to samo:** components/NowBoard.tsx:80 „iOS chowa potomków grupy przed VoiceOver i XCTest”; tests/m3-fix-e2e.test.tsx:19–20 ma strażnika `accessibleAncestor`, ale tylko dla tablicy „teraz”. Ekranu zakupu nie pilnuje żaden strażnik.
- **Inna droga w aplikacji:** nie ma jej. `manageSubscriptions` wywołuje tylko app/paywall.tsx:91, a components/SubscriptionCard.tsx:25 tylko otwiera `/paywall?reason=settings`. Poza aplikacją zostają systemowe Ustawienia iOS (konto Apple → Subskrypcje), więc anulowanie nie jest zablokowane. Funkcja w aplikacji jest jednak niedostępna dla VoiceOver.
- **Realność:** realny. Wystarczy VoiceOver i aktywna subskrypcja albo dożywotni dostęp z odnawiającą się subskrypcją (warunek `!lifetime || subActive`).
- **Poziom:** P1 pasuje do pkt 1 („bariera dostępności”). Kroki odtworzenia ze znaleziska są zgodne z kodem.


Zakres: tylko to ID. Każdy commit niesie w treści „[M1-audytor-generalny-039; 04-studio-projektowe-601]”; commity na tę gałąź, BEZ push (push robi koordynator po kontroli), bez scalania z main. Raport i dowody tylko w katalogu wyniku (fix-2026-10-28-p2), nie w katalogu audytu. Nowe problemy jako znaleziska, bez naprawy.
Na koniec, do 25 linii (to samo w wynik.md, plus pełna sekcja dowodów): commity (SHA → ID), testy przed/po (pliki), zmieniony scenariusz Maestro (ścieżka, co stuka), przekazania do 08 i 07, co otwarte i dlaczego, kroki właściciela (VoiceOver na urządzeniu).
