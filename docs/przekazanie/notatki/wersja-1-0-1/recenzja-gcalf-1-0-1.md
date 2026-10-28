# Recenzja niezależna (bramka 4, L-047): Standing Gastrocnemius Calf Stretch — 1.0.1

Recenzent: audytor (sesja 1.0.1, niezależny; nie pisał treści). Data: 28.10.2026.
Gałąź `wersja-1-0-1-r2`, HEAD 93a0db3 (scalenie r2/gastro 7ce44d9). Zakres: `git diff 79705f0 HEAD~1` (data, docs/research, cue-sets, pl/en).
Źródła otwarte samodzielnie 28.10.2026 (curl, kopie w scratchpad/src/): Physitrack ×3 (200), Prehab Guys (200), ACE #211 i #73 (200),
ulotka NHS (200, pdftotext). Powerline/manualslib: curl daje 403, odczyt przez WebFetch udany (zwrócone zdania jak niżej).

## Werdykty

| # | Pozycja | Werdykt | Dowód |
|---|---|---|---|
| 1 | Mięśnie `{calves: 0.25}` zamiast `{calves, hamstrings}` | ZATWIERDZONE | Żadne z 5 przeczytanych źródeł nie wymienia dwugłowych uda. Physitrack: „stretch in your calf”; NHS: kolano proste — Gastrocnemius, ugięte — Soleus; ACE #211 mięśnie: Gastrocnemius, Soleus. Waga 0,25 = konwencja katalogu dla rozciągań (Wall Calf Stretch, Standing Soleus And Achilles Stretch: `{calves:0.25}`, lib/catalog.generated.ts:1365, 1411), nazwana w nocie L3.json. Wygenerowane spójnie: catalog.generated.ts:1407, muscles.generated.ts:627. |
| 2a | Pewność „mocne” | ZATWIERDZONE | Definicja L3-zrodla.md:11: „mocne” = ≥ 2 niezależne organizacje zgodne. Organizacje: Physitrack, ACE, NHS Shropshire (podiatria), Powerline (producent) — 4 niezależne, szczebel 4. |
| 2b | L3-S36 Physitrack | ZATWIERDZONE | Dosłownie na stronie on-step: „Stand on a step and rest the ball of the foot to be stretch on the edge.” „Keeping the knee straight, drop this heel down until you feel a stretch in your calf.” „Hold this position.” Off-step: „You can hold onto a support if you need this for your balance.” |
| 2c | L3-S37 ACE #211 | ZATWIERDZONE | Dosłownie: „Place your left foot on the back of the step so only the ball of the foot is in contact with the step.” „The heel is off the step.” „Slowly lower the left (back) heel toward the ground while bending at the right knee.” „Hold the stretch for 15-30 seconds”. Opis wpisu („druga stopa płasko”, kolano nogi rozciąganej nienazwane) trafny. |
| 2d | L3-S38 NHS | ZATWIERDZONE | Dosłownie (pdftotext s. 1): „Alternatively stand on the stairs and drop your heels down with the legs straight and feel the stretch in the centre of the calf and then try with the knees bent where you should feel the stretch lower down the calf.” „Hold the stretch for 30 seconds.” |
| 2e | L3-S39 Powerline (manualslib) | ZATWIERDZONE z UWAGĄ | curl 403; WebFetch zwrócił: „With straight legs, lower heels as far as possible.”, „To stretch achilles tendon, raise heels slightly. Slightly flex the knees and then lower the heels.”, „Hold for 10 to 15 seconds.” — zgodne z wpisem i z odczytem badacza. UWAGA: WebFetch przepuszcza tekst przez model streszczający, więc to nie jest surowy plik (pewność ok. 85%). Pole `miejsce` w wskazowki-ogolne.json (gcalf.knee) można zaktualizować: ponowny odczyt się udał. |
| 3a | `gcalf.set` — „Stań przednią częścią stopy na krawędzi stopnia, pięta poza krawędzią.” / EN „…ball of your foot on the edge of a step, heel hanging off.” | ZATWIERDZONE | Physitrack (on-step) + ACE #211 — oba wprost; dodatkowo Prehab Guys („balls of your feet on the edge… heels off”) i NHS („stand on the stairs”). Bez liczb i nazw źródeł. |
| 3b | `gcalf.move` — „Z prostym kolanem opuść piętę poniżej krawędzi, aż poczujesz rozciągnięcie łydki, i przytrzymaj.” | ZATWIERDZONE | Physitrack: kolano proste + opuść piętę do odczucia rozciągania łydki + „Hold this position.”; NHS: „drop your heels down with the legs straight and feel the stretch”; Powerline: „With straight legs, lower heels”. ACE #211 (trzecie w przypisie) potwierdza tylko opuszczenie pięty, nie proste kolano — nie przeczy, ale nie jest podstawą „prostego kolana” (wystarczają Physitrack + NHS). Bez liczby sekund (źródła 10–15 / 15–30 / 30 s) — słusznie. |
| 3c | `gcalf.support` — „Przytrzymaj się czegoś stabilnego, na przykład ściany, dla równowagi.” | ZATWIERDZONE | Physitrack (off-step) „hold onto a support… for your balance” + ACE „fingertips on the wall for balance” (+ Prehab Guys „wall or an object to use for balance”). |
| 3d | `gcalf.knee` — „Kolano zostaje proste — z ugiętym rozciągasz niżej położoną część łydki.” / EN „…bending it shifts the stretch lower down the calf.” | ZATWIERDZONE | Część 1 (proste kolano): Physitrack, NHS, Powerline. Część 2 (ugięcie → niżej): NHS wprost („knees bent… lower down the calf”) + Powerline (ugięte kolana „to stretch achilles tendon” — kierunkowo zgodne: dolna część łydki). Dwie organizacje szczebla 4, żadne przeczytane nie przeczy. EN prawie dosłownie za NHS — sens, nie kopia zdania. |
| 3e | `err: []` (usunięte `st.mis.force`, `st.noBounce`, `st.breathe`) | ZATWIERDZONE | Żadne z przeczytanych źródeł wariantu na stopniu nie podaje częstych błędów poza ugiętym kolanem (zgodne z raportem badacza, sekcja 2 „Otwarte”). Brak dopisywania z jednego źródła — zgodnie z zasadą. |
| 3f | Anonimowość źródeł | ZATWIERDZONE | `grep Physitrack|Prehab|Powerline|shropscommunity` w lib/ app/ components/ assets/ — brak; lib/cues/data.json bez gcalf.* (zestaw niezrecenzowany jeszcze nie trafia do runtime). |
| 4 | `calf.step` — przypis ACE #73 → Physitrack „Heel raises on a step” + Prehab Guys „Heel Raise – Off Step” | ZATWIERDZONE | ACE #73 sprawdzony: „Stand 6-12" away from a wall… lift your heels off the floor” — wspięcie z podłogi, nie stopień; usunięcie słuszne. Physitrack dosłownie: „Stand up straight on a step, holding onto a supportive surface. Walk your feet back so that your heels are off the edge of the step.” Prehab dosłownie: „Place a step in front of a wall or an object to use for balance. Step onto the box with the balls of your feet on the edge of the box, and your heels off the box.” Razem z ExRx: 3 organizacje na całe zdanie (stopień, pięty poza krawędzią, podparcie). UWAGA (kosmetyczna): przypis Physitrack cytuje tylko „Walk your feet back…”, a podparcie opisuje dopiskiem; dosłowne zdanie o podparciu to „holding onto a supportive surface” — warto je wpisać do `miejsce`. |

