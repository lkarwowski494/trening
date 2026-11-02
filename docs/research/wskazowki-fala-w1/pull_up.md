# Wskazówki techniki — rodzina `pull_up` (fala W1, G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Zakres: ćwiczenia rodziny `pull_up` bez własnych wskazówek: Dead Hang, Muscle Up, Mixed Grip Chin, Scapular Pull-Up, One Arm Chin-Up, Rope Climb, Wide-Grip Rear Pull-Up, Gironda Sternum Chins, Side To Side Chins, Gorilla Chin/Crunch. Pull Up, Chin Up i Neutral Grip Pull Up mają własne wpisy — bez zmian.
- **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

Metoda: zasada „wyjątek dla wskazówek techniki” (2 zgodne, przeczytane źródła szczebla 4 z różnych organizacji). Każde źródło otwarte 02.11.2026 przez WebFetch; miejsce podane przy zdaniu. ExRx: `exrx.net` zwraca 403, `web.archive.org` niedostępne dla narzędzia — ExRx w tej fali nie był źródłem. Strony innych aplikacji treningowych i serwisów generowanych automatycznie pominięto (uzupełnienie briefu koordynatora, 02.11.2026).

## 1. Uwaga do Dead Hang (próbna recenzja 02.11.2026)

Obecny zestaw ogólny Dead Hang (`lib/figures/v2/cue-sets.json`: `ok: ["npu.hang"]`) pokazuje zdanie `npu.hang` „Chwyć uchwyty pełnym chwytem (kciuk dookoła) i zawiśnij na prostych rękach.” Zdanie mówi o **uchwytach** (podciąganie chwytem neutralnym), a ćwiczenie i rysunek to **drążek**. Proponuję nowe zdanie `hang.grip` o drążku (sekcja 5) i wpis własny (sekcja 3), który zastępuje zestaw ogólny. Żadne istniejące zdanie nie pasuje wprost: `pu.grip` wymaga nachwytu „trochę szerzej niż barki”, a jedno z dwóch źródeł Dead Hang podaje szerokość barków i nie wspomina nachwytu.

## 2. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Dead Hang | general (`vpull`) | gotowe (krótka karta) | 2 organizacje: Physitrack, BarBend. Ustawienie i 2 wskazówki; brak „ruchu” (ćwiczenie izometryczne) i brak potwierdzonego błędu poza bujaniem. Ściągnięcie barków w dół — otwarte (sekcja 6). |
| Scapular Pull-Up | general (`vpull`) | częściowe (warunkowe) | Ustawienie + ruch potwierdzone przez Breaking Muscle (nowa organizacja, szczebel do przyjęcia) i Physitrack (wariant: krążenia łopatek w zwisie). Wpis w sekcji 3b — tylko jeśli koordynator przyjmie Breaking Muscle jako szczebel 4. |
| Muscle Up | open | otwarte | Jedno źródło szczebla 4 (BarBend) + sprzeczność z drugim tekstem (sekcja 6). |
| Mixed Grip Chin | general (`vpull`) | otwarte | Brak opisu w przeczytanych źródłach. |
| One Arm Chin-Up | general (`vpull`) | otwarte | Brak przeczytanego opisu techniki. |
| Rope Climb | open | otwarte | Jedno źródło (BarBend) opisuje zapięcie stopy; strony organizacji szkolącej (CrossFit) bez tekstu techniki (tylko wideo). |
| Wide-Grip Rear Pull-Up | general (`vpull`) | otwarte | Brak opisu w przeczytanych źródłach (podciąganie za kark). |
| Gironda Sternum Chins | general (`vpull`) | otwarte | Jedno źródło (Breaking Muscle, wariant „sternum chin-up”); reszta wyników to strony aplikacji i serwisy konsumenckie. |
| Side To Side Chins | general (`vpull`) | otwarte | Nie szukano szczegółowo (limit kontekstu); w przeczytanych przeglądach wariantów brak. |
| Gorilla Chin/Crunch | general (`hanging`) | otwarte | Nie szukano szczegółowo (limit kontekstu). |

## 3. Blok JSON do `exercises` w `data/zrodla/cues.json`

### 3a. Gotowe (≥ 2 źródła z różnych organizacji na każde zdanie)

```json
{
  "Dead Hang": {
    "setup": [
      {
        "c": "hang.grip",
        "s": [
          ["physitrack-dead-hang", "Step 1 (hands shoulder width apart); Step 2 (arms straight, lift your feet off the floor)"],
          ["barbend-grip-exercises", "Dead Hang — How to Do It (overhand grip, slightly wider than shoulder-width; hang from the bar)"]
        ]
      }
    ],
    "tips": [
      {
        "c": "hang.tight",
        "s": [
          ["physitrack-dead-hang", "Step 2 (keep your buttock muscles engaged)"],
          ["barbend-grip-exercises", "Dead Hang — How to Do It (maintain a tight core)"],
          ["barbend-women-pull-up", "Dead hang (make sure your entire body is tensed)"]
        ]
      },
      {
        "c": "pu.noSwing",
        "s": [
          ["physitrack-dead-hang", "FAQ (don't swing or jerk your body)"],
          ["barbend-women-pull-up", "Dead hang (you want to avoid swinging)"]
        ]
      }
    ]
  }
}
```

