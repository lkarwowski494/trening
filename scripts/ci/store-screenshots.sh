#!/usr/bin/env bash
# Zrzuty ekranu iPhone'a do App Store Connect z symulatora (store-screenshots.yml, docs/41-droga-do-app-store.md). Wzór: watch-screenshots.sh.
# Dane pokazowe (zmyślone) z scripts/screens/store-seed.test.ts trafiają do aplikacji bez zmian w kodzie: przed startem zapisujemy je w bazie
# aplikacji tak, jak robi to sama aplikacja (Library/SQLite/trening.db, tabela kv, klucz „state” — lib/state/db.ts i lib/state/boot.ts).
# Ekrany otwieramy łączem aplikacji (schemat „trening” z app.json, ścieżki expo-router) i zapisujemy `simctl io screenshot` w rozdzielczości urządzenia.
# W logu tylko nazwy plików i liczby (repo publiczne — bez identyfikatorów urządzeń).
# Użycie: bash scripts/ci/store-screenshots.sh <UDID> <katalog_wyjściowy> <katalog_danych> [języki po przecinku | all]
set -euo pipefail
UDID="$1"; OUT="$2"; DATA="$3"; LANGS="${4:-pl,en}"
BUNDLE="pl.lukasz.trening"
if [ "$LANGS" = "all" ]; then LANGS=$(ls "$DATA" | sed -n 's/^state-\(.*\)\.json$/\1/p' | paste -sd, -); fi
mkdir -p "$OUT"
# Pasek stanu jak w materiałach Apple: stała godzina, pełna bateria i zasięg (bez nazwy operatora).
xcrun simctl status_bar "$UDID" override --time "9:41" --dataNetwork wifi --wifiMode active --wifiBars 3 --cellularMode active --cellularBars 4 --batteryState charged --batteryLevel 100 >/dev/null 2>&1 || echo "::warning::Nie udało się ustawić paska stanu"
for lang in ${LANGS//,/ }; do
  STATE="$DATA/state-$lang.json"; ROUTES="$DATA/routes-$lang.json"
  [ -f "$STATE" ] && [ -f "$ROUTES" ] || { echo "::warning::Brak danych dla języka $lang — pomijam"; continue; }
  mkdir -p "$OUT/$lang"
  xcrun simctl terminate "$UDID" "$BUNDLE" >/dev/null 2>&1 || true
  C=$(xcrun simctl get_app_container "$UDID" "$BUNDLE" data)
  mkdir -p "$C/Library/SQLite"; rm -f "$C/Library/SQLite/trening.db" "$C/Library/SQLite/trening.db-wal" "$C/Library/SQLite/trening.db-shm"
  python3 -I -c '
import sqlite3, sys
db = sqlite3.connect(sys.argv[1])
db.execute("CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)")
db.execute("INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)", ("state", open(sys.argv[2], encoding="utf-8").read()))
db.commit(); db.close()' "$C/Library/SQLite/trening.db" "$STATE"
  xcrun simctl launch "$UDID" "$BUNDLE" >/dev/null
  sleep 10   # animacja startowa (tylko zimny start) i wczytanie danych
  i=0
  while IFS=$'\t' read -r name route; do
    i=$((i + 1))
    xcrun simctl openurl "$UDID" "trening://${route#/}"
    sleep 4
    xcrun simctl io "$UDID" screenshot "$OUT/$lang/$(printf '%02d' "$i")-$name.png" >/dev/null 2>&1
  done < <(node -e 'for (const [n, r] of JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))) console.log(n + "\t" + r)' "$ROUTES")
done
xcrun simctl terminate "$UDID" "$BUNDLE" >/dev/null 2>&1 || true
xcrun simctl status_bar "$UDID" clear >/dev/null 2>&1 || true
echo "Zrzuty: $(find "$OUT" -name '*.png' | wc -l | tr -d ' ') plików"
