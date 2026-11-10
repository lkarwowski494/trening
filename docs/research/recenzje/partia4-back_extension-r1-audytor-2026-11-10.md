# Recenzja niezależna rodziny v2 `back_extension` — runda 1 (audytor, 10.11.2026)

Bramka 4 (L-047: autor ≠ recenzent; L-050: arkusze ze śladem toru). Stan zamrożony: `figury/partia-4-back_extension` @ aec8cda (baza 47e3715f), czysta kopia robocza recenzji.
Autor rodziny: programista (partia 4). Recenzent: audytor (nie pisał rodziny, nakładki, kart ani zestawów).

## Werdykt

| Wpis | Werdykt |
|---|---|
| v2 `back_extension` (4 ćwiczenia, 1 bez rysunku) | **do poprawy** (W1) |
| karta Back Extension | wyswietlana |
| zestaw Reverse Hyperextension (hipExt) | wyswietlana |
| zestaw Lower Back Curl (cobra) | wyswietlana |
| v1 | brak wpisów do zastąpienia (szkielet: `v1` pusty) |

## Znaleziska

| ID | Klasa | Pewność | Gdzie | Opis i miara (do testu odtwarzającego) | Realność |
|---|---|---|---|---|---|
| W1 | WYSOKIE | 90% | Lower Back Curl, linia „Kąt na rysunku” pod rysunkiem (`components/ExerciseFigureV2.tsx:125`) | Błędna liczba. Kąt biodra liczony w 3D od środka barków do stawu biodrowego przesuniętego w bok o 8,5 cm (`skeleton.ts:236–237`) daje 9,2° „zgięcia” w pozycji leżącej (w płaszczyźnie strzałkowej 1,5°); gdy udo przechodzi za linię tułowia o > 2 cm (`HIP_SIGN_TOL_CM`), znak się odwraca: u 0,55 → 0,60 wartość 9,4° → −9,5° (skok 18,9°, geometria zmienia się o 0,4°). Pozycja statyczna (u = 1) pokazuje „zgięcie biodra −11°” wobec rzeczywistego wyprostu 5,5°. Linia jest w ogóle widoczna tylko przez pozorny zakres 20,0° (`figure.ts:122–123`); rzeczywisty zakres ok. 7° jest poniżej progu 15° (`MIN_MEASURED_ROM`, `poseData.ts:48`), więc linii nie powinno być. Test: dla każdego ćwiczenia rodziny z `angleLineShown` — `|measuredAngle(u+0,05) − measuredAngle(u)| ≤ 5°` w kadrach co 0,05. Poprawka: wyjątek `hideAngle` dla Lower Back Curl (wzór Car Drivers, `DATA_UI.delt_raise`) albo pomiar w cm (uniesienie barków). | realny (każde otwarcie „Techniki” Lower Back Curl) |
| Ś1 | ŚREDNIE | 85% | Reverse Hyperextension, wszystkie kadry | Dłonie zaciśnięte w powietrzu: chwyt `[−55; 96]`, 40 cm przed przednią krawędzią podpórki (x −15) i 4 cm nad jej powierzchnią; sprzęt `rzymska` z `walki: false` nie ma uchwytów. Przeczytane źródła wykonania reverse hyper go nie opisują (`figury-sens.json`, `otwarte_czesciowo`), więc to nie sprzeczność ze źródłem, tylko nienaturalna kończyna bez podpory. Tułów leży na podpórce poprawnie: miednica 1,0 cm od krawędzi, barki tylko 14 cm poza podpórką (nie ok. 70 cm, jak zgłosił autor). Test: odstęp chwytu od `hyperPad` ≤ 1 cm (chwyt krawędzi podpórki) albo ręce zwisające. | realny, czytelność → backlog |
| N1 | NISKIE | 95% | Back Extension, Reverse Hyperextension — linia kąta | Ten sam przyczynek 3D: na górze „zgięcie biodra 10°” / „9°” przy ciele w linii (płaszczyzna strzałkowa 2,7° / 1,4°). Systemowe (Deadlift na górze 9,8°), nie nowe w tej rodzinie. | realny, kosmetyczny → backlog |
| N2 | NISKIE | 100% | `scripts/figures/agent-pozy/back_extension.mjs:21` | Komentarz wskazuje test `tests/figures-v2-back-extension-podpora.test.ts`, którego nie ma; test to `tests/figures-v2-back-extension.test.tsx`. | — |

