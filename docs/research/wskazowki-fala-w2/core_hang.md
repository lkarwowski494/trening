# Wskazówki techniki — rodzina core_hang (fala W2, 02.11.2026)

Tylko zbieranie danych (bez zmian w `lib/`, `data/zrodla/`, testach). Podstawa: wynik fali W1 (`wskazowki-fala-w1/core_hang.md`, gotowe HLR i HKR —
nie badane ponownie), szczeble wg rozstrzygnięcia koordynatora linii 1.1 z 02.11.2026 (z uzupełnieniami 2–3; BarBend — warunkowo 4 dla artykułu
o technice z autorem z kwalifikacjami i datą). Decyzja właściciela 02.11.2026: Toes to Bar = wersja ścisła, bez wymachu.

## 1. Tabela ćwiczeń

| klucz katalogu | stan | zdania | uwagi |
|---|---|---|---|
| Toes to Bar | **gotowe** (W2) | setup 1, move 1, tips 2, mistakes 2 | nowe drugie źródło szczebla 4: BarBend (wersja ścisła, autor CSCS, data). `hang.slow` i `hang.ribs` z zestawu ogólnego — dla T2B tylko jedno źródło (Catalyst) → **nie w karcie**; karta własna zastępuje zestaw ogólny |
| L-Sit | **gotowe** (W2) | setup 1, move 1, tips 1, mistakes 1 | nowe źródło: BarBend (autorka z certyfikatem AFAA, data). FIG (warunkowo 4) jako trzecie przy `lsit.move`, drugie przy `lsit.legsTogether` i `lsit.setup` — zob. p. 5 |
| Hanging Leg Raise | gotowe (W1, bez zmian) | — | ma już błąd `hang.noSwing` (2 źródła) — nic do dopisania; ustawienie i ruch nadal po jednym źródle (p. 5) |
| Hanging Knee Raise | gotowe (W1, bez zmian) | — | jw. |

## 2. Blok do wdrożenia

### Blok do wdrożenia

```json
{
  "Toes to Bar": {
    "setup": [
      {"c": "hang.setup", "s": [
        ["catalyst-45", "opis ćwiczenia, zdanie 2 („Hang from a pull-up bar or stall bars.”; u Catalyst unoszenie nóg aż palce dotkną drążka — ten sam ruch co T2B)"],
        ["barbend-t2b", "instrukcja krok po kroku, krok 1 („Start by hanging from a bar with the hands slightly wider than shoulder-width apart.”)"]
      ]}
    ],
    "move": [
      {"c": "hang.t2b.move", "s": [
        ["catalyst-45", "opis ćwiczenia, zdania 3 i 5 (unieś proste nogi, aż palce dotkną drążka; „Return the legs to the hanging position under control.”)"],
        ["barbend-t2b", "instrukcja krok po kroku (wersja ścisła: unieś nogi aż do drążka; parafraza „bring your feet all the way up to the bar”)"]
      ]}
    ],
    "tips": [
      {"c": "hang.t2b.straight", "s": [
        ["crossfit-strict-t2b", "„Make sure to keep the legs together and as straight as flexibility will allow.”"],
        ["catalyst-45", "opis ćwiczenia, zdanie 3 (unoszenie prostych nóg; parafraza)"]
      ]},
      {"c": "hang.pressBar", "s": [
        ["crossfit-strict-t2b", "„Pushing into the bar with straight arms allows you to use the strength of the upper body to assist with elevating the legs.”"],
        ["barbend-t2b", "instrukcja krok po kroku (unosząc nogi, aktywnie ściągaj drążek dłońmi w dół; parafraza)"]
      ]}
    ],
    "mistakes": [
      {"c": "hang.noSwing", "s": [
        ["catalyst-45", "opis ćwiczenia, zdanie 3 („Without swinging, lift your straight legs up until the toes reach the bar…”)"],
        ["barbend-t2b", "instrukcja jest dla wersji ścisłej, krok z wymachem („kick”) pominąć w powtórzeniach ścisłych — błąd = zaprzeczenie standardu"]
      ]},
      {"c": "hang.t2b.mis.short", "s": [["wniosek", "hang.t2b.move"]]}
    ]
  },
  "L-Sit": {
    "setup": [
      {"c": "lsit.setup", "s": [
        ["fig-a202", "Element description, pkt 2 („Both hands are placed at the side of the body close to the thighs.”) — wersja na podłodze"],
        ["barbend-lsit", "instrukcja, krok o ustawieniu (dłonie na poręczach/paraletkach po obu stronach ciała, na linii barków; parafraza) — wersja na poręczach"]
      ]}
    ],
    "move": [
      {"c": "lsit.move", "s": [
        ["crossfit-lsit", "„The L-sit is performed by supporting the body entirely by the arms and holding the legs straight out in front.” (G. Glassman, 05.2003)"],
        ["barbend-lsit", "instrukcja (wyprostuj ręce, odepchnij się od podpór, unieś nogi przed siebie w kształt „L”; parafraza)"],
        ["fig-a202", "Element description, pkt 3–4 (ciało podparte rękami, tylko dłonie dotykają podłogi; nogi równolegle do podłogi)"]
      ]}
    ],
    "tips": [
      {"c": "lsit.legsTogether", "s": [
        ["fig-a202", "Element description, pkt 1 („Seated legs together.”)"],
        ["barbend-lsit", "instrukcja, krok o nogach (ściśnij nogi razem i unieś je przed siebie; parafraza)"]
      ]}
    ],
    "mistakes": [
      {"c": "lsit.mis.legsDrop", "s": [["wniosek", "lsit.move"]]}
    ]
  }
}
```

