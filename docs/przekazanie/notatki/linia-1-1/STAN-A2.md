# STAN partii A2 (tekst: nogi/biodra) — linia 1.1

## Teraz
- 08.11.2026 ~21:10 PL (koordynator): gałąź `tekst/a2-nogi` utworzona od `integracja-1-1` (e2df51f5). Wykonawca: sesja B #1 w chmurze (rola programista). Zakres wg planu `plan-1-1-i-1-2-2026-11-08.md` wiersz 1-A2. Wzór: partia A1 (`tekst/a1-pchanie`). Bez przekładu przez API.
- Narzędzia partii A1 (`narzedzia-a1.md`, Python, ścieżki lokalne koordynatora do podmiany): `ext.py`/`tabs.py` — parsowanie bloków JSON i tabel „Źródła” z plików badań; `pick.py`/`cand.py` — wybór kart z listy partii; `import_cards.py` — import kart do `data/zrodla/cues.json` (odrzuca błędy bez 2 organizacji, zapisuje listę kluczy); `post.py` — zestawy wskazówek, pole otwarcia figur, fixture, zestaw przekładu. Kolejność A1: importer → `post.py` → `gen.mjs` → `zrodla-runtime --write` → `claims.mjs --stub` → testy.

## Historia
