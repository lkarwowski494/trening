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
