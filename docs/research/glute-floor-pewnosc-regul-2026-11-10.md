# Rodzina figur `glute_floor` — pewność reguł (badacz, 10.11.2026)

Zakres: `data/zrodla/figury-sens.json`, sekcja `glute_floor` (linie 5626–5762 w chwili odczytu): reguły `plecy`, `biodro_do_linii`,
`miednica_podpora`, `rozstaw_kolan`, `miednica_bez_przechylu`, `miednica_bez_skretu` oraz `otwarte_czesciowo` (kickbacki stojąc / na maszynie).
Plik danych NIE był zmieniany — na końcu lista propozycji.

**Sposób odczytu (ważne):** wszystkie cytaty niżej są **z odczytu narzędziem (WebFetch, 10.11.2026)**, nie z surowego tekstu przez curl —
w tej sesji nie było dostępu do powłoki. Przed `--rehash` / zmianą pewności recenzent niezależny (L-047) powinien potwierdzić brzmienie na surowym tekście.
Szczeble wg docs/18 (02.11.2026, wpisy „szczeble organizacji” i uzupełnienia 2–3): ACE, ISSA, NASM, Catalyst = 4; HSS = 4 (organizacja ochrony zdrowia);
BarBend, Experience Life, Healthline = warunkowo 4 (per strona: autor z kwalifikacjami / nazwany recenzent); producent sprzętu = 4 tylko dla własnego sprzętu;
kilka stron tej samej organizacji = jedno źródło. Plik `docs/research/szczeble-organizacji-2026-11-02.md` nie istnieje na tej gałęzi (jest na `badania/lokalne-0211`) — szczeble wzięte z docs/18:138, 144, 145.

## Źródła przeczytane 10.11.2026

| ID | Adres | Szczebel | Autor / data |
|---|---|---|---|
| ACE-270 | https://www.acefitness.org/resources/everyone/exercise-library/270/quadruped-bent-knee-hip-extensions/ | 4 | ACE, biblioteka ćwiczeń |
| ACE-38 | https://www.acefitness.org/resources/everyone/exercise-library/38/side-lying-hip-abduction/ | 4 | ACE, biblioteka ćwiczeń |
| ACE-7409 | https://www.acefitness.org/resources/pros/expert-articles/7409/7-new-moves-to-challenge-your-glutes-and-hamstrings/ | 4 (ACE — jedno źródło z innymi stronami ACE) | Pete McCall, 30.10.2019 |
| ACE-6402 | https://www.acefitness.org/resources/pros/expert-articles/6402/5-ab-exercises-no-crunches-no-equipment/ | 4 (ACE) | Angel Chelik, 01.05.2017 |
| ACE-6355 | https://www.acefitness.org/resources/pros/expert-articles/6355/8-butt-toning-moves/ | 4 (ACE) | Mollie Martin, 21.03.2017 |
| ISSA-DK | https://www.issaonline.com/blogs/strength/donkey-kicks-benefits-and-variations-for-strong-glutes | 4 | „By ISSA”, 05.02.2024 |
| ISSA-ABD | https://issaonline.com/blog/post/hip-abduction-exercises-for-stronger-hips-and-glutes | 4 (ISSA — jedno źródło z ISSA-DK) | „By ISSA”, 05.02.2024 |
| NASM-CLAM | https://www.nasm.org/resource-center/blog/training/the-banded-clamshell-a-simple-move-for-stronger-glutes | 4 | Heather Cherry (CPT i in.), aktualizacja 22.07.2026 |
| CAT-766 | https://catalystathletics.com/exercise/766/Clamshell/ | 4 | Catalyst Athletics |
| HSS-BAND | https://www.hss.edu/health-library/move-better/mini-band-exercises-for-runners | 4 | HSS Rehabilitation and Performance, 23.07.2026 |
| BB-KICK | https://barbend.com/glute-kickbacks/ | warunkowo 4 — spełnione (autor Eric Bugera, CSCS) | aktualizacja 24.04.2024 |
| BB-BAND | https://barbend.com/resistance-band-exercises-for-glutes/ | warunkowo 4 — spełnione (ten sam autor; BarBend = jedno źródło z BB-KICK) | aktualizacja 17.11.2024 |
| PH-WOBBLE | https://www.performancehealthacademy.com/exercises/thera-band-wobble-board-hip-extension-with-band.html | warunkowo 4 (producent gum/desek, własny sprzęt; pole autora puste) — liczone tylko pomocniczo | 18.02.2005 |
| EL-DK | https://experiencelife.lifetime.life/article/break-it-down-the-donkey-kick/ | warunkowo 4 — spełnione? (autorka Maggie Fazeli Fard, RKC — kwalifikacja instruktorska; do potwierdzenia przez recenzenta) | 19.04.2023 |
| HL-DK | https://www.healthline.com/health/fitness-exercise/donkey-kick | warunkowo 4 — formalnie spełnione (autorka CPT, nazwana recenzentka R.D. — nie trener; słabe) | 19.12.2016 |

