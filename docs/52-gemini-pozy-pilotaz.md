# 52 — Pilotaż: pozy figur v2 generowane przez API Gemini

Decyzja właściciela 25.10.2026 (docs/18): grafiki ćwiczeń dla wszystkich 709 ćwiczeń w 1.0 (silnik v2: docs/50, pokrycie: docs/51). Właściciel ma kredyty Google Cloud z limitem budżetu i zgodził się na **pilotaż na jednej rodzinie (`pull_up`, 13 ćwiczeń)**:
Gemini generuje dane póz, nasze testy geometrii je walidują, nieudane wracają do Gemini z konkretnym błędem. Potem porównanie z naszym agentem (czas, koszt, jakość) i decyzja o reszcie.
Wyjątek właściciela 25.10.2026: wydawana animacja częstego błędu ✕ jest częścią zakresu (pole w kontrakcie danych, jeśli schemat je przewiduje).

## 1. Model, cennik, limity (odczyt dokumentacji Google 25.10.2026)

Źródła (przeczytane 25.10.2026): ai.google.dev/gemini-api/docs/pricing, /models, /models/gemini-4-argon, /structured-output, /thinking, /rate-limits, /interactions oraz ai.google.dev/api/interactions-api i /api/generate-content.

- **Model do JSON: `gemini-4-argon`** („Argon”, wskazany przez właściciela jako autor makiety) — strona modeli: wersja stabilna, „flagowy”; structured output: *Supported*; myślenie low/medium/high (domyślnie medium); kontekst 1 048 576 tokenów, domyślne wyjście 65 536.
  Dokumentacja structured output używa go w przykładach. Alternatywa do porównania: `gemini-3.1-pro-preview` (najnowszy model „Pro”, wersja preview, myślenie domyślnie high). Tańszy wariant: `gemini-3.8-flash`.
- **Cena za 1 mln tokenów (standard):** Argon 2,00 USD wejście / 10,00 wyjście **do 30.11.2026, od 1.12.2026 4,00 / 20,00**; 3.1 Pro Preview 2,00 / 12,00 (≤ 200 tys. kontekstu); 3.8 Flash 0,75 / 3,75 (od 1.01.2027 1,50 / 7,50). Batch jest o połowę tańszy, ale pętla „popraw po błędzie” jest iteracyjna, więc go nie używamy.
  Tokeny myślenia są rozliczane jak wyjście (strona thinking); skrypt liczy `total_output_tokens + total_thought_tokens` (jeśli API już wlicza myślenie w wyjście, rachunek jest zawyżony — kierunek bezpieczny).
- **Structured output:** podzbiór JSON Schema (`properties`, `required`, `additionalProperties`, `enum`, `minimum`/`maximum`, `items`, `prefixItems`, `minItems`/`maxItems`); `minLength`/`maxLength`/`uniqueItems` są **pomijane bez błędu** — ich pilnuje nasza walidacja. Zbyt duże lub głęboko zagnieżdżone schematy bywają odrzucane (400 INVALID_ARGUMENT).
  Dokumentacja pokazuje structured output wyłącznie w **Interactions API** (`POST /v1beta/interactions`, `response_format: {type:'text', mime_type:'application/json', schema}`, `generation_config.max_output_tokens`, `system_instruction`; odpowiedź: kroki `steps[].type=model_output` z `content[].text`, zużycie w `usage.total_input_tokens/total_output_tokens/total_thought_tokens`) — skrypt używa tej ścieżki. Klucz: nagłówek `x-goog-api-key`.
- **Limity:** poziomy płatne Tier 1–3 (kwalifikacja wg wydatków; Tier 1 po podpięciu rozliczeń, limit wydatków 250 USD na rozliczenie); wartości RPM/TPM/RPD dla Argon **nie są podane na stronie** — widoczne w AI Studio (aistudio.google.com/rate-limit). „Specified rate limits are not guaranteed.” Pilotaż jest sekwencyjny (jedno wywołanie naraz), więc limitów raczej nie dotknie; 429 jest ponawiane z odczekaniem (2 razy).
- **Otwarte (nieprzeczytane w dokumentacji):** (a) czy Argon jest dostępny też w Vertex AI pod tym samym identyfikatorem — strona modelu tego nie mówi; skrypt używa Gemini API z kluczem z AI Studio (kredyty Google Cloud rozlicza się na projekcie powiązanym z kluczem — do potwierdzenia przez właściciela przy tworzeniu klucza); (b) dokładny kształt `usage` poza polami wymienionymi wyżej; (c) czy `generateContent` z `responseJsonSchema` działa dla Argon (strona referencyjna go nie dokumentuje) — dlatego nie jest używany.