Uwagi dla recenzenta:
- `hang.setup` („Zawiśnij na drążku, ciało prosto w dół.”) — oba źródła mówią „zawiśnij na drążku”; „ciało prosto w dół” to opis swobodnego zwisu, nie osobne twierdzenie. Jeśli recenzent uzna to za za dużo — skrócić do „Zawiśnij na drążku.” (nowe id nie jest potrzebne, wystarczy zmiana tekstu przy wdrożeniu `hang.setup`, które i tak jest nowe z W1).
- `hang.pressBar` — tekst z W1 („Przez cały ruch dociskaj drążek w dół.”) zmieniony na „Unosząc nogi, dociskaj drążek w dół.”: BarBend mówi o dociskaniu przy unoszeniu nóg, nie „przez cały ruch”.
- `hang.noSwing` dla T2B: źródło 2 to reguła „błąd = zaprzeczenie standardu” (standard: wersja ścisła bez wymachu — BarBend wprost; decyzja właściciela 02.11.2026 wybiera tę wersję).
- `hang.t2b.mis.short` zaprzecza `hang.t2b.move` („aż palce stóp dotkną drążka”) — da się narysować (nogi zatrzymane w poziomie, daleko od drążka).
- `lsit.mis.legsDrop` zaprzecza `lsit.move` („trzymaj wyprostowane nogi przed sobą”) — da się narysować (ugięte kolana / nogi opadające ku podłodze).
- Zestaw ogólny `cue-sets.json` dla T2B (`f: hanging`, ok `hang.slow`, `hang.ribs`) — dla T2B po jednym źródle (Catalyst); karta własna go zastępuje.

## 3. Nowe zdania

| id | PL | EN (propozycja) | uwagi |
|---|---|---|---|
| hang.setup | Zawiśnij na drążku, ciało prosto w dół. | Hang from the bar with your body straight down. | z W1 (nie ma jeszcze w `pl.json`) |
| hang.t2b.move | Ze zwisu unieś nogi, aż palce stóp dotkną drążka, potem opuść je. | From a hang, raise your legs until your toes touch the bar, then lower them. | z W1 |
| hang.t2b.straight | Trzymaj nogi tak proste, jak pozwala gibkość. | Keep your legs as straight as your flexibility allows. | z W1 |
| hang.pressBar | Unosząc nogi, dociskaj drążek w dół. | As you raise your legs, press down on the bar. | z W1, **tekst zmieniony** (p. 2) |
| hang.t2b.mis.short | Nogi zatrzymują się w połowie, stopy nie dochodzą do drążka. | Stopping halfway — your feet never reach the bar. | nowe, wniosek |
| lsit.setup | Oprzyj dłonie po bokach ciała — na podłodze albo na poręczach. | Put your hands at your sides — on the floor or on parallel bars. | nowe |
| lsit.move | Unieś się na rękach i trzymaj wyprostowane nogi przed sobą. | Lift yourself up on your arms and hold your straight legs out in front of you. | z W1 |
| lsit.legsTogether | Trzymaj nogi razem. | Keep your legs together. | nowe |
| lsit.mis.legsDrop | Kolana się uginają albo nogi opadają. | Bending your knees or letting your legs drop. | nowe, wniosek |

Sprawdzone istniejące w `lib/cues/text/pl.json`: `hang.slow`, `hang.ribs`, `hang.noSwing`, `pu.grip`, `plank.brace` — poza `hang.noSwing` żadne nie ma dwóch źródeł dla T2B ani L-situ (`pu.grip`: szerokość chwytu i nachwyt tylko w BarBend — jedno źródło).

## 4. Źródła