Szukane bez wyniku szczebla ≥ 4: Prone Flutter Kicks (wyniki wyszukiwania to strony aplikacji i serwisy szczebla 5; Fitness Volt — przeczytany, nie ma wersji leżąc przodem),
Machine Glute Kickback poza BB-KICK (brak instrukcji producenta maszyny).

## Tabela reguł

| Reguła (ćwiczenia) | Obecna pewność | Proponowana | Źródła (cytat, miejsce) | Uwagi |
|---|---|---|---|---|
| `plecy` — Donkey Kick | „jedno źródło bezpośrednie + analogia” | **ustalone (kierunek)**; liczba bez zmian: uproszczenie (−10°…15°) | ACE-270, krok 1: „Stiffen your core and abdominal muscles to position your spine in a neutral position… avoid any excessive sagging or arching.”; ISSA-DK, „How to Do a Donkey Kick Correctly”: „Don’t let your lower back sag. Don’t round it upward either.” | 2 niezależne źródła szczebla 4 wprost dla tego ćwiczenia, oba zakazują obu kierunków (łuk i zaokrąglenie) — zgodne z dwustronnym przedziałem. Analogia do bird dog już niepotrzebna. Pomocniczo EL-DK („Avoid arching your back up or down”, z odczytu). |
| `plecy` — Cable Kickback | j.w. (wspólna reguła) | **ustalone (kierunek)** | BB-KICK, „Common mistakes — Not Bracing Properly”: „Do not allow your lower back to arch, don’t flare your upper back, or sway your hips.”; ACE-6355, „Single-Leg Cable Extension”: „…until you cannot lift your leg anymore, all while keeping an erect torso.” | ACE mówi o tułowiu, nie wprost o lędźwiach — kierunkowo zgodne; HSS-BAND („without arching your low back”) to wariant sprzętu (guma) — „uproszczenie” do potwierdzenia recenzenta. |
| `plecy` — Hip Extension with Bands | j.w. | **ustalone (kierunek)** pod warunkiem przyjęcia PH-WOBBLE; inaczej „jedno źródło” | HSS-BAND, „Diagonal Hip Extension”: „…pressing into the tension of the band without arching your low back.”; PH-WOBBLE, krok 2: „Keep your back and neck straight.” | PH-WOBBLE to wariant na desce balansowej i źródło warunkowe; BB-BAND podaje tylko „firm core brace” (kierunkowo zgodne, nie wprost o plecach). |
| `plecy` — Machine Glute Kickback | j.w. | **jedno źródło + uproszczenie (wariant sprzętu z Cable Kickback)** | BB-KICK, sekcja maszyny: „Drive your working leg backward by pressing through the full foot.” + błąd „Do not allow your lower back to arch…” (sekcja ogólna strony) | Tylko BarBend; drugie źródło maszyny [OTWARTE]. Przeniesienie z wersji z linką wymaga potwierdzenia recenzenta, że ruch się nie różni. |
| `plecy` — Prone Flutter Kicks | j.w. | **bez zmian: analogia** | brak źródła szczebla ≥ 4 dla tego ćwiczenia | [OTWARTE]: źródło szczebla 4 dla wersji leżąc przodem. |
| `biodro_do_linii` — Donkey Kick | „analogia”; liczba konwencja (≤ 25°) | **jedno źródło wprost + 2 zgodne wnioskowane** → „ustalone (kierunek)” dopiero po potwierdzeniu recenzenta; liczba: konwencja (bez zmian) | EL-DK, „Lift”: „Keep your knee bent at 90 degrees and flex your foot, then lift one leg until your thigh is about parallel to the floor.” (plecy „flat and parallel to the floor” → udo w linii tułowia); ISSA-DK: „Picture this movement as if the bottom of your foot is going to press flat against the ceiling.” (przy kolanie 90° — udo poziomo; wniosek geometryczny); HL-DK krok 3: „Use your glute to press your foot directly toward the ceiling…”; górna granica: ACE-270 uwaga: „Only raise the leg to a height where the low back position can be maintained…” | Wprost tylko EL-DK (warunkowo 4). ISSA i Healthline — obraz „stopa ku sufitowi”, wnioskowanie geometryczne. Tolerancja 25° = konwencja. Nic nie przeczy. |
| `miednica_podpora` — Prone Flutter Kicks | „analogia” (cobra.hips) | **bez zmian: analogia** | brak bezpośredniego źródła szczebla ≥ 4 | Wzmianki „hips in contact with the floor” są tylko w serwisach szczebla 5 / stronach aplikacji (nie źródło). [OTWARTE]. |
| `rozstaw_kolan` — Clamshell, Fire Hydrant | „konwencja” | **ustalone (kierunek)**; liczba ≥ 15 cm: konwencja | Clamshell: NASM-CLAM: „…lift the top knee as high as possible” (z odczytu); CAT-766: „…open the hip to lift the top knee as far as possible and return under control.”; ISSA-ABD „Banded Clamshell”: „In this position, raise your right knee as far up as possible.” Fire Hydrant: ACE-7409: „Keep the spine long and brace the core muscles while slowly lifting the right leg out to the side (while keeping the knee bent).”; ISSA-ABD „Fire Hydrant”: „Begin by raising your right knee away from the body keeping the leg flexed at a 90-degree angle.” | Kierunek ruchu (kolana się oddalają) — po 2–3 niezależne źródła szczebla 4 dla każdego ćwiczenia. Próg 15 cm nie ma źródła → zostaje konwencja. ACE-7409 podaje cel „thigh almost parallel to the floor” (jedno źródło — nie do liczby). |
| `miednica_bez_przechylu` — Clamshell, Fire Hydrant | „ustalone” | **analogia (Clamshell); [OTWARTE] mapowanie (Fire Hydrant)**; liczba ±5°: konwencja | ACE-38 krok 2: „The hips should remain vertical to the floor…”; krok 2 dalej: „Continue raising the leg until the hips begin to tilt upwards…” — to **odwodzenie prostej nogi** (rodzina `hip_abd_add`), nie clamshell ani fire hydrant | Obecne „ustalone” jest zawyżone dla tej rodziny: bezpośrednie źródła clamshell mówią o **obrocie miednicy w tył** (to `skretTulowia`), nie o przechyle w płaszczyźnie czołowej (`przechylMiednicy`, docs/50-figury-v2.md:173). Fire Hydrant: ISSA-ABD „…without rotating or twisting the hips.” i ACE-6402 „…keep your hips level as you continue to move the right leg.” opisują miednicę równoległą do podłogi w klęku podpartym, czyli obrót wokół osi długiej — w układzie ciała to nie jest `przechylMiednicy` (który w klęku przesuwa biodro ku głowie). Do sprawdzenia przez programistę/recenzenta, co reguła faktycznie mierzy w klęku. |
| `miednica_bez_skretu` — Clamshell | „ustalone (kierunek)” (wniosek z ACE-38) | **ustalone (kierunek) — na źródłach bezpośrednich**; liczba ±10°: konwencja | NASM-CLAM: „…without allowing the hips to rotate backward” (instrukcja) i FAQ „…without allowing the pelvis to rotate backward” (z odczytu); ISSA-ABD „Banded Clamshell”: „It is important you do not rotate your hips or lift your left leg off the ground.”; CAT-766: „Without rolling the body…” | Pewność właściwa, ale `zrodlo` powinno wskazywać źródła clamshell zamiast wniosku z ACE-38. CAT-766 („rolling the body”) dotyczy raczej obrotu całego ciała — kierunkowo zgodne. Cue reguły to `hab.hips`; dla clamshell istnieją `clam.noRoll` / `clam.mis.roll` (cues.json:21310, 21338) — rozważyć jako `cue_dodatkowe`. |
| `otwarte_czesciowo` — kickbacki stojąc / na maszynie | [OTWARTE] (technika: kąt biodra bez znaku) | **merytorycznie: kierunek ustalony; technicznie nadal [OTWARTE]** | ACE-6355: „Slowly raise the heel by initiating the movement from the glutes…”; BB-KICK: „Drive your leg backward…” (krok 4, z odczytu); HSS-BAND: „Reach the opposite heel back and slightly out on a diagonal, keeping the leg straight…” | Kierunek (noga za linię tułowia) ma ≥ 2 źródła szczebla 4. Wysokości brak zgodnej: ACE „until you cannot lift your leg anymore”, BarBend „approximate 45-degree angle” (tylko wariant 45°), BB-BAND „about 45 degrees” — sprzeczne → żadnej liczby; ewentualny próg = konwencja. Blokada pozostaje techniczna (`jointAngles().hip` bez znaku). |

