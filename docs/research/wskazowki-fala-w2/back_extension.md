# Wskazówki techniki — rodzina back_extension (fala W2, 02.11.2026)

Tylko zbieranie danych (bez zmian w `lib/`, `data/zrodla/`, testach). Podstawa: `wskazowki-fala-w1/back_extension.md` (po uzupełnieniu 3);
źródła ACE #64, Catalyst #529, StayWell/OU Health i Les Mills — przeczytane w W1 (02.11.2026), cytaty stamtąd, szczeble bez zmian.
Bez twierdzeń o zdrowiu kręgosłupa. Rodzina ma pozy figur v2 — karta wchodzi dopiero z ≥ 1 błędem.

## 1. Tabela ćwiczeń

| klucz katalogu | stan | zdania | uwagi |
|---|---|---|---|
| Reverse Hyperextension | **gotowe** (W1 + błąd z W2) | W1: move 1, tips 2; W2: mistakes 1 | dopisany błąd `rhyp.mis.legsApart` (ACE + Catalyst, błąd = zaprzeczenie standardu; także wniosek z `rhyp.legsTogether`). Ustawienie (`rhyp.setup`) nadal wstrzymane — karta bez ustawienia |
| Lower Back Curl | **gotowe** (W1 + błędy z W2) | W1: move 1, tips 1; W2: mistakes 2 | `lbc.mis.headUp` (StayWell + Les Mills, błąd = zaprzeczenie standardu), `lbc.mis.tooHigh` (wniosek z `lbc.move`) |
| Weighted Ball Hyperextension | otwarte | 0 | W2: brak drugiego źródła szczebla 4 (p. 5) |

## 2. Blok do wdrożenia

Tylko nowe błędy (reszta kart — blok W1, bez zmian).

### Blok do wdrożenia

```json
{
  "Reverse Hyperextension": {
    "mistakes": [
      {"c": "rhyp.mis.legsApart", "s": [
        ["ace-64", "krok 2 (wariant: na piłce; „Press and hold your legs together so they move at the same time.”) — błąd = zaprzeczenie standardu"],
        ["catalyst-529", "opis ćwiczenia („Keep the feet close to each other”) — błąd = zaprzeczenie standardu"]
      ]}
    ]
  },
  "Lower Back Curl": {
    "mistakes": [
      {"c": "lbc.mis.headUp", "s": [
        ["staywell-ou-prone", "krok 3 („Keep your neck straight and your ears in line with your shoulders.”) — błąd = zaprzeczenie standardu"],
        ["lesmills-prone-cobra", "kroki wykonania („Keep your chin gently tucked so that your neck is long”) — błąd = zaprzeczenie standardu"]
      ]},
      {"c": "lbc.mis.tooHigh", "s": [["wniosek", "lbc.move"]]}
    ]
  }
}
```

Uwagi dla recenzenta:
- `rhyp.mis.legsApart` — zaprzecza `rhyp.legsTogether` (ta sama część ciała, to samo kryterium: nogi razem, ruszają się jednocześnie); da się narysować (nogi rozchylone / jedna wyżej). Oba źródła podają standard wprost, więc wpis jako „błąd = zaprzeczenie standardu” (reguła z uzupełnienia 2), nie tylko wniosek.
- `lbc.mis.headUp` — zaprzecza `lbc.neck`; da się narysować (głowa odchylona w tył, broda w górę).
- `lbc.mis.tooHigh` — zaprzecza `lbc.move` („unieś klatkę nieco nad podłogę”); da się narysować. Uwaga: „nieco” wprost tylko u Les Mills („you don't need to raise it super high”), StayWell mówi tylko „raise your chest off the floor”. Jeśli recenzent uzna, że „nieco” w `lbc.move` jest za mocne, ten błąd odpada, a karta zostaje z `lbc.mis.headUp` (dalej ≥ 1 błąd). Istniejące `cobra.mis` („Wyginanie pleców na siłę, za wysoko.”) celowo nieużyte — „na siłę” i łuk pleców nie mają źródła dla tego ćwiczenia.

## 3. Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| rhyp.mis.legsApart | Nogi rozjeżdżają się albo idą w górę osobno. | Letting your legs split apart or rise one at a time. |
| lbc.mis.headUp | Zadzieranie głowy do góry. | Craning your head up. |
| lbc.mis.tooHigh | Unoszenie klatki wysoko zamiast tuż nad podłogę. | Lifting your chest high instead of just off the floor. |

Sprawdzone istniejące: `mis.jerk`, `cobra.mis`, `bext.noArch`, `hang.noSwing` — nie pasują (zob. W1 i uwagi wyżej).

## 4. Źródła

| id | adres | organizacja | szczebel | miejsce |
|---|---|---|---|---|
| ace-64 | https://www.acefitness.org/resources/everyone/exercise-library/64/stability-ball-reverse-extensions/ | ACE | 4 (certyfikuje trenerów; treść firmowana) | krok 2 (czytane w W1, 02.11.2026) |
| catalyst-529 | https://catalystathletics.com/exercise/529/Reverse-Hyper/ | Catalyst Athletics | 4 (lista koordynatora) | opis ćwiczenia (czytane w W1) |
| staywell-ou-prone | https://library.ouhealth.com/Library/HealthSheets/3,S,90683 | StayWell (WebMD Ignite) w bibliotece OU Health | 4 (placówka medyczna, „Date Last Reviewed: 1/1/2025”) | krok 3 (czytane w W1) |
| lesmills-prone-cobra | https://www.lesmills.com/uk/articles/prone-cobra | Les Mills | 4 (szkoli i certyfikuje instruktorów; autor C. Baird, 18.12.2017) | kroki wykonania (czytane w W1) |

## 5. Otwarte

1. **Weighted Ball Hyperextension** — nadal tylko Gaiam (4); HKU CSE = 5; sprzeczność co do łuku lędźwi na górze (Gaiam: wygięcie, HKU: linia prosta) bez zmian. W2: ACE nie ma osobnego hasła „back extension” na piłce (wyszukiwanie 02.11.2026 zwraca tylko #63 hip extension, #64 reverse extensions, #67 shoulder stabilization); program piłki TheraBand na NCHPAD — 404 pod dwoma adresami; instrukcja Hanford (archiwum UNT) — nieczytana. Ciężar (talerz) — żadne źródło.
2. **Reverse Hyperextension — zestaw ogólny** (`cue-sets.json`: ok `bext.noArch`, `llc.control`; err `mis.jerk`) — z W1: `llc.control` i `mis.jerk` przeczą Catalyst (nogi opadają swobodnie, wymach). Karta własna go zastępuje; przy wdrożeniu sprawdzić, że zestaw ogólny nie zostaje obok.
3. **Reverse Hyperextension — `rhyp.setup`** — tylko Catalyst (W1); karta bez ustawienia. Do decyzji koordynatora, czy karta bez zdania ustawienia jest dopuszczalna (wymaganie „ustawienie + ruch + błąd” z briefu W2).
4. **Lower Back Curl — zestaw ogólny `cobra.*`** — z W1: analogia z innego ćwiczenia; karta własna go zastępuje.

## 6. Stan

- Zrobione: błędy dla obu kart „gotowych” z W1 (3 nowe zdania).
- Zostało: Weighted Ball Hyperextension; `rhyp.setup` (drugie źródło — instrukcja producenta maszyny reverse hyper).
- Pułapki: zdania ACE/Catalyst/StayWell/Les Mills cytowane za W1 — przy wpisie do `data/zrodla/cues.json` otworzyć strony ponownie (prawo cytatu, zgodność brzmienia).
