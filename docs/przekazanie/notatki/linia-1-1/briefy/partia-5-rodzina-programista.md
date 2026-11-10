# Brief: programista rodziny — partia 5 (linia 1.1), 10.11.2026

Partia 5: forearm, carry, core_hang, rotator_cuff, kneeling_hinge (opcjonalnie glute_floor). Lead partii zleca Ci JEDNĄ rodzinę.
Obowiązuje cały brief partii 2: `briefy/partia-2-rodzina-programista.md` (faza AUTOR, pkt 1–8, raport, limit kontekstu) — z różnicami niżej.

## Różnice względem partii 2
- Gałąź i katalog podaje lead w zleceniu (worktree rodziny albo `/home/user/trening` na `figury/partia-5`). Stan partii: `STAN-PARTIA-5.md`.
- Stopka commitu: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` / `Claude-Session: https://claude.ai/code/session_01T66VByZrLpWxNF8yF3gpgu`.
- Generator ↔ plik pozy (`tests/figury-generator-odtwarza.test.ts`): rodzina włączana NIE może mieć rozjazdów. Jeśli jest na `ROZJAZDY_POZA_ZAKRESEM`
  (forearm, rotator_cuff) — rodzina nie była recenzowana, więc źródłem jest generator `scripts/figures/agent-pozy/<rodzina>.mjs`: przelicz plik pozy z generatora
  (sprawdź, jak to robi `scripts/figures/odtwarzanie-poz.mjs` / skrypt zapisu), usuń wpis z listy i dopisz rodzinę do `W_ZAKRESIE`. Każda rodzina partii trafia do `W_ZAKRESIE`.
- Wspólne funkcje póz (`gora.mjs`, `dol.mjs`, `model.mjs`, np. `lezyPrzodem`): zmieniaj tylko po sprawdzeniu, że `node scripts/zrodla-runtime.mjs --skroty` dla wszystkich rodzin `ready` się nie zmienia
  (porównaj wynik przed/po); inaczej dodaj NOWĄ funkcję.
- Cele pokrycia (`docs/research/pokrycie-cele.json`) = `node scripts/pokrycie-symulacja.mjs --json` na wspólnym stanie. Wstrzymanie ćwiczenia (`V2_WSTRZYMANE`) obniża cel —
  tylko po zgodzie leada (wpis docs/18 + backlog docs/21 z ID i warunkiem powrotu).
- Nowe teksty UI: PL/EN przez `t()`/`lib/i18n.en.ts`, rejestr twierdzeń `node scripts/claims.mjs --stub`; przekładu API NIE uruchamiaj — w raporcie lista nowych kluczy (do szacunku kosztu).
- Maszyna 4 rdzenie, równolegle może pracować drugi programista: tylko pojedyncze pliki Jest `--runInBand`, nie `test:fast` całości, nie verify.
