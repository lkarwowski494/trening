# Role mięśni — fala W2, rodzina `curl` (przedramiona)

Data: 2026-11-02. Autor: badacz-merytoryczny (G7). Zakres: tylko dane — bez zmian w kodzie i `data/zrodla/role-miesni.json`.
Wejście: wiersze bez roli z `muscleRoleRows` (brief koordynatora). Biceps w tych ćwiczeniach ma już rolę.

## Wniosek

Przedramiona w uginaniu nachwytem (reverse curl) i w Zottman curl pracują przede wszystkim jako **mięsień ramienno-promieniowy, który zgina łokieć**.
Potrzebna nowa funkcja `forearms.elbow_flex` (to samo zdanie co u bicepsa: „Zgina łokieć” / „Pomaga zginać łokieć”).

- Anatomia: ramienno-promieniowy zgina łokieć — S28 (TeachMeAnatomy, szczebel 4) i S1 (OpenStax, szczebel 3), dwa niezależne źródła.
- Ruch w ćwiczeniu: EMG S29-curl (szczebel 3) mierzy pobudzenie ramienno-promieniowego w uginaniu podchwytem, nachwytem i chwytem neutralnym;
  przy nachwycie pobudzenie podobne jak przy chwycie neutralnym (niższe niż przy podchwycie). Ten sam artykuł podaje funkcję: zgina łokieć.
- Zottman: faza w górę podchwytem, w dół nachwytem — ramienno-promieniowy pracuje w obu (S29-curl: aktywny przy każdym chwycie);
  S30-curl (abstrakt, szczebel 4) potwierdza dodatkowe obciążenie mięśni przedramienia w fazie opuszczania.
- Wariant sprzętu (hantle / linka / sztanga EZ na modlitewniku): ten sam ruch w stawie łokciowym tym samym chwytem — uproszczenie co do EMG (badanie nie rozróżnia sprzętu), funkcja anatomiczna się nie zmienia.

Czego NIE twierdzimy: że w reverse curl ramienno-promieniowy jest „bardziej aktywny” niż w zwykłym uginaniu — S29-curl pokazuje odwrotnie
(podchwyt > nachwyt), a starsze badania cytowane w przeglądach mówią co innego; zdanie roli mówi tylko, co mięsień robi.

## Tabela

| Ćwiczenie | Region (obc.) | Propozycja | Pewność | Źródła |
|---|---|---|---|---|
| Reverse Curl | forearms (1) | `forearms.elbow_flex`, main — „Zgina łokieć” | dwa źródła (anatomia S1, S28; ruch S29-curl) | S1, S28, S29-curl |
| Standing Dumbbell Reverse Curl | forearms (1) | `forearms.elbow_flex`, main | dwa źródła; wariant sprzętu (hantle) — uproszczenie co do EMG | S1, S28, S29-curl |
| Reverse Cable Curl | forearms (1) | `forearms.elbow_flex`, main | dwa źródła; wariant sprzętu (linka) — uproszczenie co do EMG | S1, S28, S29-curl |
| Reverse EZ-Bar Preacher Curl | forearms (1) | `forearms.elbow_flex`, main | dwa źródła; wariant sprzętu i ustawienia (modlitewnik) — uproszczenie co do EMG | S1, S28, S29-curl |
| Zottman Curl | forearms (0,5) | `forearms.elbow_flex`, aux — „Pomaga zginać łokieć” | dwa źródła (+ S30-curl dla fazy opuszczania) | S1, S28, S29-curl, S30-curl |
| Zottman Preacher Curl | forearms (0,5) | `forearms.elbow_flex`, aux | dwa źródła; wariant ustawienia (modlitewnik) — uproszczenie co do EMG | S1, S28, S29-curl, S30-curl |

Rozważone i odrzucone: `forearms.wrist_ext` (prostowniki nadgarstka trzymają nadgarstek przy nachwycie) — S29-curl wspomina tylko
„greater wrist stabilization” jako przypuszczenie autorów, bez pomiaru prostowników; za mało na zdanie roli. `forearms.grip` — chwyt jest,
ale w uginaniu nie jest głównym zadaniem przedramienia; zdanie o łokciu lepiej opisuje ruch.

### Blok do wdrożenia