Uwaga: `barbend-grip-exercises` i `barbend-women-pull-up` to ta sama organizacja (BarBend) — liczą się jako jedno źródło organizacyjne; drugie to zawsze Physitrack.

### 3b. Warunkowe — tylko po przyjęciu Breaking Muscle jako szczebla 4

```json
{
  "Scapular Pull-Up": {
    "setup": [
      {
        "c": "scap.hang",
        "s": [
          ["breakingmuscle-shoulders-control", "The Simple Hang (allow yourself to hang freely, with your arms near your ears)"],
          ["physitrack-hanging-scap-retraction", "Step 1 (wariant: krążenia łopatek w zwisie; hang from your arms with your body fully extended)"]
        ]
      }
    ],
    "move": [
      {
        "c": "scap.pull",
        "s": [
          ["breakingmuscle-shoulders-control", "The Simple Hang (keeping your arms straight; shoulders move away from your ears, scapulae move down your back)"],
          ["physitrack-hanging-scap-retraction", "Step 2 (wariant: krążenia łopatek w zwisie; pull your shoulder blades back and down)"]
        ]
      }
    ]
  }
}
```

Zastrzeżenie: Physitrack opisuje krążenia łopatek w zwisie, nie samo unoszenie ciała łopatkami — to wariant, nie identyczne ćwiczenie. „Nie zginając rąk” potwierdza wprost tylko Breaking Muscle; Physitrack — pośrednio (zwis na wyprostowanym ciele). Jeśli koordynator uzna wariant za za daleki, Scapular Pull-Up przechodzi do „Otwarte”.

## 4. Nowe źródła

| id | org | tytuł | url | szczebel | czytane |
|---|---|---|---|---|---|
| physitrack-dead-hang | Physitrack | Step-by-step guide to the dead hang exercise | https://www.physitrack.com/exercise-library/how-to-perform-the-dead-hang-exercise | 4 | 02.11.2026 |
| physitrack-hanging-scap-retraction | Physitrack | Step-by-step guide to hanging scapular retractions | https://www.physitrack.com/exercise-library/how-to-perform-the-hanging-scapular-retractions | 4 | 02.11.2026 |
| barbend-grip-exercises | BarBend | The 10 Best Grip Exercises (sekcja Dead Hang; autor CSCS) | https://barbend.com/best-grip-exercises/ | 4 | 02.11.2026 |
| barbend-women-pull-up | BarBend | A Ladies' Guide to Your First Pull-Up (sekcja Dead hang; porady DPT) | https://barbend.com/women-pull-up-guide/ | 4 | 02.11.2026 |
| breakingmuscle-shoulders-control | Breaking Muscle | Get Your Shoulders Under Control (sekcja The Simple Hang; autorka M.S. human movement) | https://breakingmuscle.com/fitness/get-your-shoulders-under-control | 4 (propozycja) | 02.11.2026 |

Organizacje: Physitrack i BarBend — już w tabeli organizacji (`docs/research/27-wskazowki-zrodla.md`, szczebel 4). **Do decyzji koordynatora:** Physitrack to biblioteka ćwiczeń firmy oprogramowania dla fizjoterapeutów; repo przyjęło ją wcześniej jako szczebel 4, ale uzupełnienie briefu wyklucza „dokumentację innych aplikacji treningowych”. Moja ocena: to biblioteka ćwiczeń dla fizjoterapeutów, nie aplikacja treningowa dla konsumentów, więc zostaje zgodnie z wcześniejszą praktyką — jeśli koordynator uzna inaczej, Dead Hang traci drugie źródło i przechodzi do „Otwarte”.

Nowa organizacja (propozycja): **Breaking Muscle** — serwis specjalistyczny z artykułami trenerów; jakość zależy od autora (artykuł o muscle-upie napisała autorka, która sama pisze, że nie jest instruktorką — tego artykułu nie liczę). Proponowany szczebel 4 tylko dla artykułów autorów z wykształceniem lub certyfikatem trenerskim.

## 5. Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| hang.grip | Chwyć drążek na szerokość barków albo trochę szerzej i zawiśnij na prostych rękach. | Grab the bar about shoulder-width or a bit wider and hang with straight arms. | Physitrack (szerokość barków, proste ręce) + BarBend (trochę szerzej niż barki); część wspólna szerokości zgodnie z zasadą sprzeczności na tym samym szczeblu. Nachwyt podaje tylko BarBend — pominięty. |
| hang.tight | Trzymaj całe ciało napięte i spokojne. | Keep your whole body tight and still. | Physitrack (napięte pośladki, bez bujania) + BarBend (napięty brzuch / całe ciało). Brzuch i pośladki osobno potwierdza tylko po jednym źródle — stąd ogólne „całe ciało”. |
| scap.hang | Chwyć drążek i zawiśnij swobodnie na prostych rękach. | Grab the bar and hang freely with straight arms. | Breaking Muscle + Physitrack (wariant) — warunkowe (3b). |
| scap.pull | Nie zginając rąk, ściągnij łopatki w dół, z dala od uszu, potem wróć do swobodnego zwisu. | Without bending your arms, pull your shoulder blades down, away from your ears, then return to a relaxed hang. | Breaking Muscle + Physitrack (wariant) — warunkowe (3b). |

