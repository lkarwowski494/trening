Nowa sesja (świeży kontekst) — subagent roli 06 Treści, tryb fix, część 2. Repo /home/user/trening, gałąź naprawy/M2-koordynator-napraw-2026-10-28-p1 (wybrana; HEAD 6935d54; nie przełączaj, nie wypychaj, bez workflowów GitHub).
Prompt roli: /tmp/claude-0/-home-user-trening/b36608ff-66bc-5613-a921-d96ac9b608e9/scratchpad/prompty/06-fix-b.md (przeczytaj w całości; CLAUDE.md ma pierwszeństwo). Plan zatwierdził właściciel; na STOP nie czekasz. Wynik: /home/user/trening/audit/M1-2026-10-27/role/06-tresci/fix-2026-10-28-p2b/wynik.md.

ZADANIE A — M1-audytor-generalny-038, decyzja właściciela 28.10.2026: „1a 2a ale żeby nie było znaku w aplikacji o tym dopisku. Jeżeli było zatwierdzone z ExRx to nie sprawdzajmy tego drugi raz.”
W drzewie są NIEZACOMMITOWANE zmiany koordynatora M2 (autor zmian = koordynator; Ty jesteś recenzentem niezależnym, L-047 A). Usunięte zdania:
- Pistol Squat: błąd sq.mis.kneesIn;
- Deadlift (hantle): dl.lower (ruch);
- Lunges (hantle), Walking Lunges, Reverse Lunge: lunge.knee (wskazówka) i lunge.mis.kneeIn (błąd); te trzy dopisane do listy partial;
- zestaw ogólny Decline Close-Grip Bench To Skull Crusher: skull.upperArm usunięte z ok (lib/figures/v2/cue-sets.json).
Pliki: data/zrodla/cues.json, lib/figures/v2/cue-sets.json, docs/research/27-wskazowki-zrodla.md, lib/cues/data.json (generowane). Zobacz git diff.
Do zrobienia:
1. Oceń, czy karty po usunięciu są poprawne i zgodne ze źródłami (pozostałe zdania były już recenzowane — sprawdź spójność i że nic błędnego nie zostało).
2. Zaktualizuj wpisy w docs/research/figury-recenzja.json: sekcja „karty” (5 kart: werdykt wyswietlana albo do poprawy, nowy skrót), sekcja „zestawy” (skull crusher) oraz wpisy figur v1, których skrót obejmuje wskazówki (test tests/figury-recenzja.test.tsx pokaże które, np. Lunges, Walking Lunges). Format L-047 A: stan „zrecenzowana niezależnie…”, autor: „koordynator M2 (usunięcie zdań, 28.10.2026)”, recenzent: rola 06. Hack Squat zostaje „do poprawy” (brak drugiego źródła o tym ćwiczeniu).
3. Decyzja 2a: w kartach opartych na ExRx (19) uwaga tylko w polu wpisu recenzji w repo — NIC w aplikacji ani w tekstach UI. Odwołań do ExRx zatwierdzonych wcześniej nie sprawdzasz ponownie.
4. node scripts/zrodla-runtime.mjs --write; testy: npx jest tests/karty-recenzja.test.tsx tests/figury-recenzja.test.tsx tests/cues.test.tsx tests/figures.test.tsx tests/zrodla-pelne-cues.test.ts --maxWorkers=1 — zielone; npm run check:pochodne — zielone.
Commit (Ty): jeden commit z „[M1-audytor-generalny-038; 03-zakres-601]” obejmujący zmiany koordynatora i Twoje wpisy (w treści: autor usunięcia — koordynator M2, recenzja — rola 06). Przed commitem git diff --cached; bez sekretów.

ZADANIE B — M1-audytor-generalny-021 (P2, M; DEC-05 a, rozstrzygają źródła): tekst „palce na zewnątrz zwykle 15–20°” wyświetlany z jednym przeczytanym źródłem szczebla 4 (T-054 otwarte; CLAUDE.md wymaga 2 zgodnych). Znalezisko: /home/user/trening/audit/M1-2026-10-27/reaudit-2026-10-28/06-tresci/06-tresci-reaudit-2026-10-28.md, sekcja „Wynik 06-tresci-003”.
Znajdź i PRZECZYTAJ drugie niezależne źródło szczebla 4 (albo wyższego) dla przedziału kąta stóp w przysiadzie; zapisz w rejestrze (docs/research/rejestr-twierdzen.json, data/zrodla) z cytatem 1–2 zdania i datą odczytu.
- Potwierdzone: zamknij T-054 i wpis rejestru (node scripts/claims.mjs --rehash ID po przeglądzie); w docs/18 wpis „5b” z 28.10.2026 zmień z „[wdrożenie: otwarte → M1-audytor-generalny-021 (pętla 2)]” na „[wdrożenie: kod] [test: …]” albo „[wdrożenie: bez kodu — powód]”.
- Niepotwierdzone: [DO USTALENIA]; tekst w aplikacji ZOSTAJE (decyzja właściciela 5b: do 1.0.1); nic nie zmieniasz w kodzie ani tekstach; opisz w wyniku.
Źródła anonimowo w aplikacji (tests/zrodla-wiedzy.test.ts). Osobny commit „[M1-audytor-generalny-021; 06-tresci-003]”, jeśli są zmiany.

Testy jest --maxWorkers=1; test:fast z NODE_OPTIONS=--max-old-space-size=6144; nie zostawiaj procesów jest w tle. Odpowiedź do 20 linii: commity, testy przed/po, werdykty, źródło 021 (adres, cytat, data) albo [DO USTALENIA].
