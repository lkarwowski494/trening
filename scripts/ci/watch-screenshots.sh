#!/usr/bin/env bash
# Zrzuty ekranu aplikacji na Apple Watch z symulatora (watch-sim.yml, docs/36; te same zrzuty idą do App Store Connect — ten sam rozmiar we wszystkich
# lokalizacjach). Aplikacja (konfiguracja Debug) jest już zainstalowana przez przebieg testów interfejsu; migawka z plików złotych trafia do niej
# zmienną SIMCTL_CHILD_WATCH_FAKE_SNAPSHOT_JSON (tylko Debug; wydanie ją ignoruje). Migawki mają stałą godzinę z roku 2026, więc przerwie w migawce przesuwamy
# znaczniki na „teraz” (zostaje 75 s z 90 s) — inaczej odliczanie byłoby już skończone. Wynik: <katalog>/<język>/<stan>.png.
# Użycie: bash scripts/ci/watch-screenshots.sh <UDID> <katalog_wyjściowy> [języki po przecinku | all]
set -euo pipefail
UDID="$1"; OUT="$2"; LANGS="${3:-pl,en,de,fi,ja}"
BUNDLE="pl.lukasz.trening.watchkitapp"
FIX="tests/fixtures/watch-app"
if [ "$LANGS" = "all" ]; then LANGS=$(node -e 'console.log(Object.keys(require("./'"$FIX"'/labels.json")).join(","))'); fi
STATES="set1 rest1 paused lastRest done idle"
mkdir -p "$OUT"
for lang in ${LANGS//,/ }; do
  mkdir -p "$OUT/$lang"
  for state in $STATES; do
    JSON=$(node -e 'const o=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")); o.lang=process.argv[2]; if(o.rest){const n=Date.now();o.rest.startedAt=n-15000;o.rest.endsAt=n+75000} console.log(JSON.stringify(o))' "$FIX/snapshots/$state.json" "$lang")
    xcrun simctl terminate "$UDID" "$BUNDLE" >/dev/null 2>&1 || true
    SIMCTL_CHILD_WATCH_FAKE_SNAPSHOT_JSON="$JSON" xcrun simctl launch "$UDID" "$BUNDLE" >/dev/null
    sleep 3
    xcrun simctl io "$UDID" screenshot "$OUT/$lang/$state.png" >/dev/null 2>&1
  done
done
xcrun simctl terminate "$UDID" "$BUNDLE" >/dev/null 2>&1 || true
echo "Zrzuty: $(find "$OUT" -name '*.png' | wc -l | tr -d ' ') plików"
