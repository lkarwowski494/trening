# Wskazówki techniki — fala W1 (badania 02.11.2026)

Zbieranie danych (docs/18, 02.11.2026: treść równolegle z linią 1.1). Pliki to wyniki badaczy, **nie dane aplikacji** — integracja do `data/zrodla/cues.json`, `lib/cues/text/pl.json` i rejestru twierdzeń później, partiami, z recenzją niezależną (L-047) i tłumaczeniem.

Stan po ustaleniu szczebli (`docs/research/szczeble-organizacji-2026-11-02.md`, 02.11.2026):
- pozycje „gotowe” oparte na free-exercise-db (teraz szczebel 5) wracają do „jedno źródło” — m.in. ok. 10 wpisów w `curl-2.md` i 4 w `delt_raise*.md`; do przeliczenia przy integracji;
- kilka publikacji tej samej organizacji = jedno źródło (np. dwie książki i artykuł tej samej organizacji);
- przeczytane drugie źródła z prywatnych materiałów właściciela (poza repo, docs/18 02.11.2026) uzupełnia koordynator przy integracji; sprzeczności z nimi rozstrzyga hierarchia źródeł z CLAUDE.md.

## Stan po przeliczeniu szczebli (02.11.2026)

Kryterium karty (decyzje 02.11.2026): zdanie gotowe = ≥ 2 niezależne organizacje szczebla ≤ 4, przeczytane; karta własna = min. 1 zdanie ustawienia
+ 1 zdanie ruchu; „z błędami” = + min. 1 błąd; bez ruchu albo bez ustawienia = otwarta. Przeliczenie: sekcja „Korekta szczebli — przeliczenie
koordynatora 02.11.2026” na końcu każdego pliku rodziny.

| Rodzina | Ćwiczenia badane | Własne z błędami | Własne bez błędów | Otwarte | Nowe zdania gotowe | Przeliczone |
|---|---|---|---|---|---|---|
| curl (curl.md + curl-2.md) | 31 | 0 | 0 | 31 | 6 (`conc.setup`, `incline.setup`, `zottman.move`, `spider.arm`, `preacher.arms`, `curl.revGrip` krótkie) | tak |
| delt_raise (delt_raise.md + delt_raise-2.md) | — | — | — | — | — | **nie — zostało** |
| triceps (triceps.md + triceps-2.md) | — | — | — | — | — | **nie — zostało** |
| lunge (lunge.md + lunge-2.md) | — | — | — | — | — | **nie — zostało** |

### Zmiany względem poprzedniego stanu

- curl: przed — curl.md 8 gotowych / 23 otwarte; curl-2.md 17 gotowych + 2 warunkowe / 11 otwartych. Po — 0 kart własnych, 31 otwartych.
  Przyczyny: (1) wszystkie karty mają puste `move` (albo puste `setup`: Zottman Curl, Drag Curl) — „brak zdania ruchu”, do fali W2, zdań nie wymyślano;
  (2) free-exercise-db i Western University = 5 — spada 18 zdań/par w curl-2.md; (3) dokumentacja innej aplikacji odrzucona — spada większość par w curl.md;
  (4) `preacher.setup` (pacha, `lib/cues/text/pl.json:255`) — tylko Havers 2025 (3) — spada, zastępuje go `preacher.arms`.
- BarBend `spider-curl` sprawdzony WebFetch-em 02.11.2026 (autor z kwalifikacjami, data aktualizacji) — liczy się dla `spider.arm`; nie potwierdza leżenia przodem (`spider.setup` spada).
- Bloki JSON w curl.md i curl-2.md oznaczone „NIEAKTUALNY”; „Blok do wdrożenia (po przeliczeniu 02.11.2026)” w obu plikach jest pusty.

### Zostało (następna sesja — limit kontekstu)

1. delt_raise.md, delt_raise-2.md — free-exercise-db (wg zlecenia 9 z 11 kart na nim) → 5; sprawdzić, czy karty mają `move`.
2. triceps.md, triceps-2.md — przeliczenie wg tych samych reguł.
3. lunge.md, lunge-2.md — Eleiko (68 wzmianek): liczy się tylko dział edukacji z autorem (education.eleiko.com; strony „stories” bez daty i kwalifikacji — 5);
   BarBend warunkowo (WebFetch per strona: autor z kwalifikacjami, data); PhysioRehab, RitFit — ocenić wg kryteriów pkt 1–4; Dynamo = sprzedawca → 5.
4. Pułapka: Write wymaga przepisania całego pliku (~300 linii na plik) — jeden plik rodziny na sesję agenta albo narzędzie edycji.

## Stan po przeliczeniu szczebli (koordynator 1.1, 02.11.2026) — wszystkie 4 rodziny
| Rodzina | Ćwiczenia | Własne z błędami | Własne bez błędów | Otwarte | Uwagi |
|---|---|---|---|---|---|
| curl | 31 | 0 | 0 | 31 | brak zdań ruchu; free-exercise-db = 5; 6 zdań gotowych do fali W2 |
| delt_raise | 38 | 0 | 2 | 36 | free-exercise-db = 5; `scap.setup` skrócone (recenzja i `claims.mjs --stub`) |
| triceps | 28 | 1 | 8 | 19 | NFPT „Guest” = 5 do ustalenia autora; REP, Precor, EliteFTS = 5 (EliteFTS per autor jak IronMind — W2) |
| lunge | 19 | 0 | 3 | 16 | Eleiko (platforma bez autora), PhysioRehab, RitFit, Dynamo = 5; `split.setup` skrócone |
Bloki do wdrożenia: sekcje „### Blok do wdrożenia (po przeliczeniu 02.11.2026)” w każdym pliku; starsze bloki oznaczone NIEAKTUALNY. Karty bez błędów w rodzinach z pozami v2 — zostają przy zestawie ogólnym do czasu karty z błędem (docs/18, 02.11.2026).