## UWAGI (bez blokady)

- U1 (NISKIE, dokument wewnętrzny): `docs/research/25-biblioteka/L3-zrodla.md:27` — podsumowanie „generowane z L3.json” podaje „mocne 9, jedno źródło 64”, a L3.json ma teraz mocne 10, jedno źródło 61 (jedno źródło było nieaktualne już przed tą zmianą; „mocne” rozjechało się tą zmianą). Bez wpływu na aplikację.
- U2: Scalenie „Standing Hamstring and Calf Stretch → Standing Gastrocnemius Calf Stretch” (Q9) — po przedefiniowaniu to inne ćwiczenie; już zapisane jako otwarte w docs/21, nie oceniam.
- U3: Pozostałe 31 języków `gcalf.*` (de, ja przejrzane wyrywkowo — sens zgodny) — ocena przekładu należy do recenzenta lokalizacji.

## Wpis `zestawy` w docs/research/figury-recenzja.json

Zestaw kwalifikuje się do wpisu. Skrót bieżący (`node scripts/zrodla-runtime.mjs --skroty`, HEAD 93a0db3): `78c1fe12ffea`.

```json
"Standing Gastrocnemius Calf Stretch": {
 "rodzina": "stretch",
 "werdykt": "wyswietlana",
 "data": "2026-10-28",
 "stan": "zrecenzowana niezależnie (bramka 4, zestaw ogólny rozciągania z własnymi zdaniami gcalf.* i teksty wskazówek, 28.10.2026)",
 "autor": "tlumacz r2/gastro",
 "recenzent": "audytor (sesja 1.0.1, niezależny)",
 "kto": "audytor — recenzja niezależna treści zestawu (L-047, decyzja „003 → 1.0.1”, docs/18 28.10.2026)",
 "sha": "78c1fe12ffea",
 "uwagi": "Wariant na stopniu; 4 zdania sprawdzone z przeczytanymi źródłami szczebla 4 (data/zrodla/wskazowki-ogolne.json), każde ≥ 2 organizacje; bez liczb i nazw źródeł; err puste (brak źródeł na błędy wariantu). Ćwiczenie bez figury v2 — zestaw nie wyświetla się do czasu gotowej rodziny ruchu."
}
```

Czy zestaw może się pokazać: NIE (dziś). `components/ExerciseCues.tsx:33` pokazuje zestaw ogólny tylko gdy `v2 = !!figureSpec(key)`; `lib/figures/v2/figure.ts:26-31` zwraca null bez wariantu w VARIANTS, a gotowe rodziny v2 to tylko squat, bench_press, hinge (`scripts/zrodla-runtime.mjs` V2_RIGS). Wpis tylko dopisze ćwiczenie do `general` w lib/cues/data.json; ekran nadal nic nie pokaże (ćwiczenie nie ma też karty własnej, więc sekcji „Technika” brak). Zestaw stanie się widoczny dopiero z figurą v2 rodziny rozciągania — sam rysunek wymaga wtedy osobnej recenzji.
Uwaga techniczna: dodanie wpisu złamie `tests/gastro-calf-stretch-1-0-1.test.ts` (ostatni test oczekuje `zestawy[KEY]` undefined i braku w `general`) — trzeba go zmienić w tym samym commicie. Każda zmiana tekstu PL lub listy ok/err zmienia sha i wymaga nowej recenzji.

## Wynik

Brak znalezisk KRYTYCZNYCH/WYSOKICH/ŚREDNICH. Wszystkie 4 pozycje ZATWIERDZONE; dwie uwagi kosmetyczne (przypis Powerline i Physitrack w `miejsce`) i U1 (NISKIE, nieaktualne podsumowanie w dokumencie).
