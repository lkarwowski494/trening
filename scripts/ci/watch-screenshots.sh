#!/usr/bin/env bash
# Zrzuty ekranu aplikacji na Apple Watch z symulatora (watch-sim.yml, docs/35-zegarek-apple; te same zrzuty idą do App Store Connect — ten sam rozmiar we wszystkich
# lokalizacjach). Aplikacja (konfiguracja Debug) jest już zainstalowana przez przebieg testów interfejsu; migawka z plików wzorcowych (watch-fixtures) trafia do niej
# zmienną SIMCTL_CHILD_WATCH_FAKE_SNAPSHOT_JSON (tylko Debug; wydanie ją ignoruje). Migawki mają stałą godzinę z roku 2026, więc przerwie w migawce przesuwamy
# znaczniki na „teraz” (zostaje 75 s z 90 s) — inaczej odliczanie byłoby już skończone. Wynik: <katalog>/<język>/<stan>.png.
# Dane pokazowe w języku zrzutu (A7, 27.10.2026): gdy podano katalog migawek (4. argument; scripts/screens/watch-seed.test.ts → <język>-<stan>.json), nazwa ćwiczenia, licznik serii
# i ciężar są w języku zrzutu; bez niego — polskie pliki wzorcowe (watch-fixtures). Apple odrzuca zrzuty z kanałem alfa: po zrzucie każdy PNG jest zapisywany bez alfy
# (ImageMagick `-alpha off`) i sprawdzany (`identify -format %[channels]` nie może zawierać „a”) — porażka przerywa skrypt.
# Użycie: bash scripts/ci/watch-screenshots.sh <UDID> <katalog_wyjściowy> [języki po przecinku | all] [katalog_migawek]
set -euo pipefail
UDID="$1"; OUT="$2"; LANGS="${3:-pl,en,de,fi,ja}"; WATCH_DANE="${4:-}"
BUNDLE="pl.lukasz.trening.watchkitapp"
FIX="watch-fixtures"; APPLE="tests/fixtures/watch-app"
if [ "$LANGS" = "all" ]; then LANGS=$(node -e 'console.log(Object.keys(require("./'"$APPLE"'/labels.json")).join(","))'); fi
IM=""; for c in magick convert; do command -v "$c" >/dev/null 2>&1 && { IM="$c"; break; }; done
if [ -z "$IM" ]; then brew install imagemagick >/dev/null 2>&1 || true; for c in magick convert; do command -v "$c" >/dev/null 2>&1 && { IM="$c"; break; }; done; fi
[ -n "$IM" ] || { echo "::error::Brak ImageMagick — nie da się usunąć kanału alfa ze zrzutów"; exit 1; }
ID="identify"; [ "$IM" = magick ] && ID="magick identify"
bez_alfa() { "$IM" "$1" -alpha off -define png:color-type=2 "$1.tmp.png" && mv "$1.tmp.png" "$1"
  local ch; ch=$($ID -format '%[channels]' "$1"); case "$ch" in *a) echo "::error::Zrzut $1 nadal ma kanał alfa ($ch)"; exit 1;; esac; }
STATES="set-first rest-after-first paused last-rest done idle"
mkdir -p "$OUT"
for lang in ${LANGS//,/ }; do
  mkdir -p "$OUT/$lang"
  for state in $STATES; do
    SRC="$FIX/snapshots/$state.json"; [ -n "$WATCH_DANE" ] && [ -f "$WATCH_DANE/$lang-$state.json" ] && SRC="$WATCH_DANE/$lang-$state.json"
    JSON=$(node -e 'const o=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")); o.lang=process.argv[2]; if(o.rest){const n=Date.now();o.rest.startedAt=n-15000;o.rest.endsAt=n+75000} console.log(JSON.stringify(o))' "$SRC" "$lang")
    xcrun simctl terminate "$UDID" "$BUNDLE" >/dev/null 2>&1 || true
    SIMCTL_CHILD_WATCH_FAKE_SNAPSHOT_JSON="$JSON" xcrun simctl launch "$UDID" "$BUNDLE" >/dev/null
    sleep 3
    xcrun simctl io "$UDID" screenshot "$OUT/$lang/$state.png" >/dev/null 2>&1
    bez_alfa "$OUT/$lang/$state.png"
  done
done
xcrun simctl terminate "$UDID" "$BUNDLE" >/dev/null 2>&1 || true
echo "Zrzuty: $(find "$OUT" -name '*.png' | wc -l | tr -d ' ') plików"
