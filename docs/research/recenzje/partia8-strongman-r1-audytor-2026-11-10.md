# Partia 8 — strongman (Yoke Walk), recenzja niezależna r1 (audytor, 10.11.2026)

Bramka 4 (L-047, L-050). Stan zamrożony: figury/partia-8-sled_strongman @ 75777836, odłączony worktree recenzenta. Recenzent nie pisał rodziny ani nakładki.

**Werdykt rodziny: wyświetlana** (0 × KRYTYCZNE/WYSOKIE; Ś1 do zapisu uproszczenia — tanie, zalecane przed wydaniem; N1 → backlog).

## Zakres i metoda
- Arkusz `arkusz-slad.mjs` Yoke Walk, widok side (jedyny widok rodziny), 21 kadrów, PNG 2100 px obejrzany w pełnej rozdzielczości; ślad = gryf (info.load), w każdym kadrze w tym samym punkcie (−12,2; 133,6), odstęp od tułowia 1,6 cm.
- Liczby z `frameAt`: miednica stała (86,0 cm), tułów 3° od pionu przez cały cykl, `checkFrame` 0 kolizji, stopy ≥ 0,4 cm nad podłogą.
- `assignAll()`: 10 ćwiczeń rodziny, 1 z rysunkiem (Yoke Walk); 8 OTWARTYCH, Jefferson Squat — wyjątek K3.
- Test figures-v2-strongman (4 testy) zielony.

## Znaleziska
| ID | Klasa | Pewność | Opis i miara | Realność |
|---|---|---|---|---|
| Ś1 | ŚREDNIE | 90% | Sprzęt na rysunku ≠ sprzęt ćwiczenia: rysowana sztanga z talerzami (`barbell`, len 190, plates), a katalog wymaga „Jarzmo (yoke)”. Położenie ciężaru i chód są poprawne (gryf 12,8 cm za środkiem barków, 2,3 cm niżej, na górze pleców; dłonie na gryfie ±30 cm), więc jako **uproszczenie sprzętu** jest dopuszczalne — ale nigdzie nie jest nazwane (brak wpisu w data/zrodla/figury-ograniczenia-silnika.json; figury-sens `otwarte_czesciowo` mówi tylko o rękach na jarzmie). CLAUDE.md: uproszczenie dozwolone, gdy nazwane. Naprawa: wpis uproszczenia (tani). | realny (każde wyświetlenie), bez błędu ruchu |
| N1 | NISKIE | 85% | Marsz na stale ugiętych kolanach: najmniejsze zgięcie kolana w cyklu 31° (wewn. ≤ 149°), noga podporowa w środku kroku ok. 38°, miednica 86 cm wobec 104 cm w staniu w innych ćwiczeniach (−18 cm). Karta (carry.walk) nie przeczy; marsz z jarzmem zwykle wyżej, krótkim krokiem. | realny, kosmetyczny |

## Pytania autora
4. **Sztanga zamiast jarzma:** dopuszczalne jako nazwane uproszczenie (Ś1) — ruch i miejsce ciężaru zgodne; nie dopuszczalne bez zapisu.
5. **Nakładka pusta:** uzasadnienie poprawne. Wszystkie reguły strongman mają pewność „analogia” (plecy, kolana, tulow_pion_marsz, tulow_bez_przechylu); karta Yoke Walk to zestaw ogólny carry z jedną wskazówką carry.walk bez reguły. Niespójność danych zgłoszona przez autora (komentarz figury-sens: zestaw ma carry.noLean, cue-sets.json: nie ma) — potwierdzam, decyzja badacza.
6. **Testy:** prezentacja GAIT_UI bez wpisu DATA_UI (dataUiForPose) — ocena w raporcie sled_throw (N3, teoretyczny).

## Zestaw ogólny (K12)
Yoke Walk, zestaw carry: carry.walk „Idź spokojnym, kontrolowanym krokiem na ustalony dystans albo czas.” — pasuje (marsz w cyklu, tułów pionowo, ciężar stały).

## Skróty (policzone samodzielnie, `node scripts/zrodla-runtime.mjs --skroty` @ 75777836)
v2 strongman 04b91430146d; zestawy: Yoke Walk 21ce36d7bae6.