| id | adres | organizacja | szczebel (uzasadnienie) | miejsce |
|---|---|---|---|---|
| catalyst-45 | https://catalystathletics.com/exercise/45/Hanging-Leg-Raise/ (czytane 02.11.2026 przez mail.catalystathletics.com) | Catalyst Athletics | 4 (lista koordynatora: serwis specjalistyczny, G. Everett — trener USA Weightlifting; hasło firmowane) | opis ćwiczenia, zdania 2–5; „Notes” |
| crossfit-strict-t2b | https://crossfit.com/essentials/the-strict-toes-to-bar (02.12.2019; czytane 02.11.2026) | CrossFit | 4 (certyfikuje trenerów CF-L1–L4; treść firmowana, z datą) | treść artykułu (ręce proste, nogi razem i proste) |
| barbend-t2b | https://barbend.com/toes-to-bar/ (czytane 02.11.2026) | BarBend | 4 warunkowo → spełnione: artykuł o technice; autor Mike Dewar — CSCS, MS fizjologia wysiłku, asystent trenera przygotowania motorycznego NYU; „Last updated October 11th, 2024”; bez „Expert Verified” | sekcja instrukcji krok po kroku (wprost: „the below step-by-step guide is for strict toes to bar”) |
| crossfit-lsit | https://www.crossfit.com/essentials/the-l-sit (cytat G. Glassmana, „3 Important Ab Exercises”, 05.2003; czytane 02.11.2026) | CrossFit | 4 (jw.) | całe zdanie opisu ruchu |
| barbend-lsit | https://barbend.com/l-sit/ (czytane 02.11.2026) | BarBend | 4 warunkowo → spełnione: autorka Bree-Anna Burick — certyfikat AFAA (instruktor zajęć grupowych, akredytacja krajowa), trenerka od 2016; „Last updated June 29, 2024”; bez „Expert Verified” | sekcja „How to do the L-sit” (ustawienie podpór, dłonie, ręce, barki, nogi) |
| fig-a202 | https://www.fig-aerobic.com/A202-L-SUPPORT_a1677.html (czytane ponownie 02.11.2026) | FIG — kodeks elementów gimnastyki aerobowej | 4 warunkowo (z W1: firmowane przez federację; (a) szkolenie trenerów nie potwierdzone lekturą) — przy każdym zdaniu L-situ jest też BarBend, a przy `lsit.move` dodatkowo CrossFit | Element description pkt 1–4 |

BarBend i CrossFit — różni właściciele (niezależne). Przeczytane, nie użyte: CrossFit L-sit nic nie mówi o barkach; BarBend L-sit „pull your shoulders down away from your ears” i „lock your elbows out” — po jednym źródle (p. 5).

## 5. Otwarte

1. **L-Sit — szczebel FIG.** Jeśli koordynator nie uzna FIG za 4, `lsit.setup` i `lsit.legsTogether` mają po jednym źródle (BarBend); karta zostaje z `lsit.move` (CrossFit + BarBend) i błędem wnioskowanym — nadal ustawienie/ruch + błąd, ale bez ustawienia. Do decyzji koordynatora.
2. **L-Sit — barki w dół, łokcie zablokowane, palce stóp wyciągnięte** — tylko BarBend (jedno źródło).
3. **L-Sit — sprzęt:** katalog zaleca poręcze (`dip.bars`), FIG opisuje podłogę, BarBend poręcze/paraletki/skrzynie — `lsit.setup` obejmuje oba (część wspólna: dłonie po bokach ciała). Figura (`core_hang.json`) — sprawdzić przy recenzji ruchu, czy rysunek pokazuje poręcze.
4. **T2B — `hang.slow`, `hang.ribs`:** po jednym źródle (Catalyst: kontrola przy opuszczaniu, podwinięcie miednicy jak w brzuszku; BarBend: „wciągnij pępek” — inne zdanie, brak opisu opuszczania).
5. **T2B — odchylenie do tyłu i głowa za ramionami** (BarBend) — jedno źródło; poza kartą.
6. **HLR, HKR — ustawienie i ruch** nadal po jednym źródle szczebla 4 (W1). BarBend T2B opisuje inne ćwiczenie (analogia — nie liczy się). Strona BarBend „hanging-leg-raise” — 404 (02.11.2026).
7. **Pytanie do koordynatora:** Catalyst #45 nazywa „hanging leg raise” ruch do drążka (palce do drążka) — to w praktyce T2B. Czy dla HLR w katalogu (zakres nieokreślony) karta ma mówić „przed siebie” (W1, `hang.legs.move`) czy „do drążka”? Do recenzji ruchu przy figurze.

## 6. Stan

- Zrobione: T2B i L-Sit — karty gotowe (ustawienie, ruch, ≥ 1 błąd); HLR, HKR — sprawdzone, mają błąd z W1.
- Zostało: p. 5 (pkt 1, 6, 7).
- Następny krok: decyzja koordynatora o FIG; drugie źródło ustawienia/ruchu HLR i HKR (ISSA, NFPT z autorem).
- Pułapki: BarBend — sprawdzać autora i datę na każdej stronie; WebFetch Catalyst działa przez `mail.catalystathletics.com`.
