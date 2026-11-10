# Stan partii 6 rodzin figur v2 (figury/partia-6)

Rodzina: plyo (27 ćwiczeń z danymi póz; Kneeling Jump Squat bez pozy — zestaw „open”). Gałąź od `origin/integracja-1-1` @ b66ecfa2 (10.11.2026). Sesja C tury 3; koordynator: session_01T66VBzARTWMJ7smU82sfJs.

Zysk z `node scripts/pokrycie-symulacja.mjs` (10.11.2026, przed pracą): pełna karta +0 (żadne ćwiczenie plyo nie ma ról mięśni — „ciężkie”, backlog 1.2); figura v2 +27 (w celu 1.1 już liczone).

| Krok | Stan |
|---|---|
| Włączenie (ready, LOAD), nakładka overlay/plyo.ts, test rodziny, testy dostosowane, wyjątki toru (34) | zrobione lokalnie (b68d346, dff0a3f) |
| Limit poseData.ts (+44 B) | KO-024: podział per rodzina robi sesja E (`scal/posedata-podzial`); po sygnale koordynatora scalić integrację i przenieść wpis LOAD plyo do nowego układu; kodu nie wypychać do tego czasu |
| Recenzja niezależna r1 (audytor) na dff0a3f | w toku |
| Wpisy recenzji (v2, 18 zestawów) → figury-recenzja.json, pokrycie --write, verify:szybkie, push, tests.yml | otwarte |

Przekład: nowe teksty UI — brak (faza „Skok” istnieje) → 0 USD.
Pułapki: elementy nakładki dla ćwiczeń z zestawem ogólnym pojawiają się dopiero z wpisem „zestawy” w figury-recenzja.json (test „każde ćwiczenie ma element” czerwony do tego czasu); test figures-v2-data i mapping dopuszczają ONE_WAY_UI dla plyo (wpis prezentacji z 28.10.2026, nie DATA_UI).
