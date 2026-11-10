# Stan partii 6 rodzin figur v2 (figury/partia-6)

Rodzina: plyo (27 ćwiczeń z danymi póz; Kneeling Jump Squat bez pozy — zestaw „open”). Gałąź od `origin/integracja-1-1` @ b66ecfa2 (10.11.2026). Sesja C tury 3; koordynator: session_01T66VBzARTWMJ7smU82sfJs.

Zysk: przed pracą pełna karta +0 (brak ról mięśni), figura v2 +27; po włączeniu i recenzji plyo przechodzi do grupy (c) symulacji (brakują tylko role) → cel 1.1 pełnej karty 458 → 485 (27 × role mięśni do uzupełnienia w 1.1). Pełne karty dziś: 371 (bez zmian); figura v2 dziś 386 → 413.

| Krok | Stan |
|---|---|
| Włączenie (ready, LOAD), nakładka overlay/plyo.ts, test rodziny, testy dostosowane, wyjątki toru (34) | zrobione lokalnie (b68d346, dff0a3f) |
| Limit poseData.ts (+44 B) | KO-024: podział per rodzina robi sesja E (`scal/posedata-podzial`); po sygnale koordynatora scalić integrację i przenieść wpis LOAD plyo do nowego układu; kodu nie wypychać do tego czasu |
| Recenzje niezależne (audytor): r1 dff0a3f do poprawy (W1 Broad Jump, W2 Butt Kick), r2 e73f097 do poprawy (W2), r3 77359b5 wyswietlana | zrobione (partia6-plyo-r1..r3) |
| Wpisy r3 1:1 (v2 plyo 10df52ff492a, 19 zestawów, karta Broad Jump), cele = symulacja (pelnaKarta 485, roleMiesni 551 — do weta), minimum podniesione, backlog P6-PLY-1..5 | zrobione (d0925c9) |
| Scalenie integracji po KO-024 (LOAD plyo do nowego układu), verify:szybkie, push, tests.yml, PRZEKAZANIE | czeka na sygnał koordynatora |

Przekład: nowe teksty UI — brak (faza „Skok” istnieje) → 0 USD.
Pułapki: elementy nakładki dla ćwiczeń z zestawem ogólnym pojawiają się dopiero z wpisem „zestawy” w figury-recenzja.json (test „każde ćwiczenie ma element” czerwony do tego czasu); test figures-v2-data i mapping dopuszczają ONE_WAY_UI dla plyo (wpis prezentacji z 28.10.2026, nie DATA_UI).

## Przekazanie 10.11.2026 (sesja C, kontekst ~39% — polecenie koordynatora)
Zrobione (SHA): włączenie b68d346, testy dff0a3f, r1 + poprawki e73f097, r2 + poprawka W2 77359b5, wpisy r3 + cele + minimum d0925c9, README/STAN ffff260; push na polecenie koordynatora po `verify:lekkie` (tests.yml czerwony tylko na `tests/architecture-limits.test.ts` — poseData.ts 24780 B > 24736 B; oczekiwane do KO-024, nie poprawiać progu).
Do weta koordynatora: (1) cele 1.1 = symulacja: pelnaKarta 458 → 485, roleMiesni 524 → 551 (plyo w grupie (c)); (2) 34 wyjątki toru skoków w tests/tor-wyjatki.json (docs/18, backlog P6-PLY-1); (3) testy figures-v2-data i figures-v2-mapping dopuszczają ONE_WAY_UI dla plyo; (4) próg W2 w teście: pięta ≤ 36 cm od środka miednicy (r3 zaakceptował; limit kolana 141°); (5) `pokrycie-katalogu --podnies-minimum` (43 metryki w górę).
Następny krok (C2, po sygnale KO-024): `git merge origin/integracja-1-1` (pliki generowane: wersja tej gałęzi + generatory — zrodla-runtime --write, v2-gen --write, pokrycie-katalogu --write, test-matrix --write, readme --write; figury-recenzja.json jako JSON — suma; docs/18/21 suma; pokrycie-cele = symulacja; minimum = max), przenieść wpis LOAD plyo do nowego układu z podziału poseData (i usunąć linię ze starego), skróty `--skroty` przed/po równe (v2 plyo 10df52ff492a), `npm run verify:szybkie`, push, zielony tests.yml, PRZEKAZANIE do koordynatora.
Pułapki: `node scripts/zrodla-runtime.mjs --write` po każdej zmianie póz/rodzin (reguly-cwiczen.json); generator plyo odtwarza plik bajtowo (`node scripts/figures/odtwarzanie-poz.mjs plyo`); jest pojedynczymi plikami `--runInBand` (strona-eksport ~2 min).
