# Stan partii 7 (tura 3, linia 1.1) — core_floor, glute_floor

Aktualizacja: 10.11.2026 (sesja D, session_01T66VBvJUHVXtAWBVygMpkF). Koordynator: session_01T66VBzARTWMJ7smU82sfJs.
Gałąź `figury/partia-7` od `origin/integracja-1-1` @ b66ecfa2. Briefy: `briefy/partia-7-autor.md`, `briefy/partia-7-recenzent.md`.
Model pracy jak partia 2/4: autor (subagent programista, worktree i gałąź `figury/partia-7-<rodzina>`) → audytor (worktree odłączony) → poprawki → r2 → lead przepisuje wpisy do figury-recenzja.json.

| Rodzina | Etap | Uwagi |
|---|---|---|
| core_floor | zrobione: r2 wyswietlana 8cf398255940, scalone do partia-7 (e869e93a) | r1: 2 WYSOKIE (Sit Up dłonie, Bicycle stopa) → poprawka bf7d4f14 → r2 czysta; pełne karty 371 → 385; backlog CF-S1–S3, CF-N1–N6 (docs/21) |
| glute_floor | r1 do poprawy (W1 Cable Kickback chwyt kolumny, W2 Prone Flutter błąd przenika ławkę) → poprawki w toku | 7 ćwiczeń; symulacja +7; badacz: pewność reguł (docs/research/glute-floor-pewnosc-regul-2026-11-10.md) |

## Otwarte
- PYTANIE do koordynatora: `lib/figures/v2/poseData.ts` = limit 24 736 B (zapas 0) — KO-022 (rekomendacja A: podział w pociągu-5). Do odpowiedzi kod nie jest wypychany.
- Badacz glute_floor (10.11.2026, docs/research/glute-floor-pewnosc-regul-2026-11-10.md): `miednica_bez_przechylu` zawyżone (Clamshell = analogia; pole przechylMiednicy mierzy płaszczyznę czołową) — autor nie używa jej w nakładce; obniżenie pewności w figury-sens.json po scaleniu gałęzi glute_floor (lead). Podniesienia (rozstaw_kolan, plecy, biodro_do_linii) — cytaty tylko z odczytu narzędziem, do sprawdzenia curl przed wpisem.
- KO-024 (koordynator 11:48): układ `lib/figures/v2/rodziny/<rodzina>.ts` + linia w `rodziny/index.ts`; wpisy LOAD/DATA_UI core_floor i glute_floor przenieść po sygnale z SHA integracji; do tego czasu kod niewypychany.
- Stopki commitów WIP autorów (25f296c7, 843bbe38) mają inną sesję/model (skopiowane z programista-wspolny.md) — bez przepisywania historii.
