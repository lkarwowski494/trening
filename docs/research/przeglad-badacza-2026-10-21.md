# Przegląd badacza — 21.10.2026

Zakres (zlecenie koordynatora): (1) dopisek o asekuracji (docs/10, sekcja „Asekuracja przy sztandze nad ciałem lub na barkach”, audyt M1-015),
(2) zdanie R1 o częstotliwości i sile, (3) docs/10 pkt 4.4 i zdanie „Krok zmiany (np. +2,5 kg) to konwencja”, (4) rejestr twierdzeń: T-005 i T-039.
Stan kodu: `origin/main` z 21.10.2026 (pliki czytane z gałęzi main).

## 1. Asekuracja przy ćwiczeniach ze sztangą na tułowiu lub nad głową

**Werdykt: POTWIERDZONE co do zasady (źródło szczebla 2, twierdzenie wprost) — brzmienie wymaga zmiany.**

Źródło (szczebel 2 — oficjalne standardy organizacji naukowej, oparte na badaniach i stanowiskach innych organizacji):
NSCA Strength and Conditioning Professional Standards and Guidelines, Strength Cond J 39(6), grudzień 2017,
https://www.nsca.com/globalassets/education/nsca_strength_and_conditioning_professional_standards_and_guidelines.pdf

- s. 11, rozdział „Program Supervision and Instruction”, **Standard 3.2**: „In conjunction with appropriate safety equipment (e.g., power racks), attentive spotting must be provided” — dla ćwiczeń, w których „free weights are supported on the trunk or moved over the head/face”.
- s. 1, „Notice” — podstawa dokumentu: „based on published scientific studies, pertinent statements from other associations, analysis of claims and litigation, and a consensus of expert views”.

Wnioski:
- Zasada „sztanga na tułowiu (przysiad, wykroki, good morning, Zercher) albo nad głową/twarzą (wyciskanie leżąc, JM press, wyciskanie nad głowę) → sprzęt asekuracyjny i osoba asekurująca” jest ustalona (wyjątek z CLAUDE.md: jedno źródło szczebla 2 z twierdzeniem wprost).
- NSCA mówi o sprzęcie **i** osobie asekurującej łącznie („in conjunction with”). Obecne „ustaw ramiona … **albo** ćwicz z osobą asekurującą” jest słabsze niż źródło — tego rozluźnienia źródło nie wspiera.
- Część „tak, aby dało się bezpiecznie odłożyć sztangę” (wysokość ramion) — w przeczytanym źródle tego nie ma; Standard 4.1 (s. 11) odsyła ogólnie do instrukcji producenta. Do aplikacji nie wpisujemy wysokości ani liczb.
- Standard dotyczy programów prowadzonych przez trenerów („participants”); przeniesienie na osobę ćwiczącą samodzielnie to **uproszczenie** (kierunkowo zgodne).
- Dopisek „bez asekuracji w stojakach” (EN „no safety arms in the rack”) — stwierdzenie stanu sprzętu w wybranym miejscu, zgodne ze Standardem 3.2 („appropriate safety equipment (e.g., power racks)”). **Bez zmian.** Etykieta „Asekuracja” / „Spotting and safety” — bez zmian.

**Maszyna Smitha:** Standard 3.2 dotyczy wolnych ciężarów („free weights”); maszyna Smitha (prowadnica) nie jest objęta tym zdaniem. **Dopisek nie powinien dotyczyć ćwiczeń na maszynie Smitha.** Czy przy maszynie Smitha potrzebna jest asekuracja — [OTWARTE], brak przeczytanego źródła. Wyciskanie w stojakach bez ramion asekuracyjnych to nadal wolny ciężar — dopisek ma zastosowanie.
Do sprawdzenia przez programistę: czy któreś z 29 ćwiczeń z `recommended: ["rack.safeties"]` jest wykonywane na maszynie Smitha; jeśli tak — usunąć zalecenie z tego wpisu katalogu.
**Sprawdzone 21.10:** żadne z 29 ćwiczeń nie jest wykonywane na maszynie Smitha (wszystkie mają `loadSource` sztanga lub sztanga EZ i nie mają `smith` w `requires`; ćwiczenia ze Smithem nie mają zalecenia `rack.safeties`) — zmiana katalogu niepotrzebna; pilnuje tego `tests/poprawki-tlumaczen-2026-10-21.test.ts`.