Istniejące zdanie użyte ponownie: `pu.noSwing` („Bez bujania i wymachów nogami.”) — źródła mówią o bujaniu ciałem; wymachy nogami to jego postać, jak w Pull Up.

## 6. Otwarte

- **Dead Hang — ściągnięcie barków w dół („aktywny zwis”):** potwierdza tylko BarBend (dwa artykuły, jedna organizacja); Physitrack mówi jedynie, by nie „przeciążać” barków. Istnieje też zwis bierny — bez drugiego źródła nie przesądzamy. Zestaw ogólny tego nie pokazuje, więc nic do usunięcia.
- **Dead Hang — oddech** („nie wstrzymuj oddechu”): tylko Physitrack.
- **Dead Hang — zestaw ogólny `npu.hang`:** zdanie o uchwytach nie pasuje do drążka (sekcja 1) — błąd zestawu ogólnego, do zastąpienia wpisem 3a.
- **Scapular Pull-Up — błąd „żebra do przodu”:** tylko Breaking Muscle.
- **Muscle Up:** BarBend (autor CSCS) opisuje: fałszywy chwyt trochę szerzej niż barki, zamach, podciągnięcie klatki do drążka z odchyleniem do tyłu, przerzut klatki i barków nad drążek, wyprost w podporze. Drugi przeczytany tekst (Breaking Muscle, wersja na drążku) uznaje odchylanie tułowia do tyłu przy podciąganiu za błąd — **sprzeczność**; jego autorka nie jest trenerką (szczebel 5, nie liczy się). Inne artykuły (Breaking Muscle, BarBend „5 steps”) dotyczą kółek gimnastycznych. Wspólne: przerzut głowy i barków do przodu nad drążek — tylko jedno źródło szczebla 4. Zostaje `open`.
- **Rope Climb:** zapięcie stopy (S-lock / J-hook) opisuje BarBend; strony CrossFit („The Rope Climb (Wrapping)”, „New way to rope climb”) nie mają tekstu techniki (tylko wideo) — wideo nie było czytane. Kontrolowane schodzenie bez zjeżdżania — brak źródła wprost. Zostaje `open`.
- **Gironda Sternum Chins:** opis „sternum chin-up” (klatka zamiast brody do drążka, otwarcie klatki, odchylenie) tylko w Breaking Muscle (autor trener sylwetki). Pozostałe wyniki to strony aplikacji i serwisy konsumenckie, wzajemnie sprzeczne co do chwytu (podchwyt / nachwyt) i głowy. **Zestaw ogólny** (`pu.shoulders`, `pu.elbowsDown`, `pu.noSwing`, `pu.partial`) — „łokcie w dół do boków” i „bez wyprostu na dole” nie są sprawdzone dla tego wariantu (odchylenie, klatka do drążka); do rozważenia przez koordynatora.
- **Mixed Grip Chin, One Arm Chin-Up, Wide-Grip Rear Pull-Up:** przeszukano ACE, NASM, BarBend, Breaking Muscle, ISSA, NSCA, Physitrack — brak przeczytanego opisu techniki tych wariantów (przeglądy wariantów podciągania BarBend i Breaking Muscle ich nie obejmują). One Arm Chin-Up: zestaw ogólny `vpull` nie mówi o kontroli rotacji tułowia — kluczowej według wyników wyszukiwania, ale nieprzeczytanej. Wide-Grip Rear Pull-Up (za kark): pozycja szyi i barków to temat zdrowotny — wymaga pełnych zasad, nie wyjątku dla wskazówek.
- **Side To Side Chins, Gorilla Chin/Crunch:** nie przeszukane (limit kontekstu).

## 7. Stan

- Zrobione: Dead Hang (gotowe, 3a), Scapular Pull-Up (warunkowe, 3b), Muscle Up / Rope Climb / Gironda (przeszukane, otwarte z powodem), Mixed Grip / One Arm / Wide-Grip Rear (przeszukane ogólnie, otwarte).
- Zostało: Side To Side Chins i Gorilla Chin/Crunch (nie przeszukane); ewentualnie drugie źródło dla Muscle Up (np. materiały organizacji szkolących z gimnastyki), Rope Climb (tekst techniki zamiast wideo), Gironda.
- Następny krok: decyzje koordynatora — (1) Physitrack jako źródło (wpływa na Dead Hang), (2) Breaking Muscle jako szczebel 4 (wpływa na Scapular Pull-Up).
- Pułapki: `exrx.net` — 403; `web.archive.org` — zablokowane dla narzędzia; `barbend.com/dead-hang/` — 404; strony CrossFit o wspinaniu po linie — tylko wideo; wiele wyników to strony aplikacji (wykluczone).
