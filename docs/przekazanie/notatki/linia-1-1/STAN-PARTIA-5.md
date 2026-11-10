# Stan partii 5 (linia 1.1) — forearm, carry, core_hang, rotator_cuff, kneeling_hinge

Aktualizacja: 10.11.2026 ~06:00 UTC (sesja session_01T66VByZrLpWxNF8yF3gpgu, lead partii). PRACA WSTRZYMANA na polecenie właściciela (~05:35 UTC, przez koordynatora). Koordynator aktywny od 05:20 UTC: session_01T66VBw1AX38pLShXPH7rmy (wcześniej session_01T66VByJCWCao1Hw3is68Cy).

Wypchnięte: `figury/partia-5` @ cd5c4afa (verify:szybkie zielone; 4 rodziny + integracja 1d6352ba) i `figury/partia-5-rotator_cuff` @ 7f694cf5 (verify:lekkie; faza autora, bez recenzji, NIE scalona).
Model pracy jak partia 2: autor (programista, worktree rodziny) → audytor r1 → poprawki WYSOKICH (i tanich ŚREDNICH) innym programistą z testem odtwarzającym → r2 tym samym audytorem → przepisanie 1:1 (integrator). Brief: `briefy/partia-5-rodzina-programista.md` + briefy partii 2.

## Stan rodzin
| Rodzina | Recenzja (raporty `docs/research/recenzje/partia5-<rodzina>-r*`) | Stan na `figury/partia-5` |
|---|---|---|
| carry | r2 wyswietlana, v2 bc03d01d72f6 (W1 rack, W2 ślad trap bar w contract.ts, S2 naprawione) | wpisy przepisane; backlog CA-* |
| core_hang | r2 wyswietlana, v2 43a33ada7ec7 (Ś1 słupek drążka) | wpisy przepisane; L-Sit → 1.2 (CH-P1) |
| forearm | r3 wyswietlana, v2 4f6519625eed (W1 Behind-the-Back kierunek, W2 ruch ramienia, S2 zakres) | wpisy przepisane; backlog FA-* |
| kneeling_hinge | r2 wyswietlana, v2 17d7fac90626 (S1 styk siedzenia); bez nakładki — wyjątek A koordynatora 10.11 (docs/18, KH-F1); r3: prowadnica backLine z hinge.back dopuszczona (e6acbb49) | wpisy przepisane |
| rotator_cuff | brak (faza autora skończona) | gałąź `figury/partia-5-rotator_cuff` @ 7f694cf5 (wypchnięta, NIE scalona) |

Scalona integracja: origin/integracja-1-1 @ 1d6352ba (commit fb7ab825). Pełne karty 270; cele 1.1 z symulacji: animowanyBlad 264, roleMiesni 519, pelnaKarta 457; (c)=6, ciężkich 251.

## Następne kroki
1. tests.yml dla cd5c4afa — sprawdzić zielony (przed scaleniem dociągnąć aktualną integrację; scalenie tylko przez koordynatora, `scal-galaz`).
2. Do przejrzenia przez koordynatora (strażniki poluzowane z uzasadnieniem): wyjątek kneeling_hinge w `figures-v2-nakladka-kazda-rodzina` (61edc600, z testem wygaśnięcia), heurystyka zwisu w `figures-v2-kierunek-u` (14a614ae), limit `wybor-testow-l103` 36 → 37 (bf648305).
3. rotator_cuff: recenzja r1 (audytor; brief partii 2 recenzenta; K14: autor osłabił asercję `pelna` w strona-eksport — ocenić; wyjątki toru 7,0/14,2 cm; Reverse Flyes tułów nad ławką; pytanie produktowe: widok side rotacji stojących mało czytelny) → poprawki → r2 → scalenie do `figury/partia-5` (konflikty jak przy carry; cele z symulacji).
4. Lekcja `## L-NNN` w docs/40: brief leada z adresem e-mail i raporty recenzentów z lokalnymi ścieżkami /tmp złamały public-repo (wykryte przez autora rotator_cuff; naprawa 8553741d) — mechanizm: w briefach agentów zakaz adresów i ścieżek scratchpad w plikach repo; rozważyć `public-repo` w liście testów każdego agenta.
5. Raport końcowy do koordynatora; opcjonalnie glute_floor (badacz: fh.level/clam.noRoll).

## Pułapki
- Restart kontenera kasuje niezacommitowaną pracę i zadania w tle — commit po każdym kroku; nowa sesja = nowy kontener: tylko to, co wypchnięte.
- Karty z wcześniejszą recenzją treści: nie nadpisuj, poprzedni wpis w polu `kto` („wcześniej: …”). Pole `rodzina` zestawu wg cue-sets.json.
- Po wpisie recenzji: zrodla-runtime --write (lista general), pokrycie-katalogu --write, --podnies-minimum (przy scaleniu z integracją: najpierw minimum z integracji), cele z symulacji edycją punktową, testy cel-1-1, skrot-v2-wynik (regex overlay/<rodzina>.ts), recenzja-wyjatki-1-1, gemini-polecenia, tabela WANT testu nakładki (zestawy ogólne dokładają element).
- Wpis zestawu z wskazówką hinge.back dokłada prowadnicę backLine niezależnie od nakładki rodziny.
- Maszyna 4 rdzenie: najwyżej 2 programistów + 1 audytor; figures-v2-tor na obciążonej maszynie > 25 min.