**Nowe brzmienie (do naniesienia przez tłumacza/programistę; słowników nie edytowałem):**

- PL: „Ćwiczenie ze sztangą na tułowiu lub nad głową i twarzą: zalecana asekuracja — stojaki z ramionami asekuracyjnymi oraz osoba asekurująca.”
- EN: „Barbell exercise with the bar on the trunk or over the head and face: safety equipment is recommended — a rack with safety arms, plus a spotter.”

Oznaczenie w rejestrze: źródło NSCA 2017 (Standard 3.2), rodzaje: „uproszczenie” (przeniesienie standardu dla programów na samodzielny trening). Brak liczb.
Nieudane próby drugiego źródła (nieprzeczytane, NIE liczą się): podręcznik NSCA „Basics of Strength and Conditioning” (403), Jumbelic 2007, J Forensic Sci 52(3):702–705, PMID 17456099 (streszczenie nie wspomina asekuracji wprost).

## 2. Zdanie R1 (częstotliwość a siła) — app/generator.tsx, components/OwnPlan.tsx

Brzmienie w aplikacji: „ACSM 2026: częstotliwość wpływa na siłę, ale brak dowodów na zależność dawka–odpowiedź, a przy równej objętości różnica słabnie” (EN: „…but there is no evidence of a dose-response relationship, and with equal volume the difference shrinks”).

**Werdykt: ZGODNE KIERUNKOWO, jedno sformułowanie do poprawy.** Źródło mówi „za mało dowodów”, nie „brak dowodów”.

Źródło (szczebel 2): Currier BS i in., ACSM Position Stand „Resistance Training Prescription for Muscle Function, Hypertrophy, and Physical Performance in Healthy Adults: An Overview of Reviews”, Med Sci Sports Exerc 2026;58(4):851–872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823/
- Discussion (akapit „This overview of reviews summarized RTx variable-level evidence…”): „there was insufficient evidence to conclude a dose-response relationship” oraz „the impact is diminished when volume is equated”.

Niezależnie (szczebel 2, metaanaliza; przeczytane streszczenie): Pelland JC i in., Sports Med 2026;56(2):481–505, doi:10.1007/s40279-025-02344-w — „suggesting strength gains increase with increasing frequency” (streszczenie, Results). Potwierdza część „wpływa na siłę”.

**Nowe brzmienie:**
- PL: „ACSM 2026: częstotliwość wpływa na siłę, ale za mało dowodów, by stwierdzić zależność dawka–odpowiedź, a przy równej objętości różnica słabnie”
- EN: „ACSM 2026: frequency affects strength, but there is not enough evidence to establish a dose-response relationship, and with equal volume the difference shrinks”

## 3. docs/10 pkt 4.4 i „Krok zmiany (np. +2,5 kg) to konwencja”

**Werdykt: POTWIERDZONE.** ACSM 2026 (PMC12965823) nie podaje progu 2–10% ani kroku w kg. Przeczytano cały tekst strony artykułu (treść, potem bibliografia — w bibliografii też brak).
- Discussion, akapit o progresji: „Progressive overload refers to the need to increase the stimulus (stressor) placed upon the muscle” — jako sposób wymienia zwiększanie obciążenia względnego (%1RM), bez wartości kroku.
- Że ACSM 2026 zastępuje poprzednie stanowisko: Discussion odnosi się do „the previous Position Stand” (ACSM 2009).
- Zdanie „Krok zmiany (np. +2,5 kg) to konwencja, a nie wynik badań.” / „The step (e.g. +2.5 kg) is a convention, not a research result.” — zgodne; oznaczenie „konwencja” jest poprawne. Bez zmian.
- Uwaga: treści przedziału 2–10% w samym ACSM 2009 nie sprawdzałem (płatny dostęp, poza zakresem) — sprawa T-003, [OTWARTE].