## Nowe zasady wskazane przez źródła (poza obecnymi regułami, do decyzji — nie wdrażać bez recenzji)

- **Donkey Kick — miednica bez skrętu:** EL-DK „Keep your hips level and squared to the floor.” (z odczytu) i HL-DK krok 3 „Ensure your pelvis and working hip stay pointed toward the ground.” — 2 źródła warunkowo 4; plus ACE-270 krok 2 „allowing movement only from the left hip joint”. Kandydat: dodać `miednica_bez_skretu` do wariantu Donkey Kick (kierunek ustalony po potwierdzeniu szczebla EL-DK/HL-DK).
- **Fire Hydrant — miednica bez skrętu:** ISSA-ABD + ACE-6402 (wyżej) — 2 źródła szczebla 4 wprost (ACE-6402 to wariant z uniesioną ręką). HSS-BAND „Avoid rotating your hips or turning your body.” dotyczy wersji stojącej — tylko pomocniczo. Kandydat: dodać `miednica_bez_skretu` do Fire Hydrant.

## Proponowane zmiany w `data/zrodla/figury-sens.json` (propozycja, nie wprowadzone)

1. `glute_floor.reguly.plecy.pewnosc`: „jedno źródło bezpośrednie + analogia” → „ustalone (kierunek) — Donkey Kick, Cable Kickback; Hip Extension with Bands: ustalone przy przyjęciu PH-WOBBLE; Machine Glute Kickback: jedno źródło + uproszczenie (wariant sprzętu); Prone Flutter Kicks: analogia”. `zrodlo`: dopisać ISSA-DK, BB-KICK, ACE-6355, HSS-BAND, PH-WOBBLE z miejscami jak w tabeli; `liczba` bez zmian.
   Jeśli pole `pewnosc` musi być jedno na regułę — rozważyć rozbicie reguły na `plecy` (Donkey Kick, Cable, Bands) i `plecy_analogia` (Machine, Prone Flutter Kicks).
