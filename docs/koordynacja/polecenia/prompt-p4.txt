Linia 1.1 aplikacji Trening — PARTIA RODZIN 4: dip, chest_press_machine, cable_press, back_extension, thruster. Po polsku. Jesteś programistą tej partii w sesji chmurowej (własna maszyna, bez kolejki verify.lock). Koordynator linii 1.1: session_01T66VByJCWCao1Hw3is68Cy (raporty przez send_message).

Kontekst (właściciel 09.11.2026, docs/18): cel 1.1 = wszystkie rodziny z danymi póz v2 włączone i zrecenzowane (wariant C, pełna karta 457; scripts/pokrycie-symulacja.mjs). Skrót recenzji rodziny liczony z WYNIKU rysunku (gałąź skrótu per rodzina scalona; scripts/zrodla-runtime.mjs --skroty) — zmiana Twojej rodziny nie unieważnia innych.
Wzór kompletnego włączenia: rodzina delt_raise na gałęzi `figury/delt_raise` (tylko do czytania): commity programisty, raporty docs/research/recenzje/delt-raise-*.md/json, wpisy w docs/research/figury-recenzja.json, nakładka lib/figures/v2/overlay/delt_raise.ts.

Gałąź: `figury/partia-4` od `origin/integracja-1-1`. Przeczytaj CLAUDE.md (bramka 4: recenzja ruchu z arkuszem i śladem toru ciężaru — pole `slad`, tests/figures-v2-tor.test.ts; L-047: autor ≠ recenzent — tests/l047-recenzja-niezalezna.test.ts) i docs/32 (wzorce).

Dla każdej rodziny:
1. Sprawdź dane póz v2 (lib/figures/v2/poses/*.json) i co daje włączenie: `node scripts/pokrycie-symulacja.mjs` (zysk rodziny).
2. Włącz rodzinę (status ready, rejestracja jak delt), nakładka techniki TECHNIQUE.<rodzina> (lib/figures/v2/overlay/<rodzina>.ts + rejestr w overlay.ts — rejestr dopisuj, nie przestawiaj; inne partie robią to samo równolegle), zestawy ogólne wskazówek (lib/figures/v2/cue-sets.json), karty v1 tej rodziny → wpisy „karty” wobec v2 albo status zastapiona.
3. Arkusze ruchu ze śladem toru (pozy kluczowe + ślad) dla każdego ćwiczenia rodziny.
4. RECENZJA NIEZALEŻNA: zleć ją subagentowi typu `audytor` (inny agent niż autor; nie Ty) — recenzja ruchu z arkuszem i śladem, nakładki i zestawów; zapis w docs/research/recenzje/<partia>-<rodzina>-*.md/json z polami autor ≠ recenzent; wpisy v2/zestawy/karty w docs/research/figury-recenzja.json z sha ze skryptu (`node scripts/zrodla-runtime.mjs --skroty`, nigdy z pamięci). Znaleziska WYSOKIE → poprawka → ponowna recenzja tym samym trybem. Rodzina bez czystej recenzji zostaje planned (nie wyświetlana) — zgłoś, nie obchodź bramki.
5. Nowe teksty UI/wskazówek: PL/EN przez t()/słownik, rejestr twierdzeń (`node scripts/claims.mjs --stub`), przekładu API NIE uruchamiaj — przygotuj zestaw przekładu i szacunek kosztu (tryb szacunku workflowu przekładu), raport do koordynatora (limit kosztów właściciela).
6. `node scripts/pokrycie-katalogu.mjs --write`, BRD (docs/brd) jeśli zmienia się zachowanie, backlog NISKIE do docs/21.

Bramka przed każdym pushem: `npm run verify:szybkie` (Twoja maszyna jest wolna; zawiera test-fast --od-bazy). Nigdy --no-verify. Po pushu zielony tests.yml. Integracja się przesuwa — przed końcem scal `origin/integracja-1-1` do swojej gałęzi (pliki generowane: weź wersję swojej gałęzi i przelicz generatorami; docs/18/docs/40 suma wpisów; lekcje jako `## L-NNN`).
Zakaz: scalanie do integracji/main, TestFlight, App Store Connect, zmiana workflowów, uruchamianie przekładu API.
Stan prowadź w docs/przekazanie/notatki/linia-1-1/STAN-PARTIA-4.md (krótko). Raport końcowy do koordynatora (send_message): SHA, przebieg tests.yml, per rodzina: włączona/planned, zysk pokrycia (figura v2, pełna karta), wyniki recenzji (pliki), sha wpisów, szacunek przekładu, otwarte pytania. Raport pośredni po pierwszej rodzinie (czas pracy na rodzinę — do szacunku terminu wydania).

Dopiski koordynatora (tura 2, 09/10.11.2026, tryb nocny):
- Integracja ma: delt_raise, ślad dźwigni maszyn (punkt styku, contract.ts), symulację pokrycia bez kart „do poprawy”, pełny skan generator↔plik w tests/figury-generator-odtwarza.test.ts (lista długu ROZJAZDY_POZA_ZAKRESEM — rodzina włączana nie może mieć rozjazdów; dopisz ją do W_ZAKRESIE). Wspólne funkcje póz (gora.mjs, np. lezyPrzodem) zmieniaj tylko ze sprawdzeniem skrótów wszystkich rodzin ready (`node scripts/zrodla-runtime.mjs --skroty`), inaczej dodaj nową funkcję.
- Cele pokrycia: pokrycie-cele.json = `node scripts/pokrycie-symulacja.mjs` na wspólnym stanie; wstrzymanie ćwiczenia (V2_WSTRZYMANE) obniża cel — wpis decyzji w docs/18 + backlog docs/21 z ID i warunkiem powrotu.
- Limit kontekstu sesji 30% (get_session/context_usage): ≥30% → STAN-PARTIA-4.md, push, nowa sesja create_session z tym promptem + odwołaniem do STAN, id do koordynatora.
- Przed scaleniem do integracji gałąź musi mieć zielony tests.yml na stanie z dociągniętą aktualną integracją.