## 2. Skrypt `scripts/figures/gemini-pozy.mjs`

Wejście: rodzina (`--rodzina`), lista ćwiczeń z docs/51, kontrakt danych i walidator z gałęzi `grafiki-cwiczen`, przykład gotowej rodziny (few-shot), wskazówki i typowe błędy (`lib/figures/v2/cue-sets.json` + `lib/cues/text/pl.json`).
Pętla na ćwiczenie: generuj → `waliduj()` → przy błędzie odeślij **poprzednią odpowiedź i listę błędów (kod + szczegół)** → najwyżej `--proby` (domyślnie 4). Licznik kosztu z `usage`; **twardy limit** `--limit-usd` (domyślnie 3): wywołanie, którego górna granica kosztu (pełny `max_output_tokens`) nie mieści się w pozostałym limicie, nie jest wysyłane;
reszta ćwiczeń dostaje `przerwane: limit`, kod wyjścia 3. Wynik w `--wyjscie` (domyślnie `raport-pozy/`): `poze.json` (tylko poprawne), `raport.json` (na ćwiczenie: próby, poprawki, koszt, czas, historia błędów), `koszt.json`, `podsumowanie.md`, `szacunek.json`. **Skrypt niczego nie zapisuje w repozytorium.**
`--zastosuj <katalog>` (lokalnie, po przeglądzie) woła `zastosuj(root, wynik)` z walidatora. Miary porównania modeli (podsumowanie.md): odsetek poprawnych za 1. razem, liczba poprawek, wywołania, koszt, czas.

**Kontrakt z gałęzią `grafiki-cwiczen`** (adapter ładuje `scripts/figures/v2-validate.mjs` dynamicznie; bez niego działa tylko `--szacuj`, kod 4 przy próbie płatnej): eksporty `schematPozy(rodzina)`, `opisKontraktu(rodzina)`, `waliduj(poza, {rodzina, cwiczenie}) → {ok, bledy:[{kod, szczegol}]}`, `przyklad(rodzina) → [{cwiczenie, poza}]`, `zastosuj(root, wynik)`.
Wymagania: schemat w podzbiorze obsługiwanym przez Gemini (pkt 1), komunikaty błędów konkretne (które ćwiczenie, który staw/kontakt, wartość i dozwolony zakres), walidator bez sieci.

## 3. Workflow `.github/workflows/gemini-figury.yml`

Tylko `workflow_dispatch`, `permissions: contents: read`, sekret `GEMINI_API_KEY` w jednym kroku jako `env`, wejścia: `rodzina`, `model` (lista: gemini-4-argon, gemini-3.1-pro-preview, gemini-3.8-flash), `limit_usd`, `proby`, `tylko_szacuj` (domyślnie true). Wzór: `przeklad-tlumaczen.yml`; strażnik: `tests/gemini-pozy.test.ts` i `tests/public-repo.test.ts`.
Uruchamiać z gałęzi `grafiki-cwiczen` („Use workflow from”) — tam są docs/51 i walidator; plik workflowu musi być na gałęzi domyślnej.

## 4. Szacunki kosztu (założenia, NIE pomiar — do skorygowania po pilotażu)

Założenia w kodzie (`ZALOZENIA`): odpowiedź z pozą ≈ 2 500 tokenów, myślenie ≈ 5 000, wejście ≈ 6 000 na próbę, średnio 1,6 próby na ćwiczenie. Pilotaż `pull_up` (13 ćwiczeń): **Argon ≈ 1,9 USD** (po 1.12.2026 ≈ 3,7), 3.1 Pro ≈ 2,2, 3.8 Flash ≈ 0,7 — limit 3 USD mieści Argon do końca listopada.
Całość (40 rodzin, ok. 620 ćwiczeń do zrobienia): **Argon ≈ 90 USD** (po 1.12 ≈ 180), 3.1 Pro ≈ 104, Flash ≈ 33; animacja błędu ✕ przy każdym ćwiczeniu zwiększa wyjście, więc realnie 1,5–2 razy więcej (≈ 130–180 USD Argon do 30.11). Pilotaż ma tę niepewność zmierzyć.

## 5. Wyjątek L-001 (decyzja właściciela 25.10.2026)

Jak przy przekładzie tłumaczeń: workflow jest tylko ręczny, więc scalenie przed dowodem; dowód = przebieg `tylko_szacuj=true` zaraz po scaleniu (sprawdza checkout, instalację, szacunek, artefakt), a przebieg płatny dopiero po nim. Przy porażce dowodu — cofnięcie scalenia. Rejestr ryzyk: nieznane zachowanie Argon w Interactions API (kształt `usage`) rozstrzyga pierwszy przebieg płatny z limitem 3 USD.
