# Recenzja niezależna różnicy rysunku v2 — squat i hinge po partii P1 (09.11.2026)

Recenzent: audytor (nie autor P1; L-047). Porównanie: integracja-1-1 @ f1472e08 (przed) vs tekst/p1-squat-hinge @ 8353c08e (po), czyste kopie git archive.
Kopia „po z kartami widocznymi”: lista v2 w lib/figures/data.json przywrócona do 7 rodzin i 9 kart P1 odkryte w lib/cues/data.json (stan po wpisie i przekładzie) — ścieżka aplikacji (guidesOf, techniquesOf, errorsOf, badgesFor, onDrawingCues).

## Wynik porównania (md5)
- 48/57 ćwiczeń squat+hinge: bajtowo równe (kształty, mięśnie, styki, znaczki, linie, nakładka, ślad, dobór, etykieta VoiceOver „Na rysunku”), dla stanu poprawnego i każdego błędu.
- 9 ćwiczeń P1: ruch (shapesAt bez i z mięśniami, contactShapes) dla KAŻDEGO błędu możliwego w wariancie i ślad toru (trailFor) — równe. Różni się tylko: dobór (linie, nakładka, błędy), znaczki stanu poprawnego, etykieta VoiceOver.
  - Barbell Hack Squat: linie thighParallel,kneeToe,backLine → backLine; błędy roundBack+heels → heels; znaczki → hinge.back.
  - Bodyweight Squat, Dumbbell Squat: linie → kneeToe; błędy → kneesIn; znaczki → gob.stance (stopy), sq.kneesToes.
  - Overhead Squat: linie → brak; nakładka squatKneeLimb → brak; błędy → heels; znaczki → brak.
  - Squat with Chains, Squat with Bands: linie → kneeToe,backLine; błędy bez zmian (kneesIn, heels); znaczki → sq.kneesToes, sq.back.
  - Clean Deadlift: linie → backLine; nakładka hingeUprightRef → brak; błąd roundBack → barAway (nowa poza na ekranie); znaczki → dl.close, hinge.back.
  - Single Leg RDL (hantel/linki): dobór bez zmian; znika znaczek rdl.depth (miednica) — poza listą roznice_doboru autora (zgodnie z definicją skrótu, który znaczków nie obejmuje).
- Arkusze ze śladem toru, liniami i nakładką ze ścieżki aplikacji, kadry co 0,05, oba motywy, ramka jak w aplikacji (boxFor z błędami): 7 ćwiczeń przed i po, stan poprawny i każdy błąd. Jedyna nowa poza na ekranie — Clean Deadlift barAway (widok z boku): sztanga 11,8 cm przed goleniami na starcie, malejąco do 2,8 cm w wyproście, znacznik błędu na sztandze, ślad poprawnego toru przerywany — zgodne z „Sztanga odjeżdża od ciała”.

## Pola wpisów v2 (koordynator dopisuje datę/werdykt; sha i liczba z gałęzi @ 8353c08e)
squat:
- autor: programista P1 (tekst/p1-squat-hinge @ 8353c08e; karty własne P1, ruch bez zmian)
- recenzent: audytor
- sha: 1b2287ff6652 (node scripts/zrodla-runtime.mjs --skroty; ten sam przy rodzinach ukrytych i odkrytych)
- liczba: 25
- slad: Ruch i ślad bez zmian: md5 z czystych kopii f1472e08 i 8353c08e dla 25/25 ćwiczeń — kształty, mięśnie, styki i ślad toru równe dla stanu poprawnego i każdego błędu możliwego w wariancie; arkusze ze śladem (oba motywy, kadry co 0,05) dla 6 ćwiczeń P1 przed i po — pozy i ślad bez zmian, zmienia się tylko dobór linii, nakładki i błędów oraz znaczki.
- uwagi: Różnica 09.11.2026 po partii P1: skrót 6913ea2e7f22 → 1b2287ff6652 wyłącznie przez dobór po kartach (6 kart własnych: Barbell Hack Squat, Bodyweight Squat, Dumbbell Squat, Overhead Squat, Squat with Chains, Squat with Bands). 19 ćwiczeń bajtowo równych. Animowane błędy zgodne z kartami (heels, kneesIn), żaden błąd spoza karty. Warunek: strażnik spójności karta–rysunek po odkryciu rodziny ma luki (znalezisko 1).
hinge:
- autor: programista P1 (tekst/p1-squat-hinge @ 8353c08e; karty własne P1, ruch bez zmian)
- recenzent: audytor
- sha: 523c0b89bccc
- liczba: 32
- slad: Ruch i ślad bez zmian: md5 z czystych kopii f1472e08 i 8353c08e dla 32/32 ćwiczeń (kształty, mięśnie, styki, ślad toru; stan poprawny i każdy błąd wariantu); arkusz ze śladem Clean Deadlift przed i po (oba motywy, kadry co 0,05), w tym nowo pokazywana poza barAway — sztanga 11,8 cm przed goleniami na starcie, 2,8 cm w wyproście, ślad poprawnego toru bez zmian.
- uwagi: Różnica 09.11.2026 po partii P1: skrót bcc5dcf3b9f7 → 523c0b89bccc przez dobór po karcie Clean Deadlift (linie backLine, bez nakładki, błąd roundBack → barAway). Single Leg RDL ×2: dobór bez zmian, znika znaczek rdl.depth. 29 ćwiczeń bajtowo równych. Warunek: strażnik spójności karta–rysunek po odkryciu rodziny ma luki (znalezisko 1).

## Znaleziska
1. ŚREDNIE (wg progu; mechanicznie blokuje scalenie) · pewność 98% · realny · Karty P1 nie pokrywają reguł rysunku. Po odkryciu rodzin `tests/spojnosc-karta-rysunek.test.ts` ma 20 luk (dowód: przebieg z listą v2 przywróconą w lib/figures/data.json): Overhead Squat (plecy, kolana, zejście, głębokość), Barbell Hack Squat (kolana, głębokość), Bodyweight/Dumbbell Squat (plecy, głębokość), Chains/Bands (głębokość), Clean Deadlift (wyprost na górze — cdl.move kończy się na „aż minie kolana”, a rysunek idzie do pełnego wyprostu; start z podłogi), Single Leg RDL ×2 (3 reguły; treść slrdl.setup/slrdl.move pokrywa je słownie → cue_wariant). Przy ukrytych rodzinach strażnik ich nie widzi (bierze tylko shownFigureSpec), a STAN-P1 opisuje jego porażkę tylko jako skutek ukrycia (liczba 132). Kroki: scalić P1 i odkryć squat/hinge → strażnik czerwony; z obejściem — rysunek pokazuje głębokość, plecy i wyprost, o których karta milczy. Naprawa: zdania na kartach albo cue_wariant/wyjątek z powodem.
2. NISKIE · pewność 95% · brzegowy · Skrót recenzji rodziny nie obejmuje znaczków stanu poprawnego (okBadges zależą od id wskazówek karty). Dowód: w kopii przed usunięcie rdl.depth z zestawów Single Leg RDL zmienia znaczek, a hinge zostaje bcc5dcf3b9f7. Tutaj bez skutku (skrót zmienił się z innego powodu, znaczki tylko pokazują zdania z karty w stałych miejscach).
