#!/usr/bin/env bash
# Instalacja Maestro z trzema próbami (nocne 08.11.2026, lekcja o 11 czerwonych nocach: instalator get.maestro.mobile.dev zwrócił 504, `curl | bash` zakończył się kodem 0
# na pustym wejściu, a dopiero krok „Maestro” padł kodem 127 — żaden scenariusz nie wystartował). Pobranie do pliku (kod curl nie ginie w potoku), instalacja, sprawdzenie, że
# plik wykonywalny istnieje; po porażce pauza i następna próba. Zmienne: MAESTRO_PROBY (domyślnie 3), MAESTRO_PAUZA w sekundach (domyślnie 20), MAESTRO_URL (do testów).
# Test: tests/instaluj-maestro.test.ts (stuby curl/bash w PATH). MAESTRO_VERSION (pusta = najnowsza) czyta sam instalator — wywołujący odsetawia pustą.
set -u
PROBY="${MAESTRO_PROBY:-3}"; PAUZA="${MAESTRO_PAUZA:-20}"; URL="${MAESTRO_URL:-https://get.maestro.mobile.dev}"
TMP="$(mktemp)"; trap 'rm -f "$TMP"' EXIT
for ((n = 1; n <= PROBY; n++)); do
  if curl -fsSL "$URL" -o "$TMP" && [ -s "$TMP" ] && bash "$TMP" && [ -x "$HOME/.maestro/bin/maestro" ]; then
    echo "Maestro zainstalowany (próba $n z $PROBY)"; exit 0
  fi
  echo "::warning::Instalacja Maestro: próba $n z $PROBY nieudana"
  [ "$n" -lt "$PROBY" ] && sleep "$PAUZA"
done
echo "::error::Instalacja Maestro nieudana po $PROBY próbach"; exit 1