## 4. Rejestr twierdzeń (`docs/research/rejestr-twierdzen.json`)

**T-005** („Każda główna partia co najmniej {n} dni w tygodniu (WHO 2020 …; ACSM 2026 …) … uproszczenie (… Pelland i in. 2026)” (dalej zdanie o podziale na sesje jako konwencji)):
- WHO 2020 — potwierdzone: Bull FC i in., Br J Sports Med 2020;54(24):1451–1462, https://pmc.ncbi.nlm.nih.gov/articles/PMC7719906/, tabela 4, dorośli 18–64: „muscle-strengthening activities at moderate or greater intensity that involve all major muscle groups” — w tym samym wierszu: 2 lub więcej dni w tygodniu.
- ACSM 2026 — jak w pkt 2 (wymaga zmiany „brak dowodów” → „za mało dowodów”).
- Pelland 2026, liczenie serii pomocniczych jako 0,5 — potwierdzone (streszczenie): „0.5 for 'fractional'”; oznaczenie „uproszczenie” poprawne.
- „Podział na sesje … przy tej samej liczbie serii daje podobne efekty” — potwierdzone (szczebel 2, przeczytane streszczenie): Ramos-Campo DJ i in., J Strength Cond Res 2024, doi:10.1519/JSC.0000000000004774, PMID 38595233 — „does not significantly impact either strength gains or muscle hypertrophy when volume is equated” (Conclusions). Dopisać do `zrodla`.
- **Ocena:** potwierdzone po zmianie brzmienia z pkt 2. **`--rehash` dopiero po naniesieniu nowego brzmienia** (skrót liczony z tekstu), poleceniem:
  `node scripts/claims.mjs --rehash T-005 --przeglad "21.10.2026: badacz-merytoryczny — WHO 2020 tab. 4, ACSM 2026 Discussion ('za mało dowodów'), Pelland 2026 (0,5), Ramos-Campo 2024 (podział); docs/research/przeglad-badacza-2026-10-21.md"`
  i do `zrodla` dopisać „Ramos-Campo i in. 2024”.

**T-039** („Krok zmiany (np. +2,5 kg) to konwencja, a nie wynik badań.”):
- **Ocena:** potwierdzone jako konwencja (pkt 3). Tekst bez zmian, więc `--rehash` można wykonać od razu:
  `node scripts/claims.mjs --rehash T-039 --przeglad "21.10.2026: badacz-merytoryczny — ACSM 2026 (PMC12965823) nie podaje kroku ani progu 2–10%; konwencja; docs/research/przeglad-badacza-2026-10-21.md"`
- `--rehash` nie zmienia pozostałych pól — ręcznie: `rodzaje: ["konwencja"]` (zamiast „otwarte”), `zrodla: ["ACSM 2026"]`, `dokument: "docs/research/przeglad-badacza-2026-10-21.md"`, `fraza: "T-039"`, usunąć `uwaga` „[OTWARTE — źródło do wskazania]”.

## Poza zakresem — pozostają otwarte (przegląd badacza nie wykonany)

T-001, T-002, T-003 (w tym przedział 2–10% z ACSM 2009), T-004, T-006–T-038 — [OTWARTE], status bez zmian.

## Otwarte pytania

- [OTWARTE] Czy przy maszynie Smitha potrzebna jest asekuracja (brak przeczytanego źródła).
- [OTWARTE] Drugie niezależne źródło o asekuracji (podręcznik NSCA „Basics of Strength and Conditioning” — niedostępny przy tym przeglądzie). Nie blokuje: NSCA 2017 (szczebel 2) wystarcza.
- [OTWARTE] Wysokość ustawienia ramion asekuracyjnych — nie wpisywać do aplikacji bez źródła.
- [OTWARTE] Brzmienie ACSM 2009 o 2–10% (T-003).

Aplikacja nie udziela porad medycznych: przy bólu lub urazie — specjalista.