```json
{
  "functions": {
    "forearms.elbow_flex": {
      "region": "forearms",
      "staw": "łokciowy",
      "ruch": "zgięcie (mięsień ramienno-promieniowy)",
      "pl": { "main": "Zgina łokieć", "aux": "Pomaga zginać łokieć" },
      "en": { "main": "Bends your elbow", "aux": "Helps bend your elbow" },
      "pewnosc": "dwa źródła",
      "status": "dwa_zrodla",
      "zrodla": ["S1", "S28", "S29-curl"],
      "uwaga": "Tylko jawna lista nameRules (uginanie nachwytem i Zottman). Region forearms = tu mięsień ramienno-promieniowy."
    }
  },
  "nameRules.reguly (dopisać)": [
    {
      "muscle": "forearms",
      "roles": ["main"],
      "function": "forearms.elbow_flex",
      "exercises": [
        "Reverse Curl",
        "Standing Dumbbell Reverse Curl",
        "Reverse Cable Curl",
        "Reverse EZ-Bar Preacher Curl"
      ],
      "uproszczenie": "Warianty sprzętu (hantle, linka, EZ na modlitewniku) tego samego zgięcia łokcia nachwytem; EMG S29-curl nie rozróżnia sprzętu."
    },
    {
      "muscle": "forearms",
      "roles": ["aux"],
      "function": "forearms.elbow_flex",
      "exercises": ["Zottman Curl", "Zottman Preacher Curl"],
      "uproszczenie": "Zottman Preacher Curl — wariant ustawienia ramienia (modlitewnik), ten sam ruch w łokciu."
    }
  ],
  "sources (dopisać)": [
    {
      "id": "S29-curl",
      "tier": 3,
      "cite": "Coratella G, Tornatore G, Longo S, Toninelli N, Padovan R, Esposito F, Cè E. Biceps Brachii and Brachioradialis Excitation in Biceps Curl Exercise: Different Handgrips, Different Synergy. Sports (Basel) 2023;11(3):64",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10054060/",
      "miejsce": "Results (brachioradialis, faza wznoszenia); Discussion",
      "cytaty": [
        "brachioradialis: „flexes the elbow and keeps the forearm in a neutral position”",
        "„the excitation of brachioradialis was similar in the neutral and pronated condition”"
      ]
    },
    {
      "id": "S30-curl",
      "tier": 4,
      "cite": "Melrose D. Exercise technique: the Zottman curl. Strength and Conditioning Journal 2014;36(1):92–93. doi:10.1519/SSC.0b013e318297a092",
      "url": "https://www.bisp-surf.de/Record/PU201403002256",
      "miejsce": "abstrakt (rekord bazy BISp; pełnego tekstu nie czytałem)",
      "cytaty": [
        "„enhanced eccentric overload of the forearm muscles during the movement”"
      ]
    }
  ],
  "sources (rozszerzyć cytaty istniejących)": {
    "S28": "Brachioradialis — Actions: „Flexes at the elbow. Contributes to supination at the proximal radioulnar joint.” (Jones O., akt. 12.12.2025)",
    "S1": "Muscles That Move the Forearm: „the brachioradialis can flex the forearm quickly or help lift a load slowly”"
  }
}
```

## Źródła

| Id | Adres i miejsce | Organizacja / autor | Szczebel i uzasadnienie |
|---|---|---|---|
| S1 (istn.) | openstax.org … 11-5-muscles-of-the-pectoral-girdle-and-upper-limbs — „Muscles That Move the Forearm” | OpenStax (Rice University), podręcznik recenzowany | 3 — podręcznik akademicki (jak w role-miesni.json) |
| S28 (istn.) | teachmeanatomy.info/upper-limb/muscles/posterior-forearm/ — Brachioradialis, Actions | TeachMeAnatomy, dr O. Jones, akt. 12.12.2025 | 4 — serwis anatomiczny z autorem-lekarzem i datą (jak S5–S16) |
| S29-curl | pmc.ncbi.nlm.nih.gov/articles/PMC10054060/ — Results, Discussion | Uniwersytet w Mediolanie (zespół Coratelli) | 3 — badanie EMG w recenzowanym czasopiśmie (10 kulturystów, mała próba) |
| S30-curl | bisp-surf.de/Record/PU201403002256 — abstrakt | Strength and Conditioning Journal (czasopismo praktyczne NSCA), kolumna techniki | 4 — artykuł techniki z autorem; przeczytany tylko abstrakt, więc wyłącznie jako uzupełnienie, nie jako jedno z dwóch źródeł |

Uwaga o szczeblach: pliku `szczeble-organizacji-2026-11-02.md` (gałąź `badania/lokalne-0211`) nie mogłem otworzyć w tej sesji (brak narzędzia git);
szczeble nadałem według hierarchii z CLAUDE.md i spójnie z istniejącymi wpisami S1–S28. Koordynator: sprawdzić S30-curl względem tego pliku.

## Otwarte

- [OTWARTE] Czy w uginaniu nachwytem przedramię ma też zdanie o trzymaniu nadgarstka (prostowniki) — brak pomiaru prostowników w przeczytanych źródłach.
- [OTWARTE] Pełny tekst S30-curl (opis faz Zottmana) — przeczytany tylko abstrakt; obecna propozycja na nim nie stoi.
- Decyzja produktowa dla koordynatora: zdanie przedramienia identyczne z bicepsem („Zgina łokieć”) — poprawne merytorycznie; jeśli UI ma je odróżniać, potrzebna wersja tekstu z tłumaczem/recenzentem lokalizacji, nie zmiana merytoryczna.
