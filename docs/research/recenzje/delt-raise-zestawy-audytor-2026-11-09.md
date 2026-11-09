# Recenzja niezależna (bramka 4, L-047) — zestawy ogólne przy figurze v2 delt_raise

Data: 2026-11-09. Recenzent: audytor (nie pisał zestawów ani kart). Gałąź delt-wlaczenie-wip @ 1cd586a5.
Rysunek: wpis v2 delt_raise w docs/research/figury-recenzja.json (sha b882c034cdce), pozy lib/figures/v2/poses/delt_raise.json.

## Lista kluczy (jak ustalona)

Warunek testu (tests/karty-recenzja.test.tsx:41): `b === "general"` i `figureSpec(k)` ≠ null (gotowa rodzina z pozą), bez V2_WSTRZYMANE i bez wyjątku z tests/recenzja-wyjatki-1-1.json.
Z 31 ćwiczeń w poses/delt_raise.json tryb `general` mają dokładnie trzy (pozostałe 28 to `own`):

| Klucz | rodzina zestawu | ok | err |
|---|---|---|---|
| Cable Seated Lateral Raise | raiseSide | lat.elbows, lat.height | mis.jerk |
| Machine Lateral Raise | raiseSide | lat.height, llc.control | mis.jerk |
| Y Raise (hantle) | raise | rear.elbows, curl.noSwing | mis.jerk |

Żaden z nich nie ma wpisu w „zestawy” ani w `zestawy_bez_wpisu`.
**Crucifix NIE jest na liście**: jego poza jest w lib/figures/v2/poses/chest_fly.json:7838 (rodzina chest_fly, status `planned`, lib/figures/v2/families.ts:48), nie w delt_raise — włączenie delt_raise go nie pokazuje. Oceniony niżej tylko informacyjnie (na przyszłe włączenie chest_fly); wpisu JSON nie proponuję.

Uwaga do ustalenia listy: przebieg `flock kolejki blokady verify npx jest tests/karty-recenzja.test.tsx` nie doszedł do uruchomienia: przez 30 min czekał w kolejce blokady (verify innych worktree) i został przerwany limitem czasu. Do potwierdzenia przez koordynatora jednym przebiegiem testu. Lista wyżej wynika z danych (pozy delt_raise × cue-sets.json × wyjątki).

## Werdykty

