# STAN W-02 (sesja L, 11.11.2026) — przekazanie do następcy

Gałąź `figury/w02-przed-1-1` (od `integracja-1-1` @ 5721a16e). Koordynator: session_01T66VBz531oNhivgrQu5LZg.

## Zrobione (scalone lokalnie na gałęzi, recenzje niezależne audytora)
- Straight Raises on Incline Bench: nogi proste, siedzisko 2 cm (generator delt_raise bez starego nadpisania nóg); test `tests/figures-v2-delt-raise-w02.test.ts`; recenzja `docs/research/recenzje/w02-delt_raise-roznica-audytor-2026-11-11.md` „wyswietlana”; skrót delt_raise ec3e3e8e5841.
- `fidr.move` → „co najmniej do wysokości barków” (PL/EN; 33 języki do przekładu W-03: `docs/lokalizacja/zestaw-przekladu-2026-11-11-w02-wskazowki.json`); karta „wyswietlana”, `lib/cues/data.json` przeliczony; cel 1.1 pelnaKarta 520 → 521.
- Dźwignia barki/uda (`gear.ts`, `contract.ts`): Standing i Seated Calf Raise zdjęte z `V2_WSTRZYMANE` po recenzji `w02-calf_raise-roznica-audytor-2026-11-11.md`; skrót calf_raise f4bca2a3f7ef; cel pelnaKarta 521 → 523; test `tests/figures-v2-dzwignia-barki-uda.test.ts`.
- `ROZJAZDY_POZA_ZAKRESEM` pusta (calf_raise, pull_up, mobility_stand, hip_abd_add w `W_ZAKRESIE`).
- Badacz: `docs/research/w02-badacz-reguly-2026-11-11.md` (cytaty sprawdzone curl); wnioski → backlog W02-BAD-1…5 (docs/21).
- Odłożone → 1.2 (docs/18 11.11.2026): obrót dzwonu kb (P1-KB-2; WIP lokalnie `w02/d-silnik` @ ee2a130a — NIE wypchnięte), PP-W1, P3-MARSZ (generator marszu w repo, recenzja `w02-p3-marsz-audytor-2026-11-11.md` „do poprawy”).

## Sesja L2 (11.11.2026) — testy po zamierzonych zmianach: zrobione
Stan wyjściowy `verify:szybkie` na 8e0aa08f: 15 plików / 20 testów czerwonych. Na 652d0c9c: `verify:szybkie` kod 0 (291 plików, 11296 testów), push; `tests.yml` 43005855183 — wynik w docs/49 W-02.
- Zamierzone (testy/zapis): f2b097f9 (zgodność wsteczna 3 pozy, ślad dźwigni barki/uda, nakładka fix4, rozszerzenia-gora, V2_WSTRZYMANE w sklepie/stronie, figur strony 528), 08d8c3c2 (v1 Standing Calf Raise „zastapiona”, rejestr L4: przegląd przy bb05b0deffb9, 2 wpisy marszu usunięte; cudzysłów w recenzji marszu), 652d0c9c (zapis recenzji testu strony z calf_raise).
- Błąd W-02 + decyzja KO-042 (1eaa8fe8, docs/18 11.11.2026): karta Front Incline Dumbbell Raise ukryta do przekładu fidr.move (W-03) — wpis „do poprawy” z polem `w02`, cele −1, 5 minimów zapadki z `obnizenia`.
- Recenzja niezależna zmian testów: `docs/research/recenzje/w02-testy-audytor-2026-11-11.md` — brak osłabień.

## Zostało (następca)
- Po W-03 (przekład fidr.move): odsłonić kartę FIDR jednym commitem według pola `w02` w `docs/research/figury-recenzja.json` (wpis „wyswietlana”, plik recenzenta `docs/research/recenzje/*.json`, `zrodla-runtime --write`, cele z symulacji, `pokrycie-katalogu.mjs --podnies-minimum`; testy: karty-recenzja:91, cel-1-1, figures-v2-delt-raise-w02, strona-eksport OCZEKUJE bez `2026-11-11-w02`).
- Backlog (nie zgłoszone jako błąd): wpisy rejestru L4 `Calf-Machine Shoulder Shrug` („kontrakt nie ma poduszki na barkach”) i `Lat Pulldown` („poduszka na uda”) są `do_przegladu`, a kontrakt ma już punkty dźwigni barki/uda — do sprawdzenia przy tych rodzinach.
- Scalenie gałęzi do integracji — koordynator (`scal-galaz`).

## Pułapki
- Zmiana `contract.ts` przesuwa odcisk L4; zmiana póz — skróty w `figury-recenzja.json` (`node scripts/zrodla-runtime.mjs --skroty`).
- Po każdej zmianie kart: `node scripts/zrodla-runtime.mjs --write`, `node scripts/pokrycie-katalogu.mjs --write`, `node scripts/readme.mjs --write`, `node scripts/test-matrix.mjs --write`.
- Worktree lokalne wt-a…wt-d znikną z kontenerem; `w02/d-silnik` (obrót dzwonu) istnieje tylko lokalnie — opis i pomiary w docs/18 11.11.2026.
