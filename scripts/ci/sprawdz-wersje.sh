#!/usr/bin/env bash
# Twardy błąd, gdy wersja narzędzia jest niższa od minimum z scripts/ci/wersje-minimalne.json (audyt jakości 009, 01.11.2026).
# Użycie: bash scripts/ci/sprawdz-wersje.sh <xcode|ios_sdk|maestro> <tekst z wersją, np. wynik `maestro --version`>
# Z tekstu bierze pierwszą liczbę x.y[.z]. Pusty albo nierozpoznany tekst = błąd (nie przepuszczamy braku informacji).
set -euo pipefail
KLUCZ="${1:?klucz}"; TEKST="${2:-}"
PLIK="${WERSJE_MIN_PLIK:-$(dirname "$0")/wersje-minimalne.json}"
MIN=$(sed -n "s/^ *\"$KLUCZ\": *\"\([0-9][0-9.]*\)\".*/\1/p" "$PLIK" | head -1)
[ -n "$MIN" ] || { echo "::error::Brak minimalnej wersji '$KLUCZ' w $PLIK"; exit 2; }
WER=$(printf '%s\n' "$TEKST" | grep -Eo '[0-9]+(\.[0-9]+)+' | head -1 || true)
[ -n "$WER" ] || { echo "::error::Nie rozpoznano wersji '$KLUCZ' w: '$TEKST' (minimum $MIN)"; exit 1; }
if [ "$(printf '%s\n%s\n' "$MIN" "$WER" | sort -t. -k1,1n -k2,2n -k3,3n | head -1)" != "$MIN" ]; then
  echo "::error::$KLUCZ $WER jest niższy niż wymagane minimum $MIN (scripts/ci/wersje-minimalne.json) — zaktualizuj obraz/przypięcie albo świadomie zmień minimum"; exit 1
fi
echo "Wersja $KLUCZ $WER (minimum $MIN) — OK"