### Cable Seated Lateral Raise — wyswietlana
- lat.elbows „Łokcie lekko ugięte i prowadzą ruch — są na wysokości dłoni lub wyżej.” / EN „Elbows slightly bent and leading — level with or above your hands.” — źródła z karty Lateral Raise (hantle) (data/zrodla/cues.json: ace-26 krok 3, exrx DBLateralRaise; reguła lokiec_staly w data/zrodla/figury-sens.json cytuje też ExRx dla wersji z linką). Ten sam ruch bokiem, inny sprzęt i pozycja siedząca — uproszczenie (wariant sprzętu/pozycji).
- lat.height „Unoś mniej więcej do wysokości barków.” — te same źródła (ACE #26 krok 3, ExRx Execution).
- mis.jerk — źródła z Seated Cable Row (NASM Common Mistakes, ExRx), zasada ogólna kontroli ruchu, uproszczenie (analogia).
- Rysunek: tor ręki identyczny jak w zrecenzowanym Lateral Raise (hantle) przesunięty o wysokość siedzenia (chwyt y 40,3→94,2 vs 76→129,9; biegun łokcia w u = 1 [0, 1, 0,03] — łokieć nad nadgarstkiem; ramię do ok. 85°). Wpis v2 tego ćwiczenia „wyswietlana” (Ś-3 naprawione). Reguły rysunku lokiec_staly i lokcie_na_wysokosci_barkow_u1 (figury-sens) odpowiadają obu wskazówkom „ok”.
- Bez nazw źródeł, bez liczb, bez twierdzeń o zdrowiu.

### Machine Lateral Raise — wyswietlana (uwaga NISKA)
- lat.height — jw.; maszyna z dźwigniami wzdłuż ramion, rysunek do ok. barków (chwyt y 93,6 w u = 1, ten sam profil co wersja z linką).
- llc.control „Ruch płynny w obie strony, bez szarpania.” — źródła Lying Leg Curl (ACE #153, NASM), zasada ogólna kontroli na maszynie, uproszczenie (analogia). Merytorycznie poprawna.
- mis.jerk — jw.
- Uwaga NISKA (nie blokuje, backlog): llc.control i mis.jerk mówią to samo (pozytyw i błąd o szarpaniu) — zestaw ma de facto jedną wskazówkę ruchu mniej. Propozycja do backlogu: zamienić llc.control na lat.elbows albo zostawić. Nie jest to błąd treści.

### Y Raise (hantle) — wyswietlana
- rear.elbows „Kąt w łokciach stały przez cały ruch.” — źródła Reverse Fly (hantle) (ExRx DBRearLateralRaise „fixed elbow position”, ACE #34). Rysunek: łokieć 14–18° stały (wpis v2), biegunLokcia stały w każdej klatce — zgodne.
- curl.noSwing „Tułów nieruchomo: bez bujania i odchylania się.” — źródła Biceps Curl (hantle) (ACE #44, NASM). Na rysunku leżenie przodem na ławce 45° — „bez odchylania się” czytamy jako „klatka zostaje na oparciu”; kierunkowo zgodne, uproszczenie (analogia).
- mis.jerk — jw.
- Zapis badacza (data/zrodla/wskazowki-ogolne.json, przypisania): „bez lat.height — ręce idą wyżej niż barki” — zestaw słusznie nie zawiera lat.height (rysunek: ramiona do linii tułowia w „Y”).

### Crucifix — poza zakresem (ukryta: rysunek chest_fly planned) — przy włączeniu chest_fly: do poprawy
Informacyjnie, na wypadek włączenia rodziny chest_fly:
- To utrzymanie ciężarów w bok na wysokości barków (izometria) — przypisanie do raiseSide (wskazowki-ogolne.json, przypisania: „przytrzymanie ciężarów w bok… (izometria)”) i rysunek chest_fly, nie delt_raise.
- lat.height pasuje (wysokość trzymania).
- front.elbows „…w tym samym ustawieniu przez cały ruch” — treść (łokcie proste/lekko ugięte, stałe) pasuje, ale „ruch” przy trzymaniu bez ruchu jest nietrafne; źródło jest z unoszenia przodem (Front Raise) — w zestawie bocznego trzymania to analogia.
- plank.mis.breath „Wstrzymywanie oddechu.” — źródła z deski (Plank); figury-sens.json:7871 sam oznacza „jedno wskazanie pośrednie, do potwierdzenia źródłem opisu”. Wskazówka oddechu wymaga 2 zgodnych źródeł szczebla 4 i żadnego przeczącego (CLAUDE.md) — dla trzymania ciężaru (ćwiczenie siłowe z obciążeniem) przeczytanych źródeł brak.
- Proponowana zmiana przed wyświetleniem: front.elbows → wskazówka trzymania (np. „Łokcie proste lub lekko ugięte, ramiona nieruchomo w bok”) i plank.mis.breath → mis.jerk albo źródła dla Crucifix wprost; inaczej zestaw ukryty.

## Blok JSON do sekcji „zestawy” (bez sha — koordynator policzy skryptem)

```json
{
  "Cable Seated Lateral Raise": {
    "rodzina": "raiseSide",
    "werdykt": "wyswietlana",
    "data": "2026-11-09",
    "stan": "zrecenzowana niezależnie (bramka 4, L-047 A, przypisanie zestawu ogólnego do ruchu ćwiczenia i rysunku v2 delt_raise; teksty wskazówek PL/EN), 09.11.2026",
    "autor": "badacz merytoryczny (zestaw raiseSide, wskazowki-cwiczenia-04, 25.10.2026; źródła data/zrodla/wskazowki-ogolne.json); włączenie rodziny: programista delt_raise (delt-wlaczenie-wip @ 1cd586a5)",
    "recenzent": "audytor (recenzja niezależna L-047, 09.11.2026; nie pisał zestawów ani kart)",
    "kto": "audytor — recenzja niezależna zestawów ogólnych przy włączeniu rodziny v2 delt_raise, gałąź delt-wlaczenie-wip @ 1cd586a5; rysunek: wpis v2 delt_raise sha b882c034cdce",
    "uwagi": "Unoszenie bokiem siedząc z linkami: lat.elbows i lat.height ze źródeł karty Lateral Raise (hantle) (dwa źródła szczebla 4; reguła lokiec_staly cytuje też wersję z linką), mis.jerk ze źródeł Seated Cable Row — uproszczenie (wariant sprzętu i pozycji). …"
  },
  "Machine Lateral Raise": {
    "rodzina": "raiseSide",
    "werdykt": "wyswietlana",
    "data": "2026-11-09",
    "stan": "zrecenzowana niezależnie (bramka 4, L-047 A, przypisanie zestawu ogólnego do ruchu ćwiczenia i rysunku v2 delt_raise; teksty wskazówek PL/EN), 09.11.2026",
    "autor": "badacz merytoryczny (zestaw raiseSide, wskazowki-cwiczenia-03, 25.10.2026; źródła data/zrodla/wskazowki-ogolne.json); włączenie rodziny: programista delt_raise (delt-wlaczenie-wip @ 1cd586a5)",
    "recenzent": "audytor (recenzja niezależna L-047, 09.11.2026; nie pisał zestawów ani kart)",
    "kto": "audytor — recenzja niezależna zestawów ogólnych przy włączeniu rodziny v2 delt_raise, gałąź delt-wlaczenie-wip @ 1cd586a5; rysunek: wpis v2 delt_raise sha b882c034cdce",
    "uwagi": "Unoszenie bokiem na maszynie (dwie dźwignie wzdłuż ramion): lat.height ze źródeł karty Lateral Raise (hantle), llc.control ze źródeł Lying Leg Curl i mis.jerk ze źródeł Seated Cable Row — uproszczenie (wariant sprzętu, zasada kontroli ruchu na maszynie). …"
  },
  "Y Raise (hantle)": {
    "rodzina": "raise",
    "werdykt": "wyswietlana",
    "data": "2026-11-09",
    "stan": "zrecenzowana niezależnie (bramka 4, L-047 A, przypisanie zestawu ogólnego do ruchu ćwiczenia i rysunku v2 delt_raise; teksty wskazówek PL/EN), 09.11.2026",
    "autor": "badacz merytoryczny (zestaw raise, wskazowki-cwiczenia-02, 25.10.2026; źródła data/zrodla/wskazowki-ogolne.json); włączenie rodziny: programista delt_raise (delt-wlaczenie-wip @ 1cd586a5)",
    "recenzent": "audytor (recenzja niezależna L-047, 09.11.2026; nie pisał zestawów ani kart)",
    "kto": "audytor — recenzja niezależna zestawów ogólnych przy włączeniu rodziny v2 delt_raise, gałąź delt-wlaczenie-wip @ 1cd586a5; rysunek: wpis v2 delt_raise sha b882c034cdce",
    "uwagi": "Zestaw słusznie bez lat.height (ręce idą wyżej niż barki, zapis badacza). …"
  }
}
```