## Sprawdzone bez znalezisk

- **K4/ślad**: 3 arkusze `arkusz-slad.mjs` (rzut side, kadry co 0,05, pełna rozdzielczość) i `arkusz-nakladka.mjs` dla Back Extension. Bez ciężaru — ślad miednicy: nieruchoma na podpórce (Back Extension, Reverse Hyperextension), na podłodze y 9,5 cm (Lower Back Curl).
- **K5/K8, ruch wobec reguł i źródeł**: Back Extension — biodro 2,7° → 80,7° (płaszczyzna strzałkowa; źródło: ok. 90° — w regule ≥ 70°), kolano 5°, kręgosłup prosty 0,0° we wszystkich kadrach; Reverse Hyperextension — biodro 84,8° → 1,4°, kolano ≤ 10°, nogi w linii z tułowiem bez przeprostu; Lower Back Curl — barki +6,1 cm (reguła ≥ 5 cm), miednica bez ruchu.
- **K7, styki**: Back Extension — miednica 0,8 cm nad podpórką, udo −0,7 cm, tułów −0,8…0,8 cm, łydka–wałek 0,2 cm (stopa 1,2 cm, ale styk zapewnia łydka); Reverse Hyperextension — miednica 1,0 cm, udo −0,8…2,9 cm (uda na podpórce tylko przy nogach w dół), tułów −0,9 cm. Walidator `v2-validate.mjs` — OK dla 3 póz.
- **K6**: podpórka 45° opada ku stopom, wałek nad tylną stroną kostek; reverse hyper — podpórka pozioma, nogi wolne za jej końcem.
- **Fazy**: Back Extension zaczyna od góry (Opuszczanie 2 s, Unoszenie 1 s, wyjątek `lowerFirst`); Reverse Hyperextension i Lower Back Curl — Unoszenie 1 s, Opuszczanie 2 s.
- **Nakładka** (`overlay/back_extension.ts`): jeden element `bextHipLimb`, reguła `zgiecie_w_biodrach` („ustalone”), cue `bext.move` ∈ `wskazowki_na_reguly`, tylko rzut z boku, tylko przy własnej karcie Back Extension; łuk = kąt mierzony ±1°. Odrzucenia uzasadnione: `wyprost_na_gorze` (pion z zawiasu nie pasuje do ławki 45°; łuk pokazuje szczyt), `plecy_neutralne` (linię pleców rysuje już silnik przy hinge.back), reguły Lower Back Curl mają pewność „analogia”.
- **Wyjątek Weighted Ball Hyperextension**: uzasadniony — w kontrakcie talerz to tarcza w płaszczyźnie y–z (przy tułowiu poziomym byłby prostopadle do klatki, nie płasko na niej), a styk piłki z osią tułowia daje wnikanie > 3 cm przy zgięciu ≥ 70°. Zapisany w `WYJATKI` generatora, w teście (`figureSpec` = null), w docs/51 i BRD.
- **Karta Back Extension (K11)** i **zestawy (K12)**: każde zdanie pasuje do rysunku (szczegóły w pliku JSON); błędy (`mis.jerk`, `cobra.mis`) tylko tekst.
- **K14** (`git diff 47e3715f..aec8cda -- tests/`): `figures-v2-data` — rodzina wyłączona z ogólnej pętli faz, zastąpiona testem rodziny (fazy, staw, progi z danych reguł); próg wysokości kadru 20 cm tylko dla Lower Back Curl (sylwetka leżąca, barki ≤ 16 cm) — uzasadnione; mapping, eksport strony (217), regresja nakładek, skrót — liczby zgodne z włączeniem 3 ćwiczeń; generator — `back_extension` dopisany do `W_ZAKRESIE` (zaostrzenie). Luka: brak testu ciągłości liczby pod rysunkiem (W1).
- **K9**: `liczba` = 4, `bez_rysunku` = [Weighted Ball Hyperextension] (`recenzja-szkielet.mjs back_extension`).

Skróty (`zrodla-runtime.mjs --skroty`, kopia recenzji @ aec8cda): v2 back_extension 5174f59d194f; karta Back Extension 22159fe935b0; zestawy Reverse Hyperextension 2552fa39017b, Lower Back Curl cfcd14a3dc6d.