2. `biodro_do_linii.pewnosc`: „analogia” → „jedno źródło wprost (EL-DK) + wnioskowane (ISSA-DK, HL-DK)”; po potwierdzeniu recenzenta geometrii „stopa ku sufitowi przy kolanie 90° = udo poziomo” → „ustalone (kierunek)”. `zrodlo`: zastąpić analogię bd.move źródłami Donkey Kick; `liczba` bez zmian (konwencja).
3. `miednica_podpora`: bez zmian; dopisać „[OTWARTE] brak źródła szczebla ≥ 4 dla Prone Flutter Kicks (szukane 10.11.2026)”.
4. `rozstaw_kolan.pewnosc`: „konwencja” → „ustalone (kierunek)”; `zrodlo`: NASM-CLAM, CAT-766, ISSA-ABD (clamshell), ACE-7409, ISSA-ABD (fire hydrant); `liczba`: bez zmian (konwencja ≥ 15 cm).
5. `miednica_bez_przechylu.pewnosc`: „ustalone” → „analogia (ACE-38 — odwodzenie prostej nogi)”; dla Fire Hydrant: [OTWARTE] — sprawdzić, czy `przechylMiednicy` w klęku podpartym mierzy to, o czym mówią źródła („hips level”); jeśli nie — usunąć tę regułę z wariantu Fire Hydrant na rzecz `miednica_bez_skretu`.
6. `miednica_bez_skretu`: pewność bez zmian („ustalone (kierunek)”); `zrodlo` zastąpić źródłami bezpośrednimi (NASM-CLAM, ISSA-ABD, CAT-766); rozważyć `cue_dodatkowe`: `clam.noRoll`, `clam.mis.roll`.
7. `warianty`: rozważyć dodanie `miednica_bez_skretu` do „Fire Hydrant” (ISSA-ABD + ACE-6402) i „Donkey Kick” (EL-DK + HL-DK) — zmiana zachowania figury, więc przez recenzję ruchu (bramka 4) i test.
8. `otwarte_czesciowo` („kickbacki stojąc / na maszynie”): dopisać, że kierunek ma źródła (ACE-6355, BB-KICK, HSS-BAND), a wysokość nie ma zgodnej liczby — blokada tylko techniczna.

## Otwarte pytania

- [OTWARTE] Potwierdzenie cytatów na surowym tekście (curl) — wszystkie są z odczytu narzędziem.
- [OTWARTE] Szczebel EL-DK (RKC jako kwalifikacja) i HL-DK (recenzentka dietetyczka) — decyzja wg reguły „warunkowo 4 per strona”.
- [OTWARTE] Szczebel PH-WOBBLE (producent, puste pole autora).
- [OTWARTE] Drugie źródło szczebla 4 dla Machine Glute Kickback i jakiekolwiek dla Prone Flutter Kicks.
- [OTWARTE] Co reguła `stopien_swobody` z polem `przechylMiednicy` mierzy w klęku podpartym (Fire Hydrant) — sprawa kodu/recenzenta, nie źródeł.
- Źródło cobra.hips (NASM Floor Prone Cobra, ACE #16) dla `miednica_podpora` nie było czytane ponownie 10.11.2026.
