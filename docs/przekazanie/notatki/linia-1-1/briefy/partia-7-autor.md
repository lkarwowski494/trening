# Brief: programista rodziny — partia 7 (tura 3, linia 1.1), 10.11.2026

Pełne kroki, pułapki i format raportu: `briefy/partia-4-autor.md` (obowiązuje w całości) i `briefy/programista-wspolny.md`, z różnicami niżej.

- Rodziny partii 7: core_floor (21 ćwiczeń z danymi póz), glute_floor (7). Lead zleca Ci JEDNĄ.
- Gałąź `figury/partia-7-<rodzina>` od `figury/partia-7` @ b66ecfa2 (głowa `origin/integracja-1-1`), worktree `<scratchpad>/wt-<rodzina>`
  (`git -C /home/user/trening worktree add -b figury/partia-7-<rodzina> <scratchpad>/wt-<rodzina> b66ecfa2`; `ln -s /home/user/trening/node_modules <wt>/node_modules`; `git -C <wt> fetch --unshallow origin 2>/dev/null` niepotrzebne — lead zrobi).
- Wzory włączenia na integracji: partia 2 (hip_bridge, pushup_plank, mobility_floor — `docs/research/recenzje/partia2-*`), partia 4 (back_extension). Bliskie wzory spoza integracji (tylko do czytania): `origin/figury/partia-5` — core_hang, kneeling_hinge.
- `lib/figures/v2/poseData.ts` jest NA limicie (24 736 B, `tests/architecture-limits.test.ts`). Dopisz LOAD/DATA_UI normalnie; czerwony `architecture-limits` jest dozwolony (pytanie do koordynatora KO-022 — limitu NIE zmieniaj, komentarzy innych rodzin nie skracaj).
- Dozwolone czerwone: `figury-recenzja`, `karty-recenzja`, `recenzja-wyjatki-1-1`, `zrodla-runtime`, `architecture-limits`, `figures-v2-nakladka-kazda-rodzina` (tylko gdy element czeka na wpis „zestawy”).
- Stopka commitu: `Co-Authored-By` (adres ze stopki sesji — nie wpisywać do docs) i `Claude-Session: https://claude.ai/code/session_01T66VBvJUHVXtAWBVygMpkF`. Tożsamość commitu: Claude, adres noreply (jak w git config) (sprawdź `git -C <wt> log -1 --format='%an <%ae>'`).
- Stan przy przekroczeniu ok. 30% kontekstu: `STAN-AGENTA.md` w katalogu głównym Twojego worktree (nie commituj go — jest w .gitignore).
- glute_floor: `figury-sens.json` → `otwarte_czesciowo` „kickbacki stojąc / na maszynie” (kąt biodra bez znaku) — Cable Kickback i Machine Glute Kickback sprawdź szczególnie; jeśli rysunek nie pokaże ruchu poprawnie, NIE łataj — lista do leada (wstrzymanie = decyzja koordynatora).
- core_floor: nakładka tylko z reguł „ustalone” (lista w sekcji core_floor `figury-sens.json`); reguły „analogia”/„jedno źródło” — nie w nakładce.
