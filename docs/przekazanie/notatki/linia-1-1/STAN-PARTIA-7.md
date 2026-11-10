# Stan partii 7 (tura 3, linia 1.1) — core_floor, glute_floor

Aktualizacja: 10.11.2026 (sesja D2); wcześniej ~13:05 UTC (sesja D, session_01T66VBvJUHVXtAWBVygMpkF — przekazanie przy kontekście ~31%). Koordynator: session_01T66VBvauzmGEDCSRshqWXa (od 12:04; wcześniej session_01T66VBzARTWMJ7smU82sfJs).
Gałąź `figury/partia-7` od `origin/integracja-1-1` @ b66ecfa2. Briefy: `briefy/partia-7-autor.md`, `briefy/partia-7-recenzent.md`.
Model pracy: autor (subagent programista, gałąź `figury/partia-7-<rodzina>`) → audytor (worktree odłączony) → poprawki WYSOKICH przez innego programistę z testem → r2 tym samym audytorem → lead przepisuje r2.json 1:1 do figury-recenzja.json → scalenie gałęzi rodziny do partia-7.

| Rodzina | Stan | Recenzja | Uwagi |
|---|---|---|---|
| core_floor | włączona, scalona (e869e93a) | r2 wyswietlana 8cf398255940 (`docs/research/recenzje/partia7-core_floor-r1/r2*`) | r1: W1 Sit Up dłonie, W2 Bicycle stopa → bf7d4f14; backlog CF-* (docs/21) |
| glute_floor | włączona, scalona (619b58af) | r2 wyswietlana cfdc21dbffc8 (`partia7-glute_floor-r1/r2*`) | r1: W1 Cable Kickback chwyt, W2 Prone Flutter błąd w ławce → 79a59d21; nakładka z nowej reguły `plecy_wprost` (Donkey Kick, ACE #270 + ISSA, curl 10.11); `miednica_bez_przechylu` → analogia; backlog GF-* |
Pełne karty (pokrycie-katalogu): 371 → 392 (+14 core_floor, +7 glute_floor). Nowe teksty UI: brak (fazy z istniejących nazw) — przekład 0 zł [sprawdzić `node scripts/check-i18n.mjs` po zmianach].

## Stan po sesji D2 (10.11.2026, session_01T66VBymsQ2Zz31MLo3Wqah)
- Scalone `origin/integracja-1-1` @ 038efefc (bez konfliktów; podział poseData.ts — KO-024).
- 5 czerwonych naprawionych w 52f971f7 (zmiany celowe po recenzjach r2, skróty rodzin bez zmian: core_floor 8cf398255940, glute_floor cfdc21dbffc8):
  figures-v2-data (core_floor w JERK_TEMPO_RODZINY), figury-recenzja-p2 (3 odciski glute_floor), cel-1-1-bez-ciezkich + pokrycie-cele.json (roleMiesni 530, pelnaKarta 464, ciężkie 244, c = 17),
  pokrycie-katalogu (minimum jezyk.* 597 → 599), strona-eksport-recenzja (core_floor ready; pilotaż = rodzina z pozami bez ready).
- Po verify:szybkie (6 kolejnych czerwonych, poza listą D): figury-p2-r2/r4 (ODROCZONE glute_floor hext.mis.arch + kontrola zastępcza spineMid), figury-mobilnosc-reguly (ISOMETRIC 20: Hollow Hold), zrodla-pelne-cues-a4-core (porównanie z wariantami po filtrze „ustalone”), figures-v2-nakladka-fix4 (+ Machine Glute Kickback, Prone Flutter Kicks), wybor-testow-l103 (komentarze bez ścieżek docs/research).
- Wpisy docs/18 do weta: plecy_wprost, miednica_bez_przechylu → analogia, mis.jerk core_floor, ODROCZONE hext.mis.arch (+ KO-024 sesji E).

- Scalone `origin/integracja-1-1` @ 649b0504 (pociąg 5) w 0b6d65e2: 27 plików w konflikcie (unie rodzin partii 5 i 7); cele z symulacji: animowanyBlad 274, roleMiesni 537, pelnaKarta 471, ciężkie 237; verify:szybkie kod 0 (12140 testów). Poprzednia głowa d9d5eb63: tests.yml 42837207784 zielony.

## Następny krok
Koordynator: scalenie `figury/partia-7` do integracji (`scal-galaz`) po zielonym tests.yml.

## Pułapki
- Stopki WIP 25f296c7 i 843bbe38 mają inną sesję/model (skopiowane z programista-wspolny.md) — bez przepisywania historii.
- Skrypt przepisania r2.json (v2 nadpisz, zestawy/karty nadpisz/dopisz, v1_zastapiona → werdykt zastapiona): był w scratchpadzie — prosty, wzór w STAN-PARTIA-2.
- Maszyna 4 rdzenie: 2 programistów + Jest → load 12; testy pojedynczo.
- Badacz glute_floor: `docs/research/glute-floor-pewnosc-regul-2026-11-10.md`; podniesienia pewności poza `plecy_wprost` — backlog GF-B1.
