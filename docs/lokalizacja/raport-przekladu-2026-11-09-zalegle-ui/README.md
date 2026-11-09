# Raport przekładu API — zaległe klucze UI (09.11.2026, ZB-051)

Kopia artefaktu `raport-przekladu` z przebiegu 42564067252 (`przeklad-tlumaczen.yml`, batch `msgbatch_017gwoFKexsFUPXYYUnw2YKR`, gałąź `lok/przeklad-a1-a3`, zestaw `zestaw-przekladu-2026-11-09-zalegle-ui.json`). Artefakt CI wygasa 16.11.2026.
Pięć kluczy interfejsu z tego raportu jest już naniesione. Cztery klucze delt_raise („Bokiem”, „Przodem”, „Naprzemiennie”, „Pozycje na rysunku: {lista}”) nakłada się na gałęzi `figury/delt_raise`:
`node scripts/i18n/przeklad-api.mjs --zastosuj docs/lokalizacja/raport-przekladu-2026-11-09-zalegle-ui --zestaw docs/lokalizacja/zestaw-przekladu-2026-11-05-delt-raise.json` (klucze spoza tamtego zestawu są pomijane).
