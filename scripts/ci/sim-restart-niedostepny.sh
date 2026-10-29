#!/usr/bin/env bash
# E2E (101-23, decyzja właściciela D7 = B, 29.10.2026): gdy log Maestro zawiera „Device became unreachable” (symulator przestał odpowiadać w trakcie scenariusza),
# restartujemy TEN SAM symulator (shutdown + boot + bootstatus) i instalujemy aplikację ponownie — przed ponowieniem scenariusza, które i tak jest jedno (CLAUDE.md „E2E — podział”).
# Skrypt NIE dodaje ponowień: restart jest przygotowaniem istniejącego ponowienia, więc łączny limit (jedno ponowienie scenariusza) się nie zmienia.
# Inny błąd w logu = nic nie robi (kod 0, komunikat „bez restartu”). W logu tylko nazwa zdarzenia i liczby (repo publiczne — bez identyfikatorów urządzeń).
# Użycie: bash scripts/ci/sim-restart-niedostepny.sh <log_maestro> <UDID> <Trening.app> [bundle_id]
set -uo pipefail
LOG="${1:?log}"; SIM="${2:?UDID}"; APP="${3:?Trening.app}"; BUNDLE="${4:-pl.lukasz.trening}"
if [ ! -f "$LOG" ] || ! grep -qiE 'device (has )?(became )?unreachable|became unreachable' "$LOG"; then
  echo "Symulator: bez restartu (log bez „Device became unreachable”)"; exit 0
fi
echo "::warning::Maestro: urządzenie stało się niedostępne — restart symulatora i ponowna instalacja aplikacji przed ponowieniem scenariusza"
xcrun simctl shutdown "$SIM" >/dev/null 2>&1 || true
xcrun simctl boot "$SIM" >/dev/null 2>&1 || true
xcrun simctl bootstatus "$SIM" -b >/dev/null 2>&1 || { echo "::error::Symulator nie wstał po restarcie"; exit 1; }
xcrun simctl install "$SIM" "$APP" >/dev/null 2>&1 || { echo "::error::Ponowna instalacja aplikacji po restarcie nie powiodła się"; exit 1; }
echo "Symulator: zrestartowany, aplikacja zainstalowana ponownie"
