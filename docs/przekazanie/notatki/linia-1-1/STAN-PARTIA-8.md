# Stan partii 8 (linia 1.1, tura 3) — core_standing (16), sled_throw (8), strongman (1)

Aktualizacja: 10.11.2026 (sesja E, session_01T66VBvTx4J3wo4LsZx4yjb). Koordynator: session_01T66VBzARTWMJ7smU82sfJs.
Gałąź `figury/partia-8` od `origin/integracja-1-1` @ b66ecfa2. Briefy: `briefy/partia-8-autor.md`, `briefy/partia-8-recenzent.md`.
Model pracy jak partia 2/4: lead nie pisze rodziny ani nie recenzuje; programista-autor (subagent) we własnym worktree → audytor na zamrożonym SHA → poprawki → r2 → przepisanie 1:1 do figury-recenzja.json.

## Stan rodzin
| Rodzina | Autor | Recenzja | Stan |
|---|---|---|---|
| core_standing | w toku | — | planned |
| sled_throw | autor zrobiony (gałąź figury/partia-8-sled_strongman) | — | ready (przed recenzją) |
| strongman | autor zrobiony (ta sama gałąź), nakładka pusta — pytanie do leada | — | ready (przed recenzją) |

## Otwarte
- PYTANIE do koordynatora (10.11.2026): limit `poseData.ts` ma zapas 0 B (nie 48 B) — opcje A (KO-022 teraz) / B / C, rekomendacja A.
- Zysk pełnej karty z `pokrycie-symulacja.mjs`: 0 dla wszystkich 3 rodzin (zysk tylko figura.v2: +25 rysunków).

## sled_throw i strongman (autor, 10.11.2026)
- Zrobione: sled_throw (włączenie, overlay/sled_throw.ts, poprawka śladu piłki w contract.ts, testy) — commit o prefiksie `sled_throw:`; strongman (włączenie, overlay/strongman.ts pusty, test) — commit `strongman:`. Arkusze PNG poza repo (scratchpad).
- Czerwone dozwolone: figury-recenzja, karty-recenzja, architecture-limits (poseData.ts 24846 B). Czerwone wymagające decyzji: figures-v2-nakladka-kazda-rodzina i -mobility-floor dla strongman (brak kwalifikującej się reguły).
- Zostało: recenzja niezależna, wpisy v2/karty/zestawy (mbThrow, sled), v1 → zastapiona (lista w raporcie autora).
- Pułapki: pętla jednokierunkowa daje łukowy tor piłki — tor-wyjatki.json ma 6 wpisów z powodem; DATA_UI rodziny sled_throw nie dodawać (nadpisałoby domyślne ONE_WAY_UI/GAIT_UI).
