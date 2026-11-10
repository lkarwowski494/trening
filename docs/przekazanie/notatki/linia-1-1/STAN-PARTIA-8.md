# Stan partii 8 (linia 1.1, tura 3) — core_standing (16), sled_throw (8), strongman (1)

Aktualizacja: 10.11.2026 (sesja E, session_01T66VBvTx4J3wo4LsZx4yjb). Koordynator: session_01T66VBzARTWMJ7smU82sfJs.
Gałąź `figury/partia-8` od `origin/integracja-1-1` @ b66ecfa2. Briefy: `briefy/partia-8-autor.md`, `briefy/partia-8-recenzent.md`.
Model pracy jak partia 2/4: lead nie pisze rodziny ani nie recenzuje; programista-autor (subagent) we własnym worktree → audytor na zamrożonym SHA → poprawki → r2 → przepisanie 1:1 do figury-recenzja.json.

## Stan rodzin
| Rodzina | Autor | Recenzja | Stan |
|---|---|---|---|
| core_standing | w toku | — | planned |
| sled_throw | w toku | — | planned |
| strongman | w toku | — | planned |

## Otwarte
- PYTANIE do koordynatora (10.11.2026): limit `poseData.ts` ma zapas 0 B (nie 48 B) — opcje A (KO-022 teraz) / B / C, rekomendacja A.
- Zysk pełnej karty z `pokrycie-symulacja.mjs`: 0 dla wszystkich 3 rodzin (zysk tylko figura.v2: +25 rysunków).

## core_standing (autor, 10.11.2026)
- Zrobione: włączenie (families ready, poseData LOAD + DATA_UI), nakładka (overlay/core_standing.ts, 5 elementów), test nakładki, testy mapping/data/strona-eksport/skrot dostosowane, docs/51, BRD, pochodne.
- Zostało: wpisy recenzji v2/karty/zestawy (przepisujący po recenzji niezależnej); decyzja koordynatora o limicie poseData.ts (KO-022).
- Pułapki: nowy plik testu musi być w git (macierz używa isTracked); techniquesFor z elementem `exercises` wymaga podania ćwiczenia.
